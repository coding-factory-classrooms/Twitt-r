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
        .then(() => { res.sendStatus(200) })
        .catch((error) => { res.send(error) })
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