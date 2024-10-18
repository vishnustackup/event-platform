const Event = require('../models/postModel');
const User = require('../models/userModel')

//--------- CREATING EVENTS-------------//
const createEvent = async (req, res) => {
    try {
        const { title, description, place, date, category, price } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image upload failed' });
        }

        const newEvent = new Event({
            image: '/uploads/' + req.file.filename,
            title,
            description,
            place,
            category,
            date,
            price,
            user: req.user._id,
        });

        await newEvent.save();
        return res.status(200).json({
            success: true,
            message: 'Event created successfully!',
            redirectUrl: req.user.role === 'admin' ? '/admin/adminhome' : '/home'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};


const getAllEvent = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const user = req.user;
        const events = await Event.find().sort({ createdAt: -1 }).limit(5);
        res.render('home', { events, user });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

const getEventForm = (req, res) => {
    res.render('addpost');
};

const GetCategory = async (req, res) => {
    const isAdmin = req.user && req.user.role === 'admin';
    console.log(isAdmin);
    res.render('category', { isAdmin })
}


const PostCategory = async (req, res) => {
    const { category } = req.body;

    let events = [];
    if (category) {
        events = await Event.find({ category }).sort({ createdAt: -1 })

    } else {
        events = await Event.find()
    }
    const isAdmin = req.user && req.user.role === 'admin';
    res.render('allEvents', { events, category, isAdmin })
}

const bookEvent = async (req, res) => {
    try {
        const userId = req.user._id;
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found!" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        if (user.bookedEvents.includes(eventId)) {
            return res.status(400).json({ message: "Event already booked!" });
        }
        user.bookedEvents.push(eventId);
        await user.save();
        event.bookings.push(userId);
        await event.save();
        res.json({ success: true, message: "Event booked successfully!" });


    } catch (error) {
        console.error("Error booking event:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getBookedEvents = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId)
            .populate('bookedEvents', null, null, { strictPopulate: false });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.render('booked', { bookedEvents: user.bookedEvents, user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
};


const getUserBookings = async (req, res) => {
    try {

        const userId = req.user._id;
        const events = await Event.find({ user: userId });
        const eventsWithBookingCounts = events.map(event => {
            return {
                ...event._doc,
                bookingsCount: event.bookings.length
            };
        });
        const isAdmin = req.user.role === 'admin'
        if (isAdmin) {
            return res.render('admin/adminbookings', { events: eventsWithBookingCounts, isAdmin });
        }
        res.render('bookings', { events: eventsWithBookingCounts, userId });



    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { userId, eventId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.bookedEvents = user.bookedEvents.filter(event => event.toString() !== eventId);
        const post = await Event.findById(eventId);
        if (post) {
            post.bookings = post.bookings.filter(user => user.toString() !== userId);
            await post.save();
        }
        await user.save();
        res.json({ success: true, message: 'Booking canceled successfully' });
    } catch (error) {
        console.error('Error canceling booking:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const getEdit = async (req, res) => {
    try {
        const post = await Event.findById(req.params.id);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.render('editposts', { post });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).send("Server error");
    }
}


const updatepost = async (req, res) => {
    try {
        const { title, description, place, date, category, price } = req.body;
        const post = await Event.findById(req.params.id);
        if (!post) {
            return res.render('myposts')
        }

        post.title = title;
        post.description = description;
        post.place = place;
        post.date = date;
        post.category = category;
        post.place = place;
        post.price = price

        if (req.file) {
            post.image = `/uploads/${req.file.filename}`;
        }

        await post.save();
        const isAdmin = req.user.role === 'admin';

        if (isAdmin) {
            res.redirect('/admin/adminDashboard');
        } else {
            res.redirect('/auth/userDashboard');

        }
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).send("Server error");
    }
}

const getUserPosts = async (req, res) => {
    try {
        console.log("User: ", req.user);
        const posts = await Event.find({ user: req.user.id });
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';
        console.log("Is admin: ", isAdmin);

        if (isAdmin) {
            console.log("Rendering admin posts");
            return res.render('admin/adminposts', { posts, isAdmin });
        }
        console.log("Rendering user posts");
        return res.render('myPosts', { posts, userId });
    } catch (error) {
        console.error("Error fetching user's posts:", error);
        return res.status(500).send("Server error");
    }
};


const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        await Event.findByIdAndDelete(postId);
        const posts = await Event.find({ user: req.user.id });

        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';

        if (isAdmin) {
            return res.render('admin/adminDashboard', { posts, userId });
        } else {
            return res.render('myposts', { posts, userId });
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};




module.exports = {
    createEvent, getAllEvent, getEventForm,
    GetCategory, PostCategory, bookEvent, getBookedEvents,
    getUserBookings,
    cancelBooking, getEdit, updatepost, getUserPosts, deletePost
}