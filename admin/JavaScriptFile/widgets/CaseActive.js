$(document).ready(function () {
  vTotalCase = $('#sTotalCase').html();
  
  var theme = 'energyblue';
  LoopLoad(vTotalCase);
  $("#ManageCase").hide();
  $('#vMtypeDetail').hide();
  $("#ManageCaseDoctor").hide();

  var Case_Status;
  var Case_TechID;

  var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                if (value == "New Case") {
                    return '<span class="text-danger center"><B>' + value + '</B></span>';
                }
                else if (value == "Wait Accept") {
                    return '<span class="text-warning center"><B>' + value + '</B></span>';
                }
                else if (value == "Accepted") {
                    return '<span class="text-info center"><B>' + value + '</B></span>';
                }
            }

  $("#gridCaseActive").jqxGrid(
            {
                width: "100%",
                height: 550,
                sortable: true,
                altrows: true,
                filterable: true,
                showfilterrow: true,
                showstatusbar: true,
                statusbarheight: 24,
                showaggregates: true,
                autorowheight: true,
                columnsresize: true,
                pageable: true,
                pagesize: 10,
                scrollmode: 'logical',
                autoShowLoadElement: false,
                pagesizeoptions: ['10', '20', '50', '100', '500'],
                theme: theme,
                columns: [
                  { text: '#', datafield: 'Row', align: 'center', cellsalign: 'center', width: 50},
                  { text: 'Status', datafield: 'CASE_STATUS_Name', align: 'center', cellsalign: 'center', filtertype: 'checkedlist',cellsrenderer: cellsrenderer, width: 100},
                  { text: 'Hospital', datafield: 'Hos_OrthancID', align: 'center', filtertype: 'checkedlist', width: 180},
                  { text: '#HN', datafield: 'Patient_HN', align: 'center', width: 100},
                  { text: 'Name', datafield: 'FullName', align: 'center', minwidth: 200},
                  { text: 'Case Study', datafield: 'Case_StudyDESC', align: 'center', width: 120},
                  { text: 'Sex', datafield: 'Patient_Sex', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', width: 50},
                  //{ text: 'Ugent Type', datafield: 'UG_Type_Name', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', width: 100},
                  { text: 'Date', datafield: 'Case_DateUpdate', align: 'center', cellsalign: 'center', width: 100},
                  { text: 'View', datafield: 'View', columntype: 'button', cellsalign: 'center', width: 50, cellsrenderer: function () {
                       return "View";
                    }, buttonclick: function (row) {
                       Editrow = row;
                       var offset = $("#gridCaseActive").offset();

                       var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);
                       var OrthancID = dataRecord.Case_OrthancID;

                       var url='http://Radconnext:R@dconnext@103.91.189.94:8042/osimis-viewer/app/index.html?study=' + OrthancID;
                       openInNewTab(url);
                   }
                 },
                 { text: 'Download', datafield: 'Download', columntype: 'button', cellsalign: 'center', width: 100, cellsrenderer: function () {
                      return "Download";
                   }, buttonclick: function (row) {
                      Editrow = row;
                      var offset = $("#gridCaseActive").offset();

                      var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);
                      var OrthancID = dataRecord.Case_OrthancID;

                      var url='http://Radconnext:R@dconnext@103.91.189.94:8042/patients/' + OrthancID + '/archive';

                      openInNewTab(url);
                    }
                  }
                ]
            });
            /*$('#gridCaseActive').jqxGrid('hidecolumn', 'Viwe');
            $('#gridCaseActive').jqxGrid('hidecolumn', 'Download');*/
            gridCaseActive();

            $("#gridCaseActive").on('rowselect', function (event) {
                $('#gridCaseActive').jqxGrid('clearselection');
                var Case_ID = event.args.row.Case_ID;
                var FullName = event.args.row.FullName;
                var Hos_OrthancID = event.args.row.Hos_OrthancID;
                var Patient_HN = event.args.row.Patient_HN;
                var Patient_Name = event.args.row.Patient_Name;
                var Patient_LastName = event.args.row.Patient_LastName;
                var Case_StudyDESC = event.args.row.Case_StudyDESC;
                var Patient_Sex = event.args.row.Patient_Sex;
                var Patient_Birthday = event.args.row.Patient_Birthday;
                var Patient_CitizenID = event.args.row.Patient_CitizenID;
                var CASE_STATUS_Name = event.args.row.CASE_STATUS_Name;
                Case_TechID = event.args.row.Case_TechID;
                Case_Status = event.args.row.Case_Status;

                $("#ManageCase").show();

                $('#ManageCase').focus();
                $('#PHos').html(Hos_OrthancID);
                //$('#PName').html(FullName);
                $('#HCase').html(Case_StudyDESC);
                $('#vMType').html(vType);
                $('#vDStatus').html(CASE_STATUS_Name);

                $('#vCaseID').val(Case_ID);
                $('#vHN').val(Patient_HN);
                $('#vName').val(Patient_Name);
                $('#vLName').val(Patient_LastName);
                $('#vSex').val(Patient_Sex);
                //$('#vBirthday').val(Patient_Birthday);
                $('#vCitizenID').val(Patient_CitizenID);

                $("#vDPhone").html("");
                $("#vDEmail").html("");
                $("#vDLine").html("");

                if(vTypeID != '3'){
                  $('#TechID').val(Case_TechID);
                }
                else{
                  $('#TechID').val(vUserID);
                }

                CheckCaseStatus(Case_Status);
                FromTypecheck(Case_Status);
                GetDoctor(vTypeID);
                SRAD_SEC_FILE(Case_ID);
                scrollToTop();

                //if(vTypeID == "2"){
                  $("#GridCase").hide();
                //}

            });

            $("#CancelCase").on('click', function () {
                $("#ManageCase").hide();
                scrollToTop();
                $("#DoctorID").val("");
                $("#TechID").val("");
                $("#vCaseID").val("");
                $("#GridCase").show();

                $('#gridCaseActive').jqxGrid('clearselection');

                document.getElementById("vShowImg").src = '';
            });
            $("#SaveCase").on('click', function () {
                var CaseID = $("#vCaseID").val();
                var TechID = $("#TechID").val();
                var DoctorID = $("#DoctorID").val();

                if(DoctorID == ""){
                  ShowNoti("Please select Doctor.","warning");
                }
                else {
                  SRAD_UPDATE_CASE(CaseID,TechID,DoctorID,'1');
                }
                $('#gridCaseActive').jqxGrid('clearselection');
            });

            $("#AcceptCase").on('click', function () {
                var CaseID = $("#vCaseID").val();
                var TechID = $("#TechID").val();
                var DoctorID = vUserID;

                //alert(CaseID + '-'+ TechID + '-'+ DoctorID);
                SRAD_UPDATE_CASE(CaseID,Case_TechID,DoctorID,'2');

                $('#gridCaseActive').jqxGrid('clearselection');
            });

            $("#Reject").on('click', function () {
                var CaseID = $("#vCaseID").val();
                var TechID = $("#TechID").val();
                var DoctorID = $("#DoctorID").val();

                //alert(CaseID + '-'+ TechID + '-'+ DoctorID);
                SRAD_UPDATE_CASE(CaseID,Case_TechID,'0','0');
                $("#ManageCase").hide();

                $('#gridCaseActive').jqxGrid('clearselection');
            });

            $('#vListDoctor').on('select', function (event)
            {
                var args = event.args;
                if (args) {
                  // index represents the item's index.
                  var index = args.index;
                  var item = args.item;
                  // get item's label and value.
                  var label = item.label;
                  var value = item.value;
                  var type = args.type; // keyboard, mouse or null depending on how the item was selected.
                  $("#DoctorID").val(value);
                  SRAD_LIST_DORTOR_DESC(value);
                }
            });

            $('#vListDoctor').jqxDropDownList({
              placeHolder: "Select Doctor"
              , width: "100%"
              ,selectedIndex: -1
              ,theme: theme
              ,displayMember: "FullName"
              ,valueMember: "User_ID"
              ,autoDropDownHeight: true
            });

            $("#gridFileUpdate").jqxGrid({
                width: '100%',
                height: 185,
                pageable: true,
                pagerButtonsCount: 10,
                columnsResize: true,
                autoheight: true,
                //showstatusbar: true,
                theme: theme,
                columns: [
                  { text: 'File Name', datafield: 'Result_CASE_FileName', align: 'center', minwidth: 50},
                  { text: 'View', datafield: 'View', columntype: 'button', cellsalign: 'center', width: 50, cellsrenderer: function () {
                       return "View";
                    }, buttonclick: function (row) {
                       Editrow = row;
                       var offset = $("#gridFileUpdate").offset();

                       var dataRecord = $("#gridFileUpdate").jqxGrid('getrowdata', Editrow);
                       var vImage = dataRecord.Result_Path_IMG;

                       var url= '' + vImage;
                       document.getElementById("vShowImg").src = url;
                       openInNewTab(url);
                   }
                 },
                ]
            });

              $("#gridFileUpdate").on('rowselect', function (event) {
                var vImage = event.args.row.Result_Path_IMG;
                var url= vImage;
                document.getElementById("vShowImg").src = url;
              });
});

