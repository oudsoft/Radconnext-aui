/* utilmod.js */

/* internal functions */
let wsm, wsl;

const formatDateStr = function (d) {
	var yy, mm, dd;
	yy = d.getFullYear();
	if (d.getMonth() + 1 < 10) {
		mm = '0' + (d.getMonth() + 1);
	} else {
		mm = '' + (d.getMonth() + 1);
	}
	if (d.getDate() < 10) {
		dd = '0' + d.getDate();
	} else {
		dd = '' + d.getDate();
	}
	var td = `${yy}-${mm}-${dd}`;
	return td;
}

const formatTimeStr = function (d) {
	var hh, mn, ss;
	hh = d.getHours();
	mn = d.getMinutes();
	ss = d.getSeconds();
	var td = `${hh}:${mn}:${ss}`;
	return td;
}

const formatDate = function (dateStr) {
	var fdate = new Date(dateStr);
	var mm, dd;
	if (fdate.getMonth() + 1 < 10) {
		mm = '0' + (fdate.getMonth() + 1);
	} else {
		mm = '' + (fdate.getMonth() + 1);
	}
	if (fdate.getDate() < 10) {
		dd = '0' + fdate.getDate();
	} else {
		dd = '' + fdate.getDate();
	}
	var date = fdate.getFullYear() + (mm) + dd;
	return date;
}

const videoConstraints = { video: { displaySurface: "application", height: 1080, width: 1920 } };

const doGetScreenSignalError = function (e) {
	var error = {
		name: e.name || 'UnKnown',
		message: e.message || 'UnKnown',
		stack: e.stack || 'UnKnown'
	};

	if (error.name === 'PermissionDeniedError') {
		if (location.protocol !== 'https:') {
			error.message = 'Please use HTTPs.';
			error.stack = 'HTTPs is required.';
		}
	}

	console.error(error.name);
	console.error(error.message);
	console.error(error.stack);

	alert('Unable to capture your screen.\n\n' + error.name + '\n\n' + error.message + '\n\n' + error.stack);
}

/* export function */
exports.getTodayDevFormat = function () {
	var d = new Date();
	return formatDateStr(d);
}

exports.getToday = function () {
	var d = new Date();
	var td = formatDateStr(d);
	return formatDate(td);
}

exports.getYesterday = function () {
	var d = new Date();
	d.setDate(d.getDate() - 1);
	var td = formatDateStr(d);
	return formatDate(td);
}

exports.getDateLastWeek = function () {
	var days = 7;
	var d = new Date();
	var last = new Date(d.getTime() - (days * 24 * 60 * 60 * 1000));
	var td = formatDateStr(last);
	return formatDate(td);
}

exports.getDateLastMonth = function () {
	var d = new Date();
	d.setDate(d.getDate() - 31);
	var td = formatDateStr(d);
	return formatDate(td);
}

exports.getDateLast3Month = function () {
	var d = new Date();
	d.setMonth(d.getMonth() - 3);
	var td = formatDateStr(d);
	return formatDate(td);
}

exports.getDateLastYear = function () {
	var d = new Date();
	d.setFullYear(d.getFullYear() - 1);
	var td = formatDateStr(d);
	return formatDate(td);
}

exports.getFomateDateTime = function (date) {
	var todate = formatDateStr(date);
	var totime = formatTimeStr(date);
	return todate + 'T' + totime;
}

