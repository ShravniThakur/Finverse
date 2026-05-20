const { expenseCategories, expenseTypes } = require('../constants/enums')
const Wallet = require('../models/Wallet')
const WalletTransaction = require('../models/WalletTransaction')
const Expense = require('../models/Expense')
const mongoose = require('mongoose')
const { max_transaction_amount } = require('../constants/limits')

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"]

// add expense service
const addExpenseService = async ({ id, title, category, type, amount }) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const expense = new Expense({ userID: id, date: new Date(), title, category, type, amount })
        await expense.save({ session })
        if (type === "Wallet") {
            const wallet = await Wallet.findOne({ userID: id }).session(session)
            if (!wallet) throw new Error("Wallet not found!")
            if (amount > wallet.balance) throw new Error("Insufficient balance!")
            if (amount > max_transaction_amount) throw new Error(`Max transaction amount is ${max_transaction_amount}`)
            wallet.balance -= amount
            await wallet.save({ session })
            await WalletTransaction.create([{
                walletID: wallet._id, userID: id, date: new Date(),
                title, category: "Expense", type: "Debit",
                amount, status: "Completed", source: "Wallet"
            }], { session })
        }
        await session.commitTransaction()
        session.endSession()
        return { message: "Expense added!" }
    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        throw err
    }
}

// total expense split by type — aggregated in DB
const getExpenseDataService = async ({ id }) => {
    const [result] = await Expense.aggregate([
        { $match: { userID: id } },
        {
            $group: {
                _id: null,
                totalExpense:  { $sum: '$amount' },
                cashExpense:   { $sum: { $cond: [{ $eq: ['$type', 'Cash'] },   '$amount', 0] } },
                walletExpense: { $sum: { $cond: [{ $eq: ['$type', 'Wallet'] }, '$amount', 0] } }
            }
        }
    ])
    return result
        ? { totalExpense: result.totalExpense, cashExpense: result.cashExpense, walletExpense: result.walletExpense }
        : { totalExpense: 0, cashExpense: 0, walletExpense: 0 }
}

// expense list — sort and field projection pushed to DB
const getExpenseListService = async ({ id }) => {
    const categoryMap = {}
    const typesMap = {}
    for (const c of expenseCategories) categoryMap[c.name] = c.emoji
    for (const t of expenseTypes)      typesMap[t.name]    = t.emoji

    const expenses = await Expense
        .find({ userID: id })
        .sort({ date: -1 })
        .select('date title category type amount')
        .lean()

    return expenses.map(e => ({
        date:          e.date,
        title:         e.title,
        category:      e.category,
        categoryEmoji: categoryMap[e.category],
        type:          e.type,
        typeEmoji:     typesMap[e.type],
        amount:        e.amount
    }))
}

// monthly expenses — grouped by month in DB, zero-filled in JS only for missing months
const getMonthlyExpensesService = async ({ id, year }) => {
    const results = await Expense.aggregate([
        {
            $match: {
                userID: id,
                date: { $gte: new Date(year, 0), $lt: new Date(year + 1, 0) }
            }
        },
        {
            $group: {
                _id: { $month: '$date' },   // 1–12
                totalExpense:  { $sum: '$amount' },
                cashExpense:   { $sum: { $cond: [{ $eq: ['$type', 'Cash'] },   '$amount', 0] } },
                walletExpense: { $sum: { $cond: [{ $eq: ['$type', 'Wallet'] }, '$amount', 0] } }
            }
        }
    ])

    const monthly = MONTH_NAMES.map(month => ({ month, totalExpense: 0, cashExpense: 0, walletExpense: 0 }))
    for (const r of results) {
        monthly[r._id - 1].totalExpense  = r.totalExpense
        monthly[r._id - 1].cashExpense   = r.cashExpense
        monthly[r._id - 1].walletExpense = r.walletExpense
    }
    return monthly
}

// category totals — grouped in DB, merged with enum list in JS
const getCategoryExpensesService = async ({ id }) => {
    const results = await Expense.aggregate([
        { $match: { userID: id } },
        { $group: { _id: '$category', amount: { $sum: '$amount' } } }
    ])

    const amountMap = {}
    for (const r of results) amountMap[r._id] = r.amount

    return expenseCategories.map(c => ({
        name:   c.name,
        emoji:  c.emoji,
        amount: amountMap[c.name] ?? 0
    }))
}

module.exports = {
    addExpenseService,
    getExpenseDataService,
    getExpenseListService,
    getMonthlyExpensesService,
    getCategoryExpensesService
}
