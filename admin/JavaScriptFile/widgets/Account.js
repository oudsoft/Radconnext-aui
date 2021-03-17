$(document).ready(function () {

    var theme = 'energyblue';
    
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});

    vTotalCase = $('#sTotalCase').html();
    vNewCase = $('#sNewCase').html();
    vWaitAccept = $('#AWaitAccept').html();
    vAccepted = $('#AAccepted').html();
    $("#ManageCase").hide();
    $('#vMtypeDetail').hide();
    $('#frmRenewCase').hide();

    var Case_ID;
    var Case_Status;
    var Case_TechID;
    var Case_OrthancID;
    var m = '0';
    var Y = '0';
    var vDate = Y + m;
    //LoopLoad(vTotalCase, vNewCase, vDate);

    var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        Editrow = row;
        var offset = $("#gridCaseActive").offset();

        var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);
        var STATUS_Name = dataRecord.CASE_STATUS_Name;
        var STATUS_Name_TH = dataRecord.CASE_STATUS_Name_TH;

        if (STATUS_Name == "New Case") {
            return '<span class="text-danger center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
        }
        else if (STATUS_Name == "Wait Accept") {
            return '<span class="text-warning center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
        }
        else if (STATUS_Name == "Accepted") {
            return '<span class="text-info center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
        }
        else if (STATUS_Name == "Doctor Response") {
            return '<span class="text-success center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
        }
    };

    $("#gridCaseActive").jqxGrid(
        {
            width: "100%",
            height: 533,
            sortable: true,
            altrows: true,
            filterable: true,
            showfilterrow: true,
            //showstatusbar: true,
            //statusbarheight: 24,
            //showaggregates: true,
            autorowheight: true,
            columnsresize: true,
            pageable: true,
            pagesize: 10,
            scrollmode: 'logical',
            autoShowLoadElement: false,
            pagesizeoptions: ['10', '20', '50', '100', '500'],
            theme: theme,
            columns: [
                { text: '#', datafield: 'Row', align: 'center', cellsalign: 'center', width: 35 },
                {
                    text: 'View', datafield: 'View', align: 'center', columntype: 'button', cellsalign: 'center', width: 60,
                    cellsrenderer: function (row) {
                        Editrow = row;
                        var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);
                        var Case_Status = dataRecord.Case_Status;

                        return "View";

                    }, buttonclick: function (row) {
                        Editrow = row;
                        var offset = $("#gridCaseActive").offset();

                        var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);
                        var CaseID = dataRecord.Case_ID;
                        var TechID = dataRecord.Case_TechID;
                        var Case_Status = dataRecord.Case_Status;

                        var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);
                        Case_ID = dataRecord.Case_ID;
                        var FullName = dataRecord.FullName;
                        var Hos_OrthancID = dataRecord.Hos_OrthancID;
                        var Hos_Name = dataRecord.Hos_Name;
                        var Patient_HN = dataRecord.Patient_HN;
                        var Patient_Name = dataRecord.Patient_Name;
                        var Patient_LastName = dataRecord.Patient_LastName;
                        var Case_StudyDESC = dataRecord.Case_StudyDESC;
                        var Patient_Sex = dataRecord.Patient_Sex_TH;
                        var Patient_Age = dataRecord.Patient_Age;
                        var Patient_Birthday = dataRecord.Patient_Birthday;
                        var Patient_CitizenID = dataRecord.Patient_CitizenID;
                        var CASE_STATUS_Name = dataRecord.CASE_STATUS_Name;
                        var TreatmentRights_ID = dataRecord.TreatmentRights_ID;
                        var TreatmentRights_Name = dataRecord.TreatmentRights_Name;
                        var Patient_XDoc = dataRecord.DocFullName;
                        var UG_Type_Name = dataRecord.UG_Type_Name;
                        var Case_UrgentType = dataRecord.Case_UrgentType;
                        var Patient_Doctor = dataRecord.Patient_Doctor;
                        var ProtocolName = dataRecord.ProtocolName;
                        var Modality = dataRecord.Modality;
                        var Case_DocRespone = dataRecord.Case_DocRespone;
                        Case_TechID = dataRecord.Case_TechID;
                        Case_Status = dataRecord.Case_Status;
                        Case_OrthancID = dataRecord.Case_OrthancID;

                        $("#ManageCase").show();

                        $('#ManageCase').focus();
                        $('#PHos').html(Hos_Name);
                        $('#PName').html(FullName);
                        $('#HCase').html(Case_StudyDESC);
                        $('#HProtocol').html(ProtocolName);
                        $('#HModality').html(Modality);
                        $('#vDStatus').html(CASE_STATUS_Name);
                        $('#sUrgentType').html(UG_Type_Name);
                        $("#sRights").html(TreatmentRights_Name);

                        $('#vCaseID').val(Case_ID);
                        $('#RightID').val(TreatmentRights_ID);
                        $('#UrgentTypeID').val(Case_UrgentType);
                        $('#TechID').val(Case_TechID);
                        $('#pRespone').val(Case_DocRespone);
                        $('#CaseStatus').val(Case_Status);

                        $('#vHN').html(Patient_HN);
                        $('#vSex').html(Patient_Sex);
                        $('#vAge').html(Patient_Age);
                        $('#vCitizenID').html(Patient_CitizenID);
                        $('#vPatientDoctor').html(Patient_Doctor);
                        $('#vCitizenID').html(Patient_CitizenID);

                        //$('#ViewCase').hide();
                        //$('#DownLoadCase').hide();

                        CheckCaseStatus(Case_Status);
                        FromTypecheck(Case_Status);
                        SRAD_SEC_FILE(Case_ID);
                        scrollToTop();

                        //if(User_TypeID == "2"){
                        $("#GridCase").hide();

                    }
                },
                { text: 'สถานะ', datafield: 'CASE_STATUS_Name', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', cellsrenderer: cellsrenderer, width: 100 },
                { text: 'วันที่', datafield: 'Case_DateUpdates', align: 'center', cellsalign: 'center', cellsformat: 'dd MMM yyyy HH:mm:ss', filtertype: 'range', width: 90 },
                { text: 'โรงพยาบาล', datafield: 'Hos_Name', align: 'center', filtertype: 'checkedlist', width: 120 },
                { text: '#HN', datafield: 'Patient_HN', align: 'center', width: 100 },
                { text: 'ผู้รับการตรวจ', datafield: 'FullName', align: 'center', width: 200 },
                { text: 'เพศ', datafield: 'Patient_Sex_TH', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', width: 50 },
                { text: 'อายุ', datafield: 'Patient_Age', align: 'center', cellsalign: 'center', width: 50 },
                //{ text: 'Urgency', datafield: 'UG_Type_Name', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', width: 100},
                { text: 'รหัส', datafield: 'Order_ID', align: 'center', cellsalign: 'center', width: 80 },
                { text: 'รายการ', datafield: 'Order_Detail', align: 'center', minwidth: 200 },
                { text: 'ราคา', datafield: 'Order_Price', align: 'center', cellsalign: 'right', width: 120, cellsformat: 'c0' },
                //{ text: 'Description', datafield: 'Case_StudyDESC', align: 'center', width: 120},
                //{ text: 'Protocol', datafield: 'ProtocolName', align: 'center', minwidth: 180},
                //{ text: 'Modality', datafield: 'Modality', align: 'center', width: 70, filtertype: 'checkedlist'},
                { text: 'รังสีแพทย์', datafield: 'DocFullName', align: 'center', width: 150, filtertype: 'checkedlist' }
            ]
        });

    //gridCaseActive();

    $("#CancelCase").on('click', function () {
        var CaseStatus = $('#CaseStatus').val();
        var vDate = Y + m;
        gridCaseActive(vDate);

        $("#ManageCase").hide();
        scrollToTop();
        $("#DoctorID").val("");
        $("#TechID").val("");
        $("#vCaseID").val("");
        $("#RightID").val("");
        $("#sRights").html("");
        $("#GridCase").show();
    });

    $("#ViewCase").on('click', function () {
        var url = 'http://Radconnext:R@dconnext@103.91.189.94:8042/osimis-viewer/app/index.html?study=' + Case_OrthancID;
        openInNewTab(url);
    });

    $("#DownLoadCase").on('click', function () {
        var url = 'http://Radconnext:R@dconnext@103.91.189.94:8042/patients/' + Case_OrthancID + '/archive';
        openInNewTab(url);
    });

    $("#gridFileUpdate").jqxGrid({
        width: '100%',
        height: 185,
        //pageable: true,
        //pagerButtonsCount: 10,
        columnsResize: true,
        altrows: true,
        scrollmode: 'logical',
        //autoheight: true,
        //showstatusbar: true,
        theme: theme,
        columns: [
            {
                text: 'View', datafield: 'View', columntype: 'button', cellsalign: 'center', width: 50, cellsrenderer: function () {
                    return "Load";
                }, buttonclick: function (row) {
                    Editrow = row;
                    var offset = $("#gridFileUpdate").offset();

                    var dataRecord = $("#gridFileUpdate").jqxGrid('getrowdata', Editrow);
                    var vImage = dataRecord.Result_Path_IMG;

                    var url = vImage;
                    //document.getElementById("vShowImg").src = url;
                    openInNewTab(url);
                }
            },
            { text: 'ไฟล์', datafield: 'Result_CASE_FileName', align: 'center', minwidth: 50 },
            { text: 'วันที่', datafield: 'Result_CASE_DateUpdate', align: 'center', width: 150 }
        ]
    });
    $("#ReportCase").on('click', function () {
        var CaseID = $("#vCaseID").val();
        var url = "sapi/rad_report.php?CaseID=" + CaseID;
        openInNewTab(url);
    });

});

