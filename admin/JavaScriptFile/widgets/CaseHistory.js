$(document).ready(function () {

    

    // setTimeout(function () {
    //     gridAppear();
    // }, delayInMilliseconds);
    // setTimeout(function () {
    //     jqxTooltipAppear();
    // }, delayInMilliseconds);
    // setTimeout(function () {
    //     jqxListBoxAppear();
    // }, delayInMilliseconds);

});

function Start_CaseHistory(){
    var theme = 'energyblue';
    var delayInMilliseconds = 1000; //1 second
    /////////////////// New Code to not back page to login /////////////////////////
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function (event) {
        //alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
        window.history.pushState(null, "", window.location.href);
        if ($("#gridCaseActive").is(":hidden")) {
            $("#GridCase").show();
            $("#ManageCaseDoctor").hide();
        } else {
            if (confirm("ต้องการกลับมาหน้าแสดงเคสวันนี้หรือไม่!")) {
                $('#collapseDoctor-All-Date1').click();
            } else {
                $('#vClear').click();
            }
        }
    };
    /////////////////// New Code to not back page to login /////////////////////////

    vTotalCase = $('#sTotalCase').html();
    vNewCase = $('#sNewCase').html();
    vWaitAccept = $('#AWaitAccept').html();
    vAccepted = $('#AAccepted').html();

    $("#ManageCase").hide();
    $('#vMtypeDetail').hide();
    $('#frmRenewCase').hide();
    $("#ManageCaseDoctor").hide();
    // $("#ManageCase").show();
    // $('#vMtypeDetail').show();
    // $('#frmRenewCase').show();
    // $("#ManageCaseDoctor").show();

    var Case_ID;
    var Case_Status;
    var Case_TechID;
    var Case_OrthancID;

    $("#CancelCase").on('click', function () {
        var CaseStatus = $('#CaseStatus').val();
        //var vDate = Y + m;
        gridCaseActive(User_HosID);

        $("#ManageCase").hide();
        scrollToTop();
        $("#DoctorID").val("");
        $("#TechID").val("");
        $("#vCaseID").val("");
        $("#RightID").val("");
        $("#sRights").html("");
        $("#GridCase").show();
    });

    $("#ReportCase").on('click', function () {
        var CaseID = $("#vCaseID").val();
        var url = "sapi/rad_report.php?CaseID=" + CaseID;
        openInNewTab(url);
    });

    $("#vClear").on('click', function () {
        //$("#vMouth").jqxDropDownList('selectIndex', 0);
        //$("#vYear").jqxDropDownList('selectIndex', 0);
        //var vDate = '00';
        //gridCaseActive(vDate);
        gridCaseActive(User_HosID);
    });

    $("#RenewCase").on('click', function () {
        let vCaseID = $('#vCaseID').val();
        let vTechID = $('#TechID').val();
        // SRAD_UPDATE_CASE_DOC(vCaseID, vTechID, '0', '0', '');
    });

    const StartGrid = gridAppear();  
    StartGrid.then( (data) => {
        gridCaseActive(User_HosID);
    }).finally( (response) => {
        setTimeout(function (){
            jqxTooltipAppear();
            jqxListBoxAppear();
        },1000);
        
    });
}

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
                gridCaseActive(User_HosID);
            }
            catch {
                location.reload();
            }
        }

        if (vNewCase != ChkvNewCase && !ChkRe) {
            gridCaseActive(User_HosID);
        }

        if (vWaitAccept != ChkvWaitAccept && !ChkRe) {
            gridCaseActive(User_HosID);
        }

        if (vAccepted != ChkvAccepted && !ChkRe) {
            gridCaseActive(User_HosID);
        }

        vTotalCase = $('#sTotalCase').html();
        vNewCase = $('#sNewCase').html();
        vWaitAccept = $('#AWaitAccept').html();
        vAccepted = $('#AResponed').html();
    }, 1000 * 3);


}


