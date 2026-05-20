import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import axios from "axios"
import { toast } from 'react-toastify'
import { AppContext } from "../context/AppContext"
import { useContext, useState } from "react"

const Login = () => {
    const { backend_url, setToken } = useContext(AppContext)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [state, setState] = useState('sign-up')

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (state === 'sign-up') {
                const response = await axios.post(backend_url + '/user/sign-up', {
                    name,
                    email,
                    password
                })
                if (response.data.success) {
                    setToken(response.data.token)
                    localStorage.setItem('token',response.data.token)
                    toast.success(response.data.message)
                }
                else toast.error(response.data.message)
            }
            else {
                const response = await axios.post(backend_url + '/user/login', {
                    email,
                    password
                })
                if (response.data.success) {
                    setToken(response.data.token)
                    localStorage.setItem('token',response.data.token)
                    toast.success(response.data.message)
                }
                else toast.error(response.data.message)
            }
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    return (
        <div className="text-bodyText font-serif">
            <Navbar></Navbar>
            <div className="flex justify-center mt-15 mx-5 sm:m-15">
                <form onSubmit={onSubmitHandler} className="flex flex-col gap-7 w-full bg-card p-8 rounded-xl border border-gray-300 shadow-[0_0_40px_rgba(168,85,247,0.6)] sm:w-110 sm:p-10">
                    {
                        state === 'sign-up' ? <p className="font-bold text-center text-3xl">Sign <span className="text-purple-300">Up</span> </p> :  <p className="font-bold text-center text-3xl">Log <span className="text-purple-300">in</span> </p> 
                    }
                    {
                        state === 'sign-up' &&
                        <div className="flex flex-col gap-2">
                            <p className="font-bold"> Full Name </p>
                            <input type="text" onChange={(e)=>{setName(e.target.value)}} value={name} className="w-full border border-gray-300 rounded h-10 p-2"/>
                        </div>
                    }
                    <div className="flex flex-col gap-2">
                        <p className="font-bold"> Email </p>
                        <input type="email" onChange={(e)=>{setEmail(e.target.value)}} value={email} className="w-full border border-gray-300 rounded h-10 p-2"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-bold"> Password </p>
                        <input type="password" onChange={(e)=>{setPassword(e.target.value)}} value={password} className="w-full border border-gray-300 rounded h-10 p-2"/>
                    </div>
                    <div>
                        {
                            state === 'sign-up' ? <button type="submit" className="bg-button w-full py-2 rounded-md text-xl font-bold hover:bg-buttonHover duration-300">Sign Up</button> : <button type="submit" className="bg-button w-full py-2 rounded-md text-xl font-bold hover:bg-buttonHover duration-300">Login</button>
                        }
                    </div>
                    {
                        state === 'sign-up'? <p className="text-center">Already have an account? <span onClick={()=>{setState('login'); window.scrollTo({top:0, behavior:"smooth"})}} className="text-purple-300 underline">Login</span> </p> : <p className="text-center"> Create a new account? <span onClick={()=>{setState('sign-up'); window.scrollTo({top:0, behavior:"smooth"})}} className="text-purple-300 underline"> Sign Up </span> </p>
                    }
                </form>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Login