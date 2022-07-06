/* main.js */

window.$ = window.jQuery = require('jquery');

const util = require('../../case/mod/utilmod.js')($);
const common = require('../../case/mod/commonlib.js')($);

const userinfo = require('../../case/mod/userinfolib.js')($);
const userprofile = require('../../case/mod/userprofilelib.js')($);
const casecounter = require('../../case/mod/casecounter.js')($);
const softphone = require('../../case/mod/softphonelib.js')($);
const masternotify = require('../../case/mod/master-notify.js')($);
const urgentstd = require('../../case/mod/urgentstd.js')($);
const consult = require('../../case/mod/consult.js')($);
const portal = require('../../case/mod/portal-lib.js')($);

var wsm, sipUA;

$( document ).ready(function() {
  const initPage = function() {
    let logged = sessionStorage.getItem('logged');
    if (logged) {
  		var token = localStorage.getItem('token');
  		if (token !== 'undefined') {
        let userdata = localStorage.getItem('userdata');
        if (userdata !== 'undefined') {
          userdata = JSON.parse(userdata);
          console.log(userdata);
          if (userdata.usertypeId == 2) {
			       doLoadMainPage();
             wsm = util.doConnectWebsocketMaster(userdata.username, userdata.usertypeId, userdata.hospitalId, 'none');
             doCreateRegisterVoIP(userdata);
           } else {
             doNotAllowAccessPage();
           }
        } else {
          doLoadLogin();
        }
  		} else {
  			doLoadLogin()
  		}
    } else {
      doLoadLogin();
    }
	};

  let jqueryUiCssUrl = "https://radconnext.info/lib/jquery-ui.min.css";
  let jqueryUiJsUrl = "https://radconnext.info/lib/jquery-ui.min.js";
  let jqueryLoadingUrl = 'https://radconnext.info/lib/jquery.loading.min.js';
  let jqueryNotifyUrl = 'https://radconnext.info/lib/notify.min.js';
  let jssipUrl = "https://radconnext.info/lib/jssip-3.9.0.min.js";
  let sipPhonePlugin = "https://radconnext.info/setting/plugin/jquery-sipphone-income-plugin.js";
  let radUtilityPlugin = "https://radconnext.info/setting/plugin/jquery-radutil-plugin.js";

  $('head').append('<script src="' + jqueryUiJsUrl + '"></script>');
  $('head').append('<link rel="stylesheet" href="' + jqueryUiCssUrl + '" type="text/css" />');
  //https://carlosbonetti.github.io/jquery-loading/
  $('head').append('<script src="' + jqueryLoadingUrl + '"></script>');
  //https://notifyjs.jpillora.com/
  $('head').append('<script src="' + jqueryNotifyUrl + '"></script>');

  $('head').append('<script src="' + jssipUrl + '"></script>');

  $('head').append('<script src="' + sipPhonePlugin + '"></script>');

  $('head').append('<script src="' + radUtilityPlugin + '"></script>');
  setTimeout(()=>{
	   initPage();
  }, 800);
});

const doLoadLogin = function(){
  common.doUserLogout(wsm);
}

const doCreateRegisterVoIP = function(userdata){
  if (userdata.userinfo.User_SipPhone){
     let sipPhoneNumber = userdata.userinfo.User_SipPhone;
     let sipPhoneSecret = userdata.userinfo.User_SipSecret;
     sipUA = softphone.doRegisterSoftphone(sipPhoneNumber, sipPhoneSecret);

     sipUA.start();
     let sipPhoneOptions = {onRejectCallCallback: softphone.doRejectCall, onAcceptCallCallback: softphone.doAcceptCall, onEndCallCallback: softphone.doEndCall};
     let mySipPhoneIncomeBox = $('<div id="SipPhoneIncomeBox" tabindex="1"></div>');
     $(mySipPhoneIncomeBox).css({'position': 'absolute', 'width': '98%', 'min-height': '50px;', 'max-height': '50px', 'background-color': '#fefefe', 'padding': '5px', 'border': '1px solid #888',  'z-index': '192', 'top': '-65px'});
     let mySipPhone = $(mySipPhoneIncomeBox).sipphoneincome(sipPhoneOptions);
     $('body').append($(mySipPhoneIncomeBox));
  }
}

