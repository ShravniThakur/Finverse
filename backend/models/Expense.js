const { expenseCategories, expenseTypes } = require('../constants/enums')
const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    date: { type: Date, default: Date.now },
    title: { type: String, required: true },
    category: { type: String, enum: expenseCategories.map((c) => { return c.name }), required: true },
    type: { type: String, enum: expenseTypes.map((e) => { return e.name }), required: true },
    amount: { type: Number, required: true, min: 0 },
}, { timestamps: true })

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense
