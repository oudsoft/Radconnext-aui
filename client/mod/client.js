module.exports = function ( jq ) {
	const $ = jq;

  const util = require('../../case/mod/utilmod.js')($);
  const common = require('../../case/mod/commonlib.js')($);

	const pageFontStyle = {"font-family": "THSarabunNew", "font-size": "24px"};


  const doOpenRemoteRun = function(){


    let hospitalIdBox = $('<div style="display: table-row; width: 100%;"></div>');
    let hospitalLabelCell = $('<div style="display: table-cell; padding: 4px;">Hospital Id:</div>');
    let hospitalValueCell = $('<div style="display: table-cell; padding: 4px;"></div>');
    let hospitalInput = $('<input type="text"/>');
    $(hospitalValueCell).append($(hospitalInput));
    $(hospitalIdBox).append($(hospitalLabelCell)).append($(hospitalValueCell));

		let monitorBox = $('<div style="display: table-row; width: 100%;"></div>');
    let monitorLabelCell = $('<div style="display: table-cell; padding: 4px;">Monitor:</div>');
    let monitorValueCell = $('<div style="display: table-cell; padding: 4px;"></div>');
		let monitor = doCreateResultMonitor();
		$(monitorValueCell).append($(monitor));
		$(monitorBox).append($(monitorLabelCell)).append($(monitorValueCell));

    let commandsListBox = $('<div style="display: table-row; width: 100%;"></div>');
    let commandsListLabelCell = $('<div style="display: table-cell; padding: 4px;">Command Script:</div>');
    let commandsListValueCell = $('<div style="display: table-cell; padding: 4px;"></div>');
    let commandsListInput = $('<textarea cols="80" rows="10"></textarea>');
    $(commandsListValueCell).append($(commandsListInput));
    $(commandsListBox).append($(commandsListLabelCell)).append($(commandsListValueCell));

    let executeCmdBox = $('<div style="display: table-row; width: 100%;"></div>');
    let executeCmdLabelCell = $('<div style="display: table-cell; padding: 4px;"></div>');
    let executeCmdValueCell = $('<div style="display: table-cell; padding: 4px;"></div>');
    let executeCmdCmd = $('<input type="button" value=" Run "/>');
    let echoCmdCmd = $('<input type="button" value=" Echo " style="margin-left: 20px;"/>');
    let logFileCmdCmd = $('<input type="button" value=" Log File " style="margin-left: 20px;"/>');
		let toTextCmdCmd = $('<input type="button" value=" toText " style="margin-left: 20px;"/>');
    $(executeCmdValueCell).append($(executeCmdCmd)).append($(echoCmdCmd)).append($(logFileCmdCmd)).append($(toTextCmdCmd));
    $(executeCmdBox).append($(executeCmdLabelCell)).append($(executeCmdValueCell));

		// Clear command
		// update command

		let exampleCommandBox = $('<div style="position: relative; width: 100%;"></div>');
		$(exampleCommandBox).append($('<h3>Example</h3>'));
		$(exampleCommandBox).append($('<p>cd C:/RadConnext/Radconnext-win32-x64/resources/app</p>'));
		$(exampleCommandBox).append($('<p>git clone https://github.com/oudsoft/Radconnext-aui tmp/</p>'));
		$(exampleCommandBox).append($('<p>Xcopy tmp http /E /H /C /I /q</p>'));
		$(exampleCommandBox).append($('<p>rmdir tmp /S /q</p>'));
		$(exampleCommandBox).append($('<p>sc stop "radconnext-service"</p>'));
		$(exampleCommandBox).append($('<p>sc start "radconnext-service"</p>'));
		$(exampleCommandBox).append($('<p>sc start "radconnext-service"</p>'));
		$(exampleCommandBox).append($('<p>runas /user:Administator "cmd.exe /C %CD%C:/RadConnext/Radconnext-win32-x64/resources/app"</p>'));
		$(exampleCommandBox).append($('<p>curl --list-only --user radconnext:A4AYitoDUB -T C:\\RadConnext\\Radconnext-win32-x64\\resources\\app\\http\\log\\log.log ftp://119.59.125.63/domains/radconnext.com/private_html/radconnext/inc_files/</p>'));

    const userdata = JSON.parse(localStorage.getItem('userdata'));
    $(hospitalInput).val(userdata.hospitalId);

    const wsm = util.doConnectWebsocketMaster(userdata.username, userdata.usertypeId, userdata.hospitalId, 'none');
    /*
    let extOnMsg = $.extend({
        onmessage : function(evt){
          console.log(evt);
        }
    }, wsm.onmessage);

    wsm.onmessage = extOnMsg;
    */
    $(echoCmdCmd).on('click', (evt)=>{
      let hospitalId = $(hospitalInput).val();
      let username = userdata.username;
      wsm.send(JSON.stringify({type: 'clientecho', hospitalId: hospitalId, sender: username, sendto: 'orthanc'}));
    });

    $(executeCmdCmd).on('click', (evt)=>{
      let hospitalId = $(hospitalInput).val();
      let username = userdata.username;
      let commands = $(commandsListInput).val();
      var lines = [];
      $.each(commands.split(/\n/), function(i, line){
        if(line){
          lines.push(line);
        } else {
          lines.push("");
        }
      });
      wsm.send(JSON.stringify({type: 'clientrun', hospitalId: hospitalId, commands: lines, sender: username, sendto: 'orthanc'}));
    });

    $(logFileCmdCmd).on('click', (evt)=>{
			let hospitalId = $(hospitalInput).val();
      let username = userdata.username;
			wsm.send(JSON.stringify({type: 'clientlog', hospitalId: hospitalId, sender: username, sendto: 'orthanc'}));
    });

		$(toTextCmdCmd).on('click', (evt)=>{
			//let yourHtml = '<br><b>AGENDA</b> Normal<p><br></p><p>?????????????????????</p><p><br></p><p>Pok Pok.</p><br><h2 style="text-align: center;"><span style="font-size:20px;font-weight: normal;">??????????????????????????????????????? 30/Nov/2563</span></h2>';
			let yourHtml = $(commandsListInput).val();
			doTestToAsciidoc(yourHtml);
		});

    let remoteRunBox = $('<div id ="RemoteRunBox" style="display: table; width: 100%; border-collapse: collapse;"></div>');
    $(remoteRunBox).append($(hospitalIdBox)).append($(monitorBox)).append($(commandsListBox)).append($(executeCmdBox));
		let remoteBox = $('<div style="position: relative; width: 100%;"></div>');
		return $(remoteBox).append($(remoteRunBox)).append($(exampleCommandBox));
  }

	const doCreateResultMonitor = function(){
		let monitorBox = $('<div id ="MonitorBox" style="position: relative; width: 100%; padding: 5px; min-height: 250px; background-color: black; color: white; overflow: scroll; resize: both;"></div>');
		return $( monitorBox);
	}

	const onClientResult = function(evt){
		let clientData = evt.detail.data;
		console.log(clientData);
		//let lines = clientData.split('\n');
		//console.log(lines);
		let resultBox = $('<div style="position: relative; width: 100%; padding: 5px; color: white;"></div>');
		$(resultBox).text(clientData);
		let monitorHandle = $('#app').find('#MonitorBox');
		$(monitorHandle).append($(resultBox));
	}

	const onClientLogReturn = function(evt){
		let clientData = evt.detail.data;
		console.log(clientData);
		let logBox = $('<div style="position: relative; width: 100%; padding: 5px; color: white;"></div>');
		$(logBox).append($('<a href="' + clientData.link + '" target="_blank">' + clientData.link + '</a>'));
		let monitorHandle = $('#app').find('#MonitorBox');
		$(monitorHandle).append($(logBox));
	}

	const onClientEchoReturn = function(evt){
		let clientData = evt.detail.data;
		console.log(clientData);
		let echoMsgBox = $('<div style="position: relative; width: 100%; padding: 5px; color: white;"></div>');
		$(echoMsgBox).text(clientData);
		let monitorHandle = $('#app').find('#MonitorBox');
		$(monitorHandle).append($(echoMsgBox));
	}

	const doTestToAsciidoc = function(yourHtml){
		let outText = toAsciidoc(yourHtml);
		console.log(outText);
		let resultBox = $('<div style="position: relative; width: 100%; padding: 5px; color: white;"></div>');
		$(resultBox).text(outText);
		let monitorHandle = $('#app').find('#MonitorBox');
		$(monitorHandle).append($(resultBox));
	}

	$('#MonitorBox').resize(()=>{
		console.log('evt');
	});

	// $('#MonitorBox').removeResize(myFunc);
	/*
	var resizeElement = document.getElementById('MonitorBox');
	var	resizeCallback = function() {
				console.log('ok');
		};
		addResizeListener(resizeElement, resizeCallback);
		*/
  return {
    doOpenRemoteRun,
		onClientResult,
		onClientLogReturn,
		onClientEchoReturn
	}
}
