/* main.js */
//const $ = require('jquery');
window.$ = window.jQuery = require('jquery');
//require('jquery-ui-browserify');
//$.mobile = require('jquery-mobile');
require('./lib/jquery.cookie.js');
require('./mod/jquery-ex.js');
const home = require('./mod/home.js')($);
const cases = require('./mod/case.js')($);
const doctor = require('./mod/doctor.js')($);
const hospital = require('./mod/hospital.js')($);
const urgent = require('./mod/urgent.js')($);
const apiconnector = require('./mod/apiconnect.js')($);

/*
ต
*/

window.jQuery.cachedScript = function( url, options ) {
  // Allow user to set any option except for dataType, cache, and url
  options = $.extend( options || {}, {
    dataType: "script",
    cache: true,
    url: url
  });

  // Use $.ajax() since it is more flexible than $.getScript
  // Return the jqXHR object so we can chain callbacks
  return jQuery.ajax( options );
};

window.jQuery.postCORS = function(url, data, func) {
  if(func == undefined) func = function(){};
    return $.ajax({
      type: 'POST',
      url: url,
      data: data,
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded',
      xhrFields: { withCredentials: true },
      success: function(res) { func(res) },
      error: function(err) { func({err})
    }
  });
};

const cookieName = "readconnext";

var cookie, upwd, noti, wsm, wsl;

$( document ).ready(function() {
	console.log('page on ready ...');
	const initPage = function() {
		var cookieValue = $.cookie(cookieName);
		if (cookieValue) {
			cookie = JSON.parse(cookieValue);
			if (cookie) {
				if ((cookie.id) && (cookie.username)) {
					doLoadMainPage()
				} else {
					doLoadLogin()
				}
			} else {
				doLoadLogin()
			}
		} else {
			doLoadLogin()
		}
	};

	const doLoadServiceworker = function() {
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', function() {
				const MAXAGE = 10; // seconds until recheck
				const HASH = Math.floor(Date.now() / (MAXAGE * 1000)); // or a hash of lib.js
				const URL = `/sw.js?hash=${HASH}`;
				navigator.serviceWorker.register('sw.js?hash=' + HASH).then( async reg => {
					console.log(`Registration:`, reg);
					if (reg) {
						noti = require('./mod/notimod.js')(reg);
						noti.triggerPush();
					}
				});
				navigator.serviceWorker.addEventListener('message', function(event) {
					console.log("Got reply from service worker: " + event.data);
				});
			});
		} else {
			console.error('Service workers are not supported in this browser');
		}
	}
	/*
		Service Worker on https <type of sign self> of localhost, it 'll ssl's error massage
		DOMException: Failed to register a ServiceWorker for scope ('https://192.168.1.108:8443/webapp/') with script ('https://192.168.1.108:8443/webapp/sw.js?hash=159800668'): An SSL certificate error occurred when fetching the script.
	*/
	//doLoadServiceworker();
	initPage();

});

function doCallLoginApi(user) {
	return new Promise(function(resolve, reject) {
    /*
		const loginApiName = 'chk_login'
		const body = { username: user.username, password: user.password };
		var realUrl = apiconnector.hostURL + '/' + loginApiName + apiconnector.apiExt;
		var params = {method: 'post', body: body, url: realUrl, apiname: loginApiName};
		apiconnector.doCallApiByProxy(loginApiName, params).then((response) => {
		*/
    var loginApiUri = '/api/login/';
    var params = user;
    apiconnector.doCallApi(loginApiUri, params).then((response) => {
			resolve(response);
		}).catch((err) => {
			console.log(JSON.stringify(err));
		})
	});
}