function LoopLoad(vTotalCase, Date) {
    var vDate = Date;
    setInterval(function () {
        //GetTotalCase();
        var ChkRe = false;
        var ChkvTotalCase = $('#sTotalCase').html();
        var ChkvNewCase = $('#sNewCase').html();
        var ChkvWaitAccept = $('#AWaitAccept').html();
        var ChkvAccepted = $('#AResponed').html();

        if (vTotalCase != ChkvTotalCase) {
            ChkRe = true;
            try {
                gridCaseActive();
            }
            catch {
                location.reload();
            }
        }

        if (vNewCase != ChkvNewCase && !ChkRe) {
            gridCaseActive();
        }

        if (vWaitAccept != ChkvWaitAccept && !ChkRe) {
            gridCaseActive();
        }

        if (vAccepted != ChkvAccepted && !ChkRe) {
            gridCaseActive();
        }


        vTotalCase = $('#sTotalCase').html();
        vNewCase = $('#sNewCase').html();
        vWaitAccept = $('#AWaitAccept').html();
        vAccepted = $('#AResponed').html();
    }, 1000 * 3);

}

function CheckCaseStatus(Case_Status) {
    if (Case_Status != "0" && (User_TypeID == "3" || User_TypeID == "1")) {
        $('#frmSaveCase').hide();
    }
    else {
        $('#frmSaveCase').show();
    }
};

