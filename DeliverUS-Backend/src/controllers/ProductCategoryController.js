import { ProductCategory } from "../models/models.js"

const index = async function (req, res) {
  try {
    const productCategories = await ProductCategory.findAll()
    res.json(productCategories)
  } catch (err) {
    res.status(500).send(err)
  }
}
const create = async function (req, res) {
  let newProductCategory = ProductCategory.build(req.body)
  try {
    newProductCategory = await newProductCategory.save()
    res.json(newProductCategory)
  } catch (err) {
    res.status(500).send(err)
  }
}

const show = async function (req, res) {
  try {
    const productCategory = await ProductCategory.findByPk(req.params.productCategoryId)
    res.json(productCategory)
  } catch (err) {
    res.status(500).send(err)
  }
}

const destroy = async function (req, res) {
  try {
    const productCategory = await ProductCategory.findByPk(req.params.productCategoryId)
    if (!productCategory) {
      return res.status(404).send('Product category not found')
    }

    await productCategory.destroy()
    res.status(204).send()
  } catch (err) {
    res.status(500).send(err)
  }
}

const indexByRestaurant = async function (req, res) {
  try {
    const productCategories = await ProductCategory.findAll({
      where: { restaurantId: req.params.restaurantId }
    })
    res.json(productCategories)
  } catch (err) {
    res.status(500).send(err)
  }
}

const indexProductsByCategory = async function (req, res) {
  try {
    const productCategory = await ProductCategory.findByPk(req.params.productCategoryId, {
      include: [
        {
          model: Product,
          as: 'products'
        }
      ]
    })
    if (!productCategory) {
      return res.status(404).send('Product category not found')
    }
    res.json(productCategory.products)
  } catch (err) {
    res.status(500).send(err)
  }
}

const ProductCategoryController = {
  index,
  indexByRestaurant,
  create,
  show,
  destroy,
  indexProductsByCategory
}

export default ProductCategoryController
