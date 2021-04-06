const express = require('express')
const db = require('./database/exports')
const figlet = require('figlet')



// Server initiation
const app = express()
app.listen(3002, () => console.log('Server started on port 3002'))

app.use(express.json())
app.use(express.text())
app.use(express.static('public'))

// Database initiation
db.connect

figlet('Twittèr Corp', (err, data) => {
    if (err) console.log(err);
    else console.log(data);
})