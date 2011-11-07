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

	
	var tagline = $("#tagline")
	var delay = parseInt(tagline.attr("data-delay")) || 5
	delay *= 1000
	
	var slides = tagline.find("H4")
	var n = slides.length
	 
	 
	if (n > 1) {
		var w = tagline.width()
		var h = tagline.height()
		var counter = 0
		var hasFocus = false
		
		tagline.width(w).height(h).css("overflow","hidden")
		slides.show().fadeOut(0)
		slides.filter(".currentSlogan").show()
		
		function rotate() {
			if (hasFocus) return
			var from = slides.eq(counter)
			counter = (counter + 1) % n
			var to = slides.eq(counter)
			
			from.fadeOut(500,function() {
				to.fadeIn(500)
			})
			
		}
		
		function eventHandler(e) {
			hasFocus = (e.type == "mouseenter")
		}
		
		tagline
			.bind("mouseenter",eventHandler)
			.bind("mouseleave",eventHandler)
		
		setInterval(rotate,delay)
		
		
	}
});