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

drawChart=function(element){
   readdata('chart', function(data){
     element.sparkline(data, { width:400, height:200, lineWidth: 3, normalRangeMin:70, normalRangeMax:100, normalRangeColor: "lightGreen", fillColor: false, highlightLineColor: null});
   });
}

adjustProgress = function(newWeight, cardCount){
  readdata('chart', function(data){
    if(data && data.length > 0){
      data[data.length] = 125 - 25*newWeight/cardCount;
    }else{
      data = [125 - 25*newWeight/cardCount];
    }
    writedata('chart',data);
  });
  if($('#chart').length > 0  && $('#chart').css("display") != 'none'){
    drawChart($('#chart'));
  }
}
