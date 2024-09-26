
const mongoose = require('mongoose')

const sellPropSchema = mongoose.Schema({
    tip: {type: String, required: true},
    povrsina: {type: Number, required: true},
    cenaKvadrata: {type: Number, required: true},
    struktura: {type: String, required: true},
    sprat: {type: Number, required: true},
    brojSpavacihSoba: {type: Number, required: true},
    slike: [{type: String, required: true}],
    opis: {type: String},
    agent: {type: mongoose.Schema.Types.ObjectId, ref: 'Agent', require: true}
})

module.exports = mongoose.model('SellProp', sellPropSchema)