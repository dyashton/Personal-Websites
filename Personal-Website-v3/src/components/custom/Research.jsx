import { useState, useEffect } from "react"
import { Separator } from "@radix-ui/react-separator";
import { motion } from "framer-motion";
import LabData from "@/Data/LabData.json"
import { Typewriter } from "react-simple-typewriter"
import ZhaoLab from "../../assets/ZhaoLab.png"
import EpicLab from "../../assets/EpicLab.png"

export default function Research() {
    const [Lab, setLab] = useState("Dr. Kostas' Lab");
    const LabDict = {
        "Dr. Kostas' Lab": null,
        "Dr. Zhao's Lab": ZhaoLab,
        "Epic Lab": EpicLab,
        "AURAS Lab": null
    }

    function getData(Lab) {
        const filteredData = LabData.LabData.filter((item) => item.name === Lab);
        console.log("Filtered Data: ", filteredData)
        return filteredData.map((item, index) => {
            console.log("Item: ", item.description)
            return (
                <div key={index + item.name} className="w-full h-full flex flex-row gap-2 text-left items-center justify-evenly p-5 pt-10">
                    <div className={`object-cover w-2/7 h-4/5 flex items-start ${LabDict[Lab] === null ? "hidden" : ""}`}>
                        <img className="rounded-sm" src={LabDict[Lab]} loading="lazy"></img>
                    </div>
                    <ul
                        className={`list-disc ${LabDict[Lab] === null ? 'w-full justify-start ' : 'w-5/7'
                            } h-4/5 pl-5`}
                    >
                        {item.description.map((desc, idx) => (
                            <li
                                key={idx}
                                className="w-full h-20 flex items-start justify-start px-10 list-inside"
                            >
                                <Typewriter
                                    words={[desc]}
                                    typeSpeed={5}
                                    deleteSpeed={0}
                                />
                            </li>
                        ))}
                    </ul>

                </div>
            )
        })
    }

    return (
        <div className="w-full h-full flex flex-row shadow-[0_0px_10px_rgba(255,255,255,0.1)]  p-5">
            <div className="h-full w-4/5 relative">
                <div className="w-full h-15 absolute top-0 left-0 ">
                    <div className="flex flex-row w-full items-center">
                        <motion.div
                            className="text-3xl w-full text-left pl-5 pt-3"
                            initial={{ opacity: 0.1 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.75, ease: "easeInOut" }}
                        >{Lab}</motion.div>
                    </div>
                </div>
                <div className="h-full">
                    {getData(Lab)}
                </div>
            </div>
            <Separator orientation="vertical" className="h-full w-[1px] bg-neutral-600 mx-4" />
            <div className="h-full w-1/5 flex flex-col gap-4 text-left items-center ">
                <div onClick={() => setLab("Dr. Kostas' Lab")} className={`text-left w-full ${Lab === "Dr. Kostas' Lab" ? "bg-neutral-300 text-neutral-800 p-2" : "hover:outline-2 hover:outline-neutral-600 p-2"}`}>Dr. Kostas' Lab</div>
                <div onClick={() => setLab("Dr. Zhao's Lab")} className={`text-left w-full ${Lab === "Dr. Zhao's Lab" ? "bg-neutral-300 text-neutral-800 p-2" : "hover:outline-2 hover:outline-neutral-600 p-2"}`}>Dr. Zhao's Lab</div>
                <div onClick={() => setLab("Epic Lab")} className={`text-left  w-full ${Lab === "Epic Lab" ? "bg-neutral-300 text-neutral-800 p-2" : "hover:outline-2 hover:outline-neutral-600 p-2"}`}>Epic Lab</div>
                <div onClick={() => setLab("AURAS Lab")} className={`text-left w-full ${Lab === "AURAS Lab" ? "bg-neutral-300 text-neutral-800 p-2" : "hover:outline-2 hover:outline-neutral-600 p-2"}`}>AURAS Lab</div>
            </div>
        </div>
    )
}