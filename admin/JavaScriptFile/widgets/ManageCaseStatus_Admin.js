const doPostApi = function (apiurl, params) {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     return new Promise(function (resolve, reject) {
          $.post(apiurl, params, function (data) {
               resolve(data);
          }).fail(function (error) {
               reject(error);
          });
     });
}

const doGetApi = function (apiurl, params) {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     return new Promise(function (resolve, reject) {
          $.get(apiurl, params, function (data) {
               resolve(data);
          }).fail(function (error) {
               reject(error);
          });
     });
}


$(document).ready(function () {

});

function Start_CaseStatus() {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     ///////////////// Tooltips Header Column /////////////////////////////
     var tooltiprenderer = function (element) {
          $(element).parent().jqxTooltip({ position: 'top', content: "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง" });
     };



     $('#CaseStatus').jqxGrid({
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
               // row.CS_Name = data.Records[i].CS_Name;
               // row.CS_DESC = data.Records[i].CS_DESC;    
               { text: 'id', datafield: 'id', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '10%' },
               { text: 'Name_EN', datafield: 'CS_Name_EN', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '25%' },
               { text: 'Name_TH', datafield: 'CS_Name_TH', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '25%' },
               { text: 'CS_DESC', datafield: 'CS_DESC', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '20%' },
               { text: 'StatusID', datafield: 'generalstatusId', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '10%' },
               {
                    text: 'Edit', datafield: 'Edit', align: 'center', columntype: 'button', cellsalign: 'center', width: '10%',
                    cellsrenderer: function (row) { return "แก้ไข"; },
                    buttonclick: function (row) {
                         Editrow = row;
                         var offset = $("#CaseStatus").offset();
                         var dataRecord = $("#CaseStatus").jqxGrid('getrowdata', Editrow);
                         // var dataRecord = JSON.parse(dataRecords);

                         var Id = dataRecord.id;
                         var CS_Name_EN = dataRecord.CS_Name_EN;
                         var CS_Name_TH = dataRecord.CS_Name_TH;
                         var CS_DESC = dataRecord.CS_DESC;
                         var hospitalId = dataRecord.hospitalId;
                         var generalstatusId = dataRecord.generalstatusId;

                         // <input type="hidden" id="CaseStatus">
                         // <input type="hidden" id="CaseStatusID">
                         // <input type="hidden" id="CaseStatusDescription"></input>

                         $("#CaseStatusNameEN").val(CS_Name_EN);
                         $("#CaseStatusNameTH").val(CS_Name_TH);
                         $("#CaseStatusGeneralStatusID").val(generalstatusId);
                         $("#CaseStatusDescription").val(CS_DESC);
                         //// Remember //// 
                         $("#NameEN").val(CS_Name_EN);
                         $("#NameTH").val(CS_Name_TH);
                         $("#Status").val(generalstatusId);
                         $("#Description").val(CS_DESC);
                         $("#CaseStatusID").val(Id);
                         $("#HosID").val(hospitalId);

                         $("#AddCaseStatus").hide();
                         $("#EditCaseStatus").show();
                         $("#CaseStatusList").hide();
                         $("#CaseStatusForm").show();
                         $("#HeaderCaseStatusForm").text('แก้ไข CaseStatus: ' + CS_Name_EN + 'หรือ ' + CS_Name_TH);
                    }
               },
               {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: '10%',
                    cellsrenderer: function (row) { return "Delete"; },
                    buttonclick: function (row) {
                         Editrow = row;
                         var offset = $("#CaseStatus").offset();
                         var dataRecord = $("#CaseStatus").jqxGrid('getrowdata', Editrow);

                         var Id = dataRecord.id;
                         var CS_Name_EN = dataRecord.CS_Name_EN;
                         var CS_Name_TH = dataRecord.CS_Name_TH;
                         var CS_DESC = dataRecord.CS_DESC;
                         var hospitalId = dataRecord.hospitalId;
                         var generalstatusId = dataRecord.generalstatusId;
                         const url = "/api/casestatus/delete";
                         const params = {id : Id, CS_Name_EN: CS_Name_EN, CS_Name_TH: CS_Name_TH, CS_DESC : CS_DESC, hospitalId: hospitalId, generalstatusId: generalstatusId};
                         // {id : Id, CS_Name_EN: CS_Name_EN, CS_Name_TH: CS_Name_TH, CS_DESC : CS_DESC, hospitalId: hospitalId, generalstatusId: generalstatusId};
                         // var hospitalId = dataRecord.hospitalId;

                         if (confirm(`Do you want to Delete CaseStatus Name ${CS_Name_EN} or ${CS_Name_TH} ?`)) {
                              const promises = doPostApi(url, params);
                              promises.then( (data) => {
                                   console.log(`url : ${url} => data: ${data}`);
                                   if(data.Result == "OK"){
                                        ShowNoti('ลบ CaseStatus สำเร็จ', "success");
                                   }else{
                                        ShowNoti('ลบ CaseStatus ไม่สำเร็จ', "warning");
                                   }
                                   clearselection();
                              }).catch( (error) => {
                                   console.log(`url : ${url} => error: ${error}`);
                                   ShowNoti('ลบ CaseStatus ไม่สำเร็จ', "warning");
                              });
                         }
                    }
               }
          ]
     });
     // Sort

     // $("#CaseStatus").jqGrid('sortGrid','id', false, 'asc');

     $("#CaseStatus").on('rowdoubleclick', function (event) {
          Editrow = event.args.rowindex;
          var offset = $("#CaseStatus").offset();
          var dataRecord = $("#CaseStatus").jqxGrid('getrowdata', Editrow);
          // var dataRecord = JSON.parse(dataRecords);

          var Id = dataRecord.id;
          var CS_Name_EN = dataRecord.CS_Name_EN;
          var CS_Name_TH = dataRecord.CS_Name_TH;
          var CS_DESC = dataRecord.CS_DESC;
          var hospitalId = dataRecord.hospitalId;
          var generalstatusId = dataRecord.generalstatusId;

          // <input type="hidden" id="CaseStatus">
          // <input type="hidden" id="CaseStatusID">
          // <input type="hidden" id="CaseStatusDescription"></input>

          $("#CaseStatusNameEN").val(CS_Name_EN);
          $("#CaseStatusNameTH").val(CS_Name_TH);
          $("#CaseStatusGeneralStatusID").val(generalstatusId);
          $("#CaseStatusDescription").val(CS_DESC);
          //// Remember //// 
          $("#NameEN").val(CS_Name_EN);
          $("#NameTH").val(CS_Name_TH);
          $("#Status").val(generalstatusId);
          $("#Description").val(CS_DESC);
          $("#CaseStatusID").val(Id);
          $("#HosID").val(hospitalId);
          
          /* 
          <input type="hidden" id="CaseStatusNameEN">
          <input type="hidden" id="CaseStatusNameTH">
          <input type="hidden" id="CaseStatusID">
          <input type="hidden" id="CaseStatusDescription">
          <input type="hidden" id="CaseStatusRecord">
          <input type="hidden" id="TotalCaseStatus">
          */

          //Keep Patient Data

     });

     $("#EditCaseStatus").click( () =>{

          var Id = $("#CaseStatusID").val();
          var CS_Name_EN = $("#NameEN").val();
          var CS_Name_TH = $("#NameTH").val();
          var CS_DESC = $("#Description").val();
          var hospitalId = $("#HosID").val();
          var generalstatusId = $("#Status").val();


          const url = "/api/casestatus/update";
          const params = {id : Id, CS_Name_EN: CS_Name_EN, CS_Name_TH: CS_Name_TH, CS_DESC : CS_DESC, hospitalId: hospitalId, generalstatusId: generalstatusId};
          const promises = doPostApi(url, params);

          promises.then( (data) => {
               console.log(`url : ${url} => data: ` + JSON.stringify(data) );
               if(data.Result == "OK"){
                    ShowNoti('แก้ไข CaseStatus สำเร็จ', "success");
                    ReloadCaseStatusGrid();
               }else{
                    ShowNoti('แก้ไข CaseStatus ไม่สำเร็จ', "warning");
               }
               clearselection();
          }).catch( (error) => {
               console.log(`url : ${url} => error: ${error}`);
               ShowNoti('แก้ไข CaseStatus ไม่สำเร็จ', "warning");
          });
     });

     $("#AddCaseStatus").click( () =>{
          var Id =  Number($("#TotalCaseStatus").val()) + 1;
          var CS_Name_EN = $("#NameEN").val();
          var CS_Name_TH = $("#NameTH").val();
          var CS_DESC = $("#Description").val();
          var hospitalId = $("#HosID").val();
          var generalstatusId = $("#Status").val();

          const url = "/api/casestatus/add";
          const params = {id : Id, CS_Name_EN: CS_Name_EN, CS_Name_TH: CS_Name_TH, CS_DESC : CS_DESC, hospitalId: hospitalId, generalstatusId: generalstatusId};
          const promises = doPostApi(url, params);
          promises.then( (data) => {
               console.log(`url : ${url} => data: ` + JSON.stringify(data) );
               if(data.Result == "OK"){
                    ShowNoti('เพิ่ม CaseStatus สำเร็จ', "success");
                    ReloadCaseStatusGrid();
               }else{
                    ShowNoti('เพิ่ม CaseStatus ไม่สำเร็จ', "warning");
               }
               clearselection();
          }).catch( (error) => {
               console.log(`url : ${url} => error: ${error}`);
               ShowNoti('เพิ่ม CaseStatus ไม่สำเร็จ', "warning");
          });
     });

     $("#ButtonAdd").click(function () {
          $("#AddCaseStatus").show();
          $("#EditCaseStatus").hide();
          $("#CaseStatusList").hide();
          $("#CaseStatusForm").show();
          $("#HeaderCaseStatusForm").text('สร้าง CaseStatus');
     });

     $("#BackCaseStatusForm").click(function () {
          $("#AddCaseStatus").show();
          $("#EditCaseStatus").hide();
          $("#CaseStatusList").show();
          $("#CaseStatusForm").hide();
     });

     getCaseStatus();
     $("#CaseStatusForm").hide();

}


