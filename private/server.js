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
// Get all accounts
app.get('/db/getAccounts', (req, res) => {
    Account.find().then((data) => {
        res.send(data)
    })
})
// Get account by ID
app.post('/db/getAccount',(req, res) => {
    const id = req.body
    Account.findById(id)
        .then((result) => { res.send(result)})
        .catch((error) => { res.send(error)})
})
// Get all messages
app.get('/db/getMessages', (req, res) => {
    Twert.find().then((data) => {
        res.send(data)
    })
})
// Get the list of follow of a user
app.post('/db/getFollowOfUser', (req, res) => {
    Account.findById(req.body).then(async user => {
        res.send(user.follow)
    })
})
// Get the list of followers of a user
app.post('/db/getFollowersOfUser', (req, res) => {
    Account.findById(req.body).then(async user => {
        res.send(user.followers)
    })
})
// Follow a user 
app.post('/db/followProfil', (req, res) => {
    const data = JSON.parse(req.body)

    // Add the profilId to follow array of the user
    Account.findById(data.userId).then(async user => {
        user.follow.push(data.profilId)
        await user.save()
    })
    // Add the userId to followers array of the profil user
    Account.findById(data.profilId).then(async user => {
        user.followers.push(data.userId)
        await user.save()
    })
    res.sendStatus(200)
})
// Unfollow a user 
app.post('/db/unfollowProfil', (req, res) => {
    const data = JSON.parse(req.body)

    // Remove the profilId from follow array of the user
    Account.findById(data.userId).then(async user => {
        for (let i = 0; i < user.follow.length; i++) {
            if (user.follow[i] == data.profilId) {
                user.follow.splice(i, 1)
                await user.save()
            }
        }
    })
    // Remove the userId from followers array of the profil user
    Account.findById(data.profilId).then(async user => {
        for (let i = 0; i < user.followers.length; i++) {
            if (user.followers[i] == data.userId) {
                user.followers.splice(i, 1)
                await user.save()
            }
        }
    })
    res.sendStatus(200)
})
// Update biography of user 
app.post('/db/updateBiography', (req, res) => {
    const data = JSON.parse(req.body)

    Account.findById(data.userId).then(async user => {
        user.description = data.body
        await user.save()
    })
    res.sendStatus(200)
})
// Update profil image of user 
app.post('/db/updateProfilImg', (req, res) => {
    const data = JSON.parse(req.body)

    Account.findById(data.userId).then(async user => {
        user.profilImg = data.body
        await user.save()
    })
    res.sendStatus(200)
})
// Update background profil image of user 
app.post('/db/updateBackgroundProfilImg', (req, res) => {
    const data = JSON.parse(req.body)

    Account.findById(data.userId).then(async user => {
        user.backgroundProfilImg = data.body
        await user.save()
    })
    res.sendStatus(200)
})
// Get Message By Id
app.post('/db/getMessageById', (req, res) => {
    const id = req.body
    Twert.findById(id)
        .then((result) => { res.send(result)})
        .catch((error) => { res.send(error)})
})
// Get name of the author of a twert
app.post('/db/getAuthorName', (req, res)=>{
    Account.findById(req.body).then((user)=>{
        res.send(user.username)
    })
})
// Send twert to bdd
app.post('/db/sendMsg', (req, res)=>{
    let msg = JSON.parse(req.body)
    const twert = {
        authorId: msg.authorId,
        authorName: msg.authorName,
        body: msg.body,
        fav: [],
        retweet: [],
        comments: []
    }
    newTwert = new Twert(twert)
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
            
            // If a private discussion already exists but there is no messages, delete de discussion
            if (privateMsg.interlocutorId == data.interlocutorId && privateMsg.messages.length == 0) {
                privateMsg.remove()
                await user.save()
                console.log('discussion delete');
            }
            // If a private discussion already exists and there is some messages, don't create a new one
            else if (privateMsg.interlocutorId == data.interlocutorId) foundMatch = true
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
        }
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
        body: data.msgBody,
        date: new Date()
    }

    // Save the message in the user profile
    Account.findById(data.userId).then(user => {
        user.privateMessages.forEach(async privateMsg => {

            if (privateMsg.interlocutorId == data.interlocutorId) {
                newMsg.author = 'user'
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
// Add a like to a twert
app.post('/db/addALike', (req, res) => {
    const idTwert = JSON.parse(req.body).idTwert
    const userId = JSON.parse(req.body).userId

    Twert.findById(idTwert).then(async twert => {
        twert.fav.push(userId)
        await twert.save()
    })
    res.sendStatus(200)
})
// Delete a like for a twert
app.post('/db/deleteALike', (req, res) => {
    const idTwert = JSON.parse(req.body).idTwert
    const userId = JSON.parse(req.body).userId

    Twert.findById(idTwert).then(async twert => {
        for (let i = 0; i < twert.fav.length; i++) {
            const rtByUser = twert.fav[i];
            if(rtByUser == userId){
                twert.fav.splice(i,1)
            }
        }
        await twert.save()
    })
    res.sendStatus(200)
})
// Add a retwert to a twert
app.post('/db/addARetweet', (req, res) => {
    const idTwert = JSON.parse(req.body).idTwert
    const userId = JSON.parse(req.body).userId

    Twert.findById(idTwert).then(async twert => {
        twert.retweet.push(userId)
        await twert.save()
    })
    res.sendStatus(200)
})
// Delete a retwertfor a twert
app.post('/db/deleteARetweet', (req, res) => {
    const idTwert = JSON.parse(req.body).idTwert
    const userId = JSON.parse(req.body).userId

    Twert.findById(idTwert).then(async twert => {
        for (let i = 0; i < twert.retweet.length; i++) {
            const rtByUser = twert.retweet[i];
            if(rtByUser == userId){
                twert.retweet.splice(i,1)
            }
        }
        await twert.save()
    })
    res.sendStatus(200)
})