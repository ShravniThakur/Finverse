const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const cors = require('cors')
const connectDatabase = require('./config/mongodb')
const connectCloudinary = require('./config/cloudinary')

const userRouter = require('./routes/user_route')
const walletRouter = require('./routes/wallet_route')
const expenseRouter = require('./routes/expense_route')
const budgetRouter = require('./routes/budget_route')
const groupRouter = require('./routes/splitBill_route')
const transactionRouter = require('./routes/transaction_route')

// app config
const app = express()
const port = process.env.PORT
connectDatabase()
connectCloudinary()

// middlewares 
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/user', userRouter)
app.use('/wallet', walletRouter)
app.use('/expense', expenseRouter)
app.use('/budget', budgetRouter)
app.use('/split-bill', groupRouter)
app.use('/transaction', transactionRouter)

app.listen(port, () => {
    console.log('App running on port ' + port)
})

