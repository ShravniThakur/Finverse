const { getBalanceService, setPinService, addMoneyService, sendMoneyService, getDataService, getMonthlyDataService, getWalletTransactionsService } = require('../services/wallet_service')

// get balance controller
const getBalanceController = async (req, res) => {
    try {
        const { balance, isLow } = await getBalanceService(req.user)
        return res.status(200).json({
            success: true,
            balance,
            isLow
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
// set pin controller
const setPinController = async (req, res) => {
    try {
        const { id } = req.user
        const { walletPin } = req.body
        const { message } = await setPinService({ id, walletPin })
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
// add money controller
const addMoneyController = async (req, res) => {
    try {
        const { id } = req.user
        const { amount } = req.body
        const { message } = await addMoneyService({ id, amount })
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
// send money controller
const sendMoneyController = async (req, res) => {
    try {
        const { id } = req.user
        const { walletPin, amount, recipient } = req.body
        const { message } = await sendMoneyService({ id, amount, recipient, walletPin })
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
// get data controller
const getDataController = async (req, res) => {
    try {
        const { credit, debit } = await getDataService(req.user)
        return res.status(200).json({
            success: true,
            credit,
            debit
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
// get monthly data controller
const getMonthlyDataController = async (req, res) => {
    try {
        const { id } = req.user
        const year = Number(req.query.year) || new Date().getFullYear()
        const { monthly } = await getMonthlyDataService({ id, year })
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
// get wallet transactions controller
const getWalletTransactionsController = async (req, res) => {
    try {
        const { id } = req.user
        const response = await getWalletTransactionsService({ id })
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
module.exports = {
    getBalanceController,
    setPinController,
    addMoneyController,
    sendMoneyController,
    getDataController,
    getMonthlyDataController,
    getWalletTransactionsController
}