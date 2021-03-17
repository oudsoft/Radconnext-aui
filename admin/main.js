/* main.js */

// browserify main.js -o public/js/bundle.js //

const $ = require('jquery');
window.$ = window.jQuery = require('jquery');
// require('jquery-ui-browserify');
//$.mobile = require('jquery-mobile');

/////////////////// jqwidgets ////////////////////////////
require('./JavaScriptFile/jquery-3.5.1.min.js');
require('./JavaScriptFile/jqwidgets/jqx-all.js');
require('./lib/notifIt.min.js');
require('./lib/jquery-ex.js');
require('./lib/jquery-ui.min.js');
require('./app/lib/websocket.js');
require('./JavaScriptFile/jquery.cookie.js');
const jwt = require('jsonwebtoken');
var moment = require('./JavaScriptFile/moment-with-locales.js');
//require('./JavaScriptFile/jquery-1.11.1.min.js');

//////////////////////////////////////////////////////////////

require('./JavaScriptFile/bootstrap.bundle.js');
//require('./JavaScriptFile/sb-admin-2.js');
require('./JavaScriptFile/sb-admin-2.min.js');
//require('./JavaScriptFile/fontawesome.js');
require('./JavaScriptFile/FontAweSomeFree5/js/all.js');
// require('./JavaScriptFile/FontAweSomeFree5/js/all.js');
// const requiredSideBar = require('./JavaScriptFile/Sidebar.js');
require('./JavaScriptFile/uploadFile.js');
// require('./JavaScriptFile/simpleUpload.min.js');
// require('./JavaScriptFile/scanner.js');
// require('./JavaScriptFile/Utility.js');
require("./JavaScriptFile/simpleUpload.min.js");
require("./JavaScriptFile/jquery-patient-history-image-plugin.js");
//// Socket Timer
var utilmod = require('./JavaScriptFile/utilmod.js');

// require("./JavaScriptFile/widgets/ManageUser_Admin.js");
// const requiredManageUser_Admin = require("./JavaScriptFile/widgets/ManageUser_Admin.js");
// const requiredManageCliamerights_Admin = require("./JavaScriptFile/widgets/ManageCliamerights_Admin.js");
// const requiredCaseActiveTech = require('./JavaScriptFile/widgets/CaseActiveTech.js');
// const requiredAccount = require('./JavaScriptFile/widgets/Account.js');
// const requiredCaseActiveDoctor = require('./JavaScriptFile/widgets/CaseActiveDoctor.js');
// const requiredCaseHistory = require('./JavaScriptFile/widgets/CaseHistory.js');
// const requiredProfile = require("./JavaScriptFile/widgets/profile.js");

///////////////// Custom for user /////////////////

window.jQuery.cachedScript = function (url, options) {
	// Allow user to set any option except for dataType, cache, and url
	options = $.extend(options || {}, {
		dataType: "script",
		cache: true,
		url: url
	});

	// Use $.ajax() since it is more flexible than $.getScript
	// Return the jqXHR object so we can chain callbacks
	return jQuery.ajax(options);
};

window.jQuery.postCORS = function (url, data, func) {
	if (func == undefined) func = function () { };
	return $.ajax({
		type: 'POST',
		url: url,
		data: data,
		dataType: 'json',
		contentType: 'application/x-www-form-urlencoded',
		xhrFields: { withCredentials: true },
		success: function (res) { func(res) },
		error: function (err) {
			func({ err })
		}
	});
};


// var getUserTypeAPI = "/api/usertypes/options";
// var postRegister = "/api/users";// 
var UserLogin = "/api/login";

var cookie, upwd, noti, wsm, wsl;
var utilmod;
//var MessagesFromWSM;
//let sizeofobejcts = ObjectSize(MessagesFromWSM);

$(document).ready(function () {
	// var checktoken = false;
	$.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
	// console.log('page on ready ...');
	$('#header').load('FormPHP/header.html', function () { });
	$('#footer').load('FormPHP/footer.html', function () { });
	theme = 'energyblue';
	// var User_UserID;
	// var UserNameID;
	// var User_FirstName;
	// var User_LastName;
	// var User_Type;
	// var User_Status;
	// var User_Phone;
	// var User_LindID;
	// var User_TypeID; 
	// var User_TypeName;
	// var vTotalCase;
	// var vTotalHos;
	// var vNewCase;
	// var vWaitAccept;
	// var User_RadiantPath;

	initPage();

});

