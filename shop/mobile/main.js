/* main.js */

window.$ = window.jQuery = require('jquery');

window.$.ajaxSetup({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
  }
});

const common = require('../home/mod/common-lib.js')($);

const orderMng = require('./mod/order-mng-lib.js')($);
const orderProc = require('./mod/order-proc-lib.js')($);

let pageHandle = undefined;
let wss = undefined;

$( document ).ready(function() {
  const initPage = function() {
    let jqueryUiCssUrl = "../lib/jquery-ui.min.css";
  	let jqueryUiJsUrl = "../lib/jquery-ui.min.js";
  	let jqueryLoadingUrl = '../lib/jquery.loading.min.js';
  	let jqueryNotifyUrl = '../lib/notify.min.js';

    let momentWithLocalesPlugin = "../lib/moment-with-locales.min.js";
    let ionCalendarPlugin = "../lib/ion.calendar.min.js";
    let ionCalendarCssUrl = "../stylesheets/ion.calendar.css";
    let utilityPlugin = "../lib/plugin/jquery-radutil-plugin.js";
    let html5QRCodeUrl = "../lib/html5-qrcode.min.js";
    //let printjs = '../lib/print/print.min.js';

    $('head').append('<script src="' + jqueryUiJsUrl + '"></script>');
  	$('head').append('<link rel="stylesheet" href="' + jqueryUiCssUrl + '" type="text/css" />');
  	//https://carlosbonetti.github.io/jquery-loading/
  	$('head').append('<script src="' + jqueryLoadingUrl + '"></script>');
  	//https://notifyjs.jpillora.com/
  	$('head').append('<script src="' + jqueryNotifyUrl + '"></script>');

    $('head').append('<script src="' + momentWithLocalesPlugin + '"></script>');
    $('head').append('<script src="' + ionCalendarPlugin + '"></script>');
    //$('head').append('<script src="' + printjs + '"></script>');

    $('head').append('<link rel="stylesheet" href="../stylesheets/style.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="../lib/print/print.min.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="../../case/css/scanpart.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="' + ionCalendarCssUrl + '" type="text/css" />');

    $('head').append('<script src="' + utilityPlugin + '"></script>');
    $('head').append('<script src="' + html5QRCodeUrl + '"></script>');

    $('body').append($('<div id="MainBox"></div>').css({'position': 'absolute', 'top': '0px', 'float': 'left', 'right': '0px', 'left': '0px'}));
    $('body').append($('<div id="MenuBox"></div>').css({'display': 'none', 'position': 'fixed', 'z-index': '42', 'left': '0px', 'top': '0px', 'width': '100%;', 'width': '100%', 'height': '100%', 'overflow': 'scroll', 'background-color': 'rgb(240, 240, 240)'}));
    $('body').append($('<div id="overlay"><div class="loader"></div></div>'));

    $('body').loading({overlay: $("#overlay"), stoppable: true});

	};

  let userdata = JSON.parse(localStorage.getItem('userdata'));
  console.log(userdata);
  if ((!userdata) || (userdata == null)) {
    common.doUserLogout();
  } else {
    if (common.shopSensitives.includes(userdata.shopId)) {
      let sensitiveWordJSON = require('../../../api/shop/lib/sensitive-word.json');
      localStorage.setItem('sensitiveWordJSON', JSON.stringify(sensitiveWordJSON))
      sensitiveWordJSON = JSON.parse(localStorage.getItem('sensitiveWordJSON'));
      common.delay(500).then(async ()=>{
        await common.doResetSensitiveWord(sensitiveWordJSON);
      });
    }
    wss = common.doConnectWebsocketMaster(userdata.username, userdata.usertypeId, userdata.shopId, 'shop');
  }

	initPage();

  pageHandle = doCreatePageLayout();
  orderMng.setupPageHandle(pageHandle);
  orderProc.setupPageHandle(pageHandle);

  if (userdata.usertypeId == 5) {
    orderProc.doShowOrderList(userdata.shopId, pageHandle.mainContent);
  } else {
    orderMng.doShowOrderList(userdata.shopId, pageHandle.mainContent);
  }
  $('body').loading('stop');
});

const doCreatePageLayout = function(){
  let toggleMenuCmd = $('<img id="ToggleMenuCmd" src="../../images/bill-icon.png"/>').css({'width': '40px', 'height': 'auto'});
  $(toggleMenuCmd).css({'position': 'fixed', 'top': '1px', 'left': '10px', 'z-index': '49', 'cursor': 'pointer'});
  let mainBox = $('#MainBox');
  $(mainBox).append($(toggleMenuCmd));
  let mainContent = $('<div id="MainContent"></div>').css({'position': 'relative', 'width': '100%'});
  $(mainBox).append($(mainContent));
  let userInfoBox = doCreateUserInfoBox();
  let menuContent = $('<div id="MenuContent"></div>').css({'position': 'relative', 'width': '100%'});
  let menuBox = $('#MenuBox');
  $(menuBox).append($(userInfoBox)).append($(menuContent));
  let timeAnimate = 550;

  $(toggleMenuCmd).on('click', (evt)=>{
    $(menuBox).animate({width: 'toggle'}, timeAnimate);
    if ($(toggleMenuCmd).css('left') == '10px') {
      $(toggleMenuCmd).animate({left: '90%'}, timeAnimate);
      $(toggleMenuCmd).attr('src', '../../images/cross-mark-icon.png');
    } else {
      $(toggleMenuCmd).animate({left: '10px'}, timeAnimate);
      $(toggleMenuCmd).attr('src', '../../images/bill-icon.png');
    }
  });
  let handle = {mainBox, menuBox, toggleMenuCmd, mainContent, menuContent};
  return handle;
}