exports.getAge = function (dateString) {
	var dob = dateString;
	var yy = dob.substr(0, 4);
	var mo = dob.substr(4, 2);
	var dd = dob.substr(6, 2);
	var dobf = yy + '-' + mo + '-' + dd;
	var today = new Date();
	var birthDate = new Date(dobf);
	var age = today.getFullYear() - birthDate.getFullYear();
	var ageTime = today.getTime() - birthDate.getTime();
	ageTime = new Date(ageTime);
	if (age > 0) {
		if ((ageTime.getMonth() > 0) || (ageTime.getDate() > 0)) {
			age = (age + 1) + 'Y';
		} else {
			age = age + 'Y';
		}
	} else {
		if (ageTime.getMonth() > 0) {
			age = ageTime.getMonth() + 'M';
		} else if (ageTime.getDate() > 0) {
			age = ageTime.getDate() + 'D';
		}
	}
	return age;
}
exports.formatStudyDate = function (studydateStr) {
	if (studydateStr.length >= 8) {
		var yy = studydateStr.substr(0, 4);
		var mo = studydateStr.substr(4, 2);
		var dd = studydateStr.substr(6, 2);
		var stddf = yy + '-' + mo + '-' + dd;
		var stdDate = new Date(stddf);
		var month = stdDate.toLocaleString('default', { month: 'short' });
		return Number(dd) + ' ' + month + ' ' + yy;
	} else {
		return studydateStr;
	}
}
exports.formatStudyTime = function (studytimeStr) {
	if (studytimeStr.length >= 4) {
		var hh = studytimeStr.substr(0, 2);
		var mn = studytimeStr.substr(2, 2);
		return hh + '.' + mn;
	} else {
		return studytimeStr;
	}
}
exports.getDatetimeValue = function (studydateStr, studytimeStr) {
	if ((studydateStr.length >= 8) && (studytimeStr.length >= 6)) {
		var yy = studydateStr.substr(0, 4);
		var mo = studydateStr.substr(4, 2);
		var dd = studydateStr.substr(6, 2);
		var hh = studytimeStr.substr(0, 2);
		var mn = studytimeStr.substr(2, 2);
		var ss = studytimeStr.substr(4, 2);
		var stddf = yy + '-' + mo + '-' + dd + ' ' + hh + ':' + mn + ':' + ss;
		var stdDate = new Date(stddf);
		return stdDate.getTime();
	}
}
exports.formatDateDev = function (dateStr) {
	if (dateStr.length >= 8) {
		var yy = dateStr.substr(0, 4);
		var mo = dateStr.substr(4, 2);
		var dd = dateStr.substr(6, 2);
		var stddf = yy + '-' + mo + '-' + dd;
		return stddf;
	} else {
		return;
	}
}

exports.invokeGetDisplayMedia = function (success) {
	if (navigator.mediaDevices.getDisplayMedia) {
		navigator.mediaDevices.getDisplayMedia(videoConstraints).then(success).catch(doGetScreenSignalError);
	} else {
		navigator.getDisplayMedia(videoConstraints).then(success).catch(doGetScreenSignalError);
	}
}

exports.addStreamStopListener = function (stream, callback) {
	stream.getTracks().forEach(function (track) {
		track.addEventListener('ended', function () {
			callback();
		}, false);
	});
}

exports.base64ToBlob = function (base64, mime) {
	mime = mime || '';
	var sliceSize = 1024;
	var byteChars = window.atob(base64);
	var byteArrays = [];

	for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
		var slice = byteChars.slice(offset, offset + sliceSize);

		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		var byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	return new Blob(byteArrays, { type: mime });
}

exports.windowMinimize = function () {
	window.innerWidth = 100;
	window.innerHeight = 100;
	window.screenX = screen.width;
	window.screenY = screen.height;
	alwaysLowered = true;
}

exports.windowMaximize = function () {
	window.innerWidth = screen.width;
	window.innerHeight = screen.height;
	window.screenX = 0;
	window.screenY = 0;
	alwaysLowered = false;
}

exports.doAssignWsm = function (socket) {
	wsm = socket;
}

exports.doAssignWsl = function (socket) {
	wsl = socket;
}

exports.doConnectWebsocketMaster = function (username, hospitalId, type) {
	console.log("doConnectWebsocketMaster in utilmod running");
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
		console.log("wsm.onmessage: " +  msgEvt.data);
		if (data.type !== 'test') {
			let masterNotify = localStorage.getItem('masternotify');
			let MasterNotify = JSON.parse(masterNotify);
			if (MasterNotify) {
				MasterNotify.push({ notify: data, datetime: new Date(), status: 'new' });
			} else {
				MasterNotify = [];
				MasterNotify.push({ notify: data, datetime: new Date(), status: 'new' });
			}
			localStorage.setItem('masternotify', JSON.stringify(MasterNotify));
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
	};

	wsm.onclose = function (event) {
		//console.log("Master WebSocket is closed now. with  event:=> ", event);
	};

	wsm.onerror = function (err) {
		console.log("Master WS Got error", err);
	};

	return wsm;
}


// exports.doConnectWebsocketMaster = function (username, hospitalId, type) {
// 	const hostname = window.location.hostname;
// 	const port = window.location.port;
// 	const paths = window.location.pathname.split('/');
// 	const rootname = paths[1];

// 	const wsUrl = 'wss://' + hostname + ':' + port + '/' + rootname + '/' + username + '/' + hospitalId + '?type=' + type;
// 	const wsm = new WebSocket(wsUrl);
// 	wsm.onopen = function () {
// 		console.log('Master Websocket is connected to the signaling server');
// 	};

