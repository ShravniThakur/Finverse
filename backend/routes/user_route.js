const { validateSignUp, validateLogin, validateProfile, validateChangePassword } = require('../validators/user.validator')
const { signUp, login, getProfile, updateProfile, changePassword } = require('../controllers/user_controller')
const authentication = require('../middlewares/auth.middleware')
const uploads = require('../middlewares/uploads.middleware')
const express = require('express')
const userRouter = express.Router()

userRouter.post('/sign-up', validateSignUp, signUp)
userRouter.post('/login', validateLogin, login)
userRouter.get('/get-profile', authentication, getProfile)
userRouter.post('/update-profile', authentication, uploads.single('profilePic'), validateProfile, updateProfile)
userRouter.post('/change-password', authentication, validateChangePassword, changePassword)

module.exports = userRouter
