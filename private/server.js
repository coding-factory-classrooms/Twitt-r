const express = require('express')
const db = require('./database/exports')
const figlet = require('figlet')

// Server initiation
const app = express()
app.listen(3002, () => console.log('Server started on port 3002'))

app.use(express.json())
app.use(express.text())
app.use(express.static('public'))

// Database init
db.connect
const Account = db.schemas.Account
const Twert = db.schemas.Twert

figlet('Twittèr Corp', (err, data) => {
    if (err) console.log(err);
    else console.log(data);
})

// Create new account
app.post('/db/createAccount', (req, res) => {
    const userData = JSON.parse(req.body)

    const createAccount = new Account({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        privateMessages: [],
        twert: [], 
        favTwert: [],
        retweetTwert: [],
        commentTwert: [],
    })
    createAccount.save()
}) 
// Create new Twèrt
app.post('/db/newMessage', (req, res) => {
    let msgData = req.body
    
    const newMessage = new Message({
        authorId: authorId,
        authorName: authorName,
        body: body,
        favCounter: 0,
        retweetCounter: 0,
        comments: []
    })

    newMessage.save()
        .then((result) => { res.send(result) })
        .catch((error) => { res.send(error) })
})

app.post('/db/getAuthorName', (req, res)=>{
    let authorData = req.body
    console.log(authorData);
    Account.findById(req.body).then((user)=>{
        res.send(user.username)
    })
})

app.post('/db/sendMsg', (req, res)=>{
    let msg = JSON.parse(req.body)
    console.log(msg);
    newTwert = new Twert(msg)
    newTwert.save()
})
// Create a new private discussion
app.post('/db/newPrivateDiscussion', async (req, res) => {
    const data = JSON.parse(req.body)
    let username
    let foundMatch = false

    const newPrivateDiscussion = {
        interlocutor: data.interlocutor,
        interlocutorId: data.interlocutorId,
        messages: []
    }
    Account.findById(data.userId).then(async user => {
        username = user.username
        for (let i = 0; i < user.privateMessages.length; i++) {
            const privateMsg = user.privateMessages[i];
            if (privateMsg.interlocutorId == data.interlocutorId) {
                foundMatch = true
                // If a private discussion already exists, don't create a new private discussion
            }
        }
        if (!foundMatch) {
            // Create the new private discussion
            user.privateMessages.push(newPrivateDiscussion)
            await user.save()

            // Create the private discussion for the interlocutor
            Account.findById(data.interlocutorId).then(async user => {
                user.privateMessages.push({
                    interlocutor: username,
                    interlocutorId: data.userId,
                    messages: []
                })
                await user.save()
            })
            res.sendStatus(200)
        } else console.log('A private discussion already exists with this user');
    })
})
// Get all private discussion of a user
app.post('/db/getAllPrivateDiscussionOfUser', (req, res) => {
    const userId = req.body

    Account.findById(userId).then(user => {
        res.send(user.privateMessages)
    })
})
// Get a specific discussion between user and interlocutor
app.post('/db/getPrivateDiscussion', (req, res) => {
    const data = JSON.parse(req.body)

    Account.findById(data.userId).then(user => {
        user.privateMessages.forEach(discussion => {
            if (discussion.interlocutorId == data.interlocutorId) res.send(discussion)
        });
    })
})
// Return all usernames in the database
app.get('/db/getAllUsernames', (req, res) => {
    Account.find().then(users => {
        let usernames = []
        users.forEach(user => {
            usernames.push({
                username: user.username,
                userId: user._id
            })
        })
        res.send(usernames)
    })
})
// Save a new message in a private discussion
app.post('/db/saveNewMsg', (req, res) => {
    const data = JSON.parse(req.body)

    const newMsg = {
        author: 'user',
        body: data.msgBody,
        date: new Date()
    }

    // Save the message in the user profile
    Account.findById(data.userId).then(user => {
        user.privateMessages.forEach(async privateMsg => {

            if (privateMsg.interlocutorId == data.interlocutorId) {
                privateMsg.messages.push(newMsg)
                await user.save()
            }
        })
    })
    // Save the message in the interlocutor profil
    Account.findById(data.interlocutorId).then(user => {
        user.privateMessages.forEach(async privateMsg => {
            if (privateMsg.interlocutorId == data.userId) {
                newMsg.author = 'interlocutor'
                privateMsg.messages.push(newMsg)
                await user.save()
            }
        })
    })
    res.sendStatus(200)
})