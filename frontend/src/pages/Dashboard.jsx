import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { assets } from "../assets/assets"
import AssetIcon from "../components/AssetIcon"

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
    const [loading, setLoading] = useState(true)

    const month = new Date().getMonth()
    const year = new Date().getFullYear()
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const getBalance = async () => {
        try {
            const response = await axios.get(backend_url + '/wallet/get-balance', { headers: { Authorization: token } })
            if (response.data.success) { setBalance(response.data.balance); setIsLow(response.data.isLow) }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const getData = async () => {
        try {
            const response = await axios.get(backend_url + '/wallet/get-data', { headers: { Authorization: token } })
            if (response.data.success) { setTotalCredit(response.data.credit); setTotalDebit(response.data.debit) }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const getExpenseData = async () => {
        try {
            const response = await axios.get(backend_url + '/expense/get-expense-data', { headers: { Authorization: token } })
            if (response.data.success) { setTotalExpense(response.data.totalExpense); setWalletExpense(response.data.walletExpense); setCashExpense(response.data.cashExpense) }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const getMonthlyData = async () => {
        try {
            const response = await axios.get(backend_url + '/budget/get-monthly-budget-data', { headers: { Authorization: token } })
            if (response.data.success) { setTotalBudgets(response.data.totalBudgets); setTotalExpenses(response.data.totalExpenses); setTotalSaved(response.data.saved) }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const getGroupData = async () => {
        try {
            const response = await axios.get(backend_url + '/split-bill/get-group-data', { headers: { Authorization: token } })
            if (response.data.success) { setYouOwe(response.data.youOwe); setYouAreOwed(response.data.youAreOwed); setTotalGroups(response.data.totalGroups) }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const allTransactions = async () => {
        try {
            const response = await axios.get(backend_url + '/transaction/all-transactions', { headers: { Authorization: token } })
            if (response.data.success) setTransactions(response.data.transactions.reverse())
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }

    useEffect(() => {
        if (token) {
            setLoading(true)
            Promise.all([getBalance(), getData(), getExpenseData(), getMonthlyData(), getGroupData(), allTransactions()])
                .finally(() => setLoading(false))
        }
    }, [token])

    const StatCard = ({ label, value, icon, valueClass = 'text-white', sub }) => (
        <div className="glass-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#8888A0] uppercase tracking-wider">{label}</p>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(127,90,240,0.15)' }}>
                    <AssetIcon src={icon} alt="" size={18} />
                </div>
            </div>
            <p className={`text-3xl font-bold ${valueClass}`}>{value}</p>
            {sub && <p className="text-xs text-[#8888A0]">{sub}</p>}
        </div>
    )

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

    const getStatusBadge = (status) => {
        const map = {
            'Completed': 'bg-green-500/10 text-green-400',
            'Pending': 'bg-yellow-500/10 text-yellow-400',
            'Not Applicable': 'bg-gray-500/10 text-gray-400',
        }
        return map[status] || 'bg-gray-500/10 text-gray-400'
    }

    return (
        <div className="flex flex-col gap-10 sm:gap-12 text-bodyText font-sans m-5 sm:m-7">
            {/* Page Title */}
            <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold text-white tracking-tight">Dashboard</p>
                <p className="text-sm text-[#8888A0]">Welcome back — here's your financial overview</p>
            </div>

            {/* Wallet Overview */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Wallet Overview" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {loading ? (
                        [1,2,3].map(i => <SkeletonCard key={i} />)
                    ) : (
                        <>
                            <StatCard label="Current Balance" value={`Rs. ${balance}`} icon={assets.wallet.Balance} valueClass={isLow ? 'text-[#F87171]' : 'text-white'} sub={isLow ? '⚠ Balance is low!' : undefined} />
                            <StatCard label="Total Credit" value={`Rs. ${totalCredit}`} icon={assets.wallet.Credit} valueClass="text-[#4ADE80]" />
                            <StatCard label="Total Debit" value={`Rs. ${totalDebit}`} icon={assets.wallet.Debit} valueClass="text-[#F87171]" />
                        </>
                    )}
                </div>
            </div>

            {/* Expense Overview */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Expense Overview" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {loading ? (
                        [1,2,3].map(i => <SkeletonCard key={i} />)
                    ) : (
                        <>
                            <StatCard label="Total Expense" value={`Rs. ${totalExpense}`} icon={assets.expenses.TotalExpense} valueClass="text-[#F87171]" />
                            <StatCard label="Wallet Expense" value={`Rs. ${walletExpense}`} icon={assets.expenses.WalletExpense} valueClass="text-[#FBBF24]" />
                            <StatCard label="Cash Expense" value={`Rs. ${cashExpense}`} icon={assets.expenses.CashExpense} valueClass="text-[#FBBF24]" />
                        </>
                    )}
                </div>
            </div>

            {/* Budget Overview */}
            <div className="flex flex-col gap-5">
                <SectionHeader title={`Budget Overview — ${months[month]}, ${year}`} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {loading ? (
                        [1,2,3].map(i => <SkeletonCard key={i} />)
                    ) : (
                        <>
                            <StatCard label="Total Budgets" value={`Rs. ${totalBudgets}`} icon={assets.budget.TotalBudget} valueClass="text-white" />
                            <StatCard label="Total Expenses" value={`Rs. ${totalExpenses}`} icon={assets.expenses.TotalExpense} valueClass="text-[#F87171]" />
                            <StatCard label={totalSaved >= 0 ? "Total Saved" : "Overspent"} value={`Rs. ${Math.abs(totalSaved)}`} icon={assets.budget.TotalSaved} valueClass={totalSaved >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'} />
                        </>
                    )}
                </div>
            </div>

            {/* Split Bill Overview */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Split Bill Overview" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {loading ? (
                        [1,2,3].map(i => <SkeletonCard key={i} />)
                    ) : (
                        <>
                            <StatCard label="You Are Owed" value={`Rs. ${youAreOwed}`} icon={assets.splitbill.YouAreOwed} valueClass="text-[#4ADE80]" />
                            <StatCard label="You Owe" value={`Rs. ${youOwe}`} icon={assets.splitbill.YouOwe} valueClass="text-[#F87171]" />
                            <StatCard label="Total Groups" value={totalGroups} icon={assets.splitbill.Group} valueClass="text-white" />
                        </>
                    )}
                </div>
            </div>

            {/* Transactions Overview */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Recent Transactions" />
                <div className="glass-card overflow-hidden">
                    {/* Desktop Table Header */}
                    <div className="hidden lg:grid grid-cols-[0.5fr_1.5fr_0.8fr_1.5fr_1fr_0.8fr_1fr] gap-3 px-4 py-3" style={{ background: 'rgba(127,90,240,0.15)' }}>
                        {['Date','Title','Source','Category','Type','Amount','Status'].map(h => (
                            <p key={h} className="text-xs font-semibold text-[#8888A0] uppercase tracking-widest">{h}</p>
                        ))}
                    </div>

                    {transactions.slice(0, 10).map((t, index) => (
                        <div key={index}>
                            {/* Desktop Row */}
                            <div className="hidden lg:grid grid-cols-[0.5fr_1.5fr_0.8fr_1.5fr_1fr_0.8fr_1fr] gap-3 px-4 py-3 text-sm transition-colors duration-200 hover:bg-white/[0.03]" style={{ borderBottom: '1px solid rgba(127,90,240,0.1)' }}>
                                <p className="text-[#8888A0]">{new Date(t.date).getDate()}-{new Date(t.date).getMonth() + 1}-{new Date(t.date).getFullYear()}</p>
                                <p className="text-white font-medium truncate">{t.title}</p>
                                <p className="text-[#C4C4CF]">{t.source}</p>
                                <p className="text-[#C4C4CF]">{t.category} {t.categoryEmoji}</p>
                                <p className="text-[#C4C4CF]">{t.type} {t.typeEmoji}</p>
                                <p className={t.type === 'Credit' ? 'text-[#4ADE80] font-semibold' : 'text-[#F87171] font-semibold'}>Rs. {t.amount}</p>
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium w-fit ${getStatusBadge(t.status)}`}>{t.status}</span>
                            </div>

                            {/* Mobile Row */}
                            <div className="flex flex-col gap-0 lg:hidden">
                                <div className="px-4 py-3 flex items-center justify-between transition-colors duration-200 hover:bg-white/[0.03]" style={{ borderBottom: '1px solid rgba(127,90,240,0.1)' }}>
                                    <div>
                                        <p className="text-sm text-white font-medium">{t.title}</p>
                                        <p className={`text-sm font-semibold ${t.type === 'Credit' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>Rs. {t.amount}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedTransaction(t)}
                                        className="btn-secondary text-xs px-3 py-1.5"
                                    >VIEW</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Transaction Bottom Sheet */}
            {selectedTransaction && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSelectedTransaction(null)}>
                    <div
                        className="slide-up rounded-t-2xl p-6 flex flex-col gap-4"
                        style={{ background: '#0f0020', borderTop: '1px solid rgba(127,90,240,0.3)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-10 h-1 rounded-full mx-auto mb-2" style={{ background: 'rgba(127,90,240,0.4)' }}></div>
                        <p className="text-center text-white font-bold text-xl">Transaction</p>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: 'Date', val: `${new Date(selectedTransaction.date).getDate()}-${new Date(selectedTransaction.date).getMonth() + 1}-${new Date(selectedTransaction.date).getFullYear()}` },
                                { label: 'Title', val: selectedTransaction.title },
                                { label: 'Source', val: selectedTransaction.source },
                                { label: 'Category', val: `${selectedTransaction.categoryEmoji} ${selectedTransaction.category}` },
                                { label: 'Type', val: `${selectedTransaction.type} ${selectedTransaction.typeEmoji}` },
                                { label: 'Amount', val: `Rs. ${selectedTransaction.amount}` },
                                { label: 'Status', val: selectedTransaction.status },
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

export default Dashboard