const doNotAllowAccessPage = function(){
  const contentBox = $('<div></div>');
  $(contentBox).append($('<p>บัญชีใช้งานของคุณไม่สามารถเข้าใช้งานหน้านี้ได้</p>'));
  $(contentBox).append($('<p>โปรด Login ใหม่อีกครั้งเพื่อเปลี่ยนบัญชีใช้งานให้ถูกต้อง</p>'));
  const radalertoption = {
    title: 'ข้อมูลผู้ใช้งานไม่ถูกต้อง',
    msg: $(contentBox),
    width: '410px',
    onOk: function(evt) {
      radAlertBox.closeAlert();
      doLoadLogin();
    }
  }
  let radAlertBox = $('body').radalert(radalertoption);
  $(radAlertBox.cancelCmd).hide();
}

const doLoadMainPage = function(){
  let printjs = 'https://radconnext.info/lib/print/print.min.js';
  let excelexportjs = 'https://radconnext.info/lib/excel/excelexportjs.js';
  let jquerySimpleUploadUrl = 'https://radconnext.info/lib/simpleUpload.min.js';
  let patientHistoryPluginUrl = "https://radconnext.info/setting/plugin/jquery-patient-history-image-plugin.js";
	let countdownclockPluginUrl = "https://radconnext.info/setting/plugin/jquery-countdown-clock-plugin.js";
	let scanpartPluginUrl = "https://radconnext.info/setting/plugin/jquery-scanpart-plugin.js";
	let customUrgentPlugin = "https://radconnext.info/setting/plugin/jquery-custom-urgent-plugin.js";
	let controlPagePlugin = "https://radconnext.info/setting/plugin/jquery-controlpage-plugin.js"
  let customSelectPlugin = "https://radconnext.info/setting/plugin/jquery-custom-select-plugin.js";
  let chatBoxPlugin = "https://radconnext.info/setting/plugin/jquery-chatbox-plugin.js";
  let readystatePlugin = "https://radconnext.info/setting/plugin/jqury-readystate-plugin.js";

  $('head').append('<script src="' + printjs + '"></script>');
  $('head').append('<script src="' + excelexportjs + '"></script>');
  $('head').append('<script src="' + jquerySimpleUploadUrl + '"></script>');

  $('head').append('<script src="' + patientHistoryPluginUrl + '"></script>');
  $('head').append('<script src="' + countdownclockPluginUrl + '"></script>');
  $('head').append('<script src="' + scanpartPluginUrl + '"></script>');
  $('head').append('<script src="' + customUrgentPlugin + '"></script>');
  $('head').append('<script src="' + controlPagePlugin + '"></script>');
  $('head').append('<script src="' + customSelectPlugin + '"></script>');
  $('head').append('<script src="' + chatBoxPlugin + '"></script>');
  $('head').append('<script src="' + readystatePlugin + '"></script>');

  $('head').append('<link rel="stylesheet" href="https://radconnext.info/lib/tui-image-editor.min.css" type="text/css" />');
	$('head').append('<link rel="stylesheet" href="https://radconnext.info/lib/tui-color-picker.css" type="text/css" />');
  $('head').append('<link rel="stylesheet" href="https://radconnext.info/lib/print/print.min.css" type="text/css" />');
	$('head').append('<link rel="stylesheet" href="https://radconnext.info/case/css/scanpart.css" type="text/css" />');
  $('head').append('<link rel="stylesheet" href="https://radconnext.info/case/css/custom-select.css" type="text/css" />');

  $('body').append($('<div id="overlay"><div class="loader"></div></div>'));

  $('body').loading({overlay: $("#overlay"), stoppable: true});

  $('head').append('<link rel="stylesheet" href="https://radconnext.info/stylesheets/style.css" type="text/css" />');
  $('head').append('<link rel="stylesheet" href="https://radconnext.info/case/css/style.css" type="text/css" />');
  $('head').append('<link rel="stylesheet" href="https://radconnext.info/case/css/main-fix.css" type="text/css" />');
  $('head').append('<link rel="stylesheet" href="https://radconnext.info/case/css/menu-fix.css" type="text/css" />');

  let mainFile= '../form/main-fix.html';
  let menuFile = '../form/menu-fix.html';

  $('#app').load(mainFile, function(){
    $('#Menu').load(menuFile, function(){

      $(document).on('openedituserinfo', (evt, data)=>{
				userinfo.doShowUserProfile();
			});
			$(document).on('userlogout', (evt, data)=>{
				common.doUserLogout(wsm);
			});

      $(document).on('gotoportal', (evt, data)=>{
        portal.doShowPortal();
      });

      $(document).on('newconsult', (evt, data)=>{
        consult.doCreateNewConsultForm();
      });

      $(document).on('myconsult', (evt, data)=>{
        consult.doCreateMyConsultListView();
      });

      $(document).on('stdurgentconfig', (evt, data)=>{
        urgentstd.doLoadMyStdUrgentListView();
      });

      $(document).on('openscanpartprofile', (evt, data)=>{
				showScanpartAux();
			});

      doAddNotifyCustomStyle();

      doInitDefualPage();

    });
  });
}

