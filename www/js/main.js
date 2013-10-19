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

  vm.onSelectCourse = function(obj)
  {
    console.log(ko.mapping.toJS(obj))
  }

  vm.selectedLessonId = ko.observable('');
  vm.onSelectLesson = function(obj)
  {
    vm.selectedLessonId(obj.id())
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
    var newBox = correct ? Math.max(vm.activeCard().box() - 1, 1) : 5
    adjustProgress(vm.cardsWeight() + newBox - vm.activeCard().box(), vm.cards().length)

    var element = $('.learning .card')
    element.addClass('flipper').addClass('flip')
    setTimeout(function()
    {
      vm.activeCardStatus(correct ? 'green' : 'red')
      element.html(vm.activeCard().rus())
      element.removeClass('flip')
      vm.activeCard().box(newBox)
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
  }

  /* testing */
  vm.testSize = ko.observable(5);

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

  vm.testStatus = ko.observable('')

  vm.testCards = ko.computed(function()
  {
    vm.testStatus('')

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

    ko.utils.arrayForEach(vm.testCards(), function(card)
    {
      var correct = (card.answer() == card.rus())
        , newBox = correct ? Math.max(card.box() - 1, 1) : 5
      card.status(correct ? 'green' : 'red')
      card.box(newBox)
    });
    saveData()
  }

  /* we start here */
  ko.applyBindings(vm)
  vm.onNextCard()
};
