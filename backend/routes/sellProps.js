const express = require('express')
const multer = require('multer')

const SellProp = require('../models/sellProp')

const router = express.Router()


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]
        let error =  new Error('Invalid mime typevc')
        if (isValid) {
            error = null
        }
        // this path is seen relative to server.js
        cb(error, 'backend/images')
    }, filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-')
        const ext = MIME_TYPE_MAP[file.mimetype]
        cb(null, file.originalname + '.' + ext)
    }
})


router.get('/', (req, res, next) => {

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
    SellProp.find().then((documents => {
        res.status(200).json({
            message: 'Properties fetched!',
            sellPorps: documents
        })
    }))
})

const upload = multer({storage: storage})

router.get('/:id', (req, res, next) => {
    SellProp.findById(req.params.id).then(document => {
        if (document) {
            res.status(200).json({
                message: 'Property fetched!',
                sellProp: document
            })
        } else {
            res.status(404).json({message: 'Property not found!'})
        }
    })
})

router.post('/', upload.array('slike', 20), (req, res, next) => {

    const url = req.protocol + '://' + req.get('host') // constructs url to our server

    const imagePaths = req.files.map(file => url + '/images/' + file.filename);

    const sellProp = new SellProp({
        tip: req.body.tip,
        povrsina: req.body.povrsina,
        cenaKvadrata: req.body.cenaKvadrata,
        struktura: req.body.struktura,
        sprat: req.body.sprat,
        brojSpavacihSoba: req.body.brojSpavacihSoba,
        slike: imagePaths,
        opis: req.body.opis
    })
    sellProp.save().then(newProp => {
        res.status(201).json({
            message: 'Property added!',
            sellProp: {
                ...newProp,
                _id: newProp._id,
            }
        })
    })
})


router.put('/:id', upload.array('slike', 20), (req, res, next) => {
    const id = req.params.id;
  
    // URL construction for the server
    const url = req.protocol + '://' + req.get('host');
  
    // Get existing images from the form data
    let existingImages = req.body.existingImages || [];
    if (!Array.isArray(existingImages)) {
        existingImages = [existingImages];
    }
  
    // Construct URLs for newly uploaded images
    const newImagePaths = req.files.map(file => url + '/images/' + file.filename);
  
    // Combine existing and new images
    const updatedImages = [...existingImages, ...newImagePaths];
  
    // Update object without modifying _id
    const updatedProp = {
      tip: req.body.tip,
      povrsina: req.body.povrsina,
      cenaKvadrata: req.body.cenaKvadrata,
      struktura: req.body.struktura,
      sprat: req.body.sprat,
      brojSpavacihSoba: req.body.brojSpavacihSoba,
      slike: updatedImages, // Combined image URLs
      opis: req.body.opis
    };
  
    // Perform the update
    SellProp.updateOne({ _id: id }, { $set: updatedProp })
      .then(result => {
        res.status(200).json({ message: 'Update successful!' });
      })
      .catch(err => {
        res.status(500).json({ message: 'Error updating property', error: err });
      });
  });



router.delete('/:id', (req, res, next) => {
    SellProp.deleteOne({_id: req.params.id}).then((result) => {
        res.status(200).json({message: 'Property deleted!'})
    })
})


module.exports = router