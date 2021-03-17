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

function Start_UserStatus() {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     ///////////////// Tooltips Header Column /////////////////////////////
     var tooltiprenderer = function (element) {
          $(element).parent().jqxTooltip({ position: 'top', content: "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง" });
     };


     $('#UserStatus').jqxGrid({
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
               // row.UserStatus_Name = data.Records[i].UserStatus_Name;
               // row.UserStatus_DESC = data.Records[i].UserStatus_DESC;    
               { text: 'id', datafield: 'id', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '10%' },
               { text: 'Name', datafield: 'UserStatus_Name', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '30%' },
               // { text: 'UGType_ColorCode', datafield: 'UGType_ColorCode', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '25%' },
               { text: 'Remark', datafield: 'UserStatus_DESC', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '50%' },
               {
                    text: 'Edit', datafield: 'Edit', align: 'center', columntype: 'button', cellsalign: 'center', width: '10%',
                    cellsrenderer: function (row) { return "แก้ไข"; },
                    buttonclick: function (row) {
                         Editrow = row;
                         var offset = $("#UserStatus").offset();
                         var dataRecord = $("#UserStatus").jqxGrid('getrowdata', Editrow);
                         // var dataRecord = JSON.parse(dataRecords);

                         var Id = dataRecord.id;
                         var UserStatus_Name = dataRecord.UserStatus_Name;
                         var UserStatus_DESC = dataRecord.UserStatus_DESC;
                         var hospitalId = dataRecord.hospitalId;

                         // <input type="hidden" id="UserStatus">
                         // <input type="hidden" id="UserStatusID">
                         // <input type="hidden" id="UserStatusRemark"></input>

                         $("#Name").val(UserStatus_Name);
                         $("#Remark").val(UserStatus_DESC);

                         $("#UserStatus").val(UserStatus_Name);
                         $("#UserStatusID").val(Id);
                         $("#UserStatusRemark").val(UserStatus_DESC);
                         $("#HosID").val(hospitalId);

                         $("#AddUserStatus").hide();
                         $("#EditUserStatus").show();
                         $("#UserStatusList").hide();
                         $("#UserStatusForm").show();
                         $("#HeaderUserStatusForm").text('แก้ไข UserStatus: ' + UserStatus_Name);
                    }
               },
               {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: '10%',
                    cellsrenderer: function (row) { return "Delete"; },
                    buttonclick: function (row) {
                         Editrow = row;
                         var offset = $("#UserStatus").offset();
                         var dataRecord = $("#UserStatus").jqxGrid('getrowdata', Editrow);

                         var Id = dataRecord.id;
                         var UserStatus_Name = dataRecord.UserStatus_Name;
                         var UserStatus_DESC = dataRecord.UserStatus_DESC;
                         var hospitalId = dataRecord.hospitalId;
                         const url = "/api/userstatuses/delete";
                         const params = {id : Id, UserStatus_Name: UserStatus_Name, UserStatus_DESC : UserStatus_DESC, hospitalId: hospitalId};
                         // {id : Id, UserStatus_Name: UserStatus_Name, UserStatus_DESC : UserStatus_DESC, hospitalId: hospitalId};
                         // var hospitalId = dataRecord.hospitalId;

                         if (confirm("Do you want to Delete UserStatus Name " + UserStatus_Name + " ?")) {
                              const promises = doPostApi(url, params);
                              promises.then( (data) => {
                                   console.log(`url : ${url} => data: ${data}`);
                                   if(data.Result == "OK"){
                                        ShowNoti('ลบ UserStatus สำเร็จ', "success");
                                   }else{
                                        ShowNoti('ลบ UserStatus ไม่สำเร็จ', "warning");
                                   }
                                   clearselection();
                              }).catch( (error) => {
                                   console.log(`url : ${url} => error: ${error}`);
                                   ShowNoti('ลบ UserStatus ไม่สำเร็จ', "warning");
                              });
                         }
                    }
               }
          ]
     });
     // Sort

     // $("#UserStatus").jqGrid('sortGrid','id', false, 'asc');

     $("#EditUserStatus").click( () =>{
          var Id = $("#UserStatusID").val();
          var UserStatus_Name = $("#Name").val();
          var UserStatus_DESC = $("#Remark").val();
          var hospitalId = $("#HosID").val();
          const url = "/api/userstatuses/update";
          const params = {id : Id, UserStatus_Name: UserStatus_Name, UserStatus_DESC : UserStatus_DESC, hospitalId: hospitalId};
          const promises = doPostApi(url, params);

          promises.then( (data) => {
               console.log(`url : ${url} => data: ` + JSON.stringify(data) );
               if(data.Result == "OK"){
                    ShowNoti('แก้ไข UserStatus สำเร็จ', "success");
                    ReloadUserStatusGrid();
               }else{
                    ShowNoti('แก้ไข UserStatus ไม่สำเร็จ', "warning");
               }
               clearselection();
          }).catch( (error) => {
               console.log(`url : ${url} => error: ${error}`);
               ShowNoti('แก้ไข UserStatus ไม่สำเร็จ', "warning");
          });
     });

     $("#AddUserStatus").click( () =>{
          var Id =  Number($("#TotalStatus").val()) + 1;
          var UserStatus_Name = $("#Name").val();
          var UserStatus_DESC = $("#Remark").val();
          var hospitalId = $("#HosID").val();

          const url = "/api/userstatuses/add";
          const params = {id : Id, UserStatus_Name: UserStatus_Name, UserStatus_DESC : UserStatus_DESC, hospitalId: hospitalId};
          const promises = doPostApi(url, params);
          promises.then( (data) => {
               console.log(`url : ${url} => data: ` + JSON.stringify(data) );
               if(data.Result == "OK"){
                    ShowNoti('เพิ่ม UserStatus สำเร็จ', "success");
                    ReloadUserStatusGrid();
               }else{
                    ShowNoti('เพิ่ม UserStatus ไม่สำเร็จ', "warning");
               }
               clearselection();
          }).catch( (error) => {
               console.log(`url : ${url} => error: ${error}`);
               ShowNoti('เพิ่ม UserStatus ไม่สำเร็จ', "warning");
          });
     });

     $("#ButtonAdd").click(function () {
          $("#AddUserStatus").show();
          $("#EditUserStatus").hide();
          $("#UserStatusList").hide();
          $("#UserStatusForm").show();
          $("#HeaderUserStatusForm").text('สร้าง UserStatus');
     });

     $("#BackUserStatusForm").click(function () {
          $("#AddUserStatus").show();
          $("#EditUserStatus").hide();
          $("#UserStatusList").show();
          $("#UserStatusForm").hide();
     });

     getUserStatus();
     $("#UserStatusForm").hide();

}


