const { splitStatus, splitType } = require('../constants/enums')
const mongoose = require('mongoose')

const groupExpenseSchema = new mongoose.Schema({
    groupID: { type: mongoose.Schema.Types.ObjectId, ref: 'SplitBill', required: true },
    groupCode: { type: String, required: true },
    date: { type: Date, default: Date.now },
    title: { type: String, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    paidBy: [
        {
            memberID: { type: String, required: true },
            amount: { type: Number, required: true, min: 0 }
        }
    ],
    split: { type: String, enum: splitType.map(t => t.name), default: 'Equal' },
    splitDetails: [
        {
            memberID: { type: String, required: true },
            amount: { type: Number, required: true, min: 0 }
        }
    ],
    status: { type: String, enum: splitStatus, default: 'Pending' }
}, { timestamps: true })

groupExpenseSchema.index({ groupCode: 1, date: -1 })

const GroupExpense = mongoose.model('GroupExpense', groupExpenseSchema)

module.exports = GroupExpense
