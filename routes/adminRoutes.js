const express = require('express')
const router = express.Router()
const { adminAuth } = require('../middleware/middleware')
const adminController = require('../controllers/adminController')
const postController = require('../controllers/postController')
const upload = require('../helpers/multer');

router.get('/adminhome', adminAuth, adminController.getAdminhome)

router.get('/adminDashboard', adminAuth, adminController.getadminDashboard)

router.get('/adminUsers', adminAuth, adminController.getAllUsers)

router.post('/adminUsers/:id', adminAuth, adminController.deleteUser)

router.get('/adminEvents', adminAuth, adminController.getAllEvent)

router.get('/adminposts/:id', adminAuth, postController.getUserPosts)

router.get('/admin/edit/:id',adminAuth, postController.getEdit);

// Route to handle post updates (for admins)
router.post('/admin/update/:id',adminAuth, upload.single('image'), postController.updatepost);


router.post('/deleteposts/:id',adminAuth, postController.deletePost)

module.exports = router