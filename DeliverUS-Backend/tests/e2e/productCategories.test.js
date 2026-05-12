import request from 'supertest'
import { getLoggedInCustomer, getLoggedInOwner, getLoggedInOwner2, getNewLoggedInOwner, getNewLoggedInCustomer } from './utils/auth'
import { createRestaurant, getFirstRestaurantOfOwner, getRandomRestaurant } from './utils/restaurant'
import { getNewProductCategory, checkProductCategoryEquals } from './utils/product'
import { createOrder, getNewOrderData, getNewOrderDataWithUnavailableProduct, checkOrderEqualsOrderData, computeOrderPrice } from './utils/order'
import { shutdownApp, getApp } from './utils/testApp'

describe('No owner product categories', () => {
  let customer, createdOrderId, app, owner2, restaurant
  beforeAll(async () => {
    app = await getApp()
  })
  it('The user is not logged in', async () => {
    const response = await request(app).get(`/productCategories/restaurants/1`).send()
    expect(response.status).toBe(401)
  })
  afterAll(async () => {
    await shutdownApp()
  })
})

describe('Get all product categories', () => {
  let customer, createdOrderId, app, owner, restaurant
  beforeAll(async () => {
    owner = await getLoggedInOwner()
    app = await getApp()
    restaurant = await getFirstRestaurantOfOwner(owner)
  })
  it('There must be more than one product category', async () => {
    const response = await request(app).get(`/productCategories/restaurants/${restaurant.id}`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body).not.toHaveLength(0)
  })
  it('The restaurant\'s owner is wrong', async () => {
    const response = await request(app).get(`/productCategories/restaurants/10`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(403)
  })
  it('The restaurant\'s owner is wrong', async () => {
    const response = await request(app).get(`/productCategories/restaurants/13`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(404)
  })
  afterAll(async () => {
    await shutdownApp()
  })
})

describe('Post new product category', () => {
  let createdProductCategoryId, app, owner, restaurant, newProductCategory, newProductCategoryTemp
  beforeAll(async () => {
    owner = await getLoggedInOwner()
    app = await getApp()
    restaurant = await getFirstRestaurantOfOwner(owner)
  })
  it('Should return 200 and the correct created category when valid order', async () => {
    newProductCategory = await getNewProductCategory(restaurant)
    const response = await request(app).post(`/productCategories/restaurants/${restaurant.id}`).set('Authorization', `Bearer ${owner.token}`).send(newProductCategory)
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    await checkProductCategoryEquals(response.body, newProductCategory)
    createdProductCategoryId = response.body.id
  })
  it('The restaurant\'s owner is wrong', async () => {
    newProductCategoryTemp = await getNewProductCategory(restaurant)
    newProductCategoryTemp.restaurantId = 10
    const response = await request(app).post(`/productCategories/restaurants/${newProductCategoryTemp.restaurantId}`).set('Authorization', `Bearer ${owner.token}`).send(newProductCategoryTemp)
    expect(response.status).toBe(403)
  })
  it('The restaurant does not exist', async () => {
    newProductCategoryTemp.restaurantId = 26
    const response = await request(app).post(`/productCategories/restaurants/${newProductCategoryTemp.restaurantId}`).set('Authorization', `Bearer ${owner.token}`).send(newProductCategoryTemp)
    expect(response.status).toBe(404)
  })
  it('Wrong properties', async () => {
    newProductCategoryTemp.restaurantId = 1
    newProductCategoryTemp.name = ""
    const response = await request(app).post(`/productCategories/restaurants/${newProductCategoryTemp.restaurantId}`).set('Authorization', `Bearer ${owner.token}`).send(newProductCategoryTemp)
    expect(response.status).toBe(422)
  })

  afterAll(async () => {
    await shutdownApp()
  })
})

describe('Delete product category', () => {
  let createdProductCategoryId, app, owner, restaurant, newProductCategory, newProductCategoryTemp
  beforeAll(async () => {
    owner = await getLoggedInOwner()
    app = await getApp()
    restaurant = await getFirstRestaurantOfOwner(owner)
  })
  it('Should return 200 and the correct created order when valid order', async () => {
    newProductCategory = await getNewProductCategory(restaurant)
    const response = await request(app).post(`/productCategories/restaurants/${restaurant.id}`).set('Authorization', `Bearer ${owner.token}`).send(newProductCategory)
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    await checkProductCategoryEquals(response.body, newProductCategory)
    createdProductCategoryId = response.body.id
  })
  it('The restaurant\'s owner is wrong', async () => {
    newProductCategoryTemp = await getNewProductCategory(restaurant)
    newProductCategoryTemp.restaurantId = 10
    const response = await request(app).delete(`/productCategories/${newProductCategoryTemp.restaurantId}/categories/${createdProductCategoryId}`).set('Authorization', `Bearer ${owner.token}`).send(newProductCategoryTemp)
    expect(response.status).toBe(403)
  })
  it('The restaurant does not exist', async () => {
    const response = await request(app).delete(`/productCategories/14/categories/${createdProductCategoryId}`).set('Authorization', `Bearer ${owner.token}`)
    expect(response.status).toBe(404)
  })
  it('The category does not exist', async () => {
    const response = await request(app).delete(`/productCategories/${restaurant.id}/categories/4124123`).set('Authorization', `Bearer ${owner.token}`)
    expect(response.status).toBe(404)
  })
  it('Delete product category', async () => {
    const response = await request(app).delete(`/productCategories/${newProductCategory.restaurantId}/categories/${createdProductCategoryId}`).set('Authorization', `Bearer ${owner.token}`)
    expect(response.status).toBe(204)
  })
  it('There must be no one product category', async () => {
    const response = await request(app).get(`/productCategories/${createdProductCategoryId}`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(404)
  })

  it('There must be no one product category', async () => {
    const response = await request(app).get(`/productCategories/restaurants/${restaurant.id}`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body))
    expect(response.body.find(category => category.id === createdProductCategoryId)).toBeUndefined()
  })


  afterAll(async () => {
    await shutdownApp()
  })
})
