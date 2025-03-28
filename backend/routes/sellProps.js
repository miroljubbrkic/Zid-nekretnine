const express = require('express')
const multer = require('multer')

const SellProp = require('../models/sellProp')
const checkAuth = require('../middleware/check-auth')
const agent = require('../models/agent')

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


// Ruta za dobijanje oglasa prijavljenog agenta
router.get('/my-sell-props', checkAuth, (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const minCena = +req.query.minCena;
    const maxCena = +req.query.maxCena;
    const minPovrsina = +req.query.minPovrsina;
    const maxPovrsina = +req.query.maxPovrsina;
    const struktura = req.query.struktura;

    const agentId = req.agentData.agentId;  // Uzimamo ID prijavljenog agenta iz middleware-a

    let query = {agent: agentId};

    // Build the query object based on the filters
    if (minCena || maxCena) {
        query.cena = {};
        if (minCena) query.cena.$gte = minCena;
        if (maxCena) query.cena.$lte = maxCena;
    }

    if (minPovrsina || maxPovrsina) {
        query.povrsina = {};
        if (minPovrsina) query.povrsina.$gte = minPovrsina;
        if (maxPovrsina) query.povrsina.$lte = maxPovrsina;
    }

    if (struktura) {
        query.struktura = struktura; // Add struktura to the query if provided
    }

    const propQuery = SellProp.find(query); // Use the query object

    let fetchedProps;

    if (pageSize && currentPage) {
        propQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    

    // SellProp.find({ agent: agentId })  // Pronalazimo sve oglase kreirane od strane prijavljenog agenta
    propQuery
        .then(props => {
            if (props) {
                res.status(200).json({
                    message: 'Oglasi agenta uspešno dobijeni!',
                    sellProps: props
                });
            } else {
                res.status(404).json({ message: 'Agent nema oglasa!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Neuspešno dobavljanje oglasa agenta.',
                error: error
            });
        });
});

router.get('/', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const minCena = +req.query.minCena;
    const maxCena = +req.query.maxCena;
    const minPovrsina = +req.query.minPovrsina;
    const maxPovrsina = +req.query.maxPovrsina;
    const struktura = req.query.struktura;

    let query = {};

    // Build the query object based on the filters
    if (minCena || maxCena) {
        query.cena = {};
        if (minCena) query.cena.$gte = minCena;
        if (maxCena) query.cena.$lte = maxCena;
    }

    if (minPovrsina || maxPovrsina) {
        query.povrsina = {};
        if (minPovrsina) query.povrsina.$gte = minPovrsina;
        if (maxPovrsina) query.povrsina.$lte = maxPovrsina;
    }

    if (struktura) {
        query.struktura = struktura; // Add struktura to the query if provided
    }

    const propQuery = SellProp.find(query); // Use the query object

    let fetchedProps;

    if (pageSize && currentPage) {
        propQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    propQuery
        .then(documents => {
            fetchedProps = documents;
            return SellProp.countDocuments(query); // Count documents based on the same query
        })
        .then(count => {
            res.status(200).json({
                message: 'Properties fetched!',
                sellPorps: fetchedProps,
                maxProps: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Neuspešno dobavljanje oglasa!'
            });
        });
});


const upload = multer({storage: storage})

router.get('/:id', (req, res, next) => {
    SellProp.findById(req.params.id)
    .then(document => {
        if (document) {
            res.status(200).json({
                message: 'Property fetched!',
                sellProp: document
            })
        } else {
            res.status(404).json({message: 'Oglas nije pronadjen!'})
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Neuspešno dobavljanje oglasa!'
        })
    })
})

router.post('/', checkAuth, upload.array('slike', 20), (req, res, next) => {

    const url = req.protocol + '://' + req.get('host') // constructs url to our server

    const imagePaths = req.files.map(file => url + '/images/' + file.filename);

    const sellProp = new SellProp({
        naslov: req.body.naslov,
        tip: req.body.tip,
        struktura: req.body.struktura,
        grad: req.body.grad,
        naselje: req.body.naselje,
        adresa: req.body.adresa,
        povrsina: req.body.povrsina,
        cena: req.body.cena,
        spratovi: req.body.spratovi,
        sprat: req.body.sprat,
        lift: req.body.lift,
        grejanje: req.body.grejanje,
        namestenost: req.body.namestenost,
        uknjizenost: req.body.uknjizenost,
        slike: imagePaths,
        opis: req.body.opis,
        agent: req.agentData.agentId
    });

    sellProp.save()
    .then(newProp => {
        res.status(201).json({
            message: 'Property added!',
            sellProp: {
                ...newProp,
                _id: newProp._id,
            }
        })
    })
    .catch(error => {
        res.status(500).json({
            message: 'Kreiranje oglasa nije uspelo'
        })
    })
})


router.put('/:id', checkAuth, upload.array('slike', 20), (req, res, next) => {
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
        naslov: req.body.naslov,
        tip: req.body.tip,
        struktura: req.body.struktura,
        grad: req.body.grad,
        naselje: req.body.naselje,
        adresa: req.body.adresa,
        povrsina: req.body.povrsina,
        cena: req.body.cena,
        spratovi: req.body.spratovi,
        sprat: req.body.sprat,
        lift: req.body.lift,
        grejanje: req.body.grejanje,
        namestenost: req.body.namestenost,
        uknjizenost: req.body.uknjizenost,
        slike: updatedImages, // Combined image URLs
        opis: req.body.opis,
        agent: req.agentData.agentId
    };
  
    // Perform the update
    SellProp.updateOne({ _id: id, agent: req.agentData.agentId }, { $set: updatedProp })
      .then(result => {
        console.log(result);
        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Update successful!' });
        } else {
            res.status(401).json({ message: 'Not authorized!' });
        }
      })
      .catch(err => {
        res.status(500).json({ message: 'Greška prilikom izmene oglasa', error: err });
      });
  });



router.delete('/:id', checkAuth, (req, res, next) => {
    SellProp.deleteOne({_id: req.params.id, agent: req.agentData.agentId})
    .then((result) => {
        console.log(result);
        if (result.deletedCount > 0) {
            res.status(200).json({message: 'Property deleted!'})
        } else {
            res.status(401).json({ message: 'Not authorized!' });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Neuspešno brisanje oglasa!'
        })
    })
})


module.exports = router