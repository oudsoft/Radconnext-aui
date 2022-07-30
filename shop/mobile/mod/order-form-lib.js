module.exports = function ( jq ) {
	const $ = jq;

  const common = require('../../home/mod/common-lib.js')($);
	const styleCommon = require('./style-common-lib.js')($);

	const customerdlg = require('../../setting/admin/mod/customer-dlg.js')($);
	const gooditemdlg = require('../../setting/admin/mod/gooditem-dlg.js')($);

  let pageHandle = undefined;

  const setupPageHandle = function(value){
    pageHandle = value;
  }

  const doOpenOrderForm = async function(shopId, workAreaBox, orderData, selectDate, doShowOrderList){
		let userdata = JSON.parse(localStorage.getItem('userdata'));
		let userId = userdata.id;
		let userinfoId = userdata.userinfoId;

    let orderObj = {};
    $(workAreaBox).empty();
    let titleText = 'เปิดออร์เดอร์ใหม่';
    if (orderData) {
      titleText = 'แก้ไขออร์เดอร์';
			orderObj.id = orderData.id;
			orderObj.Status = orderData.Status
    } else {
			orderObj.Status = 1;
		}
    let titlePageBox = $('<div style="padding: 4px;"></viv>').text(titleText).css(styleCommon.titlePageBoxStyle);
    let customerWokingBox = $('<div id="OrderCustomer" style="padding: 4px; width: 100%; border-bottom: 1px solid black"></viv>');
    let itemlistWorkingBox = $('<div id="OrderItemList" style="padding: 4px; width: 100%;"></viv>');
    let saveNewOrderCmdBox = $('<div></div>').css({'width': '100%', 'text-align': 'center'});
    $(workAreaBox).append($(titlePageBox)).append($(customerWokingBox)).append($(itemlistWorkingBox)).append($(saveNewOrderCmdBox));

    let customerForm = $('<table width="98%" cellspacing="0" cellpadding="0" border="0"></table>');
    let customerFormRow = $('<tr></tr>');
    let customerContent = $('<td width="85%" align="left"></tf>');
    let customerControlCmd = $('<td width="*" align="right" valign="middle"></tf>');
    $(customerFormRow).append($(customerContent)).append($(customerControlCmd));
    $(customerForm).append($(customerFormRow));
    $(customerWokingBox).append($(customerForm));

    let editCustomerCmd = $('<input type="button" class="action-btn"/>');

    let customerDataBox = undefined;
    if ((orderData) && (orderData.customer)) {
      orderObj.customer = orderData.customer;
      customerDataBox = doRenderCustomerContent(orderData.customer);
      $(customerContent).empty().append($(customerDataBox));
      $(editCustomerCmd).val('แก้ไขลูกค้า');
    } else {
      $(editCustomerCmd).val('ใส่ลูกค้า');
      $(customerContent).append($('<h2>ข้อมูลลูกค้า</h2>'));
    }
    if ((orderData) && (orderData.gooditems)) {
      orderObj.gooditems = orderData.gooditems;
    } else {
      orderObj.gooditems = [];
    }

		console.log(orderObj);

    let dlgHandle = undefined;

    $(editCustomerCmd).on('click', async (evt)=>{
			let customerDlgContent = await customerdlg.doCreateFormDlg({id: shopId}, customerSelectedCallback);
			$(customerDlgContent).find('input[type="text"]').css({'width': '280px', 'background': 'url("../../images/search-icon.png") right center / 8% 100% no-repeat'});
			$(pageHandle.menuContent).empty().append($(customerDlgContent).css({'position': 'relative', 'margin-top': '15px'}));
			$(pageHandle.toggleMenuCmd).click();
    });
		$(customerControlCmd).append($(editCustomerCmd));

		let addNewGoodItemCmd = undefined;
		//if (orderObj.Status == 1) {
		if ([1, 2].includes(orderObj.Status)) {
			addNewGoodItemCmd = common.doCreateTextCmd('เพิ่มรายการ', 'green', 'white');
	    $(addNewGoodItemCmd).on('click', async (evt)=>{
				let gooditemDlgContent = await gooditemdlg.doCreateFormDlg({id: shopId}, gooditemSelectedCallback);
				$(gooditemDlgContent).find('#SearchKeyInput').css({'width': '280px', 'background': 'url("../../images/search-icon.png") right center / 8% 100% no-repeat'});
				$(pageHandle.menuContent).empty().append($(gooditemDlgContent).css({'position': 'relative', 'margin-top': '15px'}));
				$(pageHandle.toggleMenuCmd).click();

	    });
		}

		let doShowCloseOrderDlg = async function() {
			let total = await doCalOrderTotal(orderObj.gooditems);
			if (total > 0) {
				dlgHandle = await doOpenCreateCloseOrderDlg(shopId, total, orderObj, invoiceCallback, billCallback, taxinvoiceCallback);
			} else {
				$.notify("ออร์เดอร์ยังไม่สมบูรณ์โปรดเพิ่มรายการสินค้าก่อน", "error");
			}
		}

		let callCreateCloseOrderCmd = common.doCreateTextCmd(' คิดเงิน ', '#F5500E', 'white', '#5D6D7E', '#FF5733');
		$(callCreateCloseOrderCmd).on('click', async (evt)=>{
			if (orderObj.customer) {
				let params = undefined;
				let orderRes = undefined;
				if ((orderData) && (orderData.id)) {
					params = {data: {Items: orderObj.gooditems, Status: orderObj.Status, customerId: orderObj.customer.id, userId: userId, userinfoId: userinfoId}, id: orderData.id};
					orderRes = await common.doCallApi('/api/shop/order/update', params);
					if (orderRes.status.code == 200) {
						$.notify("บันทึกรายการออร์เดอร์สำเร็จ", "success");
						doShowCloseOrderDlg();
					} else {
						$.notify("ระบบไม่สามารถบันทึกออร์เดอร์ได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "error");
					}
				} else {
					params = {data: {Items: orderObj.gooditems, Status: 1}, shopId: shopId, customerId: orderObj.customer.id, userId: userId, userinfoId: userinfoId};
          orderRes = await common.doCallApi('/api/shop/order/add', params);
          if (orderRes.status.code == 200) {
            $.notify("เพิ่มรายการออร์เดอร์สำเร็จ", "success");
						orderObj.id = orderRes.Records[0].id;
						orderData = orderRes.Records[0];
						doShowCloseOrderDlg();
          } else {
            $.notify("ระบบไม่สามารถบันทึกออร์เดอร์ได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "error");
          }
				}
			} else {
        $.notify("โปรดระบุข้อมูลลูกค้าก่อนบันทึกออร์เดอร์", "error");
      }
    });

    if ((orderObj) && (orderObj.gooditems)){
      let goodItemTable = await doRenderGoodItemTable(orderObj);
			let addItemCmdBox = $(goodItemTable).find('#AddItemCmdBox');
			if (addNewGoodItemCmd) {
				$(addItemCmdBox).append($(addNewGoodItemCmd));
			}
			let closeOrderCmdBox = $(goodItemTable).find('#CloseOrderCmdBox');
			$(closeOrderCmdBox).append($(callCreateCloseOrderCmd));
      $(itemlistWorkingBox).append($(goodItemTable));
    }

    let cancelCmd = $('<input type="button" value=" กลับ "/>').css({'margin-left': '10px'});
    $(cancelCmd).on('click', async(evt)=>{
      await doShowOrderList(shopId, workAreaBox, selectDate);
    });
    let saveNewOrderCmd = $('<input type="button" value=" บันทึก " class="action-btn"/>');
    $(saveNewOrderCmd).on('click', async(evt)=>{
      if (orderObj.customer) {
        let params = undefined;
        let orderRes = undefined;
        if (orderData) {
          params = {data: {Items: orderObj.gooditems, Status: 1, customerId: orderObj.customer.id, userId: userId, userinfoId: userinfoId}, id: orderData.id};
          orderRes = await common.doCallApi('/api/shop/order/update', params);
          if (orderRes.status.code == 200) {
            $.notify("บันทึกรายการออร์เดอร์สำเร็จ", "success");
            await doShowOrderList(shopId, workAreaBox, selectDate);
          } else {
            $.notify("ระบบไม่สามารถบันทึกออร์เดอร์ได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "error");
          }
        } else {
          params = {data: {Items: orderObj.gooditems, Status: 1}, shopId: shopId, customerId: orderObj.customer.id, userId: userId, userinfoId: userinfoId};
          orderRes = await common.doCallApi('/api/shop/order/add', params);
          if (orderRes.status.code == 200) {
            $.notify("เพิ่มรายการออร์เดอร์สำเร็จ", "success");
            await doShowOrderList(shopId, workAreaBox, selectDate);
          } else {
            $.notify("ระบบไม่สามารถบันทึกออร์เดอร์ได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "error");
          }
        }
      } else {
        $.notify("โปรดระบุข้อมูลลูกค้าก่อนบันทึกออร์เดอร์", "error");
      }
    });
    $(saveNewOrderCmdBox).append($(saveNewOrderCmd)).append($(cancelCmd));

		//if (orderObj.Status != 1) {
		if ([3, 4].includes(orderObj.Status)) {
			$(editCustomerCmd).hide();
			$(saveNewOrderCmd).hide();
		}

    const customerSelectedCallback = function(customerSelected){
      orderObj.customer = customerSelected;
      customerDataBox = doRenderCustomerContent(customerSelected);
      $(customerContent).empty().append($(customerDataBox));
			$(editCustomerCmd).val('แก้ไขลูกค้า');
			$(pageHandle.toggleMenuCmd).click();
    }

    const gooditemSelectedCallback = async function(gooditemSelected){
      orderObj.gooditems.push(gooditemSelected);
      goodItemTable = await doRenderGoodItemTable(orderObj);
			let addItemCmdBox = $(goodItemTable).find('#AddItemCmdBox');
			if (addNewGoodItemCmd) {
				$(addItemCmdBox).append($(addNewGoodItemCmd));
			}
			let closeOrderCmdBox = $(goodItemTable).find('#CloseOrderCmdBox');
			$(closeOrderCmdBox).append($(callCreateCloseOrderCmd));
      $(itemlistWorkingBox).empty().append($(goodItemTable));
			$(pageHandle.toggleMenuCmd).click();
    }

		const invoiceCallback = async function(newInvoiceData){
			let invoiceParams = {data: newInvoiceData, shopId: shopId, orderId: orderObj.id, userId: userId, userinfoId: userinfoId};
			let invoiceRes = await common.doCallApi('/api/shop/invoice/add', invoiceParams);

			if (invoiceRes.status.code == 200) {
				let invoiceId = invoiceRes.Record.id;
				let docParams = {orderId: orderObj.id, shopId: shopId/*, filename: newInvoiceData.Filename, No: newInvoiceData.No*/};
				let docRes = await common.doCallApi('/api/shop/invoice/create/report', docParams);
				console.log(docRes);
				if (docRes.status.code == 200) {
					//window.open(docRes.result.link, '_blank');
					closeorderdlg.doOpenReportPdfDlg(docRes.result.link, 'ใบแจ้งหนี้');
					$.notify("ออกใบแจ้งหนี้่สำเร็จ", "sucess");
				} else if (docRes.status.code == 300) {
					$.notify("ระบบไม่พบรูปแบบเอกสารใบแจ้งหนี้", "error");
				}
			} else {
				$.notify("บันทึกใบแจ้งหนี้ไม่สำเร็จ", "error");
			}

			if (dlgHandle) {
        dlgHandle.closeAlert();
      }
		}

		const billCallback = async function(newBillData, paymentData){
			let billParams = {data: newBillData, shopId: shopId, orderId: orderObj.id, userId: userId, userinfoId: userinfoId};
			let billRes = await common.doCallApi('/api/shop/bill/add', billParams);

			if (billRes.status.code == 200) {
				let billId = billRes.Record.id;
				let paymentParams = {data: paymentData, shopId: shopId, orderId: orderObj.id, userId: userId, userinfoId: userinfoId};
				let paymentRes = await common.doCallApi('/api/shop/payment/add', paymentParams);
				if (paymentRes.status.code == 200) {
					let docParams = {orderId: orderObj.id, shopId: shopId/*, filename: newBillData.Filename, No: newBillData.No*/};
					let docRes = await common.doCallApi('/api/shop/bill/create/report', docParams);
					console.log(docRes);
					if (docRes.status.code == 200) {
						//window.open(docRes.result.link, '_blank');
						closeorderdlg.doOpenReportPdfDlg(docRes.result.link, 'บิลเงินสด/ใบเสร็จรับเงิน', ()=>{
							$(cancelCmd).click();
						});
						$.notify("ออกบิลเงินสด/ใบเสร็จรับเงินสำเร็จ", "sucess");
					} else if (docRes.status.code == 300) {
						$.notify("ระบบไม่พบรูปแบบเอกสารบิลเงินสด/ใบเสร็จรับเงิน", "error");
					}
				} else {
					$.notify("บันทึกข้อมูลการชำระเงินไม่สำเร็จ", "error");
				}
			} else {
				$.notify("บันทึกบิลไม่สำเร็จ", "error");
			}

			if (dlgHandle) {
        dlgHandle.closeAlert();
      }
		}

		const taxinvoiceCallback = async function(newTaxInvoiceData, paymentData){
			let taxinvoiceParams = {data: newTaxInvoiceData, shopId: shopId, orderId: orderObj.id, userId: userId, userinfoId: userinfoId};
			let taxinvoiceRes = await common.doCallApi('/api/shop/taxinvoice/add', taxinvoiceParams);

			if (taxinvoiceRes.status.code == 200) {
				let taxinvoiceId = taxinvoiceRes.Record.id;
				let paymentParams = {data: paymentData, shopId: shopId, orderId: orderObj.id, userId: userId, userinfoId: userinfoId};
				let paymentRes = await common.doCallApi('/api/shop/payment/add', paymentParams);
				if (paymentRes.status.code == 200) {
					let docParams = {orderId: orderObj.id, shopId: shopId/*, filename: newInvoiceData.Filename, No: newInvoiceData.No*/};
					let docRes = await common.doCallApi('/api/shop/taxinvoice/create/report', docParams);
					console.log(docRes);
					if (docRes.status.code == 200) {
						//window.open(docRes.result.link, '_blank');
						closeorderdlg.doOpenReportPdfDlg(docRes.result.link, 'ใบกำกับภาษี', ()=>{
							$(cancelCmd).click();
						});
						$.notify("ออกใบกำกับภาษีสำเร็จ", "sucess");
					} else if (docRes.status.code == 300) {
						$.notify("ระบบไม่พบรูปแบบเอกสารใบกำกับภาษี", "error");
					}
				} else {
					$.notify("บันทึกข้อมูลการชำระเงินไม่สำเร็จ", "error");
				}
			} else {
				$.notify("บันทึกใบกำกับภาษีไม่สำเร็จ", "error");
			}

			if (dlgHandle) {
        dlgHandle.closeAlert();
      }
		}
  }

	const doRenderCustomerContent = function(customerData){
    let customerDataTable = $('<table width="100%" cellspacing="0" cellpadding="0" border="0"></table>');
    let dataRow = $('<tr></tr>');
    let avatarCell = $('<td width="30%" rowspan="3" align="center" valign="middle"></td>');
    let nameCell = $('<td width="*" align="left"><b>ชื่อลูกค้า</b> ' + customerData.Name + '</td>');
    let addressCell = $('<td><b>ที่อยู่</b> ' + customerData.Address + '</td>');
    let telCell = $('<td><b>โทรศัพท์</b> ' + customerData.Tel + '</td>');
    let avatarIcon = $('<img src="../../images/avatar-icon.png"/>').css({'width': '95px', 'height': 'auto'});
    $(avatarCell).append($(avatarIcon));
    $(dataRow).append($(avatarCell)).append($(nameCell));
    $(customerDataTable).append($(dataRow));
    dataRow = $('<tr></tr>');
    $(dataRow).append($(addressCell));
    $(customerDataTable).append($(dataRow));
    dataRow = $('<tr></tr>');
    $(dataRow).append($(telCell));
    $(customerDataTable).append($(dataRow));
    return $(customerDataTable);
  }

	const doRenderGoodItemTable = function(orderData){
    return new Promise(async function(resolve, reject) {
			let mainBox = $('<div id="MainGoodItemBox"></div>').css({'position': 'relative', 'width': '98%'});
			let addItemCmdBox = $('<div id="AddItemCmdBox"></div>').css({'position': 'relative', 'width': '100%', 'text-align': 'right', 'padding': '4px', 'border-bottom': '1px solid black'});
			let itemListBox = $('<div id="ItemListBox"></div>').css({'position': 'relative', 'width': '100%', 'text-align': 'left', 'padding': '4px', 'border-bottom': '1px solid black'});
			let summaryBox = $('<div id="SummaryBox"></div>').css({'position': 'relative', 'width': '100%', 'text-align': 'right', 'padding': '4px', 'border-bottom': 'double'});
			let closeOrderCmdBox = $('<div id="CloseOrderCmdBox"></div>').css({'position': 'relative', 'width': '100%', 'text-align': 'right', 'padding': '4px', 'border-bottom': 'double'});
			$(mainBox).append($(addItemCmdBox)).append($(itemListBox)).append($(summaryBox)).append($(closeOrderCmdBox));
			if ((orderData) && (orderData.gooditems) && (orderData.gooditems.length > 0)) {
				let	promiseList = new Promise(async function(resolve2, reject2){
          let total = 0;
					let totalBox = $('<span></span>').text(common.doFormatNumber(total)).css({'margin-right': '4px', 'font-size': '24px', 'font-weight': 'bold'});
          let goodItems = orderData.gooditems;
					let itenNoCells = [];
          for (let i=0; i < goodItems.length; i++) {
						let subTotal = Number(goodItems[i].Price) * Number(goodItems[i].Qty);
						let goodItemBox = $('<div></div>').css({'width': '125px', 'position': 'relative', 'min-height': '150px', 'border': '2px solid black', 'border-radius': '5px', 'float': 'left', 'cursor': 'pointer', 'padding': '5px', 'margin-left': '8px', 'margin-top': '10px'});;
						let goodItemImg = $('<img/>').attr('src', goodItems[i].MenuPicture).css({'width': '120px', 'height': 'auto'});
						let goodItemNameBox = $('<div></div>').text(goodItems[i].MenuName).css({'position': 'relative', 'width': '100%', 'padding': '2px', 'font-size': '16px'});
						let goodItemQtyUnitBox = $('<div></div>').css({'position': 'relative', 'width': '100%', 'padding': '2px'});
						let goodItemQtyBox = $('<span></span>').text(common.doFormatQtyNumber(goodItems[i].Qty)).css({'padding': '2px', 'font-size': '20px'});
						let goodItemUnitBox = $('<span></span>').text(goodItems[i].Unit).css({'padding': '2px', 'font-size': '16px'});
						let goodItemSubTotalBox = $('<div></div>').css({'position': 'relative', 'width': '100%', 'padding': '2px'});
						let goodItemSubTotalText = $('<span></span>').text(common.doFormatNumber(subTotal)).css({'position': 'relative', 'width': '100%', 'padding': '2px', 'font-size': '20px', 'font-weight': 'bold'});
						let increaseBtnCmd = common.doCreateImageCmd('../../images/plus-sign-icon.png', 'เพิ่มจำนวน');
						let decreaseBtnCmd = common.doCreateImageCmd('../../images/minus-sign-icon.png', 'ลดจำนวน');
						let deleteGoodItemCmd = common.doCreateImageCmd('../../images/cross-red-icon.png', 'ลบรายการ');
						$(increaseBtnCmd).css({'width': '22px', 'height': 'auto', 'margin-left': '8px'});
						$(increaseBtnCmd).on('click', async(evt)=>{
							let oldQty = Number($(goodItemQtyBox).text());
							let newQty = oldQty + 1;
							$(goodItemQtyBox).text(common.doFormatQtyNumber(newQty));
							goodItems[i].Qty = newQty;
							subTotal = Number(goodItems[i].Price) * newQty;
							$(goodItemSubTotalText).text(common.doFormatNumber(subTotal));
							let newTotal = await doCalOrderTotal(orderData.gooditems);
							$(totalBox).text(common.doFormatNumber(newTotal));
						});
						$(decreaseBtnCmd).on('click', async(evt)=>{
							let oldQty = Number($(goodItemQtyBox).text());
							let newQty = oldQty -1;
							if (newQty > 0) {
								$(goodItemQtyBox).text(common.doFormatQtyNumber(newQty));
								goodItems[i].Qty = newQty;
								subTotal = Number(goodItems[i].Price) * newQty;
								$(goodItemSubTotalText).text(common.doFormatNumber(subTotal));
								let newTotal = await doCalOrderTotal(orderData.gooditems);
								$(totalBox).text(common.doFormatNumber(newTotal));
							}
						});
						$(deleteGoodItemCmd).on('click', async (evt)=>{
							$(goodItemBox).remove();
							let newGoodItems = await doDeleteGoodItem(i, orderData);
							orderData.gooditems = newGoodItems;
							let newTotal = await doCalOrderTotal(orderData.gooditems);
							$(totalBox).text(common.doFormatNumber(newTotal));
						});

						$(decreaseBtnCmd).css({'width': '22px', 'height': 'auto', 'margin-left': '4px'});
						$(deleteGoodItemCmd).css({'width': '32px', 'height': 'auto', 'margin-left': '8px'});
						$(goodItemQtyUnitBox).append($(goodItemQtyBox)).append($(goodItemUnitBox)).append($(decreaseBtnCmd)).append($(increaseBtnCmd));
						$($(goodItemSubTotalBox)).append($(goodItemSubTotalText)).append($(deleteGoodItemCmd));
						$(goodItemBox).append($(goodItemImg)).append($(goodItemNameBox)).append($(goodItemQtyUnitBox)).append($(goodItemSubTotalBox));
						$(itemListBox).append($(goodItemBox));
					}
					total = await doCalOrderTotal(orderData.gooditems);
					$(totalBox).text(common.doFormatNumber(total))
					$(summaryBox).empty().append($(totalBox));
					$(itemListBox).css({'display': 'block', 'overflow': 'auto'});
					setTimeout(()=>{
            resolve2($(mainBox));
          }, 500);
				});
        Promise.all([promiseList]).then((ob)=>{
          resolve(ob[0]);
        });
			} else {
				$(itemListBox).css({'height': '290px'});
				$(summaryBox).empty().append($('<span><b>0.00</b></span>').css({'margin-right': '4px'}));
				resolve($(mainBox));
			}
		});
  }

	const doCalOrderTotal = function(gooditems){
    return new Promise(async function(resolve, reject) {
      let total = 0;
      await gooditems.forEach((item, i) => {
        total += Number(item.Price) * Number(item.Qty);
      });
      resolve(total);
    });
  }

	const doDeleteGoodItem = function(goodItemIndex, orderData) {
    return new Promise(async function(resolve, reject) {
      let anotherItems = await orderData.gooditems.filter((item, i)=>{
        if (i != goodItemIndex) {
          return item;
        }
      });
      resolve(anotherItems);
    });
  }

  return {
    setupPageHandle,
    doOpenOrderForm
	}
}
