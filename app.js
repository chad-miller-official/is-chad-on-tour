const axios = require('axios')
const express = require('express')

const app = express()
const port = 3000

app.set('view engine', 'pug')
app.use(express.static('styles'))

app.get('/', async (req, res) => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const eventsUrl = `https://www.googleapis.com/calendar/v3/calendars/${process.env.CALENDAR_ID}/events`

  const params = {
    key: process.env.API_KEY,
    timeMin: today.toISOString(),
    timeMax: tomorrow.toISOString(),
  }

  const axiosRes = await axios.get(eventsUrl, {params})

  const tourItem = axiosRes.data.items.find(
      item => item.summary.toLowerCase().includes('tour'))

  let title
  let message
  let verdict

  const localeDateStringOpts = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }

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

  res.render('index', {title, message, verdict})
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
