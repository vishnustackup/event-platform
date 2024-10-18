const express = require('express')
const app = express()
const env = require('dotenv').config()
const path = require('path')
const db = require('./config/db')
const postRoute = require('./routes/postRouter')
const userRoute = require('./routes/userRouter')
const adminRouter = require('./routes/adminRoutes')
const cookieParser = require('cookie-parser');

db()

// To parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// To SERVE STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// SETTING UP VIEW ENGINE
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));



app.use('/', postRoute)
app.use('/auth', userRoute)
app.use('/admin', adminRouter)




app.listen(3000, () => console.log("server running"))

module.exports = app