function initPage() {
	// var cookieValue = $.cookie(cookieName);
	// console.log('cookieValue = ' + cookieValue);
	var token = window.localStorage.getItem('token');
	// console.log('token = ' + token);
	if (token) {
		//cookie = JSON.parse(cookieValue);
		// if (cookie && token) {
		// 	doLoadMainPage();
		// } else {
		// 	doLoadLogin();
		// }
		doLoadMainPage();
	} else {
		doLoadLogin();
	}
}
function doLoadMainPage() {
	//// TypeID 
	// User_TypeID = 1; //Admin
	// User_TypeID = 2; //Technician
	// User_TypeID = 3; //Accountant
	// User_TypeID = 4; //Radiologist
	// User_TypeID = 5; //RefferalDocter
	// User_TypeID = 6; //DepartmentPublicComputer
	// User_TypeID = 7; //Patient

	var function_name = "doLoadMainPage";
	// console.log("function_name : " + function_name + " => start");

	let file01 = "/setting/plugin/jquery-patient-history-image-plugin.js";
	let file02 = "moment-with-locales.js";
	$('head').append('<script src="' + file01 + '"></script>');
	$('head').append('<script src="' + file02 + '"></script>');

	const UserInfoData = JSON.parse(window.localStorage.getItem('userdata'));
	// console.log("UserInfoData = " + UserInfoData);

	User_TypeID = UserInfoData.usertypeId;
	User_TypeName = UserInfoData.usertype.UserType_Name;
	User_ID = UserInfoData.id;
	User_NameEN = UserInfoData.userinfo.User_NameEN;
	User_LastNameEN = UserInfoData.userinfo.User_LastNameEN;
	UserNameID = UserInfoData.username;
	User_HosID = UserInfoData.hospital.id;
	User_Hospital_Name = UserInfoData.hospital.Hos_Name;
	User_StatusID = UserInfoData.userstatusId;

	// utilmod.doConnectWebsocketMaster(UserNameID,User_HosID);
	doConnectWebsocketMaster(UserNameID, User_HosID);

	// let localWsl = doConnectWebsocketLocal(UserNameID);
	// 	//util.doAssignWsl(wsl);
	// if ((localWsl.readyState == 0) || (localWsl.readyState == 1)) {
	// 	wsm = doConnectWebsocketMaster(UserNameID, User_HosID, 'local');
	// } else {
	// 	wsm = doConnectWebsocketMaster(UserNameID, User_HosID, 'none');
	// }
	// $.notify("เทสระบบ", "info");
	console.log("window.localStorage.getItem('masternotify') = " + window.localStorage.getItem('masternotify'));

	console.log("User_TypeID : " + User_TypeID + " User_ID : " + User_ID +
		" UserNameID : " + UserNameID + " User_HosID : " + User_HosID + " User_StatusID : " + User_StatusID);

	// console.log("User_TypeID = ", User_TypeID);
	//getUserinformation(UserNameID);

	let promise_getUserinformation = getUserinformation(UserNameID);
	promise_getUserinformation.then((data) => {
		// console.log("Success in promise_getUserinformation ");
		

	}).catch(function (error) {
		// console.log("Error in promise_getUserinformation = " + error );
	}).finally(function () {
		//console.log("Finally in promise_getUserinformation ");
	});


	// $('#ContentHeader').load('FormPHP/ContentHeader.html', function () {
	// 	const requiredContentHeader = require('./JavaScriptFile/ContentHeader.js');
	// 	requiredContentHeader.Start_ContentHeader();
	// });

	


	if (User_TypeID == 1) {
		// Admin
		$('#app').load('FormPHP/main.html', function () {

			console.log("User_TypeID = " + User_TypeID + " => Admin");
			$('#SideBar').load('FormPHP/Sidebar.html', function () {
				const requiredSideBar = require('./JavaScriptFile/Sidebar.js');
				requiredSideBar.Start_SideBar(User_TypeID);
				$('#MessageNotification').load('FormPHP/MessageNotification.html', function () { });
				SideBarLink();
			});
			$('#Topbar').load('FormPHP/TopBar.html', function () {
				TopbarLoading();
			});
		});

	} else if (User_TypeID == 2) {
		//Technician
		$('#app').load('FormPHP/main.html', function () {

			console.log("User_TypeID = " + User_TypeID + " => Technician");

			$('#CaseContent').load('FormPHP/CaseActiveTech.html', function () {
				const requiredCaseActiveTech = require('./JavaScriptFile/widgets/CaseActiveTech.js');
				requiredCaseActiveTech.start_CaseActiveTech();
			});

			$('#SideBar').load('FormPHP/Sidebar.html', function () {
				const requiredSideBar = require('./JavaScriptFile/Sidebar.js');
				requiredSideBar.Start_SideBar(User_TypeID);
				$('#MessageNotification').load('FormPHP/MessageNotification.html', function () { });
				SideBarLink();
			});
			$('#Topbar').load('FormPHP/TopBar.html', function () {
				TopbarLoading();
			});

		});

	} else if (User_TypeID == 3) {
		//Accountant
		$('#app').load('FormPHP/main.html', function () {

			console.log("User_TypeID = " + User_TypeID + " => Accountant");

			$('#CaseContent').load('FormPHP/Account.html', function () {
				const requiredAccount = require('./JavaScriptFile/widgets/Account.js');
			});
			$('#SideBar').load('FormPHP/Sidebar.html', function () {
				const requiredSideBar = require('./JavaScriptFile/Sidebar.js');
				requiredSideBar.Start_SideBar(User_TypeID);
				$('#MessageNotification').load('FormPHP/MessageNotification.html', function () { });
				SideBarLink();
			});
			$('#Topbar').load('FormPHP/TopBar.html', function () {
				TopbarLoading();
			});
		});
	} else if (User_TypeID == 4) {
		//Radiologist
		$('#app').load('FormPHP/main.html', function () {

			console.log("User_TypeID = " + User_TypeID + " => Radiologist");


			$('#CaseContent').load('FormPHP/CaseActiveDoctor.html', function () {
				const requiredCaseActiveDoctor = require('./JavaScriptFile/widgets/CaseActiveDoctor.js');
				requiredCaseActiveDoctor.Start_CaseActiveDoctor();
			});
			$('#SideBar').load('FormPHP/Sidebar.html', function () {
				const requiredSideBar = require('./JavaScriptFile/Sidebar.js');
				requiredSideBar.Start_SideBar(User_TypeID);
				$('#MessageNotification').load('FormPHP/MessageNotification.html', function () { });
				SideBarLink();
			});
			$('#Topbar').load('FormPHP/TopBar.html', function () {
				TopbarLoading();
			});
		});

	} else if (User_TypeID == 5) {
		//RefferalDocter
		$('#app').load('FormPHP/main.html', function () {

			console.log("User_TypeID = " + User_TypeID + " => RefferalDocter");

			$('#CaseContent').load('FormPHP/CaseHistory.html', function () {
				// require('./JavaScriptFile/widgets/CaseActiveDoctor.js');
				const requireCaseHistory = require('./JavaScriptFile/widgets/CaseHistory.js');
				requireCaseHistory.Start_CaseHistory();
			});
			$('#SideBar').load('FormPHP/Sidebar.html', function () {
				const requiredSideBar = require('./JavaScriptFile/Sidebar.js');
				requiredSideBar.Start_SideBar(User_TypeID);
				$('#MessageNotification').load('FormPHP/MessageNotification.html', function () { });
				SideBarLink();
			});
			$('#Topbar').load('FormPHP/TopBar.html', function () {
				TopbarLoading();
			});
		});

	} else if (User_TypeID == 6) {
		//DepartmentPublicComputer
		$('#app').load('FormPHP/main.html', function () {

			console.log("User_TypeID = " + User_TypeID + " => DepartmentPublicComputer");
			$('#SideBar').load('FormPHP/Sidebar.html', function () {
				const requiredSideBar = require('./JavaScriptFile/Sidebar.js');
				requiredSideBar.Start_SideBar(User_TypeID);
				$('#MessageNotification').load('FormPHP/MessageNotification.html', function () { });
				SideBarLink();
			});
			$('#Topbar').load('FormPHP/TopBar.html', function () {
				TopbarLoading();
			});
		});
	} else if (User_TypeID == 7) {
		//Patient
		$('#app').load('FormPHP/main.html', function () {

			console.log("User_TypeID = " + User_TypeID + " => Patient");
			$('#SideBar').load('FormPHP/Sidebar.html', function () {
				const requiredSideBar = require('./JavaScriptFile/Sidebar.js');
				requiredSideBar.Start_SideBar(User_TypeID);
				$('#MessageNotification').load('FormPHP/MessageNotification.html', function () { });
				SideBarLink();
			});
			$('#Topbar').load('FormPHP/TopBar.html', function () {
				TopbarLoading();
			});
		});
	}

	console.log("function_name : " + function_name + " => end");
}

