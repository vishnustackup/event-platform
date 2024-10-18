const express = require('express')
const router = express.Router()
const authController = require('../controllers/authcontroller')
const userController = require('../controllers/userController')
const { auth } = require('../middleware/middleware')


router.get('/signup', authController.GetSignup)

router.post('/signup', authController.PostSignup)

router.get('/login', authController.GetLogin)

router.post('/login', authController.PostLogin)

router.get('/userdashboard', auth, userController.getUserDashboard)

router.get('/myposts/:id', auth, userController.GetPostById)

router.get('/logout',auth, authController.logout)


module.exports = router