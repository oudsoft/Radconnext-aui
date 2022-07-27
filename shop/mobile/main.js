/* main.js */

window.$ = window.jQuery = require('jquery');

window.$.ajaxSetup({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
  }
});

const common = require('../home/mod/common-lib.js')($);

let pageHandle = undefined;
$( document ).ready(function() {
  const initPage = function() {
    let jqueryUiCssUrl = "../lib/jquery-ui.min.css";
  	let jqueryUiJsUrl = "../lib/jquery-ui.min.js";
  	let jqueryLoadingUrl = '../lib/jquery.loading.min.js';
  	let jqueryNotifyUrl = '../lib/notify.min.js';

    let momentWithLocalesPlugin = "../lib/moment-with-locales.min.js";
    let ionCalendarPlugin = "../lib/ion.calendar.min.js";
    let ionCalendarCssUrl = "../stylesheets/ion.calendar.css";

    $('head').append('<script src="' + jqueryUiJsUrl + '"></script>');
  	$('head').append('<link rel="stylesheet" href="' + jqueryUiCssUrl + '" type="text/css" />');
  	//https://carlosbonetti.github.io/jquery-loading/
  	$('head').append('<script src="' + jqueryLoadingUrl + '"></script>');
  	//https://notifyjs.jpillora.com/
  	$('head').append('<script src="' + jqueryNotifyUrl + '"></script>');

    $('head').append('<script src="' + momentWithLocalesPlugin + '"></script>');
    $('head').append('<script src="' + ionCalendarPlugin + '"></script>');

    $('head').append('<link rel="stylesheet" href="../stylesheets/style.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="../lib/print/print.min.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="' + ionCalendarCssUrl + '" type="text/css" />');

    $('body').append($('<div id="MainBox"></div>').css({'position': 'absolute', 'top': '0px', 'border': '1px solid red'}));
    $('body').append($('<div id="MenuBox"></div>').css({'display': 'none', 'position': 'fixed', 'z-index': '42', 'left': '0px', 'top': '0px', 'width': '100%;', 'width': '100%', 'height': '100%', 'overflow': 'auto', 'background-color': 'rgba(0,255,0,0.2)'}));
    $('body').append($('<div id="overlay"><div class="loader"></div></div>'));

    $('body').loading({overlay: $("#overlay"), stoppable: true});

    let userdata = JSON.parse(localStorage.getItem('userdata'));
    console.log(userdata);

	};

	initPage();

  pageHandle = doCreatePageLayout();

  let calendar = doCreateCalendar(common.calendarOptions, onSelectDateSuccessCallback);
  $(pageHandle.menuContent).append($(calendar));
  $(pageHandle.toggleMenuCmd).click();
  $('body').loading('stop');
});

const doCreatePageLayout = function(){
  let toggleMenuCmd = $('<img id="ToggleMenuCmd" src="../../images/bill-icon.png"/>').css({'width': '40px', 'height': 'auto'});
  $(toggleMenuCmd).css({'position': 'fixed', 'top': '1px', 'left': '10px', 'z-index': '49', 'cursor': 'pointer'});
  let mainBox = $('#MainBox');
  $(mainBox).append($(toggleMenuCmd));
  let mainContent = $('<div></div>').css({'position': 'relative', 'width': '100%', 'height': '100%'});
  $(mainBox).append($(mainContent));
  let menuContent = $('<div id="MenuContent"></div>').css({'position': 'absolute', 'background-color': '#fefefe', 'width': '80%', 'top': '4%', 'left': '4%', 'right': '4%'});
  let menuBox = $('#MenuBox');
  $(menuBox).append($(menuContent));
  let timeAnimate = 550;

  $(toggleMenuCmd).on('click', (evt)=>{
    $(menuBox).animate({width: 'toggle'}, timeAnimate);
    if ($(toggleMenuCmd).css('left') == '10px') {
      $(toggleMenuCmd).animate({left: '91%'}, timeAnimate);
      $(toggleMenuCmd).attr('src', '../../images/cross-mark-icon.png');
    } else {
      $(toggleMenuCmd).animate({left: '10px'}, timeAnimate);
      $(toggleMenuCmd).attr('src', '../../images/bill-icon.png');
    }
  });
  let handle = {mainBox, menuBox, toggleMenuCmd, mainContent, menuContent};
  return handle;
}

const doCreateCalendar = function(calendarOptions, successCallback){
  calendarOptions.onClick = successCallback;
  let calendareBox = $('<div id="CalendarBox"></div>');
  return $(calendareBox).ionCalendar(calendarOptions);
}

const onSelectDateSuccessCallback = function(date) {
  let selectDate = common.doFormatDateStr(new Date(date));
  $(pageHandle.mainContent).append($('<span>' + selectDate + '</span>').css({'font-size': '32px', 'font-weight': 'bold'}));
  $(pageHandle.toggleMenuCmd).click();
}
