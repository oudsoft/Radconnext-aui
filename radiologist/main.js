/* main.js */

window.$ = window.jQuery = require('jquery');

const radio = require('./mod/radio.js')($);
//const doctor = require('./mod/doctor.js')($);
//const hospital = require('./mod/hospital.js')($);
//const urgent = require('./mod/urgent.js')($);
const apiconnector = require('../case/mod/apiconnect.js')($);
const util = require('../case/mod/utilmod.js')($);
/*
ต
*/

var wsm;

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
			if (response.success == false) {
				$('input[type="text"]').css({"border":"2px solid red","box-shadow":"0 0 3px red"});
				$('input[type="password"]').css({"border":"2px solid #00F5FF","box-shadow":"0 0 5px #00F5FF"});
				$('#login-msg').html('<p>Username or Password incorrect. Please try with other username and password again.</p>');
				$('#login-msg').show();
			} else {
				//Save resBody to cookie.
        $('#login-msg').show();
        localStorage.setItem('token', response.token);
        localStorage.setItem('userdata', JSON.stringify(response.data));
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
	localStorage.removeItem('masternotify');
  $('#LogoutCommand').hide();
  let url = '/';
  window.location.replace(url);
}

function doLoadMainPage(){
  let jqueryUiCssUrl = "../../lib/jquery-ui.min.css";
	let jqueryUiJsUrl = "../../lib/jquery-ui.min.js";
	let jqueryLoadingUrl = '../../lib/jquery.loading.min.js';
	let jqueryNotifyUrl = '../../lib/notify.min.js';
	let countdownclockPluginUrl = "../plugin/jquery-countdown-clock-plugin.js";

	$('head').append('<script src="' + jqueryUiJsUrl + '"></script>');
	$('head').append('<link rel="stylesheet" href="' + jqueryUiCssUrl + '" type="text/css" />');
	//https://carlosbonetti.github.io/jquery-loading/
	$('head').append('<script src="' + jqueryLoadingUrl + '"></script>');
	//https://notifyjs.jpillora.com/
	$('head').append('<script src="' + jqueryNotifyUrl + '"></script>');

	$('head').append('<script src="' + countdownclockPluginUrl + '"></script>');

  $('body').append($('<div id="overlay"><div class="loader"></div></div>'));

  $('body').loading({overlay: $("#overlay"), stoppable: true});
  $('body').loading('stop');

  $('#HistoryDialogBox').dialog({
    modal: true, autoOpen: false, width: 350, resizable: false, title: 'ประวัติผู้ป่วย'
  });

	document.addEventListener("callzoominterrupt", doInterruptZoomCallEvt);

  let userdata = JSON.parse(doGetUserData());

	$('#app').load('form/main.html', function(){
		$("#User-Identify").text(userdata.userinfo.User_NameEN + ' ' + userdata.userinfo.User_LastNameEN);
		$("#User-Identify").click(function(){
			doShowUserProfile();
		});
		$("#Radio-Cmd").click(function(){
			//doShowRadio()
			doShowHospital();
		});
		$("#Setting-Cmd").click(function(){
			let url = '/';
	    window.location.replace(url);
		});

    /*
		$("#Doctor-Cmd").click(function(){
			doShowMainDoctor();
		});
		$("#Hotpital-Cmd").click(function(){
			doShowMainHotpital();
		});
		$("#Setting-Cmd").click(function(){
			doShowSetting();
		});
    */
		$("#Logout-Cmd").click(function(){
			doUserLogout();
		});

		doShowHospital();
    wsm = util.doConnectWebsocketMaster(userdata.username, userdata.hospitalId, 'remote');
	});
}

const accordionIcons = {
	header: "ui-icon-circle-arrow-e",
	activeHeader: "ui-icon-circle-arrow-s"
};

function doShowHospital() {
	$(".row").show();
	radio.doLoadHospitalList().then((result) => {
		$(".submenu").empty().append("<div>โปรดเลือกโรงพยาบาล</div>");
		let hospitalSelector = $("<select id='HospitalSelector'></select>");
		$(hospitalSelector).appendTo($(".submenu"));
		let hospitalList = result.Options;
		hospitalList.forEach((item, i) => {
			$(hospitalSelector).append("<option value='" + item.Value + "'>" + item.DisplayText + "</option>");
		});
		$(hospitalSelector).on('change',(e)=> {
			let hosSelected = $(hospitalSelector).val();
			doShowRadioList(hosSelected);
		});
		$(hospitalSelector).change();
	});
}

