/* websocketmessage.js */
module.exports = function ( jq, wsm ) {
	const $ = jq;

  const onMessageShop = function (msgEvt) {
		let userdata = JSON.parse(localStorage.getItem('userdata'));
    let data = JSON.parse(msgEvt.data);
    console.log(data);
    if (data.type == 'test') {
      $.notify(data.message, "success");
		} else if (data.type == 'ping') {
			let modPingCounter = Number(data.counterping) % 10;
			if (modPingCounter == 0) {
				wsm.send(JSON.stringify({type: 'pong', myconnection: (userdata.id + '/' + userdata.username + '/' + userdata.hospitalId)}));
			}
    } else if (data.type == 'shop') {
      switch(data.shop) {
				//when somebody wants to call us
				case "orderupdate":
					if (data.msg) {
						$.notify(data.msg, "success");
					}
					onOrderUpdate(wsm, data.orderId, data.status, data.updataData);
				break;
			}
    } else {
			console.log('Nothing Else');
		}
  };

  const onOrderUpdate = function(wsm, orderId, status, changeOrder){
		let changelogs = JSON.parse(localStorage.getItem('changelogs'));
		if (!changelogs) {
			changelogs = [];
		}
		changelogs.push({orderId: orderId, status: status, diffItems: changeOrder.diffItems});
		localStorage.setItem('changelogs', JSON.stringify(changelogs));
		$('.order-box').each(async(i, orderBox)=>{
			let orderData = $(orderBox).data('orderData');
			if (orderData.id == orderId) {
				let newMsgCounts = await changelogs.filter((item, j) =>{
					if (item.status === 'New') {
						return item;
					}
				});
				if (newMsgCounts.length > 0) {
					$(orderBox).find('#NotifyIndicator').text(newMsgCounts.length).show();
				}
			}
		})
  }

  return {
    onMessageShop
	}
}
