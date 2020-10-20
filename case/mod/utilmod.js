/* utilmod.js */

/* internal functions */
const formatDateStr = function(d) {
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

const formatDate = function(dateStr) {
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

const videoConstraints = {video: {displaySurface: "application", height: 1080, width: 1920 }};

const doGetScreenSignalError = function(e) {
	var error = {
		name: e.name || 'UnKnown',
		message: e.message || 'UnKnown',
		stack: e.stack || 'UnKnown'
	};

	if(error.name === 'PermissionDeniedError') {
		if(location.protocol !== 'https:') {
			error.message = 'Please use HTTPs.';
			error.stack   = 'HTTPs is required.';
		}
	}

	console.error(error.name);
	console.error(error.message);
	console.error(error.stack);

	alert('Unable to capture your screen.\n\n' + error.name + '\n\n' + error.message + '\n\n' + error.stack);
}

/* export function */
exports.getTodayDevFormat = function(){
	var d = new Date();
	return formatDateStr(d);
}

exports.getToday = function(){
	var d = new Date();
	var td = formatDateStr(d);
	return formatDate(td);
}

exports.getYesterday = function() {
	var d = new Date();
	d.setDate(d.getDate() - 1);
	var td = formatDateStr(d);
	return formatDate(td);
}

exports.getDateLastWeek = function(){
	var days = 7;
	var d = new Date();
	var last = new Date(d.getTime() - (days * 24 * 60 * 60 * 1000));
	var td = formatDateStr(last);
	return formatDate(td);
}

exports.getDateLastMonth = function(){
	var d = new Date();
	d.setDate(d.getDate() - 31);
	var td = formatDateStr(d);
	return formatDate(td);
}

exports.getDateLast3Month = function(){
	var d = new Date();
	d.setMonth(d.getMonth() - 3);
	var td = formatDateStr(d);
	return formatDate(td);
}

exports.getDateLastYear = function(){
	var d = new Date();
	d.setFullYear(d.getFullYear() - 1);
	var td = formatDateStr(d);
	return formatDate(td);
}

exports.getAge = function(dateString) {
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
exports.formatStudyDate = function(studydateStr){
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
exports.formatStudyTime = function(studytimeStr){
	if (studytimeStr.length >= 4) {
		var hh = studytimeStr.substr(0, 2);
		var mn = studytimeStr.substr(2, 2);
		return hh + '.' + mn;
	} else {
		return studytimeStr;
	}
}
exports.getDatetimeValue = function(studydateStr, studytimeStr){
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
exports.formatDateDev = function(dateStr) {
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
exports.invokeGetDisplayMedia = function(success) {
	if(navigator.mediaDevices.getDisplayMedia) {
    navigator.mediaDevices.getDisplayMedia(videoConstraints).then(success).catch(doGetScreenSignalError);
  } else {
    navigator.getDisplayMedia(videoConstraints).then(success).catch(doGetScreenSignalError);
  }
}

exports.addStreamStopListener = function(stream, callback) {
	stream.getTracks().forEach(function(track) {
		track.addEventListener('ended', function() {
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

	return new Blob(byteArrays, {type: mime});
}

exports.windowMinimize = function (){
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
