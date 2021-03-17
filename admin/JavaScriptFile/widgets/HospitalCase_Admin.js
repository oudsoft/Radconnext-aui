const doPostApi = function (apiurl, params) {
     $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
     return new Promise(function (resolve, reject) {
          $.post(apiurl, params, function (data) {
               resolve(data);
          }).fail(function (error) {
               reject(error);
          });
     });
}

const doGetApi = function (apiurl, params) {
     $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
     return new Promise(function (resolve, reject) {
          $.get(apiurl, params, function (data) {
               resolve(data);
          }).fail(function (error) {
               reject(error);
          });
     });
}

function cachedScript(url, options) {
     options = $.extend(options || {}, {
          dataType: "script",
          cache: true,
          url: url
     });
     return $.ajax(options);
}

const {
     GetTimeInTaskappCaseIdAPI,
     getTriggerAt,
     MessageNotifys,
     ReloadMessageNotify,
     showNotification,
     sortMasterNotifyFunction,
     ObjectSize,
     CaseTimerInTable,
     doConnectWebsocketMaster,
     doConnectWebsocketLocal,
} = require('../Utility.js');

$(document).ready(function () {

     // PostPage();
     // $("#GridCase").hide();
     // $("#ManageCase").hide();

});

function startHospitalCase_Admin() {

     $("#gridHospital").jqxGrid({
          width: '100%',
          autoheight: true,
          
          pageable: true,
          pagerButtonsCount: 10,
          columnsResize: true,
          filterable: true,
          showstatusbar: true,
          autoShowLoadElement: false,
          theme: theme,
          columns: [

               // row.id = data.Record.id;
               // row.Hos_Name = data.Record.Hos_Name;
               // row.Hos_Address = data.Record.Hos_Address;
               // row.Hos_Tel = data.Record.Hos_Tel;
               // row.Hos_WebUrl = data.Record.Hos_WebUrl;
               // row.Hos_Contact = data.Record.Hos_Contact;
               // row.Hos_Remark = data.Record.Hos_Remark;
               {
                    text: 'Hospital_ID',
                    datafield: 'id',
                    align: 'center',
                    cellsalign: 'center',
                    minwidth: 100
               },
               {
                    text: 'Hospital Name',
                    datafield: 'Hos_Name',
                    align: 'center',
                    cellsalign: 'center',
                    minwidth: 150
               },
               {
                    text: 'Hospital Address',
                    datafield: 'Hos_Address',
                    align: 'center',
                    cellsalign: 'center',
                    minwidth: 150
               },
               {
                    text: 'Hospital Tel',
                    datafield: 'Hos_Tel',
                    align: 'center',
                    cellsalign: 'center',
                    minwidth: 100
               },
               {
                    text: 'Hospital WebUrl',
                    datafield: 'Hos_WebUrl',
                    align: 'center',
                    cellsalign: 'center',
                    minwidth: 150
               },
               {
                    text: 'Hospital Contact',
                    datafield: 'Hos_Contact',
                    align: 'center',
                    cellsalign: 'center',
                    minwidth: 150
               },
               {
                    text: 'Hospital Remark',
                    datafield: 'Hos_Remark',
                    align: 'center',
                    cellsalign: 'center',
                    minwidth: 150
               },
               // {
               //      text: 'Delete',
               //      datafield: 'Delete',
               //      align: 'center',
               //      columntype: 'button',
               //      cellsalign: 'center',
               //      width: 60,
               //      cellsrenderer: function (row) {
               //           return "Delete";
               //      },

               //      buttonclick: function (row) {
               //           Editrow = row;
               //           var offset = $("#gridHospital").offset();

               //           var dataRecord = $("#gridHospital").jqxGrid('getrowdata', Editrow);
               //           console.log(JSON.stringify(dataRecord));
               //           var id = dataRecord.id;
               //           var Hos_Name = dataRecord.Hos_Name;
               //           var Hos_Address = dataRecord.Hos_Address;
               //           var Hos_Tel = dataRecord.Hos_Tel;
               //           var Hos_WebUrl = dataRecord.Hos_WebUrl;
               //           var Hos_Contact = dataRecord.Hos_Contact;
               //           var Hos_Remark = dataRecord.Hos_Remark;

               //           if (confirm("Do you want to Delete Hospital " + Hos_Name + "?")) {
               //                DelHospital(id);
               //           }
               //      }
               // }
          ]
     });

     $("#gridHospital").on('rowdoubleclick', function (row) {
          //console.log("Row with bound index: " + row.args.rowindex + " has been double-clicked.");
          Editrow = row.args.rowindex;
          var offset = $("#gridHospital").offset();
          var dataRecord = $("#gridHospital").jqxGrid('getrowdata', Editrow);

          $("#gridHospitalData").val(JSON.stringify(dataRecord));
          $("#HospitalDisplayName").text(dataRecord.Hos_Name);
          $("#vHosID").val(dataRecord.id);
          $("#HosName").val(dataRecord.Hos_Name);
          // $("#vHosNameDetail").val(dataRecord.Hos_Name);
          // $("#vHos_AddressDetail").val(dataRecord.Hos_Address);
          // $("#vHos_TelphoneDetail").val(dataRecord.Hos_Tel);
          // $("#vHos_WebUrlDetail").val(dataRecord.Hos_WebUrl);
          // $("#vHos_ContactDetail").val(dataRecord.Hos_Contact);
          // $("#vHos_RemarkDetail").val(dataRecord.Hos_Remark);
          $("#GridCase").show();
          $("#ManageCase").hide();
          $("#ManageHospital").hide();
          // getUrgencyTypes($("#vHosID").val());

          GridCase(dataRecord.id);
          scrollToTop();
     });

     HospitalList();

     $("#ViewCase").on('click', function () {
          const HosID = $("#vHosID").val();
          var PromiseInstance = getInstance2(HosID);
          //const PromiseGetPort = GetPort(instanceID);
          PromiseInstance.then((data) => {
              var baseurl = "";
              if (window.location.hostname == "localhost") {
                  baseurl = "202.28.68.28";
              }else{
                  baseurl = window.location.host.split(":")[0];
              }
              local_url = 'http://' + baseurl + ':' + data.port + '/stone-webviewer/index.html?study=';
              console.log('local_url : ' + local_url);
              var orthancwebapplink = local_url + data.MainDicomTags.StudyInstanceUID;
              console.log("orthancwebapplink = " + orthancwebapplink);
              window.open(orthancwebapplink, '_blank');
              //openInNewTab(url);
          }).catch(function (error) {
              console.log("error in ViewCase = " + JSON.stringify(error) );
          });
     });

     $('#vListDoctor').on('select', function (event) {
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
              // SRAD_LIST_DORTOR_DESC(value);
          }
     });

     $('#vRight').on('select', function (event) {
          var args = event.args;
          if (args) {
               // index represents the item's index.
               var index = args.index;
               var item = args.item;
               // get item's label and value.
               var label = item.label;
               var value = item.value;
               var type = args.type; // keyboard, mouse or null depending on how the item was selected.
               $("#RightID").val(value);
               $("#sRights").html(label);
          }
     });

     $('#vUrgentType').on('select', function (event) {
          var args = event.args;
          if (args) {
               // index represents the item's index.
               var index = args.index;
               var item = args.item;
               // get item's label and value.
               var label = item.label;
               var value = item.value;
               var type = args.type; // keyboard, mouse or null depending on how the item was selected.
               $("#UrgentTypeID").val(value);
               $("#sUrgentType").html(label);
          }
     });

     $('#vRight').jqxDropDownList({
          placeHolder: "สิทธิ์การรักษา",
          width: "90%",
          selectedIndex: -1,
          theme: theme,
          displayMember: "DisplayText",
          valueMember: "Value",
          autoDropDownHeight: true
     });

     $('#vListDoctor').jqxDropDownList({
          placeHolder: "เลือกรังสีแพทย์",
          width: "90%",
          selectedIndex: -1,
          theme: theme,
          displayMember: "DisplayText",
          valueMember: "DisplayText",
          autoDropDownHeight: true
     });

     $('#vPatientDoctor').jqxDropDownList({
          placeHolder: "เลือกแพทย์ทั่วไป",
          width: "90%",
          selectedIndex: -1,
          theme: theme,
          displayMember: "DisplayText",
          valueMember: "DisplayText",
          autoDropDownHeight: true
     });

     $('#vUrgentType').jqxDropDownList({
          placeHolder: "เลือกความเร่งด่วน",
          width: "90%",
          selectedIndex: 0,
          theme: theme,
          displayMember: "DisplayText",
          valueMember: "Value",
          autoDropDownHeight: true
     });

     $("#GridCase").hide();
     $("#ManageCase").hide();
}

