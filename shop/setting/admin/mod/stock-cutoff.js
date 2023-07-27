/*stock-cutoff.js*/
module.exports = function ( jq ) {
	const $ = jq;
  const common = require('../../../home/mod/common-lib.js')($);
  const order = require('./order-mng.js')($);

  const doExtractList = function(originList, from, to) {
		return new Promise(async function(resolve, reject) {
			let exResults = [];
			let	promiseList = new Promise(function(resolve2, reject2){
				for (let i = (from-1); i < to; i++) {
					if (originList[i]){
						exResults.push(originList[i]);
					}
				}
				setTimeout(()=>{
          resolve2(exResults);
        }, 100);
			});
			Promise.all([promiseList]).then((ob)=>{
				resolve(ob[0]);
			});
		});
	}

  const doRenderCutoffStockTable = function(workAreaBox, viewPage, startRef, fromDate, stockRes, menuitemData) {
    return new Promise(async function(resolve, reject) {
      console.log(stockRes);
      $('body').loading('start');
      let stocks = stockRes.Records;
      let titleText = 'เช็คสต็อค';
      let userDefualtSetting = JSON.parse(localStorage.getItem('defualsettings'));
      let userItemPerPage = userDefualtSetting.itemperpage;

      let cutoffDate = common.doFormatDateStr(fromDate);
      titleText += ' ตั้งแต่วันที่ ' + cutoffDate;

      let stockPageItems = stocks;

      let totalItem = stockPageItems.length;

      if (userItemPerPage != 0) {
        if (startRef > 0) {
          stockPageItems = await doExtractList(stocks, (startRef+1), (startRef+userItemPerPage));
        } else {
          stockPageItems = await doExtractList(stocks, 1, userItemPerPage);
        }
      }

      let stockTable = $('<table id="StockTable" width="100%" cellspacing="0" cellpadding="0" border="1"></table>');

      let titleRow = $('<tr></tr>').css({'background-color': 'gray', 'color': 'white'});
      let titleCol = $('<td colspan="7" align="center"></td>');
      $(titleCol).append($('<h3></h3>').text(titleText).css({'font-weight': 'bold'}));
      $(titleRow).append($(titleCol));
      $(stockTable).append($(titleRow));

      let sumBeforeText = 'ยอดคงเหลือยกมา ' + common.doFormatQtyNumber(stockRes.sumQty.Qty) + ' ' + menuitemData.Unit;
      let sumBeforeRow = $('<tr></tr>');
      let sumBeforeCol = $('<td colspan="7" align="center"></td>');
      $(sumBeforeCol).append($('<h3></h3>').text(sumBeforeText).css({'font-weight': 'bold'}));
      $(sumBeforeRow).append($(sumBeforeCol));
      $(stockTable).append($(sumBeforeRow));

      let headerRow = $('<tr></tr>');
      $(headerRow).append($('<td width="4%" align="center"><b>#</b></td>'));
      $(headerRow).append($('<td width="15%" align="center"><b>วันที่</b></td>'));
      let dirCol = $('<td width="10%" align="center"><b>เข้า/ออก</b></td>');
      $(headerRow).append($(dirCol));
      let qtyCol = $('<td width="10%" align="center"><b>จำนวน</b></td>');
      $(headerRow).append($(qtyCol));
			let priceCol = $('<td width="10%" align="center"><b>ราคา</b></td>');
			$(headerRow).append($(priceCol));
      let sumCol = $('<td width="10%" align="center"><b>คงเหลือ</b></td>');
      $(headerRow).append($(sumCol));
      let cmdCol = $('<td width="*" align="center" class="row-cmd"><b>คำสั่ง</b></td>');
      $(headerRow).append($(cmdCol));
      $(stockTable).append($(headerRow));

      let promiseList = new Promise(async function(resolve2, reject2){
        let sum = stockRes.sumQty.Qty;
        for (let i=0; i < stockPageItems.length; i++) {
          let no = (i + 1 + startRef);
          let stockPageItem = stockPageItems[i];
          let stockDate = common.doFormatDateStr(new Date(stockPageItem.StockedAt));
          let dataRow = $('<tr></tr>');
          if (stockPageItem.Direction == '+') {
            $(dataRow).css({'background-color': '#ddd'});
            sum = sum + stockPageItem.Qty;
          } else if (stockPageItem.Direction == '-'){
            $(dataRow).css({'background-color': ''});
            sum = sum - stockPageItem.Qty;
          }
          $(dataRow).append($('<td align="center"></td>').text(no));
          let stockDateCol = $('<td align="left"></td>');

          if (stockPageItem.Direction == '+') {
            let stockDateBox = $('<span></span>').text(stockDate).css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'margin': '-3px 5px 0px 10px', 'padding': '4px', 'font-size': '16px', 'border': '3px solid grey'});
      			$(stockDateBox).on('click', (evt)=>{
      				common.calendarOptions.onClick = async function(date){
                console.log(date);
      					//selectDate = common.doFormatDateStr(new Date(date));
                //console.log(selectDate);
                let params = {data: {StockedAt: date}, stockingId: stockPageItem.id};
                console.log(params);
                let stockRes = await common.doCallApi('/api/shop/stocking/edit/stockeddate', params);
                if (stockRes.status.code == 200) {
                  $.notify("แก้ไขวันที่นำเข้า " + menuitemData.MenuName + " สำเร็จ", "success");
                  $('#StockCutoffDateOption').change();
                } else if (stockRes.status.code == 201) {
                  $.notify("ไม่สามารถแก้ไขวันที่นำเข้าสต็อคได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "warn");
                } else {
                  $.notify("เกิดข้อผิดพลาด ไม่สามารถแก้ไขวันที่นำเข้าสต็อคได้", "error");
                  console.log(stockRes);
                }
                calendarHandle.closeAlert();
      				}
      				let calendarHandle = order.doShowCalendarDlg(common.calendarOptions);
      			});
      			$(stockDateBox).hover(()=>{
      				$(stockDateBox).css({'border': '3px solid black'});
      			},()=>{
      				$(stockDateBox).css({'border': '3px solid grey'});
      			});
						$(stockDateBox).attr('title', 'แก้ไขวันที่นำเข้าสต็อค');
            $(stockDateCol).append($(stockDateBox));
          } else {
            let stockDateBox = $('<span></span>').text(stockDate).css({'position': 'relative', 'margin': '-3px 5px 0px 10px', 'padding': '4px', 'font-size': '16px'});
            $(stockDateCol).append($(stockDateBox));
          }
          $(dataRow).append($(stockDateCol));
          $(dataRow).append($('<td align="center"></td>').text(stockPageItem.Direction).css({'font-weight': 'bold'}));
          $(dataRow).append($('<td align="right"></td>').text(stockPageItem.Direction + common.doFormatQtyNumber(stockPageItem.Qty)).css({'padding-right': '2px'}));
          $(dataRow).append($('<td align="right"></td>').text(common.doFormatNumber(stockPageItem.Price)).css({'padding-right': '2px'}));
          $(dataRow).append($('<td align="right"></td>').text(common.doFormatQtyNumber(sum)).css({'padding-right': '2px'}));
          let cmdItemCol = $('<td align="center" class="row-cmd"></td>');
          $(dataRow).append($(cmdItemCol));
          $(stockTable).append($(dataRow));
          if (stockPageItem.Direction == '+') {
            let editStockInValueCmd = $('<input type="button" value=" Edit " class="action-btn"/>');
            $(editStockInValueCmd).on('click', (evt)=>{
              doUpdateStockInValue(menuitemData, stockPageItem, ()=>{
                $('#StockCutoffDateOption').change();
              });
            });
            $(cmdItemCol).append($(editStockInValueCmd));

            let deleteStockInValueCmd = $('<input type="button" value=" Delete " class="action-btn"/>');
            $(deleteStockInValueCmd).on('click', (evt)=>{
              doDeleteStockInValue(menuitemData, stockPageItem, ()=>{
                $('#StockCutoffDateOption').change();
              });
            });
            $(cmdItemCol).append($(deleteStockInValueCmd).css({'margin-left': '5px'}));
          } else if (stockPageItem.Direction == '-') {
            // Open Order
            let openOrderCmd = $('<input type="button" value=" Open " class="action-btn"/>');
            $(openOrderCmd).on('click', async (evt)=>{
              let userdata = JSON.parse(localStorage.getItem('userdata'));
              let shopData = userdata.shop;
              let selectDate = stockPageItem.StockedAt;
              let params = {};
              let orderRes = await common.doCallApi('/api/shop/order/select/' + stockPageItem.orderId, params);
              let orderData = {customer: orderRes.Record.customer, gooditems: orderRes.Record.Items, id: orderRes.Record.id, Status: orderRes.Record.Status};
              order.doOpenOrderForm(shopData, workAreaBox, orderData, selectDate);
            });
            $(cmdItemCol).append($(openOrderCmd));
          }
        }

        let sumAfterText = 'ยอดคงเหลือสุทธิ ';
        let sumAfterRow = $('<tr></tr>').css({'background-color': 'grey', 'color': 'white'});
        let sumAfterCol = $('<td colspan="5" align="center"></td>');
        let sumQtyCol = $('<td align="right"></td>').css({'padding-right': '2px'});
        let sumCmdCol = $('<td align="center" class="row-cmd"></td>')
        $(sumQtyCol).append($('<h3></h3>').text(common.doFormatQtyNumber(sum)).css({'font-weight': 'bold'}));
        $(sumAfterCol).append($('<h3></h3>').text(sumAfterText).css({'font-weight': 'bold'}));
        $(sumAfterRow).append($(sumAfterCol)).append($(sumQtyCol)).append($(sumCmdCol));
        $(stockTable).append($(sumAfterRow));

        let exportCmdIcon = $('<img src="../../images/excel-icon.png"/>');
    		$(exportCmdIcon).css({'position': 'relative', 'width': '30px', 'height': 'auto', 'cursor': 'pointer'});
    		$(exportCmdIcon).on('click', async(evt)=>{
    			$('body').loading('start');
          $('.row-cmd').hide();
          let wsName = 'StockingRecord'+ menuitemData.id;
          $(workAreaBox).excelexportjs({
    			  containerid: 'StockTable',
    			  datatype: 'table',
    				encoding: "utf-8",
    				locale: 'th-TH',
    				worksheetName: wsName
    			});
          $('.row-cmd').show();
          $('body').loading('stop');
        });
        $(sumCmdCol).append($(exportCmdIcon));

        let printCmdIcon = $('<img src="../../images/print-icon.png"/>');
        $(printCmdIcon).css({'position': 'relative', 'width': '30px', 'height': 'auto', 'cursor': 'pointer', 'margin-left': '10px'});
        $(printCmdIcon).on('click', async(evt)=>{
          $('body').loading('start');
          $('.row-cmd').hide();
          printJS('StockTable', 'html');
          $('.row-cmd').show();
          $('body').loading('stop');
        });
        $(sumCmdCol).append($(printCmdIcon));

        setTimeout(()=> {
          resolve2(stockTable);
        },1200);
      });

      Promise.all([promiseList]).then((ob)=> {
        let stockTable = ob[0];
        $(workAreaBox).append($(stockTable).css({'margin-top': '20px'}));

        let showPage = 1;
        if ((viewPage) && (viewPage > 0)){
          showPage = viewPage;
        }

        let pageNavigator = doCreatePageNavigatorBox(showPage, userItemPerPage, totalItem, async function(page){
          console.log(page);
          $('body').loading('start');
          $('#StockTable').remove();
          $('#NavigBar').remove();
          //userDefualtSetting.itemperpage = page.perPage;
					userDefualtSetting = {itemperpage: page.perPage, currentPage: showPage};
          localStorage.setItem('defualsettings', JSON.stringify(userDefualtSetting));

          let toPage = Number(page.toPage);
          let newStartRef = Number(page.fromItem);
          stockTable = await doRenderCutoffStockTable(workAreaBox, toPage, newStartRef, fromDate, stockRes, menuitemData);
          $('body').loading('stop');
        })
        $(workAreaBox).append($(pageNavigator).css({'margin-top': '2px'}));

        resolve(stockTable);
        $('body').loading('stop');
      });
    });
  }

  const doCreatePageNavigatorBox = function(showPage, userItemPerPage, totalItem, callback) {
    let navigBarBox = $('<div id="NavigBar"></div>');
    let navigBarOption = {
      currentPage: showPage,
      itemperPage: userItemPerPage,
      totalItem: totalItem,
      styleClass : {'padding': '4px', 'margin-top': '60px'},
      changeToPageCallback: callback
    };
    let navigatoePage = $(navigBarBox).controlpage(navigBarOption);
    //navigatoePage.toPage(1);
    return $(navigBarBox);
  }

  const doCreateStockInMenuitemForm = function(menuitemData, stockInData){
    let stockInFormTable = $('<table width="100%" cellspacing="0" cellpadding="0" border="1"></table>');
  	let fieldRow = $('<tr></tr>');
		let labelField = $('<td width="40%" align="left">จำนวน<span style="color: red;">*</span></td>').css({'padding': '5px'});
		let inputField = $('<td width="*" align="left"></td>').css({'padding': '5px'});
		let inputQtyValue = $('<input type="number" id="StockiInQty" size="10"/>');
    if (stockInData && stockInData.Qty) {
      $(inputQtyValue).val(stockInData.Qty);
    }
		$(inputField).append($(inputQtyValue));
		$(fieldRow).append($(labelField)).append($(inputField));
		$(stockInFormTable).append($(fieldRow));

		fieldRow = $('<tr></tr>');
		labelField = $('<td width="40%" align="left">ราคา(รับ)<span style="color: red;">*</span></td>').css({'padding': '5px'});
		inputField = $('<td width="*" align="left"></td>').css({'padding': '5px'});
		let inputPriceValue = $('<input type="number" id="StockiInPrice" size="10"/>');
    if (stockInData && stockInData.Price) {
      $(inputPriceValue).val(stockInData.Price);
    }
		$(inputField).append($(inputPriceValue));
		$(fieldRow).append($(labelField)).append($(inputField));
		$(stockInFormTable).append($(fieldRow));
		return $(stockInFormTable);
  }

  const doVerifyStockInForm = function(form) {
		let qty = $(form).find('#StockiInQty').val();
		if (parseFloat(qty) >= 0) {
			$(form).find('#StockiInQty').css({'border': ''});
			let price = $(form).find('#StockiInPrice').val();
			if (parseFloat(price) >= 0) {
				$(form).find('#StockiInPrice').css({'border': ''});
				let newStockIn = {Direction: '+', Qty: qty, Price: price};
				return newStockIn;
			} else {
				$.notify("ข้อมูลราคารับเพื่อนำเข้าไม่ภูกต้อง", "error");
				$(form).find('#StockiInPrice').css({'border': '1px solid red'});
				return;
			}
		} else {
			$.notify("ข้อมูลจำนวนนำเข้าไม่ภูกต้อง", "error");
			$(form).find('#StockiInQty').css({'border': '1px solid red'});
			return;
		}
	}

	const doOpenStockInForm = function(shopData, workAreaBox, menuitemData){
    let stockInForm = doCreateStockInMenuitemForm(menuitemData);
		let stockInFormBox = $('<div></div>');
		$(stockInFormBox).append($(stockInForm));
		const stockInformoption = {
			title: 'นำเข้า ' + menuitemData.MenuName,
			msg: $(stockInFormBox),
			width: '520px',
			onOk: async function(evt) {
				let stockInObj = doVerifyStockInForm(stockInForm);
				if (stockInObj) {
					stockIn.closeAlert();
					let userdata = JSON.parse(localStorage.getItem('userdata'));
					let params = {data: stockInObj, shopId: shopData.id, userId: userdata.id, orderId: 0, menuitemId: menuitemData.id};
					let stockRes = await common.doCallApi('/api/shop/stocking/add', params);
					if (stockRes.status.code == 200) {
						$.notify("นำเข้า " + menuitemData.MenuName + " สำเร็จ", "success");
					} else if (stockRes.status.code == 201) {
						$.notify("ไม่สามารถนำเข้าสต็อคได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "warn");
					} else {
						$.notify("เกิดข้อผิดพลาด ไม่สามารถนำเข้าสต็อคได้", "error");
						console.log(stockRes);
					}
				}else {
					$.notify("ข้อมูลไม่ถูกต้อง", "error");
				}
			},
			onCancel: function(evt){
				stockIn.closeAlert();
			}
		}
		let stockIn = $('body').radalert(stockInformoption);
  }

  const doUpdateStockInValue = function(menuitemData, stockItemData, callback) {
    let stockInForm = doCreateStockInMenuitemForm(menuitemData, stockItemData);
    let stockInFormBox = $('<div></div>');
    $(stockInFormBox).append($(stockInForm));
    const stockInformoption = {
      title: 'แก้ไข การนำเข้า ' + menuitemData.MenuName,
      msg: $(stockInFormBox),
      width: '520px',
      onOk: async function(evt) {
				let stockInObj = doVerifyStockInForm(stockInForm);
        if (stockInObj) {
          stockIn.closeAlert();
          let userdata = JSON.parse(localStorage.getItem('userdata'));
          let params = {data: stockInObj, shopId: userdata.shopId, userId: userdata.id, orderId: 0, menuitemId: menuitemData.id, stockingId: stockItemData.id};
          console.log(params);
					let stockRes = await common.doCallApi('/api/shop/stocking/update', params);
					if (stockRes.status.code == 200) {
						$.notify("แก้ไขการนำเข้า " + menuitemData.MenuName + " สำเร็จ", "success");
            callback();
					} else if (stockRes.status.code == 201) {
						$.notify("ไม่สามารถแก้ไขการนำเข้าสต็อคได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "warn");
					} else {
						$.notify("เกิดข้อผิดพลาด ไม่สามารถแก้ไขการนำเข้าสต็อคได้", "error");
						console.log(stockRes);
					}
        }
      },
      onCancel: function(evt){
        stockIn.closeAlert();
      }
    }
    let stockIn = $('body').radalert(stockInformoption);
  }

  const doDeleteStockInValue = function(menuitemData, stockItemData, callback){
    let stockInConfirmBox = $('<div></div>');
    let stockInConfirm = $('<p></p>').text('โปรดยืนยันการลบโดยคลิกปุ่ม ตกลง');
    $(stockInConfirmBox).append($(stockInConfirm));
    const stockInconfirmoption = {
      title: 'ยืนยันการลบรายการนำเข้าสต็อค ' + menuitemData.MenuName,
      msg: $(stockInConfirmBox),
      width: '420px',
      onOk: async function(evt) {
        stockIn.closeAlert();
        let params = {stockingId: stockItemData.id};
        console.log(params);
				let stockRes = await common.doCallApi('/api/shop/stocking/delete', params);
				if (stockRes.status.code == 200) {
					$.notify("ลบรายการนำเข้า " + menuitemData.MenuName + " สำเร็จ", "success");
          callback();
				} else if (stockRes.status.code == 201) {
					$.notify("ไม่สามารถลบรายการนำเข้าสต็อคได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "warn");
				} else {
					$.notify("เกิดข้อผิดพลาด ไม่สามารถลบรายการนำเข้าสต็อคได้", "error");
					console.log(stockRes);
				}
      },
      onCancel: function(evt){
        stockIn.closeAlert();
      }
    }
    let stockIn = $('body').radalert(stockInconfirmoption);
  }

  return {
    doOpenStockInForm,
    doRenderCutoffStockTable
  }
}
