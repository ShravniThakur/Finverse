import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { assets } from "../assets/assets"
import { useParams, useNavigate } from "react-router-dom"

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
            const response = await axios.get(backend_url + `/split-bill/get-group/${groupCode}`, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                setGroup(response.data.group)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
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
                response = await axios.post(backend_url + `/split-bill/add-expense/${groupCode}`, {
                    title,
                    totalAmount: Number(totalAmount),
                    paidBy: paidByArray,
                    split,
                    splitDetails: splitDetailsArray
                }, {
                    headers: {
                        Authorization: token
                    }
                })
            }
            else {
                response = await axios.post(backend_url + `/split-bill/add-expense/${groupCode}`, {
                    title,
                    totalAmount: Number(totalAmount),
                    paidBy: paidByArray,
                    split,
                }, {
                    headers: {
                        Authorization: token
                    }
                })
            }
            if (response.data.success) {
                toast.success(response.data.message)
                setTitle('')
                setTotalAmount('')
                setPaidBy({})
                setSplit('')
                setSplitDetails({})
                setCustom(false)
                setEqual(false)
                navigate(`/group-details/${groupCode}`)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }
    useEffect(() => {
        getGroup()
    }, [token, groupCode])

    return (
        <div className="flex flex-col gap-10 sm:gap-15 text-bodyText font-serif m-5">
            <p className="text-3xl font-bold"> Split Bill 🤝 </p>
            <div className="flex justify-center">
                <button onClick={() => { setImportant(true) }} className="bg-button px-4 py-2 font-bold rounded-full"> IMPORTANT </button>
            </div>
            {
                important &&
                <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-sm">
                    <div className="flex flex-col gap-4 border w-70 sm:w-100 bg-black  p-7 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                        <p className="text-xl sm:text-2xl text-center font-bold text-purple-300"> Important </p>
                        <div className="flex justify-center">
                            <div className="flex flex-col gap-3 text-sm sm:text-base">

                                <p>• Enter the <span className="font-bold">total bill amount</span> correctly.</p>

                                <p>• You can split the payment among <span className="font-bold">multiple members</span> in “Paid By”.</p>

                                <p>
                                    • <span className="font-bold text-purple-300">Equal Split</span> divides the amount equally among all members.
                                </p>

                                <p>
                                    • <span className="font-bold text-purple-300">Custom Split</span> lets you decide how much each member owes.
                                </p>

                                <p>
                                    • The system <span className="font-bold text-yellow-200">does not use decimals</span>.
                                    If the amount cannot be split evenly,
                                    some members may be charged <span className="font-bold">₹1 extra</span>.
                                </p>

                                <p className="text-green-300 font-bold">
                                    ✔ This ensures the total always matches the bill amount.
                                </p>
                            </div>
                        </div>
                        <button onClick={() => { setImportant(false) }} className="bg-button py-1 rounded-md text-lg font-bold"> Close </button>
                    </div>
                </div>
            }
            <div className="flex justify-center">
                <div className="w-70 sm:p-10 sm:w-100 bg-card rounded-xl border border-gray-300 p-7 flex flex-col gap-3 sm:gap-4">
                    <p className="text-2xl sm:text-3xl font-bold text-center"> Add <span className="text-purple-300"> Expense </span> </p>
                    <form onSubmit={addExpenseHandler} className="flex flex-col gap-7">
                        <div className="flex flex-col gap-2">
                            <p className="text-left text-sm sm:text-base font-bold text-purple-300">Title</p>
                            <input type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 rounded-md w-full p-1" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-left text-sm sm:text-base font-bold text-purple-300">Total Amount</p>
                            <input type="number" value={totalAmount} onChange={(e) => { setTotalAmount(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 rounded-md w-full p-1" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-left text-sm sm:text-base font-bold text-purple-300">Paid By</p>
                            <div className="flex flex-col gap-1">
                                {
                                    group && group.members.map((m) => {
                                        return <div key={m.memberID} className="flex justify-between gap-2">
                                            <p className="text-left text-sm sm:text-base font-bold"> {m.name} </p>
                                            <input type="number" onChange={(e) => { setPaidBy(prev => ({ ...prev, [m.memberID]: e.target.value })) }} className="text-sm w-20 sm:w-30 sm:text-base border border-gray-300 h-5 rounded-md p-1" />
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-left text-sm sm:text-base font-bold text-purple-300"> Split Type</p>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => { setCustom(true); setEqual(false); setSplit('Custom') }} className={`p-1 px-3 rounded-full font-bold ${custom ? "bg-black border" : "bg-button"}`}>Custom </button>
                                <button type="button" onClick={() => { setEqual(true); setCustom(false); setSplit('Equal') }} className={`p-1 px-3 rounded-full font-bold ${equal ? "bg-black border" : "bg-button"}`}>Equal</button>
                            </div>
                        </div>
                        {
                            custom &&
                            <div className="flex flex-col gap-2">
                                <p className="text-left text-sm sm:text-base font-bold text-purple-300">Split Details</p>
                                <div className="flex flex-col gap-1">
                                    {
                                        group && group.members.map((m) => {
                                            return <div key={m.memberID} className="flex justify-between gap-2">
                                                <p className="text-left text-sm sm:text-base font-bold"> {m.name} </p>
                                                <input type="number" onChange={(e) => { setSplitDetails(prev => ({ ...prev, [m.memberID]: e.target.value })) }} className="text-sm sm:text-base border border-gray-300 h-5 w-30 rounded-md p-1" />
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        }
                        <div className="flex flex-col gap-3 font-bold text-sm sm:text-lg">
                            <button type="submit" className="bg-button p-1 hover:bg-buttonHover rounded-md"> Add Expense </button>
                            <button type="button" className="bg-button p-1 hover:bg-buttonHover rounded-md"> Cancel </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddSplitExpense
