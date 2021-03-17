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

function Start_GeneralStatus() {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     ///////////////// Tooltips Header Column /////////////////////////////
     var tooltiprenderer = function (element) {
          $(element).parent().jqxTooltip({ position: 'top', content: "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง" });
     };

     $('#GeneralStatus').jqxGrid({
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
               // row.GS_Name = data.Records[i].GS_Name;
               // row.GS_Remark = data.Records[i].GS_Remark;    
               { text: 'id', datafield: 'id', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '10%' },
               { text: 'Name', datafield: 'GS_Name', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '30%' },
               // { text: 'UGType_ColorCode', datafield: 'UGType_ColorCode', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '25%' },
               { text: 'Remark', datafield: 'GS_Remark', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '50%' },
               // { text: 'UGType_WarningStep', datafield: 'FullNaUGType_WarningStepme_TH', align: 'center', rendered: tooltiprenderer, width: '20%' },
               {
                    text: 'Edit', datafield: 'Edit', align: 'center', columntype: 'button', cellsalign: 'center', width: '10%',
                    cellsrenderer: function (row) { return "แก้ไข"; },
                    buttonclick: function (row) {
                         Editrow = row;
                         var offset = $("#GeneralStatus").offset();
                         var dataRecord = $("#GeneralStatus").jqxGrid('getrowdata', Editrow);

                         var Id = dataRecord.id;
                         var GS_Name = dataRecord.GS_Name;
                         var GS_Remark = dataRecord.GS_Remark;
                         var hospitalId = dataRecord.hospitalId;

                         // <input type="hidden" id="GeneralStatus">
                         // <input type="hidden" id="GeneralStatusID">
                         // <input type="hidden" id="GeneralStatusRemark"></input>

                         $("#Name").val(GS_Name);
                         $("#Remark").val(GS_Remark);

                         $("#GeneralStatus").val(GS_Name);
                         $("#GeneralStatusID").val(Id);
                         $("#GeneralStatusRemark").val(GS_Remark);
                         $("#HosID").val(hospitalId);

                         $("#AddGeneralStatus").hide();
                         $("#EditGeneralStatus").show();
                         $("#GeneralStatusList").hide();
                         $("#GeneralStatusForm").show();
                         $("#HeaderGeneralStatusForm").text('แก้ไข GeneralStatus: ' + GS_Name);
                         

                    }
               },
               {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: '10%',
                    cellsrenderer: function (row) { return "Delete"; },
                    buttonclick: function (row) {
                         Editrow = row;
                         var offset = $("#GeneralStatus").offset();
                         var dataRecord = $("#GeneralStatus").jqxGrid('getrowdata', Editrow);

                         var Id = dataRecord.id;
                         var GS_Name = dataRecord.GS_Name;
                         var GS_Remark = dataRecord.GS_Remark;
                         var hospitalId = dataRecord.hospitalId;
                         const url = "/api/generalstatus/delete";
                         const params = {id : Id, GS_Name: GS_Name, GS_Remark : GS_Remark, hospitalId: hospitalId};
                         // {id : Id, GS_Name: GS_Name, GS_Remark : GS_Remark, hospitalId: hospitalId};
                         // var hospitalId = dataRecord.hospitalId;

                         if (confirm("Do you want to Delete GeneralStatus Name " + GS_Name + " ?")) {
                              const promises = doPostApi(url, params);
                              promises.then( (data) => {
                                   console.log(`url : ${url} => data: ${data}`);
                                   if(data.Result == "OK"){
                                        ShowNoti('ลบ GeneralStatus สำเร็จ', "success");
                                   }else{
                                        ShowNoti('ลบ GeneralStatus ไม่สำเร็จ', "warning");
                                   }
                                   clearselection();
                              }).catch( (error) => {
                                   console.log(`url : ${url} => error: ${error}`);
                                   ShowNoti('ลบ GeneralStatus ไม่สำเร็จ', "warning");
                              });
                         }
                    }
               }
          ]
     });
     // Sort

     // $("#GeneralStatus").jqGrid('sortGrid','id', false, 'asc');

     // $("#GeneralStatus").on('rowdoubleclick', function (event) {
     //      Editrow = event.args.rowindex;
     //      var offset = $("#GeneralStatus").offset();
     //      var dataRecord = $("#GeneralStatus").jqxGrid('getrowdata', Editrow);
     //      // var dataRecord = JSON.parse(dataRecords);

     //      var Id = dataRecord.id;
     //      var GS_Name = dataRecord.GS_Name;
     //      var GS_Remark = dataRecord.GS_Remark;
     //      var hospitalId = dataRecord.hospitalId;

     //      // <input type="hidden" id="GeneralStatus">
     //      // <input type="hidden" id="GeneralStatusID">
     //      // <input type="hidden" id="GeneralStatusRemark"></input>

     //      $("#Name").val(GS_Name);
     //      $("#Remark").val(GS_Remark);

     //      $("#GeneralStatus").val(GS_Name);
     //      $("#GeneralStatusID").val(Id);
     //      $("#GeneralStatusRemark").val(GS_Remark);
     //      $("#HosID").val(hospitalId);

     //      //Keep Patient Data

     // });

     $("#EditGeneralStatus").click( () =>{
          var Id = $("#GeneralStatusID").val();
          var GS_Name = $("#Name").val();
          var GS_Remark = $("#Remark").val();
          var hospitalId = $("#HosID").val();
          const url = "/api/generalstatus/update";
          const params = {id : Id, GS_Name: GS_Name, GS_Remark : GS_Remark, hospitalId: hospitalId};
          const promises = doPostApi(url, params);

          promises.then( (data) => {
               console.log(`url : ${url} => data: ` + JSON.stringify(data) );
               if(data.Result == "OK"){
                    ShowNoti('แก้ไข GeneralStatus สำเร็จ', "success");
                    ReloadGeneralStatusGrid();
               }else{
                    ShowNoti('แก้ไข GeneralStatus ไม่สำเร็จ', "warning");
               }
               clearselection();
          }).catch( (error) => {
               console.log(`url : ${url} => error: ${error}`);
               ShowNoti('แก้ไข GeneralStatus ไม่สำเร็จ', "warning");
          });
     });

     $("#AddGeneralStatus").click( () =>{
          var Id =  Number($("#TotalGeneralStatus").val()) + 1;
          var GS_Name = $("#Name").val();
          var GS_Remark = $("#Remark").val();
          var hospitalId = $("#HosID").val();

          const url = "/api/generalstatus/add";
          const params = {id : Id, GS_Name: GS_Name, GS_Remark : GS_Remark, hospitalId: hospitalId};
          const promises = doPostApi(url, params);
          promises.then( (data) => {
               console.log(`url : ${url} => data: ` + JSON.stringify(data) );
               if(data.Result == "OK"){
                    ShowNoti('เพิ่ม GeneralStatus สำเร็จ', "success");
                    ReloadGeneralStatusGrid();
               }else{
                    ShowNoti('เพิ่ม GeneralStatus ไม่สำเร็จ', "warning");
               }
               clearselection();
          }).catch( (error) => {
               console.log(`url : ${url} => error: ${error}`);
               ShowNoti('เพิ่ม GeneralStatus ไม่สำเร็จ', "warning");
          });
     });

     $("#ButtonAdd").click(function () {
          $("#AddGeneralStatus").show();
          $("#EditGeneralStatus").hide();
          $("#GeneralStatusList").hide();
          $("#GeneralStatusForm").show();
          $("#HeaderGeneralStatusForm").text('สร้าง GeneralStatus');
     });

     $("#BackGeneralStatusForm").click(function () {
          $("#AddGeneralStatus").show();
          $("#EditGeneralStatus").hide();
          $("#GeneralStatusList").show();
          $("#GeneralStatusForm").hide();
     });

     getGeneralStatus();
     $("#GeneralStatusForm").hide();

}

