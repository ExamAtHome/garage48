readdata = function(id, onData){
  jQuery.get('readdata.php',{id:id}, onData);
}

savedata = function(id, data){
  jQuery.post('savedata.php',{id:id, data:data}, onData);
}
