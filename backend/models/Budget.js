const { expenseCategories } = require('../constants/enums')
const mongoose = require('mongoose')

const budgetSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    category: { type: String, enum: expenseCategories.map((c) => { return c.name }), required: true },
    totalBudget: { type: Number, required: true, min: 0 },

}, { timestamps: true })

const Budget = mongoose.model('Budget', budgetSchema)

module.exports = Budget

// only 1 budget can be defined for a given month in that year and for a given category
