const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10
const userValidator = require('../validation/validator')

const GetSignup = async (req, res) => {
    res.render('signup')
}

const PostSignup = async (req, res) => {


    try {


        const { name, email, password, phoneno, state } = req.body;
          await userValidator.validate(req.body)
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({ msg: "User already exists" });
        }
        const hashpassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            name,
            email,
            password: hashpassword,
            phoneno,
            state,
        });

        await newUser.save();
        const payload = {
            user: {
                id: newUser._id,
            },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30m" });


        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 60 * 1000, // 30 minutes
        });

        res.redirect('/home');

    } catch (error) {
        console.error("Failed to register user:", error.stack);
        res.status(500).send("Failed to register user");
    }
};


const GetLogin = async (req, res) => {
    res.render('login')
}

const PostLogin = async (req, res) => {
    try {


        const { email, password } = req.body
        const user = await User.findOne({ email })


        if (!user) {
            return res.status(401).json({
                msg: "User not exists"
            })
        }
        const originalpassword = user.password
        const currentpassword = req.body.password
        const isMatch = await bcrypt.compare(currentpassword, originalpassword)

        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }

        if (user && isMatch) {

            const payload = {
                user: {
                    id: user._id,
                    role: user.role
                }
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30m" })

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 30 * 1000
            })


            if (user.role === 'admin') {

                return res.redirect('/admin/adminhome');
            } else {
                console.log('User is not an admin, role:', user.role);
                return res.redirect('/home');
            }


        } else {
            res.status(401);
            throw new Error("Invalid email or password");
        }
    } catch (err) {
        console.error("Failed to login user:", err);
        res.status(500).send("Failed to login user");
    }

}

const logout = async (req, res) => {

    res.clearCookie('token')
    res.redirect('/auth/login')
}


module.exports = {
    GetSignup, GetLogin,
    PostSignup, PostLogin, logout
}