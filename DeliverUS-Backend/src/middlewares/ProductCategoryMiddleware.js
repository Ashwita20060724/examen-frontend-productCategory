import { Restaurant, ProductCategory, Product } from '../models/models.js'
const checkProductCategoryOwnership = async (req, res, next) => {
  try {
    const productCategory = await ProductCategory.findByPk(req.params.productCategoryId, { include: { model: Restaurant, as: 'restaurant' } })
    if (req.user.id === productCategory.restaurant.userId) {
      return next()
    } else {
      return res.status(403).send('Not enough privileges. This entity does not belong to you')
    }
  } catch (err) {
    return res.status(500).send(err)
  }
}

const checkNoProductsInCategory = async (req, res, next) => {
  try {
    const productCategory = await Product.findAll({
      where: {
        productCategoryId: req.params.productCategoryId
      }
    })
    if (productCategory.length === 0) {
      return next()
    } else {
      return res.status(409).send('This category has products assigned to it')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}
export { checkProductCategoryOwnership, checkNoProductsInCategory }
