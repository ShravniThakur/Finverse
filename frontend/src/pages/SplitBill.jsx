import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from "react"
import { useEffect } from "react"
import { assets } from "../assets/assets"
import { useNavigate } from "react-router-dom"

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

    const getGroupData = async () => {
        try {
            const response = await axios.get(backend_url + '/split-bill/get-group-data', {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                setYouOwe(response.data.youOwe)
                setYouAreOwed(response.data.youAreOwed)
                setTotalGroups(response.data.totalGroups)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const getAllGroups = async () => {
        try {
            const response = await axios.get(backend_url + '/split-bill/get-all-groups', {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                setAllGroups(response.data.groups)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const addGroupHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backend_url + '/split-bill/add-group', { groupName }, {
                headers: {
                    Authorization: token
                }
            })
            if (response.data.success) {
                setPopUp(true)
                setGroupCode(response.data.groupCode)
                setCreateGroup(false)
                getGroupData()
                getAllGroups()
                window.scrollTo({ top: 0, behavior: "smooth" })
                toast.success(response.data.message)
            }
            else toast.error(response.data.message)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const joinGroupHandler = async (e) => {
        e.preventDefault()
        if(!code.trim()){
            toast.error("Group Code Required!")
            return 
        }
        try{
            const response = await axios.post(backend_url + `/split-bill/join-group/${code}`,{},{
                headers: {
                    Authorization: token
                }
            })
            if(response.data.success){
                toast.success(response.data.message)
                window.scrollTo({top:0, behavior: "smooth"})
                getGroupData()
                getAllGroups()
                setCode('')
                setJoinGroup(false)
            }
            else toast.error(response.data.message)
        }
        catch(err){
            toast.error(err.response.data.message)
        }
    }

    useEffect(() => {
        getGroupData()
        getAllGroups()
    }, [token])

    return (
        <div className="flex flex-col gap-10 sm:gap-15 text-bodyText font-serif m-5">
            <p className="text-3xl font-bold"> Split Bill 🤝 </p>
            {/* Quick Stats */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.dashboard.QuickStats}></img>
                    <p className="text-xl font-bold text-purple-300">Quick Stats</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    <div className=" border border-gray-300 flex flex-col gap-3 bg-card rounded-xl p-5 hover:scale-103 hover:bg-cardHover transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.splitbill.YouAreOwed}></img>
                            <p className="text-xl">You Are Owed</p>
                        </div>
                        <p className="font-bold text-2xl">Rs. {youAreOwed}</p>
                    </div>
                    <div className="border border-gray-300 flex flex-col gap-3 bg-card rounded-xl p-5 hover:scale-103 hover:bg-cardHover transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.splitbill.YouOwe}></img>
                            <p className="text-xl"> You Owe </p>
                        </div>
                        <p className="font-bold text-2xl"> Rs. {youOwe} </p>
                    </div>
                    <div className="border border-gray-300 flex flex-col gap-3 bg-card rounded-xl p-5 hover:scale-103 hover:bg-cardHover transition-all duration-300 shadow-[0_0_100px_rgba(168,85,247,0.6)]">
                        <div className="flex gap-4 items-center">
                            <img className="w-8 h-8" src={assets.splitbill.Group}></img>
                            <p className="text-xl"> Total Groups </p>
                        </div>
                        <p className="font-bold text-2xl"> {totalGroups} </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.dashboard.QuickActions}></img>
                    <p className="text-xl font-bold text-purple-300">Quick Actions</p>
                </div>
                <div className="flex flex-wrap gap-5">
                    <div onClick={() => { setCreateGroup(true) }} className="w-52 bg-card rounded-full px-5 py-2 hover:scale-103 hover:bg-cardHover transition-all duration-300 flex gap-4 items-center justify-center">
                        <img className="w-8 h-8" src={assets.splitbill.CreateGroup}></img>
                        <p className="text-xl">Create Group</p>
                    </div>
                    {
                        createGroup &&
                        <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-sm">
                            <div className="w-70 sm:p-10 sm:w-100 bg-card rounded-xl border border-gray-300 p-7 flex flex-col gap-7">
                                <p className="text-2xl sm:text-3xl font-bold text-center"> Create <span className="text-purple-300"> Group </span> </p>
                                <form onSubmit={addGroupHandler} className="flex flex-col gap-7">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm sm:text-base font-bold">Group Name</p>
                                        <input type="text" onChange={(e) => { setGroupName(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 rounded-md w-full p-1" value={groupName} />
                                    </div>
                                    <div className="flex flex-col gap-3 font-bold text-sm sm:text-lg">
                                        <button type="submit" className="bg-button p-1 hover:bg-buttonHover rounded-md"> Create Group </button>
                                        <button type="button" onClick={() => { setCreateGroup(false) }} className="bg-button p-1 hover:bg-buttonHover rounded-md"> Cancel </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    }
                    {
                        popUp &&
                        <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-sm">
                            <div className="w-70 sm:p-10 sm:w-100 bg-card rounded-xl border border-gray-300 p-7 flex flex-col gap-7">
                                <p className="text-2xl sm:text-3xl font-bold text-center"> Group <span className="text-purple-300"> Created! </span> </p>
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm sm:text-base"> <span className="font-bold text-purple-300"> Group Name : </span>  {groupName} </p>
                                    <div className="flex gap-3 text-center">
                                        <p className="text-sm sm:text-base"> <span className="font-bold text-purple-300"> Group Code : </span>  {groupCode} </p>
                                        <img onClick={() => { navigator.clipboard.writeText(groupCode); toast.success("Group Code copied to clipboard!") }} className="w-5 h-5" src={assets.website.Copy}></img>
                                    </div>
                                </div>
                                <p className="text-sm sm:text-base text-center">Share this code with friends to add them to the group!</p>
                                <button onClick={() => { setPopUp(false) }} className="bg-button p-1 hover:bg-buttonHover rounded-md font-bold text-sm sm:text-lg">Done</button>
                            </div>
                        </div>
                    }
                    <div onClick={() => {setJoinGroup(true) }} className="w-50 bg-card rounded-full px-5 py-2 hover:scale-103 hover:bg-cardHover transition-all duration-300 flex gap-4 items-center justify-center">
                        <img className="w-8 h-8" src={assets.splitbill.CreateGroup}></img>
                        <p className="text-xl">Join Group</p>
                    </div>
                    {
                        joinGroup &&
                        <div className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-sm">
                            <div className="w-70 sm:p-10 sm:w-100 bg-card rounded-xl border border-gray-300 p-7 flex flex-col gap-7">
                                <p className="text-2xl sm:text-3xl font-bold text-center"> Join <span className="text-purple-300"> Group </span> </p>
                                <form onSubmit={joinGroupHandler} className="flex flex-col gap-7">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm sm:text-base font-bold">Group Code</p>
                                        <input type="text" onChange={(e) => { setCode(e.target.value) }} className="text-sm sm:text-base border border-gray-300 h-8 sm:h-9 rounded-md w-full p-1" value={code} />
                                    </div>
                                    <div className="flex flex-col gap-3 font-bold text-sm sm:text-lg">
                                        <button type="submit" className="bg-button p-1 hover:bg-buttonHover rounded-md"> Join Group </button>
                                        <button type="button" onClick={() => { setJoinGroup(false) }} className="bg-button p-1 hover:bg-buttonHover rounded-md"> Cancel </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    }
                </div>
            </div>

            {/* My Groups */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 items-center">
                    <img className="w-8 h-8" src={assets.splitbill.Group}></img>
                    <p className="text-xl font-bold text-purple-300">My Groups</p>
                </div>
                <div className="flex flex-col gap-5">
                    {
                        allGroups.map((g) => {
                            return (
                                <div key={g.groupCode} className="flex flex-col sm:flex-row sm:justify-between gap-4 md:gap-7">
                                    <div className={`w-full sm:w-[80%] sm:flex sm:justify-between p-4 border rounded-lg hover:border-white transition-all duration-300 ${g.balance >= 0 ? "border-green-200/70" : "border-red-200/80"}`}>
                                        <p className="text-xl font-bold"> {g.groupName} </p>
                                        {
                                            g.balance >= 0 ? <p> You Are Owed <span className="text-green-300 font-bold"> Rs.{g.balance} </span> </p> : <p> You Owe <span className="text-red-300 font-bold">Rs.{-g.balance}</span> </p>
                                        }
                                    </div>
                                    <button onClick={() => { navigate(`/group-details/${g.groupCode}`) }} className="w-full p-2 sm:w-[20%] sm:p-4 rounded-lg border border-violet-300 font-bold sm:text-xl hover:border-white transition-all duration-300"> VIEW </button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default SplitBill