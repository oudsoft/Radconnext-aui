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

function Start_Cliamerights() {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     ///////////////// Tooltips Header Column /////////////////////////////
     var tooltiprenderer = function (element) {
          $(element).parent().jqxTooltip({ position: 'top', content: "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง" });
     };

     $("#CliamerightsForm").hide();

     $('#Cliamerights').jqxGrid({
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
               // row.CR_Name = data.Records[i].CR_Name;
               // row.CR_Remark = data.Records[i].CR_Remark;    
               { text: 'id', datafield: 'id', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '10%' },
               { text: 'Name', datafield: 'CR_Name', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '30%' },
               // { text: 'UGType_ColorCode', datafield: 'UGType_ColorCode', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '25%' },
               { text: 'Remark', datafield: 'CR_Remark', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '40%' },
               // { text: 'UGType_WarningStep', datafield: 'FullNaUGType_WarningStepme_TH', align: 'center', rendered: tooltiprenderer, width: '20%' },
               {
                    text: 'Edit', datafield: 'Edit', align: 'center', columntype: 'button', cellsalign: 'center', width: '10%',
                    cellsrenderer: function (row) { return "แก้ไข"; },
                    buttonclick: function (row) {
                         Editrow = row;
                         var offset = $("#Cliamerights").offset();
                         var dataRecord = $("#Cliamerights").jqxGrid('getrowdata', Editrow);

                         var Id = dataRecord.id;
                         var CR_Name = dataRecord.CR_Name;
                         var CR_Remark = dataRecord.CR_Remark;
                         var hospitalId = dataRecord.hospitalId;
                         // const url = "/api/cliamerights/update";
                         // const params = {id : Id, CR_Name: CR_Name, CR_Remark : CR_Remark, hospitalId: hospitalId};
                         // {id : Id, CR_Name: CR_Name, CR_Remark : CR_Remark, hospitalId: hospitalId};
                         // var hospitalId = dataRecord.hospitalId;

                         $("#Name").val(CR_Name);
                         $("#Remark").val(CR_Remark);
                         $("#CliamerightsID").val(Id);
                         $("#HosID").val(hospitalId);

                         $("#SaveCliamerights").hide();
                         $("#EditCliamerights").show();
                         $("#CliamerightsList").hide();
                         $("#CliamerightsForm").show();
                         $("#HeaderCliamerightsForm").text('แก้ไข Cliameright: ' + CR_Name);
                         

                    }
               },
               {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: '10%',
                    cellsrenderer: function (row) { return "Delete"; },
                    buttonclick: function (row) {
                         Editrow = row;
                         var offset = $("#Cliamerights").offset();
                         var dataRecord = $("#Cliamerights").jqxGrid('getrowdata', Editrow);

                         var Id = dataRecord.id;
                         var CR_Name = dataRecord.CR_Name;
                         var CR_Remark = dataRecord.CR_Remark;
                         var hospitalId = dataRecord.hospitalId;
                         const url = "/api/cliamerights/delete";
                         const params = {id : Id, CR_Name: CR_Name, CR_Remark : CR_Remark, hospitalId: hospitalId};
                         // {id : Id, CR_Name: CR_Name, CR_Remark : CR_Remark, hospitalId: hospitalId};
                         // var hospitalId = dataRecord.hospitalId;

                         if (confirm("Do you want to Delete Cliamerights Name " + CR_Name + " ?")) {
                              const promises = doPostApi(url, params);
                              promises.then( (data) => {
                                   console.log(`url : ${url} => data: ${data}`);
                                   if(data.Result == "OK"){
                                        ShowNoti('ลบ Cliamerights สำเร็จ', "success");
                                   }else{
                                        ShowNoti('ลบ Cliamerights ไม่สำเร็จ', "warning");
                                   }
                                   clearselection();
                              }).catch( (error) => {
                                   console.log(`url : ${url} => error: ${error}`);
                                   ShowNoti('ลบ Cliamerights ไม่สำเร็จ', "warning");
                              });
                         }
                    }
               }
          ]
     });
     // Sort

     // $("#Cliamerights").jqGrid('sortGrid','id', false, 'asc');

     // $("#Cliamerights").on('rowdoubleclick', function (event) {
     //      Editrow = event.args.rowindex;
     //      var offset = $("#Cliamerights").offset();
     //      var dataRecord = $("#Cliamerights").jqxGrid('getrowdata', Editrow);
     //      // var dataRecord = JSON.parse(dataRecords);

     //      var Id = dataRecord.id;
     //      var CR_Name = dataRecord.CR_Name;
     //      var CR_Remark = dataRecord.CR_Remark;
     //      var hospitalId = dataRecord.hospitalId;

     //      // <input type="hidden" id="Cliamerights">
     //      // <input type="hidden" id="CliamerightsID">
     //      // <input type="hidden" id="CliamerightsRemark"></input>

     //      $("#Name").val(CR_Name);
     //      $("#Remark").val(CR_Remark);

     //      $("#Cliamerights").val(CR_Name);
     //      $("#CliamerightsID").val(Id);
     //      $("#CliamerightsRemark").val(CR_Remark);
     //      $("#HosID").val(hospitalId);

     //      //Keep Patient Data

     // });

     $("#EditCliamerights").click( () =>{
          var Id = $("#CliamerightsID").val();
          var CR_Name = $("#Name").val();
          var CR_Remark = $("#Remark").val();
          var hospitalId = $("#HosID").val();
          const url = "/api/cliamerights/update";
          const params = {id : Id, CR_Name: CR_Name, CR_Remark : CR_Remark, hospitalId: hospitalId};
          const promises = doPostApi(url, params);

          promises.then( (data) => {
               console.log(`url : ${url} => data: ` + JSON.stringify(data) );
               if(data.Result == "OK"){
                    ShowNoti('แก้ไข Cliamerights สำเร็จ', "success");
                    ReloadCliamerightsGrid()
               }else{
                    ShowNoti('แก้ไข Cliamerights ไม่สำเร็จ', "warning");
               }
               clearselection();
          }).catch( (error) => {
               console.log(`url : ${url} => error: ${error}`);
               ShowNoti('แก้ไข Cliamerights ไม่สำเร็จ', "warning");
          });
     });

     $("#SaveCliamerights").click( () =>{
          var Id =  Number($("#TotalCliamerights").val()) + 1;
          var CR_Name = $("#Name").val();
          var CR_Remark = $("#Remark").val();
          var hospitalId = $("#HosID").val();

          const url = "/api/cliamerights/add";
          const params = {id : Id, CR_Name: CR_Name, CR_Remark : CR_Remark, hospitalId: hospitalId};
          const promises = doPostApi(url, params);
          promises.then( (data) => {
               console.log(`url : ${url} => data: ` + JSON.stringify(data) );
               if(data.Result == "OK"){
                    ShowNoti('เพิ่ม Cliamerights สำเร็จ', "success");
                    ReloadCliamerightsGrid()
               }else{
                    ShowNoti('เพิ่ม Cliamerights ไม่สำเร็จ', "warning");
               }
               clearselection();
          }).catch( (error) => {
               console.log(`url : ${url} => error: ${error}`);
               ShowNoti('เพิ่ม Cliamerights ไม่สำเร็จ', "warning");
          });
     });
     setTimeout(function () {
          getCliamerights();
     },1000);

     $("#ButtonAdd").click(function () {
          $("#SaveCliamerights").show();
          $("#EditCliamerights").hide();
          $("#CliamerightsList").hide();
          $("#CliamerightsForm").show();
          $("#HeaderCliamerightsForm").text('สร้าง Cliameright');
     });

     $("#BackCliamerightsForm").click(function () {
          $("#SaveCliamerights").show();
          $("#EditCliamerights").hide();
          $("#CliamerightsList").show();
          $("#CliamerightsForm").hide();
     });
     
}