function TopbarLoading() {
	$("#LogOut").click(function () {
		console.log("#LogOut is click");
		doUserLogout();
	});

	$('#TopBarProfile').on('click', function () {
		$("#ContentHeader").hide();
		$('#CaseContent').load('FormPHP/profile.html', function () {
			const requireProfile = require("./JavaScriptFile/widgets/profile.js");
			requireProfile.Start_Profile();
		});
	});

	$("#CaseDropdown").jqxGrid(
		// row.Row = i;
		// row.Message = MessagesFromWSM[i].notify.message;
		// row.type = MessagesFromWSM[i].notify.type;
		// row.datetime = MessagesFromWSM[i].datetime;
		// row.status = MessagesFromWSM[i].status;
		// databases[i] = row;
		{
			width: 550,
			autoheight: true,
			columnsresize: true,
			autorowheight: true,
			columns: [
				{ text: 'Message', columntype: 'textbox', align: "left", cellsalign: 'left', datafield: 'Message', width: 350 },
				{
					text: 'RemainingTime', columntype: 'textbox', datafield: 'datetime', width: 75,
					cellsrenderer: function (row) {
						Editrow = row;
						// var rowId = row.boundindex;
						var rowData = $("#CaseDropdown").jqxGrid("getrowdata", Editrow);
						var dataRecord = $("#CaseDropdown").jqxGrid("getrowdata", Editrow);
						// var caseIdrowData = rowData.caseId;
						// var deadline = getTriggerAt(caseIdrowData);
						// var times = new Date(deadline);
						// console.log('times: ' + times);
						var remainingTime = CaseTimerInTable(rowData.deadline);
						return "<span class='align-middle text-center'>" + remainingTime + "</span>";
					},
				},
				{ text: 'Status', columntype: 'textbox', align: "center", cellsalign: 'center', datafield: 'status', width: 75 },
				{
					text: "Delete", datafield: "Delete", align: "center", cellsalign: 'center', columntype: "button", width: 50,
					cellsrenderer: function (row) {
						Editrow = row;
						// var rowId = row.boundindex;
						// var rowData = $("#CaseDropdown").jqxGrid("getrowdata", rowId);
						var dataRecord = $("#CaseDropdown").jqxGrid("getrowdata", Editrow);
						return 'Delete';
					},
					buttonclick: function (row) {
						Editrow = row;
						// var rowId = row.boundindex;
						// var offset = $("#CaseDropdown").offset();
						var dataRecord = $("#CaseDropdown").jqxGrid("getrowdata", Editrow);
						console.log('dataRecord: ' + JSON.stringify(dataRecord));
						MessagesFromWSM.splice(Editrow, 1);
						console.log('MessagesFromWSM after splice');
						localStorage.setItem('masternotify', JSON.stringify(MessagesFromWSM));
						sizeofobejcts = ObjectSize(MessagesFromWSM);
						MessageNotifys();
					}
				}
			],
		});

	setTimeout(function () {
		MessageNotifys();
	}, 5000);


	$("#ClearMessages").click(() => {
		window.localStorage.removeItem('masternotify');
		MessageNotifys();
		$("#CaseDropdown").jqxGrid("updatebounddata");
	});

}

