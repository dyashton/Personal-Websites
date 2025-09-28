import { Separator } from "@radix-ui/react-separator"
import { useState } from "react"
import ProjectTab from "@/components/custom/ProjectTab";
import { motion } from "framer-motion"

export default function Projects() {
    const [Tab, setTab] = useState("Software Development");

    return (
        <div className="Page overflow-hidden">
            <div className="w-full h-fit flex flex-row items-center justify-evenly text-neutral-200 p-10 ">
                <div className="flex flex-col group flex-grow cursor-pointer" onClick={() => setTab("Software Development")}>
                    <motion.span
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className={`${Tab === "Software Development" ? "w-full" : "w-fit"} text-center`}>Software Development</motion.span>
                    <span className={`h-[1px] w-0 ${Tab === "Software Development" ? "w-full" : "group-hover:w-full"} bg-neutral-300 transition-all duration-300`}></span>
                </div>
                <Separator orientation="vertical" className="h-full w-[1px] bg-neutral-600 mx-4" />
                <div className="flex flex-col group flex-grow cursor-pointer" onClick={() => setTab("Machine Learning")}>
                    <motion.span
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
                        className={`${Tab === "Machine Learning" ? "text-center" : ""}`}>Machine Learning</motion.span>
                    <span className={`h-[1px] w-0 ${Tab === "Machine Learning" ? "w-full" : "group-hover:w-full"} bg-neutral-300 transition-all duration-300`}></span>
                </div>
                <Separator orientation="vertical" className="h-full w-[1px] bg-neutral-600 mx-4" />
                <div className="flex flex-col group flex-grow cursor-pointer" onClick={() => setTab("Computational Chemistry")}>
                    <motion.span
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                        className={`${Tab === "Computational Chemistry" ? "text-center" : ""}`}>Computational Chemistry</motion.span>
                    <span className={`h-[1px] w-0 ${Tab === "Computational Chemistry" ? "w-full" : "group-hover:w-full"} bg-neutral-300 transition-all duration-300`}></span>
                </div>
                <Separator orientation="vertical" className="h-full w-[1px] bg-neutral-600 mx-4" />
                <div className="overflow-hidden flex flex-col group flex-grow cursor-pointer" onClick={() => setTab("Low Level Programming")}>
                    <motion.span
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.3 }}
                        className={`${Tab === "Low Level Programming" ? "text-center" : ""}`}>Low Level Programming</motion.span>
                    <span className={`h-[1px] w-0 ${Tab === "Low Level Programming" ? "w-full" : "group-hover:w-full"} bg-neutral-300 transition-all duration-300`}></span>
                </div>

            </div>
            <div className="w-9/10 h-4/5 flex flex-row overflow-visible">
                <ProjectTab Tab={Tab} />
            </div>
        </div>
    )
}