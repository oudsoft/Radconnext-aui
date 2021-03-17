$(document).ready(function () {
    

});

function Start_Profile(){
    var theme = 'energyblue';
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    //getUser(vUserID);
    $("#gridHospital").jqxGrid(
        {
            width: '100%',
            autoheight: true,
            pageable: true,
            pagerButtonsCount: 5,
            columnsResize: true,
            //filterable: true,
            //showstatusbar: true,
            autoShowLoadElement: false,
            theme: theme,
            columns: [
                { text: 'โรงพยาบาล', datafield: 'Hos_Name', align: 'center', minwidth: 100 }
                /*{ text: 'Hospital ID', datafield: 'Hos_OrthancID', align: 'center', width: 200}*/
            ]
        });

    $("#SaveUser").click(function functionName() {
        var UserID = $('#vUser_ID').val();
        UpdateUser(UserID);
    });

    $("#CancelUser").click(function functionName() {
        window.open('index.php', '_self');
    });

    $("#ChangePassword").click(function () {
        ChangePassword();
    });

    $("#TopBarProfile").click(function() {
        getUserInfo(User_ID);
    });


    getUserInfo(User_ID);
    gridHospital(User_ID);
}

function gridHospital() {
    let function_name = 'gridHospital';
    let getUserTypeAPI = "/api/hospital/options";
    let params = [];
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url = getUserTypeAPI;
        $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
        $.get(url, params, function (data) {
            var new_data = JSON.stringify(data);
            length = data["Options"].length;
            var databases = new Array();
            console.log("data = " + JSON.stringify(data["Options"][0].DisplayText));
            for (var i = 0; i < length; i++) {
                var row = {};
                row.Hos_Name = JSON.stringify(data["Options"][i].DisplayText);
                databases[i] = row;
            }
            var source =
            {
                localdata: databases,
                datatype: "array"
            };

            console.log("source = ", JSON.stringify(source) );

            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#gridHospital").jqxGrid({ source: dataAdapter });
        }).fail(function (error) {
            console.log(JSON.stringify(error));
            reject(error);
        });

        console.log("function_name : " + function_name + " => end");

    });
}

function getUserInfo(User_ID){
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    var function_name = "getUserInfo";
    var params = "";
	console.log("function_name : " + function_name + " => start");
	return new Promise(function (resolve, reject) {
		var url =  "/api/users/select/" + User_ID ;
		$.get(url, params, function (data) {
			//resolve(data);
            //console.log("data = ", data);
            console.log("data = ", data.user[0]);
            information = data.user[0];
            $("#vUser_ID").val(information.id);
            $("#vUser_InfoID").val(information.userinfo.id);
            $("#vUserType_ID").val(information.usertypeId);
            $('#vUser_UserName').val(information.username);
            $('#vUser_Password').val(information.userinfo.username);
            $('#vUser_Name_EN').val(information.userinfo.User_NameEN);
            $('#vUser_LastName_EN').val(information.userinfo.User_LastNameEN);
            $('#vUser_Name_TH').val(information.userinfo.User_NameTH);
            $('#vUser_LastName_TH').val(information.userinfo.User_LastNameTH);
            $('#vUser_Email').val(information.userinfo.User_Email);
            $('#vUser_Phone').val(information.userinfo.User_Phone);
            $('#vUser_LineID').val(information.userinfo.User_LineID);
            $('#vUser_HospitalID').val(information.hospitalId);
            //$('#vUser_LineID_Code').val(information.username);
            $('#vUser_PathRadiant').val(information.userinfo.User_PathRadiant);
            //$('#vUser_Auth').val(information.username);
            $('#vUser_Active').val(information.userstatus.UserStatus_Name);
            console.log("function_name : " + function_name + " => Success in get data");
		}).fail(function (error) {
			console.log(JSON.stringify(error));
			reject(error);
		});
		console.log("function_name : " + function_name + " => end");
	});
}