async function PostPage() {
     const results = await StartPage();
     return results;
}

async function StartGrid() {

     var Case_Status;
     var Case_TechID;
     var Case_StatusID;
     var Case_OrthancID;

     var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
          Editrow = row;
          var offset = $("#gridCaseActive").offset();

          var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);
          var STATUS_Name = dataRecord.CASE_STATUS_Name;
          var STATUS_Name_TH = dataRecord.CASE_STATUS_Name_TH;

          if (STATUS_Name == "New Case") {
               return '<span class="text-danger center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
          } else if (STATUS_Name == "Wait Accept") {
               return '<span class="text-warning center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
          } else if (STATUS_Name == "Accepted") {
               return '<span class="text-info center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
          } else if (value == "Doctor Response") {
               return '<span class="text-success center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
          }
     };

     var Timecellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
          Editrow = row;
          var offset = $("#gridCaseActive").offset();
          var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);
          var Times = new Date(dataRecord.createdAt);
          let month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          let month = month_names[Times.getMonth()];
          let formatted_date = Times.getDate() + " " + month + " " + Times.getFullYear() + " " +
               Times.getHours() + ":" + Times.getMinutes() + ":" + Times.getSeconds();
          return '<span class="text-sm-center align-middle">' + formatted_date + '</span>';
     };

     ///////////////// Tooltips Header Column /////////////////////////////
     var tooltiprenderer = function (element) {
          $(element).parent().jqxTooltip({
               position: 'top',
               content: "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง"
          });
     };
     ///////////////// Tooltips Header Column /////////////////////////////

     $("#gridCaseActive").jqxGrid({
          width: "100%",
          height: 550,
          sortable: true,
          altrows: true,
          filterable: true,
          showfilterrow: true,
          //showstatusbar: true,
          //statusbarheight: 24,
          //showaggregates: true,
          columnsreorder: true,
          autorowheight: true,
          columnsresize: true,
          pageable: true,
          pagesize: 10,
          scrollmode: 'logical',
          autoShowLoadElement: false,
          pagesizeoptions: ['10', '20', '50', '100', '500'],
          theme: theme,
          columns: [{
               text: '#',
               datafield: 'Row',
               align: 'center',
               cellsalign: 'center',
               rendered: tooltiprenderer,
               width: 35
          },
          {
               text: 'สถานะ',
               datafield: 'CS_Name_EN',
               align: 'center',
               cellsalign: 'center',
               filtertype: 'checkedlist',
               cellsrenderer: cellsrenderer,
               rendered: tooltiprenderer,
               width: 100
          },
          {
               text: 'วันที่',
               datafield: 'createdAt',
               align: 'center',
               cellsalign: 'center',
               cellsformat: 'dd MMM yyyy HH:mm:ss',
               filtertype: 'range',
               cellsrenderer: Timecellsrenderer,
               rendered: tooltiprenderer,
               width: 150
          },
          {
               text: '#HN',
               datafield: 'Patient_HN',
               align: 'center',
               rendered: tooltiprenderer,
               width: 150
          },
          {
               text: 'ผู้รับการตรวจ(อังกฤษ)',
               datafield: 'FullName_EN',
               align: 'center',
               rendered: tooltiprenderer,
               width: 250
          },
          {
               text: 'ผู้รับการตรวจ(ไทย)',
               datafield: 'FullName_TH',
               align: 'center',
               rendered: tooltiprenderer,
               width: 250
          },
          {
               text: 'เพศ',
               datafield: 'Patient_Sex',
               align: 'center',
               cellsalign: 'center',
               filtertype: 'checkedlist',
               rendered: tooltiprenderer,
               width: 50
          },
          {
               text: 'อายุ',
               datafield: 'Patient_Age',
               align: 'center',
               cellsalign: 'center',
               rendered: tooltiprenderer,
               width: 50
          },
          {
               text: 'วันเกิด',
               datafield: 'Patient_Birthday',
               align: 'center',
               cellsalign: 'center',
               rendered: tooltiprenderer,
               width: 80
          },
          {
               text: 'รายการ',
               datafield: 'Order_Detail',
               align: 'center',
               rendered: tooltiprenderer,
               minwidth: 200
          },
          {
               text: 'ราคา',
               datafield: 'Order_Price',
               align: 'center',
               cellsalign: 'right',
               width: 70,
               rendered: tooltiprenderer,
               cellsformat: 'c0'
          },
          {
               text: 'DF แพทย์',
               datafield: 'Order_DF',
               align: 'center',
               cellsalign: 'right',
               width: 80,
               rendered: tooltiprenderer,
               cellsformat: 'c0'
          },
          {
               text: 'Description',
               datafield: 'Case_StudyDescription',
               align: 'center',
               rendered: tooltiprenderer,
               width: 120
          },
          {
               text: 'Protocol',
               datafield: 'Case_ProtocolName',
               align: 'center',
               rendered: tooltiprenderer,
               minwidth: 180
          },
          {
               text: 'Modality',
               datafield: 'Case_Modality',
               align: 'center',
               width: 70,
               rendered: tooltiprenderer,
               filtertype: 'checkedlist'
          },
          {
               text: 'Urgency',
               datafield: 'UGType_Name',
               align: 'center',
               cellsalign: 'center',
               filtertype: 'checkedlist',
               rendered: tooltiprenderer,
               width: 100
          },
          {
               text: 'รังสีแพทย์',
               datafield: 'Patient_RadiologistDoctor',
               align: 'center',
               rendered: tooltiprenderer,
               width: 150
          }
          ]
     });

     /////////////////////////////// New Custom Column /////////////////////////////////////

     var listSource = [{
          label: 'Row',
          value: 'Row',
          checked: true
     },
     {
          label: 'สถานะ',
          value: 'CASE_STATUS_Name',
          checked: true
     },
     {
          label: 'วันที่',
          value: 'Case_DateInsert',
          checked: true
     },
     {
          label: '#HN',
          value: 'Patient_HN',
          checked: true
     },
     {
          label: 'ผู้รับการตรวจ(อังกฤษ)',
          value: 'FullName_EN',
          checked: true
     },
     {
          label: 'ผู้รับการตรวจ(ไทย)',
          value: 'FullName_TH',
          checked: true
     },
     {
          label: 'เพศ',
          value: 'Patient_Sex_TH',
          checked: true
     },
     {
          label: 'อายุ',
          value: 'Patient_Age',
          checked: true
     },
     {
          label: 'รหัส',
          value: 'Order_ID',
          checked: true
     },
     {
          label: 'รายการ',
          value: 'Order_Detail',
          checked: true
     },
     {
          label: 'ราคา',
          value: 'Order_Price',
          checked: true
     },
     {
          label: 'DF แพทย์',
          value: 'Order_DF',
          checked: true
     },
     {
          label: 'Description',
          value: 'Case_StudyDESC',
          checked: true
     },
     {
          label: 'Protocol',
          value: 'Case_ProtocolName',
          checked: true
     },
     {
          label: 'Modality',
          value: 'Case_Modality',
          checked: true
     },
     {
          label: 'Urgency',
          value: 'UG_Type_Name',
          checked: true
     },
     {
          label: 'รังสีแพทย์',
          value: 'DocFullName',
          checked: true
     }
     ];


     $("#jqxlistbox").jqxListBox({
          source: listSource,
          width: 200,
          height: 200,
          checkboxes: true
     });

     $("#jqxlistbox").on('checkChange', function (event) {
          $("#gridCaseActive").jqxGrid('beginupdate');
          if (event.args.checked) {
               $("#gridCaseActive").jqxGrid('showcolumn', event.args.value);
          } else {
               $("#gridCaseActive").jqxGrid('hidecolumn', event.args.value);
          }
          $("#gridCaseActive").jqxGrid('endupdate');
     });

     var jqxlistbox_show = false;

     ////////////////////////////////////////////////////////////////////////////////////////////

     $("#BackManageHospital").on('click', function() {
          $("#ManageHospital").show();
          $("#ManageCase").hide();
          $("#GridCase").hide();
     });

     $("#gridCaseActive").on('rowdoubleclick', function (event) {

          Editrow = event.args.rowindex;
          // User_Hospital_Name
          var offset = $("#gridCaseActive").offset();
          var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);

          //Keep Patient Data
          setTimeout(function () {
               ShowPatientData(dataRecord);
          }, 1000);
          $("#GridCase").hide();
     });

     $("#CancelCase").on('click', function () {
          $("#ManageCase").hide();
          scrollToTop();
          $("#DoctorID").val("");
          $("#TechID").val("");
          $("#vCaseID").val("");
          $("#RightID").val("");
          $("#sRights").html("");
          $("#GridCase").show();
          gridCaseActive(User_HosID);
          document.getElementById("vShowImg").src = '';
     });

     // gridCaseActive2(User_HosID);
}

