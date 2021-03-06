$(document).ready(function () {

     $.ajaxSetup({
          beforeSend: function (xhr) {
               xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
          }
     });


     $.widget("custom.textelement", {
          options: {
               elementType: 'text',
               type: "static",
               x: 0,
               y: 0,
               width: '140',
               height: '40',
               fontsize: 24,
               fontweight: 'normal',
               fontstyle: 'normal',
               fontalign: 'left'
          },
          _create: function () {
               let $this = this;
               this.options.type = this.options.type;
               this.element.addClass("reportElement");
               this.element.addClass("textElement");
               this.element.css({ "left": this.options.x + "px", "top": this.options.y + "px", "width": this.options.width + "px", "height": this.options.height + "px" });
               this.element.text(this.options.title);
               this.element.draggable({
                    containment: "parent",
                    stop: function (e) {
                         $this._setOption("x", e.target.offsetLeft);
                         $this._setOption("y", e.target.offsetTop);
                         $this._trigger("elementdrop", null, $this.options);
                    }
               });
               this.element.resizable({
                    containment: "parent",
                    stop: function (e) {
                         //console.log(e);
                         $this._setOption("width", e.target.clientWidth);
                         $this._setOption("height", e.target.clientHeight);
                         $this._trigger("elementresizestop", null, $this.options);
                    }
               });
               this.element.on('click', function (event) {
                    //console.log(event);
                    $this._trigger("elementselect", null, $this.options);
               });
          },
          _setOption: function (key, value) {
               this.options[key] = value;
               this._super(key, value);
          },
          _setOptions: function (options) {
               this._super(options);
               this.refresh();
          },
          refresh: function () {
               let $this = this;
               this.element.resizable('destroy');
               this.element.text(this.options.title);
               this.element.css({ "left": this.options.x + "px", "top": this.options.y + "px", "width": this.options.width + "px", "height": this.options.height + "px" });
               this.element.css({ "font-size": this.options.fontsize + "px" });
               this.element.css({ "font-weight": this.options.fontweight });
               this.element.css({ "font-style": this.options.fontstyle });
               this.element.css({ "text-align": this.options.fontalign });
               this.element.resizable({
                    containment: "parent",
                    stop: function (e) {
                         $this._setOption("width", e.target.clientWidth);
                         $this._setOption("height", e.target.clientHeight);
                         $this._trigger("elementresizestop", null, $this.options);
                    }
               });
          }
     });

     $.widget("custom.hrelement", {
          options: {
               elementType: 'hr',
               x: 0,
               y: 0,
               width: '100%',
               height: '20',
               border: "1px solid black;",
          },
          _create: function () {
               let $this = this;
               this.element.addClass("reportElement");
               this.element.addClass("hrElement");
               this.element.css({ "left": this.options.x + "px", "top": this.options.y + "px", "width": this.options.width, "height": this.options.height + "px" });
               $(this.element > "hr").css({ "border": this.options.border });
               this.element.draggable({
                    containment: "parent",
                    stop: function (e) {
                         $this._setOption("x", e.target.offsetLeft);
                         $this._setOption("y", e.target.offsetTop);
                         $this._trigger("elementdrop", null, $this.options);
                    }
               });
               this.element.resizable({
                    containment: "parent",
                    stop: function (e) {
                         //console.log(e);
                         $this._setOption("width", e.target.clientWidth);
                         $this._setOption("height", e.target.clientHeight);
                         $this._trigger("elementresizestop", null, $this.options);
                    }
               });
               this.element.on('click', function (event) {
                    //console.log(event);
                    $this._trigger("elementselect", null, $this.options);
               });
          },
          _setOption: function (key, value) {
               this.options[key] = value;
               this._super(key, value);
          },
          _setOptions: function (options) {
               this._super(options);
               this.refresh();
          },
          refresh: function () {
               this.element.css({ "left": this.options.x + "px", "top": this.options.y + "px", "width": this.options.width + "px", "height": this.options.height + "px" });
          }
     });

     $.widget("custom.imageelement", {
          options: {
               elementType: 'image',
               x: 0,
               y: 0,
               width: '100',
               height: '80'
          },
          _create: function () {
               let $this = this;
               this.element.addClass("reportElement");
               this.element.addClass("imageElement");
               let newImage = new Image();
               newImage.src = this.options.url;
               newImage.setAttribute("width", this.options.width);
               this.element.append(newImage);
               this.element.css({ "left": this.options.x + "px", "top": this.options.y + "px", "width": this.options.width, "height": "auto" });
               this.element.draggable({
                    containment: "parent",
                    stop: function (e) {
                         $this._setOption("x", e.target.offsetLeft);
                         $this._setOption("y", e.target.offsetTop);
                         $this._trigger("elementdrop", null, $this.options);
                    }
               });
               this.element.resizable({
                    containment: "parent",
                    stop: function (e) {
                         //console.log(e);
                         $this._setOption("width", e.target.clientWidth);
                         $this._setOption("height", e.target.clientHeight);
                         $this.refresh();
                         $this._trigger("elementresizestop", null, $this.options);
                    }
               });
               this.element.on('click', function (event) {
                    //console.log(event);
                    $this._trigger("elementselect", null, $this.options);
               });
          },
          _setOption: function (key, value) {
               this.options[key] = value;
               this._super(key, value);
          },
          _setOptions: function (options) {
               this._super(options);
               this.refresh();
          },
          refresh: function () {
               let $this = this;
               this.element.resizable('destroy');
               this.element.empty();
               let newImage = new Image();
               newImage.src = this.options.url;
               newImage.setAttribute("width", this.options.width);
               this.element.append(newImage);
               this.element.css({ "left": this.options.x + "px", "top": this.options.y + "px", "width": this.options.width, "height": "auto" });
               this.element.resizable({
                    containment: "parent",
                    stop: function (e) {
                         $this._setOption("width", e.target.clientWidth);
                         $this._setOption("height", e.target.clientHeight);
                         $this.refresh();
                         $this._trigger("elementresizestop", null, $this.options);
                    }
               });
          }
     });


     var activeType, activeElement;

     $("#New-Cmd").on('click', doCreateNewReport);
     $("#Clear-Cmd").on('click', doClearReport);
     $("#Preview-Cmd").on('click', doPreviewReport);
     $("#Export-Cmd").on('click', doExportReport);
     $("#Save-Cmd").on('click', doSaveReport);
     $("#Back-Cmd").on('click', doBackHome);

     $("#add-item-cmd").prop('disabled', true);
     $("#remove-item-cmd").prop('disabled', true);
     $("#text-element").data({
          type: "text"
     });
     $("#hr-element").data({
          type: "hr"
     });
     $("#image-element").data({
          type: "image"
     });
     $("#selectable").selectable({
          stop: function () {
               $(".ui-selected", this).each(function () {
                    activeType = $(this).data();
                    $("#add-item-cmd").prop('disabled', false);
                    //console.log(activeType);
               });
          },
          selected: function (event, ui) {
               $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
          }
     });
     $("#report-container").droppable({
          accept: ".reportElement",
          drop: function (event, ui) { }
     });
     $("#add-item-cmd").click((event) => {
          let elemType = activeType.type;
          doCreateElement($("#report-container"), elemType);
     });

     $("#remove-item-cmd").click((event) => {
          $(".reportElement").each((index, elem) => {
               let isActive = $(elem).hasClass("elementActive");
               if (isActive) {
                    $(elem).remove();
                    $("#remove-item-cmd").prop('disabled', true);
                    $("#report-property").empty();
               }
          });
     });

     $('#PrevieDialogBox').dialog({
          modal: true,
          autoOpen: false,
          resizable: true,
          title: 'Report Preview'
     });

     queryObj = urlQueryToObject(window.location.href);
     if (queryObj.hosid) {
          doLoadReportFormat(queryObj.hosid);
     }

});


