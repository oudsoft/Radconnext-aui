/* casecounter.js */
module.exports = function ( jq ) {
	const $ = jq;

  let newstatusCases = [];
  let accstatusCases = [];
	let sucstatusCases = [];
	let negstatusCases = [];

	let newstatusConsult = [];

	const apiconnector = require('./apiconnect.js')($);
	const common = require('./commonlib.js')($);

  const getNewstatusCases = function(){
    return newstatusCases;
  }

  const setNewstatusCases = function(value){
    newstatusCases = value;
  }

  const getAccstatusCases = function(){
    return accstatusCases;
  }

  const setAccstatusCases = function(value){
    accstatusCases = value;
  }

  const getSucstatusCases = function(){
    return sucstatusCases;
  }

  const setSucstatusCases = function(value){
    sucstatusCases = value;
  }

  const getNegstatusCases = function(){
    return negstatusCases;
  }

  const setNegstatusCases = function(value){
    negstatusCases = value;
  }

	const getNewStatusConsult = function(){
		return newstatusConsult;
	}

	const setNewStatusConsult = function(value){
		newstatusConsult = value;
	}

  const doShowCaseCounter = function(){
    $('#NewStatusSubCmd').find('.NavSubTextCell').find('.case-counter').text('(' + newstatusCases.length + ')');
    if (newstatusCases.length > 0) {
      $('#NewStatusSubCmd').find('.NavSubTextCell').find('.case-counter').css({'color': 'red'});
    } else {
      $('#NewStatusSubCmd').find('.NavSubTextCell').find('.case-counter').css({'color': 'white'});
    }
    $('#AcceptedStatusSubCmd').find('.NavSubTextCell').find('.case-counter').text('(' + accstatusCases.length + ')');
    if (accstatusCases.length > 0) {
      $('#AcceptedStatusSubCmd').find('.NavSubTextCell').find('.case-counter').css({'color': 'red'});
    } else {
      $('#AcceptedStatusSubCmd').find('.NavSubTextCell').find('.case-counter').css({'color': 'white'});
    }
    $('#SuccessStatusSubCmd').find('.NavSubTextCell').find('.case-counter').text('(' + sucstatusCases.length + ')');
    if (sucstatusCases.length > 0) {
      $('#SuccessStatusSubCmd').find('.NavSubTextCell').find('.case-counter').css({'color': 'red'});
    } else {
      $('#SuccessStatusSubCmd').find('.NavSubTextCell').find('.case-counter').css({'color': 'white'});
    }
    $('#NegativeStatusSubCmd').find('.NavSubTextCell').find('.case-counter').text('(' + negstatusCases.length + ')');
    if (negstatusCases.length > 0) {
      $('#NegativeStatusSubCmd').find('.NavSubTextCell').find('.case-counter').css({'color': 'red'});
    } else {
      $('#NegativeStatusSubCmd').find('.NavSubTextCell').find('.case-counter').css({'color': 'white'});
    }

		$('#MyConsultSubCmd').find('.NavSubTextCell').find('.consult-counter').text('(' + newstatusConsult.length + ')');
    if (newstatusConsult.length > 0) {
      $('#MyConsultSubCmd').find('.NavSubTextCell').find('.consult-counter').css({'color': 'red'});
    } else {
      $('#MyConsultSubCmd').find('.NavSubTextCell').find('.consult-counter').css({'color': 'white'});
    }
  }

  const doLoadCaseForSetupCounter = function(userId){
		return new Promise(async function(resolve, reject) {
			let loadUrl = '/api/cases/load/list/by/status/owner';
			let rqParams = {userId: userId};
			rqParams.casestatusIds = [1];
			let newList = await common.doCallApi(loadUrl, rqParams);
			rqParams.casestatusIds = [2, 8, 9];
			let accList = await common.doCallApi(loadUrl, rqParams);
      rqParams.casestatusIds = [5, 10, 11, 12, 13, 14];
			let sucList = await common.doCallApi(loadUrl, rqParams);
      rqParams.casestatusIds = [3, 4, 7];
			let negList = await common.doCallApi(loadUrl, rqParams);

			loadUrl = '/api/consult/load/list/by/status/owner';
			rqParams = {userId: userId};
			rqParams.casestatusIds = [1, 2];
			let newConsultList = await common.doCallApi(loadUrl, rqParams);
			resolve({newList, accList, sucList, negList, newConsultList});
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
      sucstatusCases = [];
    	negstatusCases = [];

			newstatusConsult = [];

			await myList.newList.Records.forEach((item, i) => {
				newstatusCases.push(Number(item.id));
			});
			await myList.accList.Records.forEach((item, i) => {
				accstatusCases.push(Number(item.id));
			});
      await myList.sucList.Records.forEach((item, i) => {
				sucstatusCases.push(Number(item.id));
			});
      await myList.negList.Records.forEach((item, i) => {
				negstatusCases.push(Number(item.id));
			});

			await myList.newConsultList.Records.forEach((item, i) => {
				newstatusConsult.push(Number(item.id));
			});

			doShowCaseCounter();
			$('body').loading('stop');
			resolve();
		});
	}

  const onCaseChangeStatusTrigger = function(evt){
    let trigerData = evt.detail.data;
		let caseId = trigerData.caseId;
		let statusId = trigerData.statusId;
    let indexAt =undefined;
    switch (Number(statusId)) {
      case 1:
        if (newstatusCases.indexOf(Number(caseId)) < 0) {
          newstatusCases.push(caseId);
        }
      break;
      case 2:
			case 8:
      case 9:
        if (accstatusCases.indexOf(Number(caseId)) < 0) {
          accstatusCases.push(caseId);
        }
        indexAt = newstatusCases.indexOf(caseId);
        if (indexAt > -1) {
          newstatusCases.splice(indexAt, 1);
        }
      break;
      case 5:
      case 6:
      case 10:
      case 11:
      case 12:
      case 13:
			case 14:
        if (sucstatusCases.indexOf(Number(caseId)) < 0) {
          sucstatusCases.push(caseId);
        }
        indexAt = accstatusCases.indexOf(caseId);
        if (indexAt > -1) {
          accstatusCases.splice(indexAt, 1);
        }
      break;

      case 3:
      case 4:
      case 7:
        if (negstatusCases.indexOf(Number(caseId)) < 0) {
          negstatusCases.push(caseId);
        }
        indexAt = newstatusCases.indexOf(caseId);
        if (indexAt > -1) {
          newstatusCases.splice(indexAt, 1);
        }
        indexAt = accstatusCases.indexOf(caseId);
        if (indexAt > -1) {
          accstatusCases.splice(indexAt, 1);
        }
        indexAt = sucstatusCases.indexOf(caseId);
        if (indexAt > -1) {
          sucstatusCases.splice(indexAt, 1);
        }
      break;
    }
    doShowCaseCounter();
  }

	const onConsultChangeStatusTrigger = function(evt){
    let trigerData = evt.detail.data;
		let caseId = trigerData.caseId;
		let statusId = trigerData.statusId;
    let indexAt =undefined;
		switch (Number(statusId)) {
      case 1:
      case 2:
        if (newstatusConsult.indexOf(Number(caseId)) < 0) {
          newstatusConsult.push(caseId);
        }
      break;
			case 3:
      case 6:
				indexAt = newstatusConsult.indexOf(caseId);
        if (indexAt > -1) {
          newstatusConsult.splice(indexAt, 1);
        }
      break;
		}
		doShowCaseCounter();
  }

  return {
    getNewstatusCases,
    setNewstatusCases,
    getAccstatusCases,
    setAccstatusCases,
    getSucstatusCases,
    setSucstatusCases,
    getNegstatusCases,
    setNegstatusCases,

    doLoadCaseForSetupCounter,
    doSetupCounter,

    doShowCaseCounter,

    onCaseChangeStatusTrigger,
		onConsultChangeStatusTrigger
	}
}
