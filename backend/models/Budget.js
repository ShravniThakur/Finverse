const { expenseCategories } = require('../constants/enums')
const mongoose = require('mongoose')

const budgetSchema = new mongoose.Schema({
    userID:      { type: String, required: true },
    month:       { type: Number, required: true },
    year:        { type: Number, required: true },
    category:    { type: String, enum: expenseCategories.map(c => c.name), required: true },
    totalBudget: { type: Number, required: true, min: 0 },
}, { timestamps: true })


budgetSchema.index({ userID: 1, month: 1, year: 1, category: 1 }, { unique: true })
budgetSchema.index({ userID: 1, year: 1 })

const Budget = mongoose.model('Budget', budgetSchema)

module.exports = Budget
