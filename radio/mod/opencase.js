/* opencase.js */
module.exports = function ( jq ) {
	const $ = jq;
	const apiconnector = require('../../case/mod/apiconnect.js')($);
  const util = require('../../case/mod/utilmod.js')($);
  const common = require('../../case/mod/commonlib.js')($);
	const chatman = require('./chatmanager.js')($);
	const ai = require('./ai-lib.js')($);

	const commandLinkStyle = {'padding': '3px', 'cursor': 'pointer', 'border': '1px solid white', 'color': 'white', 'background-color': 'blue'};
	const commandButtonStyle = {'padding': '3px', 'cursor': 'pointer'/*, 'border': '1px solid white', 'color': 'white', 'background-color': 'blue'*/};

	const backwardCaseStatus = [1, 2, 5, 6, 10, 11, 12, 13, 14];
	let caseHospitalId = undefined;
	let casePatientId = undefined;
	let caseId = undefined;
	let caseResponseId = undefined;
	let backupDraftCounter = undefined;
	let syncTimer = undefined;

	const doDownloadZipBlob = function(downloadCmd, link, outputFilename, successCallback){
		let pom = document.createElement('a');
		$.ajax({
			url: link,
			xhrFields:{
				responseType: 'blob'
			},
			xhr: function () {
				var xhr = $.ajaxSettings.xhr();
				xhr.onprogress = function(event) {
					if (event.lengthComputable) {
						// For Download
						let loaded = event.loaded;
						let total = event.total;
						let prog = (loaded / total) * 100;
						let perc = prog.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
						$(downloadCmd).val('Retrieving ' + perc + '%');
					}
				}
				return xhr;
			},
			success: function(data){
				$(downloadCmd).val(' DL/Open ');
				//$(downloadCmd).removeClass('action-btn');
				//$(downloadCmd).addClass('special-action-btn');
				let stremLink = URL.createObjectURL(new Blob([data], {type: 'application/octetstream'}));
				pom.setAttribute('target', "_blank");
				pom.setAttribute('href', stremLink);
				pom.setAttribute('download', outputFilename);
				pom.click();
				successCallback();
				//doResetPingCounterOnOpenCase();
			}
  	});
	}

	const doDownloadDicom = function(evt, caseDicomZipFilename) {
		evt.preventDefault();
		let dicomZipLink = '/img/usr/zip/' + caseDicomZipFilename;
		let pom = document.createElement('a');
		document.body.appendChild(pom);
		pom.setAttribute('target', "_blank");
		pom.setAttribute('href', dicomZipLink);
		pom.setAttribute('download', caseDicomZipFilename);
		pom.click();
		document.body.removeChild(pom);
		common.downloadDicomList = [];
		common.downloadDicomList.push(caseDicomZipFilename);
		return common.downloadDicomList;
	}

	const doDownloadDicomShowProg = function(evt, caseDicomZipFilename) {
		evt.preventDefault();
		let dicomZipLink = '/img/usr/zip/' + caseDicomZipFilename;
		let downloadCmd = $(evt.currentTarget);
		let oldLabel = $(downloadCmd).val();
		$(downloadCmd).prop('disabled', true);
		window.fetch(dicomZipLink, {method: 'GET'}).then((response) => {
			return new Promise(async function(resolve, reject) {
				let reader = response.body.getReader();
				let contentLength = response.headers.get('Content-Length');
				let receivedLength = 0;
				let chunks = [];
				while(true) {
	  			let {done, value} = await reader.read();
				  if (done) {
				    break;
				  }
					chunks.push(value);
				  receivedLength += value.length;
					let prog = (receivedLength / contentLength) * 100;
					let perc = prog.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					$(downloadCmd).val(oldLabel + '(' + perc + '%)');
				}
				let blob = new Blob(chunks);
				//return blob;
				resolve(blob)
			});
		}).then((blob) => {
			let url = window.URL.createObjectURL(blob);
			let pom = document.createElement('a');
			pom.href = url;
			pom.download = caseDicomZipFilename;
      document.body.appendChild(pom);
      pom.click();
      pom.remove();
			$(downloadCmd).val(oldLabel);
			$(downloadCmd).prop('disabled', false);
			//doResetPingCounterOnOpenCase();
		});
		common.downloadDicomList = [];
		common.downloadDicomList.push(caseDicomZipFilename);
		return common.downloadDicomList;
	}

  const onDownloadCmdClick = function(downloadCmd) {
		return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
	    //const downloadCmd = $(evt.currentTarget);
	    const downloadData = $(downloadCmd).data('downloadData');
			let dicomzipfilename = downloadData.dicomzipfilename;
			let dicomzipfilepath = '/img/usr/zip/' + dicomzipfilename;
			let orthanczipfilename = downloadData.studyID + '.zip';
			let orthanczipfilepath = '/img/usr/zip/' + orthanczipfilename;

			let existDicomFileRes = await apiconnector.doCallDicomArchiveExist(dicomzipfilename);
			if (existDicomFileRes.link){
				doDownloadZipBlob(downloadCmd, dicomzipfilepath, dicomzipfilename, ()=>{
					common.downloadDicomList = [];
					common.downloadDicomList.push(dicomzipfilename);
					resolve(existDicomFileRes);
				});
			} else {
				let existOrthancFileRes = await apiconnector.doCallDicomArchiveExist(orthanczipfilename);
				if (existOrthancFileRes.link){
					doDownloadZipBlob(downloadCmd, orthanczipfilepath, dicomzipfilename, ()=>{
						common.downloadDicomList = [];
						common.downloadDicomList.push(dicomzipfilename);
						resolve(existOrthancFileRes);
					});
				} else {
					let studyID = downloadData.studyID;
					let hospitalId = downloadData.hospitalId;
					apiconnector.doCallDownloadDicom(studyID, hospitalId).then((response) => {
						setTimeout(()=>{
							doDownloadZipBlob(downloadCmd, response.link, dicomzipfilename, ()=>{
								common.downloadDicomList = [];
								common.downloadDicomList.push(dicomzipfilename);
								resolve(response);
							});
						}, 2500);
					});
				}
			}
  	});
  }

	const doCreateResultPDFDialog = function(caseId, pdfReportLink /*, createNewResultData, okCmdClickCallback*/){
		const dialogHLBarCss = {'position': 'relative', 'width': '99.4%', 'background-color': common.headBackgroundColor, 'color': 'white', 'text-align': 'center', 'border': '1px solid grey', 'margin-top': '4px'};
		const modalDialog = $('<div></div>');
		$(modalDialog).css(common.quickReplyDialogStyle);
		const contentDialog = $('<div></div>');

		let dialogTitle = $('<h3>ผลอ่าน</h3>');
		let dialogHeader = $('<div></div>');
		$(dialogHeader).append($(dialogTitle));
		$(dialogHeader).css(dialogHLBarCss);

		let dialogContent = $('<div style="border: 1px solid grey; position: relative; width: 99.4%; margin-top: 4px;"></div>');
		let embetObject = $('<object data="' + pdfReportLink + '" type="application/pdf" width="99%" height="380"></object>');
		$(dialogContent).append($(embetObject));
		$(dialogContent).css({'position': 'relative', 'width': '100%'});

		//let okCmd = $('<input type="button" value="  ส่งผลอ่าน  " class="action-btn"/>');
		let closeCmd = $('<input type="button" value="  ปิด  " style="margin-left: 10px;"/>');
		let dialogFooter = $('<div></div>');
		$(dialogFooter)/*.append($(okCmd))*/.append($(closeCmd));
		$(dialogFooter).css(dialogHLBarCss);

		const doCloseDialog = function(){
			$(modalDialog).parent().empty();
			$(modalDialog).parent().removeAttr('style');
			$('#AcceptedCaseCmd').click();
		}

		$(closeCmd).on('click', (evt)=>{
			doCloseDialog();
		});

		/*
		$(okCmd).data('saveResponseData', createNewResultData);
		$(okCmd).on('click', (evt)=>{
			okCmdClickCallback(evt);
			doCloseDialog();
		});
		*/
		$(contentDialog).append($(dialogHeader)).append($(dialogContent)).append($(dialogFooter));
		$(contentDialog).css(common.quickReplyContentStyle);
		return $(modalDialog).append($(contentDialog))
	}

  const onOpenStoneWebViewerCmdClick = function(evt) {
    const openCmd = $(evt.currentTarget);
    const openData = $(openCmd).data('openData');
		common.doOpenStoneWebViewer(openData.studyInstanceUID, openData.hospitalId);
  }

  const onOpenThirdPartyCmdClick = function(evt) {
		const userdata = JSON.parse(localStorage.getItem('userdata'));
		const defaultDownloadPath = userdata.userinfo.User_PathRadiant;
		//const defaultDownloadPath = 'C:/Users/Administrator/Downloads';
		/*
		defaultDownloadPath ต้องไม่มีเครื่องหมาย \
		ให้ใช้ / แทน \
		user ต้องรอให้การดาวน์โหลดเสร็จสมูรณ์ จึงคลิก 3th Party ได้
		*/
		let thirdPartyLink = 'radiant://?n=f&v=';
		if (common.downloadDicomList.length > 0) {
			/*
			if (common.downloadDicomList.length <= 3) {
				common.downloadDicomList.forEach((item, i) => {
					if (i < (common.downloadDicomList.length-1)) {
						thirdPartyLink += defaultDownloadPath + '/' + item + '&v=';
					} else {
						thirdPartyLink += defaultDownloadPath + '/' + item;
					}
				});
				console.log(thirdPartyLink);
				var pom = document.createElement('a');
				pom.setAttribute('href', thirdPartyLink);
				pom.click();
				common.downloadDicomList = [];
			} else {
				$.notify("sorry, not support exceed three file download", "warn");
			}
			*/

			let l = common.downloadDicomList.length;
			let r = l - 3;
			for (let i=(l-1); i>r; i--) {
				if (i >= 0) {
					let item = common.downloadDicomList[i];
					if (item !== '') {
						thirdPartyLink += defaultDownloadPath + '/' + item + '&v=';
					}
				}
			}
			let lastThree = thirdPartyLink.substr(thirdPartyLink.length - 3);
			if (lastThree === '&v=') {
				thirdPartyLink = thirdPartyLink.substring(0, thirdPartyLink.length-3);
			}
			console.log(thirdPartyLink);
			let pom = document.createElement('a');
			pom.setAttribute('href', thirdPartyLink);
			pom.click();
			common.downloadDicomList = [];
		} else {
			$.notify("ขออภัย ยังไม่พบรายการดาวน์โหลดไฟล์", "warn");
		}
  }

	const onMisstakeCaseNotifyCmdClick = function(evt){
		let misstakeCaseData = $(evt.currentTarget).data('misstakeCaseData');
		console.log(misstakeCaseData);
		//let getUserInfoUrl = '/api/user/' + misstakeCaseData.userId;
    //common.doGetApi(getUserInfoUrl, {}).then(async(response)=>{
			//console.log(response.Record);
      //let ownerCaseInfo = response.Record.info;
			//let ownerCaseUser = response.Record.user;

			let owner = misstakeCaseData.Owner;

			let ownerCaseInfoBox = $('<div></div>');
			$(ownerCaseInfoBox).append($('<h4>ข้อมูลผู้ส่งเคส</h4>').css({'text-align': 'center', 'line-height': '14px'}));
			$(ownerCaseInfoBox).append($('<p>ชื่อ ' + owner.User_NameTH + ' ' + owner.User_LastNameTH + '</p>').css({'line-height': '14px'}));
			$(ownerCaseInfoBox).append($('<p>โทร. ' + owner.User_Phone + '</p>').css({'line-height': '14px'}));
			if (owner.User_Mail) {
				$(ownerCaseInfoBox).append($('<p>อีเมล์. ' + owner.User_Mail + '</p>').css({'line-height': '14px'}));
			}
			let notifyMessageBox = $('<table width="100%" cellspacing="0" cellpadding="0" border="0"></table>');
			let optionRow = $('<tr></tr>');
			let optionNameCell = $('<td width="30%">สาเหตุ</td>').css({'padding': '5px'});
			let optionValueCell = $('<td width="*"></td>').css({'padding': '5px'});
			$(optionRow).append($(optionNameCell)).append($(optionValueCell));
			let causeOption = $('<select></select>');
			$(causeOption).append($('<option value="ประวัติไม่ชัดเจน/ขอประวัติเพิ่ม">ประวัติไม่ชัดเจน/ขอประวัติเพิ่ม</option>'));
			$(causeOption).append($('<option value="ภาพไม่ครบ/ต้องการภาพเพิ่มเติม">ภาพไม่ครบ/ต้องการภาพเพิ่มเติม</option>'));
			$(causeOption).append($('<option value="ประวัติ, ภาพ หรือผลผิดคน">ประวัติ, ภาพ หรือผลผิดคน</option>'));
			$(causeOption).append($('<option value="รายการ DF ผิด">รายการ DF ผิด</option>'));
			$(causeOption).append($('<option value="อื่นๆ">อื่นๆ</option>'));
			$(optionValueCell).append($(causeOption));
			$(notifyMessageBox).append($(optionRow));

			let inputRow = $('<tr></tr>');
			let inputNameCell = $('<td">เพิ่มเติม</td>').css({'padding': '5px'});
			let inputValueCell = $('<td></td>').css({'padding': '5px'});
			let inputValue = $('<input type="text" size="25"/>');
			$(inputValueCell).append($(inputValue));
			$(inputRow).append($(inputNameCell)).append($(inputValueCell));
			$(notifyMessageBox).append($(inputRow));
			let radAlertMsg = $('<div></div>');
			$(radAlertMsg).append($(ownerCaseInfoBox)).append($(notifyMessageBox));

			const radconfirmoption = {
	      title: 'แจ้งเคสผิดพลาด',
	      msg: $(radAlertMsg),
	      width: '420px',
	      onOk: function(evt) {
					let causeValue = $(causeOption).val();
					let otherValue = $(inputValue).val();
					const userdata = JSON.parse(localStorage.getItem('userdata'));

					let main = require('../main.js');
					let myWsm = main.doGetWsm();
					if (!myWsm) {
						util.wsm = util.doConnectWebsocketMaster(userdata.username, userdata.usertypeId, userdata.hospitalId, 'none');
						myWsm = util.wsm;
					}
					//let myWsm = util.wsm;
					let sendto = owner.username;
					let userfullname = userdata.userinfo.User_NameTH + ' ' + userdata.userinfo.User_LastNameTH;
					let from = {userId: userdata.id, username: userdata.username, userfullname: userfullname};
					let msg = {cause: causeValue, other: otherValue, caseData: misstakeCaseData};
					let msgSend = {type: 'casemisstake', msg: msg, sendto: sendto, from: from};
			    myWsm.send(JSON.stringify(msgSend));
					$.notify('ระบบฯ แจ้งข้อมูลความผิดพลาดของเคสไปยังผู้ส่งเคสสำร็จ', 'success');
					radConfirmBox.closeAlert();
	      },
	      onCancel: function(evt) {
	        radConfirmBox.closeAlert();
	      }
	    }
	    let radConfirmBox = $('body').radalert(radconfirmoption);
    //});
	}

  const onTemplateSelectorChange = async function(evt) {
		//$('body').loading('start');
		let yourResponse = $('#SimpleEditor').val();
		let templateId = $(evt.currentTarget).val();
		if ((templateId) && (templateId > 0)){
			let result = await doLoadTemplate(templateId);
			if ((result.Record) && (result.Record.length > 0)) {
				let yourNewResponse = yourResponse + '<br/>' + result.Record[0].Content;
				$('#SimpleEditor').jqteVal(yourNewResponse);
				await doBackupDraft(caseId, yourNewResponse);
			}
		} else if (templateId == 0) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let radioId = userdata.id;
			let allTemplates = await doLoadTemplateList(radioId);
			if (allTemplates.Options.length > 0) {
				$('#TemplateSelector').empty();
        allTemplates.Options.forEach((item, i) => {
          $('#TemplateSelector').append('<option value="' + item.Value + '">' + item.DisplayText + '</option>');
        });
      } else {
				$.notify('ระบบฯ ไม่พบรายการ Template ของคุณ', 'warn');
			}
		}
		//$('body').loading('stop');
  }

	const onCreateNewResponseCmdClick = async function(evt) {
		let responseHTML = $('#SimpleEditor').val();
		if ((responseHTML) && (responseHTML !== '')) {
			const createNewResponseCmd = $(evt.currentTarget);
			const saveNewResponseData = $(createNewResponseCmd).data('createNewResponseData');
	    const userdata = JSON.parse(localStorage.getItem('userdata'));
			const radioNameTH = userdata.userinfo.User_NameTH + ' ' + userdata.userinfo.User_LastNameTH;
			/*
			ต้องทดสอบการ Paste จาก MS Word แบบละเียดอีกที
			*/
			const startPointText = '<!--StartFragment-->'
			const endPointText = '<!--EndFragment-->';

			let responsetype = 'draft';
			let caseId = saveNewResponseData.caseId;
			let reporttype = saveNewResponseData.reporttype;
			let userId = userdata.id;

			let responseText = responseHTML;
			let tempToken = responseText.replace('\n', '');
			let startPosition = tempToken.indexOf(startPointText);
			if (startPosition >= 0) {
				let endPosition = tempToken.indexOf(endPointText);
				tempToken = tempToken.slice((startPosition+20), (endPosition));
			}
			/*
			tempToken = tempToken.split(startPointText).join('<div>');
			tempToken = tempToken.split(endPointText).join('</div>');
			*/
			tempToken = tempToken.replace(startPointText, '<div>');
			tempToken = tempToken.replace(endPointText, '</div>');
			if (tempToken !== '') {
				let draftbackup = {caseId: caseId, content: tempToken, backupAt: new Date()};
				localStorage.setItem('draftbackup', JSON.stringify(draftbackup));
				responseText = toAsciidoc(tempToken);
				console.log(responseText);
				let rsW = saveNewResponseData.resultFormat.width;
				let fnS = saveNewResponseData.resultFormat.fontsize;
				let rsH = doCalResultHeigth(tempToken, rsW, fnS);
				console.log(rsW, fnS, rsH);
				let saveData = {Response_HTML: tempToken, Response_Text: responseText, Response_Type: responsetype, reporttype: reporttype, Response_A4Height: rsH};
				let casedate = saveNewResponseData.casedate;
				let casetime = saveNewResponseData.casetime;
				let patientFullName = saveNewResponseData.patientFullName;
				let fileExt = 'pdf';
				let fileName = (patientFullName.split(' ').join('_')) + '-' + casedate + '-' + casetime + '.' + fileExt;

				saveNewResponseData.Response_Text = responseText;

				let params = {
					caseId: caseId,
					userId: userId,
					radioNameTH: radioNameTH,
					data: saveData,
					hospitalId: caseHospitalId,
					pdfFileName: fileName
				};

				if ((params.caseId) && (Number(params.caseId) > 0)) {
					if (caseResponseId){
						params.responseId = caseResponseId;
					}
					//doCreateResultManagementDialog(saveNewResponseData);
					//let saveResponseRes = doCallSaveResult(params);
					//->ตรงนี้คืออะไร
					//-> ตรงนี้คือการสั่งให้เซิร์ฟเวอร์สร้างผลอ่าน pdf ไว้ก่อนล่วงหน้า
					params.reporttype = 'normal';
					//let saveResponseApiURL = '/api/uicommon/radio/saveresponse';
					let saveResponseApiURL = '/api/caseresponse/save';
					$.post(saveResponseApiURL, params, async function(saveResponseRes){
						if ((saveResponseRes.result) && (saveResponseRes.result.responseId)) {
							caseResponseId = saveResponseRes.result.responseId;
							saveNewResponseData.responseid = caseResponseId;
							saveNewResponseData.reportPdfLinkPath = '/img/usr/pdf/' + fileName;
							doCreateResultManagementDialog(saveNewResponseData);
						} else {
							let callRes = await doCallDraftRespons(caseId);
							if (callRes.Record.length > 0) {
								caseResponseId = callRes.Record[0].id;
								saveNewResponseData.responseid = caseResponseId;
								saveNewResponseData.reportPdfLinkPath = '/img/usr/pdf/' + fileName;
								doCreateResultManagementDialog(saveNewResponseData);
							} else {
								console.log({error: 'not found case responseId'});
							}
						}
					}).catch((err) => {
						console.log(err);
						$.notify("เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ โปรดแจ้งผู้ดูแลระบบ", "error");
						doReportBugOpenCase({params: params, url: saveResponseApiURL}, 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร');
					});
				} else {
					$.notify('ข้อมูลที่ต้องการบันทึกไม่ถูกต้อง ไม่พบหมายเลขเคสของคุณ', 'error');
					doReportBugOpenCase({params: params, url: saveResponseApiURL}, 'ไม่พบหมายเลขเคสของคุณ');
				}
			} else {
				$.notify("ข้อความในผลอ่านว่างเปล่า ไม่สามารถบันทึกได้", "error");
			}
		} else {
			$.notify("ผลอ่านว่างเปล่า ไม่สามารถบันทึกได้", "error");
		}
	}

	const doCreateResultManagementDialog = function(saveResponseData){
		let report = {reportPdfLinkPath: saveResponseData.reportPdfLinkPath, reportPages: saveResponseData.reportPages, patientFullName: saveResponseData.patientFullName};
		saveResponseData.report = report;
		let saveTypeOptionBox = $('<table width="100%" border="0" cellspacing="0" cellpadding="2"></table>');

		let selectSaveTypeOptionGuideRow = $('<tr></tr>');
		$(selectSaveTypeOptionGuideRow).css({'background-color': common.headBackgroundColor, 'color': 'white'});
		$(selectSaveTypeOptionGuideRow).appendTo($(saveTypeOptionBox));
		let guideCell = $('<td colspan="2" align="center"></td>');
		$(guideCell).append($('<h3>Result management</h3>'));
		$(guideCell).appendTo($(selectSaveTypeOptionGuideRow));

		let normalSaveTypeOptionRow = $('<tr class="case-row" style="cursor: pointer;"></tr>');
		$(normalSaveTypeOptionRow).appendTo($(saveTypeOptionBox));
		let normalPointIcon = $('<img src="/images/triangle-right-icon.png" width="25px" height="auto" style="display: none;"/>');
		let arrowPointerIconCell = $('<td width="15%" align="center"></td>');
		$(arrowPointerIconCell).append($(normalPointIcon));
		let labelOptionCell = $('<td width="*" style="border: 2px solid grey;"></td>');
		$(labelOptionCell).append($('<span>Normal</span>'));
		$(normalSaveTypeOptionRow).append($(arrowPointerIconCell)).append($(labelOptionCell))
		$(normalSaveTypeOptionRow).hover(()=>{$(normalPointIcon).toggle();})

		let attentionSaveTypeOptionRow = $('<tr class="case-row" style="cursor: pointer;"></tr>');
		$(attentionSaveTypeOptionRow).appendTo($(saveTypeOptionBox));
		let attentionPointIcon = $('<img src="/images/triangle-right-icon.png" width="25px" height="auto" style="display: none;"/>');
		arrowPointerIconCell = $('<td align="center"></td>');
		$(arrowPointerIconCell).append($(attentionPointIcon));
		labelOptionCell = $('<td style="border: 2px solid grey;"></td>');
		$(labelOptionCell).append($('<span>Need Attention</span>'));
		$(attentionSaveTypeOptionRow).append($(arrowPointerIconCell)).append($(labelOptionCell))
		$(attentionSaveTypeOptionRow).hover(()=>{$(attentionPointIcon).toggle();})

		let criticalSaveTypeOptionRow = $('<tr class="case-row" style="cursor: pointer;"></tr>');
		$(criticalSaveTypeOptionRow).appendTo($(saveTypeOptionBox));
		let criticalPointIcon = $('<img src="/images/triangle-right-icon.png" width="25px" height="auto" style="display: none;"/>');
		arrowPointerIconCell = $('<td align="center"></td>');
		$(arrowPointerIconCell).append($(criticalPointIcon));
		labelOptionCell = $('<td style="border: 2px solid grey;"></td>');
		$(labelOptionCell).append($('<span>Critical</span>'));
		$(criticalSaveTypeOptionRow).append($(arrowPointerIconCell)).append($(labelOptionCell))
		$(criticalSaveTypeOptionRow).hover(()=>{$(criticalPointIcon).toggle();})

		let preliminarySaveTypeOptionRow = $('<tr class="case-row" style="cursor: pointer;"></tr>');
		$(preliminarySaveTypeOptionRow).appendTo($(saveTypeOptionBox));
		let preliminaryPointIcon = $('<img src="/images/triangle-right-icon.png" width="25px" height="auto" style="display: none;"/>');
		arrowPointerIconCell = $('<td align="center"></td>');
		$(arrowPointerIconCell).append($(preliminaryPointIcon));
		labelOptionCell = $('<td style="border: 2px solid grey;"></td>');
		$(labelOptionCell).append($('<span>Pre-Liminary</span>'));
		$(preliminarySaveTypeOptionRow).append($(arrowPointerIconCell)).append($(labelOptionCell))
		$(preliminarySaveTypeOptionRow).hover(()=>{$(preliminaryPointIcon).toggle();})

		let selectSaveTypeOptionControlRow = $('<tr></tr>');
		$(selectSaveTypeOptionControlRow).css({'background-color': common.headBackgroundColor});
		$(selectSaveTypeOptionControlRow).appendTo($(saveTypeOptionBox));
		let controlCell = $('<td colspan="2" align="center"></td>');
		let backCmd = $('<input type="button" value=" Back "/>');
		$(backCmd).on('click', (evt)=>{
			$('#quickreply').empty();
			$('#quickreply').removeAttr('style');
		});
		$(controlCell).append($(backCmd));
		$(controlCell).appendTo($(selectSaveTypeOptionControlRow));

		$('#quickreply').css(common.quickReplyDialogStyle);
		let saveTypeOptionBoxStyle = { 'background-color': '#fefefe', 'margin': '70px auto', 'padding': '0px', 'border': '2px solid #888', 'width': '420px', 'height': 'auto'};
		$(saveTypeOptionBox).css(saveTypeOptionBoxStyle);
		$('#quickreply').append($(saveTypeOptionBox));

		$(normalSaveTypeOptionRow).data('saveResponseData', saveResponseData);
		$(normalSaveTypeOptionRow).on('click', onNormalSaveOptionCmdClick);
		$(attentionSaveTypeOptionRow).data('saveResponseData', saveResponseData);
		$(attentionSaveTypeOptionRow).on('click', onAttentionSaveOptionCmdClick);
		$(criticalSaveTypeOptionRow).data('saveResponseData', saveResponseData);
		$(criticalSaveTypeOptionRow).on('click', onCriticalSaveOptionCmdClick);
		$(preliminarySaveTypeOptionRow).data('saveResponseData', saveResponseData);
		$(preliminarySaveTypeOptionRow).on('click', onPreliminarySaveOptionCmdClick);
	}

	const onNormalSaveOptionCmdClick = async function(evt) {
		const responseType = 'normal';
		const reportType = 'normal';
		const normalSaveResponseCmd = $(evt.currentTarget);
		const saveResponseData = $(normalSaveResponseCmd).data('saveResponseData');
		await doSubmitResult(responseType, reportType, saveResponseData)
	}

	const onAttentionSaveOptionCmdClick = async function(evt) {
		const responseType = 'normal';
		const reportType = 'attention';
		const normalSaveResponseCmd = $(evt.currentTarget);
		const saveResponseData = $(normalSaveResponseCmd).data('saveResponseData');
		await doSubmitResult(responseType, reportType, saveResponseData)
	}

	const onCriticalSaveOptionCmdClick = async function(evt) {
		const responseType = 'normal';
		const reportType = 'cristical';
		const normalSaveResponseCmd = $(evt.currentTarget);
		const saveResponseData = $(normalSaveResponseCmd).data('saveResponseData');
		await doSubmitResult(responseType, reportType, saveResponseData)
	}

	const onPreliminarySaveOptionCmdClick = async function(evt) {
		const responseType = 'normal';
		const reportType = 'preliminary';
		const normalSaveResponseCmd = $(evt.currentTarget);
		const saveResponseData = $(normalSaveResponseCmd).data('saveResponseData');
		await doSubmitResult(responseType, reportType, saveResponseData)
	}

	const doSubmitResult = function(responseType, reportType, saveResponseData){
		return new Promise(async function(resolve, reject) {
			//$('body').loading('start');
			//console.log(saveResponseData);

	    const userdata = JSON.parse(localStorage.getItem('userdata'));
			let caseId = saveResponseData.caseId
			let userId = userdata.id;
			let radioNameTH = userdata.userinfo.User_NameTH + ' ' + userdata.userinfo.User_LastNameTH;
			let params = {
				caseId: caseId,
				userId: userId,
				radioNameTH: radioNameTH,
				responseId: caseResponseId,
				hospitalId: caseHospitalId,
				reporttype: reportType,
				report: saveResponseData.report,
			};

			params.report.Response_Text = saveResponseData.patientFullName + '\n====================\n' + saveResponseData.Response_Text;

			let saveResponseRes = await doCallSubmitResult(params);
			//Uri = '/api/uicommon/radio/submitresult';
			console.log(saveResponseRes);

			if ((saveResponseRes.status.code == 200) || (saveResponseRes.status.code == 203)){
				$.notify("ส่งผลอ่านเข้า cloud สำเร็จ", "success");
				//$('body').loading('stop');
				$('#quickreply').empty();
				$('#quickreply').removeAttr('style');
				$("#dialog").empty();
				if (saveResponseData.previewOption === 0){
					resolve(saveResponseRes);
					let responseTextFilename = saveResponseData.patientFullName.split(' ').join('_') + '.txt';
					//console.log(responseTextFilename);
					//doSaveResponseTextToLocalFile(saveResponseData.Response_Text, responseTextFilename);
					setTimeout(()=>{
						$('#AcceptedCaseCmd').click();
					}, 1800);
				} else if (saveResponseData.previewOption === 1) {
					let pdfReportLink = saveResponseData.reportPdfLinkPath + '?t=' + common.genUniqueID();
					console.log(pdfReportLink);
					/*
					saveNewResponseData.reportPdfLinkPath = saveResponseRes.reportLink;
					saveNewResponseData.reportPages = pdfReportPages;
					*/
					let resultPDFDialog = doCreateResultPDFDialog(caseId, pdfReportLink);
					$(resultPDFDialog).css({'margin': '20px auto'});
					$("#dialog").append($(resultPDFDialog));
					resolve(pdfReportLink);
					let responseTextFilename = saveResponseData.patientFullName.split(' ').join('_') + '.txt';
					//doSaveResponseTextToLocalFile(saveResponseData.Response_Text, responseTextFilename);
				}
			} else {
				$.notify("ไม่สามารถส่งผลอ่าน - Error โปรดติดต่อผู้ดูแลระบบ", "error");
				doReportBugOpenCase({params: params, url: '/api/uicommon/radio/submitresult'}, 'ไม่พบหมายเลขเคสของคุณ');
				//$('body').loading('stop');
				reject({errer: 'Submit Case Result Error'});
			}
		});
	}

	const doSaveDraft = function(saveDraftResponseData) {
		return new Promise(async function(resolve, reject) {
			let type = saveDraftResponseData.type;
			/*
			let caseId = saveDraftResponseData.caseId;
			*/
			let userdata = JSON.parse(localStorage.getItem('userdata'));
			let userId = userdata.id;
			let radioNameTH = userdata.userinfo.User_NameTH + ' ' + userdata.userinfo.User_LastNameTH;
			let responseHTML = $('#SimpleEditor').val();
			let startPointText = '<!--StartFragment-->';
			let endPointText = '<!--EndFragment-->';
			let tempToken = responseHTML.replace('\n', '');
			let startPosition = tempToken.indexOf(startPointText);
			if (startPosition >= 0) {
				let endPosition = tempToken.indexOf(endPointText);
				tempToken = tempToken.slice((startPosition+20), (endPosition));
			}
			/*
			tempToken = tempToken.split(startPointText).join('<div>');
			tempToken = tempToken.split(endPointText).join('</div>');
			*/
			tempToken = tempToken.replace(startPointText, '<div>');
			tempToken = tempToken.replace(endPointText, '</div>');
			let draftbackup = {caseId: caseId, content: tempToken, backupAt: new Date()};
			localStorage.setItem('draftbackup', JSON.stringify(draftbackup));
			responseText = toAsciidoc(tempToken);
			let saveData = {Response_HTML: tempToken, Response_Text: responseText, Response_Type: type};
			let params = {caseId: caseId, userId: userId, data: saveData, responseId: caseResponseId, reporttype: type, radioNameTH: radioNameTH};
			let saveResponseRes = await doCallSaveResponse(params);
			resolve(saveResponseRes);
		});
	}

	const onSaveDraftResponseCmdClick = function(evt) {
		return new Promise(async function(resolve, reject) {
			let responseHTML = $('#SimpleEditor').val();
			if (responseHTML !== '') {
				//$('body').loading('start');
				const saveDraftResponseCmd = $(evt.currentTarget);
		    const saveDraftResponseData = $(saveDraftResponseCmd).data('saveDraftResponseData');
				let draftResponseRes = await doSaveDraft(saveDraftResponseData);
				//console.log(draftResponseRes);
				//if ((draftResponseRes.status.code == 200) || (draftResponseRes.status.code == 203)){
				if (draftResponseRes.status.code == 200) {
					caseResponseId = draftResponseRes.result.responseId;
					if (!caseResponseId) {
						$.notify("เกิดความผิดพลาด Case Response API", "error");
					}
					$.notify("บันทึก Draft สำเร็จ", "success");
					//$('body').loading('stop');
				} else {
					$.notify("ไม่สามารถบันทึก Draft - Error โปรดติดต่อผู้ดูแลระบบ", "error");
					//$('body').loading('stop');
				}
				//doResetPingCounterOnOpenCase();
				resolve(draftResponseRes);
			} else {
				$.notify("โปรดพิมพ์ผลอ่านก่อนครับ", "warn");
				resolve();
			}
		});
	}

	const onAddNewTemplateCmdClick = function(evt) {
		let jqtePluginStyleUrl = '../../lib/jqte/jquery-te-1.4.0.css';
		$('head').append('<link rel="stylesheet" href="' + jqtePluginStyleUrl + '" type="text/css" />');
		$('head').append('<link rel="stylesheet" href="../case/css/scanpart.css" type="text/css" />');
		let jqtePluginScriptUrl = '../../lib/jqte/jquery-te-1.4.0.min.js';
		$('head').append('<script src="' + jqtePluginScriptUrl + '"></script>');

		const simpleEditorConfig = $.extend({}, common.jqteConfig);

		let newTemplateData = $(evt.currentTarget).data('newTemplateData');
		let templateNameInput = $('<input type="text" id="TemplateName" style="width: 250px;"/>');
		let modalityInput = $('<select id="Modality" style="width: 80px;"></select>');

		common.modalitySelectItem.forEach((item, i) => {
			let optionItem = $('<option value="' + item +'">' + item + '</option>');
			$(modalityInput).append($(optionItem));
		});

    let hospitalSelect = $('<select id="Hospital"></select>');
		let modifyHospitalListCmd = $('<input type="hidden" id="ModifyHospitalListCmd"/>');
		$(modifyHospitalListCmd).data('hospitalsData', [{id: 0}]);
		$(hospitalSelect).append('<option value="0">All</option>');
		newTemplateData.hospitalmap.forEach((item, i) => {
			$(hospitalSelect).append('<option value="' + item.id + '">' + item.Hos_Name + '</option>');
		});
		$(hospitalSelect).on('click', (evt)=>{
			let newHosVal = [{id: $(hospitalSelect).val()}];
			$(modifyHospitalListCmd).data('hospitalsData', newHosVal);
		});
    let studyDescriptionInput = $('<input type="text" id="StudyDescription" style="width: 250px;"/>');
		let showLegentCmd = common.doCreateLegentCmd(common.doShowStudyDescriptionLegentCmdClick);

		$(modalityInput).val(newTemplateData.Modality);
		$(studyDescriptionInput).val(newTemplateData.StudyDescription);

		//$(modifyHospitalListCmd).data('templateData', newTemplateData);
		let { onModifyHospitalList, onSaveNewCmdClick } = require('./templatelib.js')($);
		//$(modifyHospitalListCmd).on('click', onModifyHospitalList);   //<-----


		let readySwitchBox = $('<select></select>');
		$(readySwitchBox).append('<option value="1">Yes</option>');
		$(readySwitchBox).append('<option value="0">No</option>');

		let tableControlInputView = $('<table width="100% cellpadding="2" cellspacing="2" border="0"></table>');

		let tableRow = $('<tr></tr>');
		$(tableRow).append($('<td align="left"><span style="font-weight: bold;">ชื่อ Template:</span></td>'));
		let inputCell = $('<td colspan="3" align="left"></td>');
		$(inputCell).append($(templateNameInput))
		$(tableRow).append($(inputCell));
		$(tableControlInputView).append($(tableRow));


		tableRow = $('<tr></tr>');
		$(tableRow).append($('<td width="25%" align="left"><span style="font-weight: bold;">Modality:</span></td>'));
		inputCell = $('<td width="25%" align="left"></td>');
		$(inputCell).append($(modalityInput))
		$(tableRow).append($(inputCell));
		//$(tableControlInputView).append($(tableRow));

		//tableRow = $('<tr></tr>');
		$(tableRow).append($('<td width="25%" align="left"><span style="font-weight: bold;">Hospital:</span></td>'));
		inputCell = $('<td width="*" align="left"></td>');
		//$(inputCell).append($(hospitalInput)).append($(modifyHospitalListCmd));
		$(inputCell).append($(hospitalSelect));
		$(inputCell).append($(modifyHospitalListCmd));
		//$(hospitalInput).attr('readonly', true);
		$(tableRow).append($(inputCell));

		$(tableControlInputView).append($(tableRow));

		tableRow = $('<tr></tr>');
		$(tableRow).append($('<td align="left"><span style="font-weight: bold;">Study Desc.:</span></td>'));
		inputCell = $('<td colspan="3" align="left"></td>');
		$(inputCell).append($(studyDescriptionInput)).append($(showLegentCmd));
		$(tableRow).append($(inputCell));
		$(tableControlInputView).append($(tableRow));

		tableRow = $('<tr></tr>');
		$(tableRow).append($('<td align="left"><span style="font-weight: bold;">Auto Apply:</span></td>'));
		inputCell = $('<td colspan="3" align="left"></td>');
		$(inputCell).append($(readySwitchBox));
		$(tableRow).append($(inputCell));
		$(tableControlInputView).append($(tableRow));


		//$(modifyHospitalListCmd).data('hospitalsData', []);

		let yourTemplate = $('#SimpleEditor').val();

    let templateViewBox = $('<div style="width: 100%; border: 2px solid grey; background-color: #ccc;"></div>');
    let simpleEditor = $('<input type="text" id="SimpleEditor"/>');
    $(simpleEditor).appendTo($(templateViewBox));
    $(simpleEditor).jqte(simpleEditorConfig);

		$(templateViewBox).find('#SimpleEditor').jqteVal(yourTemplate);
    $(templateViewBox).find('.jqte_editor').css({ height: '300px' });
    let templateCmdBar = $('<div style="width: 100%; text-align: center; margin-top: 5px;"></div>');
    let saveCmd = $('<input type="button" value=" Save" class="action-btn"/>');
    $(saveCmd).appendTo($(templateCmdBar));
    $(saveCmd).data('templateData', newTemplateData);
    $(templateCmdBar).append($('<span>  </span>'));
    $(saveCmd).on('click', (evt)=>{
			if($(templateNameInput).val() === '') {
				$(templateNameInput).css('border', '1px solid red');
				$.notify('ชื่อ Template ต้องไม่ว่าง', 'error');
			} else if($(studyDescriptionInput).val() === '') {
				$(templateNameInput).css('border', '');
				$(studyDescriptionInput).css('border', '1px solid red');
				$.notify('Study Description ต้องไม่ว่าง', 'error');
			} else {
				$(studyDescriptionInput).css('border', '');
				let autoApply = $(readySwitchBox).val();
				onSaveNewCmdClick(evt, autoApply, false);
				$(cancelCmd).click();
			}
		});
    let cancelCmd = $('<input type="button" value=" Cancel "/>');
    $(cancelCmd).appendTo($(templateCmdBar));
    $(cancelCmd).on('click',(evt)=>{
			$('#quickreply').empty();
			$('#quickreply').removeAttr('style');
		});

		let saveNewTemplateBox = $('<div></div>');
		$(saveNewTemplateBox).append($(tableControlInputView)).append($(templateViewBox)).append($(templateCmdBar));

		$('#quickreply').css(common.quickReplyDialogStyle);
		let saveTypeOptionBoxStyle = { 'background-color': '#fefefe', 'margin': '70px auto', 'padding': '0px', 'border': '2px solid #888', 'width': '620px', 'height': 'auto'};
		$(saveNewTemplateBox).css(saveTypeOptionBoxStyle);
		$('#quickreply').empty().append($(saveNewTemplateBox));
	}

	const onBackToOpenCaseCmdClick = function(evt) {
		$('#AcceptedCaseCmd').click();
	}

  const doOpenHR = function(link, patientFullName, casedate){
		//$('body').loading('start');
    //window.open(link, '_blank');
		let filePaths = link.split('/');
		let fileNames = filePaths[filePaths.length-1];
		let fileName = fileNames.split('.');
		let fileExt = fileName[1];
		fileName = (patientFullName.split(' ').join('_')) + '-' + casedate + '.' + fileExt;
		window.fetch(link, {method: 'GET'}).then(response => response.blob()).then(blob => {
			let url = window.URL.createObjectURL(blob);
			let pom = document.createElement('a');
			pom.href = url;
			pom.download = fileName;
      document.body.appendChild(pom);
      pom.click();
      pom.remove();
		});
  }

  const doRenderPatientHR = function(hrlinks, patientFullName, casedate) {
    return new Promise(async function(resolve, reject) {
      let hrBox = $('<div style="width: 100%; padding: 5px;"></div>');
			let hrTable = $('<table width="100%" border="0" cellspacing="0" cellpadding="2"></table>');
			$(hrBox).append($(hrTable));
			if ((hrlinks) && (hrlinks.length > 0)){
	      await hrlinks.forEach((item, i) => {
					//console.log(item);
					let filePaths = item.link.split('/');
					let fileNames = filePaths[filePaths.length-1];
					let fileName = fileNames.split('.');
					let fileExt = fileName[1];
					let patientName = patientFullName.split(' ').join('_');
					patientName = patientName.substring(0, 12);
					let linkText = patientName + ' (' + (i+1) + ')' + '.' + fileExt;
					//$(patientHRLink).text(linkText);
					let fileTypeLow = fileExt.toLowerCase();
					let patientHRButton = $('<div class="action-btn" style="position: relative; display: inline-block; cursor: pointer; text-align: center; width: 99%;">' + linkText + '</div>');
					if ((fileTypeLow  === 'zip') || (fileTypeLow  === 'rar')) {
						patientHRButton = $('<input type="button" value="' + linkText + '" class="action-btn" style="cursor: pointer; width: 100%;"/>');
					}
					$(patientHRButton).on("click", function(evt){
						evt.preventDefault();
						if ((fileTypeLow  === 'zip') || (fileTypeLow  === 'rar')) {
							let dwnList = doDownloadDicom(evt, fileNames);
						} else {
	          	doOpenHR(item.link, patientFullName, casedate);
						}
	    		});
					let hrRow = $('<tr></tr>');
					let hrCell = $('<td width="100%" align="left"></td>');
					$(hrRow).append($(hrCell))
					$(hrCell).append($(patientHRButton));
					$(hrTable).append($(hrRow));
	      });
			}
			if (hrlinks.length == 0) {
      	resolve($(hrBox));
			} else {
				window.fetch(hrlinks[0].link, {method: 'GET'}).then(response => response.blob()).then(blob => {
					let filePaths = hrlinks[0].link.split('/');
					let fileNames = filePaths[filePaths.length-1];
					let fileName = fileNames.split('.');
					let fileExt = fileName[1];
					let patientName = patientFullName.split(' ').join('_');
					fileName = patientName + '-' + casedate + '.' + fileExt;
					let url = window.URL.createObjectURL(blob);
					console.log(url);
					/*
					let pom = document.createElement('a');
					pom.href = url;
					pom.download = fileName;
					document.body.appendChild(pom);
					pom.click();
					pom.remove();
					*/
					resolve($(hrBox));
				});
			}
    });
  }

	//const doCreateDicomCmdBox = function(orthancStudyID, studyInstanceUID, casedate, casetime, hospitalId){
	const doCreateDicomCmdBox = function(caseDicomZipFilename){
		let dicomCmdBox = $('<div></div>');
		//let downloadCmd = $('<div class="action-btn" style="position: relative; display: inline-block; width: 110px;">Download</div>');
		let downloadCmd = $('<input type="button" value="Download" class="action-btn" style="cursor: pointer; width: 100%;"/>');
		$(downloadCmd).css(commandButtonStyle);
		$(downloadCmd).appendTo($(dicomCmdBox));
		$(downloadCmd).on('click', async (evt)=>{
			//$('body').loading('start');
			let downloadList = doDownloadDicom(evt, caseDicomZipFilename);
			//$('body').loading('stop');
		});
		/*
		let openViewerCmd = $('<span class="action-btn">Open</span>');
		$(openViewerCmd).appendTo($(dicomCmdBox));
		$(openViewerCmd).css(commandButtonStyle);
		$(openViewerCmd).on('click', async (evt)=>{
			common.doOpenStoneWebViewer(studyInstanceUID, hospitalId);
		});
		*/
		return $(dicomCmdBox);
	}

	const doCreateHRBackwardBox = function(patientFullName, patientHRLinks, casedate){
		return new Promise(async function(resolve, reject) {
			let hrbackwardBox = $('<div"></div>');
			if ((patientHRLinks) && (patientHRLinks.length > 0)){
				await patientHRLinks.forEach((item, i) => {
					let filePaths = item.link.split('/');
					let fileNames = filePaths[filePaths.length-1];
					let fileName = fileNames.split('.');
					let fileCode = fileName[0];
					let codeLink = $('<div class="action-btn" style="position: relative; display: inline-block; width: 140px; cursor: pointer;">' + fileCode + '</div>');
					$(codeLink).css(commandButtonStyle);
					let fileTypeLow = fileName[1].toLowerCase();
					if ((fileTypeLow  === 'zip') || (fileTypeLow  === 'rar')) {
						codeLink = $('<input type="button" value="Attach" class="action-btn" style="cursor: pointer; width: 100%;"/>');
					}
					$(hrbackwardBox).append($(codeLink));
					$(codeLink).on('click',(evt)=>{
						evt.preventDefault();
						if ((fileTypeLow  === 'zip') || (fileTypeLow  === 'rar')) {
							let caseDicomZipFilename = fileCode + '.' + fileName[1];
							let downloadList = doDownloadDicom(evt, caseDicomZipFilename);
						} else {
							doOpenHR(item.link, patientFullName, casedate);
						}
					});
				});
			}
			resolve($(hrbackwardBox));
		});
	}

	const doCreateResponseBackwardBox = function(backwardCaseId, responseId, responseText, patientFullName, casedate){
		let responseBackwarBox = $('<div></div>');
		let downloadCmd = $('<div class="action-btn" style="position: relative; display: inline-block; width: 110px;">Download</div>');
		$(downloadCmd).css(commandButtonStyle);
		$(downloadCmd).appendTo($(responseBackwarBox));
		$(downloadCmd).on('click', async (evt)=>{
			//$('body').loading('start');
      const userdata = JSON.parse(localStorage.getItem('userdata'));
      let reportCreateCallerEndPoint = "/api/casereport/create";
			let fileExt = 'pdf';
			let fileName = (patientFullName.split(' ').join('_')) + '-' + casedate + '.' + fileExt;
      let params = {caseId: backwardCaseId, responseId:responseId, hospitalId: caseHospitalId, userId: userdata.id, pdfFileName: fileName};
			//let reportPdf = await apiconnector.doCallApi(reportCreateCallerEndPoint, params);
			let reportPdf = await apiconnector.doCallApiDirect(reportCreateCallerEndPoint, params);
			var pom = document.createElement('a');
			pom.setAttribute('href', reportPdf.reportLink);
			pom.setAttribute('download', fileName);
			pom.click();
			//$('body').loading('stop');
		});
		let pasteCmd = $('<div class="action-btn" style="position: relative; display: inline-block; width: 110px;">Paste</div>');
		$(pasteCmd).css(commandButtonStyle).css({'margin-left': '8px'});
		$(pasteCmd).appendTo($(responseBackwarBox));
		$(pasteCmd).on('click', async (evt)=>{
			let yourResponse = $('#SimpleEditor').val();
			let yourNewResponse = yourResponse + '<br/>' + responseText;
			$('#SimpleEditor').jqteVal(yourNewResponse);
			//await doBackupDraft(backwardCaseId, yourNewResponse);
		});
		return $(responseBackwarBox);
	}

	const doCreateToggleSwitch = function(patientFullName, backwardView, currentCaseId) {
		let switchBox = $('<div style="position: relative; cursor: pointer;"></div>');
		let switchIcon = $('<img src="/images/arrow-down-icon.png" width="20px" height="auto" style="position: relative; display: inline-block; margin-top: 2px;"/>');
		$(switchIcon).data('state', {state: 'off'});
		let switchText = $('<span style="margin-left: 10px;">แสดงทั้งหมด</span>');
		$(switchBox).append($(switchIcon)).append($(switchText));
			$(switchBox).on('click', async (evt)=>{
			$(backwardView).loading('start');
			let patientBackwards = undefined;
			let switchState = $(switchIcon).data('state');
				if (switchState.state == 'off') {
				patientBackwards = await doLoadPatientBackward(caseHospitalId, casePatientId, backwardCaseStatus, currentCaseId);
				$(switchIcon).data('state', {state: 'on'});
				$(switchIcon).css({ WebkitTransform: 'rotate(180deg)'});
				$(switchText).text('สองรายการล่าสุด');
			} else {
				let limit = 2;
				patientBackwards = await doLoadPatientBackward(caseHospitalId, casePatientId, backwardCaseStatus, currentCaseId, limit);
				$(switchIcon).data('state', {state: 'off'});
				$(switchIcon).css({ WebkitTransform: 'rotate(0deg)'});
				$(switchText).text('แสดงทั้งหมด');
			}
			let backwardContent = await doCreateBackwardItem(patientFullName, patientBackwards.Records, backwardView);
			$(backwardView).loading('stop');
		});
		return $(switchBox);
	}

	const doCreateBackwardItem = function(patientFullName, backwards, backwardView) {
		return new Promise(function(resolve, reject) {
			$(backwardView).empty();
			let backwardHeader = $('<div style="display: table-row; width: 100%;"></div>');
			$(backwardHeader).appendTo($(backwardView));
			$(backwardHeader).append($('<div style="display: table-cell; text-align: center;" class="header-cell">#</div>'));
			$(backwardHeader).append($('<div style="display: table-cell; text-align: center;" class="header-cell">วันที่</div>'));
			$(backwardHeader).append($('<div style="display: table-cell; text-align: center;" class="header-cell">รายการ</div>').css({'width': '18%'}));
			$(backwardHeader).append($('<div style="display: table-cell; text-align: center;" class="header-cell">ภาพ</div>'));
			$(backwardHeader).append($('<div style="display: table-cell; text-align: center;" class="header-cell">ไฟล์ประวัติ</div>'));
			$(backwardHeader).append($('<div style="display: table-cell; text-align: center;" class="header-cell">ผลอ่าน</div>'));
			$(backwardHeader).append($('<div style="display: table-cell; text-align: center;" class="header-cell">หมายเหตุ/อื่นๆ</div>'));
			const promiseList = new Promise(async function(resolve2, reject2){
				for (let i=0; i < backwards.length; i++) {
					let backwardRow = $('<div style="display: table-row; width: 100%;" class="case-row"></div>');
					let backward = backwards[i];
					let caseCreateAt = util.formatDateTimeStr(backward.createdAt);
					//console.log(caseCreateAt);
					let casedatetime = caseCreateAt.split(' ');
					let casedateSegment = casedatetime[0].split('-');
					casedateSegment = casedateSegment.join('');
					let casedate = casedateSegment;
					casedateSegment = casedatetime[1].split(':');
					let casetime = casedateSegment.join('');

					let casedateDisplay = util.formatStudyDate(casedate);
					//console.log(casedateDisplay);
					//let dicomCmdBox = doCreateDicomCmdBox(backward.Case_OrthancStudyID, backward.Case_StudyInstanceUID, casedate, casetime, backward.hospitalId);
					let dicomCmdBox = doCreateDicomCmdBox(backward.Case_DicomZipFilename);
					let patientHRBackwardBox = await doCreateHRBackwardBox(patientFullName, backward.Case_PatientHRLink, casedate);
					let responseBackwardBox = undefined;
					const caseSuccessStatusIds = [5, 6, 10, 11, 12, 13, 14];
					let hadSuccess = util.contains.call(caseSuccessStatusIds, backward.casestatusId);
					if (hadSuccess) {
						if ((backward.caseresponses) && (backward.caseresponses.length > 0)) {
							responseBackwardBox = doCreateResponseBackwardBox(backward.id, backward.caseresponses[0].id, backward.caseresponses[0].Response_HTML, patientFullName, casedate);
						} else {
							responseBackwardBox = $('<div style="text-align: center">ไมพบผลอ่าน</div>');
						}
					} else {
						responseBackwardBox = $('<div style="text-align: center">เคสยังไม่มีผลอ่าน</div>');
					}
					$(backwardRow).append($('<div style="display: table-cell; text-align: center; padding: 4px; vertical-align: middle;">' + (i+1) + '</div>'));
					$(backwardRow).append($('<div style="display: table-cell; text-align: left; padding: 4px; vertical-align: middle;">' + casedateDisplay + '</div>'));
					$(backwardRow).append($('<div style="display: table-cell; text-align: left; vertical-align: middle;">' + backward.Case_BodyPart + '</div>'));
					let dicomCmdCell = $('<div style="display: table-cell; text-align: center; padding: 4px; vertical-align: middle;"></div>');
					$(dicomCmdCell).append($(dicomCmdBox));
					$(backwardRow).append($(dicomCmdCell));
					let hrBackwardCell = $('<div style="display: table-cell; text-align: center; padding: 4px; vertical-align: middle;"></div>');
					$(hrBackwardCell).append($(patientHRBackwardBox));
					$(backwardRow).append($(hrBackwardCell));
					let responseBackwardCell = $('<div style="display: table-cell; text-align: center; padding: 4px; vertical-align: middle;"></div>');
					$(responseBackwardCell).append($(responseBackwardBox));
					$(backwardRow).append($(responseBackwardCell));
					$(backwardRow).append($('<div style="display: table-cell; text-align: center; padding: 4px; vertical-align: middle;">-</div>'));
					$(backwardRow).css({'cursor': 'pointer'});
					$(backwardRow).on('dblclick', (evt)=>{
						common.doOpenStoneWebViewer(backward.Case_StudyInstanceUID, backward.hospitalId);
			    });
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

	const doCreatePatientBackward = function(backwards, patientFullName, currentCaseId) {
		return new Promise(async function(resolve, reject) {
			let backwardBox = $('<div style="100%"></div>');
			let titleBox = $('<div style="100%"></div>');
			$(titleBox).appendTo($(backwardBox));
			let titleText = $('<div><b>ประวัติการตรวจ</b></div>');
			$(titleText).appendTo($(titleBox));

			let backwardView = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');
			$(backwardView).appendTo($(backwardBox));

			let limitToggle = doCreateToggleSwitch(patientFullName, backwardView, currentCaseId);
			$(limitToggle).appendTo($(titleBox));
			$(limitToggle).css({'display': 'inline-block', 'float': 'right'});

			let backwardContentView = await doCreateBackwardItem(patientFullName, backwards, backwardView);
			$(backwardBox).append($(backwardContentView));
			resolve($(backwardBox));
		});
	}

	const doCreateSummaryFirstLine = function(selectedCase, patientFullName){
		let summaryFirstLine = $('<div></div>');
		$(summaryFirstLine).append($('<span><b>HN:</b> </span>'));
		$(summaryFirstLine).append($('<span style="margin-left: 4px; color: black;">' + selectedCase.case.patient.Patient_HN + '</span>'));
		$(summaryFirstLine).append($('<span style="margin-left: 4px;"><b>Name:</b> </span>'));
		$(summaryFirstLine).append($('<span style="margin-left: 4px; color: black;">' + patientFullName + '</span>'));
		$(summaryFirstLine).append($('<span style="margin-left: 4px;"><b>Age/sex:</b> </span>'));
		$(summaryFirstLine).append($('<span style="margin-left: 4px; color: black;">' + selectedCase.case.patient.Patient_Age + '/' + selectedCase.case.patient.Patient_Sex + '</span>'));
		$(summaryFirstLine).append($('<span style="margin-left: 4px;"><b>โรงพยาบาล:</b> </span>'));
		$(summaryFirstLine).append($('<span style="margin-left: 4px; color: black;">' + selectedCase.case.hospital.Hos_Name + '</span>'));

		let caseCreateAt = util.formatDateTimeStr(selectedCase.case.createdAt);
		let casedatetime = caseCreateAt.split(' ');
		let casedateSegment = casedatetime[0].split('-');
		casedateSegment = casedateSegment.join('');
		let casedate = casedateSegment;
		casedateSegment = casedatetime[1].split(':');
		let casetime = casedateSegment.join('');

		let patientHN = selectedCase.case.patient.Patient_HN;
		let downloadData = {caseId: selectedCase.case.id, patientId: selectedCase.case.patient.id, studyID: selectedCase.case.Case_OrthancStudyID, casedate: casedate, casetime: casetime, hospitalId: selectedCase.case.hospitalId, dicomzipfilename: selectedCase.case.Case_DicomZipFilename, userId: selectedCase.case.userId};
		downloadData.caseScanParts = selectedCase.case.Case_ScanPart;
		downloadData.patientFullName = patientFullName;
		downloadData.patientHN = patientHN;
		downloadData.Owner = selectedCase.Owner;

		let ownerCaseFullName = selectedCase.Owner.User_NameTH + ' ' + selectedCase.Owner.User_LastNameTH;
		let ownerCaseFullNameLink = $('<a></a>').text(ownerCaseFullName).css({'color': 'blue', 'text-decoration': 'underline', 'cursor': 'pointer'});
		$(ownerCaseFullNameLink).data('misstakeCaseData', downloadData);
		$(ownerCaseFullNameLink).on('click', onMisstakeCaseNotifyCmdClick);
		let ownerCaseInfoBox = $('<div></div>').css({'position': 'relative', 'display': 'inline-block', 'text-align': 'right', 'float': 'right'});
		$(ownerCaseInfoBox).append($('<b>ผู้ส่งเคส: </b>')).append($(ownerCaseFullNameLink))
		$(summaryFirstLine).append($(ownerCaseInfoBox));
		$(summaryFirstLine).css(common.pageLineStyle);
		return $(summaryFirstLine);
	}

	const doCreateSummaryDF = function(df){
		let summaryDF = $('<div style="padding: 5px;"></div>').css({'border': '1px solid black'});
		let total = 0;
		let summaryTable = $('<table width="100%" border="0" cellspacing="0" cellpadding="0"></table>').css({'border-collapse': 'collapse'});
		let headerRow = $('<tr></tr>');
		let headerCell = $('<td colspan="2" align="left"><b>Scan Part</b></td>');
		$(headerRow).append($(headerCell));
		$(summaryTable).append($(headerRow));
		let i = undefined;
		for (let i=0; i < df.length; i++){
			let row = $('<tr></tr>');
			let dfName = undefined;
			if (df[i].DF.type == 'night'){
				dfName = df[i].Name + ' (เวรดึก)';
			} else {
				dfName = df[i].Name;
			}
			let nameCell = $('<td width="90%" align="left">' + dfName + '</td>');
			let priceCell = $('<td width="*" align="right" style="padding-right: 10px;">' + df[i].DF.value + '</td>');
			total += Number(df[i].DF.value);
			$(row).append($(nameCell)).append($(priceCell));
			$(summaryTable).append($(row));
		}
		let blankRow = $('<tr><td colspan="2">&nbsp;</td></tr>').css({'min-height': '23px'});
		if (df.length == 0) {
			$(summaryTable).append($(blankRow)).append($(blankRow)).append($(blankRow));
		} else if (df.length == 1) {
			$(summaryTable).append($(blankRow)).append($(blankRow));
		} else if (df.length == 2) {
			$(summaryTable).append($(blankRow));
		}
		let totalRow = $('<tr></tr>').css({'border-top': '1px solid black', 'border-bottom': '1px solid black'});
		let totalNameCell = $('<td align="left" valign="bottom"><b>รวม</b></td>');
		let totalPriceCell = $('<td align="right" valign="bottom" style="padding-right: 10px;"><b>' + total + '</b></td>');
		$(totalRow).append($(totalNameCell)).append($(totalPriceCell))
		$(summaryTable).append($(totalRow));
		return $(summaryDF).append($(summaryTable));
	}

	const doCreateSummarySecondLine = function(selectedCase, patientFullName, casedate, casetime){
		return new Promise(async function(resolve, reject) {
			let summarySecondLine = $('<div></div>');
			let summarySecondArea = $('<table width="100%" border="0" cellspacing="0" cellpadding="0"></table>');
			let summarySecondAreaRow = $('<tr></tr>');
			let summarySecondAreaLeft = $('<td width="31%" align="left" valign="top"></td>');
			let summarySecondAreaMiddle1 = $('<td width="20%" align="center" valign="top"></td>');
			let summarySecondAreaMiddle2 = $('<td width="23%" align="center" valign="top"></td>');
			let summarySecondAreaMiddle3 = $('<td width="15%" align="left" valign="top">&nbsp;</td>');
			let summarySecondAreaRight = $('<td width="*" align="center" valign="top"></td>');
			$(summarySecondAreaRow).append($(summarySecondAreaLeft)).append($(summarySecondAreaMiddle1)).append($(summarySecondAreaMiddle2)).append($(summarySecondAreaMiddle3)).append($(summarySecondAreaRight));
			$(summarySecondArea).append($(summarySecondAreaRow));
			$(summarySecondLine).append($(summarySecondArea));

			let caseScanParts = selectedCase.case.Case_ScanPart;
			let summaryDF = doCreateSummaryDF(caseScanParts);
			$(summarySecondAreaLeft).append($(summaryDF));

			let buttonCmdArea = $('<div style="padding: 5px;"></div>');
			let buttonCmdTable = $('<table width="100%" border="0" cellspacing="0" cellpadding="0"></table>');
			let buttonCmdRow1 = $('<tr></tr>');
			/*
			let buttonCmdRow2 = $('<tr></tr>');
			let buttonCmdRow3 = $('<tr></tr>');
			*/
			let downloadCmdCell = $('<td width="30%" align="center"></td>');
			/*
			let blankCell = $('<td align="left"><div style="wisth: 100%; min-height: 30px;"></div></td>');
			let open3rdPartyCmdCell = $('<td align="left"></td>');
			*/
			$(buttonCmdRow1).append($(downloadCmdCell));
			/*
			$(buttonCmdRow2).append($(blankCell));
			$(buttonCmdRow3).append($(open3rdPartyCmdCell));
			*/
			$(buttonCmdTable).append($(buttonCmdRow1))/*.append($(buttonCmdRow2)).append($(buttonCmdRow3))*/;
			$(buttonCmdArea).append($(buttonCmdTable));
			$(summarySecondAreaMiddle1).append($(buttonCmdArea));
			let downloadCmd = $('<input type="button" value=" Download " id="DownloadDicomZipCmd" class="action-btn" style="cursor: pointer; width: 110px;"/>');
			let patientFullName = selectedCase.case.patient.Patient_NameEN + ' ' + selectedCase.case.patient.Patient_LastNameEN;
			let patientHN = selectedCase.case.patient.Patient_HN;
			let downloadData = {caseId: selectedCase.case.id, patientId: selectedCase.case.patient.id, studyID: selectedCase.case.Case_OrthancStudyID, casedate: casedate, casetime: casetime, hospitalId: selectedCase.case.hospitalId, dicomzipfilename: selectedCase.case.Case_DicomZipFilename, userId: selectedCase.case.userId};
			downloadData.caseScanParts = caseScanParts;
			downloadData.patientFullName = patientFullName;
			downloadData.patientHN = patientHN;
			downloadData.Owner = selectedCase.Owner;

			$(downloadCmd).attr('title', 'Download zip file of ' + patientFullName);
			$(downloadCmd).data('downloadData', downloadData);
			$(downloadCmd).on('click', async (evt)=>{
				if (evt.ctrlKey) {
					await doStartAutoDownloadDicom(downloadCmd);
				} else {
					/*
					let foundItem = await common.downloadDicomList.find((item, i) =>{
						if (item === downloadData.dicomzipfilename) {
							return item;
						}
					});
					if ((foundItem) && (foundItem === downloadData.dicomzipfilename)) {
						let msgDiv = $('<p></p>').text(downloadData.dicomzipfilename + ' completed.')
						let msgBox = doCreateCustomNotify('ประวัติการดาวน์โหลด', msgDiv, ()=>{
							onOpenThirdPartyCmdClick();
						});
						$('body').append($(msgBox).css({'position': 'absolute', 'top': '50px', 'right': '2px', 'width' : '260px', 'border': '2px solid black', 'background-color': '#184175', 'color': 'white', 'padding': '5px'}))
					} else {
						let dwnList = doDownloadDicom(evt, downloadData.dicomzipfilename);
					}
					*/
					let dwnList = doDownloadDicom(evt, downloadData.dicomzipfilename);
				}
			});
			$(downloadCmd).appendTo($(downloadCmdCell));

			if ((selectedCase.case.Case_PatientHRLink) && (selectedCase.case.Case_PatientHRLink.length > 0)) {
				let patientHRBox = await doRenderPatientHR(selectedCase.case.Case_PatientHRLink, patientFullName, casedate);
				$(summarySecondAreaMiddle2).append($(patientHRBox));
			}

			let misstakeCaseNotifyCmd = $('<input type="button" value=" แจ้งเคสผิดพลาด " class="action-btn" style="cursor: pointer; margin-left: 0px"/>');
			$(misstakeCaseNotifyCmd).data('misstakeCaseData', downloadData);
			$(misstakeCaseNotifyCmd).on('click', onMisstakeCaseNotifyCmdClick);

			let misstakeCaseNotifyBox = $('<div style="width: 100%; padding: 5px;"></div>');
			let misstakeCaseNotifyTable = $('<table width="100%" border="0" cellspacing="0" cellpadding="0"></table>');
			$(misstakeCaseNotifyBox).append($(misstakeCaseNotifyTable));
			let misstakeCaseNotifyRow = $('<tr></tr>');
			let misstakeCaseNotifyCell = $('<td width="100%" align="center"></td>');
			$(misstakeCaseNotifyRow).append($(misstakeCaseNotifyCell))
			$(misstakeCaseNotifyCell).append($(misstakeCaseNotifyCmd));
			$(misstakeCaseNotifyTable).append($(misstakeCaseNotifyRow));
			$(summarySecondAreaRight).append($(misstakeCaseNotifyBox));
			resolve($(summarySecondLine));
		});
	}

  const doCreateSummaryDetailCase = function(caseOpen){
    return new Promise(async function(resolve, reject) {
      let jqtePluginStyleUrl = '../../lib/jqte/jquery-te-1.4.0.css';
			$('head').append('<link rel="stylesheet" href="' + jqtePluginStyleUrl + '" type="text/css" />');
			$('head').append('<link rel="stylesheet" href="../case/css/scanpart.css" type="text/css" />');
			let jqtePluginScriptUrl = '../../lib/jqte/jquery-te-1.4.0.min.js';
			$('head').append('<script src="' + jqtePluginScriptUrl + '"></script>');

			const selectedCase = caseOpen.selectedCase.Records[0];
			caseHospitalId = selectedCase.case.hospitalId;
			casePatientId = selectedCase.case.patientId;
			caseId = selectedCase.case.id;

			let caseCreateAt = util.formatDateTimeStr(selectedCase.case.createdAt);
			let casedatetime = caseCreateAt.split(' ');
			let casedateSegment = casedatetime[0].split('-');
			casedateSegment = casedateSegment.join('');
			let casedate = casedateSegment;
			casedateSegment = casedatetime[1].split(':');
			let casetime = casedateSegment.join('');

      const userdata = JSON.parse(localStorage.getItem('userdata'));
			const patientFullName = selectedCase.case.patient.Patient_NameEN + ' ' + selectedCase.case.patient.Patient_LastNameEN;
			//let limit = 2;
			//let patientBackward = await doLoadPatientBackward(caseHospitalId, casePatientId, backwardCaseStatus, caseId, limit);
			let patientBackward = caseOpen.patientFilter;
			let patientBackwardView = undefined;
			if (patientBackward.Records.length > 0) {
				patientBackwardView = await doCreatePatientBackward(patientBackward.Records, patientFullName, caseId);
			} else {
				patientBackwardView = $('<div style="100%"><span><b>ไม่พบประวัติการตรวจ</b></span></div>');
			}

      let summary = $('<div style="position: relative; width: 98%; margin-left: 2px;"></div>');
			let summaryFirstLine = doCreateSummaryFirstLine(selectedCase, patientFullName);
      $(summary).append($(summaryFirstLine));

			let summarySecondLine = await doCreateSummarySecondLine(selectedCase, patientFullName, casedate, casetime);
      //$(summarySecondLine).css(common.pageLineStyle);
      $(summary).append($(summarySecondLine));

			let summaryThirdLine = $('<div></div>');
			$(summaryThirdLine).append($(patientBackwardView));
			$(summaryThirdLine).css(common.pageLineStyle);
			$(summaryThirdLine).appendTo($(summary));


			let contactToolsLine = $('<div style="width: 99%; min-height: 80px;"></div>');
			let contactContainer = chatman.doCreateContactContainer(caseId, selectedCase);
			$(contactToolsLine).append($(contactContainer));
			$(contactToolsLine).css(common.pageLineStyle);
			$(contactToolsLine).appendTo($(summary));
			if (selectedCase.case.casestatusId != 14){
				$(contactToolsLine).css('display', 'none');
			}

      let summaryFourthLine = $('<div></div>');
      $(summaryFourthLine).append($('<span><b>Template:</b> </span>'));
      let templateSelector = $('<select id="TemplateSelector"></select>');
			$(templateSelector).append('<option value="0">เลือก Template ของฉัน</option>');

			let yourTemplates = undefined;
			if (caseOpen.templateOptons) {
				yourTemplates = caseOpen.templateOptons;
				yourTemplates.Options.push({Value: 0, DisplayText: 'Template ทั้งหมด'});
			} else if (caseOpen.allTemplates) {
				yourTemplates = caseOpen.allTemplates;
			} else {
				yourTemplates = {Options: [{Value: -1, DisplayText: 'Not Found Your Template'}]}
			}
      if (yourTemplates.Options.length > 0) {
        yourTemplates.Options.forEach((item, i) => {
          $(templateSelector).append('<option value="' + item.Value + '">' + item.DisplayText + '</option>');
        });
      }

      $(templateSelector).on('change', onTemplateSelectorChange);
      $(templateSelector).appendTo($(summaryFourthLine));
			$(summaryFourthLine).append($('<span>  </span>'));
			let addNewTemplateCmd = $('<input type="button" id="AddNewTemplateCmd" value=" + Save New Template " class="action-btn"/>');
			let newTemplateData = {hospitalmap: yourTemplates.Options[0].hospitalmap, Hospitals: [{id: caseHospitalId}], Modality: selectedCase.case.Case_Modality, StudyDescription: selectedCase.case.Case_StudyDescription, ProtocolName: selectedCase.case.Case_ProtocolName};
			$(addNewTemplateCmd).data('newTemplateData', newTemplateData);

			$(addNewTemplateCmd).hide();
			$(addNewTemplateCmd).appendTo($(summaryFourthLine));
			$(addNewTemplateCmd).on('click', onAddNewTemplateCmdClick)
      $(summaryFourthLine).css(common.pageLineStyle);
      $(summaryFourthLine).appendTo($(summary));

			let simpleEditorBox = $('<div id="SimpleEditorBox"></div>');
      let simpleEditor = $('<input type="text" id="SimpleEditor"/>');
      $(simpleEditor).appendTo($(simpleEditorBox));

			backupDraftCounter = 0;
			let keypressCount = 0;
			/**********************************************/
			const simpleEditorChangeEvt = function(evt){
				if (keypressCount == 5){
					let responseHTML = $('#SimpleEditor').val();
					let draftbackup = {caseId: caseId, content: responseHTML, backupAt: new Date()};
					localStorage.setItem('draftbackup', JSON.stringify(draftbackup));
					keypressCount = 0;
					//doResetPingCounterOnOpenCase();
				} else {
					keypressCount += 1;
				}
			}
			$(simpleEditorBox).bind('keypress', function(evt) {
				//simpleEditorChangeEvt(evt);
			});
			/**********************************************/

			let simpleEditorConfig = $.extend({/*change: simpleEditorChangeEvt */}, common.jqteConfig);
      $(simpleEditor).jqte(simpleEditorConfig);
      $(simpleEditorBox).appendTo($(summary));
			$(simpleEditorBox).data('casedata', {caseId: caseId, caseResponseId: caseResponseId, caseHospitalId: caseHospitalId, casePatientId: casePatientId });
			//console.log(caseOpen);

			let createNewResponseCmd = $('<input type="button" value=" ส่งผลอ่าน " class="action-btn"/>');
			let createNewResponseData = {caseId: caseId, hospitalId: caseHospitalId, patientFullName: patientFullName, casedate: casedate, casetime: casetime, reporttype: caseOpen.reportType, resultFormat: caseOpen.resultFormat, previewOption: caseOpen.previewOption};
			$(createNewResponseCmd).data('createNewResponseData', createNewResponseData);
			$(createNewResponseCmd).on('click', onCreateNewResponseCmdClick);

			let saveDraftResponseCmd = $('<input type="button" class="none-action-btn" value=" Draft "/>');
			let saveDraftResponseData = {caseId: caseId, patientFullName: patientFullName, casedate: casedate, type: 'draft'};
			if (caseResponseId) {
				saveDraftResponseData.caseResponseId = caseResponseId;
			}
			$(saveDraftResponseCmd).data('saveDraftResponseData', saveDraftResponseData);
			$(saveDraftResponseCmd).on('click', onSaveDraftResponseCmdClick);

			let backToOpenCaseCmd = $('<input type="button" class="none-action-btn" value=" กลับ "/>');
			let backToOpenCaseData = {};
			$(backToOpenCaseCmd).data('backToOpenCaseData', backToOpenCaseData);
			$(backToOpenCaseCmd).on('click', onBackToOpenCaseCmdClick);

			let summaryFifthLine = $('<div></div>');
			$(summaryFifthLine).css(common.pageLineStyle);
			$(summaryFifthLine).css({'text-align': 'center'});
			$(summaryFifthLine).append($(createNewResponseCmd));
			$(summaryFifthLine).append($('<span>  </span>'));
			$(summaryFifthLine).append($(saveDraftResponseCmd));
			$(summaryFifthLine).append($('<span>  </span>'));
			$(summaryFifthLine).append($(backToOpenCaseCmd));
			$(summaryFifthLine).appendTo($(summary));

			//console.log(caseResponseId);
			let draftBackup = doRestoreDraft(caseId);

			if (selectedCase.case.casestatusId == 8){
				if (yourTemplates.Content) {
					$(summary).find('#SimpleEditor').jqteVal(yourTemplates.Content);
					//auto Save to cache
					let draftbackup = {caseId: caseId, content: yourTemplates.Content, backupAt: new Date()};
					localStorage.setItem('draftbackup', JSON.stringify(draftbackup));
				}
				if ((draftBackup) && (draftBackup.content)){
					doConfirmUpdateFromCache(summary, draftBackup.content);
				}
			} else {
				const youCan = [5, 6, 8, 9, 10, 11, 12, 13, 14];
				let canEditResponse = util.contains.call(youCan, selectedCase.case.casestatusId);
				if (canEditResponse) {
					let draftResponseRes = caseOpen.caseResponse;
					//console.log(draftResponseRes);
					if (draftResponseRes.Record.length > 0) {
						caseResponseId = draftResponseRes.Record[0].id;
						$(summary).find('#SimpleEditor').jqteVal(draftResponseRes.Record[0].Response_HTML);
						let resType = draftResponseRes.Record[0].Response_Type;
						if ((resType === 'draft') || (resType === 'normal')) {
							let cloudUpdatedAt = new Date(draftResponseRes.Record[0].updatedAt);
							if ((draftBackup) && (draftBackup.content !== '')) {
								let localUpdateAt = new Date(draftBackup.backupAt);
								//console.log(cloudUpdatedAt);
								//console.log(localUpdateAt);
								if (localUpdateAt.getTime() > cloudUpdatedAt.getTime()) {
									doConfirmUpdateFromCache(summary, draftBackup.content);
								} else {
									$(summary).find('#SimpleEditor').jqteVal(draftResponseRes.Record[0].Response_HTML);
								}
							} else {
								$(summary).find('#SimpleEditor').jqteVal(draftResponseRes.Record[0].Response_HTML);
							}
						}
					} else {
						if (draftBackup){
							if ((draftBackup.content) && (draftBackup.content !== '')) {
								$(summary).find('#SimpleEditor').jqteVal(draftBackup.content);
							}
						}
					}
				}
			}

			if (syncTimer){
				window.clearTimeout(syncTimer);
			}
			//syncTimer = doCreateSyncBGTimer(60);

      resolve($(summary));
    });
  }

	const doConfirmUpdateFromCache = function(summary, cacheContent) {
		let radAlertMsg = $('<div></div>');
		$(radAlertMsg).append($('<p>พบผลอ่านใน cache ที่ใหม่กว่าบน server ต้องการกู้ข้อมูลผลอ่านมาใส่หรือไม่</p>'));
		let backupView = $('<div style="width: 100%; height: 220px; overflow: scroll; background-color: #ccc;"></div>');
		$(backupView).html(cacheContent);
		$(backupView).css({'font-family': 'Arial, Helvetica, sans-serif', 'font-size': '16px'});
		$(radAlertMsg).append($(backupView));
		const radconfirmoption = {
			title: 'โปรดยืนยันการกู้ข้อมูลผลอ่านจาก cache',
			msg: $(radAlertMsg),
			width: '420px',
			onOk: function(evt) {
				//$('body').loading('start');
				$(summary).find('#SimpleEditor').jqteVal(cacheContent);
				//$('body').loading('stop');
				radConfirmBox.closeAlert();
			},
			onCancel: function(evt){
				let yourConfirm = confirm('คุณต้องการล้างข้อมูลใน Cache ด้วย่หรือไม่?');
				if (yourConfirm == true){
					localStorage.removeItem('draftbackup');
				}
				radConfirmBox.closeAlert();
			}
		}
		let radConfirmBox = $('body').radalert(radconfirmoption);
	}

  const doCallMyOpenCase = function(caseData){
    return new Promise(async function(resolve, reject) {
			let userdata = JSON.parse(localStorage.getItem('userdata'));
			let userId = userdata.id;
			let smartTmpFilter = {Modality: caseData.Modality, StudyDescription: caseData.StudyDescription, ProtocolName: caseData.ProtocolName, Hospitals: [caseData.hospitalId]};
			let rqParams = {caseId: caseData.caseId, radioId: userId, hospitalId: caseData.hospitalId, patientId: caseData.patientId, statusId: backwardCaseStatus, currentCaseId: caseData.caseId, smartTemplateFilter: smartTmpFilter, limit: 2};
			//let apiUrl = '/api/cases/select/' + caseId;
			//console.log(rqParams);
			let apiUrl = '/api/uicommon/radio/createresult';
			try {
				//let response = await common.doCallApi(apiUrl, rqParams);
				let response = await apiconnector.doCallApiDirect(apiUrl, rqParams);
        resolve(response);
			} catch(e) {
	      reject(e);
    	}
    });
  }

  const doLoadTemplateList = function(radioId) {
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/template/options/' + radioId;
			var params = {};
			//$.post(apiUri, params, function(response){
			apiconnector.doCallApi(apiUri, params).then((response)=>{
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

  const doLoadTemplate = function(templateId) {
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/template/select/' + templateId;
			var params = {};
			//$.post(apiUri, params, function(response){
			apiconnector.doCallApi(apiUri, params).then((response)=>{
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doLoadPatientBackward = function(hospitalId, patientId, statusIds, currentCaseId, limit) {
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/cases/filter/patient';
			var params = {statusId: statusIds, patientId: patientId, hospitalId: hospitalId, currentCaseId: currentCaseId};
			if ((limit) && (limit > 0)) {
				params.limit = limit;
			}
			//$.post(apiUri, params, function(response){
			apiconnector.doCallApi(apiUri, params).then((response)=>{
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doCallSaveResponse = function(params){
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/caseresponse/save';
			console.log(params);
			apiconnector.doCallApi(apiUri, params).then((response)=>{
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doCallSaveResult = function(params){
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/uicommon/radio/saveresult';
			apiconnector.doCallApi(apiUri, params).then((response)=>{
				localStorage.removeItem('draftbackup');
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doCallSubmitResult = function(params){
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/uicommon/radio/submitresult';
			//apiconnector.doCallApi(apiUri, params).then((response)=>{
			apiconnector.doCallApiDirect(apiUri, params).then((response)=>{
				localStorage.removeItem('draftbackup');
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doCallDraftRespons = function(caseId){
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/caseresponse/select/' + caseId;
			var params = {caseId: caseId};
			//$.post(apiUri, params, function(response){
			apiconnector.doCallApi(apiUri, params).then((response)=>{
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

  const doCreateOpenCasePage = function(caseData) {
    return new Promise(async function(resolve, reject) {
      //$('body').loading('start');
      let myOpenCase = await doCallMyOpenCase(caseData);
			if (myOpenCase.status.code == 200){
	      let myOpenCaseView = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');
				let caseSummaryDetail = await doCreateSummaryDetailCase(myOpenCase.result);
				$(myOpenCaseView).append($(caseSummaryDetail));
	      resolve($(myOpenCaseView));
				let casestatusId = caseData.statusId;
				if (caseData.startDownload == 1) {
					let downloadDicomZipCmd = $(caseSummaryDetail).find('#DownloadDicomZipCmd');
					if (downloadDicomZipCmd) {
						let downloadData = $(downloadDicomZipCmd).data('downloadData');
						let dicomzipfilename = downloadData.dicomzipfilename;
						let foundItem = await common.downloadDicomList.find((item, i) =>{
							if (item === dicomzipfilename) {
								return item;
							}
						});
						if ((foundItem) && (foundItem === dicomzipfilename)) {
							doChangeStateDownloadDicomCmd(downloadDicomZipCmd);
							let msgDiv = $('<p></p>').text(dicomzipfilename + ' completed.')
							let msgBox = doCreateCustomNotify('ประวัติการดาวน์โหลด', msgDiv, ()=>{
								/*
								let newEvt = jQuery.Event("click");
								newEvt.ctrlKey = true;
								$(downloadDicomZipCmd).trigger(newEvt);
								*/
								onOpenThirdPartyCmdClick();
							});
							//$.notify($(msgBox).html(), {position: 'top right', autoHideDelay: 20000, clickToHide: true, style: 'myshopman', className: 'base'});
							$('body').append($(msgBox).css({'position': 'absolute', 'top': '60px', 'right': '2px', 'width' : '260px', 'border': '2px solid black', 'background-color': '#2579B8', 'color': 'white', 'padding': '5px'}))
						} else {
							let dwnRes = await doStartAutoDownloadDicom(downloadDicomZipCmd);
						}

					} else {
						let apiError = 'api error at doCallMyOpenCase';
						reject({error: apiError});
					}
				}
				/*
				let firstLink = '/images/case-incident-icon-3.png'
				window.fetch(firstLink, {method: 'GET'}).then(response => response.blob()).then(blob => {
		      let url = window.URL.createObjectURL(blob);
		      $("#TitleContent").find('img').attr('src', url);
		    });
				*/
			} else if (myOpenCase.status.code == 210){
				reject({error: {code: 210, cause: 'Token Expired!'}});
			} else {
				let apiError = 'api error at doCallMyOpenCase';
				reject({error: apiError});
			}
    });
  }

	const doStartAutoDownloadDicom = function(downloadDicomZipCmd){
		return new Promise(async function(resolve, reject) {
			let dwnRes = await onDownloadCmdClick(downloadDicomZipCmd);
			doChangeStateDownloadDicomCmd(downloadDicomZipCmd);
			//onOpenThirdPartyCmdClick();
			let downloadData = $(downloadDicomZipCmd).data('downloadData');
			let dicomzipfilename = downloadData.dicomzipfilename;
			let msgDiv = $('<p></p>').text(dicomzipfilename + ' completed.');
			let msgBox = doCreateCustomNotify('ประวัติการดาวน์โหลด', msgDiv, ()=>{
				/*
				let newEvt = jQuery.Event("click");
				newEvt.ctrlKey = true;
				$(downloadDicomZipCmd).trigger(newEvt);
				*/
				onOpenThirdPartyCmdClick();
			});
			//$.notify($(msgBox).html(), {position: 'top right', autoHideDelay: 20000, clickToHide: true, style: 'myshopman', className: 'base'});
			$('body').append($(msgBox).css({'position': 'absolute', 'top': '60px', 'right': '2px', 'width' : '260px', 'border': '2px solid black', 'background-color': '#2579B8', 'color': 'white', 'padding': '5px'}));
			resolve();
		});
	}

	const doChangeStateDownloadDicomCmd = function(downloadDicomZipCmd){
		$(downloadDicomZipCmd).off('click');
		$(downloadDicomZipCmd).attr('title', 'Ctrl+click to open with 3rd party program');
		$(downloadDicomZipCmd).val(' DL/Open ');
		$(downloadDicomZipCmd).removeClass('action-btn');
		$(downloadDicomZipCmd).addClass('special-action-btn');
		let downloadData = $(downloadDicomZipCmd).data('downloadData');
		let dicomzipfilename = downloadData.dicomzipfilename;

		$(downloadDicomZipCmd).on('click', async (evt)=>{
			if (evt.ctrlKey) {
				// Ctrl Click start open third party dicom view
				//onOpenThirdPartyCmdClick();

				let foundItem = await common.downloadDicomList.find((item, i) =>{
					if (item === dicomzipfilename) {
						return item;
					}
				});
				if ((foundItem) && (foundItem === dicomzipfilename)) {
					let msgDiv = $('<p></p>').text(dicomzipfilename + ' completed.')
					let msgBox = doCreateCustomNotify('ประวัติการดาวน์โหลด', msgDiv, ()=>{
						onOpenThirdPartyCmdClick();
					});
					$('body').append($(msgBox).css({'position': 'absolute', 'top': '50px', 'right': '2px', 'width' : '260px', 'border': '2px solid black', 'background-color': '#184175', 'color': 'white', 'padding': '5px'}))
				} else {
					//let dwnList = doDownloadDicom(evt, downloadData.dicomzipfilename);
					let dwnRes = await doStartAutoDownloadDicom(downloadDicomZipCmd);
				}

			} else {
				//normal click normal download
				//dwnRes = await onDownloadCmdClick(downloadDicomZipCmd);
				let downloadList = doDownloadDicom(evt, dicomzipfilename);
			}
		});
	}

	const doBackupDraft = function(caseId, content){
		return new Promise(async function(resolve, reject) {
			let draftbackup = {caseId: caseId, content: content, backupAt: new Date()};
			localStorage.setItem('draftbackup', JSON.stringify(draftbackup));
			console.log(backupDraftCounter);
			let modulusCount = (backupDraftCounter % 20);
			console.log(modulusCount);
			let saveDraftRes = undefined;
			if (backupDraftCounter == 1) {
				let saveDraftResponseData = {type: 'draft', caseId: caseId};
				saveDraftRes = await doSaveDraft(saveDraftResponseData);
				console.log(saveDraftRes);
				if (saveDraftRes.status.code == 200){
					backupDraftCounter += 1;
					caseResponseId = saveDraftRes.result.responseId;
					if (!caseResponseId) {
						$.notify("เกิดความผิดพลาด Case Response API", "error");
					}
				} else {
					$.notify("ไม่สามารถบันทึก Draft - Error โปรดติดต่อผู้ดูแลระบบ", "error");
				}
			} else if (modulusCount == 0) {
				let saveDraftResponseData = {type: 'draft', caseId: caseId};
				saveDraftRes = await doSaveDraft(saveDraftResponseData);
				console.log(saveDraftRes);
				if (saveDraftRes.status.code == 200){
					backupDraftCounter += 1;
					caseResponseId = saveDraftRes.result.responseId;
					if (!caseResponseId) {
						$.notify("เกิดความผิดพลาด Case Response API", "error");
					}
				} else {
					$.notify("ไม่สามารถบันทึก Draft - Error โปรดติดต่อผู้ดูแลระบบ", "error");
				}
			} else {
				//backupDraftCounter += 1;
			}
			let isShowNewTemplateCmd = $('#AddNewTemplateCmd').css('display');
			if (isShowNewTemplateCmd === 'none') {
				$('#AddNewTemplateCmd').show();
			}
			//doResetPingCounterOnOpenCase();
			resolve(draftbackup);
		});
	}

	const doRestoreDraft = function(caseId){
		let draftbackup = JSON.parse(localStorage.getItem('draftbackup'));
		if((draftbackup) && (draftbackup.caseId == caseId)){
			return draftbackup;
		} else {
			return;
		}
	}

	const doViewBackupDraft = function(draftHTML){
		let backupDrafBox = $('<div></div>');
		$('#quickreply').css(common.quickReplyDialogStyle);
		//$(backupDrafBox).css(common.quickReplyContentStyle);
		$('#quickreply').append($(backupDrafBox));
		let htmlView = $('<div></div>');
		$(htmlView).html(draftHTML);
		$(htmlView).appendTo($(backupDrafBox));
		let closeCmd = $('<input type="button" value=" Close"/>');
		$(closeCmd).appendTo($(backupDrafBox));
		$(closeCmd).on('click', (evt)=>{
			$('#quickreply').empty();
			$('#quickreply').removeAttr('style');
		});
	}

	const doCreateSyncBGTimer = function(ssDelay){
		let webworker = new Worker("../lib/response-sync-webworker.js");
	  webworker.addEventListener("message", function(event) {
	    let evtData = event.data;
	    if (evtData.type === 'syncsuccess'){
				console.log(evtData.data);
			} else if (evtData.type === 'notsync'){
				console.log('notsync');
			}
		});
		let timer = window.setTimeout(()=>{
			onSyncBGTimerEvent(ssDelay, webworker);
		}, ssDelay * 1000);
		return timer;
	}

	const onSyncBGTimerEvent = function(ssDelay, webworker){
		if (syncTimer) {
			let userdata = JSON.parse(localStorage.getItem('userdata'));
			let userId = userdata.id;
			let responseHTML = $('#SimpleEditor').val();
			if ((responseHTML) && (responseHTML !== '')){
				let responseText = toAsciidoc(responseHTML);
				let saveData = {Response_HTML: responseHTML, Response_Text: responseText, Response_Type: 'draft'};
				let params = {caseId: caseId, userId: userId, data: saveData, responseId: caseResponseId};

				let token = localStorage.getItem('token');
				let synmessageCmd = {type: 'startsync', params: params, token: token}
			  webworker.postMessage(synmessageCmd);
				window.clearTimeout(syncTimer);
				syncTimer = window.setTimeout(()=>{
					onSyncBGTimerEvent(ssDelay, webworker);
				}, ssDelay * 1000);
			}
		}
	}

	const doCalResultHeigth = function(resultHTML, resultWidth, fontsize){
		/*
		A4 Height = 1122.52 px / 297 mm
		ต้องเพิ่ม font-size, line-height ด้วย
		*/
		const fontSize = 11;
		const lineHeight = 20;
		const resultBoxStyle = {'position': 'relative', 'width': '1004px', 'font-family': '"Tahoma", sans-serif', 'font-size': fontSize+'px', 'line-height': lineHeight+'px'};

		let resultBox = $('<div></div>');
		$(resultBox).css(resultBoxStyle);
		$(resultBox).html(resultHTML);
		$('.mainfull').append($(resultBox));
		let rsH = $(resultBox).outerHeight();
		if (rsH < 850) {
			rsH = 850;
		}
		$(resultBox).remove();
		return rsH;
	}

	const getBackupDraftCounter = function(){
		return backupDraftCounter;
	}

	const setBackupDraftCounter = function(value){
		backupDraftCounter = value;
	}

	const setCaseResponseId = function(responseId) {
		caseResponseId = responseId;
	}

	const getCaseResponseId = function() {
		return caseResponseId;
	}

	const doReportBugOpenCase = function(msgJSON, apiErrorURL) {
		const { getFomateDateTime } = require('../../case/mod/utilmod.js')($);
		let dt = new Date();
		let bugDataReport = $('<div></div>');
		$(bugDataReport).append($('<h2 style="text-align: center;"><b>ERROR REPORT</b></h2>'));
		$(bugDataReport).append('<h3>ERROR MESSAGE : ' + JSON.stringify(msgJSON) + '</h3>');
		$(bugDataReport).append($('<h3>API : ' + apiErrorURL + '</h3>'));
		$(bugDataReport).append($('<h3>METHOD : POST</h3>'));
		$(bugDataReport).append($('<h3>Date-Time : ' + getFomateDateTime(dt) + '</h3>'));
		$(bugDataReport).append($('<h5>User Data : ' + JSON.stringify(userdata) + '</h5>'));
		let bugParams = {email: apiconnector.adminEmailAddress, bugreport: bugDataReport.html()};
		apiconnector.doCallReportBug(bugParams).then((reportRes)=>{
			if (reportRes.status.code == 200) {
				$.notify('ระบบฯ ได้รวบรวมข้อผิดพลาดที่เกิดขึ้นส่งไปให้ผู้ดูแลระบบทางอีเมล์แล้ว', 'success');
				//มีข้อผิดพลาด กรุณาแจ้งผู้ดูแลระบบ
			} else if (reportRes.status.code == 500) {
				$.notify('การรายงานข้อผิดพลาดทางอีเมล์เกิดข้อผิดพลาด @API', 'error');
			} else {
				$.notify('การรายงานข้อผิดพลาดทางอีเมล์เกิดข้อผิดพลาด @ไม่ทราบสาเหตุ', 'error');
			}
			//$('body').loading('stop');
		});
	}

	const doCreateCustomNotify = function(title, msgDiv, callback){
	  let msgBox = $('<div></div>');
	  let titleBox = $("<div style='text-align: center; background-color: white; color: black;'></div>");
	  $(titleBox).append($('<h4>' + title + '</h4>'));
	  let bodyBox = $("<div></div>");
		$(bodyBox).append($(msgDiv));
	  //$(bodyBox).append($('<span>คลิกที่ปุ่ม <b>ตกลง</b> เพื่อเปิดภาพและปิดการแจ้งเตือนนี้</span>'));
	  let footerBox = $("<div style='text-align: center; background-color: white; color: black;'></div>");
	  let openCmd = $('<input type="button" value="Open" id="SuccessNotifyCmd"/>');
		$(openCmd).on('click', (evt)=>{
			evt.stopPropagation();
			if (callback) {
				callback();
			}
			$(msgBox).remove();
		});
		let closeCmd = $('<input type="button" value="Close" id="CancelNotifyCmd"/>');
		$(closeCmd).on('click', (evt)=>{
			$(msgBox).remove();
		});
	  $(footerBox).append($(openCmd)).append($(closeCmd).css({'margin-left': '10px'}));
	  return $(msgBox).append($(titleBox)).append($(bodyBox)).append($(footerBox))
	}

	const doResetPingCounterOnOpenCase = function() {
		/*
		let main = require('../main.js');
		let myWsm = main.doGetWsm();
		*/
		let myWsm = util.wsm;
		if (myWsm) {
			myWsm.send(JSON.stringify({type: 'reset', what: 'pingcounter'}));
		}
	}

	const doSaveResponseTextToLocalFile = function(responseText, filname) {
		let pom = document.createElement('a');
		let file = new Blob([responseText], { type: 'text/plain' });
		let stremLink = URL.createObjectURL(file);
		pom.setAttribute('target', "_blank");
		pom.setAttribute('href', stremLink);
		pom.setAttribute('download', filname);
		pom.click();
	}

  return {
		/* Variable Zone */
		caseHospitalId,
		casePatientId,
		caseId,
		caseResponseId,

		backupDraftCounter,

		/*Medthod Zone */
		commandButtonStyle,
    onDownloadCmdClick,
    onOpenStoneWebViewerCmdClick,
    onOpenThirdPartyCmdClick,
    onTemplateSelectorChange,
    doOpenHR,
    doRenderPatientHR,
		doCreatePatientBackward,
    doCreateSummaryDetailCase,
    doCallMyOpenCase,
    doLoadTemplateList,
    doLoadTemplate,
		doLoadPatientBackward,
    doCreateOpenCasePage,
		doBackupDraft,
		doSaveDraft,
		doCreateSyncBGTimer,
		onSyncBGTimerEvent,
		doCalResultHeigth,
		getBackupDraftCounter,
		setBackupDraftCounter,
		setCaseResponseId,
		getCaseResponseId,
		doReportBugOpenCase,
		doResetPingCounterOnOpenCase
	}
}
