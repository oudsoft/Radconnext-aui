const { data } = require("jquery");

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

function startHospital_Admin(){
    var theme = 'energyblue';
    
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});

    $("#gridHospital").jqxGrid({
        width: '100%',
        autoheight: true,
        
        pageable: true,
        pagerButtonsCount: 10,
        columnsResize: true,
        filterable: true,
        showstatusbar: true,
        autoShowLoadElement: false,
        theme: theme,
        columns: [
            // row.id = data.Record.id;
            // row.Hos_Name = data.Record.Hos_Name;
            // row.Hos_Address = data.Record.Hos_Address;
            // row.Hos_Tel = data.Record.Hos_Tel;
            // row.Hos_WebUrl = data.Record.Hos_WebUrl;
            // row.Hos_Contact = data.Record.Hos_Contact;
            // row.Hos_Remark = data.Record.Hos_Remark;
            { text: 'Hospital_ID', datafield: 'id', align: 'center', cellsalign: 'center', minwidth: 100 },
            { text: 'Hospital Name', datafield: 'Hos_Name', align: 'center', cellsalign: 'center', minwidth: 150 },
            { text: 'Hospital Address', datafield: 'Hos_Address', align: 'center', cellsalign: 'center', minwidth: 150 },
            { text: 'Hospital Tel', datafield: 'Hos_Tel', align: 'center', cellsalign: 'center', minwidth: 100 },
            { text: 'Hospital WebUrl', datafield: 'Hos_WebUrl', align: 'center', cellsalign: 'center', minwidth: 150 },
            { text: 'Hospital Contact', datafield: 'Hos_Contact', align: 'center', cellsalign: 'center', minwidth: 150 },
            { text: 'Hospital Remark', datafield: 'Hos_Remark', align: 'center', cellsalign: 'center', minwidth: 150 },
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
                    var offset = $("#gridHospital").offset();

                    var dataRecord = $("#gridHospital").jqxGrid('getrowdata', Editrow);
                    console.log(JSON.stringify(dataRecord));
                    var id = dataRecord.id;
                    var Hos_Name = dataRecord.Hos_Name;
                    var Hos_Address = dataRecord.Hos_Address;
                    var Hos_Tel = dataRecord.Hos_Tel;
                    var Hos_WebUrl = dataRecord.Hos_WebUrl;
                    var Hos_Contact = dataRecord.Hos_Contact;
                    var Hos_Remark = dataRecord.Hos_Remark;

                    if (confirm("Do you want to Delete Hospital " + Hos_Name + "?")) {
                        DelHospital(id);
                    }
                }
            }
        ]
    });

    $('#AddHos').click(function () {
        var data = {};
        data.id = Number($("#TotalRecordCount").val()) + 1 ;
        data.Hos_Name = $("#vHosName").val();
        data.Hos_Address = $("#vHos_Address").val();
        data.Hos_Tel = $("#vHos_Telphone").val();
        data.Hos_WebUrl = $("#vHos_WebUrl").val();
        data.Hos_Contact = $("#vHos_Contact").val();
        data.Hos_Remark = $("#vHos_Remark").val();
        setTimeout(() => {
            AddHospital(data);
            $("#ClearHos").click();
        }, 500);
    });

    $("#BackHos").click(function () {
        $("#HospitalDetail").hide();
        $("#HospitalForm").hide();
        $("#ManageHospital").show();
        gridHospital();
        scrollToTop();
    });

    $('#EditHosDetail').click(function () {
        var data = {};
        data.id = $("#vHosID").val();
        data.Hos_Name = $("#vHosNameDetail").val();
        data.Hos_Address = $("#vHos_AddressDetail").val();
        data.Hos_Tel = $("#vHos_TelphoneDetail").val();
        data.Hos_WebUrl = $("#vHos_WebUrlDetail").val();
        data.Hos_Contact = $("#vHos_ContactDetail").val();
        data.Hos_Remark = $("#vHos_RemarkDetail").val();
        setTimeout( () => {
            EditHospital(data);
            $("#ClearHosDetail").click();
            scrollToTop();
        }, 500);
    });

    $("#gridHospital").on('rowdoubleclick', function (row) {
        //console.log("Row with bound index: " + row.args.rowindex + " has been double-clicked.");
        Editrow = row.args.rowindex;
        var offset = $("#gridHospital").offset();
        var dataRecord = $("#gridHospital").jqxGrid('getrowdata', Editrow);

        $("#gridHospitalData").val(JSON.stringify(dataRecord));
        DisplayHospital(dataRecord.Hos_Name);
        $("#vHosID").val(dataRecord.id);
        $("#vHosNameDetail").val(dataRecord.Hos_Name);
        $("#vHos_AddressDetail").val(dataRecord.Hos_Address);
        $("#vHos_TelphoneDetail").val(dataRecord.Hos_Tel);
        $("#vHos_WebUrlDetail").val(dataRecord.Hos_WebUrl);
        $("#vHos_ContactDetail").val(dataRecord.Hos_Contact);
        $("#vHos_RemarkDetail").val(dataRecord.Hos_Remark);
        $("#HospitalDetail").show();
        $("#ManageHospital").hide();

        getUrgencyTypes($("#vHosID").val());
        getOrthanC($("#vHosID").val());
        scrollToTop();

        setTimeout(function () {
            StartUgType();
            StartOrthanC();
            setTimeout(function () {
                var a = $("#vHosID").val();
                getUrgencyTypes(a);
                getOrthanC(a);
            }, 1000);
        }, 500);

    });

    $("#BackHosDetail").click(function () {
        $("#HospitalDetail").hide();
        $("#HospitalForm").hide();
        $("#ManageHospital").show();
        gridHospital();
        scrollToTop();
        
    });

    $('#ButtonAdd').click(function () {
        $("#HospitalDetail").hide();
        $("#HospitalForm").show();
        $("#ManageHospital").hide();
    });

    setTimeout(function () {
        gridHospital();
        scrollToTop();
    }, 500);

    $("#HospitalDetail").hide();
    $("#HospitalForm").hide();
}

