import { useContext } from "react"
import { assets } from "../assets/assets"
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from "../context/AppContext"

const Sidebar = () => {

    const navigate = useNavigate()
    const {setToken} = useContext(AppContext)

    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
    }

    return (
        <div className="font-serif text-heading font-bold border-r border-borderColour h-full">
            <div>
                <NavLink to='/dashboard' className={({isActive})=>`flex gap-2 items-center py-2 px-3 border-b border-borderColour ${isActive? "bg-card text-purple-300" : "hover:bg-card text-purple-300Hover"}`}>
                    <img className="w-7 h-7" src={assets.sidebar.Dashboard}></img>
                    <p className="hidden sm:block">Dashboard</p>
                </NavLink>
                <NavLink to='/wallet' className={({isActive})=>`flex gap-2 items-center py-2 px-3 border-b border-borderColour ${isActive? "bg-card text-purple-300" : "hover:bg-card text-purple-300Hover"}`}>
                    <img className="w-7 h-7" src={assets.sidebar.Wallet}></img>
                    <p className="hidden sm:block">Wallet</p>
                </NavLink>
                <NavLink to='/expense' className={({isActive})=>`flex gap-2 items-center py-2 px-3 border-b border-borderColour ${isActive? "bg-card text-purple-300" : "hover:bg-card text-purple-300Hover"}`}>
                    <img className="w-7 h-7" src={assets.sidebar.Expenses}></img>
                    <p className="hidden sm:block">Expenses</p>
                </NavLink>
                <NavLink to='/budget' className={({isActive})=>`flex gap-2 items-center py-2 px-3 border-b border-borderColour ${isActive? "bg-card text-purple-300" : "hover:bg-card text-purple-300Hover"}`}>
                    <img className="w-7 h-7" src={assets.sidebar.Budget}></img>
                    <p className="hidden sm:block">Budget</p>
                </NavLink>
                <NavLink to='/split-bill' className={({isActive})=>`flex gap-2 items-center py-2 px-3 border-b border-borderColour ${isActive? "bg-card text-purple-300" : "hover:bg-card text-purple-300Hover"}`}>
                    <img className="w-7 h-7" src={assets.sidebar.SplitBill}></img>
                    <p className="hidden sm:block">Split Bill</p>
                </NavLink>
                <NavLink to='/transactions' className={({isActive})=>`flex gap-2 items-center py-2 px-3 border-b border-borderColour ${isActive? "bg-card text-purple-300" : "hover:bg-card text-purple-300Hover"}`}>
                    <img className="w-7 h-7" src={assets.sidebar.Transactions}></img>
                    <p className="hidden sm:block">Transactions</p>
                </NavLink>
                <NavLink to='/my-profile' className={({isActive})=>`flex gap-2 items-center py-2 px-3 border-b border-borderColour ${isActive? "bg-card text-purple-300" : "hover:bg-card text-purple-300Hover"}`}>
                    <img className="w-7 h-7" src={assets.sidebar.MyProfile}></img>
                    <p className="hidden sm:block">My Profile</p>
                </NavLink>
                <div onClick={()=>{logout()}} className="flex gap-2 items-center py-2 px-3 border-b border-borderColour hover:bg-cardHover">
                    <img className="w-7 h-7" src={assets.sidebar.Logout}></img>
                    <p className="hidden sm:block">Log Out</p>
                </div>
            </div>
        </div>
    )
}

export default Sidebar