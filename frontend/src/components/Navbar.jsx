import { useNavigate } from "react-router"
import { assets } from "../assets/assets"

const Navbar = () => {
    const navigate = useNavigate()
    return (
        <div className="border-b border-borderColour p-2">
            <img onClick={()=>{navigate('/')}} className="w-50" src={assets.website.Finverse}></img>
        </div>
    )
}

export default Navbar