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
const orderForm = require('./mod/order-form-lib.js')($);

let pageHandle = undefined;
let wss = undefined;

$( document ).ready(function() {
  const initPage = function() {
    let jqueryUiCssUrl = "../lib/jquery-ui.min.css";
  	let jqueryUiJsUrl = "../lib/jquery-ui.min.js";
  	let jqueryLoadingUrl = '../lib/jquery.loading.min.js';
  	let jqueryNotifyUrl = '../lib/notify.min.js';
    let jquerySimpleUploadUrl = '../lib/simpleUpload.min.js';

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
    $('head').append('<script src="' + jquerySimpleUploadUrl + '"></script>');
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

    // ปุ่ม ctrl+Z อาจจะมีปัญหาในการพิมพ์ได้
    $(window).on('keydown', async (evt)=>{
      if (evt.ctrlKey && evt.key === 'z') {
        let protocol = window.location.protocol;
        let domain = window.location.host;
        window.location.replace(protocol + '//' + domain + '/shop/setting/admin.html');
      }
    });
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

const isMobileDeviceCheck = function(){
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    return true;
  } else {
    return false;
  }
}

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
  let handle = {mainBox, menuBox, toggleMenuCmd, mainContent, menuContent, userInfoBox};
  return handle;
}

const doCreateShopMessageBox = function() {
  let userdata = JSON.parse(localStorage.getItem('userdata'));
  let messageBox = $('<div></div>').css({'display': 'none'});
  let myMessageUrl = '/api/shop/message/shop/mobile/load/' + userdata.shop.id;
  let params = {shopId: userdata.shop.id};
  common.doCallApi(myMessageUrl, params).then((msgRes)=>{
    console.log(msgRes);

    $(messageBox).empty();

    let msgs = msgRes.Records;
    let totalNew = 0;
    if (msgs.length > 0) {
      for (let i=0; i < msgs.length; i++) {
        let msg = msgs[i];
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
          totalNew = totalNew + 1;
          doUpdateMessageOpen(userdata.shop, msg);
        } else if (msg.Status == 2) {
          msgStatus = 'Open';
        } else if (msg.Status == 3) {
          msgStatus = 'Close';
        }

        let msgMainBox = $('<div></div>').css({'position': 'relative', 'width': '100%', 'text-align': 'left', 'margin': '8px', 'padding': '10px', 'border': '1px solid grey'});
        let msgDatetime = $('<p></p>').text('วันที่-เวลา : ' + fmtDate + ' : ' + fmtTime).css({'font-size': '12px', 'line-height': '12px'});
        let msgFmUserFullname = $('<p></p>').text('จาก : ' + fmUserFullname).css({'font-size': '12px', 'line-height': '12px'});
        let msgBox = $('<div></div>').css({'position': 'relative', 'width': '100%', 'background-color': '#fff'});
        let msgStatusBox = $('<p></p>').text(msgStatus).css({'font-size': '12px', 'line-height': '12px'});
        $(msgBox).html(msg.Message);
        $(msgMainBox).append($(msgDatetime)).append($(msgFmUserFullname)).append($(msgBox)).append($(msgStatusBox));;
        $(messageBox).append($(msgMainBox));
      }
    } else {
      $(messageBox).text('ยังไม่มีข้อความของร้านคุณ').css({'text-align': 'center'});
    }
    if (totalNew > 0) {
      $('#MessageAmount').show().text(msgs.length);
    } else {
      $('#MessageAmount').hide();
    }
  });
  return $(messageBox);
}

