const { addExpenseService, getExpenseDataService, getExpenseListService, getMonthlyExpensesService, getCategoryExpensesService } = require('../services/expense_service')

// add expense controller
const addExpenseController = async (req, res) => {
    try {
        const { id } = req.user
        const { title, category, type, amount } = req.body
        const { message } = await addExpenseService({ id, title, category, type, amount })
        return res.status(200).json({
            success: true,
            message: message
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
// get expense data controller
const getExpenseDataController = async (req, res) => {
    try {
        const { id } = req.user
        const { totalExpense, cashExpense, walletExpense } = await getExpenseDataService({ id })
        return res.status(200).json({
            success: true,
            totalExpense,
            walletExpense,
            cashExpense
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
// get expense list controller
const getExpenseListController = async (req, res) => {
    try {
        const { id } = req.user
        const response = await getExpenseListService({ id })
        return res.status(200).json({
            success: true,
            response
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
// get monthly expenses controller
const getMonthlyExpensesController = async (req, res) => {
    try {
        const { id } = req.user
        const year = Number(req.query.year) || new Date().getFullYear()
        const monthly = await getMonthlyExpensesService({ id, year })
        return res.status(200).json({
            success: true,
            monthly
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
// get category expenses controller
const getCategoryExpensesController = async (req, res) => {
    try {
        const { id } = req.user
        const categoryExpenses = await getCategoryExpensesService({ id })
        return res.status(200).json({
            success: true,
            categoryExpenses
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
    addExpenseController,
    getExpenseDataController,
    getExpenseListController,
    getMonthlyExpensesController,
    getCategoryExpensesController
}