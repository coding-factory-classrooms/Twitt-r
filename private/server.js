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