const doCreateUserInfoBox = function(){
  let userdata = JSON.parse(localStorage.getItem('userdata'));
  let userInfoBox = $('<div></div>').css({'position': 'relative', 'width': '100%', 'text-align': 'center'});
  //let userPictureBox = $('<img src="../../images/avatar-icon.png"/>').css({'position': 'relative', 'width': '50px', 'height': 'auto', 'cursor': 'pointer', 'margin-top': '-2px'});
  let userPictureBox = $('<div></div>').css({'position': 'relative', 'width': '100%', 'text-align': 'center'});
  $(userPictureBox).on('click', (evt)=>{
    $(userPPQRTestCmd).toggle('fast', 'linear');
    $(calculatorCmd).toggle('fast', 'linear');
    if (uploadBillLogoCmd) {
      $(uploadBillLogoCmd).toggle('fast', 'linear');
    }
    $(userLogoutCmd).toggle('fast', 'linear');
    if (messageBox) {
      $(messageBox).toggle('fast', 'linear');
    }
  });
  let userPicture = $('<img src="../../images/avatar-icon.png"/>').css({'position': 'relative', 'width': '50px', 'height': 'auto', 'cursor': 'pointer', 'margin-top': '-2px'});
  $(userPictureBox).append($(userPicture));
  let userInfo = $('<div></div>').text(userdata.userinfo.User_NameTH + ' ' + userdata.userinfo.User_LastNameTH).css({'position': 'relative', 'margin-top': '-15px', 'padding': '2px', 'font-size': '14px'});
  let userPPQRTestCmd = $('<div id="UserPPQRTestCmd">สร้างพร้อมเพย์คิวอาร์โค้ด</div>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'width': '50%', 'margin-top': '10px', 'padding': '2px', 'font-size': '14px', 'margin-left': '25%', 'border': '2px solid black'});
  $(userPPQRTestCmd).on('click', (evt)=>{
    evt.stopPropagation();
    $(pageHandle.toggleMenuCmd).click();
    doStartTestPPQC(evt);
  });
  let calculatorCmd = $('<div>เครื่องคิดเลข</div>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'width': '50%', 'margin-top': '10px', 'padding': '2px', 'font-size': '14px', 'margin-left': '25%', 'border': '2px solid black'});
  $(calculatorCmd).on('click', (evt)=>{
    evt.stopPropagation();
    $(pageHandle.toggleMenuCmd).click();
    doOpenCalculatorCallBack(evt, userdata.shop);
  });

  $(userInfoBox).append($(userPictureBox)).append($(userInfo)).append($(userPPQRTestCmd)).append($(calculatorCmd));

  let uploadBillLogoCmd = undefined;
  if ([1, 2, 3].includes(userdata.usertypeId)) {
    uploadBillLogoCmd = $('<div>แก้ไขรูปสัญลักษณ์ในบิล</div>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'width': '50%', 'margin-top': '10px', 'padding': '2px', 'font-size': '14px', 'margin-left': '25%', 'border': '2px solid black'});
    $(uploadBillLogoCmd).on('click', (evt)=>{
      evt.stopPropagation();
      $(pageHandle.toggleMenuCmd).click();
      doOpenUploadBillLogo(evt, userdata.shop);
    });
    $(userInfoBox).append($(uploadBillLogoCmd));
  }

  let switchDesktopCmd = undefined;
  if ([1, 2, 3].includes(userdata.usertypeId)) {
    let isMobile = isMobileDeviceCheck();
    if (!isMobile) {
      switchDesktopCmd = $('<div>สวิชต์ไปเวอร์ชั่นเดสก์ท็อป</div>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'width': '50%', 'margin-top': '10px', 'padding': '2px', 'font-size': '14px', 'margin-left': '25%', 'border': '2px solid black'});
      $(switchDesktopCmd).on('click', (evt)=>{
        evt.stopPropagation();
        $(pageHandle.toggleMenuCmd).click();
        let protocol = window.location.protocol;
        let domain = window.location.host;
        window.location.replace(protocol + '//' + domain + '/shop/setting/admin.html');
      });
      $(userInfoBox).append($(switchDesktopCmd));
    }
  }

  let userLogoutCmd = $('<div>ออกจากระบบ</div>').css({'background-color': 'white', 'color': 'black', 'cursor': 'pointer', 'position': 'relative', 'width': '50%', 'margin-top': '10px', 'padding': '2px', 'font-size': '14px', 'margin-left': '25%', 'border': '2px solid black'});
  $(userLogoutCmd).on('click', (evt)=>{
    common.doUserLogout();
  });

  $(userInfoBox).append($(userLogoutCmd));

  if ([1, 2, 3].includes(userdata.usertypeId)) {
    const redCircleAmountStyle = {'display': 'inline-block', 'color': '#fff', 'text-align': 'center', 'line-height': '24px', 'border-radius': '50%', 'font-size': '16px', 'min-width': '28px', 'min-height': '28px', 'margin-top': '10px', 'margin-left': '-10px', 'background-color': 'red', 'position': 'absolute', 'cursor': 'pointer'};
    let myMessageAmount = $('<div id="MessageAmount">2</div>').css(redCircleAmountStyle);
    $(userPictureBox).append($(myMessageAmount));
    let myMessageUrl = '/api/shop/message/month/new/count/' + userdata.shop.id
    let params = {userId: userdata.id};
    common.doCallApi(myMessageUrl, params).then((msgRes)=>{
      if (msgRes.count > 0) {
        $(myMessageAmount).show().text(msgRes.count);
      } else {
        $(myMessageAmount).hide();
      }
    });
    let messageBox = doCreateShopMessageBox();
    $(userInfoBox).append($(messageBox));
  }
  return $(userInfoBox);
}

const doCreatePPInfoBox = function(shopData) {
  let userdata = JSON.parse(localStorage.getItem('userdata'));
  let mainBox = $('<div style="width: 97%; text-align: left; padding: 5px; border: 2px solid grey;"></div>');
  let ppTitleBox = $('<div style="width: 100%; text-align: left;"></div>');
  $(ppTitleBox).append($('<p>ข้อมูลพร้อมเพย์ที่จะออกคิวอาร์โค้ด</p>'));
  let ppNameBox = $('<div></div>');
  $(ppNameBox).append($('<p>ขื่อบัญชีพร้อมเพย์ :</p>'));
  $(ppNameBox).append($('<p></p>').text(shopData.Shop_PromptPayName).css({'font-weight': 'bold', 'font-size': '22px'}));
  let ppNumberBox = $('<div></div>');
  $(ppNumberBox).append($('<p>หมายเลขพร้อมเพย์ :</p>'));
  $(ppNumberBox).append($('<p></p>').text(shopData.Shop_PromptPayNo).css({'font-weight': 'bold', 'font-size': '22px'}));
  if ([1, 2, 3].includes(userdata.usertypeId)) {
    let ppFooterBox = $('<div style="width: 100%; text-align: left;"></div>');
    $(ppFooterBox).append($('<p>หากข้อมูลไม่ถูกต้องโปรดแก้ไข โดยคลิกปุ่ม <b style="font-size: 22px;">แก้ไขข้อมูลพร้อมเพย์</b></p>'));
    return $(mainBox).append($(ppTitleBox)).append($(ppNameBox)).append($(ppNumberBox)).append($(ppFooterBox));
  } else {
    return $(mainBox).append($(ppTitleBox)).append($(ppNameBox)).append($(ppNumberBox));
  }
}

const doStartTestPPQC = function(evt){
  let userdata = JSON.parse(localStorage.getItem('userdata'));
  let shopData = userdata.shop;
  let editInput = $('<input type="number"/>').val(100 /*common.doFormatNumber(100)*/).css({'width': '100px', 'margin-left': '20px'});
  $(editInput).on('keyup', (evt)=>{
    if (evt.keyCode == 13) {
      $(dlgHandle.okCmd).click();
    }
  });
  let editLabel = $('<label>จำนวนเงิน(บาท):</label>').attr('for', $(editInput)).css({'width': '100%'});

  let settingPPDataCmd = undefined;
  let ppQRBox = undefined;

  //console.log(shopData);

  if (((shopData.Shop_PromptPayNo) && (shopData.Shop_PromptPayNo !== '')) && ((shopData.Shop_PromptPayName) && (shopData.Shop_PromptPayName !== ''))) {
    let ppBox = $('<div style="width: 97%; text-align: center; padding: 5px; border: 2px solid grey;"></div>');
    let openPPDataCmd = common.doCreateTextCmd('ข้อมูลพร้อมเพย์', 'green', 'white');
    $(ppBox).append($(openPPDataCmd));

    ppQRBox = $('<div></div>').css({'width': '100%', 'height': '480px', 'margin-top': '20px'});
    $(openPPDataCmd).on('click', (evt)=>{
      evt.stopPropagation();
      $(ppBox).hide();
      let ppInfoBox = doCreatePPInfoBox(shopData);
      if ([1, 2, 3].includes(userdata.usertypeId)) {
        settingPPDataCmd = common.doCreateTextCmd('แก้ไขข้อมูลพร้อมเพย์', 'green', 'white');
        $(settingPPDataCmd).on('click', (evt)=>{
          evt.stopPropagation();
          dlgHandle.closeAlert();
          doOpenPPDataForm(evt, shopData);
        });

        let ppCancelCmd = $('<input type="button" value=" ยกเลิก "/>').css({'margin-left': '10px'});
        $(ppCancelCmd).on('click', (evt)=>{
          evt.stopPropagation();
          $(ppInfoBox).hide();
          $(ppBox).show();
        });
        $(ppInfoBox).append($('<div style="width: 100%; text-align: center; margin-bottom: 20px;"></div>').append($(settingPPDataCmd)).append($(ppCancelCmd)));
      }
      $(ppQRBox).prepend($(ppInfoBox));
    });

    $(ppQRBox).append($(ppBox));
    $(ppQRBox).append($('<div style="width: 100%; margin-top: 40px;"></div>').append('<p>แก้ไขจำนวนเงินที่ต้องการแล้วคลิกปุ่ม <b style="font-size: 22px;">ตกลง</b></p>'));
    $(ppQRBox).append($(editLabel)).append($(editInput));

  } else {
    if ([1, 2, 3].includes(userdata.usertypeId)) {
      settingPPDataCmd = common.doCreateTextCmd('ตั้งค่าข้อมูลพร้อมเพย์', 'orange', 'white');
      $(settingPPDataCmd).on('click', (evt)=>{
        evt.stopPropagation();
        dlgHandle.closeAlert();
        doOpenPPDataForm(evt, shopData);
      });
      ppQRBox = $('<div></div>').css({'width': '100%', 'height': '480px', 'margin-top': '20px'});
      $(ppQRBox).append($('<span>คุณยังไม่ได้ตั้งค่าข้อมูลพร้อมเพย์ของร้าน</span>'));
      $(ppQRBox).append($('<br/>')).append($('<span>คลิกที่ปุ่ม <b>ตั้งค่าข้อมูลพร้อมเพย์</b> เพื่อตั้งค่าก่อนออกคิวอาร์โค้ด</span>'));
      $(ppQRBox).append($('<div style="width: 100%; text-align: center; margin-top: 50px;"></div>').append($(settingPPDataCmd)));
    } else {
      ppQRBox = $('<div></div>').css({'width': '100%', 'height': '480px', 'margin-top': '20px'});
      $(ppQRBox).append($('<span>คุณยังไม่ได้ตั้งค่าข้อมูลพร้อมเพย์ของร้าน</span>'));
    }
  }

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
          showAd: false
        };
        let shopRes = await common.doCallApi('/api/shop/shop/create/ppqrcode', params);
        if (shopRes.status.code == 200) {
          $.notify("สร้างพร้อมเพย์คิวอาร์โค้ดสำเร็จ", "success");
          let ppqrImage = $('<img/>').attr('src', shopRes.result.qrLink).css({'width': '380px', 'height': 'auto'});
          $(ppqrImage).on('click', (evt)=>{
            evt.stopPropagation();
            window.open('/shop/share/?id=' + shopRes.result.qrFileName, '_blank');
          });

          let alertTextBox = $('<p></p>').text('ต้องการรับใบเสร็จ โปรดแจ้งแม่ค้า').css({'text-align': 'center', 'font-size': '27px', 'color': 'blue'});

          let openNewOrderCmd = common.doCreateTextCmd('ออกบิลใหม่', 'green', 'white');
          $(openNewOrderCmd).on('click', (evt)=>{
            evt.stopPropagation();
            dlgHandle.closeAlert();
            let workAreaBox = pageHandle.mainContent;
            orderForm.setupPageHandle(pageHandle);
            orderForm.doOpenOrderForm(shopData.id, workAreaBox, undefined, undefined, orderMng.doShowOrderList);
          });
          $(ppQRBox).empty().append($(ppqrImage)).append($(alertTextBox)).append($(openNewOrderCmd)).css({'display': 'inline-block', 'text-align': 'center', 'margin-top': '20px'});
          $(dlgHandle.cancelCmd).show();
          $(dlgHandle.cancelCmd).val(' ปิด ');
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
  if (((shopData.Shop_PromptPayNo) && (shopData.Shop_PromptPayNo !== '')) && ((shopData.Shop_PromptPayName) && (shopData.Shop_PromptPayName !== ''))) {
    //$(dlgHandle.cancelCmd).hide();
    $(dlgHandle.cancelCmd).show();
    $(dlgHandle.okCmd).show();
  } else {
    $(dlgHandle.okCmd).hide();
    $(dlgHandle.cancelCmd).show();
  }
  return dlgHandle;
}

const doOpenPPDataForm = function(evt, shopData) {
  $(pageHandle.mainContent).empty();
  let ppNameInput = $('<input type="text"/>').css({'width': '205px', 'margin-left': '20px'});
  let ppNumberInput = $('<input type="number"/>').css({'width': '200px', 'margin-left': '20px'});
  let ppNameLabel = $('<label>ขื่อบัญชีพร้อมเพย์:</label>').attr('for', $(ppNameInput)).css({'width': '100%'});
  let ppNumberLabel = $('<label>หมายเลขพร้อมเพย์:</label>').attr('for', $(ppNumberInput)).css({'width': '100%'});
  let ppSaveCmd = $('<input type="button" value=" บันทึก "/>');
  let ppCancelCmd = $('<input type="button" value=" ยกเลิก "/>').css({'margin-left': '10px'});
  let ppNameBox = $('<div style="width: 100%; text-align: left; padding: 5px; margin-top: 60px;"></div>').append($(ppNameLabel)).append($(ppNameInput)).append($('<span>*</span>').css({'color': 'red', 'margin-left': '5px'}));
  let ppNumberBox = $('<div style="width: 100%; text-align: left; padding: 5px;"></div>').append($(ppNumberLabel)).append($(ppNumberInput)).append($('<span>*</span>').css({'color': 'red', 'margin-left': '5px'}));
  let ppCommandBox = $('<div style="width: 100%; text-align: center; padding: 5px; margin-top: 20px;"></div>').append($(ppSaveCmd)).append($(ppCancelCmd));
  $(pageHandle.mainContent).append($(ppNameBox)).append($(ppNumberBox)).append($(ppCommandBox));
  if ((shopData) && (shopData.Shop_PromptPayName)) {
    $(ppNameInput).val(shopData.Shop_PromptPayName);
  }
  if ((shopData) && (shopData.Shop_PromptPayNo)) {
    $(ppNumberInput).val(shopData.Shop_PromptPayNo);
  }
  $(ppCancelCmd).on('click', (evt)=>{
    evt.stopPropagation();
    orderMng.doShowOrderList(shopData.id, pageHandle.mainContent);
  });
  $(ppSaveCmd).on('click', async (evt)=>{
    evt.stopPropagation();
    let ppName = $(ppNameInput).val();
    let ppNumber = $(ppNumberInput).val();
    if (ppName !== '') {
      $(ppNameInput).css({'border': ''});
      if (ppNumber !== '') {
        $(ppNumberInput).css({'border': ''});
        let params = {data: {Shop_PromptPayName: ppName, Shop_PromptPayNo: ppNumber}};
        let shopReqUrl = '/api/shop/shop/update/ppdata/' + shopData.id;
        let shopRes = await common.doCallApi(shopReqUrl, params);
        if (shopRes.status.code == 200) {
          $.notify("บันทึกข้อมูลพร้อมเพย์สำเร็จ", "success");
          let userdata = JSON.parse(localStorage.getItem('userdata'));
          localStorage.removeItem('userdata');
          userdata.shop.Shop_PromptPayName = ppName;
          userdata.shop.Shop_PromptPayNo = ppNumber;
          localStorage.setItem('userdata', JSON.stringify(userdata));

          userdata = JSON.parse(localStorage.getItem('userdata'));
          console.log(userdata);

          $(pageHandle.mainContent).empty();
          doStartTestPPQC(evt);
        } else {
          $.notify("ไม่สามารถบันทึกข้อมูลพร้อมเพย์ได้ในขณะนี้", "error");
        }
      } else {
        $(ppNumberInput).css({'border': '1px solid red'});
      }
    } else {
      $(ppNameInput).css({'border': '1px solid red'});
    }
  });
}

const doOpenCalculatorCallBack = function(evt, shopData){
  let calcBox = $('<div id="root"></div>');
  let calcDlgOption = {
    title: 'เครื่องคิดเลข',
    msg: $(calcBox),
    width: '365px',
    onOk: function(evt) {
      $(calcScript).remove();
      dlgHandle.closeAlert();
    },
    onCancel: function(evt) {
      $(calcScript).remove();
      dlgHandle.closeAlert();
    }
  }
  let dlgHandle = $('body').radalert(calcDlgOption);
  $(dlgHandle.cancelCmd).hide();
  let calcScript = document.createElement("script");
  calcScript.type = "text/javascript";
  calcScript.src = "../lib/calculator.js";
  $("head").append($(calcScript));
}

const doOpenUploadBillLogo = function(evt, shopData) {
  let userdata = JSON.parse(localStorage.getItem('userdata'));
  let shopId = shopData.id;
  let fileBrowser = $('<input type="file"/>');
  $(fileBrowser).attr("name", 'templatelogo');
  $(fileBrowser).attr("multiple", true);
  $(fileBrowser).css('display', 'none');
  $(fileBrowser).on('change', function(e) {
    const defSize = 10000000;
    let fileSize = e.currentTarget.files[0].size;
    let fileType = e.currentTarget.files[0].type;
    if (fileSize <= defSize) {
      let uploadUrl = '/api/shop/upload/template/logo';
      $(fileBrowser).simpleUpload(uploadUrl, {
        success: async function(data){
          $(fileBrowser).remove();
          let params = {shopId: shopId, link: data.link};
          let tempRes = await common.doCallApi('/api/shop/template/update/template/logo', params);
          $.notify("แก้ไขรูปสัญลักษณ์ในบิลสำเร็จ", "success");
          if (userdata.usertypeId == 5) {
            orderProc.doShowOrderList(userdata.shopId, pageHandle.mainContent);
          } else {
            orderMng.doShowOrderList(userdata.shopId, pageHandle.mainContent);
          }
        },
        progress: function(progress){
          $('body').loading({message: Math.round(progress) + ' %'});
        }
      });
    } else {
      $(pageHandle.mainContent).append($('<span>' + 'File not excess ' + defSize + ' Byte.' + '</span>'));
    }
  });
  $(fileBrowser).appendTo($(pageHandle.mainContent));
  $(fileBrowser).click();
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
