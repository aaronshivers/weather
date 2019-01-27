require('dotenv').config()

const express = require('express')
const request = require('request')

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')

const { GEOCODE_API_KEY, DARKSKY_API_KEY } = process.env

// SEARCH
app.get('/', (req, res) => {
  res.render('search', {
    pageTitle: 'Weather'
  })
})

// Results - display search results
app.get('/results', (req, res) => {

  const geocodeAddress = (address, callback) => {
    const addressEncoded = (encodeURIComponent(address))

    request({
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${addressEncoded}&key=${GEOCODE_API_KEY}`,
      json: true
    }, (error, response, body) => {
      if (error) {
        callback('Unable to connect to Google servers.')
      } else if (body.status === 'ZERO_RESULTS') {
        callback('Unable to find that address.')
      } else if (body.status === 'OK') {
        callback(undefined, {
          address: body.results[0].formatted_address,
          latitude: body.results[0].geometry.location.lat,
          longitude: body.results[0].geometry.location.lng
        })
      }
    })
  }

  const getWeather = (latitude, longitude, callback) => {

    request({
      url: `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${latitude},${longitude}`,
      json: true
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        callback(undefined, {
          temperature:         Math.round(body.currently.temperature),
          feelsLike:           Math.round(body.currently.apparentTemperature),
          temperatureHigh:     Math.round(body.daily.data[0].temperatureHigh),
          temperatureLow:      Math.round(body.daily.data[0].temperatureLow),
          temperatureHighTime: body.daily.data[0].temperatureHighTime,
          currently:           body.currently.summary,
          today:               body.daily.data[0].summary,
          tomorrow:            body.daily.data[1].summary,
          forecast:            body.daily.summary
        })
      } else {
        callback('Unable to fetch weather.')
      }
    })
  }

  geocodeAddress(req.query.search, (error, results) => {
    if (error) {
      console.log(error)
    } else {
      console.log(results.address)
      getWeather(results.latitude, results.longitude, (error, weatherResults) => {
        if (error) {
          console.log(error)
        } else {
          const data = (weatherResults)
          const location = (results.address)
          res.render('results', { pageTitle: `Weather for ${location}`, data, location })
        }
      })
    }
  })
})


app.listen(port)