async function GridCase(id) {
     const results = await StartGrid();
     gridCaseActive(id);
     // $("#GridCase").hide();
     // $("#ManageCase").hide();
     // return results;
}

function HospitalList() {
     let function_name = 'HospitalList';
     let url = "/api/hospital/list";
     let params = {};
     const promises = doPostApi(url, params);
     promises.then((data) => {
          var new_data = JSON.stringify(data);
          console.log('new_data: ' + new_data);
          if (data.Result == "OK" && data.Records.length > 0) {
               length = data.Records.length;
               var databases = new Array();
               // console.log("data = " + JSON.stringify(data["Options"][0].DisplayText));
               for (var i = 0; i < length; i++) {
                    var row = {};
                    row.id = data.Records[i].id;
                    row.Hos_Name = data.Records[i].Hos_Name;
                    row.Hos_Address = data.Records[i].Hos_Address;
                    row.Hos_Tel = data.Records[i].Hos_Tel;
                    row.Hos_WebUrl = data.Records[i].Hos_WebUrl;
                    row.Hos_Contact = data.Records[i].Hos_Contact;
                    row.Hos_Remark = data.Records[i].Hos_Remark;
                    databases[i] = row;
               }
          }

          var source = {
               localdata: databases,
               datatype: "array"
          };
          console.log("source = ", source);
          var dataAdapter = new $.jqx.dataAdapter(source);
          $("#gridHospital").jqxGrid({
               source: dataAdapter
          });
     }).catch(function (error) {
          console.log(JSON.stringify(error));
     });

}

