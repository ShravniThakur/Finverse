const SplitBill = require('../models/SplitBill')
const Wallet = require('../models/Wallet')
const Transaction = require('../models/Transaction')
const User = require('../models/User')
const mongoose = require('mongoose')

// get group data service (you owe, you are owed, total groups) 
const getGroupDataService = async ({ id }) => {
    const groups = await SplitBill.find({ "members.memberID": id })
    let youOwe = 0
    let youAreOwed = 0
    let totalGroups = groups.length
    for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < groups[i].members.length; j++) {
            if (groups[i].members[j].memberID === id) {
                if (groups[i].members[j].balance > 0) youAreOwed += groups[i].members[j].balance
                else youOwe -= groups[i].members[j].balance
            }
        }
    }
    return {
        youAreOwed,
        youOwe,
        totalGroups
    }
}
// add group service
const addGroupService = async ({ id, groupName }) => {
    const groupCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const user = await User.findById(id)
    await SplitBill.create({
        userID: id,
        createdBy: id,
        groupName,
        groupCode,
        members: [{
            memberID: id,
            name: user.name,
            balance: 0
        }]
    })
    return {
        message: "Group created successfully!",
        groupCode
    }
}

// join group service
const joinGroupService = async ({ id, groupCode }) => {
    const group = await SplitBill.findOne({ groupCode })
    if (!group) {
        throw new Error("Invalid Group Code!")
    }

    const user = await User.findById(id)
    if(!user){
        throw new Error("User not found!")
    }
    const member = group.members.find((m) => m.memberID === id)

    if (member) {
        throw new Error("You are already a member of this group!")
    }
    group.members.push({
        memberID: id,
        name: user.name,
        balance: 0
    })
    await group.save()
    return {
        message: "Joined Group Successfully!"
    }
}

// add member service 
const addMemberService = async ({ id, email, groupCode }) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const member = await User.findOne({ email }).session(session)
        const group = await SplitBill.findOne({ groupCode }).session(session)
        if (!member) {
            throw new Error("Member doesn't exist!")
        }
        if (!group) {
            throw new Error("Group doesn't exist!")
        }
        if (group.members.find((m) => m.memberID === id) === undefined) {
            throw new Error("You are not a member of the group!")
        }
        if (group.members.find((m) => m.memberID == member._id)) {
            throw new Error("Member already exists in the group!")
        }
        group.members.push({
            memberID: member._id,
            name: member.name,
            balance: 0
        })
        await group.save({ session })
        await session.commitTransaction()
        await session.endSession()
        return {
            message: "Member added successfully!"
        }
    }
    catch (err) {
        await session.abortTransaction()
        await session.endSession()
        throw err
    }
}

