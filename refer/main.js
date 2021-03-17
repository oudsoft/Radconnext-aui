/* main.js */

window.$ = window.jQuery = require('jquery');
/*****************************/
window.$.ajaxSetup({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
  }
});

$.fn.center = function () {
  this.css("position","absolute");
  this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
  this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +  $(window).scrollLeft()) + "px");
  return this;
}
$.fn.simplelog = function(dataPairObj){
  let logMessages = $('<div style="width: 100%;"></div>');
  let keyTags = Object.getOwnPropertyNames(dataPairObj);
  for (let i=0; i<keyTags.length; i++) {
    let logItem = $('<div style="width: 100%; border: 1px solid grey;"></div>');
    let key = keyTags[i];
    let value = dataPairObj[key]
    let logKey = $('<span>' + key + '</span>');
    $(logKey).css({'color': 'black'});
    let logValue = $('<span>' + JSON.stringify(value) + '</span>');
    $(logValue).css({'color': 'blue'});
    $(logItem).append($(logKey));
    $(logItem).append($('<span> => </span>'));
    $(logItem).append($(logValue));
    $(logMessages).append($(logItem));
  }
  this.append($(logMessages));
  return this;
}

/*****************************/

//require('../case/mod/jquery-ex.js');
const apiconnector = require('../case/mod/apiconnect.js')($);
const util = require('../case/mod/utilmod.js')($);
const common = require('../case/mod/commonlib.js')($);
const userinfo = require('../case/mod/userinfolib.js')($);
const orthanc = require('./mod/orthanc.js')($);

/*
ต
*/

//const isMobile = util.isMobileDeviceCheck();
const isMobile = false;

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

