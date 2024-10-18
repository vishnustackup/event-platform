const mongoose = require('mongoose')
const env = require('dotenv').config()



const db = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI)
        console.log("db connected");

    } catch (err) {
        console.error("db not connected");

    }
}

module.exports= db