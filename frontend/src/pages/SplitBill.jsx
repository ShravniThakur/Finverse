import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import AssetIcon from "../components/AssetIcon"

const SplitBill = () => {
    const navigate = useNavigate()
    const { token, backend_url } = useContext(AppContext)
    const [youOwe, setYouOwe] = useState(0)
    const [youAreOwed, setYouAreOwed] = useState(0)
    const [totalGroups, setTotalGroups] = useState(0)
    const [allGroups, setAllGroups] = useState([])
    const [groupName, setGroupName] = useState('')
    const [groupCode, setGroupCode] = useState('')
    const [createGroup, setCreateGroup] = useState(false)
    const [popUp, setPopUp] = useState(false)
    const [joinGroup, setJoinGroup] = useState(false)
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(true)

    const getGroupData = async () => {
        try {
            const response = await axios.get(backend_url + '/split-bill/get-group-data', { headers: { Authorization: token } })
            if (response.data.success) { setYouOwe(response.data.youOwe); setYouAreOwed(response.data.youAreOwed); setTotalGroups(response.data.totalGroups) }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const getAllGroups = async () => {
        try {
            const response = await axios.get(backend_url + '/split-bill/get-all-groups', { headers: { Authorization: token } })
            if (response.data.success) setAllGroups(response.data.groups)
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const addGroupHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + '/split-bill/add-group', { groupName }, { headers: { Authorization: token } })
            if (response.data.success) {
                setPopUp(true); setGroupCode(response.data.groupCode); setCreateGroup(false)
                getGroupData(); getAllGroups(); window.scrollTo({ top: 0, behavior: "smooth" }); toast.success(response.data.message)
            } else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const joinGroupHandler = async (e) => {
        e.preventDefault()
        if (!code.trim()) { toast.error("Group Code Required!"); return }
        try {
            const response = await axios.post(backend_url + `/split-bill/join-group/${code}`, {}, { headers: { Authorization: token } })
            if (response.data.success) {
                toast.success(response.data.message); window.scrollTo({ top: 0, behavior: "smooth" })
                getGroupData(); getAllGroups(); setCode(''); setJoinGroup(false)
            } else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }

    useEffect(() => {
        setLoading(true)
        Promise.all([getGroupData(), getAllGroups()]).finally(() => setLoading(false))
    }, [token])

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

    return (
        <div className="flex flex-col gap-10 sm:gap-12 text-bodyText font-sans m-5 sm:m-7">
            <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold text-white tracking-tight">Split Bill</p>
                <p className="text-sm text-[#8888A0]">Split expenses fairly with friends and groups</p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="Quick Stats" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {loading ? [1,2,3].map(i => <SkeletonCard key={i} />) : (
                        <>
                            {[
                                { label: 'You Are Owed', value: `Rs. ${youAreOwed}`, icon: assets.splitbill.YouAreOwed, cls: 'text-[#4ADE80]' },
                                { label: 'You Owe', value: `Rs. ${youOwe}`, icon: assets.splitbill.YouOwe, cls: 'text-[#F87171]' },
                                { label: 'Total Groups', value: totalGroups, icon: assets.splitbill.Group, cls: 'text-white' },
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
                <div className="flex flex-wrap gap-3">
                    <button onClick={() => setCreateGroup(true)} className="btn-primary flex items-center gap-2 w-fit">
                        <AssetIcon src={assets.splitbill.CreateGroup} size={16} /> Create Group
                    </button>
                    <button onClick={() => setJoinGroup(true)} className="btn-primary flex items-center gap-2 w-fit">
                        <AssetIcon src={assets.splitbill.AddMember} size={16} /> Join Group
                    </button>
                </div>
            </div>

            {/* Modals */}
            {createGroup && (
                <Modal title={<>Create <span className="text-[#7F5AF0]">Group</span></>} onClose={() => setCreateGroup(false)}>
                    <form onSubmit={addGroupHandler} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Group Name</p>
                            <input type="text" onChange={e => setGroupName(e.target.value)} className="fin-input" value={groupName} placeholder="Enter group name" />
                        </div>
                        <button type="submit" className="btn-primary w-full">Create Group</button>
                        <button type="button" onClick={() => setCreateGroup(false)} className="btn-secondary w-full">Cancel</button>
                    </form>
                </Modal>
            )}
            {popUp && (
                <Modal title={<>Group <span className="text-[#4ADE80]">Created!</span></>} onClose={() => setPopUp(false)}>
                    <div className="flex flex-col gap-3">
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(127,90,240,0.15)' }}>
                            <p className="text-xs text-[#8888A0] mb-1">Group Name</p>
                            <p className="text-white font-semibold">{groupName}</p>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(127,90,240,0.15)' }}>
                            <p className="text-xs text-[#8888A0] mb-1">Group Code</p>
                            <div className="flex items-center justify-between">
                                <p className="text-white font-mono font-bold tracking-widest">{groupCode}</p>
                                <button onClick={() => { navigator.clipboard.writeText(groupCode); toast.success("Group Code copied!") }}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#7F5AF0]" style={{ background: 'rgba(127,90,240,0.15)' }}>
                                    <AssetIcon src={assets.website.Copy} size={14} />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-[#8888A0] text-center">Share this code with friends to add them to the group!</p>
                    </div>
                    <button onClick={() => setPopUp(false)} className="btn-primary w-full">Done</button>
                </Modal>
            )}
            {joinGroup && (
                <Modal title={<>Join <span className="text-[#7F5AF0]">Group</span></>} onClose={() => setJoinGroup(false)}>
                    <form onSubmit={joinGroupHandler} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Group Code</p>
                            <input type="text" onChange={e => setCode(e.target.value)} className="fin-input" value={code} placeholder="Enter group code" />
                        </div>
                        <button type="submit" className="btn-primary w-full">Join Group</button>
                        <button type="button" onClick={() => setJoinGroup(false)} className="btn-secondary w-full">Cancel</button>
                    </form>
                </Modal>
            )}

            {/* My Groups */}
            <div className="flex flex-col gap-5">
                <SectionHeader title="My Groups" />
                <div className="flex flex-col gap-4">
                    {allGroups.map(g => {
                        const borderColor = g.balance > 0 ? 'border-l-green-500' : g.balance < 0 ? 'border-l-red-500' : 'border-l-purple-500'
                        return (
                            <div key={g.groupCode} className={`glass-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-l-4 ${borderColor}`}>
                                <div className="flex flex-col gap-1">
                                    <p className="text-base font-bold text-white">{g.groupName}</p>
                                    {g.balance >= 0
                                        ? <p className="text-sm text-[#8888A0]">You are owed <span className="text-[#4ADE80] font-semibold">Rs. {g.balance}</span></p>
                                        : <p className="text-sm text-[#8888A0]">You owe <span className="text-[#F87171] font-semibold">Rs. {-g.balance}</span></p>
                                    }
                                </div>
                                <button onClick={() => navigate(`/group-details/${g.groupCode}`)} className="btn-secondary text-sm px-4 py-2 whitespace-nowrap">View Details</button>
                            </div>
                        )
                    })}
                    {allGroups.length === 0 && !loading && (
                        <div className="glass-card p-8 flex flex-col items-center gap-3 text-center">
                            <AssetIcon src={assets.splitbill.Group} size={32} style={{ opacity: 0.5 }} />
                            <p className="text-sm text-[#8888A0]">No groups yet. Create or join a group to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SplitBill
