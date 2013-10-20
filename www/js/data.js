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
   var element = $('#chart');
   if(element.length > 0  && element.css("display") != 'none'){
    draw = function(data){
      var arrayData = [['Attempt', 'Percent']];
      for(var i=0;i<data.length;i++){
          arrayData.push([i, Math.round(data[i]*10)/10]);
      }
        var options = {
          title: 'Studying progress',
          width: 850,
          height:500,
          lineWidth: 4,
          legend: 'none',
          chartArea:{
            width: 700,
            height:400,
          },
          hAxis :{
            'title': 'time'
          },
          vAxis: {
            'maxValue': 100,
            'minValue': 0,
            'title': 'percent'
          }
        };
        var chartData = google.visualization.arrayToDataTable(arrayData);
        var chart = new google.visualization.LineChart(element[0]);
        chart.draw(chartData, options);
    }
    if(data) draw(data);
    else readdata('chart', draw)
  }
}


adjustProgress = function(newWeight, cardCount){
  readdata('chart', function(data){
    if(data && data.length > 0){
      data[data.length] = 125 - 25*newWeight/cardCount;
    }else{
      data = [125 - 25*newWeight/cardCount];
    }
    drawChart($('#chart'), data);
    writedata('chart',data);
  });
}
