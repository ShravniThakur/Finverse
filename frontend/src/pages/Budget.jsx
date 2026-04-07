import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { assets } from "../assets/assets"
import { Chart } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'

const Budget = () => {

    const { token, backend_url } = useContext(AppContext)
    const [totalBudgets, setTotalBudgets] = useState(0)
    const [totalExpenses, setTotalExpenses] = useState(0)
    const [totalSaved, setTotalSaved] = useState(0)
    const [categoryWiseBudget, setCategoryWiseBudget] = useState([])
    const [yearlyData, setYearlyData] = useState([])
    const [insights, setInsights] = useState([])
    const [healthscore, setHealthscore] = useState(0)
    const [addBudgetButton, setAddBudgetButton] = useState(false)
    const [addMonth, setAddMonth] = useState(new Date().getMonth())
    const [addYear, setAddYear] = useState(new Date().getFullYear())
    const [addCategory, setAddCategory] = useState("Food")
    const [addAmount, setAddAmount] = useState('')
    const [edit, setEdit] = useState(false)
    const [Delete, setDelete] = useState(false)
    const [category, setCategory] = useState('')
    const [newBudget, setNewBudget] = useState('')

    const [y, setY] = useState(new Date().getFullYear())

    const month = new Date().getMonth()
    const year = new Date().getFullYear()
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const images = {}
    images["Unplanned"] = {
        pic: assets.budget.UnplannedSpending,
        border: "border-yellow-100/70",
        colour: "text-yellow-200"
    }
    images["Overspent"] = {
        pic: assets.budget.OverSpending,
        border: "border-blue-300/70",
        colour: "text-blue-300"
    }
    images["Controlled"] = {
        pic: assets.budget.ControlledSpending,
        border: "border-green-200/70",
        colour: "text-green-200/90"
    }
    images["Critical"] = {
        pic: assets.budget.CriticalSpending,
        border: "border-red-200/80",
        colour: "text-red-300"
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

    const getCategoryWiseBudget = async () => {
        try {
            const response = await axios.get(backend_url + '/budget/get-category-wise-budget', {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                setCategoryWiseBudget(response.data.response)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const getYearlyData = async () => {
        try {
            const response = await axios.get(backend_url + '/budget/get-yearly-data', {
                headers: {
                    Authorization: token
                },
                params: {
                    year: Number(y)
                }
            })
            if (response.data.success) {
                setYearlyData(response.data.data)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const getInsights = async () => {
        try {
            const response = await axios.get(backend_url + '/budget/get-insights', {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                setInsights(response.data.insights)
                setHealthscore(response.data.healthscore)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const addBudgetHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + '/budget/add-budget', {
                month: Number(addMonth),
                year: Number(addYear),
                category: addCategory,
                totalBudget: Number(addAmount),
            }, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                window.scrollTo({ top: 0, behavior: "smooth" })
                getMonthlyData()
                getCategoryWiseBudget()
                getYearlyData()
                getInsights()
                setAddBudgetButton(false)
                setAddMonth(new Date().getMonth())
                setAddYear(new Date().getFullYear())
                setAddAmount('')
                setAddCategory("Food")
                toast.success(response.data.message)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const editBudgetHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(backend_url + '/budget/edit-budget', {
                month,
                year,
                category,
                newBudget: Number(newBudget)
            }, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                window.scrollTo({ top: 0, behavior: "smooth" })
                setCategory('')
                setEdit(false)
                getMonthlyData()
                getCategoryWiseBudget()
                getYearlyData()
                getInsights()
                toast.success(response.data.message)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const deleteBudgetHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.delete(backend_url + '/budget/delete-budget', {
                data: {
                    month,
                    year,
                    category
                },
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                window.scrollTo({ top: 0, behavior: "smooth" })
                setCategory('')
                setDelete(false)
                getMonthlyData()
                getCategoryWiseBudget()
                getYearlyData()
                getInsights()
                toast.success(response.data.message)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    useEffect(() => {
        getMonthlyData()
        getCategoryWiseBudget()
        getYearlyData()
        getInsights()
    }, [token, y])

    return (
        <div className="flex flex-col gap-10 sm:gap-15 text-bodyText font-serif m-5">
            <p className="text-3xl font-bold"> Budget 🧮 </p>
            {/* Monthly Quick Stats */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.dashboard.QuickStats}></img>
                    <p className="text-xl font-bold text-purple-300">Quick Stats</p>
                </div>
                <p className="text-lg font-bold"> Month: {months[month]}, {year} </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    <div className="border border-gray-300 flex flex-col gap-3 bg-card rounded-xl p-5 hover:scale-103 hover:bg-cardHover transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.budget.TotalBudget}></img>
                            <p className="text-xl">Total Budgets</p>
                        </div>
                        <p className="font-bold text-2xl">Rs. {totalBudgets}</p>
                    </div>
                    <div className="border border-gray-300 flex flex-col gap-3 bg-card rounded-xl p-5 hover:scale-103 hover:bg-cardHover transition-all duration-300 shadow-[0_0_50px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.expenses.TotalExpense}></img>
                            <p className="text-xl"> Total Expenses</p>
                        </div>
                        <p className="font-bold text-2xl"> Rs. {totalExpenses} </p>
                    </div>
                    <div className="border border-gray-300 flex flex-col gap-3 bg-card rounded-xl p-5 hover:scale-103 hover:bg-cardHover transition-all duration-300 shadow-[0_0_50px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.budget.TotalSaved}></img>
                            {
                                totalSaved >= 0 ? <p className="text-xl"> Total Saved</p> : <p className="text-xl"> Overspent </p>
                            }
                        </div>
                        <p className="font-bold text-2xl"> Rs. {Math.abs(totalSaved)} </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <img className="h-8 w-8" src={assets.budget.HealthScore}></img>
                    <p className="text-lg font-bold"> Healthscore </p>
                </div>
                <div className="overflow-x-auto">
                    <div className="h-25 min-w-150">
                        <Bar data={{
                            labels: ["Healthscore"],
                            datasets: [{
                                label: "Healthscore",
                                data: [healthscore],
                                backgroundColor: "#2CB67D"
                            }]
                        }} options={{
                            indexAxis: "y",
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: "#FFFFFF",
                                    },
                                },
                                tooltip: {
                                    titleColor: "#3A1C71",
                                    bodyColor: "#FFFFFF",
                                    backgroundColor: "#3A1C71",
                                },
                            },
                            scales: {
                                x: {
                                    min: 0,
                                    max: 100,
                                    ticks: {
                                        color: "#ffffff",
                                    },
                                    grid: {
                                        color: "#000000",
                                    },
                                },
                                y: {
                                    ticks: {
                                        color: "#ffffff",
                                    },
                                    grid: {
                                        color: "#000000",
                                    },
                                },
                            },
                        }}>
                        </Bar>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.dashboard.QuickActions}></img>
                    <p className="text-xl font-bold text-purple-300">Quick Actions</p>
                </div>
                <div onClick={() => { setAddBudgetButton(true) }} className="w-54 bg-card rounded-full px-5 py-2 hover:scale-103 hover:bg-cardHover transition-all duration-300 flex gap-4 items-center justify-center">
                    <img className="w-8 h-8" src={assets.expenses.AddExpense}></img>
                    <p className="text-xl">Add Budget</p>
                </div>
                {
                    addBudgetButton &&
                    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center ">
                        <form onSubmit={addBudgetHandler} className="w-70 p-7 sm:w-100 sm:p-10 bg-card flex flex-col rounded-xl border border-gray-300 gap-3 sm:gap-4">
                            <p className="text-2xl sm:text-3xl font-bold text-center"> Add <span className="text-purple-300">Budget</span></p>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm sm:text-base font-bold">Month</p>
                                <select onChange={(e) => { setAddMonth(e.target.value) }} className="text-sm sm:text-base w-full border border-gray-300 h-8 sm:h-9 rounded p-1">
                                    <option value={0}> {months[0]} </option>
                                    <option value={1}> {months[1]} </option>
                                    <option value={2}> {months[2]} </option>
                                    <option value={3}> {months[3]} </option>
                                    <option value={4}> {months[4]} </option>
                                    <option value={5}> {months[5]} </option>
                                    <option value={6}> {months[6]} </option>
                                    <option value={7}> {months[7]} </option>
                                    <option value={8}> {months[8]} </option>
                                    <option value={9}> {months[9]} </option>
                                    <option value={10}> {months[10]} </option>
                                    <option value={11}> {months[11]} </option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm sm:text-base font-bold">Year</p>
                                <select onChange={(e) => { setAddYear(e.target.value) }} className="text-sm sm:text-base w-full border border-gray-300 h-8 sm:h-9 rounded p-1">
                                    <option value={year}> {year} </option>
                                    <option value={year + 1}> {year + 1} </option>
                                    <option value={year + 2}> {year + 2} </option>
                                    <option value={year + 3}> {year + 3} </option>
                                    <option value={year + 4}> {year + 4} </option>
                                    <option value={year + 5}> {year + 5} </option>
                                    <option value={year + 6}> {year + 6} </option>
                                    <option value={year + 7}> {year + 7} </option>
                                    <option value={year + 8}> {year + 8} </option>
                                    <option value={year + 9}> {year + 9} </option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm sm:text-base font-bold">Category</p>
                                <select onChange={(e) => { setAddCategory(e.target.value) }} className="text-sm sm:text-base w-full border border-gray-300 h-8 sm:h-9 rounded p-1">
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
                                <p className="text-sm sm:text-base font-bold">Total Budget</p>
                                <input type="number" value={addAmount} onChange={(e) => { setAddAmount(e.target.value) }} className="text-sm sm:text-base w-full border border-gray-300 h-8 sm:h-9 rounded p-1" />
                            </div>
                            <div className="flex flex-col gap-2 mt-3">
                                <button type="submit" className="text-sm sm:text-lg w-full bg-button p-1 hover:bg-buttonHover rounded-md font-bold"> Add Budget </button>
                                <button type="button" onClick={() => { setAddBudgetButton(false) }} className="text-sm sm:text-lg w-full bg-button p-1 hover:bg-buttonHover rounded-md font-bold"> Cancel </button>
                            </div>
                        </form>
                    </div>
                }
            </div>

            {/* Monthly Category Wise Budgets */}
            <div className="flex flex-col gap-10 ">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.dashboard.Monthly}></img>
                    <p className="text-xl font-bold text-purple-300">Monthly Category Wise Budgets</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {
                        categoryWiseBudget.map((b) => {
                            return (
                                <div key={b.category} className="w-full p-5 rounded-xl border border-violet-400/70 text-sm hover:border-white transition-all duration-500">
                                    <p className="pb-3 text-base font-bold"> {b.category} {b.emoji} </p>
                                    <div className="flex flex-col gap-5 sm:flex-row sm:justify-between sm:items-end">
                                        <div>
                                            <div className="flex gap-2">
                                                <p className="font-semibold text-purple-300">Budget: </p>
                                                <p>Rs. {b.totalBudget}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <p className="font-semibold text-purple-300">Expense: </p>
                                                <p>Rs. {b.totalExpense}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {
                                                    b.totalSaved >= 0 ? <p className="font-semibold text-green-200/90">Saved: </p> : <p className="font-semibold text-red-300">Overspent: </p>
                                                }
                                                <p>Rs. {Math.abs(b.totalSaved)}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div onClick={() => { setEdit(true); setCategory(b.category) }} className="flex gap-2 bg-button py-1 px-2 rounded-md justify-center items-center hover:bg-buttonHover">
                                                <img className="w-4 h-4" src={assets.budget.Edit}></img>
                                                <button>Edit</button>
                                            </div>
                                            <div onClick={() => { setDelete(true); setCategory(b.category) }} className="flex gap-2 bg-button py-1 px-2 rounded-md justify-center items-center hover:bg-buttonHover">
                                                <img className="w-4 h-4" src={assets.budget.Delete}></img>
                                                <button>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {
                edit &&
                <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-sm">
                    <div className="w-70 p-7 sm:p-10 sm:w-100 bg-card rounded-xl border border-gray-300 flex flex-col gap-7">
                        <p className="text-2xl sm:text-3xl font-bold text-center"> Edit <span className="text-purple-300"> Budget </span> </p>
                        <form onSubmit={editBudgetHandler} className="flex flex-col gap-7">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm sm:text-base font-bold">New Budget</p>
                                <input type="number" onChange={(e) => { setNewBudget(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 rounded-md w-full p-1" value={newBudget} />
                            </div>
                            <div className="flex flex-col gap-3 font-bold text-sm sm:text-lg">
                                <button type="submit" className="bg-button p-1 hover:bg-buttonHover rounded-md"> Edit Budget </button>
                                <button type="button" onClick={() => { setEdit(false) }} className="bg-button p-1 hover:bg-buttonHover rounded-md"> Cancel </button>
                            </div>
                        </form>
                    </div>
                </div>
            }

            {
                Delete &&
                <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-sm">
                    <div className="w-70 p-7 sm:p-10 sm:w-100 bg-card rounded-xl border border-gray-300 flex flex-col gap-7">
                        <p className="text-2xl sm:text-3xl font-bold text-center"> Delete <span className="text-purple-300"> Budget </span> </p>
                        <form onSubmit={deleteBudgetHandler} className="flex flex-col gap-7">
                            <div className="text-sm sm:text-base font-bold w-full">
                                Are you sure you want to <span className="text-red-300"> DELETE </span>  this budget? This action cannot be undone.
                            </div>
                            <div className="flex flex-col gap-3 font-bold text-sm sm:text-lg">
                                <button type="submit" className="bg-button p-1 hover:bg-buttonHover rounded-md"> Delete Budget </button>
                                <button type="button" onClick={() => { setDelete(false) }} className="bg-button p-1 hover:bg-buttonHover rounded-md"> Cancel </button>
                            </div>
                        </form>
                    </div>
                </div>
            }

            {/* Monthly Insights */}
            <div className="flex flex-col gap-5">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.dashboard.Monthly}></img>
                    <p className="text-xl font-bold text-purple-300">Monthly Insights</p>
                </div>
                {
                    insights.map((i,index) => {
                        return (
                            <div key={index} className={`flex flex-col gap-2 p-3 rounded-lg border ${images[i.type].border} hover:border-white`}>
                                <div className="flex items-center gap-2">
                                    <img className="w-6 h-6" src={images[i.type].pic}></img>
                                    <p className={`${images[i.type].colour} font-bold`}>{i.type}</p>
                                </div>
                                <div>
                                    {i.message}
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {/* Yearly Budget */}
            <div className="flex flex-col gap-8">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.dashboard.Monthly}></img>
                    <p className="text-xl font-bold text-purple-300">Yearly Budget</p>
                </div>
                <div className="flex gap-2 items-center">
                    <p className="font-bold"> Filter by year </p>
                    <select onChange={(e) => { setY(e.target.value) }} className="bg-card border border-borderColour p-1 rounded-lg">
                        <option value={year - 9}> {year - 9} </option>
                        <option value={year - 8}> {year - 8} </option>
                        <option value={year - 7}> {year - 7} </option>
                        <option value={year - 6}> {year - 6} </option>
                        <option value={year - 5}> {year - 5} </option>
                        <option value={year - 4}> {year - 4} </option>
                        <option value={year - 3}> {year - 3} </option>
                        <option value={year - 2}> {year - 2} </option>
                        <option value={year - 1}> {year - 1} </option>
                        <option value={year}> {year} </option>
                        <option value={year + 1}> {year + 1} </option>
                        <option value={year + 2}> {year + 2} </option>
                        <option value={year + 3}> {year + 3} </option>
                        <option value={year + 4}> {year + 4} </option>
                        <option value={year + 5}> {year + 5} </option>
                        <option value={year + 6}> {year + 6} </option>
                        <option value={year + 7}> {year + 7} </option>
                        <option value={year + 8}> {year + 8} </option>
                        <option value={year + 9}> {year + 9} </option>
                    </select>
                </div>
                {
                    yearlyData.map((d,index) => {
                        return (
                            <div key={index}>
                                <div className="flex gap-2 items-center">
                                    <img className="w-8 h-8" src={assets.months[d.m]}></img>
                                    <p className="font-bold text-lg">{months[d.m]}, {y}</p>
                                </div>
                                <div className="overflow-x-auto bg-black">
                                    <div className="min-w-450 h-60">
                                        <Bar data={{
                                            labels: d.response.map((r) => r.category),
                                            datasets: [
                                                {
                                                    label: "Total Budget",
                                                    data: d.response.map((r) => r.totalBudget),
                                                    backgroundColor: "#A78BFA"
                                                },
                                                {
                                                    label: "Total Expense",
                                                    data: d.response.map((r) => r.totalExpense),
                                                    backgroundColor: "#60A5FA"
                                                },
                                                {
                                                    label: "Total Saved",
                                                    data: d.response.map((r) => r.totalSaved),
                                                    backgroundColor: "#34D399"
                                                },
                                                {
                                                    label: "Overspent",
                                                    data: d.response.map((r) => r.overspent),
                                                    backgroundColor: "#F87171"
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
                                        }}>
                                        </Bar>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Budget