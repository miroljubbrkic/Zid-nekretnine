const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, 'super_strong_secret')
        req.agentData = {email: decodedToken.email, agentId: decodedToken.agentId}
        next()

    } catch (error) {
        res.status(401).json({
            message: 'You are not authenticated!'
        })
    }
}