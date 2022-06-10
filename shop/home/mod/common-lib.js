module.exports = function ( jq ) {
	const $ = jq;

  const doCallApi = function(apiUrl, rqParams) {
    return new Promise(function(resolve, reject) {
      $('body').loading('start');
      $.post(apiUrl, rqParams, function(data){
        resolve(data);
        $('body').loading('stop');
      }).fail(function(error) {
        reject(error);
        $('body').loading('stop');
      });
    });
  }

  const doGetApi = function(apiUrl, rqParams) {
    return new Promise(function(resolve, reject) {
      $('body').loading('start');
      $.get(apiUrl, rqParams, function(data){
        resolve(data);
        $('body').loading('stop');
      }).fail(function(error) {
        reject(error);
        $('body').loading('stop');
      });
    });
  }

	const doUserLogout = function() {
	  localStorage.removeItem('token');
		localStorage.removeItem('userdata');
	  let url = '/shop/index.html';
	  window.location.replace(url);
	}

	const doFormatNumber = function(num){
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
    return Number(num).toLocaleString('en', options);
  }

	const doFormatDateStr = function(d) {
		var yy, mm, dd;
		yy = d.getFullYear();
		if (d.getMonth() + 1 < 10) {
			mm = '0' + (d.getMonth() + 1);
		} else {
			mm = '' + (d.getMonth() + 1);
		}
		if (d.getDate() < 10) {
			dd = '0' + d.getDate();
		} else {
			dd = '' + d.getDate();
		}
		var td = `${yy}-${mm}-${dd}`;
		return td;
	}

	const doFormatTimeStr = function(d) {
		var hh, mn, ss;
		hh = d.getHours();
		mn = d.getMinutes();
		ss = d.getSeconds();
		var td = `${hh}:${mn}:${ss}`;
		return td;
	}

	const doCreateImageCmd = function(imageUrl) {
    let imgCmd = $('<img src="' + imageUrl + '"/>').css({'width': '35px', 'height': 'auto', 'cursor': 'pointer', 'border': '2px solid #ddd'});
    $(imgCmd).hover(()=>{
			$(imgCmd).css({'border': '2px solid grey'});
		},()=>{
			$(imgCmd).css({'border': '2px solid #ddd'});
		});
    return $(imgCmd)
  }

	const doCreateTextCmd = function(text, bgcolor, textcolor) {
    let textCmd = $('<span></span>').css({'min-height': '35px', 'line-height': '30px', 'cursor': 'pointer', 'border': '2px solid #ddd', 'border-radius': '4px', 'padding': '4px'});
		$(textCmd).text(text);
		$(textCmd).css({'background-color': bgcolor, 'color': textcolor});
    $(textCmd).hover(()=>{
			$(textCmd).css({'border': '2px solid grey'});
		},()=>{
			$(textCmd).css({'border': '2px solid #ddd'});
		});
    return $(textCmd)
  }

	const delay = function(ms) {
  	return new Promise(resolve => setTimeout(resolve, ms));
	}

  return {
    doCallApi,
    doGetApi,
		doUserLogout,
		doFormatNumber,
		doFormatDateStr,
		doFormatTimeStr,
		doCreateImageCmd,
		doCreateTextCmd,
		delay
	}
}