function LoopLoad(vTotalCase) {
  setInterval(function(){
    GetTotalCase();
    var ChkvTotalCase = $('#sTotalCase').html();
    if (vTotalCase != ChkvTotalCase){
      gridCaseActive();
      vTotalCase = $('#sTotalCase').html();
    }
  }, 1000 * 3);
}

function CheckCaseStatus(Case_Status) {
      if(Case_Status != "0" && (vTypeID == "3" || vTypeID == "1") ){
          $('#frmSaveCase').hide();
      }
      else {
        $('#frmSaveCase').show();
      }
};

function scrollToTop() {
            window.scrollTo(0, 0);
};

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

function gridCaseActive() {
            var act = 'SRAD_GET_CASE';
            var url = "sapi/api.class.php?action="+ act
            var pData = {
                User_ID : vUserID,
                Type : vType
            };

            var source =
            {
                type: 'GET',
                datatype: "json",
                datafields: [
                    { name: 'Row', type: 'number' },
                    { name: 'Case_ID', type: 'string' },
                    { name: 'Hos_ID', type: 'string' },
                    { name: 'Hos_OrthancID', type: 'string' },
                    { name: 'Case_OrthancID', type: 'string' },
                    { name: 'Case_ParentPatient', type: 'string' },
                    { name: 'Case_StudyDESC', type: 'string' },
                    { name: 'Case_Status', type: 'string' },
                    { name: 'CASE_STATUS_Name', type: 'string' },
                    { name: 'UG_Type_Name', type: 'string' },
                    { name: 'Case_TechID', type: 'string' },
                    { name: 'Case_DoctorID', type: 'string' },
                    { name: 'Patient_HN', type: 'string' },
                    { name: 'Patient_Name', type: 'string' },
                    { name: 'Patient_LastName', type: 'string' },
                    { name: 'FullName', type: 'string' },
                    { name: 'Patient_CitizenID', type: 'string' },
                    { name: 'Patient_Birthday', type: 'string' },
                    { name: 'Patient_Age', type: 'string' },
                    { name: 'Patient_Sex', type: 'string' },
                    { name: 'Case_DocReply', type: 'string' },
                    { name: 'Case_DateUpdate', type: 'string' }
                ],
                url: url,
                data: pData
            };
            var dataAdapter = new $.jqx.dataAdapter(source);
             $("#gridCaseActive").jqxGrid({source: dataAdapter});
}

