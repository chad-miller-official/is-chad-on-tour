$(() => {
  $('.cs-toolbox').draggable()

  $('#week').on('input', (event) => {
    let date = dayjs(event.target.value, 'YYYY-Www').subtract(3, 'day')

    $('day-block').each((_, dayBlock) => {
      $(dayBlock).prop('date', date.format('M/D/YY'))
      date = date.add(1, 'day')
    })
  })

  const cornerDecal = $('#cornerDecal')
    .draggable()
    .resizable({
      aspectRatio: true,
      autoHide: true,
    })

  $('#decal')
    .on('change', (event) => {
      cornerDecal.children('img').remove()

      if (event.target.value) {
        cornerDecal.append(
          $('<img>').attr('src', `img/cs-sheet/${event.target.value}`)
        )
      }
    })
})