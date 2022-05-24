module.exports = function ( jq ) {
	const $ = jq;

	//const welcome = require('./welcome.js')($);

  const common = require('../../../home/mod/common-lib.js')($);
	const user = require('./user-mng.js')($);
	const customer = require('./customer-mng.js')($);
	const menugroup = require('./menugroup-mng.js')($);
	const menuitem = require('./menuitem-mng.js')($);
	const order = require('./order-mng.js')($);
	const template = require('./template-design.js')($);

  const doCreateTitlePage = function(shopData){
    let shopLogoIcon = new Image();
    if (shopData['Shop_LogoFilename'] !== ''){
    	shopLogoIcon.src = shopData['Shop_LogoFilename'];
    } else {
    	shopLogoIcon.src = '/shop/favicon.ico'
    }
    $(shopLogoIcon).css({"width": "140px", "height": "auto", "padding": "2px", "border": "2px solid #ddd"});
    let shopName = $('<h2>' + shopData['Shop_Name'] + '</h2>').css({'line-height': '20px'});
    let shopAddress = $('<p>' + shopData['Shop_Address'] + '</p>').css({'line-height': '11px'});
    let shopTel = $('<p>โทร. ' + shopData['Shop_Tel'] + '</p>').css({'line-height': '11px'});
    let shopMail = $('<p>อีเมล์ ' + shopData['Shop_Mail'] + '</p>').css({'line-height': '11px'});
    let shopVatNo = $('<p>หมายเลขผู้เสียภาษี ' + shopData['Shop_VatNo'] + '</p>').css({'line-height': '11px'});

    let backCmd = $('<input type="button" value=" Back " class="action-btn"/>');
    $(backCmd).on('click', (evt)=>{
      const main = require('../main.js');
      main.doShowShopItems();
    });

    let titlePageBox = $('<div style="padding: 4px;"></viv>').css({'width': '99.1%', 'text-align': 'center', 'font-size': '18px', 'border': '2px solid black', 'border-radius': '5px', 'background-color': 'grey', 'color': 'white'});
    let layoutPage = $('<table width="100%" cellspacing="0" cellpadding="0" border="0"></table>');
    let layoutRow = $('<tr></tr>');
    let letfSideCell = $('<td width="15%" align="center" valign="middle"></td>');
    let middleCell = $('<td width="70%" align="left" valign="middle"></td>');
    let rightSideCell = $('<td width="*" align="center" valign="middle"></td>');
    $(letfSideCell).append($(shopLogoIcon));
    $(middleCell).append($(shopName)).append($(shopAddress)).append($(shopTel)).append($(shopMail)).append($(shopVatNo));
    $(rightSideCell).append($(backCmd));
    $(layoutRow).append($(letfSideCell)).append($(middleCell)).append($(rightSideCell));
    $(layoutPage).append($(layoutRow));
    return $(titlePageBox).append($(layoutPage));
  }

  const doCreateContolShopCmds = function(shopData){
    let commandsBox = $('<div style="padding: 4px;"></viv>').css({'width': '99.1%', 'text-align': 'left', 'font-size': '14px', 'border': '2px solid black', 'border-radius': '5px', 'background-color': 'grey', 'color': 'white', 'margin-top': '10px'});
    let userMngCmd = $('<input type="button" value=" ผู้ใช้งาน " class="action-btn"/>').css({'margin-left': '10px'});
    $(userMngCmd).on('click', (evt)=>{
      doUserMngClickCallBack(evt, shopData);
    });
    let customerMngCmd = $('<input type="button" value=" รายการลูกค้า " class="action-btn"/>').css({'margin-left': '10px'});
    $(customerMngCmd).on('click', (evt)=>{
      doCustomerMngClickCallBack(evt, shopData);
    });
    let menugroupMngCmd = $('<input type="button" value=" รายการกลุ่มสินค้า " class="action-btn"/>').css({'margin-left': '10px'});
    $(menugroupMngCmd).on('click', (evt)=>{
      doMenugroupMngClickCallBack(evt, shopData);
    });
    let menuitemMngCmd = $('<input type="button" value=" รายการสินค้า " class="action-btn"/>').css({'margin-left': '10px'});
    $(menuitemMngCmd).on('click', (evt)=>{
      doMenuitemMngClickCallBack(evt, shopData);
    });

    let orderMngCmd = $('<input type="button" value=" ออร์เดอร์ " class="action-btn"/>').css({'margin-left': '10px'});
    $(orderMngCmd).on('click', (evt)=>{
      doOrderMngClickCallBack(evt, shopData);
    });

		let templateMngCmd = $('<input type="button" value=" รูปแบบเอกสาร " class="action-btn"/>').css({'margin-left': '10px'});
    $(templateMngCmd).on('click', (evt)=>{
      doTemplateMngClickCallBack(evt, shopData);
    });

    return $(commandsBox).append($(orderMngCmd)).append($(menuitemMngCmd)).append($(menugroupMngCmd)).append($(customerMngCmd)).append($(userMngCmd)).append($(templateMngCmd));
  }

  const doShowShopMhg = function(shopData){
    let titlePage = doCreateTitlePage(shopData);
    $('#App').empty().append($(titlePage));
    let shopCmdControl = doCreateContolShopCmds(shopData);
		let workingAreaBox = $('<div id="WorkingAreaBox" style="padding: 4px;"></viv>').css({'width': '99.1%', 'font-size': '14px' /*, 'border': '2px solid black', 'border-radius': '0px'*/});
		$(workingAreaBox).css({'margin-top': '8px'});
    $('#App').append($(shopCmdControl)).append($(workingAreaBox));
		let orderMngCmd = $(shopCmdControl).children(":first");
		$(orderMngCmd).click();
  }

  const doUserMngClickCallBack = async function(evt, shopData){
		let workingAreaBox = $('#WorkingAreaBox');
		await user.doShowUserItem(shopData, workingAreaBox);
  }

  const doCustomerMngClickCallBack = async function(evt, shopData){
    let workingAreaBox = $('#WorkingAreaBox');
		await customer.doShowCustomerItem(shopData, workingAreaBox)
  }

  const doMenugroupMngClickCallBack = async function(evt, shopData){
		let workingAreaBox = $('#WorkingAreaBox');
		await menugroup.doShowMenugroupItem(shopData, workingAreaBox)
  }

  const doMenuitemMngClickCallBack = async function(evt, shopData){
		let workingAreaBox = $('#WorkingAreaBox');
		await menuitem.doShowMenuitemItem(shopData, workingAreaBox)
  }

  const doOrderMngClickCallBack = async function(evt, shopData){
		let workingAreaBox = $('#WorkingAreaBox');
		await order.doShowOrderList(shopData, workingAreaBox)
  }

	const doTemplateMngClickCallBack = async function(evt, shopData){
		let workingAreaBox = $('#WorkingAreaBox');
		await template.doShowTemplateDesign(shopData, workingAreaBox)
	}

  return {
    doShowShopMhg
	}
}
