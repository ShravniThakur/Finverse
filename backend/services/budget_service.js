const Budget = require('../models/Budget')
const Expense = require('../models/Expense')
const { expenseCategories } = require('../constants/enums')
const { mongo } = require('mongoose')

// add category budget service
const addCategoryBudgetService = async ({ id, month, year, category, totalBudget }) => {
    const duplicate = await Budget.findOne({ userID: id, month, year, category })
    if (duplicate) {
        throw new Error("You have already set a budget in this month for this category")
    }
    const date = new Date()
    if (year < date.getFullYear() || (year === date.getFullYear() && month < date.getMonth())) {
        throw new Error("You cannot add budgets for previous months")
    }
    await Budget.create({
        userID: id,
        month,
        year,
        category,
        totalBudget
    })
    return {
        message: "Budget created successfully!"
    }
}
// edit category budget service
const editCategoryBudgetService = async ({ id, month, year, category, newBudget }) => {
    const budget = await Budget.findOne({ userID: id, month, year, category })
    if (!budget) {
        throw new Error("Budget does not exist. You can create a new one!")
    }
    budget.totalBudget = newBudget
    await budget.save()
    return {
        message: "Budget edited successfully!"
    }
}
// delete category budget service
const deleteCategoryBudgetService = async ({ id, month, year, category }) => {
    const budget = await Budget.findOne({ userID: id, month, year, category })
    if (!budget) {
        throw new Error("Budget does not exist. You can create a new one!")
    }
    await Budget.deleteOne({ _id: budget._id })
    return {
        message: "Budget deleted successfully!"
    }
}
// get budget data service (this month)
const getMonthlyBudgetDataService = async ({ id }) => {
    let date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth()
    let startDate = new Date(y, m)
    let endDate = new Date(y, m + 1)

    const budgets = await Budget.find({ userID: id, month: m, year: y })
    const expenses = await Expense.find({ userID: id, date: { $gte: startDate, $lt: endDate } })

    let totalBudgets = 0
    let totalExpenses = 0
    let saved = 0

    for (let i = 0; i < budgets.length; i++) {
        totalBudgets += budgets[i].totalBudget
    }
    for (let i = 0; i < expenses.length; i++) {
        totalExpenses += expenses[i].amount
    }
    saved = totalBudgets - totalExpenses
    return {
        totalBudgets,
        totalExpenses,
        saved
    }
}

// get category wise budget service (this month)
const getCategoryWiseBudgetService = async ({ id }) => {
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth()
    let startDate = new Date(y, m)
    let endDate = new Date(y, m + 1)

    const budgets = await Budget.find({ userID: id, month: m, year: y })
    const expenses = await Expense.find({ userID: id, date: { $gte: startDate, $lt: endDate } })

    let categoryMap = {}
    for (let i = 0; i < expenseCategories.length; i++) {
        categoryMap[expenseCategories[i].name] = {
            emoji: expenseCategories[i].emoji,
            totalBudget: 0,
            totalExpense: 0,
            totalSaved: 0
        }
    }

    for (let i = 0; i < budgets.length; i++) {
        categoryMap[budgets[i].category].totalBudget = budgets[i].totalBudget
    }
    for (let i = 0; i < expenses.length; i++) {
        categoryMap[expenses[i].category].totalExpense += expenses[i].amount
    }

    let response = []
    for (let key in categoryMap) {
        let obj = {
            category: key,
            emoji: categoryMap[key].emoji,
            totalBudget: categoryMap[key].totalBudget,
            totalExpense: categoryMap[key].totalExpense,
            totalSaved: categoryMap[key].totalBudget - categoryMap[key].totalExpense,
        }
        response.push(obj)
    }
    return {
        response
    }
}
// all budgets data 
const getYearlyDataService = async ({ id, year }) => {

    const startDate = new Date(year, 0) // jan of this year
    const endDate = new Date(year + 1, 0) // jan of next year

    const budgets = await Budget.find({ userID: id, year })
    const expenses = await Expense.find({ userID: id, date: { $gte: startDate, $lt: endDate } })

    let data = []
    for (let m = 0; m < 12; m++) {
        let categoryMap = {}
        for (let i = 0; i < expenseCategories.length; i++) {
            categoryMap[expenseCategories[i].name] = {
                emoji: expenseCategories[i].emoji,
                totalBudget: 0,
                totalExpense: 0,
                totalSaved: 0
            }
        }

        for (let i = 0; i < budgets.length; i++) {
            if (budgets[i].month === m) {
                categoryMap[budgets[i].category].totalBudget = budgets[i].totalBudget
            }
        }
        for (let i = 0; i < expenses.length; i++) {
            if (expenses[i].date.getMonth() === m) {
                categoryMap[expenses[i].category].totalExpense += expenses[i].amount
            }
        }

        let response = []
        for (let key in categoryMap) {
            const value = categoryMap[key].totalBudget - categoryMap[key].totalExpense 
            let totalSaved = 0
            let overspent = 0
            if(value >=0 ) totalSaved = value
            else overspent = -value
            let obj = {
                category: key,
                emoji: categoryMap[key].emoji,
                totalBudget: categoryMap[key].totalBudget,
                totalExpense: categoryMap[key].totalExpense,
                totalSaved,
                overspent
            }
            response.push(obj)
        }
        data.push({
            m,
            response
        })
    }
    return data
}

// get insights service
const getInsightsService = async ({ id }) => {
    const { response } = await getCategoryWiseBudgetService({ id })
    const { totalBudgets, totalExpenses } = await getMonthlyBudgetDataService({ id })

    let insights = []

    for (let i = 0; i < response.length; i++) {

        if (response[i].totalBudget === 0 && response[i].totalExpense > 0) {
            insights.push({
                type: "Unplanned",
                message: `You have spent Rs. ${response[i].totalExpense} on ${response[i].category} without setting a budget!`
            })
        }
        else if (response[i].totalBudget > 0 && response[i].totalExpense > response[i].totalBudget) {
            insights.push({
                type: "Overspent",
                message: `${response[i].category} exceeded the budget by Rs. ${response[i].totalExpense - response[i].totalBudget}`
            })
        }
        else if (response[i].totalBudget > 0 && response[i].totalExpense <= (response[i].totalBudget * (0.8))) {
            insights.push({
                type: "Controlled",
                message: `${response[i].category} is controlled!`
            })
        }
        else if (response[i].totalBudget > 0 && response[i].totalExpense > (response[i].totalBudget * (0.8))) {
            insights.push({
                type: "Critical",
                message: `${response[i].category} is in the critical spending zone! Try to control the expenses!`
            })
        }
    }
    let healthscore = 0
    if (totalBudgets > 0) {
        healthscore = 100 - ((totalExpenses / totalBudgets) * 100)
    }
    return {
        insights,
        healthscore,   
    }
}

module.exports = {
    addCategoryBudgetService,
    editCategoryBudgetService,
    deleteCategoryBudgetService,
    getMonthlyBudgetDataService,
    getCategoryWiseBudgetService,
    getYearlyDataService,
    getInsightsService
}
