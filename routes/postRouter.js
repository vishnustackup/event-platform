const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../helpers/multer');
const { auth, userAuth } = require('../middleware/middleware')


router.get('/events/create', auth, postController.getEventForm);

router.post('/events/create', upload.single('image'), auth, postController.createEvent);

router.get('/home', userAuth, postController.getAllEvent);

router.get('/events/category',auth, postController.GetCategory)

router.post('/events/category',auth, postController.PostCategory)

router.get('/book-event/:id', auth, postController.getBookedEvents);

router.post('/book-event/:id', auth, postController.bookEvent);

router.get('/bookings/:id', auth, postController.getUserBookings)

router.delete('/auth/bookings/:userId/:eventId', auth, postController.cancelBooking);

router.get('/editposts/:id', postController.getEdit)

router.post('/editposts/:id', upload.single('image'), auth, postController.updatepost)

router.get('/myposts', auth, postController.getUserPosts)

router.post('/deleteposts/:id',auth, postController.deletePost)
module.exports = router; 
