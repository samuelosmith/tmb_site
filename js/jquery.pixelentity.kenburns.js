(function($) { 	

	$.pixelentity = $.pixelentity || {version: '1.0.0'};

	$.pixelentity.kenburns = {	
		conf: { 
			zoom	: 'random',
			align	: 'random',
			pan 	: 'random',
			duration: '15'
		} 
	};
	
	var scaleCSS = {
		width: 0,
		height: 0,
		"margin-left": 0,
		"margin-top" : 0
	}
	
	// align/pan values
	var valign = ["top","center","bottom"]
	var halign = ["left","center","right"]
	
	var useCSS = false
	var useCanvas = false;
	var blackBackground = false;
	var paused = false;
	
	// check for css transforms 
	if ($.browser.msie) {
		useCSS = true
		blackBackground = $.browser.msie
	} 
	
	// check for canvas support
	if (!useCSS && Modernizr.canvas) {
		useCanvas = true
	}
	
	var iDev = navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/);
	
	if (iDev) {
		useCSS = true
		useCanvas = false
	}
	
	function transform(target,canvas,tw,th,ratio,offsX,offsY) {
	
		if (useCanvas) {				
			if (canvas) canvas.drawImage(target[0],offsX,offsY,tw*ratio,th*ratio);
		} else if (useCSS) {
			if (target) target.transform(ratio,offsX,offsY)	
		} else {
			scaleCSS.width = tw*ratio
			scaleCSS.height = th*ratio
			scaleCSS["margin-left"] = offsX
			scaleCSS["margin-top"] = offsY		
			if (target) target.css(scaleCSS)	
		}
	}
	
	function KenBurns(t, conf) {

		/* private vars */

		var self = this
 		var target = t
 		
		var tw,th,w,h,ratioFrom,ratioTo,xFrom,xTo,yFrom,yTo,xPrev,yPrev,counter,duration = 500,repeat = 0,canvas
		var zoom,pan,align
		
		// get a scaler object
		function computeValues() {
		
			var scaler
		
			// deal with loop
			if (repeat > 0) {
				// not first run, save last scale ratio
				xFrom = xTo
				yFrom = yTo
				ratioFrom = ratioTo
			} else {
				// get the scaler using conf options
				scaler = $.pixelentity.Geom.getScaler(zoom == "out" ?  "fill" : "none",align.w,align.h,w,h,tw,th)
				xFrom = scaler.offset.w
				yFrom = scaler.offset.h
				ratioFrom = scaler.ratio
			}
			
			scaler = $.pixelentity.Geom.getScaler(zoom == "in" ?  "fill" : "none",pan.w,pan.h,w,h,tw,th)
			xTo = scaler.offset.w
			yTo = scaler.offset.h
			ratioTo = scaler.ratio
				
			xPrev = 0
			yPrev = 0
				
			duration = parseFloat(conf.duration)*33
				
			// reset counter
			counter = 0
			
			// update runs count
			repeat++
			
		}
		
		function randomSpot() {
			return valign[parseInt(Math.random()*2+0.5)]+","+halign[parseInt(Math.random()*2+0.5)];
		}
		
		function computeSettings() {
			
			zoom = conf.zoom == "random" ? (Math.random() > 0.5 ? "out" : "in") : conf.zoom	
			if (iDev) zoom = "none"			
			align = $.pixelentity.Geom.splitProps(conf.align == "random" ? randomSpot() : conf.align)
			pan = $.pixelentity.Geom.splitProps(conf.pan == "random" ? randomSpot() : conf.pan)
		
		}
		
		
		function worker() {
			if (paused) return
			var now = counter/duration
			var ratio = ratioFrom+(ratioTo-ratioFrom)*now
			var offsX = xFrom+(xTo-xFrom)*now
			var offsY = yFrom+(yTo-yFrom)*now
		
			transform(target,canvas,tw,th,ratio,offsX,offsY)
			
			counter++
			
			if (counter > duration) {
				self.stop()
			}
			
		}
	
			 
		$.extend(self, {
			init: function(e) {
				tw = t.width() || t[0].width
				th = t.height() ||  t[0].height
				
				var el = t.parent()
				
				while (el && !el.width()) {
					el = el.parent()
				}
				
				w = el ? el.width() : 800
				h = el ? el.height() : 600
				
				target.css("image-rendering","optimizeQuality").css("-ms-interpolation-mode","bicubic")
				if (blackBackground) target.parent().css("background-color","black")
				self.start()
			},
			
			
			
			start: function() { 
				repeat = 0
				computeSettings()
				computeValues()
				if (useCanvas) {
					if (!canvas) {
						canvas = $('<canvas width="'+w+'" height="'+h+'"></canvas>')[0]
						target.hide()
						target.after(canvas)
						canvas = canvas.getContext("2d");
	 					canvas.fillStyle = "rgb(255,255,255)";
					} 
				}
				
				$.pixelentity.ticker.bind("tick",worker)
			},
			
			stop: function() {
				$.pixelentity.ticker.unbind("tick",worker)
			},
			
			reset: function() {
				transform(target,canvas,tw,th,ratio,0,0)
			},
			
			pause: function() {
				paused = true
			},
			
			resume: function() {
				paused = false
			}
		
		});
		
		if (t.width() == 0 && t[0].width == 0) {
			t.one("load",self.init)
		} else {
			self.init()
		}
		
	}
		
	
	// jQuery plugin implementation
	$.fn.kenburns = function(conf) {
		
		// return existing instance
		var api = this.data("kenburns");
		if (api) { 
			api.start()
			return api; 
		}

		conf = $.extend(true, {}, $.pixelentity.kenburns.conf, conf);
		
		// install kb for each entry in jQuery object
		this.each(function() {
			api = new KenBurns($(this), conf); 
			$(this).data("kenburns", api); 
		});
		
		return conf.api ? api: this;		 
	};
		
})(jQuery);

		

