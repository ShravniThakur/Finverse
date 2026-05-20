const validator = require('validator')
const { splitType } = require('../constants/enums')
const { max_transaction_amount } = require('../constants/limits')

// validate add group
const validateAddGroup = (req, res, next) => {
    try {
        let { groupName } = req.body
    
        if (!groupName) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
        }
        groupName = groupName.trim()
        if(groupName.length < 2){
            return res.status(400).json({
                success: false,
                message: "Group name must have atleast 2 characters!"
            })
        }
        next()
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// validate add member
const validateAddMember = (req, res, next) => {
    try {
        const { groupCode } = req.params 
        const { email } = req.body
        if (!email || !groupCode) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email!"
            })
        }
        next()
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// validate add expense 
const validateAddExpense = (req, res, next) => {
    try {
        const { groupCode } = req.params 
        let { title, totalAmount, paidBy, split, splitDetails } = req.body
        if (!groupCode || !title || totalAmount === undefined || paidBy === undefined || split === undefined) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
        }
        title = title.trim()
        if (title.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Title must have atleast 2 characters!"
            })
        }
        if (!Number.isInteger(totalAmount) || totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Total amount must be a positive number!"
            })
        }
        if(totalAmount > max_transaction_amount){
            return res.status(400).json({
                success: false,
                message: `Max transaction amount is ${max_transaction_amount}`
            })
        }
        if (!Array.isArray(paidBy) || paidBy.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Paid by must be an array with positive length!"
            })
        }
        for (let i = 0; i < paidBy.length; i++) {
            if (!paidBy[i].memberID || paidBy[i].amount === undefined) {
                return res.status(400).json({
                    success: false,
                    message: "Id and amount fields in paid by array are missing!"
                })
            }
            if (!Number.isInteger(paidBy[i].amount) || paidBy[i].amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Amount must be a positive number!"
                })
            }
        }
        const allowedSplitType = splitType.map((s) => s.name)
        if (!allowedSplitType.includes(split)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Split!"
            })
        }
        if (split === 'Custom' && splitDetails === undefined) {
            return res.status(400).json({
                success: false,
                message: "Split details required for custom split!"
            })
        }
        if (split === 'Equal' && splitDetails) {
            return res.status(400).json({
                success: false,
                message: "Split details not allowed for equal split!"
            })
        }
        if (splitDetails && (!Array.isArray(splitDetails) || splitDetails.length === 0)) {
            return res.status(400).json({
                success: false,
                message: "Split details must be an array with positive length!"
            })
        }
        if (splitDetails) {
            for (let i = 0; i < splitDetails.length; i++) {
                if (!splitDetails[i].memberID || splitDetails[i].amount === undefined) {
                    return res.status(400).json({
                        success: false,
                        message: "All fields are required in split details!"
                    })

                }
                if (!Number.isInteger(splitDetails[i].amount) || splitDetails[i].amount < 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Amount must be a non negative number!"
                    })
                }
            }
        }
        next()
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// validate join group, settle up, get group, leave group, delete group, get all groups 
const validateGroupCode = (req, res, next) => {
    try {
        let { groupCode } = req.params 
        if (!groupCode) {
            return res.status(400).json({
                success: false,
                message: "Group code is required!"
            })
        }
        groupCode = groupCode.trim()
        if(groupCode.length===0){
            return res.status(400).json({
                success:false,
                message: "Group Code cannot be empty!"
            })
        }
        next()
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    validateAddGroup, 
    validateAddMember,
    validateAddExpense,
    validateGroupCode
}