function scrollToTop() {
    //$('#gridCaseActive').jqxGrid('clearselection');
    window.scrollTo(0, 0);
};

function gridHospital() {
    let function_name = 'gridHospital';
    let getUserTypeAPI = "/api/hospital/list";
    let params = [];
    console.log("function_name : " + function_name + " => start");
    var url = getUserTypeAPI;
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    const promises = doPostApi(url, params);
    promises.then( (data) => {
        var new_data = JSON.stringify(data);
        console.log('new_data: ' + new_data);
        if (data.Result == "OK" && data.Records.length > 0) {
            length = data.Records.length;
            var databases = new Array();
            // console.log("data = " + JSON.stringify(data["Options"][0].DisplayText));
            for (var i = 0; i < length; i++) {
                var row = {};
                row.id = data.Records[i].id;
                row.Hos_Name = data.Records[i].Hos_Name;
                row.Hos_Address = data.Records[i].Hos_Address;
                row.Hos_Tel = data.Records[i].Hos_Tel;
                row.Hos_WebUrl = data.Records[i].Hos_WebUrl;
                row.Hos_Contact = data.Records[i].Hos_Contact;
                row.Hos_Remark = data.Records[i].Hos_Remark;
                databases[i] = row;
            }
            $("#TotalRecordCount").val(data.TotalRecordCount);
        }
        var source = {
            localdata: databases,
            datatype: "array"
        };
        console.log("source = ", source);
        var dataAdapter = new $.jqx.dataAdapter(source);
        $("#gridHospital").jqxGrid({
            source: dataAdapter
        });
    }).catch(function (error) {
        console.log(JSON.stringify(error));
        reject(error);
    });

    console.log("function_name : " + function_name + " => end");

}