function doCallLoginApi(user) {
	return new Promise(function (resolve, reject) {
		const loginApiName = 'chk_login';
		const body = { username: user.username, password: user.password, };
		var realUrl = UserLogin;
		var params = { method: 'post', body: body, url: realUrl, apiname: loginApiName };
		console.log('apiName', loginApiName);
		console.log('body', body);
		console.log('realUrl', realUrl);
		console.log('params', params);
		APIUserLogin().then((response) => {
			console.log('response', response);
			resolve(response);
		}).catch((err) => {
			console.log(JSON.stringify(err));
		});
	});
}

function doLogin() {
	var function_name = "doLogin";
	console.log("function_name : " + function_name + " => start");
	var username = $("#pUserName").val();
	var password = $("#pPassword").val();

	console.log("Username=" + username, " password=" + password);
	// Checking for blank fields.
	if (username == '' || password == '') {
		$('input[type="text"],input[type="password"]').css("border", "2px solid red");
		$('input[type="text"],input[type="password"]').css("box-shadow", "0 0 3px red");
		$('#login-msg').html('<p>กรุณาใส่ UserName และ Password</p>');
		$('#login-msg').show();
	} else {
		let user = { username: username, password: password };
		console.log(user);
		doCallLoginApi(user).then((response) => {
			var resBody = JSON.parse(response.res.body);
			//var resBody = JSON.parse(response); <= ใช้ในกรณีเรียก API แบบ Direct

			console.log('resBody : ' + resBody);
			if (resBody.success == false) {
				$('input[type="text"]').css({ "border": "2px solid red", "box-shadow": "0 0 3px red" });
				$('input[type="password"]').css({ "border": "2px solid #00F5FF", "box-shadow": "0 0 5px #00F5FF" });
				$('#login-msg').html('<p>Username or Password incorrect. Please try with other username and password again.</p>');
				$('#login-msg').show();
			} else {
				//Save resBody to cookie.
				console.log("Function: " + function_name + " resBody = " + resBody);
				window.localStorage.setItem('token', resBody);
				//$.cookie('token', JSON.stringify(resBody), { expires: 1 });
				//upwd = password;
				console.log('Save Token Success!');
				doLoadMainPage();
			}
		});
	}
	console.log("function_name : " + function_name + " => end");
}
function doRequestLogin(params) {
	var function_name = "doRequestLogin";
	console.log("function_name : " + function_name + " => start");
	return new Promise(function (resolve, reject) {
		var url = UserLogin;
		$.post(url, params, function (data) {
			resolve(data);
		}).fail(function (error) {
			console.log(JSON.stringify(error));
			reject(error);
		});
		console.log("function_name : " + function_name + " => end");
	});
}

function APIUserLogin() {
	return new Promise(function (resolve, reject) {
		var function_name = "APIUserLogin";
		// console.log("function_name : " + function_name + " => start");
		let username = $('#pUserName').val();
		let password = $('#pPassword').val();
		let params = { username: username, password: password };

		if (username) {
			let password = $('#pPassword').val();
			let params = { username: username, password: password };
			doRequestLogin(params).then((resp) => {
				var new_resp = JSON.stringify(resp);
				//console.log("resp = " +  JSON.stringify(resp) );
				// console.log("new_resp = " +  new_resp );
				if (resp.status.code === 200) {
					//window.localStorage.setItem('token', resp.token);
					setTimeout(() => {
						// console.log('new_resp.status.code = ' + resp.status.code);
						// console.log('new_resp.token = ' + resp.token);
						// console.log('new_resp.data = ' + resp.data);
						if (resp.success == true) {
							window.localStorage.setItem('token', resp.token);
							window.localStorage.setItem('userdata', JSON.stringify(resp.data));
							// console.log('userstatusId: ' +  resp.data.userstatusId);
							// console.log('username: ' +  resp.data.username);
							// window.localStorage.setItem('hospitalId', resp.data.hospitalId);
							// window.localStorage.setItem('userinfoId', resp.data.userinfoId);
							// window.localStorage.setItem('username', resp.data.username);
							// window.localStorage.setItem('userstatusId', resp.data.userstatusId);
							// window.localStorage.setItem('usertypeId', resp.data.usertypeId);
							// $.cookie('token', JSON.stringify(resp.token), { expires: 1 });
							// upwd = password;
							// alert('resp.login === success');
							// $('#dialog').load('FormPHP/main.html', function () {});
							doLoadMainPage();
						}
					}, 500);
				} else if (resp.status.code === 210) {
					alert('Sorry, your accout have some problem.');
					setTimeout(() => {
						location.reload();
						console.log('resp.status.code = ' + resp.status.code);
					}, 500);
				} else {
					alert('Wrong Email and Password.');
					$('#pUserName').focus();
				}
			});
		} else {
			alert('Email not Empty allow.');
			$('#pUserName').focus();
		}

		// console.log("function_name : " + function_name + " => end");
	});

}

function doLoadLogin() {
	$('#app').load('FormPHP/login.html', function () {
		$("#vLogin").click(function () {
			console.log("#vLogin is click");
			doLogin();
		});
		$("#pPassword").on('keypress', function (e) {
			if (e.which == 13) {
				doLogin();
			};
		});
	});
}

function doUserLogout() {
	// const logoutApiName = 'logout';
	// $.removeCookie('token');
	// localStorage.removeItem('token');
	window.localStorage.clear();
	doLoadLogin();
}


