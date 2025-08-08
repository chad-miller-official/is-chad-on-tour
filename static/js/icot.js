const selectedPostClass = 'selected-post'

window.onload = () => {
  const postFrame = document.querySelector('#postFrame')
  const postAnchors = document.querySelectorAll('#postList a')

  const click = (anchor) => {
    postFrame.src = `posts/${anchor.text}`
    postFrame.title = anchor.text
    anchor.classList.add(selectedPostClass)
    window.location.hash = `#${anchor.text}`
  }

  const postId = decodeURI(window.location.hash)

  postAnchors.forEach(a => {
    if (`#${a.text}` === postId) {
      click(a)
    }

    a.onclick = (event) => {
      event.preventDefault()
      postAnchors.forEach(notA => notA.classList.remove(selectedPostClass))
      click(a)
    }
  })
}