function SRAD_SEC_FILE(CaseID) {
            var act = 'SRAD_SEC_FILE';
            var url = "sapi/api.class.php?action="+ act
            //ar CaseID = $("#vCaseID").val();
            var pData = {
                Case_ID : CaseID,
            };

            var source =
            {
                type: 'GET',
                datatype: "json",
                datafields: [
                    { name: 'Result_CASE_ID', type: 'number' },
                    { name: 'CASE_ID', type: 'number' },
                    { name: 'Result_CASE_FileName', type: 'string' },
                    { name: 'Result_CASE_Type', type: 'string' },
                    { name: 'Result_CASE_Size', type: 'string' },
                    { name: 'Result_Path_IMG', type: 'string' }
                ],
                url: url,
                data: pData
            };
            var dataAdapter = new $.jqx.dataAdapter(source);
             $("#gridFileUpdate").jqxGrid({source: dataAdapter});
}

function SRAD_LIST_DORTOR() {
            var act = 'SRAD_LIST_DORTOR';
            var url = "sapi/api.class.php?action="+ act
            var pData = {
                User_ID : vUserID
            };

            var source =
            {
                type: 'POST',
                datatype: "json",
                datafields: [
                    { name: 'User_ID', type: 'string' },
                    { name: 'FullName', type: 'string' },
                    { name: 'User_Email', type: 'string' },
                    { name: 'User_Phone', type: 'string' },
                    { name: 'User_LineID', type: 'string' }
                ],
                url: url,
                data: pData,
                async: true
            };
            var dataAdapter = new $.jqx.dataAdapter(source);
            $('#vListDoctor').jqxDropDownList({source: dataAdapter});
}

