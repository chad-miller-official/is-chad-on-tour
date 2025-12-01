function randomPosition() {
  const randomSign = Math.round(Math.random() * 1) ? 1 : -1
  return Math.round(Math.random() * 100) * randomSign
}

$(() => {
  $('.ooa-image').each((_, image) => {
    const style = {
      width: `${Math.ceil(Math.random() * 25) + 7}%`,
      left: `${randomPosition()}%`,
      top: `${randomPosition()}%`,
    }

    $(image).draggable({cursor: 'move'}).css(style)
  })

  $('.ooa-abstract').draggable({
    containment: 'parent',
    cursor: 'move',
  })

  $('.ooa-link').draggable({
    containment: 'parent',
    cursor: 'move',
  })
})