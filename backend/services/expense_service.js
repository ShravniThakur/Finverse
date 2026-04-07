const { expenseCategories, expenseTypes } = require('../constants/enums')
const Wallet = require('../models/Wallet')
const Expense = require('../models/Expense')
const Transaction = require('../models/Transaction')
const mongoose = require('mongoose')
const { max_transaction_amount } = require('../constants/limits')

// add expense service
const addExpenseService = async ({ id, title, category, type, amount }) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        // expense model
        const expense = new Expense({
            userID: id,
            date: new Date(),
            title: title,
            category: category,
            type: type,
            amount: amount
        })
        await expense.save({ session })

        // wallet model
        if (type === "Wallet") {
            const wallet = await Wallet.findOne({ userID: id }).session(session)
            if (!wallet) {
                throw new Error("Wallet not found!")
            }
            if (amount > wallet.balance) {
                throw new Error("Insufficient balance!")
            }
            if (amount > max_transaction_amount){
                throw new Error(`Max transaction amount is ${max_transaction_amount}`)
            }
            wallet.balance -= amount
            wallet.transactions.push({
                date: new Date(),
                title: title,
                category: "Expense",
                type: "Debit",
                amount: amount,
                status: "Completed"
            })
            await wallet.save({ session })

            await Transaction.create([
                // wallet transaction
                {
                    userID: id,
                    walletID: wallet._id,
                    date: new Date(),
                    title: title,
                    source: "Wallet",
                    category: "Expense",
                    type: "Debit",
                    amount: amount,
                    status: "Completed"
                },
                // expense wallet transaction
                {
                    userID: id,
                    expenseID: expense._id,
                    date: new Date(),
                    title: title,
                    source: "Expense",
                    category: category,
                    type: type,
                    amount: amount,
                    status: "Not Applicable"
                }],
                {
                    session,
                    ordered: true
                })

        }
        // expense cash transaction 
        else {
            await Transaction.create([{
                userID: id,
                expenseID: expense._id,
                date: new Date(),
                title: title,
                source: "Expense",
                category: category,
                type: type,
                amount: amount,
                status: "Not Applicable"
            }], { session })
        }

        await session.commitTransaction()
        session.endSession()

        return {
            message: "Expense added!"
        }
    }
    catch (err) {
        await session.abortTransaction()
        session.endSession()
        throw err
    }
}
// get expense data service
const getExpenseDataService = async ({ id }) => {
    const expenses = await Expense.find({ userID: id })

    if (expenses.length === 0) {
        return {
            totalExpense: 0,
            cashExpense: 0,
            walletExpense: 0
        }
    }
    let totalExpense = 0
    let cashExpense = 0
    let walletExpense = 0
    for (let i = 0; i < expenses.length; i++) {
        totalExpense += expenses[i].amount
        if (expenses[i].type === "Wallet") walletExpense += expenses[i].amount
        else cashExpense += expenses[i].amount
    }
    return {
        totalExpense,
        cashExpense,
        walletExpense
    }
}
// expense list service
const getExpenseListService = async ({ id }) => {
    const expense = await Expense.find({ userID: id })

    let categoryMap = {}
    let typesMap = {}
    for (let i = 0; i < expenseCategories.length; i++) categoryMap[expenseCategories[i].name] = expenseCategories[i].emoji
    for (let i = 0; i < expenseTypes.length; i++) typesMap[expenseTypes[i].name] = expenseTypes[i].emoji

    let response = []
    for (let i = 0; i < expense.length; i++) {
        let obj = {
            date: expense[i].date,
            title: expense[i].title,
            category: expense[i].category,
            categoryEmoji: categoryMap[expense[i].category],
            type: expense[i].type,
            typeEmoji: typesMap[expense[i].type],
            amount: expense[i].amount
        }
        response.push(obj)
    }
    return response
}
// monthly expenses service
const getMonthlyExpensesService = async ({ id, year }) => {
    const expense = await Expense.find({ userID: id })

    let yearly = []
    for (let i = 0; i < expense.length; i++) {
        if (expense[i].date.getFullYear() === year) yearly.push(expense[i])
    }
    let monthly = [
        { month: "Jan", totalExpense: 0, cashExpense: 0, walletExpense: 0 },
        { month: "Feb", totalExpense: 0, cashExpense: 0, walletExpense: 0 },
        { month: "Mar", totalExpense: 0, cashExpense: 0, walletExpense: 0 },
        { month: "Apr", totalExpense: 0, cashExpense: 0, walletExpense: 0 },
        { month: "May", totalExpense: 0, cashExpense: 0, walletExpense: 0 },
        { month: "June", totalExpense: 0, cashExpense: 0, walletExpense: 0 },
        { month: "July", totalExpense: 0, cashExpense: 0, walletExpense: 0 },
        { month: "Aug", totalExpense: 0, cashExpense: 0, walletExpense: 0 },
        { month: "Sep", totalExpense: 0, cashExpense: 0, walletExpense: 0 },
        { month: "Oct", totalExpense: 0, cashExpense: 0, walletExpense: 0 },
        { month: "Nov", totalExpense: 0, cashExpense: 0, walletExpense: 0 },
        { month: "Dec", totalExpense: 0, cashExpense: 0, walletExpense: 0 },
    ]
    for (let i = 0; i < yearly.length; i++) {
        let idx = yearly[i].date.getMonth()
        monthly[idx].totalExpense += yearly[i].amount
        if (yearly[i].type === "Wallet") monthly[idx].walletExpense += yearly[i].amount
        else monthly[idx].cashExpense += yearly[i].amount
    }
    return monthly
}
// category expenses service
const getCategoryExpensesService = async ({ id }) => {
    const expense = await Expense.find({ userID: id })

    let categoryExpenses = []
    for (let i = 0; i < expenseCategories.length; i++) {
        categoryExpenses.push({
            name: expenseCategories[i].name,
            emoji: expenseCategories[i].emoji,
            amount: 0
        })
    }
    for (let i = 0; i < categoryExpenses.length; i++) {
        const arr = expense.filter((e) => { return e.category === categoryExpenses[i].name })
        for (let j = 0; j < arr.length; j++) categoryExpenses[i].amount += arr[j].amount
    }

    return categoryExpenses
}

module.exports = {
    addExpenseService,
    getExpenseDataService,
    getExpenseListService,
    getMonthlyExpensesService,
    getCategoryExpensesService
}
