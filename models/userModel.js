const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneno: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    createdOn:
    {
        type: Date,
        default: Date.now
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    bookedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
})

const User = mongoose.model('User', userSchema)
module.exports = User