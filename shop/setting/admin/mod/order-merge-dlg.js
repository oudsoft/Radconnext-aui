module.exports = function ( jq ) {
	const $ = jq;

  const common = require('../../../home/mod/common-lib.js')($);

	const orderSelectCallback = function(evt, orders, srcIndex, destIndex) {
		console.log(evt, orders, srcIndex, destIndex);
		/*
		let newValue = $(editInput).val();
		if(newValue !== '') {
			$(editInput).css({'border': ''});
			let params = {data: {Price: newValue}, id: gooditems[index].id};
			let menuitemRes = await common.doCallApi('/api/shop/menuitem/update', params);
			if (menuitemRes.status.code == 200) {
				$.notify("แก้ไขรายการเมนูสำเร็จ", "success");
				dlgHandle.closeAlert();
				successCallback(newValue);
			} else if (menuitemRes.status.code == 201) {
				$.notify("ไม่สามารถแก้ไขรายการเมนูได้ในขณะนี้ โปรดลองใหม่ภายหลัง", "warn");
			} else {
				$.notify("เกิดข้อผิดพลาด ไม่สามารถแก้ไขรายการเมนูได้", "error");
			}
		} else {
			$.notify('ราคาสินค้าต้องไม่ว่าง', 'error');
			$(editInput).css({'border': '1px solid red'});
		}


		*/
	}

	const doMergeOrder = async function(orders, srcIndex) {
		let orderMergerForm = await doCreateMergeSelectOrderForm(orders, srcIndex, orderSelectCallback);
		let mergeDlgOption = {
			title: 'เลือกออร์เดอร์ปลายทางที่ต้องการนำไปยุบรวม',
			msg: $(orderMergerForm),
			width: '420px',
			onOk: async function(evt) {
				dlgHandle.closeAlert();
			},
			onCancel: function(evt){
				dlgHandle.closeAlert();
			}
		}
		let dlgHandle = $('body').radalert(mergeDlgOption);
		$(dlgHandle.okCmd).hide();
	}

  const doCreateMergeSelectOrderForm = function(orders, srcIndex, selectedCallback){
    return new Promise(async function(resolve, reject) {
      let selectOrderForm = $('<div></div>').css({'width': '100%', 'height': '220px', 'overflow': 'scroll', 'padding': '5px'});
      const promiseList = new Promise(async function(resolve2, reject2){
				for (let i=0; i < orders.length; i++) {
          if ((orders[i].Status == 1) && (orders[i].id != orders[srcIndex].id)) {
						let total = await common.doCalOrderTotal(orders[i].Items);
            let ownerOrderFullName = orders[i].userinfo.User_NameTH + ' ' + orders[i].userinfo.User_LastNameTH;
            let orderBox = $('<div></div>').css({'width': '95%', 'position': 'relative', 'cursor': 'pointer', 'padding': '5px', 'background-color': '#dddd', 'border': '4px solid #dddd'});
            $(orderBox).append($('<div><b>ลูกค้า :</b> ' + orders[i].customer.Name + '</div>').css({'width': '100%'}));
            $(orderBox).append($('<div><b>ผู้รับออร์เดอร์ :</b> ' + ownerOrderFullName + '</div>').css({'width': '100%'}));
						$(orderBox).append($('<div><b>ยอดรวม :</b> ' + common.doFormatNumber(total) + '</div>').css({'width': '100%'}));
            $(orderBox).hover(()=>{
              $(orderBox).css({'border': '4px solid grey'});
            },()=>{
              $(orderBox).css({'border': '4px solid #dddd'});
            });
            $(orderBox).on('click', (evt)=>{
              selectedCallback(evt, orders, srcIndex, i);
            });
            $(selectOrderForm).append($(orderBox));
          }
        }
        setTimeout(()=> {
          resolve2($(selectOrderForm));
        }, 500);
      });
      Promise.all([promiseList]).then((ob)=>{
        resolve(ob[0]);
      });
    });
  }

  return {
		doMergeOrder,
    doCreateMergeSelectOrderForm
	}
}
