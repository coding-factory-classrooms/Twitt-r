const express = require('express')
const db = require('./database/exports')

const app = express()

// Server init
app.listen(3002, () => console.log('Server started on port 3002'))
app.use(express.json())
app.use(express.text())
app.use(express.static('public'))

// Database init
db.connect
const Account = db.schemas.Account
const Twert = db.schemas.Twert

// Create new account
app.post('/db/createAccount', (req, res) => {
    const userData = req.body

    const createAccount = new Account({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        privateMessages: [],
        twert: [], 
        favTwert: [],
        retweetTwert: [],
        commentTwert: []
    })
    createAccount.save()
        .then(() => { res.sendStatus(200) })
        .catch((error) => { res.send(error) })
})
