const mongoose = require('mongoose')

const groupMemberSchema = new mongoose.Schema({
    groupID: { type: mongoose.Schema.Types.ObjectId, ref: 'SplitBill', required: true },
    groupCode: { type: String, required: true },
    memberID: { type: String, required: true },
    name: { type: String, required: true },
    balance: { type: Number, default: 0 } // +ve -> you are owed, -ve -> you owe
}, { timestamps: true })


groupMemberSchema.index({ groupCode: 1, memberID: 1 }, { unique: true })
groupMemberSchema.index({ memberID: 1 })

const GroupMember = mongoose.model('GroupMember', groupMemberSchema)

module.exports = GroupMember