// 	wsm.onmessage = function (msgEvt) {
// 		let data = JSON.parse(msgEvt.data);
// 		console.log(data);
// 		if (data.type !== 'test') {
// 			let masterNotify = localStorage.getItem('masternotify');
// 			let MasterNotify = JSON.parse(masterNotify);
// 			if (MasterNotify) {
// 				MasterNotify.push({ notify: data, datetime: new Date(), status: 'new' });
// 			} else {
// 				MasterNotify = [];
// 				MasterNotify.push({ notify: data, datetime: new Date(), status: 'new' });
// 			}
// 			localStorage.setItem('masternotify', JSON.stringify(MasterNotify));
// 		}
// 		if (data.type == 'test') {
// 			$.notify(data.message, "success");
// 		} else if (data.type == 'trigger') {
// 			if (wsl) {
// 				let message = { type: 'trigger', dcmname: data.dcmname, StudyInstanceUID: data.studyInstanceUID, owner: data.ownere };
// 				wsl.send(JSON.stringify(message));
// 				$.notify('The system will be start store dicom to your local.', "success");
// 			}
// 		} else if (data.type == 'notify') {
// 			$.notify(data.message, "warnning");
// 		} else if (data.type == 'exec') {
// 			if (wsl) {
// 				wsl.send(JSON.stringify(data));
// 			}
// 		} else if (data.type == 'cfindresult') {
// 			let remoteDicom = document.getElementById('RemoteDicom');
// 			remoteDicom.dispatchEvent(new CustomEvent("cfindresult", { detail: { data: data.result, owner: data.owner, hospitalId: data.hospitalId } }));
// 		} else if (data.type == 'move') {
// 			if (wsl) {
// 				wsl.send(JSON.stringify(data));
// 			}
// 		} else if (data.type == 'cmoveresult') {
// 			let remoteDicom = document.getElementById('RemoteDicom');
// 			remoteDicom.dispatchEvent(new CustomEvent("cmoveresult", { detail: { data: data.result, owner: data.owner, hospitalId: data.hospitalId } }));
// 		} else if (data.type == 'run') {
// 			if (wsl) {
// 				wsl.send(JSON.stringify(data));
// 			}
// 		} else if (data.type == 'runresult') {
// 			//let remoteDicom = document.getElementById('RemoteDicom');
// 			remoteDicom.dispatchEvent(new CustomEvent("runresult", { detail: { data: data.result, owner: data.owner, hospitalId: data.hospitalId } }));
// 		}
// 	};

// 	wsm.onclose = function (event) {
// 		console.log("Master WebSocket is closed now. with  event:=> ", event);
// 	};

// 	wsm.onerror = function (err) {
// 		console.log("Master WS Got error", err);
// 	};

// 	return wsm;
// }

exports.doConnectWebsocketLocal = function (username) {
	let wsUrl = 'wss://localhost:3000/api/' + username + '?type=test';
	let wsl;
	try {
		wsl = new WebSocket(wsUrl);
		wsl.onopen = function () {
			console.log('Local Websocket is connected to the signaling server')
		};

		wsl.onmessage = function (msgEvt) {
			let data = JSON.parse(msgEvt.data);
			console.log(data);
			if (data.type !== 'test') {
				var localNotify = localStorage.getItem('localnotify');
				var LocalNotify = JSON.parse(localNotify);
				if (LocalNotify) {
					LocalNotify.push({ notify: data, datetime: new Date(), status: 'new' });
				} else {
					LocalNotify = [];
					LocalNotify.push({ notify: data, datetime: new Date(), status: 'new' });
				}
				localStorage.setItem('localnotify', JSON.stringify(LocalNotify));
			}
			if (data.type == 'test') {
				$.notify(data.message, "success");
			} else if (data.type == 'result') {
				$.notify(data.message, "success");
			} else if (data.type == 'notify') {
				$.notify(data.message, "warnning");
			} else if (data.type == 'exec') {
				//Send result of exec back to websocket server
				wsm.send(JSON.stringify(data.data));
			} else if (data.type == 'move') {
				wsm.send(JSON.stringify(data.data));
			} else if (data.type == 'run') {
				wsm.send(JSON.stringify(data.data));
			}
		};

		wsl.onclose = function (event) {
			console.log("Local WebSocket is closed now. with  event:=> ", event);
		};

		wsl.onerror = function (err) {
			console.log("Local WS Got error", err);
		};

		return wsl;

	} catch (error) {
		console.log('I can not connect to local socket with error message => ' + error);
		return;
	}
}

exports.calcDate = function(date1,date2,types) {
	var diff = Math.floor(date1.getTime() - date2.getTime());
	var day = 1000 * 60 * 60 * 24;
 
	var days = Math.floor(diff/day);
	var months = Math.floor(days/31);
	var years = Math.floor(months/12);
 
	var message = date2.toDateString();
	message += " was "; 
	message += days + " days " ; 
	message += months + " months "; 
	message += years + " years ago \n";

	if(types == "years") {return years;}
	if(types == "months") {return months%12;}
	if(types == "days") {return days%31;}
	
	return null;
}
