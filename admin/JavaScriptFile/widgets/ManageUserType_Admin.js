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

function Start_UserTypes() {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     ///////////////// Tooltips Header Column /////////////////////////////
     var tooltiprenderer = function (element) {
          $(element).parent().jqxTooltip({ position: 'top', content: "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง" });
     };

     $('#UserTypes').jqxGrid({
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
               { text: 'id', datafield: 'id', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '10%' },
               { text: 'UserTypeName', datafield: 'UserType_Name', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '30%' },
               { text: 'Description', datafield: 'UserType_DESC', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '50%' },
               {
                    text: 'Edit', datafield: 'Edit', align: 'center', columntype: 'button', cellsalign: 'center', width: '10%',
                    cellsrenderer: function (row) { return "แก้ไข"; },
                    buttonclick: function (row) {
                         Editrow = row;
                         var offset = $("#UserTypes").offset();
                         var dataRecord = $("#UserTypes").jqxGrid('getrowdata', Editrow);

                         var Id = dataRecord.id;
                         var UserType_Name = dataRecord.UserType_Name;
                         var UserType_DESC = dataRecord.UserType_DESC;
                         var hospitalId = dataRecord.hospitalId;

                         // <input type="hidden" id="UserType">
                         // <input type="hidden" id="UserTypeID">
                         // <input type="hidden" id="UserTypeDescription"></input>

                         $("#Name").val(UserType_Name);
                         $("#Description").val(UserType_DESC);

                         $("#UserType").val(UserType_Name);
                         $("#UserTypeID").val(Id);
                         $("#UserTypeDescription").val(UserType_DESC);
                         $("#HosID").val(hospitalId);

                         $("#AddUserTypes").hide();
                         $("#EditUserTypes").show();
                         $("#UserTypesList").hide();
                         $("#UserTypesForm").show();
                         $("#HeaderUserTypesForm").text('แก้ไข UserTypes: ' + UserType_Name);
                         
                    }
               },
               {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: '10%',
                    cellsrenderer: function (row) { return "Delete"; },
                    buttonclick: function (row) {
                         Editrow = row;
                         var offset = $("#UserTypes").offset();
                         var dataRecord = $("#UserTypes").jqxGrid('getrowdata', Editrow);

                         var Id = dataRecord.id;
                         var UserType_Name = dataRecord.UserType_Name;
                         var UserType_DESC = dataRecord.UserType_DESC;
                         var hospitalId = dataRecord.hospitalId;
                         const url = "/api/usertypes/delete";
                         const params = { id: Id, UserType_Name: UserType_Name, UserType_DESC: UserType_DESC, hospitalId: hospitalId };
                         // {id : Id, UserType_Name: UserType_Name, UserType_DESC : UserType_DESC, hospitalId: hospitalId};
                         // var hospitalId = dataRecord.hospitalId;

                         if (confirm("Do you want to Delete UserTypes Name " + UserType_Name + " ?")) {
                              const promises = doPostApi(url, params);
                              promises.then((data) => {
                                   console.log(`url : ${url} => data: ${data}`);
                                   if (data.Result == "OK") {
                                        ShowNoti('ลบ UserTypes สำเร็จ', "success");
                                   } else {
                                        ShowNoti('ลบ UserTypes ไม่สำเร็จ', "warning");
                                   }
                                   clearselection();
                              }).catch((error) => {
                                   console.log(`url : ${url} => error: ${error}`);
                                   ShowNoti('ลบ UserTypes ไม่สำเร็จ', "warning");
                              });
                         }
                    }
               }
          ]
     });
     // Sort

     // $("#UserTypes").jqGrid('sortGrid','id', false, 'asc');

     $("#UserTypes").on('rowdoubleclick', function (event) {
          Editrow = event.args.rowindex;
          var offset = $("#UserTypes").offset();
          var dataRecord = $("#UserTypes").jqxGrid('getrowdata', Editrow);
          // var dataRecord = JSON.parse(dataRecords);

          var Id = dataRecord.id;
          var UserType_Name = dataRecord.UserType_Name;
          var UserType_DESC = dataRecord.UserType_DESC;
          var hospitalId = dataRecord.hospitalId;

          // <input type="hidden" id="UserType">
          // <input type="hidden" id="UserTypeID">
          // <input type="hidden" id="UserTypeDescription"></input>

          $("#Name").val(UserType_Name);
          $("#Description").val(UserType_DESC);

          $("#UserType").val(UserType_Name);
          $("#UserTypeID").val(Id);
          $("#UserTypeDescription").val(UserType_DESC);
          $("#HosID").val(hospitalId);

          //Keep Patient Data

     });

     $("#EditUserTypes").click(() => {
          var Id = $("#UserTypeID").val();
          var UserType_Name = $("#Name").val();
          var UserType_DESC = $("#Description").val();
          var hospitalId = $("#HosID").val();
          const url = "/api/usertypes/update";
          const params = { id: Id, UserType_Name: UserType_Name, UserType_DESC: UserType_DESC, hospitalId: hospitalId };
          const promises = doPostApi(url, params);

          promises.then((data) => {
               console.log(`url : ${url} => data: ` + JSON.stringify(data));
               if (data.Result == "OK") {
                    ShowNoti('แก้ไข UserTypes สำเร็จ', "success");
                    ReloadUserTypesGrid();
               } else {
                    ShowNoti('แก้ไข UserTypes ไม่สำเร็จ', "warning");
               }
               clearselection();
          }).catch((error) => {
               console.log(`url : ${url} => error: ${error}`);
               ShowNoti('แก้ไข UserTypes ไม่สำเร็จ', "warning");
          });
     });

     $("#AddUserTypes").click(() => {
          var Id = Number($("#TotalUser").val()) + 1;
          var UserType_Name = $("#Name").val();
          var UserType_DESC = $("#Description").val();
          var hospitalId = $("#HosID").val();

          const url = "/api/usertypes/add";
          const params = { id: Id, UserType_Name: UserType_Name, UserType_DESC: UserType_DESC, hospitalId: hospitalId };
          const promises = doPostApi(url, params);
          promises.then((data) => {
               console.log(`url : ${url} => data: ` + JSON.stringify(data));
               if (data.Result == "OK") {
                    ShowNoti('เพิ่ม UserTypes สำเร็จ', "success");
                    ReloadUserTypesGrid();
               } else {
                    ShowNoti('เพิ่ม UserTypes ไม่สำเร็จ', "warning");
               }
               clearselection();
          }).catch((error) => {
               console.log(`url : ${url} => error: ${error}`);
               ShowNoti('เพิ่ม UserTypes ไม่สำเร็จ', "warning");
          });
     });

     $("#ButtonAdd").click(function () {
          $("#AddUserTypes").show();
          $("#EditUserTypes").hide();
          $("#UserTypesList").hide();
          $("#UserTypesForm").show();
          $("#HeaderUserTypesForm").text('สร้าง UserTypes');
     });

     $("#BackUserTypesForm").click(function () {
          $("#AddUserTypes").show();
          $("#EditUserTypes").hide();
          $("#UserTypesList").show();
          $("#UserTypesForm").hide();
     });

     getUserTypes();
     $("#UserTypesForm").hide();
}

