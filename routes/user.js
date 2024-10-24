const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { verifyTokenAndAuthorization } = require('../middleware/verifyToken')

router.get('/', verifyTokenAndAuthorization, userController.getUser)
router.delete('/', userController.deleteUser)
router.post('/verify/:otp', verifyTokenAndAuthorization, userController.verifyAccount)
router.get('/verify_phone/:phone', verifyTokenAndAuthorization, userController.verifyPhone)

module.exports = router





