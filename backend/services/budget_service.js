const Budget = require('../models/Budget')
const Expense = require('../models/Expense')
const { expenseCategories } = require('../constants/enums')

// Helper: build a category map seeded with zeroes so every category is always present
const seedCategoryMap = () => {
    const map = {}
    for (const c of expenseCategories) {
        map[c.name] = { emoji: c.emoji, totalBudget: 0, totalExpense: 0 }
    }
    return map
}

// add category budget service
const addCategoryBudgetService = async ({ id, month, year, category, totalBudget }) => {
    const duplicate = await Budget.findOne({ userID: id, month, year, category })
    if (duplicate) throw new Error("You have already set a budget in this month for this category")
    const date = new Date()
    if (year < date.getFullYear() || (year === date.getFullYear() && month < date.getMonth())) {
        throw new Error("You cannot add budgets for previous months")
    }
    await Budget.create({ userID: id, month, year, category, totalBudget })
    return { message: "Budget created successfully!" }
}

// edit category budget service
const editCategoryBudgetService = async ({ id, month, year, category, newBudget }) => {
    const budget = await Budget.findOne({ userID: id, month, year, category })
    if (!budget) throw new Error("Budget does not exist. You can create a new one!")
    budget.totalBudget = newBudget
    await budget.save()
    return { message: "Budget edited successfully!" }
}

// delete category budget service
const deleteCategoryBudgetService = async ({ id, month, year, category }) => {
    const budget = await Budget.findOne({ userID: id, month, year, category })
    if (!budget) throw new Error("Budget does not exist. You can create a new one!")
    await Budget.deleteOne({ _id: budget._id })
    return { message: "Budget deleted successfully!" }
}

// monthly budget summary — both totals aggregated in DB
const getMonthlyBudgetDataService = async ({ id }) => {
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth()
    const startDate = new Date(y, m)
    const endDate   = new Date(y, m + 1)

    const [[budgetResult], [expenseResult]] = await Promise.all([
        Budget.aggregate([
            { $match: { userID: id, month: m, year: y } },
            { $group: { _id: null, totalBudgets: { $sum: '$totalBudget' } } }
        ]),
        Expense.aggregate([
            { $match: { userID: id, date: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: null, totalExpenses: { $sum: '$amount' } } }
        ])
    ])

    const totalBudgets  = budgetResult?.totalBudgets   ?? 0
    const totalExpenses = expenseResult?.totalExpenses ?? 0
    return { totalBudgets, totalExpenses, saved: totalBudgets - totalExpenses }
}

// category-wise budget for current month — expense totals aggregated in DB
const getCategoryWiseBudgetService = async ({ id }) => {
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth()
    const startDate = new Date(y, m)
    const endDate   = new Date(y, m + 1)

    const [budgets, expResults] = await Promise.all([
        Budget.find({ userID: id, month: m, year: y }).lean(),
        Expense.aggregate([
            { $match: { userID: id, date: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: '$category', totalExpense: { $sum: '$amount' } } }
        ])
    ])

    const categoryMap = seedCategoryMap()
    for (const b of budgets)    categoryMap[b.category].totalBudget  = b.totalBudget
    for (const r of expResults) categoryMap[r._id].totalExpense      = r.totalExpense

    const response = Object.entries(categoryMap).map(([category, v]) => ({
        category,
        emoji:        v.emoji,
        totalBudget:  v.totalBudget,
        totalExpense: v.totalExpense,
        totalSaved:   v.totalBudget - v.totalExpense
    }))
    return { response }
}

// yearly data — single aggregation per collection, lookup in JS maps
const getYearlyDataService = async ({ id, year }) => {
    const startDate = new Date(year, 0)
    const endDate   = new Date(year + 1, 0)

    // One query each — no per-month DB round trips
    const [budgets, expResults] = await Promise.all([
        Budget.find({ userID: id, year }).lean(),
        Expense.aggregate([
            { $match: { userID: id, date: { $gte: startDate, $lt: endDate } } },
            {
                $group: {
                    _id: { month: { $month: '$date' }, category: '$category' },
                    totalExpense: { $sum: '$amount' }
                }
            }
        ])
    ])

    // Build flat lookup maps keyed by "month:category"
    const budgetMap  = {}   // "m:category"  -> totalBudget  (m is 0-based)
    const expenseMap = {}   // "m:category"  -> totalExpense (m is 0-based)

    for (const b of budgets) {
        budgetMap[`${b.month}:${b.category}`] = b.totalBudget
    }
    for (const r of expResults) {
        // $month returns 1-based; convert to 0-based
        expenseMap[`${r._id.month - 1}:${r._id.category}`] = r.totalExpense
    }

    // Assemble response — only JS work remaining is building the output shape
    const data = []
    for (let m = 0; m < 12; m++) {
        const response = expenseCategories.map(c => {
            const totalBudget  = budgetMap[`${m}:${c.name}`]  ?? 0
            const totalExpense = expenseMap[`${m}:${c.name}`] ?? 0
            const diff = totalBudget - totalExpense
            return {
                category:    c.name,
                emoji:       c.emoji,
                totalBudget,
                totalExpense,
                totalSaved:  diff >= 0 ? diff : 0,
                overspent:   diff < 0  ? -diff : 0
            }
        })
        data.push({ m, response })
    }
    return data
}

// insights — reuses fixed helpers above, no extra DB hits
const getInsightsService = async ({ id }) => {
    const [{ response }, { totalBudgets, totalExpenses }] = await Promise.all([
        getCategoryWiseBudgetService({ id }),
        getMonthlyBudgetDataService({ id })
    ])

    const insights = []
    for (const r of response) {
        if (r.totalBudget === 0 && r.totalExpense > 0) {
            insights.push({ type: "Unplanned", message: `You have spent Rs. ${r.totalExpense} on ${r.category} without setting a budget!` })
        } else if (r.totalBudget > 0 && r.totalExpense > r.totalBudget) {
            insights.push({ type: "Overspent", message: `${r.category} exceeded the budget by Rs. ${r.totalExpense - r.totalBudget}` })
        } else if (r.totalBudget > 0 && r.totalExpense <= r.totalBudget * 0.8) {
            insights.push({ type: "Controlled", message: `${r.category} is controlled!` })
        } else if (r.totalBudget > 0 && r.totalExpense > r.totalBudget * 0.8) {
            insights.push({ type: "Critical", message: `${r.category} is in the critical spending zone! Try to control the expenses!` })
        }
    }

    const healthscore = totalBudgets > 0
        ? 100 - (totalExpenses / totalBudgets) * 100
        : 0

    return { insights, healthscore }
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
