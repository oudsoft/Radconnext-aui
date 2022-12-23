/* apiconnect.js */

const proxyRootUri = '/api';
const proxyApi = '/apiproxy';
const proxyEndPoint = "/callapi";

const adminEmailAddress = 'oudsoft@yahoo.com';

const orthancProxyApi = '/orthancproxy';

const arrFilterValue = (arr, key, value)=> arr.filter(v => v[key] === value);


module.exports = function ( jq ) {
	const $ = jq;

	const doTestAjaxCallApi = function () {
		return new Promise(function(resolve, reject) {
			let testURL = "../api/chk_login.php";
			$.ajax({
				type: 'POST',
				url: testURL ,
				dataType: 'json',
				data: JSON.stringify({ username: "limparty", password: "Limparty" }) /*,
				headers: {
					authorization: localStorage.getItem('token')
				}
				*/
			}).then(function(httpdata) {
				resolve(httpdata);
			});
		});
	}

  const doCallApiByAjax = function(url, payload){
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: url,
        type: 'post',
        data: payload,
        xhr: function () {
          var xhr = $.ajaxSettings.xhr();
          xhr.onprogress = function(e) {
            // For downloads
            console.log('down prog=>', e);
            if (e.lengthComputable) {
              console.log(e.loaded / e.total);
            }
          };
          xhr.upload.onprogress = function (e) {
            // For uploads
            console.log('up prog=>', e);
            if (e.lengthComputable) {
              console.log(e.loaded / e.total);
            }
          };
          return xhr;
        }
      }).done(function (e) {
        resolve(e)
      }).fail(function (e) {
        reject(e)
      });
    });
  }

	const doCallApiDirect = function (apiUrl, params) {
		return new Promise(function(resolve, reject) {
			$.post(apiUrl, params, function(data){
				resolve(data);
			}).fail(function(error) {
				reject(error);
			});
		});
	}

	const doCallApiByProxy = function (proxyUrl, params) {
		return new Promise(function(resolve, reject) {
			$.post(proxyUrl, params, function(data){
				resolve(data);
			}).fail(function(error) {
				reject(error);
			});
		});
	}

  const doCallApi = function (apiurl, params) {
		return new Promise(function(resolve, reject) {
      let apiname = apiurl;
      const progBar = $('body').radprogress({value: 0, apiname: apiname});
      $(progBar.progressBox).screencenter({offset: {x: 50, y: 50}});
      let apiURL = apiurl;
      if (window.location.hostname == 'localhost') {
        apiURL = 'https://radconnext.info' + apiurl;
      }
      $.ajax({
        url: apiURL,
        type: 'post',
        data: params,
        xhr: function () {
          var xhr = $.ajaxSettings.xhr();
          xhr.onprogress = function(evt) {
            if (evt.lengthComputable) {
              // For Download
              /*
              var event = new CustomEvent('response-progress', {detail: {event: evt, resfrom: apiurl}});
              document.dispatchEvent(event);
              */
							
							/*
              let loaded = evt.loaded;
              let total = evt.total;
              let prog = (loaded / total) * 100;
              let perc = prog.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              $('body').find('#ProgressValueBox').text(perc + '%');
							*/
            }
          };
          xhr.upload.onprogress = function (evt) {
            // For uploads
          };
          return xhr;
        }
      }).done(function (res) {
        progBar.doUpdateProgressValue(100);
        setTimeout(()=>{
  				progBar.doCloseProgress();

          let apiItem = {api: apiurl};
          console.log(apiItem);
					/*
          let logWin = $('body').find('#LogBox');
          $(logWin).simplelog(apiItem);
					*/
          resolve(res)
        }, 1000);
      }).fail(function (err) {
        reject(err);
      });
		});
	}

  const doGetApi = function (apiurl, params) {
		return new Promise(function(resolve, reject) {
      let apiURL = apiurl;
      if (window.location.hostname == 'localhost') {
        apiURL = 'https://radconnext.info' + apiurl;
      }
			$.get(apiURL, params, function(data){
				resolve(data);
			}).fail(function(error) {
				reject(error);
			});
		});
	}

	const doGetResourceByProxy = function(params) {
		return new Promise(function(resolve, reject) {
			let proxyEndPoint = proxyRootUri + proxyApi + '/getresource';
			$.post(proxyEndPoint, params, function(data){
				resolve(data);
			}).fail(function(error) {
				reject(error);
			});
		});
	}

	const doCallOrthancApiByProxy = function(params) {
		return new Promise(function(resolve, reject) {
			let orthancProxyEndPoint = proxyRootUri + orthancProxyApi + '/find';
			$.post(orthancProxyEndPoint, params, function(data){
				resolve(data);
			}).fail(function(error) {
				reject(error);
			});
		});
	}

  const doCallReportBug = function(params){
    return new Promise(function(resolve, reject) {
			let reportBugEndPoint = proxyRootUri + '/bug/report/email';
			$.post(reportBugEndPoint, params, function(data){
				resolve(data);
			}).fail(function(error) {
				reject(error);
			});
		});
  }

	const doCallDicomPreview = function(instanceID, username){
		return new Promise(function(resolve, reject) {
  		let orthancProxyEndPoint = proxyRootUri + orthancProxyApi + '/preview/' + instanceID;
  		let params = {username: username};
  		$.post(orthancProxyEndPoint, params, function(data){
				resolve(data);
			})
  	});
	}

	const doCallDownloadDicom = function(studyID, hospitalId){
		return new Promise(function(resolve, reject) {
      const progBar = $('body').radprogress({value: 0, apiname: 'Preparing Zip File'});
      $(progBar.progressBox).screencenter({offset: {x: 50, y: 50}});
      $(progBar.progressValueBox).remove();
      $(progBar.progressBox).css({'font-size': '50px'});
  		let orthancProxyEndPoint = proxyRootUri + orthancProxyApi + '/loadarchive/' + studyID;
  		let params = {hospitalId: hospitalId};
      //doCallApi(orthancProxyEndPoint, params).then((data)=>{
  		$.post(orthancProxyEndPoint, params, function(data){
        progBar.doCloseProgress();
				resolve(data);
      }).fail(function(error) {
        progBar.doCloseProgress();
				reject(error);
			});
  	});
	}

  const doCrateDicomAdvance = function(studyID, hospitalId){
		return new Promise(function(resolve, reject) {
  		let orthancProxyEndPoint = proxyRootUri + orthancProxyApi + '/create/archive/advance/' + studyID;
  		let params = {hospitalId: hospitalId};
      doCallApi(orthancProxyEndPoint, params).then((data)=>{
  		//$.post(orthancProxyEndPoint, params, function(data){
				resolve(data);
			});
  	});
	}

	const doCallTransferDicom = function(studyID, username){
		return new Promise(function(resolve, reject) {
  		let orthancProxyEndPoint = proxyRootUri + orthancProxyApi + '/transferdicom/' + studyID;
  		let params = {username: username};
  		$.post(orthancProxyEndPoint, params, function(data){
				resolve(data);
			})
  	});
	}

	const doCallTransferHistory = function(filename){
		return new Promise(function(resolve, reject) {
  		let orthancProxyEndPoint = proxyRootUri + orthancProxyApi + '/transferhistory';
  		let params = {filename: filename};
  		$.post(orthancProxyEndPoint, params, function(data){
				resolve(data);
			})
		});
	}

	const doCallDeleteDicom = function (studyID, hospitalId) {
		return new Promise(function(resolve, reject) {
  		let orthancProxyEndPoint = proxyRootUri + orthancProxyApi + '/deletedicom/' + studyID;
  		let params = {hospitalId: hospitalId};
  		$.post(orthancProxyEndPoint, params, function(data){
				resolve(data);
			})
  	});
	}

  const doGetOrthancPort = function(hospitalId) {
    return new Promise(function(resolve, reject) {
      let orthancProxyEndPoint = proxyRootUri + orthancProxyApi + '/orthancexternalport';
      let params = {hospitalId: hospitalId};
      $.get(orthancProxyEndPoint, params, function(data){
				resolve(data);
			})
    });
  }

  const doCallDicomArchiveExist = function(archiveFilename){
    return new Promise(function(resolve, reject) {
      let orthancProxyEndPoint = proxyRootUri + orthancProxyApi + '/archivefile/exist';
      let params = {filename: archiveFilename};
      $.post(orthancProxyEndPoint, params, function(data){
				resolve(data);
			})
    });
  }

  const doConvertPageToPdf = function(pageUrl){
    return new Promise(function(resolve, reject) {
      let convertorEndPoint = proxyRootUri + "/convertfromurl";;
      let params = {url: pageUrl};
			$.post(convertorEndPoint, params, function(data){
				resolve(data);
			}).fail(function(error) {
				reject(error);
			});
    });
  }

  const doDownloadResult = function(caseId, hospitalId, userId, patient){
    return new Promise(async function(resolve, reject) {
      let reportCreateCallerEndPoint = proxyRootUri + "/casereport/create";;
      let params = {caseId: caseId, hospitalId: hospitalId, userId: userId, pdfFileName: patient};
			let reportPdf = await $.post(reportCreateCallerEndPoint, params);
      resolve(reportPdf);
    });
  }

  const doConvertPdfToDicom = function(caseId, hospitalId, userId, studyID, modality, studyInstanceUID){
    return new Promise(function(resolve, reject) {
      let convertorEndPoint = proxyRootUri + "/casereport/convert";;
      let params = {caseId, hospitalId, userId, studyID, modality, studyInstanceUID};
			$.post(convertorEndPoint, params, function(data){
				resolve(data);
			}).fail(function(error) {
        console.log('convert error', error);
				reject(error);
			});
    });
  }

  const doCallNewTokenApi = function() {
    return new Promise(function(resolve, reject) {
      const userdata = JSON.parse(localStorage.getItem('userdata'));
      var newTokenApiUri = '/api/login/newtoken';
      var params = {username: userdata.username};
      $.post(newTokenApiUri, params, function(response){
  			resolve(response);
  		}).catch((err) => {
  			console.log('doCallNewTokenApi=>', JSON.stringify(err));
        reject(err);
  		})
  	});
  }

  const doCallLoadStudyTags = function(hospitalId, studyId){
    return new Promise(async function(resolve, reject) {
      let rqBody = '{"Level": "Study", "Expand": true, "Query": {"PatientName":"TEST"}}';
      let orthancUri = '/studies/' + studyId;
	  	let params = {method: 'get', uri: orthancUri, body: rqBody, hospitalId: hospitalId};
      let callLoadUrl = '/api/orthancproxy/find'
      $.post(callLoadUrl, params).then((response) => {
        resolve(response);
      });
    });
  }

  const doReStructureDicom = function(hospitalId, studyId, dicom){
    return new Promise(async function(resolve, reject) {
      let params = {hospitalId: hospitalId, resourceId: studyId, resourceType: "study", dicom: dicom};
      let restudyUrl = '/api/dicomtransferlog/add';
      $.post(restudyUrl, params).then((response) => {
        resolve(response);
      });
    });
  }

  /* Zoom API Connection */

  const zoomUserId = 'vwrjK4N4Tt284J2xw-V1ew';

  const meetingType = 2; // 1, 2, 3, 8
  const totalMinute = 15;
  const meetingTimeZone = "Asia/Bangkok";
  const agenda = "RADConnext";
  const joinPassword = "RAD1234";

  const meetingConfig ={
    host_video: false,
    participant_video: true,
    cn_meeting: false,
    in_meeting: false,
    join_before_host: true,
    mute_upon_entry: false,
    watermark: false,
    use_pmi: false,
    waiting_room: false,
    approval_type: 0, // 0, 1, 2
    registration_type: 1, // 1, 2, 3
    audio: "both",
    auto_recording: "none",
    alternative_hosts: "",
    close_registration: true,
    //global_dial_in_countries: true,
    registrants_email_notification: false,
    meeting_authentication: false,
  }

  const doGetZoomMeeting = function(incident, startMeetingTime, hospitalName) {
    return new Promise(function(resolve, reject) {
      let reqParams = {};
      reqParams.zoomUserId = zoomUserId;
      let reqUrl = '/api/zoom/listmeeting';
      doCallApi(reqUrl, reqParams).then((meetingsRes)=>{
        //console.log(meetingsRes);
        reqUrl = '/api/zoom/getmeeting';
        reqParams = {};
        let meetings = meetingsRes.response.meetings;
        let readyMeetings = [];
        var promiseList = new Promise(async function(inResolve, inReject){
          await meetings.forEach(async (item, i) => {
            reqParams.meetingId = item.id;
            let meetingRes = await doCallApi(reqUrl, reqParams);
            console.log(meetingRes);
            if ((meetingRes.response) && (meetingRes.response.status)){
              if (meetingRes.response.status === 'waiting') {
                readyMeetings.push(item);
                return;
              } else if (meetingRes.response.status === 'end') {
                reqUrl = '/api/zoom/deletemeeting';
                meetingRes = await doCallApi(reqUrl, reqParams);
              }
            } else {
              return;
            }
          });
          setTimeout(()=> {
            inResolve(readyMeetings);
          }, 1200);
        });
        Promise.all([promiseList]).then(async (ob)=>{
          let patientFullNameEN = incident.case.patient.Patient_NameEN + ' ' + incident.case.patient.Patient_LastNameEN;
          let patientHN = incident.case.patient.Patient_HN;
          if (ob[0].length >= 1) {
            let readyMeeting = ob[0][0];
            console.log('readyMeeting =>', readyMeeting);
            console.log('case dtail =>', incident);
            //update meeting for user
            let joinTopic = 'โรงพยาบาล' + hospitalName + '  ' + patientFullNameEN + '  HN: ' + patientHN;
            let startTime = startMeetingTime;
            let zoomParams = {
              topic: joinTopic,
              type: meetingType,
              start_time: startTime,
              duration: totalMinute,
              timezone: meetingTimeZone,
              password: joinPassword,
              agenda: agenda
            };
            zoomParams.settings = meetingConfig;
            reqParams.params = zoomParams;
            reqUrl = '/api/zoom/updatemeeting';
            let meetingRes = await doCallApi(reqUrl, reqParams);
            console.log('update result=>', meetingRes);
            reqUrl = '/api/zoom/getmeeting';
            reqParams = {meetingId: readyMeeting.id};
            meetingRes = await doCallApi(reqUrl, reqParams);
            console.log('updated result=>', meetingRes);
            resolve(meetingRes.response);
          } else {
            //create new meeting
            reqUrl = '/api/zoom/createmeeting';
            reqParams.zoomUserId = zoomUserId;
            let joinTopic =  'โรงพยาบาล' + hospitalName + ' ' + patientFullNameEN + ' HN: ' + patientHN;
            let startTime = startMeetingTime;
            let zoomParams = {
              topic: joinTopic,
              type: meetingType,
              start_time: startTime,
              duration: totalMinute,
              timezone: meetingTimeZone,
              password: joinPassword,
              agenda: agenda
            };
            zoomParams.settings = meetingConfig;
            reqParams.params = zoomParams;
            doCallApi(reqUrl, reqParams).then((meetingsRes)=>{
              console.log('create meetingsRes=>', meetingsRes);
              reqUrl = '/api/zoom/getmeeting';
              reqParams = {};
              reqParams.meetingId = meetingsRes.response.id;
              doCallApi(reqUrl, reqParams).then((meetingRes)=>{
                console.log('create meetingRes=>', meetingRes);
                resolve(meetingRes.response);
              });
            });
          }
        });
      });
    });
  }

	return {
		/* const */
		proxyRootUri,
		proxyApi,
		proxyEndPoint,

		orthancProxyApi,
    adminEmailAddress,

		/*method*/
		arrFilterValue,
		doTestAjaxCallApi,
    doCallApiByAjax,
		doCallApiDirect,
		doCallApiByProxy,
    doCallApi,
    doGetApi,
		doGetResourceByProxy,
		doCallOrthancApiByProxy,
    doCallReportBug,
		doCallDicomPreview,
		doCallDownloadDicom,
    doCrateDicomAdvance,
		doCallTransferDicom,
		doCallTransferHistory,
		doCallDeleteDicom,
    doGetOrthancPort,
    doCallDicomArchiveExist,
    doConvertPageToPdf,
    doDownloadResult,
    doConvertPdfToDicom,
    doCallNewTokenApi,
    doCallLoadStudyTags,
    doReStructureDicom,
    doGetZoomMeeting
	}
}
