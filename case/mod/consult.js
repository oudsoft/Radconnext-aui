/*consult.js*/
module.exports = function ( jq ) {
	const $ = jq;

	const apiconnector = require('../../case/mod/apiconnect.js')($);
  const util = require('./utilmod.js')($);
  const common = require('./commonlib.js')($);

	const pageFontStyle = {"font-family": "THSarabunNew", "font-size": "24px"};

	const doGenUniqueID = function () {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + '-' + s4() + '-' + s4();
	}

  const doCreateNewConsultTitleForm = function(){
    let pageLogoBox = $('<div style="position: relative; display: inline-block;"></div>');
    let logoPage = $('<img src="/images/chat-icon.png" width="40px" height="auto"/>');
    $(logoPage).appendTo($(pageLogoBox));
    let titleBox = $('<div class="title-content"></div>');
    let titleText = $('<h3 style="position: relative; display: inline-block; margin-left: 10px; top: -10px;">สร้าง Consult ใหม่</h3>')
    $(titleBox).append($(pageLogoBox)).append($(titleText));
    return $(titleBox);
  }

  const doCreatePatientBox = function(){
    let patientBox = $('<div id ="PatientBox" style="display: table; width: 100%; border-collapse: collapse;"></div>');
    let patientHNLine = $('<div style="display: table-row; width: 100%;"></div>');
		let patientNameLine = $('<div style="display: table-row; width: 100%;"></div>');

    let hnLabelCell = $('<div style="display: table-cell; padding: 4px;">HN ผู้ป่วย</div>');
    let hnValueCell = $('<div style="display: table-cell; padding: 4px;"></div>');
    let hnValue = $('<input type="text" id="HNValue"/>');

    let nameLabelCell = $('<div style="display: table-cell; padding: 4px;">ชื่อผู้ป่วย</div>');
    let nameValueCell = $('<div style="display: table-cell; padding: 4px;"></div>');
    let nameValue = $('<input type="text" id="NameValue"/>');

    $(hnValueCell).append($(hnValue));
    $(nameValueCell).append($(nameValue));
    $(patientHNLine).append($(hnLabelCell)).append($(hnValueCell));
		$(patientNameLine).append($(nameLabelCell)).append($(nameValueCell));

    $(patientBox).append($(patientHNLine)).append($(patientNameLine));
    return $(patientBox);
  }

  const doCreatePatientHistoryLine = function(formWrapper){
    const phProp = {
			attachFileUploadApiUrl: '/api/uploadpatienthistory',
			scannerUploadApiUrl: '/api/scannerupload',
			captureUploadApiUrl: '/api/captureupload',
			attachFileUploadIconUrl: '/images/attach-icon.png',
			scannerUploadIconUrl: '/images/scanner-icon.png',
			captureUploadIconUrl: '/images/screen-capture-icon.png'
		};

    let patientHistoryLine = $('<div style="display: table-row; width: 100%;"></div>');
    let patientHistoryLabelCell = $('<div style="display: table-cell; padding: 4px; vertical-align: middle;">ประวัติผู้ป่วย</div>');
    let patientHistoryValueCell = $('<div style="display: table-cell; padding: 4px; text-align: left;"></div>');

    let patientHistory = $('<div id="PatientHistoryBox"></div>').appendTo($(patientHistoryValueCell)).imagehistory( phProp ).data("custom-imagehistory");

    $(patientHistoryLine).append($(patientHistoryLabelCell)).append($(patientHistoryValueCell));
    $(formWrapper).append($(patientHistoryLine));

    return patientHistory;
  }

  const doCreateConsultUrgentLine = function(formWrapper){
    let urgentLine = $('<div style="display: table-row; width: 100%;"></div>');
    let urgentLabelCell = $('<div style="display: table-cell; padding: 4px;">กำหนดเวลาตอบรับ Consult</div>');
    let urgentValueCell = $('<div style="display: table-cell; padding: 4px;"></div>');

    let openUrgentCmd = $('<input id="OpenUrgentCmd" type="button" value=" กำหนดเวลาตอบรับ "/>');
    $(openUrgentCmd).data('modecontrol', {mode: 'new'});
    $(openUrgentCmd).on('click', (evt)=>{
      let urgentFormHandle = doOpenUgentPopup(urgentValueCell, openUrgentCmd);
    });
    $(openUrgentCmd).appendTo($(urgentValueCell));

    $(urgentLine).append($(urgentLabelCell)).append($(urgentValueCell));
    $(formWrapper).append($(urgentLine));

    return openUrgentCmd;
  }

  const doCalNewTime = function(dd, hh, mn) {
    let totalShiftTime = (dd * 24 * 60 * 60 * 1000) + (hh * 60 * 60 * 1000) + (mn * 60 * 1000);
    let atDate = new Date();
    let atTime = atDate.getTime() + totalShiftTime;
    return atTime;
  }

  const doOpenUgentPopup = function(place, btnCmd, ougData){
    let customurgent = undefined;
    let customurgentSettings = {
      urgentWord: "ตอบรับ Consult",
      urgentOf: "Consult",
      useWorkingStep: false,
      externalStyle:  pageFontStyle,
      successCallback: async function(ugData) {
        //let newTime = doCalNewTime((Number(ugData.Accept.dd)+1), Number(ugData.Accept.hh), Number(ugData.Accept.mn));
				let newTime = doCalNewTime(Number(ugData.Accept.dd), Number(ugData.Accept.hh), Number(ugData.Accept.mn));
        let now = new Date();
        let nowTime = now.getTime();
        let critiriaMinute = (newTime - nowTime)/(60 * 1000);
        if (critiriaMinute >= 15) {
          doAssignUrgentSuccess(ugData, place, btnCmd, customurgent);
        } else {
          alert('ระยะเวลาตอบรับ Consult ต้องมีค่าล่วงหน้าจากตอนนี้ไปอีก 15 นาที เป็นอย่างน้อย');
        }
      }
    };

    customurgent = $(place).customurgent(customurgentSettings);
    if (ougData) {
      customurgent.editInputValue(ougData);
    }

    return customurgent;
  }

  const doAssignUrgentSuccess = async function(ugData, place, btnCmd, customurgent){
    $(place).find('#SummaryAssignDatetime').remove();
    let currentMode = $(btnCmd).data('modecontrol');

    let urgentId = undefined;
    let customUrgentRes = undefined
    let dumpData = ugData;
    dumpData.Working = {dd: 0, hh: 0, mn: 0};
    if (currentMode.mode == 'new'){
      customUrgentRes = await common.doCreateNewCustomUrgent(dumpData);
      urgentId = customUrgentRes.Record.id
      $(btnCmd).val(' แก้ไขเวลาตอบรับ ');
      $(btnCmd).data('modecontrol', {mode: 'edit', urgentId: urgentId});
      $(btnCmd).prop("onclick", null).off("click");
    } else if (currentMode.mode == 'edit'){
      currentMode = $(btnCmd).data('modecontrol');
      urgentId = currentMode.urgentId;
      customUrgentRes = await common.doUpdateCustomUrgent(dumpData, urgentId);
    }

    $(btnCmd).on('click', (evt)=>{
      doOpenUgentPopup(place, btnCmd, ugData);
    })
    let summaryAssignDatetime = $('<div id="SummaryAssignDatetime" style="postion: relative; width: 100%;"></div>');
    $(summaryAssignDatetime).append($('<div>ระยะเวลาตอบรับ Consult ภายใน <b>' + ugData.Accept.text + '</b></div>'));
    $(place).prepend($(summaryAssignDatetime));
    customurgent.doCloseDialog()
  }

  const doCreateRadioContactLine = function(formWrapper){
    let customSelectPluginOption = {
      loadOptionsUrl: '/api/radiologist/state/current',
      externalStyle: {"font-family": "THSarabunNew", "font-size": "24px", "width": "350px", "line-height": "30px", "min-height": "30px", "height": "30px"},
      startLoad: function(){$('#Radiologist').loading('start');},
      stopLoad: function(){$('#Radiologist').loading('stop');}
    }

    let radioContactLine = $('<div style="display: table-row; width: 100%;"></div>');
    let radioContactLabelCell = $('<div style="display: table-cell; padding: 4px;">รังสีแพทย์</div>');
    let radioContactValueCell = $('<div style="display: table-cell; padding: 4px;"></div>');

    let radioCustomSelectorBox = $('<div id="Radiologist"></div>');
    $(radioCustomSelectorBox).appendTo($(radioContactValueCell));

    let radioCustomSelector = $(radioCustomSelectorBox).customselect(customSelectPluginOption);

    $(radioContactLine).append($(radioContactLabelCell)).append($(radioContactValueCell));
    $(formWrapper).append($(radioContactLine));

    return radioCustomSelector;
  }

  const doCreateFormFooter = function(hrHandle, ugHandle, rdHandle){
    let footerLine = $('<div style="positon: relative; width: 100%; text-align: center; margin-top: 20px;"></div>');
    let okCmd = $('<input type="button" value=" ตกลง "/>');
    $(okCmd).on('click', async (evt)=>{
      let hnValue = $('#HNValue').val();
      let nameValue = $('#NameValue').val();

      let patientHistory = hrHandle.images();
      if (patientHistory.length > 0){
				let ugData = $(ugHandle).data('modecontrol');
				if ((ugData.urgentId) && (ugData.urgentId > 0)) {
					let radioSelected = rdHandle.getSelectedIndex();
		      if ((radioSelected.radioId) && (radioSelected.radioId > 0)) {
						const userdata = JSON.parse(localStorage.getItem('userdata'));
						let hospitalId = userdata.hospitalId;
						let userId = userdata.id;
						if ((hnValue === '') && (nameValue === '')){
							let newUniqID = doGenUniqueID();
							hnValue = hospitalId + '-' + newUniqID;
							nameValue = userdata.hospital.Hos_Name + '-' + newUniqID;
						}
						let newConsultData = {PatientHN: hnValue, PatientName: nameValue, PatientHRLink: patientHistory, UGType: ugData.urgentId, RadiologistId: radioSelected.radioId};
						let casestatuseId = 1;
						let rqParams = {hospitalId: hospitalId, userId: userId, casestatuseId: casestatuseId, data: newConsultData};
						let newConsultRes = await common.doCallApi('/api/consult/add', rqParams);
						if (newConsultRes.status.code == 200){
							let newConsultSetup = newConsultRes.Setup;
							//console.log(newConsultSetup);
							doOpenSimpleChatbox(newConsultSetup);
						} else {
							$.notify("ระบบฯ ไม่สามารถเปิด Consult ใหม่ ได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "error");
						}
					} else {
						$('.mainfull').find('#Radiologist').notify("โปรดเลือกรังสีแพทย์", "error");
					}
				} else {
					$('.mainfull').find('#OpenUrgentCmd').notify("โปรดกำหนดเวลาตอบรับ", "error");
				}
			} else {
				$('.mainfull').find('#PatientHistoryBox').notify("โปรดแนบรูปประวัติผู้ป่วยอย่างน้อย 1 รูป หรือเลือกเป็นไม่มีประวัติแนบ", "error");
			}
    });
    let cancelCmd = $('<input type="button" value=" ยกเลิก " style="margin-left: 10px;"/>');
    $(cancelCmd).on('click', (evt)=>{
      //$('.MenuCmd').click();
			doCreateMyConsultListView();
    });
    return $(footerLine).append($(okCmd)).append($(cancelCmd));
  }

  const doCreateNewConsultForm = function(){
		$('body').loading('start');
    let titleForm = doCreateNewConsultTitleForm();

    let patientBox = doCreatePatientBox();

    let consultForm = $('<div id ="ConsultForm" style="display: table; width: 100%; border-collapse: collapse;"></div>');

    let patientHistoryHandle = doCreatePatientHistoryLine(consultForm);
    let consultUrgentHandle = doCreateConsultUrgentLine(consultForm);
    let radioSelectHandle = doCreateRadioContactLine(consultForm);

    let footerBar = doCreateFormFooter(patientHistoryHandle, consultUrgentHandle, radioSelectHandle);

		let newConsultFormBox = $('<div style="position: relative; width: 100%; border: 2px solid black; background-color: #fefefe; margin-top: 10px;"></div>');
		$(newConsultFormBox).append($(patientBox)).append($(consultForm)).append($(footerBar));
		$(".mainfull").empty().append($(titleForm)).append($(newConsultFormBox));
		$('body').loading('stop');
  }

	const doCreateSimpleChatTitlePage = function(){
		let pageLogoBox = $('<div style="position: relative; display: inline-block;"></div>');
    let logoPage = $('<img src="/images/simple-chat-icon.png" width="40px" height="auto"/>');
    $(logoPage).appendTo($(pageLogoBox));
    let titleBox = $('<div class="title-content"></div>');
    let titleText = $('<h3 style="position: relative; display: inline-block; margin-left: 10px; top: -10px;">Consult</h3>')
    $(titleBox).append($(pageLogoBox)).append($(titleText));
    return $(titleBox);
	}

	const doOpenSimpleChatbox = function(setup){
		let userdata = JSON.parse(localStorage.getItem('userdata'));
		let chatTitle = $('<div style="position: relative; width: 100%;"></div>');
		$(chatTitle).html('<b>HN: </b>' + setup.patientHN + ' <b>Name: </b> ' + setup.patientName );
		$(chatTitle).css({'margin-top': '10px', 'background-color': '#e0dcdc', 'border': '2px solid black', 'min-height': '40px'});
		let backCmd = $('<input type="button" value=" กลับ " style="float: right;"/>');
		$(backCmd).on('click', async (evt)=>{
			$('#MyConsultSubCmd').click();
		});
		$(chatTitle).append($(backCmd));

		let simpleChatBoxOption = {
			topicId: setup.topicId,
			topicName: setup.patientHN + ' ' + setup.patentName,
			topicStatusId: setup.topicstatusId,
			topicType: 'consult',
			myId: userdata.username,
			myName: userdata.userinfo.User_NameTH + ' ' + userdata.userinfo.User_LastNameTH,
			myDisplayName: 'ฉัน',
			audienceId: setup.audienceId,
			audienceName: setup.audienceName,
			wantBackup: true,
			externalClassStyle: {},
			sendMessageCallback: doSendMessageCallback,
			resetUnReadMessageCallback: doResetUnReadMessageCallback
		};
		let simpleChatBox = $('<div id="SimpleChatBox"></div>');
		let simpleChatBoxHandle = $(simpleChatBox).chatbox(simpleChatBoxOption);
		simpleChatBoxHandle.restoreLocal();
		simpleChatBoxHandle.scrollDown();
		let pageTitle = doCreateSimpleChatTitlePage();
		$(".mainfull").empty().append($(pageTitle)).append($(chatTitle)).append($(simpleChatBox));
	}

	const doSendMessageCallback = function(msg, sendto, from, context){
		return new Promise(async function(resolve, reject){
			const main = require('../main.js');
			const wsm = main.doGetWsm();
			if ((wsm.readyState == 0) || (wsm.readyState == 1)) {
				let msgSend = {type: 'message', msg: msg, sendto: sendto, from: from, context: context};
				wsm.send(JSON.stringify(msgSend));
			} else {
				$.notify('Now. Your Socket not ready. Please refresh page antry again', 'warn');
			}
			resolve();
		});
	}

	const doResetUnReadMessageCallback = function(audienceId, value){
		let selector = '#'+audienceId + ' .reddot';
		let lastValue = $(selector).text();
		let newValue = Number(lastValue) + value;
		if (newValue > 0) {
			$(selector).text(newValue);
			$(selector).show()
		} else {
			$(selector).hide()
		}
	}

	const doCallMyConsult = function(){
    return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let userId = userdata.id;
			let rqParams = {userId: userId, statusId: [1 ,2]};
			let apiUrl = '/api/consult/filter/user';
			try {
				let response = await common.doCallApi(apiUrl, rqParams);
        resolve(response);
			} catch(e) {
	      reject(e);
    	}
    });
  }

	const doCreateMyConsultTitleListView = function(){
    let pageLogoBox = $('<div style="position: relative; display: inline-block;"></div>');
    let logoPage = $('<img src="/images/chat-history-icon.png" width="40px" height="auto"/>');
    $(logoPage).appendTo($(pageLogoBox));
    let titleBox = $('<div class="title-content"></div>');
    let titleText = $('<h3 style="position: relative; display: inline-block; margin-left: 10px; top: -10px;">Consult ของฉัน</h3>')
    $(titleBox).append($(pageLogoBox)).append($(titleText));
    return $(titleBox);
  }

	const doCreateConsultHeaderRow = function() {
    let headerRow = $('<div style="display: table-row; width: 100%;"></div>');
		let headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>Time Create</span>');
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
		$(headColumn).append('<span>รังสีแพทย์</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>Command</span>');
		$(headColumn).appendTo($(headerRow));

    return $(headerRow);
  }

	const doCreateConsultItemRow = function(consultItem) {
		return new Promise(async function(resolve, reject) {
			let consultTask = await common.doCallApi('/api/consult/tasks/select/'+ consultItem.consult.id, {});
			let consultDate = util.formatDateTimeStr(consultItem.consult.createdAt);
			let consultdatetime = consultDate.split('T');
			let consultdateSegment = consultdatetime[0].split('-');
			consultdateSegment = consultdateSegment.join('');
			let consultdate = util.formatStudyDate(consultdateSegment);
			let consulttime = util.formatStudyTime(consultdatetime[1].split(':').join(''));

			let patientName = consultItem.consult.PatientName;
			let patientHN = consultItem.consult.PatientHN;
			let consultUG = consultItem.consult.UGType;
      let consultRadioName = consultItem.radio.User_NameTH + ' ' + consultItem.radio.User_LastNameTH;;

			let consultCMD = await doCreateConsultItemCommand(consultItem);

      let consultRow = $('<div style="display: table-row; width: 100%;" class="case-row"></div>');

			let consultColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(consultColumn).append('<span>' + consultdate + ' : ' + consulttime + '</span>');
  		$(consultColumn).appendTo($(consultRow));

      consultColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
			if (consultItem.casestatusId == 1){
	      if ((consultTask.Tasks) && (consultTask.Tasks.length > 0) && (consultTask.Tasks[0]) && (consultTask.Tasks[0].triggerAt)){
	        let consultTriggerAt = new Date(consultTask.Tasks[0].triggerAt);
	        let diffTime = Math.abs(consultTriggerAt - new Date());
	        let hh = parseInt(diffTime/(1000*60*60));
	        let mn = parseInt((diffTime - (hh*1000*60*60))/(1000*60));
	        let clockCountdownDiv = $('<div></div>');
	        $(clockCountdownDiv).countdownclock({countToHH: hh, countToMN: mn});
	        $(consultColumn).append($(clockCountdownDiv));
	      } else {
	        $(consultColumn).append($('<span>not found Task</span>'));
	  		}
			} else {
				$(consultColumn).append($('<span>-</span>'));
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
  		$(consultColumn).append($('<span>' + consultRadioName + '</span>'));
  		$(consultColumn).appendTo($(consultRow));

      consultColumn = $('<div style="display: table-cell; padding: 4px;"></div>');
  		$(consultColumn).append($(consultCMD));
  		$(consultColumn).appendTo($(consultRow));

      resolve($(consultRow));
		});
	}

	const doCreateConsultItemCommand = function (consultItem){
		return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let consultId = consultItem.id;
	    let consultCmdBox = $('<div style="text-align: center; padding: 4px; width: 100%;"></div>');
			let openCmd = $('<div>Open</div>');
			$(openCmd).css({'display': 'inline-block', 'margin': '3px', 'padding': '1px 5px', 'border-radius': '12px', 'cursor': 'pointer', 'background-color' : 'orange', 'color': 'white'});
			$(consultCmdBox).append($(openCmd));
			$(openCmd).on('click', async (evt)=>{
				let topicId = consultItem.consult.id;
				let audienceUserId = consultItem.consult.RadiologistId;
				let audienceInfo = await apiconnector.doGetApi('/api/users/select/' + audienceUserId, {});
				let audienceId = audienceInfo.user[0].username;
				let audienceName = audienceInfo.user[0].userinfo.User_NameTH + ' ' + audienceInfo.user[0].userinfo.User_LastNameTH;
				let setup = {
					audienceId: audienceId,
					audienceName: audienceName,
					topicId: topicId,
					topicStatusId: consultItem.consult.casestatusId,
					patientHN: consultItem.consult.PatientHN,
					patientName: consultItem.consult.PatientName,
				}
				doOpenSimpleChatbox(setup);
			});
			let closeCmd = $('<div>Close</div>');
			$(closeCmd).css({'display': 'inline-block', 'margin': '3px', 'padding': '1px 5px', 'border-radius': '12px', 'cursor': 'pointer', 'background-color' : 'grey', 'color': 'white'});
			$(consultCmdBox).append($(closeCmd));
			$(closeCmd).on('click', async (evt)=>{
				let topicId = consultItem.consult.id;
				let response = await common.doUpdateConsultStatus(topicId, 6);
				console.log(response);
				if (response.status.code == 200) {
					$.notify('Close Consult Success', 'success');
					$('#MyConsultSubCmd').click();
				} else {
					alert('เกิดข้อผิดพลาด ไม่สามารถตอบรับ Consult ได้ในขณะนี้');
				}
			});
	    resolve($(consultCmdBox));
		});
	}

	const doCreateMyConsultListView = function(){
		return new Promise(async function(resolve, reject) {
			$('body').loading('start');
			let myConsult = await doCallMyConsult();
			let pageTitle = doCreateMyConsultTitleListView();

			let myConsultViewBox = $('<div style="position: relative; width: 100%; margin-top: 30px;"></div>');
			let myConsultView = $('<div style="display: table; width: 100%; border-collapse: collapse; margin-top: -25px;"></div>');
			$(myConsultViewBox).append($(myConsultView));

			let consultLists = myConsult.Records;
      if (consultLists.length > 0) {
				let consultHeader = doCreateConsultHeaderRow();
				$(myConsultView ).append($(consultHeader));
        for (let i=0; i < consultLists.length; i++) {
          let consultItem = consultLists[i];
          let consultRow = await doCreateConsultItemRow(consultItem);
          $(myConsultView ).append($(consultRow));
        }
      } else {
        let notFoundConsultMessage = $('<h3>ไม่พบรายการ Consult ใหม่ของคุณในขณะนี้</h3>')
        $(myConsultViewBox).append($(notFoundConsultMessage));
      }

			$(".mainfull").empty().append($(pageTitle)).append($(myConsultViewBox));
			$('body').loading('stop');
			resolve();
		});
	}

  return {
		doGenUniqueID,
    doCreateNewConsultForm,
		doOpenSimpleChatbox,
		doCreateMyConsultListView
	}
}
