const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')

// SEARCH
app.get('/', (req, res) => {
  res.render('search', {
    pageTitle: 'Weather'
  })
})

app.listen(port)
