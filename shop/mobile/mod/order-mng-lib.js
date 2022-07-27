module.exports = function ( jq ) {
	const $ = jq;

  const common = require('../../home/mod/common-lib.js')($);

  const orderForm = require('./order-form-lib.js')($);

  let pageHandle = undefined;

  const setupPageHandle = function(value){
    pageHandle = value;
    orderForm.setupPageHandle(value);
  }

  const doShowOrderList = function(shopId, workAreaBox, orderDate){
    return new Promise(async function(resolve, reject) {
      let customerRes = await common.doCallApi('/api/shop/customer/list/by/shop/' + shopId, {});
      let menugroupRes = await common.doCallApi('/api/shop/menugroup/list/by/shop/' + shopId, {});
      let menuitemRes = await common.doCallApi('/api/shop/menuitem/list/by/shop/' + shopId, {});
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
      let titlePageBox = $('<div></viv>').css({'padding': '4px', 'text-align': 'center', 'font-size': '22px', 'border': '2px solid black', 'border-radius': '5px', 'background-color': 'grey', 'color': 'white'});
			let titleTextBox = $('<div></div>').text('รายการออร์เดอร์ของร้าน');
			let orderDateBox = $('<div></div>').text(selectDate).css({'width': 'fit-content', 'display': 'inline-block', 'background-color': 'white', 'color': 'black', 'padding': '4px', 'cursor': 'pointer', 'font-size': '16px'});
			$(orderDateBox).on('click', (evt)=>{
        common.calendarOptions.onClick = async function(date) {
          let selectDate = common.doFormatDateStr(new Date(date));
          $(orderDateBox).text(selectDate);
          $(pageHandle.toggleMenuCmd).click();
          $('#OrderListBox').remove();
          let orderListBox = await doCreateOrderList(shopId, workAreaBox, selectDate);
          $(workAreaBox).append($(orderListBox));
        }
        let calendar = doCreateCalendar(common.calendarOptions);
        $(pageHandle.menuContent).empty().append($(calendar).css({'position': 'relative', 'margin-top': '15px'}));
        $(pageHandle.toggleMenuCmd).click();
      });
      $(titlePageBox).append($(titleTextBox)).append($(orderDateBox));
			$(workAreaBox).append($(titlePageBox));

      let newOrderCmdBox = $('<div style="padding: 4px;"></div>').css({'width': '99.5%', 'text-align': 'right'});
			let newOrderCmd = common.doCreateTextCmd('เปิดออร์เดอร์ใหม', 'green', 'white');
			$(newOrderCmd).on('click', (evt)=>{
				orderForm.doOpenOrderForm(shopId, workAreaBox);
			});
			$(newOrderCmdBox).append($(newOrderCmd))
			$(workAreaBox).append($(newOrderCmdBox));

      $('#OrderListBox').remove();
			let orderListBox = await doCreateOrderList(shopId, workAreaBox, selectDate);
			$(workAreaBox).append($(orderListBox));

      resolve();
    });
  }

  const doCreateCalendar = function(calendarOptions){
    let calendareBox = $('<div id="CalendarBox"></div>');
    return $(calendareBox).ionCalendar(calendarOptions);
  }

  const doCreateOrderList = function(shopId, workAreaBox, orderDate) {
    return new Promise(async function(resolve, reject) {
      let orderReqParams = {};
      if (orderDate) {
        orderReqParams = {orderDate: orderDate};
      }
      let orderRes = await common.doCallApi('/api/shop/order/list/by/shop/' + shopId, orderReqParams);
      let orders = orderRes.Records;
      console.log(orders);
      let orderListBox = $('<div id="OrderListBox"></div>').css({'position': 'relative', 'width': '100%', 'margin-top': '25px'});
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
							let cancelOrderCmdBox = $('<div></div>').css({'width': '100%', 'background-color': 'white', 'color': 'black', 'text-align': 'center', 'cursor': 'pointer', 'z-index': '210', 'line-height': '30px'});
							$(cancelOrderCmdBox).append($('<span>ยกเลิกออร์เดอร์</span>').css({'font-weight': 'bold'}));
							$(cancelOrderCmdBox).on('click', async (evt)=>{
								evt.stopPropagation();
								let params = {data: {Status: 0, userId: orders[i].userId, userinfoId: orders[i].userinfoId}, id: orders[i].id};
								let orderRes = await common.doCallApi('/api/shop/order/update', params);
								if (orderRes.status.code == 200) {
									$.notify("ยกเลิกรายการออร์เดอร์สำเร็จ", "success");
									$('#OrderListBox').remove();
									doCreateOrderList(shopId, workAreaBox, orderDate);
								} else {
									$.notify("ระบบไม่สามารถยกเลิกออร์เดอร์ได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "error");
								}
							});
							$(orderBox).append($(cancelOrderCmdBox));
						} else if (orders[i].Status == 2) {
							$(orderBox).css({'background-color': 'orange'});
							let invoiceBox = $('<div></div>').css({'width': '100%', 'background-color': 'white', 'color': 'black', 'text-align': 'left', 'cursor': 'pointer', 'z-index': '210', 'line-height': '30px'});
							let openInvoicePdfCmd = $('<span>' + orders[i].invoice.No + '</span>').css({'font-weight': 'bold', 'margin-left': '5px'});
							$(openInvoicePdfCmd).on('click', (evt)=>{
								evt.stopPropagation();
								closeorderdlg.doOpenReportPdfDlg('/shop/img/usr/pdf/' + orders[i].invoice.Filename, 'ใบแจ้งหนี้');
							});
							let openInvoiceQrCmd = $('<img src="/shop/img/usr/myqr.png"/>').css({'position': 'absolute', 'margin-left': '8px', 'margin-top': '2px', 'width': '25px', 'height': 'auto'});
							$(openInvoiceQrCmd).on('click', (evt)=>{
								evt.stopPropagation();
								let shareCode = orders[i].invoice.Filename.split('.')[0];
								window.open('/shop/share/?id=' + shareCode, '_blank');
							});
							$(invoiceBox).append($(openInvoicePdfCmd)).append($(openInvoicePdfCmd));
							$(orderBox).append($(invoiceBox));
						} else if ((orders[i].Status == 3) || (orders[i].Status == 4)) {
							$(orderBox).css({'background-color': 'green'});
							if (orders[i].bill){
								let billBox = $('<div></div>').css({'width': '100%', 'background-color': 'white', 'color': 'black', 'text-align': 'left', 'cursor': 'pointer', 'z-index': '210', 'line-height': '30px'});
								let openBillPdfCmd = $('<span>' + orders[i].bill.No + '</span>').css({'font-weight': 'bold', 'margin-left': '5px'});
								$(openBillPdfCmd).on('click', (evt)=>{
									evt.stopPropagation();
									closeorderdlg.doOpenReportPdfDlg('/shop/img/usr/pdf/' + orders[i].bill.Filename, 'บิลเงินสด/ใบเสร็จรับเงิน');
								});
								let openBillQrCmd = $('<img src="/shop/img/usr/myqr.png"/>').css({'position': 'absolute', 'margin-left': '8px', 'margin-top': '2px', 'width': '25px', 'height': 'auto'});
								$(openBillQrCmd).on('click', (evt)=>{
									evt.stopPropagation();
									let shareCode = orders[i].bill.Filename.split('.')[0];
									window.open('/shop/share/?id=' + shareCode, '_blank');
								});
								$(billBox).append($(openBillPdfCmd)).append($(openBillQrCmd));
								$(orderBox).append($(billBox));
							}
							if (orders[i].taxinvoice){
								let taxinvoiceBox = $('<div></div>').css({'width': '100%', 'background-color': 'white', 'color': 'black', 'text-align': 'left', 'cursor': 'pointer', 'z-index': '210', 'line-height': '30px'});
								let openTaxInvoicePdfCmd = $('<span>' + orders[i].taxinvoice.No + '</span>').css({'font-weight': 'bold', 'margin-left': '5px'});
								$(openTaxInvoicePdfCmd).on('click', (evt)=>{
									evt.stopPropagation();
									closeorderdlg.doOpenReportPdfDlg('/shop/img/usr/pdf/' + orders[i].taxinvoice.Filename, 'ใบกำกับภาษี');
								});
								let openTaxInvoiceQrCmd = $('<img src="/shop/img/usr/myqr.png"/>').css({'position': 'absolute', 'margin-left': '8px', 'margin-top': '2px', 'width': '25px', 'height': 'auto'});
								$(openTaxInvoiceQrCmd).on('click', (evt)=>{
									evt.stopPropagation();
									let shareCode = orders[i].taxinvoice.Filename.split('.')[0];
									window.open('/shop/share/?id=' + shareCode, '_blank');
								});
								$(taxinvoiceBox).append($(openTaxInvoicePdfCmd)).append($($(openTaxInvoiceQrCmd)));
								$(orderBox).append($(taxinvoiceBox));
							}
						} else if (orders[i].Status == 0) {
							$(orderBox).css({'background-color': 'grey'});
						}
            $(orderBox).on('click', (evt)=>{
							evt.stopPropagation();
              let orderData = {customer: orders[i].customer, gooditems: orders[i].Items, id: orders[i].id, Status: orders[i].Status};
              $(orderListBox).remove();
              orderForm.doOpenOrderForm(shopId, workAreaBox, orderData, orderDate);
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
        $(orderListBox).text('ไม่พบรายการออร์เดอร์ของวันที่ ' + orderDate);
        resolve($(orderListBox));
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

  return {
    setupPageHandle,
    doShowOrderList
	}
}
