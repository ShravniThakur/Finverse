const { walletCategories, walletTypes, walletStatus } = require('../constants/enums')
const { low_balance } = require('../constants/limits')
const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    balance: { type: Number, default: 0, min: 0 },
    walletPin: { type: String, required: false },
    isPinSet: { type: Boolean, default: false },
    lowBalanceThreshold: { type: Number, default: low_balance },
    transactions: [
        {
            date: { type: Date, default: Date.now },
            title: { type: String, required: true },
            category: { type: String, enum: walletCategories.map((c) => { return c.name }), required: true },
            type: { type: String, enum: walletTypes.map((t) => { return t.name }), required: true },
            amount: { type: Number, required: true, min: 0 },
            status: { type: String, enum: walletStatus, default: "Completed" }
        }
    ],
}, { timestamps: true })

const Wallet = mongoose.model('Wallet', walletSchema)

module.exports = Wallet

