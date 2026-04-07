const { splitStatus, splitType } = require('../constants/enums')
const mongoose = require('mongoose')

const splitBillSchema = new mongoose.Schema({
    createdBy: { type: String, required: true },
    groupName: { type: String, required: true },
    groupCode: { type: String, required: true, unique: true },
    members: [
        {
            memberID: { type: String, required: true },
            name: { type: String, required: true },
            balance: { type: Number, default: 0 } // +ve -> you are owed , -ve -> you owe
        }
    ],
    expenses: [
        {
            date: { type: Date, default: Date.now },
            title: { type: String, required: true },
            totalAmount: { type: Number, required: true, min: 0 },
            paidBy: [
                {
                    memberID: { type: String, required: true },
                    amount: { type: Number, required: true, min: 0 }
                }
            ],
            split: { type: String, enum: splitType.map((t) => { return t.name }), default: "Equal" },
            splitDetails: [
                {
                    memberID: { type: String, required: true },
                    amount: { type: Number, required: true, min: 0 }
                }
            ],
            status: { type: String, enum: splitStatus, default: "Pending" }
        }
    ]
}, { timestamps: true })

const SplitBill = mongoose.model('SplitBill', splitBillSchema)

module.exports = SplitBill

// every transaction modifies balances of members 