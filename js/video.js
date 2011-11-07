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

	function disable() {
		return false
	}

	$("#mainContent a.video").each(function () {
		var jqEl = $(this)
		var w = jqEl.attr("data-width") || 580
		var h = jqEl.attr("data-height") || 326
		var url = jqEl.attr("href")
		var id
		
		
		if (id = url.match(/http:\/\/www.youtube.com\/watch\?v=(\w+)/)) {
			type = "youtube" 
		} else if (id = url.match(/http:\/\/vimeo.com\/(\w+)/)) {
			type = "vimeo"
		}
		
		if (type) {
		
			jqEl.css("display","block").width(w).height(h)
		
			jqEl.vid({
    			type    : type,
				videoId : id[1],
				hd: jqEl.hasClass("hd"),
				autoPlay:jqEl.hasClass("autoplay"),
				loop:jqEl.hasClass("loop")
   			 });
    		
    		
		}
		
		
	}).removeAttr("href").click(disable)
	
	
	
});