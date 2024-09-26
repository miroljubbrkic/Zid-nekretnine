const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
                    error: err
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
                    message: 'Auth failed'
                })
            }

            fetchedAgent = agent

            return bcrypt.compare(req.body.lozinka, agent.lozinka)
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Auth failed'
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
                message: 'Auth failed'
            })
        })
})



module.exports = router