$(document).ready(function () {

    theme = 'energyblue';
    // User_TypeID = 1; //Admin
	// User_TypeID = 2; //Technician
	// User_TypeID = 3; //Accountant
	// User_TypeID = 4; //Radiologist
	// User_TypeID = 5; //RefferalDocter
	// User_TypeID = 6; //DepartmentPublicComputer
    // User_TypeID = 7; //Patient
    
});

function Start_SideBar(usertype){
    /////////////////////////SET LINK//////////////////////////////////
    $("#MHadmin").hide();
    $("#NewHadmin").hide();
    $("#Hadmin").hide();
    $("#MainMenu").hide();
    $("#MainMenu2").hide();
    $("#MainMenu3").hide();
    $("#MainMenu4").hide();
    $("#Maccount").hide();
    $("#MHAccount").hide();
    $("#Radiologist").hide();
    $("#ReferringPhysician").hide();
    $("#MHMtech").hide();
    $("#Mtech").hide();
    $("#MHRadiologist").hide();
    $("#MTechHospital").hide();
    $("#MHReferringPhysician").hide();
    $("#MReportDesign").hide();
    $("#MHReportDesign").hide()
    $("#GeneralTag").show();

    var User_TypeID = usertype;

    if (User_TypeID == '1') {
        // Admin
        // $("#MainMenu").show();
        // $("#MainMenu2").show();
        // $("#MainMenu3").show();
        // $("#MHAccount").show();
        // $("#Maccount").show();
        // $("#Mdoctor").show();
        // $("#Mtech").show();
        // $("#Radiologist").show();
        // $("#MHRadiologist").show();
        // $("#MHMtech").show();
        // $("#MTechHospital").show();
        // $("#MHReferringPhysician").show();
        // $("#ReferringPhysician").show();
        $("#MHadmin").show();
        $("#Hadmin").show();
        $("#NewHadmin").show();
        // $("#MainMenu4").show();
        $("#MReportDesign").hide();
        $("#GeneralTag").hide();
    }



    if (User_TypeID == '4') {
        //Radiologist
        $("#Radiologist").show();
        $("#MainMenu").show();
        // $("#MainMenu2").show();
        $("#MainMenu3").show();
        $("#MHRadiologist").show();
        $("#MainMenu4").show();
        $("#MReportDesign").hide();
    }


    if (User_TypeID == '2') {
        //Technician
        $("#Mtech").show();
        $("#MainMenu").show();
        // $("#MainMenu2").show();
        $("#MTechHospital").show();
        $("#MainMenu3").show();
        $("#MHMtech").show();
        $("#MainMenu4").show();
        $("#MHReportDesign").show();
        $("#MReportDesign").show();
    }

    if (User_TypeID == '5') {
        //RefferalDocter
        $("#MainMenu").show();
        // $("#MainMenu2").show();
        $("#MHReferringPhysician").show();
        $("#ReferringPhysician").show();
        $("#CaseActiveDisPlay").hide();
        $("#HospitalDisPlay").hide();
        // $("#MainMenu3").show();
        $("#MHReferringPhysician").show();
        $("#MainMenu4").show();
        $("#MHReportDesign").show();
        $("#MReportDesign").show();
    }

    if (User_TypeID == '3') {
        //Accountant
        $("#Maccount").show();
        $("#MHAccount").show();
        // $("#MainMenu2").show();
        $("#MHAccount").show();
    }
    
}

    /////////////////// New Code jqxTooltip ///////////////////////////
