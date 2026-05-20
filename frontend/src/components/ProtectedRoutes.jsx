import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const ProtectedRoutes = () => {
    const { token } = useContext(AppContext)

    if (!token) return <Navigate to='/login' replace></Navigate>
    return (
        <>
            <div className='fixed z-50 h-14 w-full' style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(127,90,240,0.15)' }}>
                <Navbar></Navbar>
            </div>
            <div className='flex'>
                <div className='h-full fixed z-40 left-0 top-14' style={{ width: '64px' }}>
                    <div className='sm:hidden'>
                        <Sidebar></Sidebar>
                    </div>
                </div>
                <div className='h-full fixed z-40 left-0 top-14 hidden sm:block' style={{ width: '220px' }}>
                    <Sidebar></Sidebar>
                </div>
                <div className='flex-1 min-w-0 mt-14 ml-16 sm:ml-[220px]'>
                    <Outlet></Outlet>
                </div>
            </div>
        </>
    )
}
export default ProtectedRoutes