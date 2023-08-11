module.exports = function ( jq ) {
	const $ = jq;

	//const welcome = require('./welcome.js')($);

  const common = require('../../../home/mod/common-lib.js')($);
	const user = require('./user-mng.js')($);
	const customer = require('./customer-mng.js')($);
	const menugroup = require('./menugroup-mng.js')($);
	const menuitem = require('./menuitem-mng.js')($);
	const order = require('./order-mng.js')($);
	const template = require('./template-design.js')($);
	const message = require('./message-mng.js')($);

  const doCreateTitlePage = function(shopData, uploadLogoCallback, editShopCallback){
		let userdata = JSON.parse(localStorage.getItem('userdata'));
    let shopLogoIcon = new Image();
    if (shopData['Shop_LogoFilename'] !== ''){
    	shopLogoIcon.src = shopData['Shop_LogoFilename'];
    } else {
    	shopLogoIcon.src = '/shop/favicon.ico'
    }
		$(shopLogoIcon).css({"width": "140px", "height": "auto", "padding": "2px", "display": "block", "z-index": "9", "cursor": "pointer"});
		$(shopLogoIcon).on('click', (evt)=>{
			evt.stopPropagation();
			window.open(shopLogoIcon.src, '_blank');
		});
		let shopLogoIconBox = $('<div></div>').css({"position": "relative"/*, "border": "2px solid #ddd"*/ });
    $(shopLogoIconBox).append($(shopLogoIcon));
		let editShopLogoCmd = $('<img src="../../images/tools-icon-wh.png"/>').css({'position': 'absolute', 'width': '25px', 'height': 'auto', 'cursor': 'pointer', 'right': '2px', 'bottom': '2px', 'display': 'none', 'z-index': '21'});
		$(shopLogoIconBox).append($(editShopLogoCmd));
		$(shopLogoIconBox).hover(()=>{
			$(editShopLogoCmd).show();
		},()=>{
			$(editShopLogoCmd).hide();
		});
		$(editShopLogoCmd).on('click', (evt)=>{
			evt.stopPropagation();
			uploadLogoCallback(evt, shopLogoIconBox, shopData.id, (successData)=>{
				shopLogoIcon.src = successData.link;
			});
		});

    let shopName = $('<h2>' + shopData['Shop_Name'] + '</h2>').css({'line-height': '20px'});
    let shopAddress = $('<p>' + shopData['Shop_Address'] + '</p>').css({'line-height': '11px'});
    let shopTel = $('<p>โทร. ' + shopData['Shop_Tel'] + '</p>').css({'line-height': '11px'});

    let titlePageBox = $('<div style="padding: 4px;"></viv>').css({'width': '99.1%', 'text-align': 'center', 'font-size': '18px', 'border': '2px solid black', 'border-radius': '5px', 'background-color': 'grey', 'color': 'white'});
    let layoutPage = $('<table width="100%" cellspacing="0" cellpadding="0" border="0"></table>');
    let layoutRow = $('<tr></tr>');
    let letfSideCell = $('<td width="20%" align="center" valign="middle"></td>');
    let middleCell = $('<td width="65%" align="left" valign="middle" style="padding: 5px"></td>');
    let rightSideCell = $('<td width="*" align="center" style="position: relative;"></td>');
    $(letfSideCell).append($(shopLogoIconBox));
    $(middleCell).append($(shopName)).append($(shopAddress)).append($(shopTel));


		let shopMail = $('<p>อีเมล์ ' + shopData['Shop_Mail'] + '</p>').css({'line-height': '11px'});
    let shopVatNo = $('<p>หมายเลขผู้เสียภาษี ' + shopData['Shop_VatNo'] + '</p>').css({'line-height': '11px'});
		let shopPPQCNo = $('<p>หมายเลขพร้อมเพย์ <span>' + shopData['Shop_PromptPayNo'] + '</span></p>').css({'line-height': '11px'});

		if (shopData['Shop_Mail'] !== '') {
			$(middleCell).append($(shopMail));
			$(shopMail).hide();
		}
		if (shopData['Shop_VatNo'] !== '') {
			$(middleCell).append($(shopVatNo));
			$(shopVatNo).hide();
		}
		if ((shopData['Shop_PromptPayNo']) && (shopData['Shop_PromptPayNo'] !== '')) {
			$(middleCell).append($(shopPPQCNo));
			$(shopPPQCNo).hide();
		}

		let shopBillUsage = $('<p>จำนวนบิลที่ใช้<span id="BillDateChangeCmd">เดือนนี้</span> <span id="BillAmount" style="font-weight: bold;">0</span> บิล</p>').css({'line-height': '11px'});
		$(middleCell).append($(shopBillUsage));
		$(shopBillUsage).hide();

		let shopTaxinvoiceUsage = $('<p>จำนวนใบกำกับภาษีที่ใช้<span id="TaxInvoiceDateChangeCmd">เดือนนี้</span> <span id="TaxInvoiceAmount" style="font-weight: bold;">0</span> ใบ</p>').css({'line-height': '11px'});
		$(middleCell).append($(shopTaxinvoiceUsage));
		$(shopTaxinvoiceUsage).hide();

		let billUsageUrl = '/api/shop/bill/mount/count/' + shopData.id
		let params = {};
		common.doCallApi(billUsageUrl, params).then(async(billRes)=>{
			$('#BillAmount').text(billRes.count);
			if (shopData['Shop_VatNo'] !== '') {
				let taxinvoiceRes = await common.doCallApi('/api/shop/taxinvoice/mount/count/' + shopData.id, {});
				$('#TaxInvoiceAmount').text(taxinvoiceRes.count);
			}
			doControlChangeDateAmount(shopData);
		});

		if ((shopData['Shop_PromptPayNo']) && (shopData['Shop_PromptPayNo'] !== '')) {
			let doCreatePPQRCmd = common.doCreateTextCmd('สร้างพร้อมเพย์คิวอาร์โค้ด', 'grey', 'white');
			$(doCreatePPQRCmd).on('click', (evt)=>{
				evt.stopPropagation();
				doStartTestPPQC(evt, shopData);
			});
			$(middleCell).append($(doCreatePPQRCmd).css({'display': 'line-block', 'margin-top': '15px'}));
		}

		let doCreateOtherDetailCmd = common.doCreateTextCmd('ข้อมูลอื่นๆ', 'grey', 'white');
		$(doCreateOtherDetailCmd).on('click', (evt)=>{
			if ($(doCreateOtherDetailCmd).text() === 'ข้อมูลอื่นๆ') {
				$(doCreateOtherDetailCmd).text('ซ่อนข้อมูล');
				$(shopMail).show();
				$(shopVatNo).show();
				$(shopPPQCNo).show();
				$(shopBillUsage).show();
				$(shopTaxinvoiceUsage).show();
			} else {
				$(doCreateOtherDetailCmd).text('ข้อมูลอื่นๆ');
				$(shopMail).hide();
				$(shopVatNo).hide();
				$(shopPPQCNo).hide();
				$(shopBillUsage).hide();
				$(shopTaxinvoiceUsage).hide();
			}
		});
		$(middleCell).append($(doCreateOtherDetailCmd).css({'display': 'line-block', 'margin-top': '15px', 'margin-left': '5px'}));

		if (userdata.usertypeId == 1) {
			let backCmd = $('<input type="button" value=" Back " class="action-btn"/>');
	    $(backCmd).on('click', (evt)=>{
	      const main = require('../main.js');
	      main.doShowShopItems();
	    });
    	$(rightSideCell).append($(backCmd));
		} else {
			let shopConfigCmd = $('<img src="../../images/tools-icon-wh.png"/>').css({'width': '45px', 'height': 'auto', 'cursor': 'pointer'});
			$(rightSideCell).append($(shopConfigCmd));
			$(shopConfigCmd).on('click', (evt)=>{
				editShopCallback(shopData, (newShopData)=>{
					$(shopName).text(newShopData['Shop_Name']);
					$(shopAddress).text(newShopData['Shop_Address']);
					$(shopTel).text(newShopData['Shop_Tel']);
					$(shopMail).text(newShopData['Shop_Mail']);
					$(shopVatNo).text(newShopData['Shop_VatNo']);
					shopData['Shop_Name'] = newShopData['Shop_Name'];
					shopData['Shop_Address'] = newShopData['Shop_Address'];
					shopData['Shop_Tel'] = newShopData['Shop_Tel'];
					shopData['Shop_Mail'] = newShopData['Shop_Mail'];
					shopData['Shop_VatNo'] = newShopData['Shop_VatNo'];
					shopData['Shop_PromptPayNo'] = newShopData['Shop_PromptPayNo'];
					shopData['Shop_PromptPayName'] = newShopData['Shop_PromptPayName'];
				});
				$('#Shop_BillQuota').attr('readOnly', true);
			});
		}

		let shopMessageCmd = $('<img src="../../images/shop-message-icon.png"/>').css({'width': '45px', 'height': 'auto', 'cursor': 'pointer', 'position': 'absolute'});
		$(shopMessageCmd).on('click', (evt)=>{
			evt.stopPropagation();
			doOpenMyMessageCallBack(evt, shopData);
		});
		$(rightSideCell).append($('<br/>')).append($(shopMessageCmd).css({'bottom': '0px', 'margin-left': '-20px'}));

		let myMessageUrl = '/api/shop/message/month/new/count/' + shopData.id
		params = {userId: userdata.id};
		common.doCallApi(myMessageUrl, params).then((msgRes)=>{
			if (msgRes.count > 0) {
				const redCircleAmountStyle = {'display': 'inline-block', 'color': '#fff', 'text-align': 'center', 'line-height': '24px', 'border-radius': '50%', 'font-size': '16px', 'min-width': '28px', 'min-height': '28px', 'margin-top': '16%', 'margin-right': '95%', 'background-color': 'red', 'position': 'absolute', 'cursor': 'pointer'};
				let myMessageAmount = $('<div id="MessageAmount">2</div>').css(redCircleAmountStyle);
				$(myMessageAmount).text(msgRes.count);
				$(rightSideCell).append($(myMessageAmount));
			}
		});

    $(layoutRow).append($(letfSideCell)).append($(middleCell)).append($(rightSideCell));
    $(layoutPage).append($(layoutRow));
    return $(titlePageBox).append($(layoutPage));
	}

  const doCreateContolShopCmds = function(shopData){
    let commandsBox = $('<div style="padding: 4px;"></viv>').css({'width': '99.1%', 'height': '35px', 'text-align': 'left', 'border': '2px solid black', 'border-radius': '4px', 'background-color': 'grey', 'margin-top': '5px'});
    //let userMngCmd = $('<input type="button" value=" ผู้ใช้งาน " class="action-btn"/>').css({'margin-left': '10px'});
		let userMngCmd = $('<span>ผู้ใช้งาน</span>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'margin': '-3px 0px 0px 10px', 'padding': '4px', 'font-size': '16px', 'border': '3px solid grey', 'float': 'left'});
		$(userMngCmd).hover(()=>{	$(userMngCmd).css({'border': '3px solid black'});}, ()=>{	$(userMngCmd).css({'border': '3px solid grey'});});
    $(userMngCmd).on('click', (evt)=>{
      doUserMngClickCallBack(evt, shopData);
    });
    //let customerMngCmd = $('<input type="button" value=" รายการลูกค้า " class="action-btn"/>').css({'margin-left': '10px'});
		let customerMngCmd = $('<span>รายการลูกค้า</span>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'margin': '-3px 0px 0px 10px', 'padding': '4px', 'font-size': '16px', 'border': '3px solid grey', 'float': 'left'});
		$(customerMngCmd).hover(()=>{	$(customerMngCmd).css({'border': '3px solid black'});}, ()=>{	$(customerMngCmd).css({'border': '3px solid grey'});});
    $(customerMngCmd).on('click', (evt)=>{
      doCustomerMngClickCallBack(evt, shopData);
    });
    //let menugroupMngCmd = $('<input type="button" value=" รายการกลุ่มสินค้า " class="action-btn"/>').css({'margin-left': '10px'});
		let menugroupMngCmd = $('<span>รายการกลุ่มสินค้า</span>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'margin': '-3px 0px 0px 10px', 'padding': '4px', 'font-size': '16px', 'border': '3px solid grey', 'float': 'left'});
		$(menugroupMngCmd).hover(()=>{	$(menugroupMngCmd).css({'border': '3px solid black'});}, ()=>{	$(menugroupMngCmd).css({'border': '3px solid grey'});});
    $(menugroupMngCmd).on('click', (evt)=>{
      doMenugroupMngClickCallBack(evt, shopData);
    });
    //let menuitemMngCmd = $('<input type="button" value=" รายการสินค้า " class="action-btn"/>').css({'margin-left': '10px'});
		let menuitemMngCmd = $('<span>รายการสินค้า</span>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'margin': '-3px 0px 0px 10px', 'padding': '4px', 'font-size': '16px', 'border': '3px solid grey', 'float': 'left'});
		$(menuitemMngCmd).hover(()=>{	$(menuitemMngCmd).css({'border': '3px solid black'});}, ()=>{	$(menuitemMngCmd).css({'border': '3px solid grey'});});
    $(menuitemMngCmd).on('click', (evt)=>{
      doMenuitemMngClickCallBack(evt, shopData);
    });

    //let orderMngCmd = $('<input type="button" value=" ออร์เดอร์ " class="action-btn"/>').css({'margin-left': '10px'});
		let orderMngCmd = $('<span id="orderMngCmd">ออร์เดอร์</span>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'margin': '-3px 0px 0px 10px', 'padding': '4px', 'font-size': '16px', 'border': '3px solid grey', 'float': 'left'});
		$(orderMngCmd).hover(()=>{	$(orderMngCmd).css({'border': '3px solid black'});}, ()=>{ $(orderMngCmd).css({'border': '3px solid grey'});});
		$(orderMngCmd).addClass('sensitive-word');
    $(orderMngCmd).on('click', (evt)=>{
      doOrderMngClickCallBack(evt, shopData);
    });

		//let templateMngCmd = $('<input type="button" value=" รูปแบบเอกสาร " class="action-btn"/>').css({'margin-left': '10px'});
		let templateMngCmd = $('<span>รูปแบบเอกสาร</span>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'margin': '-3px 0px 0px 10px', 'padding': '4px', 'font-size': '16px', 'border': '3px solid grey', 'float': 'left'});
		$(templateMngCmd).hover(()=>{	$(templateMngCmd).css({'border': '3px solid black'});}, ()=>{ $(templateMngCmd).css({'border': '3px solid grey'});});
    $(templateMngCmd).on('click', (evt)=>{
      doTemplateMngClickCallBack(evt, shopData);
    });

		let calculatorCmd = $('<span>เครื่องคิดเลข</span>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'margin': '-3px 0px 0px 10px', 'padding': '4px', 'font-size': '16px', 'border': '3px solid grey', 'float': 'left'});
		$(calculatorCmd).hover(()=>{	$(calculatorCmd).css({'border': '3px solid black'});}, ()=>{ $(calculatorCmd).css({'border': '3px solid grey'});});
    $(calculatorCmd).on('click', (evt)=>{
      doOpenCalculatorCallBack(evt, shopData);
    });

    $(commandsBox).append($(orderMngCmd)).append($(menuitemMngCmd)).append($(menugroupMngCmd)).append($(customerMngCmd)).append($(userMngCmd)).append($(templateMngCmd)).append($(calculatorCmd));

		if (parseInt(shopData.Shop_StockingOption) == 1) {
			let earningCmd = $('<span>กำไร-ขาดทุน</span>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'margin': '-3px 0px 0px 10px', 'padding': '4px', 'font-size': '16px', 'border': '3px solid grey', 'float': 'left'});
			$(earningCmd).hover(()=>{	$(earningCmd).css({'border': '3px solid black'});}, ()=>{ $(earningCmd).css({'border': '3px solid grey'});});
			$(earningCmd).on('click', async (evt)=>{
				doOpenEarningCallBack(evt, shopData);
			});
			$(commandsBox).append($(earningCmd));
		}

		let logoutCmd = $('<span>ออกจากระบบ</span>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'margin': '-3px 5px 0px 0px', 'padding': '4px', 'font-size': '16px', 'border': '3px solid grey', 'float': 'right'});
		$(logoutCmd).on('click', (evt)=>{
			common.doUserLogout();
		});
		$(logoutCmd).hover(()=>{$(logoutCmd).css({'border': '3px solid black'});},()=>{$(logoutCmd).css({'border': '3px solid grey'});});

		return $(commandsBox).append($(logoutCmd));
  }

  const doShowShopMng = function(shopData, uploadLogCallback, editShopCallback){
    let titlePage = doCreateTitlePage(shopData, uploadLogCallback, editShopCallback);
    $('#App').empty().append($(titlePage));
    let shopCmdControl = doCreateContolShopCmds(shopData);
		let workingAreaBox = $('<div id="WorkingAreaBox" style="padding: 4px;"></viv>').css({'width': '99.1%', 'font-size': '14px' /*, 'border': '2px solid black', 'border-radius': '0px'*/});
		$(workingAreaBox).css({'margin-top': '8px'});
    $('#App').append($(shopCmdControl)).append($(workingAreaBox));
		let orderMngCmd = $(shopCmdControl).children(":first");
		$(orderMngCmd).click();
  }

	const doStartTestPPQC = function(evt, shopData){
		let editInput = $('<input type="number"/>').val(common.doFormatNumber(100)).css({'width': '100px', 'margin-left': '20px'});
		$(editInput).on('keyup', (evt)=>{
			if (evt.keyCode == 13) {
				$(dlgHandle.okCmd).click();
			}
		});
		let editLabel = $('<label>จำนวนเงิน(บาท):</label>').attr('for', $(editInput)).css({'width': '100%'});
		let ppQRBox = $('<div></div>').css({'width': '100%', 'height': '480px', 'margin-top': '20px'}).append($(editLabel)).append($(editInput));
		let editDlgOption = {
			title: 'สร้างพร้อมเพย์คิวอาร์โค้ด',
			msg: $(ppQRBox),
			width: '420px',
			onOk: async function(evt) {
				let newValue = $(editInput).val();
				if(newValue !== '') {
					$(editInput).css({'border': ''});
					let params = {
						Shop_PromptPayNo: shopData.Shop_PromptPayNo,
						Shop_PromptPayName: shopData.Shop_PromptPayName,
						netAmount: newValue,
					};
					let shopRes = await common.doCallApi('/api/shop/shop/create/ppqrcode', params);
					if (shopRes.status.code == 200) {
						$.notify("สร้างพร้อมเพย์คิวอาร์โค้ดสำเร็จ", "success");
						let ppqrImage = $('<img/>').attr('src', shopRes.result.qrLink).css({'width': '410px', 'height': 'auto'});
						$(ppqrImage).on('click', (evt)=>{
							evt.stopPropagation();
							window.open('/shop/share/?id=' + shopRes.result.qrFileName, '_blank');
						});

						let alertTextBox = $('<p></p>').text('ต้องการรับใบเสร็จ โปรดแจ้งแม่ค้า').css({'text-align': 'center', 'font-size': '30px', 'color': 'blue'});

						let openNewOrderCmd = common.doCreateTextCmd('ออกบิลใหม่', 'green', 'white');
						$(openNewOrderCmd).addClass('sensitive-word');
						$(openNewOrderCmd).attr('id', 'newOrderCmd');
						$(openNewOrderCmd).on('click', (evt)=>{
							evt.stopPropagation();
							dlgHandle.closeAlert();
							let workAreaBox = $('#WorkingAreaBox');
							order.doOpenOrderForm(shopData, workAreaBox);
						});

						$(ppQRBox).empty().append($(ppqrImage)).append($(alertTextBox)).append($(openNewOrderCmd)).css({'display': 'inline-block', 'text-align': 'center', 'margin-top': '20px'});
						$(dlgHandle.cancelCmd).show();
						$(dlgHandle.cancelCmd).val(' ตกลง ');
						$(dlgHandle.okCmd).hide();
					} else if (shopRes.status.code == 201) {
						$.notify("ไม่สามารถสร้างพร้อมเพย์คิวอาร์โค้ดได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "warn");
					} else {
						$.notify("เกิดข้อผิดพลาด ไม่สามารถสร้างพร้อมเพย์คิวอาร์โค้ดได้", "error");
					}
				} else {
					$.notify('จำนวนเงินต้องไม่ว่าง', 'error');
					$(editInput).css({'border': '1px solid red'});
				}
			},
			onCancel: function(evt){
				dlgHandle.closeAlert();
			}
		}
		let dlgHandle = $('body').radalert(editDlgOption);
		$(dlgHandle.cancelCmd).hide();
		return dlgHandle;
	}

  const doUserMngClickCallBack = async function(evt, shopData){
		let workingAreaBox = $('#WorkingAreaBox');
		await user.doShowUserItem(shopData, workingAreaBox);
  }

  const doCustomerMngClickCallBack = async function(evt, shopData){
    let workingAreaBox = $('#WorkingAreaBox');
		await customer.doShowCustomerItem(shopData, workingAreaBox)
  }

  const doMenugroupMngClickCallBack = async function(evt, shopData){
		let workingAreaBox = $('#WorkingAreaBox');
		await menugroup.doShowMenugroupItem(shopData, workingAreaBox)
  }

  const doMenuitemMngClickCallBack = async function(evt, shopData){
		let workingAreaBox = $('#WorkingAreaBox');
		await menuitem.doShowMenuitemItem(shopData, workingAreaBox)
  }

  const doOrderMngClickCallBack = async function(evt, shopData){
		let workingAreaBox = $('#WorkingAreaBox');
		await order.doShowOrderList(shopData, workingAreaBox);
  }

	const doTemplateMngClickCallBack = async function(evt, shopData){
		let workingAreaBox = $('#WorkingAreaBox');
		await template.doShowTemplateDesign(shopData, workingAreaBox)
	}

	const doOpenCalculatorCallBack = function(evt, shopData){
		let calcBox = $('<div id="root"></div>');
		let calcDlgOption = {
			title: 'เครื่องคิดเลข',
			msg: $(calcBox),
			width: '365px',
			onOk: function(evt) {
				$(calcScript).remove();
				dlgHandle.closeAlert();
			},
			onCancel: function(evt) {
				$(calcScript).remove();
				dlgHandle.closeAlert();
			}
		}
		let dlgHandle = $('body').radalert(calcDlgOption);
		$(dlgHandle.cancelCmd).hide();
		let calcScript = document.createElement("script");
		calcScript.type = "text/javascript";
		calcScript.src = "../lib/calculator.js";
		$("head").append($(calcScript));
	}

	const doOpenEarningCallBack = function(evt, shopData){
		localStorage.setItem('earnShopData', JSON.stringify(shopData));
		let earningBox = $('<div id="root"></div>');
		let earningDlgOption = {
			title: 'สรุปกำไร-ขาดทุน',
			msg: $(earningBox),
			width: '615px',
			onOk: function(evt) {
				$(earningScript).remove();
				localStorage.removeItem('earnShopData');
				dlgHandle.closeAlert();
			},
			onCancel: function(evt) {
				$(earningScript).remove();
				localStorage.removeItem('earnShopData');
				dlgHandle.closeAlert();
			}
		}
		let dlgHandle = $('body').radalert(earningDlgOption);
		$(dlgHandle.cancelCmd).hide();
		let earningScript = document.createElement("script");
		earningScript.type = "text/javascript";
		earningScript.src = "../lib/earning.js";
		$("head").append($(earningScript));
	}

	const doCreateMountSelectBox = function() {
		const mounts = [{display: 'ม.ค.', value: 1}, {display: 'ก.พ.', value: 2}, {display: 'มี.ค.', value: 3}, {display: 'เม.ย.', value: 4}, {display: 'พ.ค.', value: 5}, {display: 'มิ.ย.', value: 6}, {display: 'ก.ค.', value: 7}, {display: 'ส.ค.', value: 8}, {display: 'ก.ย.', value: 9}, {display: 'ต.ค.', value: 10}, {display: 'พ.ย.', value: 11}, {display: 'ธ.ค.', value: 12}];
		const years = ['2023', '2024', '2025', '2026'];
		let mainBox = $('<div></div>').css({'position': 'relative'})
		let d = new Date();
		let month = d.getMonth();
		let mountSelect = $('<select id="Mount"></select>');
		mounts.forEach((item, i) => {
			if (i == month) {
				$(mountSelect).append($('<option></option>').text(item.display).val(item.value).prop('selected', true));;
			} else {
				$(mountSelect).append($('<option></option>').text(item.display).val(item.value));
			}
		});

		let yearSelect = $('<select id="Year"></select>');
		years.forEach((item, i) => {
			$(yearSelect).append($('<option></option>').text(item).val(item));
		});

		$(mainBox).append($('<span>เดือน</span>'));
		$(mainBox).append($(mountSelect).css({'margin-left': '5px'}));
		$(mainBox).append($('<span>ปี</span>').css({'margin-left': '5px'}));
		$(mainBox).append($(yearSelect).css({'margin-left': '5px'}));

		return $(mainBox);
	}

	const doControlChangeDateAmount = function(shopData) {
		$('#BillDateChangeCmd').css({'padding': '2px', 'cursor': 'pointer'});
		$('#TaxInvoiceDateChangeCmd').css({'padding': '2px', 'cursor': 'pointer'});
		$('#BillDateChangeCmd').hover(()=>{
			$('#BillDateChangeCmd').css({'background-color': 'white', 'color': 'black', 'border': '1px solid black'});
		},()=>{
			$('#BillDateChangeCmd').css({'background-color': 'inherit', 'color': 'inherit', 'border': ''});
		});
		$('#BillDateChangeCmd').on('click', (evt)=>{
			let dlgHandle = undefined;
			let mountSelect = doCreateMountSelectBox();
			$(mountSelect).css({'margin-top': '10px'})
			let mountSelectDlgOption = {
				title: 'เลือกเดือนที่ต้องการเช็คจำนวนบิล',
				msg: $(mountSelect),
				width: '365px',
				onOk: function(evt) {
					let mm = $('#Mount').val();
					let yy = $('#Year').val();
					let billUsageUrl = '/api/shop/bill/mount/count/' + shopData.id;
					let billDate = `${yy}-${mm}-01`;
					let params = {billDate: billDate};
					common.doCallApi(billUsageUrl, params).then((billRes)=>{
						console.log(billRes);
						$('#BillAmount').text(billRes.count);
						$('#BillDateChangeCmd').text('เดือน ' + $('#Mount option:selected').text());
						dlgHandle.closeAlert();
					});
				},
				onCancel: function(evt) {
					dlgHandle.closeAlert();
				}
			}
			dlgHandle = $('body').radalert(mountSelectDlgOption);
		});

		$('#TaxInvoiceDateChangeCmd').hover(()=>{
			$('#TaxInvoiceDateChangeCmd').css({'background-color': 'white', 'color': 'black', 'border': '1px solid black'});
		},()=>{
			$('#TaxInvoiceDateChangeCmd').css({'background-color': 'inherit', 'color': 'inherit', 'border': ''});
		});
		$('#TaxInvoiceDateChangeCmd').on('click', (evt)=>{
			let mountSelect = doCreateMountSelectBox();
			$(mountSelect).css({'margin-top': '10px'})
			let mountSelectDlgOption = {
				title: 'เลือกเดือนที่ต้องการเช็คจำนวนบิล',
				msg: $(mountSelect),
				width: '365px',
				onOk: function(evt) {
					let mm = $('#Mount').val();
					let yy = $('#Year').val();
					let taxinvoiceUsageUrl = '/api/shop/taxinvoice/mount/count/' + shopData.id;
					let taxinvoiceDate = `${yy}-${mm}-01`;
					let params = {taxinvoiceDate: taxinvoiceDate};
					common.doCallApi(taxinvoiceUsageUrl, params).then((taxinvoiceRes)=>{
						console.log(taxinvoiceRes);
						$('#TaxInvoiceAmount').text(taxinvoiceRes.count);
						$('#TaxInvoiceDateChangeCmd').text('เดือน ' + $('#Mount option:selected').text());
						dlgHandle.closeAlert();
					});
				},
				onCancel: function(evt) {
					dlgHandle.closeAlert();
				}
			}
			dlgHandle = $('body').radalert(mountSelectDlgOption);
		});
	}

	const doOpenMyMessageCallBack = async function(evt, shopData){
		let workingAreaBox = $('#WorkingAreaBox');
		await message.doShowMyMesaage(shopData, workingAreaBox);
	}

  return {
    doShowShopMng
	}
}