function ReloadUserStatusGrid(){
     $("#UserStatus").jqxGrid("clear");
     getUserStatus();
     $("#BackUserStatusForm").click();
}

function getUserStatus() {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     var function_name = "getUserStatus";
     var params = {};
     var url = "/api/userstatuses/list" ;
     const promises = doPostApi(url, params);
     promises.then( (data) =>{
          console.log("data in " + function_name + " : " + JSON.stringify(data));
          if (data.Result == 'OK') {
               var databases = new Array();
               for (i = 0; i < data.Records.length; i++) {
                    var row = {};
                    row.id = data.Records[i].id;
                    row.UserStatus_Name = data.Records[i].UserStatus_Name;
                    row.UserStatus_DESC = data.Records[i].UserStatus_DESC;
                    row.hospitalId = User_HosID;                         
                    databases[i] = row;
               }

               var results = JSON.stringify(databases);
               $("#UserStatusRecord").val(results);
               $("#TotalStatus").val(data.TotalRecordCount);

               var source =
               {
                    localdata: databases,
                    datatype: "array",
               };

               var dataAdapter = new $.jqx.dataAdapter(source);
               $('#UserStatus').jqxGrid({
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
     $("#UserStatus").val('');
     $("#UserStatusID").val('');
     $("#UserStatusRemark").val('');
     $("#HosID").val('');
     $('#UserStatus').jqxGrid('clearselection');
     getUserStatus();
}

module.exports = {
	Start_UserStatus
}