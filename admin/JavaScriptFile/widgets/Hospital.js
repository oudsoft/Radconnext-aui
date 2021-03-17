$(document).ready(function () {
    //console.log(User_ID);
    
});

function Start_Hospital(){
    var theme = 'energyblue';
    RadHospital(User_ID);

    $('#frmSaveHos').click(function () {
        UPD_RadHospital(User_ID);
    });
    $('#frmCancelHos').click(function () {
        var win = window.open('index.php', '_self');
        win.focus();
    });

    $("#gridTreatmentRights").jqxGrid(
        {
            width: '100%',
            height: 385,
            pageable: true,
            pagerButtonsCount: 5,
            columnsResize: true,
            filterable: true,
            showfilterrow: true,
            autoShowLoadElement: false,
            theme: theme,
            columns: [
                { text: '#', datafield: 'Row', align: 'center', cellsalign: 'center', width: 40 },
                { text: 'สิทธิ์การรักษา', datafield: 'TreatmentRights_Name', align: 'center', minwidth: 150 },
                {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: 60,
                    cellsrenderer: function (row) { return "Delete"; }, buttonclick: function (row) {
                        Editrow = row;
                        var offset = $("#gridTreatmentRights").offset();

                        var dataRecord = $("#gridTreatmentRights").jqxGrid('getrowdata', Editrow);
                        var TreatmentRights_ID = dataRecord.TreatmentRights_ID;
                        var Hos_OrthancID = dataRecord.Hos_OrthancID;
                        var TreatmentRights_Name = dataRecord.TreatmentRights_Name;

                        if (confirm("Do you want to Delete " + TreatmentRights_Name + "?")) {
                            SRAD_MSG_TREATMENTRIGHTS_DEL(TreatmentRights_ID);
                        }
                    }
                }
            ]
        });
    $("#gridTreatmentRights").on('rowselect', function (event) {
        let pRow = event.args.row;
        var TreatmentRights_Name = pRow.TreatmentRights_Name;

        $("#vRights").val(TreatmentRights_Name);
    });
    $('#SaveRights').click(function () {
        SRAD_MSG_TREATMENTRIGHTS_INS();
    });

    $("#gridUrgency").jqxGrid(
        {
            width: '100%',
            height: 385,
            pageable: true,
            pagerButtonsCount: 5,
            columnsResize: true,
            filterable: true,
            showfilterrow: true,
            autoShowLoadElement: false,
            theme: theme,
            columns: [
                { text: '#', datafield: 'Row', align: 'center', cellsalign: 'center', width: 40 },
                { text: 'Urgency', datafield: 'UG_Type_Name_Show', align: 'center', minwidth: 150 },
                {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: 60,
                    cellsrenderer: function (row) { return "Delete"; }, buttonclick: function (row) {
                        Editrow = row;
                        var offset = $("#gridUrgency").offset();

                        var dataRecord = $("#gridUrgency").jqxGrid('getrowdata', Editrow);
                        var UG_Type_ID = dataRecord.UG_Type_ID;
                        var Hos_OrthancID = dataRecord.Hos_OrthancID;
                        var UG_Type_Name = dataRecord.UG_Type_Name;

                        if (confirm("Do you want to Delete " + UG_Type_Name + "?")) {
                            SRAD_MSG_URGENT_TYPE_DEL(UG_Type_ID);
                        }
                    }
                }
            ]
        });

    $("#gridUrgency").on('rowselect', function (event) {
        let pRow = event.args.row;
        var UG_Type_ID = pRow.UG_Type_ID;
        var UG_Type_Name = pRow.UG_Type_Name;
        var UG_Type_Day = pRow.UG_Type_Day;
        var UG_Type_Hour = pRow.UG_Type_Hour;
        var UG_Type_Minute = pRow.UG_Type_Minute;

        $("#vUrgencyID").val(UG_Type_ID);
        $("#vUrgency").val(UG_Type_Name);
        $("#vUrgencyDay").val(UG_Type_Day);
        $("#vUrgencyHour").val(UG_Type_Hour);
        $("#vUrgencyMins").val(UG_Type_Minute);
    });
    $('#SaveUrgency').click(function () {
        SRAD_MSG_URGENT_TYPE_INS();
    });

    $("#gridOrder").jqxGrid(
        {
            width: '100%',
            height: 390,
            pageable: true,
            pagerButtonsCount: 5,
            columnsResize: true,
            filterable: true,
            showfilterrow: true,
            autoShowLoadElement: false,
            theme: theme,
            columns: [
                { text: 'รหัส', datafield: 'HosOrder_ID', align: 'center', cellsalign: 'center', width: 80 },
                { text: 'หัวข้อ', datafield: 'HosOrder_Header', align: 'center', width: 200, filtertype: 'checkedlist' },
                { text: 'รายการ', datafield: 'HosOrder_Detail', align: 'center', minwidth: 250 },
                { text: 'Dicom Detail', datafield: 'HosOrder_Dicom', align: 'center', width: 250 },
                { text: 'หน่วย', datafield: 'HosOrder_Unit', align: 'center', cellsalign: 'center', width: 80, filtertype: 'checkedlist' },
                { text: 'ราคากลาง', datafield: 'HosOrder_PriceMS', align: 'center', cellsalign: 'right', width: 80, cellsformat: 'c2' },
                { text: 'ราคา', datafield: 'HosOrder_Price', align: 'center', cellsalign: 'right', width: 80, cellsformat: 'c2' },
                { text: 'DF แพทย์', datafield: 'HosOrder_DF', align: 'center', cellsalign: 'right', width: 80, cellsformat: 'c2' },
                {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: 60,
                    cellsrenderer: function (row) { return "Delete"; }, buttonclick: function (row) {
                        Editrow = row;
                        var offset = $("#gridOrder").offset();

                        var dataRecord = $("#gridOrder").jqxGrid('getrowdata', Editrow);
                        var HosOrderID = dataRecord.ID;
                        var HosOrder_Detail = dataRecord.HosOrder_Detail;

                        if (confirm("Do you want to Delete Order " + HosOrder_Detail + "?")) {
                            SRAD_MSG_HOS_ORDER_DEL(HosOrderID);
                        }
                    }
                }
            ]
        });

    $("#gridOrder").on('rowselect', function (event) {
        let pRow = event.args.row;
        var OrderID = pRow.ID;
        var Order_ID = pRow.HosOrder_ID;
        var Order_Header = pRow.HosOrder_Header;
        var Order_Detail = pRow.HosOrder_Detail;
        var HosOrder_Dicom = pRow.HosOrder_Dicom;
        var Order_Unit = pRow.HosOrder_Unit;
        var Order_PriceMS = pRow.HosOrder_PriceMS;
        var HosOrder_Price = pRow.HosOrder_Price;
        var HosOrder_DF = pRow.HosOrder_DF;

        $("#vOrderID").val(OrderID);
        $("#vOrder_ID").val(Order_ID);
        $("#vOrder_Header").val(Order_Header);
        $("#vOrder_Detail").val(Order_Detail);
        $("#vDicomDetail").val(HosOrder_Dicom);
        $("#vOrder_Unit").val(Order_Unit);
        $("#vOrder_PriceMS").val(Order_PriceMS);
        $("#vOrder_Price").val(HosOrder_Price);
        $("#vOrder_DF").val(HosOrder_DF);
    });
    $('#SaveOrder').click(function () {
        SRAD_MSG_ORDER_INT();
    });
    $('#AddOrder').click(function () {
        SRAD_MSG_HOS_ORDER_INT();
    });
    $('#UpdateOrder').click(function () {
        SRAD_MSG_HOS_ORDER_UPD();
    });
}

