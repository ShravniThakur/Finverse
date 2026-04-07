import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { assets } from "../assets/assets"


const Transactions = () => {
    const { token, backend_url } = useContext(AppContext)
    const [transactions, setTransactions] = useState([])
    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [source, setSource] = useState('')
    const [minAmt, setMinAmt] = useState('')
    const [maxAmt, setMaxAmt] = useState('')
    const [filter, setFilter] = useState(false)

    const allTransactions = async () => {
        try {
            const params = {}
            if (fromDate) params.fromDate = fromDate
            if (toDate) params.toDate = toDate
            if (source) params.source = source
            if (minAmt) params.minAmt = Number(minAmt)
            if (maxAmt) params.maxAmt = Number(maxAmt)

            const response = await axios.get(backend_url + '/transaction/all-transactions', {
                headers: {
                    Authorization: token
                },
                params
            })
            if (response.data.success) {
                setTransactions(response.data.transactions.reverse())
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    useEffect(() => {
        allTransactions()
    }, [token, toDate, fromDate, minAmt, maxAmt, source])

    return (
        <div className="flex flex-col gap-10 sm:gap-15 text-bodyText font-serif m-5">
            <p className="text-3xl font-bold"> Transactions 🔁 </p>
            <div className="hidden lg:flex flex-wrap gap-5 text-xs">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold text-purple-300">From Date</p>
                    <input className="w-29 bg-card border border-violet-400 p-1 rounded-md [color-scheme:dark]" onChange={(e) => { setFromDate(e.target.value) }} value={fromDate} type="date" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold text-purple-300">To Date</p>
                    <input className="w-29 bg-card border border-violet-400 p-1 rounded-md [color-scheme:dark]" onChange={(e) => { setToDate(e.target.value) }} value={toDate} type="date" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold text-purple-300"> Min Amount</p>
                    <input className="w-29 bg-card border border-violet-400 p-1 rounded-md" onChange={(e) => { setMinAmt(e.target.value) }} value={minAmt} type="number" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold text-purple-300">Max Amount</p>
                    <input className="w-29 bg-card border border-violet-400 p-1 rounded-md" onChange={(e) => { setMaxAmt(e.target.value) }} value={maxAmt} type="number" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold text-purple-300">From Date</p>
                    <select className="w-29 bg-card border border-violet-400 p-1 rounded-md" onChange={(e) => { setSource(e.target.value) }}>
                        <option value="Wallet">Wallet</option>
                        <option value="Expense">Expense</option>
                        <option value="Group">Group</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col gap-5 lg:hidden">
                {
                    filter ? <button onClick={() => { setFilter(false) }} className="text-center px-2 py-1 bg-button border border-violet-400 w-20 font-bold p-2 rounded-full">Filters</button> : <button onClick={() => { setFilter(true) }} className="text-center border border-violet-400 w-20 font-bold px-2 py-1 rounded-full">Filters</button>
                }
                {
                    filter && <div className="flex flex-wrap gap-3 text-xs">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-bold text-purple-300">From Date</p>
                            <input className="w-29 bg-card border border-violet-400 p-1 rounded-md [color-scheme:dark]" onChange={(e) => { setFromDate(e.target.value) }} value={fromDate} type="date" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-bold text-purple-300">To Date</p>
                            <input className="w-29 bg-card border border-violet-400 p-1 rounded-md [color-scheme:dark]" onChange={(e) => { setToDate(e.target.value) }} value={toDate} type="date" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-bold text-purple-300"> Min Amount</p>
                            <input className="w-29 bg-card border border-violet-400 p-1 rounded-md" onChange={(e) => { setMinAmt(e.target.value) }} value={minAmt} type="number" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-bold text-purple-300">Max Amount</p>
                            <input className="w-29 bg-card border border-violet-400 p-1 rounded-md" onChange={(e) => { setMaxAmt(e.target.value) }} value={maxAmt} type="number" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-bold text-purple-300">From Date</p>
                            <select className="w-29 bg-card border border-violet-400 p-1 rounded-md" onChange={(e) => { setSource(e.target.value) }}>
                                <option value="Wallet">Wallet</option>
                                <option value="Expense">Expense</option>
                                <option value="Group">Group</option>
                            </select>
                        </div>
                    </div>
                }
            </div>
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.transactions.TransactionsList}></img>
                    <p className="text-xl font-bold text-purple-300">All Transactions</p>
                </div>
                <div className="border border-borderColour bg-black">
                    <div className="hidden lg:grid grid-cols-[0.5fr_1.5fr_0.8fr_1.5fr_1fr_0.8fr_1fr] gap-3 font-bold p-2 bg-card border border-borderColour">
                        <p>Date</p>
                        <p>Title</p>
                        <p>Source</p>
                        <p>Category</p>
                        <p>Type</p>
                        <p>Amount</p>
                        <p>Status</p>
                    </div>
                    {
                        transactions.map((t, index) => {
                            return (
                                <div key={index}>
                                    <div className="hidden lg:grid grid-cols-[0.5fr_1.5fr_0.8fr_1.5fr_1fr_0.8fr_1fr] gap-3 p-2 border border-borderColour hover:border-violet-400 transition-all duration-300">
                                        <p>{new Date(t.date).getDate()}-{new Date(t.date).getMonth() + 1}-{new Date(t.date).getFullYear()}</p>
                                        <p>{t.title}</p>
                                        <p>{t.source}</p>
                                        <p> {t.category} {t.categoryEmoji}</p>
                                        <p>{t.type} {t.typeEmoji}</p>
                                        <p>Rs. {t.amount}</p>
                                        <p>{t.status}</p>
                                    </div>
                                    <div className="flex flex-col gap-3 lg:hidden">
                                        <div className="px-5 py-2 flex items-center justify-between border border-borderColour hover:border-violet-400 transition-all duration-300">
                                            <div>
                                                <p>{t.title}</p>
                                                <p>Rs. {t.amount}</p>
                                            </div>
                                            <button onClick={() => setSelectedTransaction(t)} className="border border-button py-1 px-2 rounded-full">VIEW</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        selectedTransaction &&
                        <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm">
                            <div className="bg-card border w-70 p-7 flex flex-col gap-3 rounded-xl">
                                <p className="text-center text-purple-300 font-bold text-2xl"> Transaction </p>
                                <div>
                                    <div className="flex gap-2 items-center">
                                        <p className="font-bold text-purple-300">Date : </p>
                                        <p>{new Date(selectedTransaction.date).getDate()}-{new Date(selectedTransaction.date).getMonth() + 1}-{new Date(selectedTransaction.date).getFullYear()}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <p className="font-bold text-purple-300">Title :</p>
                                        <p>{selectedTransaction.title}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <p className="font-bold text-purple-300">Source :</p>
                                        <p>{selectedTransaction.source}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <p className="font-bold text-purple-300">Category :</p>
                                        <p>{selectedTransaction.categoryEmoji} {selectedTransaction.category}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <p className="font-bold text-purple-300">Type :</p>
                                        <p>{selectedTransaction.type} {selectedTransaction.typeEmoji}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <p className="font-bold text-purple-300">Amount :</p>
                                        <p>Rs. {selectedTransaction.amount}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <p className="font-bold text-purple-300">Status :</p>
                                        <p>{selectedTransaction.status}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedTransaction(null)} className="bg-button hover:bg-buttonHover p-1 w-full rounded-lg text-xl font-bold"> Close </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Transactions

