import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { assets } from "../assets/assets"
import { useNavigate, useParams } from "react-router-dom"

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
            const response = await axios.get(backend_url + `/split-bill/get-group/${groupCode}`, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                setGroup(response.data.group)
                setMemberMap(response.data.memberMap)
                setYourBalance(response.data.yourBalance)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const addMemberHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + `/split-bill/add-member/${groupCode}`, { email }, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                toast.success(response.data.message)
                window.scrollTo({ top: 0, behavior: "smooth" })
                setEmail('')
                setAddMember(false)
                getGroup()
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const settleUpHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + `/split-bill/settle-up/${groupCode}`, {}, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                toast.success(response.data.message)
                window.scrollTo({ top: 0, behavior: "smooth" })
                setSettleUp(false)
                getGroup()
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const leaveGroupHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + `/split-bill/leave-group/${groupCode}`, {}, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                toast.success(response.data.message)
                window.scrollTo({ top: 0, behavior: "smooth" })
                setLeaveGroup(false)
                getGroup()
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const deleteGroupHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + `/split-bill/delete-group/${groupCode}`, {}, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                toast.success(response.data.message)
                window.scrollTo({ top: 0, behavior: "smooth" })
                setDeleteGroup(false)
                getGroup()
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    useEffect(() => {
        getGroup()
    }, [token])

    return (
        <div className="flex flex-col gap-10 sm:gap-15 text-bodyText font-serif m-5">
            <p className="text-3xl font-bold"> Split Bill 🤝 </p>
            {/* Group Details */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.splitbill.Group}></img>
                    <p className="text-xl font-bold text-purple-300">Group Details</p>
                </div>
                <div className="flex flex-col gap-15 text-center">
                    {
                        group && <div className="text-sm sm:text-base w-full border border-gray-300 flex flex-col gap-5 rounded-xl p-7 hover:scale-103  transition-all duration-300 shadow-[0_0_60px_rgba(168,85,247,0.6)]">
                            <p className="text-2xl sm:text-3xl text-purple-300 font-bold"> {group.groupName} </p>
                            <div className="flex flex-col gap-2">
                                <p className="font-bold text-base sm:text-lg text-purple-300">Group Code </p>
                                <div className="flex gap-2 justify-center items-center border p-2 rounded-full">
                                    <p> {groupCode} </p>
                                    <img onClick={() => { navigator.clipboard.writeText(groupCode); toast.success("Group Code copied to clipboard") }} className="w-5 h-5" src={assets.website.Copy}></img>
                                </div>
                            </div>
                            {
                                yourBalance >= 0 ? <p className="font-bold bg-card p-2 rounded-full hover:bg-cardHover transition-all duration-300"> You Are Owed Rs.{yourBalance} </p> : <p className="font-bold bg-card p-2 rounded-full hover:bg-cardHover transition-all duration-300"> You Owe Rs. {yourBalance} </p>
                            }
                            <div>
                                <p className="text-base sm:text-lg text-purple-300 font-bold"> Group members </p>
                                {
                                    group.members.map((m) => {
                                        return (
                                            <div key={m._id} className="flex gap-10 mt-2 justify-center font-bold">
                                                <div className="flex gap-2">
                                                    <img src={assets.sidebar.MyProfile} className="w-6 h-6"></img>
                                                    <p> {m.name} </p>
                                                </div>
                                                {
                                                    m.balance >= 0 ? <p className="text-green-300">Is owed Rs. {m.balance} </p> : <p className="text-red-300"> Owes Rs. {-m.balance} </p>
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                    <div className="w-full p-2 flex gap-3 overflow-x-auto">
                        <div onClick={() => { setAddMember(true); setEmail('') }} className="min-w-52 bg-card rounded-full px-5 py-2 hover:scale-103 transition-all duration-300 flex gap-4 items-center justify-center">
                            <img className="w-7 h-7" src={assets.splitbill.AddMember}></img>
                            <p className="text-lg">Add Member</p>
                        </div>
                        {
                            addMember &&
                            <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-sm">
                                <div className="w-70 sm:p-10 sm:w-100 bg-card rounded-xl border border-gray-300 p-7 flex flex-col gap-7">
                                    <p className="text-2xl sm:text-3xl font-bold text-center"> Add <span className="text-purple-300"> Member </span> </p>
                                    <form onSubmit={addMemberHandler} className="flex flex-col gap-7">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-left text-sm sm:text-base font-bold">Member Email</p>
                                            <input type="email" onChange={(e) => { setEmail(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 rounded-md w-full p-1" value={email} />
                                        </div>
                                        <div className="flex flex-col gap-3 font-bold text-sm sm:text-lg">
                                            <button type="submit" className="bg-button p-1 hover:bg-buttonHover rounded-md"> Add Member </button>
                                            <button type="button" onClick={() => { setAddMember(false) }} className="bg-button p-1 hover:bg-buttonHover rounded-md"> Cancel </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        }
                        <div onClick={() => { navigate(`/add-expense/${groupCode}`) }} className="min-w-52 bg-card rounded-full px-5 py-2 hover:scale-103 transition-all duration-300 flex gap-4 items-center justify-center">
                            <img className="w-7 h-7" src={assets.expenses.AddExpense}></img>
                            <p className="text-lg">Add Expense</p>
                        </div>
                        <div onClick={() => { setSettleUp(true) }} className="min-w-52 bg-card rounded-full px-5 py-2 hover:scale-103 transition-all duration-300 flex gap-4 items-center justify-center">
                            <img className="w-7 h-7" src={assets.splitbill.SettleUp}></img>
                            <p className="text-lg">Settle Up</p>
                        </div>
                        {
                            settleUp &&
                            <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-sm">
                                <div className="w-70 sm:p-10 sm:w-100 bg-card rounded-xl border border-gray-300 p-7 flex flex-col gap-7">
                                    <p className="text-2xl sm:text-3xl font-bold text-center"> Settle <span className="text-purple-300"> Up </span> </p>
                                    <form onSubmit={settleUpHandler} className="flex flex-col gap-7">
                                        {
                                            yourBalance >= 0 ? <p className="font-bold text-sm sm:text-lg"> You Are Owed Rs. {yourBalance} </p> : <p className="font-bold text-sm sm:text-lg"> You Owe Rs. {yourBalance} </p>
                                        }
                                        <div className="flex flex-col gap-3 font-bold text-sm sm:text-lg">
                                            <button type="submit" className="bg-button p-1 hover:bg-buttonHover rounded-md"> Settle Up </button>
                                            <button type="button" onClick={() => { setSettleUp(false) }} className="bg-button p-1 hover:bg-buttonHover rounded-md"> Cancel </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        }
                        <div onClick={() => { setLeaveGroup(true) }} className="min-w-52 bg-card rounded-full px-5 py-2 hover:scale-103 transition-all duration-300 flex gap-4 items-center justify-center">
                            <img className="w-7 h-7" src={assets.splitbill.LeaveGroup}></img>
                            <p className="text-lg">Leave Group</p>
                        </div>
                        {
                            leaveGroup &&
                            <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-sm">
                                <div className="w-70 sm:p-10 sm:w-100 bg-card rounded-xl border border-gray-300 p-7 flex flex-col gap-7">
                                    <p className="text-2xl sm:text-3xl font-bold text-center"> Leave <span className="text-purple-300"> Group </span> </p>
                                    <form onSubmit={leaveGroupHandler} className="flex flex-col gap-7">
                                        <div className="font-bold text-sm sm:text-lg"> You must <span className="text-red-300"> settle all dues </span> before leaving. This action cannot be undone! </div>
                                        <div className="flex flex-col gap-3 font-bold text-sm sm:text-lg">
                                            <button type="submit" className="bg-button p-1 hover:bg-buttonHover rounded-md"> Leave Group </button>
                                            <button type="button" onClick={() => { setLeaveGroup(false) }} className="bg-button p-1 hover:bg-buttonHover rounded-md"> Cancel </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        }
                        <div onClick={() => { setDeleteGroup(true) }} className="min-w-52 bg-card rounded-full px-5 py-2 hover:scale-103 transition-all duration-300 flex gap-4 items-center justify-center">
                            <img className="w-7 h-7" src={assets.budget.Delete}></img>
                            <p className="text-lg">Delete Group</p>
                        </div>
                        {
                            deleteGroup &&
                            <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-sm">
                                <div className="w-70 sm:p-10 sm:w-100 bg-card rounded-xl border border-gray-300 p-7 flex flex-col gap-7">
                                    <p className="text-2xl sm:text-3xl font-bold text-center"> Delete <span className="text-purple-300"> Group </span> </p>
                                    <form onSubmit={deleteGroupHandler} className="flex flex-col gap-7">
                                        <div className="font-bold text-sm sm:text-lg"> This action <span className="text-red-300"> cannot be undone. </span>  All balances must be settled! </div>
                                        <div className="flex flex-col gap-3 font-bold text-sm sm:text-lg">
                                            <button type="submit" className="bg-button p-1 hover:bg-buttonHover rounded-md"> Delete Group </button>
                                            <button type="button" onClick={() => { setDeleteGroup(false) }} className="bg-button p-1 hover:bg-buttonHover rounded-md"> Cancel </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {/* Group Expenses */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.splitbill.Group}></img>
                    <p className="text-xl font-bold text-purple-300">Group Expenses</p>
                </div>
                <div className="border border-borderColour">
                    <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr] bg-card p-2 font-bold">
                        <p>Date</p>
                        <p>Title</p>
                        <p>Amount</p>
                        <p>Status</p>
                        <p>Details</p>
                    </div>
                    {
                        group && group.expenses.map((e) => {
                            return (
                                <div key={e._id}>
                                    <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr] bg-black border border-borderColour p-2 hover:border-violet-400 transition-all duration-300">
                                        <p> {new Date(e.date).getDate()}-{new Date(e.date).getMonth()}-{new Date(e.date).getFullYear()} </p>
                                        <p> {e.title} </p>
                                        <p> {e.totalAmount} </p>
                                        <p> {e.status} </p>
                                        <div>
                                            <button onClick={() => { setSelectedExpense(e) }} className="border border-violet-400 px-2 rounded-full"> VIEW </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-2 border border-borderColour p-2 hover:border-violet-400 transition-all duration-300 md:hidden">
                                        <div>
                                            <p>{e.title}</p>
                                            <p>{e.totalAmount}</p>
                                        </div>
                                        <div>
                                            <button onClick={() => { setSelectedExpense(e) }} className="border border-violet-400 py-1 px-2 rounded-full"> VIEW </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        selectedExpense &&
                        <div className="flex justify-center items-center fixed inset-0 z-50  backdrop-blur-sm">
                            <div className="flex flex-col gap-4 border w-70 bg-black  p-7 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                                <p className="text-2xl text-center font-bold text-purple-300"> Group Expense </p>
                                <div>
                                    <div className="flex gap-2 items-center">
                                        <p className="text-purple-300 font-bold">Date : </p>
                                        <p>{new Date(selectedExpense.date).getDate()}-{new Date(selectedExpense.date).getMonth()}-{new Date(selectedExpense.date).getFullYear()}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <p className="text-purple-300 font-bold">Title : </p>
                                        <p>{selectedExpense.title}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <p className="text-purple-300 font-bold">Total Amount : </p>
                                        <p>{selectedExpense.totalAmount}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <p className="text-purple-300 font-bold">Split : </p>
                                        <p>{selectedExpense.split}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <p className="text-purple-300 font-bold">Status : </p>
                                        <p>{selectedExpense.status}</p>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-center text-purple-300 font-bold"> Paid By </p>
                                        {
                                            selectedExpense.paidBy.map((p) => {
                                                return <div className="flex justify-between">
                                                    <p>{memberMap[p.memberID]}</p>
                                                    <p>{p.amount} </p>
                                                </div>
                                            })
                                        }
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-center text-purple-300 font-bold"> Split Details </p>
                                        {
                                            selectedExpense.splitDetails.map((p) => {
                                                return <div className="flex justify-between">
                                                    <p>{memberMap[p.memberID]}</p>
                                                    <p>{p.amount} </p>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                                <button onClick={() => { setSelectedExpense(null) }} className="bg-button py-1 rounded-md text-lg font-bold"> Close </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default GroupDetails