import { useState, useEffect } from "react"
import { Separator } from "@radix-ui/react-separator";
import { motion } from "framer-motion";
import JobData from "@/Data/JobData.json"
import FSLogo from "../../assets/FSLogo.png"
import ClaytonLogo from "../../assets/ClaytonLogo.png"
import ClaytonPic from "../../assets/Clayton Internship Collage.png"
export default function Research() {
    const [Job, setJob] = useState("Clayton");
    const JobDict = {
        "Clayton": ClaytonLogo,
        "Functional Solutions": FSLogo,
    }
    const shadowDict = {
        "Clayton": "drop-shadow-[0_0px_10px_rgba(255,255,255,0.1)]",
        "Functional Solutions": "drop-shadow-[0_0px_5px_rgba(255,255,255,0.5)]",
    }
    const PicDict = {
        "Clayton": ClaytonPic,
        "Functional Solutions": null,
    }

    function getData(Job) {
        const filteredData = JobData.JobData.filter((item) => item.name === Job);
        console.log("Filtered Data: ", filteredData)
        return filteredData.map((item, index) => {
            console.log("Item: ", item.description)
            return (
                <div key={index + item.name} className="w-full h-full flex flex-col gap-2 text-left items-evenly justify-start relative px-10 pt-5">
                    <div className="flex flex-row w-full items-start justify-between mb-10">
                        <div className={`object-cover w-full h-full flex items-start`}>
                            <img className={`rounded-sm w-40 ${shadowDict[Job]}`} src={JobDict[Job]} loading="lazy" />
                            <Separator orientation="vertical" className="h-full w-[1px] bg-neutral-600 mx-4" />
                            <div className="flex flex-col  ">
                                <div className="text-2xl">{item.name}</div>
                                <div className="text-lg text-neutral-400 ">{item.position}</div>
                            </div>
                        </div>
                        <div className="w-fit whitespace-nowrap">
                            {item.date}
                        </div>
                    </div>
                    <div className="flex flex-row w-full h-full gap-5">
                        <div className={`object-cover w-full h-full flex items-start ${PicDict[Job] === null ? "hidden" : ""}`}>
                            <img className="rounded-sm " src={PicDict[Job]} loading="lazy"></img>
                        </div>
                        <div
                            className={`list-disc ${PicDict[Job] === null ? 'w-full justify-start ' : 'w-5/7'
                                } h-4/5 pl-3`}
                        >
                            {item.description.map((desc, idx) => (
                                <div
                                    key={idx}
                                    className="w-full h-30 flex items-start justify-start list-inside"
                                >
                                    {desc}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )
        })
    }

    return (
        <div className="w-full h-full flex flex-row shadow-[0_0px_10px_rgba(255,255,255,0.1)] p-5">
            <div className="h-full w-4/5 relative">
                <div className="h-full">
                    {getData(Job)}
                </div>
            </div>
            <Separator orientation="vertical" className="h-full w-[1px] bg-neutral-600 mx-4" />
            <div className="h-full w-1/5 flex flex-col gap-4 text-left items-center ">
                <div onClick={() => setJob("Clayton")} className={`text-left w-full ${Job === "Clayton" ? "bg-neutral-300 text-neutral-800 p-2" : "hover:outline-2 hover:outline-neutral-600 p-2"}`}>Clayton</div>
                <div onClick={() => setJob("Functional Solutions")} className={`text-left w-full ${Job === "Functional Solutions" ? "bg-neutral-300 text-neutral-800 p-2" : "hover:outline-2 hover:outline-neutral-600 p-2"}`}>Functional Solutions</div>
            </div>
        </div>
    )
}