function doConnectWebsocketMaster(username, hospitalId, type) {
	console.log("doConnectWebsocketMaster in main is running");
	const hostname = window.location.hostname;
	const port = window.location.port;
	const paths = window.location.pathname.split('/');
	const rootname = paths[1];
	const wsUrl = 'wss://' + hostname + ':' + port + '/' + rootname + '/' + username + '/' + hospitalId + '?type=' + type;
	const wsm = new WebSocket(wsUrl);
	wsm.onopen = function () {
		//console.log('Master Websocket is connected to the signaling server')
	};

	wsm.onmessage = function (msgEvt) {
		let data = JSON.parse(msgEvt.data);
		console.log("wsm.onmessage: " + msgEvt.data);


		if (data.type !== 'test' && data.type !== "refresh") {
			let masterNotify = localStorage.getItem('masternotify');
			let MasterNotify;
			if (masterNotify) {
				MasterNotify = JSON.parse(masterNotify);
				MasterNotify.push({ notify: data, datetime: new Date(), status: 'new', casdId: data.casdId });
			} else {
				MasterNotify = [];
				MasterNotify.push({ notify: data, datetime: new Date(), status: 'new', casdId: data.casdId });
			}
			console.log('MasterNotify = ' + JSON.stringify(MasterNotify));

			let result = sortMasterNotifyFunction(MasterNotify);
			console.log("result: " + result + " or " + JSON.stringify(result));
			if (result) {
				window.localStorage.setItem("masternotify", JSON.stringify(result));
				console.log('window.localStorage.setItem("masternotify", result) : ' + JSON.stringify(result));
			} else {
				window.localStorage.setItem("masternotify", JSON.stringify(MasterNotify));
				console.log('window.localStorage.setItem("masternotify", MasterNotify): ' + JSON.stringify(MasterNotify));
			}

			console.log('After setItem masternotify =>> ' + window.localStorage.getItem('masternotify'));

			// showNotification();
			// ReloadMessageNotify();
			/// Show Notification
			// masterNotify = JSON.parse(localStorage.getItem('masternotify'));
			// window.localStorage.setItem("masternotify", MasterNotify);

		}
		if (data.type == 'test') {
			$.notify(data.message, "success");
		} else if (data.type == 'trigger') {
			if (wsl) {
				let message = { type: 'trigger', dcmname: data.dcmname, StudyInstanceUID: data.studyInstanceUID, owner: data.ownere };
				wsl.send(JSON.stringify(message));
				$.notify('The system will be start store dicom to your local.', "success");
			}
		} else if (data.type == 'notify') {
			$.notify(data.message, "warnning");
		} else if (data.type == 'exec') {
			if (wsl) {
				wsl.send(JSON.stringify(data));
			}
		} else if (data.type == 'cfindresult') {
			let remoteDicom = document.getElementById('RemoteDicom');
			remoteDicom.dispatchEvent(new CustomEvent("cfindresult", { detail: { data: data.result, owner: data.owner, hospitalId: data.hospitalId } }));
		} else if (data.type == 'move') {
			if (wsl) {
				wsl.send(JSON.stringify(data));
			}
		} else if (data.type == 'cmoveresult') {
			let remoteDicom = document.getElementById('RemoteDicom');
			remoteDicom.dispatchEvent(new CustomEvent("cmoveresult", { detail: { data: data.result, owner: data.owner, hospitalId: data.hospitalId } }));
		} else if (data.type == 'run') {
			if (wsl) {
				wsl.send(JSON.stringify(data));
			}
		} else if (data.type == 'runresult') {
			//let remoteDicom = document.getElementById('RemoteDicom');
			remoteDicom.dispatchEvent(new CustomEvent("runresult", { detail: { data: data.result, owner: data.owner, hospitalId: data.hospitalId } }));
		}

		// /// Show Notification
		// MessagesFromWSM = showNotification();
		// console.log("MessagesFromWSM: " + JSON.stringify(MessagesFromWSM));
		// let sizeofobejcts = ObjectSize(MessagesFromWSM);
		// console.log('sizeofobejcts:' + sizeofobejcts);

		// for(var i=0; i<sizeofobejcts; i++){
		// 	let htmlicon = '<a class="dropdown-item d-flex align-items-center"><div class="mr-3" ><div class="icon-circle bg-danger"><i class="fas fa-file-alt text-white"></i></div></div>';
		// 	let htmlstring = '<div><div class="small text-gray-500"></div><span class="font-weight-bold"><span>'+ MessagesFromWSM[i].notify.message +'</span>New Case</span></div>'
		// 	let messageshtml = htmlicon + htmlstring;
		// 	$("#CaseDropdown").html(messageshtml);
		// }

		MessageNotifys();

	};

	wsm.onclose = function (event) {
		//console.log("Master WebSocket is closed now. with  event:=> ", event);
	};

	wsm.onerror = function (err) {
		console.log("Master WS Got error", err);
	};

	// return wsm;
}

function doConnectWebsocketLocal(username) {
	const hostname = window.location.hostname;
	const port = window.location.port;
	const paths = window.location.pathname.split('/');
	const rootname = paths[1];
	let wsUrl = 'wss://' + hostname + ':' + port + '/' + rootname + '/' + username + '?type=test';
	console.log(wsUrl);
	ws = new WebSocket(wsUrl);
	ws.onopen = function () {
		console.log('Websocket is connected to the signaling server')
	};

	ws.onmessage = function (msgEvt) {
		let data = JSON.parse(msgEvt.data);
		console.log(data);
		if (data.type == 'test') {
			$.notify(data.message, "success");
		} else if (data.type == 'trigger') {
			$.notify(data.message, "success");
		} else if (data.type == 'notify') {
			$.notify(data.message, "warnning");
		}
	};

	ws.onclose = function (event) {
		console.log("WebSocket is closed now. with  event:=> ", event);
	};

	ws.onerror = function (err) {
		console.log("WS Got error", err);
	};
}

