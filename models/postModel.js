const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        enum: ['Corporate', 'Virtual', 'Sports', 'Entertainment', 'Education', 'Social'],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, {
    timestamps: true
})

const Post = mongoose.model('Post', postSchema)
module.exports = Post