require('dotenv').config()

const express = require('express')
const rp = require('request-promise-native')

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

  const geocodeAddress = async (address) => {

    try {
      const addressEncoded = (encodeURIComponent(address))
      const options = {
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${addressEncoded}&key=${GEOCODE_API_KEY}`,
        json: true
      }
      const res = await rp(options)
      return location = {
        address: res.results[0].formatted_address,
        latitude: res.results[0].geometry.location.lat,
        longitude: res.results[0].geometry.location.lng
      }
    } catch (error) {
      console.error('error: ', error)
    }
  }

  const getWeather = async (latitude, longitude) => {

    try {
      const options = {
        url: `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${latitude},${longitude}`,
        json: true
      }
      const res = await rp(options)
      return weather = {
        temperature:         Math.round(res.currently.temperature),
        feelsLike:           Math.round(res.currently.apparentTemperature),
        temperatureHigh:     Math.round(res.daily.data[0].temperatureHigh),
        temperatureLow:      Math.round(res.daily.data[0].temperatureLow),
        temperatureHighTime: res.daily.data[0].temperatureHighTime,
        currently:           res.currently.summary,
        today:               res.daily.data[0].summary,
        tomorrow:            res.daily.data[1].summary,
        forecast:            res.daily.summary
      }
    } catch (error) {
      console.error(error)
    }
  }

  geocodeAddress(req.query.search).then((location) => {
    const address = (location.address) 
    getWeather(location.latitude, location.longitude).then((weatherResults) => {
      const data = (weatherResults)
      res.render('results', { pageTitle: `Weather for ${address}`, data, address })
    })
  }).catch(err => console.log(err))
})


app.listen(port)