function jqxTooltopSidebar(){
    /////////RadiologistDoctor/////// 
    $("#MainMenu").jqxTooltip({ showDelay: 1000, position: 'top', content: 'เคสใหม่' });
    $("#MainMenu2").jqxTooltip({ showDelay: 1000, position: 'top', content: 'เคสทั้งหมด' });
    $("#Radiologist").jqxTooltip({ showDelay: 1000, position: 'top', content: 'รังสีแพทย์' });
    $("#collapseRadiologistDoctor").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ข้อมูลส่วนตัว' });
    $("#collapseTech").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ข้อมูลส่วนตัว' });

    $("#collapseDoctor-Xray-Date1").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Xray-Date1(1Day)' });
    $("#collapseDoctor-Xray-Date2").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Xray-Date2(3Day)' });
    $("#collapseDoctor-Xray-Date3").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Xray-Date3(All)' });
    $("#collapseDoctor-Xray-Read").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Xray-Read(มีผลอ่านแล้ว)' });
    $("#collapseDoctor-Xray-UnRead").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Xray-UnRead(ยังไม่มีผลอ่านแล้ว)' });
    $("#collapseDoctor-Xray-All").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Xray-All' });

    $("#collapseDoctor-MG-Date1").jqxTooltip({ showDelay: 1000, position: 'top', content: 'MG-Date1(1Day)' });
    $("#collapseDoctor-MG-Date2").jqxTooltip({ showDelay: 1000, position: 'top', content: 'MG-Date2(3Day)' });
    $("#collapseDoctor-MG-Date3").jqxTooltip({ showDelay: 1000, position: 'top', content: 'MG-Date3(All)' });
    $("#collapseDoctor-MG-Read").jqxTooltip({ showDelay: 1000, position: 'top', content: 'MG-Read(มีผลอ่านแล้ว)' });
    $("#collapseDoctor-MG-UnRead").jqxTooltip({ showDelay: 1000, position: 'top', content: 'MG-UnRead(ยังไม่มีผลอ่านแล้ว)' });
    $("#collapseDoctor-MG-All").jqxTooltip({ showDelay: 1000, position: 'top', content: 'MG-All' });

    $("#collapseDoctor-US-Date1").jqxTooltip({ showDelay: 1000, position: 'top', content: 'US-Date1(1Day)' });
    $("#collapseDoctor-US-Date2").jqxTooltip({ showDelay: 1000, position: 'top', content: 'US-Date2(3Day)' });
    $("#collapseDoctor-US-Date3").jqxTooltip({ showDelay: 1000, position: 'top', content: 'US-Date3(All)' });
    $("#collapseDoctor-US-Read").jqxTooltip({ showDelay: 1000, position: 'top', content: 'US-Read(มีผลอ่านแล้ว)' });
    $("#collapseDoctor-US-UnRead").jqxTooltip({ showDelay: 1000, position: 'top', content: 'US-UnRead(ยังไม่มีผลอ่านแล้ว)' });
    $("#collapseDoctor-US-All").jqxTooltip({ showDelay: 1000, position: 'top', content: 'US-All' });

    $("#collapseDoctor-CT-Date1").jqxTooltip({ showDelay: 1000, position: 'top', content: 'CT-Date1(1Day)' });
    $("#collapseDoctor-CT-Date2").jqxTooltip({ showDelay: 1000, position: 'top', content: 'CT-Date2(3Day)' });
    $("#collapseDoctor-CT-Date3").jqxTooltip({ showDelay: 1000, position: 'top', content: 'CT-Date3(All)' });
    $("#collapseDoctor-CT-Read").jqxTooltip({ showDelay: 1000, position: 'top', content: 'CT-Read(มีผลอ่านแล้ว)' });
    $("#collapseDoctor-CT-UnRead").jqxTooltip({ showDelay: 1000, position: 'top', content: 'CT-UnRead(ยังไม่มีผลอ่านแล้ว)' });
    $("#collapseDoctor-CT-All").jqxTooltip({ showDelay: 1000, position: 'top', content: 'CT-All' });

    $("#collapseDoctor-MR-Date1").jqxTooltip({ showDelay: 1000, position: 'top', content: 'MR-Date1(1Day)' });
    $("#collapseDoctor-MR-Date2").jqxTooltip({ showDelay: 1000, position: 'top', content: 'MR-Date2(3Day)' });
    $("#collapseDoctor-MR-Date3").jqxTooltip({ showDelay: 1000, position: 'top', content: 'MR-Date3(All)' });
    $("#collapseDoctor-MR-Read").jqxTooltip({ showDelay: 1000, position: 'top', content: 'MR-Read(มีผลอ่านแล้ว)' });
    $("#collapseDoctor-MR-UnRead").jqxTooltip({ showDelay: 1000, position: 'top', content: 'MR-UnRead(ยังไม่มีผลอ่านแล้ว)' });
    $("#collapseDoctor-MR-All").jqxTooltip({ showDelay: 1000, position: 'top', content: 'MR-All' });

    $("#collapseDoctor-XA-Date1").jqxTooltip({ showDelay: 1000, position: 'top', content: 'XA-Date1(1Day)' });
    $("#collapseDoctor-XA-Date2").jqxTooltip({ showDelay: 1000, position: 'top', content: 'XA-Date2(3Day)' });
    $("#collapseDoctor-XA-Date3").jqxTooltip({ showDelay: 1000, position: 'top', content: 'XA-Date3(All)' });
    $("#collapseDoctor-XA-Read").jqxTooltip({ showDelay: 1000, position: 'top', content: 'XA-Read(มีผลอ่านแล้ว)' });
    $("#collapseDoctor-XA-UnRead").jqxTooltip({ showDelay: 1000, position: 'top', content: 'XA-UnRead(ยังไม่มีผลอ่านแล้ว)' });
    $("#collapseDoctor-XA-All").jqxTooltip({ showDelay: 1000, position: 'top', content: 'XA-All' });

    $("#collapseDoctor-All-Date1").jqxTooltip({ showDelay: 1000, position: 'top', content: 'All-Date1(1Day)' });
    $("#collapseDoctor-All-Date2").jqxTooltip({ showDelay: 1000, position: 'top', content: 'All-Date2(3Day)' });
    $("#collapseDoctor-All-Date3").jqxTooltip({ showDelay: 1000, position: 'top', content: 'All-Date3(All)' });
    $("#collapseDoctor-All-Read").jqxTooltip({ showDelay: 1000, position: 'top', content: 'All-Read(มีผลอ่านแล้ว)' });
    $("#collapseDoctor-All-UnRead").jqxTooltip({ showDelay: 1000, position: 'top', content: 'All-UnRead(ยังไม่มีผลอ่านแล้ว)' });
    $("#collapseDoctor-All-All").jqxTooltip({ showDelay: 1000, position: 'top', content: 'All-All' });
    //////////////////////////////////////////////////////////////////////////////////

    /////// Click sidebar to filter in table Xray //////////
    $('#collapseDoctor-Xray-Date1').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////

        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate()));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        // Must be "19 Aug 2020 00:00:00 - 19 Aug 2020 23:59:59"
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange', start, end);
        //$('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'New Case');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'X-ray');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });

    $('#collapseDoctor-Xray-Date2').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange', start, end);
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'X-ray');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });

    $('#collapseDoctor-Xray-Date3').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        //$('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange',start,end);
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'X-ray');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-Xray-Read').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'Doctor Response');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'X-ray');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-Xray-UnRead').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'Wait Accept');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'X-ray');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-Xray-All').on('click', function () {
        //$('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange',start,end);
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'X-ray');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('close');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    ///////////////// END X-ray  ////////////////////

    /////// Click sidebar to filter in table MG //////////
    $('#collapseDoctor-MG-Date1').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////

        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate()));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        // Must be "19 Aug 2020 00:00:00 - 19 Aug 2020 23:59:59"
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange', start, end);
        //$('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'New Case');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'MG');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-MG-Date2').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange', start, end);
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'MG');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });

    $('#collapseDoctor-MG-Date3').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        //$('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange',start,end);
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'MG');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-MG-Read').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'Doctor Response');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'MG');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-MG-UnRead').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'Wait Accept');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'MG');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-MG-All').on('click', function () {
        //$('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange',start,end);
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'MG');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('close');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    ///////////////// END MG  ////////////////////

    /////// Click sidebar to filter in table US //////////
    $('#collapseDoctor-US-Date1').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////

        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate()));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        // Must be "19 Aug 2020 00:00:00 - 19 Aug 2020 23:59:59"
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange', start, end);
        //$('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'New Case');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'US');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-US-Date2').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange', start, end);
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'US');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('close');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });

    $('#collapseDoctor-US-Date3').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        //$('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange',start,end);
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'US');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-US-Read').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'Doctor Response');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'US');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-US-UnRead').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'Wait Accept');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'US');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-US-All').on('click', function () {
        //$('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange',start,end);
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'US');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('close');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    ///////////////// END US  ////////////////////

    /////// Click sidebar to filter in table CT //////////
    $('#collapseDoctor-CT-Date1').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////

        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate()));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        // Must be "19 Aug 2020 00:00:00 - 19 Aug 2020 23:59:59"
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange', start, end);
        //$('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'New Case');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'CT');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });

    $('#collapseDoctor-CT-Date2').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange', start, end);
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'CT');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });

    $('#collapseDoctor-CT-Date3').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        //$('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange',start,end);
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'CT');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-CT-Read').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'Doctor Response');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'CT');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-CT-UnRead').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'Wait Accept');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'CT');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-CT-All').on('click', function () {
        //$('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange',start,end);
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'CT');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('close');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    ///////////////// END CT  ////////////////////

    /////// Click sidebar to filter in table MR //////////
    $('#collapseDoctor-MR-Date1').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////

        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate()));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        // Must be "19 Aug 2020 00:00:00 - 19 Aug 2020 23:59:59"
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange', start, end);
        //$('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'New Case');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'MR');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-MR-Date2').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange', start, end);
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'MR');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });

    $('#collapseDoctor-MR-Date3').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        //$('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange',start,end);
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'MR');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-MR-Read').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'Doctor Response');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'MR');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-MR-UnRead').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'Wait Accept');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'MR');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-MR-All').on('click', function () {
        //$('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange',start,end);
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'MR');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('close');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    ///////////////// END MR  ////////////////////

    /////// Click sidebar to filter in table XA //////////
    $('#collapseDoctor-XA-Date1').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////

        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate()));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        // Must be "19 Aug 2020 00:00:00 - 19 Aug 2020 23:59:59"
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange', start, end);
        //$('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'New Case');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'XA');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-XA-Date2').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange', start, end);
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'XA');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });

    $('#collapseDoctor-XA-Date3').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        //$('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange',start,end);
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'XA');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-XA-Read').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'Doctor Response');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'XA');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-XA-UnRead').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'Wait Accept');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'XA');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-XA-All').on('click', function () {
        //$('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange',start,end);
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkItem', 'XA');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('close');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    ///////////////// END XA  ////////////////////

    /////// Click sidebar to filter in table All //////////
    $('#collapseDoctor-All-Date1').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////

        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate()));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        // Must be "19 Aug 2020 00:00:00 - 19 Aug 2020 23:59:59"
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange', start, end);
        //$('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'New Case');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-All-Date2').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange', start, end);
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });

    $('#collapseDoctor-All-Date3').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        /////////////////////////////////////////////////
        var today = new Date();
        var yesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        var start = today;
        var end = yesterday;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        //$('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange',start,end);
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-All-Read').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'Doctor Response');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-All-UnRead').on('click', function () {
        // New Case
        // Wait Accept
        // Accepted
        // Doctor Response
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkItem', 'Wait Accept');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    $('#collapseDoctor-All-All').on('click', function () {
        //$('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('setRange',start,end);
        //////////////////// Reset //////////////////////
        $('#row00gridCaseActive').children().eq(2).children().eq(0).jqxDateTimeInput('clear');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('uncheckAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('uncheckAll');
        /////////////////////////////////////////////////
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('checkAll');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('checkAll');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(1).children().eq(0).jqxDropDownList('close');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('open');
        $('#row00gridCaseActive').children().eq(9).children().eq(0).jqxDropDownList('close');
    });
    ///////////////// END All  ////////////////////

    setTimeout(function () {
        jqxTooltopSidebar();
    }, 2000);
};

module.exports = {
    Start_SideBar
}
    


