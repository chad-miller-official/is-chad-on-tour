const VERTICAL_DECALS = [
  'cogitoerospud.jpg',
  'happiness3.jpg',
  'happiness4.jpg',
  'happiness5.jpg',
  'happiness6.jpg',
  'happiness7.jpg',
  'improvements.jpg',
  'thepresent.jpg',
]

function setDayBlockProp(prop, value) {
  $('day-block').each((_, dayBlock) => $(dayBlock).prop(prop, value))
}

// Hack to prevent resizing corner decal from altering the width of the CS sheet
$(window).on('load', () => {
  const dayBlockWidth = `${$('day-block').width()}px`
  $('.cs-days').css('grid-template-columns', `${dayBlockWidth} auto ${dayBlockWidth}`)
})

$(() => {
  $('#toolbox').draggable({cursor: 'move'})

  $('#week').on('input', (event) => {
    let date = dayjs(event.target.value, 'YYYY-Www').subtract(3, 'day')

    $('day-block').each((_, dayBlock) => {
      $(dayBlock).prop('date', date)
      date = date.add(1, 'day')
    })
  })

  const cornerDecal = $('#cornerDecal')
    .draggable({cursor: 'move'})
    .resizable({
      aspectRatio: true,
      autoHide: true,
    })

  const verticalDecal = $('#verticalDecal')
    .draggable({cursor: 'move'})
    .resizable({
      aspectRatio: true,
      autoHide: true,
    })

  $('#decal').on('change', (event) => {
    cornerDecal.children('img').remove()
    const newDecal = event.target.value

    if (newDecal) {
      cornerDecal.append($('<img>').attr('src', `img/cs-sheet/${newDecal}`)).css('height', 'fit-content')
      verticalDecal.children('img').remove()

      if (VERTICAL_DECALS.includes(newDecal)) {
        verticalDecal.append($('<img>').attr('src', `img/cs-sheet/vert/${newDecal}`)).css('height', 'fit-content')
      }
    }
  })

  $('#tableStyle').on('change', (event) => setDayBlockProp('theme', event.target.value))

  $('#decalBottomRight').on('change', () => {
    $('.cs-day-thursday').css('grid-area', 'b1')
    $('.cs-day-friday').css('grid-area', 'b2')
    $('.cs-day-saturday').css('grid-area', 'b3')
    $('.cs-day-decal').css('grid-area', 'b4')
  })

  $('#decalTopRight').on('change', () => {
    $('.cs-day-decal').css('grid-area', 'b1')
    $('.cs-day-thursday').css('grid-area', 'b2')
    $('.cs-day-friday').css('grid-area', 'b3')
    $('.cs-day-saturday').css('grid-area', 'b4')
  })

  $('#dateFormat').on('change', (event) => setDayBlockProp('dateFormat', event.target.value))
  $('#uppercaseHeader').on('change', (event) => setDayBlockProp('uppercaseHeader', event.target.checked))
  $('#boldHeader').on('change', (event) => setDayBlockProp('boldHeader', event.target.checked))

  $('#grayscale').on('change', (event) => {
    setDayBlockProp('grayscale', event.target.checked)

    const filter = event.target.checked ? 'grayscale(100%)': 'none';

    cornerDecal.css('filter', filter)
    verticalDecal.css('filter', filter)
  })

  $('#dateOffset').on('input', (event) => setDayBlockProp('dateOffset', event.target.value))
})