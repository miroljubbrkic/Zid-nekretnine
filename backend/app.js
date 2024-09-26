const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const SellProp = require('./models/sellProp')
const sellPropsRoutes = require('./routes/sellProps')
const agentsRoutes = require('./routes/agents')

const app = express()

mongoose.connect('mongodb+srv://root:root@cluster0.zglfne3.mongodb.net/zidd?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    console.log('Connected to database');
}).catch(() => {
    console.log('Connection failed!');
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/images', express.static(path.join('backend/images')))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        )
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        )
    next()
})




// app.use(sellPropsRoutes)
app.use('/zid/sell-props', sellPropsRoutes)
// app.use('/zid', sellPropsRoutes);
app.use('/zid/agents', agentsRoutes)

module.exports = app