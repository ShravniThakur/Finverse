const { expenseCategories, expenseTypes } = require('../constants/enums')
const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    userID:   { type: String, required: true },
    date:     { type: Date, default: Date.now },
    title:    { type: String, required: true },
    category: { type: String, enum: expenseCategories.map(c => c.name), required: true },
    type:     { type: String, enum: expenseTypes.map(e => e.name), required: true },
    amount:   { type: Number, required: true, min: 0 },
}, { timestamps: true })


expenseSchema.index({ userID: 1, date: -1 })
expenseSchema.index({ userID: 1, category: 1 })
expenseSchema.index({ userID: 1, amount: 1 })

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense
