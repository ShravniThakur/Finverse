import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import AssetIcon from "../components/AssetIcon"

const AddSplitExpense = () => {
    const navigate = useNavigate()
    const { token, backend_url } = useContext(AppContext)
    const { groupCode } = useParams()
    const [group, setGroup] = useState(null)
    const [title, setTitle] = useState('')
    const [totalAmount, setTotalAmount] = useState('')
    const [paidBy, setPaidBy] = useState({})
    const [split, setSplit] = useState('')
    const [splitDetails, setSplitDetails] = useState({})
    const [custom, setCustom] = useState(false)
    const [equal, setEqual] = useState(false)
    const [important, setImportant] = useState(false)

    const getGroup = async () => {
        try {
            const response = await axios.get(backend_url + `/split-bill/get-group/${groupCode}`, { headers: { Authorization: token } })
            if (response.data.success) setGroup(response.data.group)
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }

    const addExpenseHandler = async (e) => {
        e.preventDefault()
        let paidByArray = []
        let splitDetailsArray = []
        for (let key in paidBy) paidByArray.push({ memberID: key, amount: Number(paidBy[key]) })
        if (custom) {
            for (let key in splitDetails) splitDetailsArray.push({ memberID: key, amount: Number(splitDetails[key]) })
        }
        try {
            let response = null
            if (custom) {
                response = await axios.post(backend_url + `/split-bill/add-expense/${groupCode}`, { title, totalAmount: Number(totalAmount), paidBy: paidByArray, split, splitDetails: splitDetailsArray }, { headers: { Authorization: token } })
            } else {
                response = await axios.post(backend_url + `/split-bill/add-expense/${groupCode}`, { title, totalAmount: Number(totalAmount), paidBy: paidByArray, split }, { headers: { Authorization: token } })
            }
            if (response.data.success) {
                toast.success(response.data.message)
                setTitle(''); setTotalAmount(''); setPaidBy({}); setSplit(''); setSplitDetails({}); setCustom(false); setEqual(false)
                navigate(`/group-details/${groupCode}`)
            } else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }

    useEffect(() => { getGroup() }, [token, groupCode])

    return (
        <div className="flex flex-col gap-8 text-bodyText font-sans m-5 sm:m-7">
            <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold text-white tracking-tight">Add Split Expense</p>
                <p className="text-sm text-[#8888A0]">Split your bill fairly among group members</p>
            </div>

            {/* Important Note button */}
            <div className="flex justify-center">
                <button
                    onClick={() => setImportant(true)}
                    className="btn-secondary flex items-center gap-2 px-6 py-2.5"
                >
                    <AssetIcon src={assets.website.Question} size={15} /> Important Notes
                </button>
            </div>

            {/* Important Modal */}
            {important && (
                <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setImportant(false)}>
                    <div className="glass-card p-6 w-80 sm:w-[420px] flex flex-col gap-5" onClick={e => e.stopPropagation()}>
                        <p className="text-xl font-bold text-white text-center">Important</p>
                        <div className="flex flex-col gap-3 text-sm text-[#C4C4CF]">
                            <div className="flex gap-2">
                                <span className="text-[#7F5AF0] mt-0.5 flex-shrink-0">•</span>
                                <p>Enter the <span className="text-white font-semibold">total bill amount</span> correctly.</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[#7F5AF0] mt-0.5 flex-shrink-0">•</span>
                                <p>You can split the payment among <span className="text-white font-semibold">multiple members</span> in "Paid By".</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[#4ADE80] mt-0.5 flex-shrink-0">•</span>
                                <p><span className="text-[#4ADE80] font-semibold">Equal Split</span> divides the amount equally among all members.</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[#7F5AF0] mt-0.5 flex-shrink-0">•</span>
                                <p><span className="text-[#7F5AF0] font-semibold">Custom Split</span> lets you decide how much each member owes.</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[#FBBF24] mt-0.5 flex-shrink-0">•</span>
                                <p>The system <span className="text-[#FBBF24] font-semibold">does not use decimals</span>. If the amount cannot be split evenly, some members may be charged <span className="text-white font-semibold">₹1 extra</span>.</p>
                            </div>
                            <div className="p-3 rounded-xl" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
                                <p className="text-[#4ADE80] font-semibold text-xs">✔ This ensures the total always matches the bill amount.</p>
                            </div>
                        </div>
                        <button onClick={() => setImportant(false)} className="btn-primary w-full">Got it</button>
                    </div>
                </div>
            )}

            {/* Main Form */}
            <div className="flex justify-center">
                <div className="glass-card p-6 sm:p-8 w-full max-w-md flex flex-col gap-6">
                    <p className="text-xl font-bold text-white text-center">Add <span className="text-[#7F5AF0]">Expense</span></p>
                    <form onSubmit={addExpenseHandler} className="flex flex-col gap-5">
                        {/* Title */}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Title</p>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="fin-input" placeholder="e.g. Dinner at Pizza Hut" />
                        </div>

                        {/* Total Amount */}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Total Amount</p>
                            <input type="number" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} className="fin-input" placeholder="e.g. 1200" />
                        </div>

                        {/* Paid By */}
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-medium text-[#8888A0]">Paid By</p>
                            <div className="flex flex-col gap-2">
                                {group && group.members.map(m => (
                                    <div key={m.memberID} className="flex justify-between items-center gap-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(127,90,240,0.12)' }}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[#7F5AF0]" style={{ background: 'rgba(127,90,240,0.15)' }}>
                                                {m.name[0]?.toUpperCase()}
                                            </div>
                                            <p className="text-sm text-white font-medium">{m.name}</p>
                                        </div>
                                        <input
                                            type="number"
                                            onChange={e => setPaidBy(prev => ({ ...prev, [m.memberID]: e.target.value }))}
                                            className="fin-input"
                                            style={{ width: '90px', padding: '4px 10px', fontSize: '13px' }}
                                            placeholder="0"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Split Type */}
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-medium text-[#8888A0]">Split Type</p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setCustom(true); setEqual(false); setSplit('Custom') }}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                                    style={custom
                                        ? { background: '#7F5AF0', color: '#fff' }
                                        : { background: 'rgba(255,255,255,0.04)', color: '#8888A0', border: '1px solid rgba(127,90,240,0.2)' }
                                    }
                                >Custom</button>
                                <button
                                    type="button"
                                    onClick={() => { setEqual(true); setCustom(false); setSplit('Equal') }}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                                    style={equal
                                        ? { background: '#7F5AF0', color: '#fff' }
                                        : { background: 'rgba(255,255,255,0.04)', color: '#8888A0', border: '1px solid rgba(127,90,240,0.2)' }
                                    }
                                >Equal</button>
                            </div>
                        </div>

                        {/* Custom Split Details */}
                        {custom && (
                            <div className="flex flex-col gap-3">
                                <p className="text-sm font-medium text-[#8888A0]">Split Details</p>
                                <div className="flex flex-col gap-2">
                                    {group && group.members.map(m => (
                                        <div key={m.memberID} className="flex justify-between items-center gap-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(127,90,240,0.12)' }}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[#7F5AF0]" style={{ background: 'rgba(127,90,240,0.15)' }}>
                                                    {m.name[0]?.toUpperCase()}
                                                </div>
                                                <p className="text-sm text-white font-medium">{m.name}</p>
                                            </div>
                                            <input
                                                type="number"
                                                onChange={e => setSplitDetails(prev => ({ ...prev, [m.memberID]: e.target.value }))}
                                                className="fin-input"
                                                style={{ width: '90px', padding: '4px 10px', fontSize: '13px' }}
                                                placeholder="0"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-3 pt-2">
                            <button type="submit" className="btn-primary w-full">Add Expense</button>
                            <button type="button" onClick={() => navigate(-1)} className="btn-secondary w-full">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddSplitExpense
