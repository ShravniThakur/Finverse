import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { Chart } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'
import { assets } from "../assets/assets"
import AssetIcon from "../components/AssetIcon"

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
    const [loading, setLoading] = useState(true)

    const y = new Date().getFullYear()

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
    const getMonthlyData = async () => {
        try {
            const response = await axios.get(backend_url + '/wallet/get-monthly-data', { headers: { Authorization: token }, params: { year: Number(year) } })
            if (response.data.success) setMonthly(response.data.monthly)
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const getTransactions = async () => {
        try {
            const response = await axios.get(backend_url + '/wallet/get-transactions', { headers: { Authorization: token } })
            if (response.data.success) setTransactions(response.data.response.reverse())
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const addMoneyHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + '/wallet/add-money', { amount: Number(amount) }, { headers: { Authorization: token } })
            if (response.data.success) { toast.success(response.data.message); setAmount(''); setAddMoneyButton(false); getBalance(); getData(); getMonthlyData(); getTransactions(); window.scrollTo({ top: 0, behavior: "smooth" }) }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const sendMoneyHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + '/wallet/send-money', { amount: Number(amount), recipient, walletPin }, { headers: { Authorization: token } })
            if (response.data.success) { toast.success(response.data.message); setAmount(''); setRecipient(''); setSendMoneyButton(false); getBalance(); getData(); getMonthlyData(); getTransactions(); window.scrollTo({ top: 0, behavior: "smooth" }) }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const setPinHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + '/wallet/set-pin', { walletPin }, { headers: { Authorization: token } })
            if (response.data.success) { toast.success(response.data.message); setWalletPin(''); setSetPinButton(false); getBalance(); getData(); getMonthlyData(); getTransactions(); window.scrollTo({ top: 0, behavior: "smooth" }) }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }

    useEffect(() => {
        if (token) {
            setLoading(true)
            Promise.all([getBalance(), getData(), getMonthlyData(), getTransactions()]).finally(() => setLoading(false))
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

    const Modal = ({ title, onClose, children }) => (
        <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
            <div className="glass-card p-6 w-80 sm:w-96 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                <p className="text-xl font-bold text-white text-center">{title}</p>
                {children}
            </div>
        </div>
    )

    const getStatusBadge = (status) => {
        const map = { 'Completed': 'bg-green-500/10 text-green-400', 'Pending': 'bg-yellow-500/10 text-yellow-400', 'Not Applicable': 'bg-gray-500/10 text-gray-400' }
        return map[status] || 'bg-gray-500/10 text-gray-400'
    }

    return (
        <div className="flex flex-col gap-10 sm:gap-12 text-bodyText font-sans m-5 sm:m-7">
            {/* Page Title */}
            <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold text-white tracking-tight">Wallet</p>
                <p className="text-sm text-[#8888A0]">Manage your funds, transfers, and transaction history</p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Quick Stats" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {loading ? [1,2,3].map(i => <SkeletonCard key={i} />) : (
                        <>
                            <div className="glass-card p-5 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-[#8888A0] uppercase tracking-wider">Current Balance</p>
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(127,90,240,0.15)' }}><AssetIcon src={assets.wallet.Balance} size={18} /></div>
                                </div>
                                <p className={`text-3xl font-bold ${isLow ? 'text-[#F87171]' : 'text-white'}`}>Rs. {balance}</p>
                                {isLow && <p className="text-xs text-[#F87171]">⚠ Balance is low!</p>}
                            </div>
                            <div className="glass-card p-5 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-[#8888A0] uppercase tracking-wider">Total Credit</p>
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(127,90,240,0.15)' }}><AssetIcon src={assets.wallet.Credit} size={18} /></div>
                                </div>
                                <p className="text-3xl font-bold text-[#4ADE80]">Rs. {totalCredit}</p>
                            </div>
                            <div className="glass-card p-5 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-[#8888A0] uppercase tracking-wider">Total Debit</p>
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(127,90,240,0.15)' }}><AssetIcon src={assets.wallet.Debit} size={18} /></div>
                                </div>
                                <p className="text-3xl font-bold text-[#F87171]">Rs. {totalDebit}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Quick Actions" />
                <div className="flex flex-wrap gap-3">
                    <button onClick={() => { setAmount(''); setAddMoneyButton(true) }} className="btn-primary flex items-center gap-2 w-fit">
                        <AssetIcon src={assets.wallet.AddMoney} size={16} /> Add Money
                    </button>
                    <button onClick={() => { setAmount(''); setSendMoneyButton(true) }} className="btn-primary flex items-center gap-2 w-fit">
                        <AssetIcon src={assets.wallet.SendMoney} size={16} /> Send Money
                    </button>
                    <button onClick={() => { setSetPinButton(true); setWalletPin('') }} className="btn-primary flex items-center gap-2 w-fit">
                        <AssetIcon src={assets.wallet.SetPin} size={16} /> Set PIN
                    </button>
                </div>
            </div>

            {/* Modals */}
            {addMoneyButton && (
                <Modal title="Add Money" onClose={() => setAddMoneyButton(false)}>
                    <form onSubmit={addMoneyHandler} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Amount</p>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="fin-input" placeholder="Enter amount" />
                        </div>
                        <button type="submit" className="btn-primary w-full">Add Money</button>
                        <button type="button" onClick={() => setAddMoneyButton(false)} className="btn-secondary w-full">Cancel</button>
                    </form>
                </Modal>
            )}
            {sendMoneyButton && (
                <Modal title="Send Money" onClose={() => setSendMoneyButton(false)}>
                    <form onSubmit={sendMoneyHandler} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Recipient's Email</p>
                            <input type="email" value={recipient} onChange={e => setRecipient(e.target.value)} className="fin-input" placeholder="email@example.com" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Amount</p>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="fin-input" placeholder="Enter amount" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Wallet PIN</p>
                            <input type="text" value={walletPin} onChange={e => setWalletPin(e.target.value)} className="fin-input" placeholder="Enter PIN" />
                        </div>
                        <button type="submit" className="btn-primary w-full">Send Money</button>
                        <button type="button" onClick={() => setSendMoneyButton(false)} className="btn-secondary w-full">Cancel</button>
                    </form>
                </Modal>
            )}
            {setPinButton && (
                <Modal title="Set PIN" onClose={() => setSetPinButton(false)}>
                    <form onSubmit={setPinHandler} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Wallet PIN</p>
                            <input type="text" value={walletPin} onChange={e => setWalletPin(e.target.value)} className="fin-input" placeholder="Enter new PIN" />
                        </div>
                        <button type="submit" className="btn-primary w-full">Set PIN</button>
                        <button type="button" onClick={() => setSetPinButton(false)} className="btn-secondary w-full">Cancel</button>
                    </form>
                </Modal>
            )}

            {/* Monthly Wallet Activity */}
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <SectionHeader title="Monthly Wallet Activity" />
                </div>
                <div className="flex gap-3 items-center">
                    <p className="text-sm font-medium text-[#8888A0]">Filter by year</p>
                    <select onChange={e => setYear(e.target.value)} className="fin-input" style={{ width: 'auto', padding: '6px 12px' }}>
                        {Array.from({ length: 10 }, (_, i) => y - i).map(yr => (
                            <option key={yr} value={yr}>{yr}</option>
                        ))}
                    </select>
                </div>
                <div className="glass-card p-4 overflow-x-auto">
                    <div className="min-w-[600px] h-64 sm:h-80">
                        <Bar data={{
                            labels: monthly.map(m => m.month),
                            datasets: [
                                { label: "Credit", data: monthly.map(m => m.credit), backgroundColor: "#4ADE80" },
                                { label: "Debit", data: monthly.map(m => m.debit), backgroundColor: "#F87171" }
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

            {/* Wallet Transactions */}
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <SectionHeader title="Wallet Transactions" />
                    <button onClick={() => navigate('/transactions')} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                        View All <AssetIcon src={assets.website.Arrow} size={12} />
                    </button>
                </div>
                <div className="glass-card overflow-hidden">
                    <div className="hidden md:grid grid-cols-[0.5fr_2fr_1fr_0.5fr_1fr_1fr] gap-3 px-4 py-3" style={{ background: 'rgba(127,90,240,0.15)' }}>
                        {['Date','Title','Category','Type','Amount','Status'].map(h => (
                            <p key={h} className="text-xs font-semibold text-[#8888A0] uppercase tracking-widest">{h}</p>
                        ))}
                    </div>
                    {transactions.slice(0, 50).map((t, index) => (
                        <div key={index}>
                            <div className="hidden md:grid grid-cols-[0.5fr_2fr_1fr_0.5fr_1fr_1fr] gap-3 px-4 py-3 text-sm hover:bg-white/[0.03] transition-colors" style={{ borderBottom: '1px solid rgba(127,90,240,0.1)' }}>
                                <p className="text-[#8888A0]">{new Date(t.date).getDate()}-{new Date(t.date).getMonth() + 1}-{new Date(t.date).getFullYear()}</p>
                                <p className="text-white font-medium truncate">{t.title}</p>
                                <p className="text-[#C4C4CF]">{t.category} {t.categoryEmoji}</p>
                                <p className="text-[#C4C4CF]">{t.type} {t.typeEmoji}</p>
                                <p className={t.type === 'Credit' ? 'text-[#4ADE80] font-semibold' : 'text-[#F87171] font-semibold'}>Rs. {t.amount}</p>
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium w-fit ${getStatusBadge(t.status)}`}>{t.status}</span>
                            </div>
                            <div className="flex md:hidden px-4 py-3 items-center justify-between hover:bg-white/[0.03]" style={{ borderBottom: '1px solid rgba(127,90,240,0.1)' }}>
                                <div>
                                    <p className="text-sm text-white font-medium">{t.title}</p>
                                    <p className={`text-sm font-semibold ${t.type === 'Credit' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>Rs. {t.amount}</p>
                                </div>
                                <button onClick={() => setSelectedTransaction(t)} className="btn-secondary text-xs px-3 py-1.5">VIEW</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Transaction Bottom Sheet */}
            {selectedTransaction && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSelectedTransaction(null)}>
                    <div className="slide-up rounded-t-2xl p-6 flex flex-col gap-4" style={{ background: '#0f0020', borderTop: '1px solid rgba(127,90,240,0.3)' }} onClick={e => e.stopPropagation()}>
                        <div className="w-10 h-1 rounded-full mx-auto mb-2" style={{ background: 'rgba(127,90,240,0.4)' }}></div>
                        <p className="text-center text-white font-bold text-xl">Wallet Transaction</p>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: 'Date', val: `${new Date(selectedTransaction.date).getDate()}-${new Date(selectedTransaction.date).getMonth() + 1}-${new Date(selectedTransaction.date).getFullYear()}` },
                                { label: 'Title', val: selectedTransaction.title },
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

export default Wallet
