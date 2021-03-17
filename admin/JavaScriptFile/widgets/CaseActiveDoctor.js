// const { data } = require("jquery");
// import { Course } from './course.js';
const { GetTimeInTaskappCaseIdAPI, getTriggerAt, MessageNotifys, 
    ReloadMessageNotify, showNotification, sortMasterNotifyFunction, 
    ObjectSize, CaseTimerInTable, doConnectWebsocketMaster,
    doConnectWebsocketLocal, } = require('../Utility.js');

$(document).ready(function () {

});

function Start_CaseActiveDoctor(){
    var theme = 'energyblue';
    
    /////////////////// New Code to not back page to login /////////////////////////
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function (event) {
        //alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
        window.history.pushState(null, "", window.location.href);
        if ($("#gridCaseActive").is(":hidden")) {
            $("#GridCase").show();
            $("#ManageCase").hide();
        }
        scrollToTop();
    };
    /////////////////// New Code to not back page to login /////////////////////////

    vTotalCase = $("#sTotalCase").html();
    vNewCase = $("#sNewCase").html();
    vWaitAccept = $("#AWaitAccept").html();
    vAccepted = $("#AAccepted").html();
    //LoopLoad(vTotalCase, vNewCase);
    $("#ManageCase").hide();
    $("#vMtypeDetail").hide();


    var Case_ID;
    var Case_Status;
    var Case_TechID;
    var Case_OrthancID;

    var Timecount = function (row, value) {
        Editrow = row;
        var dataRecord = $("#gridCaseActive").jqxGrid("getrowdata", Editrow);
        var Case_DateUpdate = dataRecord.Case_DateUpdate;
        var UrgentTime = dataRecord.UrgentTime;
        var CaseID = dataRecord.Case_ID;
        var TechID = dataRecord.Case_TechID;
        var Case_Status = dataRecord.Case_Status;

        const d = Date.parse(Case_DateUpdate);
        const millis = Date.now();

        var total = millis - d;
        var date = millisToMinutesAndSeconds(total);
        var ChkExpire = millisToMinutes(total);

        if (total > parseInt(UrgentTime)) {
            //ChkExpire = '<span class="text-danger center"><B>Expire</B></span>';

            if (Case_Status == "1") {
                ChkExpire = '<span class="text-danger center"><B>Expire</B></span>';
                SRAD_UPDATE_CASE_DOC(CaseID, TechID, "0", "0", "");
            } else {
                ChkExpire =
                    '<span class="text-primary center"><B>' + "Stop" + "</B></span>";
            }
        } else {
            if (Case_Status == "1") {
                ChkExpire =
                    '<span class="text-primary center"><B>' +
                    String(date) +
                    "</B></span>";
            } else {
                ChkExpire =
                    '<span class="text-primary center"><B>' + "Stop" + "</B></span>";
            }
        }

        return ChkExpire;
    };

    function millisToMinutesAndSeconds(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    function millisToMinutes(millis) {
        var minutes = Math.floor(millis / 60000);
        return minutes;
    }

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

    // setInterval(function () {
    //     $("#gridCaseActive").jqxGrid("refresh");
    // }, 1000 * 1);

    // setInterval(function () {
    //     if (typeof Case_ID == "undefined") {
    //         location.reload(true);
    //     }
    // }, 1000 * (60 * 30));

    // setInterval(function () {
    //     var Case_Status = $("#CaseStatus").val();
    //     AutoSaverespone(Case_Status);
    // }, 1000 * 30);

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
        scrollmode: "logical",
        autoShowLoadElement: false,
        pagesizeoptions: ["10", "20", "50", "100", "500"],
        theme: theme,
        columns: [{ text: "#", datafield: "Row", align: "center", cellsalign: "center", width: 35, },
        {
            text: "Accept", datafield: "Accept", align: "center", columntype: "button", width: 100,//columntype: 'text',cellsalign: "center",width: 60,rendered: tooltiprenderer,//cellclassname: 'btnAccept',
            cellsrenderer: function (row) {

                Editrow = row;
                var rowId = row.boundindex;
                var rowData = $("#gridCaseActive").jqxGrid("getrowdata", rowId);
                var dataRecord = $("#gridCaseActive").jqxGrid("getrowdata", Editrow);
                var Case_StatusID = dataRecord.casestatus_ID;
                if (Case_StatusID == 1) {
                    // return '<input type="button" class="btn btn-success btn-sm" id="btn-' + rowId  + '" value="Accept"/>' ;
                    return "Accept";
                } else if(Case_StatusID == 4)  {
                    // return '<input type="button" class="btn btn-success btn-sm" id="btn-Rejects-' + rowId + '" value="View"/>';
                    return "Expired";
                }else if(Case_StatusID == 3) {
                    // return '<input type="button" class="btn btn-danger btn-sm" id="btn-Rejects-' + rowId + '" value="Expired"/>';
                    // $(".btnReject input").eq(row).css("display", "none");
                    return "Not Accepte";
                }else{
                    return "View";
                }
            },
            buttonclick: function (row) {

                Editrow = row;
                var offset = $("#gridCaseActive").offset();
                var dataRecord = $("#gridCaseActive").jqxGrid("getrowdata", Editrow);
                var CaseID = dataRecord.Case_ID;
                var TechID = dataRecord.TechID;
                var Case_Status = dataRecord.CS_Name_EN;
                var Hos_Name = dataRecord.Hos_Name;
                var Patient_Name = dataRecord.Patient_NameEN;
                // var TechUID = dataRecord.TechID;  // LineID
                var DocFullName = dataRecord.Patient_RefferalDoctor;
                var Modality = dataRecord.Case_Modality;
                var Description = dataRecord.Case_StudyDescription;
                var ProtocolName = dataRecord.Case_ProtocolName;
                var OrthancStudyID = dataRecord.Case_OrthancStudyID;

                var row_data = JSON.stringify(dataRecord);
                $("#dataRecord").val(row_data);

                if (Case_Status == "New" ) {
                    
                    let PromiseUpdateStatusCase = UpdateStatusCase(CaseID, 2, dataRecord.urgenttypeId);
                    PromiseUpdateStatusCase.then( (data) =>{
                        console.log("data in UpdateStatusCase: " +  data);
                        ShowNoti("ตอบรับเคสเรียบร้อย", "success");
                        // window.location.reload();
                        gridCaseActive(User_HosID);

                    }).catch(function (error){
                        console.log("error in PromiseUpdateStatusCase = " + error);
                    });

                }else if(Case_Status == "Accepted" || Case_Status == "Success") {

                    ShowNoti("Already Accepted", "success");
                    var dataRecord = $("#gridCaseActive").jqxGrid("getrowdata", Editrow);

                    // {
                    //     "Row": 3,
                    //     "Case_ID": 78,
                    //     "Case_OrthancStudyID": "449e05d3-7c11d3cd-317ae626-3258091c-bb0f5dec",
                    //     "Case_ACC": "",
                    //     "Case_BodyPart": null,
                    //     "Case_Modality": "CT",
                    //     "Case_Manufacturer": "GE MEDICAL SYSTEMS",
                    //     "Case_ProtocolName": "1.1 Routine BRAIN NC (ADUIT)",
                    //     "Case_StudyDescription": "CT BRAIN NC",
                    //     "Case_StationName": "ct99",
                    //     "Case_PatientHRLink": null,
                    //     "Case_RadiologistId": 11,
                    //     "Case_RefferalId": 14,
                    //     "Case_RefferalName": "ทดสอบ ทดสอบ",
                    //     "Case_Department": "500",
                    //     "Case_Price": 300,
                    //     "Case_DESC": "dasdsadsad",
                    //     "createdAt": "2020-11-01T17:35:45.416Z",
                    //     "updatedAt": "2020-11-01T17:40:45.184Z",
                    //     "patientId": 11,
                    //     "urgenttypeId": 1,
                    //     "cliamerightId": 2,
                    //     "casestatusId": 4,
                    //     "TechID": 12,
                    //     "Hos_Name": "ชาตรีเวช",
                    //     "patient_ID": 11,
                    //     "Patient_HN": "14421/61",
                    //     "Patient_NameTH": "WASSANA PUNTI",
                    //     "Patient_LastNameTH": "",
                    //     "Patient_NameEN": "WASSANA_PUNTI",
                    //     "Patient_LastNameEN": "",
                    //     "Patient_CitizenID": "",
                    //     "Patient_Birthday": "",
                    //     "Patient_Age": "44",
                    //     "Patient_Sex": "F",
                    //     "Patient_Tel": "",
                    //     "Patient_Address": "",
                    //     "hospitalId": null,
                    //     "casestatus_ID": 4,
                    //     "CS_Name_EN": "Expired",
                    //     "urgenttype_ID": 1,
                    //     "UGType_Name": "Fast Secret",
                    //     "Order_Detail": "",
                    //     "Order_Price": "",
                    //     "Order_DF": "",
                    //     "Refferal_ID": 11,
                    //     "Refferal_User_NameTH": "ทดสอบ",
                    //     "Refferal_User_LastNameTH": "ทดสอบ",
                    //     "FullName_EN": "WASSANA_PUNTI ",
                    //     "FullName_TH": "WASSANA PUNTI ",
                    //     "Patient_RefferalDoctor": "ทดสอบ ทดสอบ"
                    // }

                    Case_ID = dataRecord.Case_ID;
                    var FullName = dataRecord.FullName_EN;
                    var Hos_OrthancID = dataRecord.hospitalId;
                    var Hos_Name = dataRecord.Hos_Name;
                    var patient_ID = dataRecord.patient_ID;
                    var Patient_HN = dataRecord.Patient_HN;
                    var Patient_Name = dataRecord.Patient_NameEN;
                    var Patient_LastName = dataRecord.Patient_LastNameEN;
                    var Case_StudyDESC = dataRecord.Case_StudyDescription;
                    var Patient_Sex = dataRecord.Patient_Sex;
                    var Patient_Age = dataRecord.Patient_Age;
                    var Patient_Birthday = dataRecord.Patient_Birthday;
                    var Patient_CitizenID = dataRecord.Patient_CitizenID;
                    var CASE_STATUS_Name = dataRecord.CS_Name_EN;
                    var TreatmentRights_ID = dataRecord.cliamerightId;
                    var TreatmentRights_Name = dataRecord.TreatmentRights_Name;
                    var Case_DoctorID = dataRecord.Case_RadiologistId;
                    var Patient_XDoc = dataRecord.DocFullName;
                    var UG_Type_Name = dataRecord.UG_Type_Name;
                    var Case_UrgentType = dataRecord.Case_UrgentType;
                    var Patient_Doctor = dataRecord.Patient_Doctor;
                    var ProtocolName = dataRecord.Case_ProtocolName;
                    var Case_StudyDescription = dataRecord.Case_StudyDescription;
                    var Modality = dataRecord.Modality;
                    var Case_DocRespone = dataRecord.Case_DocRespone;
                    var TechUID = dataRecord.TechUID;
                    var CS_Name_EN = dataRecord.CS_Name_EN; 
                    var Patient_RefferalDoctor = dataRecord.Patient_RefferalDoctor ;
                    var Case_DESC = dataRecord.Case_DESC;
                    var Case_OrthancStudyID = dataRecord.Case_OrthancStudyID;
                    var Radiologist_FullName = User_NameEN + " " + User_LastNameEN ;
                    var UGType_Name = dataRecord.UGType_Name;

                    Case_TechID = dataRecord.TechID;
                    // Case_Status = dataRecord.Case_Status;
                    Case_OrthancID = dataRecord.Case_OrthancStudyID;
                    Case_Status = CS_Name_EN;
                    var Case_StatusID = dataRecord.casestatusId;
                    Case_OrthancID = dataRecord.ID;

                    var CaseID = dataRecord.Case_ID;
                    var Case_ACC = dataRecord.Case_ACC;
                    var Case_OrthancStudyID = dataRecord.Case_OrthancStudyID;

                    $("#ManageCase").show();
                    $("#OrthancStudyID").val(Case_OrthancStudyID);

                    $("#ManageCase").focus();
                    $("#PHos").html(Hos_Name);
                    $("#PName").html(FullName);
                    $("#HCase").html(Case_StudyDescription);
                    $("#HProtocol").html(ProtocolName);
                    $("#HModality").html(Modality);
                    $("#vDStatus").html(CASE_STATUS_Name);
                    $("#sUrgentType").html(UGType_Name);
                    $("#sRights").html(TreatmentRights_Name);

                    $("#vCaseID").val(Case_ID);
                    $("#RightID").val(TreatmentRights_ID);
                    $("#UrgentTypeID").val(Case_UrgentType);
                    $("#TechID").val(Case_TechID);
                    $("#TechUID").val(TechUID);
                    $("#pRespone").val(Case_DocRespone);
                    $("#CaseStatus").val(Case_Status);

                    $("#vHN").html(Patient_HN);
                    $("#vSex").html(Patient_Sex);
                    $("#vAge").html(Patient_Age);
                    $("#vCitizenID").html(Patient_CitizenID);
                    $("#vPatientDoctor").html(Patient_RefferalDoctor);

                    $("#vDocFullName").val(Radiologist_FullName);

                    //$('#ViewCase').hide();
                    //$('#DownLoadCase').hide();

                    CheckCaseStatus(Case_Status);
                    FromTypecheck(Case_Status);
                    //SRAD_SEC_FILE(Case_ID);
                    gridTemplate(Case_DoctorID);
                    scrollToTop();
                    gridCasePatient(CaseID);
                    // CheckCaseRespones(CaseID);

                    //if(User_TypeID == "2"){

                    $("#GridCase").hide();
                    $("#HospitalDisPlay").hide();
                    $("#CaseActiveDisPlay").hide();
                }
            },
        },
        {
            text: "Reject", datafield: "Reject", align: "center", columntype: "button", width: 100,//columntype: 'text',cellsalign: "center",width: 60,rendered: tooltiprenderer,cellclassname: "btnReject",
            cellsrenderer: function (row) {
                //alert("this row is " + row+1);
                Editrow = row;
                var rowId = row.boundindex;
                var rowData = $("#gridCaseActive").jqxGrid("getrowdata", rowId);
                var dataRecord = $("#gridCaseActive").jqxGrid("getrowdata", Editrow);
                var Case_Status = dataRecord.casestatusId;

                if (Case_Status == "1") {
                    //return '<input type="button" onclick="rejects_case(event)" class="btn btn-danger btn-sm" id="btn-' + id + '" value="Reject"/>';
                    return "Reject";
                } else{
                    // $("div .jqx-grid-cell div .jqx-button span input #btn-Rejects").eq(row).css("display", "none");
                    return ' ';
                    
                }
            },

            buttonclick: function (row) {
                Editrow = row;
                var offset = $("#gridCaseActive").offset();

                var dataRecord = $("#gridCaseActive").jqxGrid("getrowdata", Editrow);
                var CaseID = dataRecord.Case_ID;
                var TechID = dataRecord.Case_TechID;
                var Case_Status = dataRecord.CS_Name_EN;
                var Hos_Name = dataRecord.Hos_Name;
                var Patient_Name = dataRecord.Patient_Name;
                var TechUID = dataRecord.TechUID;
                var DocFullName = dataRecord.DocFullName;
                var Modality = dataRecord.Modality;
                var Description = dataRecord.Case_StudyDESC;
                var ProtocolName = dataRecord.ProtocolName;

                if (Case_Status == "New") {
                    if (confirm("Do you want to reject case?")) {
                        let vMsgLine = "แพทย์รังสีปฏิเสธเคส" + "<br>" + "แพทย์รังสี : " + DocFullName + "<br>" + "โรงพยาบาล : " + Hos_Name + "<br>" + "คนไข้ : " + Patient_Name + "<br>" + "Modality : " + Modality + "<br>" + "Description : " + Description + "<br>" + "Protocol : " + ProtocolName;

                        UpdateStatusCase(CaseID, 3);
                        

                    }
                } else {
                    ShowNoti("Already Accepted", "warning");
                }
            },
        },
        { text: "Time", datafield: "Case_DateUpdate", align: "center", cellsalign: "center", width: 70, rendered: tooltiprenderer, cellsrenderer: Timecount, },
        { text: "สถานะ", datafield: "CS_Name_EN", align: "center", cellsalign: "center", filtertype: "checkedlist", rendered: tooltiprenderer, width: 100, },
        // { text: "สถานะ", datafield: "CS_Name_EN", align: "center", cellsalign: "center", filtertype: "checkedlist", cellsrenderer: cellsrenderer, rendered: tooltiprenderer, width: 100, },
        { text: "วันที่", datafield: "createdAt", align: "center", cellsalign: "center", cellsformat: "dd MMM yyyy HH:mm:ss", filtertype: "range", cellsrenderer: Timecellsrenderer , rendered: tooltiprenderer, width: 90, },
        { text: "โรงพยาบาล", datafield: "Hos_Name", align: "center", filtertype: "checkedlist", rendered: tooltiprenderer, width: 180, },
        { text: "#HN", datafield: "Patient_HN", rendered: tooltiprenderer, align: "center", width: 100, },
        { text: "ผู้รับการตรวจ", datafield: "FullName_EN", align: "center", rendered: tooltiprenderer, width: 250, },
        { text: "เพศ", datafield: "Patient_Sex", align: "center", cellsalign: "center", filtertype: "checkedlist", rendered: tooltiprenderer, width: 50, },
        { text: "อายุ", datafield: "Patient_Age", align: "center", cellsalign: "center", rendered: tooltiprenderer, width: 50, },
        { text: "รหัส", datafield: "Order_ID", align: "center", cellsalign: "center", width: 80, },
        { text: "รายการ", datafield: "Order_Detail", align: "center", minwidth: 200, },
        { text: "ราคา", datafield: "Order_Price", align: "center", cellsalign: "right", width: 70, rendered: tooltiprenderer, cellsformat: "c0", },
        { text: "DF แพทย์", datafield: "Order_DF", align: "center", cellsalign: "right", width: 80, rendered: tooltiprenderer, cellsformat: "c0", },
        { text: "Urgency", datafield: "UGType_Name", align: "center", cellsalign: "center", filtertype: "checkedlist", rendered: tooltiprenderer, width: 100, },
        { text: "Description", datafield: "Case_DESC", align: "center", rendered: tooltiprenderer, width: 120, },
        { text: "Protocol", datafield: "Case_ProtocolName", align: "center", rendered: tooltiprenderer, minwidth: 180, },
        { text: "Modality", datafield: "Case_Modality", align: "center", width: 70, rendered: tooltiprenderer, filtertype: "checkedlist", },
        ],
    });
    gridCaseActive(User_HosID);


    /////////////////////////////// New Custom Column /////////////////////////////////////

    var listSource = [{
        label: 'Row',
        value: 'Row',
        checked: true
    },
    {
        label: 'Accept',
        value: 'Accept',
        checked: true
    },
    {
        label: 'Reject',
        value: 'Reject',
        checked: true
    },
    {
        label: 'Time',
        value: 'Case_DateUpdate',
        checked: true
    },
    {
        label: 'สถานะ',
        value: 'CASE_STATUS_Name',
        checked: true
    },
    {
        label: 'วันที่',
        value: 'Case_DateUpdates',
        checked: true
    },
    {
        label: 'โรงพยาบาล',
        value: 'Hos_Name',
        checked: true
    },
    {
        label: '#HN',
        value: 'Patient_HN',
        checked: true
    },
    {
        label: 'ผู้รับการตรวจ',
        value: 'FullName',
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
    // {
    //     label: 'รหัส',
    //     value: 'Order_ID',
    //     checked: true
    // },
    // {
    //     label: 'รายการ',
    //     value: 'Order_Detail',
    //     checked: true
    // },
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
        label: 'Urgency',
        value: 'UG_Type_Name',
        checked: true
    },
    {
        label: 'Description',
        value: 'Case_StudyDESC',
        checked: true
    },
    {
        label: 'Protocol',
        value: 'ProtocolName',
        checked: true
    },
    {
        label: 'Modality',
        value: 'Modality',
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


    ////////////////////////////////////////////////////////////////////////////////////////////

    // $("#AcceptCase").on('click', function () {
    //     $("#ManageCase").hide();
    //     scrollToTop();

    //     if (Case_Status == '1') {
    //         SRAD_UPDATE_CASE_DOC(Case_ID, Case_TechID, User_ID, '2', '');
    //     } else {
    //         ShowNoti("Already Accepted", "warning");
    //     }

    // });



    $("#CancelCase").on("click", function () {
        // var CaseStatus = $("#CaseStatus").val();
        // AutoSaverespone(CaseStatus);
        gridCaseActive(User_HosID);

        $("#ManageCase").hide();
        scrollToTop();
        $("#DoctorID").val("");
        $("#TechID").val("");
        $("#vCaseID").val("");
        $("#RightID").val("");
        $("#sRights").html("");
        $("#GridCase").show();
        $("#HospitalDisPlay").show();
        $("#CaseActiveDisPlay").show();
    });

    $("#Respone").on("click", function () {
        var DataCase = JSON.parse($("#dataRecord").val());
        var CaseID = $("#vCaseID").val();
        var TechID = $("#TechID").val();
        var DoctorID = $("#DoctorID").val();
        var txtRespone = $("#pRespone").val();
        var vTechUID = $("#TechUID").val();
        var vDocFullName = $("#vDocFullName").val();
        var vHosName = $("#PHos").html();
        var Patient_Name = $("#PName").html();
        var Modality = $("#HModality").html();
        var Description = $("#HCase").html();
        var ProtocolName = $("#HProtocol").html();
        // let vMsgLine ="แพทย์รังสีส่งผลอ่าน" +"<br>" +"แพทย์รังสี : " +vDocFullName +"<br>" +"โรงพยาบาล : " +vHosName +"<br>" +"คนไข้ : " +Patient_Name +"<br>" +"Modality : " +Modality +"<br>" +"Description : " +Description +"<br>" +"Protocol : " +ProtocolName;

        // LineNotiMsg(vTechUID, vMsgLine);
        // SRAD_UPDATE_CASE_DOC(CaseID, TechID, User_ID, "3", txtRespone);

        var caseid = DataCase.Case_ID;
        var radioid = DataCase.Case_RadiologistId;

        // console.log("caseid = " + caseid + " radioid = " + radioid + " txtRespone = " + txtRespone );

        var Promise_AddCaseRespones = AddCaseRespones(caseid, radioid ,txtRespone);

        Promise_AddCaseRespones.then( (data) => {
            var promise_addcaseresponses = JSON.parse($("#dataRecord").val());
            if(data.status.code === 200){
                ShowNoti("ส่งผลอ่านของผลงาน", "success");
            }
        });

    });

    $("#DownLoadCase").on("click", function () {
        var url =
            "http://Radconnext:R@dconnext@103.91.189.94:8042/patients/" +
            Case_OrthancID +
            "/archive";
        openInNewTab(url);
    });

    $("#gridFileUpdate").jqxGrid({
        width: "100%",
        height: 185,
        //pageable: true,
        //pagerButtonsCount: 10,
        columnsResize: true,
        altrows: true,
        scrollmode: "logical",
        //autoheight: true,
        //showstatusbar: true,
        theme: theme,
        columns: [{
            text: "View",
            datafield: "View",
            columntype: "button",
            cellsalign: "center",
            width: 50,
            cellsrenderer: function () {
                return "Load";
            },
            buttonclick: function (row) {
                Editrow = row;
                var offset = $("#gridFileUpdate").offset();

                var dataRecord = $("#gridFileUpdate").jqxGrid("getrowdata", Editrow);
                var vImage = dataRecord.Result_Path_IMG;

                var url = vImage;
                document.getElementById("vShowImg").src = url;
                openInNewTab(url);
            },
        },
        {
            text: "ไฟล์",
            datafield: "Result_CASE_FileName",
            align: "center",
            minwidth: 50,
        },
        {
            text: "วันที่",
            datafield: "Result_CASE_DateUpdate",
            align: "center",
            width: 150,
        },
        ],
    });

    $("#gridFileUpdate").on("rowselect", function (event) {
        var vImage = event.args.row.Result_Path_IMG;
        var url = vImage;
        document.getElementById("vShowImg").src = url;
    });


    $("#AWaitAccept").change(function functionName() {
        if (User_TypeID == "2") {
            ShowNoti("You have a new case wait accept.", "warning");
        }
    });

    //console.log(vRadiantPaht);
    //$("#RadiantPaht").val(vRadiantPaht);
    $("#Radiant").click(function functionName() {
        var RDA = $("#RadiantPaht").val();
        var url = "radiant://?n=f&v=" + RDA + "\\" + Case_OrthancID + ".zip";
        console.log(url);
        window.open(url, "_top");
    });

    $("#TemplateTab").on("click", function () {
        if ($("#gridTemplate").height() > 40) {
            $("#gridTemplate").height(30);
        } else {
            $("#gridTemplate").height(320);
        }
    });

    $("#gridTemplate").jqxGrid({
        width: "100%",
        height: 320,
        sortable: true,
        filterable: true,
        //showfilterrow: true,
        //showstatusbar: true,
        autoShowLoadElement: false,
        theme: theme,
        columns: [{
            text: "Template",
            datafield: "Template_Code",
            align: "center",
            minwidth: 100,
        },],
    });

    $("#gridTemplate").on("rowselect", function (event) {
        let pRow = event.args.row;
        // row.Template_ID = data.Records[i].id;
        // row.Template_Code = data.Records[i].Name;
        // row.User_ID = data.Records[i].userId;
        // row.Content = data.Records[i].Content;
        var Template_Text = pRow.Content;
        var Template_Code = pRow.Template_Code;

        var vText = $("#pRespone").val();
        if (vText == "") {
            $("#pRespone").val(Template_Text);
        } else {
            $("#pRespone").val(vText + "\n\n" + Template_Text);
        }
        // ShowNoti("เพิ่ม " + Template_Code + " เสร็จสิ้น", "success");
    });

    // $("#pRespone").on("click", function () {
    //     $("#gridTemplate").jqxGrid("clearselection");
    // });

    /// Assign Height 10Sep2563 ////

    $("#HistoryTab").on("click", function () {
        if ($("#gridCasePatient").height() > 400) {
            $("#gridCasePatient").jqxGrid({ height: 250 });
        } else {
            $("#gridCasePatient").jqxGrid({ height: 500 });
        }
    });



    ////////////////////////// New Editor //////////////////////////////////////
    $('#pRespone').jqxEditor({
        height: 320,
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
                            $('#pRespone').val('');
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
                            return { command: "inserthtml", value: widgetValue == "Insert Time" ? date.getHours() + ":" + date.getMinutes() : date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() };
                        }
                    };
                case "template":
                    return {
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
                            if ($("#gridTemplate").height() > 40) {
                                $("#gridTemplate").height(30);
                            } else {
                                $("#gridTemplate").height(320);
                            }
                        }
                    };
                case "zoom":
                    // var current_height = 318;
                    // var current_width = 1022.5; //$('#pRespone').width(); 
                    // var new_height;
                    // var new_width;
                    return {
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
                            $('#pRespone').jqxEditor('print');
                        }
                    };
            }
        },
    });

    ////////////////////////////////////////////////////////////////////////////

    $("#gridCasePatient").jqxGrid({
        width: "100%",
        height: 250, //// Default 550
        sortable: true,
        altrows: true,
        filterable: true,
        showfilterrow: true,
        //showstatusbar: true,
        //statusbarheight: 24,
        //showaggregates: true,
        autorowheight: true,
        columnsresize: true,
        columnsreorder: true,
        pageable: true,
        pagesize: 10,
        scrollmode: "logical",
        autoShowLoadElement: false,
        pagesizeoptions: ["10", "20", "50", "100", "500"],
        theme: theme,
        columns: [{text: "#",datafield: "Row",align: "center",cellsalign: "center",rendered: tooltiprenderer,width: 35,},
        {text: "สถานะ",datafield: "CS_Name_EN",align: "center",cellsalign: "center",filtertype: "checkedlist",rendered: tooltiprenderer,width: 100,},
        {text: "วันที่",datafield: "createdAt",align: "center",cellsalign: "center",cellsformat: "dd MMM yyyy HH:mm:ss", filtertype: "range", cellsrenderer: Timecellsrenderer , rendered: tooltiprenderer,width: 90,},
        {text: "โรงพยาบาล",datafield: "Hos_Name",align: "center",filtertype: "checkedlist",rendered: tooltiprenderer,width: 180,},
        {text: "#HN",datafield: "Patient_HN",align: "center",rendered: tooltiprenderer,width: 100,},
        {text: "ผู้รับการตรวจ",datafield: "FullName_EN",align: "center",rendered: tooltiprenderer,width: 250,},
        {text: "เพศ",datafield: "Patient_Sex",align: "center",cellsalign: "center",filtertype: "checkedlist",rendered: tooltiprenderer,width: 50,},
        {text: "อายุ",datafield: "Patient_Age",align: "center",cellsalign: "center",rendered: tooltiprenderer,width: 50,},
        {text: "รหัส",datafield: "Order_ID",align: "center",cellsalign: "center",rendered: tooltiprenderer,width: 80,},
        {text: "รายการ",datafield: "Order_Detail",align: "center",rendered: tooltiprenderer,minwidth: 200,},
        //{ text: 'ราคา', datafield: 'Order_Price', align: 'center', cellsalign: 'right', width: 70, cellsformat: 'c0'},
        //{ text: 'DF แพทย์', datafield: 'Order_DF', align: 'center', cellsalign: 'right', width: 80, cellsformat: 'c0'},
        //{ text: 'Urgency', datafield: 'UG_Type_Name', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', width: 100},
        {text: "Description",datafield: "Case_DESC",align: "center",rendered: tooltiprenderer,width: 120,},
        {text: "Protocol",datafield: "Case_ProtocolName",align: "center",rendered: tooltiprenderer,minwidth: 180,},
        {text: "Modality",datafield: "Case_Modality",align: "center",width: 70,rendered: tooltiprenderer,filtertype: "checkedlist",},
        {text: "เปิดภาพ",datafield: "View",align: "center",columntype: "button",cellsalign: "center",rendered: tooltiprenderer,width: 60,
            cellsrenderer: function (row) {
                return "เปิดภาพ";
            },
            buttonclick: function (row) {
                var PromiseInstance = getInstance(User_HosID);
                //const PromiseGetPort = GetPort(instanceID);
                PromiseInstance.then((data) => {
                    // console.log("data viewcase: " + data);
                    var baseurl = "";
                    var local_url = "";
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
            },
        },
        {text: "โหลด",datafield: "Load",align: "center",columntype: "button",cellsalign: "center",rendered: tooltiprenderer,width: 60,
            cellsrenderer: function (row) {
                return "โหลด";
            },
            buttonclick: function (row) {
                Editrow = row;
                var offset = $("#gridCasePatient").offset();

                var dataRecord = $("#gridCasePatient").jqxGrid("getrowdata", Editrow);
                var Case_OrthancID = dataRecord.Case_OrthancID;

                var url =
                    "http://Radconnext:R@dconnext@103.91.189.94:8042/patients/" +
                    Case_OrthancID +
                    "/archive";
                openInNewTab(url);
            },
        },
        {text: "ผลอ่าน",datafield: "DocResp", align: "center",columntype: "button",cellsalign: "center",rendered: tooltiprenderer,width: 60,
            cellsrenderer: function (row) {
                return "ผลอ่าน";
            },
            buttonclick: function (row) {
                Editrow = row;
                var offset = $("#gridCasePatient").offset();

                var dataRecord = $("#gridCasePatient").jqxGrid("getrowdata", Editrow);
                var CaseID = dataRecord.Case_ID;

                var url = "sapi/rad_report.php?CaseID=" + CaseID;
                openInNewTab(url);
            },
        },
    ],});

    
    $("#ViewCase").on('click', function () {
        var PromiseInstance = getInstance(User_HosID);
        //const PromiseGetPort = GetPort(instanceID);
        PromiseInstance.then( (data) => {
            // console.log("data viewcase: " + data);
            var baseurl = "";
            if(window.location.hostname == "localhost") {
                baseurl = "202.28.68.28";
            }
            var local_url = 'http://' + baseurl + ':' + data.port + '/stone-webviewer/index.html?study=';
            var orthancwebapplink = local_url + data.MainDicomTags.StudyInstanceUID;
            console.log("orthancwebapplink = " + orthancwebapplink);
            window.open(orthancwebapplink, '_blank');
            //openInNewTab(url);
        }).catch(function (error){
            console.log("error in ViewCase = " + error);
        });
    });
}

function CheckCaseStatus(Case_Status) {
    if (Case_Status != "0" && (User_TypeID == "4" || User_TypeID == "1")) {
        $("#frmSaveCase").hide();
    } else {
        $("#frmSaveCase").show();
    }
}

function scrollToTop() {
    // $('#gridCaseActive').jqxGrid('clearselection');
    window.scrollTo(0, 0);
}

function openInNewTab(url) {
    var win = window.open(url, "_blank");
    win.focus();
}

async function gridCaseActive(Hos_ID) {
    var caseReadWaitStatus = [1,2,3,4,7];
    var caseReadSuccessStatus = [5,6];
    var caseAllStatus = [1,2,3,4,5,6,7];
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "gridCaseActive";
    var params = { hospitalId: Hos_ID, userId: User_ID, statusId: caseAllStatus };
    return new Promise(function (resolve, reject) {
        // console.log("function_name : " + function_name + " => start");
        var url = "/api/cases/filter/radio";
        $.post(url, params, function (data) {
            // console.log("data = " + JSON.stringify(data));

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
                    // row.Case_PatientHRLink = data.Records[i].case.Case_PatientHRLink;
                    row.Case_RadiologistId = data.Records[i].case.Case_RadiologistId;
                    row.Case_RefferalId = data.Records[i].case.Case_RefferalId;
                    row.Case_RefferalName = data.Records[i].case.Case_RefferalName;
                    row.Case_Department = data.Records[i].case.Case_Department;
                    row.Case_Price = data.Records[i].case.Case_Price;
                    row.Case_DESC = data.Records[i].case.Case_DESC;
                    row.createdAt = data.Records[i].case.createdAt;
                    row.updatedAt = data.Records[i].case.updatedAt;
                    row.hospitalId = data.Records[i].case.hospitalId;
                    row.patientId = data.Records[i].case.patientId;
                    row.urgenttypeId = data.Records[i].case.urgenttypeId;
                    row.cliamerightId = data.Records[i].case.cliamerightId;
                    row.casestatusId = data.Records[i].case.casestatusId;
                    row.TechID = data.Records[i].case.userId;
                    row.Hos_Name = data.Records[i].case.hospital.Hos_Name;

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
                    // row.hospitalId = data.Records[i].case.patient.hospitalId;
                    row.casestatus_ID = data.Records[i].case.casestatus.id;
                    row.CS_Name_EN = data.Records[i].case.casestatus.CS_Name_EN;
                    row.urgenttype_ID = data.Records[i].case.urgenttype.id;
                    row.UGType_Name = data.Records[i].case.urgenttype.UGType_Name;

                    row.Order_Detail = "";
                    row.Order_Price = "";
                    row.Order_DF = "";

                    try{
                        var TimeTriggerAt = GetTimeInTaskappCaseIdAPI(data.Records[i].case.id);
                    }catch(e){
                        console.log('error TimeTriggerAt: ' + e);
                    }
                    
                    // console.log('i: ' +i+ ' data:' + JSON.stringify(data));
                    if(TimeTriggerAt){
                        row.deadline = TimeTriggerAt;
                        //console.log('i: ' +i+ ' data:' + JSON.stringify(data));
                    }else{
                        row.deadline = new Date();
                    }

                    // row.Radiologist_ID = data.Records[i].Radiologist.id;
                    // row.Radiologist_User_NameTH = data.Records[i].Radiologist.User_NameTH;
                    // row.Radiologist_User_LastNameTH = data.Records[i].Radiologist.User_LastNameTH;

                    row.Refferal_ID = data.Records[i].reff.id;
                    row.Refferal_User_NameTH = data.Records[i].reff.User_NameTH;
                    row.Refferal_User_LastNameTH = data.Records[i].reff.User_LastNameTH;

                    row.FullName_EN = data.Records[i].case.patient.Patient_NameEN + " " + data.Records[i].case.patient.Patient_LastNameEN;
                    row.FullName_TH = data.Records[i].case.patient.Patient_NameTH + " " + data.Records[i].case.patient.Patient_LastNameTH;
                    row.Patient_RefferalDoctor = data.Records[i].reff.User_NameTH + " " + data.Records[i].reff.User_LastNameTH;
                    //row.Patient_RadiologistDoctor = data.Records[i].Radiologist.User_NameTH + " " + data.Records[i].Radiologist.User_LastNameTH;

                    databases[i] = row;
                }

                var source =
                {
                    localdata: databases,
                    datatype: "array",
                };


                // console.log("source in gridCaseActive : " + JSON.stringify(source) );

                var dataAdapter = new $.jqx.dataAdapter(source);
                try {
                    $("#gridCaseActive").jqxGrid({ source: dataAdapter });
                    $('#gridCaseActive').jqxGrid('clearselection');
                    $("#gridcase").val(JSON.stringify(data));
                    jqxTooltipGridActive();
                } catch (e) {
                    console.log("Error : " + e);
                    //location.reload();
                }
                // console.log("function_name : " + function_name + " => end");

            } else {
                console.log("Else in Result = OK ");
                //log.info("error: " + data.error);
            }
        });
    });
}

