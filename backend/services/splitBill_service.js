const SplitBill = require('../models/SplitBill')
const GroupMember = require('../models/GroupMember')
const GroupExpense = require('../models/GroupExpense')
const Wallet = require('../models/Wallet')
const WalletTransaction = require('../models/WalletTransaction')
const User = require('../models/User')
const mongoose = require('mongoose')

// get group data service — aggregated in DB, no JS summation
const getGroupDataService = async ({ id }) => {
    const [result] = await GroupMember.aggregate([
        { $match: { memberID: id } },
        {
            $group: {
                _id: null,
                totalGroups:  { $sum: 1 },
                youAreOwed:   { $sum: { $cond: [{ $gt: ['$balance', 0] }, '$balance',           0] } },
                youOwe:       { $sum: { $cond: [{ $lt: ['$balance', 0] }, { $abs: '$balance' }, 0] } }
            }
        }
    ])
    return result
        ? { youAreOwed: result.youAreOwed, youOwe: result.youOwe, totalGroups: result.totalGroups }
        : { youAreOwed: 0, youOwe: 0, totalGroups: 0 }
}

// add group service
const addGroupService = async ({ id, groupName }) => {
    const groupCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const user = await User.findById(id)
    const group = await SplitBill.create({ createdBy: id, groupName, groupCode })
    await GroupMember.create({ groupID: group._id, groupCode, memberID: id, name: user.name, balance: 0 })
    return { message: "Group created successfully!", groupCode }
}

// join group service
const joinGroupService = async ({ id, groupCode }) => {
    const group = await SplitBill.findOne({ groupCode })
    if (!group) throw new Error("Invalid Group Code!")
    const user = await User.findById(id)
    if (!user) throw new Error("User not found!")
    const existing = await GroupMember.findOne({ groupCode, memberID: id })
    if (existing) throw new Error("You are already a member of this group!")
    await GroupMember.create({ groupID: group._id, groupCode, memberID: id, name: user.name, balance: 0 })
    return { message: "Joined Group Successfully!" }
}

// add member service
const addMemberService = async ({ id, email, groupCode }) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const newMemberUser = await User.findOne({ email }).session(session)
        const group = await SplitBill.findOne({ groupCode }).session(session)

        if (!newMemberUser) throw new Error("Member doesn't exist!")
        if (!group) throw new Error("Group doesn't exist!")

        const requester = await GroupMember.findOne({ groupCode, memberID: id }).session(session)
        if (!requester) throw new Error("You are not a member of the group!")

        const alreadyMember = await GroupMember.findOne({ groupCode, memberID: newMemberUser._id.toString() }).session(session)
        if (alreadyMember) throw new Error("Member already exists in the group!")

        await GroupMember.create([{
            groupID: group._id,
            groupCode,
            memberID: newMemberUser._id.toString(),
            name: newMemberUser.name,
            balance: 0
        }], { session })

        await session.commitTransaction()
        session.endSession()
        return { message: "Member added successfully!" }
    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        throw err
    }
}