function ReloadUserTypesGrid(){
     $("#UserTypes").jqxGrid("clear");
     getUserTypes();
     $("#BackUserTypesForm").click();
}

function getUserTypes() {
     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
     var function_name = "getUserTypes";
     var params = {};
     return new Promise(function (resolve, reject) {
          // console.log("function_name : " + function_name + " => start");
          var url = "/api/usertypes/list" ;
          $.post(url, params, function (data) {
               console.log("data in " + function_name + " : " + JSON.stringify(data));
               if (data.Result == 'OK') {
                    var databases = new Array();
                    for (i = 0; i < data.Records.length; i++) {
                         var row = {};
                         row.id = data.Records[i].id;
                         row.UserType_Name = data.Records[i].UserType_Name;
                         row.UserType_DESC = data.Records[i].UserType_DESC;
                         row.hospitalId = User_HosID;                         
                         databases[i] = row;
                    }

                    var results = JSON.stringify(databases);
                    $("#UserTypeRecord").val(results);
                    $("#TotalUser").val(data.TotalRecordCount);

                    var source =
                    {
                         localdata: databases,
                         datatype: "array",
                    };

                    var dataAdapter = new $.jqx.dataAdapter(source);
                    $('#UserTypes').jqxGrid({
                         source: dataAdapter
                    });
                    resolve(results);
                    // console.log("Success in " + function_name);
               } else {
                    // console.log("Error in Get Data " + function_name);
               }
          });
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
     $("#Description").val('');
     $("#UserType").val('');
     $("#UserTypeID").val('');
     $("#UserTypeDescription").val('');
     $("#HosID").val('');
     $('#UserTypes').jqxGrid('clearselection');
     getUserTypes();
}

module.exports = {
	Start_UserTypes,
}