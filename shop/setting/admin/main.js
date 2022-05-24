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
    
    $('head').append('<link rel="stylesheet" href="../stylesheets/style.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="../lib/print/print.min.css" type="text/css" />');

    $('body').append($('<div id="App"></div>'));
    $('body').append($('<div id="overlay"><div class="loader"></div></div>'));

    $('body').loading({overlay: $("#overlay"), stoppable: true});


    doShowShopItems();
	};

	initPage();
});

const doShowShopItems = function(){
  shopitem.doShowShopItem();
}

module.exports = {
  doShowShopItems,
}
