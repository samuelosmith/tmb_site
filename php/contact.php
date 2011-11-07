<?php

// CUSTOMIZATION START

$to = "youremailaddress@domain.com";  // insert your contact email address here
$subject = "Brandspace - Contact Form Message";  // this will be the subject line 

// CUSTOMIZATION END

if (count($_POST) == 0) die("");

$from = $to;
$email_text = "";

foreach($_POST as $key => $value){
	if ($value != "") {
		if ($key == "email") {
			$from = $value;
		}
		$email_text.="<br><b>".ucfirst(str_replace("_", " ",$key))."</b> - ".nl2br(stripcslashes($value));
	}
}

$header = "From: $from\n" . "MIME-Version: 1.0\n" . "Content-type: text/html; charset=utf-8\n";
if(mail($to, $subject, $email_text, $header,"-f$from")){
	
	//Message displayed to user on success
	echo '<span class="sent">Message has been sent successfully.</span>';
}else{
	//Message displayed to user on failure
	echo '<span class="sent error">Oops! An error has occurred - Please see marked fields above.</span>';
}

?>