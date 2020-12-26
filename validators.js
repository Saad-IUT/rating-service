const { db } = require('./admin')

exports.validateProduct = async productName => {
  const productRef = await db
    .collection('products')
    .where('name', '==', productName)
    .get()
  try {
    return productRef.empty
  } catch (err) {
    console.error(err)
  }
}