function AddHospital(hosdata) {
    let function_name = 'AddHospital';
    let url = "/api/hospital/add";
    let params = hosdata;
    const promises = doPostApi(url, params);
    promises.then((data) => {
        if (data.Result == 'OK') {
            console.log('Add Hospital Success!');
            ShowNoti('เพิ่มโรงพยาบาลสำเร็จ', 'success');
            gridHospital();
        } else {
            ShowNoti('ลบโรงพยาบาลไม่สำเร็จ!', 'warning');
        }
    }).catch((error) => {
        console.log(` function ${function_name} error => ${error}`);
        ShowNoti('เพิ่มโรงพยาบาลไม่สำเร็จ!', 'warning');
    });
}

function DelHospital(hos_id) {
    let function_name = 'DelHospital';
    let url = "/api/hospital/delete";
    let params = {id: hos_id};
    const promises = doPostApi(url, params);
    promises.then((data) => {
        if (data.Result == 'OK') {
            console.log('delete Hospital Success!');
            ShowNoti('ลบโรงพยาบาลสำเร็จ!', 'success');
            gridHospital();
        } else {
            ShowNoti('ลบโรงพยาบาลไม่สำเร็จ!', 'warning');
        }
    }).catch((error) => {
        console.log(` function ${function_name} error => ${error}`);
        ShowNoti('ลบโรงพยาบาลไม่สำเร็จ!', 'warning');
    });
}

function EditHospital(hosdata) {
    let function_name = 'EditHospital';
    let url = "/api/hospital/update";
    let params = hosdata;
    const promises = doPostApi(url, params);
    promises.then((data) => {
        if (data.Result == 'OK') {
            console.log('Edit Hospital Success!');
            ShowNoti('แก้ไขโรงพยาบาลสำเร็จ!', 'success');
            $("#BackHosDetail").click();
            gridHospital();
        } else {
            ShowNoti('แก้ไขโรงพยาบาลไม่สำเร็จ!', 'warning');
        }
    }).catch((error) => {
        console.log(` function ${function_name} error => ${error}`);
        ShowNoti('แก้ไขโรงพยาบาลไม่สำเร็จ!', 'warning');
    });
}

function ShowNoti(Msg, Type) {
    $("#MessageNoti").html(Msg);
    $("#Notification").jqxNotification({
        template: Type
    });
    $("#Notification").jqxNotification("open");
}

function ClearText() {
    $("#vHosOrtancID").val("");
    $("#vHosName").val("");
}

