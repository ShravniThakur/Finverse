const { getGroupDataController, addGroupController, joinGroupController, addMemberController, addExpenseController, settleUpController, getGroupController, leaveGroupController, deleteGroupController, getAllGroupsController } = require('../controllers/splitBill_controller')
const { validateAddGroup, validateAddMember, validateAddExpense, validateGroupCode } = require('../validators/splitBill.validator')
const authentication = require('../middlewares/auth.middleware')
const express = require('express')
const groupRouter = express.Router()

groupRouter.get('/get-group-data', authentication, getGroupDataController)
groupRouter.post('/add-group', authentication, validateAddGroup, addGroupController)
groupRouter.post('/join-group/:groupCode', authentication, validateGroupCode, joinGroupController)
groupRouter.post('/add-member/:groupCode', authentication, validateAddMember, addMemberController)
groupRouter.post('/add-expense/:groupCode', authentication, validateAddExpense, addExpenseController)
groupRouter.post('/settle-up/:groupCode', authentication, validateGroupCode, settleUpController)
groupRouter.get('/get-group/:groupCode', authentication, validateGroupCode, getGroupController)
groupRouter.post('/leave-group/:groupCode', authentication, validateGroupCode, leaveGroupController)
groupRouter.post('/delete-group/:groupCode', authentication, validateGroupCode, deleteGroupController)
groupRouter.get('/get-all-groups', authentication, getAllGroupsController)

module.exports = groupRouter
