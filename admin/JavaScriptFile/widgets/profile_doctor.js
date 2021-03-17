$(document).ready(function () {
    
});

function gridTemplate(UserID) {
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    var function_name = "getUserInfo";
    var params = {userId: UserID};
	console.log("function_name : " + function_name + " => start");
	return new Promise(function (resolve, reject) {
		var url =  "/api/template/list";
		$.post(url, params, function (data) {

            if(data.status.code == 200){
                const new_data = JSON.stringify(data);
                console.log("data = "+ new_data );
                var databases = new Array();
                var a = JSON.parse(new_data);
                const length = data.Records.length;
                console.log("length = " + data.Records.length);

                for (var i = 0; i < length; i++) {
                    var row = {};
                    row.Template_ID = data.Records[i].id;
                    row.Template_Code = data.Records[i].Name;
                    row.User_ID = data.Records[i].userId;
                    row.Content = data.Records[i].Content;
                    databases[i] = row;
                }

                console.log("databases = " + databases.length);

                var source =
                {
                    localdata: databases,
                    datatype: "array",
                };

                var dataAdapter = new $.jqx.dataAdapter(source);
                $("#gridTemplate").jqxGrid({ source: dataAdapter });
            }else{
                //ShowNoti('สร้าง Template สำเร็จ', "success");
                //$("#NotificatedChangeInfoUser").text("ดึงข้อมูลTemplateไม่สำเร็จ กรุณาตรวจสอบใหม่");
            }
        });
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
            $("#vUser_HospitalActive").val(information.userinfo.User_Hospitals);

            $("#UserInfo").val(JSON.stringify(information) );

            console.log("function_name : " + function_name + " => success in get data");

            resolve(data);
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

        // console.log("vUser_ID = " + vUser_ID);
        // console.log("vUser_InfoID = " + vUser_InfoID);
        // console.log("vUser_UserName = " + vUser_UserName);
        // console.log("vUser_Name_EN = " + vUser_Name_EN);
        // console.log("vUser_LastName_EN = " + vUser_LastName_EN);
        // console.log("vUser_Name_TH = " + vUser_Name_TH);
        // console.log("vUser_LastName_TH = " + vUser_LastName_TH);
        // console.log("vUser_Email = " + vUser_Email);
        // console.log("vUser_Phone = " + vUser_Phone);
        // console.log("vUser_LineID = " + vUser_LineID);
        // console.log("vUserType_ID = " + vUserType_ID);
        // console.log("vUser_PathRadiant = " + vUser_PathRadiant);
        // console.log("vUser_HospitalID = " + vUser_HospitalID);

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
                $("#NotificatedChangeInfoUser").text("เปลี่ยนข้อมูลสำเร็จ");
                ShowNoti("เปลี่ยนข้อมูลสำเร็จ", "success");
                getUserInfo(vUser_ID).then( (data) => {
                    ListHospitalAffiliate();
                })
            }else{
                $("#NotificatedChangeInfoUser").text("เปลี่ยนข้อมูลไม่สำเร็จ กรุณาตรวจสอบใหม่");
                ShowNoti("เปลี่ยนข้อมูลไม่สำเร็จ", "warning");
            }
        }).fail(function (error) {
            console.log(JSON.stringify(error));
            reject(error);
        });
        console.log("function_name : " + function_name + " => end");
    });
}

function AddTemplate(UserID) {
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    var function_name = "AddTemplate";
    var params = "";
	console.log("function_name : " + function_name + " => start");
    return new Promise(function (resolve, reject) {
        var url =  "/api/template/add" ;
        var TemplateID = $('#vTemplate_ID').val();
        var TemplateCode = $('#vTemplateCode').val();
        var TemplateText = $('#vTemplateText').val();
        console.log("url = "+ url);
        var params = { userId:UserID, 
            data:{
                Name: TemplateCode,
                Content: TemplateText,
            }
        };

        $.post(url, params, function (data) {
            console.log("data = " + JSON.stringify(data) );
            if(data.status.code == 200){
                //$("#NotificatedChangeInfoUser").text("เปลี่ยนข้อมูลสำเร็จ");
                gridTemplate(UserID);
                $('#vTemplate_ID').val('');
                $('#vTemplateCode').val('');
                $('#vTemplateText').val('');
                $('#gridTemplate').jqxGrid('clearselection');
                ShowNoti('เพิ่ม Template สำเร็จ', "success");
            }else{
                // $("#NotificatedChangeInfoUser").text("เปลี่ยนข้อมูลไม่สำเร็จ กรุณาตรวจสอบใหม่");
                ShowNoti('เพิ่ม Template ไม่สำเร็จ', "warning");
            }
        }).fail(function (error) {
            console.log(JSON.stringify(error));
            ShowNoti('Failed', "warning");
            reject(error);
        });

        console.log("function_name : " + function_name + " => end");
    });
}

function DeleteTemplate(Template_ID, UserID) {
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    var function_name = "DeleteTemplate";
    var params = "";
	console.log("function_name : " + function_name + " => start");
    return new Promise(function (resolve, reject) {
        var url =  "/api/template/delete" ;
        var params = {id : Template_ID};

        $.post(url, params, function (data) {
            console.log("data = " + JSON.stringify(data) );
            if(data.status.code == 200){
                //$("#NotificatedChangeInfoUser").text("เปลี่ยนข้อมูลสำเร็จ");
                gridTemplate(UserID);
                $('#vTemplate_ID').val('');
                $('#vTemplateCode').val('');
                $('#vTemplateText').val('');
                $('#gridTemplate').jqxGrid('clearselection');
                ShowNoti('ลบ Template สำเร็จ', "success");
            }else{
                $("#NotificatedChangeInfoUser").text("เปลี่ยนข้อมูลไม่สำเร็จ กรุณาตรวจสอบใหม่");
            }
        }).fail(function (error) {
            console.log(JSON.stringify(error));
            ShowNoti('Failed', "warning");
            reject(error);
        });

        console.log("function_name : " + function_name + " => end");
    });
}