function ReloadCliamerightsGrid(){
     $("#Cliamerights").jqxGrid("clear");
     getCliamerights();
     $("#BackCliamerightsForm").click();
}

function getCliamerights() {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     var function_name = "getCliamerights";
     var params = {};
     var url = "/api/cliamerights/list" ;
     const promises = doPostApi(url, params);
     promises.then( (data) => {
          console.log("data in " + function_name + " : " + JSON.stringify(data));
          if (data.Result == 'OK') {
               var databases = new Array();
               for (i = 0; i < data.Records.length; i++) {
                    var row = {};
                    row.id = data.Records[i].id;
                    row.CR_Name = data.Records[i].CR_Name;
                    row.CR_Remark = data.Records[i].CR_Remark;
                    row.hospitalId = User_HosID;                         
                    databases[i] = row;
               }

               var results = JSON.stringify(databases);
               $("#CliamerightsRecord").val(results);
               $("#TotalCliamerights").val(data.TotalRecordCount);

               var source =
               {
                    localdata: databases,
                    datatype: "array",
               };

               var dataAdapter = new $.jqx.dataAdapter(source);
               $('#Cliamerights').jqxGrid({
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
     $("#Cliamerights").val('');
     $("#CliamerightsID").val('');
     $("#CliamerightsRemark").val('');
     $("#HosID").val('');
     $('#Cliamerights').jqxGrid('clearselection');
     getCliamerights();
}

module.exports = {
	Start_Cliamerights
}