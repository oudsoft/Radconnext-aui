/* main.js */

window.$ = window.jQuery = require('jquery');
require('./mod/jquery-ex.js');
const cases = require('./mod/case.js')($);
const apiconnector = require('./mod/apiconnect.js')($);
const util = require('./mod/utilmod.js')($);
const dicomfilter = require('./mod/dicomfilter.js')($);
const newcase = require('./mod/createnewcase.js')($);
const common = require('./mod/commonlib.js')($);
const userinfo = require('./mod/userinfolib.js')($);
const userprofile = require('./mod/userprofilelib.js')($);
const casecounter = require('./mod/casecounter.js')($);
const consult = require('./mod/consult.js')($);
/*
ต
*/

const isMobile = util.isMobileDeviceCheck();
//const isMobile = true;

var noti, wsm, wsl;

$( document ).ready(function() {
  const initPage = function() {
		var token = doGetToken();
		if (token) {
			doLoadMainPage()
		} else {
			doLoadLogin()
		}
	};
  const doLoadLogin = function(){
    window.location.replace('/index.html');
  }

	initPage();

});

function doUserLogout() {
  const userdata = JSON.parse(localStorage.getItem('userdata'));
  if (wsm) {
    wsm.send(JSON.stringify({type: 'logout', username: userdata.username}));
  }
  localStorage.removeItem('token');
	localStorage.removeItem('userdata');
	localStorage.removeItem('dicomfilter');
  $('#LogoutCommand').hide();
  let url = '/index.html';
  window.location.replace(url);
}

