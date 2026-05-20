import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import axios from "axios"
import { toast } from 'react-toastify'
import { AppContext } from "../context/AppContext"
import { useContext, useState } from "react"
import { assets } from "../assets/assets"
import { useNavigate } from "react-router-dom"

const Login = () => {
    const navigate = useNavigate()
    const { backend_url, setToken } = useContext(AppContext)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [state, setState] = useState('sign-up')

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (state === 'sign-up') {
                const response = await axios.post(backend_url + '/user/sign-up', { name, email, password })
                if (response.data.success) {
                    setToken(response.data.token)
                    localStorage.setItem('token', response.data.token)
                    toast.success(response.data.message)
                } else toast.error(response.data.message)
            } else {
                const response = await axios.post(backend_url + '/user/login', { email, password })
                if (response.data.success) {
                    setToken(response.data.token)
                    localStorage.setItem('token', response.data.token)
                    toast.success(response.data.message)
                } else toast.error(response.data.message)
            }
        } catch (err) {
            toast.error(err.response.data.message)
        }
    }

    return (
        <div className="text-bodyText font-sans min-h-screen flex flex-col">
            {/* Minimal Navbar for Login */}
            <div className="h-14 flex items-center px-6 sm:px-10" style={{ borderBottom: '1px solid rgba(127,90,240,0.15)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)' }}>
                <img
                    onClick={() => navigate('/')}
                    src={assets.website.Finverse}
                    className="h-8 w-auto object-contain cursor-pointer"
                    alt="Finverse"
                />
            </div>

            {/* Centered Form */}
            <div className="flex-1 flex justify-center items-start px-5 py-16 relative">
                {/* Background orbs */}
                <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(127,90,240,0.15), transparent 70%)', filter: 'blur(40px)' }} />

                <form
                    onSubmit={onSubmitHandler}
                    className="glass-card flex flex-col gap-6 w-full max-w-sm p-8 sm:p-10 relative z-10"
                >
                    {/* Top shimmer line */}
                    <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl" style={{ background: 'linear-gradient(to right, transparent, #7F5AF0, transparent)' }} />

                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">
                            {state === 'sign-up' ? <>Create an <span className="text-[#7F5AF0]">Account</span></> : <>Welcome <span className="text-[#7F5AF0]">Back</span></>}
                        </p>
                        <p className="text-sm text-[#8888A0] mt-1">
                            {state === 'sign-up' ? 'Start managing your finances today' : 'Sign in to your Finverse account'}
                        </p>
                    </div>

                    {state === 'sign-up' && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#8888A0]">Full Name</p>
                            <input type="text" onChange={e => setName(e.target.value)} value={name} className="fin-input" placeholder="Your name" />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-[#8888A0]">Email</p>
                        <input type="email" onChange={e => setEmail(e.target.value)} value={email} className="fin-input" placeholder="email@example.com" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-[#8888A0]">Password</p>
                        <input type="password" onChange={e => setPassword(e.target.value)} value={password} className="fin-input" placeholder="••••••••" />
                    </div>

                    <button type="submit" className="btn-primary w-full text-base py-3">
                        {state === 'sign-up' ? 'Create Account' : 'Sign In'}
                    </button>

                    <p className="text-sm text-center text-[#8888A0]">
                        {state === 'sign-up'
                            ? <>Already have an account?{' '}
                                <span onClick={() => { setState('login'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                                    className="text-[#7F5AF0] cursor-pointer hover:text-[#9A7DFF] transition-colors font-medium">
                                    Sign In
                                </span></>
                            : <>Don't have an account?{' '}
                                <span onClick={() => { setState('sign-up'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                                    className="text-[#7F5AF0] cursor-pointer hover:text-[#9A7DFF] transition-colors font-medium">
                                    Sign Up
                                </span></>
                        }
                    </p>
                </form>
            </div>

            <Footer />
        </div>
    )
}

export default Login
