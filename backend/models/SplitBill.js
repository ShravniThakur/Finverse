const mongoose = require('mongoose')

const splitBillSchema = new mongoose.Schema({
    createdBy: { type: String, required: true },
    groupName: { type: String, required: true },
    groupCode: { type: String, required: true, unique: true },
}, { timestamps: true })

const SplitBill = mongoose.model('SplitBill', splitBillSchema)

module.exports = SplitBill

// Members and expenses now live in GroupMember and GroupExpense collections
