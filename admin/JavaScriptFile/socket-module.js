
const doConnectWebsocketMaster = function (username) {
  const hostname = window.location.hostname;
  const port = window.location.port;
  const paths = window.location.pathname.split('/');
  const rootname = paths[1];

  let wsUrl = 'wss://' + hostname + ':' + port + '/' + rootname + '/' + username + '?type=test';
  let wsm = new WebSocket(wsUrl);
  wsm.onopen = function () {
    console.log('Master Websocket is connected to the signaling server')
  };

  wsm.onmessage = function (msgEvt) {
    let data = JSON.parse(msgEvt.data);
    console.log("data in wsm.onmessage " + msgEvt.data);
    let masterNotify = localStorage.getItem('masternotify');
    let MasterNotify = JSON.parse(masterNotify);
    if (MasterNotify) {
      MasterNotify.push({ notify: data, datetime: new Date(), status: 'new' });
    } else {
      MasterNotify = [];
      MasterNotify.push({ notify: data, datetime: new Date(), status: 'new' });
    }
    localStorage.setItem('masternotify', JSON.stringify(MasterNotify));
    if (data.type == 'test') {
      $.notify(data.message, "success");
    } else if (data.type == 'trigger') {
      let message = { type: 'trigger', dcmname: data.dcmname };
      wsl.send(JSON.stringify(message));
      $.notify('The system will be start store dicom to your local.', "success");
    } else if (data.type == 'notify') {
      $.notify(data.message, "warnning");
    }
  };

  wsm.onclose = function (event) {
    console.log("Master WebSocket is closed now. with  event:=> ", event);
  };

  wsm.onerror = function (err) {
    console.log("Master WS Got error", err);
  };

  return wsm;
}

const doConnectWebsocketLocal = function (username) {
  let wsUrl = 'ws://localhost:3000/webapp/' + username + '?type=test';
  let wsl = new WebSocket(wsUrl);
  wsl.onopen = function () {
    console.log('Local Websocket is connected to the signaling server');
  };

  wsl.onmessage = function (msgEvt) {
    let data = JSON.parse(msgEvt.data);
    //console.log(data);
    let localNotify = localStorage.getItem('localnotify');
    let LocalNotify = JSON.parse(localNotify);
    if (LocalNotify) {
      LocalNotify.push({ notify: data, datetime: new Date(), status: 'new' });
    } else {
      LocalNotify = [];
      LocalNotify.push({ notify: data, datetime: new Date(), status: 'new' });
    }
    localStorage.setItem('localnotify', JSON.stringify(LocalNotify));
    if (data.type == 'test') {
      $.notify(data.message, "success");
    } else if (data.type == 'result') {
      $.notify(data.message, "success");
    } else if (data.type == 'notify') {
      $.notify(data.message, "warnning");
    }
  };

  wsl.onclose = function (event) {
    console.log("Local WebSocket is closed now. with  event:=> ", event);
  };

  wsl.onerror = function (err) {
    console.log("Local WS Got error", err);
  };

  return wsl;
}

module.exports = (username) => {
  const Wsm = doConnectWebsocketMaster(username);
  let Wsl;
  $.get('wss://localhost:3000/prove', {}, function (response) {
    if (response.status.code === 200) {
      Wsl = doConnectWebsocketLocal(username);
    }
    return { Wsm, Wsl };
  })
}