function ReloadCaseStatusGrid(){
     $("#CaseStatus").jqxGrid("clear");
     getCaseStatus();
     $("#BackCaseStatusForm").click();
}

function getCaseStatus() {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     var function_name = "getCaseStatus";
     var params = {};
     var url = "/api/casestatus/list" ;
     const promises = doPostApi(url, params);
     promises.then( (data) => {
          console.log("data in " + function_name + " : " + JSON.stringify(data));
          if (data.Result == 'OK') {
               var databases = new Array();
               for (i = 0; i < data.Records.length; i++) {
                    var row = {};
                    row.id = data.Records[i].id;
                    row.CS_Name = data.Records[i].CS_Name;
                    row.CS_DESC = data.Records[i].CS_DESC;
                    row.CS_Name_EN = data.Records[i].CS_Name_EN;
                    row.CS_Name_TH = data.Records[i].CS_Name_TH;
                    row.generalstatusId = data.Records[i].generalstatusId;
                    row.hospitalId = User_HosID;                         
                    databases[i] = row;
               }

               var results = JSON.stringify(databases);
               $("#CaseStatusRecord").val(results);
               $("#TotalCaseStatus").val(data.TotalRecordCount);

               var source =
               {
                    localdata: databases,
                    datatype: "array",
               };

               var dataAdapter = new $.jqx.dataAdapter(source);
               $('#CaseStatus').jqxGrid({
                    source: dataAdapter
               });
               // console.log("Success in " + function_name);
          } else {
               // console.log("Error in Get Data " + function_name);
          }
     }).catch(function (error) {
          console.log(JSON.stringify(error));
     })
}

function ShowNoti(Msg, Type) {
     $("#MessageNoti").html(Msg);
     $("#Notification").jqxNotification({
         template: Type
     });
     $("#Notification").jqxNotification("open");
}

function clearselection(){
     $("#NameEN").val();
     $("#NameTH").val();
     $("#Status").val();
     $("#Description").val();
     $("#CaseStatusID").val();
     $("#HosID").val();
     $('#CaseStatus').jqxGrid('clearselection');
     getCaseStatus();
}

module.exports = {
	Start_CaseStatus
}