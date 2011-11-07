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
                
var mapDescription = ""
                
function map_callback() {
	
	var mapConf = $("#gmaps")	

	var myLatlng = new google.maps.LatLng(mapConf.attr("data-latitude"), mapConf.attr("data-longitude"));
    var myOptions = {
		zoom: 6,
		center: myLatlng,
		html: mapConf.attr("data-title"),
		popup: true,
      	mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById("gmaps"), myOptions);

	
        
    var infowindow = new google.maps.InfoWindow({
        content: mapDescription
    });

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: mapConf.attr("data-title")
    });
    
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });


}

jQuery(function($){

	var map = $("#gmaps")
	
	if (map.length == 0) return

	mapDescription = $("#mapDescription").html()
	$("#mapDescription").remove()
    
	$.getScript("http://maps.google.com/maps/api/js?sensor=false&callback=map_callback&async=2");
    
});