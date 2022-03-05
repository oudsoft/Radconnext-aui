module.exports = function ( jq ) {
	const $ = jq;

  const util = require('../../case/mod/utilmod.js')($);
  const common = require('../../case/mod/commonlib.js')($);

	const pageFontStyle = {"font-family": "THSarabunNew", "font-size": "24px"};


  const doOpenRemoteRun = function(hospitalId){

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
		let reportLogFileCmdCmd = $('<input type="button" value=" Report Log File " style="margin-left: 20px;"/>');
		let dicomLogFileCmdCmd = $('<input type="button" value=" Dicom Log File " style="margin-left: 20px;"/>');
		let restartServiceCmdCmd = $('<input type="button" value=" Restart Service " style="margin-left: 20px;"/>');
		let backCmd = $('<input type="button" value=" Back " style="margin-left: 20px;"/>');
    $(executeCmdValueCell).append($(executeCmdCmd)).append($(echoCmdCmd)).append($(logFileCmdCmd)).append($(reportLogFileCmdCmd)).append($(dicomLogFileCmdCmd)).append($(restartServiceCmdCmd));
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
		$(exampleCommandBox).append($('<p>D:/Radconnext/restart.bat</p>'));
    const userdata = JSON.parse(localStorage.getItem('userdata'));
		if (hospitalId){
			$(hospitalInput).val(hospitalId);
		} else {
			$(hospitalInput).val(userdata.hospitalId);
		}

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

		$(reportLogFileCmdCmd).on('click', (evt)=>{
			let hospitalId = $(hospitalInput).val();
      let username = userdata.username;
			wsm.send(JSON.stringify({type: 'clientreportlog', hospitalId: hospitalId, sender: username, sendto: 'orthanc'}));
    });

		$(dicomLogFileCmdCmd).on('click', (evt)=>{
			let hospitalId = $(hospitalInput).val();
      let username = userdata.username;
			wsm.send(JSON.stringify({type: 'clientdicomlog', hospitalId: hospitalId, sender: username, sendto: 'orthanc'}));
    });

		$(restartServiceCmdCmd).on('click', (evt)=>{
      let hospitalId = $(hospitalInput).val();
			let username = userdata.username;
			wsm.send(JSON.stringify({type: 'clientrestart', hospitalId: hospitalId, sender: username, sendto: 'orthanc'}));
		});

		$(backCmd).on('click', (evt)=>{
			window.open('/staff.html');
		});

    let remoteRunBox = $('<div id ="RemoteRunBox" style="display: table; width: 100%; border-collapse: collapse;"></div>');
    $(remoteRunBox).append($(hospitalIdBox)).append($(monitorBox)).append($(commandsListBox)).append($(executeCmdBox));
		let remoteBox = $('<div style="position: relative; width: 100%;"></div>');
		let backCmdBox = $('<div style="position: relative; width: 100%; text-align: center;"></div>');
		$(backCmdBox).append($(backCmd));
		return $(remoteBox).append($(remoteRunBox)).append($(exampleCommandBox)).append($(backCmdBox));
  }

	const doCreateResultMonitor = function(){
		let monitorBox = $('<div id ="MonitorBox" style="position: relative; width: 100%; padding: 5px; min-height: 250px; background-color: black; color: white; overflow: scroll; resize: both;"></div>');
		return $( monitorBox);
	}

	const onClientResult = async function(evt){
		let clientData = evt.detail.data;
		let clientOwnerId = evt.detail.owner;
		let clientHospitalId = evt.detail.hospitalId;
		console.log(clientData);
		//let lines = clientData.split('\n');
		//console.log(lines);
		let resultBox = $('<div style="position: relative; width: 100%; padding: 5px; color: white;"></div>');
		$(resultBox).text(clientData);
		let monitorHandle = $('#app').find('#MonitorBox');
		$(monitorHandle).append($(resultBox));
		let clientDataObject = JSON.parse(clientData);
		let parentResources = clientDataObject.hasOwnProperty('ParentResources');
		let failedInstancesCount = clientDataObject.hasOwnProperty('FailedInstancesCount');
		let instancesCount = clientDataObject.hasOwnProperty('InstancesCount');
		if ((parentResources.length == 1) && (failedInstancesCount == 0) && (instancesCount > 0)){
			let studyID = parentResources[0];
			let studyTags = await common.doCallLoadStudyTags(clientHospitalId, studyID);
			console.log(studyTags);
			let reStudyRes = await common.doReStructureDicom(clientHospitalId, studyID, studyTags);
			console.log(reStudyRes);
		}
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