function doShowRadioList(hosSelected) {
	radio.doLoadRadioList(hosSelected).then((result) => {
		$(".main").empty().append("<div>โปรดเลือกหมอ</div>");
		let radioSelector = $("<select id='RadiologistSelector'></select>");
		$(radioSelector).appendTo($(".main"));
		let radioList = result.Records;
		if ((radioList) && (radioList.length > 0)) {
		radioList.forEach((item, i) => {
			/*
			let radioDisplayName;
			if (item.userinfo.User_NameTH) {
				radioDisplayName = item.userinfo.User_NameTH + ' ' + item.userinfo.User_LastNameTH;
			} else  if (item.userinfo.User_NameEN) {
				radioDisplayName = item.userinfo.User_NameEN + ' ' + item.userinfo.User_LastNameEN;
			} else {
				radioDisplayName = item.userinfo.User_NameEN + ' ' + item.userinfo.User_LastNameEN;
			}
			*/
			$(radioSelector).append("<option value='" + item.Value + "'>" + item.DisplayText + "</option>");
		});
			$(radioSelector).on('change',(e)=> {
				let radioSelected = $(radioSelector).val();
				doShowRadio(radioSelected);
			});
			$(radioSelector).change();
		}
	});
}

function doShowRadio(radioSelected) {
	$('#RadioAccordion').remove();
	let radioAccordion = $('<div id="RadioAccordion" class="RadiologistAccordion"></div>');
	let caseSection = $('<h3>เคส</h3> <div id="CaseSection" class="SectionContent"></div>');
	$(caseSection).appendTo($(radioAccordion));
	let workSchSection = $('<h3>ตารางเวร</h3> <div id="WorkScheduleSection" class="SectionContent"></div>');
	$(workSchSection).appendTo($(radioAccordion));
	let toolSection = $('<h3>เครื่องมือ</h3> <div id="ToolSection" class="SectionContent"></div>');
	$(toolSection).appendTo($(radioAccordion));
	$(radioAccordion).accordion({	icons: accordionIcons, heightStyle: "content" });
	$(radioAccordion).accordion({activate: function( event, ui ) {
		//console.log('ui=>', ui.newHeader[0]);
		var active = $(radioAccordion).accordion( "option", "active" );
		//console.log('active=>', active);
		switch (active) {
			case 0:
				doShowCase(radioSelected)
			break;
			case 1:
				doShowWorkSchedules(radioSelected)
			break;
			case 2:
				doShowTools(radioSelected)
			break;
		}
	}});
	/* Setup Defualt radio page */
	$(radioAccordion).accordion( "option", "active", 0 );
	doShowCase(radioSelected);
	$(radioAccordion).appendTo($('.main'));
}

function doShowCase(radioId) {
	$('body').loading('start');
	radio.doLoadCaseList(radioId).then(async (result) => {
		$('#CaseSection').empty();
		let caseClassifyTabs = await doCreateClassifyCase(result.Records);
		$('#CaseSection').append($(caseClassifyTabs).tabs({ collapsible: true }));
		$('body').loading('stop');
	})
}

