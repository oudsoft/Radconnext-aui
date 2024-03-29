/* acccaselib.js */
module.exports = function ( jq ) {
	const $ = jq;

	const apiconnector = require('../../case/mod/apiconnect.js')($);
  const util = require('../../case/mod/utilmod.js')($);
  const common = require('../../case/mod/commonlib.js')($);

  const doCreateAccCaseTitlePage = function() {
    const acccaseTitle = 'เคสรออ่าน';
    let acccaseTitleBox = $('<div></div>');
    let logoPage = $('<img src="/images/case-incident-icon-2.png" width="40px" height="auto" style="position: relative; display: inline-block; top: 10px;"/>');
    $(logoPage).appendTo($(acccaseTitleBox));
    let titleText = $('<div style="position: relative; display: inline-block; margin-left: 10px;"><h3>' + acccaseTitle + '</h3></div>');
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

  const doCreateCaseItemCommand = function (caseItem) {
		//let caseItem = incident.case;
    let userdata = JSON.parse(localStorage.getItem('userdata'));
    let caseCmdBox = $('<div style="text-align: center; padding: 4px;"></div>');
		let openCmdText = undefined;
		if (caseItem.casestatusId == 14) {
			openCmdText = 'ตอบข้อความ';
		} else {
			openCmdText = 'อ่านผล';
		}
    let openCmd = $('<div id="OpenCaseCmd"></div>').text(openCmdText);
    $(openCmd).css({'display': 'inline-block', 'margin': '3px', 'padding': '5px 12px', 'border-radius': '12px', 'cursor': 'pointer', 'color': 'white'});
		if (caseItem.casestatusId == 2) {
			$(openCmd).css({'background-color' : 'orange'});
		} else {
			$(openCmd).css({'background-color' : 'green'});
		}
    $(openCmd).on('click', async (evt)=>{
			let eventData = common.doCreateOpenCaseData(caseItem);
			let currentCaseRes = await common.doGetApi('/api/cases/status/' + caseItem.id, {});
			if (currentCaseRes.current == 2){

				let nextCaseStatus = 8;
				let radioName = userdata.userinfo.User_NameTH + ' ' + userdata.userinfo.User_LastNameTH;
				let actionRemark = 'รังสีแพทย์ ' + radioName + ' เปิดเคสสำเร็จ [web]'
	      let response = await common.doUpdateCaseStatus(caseItem.id, nextCaseStatus, actionRemark);
				if (response.status.code == 200) {
		      eventData.statusId = nextCaseStatus;
					eventData.startDownload = 0;
		      $(openCmd).trigger('opencase', [eventData]);
				} else {
					$.notify('เกิดข้อผิดพลาด ไม่สามารถอัพเดทสถานะเคสได้ในขณะนี้', 'error');
				}

			} else if ((currentCaseRes.current == 8) || (currentCaseRes.current == 9) || (currentCaseRes.current == 14)){
				eventData.statusId = caseItem.casestatusId;
				eventData.startDownload = 0;
	      $(openCmd).trigger('opencase', [eventData]);
			} else {
				$.notify('ขออภัย เคสไม่อยู่ในสถานะที่จะพิมพ์ผลอ่านแล้ว', 'error');
				//refresh page
			}
    });
    $(caseCmdBox).append($(openCmd));

    return $(caseCmdBox);
  }

  const doCreateCaseItemRow = function(incident, caseTask) {
    return new Promise(async function(resolve, reject) {
			let caseItem = incident.case;
			let caseDate = util.formatDateTimeStr(caseItem.createdAt);
			let casedatetime = caseDate.split(' ');
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
			//let caseUG = caseItem.urgenttype.UGType_Name;
			let caseUG = caseItem.sumase.UGType_Name;
      let caseHosName = caseItem.hospital.Hos_Name;
      let caseSTA = caseItem.casestatus.CS_Name_EN;

			let caseCMD = doCreateCaseItemCommand(caseItem);

      let caseRow = $('<div style="display: table-row; width: 100%;" class="case-row"></div>');
			$(caseRow).css({'cursor': 'pointer'});
			$(caseRow).on('dblclick', async (evt)=>{
				let nextCaseStatus = 8;
				if (caseItem.casestatusId == 2){
					let radioName = userdata.userinfo.User_NameTH + ' ' + userdata.userinfo.User_LastNameTH;
					let actionRemark = 'รังสีแพทย์ ' + radioName + ' เปิดเคสสำเร็จ [web]'
					let response = await common.doUpdateCaseStatus(caseItem.id, nextCaseStatus, actionRemark);
				}
				let eventData = common.doCreateOpenCaseData(caseItem);
				eventData.statusId = nextCaseStatus;
				eventData.startDownload = 1;
				$(caseCMD).trigger('opencase', [eventData]);
			});
  		let caseColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(caseColumn).append('<span>' + casedate + ' : ' + casetime + '</span>');
  		$(caseColumn).appendTo($(caseRow));

      caseColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
			if (caseItem.casestatusId != 9) {
	      if ((caseTask) && (caseTask.triggerAt)){
					let now = new Date();
					console.log(now);
					console.log(caseTask.triggerAt);
	        let caseTriggerAt = new Date(caseTask.triggerAt);
					//caseTriggerAt.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
					//caseTriggerAt = new Date(caseTriggerAt.getTime() + (3600000 * 1));
					caseTriggerAt = new Date(caseTriggerAt.getTime());
	        console.log(caseTriggerAt);
					let diffTime = caseTriggerAt.getTime() - now.getTime();
	        let hh = parseInt(diffTime/(1000*60*60));
	        let mn = parseInt((diffTime - (hh*1000*60*60))/(1000*60));
					console.log(hh, mn);
	        let clockCountdownDiv = $('<div></div>').css({'width': '100%', 'text-align': 'center'});
	        $(clockCountdownDiv).countdownclock({countToHH: hh, countToMN: mn});
	        $(caseColumn).append($(clockCountdownDiv));
					let totalMinus = (hh*60) + mn;
					if (totalMinus < 30){
						$(clockCountdownDiv).css({'background-color': '#8532EF', 'color': 'white'});
					} else if (totalMinus < 60){
						$(clockCountdownDiv).css({'background-color': '#EF3232', 'color': 'white'});
					} else if (totalMinus < 240){
						$(clockCountdownDiv).css({'background-color': '#FF5733', 'color': 'white'});
					} else if (totalMinus < 1440){
						$(clockCountdownDiv).css({'background-color': '#F79C06', 'color': 'white'});
					} else {
						$(clockCountdownDiv).css({'background-color': '#177102 ', 'color': 'white'});
					}
	      } else {
	        //$(caseColumn).append($('<span>not found Task</span>'));
					$(caseColumn).append($('<span style="color: red;">-</span>'));
					//console.error('not found Task');
	  		}
			} else {
				$(caseColumn).append($('<span>-</span>'));
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
			/*
			let eventName = 'triggercounter'
			let triggerData = {caseId : caseItem.id, statusId: 7, thing: 'case'};
			let event = new CustomEvent(eventName, {"detail": {eventname: eventName, data: triggerData}});
			document.dispatchEvent(event);
			resolve();
			*/
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
				let response = await apiconnector.doCallApiDirect(apiUrl, rqParams);
				//let response = await common.doCallApi(apiUrl, rqParams);
        resolve(response);
			} catch(e) {
	      reject(e);
    	}
    });
  }

	const doCallMyTasksCase = function(){
    return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let userId = userdata.id;
			let username = userdata.username;
			let rqParams = {userId: userId, username: username, statusId: common.caseReadWaitStatus};
			let apiUrl = '/api/tasks/filter/radio/' + userId;
			try {
				let response = await apiconnector.doCallApiDirect(apiUrl, rqParams);
				//let response = await common.doCallApi(apiUrl, rqParams);
        resolve(response);
			} catch(e) {
	      reject(e);
    	}
    });
  }

	const doFindTaksOfCase = function(tasks, caseId){
		return new Promise(async function(resolve, reject) {
			if ((tasks) && (tasks.length > 0)){
				let task = await tasks.find((item)=>{
					if (Number(item.caseId) === Number(caseId)) return item;
				});
				resolve(task);
			} else {
				resolve();
			}
		});
	}

  const doCreateAccCasePage = function() {
    return new Promise(async function(resolve, reject) {
      //$('body').loading('start');
      let myAccCase = await doCallMyAccCase();
			let myTaksCase = await doCallMyTasksCase();
			if (myAccCase.status.code == 200){
	      let myAccCaseView = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');
	      let caseHearder = doCreateHeaderRow();
	      $(myAccCaseView).append($(caseHearder));
	      let caseLists = myAccCase.Records;
	      if (caseLists.length > 0) {
	        for (let i=0; i < caseLists.length; i++) {
	          let caseItem = caseLists[i];
						//console.log(myTaksCase);
						let task = await doFindTaksOfCase(myTaksCase.Records, caseItem.case.id);
		        let caseRow = await doCreateCaseItemRow(caseItem, task);
						if (caseRow){
	          	$(myAccCaseView).append($(caseRow));
						}
	        }
					$('#AcceptedCaseCmd').find('.NavRowTextCell').find('.case-counter').text(caseLists.length);
					$('#AcceptedCaseCmd').find('.NavRowTextCell').find('.case-counter').show();
	      } else {
	        let notFoundMessage = $('<h3>ไม่พบรายการเคสใหม่ของคุณในขณะนี้</h3>')
	        $(myAccCaseView).append($(notFoundMessage));
					$('#AcceptedCaseCmd').find('.NavRowTextCell').find('.case-counter').hide();
	      }
	      resolve($(myAccCaseView));
	      //$('body').loading('stop');
			} else if (myAccCase.status.code == 210){
				reject({error: {code: 210, cause: 'Token Expired!'}});
			} else {
				let apiError = 'api error at doCallMyAccCase';
				console.log(apiError);
				reject({error: apiError});
			}
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