/*
function doCallLoginApi(user) {
  return new Promise(function(resolve, reject) {
    var loginApiUri = '/api/login/';
    var params = user;
    $.post(loginApiUri, params, function(response){
			resolve(response);
		}).catch((err) => {
			console.log(err);
			reject(err);
		})
	});
}

function doLogin(){
	var username = $("#username").val();
	var password = $("#password").val();
	if( username == '' || password == ''){
		$('input[type="text"],input[type="password"]').css("border","2px solid red");
		$('input[type="text"],input[type="password"]').css("box-shadow","0 0 3px red");
		$('#login-msg').html('<p>Please fill all fields...!!!!!!</p>');
		$('#login-msg').show();
	} else {
    $('#login-msg').hide();
		let user = {username: username, password: password};
		doCallLoginApi(user).then((response) => {
			if (response.success == false) {
				$('input[type="text"]').css({"border":"2px solid red","box-shadow":"0 0 3px red"});
				$('input[type="password"]').css({"border":"2px solid #00F5FF","box-shadow":"0 0 5px #00F5FF"});
				$('#login-msg').html('<p>Username or Password incorrect. Please try with other username and password again.</p>');
				$('#login-msg').show();
			} else {
				//Save resBody to localStorage
        $('#login-msg').hide();
				const defualtDicomFilter = {"Level": "Study", "Expand": true, "Query": {"Modality": "*"}, "Limit": 30};
				const defualtSettings = {"itemperpage" : "20"}
        localStorage.setItem('token', response.token);
        localStorage.setItem('userdata', JSON.stringify(response.data));
				localStorage.setItem('dicomfilter', JSON.stringify(defualtDicomFilter));
				localStorage.setItem('defualsettings', JSON.stringify(defualtSettings));
				doLoadMainPage();
			}
		});
	}
}

function doLoadLogin() {
	$('#app').load('form/login.html', function(){
		$(".container").css({"min-height": "100%"});
		$(".main").center();
		$("#login-cmd").click(function(){
			doLogin();
		});
    $("#password").on('keypress',function(e) {
      if(e.which == 13) {
        doLogin();
      };
    });
	});
}
*/

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
  //localStorage.removeItem('localmessage');
	/*
		jquery loading api
		https://carlosbonetti.github.io/jquery-loading/
	*/
  let jqueryUiCssUrl = "../lib/jquery-ui.min.css";
	let jqueryUiJsUrl = "../lib/jquery-ui.min.js";
	let jqueryLoadingUrl = '../lib/jquery.loading.min.js';
	let jqueryNotifyUrl = '../lib/notify.min.js';
	let controlPagePlugin = "../setting/plugin/jquery-controlpage-plugin.js"
  let patientHistoryPluginUrl = "../setting/plugin/jquery-patient-history-image-plugin.js";
	let scanpartPluginUrl = "../setting/plugin/jquery-scanpart-plugin.js";
	let customUrgentPlugin = "../setting/plugin/jquery-custom-urgent-plugin.js";
  let customSelectPlugin = "../setting/plugin/jquery-custom-select-plugin.js";
  let chatBoxPlugin = "../setting/plugin/jquery-chatbox-plugin.js";
  let utilityPlugin = "../setting/plugin/jquery-radutil-plugin.js";

	$('head').append('<script src="' + jqueryUiJsUrl + '"></script>');
	$('head').append('<link rel="stylesheet" href="' + jqueryUiCssUrl + '" type="text/css" />');
	//https://carlosbonetti.github.io/jquery-loading/
	$('head').append('<script src="' + jqueryLoadingUrl + '"></script>');
	//https://notifyjs.jpillora.com/
	$('head').append('<script src="' + jqueryNotifyUrl + '"></script>');

	$('head').append('<script src="' + controlPagePlugin + '"></script>');
  $('head').append('<script src="' + patientHistoryPluginUrl + '"></script>');
	$('head').append('<script src="' + scanpartPluginUrl + '"></script>');
	$('head').append('<script src="' + customUrgentPlugin + '"></script>');
  $('head').append('<script src="' + customSelectPlugin + '"></script>');
  $('head').append('<script src="' + chatBoxPlugin + '"></script>');
  $('head').append('<script src="' + utilityPlugin + '"></script>');

  $('head').append('<link rel="stylesheet" href="../lib/tui-image-editor.min.css" type="text/css" />');
	$('head').append('<link rel="stylesheet" href="../lib/tui-color-picker.css" type="text/css" />');
  $('head').append('<link rel="stylesheet" href="../lib/print/print.min.css" type="text/css" />');
  $('head').append('<link rel="stylesheet" href="../case/css/scanpart.css" type="text/css" />');

  $('body').append($('<div id="overlay"><div class="loader"></div></div>'));

  $('body').loading({overlay: $("#overlay"), stoppable: true});

	$('body').on('loading.start', function(event, loadingObj) {
	  //console.log('=== loading show ===');
	});

	$('body').on('loading.stop', function(event, loadingObj) {
	  //console.log('=== loading hide ===');
	});

  let userdata = JSON.parse(doGetUserData());
	console.log(userdata);
  //localStorage.removeItem('localmessage');

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
				orthanc.doLoadDicomFromOrthanc();
			});

      /*
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
      */
      /*
			$(document).on('openacceptedstatuscase', async (evt, data)=>{
				let resultTitle = $('<div class="title-content"></div>');
				let logoPage = $('<img src="/images/case-incident-icon.png" width="40px" height="auto" style="float: left;"/>');
				$(logoPage).appendTo($(resultTitle));
				let titleResult = $('<div style="float: left; margin-left: 10px; margin-top: -5px;"><h3>รายการเคสหมอตอบรับแล้ว (รอผลอ่าน)</h3></div>');
				$(titleResult).appendTo($(resultTitle));
				$(".mainfull").empty().append($(resultTitle));
				let rqParams = { hospitalId: userdata.hospitalId, userId: userdata.id, statusId: common.caseResultWaitStatus };
				cases.doLoadCases(rqParams);
			});
      */
      /*
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
      */
      /*
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
      */
      /*
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
      */
      /*
			$(document).on('openreportdesign', (evt, data)=>{
				$('body').loading('start');
				$(".mainfull").empty();
				let reportDesignUrl = '../report-design/index.html?hosid=' + data.hospitalId;
				window.location.replace(reportDesignUrl);
				$('body').loading('stop');
			});
      */
      /*
			$(document).on('openscanpartprofile', (evt, data)=>{
				showScanpartAux();
			});
      */
			$(document).on('defualsettingschange', (evt, data)=>{
				doUpdateDefualSeeting(data.key, data.value)
			});

			doUseFullPage();
			orthanc.doLoadDicomFromOrthanc();

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

/*
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
*/

function doSaveQueryOrthanc(filterData) {
	let queryStr = undefined;
  if (filterData.dd === '**') {
    queryStr = '{"Level": "Study", "Expand": true, "Query": {"Modality": "' + filterData.dm;
    dDate = '-' + util.getToday();
    queryStr += '", "StudyDate": "' + dDate + '"}, "Limit": 20}';
	} else if (filterData.dd === '*') {
    queryStr = '{"Level": "Study", "Expand": true, "Query": {"Modality": "' + filterData.dm;
		queryStr += '"}}';
	} else {
    queryStr = '{"Level": "Study", "Expand": true, "Query": {"Modality": "' + filterData.dm;
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
