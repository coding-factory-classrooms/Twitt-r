const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    privateMessages: Array,
    twert: Array, 
    favTwert: Array,
    retweetTwert: Array,
    commentTwert: Array
}, {timestamps: true})

const twertSchema = new mongoose.Schema({
    authorId: String,
    authorName: String,
    body: String,
    favCounter: Number,
    retweetCounter: Number,
    comments: Array
}, {timestamps: true})

module.exports = {
    Account: mongoose.model('accounts', accountSchema),
    Twert: mongoose.model('Twert', twertSchema)
}