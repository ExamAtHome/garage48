$(function()
{
  readdata('main', init);
  drawChart();
});

saveData = function()
{
  //console.log(ko.mapping.toJS(vm))
  writedata('main', ko.mapping.toJS(vm))
}

init = function(data)
{
  vm = ko.mapping.fromJS(data, {})
  vm.selectedCourseName = ko.observable('');
  vm.onSelectCourse = function(obj)
  {
    vm.selectedCourseName(obj.name());
    console.log(ko.mapping.toJS(obj))
    vm.onCourseMode();
  }

  vm.selectedLessonId = ko.observable('');
  vm.selectedLessonName = ko.observable('');
  vm.selectedLessonDesc = ko.observable('');
  vm.onSelectLesson = function(obj)
  {
    console.log(ko.mapping.toJS(obj))
    vm.selectedLessonId(obj.id())
    vm.selectedLessonName(obj.name())
    vm.selectedLessonDesc(obj.desc())
    vm.onLessonMode();
  }

  vm.currentCards = ko.computed(function()
  {
    return ko.utils.arrayFilter(vm.cards(), function(card)
    {
      return card.lesson() == vm.selectedLessonId()
    })
  })

  vm.activeCard = ko.observable(vm.cards()[0])
  vm.activeCardStatus = ko.observable('')
  vm.answer = ko.observable('')

  vm.onCheckAnswer = function(obj)
  {

    var answer = vm.answer().replace(/\s/, '')
    var correct = (answer == vm.activeCard().rus())
    var oldBox = vm.activeCard().box()
    var newBox = correct ? Math.max(vm.activeCard().box() - 1, 1) : 5
    adjustProgress(vm.cardsWeight() + newBox - vm.activeCard().box(), vm.cards().length)

    var boxes = $('.box-wrapper')
    var from = $(boxes[5 - oldBox]).position().left + 50
    var to = $(boxes[5 - newBox]).position().left + 50
    console.log(from, to)

    var animated = $('#animated')
    var image = newBox > oldBox ? 'red' : 'green'
    $('img', animated).attr('src', './img/' + image + '.png');
    animated.css('left', from)
      .show()
      .animate({left: to},
      {
        duration: 500 * Math.abs(oldBox - newBox),
        done: function()
        {
          animated.hide()
        }
      })

    var element = $('.learning .card')
    element.addClass('flipper').addClass('flip')

    setTimeout(function()
    {
      vm.activeCardStatus(correct ? 'green' : 'red')
      element.html('<p>' + vm.activeCard().rus() + '</p>')
      element.removeClass('flip')
      element.css('background-image', 'url(./picts/' + vm.activeCard().eng() + '.jpg)')
      vm.activeCard().box(newBox)
      $('.selected').removeClass('.selected')
      saveData()
    }, 500)
  }

  vm.cardsWeight = ko.computed(function()
  {
    var total = 0;
    ko.utils.arrayForEach(vm.cards(), function(card) {
      total += card.box()
    });
    return total;
  }).extend({throttle: 1});

  vm.onNextCard = function(obj)
  {
    var total = 0
      , random = Math.random() * (vm.cardsWeight() - 1)
      , card = ko.utils.arrayFirst(vm.cards(), function(card)
      {
        total += card.box()
        return total >= random
      });

    vm.activeCard(card)
    vm.activeCardStatus('')
    vm.answer('')
  }

  /* testing */
  vm.testSize = ko.observable(10);

  vm.cardsIds = ko.computed(function()
  {
    var ids = [];
    ko.utils.arrayForEach(vm.cards(), function(card) {
      ids.push(card.id())
    });
    return ids;
  }).extend({throttle: 1});

  //+ Jonas Raoni Soares Silva
  //@ http://jsfromhell.com/array/shuffle [v1.0]
  function shuffle(o){ //v1.0
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  };

  vm.onAddCourseToChild = function()
  {
    ko.utils.arrayForEach(vm.children(), function(child) {
      console.log(child);
      if(child.name()=='Alice'){
        ko.utils.arrayForEach(vm.courses(), function(course) {
          if(course.id()=='course_1')
            child.courses.push(course)
        })
      }
    });
  }

  vm.variantCards = ko.computed(function()
  {
    var testIds = shuffle(vm.cardsIds())
    var test = ko.utils.arrayFilter(vm.cards(), function(card) {
      return testIds.indexOf(card.id()) < 3
    })
    test.push(vm.activeCard())
    return shuffle(test)
  });

  vm.testStatus = ko.observable('')
  vm.testResult = ko.observable(0)

  vm.touchTest = ko.observable('')
  vm.testCards = ko.computed(function()
  {
    //var test = vm.touchTest()

    vm.testStatus('')
    vm.testResult(0)

    var testIds = shuffle(vm.cardsIds());
    var test = ko.utils.arrayFilter(vm.cards(), function(card) {
      return testIds.indexOf(card.id()) < vm.testSize()
    });
    var i = 0, l = test.length;
    for(; i < l; i++)
    {
      test[i].answer = ko.observable('')
      test[i].status = ko.observable('')
    }
    return test
  }).extend({throttle: 1});

  vm.onCheckTest = function()
  {
    vm.testStatus('checked')

    var counter=0
    var success=0
    var cards = vm.testCards()
    ko.utils.arrayForEach(cards, function(card)
    {
      var correct = (card.answer() == card.rus())
        , newBox = correct ? Math.max(card.box() - 1, 1) : 5
      counter++
      success+=(correct ? 1 : 0)
      card.status(correct ? 'green' : 'red')
      card.box(newBox)
    });
    saveData()
    if(counter > 0)
      vm.testResult(Math.round(100*success/counter))
  }

  vm.onFillTest = function()
  {
    ko.utils.arrayForEach(vm.testCards(), function(card)
    {
      if(card.answer()=='') card.answer(card.rus())
    })
    saveData()
  }

  vm.onSelectAnswer = function(obj)
  {
    vm.answer(obj.rus());
    vm.onCheckAnswer();
  }

  vm.mode = ko.observable('index')

  vm.onEnglishMode = function()
  {
    vm.mode('english')
  }

  vm.onChildMode = function()
  {
    vm.mode('child')
  }

  vm.onTrainMode = function()
  {
    vm.mode('train')
  }

  vm.onProgressMode = function()
  {
    vm.mode('progress')
  }

  vm.onCourseMode = function()
  {
    vm.mode('course')
  }

  vm.onLessonMode = function()
  {
    vm.mode('lesson')
  }

  vm.onTestMode = function()
  {
    vm.touchTest(new Date())
    vm.mode('test')
  }

  vm.onContactMode = function()
  {
    vm.mode('contact')
  }

  vm.onAboutMode = function()
  {
    vm.mode('about')
  }

  vm.onIndexMode = function()
  {
    vm.mode('index')
  }

  vm.boxes = ko.mapping.fromJS([{ box: 5}, { box: 4}, { box: 3}, { box: 2}, { box: 1}])

  /* we start here */
  ko.applyBindings(vm)
  vm.onEnglishMode()
  vm.onNextCard()
};