function DeleteRadioHospital(UserID, Hos_ID, Hos_Name) {
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    var function_name = "DeleteRadioHospital";
	console.log("function_name : " + function_name + " => start");
    return new Promise(function (resolve, reject) {
        var url =  "/api/user/update" ;
        var vUser_ID = UserID;
        var vUser_InfoID = $("#vUser_InfoID").val();
        let user_data = JSON.parse($("#UserInfo").val());
        let user_hospital_info = user_data.userinfo.User_Hospitals ;
        let resource = JSON.parse(user_hospital_info);
        // let current_user_hospital = delete user_hospital_info.Hos_ID;
        let results = new Array();

        for(var i =0; i< resource.length; i++){
            if(resource[i].id !== Hos_ID){
                var a = { id: resource[i].id };
                results.push(a);
            }
        }

        console.log("resource after delete = " + JSON.stringify(results));
        resource_string = JSON.stringify(results);

        var params = {
            id: vUser_InfoID,
            userId: UserID,
            infoId: vUser_InfoID,
            User_Hospitals: resource_string,
        };

        $.post(url, params, function (data) {
            console.log("data = " + JSON.stringify(data) );
            if(data.Result == 'OK'){
                //$("#NotificatedChangeInfoUser").text("เปลี่ยนข้อมูลสำเร็จ");
                getUserInfo(vUser_ID).then( (data) => {
                    ListHospitalAffiliate();
                });
                
                $('#gridHospitalDoctor').jqxGrid('clearselection');
                ShowNoti('ลบโรงพยาบาลในสังกัดสำเร็จ', "success");
            }else{
                //$("#NotificatedChangeInfoUser").text("เปลี่ยนข้อมูลไม่สำเร็จ กรุณาตรวจสอบใหม่");
            }
        }).fail(function (error) {
            console.log(JSON.stringify(error));
            ShowNoti('Failed', "warning");
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

function Start_ProfileDoctor(){

    $("#gridHospitalDoctor").jqxGrid(
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
                //example data [{"id":0,"Value":1,"DisplayText":"ชาตรีเวช"},{"id":1,"Value":2,"DisplayText":"เจริญการแว่น"}
                { text: 'ID', datafield: 'Value', align: 'center', minwidth: 30 },
                { text: 'โรงพยาบาล', datafield: 'DisplayText', align: 'center', minwidth: 100 },
                {
                    text: 'ออกจากสังกัด', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: 60,
                    cellsrenderer: function (row) { return "Delete"; }, buttonclick: function (row) {
                        Editrow = row;
                        var offset = $("#gridHospitalDoctor").offset();

                        var dataRecord = $("#gridHospitalDoctor").jqxGrid('getrowdata', Editrow);
                        let rowid = dataRecord.row;
                        var Hos_ID = dataRecord.Value;
                        var Hos_Name = dataRecord.DisplayText;

                        if(confirm("คุณต้องการลบโรงพยาบาล" + Hos_Name + "ออกจากในสังกัดหรือไม่?")) {
                            DeleteRadioHospital(User_ID, Hos_ID, Hos_Name)
                        }
                    }
                }
            ]

        });

    $("#gridTemplate").jqxGrid(
        {
            width: '100%',
            height: '100%',
            pageable: true,
            pagerButtonsCount: 5,
            columnsResize: true,
            //filterable: true,
            //showstatusbar: true,
            autoShowLoadElement: false,
            theme: theme,
            columns: [
                { text: 'ID', datafield: 'Template_ID', align: 'center', minwidth: 30 },
                { text: 'Template', datafield: 'Template_Code', align: 'center', minwidth: 100 },
                {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: 60,
                    cellsrenderer: function (row) { return "Delete"; }, buttonclick: function (row) {
                        Editrow = row;
                        var offset = $("#gridTemplate").offset();
                        var dataRecord = $("#gridTemplate").jqxGrid('getrowdata', Editrow);
                        var Template_ID = dataRecord.Template_ID;
                        var User_ID = dataRecord.User_ID;
                        var Template_Code = dataRecord.Template_Code;

                        if (confirm("Do you want to Delete Template " + Template_Code + "?")) {
                            DeleteTemplate(Template_ID, User_ID);
                            
                        }
                    }
                }
            ]
        });

    $('#vTemplateText').jqxEditor({
        height: 400,
        width: "100%",
        tools: 'bold | italic | underline | left | center | right | outdent | indent | size | ul | ol | zoom | datetime | print | template | clear',
        createCommand: function (name) {
            switch (name) {
                case "clear":
                    return {
                        type: 'button',
                        tooltip: 'Clear',
                        init: function (widget) {
                            widget.jqxButton({ width: 80 });
                            widget.html("<span style='line-height: 24px;'>Clear</span>");
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                        },
                        action: function (widget, editor) {
                            // return nothing and perform a custom action.
                            $('#vTemplateText').val('');
                        }
                    };
                case "size":
                    return {
                        init: function (widget) {
                            widget.jqxDropDownList({
                                source: [
                                    { label: "VerySmall (10)", value: "x-small" },
                                    { label: "Small (14)", value: "medium" },
                                    { label: "Normal (18)", value: "large" },
                                    { label: "Large (24)", value: "x-large" }
                                ]
                            });
                        }
                    };
                case "datetime":
                    return {
                        type: 'list',
                        tooltip: "Insert Date/Time",
                        init: function (widget) {
                            widget.jqxDropDownList({ placeHolder: "Time&Date", width: 160, source: ['Insert Time', 'Insert Date'], autoDropDownHeight: true });
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                            widget.jqxDropDownList('clearSelection');
                        },
                        action: function (widget, editor) {
                            var widgetValue = widget.val();
                            var date = new Date();
                            // return object with command and value members.
                            return { command: "inserthtml", value: widgetValue == "Insert Time" ? "เวลา "+ date.getHours() + ":" + date.getMinutes() : "วันที่ " + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() };
                        }
                    };
                case "template":
                    return{
                        type: 'button',
                        tooltip: 'เปิดหรือปิดเทมเพลต',
                        init: function (widget) {
                            widget.jqxButton({ width: 100 });
                            widget.html("<span style='line-height: 24px;'>Template</span>");
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                        },
                        action: function (widget, editor) {
                            // return nothing and perform a custom action.
                            if( $("#gridTemplate").height() > 40 ){
                                $("#gridTemplate").height(30);
                            }else{
                                $("#gridTemplate").height(320);
                            }
                        }
                    };
                case "zoom":
                    // var current_height = 318;
                    // var current_width = 1022.5; //$('#pRespone').width(); 
                    // var new_height;
                    // var new_width;
                    return{
                        type: 'list',
                        tooltip: "ขยายขนาด",
                        init: function (widget) {
                            widget.jqxDropDownList({
                                placeHolder: "Zoom",
                                width: 100,
                                autoDropDownHeight: true,
                                source: [
                                    { label: "100%", value: 1 },
                                    { label: "150%", value: 1.5 },
                                    { label: "200%", value: 2.0 },
                                    { label: "300%", value: 3.0 }
                                ]
                            });
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                        },
                        action: function (widget, editor) {
                            // return nothing and perform a custom action.
                            var widgetValue = widget.val();
                            //console.log(widgetValue);
                            editor.css("zoom", widgetValue);
                        }
                    };

                case "print":
                    return {
                        type: 'button',
                        tooltip: 'Print',
                        init: function (widget) {
                            widget.jqxButton({ width: 50 });
                            widget.html("<span style='line-height: 23px;'>Print</span>");
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                        },
                        action: function (widget, editor) {
                            // return nothing and perform a custom action.
                            $('#vTemplateText').jqxEditor('print');
                        }
                    };
            }
        },
    });

    theme = 'energyblue';
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    let promise_AllGrid = AllGrid();


    $("#RadiologistProfile").click(function() {
        // var promise_AllGrid = AllGrid();
        // promise_AllGrid.then( function() {
        //     gridHospital(User_ID);
        //     getUserInfo(User_ID);
        //     console.log("RadiologistProfile Click!!!");
        // });
        // AllGrid();
        // setTimeout(function() {
        //     gridHospital(User_ID);
        //     getUserInfo(User_ID);
        // }, 1000);
    });

    $("#SaveUser").click(function functionName() {
        var UserID = $('#vUser_ID').val();
        UpdateUser(UserID);
    });

    $("#CancelUser").click(function functionName() {
        window.open('index.html', '_self');
    });

    $("#SaveTemplate").click(function functionName() {
        var UserID = $('#vUser_ID').val();
        AddTemplate(UserID);
    });

    $("#gridTemplate").on('rowdoubleclick', function (row) {
        //console.log("Row with bound index: " + row.args.rowindex + " has been double-clicked.");
        Editrow = row.args.rowindex;
        var offset = $("#gridTemplate").offset();
        var dataRecord = $("#gridTemplate").jqxGrid('getrowdata', Editrow);
        //alert(dataRecord);
        $("#vTemplateTextTextArea").val(dataRecord.Content);
    });

    $("#AddHospitalAffiliate").click( function() {
        var UserID = $('#vUser_ID').val();
        AddHospitalAffiliate(UserID);
    });

    //gridHospital(User_ID);
    let promise_getUserInfo = getUserInfo(User_ID);
    promise_getUserInfo.then( (data) => {
        gridTemplate(User_ID);
        ListHospital();
        ListHospitalAffiliate();
    }).catch( function (error) {
        console.log("Error in promise_getUserInfo: " + error);
    });
}

function ListHospital() {
    let function_name = 'ListHospital';
    let ListHospital = "/api/hospital/options";
    let params = [];
    let user_data = JSON.parse($("#UserInfo").val());
    let user_hospital_info = user_data.userinfo.User_Hospitals;
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url = ListHospital;
        $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
        $.get(url, params, function (data) {
            var new_data = JSON.stringify(data);
            length = data["Options"].length;
            console.log("data = " + JSON.stringify(data["Options"][0].DisplayText));
            for (var i = 0; i < length; i++) {
                var hospitalName = JSON.stringify(data["Options"][i].DisplayText).replaceAll('"', '');
                $("#HospitalType").append(new Option(hospitalName, [i + 1, hospitalName] ));
            }
        }).fail(function (error) {
            console.log(JSON.stringify(error));
            reject(error);
        });
        console.log("function_name : " + function_name + " => end");
    });
}

function ListHospitalAffiliate() {
    let function_name = 'ListHospitalAffiliate';
    let ListHospital = "/api/hospital/options";
    let params = [];
    let user_data = JSON.parse($("#UserInfo").val());
    let user_hospital = user_data.userinfo.User_Hospitals;
    let user_hospital_object = JSON.parse(user_hospital);

    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url = ListHospital;
        $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
        $.get(url, params, function (data) {

            var databases = new Array();
            let length = user_hospital_object.length;
            for(var i=0; i< length; i++){
                // [{"id": 1}, {"id": 2}]
                var row = {};
                var id_hos = user_hospital_object[i].id;
                for(var j=0; j<data["Options"].length; j++){
                    if(id_hos == data.Options[j].Value){
                        row.id = i;
                        row.Value = data.Options[j].Value;
                        row.DisplayText  = data.Options[j].DisplayText;
                        databases[i] = row;
                    }
                }
            }
            console.log(" databases in ListHospital: " + JSON.stringify( databases) );

            var source =
            {
                localdata: databases,
                datatype: "array",
            };

            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#gridHospitalDoctor").jqxGrid({ source: dataAdapter });


        }).fail(function (error) {
            console.log(JSON.stringify(error));
            reject(error);
        });
        console.log("function_name : " + function_name + " => end");
    });
}