function StartUgType() {
    ///////////////// Tooltips Header Column /////////////////////////////
    var tooltiprenderer = function (element) {
        $(element).parent().jqxTooltip({
            position: 'top',
            content: "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง"
        });
    };

    $('#UrgentTypesGrid').jqxGrid({
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
        columns: [{
                text: 'id',
                datafield: 'id',
                align: 'center',
                cellsalign: 'center',
                rendered: tooltiprenderer,
                width: '5%'
            },
            {
                text: 'UGType_Name',
                datafield: 'UGType_Name',
                align: 'center',
                cellsalign: 'center',
                rendered: tooltiprenderer,
                width: '25%'
            },
            // { text: 'UGType_ColorCode', datafield: 'UGType_ColorCode', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '25%' },
            {
                text: 'UGType_AcceptStep',
                datafield: 'UGType_AcceptStep',
                align: 'center',
                cellsalign: 'center',
                rendered: tooltiprenderer,
                width: '30%'
            },
            {
                text: 'UGType_WorkingStep',
                datafield: 'UGType_WorkingStep',
                align: 'center',
                cellsalign: 'center',
                rendered: tooltiprenderer,
                width: '30%'
            },
            // { text: 'UGType_WarningStep', datafield: 'FullNaUGType_WarningStepme_TH', align: 'center', rendered: tooltiprenderer, width: '20%' },
            {
                text: 'Delete',
                datafield: 'Delete',
                align: 'center',
                columntype: 'button',
                cellsalign: 'center',
                width: '10%',
                cellsrenderer: function (row) {
                    return "Delete";
                },
                buttonclick: function (row) {
                    Editrow = row;
                    var offset = $("#UrgentTypesGrid").offset();
                    var dataRecord = $("#UrgentTypesGrid").jqxGrid('getrowdata', Editrow);

                    var id = dataRecord.id;
                    var UGType_Name = dataRecord.UGType_Name;
                    var UGType_ColorCode = dataRecord.UGType_ColorCode;
                    var UGType_AcceptStep = JSON.parse(dataRecord.UGType_AcceptStep);
                    var UGType_WorkingStep = JSON.parse(dataRecord.UGType_WorkingStep);
                    var UGType_WarningStep = JSON.parse(dataRecord.UGType_WarningStep);
                    var hospitalId = dataRecord.hospitalId;

                    if (confirm("Do you want to Delete UrgencyTypes Name " + UGType_Name + " ?")) {
                        const params = {
                            id: id,
                            UGType_Name: UGType_Name,
                            UGType_ColorCode: UGType_ColorCode,
                            UGType_AcceptStep: UGType_AcceptStep,
                            UGType_WorkingStep: UGType_WorkingStep,
                            UGType_WarningStep: UGType_WarningStep,
                            hospitalId: $("#HosID").val()
                        };
                        const url = "/api/urgenttypes/delete/";
                        const promises = doPostApi(url, params);
                        promises.then((data) => {
                            ShowNoti('ลบ UrgencyTypes สำเร็จ', "success");
                            clearselection();
                        }).catch((error) => {
                            ShowNoti('ลบ UrgencyTypes ไม่สำเร็จ', "warning");
                        });
                    }
                }
            }
        ]
    });

    $("#UrgentTypesGrid").on('rowdoubleclick', function (event) {

        Editrow = event.args.rowindex;
        var offset = $("#UrgentTypesGrid").offset();
        var dataRecord = $("#UrgentTypesGrid").jqxGrid('getrowdata', Editrow);
        // var dataRecord = JSON.parse(dataRecords);

        var id = dataRecord.id;
        var UGType_Name = dataRecord.UGType_Name;
        var UGType_ColorCode = dataRecord.UGType_ColorCode;
        var UGType_AcceptStep = (dataRecord.UGType_AcceptStep);
        var UGType_WorkingStep = (dataRecord.UGType_WorkingStep);
        var UGType_WarningStep = (dataRecord.UGType_WarningStep);
        var hospitalId = dataRecord.hospitalId;

        $("#typenameUgType").val(UGType_Name);
        $("#AcceptTimeUgType").val(UGType_AcceptStep);
        $("#WorkingTimeUgType").val(UGType_WorkingStep);
        $("#WarningTimeUgType").val(UGType_WarningStep);
        $("#UGTypesID").val(id);
        $("#ColorCode").val(UGType_ColorCode);
        $("#HosID").val(hospitalId);

    });

    $("#ButtonUgTypeEdit").click(() => {
        $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
        let id = $("#UGTypesID").val();
        let UGType_Name = $("#typenameUgType").val();
        let UGType_ColorCode = $("#ColorCode").val();
        let UGType_AcceptStep = $("#AcceptTimeUgType").val();
        let UGType_WorkingStep = $("#WorkingTimeUgType").val();
        let UGType_WarningStep = $("#WarningTimeUgType").val();
        let hospitalId = $("#vHosID").val();
        const params = {
            id: id,
            UGType_Name: UGType_Name,
            UGType_ColorCode: UGType_ColorCode,
            UGType_AcceptStep: UGType_AcceptStep,
            UGType_WorkingStep: UGType_WorkingStep,
            UGType_WarningStep: UGType_WarningStep,
            hospitalId: hospitalId
        };
        const url = "/api/urgenttypes/update/";
        const promises = doPostApi(url, params);
        
        promises.then( (data) => {
            console.log('data : ' + JSON.stringify(data));
            ShowNoti('แก้ไข UrgencyTypes สำเร็จ', "success");
            clearselection();
        }).catch((error) => {
            console.log(` error => ${error}`);
            ShowNoti('แก้ไข UrgencyTypes ไม่สำเร็จ', "warning");
        });
    });

    $("#ButtonUgTypeAdd").click(() => {
        let id = $("#UGTypesID").val();
        let UGType_Name = $("#typenameUgType").val();
        let UGType_ColorCode = $("#ColorCode").val();
        let UGType_AcceptStep = $("#AcceptTimeUgType").val();
        let UGType_WorkingStep = $("#WorkingTimeUgType").val();
        let UGType_WarningStep = $("#WarningTimeUgType").val();
        let hospitalId = $("#vHosID").val();
        const params = {
            UGType_Name: UGType_Name,
            UGType_ColorCode: UGType_ColorCode,
            UGType_AcceptStep: UGType_AcceptStep,
            UGType_WorkingStep: UGType_WorkingStep,
            UGType_WarningStep: UGType_WarningStep,
            hospitalId: hospitalId,
        };
        const url = "/api/urgenttypes/add/";
        const promises = doPostApi(url, params)
        promises.then((data) => {
            console.log("promiseAddUrgencyTypes success: " + JSON.stringify(data));
            ShowNoti('เพิ่ม UrgencyTypes สำเร็จ', "success");
            clearselection();
        }).catch((error) => {
            console.log(` error => ${error}`);
            ShowNoti('เพิ่ม UrgencyTypes ไม่สำเร็จ', "warning");
        });
    });

    $("#OpenReportDeign").on('click', function () {
        const urlname = window.location.href + "report-design/?hosid=" + $("#vHosID").val();
        window.open(urlname, '_blank');
    });

}

