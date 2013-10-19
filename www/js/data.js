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

google.load("visualization", "1", {packages:["corechart"]});

drawChart = function(element, data) {
   if(!element) element = $('#chart')
   draw = function(data){
     var arrayData = [['Attempt', 'Percent']];
     for(var i=0;i<data.length;i++){
        arrayData.push([i, Math.round(data[i])]);
     }
      var options = {
        title: 'Studying progress',
        chartArea: {
           width: 400,
           height: 200,
           }
      };
      var chartData = google.visualization.arrayToDataTable(arrayData);
      var chart = new google.visualization.LineChart(element[0]);
      chart.draw(chartData, options);
   }
   if(data) draw(data);
   else readdata('chart', draw)

}


adjustProgress = function(newWeight, cardCount){
  readdata('chart', function(data){
    if(data && data.length > 0){
      data[data.length] = 125 - 25*newWeight/cardCount;
    }else{
      data = [125 - 25*newWeight/cardCount];
    }
    if($('#chart').length > 0  && $('#chart').css("display") != 'none'){
      drawChart($('#chart'), data);
    }
    writedata('chart',data);
  });
}
