import { Separator } from "@radix-ui/react-separator"
import { useState } from "react"
import ProjectTab from "@/components/custom/ProjectTab";
import { motion } from "framer-motion"

export default function Projects() {
    const [Tab, setTab] = useState("Software Development");

    return (
        <div className="Page min-h-0 overflow-hidden flex flex-col">
            <div className="w-full shrink-0 flex flex-row flex-nowrap items-center justify-start md:justify-evenly gap-1 sm:gap-2 text-neutral-200 text-xs sm:text-sm md:text-base p-4 md:p-10 overflow-x-auto">
                <div className="flex flex-col group flex-shrink-0 min-w-[9rem] sm:min-w-0 sm:flex-grow cursor-pointer" onClick={() => setTab("Software Development")}>
                    <motion.span
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className={`${Tab === "Software Development" ? "w-full" : "w-fit"} text-center`}>Software Development</motion.span>
                    <span className={`h-[1px] w-0 ${Tab === "Software Development" ? "w-full" : "group-hover:w-full"} bg-neutral-300 transition-all duration-300`}></span>
                </div>
                <Separator orientation="vertical" className="hidden sm:block h-8 sm:h-full w-[1px] bg-neutral-600 mx-1 sm:mx-4 shrink-0" />
                <div className="flex flex-col group flex-shrink-0 min-w-[9rem] sm:min-w-0 sm:flex-grow cursor-pointer" onClick={() => setTab("Machine Learning")}>
                    <motion.span
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
                        className={`${Tab === "Machine Learning" ? "text-center" : ""}`}>Machine Learning</motion.span>
                    <span className={`h-[1px] w-0 ${Tab === "Machine Learning" ? "w-full" : "group-hover:w-full"} bg-neutral-300 transition-all duration-300`}></span>
                </div>
                <Separator orientation="vertical" className="hidden sm:block h-8 sm:h-full w-[1px] bg-neutral-600 mx-1 sm:mx-4 shrink-0" />
                <div className="flex flex-col group flex-shrink-0 min-w-[10rem] sm:min-w-0 sm:flex-grow cursor-pointer" onClick={() => setTab("Computational Chemistry")}>
                    <motion.span
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                        className={`${Tab === "Computational Chemistry" ? "text-center" : ""}`}>Computational Chemistry</motion.span>
                    <span className={`h-[1px] w-0 ${Tab === "Computational Chemistry" ? "w-full" : "group-hover:w-full"} bg-neutral-300 transition-all duration-300`}></span>
                </div>
                <Separator orientation="vertical" className="hidden sm:block h-8 sm:h-full w-[1px] bg-neutral-600 mx-1 sm:mx-4 shrink-0" />
                <div className="overflow-hidden flex flex-col group flex-shrink-0 min-w-[11rem] sm:min-w-0 sm:flex-grow cursor-pointer" onClick={() => setTab("Low Level Programming")}>
                    <motion.span
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.3 }}
                        className={`${Tab === "Low Level Programming" ? "text-center" : ""}`}>Low Level Programming</motion.span>
                    <span className={`h-[1px] w-0 ${Tab === "Low Level Programming" ? "w-full" : "group-hover:w-full"} bg-neutral-300 transition-all duration-300`}></span>
                </div>

            </div>
            <div className="w-full flex-1 min-h-0 flex flex-row overflow-visible px-2 md:px-4 pb-4">
                <ProjectTab Tab={Tab} />
            </div>
        </div>
    )
}