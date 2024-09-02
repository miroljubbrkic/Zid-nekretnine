const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

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

app.get('/zid/sell-props', (req, res, next) => {

    const sellProps = [
        {
            _id:'111', 
            tip: 'stan', 
            povrsina:45, 
            cenaKvadrata: 2000, 
            struktura: 'dvosoban', 
            sprat: 2, 
            brojSpavacihSoba: 2
        },
        {
            _id:'222', 
            tip: 'stan', 
            povrsina:90, 
            cenaKvadrata: 1800, 
            struktura: 'cetvorosoban', 
            sprat: 4, 
            brojSpavacihSoba: 4
        },
        {
            _id:'333', 
            tip: 'stan', 
            povrsina:30, 
            cenaKvadrata: 2500, 
            struktura: 'garsonjera', 
            sprat: 1, 
            brojSpavacihSoba: 1
        }
    ]

    res.status(200).json({
        message: 'Properties for selling fetched successfully!',
        sellPorps: sellProps
    })
})

app.post('/zid/sell-props', (req, res, next) => {
    const sellProp = req.body
    console.log(sellProp);
    res.status(201).json({
        message: 'Property for selling added successfully!'
    })
})


module.exports = app