function gridCaseActive(Hos_ID) {
     var caseReadWaitStatus = [1, 2, 3, 4, 7];
     var caseReadSuccessStatus = [5, 6];
     var caseAllStatus = [1, 2, 3, 4, 5, 6, 7];
     const function_name = 'gridCaseActive';
     $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
     var params = {
          hospitalId: Hos_ID,
          userId: User_ID,
          statusId: caseAllStatus
     };
     var url = "/api/cases/filter/hospital";
     const promises = doPostApi(url, params);
     promises.then((data) => {
          // console.log('data: ' + JSON.stringify(data));
          if (data.status.code === 200) {
               var databases = new Array();
               const length = data.Records.length;
               // console.log("length = " + data.Records.length);

               for (var i = 0; i < length; i++) {
                    var row = {};
                    row.Row = i;
                    row.Case_ID = data.Records[i].case.id;
                    row.Case_OrthancStudyID = data.Records[i].case.Case_OrthancStudyID;
                    row.Case_ACC = data.Records[i].case.Case_ACC;
                    row.Case_BodyPart = data.Records[i].case.Case_BodyPart;
                    row.Case_Modality = data.Records[i].case.Case_Modality; //
                    row.Case_Manufacturer = data.Records[i].case.Case_Manufacturer;
                    row.Case_ProtocolName = data.Records[i].case.Case_ProtocolName; //
                    row.Case_StudyDescription = data.Records[i].case.Case_StudyDescription; //
                    row.Case_StationName = data.Records[i].case.Case_StationName;
                    row.Case_PatientHRLink = data.Records[i].case.Case_PatientHRLink;
                    row.Case_RadiologistId = data.Records[i].case.Case_RadiologistId;
                    row.Case_RefferalId = data.Records[i].case.Case_RefferalId;
                    row.Case_RefferalName = data.Records[i].case.Case_RefferalName;
                    row.Case_Department = data.Records[i].case.Case_Department;
                    row.Case_Price = data.Records[i].case.Case_Price;
                    row.Case_DESC = data.Records[i].case.Case_DESC;
                    row.createdAt = data.Records[i].case.createdAt;
                    row.updatedAt = data.Records[i].case.updatedAt;
                    //row.hospitalId = data.Records[i].case.hospitalId;
                    row.patientId = data.Records[i].case.patientId;
                    row.urgenttypeId = data.Records[i].case.urgenttypeId;
                    row.cliamerightId = data.Records[i].case.cliamerightId;
                    row.casestatusId = data.Records[i].case.casestatusId;
                    row.userId = data.Records[i].case.userId;
                    row.patient_ID = data.Records[i].case.patient.id;
                    row.Patient_HN = data.Records[i].case.patient.Patient_HN;
                    row.Patient_NameTH = data.Records[i].case.patient.Patient_NameTH;
                    row.Patient_LastNameTH = data.Records[i].case.patient.Patient_LastNameTH;
                    row.Patient_NameEN = data.Records[i].case.patient.Patient_NameEN;
                    row.Patient_LastNameEN = data.Records[i].case.patient.Patient_LastNameEN;
                    row.Patient_CitizenID = data.Records[i].case.patient.Patient_CitizenID;
                    row.Patient_Birthday = data.Records[i].case.patient.Patient_Birthday;
                    row.Patient_Age = data.Records[i].case.patient.Patient_Age;
                    row.Patient_Sex = data.Records[i].case.patient.Patient_Sex;
                    row.Patient_Tel = data.Records[i].case.patient.Patient_Tel;
                    row.Patient_Address = data.Records[i].case.patient.Patient_Address;
                    row.hospitalId = data.Records[i].case.patient.hospitalId;
                    row.casestatus_ID = data.Records[i].case.casestatus.id;
                    row.CS_Name_EN = data.Records[i].case.casestatus.CS_Name_EN;
                    row.urgenttype_ID = data.Records[i].case.urgenttype.id;
                    row.UGType_Name = data.Records[i].case.urgenttype.UGType_Name;

                    row.Radiologist_ID = data.Records[i].Radiologist.id;
                    row.Radiologist_User_NameTH = data.Records[i].Radiologist.User_NameTH;
                    row.Radiologist_User_LastNameTH = data.Records[i].Radiologist.User_LastNameTH;

                    row.Refferal_ID = data.Records[i].Refferal.id;
                    row.Refferal_User_NameTH = data.Records[i].Refferal.User_NameTH;
                    row.Refferal_User_LastNameTH = data.Records[i].Refferal.User_LastNameTH;

                    row.FullName_EN = data.Records[i].case.patient.Patient_NameEN + " " + data.Records[i].case.patient.Patient_LastNameEN;
                    row.FullName_TH = data.Records[i].case.patient.Patient_NameTH + " " + data.Records[i].case.patient.Patient_LastNameTH;
                    row.Patient_RefferalDoctor = data.Records[i].Refferal.User_NameTH + " " + data.Records[i].Refferal.User_LastNameTH;
                    row.Patient_RadiologistDoctor = data.Records[i].Radiologist.User_NameTH + " " + data.Records[i].Radiologist.User_LastNameTH;

                    databases[i] = row;
               }


               var source = {
                    localdata: databases,
                    datatype: "array",
               };

               // console.log("source : " + JSON.stringify(source));

               var dataAdapter = new $.jqx.dataAdapter(source);
               try {
                    $("#gridCaseActive").jqxGrid({
                         source: dataAdapter
                    });
                    $('#gridCaseActive').jqxGrid('clearselection');
               } catch (e) {
                    console.log("Error : " + e);
                    //location.reload();
               }
               // console.log("function_name : " + function_name + " => end");

          } else {
               console.log("Else in Result = OK ");
               // log.info("error: " + data.error);
          }
     }).catch((error) => {
          console.log("error: " + error);
          // log.info("error: " + error);
     });
}

