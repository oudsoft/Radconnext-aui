$(document).ready(function () {
	
    	var theme = 'energyblue';
	$('#main_Tabs').jqxTabs({ width: '99.90%', autoHeight: true, position: 'top', theme: 'energyblue' });

	$('#main_Tabs').on('selected', function (event) {
		var selectedTab = event.args.item;

		if (selectedTab == '4') {
			enterTap();
		} else {
			$('#passwordIT').jqxWindow('close');
		}

	});

	/*---------Update Status POP UP------------*/
	$("#passwordIT").jqxWindow({
		width: 350,
		height: 125,
		resizable: false,
		isModal: false,
		autoOpen: false,
		showCollapseButton: true,
		cancelButton: $("#CancelIT"),
		modalOpacity: 0.01
	});
	$("#CancelIT").click(function () {
		$('#passwordIT').jqxWindow('close');
	});
	/*-------------------------------------------*/

});

var adpw;
var enterTap = function () {
	console.log(adpw);
	if (adpw == '@dm1n') {
		$("#passwordIT").jqxWindow('close');
	} else {
		$("#passwordIT").jqxWindow('open');
	}

	$("#SaveIT").click(function () {
		tapPW = $('#PW_IT').val();
		adpw = tapPW;
		var x = document.getElementById("main_IT");

		if (adpw === '@dm1n') {
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
		//console.log(tapPW);
		//console.log(adpw);
		$('#passwordIT').jqxWindow('close');
	});

}