function gridCasePatient(case_Id) {
    
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "gridCasePatient";
    var caseId = case_Id;
    var params = { caseId: caseId};
    return new Promise(function (resolve, reject) {
        // console.log("function_name : " + function_name + " => start");
        var url = "/api/cases/select/"+ caseId;
        $.post(url, params, function (data) {
            // console.log("data = " + JSON.stringify(data));
            var databases = new Array();
            if(data.status.code === 200){
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

                    row.Order_Detail = "";
                    row.Order_Price = "";
                    row.Order_DF = "";

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

                // console.log("source : " + source);

                var dataAdapter = new $.jqx.dataAdapter(source);

                try {
                    $("#gridCasePatient").jqxGrid({ source: dataAdapter });
                    // $('#gridCasePatient').jqxGrid('clearselection');
                    AddTooltip();
                    console.log('success to get data ');
                } catch (e) {
                    console.log("Error : " + e);
                    //location.reload();
                }
                console.log("function_name : " + function_name + " => end");

            } else {
                console.log("Else in Result = OK ");
                //log.info("error: " + data.error);
            }

        });
    });
}

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
                //ShowNoti('สร้าง Template สำเร็จ', "Success");
                //$("#NotificatedChangeInfoUser").text("ดึงข้อมูลTemplateไม่สำเร็จ กรุณาตรวจสอบใหม่");
            }
        });
    });
}

