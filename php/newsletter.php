<?php

// CUSTOMIZATION START

$subscribe = "youremailaddress@domain.com";  // insert your subscribe email address here

// CUSTOMIZATION END

if (count($_POST) == 0) die("");


$from = $_POST["email"];


$to = $subscribe;
$subject = "subscribed to the newsletter"; //subscribe email subject line & content
echo "subscribed"; //message appearing in form

$header = "From: $from\n";
mail($to, $subject,$subject, $header,"-f$from");

?>