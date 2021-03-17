$(document).ready(function () {

});

function Start_UGTypes() {

     ///////////////// Tooltips Header Column /////////////////////////////
     var tooltiprenderer = function (element) {
          $(element).parent().jqxTooltip({ position: 'top', content: "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง" });
     };

     $('#UrgentTypes').jqxGrid({
          width: "100%",
          autoheight: true,
          sortable: true,
          altrows: true,
          filterable: true,
          showfilterrow: true,
          columnsreorder: true,
          autorowheight: true,
          columnsresize: true,
          pageable: true,
          pagesize: 10,
          scrollmode: 'logical',
          autoShowLoadElement: false,
          pagesizeoptions: ['10', '20', '50', '100', '500'],
          theme: theme,
          columns: [
               { text: 'id', datafield: 'id', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '5%' },
               { text: 'UGType_Name', datafield: 'UGType_Name', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '25%' },
               // { text: 'UGType_ColorCode', datafield: 'UGType_ColorCode', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '25%' },
               { text: 'UGType_AcceptStep', datafield: 'UGType_AcceptStep', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '30%' },
               { text: 'UGType_WorkingStep', datafield: 'UGType_WorkingStep', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '30%' },
               // { text: 'UGType_WarningStep', datafield: 'FullNaUGType_WarningStepme_TH', align: 'center', rendered: tooltiprenderer, width: '20%' },
               {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: '10%',
                    cellsrenderer: function (row) { return "Delete"; },
                    buttonclick: function (row) {
                         Editrow = row;
                         var offset = $("#UrgentTypes").offset();
                         var dataRecord = $("#UrgentTypes").jqxGrid('getrowdata', Editrow);

                         var id = dataRecord.id;
                         var UGType_Name = dataRecord.UGType_Name;
                         var UGType_ColorCode = dataRecord.UGType_ColorCode;
                         var UGType_AcceptStep = JSON.parse(dataRecord.UGType_AcceptStep);
                         var UGType_WorkingStep = JSON.parse(dataRecord.UGType_WorkingStep);
                         var UGType_WarningStep = JSON.parse(dataRecord.UGType_WarningStep);
                         var hospitalId = dataRecord.hospitalId;

                         if (confirm("Do you want to Delete UrgencyTypes Name " + UGType_Name + " ?")) {
                              let promiseDeleteUrgencyTypes = DeleteUrgencyTypes(id, UGType_Name, UGType_ColorCode, UGType_AcceptStep, UGType_WorkingStep, UGType_WarningStep, hospitalId);
                              promiseDeleteUrgencyTypes.then( (data) => {
                                   ShowNoti('ลบ UrgencyTypes สำเร็จ', "success");
                                   clearselection();
                              }).catch( (error) => {
                                   ShowNoti('ลบ UrgencyTypes ไม่สำเร็จ', "warning");
                              });
                         }
                    }
               }
          ]
     });

     $("#UrgentTypes").on('rowdoubleclick', function (event) {

          Editrow = event.args.rowindex;
          var offset = $("#UrgentTypes").offset();
          var dataRecord = $("#UrgentTypes").jqxGrid('getrowdata', Editrow);
          // var dataRecord = JSON.parse(dataRecords);

          var id = dataRecord.id;
          var UGType_Name = dataRecord.UGType_Name;
          var UGType_ColorCode = dataRecord.UGType_ColorCode;
          var UGType_AcceptStep = (dataRecord.UGType_AcceptStep);
          var UGType_WorkingStep = (dataRecord.UGType_WorkingStep);
          var UGType_WarningStep = (dataRecord.UGType_WarningStep);
          var hospitalId = dataRecord.hospitalId;

          $("#typename").val(UGType_Name);
          $("#AcceptTime").val(UGType_AcceptStep);
          $("#WorkingTime").val(UGType_WorkingStep);
          $("#WarningTime").val(UGType_WarningStep);
          $("#UGTypesID").val(id);
          $("#ColorCode").val(UGType_ColorCode);
          $("#HosID").val(User_HosID);

          //Keep Patient Data

     });

     $("#ButtonEdit").click( () =>{
          let id = $("#UGTypesID").val();
          let UGType_Name = $("#typename").val();
          let UGType_ColorCode = $("#ColorCode").val();
          let UGType_AcceptStep = $("#AcceptTime").val();
          let UGType_WorkingStep = $("#WorkingTime").val();
          let UGType_WarningStep = $("#WarningTime").val();
          let hospitalId = User_HosID;
          let promiseEditUrgencyTypes = EditUrgencyTypes(id, UGType_Name, UGType_ColorCode, UGType_AcceptStep, UGType_WorkingStep, UGType_WarningStep, hospitalId);

          promiseEditUrgencyTypes.then( (data) => {
               ShowNoti('แก้ไข UrgencyTypes สำเร็จ', "success");
               clearselection();
          }).catch( (error) => {
               ShowNoti('แก้ไข UrgencyTypes ไม่สำเร็จ', "warning");
          });
     });

     $("#ButtonAdd").click( () =>{
          let id = $("#UGTypesID").val();
          let UGType_Name = $("#typename").val();
          let UGType_ColorCode = $("#ColorCode").val();
          let UGType_AcceptStep = $("#AcceptTime").val();
          let UGType_WorkingStep = $("#WorkingTime").val();
          let UGType_WarningStep = $("#WarningTime").val();
          let hospitalId = User_HosID;
          let promiseAddUrgencyTypes = AddUrgencyTypes(id, UGType_Name, UGType_ColorCode, UGType_AcceptStep, UGType_WorkingStep, UGType_WarningStep, hospitalId);

          promiseAddUrgencyTypes.then( (data) => {
               console.log ("promiseAddUrgencyTypes success: " + JSON.stringify(data));
               ShowNoti('เพิ่ม UrgencyTypes สำเร็จ', "success");
               clearselection();
          }).catch( (error) => {
               ShowNoti('เพิ่ม UrgencyTypes ไม่สำเร็จ', "warning");
          });
     });

     getUrgencyTypes();
}