function SRAD_SEC_FILE(CaseID) {
    var act = "SRAD_SEC_FILE";
    var url = "sapi/api.class.php?action=" + act;
    //ar CaseID = $("#vCaseID").val();
    var pData = {
        Case_ID: CaseID,
    };

    var source = {
        type: "GET",
        datatype: "json",
        datafields: [{
            name: "Result_CASE_ID",
            type: "number",
        },
        {
            name: "CASE_ID",
            type: "number",
        },
        {
            name: "Result_CASE_FileName",
            type: "string",
        },
        {
            name: "Result_CASE_Type",
            type: "string",
        },
        {
            name: "Result_CASE_Size",
            type: "string",
        },
        {
            name: "Result_Path_IMG",
            type: "string",
        },
        {
            name: "Result_CASE_DateUpdate",
            type: "string",
        },
        ],
        url: url,
        data: pData,
    };

    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#gridFileUpdate").jqxGrid({
        source: dataAdapter,
    });
}

// function SRAD_UPDATE_CASE_DOC(
//     CaseID,
//     TechID,
//     DoctorID,
//     CaseStatus,
//     Case_DocRespone
// ) {
//     var act = "SRAD_UPDATE_CASE_DOC";
//     var url = "sapi/api.class.php?action=" + act;
//     var pData = {
//         CaseID: CaseID,
//         TechID: TechID,
//         DoctorID: DoctorID,
//         CaseStatus: CaseStatus,
//         CaseDocRespone: Case_DocRespone,
//     };

