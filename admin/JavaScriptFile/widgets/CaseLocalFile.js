$(document).ready(function () {

});

function Start_CaseLocalFile(){
    var utilmod = require('../utilmod');
    var moment =  require('../moment-with-locales');
    // console.log("test moment = " + moment("20111031", "YYYYMMDD").fromNow() );
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

    // $("#ManageCase").show();
    // $('#vMtypeDetail').show();
    // $('#frmReportCase').show();
    // $('#frmRenewCase').show();
    // $("#ManageCaseDoctor").show();

    //$("#jqxlistbox").hide();

    ListHospital3();
    getCliamesType();
    getUrgency();
    getRadiologistList();
    getPatientDoctorList();

    var Case_Status;
    var Case_TechID;
    var Case_OrthancID;

    var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        Editrow = row;
        var offset = $("#gridLocalFile").offset();

        var dataRecord = $("#gridLocalFile").jqxGrid('getrowdata', Editrow);
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

    ///////////////// Tooltips Header Column /////////////////////////////
    var tooltiprenderer = function (element) {
        $(element).parent().jqxTooltip({ position: 'top', content: "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง" });
    };
    ///////////////// Tooltips Header Column /////////////////////////////

    $("#Calendar").jqxDateTimeInput({ width: '100%', height: '34px', formatString: "yyyy/MM/dd",  });

    $('#Calendar').on('change', function (event) {
        var date = event.args.date;
        var today = new Date();
        let DiffDateYear = utilmod.calcDate(today,date,'years');
        let DiffDateMonth = utilmod.calcDate(today,date,'months');
        let DiffDateDays = utilmod.calcDate(today,date,'days');
        var results = "";

        if(DiffDateMonth < 1 && DiffDateYear == 0){
            results = DiffDateDays + "D" ;
        }else if(DiffDateYear < 1 ){
            results = DiffDateMonth + "M" ;
        }else{
            results = DiffDateYear + "Y" ;
        }

        console.log(results);
        $("#CalendarDays").text(results + "นับจากปัจจุบัน");
        $("#PatientAge").val(results);
        // if( !$("#PatientAge") ){
        //     $("#PatientAge").val(results);
        // }  
    });

    $("#gridLocalFile").jqxGrid({
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
        columns: [{ text: '#', datafield: 'Row', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: 35 },
        //{text: 'สถานะ',datafield: 'CS_Name_EN',align: 'center',cellsalign: 'center',filtertype: 'checkedlist',cellsrenderer: cellsrenderer,rendered: tooltiprenderer,width: 100},
        { text: 'วันที่', datafield: 'StudyDate', align: 'center', cellsalign: 'center', cellsformat: 'dd MMM yyyy HH:mm:ss', filtertype: 'range', rendered: tooltiprenderer, width: 90 },
        { text: '#HN', datafield: 'PatientID', align: 'center', rendered: tooltiprenderer, width: 100 },
        { text: 'ผู้รับการตรวจ(อังกฤษ)', datafield: 'PatientName', align: 'center', rendered: tooltiprenderer, width: 250 },
        //{text: 'ผู้รับการตรวจ(ไทย)',datafield: 'FullName_TH',align: 'center',rendered: tooltiprenderer,width: 250},
        { text: 'เพศ', datafield: 'PatientSex', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', rendered: tooltiprenderer, width: 50 },
        //{text: 'อายุ',datafield: 'Patient_Age',align: 'center',cellsalign: 'center',rendered: tooltiprenderer,width: 50},
        //{text: 'รหัส',datafield: 'PatientID',align: 'center',cellsalign: 'center',rendered: tooltiprenderer,width: 80},
        { text: 'วันเกิด', datafield: 'PatientBirthDate', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: 80 },
        //{text: 'รายการ',datafield: 'Order_Detail',align: 'center',rendered: tooltiprenderer,minwidth: 200},
        //{text: 'ราคา',datafield: 'Order_Price',align: 'center',cellsalign: 'right',width: 70,rendered: tooltiprenderer,cellsformat: 'c0'},
        //{text: 'DF แพทย์',datafield: 'Order_DF',align: 'center',cellsalign: 'right',width: 80,rendered: tooltiprenderer,cellsformat: 'c0'},
        { text: 'Description', datafield: 'StudyDescription', align: 'center', rendered: tooltiprenderer, width: 120 },
        { text: 'Protocol', datafield: 'ProtocolName', align: 'center', rendered: tooltiprenderer, minwidth: 180 },
        { text: 'Modality', datafield: 'Modality', align: 'center', width: 70, rendered: tooltiprenderer, filtertype: 'checkedlist' },
            //{text: 'Urgency',datafield: 'UG_Type_Name',align: 'center',cellsalign: 'center',filtertype: 'checkedlist',rendered: tooltiprenderer,width: 100},
            //{text: 'รังสีแพทย์',datafield: 'DocFullName',align: 'center',rendered: tooltiprenderer,width: 150}
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
        $("#gridLocalFile").jqxGrid('beginupdate');
        if (event.args.checked) {
            $("#gridLocalFile").jqxGrid('showcolumn', event.args.value);
        } else {
            $("#gridLocalFile").jqxGrid('hidecolumn', event.args.value);
        }
        $("#gridLocalFile").jqxGrid('endupdate');
    });

    var jqxlistbox_show = false;

    ////////////////////////////////////////////////////////////////////////////////////////////


    gridLocalFile(User_HosID);

    $("#gridLocalFile").on('rowselect', function (event) {

        Editrow = event.args.rowindex;
        //alert(Editrow);
        // User_Hospital_Name
        var offset = $("#gridLocalFile").offset();
        var dataRecord = $("#gridLocalFile").jqxGrid('getrowdata', Editrow);

        var CaseID = dataRecord.Case_ID;
        var TechID = dataRecord.Case_TechID;
        var FullName_EN = dataRecord.PatientName;
        var Hos_OrthancID = dataRecord.hospitalId;
        var Hos_Name = dataRecord.InstitutionName;
        var Patient_HN = dataRecord.PatientID;
        // var Patient_HN = dataRecord.Patient_HN;
        var Patient_Name = dataRecord.PatientName.split(" ")[0];
        var Patient_LastName = dataRecord.PatientName.split(" ")[1];
        var Case_StudyDescription = dataRecord.StudyDescription;
        var Patient_ID = dataRecord.PatientID;
        var Patient_Sex = dataRecord.PatientSex;
        var Patient_Age = dataRecord.Patient_Age;
        var Patient_Birthday = dataRecord.PatientBirthDate;
        var Patient_CitizenID = dataRecord.Patient_CitizenID;
        var CS_Name_EN = dataRecord.CS_Name_EN; // CaseStatus
        var TreatmentRights_ID = dataRecord.cliamerightId;
        var TreatmentRights_Name = dataRecord.TreatmentRights_Name;
        var Patient_XDoc = dataRecord.DocFullName;
        var UG_Type_Name = dataRecord.UG_Type_Name;
        var Case_UrgentType = dataRecord.UGType_Name;
        //var Patient_RefferalDoctor = dataRecord.ReferringPhysicianName;
        var ProtocolName = dataRecord.ProtocolName;
        var Modality = dataRecord.Modality;
        var Case_DocRespone = dataRecord.Case_DocRespone;
        var Patient_RadiologistDoctor = dataRecord.Patient_RadiologistDoctor;
        var createdAt = dataRecord.createdAt;
        var SeriesInstanceUID = dataRecord.SeriesInstanceUID;
        var SeriesInstances = dataRecord.SeriesInstances;
        var StudyInstanceUID = dataRecord.StudyInstanceUID;

        var Order_Price = dataRecord.Order_Price;
        var Order_DF = dataRecord.Order_DF;
        Case_TechID = User_ID;
        Case_Status = dataRecord.Case_Status;
        Case_OrthancID = dataRecord.ID;

        //Keep Patient Data
        $("#PatientData").val(JSON.stringify(dataRecord));
        $("#InstancesOrthanC").val(StudyInstanceUID);

        $("#ManageCase").show();
        // getCliamesType();
        // getUrgency();
        // getRadiologistList();
        // getPatientDoctorList();

        $('#ManageCase').focus();
        // Patient_Birthday
        $('#PHos').val(Hos_Name);
        //$('#PName').html(FullName_EN);
        $('#HCase').val(Case_StudyDescription);
        $('#HProtocol').val(ProtocolName);
        $('#HModality').val(Modality);
        //$('#vMType').html(vType);
        $('#vDStatus').html(CS_Name_EN);
        $('#sUrgentType').html(UG_Type_Name);
        console.log("Patient_Birthday: " + Patient_Birthday);
        if(Patient_Birthday !== ""){
            var date_cals =  Patient_Birthday.substr(0,4) + "/" + Patient_Birthday.substr(4,2) + "/" + Patient_Birthday.substr(6,2) ;
            // console.log("date_cals: " + date_cals);
            // $("#Calendar").jqxDateTimeInput('setDate',  moment(Patient_Birthday, "YYYYMMDD").format("yyyy/MM/DD") );
            $("#Calendar").jqxDateTimeInput('setDate', new Date(date_cals) );
        }else{
            $("#Calendar").jqxDateTimeInput('setDate', new Date());
        }
        
        $('#PatientAge').val(Patient_Age);

        //$('#vCaseID').val(CaseID);
        $('#vHN').val(Patient_HN);
        $('#vName').val(Patient_Name);
        $('#vLName').val(Patient_LastName);
        $('#vSex').val(Patient_Sex);
        //$('#vBirthday').val(Patient_Birthday);
        $('#vCitizenID').val(Patient_CitizenID);
        $('#RightID').val(TreatmentRights_ID);
        $('#UrgentTypeID').val(Case_UrgentType);
        //$('#vPatientDoctor').val(Patient_RefferalDoctor);
        //$('#vCitizenID').val(Patient_CitizenID);
        $('#vCaseAMT').val(Order_Price);
        $('#vCaseDFAMT').val(Order_DF);

        $("#vDPhone").html("");
        $("#vDEmail").html("");
        $("#vDLine").html("");

        if (User_TypeID != '4') {
            $('#TechID').val(Case_TechID);
        } else {
            $('#TechID').val(User_ID);
        }
        if (TreatmentRights_ID != '0') {
            //$("#vRight").jqxDropDownList('selectItem',String(TreatmentRights_Name));
            $("#sRights").html(TreatmentRights_Name);
        }

        //CheckCaseStatus(Case_Status);
        FromTypecheck(Case_Status);
        GetDoctor(User_TypeID);
        //SRAD_MSG_TREATMENTRIGHTS(Hos_OrthancID);
        //SRAD_MSG_URGENT_TYPE(Hos_OrthancID);
        //SRAD_SEC_FILE(Case_ID);
        scrollToTop();

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

        gridLocalFile(User_HosID);

        /*try{
          //$('#gridLocalFile').jqxGrid('clearfilters');
          $('#gridLocalFile').jqxGrid('clearselection');
          $('#gridFileUpdate').jqxGrid('clearselection');
        }
        catch{
          location.reload();
        }*/

        document.getElementById("vShowImg").src = '';
    });
    $("#SaveCase").on('click', function () {

        var PatientData = JSON.parse($("#PatientData").val());
        console.log("PatientData = " + PatientData);
        var PatientHN_Number = PatientData.PatientID;
        // var vPatient_ID = PatientData.Patient_ID;
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
        /*try{
          //$('#gridLocalFile').jqxGrid('clearfilters');
          $('#gridLocalFile').jqxGrid('clearselection');
          $('#gridFileUpdate').jqxGrid('clearselection');
        }
        catch{
          location.reload();
        }*/
        //$('#gridLocalFile').jqxGrid('clearselection');
    });
    $("#ReportCase").on('click', function () {
        var CaseID = $("#vCaseID").val();
        var url = "sapi/rad_report.php?CaseID=" + CaseID;
        openInNewTab(url);
    });

    $("#ViewCase").on('click', function () {
        var instanceID = $("#InstancesOrthanC").val();
        const PromisePreviewImage = PreviewImage(instanceID);
        PromisePreviewImage.then((data) => {
            console.log("data viewcase: " + data);
            var baseurl = "";
            if (window.location.hostname == "localhost") {
                baseurl = "202.28.68.28";
            } else {
                baseurl = window.location.host.split(":")[0];
            }
            local_url = 'http://' + baseurl + ':' + data.port + '/stone-webviewer/index.html?study=';
            var orthancwebapplink = local_url + instanceID;
            console.log("orthancwebapplink = " + orthancwebapplink);
            window.open(orthancwebapplink, '_blank');
            //openInNewTab(url);
        });
    });

    $("#RegisterClose2").on('click', function () {
        getPatientDoctorList();
    });

    $("#RegisterDoctor2").on('click', function () {
        RadRegister();
    });

    $("#DownLoadCase").on('click', function () {
        var url = 'http://Radconnext:R@dconnext@103.91.189.94:8042/patients/' + Case_OrthancID + '/archive';
        openInNewTab(url);
    });

    $("#RenewCase").on('click', function () {
        let vCaseID = $('#vCaseID').val();
        let vTechID = $('#TechID').val();

        SRAD_UPDATE_CASE_DOC(vCaseID, vTechID, '0', '0', '');
    });
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
        valueMember: "Value",
        autoDropDownHeight: true
    });

    $('#vPatientDoctor').jqxDropDownList({
        placeHolder: "เลือกแพทย์ทั่วไป",
        width: "90%",
        selectedIndex: -1,
        theme: theme,
        displayMember: "DisplayText",
        valueMember: "Value",
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

    $("#vFileImage").click("change", function (e){
        let $this = this;
        let imageListDiv = $('<div id="ImageListDiv" style="width: 100%; position: relative;"></div>');
        let simpleUploadPluginUrl = "../../lib/simpleUpload.min.js";
        // let uploadUrl = '/api/uploadpatienthistory';
        cachedScript(simpleUploadPluginUrl).done(function( script, textStatus ) {
            console.log("success");
            let fileBrowser = $('#vFileImage');
            let imageListBox = $('#gridFileUpdate_New');
            $(fileBrowser).attr("name", 'patienthistory');
            $(fileBrowser).attr("multiple", true);  
            // $(fileBrowser).css('display', 'none');
            $(fileBrowser).on('change', function(e) {
                console.log("fileBrowser change");
                const defSize = 10000000;
                var fileSize = e.currentTarget.files[0].size;
                var fileType = e.currentTarget.files[0].type;
                if (fileSize <= defSize) {
                    let uploadUrl = '/api/uploadpatienthistory';
                    // var uploadUrl = $this.options.attachFileUploadApiUrl;
                    fileBrowser.simpleUpload(uploadUrl, {
                        success: function(data){
                            imageListBox.show();
                            // $(fileBrowser).remove();
                            setTimeout(() => {
                            // doAppendNewImageData(data);
                            let uploadImageProp = {
                                imgUrl: data.link,
                                onRemoveClick: function(e, imgDiv){
                                    doRemoveImage(e, data.link, imgDiv);
                                }
                            };
                            $( "<div></div>" ).appendTo(imageListBox).imageitem( uploadImageProp );
                            }, 400);
                            fileBrowser.val('');
                        },
                        error: function(error){
                            console.log("uploading error : " + error);
                        }
                    });
                } else {
                    imageListBox.append('<div>' + 'File not excess ' + defSize + ' Byte.' + '</div>');
                }
            });
        });

    });

    // $("#UploadImage").click( () => {
    //     let fileBrowser = '#vFileImage';
    //     let imageListBox = "#gridFileUpdate_New";
    //     console.log("fileBrowser change");
    //     const defSize = 10000000;
    //     var fileSize = $(imageListBox).currentTarget.files[0].size;
    //     var fileType = $(imageListBox).currentTarget.files[0].type;
    //     if (fileSize <= defSize) {
    //         doUploadImage(fileBrowser, imageListBox);
    //     } else {
    //         $(imageListBox).append('<div>' + 'File not excess ' + defSize + ' Byte.' + '</div>');
    //     }
    // });

    // if (window.File && window.FileList && window.FileReader) {
    //     $("#vFileImage").on("change", function (e) {
    //         var files = e.target.files,
    //             filesLength = files.length;
    //         for (var i = 0; i < filesLength; i++) {
    //             var f = files[i];
    //             var fileReader = new FileReader();
    //             fileReader.onload = (function (e) {
    //                 var file = e.target;
    //                 $("<span class=\"pip\">" +
    //                     "<img id='FileImageUpload' class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
    //                     "<br/><span class=\"remove\">Remove image</span>" +
    //                     "</span>").insertAfter("#gridFileUpdate_New");
    //                 $(".remove").click(function () {
    //                     $(this).parent(".pip").remove();
    //                 });
    //             });
    //             fileReader.readAsDataURL(f);
    //         }
    //     });
    // } else {
    //     alert("Your browser doesn't support to File API");
    // }
    ////////////////////////////////////////////////////////////////////////////////////////////

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
        //$("#columntablegridLocalFile").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง' });
        $("#row00gridLocalFile").children().eq(2).jqxTooltip({ showDelay: 1000, position: 'top', content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง' });
        $("#row00gridLocalFile").children().eq(3).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridLocalFile").children().eq(4).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridLocalFile").children().eq(6).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridLocalFile").children().eq(7).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridLocalFile").children().eq(8).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridLocalFile").children().eq(9).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridLocalFile").children().eq(7).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridLocalFile").children().eq(8).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridLocalFile").children().eq(9).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridLocalFile").children().eq(10).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridLocalFile").children().eq(11).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridLocalFile").children().eq(12).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridLocalFile").children().eq(15).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        //////////////////////////////////////////////////////////////////////////////////
    }, 2000);

    getCliamesType();
    getUrgency();
    getRadiologistList();
}

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

