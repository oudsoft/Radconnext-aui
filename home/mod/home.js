/* home.js */

module.exports = function ( jq ) {
	const $ = jq;

	const welcome = require('./welcome.js')($);
	const login = require('./login.js')($);

	const urlQueryToObject = function(url) {
	  let result = url.split(/[?&]/).slice(1).map(function(paramPair) {
	    return paramPair.split(/=(.+)?/).slice(0, 2);
	  }).reduce(function (obj, pairArray) {
	    obj[pairArray[0]] = pairArray[1];
	    return obj;
	  }, {});
	  return result;
	}

	const doShowHome = function(){

		$('body').css({'background-image': 'url("/images/logo-radconnext.png")', 'background-color': '#cccccc'});
		let openCmdLink = doCreateOpenLoginForm();
		$('body').append($(openCmdLink));

		let queryUrl = urlQueryToObject(window.location.href);
		if (queryUrl.action === 'register'){
			login.doOpenRegisterForm();
		} else {
			//doLoadLoginForm();
			login.doCheckUserData();
		}
	}

	const doLoadLoginForm = function(){
		login.doLoadLoginForm();
	}

	const doCreateOpenLoginForm = function(){
		let openCmdLinkBox = $('<ul></ul>');
		let openLoginCmd = $('<li><a href="#">เข้าสู่ระบบ</a></li>');
		$(openLoginCmd).on('click', (evt)=>{
			login.doLoadLoginForm();
		});
		$(openCmdLinkBox).append($(openLoginCmd));

		let openRegisterCmd = $('<li><a href="#">ลงทะเบียนใช้งาน</a></li>');
		$(openRegisterCmd).on('click', (evt)=>{
			login.doOpenRegisterForm();
		});
		$(openCmdLinkBox).append($(openRegisterCmd));

		$(openCmdLinkBox).css({'font-family': 'EkkamaiStandard', 'font-size': '24px', 'font-weight': 'normal'});
		$(openCmdLinkBox).center();
		return $(openCmdLinkBox);
	}

	return {
		doShowHome,
		doLoadLoginForm
	}
}