//     $.ajax({
//         type: "POST",
//         url: url,
//         dataType: "json",
//         data: pData,
//         success: function (data) {
//             if (data.Response == "success") {
//                 var vResult = data.data[0].Result;
//                 var vMsg = data.data[0].Msg;

//                 if (vResult == "Success") {
//                     ShowNoti(vMsg, "success");

//                     if (CaseStatus == "1") {
//                         $("#frmSaveCase").hide();
//                     }

//                     $("#DoctorID").val("");
//                     $("#TechID").val("");
//                     $("#vCaseID").val("");
//                     $("#RightID").val("");
//                     $("#sRights").html("");
//                     $("#ManageCase").hide();
//                     $("#GridCase").show();
//                     $("#HospitalDisPlay").show();
//                     $("#CaseActiveDisPlay").show();
//                     let vModality = $("#HModality").html();
//                     let vHCase = $("#HCase").html();
//                     let vHProtocol = $("#HProtocol").html();
//                     let vHHopital = $("#PHos").html();
//                     let vUrgentType = $("#sUrgentType").html();
//                     let vPatientName = $("#vName").val() + " " + $("#vLName").val();
//                     let vCaseID = $("#vCaseID").html();

//                     let vDocUID = $("#vDoc_UID").val();
//                     let vMsgLine =
//                         "แพทย์รังสีตอบผล" +
//                         "<br>" +
//                         "แพทย์รังสี : " +
//                         DocFullName +
//                         "<br>" +
//                         "โรงพยาบาล : " +
//                         Hos_Name +
//                         "<br>" +
//                         "คนไข้ : " +
//                         Patient_Name +
//                         "<br>" +
//                         "Modality : " +
//                         Modality +
//                         "<br>" +
//                         "Description : " +
//                         Description +
//                         "<br>" +
//                         "Protocol : " +
//                         ProtocolName;

