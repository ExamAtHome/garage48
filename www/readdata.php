<?php
$id = $_REQUEST['id'];

$file = 'data/data'.$id.'.json';

if (file_exists($file)) {
    header('Content-Type: text/javascript; charset=utf8');
    header('Access-Control-Allow-Origin: http://www.example.com/');
    header('Access-Control-Max-Age: 3628800');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    echo file_get_contents($file);
}
?>
