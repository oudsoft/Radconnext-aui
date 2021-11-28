/* welcomelib.js */
module.exports = function ( jq ) {
	const $ = jq;

	const apiconnector = require('../../case/mod/apiconnect.js')($);
	const common = require('../../case/mod/commonlib.js')($);
	const caseCounter = require('./onrefreshtrigger.js')($);

	let newstatusCases = [];
  let accstatusCases = [];
	let newConsult = [];

	let dicomzipsync = [];

  const doCreateHomeTitlePage = function() {
    const welcomeTitle = 'ยินดีต้อนรับเข้าสู่ระบบ Rad Connext';
    let homeTitle = $('<div></div>');
    let logoPage = $('<img src="/images/home-icon.png" width="40px" height="auto" style="position: relative; display: inline-block; top: 10px;"/>');
    $(logoPage).appendTo($(homeTitle));
    let titleText = $('<div style="position: relative; display: inline-block; margin-left: 10px;"><h3>' + welcomeTitle + '</h3></div>');
    $(titleText).appendTo($(homeTitle));

		$('.case-counter, .consult-counter').hide();

    return $(homeTitle);
  }

	const doShowCaseCounter = function(){
    if (newstatusCases.length > 0) {
    	$('#NewCaseCmd').find('.NavRowTextCell').find('.case-counter').text(newstatusCases.length);
      $('#NewCaseCmd').find('.NavRowTextCell').find('.case-counter').show();
    } else {
      $('#NewCaseCmd').find('.NavRowTextCell').find('.case-counter').hide();
    }

    if (accstatusCases.length > 0) {
			$('#AcceptedCaseCmd').find('.NavRowTextCell').find('.case-counter').text(accstatusCases.length);
      $('#AcceptedCaseCmd').find('.NavRowTextCell').find('.case-counter').show();
    } else {
      $('#AcceptedCaseCmd').find('.NavRowTextCell').find('.case-counter').hide();
    }
  }

	/** Case Event Counter **/
  const onCaseChangeStatusTrigger = function(evt) {
		let triggerData = evt.detail.data;
		let caseId = triggerData.caseId;
		let statusId = triggerData.statusId;
		let thing = triggerData.thing;

    let indexAt = undefined;
    switch (Number(statusId)) {
      case 1:
        if (newstatusCases.indexOf(Number(caseId)) < 0) {
					if (thing === 'case') {
          	newstatusCases.push(caseId);
					} else if (thing === 'consult'){
						newConsult.push(caseId);
					}
        }
      break;
      case 2:
			case 8:
      case 9:
      case 13:
			case 14:
				if (thing === 'case') {
	        if (accstatusCases.indexOf(Number(caseId)) < 0) {
	          accstatusCases.push(caseId);
	        }
	        indexAt = newstatusCases.indexOf(caseId);
	        if (indexAt > -1) {
	          newstatusCases.splice(indexAt, 1);
	        }
				} else if (thing === 'consult'){
					indexAt = newConsult.indexOf(caseId);
					if (indexAt > -1) {
	          newConsult.splice(indexAt, 1);
	        }
				}
      break;
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 10:
      case 11:
      case 12:
				if (thing === 'case') {
	        indexAt = newstatusCases.indexOf(caseId);
	        if (indexAt > -1) {
	          newstatusCases.splice(indexAt, 1);
	        }
	        indexAt = accstatusCases.indexOf(caseId);
	        if (indexAt > -1) {
	          accstatusCases.splice(indexAt, 1);
	        }
				} else if (thing === 'consult'){
					indexAt = newConsult.indexOf(caseId);
					if (indexAt > -1) {
	          newConsult.splice(indexAt, 1);
	        }
				}
      break;
    }
    doShowCaseCounter();
  }

	const doLoadCaseForSetupCounter = function(userId){
		return new Promise(async function(resolve, reject) {
			let loadUrl = '/api/cases/load/list/by/status/radio';
			let rqParams = {userId: userId};
			rqParams.casestatusIds = [[1], [2, 8, 9, 13, 14]];
			/*
			rqParams.casestatusIds = [1];
			let newList = await common.doCallApi(loadUrl, rqParams);
			if (newList.status.code == 200){
			*/
			let allStatusList = await common.doCallApi(loadUrl, rqParams);
			if (allStatusList.status.code == 200){
				/*
				rqParams.casestatusIds = [2, 8, 9, 13, 14];
				let accList = await common.doCallApi(loadUrl, rqParams);
				*/
				loadUrl = '/api/consult/load/list/by/status/radio';
				rqParams = {userId: userId};
				rqParams.casestatusIds = [1];
				let newConsultList = await common.doCallApi(loadUrl, rqParams);
				resolve({newList: allStatusList.Records[0], accList:allStatusList.Records[1], newConsultList});
			} else 	if (allStatusList.status.code == 210) {
				reject({error: {code: 210, cause: 'Token Expired!'}});
			} else {
				let apiError = 'api error at /api/cases/load/list/by/status/radio';
				console.log(apiError);
				reject({error: apiError});
			}
		});
	}

	const doSetupCounter = function() {
		return new Promise(async function(resolve, reject) {
			$('body').loading('start');
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let userId = userdata.id;
			doLoadCaseForSetupCounter(userId).then(async (myList)=>{

				newstatusCases = [];
			  accstatusCases = [];

				newConsult = [];

				dicomzipsync = [];

				await myList.newList.Records.forEach((item, i) => {
					newstatusCases.push(Number(item.id));
				});
				await myList.accList.Records.forEach((item, i) => {
					accstatusCases.push(Number(item.id));
					let newDicomZipSync = {caseId: item.id, studyID: item.Case_OrthancStudyID};
					dicomzipsync.push(newDicomZipSync);
				});
				myList.newConsultList.Records.forEach((item, i) => {
					newConsult.push(Number(item.id));
				});
				localStorage.setItem('dicomzipsync', JSON.stringify(dicomzipsync));
				caseCounter.doShowCaseCounter(newstatusCases, accstatusCases, newConsult);
				$('body').loading('stop');
				resolve();
			}).catch((err)=>{
				reject(err);
			});
		});
	}
	/** Case event Counter **/

	/** Zoom Calle Event **/
	const doInterruptZoomCallEvt = function(evt) {
		$('body').loading('start');
		const main = require('../main.js');
		let userConfirm = confirm('คุณมีสายเรียกเข้าเพื่อ Conference ทาง Zoom\nคลิก ตกลง หรือ OK เพื่อรับสายและเปิด Zoom Conference หรือ คลิก ยกเลิก หรือ Cancel เพื่อปฏิเสธการรับสาย');
		let myWsm = main.doGetWsm();
		if (userConfirm) {
			let callData = evt.detail.data;
			alert('Password ในการเข้าร่วม Conference ของคุณคิอ ' + callData.password + '\n');
			window.open(callData.openurl, '_blank');
			//Say yes back to caller
			let callZoomMsg = {type: 'callzoomback', sendTo: callData.sender, result: 1};
			myWsm.send(JSON.stringify(callZoomMsg));
			$('body').loading('stop');
		} else {
			//Say no back to caller
			let callZoomMsg = {type: 'callzoomback', sendTo: callData.sender, result: 0};
			myWsm.send(JSON.stringify(callZoomMsg));
			$('body').loading('stop');
		}
	}

  return {
		/*
		newstatusCases,
	  accstatusCases,
		*/

		doCreateHomeTitlePage,
		onCaseChangeStatusTrigger,
		doSetupCounter
	}
}
