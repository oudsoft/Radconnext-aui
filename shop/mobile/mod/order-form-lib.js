module.exports = function ( jq ) {
	const $ = jq;

  const common = require('../../home/mod/common-lib.js')($);
	const customerdlg = require('../../setting/admin/mod/customer-dlg.js')($);
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
    let titlePageBox = $('<div style="padding: 4px;"></viv>').text(titleText).css({'width': '99.1%', 'text-align': 'center', 'font-size': '22px', 'border': '2px solid black', 'border-radius': '5px', 'background-color': 'grey', 'color': 'white'});
    let customerWokingBox = $('<div id="OrderCustomer" style="padding: 4px; width: 99.1%;"></viv>');
    let itemlistWorkingBox = $('<div id="OrderItemList" style="padding: 4px; width: 99.1%;"></viv>');
    let saveNewOrderCmdBox = $('<div></div>').css({'width': '99.1%', 'text-align': 'center'});
    $(workAreaBox).append($(titlePageBox)).append($(customerWokingBox)).append($(itemlistWorkingBox)).append($(saveNewOrderCmdBox));

    let customerForm = $('<table width="100%" cellspacing="0" cellpadding="0" border="0"></table>');
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
    	//dlgHandle = await doOpenCustomerMngDlg(shopId, customerSelectedCallback);
			let customerDlgContent = await customerdlg.doCreateFormDlg(shopData, callback)
			$(pageHandle.menuContent).empty().append($(customerDlgContent).css({'position': 'relative', 'margin-top': '15px'}));
			$(pageHandle.toggleMenuCmd).click();
    });
		$(customerControlCmd).append($(editCustomerCmd));

		let addNewGoodItemCmd = undefined;
		//if (orderObj.Status == 1) {
		if ([1, 2].includes(orderObj.Status)) {
			addNewGoodItemCmd = common.doCreateTextCmd('เพิ่มรายการ', 'green', 'white');
	    $(addNewGoodItemCmd).on('click', async (evt)=>{
	      dlgHandle = await doOpenGoodItemMngDlg(shopId, gooditemSelectedCallback);
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
      let goodItemTable = await doRenderGoodItemTable(orderObj, itemlistWorkingBox);
			let lastCell = $(goodItemTable).children(":first").children(":last");
			if (addNewGoodItemCmd) {
				$(lastCell).append($(addNewGoodItemCmd));
			}
			lastCell = $(goodItemTable).children(":last").children(":last");
			$(lastCell).append($(callCreateCloseOrderCmd));
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
      if (dlgHandle) {
        dlgHandle.closeAlert();
      }
    }

    const gooditemSelectedCallback = async function(gooditemSelected){
      orderObj.gooditems.push(gooditemSelected);
      goodItemTable = await doRenderGoodItemTable(orderObj, itemlistWorkingBox);
			let lastCell = $(goodItemTable).children(":first").children(":last");
			if (addNewGoodItemCmd) {
				$(lastCell).append($(addNewGoodItemCmd));
			}
			lastCell = $(goodItemTable).children(":last").children(":last");
			$(lastCell).append($(callCreateCloseOrderCmd));
      $(itemlistWorkingBox).empty().append($(goodItemTable));
      if (dlgHandle) {
        dlgHandle.closeAlert();
      }
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

  return {
    setupPageHandle,
    doOpenOrderForm
	}
}
