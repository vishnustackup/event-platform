const jwt = require('jsonwebtoken')
const env = require('dotenv')
const User = require('../models/userModel')
env.config()

const auth = async (req, res, next) => {

    const token = req.cookies.token
    if (!token) {
        return res.render('login')

    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.user.id).select('-password')
        next()
        if(!req.user){
            return res.status(404).json({ msg: "User not found" });
        }
    } catch (error) {
        console.log("error message", error.message);

        return res.status(401)
            .json({ msg: " token is invalid" })
    }
}

const adminAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.render('login'); 
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.user.id).select('-password');

        if (req.user && req.user.role === 'admin') {
            return next(); 
        } else {
            return res.status(403).json({ msg: "Access denied: Admins only" }); 
        }
    } catch (error) {
        console.log("Error message:", error.message);
        return res.status(401).json({ msg: "Token is invalid" }); 
    }
};

const userAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.user = null; 
        return next(); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.user.id).select('-password');

        if (!req.user) {
            return res.status(404).json({ msg: "User not found" });
        }

        next();
    } catch (error) {
        console.log("error message", error.message);
        return res.status(401).json({ msg: "Token is invalid" });
    }
};



module.exports = { auth, adminAuth,userAuth }