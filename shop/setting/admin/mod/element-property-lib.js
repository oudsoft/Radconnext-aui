module.exports = function ( jq ) {
	const $ = jq;

	const resetActive = function(element) {
    $(".reportElement").each((index, elem)=>{
      $(elem).removeClass("elementActive");
    })
    $(element).addClass("elementActive");
    $("#remove-item-cmd").prop('disabled', false);
		let isTableElement = $(element).hasClass('tableElement');
		let newTrRowCmd = $('<li class="ui-widget-content" id="tr-element"><img src="/images/list-item-icom.png" class="icon-element"/><span class="text-element">แถวรายการออร์เดอร์</span></li>')
		if (isTableElement) {
			//triggerCommandBox for append tr Element
			let countTrCmd = $('#tr-element').length;
			//console.log(countTrCmd);
			if (countTrCmd == 0) {
				$(newTrRowCmd).data({type: "tr"});
				$('#selectable').append($(newTrRowCmd));
			}
		} else {
			//triggerCommandBox for remove tr Element
			$('#selectable').find('#tr-element').remove();
		}
		let isTrElement = $(element).hasClass('trElement');
		if (isTrElement) {

		} else {

		}
  }

	const resetPropForm = function(target, data){
    let propform = createElementPropertyForm(target, data);
    $("#report-property").empty();
    $("#report-property").append($(propform));
  }

  const textElementSelect = function(event, data){
    resetActive(event.target);
    let prop = data.options;
    resetPropForm(event.target, prop);
  }
  const textElementDrop = function(event, data){
    let prop = data.options;
    resetPropForm(event.target, prop);
  }
  const textResizeStop = function(event, data){
    let prop = data.options;
    resetPropForm(event.target, prop);
  }
  const hrElementSelect = function(event, data){
    resetActive(event.target);
    let prop = data.options;
    resetPropForm(event.target, prop);
  }
  const hrElementDrop = function(event, data){
    let prop = data.options;
    resetPropForm(event.target, prop);
  }
  const hrResizeStop = function(event, data){
    let prop = data.options;
    resetPropForm(event.target, prop);
  }
  const imageElementSelect = function(event, data){
    resetActive(event.target);
    let prop = data.options;
    resetPropForm(event.target, prop);
  }
  const imageElementDrop = function(event, data){
    let prop = data.options;
    resetPropForm(event.target, prop);
  }
  const imageResizeStop = function(event, data){
    let prop = data.options;
    resetPropForm(event.target, prop);
  }
	const tableElementSelect = function(event, data){
    resetActive(event.target);
    let prop = data.options;
    resetPropForm(event.target, prop);
  }
  const tableElementDrop = function(event, data){
    let prop = data.options;
    resetPropForm(event.target, prop);
  }
  const tableResizeStop = function(event, data){
    let prop = data.options;
    resetPropForm(event.target, prop);
  }

	const trElementSelect = function(event, data){
    resetActive(event.target);
    let prop = data.options;
    resetPropForm(event.target, prop);
  }
  const trElementDrop = function(event, data){
    let prop = data.options;
    resetPropForm(event.target, prop);
  }
  const trResizeStop = function(event, data){
    let prop = data.options;
    resetPropForm(event.target, prop);
  }

  function createPropEditFragment(fragParent, fragTarget, key, label, oValue, type){
    let fragProp = $("<tr></tr>");
    $(fragProp).appendTo($(fragParent));
    let fragLabel = $("<td align='left'>" + label + "</td>");
    $(fragLabel).appendTo($(fragProp));
    let fragValue = $("<input type='text' size='8'/>");
    $(fragValue).val(oValue);
    $(fragValue).on('keyup', (e)=> {
      if (e.keyCode == 13){
        let value = $(e.currentTarget).val();
        if (!(isNaN(value))) {
          let targetData = $(fragTarget).data();
          switch (type) {
            case "text":
              targetData.customTextelement.options[key] = value;
              targetData.customTextelement.options.refresh();
            break;
            case "hr":
              targetData.customHrelement.options[key] = value;
              targetData.customHrelement.options.refresh();
            break;
            case "image":
              targetData.customImageelement.options[key] = value;
              targetData.customImageelement.options.refresh();
            break;
          }
        } else {
          $(e.currentTarget).css({border: "2px solid red"})
        }
      }
    });
    let fragEditor = $("<td align='left'></td>");
    $(fragEditor).append($(fragValue));
    $(fragValue).appendTo($(fragProp));
    return $(fragProp);
  }

  function createPropContentFragment(fragParent, fragTarget, data) {
    let targetData = $(fragTarget).data();
    //console.log(targetData);
    let fragProp = $("<tr></tr>");
    $(fragProp).appendTo($(fragParent));
    let fragLabel = $("<td align='left'>Type</td>");
    $(fragLabel).appendTo($(fragProp));
    let fragValue = $("<select><option value='static'>Static</option><option value='dynamic'>Dynamic</option></select>");
    let contentLabelFrag, contentDataFrag, updateContentCmdFrag;
    let dynamicFrag;

    $(fragValue).on('change', ()=> {
      let newValue = $(fragValue).val();
      if (newValue === 'static') {
        targetData.customTextelement.options['type'] = 'static';
        $(dynamicFrag).remove();

        contentLabelFrag = $("<tr></tr>");
        $(contentLabelFrag).appendTo($(fragParent));
        let contentlabel = $("<td colspan='2' align='left'>Text</td>");
        $(contentlabel).appendTo($(contentLabelFrag));

        contentDataFrag = $("<tr></tr>");
        $(contentDataFrag).appendTo($(fragParent));
        let textEditorFrag = $("<td colspan='2' align='left'></td>");
        $(textEditorFrag).appendTo($(contentDataFrag));
        let textEditor = $("<textarea cols='12' rows='8'></textarea>");
        $(textEditor).css({"width": "98%"});
        $(textEditor).val(data.title);
        $(textEditor).appendTo($(textEditorFrag));
        updateContentCmdFrag = $("<tr></tr>");
        $(updateContentCmdFrag).appendTo($(fragParent));
        let updateCmdFrag = $("<td colspan='2' align='right'></td>");
        $(updateCmdFrag).appendTo($(updateContentCmdFrag));
        let updateCmd = $("<input type='button' value=' Update '/>");
        $(updateCmd).appendTo($(updateCmdFrag));
        $(updateCmd).on('click', ()=>{
          let newContent = $(textEditor).val();
          targetData.customTextelement.options['title'] = newContent;
          targetData.customTextelement.options.refresh();
        });
				$(textEditor).on('keyup', (e)=> {
					$(updateCmd).click();
				});
      } else if (newValue === 'dynamic') {
        targetData.customTextelement.options['type'] = 'dynamic';
        $(contentLabelFrag).remove();
        $(contentDataFrag).remove();
        $(updateContentCmdFrag).remove();

        dynamicFrag = $("<tr></tr>");
        $(dynamicFrag).appendTo($(fragParent));

        let dynamicFieldlabel = $("<td align='left'>Field</td>");
        $(dynamicFieldlabel).appendTo($(dynamicFrag));

        let dynamicFieldValue = $("<td align='left'></td>");
        $(dynamicFieldValue).appendTo($(dynamicFrag));

        let dynamicFieldOption = $("<select></select>");
        $(dynamicFieldOption).appendTo($(dynamicFieldValue));
        fieldOptions.forEach((item, i) => {
          $(dynamicFieldOption).append("<option value='" + item.name_en + "'>" + item.name_th + "</option>");
        });
        $(dynamicFieldOption).on('change', ()=> {
          let newContent = $(dynamicFieldOption).val();
          targetData.customTextelement.options['title'] = '$' + newContent;
          targetData.customTextelement.options.refresh();
        });
        let currentVal = data.title.substring(1);
        $(dynamicFieldOption).val(currentVal).change();
      }
    });
    let fragEditor = $("<td align='left'></td>");
    $(fragEditor).append($(fragValue));
    $(fragValue).appendTo($(fragProp));
    $(fragValue).val(data.type).change();
    return $(fragProp);
  }

  function createFontSizeFragment(fragParent, fragTarget, data) {
    const fontSizes = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30,32, 34, 36, 38, 40];

    let targetData = $(fragTarget).data();
    //console.log(targetData);

    let fragFontSize = $("<tr></tr>");
    $(fragFontSize).appendTo($(fragParent));
    let fragFontSizeLabel = $("<td align='left'>Font Size</td>");
    $(fragFontSizeLabel).appendTo($(fragFontSize));
    let fragFontSizeOption = $("<td align='left'></td>");
    $(fragFontSizeOption).appendTo($(fragFontSize));
    let fragFontSizeValue = $("<select></select>");
    $(fragFontSizeValue).appendTo($(fragFontSizeOption));
    fontSizes.forEach((item, i) => {
      $(fragFontSizeValue).append("<option value='" + item + "'>" + item + "</option>");
    });
    $(fragFontSizeValue).on('change', ()=>{
      let newSize = $(fragFontSizeValue).val();
      targetData.customTextelement.options['fontsize'] = newSize;
      targetData.customTextelement.options.refresh();
    });
    $(fragFontSizeValue).val(data.fontsize).change();
    return $(fragFontSize);
  }

  function createFontWeightFragment(fragParent, fragTarget, data) {
    const fontWeight = ["normal", "bold"];

    let targetData = $(fragTarget).data();

    let fragFontWeight = $("<tr></tr>");
    $(fragFontWeight).appendTo($(fragParent));
    let fragFontWeightLabel = $("<td align='left'>Font Weight</td>");
    $(fragFontWeightLabel).appendTo($(fragFontWeight));

    let fragFontWeightOption = $("<td align='left'></td>");
    $(fragFontWeightOption).appendTo($(fragFontWeight));
    let fragFontWeightValue = $("<select></select>");
    $(fragFontWeightValue).appendTo($(fragFontWeightOption));
    fontWeight.forEach((item, i) => {
      $(fragFontWeightValue).append("<option value='" + item + "'>" + item + "</option>");
    });
    $(fragFontWeightValue).on('change', ()=>{
      let newWeight = $(fragFontWeightValue).val();
      targetData.customTextelement.options['fontweight'] = newWeight;
      targetData.customTextelement.options.refresh();
    });
    $(fragFontWeightValue).val(data.fontweight).change();
    return $(fragFontWeight);
  }

  function createFontStyleFragment(fragParent, fragTarget, data) {
    const fontStyle = ["normal", "italic"];

    let targetData = $(fragTarget).data();

    let fragFontStyle = $("<tr></tr>");
    $(fragFontStyle).appendTo($(fragParent));
    let fragFontStyleLabel = $("<td align='left'>Font Style</td>");
    $(fragFontStyleLabel).appendTo($(fragFontStyle));

    let fragFontStyleOption = $("<td align='left'></td>");
    $(fragFontStyleOption).appendTo($(fragFontStyle));
    let fragFontStyleValue = $("<select></select>");
    $(fragFontStyleValue).appendTo($(fragFontStyleOption));
    fontStyle.forEach((item, i) => {
      $(fragFontStyleValue).append("<option value='" + item + "'>" + item + "</option>");
    });
    $(fragFontStyleValue).on('change', ()=>{
      let newStyle = $(fragFontStyleValue).val();
      targetData.customTextelement.options['fontstyle'] = newStyle;
      targetData.customTextelement.options.refresh();
    });
    $(fragFontStyleValue).val(data.fontstyle).change();
    return $(fragFontStyle);
  }

  function createFontAlignFragment(fragParent, fragTarget, data) {
    const fontAlign = ["left", "center", "right"];

    let targetData = $(fragTarget).data();

    let fragFontAlign = $("<tr></tr>");
    $(fragFontAlign).appendTo($(fragParent));
    let fragFontAlignLabel = $("<td align='left'>Align</td>");
    $(fragFontAlignLabel).appendTo($(fragFontAlign));

    let fragFontAlignOption = $("<td align='left'></td>");
    $(fragFontAlignOption).appendTo($(fragFontAlign));
    let fragFontAlignValue = $("<select></select>");
    $(fragFontAlignValue).appendTo($(fragFontAlignOption));
    fontAlign.forEach((item, i) => {
      $(fragFontAlignValue).append("<option value='" + item + "'>" + item + "</option>");
    });
    $(fragFontAlignValue).on('change', ()=>{
      let newAlign = $(fragFontAlignValue).val();
      targetData.customTextelement.options['fontalign'] = newAlign;
      targetData.customTextelement.options.refresh();
    });
    $(fragFontAlignValue).val(data.fontalign).change();
    return $(fragFontAlign);
  }

  function createPropImageSrcFragment(fragParent, fragTarget, data) {
    let targetData = $(fragTarget).data();
    //console.log(targetData);
    let fragImageSrc = $("<tr></tr>");
    $(fragImageSrc).appendTo($(fragParent));
    let fragImageSrcLabel = $("<td align='left'>Image Url</td>");
    $(fragImageSrcLabel).appendTo($(fragImageSrc));

    let fragImageSrcInput = $("<td align='left'><input type='text' id='urltext' size='10' value='" + data.url + "'/></td>");
    $(fragImageSrcInput).appendTo($(fragImageSrc));

    let openSelectFileCmd = $("<input type='button' value=' ... ' />");
    $(openSelectFileCmd).appendTo($(fragImageSrcInput));
    $(openSelectFileCmd).on('click', (evt) => {
      let fileBrowser = $('<input type="file"/>');
      $(fileBrowser).attr("id", 'fileupload');
      $(fileBrowser).attr("name", 'patienthistory');
      $(fileBrowser).attr("multiple", true);
      $(fileBrowser).css('display', 'none');
      $(fileBrowser).on('change', function(e) {
        const defSize = 10000000;
        var fileSize = e.currentTarget.files[0].size;
        var fileType = e.currentTarget.files[0].type;
        if (fileSize <= defSize) {
          var uploadUrl = "/api/uploadpatienthistory";
          $('#fileupload').simpleUpload(uploadUrl, {
            progress: function(progress){
  						console.log("ดำเนินการได้ : " + Math.round(progress) + "%");
  					},
            success: function(data){
  						//console.log('Uploaded.', data);
              var imageUrl = data.link;
              $("#urltext").val(imageUrl);
              targetData.customImageelement.options['url'] = imageUrl;
              targetData.customImageelement.options.refresh();
            }
          });
        }
      });
      $(fileBrowser).appendTo($(fragImageSrcInput));
      $(fileBrowser).click();
    });
    return $(fragImageSrc);
  }

	const createPropTableColsNumber = function(fragParent, fragTarget, data) {
    let targetData = $(fragTarget).data();
		let fragCols = $("<tr></tr>");
		$(fragParent).append($(fragCols));
		$(fragCols).append($('<td align="left">จำนวนคอลัมน์</td>'));
		let colsInput = $('<input type="number"/>').css({'width': '50px'});
		$(colsInput).on('keyup', (e)=> {
			let newValue = $(colsInput).val();
			targetData.customTableelement.options['cols'] = newValue;
			targetData.customTableelement.options.refresh();
		});
		let colsFieldValue = $('<td align="left"></td>');
		$(colsFieldValue).append($(colsInput));
		$(fragCols).append($(colsFieldValue));
		return $(fragCols);
	}

  const createElementPropertyForm = function(target, data) {
    let formbox = $("<table width='100%' cellspacing='0' cellpadding='2' border='0'></table>");
    $(formbox).append("<tr><td align='left' width='40%'>id</td><td align='left' width='*'>" + data.id + "</td></tr>");
    let topProp = createPropEditFragment(formbox, target, 'y', 'Top', data.y, data.elementType);
    let leftProp = createPropEditFragment(formbox, target, 'x', 'Left', data.x, data.elementType);
    let widthProp = createPropEditFragment(formbox, target, 'width', 'Width', data.width, data.elementType);
    let heightProp = createPropEditFragment(formbox, target, 'height', 'Height', data.height, data.elementType);
    if (data.elementType === 'text') {
      let contentFontSize = createFontSizeFragment(formbox, target, data);
      let contentFontWeight = createFontWeightFragment(formbox, target, data);
      let contentFontStyle = createFontStyleFragment(formbox, target, data);
      let contentFontAlign = createFontAlignFragment(formbox, target, data);
      let contentProp = createPropContentFragment(formbox, target, data);
    } else if (data.elementType === 'image') {
      let imageSrcProp = createPropImageSrcFragment(formbox, target, data);
		} else if (data.elementType === 'table') {
			let colsProp = createPropTableColsNumber(formbox, target, data);
    }
    return $(formbox);
  }


  return {
		resetActive,
		resetPropForm,
		textElementSelect,
		textElementDrop,
		textResizeStop,
		hrElementSelect,
		hrElementDrop,
		hrResizeStop,
		imageElementSelect,
		imageElementDrop,
		imageResizeStop,
		tableElementSelect,
		tableElementDrop,
		tableResizeStop,
		trElementSelect,
		trElementDrop,
		trResizeStop,

  	createElementPropertyForm
	}
}
