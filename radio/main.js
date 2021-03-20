/* main.js */

window.$ = window.jQuery = require('jquery');

/*****************************/
window.$.ajaxSetup({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
  }
});

window.$.fn.center = function () {
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
    let logValue = $('<span>' + value + '</span>');
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

var noti, wsm;

const util = require('../case/mod/utilmod.js')($);
const common = require('../case/mod/commonlib.js')($);
const userinfo = require('../case/mod/userinfolib.js')($);
const userprofile = require('../case/mod/userprofilelib.js')($);
const apiconnector = require('../case/mod/apiconnect.js')($);
const welcome = require('./mod/welcomelib.js')($);
const newcase = require('./mod/newcaselib.js')($);
const acccase = require('./mod/acccaselib.js')($);
const searchcase = require('./mod/searchcaselib.js')($);
const opencase = require('./mod/opencase.js')($);
const template = require('./mod/templatelib.js')($);
const profile = require('./mod/profilelib.js')($);

const modalLockScreeStyle = { 'position': 'fixed', 'z-index': '13', 'left': '0', 'top': '0', 'width': '100%', 'height': '100%', 'overflow': 'auto', 'background-color': '#ccc'};

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

function doCallLoginApi(user) {
  return new Promise(function(resolve, reject) {
    var loginApiUri = '/api/login/';
    var params = user;
    $.post(loginApiUri, params, function(response){
			resolve(response);
		}).catch((err) => {
			console.log(JSON.stringify(err));
      reject(err);
		})
	});
}

function doLoadRadioConfigApi(userId) {
  return new Promise(function(resolve, reject) {
    var loadOriginUrl = '/api/radiologist/load/config/' + userId;
    var params = {userId};
    $.post(loadOriginUrl, params, function(response){
			resolve(response);
		}).catch((err) => {
			console.log(JSON.stringify(err));
      reject(err);
		})
  });
}

function doUserLogout() {
  const userdata = JSON.parse(localStorage.getItem('userdata'));
  if (wsm) {
    wsm.send(JSON.stringify({type: 'logout', username: userdata.username}));
  }
  localStorage.removeItem('token');
	localStorage.removeItem('userdata');
  localStorage.removeItem('userconfigs');
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
  let html2textlib = '../lib/to-asciidoc.js';

	let countdownclockPluginUrl = "../setting/plugin/jquery-countdown-clock-plugin.js";
	let controlPagePlugin = "../setting/plugin/jquery-controlpage-plugin.js"
  let readystatePlugin = "../setting/plugin/jqury-readystate-plugin.js"
  let chatBoxPlugin = "../setting/plugin/jquery-chatbox-plugin.js";

	$('head').append('<script src="' + jqueryUiJsUrl + '"></script>');
	$('head').append('<link rel="stylesheet" href="' + jqueryUiCssUrl + '" type="text/css" />');
	//https://carlosbonetti.github.io/jquery-loading/
	$('head').append('<script src="' + jqueryLoadingUrl + '"></script>');
	//https://notifyjs.jpillora.com/
	$('head').append('<script src="' + jqueryNotifyUrl + '"></script>');

  $('head').append('<script src="' + html2textlib + '"></script>');

	$('head').append('<script src="' + countdownclockPluginUrl + '"></script>');
	$('head').append('<script src="' + controlPagePlugin + '"></script>');
  $('head').append('<script src="' + readystatePlugin + '"></script>');
  $('head').append('<script src="' + chatBoxPlugin + '"></script>');

  $('head').append('<link rel="stylesheet" href="../case/css/scanpart.css" type="text/css" />');
  $('body').append($('<div id="overlay"><div class="loader"></div></div>'));

  $('body').loading({overlay: $("#overlay"), stoppable: true});

	$('body').on('loading.start', function(event, loadingObj) {
	  //console.log('=== loading show ===');
	});

	$('body').on('loading.stop', function(event, loadingObj) {
	  //console.log('=== loading hide ===');
	});

  document.addEventListener("triggercounter", welcome.onCaseChangeStatusTrigger);
  document.addEventListener("callzoominterrupt", welcome.doInterruptZoomCallEvt);
  document.addEventListener("lockscreen", onLockScreenTrigger);
  document.addEventListener("unlockscreen", onUnLockScreenTrigger);
  document.addEventListener("updateuserprofile", onUpdateUserProfileTrigger);

  let userdata = JSON.parse(doGetUserData());
  console.log(userdata);
  //localStorage.removeItem('localmessage');
  //let radioConfigs = JSON.parse(doGetUserConfigs());
  //console.log(radioConfigs);

	$('#app').load('form/main.html', function(){
		$('#Menu').load('form/menu.html', function(){
      $(document).on('openedituserinfo', (evt, data)=>{
				userinfo.doShowUserProfile();
        util.doResetPingCounter();
			});
			$(document).on('userlogout', (evt, data)=>{
				doUserLogout();
			});
			$(document).on('openhome', (evt, data)=>{
        doLoadDefualtPage();
        util.doResetPingCounter();
			});
      $(document).on('opennewstatuscase', async (evt, data)=>{
        let newcaseTitlePage = newcase.doCreateNewCaseTitlePage();
        $(".mainfull").empty().append($(newcaseTitlePage));
        let newcasePage = await newcase.doCreateNewCasePage();
        $(".mainfull").append($(newcasePage));
        util.doResetPingCounter();
      });
      $(document).on('openacceptedstatuscase', async (evt, data)=>{
        let acccaseTitlePage = acccase.doCreateAccCaseTitlePage();
        $(".mainfull").empty().append($(acccaseTitlePage));
        let acccasePage = await acccase.doCreateAccCasePage();
        $(".mainfull").append($(acccasePage));
        util.doResetPingCounter();
      });
      $(document).on('opensearchcase', async (evt, data)=>{
        $('body').loading('start');
        let toDayFormat = util.getYesterdayDevFormat();

        let defaultSearchKey = {fromDateKeyValue: toDayFormat, patientNameENKeyValue: '*', patientHNKeyValue: '*', bodypartKeyValue: '*', caseStatusKeyValue: 0};
        let defaultSearchParam = {key: defaultSearchKey, hospitalId: userdata.hospitalId, userId: userdata.id, usertypeId: userdata.usertypeId};

        let searchTitlePage = searchcase.doCreateSearchTitlePage();

        $(".mainfull").empty().append($(searchTitlePage));

        let response = await common.doCallApi('/api/cases/search/key', defaultSearchParam);

        $('body').loading('stop');

        if (response.status.code === 200) {
          let searchResultViewDiv = $('<div id="SearchResultView"></div>');
          $(".mainfull").append($(searchResultViewDiv));
          await searchcase.doShowSearchResultCallback(response);
        } else {
          $(".mainfull").append('<h3>ระบบค้นหาเคสขัดข้อง โปรดแจ้งผู้ดูแลระบบ</h3>');
        }
        util.doResetPingCounter();
      });
      $(document).on('opencase', async (evt, data)=>{
        let opencaseTitlePage = acccase.doCreateAccCaseTitlePage();
        $(".mainfull").empty().append($(opencaseTitlePage));
        let opencasePage = await opencase.doCreateOpenCasePage(data.caseId);
        $(".mainfull").append($(opencasePage));
        util.doResetPingCounter();
      });
      $(document).on('openprofile', async (evt, data)=>{
        let profileTitlePage = profile.doCreateProfileTitlePage();
        $(".mainfull").empty().append($(profileTitlePage));
        let profilePage = await profile.doCreateProfilePage();
        $(".mainfull").append($(profilePage));
      });
      $(document).on('opentemplatedesign', async (evt, data)=>{
        let templateTitlePage = template.doCreateTemplateTitlePage();
        $(".mainfull").empty().append($(templateTitlePage));
        let templatePage = await template.doCreateTemplatePage();
        $(".mainfull").append($(templatePage));
      });
      $(document).on('defualsettingschange', (evt, data)=>{
				doUpdateDefualSeeting(data.key, data.value);
        util.doResetPingCounter();
			});

			doUseFullPage();
			doLoadDefualtPage();;

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

function doLoadDefualtPage() {
  let homeTitlePage = welcome.doCreateHomeTitlePage();
  $(".mainfull").empty().append($(homeTitlePage));
  welcome.doSetupCounter();
}

const doUpdateDefualSeeting = function (key, value){
	let lastDefualt = JSON.parse(localStorage.getItem('defualsettings'));
	if (lastDefualt.hasOwnProperty(key)) {
		lastDefualt[key] = value;
		localStorage.setItem('defualsettings', JSON.stringify(lastDefualt));
	}
}

function doCreatePasswordUnlockScreen(unlockActionCallback){
  let passwordUnlockBox = $('<div style="position: relative; width: 100%;"></div>');
  let passwordInputbox = $('<div style="width: 100%;"></div>');
  $(passwordInputbox).appendTo($(passwordUnlockBox));
  let yourPassword = $('<input type="password"/>');
  $(passwordInputbox).append($('<span>ป้อนรหัสผ่านของคุณ:&nbsp;&nbsp;</span>'));
  $(passwordInputbox).append($(yourPassword));

  let cmdBar = $('<div style="width: 100%; margin-top: 10px;"></div>');
  $(cmdBar).appendTo($(passwordUnlockBox));
  let unlockCmd = $('<input type="button" value=" ปลดล็อค "/>');
  $(unlockCmd).appendTo($(cmdBar));
  $(unlockCmd).on('click', (evt)=>{
    if($(yourPassword).val() !== '') {
      $(yourPassword).css('border', '');
      unlockActionCallback($(yourPassword).val());
    } else {
      $(yourPassword).css('border', '1px solid red');
      $.notify("คุณยังไม่ได้ป้อนรหัสผ่าน", "error");
    }
  });
  $(yourPassword).on('keypress', (evt)=>{
    if(evt.which == 13) {
      if($(yourPassword).val() !== '') {
        $(yourPassword).css('border', '');
        unlockActionCallback($(yourPassword).val());
      } else {
        $(yourPassword).css('border', '1px solid red');
        $.notify("คุณยังไม่ได้ป้อนรหัสผ่าน", "error");
      }
    }
  });

  return $(passwordUnlockBox);
}

const resetScreen = function(){
  $('#quickreply').empty();
  $('#quickreply').removeAttr('style');
  util.doSetScreenState(0);
  util.doResetPingCounter();
}

function unlockAction(modalBox) {
  const userdata = JSON.parse(doGetUserData());

  const unlockCallbackAction = function(yourPassword){
    let user = {username: userdata.username, password: yourPassword};
		doCallLoginApi(user).then((response) => {
			if (response.success == true) {
        $.notify("ปลดล็อคสำเร็จ", "success");
        resetScreen();
      } else {
        $.notify("รหัสผ่านของคุณไม่ถูกต้อง", "error");
      }
    });
  }

  if (userdata.userprofiles[0].Profile.screen.unlock == 1) {
    $(modalBox).empty();
    let passwordBox = doCreatePasswordUnlockScreen( unlockCallbackAction );
    $(modalBox).append($(passwordBox));
    $(modalBox).css({ height: 'auto'});
  } else {
    resetScreen();
  }
}

function onLockScreenTrigger() {
  let lockScreenBox = $('<div style="width: 100%; text-align: center;" tabindex="0"></div>');
  $(lockScreenBox).append('<h2>This Lock Screen for Safety Your Content.</h2>');
  $(lockScreenBox).append('<h3>You can Unlock by Click mouse or press any key.</h3>');
  $(lockScreenBox).css(opencase.quickReplyContentStyle);
  $('#quickreply').empty().append($(lockScreenBox));
  $('#quickreply').attr('tabindex', 0);
  $('#quickreply').focus();
  $('#quickreply').css(modalLockScreeStyle);
  util.doSetScreenState(1);
  /*
  $('#quickreply').on('mousemove', (evt)=>{
    $('#quickreply').attr('onmousemove', '').unbind("mousemove");
    unlockAction(lockScreenBox);
  });
  */
  $('#quickreply').on('click', (evt)=>{
    $('#quickreply').attr('onclick', '').unbind("click");
    unlockAction(lockScreenBox);
  });
  $('#quickreply').on('keypress', (evt)=>{
    $('#quickreply').attr('onkeypress', '').unbind("keypress");
    unlockAction(lockScreenBox);
  });
}

function onUnLockScreenTrigger(evt){
  resetScreen();
  util.doSetScreenState(0);
}

function onUpdateUserProfileTrigger(evt){
  let newProfile = evt.detail.data.Profile;
  let newReadyState = newProfile.readyState;

  const userdata = JSON.parse(localStorage.getItem('userdata'));
  userdata.userprofiles[0].Profile.readyState = newReadyState;
  userdata.userprofiles[0].Profile.readyBy = 'bot';
  localStorage.setItem('userdata', JSON.stringify(userdata));

  let readyLogic = undefined;
  if (newReadyState == 1) {
    readyLogic = true;
  } else {
    readyLogic = false;
  }
  $('#app').find('#ReadyState').find('input[type="checkbox"]').prop('checked', readyLogic);
}

function doGetToken(){
	return localStorage.getItem('token');
}

function doGetUserData(){
  return localStorage.getItem('userdata');
}

function doGetUserConfigs(){
  return localStorage.getItem('userconfigs');
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
  doGetUserConfigs,
	doGetUserItemPerPage,
	doGetWsm
}