// add expense service
const addExpenseService = async ({ id, groupCode, title, totalAmount, paidBy, split, splitDetails }) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const group = await SplitBill.findOne({ groupCode }).session(session)
        if (!group) throw new Error("Group doesn't exist!")

        const groupMembers = await GroupMember.find({ groupCode }).session(session)
        const requester = groupMembers.find(m => m.memberID === id)
        if (!requester) throw new Error("You are not a member of the group!")

        // Validate paidBy total matches
        let paidSum = 0
        for (let p of paidBy) paidSum += p.amount
        if (paidSum !== totalAmount) throw new Error("Total amount doesn't match amount paid by members!")

        // Build paidBy map, check for duplicates
        const paidByMap = {}
        for (let p of paidBy) {
            if (paidByMap[p.memberID]) throw new Error("Duplicate member in paid by!")
            paidByMap[p.memberID] = p.amount
        }

        // Verify all paidBy members belong to this group
        for (let p of paidBy) {
            if (!groupMembers.find(m => m.memberID === p.memberID)) {
                throw new Error("Paid By member doesn't exist in group!")
            }
        }

        let finalSplitDetails = []

        if (split === 'Equal') {
            const count = groupMembers.length
            let value = Math.floor(totalAmount / count)
            let rem = totalAmount % count

            for (let m of groupMembers) {
                let share = value
                if (rem !== 0) { share++; rem-- }
                finalSplitDetails.push({ memberID: m.memberID, amount: share })
                m.balance -= share
                if (paidByMap[m.memberID]) m.balance += paidByMap[m.memberID]
                await m.save({ session })
            }
        }

        if (split === 'Custom') {
            if (splitDetails.length !== groupMembers.length) {
                throw new Error("Split details of all members must be provided!")
            }
            let splitSum = 0
            const splitDetailsMap = {}
            for (let sd of splitDetails) {
                splitSum += sd.amount
                if (splitDetailsMap[sd.memberID]) throw new Error("Duplicate member in split details!")
                splitDetailsMap[sd.memberID] = sd.amount
            }
            if (splitSum !== totalAmount) throw new Error("Total amount doesn't match split details sum!")
            for (let m of groupMembers) {
                if (splitDetailsMap[m.memberID] === undefined) throw new Error("Split member doesn't exist in group!")
            }
            for (let m of groupMembers) {
                m.balance -= splitDetailsMap[m.memberID]
                if (paidByMap[m.memberID]) m.balance += paidByMap[m.memberID]
                await m.save({ session })
                finalSplitDetails.push({ memberID: m.memberID, amount: splitDetailsMap[m.memberID] })
            }
        }

        await GroupExpense.create([{
            groupID: group._id,
            groupCode,
            date: new Date(),
            title,
            totalAmount,
            paidBy,
            split,
            splitDetails: finalSplitDetails,
            status: 'Pending'
        }], { session })

        await session.commitTransaction()
        session.endSession()
        return { message: "Expense added successfully!" }
    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        throw err
    }
}

// settle up service
const settleUpService = async ({ id, groupCode }) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const group = await SplitBill.findOne({ groupCode }).session(session)
        if (!group) throw new Error("Group doesn't exist!")

        const groupMembers = await GroupMember.find({ groupCode }).session(session)
        const member = groupMembers.find(m => m.memberID === id)
        if (!member) throw new Error("You are not a member of this group!")
        if (member.balance >= 0) throw new Error("You don't owe money!")

        // Creditors are members with a positive balance (they are owed money)
        const creditors = groupMembers
            .filter(m => m.balance > 0)
            .map(m => ({ doc: m, remainingCredit: m.balance }))

        const senderWallet = await Wallet.findOne({ userID: id }).session(session)
        let balanceOwed = -member.balance
        if (senderWallet.balance < balanceOwed) throw new Error("Insufficient wallet balance!")

        for (let creditor of creditors) {
            if (balanceOwed === 0) break

            const receiverWallet = await Wallet.findOne({ userID: creditor.doc.memberID }).session(session)
            const amount = creditor.remainingCredit >= balanceOwed
                ? balanceOwed
                : creditor.remainingCredit

            balanceOwed -= amount
            creditor.doc.balance -= amount
            creditor.remainingCredit -= amount
            await creditor.doc.save({ session })

            senderWallet.balance -= amount
            receiverWallet.balance += amount
            await receiverWallet.save({ session })

            await WalletTransaction.create([
                {
                    walletID: senderWallet._id,
                    userID: id,
                    date: new Date(),
                    title: `Split Settlement for Group - ${group.groupName}`,
                    category: "Split Settlement",
                    type: "Debit",
                    amount,
                    status: "Completed",
                    source: "Group"
                },
                {
                    walletID: receiverWallet._id,
                    userID: creditor.doc.memberID,
                    date: new Date(),
                    title: `Split Settlement for Group - ${group.groupName}`,
                    category: "Split Settlement",
                    type: "Credit",
                    amount,
                    status: "Completed",
                    source: "Group"
                }
            ], { session })
        }

        await senderWallet.save({ session })
        member.balance = 0
        await member.save({ session })

        // Mark all pending group expenses as Settled if every member is now at 0
        const allSettled = groupMembers.every(m => m.balance === 0)
        if (allSettled) {
            await GroupExpense.updateMany(
                { groupCode, status: 'Pending' },
                { status: 'Settled' },
                { session }
            )
        }

        await session.commitTransaction()
        session.endSession()
        return { message: "Split settled successfully!" }
    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        throw err
    }
}

