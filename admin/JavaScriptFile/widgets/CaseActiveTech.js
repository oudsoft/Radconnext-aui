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

function cachedScript(url, options){
    options = $.extend( options || {}, {
        dataType: "script",
        cache: true,
        url: url
    });
    return $.ajax( options );
}

$(document).ready(function () {

});

function CheckCaseStatus(Case_StatusID) {
    if (Case_StatusID != "0" && (User_TypeID == "3" || User_TypeID == "7")) {
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

function getCliamesType() {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "getCliamesType";
    var params = {};
    // console.log("function_name : " + function_name + " => start");
    var url = "/api/cases/options/" + User_HosID;
    const promises = doGetApi(url, params);
    promises.then( (data) => {
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

            var source =
            {
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
    }).catch( (err) => {
        console.log(`function ${function_name} error => ${err}` );
    });        
}

function getUrgency() {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "getUrgency";
    var params = {};
    var url = "/api/cases/options/" + User_HosID;
    const promises = doGetApi(url, params);
    promises.then( (data) => {
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

            var source =
            {
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
    }).catch( (err) =>{
        console.log(`function ${function_name} error => ${err}` );
    });
    // console.log("function_name : " + function_name + " => end");
}

function getRadiologistList() {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "getRadiologistList";
    var params = {};
    var url = "/api/cases/options/" + User_HosID;
    const promises = doGetApi(url, params);
    promises.then( (data) => {
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

            var source =
            {
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
    }).catch( (err) =>{
        console.log(`function ${function_name} error => ${err}` );
    });
}

function getPatientDoctorList() {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "getPatientDoctorList";
    var params = {};
    var url = "/api/cases/options/" + User_HosID;
    const promises = doGetApi(url, params);
    promises.then( (data) => {
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

            var source =
            {
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
    }).catch( (err) =>{
        console.log(`function ${function_name} error => ${err}` );
    });
}

function GetDoctor() {
    if (User_TypeID != "4") {
        // SRAD_LIST_DORTOR();
        $('#vMtypeDetail').show();
    }
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

// $('#UploadImage').click(function () {
//     //$('#UploadImage').jqxInput({disabled: true });
//     var _file = document.getElementById('vFileImage');
//     var CaseID = $("#vCaseID").val();
//     var data = new FormData();
//     data.append('filUpload', _file.files[0]);

//     var act = 'SRAD_Upload';
//     $.ajax({
//         url: "sapi/api.img.class.php?action=" + act + "&Case_ID=" + CaseID,
//         data: data,
//         type: 'POST',
//         dataType: "json",
//         contentType: false,
//         processData: false,
//         success: function (data) {
//             var vResponse = data.Response;
//             var vMsg = data.data[0].Msg;
//             if (vResponse == 'success') {
//                 ShowNoti(vMsg, vResponse);
//                 $('#vFileImage').val('');
//                 SRAD_SEC_FILE(CaseID);
//             } else {
//                 ShowNoti(vMsg, "warning");
//                 $('#vFileImage').val('');
//             }
//         }
//     });
//     $(".pip").remove();
// });

function CheckCasePatient(PatientHN) {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "CheckCasePatient";
    var params = { key: { Patient_HN: PatientHN } };
    return new Promise(function (resolve, reject) {
        // console.log("function_name : " + function_name + " => start");
        var url = "/api/patient/search";
        $.post(url, params, function (data) {
            // console.log("data in function " + function_name + " = " + JSON.stringify(data));
            if (data.Result == 'OK') {
                //console.log("data in function "+ function_name + " = " + JSON.stringify(data));
                $("#PatientID").val(data.Records[0].id);
                resolve(data);
                // console.log("Success get data in " + function_name);
            } else {
                reject(data);
                console.log("Error in Get Data " + function_name);
            }
        });
        console.log("function_name : " + function_name + " => end");
    });
}

function gridCaseActive(Hos_ID) {
    var caseReadWaitStatus = [1, 2, 3, 4, 7];
    var caseReadSuccessStatus = [5, 6];
    var caseAllStatus = [1, 2, 3, 4, 5, 6, 7];
    const function_name = 'gridCaseActive';
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var params = { hospitalId: Hos_ID, userId: User_ID, statusId: caseAllStatus };
    var url = "/api/cases/filter/hospital";
    const promises = doPostApi(url, params);
    promises.then( (data) => {
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


            var source =
            {
                localdata: databases,
                datatype: "array",
            };

            // console.log("source : " + JSON.stringify(source));

            var dataAdapter = new $.jqx.dataAdapter(source);
            try {
                $("#gridCaseActive").jqxGrid({ source: dataAdapter });
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
    }).catch( (error) => {
        console.log("error: " + error);
        // log.info("error: " + error);
    });
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
            console.log("data = " + data);
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

function start_CaseActiveTech() {
    var theme = 'energyblue';
    vTotalCase = $('#sTotalCase').html();
    vNewCase = $('#sNewCase').html();
    vWaitAccept = $('#AWaitAccept').html();
    vAccepted = $('#AAccepted').html();
    //LoopLoad(vTotalCase, vNewCase);
    $("#ManageCase").hide();
    $('#vMtypeDetail').hide();
    $('#frmReportCase').hide();
    $('#frmRenewCase').hide();
    $("#ManageCaseDoctor").hide();

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
        return  '<span class="text-sm-center align-middle">' + formatted_date + '</span>';
    };

    ///////////////// Tooltips Header Column /////////////////////////////
    var tooltiprenderer = function (element) {
        $(element).parent().jqxTooltip({ position: 'top', content: "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง" });
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
        columns: [
            { text: '#', datafield: 'Row', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: 35 },
            { text: 'สถานะ', datafield: 'CS_Name_EN', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', cellsrenderer: cellsrenderer, rendered: tooltiprenderer, width: 100 },
            { text: 'วันที่', datafield: 'createdAt', align: 'center', cellsalign: 'center', cellsformat: 'dd MMM yyyy HH:mm:ss', filtertype: 'range', cellsrenderer: Timecellsrenderer , rendered: tooltiprenderer, width: 150 },
            { text: '#HN', datafield: 'Patient_HN', align: 'center', rendered: tooltiprenderer, width: 150 },
            { text: 'ผู้รับการตรวจ(อังกฤษ)', datafield: 'FullName_EN', align: 'center', rendered: tooltiprenderer, width: 250 },
            { text: 'ผู้รับการตรวจ(ไทย)', datafield: 'FullName_TH', align: 'center', rendered: tooltiprenderer, width: 250 },
            { text: 'เพศ', datafield: 'Patient_Sex', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', rendered: tooltiprenderer, width: 50 },
            { text: 'อายุ', datafield: 'Patient_Age', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: 50 },
            { text: 'วันเกิด', datafield: 'Patient_Birthday', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: 80 },
            { text: 'รายการ', datafield: 'Order_Detail', align: 'center', rendered: tooltiprenderer, minwidth: 200 },
            { text: 'ราคา', datafield: 'Order_Price', align: 'center', cellsalign: 'right', width: 70, rendered: tooltiprenderer, cellsformat: 'c0' },
            { text: 'DF แพทย์', datafield: 'Order_DF', align: 'center', cellsalign: 'right', width: 80, rendered: tooltiprenderer, cellsformat: 'c0' },
            { text: 'Description', datafield: 'Case_StudyDescription', align: 'center', rendered: tooltiprenderer, width: 120 },
            { text: 'Protocol', datafield: 'Case_ProtocolName', align: 'center', rendered: tooltiprenderer, minwidth: 180 },
            { text: 'Modality', datafield: 'Case_Modality', align: 'center', width: 70, rendered: tooltiprenderer, filtertype: 'checkedlist' },
            { text: 'Urgency', datafield: 'UGType_Name', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', rendered: tooltiprenderer, width: 100 },
            { text: 'รังสีแพทย์', datafield: 'Patient_RadiologistDoctor', align: 'center', rendered: tooltiprenderer, width: 150 }
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

    gridCaseActive(User_HosID);

    $("#gridCaseActive").on('rowselect', function (event) {

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

        /*try{
          //$('#gridCaseActive').jqxGrid('clearfilters');
          $('#gridCaseActive').jqxGrid('clearselection');
          $('#gridFileUpdate').jqxGrid('clearselection');
        }
        catch{
          location.reload();
        }*/

        document.getElementById("vShowImg").src = '';
    });

    $("#RegisterClose").on('click', function() {
        getPatientDoctorList();
    });

    $("#SaveCase").on('click', function () {

        var PatientData = JSON.parse($("#PatientData").val());
        console.log("PatientData = " + PatientData);
        var PatientHN_Number = PatientData.PatientID;
        var OrthancStudyID = PatientData.Case_OrthancStudyID;
        // var vPatient_ID = PatientData.Patient_ID;

        // var CaseID = $("#vCaseID").val();
        // var TechID = $("#TechID").val();
        var RefferDoctorID = $("#vListDoctor").val();
        var UrgentTypeID = $("#vUrgentType").val();
        var cliamerID = $("#RightID").val();
        var RadioDoctorID = $("#vPatientDoctor").val();


        // var PatientDoctor = $("#vPatientDoctor").val();
        // var CitizenID = $("#vCitizenID").val();
        // var pName = $("#vName").val();
        // var pLName = $("#vLName").val();

        // var vCase_ID = $("#vCaseID").val();
        // var vPatient_HN = $("#vHN").val();
        // var vSex = $("#vSex").val();
        // var vPatient_NameEN = $("#vName").val();
        // var vPatient_LastNameEN = $("#vLName").val();
        // var vPatient_CitizenID = $("#vCitizenID").val();
        // var vPHos = $("#PHos").val();
        // var vCase_Modality = $("#HModality").val();
        // var vCase_Desc = $("#HCase").val();
        // var vProtocol = $("#HProtocol").val();
        // var vcliamerightId = $("#RightID").val();
        // var UrgentTypeID = $("#UrgentTypeID").val();
        // var vPatientDoctorName = $("#vPatientDoctor").val();


        if (RefferDoctorID == "") {
            ShowNoti("กรุณาเลือก แพทย์เจ้าของไข้.", "warning");
        } else if (RadioDoctorID == "") {
            ShowNoti("กรุณาเลือก รังสีแพทย์.", "warning");
        } else if (UrgentTypeID == "") {
            ShowNoti("กรุณาเลือก กรุณาเลือกความเร่งด่วน", "warning");
        } else if (cliamerID == "") {
            ShowNoti("กรุณาเลือก กรุณาเลือกสิทธิ์การรักษา", "warning");
        } else {
            //Tech_UPDATE_CASE(CaseID, TechID, DoctorID, '1', RightID, pName, pLName, UrgentTypeID, PatientDoctor, CitizenID);
            SendCaseByTech(PatientHN_Number);
        }
        
    });



    $("#RegisterDoctor").on('click', function() {
        RadRegister();
    });

    // $( "#RefferalDocterResgister" ).on('shown', function(){
    //     setTimeout( () => {
    //         ListHospital2();
    //     },2000 );
    // });

    ListHospital2();

    $("#ReportCase").on('click', function () {
        var CaseID = $("#vCaseID").val();
        var url = "sapi/rad_report.php?CaseID=" + CaseID;
        openInNewTab(url);
    });

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

    // $("#DownLoadCase").on('click', function () {
    //     var url = 'http://Radconnext:R@dconnext@103.91.189.94:8042/patients/' + Case_OrthancID + '/archive';
    //     openInNewTab(url);
    // });

    // $("#RenewCase").on('click', function () {
    //     let vCaseID = $('#vCaseID').val();
    //     let vTechID = $('#TechID').val();

    //     SRAD_UPDATE_CASE_DOC(vCaseID, vTechID, '0', '0', '');
    // });

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

    $("#gridFileUpdate").jqxGrid({
        width: '100%',
        height: 185,
        //pageable: true,
        //pagerButtonsCount: 10,
        columnsResize: true,
        //autoheight: true,
        //showstatusbar: true,
        theme: theme,
        columns: [{
            text: 'ไฟล์',
            datafield: 'Result_CASE_FileName',
            align: 'center',
            minwidth: 50
        },
        {
            text: 'วันที่',
            datafield: 'Result_CASE_DateUpdate',
            align: 'center',
            width: 150
        },
        {
            text: 'Delete',
            datafield: 'Delete',
            align: 'center',
            columntype: 'button',
            cellsalign: 'center',
            width: 60,
            cellsrenderer: function (row) {
                return "Delete";
            },
            buttonclick: function (row) {
                Editrow = row;
                var offset = $("#gridFileUpdate").offset();

                var dataRecord = $("#gridFileUpdate").jqxGrid('getrowdata', Editrow);
                var Result_CASE_ID = dataRecord.Result_CASE_ID;
                var CASE_ID = dataRecord.CASE_ID;
                var Result_CASE_FileName = dataRecord.Result_CASE_FileName;

                if (confirm("Do you want to Delete File " + Result_CASE_FileName + "?")) {
                    SRAD_DEL_FILE(Result_CASE_ID, CASE_ID);
                }
            }
        }
        ]
    });

    $("#gridFileUpdate").on('rowselect', function (event) {
        var vImage = event.args.row.Result_Path_IMG;
        var url = vImage;
        document.getElementById("vShowImg").src = url;
    });

    /////////////////////////////// Upload Image ///////////////////////////////////////

    if (window.File && window.FileList && window.FileReader) {
        $("#vFileImage").on("change", function (e) {
            var files = e.target.files,
                filesLength = files.length;
            for (var i = 0; i < filesLength; i++) {
                var f = files[i];
                var fileReader = new FileReader();
                fileReader.onload = (function (e) {
                    var file = e.target;
                    $("<span class=\"pip\">" +
                        "<img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
                        "<br/><span class=\"remove\">Remove image</span>" +
                        "</span>").insertAfter("#gridFileUpdate_New");
                    $(".remove").click(function () {
                        $(this).parent(".pip").remove();
                    });
                });
                fileReader.readAsDataURL(f);
            }
        });
    } else {
        alert("Your browser doesn't support to File API");
    }
    ////////////////////////////////////////////////////////////////////////////////////////////

    getCliamesType();
    getUrgency();
    getRadiologistList();
    getPatientDoctorList();

}

function jqxTooltipGridActive() {
    setTimeout(function () {
        /////////////////// New Code jqxTooltip /////////////////////////
        // $("#UploadImage").jqxTooltip({ showDelay: 1000, position: 'top', content: 'UploadImage' });
        // $("#bScanImage").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Scan' });
        // $("#bSnipImage").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Snap' });
        // $("#bCameraImage").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Camera' });
        $("#SaveCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ส่งรายการตรวจ' });
        $("#CancelCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ออก' });
        $("#ViewCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'เปิดภาพ' });
        $("#DownLoadCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ดาวน์โหลด' });
        $("#openButton").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ตั้งค่าการแสดง column' });
        //$("#columntablegridCaseActive").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง' });
        $("#row00gridCaseActive").children().eq(2).jqxTooltip({ showDelay: 1000, position: 'top', content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง' });
        $("#row00gridCaseActive").children().eq(3).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(4).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(6).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(7).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(8).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCaseActive").children().eq(9).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCaseActive").children().eq(7).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCaseActive").children().eq(8).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCaseActive").children().eq(9).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCaseActive").children().eq(10).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCaseActive").children().eq(11).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCaseActive").children().eq(12).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCaseActive").children().eq(15).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        //////////////////////////////////////////////////////////////////////////////////
    }, 2000);
}

function ShowPatientData(dataRecord) {

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

    $("#PatientData").val(JSON.stringify(dataRecord));
    $("#InstancesOrthanC").val(StudyInstanceUID);
    $("#OrthancStudyID").val(Case_OrthancStudyID);

    $("#ManageCase").show();
    getCliamesType();
    getUrgency();
    getRadiologistList();
    getPatientDoctorList();

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
    $('#vCitizenID').val(Patient_CitizenID);
    $('#RightID').val(TreatmentRights_ID);
    $('#UrgentTypeID').val(Case_UrgentType);
    //$('#vPatientDoctor').val(Patient_RefferalDoctor);
    //$('#vCitizenID').val(Patient_CitizenID);
    $('#vCaseAMT').val(Order_Price);
    $('#vCaseDFAMT').val(Order_DF);
    $('#vCaseDescrpition').val(Case_DocRespone);

    $("#vDPhone").html("");
    $("#vDEmail").html("");
    $("#vDLine").html("");


    setTimeout(function() {
        if (User_TypeID != '4') {
            $('#TechID').val(Case_TechID);
        } else {
            $('#TechID').val(User_ID);
        }
        if (TreatmentRights_ID != '0') {
            $("#vRight").jqxDropDownList('selectIndex', TreatmentRights_ID);
            //$("#sRights").html(TreatmentRights_Name);
        }
        if (urgenttype_ID != '0') {
            $("#vUrgentType").jqxDropDownList('selectIndex', urgenttype_ID);
        }
    
        if (Patient_RadiologistDoctor != "" || Patient_RadiologistDoctor != null) {
            $("#vListDoctor").jqxDropDownList('selectItem', Patient_RadiologistDoctor);
        }
        if (Patient_RefferalDoctor != "" || Patient_RefferalDoctor != null) {
            $("#vPatientDoctor").jqxDropDownList('selectItem', Patient_RefferalDoctor);
        }

        //CheckCaseStatus(Case_Status);
        FromTypecheck(Case_StatusID);
        GetDoctor(User_TypeID);
        //SRAD_MSG_TREATMENTRIGHTS(Hos_OrthancID);
        //SRAD_MSG_URGENT_TYPE(Hos_OrthancID);
        //SRAD_SEC_FILE(Case_ID);
        scrollToTop();

    },1000);

}

function RadRegister() {
    let function_name = 'RadRegister';
    let API = "/api/users";
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
        var url = API;
        var CountError = 0;

        //let User_ID = $("#User_ID").val();
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

        console.log("params = "+ params);

        if (CountError === 0) {
            $.post(url, params, function (data) {
                //resolve(data);
                console.log("Successful Conntection");
                console.log("data = ", data);
                if (data.error) {
                    $("#User_FirstName").css("border", "1px solid red");
                    $("#Validation_UserName").text(data.error.why);
                } else {
                    //$('#RegisterPage').click();
                    $("#RegisterNotification").text('การสมัครสมาชิกสำเร็จ');
                    ClearText();
                }

            }).fail(function (error) {
                console.log("failed");
                console.log(JSON.stringify(error));
                reject(error);
            });
        } else {
            console.log("Error => CountError = " + CountError);
        }
        console.log("function_name : " + function_name + " => end");

    });
}

function ListHospital2() {
    let function_name = 'ListHospital2';
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
                var hospitalName = JSON.stringify(data["Options"][i].DisplayText).replaceAll('"', '');
                $("#HospitalType").append(new Option(hospitalName, i + 1));
            }
        }).fail(function (error) {
            console.log(JSON.stringify(error));
            reject(error);
        });
        console.log("function_name : " + function_name + " => end");
    });
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
    $("#Validation_UserName").text("")
    $("#User_FirstName").css("border","1px solid #d1d3e2")
    $("#Password").css("border","1px solid #d1d3e2")
    $("#ReTryPassword").css("border","1px solid #d1d3e2")
    $("#FirstNameEng").css("border","1px solid #d1d3e2")
    $("#LastNameEng").css("border","1px solid #d1d3e2")
    $("#Email").css("border","1px solid #d1d3e2")
    $("#Phone").css("border","1px solid #d1d3e2")
}

module.exports = {
    start_CaseActiveTech
}
