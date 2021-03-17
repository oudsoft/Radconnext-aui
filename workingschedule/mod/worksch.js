module.exports = function ( jq ) {
	const $ = jq;

	const doCallApi = function(url, rqParams) {
		return new Promise(function(resolve, reject) {
			$.post(url, rqParams).then((response) => {
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
			})
		});
	}

	const doGetApi = function(url, rqParams) {
		return new Promise(function(resolve, reject) {
			$.get(url, rqParams).then((response) => {
				resolve(response);
			}).catch((err) => {
				console.log(JSON.stringify(err));
			})
		});
	}

	const urlQueryToObject = function(url) {
  	let result = url.split(/[?&]/).slice(1).map(function(paramPair) {
  				return paramPair.split(/=(.+)?/).slice(0, 2);
  		}).reduce(function (obj, pairArray) {
  				obj[pairArray[0]] = pairArray[1];
  				return obj;
  		}, {});
  	return result;
  }

	const doLoadHospitalData = function(hosId){
		return new Promise(async function(resolve, reject) {
			let calParams = {hospitalId: hosId};
			let callUrl = '/api/hospital/select/' + hosId;
			let hosDataRes = await doCallApi(callUrl, calParams);
			let hosData = hosDataRes.Record;
			let fieldNames = Object.keys(hosData);
			let hosDataDiv = $('<div id="HosDataDiv" style="display: table"></div>');
			await fieldNames.forEach((item, i) => {
				let divRow = $('<div style="display: table-row"></div>');
				$(hosDataDiv).append($(divRow));
				let fieldNameCell = $('<div style="display: table-cell; width: 150px; background-color: gray; color: white;"></div>');
				$(fieldNameCell).append(item);
				$(fieldNameCell).appendTo($(divRow));
				let fieldValueCell = $('<div style="display: table-cell; background-color: lightgray;"></div>');
				$(fieldValueCell).append(Object.values(hosData)[i]);
				$(fieldValueCell).appendTo($(divRow));
			});
			resolve($(hosDataDiv));
		});
	}

	const doLoadHospitalWorkingHour = function(hosId){
		return new Promise(async function(resolve, reject) {
			let wkHourListDiv = $('<table id="WkHourListDiv" width="100%"></table>');
			let addWHRow = $('<tr style="background-color: green; color: white;"></tr>');
			$(wkHourListDiv).append($(addWHRow));
			let titleCell = $('<td align="left" colspan="4"><b>รายการแบ่งกะเข้าเวร</b></td>');
			$(addWHRow).append($(titleCell));
			let addWHCell = $('<td align="left"></td>');
			$(addWHRow).append($(addWHCell));
			let addWHCmd = $('<div id="AddWHCmd" style="padding:5px; width: 50px; text-align: center; background-color: white; color: green; float: right; cursor: pointer;">+</div>');
			$(addWHCmd).appendTo($(addWHCell));
			$(addWHCmd).click((e)=>{
				let callAddWHUrl = '/api/workinghour/add';
				let addformRow = doCreateWHForm(hosId, callAddWHUrl);
				$(wkHourListDiv).append($(addformRow));
			});
			let headerRow = $('<tr style="background-color: green; color: white;"></tr>');
			$(wkHourListDiv).append($(headerRow));
			let headerCell = $('<td align="center" width="10%">#</td><td align="center" width="20%">ชื่อกะ</td><td align="center" width="15%">จาก ชม. ที่</td><td align="center" width="15%">ถึง ชม. ที่</td><td align="center" width="20%">คำสั่ง</td>');
			$(headerRow).append($(headerCell));

			let calParams = {hospitalId: hosId};
			let callUrl = '/api/workinghour/list';
			let wkHourListRes = await doCallApi(callUrl, calParams);
			let wkHourData = wkHourListRes.Records;
			wkHourData.forEach((item, i) => {
				let no = i + 1;
				let whName = item.WH_Name;
				let obWH = JSON.parse(item.WH);
				let dataRow = $('<tr id="WH-' + item.id + '"></tr>');
				let dataCell = $('<td align="center">' + no + '</td><td align="left">' + whName + '</td><td align="center">' + obWH.from + '</td><td align="center">' + obWH.to + '</td>');
				$(dataRow).append($(dataCell));
				let cmdCell = $('<td align="center"></td>');
				$(cmdCell).appendTo($(dataRow));

				let updateCmd = $('<input type="button" id="UpdateCmd-'+ item.id + '" value=" แก้ไข "/>');
				$(updateCmd).appendTo($(cmdCell));
				let deleteCmd = $('<input type="button" value=" ลบ "/>');
				$(deleteCmd).appendTo($(cmdCell));

				$(updateCmd).click(async (e)=>{
					let eventData = {whId: item.id, whData: item};
					$(updateCmd).trigger('updateitem', [eventData]);
					$(dataRow).hide();
				});
				$(deleteCmd).click(async (e)=>{
					let eventData = {whId: item.id};
					$(deleteCmd).trigger('deleteitem', [eventData]);
				});
				$(wkHourListDiv).append($(dataRow));
			});

			$(wkHourListDiv).on('updateitem', (e, data)=>{
				let whId = data.whId;
				let callUpdateWHUrl = '/api/workinghour/update';
				let updateFormRow = doCreateWHForm(hosId, callUpdateWHUrl, data.whData);
				$(wkHourListDiv).append($(updateFormRow));
			});

			$(wkHourListDiv).on('deleteitem', async (e, data)=>{
				let userConfirm = confirm('โปรดยืนยันเพื่อลบรายการนี้ โดยคลิกปุ่ม ตกลง หรือ OK');
		  	if (userConfirm == true){
		  		$('body').loading('start');
					let whId = data.whId;
					let deleteParams = {id: whId};
					let callDeleteWHUrl = '/api/workinghour/delete';
					let wkHourRes = await doCallApi(callDeleteWHUrl, deleteParams);
					if (wkHourRes.status.code == 200) {
						$.notify('ลบข้อมูลได้สำเร็จ', "success");
						let eventData = {};
						$(wkHourListDiv).trigger('updatelist', [eventData]);
					} else {
						$.notify('ไม่สามารถลบข้อมูลได้ในขณะนี้', "error");
					}
					$('body').loading('stop');
				}
			});

			$(wkHourListDiv).on('releaselock', (e, data)=>{
				$(wkHourListDiv).find('#WH-' + data.id).show();
				$(wkHourListDiv).find('#UpdateCmd-' + data.id).prop('disable', false);
			});

			resolve($(wkHourListDiv));
		});
	}

	function doCreateWHForm(hosId, callUrl, data){
		const whFormRow = $('<tr id="WHForm" style="background-color: green; color: white;"></tr>');
		let whForm;
		if (data) {
			whForm = $('<td align="left">' + data.id + '</td><td align="left"><input type="text" id="WHName" size="30" /></td><td align="left"><input type="number" id="WHFrom" size="10"/></td><td align="left"><input type="number" id="WHTo" size="10"/></td><td align="center"><input type="button" id="SaveCmd" value=" บันทึก "/>  <input type="button" id="CancelCmd" value=" ยกเลิก "/></td>');
			let wh = JSON.parse(data.WH);
			$(whForm).find('#WHName').val(data.WH_Name);
			$(whForm).find('#WHFrom').val(wh.from);
			$(whForm).find('#WHTo').val(wh.to);
		} else {
			whForm = $('<td align="left">#</td><td align="left"><input type="text" id="WHName" size="30"/></td><td align="left"><input type="number" id="WHFrom" size="10"/></td><td align="left"><input type="number" id="WHTo" size="10"/></td><td align="center"><input type="button" id="SaveCmd" value=" บันทึก "/>  <input type="button" id="CancelCmd" value=" ยกเลิก "/></td>');
		}
		$(whFormRow).append($(whForm));
		$(whForm).find('#SaveCmd').click(async (e)=>{
			let whParams;
			if (data) {
				whParams = doVerifyForm(whForm, hosId, data.id);
			} else {
				whParams = doVerifyForm(whForm, hosId);
			}
			if (whParams) {
				let wkHourRes = await doCallApi(callUrl, whParams);
				if (wkHourRes.status.code == 200) {
					$.notify('บันทึกข้อมูลสำเร็จ', "success");
					let eventData = {};
					$(whFormRow).trigger('updatelist', [eventData]);
					setTimeout(()=>{
						$(whFormRow).remove();
					}, 400);
				} else {
					$.notify('ไม่สามารถบันทึกข้อมูลได้ในขณะนี้', "error");
				}
			}
		});
		$(whForm).find('#CancelCmd').click((e)=>{
			$(whForm).trigger('releaselock', [data]);
			$(whFormRow).remove();
		});
		return $(whFormRow);
	}

	function doVerifyForm(form, hosId, itemId) {
		let wkName = $(form).find('#WHName').val();
		let whFrom = Number($(form).find('#WHFrom').val());
		let whTo = Number($(form).find('#WHTo').val());
		if (wkName === '') {
			$(form).find('#WHName').css('border', '1px solid red');
			return;
		} else if ((whFrom <= 0) && (whFrom >= 25)) {
			$(form).find('#WHName').css('border', '');
			$(form).find('#WHFrom').css('border', '1px solid red');
			return;
		} else if ((whTo <= 0) && (whTo >= 25)) {
			$(form).find('#WHFrom').css('border', '');
			$(form).find('#WHTo').css('border', '1px solid red');
			return;
		} else {
			$(form).find('#WHTo').css('border', '');
			if (itemId) {
				let updateWHParams = {id: itemId, data: {WHName: wkName, WH: {from: whFrom, to: whTo}}};
				return updateWHParams;
			} else {
				let addWHParams = {hospitalId: hosId, data: {WHName: wkName, WH: {from: whFrom, to: whTo}}};
				return addWHParams;
			}
		}
	}

	return {
		doCallApi,
		doGetApi,
		urlQueryToObject,
		doLoadHospitalData,
		doLoadHospitalWorkingHour
	}
}
