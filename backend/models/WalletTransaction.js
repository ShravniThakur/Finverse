const { walletCategories, walletTypes, walletStatus } = require('../constants/enums')
const mongoose = require('mongoose')

const walletTransactionSchema = new mongoose.Schema({
    walletID: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
    userID:   { type: String, required: true },
    date:     { type: Date, default: Date.now },
    title:    { type: String, required: true },
    category: { type: String, enum: walletCategories.map(c => c.name), required: true },
    type:     { type: String, enum: walletTypes.map(t => t.name), required: true },
    amount:   { type: Number, required: true, min: 0 },
    status:   { type: String, enum: walletStatus, default: 'Completed' },
    source:   { type: String, enum: ['Wallet', 'Group'], default: 'Wallet' }
}, { timestamps: true })


walletTransactionSchema.index({ walletID: 1, date: -1 })
walletTransactionSchema.index({ userID: 1, date: -1 })
walletTransactionSchema.index({ userID: 1, source: 1, date: -1 })
walletTransactionSchema.index({ userID: 1, amount: 1 })

const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema)

module.exports = WalletTransaction