function StartOrthanC() {
    ///////////////// Tooltips Header Column /////////////////////////////
    var tooltiprenderer = function (element) {
        $(element).parent().jqxTooltip({
            position: 'top',
            content: "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง"
        });
    };

    $('#OrthanCGrid').jqxGrid({
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
        columns: [{
                text: 'id',
                datafield: 'id',
                align: 'center',
                cellsalign: 'center',
                rendered: tooltiprenderer,
                width: '5%'
            },
            {
                text: 'Orthanc_Local',
                datafield: 'Orthanc_Local',
                align: 'center',
                cellsalign: 'center',
                rendered: tooltiprenderer,
                width: '30%'
            },
            // { text: 'OrthanC_ColorCode', datafield: 'OrthanC_ColorCode', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: '25%' },
            {
                text: 'Orthanc_Cloud',
                datafield: 'Orthanc_Cloud',
                align: 'center',
                cellsalign: 'center',
                rendered: tooltiprenderer,
                width: '30%'
            },
            {
                text: 'Orthanc_Remark',
                datafield: 'Orthanc_Remark',
                align: 'center',
                cellsalign: 'center',
                rendered: tooltiprenderer,
                width: '20%'
            },
            {
                text: 'hospitalId',
                datafield: 'hospitalId',
                align: 'center',
                cellsalign: 'center',
                rendered: tooltiprenderer,
                width: '5%'
            },
            // { text: 'OrthanC_WarningStep', datafield: 'FullNaOrthanC_WarningStepme_TH', align: 'center', rendered: tooltiprenderer, width: '20%' },
            {
                text: 'Delete',
                datafield: 'Delete',
                align: 'center',
                columntype: 'button',
                cellsalign: 'center',
                width: '10%',
                cellsrenderer: function (row) {
                    return "Delete";
                },
                buttonclick: function (row) {
                    Editrow = row;
                    var offset = $("#OrthanCGrid").offset();
                    var dataRecord = $("#OrthanCGrid").jqxGrid('getrowdata', Editrow);

                    var id = dataRecord.id;
                    var Orthanc_Local = dataRecord.Orthanc_Local;
                    var Orthanc_Cloud = dataRecord.Orthanc_Cloud;
                    var Orthanc_Remark = dataRecord.Orthanc_Remark;
                    var hospitalId = dataRecord.hospitalId;

                    if (confirm("Do you want to Delete Orthanc_Local Name " + Orthanc_Local + " ?")) {
                        const params = {
                            id: id,
                            Orthanc_Local: Orthanc_Local,
                            Orthanc_Cloud: Orthanc_Cloud,
                            Orthanc_Remark: Orthanc_Remark,
                            hospitalId: hospitalId,
                        };
                        const url = "/api/orthanc/delete/";
                        const promises = doPostApi(url, params);
                        promises.then((data) => {
                            ShowNoti('ลบ OrthanC สำเร็จ', "success");
                            clearselection2();
                        }).catch((error) => {
                            console.log('error to del : ' + error);
                            ShowNoti('ลบ OrthanC ไม่สำเร็จ', "warning");
                        });
                    }
                }
            }
        ]
    });

    $("#OrthanCGrid").on('rowdoubleclick', function (event) {

        Editrow = event.args.rowindex;
        var offset = $("#OrthanCGrid").offset();
        var dataRecord = $("#OrthanCGrid").jqxGrid('getrowdata', Editrow);
        // var dataRecord = JSON.parse(dataRecords);

        var Orthanc_Local = dataRecord.Orthanc_Local;
        var Orthanc_Cloud = dataRecord.Orthanc_Cloud;
        var Orthanc_Remark = dataRecord.Orthanc_Remark;
        var hospitalId = dataRecord.hospitalId;

        $("#Local").val(Orthanc_Local);
        $("#Cloud").val(Orthanc_Cloud);
        $("#Remark").val(Orthanc_Remark);
        $("#OrthanCID").val(id);
        $("#HosID").val(hospitalId);

    });

    $("#ButtonOrthanCEdit").click(() => {
        $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
        let id = $("#OrthanCID").val();
        var Orthanc_Local = $("#Local").val();
        var Orthanc_Cloud = $("#Cloud").val();
        var Orthanc_Remark = $("#Remark").val();
        let hospitalId = $("#vHosID").val();
        const params = {
            id: id,
            Orthanc_Local: Orthanc_Local,
            Orthanc_Cloud: Orthanc_Cloud,
            Orthanc_Remark: Orthanc_Remark,
            hospitalId: hospitalId,
        };
        const url = "/api/orthanc/update/";
        const promises = doPostApi(url, params);
        promises.then( (data) => {
            console.log('data : ' + JSON.stringify(data));
            ShowNoti('แก้ไข OrthanC สำเร็จ', "success");
            clearselection2();
        }).catch((error) => {
            console.log(` error => ${error}`);
            ShowNoti('แก้ไข OrthanC ไม่สำเร็จ', "warning");
        });
    });

    $("#ButtonOrthanCAdd").click(() => {
        let id = $("#OrthanCID").val();
        var Orthanc_Local = $("#Local").val();
        var Orthanc_Cloud = $("#Cloud").val();
        var Orthanc_Remark = $("#Remark").val();
        let hospitalId = $("#vHosID").val();
        const params = {
            id: id,
            Orthanc_Local: Orthanc_Local,
            Orthanc_Cloud: Orthanc_Cloud,
            Orthanc_Remark: Orthanc_Remark,
            hospitalId: hospitalId,
        };
        const url = "/api/orthanc/add/";
        const promises = doPostApi(url, params)
        promises.then((data) => {
            console.log("OrthanC success: " + JSON.stringify(data));
            ShowNoti('เพิ่ม OrthanC สำเร็จ', "success");
            clearselection2();
        }).catch((error) => {
            console.log(` error => ${error}`);
            ShowNoti('เพิ่ม OrthanC ไม่สำเร็จ', "warning");
        });
    });
}

