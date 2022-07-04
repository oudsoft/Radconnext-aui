module.exports = function ( jq ) {
	const $ = jq;

	//const welcome = require('./welcome.js')($);
	//const login = require('./login.js')($);
  const common = require('../../../home/mod/common-lib.js')($);
  const customerdlg = require('./customer-dlg.js')($);
  const gooditemdlg = require('./gooditem-dlg.js')($);
	const closeorderdlg = require('./closeorder-dlg.js')($);
	const calendardlg = require('./calendar-dlg.js')($);

  const doShowOrderList = function(shopData, workAreaBox, orderDate){
    return new Promise(async function(resolve, reject) {
      let customerRes = await common.doCallApi('/api/shop/customer/list/by/shop/' + shopData.id, {});
      let menugroupRes = await common.doCallApi('/api/shop/menugroup/list/by/shop/' + shopData.id, {});
      let menuitemRes = await common.doCallApi('/api/shop/menuitem/list/by/shop/' + shopData.id, {});
      let customers = customerRes.Records;
      localStorage.setItem('customers', JSON.stringify(customers));
      let menugroups = menugroupRes.Records;
      localStorage.setItem('menugroups', JSON.stringify(menugroups));
      let menuitems = menuitemRes.Records;
      localStorage.setItem('menuitems', JSON.stringify(menuitems));

      $(workAreaBox).empty();

			let selectDate = undefined;
			if (orderDate) {
				selectDate = common.doFormatDateStr(new Date(orderDate));
			} else {
				selectDate = common.doFormatDateStr(new Date());
			}
      let titlePageBox = $('<div style="padding: 4px;"></viv>').css({'width': '99.1%', 'text-align': 'center', 'font-size': '22px', 'border': '2px solid black', 'border-radius': '5px', 'background-color': 'grey', 'color': 'white'});
			let titleTextBox = $('<div></div>').text('รายการออร์เดอร์ของร้าน');
			let orderDateBox = $('<div></div>').text(selectDate).css({'width': 'fit-content', 'display': 'inline-block', 'background-color': 'white', 'color': 'black', 'padding': '4px', 'cursor': 'pointer', 'font-size': '16px'});
			$(orderDateBox).on('click', (evt)=>{
				common.calendarOptions.onClick = async function(date){
					calendarHandle.closeAlert();
					selectDate = common.doFormatDateStr(new Date(date));
					$(orderDateBox).text(selectDate);
					$(workAreaBox).empty().append($(titlePageBox)).append($(newOrderCmdBox));
					await doCreateOrderList(shopData, workAreaBox, selectDate);
				}
				let calendarHandle = doShowCalendarDlg(common.calendarOptions);
			});
			$(titlePageBox).append($(titleTextBox)).append($(orderDateBox));

			$(workAreaBox).append($(titlePageBox));
			let newOrderCmdBox = $('<div style="padding: 4px;"></div>').css({'width': '99.5%', 'text-align': 'right'});
			//let newOrderCmd = $('<input type="button" value=" เปิดออร์เดอร์ใหม่ " class="action-btn"/>');
			let newOrderCmd = common.doCreateTextCmd('เปิดออร์เดอร์ใหม', 'green', 'white');
			$(newOrderCmd).on('click', (evt)=>{
				doOpenOrderForm(shopData, workAreaBox);
			});
			$(newOrderCmdBox).append($(newOrderCmd))
			$(workAreaBox).append($(newOrderCmdBox));

      await doCreateOrderList(shopData, workAreaBox, selectDate);
      /*
        order list of today
      */
      resolve();
    });
  }

	const doShowCalendarDlg = function(calendarOptions) {
		let calendarContent = calendardlg.doCreateCalendar(calendarOptions);
		const calendarDlgOption = {
			title: 'เลือกวันที่บนปฎิทิน',
			msg: $(calendarContent),
			width: '220px',
			onOk: function(evt) {
				calendarDlgHandle.closeAlert();
			},
			onCancel: function(evt){
				calendarDlgHandle.closeAlert();
			}
		}
		let calendarDlgHandle = $('body').radalert(calendarDlgOption);
		$(calendarDlgHandle.okCmd).hide();
		return calendarDlgHandle;
	}

  const doOpenOrderForm = async function(shopData, workAreaBox, orderData, selectDate){
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
    //let addNewGoodItemCmdBox = $('<div></div>').css({'width': '99.1%', 'text-align': 'right'});
    let saveNewOrderCmdBox = $('<div></div>').css({'width': '99.1%', 'text-align': 'center'});
    $(workAreaBox).append($(titlePageBox)).append($(customerWokingBox))/*.append($(addNewGoodItemCmdBox))*/.append($(itemlistWorkingBox)).append($(saveNewOrderCmdBox));

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

		//if ((!orderObj.Status) || ())
    $(customerControlCmd).append($(editCustomerCmd));
    let dlgHandle = undefined;
    $(editCustomerCmd).on('click', async (evt)=>{
      dlgHandle = await doOpenCustomerMngDlg(shopData, customerSelectedCallback);
    });

		let addNewGoodItemCmd = common.doCreateTextCmd('เพิ่มรายการ', 'green', 'white');
    $(addNewGoodItemCmd).on('click', async (evt)=>{
      dlgHandle = await doOpenGoodItemMngDlg(shopData, gooditemSelectedCallback);
    });

		let doShowCloseOrderDlg = async function() {
			let total = await doCalOrderTotal(orderObj.gooditems);
			if (total > 0) {
				dlgHandle = await doOpenCreateCloseOrderDlg(shopData, total, orderObj, invoiceCallback, billCallback, taxinvoiceCallback);
			} else {
				$.notify("ออร์เดอร์ยังไม่สมบูรณ์โปรดเพิ่มรายการสินค้าก่อน", "error");
			}
		}

		let callCreateCloseOrderCmd = common.doCreateTextCmd(' คิดเงิน ', '#F5500E', 'white', '#5D6D7E', '#FF5733');
		$(callCreateCloseOrderCmd).on('click', async (evt)=>{
			if (orderObj.customer) {
				if (!orderData) {
					let params = {data: {Items: orderObj.gooditems, Status: 1}, shopId: shopData.id, customerId: orderObj.customer.id, userId: userId, userinfoId: userinfoId};
          let orderRes = await common.doCallApi('/api/shop/order/add', params);
          if (orderRes.status.code == 200) {
            $.notify("เพิ่มรายการออร์เดอร์สำเร็จ", "success");
						orderObj.id = orderRes.Records[0].id;
						doShowCloseOrderDlg();
          } else {
            $.notify("ระบบไม่สามารถบันทึกออร์เดอร์ได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "error");
          }
				} else {
					doShowCloseOrderDlg();
				}
			} else {
        $.notify("โปรดระบุข้อมูลลูกค้าก่อนบันทึกออร์เดอร์", "error");
      }
    });

    if ((orderObj) && (orderObj.gooditems)){
      let goodItemTable = await doRenderGoodItemTable(orderObj, itemlistWorkingBox);
			let lastCell = $(goodItemTable).children(":first").children(":last");
			$(lastCell).append($(addNewGoodItemCmd));
			lastCell = $(goodItemTable).children(":last").children(":last");
			$(lastCell).append($(callCreateCloseOrderCmd));
      $(itemlistWorkingBox).append($(goodItemTable));
    }

    let cancelCmd = $('<input type="button" value=" กลับ "/>').css({'margin-left': '10px'});
    $(cancelCmd).on('click', async(evt)=>{
      await doShowOrderList(shopData, workAreaBox, selectDate);
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
            await doShowOrderList(shopData, workAreaBox, selectDate);
          } else {
            $.notify("ระบบไม่สามารถบันทึกออร์เดอร์ได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "error");
          }
        } else {
          params = {data: {Items: orderObj.gooditems, Status: 1}, shopId: shopData.id, customerId: orderObj.customer.id, userId: userId, userinfoId: userinfoId};
          orderRes = await common.doCallApi('/api/shop/order/add', params);
          if (orderRes.status.code == 200) {
            $.notify("เพิ่มรายการออร์เดอร์สำเร็จ", "success");
            await doShowOrderList(shopData, workAreaBox, selectDate);
          } else {
            $.notify("ระบบไม่สามารถบันทึกออร์เดอร์ได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "error");
          }
        }
      } else {
        $.notify("โปรดระบุข้อมูลลูกค้าก่อนบันทึกออร์เดอร์", "error");
      }
    });
    $(saveNewOrderCmdBox).append($(saveNewOrderCmd)).append($(cancelCmd));

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
			$(lastCell).append($(addNewGoodItemCmd));
			lastCell = $(goodItemTable).children(":last").children(":last");
			$(lastCell).append($(callCreateCloseOrderCmd));
      $(itemlistWorkingBox).empty().append($(goodItemTable));
      if (dlgHandle) {
        dlgHandle.closeAlert();
      }
    }

		const invoiceCallback = async function(newInvoiceData){
			let invoiceParams = {data: newInvoiceData, shopId: shopData.id, orderId: orderObj.id, userId: userId, userinfoId: userinfoId};
			let invoiceRes = await common.doCallApi('/api/shop/invoice/add', invoiceParams);

			if (invoiceRes.status.code == 200) {
				let invoiceId = invoiceRes.Record.id;
				let docParams = {orderId: orderObj.id, shopId: shopData.id/*, filename: newInvoiceData.Filename, No: newInvoiceData.No*/};
				let docRes = await common.doCallApi('/api/shop/invoice/create/report', docParams);
				console.log(docRes);
				window.open(docRes.result.link, '_blank');
				$.notify("ออกใบแจ้งหนี้่สำเร็จ", "sucess");
			} else {
				$.notify("บันทึกใบแจ้งหนี้ไม่สำเร็จ", "error");
			}

			if (dlgHandle) {
        dlgHandle.closeAlert();
      }
		}

		const billCallback = async function(newBillData, paymentData){
			let billParams = {data: newBillData, shopId: shopData.id, orderId: orderObj.id, userId: userId, userinfoId: userinfoId};
			let billRes = await common.doCallApi('/api/shop/bill/add', billParams);

			if (billRes.status.code == 200) {
				let billId = billRes.Record.id;
				let paymentParams = {data: paymentData, shopId: shopData.id, orderId: orderObj.id, userId: userId, userinfoId: userinfoId};
				let paymentRes = await common.doCallApi('/api/shop/payment/add', paymentParams);
				if (paymentRes.status.code == 200) {
					let docParams = {orderId: orderObj.id, shopId: shopData.id/*, filename: newBillData.Filename, No: newBillData.No*/};
					let docRes = await common.doCallApi('/api/shop/bill/create/report', docParams);
					console.log(docRes);
					window.open(docRes.result.link, '_blank');
					$.notify("ออกบิลเงินสด/ใบเสร็จรับเงินสำเร็จ", "sucess");
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
			let taxinvoiceParams = {data: newTaxInvoiceData, shopId: shopData.id, orderId: orderObj.id, userId: userId, userinfoId: userinfoId};
			let taxinvoiceRes = await common.doCallApi('/api/shop/taxinvoice/add', taxinvoiceParams);

			if (taxinvoiceRes.status.code == 200) {
				let taxinvoiceId = taxinvoiceRes.Record.id;
				let paymentParams = {data: paymentData, shopId: shopData.id, orderId: orderObj.id, userId: userId, userinfoId: userinfoId};
				let paymentRes = await common.doCallApi('/api/shop/payment/add', paymentParams);
				if (paymentRes.status.code == 200) {
					let docParams = {orderId: orderObj.id, shopId: shopData.id/*, filename: newInvoiceData.Filename, No: newInvoiceData.No*/};
					let docRes = await common.doCallApi('/api/shop/taxinvoice/create/report', docParams);
					console.log(docRes);
					window.open(docRes.result.link, '_blank');
					$.notify("ออกใบกำกับภาษีสำเร็จ", "sucess");
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

  const doOpenCustomerMngDlg = function(shopData, callback) {
    return new Promise(async function(resolve, reject) {
      const customerDlgContent = await customerdlg.doCreateFormDlg(shopData, callback);
      $(customerDlgContent).css({'margin-top': '10px'});
      const customerformoption = {
  			title: 'เลือกรายการลูกค้า',
  			msg: $(customerDlgContent),
  			width: '520px',
  			onOk: async function(evt) {
          customerFormBoxHandle.closeAlert();
  			},
  			onCancel: function(evt){
  				customerFormBoxHandle.closeAlert();
  			}
  		}
  		let customerFormBoxHandle = $('body').radalert(customerformoption);
      $(customerFormBoxHandle.okCmd).hide();
      resolve(customerFormBoxHandle)
    });
  }

  const doOpenGoodItemMngDlg = function(shopData, callback){
    return new Promise(async function(resolve, reject) {
      const gooditemDlgContent = await gooditemdlg.doCreateFormDlg(shopData, callback);
      $(gooditemDlgContent).css({'margin-top': '10px'});
      const gooditemformoption = {
  			title: 'เลือกรายการสินค้า',
  			msg: $(gooditemDlgContent),
  			width: '720px',
  			onOk: async function(evt) {
          gooditemFormBoxHandle.closeAlert();
  			},
  			onCancel: function(evt){
  				gooditemFormBoxHandle.closeAlert();
  			}
  		}
  		let gooditemFormBoxHandle = $('body').radalert(gooditemformoption);
      $(gooditemFormBoxHandle.okCmd).hide();
      resolve(gooditemFormBoxHandle)
    });
  }

	const doOpenCreateCloseOrderDlg = function(shopData, orderTotal, orderObj, invoiceCallback, billCallback, taxinvoiceCallback) {
		return new Promise(async function(resolve, reject) {
      const closeOrderDlgContent = await closeorderdlg.doCreateFormDlg(shopData, orderTotal, orderObj, invoiceCallback, billCallback, taxinvoiceCallback);
      $(closeOrderDlgContent).css({'margin-top': '10px'});
      const closeOrderformoption = {
  			title: 'ป้อนข้อมูลเพื่อเตรียมออกใบแจ้งหนี้ หรือ เก็บเงิน',
  			msg: $(closeOrderDlgContent),
  			width: '420px',
  			onOk: async function(evt) {
          closeOrderFormBoxHandle.closeAlert();
  			},
  			onCancel: function(evt){
  				closeOrderFormBoxHandle.closeAlert();
  			}
  		}
  		let closeOrderFormBoxHandle = $('body').radalert(closeOrderformoption);
      $(closeOrderFormBoxHandle.okCmd).hide();
      resolve(closeOrderFormBoxHandle)
    });
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

  const doRenderGoodItemTable = function(orderData, gooditemWorkingBox){
    return new Promise(async function(resolve, reject) {
      let goodItemForm = $('<table width="100%" cellspacing="0" cellpadding="0" border="1"></table>');
      let goodItemHeadFormRow = $('<tr></tr>').css({'background-color': 'grey', 'color': 'white', 'height': '42px'});
      let goodItemHeadNumberCell = $('<td width="5%" align="center"><b>#</b></td>');
      let goodItemHeadNameCell = $('<td width="30%" align="center"><b>รายการ</b></td>');
      let goodItemHeadQtyCell = $('<td width="7%" align="center"><b>จำนวน</b></td>');
      let goodItemHeadUnitCell = $('<td width="10%" align="center"><b>หน่วย</b></td>');
      let goodItemHeadPriceCell = $('<td width="15%" align="center"><b>ราคาต่อหน่วย</b></td>');
      let goodItemHeadSubTotalCell = $('<td width="15%" align="center"><b>รวม</b></td>');
      let goodItemHeadControlCmd = $('<td width="*" align="center" valign="middle"></td>');
      $(goodItemHeadFormRow).append($(goodItemHeadNumberCell)).append($(goodItemHeadNameCell)).append($(goodItemHeadQtyCell)).append($(goodItemHeadUnitCell))
      $(goodItemHeadFormRow).append($(goodItemHeadPriceCell)).append($(goodItemHeadSubTotalCell)).append($(goodItemHeadControlCmd));
      $(goodItemForm).append($(goodItemHeadFormRow));
      let totalLabelCell = $('<td colspan="5" align="center" valign="middle"><b>ยอดรวม</b></td>');
      let totalValueCell = $('<td align="right" valign="middle"></td>');
			let totalRow = $('<tr></tr>').css({'background-color': '#ddd', 'height': '42px'});
			$(totalRow).append($(totalLabelCell)).append($(totalValueCell)).append($('<td align="center"></td>'));

      if ((orderData) && (orderData.gooditems) && (orderData.gooditems.length > 0)) {
        let	promiseList = new Promise(async function(resolve2, reject2){
          let total = 0;
          let goodItems = orderData.gooditems;
          for (let i=0; i < goodItems.length; i++) {
            let goodItemRow = $('<tr></tr>');
            $(goodItemRow).append($('<td align="center">' + (i+1) + '</td>'));
            $(goodItemRow).append($('<td align="left">' + goodItems[i].MenuName + '</td>'));
            let goodItemQtyCell = $('<td align="center">' + goodItems[i].Qty + '</td>');
            $(goodItemRow).append($(goodItemQtyCell));
            $(goodItemRow).append($('<td align="center">' + goodItems[i].Unit + '</td>'));
            $(goodItemRow).append($('<td align="center">' + common.doFormatNumber(Number(goodItems[i].Price)) + '</td>'));
            let subTotal = Number(goodItems[i].Price) * Number(goodItems[i].Qty);
            let subTotalCell = $('<td align="right"></td>');
						$(subTotalCell).append($('<span>' +  common.doFormatNumber(subTotal) + '</span>').css({'margin-right': '4px'}))
            $(goodItemRow).append($(subTotalCell));
            let commandCell = $('<td align="center"></td>');
            $(goodItemRow).append($(commandCell));

            let increaseBtnCmd = common.doCreateImageCmd('../../images/plus-sign-icon.png', 'เพิ่มจำนวน');
            $(increaseBtnCmd).on('click', async(evt)=>{
              let oldQty = $(goodItemQtyCell).text();
              oldQty = Number(oldQty);
              let newQty = oldQty + 1;
              $(goodItemQtyCell).text(newQty);
              goodItems[i].Qty = newQty;
              subTotal = Number(goodItems[i].Price) * newQty;
              $(subTotalCell).empty().append($('<span><b>' + common.doFormatNumber(subTotal) + '</b></span>').css({'margin-right': '4px'}));
              let total = await doCalOrderTotal(orderData.gooditems);
              $(totalValueCell).empty().append($('<span><b>' + common.doFormatNumber(total) + '</b></span>').css({'margin-right': '4px'}));
            });
            let decreaseBtnCmd = common.doCreateImageCmd('../../images/minus-sign-icon.png', 'ลดจำนวน');
            $(decreaseBtnCmd).on('click', async(evt)=>{
              let oldQty = $(goodItemQtyCell).text();
              oldQty = Number(oldQty);
              let newQty = oldQty - 1;
              if (newQty > 0) {
                $(goodItemQtyCell).text(newQty);
                goodItems[i].Qty = newQty;
                subTotal = Number(goodItems[i].Price) * newQty;
                $(subTotalCell).empty().append($('<span><b>' + common.doFormatNumber(subTotal) + '</b></span>').css({'margin-right': '4px'}));
                let total = await doCalOrderTotal(orderData.gooditems);
                $(totalValueCell).empty().append($('<span><b>' + common.doFormatNumber(total) + '</b></span>').css({'margin-right': '4px'}));
              } else {
                $.notify("ไม่สามารถลดจำนวนสินค้าได้น้อยไปกว่านี้", "error");
              }
            });

            let deleteGoodItemCmd = common.doCreateImageCmd('../../images/cross-red-icon.png', 'ลบรายการ');
            $(deleteGoodItemCmd).on('click', async (evt)=>{
							$(goodItemRow).remove();
              let newGoodItems = await doDeleteGoodItem(i, orderData);
              orderData.gooditems = newGoodItems;
              let total = await doCalOrderTotal(orderData.gooditems);
              $(totalValueCell).empty().append($('<span><b>' + common.doFormatNumber(total) + '</b></span>').css({'margin-right': '4px'}));
            });
            $(commandCell).append($(increaseBtnCmd)).append($(decreaseBtnCmd)).append($(deleteGoodItemCmd));
            $(goodItemForm).append($(goodItemRow));
          }
          total = await doCalOrderTotal(orderData.gooditems);
          $(totalValueCell).empty().append($('<span><b>' + common.doFormatNumber(total) + '</b></span>').css({'margin-right': '4px'}));
          $(goodItemForm).append($(totalRow));
          setTimeout(()=>{
            resolve2($(goodItemForm));
          }, 500);
        });
        Promise.all([promiseList]).then((ob)=>{
          resolve(ob[0]);
        });
      } else {
				$(totalValueCell).empty().append($('<span><b>0.00</b></span>').css({'margin-right': '4px'}));
				$(goodItemForm).append($(totalRow));
        resolve($(goodItemForm));
      }
    });
  }

  const doDeleteGoodItem = function(goodItemIndex, orderData) {
    return new Promise(async function(resolve, reject) {
      let anotherItems = await orderData.gooditems.filter((item, i)=>{
				console.log(i);
        if (i != goodItemIndex) {
          return item;
        }
      });
      resolve(anotherItems);
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

  const doCreateOrderList = function(shopData, workAreaBox, orderDate){
    return new Promise(async function(resolve, reject) {
			let orderReqParams = {};
			if (orderDate) {
				orderReqParams = {orderDate: orderDate};
			}
      let orderRes = await common.doCallApi('/api/shop/order/list/by/shop/' + shopData.id, orderReqParams);
      let orders = orderRes.Records;
      console.log(orders);
      //localStorage.setItem('orders', JSON.stringify(orders));
      let orderListBox = $('<div></div>').css({'position': 'relative', 'width': '100%', 'margin-top': '25px'});
      if ((orders) && (orders.length > 0)) {
        let	promiseList = new Promise(async function(resolve2, reject2){
          for (let i=0; i < orders.length; i++) {
            //console.log(orders[i]);
            let total = await doCalOrderTotal(orders[i].Items);
            let orderDate = new Date(orders[i].createdAt);
            let fmtDate = common.doFormatDateStr(orderDate);
            let fmtTime = common.doFormatTimeStr(orderDate);
            let ownerOrderFullName = orders[i].userinfo.User_NameTH + ' ' + orders[i].userinfo.User_LastNameTH;
            let orderBox = $('<div></div>').css({'width': '125px', 'position': 'relative', 'min-height': '150px', 'border': '2px solid black', 'border-radius': '5px', 'float': 'left', 'cursor': 'pointer', 'padding': '5px', 'margin-left': '8px', 'margin-top': '10px'});
            $(orderBox).append($('<div><b>ลูกค้า :</b> ' + orders[i].customer.Name + '</div>').css({'width': '100%'}));
            $(orderBox).append($('<div><b>ผู้รับออร์เดอร์ :</b> ' + ownerOrderFullName + '</div>').css({'width': '100%'}));
            $(orderBox).append($('<div><b>ยอดรวม :</b> ' + common.doFormatNumber(total) + '</div>').css({'width': '100%'}));
            $(orderBox).append($('<div><b>วันที่-เวลา :</b> ' + fmtDate + ':' + fmtTime + '</div>').css({'width': '100%'}));
						if (orders[i].Status == 1) {
							$(orderBox).css({'background-color': 'yellow'});
						} else if (orders[i].Status == 2) {
							$(orderBox).css({'background-color': 'orange'});
							let invoiceBox = $('<div></div>').css({'width': '100%', 'background-color': 'white', 'color': 'black', 'text-align': 'center', 'cursor': 'pointer', 'z-index': '210'});
							$(invoiceBox).append($('<span>' + orders[i].invoice.No + '</span>').css({'font-weight': 'bold'}));
							$(invoiceBox).on('click', (evt)=>{
								evt.stopPropagation();
								window.open('/shop/img/usr/pdf/' + orders[i].invoice.Filename, '_blank');
							});
							$(orderBox).append($(invoiceBox));
						} else if ((orders[i].Status == 3) || (orders[i].Status == 4)) {
							$(orderBox).css({'background-color': 'green'});
							if (orders[i].bill){
								let billBox = $('<div></div>').css({'width': '100%', 'background-color': 'white', 'color': 'black', 'text-align': 'center', 'cursor': 'pointer', 'z-index': '210'});
								$(billBox).append($('<span>' + orders[i].bill.No + '</span>').css({'font-weight': 'bold'}));
								$(billBox).on('click', (evt)=>{
									evt.stopPropagation();
									window.open('/shop/img/usr/pdf/' + orders[i].bill.Filename, '_blank');
								});
								$(orderBox).append($(billBox));
							}
							if (orders[i].taxinvoice){
								let taxinvoiceBox = $('<div></div>').css({'width': '100%', 'background-color': 'white', 'color': 'black', 'text-align': 'center', 'cursor': 'pointer', 'z-index': '210'});
								$(taxinvoiceBox).append($('<span>' + orders[i].taxinvoice.No + '</span>').css({'font-weight': 'bold'}));
								$(taxinvoiceBox).on('click', (evt)=>{
									evt.stopPropagation();
									window.open('/shop/img/usr/pdf/' + orders[i].taxinvoice.Filename, '_blank');
								});
								$(orderBox).append($(taxinvoiceBox));
							}
						} else if (orders[i].Status == 0) {
							$(orderBox).css({'background-color': 'grey'});
						}
            $(orderBox).on('click', (evt)=>{
							evt.stopPropagation();
              let orderData = {customer: orders[i].customer, gooditems: orders[i].Items, id: orders[i].id, Status: orders[i].Status};
              $(orderListBox).remove();
              doOpenOrderForm(shopData, workAreaBox, orderData, orderDate);
            });
            $(orderListBox).append($(orderBox));
          }
          setTimeout(()=>{
            resolve2($(orderListBox));
          }, 500);
        });
        Promise.all([promiseList]).then((ob)=>{
          $(workAreaBox).append($(ob[0]));
          resolve(ob[0]);
        });
      } else {
				$(workAreaBox).append($('<div>ไม่พบรายการออร์เดอร์ของวันที่ ' + orderDate + '</div>'));
        resolve();
      }
    });
  }

  return {
    doShowOrderList
	}
}
