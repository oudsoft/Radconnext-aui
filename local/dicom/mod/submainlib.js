/*submainlib.js*/
module.exports = function ( jq ) {
	const $ = jq;

  const masternotify = require('../../../case/mod/master-notify.js')($);
	const softphone = require('../../../case/mod/softphonelib.js')($);
	const userprofile = require('../../../case/mod/userprofilelib.js')($);
	const common = require('../../../case/mod/commonlib.js')($);

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
		console.log(scanpartauxs);
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

  const doInitShowMasterNotify = function(){
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
  }

  const doTriggerDicomFilterForm = function(){
    $(document).on('opendicomfilter', (evt, data)=>{
      let queryString = localStorage.getItem('dicomfilter');
      let queryDicom = JSON.parse(queryString);
      let filterKey = queryDicom.Query;
      $(".mainfull").find('#DicomFilterForm').show();
      if ((filterKey.StudyFromDate !== '') && (filterKey.StudyFromDate !== '*')) {
        $('#StudyFromDateInput').val(filterKey.StudyFromDate);
      }
      if ((filterKey.StudyToDate !== '') && (filterKey.StudyToDate !== '*')) {
        $('#StudyToDateInput').val(filterKey.StudyToDate);
      }
      if ((filterKey.PatientName !== '') && (filterKey.PatientName !== '*')) {
        $('#PatientNameInput').val(filterKey.PatientName);
      }
      if ((filterKey.PatientHN !== '') && (filterKey.PatientHN !== '*')) {
        $('#PatientHNInput').val(filterKey.PatientHN);
      }
      if ((filterKey.Modality !== '') && (filterKey.Modality !== '*')) {
        $('#ModalityInput').val(filterKey.Modality);
      }
      if ((filterKey.ScanPart !== '') && (filterKey.ScanPart !== '*')) {
        $('#ScanPartInput').val(filterKey.ScanPart);
      }
    });
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

	const doCreateCustomNotify = function(){
	  let msgBox = $('<div></div>');
	  let titleBox = $("<div id='notify-title' style='background-color: white; color: black; font-weight: bold; text-align: center;'></div>");
	  $(titleBox).append($('<h4>แจ้งส่งภาพเข้าระบบสำเร็จ</h4>'));
	  let boyBox = $("<div id='notify-body'></div>");
	  $(boyBox).append($('<span>คลิกที่ปุ่ม <b>ตกลง</b> เพื่อปิดการแจ้งเตือนนี้</span>'));
	  let footerBox = $("<div id='notify-footer' style='text-align: center;'></div>");
	  let updateCmd = $('<input type="button" value="ตกลง" id="UpdateDicomCmd"/>');
		$(updateCmd).on('click', (evt)=>{
			$(msgBox).remove()
		});

	  $(footerBox).append($(updateCmd));
	  return $(msgBox).append($(titleBox)).append($(boyBox)).append($(footerBox))
	}

	const onCaseMisstakeNotifyTrigger = function(evt){
	  let trigerData = evt.detail.data;
	  let msg = trigerData.msg;
	  let from = trigerData.from;
	  let patientFullName = trigerData.caseData.patientFullName;
	  let patientHN = trigerData.caseData.patientHN;
	  let caseScanParts = trigerData.caseData.caseScanParts;
	  let caseScanPartsText = '';
	  caseScanParts.forEach((item, i) => {
	    if (i != (caseScanParts.length - 1)) {
	      caseScanPartsText  += item.Name + ' \ ';
	    } else {
	      caseScanPartsText  += item.Name;
	    }
	  });

	  let radAlertMsg = $('<div></div>');
	  let notifyFromromBox = $('<div></div>');
	  $(notifyFromromBox).append($('<p>ผ้ป่วย ชื่อ ' + patientFullName + '</p>').css({'text-align': 'left', 'line-height': '14px'}));
	  $(notifyFromromBox).append($('<p>HN ' + patientHN + '</p>').css({'text-align': 'left', 'line-height': '14px'}));
	  $(notifyFromromBox).append($('<p>Scan Part ' + caseScanPartsText + '</p>').css({'text-align': 'left', 'line-height': '14px'}));
	  $(notifyFromromBox).append($('<p>ผู้แจ้ง ' + from.userfullname + '</p>').css({'text-align': 'left', 'line-height': '14px'}));
	  $(notifyFromromBox).append($('<p>สาเหตุเคสผิดพลาด ' + msg.cause + '</p>').css({'text-align': 'left', 'line-height': '14px'}));
	  $(notifyFromromBox).append($('<p>ข้อความแจ้งเพิ่มเติม ' + msg.other + '</p>').css({'text-align': 'left', 'line-height': '14px'}));
	  $(radAlertMsg).append($(notifyFromromBox));

	  const radalertoption = {
	    title: 'ข้อความแจ้งเตือนเตสผิดพลาด',
	    msg: $(radAlertMsg),
	    width: '420px',
	    onOk: function(evt) {
	      radConfirmBox.closeAlert();
	    }
	  }
	  let radAlertBox = $('body').radalert(radalertoption);
	  $(radAlertBox.cancelCmd).hide();
	}

	const onNewDicomTransferTrigger = function(evt) {
		let msgBox = doCreateCustomNotify();
		$.notify($(msgBox).html(), {position: 'top right', autoHideDelay: 20000, clickToHide: true, style: 'myshopman', className: 'base'});
	}

	return {
    showScanpartAux,
    doAddNotifyCustomStyle,
    doInitShowMasterNotify,
    doTriggerDicomFilterForm,
		doCreateRegisterVoIP,
		doNotAllowAccessPage,
		doCreateCustomNotify,
		onCaseMisstakeNotifyTrigger,
		onNewDicomTransferTrigger
  }
}
