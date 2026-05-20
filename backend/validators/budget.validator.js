const { expenseCategories } = require('../constants/enums')

// add budget validator
const validateAddBudget = (req, res, next) => {
    try {
        const { month, year, category, totalBudget } = req.body
        if (month === undefined || year === undefined || !category || totalBudget == null) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
        }
        if (!Number.isInteger(month) || !Number.isInteger(year) || !Number.isInteger(totalBudget)) {
            return res.status(400).json({
                success: false,
                message: "Month, year and total budget must be numbers!"
            })
        }
        if (month < 0 || month > 11) {
            return res.status(400).json({
                success: false,
                message: "Month must be between 0-11!"
            })
        }
        if (totalBudget <= 0) {
            return res.status(400).json({
                success: false,
                message: "Total budget must be positive!"
            })
        }
        const allowedCategories = expenseCategories.map((e) => e.name)
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid expense category!"
            })
        }
        next()
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// edit budget valiator
const validateEditBudget = (req, res, next) => {
    try {
        const { month, year, category, newBudget } = req.body
        if (month === undefined || year === undefined || !category || newBudget == null) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
        }
        if (!Number.isInteger(month) || !Number.isInteger(year) || !Number.isInteger(newBudget)) {
            return res.status(400).json({
                success: false,
                message: "Month, year and new budget must be numbers!"
            })
        }
        if (month < 0 || month > 11) {
            return res.status(400).json({
                success: false,
                message: "Month must be between 0-11!"
            })
        }
        if (newBudget <= 0) {
            return res.status(400).json({
                success: false,
                message: "New budget must be positive!"
            })
        }
        const allowedCategories = expenseCategories.map((e) => e.name)
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid expense category!"
            })
        }
        next()
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
const validateDeleteBudget = (req,res, next) => {
    try{
        const { month, year, category } = req.body
        if (month === undefined || year === undefined || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
        }
        if (!Number.isInteger(month) || !Number.isInteger(year)) {
            return res.status(400).json({
                success: false,
                message: "Month and year must be numbers!"
            })
        }
        if (month < 0 || month > 11) {
            return res.status(400).json({
                success: false,
                message: "Month must be between 0-11!"
            })
        }
        const allowedCategories = expenseCategories.map((e) => e.name)
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid expense category!"
            })
        }
        next()
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
module.exports = {
    validateAddBudget,
    validateEditBudget,
    validateDeleteBudget
}