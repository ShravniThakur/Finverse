const validator = require('validator')
const { expenseCategories, expenseTypes } = require('../constants/enums')

// add expense validator 
const addExpenseValidator = (req, res, next) => {
    try {
        let { title, category, type, amount } = req.body
        if (!title || !category || !type || !amount) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
        }
        title = title.trim()
        if(title.length < 2){
            return res.status(400).json({
                success: false,
                message: "Title should have atleast 2 characters!"
            })
        }
        if (!Number.isInteger(amount)) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a number!"
            })
        }
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be positive"
            })
        }
        const allowedCategories = expenseCategories.map((c) => { return c.name })
        const allowedTypes = expenseTypes.map((t) => { return t.name })

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid expense category!"
            })
        }
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid expense type!"
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
    addExpenseValidator
}
