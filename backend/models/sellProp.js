
const mongoose = require('mongoose')

// const sellPropSchema = mongoose.Schema({
//     tip: {type: String, required: true},
//     povrsina: {type: Number, required: true},
//     cenaKvadrata: {type: Number, required: true},
//     struktura: {type: String, required: true},
//     sprat: {type: Number, required: true},
//     brojSpavacihSoba: {type: Number, required: true},
//     slike: [{type: String, required: true}],
//     opis: {type: String},
//     agent: {type: mongoose.Schema.Types.ObjectId, ref: 'Agent', require: true}
// })


const sellPropSchema = mongoose.Schema({
    naslov: { type: String, required: true },
    tip: { type: String, required: true },
    struktura: { type: String, required: true },
    grad: { type: String, required: true },
    naselje: { type: String, required: true },
    adresa: { type: String, required: true },
    povrsina: { type: Number, required: true },
    cena: { type: Number, required: true },
    spratovi: { type: Number, required: true },
    sprat: { type: Number, required: true },
    lift: { type: Boolean, required: true },
    grejanje: { type: String, required: true },
    namestenost: { type: Boolean, required: true },
    uknjizenost: { type: Boolean, required: true }, 
    slike: [{ type: String, required: true }],
    opis: { type: String }, // Existing field for description
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true }
});


module.exports = mongoose.model('SellProp', sellPropSchema);






// const sellPropSchema = mongoose.Schema({
//     naslov: { type: String, required: true }, // New field for title
//     tip: { type: String, required: true }, // Existing field
//     struktura: { type: String, required: true }, // Existing field
//     grad: { type: String, required: true }, // New field for city
//     naselje: { type: String, required: true }, // New field for neighborhood
//     adresa: { type: String, required: true }, // New field for address
//     povrsina: { type: Number, required: true }, // Existing field for surface area
//     cena: { type: Number, required: true }, // New field for total price
//     spratovi: { type: Number, required: true }, // New field for total floors in the building
//     sprat: { type: Number, required: true }, // Existing field
//     lift: { type: Boolean, required: true }, // New field for elevator presence
//     grejanje: { type: Number, required: true, enum: Object.keys(heatingTypes) }, // New field for heating type using dictionary
//     namestenost: { type: Boolean, required: true }, // New field for furnished status
//     uknjizenost: { type: Boolean, required: true }, // New field for legal status
//     slike: [{ type: String, required: true }], // Existing field for images
//     opis: { type: String }, // Existing field for description
//     agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true } // Existing reference to the agent
// });

// // Export the model
// module.exports = mongoose.model('SellProp', sellPropSchema);