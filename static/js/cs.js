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

$(() => {
  $('.cs-toolbox').draggable({cursor: 'move'})

  $('#week').on('input', (event) => {
    let date = dayjs(event.target.value, 'YYYY-Www').subtract(3, 'day')

    $('day-block').each((_, dayBlock) => {
      $(dayBlock).prop('date', date.format('M/D/YY'))
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

  $('#decal')
    .on('change', (event) => {
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
})