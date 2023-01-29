module.exports = function ( jq ) {
	const $ = jq;

  const fileUploadMaxSize = 10000000;

	const shopSensitives = [6];

	const fmtStr = function (str) {
	  var args = [].slice.call(arguments, 1);
	  var i = 0;
	  return str.replace(/%s/g, () => args[i++]);
	}

  const doCallApi = function(apiUrl, rqParams) {
    return new Promise(function(resolve, reject) {
      $('body').loading('start');
      $.post(apiUrl, rqParams, function(data){
        resolve(data);
        $('body').loading('stop');
      }).fail(function(error) {
        reject(error);
        $('body').loading('stop');
      });
    });
  }

  const doGetApi = function(apiUrl, rqParams) {
    return new Promise(function(resolve, reject) {
      $('body').loading('start');
      $.get(apiUrl, rqParams, function(data){
        resolve(data);
        $('body').loading('stop');
      }).fail(function(error) {
        reject(error);
        $('body').loading('stop');
      });
    });
  }

	const doUserLogout = function() {
	  localStorage.removeItem('token');
		localStorage.removeItem('userdata');
		localStorage.removeItem('customers');
		localStorage.removeItem('menugroups');
		localStorage.removeItem('menuitems');
		localStorage.removeItem('changelogs');
		sessionStorage.removeItem('logged');
	  let url = '/shop/index.html';
	  window.location.replace(url);
	}

	const doFormatNumber = function(num){
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
    return Number(num).toLocaleString('en', options);
  }

	const doFormatQtyNumber = function(num){
	  if ((Number(num) === num) && (num % 1 !== 0)) {
	    return doFormatNumber(num);
	  } else {
	    return Number(num);
	  }
	}

	const doFormatDateStr = function(d) {
		var yy, mm, dd;
		yy = d.getFullYear();
		if (d.getMonth() + 1 < 10) {
			mm = '0' + (d.getMonth() + 1);
		} else {
			mm = '' + (d.getMonth() + 1);
		}
		if (d.getDate() < 10) {
			dd = '0' + d.getDate();
		} else {
			dd = '' + d.getDate();
		}
		var td = `${yy}-${mm}-${dd}`;
		return td;
	}

	const doFormatTimeStr = function(d) {
		var hh, mn, ss;
		if (d.getHours() < 10) {
			hh = '0' + d.getHours();
		} else {
			hh = '' + d.getHours();
		}
		if (d.getMinutes() < 10) {
			mn = '0' + d.getMinutes();
		} else {
			mn = '' + d.getMinutes();
		}
		ss = d.getSeconds();
		var td = `${hh}.${mn}`;
		return td;
	}

	const doCreateImageCmd = function(imageUrl, title) {
    let imgCmd = $('<img src="' + imageUrl + '"/>').css({'width': '35px', 'height': 'auto', 'cursor': 'pointer', 'border': '2px solid #ddd'});
    $(imgCmd).hover(()=>{
			$(imgCmd).css({'border': '2px solid grey'});
		},()=>{
			$(imgCmd).css({'border': '2px solid #ddd'});
		});
		if (title) {
			$(imgCmd).attr('title', title);
		}
    return $(imgCmd)
  }

	const doCreateTextCmd = function(text, bgcolor, textcolor, bordercolor, hovercolor) {
    let textCmd = $('<span></span>').css({/*'min-height': '35px', 'line-height': '30px',*/ 'cursor': 'pointer', 'border-radius': '4px', 'padding': '4px', 'text-align': 'center', 'font-size': '16px'});
		$(textCmd).text(text);
		$(textCmd).css({'background-color': bgcolor, 'color': textcolor});
		if (bordercolor){
			$(textCmd).css({'border': '2px solid ' + bordercolor});
		} else {
			$(textCmd).css({'border': '2px solid #ddd'});
		}
		if ((bordercolor) && (hovercolor)) {
			$(textCmd).hover(()=>{
				$(textCmd).css({'border': '2px solid ' + hovercolor});
			},()=>{
				$(textCmd).css({'border': '2px solid ' + bordercolor});
			});
		} else {
    	$(textCmd).hover(()=>{
				$(textCmd).css({'border': '2px solid grey'});
			},()=>{
				$(textCmd).css({'border': '2px solid #ddd'});
			});
		}
    return $(textCmd)
  }

	const delay = function(ms) {
  	return new Promise(resolve => setTimeout(resolve, ms));
	}

	const calendarOptions = {
		lang: "th",
		years: "2020-2030",
		sundayFirst: true,
	};

	const genUniqueID = function () {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + s4() + '-' + s4();
	}

	const isExistsResource = function(url) {
    if(url){
      var req = new XMLHttpRequest();
      req.open('GET', url, false);
      req.send();
      return req.status==200;
    } else {
      return false;
    }
	}

	const doCreateReportDocButtonCmd = function(text, textCmdCallback, qrCmdCallback) {
		let reportDocButtonBox = $('<div></div>').css({'width': '100%', 'background-color': 'white', 'color': 'black', 'text-align': 'left', 'cursor': 'pointer', 'z-index': '210', 'line-height': '30px'});
		let openReportDocCmd = $('<span>' + text + '</span>').css({'font-weight': 'bold', 'margin-left': '5px'});
		$(openReportDocCmd).on('click', (evt)=>{
			evt.stopPropagation();
			textCmdCallback(evt);
		});
		let openReportQrCmd = $('<img src="/shop/img/usr/myqr.png"/>').css({'position': 'absolute', 'margin-left': '8px', 'margin-top': '2px', 'width': '25px', 'height': 'auto'});
		$(openReportQrCmd).on('click', (evt)=>{
			evt.stopPropagation();
			qrCmdCallback(evt);
		});
		return $(reportDocButtonBox).append($(openReportDocCmd)).append($(openReportQrCmd));
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

	const doResetSensitiveWord = function(words){
    return new Promise(async function(resolve, reject) {
			await words.forEach((word, i) => {
				if ($('#' + word.elementId).hasClass('sensitive-word')) {
					$('#' + word.elementId).text(word.customWord);
				}
			});
			resolve();
    });
  }

	const doConnectWebsocketMaster = function(username, usertype, shopId, connecttype){
	  const hostname = window.location.hostname;
		const protocol = window.location.protocol;
	  const port = window.location.port;
	  const paths = window.location.pathname.split('/');
	  const rootname = paths[1];

		let wsUrl = 'wss://radconnext.tech/' + username + '/' + shopId + '?type=' + connecttype;
		//let wsUrl = 'wss://localhost:4443/' + username + '/' + shopId + '?type=' + connecttype;
	  const wsm = new WebSocket(wsUrl);
		wsm.onopen = function () {
			//console.log('Master Websocket is connected to the signaling server')
		};

		wsm.onclose = function(event) {
			//console.log("Master WebSocket is closed now. with  event:=> ", event);
		};

		wsm.onerror = function (err) {
		   console.log("Master WS Got error", err);
		};

		//console.log(usertype);

		/*
		if ((usertype == 1) || (usertype == 2) || (usertype == 3)) {
			const wsmMessageHospital = require('./websocketmessage.js')($, wsm);
			wsm.onmessage = wsmMessageHospital.onMessageHospital;
		} else if (usertype == 4) {
			const wsmMessageRedio = require('../../radio/mod/websocketmessage.js')($, wsm);
			wsm.onmessage = wsmMessageRedio.onMessageRadio;
		} else if (usertype == 5) {
			const wsmMessageRefer = require('../../refer/mod/websocketmessage.js')($, wsm);
			wsm.onmessage = wsmMessageRefer.onMessageRefer;
		}
		*/

		const wsmMessageShop = require('./websocketmessage.js')($, wsm);
		wsm.onmessage = wsmMessageShop.onMessageShop;

		return wsm;
	}

	const doRenderEvtLogBox = function(foundItems){
		let logBox = $('<div></div>').css({'width': '100%', 'margin-top': '20px', 'padding': '5px'});
		for (let i=0; i < foundItems.length; i++) {
			let evtBox = $('<div></div>').css({'width': '95%', 'padding': '5px', 'border': '2px solid #dddd'});
			let foundItem = foundItems[i];
			let d = new Date(foundItem.date);
			let dd = doFormatDateStr(d);
			let tt = doFormatTimeStr(d);
			let diffItems = foundItem.diffItems;
			if (diffItems.upItems.length > 0) {
				$(evtBox).append($('<p><b>รายการเพิ่มมาใหม่ [' + dd + ' ' + tt +']</b></p>'));
				for (let x=0; x < diffItems.upItems.length; x++) {
					let evtMessageLine = fmtStr('%s. %s จำนวน <span class="qty">%s</span> %s', (x+1), diffItems.upItems[x].MenuName, doFormatNumber(Number(diffItems.upItems[x].Qty)), diffItems.upItems[x].Unit);
					$(evtBox).append($('<p></p>').html(evtMessageLine));
					$(evtBox).find('.qty').css({'min-width': '20px', 'background-color': 'grey', 'color': 'white', 'padding': '2px'});
					let deleteEvtCmd = $('<span><b>ลบ</b></span>').css({'margin-left': '10px', 'background-color': 'red', 'color': 'white', 'cursor': 'pointer'});
					$(deleteEvtCmd).on('click', (evt)=>{
						doRemoveChangeLogAt(i, 'upItems', x);
						$(evtBox).remove();
					});
					$(evtBox).append($(deleteEvtCmd));
				}
			}
			if (diffItems.downItems.length > 0) {
				$(evtBox).append($('<p><b>รายการถูกลดออกไป [' + dd + ' ' + tt +']</b></p>'));
				for (let y=0; y < diffItems.downItems.length; x++) {
					let evtMessageLine = fmtStr('%s. %s จำนวน <span class="qty">%s</span> %s', (y+1), diffItems.downItems[y].MenuName, doFormatNumber(Number(diffItems.downItems[y].Qty)), diffItems.downItems[y].Unit);
					$(evtBox).append($('<p></p>').html(evtMessageLine));
					$(evtBox).find('.qty').css({'min-width': '20px', 'background-color': 'grey', 'color': 'white', 'padding': '2px'});
					let deleteEvtCmd = $('<span><b>ลบ</b></span>').css({'margin-left': '10px', 'background-color': 'red', 'color': 'white', 'cursor': 'pointer'});
					$(deleteEvtCmd).on('click', (evt)=>{
						doRemoveChangeLogAt(i, 'downItems', y);
						$(evtBox).remove();
					});
					$(evtBox).append($(deleteEvtCmd));
				}
			}
			if (diffItems.qtys.length > 0) {
				$(evtBox).append($('<p><b>รายการคงอยู่แต่เปลี่ยนจำนวน [' + dd + ' ' + tt +']</b></p>'));
				for (let z=0; z < diffItems.qtys.length; z++) {
					let evtMessageLine = fmtStr('%s. %s จำนวน <span class="qty">%s</span> %s', (z+1), diffItems.qtys[z].MenuName, doFormatNumber(Number(diffItems.qtys[z].diff)), diffItems.qtys[z].Unit);
					$(evtBox).append($('<p></p>').html(evtMessageLine));
					$(evtBox).find('.qty').css({'min-width': '20px', 'background-color': 'grey', 'color': 'white', 'padding': '2px'});
					let deleteEvtCmd = $('<span><b>ลบ</b></span>').css({'margin-left': '10px', 'background-color': 'red', 'color': 'white', 'cursor': 'pointer'});
					$(deleteEvtCmd).on('click', (evt)=>{
						doRemoveChangeLogAt(i, 'qtys', z);
						$(evtBox).remove();
					});
					$(evtBox).append($(deleteEvtCmd));
				}
			}
			$(logBox).append($(evtBox));
		}
		return $(logBox);
	}

	const doPopupOrderChangeLog = async function(orderId) {
		let changelogs = JSON.parse(localStorage.getItem('changelogs'));
		let foundItems = await changelogs.filter((item, i) =>{
			if ((item.orderId == orderId) && (item.status === 'New')) {
				return item;
			}
		});
		let oldItems = await changelogs.filter((item, i) =>{
			if ((item.orderId == orderId) && (item.status === 'Read')) {
				return item;
			}
		});
		if (foundItems.length > 0) {
			let logBox = doRenderEvtLogBox(foundItems);
			let oldItemsBox = undefined;
			let readySwitchBox = $('<div id="ReadyState" style="position: relative; display: inline-block; float: right; margin-top: 15px;"></div>');
			let readyOption = {switchTextOnState: 'ดูทั้งหมด', switchTextOffState: 'ปิดรายการเก่า',
				onActionCallback: ()=>{
					oldItemsBox = doRenderEvtLogBox(oldItems);
					$(oldItemsBox).css({'background-color': '#dddd', 'width': '95%'});
					$(oldItemsBox).insertAfter(readySwitchBox);
					readySwitch.onAction();
				},
				offActionCallback: ()=>{
					$(oldItemsBox).remove();
					readySwitch.offAction();
				}
			};
			let readySwitch = $(readySwitchBox).readystate(readyOption);
			$(logBox).append($(readySwitchBox));

			let logDlgOption = {
				title: 'รายการแก้ไขออร์เดอร์',
				msg: $(logBox),
				width: '480px',
				onOk: async function(evt) {
					await doSetChangeStateLog(orderId);
					dlgHandle.closeAlert();
				},
				onCancel: function(evt){
					dlgHandle.closeAlert();
				}
			}
			let dlgHandle = $('body').radalert(logDlgOption);
			$(dlgHandle.cancelCmd).hide();
			return dlgHandle;
		} else {
			return;
		}
	}

	const doSetChangeStateLog = async function(orderId){
		let changelogs = JSON.parse(localStorage.getItem('changelogs'));
		let newChangelogs = [];
		await changelogs.forEach((item, i) => {
			if ((item.orderId == orderId) && (item.status === 'New')) {
				item.status = 'Read';
				newChangelogs.push(item);
			} else {
				newChangelogs.push(item);
			}
		});
		localStorage.setItem('changelogs', JSON.stringify(newChangelogs));
	}

	const doRemoveChangeLogAt = function(logIndex, diffType, diffIndex){
		let changelogs = JSON.parse(localStorage.getItem('changelogs'));
		changelogs[logIndex].diffItems[diffType].splice(diffIndex, 1);
		localStorage.setItem('changelogs', JSON.stringify(changelogs));
	}

	const isMobileDeviceCheck = function(){
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
			|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
			return true;
		} else {
			return false;
		}
	}

	const findCutoffDateFromDateOption = function(dUnit) {
    let d = dUnit.substring(0, dUnit.length - 1);
    let u = dUnit.substring(dUnit.length - 1);
    let now = new Date();
    if (u === 'D') {
      return now.setDate(now.getDate() - parseInt(d));
    } else if (u === 'M') {
      return now.setMonth(now.getMonth() - parseInt(d));
    } else if (u === 'Y') {
      return now.setFullYear(now.getFullYear() - parseInt(d));
    }
  }

  return {
		fileUploadMaxSize,
		shopSensitives,
		fmtStr,
    doCallApi,
    doGetApi,
		doUserLogout,
		doFormatNumber,
		doFormatQtyNumber,
		doFormatDateStr,
		doFormatTimeStr,
		doCreateImageCmd,
		doCreateTextCmd,
		delay,
		calendarOptions,
		genUniqueID,
		isExistsResource,
		doCreateReportDocButtonCmd,
		doCalOrderTotal,
		doResetSensitiveWord,
		doConnectWebsocketMaster,
		doPopupOrderChangeLog,
		isMobileDeviceCheck,
		findCutoffDateFromDateOption
	}
}
