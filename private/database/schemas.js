const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    profilImg: String,
    backgroundProfilImg: String,
    followers: Array,
    follow: Array,
    description: String,
    privateMessages:[
        {
            interlocutor: String,
            interlocutorId: String,
            messages: [
                {
                    author: String,
                    body: String,
                    date: Date
                }
            ]
        }
    ],
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