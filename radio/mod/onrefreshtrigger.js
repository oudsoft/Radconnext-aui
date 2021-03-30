/* onrefreshtrigger.js */
module.exports = function ( jq ) {
	const $ = jq;

  const doShowCaseCounter = function(newstatusCases, accstatusCases, newConsult){
		let allNewIntend = newstatusCases.length + newConsult.length;
    $('#NewCaseCmd').find('.NavRowTextCell').find('.case-counter').text('(' + allNewIntend + ')');
    if (allNewIntend > 0) {
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

	/*
  const onTrigger = function(caseId, statusId) {
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
      case 13:
			case 14:
        if (accstatusCases.indexOf(Number(caseId)) < 0) {
          accstatusCases.push(caseId);
        }
        indexAt = newstatusCases.indexOf(caseId);
        if (indexAt > -1) {
          newstatusCases.splice(indexAt, 1);
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
        indexAt = newstatusCases.indexOf(caseId);
        if (indexAt > -1) {
          newstatusCases.splice(indexAt, 1);
        }
        indexAt = accstatusCases.indexOf(caseId);
        if (indexAt > -1) {
          accstatusCases.splice(indexAt, 1);
        }
      break;
    }
    doShowCaseCounter();
  }
	*/

  return {
    //onTrigger,
    doShowCaseCounter
	}
}