function doLoadMainPage(){
	/*
		jquery loading api
		https://carlosbonetti.github.io/jquery-loading/
	*/
  let jqueryUiCssUrl = "../lib/jquery-ui.min.css";
	let jqueryUiJsUrl = "../lib/jquery-ui.min.js";
	let jqueryLoadingUrl = '../lib/jquery.loading.min.js';
	let jqueryNotifyUrl = '../lib/notify.min.js';
  let printjs = '../lib/print/print.min.js';

	let patientHistoryPluginUrl = "../setting/plugin/jquery-patient-history-image-plugin.js";
	let countdownclockPluginUrl = "../setting/plugin/jquery-countdown-clock-plugin.js";
	let scanpartPluginUrl = "../setting/plugin/jquery-scanpart-plugin.js";
	let customUrgentPlugin = "../setting/plugin/jquery-custom-urgent-plugin.js";
	let controlPagePlugin = "../setting/plugin/jquery-controlpage-plugin.js"
  let customSelectPlugin = "../setting/plugin/jquery-custom-select-plugin.js";
  let chatBoxPlugin = "../setting/plugin/jquery-chatbox-plugin.js";
  let utilityPlugin = "../setting/plugin/jquery-radutil-plugin.js";

	$('head').append('<script src="' + jqueryUiJsUrl + '"></script>');
	$('head').append('<link rel="stylesheet" href="' + jqueryUiCssUrl + '" type="text/css" />');
	//https://carlosbonetti.github.io/jquery-loading/
	$('head').append('<script src="' + jqueryLoadingUrl + '"></script>');
	//https://notifyjs.jpillora.com/
	$('head').append('<script src="' + jqueryNotifyUrl + '"></script>');
  //https://printjs.crabbly.com/
  $('head').append('<script src="' + printjs + '"></script>');

	$('head').append('<script src="' + patientHistoryPluginUrl + '"></script>');
	$('head').append('<script src="' + countdownclockPluginUrl + '"></script>');
	$('head').append('<script src="' + scanpartPluginUrl + '"></script>');
	$('head').append('<script src="' + customUrgentPlugin + '"></script>');
	$('head').append('<script src="' + controlPagePlugin + '"></script>');
  $('head').append('<script src="' + customSelectPlugin + '"></script>');
  $('head').append('<script src="' + utilityPlugin + '"></script>');
  $('head').append('<script src="' + chatBoxPlugin + '"></script>');

	$('head').append('<link rel="stylesheet" href="../lib/tui-image-editor.min.css" type="text/css" />');
	$('head').append('<link rel="stylesheet" href="../lib/tui-color-picker.css" type="text/css" />');
  $('head').append('<link rel="stylesheet" href="../lib/print/print.min.css" type="text/css" />');
	$('head').append('<link rel="stylesheet" href="./css/scanpart.css" type="text/css" />');
  $('head').append('<link rel="stylesheet" href="./css/custom-select.css" type="text/css" />');

  $('body').append($('<div id="overlay"><div class="loader"></div></div>'));

  $('body').loading({overlay: $("#overlay"), stoppable: true});

	$('body').on('loading.start', function(event, loadingObj) {
	  //console.log('=== loading show ===');
	});

	$('body').on('loading.stop', function(event, loadingObj) {
	  //console.log('=== loading hide ===');
	});
  $('#HistoryDialogBox').dialog({
    modal: true, autoOpen: false, width: 350, resizable: false, title: 'ประวัติผู้ป่วย'
  });

  document.addEventListener("triggercounter", casecounter.onCaseChangeStatusTrigger);
  document.addEventListener("triggerconsultcounter", casecounter.onConsultChangeStatusTrigger);
  document.addEventListener("triggernewdicom", onNewDicomTransferTrigger);

  let userdata = JSON.parse(doGetUserData());
	//console.log(userdata);

  let mainFile, menufile;
  if (isMobile) {
    mainFile= 'form/main.html';
    menuFile = 'form/menu.html';
  } else {
    mainFile= 'form/main-fix.html';
    menuFile = 'form/menu-fix.html';
  }

	$('#app').load(mainFile, function(){
		$('#Menu').load(menuFile, function(){

			$(document).on('openedituserinfo', (evt, data)=>{
				userinfo.doShowUserProfile();
			});
			$(document).on('userlogout', (evt, data)=>{
				doUserLogout();
			});
			$(document).on('openhome', (evt, data)=>{
				doSaveQueryOrthanc(data);
				newcase.doLoadDicomFromOrthanc();
			});

			$(document).on('opennewstatuscase', async (evt, data)=>{
				let resultTitle = $('<div class="title-content"></div>');
				let logoPage = $('<img src="/images/case-incident-icon.png" width="40px" height="auto" style="float: left;"/>');
				$(logoPage).appendTo($(resultTitle));
				let titleResult = $('<div style="float: left; margin-left: 10px; margin-top: -5px;"><h3>รายการเคสใหม่ (รอตอบรับจากรังสีแพทย์)</h3></div>');
				$(titleResult).appendTo($(resultTitle));
				$(".mainfull").empty().append($(resultTitle));
				let rqParams = { hospitalId: userdata.hospitalId, userId: userdata.id, statusId: common.caseReadWaitStatus };
				cases.doLoadCases(rqParams);
			});

			$(document).on('openacceptedstatuscase', async (evt, data)=>{
				let resultTitle = $('<div class="title-content"></div>');
				let logoPage = $('<img src="/images/case-incident-icon.png" width="40px" height="auto" style="float: left;"/>');
				$(logoPage).appendTo($(resultTitle));
				let titleResult = $('<div style="float: left; margin-left: 10px; margin-top: -5px;"><h3>รายการเคสหมอตอบรับแล้ว (รอผลอ่าน)</h3></div>');
				$(titleResult).appendTo($(resultTitle));
				$(".mainfull").empty().append($(resultTitle));
				let rqParams = { hospitalId: userdata.hospitalId, userId: userdata.id, statusId: common.casePositiveStatus };
				cases.doLoadCases(rqParams);
			});

			$(document).on('opensuccessstatuscase', async (evt, data)=>{
				let resultTitle = $('<div class="title-content"></div>');
				let logoPage = $('<img src="/images/case-incident-icon.png" width="40px" height="auto" style="float: left;"/>');
				$(logoPage).appendTo($(resultTitle));
				let titleResult = $('<div style="float: left; margin-left: 10px; margin-top: -5px;"><h3>รายการเคสได้ผลอ่านแล้ว</h3></div>');
				$(titleResult).appendTo($(resultTitle));
				$(".mainfull").empty().append($(resultTitle));
				let rqParams = { hospitalId: userdata.hospitalId, userId: userdata.id, statusId: common.caseReadSuccessStatus };
				cases.doLoadCases(rqParams);
			});
			$(document).on('opennegativestatuscase', async (evt, data)=>{
				let resultTitle = $('<div class="title-content"></div>');
				let logoPage = $('<img src="/images/case-incident-icon.png" width="40px" height="auto" style="float: left;"/>');
				$(logoPage).appendTo($(resultTitle));
				let titleResult = $('<div style="float: left; margin-left: 10px; margin-top: -5px;"><h3>รายการเคสไม่สมบูรณ์/รอคำสั่ง</h3></div>');
				$(titleResult).appendTo($(resultTitle));
				$(".mainfull").empty().append($(resultTitle));
				let rqParams = { hospitalId: userdata.hospitalId, userId: userdata.id, statusId: common.caseNegativeStatus };
				cases.doLoadCases(rqParams);
			});
			$(document).on('opensearchcase', async (evt, data)=>{
				$('body').loading('start');
				let toDayFormat = util.getTodayDevFormat();

				let defaultSearchKey = {fromDateKeyValue: toDayFormat, patientNameENKeyValue: '*', patientHNKeyValue: '*', bodypartKeyValue: '*', caseStatusKeyValue: 0};
				let defaultSearchParam = {key: defaultSearchKey, hospitalId: userdata.hospitalId, userId: userdata.id, usertypeId: userdata.usertypeId};

				let searchTitlePage = cases.doCreateSearchTitlePage();

				$(".mainfull").empty().append($(searchTitlePage));
				let response = await common.doCallApi('/api/cases/search/key', defaultSearchParam);
				$('body').loading('stop');
				if (response.status.code === 200) {
					let searchResultViewDiv = $('<div id="SearchResultView"></div>');
					$(".mainfull").append($(searchResultViewDiv));
					await cases.doShowSearchResultCallback(response);
				} else {
					$(".mainfull").append('<h3>ระบบค้นหาเคสขัดข้อง โปรดแจ้งผู้ดูแลระบบ</h3>');
				}
			});

			$(document).on('openreportdesign', (evt, data)=>{
				$('body').loading('start');
				$(".mainfull").empty();
				let reportDesignUrl = '../report-design/index.html?hosid=' + data.hospitalId;
				window.location.replace(reportDesignUrl);
				$('body').loading('stop');
			});

			$(document).on('openscanpartprofile', (evt, data)=>{
				showScanpartAux();
			});

			$(document).on('defualsettingschange', (evt, data)=>{
				doUpdateDefualSeeting(data.key, data.value)
			});

      $(document).on('gotoportal', (evt, data)=>{
        window.location.replace('/portal/index.html');
      });

      $(document).on('newconsult', (evt, data)=>{
        consult.doCreateNewConsultForm();
      });

      $(document).on('myconsult', (evt, data)=>{
        consult.doCreateMyConsultListView();
      });

			doUseFullPage();
			newcase.doLoadDicomFromOrthanc();
      casecounter.doSetupCounter();

      /*
			util.doConnectWebsocketLocal(userdata.username).then((localWsl) => {
				if ((localWsl.readyState == 0) || (localWsl.readyState == 1)) {
		    	wsm = util.doConnectWebsocketMaster(userdata.username, userdata.usertypeId, userdata.hospitalId, 'local');
				} else {
					wsm = util.doConnectWebsocketMaster(userdata.username, userdata.usertypeId, userdata.hospitalId, 'none');
				}
				$('body').loading('stop');
			}).catch ((err) =>{
				console.log(err);
				$('body').loading('stop');
			});
      */
      wsm = util.doConnectWebsocketMaster(userdata.username, userdata.usertypeId, userdata.hospitalId, 'none');
			$('body').loading('stop');
		});
	});
}

