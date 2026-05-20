import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { assets } from "../assets/assets"
import AssetIcon from "../components/AssetIcon"

const MyProfile = () => {
    const { token, backend_url } = useContext(AppContext)
    const [user, setUser] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [profilePic, setProfilePic] = useState(null)
    const [edit, setEdit] = useState(false)
    const [changePassword, setChangePassword] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const getProfile = async () => {
        try {
            const response = await axios.get(backend_url + '/user/get-profile', { headers: { Authorization: token } })
            if (response.data.success) setUser(response.data.user)
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const changePasswordHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + '/user/change-password', { oldPassword, newPassword }, { headers: { Authorization: token } })
            if (response.data.success) { toast.success(response.data.message); setChangePassword(false); setOldPassword(''); setNewPassword(''); getProfile() }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }
    const updateProfileHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        if (name) formData.append("name", name)
        if (email) formData.append("email", email)
        if (profilePic) formData.append("profilePic", profilePic)
        try {
            const response = await axios.post(backend_url + '/user/update-profile', formData, { headers: { Authorization: token } })
            if (response.data.success) { toast.success(response.data.message); setEdit(false); getProfile(); setProfilePic(null) }
            else toast.error(response.data.message)
        } catch (err) { toast.error(err.response.data.message) }
    }

    useEffect(() => { if (token) getProfile() }, [token])

    const Modal = ({ title, onClose, children }) => (
        <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
            <div className="glass-card p-6 w-80 sm:w-96 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                <p className="text-xl font-bold text-white text-center">{title}</p>
                {children}
            </div>
        </div>
    )

    const hasProfilePic = user?.profilePic && !user.profilePic.includes('default') && user.profilePic !== ''

    return (
        <div className="flex flex-col gap-10 sm:gap-12 text-bodyText font-sans m-5 sm:m-7">
            <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold text-white tracking-tight">My Profile</p>
                <p className="text-sm text-[#8888A0]">Manage your account details and preferences</p>
            </div>

            {user && (
                <div className="flex justify-center">
                    <div className="glass-card p-8 w-full max-w-md flex flex-col items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            {edit ? (
                                <label htmlFor="profilePic" className="cursor-pointer block">
                                    {profilePic ? (
                                        <img className="w-24 h-24 rounded-full object-cover" src={URL.createObjectURL(profilePic)} alt="Profile" />
                                    ) : hasProfilePic ? (
                                        <img className="w-24 h-24 rounded-full object-cover" src={user.profilePic} alt="Profile" />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white"
                                            style={{ background: 'linear-gradient(135deg, #7F5AF0, #4B2A85)' }}>
                                            {user.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#7F5AF0' }}>
                                        <AssetIcon src={assets.myprofile.UploadArea} size={13} />
                                    </div>
                                </label>
                            ) : (
                                hasProfilePic ? (
                                    <img className="w-24 h-24 rounded-full object-cover" src={user.profilePic} alt="Profile" />
                                ) : (
                                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white"
                                        style={{ background: 'linear-gradient(135deg, #7F5AF0, #4B2A85)' }}>
                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )
                            )}
                            <input type="file" id="profilePic" onChange={e => setProfilePic(e.target.files[0])} hidden />
                        </div>

                        {/* Profile Fields */}
                        <div className="w-full flex flex-col gap-3">
                            {/* Name */}
                            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(127,90,240,0.15)' }}>
                                <p className="text-xs font-semibold text-[#8888A0] uppercase tracking-wider mb-2">Name</p>
                                {edit
                                    ? <input value={name} onChange={e => setName(e.target.value)} className="fin-input" style={{ padding: '6px 10px' }} placeholder="Your name" />
                                    : <p className="text-white font-medium">{user.name}</p>
                                }
                            </div>
                            {/* Email */}
                            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(127,90,240,0.15)' }}>
                                <p className="text-xs font-semibold text-[#8888A0] uppercase tracking-wider mb-2">Email</p>
                                {edit
                                    ? <input value={email} onChange={e => setEmail(e.target.value)} className="fin-input" style={{ padding: '6px 10px' }} placeholder="Your email" />
                                    : <p className="text-white font-medium">{user.email}</p>
                                }
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full flex flex-col gap-3">
                            {edit ? (
                                <>
                                    <button onClick={updateProfileHandler} className="btn-primary w-full">Save Changes</button>
                                    <button onClick={() => { setEdit(false); setProfilePic(null) }} className="btn-secondary w-full">Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => { setEdit(true); setName(user.name); setEmail(user.email) }}
                                        className="btn-primary w-full flex items-center justify-center gap-2">
                                        <AssetIcon src={assets.budget.Edit} size={15} /> Edit Profile
                                    </button>
                                    <button onClick={() => setChangePassword(true)}
                                        className="btn-secondary w-full flex items-center justify-center gap-2">
                                        <AssetIcon src={assets.wallet.SetPin} size={15} /> Change Password
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {changePassword && (
                <Modal title={<>Change <span className="text-[#7F5AF0]">Password</span></>} onClose={() => setChangePassword(false)}>
                    <form onSubmit={changePasswordHandler} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Old Password</p>
                            <input type="password" onChange={e => setOldPassword(e.target.value)} className="fin-input" value={oldPassword} placeholder="Enter old password" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">New Password</p>
                            <input type="password" onChange={e => setNewPassword(e.target.value)} className="fin-input" value={newPassword} placeholder="Enter new password" />
                        </div>
                        <button type="submit" className="btn-primary w-full">Update Password</button>
                        <button type="button" onClick={() => setChangePassword(false)} className="btn-secondary w-full">Cancel</button>
                    </form>
                </Modal>
            )}
        </div>
    )
}

export default MyProfile
