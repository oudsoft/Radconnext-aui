$(document).ready(function () {

});

function Start_OrderList(){
    
    var theme = 'energyblue';
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
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
                { text: 'รหัส', datafield: 'Order_ID', align: 'center', cellsalign: 'center', width: 80 },
                { text: 'หัวข้อ', datafield: 'Order_Header', align: 'center', width: 200, filtertype: 'checkedlist' },
                { text: 'รายการ', datafield: 'Order_Detail', align: 'center', minwidth: 350 },
                { text: 'จำนวน(Link)', datafield: 'TotalDetail', align: 'center', cellsalign: 'center', width: 80 },
                { text: 'หน่วย', datafield: 'Order_Unit', align: 'center', cellsalign: 'center', width: 80, filtertype: 'checkedlist' },
                { text: 'ราคา', datafield: 'Order_Price', align: 'center', cellsalign: 'right', width: 80, cellsformat: 'c2' },
                {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: 60,
                    cellsrenderer: function (row) { return "Delete"; }, buttonclick: function (row) {
                        Editrow = row;
                        var offset = $("#gridOrder").offset();

                        var dataRecord = $("#gridOrder").jqxGrid('getrowdata', Editrow);
                        var ID = dataRecord.ID;
                        var Order_ID = dataRecord.Order_ID;

                        if (confirm("Do you want to Delete Hospital " + Order_ID + "?")) {
                            SRAD_MSG_ORDER_DEL(ID);
                        }
                    }
                }
            ]
        });
    gridOrder();

    $("#gridOrder").on('rowselect', function (event) {
        let pRow = event.args.row;
        var OrderID = pRow.ID;
        var Order_ID = pRow.Order_ID;
        var Order_Header = pRow.Order_Header;
        var Order_Detail = pRow.Order_Detail;
        var Order_Unit = pRow.Order_Unit;
        var Order_Price = pRow.Order_Price;

        $("#vOrderID").val(OrderID);
        $("#vOrder_ID").val(Order_ID);
        $("#vOrder_Header").val(Order_Header);
        $("#vOrder_Detail").val(Order_Detail);
        $("#vOrder_Unit").val(Order_Unit);
        $("#vOrder_Price").val(Order_Price);

        $("#sOrder_ID").html(Order_ID);

        gridOrderLink(Order_ID)
    });

    $("#gridOrderLink").jqxGrid(
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
                { text: 'รหัส', datafield: 'Order_ID', align: 'center', cellsalign: 'center', width: 80 },
                { text: 'Dicom Detail', datafield: 'Dicom_DESC', align: 'center', minwidth: 200 },
                {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: 60,
                    cellsrenderer: function (row) { return "Delete"; }, buttonclick: function (row) {
                        Editrow = row;
                        var offset = $("#gridOrderLink").offset();

                        var dataRecord = $("#gridOrderLink").jqxGrid('getrowdata', Editrow);
                        var Order_ID = dataRecord.Order_ID;
                        var OrderLink_ID = dataRecord.OrderLink_ID;
                        var Dicom_DESC = dataRecord.Dicom_DESC;

                        if (confirm("Do you want to Delete " + Dicom_DESC + "?")) {
                            SRAD_MSG_ORDER_LINK_DEL(OrderLink_ID, Order_ID);
                        }
                    }
                }
            ]
        });

    $('#SaveOrder').click(function () {
        SRAD_MSG_ORDER_INT();
    });
    $('#CancelOrder').click(function () {
        var win = window.open('index.php', '_self');
        win.focus();
    });
    $('#SaveOrderLink').click(function () {
        SRAD_MSG_ORDER_LINK();
    });
}

function gridOrderLink(Order_ID) {
    var act = 'SRAD_MSG_ORDER_LINK';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        Order_ID: Order_ID,
        SQL_ACTION: "SEC"
    };

    var source =
    {
        type: 'POST',
        datatype: "json",
        datafields: [
            { name: 'OrderLink_ID', type: 'string' },
            { name: 'Order_ID', type: 'string' },
            { name: 'Dicom_DESC', type: 'string' }
        ],
        id: 'id',
        url: url,
        data: pData
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#gridOrderLink").jqxGrid({ source: dataAdapter });
}
function gridOrder() {
    var act = 'SRAD_MSG_ORDER';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        SQL_ACTION: "SEC"
    };

    var source =
    {
        type: 'POST',
        datatype: "json",
        datafields: [
            { name: 'ID', type: 'string' },
            { name: 'Order_ID', type: 'string' },
            { name: 'Order_Header', type: 'string' },
            { name: 'Order_Detail', type: 'string' },
            { name: 'Order_Unit', type: 'string' },
            { name: 'Order_Price', type: 'number' },
            { name: 'TotalDetail', type: 'number' }
        ],
        id: 'id',
        url: url,
        data: pData
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#gridOrder").jqxGrid({ source: dataAdapter });
}

function SRAD_MSG_ORDER_INT() {

    let OrderID = $("#vOrderID").val();
    let Order_ID = $("#vOrder_ID").val();
    let Order_Header = $("#vOrder_Header").val();
    let Order_Detail = $("#vOrder_Detail").val();
    let Order_Unit = $("#vOrder_Unit").val();
    let Order_Price = $("#vOrder_Price").val();

    var act = 'SRAD_MSG_ORDER';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        OrderID: OrderID,
        Order_ID: Order_ID,
        Order_Header: Order_Header,
        Order_Detail: Order_Detail,
        Order_Unit: Order_Unit,
        Order_Price: Order_Price,
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
function SRAD_MSG_ORDER_DEL(OrderID) {

    var act = 'SRAD_MSG_ORDER';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        OrderID: OrderID,
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
function SRAD_MSG_ORDER_LINK_DEL(OrderLinkID, Order_ID) {

    var act = 'SRAD_MSG_ORDER_LINK';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        OrderLinkID: OrderLinkID,
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
                    ShowNoti(vResult, "warning");
                }
            }
            else {
                var vResult = data.Result;
                ShowNoti(vResult, "warning");
            }
            gridOrderLink(Order_ID);
        },
        error: function () {
            ShowNoti('Failed', "warning");
        }
    });
}
function SRAD_MSG_ORDER_LINK() {

    let Order_ID = $('#sOrder_ID').html();
    let Dicom_DESC = $('#vDicomDetail').val();

    var act = 'SRAD_MSG_ORDER_LINK';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        Order_ID: Order_ID,
        Dicom_DESC: Dicom_DESC,
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
                    ShowNoti(vResult, "warning");
                }
            }
            else {
                var vResult = data.Result;
                ShowNoti(vResult, "warning");
            }
            gridOrderLink(Order_ID);
            $("#vDicomDetail").val('');
        },
        error: function () {
            ShowNoti('Failed', "warning");
        }
    });
}
function ShowNoti(Msg, Type) {
    $("#MessageNoti").html(Msg);
    $("#Notification").jqxNotification({ template: Type });
    $("#Notification").jqxNotification("open");
}
function ClearText() {
    $("#vOrderID").val('');
    $("#vOrder_ID").val('');
    $("#vOrder_Header").val('');
    $("#vOrder_Detail").val('');
    $("#vOrder_Unit").val('');
    $("#vOrder_Price").val('');
}


module.exports = {
    Start_OrderList
}