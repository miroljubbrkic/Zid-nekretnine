
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const agentSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    lozinka: {type: String, required: true},
    ime: {type: String, required: true},
    prezime: {type: String, required: true},
    telefon: {type: String, required: true}
})

agentSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Agent', agentSchema)