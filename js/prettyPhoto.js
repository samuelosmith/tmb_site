/*
      
    Theme Name: ?
    Description: brandspace -  a minimal portfolio / corporate template for themeforest.net
    Theme Owner: pixelentity
    File: Main css file  
    Template Designer: Donagh O'Keeffe aka iamdok
    Slicer/Coder : Donagh O'Keeffe aka iamdok and Fabio Cairo aka bitfade
    Web:    http://www.iamdok.com
            http://bitfade.com
            http://themeforest.net/user/pixelentity
            
    */
                


jQuery(function($){

	function over(e) {
		var target=$(e.target)
		
		var w = target.width()
		var h = target.height()
		
		var divClass="prettyPhotoHilight"
		var url = target.parent().attr("href")
		if (url && (url.match(/http:\/\/www.youtube.com\/watch\?v=(\w+)/) || url.match(/http:\/\/vimeo.com\/(\w+)/))) {
			divClass="prettyPhotoVideoHilight"
		}
		
		var overlay = $('<div class="'+divClass+'"></div>')
			.bind("mouseleave",out)
			.bind("click",click)
			
		overlay.data("target",target)
		
		overlay.width(w).height(h)
			
		$("body").append(overlay)
		
		overlay.fadeOut(0).fadeTo(200,.5).offset(target.offset())
		
	}
	
	
	function out(e) {
		var el = $(e.target)
		el.animate({custom: 1},{
			duration: 200,
			easing: "easeOutCubic",
			complete: function() {
				el.remove()
			},
			step:function(now,fx) {
				el.css("opacity",(1-now)/2)
			}
			
		})
		
	}
	
	function click(e) {
		$(e.target).data("target").parent().trigger("click")
		$(e.target).trigger("mouseleave")
	}

	function _rgb2hex(rgb_string, r, g, b)  {
		var rgb = (1 << 24) | (parseInt(r) << 16) | (parseInt(g) << 8) | parseInt(b); 
		return parseInt("0x"+rgb.toString(16).substr(1));
	}

	var bgcolor = $("body").css("background-color").replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, _rgb2hex) 

	$("a[rel^='prettyPhoto']")
		.find("> img")
			.bind("mouseenter",over)
		.end()
		.prettyPhoto({
			theme: bgcolor < 0x808080 ? "facebook" : "facebook"
		})
		
});