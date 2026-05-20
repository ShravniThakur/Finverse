import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { Chart } from 'chart.js/auto'
import { Bar, Doughnut } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'
import { assets } from "../assets/assets"
import AssetIcon from "../components/AssetIcon"

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
    const [loading, setLoading] = useState(true)

    const [year, setYear] = useState(new Date().getFullYear())
    const y = new Date().getFullYear()

    const getExpenseData = async () => {
        try {
            const response = await axios.get(backend_url + '/expense/get-expense-data', { headers: { Authorization: token } })
            if (response.data.success) { setTotalExpense(response.data.totalExpense); setWalletExpense(response.data.walletExpense); setCashExpense(response.data.cashExpense) }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const getExpenseList = async () => {
        try {
            const response = await axios.get(backend_url + '/expense/get-expense-list', { headers: { Authorization: token } })
            if (response.data.success) setExpenseList(response.data.response.reverse())
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const getMonthlyExpenses = async () => {
        try {
            const response = await axios.get(backend_url + '/expense/get-monthly-expenses', { headers: { Authorization: token }, params: { year: Number(year) } })
            if (response.data.success) setMonthly(response.data.monthly)
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const getCategoryExpenses = async () => {
        try {
            const response = await axios.get(backend_url + '/expense/get-category-expenses', { headers: { Authorization: token } })
            if (response.data.success) setCategoryExpenses(response.data.categoryExpenses)
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const addExpenseHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + '/expense/add-expense', { title, category, type, amount: Number(amount) }, { headers: { Authorization: token } })
            if (response.data.success) {
                getExpenseData(); getExpenseList(); getMonthlyExpenses(); getCategoryExpenses()
                setTitle(''); setCategory("Food"); setType("Wallet"); setAmount(''); setAddExpenseButton(false)
                window.scrollTo({ top: 0, behavior: "smooth" }); toast.success(response.data.message)
            } else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }

    useEffect(() => {
        if (token) {
            setLoading(true)
            Promise.all([getExpenseData(), getExpenseList(), getMonthlyExpenses(), getCategoryExpenses()]).finally(() => setLoading(false))
        }
    }, [token, year])

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

    const categories = ["Food","Groceries","Housing","Bills & Utilities","Transportation","Entertainment","Shopping","Health","Education","Travel","Investments & Savings","Fees & Charges","Others"]

    return (
        <div className="flex flex-col gap-10 sm:gap-12 text-bodyText font-sans m-5 sm:m-7">
            <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold text-white tracking-tight">Expenses</p>
                <p className="text-sm text-[#8888A0]">Track and analyze your spending patterns</p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Quick Stats" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {loading ? [1,2,3].map(i => <SkeletonCard key={i} />) : (
                        <>
                            {[
                                { label: 'Total Expense', value: `Rs. ${totalExpense}`, icon: assets.expenses.TotalExpense, cls: 'text-[#F87171]' },
                                { label: 'Wallet Expense', value: `Rs. ${walletExpense}`, icon: assets.expenses.WalletExpense, cls: 'text-[#FBBF24]' },
                                { label: 'Cash Expense', value: `Rs. ${cashExpense}`, icon: assets.expenses.CashExpense, cls: 'text-[#FBBF24]' },
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
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Quick Actions" />
                <button onClick={() => { setAddExpenseButton(true); setTitle(''); setCategory("Food"); setType("Wallet"); setAmount('') }}
                    className="btn-primary flex items-center gap-2 w-fit">
                    <AssetIcon src={assets.expenses.AddExpense} size={16} /> Add Expense
                </button>
            </div>

            {/* Add Expense Modal */}
            {addExpenseButton && (
                <div className="fixed inset-0 z-50 backdrop-blur-md flex justify-center items-center" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setAddExpenseButton(false)}>
                    <div className="glass-card p-6 w-80 sm:w-96 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                        <p className="text-xl font-bold text-white text-center">Add <span className="text-[#7F5AF0]">Expense</span></p>
                        <form onSubmit={addExpenseHandler} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-[#8888A0]">Title</p>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="fin-input" placeholder="Enter title" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-[#8888A0]">Category</p>
                                <select onChange={e => setCategory(e.target.value)} className="fin-input">
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-[#8888A0]">Type</p>
                                <select onChange={e => setType(e.target.value)} className="fin-input">
                                    <option value="Wallet">Wallet</option>
                                    <option value="Cash">Cash</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-[#8888A0]">Amount</p>
                                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="fin-input" placeholder="Enter amount" />
                            </div>
                            <button type="submit" className="btn-primary w-full">Add Expense</button>
                            <button type="button" onClick={() => setAddExpenseButton(false)} className="btn-secondary w-full">Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Monthly Expense Chart */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Monthly Expense Activity" />
                <div className="flex gap-3 items-center">
                    <p className="text-sm font-medium text-[#8888A0]">Filter by year</p>
                    <select onChange={e => setYear(e.target.value)} className="fin-input" style={{ width: 'auto', padding: '6px 12px' }}>
                        {Array.from({ length: 10 }, (_, i) => y - i).map(yr => <option key={yr} value={yr}>{yr}</option>)}
                    </select>
                </div>
                <div className="glass-card p-4 overflow-x-auto">
                    <div className="min-w-[600px] h-64 sm:h-80">
                        <Bar data={{
                            labels: monthly.map(m => m.month),
                            datasets: [
                                { label: "Total Expense", data: monthly.map(m => m.totalExpense), backgroundColor: "#A78BFA" },
                                { label: "Wallet Expense", data: monthly.map(m => m.walletExpense), backgroundColor: "#4ADE80" },
                                { label: "Cash Expense", data: monthly.map(m => m.cashExpense), backgroundColor: "#F87171" }
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

            {/* Category Wise Expenses */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Category Wise Expenses" />
                <div className="glass-card p-4 overflow-x-auto">
                    <div className="h-64 min-w-[500px]">
                        <Doughnut data={{
                            labels: categoryExpenses.map(c => c.name),
                            datasets: [{
                                label: "Total Expense",
                                data: categoryExpenses.map(c => c.amount),
                                backgroundColor: ["#2CB67D","#38BDF8","#7F5AF0","#F59E0B","#3B82F6","#EC4899","#A855F7","#EF4444","#22C55E","#06B6D4","#FACC15","#6366F1","#9CA3AF"]
                            }]
                        }} options={{
                            responsive: true, maintainAspectRatio: false,
                            plugins: {
                                legend: { position: "right", labels: { color: "#C4C4CF", boxWidth: 12, padding: 20 } },
                                tooltip: { titleColor: "#ffffff", bodyColor: "#e5e7eb", backgroundColor: "rgba(15,0,32,0.95)" },
                            },
                            cutout: "60%",
                        }}></Doughnut>
                    </div>
                </div>
            </div>

            {/* All Expenses */}
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <SectionHeader title="All Expenses" />
                    <button onClick={() => navigate('/transactions')} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                        View All <AssetIcon src={assets.website.Arrow} size={12} />
                    </button>
                </div>
                <div className="glass-card overflow-hidden">
                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 px-4 py-3" style={{ background: 'rgba(127,90,240,0.15)' }}>
                        {['Date','Title','Category','Type','Amount'].map(h => (
                            <p key={h} className="text-xs font-semibold text-[#8888A0] uppercase tracking-widest">{h}</p>
                        ))}
                    </div>
                    {expenseList.slice(0, 50).map((t, index) => (
                        <div key={index}>
                            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 px-4 py-3 text-sm hover:bg-white/[0.03] transition-colors" style={{ borderBottom: '1px solid rgba(127,90,240,0.1)' }}>
                                <p className="text-[#8888A0]">{new Date(t.date).getDate()}-{new Date(t.date).getMonth() + 1}-{new Date(t.date).getFullYear()}</p>
                                <p className="text-white font-medium truncate">{t.title}</p>
                                <p className="text-[#C4C4CF]">{t.category} {t.categoryEmoji}</p>
                                <p className="text-[#C4C4CF]">{t.type} {t.typeEmoji}</p>
                                <p className="text-[#F87171] font-semibold">Rs. {t.amount}</p>
                            </div>
                            <div className="flex md:hidden px-4 py-3 items-center justify-between hover:bg-white/[0.03]" style={{ borderBottom: '1px solid rgba(127,90,240,0.1)' }}>
                                <div>
                                    <p className="text-sm text-white font-medium">{t.title}</p>
                                    <p className="text-sm font-semibold text-[#F87171]">Rs. {t.amount}</p>
                                </div>
                                <button onClick={() => setSelectedTransaction(t)} className="btn-secondary text-xs px-3 py-1.5">VIEW</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Bottom Sheet */}
            {selectedTransaction && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSelectedTransaction(null)}>
                    <div className="slide-up rounded-t-2xl p-6 flex flex-col gap-4" style={{ background: '#0f0020', borderTop: '1px solid rgba(127,90,240,0.3)' }} onClick={e => e.stopPropagation()}>
                        <div className="w-10 h-1 rounded-full mx-auto mb-2" style={{ background: 'rgba(127,90,240,0.4)' }}></div>
                        <p className="text-center text-white font-bold text-xl">Expense</p>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: 'Date', val: `${new Date(selectedTransaction.date).getDate()}-${new Date(selectedTransaction.date).getMonth() + 1}-${new Date(selectedTransaction.date).getFullYear()}` },
                                { label: 'Title', val: selectedTransaction.title },
                                { label: 'Category', val: `${selectedTransaction.categoryEmoji} ${selectedTransaction.category}` },
                                { label: 'Type', val: `${selectedTransaction.type} ${selectedTransaction.typeEmoji}` },
                                { label: 'Amount', val: `Rs. ${selectedTransaction.amount}` },
                            ].map(({ label, val }) => (
                                <div key={label} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid rgba(127,90,240,0.1)' }}>
                                    <p className="text-xs font-semibold text-[#8888A0] uppercase tracking-wider">{label}</p>
                                    <p className="text-sm text-white">{val}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setSelectedTransaction(null)} className="btn-primary w-full mt-2">Close</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Expense