function ShowNoti(Msg, Type) {
    $("#MessageNoti").html(Msg);
    $("#Notification").jqxNotification({ template: Type });
    $("#Notification").jqxNotification("open");
}

function RadHospital(UserID) {
    let function_name = 'RadHospital';
    let params = [];
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url =  "/api/hospital/list";
        $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });

        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            data: params,
            success: function (data) {
                new_data = JSON.stringify(data);
                a = data;
                console.log("data in function: " + function_name + " ==> "+ new_data);
                if (data["Result"] == 'OK') {
                    var vHos_ID = data.Records[0].id;
                    var vHos_Name = data.Records[0].Hos_Name;
                    //var vHos_OrthancID = data.Records[0].Hos_OrthancID;
                    var vHos_Address = data.Records[0].Hos_Address;
                    var vHos_Tel_1 = data.Records[0].Hos_Tel;
                    var vHos_Contact = data.Records[0].Hos_Contact;
                    var vHos_Remark = data.Records[0].Hos_Remark;

                    $('#vHosID').val(vHos_ID);
                    //$('#vHosOrtancID').val(vHos_OrthancID);
                    $('#vHosName').val(vHos_Name);
                    $('#vHosAdd').val(vHos_Address);
                    $('#vHosPhone').val(vHos_Tel_1);
                    $('#vHosContact').val(vHos_Contact);
                    $('#vHosDetail').val(vHos_Remark);

                    // SRAD_MSG_TREATMENTRIGHTS();
                    // SRAD_MSG_URGENT_TYPE();
                    // gridOrder();
                }
                else {
                    console.log("data in function: " + function_name + " ==> Error ");
                    //ShowNoti(vResult, "danger");
                }
            }
        }).fail(function (error) {
            console.log(JSON.stringify(error));
            reject(error);
        });

    });
}