function doUploadImage(fileBrowser, imageListBox) {
    let uploadUrl = '/api/uploadpatienthistory';
    // var uploadUrl = $this.options.attachFileUploadApiUrl;
    $(fileBrowser).simpleUpload(uploadUrl, {
        success: function(data){
            // $(fileBrowser).remove();
            setTimeout(() => {
            // doAppendNewImageData(data);
            let uploadImageProp = {
                imgUrl: data.link,
                onRemoveClick: function(e, imgDiv){
                    doRemoveImage(e, data.link, imgDiv);
                }
            };
            $( "<div></div>" ).appendTo($(imageListBox)).imageitem( uploadImageProp );
            }, 400);
        },
        error: function(error){
            console.log("uploading error : " + error);
        }
    });
}

function LoopLoad(vTotalCase) {
    setInterval(function () {
        GetTotalCase();
        var ChkRe = false;
        var ChkvTotalCase = $('#sTotalCase').html();
        var ChkvNewCase = $('#sNewCase').html();
        var ChkvWaitAccept = $('#AWaitAccept').html();
        var ChkvAccepted = $('#AResponed').html();

        if (vTotalCase != ChkvTotalCase) {
            ChkRe = true;
            gridLocalFile(User_HosID);
        }

        if (vNewCase != ChkvNewCase && !ChkRe) {
            gridLocalFile(User_HosID);
        }

        if (vWaitAccept != ChkvWaitAccept && !ChkRe) {
            gridLocalFile(User_HosID);
        }

        if (vAccepted != ChkvAccepted && !ChkRe) {
            gridLocalFile(User_HosID);
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
    } else {
        $('#frmSaveCase').show();
    }
};

function scrollToTop() {
    //$('#gridLocalFile').jqxGrid('clearselection');
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

function FromTypecheck(Case_Status) {

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

        if (Case_Status == "2") {
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

    if (Case_Status != "0") {
        $('#vMtypeDetail').hide();

        $('#vName').jqxInput({
            disabled: true
        });
        $('#vLName').jqxInput({
            disabled: true
        });
        $('#vCitizenID').jqxInput({
            disabled: false
        });

        // $('#vPatientDoctor').jqxInput({
        //     disabled: true
        // });

        if (Case_Status == "3") {
            $('#frmReportCase').show();
        } else {
            $('#frmReportCase').hide();
        }

        if (Case_Status == "1" || Case_Status == "2") {
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

//     var uploadUrl = '/api/uploadpatienthistory';
//     $("#FileImageUpload").simpleUpload(url = uploadUrl, method = "POST", {
//         success: function (data) {
//             console.log("success to upload file : " + JSON.stringify(data));
//             $("#FileImageUpload").parent(".pip").remove();
//         },
//         error: function(error){
//             //upload failed
//             console.log("error to upload file : " + error);
//         }
//     });

// });

function SendCaseByTech(Patient_HN) {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "SendCaseByTech";
    //var params = { Patient_HN: Patient_HN };
    var PatientDataInfo = $("#PatientData").val();
    console.log("function_name : " + function_name + " => start");
    var CheckCasePatientActive = CheckCasePatient(Patient_HN);
    var CheckCase = false;
    CheckCasePatientActive.then((data) => {
        console.log("CheckCasePatient data = " + JSON.stringify(data));
        if (data.Records.length == 0 || data.Records.length == undefined) {
            //CheckCase = false;
            var AddPatientActive = AddPatient(PatientDataInfo);
            AddPatientActive.then((data_add) => {
                console.log("AddPatient data = " + JSON.stringify(data_add));
                if (data_add.Result == 'OK') {
                    var NewData = JSON.stringify(data_add);
                    console.log("NewData in " + function_name + " = " + NewData);
                    $("#SearchPatientData").val(JSON.stringify(data_add));
                    $("#PatientID").val(data.Records.id);
                    ShowNoti("เพิ่มผู้ป่วยสำเร็จ", "success");
                    // $.notify("เพิ่มรายการผู้ป่วยใหม่เข้าสู่ระบบเรียบร้อยแล้ว", "info");
                } else {
                    ShowNoti("เพิ่มผู้ป่วยไม่สำเร็จ", "warning");
                }
            }).catch(function (error) {
                console.log("Error in PromiseFunction 'AddPatient' => " + error);
                ShowNoti("เชื่อมต่อ AddPatientActive ไม่สำเร็จ", "warning");
                // $.notify("เกิดความผิดพลาด ไม่สามารถเพิ่มรายการผู้ป่วยจากเซิร์ฟเวอร์ได้ในขณะนี้", "error");
            });

        } else {

            $("#PatientID").val(data.Records[0].id);
            var NewData = JSON.stringify(data);
            console.log("NewData in CheckCasePatient = " + NewData);
            $("#SearchPatientData").val(JSON.stringify(data));
            //CheckCase = true;
            var UpdatePatientActive = UpdatePatient(PatientDataInfo);
            UpdatePatientActive.then((data_update) => {
                console.log("UpdatePatient data = " + JSON.stringify(data_update));
                if (data_update.Result == 'OK') {
                    // $("#SearchPatientData").val(JSON.stringify(data_update));
                    ShowNoti("อัพเดตผู้ป่วยสำเร็จ", "success");
                    // $.notify("แก้ไขรายการผู้ป่วยเข้าสู่ระบบเรียบร้อยแล้ว", "info");
                    //$("#PatientID").val(data.Records[0].id);
                } else {
                    ShowNoti("อัพเดตผู้ป่วยไม่สำเร็จ", "warning");
                }
            }).catch(function (error) {
                console.log("Error in PromiseFunction 'UpdatePatient' => " + error);
                ShowNoti("เชื่อมต่อ UpdatePatientActive ไม่สำเร็จ", "warning");
                // $.notify("เกิดความผิดพลาด ไม่สามารถแก้ไขรายการผู้ป่วยจากเซิร์ฟเวอร์ได้ในขณะนี้", "error");
            });
        }

    }).catch(function (error) {
        console.log("Error in PromiseFunction 'CheckCasePatient' => " + error);
        ShowNoti("เกิดความผิดพลาด ไม่สามารถเช็ครายการผู้ป่วยจากเซิร์ฟเวอร์ได้ในขณะนี้", "warning");
        // $.notify("เกิดความผิดพลาด ไม่สามารถเช็ครายการผู้ป่วยจากเซิร์ฟเวอร์ได้ในขณะนี้", "error");

    }).finally( () => {

        var AddCaseActive = AddCase(PatientDataInfo);
        AddCaseActive.then((data_addcase) => {
            if (data_addcase.status.code === 200 || data_addcase.Record == 'OK') {
                console.log("data_addcase in AddCaseActive = " + JSON.stringify(data_addcase));
                console.log("Success in PromiseFunction 'AddCaseActive' ");
                ShowNoti("ส่งเคสผู้ป่วยให้หมอรังสีสำเร็จ", "success");
                // $.notify("บันทึกเคสใหม่เข้าสู่ระบบเรียบร้อยแล้ว", "info");
                // $.notify("บันทึกเคสใหม่เข้าสู่ระบบเรียบร้อยแล้ว", "info");
            } else {
                console.log("Error in PromiseFunction 'AddCaseActive' ");
                ShowNoti("ส่งเคสผู้ป่วยให้หมอรังสีไม่สำเร็จ", "warning");
                // $.notify("เกิดความผิดพลาด ไม่สามารถแก้ไขรายการผู้ป่วยจากเซิร์ฟเวอร์ได้ในขณะนี้", "error");
            }
        }).catch(function (error) {
            console.log("Error in PromiseFunction 'AddCaseActive' => " + error);
            ShowNoti("เชื่อมต่อ AddCaseActive ไม่สำเร็จ", "warning");
        });

        console.log("function_name : " + function_name + " => end");
        console.log("Finish Finally");
    });

}

function CheckCasePatient(PatientHN) {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "CheckCasePatient";
    var params = { key: { Patient_HN: PatientHN } };
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url = "/api/patient/search";
        $.post(url, params, function (data) {
            console.log("data in function " + function_name + " = " + JSON.stringify(data));
            if (data.Result == 'OK') {
                //console.log("data in function "+ function_name + " = " + JSON.stringify(data));
                resolve(data);
                console.log("Success get data in " + function_name);
            } else {
                reject(data);
                console.log("Error in Get Data " + function_name);
            }
        });
        console.log("function_name : " + function_name + " => end");
    });
}

function AddPatient(datainfo) {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "AddPatient";
    var datainfo_new = JSON.parse(datainfo);
    //console.log (" datainfo in " + function_name + " =>> " + datainfo);
    var new_data = doPreparePatientParams(datainfo_new);
    var params = { data: new_data, hospitalId: User_HosID };
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url = "/api/patient/add";
        $.post(url, params, function (data) {
            console.log("data in function " + function_name + " = " + JSON.stringify(data));
            if (data.Result == 'OK') {
                $("#PatientID").val(data.Record.id);
                resolve(data);
                console.log("Success get data in " + function_name);
            } else {
                reject(data);
                console.log("Error in Get Data " + function_name);
            }
        });
        console.log("function_name : " + function_name + " => end");
    });
}

function UpdatePatient(datainfo) {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "UpdatePatient";
    var datainfo_new = JSON.parse(datainfo);
    var new_data = doPreparePatientParams(datainfo_new);
    // rqParams.patientId = $("#PatientID").val();
    // rqParams.urgenttypeId = $("#vUrgentType").val();
    // rqParams.cliamerightId = $("#vRight").val();
    // rqParams.Case_RadiologistId = $("#vListDoctor").val();
    // rqParams.Case_RefferalId = $("#vPatientDoctor").val();
    // rqParams.Case_RefferalName = $("#vPatientDoctor").text();
    // var params = {hospitalId: User_HosID, patientId: $("#PatientID").val(), data: new_data, urgenttypeId: $("#vUrgentType").val(), cliamerightId: $("#vRight").val()};
    var params = { hospitalId: User_HosID, patientId: $("#PatientID").val(), data: new_data };
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url = "/api/patient/update";
        $.post(url, params, function (data) {
            console.log("data in function " + function_name + " = " + JSON.stringify(data));
            if (data.Result == 'OK') {
                resolve(data);
                console.log("Success get data in " + function_name);
            } else {
                reject(data);
                console.log("Error in Get Data " + function_name);
            }
        });
        console.log("function_name : " + function_name + " => end");
    });
}

function AddCase(datainfo) {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "AddCase";
    var datainfo_new = JSON.parse(datainfo);
    var new_data = doPrepareCaseParams(datainfo_new);
    //var patientdata = JSON.parse($("#SearchPatientData").val());
    var VurgenttypeId = $("#vUrgentType").val();
    var VcliamerightId = $("#vRight").val();
    var patientId = $("#PatientID").val();

    console.log("VurgenttypeId = " + VurgenttypeId + " VcliamerightId = " + VcliamerightId + " patientId = " + patientId);
    // let setupCaseTo = { hospitalId: req.body.hospitalId, patientId: req.body.patientId, userId: req.body.userId,
    //      cliamerightId: req.body.cliamerightId, urgenttypeId: req.body.urgenttypeId};
    var params = { userId: User_ID, hospitalId: User_HosID, patientId: patientId, data: new_data, urgenttypeId: VurgenttypeId, cliamerightId: VcliamerightId };
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url = "/api/cases/add";
        $.post(url, params, function (data) {
            console.log("data in function " + function_name + " = " + JSON.stringify(data));
            if (data.Result == 'OK') {
                resolve(data);
                console.log("Success get data in " + function_name);
            } else {
                reject(data);
                console.log("Error in Get Data " + function_name);
            }
        });
    });
}

