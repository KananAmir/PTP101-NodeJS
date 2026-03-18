const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Authorization header missing or invalid'
            })
        }

        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        console.log(decoded);

        req.user = {
            ...decoded
        }

        next()
    }
    catch (error) {
        res.status(401).json({
            message: 'Unauthorized',
            error: error.message
        })
    }
}

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const { role } = req.user

            if (!allowedRoles.includes(role)) {
                return res.status(403).json({
                    message: 'Forbidden: You do not have permission to access this resource'
                })
            }
            
            next()
        }

        catch (error) {

            res.status(403).json({
                message: 'Forbidden',
                error: error.message
            })
        }
    }

}

module.exports = {
    authenticate,
    authorize
}

// RBAC (Role-Based Access Control)