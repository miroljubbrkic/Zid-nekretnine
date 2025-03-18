const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const checkAuth = require('../middleware/check-auth')
const Agent = require('../models/agent')



const router = express.Router()





router.post('/signup', (req, res, next) => {
    console.log(req.body);
    bcrypt.hash(req.body.lozinka, 10).then(hash => {

        const agent = new Agent({
            email: req.body.email,
            lozinka: hash,
            ime: req.body.ime,
            prezime: req.body.prezime,
            telefon: req.body.telefon
        })

        agent.save()
            .then(result => {
                res.status(201).json({
                    message: 'Agent created',
                    result: result
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Podaci nisu validni'
                })
            })
    })
    
})



router.post('/login', (req, res, next) => {
    let fetchedAgent
    Agent.findOne({email: req.body.email})
        .then(agent => {
            if (!agent) {
                return res.status(401).json({
                    message: 'Prijava neuspešna!'
                })
            }

            fetchedAgent = agent
            console.log(fetchedAgent);

            return bcrypt.compare(req.body.lozinka, agent.lozinka)
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Prijava neuspešna'
                })
            }

            const token = jwt.sign(
                {email: fetchedAgent.email, agentId: fetchedAgent._id}, 
                'super_strong_secret', 
                {expiresIn: '1h'}
            )

            res.status(200).json({
                message: 'Agent authenticated',
                token: token,
                expiresIn: 3600,
                agentId: fetchedAgent._id
            })

        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                message: 'Podaci nisu validni'
            })
        })
})


// Fetch agent by ID
router.get('/:id', (req, res, next) => {
    Agent.findById(req.params.id)
      .then(agent => {
        if (agent) {
          res.status(200).json({
            message: 'Agent details fetched successfully',
            agent: agent
          });
        } else {
          res.status(404).json({ message: 'Agent not found' });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: 'Failed to fetch agent details',
          error: error
        });
      });
  });
  
router.put('/:id', checkAuth, (req, res, next) => {
    const agentId = req.params.id;
    const updatedAgentData = {
        ime: req.body.ime,
        prezime: req.body.prezime,
        email: req.body.email,
        telefon: req.body.telefon,
    };

    Agent.updateOne({ _id: agentId, _id: req.agentData.agentId }, updatedAgentData)
        .then((result) => {
            if (result.matchedCount > 0) {
                res.status(200).json({ message: 'Agent updated successfully!' });
            } else {
                res.status(401).json({ message: 'Not authorized!' });
            }
            })
        .catch((error) => {
            res.status(500).json({
                message: 'Failed to update agent!',
                error: error,
            });
        });
});


module.exports = router