const { transactionCategories, transactionTypes } = require('../constants/enums')
const Transaction = require('../models/Transaction')

// all transactions service - filters (sources, date from-to, amount min-max)
const allTransactionsService = async ({id, source, fromDate, toDate, minAmt, maxAmt}) => {
    let transactions = await Transaction.find({userID: id})
    
    const categoriesMap = {}
    for(let i=0; i<transactionCategories.length; i++) categoriesMap[transactionCategories[i].name] = transactionCategories[i].emoji
    const typesMap = {}
    for(let i=0; i<transactionTypes.length; i++) typesMap[transactionTypes[i].name] = transactionTypes[i].emoji

    if(source){
        transactions = transactions.filter((t)=> t.source === source)
    }
    if(fromDate || toDate){
        let from = new Date(2020,0)
        let to = new Date()
        if(fromDate) from = new Date(fromDate)
        if(toDate) to = new Date(toDate)
        transactions = transactions.filter((t)=> t.date >= from && t.date <= to)
    }
    if(minAmt !== undefined || maxAmt !== undefined){
        let min = 0
        let max = Infinity
        if(minAmt!==undefined) min = Number(minAmt)
        if(maxAmt!==undefined) max = Number(maxAmt)
        transactions = transactions.filter((t)=> t.amount >= min && t.amount <= max)
    }
    transactions = transactions.map((t)=>{
        return {
            date: t.date,
            title: t.title,
            source: t.source,
            category: t.category,
            categoryEmoji: categoriesMap[t.category],
            type: t.type,
            typeEmoji: typesMap[t.type],
            amount: t.amount,
            status: t.status
        }
    })
    return transactions
}

module.exports = {
    allTransactionsService,
}
