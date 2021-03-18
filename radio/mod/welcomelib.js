/* welcomelib.js */
module.exports = function ( jq ) {
	const $ = jq;

	const apiconnector = require('../../case/mod/apiconnect.js')($);
	const common = require('../../case/mod/commonlib.js')($);
	const caseCounter = require('./onrefreshtrigger.js')($);

	let newstatusCases = [];
  let accstatusCases = [];
	let newConsult = [];

  const doCreateHomeTitlePage = function() {
    const welcomeTitle = 'ยินดีต้อนรับเข้าสู่ระบบ Rad Connext';
    let homeTitle = $('<div class="title-content"></div>');
    let logoPage = $('<img src="/images/home-icon.png" width="40px" height="auto" style="float: left;"/>');
    $(logoPage).appendTo($(homeTitle));
    let titleText = $('<div style="float: left; margin-left: 10px; margin-top: -5px;"><h3>' + welcomeTitle + '</h3></div>');
    $(titleText).appendTo($(homeTitle));
    return $(homeTitle);
  }

	const doShowCaseCounter = function(){
    $('#NewCaseCmd').find('.NavRowTextCell').find('.case-counter').text('(' + newstatusCases.length + ')');
    if (newstatusCases.length > 0) {
      $('#NewCaseCmd').find('.NavRowTextCell').find('.case-counter').css({'color': 'red'});
    } else {
      $('#NewCaseCmd').find('.NavRowTextCell').find('.case-counter').css({'color': 'white'});
    }
    $('#AcceptedCaseCmd').find('.NavRowTextCell').find('.case-counter').text('(' + accstatusCases.length + ')');
    if (accstatusCases.length > 0) {
      $('#AcceptedCaseCmd').find('.NavRowTextCell').find('.case-counter').css({'color': 'red'});
    } else {
      $('#AcceptedCaseCmd').find('.NavRowTextCell').find('.case-counter').css({'color': 'white'});
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
			rqParams.casestatusIds = [1];
			let newList = await common.doCallApi(loadUrl, rqParams);
			rqParams.casestatusIds = [2, 8, 9, 13, 14];
			let accList = await common.doCallApi(loadUrl, rqParams);
			loadUrl = '/api/consult/load/list/by/status/radio';
			rqParams = {userId: userId};
			rqParams.casestatusIds = [1];
			let newConsultList = await common.doCallApi(loadUrl, rqParams);
			resolve({newList, accList, newConsultList});
		});
	}

	const doSetupCounter = function() {
		return new Promise(async function(resolve, reject) {
			$('body').loading('start');
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let userId = userdata.id;
			let myList = await doLoadCaseForSetupCounter(userId);

			newstatusCases = [];
		  accstatusCases = [];

			newConsult = [];

			await myList.newList.Records.forEach((item, i) => {
				newstatusCases.push(Number(item.id));
			});
			await myList.accList.Records.forEach((item, i) => {
				accstatusCases.push(Number(item.id));
			});
			myList.newConsultList.Records.forEach((item, i) => {
				newConsult.push(Number(item.id));
			});
			caseCounter.doShowCaseCounter(newstatusCases, accstatusCases, newConsult);
			$('body').loading('stop');
			resolve();
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