function scrollToTop() {
    //$('#gridCaseActive').jqxGrid('clearselection');
    window.scrollTo(0, 0);
};

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

function gridCaseActive() {
    var act = 'SRAD_GET_CASE_ACCOUNT';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        User_ID: vUserID
    };

    var source =
    {
        type: 'POST',
        datatype: "json",
        datafields: [
            { name: 'Row', type: 'number' },
            { name: 'Case_ID', type: 'string' },
            { name: 'Hos_ID', type: 'string' },
            { name: 'Hos_OrthancID', type: 'string' },
            { name: 'Hos_Name', type: 'string' },
            { name: 'Case_OrthancID', type: 'string' },
            { name: 'Case_ParentPatient', type: 'string' },
            { name: 'Case_StudyDESC', type: 'string' },
            { name: 'Case_Status', type: 'string' },
            { name: 'CASE_STATUS_Name', type: 'string' },
            { name: 'CASE_STATUS_Name_TH', type: 'string' },
            { name: 'Case_UrgentType', type: 'string' },
            { name: 'UG_Type_Name', type: 'string' },
            { name: 'UrgentTime', type: 'string' },
            { name: 'Case_TechID', type: 'string' },
            { name: 'Case_DoctorID', type: 'string' },
            { name: 'DocFullName', type: 'string' },
            { name: 'Patient_HN', type: 'string' },
            { name: 'Patient_Name', type: 'string' },
            { name: 'Patient_LastName', type: 'string' },
            { name: 'FullName', type: 'string' },
            { name: 'Patient_CitizenID', type: 'string' },
            { name: 'Patient_Birthday', type: 'string' },
            { name: 'Patient_Age', type: 'string' },
            { name: 'Patient_Sex', type: 'string' },
            { name: 'Patient_Sex_TH', type: 'string' },
            { name: 'TreatmentRights_ID', type: 'string' },
            { name: 'TreatmentRights_Name', type: 'string' },
            { name: 'Patient_Doctor', type: 'string' },
            { name: 'BodyPartExamined', type: 'string' },
            { name: 'Modality', type: 'string' },
            { name: 'Manufacturer', type: 'string' },
            { name: 'ProtocolName', type: 'string' },
            { name: 'SeriesDescription', type: 'string' },
            { name: 'PerformedProcedureStepDescription', type: 'string' },
            { name: 'StationName', type: 'string' },
            { name: 'Order_ID', type: 'string' },
            { name: 'Order_Detail', type: 'string' },
            { name: 'Order_Unit', type: 'string' },
            { name: 'Order_Price', type: 'number' },
            { name: 'Case_DocRespone', type: 'string' },
            { name: 'Case_DateUpdate', type: 'string' },
            { name: 'Case_DateUpdates', type: 'date' },
            { name: 'Case_DateInsert', type: 'string' }
        ],
        url: url,
        data: pData
    };
    var dataAdapter = new $.jqx.dataAdapter(source);

    try {
        $("#gridCaseActive").jqxGrid({ source: dataAdapter });
        $('#gridCaseActive').jqxGrid('clearselection');
    }
    catch {
        location.reload();
    }
}

