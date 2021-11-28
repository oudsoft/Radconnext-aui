/* orthanc.js */
module.exports = function ( jq ) {
	const $ = jq;

  const apiconnector = require('../../case/mod/apiconnect.js')($);
  const util = require('../../case/mod/utilmod.js')($);
  const common = require('../../case/mod/commonlib.js')($);
	const newreffuser = require('../../case/mod/createnewrefferal.js')($);

  const caseview = require('./caseviewer.js')($);

	const pageFontStyle = {"font-family": "THSarabunNew", "font-size": "24px"};

  const doLoadDicomFromOrthanc = function(viewPage){
		$('body').loading('start');
		const userdata = JSON.parse(localStorage.getItem('userdata'));
		let userDefualtSetting = JSON.parse(localStorage.getItem('defualsettings'));
    let userItemPerPage = userDefualtSetting.itemperpage;
		let queryString = localStorage.getItem('dicomfilter');
		//console.log(queryString);
		doCallSearhDicomLog(queryString).then(async (studies) => {
			let titlePage = $('<div></div>');
			let logoPage = $('<img src="/images/orthanc-icon-3.png" width="40px" height="auto" style="position: relative; display: inline-block; top: 10px;"/>');
			$(titlePage).append($(logoPage));
			let titleContent = $('<div style="position: relative; display: inline-block; margin-left: 10px;"><h3>รายการภาพในระบบ</h3></div>');
			$(titlePage).append($(titleContent));

			let queryDicom = JSON.parse(queryString);

			let filterDisplayText = '';
			if ((queryDicom.Query.Modality) && (queryDicom.Query.Modality !== '*')) {
				filterDisplayText += ' Modality <b>[' + queryDicom.Query.Modality + ']</b>';
			} else {
				filterDisplayText += ' Modality <b>[All]</b>';
				queryDicom = {Query: {modality: '*'}};
			}

			let filterDisplayTextBox = $('<div style="position: relative; display: inline-block; margin-left: 10px;"></div>');
			$(filterDisplayTextBox).append($('<span>' + filterDisplayText + '</span>'));
			$(titlePage).append($(filterDisplayTextBox));

			$('#TitleContent').empty().append($(titlePage));

			$(".mainfull").empty();

			if (studies.length > 0) {
				let resultBox = $('<div id="ResultView" style="position: relative; width: 99%; z-index: 1;"></div>');
        $(".mainfull").append($(resultBox));

        let showDicoms = [];
        if (userItemPerPage == 0) {
          showDicoms = studies;
        } else {
          showDicoms = await common.doExtractList(studies, 1, userItemPerPage);
        }

        let dicomView = await doShowDicomResult(showDicoms, 0);
        $(".mainfull").find('#ResultView').empty().append($(dicomView));

				let showPage = 1;
				if ((viewPage) && (viewPage > 0)){
					showPage = viewPage;
				}
        let navigBarBox = $('<div id="NavigBar"></div>');
        $(".mainfull").append($(navigBarBox));
        let navigBarOption = {
          currentPage: showPage,
          itemperPage: userItemPerPage,
          totalItem: studies.length,
          styleClass : {'padding': '4px', /*'font-family': 'THSarabunNew', 'font-size': '20px', */ 'margin-top': '60px'},
          changeToPageCallback: async function(page){
            $('body').loading('start');
            let toItemShow = 0;
            if (page.toItem == 0) {
              toItemShow = studies.length;
            } else {
              toItemShow = page.toItem;
            }
            showDicoms = await common.doExtractList(studies, page.fromItem, toItemShow);
            let dicomView = await doShowDicomResult(showDicoms, (Number(page.fromItem)-1));
            $(".mainfull").find('#ResultView').empty().append($(dicomView));
            $('body').loading('stop');
						let eventData = {userId: userdata.id};
						$(".mainfull").trigger('opendicomfilter', [eventData]);
          }
        };
        let navigatoePage = $(navigBarBox).controlpage(navigBarOption);
        navigatoePage.toPage(1);
				$('body').loading('stop');
			} else {
				$(".mainfull").append($('<div><h3>ไม่พบรายการภาพ</h3></div>'));
				$('body').loading('stop');
			}
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			let eventData = {userId: userdata.id};
			$(".mainfull").trigger('opendicomfilter', [eventData]);
		});
	}

  const doCallSearhOrthanc = function(query) {
  	return new Promise(function(resolve, reject) {
			//console.log(query);
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			//console.log(userdata);
	  	let orthancUri = '/tools/find';
	  	let params = {method: 'post', uri: orthancUri, body: query, hospitalId: userdata.hospitalId};
	  	apiconnector.doCallOrthancApiByProxy(params).then((response) =>{
	  		//console.log(response);
	  		var promiseList = new Promise(function(resolve, reject){
		  		response.forEach((study) => {
		  			let queryStr = '{"Level": "Series", "Expand": true, "Query": {"PatientName":"' + study.PatientMainDicomTags.PatientName + '"}}';
		  			params = {method: 'post', uri: orthancUri, body: queryStr, hospitalId: userdata.hospitalId};
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

	const doCallSearhDicomLog = function(queryString) {
		return new Promise(async function(resolve, reject) {
			const userdata = JSON.parse(localStorage.getItem('userdata'));
			const dicomUrl = '/api/dicomtransferlog/studies/list';
			let query = JSON.parse(queryString);
			let modality = query.Query.Modality;
			let studyDate = query.Query.StudyDate;
			if (studyDate){
				let n = studyDate.indexOf('-');
				if (n > 0){
					studyDate = studyDate.split('');
					studyDate.splice(n, 1);
					studyDate = studyDate.join('')
				} else {
					studyDate = studyDate;
				}
			}
			let rqParams = {hospitalId: userdata.hospitalId, modality: modality, studyDate: studyDate};
			console.log(rqParams);
			let dicomStudiesRes = await common.doCallApi(dicomUrl, rqParams);
			if (dicomStudiesRes.status.code == 200){
				let studies = [];
				if (dicomStudiesRes.orthancRes) {
					let dicomSudies = dicomStudiesRes.orthancRes;
					await dicomSudies.forEach((item, i) => {
						studies.push(item.StudyTags);
					});
				}
				resolve(studies);
			} else 	if (dicomStudiesRes.status.code == 210) {
				reject({error: {code: 210, cause: 'Token Expired!'}});
			} else {
				let apiError = 'api error at ' + dicomUrl;
				console.log(apiError);
				reject({error: apiError});
			}
		});
	}

  const doCreateDicomHeaderRow = function() {
		const headerLabels = ['No.', 'Study Date', 'HN', 'Name', 'Sex/Age', 'Modality', 'Study Desc.', 'Status'];
		const tableRow = $('<div style="display: table-row;"></div>');
		for (var i = 0; i < headerLabels.length; i++) {
			let item = headerLabels[i];
	    let tableHeader = $('<div style="display: table-cell; vertical-align: middle;" class="header-cell">' + item + '</div>');
			$(tableHeader).appendTo($(tableRow));
		}
		return $(tableRow);
	}

	const doCreateDicomItemRow = function(no, studyDate, studyTime, hn, name, sa, mdl, sdd, defualtValue, dicomSeries, dicomID){
		const tableRow = $('<div style="display: table-row; padding: 2px;" class="case-row"></div>');

		let dicomValue = $('<div style="display: table-cell; padding: 2px; text-align: center; vertical-align: middle;">' + no + '</div>');
		$(dicomValue).appendTo($(tableRow));

		dicomValue = $('<div style="display: table-cell; padding: 2px; vertical-align: middle;">' + studyDate + studyTime + '</div>');
		$(dicomValue).appendTo($(tableRow));

		dicomValue = $('<div style="display: table-cell; padding: 2px; vertical-align: middle;">' + hn + '</div>');
		$(dicomValue).appendTo($(tableRow));

		dicomValue = $('<div style="display: table-cell; padding: 2px; vertical-align: middle;">' + name + '</div>');
		$(dicomValue).appendTo($(tableRow));

		dicomValue = $('<div style="display: table-cell; padding: 2px; vertical-align: middle;">' + sa + '</div>');
		$(dicomValue).appendTo($(tableRow));

		dicomValue = $('<div style="display: table-cell; padding: 2px; vertical-align: middle;">' + mdl + '</div>');
		$(dicomValue).appendTo($(tableRow));

		dicomValue = $('<div style="display: table-cell; padding: 2px; vertical-align: middle;">' + sdd + '</div>');
		$(dicomValue).appendTo($(tableRow));

		let operationField = $('<div style="display: table-cell; padding: 2px; text-align: center; vertical-align: middle;"></div>');
		$(operationField).appendTo($(tableRow));

    $(operationField).load('/api/cases/status/by/dicom/' + dicomID, function(response){
			const waitingResultStatus = [1, 2, 8, 9];
			const successResultStatus = [5];
			const openResultStatus = [6, 10, 11, 12, 13, 14];

			let statusIcon = undefined;
      let loadRes = JSON.parse(response);
      if (loadRes.Records.length > 0) {
				let casestatusId = loadRes.Records[0].casestatusId;
				let onWaiting = util.contains.call(waitingResultStatus, casestatusId);
				let onSuccess = util.contains.call(successResultStatus, casestatusId);
				let onOpening = util.contains.call(openResultStatus, casestatusId);
				if (onWaiting) {
					statusIcon = $('<img src="/images/refer-dicom-status-2.png" width="28px" heigth="auto" data-toggle="tooltip"/>');
				} else if (onSuccess) {
					statusIcon = $('<img src="/images/refer-dicom-status-3.png" width="28px" heigth="auto" data-toggle="tooltip"/>');
				} else if (onOpening) {
					statusIcon = $('<img src="/images/refer-dicom-status-4.png" width="28px" heigth="auto" data-toggle="tooltip"/>');
				}
				$(statusIcon).attr('title', loadRes.Records[0].casestatus.CS_Name_EN);
        $(operationField).empty().append($(statusIcon));
        let dicomData = {caseId: loadRes.Records[0].id, casestatusId: loadRes.Records[0].casestatusId, dicomID: dicomID, studyInstanceUID: defualtValue.studyInstanceUID}
        $(tableRow).data(dicomData);
      } else {
				statusIcon = $('<img src="/images/refer-dicom-status-1.png" width="28px" heigth="auto" data-toggle="tooltip" title="ยังไมส่งอ่าน"/>');
				$(operationField).empty().append($(statusIcon));
        let dicomData = {dicomID: dicomID, studyInstanceUID: defualtValue.studyInstanceUID, hn, name, sa, sdd}
        $(tableRow).data(dicomData);
      }
    });

    $(tableRow).css({'cursor': 'pointer'});
		$(tableRow).on('click', (evt)=>{
      dicomData = $(tableRow).data();
      caseview.doOpenCaseView(dicomData, defualtValue, dicomSeries)
    });
		$(tableRow).on('dblclick', (evt)=>{
			$(tableRow).click();
    });

		return $(tableRow);
	}

	const doShowDicomResult = function(dj, startRef){
		return new Promise(async function(resolve, reject) {
			const table = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');
			const tableHeader = doCreateDicomHeaderRow();
			$(tableHeader).appendTo($(table));
			const dicomFilterForm = common.doCreateDicomFilterForm((filterKey)=>{
				//console.log(filterKey);
				common.doSaveQueryDicom(filterKey);
				doLoadDicomFromOrthanc();
			});
			$(dicomFilterForm).append($('<div style="display: table-cell; text-align: left;" class="header-cell"></div>'));
			$(dicomFilterForm).find('#ScanPartInput').css('width', '97%');
			$(dicomFilterForm).find('#StudyFromDateInput').css('width', '55px');
			$(dicomFilterForm).find('#StudyToDateInput').css('width', '55px');
			$(dicomFilterForm).appendTo($(table));
			$(dicomFilterForm).hide();

			const promiseList = new Promise(function(resolve2, reject2){
				for (let i=0; i < dj.length; i++) {
					let desc, protoname, mld, sa, studydate, bdp;
					if ((dj[i].MainDicomTags) && (dj[i].SamplingSeries)){
						if (dj[i].MainDicomTags.StudyDescription) {
							bdp = dj[i].MainDicomTags.StudyDescription;
						} else {
							let dicomProtocolName = dj[i].SamplingSeries.MainDicomTags.ProtocolName;
							let dicomManufacturer = dj[i].SamplingSeries.MainDicomTags.Manufacturer;
							if (dicomProtocolName) {
								bdp = dicomProtocolName;
							} else if ((dicomManufacturer) && (dicomManufacturer.indexOf('FUJIFILM') >= 0)) {
								bdp = dj[i].SamplingSeries.MainDicomTags.PerformedProcedureStepDescription;
							} else {
								bdp = '';
							}
						}
						desc = '<div class="study-desc">' + bdp + '</div>';

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

						let patientProps = sa.split('/');
						let defualtValue = {patient: {id: dj[i].PatientMainDicomTags.PatientID, name: dj[i].PatientMainDicomTags.PatientName, age: patientProps[1], sex: patientProps[0]}, bodypart: bdp, studyID: dj[i].ID, acc: dj[i].MainDicomTags.AccessionNumber, mdl: mld};
						if (dj[i].MainDicomTags.StudyDescription) {
							defualtValue.studyDesc = dj[i].MainDicomTags.StudyDescription;
						} else {
							defualtValue.studyDesc = '';
						}
						if (dj[i].SamplingSeries.MainDicomTags.ProtocolName) {
							defualtValue.protocalName = dj[i].SamplingSeries.MainDicomTags.ProtocolName;
						} else {
							defualtValue.protocalName = '';
						}
						defualtValue.manufacturer = dj[i].SamplingSeries.MainDicomTags.Manufacturer;
						defualtValue.stationName = dj[i].SamplingSeries.MainDicomTags.StationName;
						defualtValue.studyInstanceUID = dj[i].MainDicomTags.StudyInstanceUID;
						defualtValue.studyDate = dj[i].MainDicomTags.StudyDate;
						defualtValue.headerCreateCase = 'ส่งอ่านผล';
						defualtValue.urgenttype = 'standard';

 						let no = (i + 1 + startRef);
						let studyDate = '<span style="float: left;">' + studydate + '</span>';
						//let studyTime = '<div style="background-color: gray; color: white; text-align: center; float: left; margin: -6px 10px; padding: 5px; border-radius: 5px;">' + util.formatStudyTime(dj[i].MainDicomTags.StudyTime) + '</div>';
						let studyTime = '<span style="float: left; margin-left: 10px;">' + util.formatStudyTime(dj[i].MainDicomTags.StudyTime) + '</span>';


						let hn = dj[i].PatientMainDicomTags.PatientID;
						let name = dj[i].PatientMainDicomTags.PatientName;
						let sdd =  desc +  protoname;
						let dicomDataRow = doCreateDicomItemRow(no, studyDate, studyTime, hn, name, sa, mld, sdd, defualtValue, dj[i].Series, dj[i].ID);
						$(dicomDataRow).appendTo($(table));
					}
				}

				setTimeout(()=> {
					resolve2($(table));
				}, 700);
			});
			Promise.all([promiseList]).then((ob)=>{
				resolve(ob[0]);
			});
		});
	}


  return {
    doLoadDicomFromOrthanc,
		doCallSearhOrthanc,
    doCreateDicomHeaderRow,
    doCreateDicomItemRow,
    doShowDicomResult,
	}
}