// get group service - returns the same shape the frontend expects
const getGroupService = async ({ id, groupCode }) => {
    const group = await SplitBill.findOne({ groupCode })
    if (!group) throw new Error("Group doesn't exist!")

    const members = await GroupMember.find({ groupCode })
    const requester = members.find(m => m.memberID === id)
    if (!requester) throw new Error("You are not a member of this group!")

    const expenses = await GroupExpense.find({ groupCode })

    const memberMap = {}
    let yourBalance = 0
    for (let m of members) {
        memberMap[m.memberID] = m.name
        if (m.memberID === id) yourBalance = m.balance
    }

    // Reconstruct the shape the frontend expects (group object with embedded members + expenses)
    const groupObj = group.toObject()
    groupObj.members = members.map(m => ({ memberID: m.memberID, name: m.name, balance: m.balance }))
    groupObj.expenses = expenses.map(e => e.toObject())

    return { group: groupObj, memberMap, yourBalance }
}

// leave group service
const leaveGroupService = async ({ id, groupCode }) => {
    const group = await SplitBill.findOne({ groupCode })
    if (!group) throw new Error("Group doesn't exist!")

    const member = await GroupMember.findOne({ groupCode, memberID: id })
    if (!member) throw new Error("You are not a member of this group!")
    if (member.balance !== 0) throw new Error("You need to settle group before leaving!")

    await GroupMember.deleteOne({ _id: member._id })
    return { message: "Group left successfully!" }
}

// delete group service
const deleteGroupService = async ({ id, groupCode }) => {
    const group = await SplitBill.findOne({ groupCode })
    if (!group) throw new Error("Group doesn't exist!")

    const member = await GroupMember.findOne({ groupCode, memberID: id })
    if (!member) throw new Error("You are not a member of this group!")
    if (group.createdBy !== id) throw new Error("You are not the creator of the group, you cannot delete it!")

    const allMembers = await GroupMember.find({ groupCode })
    if (allMembers.some(m => m.balance !== 0)) {
        throw new Error("You cannot delete group until all splits are settled!")
    }

    await SplitBill.deleteOne({ _id: group._id })
    await GroupMember.deleteMany({ groupCode })
    await GroupExpense.deleteMany({ groupCode })

    return { message: "Group deleted successfully!" }
}

// get all groups list service
const getAllGroupsService = async ({ id }) => {
    const memberDocs = await GroupMember.find({ memberID: id })
    const groupCodes = memberDocs.map(m => m.groupCode)
    const splitBills = await SplitBill.find({ groupCode: { $in: groupCodes } })

    const groupNameMap = {}
    for (let g of splitBills) groupNameMap[g.groupCode] = g.groupName

    const groups = memberDocs.map(m => ({
        groupName: groupNameMap[m.groupCode],
        groupCode: m.groupCode,
        balance: m.balance
    }))
    return { groups }
}

module.exports = {
    getGroupDataService,
    addGroupService,
    joinGroupService,
    addMemberService,
    addExpenseService,
    settleUpService,
    getGroupService,
    leaveGroupService,
    deleteGroupService,
    getAllGroupsService
}
