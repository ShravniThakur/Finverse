import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { assets } from "../assets/assets"
import AssetIcon from "../components/AssetIcon"

const GroupDetails = () => {
    const navigate = useNavigate()
    const { token, backend_url } = useContext(AppContext)
    const { groupCode } = useParams()
    const [group, setGroup] = useState(null)
    const [memberMap, setMemberMap] = useState(null)
    const [yourBalance, setYourBalance] = useState(null)
    const [selectedExpense, setSelectedExpense] = useState(null)
    const [email, setEmail] = useState('')
    const [addMember, setAddMember] = useState(false)
    const [settleUp, setSettleUp] = useState(false)
    const [leaveGroup, setLeaveGroup] = useState(false)
    const [deleteGroup, setDeleteGroup] = useState(false)

    const getGroup = async () => {
        try {
            const response = await axios.get(backend_url + `/split-bill/get-group/${groupCode}`, { headers: { Authorization: token } })
            if (response.data.success) { setGroup(response.data.group); setMemberMap(response.data.memberMap); setYourBalance(response.data.yourBalance) }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const addMemberHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + `/split-bill/add-member/${groupCode}`, { email }, { headers: { Authorization: token } })
            if (response.data.success) { toast.success(response.data.message); window.scrollTo({ top: 0, behavior: "smooth" }); setEmail(''); setAddMember(false); getGroup() }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const settleUpHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + `/split-bill/settle-up/${groupCode}`, {}, { headers: { Authorization: token } })
            if (response.data.success) { toast.success(response.data.message); window.scrollTo({ top: 0, behavior: "smooth" }); setSettleUp(false); getGroup() }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const leaveGroupHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + `/split-bill/leave-group/${groupCode}`, {}, { headers: { Authorization: token } })
            if (response.data.success) { toast.success(response.data.message); window.scrollTo({ top: 0, behavior: "smooth" }); setLeaveGroup(false); getGroup() }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const deleteGroupHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + `/split-bill/delete-group/${groupCode}`, {}, { headers: { Authorization: token } })
            if (response.data.success) { toast.success(response.data.message); window.scrollTo({ top: 0, behavior: "smooth" }); setDeleteGroup(false); getGroup() }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }

    useEffect(() => { getGroup() }, [token])

    const SectionHeader = ({ title }) => (
        <div className="section-header">
            <div className="accent-bar"></div>
            <p>{title}</p>
        </div>
    )

    const Modal = ({ title, onClose, children }) => (
        <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
            <div className="glass-card p-6 w-80 sm:w-96 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                <p className="text-xl font-bold text-white text-center">{title}</p>
                {children}
            </div>
        </div>
    )

    const getStatusBadge = (status) => {
        const map = { 'Completed': 'bg-green-500/10 text-green-400', 'Pending': 'bg-yellow-500/10 text-yellow-400', 'Not Applicable': 'bg-gray-500/10 text-gray-400' }
        return map[status] || 'bg-gray-500/10 text-gray-400'
    }

    return (
        <div className="flex flex-col gap-10 sm:gap-12 text-bodyText font-sans m-5 sm:m-7">
            <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold text-white tracking-tight">Group Details</p>
                <p className="text-sm text-[#8888A0]">Manage your group expenses and balances</p>
            </div>

            {/* Group Info Card */}
            {group && (
                <div className="flex flex-col gap-6">
                    <SectionHeader title="Group Overview" />
                    <div className="glass-card p-6 flex flex-col gap-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <p className="text-2xl font-bold text-white">{group.groupName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-sm text-[#8888A0] font-mono">{groupCode}</p>
                                    <button onClick={() => { navigator.clipboard.writeText(groupCode); toast.success("Group Code copied") }}
                                        className="w-6 h-6 flex items-center justify-center rounded text-[#7F5AF0]" style={{ background: 'rgba(127,90,240,0.15)' }}>
                                        <AssetIcon src={assets.website.Copy} size={11} />
                                    </button>
                                </div>
                            </div>
                            {yourBalance !== null && (
                                <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${yourBalance >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {yourBalance >= 0 ? `You are owed Rs. ${yourBalance}` : `You owe Rs. ${Math.abs(yourBalance)}`}
                                </div>
                            )}
                        </div>

                        {/* Member list */}
                        <div>
                            <p className="text-xs font-semibold text-[#8888A0] uppercase tracking-wider mb-3">Group Members</p>
                            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(127,90,240,0.15)' }}>
                                {group.members.map((m, i) => (
                                    <div key={m._id} className={`flex items-center justify-between px-4 py-3 ${i < group.members.length - 1 ? 'border-b border-[rgba(127,90,240,0.1)]' : ''}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-[#7F5AF0]" style={{ background: 'rgba(127,90,240,0.2)' }}>
                                                {m.name[0]?.toUpperCase()}
                                            </div>
                                            <p className="text-sm text-white">{m.name}</p>
                                        </div>
                                        <p className={`text-sm font-semibold ${m.balance > 0 ? 'text-[#4ADE80]' : m.balance < 0 ? 'text-[#F87171]' : 'text-[#8888A0]'}`}>
                                            {m.balance > 0 ? `+Rs. ${m.balance}` : m.balance < 0 ? `-Rs. ${Math.abs(m.balance)}` : 'Settled'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => { setAddMember(true); setEmail('') }} className="btn-primary flex items-center gap-2">
                            <AssetIcon src={assets.splitbill.AddMember} size={15} /> Add Member
                        </button>
                        <button onClick={() => navigate(`/add-expense/${groupCode}`)} className="btn-primary flex items-center gap-2">
                            <AssetIcon src={assets.expenses.AddExpense} size={15} /> Add Expense
                        </button>
                        <button onClick={() => setSettleUp(true)} className="btn-secondary flex items-center gap-2">
                            <AssetIcon src={assets.splitbill.SettleUp} size={15} /> Settle Up
                        </button>
                        <button onClick={() => setLeaveGroup(true)} className="btn-danger flex items-center gap-2">
                            <AssetIcon src={assets.splitbill.LeaveGroup} size={15} /> Leave Group
                        </button>
                        <button onClick={() => setDeleteGroup(true)} className="btn-danger flex items-center gap-2">
                            <AssetIcon src={assets.budget.Delete} size={15} /> Delete Group
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            {addMember && (
                <Modal title={<>Add <span className="text-[#7F5AF0]">Member</span></>} onClose={() => setAddMember(false)}>
                    <form onSubmit={addMemberHandler} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Member Email</p>
                            <input type="email" onChange={e => setEmail(e.target.value)} className="fin-input" value={email} placeholder="email@example.com" />
                        </div>
                        <button type="submit" className="btn-primary w-full">Add Member</button>
                        <button type="button" onClick={() => setAddMember(false)} className="btn-secondary w-full">Cancel</button>
                    </form>
                </Modal>
            )}
            {settleUp && (
                <Modal title={<>Settle <span className="text-[#7F5AF0]">Up</span></>} onClose={() => setSettleUp(false)}>
                    <form onSubmit={settleUpHandler} className="flex flex-col gap-4">
                        <p className="text-sm text-[#C4C4CF]">
                            {yourBalance >= 0 ? `You are owed Rs. ${yourBalance}` : `You owe Rs. ${yourBalance}`}
                        </p>
                        <button type="submit" className="btn-primary w-full">Settle Up</button>
                        <button type="button" onClick={() => setSettleUp(false)} className="btn-secondary w-full">Cancel</button>
                    </form>
                </Modal>
            )}
            {leaveGroup && (
                <Modal title={<>Leave <span className="text-[#F87171]">Group</span></>} onClose={() => setLeaveGroup(false)}>
                    <form onSubmit={leaveGroupHandler} className="flex flex-col gap-4">
                        <p className="text-sm text-[#C4C4CF]">You must <span className="text-[#F87171] font-semibold">settle all dues</span> before leaving. This action cannot be undone!</p>
                        <button type="submit" className="btn-danger w-full">Leave Group</button>
                        <button type="button" onClick={() => setLeaveGroup(false)} className="btn-secondary w-full">Cancel</button>
                    </form>
                </Modal>
            )}
            {deleteGroup && (
                <Modal title={<>Delete <span className="text-[#F87171]">Group</span></>} onClose={() => setDeleteGroup(false)}>
                    <form onSubmit={deleteGroupHandler} className="flex flex-col gap-4">
                        <p className="text-sm text-[#C4C4CF]">This action <span className="text-[#F87171] font-semibold">cannot be undone.</span> All balances must be settled!</p>
                        <button type="submit" className="btn-danger w-full">Delete Group</button>
                        <button type="button" onClick={() => setDeleteGroup(false)} className="btn-secondary w-full">Cancel</button>
                    </form>
                </Modal>
            )}

            {/* Group Expenses */}
            {group && (
                <div className="flex flex-col gap-5">
                    <SectionHeader title="Group Expenses" />
                    <div className="glass-card overflow-hidden">
                        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr] px-4 py-3" style={{ background: 'rgba(127,90,240,0.15)' }}>
                            {['Date','Title','Amount','Status','Details'].map(h => (
                                <p key={h} className="text-xs font-semibold text-[#8888A0] uppercase tracking-widest">{h}</p>
                            ))}
                        </div>
                        {group.expenses.map(e => (
                            <div key={e._id}>
                                <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr] px-4 py-3 text-sm hover:bg-white/[0.03] transition-colors" style={{ borderBottom: '1px solid rgba(127,90,240,0.1)' }}>
                                    <p className="text-[#8888A0]">{new Date(e.date).getDate()}-{new Date(e.date).getMonth()}-{new Date(e.date).getFullYear()}</p>
                                    <p className="text-white font-medium truncate">{e.title}</p>
                                    <p className="text-[#FBBF24] font-semibold">Rs. {e.totalAmount}</p>
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium w-fit ${getStatusBadge(e.status)}`}>{e.status}</span>
                                    <button onClick={() => setSelectedExpense(e)} className="btn-secondary text-xs px-3 py-1 w-fit">VIEW</button>
                                </div>
                                <div className="flex md:hidden px-4 py-3 items-center justify-between hover:bg-white/[0.03]" style={{ borderBottom: '1px solid rgba(127,90,240,0.1)' }}>
                                    <div>
                                        <p className="text-sm text-white font-medium">{e.title}</p>
                                        <p className="text-sm text-[#FBBF24] font-semibold">Rs. {e.totalAmount}</p>
                                    </div>
                                    <button onClick={() => setSelectedExpense(e)} className="btn-secondary text-xs px-3 py-1.5">VIEW</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Expense Detail Modal */}
            {selectedExpense && (
                <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSelectedExpense(null)}>
                    <div className="glass-card p-6 w-80 sm:w-96 flex flex-col gap-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <p className="text-xl font-bold text-white text-center">Group Expense</p>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: 'Date', val: `${new Date(selectedExpense.date).getDate()}-${new Date(selectedExpense.date).getMonth()}-${new Date(selectedExpense.date).getFullYear()}` },
                                { label: 'Title', val: selectedExpense.title },
                                { label: 'Total Amount', val: `Rs. ${selectedExpense.totalAmount}` },
                                { label: 'Split', val: selectedExpense.split },
                                { label: 'Status', val: selectedExpense.status },
                            ].map(({ label, val }) => (
                                <div key={label} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid rgba(127,90,240,0.1)' }}>
                                    <p className="text-xs font-semibold text-[#8888A0] uppercase tracking-wider">{label}</p>
                                    <p className="text-sm text-white">{val}</p>
                                </div>
                            ))}
                        </div>
                        {selectedExpense.paidBy?.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-[#8888A0] uppercase tracking-wider mb-2">Paid By</p>
                                {selectedExpense.paidBy.map(p => (
                                    <div key={p.memberID} className="flex justify-between py-1">
                                        <p className="text-sm text-[#C4C4CF]">{memberMap[p.memberID]}</p>
                                        <p className="text-sm text-[#4ADE80] font-semibold">Rs. {p.amount}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedExpense.splitDetails?.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-[#8888A0] uppercase tracking-wider mb-2">Split Details</p>
                                {selectedExpense.splitDetails.map(p => (
                                    <div key={p.memberID} className="flex justify-between py-1">
                                        <p className="text-sm text-[#C4C4CF]">{memberMap[p.memberID]}</p>
                                        <p className="text-sm text-[#F87171] font-semibold">Rs. {p.amount}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button onClick={() => setSelectedExpense(null)} className="btn-primary w-full">Close</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GroupDetails
