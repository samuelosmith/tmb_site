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

	var longInfo = $("#categoryInfo #infoLong")
	if (longInfo.length == 0) return
	
	var hiding = false
	
	function show() {
		hiding = false
		longInfo.slideDown(500,"easeOutExpo")
		return false
	}
	
	function hide() {
		if (hiding) return false
		hiding = true
		longInfo.slideUp(500,"easeOutExpo")
		return false
	}
	
	
	$("#categoryInfo .readMore a").click(show)
	longInfo.bind("mouseleave",hide)
	$("#singleCat #infoLong h2.readLess").click(hide)
	
	
	
});