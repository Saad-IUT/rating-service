const app = require('express')()
const jsonParser = require('body-parser').json()
// const cors = require('cors')()

const { addRating } = require('./ratings')

app.use(jsonParser)

// Rating routes
app.post('/rate', addRating)

//Testing
app.get('/', (req, res) => {
  res.send('OK')
})
let port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Running on port ${port}`)
})