function getUrgencyTypes(hosID) {
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    const function_name = "getUrgencyTypes";
    const params = {hospitalId: hosID};
    const url = "/api/urgenttypes/list?hospitalId="+hosID;
    const promises = doPostApi(url, params)
    promises.then((data) => {
        // console.log("data in " + function_name + " : " + JSON.stringify(data));
        if (data.Result == 'OK') {
            var databases = new Array();
            for (i = 0; i < data.Records.length; i++) {
                var row = {};
                row.id = data.Records[i].id;
                row.UGType_Name = data.Records[i].UGType_Name;
                row.UGType_ColorCode = data.Records[i].UGType_ColorCode;
                row.UGType_AcceptStep = data.Records[i].UGType_AcceptStep;
                row.UGType_WorkingStep = data.Records[i].UGType_WorkingStep;
                row.UGType_WarningStep = data.Records[i].UGType_WarningStep;
                row.hospitalId = data.Records[i].hospitalId;
                databases[i] = row;
            }

            var results = JSON.stringify(databases);
            $("#UGTypes").val(results);

            var source = {
                localdata: databases,
                datatype: "array",
            };

            var dataAdapter = new $.jqx.dataAdapter(source);
            $('#UrgentTypesGrid').jqxGrid({
                source: dataAdapter
            });
            // console.log("Success in " + function_name);
        } else {
            // console.log("Error in Get Data " + function_name);
        }
    }).catch((error) => {
        console.log(` function ${function_name} error => ${error}`);
        ShowNoti('เพิ่ม UrgencyTypes ไม่สำเร็จ', "warning");
    }); 
}

