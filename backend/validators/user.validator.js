const validator = require('validator')

// sign-up validator 
const validateSignUp = (req, res, next) => {
    try {
        let { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email id!"
            })
        }
        name = name.trim()

        if (name.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Please enter atleast 2 characters!"
            })
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a strong password. A strong password contains atleast one lowercase character, uppercase character, number, and a symbol."
            })
        }
        next()
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// login validator
const validateLogin = (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email id!"
            })
        }
        next()
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// update profile validator
const validateProfile = (req, res, next) => {
    try {
        let { name, email } = req.body
        
        if(name) name = name.trim()
        if (name && name.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Please enter atleast 2 characters!"
            })
        }
        if (email && !validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email id!"
            })
        }
        next()
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// change password validator
const validateChangePassword = (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
        }
        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a strong password. A strong password contains atleast one lowercase character, uppercase character, number, and a symbol."
            })
        }
        next()
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    validateSignUp,
    validateLogin,
    validateProfile,
    validateChangePassword
}