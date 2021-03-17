/* userinfolib.js */
module.exports = function ( jq ) {
	const $ = jq;

  const util = require('./utilmod.js')($);
  const apiconnector = require('./apiconnect.js')($);
  const common = require('./commonlib.js')($);

  function doCallUpdateUserInfo(data) {
    return new Promise(function(resolve, reject) {
      var updateUserApiUri = '/api/user/update';
      var params = data;
      $.post(updateUserApiUri, params, function(response){
  			resolve(response);
  		}).catch((err) => {
  			console.log(JSON.stringify(err));
  		})
  	});
  }

  function doCallUserInfo(userId) {
    return new Promise(function(resolve, reject) {
      var userInfoApiUri = '/api/user/' + userId;
      var params = {};
      $.get(userInfoApiUri, params, function(response){
  			resolve(response);
  		}).catch((err) => {
  			console.log(JSON.stringify(err));
  		})
  	});
  }

  function doSaveUserProfile(newUserInfo){
  	doCallUpdateUserInfo(newUserInfo).then((updateRes)=>{
  		if (updateRes.Result === "OK") {
  			doCallUserInfo(newUserInfo.userId).then((userInfoRes)=>{
  				//update userdata in localstorage
  				let newUserInfo = userInfoRes.Record.info;
  				let yourUserdata = JSON.parse(localStorage.getItem('userdata'));
  				yourUserdata.userinfo = newUserInfo;
  				localStorage.setItem('userdata', JSON.stringify(yourUserdata));
					doDisplayUserFullName(yourUserdata);
  				$.notify("บันทึกการแก้ไขจ้อมูลของคุณ่เข้าสู่ระบบสำเร็จ", "success");
  				$("#dialog").find('#CloseUserProfile-Cmd').click();
  			});
  		} else {
  			$.notify("เกิดความผิดพลาด ไม่สามารถบันทึกการแก้ไขจ้อมูลของคุณ่เข้าสู่ระบบได้ในขณะนี้", "error");
  		}
  	});
  }

  const doShowUserProfile = function() {
  	$("#dialog").load('../form/dialog.html', function() {
  		const createFormFragment = function(fragId, fragLabel, fragValue) {
  			let fragRow = $('<div style="display: table-row; padding: 2px; background-color: gray;"></div>');
  			let labelCell = $('<div style="display: table-cell; width: 200px; padding: 2px;"></div>');
  			$(labelCell).html('<b>' + fragLabel + '</b>');
  			let inputCell = $('<div style="display: table-cell; padding: 2px;"></div>');
  			let fragInput = $('<input type="text"/>');
  			$(fragInput).attr('id', fragId);
  			$(fragInput).val(fragValue);
  			$(fragInput).appendTo($(inputCell));
  			$(labelCell).appendTo($(fragRow));
  			$(inputCell).appendTo($(fragRow));
  			return $(fragRow);
  		}

  		let yourUserdata = JSON.parse(localStorage.getItem('userdata'));
  		let table = $('<div style="display: table; width: 100%;"></div>');

  		let yourNameENFrag = createFormFragment('UserNameEN', 'ชื่อ(ภาษาอังกฤษ)์', yourUserdata.userinfo.User_NameEN);
  		$(yourNameENFrag).appendTo($(table));

  		let yourLastNameENFrag = createFormFragment('UserLastNameEN', 'นามสกุล(ภาษาอังกฤษ)์', yourUserdata.userinfo.User_LastNameEN);
  		$(yourLastNameENFrag).appendTo($(table));

  		let yourNameTHFrag = createFormFragment('UserNameTH', 'ชื่อ(ภาษาไทย)', yourUserdata.userinfo.User_NameTH);
  		$(yourNameTHFrag).appendTo($(table));

  		let yourLastNameTHFrag = createFormFragment('UserLastNameTH', 'นามสกุล(ภาษาไทย)', yourUserdata.userinfo.User_LastNameTH);
  		$(yourLastNameTHFrag).appendTo($(table));

  		let yourEmailFrag = createFormFragment('UserEmail', 'อีเมล์', yourUserdata.userinfo.User_Email);
  		$(yourEmailFrag).appendTo($(table));

  		let yourPhoneFrag = createFormFragment('UserPhone', 'โทรศัพท์', yourUserdata.userinfo.User_Phone);
  		$(yourPhoneFrag).appendTo($(table));

  		let yourLineIDFrag = createFormFragment('UserLineID', 'Line ID', yourUserdata.userinfo.User_LineID);
  		$(yourLineIDFrag).appendTo($(table));

			let yourDefaultDownloadPathFrag = createFormFragment('UserPathRadiant', 'โฟลเดอร์ดาวน์โหลด Dicom', yourUserdata.userinfo.User_PathRadiant);
  		$(yourDefaultDownloadPathFrag).appendTo($(table));

  		$('#UserProfileBox').empty().append($(table));
  		$(".modal-footer").css('text-align', 'center');
  		$("#SaveUserProfile-Cmd").click((evt)=>{

  			let newNameEN = $(table).find('#UserNameEN').val();
  			let newLastNameEN = $(table).find('#UserLastNameEN').val();
  			let newNameTH = $(table).find('#UserNameTH').val();
  			let newLastNameTH = $(table).find('#UserLastNameTH').val();
  			let newEmail = $(table).find('#UserEmail').val();
  			let newPhone = $(table).find('#UserPhone').val();
  			let newLineID = $(table).find('#UserLineID').val();
				let newPathRadiant = $(table).find('#UserPathRadiant').val();
  			if (newNameEN === '') {
  				$(table).find('#UserNameEN').css('border', '1px solid red');
  				return;
  			} else if (newLastNameEN === '') {
  				$(table).find('#UserNameEN').css('border', '');
  				$(table).find('#UserLastNameEN').css('border', '1px solid red');
  				return;
  			} else if (newNameTH === '') {
  				$(table).find('#UserLastNameEN').css('border', '');
  				$(table).find('#UserNameTH').css('border', '1px solid red');
  				return;
  			} else if (newLastNameTH === '') {
  				$(table).find('#UserNameTH').css('border', '');
  				$(table).find('#UserLastNameTH').css('border', '1px solid red');
  				return;
  			} else if (newEmail === '') {
  				$(table).find('#UserLastNameTH').css('border', '');
  				$(table).find('#UserEmial').css('border', '1px solid red');
  				return;
				} else if (newPathRadiant	 === '') {
  				$(table).find('#UserEmial').css('border', '');
  				$(table).find('#UserPathRadiant').css('border', '1px solid red');
  				return;
  			} else {
  				$(table).find('#UserPathRadiant').css('border', '');
  				let yourNewUserInfo = {User_NameEN: newNameEN, User_LastNameEN: newLastNameEN, User_NameTH: newNameTH, User_LastNameTH: newLastNameTH, User_Email: newEmail, User_Phone: newPhone, User_LineID: newLineID, User_PathRadiant: newPathRadiant};
  				yourNewUserInfo.userId = yourUserdata.id;
  				yourNewUserInfo.infoId = yourUserdata.userinfo.id;
  				yourNewUserInfo.usertypeId = yourUserdata.usertype.id;
  				doSaveUserProfile(yourNewUserInfo);
  			}
  		});
  	});
  }

  return {
    doShowUserProfile
  }
}
