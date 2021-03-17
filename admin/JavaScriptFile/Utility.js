
exports.GetTimeInTaskappCaseIdAPI = async function(caseId) {
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

exports.CaseTimerInTable = function(starttime) {
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

exports.ObjectSize = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
}

exports.doConnectWebsocketMaster = function(username, hospitalId, type) {
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

exports.doConnectWebsocketLocal = function(username) {
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

exports.sortMasterNotifyFunction = function(notify) {
	let results = notify.sort((a, b) =>
		new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
	);
	return results;
}

exports.showNotification = function() {
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

exports.getTriggerAt = function(caseId) {
	var data = GetTimeInTaskappCaseIdAPI(caseId);
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

exports.ReloadMessageNotify = function() {
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
		var data = GetTimeInTaskappCaseIdAPI(MessagesFromWSM[i].notify.caseId);
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

exports.MessageNotifys =  function() {
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

exports.ReturnUserType =  function(typeid) {
	if (typeid == 1) {
		return "Admin";
	}
	if (typeid == 2) {
		return "Technician";
	}
	if (typeid == 3) {
		return "Radiologist";
	}
	if (typeid == 4) {
		return "RefferalDocter";
	}
	if (typeid == 5) {
		return "Accountant";
	}
	if (typeid == 6) {
		return "DepartmentPublicComputer";
	}
	if (typeid == 7) {
		return "Patient";
	}
	return "";
}

exports.ReturnUserStatus = function(statusid){
	if (statusid == 1) {
		return "Active";
	}
	if (statusid == 2) {
		return "Inactive";
	}
	if (statusid == 3) {
		return "Pending";
	}
}