const doCreateUserInfoBox = function(){
  let userdata = JSON.parse(localStorage.getItem('userdata'));
  let userInfoBox = $('<div></div>').css({'position': 'relative', 'width': '100%', 'text-align': 'center'});
  let userPictureBox = $('<img src="../../images/avatar-icon.png"/>').css({'position': 'relative', 'width': '50px', 'height': 'auto', 'cursor': 'pointer', 'margin-top': '-2px'});
  $(userPictureBox).on('click', (evt)=>{
    $(userInfo).toggle('slow', 'swing', ()=>{
      $(userLogoutCmd).toggle('fast', 'linear');
    });
  });
  let userInfo = $('<div></div>').text(userdata.userinfo.User_NameTH + ' ' + userdata.userinfo.User_LastNameTH).css({'position': 'relative', 'margin-top': '-15px', 'padding': '2px', 'font-size': '14px'});
  let userPPQRTestCmd = $('<div>สร้างพร้อมเพย์คิวอาร์โค้ด</div>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'width': '50%', 'margin-top': '10px', 'padding': '2px', 'font-size': '14px', 'margin-left': '25%', 'border': '2px solid black'});
  $(userPPQRTestCmd).on('click', (evt)=>{
    evt.stopPropagation();
    $(pageHandle.toggleMenuCmd).click();
    doStartTestPPQC(evt, userdata.shop);
  });
  let userLogoutCmd = $('<div>ออกจากระบบ</div>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'width': '50%', 'margin-top': '10px', 'padding': '2px', 'font-size': '14px', 'margin-left': '25%', 'border': '2px solid black'});
  $(userLogoutCmd).on('click', (evt)=>{
    common.doUserLogout();
  });
  return $(userInfoBox).append($(userPictureBox)).append($(userInfo)).append($(userPPQRTestCmd)).append($(userLogoutCmd));
}

const doStartTestPPQC = function(evt, shopData){
  let editInput = $('<input type="number"/>').val(common.doFormatNumber(100)).css({'width': '100px', 'margin-left': '20px'});
  $(editInput).on('keyup', (evt)=>{
    if (evt.keyCode == 13) {
      $(dlgHandle.okCmd).click();
    }
  });
  let editLabel = $('<label>จำนวนเงิน(บาท):</label>').attr('for', $(editInput)).css({'width': '100%'});
  let ppQRBox = $('<div></div>').css({'width': '100%', 'height': '480px', 'margin-top': '20px'}).append($(editLabel)).append($(editInput));
  let editDlgOption = {
    title: 'สร้างพร้อมเพย์คิวอาร์โค้ด',
    msg: $(ppQRBox),
    width: '380px',
    onOk: async function(evt) {
      let newValue = $(editInput).val();
      if(newValue !== '') {
        $(editInput).css({'border': ''});
        let params = {
          Shop_PromptPayNo: shopData.Shop_PromptPayNo,
          Shop_PromptPayName: shopData.Shop_PromptPayName,
          netAmount: newValue,
        };
        let shopRes = await common.doCallApi('/api/shop/shop/create/ppqrcode', params);
        if (shopRes.status.code == 200) {
          $.notify("สร้างพร้อมเพย์คิวอาร์โค้ดสำเร็จ", "success");
          let ppqrImage = $('<img/>').attr('src', shopRes.result.qrLink).css({'width': '410px', 'height': 'auto'});
          $(ppqrImage).on('click', (evt)=>{
            evt.stopPropagation();
            window.open('/shop/share/?id=' + shopRes.result.qrFileName, '_blank');
          });
          $(ppQRBox).empty().append($(ppqrImage));
          $(dlgHandle.cancelCmd).show();
          $(dlgHandle.cancelCmd).val(' ตกลง ');
          $(dlgHandle.okCmd).hide();
        } else if (shopRes.status.code == 201) {
          $.notify("ไม่สามารถสร้างพร้อมเพย์คิวอาร์โค้ดได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "warn");
        } else {
          $.notify("เกิดข้อผิดพลาด ไม่สามารถสร้างพร้อมเพย์คิวอาร์โค้ดได้", "error");
        }
      } else {
        $.notify('จำนวนเงินต้องไม่ว่าง', 'error');
        $(editInput).css({'border': '1px solid red'});
      }
    },
    onCancel: function(evt){
      dlgHandle.closeAlert();
    }
  }
  let dlgHandle = $('body').radalert(editDlgOption);
  $(dlgHandle.cancelCmd).hide();
  return dlgHandle;
}