function getGeneralStatus() {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     var function_name = "getGeneralStatus";
     var params = {};
     var url = "/api/generalstatus/list" ;
     const promises = doPostApi(url, params);
     promises.then( (data) => {
          console.log("data in " + function_name + " : " + JSON.stringify(data));
          if (data.Result == 'OK') {
               var databases = new Array();
               for (i = 0; i < data.Records.length; i++) {
                    var row = {};
                    row.id = data.Records[i].id;
                    row.GS_Name = data.Records[i].GS_Name;
                    row.GS_Remark = data.Records[i].GS_Remark;
                    row.hospitalId = User_HosID;                         
                    databases[i] = row;
               }

               var results = JSON.stringify(databases);
               $("#GeneralStatusRecord").val(results);
               $("#TotalGeneralStatus").val(data.TotalRecordCount);

               var source =
               {
                    localdata: databases,
                    datatype: "array",
               };

               var dataAdapter = new $.jqx.dataAdapter(source);
               $('#GeneralStatus').jqxGrid({
                    source: dataAdapter
               });
               // console.log("Success in " + function_name);
          } else {
               // console.log("Error in Get Data " + function_name);
          }
     }).catch(function (error) {
          console.log(JSON.stringify(error));
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
     $("#Name").val('');
     $("#Remark").val('');
     $("#GeneralStatus").val('');
     $("#GeneralStatusID").val('');
     $("#GeneralStatusRemark").val('');
     $("#HosID").val('');
     $('#GeneralStatus').jqxGrid('clearselection');
     getGeneralStatus();
}

function ReloadGeneralStatusGrid(){
     $("#GeneralStatus").jqxGrid("clear");
     getGeneralStatus();
     $("#BackGeneralStatusForm").click();
}

module.exports = {
	Start_GeneralStatus,
}