//                     LineNotiMsg(vDocUID, vMsgLine);

//                     gridCaseActive(User_HosID);
//                 } else {
//                     ShowNoti(vResult, "danger");
//                 }
//             }
//         },
//     });
// }

function FromTypecheck(Case_Status) {
    if (User_TypeID == "2") {
        $("#frmSaveCase").hide();
        $("#frmRespone").hide();
        $("#pRespone").jqxEditor({
            disabled: true,
        });

        $("#PMFileImage").hide();
        $("#DMFileImage").show();

        if (Case_Status == "2" || Case_Status == "3") {
            $("#frmAccept").hide();
            $("#frmCancelAccept").hide();
        } else {
            $("#frmAccept").show();
            $("#frmCancelAccept").show();
        }

        if (Case_Status == "2") {
            $('#ViewCase').show();
            $('#DownLoadCase').show();
            $("#frmRespone").show();
            $("#pRespone").jqxEditor({
                disabled: false,
            });
        }
    } else {
        $("#frmAccept").hide();
        $("#frmCancelAccept").hide();
        $("#PMFileImage").show();
        $("#DMFileImage").hide();
    }

    if (Case_Status != "0") {
        $("#vMtypeDetail").hide();
    } else {
        $("#frmAccept").hide();
        $("#frmCancelAccept").hide();
    }
}