function gridLocalFile(Hos_ID) {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "gridLocalFile";
    const PromiseGetLocalFile = getLocalFile(Hos_ID);
    PromiseGetLocalFile.then(async (data) => {
        // console.log("data in PromiseGetLocalFile = " + JSON.stringify(data) );
        // console.log("data in PromiseGetLocalFile.length = " + data.length );
        var databases = new Array();
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                // console.log("i start = " + i + " in range " + data.length );
                var row = {};
                row.Row = i;
                row.ID = data[i].ID;
                // console.log("After ID");
                row.IsStable = data[i].IsStable;
                row.LastUpdate = data[i].LastUpdate;
                row.AccessionNumber = data[i].MainDicomTags.AccessionNumber;
                row.InstitutionName = data[i].MainDicomTags.InstitutionName;
                row.ReferringPhysicianName = data[i].MainDicomTags.ReferringPhysicianName;
                // console.log("After ReferringPhysicianName");
                row.StudyDate = data[i].MainDicomTags.StudyDate;
                row.StudyDescription = data[i].MainDicomTags.StudyDescription;
                row.StudyID = data[i].MainDicomTags.StudyID;
                row.StudyInstanceUID = data[i].MainDicomTags.StudyInstanceUID;
                row.StudyTime = data[i].MainDicomTags.StudyTime;
                // console.log("After StudyTime");
                row.ParentPatient = data[i].ParentPatient;
                row.PatientBirthDate = data[i].PatientMainDicomTags.PatientBirthDate;
                row.PatientID = data[i].PatientMainDicomTags.PatientID;
                row.PatientName = data[i].PatientMainDicomTags.PatientName;
                row.PatientSex = data[i].PatientMainDicomTags.PatientSex;
                row.Series = data[i].Series;
                row.Type = data[i].Type;
                // console.log("After Type");
                //////////////////////////// Data From Series //////////////
                row.BodyPartExamined = data[i].SamplingSeries.MainDicomTags.BodyPartExamined;
                row.ImageOrientationPatient = data[i].SamplingSeries.MainDicomTags.ImageOrientationPatient;
                row.Manufacturer = data[i].SamplingSeries.MainDicomTags.Manufacturer;
                row.OperatorsName = data[i].SamplingSeries.MainDicomTags.OperatorsName;
                row.ProtocolName = data[i].SamplingSeries.MainDicomTags.ProtocolName;
                // console.log("After ProtocolName");
                row.PerformedProcedureStepDescription = data[i].SamplingSeries.MainDicomTags.PerformedProcedureStepDescription;
                row.Modality = data[i].SamplingSeries.MainDicomTags.Modality;
                // console.log("After Modality");
                row.SeriesDate = data[i].SamplingSeries.MainDicomTags.SeriesDate;
                row.SeriesDescription = data[i].SamplingSeries.MainDicomTags.SeriesDescription;
                row.SeriesInstanceUID = data[i].SamplingSeries.MainDicomTags.SeriesInstanceUID;
                row.SeriesNumber = data[i].SamplingSeries.MainDicomTags.SeriesNumber;
                // console.log("After SeriesNumber");
                row.SeriesTime = data[i].SamplingSeries.MainDicomTags.SeriesTime;
                row.StationName = data[i].SamplingSeries.MainDicomTags.StationName;
                row.SeriesType = data[i].SamplingSeries.Type;
                row.SeriesID = data[i].SamplingSeries.ID;
                row.SeriesInstances = data[i].SamplingSeries.Instances;
                row.ParentStudy = data[i].SamplingSeries.ParentStudy;
                // console.log("After ParentStudy");

                // console.log("row: " + i + " have rowdata = " + JSON.stringify(row) ) ;
                databases[i] = row;
            }
            var source = { localdata: databases, datatype: "array", };
            // console.log("source PromiseGetLocalFile : " + JSON.stringify( source ) );
            var dataAdapter = new $.jqx.dataAdapter(source);

            try {
                $("#gridLocalFile").jqxGrid({ source: dataAdapter });
                //$('#gridLocalFile').jqxGrid('clearselection');
                console.log("Success to get Data ");
            } catch (e) {
                console.log("Error : " + e);
                //location.reload();
            }
        } else {
            console.log("Not Found Data ");
        }

    }).catch(function (error) {
        console.log("Error in PromiseGetLocalFile = " + error);
    });
    console.log("function_name : " + function_name + " => end");
}

