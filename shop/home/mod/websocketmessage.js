/* websocketmessage.js */
module.exports = function ( jq, wsm ) {
	const $ = jq;

  const onMessageShop = function (msgEvt) {
		let userdata = JSON.parse(localStorage.getItem('userdata'));
    let data = JSON.parse(msgEvt.data);
    console.log(data);
    if (data.type == 'test') {
      $.notify(data.message, "info");
		} else if (data.type == 'ping') {
			let modPingCounter = Number(data.counterping) % 10;
			if (modPingCounter == 0) {
				wsm.send(JSON.stringify({type: 'pong', myconnection: (userdata.id + '/' + userdata.username + '/' + userdata.hospitalId)}));
			}
    } else if (data.type == 'shop') {
      switch(data.shop) {
				//when somebody wants to call us
				case "orderupdate":
					onOrderUpdate(wsm, data.shop);
				break;
			}
    } else {
			console.log('Nothing Else');
		}
  };

  const onOrderUpdate = function(wsm, changeOrder){
		let changelogs = JSON.parse(localStorage.getItem('changelogs'));
		if (!changelogs) {
			changelogs = [];
		}
		changelogs.push(changeOrder);
		localStorage.setItem('changelogs', JSON.stringify(changelogs))
  }

  return {
    onMessageShop
	}
}
