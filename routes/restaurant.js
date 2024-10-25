const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/RestaurantController')
const { verifyToken } = require('../middleware/verifyToken')

router.post('/', restaurantController.addRestaurant)
router.get('/:code', restaurantController.getRandomByRestaurants)
router.get('/all/:code', restaurantController.getAllNearByRestaurants)
router.get("/byId/:id", restaurantController.getRestaurantById)
router.delete('/:id', restaurantController.deleteRestaurant)
router.get('/', restaurantController.getAllRestaurant)
module.exports = router