function ShowNoti(Msg, Type) {
    $("#MessageNoti").html(Msg);
    $("#Notification").jqxNotification({
        height: "75px",
        width: "200px",
        template: Type,
        autoOpen: true,
        autoClose: true,
    });
    $("#Notification").jqxNotification("open");
}

$("#UploadImage").click(function () {
    //$('#UploadImage').jqxInput({disabled: true });
    var _file = document.getElementById("vFileImage");
    var CaseID = $("#vCaseID").val();
    var data = new FormData();
    data.append("filUpload", _file.files[0]);

    var act = "SRAD_Upload";
    $.ajax({
        url: "sapi/api.img.class.php?action=" + act + "&Case_ID=" + CaseID,
        data: data,
        type: "POST",
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (data) {
            var vResponse = data.Response;
            var vMsg = data.data[0].Msg;
            if (vResponse == "success") {
                ShowNoti(vMsg, vResponse);
                $("#vFileImage").val("");
                SRAD_SEC_FILE(CaseID);
            } else {
                ShowNoti(vMsg, "warning");
                $("#vFileImage").val("");
            }
        },
    });
});

// function AutoSaverespone(Case_Status) {
//     var CaseID = $("#vCaseID").val();
//     var TechID = $("#TechID").val();
//     var DoctorID = $("#DoctorID").val();
//     var txtRespone = $("#pRespone").val();