function getLocalFile(Hos_ID) {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    var function_name = "getLocalFile";
    var orthancUri = '/tools/find';
    var queryStr2 = '{"Level": "Study", "Expand": true, "Query": {"Modality": "*"} }';
    var params = { method: 'post', uri: orthancUri, body: queryStr2, hospitalId: Hos_ID };
    var url = "/api/orthancproxy/find";
    // const promises = doPostApi(url, params)
    const promises = doPostApi(url, params)
    // console.log('data: ' + JSON.stringify(response));
    return new Promise(function (resolve, reject) {
        promises.then((response) => {
            response.forEach((study) => {
                // console.log('study: ' + JSON.stringify(study) );
                let queryStr = '{"Level": "Series", "Expand": true, "Query": {"PatientName":"' + study.PatientMainDicomTags.PatientName + '"}}';
                params = { method: 'post', uri: orthancUri, body: queryStr, hospitalId: Hos_ID };
                const promises2 = doPostApi(url, params);
                promises2.then(async (seriesList) => {
                    // console.log('seriesList : ' + JSON.stringify(seriesList));
                    let samplingSrs = await seriesList.find((srs) => {
                        return (srs.MainDicomTags.SeriesDate) || (srs.MainDicomTags.SeriesDescription);
                    })
                    if (samplingSrs) {
                        study.SamplingSeries = samplingSrs;
                    } else {
                        study.SamplingSeries = seriesList[0];
                    }
                });
            });

            setTimeout(() => {
                resolve(response);
            }, 2000);

        }).catch((err) => {
            reject(err);
            console.log(`function ${function_name} error => ${err} `);
        });
    });
}

