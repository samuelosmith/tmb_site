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

	var items = $("#banner #browser a")
	
	if (items.length == 0) return
	
	var kenburns = $.pixelentity && $.pixelentity.kenburns && $("#banner").attr("data-animate")
	var kbparams = ["data-zoom","data-align","data-pan","data-duration","data-delay"]
	
	var big = $("#banner #slides")
	var w = big.width()
	var h = big.height()
	
	big.width(w).height(h).css("overflow","hidden").empty()
	var locked = false;
	var paused = false
	var countdown = -1
	var activeThumb
	
	
	var hilight=$('<div class="galleryHilight"></div>').hide()
	$("#banner").append(hilight)
	
	
	function clean(e) {
		big.find("span:not(:last)").remove()
	}
	
	function kbStop(idx,el) {
		var kb = $(el).find("img").data("kenburns")
		if (kb) {
			kb.stop()
		}
	}
	
	function loaded(e) {
		var img = e.currentTarget;
		locked = false;
		
		hilight.show().fadeTo(0,0.75).offset(activeThumb.offset())
		
		var div = $("<span>")
		div
			.width(w)
			.height(h)
			.css("position","absolute")
			.fadeOut(0)
			.append(img)
			.fadeIn(1000,clean)
		
		if (kenburns) {
			big.find("span").each(kbStop)
			img = $(img)
		
			img.kenburns({
				zoom:img.attr("data-zoom"),
				align:img.attr("data-align"),
				pan:img.attr("data-pan"),
				duration:img.attr("data-duration")
			})
		}
		
		big.append(div[0])
		
		var delay = img.attr("data-delay")
		if (delay) {
			countdown = parseFloat(delay)*4
		}
		
	}
	
	function click(e) {
		if (locked) return
		locked = true
	
		var active = $(e.currentTarget)
	
		items.removeClass("active")
		active.addClass("active")
		
		activeThumb = active.find("img:eq(0)")
		
				
		var img = $("<img/>");
		img.load(loaded)
		
		$.each(kbparams,function(idx,p) {
			img.attr(p,active.attr(p))
		})
		
		img.attr("src",active.attr("href"))
		
		return false;
	}
	
	function loadNext() {
		var idx= parseInt(items.filter(".active").eq(0).attr("id"))
		idx = (idx + 1) % n
		items.eq(idx).trigger("click"); 
	}
	
	function timerController() {
		if (paused || countdown < 0) return
		if (countdown == 0) {
			loadNext()
		}
		countdown--
	}
	
	function eventHandler(e) {
		paused = (e.type == "mouseenter")
	}
	
	var idx = 0
	
	items.click(click).each(function () {
		this.id = idx++
	})
	
	var n = idx
	
	items.filter(".active").eq(0).trigger("click")
	$("#banner").bind("mouseenter",eventHandler).bind("mouseleave",eventHandler)
	
	setInterval(timerController,250)
	loadNext()
		
});