const { addExpenseController, getExpenseDataController, getExpenseListController, getMonthlyExpensesController, getCategoryExpensesController } = require('../controllers/expense_controller')
const { addExpenseValidator } = require('../validators/expense.validator')
const authentication = require('../middlewares/auth.middleware')
const express = require('express')
const expenseRouter = express.Router()

expenseRouter.post('/add-expense', authentication, addExpenseValidator, addExpenseController)
expenseRouter.get('/get-expense-data', authentication, getExpenseDataController)
expenseRouter.get('/get-expense-list', authentication, getExpenseListController)
expenseRouter.get('/get-monthly-expenses', authentication, getMonthlyExpensesController)
expenseRouter.get('/get-category-expenses', authentication, getCategoryExpensesController)

module.exports = expenseRouter