// function getLocalFile2(Hos_ID, LocalFile) {
//     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
//     //var PromiseGetLocalFile2 = getLocalFile2(Hos_ID);
//     var function_name = "getLocalFile";
//     var orthancUri = '/studies/' + LocalFile;
//     var queryStr = ""
//     var params = { method: 'get', uri: orthancUri, body: queryStr, hospitalId: Hos_ID };
//     var url = "/api/orthancproxy/find";
//     return new Promise(function (resolve, reject) {
//         console.log("function_name : " + function_name + " => start");
//         $.post(url, params, function (data) {
//             // console.log("data = " + data);
//             resolve(data);
//         }).fail(function (error) {
//             // console.log("error = " + error);
//             reject(error);
//         });
//         console.log("function_name : " + function_name + " => end");
//     });
// }

// function getLocalFile3(Hos_ID, Series) {
//     $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
//     //var PromiseGetLocalFile2 = getLocalFile2(Hos_ID);
//     var function_name = "getLocalFile3";
//     var orthancUri = '/series/' + Series;
//     var queryStr = "";
//     var params = { method: 'get', uri: orthancUri, body: queryStr, hospitalId: Hos_ID };
//     var url = "/api/orthancproxy/find";
//     return new Promise(function (resolve, reject) {
//         // console.log("function_name : " + function_name + " => start");
//         $.post(url, params, function (data) {
//             // console.log("data = " + data);
//             resolve(data);
//         }).fail(function (error) {
//             // console.log("error = " + error);
//             reject(error);
//         });
//         // console.log("function_name : " + function_name + " => end");
//     });
// }

