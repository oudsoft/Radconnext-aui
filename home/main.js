/* main.js */

window.$ = window.jQuery = require('jquery');

$.fn.center = function () {
  this.css("position","absolute");
  this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
  this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +  $(window).scrollLeft()) + "px");
  return this;
}

const home = require('./mod/home.js')($);

var upwd, wsm, wsl;

$( document ).ready(function() {
	console.log('page on ready ...');
	const initPage = function() {
		var token = doGetToken();
		if (token) {
			doLoadMainPage()
		} else {
			doLoadLogin()
		}
	};

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
				//$.cookie(cookieName, JSON.stringify(resBody), { expires : 1 });
        localStorage.setItem('token', response.token);
        localStorage.setItem('userdata', JSON.stringify(response.data));
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
  localStorage.removeItem('token');
  $('#LogoutCommand').hide();
  let url = '/';
  window.location.replace(url);
}

function doLoadMainPage(){
	//let paths = window.location.pathname.split('/');
	//let rootname = paths[1];
	let jqueryUiCssUrl = "/lib/jquery-ui.min.css";
	let jqueryUiJsUrl = "/lib/jquery-ui.min.js";
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

  let userdata = JSON.parse(doGetUserData());
	$('#app').load('form/main.html', function(){
		$("#User-Identify").text(userdata.userinfo.User_NameEN + ' ' + userdata.userinfo.User_LastNameEN);
		$("#User-Identify").click(function(){
			doShowUserProfile();
		});
		$("#Home-Cmd").click(function(){
			doShowHome();
		});
    $("#Logout-Cmd").click(function(){
			doUserLogout();
		});

		doShowHome();

    //doConnectWebsocketMaster(userdata.username);
    //doConnectWebsocketLocal(userdata.username);
	});
}

function doShowHome(){
	//$(".row").hide();
	//$(".mainfull").show();
	//$(".mainfull").empty();
	//home.doLoadSummaryDoctor(cookie.username);
}

function doShowUserProfile() {
  let userdata = JSON.parse(doGetUserData());
  let userinfo = userdata.userinfo;
  console.log(userdata);
  console.log(userdata.userinfo);

	$("#dialog").load('form/dialog.html', function() {
		$("#UserStaus").text(userdata.hospital.Hos_Name);
		//$("#OrgName").text(cookie.org[0].name);
		//$("#OrgName").text(cookie.org[0].name);
		//$("#PositionName").val(cookie.org[0].position);
		$("#Username").text(userdata.username);
		//$("#Password").val(upwd);
		$("#Name").val(userinfo.User_NameEN + ' ' + userinfo.User_LastNameEN);
		$("#Telno").val(userinfo.User_Phone);
		$("#Email").val(userinfo.User_Email);
		$("#LineId").val(userinfo.User_LineID);
		//$("#Comment").val(cookie.comment);
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

function doGetToken(){
	return localStorage.getItem('token');
}

function doGetUserData(){
  return localStorage.getItem('userdata');
}

module.exports = {
	doGetToken,
  doGetUserData
}
