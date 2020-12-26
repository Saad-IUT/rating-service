const app = require('express')()
const jsonParser = require('body-parser').json()

const { addRating, getAllRatings } = require('./ratings')

app.use(jsonParser)

// Rating routes
app.post('/rate', addRating)
app.get('/rating/list', getAllRatings)

//Testing
app.get('/', (req, res) => {
  res.send('OK')
})
let port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Running on port ${port}`)
})