function UPD_RadHospital(User_ID) {

    var vHos_ID = $('#vHosID').val();;
    var vHos_Name = $('#vHosName').val();
    var vHos_OrthancID = $('#vHosOrtancID').val();
    var vHos_Address = $('#vHosAdd').val();
    var vHos_Tel_1 = $('#vHosPhone').val();
    var vHos_Contact = $('#vHosContact').val();
    var vHos_Remark = $('#vHosDetail').val();

    var act = 'RadHospital';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        HosID: vHos_ID,
        HosName: vHos_Name,
        HosOrthancID: vHos_OrthancID,
        HosAddress: vHos_Address,
        HosTel1: vHos_Tel_1,
        HosTel2: '',
        HosContact: vHos_Contact,
        HosRemark: vHos_Remark,
        SQL_Action: 'UPD'
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            var vResponse = data.Response;
            if (data.Response == 'success') {
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if (vResult == "Success") {
                    ShowNoti("Save", "success");
                    RadHospital(User_ID);
                }
                else {
                    ShowNoti(vResult, "warning");
                }
            }
            else {
                var vResult = data.Result;
                ShowNoti(vResult, "warning");
            }
        },
        error: function () {
            ShowNoti('Failed', "warning");
        }
    });
}
function SRAD_MSG_TREATMENTRIGHTS() {
    let Hos_OrthancID = $('#vHosOrtancID').val();
    var act = 'SRAD_MSG_TREATMENTRIGHTS_T';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        Hos_OrthancID: Hos_OrthancID,
        SQL_ACTION: "SEC"
    };

    var source =
    {
        type: 'POST',
        datatype: "json",
        datafields: [
            { name: 'Row', type: 'string' },
            { name: 'TreatmentRights_ID', type: 'string' },
            { name: 'Hos_OrthancID', type: 'string' },
            { name: 'TreatmentRights_Name', type: 'string' },
            { name: 'TreatmentRights_Values', type: 'string' },
            { name: 'TreatmentRights_DateUpdate', type: 'string' }
        ],
        id: 'id',
        url: url,
        data: pData
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#gridTreatmentRights").jqxGrid({ source: dataAdapter });
}
function SRAD_MSG_URGENT_TYPE() {
    let Hos_OrthancID = $('#vHosOrtancID').val();
    var act = 'SRAD_MSG_URGENT_TYPE';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        Hos_OrthancID: Hos_OrthancID,
        SQL_ACTION: 'SEI'
    };

    var source =
    {
        type: 'POST',
        datatype: "json",
        datafields: [
            { name: 'Row', type: 'string' },
            { name: 'UG_Type_ID', type: 'string' },
            { name: 'Hos_OrthancID', type: 'string' },
            { name: 'UG_Type_Name', type: 'string' },
            { name: 'UG_Type_Day', type: 'string' },
            { name: 'UG_Type_Hour', type: 'string' },
            { name: 'UG_Type_Minute', type: 'string' },
            { name: 'UG_Type_Name_Show', type: 'string' }
        ],
        url: url,
        data: pData,
        async: true
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $('#gridUrgency').jqxGrid({ source: dataAdapter });
}
function gridOrder() {
    let Hos_OrthancID = $('#vHosOrtancID').val();
    var act = 'SRAD_MSG_HOS_ORDER';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        Hos_OrthancID: Hos_OrthancID,
        SQL_ACTION: "SEC"
    };

    var source =
    {
        type: 'POST',
        datatype: "json",
        datafields: [
            { name: 'ID', type: 'string' },
            { name: 'HosOrder_ID', type: 'string' },
            { name: 'Hos_OrthancID', type: 'string' },
            { name: 'HosOrder_Header', type: 'string' },
            { name: 'HosOrder_Detail', type: 'string' },
            { name: 'HosOrder_Dicom', type: 'string' },
            { name: 'HosOrder_Unit', type: 'string' },
            { name: 'HosOrder_PriceMS', type: 'number' },
            { name: 'HosOrder_Price', type: 'number' },
            { name: 'HosOrder_DF', type: 'number' },
            { name: 'TotalDetail', type: 'number' }
        ],
        id: 'id',
        url: url,
        data: pData
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#gridOrder").jqxGrid({ source: dataAdapter });
}
function SRAD_MSG_TREATMENTRIGHTS_INS() {

    let Hos_OrthancID = $('#vHosOrtancID').val();
    let Rights = $('#vRights').val();

    var act = 'SRAD_MSG_TREATMENTRIGHTS_T';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        Hos_OrthancID: Hos_OrthancID,
        Name: Rights,
        SQL_ACTION: 'INS'
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            var vResponse = data.Response;
            if (data.Response == 'success') {
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if (vResult == "Success") {
                    ShowNoti(vMsg, "success");
                }
                else {
                    ShowNoti(vMsg, "warning");
                }
            }
            else {
                var vResult = data.Result;
                ShowNoti(vResult, "warning");
            }
            SRAD_MSG_TREATMENTRIGHTS();
            $("#vRights").val('');
        },
        error: function () {
            ShowNoti('Failed', "warning");
        }
    });
}
function SRAD_MSG_TREATMENTRIGHTS_DEL(TreatmentRights_ID) {

    let Rights = $('#vRights').val();

    var act = 'SRAD_MSG_TREATMENTRIGHTS_T';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        TreatmentRights_ID: TreatmentRights_ID,
        SQL_ACTION: 'DEL'
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            var vResponse = data.Response;
            if (data.Response == 'success') {
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if (vResult == "Success") {
                    ShowNoti(vMsg, "success");
                }
                else {
                    ShowNoti(vMsg, "warning");
                }
            }
            else {
                var vResult = data.Result;
                ShowNoti(vResult, "warning");
            }
            SRAD_MSG_TREATMENTRIGHTS();
            $("#vRights").val('');
        },
        error: function () {
            ShowNoti('Failed', "warning");
        }
    });
}
function SRAD_MSG_URGENT_TYPE_INS() {

    let UG_Type_ID = $("#vUrgencyID").val();
    let Hos_OrthancID = $('#vHosOrtancID').val();
    let UG_Type_Name = $("#vUrgency").val();
    let UG_Type_Day = $("#vUrgencyDay").val();
    let UG_Type_Hour = $("#vUrgencyHour").val();
    let UG_Type_Minute = $("#vUrgencyMins").val();

    var act = 'SRAD_MSG_URGENT_TYPE';
    var url = "sapi/api.class.php?action=" + act;
    var pData = {
        UG_Type_ID: UG_Type_ID,
        Hos_OrthancID: Hos_OrthancID,
        UG_Type_Name: UG_Type_Name,
        UG_Type_Day: UG_Type_Day,
        UG_Type_Hour: UG_Type_Hour,
        UG_Type_Minute: UG_Type_Minute,
        SQL_ACTION: 'INS'
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            var vResponse = data.Response;
            if (data.Response == 'success') {
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if (vResult == "Success") {
                    ShowNoti(vMsg, "success");
                }
                else {
                    ShowNoti(vMsg, "warning");
                }
            }
            else {
                var vResult = data.Result;
                ShowNoti(vResult, "warning");
            }
            SRAD_MSG_URGENT_TYPE();
            $("#vUrgencyID").val('');
            $("#vUrgency").val('');
            $("#vUrgencyDay").val('');
            $("#vUrgencyHour").val('');
            $("#vUrgencyMins").val('');
        },
        error: function () {
            ShowNoti('Failed', "warning");
        }
    });
}
function SRAD_MSG_URGENT_TYPE_DEL(UG_Type_ID) {

    let Hos_OrthancID = $('#vHosOrtancID').val();

    var act = 'SRAD_MSG_URGENT_TYPE';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        UG_Type_ID: UG_Type_ID,
        SQL_ACTION: 'DEL'
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            var vResponse = data.Response;
            if (data.Response == 'success') {
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if (vResult == "Success") {
                    ShowNoti(vMsg, "success");
                }
                else {
                    ShowNoti(vMsg, "warning");
                }
            }
            else {
                var vResult = data.Result;
                ShowNoti(vResult, "warning");
            }
            SRAD_MSG_URGENT_TYPE();
            $("#vUrgencyID").val('');
            $("#vUrgency").val('');
            $("#vUrgencyDay").val('');
            $("#vUrgencyHour").val('');
            $("#vUrgencyMins").val('');
        },
        error: function () {
            ShowNoti('Failed', "warning");
        }
    });
}
function SRAD_MSG_HOS_ORDER_INT() {

    let OrderID = $("#vOrderID").val();
    let Order_ID = $("#vOrder_ID").val();
    let Hos_OrthancID = $('#vHosOrtancID').val();
    let Order_Header = $("#vOrder_Header").val();
    let Order_Detail = $("#vOrder_Detail").val();
    let HosOrder_Dicom = $("#vDicomDetail").val();
    let Order_Unit = $("#vOrder_Unit").val();
    let Order_PriceMS = $("#vOrder_PriceMS").val();
    let HosOrder_Price = $("#vOrder_Price").val();
    let HosOrder_DF = $("#vOrder_DF").val();

    var act = 'SRAD_MSG_HOS_ORDER';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        HosOrder_ID: Order_ID,
        Hos_OrthancID: Hos_OrthancID,
        HosOrder_Header: Order_Header,
        HosOrder_Detail: Order_Detail,
        HosOrder_Dicom: HosOrder_Dicom,
        HosOrder_Unit: Order_Unit,
        HosOrder_PriceMS: Order_PriceMS,
        HosOrder_Price: HosOrder_Price,
        HosOrder_DF: HosOrder_DF,
        SQL_ACTION: 'INS'
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            var vResponse = data.Response;
            if (data.Response == 'success') {
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if (vResult == "Success") {
                    ShowNoti(vResult, "success");
                }
                else {
                    ShowNoti(vResult, "warning");
                }
            }
            else {
                var vResult = data.Result;
                ShowNoti(vResult, "warning");
            }
            gridOrder();
            ClearText();
        },
        error: function () {
            ShowNoti('Failed', "warning");
            gridOrder();
            ClearText();
        }
    });
}

