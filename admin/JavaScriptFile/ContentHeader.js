$(document).ready(function () {
    //GetTotalCase();
    
});

function Start_ContentHeader(){
    var theme = 'energyblue';
    $("#Notification").jqxNotification({
        width: 450, position: "top-right", opacity: 0.9,
        autoOpen: false, animationOpenDelay: 800, autoClose: true, autoCloseDelay: 3000
    });

    /////////////////// New Code jqxTooltip /////////////////////////
    $("#HospitalDisPlay").jqxTooltip({ showDelay: 1000, position: 'top', content: 'HospitalDisPlay' });
    $("#CaseActiveDisPlay").jqxTooltip({ showDelay: 1000, position: 'top', content: 'CaseActive' });
}

var GetTotalCase = function () {
    //var act = 'SRAD_GET_CASE_ROW';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        User_ID: vUserID,
        Type: User_Type
    };
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: "json",
            data: pData,
            success: function (data) {
                if (data.Response == 'success') {
                    $('#sTotalCase').html(data.data[0].TotalCase);
                    $('#sTotalHos').html(data.data[0].TotalHos);
                    $('#ANewCase').html(data.data[0].NEW_CASE);
                    $('#AWaitAccept').html(data.data[0].Wait_Accept);
                    $('#AAccepted').html(data.data[0].Accepted);
                    $('#AResponed').html(data.data[0].DoctorResponse);

                    if (User_TypeID == '1') {
                        $('#HNewCase').html(data.data[0].NEW_CASE);
                        $('#sNewCase').html(data.data[0].NEW_CASE);
                    }
                    else if (User_TypeID == '3') {
                        $('#HNewCase').html(data.data[0].NEW_CASE);
                        $('#sNewCase').html(data.data[0].NEW_CASE);
                    }
                    else {
                        $('#HNewCase').html(data.data[0].Wait_Accept);
                        $('#sNewCase').html(data.data[0].Wait_Accept);
                    }
                }
            }
        });
    });
};

module.exports = {
    Start_ContentHeader,
}