function doUseFullPage() {
	$(".row").show();
	$(".mainfull").show();
	$(".mainfull").empty();
}

const doUpdateDefualSeeting = function (key, value){
	let lastDefualt = JSON.parse(localStorage.getItem('defualsettings'));
	if (lastDefualt.hasOwnProperty(key)) {
		lastDefualt[key] = value;
		localStorage.setItem('defualsettings', JSON.stringify(lastDefualt));
	}
}

const showScanpartAux = async function() {
  const userdata = JSON.parse(doGetUserData());
	const deleteCallback = async function(scanpartAuxId) {
		$('body').loading('start');
		let rqParams = {id: scanpartAuxId};
		let scanpartauxRes = await common.doCallApi('/api/scanpartaux/delete', rqParams);
		if (scanpartauxRes.status.code == 200) {
			$.notify("ลบรายการ Scan Part สำเร็จ", "success");
			showScanpartAux();
		} else {
			$.notify("ไม่สามารถลบรายการ Scan Part ได้ในขณะนี้", "error");
		}
		$('body').loading('stop');
	}

	$('body').loading('start');
	let resultTitle = $('<div class="title-content"><h3>รายการ Scan Part ของคุณ</h3></div>');
	$(".mainfull").empty().append($(resultTitle));
	let userId = userdata.id;
	let rqParams = {userId: userId};
	let scanpartauxs = await common.doCallApi('/api/scanpartaux/user/list', rqParams);
	if (scanpartauxs.Records.length > 0) {
		let scanpartAuxBox = await userprofile.showScanpartProfile(scanpartauxs.Records, deleteCallback);
		$(".mainfull").append($(scanpartAuxBox));
	} else {
		$(".mainfull").append($('<h4>ไม่พบรายการ Scan Part ของคุณ</h4>'));
	}
	$('body').loading('stop');
}

const onNewDicomTransferTrigger = function(evt){
  let trigerData = evt.detail.data;
  let dicom = trigerData.dicom;
  console.log(dicom);
}

function doSaveQueryOrthanc(filterData) {
	let queryStr = '{"Level": "Study", "Expand": true, "Query": {"Modality": "' + filterData.dm;
	if (filterData.dd === '*') {
		queryStr += '"}}';
	} else {
		let dDate;
		if (filterData.dd == 1) {
			dDate = util.getToday() + '-';
		} else if (filterData.dd == 3) {
			dDate = util.getDateLastThreeDay() + '-';
		}
		queryStr += '", "StudyDate": "' + dDate + '"}}';
	}
	let newDicomFilter = JSON.parse(queryStr);
	localStorage.setItem('dicomfilter', JSON.stringify(newDicomFilter));
}

function doGetToken(){
	return localStorage.getItem('token');
}

function doGetUserData(){
  return localStorage.getItem('userdata');
}

function doGetUserItemPerPage(){
	let userDefualtSetting = JSON.parse(localStorage.getItem('defualsettings'));
  return userDefualtSetting.itemperpage;
}

function doGetWsm(){
	return wsm;
}

module.exports = {
  doGetToken,
  doGetUserData,
	doGetUserItemPerPage,
	doGetWsm
}
