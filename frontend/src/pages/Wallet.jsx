import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { assets } from "../assets/assets"
import { Chart } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'

const Wallet = () => {

    const navigate = useNavigate()
    const { token, backend_url } = useContext(AppContext)
    const [balance, setBalance] = useState(0)
    const [isLow, setIsLow] = useState(false)
    const [totalCredit, setTotalCredit] = useState(0)
    const [totalDebit, setTotalDebit] = useState(0)
    const [monthly, setMonthly] = useState([])
    const [year, setYear] = useState(new Date().getFullYear())
    const [transactions, setTransactions] = useState([])
    const [addMoneyButton, setAddMoneyButton] = useState(false)
    const [sendMoneyButton, setSendMoneyButton] = useState(false)
    const [setPinButton, setSetPinButton] = useState(false)
    const [amount, setAmount] = useState('')
    const [recipient, setRecipient] = useState('')
    const [walletPin, setWalletPin] = useState('')
    const [selectedTransaction, setSelectedTransaction] = useState(null)

    const y = new Date().getFullYear()

    const getBalance = async () => {
        try {
            const response = await axios.get(backend_url + '/wallet/get-balance', {
                headers: {
                    Authorization: token
                },
            })
            if (response.data.success) {
                setBalance(response.data.balance)
                setIsLow(response.data.isLow)
            }
            else {
                toast.error(response.data.message)
            }
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const getData = async () => {
        try {
            const response = await axios.get(backend_url + '/wallet/get-data', {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                setTotalCredit(response.data.credit)
                setTotalDebit(response.data.debit)
            }
            else {
                toast.error(response.data.message)
            }
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const getMonthlyData = async () => {
        try {
            const response = await axios.get(backend_url + '/wallet/get-monthly-data', {
                headers: {
                    Authorization: token
                },
                params: {
                    year: Number(year)
                }
            })
            if (response.data.success) {
                setMonthly(response.data.monthly)
            }
            else {
                toast.error(response.data.message)
            }
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const getTransactions = async () => {
        try {
            const response = await axios.get(backend_url + '/wallet/get-transactions', {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                setTransactions(response.data.response.reverse())
            }
            else {
                toast.error(response.data.message)
            }
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const addMoneyHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + '/wallet/add-money', { amount: Number(amount) }, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                toast.success(response.data.message)
                setAmount('')
                setAddMoneyButton(false)
                getBalance()
                getData()
                getMonthlyData()
                getTransactions()
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
            else {
                toast.error(response.data.message)
            }
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const sendMoneyHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + '/wallet/send-money', { amount: Number(amount), recipient, walletPin }, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                toast.success(response.data.message)
                setAmount('')
                setRecipient('')
                setSendMoneyButton(false)
                getBalance()
                getData()
                getMonthlyData()
                getTransactions()
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
            else {
                toast.error(response.data.message)
            }
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const setPinHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + '/wallet/set-pin', { walletPin }, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                toast.success(response.data.message)
                setWalletPin('')
                setSetPinButton(false)
                getBalance()
                getData()
                getMonthlyData()
                getTransactions()
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
            else {
                toast.error(response.data.message)
            }
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    useEffect(() => {
        if (token) {
            getBalance();
            getData();
            getMonthlyData();
            getTransactions()
        }
    }, [token, year])

    return (
        <div className="flex flex-col gap-10 sm:gap-15 text-bodyText font-serif m-5">
            <p className="text-3xl font-bold"> Wallet 👛 </p>

            {/* Quick Stats */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.dashboard.QuickStats}></img>
                    <p className="text-xl font-bold text-purple-300">Quick Stats</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    <div className=" border border-gray-300 flex flex-col gap-3 bg-card rounded-xl p-5 hover:scale-103 hover:bg-cardHover transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.wallet.Balance}></img>
                            <p className="text-xl">Current Balance</p>
                        </div>
                        <p className="font-bold text-2xl">Rs. {balance}</p>
                        {
                            isLow ? <p className="text-red-400"> Your balance is low! </p> : <p> </p>
                        }
                    </div>
                    <div className="border border-gray-300 flex flex-col gap-3 bg-card rounded-xl p-5 hover:scale-103 hover:bg-cardHover transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.wallet.Credit}></img>
                            <p className="text-xl"> Total Credit</p>
                        </div>
                        <p className="font-bold text-2xl"> Rs. {totalCredit} </p>
                    </div>
                    <div className="border border-gray-300 flex flex-col gap-3 bg-card rounded-xl p-5 hover:scale-103 hover:bg-cardHover transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.wallet.Debit}></img>
                            <p className="text-xl"> Total Debit</p>
                        </div>
                        <p className="font-bold text-2xl"> Rs. {totalDebit} </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.dashboard.QuickActions}></img>
                    <p className="text-xl font-bold text-purple-300">Quick Actions</p>
                </div>

                <div className="flex flex-wrap gap-5">
                    <div onClick={() => { setAmount(''); setAddMoneyButton(true) }} className="w-50 bg-card rounded-full px-5 py-2 hover:scale-103 hover:bg-cardHover transition-all duration-300 flex gap-4 items-center justify-center">
                        <img className="w-8 h-8" src={assets.wallet.AddMoney}></img>
                        <p className="text-xl">Add Money</p>
                    </div>
                    {
                        addMoneyButton && <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm">
                            <div className="w-70 p-7 sm:w-100 sm:p-10 bg-card rounded-xl border border-gray-300">
                                <form onSubmit={addMoneyHandler} className="flex flex-col gap-3 sm:gap-7">
                                    <p className="text-2xl sm:text-3xl font-bold text-center"> Add <span className="text-purple-300"> Money </span> </p>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm sm:text-base font-bold">Amount</p>
                                        <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 w-full rounded-md p-1" />
                                    </div>
                                    <div className="flex flex-col gap-3 mt-3">
                                        <button type="submit" className="text-sm sm:text-lg w-full bg-button p-1 hover:bg-buttonHover rounded-md font-bold"> Add Money </button>
                                        <button type="button" onClick={() => { setAddMoneyButton(false) }} className="text-sm sm:text-lg w-full bg-button p-1 hover:bg-buttonHover rounded-md font-bold">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    }
                    <div onClick={() => { setAmount(''); setSendMoneyButton(true) }} className="w-50 bg-card rounded-full px-5 py-2 hover:scale-103 hover:bg-cardHover transition-all duration-300 flex gap-4 items-center justify-center">
                        <img className="w-8 h-8" src={assets.wallet.SendMoney}></img>
                        <p className="text-xl"> Send Money</p>
                    </div>
                    {
                        sendMoneyButton && <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm">
                            <div className="w-70 p-7 sm:w-100 sm:p-10 bg-card rounded-xl border border-gray-300">
                                <form onSubmit={sendMoneyHandler} className="flex flex-col gap-3 sm:gap-4">
                                    <p className="text-2xl sm:text-3xl font-bold text-center"> Send <span className="text-purple-300"> Money </span> </p>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm sm:text-base font-bold">Recipient's Email</p>
                                        <input type="email" value={recipient} onChange={(e) => { setRecipient(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 w-full rounded-md p-1" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm sm:text-base font-bold">Amount</p>
                                        <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 w-full rounded-md p-1" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm sm:text-base font-bold">Wallet Pin</p>
                                        <input type="text" value={walletPin} onChange={(e) => { setWalletPin(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 w-full rounded-md p-1" />
                                    </div>
                                    <div className="flex flex-col gap-3 mt-3">
                                        <button type="submit" className="text-sm sm:text-lg w-full bg-button p-1 hover:bg-buttonHover rounded-md font-bold"> Send Money </button>
                                        <button type="button" onClick={() => { setSendMoneyButton(false) }} className="text-sm sm:text-lg w-full bg-button p-1 hover:bg-buttonHover rounded-md font-bold">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    }
                    <div onClick={() => { setSetPinButton(true); setWalletPin('') }} className="w-50 bg-card rounded-full px-5 py-2 hover:scale-103 hover:bg-cardHover transition-all duration-300 flex gap-4 items-center justify-center">
                        <img className="w-8 h-8" src={assets.wallet.SetPin}></img>
                        <p className="text-xl"> Set Pin</p>
                    </div>
                    {
                        setPinButton && <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm">
                            <div className="w-70 p-7 sm:w-100 sm:p-10 bg-card rounded-xl border border-gray-300">
                                <form onSubmit={setPinHandler} className="flex flex-col gap-3 sm:gap-7">
                                    <p className="text-2xl sm:text-3xl font-bold text-center"> Set <span className="text-purple-300"> Pin </span> </p>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm sm:text-base font-bold">Wallet Pin</p>
                                        <input type="text" value={walletPin} onChange={(e) => { setWalletPin(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 w-full rounded-md p-1" />
                                    </div>
                                    <div className="flex flex-col gap-3 mt-3">
                                        <button type="submit" className="text-sm sm:text-lg w-full bg-button p-1 hover:bg-buttonHover rounded-md font-bold"> Set Pin </button>
                                        <button type="button" onClick={() => { setSetPinButton(false) }} className="text-sm sm:text-lg w-full bg-button p-1 hover:bg-buttonHover rounded-md font-bold">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    }
                </div>
            </div>

            {/* Monthly Wallet Activity */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.dashboard.Monthly}></img>
                    <p className="text-xl font-bold text-purple-300">Monthly Wallet Activity</p>
                </div>
                <div className="flex gap-2 items-center">
                    <p className="font-bold"> Filter by year </p>
                    <select onChange={(e) => { setYear(e.target.value) }} className="bg-card border border-borderColour p-1 rounded-lg">
                        <option value={y}> {y} </option>
                        <option value={y - 1}> {y - 1} </option>
                        <option value={y - 2}> {y - 2} </option>
                        <option value={y - 3}> {y - 3} </option>
                        <option value={y - 4}> {y - 4} </option>
                        <option value={y - 5}> {y - 5} </option>
                        <option value={y - 6}> {y - 6} </option>
                        <option value={y - 7}> {y - 7} </option>
                        <option value={y - 8}> {y - 8} </option>
                        <option value={y - 9}> {y - 9} </option>
                    </select>
                </div>
                <div className="w-full overflow-x-auto bg-black">
                    <div className="min-w-150 h-70 sm:h-100">
                        <Bar data={{
                            labels: monthly.map((m) => m.month),
                            datasets: [
                                {
                                    label: "Credit",
                                    data: monthly.map((m) => m.credit),
                                    backgroundColor: "#2CB67D",

                                },
                                {
                                    label: "Debit",
                                    data: monthly.map((m) => m.debit),
                                    backgroundColor: "#EF4444",
                                }
                            ]
                        }} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: "#efecf3ff",
                                    },
                                },
                                tooltip: {
                                    titleColor: "#ffffff",
                                    bodyColor: "#e5e7eb",
                                    backgroundColor: "#3A1C71",
                                },
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        color: "#ffffff",
                                    },
                                    grid: {
                                        color: "#3F345F",
                                    },
                                },
                                y: {
                                    ticks: {
                                        color: "#ffffff",
                                    },
                                    grid: {
                                        color: "#3F345F",
                                    },
                                },
                            },
                        }}></Bar>
                    </div>
                </div>
            </div>

            {/* Wallet Transactions */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.wallet.WalletTransactions}></img>
                    <p className="text-xl font-bold text-purple-300">Wallet Transactions</p>
                </div>
                <div className="flex gap-3 items-center">
                    <p className="font-bold"> View All Transactions </p>
                    <button onClick={() => { navigate('/transactions') }} className="bg-button px-3 py-1 rounded-full hover:scale-105 transition-all duration-300"> VIEW </button>
                </div>
                <div className="border border-borderColour bg-black">
                    <div className="hidden md:grid grid-cols-[0.5fr_2fr_1fr_0.5fr_1fr_1fr] gap-3 font-bold p-2 bg-card border border-borderColour">
                        <p>Date</p>
                        <p>Title</p>
                        <p>Category</p>
                        <p>Type</p>
                        <p>Amount</p>
                        <p>Status</p>
                    </div>
                    {
                        transactions.slice(0, 50).map((t,index) => {
                            return (
                                <div key={index}>
                                    <div className="hidden md:grid grid-cols-[0.5fr_2fr_1fr_0.5fr_1fr_1fr] gap-3 p-2 border border-borderColour hover:border-violet-400 transition-all duration-300">
                                        <p>{new Date(t.date).getDate()}-{new Date(t.date).getMonth() + 1}-{new Date(t.date).getFullYear()}</p>
                                        <p>{t.title}</p>
                                        <p> {t.category} {t.categoryEmoji}</p>
                                        <p>{t.type} {t.typeEmoji}</p>
                                        <p>Rs. {t.amount}</p>
                                        <p>{t.status}</p>
                                    </div>
                                    <div className="flex flex-col gap-3 md:hidden">
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
                                <p className="text-center text-purple-300 font-bold text-2xl"> Wallet <br></br> Transaction </p>
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

export default Wallet