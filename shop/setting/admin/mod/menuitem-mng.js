module.exports = function ( jq ) {
	const $ = jq;
  const common = require('../../../home/mod/common-lib.js')($);
	const stock = require('./stock-cutoff.js')($);

  const menuitemTableFields = [
		{fieldName: 'MenuName', displayName: 'ชื่อเมนู', width: '20%', align: 'left', inputSize: '30', verify: true, showHeader: true},
		{fieldName: 'Desc', displayName: 'รายละเอียด', width: '20%', align: 'left', inputSize: '30', verify: false, showHeader: true},
		{fieldName: 'MenuPicture', displayName: 'รูปเมนู', width: '10%', align: 'center', inputSize: '30', verify: false, showHeader: true},
    {fieldName: 'Price', displayName: 'ราคา', width: '6%', align: 'right', inputSize: '20', verify: true, showHeader: true},
		{fieldName: 'Unit', displayName: 'หน่วย', width: '10%', align: 'center', inputSize: '30', verify: true, showHeader: true}
	];
  const menugroupTableFields = [
		{fieldName: 'GroupName', displayName: 'กลุ่ม', width: '10%', align: 'center', inputSize: '30', verify: true, showHeader: true}
  ];

	const doCreateStockOptionSelect = function() {
		let optionSelector = $('<select id="StockingOption"></select>');
		$(optionSelector).append($('<option value="0">ไม่ตัดสต็อค</option>'));
		$(optionSelector).append($('<option value="1">ตัดสต็อค</option>'));
		return $(optionSelector);
	}

	const doCreateStockInCmd = function(shopData, workAreaBox, menuitem) {
		let stockInCmd = $('<input type="button" value=" นำเข้า " class="action-btn"/>');
		$(stockInCmd).on('click', (evt)=>{
			stock.doOpenStockInForm(shopData, workAreaBox, menuitem);
		});
		return $(stockInCmd);
	}

	const doCreateStockCutoffDateOptionSelect = function() {
		let optionSelector = $('<select id="StockCutoffDateOption"></select>');
		$(optionSelector).append($('<option value="1D">1 วันที่แล้ว</option>'));
		$(optionSelector).append($('<option value="2D">2 วันที่แล้ว</option>'));
		$(optionSelector).append($('<option value="3D">3 วันที่แล้ว</option>'));
		$(optionSelector).append($('<option value="5D">5 วันที่แล้ว</option>'));
		$(optionSelector).append($('<option value="7D">7 วันที่แล้ว</option>'));
		$(optionSelector).append($('<option value="10D">10 วันที่แล้ว</option>'));
		$(optionSelector).append($('<option value="15D">15 วันที่แล้ว</option>'));
		$(optionSelector).append($('<option value="1M">1 เดือนที่แล้ว</option>'));
		$(optionSelector).append($('<option value="2M">2 เดือนที่แล้ว</option>'));
		$(optionSelector).append($('<option value="3M">3 เดือนที่แล้ว</option>'));
		$(optionSelector).append($('<option value="6M">6 เดือนที่แล้ว</option>'));
		$(optionSelector).append($('<option value="1Y">1 ปีที่แล้ว</option>'));
		$(optionSelector).append($('<option value="2Y">2 ปีที่แล้ว</option>'));
		$(optionSelector).append($('<option value="3Y">3 ปีที่แล้ว</option>'));
		$(optionSelector).append($('<option value="4Y">4 ปีที่แล้ว</option>'));
		$(optionSelector).append($('<option value="5Y">5 ปีที่แล้ว</option>'));
		return $(optionSelector);
	}

	const doCreateCheckStockCmd = function(shopData, workAreaBox, menuitem, row) {
		let checkCtockCmd = $('<input type="button" value=" เช็ค " class="action-btn"/>');
		$(checkCtockCmd).on('click', (evt)=>{
			$('#TitlePageBox').text('เช็คสต็อครายการสินค้า');
			$('#NewMenuitemCmdBox').hide();
			$('.menuitem-row').hide();
			$(row).show();
			$(row).css({'background-color': 'gray', 'color': 'white'});
			$(row).find('input[type="button"]').hide();
			let commandCell = $(row).find('#CommandCell');
			$(commandCell).find('img').hide();

			let cutoffDateBox = $('<div id="CutoffDateBox"></div>');
			let cutoffDateSelector = doCreateStockCutoffDateOptionSelect();
			let fromDateText = $('<span>ตั้งแต่</span>');
			$(cutoffDateBox).append($(fromDateText)).append($(cutoffDateSelector).css({'margin-left': '4px'}));
			$(cutoffDateSelector).on('change', async (evt)=>{
				$('#StockTable').remove();
				$('#NavigBar').remove();
				let cutoffDateValue = $(cutoffDateSelector).val();
				let cutoffDate = common.findCutoffDateFromDateOption(cutoffDateValue);
				let orderDateFmt = common.doFormatDateStr(new Date(cutoffDate));
				cutoffDate = new Date(cutoffDate);
				let params = {cutoffDate: cutoffDate};
				let stockCutoffUrl = '/api/shop/stocking/list/by/menuitem/' + menuitem.id;
				let stockRes = await common.doCallApi(stockCutoffUrl, params);
				let stockTable = await stock.doRenderCutoffStockTable(workAreaBox, 0, 0, cutoffDate, stockRes, menuitem);
			});

			let backMenuitemCmd = $('<input type="button" value=" Back " class="action-btn"/>').css({'margin-top': '4px'});
			$(backMenuitemCmd).on('click', (evt)=>{
				$(cutoffDateBox).remove();
				$(backMenuitemCmd).remove();
				$('#StockTable').remove();
				$('#NavigBar').remove();
				$('#TitlePageBox').text('รายการสินค้าของร้าน');
				$('#NewMenuitemCmdBox').show();
				$('.menuitem-row').show();
				$(row).css({'background-color': '', 'color': ''});
				$(row).find('input[type="button"]').show();
				$(commandCell).find('img').show();
			});

			$(commandCell).append($(cutoffDateBox)).append($(backMenuitemCmd));
			$(cutoffDateSelector).change();
		});
		return $(checkCtockCmd);
	}

  const doShowMenuitemItem = function(shopData, workAreaBox, groupId){
    return new Promise(async function(resolve, reject) {
			let stockingOptionIndex = await menuitemTableFields.findIndex((item) =>{
				return (item.fieldName == 'StockingOption');
			});
			if (stockingOptionIndex > -1) {
				menuitemTableFields.splice(stockingOptionIndex, 1);
			}

			if (parseInt(shopData.Shop_StockingOption) == 1) {
				menuitemTableFields.push({fieldName: 'StockingOption', displayName: 'Stock', width: '10%', align: 'center', inputSize: '30', verify: true, showHeader: true});
			}

      let menugroupRes = await common.doCallApi('/api/shop/menugroup/options/' + shopData.id, {});
      let menugroups = menugroupRes.Options;
      localStorage.setItem('menugroups', JSON.stringify(menugroups));

      $(workAreaBox).empty();
			let listParams = {};
			if (groupId) {
				listParams.groupId = groupId;
			}
      let menuitemRes = await common.doCallApi('/api/shop/menuitem/list/by/shop/' + shopData.id, listParams);
			let menuitemItems = menuitemRes.Records;
      let titlePageBox = $('<div id="TitlePageBox" style="padding: 4px;">รายการสินค้าของร้าน</viv>').css({'width': '99.1%', 'text-align': 'center', 'font-size': '22px', 'border': '2px solid black', 'border-radius': '5px', 'background-color': 'grey', 'color': 'white'});
      $(workAreaBox).append($(titlePageBox));
      let newMenuitemCmdBox = $('<div id="NewMenuitemCmdBox" style="padding: 4px;"></div>').css({'width': '99.5%', 'text-align': 'right'});
      let newMenuitemCmd = $('<input type="button" value=" + New Menu " class="action-btn"/>');
      $(newMenuitemCmd).on('click', (evt)=>{
        doOpenNewMenuitemForm(shopData, workAreaBox, groupId);
      });
			let menugroupFilter = $('<select></select>');
			$(menugroupFilter).append($('<option value="0">All</option>'));
			menugroups.forEach((item, i) => {
				$(menugroupFilter).append($('<option value="' +item.Value + '">' + item.DisplayText + '</option>'));
			});
			if (groupId) {
				$(menugroupFilter).val(groupId);
			}
			$(menugroupFilter).on('change', async (evt)=>{
				let selectGroupId = $(menugroupFilter).val();
				if (selectGroupId != 0) {
					await doShowMenuitemItem(shopData, workAreaBox, selectGroupId);
				} else {
					await doShowMenuitemItem(shopData, workAreaBox);
				}
			});

			let readySwitch = undefined;
			let stockFilter = false;
			if (parseInt(shopData.Shop_StockingOption) == 1) {
				let readySwitchBox = $('<div id="ReadyState" style="position: relative; display: inline-block; top: -4px;"></div>');
				let readyOption = {switchTextOnState: 'กรองเฉพาะที่ตัดสต็อค', switchTextOffState: 'ไม่กรอง(แสดงทั้งหมด)',
					onActionCallback: async ()=>{
						stockFilter = true;
						$(menuitemTable).remove()
						doRenderMenuitemTable();
						$(workAreaBox).append($(menuitemTable));
					},
					offActionCallback: async ()=>{
						stockFilter = false;
						$(menuitemTable).remove()
						doRenderMenuitemTable();
						$(workAreaBox).append($(menuitemTable));
					}
				};
				readySwitch = $(readySwitchBox).readystate(readyOption);
				readySwitch.offAction();
				$(newMenuitemCmdBox).append($(readySwitchBox));
      	$(newMenuitemCmdBox).append($(menugroupFilter).css({'margin-left': '10px'})).append($(newMenuitemCmd).css({'margin-left': '10px'}));
			} else {
      	$(newMenuitemCmdBox).append($(menugroupFilter)).append($(newMenuitemCmd).css({'margin-left': '10px'}));
			}
      $(workAreaBox).append($(newMenuitemCmdBox));


			let menuitemTable = undefined;

			const doRenderMenuitemTable = function() {
				menuitemTable = $('<table width="100%" cellspacing="0" cellpadding="0" border="1"></table>');
				let headerRow = $('<tr></tr>');
				$(headerRow).append($('<td width="2%" align="center"><b>#</b></td>'));
				for (let i=0; i < menuitemTableFields.length; i++) {
	        if (menuitemTableFields[i].showHeader) {
	          $(headerRow).append($('<td width="' + menuitemTableFields[i].width + '" align="center"><b>' + menuitemTableFields[i].displayName + '</b></td>'));
	        }
				}
	      for (let i=0; i < menugroupTableFields.length; i++) {
	        if (menugroupTableFields[i].showHeader) {
	          $(headerRow).append($('<td width="' + menugroupTableFields[i].width + '" align="center"><b>' + menugroupTableFields[i].displayName + '</b></td>'));
	        }
				}
				$(headerRow).append($('<td width="*" align="center"><b>คำสั่ง</b></td>'));
				$(menuitemTable).append($(headerRow));

				let unRenderCount = 0;

	      for (let x=0; x < menuitemItems.length; x++) {
					let item = menuitemItems[x];
					let stockingOption = item.StockingOption;
					let isRendeItem = (!stockFilter) || (!stockingOption) || ((stockFilter) && (parseInt(stockingOption) == 1));
					if (isRendeItem) {
						let itemRow = $('<tr class="menuitem-row"></tr>');
						$(itemRow).append($('<td align="center">' + (x + 1 - unRenderCount) + '</td>'));
						for (let i=0; i < menuitemTableFields.length; i++) {
							let field = $('<td align="' + menuitemTableFields[i].align + '"></td>');
							if (menuitemTableFields[i].fieldName !== 'MenuPicture') {
								if (menuitemTableFields[i].fieldName !== 'StockingOption') {
									$(field).text(item[menuitemTableFields[i].fieldName]);
								} else {
									let stockStateText = $('<div></div>');
									if (parseInt(stockingOption) == 0) {
										$(stockStateText).text('ไม่ตัดสต็อค');
										$(field).append($(stockStateText));
									} else if (parseInt(stockingOption) == 1) {
										$(stockStateText).text('ตัดสต็อค');
										$(field).append($(stockStateText));
										let stockInCmd = doCreateStockInCmd(shopData, workAreaBox, item);
										let checkStockCmd = doCreateCheckStockCmd(shopData, workAreaBox, item, itemRow);
										$(field).append($(stockInCmd)).append($(checkStockCmd).css({'margin-left': '4px'}));
									}
								}
								$(itemRow).append($(field));
							} else {
								let menuitemLogoIcon = new Image();
								menuitemLogoIcon.id = 'MenuPicture_' + item.id;
								if ((item['MenuPicture']) && (item['MenuPicture'] !== '')) {
									menuitemLogoIcon.src = item['MenuPicture'];
								} else {
									menuitemLogoIcon.src = '/shop/favicon.ico'
								}
								$(menuitemLogoIcon).css({"width": "80px", "height": "auto", "cursor": "pointer", "padding": "2px", "border": "2px solid #ddd"});
								$(menuitemLogoIcon).on('click', (evt)=>{
									window.open(item['MenuPicture'], '_blank');
								});

								let menuItemLogoIconBox = $('<div></div>').css({"position": "relative", "width": "fit-content", "border": "2px solid #ddd"});
						    $(menuItemLogoIconBox).append($(menuitemLogoIcon));
								let editMenuItemLogoCmd = $('<img src="../../images/tools-icon-wh.png"/>').css({'position': 'absolute', 'width': '25px', 'height': 'auto', 'cursor': 'pointer', 'right': '2px', 'bottom': '2px', 'display': 'none', 'z-index': '21'});
								$(editMenuItemLogoCmd).attr('title', 'เปลี่ยนภาพใหม่');
								$(menuItemLogoIconBox).append($(editMenuItemLogoCmd));
								$(menuItemLogoIconBox).hover(()=>{
									$(editMenuItemLogoCmd).show();
								},()=>{
									$(editMenuItemLogoCmd).hide();
								});
								$(editMenuItemLogoCmd).on('click', (evt)=>{
									evt.stopPropagation();
									doStartUploadPicture(evt, menuitemLogoIcon, field, item.id, shopData, workAreaBox, groupId);
								});
								$(field).append($(menuItemLogoIconBox));

								let clearMenuitemLogoCmd = $('<input type="button" value=" เคลียร์รูป " class="action-btn"/>');
								$(clearMenuitemLogoCmd).on('click', async (evt)=>{
									let callRes = await common.doCallApi('/api/shop/menuitem/change/logo', {data: {MenuPicture: ''}, id: item.id});
									menuitemLogoIcon.src = '/shop/favicon.ico'
								});
								$(field).append($('<div style="width: 100%;"></div>').append($(clearMenuitemLogoCmd)));
								$(itemRow).append($(field));
							}
						}
		        for (let i=0; i < menugroupTableFields.length; i++) {
		          let field = $('<td align="' + menugroupTableFields[i].align + '"></td>');
							if ((item.menugroup.GroupPicture) && (item.menugroup.GroupPicture !== '')) {
								let menuGroupLogoIconBox = $('<div></div>').css({"position": "relative", "width": "fit-content", "border": "2px solid #ddd"});
								let groupLogoImg = new Image();
								groupLogoImg.src = item.menugroup.GroupPicture;
								$(groupLogoImg).attr('title', item.menugroup[menugroupTableFields[i].fieldName]);
								$(groupLogoImg).css({"width": "80px", "height": "auto"})
								$(menuGroupLogoIconBox).append($(groupLogoImg));
								$(field).append($(menuGroupLogoIconBox));
							}
		          $(field).append($('<div style="position: relative; display: block;">' + item.menugroup[menugroupTableFields[i].fieldName] + '</div>'));
		          $(itemRow).append($(field));
		        }

						let qrcodeImg = new Image();
						qrcodeImg.id = 'MenuQRCode_' + item.id;
						if ((item.QRCodePicture) && (item.QRCodePicture != '')) {
							let qrLink = '/shop/img/usr/qrcode/' + item.QRCodePicture + '.png';
			      	qrcodeImg.src = qrLink;
							// open dialog for print qrcode
							$(qrcodeImg).attr('title', 'พิมพ์คิวอาร์โค้ดรายการนี้');
							$(qrcodeImg).css({'width': '55px', 'height': 'auto', 'cursor': 'pointer'});
							$(qrcodeImg).on('click', (evt)=>{
								doOpenQRCodePopup(evt, item.id, item.QRCodePicture, qrLink);
							});
						} else {
							qrcodeImg.src = '../../images/scan-qrcode-icon.png';
							$(qrcodeImg).attr('title', 'สร้างคิวอาร์โค้ดให้รายการนี้');
							$(qrcodeImg).css({'width': '45px', 'height': 'auto', 'cursor': 'pointer'});
							// generate new qrcode
							$(qrcodeImg).on('click', async (evt)=>{
								await doCreateNewQRCode(evt, item.id);
							});
						}
						let menuitemQRCodeBox = $('<div></div>').css({'text-align': 'center'}).append($(qrcodeImg));

						let editMenuitemCmd = $('<input type="button" value=" Edit " class="action-btn"/>');
						$(editMenuitemCmd).on('click', (evt)=>{
							doOpenEditMenuitemForm(shopData, workAreaBox, item, groupId);
						});
						let deleteMenuitemCmd = $('<input type="button" value=" Delete " class="action-btn"/>').css({'margin-left': '8px'});
						$(deleteMenuitemCmd).on('click', (evt)=>{
							doDeleteMenuitem(shopData, workAreaBox, item.id, groupId);
						});
						let menuitemBtnBox = $('<div></div>').css({'text-align': 'center'}).append($(editMenuitemCmd)).append($(deleteMenuitemCmd));

						let commandCell = $('<td id="CommandCell" align="center"></td>');
						$(commandCell).append($(menuitemQRCodeBox));
						$(commandCell).append($(menuitemBtnBox));
						$(itemRow).append($(commandCell));
						$(menuitemTable).append($(itemRow));
					} else {
						unRenderCount += 1;
					}
				}
			}

			doRenderMenuitemTable();

      $(workAreaBox).append($(menuitemTable));
      resolve();
    });
  }

  const doStartUploadPicture = function(evt, menuitemLogoIcon, imageBox, itemId, shopData, workAreaBox, groupId){
    let fileBrowser = $('<input type="file"/>');
    $(fileBrowser).attr("name", 'menuitemlogo');
    $(fileBrowser).attr("multiple", true);
    $(fileBrowser).css('display', 'none');
    $(fileBrowser).on('change', function(e) {
      const defSize = 10000000;
      var fileSize = e.currentTarget.files[0].size;
      var fileType = e.currentTarget.files[0].type;
      if (fileSize <= defSize) {
        doUploadImage(fileBrowser, menuitemLogoIcon, fileType, itemId, shopData, workAreaBox, groupId);
      } else {
        $(imageBox).append($('<span>' + 'File not excess ' + defSize + ' Byte.' + '</span>'));
      }
    });
    $(fileBrowser).appendTo($(imageBox));
    $(fileBrowser).click();
  }

  const doUploadImage = function(fileBrowser, menuitemLogoIcon, fileType, itemId, shopData, workAreaBox, groupId){
    var uploadUrl = '/api/shop/upload/menuitemlogo';
		//$('body').loading('start');
    $(fileBrowser).simpleUpload(uploadUrl, {
      success: async function(data){
        $(fileBrowser).remove();
        let shopRes = await common.doCallApi('/api/shop/menuitem/change/logo', {data: {MenuPicture: data.link}, id: itemId});
        setTimeout(async() => {
          await doShowMenuitemItem(shopData, workAreaBox, groupId);
					$('body').loading({message: undefined});
					$('body').loading('stop');
        }, 400);
      },
			progress: function(progress){
				$('body').loading({message: Math.round(progress) + ' %'});
			}
			//https://www.npmjs.com/package/jquery-simple-upload
    });
  }

  const doCreateNewMenuitemForm = function(menuitemData, groupId){
    let menuitemFormTable = $('<table width="100%" cellspacing="0" cellpadding="0" border="1"></table>');
		for (let i=0; i < menuitemTableFields.length; i++) {
      if (menuitemTableFields[i].fieldName !== 'MenuPicture') {
  			let fieldRow = $('<tr></tr>');
  			let labelField = $('<td width="40%" align="left">' + menuitemTableFields[i].displayName + (menuitemTableFields[i].verify?' <span style="color: red;">*</span>':'') + '</td>').css({'padding': '5px'});
  			let inputField = $('<td width="*" align="left"></td>').css({'padding': '5px'});
  			let inputValue = undefined;
				if (menuitemTableFields[i].fieldName === 'StockingOption') {
					inputValue = doCreateStockOptionSelect();
				} else {
					inputValue = $('<input type="text" id="' + menuitemTableFields[i].fieldName + '" size="' + menuitemTableFields[i].inputSize + '"/>');
				}
  			if ((menuitemData) && (menuitemData[menuitemTableFields[i].fieldName])) {
  				$(inputValue).val(menuitemData[menuitemTableFields[i].fieldName]);
  			}
  			$(inputField).append($(inputValue));
  			$(fieldRow).append($(labelField));
  			$(fieldRow).append($(inputField));
  			$(menuitemFormTable).append($(fieldRow));
      }
		}
		if ((menuitemData) && (menuitemData.Qty)) {
    	let fieldRow = $('<tr></tr>');
			let labelField = $('<td width="40%" align="left">จำนวน <span style="color: red;">*</span></td>').css({'padding': '5px'});
			let inputField = $('<td width="*" align="left"></td>').css({'padding': '5px'});
			let inputValue = $('<input type="number" id="Qty" size="10"/>');
			$(inputValue).val(menuitemData.Qty);
			$(inputField).append($(inputValue));
			$(fieldRow).append($(labelField));
			$(fieldRow).append($(inputField));
			$(menuitemFormTable).append($(fieldRow));
		}

		let fieldRow = $('<tr></tr>');
		let labelField = $('<td width="40%" align="left">กลุ่มเมนู <span style="color: red;">*</span></td>').css({'padding': '5px'});
		let inputField = $('<td width="*" align="left"></td>').css({'padding': '5px'});
		let inputValue = $('<select id="GroupId"></select>');
		let menugroups = JSON.parse(localStorage.getItem('menugroups'));
		let firstGroupId = undefined;
		menugroups.forEach((item, i) => {
			$(inputValue).append($('<option value="' + item.Value + '">' + item.DisplayText + '</option>'));
			if (i == 0) {
				firstGroupId = item.Value;
			}
		});
		$(inputField).append($(inputValue));
		$(fieldRow).append($(labelField));
		$(fieldRow).append($(inputField));
		$(menuitemFormTable).append($(fieldRow));

		if (groupId) {
			$(inputValue).val(groupId);
		} else if ((menuitemData) && (menuitemData.menugroupId)){
			$(inputValue).val(menuitemData.menugroupId);
		} else {
			$(inputValue).val(firstGroupId);
		}

		return $(menuitemFormTable);
  }

  const doVerifyMenuitemForm = function(){
    let isVerify = true;
		let menuitemDataForm = {};
		for (let i=0; i < menuitemTableFields.length; i++) {
			let curValue = $('#'+menuitemTableFields[i].fieldName).val();
			if (menuitemTableFields[i].verify) {
				if (curValue !== '') {
					$('#'+menuitemTableFields[i].fieldName).css({'border': ''});
					menuitemDataForm[menuitemTableFields[i].fieldName] = curValue;
					isVerify = isVerify && true;
				} else {
					$('#'+menuitemTableFields[i].fieldName).css({'border': '1px solid red'});
					isVerify = isVerify && false;
					return;
				}
			} else {
				if (curValue !== '') {
					menuitemDataForm[menuitemTableFields[i].fieldName] = curValue;
					isVerify = isVerify && true;
				}
			}
		}
		menuitemDataForm.Qty = $('#Qty').val();
    menuitemDataForm.menugroupId = $('#GroupId').val();
		return menuitemDataForm;
  }

  const doOpenNewMenuitemForm = function(shopData, workAreaBox, groupId){
    let newMenuitemForm = doCreateNewMenuitemForm({menugroupId: groupId}, groupId);
    let radNewMenuitemFormBox = $('<div></div>');
    $(radNewMenuitemFormBox).append($(newMenuitemForm));
    const newmenuitemformoption = {
      title: 'เพิ่มเมนูใหม่เข้าร้าน',
      msg: $(radNewMenuitemFormBox),
      width: '520px',
      onOk: async function(evt) {
        let newMenuitemFormObj = doVerifyMenuitemForm();
        if (newMenuitemFormObj) {
          let hasValue = newMenuitemFormObj.hasOwnProperty('MenuName');
          if (hasValue){
            newMenuitemFormBox.closeAlert();
						let params = {data: newMenuitemFormObj, shopId: shopData.id, groupId: newMenuitemFormObj.groupId};
            let menuitemRes = await common.doCallApi('/api/shop/menuitem/add', params);
            if (menuitemRes.status.code == 200) {
              $.notify("เพิ่มรายการสินค้าสำเร็จ", "success");
              await doShowMenuitemItem(shopData, workAreaBox, groupId)
            } else if (menuitemRes.status.code == 201) {
              $.notify("ไม่สามารถเพิ่มรายการสินค้าได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "warn");
            } else {
              $.notify("เกิดข้อผิดพลาด ไม่สามารถเพิ่มรายการสินค้าได้", "error");
            }
          }else {
            $.notify("ข้อมูลไม่ถูกต้อง", "error");
          }
        } else {
          $.notify("ข้อมูลไม่ถูกต้อง", "error");
        }
      },
      onCancel: function(evt){
        newMenuitemFormBox.closeAlert();
      }
    }
    let newMenuitemFormBox = $('body').radalert(newmenuitemformoption);
  }

  const doOpenEditMenuitemForm = function(shopData, workAreaBox, menuitemData, groupId){
    let editMenuitemForm = doCreateNewMenuitemForm(menuitemData, groupId);
		let radEditMenuitemFormBox = $('<div></div>');
		$(radEditMenuitemFormBox).append($(editMenuitemForm));
		const editmenuitemformoption = {
			title: 'แก้ไขเมนูของร้าน',
			msg: $(radEditMenuitemFormBox),
			width: '520px',
			onOk: async function(evt) {
				let editMenuitemFormObj = doVerifyMenuitemForm();
				if (editMenuitemFormObj) {
					let hasValue = editMenuitemFormObj.hasOwnProperty('MenuName');
					if (hasValue){
						editMenuitemFormBox.closeAlert();
						let params = {data: editMenuitemFormObj, id: menuitemData.id};
						let menuitemRes = await common.doCallApi('/api/shop/menuitem/update', params);
						if (menuitemRes.status.code == 200) {
							$.notify("แก้ไขรายการสินค้าสำเร็จ", "success");
							await doShowMenuitemItem(shopData, workAreaBox, groupId)
						} else if (menuitemRes.status.code == 201) {
							$.notify("ไม่สามารถแก้ไขรายการสินค้าได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "warn");
						} else {
							$.notify("เกิดข้อผิดพลาด ไม่สามารถแก้ไขรายการสินค้าได้", "error");
						}
					}else {
						$.notify("ข้อมูลไม่ถูกต้อง", "error");
					}
				} else {
					$.notify("ข้อมูลไม่ถูกต้อง", "error");
				}
			},
			onCancel: function(evt){
				editMenuitemFormBox.closeAlert();
			}
		}
		let editMenuitemFormBox = $('body').radalert(editmenuitemformoption);
  }

  const doDeleteMenuitem = function(shopData, workAreaBox, menuitemId, groupId){
    let radConfirmMsg = $('<div></div>');
		$(radConfirmMsg).append($('<p>คุณต้องการลบเมนูรายการที่เลือกออกจากร้าน ใช่ หรือไม่</p>'));
		$(radConfirmMsg).append($('<p>คลิกปุ่ม <b>ตกลง</b> หาก <b>ใช่</b> เพื่อลบเมน</p>'));
		$(radConfirmMsg).append($('<p>คลิกปุ่ม <b>ยกเลิก</b> หาก <b>ไม่ใช่</b></p>'));
		const radconfirmoption = {
			title: 'โปรดยืนยันการลบเมนู',
			msg: $(radConfirmMsg),
			width: '420px',
			onOk: async function(evt) {
				radConfirmBox.closeAlert();
				let menuitemRes = await common.doCallApi('/api/shop/menuitem/delete', {id: menuitemId});
				if (menuitemRes.status.code == 200) {
					$.notify("ลบรายการสินค้าสำเร็จ", "success");
					await doShowMenuitemItem(shopData, workAreaBox, groupId);
				} else if (menuitemRes.status.code == 201) {
					$.notify("ไม่สามารถลบรายการสินค้าได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "warn");
				} else {
					$.notify("เกิดข้อผิดพลาด ไม่สามารถลบรายการสินค้าได้", "error");
				}
			},
			onCancel: function(evt){
				radConfirmBox.closeAlert();
			}
		}
		let radConfirmBox = $('body').radalert(radconfirmoption);
  }

	const doOpenQRCodePopup = function(evt, menuId, qrCodeName, qrLink) {
		 printJS(qrLink, 'image');
	}

	const doCreateNewQRCode = function(evt, menuId) {
		return new Promise(async function(resolve, reject) {
			let callUrl = '/api/shop/menuitem/qrcode/create/' + menuId;
			let qrRes = await common.doCallApi(callUrl, {id: menuId});
			let qrcodeImg = evt.currentTarget;
			qrcodeImg.src = qrRes.qrLink;
			$(qrcodeImg).attr('title', 'พิมพ์คิวอาร์โค้ดรายการนี้');
			$(qrcodeImg).css({'width': '55px', 'height': 'auto', 'cursor': 'pointer'});
			$(qrcodeImg).on('click', (evt)=>{
				doOpenQRCodePopup(evt, menuId, qrRes.qrName, qrRes.qrLink);
			});
			resolve(qrRes);
		});
	}


  return {
    doShowMenuitemItem,
		doCreateNewMenuitemForm,
		doVerifyMenuitemForm
  }
}
