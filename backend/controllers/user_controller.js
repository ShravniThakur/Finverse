const { signUpService, loginService, getProfileService, updateProfileService, changePasswordService } = require('../services/user_service')

// sign-up controller
const signUp = async (req, res) => {
    try {
        const token = await signUpService(req.body)
        return res.status(200).json({
            success: true,
            message: "User registered successfully!",
            token
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// login controller
const login = async (req, res) => {
    try {
        const token = await loginService(req.body)
        return res.status(200).json({
            success: true,
            message: "User logged in successfully!",
            token
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// get profile controller
const getProfile = async (req, res) => {
    try {
        const user = await getProfileService(req.user)
        return res.status(200).json({
            success: true,
            user
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// update profile controller
const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body
        const { id } = req.user
        const profilePic = req.file
        await updateProfileService({ id, name, email, profilePic })
        return res.status(200).json({
            success: true,
            message: "User profile updated successfully!"
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// change password controller
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const { id } = req.user
        await changePasswordService({ id, oldPassword, newPassword })
        return res.status(200).json({
            success: true,
            message: "Password Changed!"
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    signUp,
    login,
    getProfile,
    updateProfile,
    changePassword
}