function doCreateClassifyCase(cases){
	return new Promise(function(resolve, reject){
		let caseClassifyTabs = $('<div id="CaseClassify"><ul><li><a href="#NewCase">เคสใหม่<span id="NewCaseHot" class="Hot">(0)</span></a></li><li><a href="#WaitResponse">เคสรอผลอ่าน<span id="WaitResponseHot" class="Hot">(0)</span></a></li><li><a href="#AllCase">เคสทั้งหมด<span id="AllCaseSum"></span></a></li></ul></div>')
		let newCaseTab = $('<div id="NewCase" class="CaseClassifyContent"></div>');
		$(newCaseTab).appendTo($(caseClassifyTabs));
		let waitResponseCaseTab = $('<div id="WaitResponse" class="CaseClassifyContent"></div>');
		$(waitResponseCaseTab).appendTo($(caseClassifyTabs));
		let allCaseTab = $('<div id="AllCase" class="CaseClassifyContent"></div>');
		$(allCaseTab).appendTo($(caseClassifyTabs));
		let searchCaseForm = doCreateSearchCaseForm();
		$(allCaseTab).empty().append($(searchCaseForm));
		$(allCaseTab).on('searchcase', (e, data)=>{
			$('body').loading('start');
			let radioSelected = $('#RadiologistSelector').val();
			let statusId = [1, 2, 5];
			let conditionSearch = {hospitalId: data.hospitalId, key: data.key, value: data.value, statusId: statusId};
			let searchResultDiv = $('<div style="margin-top: 10px;"></div>');
			$(searchResultDiv).appendTo($(allCaseTab));
			radio.doSearchCase(radioSelected, conditionSearch).then((result)=>{
				console.log(result);
				let caseItems = result.Records;
				caseItems.forEach(async (item, i) => {
					let caseAccordion = await doCreateCaseAccordion(item);
					$(searchResultDiv).append($(caseAccordion));
				});
				$('body').loading('stop');
			});
		})

		var promiseList = new Promise(function(resolve, reject){
			let newCount = 0;
			let waitCount = 0;
			if ((cases) && (cases.length > 0)) {
				cases.forEach(async (item, i) => {
					//console.log(JSON.stringify(item));
					let caseAccordion = await doCreateCaseAccordion(item);
					let findId = '#CaseContent-'+item.case.id;
					let actionRow;
					let tableLine;
					let tableRow;
					let rowDetail;
					switch (item.case.casestatusId) {
						case 1:
							newCount++;
							$(newCaseTab).append($(caseAccordion));
							actionRow = doCreateNewStatusCaseAction(item);
							$($(caseAccordion)).find(findId).append($(actionRow));
						break;
						case 2:
							waitCount++;
							$(waitResponseCaseTab).append($(caseAccordion));
							tableLine = $('<div style="display: table"></div>');
							tableRow = $('<div style="display: table-row"></div>');
							rowDetail = $('<div style="display: table-cell; width: 650px;" class="HorBar"><b>Your Response</b></div>');
							$(tableRow).append($(rowDetail));
							$(tableLine).append($(tableRow));
							$($(caseAccordion)).find(findId).append($(tableLine));
							actionRow = await doCreateAcceptStatusCaseAction(item);
							$($(caseAccordion)).find(findId).append($(actionRow));
						break;
					}
				});
				setTimeout(()=> {
					$(caseClassifyTabs).find('#NewCaseHot').text('(' + newCount + ')');
					$(caseClassifyTabs).find('#WaitResponseHot').text('(' + waitCount + ')');
					resolve(cases);
				}, 400);
			} else {
				resolve();
			}
		});
		Promise.all([promiseList]).then((ob)=>{
			resolve($(caseClassifyTabs));
		})
	});
}

function doCreateCaseAccordion(item){
	return new Promise(async function(resolve, reject){
		let caseDetailTitle = 'ร.พ. ' + item.case.hospital.Hos_Name + ' ' + item.case.patient.Patient_NameEN + ' ' + item.case.patient.Patient_LastNameEN + ' ' + item.case.Case_ProtocolName;
		let caseDetail = await doCreateCaseDetail(item);
		let caseAccordion = $('<div class="CaseClassifyContent"></div>');
		let caseHeader = $('<h3>' + caseDetailTitle + '</h3>');
		let caseDetailContent =  $('<div id="CaseContent-' + item.case.id + '" class="CaseContent"></div>');
		$(caseDetailContent).append($(caseDetail));
		$(caseAccordion).append($(caseHeader));
		$(caseAccordion).append($(caseDetailContent));
		$(caseAccordion).accordion({icons: accordionIcons, heightStyle: "content", collapsible: true,  active: 1 });
		resolve($(caseAccordion));
	});
};

