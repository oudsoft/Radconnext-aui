/* websocketmessage.js */
module.exports = function ( jq ) {
	const $ = jq;

  const onMessageRadio = function (msgEvt) {
		let userdata = JSON.parse(localStorage.getItem('userdata'));
    let data = JSON.parse(msgEvt.data);
    console.log(data);
    if (data.type !== 'test') {
      let masterNotify = localStorage.getItem('masternotify');
      let MasterNotify = JSON.parse(masterNotify);
      if (MasterNotify) {
        MasterNotify.push({notify: data, datetime: new Date(), status: 'new'});
      } else {
        MasterNotify = [];
        MasterNotify.push({notify: data, datetime: new Date(), status: 'new'});
      }
      localStorage.setItem('masternotify', JSON.stringify(MasterNotify));
    }
    if (data.type == 'test') {
      $.notify(data.message, "success");
		} else if (data.type == 'refresh') {
			let eventName = 'triggercounter'
			let triggerData = {caseId : data.caseId, statusId: data.statusId, thing: data.thing};
			let event = new CustomEvent(eventName, {"detail": {eventname: eventName, data: triggerData}});
			document.dispatchEvent(event);
    } else if (data.type == 'notify') {
			$.notify(data.message, "info");
    } else if (data.type == 'callzoom') {
      let eventName = 'callzoominterrupt';
      let callData = {openurl: data.openurl, password: data.password, topic: data.topic, sender: data.sender};
      let event = new CustomEvent(eventName, {"detail": {eventname: eventName, data: callData}});
      document.dispatchEvent(event);
    } else if (data.type == 'callzoomback') {
      let eventName = 'stopzoominterrupt';
      let evtData = {result: data.result};
      let event = new CustomEvent(eventName, {"detail": {eventname: eventName, data: evtData}});
      document.dispatchEvent(event);
		} else if (data.type == 'ping') {
			let minuteLockScreen = userdata.userprofiles[0].Profile.screen.lock;
			let tryLockModTime = (Number(data.counterping) % Number(minuteLockScreen));
			if (data.counterping == minuteLockScreen) {
				let eventName = 'lockscreen';
	      let evtData = {};
	      let event = new CustomEvent(eventName, {"detail": {eventname: eventName, data: evtData}});
	      document.dispatchEvent(event);
			} else if (tryLockModTime == 0) {
				let eventName = 'lockscreen';
	      let evtData = {};
	      let event = new CustomEvent(eventName, {"detail": {eventname: eventName, data: evtData}});
	      document.dispatchEvent(event);
			}
		} else if (data.type == 'unlockscreen') {
			let eventName = 'unlockscreen';
			let evtData = {};
			let event = new CustomEvent(eventName, {"detail": {eventname: eventName, data: evtData}});
			document.dispatchEvent(event);
		} else if (data.type == 'updateuserprofile') {
			let eventName = 'updateuserprofile';
			let evtData = data.profile;
			let event = new CustomEvent(eventName, {"detail": {eventname: eventName, data: evtData}});
			document.dispatchEvent(event);
		} else if (data.type == 'message') {
			$.notify(data.from + ':: ?????????????????????????????????????????????:: ' + data.msg, "info");
			doSaveMessageToLocal(data.msg ,data.from, data.context.topicId, 'new');
			/* ???????????????????????? */
			/* ????????? Swap ???????????? ?????????????????????????????? myId ????????? audienceId ????????????????????? sendto ????????? from */
			let newConversationData = {topicId: data.context.topicId, topicName: data.context.topicName, topicType: data.context.topicType, topicStatusId: data.context.topicStatusId, audienceId: data.context.myId, audienceName: data.context.myName, myId: data.context.audienceId, myName: data.context.audienceName };
			newConversationData.message = {msg: data.msg, from: data.from, context: data.context};
			$('#ContactContainer').trigger('newconversation', [newConversationData]);
		} else if (data.type == 'clientresult') {
			let eventName = 'clientresult';
			let event = new CustomEvent(eventName, {"detail": {eventname: eventName, data: data.result}});
			document.dispatchEvent(event);
		} else if (data.type == 'logreturn') {
			let eventName = 'logreturn';
			let event = new CustomEvent(eventName, {"detail": {eventname: eventName, data: data.log}});
			document.dispatchEvent(event);
		} else if (data.type == 'echoreturn') {
			let eventName = 'echoreturn';
			let event = new CustomEvent(eventName, {"detail": {eventname: eventName, data: data.message}});
			document.dispatchEvent(event);			
    }
  };

	const doSaveMessageToLocal = function(msg ,from, topicId, status){
		let localMsgStorage = localStorage.getItem('localmessage');
		if ((localMsgStorage) && (localMsgStorage !== '')) {
			let localMessage = JSON.parse(localMsgStorage);
			//console.log(localMessage);
			let localMessageJson = localMessage;
			if (localMessageJson) {
				localMessageJson.push({msg: msg, from: from, topicId: topicId, datetime: new Date(), status: status});
			} else {
				localMessageJson = [];
				localMessageJson.push({msg: msg, from: from, topicId: topicId, datetime: new Date(), status: status});
			}
			localStorage.setItem('localmessage', JSON.stringify(localMessageJson));
		} else {
			let firstFocalMessageJson = [];
			firstFocalMessageJson.push({msg: msg, from: from, topicId: topicId, datetime: new Date(), status: status});
			localStorage.setItem('localmessage', JSON.stringify(firstFocalMessageJson));
		}
	}

  return {
    onMessageRadio
	}
}
