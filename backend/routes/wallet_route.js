const { addMoneyValidator, sendMoneyValidator, pinValidator } = require('../validators/wallet.validator')
const { getBalanceController, setPinController, addMoneyController, sendMoneyController, getDataController, getMonthlyDataController, getWalletTransactionsController } = require('../controllers/wallet_controller')
const authentication = require('../middlewares/auth.middleware')
const express = require('express')
const walletRouter = express.Router()

walletRouter.get('/get-balance', authentication, getBalanceController)
walletRouter.post('/set-pin', authentication, pinValidator, setPinController)
walletRouter.post('/add-money', authentication, addMoneyValidator, addMoneyController)
walletRouter.post('/send-money', authentication, pinValidator, sendMoneyValidator, sendMoneyController)
walletRouter.get('/get-data', authentication, getDataController)
walletRouter.get('/get-monthly-data', authentication, getMonthlyDataController)
walletRouter.get('/get-transactions', authentication, getWalletTransactionsController)

module.exports = walletRouter

