const { walletCategories, walletTypes } = require('../constants/enums')
const Wallet = require('../models/Wallet')
const WalletTransaction = require('../models/WalletTransaction')
const User = require('../models/User')
const { max_transaction_amount } = require('../constants/limits')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"]

// get balance service
const getBalanceService = async ({ id }) => {
    const wallet = await Wallet.findOne({ userID: id })
    if (!wallet) throw new Error("Wallet not found!")
    return {
        balance: wallet.balance,
        isLow: wallet.balance <= wallet.lowBalanceThreshold
    }
}

// set pin service
const setPinService = async ({ id, walletPin }) => {
    const wallet = await Wallet.findOne({ userID: id })
    if (!wallet) throw new Error("Wallet not found!")
    if (wallet.isPinSet) throw new Error("Wallet PIN already set!")
    const hashPin = await bcrypt.hash(walletPin, 10)
    wallet.walletPin = hashPin
    wallet.isPinSet = true
    await wallet.save()
    return { message: "Wallet PIN set successfully!" }
}

// add money service
const addMoneyService = async ({ id, amount }) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const wallet = await Wallet.findOne({ userID: id }).session(session)
        if (!wallet) throw new Error("Wallet not found!")
        wallet.balance += amount
        await wallet.save({ session })
        await WalletTransaction.create([{
            walletID: wallet._id, userID: id, date: new Date(),
            title: "Wallet Top-Up", category: "Income", type: "Credit",
            amount, status: "Completed", source: "Wallet"
        }], { session })
        await session.commitTransaction()
        session.endSession()
        return { message: "Wallet balance updated!" }
    } catch (err) {
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
        const senderWallet = await Wallet.findOne({ userID: id }).session(session)
        if (!senderWallet) throw new Error("Sender wallet not found!")
        const isMatch = await bcrypt.compare(walletPin, senderWallet.walletPin)
        if (!isMatch) throw new Error("Invalid Wallet Pin!")
        const receiver = await User.findOne({ email: recipient }).session(session)
        if (!receiver) throw new Error("Recipient not found!")
        if (id === receiver._id.toString()) throw new Error("You cannot send money to yourself!")
        const receiverWallet = await Wallet.findOne({ userID: receiver._id }).session(session)
        if (!receiverWallet) throw new Error("Receiver wallet not found!")
        if (senderWallet.balance < amount) throw new Error("Insufficient Balance!")
        if (amount > max_transaction_amount) throw new Error(`Max transaction amount is ${max_transaction_amount}!`)
        senderWallet.balance -= amount
        receiverWallet.balance += amount
        await senderWallet.save({ session })
        await receiverWallet.save({ session })
        await WalletTransaction.create([
            {
                walletID: senderWallet._id, userID: id, date: new Date(),
                title: "Send Money", category: "Wallet Transfer", type: "Debit",
                amount, status: "Completed", source: "Wallet"
            },
            {
                walletID: receiverWallet._id, userID: receiver._id.toString(), date: new Date(),
                title: "Receive Money", category: "Wallet Transfer", type: "Credit",
                amount, status: "Completed", source: "Wallet"
            }
        ], { session })
        await session.commitTransaction()
        session.endSession()
        return { message: "Transaction successful!" }
    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        throw err
    }
}

// total credit/debit — aggregated in DB, no JS summation
const getDataService = async ({ id }) => {
    const wallet = await Wallet.findOne({ userID: id })
    if (!wallet) throw new Error("Wallet not found!")

    const [result] = await WalletTransaction.aggregate([
        { $match: { userID: id } },
        {
            $group: {
                _id: null,
                credit: { $sum: { $cond: [{ $eq: ['$type', 'Credit'] }, '$amount', 0] } },
                debit:  { $sum: { $cond: [{ $eq: ['$type', 'Debit'] },  '$amount', 0] } }
            }
        }
    ])
    return result ? { credit: result.credit, debit: result.debit } : { credit: 0, debit: 0 }
}

// monthly credit/debit — grouped by month in DB, zero-filled in JS for missing months only
const getMonthlyDataService = async ({ id, year }) => {
    const wallet = await Wallet.findOne({ userID: id })
    if (!wallet) throw new Error("Wallet not found!")

    const results = await WalletTransaction.aggregate([
        {
            $match: {
                userID: id,
                date: { $gte: new Date(year, 0), $lt: new Date(year + 1, 0) }
            }
        },
        {
            $group: {
                _id: { $month: '$date' },   // 1–12
                credit: { $sum: { $cond: [{ $eq: ['$type', 'Credit'] }, '$amount', 0] } },
                debit:  { $sum: { $cond: [{ $eq: ['$type', 'Debit'] },  '$amount', 0] } }
            }
        }
    ])

    // Start with all-zero months, then fill from DB results
    const monthly = MONTH_NAMES.map(month => ({ month, credit: 0, debit: 0 }))
    for (const r of results) {
        monthly[r._id - 1].credit = r.credit
        monthly[r._id - 1].debit  = r.debit
    }
    return { monthly }
}

// wallet transaction list — projection + sort pushed to DB
const getWalletTransactionsService = async ({ id }) => {
    const wallet = await Wallet.findOne({ userID: id })
    if (!wallet) throw new Error("Wallet not found!")

    const categoryMap = {}
    const typeMap = {}
    for (const c of walletCategories) categoryMap[c.name] = c.emoji
    for (const t of walletTypes)      typeMap[t.name]     = t.emoji

    const transactions = await WalletTransaction
        .find({ walletID: wallet._id })
        .sort({ date: -1 })
        .select('date title category type amount status')
        .lean()

    return transactions.map(t => ({
        date:          t.date,
        title:         t.title,
        category:      t.category,
        categoryEmoji: categoryMap[t.category],
        type:          t.type,
        typeEmoji:     typeMap[t.type],
        amount:        t.amount,
        status:        t.status
    }))
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
