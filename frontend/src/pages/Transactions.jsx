import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { assets } from "../assets/assets"
import AssetIcon from "../components/AssetIcon"

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

            const response = await axios.get(backend_url + '/transaction/all-transactions', { headers: { Authorization: token }, params })
            if (response.data.success) setTransactions(response.data.transactions.reverse())
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }

    useEffect(() => { allTransactions() }, [token, toDate, fromDate, minAmt, maxAmt, source])

    const sources = ['All', 'Wallet', 'Expense', 'Group']
    const [activeSource, setActiveSource] = useState('All')

    const handleSourceFilter = (s) => {
        setActiveSource(s)
        setSource(s === 'All' ? '' : s)
    }

    const getStatusBadge = (status) => {
        const map = { 'Completed': 'bg-green-500/10 text-green-400', 'Pending': 'bg-yellow-500/10 text-yellow-400', 'Not Applicable': 'bg-gray-500/10 text-gray-400' }
        return map[status] || 'bg-gray-500/10 text-gray-400'
    }

    const SectionHeader = ({ title }) => (
        <div className="section-header">
            <div className="accent-bar"></div>
            <p>{title}</p>
        </div>
    )

    return (
        <div className="flex flex-col gap-10 sm:gap-12 text-bodyText font-sans m-5 sm:m-7">
            <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold text-white tracking-tight">Transactions</p>
                <p className="text-sm text-[#8888A0]">View and filter your complete transaction history</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col gap-4">
                {/* Source Pills */}
                <div className="flex flex-wrap gap-2">
                    {sources.map(s => (
                        <button
                            key={s}
                            onClick={() => handleSourceFilter(s)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                activeSource === s
                                    ? 'text-white'
                                    : 'text-[#8888A0] hover:text-white'
                            }`}
                            style={activeSource === s
                                ? { background: '#7F5AF0' }
                                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(127,90,240,0.15)' }
                            }
                        >{s}</button>
                    ))}
                </div>

                {/* Desktop Filters */}
                <div className="hidden lg:flex flex-wrap gap-4">
                    {[
                        { label: 'From Date', val: fromDate, setter: setFromDate, type: 'date' },
                        { label: 'To Date', val: toDate, setter: setToDate, type: 'date' },
                        { label: 'Min Amount', val: minAmt, setter: setMinAmt, type: 'number' },
                        { label: 'Max Amount', val: maxAmt, setter: setMaxAmt, type: 'number' },
                    ].map(({ label, val, setter, type }) => (
                        <div key={label} className="flex flex-col gap-1">
                            <p className="text-xs font-medium text-[#8888A0]">{label}</p>
                            <input
                                type={type}
                                value={val}
                                onChange={e => setter(e.target.value)}
                                className="fin-input [color-scheme:dark]"
                                style={{ padding: '6px 12px', width: type === 'date' ? '160px' : '120px' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Mobile Filter Toggle */}
                <div className="flex flex-col gap-3 lg:hidden">
                    <button
                        onClick={() => setFilter(!filter)}
                        className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl w-fit transition-all duration-200 ${filter ? 'text-white' : 'text-[#8888A0]'}`}
                        style={filter
                            ? { background: 'rgba(127,90,240,0.2)', border: '1px solid rgba(127,90,240,0.4)' }
                            : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(127,90,240,0.15)' }
                        }
                    >
                        <AssetIcon src={assets.transactions.Source} size={14} /> Filters {filter ? '▲' : '▼'}
                    </button>
                    {filter && (
                        <div className="flex flex-wrap gap-3">
                            {[
                                { label: 'From Date', val: fromDate, setter: setFromDate, type: 'date' },
                                { label: 'To Date', val: toDate, setter: setToDate, type: 'date' },
                                { label: 'Min Amount', val: minAmt, setter: setMinAmt, type: 'number' },
                                { label: 'Max Amount', val: maxAmt, setter: setMaxAmt, type: 'number' },
                            ].map(({ label, val, setter, type }) => (
                                <div key={label} className="flex flex-col gap-1">
                                    <p className="text-xs font-medium text-[#8888A0]">{label}</p>
                                    <input
                                        type={type}
                                        value={val}
                                        onChange={e => setter(e.target.value)}
                                        className="fin-input [color-scheme:dark]"
                                        style={{ padding: '6px 12px', width: type === 'date' ? '150px' : '110px' }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="flex flex-col gap-5">
                <SectionHeader title={`All Transactions (${transactions.length})`} />
                <div className="glass-card overflow-hidden">
                    <div className="hidden lg:grid grid-cols-[0.5fr_1.5fr_0.8fr_1.5fr_1fr_0.8fr_1fr] gap-3 px-4 py-3" style={{ background: 'rgba(127,90,240,0.15)' }}>
                        {['Date','Title','Source','Category','Type','Amount','Status'].map(h => (
                            <p key={h} className="text-xs font-semibold text-[#8888A0] uppercase tracking-widest">{h}</p>
                        ))}
                    </div>
                    {transactions.map((t, index) => (
                        <div key={index}>
                            <div className="hidden lg:grid grid-cols-[0.5fr_1.5fr_0.8fr_1.5fr_1fr_0.8fr_1fr] gap-3 px-4 py-3 text-sm hover:bg-white/[0.03] transition-colors" style={{ borderBottom: '1px solid rgba(127,90,240,0.1)' }}>
                                <p className="text-[#8888A0]">{new Date(t.date).getDate()}-{new Date(t.date).getMonth() + 1}-{new Date(t.date).getFullYear()}</p>
                                <p className="text-white font-medium truncate">{t.title}</p>
                                <p className="text-[#C4C4CF]">{t.source}</p>
                                <p className="text-[#C4C4CF]">{t.category} {t.categoryEmoji}</p>
                                <p className="text-[#C4C4CF]">{t.type} {t.typeEmoji}</p>
                                <p className={t.type === 'Credit' ? 'text-[#4ADE80] font-semibold' : 'text-[#F87171] font-semibold'}>Rs. {t.amount}</p>
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium w-fit ${getStatusBadge(t.status)}`}>{t.status}</span>
                            </div>
                            <div className="flex lg:hidden px-4 py-3 items-center justify-between hover:bg-white/[0.03]" style={{ borderBottom: '1px solid rgba(127,90,240,0.1)' }}>
                                <div>
                                    <p className="text-sm text-white font-medium">{t.title}</p>
                                    <p className={`text-sm font-semibold ${t.type === 'Credit' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>Rs. {t.amount}</p>
                                </div>
                                <button onClick={() => setSelectedTransaction(t)} className="btn-secondary text-xs px-3 py-1.5">VIEW</button>
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <div className="px-4 py-12 text-center">
                            <p className="text-sm text-[#8888A0]">No transactions found for the selected filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Sheet */}
            {selectedTransaction && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSelectedTransaction(null)}>
                    <div className="slide-up rounded-t-2xl p-6 flex flex-col gap-4" style={{ background: '#0f0020', borderTop: '1px solid rgba(127,90,240,0.3)' }} onClick={e => e.stopPropagation()}>
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

export default Transactions
