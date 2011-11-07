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

	var faqs = $("#mainContent .questions div.item")
	
	if (faqs.length == 0) return
	
	function toggle(el) {
		var jqEl=$(el.currentTarget)
		var close = jqEl.data("faq-expanded") 
		jqEl.data("faq-expanded",!close)
		
		var main = jqEl.parent(".item")
		
		if (close) {
			main.addClass("closed").find(".answer").slideUp(500,"easeOutExpo")
		} else {
			main.removeClass("closed").find(".answer").slideDown(500,"easeOutExpo")
		}
		
		return false
	}
	
	faqs
		.find(".question")
			.css("cursor","pointer")
			.data("faq-expanded",true)
			.click(toggle)
		.end()
		.filter(".closed")
			.find(".question")
				.data("faq-expanded",false)
			.end()
			.find(".answer")
				.hide()
		//.end()
		
		
	
});