/* acccaselib.js */
module.exports = function ( jq ) {
	const $ = jq;

	const apiconnector = require('../../case/mod/apiconnect.js')($);
  const util = require('../../case/mod/utilmod.js')($);
  const common = require('../../case/mod/commonlib.js')($);

  const doCreateAccCaseTitlePage = function() {
    const acccaseTitle = 'เคสใหม่';
    let acccaseTitleBox = $('<div class="title-content"></div>');
    let logoPage = $('<img src="/images/case-accepted-icon-1.png" width="40px" height="auto" style="float: left;"/>');
    $(logoPage).appendTo($(acccaseTitleBox));
    let titleText = $('<div style="float: left; margin-left: 10px; margin-top: -5px;"><h3>' + acccaseTitle + '</h3></div>');
    $(titleText).appendTo($(acccaseTitleBox));
    return $(acccaseTitleBox);
  }

  const doCreateHeaderRow = function() {
    let headerRow = $('<div style="display: table-row; width: 100%;"></div>');
		let headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>Time Receive</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>Time Left</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>Scan Part</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>Urgent</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>HN</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>Name</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>Sex/Age</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>Hospital</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>Status</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>Process</span>');
		$(headColumn).appendTo($(headerRow));

    return $(headerRow);
  }

  function doCreateCaseItemCommand(caseItem) {
    const main = require('../main.js');
    let userdata = JSON.parse(main.doGetUserData());
    let caseCmdBox = $('<div style="text-align: center; padding: 4px;"></div>');
    let openCmd = $('<div>อ่านผล</div>');
    $(openCmd).css({'display': 'inline-block', 'margin': '3px', 'padding': '5px 12px', 'border-radius': '12px', 'cursor': 'pointer', 'color': 'white'});
		if (caseItem.casestatusId == 2) {
			$(openCmd).css({'background-color' : 'orange'});
		} else {
			$(openCmd).css({'background-color' : 'green'});
		}
    $(openCmd).on('click', async (evt)=>{
			if (caseItem.casestatusId == 2) {
	      let response = await common.doUpdateCaseStatus(caseItem.id, 8, 'Radiologist Open accepted case by Web App');
				if (response.status.code == 200) {
		      let eventData = {caseId: caseItem.id};
		      $(openCmd).trigger('opencase', [eventData]);
				} else {
					alert('เกิดข้อผิดพลาด ไม่สามารถอัพเดทสถานะเคสได้ในขณะนี้');
				}
			} else {
				let eventData = {caseId: caseItem.id};
	      $(openCmd).trigger('opencase', [eventData]);
			}
    });
    $(caseCmdBox).append($(openCmd));

    return $(caseCmdBox);
  }

  const doCreateCaseItemRow = function(caseItem) {
    return new Promise(async function(resolve, reject) {
			console.log(caseItem);
      let caseTask = await common.doCallApi('/api/tasks/select/'+ caseItem.id, {});
			console.log(caseTask);
			let caseDate = util.formatDateTimeStr(caseItem.createdAt);
			let casedatetime = caseDate.split('T');
			let casedateSegment = casedatetime[0].split('-');
			casedateSegment = casedateSegment.join('');
			let casedate = util.formatStudyDate(casedateSegment);
			let casetime = util.formatStudyTime(casedatetime[1].split(':').join(''));
			let patientName = caseItem.patient.Patient_NameEN + ' ' + caseItem.patient.Patient_LastNameEN;
			let patientSA = caseItem.patient.Patient_Sex + '/' + caseItem.patient.Patient_Age;
			let patientHN = caseItem.patient.Patient_HN;
			let caseScanparts = caseItem.Case_ScanPart;
			let yourSelectScanpartContent = $('<div></div>');
			if ((caseScanparts) && (caseScanparts.length > 0)) {
				yourSelectScanpartContent = await common.doRenderScanpartSelectedAbs(caseScanparts);
			}
			let caseUG = caseItem.urgenttype.UGType_Name;
      let caseHosName = caseItem.hospital.Hos_Name;
      let caseSTA = caseItem.casestatus.CS_Name_EN;

			let caseCMD = doCreateCaseItemCommand(caseItem);

      let caseRow = $('<div style="display: table-row; width: 100%;" class="case-row"></div>');

  		let caseColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(caseColumn).append('<span>' + casedate + ' : ' + casetime + '</span>');
  		$(caseColumn).appendTo($(caseRow));

      caseColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
      if ((caseTask.Records) && (caseTask.Records.length > 0) && (caseTask.Records[0].triggerAt)){
        let caseTriggerAt = new Date(caseTask.Records[0].triggerAt);
        let diffTime = Math.abs(caseTriggerAt - new Date());
        let hh = parseInt(diffTime/(1000*60*60));
        let mn = parseInt((diffTime - (hh*1000*60*60))/(1000*60));
        let clockCountdownDiv = $('<div></div>');
        $(clockCountdownDiv).countdownclock({countToHH: hh, countToMN: mn});
        $(caseColumn).append($(clockCountdownDiv));
      } else {
        $(caseColumn).append($('<span>not found Task</span>'));
  		}
  		$(caseColumn).appendTo($(caseRow));

      caseColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(caseColumn).append($(yourSelectScanpartContent));
  		$(caseColumn).appendTo($(caseRow));

      caseColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(caseColumn).append($('<span>' + caseUG + '</span>'));
  		$(caseColumn).appendTo($(caseRow));

      caseColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(caseColumn).append($('<span>' + patientHN + '</span>'));
  		$(caseColumn).appendTo($(caseRow));

      caseColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(caseColumn).append($('<span>' + patientName + '</span>'));
  		$(caseColumn).appendTo($(caseRow));

      caseColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(caseColumn).append($('<span>' + patientSA + '</span>'));
  		$(caseColumn).appendTo($(caseRow));

      caseColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(caseColumn).append($('<span>' + caseHosName + '</span>'));
  		$(caseColumn).appendTo($(caseRow));

      caseColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(caseColumn).append($('<span>' + caseSTA + '</span>'));
  		$(caseColumn).appendTo($(caseRow));

      caseColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(caseColumn).append($(caseCMD));
  		$(caseColumn).appendTo($(caseRow));

      resolve($(caseRow));
    });
  }

  const doCallMyAccCase = function(){
    return new Promise(async function(resolve, reject) {
      const main = require('../main.js');
			let userdata = JSON.parse(main.doGetUserData());
			let userId = userdata.id;
			let rqParams = {userId: userId, statusId: common.caseResultWaitStatus};
			let apiUrl = '/api/cases/filter/radio';
			try {
				let response = await common.doCallApi(apiUrl, rqParams);
        resolve(response);
			} catch(e) {
	      reject(e);
    	}
    });
  }

  const doCreateAccCasePage = function() {
    return new Promise(async function(resolve, reject) {
      $('body').loading('start');
      let myAccCase = await doCallMyAccCase();
      let myAccCaseView = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');
      let caseHearder = doCreateHeaderRow();
      $(myAccCaseView).append($(caseHearder));
      let caseLists = myAccCase.Records;
      if (caseLists.length > 0) {
        for (let i=0; i < caseLists.length; i++) {
          let caseItem = caseLists[i];
          let caseRow = await doCreateCaseItemRow(caseItem);
          $(myAccCaseView).append($(caseRow));
        }
      } else {
        let notFoundMessage = $('<h3>ไม่พบรายการเคสใหม่ของคุณในขณะนี้</h3>')
        $(myAccCaseView).append($(notFoundMessage));
      }
      resolve($(myAccCaseView));
      $('body').loading('stop');
    });
  }

  return {
    doCreateAccCaseTitlePage,
    doCreateHeaderRow,
    doCreateCaseItemRow,
    doCallMyAccCase,
    doCreateAccCasePage
	}
}