const doInitDefualPage = function(){
  $('body').loading('start');
  casecounter.doSetupCounter().then(async(loadRes)=>{
    actionAfterSetupCounter();
    $('.mainfull').attr('tabindex', 1);
    $('.mainfull').on('keydown', async (evt)=>{
      if (event.ctrlKey && event.key === 'Z') {
        let masterNotifyView = $('.mainfull').find('#MasterNotifyView');
        if ($(masterNotifyView).length > 0) {
          $(masterNotifyView).remove();
        } else {
          masterNotifyView = await masternotify.doShowMessage(userdata.id);
          $('.mainfull').append($(masterNotifyView));
        }
      }
    });
    $('body').loading('stop');
  });
}

const doTriggerLoadDicom = function(){
  let queryString = localStorage.getItem('dicomfilter');
  let query = JSON.parse(queryString);
  let modality = query.Query.Modality;
  if (modality !== '*') {
    $('#HomeMainCmd').next('.NavSubHide').find('.MenuCmd').each((i, cmd) => {
      let cmdModality = $(cmd).data('dm');
      if (cmdModality == modality) {
        $(cmd).click();
      }
    });
  }
}

const actionAfterSetupCounter = function(){
  $('#HomeMainCmd').click();
  doTriggerLoadDicom();
}

const showScanpartAux = async function() {
  const userdata = JSON.parse(localStorage.getItem('userdata'));
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

  let pageLogo = $('<img src="/images/urgent-icon.png" width="40px" height="auto" style="position: relative; display: inline-block; top: 10px;"/>');
  let titleText = $('<div style="position: relative; display: inline-block; margin-left: 10px;"><h3>รายการ Scan Part ของฉัน</h3></div>');
  let titleBox = $('<div></div>').append($(pageLogo)).append($(titleText));
  $("#TitleContent").empty().append($(titleBox));

	let userId = userdata.id;
	let rqParams = {userId: userId};
	let scanpartauxs = await common.doCallApi('/api/scanpartaux/user/list', rqParams);
	if (scanpartauxs.Records.length > 0) {
		let scanpartAuxBox = await userprofile.showScanpartProfile(scanpartauxs.Records, deleteCallback);
		$(".mainfull").empty().append($(scanpartAuxBox));
	} else {
		$(".mainfull").append($('<h4>ไม่พบรายการ Scan Part ของคุณ</h4>'));
	}
	$('body').loading('stop');
}

const doAddNotifyCustomStyle = function(){
  $.notify.addStyle('myshopman', {
    html: "<div class='superblue'><span data-notify-html/></div>",
    classes: {
      base: {
        "border": "3px solid white",
        "border-radius": "20px",
        "color": "white",
        "background-color": "#184175",
        "padding": "10px"
      },
      green: {
        "border": "3px solid white",
        "border-radius": "20px",
        "color": "white",
        "background-color": "green",
        "padding": "10px"
      },
      red: {
        "border": "3px solid white",
        "border-radius": "20px",
        "color": "white",
        "background-color": "red",
        "padding": "10px"
      }
    }
  });
}