function SRAD_LIST_DORTOR_DESC(UserID) {
            var act = 'SRAD_LIST_DORTOR_DESC';
            var url = "sapi/api.class.php?action="+ act
            var pData = {
                User_ID : UserID
            };

            $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            data: pData,
            success: function(data) {
              if(data.Response == 'success'){
                var vPhone = data.data[0].User_Phone;
                var vEmail = data.data[0].User_Email;
                var vLine = data.data[0].User_LineID;
              	$("#vDPhone").html(vPhone);
              	$("#vDEmail").html(vEmail);
              	$("#vDLine").html(vLine);
              }
            }
        });
}

function SRAD_UPDATE_CASE(CaseID,TechID,DoctorID,CaseStatus) {
            var act = 'SRAD_UPDATE_CASE_DOC';
            var url = "sapi/api.class.php?action="+ act
            var pData = {
                CaseID : CaseID,
                TechID : TechID,
                DoctorID : DoctorID,
                CaseStatus : CaseStatus,
                UrgentType : 0
            };

            $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            data: pData,
            success: function(data) {
              if(data.Response == 'success'){
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if(vResult == "Success"){

                    ShowNoti(vMsg,"success");

                    if(CaseStatus == '1'){
                      $('#frmSaveCase').hide();
                    }

                    $("#DoctorID").val("");
                    $("#TechID").val("");
                    $("#vCaseID").val("");
                    $("#ManageCase").hide();
                    $("#GridCase").show();

                    gridCaseActive();
                }
                else {
                    ShowNoti(vMsg,"danger");
                }
              }
            }
        });
}


function GetDoctor() {
  if(vTypeID != "2"){
    SRAD_LIST_DORTOR();
    $('#vMtypeDetail').show();
  }
}

function FromTypecheck(Case_Status) {

  if(vTypeID == "2"){
    $('#frmSaveCase').hide();
    //$('#frmCancelCase').hide();
    $('#vName').jqxInput({disabled: true });
    $('#vLName').jqxInput({disabled: true });
    $('#vCitizenID').jqxInput({disabled: true });

    $("#PMFileImage").hide();
    $("#DMFileImage").show();

    if(Case_Status == "2"){
      $('#frmAccept').hide();
      $('#frmCancelAccept').hide();
    }
    else {
      $('#frmAccept').show();
      $('#frmCancelAccept').show();
    }
  }
  else{
    $('#frmAccept').hide();
    $('#frmCancelAccept').hide();
    $("#PMFileImage").show();
    $("#DMFileImage").hide();
  }

  if(Case_Status != "0"){
    $('#vMtypeDetail').hide();
    $('#vName').jqxInput({disabled: true });
    $('#vLName').jqxInput({disabled: true });
    $('#vCitizenID').jqxInput({disabled: true });
  }
  else{
    $('#frmAccept').hide();
    $('#frmCancelAccept').hide();

    $('#vName').jqxInput({disabled: false });
    $('#vLName').jqxInput({disabled: false });
    $('#vCitizenID').jqxInput({disabled: false });
  }

}

function ShowNoti(Msg,Type) {
  $("#MessageNoti").html(Msg);
  $("#Notification").jqxNotification({template: Type});
  $("#Notification").jqxNotification("open");
}

$('#UploadImage').click(function() {
	//$('#UploadImage').jqxInput({disabled: true });
	var _file = document.getElementById('vFileImage');
  var CaseID = $("#vCaseID").val();
  var data = new FormData();
	data.append('filUpload', _file.files[0]);

  var act = 'SRAD_Upload';
	$.ajax({
	    url: "sapi/api.class.php?action="+act+"&Case_ID="+CaseID,
	    data: data,
	    type: 'POST',
	    dataType: "json",
	    contentType: false,
	    processData: false,
	    success: function (data) {
        var vResponse = data.Response;
        var vMsg = data.data[0].Msg;
        if(vResponse == 'success'){
          ShowNoti(vMsg,vResponse);
          $('#vFileImage').val('');
          SRAD_SEC_FILE(CaseID);
        }else{
          ShowNoti(vMsg,"warning");
          $('#vFileImage').val('');
        }
      }
	})
});