function getUrgencyTypes() {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     var function_name = "getUrgencyTypes";
     var params = {};
     return new Promise(function (resolve, reject) {
          // console.log("function_name : " + function_name + " => start");
          var url = "/api/urgenttypes/list/?hospitalId=" + User_HosID;
          $.post(url, params, function (data) {
               console.log("data in " + function_name + " : " + JSON.stringify(data));
               if (data.Result == 'OK') {
                    var databases = new Array();

                    for (i = 0; i < data.Records.length; i++) {
                         var row = {};
                         row.id = data.Records[i].id;
                         row.UGType_Name = data.Records[i].UGType_Name;
                         row.UGType_ColorCode = data.Records[i].UGType_ColorCode;
                         row.UGType_AcceptStep = data.Records[i].UGType_AcceptStep;
                         row.UGType_WorkingStep = data.Records[i].UGType_WorkingStep;
                         row.UGType_WarningStep = data.Records[i].UGType_WorkingStep;
                         row.hospitalId = data.Records[i].hospitalId;
                         databases[i] = row;
                    }

                    var results = JSON.stringify(databases);
                    $("#UGTypes").val(results);

                    var source =
                    {
                         localdata: databases,
                         datatype: "array",
                    };

                    var dataAdapter = new $.jqx.dataAdapter(source);
                    $('#UrgentTypes').jqxGrid({
                         source: dataAdapter
                    });
                    resolve(results);
                    // console.log("Success in " + function_name);
               } else {
                    // console.log("Error in Get Data " + function_name);
               }
          });
     });
}

function AddUrgencyTypes(id, UGType_Name, UGType_ColorCode, UGType_AcceptStep, UGType_WorkingStep, UGType_WarningStep, hospitalId ) {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     var function_name = "AddUrgencyTypes";
     var params = {UGType_Name: UGType_Name, UGType_ColorCode: UGType_ColorCode, UGType_AcceptStep: UGType_AcceptStep,
          UGType_WorkingStep: UGType_WorkingStep, UGType_WarningStep:UGType_WarningStep, hospitalId: User_HosID};
     return new Promise(function (resolve, reject) {
          // console.log("function_name : " + function_name + " => start");
          var url = "/api/urgenttypes/add/" ;
          $.post(url, params, function (data) {
               console.log("data in " + function_name + " : " + JSON.stringify(data));
               if (data.Result == 'OK') {
                    resolve(data);
                    // console.log("Success in " + function_name);
               } else {
                    reject(data);
                    // console.log("Error in Get Data " + function_name);
               }
          });
     });
}

function EditUrgencyTypes(id, UGType_Name, UGType_ColorCode, UGType_AcceptStep, UGType_WorkingStep, UGType_WarningStep, hospitalId ) {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     var function_name = "EditUrgencyTypes";
     var params = {id: id, UGType_Name: UGType_Name, UGType_ColorCode: UGType_ColorCode, UGType_AcceptStep: UGType_AcceptStep,
          UGType_WorkingStep: UGType_WorkingStep, UGType_WarningStep:UGType_WarningStep, hospitalId: User_HosID};
     return new Promise(function (resolve, reject) {
          // console.log("function_name : " + function_name + " => start");
          var url = "/api/urgenttypes/update/" ;
          $.post(url, params, function (data) {
               console.log("data in " + function_name + " : " + JSON.stringify(data));
               if (data.Result == 'OK') {
                    resolve(data);
                    // console.log("Success in " + function_name);
               } else {
                    reject(data);
                    // console.log("Error in Get Data " + function_name);
               }
          });
     });
}

function DeleteUrgencyTypes(id, UGType_Name, UGType_ColorCode, UGType_AcceptStep, UGType_WorkingStep, UGType_WarningStep, hospitalId ) {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     var function_name = "DeleteUrgencyTypes";
     var params = {id: id, UGType_Name: UGType_Name, UGType_ColorCode: UGType_ColorCode, UGType_AcceptStep: UGType_AcceptStep,
          UGType_WorkingStep: UGType_WorkingStep, UGType_WarningStep:UGType_WarningStep, hospitalId: User_HosID};
     return new Promise(function (resolve, reject) {
          // console.log("function_name : " + function_name + " => start");
          var url = "/api/urgenttypes/delete/" ;
          $.post(url, params, function (data) {
               console.log("data in " + function_name + " : " + JSON.stringify(data));
               if (data.Result == 'OK') {
                    resolve(data);
                    // console.log("Success in " + function_name);
               } else {
                    reject(data);
                    // console.log("Error in Get Data " + function_name);
               }
          });
     });
}

function ShowNoti(Msg, Type) {
     $("#MessageNoti").html(Msg);
     $("#Notification").jqxNotification({
         template: Type
     });
     $("#Notification").jqxNotification("open");
}

function clearselection(){
     $("#typename").val("");
     $("#AcceptTime").val('{"dd": "00", "hh": "01", "mn": "00"}');
     $("#WorkingTime").val('{"dd": "00", "hh": "01", "mn": "00"}');
     $("#WarningTime").val('{"dd": "00", "hh": "01", "mn": "00"}');
     $("#UGTypesID").val("");
     $("#ColorCode").val("");
     $("#HosID").val("");
     $('#UrgentTypes').jqxGrid('clearselection');

     getUrgencyTypes();
}

module.exports = {
     Start_UGTypes
}