function gridCasePatient(case_Id) {

     $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
     const function_name = "gridCasePatient";
     const caseId = case_Id;
     const params = {caseId: caseId};
     const url = "/api/cases/select/" + caseId;
     const promises = doPostApi(url, params);
     promises.then((data) => {
          var databases = new Array();
          if (data.status.code === 200) {
               for (var i = 0; i < length; i++) {
                    var row = {};
                    row.Row = i;
                    row.Case_ID = data.Records[i].case.id;
                    row.Case_OrthancStudyID = data.Records[i].case.Case_OrthancStudyID;
                    row.Case_ACC = data.Records[i].case.Case_ACC;
                    row.Case_BodyPart = data.Records[i].case.Case_BodyPart;
                    row.Case_Modality = data.Records[i].case.Case_Modality; //
                    row.Case_Manufacturer = data.Records[i].case.Case_Manufacturer;
                    row.Case_ProtocolName = data.Records[i].case.Case_ProtocolName; //
                    row.Case_StudyDescription = data.Records[i].case.Case_StudyDescription; //
                    row.Case_StationName = data.Records[i].case.Case_StationName;
                    row.Case_PatientHRLink = data.Records[i].case.Case_PatientHRLink;
                    row.Case_RadiologistId = data.Records[i].case.Case_RadiologistId;
                    row.Case_RefferalId = data.Records[i].case.Case_RefferalId;
                    row.Case_RefferalName = data.Records[i].case.Case_RefferalName;
                    row.Case_Department = data.Records[i].case.Case_Department;
                    row.Case_Price = data.Records[i].case.Case_Price;
                    row.Case_DESC = data.Records[i].case.Case_DESC;
                    row.createdAt = data.Records[i].case.createdAt;
                    row.updatedAt = data.Records[i].case.updatedAt;
                    //row.hospitalId = data.Records[i].case.hospitalId;
                    row.patientId = data.Records[i].case.patientId;
                    row.urgenttypeId = data.Records[i].case.urgenttypeId;
                    row.cliamerightId = data.Records[i].case.cliamerightId;
                    row.casestatusId = data.Records[i].case.casestatusId;
                    row.userId = data.Records[i].case.userId;
                    row.patient_ID = data.Records[i].case.patient.id;
                    row.Patient_HN = data.Records[i].case.patient.Patient_HN;
                    row.Patient_NameTH = data.Records[i].case.patient.Patient_NameTH;
                    row.Patient_LastNameTH = data.Records[i].case.patient.Patient_LastNameTH;
                    row.Patient_NameEN = data.Records[i].case.patient.Patient_NameEN;
                    row.Patient_LastNameEN = data.Records[i].case.patient.Patient_LastNameEN;
                    row.Patient_CitizenID = data.Records[i].case.patient.Patient_CitizenID;
                    row.Patient_Birthday = data.Records[i].case.patient.Patient_Birthday;
                    row.Patient_Age = data.Records[i].case.patient.Patient_Age;
                    row.Patient_Sex = data.Records[i].case.patient.Patient_Sex;
                    row.Patient_Tel = data.Records[i].case.patient.Patient_Tel;
                    row.Patient_Address = data.Records[i].case.patient.Patient_Address;
                    row.hospitalId = data.Records[i].case.patient.hospitalId;
                    row.casestatus_ID = data.Records[i].case.casestatus.id;
                    row.CS_Name_EN = data.Records[i].case.casestatus.CS_Name_EN;
                    row.urgenttype_ID = data.Records[i].case.urgenttype.id;
                    row.UGType_Name = data.Records[i].case.urgenttype.UGType_Name;

                    row.Order_Detail = "";
                    row.Order_Price = "";
                    row.Order_DF = "";

                    row.Radiologist_ID = data.Records[i].Radiologist.id;
                    row.Radiologist_User_NameTH = data.Records[i].Radiologist.User_NameTH;
                    row.Radiologist_User_LastNameTH = data.Records[i].Radiologist.User_LastNameTH;

                    row.Refferal_ID = data.Records[i].Refferal.id;
                    row.Refferal_User_NameTH = data.Records[i].Refferal.User_NameTH;
                    row.Refferal_User_LastNameTH = data.Records[i].Refferal.User_LastNameTH;
                    row.FullName_EN = data.Records[i].case.patient.Patient_NameEN + " " + data.Records[i].case.patient.Patient_LastNameEN;
                    row.FullName_TH = data.Records[i].case.patient.Patient_NameTH + " " + data.Records[i].case.patient.Patient_LastNameTH;

                    row.Patient_RefferalDoctor = data.Records[i].Refferal.User_NameTH + " " + data.Records[i].Refferal.User_LastNameTH;
                    row.Patient_RadiologistDoctor = data.Records[i].Radiologist.User_NameTH + " " + data.Records[i].Radiologist.User_LastNameTH;
                    databases[i] = row;
               }


               var source = {
                    localdata: databases,
                    datatype: "array",
               };

               // console.log("source : " + source);

               var dataAdapter = new $.jqx.dataAdapter(source);

               try {
                    $("#gridCasePatient").jqxGrid({
                         source: dataAdapter
                    });
                    // $('#gridCasePatient').jqxGrid('clearselection');
                    AddTooltip();
                    console.log('success to get data ');
               } catch (e) {
                    console.log("Error : " + e);
                    //location.reload();
               }
               console.log("function_name : " + function_name + " => end");

          } else {
               console.log("Else in Result = OK ");
               //log.info("error: " + data.error);
          }
     }).catch((err) => {
          console.log('err: ' + err);
     });

}

