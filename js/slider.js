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

	if ($("#banner #prev").length == 0) return
	
	var kenburns = $.pixelentity && $.pixelentity.kenburns && $("#banner").attr("data-animate")
	var panel = $("#banner #infoPanel")
	var pager = $("#banner #navigator ul")
					.find("li")
						.remove()
					.end()
	
	var spinner = $('<div id="spinner"></div>')
	var videooverlay = $('<div id="videooverlay"></div>')

	var transitionSpeed = 800
	var currentSlide = 0
	var currentSlideEl
	var previousSlide = -1
 	var slides = []
 	var locked = false
 	var w = $("#banner").width()
 	var h = $("#banner").height()
 	var videoPlayback = false;
 	var countdown = -1
 	var paused = false
 	var focused = false
 	var hideOnFirst = false
 	var panelDisabled = false
 	var bgcolor = $("#banner").css("background-color").replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, _rgb2hex);
 	
 	var flashEnabled = $.flash.available
 	
 	var box = {
 		width: w,
 		height: h,
 		left:0,
 		overflow: "hidden",
 		visible: true,
 		display: "block",
 		opacity: 0
 	}
 	var direction="next"
				
	function showPanel(show) {
	
		if (show) {
			panel.animate({left: 0},transitionSpeed,"easeOutExpo");
			$("#openInfo").fadeOut(transitionSpeed)
			$("#closeInfo").fadeIn(transitionSpeed)
		} else {
			panel.animate({left: -panel.width() + 32},transitionSpeed,"easeOutExpo");
			if (!panelDisabled) $("#openInfo").fadeIn(transitionSpeed)
			$("#closeInfo").fadeOut(transitionSpeed)
		}
	}
	
	function hidePanel() {
		showPanel(false)
	}
	
	function doTransition(from,to,tType) {
		tType = from ? tType : "fade"
		
		transitionSpeed = tType == "swipe" ? 700 : 1000
		
		currentSlideEl = to
		
		function reset() {
			unlock()
			if (from) {	
				from.fadeOut(0)
				from.find("img:eq(0)").css("margin-left",0)
			}
		}
		
		if (from) {
			var kb = from.find("img:eq(0)").data("kenburns")
			if (kb) kb.stop()
		}
		
		if (to.find("a.video").length > 0) {
			videooverlay.fadeIn(0)
			if (!flashEnabled) {
				var gotcha = $("<a>")
				gotcha.attr("href",to.find("a.video").attr("href")).attr("target","_blank")
				gotcha.width(videooverlay.width()).height(videooverlay.height()).css("position","absolute").show()
				videooverlay.empty().append(gotcha)
			}
		} else {
			videooverlay.empty().fadeOut(0)
		}
		
		switch (tType) {
			case "fade":
				if (from) from.fadeOut(transitionSpeed)
				to.fadeIn(transitionSpeed,unlock)
			break;
			case "whitefade":
				to.fadeOut(0)
				from.fadeOut(transitionSpeed/2,"easeOutQuad",function () {
					to.fadeIn(transitionSpeed/2,"easeInQuad",unlock)
				})
			break;
			case "flyBy":
				if (direction == "next") {
					from.fadeIn(0).css("opacity",1).css("left",0)
					to.fadeIn(0).css("opacity",0).css("left",50)
					from.animate({left:-100,opacity:0},transitionSpeed,"easeOutCubic")
					to.animate({left:0,opacity:1},transitionSpeed,"easeOutCubic",unlock)
				} else {
					from.fadeIn(0).css("opacity",1).css("left",0)
					to.fadeIn(0).css("opacity",0).css("left",-50)
					from.animate({left:100,opacity:0},transitionSpeed,"easeOutCubic")
					to.animate({left:0,opacity:1},transitionSpeed,"easeOutCubic",unlock)
				}
			break;
			case "swipe":
				
				var img 
				var flyBy = 100
				
				to.css(box)
				if (from) from.css(box).css("opacity",1)
						
				img = (direction == "next") ? to.find("img:eq(0)") : from ? from.find("img:eq(0)") : null
				
				function prevTransition(now, fx) {
					var size = Math.round(now*w)
					var offs = Math.round(flyBy*(1-now))
					to.css("left",-offs).width(size+flyBy)
					if (img) img.css("margin-left",-size)
					if (from) {
						from.css("opacity",0.5+0.5*(1-now)).css("left",size+flyBy-offs).width(w-size)
					}
					
				}
				
				function nextTransition(now, fx) {
					var size = Math.round(now*w)
					var offs = Math.round(flyBy*(1-now))
					to.css("left",w-size+offs).width(size)
					if (img) img.css("margin-left",size-w)
					if (from) {
						from.css("opacity",0.5+0.5*(1-now)).css("left",offs-flyBy).width(w-size+flyBy)
					}
				}
				
				to.animate({opacity: 1},{
					duration: transitionSpeed,
					easing: "easeOutCubic",
					complete: reset,
					step: direction == "next" ? nextTransition : prevTransition
					
				})
				
				
			break;

				
		}
	}
	
	function unlock() {
		locked = false
	}
	
	function resourceLoaded(e) {
		locked = false
		showSlide(parseInt(e.target.id),true)
	}
	
	function preloadResource(idx,cb) {
		var resource = slides[idx].resource
		if (!resource) return true
		var lazyLoadSrc = $(resource).attr("src") ? "" : $(resource).attr("data-src")
		if (lazyLoadSrc) {
			$(resource).attr("src",lazyLoadSrc)
		}
		if (!resource.complete) {
			if (cb) $(resource).one("load",cb)
		} 
		return resource.complete
	}
	
	function showSlide(idx,loaded) {
		if (previousSlide != idx && !locked) {
			locked = true
		
			if (!loaded && !preloadResource(idx,resourceLoaded)) {
				spinner.fadeIn(500)
				return
			}
			
			stopVideo()
			
			
			preloadResource(prevNextIndex(idx,"next"))
			
			pager.find("a").removeClass("currentSlide").eq(idx).addClass("currentSlide")
			panel.find("#info").replaceWith(slides[idx].caption)
			
			currentSlide = previousSlide = idx
			spinner.fadeOut(100)
			
			var from = jqSlides.filter(".active").removeClass("active")
			var to = jqSlides.eq(idx).addClass("active")
			
			var tType = to.attr("data-transition") || "swipe"
			var kbTarget 
			
			if (kenburns) {
				kbTarget = to.find("img") 
				if (kbTarget) {
					tType = "fade"
				}
			}
			
			
			var delay = to.attr("data-delay")
			if (delay) {
				countdown = parseFloat(delay)*4
			}
			
			// msie bug fix ....
			to.show().fadeOut(0)
			
			if (kbTarget) {
				kbTarget.kenburns({
					zoom:to.attr("data-zoom"),
					align:to.attr("data-align"),
					pan:to.attr("data-pan"),
					duration:to.attr("data-duration")
				})
			}
			
			doTransition(from[0] ? from : null,to,tType)
			
			// hide panel on first time
			if (hideOnFirst) {
				hideOnFirst = false
				setTimeout(hidePanel,1000)
			}
			
			
		}
	}
	
	function timerController() {
		if (paused || countdown < 0) return
		if (countdown == 0) {
			showSlide(prevNextIndex(currentSlide,"next"))
		}
		countdown--
	}
	
	function panelHandler(e) {
		showPanel(e.currentTarget.id == "openInfo")
		return false
	}
	
	function prevNextIndex(from,dir) {
		var nextIdx = from
		nextIdx += (dir == "prev" ? -1 : 1)
		nextIdx %= slides.length
		if (nextIdx < 0) nextIdx += slides.length
		return nextIdx
	}
	
	function prevNextHandler(e) {
		direction = e.currentTarget.id
		showSlide(prevNextIndex(currentSlide,direction))
		return false
	}
	
	function navigatorHandler(e) {
		var idx = parseInt(e.currentTarget.id)
		direction = idx >= currentSlide ? "next" : "prev"
		showSlide(idx)
		return false
	}
	
	function parseSlide(idx,el) {
		var jqEl = $(el).attr("id",idx)
		var caption = jqEl.find(" > div").detach().attr({id:"info"}).get(0)
		var resource = jqEl.find("img").attr({id:idx})[0]
		slides[idx] = {caption:caption, resource:resource}
		pager.append('<li><a href="#" '+ (idx == 0 ? 'class="currentSlide"' : '') +' id="'+idx+'">1</a></li>')
	}
	
	function clearVideo() {
		spinner.empty()
		videoPlayback = false
		if (!focused) paused = false
	} 
	
	function stopVideo() {
		if (videoPlayback) {
			spinner.css("background-color","none")
			spinner.fadeOut(500,clearVideo)
			videooverlay.fadeIn(0)
			$("#closeVideo").fadeOut(500);
			var kb = jqSlides.filter(".active").find("img:eq(0)").data("kenburns")
			if (kb) kb.resume()
		}
		return false
	}
	
	function loadVideo(url,hd,autoPlay,loop) {
	
		if (videoPlayback) return false
	
		var id,type
		
		if (id = url.match(/http:\/\/www.youtube.com\/watch\?v=(\w+)/)) {
			type = "youtube" 
		} else if (id = url.match(/http:\/\/vimeo.com\/(\w+)/)) {
			type = "vimeo"
		}
		if (type) {
		
			stopVideo()
		
			videoPlayback = true
			paused = true
			
			var kb = jqSlides.filter(".active").find("img:eq(0)").data("kenburns")
			if (kb) kb.pause()
			
			spinner.css("background-color",bgcolor)
			spinner.fadeIn(500)
			videooverlay.fadeOut(0)
			showPanel(false)
			$("#closeVideo").fadeIn(500);
		
			var api = spinner.vid({
    			type    : type,
				videoId : id[1],
				hd: hd,
				autoPlay:autoPlay,
				loop:loop,
				bgcolor:bgcolor
   			 });
    		
    		
		}
			

	}
	
	function loadResource(e) {
		var el = $(e.currentTarget)
		
		if (el.hasClass("video")) {
			loadVideo(el[0].href,el.hasClass("hd"),el.hasClass("autoplay"),el.hasClass("loop"))
			return false
		}
		
		return true
	}
	
	function eventHandler(e) {
		switch (e.type) {
			case "mouseenter":
				paused = true
				focused = true
			break
			case "mouseleave":
				if (!videoPlayback) paused = false
				focused = false
			break
		}
	}
	
	function videooverlayClick() {
		var videoLink = currentSlideEl.find("a.video")
		if (videoLink.length > 0) {
			videoLink.trigger("click")
		}
	}
	
	function _rgb2hex(rgb_string, r, g, b)  {
      var rgb = (1 << 24) | (parseInt(r) << 16) | (parseInt(g) << 8) | parseInt(b); //same thing of: ( r + (256 * g) + (65536 * b) + 16777216)
      return '#' + rgb.toString(16).substr(1); //substr(1) because we have to remove the (1 << 24) added above
	}

	var b = $("#banner")
		.find("#closeInfo, #openInfo")
			.click(panelHandler)
		.end()
		.find("#prev, #next")
			.click(prevNextHandler)
		.end()
		.find("#closeVideo")
			.click(stopVideo)
		.end()
		.bind("mouseenter",eventHandler)
		.bind("mouseleave",eventHandler)
	
	var tmp = transitionSpeed
	transitionSpeed = 0
	switch (b.attr("data-panel")) {
		case "hidden":
			showPanel(false,0)
		break;
		case "hideOnFirst":
			hideOnFirst = true
		break;
		case "disabled":
			showPanel(false,0)
			panelDisabled = true
			$("#openInfo").hide()
		break;
	}
	transitionSpeed = tmp
		
	var jqSlides = $("#banner #slides > div")
		
	// silly ie9 fix
	if ($.browser.msie && $.browser.version > 8) {
		jqSlides
			.find("img")
				.each(function () {
					var jqImg = $(this)
					if (!jqImg.attr("data-src")) {
						jqImg.attr("data-src",jqImg.attr("src"))
						jqImg.removeAttr("src")
					}
				})
			.end()
	}
		
	jqSlides
		.width(w)
		.height(h)
		.show()
		.fadeOut(0)
		.removeClass("active")
		.find("img[src*='img/icons/blank.png']")
			.removeAttr("src")
		.end()
		.find("a")
			.click(loadResource)
		.end()
		.each(parseSlide)
	.end()
	
	pager.find("a").click(navigatorHandler)
	if (flashEnabled) videooverlay.hide().click(videooverlayClick)
	$("#banner #slides").append(spinner).append(videooverlay)
	spinner.width(w-64).height(h).css("padding","0px 32px 0px 32px")
	
	showSlide(0)
	setInterval(timerController,250)
	
			
});