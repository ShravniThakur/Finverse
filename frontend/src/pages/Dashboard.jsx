import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { assets } from "../assets/assets"

const Dashboard = () => {
    const { token, backend_url } = useContext(AppContext)
    const [balance, setBalance] = useState(0)
    const [isLow, setIsLow] = useState(false)
    const [totalCredit, setTotalCredit] = useState(0)
    const [totalDebit, setTotalDebit] = useState(0)
    const [totalExpense, setTotalExpense] = useState(0)
    const [walletExpense, setWalletExpense] = useState(0)
    const [cashExpense, setCashExpense] = useState(0)
    const [totalBudgets, setTotalBudgets] = useState(0)
    const [totalExpenses, setTotalExpenses] = useState(0)
    const [totalSaved, setTotalSaved] = useState(0)
    const [youOwe, setYouOwe] = useState(0)
    const [youAreOwed, setYouAreOwed] = useState(0)
    const [totalGroups, setTotalGroups] = useState(0)
    const [transactions, setTransactions] = useState([])
    const [selectedTransaction, setSelectedTransaction] = useState(null)

    const month = new Date().getMonth()
    const year = new Date().getFullYear()
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

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
    const getExpenseData = async () => {
        try {
            const response = await axios.get(backend_url + '/expense/get-expense-data', {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                setTotalExpense(response.data.totalExpense)
                setWalletExpense(response.data.walletExpense)
                setCashExpense(response.data.cashExpense)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }
    const getMonthlyData = async () => {
        try {
            const response = await axios.get(backend_url + '/budget/get-monthly-budget-data', {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                setTotalBudgets(response.data.totalBudgets)
                setTotalExpenses(response.data.totalExpenses)
                setTotalSaved(response.data.saved)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }
    const getGroupData = async () => {
        try {
            const response = await axios.get(backend_url + '/split-bill/get-group-data', {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                setYouOwe(response.data.youOwe)
                setYouAreOwed(response.data.youAreOwed)
                setTotalGroups(response.data.totalGroups)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }
    const allTransactions = async () => {
        try {
            const response = await axios.get(backend_url + '/transaction/all-transactions', {
                headers: {
                    Authorization: token
                },
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
        if (token) {
            getBalance();
            getData();
            getExpenseData()
            getMonthlyData()
            getGroupData()
            allTransactions()
        }
    }, [token])

    return (
        <div className="flex flex-col gap-10 sm:gap-15 text-bodyText font-serif m-5">
            <p className="text-3xl font-bold"> Dashboard  📊 </p>

            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.dashboard.Overview}></img>
                    <p className="text-xl font-bold text-purple-300">Wallet Overview</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    <div className=" border border-violet-300 flex flex-col gap-3  rounded-xl p-5 hover:scale-103 transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.wallet.Balance}></img>
                            <p className="text-xl">Current Balance</p>
                        </div>
                        <p className="font-bold text-2xl text-blue-200">Rs. {balance}</p>
                        {
                            isLow ? <p className="text-red-300"> Your balance is low! </p> : <p> </p>
                        }
                    </div>
                    <div className="border border-violet-300 flex flex-col gap-3  rounded-xl p-5 hover:scale-103 transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.wallet.Credit}></img>
                            <p className="text-xl"> Total Credit</p>
                        </div>
                        <p className="font-bold text-2xl text-green-200"> Rs. {totalCredit} </p>
                    </div>
                    <div className="border border-violet-300 flex flex-col gap-3  rounded-xl p-5 hover:scale-103 transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.wallet.Debit}></img>
                            <p className="text-xl"> Total Debit</p>
                        </div>
                        <p className="font-bold text-2xl text-red-200"> Rs. {totalDebit} </p>
                    </div>
                </div>
                <div className="flex flex-col gap-10">
                    <div className="flex gap-4 items-center">
                        <img className="w-8 h-8" src={assets.dashboard.Overview}></img>
                        <p className="text-xl font-bold text-purple-300">Expense Overview</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        <div className=" border border-violet-300 flex flex-col gap-3  rounded-xl p-5 hover:scale-103 transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                            <div className="flex gap-4 items-center">
                                <img className="w-8 h-8" src={assets.expenses.TotalExpense}></img>
                                <p className="text-xl">Total Expense</p>
                            </div>
                            <p className="font-bold text-2xl text-blue-200">Rs. {totalExpense}</p>
                        </div>
                        <div className="border border-violet-300 flex flex-col gap-3  rounded-xl p-5 hover:scale-103 transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                            <div className="flex gap-4 items-center">
                                <img className="w-8 h-8" src={assets.expenses.WalletExpense}></img>
                                <p className="text-xl"> Wallet Expense</p>
                            </div>
                            <p className="font-bold text-2xl text-orange-200"> Rs. {walletExpense} </p>
                        </div>
                        <div className="border border-violet-300 flex flex-col gap-3  rounded-xl p-5 hover:scale-103 transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                            <div className="flex gap-4 items-center">
                                <img className="w-8 h-8" src={assets.expenses.CashExpense}></img>
                                <p className="text-xl"> Cash Expense</p>
                            </div>
                            <p className="font-bold text-2xl text-lime-100"> Rs. {cashExpense} </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-10">
                    <div className="flex gap-4 items-center">
                        <img className="w-8 h-8" src={assets.dashboard.Overview}></img>
                        <p className="text-xl font-bold text-purple-300">Budget Overview</p>
                    </div>
                    <p className="text-lg font-bold"> Month: {months[month]}, {year} </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        <div className="border border-violet-300 flex flex-col gap-3  rounded-xl p-5 hover:scale-103 transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                            <div className="flex gap-4 items-center">
                                <img className="w-8 h-8" src={assets.budget.TotalBudget}></img>
                                <p className="text-xl">Total Budgets</p>
                            </div>
                            <p className="font-bold text-2xl text-blue-200">Rs. {totalBudgets}</p>
                        </div>
                        <div className="border border-violet-300 flex flex-col gap-3  rounded-xl p-5 hover:scale-103 transition-all duration-300 shadow-[0_0_50px_rgba(168,85,247,0.6)]">
                            <div className="flex gap-4 items-center">
                                <img className="w-8 h-8" src={assets.expenses.TotalExpense}></img>
                                <p className="text-xl"> Total Expenses</p>
                            </div>
                            <p className="font-bold text-2xl text-red-200"> Rs. {totalExpenses} </p>
                        </div>
                        <div className="border border-violet-300 flex flex-col gap-3  rounded-xl p-5 hover:scale-103 transition-all duration-300 shadow-[0_0_50px_rgba(168,85,247,0.6)]">
                            <div className="flex gap-4 items-center">
                                <img className="w-8 h-8" src={assets.budget.TotalSaved}></img>
                                {
                                    totalSaved >= 0 ? <p className="text-xl"> Total Saved</p> : <p className="text-xl"> Overspent </p>
                                }
                            </div>
                            <p className="font-bold text-2xl text-green-200"> Rs. {Math.abs(totalSaved)} </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-10">
                    <div className="flex gap-4 items-center">
                        <img className="w-8 h-8" src={assets.dashboard.Overview}></img>
                        <p className="text-xl font-bold text-purple-300">Split Bill Overview</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        <div className=" border border-violet-300 flex flex-col gap-3  rounded-xl p-5 hover:scale-103 transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                            <div className="flex gap-4 items-center">
                                <img className="w-8 h-8" src={assets.splitbill.YouAreOwed}></img>
                                <p className="text-xl">You Are Owed</p>
                            </div>
                            <p className="font-bold text-2xl text-green-200">Rs. {youAreOwed}</p>
                        </div>
                        <div className="border border-violet-300 flex flex-col gap-3  rounded-xl p-5 hover:scale-103 transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                            <div className="flex gap-4 items-center">
                                <img className="w-8 h-8" src={assets.splitbill.YouOwe}></img>
                                <p className="text-xl"> You Owe </p>
                            </div>
                            <p className="font-bold text-2xl text-red-200"> Rs. {youOwe} </p>
                        </div>
                        <div className="border border-violet-300 flex flex-col gap-3  rounded-xl p-5 hover:scale-103 transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                            <div className="flex gap-4 items-center">
                                <img className="w-8 h-8" src={assets.splitbill.Group}></img>
                                <p className="text-xl"> Total Groups </p>
                            </div>
                            <p className="font-bold text-2xl text-blue-200"> {totalGroups} </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-10">
                    <div className="flex gap-4 items-center">
                        <img className="w-8 h-8" src={assets.dashboard.Overview}></img>
                        <p className="text-xl font-bold text-purple-300">Transactions Overview</p>
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
                            transactions.slice(0,10).map((t, index) => {
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
        </div>
    )
}

export default Dashboard