function jqxTooltipGridActive() {
     setTimeout(function () {
          /////////////////// New Code jqxTooltip //////////////////////////////////////////////////
          $("#ViewCase").jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'เปิดภาพ'
          });
          $("#Radiant").jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'Radiant'
          });
          $("#DownLoadCase").jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'ดาวน์โหลด'
          });
          $("#AcceptCase").jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'รับอ่านผล'
          });
          $("#Reject").jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'ปฏิเสธ'
          });
          $("#Respone").jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'ส่งผลอ่าน'
          });
          $("#CancelCase").jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'ออก'
          });
          $("#openButton").jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'ตั้งค่าการแสดง column'
          });
          $("#HistoryTab").jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'คลิกเพื่อแสดงประวัติการตรวจทั้งหมด'
          });
          $("#TemplateTab").jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'คลิกเพื่อซ่อนหรือแสดงเทมเพลตทั้งหมด'
          });

          // $("#columntablegridCaseActive").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง' });
          $("#row00gridCaseActive").children().eq(5).jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง'
          });
          $("#row00gridCaseActive").children().eq(7).jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'ใส่ค่าที่ต้องการค้นหา'
          });
          $("#row00gridCaseActive").children().eq(8).jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'ใส่ค่าที่ต้องการค้นหา'
          });
          $("#row00gridCaseActive").children().eq(10).jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'ใส่ค่าที่ต้องการค้นหา'
          });
          $("#row00gridCaseActive").children().eq(11).jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'ใส่ค่าที่ต้องการค้นหา'
          });
          $("#row00gridCaseActive").children().eq(12).jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'ใส่ค่าที่ต้องการค้นหา'
          });
          $("#row00gridCaseActive").children().eq(15).jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'ใส่ค่าที่ต้องการค้นหา'
          });
          $("#row00gridCaseActive").children().eq(16).jqxTooltip({
               showDelay: 1000,
               position: 'top',
               content: 'ใส่ค่าที่ต้องการค้นหา'
          });


          // $("#row00gridCasePatient").children().eq(2).jqxTooltip({ showDelay: 1000, position: 'top', content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง' });
          // $("#row00gridCasePatient").children().eq(4).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
          // $("#row00gridCasePatient").children().eq(5).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
          // $("#row00gridCasePatient").children().eq(7).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
          // $("#row00gridCasePatient").children().eq(8).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
          // $("#row00gridCasePatient").children().eq(9).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
          // $("#row00gridCasePatient").children().eq(10).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
          // $("#row00gridCasePatient").children().eq(11).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
     }, 3000);
}

async function ShowPatientData(dataRecord) {

     Case_TechID = User_ID;
     Case_Status = CS_Name_EN;
     Case_StatusID = dataRecord.casestatusId;
     Case_OrthancID = dataRecord.ID;

     var CaseID = dataRecord.Case_ID;
     //var TechID = dataRecord.Case_TechID;
     var Case_ACC = dataRecord.Case_ACC;
     var Case_OrthancStudyID = dataRecord.Case_OrthancStudyID;
     var Case_DESC = dataRecord.Case_DESC;
     var hospitalId = dataRecord.hospitalId;
     var patientId = dataRecord.patientId;
     var cliamerightId = dataRecord.cliamerightId;
     var casestatusId = dataRecord.casestatusId;
     var userId = dataRecord.userId;
     var urgenttypeId = dataRecord.urgenttypeId;
     var FullName_EN = dataRecord.Patient_NameEN;
     var FullName_TH = dataRecord.FullName_TH;
     var Patient_NameTH = dataRecord.Patient_NameTH;
     var Patient_LastNameTH = dataRecord.Patient_LastNameTH;
     var Patient_NameEN = dataRecord.Patient_NameEN;
     var Patient_LastNameEN = dataRecord.Patient_LastNameEN;
     var Hos_OrthancID = dataRecord.hospitalId;
     // var Hos_Name = dataRecord.InstitutionName;
     var Patient_HN = dataRecord.Patient_HN;
     // var Patient_HN = dataRecord.Patient_HN;
     var Case_StudyDescription = dataRecord.Case_StudyDescription;
     var Patient_Sex = dataRecord.Patient_Sex;
     var Patient_Age = dataRecord.Patient_Age;
     var Patient_Tel = dataRecord.Patient_Tel;
     var Patient_Birthday = dataRecord.Patient_Birthday;
     var Patient_CitizenID = dataRecord.Patient_CitizenID;
     var casestatus_ID = dataRecord.casestatus_ID;
     var urgenttype_ID = dataRecord.urgenttype_ID;
     var TreatmentRights_ID = dataRecord.cliamerightId;
     var CS_Name_EN = dataRecord.CS_Name_EN; // CaseStatus
     var Hos_Name = User_Hospital_Name;

     var TreatmentRights_Name = dataRecord.TreatmentRights_Name;
     var UG_Type_Name = dataRecord.UGType_Name;
     var Case_UrgentType = dataRecord.urgenttype_ID;
     var ProtocolName = dataRecord.Case_ProtocolName;
     var Modality = dataRecord.Case_Modality;
     var Patient_RadiologistDoctor = dataRecord.Patient_RadiologistDoctor;
     var Patient_RefferalDoctor = dataRecord.Patient_RefferalDoctor;
     var createdAt = dataRecord.createdAt;
     var Radiologist_ID = dataRecord.Radiologist_ID;
     var Refferal_ID = dataRecord.Refferal_ID;

     console.log("Patient_RadiologistDoctor = " + Patient_RadiologistDoctor + " Radiologist_ID = " + Radiologist_ID);
     console.log("Patient_RefferalDoctor = " + Patient_RefferalDoctor + " Refferal_ID = " + Refferal_ID);

     // var SeriesInstanceUID = dataRecord.SeriesInstanceUID;
     // var SeriesInstances = dataRecord.SeriesInstances;
     var StudyInstanceUID = dataRecord.StudyInstanceUID;

     var Order_Price = dataRecord.Case_Price;
     var Order_DF = dataRecord.Case_Department;
     var Case_DocRespone = dataRecord.Case_DESC;

     $("#PatientData").val(dataRecord);
     $("#InstancesOrthanC").val(StudyInstanceUID);
     $("#OrthancStudyID").val(Case_OrthancStudyID);

     $("#ManageCase").show();

     getCliamesType(hospitalId);
     getUrgency(hospitalId);
     getRadiologistList(hospitalId);
     getPatientDoctorList(hospitalId);

     $('#ManageCase').focus();
     $('#PHos').val(Hos_Name);
     $('#PName').html(FullName_EN);
     $('#HCase').val(Case_StudyDescription);
     $('#HProtocol').val(ProtocolName);
     $('#HModality').val(Modality);
     //$('#vMType').html(vType);
     $('#vDStatus').html(CS_Name_EN);
     $('#sUrgentType').html(UG_Type_Name);

     //$('#vCaseID').val(CaseID);
     $('#vHN').val(Patient_HN);
     $('#vName').val(Patient_NameEN);
     $('#vLName').val(Patient_LastNameEN);
     $('#vSex').val(Patient_Sex);
     //$('#vBirthday').val(Patient_Birthday);
     //$('#vCitizenID').val(Patient_CitizenID);
     $('#vCaseAMT').val(Order_Price);
     $('#vCaseDFAMT').val(Order_DF);
     $('#vCaseDescrpition').val(Case_DocRespone);

     $("#vDPhone").html("");
     $("#vDEmail").html("");
     $("#vDLine").html("");

     $("#ViewCase").on('click', function () {
          var PromiseInstance = getInstance2(User_HosID);
          //const PromiseGetPort = GetPort(instanceID);
          PromiseInstance.then((data) => {
              var baseurl = "";
              if (window.location.hostname == "localhost") {
                  baseurl = "202.28.68.28";
              }else{
                  baseurl = window.location.host.split(":")[0];
              }
              local_url = 'http://' + baseurl + ':' + data.port + '/stone-webviewer/index.html?study=';
              var orthancwebapplink = local_url + data.MainDicomTags.StudyInstanceUID;
              console.log("orthancwebapplink = " + orthancwebapplink);
              window.open(orthancwebapplink, '_blank');
              //openInNewTab(url);
          }).catch(function (error) {
              console.log("error in ViewCase = " + error);
          });
     });

     setTimeout(function () {

          $('#vCitizenID').val(Patient_CitizenID);
          $('#RightID').val(TreatmentRights_ID);
          $('#UrgentTypeID').val(Case_UrgentType);
          $('#vPatientDoctor').val(Patient_RefferalDoctor);
          // if (User_TypeID != 4) {
          //      $('#TechID').val(Case_TechID);
          // } else {
          //      $('#TechID').val(User_ID);
          // }
          // if (TreatmentRights_ID != '0') {
          //      $("#vRight").jqxDropDownList('selectIndex', TreatmentRights_ID);
          //      //$("#sRights").html(TreatmentRights_Name);
          // }
          // if (urgenttype_ID != '0') {
          //      $("#vUrgentType").jqxDropDownList('selectIndex', urgenttype_ID);
          // }

          // if (Patient_RadiologistDoctor != "" || Patient_RadiologistDoctor != null) {
          //      $("#vListDoctor").jqxDropDownList('selectItem', Patient_RadiologistDoctor);
          // }
          // if (Patient_RefferalDoctor != "" || Patient_RefferalDoctor != null) {
          //      $("#vPatientDoctor").jqxDropDownList('selectItem', Patient_RefferalDoctor);
          // }

          // $("#vUrgentType").jqxDropDownList('selectIndex', urgenttype_ID);
          // $("#vRight").jqxDropDownList('selectIndex', TreatmentRights_ID);
          // $("#vListDoctor").jqxDropDownList('selectItem', Patient_RadiologistDoctor);
          // $("#vPatientDoctor").jqxDropDownList('selectItem', Patient_RefferalDoctor);

          //CheckCaseStatus(Case_Status);

          FromTypecheck(Case_StatusID);
          GetDoctor(User_TypeID);
          CheckCaseStatus(Case_StatusID);
          scrollToTop();

     }, 2000);

}

