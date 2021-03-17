/* templatelib.js */
module.exports = function ( jq ) {
	const $ = jq;

	const apiconnector = require('../../case/mod/apiconnect.js')($);
  const util = require('../../case/mod/utilmod.js')($);
  const common = require('../../case/mod/commonlib.js')($);

  const onAddNewTemplateClick = async function(evt){
    const addCmd = $(evt.currentTarget);
    let jqtePluginStyleUrl = '../../lib/jqte/jquery-te-1.4.0.css';
    $('head').append('<link rel="stylesheet" href="' + jqtePluginStyleUrl + '" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="../case/css/scanpart.css" type="text/css" />');
    let jqtePluginScriptUrl = '../../lib/jqte/jquery-te-1.4.0.min.js';
    $('head').append('<script src="' + jqtePluginScriptUrl + '"></script>');

    let templateNameBox = $('<div style="width: 100%; text-align: left;"><span>ขื่อ Template:  </span></div>');
    let templateNameInput = $('<input type="text" id="TemplateName"/>');
    $(templateNameInput).appendTo($(templateNameBox));
    let templateViewBox = $('<div style="width: 100%; border: 2px solid grey; background-color: #ccc;"></div>');
    let simpleEditor = $('<input type="text" id="SimpleEditor"/>');
    $(simpleEditor).appendTo($(templateViewBox));
    $(simpleEditor).jqte();
    $(templateViewBox).find('.jqte_editor').css({ height: '350px' });
    let templateCmdBar = $('<div style="width: 100%; text-align: center; margin-top: 5px;"></div>');

    let saveCmd = $('<input type="button" value=" Save"/>');
    $(saveCmd).appendTo($(templateCmdBar));
    $(saveCmd).data('templateData', templateData);
    $(templateCmdBar).append($('<span>  </span>'));
    $(saveCmd).on('click', onSaveNewCmdClick);
    let cancelCmd = $('<input type="button" value=" Cancel "/>');
    $(cancelCmd).appendTo($(templateCmdBar));
    $(cancelCmd).on('click',(evt)=>{$(cancelCmd).trigger('opentemplatedesign')});

    $(".mainfull").empty().append($(templateNameBox)).append($(templateViewBox)).append($(templateCmdBar));
  }

  const onViewCmdClick = async function(evt) {
    const viewCmd = $(evt.currentTarget);
		const templateData = $(viewCmd).data('templateData');
    let rqParams = {};
    let apiUrl = '/api/template/select/' + templateData.templateId;
    let response = await common.doCallApi(apiUrl, rqParams);
    let templateNameBox = $('<div style="width: 100%; text-align: center;"></div>');
    let templateViewBox = $('<div style="width: 100%; border: 2px solid grey; background-color: #ccc;"></div>');
    let templateCmdBar = $('<div style="width: 100%; text-align: center; margin-top: 5px;"></div>');
    if (response.Record.length > 0) {
      $(templateNameBox).append($('<h4>' + response.Record[0].Name + '</h4>'));
      let thisTemplate = response.Record[0].Content;
      $(templateViewBox).html(thisTemplate);
      let editCmd = $('<input type="button" value=" Edit"/>');
      $(editCmd).appendTo($(templateCmdBar));
      $(editCmd).data('templateData', templateData);
      $(templateCmdBar).append($('<span>  </span>'));
      $(editCmd).on('click', onEditCmdClick);
      let backCmd = $('<input type="button" value=" Back "/>');
      $(backCmd).appendTo($(templateCmdBar));
      $(backCmd).on('click',(evt)=>{$(backCmd).trigger('opentemplatedesign')});
    } else {
      $(templateViewBox).append($('<span>ไม่พบรายการ Template รายการนี้</span>'));
    }
    $(".mainfull").empty().append($(templateNameBox)).append($(templateViewBox)).append($(templateCmdBar));
  }

  const onEditCmdClick = async function(evt) {
    const editCmd = $(evt.currentTarget);
		const templateData = $(editCmd).data('templateData');

    let jqtePluginStyleUrl = '../../lib/jqte/jquery-te-1.4.0.css';
    $('head').append('<link rel="stylesheet" href="' + jqtePluginStyleUrl + '" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="../case/css/scanpart.css" type="text/css" />');
    let jqtePluginScriptUrl = '../../lib/jqte/jquery-te-1.4.0.min.js';
    $('head').append('<script src="' + jqtePluginScriptUrl + '"></script>');

    let rqParams = {};
    let apiUrl = '/api/template/select/' + templateData.templateId;
    let response = await common.doCallApi(apiUrl, rqParams);
    let templateNameBox = $('<div style="width: 100%; text-align: left;"><span>ขื่อ Template:  </span></div>');
    let templateNameInput = $('<input type="text" id="TemplateName"/>');
    $(templateNameInput).appendTo($(templateNameBox));
    let templateViewBox = $('<div style="width: 100%; border: 2px solid grey; background-color: #ccc;"></div>');
    let simpleEditor = $('<input type="text" id="SimpleEditor"/>');
    $(simpleEditor).appendTo($(templateViewBox));
    $(simpleEditor).jqte();
    $(templateViewBox).find('.jqte_editor').css({ height: '350px' });
    let templateCmdBar = $('<div style="width: 100%; text-align: center; margin-top: 5px;"></div>');
    if (response.Record.length > 0) {
      $(templateNameInput).val(response.Record[0].Name);
      $(templateViewBox).find('#SimpleEditor').jqteVal(response.Record[0].Content);
      let saveCmd = $('<input type="button" value=" Save"/>');
      $(saveCmd).appendTo($(templateCmdBar));
      $(saveCmd).data('templateData', templateData);
      $(templateCmdBar).append($('<span>  </span>'));
      $(saveCmd).on('click', onSaveEditCmdClick);
      let cancelCmd = $('<input type="button" value=" Cancel "/>');
      $(cancelCmd).appendTo($(templateCmdBar));
      $(cancelCmd).on('click',(evt)=>{$(cancelCmd).trigger('opentemplatedesign')});
    } else {
      $(templateViewBox).append($('<span>ไม่พบรายการ Template รายการนี้</span>'));
    }
    $(".mainfull").empty().append($(templateNameBox)).append($(templateViewBox)).append($(templateCmdBar));
  }

  const onDeleteCmdClick = async function(evt) {
    const deleteCmd = $(evt.currentTarget);
		const templateData = $(deleteCmd).data('templateData');
    let yourAnswer = confirm('โปรดยืนยันการลบ Template โดยคลิก ตกลง หรือ OK');
    if (yourAnswer === true) {
      let callDeleteTemplateUrl = '/api/template/delete';
      let templateId = templateData.templateId;
      let rqParams = {id: templateId}
      let response = await common.doCallApi(callDeleteTemplateUrl, rqParams);
      if (response.status.code == 200) {
        $.notify("ลบรายการ Template สำเร็จ", "success");
        $(deleteCmd).trigger('opentemplatedesign')
      } else {
        $.notify("ลบรายการ Template ขัดข้อง", "`error`");
      }
    }
  }

  const onSaveNewCmdClick = async function(evt){
    const saveEditCmd = $(evt.currentTarget);
		const templateData = $(saveEditCmd).data('templateData');
    let templaeName = $('#TemplateName').val();
    let templateContent = $('#SimpleEditor').val();
    let templateId = templateData.templateId;
    if (templaeName === '') {
      $.notify("ชื่อ Template ต้องไม่ว่าง", "warn");
      $('#TemplateName').css('border', '1px solid red');
    } else if (templateContent === ''){
      $('#TemplateName').css('border', '');
      $.notify("ข้อมูล Template ต้องไม่ว่าง", "warn");
      $('#SimpleEditor').css('border', '1px solid red;');
    } else {
      $('#SimpleEditor').css('border', '');
      const main = require('../main.js');
			let userdata = JSON.parse(main.doGetUserData());
			let radioId = userdata.id;

      let callAddTemplateUrl = '/api/template/add';
      let rqParams = {data: {Name: templaeName, Content: templateContent}, userId: radioId};
      let response = await common.doCallApi(callAddTemplateUrl, rqParams);
      if (response.status.code == 200) {
        $.notify("บันทึก Template สำเร็จ", "success");
        $(saveEditCmd).trigger('opentemplatedesign')
      } else {
        $.notify("บันทึก Template ขัดข้อง", "`error`");
      }
    }
  }

  const onSaveEditCmdClick = async function(evt){
    const saveEditCmd = $(evt.currentTarget);
		const templateData = $(saveEditCmd).data('templateData');
    let templaeName = $('#TemplateName').val();
    let templateContent = $('#SimpleEditor').val();
    let templateId = templateData.templateId;
    if (templaeName === '') {
      $.notify("ชื่อ Template ต้องไม่ว่าง", "warn");
      $('#TemplateName').css('border', '1px solid red');
    } else if (templateContent === ''){
      $('#TemplateName').css('border', '');
      $.notify("ข้อมูล Template ต้องไม่ว่าง", "warn");
      $('#SimpleEditor').css('border', '1px solid red;');
    } else {
      $('#SimpleEditor').css('border', '');
      let callUpdateTemplateUrl = '/api/template/update';
      let rqParams = {data: {Name: templaeName, Content: templateContent}, id: templateId};
      let response = await common.doCallApi(callUpdateTemplateUrl, rqParams);
      if (response.status.code == 200) {
        $.notify("บันทึก Template สำเร็จ", "success");
        $(saveEditCmd).trigger('opentemplatedesign')
      } else {
        $.notify("บันทึก Template ขัดข้อง", "`error`");
      }
    }
  }

  const doCreateTemplateTitlePage = function() {
    const templateTitle = 'Template';
    let templateTitleBox = $('<div class="title-content"></div>');
    let logoPage = $('<img src="/images/format-design-icon.png" width="40px" height="auto" style="float: left;"/>');
    $(logoPage).appendTo($(templateTitleBox));
    let titleText = $('<div style="float: left; margin-left: 10px; margin-top: -5px;"><h3>' + templateTitle + '</h3></div>');
    $(titleText).appendTo($(templateTitleBox));
    return $(templateTitleBox);
  }

  const doCallMyTemplate = function() {
    return new Promise(async function(resolve, reject) {
      const main = require('../main.js');
			let userdata = JSON.parse(main.doGetUserData());
			let radioId = userdata.id;
			let rqParams = {};
			let apiUrl = '/api/template/options/' + radioId;
			try {
				let response = await common.doCallApi(apiUrl, rqParams);
        resolve(response);
			} catch(e) {
	      reject(e);
    	}
    });
  }

  const doCreateHeaderRow = function(){
    let headerRow = $('<div style="display: table-row; width: 100%;"></div>');

		let headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>#</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>ขื่อ Template</span>');
		$(headColumn).appendTo($(headerRow));

    headColumn = $('<div style="display: table-cell; text-align: center;" class="header-cell"></div>');
		$(headColumn).append('<span>คำสั่ง</span>');
		$(headColumn).appendTo($(headerRow));

    return $(headerRow);
  }

  const doCreateTemplateItemRow = function(i, tmItem){
    return new Promise(function(resolve, reject) {
      const templateData = {templateId: tmItem.Value};
      let tmRow = $('<div style="display: table-row; width: 100%;"></div>');

      let tmCell = $('<div style="display: table-cell; text-align: center;"></div>');
  		$(tmCell).append('<span>' + (i+1) + '</span>');
  		$(tmCell).appendTo($(tmRow));

      tmCell = $('<div style="display: table-cell; text-align: left;"></div>');
  		$(tmCell).append('<span>' + tmItem.DisplayText + '</span>');
  		$(tmCell).appendTo($(tmRow));

      tmCell = $('<div style="display: table-cell; text-align: center;"></div>');
  		$(tmCell).appendTo($(tmRow));

      let viewCmd = $('<input type="button" value=" View "/>');
      $(viewCmd).appendTo($(tmCell));
      $(viewCmd).data('templateData', templateData);
      $(viewCmd).on('click', onViewCmdClick);
      $(tmCell).append($('<span>  </span>'));

      let editCmd = $('<input type="button" value=" Edit "/>');
      $(editCmd).appendTo($(tmCell));
      $(editCmd).data('templateData', templateData);
      $(editCmd).on('click', onEditCmdClick);
      $(tmCell).append($('<span>  </span>'));

      let deleteCmd = $('<input type="button" value=" Delete "/>');
      $(deleteCmd).appendTo($(tmCell));
      $(deleteCmd).data('templateData', templateData);
      $(deleteCmd).on('click', onDeleteCmdClick);

      resolve($(tmRow));
    });
  }

  const doCreateTemplatePage = function(){
    return new Promise(async function(resolve, reject) {
      $('body').loading('start');
      let myTemplatePage = $('<div style="width: 100%;"></div>');
      let myTemplate = await doCallMyTemplate();
      let addNewTemplateBox = $('<div style="width: 100%; text-align: right; padding: 4px;"></div>');
      let addNewTemplateCmd = $('<input type="button" value=" New Template "/>');
      $(addNewTemplateCmd).appendTo($(addNewTemplateBox));
      $(addNewTemplateCmd).on('click', onAddNewTemplateClick);
      let myTemplateView = $('<div style="display: table; width: 100%; border-collapse: collapse;"></div>');
      let tempalateHearder = doCreateHeaderRow();
      $(myTemplateView).append($(tempalateHearder));
      let templateLists = myTemplate.Options;
      if (templateLists.length > 0) {
        for (let i=0; i < templateLists.length; i++) {
          let tmItem = templateLists[i];
          let tmRow = await doCreateTemplateItemRow(i, tmItem);
          $(myTemplateView).append($(tmRow));
        }
      } else {
        let notFoundMessage = $('<h3>ไม่พบรายการ Template ของคุณในขณะนี้</h3>')
        $(myTemplateView).append($(notFoundMessage));
      }

      $(myTemplatePage).append($(addNewTemplateBox));
      $(myTemplatePage).append($(myTemplateView));
      resolve($(myTemplatePage));
      $('body').loading('stop');
    });
  }

  return {
    doCreateTemplateTitlePage,
    doCreateHeaderRow,
    doCallMyTemplate,
    doCreateTemplatePage
	}
}
