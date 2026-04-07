const { transactionCategories, transactionTypes, transactionSources, transactionStatus } = require('../constants/enums')
const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    walletID: String,
    expenseID: String,
    groupID: String,
    date: { type: Date, default: Date.now },
    title: { type: String, required: true },
    source: { type: String, enum: transactionSources, required: true },
    category: { type: String, enum: transactionCategories.map((c) => { return c.name }), required: true },
    type: { type: String, enum: transactionTypes.map((t) => { return t.name }), required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: transactionStatus, required: true }
}, { timestamps: true })

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
