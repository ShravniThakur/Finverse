// wallet
const walletCategories = [
    { name: "Income", emoji: "💰" },
    { name: "Wallet Transfer", emoji: "💸" },
    { name: "Expense", emoji: "🛒" },
    { name: "Split Settlement", emoji: "🤝"  }
]
const walletTypes = [
    { name: "Credit", emoji: "➕" },
    { name: "Debit", emoji: "➖" }
]

const walletStatus = [
    "Completed",
    "Pending",
    "Failed"
]

// expense
const expenseCategories = [
    { name: "Food", emoji: "🍔" },
    { name: "Groceries", emoji: "🛒" },
    { name: "Housing", emoji: "🏠" },
    { name: "Bills & Utilities", emoji: "💡" },
    { name: "Transportation", emoji: "🚗" },
    { name: "Entertainment", emoji: "🎬" },
    { name: "Shopping", emoji: "🛍️" },
    { name: "Health", emoji: "🏥" },
    { name: "Education", emoji: "🎓" },
    { name: "Travel", emoji: "✈️" },
    { name: "Investments & Savings", emoji: "💰" },
    { name: "Fees & Charges", emoji: "💳" },
    { name: "Others", emoji: "❓" },
]
const expenseTypes = [
    { name: "Wallet", emoji: "👛" },
    { name: "Cash", emoji: "💵" }
]

//split
const splitType = [
    { name: "Equal", emoji: "⚖️" },
    { name: "Custom", emoji: "✏️" }
]
const splitStatus = [
    "Pending",
    "Settled"
]

// transaction
const transactionCategories = [
    // wallet categories 
    { name: "Income", emoji: "💰" },
    { name: "Wallet Transfer", emoji: "💸" },
    { name: "Expense", emoji: "🛒" },
    { name: "Split Settlement", emoji: "🤝"  },
    // expense categories
    { name: "Food", emoji: "🍔" },
    { name: "Groceries", emoji: "🛒" },
    { name: "Housing", emoji: "🏠" },
    { name: "Bills & Utilities", emoji: "💡" },
    { name: "Transportation", emoji: "🚗" },
    { name: "Entertainment", emoji: "🎬" },
    { name: "Shopping", emoji: "🛍️" },
    { name: "Health", emoji: "🏥" },
    { name: "Education", emoji: "🎓" },
    { name: "Travel", emoji: "✈️" },
    { name: "Investments & Savings", emoji: "💰" },
    { name: "Fees & Charges", emoji: "💳" },
    { name: "Others", emoji: "❓" },
    // split
    { name: "Group Split", emoji: "👥" }
]
const transactionTypes = [
    // wallet
    { name: "Credit", emoji: "➕" },
    { name: "Debit", emoji: "➖" },
    // expense
    { name: "Wallet", emoji: "👛" },
    { name: "Cash", emoji: "💵" },
    // split
    { name: "Split Settlement", emoji: "⚖️" },
]
const transactionStatus = [
    // wallet and split
    "Completed",
    "Pending",
    "Failed",
    "Settled",
    // expense
    "Not Applicable"
]
const transactionSources = [
    "Wallet",
    "Expense",
    "Group"
]


module.exports = {
    walletCategories,
    walletTypes,
    walletStatus,
    expenseCategories,
    expenseTypes,
    splitStatus,
    splitType,
    transactionCategories,
    transactionTypes,
    transactionSources,
    transactionStatus
}
