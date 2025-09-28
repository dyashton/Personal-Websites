import { Separator } from "@radix-ui/react-separator"
import { useState } from "react"
import { motion } from "framer-motion"
import CourseWorkData from "@/Data/CourseWork.json"

export default function CourseWork(){
    const [Subject, setSubject] = useState("Computer Science")
    function getData(Subject){
        const filteredData = CourseWorkData.CourseWork.filter((item) => item.category === Subject);
        console.log("Filtered Data: ", filteredData)
        return filteredData.map((item, index) => {
            return (
                <motion.div 
                key={item.name + index} 
                className="w-full h-fit flex flex-row gap-2 text-center"
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                transition={{ duration: 0.75, ease: "easeInOut", delay: index * 0.1 }}
                exit={{ opacity: 0}}>
                    <p className="flex items-center">{item.active?">":""}</p>
                    <p className={`h-10 text-xl flex items-center ${item.active?"text-neutral-200":"text-neutral-400"}`}>{item.courseNumber} -</p>
                    <p className={`h-10 flex items-center ${item.active?"text-neutral-200":"text-neutral-400"}`}>{item.name}</p>
                </motion.div>
            )
        })
    }
    return(
        <div className="w-full h-full flex flex-row shadow-[0_0px_10px_rgba(255,255,255,0.1)]  p-5 overflow-auto">
            <div className="h-full w-4/5 relative">
            <div className="w-full h-15 absolute top-0 left-0 ">
                    <div className="flex flex-row w-full items-center">
                        <motion.div 
                        className="text-3xl w-full text-left pl-5 pt-3"
                        initial={{ opacity: 0.1}}
                        animate={{ opacity: 1}}
                        transition={{ duration: 0.75, ease: "easeInOut" }}
                        >{Subject}</motion.div>
                    </div>
                    <div className="p-5">
                        {getData(Subject)}
                    </div>
                </div>
            </div>
            <div className="text-sm  w-50 h-fit">
                <p className="text-neutral-200">{` > Currently Enrolled`}</p>
                <p>GPA: 3.98</p>
            </div>

            <Separator orientation="vertical" className="h-full w-[1px] bg-neutral-600 mx-4"/>
            <div className="h-full w-1/5 flex flex-col gap-4 text-left items-center ">
                <div onClick={()=> setSubject("Computer Science")} className={`text-left w-full ${Subject === "Computer Science"?"bg-neutral-300 text-neutral-800 p-2":"hover:outline-2 hover:outline-neutral-600 p-2"}`}>Computer Science</div>
                <div onClick={()=> setSubject("Mathematics")} className={`text-left  w-full ${Subject === "Mathematics"?"bg-neutral-300 text-neutral-800 p-2":"hover:outline-2 hover:outline-neutral-600 p-2"}`}>Mathematics</div>
                <div onClick={()=> setSubject("Robotics")} className={`text-left w-full ${Subject === "Robotics"?"bg-neutral-300 text-neutral-800 p-2":"hover:outline-2 hover:outline-neutral-600 p-2"}`}>Robotics</div>
                <div onClick={()=> setSubject("Chemistry")} className={`text-left w-full ${Subject=== "Chemistry"?"bg-neutral-300 text-neutral-800 p-2":"hover:outline-2 hover:outline-neutral-600 p-2"}`}>Chemistry</div>
            </div>
        </div>
    )
}