function sortMasterNotifyFunction(notify) {
	let results = notify.sort((a, b) =>
		new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
	);
	return results;
}

function showNotification() {
	var NewMessage = [];
	var masterNotify = window.localStorage.getItem('masternotify');
	if (masterNotify == null) {
		return null;
	} else {
		masterNotify = JSON.parse(window.localStorage.getItem('masternotify'));
		var results = sortMasterNotifyFunction(masterNotify);
		ListCaseMessages = [];
		for (var i = 0; i < results.length; i++) {
			if (results[i].status == 'new' && results[i].notify.type == 'notify') {
				NewMessage[i] = results[i];
				if (results[i].notify.caseId > 0 && !ListCaseMessages.includes(results[i].notify.caseId)) {
					ListCaseMessages.push(results[i].notify.caseId);
				}

			}
		}
		console.log('NewMessage:' + JSON.stringify(NewMessage));
		if (NewMessage) {
			return NewMessage;
		} else {
			return "No Messages Notification";
		}
	}
}

async function getTriggerAt(caseId) {
	var data = await GetTimeInTaskappCaseIdAPI(caseId);
	var deadline;
	if (data) {
		deadline = data.Records[0].triggerAt;
		console.log('i: ' + i + ' data:' + JSON.stringify(data));
	} else {
		deadline = new Date();
	}
	console.log('deadline:' + deadline);
	return deadline;
}

async function ReloadMessageNotify() {
	var databases = [];
	// var remainingTime;
	for (var i = 0; i < sizeofobejcts; i++) {
		var row = {};
		row.Row = i;
		row.Message = MessagesFromWSM[i].notify.message;
		row.type = MessagesFromWSM[i].notify.type;
		row.datetime = MessagesFromWSM[i].datetime;
		row.status = MessagesFromWSM[i].status;
		row.caseId = MessagesFromWSM[i].notify.caseId;
		var data = await GetTimeInTaskappCaseIdAPI(MessagesFromWSM[i].notify.caseId);
		// console.log('i: ' +i+ ' data:' + JSON.stringify(data));
		if (data) {
			row.deadline = data.Records[0].triggerAt;
			//console.log('i: ' +i+ ' data:' + JSON.stringify(data));
		} else {
			row.deadline = new Date();
		}
		databases[i] = row;
	}

	try {
		var source = { localdata: databases, datatype: "array", };
		console.log('source' + JSON.stringify(source));
		var dataAdapter = new $.jqx.dataAdapter(source);
		$("#CaseDropdown").jqxGrid({ source: dataAdapter });
		return (databases);
	} catch (error) {
		reject(error);
	}
}

function MessageNotifys() {
	/// Show Notification
	MessagesFromWSM = showNotification();
	console.log("MessagesFromWSM: " + JSON.stringify(MessagesFromWSM));
	sizeofobejcts = ObjectSize(MessagesFromWSM);
	console.log('sizeofobejcts:' + sizeofobejcts);
	$("#HNewCase").text(sizeofobejcts);

	if (MessagesFromWSM != null) {
		ReloadMessageNotify();
	} else {
		console.log('MessagesFromWSM ==> null (' + MessagesFromWSM + ')');
	}


	var refreshInterval = setInterval(function () {
		$("#CaseDropdown").jqxGrid("updatebounddata");
	}, 60000);
}

function doGetCookie() {
	return cookie;
}

