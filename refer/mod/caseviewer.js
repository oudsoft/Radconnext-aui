/* caseviewer.js */
module.exports = function ( jq ) {
	const $ = jq;

  const apiconnector = require('../../case/mod/apiconnect.js')($);
  const util = require('../../case/mod/utilmod.js')($);
  const common = require('../../case/mod/commonlib.js')($);
	const createnewcase = require('../../case/mod/createnewcase.js')($);
	const ai = require('../../radio/mod/ai-lib.js')($);

	const backwardCaseStatus = [5, 6, 10, 11, 12, 13, 14];
	const pageFontStyle = {"font-family": "THSarabunNew", "font-size": "24px"};
	const commandButtonStyle = {'padding': '3px', 'cursor': 'pointer', 'border': '1px solid white', 'color': 'white', 'background-color': 'blue'};

	const doOpenCaseView = function(dicomData, defualtValue, dicomSeries){
    return new Promise(async function(resolve, reject){
      $('body').loading('start');
      $(".mainfull").empty();
	    let caseView = $('<div style="width: 99%; padding: 5px; border: 1px solid black; background-color: #ccc; margin-top: 4px;"></div>');
      let caseTitle = await doCreateCaseTitle(dicomData);
      $(caseTitle).appendTo($(caseView));
      $(".mainfull").append($(caseView));

			let caseItem, patentFullName, patientHN, patientSA, caseBodypart;
      if (dicomData.caseId) {
				let callUrl = '/api/cases/select/'+ dicomData.caseId;
        let caseRes = await apiconnector.doCallApi(callUrl, {});
				console.log(caseRes);
				if (caseRes.status.code == 200){
	        caseItem = caseRes.Records[0];
	        patentFullName = caseItem.case.patient.Patient_NameEN + ' ' + caseItem.case.patient.Patient_LastNameEN;
	        patientHN = caseItem.case.patient.Patient_HN;
	        patientSA = caseItem.case.patient.Patient_Age + '/' + caseItem.case.patient.Patient_Sex;
	        caseBodypart = caseItem.case.Case_BodyPart;
				} else if (caseRes.status.code == 210){
					let rememberme = localStorage.getItem('rememberme');
					if (rememberme == 1) {
						let newUserData = await apiconnector.doCallNewTokenApi();
						localStorage.setItem('token', newUserData.token);
						localStorage.setItem('userdata', JSON.stringify(newUserData.data));
						apiconnector.doCallApi(callUrl, {}).then((caseRes)=>{
							caseItem = caseRes.Records[0];
			        patentFullName = caseItem.case.patient.Patient_NameEN + ' ' + caseItem.case.patient.Patient_LastNameEN;
			        patientHN = caseItem.case.patient.Patient_HN;
			        patientSA = caseItem.case.patient.Patient_Age + '/' + caseItem.case.patient.Patient_Sex;
			        caseBodypart = caseItem.case.Case_BodyPart;
						});
					} else {
						common.doUserLogout();
					}
				}
      } else {
				caseItem = undefined;
        patentFullName = dicomData.name;
        patientHN = dicomData.hn;
        patientSA = dicomData.sa;
        caseBodypart = defualtValue.bodypart;
      }
			$(caseTitle).find('#PatientHN').text(patientHN);
			$(caseTitle).find('#PatentFullName').text(patentFullName);
			$(caseTitle).find('#PatientSA').text(patientSA);
			$(caseTitle).find('#CaseBodypart').text(caseBodypart);

			if (dicomData.studyInstanceUID) {
				let openStoneWebViewerCmd = $('<input type="button" value=" เปิดภาพ "/>');
	      let openData = {studyInstanceUID: dicomData.studyInstanceUID};
	      $(openStoneWebViewerCmd).data('openData', openData);
	      $(openStoneWebViewerCmd).on('click', onOpenStoneWebViewerCmdClick);
				$(openStoneWebViewerCmd).css({'float': 'right'});
				$(caseTitle).find('#TitleData').append($(openStoneWebViewerCmd));
			}

			if (caseItem) {
				let caseId = caseItem.case.id;
				let patientId = caseItem.case.patientId;
				let patentFullName = caseItem.case.patient.Patient_NameEN + ' ' + caseItem.case.patient.Patient_LastNameEN;
				let backwardView = await doCallCreatePatientBackward(patientId, patentFullName, caseId);
				$(backwardView).appendTo($(caseView));
			}

			let caseResultInfoBox = await doCreateResulteSection(dicomData, caseItem);
			//$(caseResultInfoBox).css({'min-height': '100px'});
			$(caseResultInfoBox).appendTo($(caseView));

			let referCommandBox = await doCreateReferCommand(dicomData, caseItem, defualtValue, dicomSeries);
			$(referCommandBox).css({'margin-top': '10px'});
			$(referCommandBox).appendTo($(caseView));

			let contactRadioToolsBar = $('<div id="ContactTools" style="width: 99%; min-height: 80px; text-align: right; display: none;"></div>');
			if ((dicomData.casestatusId == 5) || (dicomData.casestatusId == 6) || (dicomData.casestatusId == 10) || (dicomData.casestatusId == 11) || (dicomData.casestatusId == 12) || (dicomData.casestatusId == 13) || (dicomData.casestatusId == 14)) {
				let history = await doSeachChatHistory(dicomData.caseId);
				localStorage.setItem('localmessage', JSON.stringify(history));
				let userdata = JSON.parse(localStorage.getItem('userdata'));
				let simpleChatBoxOption = {
					topicId: dicomData.caseId,
		      topicName: patientHN + ' ' + patentFullName + ' ' + patientSA + ' ' + caseBodypart,
					topicStatusId: dicomData.casestatusId,
					topicType: 'case',
					myId: userdata.username,
					myName: userdata.userinfo.User_NameTH + ' ' + userdata.userinfo.User_LastNameTH,
		      myDisplayName: 'ฉัน',
					audienceId: caseItem.Radiologist.username,
		      audienceName: caseItem.Radiologist.User_NameTH + ' ' + caseItem.Radiologist.User_LastNameTH,
					wantBackup: true,
		      externalClassStyle: {},
		      sendMessageCallback: doSendMessageCallback,
					resetUnReadMessageCallback: doResetUnReadMessageCallback
				};
				let simpleChatBox = $('<div id="SimpleChatBox"></div>');
				let simpleChatBoxHandle = $(simpleChatBox).chatbox(simpleChatBoxOption);

				simpleChatBoxHandle.restoreLocal();

				let softPhoneCmd = doCreateSoftPhoneCallCmd(caseItem);
				let zoomCmd = doCreateZoomCallCmd(caseItem, simpleChatBoxHandle);
				let externalToolsBox = $('<div style="position: relative; display: inline-block; bottom: -14px;"></div>');
				$(externalToolsBox).append($(softPhoneCmd)).append($(zoomCmd))

				$(simpleChatBox).find('#ChatSendBox').prepend($(externalToolsBox));

				$(simpleChatBox).appendTo($(contactRadioToolsBar));
			}
			$(contactRadioToolsBar).appendTo($(caseView));

      let caseFooterBar = $('<div style="width: 100%; text-align: center; margin-top: 10px;"></div>');
      $(".mainfull").append($(caseFooterBar));
      let backCmd = $('<input type="button" value=" Back "/>');
      $(backCmd).on('click', (evt)=>{
        $('#HomeMainCmd').click();
      });
      $(backCmd).appendTo($(caseFooterBar));

      $('body').loading('stop');
      resolve();
    });
  }

  const doCreateCaseTitle = function(dicomData){
    return new Promise(async function(resolve, reject){
      let caseTitle = $('<div id="CaseTitle"><div><span><b>ผู้ป่วย</b></span></div></div>');
      let summaryLine = $('<div id="TitleData" style="min-height: 40px;"></div>');
      $(summaryLine).appendTo($(caseTitle));
      $(summaryLine).append($('<span>HN:</span>'));
      $(summaryLine).append($('<span id="PatientHN" style="margin-left: 5px; font-weight: bold;"></span>'));
      $(summaryLine).append($('<span style="margin-left: 10px;">Name:</span>'));
      $(summaryLine).append($('<span id="PatentFullName" style="margin-left: 5px; font-weight: bold;"></span>'));
      $(summaryLine).append($('<span style="margin-left: 10px;">Age/sex:</span>'));
      $(summaryLine).append($('<span id="PatientSA" style="margin-left: 5px; font-weight: bold;"></span>'));
      $(summaryLine).append($('<span style="margin-left: 10px;">Body Part:</span>'));
      $(summaryLine).append($('<span id="CaseBodypart" style="margin-left: Spx; font-weight: bold;"></span>'));
      $(summaryLine).css(common.pageLineStyle);
      resolve($(caseTitle));
    });
  }

  const doCreateResulteSection = function(dicomData, caseData) {
    return new Promise(async function(resolve, reject){
      let resultBox = $('<div style="margin-top: 10px;"></div>');
      let resultTitle = $('<div style="min-height: 40px;"><span><b>ผลอ่าน</b></span></div>');
      $(resultTitle).appendTo($(resultBox));
			let resultContentBox = await doCreateResultWithCaseStatus(dicomData, caseData);
      let resultView = $('<div style="width: 98%; padding: 4px; border: 2px solid grey; background-color: white; min-height: 100px"></div>')
			$(resultView).append($(resultContentBox));
      $(resultView).appendTo($(resultBox));
			let toggleContentCmd = $('<span style="float: right; cursor: pointer;">ซ่อนผลอ่าน</span>');
			$(toggleContentCmd).on('click', function(evt){
	      let state = $(resultView).css('display');
	      if (state === 'block') {
	        $(resultView).slideUp();
	        $(toggleContentCmd).text('แสดงผลอ่าน');
	      } else {
	        $(resultView).slideDown();
	        $(toggleContentCmd).text('ซ่อนผลอ่าน');
	      }
	    });
	    $(toggleContentCmd).appendTo($(resultTitle));
      resolve($(resultBox));
    });
  }

  const doCreateResultWithCaseStatus = function(dicomData, caseData) {
    return new Promise(async function(resolve, reject){
			let resultView = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');
      let resultBox = $('<div style="display: table-row; width: 100%;"></div>');
			if (dicomData.caseId) {
	      if ((dicomData.casestatusId == 1) || (dicomData.casestatusId == 2) || (dicomData.casestatusId == 8) || (dicomData.casestatusId == 9)) {
					let sendStatusBox = $('<div style="display: table-cell;">ไม่มีผลอ่าน</div>');
					$(sendStatusBox).appendTo($(resultBox));
					let caseStatusBox = $('<div style="display: table-cell;">สถานะ = <b>' + caseData.case.casestatus.CS_Name_EN + '</b></div>');
					$(caseStatusBox).appendTo($(resultBox));

					let dealTimeBox = $('<div style="display: table-cell;"><span>กำหนดรับผล </span></div>');
					let dealTimeValue = $('<span></span>');$('body').loading('start');
					$(dealTimeValue).loading('start');
					$(dealTimeValue).load('/api/tasks/select/' + dicomData.caseId, function(caseTask){
						if ((caseTask.Records) && (caseTask.Records.length > 0) && (caseTask.Records[0].triggerAt)){
							//let caseTriggerAt = new Date(caseTask.Records[0].triggerAt);
							let caseDate = util.formatDateTimeStr(caseTask.Records[0].triggerAt);
							let casedatetime = caseDate.split('T');
							let casedateSegment = casedatetime[0].split('-');
							casedateSegment = casedateSegment.join('');
							let casedate = util.formatStudyDate(casedateSegment);
							let casetime = util.formatStudyTime(casedatetime[1].split(':').join(''));
							$(dealTimeValue).append($('<b>' + casedate + ' ' + casetime + '</b>'));
						} else {
							let expiredStatus = 4;
							let expiredDescription = 'Not found Task on Case Task Cron Job.';
							common.doUpdateCaseStatus(dicomData.caseId, expiredStatus, expiredDescription);
							$(dealTimeValue).text('ไม่พบการตั้งค่าเวลา');
						}

						$(dealTimeValue).loading('stop');
					});
					$(dealTimeValue).appendTo($(dealTimeBox));
					$(dealTimeBox).appendTo($(resultBox));
					let caseOwnerBox = $('<div style="display: table-cell;">ผู้ส่ง '+ caseData.Owner.User_NameTH + ' ' + caseData.Owner.User_LastNameTH + '</div>');
					$(caseOwnerBox).appendTo($(resultBox));

	      } else if ((dicomData.casestatusId == 3) || (dicomData.casestatusId == 4) || (dicomData.casestatusId == 7)) {
					let sendStatusBox = $('<div style="display: table-cell;">ไม่มีผลอ่าน</div>');
					$(sendStatusBox).appendTo($(resultBox));
					let caseStatusBox = $('<div style="display: table-cell;">สถานะ = <b>' + caseData.case.casestatus.CS_Name_EN + '</b></div>');
					$(caseStatusBox).appendTo($(resultBox));
					let caseDate = util.formatDateTimeStr(caseData.case.updatedAt);
					let casedatetime = caseDate.split('T');
					let casedateSegment = casedatetime[0].split('-');
					casedateSegment = casedateSegment.join('');
					let casedate = util.formatStudyDate(casedateSegment);
					let casetime = util.formatStudyTime(casedatetime[1].split(':').join(''));
					let dealTimeBox = $('<div style="display: table-cell;">เมื่อ '+ casedate + ' ' + casetime + '</div>');
					$(dealTimeBox).appendTo($(resultBox));
					let caseOwnerBox = $('<div style="display: table-cell;">ผู้ส่ง '+ caseData.Owner.User_NameTH + ' ' + caseData.Owner.User_LastNameTH + '</div>');
					$(caseOwnerBox).appendTo($(resultBox));
	      } else if ((dicomData.casestatusId == 5) || (dicomData.casestatusId == 6) || (dicomData.casestatusId == 10) || (dicomData.casestatusId == 11) || (dicomData.casestatusId == 12) || (dicomData.casestatusId == 13) || (dicomData.casestatusId == 14)) {
	        let pdfReportBox = await doCreateCaseResult(dicomData.caseId);
	        $(pdfReportBox).appendTo($(resultBox));
	      } else {
	        common.doOpenStoneWebViewer(dicomData.studyInstanceUID);
	      }
			} else {
				let sendStatusBox = $('<span style="display: table-cell;">ไม่มีผลอ่าน</span>');
				$(sendStatusBox).appendTo($(resultBox));
				let caseStatusBox = $('<span style="display: table-cell;">สถานะ = ไม่ได้ส่งอ่าน</span>');
				$(caseStatusBox).appendTo($(resultBox));
				let dealTimeBox = $('<span style="display: table-cell;"></span>');
				$(dealTimeBox).appendTo($(resultBox));
			}
			$(resultView).append($(resultBox));
      resolve($(resultView));
    });
  }

  const doCreateCaseResult = function(caseId){
    return new Promise(async function(resolve, reject){
      let resultRes = await apiconnector.doCallApi('/api/cases/result/'+ caseId, {});
      let resultReport = resultRes.Records[0];
			let pdfStream = undefined;
			let embetObject = undefined;
			try {
				pdfStream = await util.doCreateDownloadPDF(resultReport.PDF_Filename);
	      embetObject = $('<object data="' + resultReport.PDF_Filename + '" type="application/pdf" width="100%" height="480"></object>');
			} catch (err) {
				console.log(err);
				embetObject = $('<object data="" type="application/pdf" width="100%" height="480"></object>');
			} finally {
				let resultBox = $('<div style="width: 97%; padding: 10px; border: 1px solid black; background-color: #ccc; margin-top: 4px;"></div>');

	      $(embetObject).appendTo($(resultBox));
	      resolve($(resultBox));
			}
    });
  }

	const doCreateReferCommand = function(dicomData, caseData, defualtValue, dicomSeries){
		return new Promise(async function(resolve, reject){
			let commandView = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');
			let commandBox = $('<div style="display: table-row; width: 100%;"></div>');
			$(commandBox).appendTo($(commandView));
			let aiCmdBox = $('<div style="display: table-cell; text-align: center; width: 30%;"></div>');
			//$(aiCmdBox).appendTo($(commandBox));
			let aiCmd = $('<input type="button" value=" AI "/>');
			//$(aiCmd).appendTo($(aiCmdBox));
			$(aiCmd).on('click', async(evt)=>{
				let aiResultLogRes = await common.doCallAIResultLog(dicomData.dicomID);
				if (aiResultLogRes.Log) {
					let sentTimeCounter = aiResultLogRes.Log.length;
					if (sentTimeCounter > 0) {
						const announceMsg = $('<div></div>');
				    $(announceMsg).append($('<p>ระบบฯ พบว่า Dicom ขุดนี้เคยส่งไปให้ AI อ่านผลแล้ว จำนวน ' + sentTimeCounter + ' ครั้ง</p>'));
						$(announceMsg).append($('<p>คลิกปุ่ม <b>ตกลง</b> เพื่อดำเนินการต่อ</p>'));
						$(announceMsg).append($('<p>หรือไม่ส่ง คลิกปุ่ม <b>ยกเลิก</b></p>'));
						const radalertoption = {
				      title: 'แจ้งให้ทราบ',
				      msg: $(announceMsg),
				      width: '560px',
				      onOk: function(evt) {
			          radAlertBox.closeAlert();
								doExecAICmdClick(dicomData, caseData);
				      },
							onCancel: function(evt){
								radAlertBox.closeAlert();
							}
				    }
						let radAlertBox = $('body').radalert(radalertoption);

					} else {
						doExecAICmdClick(dicomData, caseData);
					}
				}
			});
			let createNewCaseCmdBox = $('<div style="display: table-cell; text-align: center; width: 50%;"></div>');
			$(createNewCaseCmdBox).appendTo($(commandBox));
			let createNewCaseCmd = $('<input type="button" value=" ส่งรังสีแพทย์อ่านผล "/>');
			$(createNewCaseCmd).appendTo($(createNewCaseCmdBox));
			$(createNewCaseCmd).on('click', (evt)=>{
				doCreateNewCaseCmdClick(dicomData, caseData, defualtValue, dicomSeries);
			});
			let contactRadioCmdBox = $('<div style="display: table-cell; text-align: center; width: 30%;"></div>');
			$(contactRadioCmdBox).appendTo($(commandBox));
			if ((dicomData.casestatusId == 5) || (dicomData.casestatusId == 6) || (dicomData.casestatusId == 10) || (dicomData.casestatusId == 11) || (dicomData.casestatusId == 12) || (dicomData.casestatusId == 13) || (dicomData.casestatusId == 14)) {
				let contactRadioCmd = $('<input type="button" value=" ติดต่อรังสีแพทย์ "/>');
				$(contactRadioCmd).appendTo($(contactRadioCmdBox));
				$(contactRadioCmd).on('click', (evt)=>{
					doContactRadioCmdClick(dicomData, caseData);
				});
			}
			resolve(($(commandView)));
		});
	}

	const doExecAICmdClick = function(dicomData, caseData){
		return new Promise(async function(resolve, reject) {
			$('body').loading('start');
			let seriesList = await ai.doCallCheckSeries(dicomData.dicomID);
			if (seriesList) {
				let seriesSelect = await ai.doCreateSeriesSelect(seriesList);
				$(seriesSelect).css(ai.quickReplyContentStyle);
				$(seriesSelect).css({'height': 'auto'});
				$('#quickreply').css(ai.quickReplyDialogStyle);
				$('#quickreply').append($(seriesSelect));

				let howmanySeries = $(seriesSelect).find('.series-item');
				if (howmanySeries.length == 1) {
					let singleSeries = $(howmanySeries)[0];
					$(singleSeries).click();
				}
			} else {
				const sorryMsg = $('<div></div>');
		    $(sorryMsg).append($('<p>ระบบค้นหาภาพจากระบบไม่เจอโปรดแจ้งผูดูแลระบบฯ ของคุณ</p>'));
				const radalertoption = {
		      title: 'ขออภัยที่เกิดข้อผิดพลาด',
		      msg: $(sorryMsg),
		      width: '560px',
		      onOk: function(evt) {
	          radAlertBox.closeAlert();
		      }
		    }
				let radAlertBox = $('body').radalert(radalertoption);
		    $(radAlertBox.cancelCmd).hide();
			}
			$('body').loading('stop');
			resolve();
		});
	}

	const doCreateNewCaseCmdClick = function(dicomData, caseData, defualtValue, dicomSeries){
		return new Promise(async function(resolve, reject){
			let patientName = defualtValue.patient.name;
			let allSeries = dicomSeries.length;
			if (dicomData.caseId) {
	      if ((dicomData.casestatusId == 1) || (dicomData.casestatusId == 2) || (dicomData.casestatusId == 8) || (dicomData.casestatusId == 9)) {
					let yourConfirm = confirm('รายการ dicom นี้ได้ถูกส่งไปหารังสีแพทย์แล้วและอยู่ระหว่างรอผลอ่าน\nโปรดยืนโดยการคลิกปุ่ม OK หรือ ตกลง ว่าคุณต้องการสร้างเคสใหม่จาก dicom รายการนี้อีกหนึ่งเคส?');
					if (yourConfirm == true){
						let allImageInstances = await createnewcase.doCallCountInstanceImage(dicomSeries, patientName);
						createnewcase.doCreateNewCaseFirstStep(defualtValue, allSeries, allImageInstances);
						resolve();
					} else {
						resolve();
					}
				} else if ((dicomData.casestatusId == 3) || (dicomData.casestatusId == 4) || (dicomData.casestatusId == 7)) {
					let allImageInstances = await createnewcase.doCallCountInstanceImage(dicomSeries, patientName);
					createnewcase.doCreateNewCaseFirstStep(defualtValue, allSeries, allImageInstances);
					resolve();
	      } else if ((dicomData.casestatusId == 5) || (dicomData.casestatusId == 6) || (dicomData.casestatusId == 10) || (dicomData.casestatusId == 11) || (dicomData.casestatusId == 12) || (dicomData.casestatusId == 13) || (dicomData.casestatusId == 14)) {
					let yourConfirm = confirm('รายการ dicom นี้ได้ถูกส่งไปหารังสีแพทย์แล้วและได้ผลอ่านกลับมาแล้ว\nโปรดยืนโดยการคลิกปุ่ม OK หรือ ตกลง ว่าคุณต้องการสร้างเคสใหม่จาก dicom รายการนี้อีกหนึ่งเคส?');
					if (yourConfirm == true){
						let allImageInstances = await createnewcase.doCallCountInstanceImage(dicomSeries, patientName);
						createnewcase.doCreateNewCaseFirstStep(defualtValue, allSeries, allImageInstances);
						resolve();
					} else {
						resolve();
					}
				}
			} else {
				let allImageInstances = await createnewcase.doCallCountInstanceImage(dicomSeries, patientName);
				createnewcase.doCreateNewCaseFirstStep(defualtValue, allSeries, allImageInstances);
				resolve();
			}
		});
	}

	const doContactRadioCmdClick = function(dicomData, caseData){
		let contactToolsBox = $('#ContactTools');
		$(contactToolsBox).slideToggle();
	}

	const doSendMessageCallback = function(msg, sendto, from, context){
		return new Promise(async function(resolve, reject){
			const main = require('../main.js');
			const wsm = main.doGetWsm();
			let msgSend = {type: 'message', msg: msg, sendto: sendto, from: from, context: context};
			wsm.send(JSON.stringify(msgSend));
			if (context.topicStatusId != 14) {
				let newStatus = 14;
				let newDescription = 'Case have Issue Message to Radio.';
				let updateStatusRes = await common.doUpdateCaseStatus(context.topicId, newStatus, newDescription);
				console.log(updateStatusRes);
				if (updateStatusRes.status.code == 200){
					let selector = '#'+sendto + ' .chatbox';
					let targetChatBox = $(selector);
					let eventData = {topicStatusId: 14};
					$(targetChatBox).trigger('updatetopicstatus', [eventData]);
				} else {
					$.notify('Now. can not update case status.', 'warn');
				}
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

	const doCreateSoftPhoneCallCmd = function(caseItem){
		const softPhoneIconUrl = '/images/phone-call-icon-2.png';
		let softPhoneBox = $('<div style="position: relative; display: inline-block; text-align: center; margin-right: 20px; bottom: 10px;"></div>');
    let softPhoneIcon = $('<img style="postion: absolute; width: 30px; height: auto; cursor: pointer;"/>');
    $(softPhoneIcon).attr('src', softPhoneIconUrl);
		$(softPhoneBox).data('softPhoneData', {caseData: caseItem});
		$(softPhoneBox).on('click', softPhoneCmdClick);
		$(softPhoneIcon).appendTo($(softPhoneBox));
		return $(softPhoneBox);
	}

	const softPhoneCmdClick = function(evt){
		$('body').loading('start');
		let softPhoneCmd = $(evt.currentTarget);
		let softPhoneData = $(softPhoneCmd).data('softPhoneData');
		console.log(softPhoneData);
		//let radioId = softPhoneData.caseData.case.Case_RadiologistId;
		//let callSocketUrl = '/api/cases/radio/socket/' + radioId;
		//let rqParams = {};
		//common.doCallApi(callSocketUrl, rqParams).then((radioSockets)=>{
			const phoneNoTHRegEx = /^[0]?[689]\d{8}$/;
			/*
			let callNumber = undefined;
			if (radioSockets.length > 0) {
				callNumber = softPhoneData.caseData.Radiologist.sipphone;
			} else {
				callNumber = softPhoneData.caseData.Radiologist.phone;
			}
			*/
			let callNumber = softPhoneData.caseData.Radiologist.phone;
			if (callNumber){
				let isCorrectFormat = phoneNoTHRegEx.test(callNumber);
				if (isCorrectFormat){
					const main = require('../main.js');
					const mySipUA = main.doGetSipUA();
					let callSession = mySipUA.call(callNumber, main.softphone.callOptions);
					console.log(callSession);
					callSession.connection.addEventListener('addstream', function (e) {
						var remoteAudio = document.getElementById('RemoteAudio');
						remoteAudio.srcObject = e.stream;
						setTimeout(() => {
				      remoteAudio.play();
							$('#SipPhoneIncomeBox').css({'top': '10px'});
				      $('#SipPhoneIncomeBox').find('#IncomeBox').css({'display': 'none'});
				      $('#SipPhoneIncomeBox').find('#AnswerBox').css({'display': 'block'});
				    }, 500);
					});
				} else {
					console.log('Your Phone Number is wrong format.');
				}
			} else {
				console.log('Your Phone Number is Null.');
			}
			//$.notify('ฟังก์นนี้อยู่ระหว่างดำเนินการเชื่อมต่อระบบฯ', "warn");
			$('body').loading('stop');
		//});
	}

	const doCreateZoomCallCmd = function(caseItem, chatHandle){
		const zoomIconUrl = '/images/zoom-white-icon.png';
		let zoomBox = $('<div style="position: relative; display: inline-block; text-align: center; margin-right: 20px; bottom: 10px;"></div>');
    let zoomIcon = $('<img style="postion: absolute; width: 30px; height: auto; cursor: pointer;"/>');
    $(zoomIcon).attr('src', zoomIconUrl);
		$(zoomBox).data('zoomData', {caseData: caseItem});
		$(zoomBox).on('click', (evt)=>{
			zoomCmdClick(evt, chatHandle);
		});
		$(zoomIcon).appendTo($(zoomBox));
		return $(zoomBox);
	}

	const zoomCmdClick = async function(evt, chatHandle){
		$('body').loading('start');
		let zoomCmd = $(evt.currentTarget);
		let zoomData = $(zoomCmd).data('zoomData');
		let userdata = JSON.parse(localStorage.getItem('userdata'));
		let startMeetingTime = util.formatStartTimeStr();
		let hospName = userdata.hospital.Hos_Name;
		let zoomMeeting = await apiconnector.doGetZoomMeeting(zoomData.caseData, startMeetingTime, hospName);
		//find radio socketId
		let radioId = zoomData.caseData.case.Case_RadiologistId;
		let callSocketUrl = '/api/cases/radio/socket/' + radioId;
		let rqParams = {};
		let radioSockets = await common.doCallApi(callSocketUrl, rqParams);
		if (radioSockets.length > 0) {
			//radio online
			$.notify('ระบบฯ เปิดห้องสนทนาได้สำเร็จ กำลังส่งข้อมูลเข้าร่วมสนทนาไปให้รังสีแพทย์', "info");
			let callZoomMsg = {type: 'callzoom', sendTo: radioSockets[0].id, openurl: zoomMeeting.join_url, password: zoomMeeting.password, topic: zoomMeeting.topic, sender: userdata.username};
			const main = require('../main.js');
			const myWsm = main.doGetWsm();
			myWsm.send(JSON.stringify(callZoomMsg));

			let linkMsg = 'ลิงค์สำหรับเข้าร่วมสนทนา\n' + zoomMeeting.join_url;
			let pwdMsg = 'Password เข้าร่วมสนทนา\n' + zoomMeeting.password;
			let topicMsg = 'ชื่อหัวข้อสนทนา\n' + zoomMeeting.topic;

			let chatMsg = linkMsg + pwdMsg + topicMsg;
			let myInfo = userdata.userinfo.User_NameTH + ' ' + userdata.userinfo.User_LastNameTH;
			let audienceInfo = zoomData.caseData.Radiologist.User_NameTH + ' ' + zoomData.caseData.Radiologist.User_LastNameTH;
			let contextData = {topicId: zoomData.caseData.case.id, topicName: zoomMeeting.topic, myId: userdata.username, myName: myInfo, audienceId: zoomData.caseData.Radiologist.username, audienceName: audienceInfo};
			await doSendMessageCallback(chatMsg, zoomData.caseData.Radiologist.username, userdata.username, contextData);

			chatHandle.sendMessage(linkMsg);
			chatHandle.sendMessage(pwdMsg);
			chatHandle.sendMessage(topicMsg);

			window.open(zoomMeeting.start_url, '_blank');
			$('body').loading('stop');
		} else {
			//radio offline
			$('body').loading('stop');
			let radAlertMsg = $('<div></div>');
			$(radAlertMsg).append($('<p>ระบบฯ ไม่สามารถติดต่อรังสีแพทย์ได้ในขณะนี้</p>'));
			$(radAlertMsg).append($('<p>อย่างไรก็ตามคุณสามารถส่งข้อมูลห้องสนนาที่สร้างขึ้นใหม่</p>'));
			$(radAlertMsg).append($('<p>่ไปให้รังสีแพทย์ทางช่องทางอื่นได้เช่น ไลน์ อีเมล์ เป็นต้น</p>'));
			$(radAlertMsg).append($('<p>ลิงค์สำหรับเข้าร่วมสนทนา <b>' + zoomMeeting.join_url + '</b></p>'));
			$(radAlertMsg).append($('<p>Password เข้าร่วมสนทนา <b>' + zoomMeeting.password + '</b></p>'));
			$(radAlertMsg).append($('<p>ชื่อหัวข้อสนทนา <b>' + zoomMeeting.topic + '</b></p>'));
			const radconfirmoption = {
				title: 'ไม่สามารถติดต่อรังสีแพทย์ได้',
				msg: $(radAlertMsg),
				width: '420px',
				onOk: function(evt) {
					radConfirmBox.closeAlert();
				}
			}
			let radConfirmBox = $('body').radalert(radconfirmoption);
			$(radConfirmBox.cancelCmd).hide();
		}
	}

	const onOpenStoneWebViewerCmdClick = function(evt) {
    const openCmd = $(evt.currentTarget);
    const openData = $(openCmd).data('openData');
    common.doOpenStoneWebViewer(openData.studyInstanceUID);
  }

	const doCallCreatePatientBackward = function(patientId, patientFullName, currentCaseId){
		return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let hospitalId = userdata.hospitalId;
			let limit = 2;
			let patientBackward = await doLoadPatientBackward(hospitalId, patientId, backwardCaseStatus, currentCaseId, limit);
			let patientBackwardView = undefined;
			if (patientBackward.Records.length > 0) {
				patientBackwardView = await doCreatePatientBackward(patientBackward.Records, patientFullName, patientId, currentCaseId);
			} else {
				patientBackwardView = $('<div style="100%"><div><span><b>ประวัติการตรวจ</b></span></div><span>ไม่พบประวัติการตรวจ</span></div>');
			}
			resolve($(patientBackwardView));
		});
	}

	const doLoadPatientBackward = function(hospitalId, patientId, statusIds, currentCaseId, limit) {
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/cases/filter/patient';
			var params = {statusId: statusIds, patientId: patientId, hospitalId: hospitalId, currentCaseId: currentCaseId};
			if ((limit) && (limit > 0)) {
				params.limit = limit;
			}
			$.post(apiUri, params, function(response){
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doCreatePatientBackward = function(backwards, patientFullName, patientId, currentCaseId) {
		return new Promise(async function(resolve, reject) {
			let backwardBox = $('<div style="100%"></div>');
			let titleBox = $('<div style="100%"></div>');
			$(titleBox).appendTo($(backwardBox));
			let titleText = $('<span><b>ประวัติการตรวจ</b></span>');
			$(titleText).appendTo($(titleBox));

			let backwardView = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');
			$(backwardView).appendTo($(backwardBox));

			let limitToggle = doCreateToggleSwitch(patientFullName, patientId, backwardView, currentCaseId);
			$(limitToggle).appendTo($(titleBox));
			$(limitToggle).css({'display': 'inline-block', 'float': 'right'});

			let backwardContentView = await doCreateBackwardItem(patientFullName, backwards, backwardView);
			$(backwardBox).append($(backwardContentView));
			resolve($(backwardBox));
		});
	}

	const doCreateToggleSwitch = function(patientFullName, patientId, backwardView, currentCaseId) {
		const userdata = JSON.parse(localStorage.getItem('userdata'));
		let hospitalId = userdata.hospitalId;
		let switchBox = $('<div></div>');
		let toggleSwitch = $('<label class="switch"></label>');
		let input = $('<input type="checkbox">');
		let slider = $('<span class="slider"></span>');
		$(toggleSwitch).append($(input));
		$(toggleSwitch).append($(slider));
		$(input).on('click', async (evt)=>{
			$(backwardView).loading('start');
			let patientBackwards = undefined;
			let isOn = $(input).prop('checked');
			if (isOn) {
				patientBackwards = await doLoadPatientBackward(hospitalId, patientId, backwardCaseStatus, currentCaseId);
			} else {
				let limit = 2;
				patientBackwards = await doLoadPatientBackward(hospitalId, patientId, backwardCaseStatus, currentCaseId, limit);
			}
			let backwardContent = await doCreateBackwardItem(patientFullName, patientBackwards.Records, backwardView);
			$(backwardView).loading('stop');
		});
		$(switchBox).append($(toggleSwitch));
		return $(switchBox);
	}

	const doCreateBackwardItem = function(patientFullName, backwards, backwardView) {
		return new Promise(function(resolve, reject) {
			$(backwardView).empty();
			let backwardHeader = $('<div style="display: table-row; width: 100%;"></div>');
			$(backwardHeader).appendTo($(backwardView));
			$(backwardHeader).append($('<span style="display: table-cell; text-align: center;" class="header-cell">#</span>'));
			$(backwardHeader).append($('<span style="display: table-cell; text-align: center;" class="header-cell">วันที่</span>'));
			$(backwardHeader).append($('<span style="display: table-cell; text-align: center;" class="header-cell">รายการ</span>'));
			$(backwardHeader).append($('<span style="display: table-cell; text-align: center;" class="header-cell">ภาพ</span>'));
			//$(backwardHeader).append($('<span style="display: table-cell; text-align: center;" class="header-cell">ไฟล์ประวัติ</span>'));
			$(backwardHeader).append($('<span style="display: table-cell; text-align: center;" class="header-cell">ผลอ่าน</span>'));
			$(backwardHeader).append($('<span style="display: table-cell; text-align: center;" class="header-cell">หมายเหตุ/อื่นๆ</span>'));
			const promiseList = new Promise(async function(resolve2, reject2){
				for (let i=0; i < backwards.length; i++) {
					let backwardRow = $('<div style="display: table-row; width: 100%;"></div>');
					let backward = backwards[i];
					let caseCreateAt = util.formatDateTimeStr(backward.createdAt);
					let casedatetime = caseCreateAt.split('T');
					let casedateSegment = casedatetime[0].split('-');
					casedateSegment = casedateSegment.join('');
					let casedate = casedateSegment;
					let dicomCmdBox = doCreateDicomCmdBox(backward.Case_OrthancStudyID, backward.Case_StudyInstanceUID, casedate, backward.hospitalId);
					//let patientHRBackwardBox = await doCreateHRBackwardBox(patientFullName, backward.Case_PatientHRLink, casedate);
					let responseBackwardBox = undefined;
					if ((backward.caseresponses) && (backward.caseresponses.length > 0)) {
						responseBackwardBox = doCreateResponseBackwardBox(backward.id, backward.caseresponses[0].Response_HTML, patientFullName, casedate);
					} else {
						responseBackwardBox = $('<span>-</span>');
					}

					$(backwardRow).append($('<span style="display: table-cell; text-align: center; padding: 4px; vertical-align: middle;">' + (i+1) + '</span>'));
					$(backwardRow).append($('<span style="display: table-cell; text-align: left; padding: 4px; vertical-align: middle;">' + casedate + '</span>'));
					$(backwardRow).append($('<span style="display: table-cell; text-align: left; vertical-align: middle;">' + backward.Case_BodyPart + '</span>'));
					let dicomCmdCell = $('<span style="display: table-cell; text-align: center; padding: 4px; vertical-align: middle;"></span>');
					$(dicomCmdCell).append($(dicomCmdBox));
					$(backwardRow).append($(dicomCmdCell));
					/*
					let hrBackwardCell = $('<span style="display: table-cell; text-align: center; padding: 4px; vertical-align: middle;"></span>');
					$(hrBackwardCell).append($(patientHRBackwardBox));
					$(backwardRow).append($(hrBackwardCell));
					*/
					let responseBackwardCell = $('<span style="display: table-cell; text-align: center; padding: 4px; vertical-align: middle;"></span>');
					$(responseBackwardCell).append($(responseBackwardBox));
					$(backwardRow).append($(responseBackwardCell));
					$(backwardRow).append($('<span style="display: table-cell; text-align: center; padding: 4px; vertical-align: middle;">-</span>'));
					$(backwardRow).appendTo($(backwardView));
				}
				setTimeout(()=> {
					resolve2($(backwardView));
				}, 500);
			});
			Promise.all([promiseList]).then((ob)=>{
				resolve(ob[0]);
			});
		});
	}

	const doCreateDicomCmdBox = function(orthancStudyID, studyInstanceUID, casedate, hospitalId){
		let dicomCmdBox = $('<div></div>');
		/*
		let downloadCmd = $('<span>Download</span>');
		$(downloadCmd).css(commandButtonStyle);
		$(downloadCmd).appendTo($(dicomCmdBox));
		$(downloadCmd).on('click', async (evt)=>{
			$('body').loading('start');
			let downloadRes = await doDownloadDicom(orthancStudyID, hospitalId, casedate);
			$('body').loading('stop');
		});
		*/
		let openViewerCmd = $('<span>เปิดภาพ</span>');
		$(openViewerCmd).appendTo($(dicomCmdBox));
		$(openViewerCmd).css(commandButtonStyle);
		$(openViewerCmd).on('click', async (evt)=>{
			common.doOpenStoneWebViewer(studyInstanceUID);
		});
		return $(dicomCmdBox);
	}

	const doCreateResponseBackwardBox = function(backwardCaseId, responseText, patientFullName, casedate){
		let responseBackwarBox = $('<div></div>');
		let downloadCmd = $('<span>Download</span>');
		$(downloadCmd).css(commandButtonStyle);
		$(downloadCmd).appendTo($(responseBackwarBox));
		$(downloadCmd).on('click', async (evt)=>{
			$('body').loading('start');
      const userdata = JSON.parse(localStorage.getItem('userdata'));
      let reportCreateCallerEndPoint = "/api/casereport/create";
			let fileExt = 'pdf';
			let fileName = (patientFullName.split(' ').join('_')) + '-' + casedate + '.' + fileExt;
      let params = {caseId: backwardCaseId, hospitalId: caseHospitalId, userId: userdata.id, pdfFileName: fileName};
			let reportPdf = await $.post(reportCreateCallerEndPoint, params);
			var pom = document.createElement('a');
			pom.setAttribute('href', reportPdf.reportLink);
			pom.setAttribute('download', fileName);
			pom.click();
			$('body').loading('stop');
		});
		/*
		let pasteCmd = $('<span>Paste</span>');
		$(pasteCmd).css(commandButtonStyle);
		$(pasteCmd).appendTo($(responseBackwarBox));
		$(pasteCmd).on('click', async (evt)=>{
			let yourResponse = $('#SimpleEditor').val();
			let yourNewResponse = yourResponse + '<br/>' + responseText;
			$('#SimpleEditor').jqteVal(yourNewResponse);
			doBackupDraft(backwardCaseId, yourNewResponse);
			keytypecounter = 0;
		});
		*/
		return $(responseBackwarBox);
	}

	const doSeachChatHistory = function(topicId){
		return new Promise(async function(resolve, reject){
			let cloudHistory = undefined;
			let localHistory = undefined;
			let localMsgStorage = localStorage.getItem('localmessage');
			if ((localMsgStorage) && (localMsgStorage !== '')) {
		    let localLog = JSON.parse(localMsgStorage);
				if (localLog) {
					localHistory = await localLog.filter((item)=>{
						if (item.topicId == topicId) {
							return item;
						}
					});
				}
			}
			let cloudLog = await apiconnector.doGetApi('/api/chatlog/select/case/' + topicId, {});
			if (cloudLog) {
				cloudHistory = await cloudLog.Log.filter((item)=>{
					if (item.topicId == topicId) {
						return item;
					}
				});
			}

			if (localHistory) {
				if (cloudHistory) {
					if (localHistory.length > 0) {
						if (cloudHistory.length > 0) {
							let localLastMsg = localHistory[localHistory.length-1];
							let localLastUpd = new Date(localLastMsg.datetime);
							let cloudLastMsg = cloudHistory[cloudHistory.length-1];
							let cloudLastUpd = new Date(cloudLastMsg.datetime);
							if (cloudLastUpd.getTime() > localLastUpd.getTime()){
								resolve(cloudHistory);
							} else {
								resolve(localHistory);
							}
						} else {
							resolve(localHistory);
						}
					} else {
						resolve([]);
					}
				} else {
					resolve(localHistory);
				}
			} else {
				if (cloudHistory) {
					resolve(cloudHistory);
				} else {
					resolve([]);
				}
			}
		});
	}

  return {
    doOpenCaseView
	}
}
