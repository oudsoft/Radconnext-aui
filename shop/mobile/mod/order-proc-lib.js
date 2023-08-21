/* order-proc-lib.js */
/* หน้าห้องครัว */
module.exports = function ( jq ) {
	const $ = jq;

  const common = require('../../home/mod/common-lib.js')($);

	const styleCommon = require('./style-common-lib.js')($);

  let pageHandle = undefined;
	let tabSheetBoxHandle = undefined;

  const setupPageHandle = function(value){
    pageHandle = value;
  }

	const doCheckQtyBeforeItems = function(beforeItems, currentItem) {
		return new Promise(async function(resolve, reject) {
			let foundItems = await beforeItems.find((item)=>{
				if (item.id == currentItem.id) {
					return item;
				}
			});
			//console.log(currentItem);
			//console.log(foundItems);
			if (foundItems) {
				if (foundItems.Qty == currentItem.Qty) {
					resolve()
				} else {
					resolve({diff: (Number(currentItem.Qty) - Number(foundItems.Qty)), before: foundItems.Qty, current: currentItem.Qty});
				}
			} else {
				resolve();
			}
		});
	}

  const doCreatePageTabsheet = function(shopId, workAreaBox, orderDate, newOrderShowEvt, accOrderShowEvt, sucOrderShowEvt) {
    let mainBox = $('<div></div>');
    let newOrderTab = $('<button class="tablink" id="NewOrderTab"></button>').text('รายการใหม่').css(styleCommon.tablinkStyle);
    let accOrderTab = $('<button class="tablink" id="AccOrderTab"></button>').text('รายการรับ').css(styleCommon.tablinkStyle);
    let sucOrderTab = $('<button class="tablink" id="SucOrderTab"></button>').text('รายการส่งมอบ').css(styleCommon.tablinkStyle);
    let newOrderSheet = $('<div class="tabcontent" id="NewOrderSheet"></div>').css(styleCommon.tabsheetStyle);
    let accOrderSheet = $('<div class="tabcontent" id="AccOrderSheet"></div>').css(styleCommon.tabsheetStyle);
    let sucOrderSheet = $('<div class="tabcontent" id="SucOrderSheet"></div>').css(styleCommon.tabsheetStyle);
    $(newOrderTab).on('click', (evt)=>{
      $('.tabcontent').hide();
      $(newOrderSheet).show();
      $('.tablink').css({'background-color': '#555'});
      $(newOrderTab).css({'background-color': '#777'});
      newOrderShowEvt(evt, newOrderSheet, shopId, workAreaBox, orderDate,);
    });
    $(accOrderTab).on('click', (evt)=>{
      $('.tabcontent').hide();
      $(accOrderSheet).show();
      $('.tablink').css({'background-color': '#555'});
      $(accOrderTab).css({'background-color': '#777'});
      accOrderShowEvt(evt, accOrderSheet, shopId, workAreaBox, orderDate,);
    });
    $(sucOrderTab).on('click', (evt)=>{
      $('.tabcontent').hide();
      $(sucOrderSheet).show();
      $('.tablink').css({'background-color': '#555'});
      $(sucOrderTab).css({'background-color': '#777'});
      sucOrderShowEvt(evt, sucOrderSheet, shopId, workAreaBox, orderDate,);
    });
    $(mainBox).append($(newOrderTab)).append($(accOrderTab)).append($(sucOrderTab));
    $(mainBox).append($(newOrderSheet)).append($(accOrderSheet)).append($(sucOrderSheet));
    return $(mainBox);
  }

  const onNewOrderShowEvt = async function(evt, newOrderSheetBox, shopId, workAreaBox, orderDate) {
    $(newOrderSheetBox).empty().append($('<h2>รายการใหม่</h2>'));
		$('#OrderListBox').remove();
		let selectDate = orderDate;
		let newStatuses = [1, 2];
		let newItemStatuses = ['New', 'Rej'];
		let orderListBox = await doCreateOrderList(shopId, newOrderSheetBox, selectDate, newStatuses, newItemStatuses);
		$(newOrderSheetBox).append($(orderListBox));
  }

  const onAccOrderShowEvt = async function(evt, accOrderSheetBox, shopId, workAreaBox, orderDate,) {
    $(accOrderSheetBox).empty().append($('<h2>รายการรับ</h2>'));
		$('#OrderListBox').remove();
		let selectDate = orderDate;
		let newStatuses = [1, 2];
		let accItemStatuses = ['Acc'];
		let orderListBox = await doCreateOrderList(shopId, accOrderSheetBox, selectDate, newStatuses, accItemStatuses);
		$(accOrderSheetBox).append($(orderListBox));
  }

  const onSucOrderShowEvt = async function(evt, sucOrderSheetBox, shopId, workAreaBox, orderDate,) {
    $(sucOrderSheetBox).empty().append($('<h2>รายการส่งมอบ</h2>'));
		$('#OrderListBox').remove();
		let selectDate = orderDate;
		let newStatuses = [1, 2, 3, 4];
		let sucItemStatuses = ['Suc'];
		let orderListBox = await doCreateOrderList(shopId, sucOrderSheetBox, selectDate, newStatuses, sucItemStatuses);
		$(sucOrderSheetBox).append($(orderListBox));
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
					let activeSheet = $(tabSheetBoxHandle).find('.tabcontent:visible');
					let activeId = $(activeSheet).get(0).id;
					if (activeId === 'NewOrderSheet') {
						let newStatuses = [1, 2];
						let newItemStatuses = ['New', 'Rej'];
						let orderListBox = await doCreateOrderList(shopId, activeSheet, selectDate, newStatuses, newItemStatuses);
						$(activeSheet).empty().append($(orderListBox));
					} else if (activeId === 'AccOrderSheet') {
						let newStatuses = [1, 2];
						let accItemStatuses = ['Acc'];
						let orderListBox = await doCreateOrderList(shopId, activeSheet, selectDate, newStatuses, accItemStatuses);
						$(activeSheet).empty().append($(orderListBox));
					} else if (activeId === 'SucOrderSheet') {
						let allStatuses = [1, 2, 3, 4];
						let sucItemStatuses = ['Suc'];
						let orderListBox = await doCreateOrderList(shopId, activeSheet, selectDate, allStatuses, sucItemStatuses);
					}
        }
        let calendar = doCreateCalendar(common.calendarOptions);
        $(pageHandle.menuContent).empty().append($(calendar).css({'position': 'relative', 'margin-top': '15px'}));
        $(pageHandle.toggleMenuCmd).click();
      });
      $(titlePageBox).append($(titleTextBox)).append($(orderDateBox));
			$(workAreaBox).append($(titlePageBox));


      tabSheetBoxHandle = doCreatePageTabsheet(shopId, workAreaBox, selectDate, onNewOrderShowEvt, onAccOrderShowEvt, onSucOrderShowEvt);
      $(workAreaBox).append($(tabSheetBoxHandle));
      $(tabSheetBoxHandle).find('#NewOrderTab').click();
			resolve();
    });
  }

  const doCreateCalendar = function(calendarOptions){
    let calendareBox = $('<div id="CalendarBox"></div>');
    return $(calendareBox).ionCalendar(calendarOptions);
  }

	const doCreateOrderList = function(shopId, workAreaBox, orderDate, orderStatuses, itemStatuses) {
    return new Promise(async function(resolve, reject) {
      let orderReqParams = {};
      if (orderDate) {
        orderReqParams = {orderDate: orderDate};
      }
      let orderRes = await common.doCallApi('/api/shop/order/list/by/shop/' + shopId, orderReqParams);
      let orders = orderRes.Records;

			console.log(orderStatuses); // [1,2]
			console.log(itemStatuses); // ['Acc']
      console.log(orders); // [ ... ]

			let orderListBox = $('<div id="OrderListBox"></div>').css({'position': 'relative', 'width': '100%', 'margin-top': '25px'});

			let	promiseList = new Promise(async function(resolve2, reject2){
				let cookItems = [];
				for (let i=0; i < orders.length; i++) {
					for (let j=0; j < orders[i].Items.length; j ++) {
						//console.log(orders[i].Status); // 1
						//console.log(orders[i].Items[j].ItemStatus); // Acc
						if ((orderStatuses.includes(Number(orders[i].Status))) && (itemStatuses.includes(orders[i].Items[j].ItemStatus))) {
							let cookItem = {item: {index: j, goodId: orders[i].Items[j].id, name: orders[i].Items[j].MenuName, desc: orders[i].Items[j].Desc, qty: orders[i].Items[j].Qty, price: orders[i].Items[j].Price, unit: orders[i].Items[j].Unit, picture: orders[i].Items[j].MenuPicture, status: orders[i].Items[j].ItemStatus}};
							/*
								กรณ๊ ลด Qty ให้เท่ากับ Before
							*/
							if (orders[i].BeforeItems) {
								let diffQty = await doCheckQtyBeforeItems(orders[i].BeforeItems, orders[i].Items[j]);
								//console.log(diffQty); // {diff, before, current}
								if ((diffQty) && (diffQty.diff != 0)) {
									cookItem.item.qty = diffQty.before;
									cookItem.item.status = orders[i].Items[j].ItemStatus;
								} else {
									cookItem.item.status = orders[i].Items[j].ItemStatus;
								}
							} else {
								cookItem.item.status = orders[i].Items[j].ItemStatus;
							}

							cookItem.orderId = orders[i].id;
							cookItem.index = i;
							cookItem.status = orders[i].Status;
							cookItem.customer = orders[i].customer;
							cookItem.owner = orders[i].userinfo;
							cookItem.createdAt = orders[i].createdAt;
							cookItem.updatedAt = orders[i].updatedAt;
							cookItems.push(cookItem);

						} else {
							/*
								กรณ๊ สร้างรายการใหม่ เข้าครัว เป็นรายการใหม่่
							*/
							if (orders[i].BeforeItems) {
								let diffQty = await doCheckQtyBeforeItems(orders[i].BeforeItems, orders[i].Items[j]);
								if (diffQty) {
									let newCookItem = {item: {index: j, goodId: orders[i].Items[j].id, name: orders[i].Items[j].MenuName, desc: orders[i].Items[j].Desc, qty: diffQty.diff, price: orders[i].Items[j].Price, unit: orders[i].Items[j].Unit, picture: orders[i].Items[j].MenuPicture, status: 'New'}};
									newCookItem.orderId = orders[i].id;
									newCookItem.index = i;
									newCookItem.status = orders[i].Status;
									newCookItem.customer = orders[i].customer;
									newCookItem.owner = orders[i].userinfo;
									newCookItem.createdAt = orders[i].createdAt;
									newCookItem.updatedAt = orders[i].updatedAt;
									cookItems.push(newCookItem);
								}
							}
						}
					}
				}
        setTimeout(()=>{
          resolve2($(cookItems));
        }, 500);
      });
      Promise.all([promiseList]).then((ob)=>{
				let orderFilters = ob[0];
				//console.log(orderFilters);
				if ((orderFilters) && (orderFilters.length > 0)) {
					for (let k=0; k < orderFilters.length; k++) {
						let cookItemBox = doRenderOrderListItem(orderFilters[k], onCookItemClickEvt);
						$(orderListBox).append($(cookItemBox));
						resolve($(orderListBox));
					}
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
		});
	}

	const doRenderOrderListItem = function(cookData, clickCallback){
		let cookBox = $('<div class="order-box"></div>').css({'width': '98%', 'padding': '2px', 'margin': '5px', 'display': 'table', 'border-collapse': 'collapse', 'border': '1px solid black', 'cursor': 'pointer'});
		$(cookBox).data('orderData', cookData);
		let cookRow = $('<div></div>').css({'width': '100%', 'display': 'table-row'});
		let nameCell = $('<div></div>').css({'width': '50%', 'display': 'table-cell'});
		let customerCell = $('<div></div>').css({'width': '40%', 'display': 'table-cell'});
		let qtyCell = $('<div></div>').css({'width': '10%', 'display': 'table-cell'});
		let itemNameBox = $('<div></div>').text(cookData.item.name).css({'position': 'relative', 'width': '100%', 'border-bottom': '2px solid black'});
		let itemDescBox = $('<div></div>').text(cookData.item.desc).css({'position': 'relative', 'width': '100%'});
		let itemCustomerNameBox = $('<div></div>').text(cookData.customer.Name).css({'margin-left': '4px'});
		let itemCustomerAddressBox = $('<div></div>').text(cookData.customer.Address).css({'margin-left': '4px'});
		let itemQtyBox = $('<div id="QtyBox"></div>').css({'margin-left': '4px', 'padding': '5px', 'border': '1px solid red'});
		$(itemQtyBox).append($('<p></p>').text(cookData.item.qty).css({'text-align': 'center', 'font-size': '30px', 'font-weight': 'bold'}));
		$(itemQtyBox).append($('<p></p>').text(cookData.item.unit).css({'text-align': 'center', 'font-size': '24px', 'font-weight': 'bold'}));
		$(nameCell).append($(itemNameBox)).append($(itemDescBox));
		$(customerCell).append($(itemCustomerNameBox)).append($(itemCustomerAddressBox));
		$(qtyCell).append($(itemQtyBox));
		$(cookRow).append($(nameCell)).append($(customerCell)).append($(qtyCell));
		if (cookData.status == 1) {
			if (cookData.item.status == 'New') {
				$(cookBox).css({'background-color': 'yellow', 'color': 'black'});
			} else if (cookData.item.status == 'Acc') {
				$(cookBox).css({'background-color': 'yellow', 'color': 'black'});
			} else if (cookData.item.status == 'Suc') {
				$(cookBox).css({'background-color': 'yellow', 'color': 'black'});
			} else if (cookData.item.status == 'Rej') {
				$(cookBox).css({'background-color': 'red', 'color': 'white'});
				$(itemQtyBox).css({'border': '1px solid white'});
			}
		} else if (cookData.status == 2) {
			$(cookBox).css({'background-color': 'orange', 'color': 'black'});
		} else if ([3, 4].includes(cookData.status)) {
			$(cookBox).css({'background-color': 'green', 'color': 'black'});
		}
		$(cookBox).on('click', (evt)=>{
			clickCallback(evt, cookData);
		})
		return $(cookBox).append($(cookRow));
	}

	const onCookItemClickEvt = function(evt, cookData) {
		let propTable = $('<div></div>');
		const cookPropOption = {
			title: 'รายการสั่ง',
			msg: $(propTable),
			width: '380px',
			onOk: function(evt) {
				cookPropBox.closeAlert();
			},
			onCancel: function(evt){
				cookPropBox.closeAlert();
			}
		}
		let cookPropBox = $('body').radalert(cookPropOption);
		let cookPropTable = doRenderCookPropertyTable(cookData);
		if (cookData.item.status == 'New') {
			$(cookPropBox.okCmd).hide();
			$(cookPropBox.cancelCmd).show();
			let accrejCmdTable = doRenderAccRejCmd(cookData, cookPropBox, onAccCmdClickEvt, onRejCmdClickEvt);
			$(propTable).append($(cookPropTable)).append($(accrejCmdTable));
		} else if (cookData.item.status == 'Rej') {
			$(cookPropBox.okCmd).hide();
			$(cookPropBox.cancelCmd).show();
			let resetCmdTable = doRenderResetCmd(cookData, cookPropBox, onResetCmdClickEvt);
			$(propTable).append($(cookPropTable)).append($(resetCmdTable));
		} else if (cookData.item.status == 'Acc') {
			$(cookPropBox.okCmd).hide();
			$(cookPropBox.cancelCmd).show();
			let deliretCmdTable = doRenderDeliRetCmd(cookData, cookPropBox, onDeliCmdClickEvt, onRetCmdClickEvt);
			$(propTable).append($(cookPropTable)).append($(deliretCmdTable));
		} else {
			$(cookPropBox.okCmd).show();
			$(cookPropBox.cancelCmd).hide();
			$(propTable).append($(cookPropTable));
		}
	}

	const onAccCmdClickEvt = async function(evt, cookData) {
		let userdata = JSON.parse(localStorage.getItem('userdata'));
		let params = {orderId: cookData.orderId, goodId: cookData.item.goodId, newStatus: 'Acc', shop: userdata.shop};
    let menuitemRes = await common.doCallApi('/api/shop/order/item/status/update', params);
		let newRest = await menuitemRes.result[0].Items.find((item, i) => {
			if (item.ItemStatus === 'New') {
				return item;
			}
		});
		if ((newRest) && (newRest.length == 0)) {
			$(tabSheetBoxHandle).find('#AccOrderTab').click();
		} else {
			$(tabSheetBoxHandle).find('#NewOrderTab').click();
		}
	}

	const onRejCmdClickEvt = async function(evt, cookData) {
		let userdata = JSON.parse(localStorage.getItem('userdata'));
		let params = {orderId: cookData.orderId, goodId: cookData.item.goodId, newStatus: 'Rej', shop: userdata.shop};
    let menuitemRes = await common.doCallApi('/api/shop/order/item/status/update', params);
		console.log(menuitemRes);
		$(tabSheetBoxHandle).find('#NewOrderTab').click();
	}

	const onResetCmdClickEvt = async function(evt, cookData) {
		let userdata = JSON.parse(localStorage.getItem('userdata'));
		let params = {orderId: cookData.orderId, goodId: cookData.item.goodId, newStatus: 'New', shop: userdata.shop};
    let menuitemRes = await common.doCallApi('/api/shop/order/item/status/update', params);
		console.log(menuitemRes);
		$(tabSheetBoxHandle).find('#NewOrderTab').click();
	}

	const onDeliCmdClickEvt = async function(evt, cookData) {
		let userdata = JSON.parse(localStorage.getItem('userdata'));
		let params = {orderId: cookData.orderId, goodId: cookData.item.goodId, newStatus: 'Suc', shop: userdata.shop};
    let menuitemRes = await common.doCallApi('/api/shop/order/item/status/update', params);
		$(tabSheetBoxHandle).find('#SucOrderTab').click();

		let accRest = await menuitemRes.result[0].Items.find((item, i) => {
			if (item.ItemStatus === 'Acc') {
				return item;
			}
		});
		if ((accRest) && (accRest.length == 0)) {
			$(tabSheetBoxHandle).find('#SucOrderTab').click();
		} else {
			$(tabSheetBoxHandle).find('#AccOrderTab').click();
		}
	}

	const onRetCmdClickEvt = async function(evt, cookData) {
		let userdata = JSON.parse(localStorage.getItem('userdata'));
		let params = {orderId: cookData.orderId, goodId: cookData.item.goodId, newStatus: 'New', shop: userdata.shop};
    let menuitemRes = await common.doCallApi('/api/shop/order/item/status/update', params);
		console.log(menuitemRes);
		$(tabSheetBoxHandle).find('#NewOrderTab').click();
	}

	const doRenderCookPropertyTable = function(cookData) {
		//console.log(cookData);
		let tableProp = $('<table width="100%" cellspacing="0" cellpadding="0" border="0"></table>');
		let firstRow = $('<tr></tr>');
		let secondRow = $('<tr></tr>');
		let thirdRow = $('<tr></tr>');
		let fifthRow = $('<tr></tr>');
		let leftCell = $('<td></td>');
		let middleCell = $('<td></td>');
		let rightCell = $('<td></td>');
		$(leftCell).append($('<img/>').attr({'src': cookData.item.picture, 'width': '110px', 'height': 'auto'}));
		$(middleCell).append($('<p></p>').text(cookData.item.name).css({'line-height': '24px', 'font-size': '20px', 'font-weight': 'bold'}));
		$(middleCell).append($('<p></p>').text(cookData.item.desc).css({'line-height': '20px', 'font-size': '16px', 'font-weight': 'normal'}));
		$(rightCell).append($('<p></p>').text(cookData.item.qty).css({'line-height': '34px', 'font-size': '34px', 'font-weight': 'bold'}));
		$(rightCell).append($('<p></p>').text(cookData.item.unit).css({'line-height': '24px', 'font-size': '24px', 'font-weight': 'bold'}));
		$(firstRow).append($(leftCell).attr({'width': '30%', 'align': 'center'})).append($(middleCell).attr({'width': '55%', 'align': 'left'})).append($(rightCell).attr({'width': '*', 'align': 'center'}).css({'border': '1px solid red'}));
		$(secondRow).append($('<td colspan="3" align="left"></td>').append($('<p></p>').text(common.fmtStr('ลูกค้า: %s', cookData.customer.Name)).css({'line-height': '18px', 'font-size': '18px', 'font-weight': 'normal'})));
		$(thirdRow).append($('<td colspan="3" align="left"></td>').append($('<p></p>').text(common.fmtStr('ผู้สั่ง: %s %s', cookData.owner.User_NameTH, cookData.owner.User_LastNameTH)).css({'line-height': '18px', 'font-size': '18px', 'font-weight': 'normal'})));
		$(fifthRow).append($('<td colspan="3" align="left"></td>').append($('<p></p>').text(common.fmtStr('เมื่อ: %s', common.doFormatTimeStr(new Date(cookData.createdAt)))).css({'line-height': '18px', 'font-size': '18px', 'font-weight': 'normal'})));
		return $(tableProp).append($(firstRow)).append($(secondRow)).append($(thirdRow)).append($(fifthRow));
	}

	const doRenderAccRejCmd = function(cookData, dialogHandle, accCallback, rejCallback) {
		let tableActionCmd = $('<table width="100%" cellspacing="0" cellpadding="0" border="0"></table>');
		let firstRow = $('<tr></tr>');
		let leftCell = $('<td></td>');
		let rightCell = $('<td></td>');
		let accCmd = $('<input type="button" value=" รับ "/>');
		$(accCmd).on('click', (evt)=>{
			dialogHandle.closeAlert();
			accCallback(evt, cookData);
		});
		let rejCmd = $('<input type="button" value=" ไม่รับ "/>');
		$(rejCmd).on('click', (evt)=>{
			dialogHandle.closeAlert();
			rejCallback(evt, cookData);
		});
		$(leftCell).append($(rejCmd));
		$(rightCell).append($(accCmd));
		$(firstRow).append($(leftCell).attr({'width': '50%', 'align': 'center'})).append($(rightCell).attr({'width': '*', 'align': 'center'}));
		return $(tableActionCmd).append($(firstRow));
	}

	const doRenderDeliRetCmd = function(cookData, dialogHandle, deliCallback, retCallback) {
		let tableActionCmd = $('<table width="100%" cellspacing="0" cellpadding="0" border="0"></table>');
		let firstRow = $('<tr></tr>');
		let leftCell = $('<td></td>');
		let rightCell = $('<td></td>');
		let deliCmd = $('<input type="button" value=" ส่งมอบ "/>');
		$(deliCmd).on('click', (evt)=>{
			dialogHandle.closeAlert();
			deliCallback(evt, cookData);
		});
		let retCmd = $('<input type="button" value=" ส่งกลับ "/>');
		$(retCmd).on('click', (evt)=>{
			dialogHandle.closeAlert();
			retCallback(evt, cookData);
		});
		$(leftCell).append($(retCmd));
		$(rightCell).append($(deliCmd));
		$(firstRow).append($(leftCell).attr({'width': '50%', 'align': 'center'})).append($(rightCell).attr({'width': '*', 'align': 'center'}));
		return $(tableActionCmd).append($(firstRow));
	}

	const doRenderResetCmd = function(cookData, dialogHandle, resetCallback){
		let tableActionCmd = $('<table width="100%" cellspacing="0" cellpadding="0" border="0"></table>');
		let firstRow = $('<tr></tr>');
		let leftCell = $('<td></td>');
		let rightCell = $('<td></td>');
		let resetCmd = $('<input type="button" value=" ดึงกลับ "/>');
		$(resetCmd).on('click', (evt)=>{
			dialogHandle.closeAlert();
			resetCallback(evt, cookData);
		});
		/*
		let retCmd = $('<input type="button" value=" ส่งกลับ "/>');
		$(retCmd).on('click', (evt)=>{
			dialogHandle.closeAlert();
			retCallback(evt, cookData);
		});
		*/
		$(leftCell).append($('<span></span>'));
		$(rightCell).append($(resetCmd));
		$(firstRow).append($(leftCell).attr({'width': '50%', 'align': 'center'})).append($(rightCell).attr({'width': '*', 'align': 'center'}));
		return $(tableActionCmd).append($(firstRow));
	}

  return {
    setupPageHandle,
    doShowOrderList
	}
}
