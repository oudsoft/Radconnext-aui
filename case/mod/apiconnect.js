/* apiconnect.js */

const apiExt = ".php";
const proxyRootUri = '/api';
const proxyApi = '/apiproxy';
const proxyEndPoint = "/callapi";
const proxyUrl = proxyRootUri + proxyApi + proxyEndPoint;
//const hostIP = '202.28.68.28';
const hostApiPort = '8080';
const hostIP = 'localhost';
const hostOrthancApiPort = '8042';
const hostName = hostIP + ':' + hostApiPort;
const domainName = 'radconnext.com';


//const hostURL = 'https://radconnext.com/rad_test/api';
const hostURL = 'https://radconnext.com/radconnext/api';

const hostOrthancUrl = 'http://' + hostIP + ':' +  hostOrthancApiPort;
const orthancProxyApi = '/orthancproxy';

const RadConStatus = [
  {id: 1, status_en: 'draft', status_th: "Draft", use: false},
  {id: 2, status_en: 'wait_edit', status_th: "รอแก้ไข", use: false},
  {id: 3, status_en: 'wait_start', status_th: "รอเริ่ม", use: false},
  {id: 4, status_en: 'wait_zip', status_th: "รอเตรียมไฟล์ภาพ", use: false},
  {id: 5, status_en: 'processing', status_th: "กำลังเตรียมไฟล์ภาพ", use: false},
  {id: 6, status_en: 'wait_upload', status_th: "รอส่งไฟล์ภาพ", use: false},
  {id: 7, status_en: 'uploading', status_th: "กำลังส่งไฟล์ภาพ", use: false},
  {id: 8, status_en: 'wait_consult', status_th: "รอหมอ Consult", use: false},
  {id: 9, status_en: 'wait_dr_consult', status_th: "รอหมอตอบ Consult", use: false},
  {id: 10, status_en: 'consult_expire', status_th: "หมอตอบ Consult ไม่ทันเวลา", use: false},
  {id: 11, status_en: 'wait_consult_ack', status_th: "ตอบ Consult แล้ว", use: false},
  {id: 12, status_en: 'wait_response_1', status_th: "รอหมอตอบรับ", use: false},
  {id: 13, status_en: 'wait_response_2', status_th: "รอหมอตอบรับ", use: false},
  {id: 14, status_en: 'wait_response_3', status_th: "รอหมอตอบรับ", use: false},
  {id: 15, status_en: 'wait_response_4', status_th: "รอหมอตอบรับ", use: false},
  {id: 16, status_en: 'wait_response_5', status_th: "รอหมอตอบรับ", use: false},
  {id: 17, status_en: 'wait_response_6', status_th: "รอหมอตอบรับ", use: false},
  {id: 18, status_en: 'wait_dr_key', status_th: "รออ่านผล", use: true},
  {id: 19, status_en: 'wait_close', status_th: "รอพิมพ์ผล", use: true},
  {id: 20, status_en: 'wait_close2', status_th: "รอพิมพ์ผลที่แก้ไข", use: true},
  {id: 21, status_en: 'close', status_th: "ดูผลแล้ว", use: true},
  {id: 22, status_en: 'cancel', status_th: "ยกเลิก", use: true},
];

const filterValue = (obj, key, value)=> obj.filter(v => v[key] === value);

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

	const doCallApiDirect = function (apiname, params) {
		return new Promise(function(resolve, reject) {
			var realUrl = '../api' + '/' + apiname + apiExt;
			$.post(realUrl, params, function(data){
				resolve(data);
			}).fail(function(error) {
				reject(error);
			});
		});
	}

	const doCallApiByProxy = function (apiname, params) {
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
			$.post(apiurl, params, function(data){
				resolve(data);
			}).fail(function(error) {
				reject(error);
			});
		});
	}

  const doGetApi = function (apiurl, params) {
		return new Promise(function(resolve, reject) {
			$.get(apiurl, params, function(data){
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
  		let orthancProxyEndPoint = proxyRootUri + orthancProxyApi + '/loadarchive/' + studyID;
  		let params = {hospitalId: hospitalId};
  		$.post(orthancProxyEndPoint, params, function(data){
				resolve(data);
			})
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
            if (meetingRes.response.status === 'waiting') {
              readyMeetings.push(item);
              return;
            } else if (meetingRes.response.status === 'end') {
              reqUrl = '/api/zoom/deletemeeting';
              meetingRes = await doCallApi(reqUrl, reqParams);
            }
          });
          setTimeout(()=> {
            inResolve(readyMeetings);
          }, 1200);
        });
        Promise.all([promiseList]).then(async (ob)=>{
          let patientFullNameEN = incident.case.patient.Patient_NameEN + ' ' + incident.case.patient.Patient_LastNameEN;
          if (ob[0].length >= 1) {
            let readyMeeting = ob[0][0];
            console.log('readyMeeting =>', readyMeeting);
            console.log('case dtail =>', incident);
            //update meeting for user
            let joinTopic = 'โรงพยาบาล' + hospitalName + ' ผู้ป่วยชื่อ ' + patientFullNameEN;
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
            let joinTopic =  'โรงพยาบาล' + hospitalName + ' ผู้ป่วยชื่อ ' + patientFullNameEN;
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
		apiExt,
		proxyRootUri,
		proxyApi,
		proxyEndPoint,
		proxyUrl,
		hostIP,
		hostURL,
		hostApiPort,
		hostOrthancApiPort,
		hostName,
		hostURL,
		hostOrthancUrl,
		orthancProxyApi,
		RadConStatus,
		/*method*/
		filterValue,
		doTestAjaxCallApi,
		doCallApiDirect,
		doCallApiByProxy,
    doCallApi,
    doGetApi,
		doGetResourceByProxy,
		doCallOrthancApiByProxy,
		doCallDicomPreview,
		doCallDownloadDicom,
		doCallTransferDicom,
		doCallTransferHistory,
		doCallDeleteDicom,
    doGetOrthancPort,
    doConvertPageToPdf,
    doDownloadResult,
    doConvertPdfToDicom,
    doGetZoomMeeting
	}
}
