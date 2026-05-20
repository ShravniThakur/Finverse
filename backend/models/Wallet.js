const { low_balance } = require('../constants/limits')
const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
    userID:             { type: String, required: true },
    balance:            { type: Number, default: 0, min: 0 },
    walletPin:          { type: String, required: false },
    isPinSet:           { type: Boolean, default: false },
    lowBalanceThreshold:{ type: Number, default: low_balance },
}, { timestamps: true })

// Every wallet lookup is by userID — make it a unique index
walletSchema.index({ userID: 1 }, { unique: true })

const Wallet = mongoose.model('Wallet', walletSchema)

module.exports = Wallet
