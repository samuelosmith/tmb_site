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

	if ($("#contactForm").length == 0) return

	var contactForm = $("#contactForm")
	var layoutChanged = false
	var submitted = false
	
	var validateRegexps = {
		"email": /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
		"default": /.{4}/ 
    }
	
	/* contact form related code */
	function validate() {
		
		var isOk = true
		
		contactForm.find(".required").each(function () {
		
				var re = validateRegexps[this.name]
				var value = $(this).val()
				
				if (!re) re = validateRegexps['default']
		
				if (!re.test(value)) {
						$(this).addClass("error")
						isOk = false
				} else {
						$(this).removeClass("error")
				}
		})
		
		contactForm.find("#message span.error")[isOk ? "hide" : "show"]()
		
		return isOk
	}
	
	function layout(e) {
		if ($(e.currentTarget).val() == "quotation") {
			contactForm.find("#project").slideDown(500,"easeOutExpo")
		} else {
			contactForm.find("#project").slideUp(500,"easeOutExpo")
		}
	}
	
	function validateAndSend() {
		submitted = true
		contactForm.find("#message span.sent").remove()
		if (validate()) {
				$.post("php/contact.php", contactForm.serialize(), function(data) {
					contactForm.find("#message").append(data)
				});
		} 
		return false
	}
	
	function validateAfter() {
		if (submitted) return validate()
		return true;
	}
	
	
	
	contactForm
		.find("#project")
			.hide()
		.end()
		.find("input[name=contactType]")
			.bind("change",layout)
		.end()
		.find("input[name=contactType]:checked")
			.trigger("change")
		.end()
		.find("#submit")
			.click(validateAndSend)
		.end()
		.find("#message span.error")
			.hide()
		.end()
		.find("input[type='text'], textarea")
			.change(validateAfter)
		.end()
	
});