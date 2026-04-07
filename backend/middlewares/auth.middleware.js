const jwt = require('jsonwebtoken')

// user authentication 
const authentication = (req, res, next) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized!"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            id: decoded.id
        }
        next()
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token!"
        })
    }
}

module.exports = authentication
