import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { assets } from "../assets/assets"
import AssetIcon from "../components/AssetIcon"
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
    const [loading, setLoading] = useState(true)

    const [y, setY] = useState(new Date().getFullYear())

    const month = new Date().getMonth()
    const year = new Date().getFullYear()
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

    const insightStyles = {
        "Unplanned": { cls: "text-yellow-300", bg: "bg-yellow-500/10 border-yellow-500/20" },
        "Overspent": { cls: "text-blue-300", bg: "bg-blue-500/10 border-blue-500/20" },
        "Controlled": { cls: "text-green-300", bg: "bg-green-500/10 border-green-500/20" },
        "Critical": { cls: "text-red-300", bg: "bg-red-500/10 border-red-500/20" },
    }

    const getMonthlyData = async () => {
        try {
            const response = await axios.get(backend_url + '/budget/get-monthly-budget-data', { headers: { Authorization: token } })
            if (response.data.success) { setTotalBudgets(response.data.totalBudgets); setTotalExpenses(response.data.totalExpenses); setTotalSaved(response.data.saved) }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const getCategoryWiseBudget = async () => {
        try {
            const response = await axios.get(backend_url + '/budget/get-category-wise-budget', { headers: { Authorization: token } })
            if (response.data.success) setCategoryWiseBudget(response.data.response)
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const getYearlyData = async () => {
        try {
            const response = await axios.get(backend_url + '/budget/get-yearly-data', { headers: { Authorization: token }, params: { year: Number(y) } })
            if (response.data.success) setYearlyData(response.data.data)
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const getInsights = async () => {
        try {
            const response = await axios.get(backend_url + '/budget/get-insights', { headers: { Authorization: token } })
            if (response.data.success) { setInsights(response.data.insights); setHealthscore(response.data.healthscore) }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const addBudgetHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + '/budget/add-budget', { month: Number(addMonth), year: Number(addYear), category: addCategory, totalBudget: Number(addAmount) }, { headers: { Authorization: token } })
            if (response.data.success) {
                window.scrollTo({ top: 0, behavior: "smooth" })
                getMonthlyData(); getCategoryWiseBudget(); getYearlyData(); getInsights()
                setAddBudgetButton(false); setAddMonth(new Date().getMonth()); setAddYear(new Date().getFullYear()); setAddAmount(''); setAddCategory("Food")
                toast.success(response.data.message)
            } else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const editBudgetHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(backend_url + '/budget/edit-budget', { month, year, category, newBudget: Number(newBudget) }, { headers: { Authorization: token } })
            if (response.data.success) {
                window.scrollTo({ top: 0, behavior: "smooth" }); setCategory(''); setEdit(false)
                getMonthlyData(); getCategoryWiseBudget(); getYearlyData(); getInsights()
                toast.success(response.data.message)
            } else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const deleteBudgetHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.delete(backend_url + '/budget/delete-budget', { data: { month, year, category }, headers: { Authorization: token } })
            if (response.data.success) {
                window.scrollTo({ top: 0, behavior: "smooth" }); setCategory(''); setDelete(false)
                getMonthlyData(); getCategoryWiseBudget(); getYearlyData(); getInsights()
                toast.success(response.data.message)
            } else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }

    useEffect(() => {
        setLoading(true)
        Promise.all([getMonthlyData(), getCategoryWiseBudget(), getYearlyData(), getInsights()]).finally(() => setLoading(false))
    }, [token, y])

    const SkeletonCard = () => (
        <div className="glass-card p-5 animate-pulse">
            <div className="h-3 w-24 rounded mb-4" style={{ background: 'rgba(255,255,255,0.08)' }}></div>
            <div className="h-8 w-32 rounded" style={{ background: 'rgba(255,255,255,0.08)' }}></div>
        </div>
    )

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

    const categories = ["Food","Groceries","Housing","Bills & Utilities","Transportation","Entertainment","Shopping","Health","Education","Travel","Investments & Savings","Fees & Charges","Others"]

    return (
        <div className="flex flex-col gap-10 sm:gap-12 text-bodyText font-sans m-5 sm:m-7">
            <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold text-white tracking-tight">Budget</p>
                <p className="text-sm text-[#8888A0]">Plan smarter and track your monthly spending limits</p>
            </div>

            {/* Monthly Quick Stats */}
            <div className="flex flex-col gap-5">
                <SectionHeader title={`Quick Stats — ${months[month]}, ${year}`} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {loading ? [1,2,3].map(i => <SkeletonCard key={i} />) : (
                        <>
                            {[
                                { label: 'Total Budgets', value: `Rs. ${totalBudgets}`, icon: assets.budget.TotalBudget, cls: 'text-white' },
                                { label: 'Total Expenses', value: `Rs. ${totalExpenses}`, icon: assets.expenses.TotalExpense, cls: 'text-[#F87171]' },
                                { label: totalSaved >= 0 ? 'Total Saved' : 'Overspent', value: `Rs. ${Math.abs(totalSaved)}`, icon: assets.budget.TotalSaved, cls: totalSaved >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]' },
                            ].map(({ label, value, icon, cls }) => (
                                <div key={label} className="glass-card p-5 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold text-[#8888A0] uppercase tracking-wider">{label}</p>
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(127,90,240,0.15)' }}><AssetIcon src={icon} size={18} /></div>
                                    </div>
                                    <p className={`text-3xl font-bold ${cls}`}>{value}</p>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Health Score */}
                <div className="glass-card p-4 overflow-x-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <p className="text-xs font-semibold text-[#8888A0] uppercase tracking-wider">Financial Health Score</p>
                    </div>
                    <div className="min-w-[400px] h-20">
                        <Bar data={{
                            labels: ["Healthscore"],
                            datasets: [{ label: "Healthscore", data: [healthscore], backgroundColor: healthscore > 70 ? "#4ADE80" : healthscore > 40 ? "#FBBF24" : "#F87171" }]
                        }} options={{
                            indexAxis: "y", responsive: true, maintainAspectRatio: false,
                            plugins: {
                                legend: { labels: { color: "#C4C4CF" } },
                                tooltip: { titleColor: "#ffffff", bodyColor: "#e5e7eb", backgroundColor: "rgba(15,0,32,0.95)" },
                            },
                            scales: {
                                x: { min: 0, max: 100, ticks: { color: "#8888A0" }, grid: { color: "rgba(255,255,255,0.05)" } },
                                y: { ticks: { color: "#8888A0" }, grid: { color: "rgba(255,255,255,0.05)" } },
                            },
                        }}></Bar>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Quick Actions" />
                <button onClick={() => setAddBudgetButton(true)} className="btn-primary flex items-center gap-2 w-fit">
                    <AssetIcon src={assets.budget.TotalBudget} size={16} /> Add Budget
                </button>
            </div>

            {/* Add Budget Modal */}
            {addBudgetButton && (
                <Modal title={<>Add <span className="text-[#7F5AF0]">Budget</span></>} onClose={() => setAddBudgetButton(false)}>
                    <form onSubmit={addBudgetHandler} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Month</p>
                            <select onChange={e => setAddMonth(e.target.value)} className="fin-input">
                                {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Year</p>
                            <select onChange={e => setAddYear(e.target.value)} className="fin-input">
                                {Array.from({ length: 10 }, (_, i) => year + i).map(yr => <option key={yr} value={yr}>{yr}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Category</p>
                            <select onChange={e => setAddCategory(e.target.value)} className="fin-input">
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Total Budget</p>
                            <input type="number" value={addAmount} onChange={e => setAddAmount(e.target.value)} className="fin-input" placeholder="Enter amount" />
                        </div>
                        <button type="submit" className="btn-primary w-full">Add Budget</button>
                        <button type="button" onClick={() => setAddBudgetButton(false)} className="btn-secondary w-full">Cancel</button>
                    </form>
                </Modal>
            )}

            {/* Category Wise Budgets with Progress Bars */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Monthly Category Budgets" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categoryWiseBudget.map(b => {
                        const pct = b.totalBudget > 0 ? (b.totalExpense / b.totalBudget) * 100 : 0
                        const barColor = pct > 90 ? '#F87171' : pct > 70 ? '#FBBF24' : '#7F5AF0'
                        return (
                            <div key={b.category} className="glass-card p-5 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold text-white">{b.category} {b.emoji}</p>
                                    <p className="text-xs text-[#8888A0]">Rs.{b.totalExpense} / Rs.{b.totalBudget}</p>
                                </div>
                                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%`, background: barColor }} />
                                </div>
                                <div className="flex items-center justify-between">
                                    {b.totalSaved >= 0
                                        ? <p className="text-xs text-[#4ADE80]">Saved Rs. {b.totalSaved}</p>
                                        : <p className="text-xs text-[#F87171]">Overspent Rs. {Math.abs(b.totalSaved)}</p>
                                    }
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEdit(true); setCategory(b.category) }}
                                            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-[#7F5AF0] border border-[rgba(127,90,240,0.3)] hover:bg-[rgba(127,90,240,0.1)] transition-colors">
                                            <AssetIcon src={assets.budget.Edit} size={10} /> Edit
                                        </button>
                                        <button onClick={() => { setDelete(true); setCategory(b.category) }}
                                            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-[#F87171] border border-[rgba(248,113,113,0.3)] hover:bg-[rgba(248,113,113,0.1)] transition-colors">
                                            <AssetIcon src={assets.budget.Delete} size={10} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Edit Modal */}
            {edit && (
                <Modal title={<>Edit <span className="text-[#7F5AF0]">Budget</span></>} onClose={() => setEdit(false)}>
                    <form onSubmit={editBudgetHandler} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">New Budget for <span className="text-white font-semibold">{category}</span></p>
                            <input type="number" onChange={e => setNewBudget(e.target.value)} className="fin-input" value={newBudget} placeholder="Enter new budget" />
                        </div>
                        <button type="submit" className="btn-primary w-full">Save Changes</button>
                        <button type="button" onClick={() => setEdit(false)} className="btn-secondary w-full">Cancel</button>
                    </form>
                </Modal>
            )}

            {/* Delete Modal */}
            {Delete && (
                <Modal title={<>Delete <span className="text-[#F87171]">Budget</span></>} onClose={() => setDelete(false)}>
                    <form onSubmit={deleteBudgetHandler} className="flex flex-col gap-4">
                        <p className="text-sm text-[#C4C4CF]">Are you sure you want to <span className="text-[#F87171] font-semibold">DELETE</span> the <span className="text-white font-semibold">{category}</span> budget? This action cannot be undone.</p>
                        <button type="submit" className="btn-danger w-full">Delete Budget</button>
                        <button type="button" onClick={() => setDelete(false)} className="btn-secondary w-full">Cancel</button>
                    </form>
                </Modal>
            )}

            {/* Monthly Insights */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Monthly Insights" />
                <div className="flex flex-col gap-3">
                    {insights.map((i, index) => {
                        const style = insightStyles[i.type] || { cls: 'text-[#8888A0]', bg: 'bg-gray-500/10 border-gray-500/20' }
                        return (
                            <div key={index} className={`flex flex-col gap-2 p-4 rounded-xl border ${style.bg}`}>
                                <p className={`text-xs font-bold uppercase tracking-wider ${style.cls}`}>{i.type}</p>
                                <p className="text-sm text-[#C4C4CF]">{i.message}</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Yearly Budget Charts */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Yearly Budget Analysis" />
                <div className="flex gap-3 items-center">
                    <p className="text-sm font-medium text-[#8888A0]">Filter by year</p>
                    <select onChange={e => setY(e.target.value)} className="fin-input" style={{ width: 'auto', padding: '6px 12px' }}>
                        {Array.from({ length: 19 }, (_, i) => year - 9 + i).map(yr => <option key={yr} value={yr}>{yr}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-6">
                    {yearlyData.map((d, index) => (
                        <div key={index} className="flex flex-col gap-3">
                            <p className="text-sm font-semibold text-white">{months[d.m]}, {y}</p>
                            <div className="glass-card p-4 overflow-x-auto">
                                <div className="min-w-[450px] h-56">
                                    <Bar data={{
                                        labels: d.response.map(r => r.category),
                                        datasets: [
                                            { label: "Total Budget", data: d.response.map(r => r.totalBudget), backgroundColor: "#A78BFA" },
                                            { label: "Total Expense", data: d.response.map(r => r.totalExpense), backgroundColor: "#60A5FA" },
                                            { label: "Total Saved", data: d.response.map(r => r.totalSaved), backgroundColor: "#34D399" },
                                            { label: "Overspent", data: d.response.map(r => r.overspent), backgroundColor: "#F87171" }
                                        ]
                                    }} options={{
                                        responsive: true, maintainAspectRatio: false,
                                        plugins: {
                                            legend: { labels: { color: "#C4C4CF" } },
                                            tooltip: { titleColor: "#ffffff", bodyColor: "#e5e7eb", backgroundColor: "rgba(15,0,32,0.95)" },
                                        },
                                        scales: {
                                            x: { ticks: { color: "#8888A0" }, grid: { color: "rgba(255,255,255,0.05)" } },
                                            y: { ticks: { color: "#8888A0" }, grid: { color: "rgba(255,255,255,0.05)" } },
                                        },
                                    }}></Bar>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Budget
