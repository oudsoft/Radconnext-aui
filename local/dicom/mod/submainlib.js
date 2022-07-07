/*submainlib.js*/
module.exports = function ( jq ) {
	const $ = jq;

  const masternotify = require('../../../case/mod/master-notify.js')($);

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

	return {
    showScanpartAux,
    doAddNotifyCustomStyle,
    doInitShowMasterNotify,
    doTriggerDicomFilterForm
  }
}
