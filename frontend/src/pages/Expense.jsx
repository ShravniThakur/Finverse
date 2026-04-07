import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { assets } from "../assets/assets"
import { Chart } from 'chart.js/auto'
import { Bar, Doughnut } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'

const Expense = () => {

    const { token, backend_url } = useContext(AppContext)
    const navigate = useNavigate()

    const [totalExpense, setTotalExpense] = useState(0)
    const [walletExpense, setWalletExpense] = useState(0)
    const [cashExpense, setCashExpense] = useState(0)
    const [expenseList, setExpenseList] = useState([])
    const [monthly, setMonthly] = useState([])
    const [categoryExpenses, setCategoryExpenses] = useState([])
    const [addExpenseButton, setAddExpenseButton] = useState(false)
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('Food')
    const [type, setType] = useState('Wallet')
    const [amount, setAmount] = useState('')
    const [selectedTransaction, setSelectedTransaction] = useState(null)

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
    const getExpenseList = async () => {
        try {
            const response = await axios.get(backend_url + '/expense/get-expense-list', {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                setExpenseList(response.data.response.reverse())
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }
    const getMonthlyExpenses = async () => {
        try {
            const response = await axios.get(backend_url + '/expense/get-monthly-expenses', {
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
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }
    const getCategoryExpenses = async () => {
        try {
            const response = await axios.get(backend_url + '/expense/get-category-expenses', {
                headers: {
                    Authorization: token
                },
            })
            if (response.data.success) {
                setCategoryExpenses(response.data.categoryExpenses)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const addExpenseHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + '/expense/add-expense', { title, category, type, amount: Number(amount) }, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                getExpenseData()
                getExpenseList()
                getMonthlyExpenses()
                getCategoryExpenses()
                setTitle('')
                setCategory("Food")
                setType("Wallet")
                setAmount('')
                setAddExpenseButton(false)
                window.scrollTo({ top: 0, behavior: "smooth" })
                toast.success(response.data.message)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const [year, setYear] = useState(new Date().getFullYear())
    const y = new Date().getFullYear()

    useEffect(() => {
        if (token) {
            getExpenseData()
            getExpenseList()
            getMonthlyExpenses()
            getCategoryExpenses()
        }
    }, [token, year])

    return (
        <div className="flex flex-col gap-10 sm:gap-15 text-bodyText font-serif m-5">
            <p className="text-3xl font-bold"> Expenses 💸 </p>
            {/* Quick Stats */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.dashboard.QuickStats}></img>
                    <p className="text-xl font-bold text-purple-300">Quick Stats</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    <div className=" border border-gray-300 flex flex-col gap-3 bg-card rounded-xl p-5 hover:scale-103 hover:bg-cardHover transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.expenses.TotalExpense}></img>
                            <p className="text-xl">Total Expense</p>
                        </div>
                        <p className="font-bold text-2xl">Rs. {totalExpense}</p>
                    </div>
                    <div className="border border-gray-300 flex flex-col gap-3 bg-card rounded-xl p-5 hover:scale-103 hover:bg-cardHover transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.expenses.WalletExpense}></img>
                            <p className="text-xl"> Wallet Expense</p>
                        </div>
                        <p className="font-bold text-2xl"> Rs. {walletExpense} </p>
                    </div>
                    <div className="border border-gray-300 flex flex-col gap-3 bg-card rounded-xl p-5 hover:scale-103 hover:bg-cardHover transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.expenses.CashExpense}></img>
                            <p className="text-xl"> Cash Expense</p>
                        </div>
                        <p className="font-bold text-2xl"> Rs. {cashExpense} </p>
                    </div>
                </div>
            </div>
            {/* Quick Actions */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.dashboard.QuickActions}></img>
                    <p className="text-xl font-bold text-purple-300">Quick Actions</p>
                </div>
                <div onClick={() => { setAddExpenseButton(true); setTitle(''); setCategory("Food"); setType("Wallet"); setAmount('') }} className="w-54 bg-card rounded-full px-5 py-2 hover:scale-103 hover:bg-cardHover transition-all duration-300 flex gap-4 items-center justify-center">
                    <img className="w-8 h-8" src={assets.expenses.AddExpense}></img>
                    <p className="text-xl">Add Expense</p>
                </div>
                {
                    addExpenseButton && <div className="fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center">
                        <div className="w-70 p-7 sm:w-100 sm:p-10 bg-card rounded-xl border border-gray-300">
                            <form onSubmit={addExpenseHandler} className="flex flex-col gap-3 sm:gap-4">
                                <p className="text-2xl sm:text-3xl font-bold text-center"> Add <span className="text-purple-300"> Expense </span> </p>
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm sm:text-base font-bold">Title</p>
                                    <input type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 w-full rounded-md p-1" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm sm:text-base font-bold">Category</p>
                                    <select onChange={(e) => { setCategory(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-9 w-full rounded-md p-1">
                                        <option value="Food">Food</option>
                                        <option value="Groceries">Groceries</option>
                                        <option value="Housing">Housing</option>
                                        <option value="Bills & Utilities">Bills & Utilities</option>
                                        <option value="Transportation">Transportation</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Health">Health</option>
                                        <option value="Education">Education</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Investments & Savings">Investments & Savings</option>
                                        <option value="Fees & Charges">Fees & Charges</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm sm:text-base font-bold">Type</p>
                                    <select onChange={(e) => { setType(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-9 w-full rounded-md p-1">
                                        <option value="Wallet">Wallet</option>
                                        <option value="Cash">Cash</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm sm:text-base font-bold">Amount</p>
                                    <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 w-full rounded-md p-1" />
                                </div>
                                <div className="flex flex-col gap-3 mt-3">
                                    <button type="submit" className="text-sm sm:text-lg w-full bg-button p-1 hover:bg-buttonHover rounded-md font-bold"> Add Expense </button>
                                    <button type="button" onClick={() => { setAddExpenseButton(false) }} className="text-sm sm:text-lg w-full bg-button p-1 hover:bg-buttonHover rounded-md font-bold">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </div>
            {/* Monthly Expense Activty */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.dashboard.Monthly}></img>
                    <p className="text-xl font-bold text-purple-300">Monthly Expense List</p>
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
                                    label: "Total Expense",
                                    data: monthly.map((m) => m.totalExpense),
                                    backgroundColor: "#A78BFA",

                                },
                                {
                                    label: "Wallet Expense",
                                    data: monthly.map((m) => m.walletExpense),
                                    backgroundColor: "#2CB67D",
                                },
                                {
                                    label: "Cash Expense",
                                    data: monthly.map((m) => m.cashExpense),
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
            {/* Category Wise Expense */}
            <div>
                <div className="flex flex-col gap-10">
                    <div className="flex gap-4 items-center">
                        <img className="w-8 h-8" src={assets.expenses.Category}></img>
                        <p className="text-xl font-bold text-purple-300">Category Wise Expenses</p>
                    </div>
                    <div className="flex justify-start overflow-x-auto">
                        <div className="h-70 min-w-210">
                            <Doughnut data={{
                                labels: categoryExpenses.map((c) => c.name),
                                datasets: [
                                    {
                                        label: "Total Expense",
                                        data: categoryExpenses.map((c) => c.amount),
                                        backgroundColor: ["#2CB67D", 
                                            "#38BDF8", 
                                            "#7F5AF0", 
                                            "#F59E0B", 
                                            "#3B82F6",  
                                            "#EC4899",  
                                            "#A855F7", 
                                            "#EF4444", 
                                            "#22C55E",  
                                            "#06B6D4", 
                                            "#FACC15", 
                                            "#6366F1",  
                                            "#9CA3AF",]

                                    },
                                ]
                            }} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: "right",
                                        labels: {
                                            color: "#E6E6EB",
                                            boxWidth: 12,
                                            padding: 30
                                        },
                                    },
                                    tooltip: {
                                        titleColor: "#ffffff",
                                        bodyColor: "#e5e7eb",
                                        backgroundColor: "#3A1C71",
                                    },
                                },
                                cutout: "60%",
                            }} ></Doughnut>
                        </div>
                    </div>
                </div>
            </div>
            {/* All Expenses */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.expenses.ExpenseList}></img>
                    <p className="text-xl font-bold text-purple-300">All Expenses</p>
                </div>
                <div className="flex gap-3 items-center">
                    <p className="font-bold"> View All Expenses </p>
                    <button onClick={() => { navigate('/transactions') }} className="bg-button px-3 py-1 rounded-full hover:scale-105 transition-all duration-300"> VIEW </button>
                </div>
                <div className="border border-borderColour bg-black">
                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 font-bold p-2 bg-card border border-borderColour">
                        <p>Date</p>
                        <p>Title</p>
                        <p>Category</p>
                        <p>Type</p>
                        <p>Amount</p>
                  
                    </div>
                    {
                        expenseList.slice(0, 50).map((t,index) => {
                            return (
                                <div key={index}>
                                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 p-2 border border-borderColour hover:border-violet-400 transition-all duration-300">
                                        <p>{new Date(t.date).getDate()}-{new Date(t.date).getMonth() + 1}-{new Date(t.date).getFullYear()}</p>
                                        <p>{t.title}</p>
                                        <p> {t.category} {t.categoryEmoji}</p>
                                        <p>{t.type} {t.typeEmoji}</p>
                                        <p>Rs. {t.amount}</p>
                                   
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
                                <p className="text-center text-purple-300 font-bold text-2xl"> Expense </p>
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

export default Expense