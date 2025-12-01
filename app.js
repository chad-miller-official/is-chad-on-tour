const axios = require('axios')
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

const csDecalDir = 'static/img/cs-sheet'

const localeDateStringOpts = {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
}

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
  const today = new Date()

  const tomorrow = new Date(today)
  tomorrow.setHours(23, 59, 59)

  const eventsUrl = `https://www.googleapis.com/calendar/v3/calendars/${process.env.CALENDAR_ID}/events`

  const params = {
    key: process.env.API_KEY,
    timeMin: today.toISOString(),
    timeMax: tomorrow.toISOString(),
  }

  const axiosRes = await axios.get(eventsUrl, {params})

  const tourItem = axiosRes.data.items.find(
      item => item.summary.toLowerCase().includes('tour'))

  let title, message, verdict

  if (tourItem) {
    const returnDate = new Date(tourItem.end.date)
    returnDate.setDate(returnDate.getDate() + 1)

    title = 'Chad is currently on tour.'
    message = `Chad is on tour and will be back home on ${returnDate.toLocaleDateString(
        'en-US', localeDateStringOpts)}.`

    verdict = 'Yes'
  } else {
    const nextParams = {
      key: process.env.API_KEY,
      timeMin: today.toISOString(),
      orderBy: 'startTime',
      singleEvents: true,
    }

    title = 'Chad is not on tour.'
    message = 'Chad is not on tour'
    verdict = 'No'

    const axiosResNext = await axios.get(eventsUrl, {params: nextParams})

    const nextItem = axiosResNext.data.items.find(
        item => item.summary.toLowerCase().includes('tour'))

    if (nextItem) {
      const startDate = new Date(nextItem.start.date)
      startDate.setDate(startDate.getDate() + 1)

      message += `, but will be on ${startDate.toLocaleDateString('en-US',
          localeDateStringOpts)}`
    }

    message += '.'
  }

  const posts = getSortedPosts().map(post => post.replace(/[.]md$/, ''))
  res.render('index', {title, message, verdict, posts})
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

app.get('/office-outsider-art', (req, res) => {
  const decals = getCsSheetDecals()
  res.render('cs-index', {decals})
})

app.get('/cs-sheet', (req, res) => {
  const decals = getCsSheetDecals()
  res.render('cs-sheet', {decals})
})

app.get('/rss.xml', (req, res) => {
  const feed = new RSS({
    title: 'IsChadOnTour.com',
    description: 'Chad Miller Official, Online',
    feed_url: 'https://www.ischadontour.com/rss.xml',
    site_url: 'https://www.ischadontour.com/',
  })

  const streamOpts = {
    encoding: 'utf8',
    start: 0,
    end: 99,
  }

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
