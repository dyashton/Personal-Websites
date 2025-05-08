import { useState } from 'react'
import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"

export default function Navbar() {
    const [Tab, setTab] = useState(null);
    return(
            <nav className="w-full justify-center flex items-center h-16 text-neutral-200">
                <div className="flex items-center justify-left w-1/2 m-10">
                    <Link to="/home" onClick={()=>setTab("Home")} className="text-2xl">Ashton Dy</Link>
                </div>
                <div className="flex items-center justify-evenly h-10 w-1/2 text-neutral-200">
                    <Separator orientation="vertical" />
                    <Link to="/experience" className="group flex flex-col text-center" onClick={()=>setTab("Experience")}>
                        <span >Experience</span>
                        <span className={`h-[1px] w-0 ${Tab === "Experience"?"w-full":"group-hover:w-full"} bg-neutral-300 transition-all duration-300`}></span>
                    </Link>
                    <Separator orientation="vertical" />
                    <Link to="/projects" className="group flex flex-col text-center" onClick={()=>setTab("Projects")}>
                        <span >Projects</span>
                        <span className={`h-[1px] w-0 ${Tab === "Projects"?"w-full":"group-hover:w-full"} bg-neutral-300 transition-all duration-300`}></span>

                    </Link>
                    <Separator orientation="vertical"  />
                    <Link to="/credentials" className="group flex flex-col text-center" onClick={()=>setTab("Credentials")}>
                        <span >Credentials</span>
                        <span className={`h-[1px] w-0 ${Tab === "Credentials"?"w-full":"group-hover:w-full"} bg-neutral-300 transition-all duration-300`}></span>
    
                    </Link>
                    <Separator orientation="vertical" />
                    <Link to="/contact" className="group flex flex-col text-center" onClick={()=>setTab("Contact")}>
                        <span >Contact</span>
                        <span className={`h-[1px] w-0 ${Tab === "Contact"?"w-full":"group-hover:w-full"} bg-neutral-300 transition-all duration-300`}></span>

                    </Link>
                </div>
            </nav>

    )
}