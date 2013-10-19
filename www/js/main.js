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
          rus: 'кошка',
          lesson: 'lesson_1',
        },
        {
          box: 5,
          id: 'card_2',
          eng: 'dog',
          rus: 'собака',
          lesson: 'lesson_1',
        },
        {
          box: 5,
          id: 'card_3',
          eng: 'horse',
          rus: 'лошадь',
          lesson: 'lesson_1',
        },
        {
          box: 5,
          id: 'card_4',
          eng: 'lizard',
          rus: 'ящерица',
          lesson: 'lesson_1',
        },
        {
          box: 5,
          id: 'card_5',
          eng: 'frog',
          rus: 'лягушка',
          lesson: 'lesson_1',
        },
        {
          box: 5,
          id: 'card_6',
          eng: 'elephant',
          rus: 'слон',
          lesson: 'lesson_1',
        },
        {
          box: 5,
          id: 'card_7',
          eng: 'bear',
          rus: 'медведь',
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

  vm.activeCard = ko.observable(vm.cards()[0])
  vm.currentCards = ko.computed(function()
  {
    return ko.utils.arrayFilter(vm.cards(), function(card)
    {
      console.log(card.lesson(), vm.selectedLessonId())
      return card.lesson() == vm.selectedLessonId()
    })
  })

  ko.applyBindings(vm)
