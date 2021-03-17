/* commonlib.js */
module.exports = function ( jq ) {
	const $ = jq;

  const util = require('./utilmod.js')($);
  const apiconnector = require('./apiconnect.js')($);

	const caseReadWaitStatus = [1];
	const caseResultWaitStatus = [2, 8, 9, 13, 14];
	const casePositiveStatus = [2,8,9];
	const caseNegativeStatus = [3,4,7];
	const caseReadSuccessStatus = [5, 10, 11, 12, 13, 14];
	const caseAllStatus = [1,2,3,4,5,6,7];
	const allCaseStatus = [
		{value: 1, DisplayText: 'เคสใหม่'},
		{value: 2, DisplayText: 'หมอตอบรับแล้ว่ '},
		{value: 3, DisplayText: 'หมอไม่ตอบรับ'},
		{value: 4, DisplayText: 'หมดอายุ'},
		{value: 5, DisplayText: 'ได้ผลอ่านแล้ว'},
		{value: 6, DisplayText: 'ปิดเคสไปแล้ว'},
		{value: 7, DisplayText: 'เคสถูกยกเลิก'},
		{value: 8, DisplayText: 'หมอเปิดอ่านแล้ว'},
		{value: 9, DisplayText: 'หมอเริ่มพิมพ์ผล'},
		{value: 10, DisplayText: 'เจ้าของเคสดูผลแล้ว'},
		{value: 11, DisplayText: 'เจ้าของเคสพิมพ์ผลแล้ว'},
		{value: 12, DisplayText: 'มีการแก้ไขผลอ่าน'},
		{value: 13, DisplayText: 'มีผลอ่านชั่วคราว'},
		{value: 14, DisplayText: 'มีข้อความประเด็นเคส'}
	];

	const defaultProfile = {
    readyState: 1,
		readyBy: 'user',
    screen: {
      lock: 30,
      unlock: 0
    },
    auotacc: 0,
    casenotify: {
      webmessage: 1,
      line: 1,
      autocall: 0,
      mancall:0
    }
  };

  const pageLineStyle = {'border': '2px solid blue', /*'border-radius': '10px',*/ 'background-color': 'grey', 'margin-top': '4px', 'padding': '2px'};

  const doCallApi = function(url, rqParams) {
		return new Promise(function(resolve, reject) {
			apiconnector.doCallApi(url, rqParams).then((response) => {
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
			})
		});
	}

	const doGetApi = function(url, rqParams) {
		return new Promise(function(resolve, reject) {
			apiconnector.doGetApi(url, rqParams).then((response) => {
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
			})
		});
	}

  const doOpenStoneWebViewer = function(StudyInstanceUID) {
		//const orthancWebviewerUrl = 'http://' + window.location.hostname + ':8042/web-viewer/app/viewer.html?series=';
		let userdata = JSON.parse(localStorage.getItem('userdata'));
		const hospitalId = userdata.hospitalId;

		apiconnector.doGetOrthancPort(hospitalId).then((response) => {
			//const orthancStoneWebviewer = 'http://'+ window.location.hostname + ':' + response.port + '/stone-webviewer/index.html?study=';
			const orthancStoneWebviewer = 'http://'+ response.ip + ':' + response.port + '/stone-webviewer/index.html?study=';
			let orthancwebapplink = orthancStoneWebviewer + StudyInstanceUID;
			window.open(orthancwebapplink, '_blank');
		});
	}

  const doDownloadDicom = function(studyID, dicomFilename){
		$('body').loading('start');
		let userdata = JSON.parse(localStorage.getItem('userdata'));
		const hospitalId = userdata.hospitalId;
  	apiconnector.doCallDownloadDicom(studyID, hospitalId).then((response) => {
  		console.log(response);
  		//let openLink = response.archive.link;
  		//window.open(openLink, '_blank');
			var pom = document.createElement('a');
			pom.setAttribute('href', response.link);
			pom.setAttribute('download', dicomFilename);
			pom.click();
			$('body').loading('stop');
  	})
  }

  const doPreparePatientParams = function(newCaseData){
		let rqParams = {};
		let patientFragNames = newCaseData.patientNameEN.split(' ');
		let patientNameEN = patientFragNames[0];
		let patientLastNameEN = patientFragNames[0];
		if (patientFragNames.length >= 2) {
			patientLastNameEN = patientFragNames[1];
		}
		patientFragNames = newCaseData.patientNameTH.split(' ');
		let patientNameTH = patientFragNames[0];
		let patientLastNameTH = patientFragNames[0];
		if (patientFragNames.length >= 2) {
			patientLastNameTH = patientFragNames[1];
		}
		rqParams.Patient_HN = newCaseData.hn;
		rqParams.Patient_NameTH = patientNameTH;
		rqParams.Patient_LastNameTH = patientLastNameTH;
		rqParams.Patient_NameEN = patientNameEN;
		rqParams.Patient_LastNameEN = patientLastNameEN;
		rqParams.Patient_CitizenID = newCaseData.patientCitizenID;
		rqParams.Patient_Birthday = '';
		rqParams.Patient_Age = newCaseData.patientAge;
		rqParams.Patient_Sex = newCaseData.patientSex;
		rqParams.Patient_Tel = '';
		rqParams.Patient_Address = '';
		return rqParams;
	}

  const doPrepareCaseParams = function(newCaseData) {
		let rqParams = {};
		rqParams.Case_OrthancStudyID = newCaseData.studyID;
		rqParams.Case_ACC = newCaseData.acc;
		rqParams.Case_BodyPart = newCaseData.bodyPart;
		rqParams.Case_ScanPart = newCaseData.scanpartItem;
		rqParams.Case_Modality = newCaseData.mdl;
		rqParams.Case_Manufacturer = newCaseData.manufacturer;
		rqParams.Case_ProtocolName = newCaseData.protocalName;
		rqParams.Case_StudyDescription  = newCaseData.studyDesc;
		rqParams.Case_StationName = newCaseData.stationName
		rqParams.Case_PatientHRLink = newCaseData.patientHistory;
		rqParams.Case_RadiologistId = newCaseData.drReader
		rqParams.Case_RefferalId = newCaseData.drOwner;
		rqParams.Case_RefferalName = '';
		rqParams.Case_Price = newCaseData.price;
		rqParams.Case_Department =  newCaseData.department;
		rqParams.Case_DESC = newCaseData.detail;
		rqParams.Case_StudyInstanceUID = newCaseData.studyInstanceUID
		return rqParams;
	}

	const doGetSeriesList = function(studyId) {
		return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let hospitalId = userdata.hospitalId;
			let username = userdata.username;
			const dicomUrl = '/api/dicomtransferlog/select/' + studyId;
			let rqParams = {hospitalId: hospitalId, username: username};
			let dicomStudiesRes = await doCallApi(dicomUrl, rqParams);
			if (dicomStudiesRes.orthancRes.length > 0) {
				resolve(dicomStudiesRes.orthancRes[0].StudyTags);
			} else {
				resolve()
			}
		});
	}

	const doGetOrthancStudyDicom = function(studyId) {
		return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let hospitalId = userdata.hospitalId;
			let username = userdata.username;
			let rqBody = '{"Level": "Study", "Expand": true, "Query": {"PatientName":"TEST"}}';
			let orthancUri = '/studies/' + studyId;
	  	let params = {method: 'get', uri: orthancUri, body: rqBody, hospitalId: hospitalId};
	  	let orthancRes = await apiconnector.doCallOrthancApiByProxy(params);
			resolve(orthancRes);
		});
	}

	const doGetOrthancSeriesDicom = function(seriesId) {
		return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let hospitalId = userdata.hospitalId;
			let username = userdata.username;
			let rqBody = '{"Level": "Series", "Expand": true, "Query": {"PatientName":"TEST"}}';
			let orthancUri = '/series/' + seriesId;
	  	let params = {method: 'get', uri: orthancUri, body: rqBody, hospitalId: hospitalId};
	  	let orthancRes = await apiconnector.doCallOrthancApiByProxy(params);
			resolve(orthancRes);
		});
	}

	const doCallCreatePreviewSeries = function(seriesId, instanceList){
		return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let hospitalId = userdata.hospitalId;
			let username = userdata.username;
			let params = {hospitalId: hospitalId, seriesId: seriesId, username: username, instanceList: instanceList};
			let apiurl = '/api/orthancproxy/create/preview';
			let orthancRes = await apiconnector.doCallApi(apiurl, params)
			resolve(orthancRes);
		});
	}

	const doCallCreateZipInstance = function(seriesId, instanceId){
		return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let hospitalId = userdata.hospitalId;
			let username = userdata.username;
			let params = {hospitalId: hospitalId, seriesId: seriesId, username: username, instanceId: instanceId};
			let apiurl = '/api/orthancproxy/create/zip/instance';
			let orthancRes = await apiconnector.doCallApi(apiurl, params)
			resolve(orthancRes);
		});
	}

	const doCallSendAI = function(seriesId, instanceId, studyId){
		return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let params = { userId: userdata.id, seriesId: seriesId, instanceId: instanceId, studyId: studyId};
			let apiurl = '/api/orthancproxy/sendai';
			let orthancRes = await apiconnector.doCallApi(apiurl, params)
			resolve(orthancRes);
		});
	}

	const doConvertAIResult = function(studyId, pdffilecode, modality){
		return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let params = {hospitalId: userdata.hospitalId, username: userdata.id, studyId: studyId, pdffilecode: pdffilecode, modality: modality};
			let apiurl = '/api/orthancproxy/convert/ai/report';
			let orthancRes = await apiconnector.doCallApi(apiurl, params)
			resolve(orthancRes);
		});
	}

	const doCallAIResultLog = function(studyId){
		return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let params = { userId: userdata.id, studyId: studyId};
			let apiurl = '/api/ailog/select/' + studyId;
			let aiLogRes = await apiconnector.doCallApi(apiurl, params)
			resolve(aiLogRes);
		});
	}

	const doUpdateCaseStatus = function(id, newStatus, newDescription){
		return new Promise(async function(resolve, reject) {
			let userdata = JSON.parse(localStorage.getItem('userdata'));
			let hospitalId = userdata.hospitalId;
			let userId = userdata.id;
			let rqParams = { hospitalId: hospitalId, userId: userId, caseId: id, casestatusId: newStatus, caseDescription: newDescription};
			let apiUrl = '/api/cases/status/' + id;
			try {
				let response = await doCallApi(apiUrl, rqParams);
				resolve(response);
			} catch(e) {
	      reject(e);
    	}
		});
	}

	const doUpdateConsultStatus = function(id, newStatus){
		return new Promise(async function(resolve, reject) {
			let userdata = JSON.parse(localStorage.getItem('userdata'));
			let hospitalId = userdata.hospitalId;
			let userId = userdata.id;
			let rqParams = { hospitalId: hospitalId, userId: userId, consultId: id, casestatusId: newStatus};
			let apiUrl = '/api/consult/status/' + id;
			try {
				let response = await doCallApi(apiUrl, rqParams);
				resolve(response);
			} catch(e) {
	      reject(e);
    	}
		});
	}

	const doCreateNewCustomUrgent = function(ugData){
		return new Promise(async function(resolve, reject) {
			let userdata = JSON.parse(localStorage.getItem('userdata'));
			let hospitalId = userdata.hospitalId;
			let acceptStep = {dd: ugData.Accept.dd, hh: ugData.Accept.hh, mn: ugData.Accept.mn};
			let workingStep = {dd: ugData.Working.dd, hh: ugData.Working.hh, mn: ugData.Working.mn};
			let ugTypeData = {UGType: 'custom', UGType_Name: 'กำหนดเอง', UGType_ColorCode: '', UGType_AcceptStep: JSON.stringify(acceptStep), UGType_WorkingStep: JSON.stringify(workingStep), hospitalId: hospitalId};
			let apiUrl = '/api/urgenttypes/add';
			try {
				let response = await doCallApi(apiUrl, ugTypeData);
				resolve(response);
			} catch(e) {
	      reject(e);
    	}
		});
	}

	const doCallSelectUrgentType = function(urgentId){
		return new Promise(async function(resolve, reject) {
			let apiUrl = '/api/urgenttypes/select/' + urgentId;
			let rqParams = {};
			try {
				let response = await doCallApi(apiUrl, rqParams);
				resolve(response);
			} catch(e) {
	      reject(e);
    	}
		});
	}

	const doUpdateCustomUrgent = function(ugData, ugentId) {
		return new Promise(async function(resolve, reject) {
			let acceptStep = {dd: ugData.Accept.dd, hh: ugData.Accept.hh, mn: ugData.Accept.mn};
			let workingStep = {dd: ugData.Working.dd, hh: ugData.Working.hh, mn: ugData.Working.mn};
			let ugTypeData = {UGType_AcceptStep: JSON.stringify(acceptStep), UGType_WorkingStep: JSON.stringify(workingStep)};
			let rqParams = {id: ugentId, data: ugTypeData};
			let apiUrl = '/api/urgenttypes/update';
			try {
				let response = await doCallApi(apiUrl, ugTypeData);
				resolve(response);
			} catch(e) {
				reject(e);
			}
		});
	}

	const doLoadScanpartAux = function(studyDesc, protocolName){
		return new Promise(async function(resolve, reject) {
			let userdata = JSON.parse(localStorage.getItem('userdata'));
			let hospitalId = userdata.hospitalId;
			let userId = userdata.userId;
			let rqParams = { hospitalId: hospitalId, userId: userId, studyDesc: studyDesc, protocolName: protocolName};
			let apiUrl = '/api/scanpartaux/select';
			try {
				let response = await doCallApi(apiUrl, rqParams);
				resolve(response);
			} catch(e) {
	      reject(e);
    	}
		});
	}

	const doFillSigleDigit = function(x) {
		if (Number(x) < 10) {
			return '0' + x;
		} else {
			return '' + x;
		}
	}

	const doDisplayCustomUrgentResult = function(dd, hh, mn, fromDate) {
		let totalShiftTime = (dd * 24 * 60 * 60 * 1000) + (hh * 60 * 60 * 1000) + (mn * 60 * 1000);
		let atDate;
		if (fromDate) {
			atDate = new Date(fromDate);
		} else {
			atDate = new Date();
		}
		let atTime = atDate.getTime() + totalShiftTime;
		atTime = new Date(atTime);
		let YY = atTime.getFullYear();
		let MM = doFillSigleDigit(atTime.getMonth() + 1);
		let DD = doFillSigleDigit(atTime.getDate());
		let HH = doFillSigleDigit(atTime.getHours());
		let MN = doFillSigleDigit(atTime.getMinutes());
		let td = `${YY}-${MM}-${DD} : ${HH}.${MN}`;
		return td;
	}

	const doFormatDateTimeCaseCreated = function(createdAt) {
		let atTime = new Date(createdAt);
		let YY = atTime.getFullYear();
		let MM = doFillSigleDigit(atTime.getMonth() + 1);
		let DD = doFillSigleDigit(atTime.getDate());
		let HH = doFillSigleDigit(atTime.getHours());
		let MN = doFillSigleDigit(atTime.getMinutes());
		let td = `${YY}-${MM}-${DD} : ${HH}.${MN}`;
		return td;
	}

	const formatNumberWithCommas = function(x) {
		if (x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		} else {
			return undefined;
		}
	}

	const doRenderScanpartSelectedBox = function(scanparts) {
		return new Promise(async function(resolve, reject) {
			const doCreateHeaderField = function() {
	      let headerFieldRow = $('<div style="display: table-row;  width: 100%; border: 2px solid black; background-color: blue; color: white;"></div>');
				let fieldCell = $('<div style="display: table-cell; padding: 4px;">ลำดับที่</div>');
	      $(fieldCell).appendTo($(headerFieldRow));
	      fieldCell = $('<div style="display: table-cell; padding: 4px;">รหัส</div>');
	      $(fieldCell).appendTo($(headerFieldRow));
	      fieldCell = $('<div style="display: table-cell; padding: 4px;">ชื่อ</div>');
	      $(fieldCell).appendTo($(headerFieldRow));
	      fieldCell = $('<div style="display: table-cell; padding: 4px;">ราคา</div>');
	      $(fieldCell).appendTo($(headerFieldRow));
	      return $(headerFieldRow);
	    };

			let selectedBox = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');
			let headerFieldRow = doCreateHeaderField();
			$(headerFieldRow).appendTo($(selectedBox));
			await scanparts.forEach((item, i) => {
				let itemRow = $('<div style="display: table-row;  width: 100%; border: 2px solid black; background-color: #ccc;"></div>');
				$(itemRow).appendTo($(selectedBox));
				let itemCell = $('<div style="display: table-cell; padding: 4px;">' + (i+1) + '</div>');
				$(itemCell).appendTo($(itemRow));
				itemCell = $('<div style="display: table-cell; padding: 4px;">' + item.Code + '</div>');
				$(itemCell).appendTo($(itemRow));
				itemCell = $('<div style="display: table-cell; padding: 4px;">' + item.Name + '</div>');
				$(itemCell).appendTo($(itemRow));
				itemCell = $('<div style="display: table-cell; padding: 4px; text-align: right;">' + formatNumberWithCommas(item.Price) + '</div>');
				$(itemCell).appendTo($(itemRow));
			});
			resolve($(selectedBox));
		});
	}

	const getPatientFullNameEN = function (patientId) {
		return new Promise(async function(resolve, reject) {
			let rqParams = {patientId: patientId};
			let apiUrl = '/api/patient/fullname/en/' + patientId;
			try {
				let response = await doCallApi(apiUrl, rqParams);
				resolve(response);
			} catch(e) {
	      reject(e);
    	}
		});
	}

	const doRenderScanpartSelectedAbs = function (scanparts) {
		return new Promise(async function(resolve, reject) {
			let scanPartBox = $('<div></div>');
			let scanpartStyle = {'border': '1px solid blue', 'border-radius': '3px', 'font-size': '20px', 'text-align': 'left', 'padding': '2px'};
			let	promiseList = new Promise(function(resolve2, reject2){
				let joinText = '';
				for (let i=0; i < scanparts.length; i++){
					let item = scanparts[i];
					if (i != (scanparts.length-1)) {
						joinText += item.Name + ' / ';
					} else {
						joinText += item.Name;
					}
				}
				$(scanPartBox).append($('<div>' + joinText + '</div>'));
				$(scanPartBox).css(scanpartStyle);
				setTimeout(()=>{
          resolve2($(scanPartBox));
        }, 100);
      });
			Promise.all([promiseList]).then((ob)=>{
				resolve(ob[0]);
			});
		});
	}

	const doExtractList = function(originList, from, to) {
		return new Promise(async function(resolve, reject) {
			let exResults = [];
			let	promiseList = new Promise(function(resolve2, reject2){
				for (let i = (from-1); i < to; i++) {
					if (originList[i]){
						exResults.push(originList[i]);
					}
				}
				setTimeout(()=>{
          resolve2(exResults);
        }, 100);
			});
			Promise.all([promiseList]).then((ob)=>{
				resolve(ob[0]);
			});
		});
	}

	const doCreateCaseCmd = function(cmd, data, clickCallbak) {
		const cmdIcon = $('<img class="pacs-command" data-toggle="tooltip"/>');
		switch (cmd) {
			case 'view':
			$(cmdIcon).attr('src','/images/pdf-icon.png');
			$(cmdIcon).attr('title', 'Open Result Report.');
			break;

			case 'print':
			$(cmdIcon).attr('src','/images/print-icon.png');
			$(cmdIcon).attr('title', 'Print Result Report.');
			break;

			case 'convert':
			$(cmdIcon).attr('src','/images/convert-icon.png');
			$(cmdIcon).attr('title', 'Convert Result Report to Synapse (PACS).');
			break;

			case 'callzoom':
			$(cmdIcon).attr('src','/images/zoom-black-icon.png');
			$(cmdIcon).attr('title', 'Call Radiologist by zoom App.');
			break;

			case 'upd':
			$(cmdIcon).attr('src','/images/update-icon.png');
			$(cmdIcon).attr('title', 'Update Case data.');
			break;

			case 'delete':
			$(cmdIcon).attr('src','/images/delete-icon.png');
			$(cmdIcon).attr('title', 'Delete Case.');
			break;

			case 'ren':
			$(cmdIcon).attr('src','/images/renew-icon.png');
			$(cmdIcon).attr('title', 'Re-New Case.');
			break;

			case 'cancel':
			$(cmdIcon).attr('src','/images/cancel-icon.png');
			$(cmdIcon).attr('title', 'Cancel Case.');
			break;

			case 'edit':
			$(cmdIcon).attr('src','/images/status-icon.png');
			$(cmdIcon).attr('title', 'Edit Result.');
			break;

			case 'close':
			$(cmdIcon).attr('src','/images/closed-icon.png');
			$(cmdIcon).attr('title', 'Edit Result.');
			break;

		}
		$(cmdIcon).on('click', (evt)=>{
			clickCallbak(data);
		});
		return $(cmdIcon);
	}

  return {
		/* Constant share */
		caseReadWaitStatus,
		caseResultWaitStatus,
		casePositiveStatus,
		caseNegativeStatus,
		caseReadSuccessStatus,
		caseAllStatus,
		allCaseStatus,
		defaultProfile,
		pageLineStyle,
		/* Function share */
		doCallApi,
		doGetApi,
		doOpenStoneWebViewer,
		doDownloadDicom,
    doPreparePatientParams,
    doPrepareCaseParams,
		doGetSeriesList,
		doGetOrthancStudyDicom,
		doGetOrthancSeriesDicom,
		doCallCreatePreviewSeries,
		doCallCreateZipInstance,
		doCallSendAI,
		doConvertAIResult,
		doCallAIResultLog,
		doUpdateCaseStatus,
		doUpdateConsultStatus,
		doCreateNewCustomUrgent,
		doCallSelectUrgentType,
		doUpdateCustomUrgent,
		doLoadScanpartAux,
		doFillSigleDigit,
		doDisplayCustomUrgentResult,
		doFormatDateTimeCaseCreated,
		formatNumberWithCommas,
		getPatientFullNameEN,
		doRenderScanpartSelectedBox,
		doRenderScanpartSelectedAbs,
		doExtractList,
		doCreateCaseCmd
	}
}
