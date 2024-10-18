const User = require('../models/userModel')
const Event = require('../models/postModel')



//--------------- GET ADMINHOME-----------

const getAdminhome = async (req, res) => {
    const adminId = req.user.id;
    const admin = await User.findById(adminId)
    const events = await Event.find();

    if (!admin) {
        res.status(401).json({ msg: "user not found" })
    }
    res.render('admin/adminhome', { events, admin });
}


//--------------- GET ADMINDASHBOARD-----------

const getadminDashboard = async (req, res) => {
    const adminId = req.user.id;
    const admin = await User.findById(adminId)
    if (!admin) {
        res.status(401).json({ msg: "user not found" })
    }
    res.render('admin/adminDashboard', { admin });

}

//--------------- GET ALL USERS-----------

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
        const adminId = req.user.id;
        const admin = await User.findById(adminId)
        res.render('admin/adminUsers', { users, admin })
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');


    }
}

//--------------- GET ADMIN DELETE USER-----------

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin/adminUsers');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Server error');
    }
};

//--------------- GET ALL EVENT-----------

const getAllEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
        const events = await Event.find();

        res.render('admin/adminEvents', { events, user });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}



const getEditAdmin = async (req, res) => {
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


const updatepostAdmin = async (req, res) => {
    try {
        const { title, description, place, date, category, price } = req.body;
        const post = await Event.findById(req.params.id);

        if (!post) {
            return res.render('admin/adminDashboard');
        }

        // Update post details
        post.title = title;
        post.description = description;
        post.place = place;
        post.date = date;
        post.category = category;
        post.price = price;

        // If a new image is uploaded, update the image path
        if (req.file) {
            post.image = `/uploads/${req.file.filename}`;
        }

        await post.save();

        const isAdmin = req.user.role === 'admin';

        // Redirect based on the role
        if (isAdmin) {
            return res.redirect('/admin/adminDashboard');
        } else {
            return res.redirect('/auth/userDashboard');
        }
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).send("Server error");
    }
};



module.exports = { getAdminhome, getadminDashboard, 
    getAllUsers, deleteUser, getAllEvent,
    getEditAdmin,updatepostAdmin }