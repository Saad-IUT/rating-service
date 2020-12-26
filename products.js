const { db } = require('./admin')
const { validateProduct } = require('./validators')

// Add Product
exports.addProduct = async (req, res) => {
  const valid = await validateProduct(req.body.name)
  const product = req.body
  if (valid) {
    const newProduct = {
      name: product.name,
      categoryId: product.categoryId,
      categoryName: '',
      averageRating: '',
      numberOfRaters: 0,
    }
    db.collection('products')
      .add(newProduct)
      .then(() => {
        res.status(201).json({ message: 'Product added successfully' })
      })
      .catch(err => {
        res.status(500).json({ error: 'something went wrong' })
        console.error(err)
      })
  } else {
    return res.status(400).json({ product: 'Duplicate' })
  }
}

// Delete a product
exports.deleteProduct = (req, res) => {
  const productRef = db.doc(`/products/${req.params.productId}`)
  productRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Product not found' })
      } else {
        return productRef.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Product deleted successfully' })
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}

// Get all products
exports.getAllProducts = (req, res) => {
  db.collection('products')
    .get()
    .then(data => {
      let products = []
      data.forEach(doc => {
        const productData = doc.data()
        products.push({
          id: doc.id,
          name: productData.name,
          categoryId: productData.categoryId,
          categoryName: productData.categoryName,
          averageRating: productData.averageRating,
          numberOfRaters: productData.numberOfRaters,
        })
      })
      return res.json(products)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

// Update category of a product
exports.updateCategory = (req, res) => {
  const productRef = db.doc(`/products/${req.body.productId}`)
  productRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Product not found' })
      } else {
        productRef.update({ categoryId: req.body.categoryId })
        return res.json({ message: 'CategoryId updated successfully' })
      }
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}
