const { addCategoryBudgetService, editCategoryBudgetService, deleteCategoryBudgetService, getMonthlyBudgetDataService, getCategoryWiseBudgetService, getYearlyDataService, getInsightsService } = require('../services/budget_service')

// add category budget controller
const addCategoryBudgetController = async (req, res) => {
    try {
        const { id } = req.user
        const { month, year, category, totalBudget } = req.body
        const { message } = await addCategoryBudgetService({ id, month, year, category, totalBudget })
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
// edit category budget controller
const editCategoryBudgetController = async (req, res) => {
    try {
        const { id } = req.user
        const { month, year, category, newBudget } = req.body
        const { message } = await editCategoryBudgetService({ id, month, year, category, newBudget })
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
// delete category budget controller
const deleteCategoryBudgetController = async (req, res) => {
    try {
        const { id } = req.user
        const { month, year, category } = req.body
        const { message } = await deleteCategoryBudgetService({ id, month, year, category })
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
// get monthly budget data controller
const getMonthlyBudgetDataController = async (req, res) => {
    try {
        const { id } = req.user
        const { totalBudgets, totalExpenses, saved } = await getMonthlyBudgetDataService({ id })
        return res.status(200).json({
            success: true,
            totalBudgets,
            totalExpenses,
            saved
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
// get category wise budget controller
const getCategoryWiseBudgetController = async (req, res) => {
    try {
        const { id } = req.user
        const { response } = await getCategoryWiseBudgetService({ id })
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
// get yearly data controller
const getYearlyDataController = async (req, res) => {
    try {
        const { id } = req.user
        const year = Number(req.query.year) || new Date().getFullYear()
        const data = await getYearlyDataService({ id, year })
        return res.status(200).json({
            success: true,
            data
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
// get insights service 
const getInsightsController = async (req, res) => {
    try {
        const { id } = req.user
        const { insights, healthscore } = await getInsightsService({ id })
        return res.status(200).json({
            success: true,
            insights,
            healthscore
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
    addCategoryBudgetController,
    editCategoryBudgetController,
    deleteCategoryBudgetController,
    getMonthlyBudgetDataController,
    getCategoryWiseBudgetController,
    getYearlyDataController,
    getInsightsController
}