function UpdateUser(UserID) {
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    var function_name = "UpdateUser";
    var params = "";
	console.log("function_name : " + function_name + " => start");
    return new Promise(function (resolve, reject) {
        var url =  "/api/user/update" ;
        var vUser_ID = UserID;
        var vUser_InfoID = $("#vUser_InfoID").val();
        var vUser_UserName = $('#vUser_UserName').val();
        var vUser_Name_EN = $('#vUser_Name_EN').val();
        var vUser_LastName_EN = $('#vUser_LastName_EN').val();
        var vUser_Name_TH = $('#vUser_Name_TH').val();
        var vUser_LastName_TH = $('#vUser_LastName_TH').val();
        var vUser_Email = $('#vUser_Email').val();
        var vUser_Phone = $('#vUser_Phone').val();
        var vUser_LineID = $('#vUser_LineID').val();
        var vUser_LineID_Code = $('#vUser_LineID_Code').val();
        var vUserType_ID = $('#vUserType_ID').val();
        var vUser_Auth = $('#vUser_Auth').val();
        var vUser_PathRadiant = $('#vUser_PathRadiant').val();
        var vUser_Active = $('#vUser_Active').val();
        var vUser_HospitalID = $('#vUser_HospitalID').val();

        console.log("vUser_ID = " + vUser_ID);
        console.log("vUser_InfoID = " + vUser_InfoID);
        console.log("vUser_UserName = " + vUser_UserName);
        console.log("vUser_Name_EN = " + vUser_Name_EN);
        console.log("vUser_LastName_EN = " + vUser_LastName_EN);
        console.log("vUser_Name_TH = " + vUser_Name_TH);
        console.log("vUser_LastName_TH = " + vUser_LastName_TH);
        console.log("vUser_Email = " + vUser_Email);
        console.log("vUser_Phone = " + vUser_Phone);
        console.log("vUser_LineID = " + vUser_LineID);
        console.log("vUserType_ID = " + vUserType_ID);
        console.log("vUser_PathRadiant = " + vUser_PathRadiant);
        console.log("vUser_HospitalID = " + vUser_HospitalID);

        var params = {
            infoId: vUser_InfoID,
            userId: vUser_ID,
            User_NameEN: vUser_Name_EN,
            User_LastNameEN: vUser_LastName_EN,
            User_NameTH: vUser_Name_TH,
            User_LastNameTH: vUser_LastName_TH,
            User_Email: vUser_Email,
            User_Phone: vUser_Phone,
            User_LineID: vUser_LineID,
            User_PathRadiant: vUser_PathRadiant,
            usertypeId: vUserType_ID,
            hospitalId: vUser_HospitalID,
            username: vUser_UserName,
            //password: vUser_Password,
        };

		$.post(url, params, function (data) {
            console.log("data = " + JSON.stringify(data) );
            if(data.Result == "OK"){
                ShowNoti("เปลี่ยนข้อมูลสำเร็จ", "success");
                $("#NotificatedChangeInfoUser").text("เปลี่ยนข้อมูลสำเร็จ");
                getUserInfo(vUser_ID);
            }else{
                ShowNoti("เปลี่ยนข้อมูลไม่สำเร็จ", "warning");
                $("#NotificatedChangeInfoUser").text("เปลี่ยนข้อมูลไม่สำเร็จ กรุณาตรวจสอบใหม่");
            }
        }).fail(function (error) {
            console.log(JSON.stringify(error));
            reject(error);
        });
        console.log("function_name : " + function_name + " => end");
    });
}

function ShowNoti(Msg, Type) {
    $("#MessageNoti").html(Msg);
    $("#Notification").jqxNotification({ template: Type });
    $("#Notification").jqxNotification("open");
}

function ChangePassword(){
    var vUser_ID = $('#vUser_ID').val();
    var vUser_UserName = $('#vUser_UserName').val();
    var vUser_Password = $('#vUser_Password').val();
    var OldPassword = $('#OldPassword').val();
    var NewPassword = $('#NewPassword').val();
    var ReTryNewPassword = $('#ReTryNewPassword').val();
    var function_name = "ChangePassword";
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
	console.log("function_name : " + function_name + " => start");
	return new Promise(function (resolve, reject) {
        var url =  "/api/users/changepassword" ;
        console.log("NewPassword = " + NewPassword);
        console.log("ReTryNewPassword = " + ReTryNewPassword);

        if(NewPassword === ReTryNewPassword){
            var params = {
                password: NewPassword
            };
            
            $.ajax({
                type: 'PUT',
                url: url, 
                data: params,  
                success: function (data){
                    resolve(data);
                    console.log("data = ", data);
                    if(data.status.code === 200){
                        $("#NewPassword").css("border", "1px solid #d1d3e2");
                        $("#ReTryNewPassword").css("border", "1px solid #d1d3e2");
                        $("#NotificatedChangePassword").text("เปลี่ยนรหัสผ่านสำเร็จ");
                    }else{
                        $("#NotificatedChangePassword").text("เปลี่ยนรหัสผ่านไม่สำเร็จ");
                        $("#NotificatedChangePassword").css("color", "red");
                    }   
                }
            }).fail(function (error) {
                console.log(JSON.stringify(error));
                reject(error);
            });

        }else{
            $("#NewPassword").css("border", "1px solid red");
            $("#ReTryNewPassword").css("border", "1px solid red");
            $("#NotificatedChangePassword").text("รหัสผ่านใหม่ไม่ตรงกัน");
        }

        
		console.log("function_name : " + function_name + " => end");
	});
}

module.exports = {
	getUserInfo, Start_Profile
}