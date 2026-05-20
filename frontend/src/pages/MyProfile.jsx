import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { assets } from "../assets/assets"

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
            const response = await axios.get(backend_url + '/user/get-profile', {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                setUser(response.data.user)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const changePasswordHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + '/user/change-password', {
                oldPassword,
                newPassword
            }, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                toast.success(response.data.message)
                setChangePassword(false)
                setOldPassword('')
                setNewPassword('')
                getProfile()
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const updateProfileHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        if (name) formData.append("name", name)
        if (email) formData.append("email", email)
        if (profilePic) formData.append("profilePic", profilePic)

        try {
            const response = await axios.post(backend_url + '/user/update-profile', formData, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                toast.success(response.data.message)
                setEdit(false)
                getProfile()
                setProfilePic(null)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    useEffect(() => {
        if (token) {
            getProfile()
        }
    }, [token])

    return (
        <div className="flex flex-col gap-10 md:gap-15 text-bodyText font-serif m-3 md:m-5">
            <p className="text-3xl font-bold"> My Profile 👤 </p>
            <div className="flex justify-center">
                {
                    user &&
                    <div className="w-70 px-5 py-10 md:p-10 md:w-145 flex flex-col justify-center items-center gap-5 md:flex-row md:gap-10 border border-gray-300 rounded-xl hover:scale-103  transition-all duration-300 shadow-[0_0_60px_rgba(168,85,247,0.6)]">
                        {
                            edit ?
                                <div>
                                    <label htmlFor="profilePic">
                                        <img className="w-50 h-50 rounded-xl" src={profilePic ? URL.createObjectURL(profilePic) : user.profilePic}></img>
                                    </label>
                                    <input type="file" id="profilePic" onChange={(e) => { setProfilePic(e.target.files[0]) }} hidden />
                                </div>
                                :
                                <img className="w-50 h-50 rounded-xl" src={user.profilePic}></img>
                        }
                        <div className="w-60 flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <p className="font-bold text-purple-300">Name</p>
                                {
                                    edit ? <input className="p-1 border border-gray-300 w-60 rounded-md" value={name} onChange={(e) => { setName(e.target.value) }} /> : <p>{user.name}</p>
                                }
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="font-bold text-purple-300">Email</p>
                                {
                                    edit ? <input className="p-1 border border-gray-300 w-60 rounded-md" value={email} onChange={(e) => { setEmail(e.target.value) }} /> : <p>{user.email}</p>
                                }
                            </div>
                            {
                                edit ? <button className="bg-button px-2 py-1 text-center rounded-full font-bold w-60" onClick={updateProfileHandler}> SAVE </button> : <button className="bg-button px-2 py-1 text-center rounded-full font-bold w-60" onClick={() => { setEdit(true); setName(user.name); setEmail(user.email) }}> EDIT </button>
                            }
                            {
                                !edit && <div onClick={() => { setChangePassword(true) }} className="bg-button px-2 py-1  text-center rounded-full font-bold">
                                    Change Password
                                </div>
                            }

                        </div>
                    </div>
                }
                {
                    changePassword && <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-sm">
                        <div className="w-70 sm:p-10 sm:w-100 bg-card rounded-xl border border-gray-300 p-7 flex flex-col gap-7">
                            <p className="text-2xl sm:text-3xl font-bold text-center"> Change <span className="text-purple-300"> Password </span> </p>
                            <form onSubmit={changePasswordHandler} className="flex flex-col gap-7">
                                <div className="flex flex-col gap-2">
                                    <p className="text-left text-sm sm:text-base font-bold">Old Password</p>
                                    <input type="password" onChange={(e) => { setOldPassword(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 rounded-md w-full p-1" value={oldPassword} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-left text-sm sm:text-base font-bold">New Password</p>
                                    <input type="password" onChange={(e) => { setNewPassword(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 rounded-md w-full p-1" value={newPassword} />
                                </div>
                                <div className="flex flex-col gap-3 font-bold text-sm sm:text-lg">
                                    <button type="submit" className="bg-button p-1 hover:bg-buttonHover rounded-md"> Change Password </button>
                                    <button type="button" onClick={() => { setChangePassword(false) }} className="bg-button p-1 hover:bg-buttonHover rounded-md"> Cancel </button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default MyProfile
