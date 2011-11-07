<?php
/**
 * jscsscomp - JavaScript and CSS files compressor 
 * Copyright (C) 2007 Maxim Martynyuk
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301,
 * USA.
 * 
 * @author Maxim Martynyuk <flashkot@mail.ru>
 * @version $Id$
 */

//error_reporting(E_ALL);
//ini_set('display_errors', true);

define('CACHE_DIR' , 'cache/');
define('FILES_ENCODING' , 'UTF-8');

// Disable zlib compression, if present, for duration of this script.  
// So we don't double gzip 
ini_set("zlib.output_compression", "Off");

// Set the cache control header
// http 1.1 browsers MUST revalidate -- always
header("Cache-Control: must-revalidate");
header('Vary: Accept-Encoding');

// this is filetypes counters. used to send correct content-type header
$js_files = 0;
$css_files = 0;


if (!function_exists('apache_request_headers')) {
    eval('
        function apache_request_headers() {
            foreach($_SERVER as $key=>$value) {
                if (substr($key,0,5)=="HTTP_") {
                    $key=str_replace(" ","-",ucwords(strtolower(str_replace("_"," ",substr($key,5)))));
                    $out[$key]=$value;
                }
            }
            return $out;
        }
    ');
} 

// get pack
$pack = $_GET['q'];


if(!preg_match('/\.(js|css)$/iD',$pack, $matches)){
	header("HTTP/1.0 404 Not Found");
	die();
}

$type = $matches[1];

$files = @file("$pack.files");

if (count($files) == 0) die();

$lmt = 0;
$longFilename = ''; // This is generated for the Hash

foreach($files as $id => $file){
	$file = $files[$id] = "../".rtrim(trim("$file"));
	if(!empty($file)){
		$fileLmt = @filemtime($file);
		if($fileLmt > $lmt){
			$lmt = $fileLmt;
		}
	}else{
		unset($files[$id]);
	}
}


$lmt_str = gmdate('D, d M Y H:i:s', $lmt) . ' GMT';


//print_r($files);

/////////////////////////////////////////////////////////////////////////////
// Begin *BROWSER* Cache Control

// Here we check to see if the browser is doing a cache check
// First we'll do an etag check which is to see if we've already stored
// the hash of the filename . '-' . $newestFile.  If we find it
// nothing has changed so let the browser know and then die.  If we
// don't find it (or it's a mismatch) something has changed so force
// the browser to ignore the cache.

$hash = "$pack-$lmt";     // This appends the newest file date to the key.
$headers = apache_request_headers();       // Get all the headers the browser sent us.

if (preg_match("/$hash/i", $headers['If-None-Match'])) {// Look for a hash match
	// Our hash+filetime was matched with the browser etag value so nothing
	// has changed.  Just send the last modified date and a 304 (nothing changed) 
	// header and exit.
	header('Last-Modified: '.$lmt_str.' GMT', true, 304);
	exit;
}

// We're still alive so save the hash+latest modified time in the e-tag.
header("ETag: \"{$hash}\"");

// For an additional layer of protection we'll see if the browser
// sent us a last-modified date and compare that with $newestFile
// If there's no change we'll send a cache control header and die.

if (isset($headers['If-Modified-Since'])) {
   if ($newestFile <= strtotime($headers['If-Modified-Since'])) {
      // No change so send a 304 header and terminate
       header('Last-Modified: '.$lmt_str.' GMT', true, 304);
       exit;
    }
}

// Set the last modified date as the date of the NEWEST file in the list.
header('Last-Modified: '.$lmt_str.' GMT');

	

// End *BROWSER* Cache Control
/////////////////////////////////////////////////////////////////////////////


header('Content-type: ' . ($type == "js" ? 'text/javascript; charset: ' : 'text/css; charset: '   ) . FILES_ENCODING );

$compress_file = false;

if(!isset($_SERVER['HTTP_ACCEPT_ENCODING']) or strrpos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') === false){
	$compress_file = false;
}else{
	$compress_file = true;
	$enc = in_array('x-gzip', explode(',', strtolower(str_replace(' ', '', $_SERVER['HTTP_ACCEPT_ENCODING'])))) ? "x-gzip" : "gzip";
}

if(!$compress_file){
	if($type == 'css'){
		echo compose_file($files);
		exit;
	}else{
		$cache_file = CACHE_DIR . '/' . $hash;

		if(is_file($cache_file) and is_readable($cache_file)){
			echo file_get_contents($cache_file);
			exit;
		}
		
		$cacheData = compose_file($files);
		
		$fp = @fopen($cache_file, "wb");
		if ($fp) {
			fwrite($fp, $cacheData);
			fclose($fp);
		}
		echo $cacheData;
		exit;
	}	
}else{
	$cache_file = CACHE_DIR . '/' . $hash . '.gz';

	if(is_file($cache_file) and is_readable($cache_file)){
		header("Content-Encoding: " . $enc);
		echo file_get_contents($cache_file);
		exit;
	}
	
	$content = compose_file($files);
	
	$cacheData = gzencode($content, 9, FORCE_GZIP);
	
	$fp = @fopen($cache_file, "wb");
	if ($fp) {
		fwrite($fp, $cacheData);
		fclose($fp);
	}
	
	header("Content-Encoding: " . $enc);
	echo $cacheData;
	exit;	
}


function compose_file($files){

	$content = '';
	foreach($files as $file){
		$content .= file_get_contents($file) . "\n\n";
	}
	return $content;
}
