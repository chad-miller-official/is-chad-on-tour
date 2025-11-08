$(() => {
  const container = $('#mysteryCdImages')
  
  container.infiniteScroll({
    path: '/mystery-cd/page/{{#}}',
    history: false,
    responseBody: 'json',
  })
  
  container.on('load.infiniteScroll', (_, data) => {
    data.map((image) => {
      const img = $('<img>').prop('src', image).addClass('mystery-cd-image')
      const anchor = $('<a>').prop('href', image).append(img)
      container.append(anchor)
    })
  })
})
