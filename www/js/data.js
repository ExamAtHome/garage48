readdata = function(id, onData){
  $.ajax({
    dataType: "json",
    url: 'readdata.php',
    data: {id:id},
    success: onData
  });
};

writedata = function(id, data){
  if(typeof data !== 'string'){
    data = JSON.stringify(data);
  }
  jQuery.post('writedata.php',{id:id, data:data});
}