function CheckCaseStatus(Case_StatusID) {
     if (Case_StatusID != "0" && (User_TypeID == 3 || User_TypeID == 7 || User_TypeID == 1 )) {
          $('#frmSaveCase').hide();
     } else {
          $('#frmSaveCase').show();
     }
};

function scrollToTop() {
     $('#gridCaseActive').jqxGrid('clearselection');
     window.scrollTo(0, 0);
};

function openInNewTab(url) {
     var win = window.open(url, '_blank');
     win.focus();
}

function getCliamesType(hosID) {
     $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
     var function_name = "getCliamesType";
     var params = {};
     // console.log("function_name : " + function_name + " => start");
     var url = "/api/cases/options/" + hosID;
     const promises = doGetApi(url, params);
     promises.then((data) => {
          // console.log("data in function "+ function_name + " = " + JSON.stringify(data));
          if (data.Result == 'OK') {
               // console.log("data in function "+ function_name + " = " + JSON.stringify(data));
               const output = [];
               const length = data.Options.cliames.length;
               var databases = new Array();
               // console.log("length = " + length);

               for (i = 0; i < length; i++) {
                    var row = {};
                    row.Value = data.Options.cliames[i].Value;
                    row.DisplayText = data.Options.cliames[i].DisplayText;

                    databases[i] = row;
               }

               var source = {
                    localdata: databases,
                    datatype: "array",
               };

               var dataAdapter = new $.jqx.dataAdapter(source);
               $('#vRight').jqxDropDownList({
                    source: dataAdapter
               });
               // console.log("Success in " + function_name);
          } else {
               // console.log("Error in Get Data " + function_name);
          }
     }).catch((err) => {
          console.log(`function ${function_name} error => ${err}`);
     });
}

function getUrgency(hosID) {
     $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
     var function_name = "getUrgency";
     var params = {};
     var url = "/api/cases/options/" + hosID;
     const promises = doGetApi(url, params);
     promises.then((data) => {
          // console.log("data in function "+ function_name + " = " + JSON.stringify(data));
          if (data.Result == 'OK') {
               const output = [];
               const length = data.Options.urgents.length;
               var databases = new Array();
               // console.log("length = " + length);

               for (i = 0; i < length; i++) {
                    var row = {};
                    row.Value = data.Options.urgents[i].Value;
                    row.DisplayText = data.Options.urgents[i].DisplayText;

                    databases[i] = row;
               }

               var source = {
                    localdata: databases,
                    datatype: "array",
               };

               var dataAdapter = new $.jqx.dataAdapter(source);
               $('#vUrgentType').jqxDropDownList({
                    source: dataAdapter
               });

               // console.log("Success in " + function_name);
          } else {
               // console.log("Error in Get Data " + function_name);
          }
     }).catch((err) => {
          console.log(`function ${function_name} error => ${err}`);
     });
     // console.log("function_name : " + function_name + " => end");
}