function jqxTooltipAppear() {
    $("#vClear").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Clear Filter' });
    $("#openButton").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ตั้งค่าการแสดง column' });
    $("#vConsult").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Consult/Review' });
    //$("#columntablegridCaseActive").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง' });

    if (!($('#gridCaseActive').is(":hidden"))) {
        $("#row00gridCaseActive").children().eq(2).jqxTooltip({ showDelay: 1000, position: 'top', content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง' });
        $("#row00gridCaseActive").children().eq(3).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(4).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(6).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(7).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(8).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
    }


    if (!($('#gridPatient').is(":hidden"))) {
        $("#row00gridPatient").children().eq(1).jqxTooltip({ showDelay: 1000, position: 'top', content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง' });
        $("#row00gridPatient").children().eq(3).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridPatient").children().eq(4).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridPatient").children().eq(5).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridPatient").children().eq(6).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
    }
}


function gridAppear() {
    ///////////////// Tooltips Header Column /////////////////////////////
    return new Promise(function (resolve, reject) {
        var theme = 'energyblue';
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
            Editrow = row;
            var offset = $("#gridCaseActive").offset();
            var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);
            var STATUS_Name = dataRecord.CS_Name_EN;
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

        var cellsrenderer2 = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
            Editrow = row;
            var offset = $("#gridPatient").offset();
            var dataRecord = $("#gridPatient").jqxGrid('getrowdata', Editrow);
            var STATUS_Name = dataRecord.CS_Name_EN;
            //var STATUS_Name_TH = dataRecord.CASE_STATUS_Name_TH;

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
        var tooltiprenderer = function (element) {
            $(element).parent().jqxTooltip({ position: 'top', content: "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง" });
        };


        // $("#gridPatient").jqxGrid({
        //     width: "100%",
        //     height: 333,
        //     sortable: true,
        //     altrows: true,
        //     filterable: true,
        //     showfilterrow: true,
        //     autorowheight: true,
        //     columnsreorder: true,
        //     columnsresize: true,
        //     pageable: true,
        //     pagesize: 20,
        //     scrollmode: 'logical',
        //     autoShowLoadElement: false,
        //     pagesizeoptions: ['20', '50', '100', '500'],
        //     theme: theme,
        //     columns: [
        //         { text: '#', datafield: 'Row', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: 35 },
        //         { text: 'วันที่ตรวจ', datafield: 'createdAt', align: 'center', cellsalign: 'center', cellsformat: 'dd MMM yyyy HH:mm:ss', rendered: tooltiprenderer, filtertype: 'range', width: 90 },
        //         { text: 'Modality', datafield: 'Case_Modality', align: 'center', width: 70, rendered: tooltiprenderer, filtertype: 'checkedlist' },
        //         { text: 'Protocol Name', datafield: 'Case_ProtocolName', align: 'center', rendered: tooltiprenderer, minwidth: 120 },
        //         { text: 'Study Description', datafield: 'Case_StudyDescription', align: 'center', rendered: tooltiprenderer, minwidth: 200 },
        //         { text: 'แพทย์ผู้ส่ง', datafield: 'Patient_RefferalDoctor', align: 'center', rendered: tooltiprenderer, minwidth: 200 },
        //         { text: 'รังสีแพทย์', datafield: 'Patient_RadiologistDoctor', align: 'center', rendered: tooltiprenderer, width: 150 },
        //         { text: 'Status', datafield: 'CS_Name_EN', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', rendered: tooltiprenderer, cellsrenderer: cellsrenderer2, width: 100 },
        //     ]
        // });
        //gridPatientActive(Case_ID);

        $("#gridPatient").jqxGrid(
            {
                width: "100%",
                height: 533,
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
                columns: [
                    { text: '#', datafield: 'Row', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: 35 },
                    { text: 'วันที่ตรวจ', datafield: 'createdAt', align: 'center', cellsalign: 'center', cellsformat: 'dd MMM yyyy HH:mm:ss', rendered: tooltiprenderer, filtertype: 'range', width: 90 },
                    { text: 'Modality', datafield: 'Case_Modality', align: 'center', cellsalign: 'center' ,width: 70, rendered: tooltiprenderer, filtertype: 'checkedlist' },
                    { text: 'Protocol Name', datafield: 'Case_ProtocolName', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, minwidth: 120 },
                    { text: 'Study Description', datafield: 'Case_StudyDescription', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, minwidth: 200 },
                    { text: 'แพทย์ผู้ส่ง', datafield: 'Patient_RefferalDoctor', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, minwidth: 200 },
                    { text: 'รังสีแพทย์', datafield: 'Patient_RadiologistDoctor', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: 150 },
                    { text: 'Status', datafield: 'CS_Name_EN', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', rendered: tooltiprenderer, width: 100 },
                ]
            });

        $("#gridCaseActive").jqxGrid(
            {
                width: "100%",
                height: 533,
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
                columns: [
                    
                    { text: '#', datafield: 'Row', align: 'center', cellsalign: 'center', width: 35 },
                    { text: 'สถานะ', datafield: 'CS_Name_EN', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', rendered: tooltiprenderer, width: 100 },
                    //{ text: 'สถานะ', datafield: 'CS_Name_EN', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', cellsrenderer: cellsrenderer, rendered: tooltiprenderer, width: 100 },
                    { text: 'วันที่', datafield: 'createdAt', align: 'center', cellsalign: 'center', cellsformat: 'dd MMM yyyy HH:mm:ss', cellsrenderer: Timecellsrenderer , filtertype: 'range', rendered: tooltiprenderer, width: 150 },
                    { text: '#HN', datafield: 'Patient_HN', align: 'center', rendered: tooltiprenderer, width: 100 },
                    { text: 'ผู้รับการตรวจ(อังกฤษ)', datafield: 'FullName_EN', align: 'center', rendered: tooltiprenderer, width: 250 },
                    { text: 'ผู้รับการตรวจ(ไทย)', datafield: 'FullName_TH', align: 'center', rendered: tooltiprenderer, width: 250 },
                    { text: 'เพศ', datafield: 'Patient_Sex', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', rendered: tooltiprenderer, width: 50 },
                    { text: 'อายุ', datafield: 'Patient_Age', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: 50 },
                    { text: 'Description', datafield: 'Case_StudyDescription', align: 'center', rendered: tooltiprenderer, width: 120 },
                    { text: 'Protocol', datafield: 'Case_ProtocolName', align: 'center', rendered: tooltiprenderer, minwidth: 120 },
                    { text: 'Modality', datafield: 'Case_Modality', align: 'center', width: 70, rendered: tooltiprenderer, filtertype: 'checkedlist' },
                    { text: 'Accession Number', datafield: 'Case_ACC', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, filtertype: 'checkedlist', width: 100 },
                ]
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

        $("#gridPatient").on('rowdoubleclick', function (row) {
            //console.log("Row with bound index: " + row.args.rowindex + " has been double-clicked.");
            Editrow = row.args.rowindex;
            var offset = $("#gridPatient").offset();
            var dataRecord = $("#gridPatient").jqxGrid('getrowdata', Editrow);

            $("#gridPatientData").val(JSON.stringify(dataRecord));

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

        $("#gridPatient").on('rowclick', function (row) {

            //console.log("Row with bound index: " + row.args.rowindex + " has been double-clicked.");
            Editrow = row.args.rowindex;
            var offset = $("#gridPatient").offset();
            var dataRecord = $("#gridPatient").jqxGrid('getrowdata', Editrow);

            $("#gridPatientData").val(JSON.stringify(dataRecord));
            var CaseID = dataRecord.Case_ID;
            // var Case_DocRespone = dataRecord.Case_DocRespone;
            
            const Promise_SelectCaseRespones = SelectCaseRespones(CaseID);
            Promise_SelectCaseRespones.then( (data) => {
                if(data.status.code === 200 && data.Record.length > 0 ){
                    $("#TextResponse").val(data.Record[0]);
                    $("#pRespone").val(data.Record[0].Response_Text);
                }
            }).catch( (reject) => {
                console.log("Error Promise_SelectCaseRespones : " + reject);
            });

            // $('#pRespone').val(Case_DocRespone);
        });

        $("#gridCaseActive").on('rowdoubleclick', function (row) {

            //alert("Row with bound index: " + row.args.rowindex + " has been double-clicked.");
            Editrow = row.args.rowindex;
            //alert(Editrow);
            // User_Hospital_Name
            var offset = $("#gridCaseActive").offset();
            var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);

            $("#gridCaseActiveData").val(JSON.stringify(dataRecord));
            $("#OrthancStudyID").val(dataRecord.Case_OrthancStudyID);

            var CaseID = dataRecord.Case_ID;
            var TechID = dataRecord.Case_TechID;
            var FullName_EN = dataRecord.FullName_EN;
            var Hos_OrthancID = dataRecord.hospitalId;
            var Hos_Name = User_Hospital_Name;
            var Patient_HN = dataRecord.Patient_HN;
            var Patient_Name = dataRecord.Patient_NameEN;
            var Patient_LastName = dataRecord.Patient_LastNameEN;
            var Case_StudyDescription = dataRecord.Case_StudyDescription;
            var Patient_ID = dataRecord.Patient_ID;
            var Patient_Sex = dataRecord.Patient_Sex;
            var Patient_Age = dataRecord.Patient_Age;
            var Patient_Birthday = dataRecord.Patient_Birthday;
            var Patient_CitizenID = dataRecord.Patient_CitizenID;
            var CS_Name_EN = dataRecord.CS_Name_EN; // CasrStatus
            var TreatmentRights_ID = dataRecord.TreatmentRights_ID;
            var TreatmentRights_Name = dataRecord.TreatmentRights_Name;
            var Patient_XDoc = dataRecord.DocFullName;
            var UG_Type_Name = dataRecord.UG_Type_Name;
            var Case_UrgentType = dataRecord.UGType_Name;
            var Patient_RefferalDoctor = dataRecord.Patient_RefferalDoctor;
            var ProtocolName = dataRecord.Case_ProtocolName;
            var Modality = dataRecord.Case_Modality;
            var Case_DocRespone = dataRecord.Case_DocRespone;
            var Patient_RadiologistDoctor = dataRecord.Patient_RadiologistDoctor;
            var createdAt = dataRecord.createdAt;
            Case_ID = dataRecord.Case_ID;
            Case_TechID = dataRecord.Case_TechID;
            Case_Status = dataRecord.CS_Name_EN;
            Case_OrthancID = dataRecord.Case_OrthancStudyID;

            //$("#ManageCase").show();
            $("#ManageCaseDoctor").show();

            $('#ManageCase').focus();
            $('#PHos').html(Hos_Name);
            $('#PName').html(FullName_EN);
            $('#HCase').html(Case_StudyDescription);
            $('#HProtocol').html(ProtocolName);
            $('#HModality').html(Modality);
            $('#vDStatus').html(CS_Name_EN);
            $('#sUrgentType').html(UG_Type_Name);
            $("#sRights").html(TreatmentRights_Name);

            $('#vCaseID').val(CaseID);
            $('#RightID').val(TreatmentRights_ID);
            $('#UrgentTypeID').val(Case_UrgentType);
            $('#TechID').val(Case_TechID);
            //$('#pRespone').val(Case_DocRespone); // ผลอ่าน ใช้เป็นคลิกครั้งเดียวแสดงผลอ่าน
            $('#CaseStatus').val(Case_Status);
            $('#vDocFullName').text(Patient_RadiologistDoctor);

            $('#vHN').html(Patient_HN);
            $('#vSex').html(Patient_Sex);
            $('#vAge').html(Patient_Age);
            $('#vCitizenID').html(Patient_CitizenID);
            $('#vPatientDoctor').html(Patient_XDoc);
            //$('#vCitizenID').html(Patient_CitizenID);

            gridPatientActive(CaseID);
            CheckCaseStatus(Case_Status);
            FromTypecheck(Case_Status);
            //SRAD_SEC_FILE(CaseID);
            scrollToTop();

            //if(User_TypeID == "2"){
            $("#GridCase").hide();
        });


        $('#gridPatient').on('filter', function () {
            //alert("The Grid has been filtered");
            var filterGroups = $("#gridPatient").jqxGrid('getfilterinformation');
            var info = "";
            for (var i = 0; i < filterGroups.length; i++) {
                var filterGroup = filterGroups[i];
                info += "Filter Column: " + filterGroup.filtercolumn;
                var filters = filterGroup.filter.getfilters();
                for (var j = 0; j < filters.length; j++) {
                    info += "\nValue: " + filters[j].value;
                }
            }
        });

        $('#gridCaseActive').on('filter', function () {
            //alert("The Grid has been filtered");
            var filterGroups = $("#gridCaseActive").jqxGrid('getfilterinformation');
            var info = "";
            for (var i = 0; i < filterGroups.length; i++) {
                var filterGroup = filterGroups[i];
                info += "Filter Column: " + filterGroup.filtercolumn;
                var filters = filterGroup.filter.getfilters();
                for (var j = 0; j < filters.length; j++) {
                    info += "\nValue: " + filters[j].value;
                }
            }
        });

        ////////////////////////// New Editor //////////////////////////////////////
        $('#pRespone').jqxEditor({
            height: 320,
            width: "100%",
            editable: false,
            tools: "zoom" , 
            createCommand: function (name) {
                switch (name) {
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
                }
            },
        });

        resolve(true);
    });
}


function jqxListBoxAppear() {
    var listSource = [{
        label: 'Row',
        value: 'Row',
        checked: true
    },
    {
        label: 'สถานะ',
        value: 'CS_Name_EN',
        checked: true
    },
    {
        label: 'วันที่',
        value: 'createdAt',
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
        value: 'Patient_Sex',
        checked: true
    },
    {
        label: 'อายุ',
        value: 'Patient_Age',
        checked: true
    },
    {
        label: 'Description',
        value: 'Case_StudyDescription',
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
}

function CheckCaseStatus(Case_Status) {
    if (Case_Status != "0" && (User_TypeID == "3" || User_TypeID == "1")) {
        $('#frmSaveCase').hide();
    }
    else {
        $('#frmSaveCase').show();
    }
}



//const apiconnector = require('./apiconnect.js')($);

////////////////////////////////// API ///////////////////////////////////
// function gridCaseActive(Date) {

function gridCaseActive(Hos_ID) {
    var caseReadWaitStatus = [1,2,3,4,7];
    var caseReadSuccessStatus = [5,6];
    var caseAllStatus = [1,2,3,4,5,6,7];
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "gridCaseActive";
    var params = { hospitalId: Hos_ID, userId: User_ID, statusId: caseReadSuccessStatus };
    return new Promise(function (resolve, reject) {
        // console.log("function_name : " + function_name + " => start");
        var url = "/api/cases/filter/hospital";
        $.post(url, params, function (data) {
            // console.log("data = " + JSON.stringify(data));

            if (data.status.code === 200) {
                var databases = new Array();
                const length = data.Records.length;
                //console.log("length = " + data.Records.length);
                
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

                // console.log("source : " + JSON.stringify(source) );

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
                //log.info("error: " + data.error);
            }

        });
    });
}

// function Show PatientCase For Doctor {
function gridPatientActive(case_Id) {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "gridPatientActive";
    var caseId = case_Id;
    var params = { caseId: caseId};
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url = "/api/cases/select/"+ caseId;
        $.post(url, params, function (data) {
            console.log("data = " + JSON.stringify(data));
            var databases = new Array();
            if(data.status.code === 200){
                const length = data.Records.length;
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

                console.log("source : " + JSON.stringify(source) );

                var dataAdapter = new $.jqx.dataAdapter(source);

                try {
                    $("#gridPatient").jqxGrid({ source: dataAdapter });
                    //$('#gridPatient').jqxGrid('clearselection');

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

    // Case_Status = cS_Name

    if (User_TypeID == "2") {
        $('#frmSaveCase').hide();
        $('#frmRespone').hide();
        $('#pRespone').jqxInput({ disabled: true });

        $("#PMFileImage").hide();
        $("#DMFileImage").show();

        if (Case_Status == "Accept" || Case_Status == "Not Accept") {
            $('#frmAccept').hide();
            $('#frmCancelAccept').hide();
        }
        else {
            $('#frmAccept').show();
            $('#frmCancelAccept').show();
        }

        if (Case_Status == 'Accept') {
            $('#ViewCase').show();
            $('#DownLoadCase').show();
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

function SRAD_UPDATE_CASE_DOC(CaseID, TechID, DoctorID, CaseStatus, Case_DocRespone) {
    var act = 'SRAD_UPDATE_CASE_DOC';
    var url = "sapi/api.class.php?action=" + act;
    var pData = {
        CaseID: CaseID,
        TechID: TechID,
        DoctorID: DoctorID,
        CaseStatus: CaseStatus,
        CaseDocRespone: Case_DocRespone
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            if (data.Response == 'success') {
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if (vResult == "Success") {

                    ShowNoti(vMsg, "success");

                    if (CaseStatus == '1') {
                        $('#frmSaveCase').hide();
                    }

                    $("#DoctorID").val("");
                    $("#TechID").val("");
                    $("#vCaseID").val("");
                    $("#RightID").val("");
                    $("#sRights").html("");
                    $("#ManageCase").hide();
                    $("#GridCase").show();

                    gridCaseActive(User_HosID);
                }
                else {
                    ShowNoti(vResult, "danger");
                }
            }
        }
    });
}

////////////////////////////////// API ///////////////////////////////////

function ShowNoti(Msg, Type) {
    $("#MessageNoti").html(Msg);
    $("#Notification").jqxNotification({ template: Type });
    $("#Notification").jqxNotification("open");
}

function FromTypecheck(Case_Status) {

    $('#frmAccept').hide();
    $('#frmCancelAccept').hide();
    $("#PMFileImage").show();
    $("#DMFileImage").hide();

    if (Case_Status != "0") {
        $('#vMtypeDetail').hide();
    }
    else {
        $('#frmAccept').hide();
        $('#frmCancelAccept').hide();
    }
}

function scrollToTop() {
    //$('#gridCaseActive').jqxGrid('clearselection');
    window.scrollTo(0, 0);
};

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

function SelectCaseRespones(CaseID){
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "SelectCaseRespones";
    var params = {caseId : CaseID};
    var url = "/api/caseresponse/select/" + CaseID  ;
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

module.exports = {
    Start_CaseHistory
}


