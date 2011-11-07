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

	var twitter = $("#twitter")
	
	if (twitter.length == 0) return
	
	var username = $("#twitter").attr("data-username")
	
	if (username) {
		var res=$("<div></div>")
	
		function callback() {
			if (res.find(".tweet-text").length == 0 ) return
			twitter
			.find("p")
				.html(res.find(".tweet-text")[0])
			.end()
			.find("span")
				.html(res.find(".tweet-created_at")[0])
			.end()
		}
		
		res.fetchTweets({  
			username: username,
			count: 1,
			callback: callback,
			showUserInfo: false 
		});

	}
	
});