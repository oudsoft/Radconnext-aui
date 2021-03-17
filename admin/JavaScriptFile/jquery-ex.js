const $ = require('jquery');
$.fn.center = function () {
  this.css("position","absolute");
  this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
  this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +  $(window).scrollLeft()) + "px");
  return this;
}

$.fn.postCORS = function(url, data, func) {
  if(func == undefined) func = function(){};
    return $.ajax({
      type: 'POST',
      url: url,
      data: data,
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded',
      xhrFields: { withCredentials: true },
      success: function(res) { func(res) },
      error: function(err) { func({err})
    }
  });
}
