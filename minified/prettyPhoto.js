jQuery(function(e){function f(m){var n=e(m.target);var g=n.width();var l=n.height();var j="prettyPhotoHilight";var i=n.parent().attr("href");if(i&&(i.match(/http:\/\/www.youtube.com\/watch\?v=(\w+)/)||i.match(/http:\/\/vimeo.com\/(\w+)/))){j="prettyPhotoVideoHilight"}var k=e('<div class="'+j+'"></div>').bind("mouseleave",a).bind("click",d);k.data("target",n);k.width(g).height(l);e("body").append(k);k.fadeOut(0).fadeTo(200,0.5).offset(n.offset())}function a(h){var g=e(h.target);g.animate({custom:1},{duration:200,easing:"easeOutCubic",complete:function(){g.remove()},step:function(i,j){g.css("opacity",(1-i)/2)}})}function d(g){e(g.target).data("target").parent().trigger("click");e(g.target).trigger("mouseleave")}function b(i,l,k,h){var j=(1<<24)|(parseInt(l)<<16)|(parseInt(k)<<8)|parseInt(h);return parseInt("0x"+j.toString(16).substr(1))}var c=e("body").css("background-color").replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g,b);e("a[rel^='prettyPhoto']").find("> img").bind("mouseenter",f).end().prettyPhoto({theme:c<8421504?"facebook":"facebook"})});