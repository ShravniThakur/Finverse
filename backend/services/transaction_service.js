const { walletCategories, walletTypes, expenseCategories, expenseTypes } = require('../constants/enums')
const WalletTransaction = require('../models/WalletTransaction')
const Expense = require('../models/Expense')

// Emoji maps built once at module load — not rebuilt per request
const walletCategoryMap  = walletCategories.reduce( (m, c) => { m[c.name] = c.emoji; return m }, {})
const walletTypeMap      = walletTypes.reduce(      (m, t) => { m[t.name] = t.emoji; return m }, {})
const expenseCategoryMap = expenseCategories.reduce((m, c) => { m[c.name] = c.emoji; return m }, {})
const expenseTypeMap     = expenseTypes.reduce(     (m, t) => { m[t.name] = t.emoji; return m }, {})

// all transactions service — all filters pushed to DB, no JS-level filtering
const allTransactionsService = async ({ id, source, fromDate, toDate, minAmt, maxAmt }) => {

    // Build shared filter fragments once
    const dateFilter = {}
    if (fromDate) dateFilter.$gte = new Date(fromDate)
    if (toDate)   dateFilter.$lte = new Date(toDate)

    const amtFilter = {}
    if (minAmt !== undefined) amtFilter.$gte = Number(minAmt)
    if (maxAmt !== undefined) amtFilter.$lte = Number(maxAmt)

    const promises = []

    // ── WalletTransaction (covers Wallet + Group sources) ────────────────────────
    if (!source || source === 'Wallet' || source === 'Group') {
        const q = { userID: id }
        if (source === 'Wallet') q.source = 'Wallet'
        if (source === 'Group')  q.source = 'Group'
        if (Object.keys(dateFilter).length) q.date   = dateFilter
        if (Object.keys(amtFilter).length)  q.amount = amtFilter

        promises.push(
            WalletTransaction
                .find(q)
                .sort({ date: -1 })
                .select('date title source category type amount status')
                .lean()
                .then(docs => docs.map(t => ({
                    date:          t.date,
                    title:         t.title,
                    source:        t.source,
                    category:      t.category,
                    categoryEmoji: walletCategoryMap[t.category]  ?? '',
                    type:          t.type,
                    typeEmoji:     walletTypeMap[t.type]           ?? '',
                    amount:        t.amount,
                    status:        t.status
                })))
        )
    }

    // ── Expense collection ───────────────────────────────────────────────────────
    if (!source || source === 'Expense') {
        const q = { userID: id }
        if (Object.keys(dateFilter).length) q.date   = dateFilter
        if (Object.keys(amtFilter).length)  q.amount = amtFilter

        promises.push(
            Expense
                .find(q)
                .sort({ date: -1 })
                .select('date title category type amount')
                .lean()
                .then(docs => docs.map(e => ({
                    date:          e.date,
                    title:         e.title,
                    source:        'Expense',
                    category:      e.category,
                    categoryEmoji: expenseCategoryMap[e.category] ?? '',
                    type:          e.type,
                    typeEmoji:     expenseTypeMap[e.type]         ?? '',
                    amount:        e.amount,
                    status:        'Not Applicable'
                })))
        )
    }

    // Run both queries in parallel, merge, sort combined result newest-first
    const results = await Promise.all(promises)
    const merged  = results.flat()
    merged.sort((a, b) => new Date(b.date) - new Date(a.date))
    return merged
}

module.exports = { allTransactionsService }
