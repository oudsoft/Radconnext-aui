/* opencase.js */
module.exports = function ( jq ) {
	const $ = jq;
	const apiconnector = require('../../case/mod/apiconnect.js')($);
  const util = require('../../case/mod/utilmod.js')($);
  const common = require('../../case/mod/commonlib.js')($);
	const chatman = require('./chatmanager.js')($);
	const ai = require('./ai-lib.js')($);

	const commandButtonStyle = {'padding': '3px', 'cursor': 'pointer', 'border': '1px solid white', 'color': 'white', 'background-color': 'blue'};
	const quickReplyDialogStyle = { 'position': 'fixed', 'z-index': '13', 'left': '0', 'top': '0', 'width': '100%', 'height': '100%', 'overflow': 'auto', 'background-color': 'rgb(0,0,0)', 'background-color': 'rgba(0,0,0,0.4)'};
	const quickReplyContentStyle = { 'background-color': '#fefefe', 'margin': '15% auto', 'padding': '20px', 'border': '1px solid #888', 'width': '520px', 'height': '200px', 'font-family': 'THSarabunNew', 'font-size': '24px' };

	const backwardCaseStatus = [5, 6, 10, 11, 12, 13, 14];
	let caseHospitalId = undefined;
	let casePatientId = undefined;
	let caseId = undefined;
	let caseResponseId = undefined;
	let keytypecounter = undefined;
	let backupDraftCounter = undefined;
	let downloadDicomList = [];

	const doDownloadDicom = function(studyID, hospitalId, casedate) {
		return new Promise(async function(resolve, reject) {
			apiconnector.doCallDownloadDicom(studyID, hospitalId).then(async (response) => {
				console.log(response);
	      var fullNameENRes = await common.getPatientFullNameEN(casePatientId);
				var patientFullNameEN = fullNameENRes.fullNameEN;
	      patientFullNameEN.split(' ').join('_');
				patientFullNameEN = patientFullNameEN.trim();
				//console.log(patientFullNameEN + '*');
	      var dicomFilename = patientFullNameEN + '-' + casedate + '.zip';
				var pom = document.createElement('a');
				pom.setAttribute('href', response.link);
				pom.setAttribute('download', dicomFilename);
				pom.click();
				downloadDicomList.push(dicomFilename);
				resolve(response);
	  	});
		});
	}

  const onDownloadCmdClick = function(evt) {
		return new Promise(async function(resolve, reject) {
	    $('body').loading('start');
			const userdata = JSON.parse(localStorage.getItem('userdata'));
	    const downloadCmd = $(evt.currentTarget);
	    const downloadData = $(downloadCmd).data('downloadData');
			let downloadRes = await doDownloadDicom(downloadData.studyID, downloadData.hospitalId, downloadData.casedate);
			$('body').loading('stop');
			resolve(downloadRes);
  	})
  }

  const onOpenStoneWebViewerCmdClick = function(evt) {
    const openCmd = $(evt.currentTarget);
    const openData = $(openCmd).data('openData');
    common.doOpenStoneWebViewer(openData.studyInstanceUID);
  }

  const onOpenThirdPartyCmdClick = function(evt) {
		const userdata = JSON.parse(localStorage.getItem('userdata'));
		const defaultDownloadPath = userdata.userinfo.User_PathRadiant;
		//const defaultDownloadPath = 'C:/Users/Administrator/Downloads';
		let thirdPartyLink = 'radiant://?n=f&v=';
		if (downloadDicomList.length > 0) {
			if (downloadDicomList.length <= 3) {
				downloadDicomList.forEach((item, i) => {
					if (i < (downloadDicomList.length-1)) {
						thirdPartyLink += defaultDownloadPath + '/' + item + '&v=';
					} else {
						thirdPartyLink += defaultDownloadPath + '/' + item;
					}
				});
				console.log(thirdPartyLink);
				var pom = document.createElement('a');
				pom.setAttribute('href', thirdPartyLink);
				//pom.setAttribute('download', dicomFilename);
				pom.click();
				downloadDicomList = [];
			} else {
				$.notify("sorry, not support exceed three file download", "warn");
			}
		} else {
			$.notify("ขออภัย ยังไม่พบรายการดาวน์โหลดไฟล์", "warn");
		}
  }

  const onTemplateSelectorChange = async function(evt) {
		$('body').loading('start');
		let yourResponse = $('#SimpleEditor').val();
		let templateId = $('#TemplateSelector').val();
		if ((templateId) && (templateId > 0)){
			let result = await doLoadTemplate(templateId);
			if ((result.Record) && (result.Record.length > 0)) {
				let yourNewResponse = yourResponse + '<br/>' + result.Record[0].Content;
				$('#SimpleEditor').jqteVal(yourNewResponse);
				doBackupDraft(caseId, yourNewResponse);
				keytypecounter = 0;
			}
		}
		$('body').loading('stop');
  }

	const onCreateNewResponseCmdClick = async function(evt) {
		let responseHTML = $('#SimpleEditor').val();
		if (responseHTML !== '') {
			$('body').loading('start');
			const createNewResponseCmd = $(evt.currentTarget);
	    const userdata = JSON.parse(localStorage.getItem('userdata'));
			const saveNewResponseData = $(createNewResponseCmd).data('createNewResponseData');

			let type = 'draft';
			let caseId = saveNewResponseData.caseId
			let userId = userdata.id;
			doBackupDraft(caseId, responseHTML);
			let responseText = toAsciidoc(responseHTML);
			console.log(responseText);
			let saveData = {Response_HTML: responseHTML, Response_Text: responseText, Response_Type: type};
			let params = {caseId: caseId, userId: userId, data: saveData, responseId: caseResponseId};
			let saveResponseRes = await doCallSaveResponse(params);
			//console.log(saveResponseRes);
			if ((saveResponseRes.status.code == 200) && (saveResponseRes.result.responseId)){
				caseResponseId = saveResponseRes.result.responseId;
				if (!caseResponseId) {
					$.notify("เกิดความผิดพลาด Case Response API", "error");
				}
				let casedate = saveNewResponseData.casedate;
				let patientFullName = saveNewResponseData.patientFullName;
		    let reportCreateCallerEndPoint = "/api/casereport/create";
				let fileExt = 'pdf';
				let fileName = (patientFullName.split(' ').join('_')) + '-' + casedate + '.' + fileExt;
		    params = {caseId: saveNewResponseData.caseId, hospitalId: caseHospitalId, userId: userdata.id, pdfFileName: fileName};
				let reportPdf = await $.post(reportCreateCallerEndPoint, params);
				let pdfStream = await util.doCreateDownloadPDF(reportPdf.reportLink);
				let embetObject = $('<object data="' + reportPdf.reportLink + '" type="application/pdf" width="100%" height="480"></object>');
				$("#dialog").load('form/response-dialog.html', function() {
					saveNewResponseData.reportLink = reportPdf.reportLink;
					$('#ResponsePreview').append($(embetObject));
					$('#ResponsePreview').css({'text-align': 'center', 'width': '830px', 'min-height': '500px', 'overflow': 'scroll'});
					$('#SaveResponeCmd').data('saveResponseData', saveNewResponseData);
					$('#SaveResponeCmd').on('click', onSaveResponseCmdClick);
					$('body').loading('stop');
				});
			} else {
				$.notify("เกิดความผิดพลาดไม่สามารถบันทึกผลอ่านได้ในขณะนี้", "error");
				$('body').loading('stop');
			}
		} else {
			$.notify("โปรดพิมพ์ผลอ่านก่อนครับ", "warn");
		}
	}

	const onSaveResponseCmdClick = function(evt){
		const saveResponseCmd = $(evt.currentTarget);
		const saveResponseData = $(saveResponseCmd).data('saveResponseData');

		let saveTypeOptionBox = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');

		let selectSaveTypeOptionGuide = $('<div style="display: table-row; width: 100%;"></div>');
		$(selectSaveTypeOptionGuide).appendTo($(saveTypeOptionBox));
		$(selectSaveTypeOptionGuide).append($('<div style="display: table-cell; padding: 4px; background-color: #02069B; color: white;"><img src="/images/figger-right-icon.png" width="25px" height="auto"/></div>'));
		let guideCell = $('<div style="display: table-cell; padding: 4px; background-color: #02069B; vertical-align: middle; text-align: center; color: white;"></div>');
		$(guideCell).append($('<span>โปรดเลือกว่า ต้องการส่งผลอ่านแบบไหนจากรายการเลือก</span>'));
		$(guideCell).appendTo($(selectSaveTypeOptionGuide));

		let normalSaveTypeOption = $('<div style="display: table-row; width: 100%; cursor: pointer;" class="case-row"></div>');
		$(normalSaveTypeOption).appendTo($(saveTypeOptionBox));
		let normalPointIconCell = $('<div style="display: table-cell; padding: 4px; border: 2px solid grey; vertical-align: middle; text-align: center;"></div>');
		let normalPointIcon = $('<img src="/images/triangle-right-icon.png" width="25px" height="auto"/>');
		$(normalPointIcon).hide();
		$(normalPointIcon).appendTo($(normalPointIconCell));
		$(normalPointIconCell).appendTo($(normalSaveTypeOption));
		$(normalSaveTypeOption).hover(()=>{$(normalPointIcon).toggle();})
		let labelOption = $('<div style="display: table-cell; padding: 4px; border: 2px solid grey;">Normal</div>');
		$(labelOption).appendTo($(normalSaveTypeOption));

		let attentionSaveTypeOption = $('<div style="display: table-row; width: 100%; cursor: pointer;" class="case-row"></div>');
		$(attentionSaveTypeOption).appendTo($(saveTypeOptionBox));
		let attentionPointIconCell = $('<div style="display: table-cell; padding: 4px; border: 2px solid grey; vertical-align: middle; text-align: center;"></div>');
		let attentionPointIcon = $('<img src="/images/triangle-right-icon.png" width="25px" height="auto"/>');
		$(attentionPointIcon).hide();
		$(attentionPointIcon).appendTo($(attentionPointIconCell));
		$(attentionPointIconCell).appendTo($(attentionSaveTypeOption));
		$(attentionSaveTypeOption).hover(()=>{$(attentionPointIcon).toggle();})
		labelOption = $('<div style="display: table-cell; padding: 4px; border: 2px solid grey;">Need Attention</div>');
		$(labelOption).appendTo($(attentionSaveTypeOption));

		let criticalSaveTypeOption = $('<div style="display: table-row; width: 100%; cursor: pointer;" class="case-row"></div>');
		$(criticalSaveTypeOption).appendTo($(saveTypeOptionBox));
		let criticalPointIconCell = $('<div style="display: table-cell; padding: 4px; border: 2px solid grey; vertical-align: middle; text-align: center;"></div>');
		let criticalPointIcon = $('<img src="/images/triangle-right-icon.png" width="25px" height="auto"/>');
		$(criticalPointIcon).hide();
		$(criticalPointIcon).appendTo($(criticalPointIconCell));
		$(criticalPointIconCell).appendTo($(criticalSaveTypeOption));
		$(criticalSaveTypeOption).hover(()=>{$(criticalPointIcon).toggle();})
		labelOption = $('<div style="display: table-cell; padding: 4px; border: 2px solid grey;">Critical</div>');
		$(labelOption).appendTo($(criticalSaveTypeOption));

		let preliminarySaveTypeOption = $('<div style="display: table-row; width: 100%; cursor: pointer;" class="case-row"></div>');
		$(preliminarySaveTypeOption).appendTo($(saveTypeOptionBox));
		let preliminaryPointIconCell = $('<div style="display: table-cell; padding: 4px; border: 2px solid grey; vertical-align: middle; text-align: center;"></div>');
		let preliminaryPointIcon = $('<img src="/images/triangle-right-icon.png" width="25px" height="auto"/>');
		$(preliminaryPointIcon).hide();
		$(preliminaryPointIcon).appendTo($(preliminaryPointIconCell));
		$(preliminaryPointIconCell).appendTo($(preliminarySaveTypeOption));
		$(preliminarySaveTypeOption).hover(()=>{$(preliminaryPointIcon).toggle();})
		labelOption = $('<div style="display: table-cell; padding: 4px; border: 2px solid grey;">Pre-Liminary</div>');
		$(labelOption).appendTo($(preliminarySaveTypeOption));

		$('#quickreply').css(quickReplyDialogStyle);
		$(saveTypeOptionBox).css(quickReplyContentStyle);
		$('#quickreply').append($(saveTypeOptionBox));

		$(normalSaveTypeOption).data('saveResponseData', saveResponseData);
		$(normalSaveTypeOption).on('click', onNormalSaveOptionCmdClick);
		$(attentionSaveTypeOption).data('saveResponseData', saveResponseData);
		$(attentionSaveTypeOption).on('click', onAttentionSaveOptionCmdClick);
		$(criticalSaveTypeOption).data('saveResponseData', saveResponseData);
		$(criticalSaveTypeOption).on('click', onCriticalSaveOptionCmdClick);
		$(preliminarySaveTypeOption).data('saveResponseData', saveResponseData);
		$(preliminarySaveTypeOption).on('click', onPreliminarySaveOptionCmdClick);
	}

	const onNormalSaveOptionCmdClick = async function(evt) {
		const responseType = 'normal';
		const reportType = 'normal';
		const normalSaveResponseCmd = $(evt.currentTarget);
		const saveResponseData = $(normalSaveResponseCmd).data('saveResponseData');
		console.log(saveResponseData);
		await doSaveResponse(responseType, reportType, saveResponseData)
	}

	const onAttentionSaveOptionCmdClick = async function(evt) {
		const responseType = 'normal';
		const reportType = 'attention';
		const normalSaveResponseCmd = $(evt.currentTarget);
		const saveResponseData = $(normalSaveResponseCmd).data('saveResponseData');
		await doSaveResponse(responseType, reportType, saveResponseData)
	}

	const onCriticalSaveOptionCmdClick = async function(evt) {
		const responseType = 'normal';
		const reportType = 'cristical';
		const normalSaveResponseCmd = $(evt.currentTarget);
		const saveResponseData = $(normalSaveResponseCmd).data('saveResponseData');
		await doSaveResponse(responseType, reportType, saveResponseData)
	}

	const onPreliminarySaveOptionCmdClick = async function(evt) {
		const responseType = 'normal';
		const reportType = 'preliminary';
		const normalSaveResponseCmd = $(evt.currentTarget);
		const saveResponseData = $(normalSaveResponseCmd).data('saveResponseData');
		await doSaveResponse(responseType, reportType, saveResponseData)
	}

	function doSaveResponse(responseType, reportType, saveResponseData){
		return new Promise(async function(resolve, reject) {
			$('body').loading('start');
	    const userdata = JSON.parse(localStorage.getItem('userdata'));
			let caseId = saveResponseData.caseId
			let userId = userdata.id;
			let responseHTML = $('#SimpleEditor').val();
			doBackupDraft(caseId, responseHTML);
			let responseText = toAsciidoc(responseHTML);
			let saveData = {Response_HTML: responseHTML, Response_Text: responseText, Response_Type: responseType};
			let params = {caseId: caseId, userId: userId, data: saveData, responseId: caseResponseId, reporttype: reportType, PDF_Filename: saveResponseData.reportLink};
			let saveResponseRes = await doCallSaveResponse(params);
			if ((saveResponseRes.status.code == 200) || (saveResponseRes.status.code == 203)){
				$('#quickreply').empty();
				$('#quickreply').removeAttr('style');
				$("#dialog").empty();
				doCloseDialog();
				$.notify("ส่งผลอ่านได้สำเร็จ", "success");
				$('body').loading('stop');
				resolve(saveResponseRes);
				$('#AcceptedCaseCmd').click();
			} else {
				$.notify("เกิดความผิดพลาดไม่สามารถบันทึกผลอ่านได้ในขณะนี้", "error");
				$('body').loading('stop');
				reject({errer: 'Save Case Response Error'});
			}
		});
	}

	function doSaveDraft(saveDraftResponseData) {
		return new Promise(async function(resolve, reject) {
			let type = saveDraftResponseData.type;
			let caseId = saveDraftResponseData.caseId
			let userdata = JSON.parse(localStorage.getItem('userdata'));
			let userId = userdata.id;
			let responseHTML = $('#SimpleEditor').val();
			let responseText = toAsciidoc(responseHTML);
			let saveData = {Response_HTML: responseHTML, Response_Text: responseText, Response_Type: type};
			let params = {caseId: caseId, userId: userId, data: saveData, responseId: caseResponseId};
			let saveResponseRes = await doCallSaveResponse(params);
			resolve(saveResponseRes);
		});
	}

	const onSaveDraftResponseCmdClick = function(evt) {
		return new Promise(async function(resolve, reject) {
			let responseHTML = $('#SimpleEditor').val();
			if (responseHTML !== '') {
				$('body').loading('start');
				const saveDraftResponseCmd = $(evt.currentTarget);
		    const saveDraftResponseData = $(saveDraftResponseCmd).data('saveDraftResponseData');
				let draftResponseRes = await doSaveDraft(saveDraftResponseData);
				console.log(draftResponseRes);
				if (draftResponseRes.status.code == 200){
					caseResponseId = draftResponseRes.result.responseId;
					if (!caseResponseId) {
						$.notify("เกิดความผิดพลาด Case Response API", "error");
					}
					$.notify("บันทึกผลอ่านเป็น Draft สำเร็จ", "success");
					$('body').loading('stop');
				} else {
					$.notify("บันทึกผลอ่านเป็น Draft ไม่สำเร็จ", "error");
					$('body').loading('stop');
				}
				resolve(draftResponseRes);
			} else {
				$.notify("โปรดพิมพ์ผลอ่านก่อนครับ", "warn");
				resolve({});
			}
		});
	}

	const onAddNewTemplateCmdClick = function(evt) {
		let jqtePluginStyleUrl = '../../lib/jqte/jquery-te-1.4.0.css';
		$('head').append('<link rel="stylesheet" href="' + jqtePluginStyleUrl + '" type="text/css" />');
		$('head').append('<link rel="stylesheet" href="../case/css/scanpart.css" type="text/css" />');
		let jqtePluginScriptUrl = '../../lib/jqte/jquery-te-1.4.0.min.js';
		$('head').append('<script src="' + jqtePluginScriptUrl + '"></script>');

		let saveTypeOptionBox = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');

		let selectSaveTypeOptionGuide = $('<div style="display: table-row; width: 100%;"></div>');
		$(selectSaveTypeOptionGuide).appendTo($(saveTypeOptionBox));
		$(selectSaveTypeOptionGuide).append($('<div style="display: table-cell; padding: 4px; background-color: #02069B; vertical-align: middle;"><img src="/images/figger-right-icon.png" width="25px" height="auto"/></div>'));
		let guideCell = $('<div style="display: table-cell; padding: 4px; background-color: #02069B; vertical-align: middle; text-align: left;"></div>');
		$(guideCell).append($('<span style="color: white;">โปรดตั้งชื่อและแก้ไขข้อมูล Template ก่อนเพิ่มเป็นรายการ Template ใหม่</span>'));
		$(guideCell).appendTo($(selectSaveTypeOptionGuide));

		let templateNameRow = $('<div style="display: table-row; width: 100%;"></div>');
		$(templateNameRow).appendTo($(saveTypeOptionBox));
		let labelNameCell = $('<div style="display: table-cell; padding: 4px;"><span>ขื่อ</span></div>');
		$(labelNameCell).appendTo($(templateNameRow));
		let inputNameCell = $('<div style="display: table-cell; padding: 4px;"></div>');
		$(inputNameCell).appendTo($(templateNameRow));
		let inputName = $('<input type="text"/>');
		$(inputName).appendTo($(inputNameCell));

		let templateContentRow = $('<div style="display: table-row; width: 100%;"></div>');
		$(templateContentRow).appendTo($(saveTypeOptionBox));
		let labelContentCell = $('<div style="display: table-cell; padding: 4px;"><span>ข้อมูล</span></div>');
		$(labelContentCell).appendTo($(templateContentRow));
		let inputContentCell = $('<div style="display: table-cell; padding: 4px;"></div>');
		$(inputContentCell).appendTo($(templateContentRow));
		let simpleEditor = $('<input type="text" id="NewSimpleEditor"/>');
		$(simpleEditor).appendTo($(inputContentCell));
		$(simpleEditor).jqte();
		let yourTemplateContent = $('#SimpleEditor').val();
		$(saveTypeOptionBox).find('#NewSimpleEditor').jqteVal(yourTemplateContent);
		$(saveTypeOptionBox).find('.jqte_editor').css({ height: '260px' });

		let cmdRow = $('<div style="display: table-row; width: 100%; text-align: center;"></div>');
		$(cmdRow).appendTo($(saveTypeOptionBox));
		let dummyCell = $('<div style="display: table-cell; padding: 4px;"></div>');
		$(dummyCell).appendTo($(cmdRow))
		let cmdCell = $('<div style="display: table-cell; padding: 4px;"></div>');
		$(cmdCell).appendTo($(cmdRow))
		let okCmd = $('<input type="button" value=" ตกลง "/>');
		$(okCmd).appendTo($(cmdCell));
		$(cmdCell).append($('<span>  </span>'));
		let cancelCmd = $('<input type="button" value=" ยกเลิก "/>');
		$(cancelCmd).appendTo($(cmdCell));
		$(cancelCmd).on('click', (evt)=>{
			$('#quickreply').empty();
			$('#quickreply').removeAttr('style');
		});
		$(okCmd).on('click', async (evt)=>{
			let templateName = $(inputName).val();
			let templateContent = $(saveTypeOptionBox).find('#NewSimpleEditor').val();
			if(templateName === '') {
				$(inputName).css('border', '1px solid red');
				$.notify("โปรดตั้งชื่อ Template ก่อนครับ", "warn");
			} else if(templateContent === '') {
				$(inputName).css('border', '');
				$(saveTypeOptionBox).find('#SimpleEditor').css('border', '1px solid red');
				$.notify("โปรดใส่ข้อมูล Template ก่อนครับ", "warn");
			} else {
				$(saveTypeOptionBox).find('#SimpleEditor').css('border', '');
				let yourTemplate = templateContent;
				let userdata = JSON.parse(localStorage.getItem('userdata'));
				let userId = userdata.id;
				let rqParams = {userId: userId, data: {Name: templateName, Content: yourTemplate}};
				let callAddTemplateUrl = '/api/template/add';
				let response = await common.doCallApi(callAddTemplateUrl, rqParams);
				if (response.status.code == 200) {
					$.notify('บันทึกข้อมูลสำเร็จ', "success");
					let yourTemplates = await doLoadTemplateList(userId);
					$("#TemplateSelector").empty();
					$("#TemplateSelector").append('<option value="0">เลือก Template ของฉัน</option>');
					if (yourTemplates.Options.length > 0) {
						yourTemplates.Options.forEach((item, i) => {
							$("#TemplateSelector").append('<option value="' + item.Value + '">' + item.DisplayText + '</option>');
						});
					}
					$(cancelCmd).click();
				} else {
					$.notify('ไม่สามารถบันทึกข้อมูลได้ในขณะนี้', "error");
				}
			}
		});

		$('#quickreply').css(quickReplyDialogStyle);
		$(saveTypeOptionBox).css(quickReplyContentStyle);
		$(saveTypeOptionBox).css({'width' : '720px', 'max-height': '320px', 'margin': '10% auto'});
		$('#quickreply').append($(saveTypeOptionBox));
	}

	const onBackToOpenCaseCmdClick = function(evt) {
		$('#AcceptedCaseCmd').click();
	}

  const doOpenHR = function(link, patientFullName, casedate){
		$('body').loading('start');
    //window.open(link, '_blank');
		let filePaths = link.split('/');
		let fileNames = filePaths[filePaths.length-1];
		let fileName = fileNames.split('.');
		let fileExt = fileName[1];
		fileName = (patientFullName.split(' ').join('_')) + '-' + casedate + '.' + fileExt;
		var pom = document.createElement('a');
		$.ajax({
	    url: link,
			xhrFields:{
	 			responseType: 'blob'
			},
	    success: function(data){
				let stremLink = URL.createObjectURL(new Blob([data], {type: 'image/jpeg'}));
				pom.setAttribute('href', stremLink);
				pom.setAttribute('download', fileName);
				pom.click();
			}
		});
		$('body').loading('stop');
  }

  const doRenderPatientHR = function(hrlinks, patientFullName, casedate) {
    return new Promise(async function(resolve, reject) {
      let hrBox = $('<div style="100%"></div>');
			$(hrBox).css({'display': 'inline-block', 'float': 'right'});
			if ((hrlinks) && (hrlinks.length > 0)){
	      await hrlinks.forEach((item, i) => {
					let patientHRLink = $('<span style="padding: 5px; text-decoration: underline; cursor: pointer; color: white;"></span>');
					let filePaths = item.link.split('/');
					let fileNames = filePaths[filePaths.length-1];
					let fileName = fileNames.split('.');
					let fileExt = fileName[1];
					let patientName = patientFullName.split(' ').join('_');
					let linkText = patientName + '(' + (i+1) + ')' + '.' + fileExt;
					$(patientHRLink).text(linkText);
					let clipIcon = new Image();
					clipIcon.src = '/images/clip-icon.png';
					$(clipIcon).css({"width": "25px", "height": "auto", "margin-top": "10px"});
					$(patientHRLink).prepend($(clipIcon));
					$(patientHRLink).on("click", function(evt){
	          doOpenHR(item.link, patientFullName, casedate);
	    		});
					$(patientHRLink).appendTo($(hrBox));
	      });
			}
      resolve($(hrBox));
    });
  }

	const doCreateDicomCmdBox = function(orthancStudyID, studyInstanceUID, casedate, hospitalId){
		let dicomCmdBox = $('<div></div>');
		let downloadCmd = $('<span>Download</span>');
		$(downloadCmd).css(commandButtonStyle);
		$(downloadCmd).appendTo($(dicomCmdBox));
		$(downloadCmd).on('click', async (evt)=>{
			$('body').loading('start');
			let downloadRes = await doDownloadDicom(orthancStudyID, hospitalId, casedate);
			$('body').loading('stop');
		});
		let openViewerCmd = $('<span>Open</span>');
		$(openViewerCmd).appendTo($(dicomCmdBox));
		$(openViewerCmd).css(commandButtonStyle);
		$(openViewerCmd).on('click', async (evt)=>{
			common.doOpenStoneWebViewer(studyInstanceUID);
		});
		return $(dicomCmdBox);
	}

	const doCreateHRBackwardBox = function(patientFullName, patientHRLinks, casedate){
		return new Promise(async function(resolve, reject) {
			let hrbackwardBox = $('<div style="width: 100%;"></div>');
			if ((patientHRLinks) && (patientHRLinks.length > 0)){
				await patientHRLinks.forEach((item, i) => {
					let filePaths = item.link.split('/');
					let fileNames = filePaths[filePaths.length-1];
					let fileName = fileNames.split('.');
					let fileCode = fileName[0];
					let codeLink = $('<div style="width: 100%;">' + fileCode + '</div>');
					$(hrbackwardBox).append($(codeLink));
					$(codeLink).css(commandButtonStyle);
					$(codeLink).on('click',(evt)=>{
						doOpenHR(item.link, patientFullName, casedate);
					});
				});
			}
			resolve($(hrbackwardBox));
		});
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
		return $(responseBackwarBox);
	}

	const doCreateToggleSwitch = function(patientFullName, backwardView, currentCaseId) {
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
				patientBackwards = await doLoadPatientBackward(caseHospitalId, casePatientId, backwardCaseStatus, currentCaseId);
			} else {
				let limit = 2;
				patientBackwards = await doLoadPatientBackward(caseHospitalId, casePatientId, backwardCaseStatus, currentCaseId, limit);
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
			$(backwardHeader).append($('<span style="display: table-cell; text-align: center;" class="header-cell">ไฟล์ประวัติ</span>'));
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
					let patientHRBackwardBox = await doCreateHRBackwardBox(patientFullName, backward.Case_PatientHRLink, casedate);
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
					let hrBackwardCell = $('<span style="display: table-cell; text-align: center; padding: 4px; vertical-align: middle;"></span>');
					$(hrBackwardCell).append($(patientHRBackwardBox));
					$(backwardRow).append($(hrBackwardCell));
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

	const doCreatePatientBackward = function(backwards, patientFullName, currentCaseId) {
		return new Promise(async function(resolve, reject) {
			let backwardBox = $('<div style="100%"></div>');
			let titleBox = $('<div style="100%"></div>');
			$(titleBox).appendTo($(backwardBox));
			let titleText = $('<span><b>ประวัติการตรวจ</b></span>');
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

  const doCreateSummaryDetailCase = function(caseOpen){
    return new Promise(async function(resolve, reject) {
      let jqtePluginStyleUrl = '../../lib/jqte/jquery-te-1.4.0.css';
			$('head').append('<link rel="stylesheet" href="' + jqtePluginStyleUrl + '" type="text/css" />');
			$('head').append('<link rel="stylesheet" href="../case/css/scanpart.css" type="text/css" />');
			let jqtePluginScriptUrl = '../../lib/jqte/jquery-te-1.4.0.min.js';
			$('head').append('<script src="' + jqtePluginScriptUrl + '"></script>');

			caseHospitalId = caseOpen.case.hospitalId;
			casePatientId = caseOpen.case.patientId;
			caseId = caseOpen.case.id;

      const userdata = JSON.parse(localStorage.getItem('userdata'));
			const patientFullName = caseOpen.case.patient.Patient_NameEN + ' ' + caseOpen.case.patient.Patient_LastNameEN;
			let limit = 2;
			let patientBackward = await doLoadPatientBackward(caseHospitalId, casePatientId, backwardCaseStatus, caseId, limit);

			let patientBackwardView = undefined;
			if (patientBackward.Records.length > 0) {
				patientBackwardView = await doCreatePatientBackward(patientBackward.Records, patientFullName, caseId);
			} else {
				patientBackwardView = $('<div style="100%"><span><b>ไม่พบประวัติการตรวจ</b></span></div>');
			}
      const yourTemplates = await doLoadTemplateList(userdata.id);
      let summary = $('<div></div>');
      let summaryFirstLine = $('<div></div>');
      $(summaryFirstLine).append($('<span><b>HN:</b> </span>'));
      $(summaryFirstLine).append($('<span style="margin-left: 4px; color: white;">' + caseOpen.case.patient.Patient_HN + '</span>'));
      $(summaryFirstLine).append($('<span style="margin-left: 4px;"><b>Name:</b> </span>'));
      $(summaryFirstLine).append($('<span style="margin-left: 4px; color: white;">' + patientFullName + '</span>'));
      $(summaryFirstLine).append($('<span style="margin-left: 4px;"><b>Age/sex:</b> </span>'));
      $(summaryFirstLine).append($('<span style="margin-left: 4px; color: white;">' + caseOpen.case.patient.Patient_Age + '/' + caseOpen.case.patient.Patient_Sex + '</span>'));
      $(summaryFirstLine).append($('<span style="margin-left: 4px;"><b>Body Part:</b> </span>'));
      $(summaryFirstLine).append($('<span style="margin-left: 4px; color: white;">' + caseOpen.case.Case_BodyPart + '</span>'));
      $(summaryFirstLine).append($('<span style="margin-left: 4px;"><b>โรงพยาบาล:</b> </span>'));
      $(summaryFirstLine).append($('<span style="margin-left: 4px; color: white;">' + caseOpen.case.hospital.Hos_Name + '</span>'));
      $(summaryFirstLine).css(common.pageLineStyle);
      $(summaryFirstLine).appendTo($(summary));

      let summarySecondLine = $('<div></div>');
      let downloadCmd = $('<input type="button" value=" Download "/>');

			let caseCreateAt = util.formatDateTimeStr(caseOpen.case.createdAt);
			let casedatetime = caseCreateAt.split('T');
			let casedateSegment = casedatetime[0].split('-');
			casedateSegment = casedateSegment.join('');
			let casedate = casedateSegment;

      let downloadData = {patientId: caseOpen.case.patient.id, studyID: caseOpen.case.Case_OrthancStudyID, casedate: casedate, hospitalId: caseOpen.case.hospitalId};
      $(downloadCmd).data('downloadData', downloadData);
      $(downloadCmd).on('click', onDownloadCmdClick);
      $(downloadCmd).appendTo($(summarySecondLine))
      $(summarySecondLine).append($('<span>  </span>'));

      let openStoneWebViewerCmd = $('<input type="button" value=" Open "/>');
      let openData = {studyInstanceUID: caseOpen.case.Case_StudyInstanceUID};
      $(openStoneWebViewerCmd).data('openData', openData);
      $(openStoneWebViewerCmd).on('click', onOpenStoneWebViewerCmdClick);
      $(openStoneWebViewerCmd).appendTo($(summarySecondLine));
      $(summarySecondLine).append($('<span>  </span>'));

      let openThirdPartyCmd = $('<input type="button" value=" Open (3rd Party)"/>');
      $(openThirdPartyCmd).on('click', onOpenThirdPartyCmdClick);
      $(openThirdPartyCmd).appendTo($(summarySecondLine));
      $(summarySecondLine).append($('<span>  </span>'));

      if ((caseOpen.case.Case_PatientHRLink) && (caseOpen.case.Case_PatientHRLink.length > 0)) {
        $(summarySecondLine).append($('<span>  </span>'));
        let patientHRBox = await doRenderPatientHR(caseOpen.case.Case_PatientHRLink, patientFullName, casedate);
        $(summarySecondLine).append($(patientHRBox));
      }

      $(summarySecondLine).css(common.pageLineStyle);
      $(summarySecondLine).appendTo($(summary));

			let summaryThirdLine = $('<div></div>');
			$(summaryThirdLine).append($(patientBackwardView));
			$(summaryThirdLine).css(common.pageLineStyle);
			$(summaryThirdLine).appendTo($(summary));


			let contactToolsLine = $('<div style="width: 99%; min-height: 80px;"></div>');
			let contactContainer = chatman.doCreateContactContainer(caseId, caseOpen);
			$(contactToolsLine).append($(contactContainer));
			$(contactToolsLine).css(common.pageLineStyle);
			$(contactToolsLine).appendTo($(summary));


      let summaryFourthLine = $('<div></div>');
      $(summaryFourthLine).append($('<span><b>Templat:</b> </span>'));
      let templateSelector = $('<select id="TemplateSelector"></select>');
			$(templateSelector).append('<option value="0">เลือก Template ของฉัน</option>');
      if (yourTemplates.Options.length > 0) {
        yourTemplates.Options.forEach((item, i) => {
          $(templateSelector).append('<option value="' + item.Value + '">' + item.DisplayText + '</option>');
        });
      }
      $(templateSelector).on('change', onTemplateSelectorChange);
      $(templateSelector).appendTo($(summaryFourthLine));
			$(summaryFourthLine).append($('<span>  </span>'));
			let addNewTemplateCmd = $('<input type="button" id="AddNewTemplateCmd" value=" Save New Template"/>');
			$(addNewTemplateCmd).hide();
			$(addNewTemplateCmd).appendTo($(summaryFourthLine));
			$(addNewTemplateCmd).on('click', onAddNewTemplateCmdClick)
      $(summaryFourthLine).css(common.pageLineStyle);
      $(summaryFourthLine).appendTo($(summary));

      let simpleEditorBox = $('<div></div>');
      let simpleEditor = $('<input type="text" id="SimpleEditor"/>');
      $(simpleEditor).appendTo($(simpleEditorBox));
			keytypecounter = 0;
			backupDraftCounter = 0;
      $(simpleEditor).jqte({change: (evt)=>{
				//auto backup on local storage
				if (keytypecounter == 10) {
					let currentContent = $(summary).find('#SimpleEditor').val();
					doBackupDraft(caseId, currentContent);
					keytypecounter = 0;
					//let draftRestore = doRestoreDraft(caseId);
					// doViewBackupDraft(draftRestore.content);
				} else {
					keytypecounter += 1;
				}
			}});
      $(simpleEditorBox).appendTo($(summary));

			let createNewResponseCmd = $('<input type="button" value=" ส่งผลอ่าน "/>');
			let createNewResponseData = {caseId: caseOpen.case.id, hospitalId: caseHospitalId, patientFullName: patientFullName, casedate: casedate};
			$(createNewResponseCmd).data('createNewResponseData', createNewResponseData);
			$(createNewResponseCmd).on('click', onCreateNewResponseCmdClick);

			let saveDraftResponseCmd = $('<input type="button" value=" Draft "/>');
			let saveDraftResponseData = {caseId: caseOpen.case.id, patientFullName: patientFullName, casedate: casedate, type: 'draft'};
			$(saveDraftResponseCmd).data('saveDraftResponseData', saveDraftResponseData);
			$(saveDraftResponseCmd).on('click', onSaveDraftResponseCmdClick);

			let backToOpenCaseCmd = $('<input type="button" value=" กลับ "/>');
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


			const youCan = [5, 6, 9, 10, 11, 12, 13, 14];
			let checkState = util.contains.call(youCan, caseOpen.case.casestatusId);
			if (checkState) {
			//if ((caseOpen.case.casestatusId == 9) || (caseOpen.case.casestatusId == 13) || (caseOpen.case.casestatusId == 14)) {
				let draftResponseRes = await doCallDraftRespons(caseId);
				if (draftResponseRes.Record.length > 0) {
					caseResponseId = draftResponseRes.Record[0].id;
					let resType = draftResponseRes.Record[0].Response_Type;
					if ((resType === 'draft') || ((resType === 'normal') && (checkState))) {
						let cloudUpdatedAt = new Date(draftResponseRes.Record[0].updatedAt);
						let draftBackup = doRestoreDraft(caseId);
						if (draftBackup) {
							let localUpdateAt = new Date(draftBackup.backupAt);
							if (localUpdateAt.getTime() > cloudUpdatedAt.getTime()) {
								let yourAnwser = confirm('พบว่ามีข้อมูลผลอ่านแบ็คอัพที่ Local ปรับปรุงล่าสุดกว่าที่ Server\nต้องการให้กู้ข้อมูลผลอ่านจาก Lacal มาแทนที่หรือไม่');
								if (yourAnwser) {
									$(summary).find('#SimpleEditor').jqteVal(draftBackup.content);
								} else {
									$(summary).find('#SimpleEditor').jqteVal(draftResponseRes.Record[0].Response_HTML);
								}
							} else {
								$(summary).find('#SimpleEditor').jqteVal(draftResponseRes.Record[0].Response_HTML);
							}
						} else {
							$(summary).find('#SimpleEditor').jqteVal(draftResponseRes.Record[0].Response_HTML);
						}
					}
				}
			} else {
				/*
				let defualTemplateId = yourTemplates.Options[0].Value;
				let templateSelectResult = await doLoadTemplate(defualTemplateId);
				$(summary).find('#SimpleEditor').jqteVal(templateSelectResult.Record[0].Content);
				*/
			}

			$(summary).find('.jqte_editor').css({ height: '350px' });

      resolve($(summary));
    });
  }

  const doCallMyOpenCase = function(caseId){
    return new Promise(async function(resolve, reject) {
			let userdata = JSON.parse(localStorage.getItem('userdata'));
			let userId = userdata.id;
			let rqParams = {userId: userId};
			let apiUrl = '/api/cases/select/' + caseId;
			try {
				let response = await common.doCallApi(apiUrl, rqParams);
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
			$.post(apiUri, params, function(response){
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
			$.post(apiUri, params, function(response){
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
			$.post(apiUri, params, function(response){
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doCallSaveResponse = function(params){
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/caseresponse/add';
			$.post(apiUri, params, function(response){
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
			$.post(apiUri, params, function(response){
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

  const doCreateOpenCasePage = function(caseId) {
    return new Promise(async function(resolve, reject) {
      $('body').loading('start');
      let myOpenCase = await doCallMyOpenCase(caseId);
      let myOpenCaseView = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');
      if (myOpenCase.Records.length > 0) {
        let caseOpen = myOpenCase.Records[0];
        let caseSummaryDetail = await doCreateSummaryDetailCase(caseOpen);
        $(myOpenCaseView).append($(caseSummaryDetail));
      } else {
        let notFoundMessage = $('<h3>เกิดข้อผิดพลาด ไม่พบรายการเคสที่คุณเลือกในขณะนี้</h3>')
        $(myOpenCaseView).append($(notFoundMessage));
      }
      resolve($(myOpenCaseView));
      $('body').loading('stop');
    });
  }

	const doBackupDraft = function(caseId, content){
		return new Promise(async function(resolve, reject) {
			let draftbackup = {caseId: caseId, content: content, backupAt: new Date()};
			localStorage.setItem('draftbackup', JSON.stringify(draftbackup));
			if (backupDraftCounter == 30) {
				let saveDraftResponseData = {type: 'draft', caseId: caseId};
				await doSaveDraft(saveDraftResponseData);
				backupDraftCounter = 0;
			} else {
				backupDraftCounter =+ 1;
			}
			let isShowNewTemplateCmd = $('#AddNewTemplateCmd').css('display');
			if (isShowNewTemplateCmd === 'none') {
				$('#AddNewTemplateCmd').show();
			}
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
		$('#quickreply').css(quickReplyDialogStyle);
		$(backupDrafBox).css(quickReplyContentStyle);
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

  return {
		commandButtonStyle,
		quickReplyDialogStyle,
		quickReplyContentStyle,

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
    doCreateOpenCasePage
	}
}