function AddHospitalAffiliate(UserID) {
    let function_name = 'AddHospitalAffiliate';
    let addHospitalAffiliate = "/api/user/update";
    let params = [];
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url = addHospitalAffiliate;
        $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
        $.post(url, params, function (data) {

            var url =  "/api/user/update" ;
            var vUser_ID = UserID;
            var vUser_InfoID = $("#vUser_InfoID").val();
            const hosActiveInput = $("#HospitalType").val().split(",");
            let user_data = JSON.parse($("#UserInfo").val());
            let user_hospital_info = user_data.userinfo.User_Hospitals ;
            let user_hospital_info_object = JSON.parse(user_hospital_info);
            let hosActivel = new Array();
            let a = {id : hosActiveInput[0]} ;
            if(user_hospital_info_object.length > 0 ){
                for(var i=0; i<user_hospital_info_object.length; i++){
                    hosActivel.push(user_hospital_info_object[i]);
                }
                hosActivel.push(a);
            }else{
                hosActivel.push(a);
            }
            var response_hos = JSON.stringify(hosActivel);

            var params = {
                id: vUser_InfoID,
                userId: UserID,
                infoId: vUser_InfoID,
                User_Hospitals: response_hos,
            };

            $.post(url, params, function (data) {
                console.log("data = " + JSON.stringify(data) );
                if(data.Result == "OK" || response_hos.length > 0){
                    $("#NotificatedChangeInfoUser").text("เพิ่มโรงพยาบาลในสังกัดสำเร็จ");
                    getUserInfo(vUser_ID).then( (data) => {
                        ListHospitalAffiliate();
                    });
                }else{
                    $("#NotificatedChangeInfoUser").text("เพิ่มข้อมูลไม่สำเร็จ กรุณาตรวจสอบใหม่");
                }
            }).fail(function (error) {
                console.log(JSON.stringify(error));
                reject(error);
            });
            console.log("function_name : " + function_name + " => end");
        });
    });
}

module.exports = {
    Start_ProfileDoctor
}