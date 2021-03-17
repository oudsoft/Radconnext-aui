/*consult.js*/
module.exports = function ( jq ) {
	const $ = jq;

  const util = require('./utilmod.js')($);
  const common = require('./commonlib.js')($);

	const pageFontStyle = {"font-family": "THSarabunNew", "font-size": "24px"};

  const doCreateNewConsultTitleForm = function(){
    let pageLogoBox = $('<div style="position: relative; display: inline-block;"></div>');
    let logoPage = $('<img src="/images/consult-icon.png" width="40px" height="auto"/>');
    $(logoPage).appendTo($(pageLogoBox));
    let titleBox = $('<div class="title-content"></div>');
    let titleText = $('<h3 style="position: relative; display: inline-block; margin-left: 10px; top: -10px;">สร้าง Consult ใหม่</h3>')
    $(titleBox).append($(pageLogoBox)).append($(titleText));
    return $(titleBox);
  }

  const doCreatePatientLine = function(){
    let patientBox = $('<div id ="PatientBox" style="display: table; width: 100%; border-collapse: collapse;"></div>');
    let patientLine = $('<div style="display: table-row; width: 100%;"></div>');
    let hnLabelCell = $('<div style="display: table-cell; padding: 4px;">HN ผู้ป่วย</div>');
    let hnValueCell = $('<div style="display: table-cell; padding: 4px;"></div>');
    let nameLabelCell = $('<div style="display: table-cell; padding: 4px;">ชื่อผู้ป่วย</div>');
    let nameValueCell = $('<div style="display: table-cell; padding: 4px;"></div>');
    let hnValue = $('<input type="text" id="HNValue"/>');
    let nameValue = $('<input type="text" id="NameValue"/>');
    $(hnValueCell).append($(hnValue));
    $(nameValueCell).append($(nameValue));
    $(patientLine).append($(hnLabelCell)).append($(hnValueCell)).append($(nameLabelCell)).append($(nameValueCell));
    $(patientBox).append($(patientLine));
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
						let newConsultData = {PatientHN: hnValue, PatientName: nameValue, PatientHRLink: patientHistory, UGType: ugData.urgentId, RadiologistId: radioSelected.radioId};
						let hospitalId = userdata.hospitalId;
						let userId = userdata.id;
						let casestatuseId = 1;
						let rqParams = {hospitalId: hospitalId, userId: userId, casestatuseId: casestatuseId, data: newConsultData};
						let newConsultRes = await common.doCallApi('/api/consult/add', rqParams);
						console.log(newConsultRes);
						if (newConsultRes.status.code == 200){
							//doOpenSimpleChatbo
							let newConsultSetup = newConsultRes.Setup;
							doOpenSimpleChatbox(newConsultSetup);
						} else {
							$.notify("ระบบฯ ไม่สามารถเปิด Consult ใหม่ ได้ในขณะนี้ โปรดพยายามใหม่ภายหลัง", "error");
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
    });
    return $(footerLine).append($(okCmd)).append($(cancelCmd));
  }

  const doCreateNewConsultForm = function(){
    let titleForm = doCreateNewConsultTitleForm();
    let patientBar = doCreatePatientLine();
    $(".mainfull").empty().append($(titleForm)).append($(patientBar));

    let consultForm = $('<div id ="ConsultForm" style="display: table; width: 100%; border-collapse: collapse;"></div>');

    let patientHistoryHandle = doCreatePatientHistoryLine(consultForm);
    let consultUrgentHandle = doCreateConsultUrgentLine(consultForm);
    let radioSelectHandle = doCreateRadioContactLine(consultForm);

    let footerBar = doCreateFormFooter(patientHistoryHandle, consultUrgentHandle, radioSelectHandle);

    $(".mainfull").append($(consultForm)).append($(footerBar));
  }

	const doOpenSimpleChatbox = function(setup){
		console.log(setup);
		let userdata = JSON.parse(localStorage.getItem('userdata'));
		let simpleChatBoxOption = {
			topicId: setup.topicId,
			topicName: setup.patientHN + ' ' + setup.patentName,
			topicStatusId: setup.topicstatusId,
			topicType: 'consults',
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
		$(".mainfull").empty().append($(simpleChatBox));
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

  return {
    doCreateNewConsultForm,
		doOpenSimpleChatbox
	}
}
