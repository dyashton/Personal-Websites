import { Separator } from "@radix-ui/react-separator"
import { useState, useEffect } from 'react'
import Education from "@/components/custom/Education"
import Research from "@/components/custom/Research"
import CourseWork from "@/components/custom/CourseWork"
import Professional from "@/components/custom/Professional"
import { motion } from "framer-motion"

export default function Experience() {
    const [Title, setTitle] = useState("Education")
    const TabDict = {
        "Education": <Education />,
        "Research": <Research />,
        "Course Work": <CourseWork />,
        "Professional": <Professional />
    }

    return (
        <div className="Page">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-fit h-1/4 flex flex-row items-center justify-center text-neutral-200 absolute left-20 top-10">
                <div className="relative group w-fit" onClick={() => setTitle("Education")}>
                    <span className="cursor-pointer">Education</span>
                    <span className={`absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 ${Title === "Education" ? "w-full" : "group-hover:w-full"}`}></span>
                </div>
                <Separator orientation="vertical" className="h-8 w-[1px] bg-neutral-400 mx-4" />
                <div className="relative group w-fit" onClick={() => setTitle("Research")}>
                    <span className="cursor-pointer" >Research</span>
                    <span className={`absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 ${Title === "Research" ? "w-full" : "group-hover:w-full"}`}></span>
                </div>
                <Separator orientation="vertical" className="h-8 w-[1px] bg-neutral-400 mx-4" />
                <div className="relative group w-fit" onClick={() => setTitle("Course Work")}>
                    <span className="cursor-pointer">Course Work</span>
                    <span className={`absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 ${Title === "Course Work" ? "w-full" : "group-hover:w-full"}`}></span>
                </div>
                <Separator orientation="vertical" className="h-8 w-[1px] bg-neutral-400 mx-4" />
                <div className="relative group w-fit" onClick={() => setTitle("Professional")}>
                    <span className="cursor-pointer">Professional</span>
                    <span className={`absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 ${Title === "Professional" ? "w-full" : "group-hover:w-full"}`}></span>
                </div>
            </motion.div>
            <motion.div
                className="w-4/5 h-2/3 text-center "
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {TabDict[Title]}
            </motion.div>
        </div>
    )
}