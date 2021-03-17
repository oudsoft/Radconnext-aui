tmodule.exports = function ( jq ) {
	const $ = jq;
	const main = require('../main.js')
	const apiconnector = require('../../case/mod/apiconnect.js')($);
	const util = require('../../case/mod/utilmod.js')($);
	const inputStyleClass = {"font-family": "THSarabunNew", "font-size": "24px"};

	$.ajaxSetup({
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
    }
  });

	function doCallApi(url, rqParams) {
		return new Promise(function(resolve, reject) {
			apiconnector.doCallApi(url, rqParams).then((response) => {
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doLoadHospitalList = function() {
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/hospital/options';
			var params = {};
			$.post(apiUri, params, function(response){
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doLoadRadioList = function(hospitalId) {
		return new Promise(function(resolve, reject) {
			//var apiUri = '/api/radiologist/list';
			var apiUri = '/api/radiologist/hospital/radio';
			var params = {hospitalId: hospitalId};
			$.post(apiUri, params, function(response){
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doLoadCaseList = function(radioId) {
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/cases/filter/radio';
			//var statusId = [1, 2, 5];
			var statusId = [1, 2];
			var params = {userId: radioId, statusId: statusId};
			//var params = {userId: radioId, statusId: statusId, filterDate: filterDate};
			$.post(apiUri, params, function(response){
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doSearchCase = function(radioId, conditionParams) {
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/cases/search/radio';
			var params = {userId: radioId, condition: conditionParams};
			$.post(apiUri, params, function(response){
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doUpdateCaseStatus = function(id, newStatus, newDescription){
		return new Promise(async function(resolve, reject) {
			const main = require('../main.js');
			let userdata = JSON.parse(main.doGetUserData());
			let hospitalId = userdata.hospitalId;
			let userId = userdata.userId;
			let rqParams = { hospitalId: hospitalId, userId: userId, caseId: id, casestatusId: newStatus, caseDescription: newDescription};
			let apiUrl = '/api/cases/status/' + id;
			try {
				let response = await doCallApi(apiUrl, rqParams);
				resolve(response);
			} catch(e) {
				console.log('error=>', e);
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

	const doSaveNewResponse = function(caseId, userId, data) {
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/caseresponse/add';
			var params = {caseId: caseId, userId: userId, data: data, type: 'normal'};
			$.post(apiUri, params, function(response){
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doCallResponse = function(caseId){
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/caseresponse/select/' + caseId;
			var params = {};
			$.post(apiUri, params, function(response){
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doCallHospitalJoinOption = function(radioId){
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/radiologist/join/' + radioId;
			var params = {};
			$.post(apiUri, params, function(response){
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doCallHospitalJoinUpdate = function(data, radioId){
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/radiologist/join/update/' + radioId;
			var params = {data: data};
			$.post(apiUri, params, function(response){
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doCallTemplate = function(radioId){
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/template/list';
			var params = {userId: radioId};
			$.post(apiUri, params, function(response){
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doLoadAcceptCaseConfig = function(radioId, hospitalId) {
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/radiologist/caseaccept/' + radioId + '/' + hospitalId;
			var params = {userId: radioId};
			$.post(apiUri, params, function(response){
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	const doResetAcceptCaseConfig = function(newConfig, radioId, hospitalId) {
		return new Promise(function(resolve, reject) {
			var apiUri = '/api/radiologist/caseaccept/reset/' + radioId + '/' + hospitalId;
			var params = newConfig;
			$.post(apiUri, params, function(response){
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
				reject(err);
			})
		});
	}

	/* Radio Work Schedule Section */

	function doCreateHospitalJoinForm(radioId){
		return new Promise(async function(resolve, reject){
			let form = $('<div id="HospitalJoinForm"></div>');
			let mainDiv = $('<div style="display: table"></div>');
			$(mainDiv).appendTo($(form));
			let labelRow = $('<div style="display: table-row"></div>');
			$(labelRow).appendTo($(mainDiv));
			let labelCol = $('<div style="display: table-cell" width="200px;">รายการโรงพยาบาลที่รับงาน</div>');
			$(labelCol).appendTo($(labelRow));
			let configCol = $('<div style="display: table-cell""></div>');
			$(configCol).appendTo($(labelRow));
			let configCmd = $('<img src="/images/setting-icon.png" width="30px" title="hospital join configuration."/>');
			$(configCmd).css({'cursor': 'pointer', 'margin-left': '20px'});
			$(configCmd).appendTo($(configCol));
			$(configCmd).on('click', (e)=>{
				let eventData = {radioId: radioId};
				$(selector).trigger('openjoinconfig', [eventData]);
			});
			let selectorRow = $('<div style="display: table-row"></div>');
			$(selectorRow).appendTo($(mainDiv));
			let selectorCol = $('<div style="display: table-cell""></div>');
			$(selectorCol).appendTo($(selectorRow));
			let selector = $('<select id="HospitalJoinSelector"></select>');
			let guideOption = $('<option value="0">โปรดเลือกโรงพยาบาล</option>');
			$(guideOption).appendTo($(selector));
			$(selector).appendTo($(selectorCol));
			$(selector).on('change', (e)=>{
				let joinId = $(selector).val();
				let eventData = {radioId: radioId, joinId: joinId};
				$(selector).trigger('loadschedule', [eventData]);
			});
			doCallHospitalJoinOption(radioId).then((joins) => {
				//console.log((joins));
				joins.options.forEach((item, i) => {
					$(selector).append('<option value="' + item.Value + '">' + item.DisplayText + '</option>');
				});
				$(selector).css(inputStyleClass);
				$(form).css(inputStyleClass);
				resolve($(form));
			});
		});
	}

	function doCreateJoinConfigurationForm(radioId){
		let form = $('<div id="JoinConfigurationForm"></div>');
		let mainDiv = $('<div style="display: table"></div>');
		$(mainDiv).appendTo($(form));
		let labelRow = $('<div style="display: table-row"></div>');
		$(labelRow).appendTo($(mainDiv));
		let availableLabelCol = $('<div style="display: table-cell" width="300px;">โรงพยาบาลที่ยังไม่รับงาน</div>');
		$(availableLabelCol).appendTo($(labelRow));
		let existLabelCol = $('<div style="display: table-cell" width="300px;">โรงพยาบาลที่รับงานแล้ว</div>');
		$(existLabelCol).appendTo($(labelRow));

		let seletorRow = $('<div style="display: table-row"></div>');
		$(seletorRow).appendTo($(mainDiv));
		let availableCol = $('<div style="display: table-cell width: 200px"></div>');
		$(availableCol).appendTo($(seletorRow));
		let existCol = $('<div style="display: table-cell"></div>');
		$(existCol).appendTo($(seletorRow));

		let availableSelector = $('<select id="AvailableHospital" multiple></select>');
		$(availableSelector).appendTo($(availableCol));
		$(availableSelector).css(inputStyleClass);
		let existSelector = $('<select id="ExistHospital" multiple></select>');
		$(existSelector).appendTo($(existCol));
		$(existSelector).css(inputStyleClass);

		let availableList = $("#HospitalSelector > option").clone();
		$(availableSelector).append($(availableList));

		let existList = $("#HospitalJoinSelector > option").clone();
		$(existSelector).append($(existList));
		$(existSelector).find('option[value="0"]').remove();
		$(existSelector).find('option').each((i,opt) =>{
			let v = $(opt).attr('value');
			$(availableSelector).find('option[value="' + v + '"]').remove();
		});

		$(availableSelector).on('change', (e) => {
			let v = $(availableSelector).val();
			let t = $(availableSelector).find('option[value="' + v + '"]').text();
			$(existSelector).append('<option value="' + v + '">' + t + '</option>');
			$(availableSelector).find('option[value="' + v + '"]').remove();
		});
		$(existSelector).on('change', (e) => {
			let v = $(existSelector).val();
			let t = $(existSelector).find('option[value="' + v + '"]').text();
			$(availableSelector).append('<option value="' + v + '">' + t + '</option>');
			$(existSelector).find('option[value="' + v + '"]').remove();
		});

		let actionCmdRow = $('<div style="display: table-row; text-align: center; margin-top: 20px;"></div>');
		$(actionCmdRow).appendTo($(mainDiv));
		let actionCmdCol = $('<div style="display: table-cell; width: 400px;"></div>');
		$(actionCmdCol).appendTo($(actionCmdRow));
		let saveCmd = $('<input type="button" value=" Save "/>');
		$(saveCmd).appendTo($(actionCmdCol));
		$(saveCmd).on('click', (e)=>{
			$('body').loading('start');
			let yourHospitals = [];
			$(existSelector).find('option').each((i,opt) =>{
				let v = $(opt).attr('value');
				let item = {id: v, acctype: 'n'};
				yourHospitals.push(item);
			});
			doCallHospitalJoinUpdate(yourHospitals, radioId).then((result)=>{
				console.log(result);
				alert('บันทึกการเข้ารับงานสำเร็จ');
				let eventData = {radioId: radioId};
				$(saveCmd).trigger('togglemainform', [eventData]);
				$('body').loading('stop');
			});
		});
		let cancelCmd = $('<input type="button" value=" Cancel "/>');
		$(cancelCmd).appendTo($(actionCmdCol));
		$(cancelCmd).on('click', (e)=>{
			let eventData = {radioId: radioId};
			$(cancelCmd).trigger('togglemainform', [eventData]);
		});
		$(actionCmdCol).find('input[type="button"]').css(inputStyleClass);
		return $(form);
	}

	const doCreateAcceptCaseConfigForm = function(configData, radioId, hospitalId) {
		return new Promise(function(resolve, reject) {
			let form = $('<div id="AcceptCaseConfigForm" style="display: table"></div>');
			let formRow = $('<div style="display: table-row"></dv>');
			let labelCell = $('<div style="display: table-cell; width: 250px;"><b>Auto Accept New Case</b></div>');
			let valueCell = $('<div style="display: table-cell;"></div>');
			let accOption = $('<select></select>');
			$(accOption).css(inputStyleClass);
			$(accOption).append($('<option value="n">No</option>'));
			$(accOption).append($('<option value="y">Yes</option>'));
			$(accOption).appendTo($(valueCell));
			$(accOption).on('change', async (evt)=>{
				$('body').loading('start');
				let newAcc = $(accOption).val();
				let newConfig = {id: hospitalId, acctype: newAcc};
				let accResetRes = await doResetAcceptCaseConfig(newConfig, radioId, hospitalId);
				console.log(accResetRes);
				$('body').loading('stop');
			});
			let config = configData.configs[0];
			if ((config) && (config.acctype)) {
				$(accOption).val(config.acctype);
			}
			$(form).append($(formRow));
			$(formRow).append($(labelCell)).append($(valueCell));
			resolve($(form));
		});
	}

	/* Radio Tools Section */

	const doCreateSearchDicomForm = function(socketId) {
		let form = $('<div style="display: table"></div>');
		$(form).append('<div style="display: table-row"><div style="display: table-cell; width: 150px;"><label>Hospital Target : </label></div><div style="display: table-cell;"><select id="HospitalTarget"></select></div></div>');
		let hospitalList = $("#HospitalSelector > option").clone();
		$(form).find('#HospitalTarget').append($(hospitalList));
		$(form).append('<div style="display: table-row"><div style="display: table-cell; width: 150px;"><label>Dicom Key : </label></div><div style="display: table-cell;"><select id="SearchKey"><option value="PatientHN">Patient HN</option><option value="PatientName">Patient Name</option></select></div></div>');
		$(form).append('<div style="display: table-row; margin-top: 10px;"><div style="display: table-cell; width: 150px;"><label>Value :</label></div><div style="display: table-cell;"><input type="text" id="SearchValue" size="30"/></div></div>');
		let searchCmdDiv = $('<div style="text-align: center; margin-top: 10px;"></div>');
		$(searchCmdDiv).appendTo($(form));
		let searchExecCmd = $('<input type="button" value=" Search "/>');
		$(searchCmdDiv).append($(searchExecCmd));
		$(searchExecCmd).click((e)=>{
			let hospitalTargetId = $(form).find('#HospitalTarget').val();
			let searchKey = $(form).find('#SearchKey').val();
			let searchValue = $(form).find('#SearchValue').val();
			if (searchValue !== '') {
				$(form).find('#SearchValue').css('border', '');
				let eventData = {hospitalId: hospitalTargetId, key: searchKey, value: searchValue, owner: socketId};
				$(searchExecCmd).trigger('searchexec', [eventData]);
				$('body').loading('start');
			} else {
				$(form).find('#SearchValue').css('border', '1px solid red');
			}
		})
		$(form).find('input[type="text"]').css(inputStyleClass);
		$(form).find('input[type="button"]').css(inputStyleClass);
		$(form).find('select').css(inputStyleClass);
		return $(form);
	}

	const doCreateResultCFind = function(results, hospitalId, queryPath){
		return new Promise(async function(resolve, reject) {
			let cfindResultDiv = $('<div id="CfindResultDiv" style="margin-top: 10px;"></div>');
			let resultTags = Object.getOwnPropertyNames(results);
			if (resultTags.length > 0) {
				await resultTags.forEach(async (tags) => {
			    if (results.hasOwnProperty(tags)) {
		        let tagDiv = $('<div style="display: table"></div>');
						$(tagDiv).appendTo($(cfindResultDiv));
						let tagRow = $('<div style="display: table-row"></div>');
						$(tagRow).appendTo($(tagDiv));
						let tagNameCol = $('<div style="display: table-cell; width: 120px;">' + tags + '</div>');
						$(tagNameCol).appendTo($(tagRow));
						let tagDetailCol = $('<div style="display: table-cell;"></div>');
						let details = results[tags];
						let detailRow = $('<div style="display: table-row"></div>');
						$(detailRow).appendTo($(tagDetailCol));
						await Object.getOwnPropertyNames(details).forEach((tag) => {
							if (tag === 'Name') {
								let detailNameCol = $('<div style="display: table-cell; width: 200px;">' + details[tag] + '</div>');
								$(detailNameCol).appendTo($(detailRow));
							} else if (tag === 'Value') {
								let detailValueCol = $('<div style="display: table-cell;">' + details[tag] + '</div>');
								$(detailValueCol).appendTo($(detailRow));
							}
						});
						$(tagDetailCol).appendTo($(tagRow));
			    }
				});
				let main = require('../main.js');
				let userdata = JSON.parse(main.doGetUserData());
				let socketId = userdata.username;
				let patientID = '';
				if (results['0010,0020']) {
					patientID = results['0010,0020'].Value;
				}
				let cmoveCmdDiv = doCreateCmoveCmd(socketId, hospitalId, patientID, queryPath);
				$(cmoveCmdDiv).appendTo($(cfindResultDiv));
				$('body').loading('stop');
			} else {
				$(cfindResultDiv).append('<b>Not Found any Reource.</b>');
				$('body').loading('stop');
			}
			resolve($(cfindResultDiv));
		});
	}

	const doFindExec = function(e, data) {
		let main = require('../main.js');
		let myWsm = main.doGetWsm();
		myWsm.send(JSON.stringify({type: 'exec', data: data}));
	}

	const doCreateCmoveCmd = function(socketId, hospitalId, patientID, queryPath){
		let cmoveCmdDiv = $('<div style="text-align: center;"></div>');
		let cmoveCmd = $('<input type="button" value=" Load to cloud "/>');
		$(cmoveCmd).css(inputStyleClass);
		$(cmoveCmd).appendTo($(cmoveCmdDiv));
		$(cmoveCmd).click((evt)=>{
			$('body').loading('start');
			let moveData = {hospitalId: hospitalId, patientID: patientID, owner: socketId, queryPath: queryPath};
			let main = require('../main.js');
			let myWsm = main.doGetWsm();
			myWsm.send(JSON.stringify({type: 'move', data: moveData}));
			//$('body').loading('stop');
		});
		return $(cmoveCmdDiv);
	}

	const doShowFindResult = async function(result, hospitalId, tab, queryPath) {
		let cfindResultDiv = await doCreateResultCFind(result, hospitalId, queryPath);
		$(tab).append($(cfindResultDiv));
	}

	const doMoveResult = function(hospitalId, patientID, tab) {
		return new Promise(function(resolve, reject) {
			const main = require('../main.js');
			const userdata = JSON.parse(main.doGetUserData());
			let query = '{"Level":"Study","Query":{"PatientID":"' + patientID + '"},"Expand":true}';
			let orthancUri = '/tools/find';
			let params = {method: 'post', uri: orthancUri, body: query, hospitalId: hospitalId};
			apiconnector.doCallOrthancApiByProxy(params).then((studies) =>{
				console.log(studies);
				if (studies.length == 0){
					let userConfirm = confirm('ยังไม่พบ Dicom ของผู้ป่วยบนเซอร์ฟเวอร์\nเป็นไปได้ว่าข้อมูลยัง Move ไม่สมบูรณ์ คุณต้องการตวจสอบซ้ำหรือไม่?');
					if (userConfirm) {
						doMoveResult(hospitalId, patientID, tab);
					}
				} else {
					let cmoveResultDiv = $('<div id="CmoveResultDiv" style="margin-top: 10px;"></div>');
					$(cmoveResultDiv).appendTo($(tab));
					studies.forEach((study, i) => {
						let title = 'Default';
						if (study.MainDicomTags.StudyDescription) {
							title = study.MainDicomTags.StudyDescription;
						} else if (study.MainDicomTags.AccessionNumber) {
							title = study.MainDicomTags.AccessionNumber;
						}
						let studyInstanceUID = study.MainDicomTags.StudyInstanceUID;
						let openStoneWebViewerCmd = $('<input type="button" value=" ' + title + ' "/>');
						$(openStoneWebViewerCmd).appendTo($(cmoveResultDiv));
						$(openStoneWebViewerCmd).css(inputStyleClass);
						$(openStoneWebViewerCmd).click((evt)=>{
							$('body').loading('start');
							main.doOpenStoneWebViewer(studyInstanceUID, hospitalId);
							$('body').loading('stop');
						});
						$(cmoveResultDiv).append('<span>  </span>');
					});
				}
				$('body').loading('stop');
			});
		});
	}

	/*Template section */

	const doCreateTemplate = function(radioId){
		return new Promise(async function(resolve, reject) {
			let templateRes = await doCallTemplate(radioId);
			let templateList = templateRes.Records;

			let templateListDiv = $('<table id="TemplateListDiv" width="100%"></table>');
			let addTemplateRow = $('<tr style="background-color: green; color: white;"></tr>');
			$(templateListDiv).append($(addTemplateRow));
			let titleCell = $('<td align="left" colspan="3"><b>รายการ Template</b></td>');
			$(addTemplateRow).append($(titleCell));
			let addTemplateCell = $('<td align="left"></td>');
			$(addTemplateRow).append($(addTemplateCell));
			let addTemplateCmd = $('<div id="AddTemplatCmd" style="padding:5px; width: 50px; text-align: center; background-color: white; color: green; float: right; cursor: pointer;">+</div>');
			$(addTemplateCmd).appendTo($(addTemplateCell));
			$(addTemplateCmd).click((e)=>{
				let callAddTemplateUrl = '/api/template/add';
				let addformRow = doCreateTemplatForm(radioId, callAddTemplateUrl);
				$(templateListDiv).append($(addformRow));
			});
			let headerRow = $('<tr style="background-color: green; color: white;"></tr>');
			$(templateListDiv).append($(headerRow));
			let headerCell = $('<td align="center" width="5%">#</td><td align="center" width="20%">Template Name</td><td align="center" width="40%">Template</td><td align="center" width="*">คำสั่ง</td>');
			$(headerRow).append($(headerCell));

			templateList.forEach((item, i) => {
				let no = i + 1;
				let tmName = item.Name;
				let tmContent = item.Content;
				let dataRow = $('<tr id="Template-' + item.id + '"></tr>');
				let dataCell = $('<td align="center">' + no + '</td><td align="left">' + tmName + '</td><td>' + $(tmContent).html() + '</td>');
				$(dataRow).append($(dataCell));
				let cmdCell = $('<td align="center"></td>');
				$(cmdCell).appendTo($(dataRow));

				let updateCmd = $('<input type="button" id="UpdateCmd-'+ item.id + '" value=" แก้ไข "/>');
				$(updateCmd).appendTo($(cmdCell));
				let deleteCmd = $('<input type="button" value=" ลบ "/>');
				$(deleteCmd).appendTo($(cmdCell));

				$(updateCmd).click(async (e)=>{
					let eventData = {id: item.id, Name: tmName, Content: tmContent};
					$(updateCmd).trigger('updateitem', [eventData]);
					$(dataRow).hide();
				});
				$(deleteCmd).click(async (e)=>{
					let eventData = {id: item.id};
					$(deleteCmd).trigger('deleteitem', [eventData]);
				});
				$(dataRow).find('input[type="button"]').css(inputStyleClass);
				$(templateListDiv).append($(dataRow));
			});

			$(templateListDiv).on('updateitem', (e, data)=>{
				let callUpdateTemplateUrl = '/api/template/update';
				let updateFormRow = doCreateTemplatForm(radioId, callUpdateTemplateUrl, data);
				$(templateListDiv).append($(updateFormRow));
			});

			$(templateListDiv).on('deleteitem', async (e, data)=>{
				let userConfirm = confirm('โปรดยืนยันเพื่อลบรายการนี้ โดยคลิกปุ่ม ตกลง หรือ OK');
		  	if (userConfirm == true){
		  		$('body').loading('start');
					let tmId = data.id;
					let deleteParams = {id: tmId};
					let callDeleteTemplateUrl = '/api/template/delete';
					let tmRes = await doCallApi(callDeleteTemplateUrl, deleteParams);
					if (tmRes.status.code == 200) {
						$.notify('ลบข้อมูลได้สำเร็จ', "success");
						let eventData = {};
						$(templateListDiv).trigger('updatelist', [eventData]);
					} else {
						$.notify('ไม่สามารถลบข้อมูลได้ในขณะนี้', "error");
					}
					$('body').loading('stop');
				}
			});

			$(templateListDiv).on('releaselock', (e, data)=>{
				$(templateListDiv).find('#Template-' + data.id).show();
			});

			$(templateListDiv).on('updatelist', async (e, data)=>{
				$('#Template').empty();
				doCreateTemplate(radioId).then((updataTemplate)=>{
					$('#Template').append($(updataTemplate));
				});
		  });

			resolve($(templateListDiv));
		});
	}

	function doCreateTemplatForm(radioId, callUrl, data){
		let jqtePluginStyleUrl = '../../lib/jqte/jquery-te-1.4.0.css';
		$('head').append('<link rel="stylesheet" href="' + jqtePluginStyleUrl + '" type="text/css" />');
		let jqtePluginScriptUrl = '../../lib/jqte/jquery-te-1.4.0.min.js';
		$('head').append('<script src="' + jqtePluginScriptUrl + '"></script>');

		const tmFormRow = $('<tr id="WHForm" style="background-color: green; color: white;"></tr>');
		let tmForm;
		if (data) {
			tmForm = $('<td align="left">' + data.id + '</td><td align="left"><input type="text" id="TemplateName" size="10"/></td><td align="left"><input type="text" id="Content"/></td><td align="center"><input type="button" id="SaveCmd" value=" บันทึก "/>  <input type="button" id="CancelCmd" value=" ยกเลิก "/></td>');
			$(tmForm).find('#TemplateName').val(data.Name);
			//$(tmForm).find('#Content').val(data.Content);
			//$(tmForm).find('#Content').val(data.Content);
			$(tmForm).find('#Content').jqte();
			$(tmForm).find('#Content').jqteVal(data.Content);
		} else {
			tmForm = $('<td align="left">#</td><td align="left"><input type="text" id="TemplateName" size="10"/></td><td align="left"><input type="text" id="Content"/></td></td><td align="center"><input type="button" id="SaveCmd" value=" บันทึก "/>  <input type="button" id="CancelCmd" value=" ยกเลิก "/></td>');
			$(tmForm).find('#Content').jqte();
		}
		$(tmForm).find('input[type="text"]').css(inputStyleClass);
		$(tmForm).find('input[type="button"]').css(inputStyleClass);
		$(tmFormRow).append($(tmForm));
		$(tmForm).find('#SaveCmd').click(async (e)=>{
			let tmParams;
			if (data) {
				tmParams = doVerifyTemplateForm(tmForm, radioId, data.id);
			} else {
				tmParams = doVerifyTemplateForm(tmForm, radioId);
			}
			console.log(tmParams);
			if (tmParams) {
				let tmRes = await doCallApi(callUrl, tmParams);
				if (tmRes.status.code == 200) {
					$.notify('บันทึกข้อมูลสำเร็จ', "success");
					let eventData = {};
					$(tmFormRow).trigger('updatelist', [eventData]);
					setTimeout(()=>{
						$(tmFormRow).remove();
					}, 400);
				} else {
					$.notify('ไม่สามารถบันทึกข้อมูลได้ในขณะนี้', "error");
				}
			}
		});
		$(tmForm).find('#CancelCmd').click((e)=>{
			$(tmForm).trigger('releaselock', [data]);
			$(tmFormRow).remove();
		});
		return $(tmFormRow);
	}

	function doVerifyTemplateForm(form, radioId, itemId) {
		let tmName = $(form).find('#TemplateName').val();
		let tmContent = $(form).find('#Content').val();
		if (tmName === '') {
			$(form).find('#TemplateName').css('border', '1px solid red');
			return;
		} else if (tmContent === '') {
			$(form).find('#TemplateName').css('border', '');
			$(form).find('#Content').css('border', '1px solid red');
			return;
		} else {
			$(form).find('#Content').css('border', '');
			if (itemId) {
				let updateTMParams = {id: itemId, data: {Name: tmName, Content: tmContent}};
				return updateTMParams;
			} else {
				let addTMParams = {userId: radioId, data: {Name: tmName, Content: tmContent}};
				return addTMParams;
			}
		}
	}

	/*Message section */

	const doShowMessage = function(radioId, tab){
		return new Promise(async function(resolve, reject) {
			const masterNotifyDiv = $("<div id='MasterNotifyDiv'><ul></ul></div>");
			const masterNotify = JSON.parse(localStorage.getItem('masternotify'));
			if (masterNotify) {
				await masterNotify.sort((a,b) => {
					let av = new Date(a.datetime);
					let bv = new Date(b.datetime);
					if (av && bv) {
						return bv - av;
					} else {
						return 0;
					}
				});

				let reloadCmd = $("<input type='button' value=' Re-Load ' />");
				$(reloadCmd).on('click',()=>{
					$(tab).find('#MasterNotifyDiv').remove();
					doShowMessage(radioId, tab).then((msgDiv)=>{
						$(tab).append($(msgDiv));
					});
				});
				$(reloadCmd).appendTo($(masterNotifyDiv));

				masterNotify.forEach((item, i) => {
					let masterItem = $("<li>" + JSON.stringify(item) + "</li>");
					let openCmd = $("<input type='button' value=' Open ' />");
					$(openCmd).on('click',async ()=>{
						item.status = 'Read';
						localStorage.setItem('masternotify', JSON.stringify(masterNotify));
						$(tab).find('#MasterNotifyDiv').remove();
						doShowMessage(radioId, tab).then((msgDiv)=>{
							$(tab).append($(msgDiv));
						});
					})
					$(openCmd).appendTo($(masterItem));

					let removeCmd = $("<input type='button' value=' Remove ' />");
					$(removeCmd).on('click',async()=>{
						masterNotify.splice(i, 1);
						localStorage.setItem('masternotify', JSON.stringify(masterNotify));
						$(tab).find('#MasterNotifyDiv').remove();
						doShowMessage(radioId, tab).then((msgDiv)=>{
							$(tab).append($(msgDiv));
						});
					})
					$(removeCmd).appendTo($(masterItem));
					$(masterItem).appendTo($(masterNotifyDiv));
				});
				if (masterNotify.length > 0){
					let clearAllCmd = $("<input type='button' value=' Clear ' />");
					$(clearAllCmd).on('click',async ()=>{
						let userConfirm = confirm('โปรดยืนยันเพื่อล้างราบการข้อความออกไปทั้งหมด้ โดยคลิกปุ่ม ตกลง หรือ OK');
						if (userConfirm){
							localStorage.removeItem('masternotify');
							$(tab).find('#MasterNotifyDiv').remove();
							doShowMessage(radioId, tab).then((msgDiv)=>{
								$(tab).append($(msgDiv));
							});
							$.notify('ล้างรายการข้อมูลทั้งหมดสำเร็จ', "success");
						}
					});
					$(clearAllCmd).appendTo($(masterNotifyDiv));
				}

				$(masterNotifyDiv).find('input[type="button"]').css(inputStyleClass);
			}
			resolve($(masterNotifyDiv));
		});
	}

	return {
		inputStyleClass,

		doLoadHospitalList,
		doLoadRadioList,
		doLoadCaseList,
		doSearchCase,
		doUpdateCaseStatus,
		doLoadTemplateList,
		doLoadTemplate,
		doSaveNewResponse,
		doCallResponse,
		doCallHospitalJoinOption,
		doCallHospitalJoinUpdate,
		doCallTemplate,
		doLoadAcceptCaseConfig,

		/* Radio Work Schedule Section */

		doCreateHospitalJoinForm,
		doCreateJoinConfigurationForm,
		doCreateAcceptCaseConfigForm,

		/* Radio Tools Section */
		doCreateSearchDicomForm,
		doCreateResultCFind,
		doFindExec,
		doCreateCmoveCmd,
		doShowFindResult,
		doMoveResult,
		/*Template section */
		doCreateTemplate,
		doCreateTemplatForm,
		doVerifyTemplateForm,
		/*Message section */
		doShowMessage
	}
}