// add expense service
const addExpenseService = async ({ id, groupCode, title, totalAmount, paidBy, split, splitDetails }) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const group = await SplitBill.findOne({ groupCode }).session(session)

        if (!group) {
            throw new Error("Group doesn't exist!")
        }
        if (group.members.find((m) => m.memberID === id) === undefined) {
            throw new Error("You are not a member of the group!")
        }

        let sum = 0
        for (let i = 0; i < paidBy.length; i++) sum += paidBy[i].amount
        if (sum !== totalAmount) {
            throw new Error("Total amount doesn't match amount paid by members!")
        }

        let paidByMap = {}
        for (let i = 0; i < paidBy.length; i++) {
            if (paidByMap[paidBy[i].memberID]) {
                throw new Error("Duplicate member in paid by!")
            }
            paidByMap[paidBy[i].memberID] = paidBy[i].amount
        }

        const groupMembers = group.members
        for (let i = 0; i < paidBy.length; i++) {
            if (!groupMembers.find((m) => m.memberID === paidBy[i].memberID)) {
                throw new Error("Paid By member doesn't exist in group!")
            }
        }

        let finalSplitDetails = []
        if (split === 'Equal') {
            let totalMembers = groupMembers.length
            let value = Math.floor(totalAmount / totalMembers)
            let rem = totalAmount % totalMembers

            for (let i = 0; i < groupMembers.length; i++) {
                let finalValue = value
                if (rem !== 0) {
                    finalValue++;
                    rem--;
                }
                finalSplitDetails.push({
                    memberID: groupMembers[i].memberID,
                    amount: finalValue
                })
                groupMembers[i].balance -= finalValue
                if (paidByMap[groupMembers[i].memberID]) groupMembers[i].balance += paidByMap[groupMembers[i].memberID]
            }

        }
        if (split === 'Custom') {
            if (splitDetails.length !== groupMembers.length) {
                throw new Error("Split details of all members must be provided!")
            }
            let sum = 0
            let splitDetailsMap = {}
            for (let i = 0; i < splitDetails.length; i++) {
                sum += splitDetails[i].amount
                if (splitDetailsMap[splitDetails[i].memberID]) {
                    throw new Error("Duplicate member in split details!")
                }
                splitDetailsMap[splitDetails[i].memberID] = splitDetails[i].amount
            }
            if (sum !== totalAmount) {
                throw new Error("Total amount doesn't match split details sum!")
            }
            for (let i = 0; i < groupMembers.length; i++) {
                if (splitDetailsMap[groupMembers[i].memberID] === undefined) {
                    throw new Error("Split member doesn't exist in group!")
                }
            }
            for (let i = 0; i < groupMembers.length; i++) {
                groupMembers[i].balance -= splitDetailsMap[groupMembers[i].memberID]
                if (paidByMap[groupMembers[i].memberID]) groupMembers[i].balance += paidByMap[groupMembers[i].memberID]
            }
            finalSplitDetails = splitDetails
        }
        group.expenses.push({
            date: new Date(),
            title,
            totalAmount,
            paidBy,
            split,
            splitDetails: finalSplitDetails,
            status: 'Pending'
        })
        await group.save({ session })

        await session.commitTransaction()
        await session.endSession()

        return {
            message: "Expense added successfully!"
        }
    }
    catch (err) {
        await session.abortTransaction()
        await session.endSession()
        throw err
    }
}

