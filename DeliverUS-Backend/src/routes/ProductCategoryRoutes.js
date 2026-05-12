import ProductCategoryController from '../controllers/ProductCategoryController.js'
import * as ProductCategoryMiddleware from '../middlewares/ProductCategoryMiddleware.js'
import * as RestaurantMiddleware from '../middlewares/RestaurantMiddleware.js'
import * as ProductCategoryValidation from '../controllers/validation/ProductCategoryValidation.js'
import { ProductCategory, Restaurant } from '../models/models.js'
import { hasRole, isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'

const loadFileRoutes = (app) => {

  app.route('/productCategories/restaurants/:restaurantId')
    .post(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      ProductCategoryValidation.create,
      handleValidation,
      ProductCategoryController.create
    )
  app.route('/productCategories/restaurants/:restaurantId')
    .get(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      ProductCategoryController.indexByRestaurant
    )
  app.route('/productCategories/:productCategoryId/products')
    .get(
      checkEntityExists(ProductCategory, 'productCategoryId'),
      ProductCategoryController.indexProductsByCategory
    )

  app.route('/productCategories/:productCategoryId')
    .get(
      checkEntityExists(ProductCategory, 'productCategoryId'),
      ProductCategoryController.show)

  app.route('/productCategories/:restaurantId/categories/:productCategoryId')
    .delete(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(ProductCategory, 'productCategoryId'),
      checkEntityExists(Restaurant, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      ProductCategoryMiddleware.checkProductCategoryOwnership,
      ProductCategoryMiddleware.checkNoProductsInCategory,
      ProductCategoryController.destroy
    )

}
export default loadFileRoutes
