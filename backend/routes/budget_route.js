const { validateAddBudget, validateEditBudget, validateDeleteBudget } = require('../validators/budget.validator')
const { addCategoryBudgetController, editCategoryBudgetController, deleteCategoryBudgetController, getMonthlyBudgetDataController, getCategoryWiseBudgetController, getYearlyDataController, getInsightsController } = require('../controllers/budget_controller')
const authentication = require('../middlewares/auth.middleware')
const express = require('express')
const budgetRouter = express.Router()

budgetRouter.post('/add-budget', authentication, validateAddBudget, addCategoryBudgetController)
budgetRouter.put('/edit-budget', authentication, validateEditBudget, editCategoryBudgetController)
budgetRouter.delete('/delete-budget', authentication, validateDeleteBudget, deleteCategoryBudgetController)
budgetRouter.get('/get-monthly-budget-data', authentication, getMonthlyBudgetDataController)
budgetRouter.get('/get-category-wise-budget', authentication, getCategoryWiseBudgetController)
budgetRouter.get('/get-yearly-data', authentication, getYearlyDataController)
budgetRouter.get('/get-insights', authentication, getInsightsController)

module.exports = budgetRouter


