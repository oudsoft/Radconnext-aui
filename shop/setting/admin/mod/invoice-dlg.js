module.exports = function ( jq ) {
	const $ = jq;

  const common = require('../../../home/mod/common-lib.js')($);

  String.prototype.lpad = function(padString, length) {
      var str = this;
      while (str.length < length)
          str = padString + str;
      return str;
  }

  const doCreateFormDlg = function(shopData, orderTotal, orderId, successCallback) {
    return new Promise(async function(resolve, reject) {
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

      let wrapperBox = $('<div></div>');
      let invoiceDataTable = $('<table width="100%" cellspacing="0" cellpadding="0" border="0"></table>');
      let dataRow = $('<tr></tr>').css({'height': '40px'});
      $(dataRow).append($('<td width="40%" align="left"><b>ยอดรวมค่าสินค้า</b></td>'));
      $(dataRow).append($('<td width="*" align="right"><b>' + common.doFormatNumber(orderTotal) + '</b></td>'));
      $(invoiceDataTable).append($(dataRow));
      dataRow = $('<tr></tr>').css({'height': '40px'});
      $(dataRow).append($('<td align="left">ส่วนลด</td>'));
      let discountInputCell = $('<td align="right"></td>');
      let discountInput = $('<input type="number" value="0"/>').css({'width': '80px'});
      $(discountInput).on('keyup', keyChangeValue);
      $(discountInputCell).append($(discountInput));
      $(dataRow).append($(discountInputCell));
      $(invoiceDataTable).append($(dataRow));

      let vatInput = $('<input type="number" value="0"/>').css({'width': '80px'});
      if (shopData.Shop_VatNo !== '') {
        $(vatInput).on('keyup', keyChangeValue);
        dataRow = $('<tr></tr>').css({'height': '40px'});
        $(dataRow).append($('<td align="left">ภาษีมูลค่าเพิ่ม (7%)</td>'));
        $(vatInput).val(common.doFormatNumber(0.07*orderTotal));
        $(dataRow).append($('<td align="right"></td>').append($(vatInput)));
        $(invoiceDataTable).append($(dataRow));
      }
      dataRow = $('<tr></tr>').css({'background-color': '#ddd', 'height': '40px'});
      $(dataRow).append($('<td width="40%" align="left"><b>รวมทั้งสิ้น</b></td>'));
      let discountValue = $(discountInput).val();
      let vatValue = $(vatInput).val();
      let grandTotal = (Number(orderTotal) - Number(discountValue)) + Number(vatValue);
      let granTotalCell = $('<td width="*" align="right"></td>');
      $(granTotalCell).empty().append($('<span><b>' + common.doFormatNumber(grandTotal) + '</b></span>'));
      $(dataRow).append(granTotalCell);
      $(invoiceDataTable).append($(dataRow));

      let middleActionCmdRow = $('<tr></tr>').css({'height': '40px'});
      let commandCell = $('<td colspan="2" align="center"></td>');
      $(middleActionCmdRow).append($(commandCell));
      $(invoiceDataTable).append($(middleActionCmdRow));

      let createInvoiceCmd = common.doCreateTextCmd('พิมพ์แจ้งหนี้', 'orange', 'white');
      let createBillCmd = common.doCreateTextCmd('เก็บเงิน', 'green', 'white');
      $(createBillCmd).css({'margin-left': '10px'});
      $(commandCell).append($(createInvoiceCmd)).append($(createBillCmd));

      $(createBillCmd).on('click', async(evt)=>{
        let paytypeRes = await common.doCallApi('/api/shop/paytype/options', {});
        $(middleActionCmdRow).remove();
        let paytypeSelect = $('<select></select>');
        paytypeRes.Options.forEach((item, i) => {
          $(paytypeSelect).append($('<option value="' + item.id + '">' + item.DisplayText + '</option>'));
        });
        payAmountInput = $('<input type="number" value="0"/>').css({'width': '120px'});
        $(payAmountInput).val(grandTotal);
        dataRow = $('<tr></tr>').css({'height': '40px'});
        $(dataRow).append($('<td align="left">วิธีชำระ</td>'));
        $(dataRow).append($('<td align="right"></td>').append($(paytypeSelect)));
        $(invoiceDataTable).append($(dataRow));
        dataRow = $('<tr></tr>').css({'height': '40px'});
        $(dataRow).append($('<td align="left">จำนวนที่ชำระ</td>'));
        $(dataRow).append($('<td align="right"></td>').append($(payAmountInput)));
        $(invoiceDataTable).append($(dataRow));

        let finalActionCmdRow = $('<tr></tr>').css({'height': '40px'});
        let commandCell = $('<td colspan="2" align="center"></td>');
        $(finalActionCmdRow).append($(commandCell));
        $(invoiceDataTable).append($(finalActionCmdRow));

        let createBillCmd = common.doCreateTextCmd('พิมพ์ใบเสร็จ', 'green', 'white');
        $(commandCell).append($(createBillCmd));

        $(createBillCmd).on('click', async(evt)=>{
          let shopId = shopData.id;
          let nextInvoiceNo = '000000001';
          let lastinvoicenoRes = await common.doCallApi('/api/shop/invoice/find/last/invioceno/' + shopId, {});
          if (lastinvoicenoRes.Records.length > 0) {
            let lastinvoiceno = lastinvoicenoRes.Records[0].No;
            let nextNo = Number(lastinvoiceno);
            nextNo = nextNo + 1;
            nextInvoiceNo = nextNo.lpad("0", 9);
            console.log(nextInvoiceNo);
            let filename = shopId.lpad("0", 5) + '-' + nextInvoiceNo + '.pdf';
            let discountValue = $(discountInput).val();
            let vatValue = $(vatInput).val();
            let payAmountValue = $(payAmountInput).val();
            let paymentData = {Amount: payAmountValue};
            let billData = {No: nextInvoiceNo, Discount: discountValue, Vat:vatValue, Filename: filename}
          }
        });

        if (shopData.Shop_VatNo !== '') {
          createTaxInvoiceCmd = common.doCreateTextCmd('พิมพ์กำกับภาษี', 'green', 'white');
          $(createTaxInvoiceCmd).css({'margin-left': '10px'});
          $(commandCell).append($(createTaxInvoiceCmd));
          $(createTaxInvoiceCmd).on('click', (evt)=>{

          });
        }
      });

      $(wrapperBox).append($(invoiceDataTable))
      resolve($(wrapperBox));
    });
  }

  return {
    doCreateFormDlg
	}
}
