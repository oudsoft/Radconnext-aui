module.exports = function ( jq ) {
	const $ = jq;

  let sipSession = undefined;
  let rtcSession = undefined;

  const realm = '202.28.68.6';
  const wsUrl = 'wss://' + realm + ':8089/ws';

  const callOptions = {
    mediaConstraints : { 'audio': true, 'video': false },
    rtcOfferConstraints: {'offerToReceiveAudio': true, 'offerToReceiveVideo': false},
    sessionTimersExpires: 7200
  };

  const doRegisterSoftphone = function(softNumber){
		let socket = new JsSIP.WebSocketInterface(wsUrl);
		socket.onmessage = function(msgEvt){
	    let data = JSON.parse(msgEvt.data);
	    console.log(data);
	  }

    let sipUri = 'sip:' + softNumber + '@' + realm;
    let sipConfiguration = {
      sockets: [ socket ],
      authorization_user: softNumber,
      uri: sipUri,
      password: 'qwerty' + softNumber,
      ws_servers: wsUrl,
      realm: realm,
      display_name: softNumber,
      contact_uri: sipUri
    };
    var ua = new JsSIP.UA(sipConfiguration);

    ua.on('connected', function(e){
      console.log('Your are ready connected to your socket.', e);
    });

    ua.on('registered', function(e){
      console.log('Your are ready registered.', e);
    });

    ua.on('unregistered', function(e){
      console.log('Your are ready unregistered.', e);
    });

    ua.on('registrationFailed', function(e){
      console.log('Your are registrationFailed.', e);
    });

    ua.on('disconnected', function(e){
      console.log('Your are ready dis-connected.', e);
    });

    //ua.start();
    ua.on("newRTCSession", function(data){
      rtcSession = data.session;
      sipSession = rtcSession;
      if (rtcSession.direction === "incoming") {
        // incoming call here
        console.log(rtcSession);
        $('#SipPhoneIncomeBox').css({'top': '10px'});
        let ringAudio = document.getElementById('RingAudio');
        ringAudio.play();
        rtcSession.on('failed', function (e) {
          console.log('connecttion failed', e);
          ringAudio.pause();
          let remoteAudio = document.getElementById('RemoteAudio');
					doClearTracks(remoteAudio);
          $('#SipPhoneIncomeBox').find('#IncomeBox').css({'display': 'block'});
          $('#SipPhoneIncomeBox').find('#AnswerBox').css({'display': 'none'});
          $('#SipPhoneIncomeBox').css({'top': '-65px'});
        });
      }
    });

    return ua;
  }

	const doRejectCall = function(evt){
		doHangup(evt);
	}

	const doEndCall = function(evt){
		doHangup(evt);
	}

	const doAcceptCall = function(evt){
		rtcSession.on("accepted",function(e){
	    // the call has answered
	    console.log('onaccept', e);
	  });
	  rtcSession.on("confirmed",function(e){
	    // this handler will be called for incoming calls too
	    console.log('onconfirm', e);
	    var from = e.ack.from._display_name;
			console.log(from);
	  });
	  rtcSession.on("ended",function(e){
	    // the call has ended
	    console.log('onended', e);
	    var remoteAudio = document.getElementById('RemoteAudio');
	    doClearTracks(remoteAudio);
	  });
	  rtcSession.on("failed",function(e){
	    // unable to establish the call
	    console.log('onfailed', e);
			var remoteAudio = document.getElementById('RemoteAudio');
	    doClearTracks(remoteAudio);
	  });

	  // Answer call
	  rtcSession.answer(callOptions);

	  rtcSession.connection.addEventListener('addstream', function (e) {
	    var remoteAudio = document.getElementById("RemoteAudio");
	    remoteAudio.srcObject = e.stream;
	    setTimeout(() => {
	      remoteAudio.play();
	      $('#SipPhoneIncomeBox').find('#IncomeBox').css({'display': 'none'});
	      $('#SipPhoneIncomeBox').find('#AnswerBox').css({'display': 'block'});
	    }, 500);
	  });
	}

	const doClearTracks = function(audio){
	  var stream = audio.srcObject;
	  if (stream){
	    var tracks = stream.getTracks();
	    if (tracks){
	      tracks.forEach(function(track) {
	        track.stop();
	      });
	    }
	  }
	}

	const doHangup = function(evt){
	  if (sipSession){
	    console.log(sipSession);
	    sipSession.terminate();
	    let remoteAudio = document.getElementById('RemoteAudio');
			doClearTracks(remoteAudio);
	    $('#SipPhoneIncomeBox').find('#IncomeBox').css({'display': 'block'});
	    $('#SipPhoneIncomeBox').find('#AnswerBox').css({'display': 'none'});
	    $('#SipPhoneIncomeBox').css({'top': '-65px'});
	  }
	}

  return {
    doRegisterSoftphone,
		doRejectCall,
		doAcceptCall,
		doEndCall
	}
}