function doLoadReportFormat(hosId) {
     let apiUrl = '/api/hospitalreport/select/' + hosId;
     let params = {};
     doGetApi(apiUrl, params).then((result) => {
          console.log(result);
          if (result.Records.length == 0) {
               mode = {
                    name: 'new'
               };
          } else {
               mode = {
                    name: 'update',
                    id: result.Records[0].id
               };
               //let content = JSON.parse(result.Records[0].Content);
               let content = result.Records[0].Content;
               console.log(content);

               let wrapper = $("#report-container");
               //doRenderElement(wrapper, content);
               content.forEach((item, i) => {
                    doCreateElement(wrapper, item.elementType, item);
               });

          }
          console.log(mode);
     });
}

function resetActive(element) {
     $(".reportElement").each((index, elem) => {
          $(elem).removeClass("elementActive");
     })
     $(element).addClass("elementActive");
     $("#remove-item-cmd").prop('disabled', false);
}

function createPropEditFragment(fragParent, fragTarget, key, label, oValue, type) {
     let fragProp = $("<tr></tr>");
     $(fragProp).appendTo($(fragParent));
     let fragLabel = $("<td align='left'>" + label + "</td>");
     $(fragLabel).appendTo($(fragProp));
     let fragValue = $("<input type='text' size='8'/>");
     $(fragValue).val(oValue);
     $(fragValue).on('keyup', (e) => {
          if (e.keyCode == 13) {
               let value = $(e.currentTarget).val();
               if (!(isNaN(value))) {
                    let targetData = $(fragTarget).data();
                    switch (type) {
                         case "text":
                              targetData.customTextelement.options[key] = value;
                              targetData.customTextelement.refresh();
                              break;
                         case "hr":
                              targetData.customHrelement.options[key] = value;
                              targetData.customHrelement.refresh();
                              break;
                         case "image":
                              targetData.customImageelement.options[key] = value;
                              targetData.customImageelement.refresh();
                              break;
                    }
               } else {
                    $(e.currentTarget).css({
                         border: "2px solid red"
                    })
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
     let fragProp = $("<tr></tr>");
     $(fragProp).appendTo($(fragParent));
     let fragLabel = $("<td align='left'>Type</td>");
     $(fragLabel).appendTo($(fragProp));
     let fragValue = $(
          "<select><option value='static'>Static</option><option value='dynamic'>Dynamic</option></select>");
     let contentLabelFrag, contentDataFrag, updateContentCmdFrag;
     let dynamicFrag;

     $(fragValue).on('change', () => {
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
               $(textEditor).css({
                    "width": "98%"
               });
               $(textEditor).val(data.title);
               $(textEditor).appendTo($(textEditorFrag));

               updateContentCmdFrag = $("<tr></tr>");
               $(updateContentCmdFrag).appendTo($(fragParent));
               let updateCmdFrag = $("<td colspan='2' align='right'></td>");
               $(updateCmdFrag).appendTo($(updateContentCmdFrag));
               let updateCmd = $("<input type='button' value=' Update '/>");
               $(updateCmd).appendTo($(updateCmdFrag));
               $(updateCmd).on('click', () => {
                    let newContent = $(textEditor).val();
                    targetData.customTextelement.options['title'] = newContent;
                    targetData.customTextelement.refresh();
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
                    $(dynamicFieldOption).append("<option value='" + item.name_en + "'>" + item
                         .name_th + "</option>");
               });
               $(dynamicFieldOption).on('change', () => {
                    let newContent = $(dynamicFieldOption).val();
                    targetData.customTextelement.options['title'] = '$' + newContent;
                    targetData.customTextelement.refresh();
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
     const fontSizes = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];

     let targetData = $(fragTarget).data();

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
     $(fragFontSizeValue).on('change', () => {
          let newSize = $(fragFontSizeValue).val();
          targetData.customTextelement.options['fontsize'] = newSize;
          targetData.customTextelement.refresh();
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
     $(fragFontWeightValue).on('change', () => {
          let newWeight = $(fragFontWeightValue).val();
          targetData.customTextelement.options['fontweight'] = newWeight;
          targetData.customTextelement.refresh();
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
     $(fragFontStyleValue).on('change', () => {
          let newStyle = $(fragFontStyleValue).val();
          targetData.customTextelement.options['fontstyle'] = newStyle;
          targetData.customTextelement.refresh();
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
     $(fragFontAlignValue).on('change', () => {
          let newAlign = $(fragFontAlignValue).val();
          targetData.customTextelement.options['fontalign'] = newAlign;
          targetData.customTextelement.refresh();
     });
     $(fragFontAlignValue).val(data.fontalign).change();
     return $(fragFontAlign);
}

function createPropImageSrcFragment(fragParent, fragTarget, data) {
     let targetData = $(fragTarget).data();
     let fragImageSrc = $("<tr></tr>");
     $(fragImageSrc).appendTo($(fragParent));
     let fragImageSrcLabel = $("<td align='left'>Image Url</td>");
     $(fragImageSrcLabel).appendTo($(fragImageSrc));

     let fragImageSrcInput = $("<td align='left'><input type='text' id='urltext' size='10' value='" + data.url +
          "'/></td>");
     $(fragImageSrcInput).appendTo($(fragImageSrc));

     let openSelectFileCmd = $("<input type='button' value=' ... ' />");
     $(openSelectFileCmd).appendTo($(fragImageSrcInput));
     $(openSelectFileCmd).on('click', (evt) => {
          let fileBrowser = $('<input type="file"/>');
          $(fileBrowser).attr("id", 'fileupload');
          $(fileBrowser).attr("name", 'patienthistory');
          $(fileBrowser).attr("multiple", true);
          $(fileBrowser).css('display', 'none');
          $(fileBrowser).on('change', function (e) {
               const defSize = 10000000;
               var fileSize = e.currentTarget.files[0].size;
               var fileType = e.currentTarget.files[0].type;
               if (fileSize <= defSize) {
                    var uploadUrl = "/uploadpatienthistory";
                    $('#fileupload').simpleUpload(uploadUrl, {
                         progress: function (progress) {
                              console.log("???????????????????????????????????? : " + Math.round(progress) + "%");
                         },
                         success: function (data) {
                              //console.log('Uploaded.', data);
                              var imageUrl = data.link;
                              $("#urltext").val(imageUrl);
                              targetData.customImageelement.options['url'] = imageUrl;
                              targetData.customImageelement.refresh();
                         }
                    });
               }
          });
          $(fileBrowser).appendTo($(fragImageSrcInput));
          $(fileBrowser).click();
     });
     return $(fragImageSrc);
}

function createElementPropertyForm(target, data) {
     let formbox = $("<table width='100%' cellspacing='0' cellpadding='2' border='0'></table>");
     $(formbox).append("<tr><td align='left' width='40%'>id</td><td align='left' width='*'>" + data.id +
          "</td></tr>");
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
     }
     return $(formbox);
}

function resetPropForm(target, data) {
     let propform = createElementPropertyForm(target, data);
     $("#report-property").empty();
     $("#report-property").append($(propform));
}

const textElementSelect = function (event, data) {
     resetActive(this);
     resetPropForm(event.target, data);
}
const textElementDrop = function (event, data) {
     resetPropForm(event.target, data);
}
const textResizeStop = function (event, data) {
     resetPropForm(event.target, data);
}
const hrElementSelect = function (event, data) {
     resetActive(this);
     resetPropForm(event.target, data);
}
const hrElementDrop = function (event, data) {
     resetPropForm(event.target, data);
}
const hrResizeStop = function (event, data) {
     resetPropForm(event.target, data);
}
const imageElementSelect = function (event, data) {
     resetActive(this);
     resetPropForm(event.target, data);
}
const imageElementDrop = function (event, data) {
     resetPropForm(event.target, data);
}
const imageResizeStop = function (event, data) {
     resetPropForm(event.target, data);
}

const fieldOptions = [{
     name_en: 'hospital_name',
     name_th: '???????????????????????????????????????'
},
{
     name_en: 'patient_name',
     name_th: '????????????????????????????????? (??????????????????)'
},
{
     name_en: 'patient_name_th',
     name_th: '????????????????????????????????? (?????????)'
},
{
     name_en: 'patient_name_en_th',
     name_th: '????????????????????????????????? ???????????????????????????????????????'
},
{
     name_en: 'patient_hn',
     name_th: 'HN ?????????????????????'
},
{
     name_en: 'patient_gender',
     name_th: '??????????????????????????????'
},
{
     name_en: 'patient_age',
     name_th: '?????????????????????????????????'
},
{
     name_en: 'patient_rights',
     name_th: '????????????????????????????????????'
},
{
     name_en: 'patient_doctor',
     name_th: '???????????????????????????????????????'
},
{
     name_en: 'patient_dept',
     name_th: '????????????'
},
{
     name_en: 'result',
     name_th: '???????????????????????????'
},
{
     name_en: 'report_by',
     name_th: '????????????????????????????????????'
},
{
     name_en: 'report_datetime',
     name_th: '?????????????????????'
},
{
     name_en: 'scan_date',
     name_th: '??????????????????????????????'
},
{
     name_en: 'scan_protocol',
     name_th: '??????????????????????????????????????????'
},
];

//[{"classes":{},"disabled":false,"create":null,"elementType":"text","type":"static","x":29,"y":24,"width":"150","height":50,"fontsize":24,"fontweight":"normal","fontstyle":"normal","fontalign":"left","id":"text-element-1","title":"test"},{"classes":{},"disabled":false,"create":null,"elementType":"hr","x":4,"y":88,"width":480,"height":26,"border":"1px solid black;","id":"hr-element-NaN"},{"classes":{},"disabled":false,"create":null,"elementType":"text","type":"static","x":294,"y":30,"width":"150","height":50,"fontsize":24,"fontweight":"normal","fontstyle":"normal","fontalign":"left","id":"text-element-NaN","title":"$hospital_name"}]

let queryObj, mode;

function urlQueryToObject(url) {
     let result = url.split(/[?&]/).slice(1).map(function (paramPair) {
          return paramPair.split(/=(.+)?/).slice(0, 2);
     }).reduce(function (obj, pairArray) {
          obj[pairArray[0]] = pairArray[1];
          return obj;
     }, {});
     return result;
}

function doGetApi(url, params) {
     return new Promise(function (resolve, reject) {
          $.get(url, params, function (response) {
               resolve(response);
          })
     });
}

function doCallApi(url, params) {
     return new Promise(function (resolve, reject) {
          $.post(url, params, function (response) {
               resolve(response);
          })
     });
}

function doCollectElement() {
     return new Promise(function (resolve, reject) {
          let htmlElements = $("#report-container").children();
          let reportElements = [];
          var promiseList = new Promise(function (resolve, reject) {
               htmlElements.each((index, elem) => {
                    let elemData = $(elem).data();
                    if (elemData.customTextelement) {
                         let data = elemData.customTextelement.options;
                         reportElements.push(data);
                    } else if (elemData.customHrelement) {
                         let data = elemData.customHrelement.options;
                         reportElements.push(data);
                    } else if (elemData.customImageelement) {
                         let data = elemData.customImageelement.options;
                         reportElements.push(data);
                    }
               });
               setTimeout(() => {
                    resolve(reportElements);
               }, 100);
          });
          Promise.all([promiseList]).then((ob) => {
               //console.log('Final JSON =>', ob[0]);
               resolve(ob[0]);
          });
     });
}
const doCreateNewReport = function (event) { }

const doClearReport = function (event) {
     $("#report-container").empty();
}
const doPreviewReport = async function (event) {
     let reportElements = await doCollectElement();
     let wrapperBox = $("<div></div>");
     $(wrapperBox).css({
          "width": "100%",
          "postion": "relative",
          "height": "100vh"
     });
     $(wrapperBox).css({
          "font-family": "THSarabunNew"
     });

     doRenderElement(wrapperBox, reportElements);

     let wrapperWidth = $("#report-container").css("width");
     //let wrapperHeight = $("#report-container").css("height");
     //console.log(wrapperWidth, wrapperHeight);
     $('#PrevieDialogBox').empty();
     $('#PrevieDialogBox').dialog('option', 'width', wrapperWidth);
     $('#PrevieDialogBox').dialog('option', 'height', 'auto');
     $('#PrevieDialogBox').append($(wrapperBox));
     $('#PrevieDialogBox').dialog('open');
}

function doCreateElement(wrapper, elemType, prop) {
     let defHeight = 50;
     switch (elemType) {
          case "text":
               var textTypeLength = $(".textElement").length;
               var oProp;
               if (prop) {
                    oProp = {
                         x: prop.x,
                         y: prop.y,
                         width: prop.width,
                         height: prop.height,
                         id: prop.id,
                         type: prop.type,
                         title: prop.title
                    };
               } else {
                    defHeight = 50;
                    oProp = {
                         x: 0,
                         y: (defHeight * textTypeLength),
                         width: '150',
                         height: defHeight,
                         id: 'text-element-' + (textTypeLength + 1),
                         title: 'Text Element ' + (textTypeLength + 1)
                    }
               }
               oProp.elementselect = textElementSelect;
               oProp.elementdrop = textElementDrop;
               oProp.elementresizestop = textResizeStop;
               var textbox = $("<div></div>").appendTo($(wrapper)).textelement(oProp).data("custom-textelement");
               break;
          case "hr":
               var hrTypeLength = $(".hrElement").length;
               var oProp;
               if (prop) {
                    oProp = {
                         x: prop.x,
                         y: prop.y,
                         width: prop.width,
                         height: prop.height,
                         id: prop.id
                    };
               } else {
                    defHeight = 20;
                    oProp = {
                         x: 0,
                         y: (defHeight * hrTypeLength),
                         width: '100%',
                         height: defHeight,
                         id: 'hr-element-' + (hrTypeLength + 1)
                    }
               }
               oProp.elementselect = hrElementSelect;
               oProp.elementdrop = hrElementDrop;
               oProp.elementresizestop = hrResizeStop;
               var hrbox = $("<div><hr/></div>")
                    .appendTo($(wrapper))
                    .hrelement(oProp)
                    .data("custom-hrelement");
               break;
          case "image":
               var imageTypeLength = $(".imageElement").length;
               var oProp;
               if (prop) {
                    oProp = {
                         x: prop.x,
                         y: prop.y,
                         width: prop.width,
                         height: prop.height,
                         id: prop.id,
                         url: prop.url
                    };
               } else {
                    defHeight = 60;
                    oProp = {
                         x: 0,
                         y: (defHeight * imageTypeLength),
                         width: '100',
                         height: defHeight,
                         id: 'image-element-' + (imageTypeLength + 1),
                         url: '../icon.png'
                    }
               }
               oProp.elementselect = imageElementSelect;
               oProp.elementdrop = imageElementDrop;
               oProp.elementresizestop = imageResizeStop;
               var imagebox = $("<div></div>")
                    .appendTo($(wrapper))
                    .imageelement(oProp)
                    .data("custom-imageelement");
               break;
     }
}

function doRenderElement(wrapper, reportElements) {
     reportElements.forEach((elem, i) => {
          let element;
          switch (elem.elementType) {
               case "text":
                    element = $("<div></div>");
                    $(element).addClass("reportElement");
                    //$(element).addClass("textElement");
                    $(element).css({
                         "left": elem.x + "px",
                         "top": elem.y + "px",
                         "width": elem.width + "px",
                         "height": elem.height + "px"
                    });
                    $(element).css({
                         "font-size": elem.fontsize + "px"
                    });
                    $(element).css({
                         "font-weight": elem.fontweight
                    });
                    $(element).css({
                         "font-style": elem.fontstyle
                    });
                    $(element).css({
                         "text-align": elem.fontalign
                    });
                    $(element).text(elem.title);
                    break;
               case "hr":
                    element = $("<div><hr/></div>");
                    $(element).addClass("reportElement");
                    $(element).css({
                         "left": elem.x + "px",
                         "top": elem.y + "px",
                         "width": elem.width,
                         "height": elem.height + "px"
                    });
                    $(element > "hr").css({
                         "border": elem.border
                    });
                    break;
               case "image":
                    element = $("<div></div>");
                    $(element).addClass("reportElement");
                    let newImage = new Image();
                    newImage.src = elem.url;
                    newImage.setAttribute("width", elem.width);
                    $(element).append(newImage);
                    $(element).css({
                         "left": elem.x + "px",
                         "top": elem.y + "px",
                         "width": elem.width,
                         "height": "auto"
                    });
                    break;
          }
          $(wrapper).append($(element));
     });
     return $(wrapper);
}

const doExportReport = async function (event) {
     const makeTextFile = function (text) {
          var data = new Blob([text], {
               type: /*'text/plain'*/ 'text/json'
          });
          var textFile = window.URL.createObjectURL(data);
          return textFile;
     };
     let reportElements = await doCollectElement();
     let fileLink = makeTextFile(JSON.stringify(reportElements));
     let pom = document.createElement('a');
     pom.setAttribute('href', fileLink);
     pom.setAttribute('download', 'report.json');
     pom.click();
};

const doSaveReport = async function (event) {
     let reportElements = await doCollectElement();
     let reportJSON = JSON.stringify(reportElements);
     let apiUrl, params;
     if (mode.name === 'new') {
          apiUrl = '/api/hospitalreport/add';
          params = {
               Content: reportJSON,
               hospitalId: queryObj.hosid
          };
     } else if (mode.name === 'update') {
          apiUrl = '/api/hospitalreport/update';
          params = {
               Content: reportJSON,
               hospitalId: queryObj.hosid,
               id: mode.id
          };
     }

     doCallApi(apiUrl, params).then((result) => {
          console.log(result);
          if (result.status.code === 200) {
               if (mode.name === 'new') {
                    mode = {
                         name: 'update',
                         id: result.Record.id
                    };
               }
               $.notify('???????????????????????????????????????????????????????????????????????????????????????????????????', 'info');
          } else {
               $.notify('??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????', 'error');
          }
     });

}

function doBackHome() {
     let url = '/setting/hospital/';
     window.location.replace(url);
}