function getRadiologistList(hosID) {
     $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
     var function_name = "getRadiologistList";
     var params = {};
     var url = "/api/cases/options/" + hosID;
     const promises = doGetApi(url, params);
     promises.then((data) => {
          if (data.Result == 'OK') {
               // console.log("data in function "+ function_name + " = " + JSON.stringify(data));
               const output = [];
               const length = data.Options.rades.length;
               var databases = new Array();
               // console.log("length = " + length);

               for (i = 0; i < length; i++) {
                    var row = {};
                    row.Value = data.Options.rades[i].Value;
                    row.DisplayText = data.Options.rades[i].DisplayText;

                    databases[i] = row;
               }

               var source = {
                    localdata: databases,
                    datatype: "array",
               };

               var dataAdapter = new $.jqx.dataAdapter(source);
               $('#vListDoctor').jqxDropDownList({
                    source: dataAdapter
               });

               // console.log("Success in " + function_name);
          } else {
               // console.log("Error in Get Data " + function_name);
          }
     }).catch((err) => {
          console.log(`function ${function_name} error => ${err}`);
     });
}

function getPatientDoctorList(hosID) {
     $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
     var function_name = "getPatientDoctorList";
     var params = {};
     var url = "/api/cases/options/" + hosID;
     const promises = doGetApi(url, params);
     promises.then((data) => {
          if (data.Result == 'OK') {
               // console.log("data in function "+ function_name + " = " + JSON.stringify(data));
               const output = [];
               const length = data.Options.refes.length;
               var databases = new Array();
               // console.log("length = " + length);
               for (i = 0; i < length; i++) {
                    var row = {};
                    row.Value = data.Options.refes[i].Value;
                    row.DisplayText = data.Options.refes[i].DisplayText;

                    databases[i] = row;
               }

               var source = {
                    localdata: databases,
                    datatype: "array",
               };

               var dataAdapter = new $.jqx.dataAdapter(source);
               $('#vPatientDoctor').jqxDropDownList({
                    source: dataAdapter
               });

               // console.log("Success in " + function_name);
          } else {
               // console.log("Error in Get Data " + function_name);
          }
     }).catch((err) => {
          console.log(`function ${function_name} error => ${err}`);
     });
}

function GetDoctor() {
     if (User_TypeID != "4") {
          // SRAD_LIST_DORTOR();
          $('#vMtypeDetail').show();
     }
}

function GetPort() {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     //var PromiseGetLocalFile2 = getLocalFile2(Hos_ID);
     var function_name = "GetPort";
     var params = { username: UserNameID };
     var url = "/api/orthancproxy/orthancexternalport";
     return new Promise(function (resolve, reject) {
          // console.log("function_name : " + function_name + " => start");
          $.get(url, params, function (data) {
               console.log("data = " + JSON.stringify(data) );
               resolve(data);
          }).fail(function (error) {
               // console.log("error = " + error);
               reject(error);
          });
          // console.log("function_name : " + function_name + " => end");
     });
};

function getInstance2(Hos_ID) {
     var OrthancStudyID = $("#OrthancStudyID").val();
     var orthancUri = '/studies/';
     return new Promise(function (resolve, reject) {
          var doCallGetPort = GetPort();
          doCallGetPort.then((data) => {
               var ports = data.port;
               var orthancUri = '/studies/' + OrthancStudyID;
               var queryStr = "";
               var params = { method: 'get', uri: orthancUri, body: queryStr, hospitalId: Hos_ID };
               var url = "/api/orthancproxy/find";
               $.post(url, params, function (data2) {
                    data2.port = ports;
                    console.log("data2 = " + JSON.stringify(data2));
                    resolve(data2);
               }).fail(function (error) {
                    // console.log("error = " + error);
                    reject(error);
               });
          });
     });
}

function FromTypecheck(Case_StatusID) {

     if (User_TypeID == "4") {
          //$('#frmSaveCase').hide();
          //$('#frmCancelCase').hide();
          $('#vName').jqxInput({
               disabled: false
          });
          $('#vLName').jqxInput({
               disabled: false
          });
          $('#vCitizenID').jqxInput({
               disabled: false
          });

          // $('#vPatientDoctor').jqxInput({
          //     disabled: true
          // });

          $("#PMFileImage").hide();
          $("#DMFileImage").show();

          if (Case_StatusID == "2") {
               $('#frmAccept').hide();
               $('#frmCancelAccept').hide();
          } else {
               $('#frmAccept').show();
               $('#frmCancelAccept').show();
          }
     } else {
          $('#frmAccept').hide();
          $('#frmCancelAccept').hide();
          $("#PMFileImage").show();
          $("#DMFileImage").hide();
     }

     if (Case_StatusID != "0") {
          $('#vMtypeDetail').hide();

          $('#vName').jqxInput({
               disabled: false
          });
          $('#vLName').jqxInput({
               disabled: false
          });
          $('#vCitizenID').jqxInput({
               disabled: false
          });

          // $('#vPatientDoctor').jqxInput({
          //     disabled: true
          // });

          if (Case_StatusID == "3") {
               $('#frmReportCase').show();
          } else {
               $('#frmReportCase').hide();
          }

          if (Case_StatusID == "1" || Case_StatusID == "2") {
               $('#frmRenewCase').show();
          }
     } else {
          $('#vName').jqxInput({
               disabled: false
          });
          $('#vLName').jqxInput({
               disabled: false
          });
          $('#vCitizenID').jqxInput({
               disabled: false
          });
          // $('#vPatientDoctor').jqxInput({
          //     disabled: false
          // });
     }
}

function ShowNoti(Msg, Type) {
     $("#MessageNoti").html(Msg);
     $("#Notification").jqxNotification({
          template: Type
     });
     $("#Notification").jqxNotification("open");
}

module.exports = {
     startHospitalCase_Admin
}