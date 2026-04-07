const validator = require('validator')
const {max_transaction_amount} = require('../constants/limits')

// add money validator 
const addMoneyValidator = (req, res, next) => {
    try {
        const { amount } = req.body
        if (amount == null) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
        }
        if (!Number.isInteger(amount)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a number!"
            })
        }
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be positive!"
            })
        }
        if (amount > max_transaction_amount) {
            return res.status(400).json({
                success: false,
                message: `Max transaction amount is Rs. ${max_transaction_amount}!`
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

// send money validator
const sendMoneyValidator = (req, res, next) => {
    try {
        const { amount, recipient } = req.body
        if (amount == null || !recipient) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
        }
        if (!Number.isInteger(amount)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a number!"
            })
        }
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be positive!"
            })
        }
        if (amount > max_transaction_amount) {
            return res.status(400).json({
                success: false,
                message: `Max transaction amount is Rs. ${max_transaction_amount}!`
            })
        }
        if (!validator.isEmail(recipient)) {
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

// pin validator
const pinValidator = (req, res, next) => {
    try {
        const { walletPin } = req.body
        if (!walletPin) {
            return res.status(400).json({
                success: false,
                message: "Please enter a pin!"
            })
        }
        const pin = walletPin.toString()

        if (pin.length !== 6 || !validator.isNumeric(pin)) {
            return res.status(400).json({
                success: false,
                message: "Pin must have exactly 6 numbers!"
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
    addMoneyValidator,
    sendMoneyValidator,
    pinValidator
}
