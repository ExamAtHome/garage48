flip = function(element, data){
     element.addClass('flipper').addClass('flip');
     setTimeout(function(){element.html(data);
                              element.removeClass('flip');},500);
};