//     if (CaseID != "" && Case_Status == "2") {
//         SRAD_UPDATE_CASE_DOC_AUTO(CaseID, TechID, User_ID, "2", txtRespone);
//     }
// }

function PreviewImage() {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    //var PromiseGetLocalFile2 = getLocalFile2(Hos_ID);
    var function_name = "PreviewImage";
    var params = {username: UserNameID };
    var url = "/api/orthancproxy/orthancexternalport";
    return new Promise(function(resolve, reject) {
        // console.log("function_name : " + function_name + " => start");
        $.get(url, params, function(data){
            console.log("data = " + data);
            resolve(data);
        }).fail(function(error) {
            // console.log("error = " + error);
            reject(error);
        });
        // console.log("function_name : " + function_name + " => end");
    });
};


function GetPort() {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    //var PromiseGetLocalFile2 = getLocalFile2(Hos_ID);
    var function_name = "GetPort";
    var params = {username: UserNameID };
    var url = "/api/orthancproxy/orthancexternalport";
    return new Promise(function(resolve, reject) {
        // console.log("function_name : " + function_name + " => start");
        $.get(url, params, function(data){
            console.log("data = " + data);
            resolve(data);
        }).fail(function(error) {
            // console.log("error = " + error);
            reject(error);
        });
        // console.log("function_name : " + function_name + " => end");
    });
};

function getInstance(Hos_ID){
    var OrthancStudyID = $("#OrthancStudyID").val();
    var orthancUri = '/studies/';
    return new Promise(function(resolve, reject) {
        var doCallGetPort = GetPort();
        doCallGetPort.then( (data) => {
            var ports = data.port;
            var orthancUri = '/studies/' + OrthancStudyID;
            var queryStr = "";
            var params = {method:'get', uri: orthancUri, body: queryStr, hospitalId: Hos_ID};
            var url = "/api/orthancproxy/find";
            $.post(url, params, function(data2){
                data2.port = ports;
                console.log("data2 = " + JSON.stringify(data2) );
                resolve(data2);
            }).fail(function(error) {
                // console.log("error = " + error);
                reject(error);
            });
        });
    });
}

function loadarchiveOrthanC(Hos_ID){
    var OrthancStudyID = $("#OrthancStudyID").val();
    //var orthancUri = '/loadarchive/';
    return new Promise(function(resolve, reject) {
        var doCallGetPort = GetPort();
        doCallGetPort.then( (data) => {
            var ports = data.port;
            var orthancUri = '/loadarchive/' + OrthancStudyID;
            var queryStr = "";
            var params = {method:'post', uri: orthancUri, body: queryStr, hospitalId: Hos_ID, username:UserNameID};
            var url = "/api/orthancproxy/loadarchive/"+ OrthancStudyID;
            $.post(url, params, function(data2){
                data2.port = ports;
                
                var baseurl = "";
                var local_url = "";
                if (window.location.hostname == "localhost") {
                    baseurl = "202.28.68.28";
                }else{
                    baseurl = window.location.host.split(":")[0];
                }
                local_url = 'http://' + baseurl + ':' + data.port + '/stone-webviewer/index.html?study=';
                var orthancwebapplink = local_url + data.MainDicomTags.StudyInstanceUID;
                console.log("orthancwebapplink = " + orthancwebapplink);
                window.open(orthancwebapplink, '_blank');

                console.log("data2 = " + JSON.stringify(data2) );
                resolve(data2);
            }).fail(function(error) {
                // console.log("error = " + error);
                reject(error);
            });
        });
    });
}



function jqxTooltipGridActive(){
    setTimeout(function () {
        /////////////////// New Code jqxTooltip //////////////////////////////////////////////////
        $("#ViewCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'เปิดภาพ' });
        $("#Radiant").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Radiant' });
        $("#DownLoadCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ดาวน์โหลด' });
        $("#AcceptCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'รับอ่านผล' });
        $("#Reject").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ปฏิเสธ' });
        $("#Respone").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ส่งผลอ่าน' });
        $("#CancelCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ออก' });
        $("#openButton").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ตั้งค่าการแสดง column' });
        $("#HistoryTab").jqxTooltip({ showDelay: 1000, position: 'top', content: 'คลิกเพื่อแสดงประวัติการตรวจทั้งหมด' });
        $("#TemplateTab").jqxTooltip({ showDelay: 1000, position: 'top', content: 'คลิกเพื่อซ่อนหรือแสดงเทมเพลตทั้งหมด' });

        // $("#columntablegridCaseActive").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง' });
        $("#row00gridCaseActive").children().eq(5).jqxTooltip({ showDelay: 1000, position: 'top', content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง' });
        $("#row00gridCaseActive").children().eq(7).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(8).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(10).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(11).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(12).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(15).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(16).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });


        // $("#row00gridCasePatient").children().eq(2).jqxTooltip({ showDelay: 1000, position: 'top', content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง' });
        // $("#row00gridCasePatient").children().eq(4).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCasePatient").children().eq(5).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCasePatient").children().eq(7).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCasePatient").children().eq(8).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCasePatient").children().eq(9).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCasePatient").children().eq(10).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCasePatient").children().eq(11).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
    }, 3000);
}

function CheckCaseRespones(CaseID){
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "CheckCaseRespones";
    var params = {caseId : CaseID};
    var url = "/api/caseresponse/list" ;
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        $.post(url, params, function (data) {
            console.log("data in function "+ function_name + " = " + JSON.stringify(data));
            if(data.Result == 'OK' || data.status.code === 200){
                console.log("Success get data in " + function_name);
                resolve(data);
            }else{
                console.log("Error in Get Data " + function_name);
                reject(data);
            }
        });
    });
}

function UpdateCase(CaseID, casestatusID){
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "UpdateCase";
    var datainfo = JSON.parse($("#dataRecord").val());
    var new_data = doPrepareCaseParams_Update($("#dataRecord").val());
    datainfo.casestatusId = casestatusID;
    datainfo.casestatus_ID = casestatusID;
    console.log("new_data in function: " + function_name + " having => " + JSON.stringify(new_data) );
    //var patientdata = JSON.parse($("#SearchPatientData").val());
    var VcliamerightId = datainfo.cliamerightId;
    var VpatientId = datainfo.patient_ID;
    var VuserId = datainfo.Case_RadiologistId;
    var VurgenttypeId = datainfo.urgenttypeId;
    // let setupCaseTo = { hospitalId: req.body.hospitalId, patientId: req.body.patientId, userId: req.body.userId,
    //      cliamerightId: req.body.cliamerightId, urgenttypeId: req.body.urgenttypeId};
    var params = {id:CaseID, casestatusId:casestatusID, userId: VuserId ,hospitalId: User_HosID, 
        patientId: VpatientId, data: new_data, urgenttypeId: VurgenttypeId, cliamerightId: VcliamerightId};
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url = "/api/cases/update" ;
        $.post(url, params, function (data) {
            console.log("data in function "+ function_name + " = " + JSON.stringify(data));
            if(data.Result == 'OK'){

                resolve(data);
                console.log("Success get data in " + function_name);
            }else{
                reject(data);
                console.log("Error in Get Data " + function_name);
            }
        });
    });
}