function ObjectSize(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

function getUserinformation(username) {
	var function_name = "getUserinformation";
	// console.log("function_name : " + function_name + " => start");
	return new Promise(function (resolve, reject) {
		var url = "/api/users/searchusername/" + username;
		$.get(url, "", function (data) {
			//resolve(data);
			// console.log("data = ", data);
			if (data.status.code === 200) {
				if (data.result[0]) {
					User_ID = data.result[0].id;
					User_FirstName = data.result[0].userinfo.User_NameEN;
					User_LastName = data.result[0].userinfo.User_LastNameEN;
					User_Type = data.result[0].usertype.UserType_Name;
					User_Status = data.result[0].userstatus.UserStatus_Name;
					User_Phone = data.result[0].userinfo.User_Phone;
					User_LindID = data.result[0].userinfo.User_LineID;
					User_RadiantPath = data.result[0].userinfo.User_PathRadiant;
					User_Hospital_ID = data.result[0].hospitalId;
					User_Hospital_Name = data.result[0].hospital.Hos_Name;

					setTimeout(function () {
						$('#UserName').html(User_FirstName);
						$('#LastName').html(User_LastName);
						$('#UserType').html(User_Type);
					}, 1000);
					resolve(data);
				} else {
					doUserLogout();
				}

			} else {
				// console.log("Error Can't get Data in function: "+function_name);
			}
		}).fail(function (error) {
			// console.log(JSON.stringify(error));
			reject(error);
		});

		// console.log("function_name : " + function_name + " => end");
	});
}

function SideBarLink() {
	$("#MainMenu2").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/CaseHistory.html", function () {
			const requiredCaseHistory = require("./JavaScriptFile/widgets/CaseHistory.js");
			requiredCaseHistory.Start_CaseHistory();
		});
	});

	$("#MainMenu3").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/CaseLocalFile.html", function () {
			const requiredCaseLocalFile = require("./JavaScriptFile/widgets/CaseLocalFile.js");
			requiredCaseLocalFile.Start_CaseLocalFile();
		});
	});

	$("#MainMenu4").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/UGTypes.html", function () {
			const requiredUGTypes = require("./JavaScriptFile/widgets/UGTypes.js");
			requiredUGTypes.Start_UGTypes();
		});
	});

	$("#MReportDesign").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/ReportDesign.html", function () {
			// var file01 = "report-design/jquery-report-plugin.js";
			// var file02 = "report-design/report-generator.js";
			// var file03 = ""
			// $('head').append('<script src="' + file01 + '"></script>');
			// $('head').append('<script src="' + file02 + '"></script>');
			// console.log("Success in add head");
			const requiredReportGenerator = require("./JavaScriptFile/ReportGenerator.js");
			const requiredsimpleUpload = require("./JavaScriptFile/simpleUpload.min.js");
			const requiredReportDesign = require("./JavaScriptFile/ReportDesign.js");
		});
	});

	$("#MTechProfile").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/profile.html", function () {
			const requiredprofile = require("./JavaScriptFile/widgets/profile.js");
			requiredprofile.Start_Profile();
		});
	});

	$("#MTechHospital").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/Hospital.html", function () {
			const requiredHospital = require("./JavaScriptFile/widgets/Hospital.js");
			requiredHospital.Start_Hospital();
		});
	});

	$("#RadiologistProfile").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/profile_doctor.html", function () {
			const requiredprofile_doctor = require("./JavaScriptFile/widgets/profile_doctor.js");
			requiredprofile_doctor.Start_ProfileDoctor();
		});
	});

	$("#PortalPage").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/portal.html", function () {
			//require("./JavaScriptFile/widgets/portal.js");
		});
	});

	///// Admin /////

	$("#UserPage").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/ManageUser_Admin.html", function () {
			const requirefiles = require("./JavaScriptFile/widgets/ManageUser_Admin.js");
			requirefiles.startPage_ManageUser_Admin(User_HosID);
		});
	});

	$("#CliamerightsPage").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/ManageCliamerights_Admin.html", function () {
			const requirefiles = require("./JavaScriptFile/widgets/ManageCliamerights_Admin.js");
			requirefiles.Start_Cliamerights();
		});
	});

	$("#CaseStatusPage").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/ManageCaseStatus_Admin.html", function () {
			const requirefiles = require("./JavaScriptFile/widgets/ManageCaseStatus_Admin.js");
			requirefiles.Start_CaseStatus();
		});
	});

	$("#GeneralStatusPage").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/ManageGeneralStatus_Admin.html", function () {
			const requirefiles = require("./JavaScriptFile/widgets/ManageGeneralStatus_Admin.js");
			requirefiles.Start_GeneralStatus();
		});
	});

	$("#UserStatusPage").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/ManageUserStatus_Admin.html", function () {
			const requirefiles = require("./JavaScriptFile/widgets/ManageUserStatus_Admin.js");
			requirefiles.Start_UserStatus();
		});
	});

	$("#UserTypePage").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/ManageUserType_Admin.html", function () {
			const requirefiles = require("./JavaScriptFile/widgets/ManageUserType_Admin.js");
			requirefiles.Start_UserTypes();
		});
	});

	$("#ManageHospitalPage").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/Hospital_Admin.html", function () {
			const requirefiles = require("./JavaScriptFile/widgets/Hospital_Admin.js");
			requirefiles.startHospital_Admin();
		});
	});

	$("#ManageHospitalCasePage").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/HospitalCase_Admin.html", function () {
			const requirefiles = require("./JavaScriptFile/widgets/HospitalCase_Admin.js");
			requirefiles.startHospitalCase_Admin();
		});
	});

	$("#ManageHospitalImageFilePage").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/HospitalImageFile_Admin.html", function () {
			const requirefiles = require("./JavaScriptFile/widgets/HospitalImageFile_Admin.js");
		});
	});

	$("#OrderListPage").on("click", function () {
		$("#ContentHeader").hide();
		$("#CaseContent").load("FormPHP/OrderList.html", function () {
			const requirefiles = require("./JavaScriptFile/widgets/OrderList.js");
			requirefiles.Start_OrderList();
		});
	});

	/*
	   <div id="collapseAdmin" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
		   <div class="bg-white py-2 collapse-inner rounded">
			   <h6 class="collapse-header">User</h6>
			   <a class="collapse-item" id="UserPage">Manage User</a>
   
			   <h6 class="collapse-header">UserType</h6>
			   <a class="collapse-item" id="UserTypePage">Manage UserType</a>
   
			   <h6 class="collapse-header">UserStatus</h6>
			   <a class="collapse-item" id="UserStatusPage">Manage UserStatus</a>
   
			   <h6 class="collapse-header">GeneralStatus</h6>
			   <a class="collapse-item" id="GeneralStatusPage">Manage GeneralStatus</a>
   
			   <h6 class="collapse-header">Cliamerights</h6>
			   <a class="collapse-item" id="CliamerightsPage">Manage Cliamerights</a>
   
			   <h6 class="collapse-header">CaseStatus</h6>
			   <a class="collapse-item" id="CaseStatusPage">Manage CaseStatus</a>
   
   
			   <h6 class="collapse-header">Hospital</h6>
			   <a class="collapse-item" id="ManageHospitalPage">Manage Hospital</a>
			   <h6 class="collapse-header">Hospital Case</h6>
			   <a class="collapse-item" id="ManageHospitalCasePage">Manage Hospital Case</a>
			   <h6 class="collapse-header">Hospital ImageFile</h6>
			   <a class="collapse-item" id="ManageHospitalImageFilePage">Manage Hospital ImageFile</a>
			   <h6 class="collapse-header">ManageOrder</h6>
			   <a class="collapse-item" id="OrderListPage">Manage Order</a>
			   <h6 class="collapse-header">Portal</h6>
			   <a class="collapse-item" id="PortalPage">Portal</a>
   
			   <!-- <h6 class="collapse-header">User</h6>
			   <a class="collapse-item" id="RegisterPage" href="Register.html">Manage User</a>
			   <h6 class="collapse-header">Hospital</h6>
			   <a class="collapse-item" id="ManageHospitalPage" href="Hospital.html">Manage Hospital</a>
			   <h6 class="collapse-header">Order List</h6>
			   <a class="collapse-item" id="OrderListPage" href="OrderList.html">Manage Order</a> -->
		   </div>
	   </div>
   
	   */
}

