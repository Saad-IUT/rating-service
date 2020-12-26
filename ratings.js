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
            if (count % 5 == 0 && count > 0) {
              axios
                .post(
                  'https://product-service-sda.herokuapp.com/product/sync',
                  {
                    firstName: 'Fred',
                    lastName: 'Flintstone',
                  }
                )
                .then(res => {
                  console.log(res)
                })
                .catch(err => {
                  console.log(err)
                })
            }
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