function doCreateCaseDetail(caseItem){
	return new Promise(async function(resolve, reject){
		let tableCaseDetail = $('<div id="CaseDetailTable" style="display: table"></div>');

		let caseDateTime = new Date(caseItem.case.createdAt);
		let caseDatetimeFormat = util.getFomateDateTime(caseDateTime);
		let casedatetime = caseDatetimeFormat.split('T');

		let casedateSegment = casedatetime[0].split('-');
		casedateSegment = casedateSegment.join('');
		let casedate = util.formatStudyDate(casedateSegment);
		let casetime = util.formatStudyTime(casedatetime[1].split(':').join(''));

		let lastUpdDateTime = new Date(caseItem.case.updatedAt);
		let lastUpdDatetimeFormat = util.getFomateDateTime(lastUpdDateTime);
		let lastUpddatetime = lastUpdDatetimeFormat.split('T');

		let lastUpddateSegment = lastUpddatetime[0].split('-');
		lastUpddateSegment = lastUpddateSegment.join('');
		let lastUpddate = util.formatStudyDate(lastUpddateSegment);
		let lastUpdtime = util.formatStudyTime(lastUpddatetime[1].split(':').join(''));

		let tableRow = $('<div style="display: table-row"></div>');
		let rowDetail = $('<div style="display: table-cell; width: 200px;"><b>ส่งเคสเมื่อวันที่/เวลา</b></div><div style="display: table-cell"><div style="float: left;">' + casedate + '</div><div class="CaseTime">' + casetime + '</div></div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>แก้ไขล่าสุดเมื่อวันที่/เวลา</b></div><div style="display: table-cell"><div style="float: left;">' + lastUpddate + '</div><div class="CaseTime">' + lastUpdtime + '</div></div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>ประเภทความด่วน</b></div><div style="display: table-cell"><div class="CaseTime">' + caseItem.case.urgenttype.UGType_Name + '</div></div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>สถานะเคส</b></div>');
		let caseStatusValueDiv = $('<div style="display: table-cell"><div class="CaseTime">' + caseItem.case.casestatus.CS_Name_EN + '</div></div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));
		$(caseStatusValueDiv).appendTo($(tableRow));
		if ((caseItem.case.casestatus.id == 1) || (caseItem.case.casestatus.id == 2)) {
			let caseTask = await apiconnector.doCallApi('/api/tasks/select/'+ caseItem.case.id, {});
			let caseTriggerAt = new Date(caseTask.Records[0].triggerAt);
			let diffTime = Math.abs(caseTriggerAt - new Date());
			let hh = parseInt(diffTime/(1000*60*60));
			let mn = parseInt((diffTime - (hh*1000*60*60))/(1000*60));
			let clockCountdownDiv = $('<div></div>');
			$(clockCountdownDiv).countdownclock({countToHH: hh, countToMN: mn});
			$(caseStatusValueDiv).append($(clockCountdownDiv));
		}

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>ชื่อผู้ป่วย(ไทย)</b></div><div style="display: table-cell">' + caseItem.case.patient.Patient_NameTH + ' ' + caseItem.case.patient.Patient_LastNameTH + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>ชื่อผู้ป่วย(อังกฤษ)</b></div><div style="display: table-cell">' + caseItem.case.patient.Patient_NameEN + ' ' + caseItem.case.patient.Patient_LastNameEN + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		let patientAge;
		if (caseItem.case.patient.Patient_Age) {
			patientAge = caseItem.case.patient.Patient_Age;
		} else if (caseItem.case.patient.Patient_Birthday){
			patientAge = util.getAge(caseItem.case.patient.Patient_Birthday)
		} else {
			patientAge = '-';
		}
		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>เพศ/อายุ</b></div><div style="display: table-cell">' + caseItem.case.patient.Patient_Sex + '/' + patientAge + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>HN</b></div><div style="display: table-cell">' + caseItem.case.patient.Patient_HN + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>ACC</b></div><div style="display: table-cell">' + caseItem.case.Case_ACC + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>แผนก</b></div><div style="display: table-cell">' + caseItem.case.Case_Department + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>สิทธิ์ผู้ป่วย</b></div><div style="display: table-cell">' + caseItem.case.cliameright.CR_Name + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>BodyPart</b></div><div style="display: table-cell">' + caseItem.case.Case_BodyPart + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>Modality</b></div><div style="display: table-cell">' + caseItem.case.Case_Modality + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>Manufacturer</b></div><div style="display: table-cell">' + caseItem.case.Case_Manufacturer + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>ProtocolName</b></div><div style="display: table-cell">' + caseItem.case.Case_ProtocolName + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>StudyDescription</b></div><div style="display: table-cell">' + caseItem.case.Case_StudyDescription + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		let hsLinkDiv = $('<div></div>');
		let links = caseItem.case.Case_PatientHRLink;
		if ((links) && (links.length > 0)) {
			links.forEach((item, i) => {
				let itemLink = $('<a href="../..' + item.link + '" target="_blank"><img src="../../' + item.link + '" width="120" height="auto"/></a>');
				$(hsLinkDiv).append($(itemLink));
			});
		}
		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>ประวัติผู้ป่วย</b></div><div style="display: table-cell">' + hsLinkDiv.html() + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		$(tableCaseDetail).append($(tableRow));
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>Dicom</b></div>');
		$(tableRow).append($(rowDetail));
		let rowCommand = $('<div style="display: table-cell"></div>');
		let dicomPreviewCmd = $('<img src="../../images/preview-icon.png" width="50" style="cursor: pointer;"/>');
		$(dicomPreviewCmd).click( (e) => {
			doOpenStoneWebViewer(caseItem.case.Case_StudyInstanceUID, caseItem.case.hospitalId);
		});
		$(dicomPreviewCmd).appendTo($(rowCommand));
		$(tableRow).append($(rowCommand));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>แพทย์เจ้าของไข้</b></div><div style="display: table-cell">' + caseItem.reff.User_NameTH + ' ' + caseItem.reff.User_LastNameTH + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>รายละเอียดเคส</b></div><div style="display: table-cell">' + caseItem.case.Case_DESC + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		tableRow = $('<div style="display: table-row"></div>');
		rowDetail = $('<div style="display: table-cell; width: 200px;"><b>ผู้ส่ง</b></div><div style="display: table-cell">' + caseItem.owner.User_NameTH + ' ' + caseItem.owner.User_LastNameTH + '</div>');
		$(tableRow).append($(rowDetail)).appendTo($(tableCaseDetail));

		resolve($(tableCaseDetail));
	});
}

const doOpenStoneWebViewer = function(StudyInstanceUID, hospitalId) {
	apiconnector.doGetOrthancPort(hospitalId).then((response) => {
		//const orthancStoneWebviewer = 'http://'+ window.location.hostname + ':' + response.port + '/stone-webviewer/index.html?study=';
		const orthancStoneWebviewer = 'http://'+ response.ip + ':' + response.port + '/stone-webviewer/index.html?study=';
		let orthancwebapplink = orthancStoneWebviewer + StudyInstanceUID;
		console.log('orthancwebapplink=', orthancwebapplink);
		window.open(orthancwebapplink, '_blank');
	});
}

function doChangeCaseStatus(caseId, caseDesc, newStatus){
	$('body').loading('start');
	let userdata = JSON.parse(doGetUserData());
	const userId = userdata.userId;
	const userDisplayName = userdata.userinfo.User_NameEN + ' ' + userdata.userinfo.User_LastNameEN
	let newDescription = caseDesc;
	switch (newStatus) {
		case 2:
			newDescription += '\nAccept by ' + userDisplayName;
			newDescription += ' At ' + util.getFomateDateTime(new Date());
		break;
		case 3:
			newDescription += '\nNot Accept by ' + userDisplayName;
			newDescription += ' At ' + util.getFomateDateTime(new Date());
		break;
		case 5:
			newDescription += '\nSend Response success by ' + userDisplayName;
			newDescription += ' At ' + util.getFomateDateTime(new Date());
		break;
	}
	radio.doUpdateCaseStatus(caseId, newStatus, newDescription).then((response) => {
		//doShowCase(userId);
		radioSelected = $('#RadiologistSelector').val();
		doShowCase(radioSelected);
		$('body').loading('stop');
	}).catch((err) => {
		$.notify("เกิดความผิดพลาด ไม่สามารถอัพเดทสถานะเคสไปยังเซิร์ฟเวอร์ได้ในขณะนี้", "error")
		$('body').loading('stop');
	})
}

function doCreateNewStatusCaseAction(caseItem){
	let tableRow = $('<div style="display: table-row" class="CaseTime"></div>');
	let rowDetail = $('<div style="display: table-cell; width: 200px;"><b>Your Action</b></div>');
	$(tableRow).append($(rowDetail));
	let rowCommand = $('<div style="display: table-cell"></div>');
	let caseAcceptCmd = $('<input type="button" value="Accept"/>');
	$(caseAcceptCmd).click( (e) => {
		let newStatus = 2;
		doChangeCaseStatus(caseItem.case.id, caseItem.case.Case_DESC, newStatus);
	});
	$(caseAcceptCmd).appendTo($(rowCommand));
	$(rowCommand).append('<span>  </span>')
	let caseNotAcceptCmd = $('<input type="button" value="Not Accept"/>');
	$(caseNotAcceptCmd).click( (e) => {
		let newStatus = 3;
		doChangeCaseStatus(caseItem.case.id, caseItem.case.Case_DESC, newStatus);
	});
	$(caseNotAcceptCmd).appendTo($(rowCommand));
	$(rowCommand).find('input[type="button"]').css(radio.inputStyleClass);

	$(tableRow).append($(rowCommand));

	return $(tableRow);
}

function doCreateAcceptStatusCaseAction(caseItem){
	return new Promise(function(resolve, reject){
		//let userdata = JSON.parse(doGetUserData());
		//const userId = userdata.userId;
		const radioId = $('#RadiologistSelector').val();
		radio.doLoadTemplateList(radioId).then((result)=>{
			let jqtePluginStyleUrl = '../../lib/jqte/jquery-te-1.4.0.css';
			$('head').append('<link rel="stylesheet" href="' + jqtePluginStyleUrl + '" type="text/css" />');
			let jqtePluginScriptUrl = '../../lib/jqte/jquery-te-1.4.0.min.js';
			$('head').append('<script src="' + jqtePluginScriptUrl + '"></script>');

			let simpleEditor = $('<input type="text" id="SimpleEditor"/>');

			let templates = result.Options;
			let templateSelector = $('<select id="TemplateSelector"></select>');
			$(templateSelector).css({'font-family': 'THSarabunNew', 'font-size': '24px'});
			$(templateSelector).append('<option value="0">Your Templates</option>');
			if ((templates) && (templates.length > 0)) {
				templates.forEach((item, i) => {
					$(templateSelector).append('<option value="' + item.Value + '">' + item.DisplayText + '</option>');
				});
			}
			$(templateSelector).change(async (e)=>{
				let templateId = $(templateSelector).val();
				let result = await radio.doLoadTemplate(templateId);
				if ((result.Record) && (result.Record.length > 0)) {
					$('#SimpleEditor').jqteVal(result.Record[0].Content);
				}
			});

			let sendResponseCmd = $('<input type="button" value =" Send "/>');
			$(sendResponseCmd).css({'font-family': 'THSarabunNew', 'font-size': '24px'});
			$(sendResponseCmd).click(async (e)=>{
				let responseHTML = $('#SimpleEditor').val();
				let saveData = {Response_HTML: responseHTML, type: 'normal'};
				let result = await radio.doSaveNewResponse(caseItem.case.id, radioId, saveData);
				console.log(result);
				doShowCase(radioId);
			});

			let tableLine = $('<div style="display: table"></div>');
			let tableRow = $('<div style="display: table-row"></div>');
			let rowTools = $('<div style="display: table-cell; width: 100%;"></div>');
			$(tableLine).append($(tableRow));
			$(tableRow).append($(rowTools));

			$(rowTools).append($(templateSelector));
			$(rowTools).append($(simpleEditor));
			$(rowTools).append($(sendResponseCmd));
			$(simpleEditor).jqte();
			resolve($(tableLine));
		});
	});
}

function doCallResponse(caseId) {
	return new Promise(async function(resolve, reject){
		let result = await radio.doCallResponse(caseId);
		let tableLine = $('<div style="display: table"></div>');
		let tableRow = $('<div style="display: table-row"></div>');
		let rowResponse = $('<div style="display: table-cell; width: 100%;"></div>');
		$(tableLine).append($(tableRow));
		$(tableRow).append($(rowResponse));

		if ((result.Record) && (result.Record.length > 0)) {
			$(rowResponse).append($(result.Record[0].Response_HTML));
		} else {
			$(rowResponse).append($('<div><h2>This case have exception.</h2></div>'));
		}
		resolve($(tableLine))
	});
}

function doCreateSearchCaseForm() {
	let form = $('<div style="display: table"></div>');
	$(form).append('<div style="display: table-row"><div style="display: table-cell; width: 150px;"><label>Hospital Target : </label></div><div style="display: table-cell;"><select id="HospitalSearch"></select></div></div>');
	let hospitalList = $("#HospitalSelector > option").clone();
	$(form).find('#HospitalSearch').append($(hospitalList));
	$(form).append('<div style="display: table-row"><div style="display: table-cell; width: 150px;"><label>Search Key : </label></div><div style="display: table-cell;"><select id="CaseSearchKey"><option value="PatientName">Patient Name</option><option value="PatientHN">Patient HN</option></select></div></div>');
	$(form).append('<div style="display: table-row; margin-top: 10px;"><div style="display: table-cell; width: 150px;"><label>Value :</label></div><div style="display: table-cell;"><input type="text" id="CaseSearchValue" size="30"/></div></div>');
	let searchCmdDiv = $('<div style="text-align: center; margin-top: 10px;"></div>');
	$(searchCmdDiv).appendTo($(form));
	let searchCmd = $('<input type="button" value=" Search "/>');
	$(searchCmdDiv).append($(searchCmd));
	$(searchCmd).click((e)=>{
		let hospitalSearchId = $(form).find('#HospitalSearch').val();
		let searchKey = $(form).find('#CaseSearchKey').val();
		let searchValue = $(form).find('#CaseSearchValue').val();
		if (searchValue !== '') {
			$(form).find('#CaseSearchValue').css('border', '');
			let eventData = {hospitalId: hospitalSearchId, key: searchKey, value: searchValue};
			$(searchCmd).trigger('searchcase', [eventData]);
		} else {
			$(form).find('#CaseSearchValue').css('border', '1px solid red');
		}
	})
	$(form).css(radio.inputStyleClass);
	$(form).find('input[type="text"]').css(radio.inputStyleClass);
	$(form).find('input[type="button"]').css(radio.inputStyleClass);
	$(form).find('select').css(radio.inputStyleClass);
	return $(form);
}

/* Radio Work Schedule */

function doShowWorkSchedules(radioId) {
	//$('#WorkScheduleSection').empty();
	//let controlForm = await doCreateHospitalJoinForm(radioId);
	$('#WorkScheduleSection').on('togglemainform', async (e, data)=>{
		$('body').loading('start');
		$('#WorkScheduleSection').find('#HospitalJoinForm').remove();
		let controlForm = await radio.doCreateHospitalJoinForm(radioId);
		$('#WorkScheduleSection').append($(controlForm));
		$(controlForm).on('openjoinconfig', (e, data)=>{
			$('body').loading('start');
			//console.log(data);
			let configForm = radio.doCreateJoinConfigurationForm(radioId);
			$(controlForm).empty().append($(configForm));
			$('body').loading('stop');
		});
		$(controlForm).on('loadschedule', async (e, data)=>{
			$('body').loading('start');
			console.log(data);
			let acceptCaseConfigData = await radio.doLoadAcceptCaseConfig(data.radioId, data.joinId);
			let acceptCaseConfigForm = await radio.doCreateAcceptCaseConfigForm(acceptCaseConfigData, data.radioId, data.joinId);
			$(controlForm).find('#AcceptCaseConfigForm').remove();
			$(controlForm).append($(acceptCaseConfigForm));
			$('body').loading('stop');
		});
		$('body').loading('stop');
	});
	$('#WorkScheduleSection').find('#HospitalJoinForm').remove();
	let eventData = {radioId: radioId};
	$('#WorkScheduleSection').trigger('togglemainform', [eventData]);
}

/* Radio Tools Section */

function doShowTools(radioId) {
	$('body').loading('start');
	let userdata = JSON.parse(doGetUserData());
	$('#ToolSection').empty();
	let toolsTabs = $('<div id="ToolsTabs"><ul><li><a href="#RemoteDicom">Remote Dicom</a></li><li><a href="#Template">Template</a></li><li><a href="#Message">Message</a></li><li><a href="#Other">Other</a></li></ul></div>')
	let remoteDicomTab = $('<div id="RemoteDicom" class="CaseClassifyContent"></div>');
	let searchForm = radio.doCreateSearchDicomForm(userdata.username);
	$(remoteDicomTab).append($(searchForm));
	$(remoteDicomTab).appendTo($(toolsTabs));
	searchForm.on('searchexec', radio.doFindExec);

	$(remoteDicomTab).on('cfindresult', (e, data)=>{
		$(remoteDicomTab).find('#CfindResultDiv').remove();
		$(remoteDicomTab).find('#CmoveResultDiv').remove();
		let result = data.result;
		let hospitalId = data.hospitalId;
		let queryPath = data.queryPath;
		radio.doShowFindResult(result, hospitalId, remoteDicomTab, queryPath);
	});

	$(remoteDicomTab).on('cmoveresult', (e, data)=>{
		$(remoteDicomTab).find('#CmoveResultDiv').remove();
		let hospitalId = data.hospitalId;
		let patientID = data.patientID;
		radio.doMoveResult(hospitalId, patientID, remoteDicomTab);
	});

	let templateTab = $('<div id="Template" class="CaseClassifyContent"></div>');
	$(templateTab).appendTo($(toolsTabs));
	radio.doCreateTemplate(radioId).then((radioTemplate)=>{
		$(templateTab).append($(radioTemplate));
	});

	$(toolsTabs).find('#Message').empty();
	let messageTab = $('<div id="Message" class="CaseClassifyContent"></div>');
	$(messageTab).appendTo($(toolsTabs));
	radio.doShowMessage(radioId, messageTab).then((radioMessage)=>{
		$(messageTab).append($(radioMessage));
	});

	let otherTab = $('<div id="Other" class="CaseClassifyContent"></div>');
	$(otherTab).appendTo($(toolsTabs));

	$('#ToolSection').append($(toolsTabs).tabs({ collapsible: true }));

	$('body').loading('stop');
}

function doInterruptZoomCallEvt(e) {
	$('body').loading('start');
	let userConfirm = confirm('คุณมีสายเรียกเข้าเพื่อ Conference ทาง Zoom\nคลิก ตกลง หรือ OK เพื่อรับสายและเปิด Zoom Conference หรือ คลิก ยกเลิก หรือ Cancel เพื่อปฏิเสธการรับสาย');
	let myWsm = doGetWsm();
	if (userConfirm) {
		let callData = e.detail.data;
		alert('Password ในการเข้าร่วม Conference ของคุณคิอ ' + callData.password + '\n');
		window.open(callData.openurl, '_blank');
		//Say yes back to caller
		let callZoomMsg = {type: 'callzoomback', sendTo: callData.sender, result: 1};
		myWsm.send(JSON.stringify(callZoomMsg));
		$('body').loading('stop');
	} else {
		//Say no back to caller
		let callZoomMsg = {type: 'callzoomback', sendTo: callData.sender, result: 0};
		myWsm.send(JSON.stringify(callZoomMsg));
		$('body').loading('stop');
	}
}
/*
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
*/

/*
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
*/
/*
function doShowSetting() {
	$("#dialog").load('form/setting-dialog.html', function(){
		$(".modal-footer").css('text-align', 'center');
		$("#SaveSetting-Cmd").click(function(){
			doSaveSetting();
		});
	})
}
*/
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
/*
function doSaveSetting() {
	alert('Now have not support yet.');
}
*/
function doGetToken(){
	return localStorage.getItem('token');
}

function doGetUserData(){
  return localStorage.getItem('userdata');
}

function doGetWsm(){
	return wsm;
}

module.exports = {
  doGetToken,
  doGetUserData,
	doGetWsm,
	doOpenStoneWebViewer
}
