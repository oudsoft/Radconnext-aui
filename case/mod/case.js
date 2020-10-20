/* case.js */
module.exports = function ( jq ) {
	const $ = jq;

	const apiconnector = require('./apiconnect.js')($);
	const util = require('./utilmod.js');
	require('jquery-simple-upload');

	const defualtPacsLimit = '30';
	const defualtPacsStudyDate = 'ALL';

	const caseReadWaitStatus = ['draft',
		'wait_zip',
		'processing',
		'wait_upload',
		'uploading',
		'finish_uploa',
		'wait_consult',
		'wait_dr_consult',
		'consult_expire',
		'wait_consult_ack',
		'wait_response_1',
		'wait_response_2',
		'wait_response_3',
		'wait_response_4',
		'wait_response_5',
		'wait_response_6',
		'wait_dr_key'
	];
	const caseReadSuccessStatus = ['wait_close', 'wait_close2', 'close'];

	/*******************************************************/

	function doCallApi(apiName, rqParams) {
		return new Promise(function(resolve, reject) {
			const body = rqParams;
			var realUrl = apiconnector.hostURL + '/' + apiName + apiconnector.apiExt;
			var params = {method: 'post', body: body, url: realUrl, apiname: apiName};
			/*
			console.log('apiName', apiName);
			console.log('body', body);
			console.log('realUrl', realUrl);
			console.log('params', params);
			*/
			apiconnector.doCallApiByProxy(apiName, params).then((response) => {
				//console.log('response', response);
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
			})
		});
	}


	/*******************************************************/

	let currentTab = undefined;

	function doLoadCasePage(username) {
		//username = username;
		$(".mainfull").load('form/case.html', function(){
			//$("#PACSTab").css("float", "right");
			doEventManagment();
			/*
			doLoadCaseList(username);
			$("#SendWaitTab").trigger("click");
			$("#SendWaitTab").addClass('active');
			*/
			$("#PACSTab").trigger("click");
			$("#PACSTab").addClass('active');
			$('body').loading('stop');
		});
	}

	function doEventManagment() {
		document.addEventListener("PACSDiv", openPACS);
		//document.addEventListener("SendWaitDiv", evtMng);
		document.addEventListener("ReadWaitDiv", openCaseList);
		document.addEventListener("ReadSuccessDiv", openCaseList);
		document.addEventListener("AllCasesDiv", openCaseList);
		document.addEventListener("EditImageCmd", openImageEditor);
	}

	const evtMng = function(e) {
  	let eventCall = {name: e.detail.eventname};
  	console.log(eventCall);
  }

	async function doLoadCaseList(username) {
		const main = require('../main.js');
		let rqParams = { username: main.doGetCookie().username }
		let apiName = 'get_case_list';
		try {
			let response = await doCallApi(apiName, rqParams);
			console.log(response);
		} catch(e) {
	    console.log('Unexpected error occurred =>', e);
    }
	}

	const openPACS = function(e) {
		currentTab = e.detail.eventname;
  	$("#Dicom-Filter").load('form/dicom-filter.html', function(){
  		$("#studydate").val(defualtPacsStudyDate).change();
  		$("#limit").val(defualtPacsLimit).change();
  		$("#search-cmd").on('click', doSearchOrthanc);
	  	/*
	  		ค่าข้อมูลใน query ที่ไม่ใช่สตริง ต้องเขียนแบบนี้เท่านั้น
				"Expand": true
				"Limit": 5
				ถ้าเขียนเป็น
				"Expand": "true"
				"Limit": "5"
				แบบนี้จะผิด และจะเกิด Internal Error ขึ้นที่ orthanc
	  	*/
	  	$("#search-cmd").trigger('click');
	  });
  }

  const openCaseList = async function(e) {
		$('body').loading('start');
		currentTab = e.detail.eventname;
		const main = require('../main.js');
		let rqParams, today;
		let apiName = 'get_case_list';
		if (currentTab === 'AllCasesDiv') {
			today = util.getTodayDevFormat();
			rqParams = { username: main.doGetCookie().username, search_start_date: today };
			today = util.getToday();
			today = util.formatStudyDate(today);
		} else {
			rqParams = { username: main.doGetCookie().username };
		}

		try {
			let response = await doCallApi(apiName, rqParams);
			console.log(response);
			let resBody = JSON.parse(response.res.body);
			if ((resBody.incident) || (resBody.success == true)){
				let rwTable;
				switch(currentTab) {
					case "ReadWaitDiv":
	  				$("#ReadWaitDiv-Content").empty();
						rwTable = await doShowRwCaseList(resBody.incident);
	  				$("#ReadWaitDiv-Content").append($(rwTable));
					break;
					case "ReadSuccessDiv":
	  				$("#ReadSuccessDiv-Content").empty();
						rwTable = await doShowRsCaseList(resBody.incident);
	  				$("#ReadSuccessDiv-Content").append($(rwTable));
					break;
					case "AllCasesDiv":
						$("#AllCasesDiv-Control").empty();
						let dateRange = $('<div style="float: left;"><h3>เคสทั้งหมด ของวันที่ ' + today + '</h3></div>');
						$("#AllCasesDiv-Control").append($(dateRange));
						let dateRangeSearchCmd = $('<div style="margin-top: 25px; left: 15px;"><button class="radcon-button button-bw">เก่ากว่า ...</button></div>');
						$(dateRangeSearchCmd).click(function() {
							doShowCaseCalendar();
						});
						$("#AllCasesDiv-Control").append($(dateRangeSearchCmd));
	  				$("#AllCasesDiv-Content").empty();
						rwTable = await doShowAllCaseList(resBody.incident);
	  				$("#AllCasesDiv-Content").append($(rwTable));
					break;
				}
			} else if (resBody.success == false){
				alert('Your Session on API server had expired.\nPlease Logout and Login back gain.');
			}
  		$('body').loading('stop');
		} catch(e) {
	    console.log('Unexpected error occurred =>', e);
	    $('body').loading('stop');
    }
		$('#CurrentPage').remove();
  }

	async function doCallSearchCasebyDate(startDate) {
		$('body').loading('start');
		const main = require('../main.js');
		let apiName = 'get_case_list';
		let rqParams = { username: main.doGetCookie().username, search_start_date: startDate };
		let fromDate = startDate.split('-');
		fromDate = fromDate.join('');
		fromDate = util.formatStudyDate(fromDate);
		try {
			let response = await doCallApi(apiName, rqParams);
			console.log(response);
			let resBody = JSON.parse(response.res.body);
			if ((resBody.incident) || (resBody.success == true)){
				$("#AllCasesDiv-Control").empty();
				let dateRange = $('<div style="float: left;"><h3>เคสทั้งหมด จากวันที่ ' + fromDate + '</h3></div>');
				$("#AllCasesDiv-Control").append($(dateRange));
				let dateRangeSearchCmd = $('<div style="margin-top: 25px; left: 15px;"><button class="radcon-button button-bw">เก่ากว่า ...</button></div>');
				$(dateRangeSearchCmd).click(function() {
					doShowCaseCalendar();
				});
				$("#AllCasesDiv-Control").append($(dateRangeSearchCmd));
				$("#AllCasesDiv-Content").empty();
				rwTable = await doShowAllCaseList(resBody.incident);
				$("#AllCasesDiv-Content").append($(rwTable));
			} else if (resBody.success == false){
				alert('Your Session on API server had expired.\nPlease Logout and Login back gain.');
			}
  		$('body').loading('stop');
		} catch(e) {
	    console.log('Unexpected error occurred =>', e);
	    $('body').loading('stop');
    }
	}

	function doShowRwCaseList(incidents) {
  	console.log(incidents);
		return new Promise(async function(resolve, reject) {
			if ((incidents) && (incidents.length > 0)) {
				let filterIncidents = incidents.filter((item, ind) => {
					if (caseReadWaitStatus.indexOf(item.status) >= 0) {
						return item;
					}
				});
				console.log(filterIncidents);
				if (filterIncidents.length > 0) {
					let showTable = await doShowCaseList(filterIncidents);
					resolve(showTable);
				} else {
					resolve($('<div>Cases not found.</div>'));
				}
			} else {
				resolve($('<div>Cases not found.</div>'));
			}
		});
  }

  function doShowRsCaseList(incidents) {
		console.log(incidents);
		return new Promise(async function(resolve, reject) {
			if ((incidents) && (incidents.length > 0)) {
				let filterIncidents = incidents.filter((item, ind) => {
					if (caseReadSuccessStatus.indexOf(item.status) >= 0) {
						return item;
					}
				});
				console.log(filterIncidents);
				if (filterIncidents.length > 0) {
					let showTable = await doShowCaseList(filterIncidents);
					resolve(showTable);
				} else {
					resolve($('<div>Cases not found.</div>'));
				}
			} else {
				resolve($('<div>Cases not found.</div>'));
			}
		});
  }

	function doShowAllCaseList(incidents) {
		console.log(incidents);
		return new Promise(async function(resolve, reject) {
			if ((incidents) && (incidents.length > 0)) {
				if (incidents.length > 0) {
					let showTable = await doShowCaseList(incidents);
					resolve(showTable);
				} else {
					resolve($('<div>Cases not found.</div>'));
				}
			} else {
				resolve($('<div>Cases not found.</div>'));
			}
		});
	}

  function doShowCaseList(incidents) {
		//console.log(incidents);
		return new Promise(function(resolve, reject) {
			let rwTable = $('<table width="100%" cellpadding="5" cellspacing="0"></table>');
			let headRow = $('<tr style="background-color: green;"></tr>');
			let headColumns = $('<td width="10%" align="center">วันที่</td><td width="10%" align="center">ชื่อ</td><td width="5%" align="center">อายุ</td><td width="5%" align="center">เพศ</td><td width="10%" align="center">HN</td><td width="5%" align="center">Modality</td><td width="10%" align="center">Study Desc. / Protocol Name</td><td width="10%" align="center">ประเภทความด่วน</td><td width="10%" align="center">แพทย์ผู้ส่ง</td><td width="10%" align="center">รังสีแพทย์</td><td width="10%" align="center">สถานะเคส</td><td width="*" align="center">Control Case</td>');
			$(rwTable).append($(headRow));
			$(headRow).append($(headColumns));
			for (let i=0; i < incidents.length; i++) {
				let dataRow = $('<tr class="case-row"></tr>');
				let casedatetime = incidents[i].create_date.split(' ');
				let casedateSegment = casedatetime[0].split('-');
				casedateSegment = casedateSegment.join('');
				let casedate = util.formatStudyDate(casedateSegment);
				$(dataRow).append($('<td align="center"><div class="tooltip">'+ casedate + '<span class="tooltiptext">' + casedatetime[1] + '</span></div></td>'));
				$(dataRow).append($('<td align="center">'+ incidents[i].patient + '</td>'));
				$(dataRow).append($('<td align="center">'+ incidents[i].age + '</td>'));
				$(dataRow).append($('<td align="center">'+ incidents[i].gender + '</td>'));
				$(dataRow).append($('<td align="center">'+ incidents[i].hn + '</td>'));
				$(dataRow).append($('<td align="center">' + incidents[i].dicom_folder2 + '</td>'));
				$(dataRow).append($('<td align="center">'+ incidents[i].scan_type + '</td>'));
				$(dataRow).append($('<td align="center">'+ incidents[i].urgent + '</td>'));
				$(dataRow).append($('<td align="center">'+ incidents[i].primary_dr + '</td>'));
				if (incidents[i].response_dr.indexOf('/') >= 0) {
					let response_dr = incidents[i].response_dr.split('/');
					$(dataRow).append($('<td align="center">'+ response_dr[1] + '</td>'));
				} else {
					$(dataRow).append($('<td align="center">'+ incidents[i].response_dr + '</td>'));
				}
				$(dataRow).append($('<td align="center">'+ incidents[i].status_name + '</td>'));
				let commandCol = $('<td align="center"></td>');
				$(commandCol).appendTo($(dataRow));
				$(commandCol).appendTo($(dataRow));
				$(rwTable).append($(dataRow));

				let operationCmdButton = $('<img class="pacs-command" data-toggle="tooltip" src="images/operation-icon.png" title="Your command case processing."/>');
				$(operationCmdButton).click(function() {
					$('.operation-row').each((index, child) => {
						if ($(child).css('display') !== 'none') {
							$(child).slideUp();
						}
					});
					let operationVisible = $('#' + incidents[i].id).css('display');
					if (operationVisible === 'none') {
						$('#' + incidents[i].id).slideDown();
					} else {
						$('#' + incidents[i].id).slideUp();
					}
				});
				$(operationCmdButton).appendTo($(commandCol));

				let commnandRow = $('<tr></tr>');
				$(commnandRow).appendTo($(rwTable));
				let operationCol = $('<td id="' + incidents[i].id + '"colspan="12" align="right" style="background-color: #828080; display: none;" class="operation-row"></td>');
				$(operationCol).appendTo($(commnandRow));

				let operationCmdBox = $('<div></div>');
				$(operationCmdBox).appendTo($(operationCol));
				/*
				let historyButton = $('<img class="pacs-command" data-toggle="tooltip" src="images/history-icon.png" title="Open Patient History."/>');
				$(historyButton).click(function() {
					doShowPopupHistory(incidents[i].pn_history);
				});
				$(historyButton).appendTo($(operationCmdBox));
				*/
				let downlodDicomButton = $('<img class="pacs-command" data-toggle="tooltip" src="images/zip-icon.png" title="Download Dicom in zip file."/>');
				$(downlodDicomButton).click(function() {
					let patientNameEN = incidents[i].patient.split(' ');
					patientNameEN = patientNameEN.join('_');
					let savefile = patientNameEN + '-' + casedateSegment + '.zip';
					doDownloadDicom(incidents[i].dicom_folder1, savefile);
				});
				$(downlodDicomButton).appendTo($(operationCmdBox));

				let editCaseButton = $('<img class="pacs-command" data-toggle="tooltip" src="images/edit-icon.png" title="Edit Case Detail."/>');
				$(editCaseButton).click(function() {
					doCallEditCase(incidents[i].id);
				});
				$(editCaseButton).appendTo($(operationCmdBox));

				let changeCaseStatusButton = $('<img class="pacs-command" data-toggle="tooltip" src="images/status-icon.png" title="Change Case\'s Status."/>');
				$(changeCaseStatusButton).click(function() {
					doShowPopupChangeCaseStatus(incidents[i].id, incidents[i].status);
				});
				$(changeCaseStatusButton).appendTo($(operationCmdBox));


				if (caseReadSuccessStatus.indexOf(incidents[i].status) >= 0) {
					let printResultButton = $('<img class="pacs-command" data-toggle="tooltip" src="images/print-icon.png" title="Print Read Result."/>');
					$(printResultButton).click(function() {
						let patientNameEN = incidents[i].dicom_zip2.split(' ');
						patientNameEN = patientNameEN.join('_');
						doShowPopupReadResult(incidents[i].re_url, patientNameEN, casedateSegment);
					});
					$(printResultButton).appendTo($(operationCmdBox));

					let convertResultButton = $('<img class="pacs-command-dd" data-toggle="tooltip" src="images/convert-icon.png" title="Convert Result to Dicom."/>');
					$(convertResultButton).click(function() {
						const main = require('../main.js');
						doConvertResultToDicom(incidents[i].re_url, incidents[i].dicom_folder1, incidents[i].dicom_folder2, main.doGetCookie().username);
					});
					$(convertResultButton).appendTo($(operationCmdBox));
				}

				let deleteCaseButton = $('<img class="pacs-command" data-toggle="tooltip" src="images/delete-icon.png" title="Delete Case."/>');
				$(deleteCaseButton).click(function() {
					doCallDeleteCase(incidents[i].id);
				});
				$(deleteCaseButton).appendTo($(operationCmdBox));

			}
			resolve($(rwTable));
		});
  }

  function doShowPopupHistory(allUrl){
  	$('#HistoryDialogBox').empty();
  	let files = allUrl.split(',');
  	files.forEach((file) => {
  		if (file !== '') {
	  		let hsBox = $('<div></div>');
	  		$(hsBox).css('padding','3px');
	  		//$(hsBox).css('border','1px solid red');
	  		$(hsBox).css('width','100px');
	  		$(hsBox).css('height', 'auto');
				$(hsBox).css('float', 'left');
	  		let hsImg = $('<img/>');
	  		$(hsImg).css('width','94px');
	  		$(hsImg).css('height', 'auto');
	  		$(hsImg).css('cursor', 'pointer');
				let imgLink = 'https://radconnext.com/radconnext/inc_files/' + file;
	  		$(hsImg).attr('src', imgLink);
	  		$(hsImg).click(()=>{
	  			window.open(imgLink, '_blank');
	  		})
	  		$(hsImg).appendTo($(hsBox));
	  		$('#HistoryDialogBox').append($(hsBox));
	  	}
  	});
		let cmdBox = $('<div></div>');
 		$(cmdBox).css('width','100%');
		$(cmdBox).css('padding','3px');
		$(cmdBox).css('clear','left');
 		$(cmdBox).css('text-align','center');
  	let closeCmdBtn = $('<button>ปิด</button>');
  	$(closeCmdBtn).click(()=>{
  		$('#HistoryDialogBox').dialog('close');
  	});
  	$(closeCmdBtn).appendTo($(cmdBox));
  	$('#HistoryDialogBox').append($(cmdBox));
  	$('#HistoryDialogBox').dialog('option', 'title', 'ประวัติผู้ป่วย');
  	$('#HistoryDialogBox').dialog('open');
  }

  async function doCallEditCase(caseid) {
  	$('body').loading('start');
  	const main = require('../main.js');
		let rqParams = { username: main.doGetCookie().username, id: caseid }
		let apiName = 'get_case_info';
		try {
			let response = await doCallApi(apiName, rqParams);
  		let resBody = JSON.parse(response.res.body);
  		let patient = {id: resBody.inc_data.hn, name: resBody.inc_data.dicom_zip2, name_th: resBody.inc_data.patient, age: resBody.inc_data.age, sex: resBody.inc_data.gender};
			let defualtValue = {id: resBody.inc_data.id, patient: patient, bodypart: resBody.inc_data.inc_scan_type, studyID: resBody.inc_data.dicom_folder1, acc: resBody.inc_data.accession, mdl: resBody.inc_data.dicom_folder2};
			defualtValue.pn_history = resBody.inc_data.pn_history;
			defualtValue.status = resBody.inc_data.status;
			defualtValue.urgent = resBody.inc_data.urgent_id;
			defualtValue.rights = resBody.inc_data.rights_id;
			defualtValue.primary_dr = resBody.inc_data.primary_dr;
			defualtValue.dr_id = resBody.inc_data.dr_id;
			defualtValue.detail = resBody.inc_data.detail;
			defualtValue.dept = resBody.inc_data.dept;
			defualtValue.inc_price = resBody.inc_data.inc_price;
			defualtValue.dicom_zip1 = resBody.inc_data.dicom_zip1;
  		doOpenEditCase(defualtValue);
  		$('body').loading('stop');
		} catch(e) {
	    console.log('Unexpected error occurred =>', e);
	    $('body').loading('stop');
    }
  }

  const doGetOrthancQueryFromFilter = function(limitControl) {
  	let modality = $('#modality').val();
  	let keyName = $('#Filter-Key-1').val();
  	let keyValue = $('#Filter-Value-1').val();
  	let studydate = $('#studydate').val();
  	let limit = $('#limit').val();
  	//console.log({modality, keyName, keyValue, studydate, limit});
  	//let queryStr = '{"Level": "Series", "Expand": true, "Query": {';
  	let queryStr = '{"Level": "Study", "Expand": true, "Query": {';
  	if (modality === 'ALL') {
  		queryStr += '"Modality": "*"';
  	} else {
  		queryStr += '"Modality": "' + modality + '"';
  	}
  	if (keyName !== 'ALL') {
  		queryStr += ', "' + keyName + '": "' + keyValue + '"';
  	}
  	if (studydate !== 'ALL') {
			if (studydate === 'TODAY') {
				//queryStr += ', "StudyDate": "' + '-' + util.getToday() + '"';
				queryStr += ', "StudyDate": "' + util.getToday() + '-"';
			} else if (studydate === 'YESTERDAY') {
				queryStr += ', "StudyDate": "' + util.getYesterday() + '-"';
			} else if (studydate === 'WEEK') {
				queryStr += ', "StudyDate": "' + util.getDateLastWeek() + '-"';
			} else if (studydate === 'MONTH') {
				queryStr += ', "StudyDate": "' + util.getDateLastMonth() + '-"';
			} else if (studydate === '3MONTH') {
				queryStr += ', "StudyDate": "' + util.getDateLast3Month() + '-"';
			} else if (studydate === 'YEAR') {
				queryStr += ', "StudyDate": "' + util.getDateLastYear() + '-"';
			} else {
				queryStr = queryStr;
			}
  	}

  	queryStr += '}';

  	if (limitControl) {
			if (limit !== 'ALL') {
				queryStr += ', "Limit": ' + limit + '}';
			} else {
				queryStr += '}';
			}
		} else {
			queryStr += '}';
		}

		return queryStr;
  }

  const doCallSearhOrthanc = function(query) {
  	return new Promise(function(resolve, reject) {
			const main = require('../main.js');
	  	let orthancUri = '/tools/find';
	  	let params = {method: 'post', uri: orthancUri, body: query, username: main.doGetCookie().username};
	  	apiconnector.doCallOrthancApiByProxy(params).then((response) =>{
	  		//console.log(response);
	  		var promiseList = new Promise(function(resolve, reject){
		  		response.forEach((study) => {
		  			let queryStr = '{"Level": "Series", "Expand": true, "Query": {"PatientName":"' + study.PatientMainDicomTags.PatientName + '"}}';
		  			params = {method: 'post', uri: orthancUri, body: queryStr, username: main.doGetCookie().username};
		  			apiconnector.doCallOrthancApiByProxy(params).then(async (seriesList) =>{
		  				//console.log(seriesList);
		  				let samplingSrs = await seriesList.find((srs) => {
		  					return (srs.MainDicomTags.SeriesDate) || (srs.MainDicomTags.SeriesDescription);
		  				})
		  				if (samplingSrs) {
		  					study.SamplingSeries = samplingSrs;
		  				} else {
		  					study.SamplingSeries = seriesList[0];
		  				}
		  			});
		  		});
		  		setTimeout(()=> {
						resolve(response);
					}, 1200);
	  		});
				Promise.all([promiseList]).then((ob)=>{
					console.log('Final JSON =>', ob[0]);
					resolve(ob[0]);
				}).catch((err)=>{
					reject(err);
				});
			});
  	});
  }

  const doSearchOrthanc = function() {
  	let queryStr;
  	let limit = $('#limit').val();
  	let orthancViewPage = $('#CurrentPage').val();
  	if (limit !== 'ALL') {
  		if (orthancViewPage === undefined){
  			queryStr = doGetOrthancQueryFromFilter(true);
  		} else if (orthancViewPage === 'first') {
  			queryStr = doGetOrthancQueryFromFilter(false);
  		} else {
  			queryStr = doGetOrthancQueryFromFilter(true);
  		}
  	} else {
  		queryStr = doGetOrthancQueryFromFilter(false);
  	}
		console.log(queryStr);
		$("#Dicom-Result").empty();
		$('body').loading('start');
  	doCallSearhOrthanc(queryStr).then(async (studies) => {
  		let resultTable;

			if (limit === 'ALL') {
  			resultTable = await doShowOrthancResult(studies, 0);
  			$("#Dicom-Result").append($(resultTable));
				$('body').loading('stop');
  		} else {
  			let pageControlBox = $('<div style="width: 100%; text-align: right; padding: 10px;"></div>');
				//console.log(orthancViewPage);
  			if ((orthancViewPage === undefined) || (orthancViewPage === 'last')) {
	  			resultTable = await doShowOrthancResult(studies, 0);
  				$("#Dicom-Result").append($(resultTable));
  				let nextPageCmd = $('<button>Next</button>');
  				$(nextPageCmd).click(()=>{
						doSearchOrthanc();
  				});
  				$(nextPageCmd).appendTo($(pageControlBox));
  				let currentPageHidden = $('<input type="hidden" id="CurrentPage" value="first"/>');
  				$(currentPageHidden).appendTo($(pageControlBox));
  				$("#Dicom-Result").append($(pageControlBox));
  				$('body').loading('stop');
  			} else if (orthancViewPage === 'first') {
  				let filterStudies = await studies.filter((item, ind) => {
  					if (ind >= Number(limit)) {
  						return item;
  					}
  				});
  				resultTable = await doShowOrthancResult(filterStudies, Number(limit));
	  			$("#Dicom-Result").append($(resultTable));

  				let previousPageCmd = $('<button>Previous</button>');
  				$(previousPageCmd).click(()=>{
  					doSearchOrthanc();
  				});
  				$(previousPageCmd).appendTo($(pageControlBox));
  				let currentPageHidden = $('<input type="hidden" id="CurrentPage" value="last"/>');
  				$(currentPageHidden).appendTo($(pageControlBox));
  				$("#Dicom-Result").append($(pageControlBox));
  				$('body').loading('stop');
				}
  		}
  	}).catch((err) => {
  		console.log(err);
  		$('body').loading('stop');
  	});
  }

  function doShowOrthancResult(dj, startRef){
		return new Promise(async function(resolve, reject) {
			/* sort dj by studydatetime */
			await dj.sort((a,b) => {
				let av = util.getDatetimeValue(a.MainDicomTags.StudyDate, a.MainDicomTags.StudyTime);
				let bv = util.getDatetimeValue(b.MainDicomTags.StudyDate, b.MainDicomTags.StudyTime);
				if (av && bv) {
					return bv - av;
				} else {
					return 0;
				}
			});
			/* ================== */
			let rsTable = $('<table width="100%" cellpadding="5" cellspacing="0"></table>');
			let headRow = $('<tr style="background-color: green;"></tr>');
			let headColumns = $('<td width="5%" align="center">No.</td><td width="15%" align="left">Study Date</td><td width="10%" align="left">HN</td><td width="15%" align="left">Name</td><td width="5%" align="left">Sex/Age</td><td width="5%" align="left">Modality</td><td width="20%" align="left">Study Desc. / Protocol Name</td><td width="*" align="center">Operation</td>');
			$(rsTable).append($(headRow));
			$(headRow).append($(headColumns));
			for (let i=0; i < dj.length; i++) {
				const spacingBox = $('<span>&nbsp;</span>');
				let desc, protoname, mld, sa, studydate, bdp;
				if ((dj[i].MainDicomTags) && (dj[i].SamplingSeries)){
					if (dj[i].MainDicomTags.StudyDescription) {
						desc = '<div class="study-desc">' + dj[i].MainDicomTags.StudyDescription + '</div>';
						bdp = dj[i].MainDicomTags.StudyDescription;
					} else {
						if (dj[i].SamplingSeries.MainDicomTags.ProtocolName) {
							bdp = dj[i].SamplingSeries.MainDicomTags.ProtocolName;
						} else {
							bdp = '';
						}
						desc = '';
					}
					if (dj[i].SamplingSeries.MainDicomTags.ProtocolName) {
						protoname = '<div class="protoname">' + dj[i].SamplingSeries.MainDicomTags.ProtocolName + '</div>';
					} else {
						protoname = '';
					}
					if (dj[i].SamplingSeries.MainDicomTags.Modality) {
						mld = dj[i].SamplingSeries.MainDicomTags.Modality;
					} else {
						mld = '';
					}
					if (dj[i].MainDicomTags.StudyDate) {
						studydate = dj[i].MainDicomTags.StudyDate;
						studydate = util.formatStudyDate(studydate);
					} else {
						studydate = '';
					}
					if (dj[i].PatientMainDicomTags.PatientSex) {
						sa = dj[i].PatientMainDicomTags.PatientSex;
					} else {
						sa = '-';
					}
					if (dj[i].PatientMainDicomTags.PatientBirthDate) {
						sa = sa + '/' + util.getAge(dj[i].PatientMainDicomTags.PatientBirthDate)
					} else {
						sa = sa + '/-';
					}

					let dataRow = $('<tr class="case-row"></tr>');
					let dataColText = '';
					dataColText += '<td align="center">'+ (i + 1 + startRef) + '</td>'
					dataColText += '<td align="left">' + '<div style="float: left;">' + studydate + '</div><div style="background-color: gray; color: white; text-align: center; float: left; margin: -6px 10px; padding: 5px; border-radius: 5px;">' + util.formatStudyTime(dj[i].MainDicomTags.StudyTime) + '</div></td>'
					dataColText += '<td align="left">' + dj[i].PatientMainDicomTags.PatientID + '</td>'
					dataColText += '<td align="left">' + dj[i].PatientMainDicomTags.PatientName + '</td>'
					dataColText += '<td align="left">' + sa + '</td>'
					dataColText += '<td align="left">' + mld + '</td>';
					dataColText += '<td align="left">' + desc +  protoname + '</td>'
					let dataCol = $(dataColText);
					$(dataRow).append($(dataCol));

					operatingCol = $('<td align="center"></td>');
					$(dataRow).append($(operatingCol));
					let previewCmd = $('<img class="pacs-command-dd" data-toggle="tooltip" src="images/preview-icon.png" title="เปิดดูรูปด้วย Web Viewer"/>');
					//let instancePreview = dj[i].SamplingSeries.Instances[0];
					$(previewCmd).on('click', function(evt){
						//doOpenPreview(instancePreview, dj[i].Series[0]);
						doOpenStoneWebViewer(dj[i].MainDicomTags.StudyInstanceUID);
					});
					$(operatingCol).append($(previewCmd));

					let patientProps = sa.split('/');
					let defualtValue = {patient: {id: dj[i].PatientMainDicomTags.PatientID, name: dj[i].PatientMainDicomTags.PatientName, age: patientProps[1], sex: patientProps[0]}, bodypart: bdp, studyID: dj[i].ID, acc: dj[i].MainDicomTags.AccessionNumber, mdl: mld};
					let creatwNewCaseCmd = $('<img class="pacs-command-dd" data-toggle="tooltip" src="images/doctor-icon.png" title="ส่งรังสีแพทย์เพื่ออ่านผล"/>');
					$(creatwNewCaseCmd).on('click', function(evt){
						doOpenCreateNewCase(defualtValue, dj[i].Series);
					});

					$(operatingCol).append($(spacingBox));
					$(operatingCol).append($(creatwNewCaseCmd));

					let downloadDicomCmd = $('<img class="pacs-command" data-toggle="tooltip" src="images/zip-icon.png" title="ดาวน์โหลด zip ไฟล์"/>');
					$(downloadDicomCmd).on('click', function(evt){
						let dicomFilename = dj[i].PatientMainDicomTags.PatientName.split(' ');
						dicomFilename = dicomFilename.join('_');
						dicomFilename = dicomFilename + '-' + dj[i].MainDicomTags.StudyDate + '.zip';
						doDownloadDicom(dj[i].ID, dicomFilename);
					});

					$(operatingCol).append($(spacingBox));
					$(operatingCol).append($(downloadDicomCmd));

					let deleteDicomCmd = $('<img class="pacs-command" data-toggle="tooltip" src="images/delete-icon.png" title="ลบรายการนี้"/>');
					$(deleteDicomCmd).on('click', function(evt){
						doDeleteDicom(dj[i].ID);
					});

					$(operatingCol).append($(spacingBox));
					$(operatingCol).append($(deleteDicomCmd));

					$(rsTable).append($(dataRow));
				}
			}
			resolve($(rsTable));
		});
  }

  function doOpenPreview(instanceID, seriesID){
		const main = require('../main.js');
		const username = main.doGetCookie().username;
  	apiconnector.doCallDicomPreview(instanceID, username).then((response) => {
  		let openLink = response.preview.link;
  		window.open(openLink, '_blank');
  	})
  }

	function doOpenStoneWebViewer(StudyInstanceUID) {
		//const orthancWebviewerUrl = 'http://' + window.location.hostname + ':8042/web-viewer/app/viewer.html?series=';
		apiconnector.doGetOrthancPort().then((response) => {
			const orthancStoneWebviewer = 'http://'+ window.location.hostname + ':' + response.port + '/stone-webviewer/index.html?study=';
			let orthancwebapplink = orthancStoneWebviewer + StudyInstanceUID;
			window.open(orthancwebapplink, '_blank');
		});
	}

  function doDownloadDicom(studyID, dicomFilename){
		$('body').loading('start');
		const main = require('../main.js');
		const username = main.doGetCookie().username;
  	apiconnector.doCallDownloadDicom(studyID, username).then((response) => {
  		console.log(response);
  		//let openLink = response.archive.link;
  		//window.open(openLink, '_blank');
			var pom = document.createElement('a');
			pom.setAttribute('href', response.archive.link);
			pom.setAttribute('download', dicomFilename);
			pom.click();
			$('body').loading('stop');
  	})
  }

	function doShowPopupReadResult(re_url, patient, casedate) {
		//window.open(re_url, '_blank');
		$('body').loading('start');
		apiconnector.doDownloadResult(re_url, patient, casedate).then((pdfurl) => {
			console.log(pdfurl);
			var pom = document.createElement('a');
			pom.setAttribute('href', pdfurl.pdf.link);
			pom.setAttribute('download', pdfurl.pdf.filename);
			pom.click();
			$('body').loading('stop');
		});
	}

	function doConvertResultToDicom(reportUrl, studyID, modality, username) {
		if (reportUrl) {
			$('body').loading('start');
			apiconnector.doConvertPageToPdf(reportUrl).then((convRes) => {
				apiconnector.doConvertPdfToDicom(convRes.pdf.filename, studyID, modality, username).then((dicomRes) => {
					console.log(dicomRes);
					if (dicomRes.status.code == 200) {
						//alert('แปลงผลอ่านเข้า dicom ชองผู้ป่วยเรียบร้อย\nโปรดตรวจสอบได้จาก Local File.');
						// ตรงนี้จะมี websocket trigger มาจาก server / pdfconverto.js
						$('body').loading('stop');
					}
				}).catch((err) => {
					alert('ERROR: \n' +JSON.stringify(err));
					$('body').loading('stop');
				});
			}).catch((err) => {
				alert('ERROR: \n' +JSON.stringify(err));
				$('body').loading('stop');
			});
		} else {
			alert('ระบบยังไม่พบลิงค์ผลอ่านจากหมอ');
		}
	}

  function doOpenCreateNewCase(defualtValue, seriesList) {
  	$('body').loading('start');
		$("#dialog").load('form/newcase-dialog.html', async function(){
			const main = require('../main.js');

		  let magicBox = document.getElementById('magic-box');
		  let imagesBox = document.getElementById('images');
		  //let scanUploadForm = document.getElementById('ScanUploadForm');

			await doPrepareOptionForm(defualtValue);

			let dicomImgCount = 0;
			let seriesParam = {method: 'get', username: main.doGetCookie().username};
			var promiseList = new Promise(function(resolve, reject){
				seriesList.forEach((srs) => {
					seriesParam.uri = '/series/' + srs;
					apiconnector.doCallOrthancApiByProxy(seriesParam).then((sr) =>{
						dicomImgCount += Number(sr.Instances.length);
					});
				});
				setTimeout(()=> {
					resolve(dicomImgCount);
				},1200);
			});
			Promise.all([promiseList]).then((ob)=>{
				$('#MainTableForm').append($('<tr><td class="input-label">Dicom Summary</td><td colspan="3">' + seriesList.length + ' Series / ' + ob[0] + ' images</td></tr>'));
				$("#upload-scan-cmd").click(function(){
					doUploadSacanedImage();
				});

				$("#SaveNewCase-Cmd").click(function(){
					doSaveNewCase();
				});

				$('body').loading('stop');
			});
		});
  }

  function doDeleteDicom(studyID) {
  	let userConfirm = confirm('โปรดยืนยันเพื่อลบรายการนี้ โดยคลิกปุ่ม ตกลง หรือ OK');
  	if (userConfirm == true){
  		$('body').loading('start');
			const main = require('../main.js');
			const username = main.doGetCookie().username;
			apiconnector.doCallDeleteDicom(studyID, username).then((response) => {
				console.log(response);
				if (response.status.code == 200) {
					$('#CurrentPage').remove();
					alert('เดำเนินการลบข้อมูลเรียบร้อยแล้ว');
					doSearchOrthanc();
					$('body').loading('stop');
				} else {
					alert('เกิดความผิดพลาด ไม่สามารถลบรายการนี้ได้ในขณะนี้')
					$('body').loading('stop');
				}
			}).catch((err) => {
				console.log('Error on Delete dicom from orthanc', err);
				alert('เกิดความผิดพลาด ไม่สามารถลบรายการนี้ได้ในขณะนี้')
				$('body').loading('stop');
			})
		}
  }

  function doOpenEditCase(defualtValue) {
		$("#dialog").load('form/newcase-dialog.html', async function(){
			$('#dialog-title').text('แก้ไขเคส');
			const main = require('../main.js');

			await doPrepareOptionForm(defualtValue);

  		//console.log(defualtValue);

			if (defualtValue.pn_history) {
				doAddHistory(defualtValue.pn_history);
				doRenderHistoryPreview();
			}

			$("#patient-sex").val(defualtValue.patient.sex);
			$("#patient-age").val(defualtValue.patient.age);
			$("#patient-rights").val(defualtValue.rights);
			$("#price").val(defualtValue.inc_price);
			$("#hn").val(defualtValue.patient.id);
			$("#acc").val(defualtValue.acc);

			$("#department").val(defualtValue.dept);
			$("#dr-owner").val(defualtValue.primary_dr);
			$("#bodypart").val(defualtValue.bodypart);
			$("#urgent-type").val(defualtValue.urgent);

			$("#dr-reader").val(defualtValue.dr_id);

			$("#detail").val(defualtValue.detail);
			$("#caseID").val(defualtValue.id);
			let ziplink = 'https://radconnext.com/radconnext/inc_files/' + defualtValue.dicom_zip1;
			$('#MainTableForm').append($('<tr><td class="input-label">Dicom Zip File</td><td colspan="3"><a href="' + ziplink + '" target="_blank"><img class="pacs-command" data-toggle="tooltip" src="images/zip-icon.png" title="Download Dicom in zip file."/></a></td></tr>'));
			$("#SaveNewCase-Cmd").val("บันทึก");

			$("#upload-scan-cmd").click(function(){
				doUploadSacanedImage();
			});

			$("#SaveNewCase-Cmd").click(function(){
				doSaveEditCase(defualtValue.id);
			});
		});
  }

  function doOpenSelectFile(){
		let fileBrowser = $('<input type="file"/>');
		$(fileBrowser).attr("id", 'fileupload');
		$(fileBrowser).attr("name", 'patienthistory');
		$(fileBrowser).attr("multiple", true);
		$(fileBrowser).css('display', 'none');
		$(fileBrowser).on('change', function(e) {
			const defSize = 10000000;
			var fileSize = e.currentTarget.files[0].size;
			var fileType = e.currentTarget.files[0].type;
			if (fileSize <= defSize) {
				$('#magic-box').empty();
				$('#magic-box').show();
				var uploadUrl = apiconnector.proxyRootUri + "/uploadpatienthistory";
				$('#fileupload').simpleUpload(uploadUrl, {
					start: function(file){
						$('#magic-box').html('<div>' + file.type +' : ' + file.name + ' : ' + file.size + '</div>');
					},
					progress: function(progress){
						console.log("ดำเนินการได้ : " + Math.round(progress) + "%");
						$('#magic-box').html('<div>' + 'ดำเนินการได้ : ' + Math.round(progress) + '%' + '</div>');
					},
					success: function(data){
						console.log('Uploaded.', data);
						var imageUrl = data.link;
						var imageUrlArgs = imageUrl.split('/');
						var imageFileName =  imageUrlArgs[(imageUrlArgs.length - 1)];
						$('#magic-box').show();
						$('#magic-box').html('<div>อัพโหลดสำเร็จ</div>');
						setTimeout(() => {
							apiconnector.doCallTransferHistory(imageFileName).then((transferRef) => {
								$('#magic-box').html('');
								$('#magic-box').hide();
								//doAddHistory(transferRef.cloud.link);
								doAddHistory(imageFileName);
								doRenderHistoryPreview();
								$(fileBrowser).remove();
								$("#sub-dialog").empty();
							});
						}, 1200);
					},
					error: function(error){
						$('#magic-box').html('<div>' + "Failure! " + error.name + ": " + error.message + '</div>');
						$("#sub-dialog").empty();
					}
				});

			} else {
				alert('File not excess ' + defSize + ' Byte.');
			}
		});
		$(fileBrowser).appendTo($("#sub-dialog"));
		$(fileBrowser).click();
  }

  function doAddHistory(newHs){
  	let allHs = $('#patient-history').val();
  	allHs = allHs + ',' + newHs;
  	$('#patient-history').val(allHs);
  }

  function doRemoveHistory(index){
		if (index > -1) {
	  	let allHs = $('#patient-history').val();
	  	let hss = allHs.split(',');
  		hss.splice(index, 1);
  		allHs = hss.join(',');
  		$('#patient-history').val(allHs);
	  } else {
	  	console.log('index out of bound.')
	  }
  }

  function doAppendNewHistoryImage(imgBox, imgFileName, ind) {
		const imgURL = 'https://radconnext.com/radconnext/inc_files/' + imgFileName;
		let imgDiv = document.createElement('div');
		imgDiv.style.float = 'left';
		let removeLink = document.createElement('a');
		removeLink.classList.add('remove');
		removeLink.addEventListener("click", function(e){
			doRemoveHsImage(ind);
		});
		imgDiv.appendChild(removeLink);
		let hsImage = document.createElement('img');
		hsImage.style.width = '100px';
		hsImage.style.height = 'auto';
		hsImage.style.border = '1px solid red';
		hsImage.style.cursor = 'pointer';
		hsImage.src = imgURL;
		hsImage.addEventListener("click", function(e){
			window.open(imgURL, '_blank');
		});
		imgDiv.appendChild(hsImage);
		imgBox.appendChild(imgDiv);
		imgBox.style.display = 'block';
  }

  function doRenderHistoryPreview() {
		let imagesBox = document.getElementById('images');
		imagesBox.innerHTML = '';
  	let allHs = $('#patient-history').val();
  	let hss = allHs.split(',');
  	console.log(hss);
		hss.forEach((url, ind) => {
			if (url !== '') {
				doAppendNewHistoryImage(imagesBox, url, ind);
			}
		});
  }

  function doRemoveHsImage(index){
  	doRemoveHistory(index);
  	doRenderHistoryPreview();
  }

  function doOpenScaner(){
		//let scanerPluginUrl = "https://asprise.azureedge.net/scannerjs/scanner.js";
		let scanerPluginUrl = "scanner/driver/scanner.js";
		$.cachedScript( scanerPluginUrl ).done(function( script, textStatus ) {
		  console.log( textStatus );
      scanner.scan(displayImagesOnPage, {
					"use_asprise_dialog": false,
          "output_settings": [
            {
              "type": "return-base64",
              "format": "jpg"
            }
          ]
        }
      );
		});
  }

  function doUploadSacanedImage() {
  	let imageData = imagesScanned[imagesScanned.length - 1].src;
  	let params = {image: imageData};
    let uploadImageUrl = apiconnector.proxyRootUri + "/scannerupload";
		$.post(uploadImageUrl, params, function(data){
			var imageUrl = data.link;
			var imageUrlArgs = imageUrl.split('/');
			var imageFileName =  imageUrlArgs[(imageUrlArgs.length - 1)];
			apiconnector.doCallTransferHistory(imageFileName).then((transferRef) => {
				//doAddHistory(transferRef.cloud.link);
				doAddHistory(imageFileName);
				doRenderHistoryPreview();
			});
		}).fail(function(error) {
			console.log(error);
			alert('Error:' + error);
		});
  }

  function doOpenScreenCapture() {
  	$('#CaptureCanvasDiv').append($('<canvas id="CaptureCanvas" width="100%"" height="auto"/>'));
		let canvas = document.getElementById('CaptureCanvas');
		let video = document.getElementById('CaptureVideo');
		let ctx =  canvas.getContext('2d');
		let vw, vh;
		$('#myModal').hide();
		util.invokeGetDisplayMedia(function(screen) {
			util.addStreamStopListener(screen, function() {
				console.log('Stop Stream.');
			});
			video.addEventListener( "loadedmetadata", function (e) {
				console.log(this.videoWidth, this.videoHeight);
				vw = this.videoWidth;
				vh = this.videoHeight;
				video.width = vw;
				video,height = vh;

				ctx.canvas.width = vw;
				ctx.canvas.height = vh;
			}, false );

			video.srcObject = screen;
			setTimeout(() => {
				$('#sub-dialog').show();
				$('#SaveEdit-Cmd').hide();

				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				doUploadCaptureImage(canvas);

				setTimeout(() => {
					doClearStream(video);
				}, 500);
			}, 500);
    });
    //util.windowMinimize();
    //window.resizeTo(250, 250);
  }

	function doClearStream(video){
		if (video.srcObject){
			video.srcObject.getTracks().forEach(function(track) {
				track.stop();
			});
			video.srcObject = null;
		}
	}

	function doUploadCaptureImage(canvas){
		var paths = window.location.pathname.split('/');
		var rootname = paths[1];
		var url = "/" + rootname + "/captureupload";
		var dataURL = canvas.toDataURL("image/jpeg", 1.0);
		var base64ImageContent = dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
		var blob = util.base64ToBlob(base64ImageContent, 'image/jpg');
		var formData = new FormData();
		formData.append('picture', blob);

		$.ajax({
			url: url,
			type: "POST",
			cache: false,
			contentType: false,
			processData: false,
			data: formData}).done(function(e){
				//console.log(e);
				let tuiImageEditorCssUrl = "/" + rootname + "/lib/tui-image-editor.min.css";
				$('head').append('<link rel="stylesheet" href="' + tuiImageEditorCssUrl + '" type="text/css" />');
				let tuiColorPickerCssUrl = "/" + rootname + "/lib/tui-color-picker.css";
				$('head').append('<link rel="stylesheet" href="' + tuiColorPickerCssUrl + '" type="text/css" />');

				let event = new CustomEvent("EditImageCmd", { "detail": {boxId: 'CaptureCanvasDiv', link: e.link, width: canvas.width, height: canvas.height}});
				document.dispatchEvent(event);

			}
		);
	}

	const editorOption = {
		includeUI: {
			loadImage: {
				path: 'img/usr/upload/' ,
				name: 'SampleImage'
			},
			menu: [/*'undo', 'redo', 'reset',*/ 'crop', 'rotate', 'draw', 'shape', 'icon', 'text'],
			initMenu: 'text',
			menuBarPosition: 'bottom'
		},
		cssMaxWidth: 700,
		cssMaxHeight: 700,
		selectionStyle: {
			cornerSize: 20,
			rotatingPointOffset: 70
		}
	};

	function openImageEditor(evt) {
		let boxId = evt.detail.boxId;
		let link = evt.detail.link;
		editorOption.includeUI.loadImage.path = link;
		let imageEditor = new ImageEditor(boxId);
		setTimeout(() => {
			$('.tui-image-editor-header').hide();
			var tuiCanvas = imageEditor.editor._graphics.getCanvas();
			$('#CaptureCanvasDiv').css('height', Number(tuiCanvas.height) + 120);
		},500);
		//require('fabric');
		let saveImageClickCount = 0;
		$('#SaveEdit-Cmd').show();
		$('#SaveEdit-Cmd').click(function(){
			console.log(saveImageClickCount);
			if (saveImageClickCount == 0) {
				saveImageClickCount++;
				console.log('Krai Click?');
				var paths = window.location.pathname.split('/');
				var rootname = paths[1];
				var url = "/" + rootname + "/editionupload";
				var tuiCanvas = imageEditor.editor._graphics.getCanvas();

				var dataURL = tuiCanvas.toDataURL("image/jpeg", 1.0);

				var base64ImageContent = dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
				var blob = util.base64ToBlob(base64ImageContent, 'image/jpg');

				var formData = new FormData();
				formData.append('picture', blob);
				$.ajax({
					url: url,
					type: "POST",
					cache: false,
					contentType: false,
					processData: false,
					data: formData}).done(function(response){
						console.log(response);
						let context = tuiCanvas.getContext('2d');
						//context.setTransform(1, 0, 0, 1, 0, 0);
						context.clearRect(0, 0, tuiCanvas.width, tuiCanvas.height);
						//context.restore();

						$('#CaptureCanvasDiv').empty();
						$('#SaveEdit-Cmd').hide();
						doCloseSubModal();
						var imageUrl = response.link;
						var imageUrlArgs = imageUrl.split('/');
						var imageFileName =  imageUrlArgs[(imageUrlArgs.length - 1)];
						apiconnector.doCallTransferHistory(imageFileName).then((transferRef) => {
							//doAddHistory(transferRef.cloud.link);
							doAddHistory(imageFileName);
							doRenderHistoryPreview();
						});
					}
				);
			}
		});
	}

	const ImageEditor = function(boxId) {
		var TuiImageEditor = require('tui-image-editor');
		this.editor = new TuiImageEditor(document.querySelector('#' + boxId), editorOption);
	}

	function doPrepareOptionForm(defualtValue){
		return new Promise(async function(resolve, reject) {
			const main = require('../main.js');
			let rqParams = { username: main.doGetCookie().username }
			let apiName = 'get_new_case_info';
			try {
				let response = await doCallApi(apiName, rqParams);
				let resO = JSON.parse(response.res.body);
				$(".modal-footer").css('text-align', 'center');
				if (defualtValue.patient.name_th) {
					$("#patient-name-th").val(defualtValue.patient.name_th);
				} else {
					$("#patient-name-th").val(defualtValue.patient.name);
				}
				$("#patient-name-en").val(defualtValue.patient.name);
				if (defualtValue.patient.sex === 'M') {
					$("#patient-sex").val('ชาย');
				} else if (defualtValue.patient.sex === 'F') {
					$("#patient-sex").val('หญิง');
				} else {
					$("#patient-sex").val('ชาย');
				}
				$("#patient-age").val(defualtValue.patient.age);
				$("#bodypart").val(defualtValue.bodypart);
				$("#hn").val(defualtValue.patient.id);
				$("#acc").val(defualtValue.acc);
				$("#studyID").val(defualtValue.studyID);
				$("#mdl").val(defualtValue.mdl);
				resO.rights.forEach((item) => {
					$("#patient-rights").append($('<option value="' + item.id + '">' + item.name + '</option>'));
				})
				resO.urgent.forEach((item) => {
					$("#urgent-type").append($('<option value="' + item.ugr_id + '">' + item.ugr_name + '</option>'));
				})
				resO.doctor.forEach((item) => {
					$("#dr-reader").append($('<option value="' + item.dr_id + '">' + item.dr_name + '</option>'));
				})

				$("#OpenFileDialog-Cmd").click(function(){
					doOpenSelectFile();
				});
				$("#OpenScaner-Cmd").click(function(){
					doOpenScaner();
				});
				$("#OpenScreenCapture-Cmd").click(function(){
					doOpenScreenCapture();
				});

				resolve();
			} catch(e) {
	      reject(e);
    	}
		});
	}

  function doPrepareCaseParams(newCaseData, zipFileName) {
		let rqParams = {};
		//rqParams.status = 'wait_start';
		//rqParams.status = 'finish_upload';
		rqParams.username = newCaseData.username/* main.doGetCookie().username*/;
		rqParams.curr_host_id = newCaseData.curr_host_id /*main.doGetCookie().org[0].id*/;
		rqParams.status = newCaseData.status;
		rqParams.dept = newCaseData.department;
		rqParams.urgent = newCaseData.urgentType;
		rqParams.inc_patient = newCaseData.patientNameTH;
		rqParams.hn = newCaseData.hn;
		rqParams.age = newCaseData.patientAge;
		rqParams.gender = newCaseData.patientSex;
		rqParams.accession = newCaseData.acc;
		rqParams.rights_id = newCaseData.patientRights;
		rqParams.primary_dr = newCaseData.drOwner;
		rqParams.dicom_folder1 = newCaseData.studyID;
		rqParams.inc_scan_type = newCaseData.bodyPart;
		rqParams.inc_dr_id1 = newCaseData.drReader;
		rqParams.pn_history = newCaseData.patientHistory;
		rqParams.inc_text = newCaseData.detail;
		rqParams.inc_price = newCaseData.price;
		rqParams.dicom_folder2 = newCaseData.mdl;
		//let dicom_ex = {patientNameEN: newCaseData.patientNameEN/*, mdl: newCaseData.mdl */};
		rqParams.dicom_zip1 = zipFileName;
		rqParams.dicom_zip2 = newCaseData.patientNameEN
		/*JSON.stringify(dicom_ex) */;
		return rqParams;
	}

	async function doSaveNewCase() {
		let newCaseData = doVerifyInputForm();
		if (newCaseData) {
			$('body').loading('start');
			try {
				const main = require('../main.js');
				const username = main.doGetCookie().username;
				let transferRes = await apiconnector.doCallTransferDicom(newCaseData.studyID, username);
				console.log(transferRes);
				if (transferRes.cloud.link) {
					console.log(transferRes.local.link);
					console.log(transferRes.cloud.link);

					const main = require('../main.js');
					newCaseData.username = main.doGetCookie().username;
					newCaseData.curr_host_id = main.doGetCookie().org[0].id;
					newCaseData.status = '';
					let zipFileName = newCaseData.studyID + '.zip';
					let rqParams = doPrepareCaseParams(newCaseData, zipFileName);
					console.log(rqParams);
					let apiName = 'save_new_inc';
					let response = await doCallApi(apiName, rqParams);
					if (response.res.statusCode == 200) {
						let resO = JSON.parse(response.res.body);
						let newCaseIdStr = resO.message;
						newCaseIdStr = newCaseIdStr.slice(newCaseIdStr.indexOf('('));
						newCaseIdStr = newCaseIdStr.slice(1, newCaseIdStr.length - 1);
						var obj = /[0-9]*$/.exec(newCaseIdStr);
						let newCaseId = obj[0];
						console.log(newCaseId);
						let newStatus = 'finish_upload';
						doUpdateCaseStatus(newCaseId, newStatus).then((updateRes) => {
							console.log(updateRes);
							alert('บันทึกเคสใหม่เข้าสู่ระบบเรียบร้อยแล้ว');
							doCloseNewCaseBox();
							$("#SendWaitTab").trigger("click");
							$("#SendWaitTab").addClass('active');
							$('body').loading('stop');
						});
					} else if (response.res.statusCode == 500) {
						alert('API Server ขัดข้อง');
						$('body').loading('stop');
					}
				}else {
					alert('Transfer Dicom File ขัดข้อง');
					$('body').loading('stop');
				}
			} catch(e) {
        console.log('Unexpected error occurred =>', e);
        $('body').loading('stop');
    	}
		}
	}

	async function doSaveEditCase(caseid){
		let newCaseData = doVerifyInputForm();
		if (newCaseData) {
			$('body').loading('start');
			const main = require('../main.js');
			newCaseData.username = main.doGetCookie().username;
			newCaseData.status = 'finish_upload';
			let rqParams = doPrepareCaseParams(newCaseData, '');
			rqParams.id = caseid;
			rqParams.patient = rqParams.inc_patient;
			delete rqParams.inc_patient;
			delete rqParams.curr_host_id;
			rqParams.new_dicom = 'n';
			console.log(rqParams);
			let apiName = 'save_update_inc';
			try {
				let response = await doCallApi(apiName, rqParams);
				console.log(response);
				if (response.res.statusCode == 200) {
					alert('บันทึกการแก้ไขเคสเข้าสู่ระบบเรียบร้อยแล้ว');
					doCloseNewCaseBox();
					if (currentTab === 'ReadWaitDiv') {
						//openRwCaseList();
						$("#ReadWaitTab").trigger("click");
					} else if (currentTab === 'ReadSuccessDiv') {
						//openRsCaseList();
						$("#ReadSuccessTab").trigger("click");
					}
					$('body').loading('stop');
				} else if (response.res.statusCode == 500) {
					alert('API Server ขัดข้อง');
					$('body').loading('stop');
				}
 			} catch(e) {
        console.log('Unexpected error occurred =>', e);
        $('body').loading('stop');
    	}
		}
	}

	function doShowCaseCalendar() {
		const spacingBox = $('<span>&nbsp;</span>');
  	const inputStyleClass = {"font-family": "THSarabunNew", "font-size": "24px"};

  	$('#HistoryDialogBox').empty();

  	let selectBox = $('<div></div>');
  	let statusSelect = $('<select id="startDate"></select>');
  	$(statusSelect).css(inputStyleClass);
		$(statusSelect).append($('<option value="TODAY">Today</option>'));
		$(statusSelect).append($('<option value="YESTERDAY">Yesterday</option>'));
		$(statusSelect).append($('<option value="WEEK">Last 7 days</option>'));
		$(statusSelect).append($('<option value="MONTH">Last 31 days</option>'));
		$(statusSelect).append($('<option value="3MONTH">Last 3 months</option>'));
		$(statusSelect).append($('<option value="YEAR">Last year</option>'));

		$(selectBox).append($('<label>ค้นหาเคสเริ่มจาก :</label>'));
  	$(selectBox).append($(statusSelect));

		let cmdBox = $('<div></div>');
 		$(cmdBox).css('width','100%');
		$(cmdBox).css('padding','3px');
		$(cmdBox).css('clear','left');
 		$(cmdBox).css('text-align','center');
 		$(cmdBox).css('margin-top','10px');
  	let changeCmdBtn = $('<button> ค้นหา </button>');
  	$(changeCmdBtn).css(inputStyleClass);
  	$(changeCmdBtn).click(()=>{
			let startDate = $('#startDate').val();
			if (startDate === 'TODAY') {
				startDate = util.getToday();
			} else if (startDate === 'YESTERDAY') {
				startDate = util.getYesterday();
			} else if (startDate === 'WEEK') {
				startDate = util.getDateLastWeek();
			} else if (startDate === 'MONTH') {
				startDate = util.getDateLastMonth();
			} else if (startDate === '3MONTH') {
				startDate = util.getDateLast3Month();
			} else if (startDate === 'YEAR') {
				startDate = util.getDateLastYear();
			} else {
				startDate = util.getToday();
			}
			startDate = util.formatDateDev(startDate);
  		doCallSearchCasebyDate(startDate);
  		$('#HistoryDialogBox').dialog('close');
  	});
  	$(changeCmdBtn).appendTo($(cmdBox));

  	$(spacingBox).appendTo($(cmdBox));
  	let cancelCmdBtn = $('<button> ยกเลิก </button>');
  	$(cancelCmdBtn).css(inputStyleClass);
  	$(cancelCmdBtn).click(()=>{
  		$('#HistoryDialogBox').dialog('close');
  	});
		$(cancelCmdBtn).appendTo($(cmdBox));

  	$('#HistoryDialogBox').append($(selectBox));
  	$('#HistoryDialogBox').append($(cmdBox));

  	$('#HistoryDialogBox').dialog('option', 'title', 'ค้นหาเคส');
  	$('#HistoryDialogBox').dialog('open');
	}

  function doShowPopupChangeCaseStatus(id, currentStatus){
  	const spacingBox = $('<span>&nbsp;</span>');
  	const inputStyleClass = {"font-family": "THSarabunNew", "font-size": "24px"};

  	$('#HistoryDialogBox').empty();

  	let selectBox = $('<div></div>');
  	let statusSelect = $('<select id="newStatus"></select>');
  	$(statusSelect).css(inputStyleClass);

  	apiconnector.RadConStatus.forEach((item) => {
			if (item.use == true) {
	  		let option = $('<option></option>');
	  		$(option).val(item.status_en);
	  		$(option).text(item.status_th);
	  		if (item.status_en === currentStatus) {
	  			$(option).attr('selected', true);
	  		}
	  		$(option).appendTo($(statusSelect));
			}
  	});
  	$(selectBox).append($('<label>สถานะใหม่ที่ต้องการเปลี่ยน :</label>'));
  	$(selectBox).append($(statusSelect));

		let cmdBox = $('<div></div>');
 		$(cmdBox).css('width','100%');
		$(cmdBox).css('padding','3px');
		$(cmdBox).css('clear','left');
 		$(cmdBox).css('text-align','center');
 		$(cmdBox).css('margin-top','10px');
  	let changeCmdBtn = $('<button> เปลี่ยน </button>');
  	$(changeCmdBtn).css(inputStyleClass);
  	$(changeCmdBtn).click(()=>{
  		doCallUpdateCaseStatus();
  		$('#HistoryDialogBox').dialog('close');
  	});
  	$(changeCmdBtn).appendTo($(cmdBox));

  	$(spacingBox).appendTo($(cmdBox));
  	let cancelCmdBtn = $('<button> ยกเลิก </button>');
  	$(cancelCmdBtn).css(inputStyleClass);
  	$(cancelCmdBtn).click(()=>{
  		$('#HistoryDialogBox').dialog('close');
  	});
		$(cancelCmdBtn).appendTo($(cmdBox));

  	$('#HistoryDialogBox').append($(selectBox));
  	$('#HistoryDialogBox').append($(cmdBox));

  	let caseIDHidden = $('<input type="hidden" id="caseID" value="' + id + '"/>');
  	$(caseIDHidden).appendTo($('#HistoryDialogBox'));

  	$('#HistoryDialogBox').dialog('option', 'title', 'เปลี่ยนสถานะเคส');
  	$('#HistoryDialogBox').dialog('open');
  }

	function doCallUpdateCaseStatus() {
		$('body').loading('start');
		let caseID = $('#caseID').val();
		let newStatus = $('#newStatus').val();
		doUpdateCaseStatus(caseID, newStatus).then((response) => {
			if (currentTab === 'ReadWaitDiv') {
				//openRwCaseList();
				$("#ReadWaitTab").trigger("click");
			} else if (currentTab === 'ReadSuccessDiv') {
				//openRsCaseList();
				$("#ReadSuccessTab").trigger("click");
			}
			$('body').loading('stop');
		}).catch((err) => {
			console.log(err);
			$('body').loading('stop');
		});
	}

	function doCallDeleteCase(caseID) {
  	let userConfirm = confirm('โปรดยืนยันเพื่อลบรายการนี้ โดยคลิกปุ่ม ตกลง หรือ OK');
  	if (userConfirm == true){
  		$('body').loading('start');
  		let newStatus = 'cancel';
			doUpdateCaseStatus(caseID, newStatus).then((response) => {
				if (currentTab === 'ReadWaitDiv') {
					//openRwCaseList();
					$("#ReadWaitTab").trigger("click");
				} else if (currentTab === 'ReadSuccessDiv') {
					//openRsCaseList();
					$("#ReadSuccessTab").trigger("click");
				}
				$('body').loading('stop');
			}).catch((err) => {
				console.log(err);
				$('body').loading('stop');
			});
  	}
	}

	function doUpdateCaseStatus(id, newStatus){
		return new Promise(async function(resolve, reject) {
			const main = require('../main.js');
			let rqParams = { username: main.doGetCookie().username , inc_id: id, update_status: newStatus};
			let apiName = 'update_incident';
			try {
				let response = await doCallApi(apiName, rqParams);
				console.log(response);
				let resO = JSON.parse(response.res.body);
				resolve(resO);
			} catch(e) {
	      reject(e);
    	}
		});
	}

	return {
		doLoadCasePage,
		doEventManagment,
		doLoadCaseList
	}
}
