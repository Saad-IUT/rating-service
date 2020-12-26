const { db } = require('./admin')
const axios = require('axios')

// Add Rating
exports.addRating = async (req, res) => {
  let count = await db
    .collection('ratings')
    .get()
    .then(snapshot => {
      return snapshot.size
    })
  const ratingRef = db.collection('ratings')
  const rating = req.body
  const newRating = {
    productId: rating.productId,
    rating: rating.rating,
    raterId: rating.raterId,
  }
  ratingRef
    .where('raterId', '==', rating.raterId)
    .where('productId', '==', rating.productId)
    .limit(1)
    .get()
    .then(data => {
      if (data.empty) {
        ratingRef
          .add(newRating)
          .then(() => {
            res.status(201).json({ message: 'Rating added successfully' })
            count++
            console.log(count)
            if (count % 5 == 0 && count > 0) getLatestRatings()
          })
          .catch(err => {
            console.error(err)
            res.status(500).json({ error: err.code })
          })
      } else {
        data.forEach(doc => {
          const id = doc.id
          db.doc(`/ratings/${id}`)
            .update({ rating: rating.rating })
            .then(() => {
              console.log(count)
              return res.json({ message: 'Rating updated successfully' })
            })
            .catch(err => {
              console.error(err)
              return res.status(500).json({ error: err.code })
            })
        })
      }
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

// Get all ratings
exports.getAllRatings = (req, res) => {
  db.collection('ratings')
    .get()
    .then(data => {
      let ratings = []
      data.forEach(doc => {
        const ratingData = doc.data()
        ratings.push({
          productId: ratingData.productId,
          rating: ratingData.rating,
          raterId: ratingData.raterId,
        })
      })
      return res.json(ratings)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

// Get latest ratings
const getLatestRatings = (req, res) => {
  db.collection('ratings')
    .get()
    .then(data => {
      let ratings = []
      data.forEach(doc => {
        const ratingData = doc.data()
        ratings.push({
          rating: ratingData.rating,
          productId: ratingData.productId,
        })
      })
      // Calculate the sums and group data (while tracking count)
      const reduced = ratings.reduce((m, d) => {
        if (!m[d.productId]) {
          m[d.productId] = { ...d, count: 1 }
          return m
        }
        m[d.productId].rating += d.rating
        m[d.productId].count += 1
        return m
      }, {})

      // Create new array from grouped data and compute the average
      const result = Object.keys(reduced).map(k => {
        const item = reduced[k]
        return {
          productId: item.productId,
          averageRating: item.rating / item.count,
          numberOfRaters: item.count,
        }
      })
      axios
        .post('https://product-service-sda.herokuapp.com/product/sync', result)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}
