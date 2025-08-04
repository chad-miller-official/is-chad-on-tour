const selectedPostClass = 'selected-post'

window.onload = () => {
  const postFrame = document.querySelector('#postFrame')
  const postAnchors = document.querySelectorAll('#postList a')

  postAnchors.forEach(a =>
    a.onclick = (event) => {
      event.preventDefault()
      postAnchors.forEach(notA => notA.classList.remove(selectedPostClass))
      postFrame.src = `/posts/${a.text}`
      postFrame.title = a.text
      a.classList.add(selectedPostClass)
    })
}
