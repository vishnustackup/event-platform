const User = require('../models/userModel')
const Post = require('../models/postModel')


const getUserDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const userid = req.user; 
        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }
        const isAdmin = user.role === 'admin';
       

        if (isAdmin) {

            return res.render('admin/adminDashboard', { user });
        }
        res.render('userDashboard', { user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
}




const GetPostById = async (req, res) => {
    try {
        const userId = req.params.id;
        const post = await Post.find({ user: userId });
        if (!post || post.length === 0) {
            return res.status(404).json({ msg: "Post not found" });
        }

        res.render('myposts', { post, userId });

    } catch (error) {
        console.error("Error fetching post by user ID:", error);
        res.status(500).json({ msg: "Server error" });
    }
};



module.exports = { getUserDashboard, GetPostById }