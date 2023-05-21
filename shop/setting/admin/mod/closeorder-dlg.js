module.exports = function ( jq ) {
	const $ = jq;

  const common = require('../../../home/mod/common-lib.js')($);

  String.prototype.lpad = function(padString, length) {
      var str = this;
      while (str.length < length)
          str = padString + str;
      return str;
  }

  const doCreateFormDlg = function(shopData, orderTotal, orderObj, invoiceSuccessCallback, billSuccessCallback, taxinvoiceSuccessCallback) {
    return new Promise(async function(resolve, reject) {
			const orderId = orderObj.id;
      let payAmountInput = undefined;
      let createTaxInvoiceCmd = undefined;

      const keyChangeValue = function(evt){
        let discountValue = $(discountInput).val();
        let vatValue = $(vatInput).val();
        let grandTotal = (Number(orderTotal) - Number(discountValue)) + Number(vatValue);
        $(granTotalCell).empty().append($('<span><b>' + common.doFormatNumber(grandTotal) + '</b></span>'));
        if ($(payAmountInput)) {
          $(payAmountInput).val(common.doFormatNumber(grandTotal));
        }
        if ((vatValue == '') || (vatValue == 0)) {
          if ($(createTaxInvoiceCmd)) {
            $(createTaxInvoiceCmd).hide();
          } else {
            $(createTaxInvoiceCmd).show();
          }
        }
      }

			const checkboxVatClick = function(evt) {
				let check = $(checkboxVat).prop('checked');
				if (check == true){
					$(vatInput).val(common.doFormatNumber(0.07*orderTotal));
				} else {
					$(vatInput).val('0');
				}
				keyChangeValue(evt);
			}

      let wrapperBox = $('<div></div>');
      let closeOrderTable = $('<table width="100%" cellspacing="0" cellpadding="0" border="0"></table>');
      let dataRow = $('<tr class="first-step"></tr>').css({'height': '40px'});
      $(dataRow).append($('<td width="40%" align="left"><b>ยอดรวมค่าสินค้า</b></td>'));
      $(dataRow).append($('<td width="*" align="right"><b>' + common.doFormatNumber(orderTotal) + '</b></td>'));
      $(closeOrderTable).append($(dataRow));
      dataRow = $('<tr class="first-step"></tr>').css({'height': '40px'});
      $(dataRow).append($('<td align="left">ส่วนลด</td>'));
      let discountInputCell = $('<td align="right"></td>');
      let discountInput = $('<input type="number" value="0"/>').css({'width': '80px'});
      $(discountInput).on('keyup', keyChangeValue);
      $(discountInputCell).append($(discountInput));
      $(dataRow).append($(discountInputCell));
      $(closeOrderTable).append($(dataRow));

      let vatInput = $('<input type="number" value="0"/>').css({'width': '80px', 'margin-left': '4px'});
			let checkboxVat = $('<input type="checkbox"/>').css({'transform': 'scale(1.5)'});
      if (shopData.Shop_VatNo !== '') {
				$(checkboxVat).attr('checked', true);
				$(checkboxVat).on('click', checkboxVatClick);
        $(vatInput).on('keyup', keyChangeValue);
        dataRow = $('<tr class="first-step"></tr>').css({'height': '40px'});
        $(dataRow).append($('<td align="left">ภาษีมูลค่าเพิ่ม (7%)</td>'));
        $(vatInput).val(common.doFormatNumber(0.07*orderTotal));
        $(dataRow).append($('<td align="right"></td>').append($(checkboxVat)).append($(vatInput)));
        $(closeOrderTable).append($(dataRow));
      } else {
				$(checkboxVat).attr('checked', false);
			}
      dataRow = $('<tr></tr>').css({'background-color': '#ddd', 'height': '40px'});
      $(dataRow).append($('<td width="55%" align="left"><b>รวมทั้งสิ้น</b></td>'));
      let discountValue = $(discountInput).val();
      let vatValue = $(vatInput).val();
      let grandTotal = (Number(orderTotal) - Number(discountValue)) + Number(vatValue);
      let granTotalCell = $('<td width="*" align="right"></td>');
      $(granTotalCell).empty().append($('<span><b>' + common.doFormatNumber(grandTotal) + '</b></span>'));
      $(dataRow).append(granTotalCell);
      $(closeOrderTable).append($(dataRow));

      let middleActionCmdRow = $('<tr></tr>').css({'height': '40px'});
      let commandCell = $('<td colspan="2" align="center" id="MiddleActionCmdCell"></td>');
      $(middleActionCmdRow).append($(commandCell));
      $(closeOrderTable).append($(middleActionCmdRow));

			if (orderObj.Status == 1) {
	      let createInvoiceCmd = common.doCreateTextCmd('พิมพ์ใบแจ้งหนี้', '#F5500E', 'white', '#5D6D7E', '#FF5733');
				$(createInvoiceCmd).attr('id', 'CreateInvoiceCmd');
				$(createInvoiceCmd).on('click', async(evt)=>{
					let shopId = shopData.id;
					let nextInvoiceNo = '000000001';
					let filename = shopId.toString().lpad("0", 5) + '-1-' + nextInvoiceNo + '.pdf';
					let discountValue = parseFloat($(discountInput).val());
					let vatValue = parseFloat($(vatInput).val());

					let lastinvoicenoRes = await common.doCallApi('/api/shop/invoice/find/last/invioceno/' + shopId, {});
					console.log(lastinvoicenoRes);
					if (lastinvoicenoRes.Records.length > 0) {
						let lastinvoiceno = lastinvoicenoRes.Records[0].No;
						let nextNo = Number(lastinvoiceno);
						nextNo = nextNo + 1;
						nextInvoiceNo = nextNo.toString().lpad("0", 9);
						filename = shopId.toString().lpad("0", 5) + '-1-' + nextInvoiceNo + '.pdf';
						let invoiceData = {No: nextInvoiceNo, Discount: discountValue, Vat: vatValue, Filename: filename};
						invoiceSuccessCallback(invoiceData);
					} else {
						let invoiceData = {No: nextInvoiceNo, Discount: discountValue, Vat:vatValue, Filename: filename};
						invoiceSuccessCallback(invoiceData);
					}
				});
				$(commandCell).append($(createInvoiceCmd));
			}
			if ((orderObj.Status == 1) || (orderObj.Status == 2)) {
	      let closeOrderCmd = common.doCreateTextCmd('เก็บเงิน', 'green', 'white');
	      $(closeOrderCmd).css({'margin-left': '10px'});
	      $(closeOrderCmd).on('click', async(evt)=>{
					$('.first-step').hide();
	        let paytypeRes = await common.doCallApi('/api/shop/paytype/options', {});
	        $(middleActionCmdRow).remove();
	        let paytypeSelect = $('<select></select>');
	        paytypeRes.Options.forEach((item, i) => {
	          $(paytypeSelect).append($('<option value="' + item.Value + '">' + item.DisplayText + '</option>'));
	        });
					let discountValue = $(discountInput).val();
					let vatValue = $(vatInput).val();
					let grandTotal = (Number(orderTotal) - Number(discountValue)) + Number(vatValue);
	        payAmountInput = $('<input type="number" value="0"/>').css({'width': '120px'});
	        $(payAmountInput).val(grandTotal);
	        dataRow = $('<tr></tr>').css({'height': '40px'});
	        $(dataRow).append($('<td align="left">วิธีชำระ</td>'));
	        $(dataRow).append($('<td align="right"></td>').append($(paytypeSelect)));
	        $(closeOrderTable).append($(dataRow));
	        dataRow = $('<tr></tr>').css({'height': '40px'});
	        $(dataRow).append($('<td align="left">จำนวนที่ชำระ</td>'));
	        $(dataRow).append($('<td align="right"></td>').append($(payAmountInput)));
	        $(closeOrderTable).append($(dataRow));

					let addRemarkCmdRow = $('<tr></tr>').css({'height': '40px'});
	        let addRemarkCmdCell = $('<td align="left"></td>');
	        $(addRemarkCmdRow).append($(addRemarkCmdCell)).append($('<td align="left"></td>'));
	        $(closeOrderTable).append($(addRemarkCmdRow));

					let addRemarkCmd = common.doCreateTextCmd('เพิ่มบันทึกการปิดบิล', 'gray', 'white');
					$(addRemarkCmd).css({'width' : '100%'});
					$(addRemarkCmd).on('click', (evt)=>{
						let hasHiddenRemarkBox = ($(remarkBox).css('display') == 'none');
						if (hasHiddenRemarkBox) {
							$(remarkBox).slideDown('slow');
							$(addRemarkCmd).text('ซ่อนบันทึก');
						} else {
							$(remarkBox).slideUp('slow');
							$(addRemarkCmd).text('เพิ่มบันทึกการปิดบิล');
						}
					});
					$(addRemarkCmdCell).append($(addRemarkCmd));

					let remarkBoxRow = $('<tr></tr>').css({'height': '80px'});
	        let remarkBoxCell = $('<td colspan="2" align="left"></td>');
					let remarkBox = $('<textarea id="Remark" cols="44" rows="5"></textarea>').css({'display': 'none'});
					$(remarkBoxCell).append($(remarkBox));
	        $(remarkBoxRow).append($(remarkBoxCell));
	        $(closeOrderTable).append($(remarkBoxRow));

	        let finalActionCmdRow = $('<tr></tr>').css({'height': '60px', 'vertical-align': 'bottom'});
	        let finalCommandCell = $('<td colspan="2" align="center"></td>');
	        $(finalActionCmdRow).append($(finalCommandCell));
	        $(closeOrderTable).append($(finalActionCmdRow));

					let checkVat = $(checkboxVat).prop('checked');

					if (checkVat == false) {
						let createBillCmd = common.doCreateTextCmd('พิมพ์ใบเสร็จ', 'green', 'white');
		        $(finalCommandCell).append($(createBillCmd));
	        	$(createBillCmd).on('click', async(evt)=>{
		          let shopId = shopData.id;
		          let nextBillNo = '000000001';
							let filename = shopId.toString().lpad("0", 5) + '-2-' + nextBillNo + '.pdf';
							let discountValue = parseFloat($(discountInput).val());
							let vatValue = parseFloat($(vatInput).val());

							let payAmountValue = parseFloat($(payAmountInput).val());
							let payType = parseInt($(paytypeSelect).val());
							let paymentData = {Amount: payAmountValue, PayType: payType};
							let hasHiddenRemarkBox = ($(remarkBox).css('display') == 'none');
		          let lastbillnoRes = await common.doCallApi('/api/shop/bill/find/last/billno/' + shopId, {});
							console.log(lastbillnoRes);
		          if (lastbillnoRes.Records.length > 0) {
		            let lastbillno = lastbillnoRes.Records[0].No;
		            let nextNo = Number(lastbillno);
		            nextNo = nextNo + 1;
		            nextBillNo = nextNo.toString().lpad("0", 9);
		            filename = shopId.toString().lpad("0", 5) + '-2-' + nextBillNo + '.pdf';
		            let billData = {No: nextBillNo, Discount: discountValue, Vat:vatValue, Filename: filename};
								if (!hasHiddenRemarkBox) {
									billData.Remark = $(remarkBox).val();
								}
								billSuccessCallback(billData, paymentData);
		          } else {
								let billData = {No: nextBillNo, Discount: discountValue, Vat:vatValue, Filename: filename};
								if (!hasHiddenRemarkBox) {
									billData.Remark = $(remarkBox).val();
								}
								billSuccessCallback(billData, paymentData);
							}
		        });
					}

	        if ((shopData.Shop_VatNo !== '') && (checkVat == true)) {
	          let createTaxInvoiceCmd = common.doCreateTextCmd('พิมพ์ใบกำกับภาษี', 'green', 'white');
	          $(createTaxInvoiceCmd).css({'margin-left': '10px'});
	          $(finalCommandCell).append($(createTaxInvoiceCmd));
	          $(createTaxInvoiceCmd).on('click', async (evt)=>{
							let shopId = shopData.id;
		          let nextTaxInvoiceNo = '000000001';
							let filename = shopId.toString().lpad("0", 5) + '-3-' + nextTaxInvoiceNo + '.pdf';
							let discountValue = parseFloat($(discountInput).val());
							let vatValue = parseFloat($(vatInput).val());

							let payAmountValue = parseFloat($(payAmountInput).val());
							let payType = parseInt($(paytypeSelect).val());
							let paymentData = {Amount: payAmountValue, PayType: payType};
							let hasHiddenRemarkBox = ($(remarkBox).css('display') == 'none');
		          let lasttaxinvoicenoRes = await common.doCallApi('/api/shop/taxinvoice/find/last/taxinvioceno/' + shopId, {});
							console.log(lasttaxinvoicenoRes);
		          if (lasttaxinvoicenoRes.Records.length > 0) {
		            let lasttaxinvoiceno = lasttaxinvoicenoRes.Records[0].No;
		            let nextNo = Number(lasttaxinvoiceno);
		            nextNo = nextNo + 1;
		            nextTaxInvoiceNo = nextNo.toString().lpad("0", 9);
		            filename = shopId.toString().lpad("0", 5) + '-3-' + nextTaxInvoiceNo + '.pdf';
		            let taxinvoicenoData = {No: nextTaxInvoiceNo, Discount: discountValue, Vat: vatValue, Filename: filename};
								if (!hasHiddenRemarkBox) {
									taxinvoicenoData.Remark = $(remarkBox).val();
								}
								taxinvoiceSuccessCallback(taxinvoicenoData, paymentData);
		          } else {
								let taxinvoicenoData = {No: nextTaxInvoiceNo, Discount: discountValue, Vat: vatValue, Filename: filename};
								if (!hasHiddenRemarkBox) {
									taxinvoicenoData.Remark = $(remarkBox).val();
								}
								taxinvoiceSuccessCallback(taxinvoicenoData, paymentData);
							}
	          });
	        }
	      });
				$(commandCell).append($(closeOrderCmd));
			}

      $(wrapperBox).append($(closeOrderTable))
      resolve($(wrapperBox));
    });
  }

	const doOpenReportPdfDlg = function(pdf, title, closeCallback){
    return new Promise(async function(resolve, reject) {
			const pdfURL = pdf.link + '?t=' + common.genUniqueID();
      const reportPdfDlgContent = $('<object data="' + pdfURL + '" type="application/pdf" width="99%" height="380"></object>');
      $(reportPdfDlgContent).css({'margin-top': '10px'});
			let radAlertMsg = $('<div></div>');
			$(radAlertMsg).append($(reportPdfDlgContent));
			let ectAccessBox = undefined;
			let newAcc = {};
			if (!pdf.pngLink) {
				let tpms = pdf.link.split('/');
				let names = tpms[tpms.length-1].split('.');
				newAcc.pngLink = '/shop/img/usr/pdf/' + names[0] + '.png';
				//newAcc.ppLink =
				//newAcc.qrLink = '/shop/img/usr/qrcode/' + names[0] + '.png';
			}
			if (pdf.pngLink) {
				ectAccessBox = $('<div></div>');
				let pngThumb = $('<img/>').attr('src', pdf.pngLink).css({'width': '60px', 'height': 'auto', 'display': 'inline-block', 'cursor': 'pointer'});
				$(ectAccessBox).append($(pngThumb))
				$(pngThumb).on('click', (evt)=>{
					window.open(pdf.pngLink, '_blank');
				});
			} else {
				let tpms = pdf.link.split('/');
				let names = tpms[tpms.length-1].split('.');
				let newAccPngLink = '/shop/img/usr/pdf/' + names[0] + '.png';
				ectAccessBox = $('<div></div>');
				let pngThumb = $('<img/>').attr('src', newAccPngLink).css({'width': '60px', 'height': 'auto', 'display': 'inline-block', 'cursor': 'pointer'});
				$(ectAccessBox).append($(pngThumb))
				$(pngThumb).on('click', (evt)=>{
					window.open(newAccPngLink, '_blank');
				});
			}
			if (pdf.ppLink) {
				if (!ectAccessBox) {
					ectAccessBox = $('<div></div>');
				}
				let ppThumb = $('<img/>').attr('src', pdf.ppLink).css({'width': '60px', 'height': 'auto', 'display': 'inline-block', 'cursor': 'pointer', 'margin-left': '20px'});
				$(ectAccessBox).append($(ppThumb))
				$(ppThumb).on('click', (evt)=>{
					window.open(pdf.ppLink, '_blank');
				});
			}
			if (pdf.qrLink) {
				if (!ectAccessBox) {
					ectAccessBox = $('<div></div>');
				}
				let qrThumb = $('<img/>').attr('src', pdf.qrLink).css({'width': '60px', 'height': 'auto', 'display': 'inline-block', 'cursor': 'pointer', 'margin-left': '20px'});
				$(ectAccessBox).append($(qrThumb))
				$(qrThumb).on('click', (evt)=>{
					window.open(pdf.qrLink, '_blank');
				});
			}
			if (ectAccessBox) {
				$(ectAccessBox).css({'display': 'none', 'cursor': 'pointer', 'border': '2px solid grey', 'background-color': '#ddd', 'width': '100%'});
				let tggAccessCmd = $('<div>รูปภาพ</div>').css({'display': 'block', 'cursor': 'pointer', 'border': '2px solid black', 'background-color': 'grey', 'width': '100%', 'text-align': 'center', 'line-height': '36px'});
				$(tggAccessCmd).on('click', (evt)=>{
					$(ectAccessBox).slideDown('slow');
					$(tggAccessCmd).hide();
				})
				$(ectAccessBox).on('click', (evt)=>{
					$(ectAccessBox).slideUp('slow');
					$(tggAccessCmd).show();
				})
				$(radAlertMsg).append($(tggAccessCmd)).append($(ectAccessBox));
			}
      const reportformoption = {
  			title: title,
  			msg: $(radAlertMsg),
  			width: '720px',
				okLabel: ' เปิดหน้าต่างใหม่ ',
				cancelLabel: ' ปิด ',
  			onOk: async function(evt) {
					window.open(pdf.link, '_blank');
          reportPdfDlgHandle.closeAlert();
					if (closeCallback) {
						closeCallback();
					}
  			},
  			onCancel: function(evt){
  				reportPdfDlgHandle.closeAlert();
					if (closeCallback) {
						closeCallback();
					}
  			}
  		}
  		let reportPdfDlgHandle = $('body').radalert(reportformoption);
      resolve(reportPdfDlgHandle)
    });
  }

	const doShowBillRemarkBox = function(evt) {
		let masterCmd = $(evt.currentTarget);
		let masterCell = $(masterCmd).parent();
		$(masterCmd).hide();

		let remarkBox = $('<div></div>').css({'display': 'block', 'height': '100px', 'border': '1px solid red'});
		let hiddenBoxCmd = common.doCreateTextCmd('ซ่อน', 'gray', 'white');
		$(hiddenBoxCmd).on('click', (evt)=>{
			$(remarkBox).slideUp('fast')/*.css({'display': 'none'})*/;
			$(remarkBox).remove();
			$(masterCmd).show();
		});

		$(remarkBox).append($(hiddenBoxCmd));
		$(masterCell).append($(remarkBox));
		$(remarkBox)/*.css({'display': 'block'})*/.slideDown('slow');
	}

  return {
    doCreateFormDlg,
		doOpenReportPdfDlg
	}
}