function calcDate(date1, date2, types) {
	var diff = Math.floor(date1.getTime() - date2.getTime());
	var day = 1000 * 60 * 60 * 24;

	var days = Math.floor(diff / day);
	var months = Math.floor(days / 31);
	var years = Math.floor(months / 12);

	var message = date2.toDateString();
	message += " was ";
	message += days + " days ";
	message += months + " months ";
	message += years + " years ago \n";

	if (types == "years") { return years; }
	if (types == "months") { return months % 12; }
	if (types == "days") { return days % 31; }

	return null;
}


function CaseTimer1(starttime, display) {
	// Set the date we're counting down to
	var countDownDate = new Date(starttime).getTime();

	// Update the count down every 1 second
	var x = setInterval(function () {

		// Get today's date and time
		var now = new Date().getTime();

		// Find the distance between now and the count down date
		var distance = countDownDate - now;

		// Time calculations for days, hours, minutes and seconds
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		// Display the result in the element with id="display"
		document.getElementById(display).innerHTML = days + "d " + hours + "h " +
			minutes + "m " + seconds + "s ";

		// If the count down is finished, write some text
		if (distance < 0) {
			clearInterval(x);
			document.getElementById(display).innerHTML = "EXPIRED";
		}
	}, 1000);
}

function CaseTimerInTable(starttime) {
	console.log('CaseTimerInTable');
	if (starttime == 0) {
		return "Expired";
	}
	// Set the date we're counting down to
	var countDownDate = new Date(starttime).getTime();
	console.log("countDownDate: " + countDownDate);
	// Get today's date and time
	var now = new Date().getTime();
	// console.log("now: " + now);
	// Find the distance between now and the count down date
	var distance = countDownDate - now;
	// console.log("distance: " + distance);
	// Time calculations for days, hours, minutes and seconds

	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	// var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	// Display the result in the element with id="display"
	var differenceTime = days + "dd " + hours + "hh " +
		minutes + "mm";

	console.log("differenceTime: " + differenceTime);
	if (distance <= 0) {
		return "Expired";
	}
	return differenceTime;
}

function get_time_diff(datetime) {
	var datetime = typeof datetime !== 'undefined' ? datetime : "2014-01-01 01:02:03.123456";

	datetime = new Date(datetime).getTime();
	var now = new Date().getTime();

	if (isNaN(datetime)) {
		return "";
	}

	// console.log( datetime + " " + now);
	// if (datetime < now) {
	//     var milisec_diff = now - datetime;
	// }else{
	//     var milisec_diff = datetime - now;
	// }

	var milisec_diff = datetime - now;

	var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));

	var date_diff = new Date(milisec_diff);

	return days + "D " + date_diff.getHours() + "H " + date_diff.getMinutes() + "M ";
	// return days + " Days "+ date_diff.getHours() + " Hours " + date_diff.getMinutes() + " Minutes " + date_diff.getSeconds() + " Seconds";
}

// data in function GetTimeInTaskapp = 
// {"Result":"OK","Records":[{"caseId":191,"username":"test0010","radioUsername":"test0003","triggerAt":"2020-11-30T18:46:41.620Z"}]}


function GetTimeInTaskappCaseIdAPI(caseId) {
	var function_name = "GetTimeInTaskappCaseIdAPI";
	// console.log("function_name : " + function_name + " => start");
	params = { caseId: caseId };
	return new Promise(function (resolve, reject) {
		var url = "/api/tasks/select/" + caseId;
		$.post(url, params, function (data) {
			//{"status":{"code":200},"Records":[{"caseId":207,"username":"test0010","radioUsername":"test0003","triggerAt":"2020-12-02T18:41:31.473Z"}]}
			if (data.status.code == 200 && data.Records.length > 0) {
				resolve(data);
			} else {
				resolve(null);
			}
		}).fail((error) => {
			reject(error);
		})
	});
}


function GetTimeInTaskappList() {
	var function_name = "GetTimeInTaskapp";
	// console.log("function_name : " + function_name + " => start");
	// params = {caseId: caseId};
	params = "";
	return new Promise(function (resolve, reject) {
		var url = "/api/tasks/list";
		$.post(url, params, function (data) {
			console.log("data in function " + function_name + " = " + JSON.stringify(data));
			resolve(data);
		}).catch(function (error) {
			reject(error);
		})
	});
}

module.exports = {
	doGetCookie,
	calcDate,
	GetTimeInTaskappCaseIdAPI,
}

