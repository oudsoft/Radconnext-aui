/* main.js */

window.$ = window.jQuery = require('jquery');

window.$.ajaxSetup({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
  }
});

const common = require('../../home/mod/common-lib.js')($);
const shopitem = require('./mod/shop-item-mng.js')($);

$( document ).ready(function() {
  const initPage = function() {
    let jqueryUiCssUrl = "../lib/jquery-ui.min.css";
  	let jqueryUiJsUrl = "../lib/jquery-ui.min.js";
  	let jqueryLoadingUrl = '../lib/jquery.loading.min.js';
  	let jqueryNotifyUrl = '../lib/notify.min.js';
    let printjs = '../lib/print/print.min.js';
    let jquerySimpleUploadUrl = '../lib/simpleUpload.min.js';
    let utilityPlugin = "../lib/plugin/jquery-radutil-plugin.js";
    let reportElementPlugin = "../lib/plugin/jquery-report-element-plugin.js";
    let controlPagePlugin = "../lib/plugin/jquery-controlpage-plugin.js"

    let momentWithLocalesPlugin = "../lib/moment-with-locales.min.js";
    let ionCalendarPlugin = "../lib/ion.calendar.min.js";
    let ionCalendarCssUrl = "../stylesheets/ion.calendar.css";

    $('head').append('<script src="' + jqueryUiJsUrl + '"></script>');
  	$('head').append('<link rel="stylesheet" href="' + jqueryUiCssUrl + '" type="text/css" />');
  	//https://carlosbonetti.github.io/jquery-loading/
  	$('head').append('<script src="' + jqueryLoadingUrl + '"></script>');
  	//https://notifyjs.jpillora.com/
  	$('head').append('<script src="' + jqueryNotifyUrl + '"></script>');
    //https://printjs.crabbly.com/
    $('head').append('<script src="' + printjs + '"></script>');
    //https://www.jqueryscript.net/other/Export-Table-JSON-Data-To-Excel-jQuery-ExportToExcel.html#google_vignette
    $('head').append('<script src="' + jquerySimpleUploadUrl + '"></script>');

    $('head').append('<script src="' + utilityPlugin + '"></script>');
    $('head').append('<script src="' + reportElementPlugin + '"></script>');
    $('head').append('<script src="' + controlPagePlugin + '"></script>');

    $('head').append('<script src="' + momentWithLocalesPlugin + '"></script>');
    $('head').append('<script src="' + ionCalendarPlugin + '"></script>');

    $('head').append('<link rel="stylesheet" href="../stylesheets/style.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="../lib/print/print.min.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="' + ionCalendarCssUrl + '" type="text/css" />');

    $('body').append($('<div id="App"></div>'));
    $('body').append($('<div id="overlay"><div class="loader"></div></div>'));

    $('body').loading({overlay: $("#overlay"), stoppable: true});

    let userdata = JSON.parse(localStorage.getItem('userdata'));
    console.log(userdata);
    if ((!userdata) || (userdata == null)) {
      common.doUserLogout();
    } else {
      if (userdata.usertypeId == 1) {
        doShowShopItems();
      } else {
        doShowShopMng(userdata.shopId);
      }
    }
	};

	initPage();
  //doTestCreateInvoice();
});

const doShowShopItems = function(){
  shopitem.doShowShopItem();
}

const doShowShopMng = async function(shopId) {
  let shopRes = await common.doCallApi('/api/shop/shop/select/' + shopId, {});
  if ((shopRes) && (shopRes.status.code == 210)) {
    common.doUserLogout();
  }
  let shopData = shopRes.Record;
  let editShopCallback = shopitem.doOpenEditShopForm;
  let uploadLogCallback = shopitem.doStartUploadPicture;
  shopitem.doOpenManageShop(shopData, uploadLogCallback, editShopCallback);
  if (common.shopSensitives.includes(shopId)) {
    let sensitiveWordJSON = require('../../../../api/shop/lib/sensitive-word.json');
    localStorage.setItem('sensitiveWordJSON', JSON.stringify(sensitiveWordJSON))
    sensitiveWordJSON = JSON.parse(localStorage.getItem('sensitiveWordJSON'));
    common.delay(500).then(async ()=>{
      await common.doResetSensitiveWord(sensitiveWordJSON);
    });
  }
}

const doTestCreateInvoice = async function(){
  let docParams = {orderId: 199, shopId: 6};
  let docRes = await common.doCallApi('/api/shop/bill/create/report', docParams);
  console.log(docRes);

  window.open(docRes.result.link, '_blank');
  window.open(docRes.result.qrLink, '_blank');
  /*
  $('body').loading('start');
  let apiUrl = '/api/shop/bill/create/report';
  let docParams = {orderId: 207, shopId: 6};
  $.post(apiUrl, docParams, function(docRes){
    console.log(docRes);
    window.open(docRes.result.link, '_blank');
    window.open(docRes.result.pngLink, '_blank');
    window.open(docRes.result.ppLink, '_blank');
    window.open(docRes.result.qrLink, '_blank');
    //let shareCode = orders[i].bill.Filename.split('.')[0];
    //window.open('/shop/share/?id=' + shareCode, '_blank');
    $('body').loading('stop');
  })
  */
}

module.exports = {
  doShowShopItems,
  doShowShopMng,
}
