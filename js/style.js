/*
      
    Theme Name: Brandspace
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

	$("#header a[href='#']").removeAttr("href").addClass("noLink")
	$("#stats li a[href='#']").removeAttr("href")
        
        if (navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/)) {
		$("html").addClass("iDevices")
	}
	
});