function PreviewImage() {
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    //var PromiseGetLocalFile2 = getLocalFile2(Hos_ID);
    var function_name = "PreviewImage";
    var params = { username: UserNameID };
    var url = "/api/orthancproxy/orthancexternalport";
    return new Promise(function (resolve, reject) {
        // console.log("function_name : " + function_name + " => start");
        $.get(url, params, function (data) {
            // console.log("data = " + data);
            resolve(data);
        }).fail(function (error) {
            console.log("error = " + error);
            reject(error);
        });
        // console.log("function_name : " + function_name + " => end");
    });
};

function doPreparePatientParams(PatientData) {
    var rqParams = {};
    var names = PatientData.PatientName;
    rqParams.Patient_NameEN = "";
    rqParams.Patient_LastNameEN = "";
    if (names.split(" ").length > 1) {
        rqParams.Patient_NameEN = names.split(" ")[0];
        rqParams.Patient_LastNameEN = names.split(" ")[1];
    } else if (names.split("^").length > 1) {
        rqParams.Patient_NameEN = names.split("^")[0];
        rqParams.Patient_LastNameEN = names.split("^")[1];
    } else {
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
    rqParams.Patient_Tel = "";
    rqParams.Patient_Address = "";
    rqParams.ParentPatient = PatientData.ParentPatient;
    rqParams.ParentStudy = PatientData.ParentStudy;
    rqParams.hospitalId = User_HosID;
    rqParams.patientId = PatientData.PatientID;
    rqParams.StudyInstanceUID = PatientData.StudyInstanceUID;

    console.log("rqParams = " + JSON.stringify(rqParams));
    return rqParams;
}

function doPrepareCaseParams(CaseData) {
    var rqParams = {};
    rqParams.Case_OrthancStudyID = CaseData.ID;
    rqParams.Case_ACC = CaseData.AccessionNumber;
    rqParams.Case_BodyPart = CaseData.BodyPartExamined;
    rqParams.Case_Modality = CaseData.Modality;
    rqParams.Case_Manufacturer = CaseData.Manufacturer;
    rqParams.Case_ProtocolName = CaseData.ProtocolName;
    rqParams.Case_StudyDescription = CaseData.StudyDescription;
    rqParams.Case_StationName = CaseData.StationName;
    rqParams.studyInstanceUID = CaseData.StudyInstanceUID;
    // rqParams.OperatorsName = CaseData.OperatorsName;
    // rqParams.PerformedProcedureStepDescription = CaseData.PerformedProcedureStepDescription;
    // rqParams.SeriesDescription = CaseData.SeriesDescription;
    rqParams.Case_PatientHRLink = patientHistoryBox.images(); // F
    // rqParams.SeriesInstanceUID = CaseData.SeriesInstanceUID;
    // rqParams.StudyInstanceUID = CaseData.StudyInstanceUID;
    // rqParams.StudyDate = CaseData.StudyDate;
    // rqParams.StudyTime = CaseData.StudyTime;
    // rqParams.PatientName = CaseData.PatientName;
    if ($("#vCaseAMT").val() == null || $("#vCaseAMT").val() == '') {
        rqParams.Case_Price = '';
    } else {
        rqParams.Case_Price = $("#vCaseAMT").val();
    }

    if ($("#vCaseDFAMT").val() == null || $("#vCaseDFAMT").val() == '') {
        rqParams.Case_Department = '';
    } else {
        rqParams.Case_Department = $("#vCaseDFAMT").val();
    }

    if ($("#vCaseDescrpition").val() == null || $("#vCaseDescrpition").val() == '') {
        rqParams.Case_DESC = '';
    } else {
        rqParams.Case_DESC = $("#vCaseDescrpition").val();
    }
    rqParams.userId = User_ID;
    rqParams.hospitalId = User_HosID;
    rqParams.patientId = $("#PatientID").val();
    rqParams.urgenttypeId = $("#vUrgentType").val();
    rqParams.cliamerightId = $("#vRight").val();
    rqParams.Case_RadiologistId = $("#vListDoctor").val();
    rqParams.Case_RefferalId = $("#vPatientDoctor").val();
    rqParams.Case_RefferalName = $("#vPatientDoctor").text();


    console.log("rqParams = " + JSON.stringify(rqParams));
    return rqParams;
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

        console.log("params = " + params);

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

function ListHospital3() {
    let function_name = 'ListHospital3';
    let url = "/api/hospital/options";
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
    let params = [];
    const promises = doGetApi(url, params);
    promises.then((data) => {
        console.log("function_name : " + function_name + " => start");
        var new_data = JSON.stringify(data);
        length = data["Options"].length;
        var databases = new Array();
        console.log("data = " + JSON.stringify(data["Options"][0].DisplayText));
        for (var i = 0; i < length; i++) {
            var hospitalName = JSON.stringify(data["Options"][i].DisplayText).replaceAll('"', '');
            $("#HospitalType").append(new Option(hospitalName, i + 1));
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
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
    $("#User_FirstName").css("border", "1px solid #d1d3e2")
    $("#Password").css("border", "1px solid #d1d3e2")
    $("#ReTryPassword").css("border", "1px solid #d1d3e2")
    $("#FirstNameEng").css("border", "1px solid #d1d3e2")
    $("#LastNameEng").css("border", "1px solid #d1d3e2")
    $("#Email").css("border", "1px solid #d1d3e2")
    $("#Phone").css("border", "1px solid #d1d3e2")
}

function doAppendNewImageData(data){
    let $this = this;
    let oldData = $this.element.data();
    if (oldData) {
      if (oldData.images.length) {
        oldData.images.push({link: data.link});
      } else {
        oldData.images = [];
        oldData.images.push({link: data.link});
      }
    } else {
      oldData.images = [];
      oldData.images.push({link: data.link});
    }
    $this.element.data(oldData);
    //console.log($this.element.data());
};

function doRemoveImage(e, imgLink, imageDiv){
    let $this = this;
    let data = this.element.data();
    let newData = data.images.filter((item) => {
      return (item.link !== imgLink)
    })
    this.element.data({images: newData});
    //console.log($this.element.data());
    $(imageDiv).remove();
}

module.exports = {
    Start_CaseLocalFile,
}