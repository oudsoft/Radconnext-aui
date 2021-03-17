const utilityExport = require('../Utility.js');
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

const doPutApi = function (apiurl, params) {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: apiurl,
            type: 'PUT',
            success: function(data) {
                resolve(data);
            },
            fail : function (error) {
                reject(error);
            },
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
    
    var theme = 'energyblue';
     
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
});

function startPage_ManageUser_Admin(hospitalID){

    getUserStatus();
    $("#gridUser").jqxGrid(
        {
            width: '100%',
            autoheight: true,
            pageable: true,
            pagerButtonsCount: 20,
            columnsResize: true,
            filterable: true,
            showfilterrow: true,
            pagesizeoptions: ['10', '20', '30', '50', '100'],
            //showstatusbar: true,
            theme: theme,
            columns: [
                { text: 'User Name', datafield: 'User_UserName', align: 'center', width: '10%' },
                { text: 'FirstName', datafield: 'User_Name_EN', align: 'center', width: '10%' },
                { text: 'LastName', datafield: 'User_LastName_EN', align: 'center', width: '10%' },
                { text: 'ชื่อ', datafield: 'User_Name_TH', align: 'center', width: '10%' },
                { text: 'นามสกุล', datafield: 'User_LastName_TH', align: 'center', width: '10%' },
                { text: 'Phone', datafield: 'User_Phone', align: 'center', cellsalign: 'center', width: '10%' },
                { text: 'Line ID', datafield: 'User_LineID', align: 'center', cellsalign: 'center', width: '10%' },
                { text: 'Type', datafield: 'UserType_Name', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', width: '10%' },
                { text: 'Status', datafield: 'UserStatus_Name', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', width: '10%' },
                {
                    text: 'Edit', datafield: 'Edit', align: 'center', columntype: 'button', cellsalign: 'center', width: '10%',
                    cellsrenderer: function (row) { return "แก้ไขผู้ใช้งาน"; }, buttonclick: function (row) {
                        Editrow = row;
                        var offset = $("#gridUser").offset();
                        var dataRecord = $("#gridUser").jqxGrid('getrowdata', Editrow);
                        var User_ID = dataRecord.User_ID;
                        var User_UserName = dataRecord.User_UserName;

                        // row['User_UserName'] = data.Records[i].username;
                        // row['User_Name_EN'] = data.Records[i].NameEN;
                        // row['User_LastName_EN'] = data.Records[i].LastNameEN;
                        // row['User_Name_TH'] = data.Records[i].NameTH;
                        // row['User_LastName_TH'] = data.Records[i].LastNameTH;
                        // row['User_Phone'] = data.Records[i].Phone;
                        // row['User_Email'] = data.Records[i].Email;
                        // row['User_LineID'] = data.Records[i].LineID;
                        // row['UserType_Name'] = utilityExport.ReturnUserType(data.Records[i].typeId);
                        // row['UserType_ID'] = data.Records[i].typeId;
                        // row['UserStatus_Name'] = utilityExport.ReturnUserStatus(data.Records[i].typeId);
                        // row['User_PathRadiant'] = data.Records[i].userinfo.User_PathRadiant;
                        // row.hospitalId = data.Records[i].hospitalId;
                        // row.StatusId = data.Records[i].StatusId;
                        // row.infoId = data.Records[i].infoId;
                        // row.Hospitals = data.Records[i].Hospitals;

                        $("#User_ID").val(dataRecord.User_ID);
                        $("#User_FirstName").val(dataRecord.User_UserName);
                        // $("#Password").val(User_Password);
                        $("#FirstNameEng").val(dataRecord.User_Name_EN);
                        $("#LastNameEng").val(dataRecord.User_LastName_EN);
                        $("#FirstNameThai").val(dataRecord.User_Name_TH);
                        $("#LastNameThai").val(dataRecord.User_LastName_TH);
                        $("#Email").val(dataRecord.User_Email);
                        $("#Phone").val(dataRecord.User_Phone);
                        $("#LineID").val(dataRecord.User_LineID);
                        // $("#LineCode").val(User_LineID_Code);
                        // $("#Active").val(User_Active);
                        // $("#PathRadiant").val(dataRecord.User_UserName);
                        $("#UserInfoID").val(dataRecord.infoId);
                        $("#UserTypeID").val(dataRecord.UserType_ID);
                        $("#UserStatus").val(dataRecord.StatusId);
                        $("#UserForm").show();
                        $("#UserList").hide();
                        $("#SaveUser").hide();
                        $("#EditUser").show();
                        $("#DivPassword").hide();
                        $("#DivReTryPassword").hide();
                        
                        setTimeout(function () {
                            $("#Type").val(dataRecord.UserType_ID);
                            $("#HospitalType").val(dataRecord.hospitalId)
                        },1000);
                        
                        $("#HeaderUserForm").text('แก้ไขผู้ใช้งาน username: ' + dataRecord.User_UserName);
                    }
                },
                {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: '10%',
                    cellsrenderer: function (row) { return "ลบผู้ใช้งาน"; }, buttonclick: function (row) {
                        Editrow = row;
                        var offset = $("#gridUser").offset();

                        var dataRecord = $("#gridUser").jqxGrid('getrowdata', Editrow);
                        var User_ID = dataRecord.User_ID;
                        var User_infoId = dataRecord.infoId;
                        var User_UserName = dataRecord.User_UserName;

                        if (confirm("Do you want to delete user " + User_UserName + "?")) {
                            const url = "/api/user/delete";
                            const params = { userId: User_ID, infoId: User_infoId }
                            const promises = doPostApi(url, params);
                            promises.then((data) => {
                                if (data.Result == "OK") {
                                    ShowNoti('ลบ User สำเร็จ', "success");
                                } else {
                                    ShowNoti('ลบ User ไม่สำเร็จ', "warning");
                                }
                            }).catch((error) => {
                                console.log(`url ${url} error: ${error}`);
                                ShowNoti('ลบ User ไม่สำเร็จ', "warning");
                            });

                            UserListAPI(hospitalID);
                        }
                    }
                }
            ]
        });
    // gridUser();

    UserListAPI(hospitalID);


    // $("#gridUser").on('rowdoubleclick', function (event) {

        // row['User_UserName'] = data.Records[i].username;
        // row['User_Name_EN'] = data.Records[i].NameEN;
        // row['User_LastName_EN'] = data.Records[i].LastNameEN;
        // row['User_Name_TH'] = data.Records[i].NameTH;
        // row['User_LastName_TH'] = data.Records[i].LastNameTH;
        // row['User_Phone'] = data.Records[i].Phone;
        // row['User_Email'] = data.Records[i].Email;
        // row['User_LineID'] = data.Records[i].LineID;
        // row['UserType_Name'] = utilityExport.ReturnUserType(data.Records[i].typeId);
        // row['UserType_ID'] = data.Records[i].typeId;
        // row['UserStatus_Name'] = utilityExport.ReturnUserStatus(data.Records[i].typeId);
        // row['User_PathRadiant'] = data.Records[i].userinfo.User_PathRadiant;
        // row.hospitalId = data.Records[i].hospitalId;
        // row.StatusId = data.Records[i].StatusId;
        // row.infoId = data.Records[i].infoId;
        // row.Hospitals = data.Records[i].Hospitals;

        // var row = event.args.row;
        // let User_ID = row.User_ID;
        // let User_UserName = row.User_UserName;
        // let User_Name_EN = row.User_Name_EN;
        // let User_LastName_EN = row.User_LastName_EN;
        // let User_Name_TH = row.User_Name_TH;
        // let User_LastName_TH = row.User_LastName_TH;
        // let User_Email = row.User_Email;
        // let User_Phone = row.User_Phone;
        // let User_LineID = row.User_LineID;
        // let UserType_Name = row.UserType_Name;
        // let UserStatus_Name = row.UserStatus_Name;
        // let User_PathRadiant = row.User_PathRadiant;
        // let UserInfoID = row.infoId;
        // let UserType_ID = row.UserType_ID;

        // $("#User_ID").val(User_ID);
        // $("#User_FirstName").val(User_UserName);
        // $("#Password").val(User_Password);
        // $("#FirstNameEng").val(User_Name_EN);
        // $("#LastNameEng").val(User_LastName_EN);
        // $("#FirstNameThai").val(User_Name_TH);
        // $("#LastNameThai").val(User_LastName_TH);
        // $("#Email").val(User_Email);
        // $("#Phone").val(User_Phone);
        // $("#LineID").val(User_LineID);
        // $("#LineCode").val(User_LineID_Code);
        // $("#Type").val(UserType_ID);
        // $("#Active").val(User_Active);
        // $("#PathRadiant").val(User_PathRadiant);
        // $("#UserInfoID").val(UserInfoID);
        // $("#UserTypeID").val(UserType_ID);

    //     console.log('doubleclick success!');
    // });

    $("#SaveUser").click(function functionName() {
        RadRegister(hospitalID);
    });

    $("#EditUser").click(function functionName() {
        RadEdit(hospitalID);
        $("#BackUserForm").click();
    });

    $("#AddUser").click(function (){
        $("#HeaderUserForm").text('เพิ่มผู้ใช้งาน');
        $("#UserList").hide();
        $("#UserForm").show();
        $("#SaveUser").show();
        $("#EditUser").hide();
        $("#DivPassword").show();
        $("#DivReTryPassword").show();
    });

    $("#BackUserForm").click(function functionName() {
        $("#UserList").show();
        $("#UserForm").hide();
        $("#SaveUser").hide();
        $("#EditUser").hide();
        ClearText();
        ReloadUserGrid(hospitalID);
    });

    setTimeout(function () {
        UserTypeAPI();
        // gridHospital();
        ListHospital();
    }, 2000);

    $("#UserForm").hide();
}

function ReloadUserGrid(hospitalID){
    $("#gridUser").jqxGrid("clear");
    UserListAPI(hospitalID);
}

function UserListAPI(hospitalId) {
    let function_name = 'UserListAPI';
    let usertypeId = 0;
    let url = "/api/user/list/?hospitalId=" + hospitalId + "&usertypeId=" + usertypeId ;
    let params = [];
    const promises = doPostApi(url, params);
    console.log("function_name : " + function_name + " => start");
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    promises.then( (data) => {
        var databases = new Array();
        console.log("data = " + JSON.stringify(data) );
        length = data.Records.length;
        if(data.Result == 'OK' && data.Records.length > 0){
            for (var i = 0; i < length; i++) {
                var row = {};
                row['User_ID'] = data.Records[i].userId;
                row['User_UserName'] = data.Records[i].username;
                row['User_Name_EN'] = data.Records[i].NameEN;
                row['User_LastName_EN'] = data.Records[i].LastNameEN;
                row['User_Name_TH'] = data.Records[i].NameTH;
                row['User_LastName_TH'] = data.Records[i].LastNameTH;
                row['User_Phone'] = data.Records[i].Phone;
                row['User_Email'] = data.Records[i].Email;
                row['User_LineID'] = data.Records[i].LineID;
                row['UserType_Name'] = utilityExport.ReturnUserType(data.Records[i].typeId);
                row['UserType_ID'] = data.Records[i].typeId;
                row['UserStatus_Name'] = utilityExport.ReturnUserStatus(data.Records[i].StatusId);
                // row['User_PathRadiant'] = data.Records[i].userinfo.User_PathRadiant;
                row.hospitalId = data.Records[i].hospitalId;
                row.StatusId = data.Records[i].StatusId;
                row.infoId = data.Records[i].infoId;
                row.Hospitals = data.Records[i].Hospitals;
                databases[i] = row;
            }
            var source =
            {
                localdata: databases,
                datatype: "array"
            };

            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#gridUser").jqxGrid({ source: dataAdapter });

        }else{
            ShowNoti("ไม่มีข้อมูลผู้ใช้งาน", "warning");
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
    });
}

function RadRegister(hosId) {
    let function_name = 'RadRegister';
    let API = "/api/users";
    console.log("function_name : " + function_name + " => start");
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var url = API;
    var CountError = 0;
    let input_username = $("#User_FirstName").val();
    let input_password = $("#Password").val();
    let retrypassword = $("#ReTryPassword").val();
    let vUserType = $("#Type").val();
    let vUser_NameEN = $("#FirstNameEng").val();
    let vUser_LastNameEN = $("#LastNameEng").val();
    let vUser_NameTH = $("#FirstNameThai").val();
    let vUser_LastNameTH = $("#LastNameThai").val();
    let vUser_Email = $("#Email").val();
    let vUser_Phone = $("#Phone").val();
    let vUser_LineID = $("#LineID").val();
    let vUser_PathRadiant = $("#PathRadiant").val();
    let vHospitalID = $("#HospitalType").val();

    if (input_username == "") {
        CountError += 1;
        $("#User_FirstName").css("border", "1px solid red");
        $("#Validation_UserName").text("กรุณาใส่ UserName.");
    } else {

    }
    if (input_password == "") {
        CountError += 1;
        $("#Password").css("border", "1px solid red");
        $("#Validation_Password").text("กรุณาใส่ Password.");
    } else {

    }
    if (input_password != retrypassword) {
        CountError += 1;
        $("#Password").css("border", "1px solid red");
        $("#ReTryPassword").css("border", "1px solid red");
        $("#Validation_Password").text("Password และ ReTryPassword ไม่ตรงกัน.");
        $("#Validation_ReTryPassword").text("Password และ ReTryPassword ไม่ตรงกัน.");
    } else {

    }
    if (vUser_NameEN == "") {
        CountError += 1;
        $("#FirstNameEng").css("border", "1px solid red");
        $("#Validation_FirstNameEng").text("กรุณาใส่ ชื่อ(ภาษาอังกฤษ).");
    } else {

    }
    if (vUser_LastNameEN == "") {
        CountError += 1;
        $("#LastNameEng").css("border", "1px solid red");
        $("#Validation_LastNameEng").text("กรุณาใส่ นามสกุล(ภาษาอังกฤษ).");
    } else {

    }
    if (vUser_NameTH == "" ) {vUser_NameTH = vUser_NameEN;}
    if (vUser_LastNameTH == "" ) {vUser_LastNameTH = vUser_LastNameEN;}

    if (vUser_Email == "") {
        CountError += 1;
        $("#Email").css("border", "1px solid red");
        $("#Validation_Email").text("กรุณาใส่ Email.");
    } else {

    }
    if (vUser_Phone == "") {
        CountError += 1;
        $("#Phone").css("border", "1px solid red");
        $("#Validation_Phone").text("กรุณาใส่ เบอร์โทรศัพท์.");
    } else {

    }
    if (vUser_Phone.length != 10) {
        CountError += 1;
        $("#User_FirstName").css("border", "1px solid red");
        $("#Validation_Phone").text("กรุณาใส่ เบอร์โทรศัพท์ ให้ครบ 10 ตัว.");
    } else {

    }
    console.log("username : " + input_username);
    console.log("password : " + input_password);
    console.log("retrypassword : " + retrypassword);
    console.log("usertypeId : " + vUserType);
    console.log("User_NameEN : " + vUser_NameEN);
    console.log("User_LastNameEN : " + vUser_LastNameEN);
    console.log("User_NameTH : " + vUser_NameTH);
    console.log("User_LastNameTH : " + vUser_LastNameTH);
    console.log("useUser_Emailrname : " + vUser_Email);
    console.log("User_Phone : " + vUser_Phone);
    console.log("User_LineID : " + vUser_LineID);
    console.log("User_PathRadiant : " + vUser_PathRadiant);
    console.log("hospitalId = " + vHospitalID);

    var params = {
        User_NameEN: vUser_NameEN, 
        User_LastNameEN: vUser_LastNameEN, 
        User_NameTH: vUser_NameTH, 
        User_LastNameTH: vUser_LastNameTH, 
        User_Email: vUser_Email, 
        User_Phone: vUser_Phone, 
        User_LineID: vUser_LineID, 
        User_PathRadiant: vUser_PathRadiant, 
        usertypeId: vUserType,
        hospitalId: vHospitalID, 
        username: input_username, 
        password: input_password,
    };

    console.log("params = "+ JSON.stringify(params) );

    if (CountError === 0) {
        console.log('CountError: ' + CountError );
        const promises = doPostApi(url, params);
        promises.then( (data) =>{
            console.log("Successful Conntection");
            console.log("data = ", data);
            if (data.error) {
                $("#User_FirstName").css("border", "1px solid red");
                $("#Validation_UserName").text(data.error.why);
                ShowNoti('สมัครสมาชิกไม่สำเร็จ เนื่องจาก ' + data.error.why, "warning");
            } else {
                //$('#RegisterPage').click();
                $("#RegisterNotification").text('การสมัครสมาชิกสำเร็จ');
                ShowNoti('สมัครสมาชิกสำเร็จ', "success");
                ReloadUserGrid(hosId);
                ClearText();
            }
        }).catch(function (error) {
            console.log('error : ' +  JSON.stringify(error));
            ShowNoti('สมัครสมาชิกไม่สำเร็จ เนื่องจาก: ' + JSON.stringify(error), "warning");
        });
    } else {
        console.log("Error => CountError = " + CountError);
    }
    console.log("function_name : " + function_name + " => end");
}

function RadEdit(hosId) {
    let function_name = 'RadEdit';
    let API = "/api/user/update";
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
        var url = API;
        var CountError = 0;

        let vUser_ID = $("#User_ID").val();
        let input_username = $("#User_FirstName").val();
        let vUser_NameEN = $("#FirstNameEng").val();
        let vUser_LastNameEN = $("#LastNameEng").val();
        let vUser_NameTH = $("#FirstNameThai").val();
        let vUser_LastNameTH = $("#LastNameThai").val();
        let vUser_Email = $("#Email").val();
        let vUser_Phone = $("#Phone").val();
        let vUser_LineID = $("#LineID").val();
        let vUser_PathRadiant = $("#PathRadiant").val();
        let vHospitalID = $("#HospitalType").val();
        let vUser_InfoID = $("#UserInfoID").val()
        let vUserType_ID = $("#Type").val();
        let vUser_StatusID = $("#UserStatus").val();

        if (input_username == "") {
            CountError += 1;
            $("#User_FirstName").css("border", "1px solid red");
            $("#Validation_UserName").text("กรุณาใส่ UserName.");
        } else {

        }
        if (vUser_NameEN == "") {
            CountError += 1;
            $("#FirstNameEng").css("border", "1px solid red");
            $("#Validation_FirstNameEng").text("กรุณาใส่ ชื่อ(ภาษาอังกฤษ).");
        } else {

        }
        if (vUser_LastNameEN == "") {
            CountError += 1;
            $("#LastNameEng").css("border", "1px solid red");
            $("#Validation_LastNameEng").text("กรุณาใส่ นามสกุล(ภาษาอังกฤษ).");
        } else {

        }
        if (vUser_NameTH == "" ) {vUser_NameTH = vUser_NameEN;}
        if (vUser_LastNameTH == "" ) {vUser_LastNameTH = vUser_LastNameEN;}

        if (vUser_Email == "") {
            CountError += 1;
            $("#Email").css("border", "1px solid red");
            $("#Validation_Email").text("กรุณาใส่ Email.");
        } else {

        }
        if (vUser_Phone == "") {
            CountError += 1;
            $("#Phone").css("border", "1px solid red");
            $("#Validation_Phone").text("กรุณาใส่ เบอร์โทรศัพท์.");
        } else {

        }
        if (vUser_Phone.length != 10) {
            CountError += 1;
            $("#User_FirstName").css("border", "1px solid red");
            $("#Validation_Phone").text("กรุณาใส่ เบอร์โทรศัพท์ ให้ครบ 10 ตัว.");
        } else {

        }

        var params = {
            infoId: vUser_InfoID,
            userId: vUser_ID,
            User_NameEN: vUser_NameEN,
            User_LastNameEN: vUser_LastNameEN,
            User_NameTH: vUser_NameTH,
            User_LastNameTH: vUser_LastNameTH,
            User_Email: vUser_Email,
            User_Phone: vUser_Phone,
            User_LineID: vUser_LineID,
            User_PathRadiant: vUser_PathRadiant,
            usertypeId: vUserType_ID,
            hospitalId: vHospitalID,
            StatusId : vUser_StatusID,
            username: input_username,
            //password: vUser_Password,
        };

        console.log("params = "+ JSON.stringify(params) );

        if (CountError === 0) {
            const promises = doPostApi(url, params);
            promises.then( (data) =>{
                console.log("Successful Conntection");
                console.log("data = ", data);
                if (data.error) {
                    $("#User_FirstName").css("border", "1px solid red");
                    $("#Validation_UserName").text(data.error.why);
                    ShowNoti('แก้ไขสมาชิกไม่สำเร็จ เนื่องจาก ' + data.error.why, "warning");
                } else {
                    //$('#RegisterPage').click();
                    $("#RegisterNotification").text('การสมัครสมาชิกสำเร็จ');
                    ShowNoti('แก้ไขสมาชิกสำเร็จ', "success");
                    const url2 = `/api/users/setstatus/${vUser_ID}/${vUser_StatusID}`; 
                    const params2 = {userId : vUser_ID, statusId: vUser_StatusID};
                    const promises2 = doPutApi(url2, params2);
                    promises2.then( (data) => {
                        console.log(data);
                        ShowNoti('แก้ไขสถานะสมาชิกสำเร็จ', "success");
                    }).catch( (err) => {
                        ShowNoti('แก้ไขสถานะสมาชิกไม่สำเร็จ: ' + err, "warning");
                    })

                    setTimeout(() => {
                        ReloadUserGrid(hosId);
                        ClearText();
                    }, 500)
                }
            }).catch(function (error) {
                console.log("failed");
                console.log(JSON.stringify(error));
            });
        } else {
            console.log("Error => CountError = " + CountError);
        }
        console.log("function_name : " + function_name + " => end");
    });
}
function getUserStatus() {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "getUserStatus";
    var params = {};
    var url = "/api/userstatuses/list";
    const promises = doPostApi(url, params);
    promises.then((data) => {
        console.log("data in " + function_name + " : " + JSON.stringify(data));
        if (data.Result == 'OK') {
            var databases = new Array();
            for (i = 0; i < data.Records.length; i++) {
                // var row = {};
                var id = data.Records[i].id;
                var UserStatus_Name = data.Records[i].UserStatus_Name;
                $("#UserStatus").append(new Option(UserStatus_Name, id));
            }

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
    $("#Notification").jqxNotification({ template: Type });
    $("#Notification").jqxNotification("open");
}

function ClearText() {
    $("#User_FirstName").val("");
    $("#Password").val("");
    $("#ReTryPassword").val("");
    $("#FirstNameEng").val("");
    $("#LastNameEng").val("");
    $("#FirstNameThai").val("");
    $("#LastNameThai").val("");
    $("#Email").val("");
    $("#Phone").val("");
    $("#LineID").val("");
    $("#LineCode").val("");
    $("#Type").val("1");
    $("#HospitalType").val("1");
    $("#Validation_UserName").text("")

    $("#User_FirstName").css("border","1px solid #d1d3e2")
    $("#Password").css("border","1px solid #d1d3e2")
    $("#ReTryPassword").css("border","1px solid #d1d3e2")
    $("#FirstNameEng").css("border","1px solid #d1d3e2")
    $("#LastNameEng").css("border","1px solid #d1d3e2")
    $("#FirstNameThai").css("border","1px solid #d1d3e2")
    $("#LastNameThai").css("border","1px solid #d1d3e2")
    $("#Email").css("border","1px solid #d1d3e2")
    $("#Phone").css("border","1px solid #d1d3e2")
    $("#LineID").css("border","1px solid #d1d3e2")
    $("#LineCode").css("border","1px solid #d1d3e2")
}

function UserTypeAPI() {
    let function_name = 'UserTypeAPI';
    let getUserTypeAPI = "/api/usertypes/options";
    let output_data = [];
    let params = [];
    console.log("function_name : " + function_name + " => start");
    var url = getUserTypeAPI;
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    const promises = doGetApi(url,params);
    promises.then( (data) => {
        console.log("data : " + JSON.stringify(data) );
        const output = [];
        //const data = JSON.stringify(data.types[0].UserType_Name);
        const len = data.Options.length;
        console.log("length = " + len);

        for (i = 0; i < len; i++) {
            var nametype = data.Options[i].DisplayText
            //output_data.push(JSON.stringify(data.types[i].UserType_Name));
            ///// Add Type in select option
            $("#Type").append(new Option(nametype, data.Options[i].Value));
        }
        console.log("Success in " + function_name);

    }).catch(function (error) {
        console.log(JSON.stringify(error));
        reject(error);
    });
    console.log("function_name : " + function_name + " => end");
}

function ListHospital() {
    let function_name = 'ListHospital';
    let url = "/api/hospital/options";
    let params = [];
    console.log("function_name : " + function_name + " => start");
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    const promises = doGetApi(url, params);
    promises.then( (data) => {
        length = data["Options"].length;
        var databases = new Array();
        console.log("data = " + JSON.stringify(data["Options"][0].DisplayText));
        for (var i = 0; i < length; i++) {
            var hospitalName = data["Options"][i].DisplayText;
            $("#HospitalType").append(new Option(hospitalName, data.Options[i].Value));
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
    });
    console.log("function_name : " + function_name + " => end");
}

function ReturnUserType(typeid){
    if(typeid == 1){
        return "Admin";
    }
    if(typeid == 2){
        return "Technician";
    }
    if(typeid == 3){
        return "Accountant";
    }
    if(typeid == 4){
        return "Radiologist";
    }
    if(typeid == 5){
        return "RefferalDocter";
    }
    if(typeid == 6){
        return "DepartmentPublicComputer";
    }
    if(typeid == 7){
        return "Patient";
    }
    return "";
}

function ReturnUserStatus(statusid) {
    if (statusid == 1) {
        return "Active";
    }
    if (statusid == 2) {
        return "Inactive";
    }
    if (statusid == 3) {
        return "Pending";
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
	startPage_ManageUser_Admin
}