function SRAD_SEC_FILE(CaseID) {
    var act = 'SRAD_SEC_FILE';
    var url = "sapi/api.class.php?action=" + act
    //ar CaseID = $("#vCaseID").val();
    var pData = {
        Case_ID: CaseID,
    };

    var source =
    {
        type: 'GET',
        datatype: "json",
        datafields: [
            { name: 'Result_CASE_ID', type: 'number' },
            { name: 'CASE_ID', type: 'number' },
            { name: 'Result_CASE_FileName', type: 'string' },
            { name: 'Result_CASE_Type', type: 'string' },
            { name: 'Result_CASE_Size', type: 'string' },
            { name: 'Result_Path_IMG', type: 'string' },
            { name: 'Result_CASE_DateUpdate', type: 'string' }
        ],
        url: url,
        data: pData
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#gridFileUpdate").jqxGrid({ source: dataAdapter });
}


function FromTypecheck(Case_Status) {

    if (User_TypeID == "2") {
        $('#frmSaveCase').hide();
        $('#frmRespone').hide();
        $('#pRespone').jqxInput({ disabled: true });

        $("#PMFileImage").hide();
        $("#DMFileImage").show();

        if (Case_Status == "2" || Case_Status == "3") {
            $('#frmAccept').hide();
            $('#frmCancelAccept').hide();
        }
        else {
            $('#frmAccept').show();
            $('#frmCancelAccept').show();
        }

        if (Case_Status == '2') {
            //$('#ViewCase').show();
            //$('#DownLoadCase').show();
            $('#frmRespone').show();
            $('#pRespone').jqxInput({ disabled: false });
        }
    }
    else {
        $('#frmAccept').hide();
        $('#frmCancelAccept').hide();
        $("#PMFileImage").show();
        $("#DMFileImage").hide();
    }

    if (Case_Status != "0") {
        $('#vMtypeDetail').hide();
    }
    else {
        $('#frmAccept').hide();
        $('#frmCancelAccept').hide();
    }

    if (User_TypeID == "3") {
        $('#frmRenewCase').show();
    }

}

function ShowNoti(Msg, Type) {
    $("#MessageNoti").html(Msg);
    $("#Notification").jqxNotification({ template: Type });
    $("#Notification").jqxNotification("open");
}
