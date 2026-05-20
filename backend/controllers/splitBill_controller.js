const { getGroupDataService, addGroupService, joinGroupService, addMemberService, addExpenseService, settleUpService, getGroupService, leaveGroupService, deleteGroupService, getAllGroupsService } = require('../services/splitBill_service')

// get group data controller
const getGroupDataController = async (req, res) => {
    try {
        const { youAreOwed, youOwe, totalGroups } = await getGroupDataService(req.user)
        return res.status(200).json({
            success: true,
            youAreOwed,
            youOwe,
            totalGroups
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
// add group controller
const addGroupController = async (req, res) => {
    try {
        const { id } = req.user
        const { groupName } = req.body
        const { message, groupCode } = await addGroupService({ id, groupName })
        return res.status(200).json({
            success: true,
            message,
            groupCode
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// join group controller
const joinGroupController = async (req, res) => {
    try {
        const { id } = req.user
        const { groupCode } = req.params
        const { message } = await joinGroupService({ id, groupCode })
        return res.status(200).json({
            success: true,
            message
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// add member controller
const addMemberController = async (req, res) => {
    try {
        const { id } = req.user
        const { groupCode } = req.params 
        const { email } = req.body
        const { message } = await addMemberService({ id, email, groupCode })
        return res.status(200).json({
            success: true,
            message
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// add expense controller
const addExpenseController = async (req, res) => {
    try {
        const { id } = req.user
        const { groupCode } = req.params 
        const { title, totalAmount, paidBy, split, splitDetails } = req.body
        const { message } = await addExpenseService({ id, groupCode, title, totalAmount, paidBy, split, splitDetails })
        return res.status(200).json({
            success: true,
            message
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// settle up controller
const settleUpController = async (req, res) => {
    try {
        const { id } = req.user
        const { groupCode } = req.params 
        const { message } = await settleUpService({ id, groupCode })
        return res.status(200).json({
            success: true,
            message
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// get group controller
const getGroupController = async (req, res) => {
    try {
        const { id } = req.user
        const { groupCode } = req.params 
        const { group, memberMap, yourBalance } = await getGroupService({ id, groupCode })
        return res.status(200).json({
            success: true,
            group,
            memberMap,
            yourBalance
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// leave group controller
const leaveGroupController = async (req, res) => {
    try {
        const { id } = req.user
        const { groupCode } = req.params 
        const { message } = await leaveGroupService({ id, groupCode })
        return res.status(200).json({
            success: true,
            message
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// delete group controller
const deleteGroupController = async (req, res) => {
    try {
        const { id } = req.user
        const { groupCode } = req.params 
        const { message } = await deleteGroupService({ id, groupCode })
        return res.status(200).json({
            success: true,
            message
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// get all groups controller
const getAllGroupsController = async (req, res) => {
    try {
        const { id } = req.user
        const { groups } = await getAllGroupsService({ id })
        return res.status(200).json({
            success: true,
            groups
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    getGroupDataController,
    addGroupController,
    joinGroupController,
    addMemberController,
    addExpenseController,
    settleUpController,
    getGroupController,
    leaveGroupController,
    deleteGroupController,
    getAllGroupsController
}
