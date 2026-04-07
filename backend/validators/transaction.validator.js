const {transactionSources} = require('../constants/enums')
const validator = require('validator')

const validateAllTransactions = (req,res,next) => {
    try{
        const {source, fromDate, toDate, minAmt, maxAmt} = req.query
        if(source && !transactionSources.includes(source)){
            return res.status(400).json({
                success: false,
                message: "Invalid source!"
            })
        }
        if(fromDate && !validator.isDate(fromDate)){
            return res.status(400).json({
                success: false,
                message: "Invalid From date!"
            })
        }
        if(toDate && !validator.isDate(toDate)){
            return res.status(400).json({
                success: false,
                message: "Invalid To date!"
            })
        }
        if(fromDate && toDate && (new Date(fromDate)) > (new Date(toDate))){
            return res.status(400).json({
                success: false,
                message: "Invalid range. From date must be before To date!"
            })
        }
        if(minAmt!==undefined && Number(minAmt) < 0){
            return res.status(400).json({
                success: false,
                message: "Minimum amount must be non negative integer!"
            })
        }
        if(maxAmt!==undefined && Number(maxAmt) < 0){
            return res.status(400).json({
                success: false,
                message: "Maximum amount must be non negative integer!"
            })
        }
        if(minAmt!==undefined && maxAmt!==undefined && Number(minAmt) > Number(maxAmt)){
            return res.status(400).json({
                success: false,
                message: "Minimum amount must be less than maximum amount!"
            })
        }
        next()
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    validateAllTransactions
}
