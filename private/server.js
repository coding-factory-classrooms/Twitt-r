const express = require('express')
const db = require('./database/exports')
const figlet = require('figlet')
const bcrypt = require('bcryptjs')

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