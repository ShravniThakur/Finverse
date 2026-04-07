const { walletCategories, walletTypes } = require('../constants/enums')
const Wallet = require('../models/Wallet')
const User = require('../models/User')
const Transaction = require('../models/Transaction')
const max_transaction_amount = require('../constants/limits')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// get balance service
const getBalanceService = async ({ id }) => {
    const wallet = await Wallet.findOne({ userID: id })
    if (!wallet) {
        throw new Error("Wallet not found!")
    }
    return {
        balance: wallet.balance,
        isLow: wallet.balance <= wallet.lowBalanceThreshold
    }
}

// set pin service
const setPinService = async ({ id, walletPin }) => {
    const wallet = await Wallet.findOne({ userID: id })
    if (!wallet) {
        throw new Error("Wallet not found!")
    }
    if (wallet.isPinSet) {
        throw new Error("Wallet PIN already set!")
    }
    const hashPin = await bcrypt.hash(walletPin, 10)
    wallet.walletPin = hashPin
    wallet.isPinSet = true
    await wallet.save()

    return {
        message: "Wallet PIN set successfully!"
    }
}

// add money service 
const addMoneyService = async ({ id, amount }) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const wallet = await Wallet.findOne({ userID: id }).session(session)
        if (!wallet) {
            throw new Error("Wallet not found!")
        }

        // update wallet transaction
        wallet.balance += amount
        wallet.transactions.push({
            date: new Date(),
            title: "Wallet Top-Up",
            category: "Income",
            type: "Credit",
            amount: amount,
            status: "Completed"
        })
        await wallet.save({ session })

        // update transaction model
        await Transaction.create([{
            userID: id,
            walletID: wallet._id,
            date: new Date(),
            title: "Wallet Top-Up",
            source: "Wallet",
            category: "Income",
            type: "Credit",
            amount: amount,
            status: "Completed"
        }], { session })

        await session.commitTransaction()
        session.endSession()

        return {
            message: "Wallet balance updated!"
        }
    }
    catch (err) {
        await session.abortTransaction()
        session.endSession()
        throw err
    }
}

// send money service
const sendMoneyService = async ({ id, amount, recipient, walletPin }) => {
    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        const sender = id
        const senderwallet = await Wallet.findOne({ userID: sender }).session(session)
        if (!senderwallet) {
            throw new Error("Sender wallet not found!")
        }
        const isMatch = await bcrypt.compare(walletPin, senderwallet.walletPin)
        if(!isMatch){
            throw new Error("Invalid Wallet Pin!")
        }
        const receiver = await User.findOne({ email: recipient }).session(session)
        if (!receiver) {
            throw new Error("Recipient not found!")
        }
        if (sender === receiver._id.toString()) {
            throw new Error("You cannot send money to yourself!")
        }
        const receiverWallet = await Wallet.findOne({ userID: receiver._id }).session(session)
        if (!receiverWallet) {
            throw new Error("Receiver wallet not found!")
        }
        if (senderwallet.balance < amount) {
            throw new Error("Insufficient Balance!")
        }
        if (amount > max_transaction_amount) {
            throw new Error(`Max transaction amount is ${max_transaction_amount}!`)
        }

        // update wallet 
        senderwallet.balance -= amount
        senderwallet.transactions.push({
            date: new Date(),
            title: "Send Money",
            category: "Wallet Transfer",
            type: "Debit",
            amount: amount,
            status: "Completed"
        })
        receiverWallet.balance += amount
        receiverWallet.transactions.push({
            date: new Date(),
            title: "Receive Money",
            category: "Wallet Transfer",
            type: "Credit",
            amount: amount,
            status: "Completed"
        })
        await senderwallet.save({ session })
        await receiverWallet.save({ session })

        // update transaction model
        await Transaction.create([{
            userID: sender,
            walletID: senderwallet._id,
            date: new Date(),
            title: "Send Money",
            source: "Wallet",
            category: "Wallet Transfer",
            type: "Debit",
            amount: amount,
            status: "Completed"
        }], { session })
        await Transaction.create([{
            userID: receiver._id,
            walletID: receiverWallet._id,
            date: new Date(),
            title: "Receive Money",
            source: "Wallet",
            category: "Wallet Transfer",
            type: "Credit",
            amount: amount,
            status: "Completed"
        }], { session })

        await session.commitTransaction()
        session.endSession()

        return {
            message: "Transaction successful!"
        }
    }
    catch (err) {
        await session.abortTransaction()
        session.endSession()
        throw err
    }
}

// total credit and debit service
const getDataService = async ({ id }) => {
    const wallet = await Wallet.findOne({ userID: id })
    if (!wallet) {
        throw new Error("Wallet not found!")
    }
    let credit = 0
    let debit = 0
    for (let i = 0; i < wallet.transactions.length; i++) {
        if (wallet.transactions[i].type === "Credit") credit += wallet.transactions[i].amount
        if (wallet.transactions[i].type === "Debit") debit += wallet.transactions[i].amount
    }
    return {
        credit,
        debit
    }
}
// monthly credit and debit data 
const getMonthlyDataService = async ({ id, year }) => {
    const wallet = await Wallet.findOne({ userID: id })
    if (!wallet) {
        throw new Error("Wallet not found!")
    }
    const yearly = []
    for (let i = 0; i < wallet.transactions.length; i++) {
        if (wallet.transactions[i].date.getFullYear() === year) {
            yearly.push(wallet.transactions[i])
        }
    }
    const monthly = [
        { month: "Jan", credit: 0, debit: 0 },
        { month: "Feb", credit: 0, debit: 0 },
        { month: "Mar", credit: 0, debit: 0 },
        { month: "Apr", credit: 0, debit: 0 },
        { month: "May", credit: 0, debit: 0 },
        { month: "June", credit: 0, debit: 0 },
        { month: "July", credit: 0, debit: 0 },
        { month: "Aug", credit: 0, debit: 0 },
        { month: "Sep", credit: 0, debit: 0 },
        { month: "Oct", credit: 0, debit: 0 },
        { month: "Nov", credit: 0, debit: 0 },
        { month: "Dec", credit: 0, debit: 0 }
    ]
    for (let i = 0; i < yearly.length; i++) {
        let idx = yearly[i].date.getMonth()
        if (yearly[i].type === "Credit") {
            monthly[idx].credit += yearly[i].amount
        }
        else {
            monthly[idx].debit += yearly[i].amount
        }
    }
    return { monthly }
}

// get wallet transactions service
const getWalletTransactionsService = async ({ id }) => {
    const wallet = await Wallet.findOne({ userID: id })
    if (!wallet) {
        throw new Error("Wallet not found!")
    }
    let categoryMap = {}
    let typeMap = {}

    for (let i = 0; i < walletCategories.length; i++) categoryMap[walletCategories[i].name] = walletCategories[i].emoji
    for (let i = 0; i < walletTypes.length; i++) typeMap[walletTypes[i].name] = walletTypes[i].emoji

    let response = []
    for (let i = 0; i < wallet.transactions.length; i++) {
        let obj = {
            date: wallet.transactions[i].date,
            title: wallet.transactions[i].title,
            category: wallet.transactions[i].category,
            categoryEmoji: categoryMap[wallet.transactions[i].category],
            type: wallet.transactions[i].type,
            typeEmoji: typeMap[wallet.transactions[i].type],
            amount: wallet.transactions[i].amount,
            status: wallet.transactions[i].status
        }
        response.push(obj)
    }
    return response
}

module.exports = {
    getBalanceService,
    setPinService,
    addMoneyService,
    sendMoneyService,
    getDataService,
    getMonthlyDataService,
    getWalletTransactionsService
}