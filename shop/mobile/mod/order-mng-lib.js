module.exports = function ( jq ) {
	const $ = jq;

  const common = require('../../home/mod/common-lib.js')($);

  const orderForm = require('./order-form-lib.js')($);
	const styleCommon = require('./style-common-lib.js')($);
	const closeorderdlg = require('../../setting/admin/mod/closeorder-dlg.js')($);
	const mergeorderdlg = require('../../setting/admin/mod/order-merge-dlg.js')($);

  let pageHandle = undefined;

  const setupPageHandle = function(value){
    pageHandle = value;
    orderForm.setupPageHandle(value);
  }

  const doShowOrderList = function(shopId, workAreaBox, orderDate){
    return new Promise(async function(resolve, reject) {
			let userdata = JSON.parse(localStorage.getItem('userdata'));
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
      let titlePageBox = $('<div></viv>').css(styleCommon.titlePageBoxStyle);
			//let titleTextBox = $('<div></div>').text('รายการออร์เดอร์ของร้าน');
			let titleTextBox = $('<div class="sensitive-word" id="titleTextBox"></div>').text('รายการออร์เดอร์ของร้าน');
			let orderDateBox = $('<div></div>').text(selectDate).css(styleCommon.orderDateBoxStyle);
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
				$(pageHandle.userInfoBox).hide();
      });
      $(titlePageBox).append($(titleTextBox)).append($(orderDateBox));
			$(workAreaBox).append($(titlePageBox));

      let newOrderCmdBox = $('<div style="padding: 4px;"></div>').css({'width': '99.5%', 'text-align': 'right'});
			let newOrderCmd = common.doCreateTextCmd('เปิดออร์เดอร์ใหม', 'green', 'white');
			$(newOrderCmd).addClass('sensitive-word');
			$(newOrderCmd).attr('id', 'newOrderCmd');
			$(newOrderCmd).on('click', (evt)=>{
				orderForm.doOpenOrderForm(shopId, workAreaBox, undefined, undefined, doShowOrderList);
			});
			if (common.shopSensitives.includes(shopId)) {
				let sensitiveWordJSON = JSON.parse(localStorage.getItem('sensitiveWordJSON'));
				$(newOrderCmd).text(sensitiveWordJSON.find((item)=>{if(item.elementId === 'newOrderCmd') return item}).customWord) ;
			}
			let canceledOrderHiddenToggleCmd = common.doCreateTextCmd('ซ่อนรายการที่ถูกยกเลิก', 'grey', 'white');
			$(canceledOrderHiddenToggleCmd).on('click', (evt)=>{
				let displayStatus = $('.canceled-order').css('display');
				if (displayStatus === 'none') {
					$('.canceled-order').css('display', 'block');
					$(canceledOrderHiddenToggleCmd).text('ซ่อนรายการที่ถูกยกเลิก');
				} else {
					$('.canceled-order').css('display', 'none');
					$(canceledOrderHiddenToggleCmd).text('แสดงรายการที่ถูกยกเลิก');
				}
			});

			$(newOrderCmdBox).append($(canceledOrderHiddenToggleCmd)).append($(newOrderCmd).css({'margin-left': '4px'}));
			if ([1, 2, 3].includes(userdata.usertypeId)) {
				let openSummaryOrderToggleCmd = common.doCreateTextCmd('ดูสรุป', 'orange', 'white');
				$(openSummaryOrderToggleCmd).on('click', async(evt)=>{
					let summaryData = $('#OrderListBox').data('summaryData');
					if (summaryData.yellowOrders) {
						let summaryBox = await doCreateSummaryBox(summaryData, 'สรุป');
						$(pageHandle.mainContent).slideUp('slow');
						$(pageHandle.mainBox).append($(summaryBox));
						$(summaryBox).slideDown('slow');
					}
				});
				$(newOrderCmdBox).prepend($(openSummaryOrderToggleCmd).css({'margin-right': '4px'}));
			}

			$(workAreaBox).append($(newOrderCmdBox));

      $('#OrderListBox').remove();
			let orderListBox = await doCreateOrderList(shopId, workAreaBox, selectDate);
			$(workAreaBox).append($(orderListBox));

			if ($(orderListBox).find('.canceled-order')){
				$(canceledOrderHiddenToggleCmd).show();
			} else {
				$(canceledOrderHiddenToggleCmd).hide();
			}

			$(pageHandle.menuContent).empty();
			$(pageHandle.userInfoBox).show();

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

			let yellowOrders = [];
			let orangeOrders = [];
			let greenOrders = [];
			let greyOrders = [];

      let orderListBox = $('<div id="OrderListBox"></div>').css({'position': 'relative', 'width': '100%', 'margin-top': '25px'});
      if ((orders) && (orders.length > 0)) {
        let	promiseList = new Promise(async function(resolve2, reject2){
          for (let i=0; i < orders.length; i++) {
            let total = await doCalOrderTotal(orders[i].Items);
            let orderDate = new Date(orders[i].createdAt);
            let fmtDate = common.doFormatDateStr(orderDate);
            let fmtTime = common.doFormatTimeStr(orderDate);
            let ownerOrderFullName = orders[i].userinfo.User_NameTH + ' ' + orders[i].userinfo.User_LastNameTH;
            let orderBox = $('<div class="order-box"></div>').css({'width': '125px', 'position': 'relative', 'min-height': '150px', 'border': '2px solid black', 'border-radius': '5px', 'display': 'inline-block', /*'float': 'left', 'clear': 'left',*/ 'cursor': 'pointer', 'padding': '5px', 'margin-left': '8px', 'margin-top': '10px'});
            $(orderBox).append($('<div><b>ลูกค้า :</b> ' + orders[i].customer.Name + '</div>').css({'width': '100%'}));
            $(orderBox).append($('<div><b><span id ="opennerOrderLabel" class="sensitive-word">ผู้รับออร์เดอร์</span> :</b> ' + ownerOrderFullName + '</div>').css({'width': '100%'}));
            $(orderBox).append($('<div><b>ยอดรวม :</b> ' + common.doFormatNumber(total) + '</div>').css({'width': '100%'}));
            $(orderBox).append($('<div><b>วันที่-เวลา :</b> ' + fmtDate + ':' + fmtTime + '</div>').css({'width': '100%'}));
						$(orderBox).data('orderData', {id: orders[i].id});
						$(orderBox).append($('<span id="NotifyIndicator">0</span>').css({'display': 'none', 'position': 'absolute', 'top': '1px', 'right': '1px', 'color': 'white', 'background-color': 'red', 'height': '25px', 'width': '25px', 'line-height': '25px', 'border-radius': '50%', 'text-align': 'center'}));
						let mergeOrderCmdBox = undefined;
						let cancelOrderCmdBox = undefined;
						if (orders[i].Status == 1) {
							$(orderBox).css({'background-color': 'yellow'});
							mergeOrderCmdBox = $('<div></div>').css({'width': '100%', 'background-color': 'white', 'color': 'black', 'text-align': 'center', 'cursor': 'pointer', 'z-index': '210', 'line-height': '30px', 'border': '1px solid black'});
							$(mergeOrderCmdBox).append($('<span id ="mergeOrderCmd" class="sensitive-word">ยุบรวมออร์เดอร์</span>').css({'font-weight': 'bold'}));
							$(mergeOrderCmdBox).on('click', async (evt)=>{
								evt.stopPropagation();
								mergeorderdlg.doMergeOrder(orders, i, async (newOrders, destIndex)=>{
									let params = {data: {Status: 0, userId: orders[i].userId, userinfoId: orders[i].userinfoId}, id: orders[i].id};
									let orderRes = await common.doCallApi('/api/shop/order/update', params);
									if (orderRes.status.code == 200) {
										$.notify("ยกเลิกรายการออร์เดอร์สำเร็จ", "success");
										params = {data: {Items: orders[destIndex].Items, userId: orders[i].userId, userinfoId: orders[i].userinfoId}, id: orders[destIndex].id};
					          orderRes = await common.doCallApi('/api/shop/order/update', params);
					          if (orderRes.status.code == 200) {
					            $.notify("ยุบรวมรายการออร์เดอร์สำเร็จ", "success");
											common.delay(500).then(async()=>{
												$('#OrderListBox').remove();
												let newOrderListBox = await doCreateOrderList(shopId, workAreaBox, orderReqParams.orderDate);
												$(workAreaBox).append($(newOrderListBox));
											});
					          } else {
					            $.notify("ระบบไม่สามารถบันทึกออร์เดอร์ได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "error");
					          }
									} else {
										$.notify("ระบบไม่สามารถยกเลิกออร์เดอร์ได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "error");
									}
								});
							});
							$(orderBox).append($(mergeOrderCmdBox));
							cancelOrderCmdBox = $('<div></div>').css({'width': '100%', 'background-color': 'white', 'color': 'black', 'text-align': 'center', 'cursor': 'pointer', 'z-index': '210', 'line-height': '30px', 'border': '1px solid black'});
							$(cancelOrderCmdBox).append($('<span id ="cancelOrderCmd" class="sensitive-word">ยกเลิกออร์เดอร์</span>').css({'font-weight': 'bold'}));
							$(cancelOrderCmdBox).on('click', async (evt)=>{
								evt.stopPropagation();
								let params = {data: {Status: 0, userId: orders[i].userId, userinfoId: orders[i].userinfoId}, id: orders[i].id};
								let orderRes = await common.doCallApi('/api/shop/order/update', params);
								if (orderRes.status.code == 200) {
									$.notify("ยกเลิกรายการออร์เดอร์สำเร็จ", "success");
									common.delay(500).then(async()=>{
										$('#OrderListBox').remove();
										let newOrderListBox = await doCreateOrderList(shopId, workAreaBox, orderReqParams.orderDate);
										$(workAreaBox).append($(newOrderListBox));
									});
								} else {
									$.notify("ระบบไม่สามารถยกเลิกออร์เดอร์ได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "error");
								}
							});
							$(orderBox).append($(cancelOrderCmdBox));
							yellowOrders.push(orders[i]);
						} else if (orders[i].Status == 2) {
							$(orderBox).css({'background-color': 'orange'});
							let textCmdCallback = async function(evt){
								let docParams = {orderId: orders[i].id, shopId: shopId};
								let docRes = await common.doCallApi('/api/shop/invoice/create/report', docParams);
								//console.log(docRes);
								if (docRes.status.code == 200) {
									let report = docRes.result;
									let reportBox = orderForm.doCreateReportBox(report, 'ใบแจ้งหนี้');
									$(pageHandle.mainContent).slideUp('slow');
									$(pageHandle.mainBox).append($(reportBox));
									$(reportBox).slideDown('slow');
									$.notify("ออกใบแจ้งหนี้่สำเร็จ", "sucess");
								} else if (docRes.status.code == 300) {
									$.notify("ระบบไม่พบรูปแบบเอกสารใบแจ้งหนี้", "error");
								}
							}
							let qrCmdCallback = function(evt){
								let shareCode = orders[i].invoice.Filename.split('.')[0];
								window.open('/shop/share/?id=' + shareCode, '_blank');
							}
							let invoiceBox = common.doCreateReportDocButtonCmd(orders[i].invoice.No, textCmdCallback, qrCmdCallback);
							$(orderBox).append($(invoiceBox));
							orangeOrders.push(orders[i]);
						} else if ((orders[i].Status == 3) || (orders[i].Status == 4)) {
							$(orderBox).css({'background-color': 'green'});
							if (orders[i].bill){
								let textCmdCallback = function(evt){
									let report = orders[i].bill.Report;
									console.log(report);
									let reportBox = orderForm.doCreateReportBox(report, 'บิลเงินสด/ใบเสร็จรับเงิน');
									$(pageHandle.mainContent).slideUp('slow');
									$(pageHandle.mainBox).append($(reportBox));
									$(reportBox).slideDown('slow');
								}
								let qrCmdCallback = function(evt){
									let shareCode = orders[i].bill.Filename.split('.')[0];
									window.open('/shop/share/?id=' + shareCode, '_blank');
								}
								let billBox = common.doCreateReportDocButtonCmd(orders[i].bill.No, textCmdCallback, qrCmdCallback);
								$(orderBox).append($(billBox));
							}
							if (orders[i].taxinvoice){
								let textCmdCallback = function(evt){
									let report = orders[i].taxinvoice.Report;
									console.log(report);
									let reportBox = orderForm.doCreateReportBox(report, 'ใบกำกับภาษี');
									$(pageHandle.mainContent).slideUp('slow');
									$(pageHandle.mainBox).append($(reportBox));
									$(reportBox).slideDown('slow');
								}
								let qrCmdCallback = function(evt){
									let shareCode = orders[i].taxinvoice.Filename.split('.')[0];
									window.open('/shop/share/?id=' + shareCode, '_blank');
								}
								let taxinvoiceBox = common.doCreateReportDocButtonCmd(orders[i].taxinvoice.No, textCmdCallback, qrCmdCallback);
								$(orderBox).append($(taxinvoiceBox));
							}
							greenOrders.push(orders[i]);
						} else if (orders[i].Status == 0) {
							$(orderBox).css({'background-color': 'grey'});
							$(orderBox).addClass('canceled-order');
							greyOrders.push(orders[i]);
						}
            $(orderBox).on('click', (evt)=>{
							evt.stopPropagation();
              let orderData = {customer: orders[i].customer, gooditems: orders[i].Items, id: orders[i].id, Status: orders[i].Status};
							if (orders[i].invoice) {
								orderData.invoice = orders[i].invoice;
							}
							if (orders[i].bill) {
								orderData.bill = orders[i].bill;
							}
							if (orders[i].taxinvoice) {
								orderData.taxinvoice = orders[i].taxinvoice;
							}
              $(orderListBox).remove();
              orderForm.doOpenOrderForm(shopId, workAreaBox, orderData, orderDate, doShowOrderList);
            });

						if (common.shopSensitives.includes(shopId)) {
							let sensitiveWordJSON = JSON.parse(localStorage.getItem('sensitiveWordJSON'));
							$(orderBox).find("#opennerOrderLabel").text(sensitiveWordJSON.find((item)=>{if(item.elementId === 'opennerOrderLabel') return item}).customWord) ;
							if (mergeOrderCmdBox) {
								$(mergeOrderCmdBox).find("#mergeOrderCmd").text(sensitiveWordJSON.find((item)=>{if(item.elementId === 'mergeOrderCmd') return item}).customWord) ;
							}
							if (cancelOrderCmdBox) {
								$(cancelOrderCmdBox).find("#cancelOrderCmd").text(sensitiveWordJSON.find((item)=>{if(item.elementId === 'cancelOrderCmd') return item}).customWord) ;
							}
						}

						let summaryData = {yellowOrders, orangeOrders, greenOrders, greyOrders};
						$(orderListBox).data('summaryData', summaryData);
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
				let notFoundOrderDatbox = $('<div>ไม่พบรายการ<span id="notFoundOrderDatbox" class="sensitive-word">ออร์เดอร์</span>ของวันที่ ' + orderDate + '</div>');
				if (common.shopSensitives.includes(shopId)) {
					let sensitiveWordJSON = JSON.parse(localStorage.getItem('sensitiveWordJSON'));
					$(notFoundOrderDatbox).find("#notFoundOrderDatbox").text(sensitiveWordJSON.find((item)=>{if(item.elementId === 'notFoundOrderDatbox') return item}).customWord) ;
				}
				$(orderListBox).append($(notFoundOrderDatbox));
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

	const doCreateSummaryBox = function(summaryData, title, successCallback){
		return new Promise(async function(resolve, reject) {
			let summaryBoxStyle = {'position': 'relative', 'width': '100%', 'text-align': 'center', 'top': '70px'};
			let summaryBox = $('<div></div>').css(summaryBoxStyle);

			let summaryTable = await doCreateSummary(summaryData);
			$(summaryBox).append($(summaryTable));

			let toggleSummaryBoxCmd = common.doCreateTextCmd(' ปิด ', 'orange', 'white', 'green', 'black');
			$(toggleSummaryBoxCmd).on('click', (evt)=>{
				let hasHiddenSummaryBox = ($(mainBox).css('display') == 'none');
				if (hasHiddenSummaryBox) {
					$(mainBox).slideDown('slow');
					$(pageHandle.mainContent).slideUp('slow');
				} else {
					$(mainBox).slideUp('slow');
					$(pageHandle.mainContent).slideDown('slow');
					if (successCallback) {
						successCallback()
					}
				}
			}).css({'display': 'inline-block', 'width': '120px', 'float': 'right'});
			let docTitleBox = $('<span><b>' + title + '</b></span>').css({'display': 'inline-block', 'float': 'left', 'margin-left': '50px'});
			let toggleSummaryBox = $('<div></div>').css({'position': 'relative', 'width': '100%'});
			$(toggleSummaryBox).append($(docTitleBox)).append($(toggleSummaryBoxCmd).css({'text-align': 'center'}));
			let mainBox = $('<div></div>').css({'position': 'relative', 'width': '100%', 'top': '18px', 'diaplay': 'none'});
			$(mainBox).append($(toggleSummaryBox)).append($(summaryBox));
			resolve($(mainBox));
		});
	}

	const doCreateSummary = function(summaryData){
		return new Promise(async function(resolve, reject) {
			let summaryTable = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');
			let summaryRow = $('<div style="display: table-row; width: 100%;"></div>');
			$(summaryRow).append($('<span style="display: table-cell; text-align: center;"><b>ประเภท</b></span>'));
			$(summaryRow).append($('<span style="display: table-cell; text-align: center;"><b>จำนวน</b></span>'));
			$(summaryRow).append($('<span style="display: table-cell; text-align: center;"><b>มูลค่ารวม</b></span>'));
			$(summaryTable).append($(summaryRow));
			let cancelAmount = 0;
			for (let i=0; i < summaryData.greyOrders.length; i++){
				cancelAmount += await doCalOrderTotal(summaryData.greyOrders[i].Items);
			}
			let newAmount = 0;
			for (let i=0; i < summaryData.yellowOrders.length; i++){
				newAmount += await doCalOrderTotal(summaryData.yellowOrders[i].Items);
			}
			let invoiceAmount = 0;
			for (let i=0; i < summaryData.orangeOrders.length; i++){
				invoiceAmount += await doCalOrderTotal(summaryData.orangeOrders[i].Items);
			}
			let successAmount = 0;
			for (let i=0; i < summaryData.greenOrders.length; i++){
				successAmount += await doCalOrderTotal(summaryData.greenOrders[i].Items);
			}

			summaryRow = $('<div style="display: table-row; width: 100%; background-color: grey;"></div>');
			$(summaryRow).append($('<span style="display: table-cell; text-align: left;">ยกเลิก</span>'));
			$(summaryRow).append($('<span style="display: table-cell; text-align: center;"></span>').text(summaryData.greyOrders.length));
			$(summaryRow).append($('<span style="display: table-cell; text-align: right;"></span>').text(common.doFormatNumber(cancelAmount)));
			$(summaryTable).append($(summaryRow));

			summaryRow = $('<div style="display: table-row; width: 100%; background-color: yellow;"></div>');
			$(summaryRow).append($('<span style="display: table-cell; text-align: left;">ออร์เดอร์ใหม่</span>'));
			$(summaryRow).append($('<span style="display: table-cell; text-align: center;"></span>').text(summaryData.yellowOrders.length));
			$(summaryRow).append($('<span style="display: table-cell; text-align: right;"></span>').text(common.doFormatNumber(newAmount)));
			$(summaryTable).append($(summaryRow));

			summaryRow = $('<div style="display: table-row; width: 100%; background-color: orange;"></div>');
			$(summaryRow).append($('<span style="display: table-cell; text-align: left;">รอเก็บเงิน</span>'));
			$(summaryRow).append($('<span style="display: table-cell; text-align: center;"></span>').text(summaryData.orangeOrders.length));
			$(summaryRow).append($('<span style="display: table-cell; text-align: right;"></span>').text(common.doFormatNumber(invoiceAmount)));
			$(summaryTable).append($(summaryRow));

			summaryRow = $('<div style="display: table-row; width: 100%; background-color: green;"></div>');
			$(summaryRow).append($('<span style="display: table-cell; text-align: left;">เก็บเงินแล้ว</span>'));
			$(summaryRow).append($('<span style="display: table-cell; text-align: center;"></span>').text(summaryData.greenOrders.length));
			$(summaryRow).append($('<span style="display: table-cell; text-align: right;"></span>').text(common.doFormatNumber(successAmount)));
			$(summaryTable).append($(summaryRow));

			resolve($(summaryTable));
		});
	}

  return {
    setupPageHandle,
    doShowOrderList
	}
}