function getOrthanC(hosID) {
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    const function_name = "getOrthanC";
    const params = {hospitalId: hosID};
    const url = "/api/orthanc/list?hospitalId="+hosID;
    const promises = doPostApi(url, params)
    promises.then((data) => {
        console.log("data in " + function_name + " : " + JSON.stringify(data));
        if (data.Result == 'OK') {
            var databases = new Array();
            for (i = 0; i < data.Records.length; i++) {
                var row = {};
                row.id = data.Records[i].id;
                row.Orthanc_Local = data.Records[i].Orthanc_Local;
                row.Orthanc_Cloud = data.Records[i].Orthanc_Cloud;
                row.Orthanc_Remark = data.Records[i].Orthanc_Remark;
                row.hospitalId = data.Records[i].hospitalId;
                databases[i] = row;
            }

            var results = JSON.stringify(databases);
            $("#OrthanCRecords").val(results);

            var source = {
                localdata: databases,
                datatype: "array",
            };

            var dataAdapter = new $.jqx.dataAdapter(source);
            $('#OrthanCGrid').jqxGrid({
                source: dataAdapter
            });
            // console.log("Success in " + function_name);
        } else {
            // console.log("Error in Get Data " + function_name);
        }
    }).catch((error) => {
        console.log(` function ${function_name} error => ${error}`);
        ShowNoti('เพิ่ม UrgencyTypes ไม่สำเร็จ', "warning");
    }); 
}

function clearselection() {
    $("#typenameGrid").val("");
    $("#AcceptTimeGrid").val('{"dd": "00", "hh": "01", "mn": "00"}');
    $("#WorkingTimeGrid").val('{"dd": "00", "hh": "01", "mn": "00"}');
    $("#WarningTimeGrid").val('{"dd": "00", "hh": "01", "mn": "00"}');
    $("#UGTypesID").val("");
    $("#ColorCode").val("");
    // $("#HosID").val("");
    $('#UrgentTypesGrid').jqxGrid('clearselection');
    $("#UrgentTypesGrid").jqxGrid("clear");
    getUrgencyTypes($("#vHosID").val());
}

function DisplayHospital(hosname){
    $("#HospitalDisplayName").text(hosname);
    $("#HospitalDisplayName2").text(hosname);
    $("#HospitalDisplayName3").text(hosname);
    $("#HospitalDisplayName4").text(hosname);
}

function clearselection2(){
    $("#Local").val('{"os": "windows500", "ip": "192.168.0.0", "httpport": "8000", "dicomport": "4000"}');
    $("#Cloud").val('{"os": "windows500", "ip": "192.168.0.0", "httpport": "8000", "dicomport": "4000","user": "demo", "pass": "demo", "portex" : "8042", "ipex": "202.28.00.00"}');
    $("#Remark").val('');
    $("#OrthanCGrid").jqxGrid("clear");
    getOrthanC();
}

module.exports = {
    startHospital_Admin
}