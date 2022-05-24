module.exports = function ( jq ) {
	const $ = jq;

	//const welcome = require('./welcome.js')($);
	//const login = require('./login.js')($);
  const common = require('../../../home/mod/common-lib.js')($);
  const elementProperty = require('./element-property-lib.js')($);
  let activeType, activeElement;

  const A4Width = 1004;
  const A4Height = 1410;

  const templateTypes = [
    {id: 1, NameEN: 'Invoice', NameTH: 'ใบแจ้งหนี้'},
    {id: 2, NameEN: 'Bill', NameTH: 'บิลเงินสด/ใบเสร็จรับเงิน'},
    {id: 3, NameEN: 'Tax-Invoice', NameTH: 'ใบกำกับภาษี'}
  ];

	const paperSizes = [
		{id: 1, NameEN: 'A4', NameTH: 'A4'},
		{id: 1, NameEN: 'Slip', NameTH: 'Slip'}
	];

  const doCalRatio = function(){
    let containerWidth = $('#report-container').width();
    return containerWidth/A4Width;
  }

  const resetContainer = function(){
    let newRatio = doCalRatio();
    let newHeight = A4Height * newRatio;
    $('#report-container').css('height', newHeight);
    $('#report-container').css('max-height', newHeight);
    /*
    doCollectElement().then((reportElements)=>{
      if (reportElements.length > 0) {
        let wrapper = $('#report-container');
        $(wrapper).empty();
        reportElements.forEach(async (item, i) => {
          let reportElem = {};
          await Object.getOwnPropertyNames(item).forEach((tag) => {
            reportElem[tag] = item[tag];
          });
          doCreateElement(wrapper, item.elementType, item);
        });
      }
    });
    */
  }

  const doCreateTemplateTypeSelector = function(shopData, workAreaBox, onChangeCallBack){
    let selector = $('<select></select>');
    templateTypes.forEach((item, i) => {
      $(selector).append($('<option value="' + item.id + '">' + item.NameTH + '</option>'));
    });
    $(selector).on('change', (evt)=>{
      let selectValue = $(selector).val();
      onChangeCallBack(evt, selectValue, shopData, workAreaBox);
    });
    return $(selector);
  }

  const doCreateShopTemplateSelector = function(templates, shopData, workAreaBox, onChangeCallBack){
    let selector = $('<select></select>');
    templates.forEach((item, i) => {
      $(selector).append($('<option value="' + item.id + '">' + item.Name + '</option>'));
    });
    $(selector).on('change', (evt)=>{
      let selectValue = $(selector).val();
      onChangeCallBack(evt, selectValue, shopData, workAreaBox);
    });
    return $(selector);
  }

	const doCreatePaperSizeSelector = function(shopData, workAreaBox, onChangeCallBack){
		let selector = $('<select></select>');
		paperSizes.forEach((item, i) => {
      $(selector).append($('<option value="' + item.id + '">' + item.NameTH + '</option>'));
    });
    $(selector).on('change', (evt)=>{
      let selectValue = $(selector).val();
      onChangeCallBack(evt, selectValue, shopData, workAreaBox);
    });
    return $(selector);
	}

  const doCreateTemplateDesignArea = function(){
    let wrapper = $('<div class="row" id="WorkRow"></div>');
    let columnSideBox = $('<div class="column side"></div>');
    let reportItemBox = $('<div id="report-item"></div>');
    let selectableBox = $('<ol id="selectable"></ol>');
    $(selectableBox).append('<li class="ui-widget-content" id="text-element"><img src="/images/text-icon.png" class="icon-element"/><span class="text-element">กล่องข้อความ</span></li>');
    $(selectableBox).append('<li class="ui-widget-content" id="hr-element"><img src="/images/hr-line-icon.png" class="icon-element"/><span class="text-element">เส้นแนวนอน</span></li>');
    $(selectableBox).append('<li class="ui-widget-content" id="image-element"><img src="/images/image-icon.png" class="icon-element"/><span class="text-element">กล่องรูปภาพ</span></li>');
		var tableTypeLength = $(".tableElement").length;
		if (tableTypeLength == 0) {
			$(selectableBox).append('<li class="ui-widget-content" id="table-element"><img src="/images/item-list-icon.png" class="icon-element"/><span class="text-element">ตารางออร์เดอร์</span></li>');
		}
    let reportItemCmdBox = $('<div id="report-item-cmd" style="padding:5px; text-align: center; margin-top: 20px;"></div>');
    let addElementCmd = $('<input type="button" id="add-item-cmd" value=" เพิ่ม "/>');
    let removeElementCmd = $('<input type="button" id="remove-item-cmd" value=" ลบ "/>');
    $(reportItemCmdBox).append($(addElementCmd)).append($(removeElementCmd));
    let reportPropertyBox = $('<div id="report-property"></div>') ;

    $(reportItemBox).append($(selectableBox)).append($(reportItemCmdBox)).append($(reportPropertyBox));
    $(columnSideBox).append($(reportItemBox));

    let columnMiddleBox = $('<div class="column middle"></div>');
    let reportcontainerBox = $('<div id="report-container"></div>');
    $(columnMiddleBox).append($(reportcontainerBox));

    return $(wrapper).append($(columnSideBox)).append($(columnMiddleBox))
  }

	const doLoadCommandAction = function(){
    $("#add-item-cmd").prop('disabled', true);
    $("#remove-item-cmd").prop('disabled', true);
    $("#text-element").data({type: "text"});
    $("#hr-element").data({type: "hr"});
    $("#image-element").data({type: "image"});
		$("#table-element").data({type: "table"});
		$("#tr-element").data({type: "tr"});
    $("#selectable").selectable({
      stop: function() {
        $( ".ui-selected", this ).each(function() {
          activeType = $(this).data();
          $("#add-item-cmd").prop('disabled', false);
        });
      },
      selected: function(event, ui) {
        $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
      }
    });
    $("#report-container").droppable({
      accept: ".reportElement",
      drop: function( event, ui ) {
      }
    });
		$('.tableElement').droppable({
      accept: ".trElement",
      drop: function( event, ui ) {
      }
    });
		$('.trElement').droppable({
      accept: ".tdElement",
      drop: function( event, ui ) {
      }
    });
    $("#add-item-cmd").click((event) => {
      let elemType = activeType.type;
      let wrapper = $("#report-container");
			if (elemType == 'tr') {
				wrapper = $(wrapper).find('table');
			}
      doCreateElement(wrapper, elemType);
    });

    $("#remove-item-cmd").click((event) => {
      $(".reportElement").each((index, elem)=>{
        let isActive = $(elem).hasClass("elementActive");
        if (isActive) {
          $(elem).remove();
          $("#remove-item-cmd").prop('disabled', true);
          $("#report-property").empty();
        }
      });
    });
  }

  const doCreateElement = function(wrapper, elemType, prop){
		console.log(elemType);
    let defHeight = 50;
    switch (elemType) {
      case "text":
        var textTypeLength = $(".textElement").length;
        var oProp;
        if (prop) {
          oProp = {
            x: prop.x, y: prop.y, width: prop.width, height: prop.height, id: prop.id, type: prop.type, title: prop.title,
            fontsize: prop.fontsize,
            fontweight: prop.fontweight,
            fontstyle: prop.fontstyle,
            fontalign: prop.fontalign
          };
        } else {
          defHeight = 50;
          oProp = {x:0, y: (defHeight * textTypeLength),
            width: '150', height: defHeight,
            id: 'text-element-' + (textTypeLength + 1),
            title: 'Text Element ' + (textTypeLength + 1)
          }
        }
        oProp.elementselect = elementProperty.textElementSelect;
        oProp.elementdrop = elementProperty.textElementDrop;
        oProp.elementresizestop = elementProperty.textResizeStop;
        var textbox = $( "<div></div>" );
        $(textbox).textelement( oProp );
        $(wrapper).append($(textbox));
      break;
      case "hr":
        var hrTypeLength = $(".hrElement").length;
        var oProp;
        if (prop) {
          oProp = {x: prop.x, y: prop.y, width: prop.width, height: prop.height, id: prop.id};
        } else {
          defHeight = 20;
          oProp = {x:0, y: (defHeight * hrTypeLength),
            width: '100%', height: defHeight,
            id: 'hr-element-' + (hrTypeLength + 1)
          }
        }
        oProp.elementselect = elementProperty.hrElementSelect;
        oProp.elementdrop = elementProperty.hrElementDrop;
        oProp.elementresizestop = elementProperty.hrResizeStop;
        var hrbox = $( "<div><hr/></div>" );
        $(hrbox).hrelement( oProp );
        $(wrapper).append($(hrbox));
      break;
      case "image":
        var imageTypeLength = $(".imageElement").length;
        var oProp;
        if (prop) {
          oProp = {x: prop.x, y: prop.y, width: prop.width, height: prop.height, id: prop.id, url: prop.url};
        } else {
          defHeight = 60;
          oProp = {x:0, y: (defHeight * imageTypeLength),
            width: '100', height: defHeight,
            id: 'image-element-' + (imageTypeLength + 1),
            url: '../../icon.png'
          }
        }
        oProp.elementselect = elementProperty.imageElementSelect;
        oProp.elementdrop = elementProperty.imageElementDrop;
        oProp.elementresizestop = elementProperty.imageResizeStop;
        var imagebox = $( "<div></div>" )
        $(imagebox).imageelement( oProp );
        $(wrapper).append($(imagebox));
      break;
			case "table":
				var imageTypeLength = $(".tableElement").length;
				//console.log(imageTypeLength);
				if (imageTypeLength == 0) {
					var oProp;
					if (prop) {
						oProp = {x: prop.x, y: prop.y, width: prop.width, height: prop.height, id: prop.id, cols: prop.cols};
					} else {
						defHeight = 60;
						oProp = {x:0, y: (defHeight * imageTypeLength),
							width: '100%', height: defHeight,
							id: 'table-element-' + (imageTypeLength + 1),
							cols: 5
						}
					}
					oProp.elementselect = elementProperty.tableElementSelect;
					oProp.elementdrop = elementProperty.tableElementDrop;
					oProp.elementresizestop = elementProperty.tableResizeStop;
					var tablebox = $( "<div></div>" )
					$(tablebox).tableelement( oProp );
					$(wrapper).append($(tablebox));
				}
			break;
			case "tr":
				var trLength = $(".trElement").length;
				console.log(trLength);
				var oProp;
				if (prop) {
					//oProp = {x: prop.x, y: prop.y, width: prop.width, height: prop.height, id: prop.id, cols: prop.cols};
					oProp = {'border': prop.border, 'background-color': prop.backgroundColor};
				} else {
					//defHeight = 60;
					oProp = {/*x:0, y: (defHeight * imageTypeLength),
						width: '100%', height: defHeight,
						*/
						'border': '1px solid black',
						'background-color': '#ddd',
						id: 'tr-element-' + (imageTypeLength + 1)
					}
				}
				//}
				oProp.elementselect = elementProperty.trElementSelect;
				oProp.elementdrop = elementProperty.trElementDrop;
				oProp.elementresizestop = elementProperty.trResizeStop;
				var trbox = $('<tr><td width="100%">Simply</td></tr>');
				$(trbox).trelement( oProp );
				console.log(trbox);
				$(wrapper).append($(trbox));
			break;
    }
  }

  const doShowTemplateDesign = function(shopData, workAreaBox){
    return new Promise(async function(resolve, reject) {
      $(workAreaBox).empty();


      let templateRes = await common.doCallApi('/api/shop/template/list/by/shop/' + shopData.id, {});
      let templateItems = templateRes.Records;
      if (templateItems.lenght > 0) {

      } else {
        let controlNewTemplateForm = $('<table width="100%" cellspacing="0" cellpadding="0" border="0"></table>');
        let controlRow = $('<tr></tr>').css({'background-color': '#ddd', 'border': '2px solid grey'});
        $(controlNewTemplateForm).append($(controlRow));
        let templatTypeSelector = doCreateTemplateTypeSelector(shopData, workAreaBox, onTemplateTypeChange);
				let paperSizeSelector = doCreatePaperSizeSelector(shopData, workAreaBox, onPaperSizeChange);
        let templateNameInput = $('<input type="text"/>').css({'width': '220px'});
        let saveNewTemplateCmd = $('<input type="button" value=" บันทึก "/>');
        $(controlRow).append($('<td width="10%" align="left"><b>ประเภทเอกสาร</b></td>'));
        $(controlRow).append($('<td width="20%" align="left"></td>').append($(templatTypeSelector)));
        $(controlRow).append($('<td width="10%" align="left"><b>ชื่อเอกสารใหม่</b></td>'));
        $(controlRow).append($('<td width="30%" align="left"></td>').append($(templateNameInput)));
				$(controlRow).append($('<td width="10%" align="left"><b>ขนาดกระดาษ</b></td>'));
        $(controlRow).append($('<td width="15%" align="center"></td>').append($(paperSizeSelector)));
				$(controlRow).append($('<td width="*" align="center"></td>').append($(saveNewTemplateCmd)));
        $(workAreaBox).empty().append($(controlNewTemplateForm));
        let designAreaBox = doCreateTemplateDesignArea();
        $(workAreaBox).append($(designAreaBox));
        resetContainer();
        doLoadCommandAction();

      }
      resolve();
    });
  }

  const onTemplateTypeChange = function(evt, typeValue, shopData, workAreaBox){

  }

	const onPaperSizeChange = function(evt, typeValue, shopData, workAreaBox){

	}
  return {
    doShowTemplateDesign
	}
}
