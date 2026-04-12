const express = require('express')
const fs = require('fs')
const RSS = require('rss')
const showdown = require('showdown')

const app = express()
const port = 3000

const converter = new showdown.Converter()

const postsDir = './posts'
const postOrderFile = `${postsDir}/order.txt`
const previewLength = 100

const csDecalDir = 'static/img/cs-sheet/decal'

function getSortedPosts() {
  const order = fs.readFileSync(postOrderFile)

  return order
    .toString()
    .split("\n")
    .filter(post => post && post !== '')
    .map(post => `${post}.md`)
    .reverse()
}

app.set('view engine', 'pug')

app.get('/', async (req, res) => {
  const posts = getSortedPosts().map(post => post.replace(/[.]md$/, ''))
  res.render('index', {posts})
})

app.get('/posts/:post', (req, res) => {
  const post = fs.readFileSync(`${postsDir}/${req.params.post}.md`)
  res.send(converter.makeHtml(post.toString()))
})

const PAGE_SIZE = 9

function getImagePaths(page, limit) {
  return Array.from({length: limit}, (_, i) => {
    const imageNumber = i + 1 + (limit * (page - 1))

    if (imageNumber > 82) {
      return null
    } else {
      const paddedImageNumber = imageNumber < 10 ? `0${imageNumber}` : imageNumber
      return `/img/mystery-cd/L5P_05_NTao 0${paddedImageNumber}.jpg`
    }
  }).filter(imagePath => imagePath !== null)
}

app.get('/mystery-cd', (req, res) => {
  const imagePaths = getImagePaths(1, PAGE_SIZE)
  res.render('mystery-cd', {imagePaths})
})

app.get('/mystery-cd/page/:page', (req, res) => {
  const imagePaths = getImagePaths(req.params.page, PAGE_SIZE)

  if (imagePaths.length === 0) {
    res.sendStatus(204)
  } else {
    res.send(imagePaths)
  }
})

function getCsSheetDecals() {
  return fs.readdirSync(csDecalDir).filter(name => name !== 'vert')
}

app.get('/cs-sheet', (req, res) => {
  const decals = getCsSheetDecals()
  res.render('cs-sheet', {decals})
})

app.get('/2025-shows', (req, res) => res.render('2025-shows'))

app.get('/rss.xml', (req, res) => {
  const feed = new RSS({
    title: 'IsChadOnTour.com',
    description: 'Chad Miller Official, Online',
    feed_url: 'https://www.ischadontour.com/rss.xml',
    site_url: 'https://www.ischadontour.com/',
  })

  const buffer = Buffer.alloc(previewLength)

  getSortedPosts()
    .slice(0, 10)
    .forEach(post => {
      const bytesRead = fs.readSync(
        fs.openSync(`${postsDir}/${post}`, 'r'),
        buffer,
        0,
        previewLength,
        0
      )

      let description = buffer.slice(0, bytesRead).toString()

      if (description.length > previewLength - 3) {
        description = `${description.substring(0, 97)}...`
      }

      const fileName = post.replace(/[.]md$/, '')

      feed.item({
        title: fileName,
        description,
        url: `https://ischadontour.com/#${fileName}`,
      })
    })

  res.set('Content-Type', 'text/xml')
  res.send(feed.xml({indent: true}))
})

app.use(express.static('static'))

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
