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

	var validateRegexps = {
		email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "default": /.{4}/ 
    }

	if ($("#newsletter form").length == 0) return
	
	var defaultMessage = $("#newsletter").attr("data-default")
	var subscribedMessage = $("#newsletter").attr("data-subscribed")
	var newsletterForm = $("#newsletter form")
	
	 /* newsletter code */
	function newsletter(send) {
			//var subscribe = newsletterForm.find('input:checked').length == 0
			var subscribe = true
			newsletterForm.find('input[type="submit"]').val(subscribe ? "Sign Up" : "Unsubscribe")
			
			var email = newsletterForm.find('input[name="email"]')
			var check = true
			
			if (email.val() == defaultMessage || email.val() == subscribedMessage) {
				email.val("")
				if (!send) check = false
			} 
			
			if (check) {
				if(validateRegexps["email"].test(email.val())) {
						// valid mail
						email.removeClass("error")
						if (send) {
								$.post("php/newsletter.php", newsletterForm.serialize(), function(data) {
										email.val(subscribedMessage)
								});
								email.val("sending")
						}
						
				} else {
						// invalid mail
						email.addClass("error")
				}
			}
			
			
			return false
	}
	
	function restore(e) {
		var jqEl = $(e.currentTarget) 
		if (jqEl.val() == "") {
			jqEl.val(defaultMessage)
		}
		return true
	}
	
	function signUp() {
			return newsletter(false)
	}
	
	function signUpAndSend() {
			return newsletter(true)
	}
	
	newsletterForm.find('input[name="email"]').focus(signUp).focusout(restore)
	newsletterForm.change(signUp)
    newsletterForm.submit(signUpAndSend)
	
});