function UpdateStatusCase(CaseID, casestatusID, UGTypeID){
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "UpdateStatusCase";
    var url = "/api/cases/status/" + CaseID ;
    let params = {caseId: CaseID,casestatusId: casestatusID, caseDescription: "", urgenttypeId: UGTypeID};

    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        $.post(url, params, function (data) {
            console.log("data in function "+ function_name + " = " + JSON.stringify(data));
            if(data.Result == 'OK'){
                resolve(data);
                console.log("Success get data in " + function_name);
                gridCaseActive(User_HosID);
            }else{
                reject(data);
                console.log("Error in Get Data " + function_name);
            }
        });
    });
}

function doPrepareCaseParams_Update(CaseData) {
    let rqParams = {};
    var CaseData_new = JSON.parse(CaseData);
    rqParams.Case_OrthancStudyID = CaseData_new.Case_OrthancStudyID;
    rqParams.Case_ACC = CaseData_new.Case_ACC;
    rqParams.Case_BodyPart = CaseData_new.Case_BodyPart;
    rqParams.Case_Modality = CaseData_new.Case_Modality;
    rqParams.Case_Manufacturer = CaseData_new.Case_Manufacturer;
    rqParams.Case_ProtocolName = CaseData_new.Case_ProtocolName;
    rqParams.Case_StudyDescription  = CaseData_new.Case_StudyDescription;
    rqParams.Case_StationName = CaseData_new.Case_StationName;
    // rqParams.OperatorsName = CaseData_new.OperatorsName;
    // rqParams.PerformedProcedureStepDescription = CaseData_new.PerformedProcedureStepDescription;
    // rqParams.SeriesDescription = CaseData_new.SeriesDescription;
    rqParams.Case_PatientHRLink = patientHistoryBox.images();
    // rqParams.SeriesInstanceUID = CaseData_new.SeriesInstanceUID;
    // rqParams.StudyInstanceUID = CaseData_new.StudyInstanceUID;
    // rqParams.StudyDate = CaseData_new.StudyDate;
    // rqParams.StudyTime = CaseData_new.StudyTime;
    // rqParams.PatientName = CaseData_new.PatientName;
    rqParams.Case_RadiologistId = CaseData_new.Case_RadiologistId;
    rqParams.Case_RefferalId = CaseData_new.Case_RefferalId;
    rqParams.Case_RefferalName = CaseData_new.Case_RefferalName;
    if(CaseData_new.Case_Department == ''){
        rqParams.Case_Department = "0";
    }else{
        rqParams.Case_Department = CaseData_new.Case_Department;
    }
    if(CaseData_new.Order_Detail == ''){
        rqParams.Case_DESC = "ไม่มี";
    }else{
        rqParams.Case_DESC = CaseData_new.Order_Detail;
    }
    if(CaseData_new.Case_Price == ''){
        rqParams.Case_Price = "0";
    }else{
        rqParams.Case_Price = CaseData_new.Case_Price;
    }
    rqParams.userId = CaseData_new.Case_RadiologistId;
    rqParams.hospitalId = User_HosID;
    rqParams.patientId = CaseData_new.patientId;
    rqParams.urgenttypeId = CaseData_new.urgenttypeId;
    rqParams.cliamerightId = CaseData_new.cliamerightId;
    rqParams.casestatusId = CaseData_new.casestatusId;
    return rqParams;
}

//AddCaseRespones(DataCase.Case_ID, DataCase.Case_RadiologistId ,txtRespone);
function AddCaseRespones(CaseID, RadioID, TextArea){
    // $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    //var PatientAddCaseRespones = JSON.parse($("#PatientData").val());
    var function_name = "AddCaseRespones";
    var params = {caseId : CaseID, userId: RadioID, data: { Response_Text :TextArea}};
    var url = "/api/caseresponse/add" ;
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        $.post(url, params, function (data) {
            console.log("data in function "+ function_name + " = " + JSON.stringify(data));
            if(data.Result == 'OK' || data.status.code === 200){
                console.log("Success get data in " + function_name);
                resolve(data);
            }else{
                console.log("Error in Get Data " + function_name);
                reject(data);
            }
        });
    });
}

function doPreparePatientParams(PatientData){
    let rqParams = {};
    var names = PatientData.PatientName;
    rqParams.Patient_NameEN = "";
    rqParams.Patient_LastNameEN = "";
    if(names.split(" ").length > 1 ){
        rqParams.Patient_NameEN = names.split(" ")[0];
        rqParams.Patient_LastNameEN = names.split(" ")[1];
    }else if(names.split("^").length > 1 ){
        rqParams.Patient_NameEN = names.split("^")[0];
        rqParams.Patient_LastNameEN = names.split("^")[1];
    }else{
        rqParams.Patient_NameEN = names;
        rqParams.Patient_LastNameEN = names;
    }
    rqParams.Patient_HN = PatientData.PatientID;
    rqParams.Patient_NameTH = '';
    rqParams.Patient_LastNameTH = '';
    // rqParams.Patient_NameEN = newCaseData.patientNameEN;
    rqParams.Patient_CitizenID = $("#vCitizenID").val();
    rqParams.Patient_Birthday = moment(new Date($("#Calendar").val())).format("YYYYMMDD");
    rqParams.Patient_Age = $("#PatientAge").val();
    rqParams.Patient_Sex = PatientData.PatientSex;
    rqParams.Patient_Tel = PatientData.Patient_Tel;
    rqParams.Patient_Address = PatientData.Patient_Address;
    rqParams.ParentPatient = PatientData.ParentPatient;
    rqParams.ParentStudy = PatientData.ParentStudy;
    return rqParams;
}

function AddTooltip(){
    setTimeout(function () {
        $("#row00gridCasePatient").children().eq(2).jqxTooltip({ showDelay: 1000, position: 'top', content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง' });
        $("#row00gridCasePatient").children().eq(4).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCasePatient").children().eq(5).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCasePatient").children().eq(7).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCasePatient").children().eq(8).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCasePatient").children().eq(9).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCasePatient").children().eq(10).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCasePatient").children().eq(11).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
    }, 2000);
}

module.exports ={
    Start_CaseActiveDoctor
}