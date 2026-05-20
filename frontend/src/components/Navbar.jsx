import { useNavigate } from "react-router"
import { assets } from "../assets/assets"

const Navbar = () => {
    const navigate = useNavigate()

    return (
        <div className="h-14 flex items-center px-4 sm:px-6">
            {/* Logo */}
            <img
                onClick={() => { navigate('/') }}
                className="h-8 w-auto cursor-pointer object-contain"
                src={assets.website.Finverse}
                alt="Finverse"
            />
        </div>
    )
}

export default Navbar
