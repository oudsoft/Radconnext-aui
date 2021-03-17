/* profilelib.js */
module.exports = function ( jq ) {
	const $ = jq;

	const apiconnector = require('../../case/mod/apiconnect.js')($);
  const util = require('../../case/mod/utilmod.js')($);
  const common = require('../../case/mod/commonlib.js')($);


  const doCreateProfileTitlePage = function(){
    const profileTitle = 'ตั้งค่าการแจ้งเตือนและรับเคส';
    let profileTitleBox = $('<div class="title-content"></div>');
    let logoPage = $('<img src="/images/setting-icon-2.png" width="40px" height="auto" style="float: left;"/>');
    $(logoPage).appendTo($(profileTitleBox));
    let titleText = $('<div style="float: left; margin-left: 10px; margin-top: -5px;"><h3>' + profileTitle + '</h3></div>');
    $(titleText).appendTo($(profileTitleBox));
    return $(profileTitleBox);
  }

  const doCreateHeader = function(){
    let headerRow = $('<div style="display: table-row; width: 100%;"></div>');

		let headColumn = $('<div id="StatusNameColumn" style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>สถานะ</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>การแจ้งเตือน</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>การรับเคส</span>');
		$(headColumn).appendTo($(headerRow));

    return $(headerRow);
  }

  const doCreateActiveRow = function(profile){
    let activeRow = $('<div style="display: table-row; width: 100%;"></div>');

    let statusNameCell = $('<div style="display: table-cell; text-align: center; vertical-align: middle; border: 2px solid grey;"></div>');
		$(statusNameCell).appendTo($(activeRow));
    $(statusNameCell).append($('<span>Active</span>'));

    let notifyCell = $('<div style="display: table-cell; text-align: left; border: 2px solid grey;"></div>');
		$(notifyCell).appendTo($(activeRow));

    let webmessageNotityBox = $('<div style="position: relative; padding: 4px; margin-top: 10px;"></div>');
    $(webmessageNotityBox).appendTo($(notifyCell));
    let webmessageSwitchControl = $('<div id="WebmessageSwitchControl"></div>');
    let webmessageSwitchOption = {onActionCallback: ()=>{console.log('one');}, offActionCallback: ()=>{console.log('two');} };
		let webmessageSwitch = $(webmessageSwitchControl).readystate(webmessageSwitchOption);
    if (profile.Profile.casenotify.webmessage == 1) {
      webmessageSwitch.onAction();
    } else {
      webmessageSwitch.offAction();
    }
    $(webmessageSwitchControl).appendTo($(webmessageNotityBox));
    $(webmessageSwitchControl).append($('<label style="position: absolute; top: 10px; left: 70px;">Website</label>'));

    let lineNotityBox = $('<div style="position: relative; padding: 4px;"></div>');
    $(lineNotityBox).appendTo($(notifyCell));
    let lineSwitchControl = $('<div id="LineSwitchControl"></div>');
    let lineSwitchOption = {onActionCallback: ()=>{console.log('one');}, offActionCallback: ()=>{console.log('two');} };
		let lineSwitch = $(lineSwitchControl).readystate(lineSwitchOption);
    if (profile.Profile.casenotify.line == 1) {
      lineSwitch.onAction();
    } else {
      lineSwitch.offAction();
    }
    $(lineSwitchControl).appendTo($(lineNotityBox)); //&nbsp;&nbsp;
    $(lineNotityBox).append($('<label style="position: absolute; top: 10px; left: 70px;">LINE</label>'));


    let autocallBox = $('<div style="position: relative; padding: 4px;"></div>');
    $(autocallBox).appendTo($(notifyCell));
    let autocallSwitchControl = $('<div id="AutocallSwitchControl"></div>');
    let autocallSwitchOption = {onActionCallback: ()=>{console.log('one');}, offActionCallback: ()=>{console.log('two');} };
		let autocallSwitch = $(autocallSwitchControl).readystate(autocallSwitchOption);
    if (profile.Profile.casenotify.autocall == 1) {
      autocallSwitch.onAction();
    } else {
      autocallSwitch.offAction();
    }
    $(autocallSwitchControl).appendTo($(autocallBox)); //&nbsp;&nbsp;
    $(autocallBox).append($('<label style="position: absolute; top: 10px; left: 70px;">Auto Call</label>'));

    let mancallBox = $('<div style="position: relative; padding: 4px;"></div>');
    $(mancallBox).appendTo($(notifyCell));
    let mancallSwitchControl = $('<div id="MancallSwitchControl"></div>');
    let mancallSwitchOption = {onActionCallback: ()=>{console.log('one');}, offActionCallback: ()=>{console.log('two');} };
		let mancallSwitch = $(mancallSwitchControl).readystate(mancallSwitchOption);
    if (profile.Profile.casenotify.mancall == 1) {
      mancallSwitch.onAction();
    } else {
      mancallSwitch.offAction();
    }
    $(mancallSwitchControl).appendTo($(mancallBox)); //&nbsp;&nbsp;
    $(mancallBox).append($('<label style="position: absolute; top: 10px; left: 70px;">Manual Call</label>'));

    let caseAccCell = $('<div style="display: table-cell; text-align: left; border: 2px solid grey;"></div>');
		$(caseAccCell).appendTo($(activeRow));

    let caseAccBox = $('<div style="position: relative; padding: 4px;"></div>');
    $(caseAccBox).appendTo($(caseAccCell));
    let caseAccSwitchControl = $('<div id="CaseAcccallSwitchControl"></div>');
    let caseAccSwitchOption = {onActionCallback: ()=>{console.log('one');}, offActionCallback: ()=>{console.log('two');} };
		let caseAccSwitch = $(caseAccSwitchControl).readystate(caseAccSwitchOption);
    if (profile.Profile.casenotify.autoacc == 1) {
      caseAccSwitch.onAction();
    } else {
      caseAccSwitch.offAction();
    }
    $(caseAccSwitchControl).appendTo($(caseAccBox)); //&nbsp;&nbsp;
    $(caseAccBox).append($('<label style="position: absolute; top: 10px; left: 70px;">รับเคสอัตโนมัติ</label>'));

    return $(activeRow);
  }

  const doCreateLockRow = function(profile){
    let lockRow = $('<div style="display: table-row; width: 100%;"></div>');

    let statusNameCell = $('<div style="display: table-cell; text-align: center; vertical-align: middle; border: 2px solid grey;"></div>');
		$(statusNameCell).appendTo($(lockRow));
    $(statusNameCell).append($('<span>Lock</span>'));

    let notifyCell = $('<div style="display: table-cell; text-align: left; border: 2px solid grey;"></div>');
		$(notifyCell).appendTo($(lockRow));

    let caseAccCell = $('<div style="display: table-cell; text-align: left; border: 2px solid grey;"></div>');
		$(caseAccCell).appendTo($(lockRow));

    return $(lockRow);
  }

  const doCreateOfflinekRow = function(profile){
    let offlineRow = $('<div style="display: table-row; width: 100%;"></div>');

    let statusNameCell = $('<div style="display: table-cell; text-align: center; vertical-align: middle; border: 2px solid grey;"></div>');
		$(statusNameCell).appendTo($(offlineRow));
    $(statusNameCell).append($('<span>Offline</span>'));

    let notifyCell = $('<div style="display: table-cell; text-align: left; border: 2px solid grey;"></div>');
		$(notifyCell).appendTo($(offlineRow));

    let caseAccCell = $('<div style="display: table-cell; text-align: left; border: 2px solid grey;"></div>');
		$(caseAccCell).appendTo($(offlineRow));

    return $(offlineRow);
  }

  const doCreateLockOptionRow = function(profile, statusNameColumnWidth){
    let lockOptionRow = $('<div style="position: relative; width: 99.95%; margin-top: 5px; border: 2px solid grey;"></div>');
    let minuteValueLockBox = $('<div style="width: 100%;"></div>');
    $(minuteValueLockBox).css('margin-left', statusNameColumnWidth);
    let unlockOptionBox = $('<div style="width: 100%; position: relative;"></div>');
    $(unlockOptionBox).css('margin-left', statusNameColumnWidth);
    $(minuteValueLockBox).appendTo($(lockOptionRow));
    $(unlockOptionBox).appendTo($(lockOptionRow));

    let minuteValue = $('<input id="MinuteValue" type="text" id="MinuteLockValue" size="4"/>');
    $(minuteValue).val(profile.Profile.screen.lock);
    $(minuteValueLockBox).append($('<span>ล็อคเมื่อไม่ได้ใช้งานเกิน&nbsp;&nbsp;</span>'));
    $(minuteValueLockBox).append($(minuteValue));
    $(minuteValueLockBox).append($('<span>&nbsp;&nbsp;นาที่&nbsp;&nbsp;(สูงสุด 60 นาที)</span>'));

    let unlockOptionControl = $('<div id="UnlockOptionControl"></div>');
    let unlockOptionSwitchOption = {onActionCallback: ()=>{console.log('one');}, offActionCallback: ()=>{console.log('two');} };
		let unlockOptionSwitch = $(unlockOptionControl).readystate(unlockOptionSwitchOption);
    if (profile.Profile.screen.unlock == 1) {
      unlockOptionSwitch.onAction();
    } else {
      unlockOptionSwitch.offAction();
    }
    $(unlockOptionControl).appendTo($(unlockOptionBox)); //&nbsp;&nbsp;
    $(unlockOptionBox).append($('<label style="position: absolute; top: 5px; left: 70px;">ต้องการใช้ Password ในการปลดล็อค</label>'));

    return $(lockOptionRow);
  }

  const doCreatePageCmd = function(pageHandle, saveCallBack){
    let cmdBar = $('<div style="width: 100%; margin-top: 5px; text-align: center;"></div>');
    let saveCmd = $('<input type="button" value=" Save "/>');
    let backCmd = $('<input type="button" value=" Back "/>');
    $(saveCmd).appendTo($(cmdBar));
    $(cmdBar).append('&nbsp;&nbsp;');
    $(backCmd).appendTo($(cmdBar));
    $(backCmd).on('click', (evt)=>{$('#AcceptedCaseCmd').click()});
    $(saveCmd).on('click', (evt)=>{
      let webmessageSwitchControl = $(pageHandle).find('#WebmessageSwitchControl').find('input[type=checkbox]').prop('checked');
      let lineSwitchControl = $(pageHandle).find('#LineSwitchControl').find('input[type=checkbox]').prop('checked');
      let autocallSwitchControl = $(pageHandle).find('#AutocallSwitchControl').find('input[type=checkbox]').prop('checked');
      let mancallSwitchControl = $(pageHandle).find('#MancallSwitchControl').find('input[type=checkbox]').prop('checked');
      let caseAcccallSwitchControl = $(pageHandle).find('#CaseAcccallSwitchControl').find('input[type=checkbox]').prop('checked');
      let minuteValue = $(pageHandle).find('#MinuteValue').val();
      let unlockOptionControl = $(pageHandle).find('#UnlockOptionControl').find('input[type=checkbox]').prop('checked');
			let readyState = $('#ReadyState').find('input[type=checkbox]').prop('checked');
      if ((minuteValue > 0) && (minuteValue < 61)) {
        $(pageHandle).find('#MinuteValue').css('border', '');
        let profileValue = {
					readyState: readyState? 1:0,
          screen: {
            lock: minuteValue,
            unlock: unlockOptionControl? 1:0
          },
          autoacc: caseAcccallSwitchControl? 1:0,
          casenotify: {
            webmessage: webmessageSwitchControl? 1:0,
            line: lineSwitchControl? 1:0,
            autocall: autocallSwitchControl? 1:0,
            mancall: mancallSwitchControl? 1:0
          }
        }
        saveCallBack(profileValue);
      } else {
        $(pageHandle).find('#MinuteValue').css('border', '1px solid red');
        $.notify("ต่าจำนวนนาทีต้องมีค่าระหว่าง 1-60", "error");
      }
    });
    return $(cmdBar);
  }

  const doCallSaveMyProfile = function(profileData){
    return new Promise(async function(resolve, reject) {
      $('body').loading('start');
			let userdata = JSON.parse(localStorage.getItem('userdata'));
			let radioId = userdata.id;
			let rqParams = undefined;
			let apiUrl = undefined;
      let readyState = 1;
      let myProfileRes = await doCallMyProfile(radioId);
      if (myProfileRes.Record.length > 0) {
        readyState = myProfileRes.Record[0].readyState;
        apiUrl = '/api/userprofile/update';
        rqParams = {data: profileData, userId: radioId};
      } else {
        readyState = common.defaultProfile.readyState;
        apiUrl = '/api/userprofile/add';
        rqParams = {data: profileData, userId: radioId};
      }
			try {
				let response = await common.doCallApi(apiUrl, rqParams);
        if (response.status.code == 200) {
          userdata.userprofiles.splice(0,userdata.userprofiles.length);
          profileData.readyState = readyState;
          userdata.userprofiles.push({Profile: profileData});
          localStorage.setItem('userdata', JSON.stringify(userdata));
          $.notify("บันทึกการคั้งค่าสำเร็จ", "success");
        } else {
          $.notify("บันทึกการคั้งค่าไม่สำเร็จ", "error");
        }
        $('body').loading('stop');
        resolve(response);
			} catch(e) {
        $.notify("มีความผิดพลาดขณะบันทึกการคั้งค่า", "error");
        $('body').loading('stop');
	      reject(e);
    	}
    });
  }

  const doCallMyProfile = function(radioId){
    return new Promise(async function(resolve, reject) {
			let rqParams = {};
			let apiUrl = '/api/userprofile/select/' + radioId;
			try {
				let response = await common.doCallApi(apiUrl, rqParams);
        resolve(response);
			} catch(e) {
	      reject(e);
    	}
    });
  }

  const doCreateProfilePage = function(){
    return new Promise(async function(resolve, reject) {
      $('body').loading('start');
			const userdata = JSON.parse(localStorage.getItem('userdata'));
      let myProfilePage = $('<div style="width: 100%;"></div>');
      let myProfileView = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');
      let myLockOptionBox = $('<div style="width: 100%;"></div>');
      $(myProfileView).appendTo($(myProfilePage));
      $(myLockOptionBox).appendTo($(myProfilePage));
      let headerRow = doCreateHeader();
      $(headerRow).appendTo($(myProfileView));
      let statusNameColumnWidth = $(headerRow).find('#StatusNameColumn').css('width');
      let myProfileRes = await doCallMyProfile(userdata.id);
      let myProfile = undefined;
      if (myProfileRes.Record.length > 0) {
        myProfile = myProfileRes.Record[0];
      } else {
        //myProfile = common.defaultProfile;
        myProfile = userdata.userprofiles[0];
      }
      let activeRow = doCreateActiveRow(myProfile);
      let lockRow = doCreateLockRow(myProfile);
      let offlineRow = doCreateOfflinekRow(myProfile);
      let lockOptionRow = doCreateLockOptionRow(myProfile, statusNameColumnWidth);
      let cmdBar = doCreatePageCmd(myProfilePage, (ob)=>{doCallSaveMyProfile(ob);});
      $(activeRow).appendTo($(myProfileView));
      $(lockRow).appendTo($(myProfileView));
      $(offlineRow).appendTo($(myProfileView));
      $(lockOptionRow).appendTo($(myLockOptionBox));
      $(cmdBar).appendTo($(myProfilePage));
      resolve($(myProfilePage));
      $('body').loading('stop');
    });
  }

  return {
    doCreateProfileTitlePage,
    doCallMyProfile,
    doCreateProfilePage
	}
}
