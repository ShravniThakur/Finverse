const { allTransactionsController } = require('../controllers/transaction_controller')
const authentication = require('../middlewares/auth.middleware')
const { validateAllTransactions } = require('../validators/transaction.validator')
const express = require('express')
const transactionRouter = express.Router()

transactionRouter.get('/all-transactions', authentication, validateAllTransactions, allTransactionsController)

module.exports = transactionRouter