function doLogin(){
	var username = $("#username").val();
	var password = $("#password").val();
	// Checking for blank fields.
	if( username == '' || password == ''){
		$('input[type="text"],input[type="password"]').css("border","2px solid red");
		$('input[type="text"],input[type="password"]').css("box-shadow","0 0 3px red");
		$('#login-msg').html('<p>Please fill all fields...!!!!!!</p>');
		$('#login-msg').show();
	} else {
    $('#login-msg').hide();
		let user = {username: username, password: password};
		console.log(user);
		doCallLoginApi(user).then((response) => {
			// var resBody = JSON.parse(response.res.body); <= ใช้ในกรณีเรียก API แบบ By Proxy
			//var resBody = JSON.parse(response); <= ใช้ในกรณีเรียก API แบบ Direct

			if (response.success == false) {
				$('input[type="text"]').css({"border":"2px solid red","box-shadow":"0 0 3px red"});
				$('input[type="password"]').css({"border":"2px solid #00F5FF","box-shadow":"0 0 5px #00F5FF"});
				$('#login-msg').html('<p>Username or Password incorrect. Please try with other username and password again.</p>');
				$('#login-msg').show();
			} else {
				//Save resBody to cookie.
        $('#login-msg').show();        
				$.cookie(cookieName, JSON.stringify(resBody), { expires : 1 });
				upwd = password;
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

function doUserLogout() {
	const logoutApiName = 'logout'
	const body = {username: cookie.username};

	var realUrl = apiconnector.hostURL + '/' + logoutApiName + apiconnector.apiExt;
	var params = {method: 'post', body: body, url: realUrl, apiname: logoutApiName};
	apiconnector.doCallApiByProxy(logoutApiName, params).then((response) => {
		if (response.status.code == 200) {
			$.removeCookie(cookieName);
			doLoadLogin();
		}
	}).catch((err) => {
		console.log(JSON.stringify(err));
		alert('Error form Api with message:\n' + JSON.stringify(err));
	})
	/*
	var params = JSON.stringify(body);
	doCallApiDirect(logoutApiName, params)=> {
		resolve(response);
	}).catch((err) => {
		console.log(JSON.stringify(err));
	})
	*/
}

function doLoadMainPage(){
	let paths = window.location.pathname.split('/');
	let rootname = paths[1];
	let jqueryUiCssUrl = "/" + rootname + "/lib/jquery-ui.min.css";
	let jqueryUiJsUrl = "/" + rootname + "/lib/jquery-ui.min.js";
	let jqueryLoadingUrl = 'lib/jquery.loading.min.js';
	let jqueryNotifyUrl = 'lib/notify.min.js';
	$('head').append('<script src="' + jqueryUiJsUrl + '"></script>');
	$('head').append('<link rel="stylesheet" href="' + jqueryUiCssUrl + '" type="text/css" />');
	//https://carlosbonetti.github.io/jquery-loading/
	$('head').append('<script src="' + jqueryLoadingUrl + '"></script>');
	//https://notifyjs.jpillora.com/
	$('head').append('<script src="' + jqueryNotifyUrl + '"></script>');

  $('body').append($('<div id="overlay"><div class="loader"></div></div>'));

  $('body').loading({overlay: $("#overlay"), stoppable: true});
  $('body').loading('stop');

  $('#HistoryDialogBox').dialog({
    modal: true, autoOpen: false, width: 350, resizable: false, title: 'ประวัติผู้ป่วย'
  });

	$('#app').load('form/main.html', function(){
		var cookieValue = $.cookie(cookieName);
		cookie = JSON.parse(cookieValue);
		$("#User-Identify").text(cookie.name);
		$("#User-Identify").click(function(){
			doShowUserProfile();
		});
		/*
		$("#Home-Cmd").click(function(){
			doShowHome();
		});
		*/
		$("#Case-Cmd").click(function(){
			doShowCase()
		});
		$("#Doctor-Cmd").click(function(){
			doShowMainDoctor();
		});
		$("#Hotpital-Cmd").click(function(){
			doShowMainHotpital();
		});
		$("#Setting-Cmd").click(function(){
			doShowSetting();
		});
		$("#Logout-Cmd").click(function(){
			doUserLogout();
		});

		//doShowHome();
		doShowCase();
    doConnectWebsocketMaster(cookie.username);
    doConnectWebsocketLocal(cookie.username);
	});
}

function doShowHome(){
	$(".row").hide();
	$(".mainfull").show();
	$(".mainfull").empty();
	home.doLoadSummaryDoctor(cookie.username);
}

function doShowCase() {
	$(".row").hide();
	$(".mainfull").show();
	$(".mainfull").empty();
	cases.doLoadCasePage(cookie.username);
}

function doShowMainDoctor(){
	$(".row").show();
	$(".mainfull").hide();
	$(".submenu").empty();
	$(".submenu").show();
	$(".main").empty();
	$(".submenu").append($('<div class="sub-menu-item"><a href="#" id="DoctorData-Cmd">ข้อมูลแพทย์</a></div>'));
	$(".submenu").append($('<div class="sub-menu-item"><a href="#" id="DoctorSchedule-Cmd">ตารางเวร</a></div>'));
	$("#DoctorData-Cmd").click(function(){
		$(".main").empty();
    $('body').loading('start');
		home.doCallSummaryDoctor(cookie.username).then((response) => {
			let drList = JSON.parse(response.res.body);
			doctor.doShowAllDoctor(drList, cookie.username, cookie.org[0].id);
      $('body').loading('stop');
		})
	});
	$("#DoctorSchedule-Cmd").click(function(){
		alert('#DoctorSchedule');
		$(".main").empty();
	});
	$("#DoctorData-Cmd").trigger("click");
}

function doShowMainHotpital() {
	$(".row").show();
	$(".mainfull").hide();
	$(".submenu").empty();
	$(".submenu").show();
	$(".main").empty();
	$(".submenu").append($('<div class="sub-menu-item"><a href="#" id="HotpitalData-Cmd">ข้อมูลโรงพยาบาล</a></div>'));
	$(".submenu").append($('<div class="sub-menu-item"><a href="#" id="ReportForm-Cmd">Set Report Form</a></div>'));
	$(".submenu").append($('<div class="sub-menu-item"><a href="#" id="UrgentLevel-Cmd">Urgent Level</a></div>'));
	$("#HotpitalData-Cmd").click(function(){
		$(".main").empty();
    $('body').loading('start');
		home.doCallHospitalData(cookie.username).then((response) => {
			let hospData = JSON.parse(response.res.body);
			hospital.doShowHospitalData(hospData);
      $('body').loading('stop');
		});
	});
	$("#ReportForm-Cmd").click(function(){
		$(".main").empty();
    $('body').loading('start');
    $('head').append('<script src="lib/jquery-ui.min.js"></script>');
    $('head').append('<link rel="stylesheet" href="lib/jquery-ui.min.css" type="text/css" />');
    $('body').loading('start');
  	$(".main").load('form/design.html', function(oo){

      $('body').loading('stop');
    });
  });

	$("#UrgentLevel-Cmd").click(function(){
		$(".main").empty();
    $('body').loading('start');
		home.doCallUrgentData(cookie.username).then((response) => {
			let urgentData = JSON.parse(response.res.body);
			urgent.doShowUrgentData(urgentData.data, cookie.username);
      $('body').loading('stop');
		});
	});
	$("#HotpitalData-Cmd").trigger("click");
}

function doShowSetting() {
	$("#dialog").load('form/setting-dialog.html', function(){
		$(".modal-footer").css('text-align', 'center');
		$("#SaveSetting-Cmd").click(function(){
			doSaveSetting();
		});
	})
}

function doShowUserProfile() {
	$("#dialog").load('form/dialog.html', function() {
		$("#UserStaus").text(cookie.curr_status);
		$("#OrgName").text(cookie.org[0].name);
		$("#OrgName").text(cookie.org[0].name);
		$("#PositionName").val(cookie.org[0].position);
		$("#Username").text(cookie.username);
		$("#Password").val(upwd);
		$("#Name").val(cookie.name);
		$("#Telno").val(cookie.tel);
		$("#Email").val(cookie.email);
		$("#LineId").val(cookie.LineId);
		$("#Comment").val(cookie.comment);
		$(".modal-footer").css('text-align', 'center');
		$("#SaveUserProfile-Cmd").click(function(){
			doSaveUserProfile();
		});
	});
}

function doSaveUserProfile(){
	/*
	let positionName = $("#PositionName").val();
	let password = $("#Password").val();
	let name = $("#Name").val();
	let telno = $("#Telno").val();
	let email = $("#Email").val();
	let lineId = $("#LineId").val();
	let comment = $("#Comment").val();
	*/
	alert('Now have not support yet.');
	$("#myModal").css("display", "none");
}

function doSaveSetting() {
	alert('Now have not support yet.');
}

function doConnectWebsocketMaster(username){
  const hostname = window.location.hostname;
  const port = window.location.port;
  const paths = window.location.pathname.split('/');
  const rootname = paths[1];

  let wsUrl = 'wss://' + hostname + ':' + port + '/' + rootname + '/' + username + '?type=test';
  wsm = new WebSocket(wsUrl);
	wsm.onopen = function () {
		console.log('Master Websocket is connected to the signaling server')
	};

	wsm.onmessage = function (msgEvt) {
    let data = JSON.parse(msgEvt.data);
    console.log(data);
    if (data.type == 'test') {
      $.notify(data.message, "success");
    } else if (data.type == 'trigger') {
      let message = {type: 'trigger', dcmname: data.dcmname};
      wsl.send(JSON.stringify(message));
      $.notify('The system will be start store dicom to your local.', "success");
    } else if (data.type == 'notify') {
      $.notify(data.message, "warnning");
    }
  };

  wsm.onclose = function(event) {
		console.log("Master WebSocket is closed now. with  event:=> ", event);
	};

	wsm.onerror = function (err) {
	   console.log("Master WS Got error", err);
	};
}

function doConnectWebsocketLocal(username){
  let wsUrl = 'ws://localhost:3000/webapp/' + username + '?type=test';
  wsl = new WebSocket(wsUrl);
	wsl.onopen = function () {
		console.log('Local Websocket is connected to the signaling server')
	};

	wsl.onmessage = function (msgEvt) {
    let data = JSON.parse(msgEvt.data);
    console.log(data);
    if (data.type == 'test') {
      $.notify(data.message, "success");
    } else if (data.type == 'result') {
      $.notify(data.message, "success");
    } else if (data.type == 'notify') {
      $.notify(data.message, "warnning");
    }
  };

  wsl.onclose = function(event) {
		console.log("Local WebSocket is closed now. with  event:=> ", event);
	};

	wsl.onerror = function (err) {
	   console.log("Local WS Got error", err);
	};
}

function doGetCookie(){
	return cookie;
}

module.exports = {
	doGetCookie
}
