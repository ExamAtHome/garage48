$(function()
{
  readdata('main', init);
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
    vm.activeCardStatus(correct ? 'green' : 'red')
    vm.activeCard().box(correct ? Math.max(vm.activeCard().box() - 1, 1) : 5)
    saveData()
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

  ko.applyBindings(vm)
  vm.onNextCard()
};
