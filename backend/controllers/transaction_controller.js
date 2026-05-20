const { allTransactionsService } = require('../services/transaction_service')

const allTransactionsController = async (req, res) => {
    try {
        const { id } = req.user
        const { source, fromDate, toDate, minAmt, maxAmt } = req.query
        const transactions = await allTransactionsService({ id, source, fromDate, toDate, minAmt, maxAmt })
        return res.status(200).json({
            success: true,
            transactions
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    allTransactionsController
}