/* billreport.js */
module.exports = function ( jq ) {
	const $ = jq;

	const apiconnector = require('../../case/mod/apiconnect.js')($);
  const util = require('./utilmod.js')($);
  const common = require('./commonlib.js')($);

	const pageFontStyle = {"font-family": "THSarabunNew", "font-size": "24px"};

  const doCallLoadHospitalList = function(){
    return new Promise(async function(resolve, reject) {
      const userdata = JSON.parse(localStorage.getItem('userdata'));
      let hospitalId = userdata.hospitalId;
      let userId = userdata.id;
      let rqParams = {userId: userId, hospitalId: hospitalId};
			console.log(rqParams);
      let apiUrl = '/api/hospital/list';
      try {
        let response = await common.doCallApi(apiUrl, rqParams);
				console.log(response);
				if (response.status.code == 200) {
        	resolve(response);
				} else if (response.status.code == 210) {
					reject({error: {code: 210, cause: 'Token Expired!'}});
				} else {
					let apiError = 'api error at /api/hospital/list';
					console.log(apiError);
					reject({error: apiError});
				}
      } catch(e) {
				console.log('ERR=>', e);
        reject(e);
      }
    });
  }

	const doCallDownloadPriceChart = function(hospitalId){
    return new Promise(async function(resolve, reject) {
      const userdata = JSON.parse(localStorage.getItem('userdata'));
      //let hospitalId = userdata.hospitalId;
      let userId = userdata.id;
      let rqParams = {userId: userId, hospitalId: hospitalId};
      let apiUrl = '/api/pricechart/download';
      try {
        let response = await common.doCallApi(apiUrl, rqParams);
				if (response.status.code == 200) {
        	resolve(response);
				} else if (response.status.code == 210) {
					reject({error: {code: 210, cause: 'Token Expired!'}});
				} else {
					let apiError = 'api error at /api/pricechart/download';
					console.log(apiError);
					reject({error: apiError});
				}
      } catch(e) {
        reject(e);
      }
    });
  }

  const doCreateBillReportTitlePage = function(){
    let pageLogoBox = $('<div style="position: relative; display: inline-block;"></div>');
    let logoPage = $('<img src="/images/bill-icon.png" width="40px" height="auto"/>');
    $(logoPage).appendTo($(pageLogoBox));
    let titleBox = $('<div class="title-content"></div>');
    let titleText = $('<h3 style="position: relative; display: inline-block; margin-left: 10px; top: -10px;">ออกบิล</h3>')
    $(titleBox).append($(pageLogoBox)).append($(titleText));
    return $(titleBox);
  }

  const doAppendLastSixMonthOption = function(selector){
    var today = new Date();
    for(var i = 0; i < 6; i++) {
      let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      let m = d.getMonth() + 1;
      if (m < 10) {
        m = '0' + m;
      }
      let y = d.getFullYear();
      let my = m + '-' + y;
      let opt = undefined;
      if (i == 0) {
        opt = $('<option value="' + my + '">เดือนปัจจุบัน</option>');
      } else {
        opt = $('<option value="' + my + '">' + my + '</option>');
      }
      $(selector).append($(opt));
    }
    return $(selector);
  }

  const fmtReportDate = function(d){
    let date = new Date(d);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear() + 543);
  }

	const fmtReportTime = function(d){
    let date = new Date(d);
		let hh = date.getHours();
		if (hh < 10) {
			hh = '0' + hh;
		} else {
			hh = '' + hh;
		}
		let mn = date.getMinutes();
		if (mn < 10){
			mn = '0' + mn;
		} else {
			mn = '' + mn;
		}
    return hh + '.' + mn;
  }

  const fmtReportNumber = function (x) {
    return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


	const strToDateFmt = function(strToken) {
		var yy = strToken.substr(0, 4);
		var mo = strToken.substr(4, 2);
		var dd = strToken.substr(6, 2);
		return Number(dd) + '/' + Number(mo) + '/' + (Number(yy) + 543);
	}
	const strToTimeFmt = function(strToken) {
		var hh = strToken.substr(0, 2);
		var mn = strToken.substr(2, 2);
		return hh + '.' + mn;
	}

	const strToDateTime = function(strDateToken, strTimeToken) {
		var yy = strDateToken.substr(0, 4);
		var mo = strDateToken.substr(4, 2);
		var dd = strDateToken.substr(6, 2);
		var hh = strTimeToken.substr(0, 2);
		var mn = strTimeToken.substr(2, 2);
		var ss = strTimeToken.substr(4, 2);
		return yy + '-' + mo + '-' + dd + ' ' + hh + ':' + mn + ':' + ss;
	}

	const doOpenSelectFile = function(evt, hospitalId){
		const userdata = JSON.parse(localStorage.getItem('userdata'));
		//const hospitalId = userdata.hospitalId;
		const userId = userdata.id;
		const maxSizeDef = 100000000;
		let openFileCmd = evt.currentTarget;
	  let fileBrowser = $('<input type="file" name="pricechart" multiple style="display: none;"/>');
	  let simpleProgressBar = $('<div style="position: relative; border: 2px solid black; width: 100%; min-height: 20px; background-color: white;"></div>');
	  let indicator = $('<div style="position: relative; width: 0px; padding: 0px; background-color: blue; min-height: 18px; text-align: center; color: white;"></div>');
	  $(indicator).appendTo($(simpleProgressBar))
	  $(fileBrowser).on('change', (evt) =>{
	    //console.log(evt.currentTarget.files);
	    var fileSize = evt.currentTarget.files[0].size;
	    var fileType = evt.currentTarget.files[0].type;
	    //console.log(fileSize);
	    //console.log(fileType);
	    if (fileSize <= maxSizeDef) {
	      if ((fileType === util.XLSX_FILE_TYPE)){
	        let uploadUrl = '/api/pricechart/upload';
	        $(fileBrowser).simpleUpload(uploadUrl, {
	          start: function(file){
							$('body').loading('start');
	            $(indicator).css({'width': '0px', 'background-color': 'blue'});
	          },
	          progress: function(progress){
	            let percentageValue = Math.round(progress);
	            $(indicator).css({'width': percentageValue + '%'});
	            $(indicator).text(percentageValue + '%');
	          },
	          success: async function(data){
	            $(fileBrowser).remove();
	            $(simpleProgressBar).remove();

							let rqParams = {hospitalId: hospitalId};
							let apiUrl = '/api/pricechart/select';
							let callRes = await common.doCallApi(apiUrl, rqParams);
							if ((callRes.Records) && (callRes.Records.length > 0)) {
								apiUrl = '/api/pricechart/update';
							} else {
								apiUrl = '/api/pricechart/add';
							}
							rqParams = {hospitalId: hospitalId, prices: data.pricecharts};
							callRes = await common.doCallApi(apiUrl, rqParams);
							if (callRes.status.code == 200){
								$.notify('ปรับปรุงข้อมูลสำเร็จ', 'success');
							} else {
								$.notify('เกิดข้อผิดพลาด', 'error');
							}
							$('body').loading('stop');
	          },
	          error: function(error){
	            $(indicator).css({'width': '100%', 'background-color': 'red'});
	            $(indicator).text('Upload Fail => ' + JSON.stringify(error));
							$('body').loading('stop');
	          }
	        });
	      } else {
	        $(indicator).css({'width': '100%', 'background-color': 'red'});
	        $(indicator).text('Upload File type not support, Please remind that use zip file only.');
	      }
	    } else {
	      $(indicator).css({'width': '100%', 'background-color': 'red'});
	      $(indicator).text('Upload File size Exceed => ' + maxSizeDef + ' bytes.');
	    }
	  });
	  $(openFileCmd).parent().append($(fileBrowser));
	  $(openFileCmd).parent().append($(simpleProgressBar));
	  $(fileBrowser).click();
	}

	const doCreateSettingPriceChart = function(hospitalId){
		const accorBox = $('<div id="AccorBox"></div>');
		let accorTitleBox = $('<div class="accorhead"><b>ปรับปรุงค่า DF และราคาเรียกเก็บ</b></div>');
		let accorContbox = $('<div class="accorcont"></div>');
		let downloadBox = $('<div style="position: relative; width: 100%;"></div>');
		let downloadTemplateBox = $('<div style="position: relative; display: inline-block; text-align: center;"></div>');
		let templateIcon = $('<img src="/images/excel-icon.png"/>');
		$(templateIcon).css({'position': 'relative', 'width': '40px', 'height': 'auto', 'cursor': 'pointer', 'padding': '4px', 'top': '20px', 'margin-left': '10px'});
		$(templateIcon).on('click', (evt)=>{
			$('body').loading('start');
			let templateFileName = 'Template.xlsx';
			let xlsxLink = '/resource/'  + templateFileName;
			/*
			util.doCreateDownloadXLSX(xlsxLink).then((xlsxStream)=>{
				var pom = document.createElement('a');
				pom.setAttribute('href', xlsxStream);
				pom.setAttribute('download', templateFileName);
				pom.click();
			})
			*/
			let pom = document.createElement('a');
			pom.setAttribute('href', xlsxLink);
			pom.setAttribute('download', templateFileName);
			pom.click();
			$('body').loading('stop');
		});
		let templateLabel = $('<div>Download Template File</div>');
		$(downloadTemplateBox).append($(templateIcon)).append($(templateLabel));

		let downloadCurrentCharteBox = $('<div style="position: relative; display: inline-block; text-align: center; margin-left: 20px;"></div>');
		let currentChartIcon = $('<img src="/images/excel-icon.png"/>');
		$(currentChartIcon).css({'position': 'relative', 'width': '40px', 'height': 'auto', 'cursor': 'pointer', 'padding': '4px', 'top': '20px', 'margin-left': '10px'});
		$(currentChartIcon).on('click', async(evt)=>{
			$('body').loading('start');
			doCallDownloadPriceChart(hospitalId).then((dwnRes)=>{
				let dwnLink = dwnRes.download.link;
				let dwnFile = dwnRes.download.file;
				let pom = document.createElement('a');
				pom.setAttribute('href', dwnLink);
				pom.setAttribute('download', dwnFile);
				pom.click();
				$('body').loading('stop');
			}).catch(async (err)=>{
				if (err.error.code == 210){
					let rememberme = localStorage.getItem('rememberme');
					if (rememberme == 1) {
						let newUserData = await apiconnector.doCallNewTokenApi();
						localStorage.setItem('token', newUserData.token);
						localStorage.setItem('userdata', JSON.stringify(newUserData.data));
						doCallDownloadPriceChart(hospitalId).then((dwnRes)=>{
							let dwnLink = dwnRes.download.link;
							let dwnFile = dwnRes.download.file;
							let pom = document.createElement('a');
							pom.setAttribute('href', dwnLink);
							pom.setAttribute('download', dwnFile);
							pom.click();
							$('body').loading('stop');
						});
					} else {
						common.doUserLogout();
					}
				}
			});
		});
		let currentChartLabel = $('<div>ค่า DF และราคาเรียกเก็บปัจจุบัน</div>');
		$(downloadCurrentCharteBox).append($(currentChartIcon)).append($(currentChartLabel));

		$(downloadBox).append($(downloadTemplateBox)).append($(downloadCurrentCharteBox));

		let uplaodExcelBox = $('<div style="padding: 10px; background-color: white;"></div>');
		let openFileCmd = $('<button style="width: 100%">Upload</button>');
		$(uplaodExcelBox).append($(openFileCmd));

		$(openFileCmd).on('click', (evt)=>{
			doOpenSelectFile(evt, hospitalId);
		});

		$(accorTitleBox).on('click', (evt)=>{
			let accorCont = $('.accorhead').parent().find('.accorcont');
			if($(accorCont).css('display') !== 'block'){
				$('.active').slideUp('fast').removeClass('accoractive');
				$(accorCont).addClass('accoractive').slideDown('slow');
			} else {
				$(accorCont).slideUp('fast').removeClass('accoractive');
			}
		});

		$(accorContbox).append($(downloadBox)).append($(uplaodExcelBox));
		$(accorBox).append($(accorTitleBox)).append($(accorContbox));
		return $(accorBox);
	}

  const doCreateReportOptionForm = function(){
		/*
			การทำงานย้อนหลัง เมื่อกด Cancel ยังไม่ถูกต้องบางจุดว
		*/
    const tableRow = '<div style="display: table-row; width: 100%;"></div>';
    const tableCell = '<div style="display: table-cell; text-align: left; padding: 5px;"></div>';
    const mainForm = $('<div></div>');
    let titleForm = $('<div><h3>ตัวเลือกการออกบิล</h3></div>');
    let reportForm = $('<div style="display: table; width: 100%; border-collapse: collapse; margin-top: 0px;"></div>');
    let itemRow = $(tableRow);
    let itemLabelCol = $(tableCell);
    let itemValueCol = $(tableCell);
    let hosLabelCol = $(tableCell);
    let hosValueCol = $(tableCell);
    let monthLabelCol = $(tableCell);
    let monthValueCol = $(tableCell);
    $(reportForm).append($(itemRow));
    $(itemRow).append($(itemLabelCol)).append($(itemValueCol)).append($(hosLabelCol)).append($(hosValueCol)).append($(monthLabelCol)).append($(monthValueCol));
    $(itemLabelCol).append('<span>ประเภทบิล</span>');
    let typeOption = $('<select></select>');
    $(typeOption).append('<option value="0">โปรดเลือกประเภทบิล</option>');
    $(typeOption).append('<option value="1">โรงพยาบาล</option>');
    $(typeOption).append('<option value="2">รังสีแพทย์</option>');
    let hosOption = $('<select></select>');
    let monthOption = $('<select></select>');
    monthOption = doAppendLastSixMonthOption(monthOption);

    let hosSelectedLabel = undefined;
    let typeSelectedLabel = undefined;

    let billType = undefined;
    let hospitalId = undefined;
    let monthSelected = undefined;
		let cutoffTimeSelected =undefined;

    let cancelHosCmd = $('<input type="button" value=" ยกเลิก " style="margin-left: 10px;"/>');
    $(cancelHosCmd).on('click', (evt)=>{
      $(hosValueCol).empty();
      $(hosLabelCol).empty();
      $(typeSelectedLabel).remove();
      $(typeOption).show();
    });

    let cancelMonthCmd = $('<input type="button" value=" ยกเลิก " style="margin-left: 10px;"/>');
    $(cancelMonthCmd).on('click', (evt)=>{
      $(monthValueCol).empty();
      $(monthLabelCol).empty();
      $(hosSelectedLabel).remove();
			$(showHrPatientLinkOptionCmd).remove();
			$(showHrPatientLinkOptionLabel).remove();
      $(hosOption).show();
      $(cancelHosCmd).show();
      $(".mainfull").find('#AccorBox').remove();
			$(".mainfull").find('#ReportViewBox').remove();
    });

		let showHrPatientLinkOptionCmd = $('<input type="checkbox" id="ShowHrPatientLinkOption" value="0" style="transform: scale(1.5)">').css({'margin-left': '10px'});
		let showHrPatientLinkOptionLabel = $('<label for="ShowHrPatientLinkOption">แสดงภาพประวัติ/ผลอ่าน</label>').css({'margin-left': '5px'});

		$(showHrPatientLinkOptionCmd).on('click', (evt)=>{
			let value = $(showHrPatientLinkOptionCmd).prop('checked');
			if (value == 1) {
				$(showHrPatientLinkOptionLabel).text('ซ่อนภาพประวัติ/ผลอ่าน');
				$('.hr-patient-cell').show();
			} else {
				$(showHrPatientLinkOptionLabel).text('แสดงภาพประวัติ/ผลอ่าน');
				$('.hr-patient-cell').hide();
			}
		});

    let hosOptionChangeEvt = function(evt) {
      hospitalId = $(hosOption).val();
      if (hospitalId > 0){
        $(hosOption).css({'border': ''});
        let hosOptionSelected = $(hosOption).find('option:selected').text();
        hosSelectedLabel = $('<span><b>' + hosOptionSelected + '</b></span>');
        $(hosOption).hide();
        $(cancelHosCmd).hide();
				$(hosLabelCol).append($('<span style="margin-left: 4px;">&gt;&gt;</span>'));
        $(hosValueCol).append($(hosSelectedLabel));

				let cutoffTimeOption = $('<select></select>');
				$(cutoffTimeOption).append($('<option value="1">วันเวลาส่งอ่านผล</option>'));
				$(cutoffTimeOption).append($('<option value="2">วันเวลาสแกน</option>'));

        let okCmd = $('<input type="button" value=" ตกลง " style="margin-left: 10px;"/>');
        $(okCmd).on('click', (evt)=>{
          monthSelected = $(monthOption).val();
					cutoffTimeSelected = $(cutoffTimeOption).val();
          doCreateReportContent(billType, hospitalId, monthSelected, cutoffTimeSelected);
          $(okCmd).val(' พิมพ์ ');
          $(okCmd).unbind('click');
          $(okCmd).click(function(prntEvt){
            printJS('ReportViewBox', 'html');
          });

					let workSheetName = hosOptionSelected + '-' + monthSelected;
					let exportCmd = doCreateExportCmd(workSheetName);
					$(exportCmd).insertAfter($(okCmd));
					$(monthValueCol).append($(showHrPatientLinkOptionCmd)).append($(showHrPatientLinkOptionLabel))
        });

        $(monthLabelCol).append($('<span>เดือน</span>'));
        $(monthValueCol).append($(monthOption).css({'margin-left': '4px'}));
				$(monthValueCol).append($('<span>จับเวลาที่</span>').css({'margin-left': '4px'}));
				$(monthValueCol).append($(cutoffTimeOption).css({'margin-left': '4px'}));

				$(monthValueCol).append($(okCmd)).append($(cancelMonthCmd));

				let priceSettingBox = doCreateSettingPriceChart(hospitalId);
				$(mainForm).append($(priceSettingBox))
      } else {
        $(hosOption).css({'border': '1px solid red'});
        const sorryMsg = $('<div>หากไม่ระบุ <b>โรงพยาบาล</b> ก็ไปต่อไม่ได้</div>');
        $(sorryMsg).append($('<p>โปรดช่วยระบุ โรงพยาบาล</p>'));
        const radalertoption = {
          title: 'โปรดทราบ',
          msg: $(sorryMsg),
          width: '560px',
          onOk: function(evt) {
            radAlertBox.closeAlert();
          }
        }
        let radAlertBox = $('body').radalert(radalertoption);
        $(radAlertBox.cancelCmd).hide();
      }
    }

    let typeOptionChangeEvt = function(evt) {
      billType = $(typeOption).val();
      if (billType == 1) {
        $(typeOption).css({'border': ''});
        let typeOptionSelected = $(typeOption).find('option:selected').text();
        typeSelectedLabel = $('<span><b>' + typeOptionSelected + '</b></span>');
        $(typeOption).hide();
				$(itemLabelCol).append($('<span style="margin-left: 4px;">&gt;&gt;</span>'));
        $(itemValueCol).append($(typeSelectedLabel));
        $(hosOption).append($('<option value="0">โปรดเลือกโรงพยาบาล</option>'));
        doCallLoadHospitalList().then((callRes)=>{
          callRes.Records.forEach((item, i) => {
            let hos = $('<option value="' + item.id + '">' + item.Hos_Name + '</option>');
            $(hosOption).append($(hos));
          });
				}).catch(async (err)=>{
          if (err.error.code == 210){
            let rememberme = localStorage.getItem('rememberme');
            if (rememberme == 1) {
              let newUserData = await apiconnector.doCallNewTokenApi();
              localStorage.setItem('token', newUserData.token);
              localStorage.setItem('userdata', JSON.stringify(newUserData.data));
							doCallLoadHospitalList().then((callRes)=>{
			          callRes.Records.forEach((item, i) => {
			            let hos = $('<option value="' + item.id + '">' + item.Hos_Name + '</option>');
			            $(hosOption).append($(hos));
			          });
							});
            } else {
              common.doUserLogout();
            }
          }
        });
        $(hosOption).on('change', hosOptionChangeEvt);
        $(hosLabelCol).append($('<span>โรงพยาบาล</span>'));
        $(hosValueCol).append($(hosOption)).append($(cancelHosCmd));
      } else if (billType == 2) {
        $(typeOption).css({'border': ''});
        let typeOptionSelected = $(typeOption).find('option:selected').text();
				typeSelectedLabel = $('<span><b>' + typeOptionSelected + '</b></span>');
        $(typeOption).hide();
				$(itemLabelCol).append($('<span style="margin-left: 4px;">&gt;&gt;</span>'));
        $(itemValueCol).append($(typeSelectedLabel));

				let cancelSorryCmd = $('<input type="button" value=" ยกเลิก "/>');
				$(cancelSorryCmd).on('click', (evt)=>{
					$(hosValueCol).empty();
		      $(hosLabelCol).empty();
		      $(typeSelectedLabel).remove();
		      $(typeOption).show();
					$(".mainfull").find('#UnderContructionBox').remove();
				});
				$(hosLabelCol).append($(cancelSorryCmd));
				let underStructMsg = $('<div id="UnderContructionBox" style="position: relative; width: 100%; margin-top: 10px; text-align: center;"><img src="/images/under-contruction.jpg"/><h3>ขออภัยในความไม่สะดวก</h3><p>ฟังก์นี้อยู่ระหว่างดำเนินการ โปรดลองใหม่ภายหลัง</p><p>คลิกปุ่ม <b>ยกเลิก</b> เพื่อย้อนกลับ</p></div>');
				$(underStructMsg).find('p').css({'text-align': ' left'});
				$(".mainfull").append($(underStructMsg));

      } else {
        $(typeOption).css({'border': '1px solid red'});
        const sorryMsg = $('<div>หากไม่ระบุ <b>ประเภทบิล</b> ก็ไปต่อไม่ได้</div>');
        $(sorryMsg).append($('<p>โปรดช่วยระบุ ประเภทบิล</p>'));
        const radalertoption = {
          title: 'โปรดทราบ',
          msg: $(sorryMsg),
          width: '560px',
          onOk: function(evt) {
            radAlertBox.closeAlert();
          }
        }
        let radAlertBox = $('body').radalert(radalertoption);
        $(radAlertBox.cancelCmd).hide();
      }
    }

    $(typeOption).on('change', typeOptionChangeEvt);

    $(itemValueCol).append($(typeOption));
    $(reportForm).addClass('title-content');
    return $(mainForm).append($(titleForm)).append($(reportForm));
  }

	const doCreateExportCmd = function(wsName){
		let exportCmd = $('<input type="button" value=" Excel " style="margin-left: 10px;"/>');
		$(exportCmd).on('click', (evt)=>{
			$("#ReportViewBox").excelexportjs({
			  containerid: 'ContentTable',
			  datatype: 'table',
				encoding: "utf-8",
				locale: 'th-TH',
				worksheetName: wsName
			});
		});
		return $(exportCmd);
	}

  const doCreateReportContentForm = function(contents, cutoffTimeSelected){
		return new Promise(async function(resolve, reject) {
			/*
			cutoffTimeSelected 1=updatedAt, 2=scan
			*/
	    const reportViewBox = $('<div id="ReportViewBox" style="position: relative; width: 100%; padding: 5p; margin-top: 8px;"></div>');

	    if (contents.length > 0){
	      let initTable = $('<table id ="ContentTable" width="100%" cellpadding="5" cellspacing="0" border="1px solid black"></table>');

				let contentTable = doRenderHeaderTableRow(initTable);

	      let itemNo = 1;
	      let priceTotal = 0;
	      for (let i=0; i < contents.length; i++){

	        let item = contents[i];
					//console.log(item);
	        let scanParts = item.Case_ScanPart;
	        for (let j=0; j < scanParts.length; j++){
	          let itemRow = $('<tr></tr>');
						/*
	          let fmtDate = fmtReportDate(item.createdAt);
						let isOutTime = common.doCheckOutTime(item.createdAt);
						*/
						let fmtScanDate = strToDateFmt(item.scanDate);
						let fmtScanTime = strToTimeFmt(item.scanTime);
						let fmtCaseCreateDate = fmtReportDate(item.updatedAt);
						let fmtCaseCreateTime = fmtReportTime(item.updatedAt);

						let fmtScanDateTime = strToDateTime(item.scanDate, item.scanTime);
						let scanDateTime = new Date(fmtScanDateTime);
						//let urgentType = JSON.parse(item.urgenttype.UGType_WorkingStep);
						let urgentType = item.urgenttype.UGType_WorkingStep;
						let urgentShiftTimeVal = (Number(urgentType.dd)* 24*60*60*1000) + (Number(urgentType.hh)*60*60*1000) + (Number(urgentType.mn)*60*1000);
						let urgentTime = undefined;
						if (cutoffTimeSelected == 1) {
							let uploadedAt = item.Case_UploadedAt;
							if (!uploadedAt) {
								uploadedAt = item.updatedAt;
							}
							urgentTime = (new Date(uploadedAt)).getTime() + urgentShiftTimeVal;
						} else {
							urgentTime = (new Date(fmtScanDateTime)).getTime() + urgentShiftTimeVal;
						}
						let urgentDate = new Date(urgentTime);

						let fmtCaseUrgentDate = fmtReportDate(urgentDate);
						let fmtCaseUrgentTime = fmtReportTime(urgentDate);


						let fmtReportCreateDate = fmtReportDate(item.reportCreatedAt);
						let fmtReportCreateTime = fmtReportTime(item.reportCreatedAt);

						let reportAtDateTime = new Date(item.reportCreatedAt);

						let isCutoff = true;
						if (urgentDate.getTime() < reportAtDateTime.getTime()) {
							isCutoff = false;
						}

						let isOutTime = common.doCheckOutTime(item.reportCreatedAt);
						let fmtPrice = undefined;
						if (scanParts[j].PR) {
	          	fmtPrice = fmtReportNumber(Number(scanParts[j].PR));
	          	priceTotal += Number(scanParts[j].PR);
						} else {
							let prRes = await common.doCallPriceChart(item.hospitalId, scanParts[j].id);
							fmtPrice = fmtReportNumber(Number(prRes.prdf.pr.normal));
							priceTotal += Number(prRes.prdf.pr.normal);
						}
	          $(itemRow).append('<td align="center">' + itemNo + '</td>');
						$(itemRow).append('<td align="left">' + fmtScanDate + '</td>');
						$(itemRow).append('<td align="left">' + fmtScanTime + '</td>');
						$(itemRow).append('<td align="left">' + fmtCaseCreateDate + '</td>');
						$(itemRow).append('<td align="left">' + fmtCaseCreateTime + '</td>');
						$(itemRow).append('<td align="left">' + fmtCaseUrgentDate + '</td>');
						$(itemRow).append('<td align="left">' + fmtCaseUrgentTime + '</td>');
	          $(itemRow).append('<td align="left">' + fmtReportCreateDate + '</td>');
						$(itemRow).append('<td align="left">' + fmtReportCreateTime + '</td>');
						if (isCutoff) {
							$(itemRow).append('<td align="center">ทัน</td>');
						} else {
							$(itemRow).append('<td align="center">ไม่ทัน</td>');
						}
	          $(itemRow).append('<td align="left">' + item.patient.Patient_HN + '</td>');
	          $(itemRow).append('<td align="left">' + item.patient.Patient_NameTH + ' ' + item.patient.Patient_LastNameTH + '</td>');
	          $(itemRow).append('<td align="left">' + scanParts[j].Name + '</td>');
						$(itemRow).append('<td align="left">' + item.radio.User_NameTH + ' ' + item.radio.User_LastNameTH + '</td>');
	          $(itemRow).append('<td align="left">' + scanParts[j].Code + '</td>');
	          $(itemRow).append('<td align="right">' + fmtPrice + '</td>');
						let hrPatientLinkCell = $('<td align="left" class="hr-patient-cell"></td>');
						if (item.Case_PatientHRLink.length > 0) {
							await item.Case_PatientHRLink.forEach((hr, i) => {
								let type = hr.link.substring(hr.link.length-3);
								if ((type==='jpg') || (type === 'png') || (type === 'pdf')) {
									let hrIcon = $('<img src="/images/image-icon.png" width="22px" height="auto"/>').css({'position': 'relative', 'display': 'inline-block'});
									$(hrIcon).css({'cursor': 'pointer'});
									$(hrIcon).on('click', (evt)=>{
										window.open(hr.link, '_blank');
									});
									$(hrPatientLinkCell).append($(hrIcon));
								}
							});
						} else {
							$(hrPatientLinkCell).text('ไม่มีภาพประวัติแนบ');
						}

						let pdfIcon = $('<img src="/images/pdf-icon.png" width="22px" height="auto"/>').css({'position': 'relative', 'display': 'inline-block', 'margin-left': '5px'});
						$(pdfIcon).css({'cursor': 'pointer'});
						$(pdfIcon).on('click', (evt)=>{
							window.open(item.reportLink, '_blank');
						});
						$(hrPatientLinkCell).append($(pdfIcon));

						$(itemRow).append($(hrPatientLinkCell));
						if (isOutTime) {
							$(itemRow).css({'background-color': 'grey', 'color': 'white'});
						}
	          $(contentTable).append($(itemRow));
	          itemNo += 1;
	        }
	      }

	      let finalRow = $('<tr></tr>');
	      $(finalRow).append('<td align="center" colspan="14">ผู้เข้ารับบริการทั้งหมด ' + (itemNo-1) + ' ราย</td>')
	      $(finalRow).append('<td align="center">รวม</td>');
	      $(finalRow).append('<td align="right">' + fmtReportNumber(priceTotal) + '</td>');
				$(finalRow).append('<td class="hr-patient-cell"></td>');
	      $(contentTable).append($(finalRow));

	      resolve($(reportViewBox).append($(contentTable)));
	    } else {
	      resolve($(reportViewBox).append($('<h3>ไม่พบรายการเคสของเดือนที่ต้องการออกบิล</h3>')));
	    }
		});
  }

  const doCreateReportContent = function (billType, hospitalId, monthSelected, cutoffTimeSelected){
		$('body').loading('start');
    let dateFrags = monthSelected.split('-');
    let dateFmt = dateFrags[1] + '-' + dateFrags[0] + '-01';
    var date = new Date(dateFmt);
    var fromDateKeyTime = new Date(date.getFullYear(), date.getMonth(), 1);
    var toDateKeyTime = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let fromDateFormat = util.formatDateStr(fromDateKeyTime) + ' 00:00:00';
    let toDateFormat = util.formatDateStr(toDateKeyTime) + ' 23:59:59';
    let key = {fromDateKeyValue: fromDateFormat, toDateKeyValue: toDateFormat};
    let billContentUrl = undefined;
    if (billType == 1) {
      billContentUrl = '/api/cases/bill/hospital/content';
    } else if (billType == 2) {
      billContentUrl = '/api/cases/bill/radio/content';
    }
    let callParams = {hospitalId: hospitalId, key: key};
    common.doCallApi(billContentUrl, callParams).then(async (callRes)=>{
      if (callRes.status.code == 200){
				console.log(callRes.Contents);
        let reportViewBox = await doCreateReportContentForm(callRes.Contents, cutoffTimeSelected);
        $(".mainfull").append($(reportViewBox));
				$('body').loading('stop');
      } else {
        $.notify('เกิดข้อผิดพลาดโปรดลองอีกครั้งภายหลัง', 'error');
				$('body').loading('stop');
      }
    });
  }


  const doOpenCreateBillForm = function(){
    let pageLogoBox = doCreateBillReportTitlePage();
		//let priceSettingBox = doCreateSettingPriceChart();
    let reportOptionForm = doCreateReportOptionForm();
    $(".mainfull").empty().append($(pageLogoBox))/*.append($(priceSettingBox))*/.append($(reportOptionForm));
  }

	const doRenderHeaderTableRow = function(table) {
		let firstHeaderRow = $('<tr></tr>');
		$(firstHeaderRow).append($('<td align="center" rowspan="2" width="5%"><b>ลำดับที่</b></td>'));
		$(firstHeaderRow).append($('<td align="center" colspan="2"><b>สแกน</b></td>'));
		$(firstHeaderRow).append($('<td align="center" colspan="2"><b>ส่งอ่านผล</b></td>'));
		$(firstHeaderRow).append($('<td align="center" colspan="2"><b>กำหนดรับผลอ่าน</b></td>'));
		$(firstHeaderRow).append($('<td align="center" colspan="2"><b>รังสีแพทย์ส่งผลอ่าน</b></td>'));
		$(firstHeaderRow).append($('<td align="center"><b>ทัน</b></td>'));
		$(firstHeaderRow).append($('<td align="center" rowspan="2" width="6%"><b>HN</b></td>'));
		$(firstHeaderRow).append($('<td align="center" rowspan="2" width="14%"><b>ชื่อ-สกุล</b></td>'));
		$(firstHeaderRow).append($('<td align="center" rowspan="2" width="12%"><b>รายการ</b></td>'));
		$(firstHeaderRow).append($('<td align="center" rowspan="2" width="14%"><b>รังสีแพทย์</b></td>'));
		$(firstHeaderRow).append($('<td align="center"><b>รหัส</b></td>'));
		$(firstHeaderRow).append($('<td align="center"><b>ราคาที่</b></td>'));
		$(firstHeaderRow).append($('<td align="center" class="hr-patient-cell"><b>ภาพประวัติ</b></td>'));
		$(table).append($(firstHeaderRow));

		let secondHeaderRow = $('<tr></tr>');
		$(secondHeaderRow).append($('<td align="center" width="5%"><b>วันที</b></td>'));
		$(secondHeaderRow).append($('<td align="center" width="4%"><b>เวลา</b></td>'));
		$(secondHeaderRow).append($('<td align="center" width="5%"><b>วันที</b></td>'));
		$(secondHeaderRow).append($('<td align="center" width="4%"><b>เวลา</b></td>'));
		$(secondHeaderRow).append($('<td align="center" width="5%"><b>วันที</b></td>'));
		$(secondHeaderRow).append($('<td align="center" width="4%"><b>เวลา</b></td>'));
		$(secondHeaderRow).append($('<td align="center" width="5%"><b>วันที</b></td>'));
		$(secondHeaderRow).append($('<td align="center" width="4%"><b>เวลา</b></td>'));
		$(secondHeaderRow).append($('<td align="center" width="4%"><b>ไม่ทัน</b></td>'));
		//$(secondHeaderRow).append($('<td align="center" width="6%"><b></b></td>'));
		//$(secondHeaderRow).append($('<td align="center" width="14%"><b></b></td>'));
		//$(secondHeaderRow).append($('<td align="center" width="15%"><b></b></td>'));
		//$(secondHeaderRow).append($('<td align="center" width="14%"><b></b></td>'));
		$(secondHeaderRow).append($('<td align="center" width="8%"><b>กรมบัญชีกลาง</b></td>'));
		$(secondHeaderRow).append($('<td align="center" width="6%"><b>เรียกเก็บ</b></td>'));
		$(secondHeaderRow).append($('<td align="center" class="hr-patient-cell" width="*"><b>ผลอ่าน</b></td>'));

		$(table).append($(secondHeaderRow));
		return $(table);
	}

  return {
    doOpenCreateBillForm
	}
}