// settle up service
const settleUpService = async ({ id, groupCode }) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const group = await SplitBill.findOne({ groupCode }).session(session)
        if (!group) {
            throw new Error("Group doesn't exist!")
        }
        const member = group.members.find((m) => m.memberID === id)
        if (!member) {
            throw new Error("You are not a member of this group!")
        }
        if (member.balance >= 0) {
            throw new Error("You don't owe money!")
        }
        let creditors = []
        for (let i = 0; i < group.members.length; i++) {
            if (group.members[i].balance > 0) {
                creditors.push({
                    memberID: group.members[i].memberID,
                    balance: group.members[i].balance
                })
            }
        }

        const sender = await Wallet.findOne({ userID: id }).session(session)
        let balance = -member.balance
        if (sender.balance < balance) {
            throw new Error("Insufficient wallet balance!")
        }
        
        for (let i = 0; i < creditors.length; i++) {
            if (balance === 0) break
            const reciever = await Wallet.findOne({ userID: creditors[i].memberID }).session(session)
            let amount = 0
            if (creditors[i].balance >= balance) {
                amount = balance
                balance = 0
            }
            else {
                amount = creditors[i].balance
                balance -= creditors[i].balance
            }
            creditors[i].balance -= amount
            for (let j = 0; j < group.members.length; j++) {
                if (group.members[j].memberID === creditors[i].memberID) {
                    group.members[j].balance = creditors[i].balance
                }
            }
            // update wallets 
            sender.balance -= amount
            sender.transactions.push({
                date: new Date(),
                title: `Split Settlement for Group - ${group.groupName}`,
                category: "Split Settlement",
                type: "Debit",
                amount,
                status: "Completed"
            })
            reciever.balance += amount
            reciever.transactions.push({
                date: new Date(),
                title: `Split Settlement for Group - ${group.groupName}`,
                category: "Split Settlement",
                type: "Credit",
                amount,
                status: "Completed"
            })
            await reciever.save({ session })

            // update transaction model for wallet
            await Transaction.create([{
                userID: sender.userID,
                walletID: sender._id,
                date: new Date(),
                title: "Send Money",
                source: "Wallet",
                category: "Wallet Transfer",
                type: "Debit",
                amount: amount,
                status: "Completed"
            }], { session })
            await Transaction.create([{
                userID: reciever.userID,
                walletID: reciever._id,
                date: new Date(),
                title: "Receive Money",
                source: "Wallet",
                category: "Wallet Transfer",
                type: "Credit",
                amount: amount,
                status: "Completed"
            }], { session })

            // update transaction model for split bill
            await Transaction.create([{
                userID: sender.userID,
                groupID: group._id,
                date: new Date(),
                title: `Split Settlement for Group - ${group.groupName}`,
                source: "Group",
                category: "Group Split",
                type: "Split Settlement",
                amount: amount,
                status: "Settled"
            }], { session })
            await Transaction.create([{
                userID: reciever.userID,
                groupID: group._id,
                date: new Date(),
                title: `Split Settlement for Group - ${group.groupName}`,
                source: "Group",
                category: "Group Split",
                type: "Split Settlement",
                amount: amount,
                status: "Settled"
            }], { session })
        }
        await sender.save({ session })
        member.balance = 0

        let settled = true
        for (let i = 0; i < group.members.length; i++) {
            if (group.members[i].balance !== 0) {
                settled = false
                break
            }
        }

        if (settled) {
            for (let i = 0; i < group.expenses.length; i++) {
                group.expenses[i].status = "Settled"
            }
        }

        await group.save({ session })
        await session.commitTransaction()
        await session.endSession()

        return {
            message: "Split settled successfully!"
        }
    }
    catch (err) {
        await session.abortTransaction()
        await session.endSession()
        throw err
    }
}
// get group service
const getGroupService = async ({ id, groupCode }) => {
    const group = await SplitBill.findOne({ groupCode })
    if (!group) {
        throw new Error("Group doesn't exist!")
    }
    if (group.members.find((m) => m.memberID === id) === undefined) {
        throw new Error("You are not a member of this group!")
    }
    const memberMap = {}
    let yourBalance = 0
    for(let i=0; i<group.members.length; i++){
        if(group.members[i].memberID === id) yourBalance = group.members[i].balance
        memberMap[group.members[i].memberID] = group.members[i].name
    }
    return {
        group,
        memberMap,
        yourBalance
    }
}
// leave group service
const leaveGroupService = async ({ id, groupCode }) => {
    const group = await SplitBill.findOne({ groupCode })
    if (!group) {
        throw Error("Group does't exist!")
    }
    if (group.members.find((m) => m.memberID === id) === undefined) {
        throw new Error("You are not a member of this group!")
    }
    for (let i = 0; i < group.members.length; i++) {
        if (group.members[i].memberID === id && group.members[i].balance !== 0) {
            throw new Error("You need to settle group before leaving!")
        }
    }
    let newMembers = []
    for (let i = 0; i < group.members.length; i++) {
        if (group.members[i].memberID !== id) newMembers.push(group.members[i])
    }
    group.members = newMembers
    await group.save()
    return {
        message: "Group left successfully!"
    }
}
// delete group service
const deleteGroupService = async ({ id, groupCode }) => {
    const group = await SplitBill.findOne({ groupCode })
    if (!group) {
        throw Error("Group does't exist!")
    }
    if (group.members.find((m) => m.memberID === id) === undefined) {
        throw new Error("You are not a member of this group!")
    }
    if (group.createdBy !== id) {
        throw new Error("You are not the creator of the group, you cannot delete it!")
    }
    for (let i = 0; i < group.members.length; i++) {
        if (group.members[i].balance !== 0) {
            throw new Error("You cannot delete group until all splits are settled!")
        }
    }
    await SplitBill.deleteOne({ _id: group._id })
    return {
        message: "Group deleted successfully!"
    }
}

// get all groups list service
const getAllGroupsService = async ({ id }) => {
    const groups = await SplitBill.find({ "members.memberID": id })
    const result = groups.map((g) => {
        const member = g.members.find((m) => m.memberID === id)
        return {
            groupName: g.groupName,
            groupCode: g.groupCode,
            balance: member.balance
        }
    })
    return {
        groups: result
    }
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