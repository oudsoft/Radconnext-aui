module.exports = function ( jq ) {
	const $ = jq;

	//const welcome = require('./welcome.js')($);
	//const login = require('./login.js')($);
  const common = require('../../../home/mod/common-lib.js')($);

  const doCreateFormDlg = function(shopData, successCallback) {
    return new Promise(async function(resolve, reject) {
      let menugroups = JSON.parse(localStorage.getItem('menugroups'));
      let menuitems = JSON.parse(localStorage.getItem('menuitems'));
      let wrapperBox = $('<div></div>');
      let searchInputBox = $('<div></div>').css({'width': '100%', 'padding': '4px'});
      let gooditemListBox = $('<div></div>').css({'width': '100%', 'padding': '4px', 'min-height': '200px'});
      let searchKeyInput = $('<input type="text" size="40" value="*"/>');
      let gooditemResult = undefined;
      $(searchKeyInput).css({'background': 'url(../../images/search-icon.png) no-repeat right center', 'background-size': '6% 100%', 'padding-right': '3px'});
      $(searchKeyInput).on('keyup', async (evt)=>{
        let key = $(searchKeyInput).val();
        if (key !== ''){
          if (key === '*') {
            gooditemResult = await doShowList(menuitems, successCallback);
          } else {
            let gooditemFilter = await doFilterGooditem(menuitems, key);
            gooditemResult = await doShowList(gooditemFilter, successCallback);
          }
          $(gooditemListBox).empty().append($(gooditemResult));
        }
      });
      let addGoodItemCmd = $('<input type="button" value=" เพิ่มสินค้า " class="action-btn"/>').css({'margin-left': '10px'});
      $(addGoodItemCmd).on('click', (evt)=>{
        //$(wrapperBox).empty();
        $(searchInputBox).hide();
        $(gooditemListBox).hide();
        let newGooditemForm = doShowAddGooditemForm(shopData, async(newGooditems)=>{
          gooditems = newGooditems;
          $(newGooditemForm).remove();
          $(searchInputBox).show();
          $(gooditemListBox).show();
          gooditemResult = await doShowList(gooditems, successCallback);
          $(gooditemListBox).empty().append($(gooditemResult));
        });
        $(wrapperBox).append($(newGooditemForm))
      });
      $(searchInputBox).append($(searchKeyInput)).append($(addGoodItemCmd));
      gooditemResult = await doShowList(menuitems, successCallback);
      $(gooditemListBox).empty().append($(gooditemResult));
      $(wrapperBox).append($(searchInputBox)).append($(gooditemListBox));
      resolve($(wrapperBox));
    });
  }

  const doFilterGooditem = function(gooditems, key){
    return new Promise(async function(resolve, reject) {
      if (key === '*') {
        resolve(gooditems);
      } else {
        let result = gooditems.filter((item)=>{
          let n = item.MenuName.search(key);
          if (n >= 0) {
            return item;
          }
        });
        resolve(result);
      }
    });
  }

  const doShowList = function(results, successCallback){
    return new Promise(async function(resolve, reject) {
      let gooditemTable = $('<table width="100%" cellspacing="0" cellpadding="0" border="0"></table>');
      let	promiseList = new Promise(async function(resolve2, reject2){
        for (let i=0; i < results.length; i++){
          let resultRow = $('<tr></tr>').css({'cursor': 'pointer', 'padding': '4px'});
          $(resultRow).hover(()=>{
            $(resultRow).css({'background-color': 'grey', 'color': 'white'});
          },()=>{
            $(resultRow).css({'background-color': '#ddd', 'color': 'black'});
          });
          let qtyInput = $('<input type="text" value="1" tabindex="3"/>').css({'width': '40px'});
          $(qtyInput).on('keyup', (evt)=>{
            if (evt.keyCode == 13) {
              $(resultRow).click();
            }
          });
          $(resultRow).on('click', (evt)=>{
            let qtyValue = $(qtyInput).val();
            if (qtyValue > 0) {
              $(qtyInput).css({'border': ''});
              let applyResult = results[i];
              applyResult.Qty = qtyValue;
              successCallback(applyResult);
            } else {
              $(qtyInput).css({'border': '1px solid red'});
            }
          });
          let pictureCell = $('<td width="10%" align="center"></td>').css({'padding-top': '10px', 'padding-bottom': '10px'});
          if (results[i].MenuPicture){
            let picture = $('<img src="' + results[i].MenuPicture + '"/>').css({'width': '40px', 'height': 'auto'});
            $(pictureCell).append($(picture));
          }
          let nameCell = $('<td width="30%" align="left">' + results[i].MenuName + '</td>').css({'padding-top': '10px', 'padding-bottom': '10px'});
          let qtyCell = $('<td width="10%" align="left"></td>').css({'padding-top': '10px', 'padding-bottom': '10px'});
          let priceCell = $('<td width="10%" align="left">' + common.doFormatNumber(results[i].Price) + '</td>').css({'padding-top': '10px', 'padding-bottom': '10px'});
          let unitCell = $('<td width="15%" align="left">' + results[i].Unit + '</td>').css({'padding-top': '10px', 'padding-bottom': '10px'});
          let groupCell = $('<td width="*" align="left">' + results[i].menugroup.GroupName + '</td>').css({'padding-top': '10px', 'padding-bottom': '10px'});
          $(qtyCell).append($(qtyInput)).append($('<span>*</spam>').css({'color': 'red'}));
          $(resultRow).append($(pictureCell)).append($(nameCell)).append($(qtyCell)).append($(priceCell)).append($(unitCell)).append($(groupCell));
          $(gooditemTable).append($(resultRow));
        }
        setTimeout(()=>{
          resolve2($(gooditemTable));
        }, 100);
      });
      Promise.all([promiseList]).then((ob)=>{
        resolve(ob[0]);
      });
    });
  }

  const doShowAddGooditemForm = function(shopData, successCallback){
    let form = $('<table width="100%" cellspacing="0" cellpadding="0" border="0"></table>');
    let formRow = $('<tr></tr>');
    let nameCell = $('<td width="20%" align="left"></td>');
    let priceCell = $('<td width="10%" align="left"></td>');
    let unitCell = $('<td width="15%" align="left"></td>');
    let groupCell = $('<td width="30%" align="left"></td>');
    let commandCell = $('<td width="*" align="left"></td>');
    let nameInput = $('<input type="text" placeholder="ชื่อรายการสินค้า"/>').css({'width': '110px'});
    let priceInput = $('<input type="text" placeholder="ราคา"/>').css({'width': '40px'});
    let unitInput = $('<input type="text" placeholder="หน่วยขาย"/>').css({'width': '70px'});
    let groupSelect = $('<select></select>').css({'width': '100px'});
    let menugroups = JSON.parse(localStorage.getItem('menugroups'));
    menugroups.forEach((item, i) => {
      $(groupSelect).append($('<option value="' + item.id + '">' + item.GroupName + '</option>'));
    });

    let saveCmd = $('<input type="button" value=" บันทึกสินต้า " class="action-btn"/>');
    $(saveCmd).on('click', async (evt)=>{
      let nameValue = $(nameInput).val();
      let priceValue = $(priceInput).val();
      let unitValue = $(unitInput).val();
      if (nameValue !== '') {
        $(nameInput).css({'border': ''});
        if (priceValue !== '') {
          $(priceInput).css({'border': ''});
          if (unitValue !== '') {
            $(unitInput).css({'border': ''});
            let groupId = $(groupSelect).val();
            let newMenuitemData = {MenuName: nameValue, Price: priceValue, Unit: unitValue};
            let params = {data: newMenuitemData, shopId: shopData.id, groupId: parseInt(groupId)};
            let menuitemRes = await common.doCallApi('/api/shop/menuitem/add', params);
            if (menuitemRes.status.code == 200) {
              $.notify("เพิ่มรายการสินค้าสำเร็จ", "success");
              let menuitems = JSON.parse(localStorage.getItem('menuitems'));
              menuitems.push(menuitemRes.Record);
              localStorage.setItem('menuitems', JSON.stringify(menuitems));
              successCallback(menuitems);
            } else if (menuitemRes.status.code == 201) {
              $.notify("ไม่สามารถเพิ่มรายการสินค้าได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "warn");
            } else {
              $.notify("เกิดข้อผิดพลาด ไม่สามารถเพิ่มรายการสินค้าได้", "error");
            }
          } else {
            $(unitInput).css({'border': '1px solid red'});
          }
        } else {
          $(priceInput).css({'border': '1px solid red'});
        }
      } else {
        $(nameInput).css({'border': '1px solid red'});
      }
    });
    $(nameCell).append($(nameInput)).append($('<span>*</span>').css({'margin-left': '5px', 'color': 'red'}));
    $(priceCell).append($(priceInput)).append($('<span>*</span>').css({'margin-left': '5px', 'color': 'red'}));
    $(unitCell).append($(unitInput)).append($('<span>*</span>').css({'margin-left': '5px', 'color': 'red'}));
    $(groupCell).append($(groupSelect));
    $(commandCell).append($(saveCmd));
    $(formRow).append($(nameCell)).append($(priceCell)).append($(unitCell)).append($(groupCell)).append($(commandCell));
    return $(form).append($(formRow));
  }

  return {
    doCreateFormDlg
	}
}
