  var data =
    {
      courses:
      [
        {
          id: 'course_1',
          name: 'Course. Home'
        },
      ],
      lessons:
      [
        {
          id: 'lesson_1',
          name: 'Lesson1. Pets #1'
        },
        {
          id: 'lesson_2',
          name: 'Lesson2. NoPets #2'
        },
        {
          id: 'lesson_3',
          name: 'Lesson3. NoPets #3'
        },
      ],
      cards:
      [
        {
          box: 5,
          id: 'card_1',
          eng: 'cat',
          rus: '�����',
          lesson: 'lesson_1',
        },
        {
          box: 5,
          id: 'card_2',
          eng: 'dog',
          rus: '������',
          lesson: 'lesson_1',
        },
        {
          box: 5,
          id: 'card_3',
          eng: 'horse',
          rus: '������',
          lesson: 'lesson_1',
        },
        {
          box: 5,
          id: 'card_4',
          eng: 'lizard',
          rus: '�������',
          lesson: 'lesson_1',
        },
        {
          box: 5,
          id: 'card_5',
          eng: 'frog',
          rus: '�������',
          lesson: 'lesson_1',
        },
        {
          box: 5,
          id: 'card_6',
          eng: 'elephant',
          rus: '����',
          lesson: 'lesson_1',
        },
        {
          box: 5,
          id: 'card_7',
          eng: 'bear',
          rus: '�������',
          lesson: 'lesson_1',
        },
      ]
    }

    , i = 0
    , l = 0
    , post

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
  }


  ko.applyBindings(vm)