function SRAD_MSG_HOS_ORDER_UPD() {

    let OrderID = $("#vOrderID").val();
    let Order_ID = $("#vOrder_ID").val();
    let Order_Header = $("#vOrder_Header").val();
    let Order_Detail = $("#vOrder_Detail").val();
    let HosOrder_Dicom = $("#vDicomDetail").val();
    let Order_Unit = $("#vOrder_Unit").val();
    let Order_PriceMS = $("#vOrder_PriceMS").val();
    let HosOrder_Price = $("#vOrder_Price").val();
    let HosOrder_DF = $("#vOrder_DF").val();

    var act = 'SRAD_MSG_HOS_ORDER';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        HosOrderID: OrderID,
        HosOrder_Dicom: HosOrder_Dicom,
        HosOrder_Price: HosOrder_Price,
        HosOrder_DF: HosOrder_DF,
        SQL_ACTION: 'UPD'
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            var vResponse = data.Response;
            if (data.Response == 'success') {
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if (vResult == "Success") {
                    ShowNoti(vResult, "success");
                }
                else {
                    ShowNoti(vResult, "warning");
                }
            }
            else {
                var vResult = data.Result;
                ShowNoti(vResult, "warning");
            }
            gridOrder();
            ClearText();
        },
        error: function () {
            ShowNoti('Failed', "warning");
            gridOrder();
            ClearText();
        }
    });
}
function SRAD_MSG_HOS_ORDER_DEL(OrderID) {

    var act = 'SRAD_MSG_HOS_ORDER';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        OrderID: HosOrderID,
        SQL_ACTION: 'DEL'
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            var vResponse = data.Response;
            if (data.Response == 'success') {
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if (vResult == "Success") {
                    ShowNoti(vResult, "success");
                }
                else {
                    ShowNoti(vResult, "warning");
                }
            }
            else {
                var vResult = data.Result;
                ShowNoti(vResult, "warning");
            }
            gridOrder();
            ClearText();
        },
        error: function () {
            ShowNoti('Failed', "warning");
            gridOrder();
            ClearText();
        }
    });
}
function ClearText() {
    $("#vOrderID").val('');
    $("#vOrder_ID").val('');
    $("#vOrder_Header").val('');
    $("#vOrder_Detail").val('');
    $("#vDicomDetail").val('');
    $("#vOrder_Unit").val('');
    $("#vOrder_PriceMS").val('');
    $("#vOrder_Price").val('');
    $("#vOrder_DF").val('');
    $('#gridOrder').jqxGrid('clearselection');
}

module.exports = {
    Start_Hospital
}
