import { useContext } from "react"
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from "../context/AppContext"
import { assets } from "../assets/assets"
import AssetIcon from "./AssetIcon"

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: assets.sidebar.Dashboard },
    { to: '/wallet', label: 'Wallet', icon: assets.sidebar.Wallet },
    { to: '/expense', label: 'Expenses', icon: assets.sidebar.Expenses },
    { to: '/budget', label: 'Budget', icon: assets.sidebar.Budget },
    { to: '/split-bill', label: 'Split Bill', icon: assets.sidebar.SplitBill },
    { to: '/transactions', label: 'Transactions', icon: assets.sidebar.Transactions },
    { to: '/my-profile', label: 'My Profile', icon: assets.sidebar.MyProfile },
]

const Sidebar = () => {
    const navigate = useNavigate()
    const { setToken } = useContext(AppContext)

    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        navigate('/login', { replace: true })
    }

    const sidebarStyle = {
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(127,90,240,0.15)',
        height: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '16px',
    }

    return (
        <div style={sidebarStyle}>
            {/* Nav items */}
            <nav className="flex flex-col flex-1 pt-3 overflow-y-auto">
                {navItems.map(({ to, label, icon }) => {
                    return (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 mx-2 my-0.5 px-3.5 py-2.5 rounded-[10px] transition-all duration-200 no-underline ${isActive
                                    ? 'text-white font-semibold'
                                    : 'text-[#8888A0] font-medium hover:text-white'
                                }`
                            }
                            style={({ isActive }) => isActive ? {
                                background: 'rgba(127,90,240,0.2)',
                                borderLeft: '3px solid #7F5AF0',
                                paddingLeft: '11px',
                            } : {
                                borderLeft: '3px solid transparent',
                            }}
                        >
                            <AssetIcon src={icon} alt="" size={18} style={{ opacity: 0.8 }} />
                            <span className="hidden sm:block text-sm whitespace-nowrap">{label}</span>
                        </NavLink>
                    )
                })}
            </nav>

            {/* Logout at bottom */}
            <div className="mt-auto px-2">
                <div
                    style={{ borderTop: '1px solid rgba(127,90,240,0.1)', marginBottom: '8px' }}
                />
                <button
                    onClick={logout}
                    type="button"
                    aria-label="Log out"
                    title="Log out"
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] transition-all duration-200 text-[#8888A0] hover:text-[#F87171] font-medium"
                    style={{ background: 'transparent', borderLeft: '3px solid transparent', cursor: 'pointer' }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(248,113,113,0.08)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                    }}
                >
                    <AssetIcon src={assets.sidebar.Logout} alt="" size={18} style={{ opacity: 0.6 }} />
                    <span className="hidden sm:block text-sm">Log Out</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar
