/* newcaselib.js */
module.exports = function ( jq ) {
	const $ = jq;

	const apiconnector = require('../../case/mod/apiconnect.js')($);
  const util = require('../../case/mod/utilmod.js')($);
  const common = require('../../case/mod/commonlib.js')($);
	const chatman = require('./chatmanager.js')($);

  const doCreateNewCaseTitlePage = function() {
		const userdata = JSON.parse(localStorage.getItem('userdata'));
    const newcaseTitle = 'แจ้งงานใหม่';
    let newcaseTitleBox = $('<div class="title-content"></div>');
    let logoPage = $('<img src="/images/new-case-icon.png" width="40px" height="auto" style="float: left;"/>');
    $(logoPage).appendTo($(newcaseTitleBox));
    let titleText = $('<div style="float: left; margin-left: 10px; margin-top: -5px;"><h3>' + newcaseTitle + '</h3></div>');
    $(titleText).appendTo($(newcaseTitleBox));

		let readySwitchBox = $('<div id="ReadyState" style="float: right; margin-right: 4px;"></div>');
		let readyOption = {onActionCallback: ()=>{doUpdateReadyState(1);}, offActionCallback: ()=>{doUpdateReadyState(0);} };
		let readySwitch = $(readySwitchBox).readystate(readyOption);
		$(readySwitchBox).appendTo($(newcaseTitleBox));
		if (userdata.userprofiles.length > 0) {
			if (userdata.userprofiles[0].Profile.readyState == 1) {
				readySwitch.onAction();
			} else {
				readySwitch.offAction();
			}
		} else {
			readySwitch.offAction();
		}

    return $(newcaseTitleBox);
  }

	const doUpdateReadyState = async function(state) {
		$('body').loading('start');
		const userdata = JSON.parse(localStorage.getItem('userdata'));
		userdata.userprofiles[0].Profile.readyState = state;
		userdata.userprofiles[0].Profile.readyBy = 'user';
		localStorage.setItem('userdata', JSON.stringify(userdata));
		let rqParams = {data: userdata.userprofiles[0].Profile, userId: userdata.id};
		let profileRes = await common.doCallApi('/api/userprofile/update', rqParams);
		let onoffText = undefined;
		if (state==1) {
			onoffText = 'เปิด';
		} else {
			onoffText = 'ปิด';
		}
		if (profileRes.status.code == 200){
			$.notify("แจ้ง" + onoffText + "รับงานใหม่สำเร็จ", "success");
			$('body').loading('stop');
		} else {
			$.notify("แจ้ง" + onoffText + "รับงานใหม่ไม่สำเร็จ", "error");
			$('body').loading('stop');
		}
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
		$(headColumn).append('<span>Command</span>');
		$(headColumn).appendTo($(headerRow));

    return $(headerRow);
  }

	const doCreateConsultHeaderRow = function() {
    let headerRow = $('<div style="display: table-row; width: 100%;"></div>');
		let headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>Time Receive</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>Time Left</span>');
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
		$(headColumn).append('<span>Hospital</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>Command</span>');
		$(headColumn).appendTo($(headerRow));

    return $(headerRow);
  }

  function doCreateCaseItemCommand(caseItem) {
		const userdata = JSON.parse(localStorage.getItem('userdata'));
    let caseCmdBox = $('<div style="text-align: center; padding: 4px; width: 100%;"></div>');
    let acceptCmd = $('<div>Accept</div>');
    $(acceptCmd).css({'display': 'inline-block', 'margin': '3px', 'padding': '1px 5px', 'border-radius': '12px', 'cursor': 'pointer', 'background-color' : 'green', 'color': 'white'});
    $(acceptCmd).on('click', async (evt)=>{
      let response = await common.doUpdateCaseStatus(caseItem.id, 2, 'Radiologist Accept case by Web App')
			if (response.status.code == 200) {
				$('#NewCaseCmd').click();
			} else {
				alert('เกิดข้อผิดพลาด ไม่สามารถตอบรับเคสได้ในขณะนี้');
			}
    });
    $(caseCmdBox).append($(acceptCmd));

    let notAacceptCmd = $('<div>Reject</div>');
    $(notAacceptCmd).css({'display': 'inline-block', 'margin': '3px', 'padding': '1px 5px', 'border-radius': '12px', 'cursor': 'pointer', 'background-color' : 'red', 'color': 'white'});
    $(notAacceptCmd).on('click', async (evt)=>{
      let response = await common.doUpdateCaseStatus(caseItem.id, 3, 'Radiologist Reject case by Web App')
			if (response.status.code == 200) {
				$('#NewCaseCmd').click();
			} else {
				alert('เกิดข้อผิดพลาด ไม่สามารถตอบปฏิเสธเคสได้ในขณะนี้');
			}
    });
    $(caseCmdBox).append($(notAacceptCmd))

    return $(caseCmdBox);
  }

  const doCreateCaseItemRow = function(caseItem) {
    return new Promise(async function(resolve, reject) {
      let caseTask = await common.doCallApi('/api/tasks/select/'+ caseItem.id, {});
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

			let caseCMD = doCreateCaseItemCommand(caseItem);

      let caseRow = $('<div style="display: table-row; width: 100%;" class="case-row"></div>');

  		let caseColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(caseColumn).append('<span>' + casedate + ' : ' + casetime + '</span>');
  		$(caseColumn).appendTo($(caseRow));

      caseColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
      if ((caseTask.Records) && (caseTask.Records.length > 0) && (caseTask.Records[0]) && (caseTask.Records[0].triggerAt)){
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
  		$(caseColumn).append($(caseCMD));
  		$(caseColumn).appendTo($(caseRow));

      resolve($(caseRow));
    });
  }

	const doCreateConsultItemRow = function(consultItem){
		return new Promise(async function(resolve, reject) {
			let consultTask = await common.doCallApi('/api/consult/tasks/select/'+ consultItem.id, {});
			let consultDate = util.formatDateTimeStr(consultItem.createdAt);
			let consultdatetime = consultDate.split('T');
			let consultdateSegment = consultdatetime[0].split('-');
			consultdateSegment = consultdateSegment.join('');
			let consultdate = util.formatStudyDate(consultdateSegment);
			let consulttime = util.formatStudyTime(consultdatetime[1].split(':').join(''));

			let patientName = consultItem.PatientName;
			let patientHN = consultItem.PatientHN;
			let consultUG = consultItem.UGType;
      let consultHosName = consultItem.hospital.Hos_Name;

			let consultCMD = doCreateConsultItemCommand(consultItem);

      let consultRow = $('<div style="display: table-row; width: 100%;" class="case-row"></div>');

			let consultColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(consultColumn).append('<span>' + consultdate + ' : ' + consulttime + '</span>');
  		$(consultColumn).appendTo($(consultRow));

      consultColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
      if ((consultTask.Tasks) && (consultTask.Tasks.length > 0) && (consultTask.Tasks[0]) && (consultTask.Tasks[0].triggerAt)){
				console.log(consultTask.Tasks[0].triggerAt);
        let consultTriggerAt = new Date(consultTask.Tasks[0].triggerAt);
        let diffTime = Math.abs(consultTriggerAt - new Date());
        let hh = parseInt(diffTime/(1000*60*60));
        let mn = parseInt((diffTime - (hh*1000*60*60))/(1000*60));
				console.log(hh);
				console.log(mn);
        let clockCountdownDiv = $('<div></div>');
        $(clockCountdownDiv).countdownclock({countToHH: hh, countToMN: mn});
        $(consultColumn).append($(clockCountdownDiv));
      } else {
        $(consultColumn).append($('<span>not found Task</span>'));
  		}
  		$(consultColumn).appendTo($(consultRow));

      consultColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
			let ugValue = $('<span>' + consultUG + '</span>');
  		$(consultColumn).append($(ugValue));
  		$(consultColumn).appendTo($(consultRow));
			$(ugValue).load('/api/urgenttypes/urgname/select/' + consultUG);
      consultColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(consultColumn).append($('<span>' + patientHN + '</span>'));
  		$(consultColumn).appendTo($(consultRow));

      consultColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(consultColumn).append($('<span>' + patientName + '</span>'));
  		$(consultColumn).appendTo($(consultRow));

      consultColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(consultColumn).append($('<span>' + consultHosName + '</span>'));
  		$(consultColumn).appendTo($(consultRow));

      consultColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(consultColumn).append($(consultCMD));
  		$(consultColumn).appendTo($(consultRow));

      resolve($(consultRow));
		});
	}

	const doCreateConsultItemCommand = function(consultItem){
		const userdata = JSON.parse(localStorage.getItem('userdata'));
    let consultCmdBox = $('<div style="text-align: center; padding: 4px; width: 100%;"></div>');
    let acceptCmd = $('<div>Accept</div>');
    $(acceptCmd).css({'display': 'inline-block', 'margin': '3px', 'padding': '1px 5px', 'border-radius': '12px', 'cursor': 'pointer', 'background-color' : 'green', 'color': 'white'});
    $(acceptCmd).on('click', async (evt)=>{
      let response = await common.doUpdateConsultStatus(consultItem.id, 2);
			if (response.status.code == 200) {
				//$('#NewCaseCmd').click();
				let consultId = consultItem.id;
				let fakPaient = {
					Patient_HN: consultItem.patientHN,
					Patient_NameEN: consultItem.patientName,
					Patient_LastNameEN: '',
					Patient_Sex: '',
					Patient_Age: ''
				}
				let caseData = {
					casestatusId: consultItem.casestatusId,
					Case_BodyPart: '',
					patient: fakPaient
				}
				let fakeCase = {
					case: caseData
				}
				doOpenChatbox(consultId, fakeCase);
			} else {
				alert('เกิดข้อผิดพลาด ไม่สามารถตอบรับ Consult ได้ในขณะนี้');
			}
    });
    $(consultCmdBox).append($(acceptCmd));

    let notAacceptCmd = $('<div>Reject</div>');
    $(notAacceptCmd).css({'display': 'inline-block', 'margin': '3px', 'padding': '1px 5px', 'border-radius': '12px', 'cursor': 'pointer', 'background-color' : 'red', 'color': 'white'});
    $(notAacceptCmd).on('click', async (evt)=>{
      let response = await common.doUpdateConsultStatus(consultItem.id, 3);
			if (response.status.code == 200) {
				$('#NewCaseCmd').click();
			} else {
				alert('เกิดข้อผิดพลาด ไม่สามารถตอบปฏิเสธ Consult ได้ในขณะนี้');
			}
    });
    $(consultCmdBox).append($(notAacceptCmd))

    return $(consultCmdBox);
	}

  const doCallMyNewCase = function(){
    return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let userId = userdata.id;
			let rqParams = {userId: userId, statusId: common.caseReadWaitStatus};
			let apiUrl = '/api/cases/filter/radio';
			try {
				let response = await common.doCallApi(apiUrl, rqParams);
        resolve(response);
			} catch(e) {
	      reject(e);
    	}
    });
  }

	const doCallMyNewConsult = function(){
    return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let userId = userdata.id;
			let rqParams = {userId: userId, statusId: common.caseReadWaitStatus};
			let apiUrl = '/api/consult/filter/radio';
			try {
				let response = await common.doCallApi(apiUrl, rqParams);
        resolve(response);
			} catch(e) {
	      reject(e);
    	}
    });
  }

  const doCreateNewCasePage = function() {
    return new Promise(async function(resolve, reject) {
      $('body').loading('start');
      let myNewCase = await doCallMyNewCase();
			let myNewConsult = await doCallMyNewConsult();
			let myCaseViewBox = $('<div style="position: relative; width: 100%;"></div>');
			let myCaseTitleBar = $('<div style="position: relative; width: 100%;"><h3>เคสใหม่</h3></div>');
			$(myCaseViewBox).append($(myCaseTitleBar))
      let myNewCaseView = $('<div style="display: table; width: 100%; border-collapse: collapse; margin-top: -25px;"></div>');
			$(myNewCaseView).appendTo($(myCaseViewBox));
      let caseHeader = doCreateHeaderRow();
      $(myNewCaseView).append($(caseHeader));
      let caseLists = myNewCase.Records;
      if (caseLists.length > 0) {
        for (let i=0; i < caseLists.length; i++) {
          let caseItem = caseLists[i];
          let caseRow = await doCreateCaseItemRow(caseItem);
          $(myNewCaseView).append($(caseRow));
        }
      } else {
        let notFoundCaseMessage = $('<h3>ไม่พบรายการเคสใหม่ของคุณในขณะนี้</h3>')
        $(myCaseViewBox).append($(notFoundCaseMessage));
      }

			let myConsultTitleBar = $('<div style="position: relative; width: 100%;"><h3>Consult ใหม่</h3></div>');
			$(myCaseViewBox).append($(myConsultTitleBar))
			let myNewConsultView = $('<div style="display: table; width: 100%; border-collapse: collapse; margin-top: -25px;"></div>');
			$(myNewConsultView).appendTo($(myCaseViewBox));
      let consultHeader = doCreateConsultHeaderRow();
      $(myNewConsultView).append($(consultHeader));
      let consultLists = myNewConsult.Records;
      if (consultLists.length > 0) {
        for (let i=0; i < consultLists.length; i++) {
          let consultItem = consultLists[i];
          let consultRow = await doCreateConsultItemRow(consultItem);
          $(myNewConsultView ).append($(consultRow));
        }
      } else {
        let notFoundConsultMessage = $('<h3>ไม่พบรายการเคสใหม่ของคุณในขณะนี้</h3>')
        $(myCaseViewBox).append($(notFoundConsultMessage));
      }
      $('body').loading('stop');
      resolve($(myCaseViewBox));
    });
  }

	const doOpenChatbox = function(caseId, caseOpen){
		let contactToolsLine = $('<div style="width: 99%; min-height: 80px;"></div>');
		let contactContainer = chatman.doCreateContactContainer(caseId, caseOpen);
		$(contactToolsLine).append($(contactContainer));
		$(contactToolsLine).css(common.pageLineStyle);


		$(".mainfull").append($(contactToolsLine));
	}
  return {
    doCreateNewCaseTitlePage,
    doCreateHeaderRow,
    doCreateCaseItemRow,
    doCallMyNewCase,
    doCreateNewCasePage
	}
}
