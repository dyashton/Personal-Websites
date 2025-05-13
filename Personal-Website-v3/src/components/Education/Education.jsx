import { useState, useEffect } from 'react'
import './Education.css'
import { Separator } from "@radix-ui/react-separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import MHLogo from "../../assets/MHLogo.png"
import UTLogo from "../../assets/UTLogo.png"
import { motion } from "framer-motion"
import UTK from "../../assets/UTK.png"
import MH from "../../assets/MerrolHyde.png"
import EducationData from "@/Data/Education.json"
 
export default function Education(){
    const [School, setSchool] = useState("University of Tennessee")
    const LogoDict = {
        "Merrol Hyde Magnet School": MHLogo,
        "University of Tennessee": UTLogo
    }    
    const ImageDict = {
        "Merrol Hyde Magnet School": MH,
        "University of Tennessee": UTK
    }

    function getData(School){
        const filteredData = EducationData.EducationData.filter((item) => item.name === School);
        console.log("Filtered Data: ", filteredData)
        return filteredData.map((item, index) => {
            console.log("Item: ", item.description)
            return (
                <div key={item.name} className="h-full w-4/5 relative flex flex-row pt-20 justify-evenly">
                <div className="w-full h-15 absolute top-0 left-0 ">
                    <div className="flex flex-row w-full items-center">
                        <Avatar className="w-15 h-15">
                            <AvatarImage src={LogoDict[School]} className="drop-shadow-sm drop-shadow-neutral-500 object-cover"/>
                            <AvatarFallback>Logo</AvatarFallback>
                        </Avatar>
                        <motion.div
                        className="text-3xl w-full text-left pl-5"
                        initial={{ opacity: 0.1}}
                        animate={{ opacity: 1}}
                        transition={{ duration: 0.75, ease: "easeInOut" }}
                         >{School}</motion.div>
                    </div>
                </div>
                <img className="w-1/4 h-4/5 object-cover rounded-sm" src={ImageDict[School]}/>
                <div className="w-1/2 h-4/5 flex items-start justify-start">
                    <p className="text-start">{item.description}</p>
                </div>
            </div>
            )
        })
    }

    return (
        <div className="w-full h-full flex flex-row shadow-[0_0px_10px_rgba(255,255,255,0.1)]  p-5">
            {getData(School)}
            <Separator orientation="vertical" className="h-full w-[1px] bg-neutral-600 mx-4"/>
            <div className="h-full w-1/5 flex flex-col gap-4 text-left items-center ">
                <div onClick={()=>setSchool("University of Tennessee")}className={`text-left w-full ${School === "University of Tennessee"?"bg-neutral-300 text-neutral-800 p-2":"hover:outline-2 hover:outline-neutral-600 p-2"}`}>University of Tennessee</div>
                <div onClick={()=> setSchool("Merrol Hyde Magnet School")}className={`text-left w-full ${School === "Merrol Hyde Magnet School"?"bg-neutral-300 text-neutral-800 p-2":"hover:outline-2 hover:outline-neutral-600 p-2"}`}>Merrol Hyde Magnet School</div>
            </div>
        </div>
    )
}