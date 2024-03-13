module.exports = function ( jq ) {
	const $ = jq;

  const common = require('../../../home/mod/common-lib.js')($);

	const jqteConfig = {format: false, fsize: false, ol: false, ul: false, indent: false, outdent: false,
		link: true, unlink: true, remove: true, /*br: false,*/ strike: false, rule: false,
		sub: false, sup: false, left: true, center: true, right: true /*, source: false
		change: onSimpleEditorChange */
	};

	const doCreateTitlePage = function(shopData) {
		let titlePageBox = $('<div style="padding: 4px;"></viv>').css({'width': '99.25%', 'height': '45px', 'text-align': 'center', 'font-size': '22px', 'border': '2px solid black', 'border-radius': '5px', 'background-color': 'grey', 'color': 'white'});
		$(titlePageBox).text('รายการข้อความข่าวสารของร้าน');
		return $(titlePageBox);
	}

	const doCreateMessagesTable = function(shopData, loadUrl) {
		return new Promise(async function(resolve, reject) {
			let userdata = JSON.parse(localStorage.getItem('userdata'));
			let myMessageUrl = undefined;
			if ((loadUrl) && (loadUrl !== '')) {
				myMessageUrl = loadUrl;
			} else {
				myMessageUrl = '/api/shop/message/shop/load/' + shopData.id
			}
			let params = {shopId: shopData.id};
			let msgRes = await common.doCallApi(myMessageUrl, params);
			console.log(msgRes);
			let msgTable = $('<table width="100%" cellspacing="0" cellpadding="0" border="1"></table>');
			let dataRow = $('<tr style="background-color: lightgrey"></tr>');
			let datetimeCell = $('<td width="20%" align="center"><b>วันที่-เวลา</b></td>');
			let msgCell = $('<td width="50%" align="center"><b>ข้อความ/ข่าวสาร</b></td>');
			let fromCell = $('<td width="10%" align="center"><b>จาก</b></td>');
			let statusCell = $('<td width="*" align="center"><b>สถานะข้อความ</b></td>');
			$(dataRow).append($(datetimeCell)).append($(msgCell)).append($(fromCell)).append($(statusCell));
			$(msgTable).append($($(dataRow)));
			for (let i=0; i<msgRes.Records.length; i++) {
				let msg = msgRes.Records[i];
				let msgDate = new Date(msg.createdAt);
				let fmtDate = common.doFormatDateStr(msgDate);
				let fmtTime = common.doFormatTimeStr(msgDate);

				let fmUserFullname = undefined;
				if ((msg.userinfo.User_NameTH !== '') && (msg.userinfo.User_LastNameTH !== '')) {
					fmUserFullname = msg.userinfo.User_NameTH + ' ' + msg.userinfo.User_LastNameTH;
				} else {
					fmUserFullname = msg.userinfo.User_NameEN + ' ' + msg.userinfo.User_LastNameEN;
				}

				let msgStatus = undefined;
				if (msg.Status == 1) {
					msgStatus = 'New';
					doUpdateMessageOpen(shopData, msg);
				} else if (msg.Status == 2) {
					msgStatus = 'Open';
				} else if (msg.Status == 3) {
					msgStatus = 'Close';
				}
				datetimeCell = $('<td align="left"></td>').text(fmtDate + ' : ' + fmtTime);
				msgCell = $('<td align="left"></td>').html(msg.Message);
				fromCell = $('<td align="left"></td>').text(fmUserFullname);
				statusCell = $('<td align="center"></td>').append($('<span>' + msgStatus + '</span>'));

				if ((userdata.id == 1) && (userdata.shopId == 1)) {
					let editMessageCmd = common.doCreateTextCmd('แก้ไข', 'blue', 'white');
					$(editMessageCmd).on('click', async(evt)=>{
						await doOpenUpdateMessageForm(shopData, msg)
					});
					let deleteMessageCmd = common.doCreateTextCmd('ลบ', 'red', 'white');
					$(deleteMessageCmd).on('click', (evt)=>{
						doDeleteMessage(shopData, msg);
					});

					$(statusCell).append($(editMessageCmd).css({'margin-left': '5px'})).append($(deleteMessageCmd).css({'margin-left': '5px'}));

					if ((msg.Status == 2) || (msg.Status == 3)) {
						let resetMessageCmd = common.doCreateTextCmd('รีเซ็ต', 'green', 'white');
						$(resetMessageCmd).on('click', (evt)=>{
							doResetMessage(shopData, msg);
						});
						$(statusCell).append($(resetMessageCmd).css({'margin-left': '5px'}));
					}
				}

				if (msg.Status == 2) {
					let closeMessageCmd = common.doCreateTextCmd('ปิด', 'black', 'white');
					$(closeMessageCmd).on('click', (evt)=>{
						doCloseMessage(shopData, msg);
					});
					$(statusCell).append($(closeMessageCmd).css({'margin-left': '5px'}))
				}

				dataRow = $('<tr height="50"></tr>');
				$(dataRow).append($(datetimeCell)).append($(msgCell)).append($(fromCell)).append($(statusCell));
				$(msgTable).append($($(dataRow)));
			}
			resolve($(msgTable));
		});
	}

  const doShowMyMesaage = function(shopData, workAreaBox) {
    return new Promise(async function(resolve, reject) {
			let userdata = JSON.parse(localStorage.getItem('userdata'));
      $(workAreaBox).empty();
			let titleBox = doCreateTitlePage(shopData);
			$(workAreaBox).append($(titleBox));
			if ((userdata.id == 1) && (userdata.shopId == 1)) {
				let addNewMessageCmd = common.doCreateTextCmd('สร้างข้อความใหม', 'green', 'white');
				$(addNewMessageCmd).on('click', (evt)=>{
					doOpenNewMessageForm(shopData);
				});
				let showAllMessageCmd = common.doCreateTextCmd('แสดงข้อความทั้งหมด', 'grey', 'white');
				$(showAllMessageCmd).on('click', async (evt)=>{
					$(msgTable).remove();
					let loadAllMessageUrl = '/api/shop/message/shop/loadall/' + shopData.id
					msgTable = await doCreateMessagesTable(shopData, loadAllMessageUrl);
					$(workAreaBox).append($(msgTable).css({'margin-top': '5px'}));
				});
				let addNewMessageBar = $('<div></div>').css({'position': 'relative', 'width': '100%', 'text-align': 'right', 'margin-top': '10px'});
				$(addNewMessageBar).append($(showAllMessageCmd)).append($(addNewMessageCmd).css({'margin-left': '5px'}));
				$(workAreaBox).append($(addNewMessageBar));
			}
			let msgTable = await doCreateMessagesTable(shopData);
			$(workAreaBox).append($(msgTable).css({'margin-top': '5px'}));
			$('#App').find('#SummaryBox').remove();
      resolve();
    });
  }

	const doCreateNewMessageForm = async function(shopData, oldMessage) {
		return new Promise(async function(resolve, reject) {
			let shopListUrl = '/api/shop/shop/options';
			let params = {};
			let shops = await common.doCallApi(shopListUrl, params);
			let shopListSelect = $('<select id="ToShopId"></select>');
			shops.Options.forEach((item, i) => {
				if (oldMessage) {
					if (item.Value == oldMessage.ToShopId) {
						$(shopListSelect).append($('<option></option>').text(item.DisplayText).val(item.Value).prop('selected', true));
					} else {
						$(shopListSelect).append($('<option></option>').text(item.DisplayText).val(item.Value));
					}
				} else {
					$(shopListSelect).append($('<option></option>').text(item.DisplayText).val(item.Value));
				}
			});

			let jqtePluginStyleUrl = '../lib/jqte/jquery-te-1.4.0.css';
			$('head').append('<link rel="stylesheet" href="' + jqtePluginStyleUrl + '" type="text/css" />');
			let jqtePluginScriptUrl = '../lib/jqte/jquery-te-1.4.0.min.js';
			$('head').append('<script src="' + jqtePluginScriptUrl + '"></script>');

			let mainBox = $('<table width="100%" cellspacing="0" cellpadding="4" border="0"></table>');
			let row = $('<tr></tr>');
			let leftCell = $('<td width="25%" align="left">ส่งถึง</td>');
			let rightCell = $('<td width="*" align="left"></td>').append($($(shopListSelect)));
			$(row).append($(leftCell)).append($(rightCell));
			$(mainBox).append($(row));
			row = $('<tr></tr>');
			leftCell = $('<td align="left">ข้อความ</td>');
			rightCell = $('<td align="left"></td>');

			let simpleEditorConfig  = $.extend({}, jqteConfig);
			let simpleEditor = $('<input type="text" id="SimpleEditor"/>');
			$(simpleEditor).appendTo($(rightCell));
			$(simpleEditor).jqte(simpleEditorConfig);

			$(rightCell).find('.jqte_editor').css({ height: '100px', width: '350px' });
			if (oldMessage) {
				$(rightCell).find('#SimpleEditor').jqteVal(oldMessage.Message);
			}
			$(row).append($(leftCell)).append($(rightCell));
			$(mainBox).append($(row));

			resolve($(mainBox));
		});
	}

	const doOpenNewMessageForm = function(shopData) {
		return new Promise(async function(resolve, reject) {
			let messageForm = await doCreateNewMessageForm(shopData);
			$(messageForm).css({'margin-top': '10px'})
			let messageFormDlgOption = {
				title: 'ป้อนข้อมูลเพื่อส่งข้อความใหม่',
				msg: $(messageForm),
				width: '465px',
				onOk: function(evt) {
					let newMessageUrl = '/api/shop/message/add';
					let toShopId = $('#ToShopId').val();
					let message = $('#SimpleEditor').val();
					let userdata = JSON.parse(localStorage.getItem('userdata'));
					let params = {data: {ToShopId: toShopId, Message: message, Status: 1}, shopId: userdata.shopId, userId: userdata.id, userinfoId: userdata.userinfo.id};
					console.log(params);

					common.doCallApi(newMessageUrl, params).then(async(msgRes)=>{
						console.log(msgRes);
						$.notify("ส่งข้อความสำเร็จ", "success");
						dlgHandle.closeAlert();
						let workingAreaBox = $('#WorkingAreaBox');
						await doShowMyMesaage(shopData, workingAreaBox);
					});
				},
				onCancel: function(evt) {
					dlgHandle.closeAlert();
				}
			}
			let dlgHandle = $('body').radalert(messageFormDlgOption);
			resolve();
		});
	}

	const doOpenUpdateMessageForm = function(shopData, oldMessage) {
		return new Promise(async function(resolve, reject) {
			let messageForm = await doCreateNewMessageForm(shopData, oldMessage);
			$(messageForm).css({'margin-top': '10px'});
			let messageFormDlgOption = {
				title: 'แก้ไขข้อความ',
				msg: $(messageForm),
				width: '465px',
				onOk: function(evt) {
					let updateMessageUrl = '/api/shop/message/update';
					//let toShopId = $('#ToShopId').val();
					let message = $('#SimpleEditor').val();
					let userdata = JSON.parse(localStorage.getItem('userdata'));
					let params = {data: {Message: message}, id: oldMessage.id};
					console.log(params);
					common.doCallApi(updateMessageUrl, params).then(async(msgRes)=>{
						console.log(msgRes);
						$.notify("บันทึกการแก้ไขข้อความสำเร็จ", "success");
						dlgHandle.closeAlert();
						let workingAreaBox = $('#WorkingAreaBox');
						await doShowMyMesaage(shopData, workingAreaBox);
					});
				},
				onCancel: function(evt) {
					dlgHandle.closeAlert();
				}
			}
			let dlgHandle = $('body').radalert(messageFormDlgOption);
			$('#ToShopId').prop('disabled', true);
			resolve();
		});
	}

	const doDeleteMessage = function(shopData, msg) {
		let radAlertMsg = $('<div></div>');
		$(radAlertMsg).append($('<p>คุณต้องการลบข้อความ/ข่าวสารใช่ไหม?</p>'));
		const radconfirmoption = {
			title: 'โปรดยืนยันการลบข้อความ/ข่าวสาร',
			msg: $(radAlertMsg),
			width: '320px',
			onOk: function(evt) {
				let deleteMessageUrl = '/api/shop/message/delete';
				let params = {id: msg.id};
				console.log(params);
				common.doCallApi(deleteMessageUrl, params).then(async(msgRes)=>{
					console.log(msgRes);
					$.notify("ลบข้อความสำเร็จ", "success");
					dlgHandle.closeAlert();
					let workingAreaBox = $('#WorkingAreaBox');
					await doShowMyMesaage(shopData, workingAreaBox);
				});
				dlgHandle.closeAlert();
			},
			onCancel: function(evt){
				dlgHandle.closeAlert();
			}
		}
		let dlgHandle = $('body').radalert(radconfirmoption);
	}

	const doCloseMessage = function(shopData, msg) {
		let radAlertMsg = $('<div></div>');
		$(radAlertMsg).append($('<p>คุณต้องการปิดข้อความ/ข่าวสารใช่ไหม?</p>'));
		$(radAlertMsg).append($('<p>ข้อความ/ข่าวสารที่ต้องการปิดจะไม่แสดงในหน้านี้อีกต่อไป</p>'));
		const radconfirmoption = {
			title: 'โปรดยืนยันการปิดข้อความ/ข่าวสาร',
			msg: $(radAlertMsg),
			width: '320px',
			onOk: function(evt) {
				let closeMessageUrl = '/api/shop/message/update';
				let params = {data: {Status: 3}, id: msg.id};
				//console.log(params);
				common.doCallApi(closeMessageUrl, params).then(async(msgRes)=>{
					//console.log(msgRes);
					$.notify("ปิดข้อความแล้ว", "success");
					dlgHandle.closeAlert();
					let workingAreaBox = $('#WorkingAreaBox');
					await doShowMyMesaage(shopData, workingAreaBox);

					let myMessageUrl = '/api/shop/message/month/new/count/' + shopData.id
					params = {userId: userdata.id};
					let countRes = await common.doCallApi(myMessageUrl, params);
					if (countRes.count > 0) {
						$('#MessageAmount').text(countRes.count);
					} else {
						$('#MessageAmount').hide();
					}

				});
				dlgHandle.closeAlert();
			},
			onCancel: function(evt){
				dlgHandle.closeAlert();
			}
		}
		let dlgHandle = $('body').radalert(radconfirmoption);
	}

	const doUpdateMessageOpen = function(shopData, msg) {
		let userdata = JSON.parse(localStorage.getItem('userdata'));
		let closeMessageUrl = '/api/shop/message/update';
		let params = {data: {Status: 2}, id: msg.id};
		//console.log(params);
		common.doCallApi(closeMessageUrl, params).then(async(msgRes)=>{
			//console.log(msgRes);
			let myMessageUrl = '/api/shop/message/month/new/count/' + shopData.id
			params = {userId: userdata.id};
			let countRes = await common.doCallApi(myMessageUrl, params);
			if (countRes.count > 0) {
				$('#MessageAmount').text(countRes.count);
			} else {
				$('#MessageAmount').hide();
			}
		});
	}

	const doResetMessage = function(shopData, msg){
		let userdata = JSON.parse(localStorage.getItem('userdata'));
		let resetMessageUrl = '/api/shop/message/update';
		let params = {data: {Status: 1}, id: msg.id};
		//console.log(params);
		common.doCallApi(resetMessageUrl, params).then(async(msgRes)=>{
			//console.log(msgRes);
			let myMessageUrl = '/api/shop/message/month/new/count/' + shopData.id
			params = {userId: userdata.id};
			let countRes = await common.doCallApi(myMessageUrl, params);
			if (countRes.count > 0) {
				$('#MessageAmount').text(countRes.count);
			} else {
				$('#MessageAmount').hide();
			}
		});
	}

  return {
    doShowMyMesaage
	}
}
