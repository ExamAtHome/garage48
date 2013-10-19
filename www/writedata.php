<?php
$id = $_REQUEST['id'];
$data = $_REQUEST['data'];
$file = 'data/data'.$id.'.json';
file_put_contents($file, $data);
?>
