$('#upload').click(function() {
	
    	var theme = 'energyblue';
	var _file = document.getElementById('filUpload');

	var data = new FormData();
	data.append('filUpload', _file.files[0]); //$_FILES['filUpload']

	$.ajax({
	    url: 'test2.php',
	    data: data,
	    type: 'POST',
	    dataType: "json",
	    contentType: false,
	    processData: false,
	    success: function (data) {
        if (data.status == 'success') {
            alert(data.data);
        } else {
            alert(data.data);
        }
      },
	})
});