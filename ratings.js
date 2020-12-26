const { db } = require('./admin')

// Add Rating
exports.addRating = (req, res) => {
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
