import { useEffect, useState } from "react"
import ProjectData from "@/Data/ProjectData.json"
import { Separator } from "@radix-ui/react-separator";
import { motion } from "framer-motion"
import WAIMG from "@/assets/weatherApp.gif"
import PolyIMG from "../../assets/Poly.gif"
import InstiIMG from "../../assets/Insta.gif"
import HashIMG from "../../assets/Hash.gif"
import Cubes from "../../assets/3D-Cubes.gif"
import MTCIMG from "../../assets/MultiThreadChat.gif"
import NotexIMG from "../../assets/Notex.gif"
import GCarIMG from "../../assets/GCar.png"
import FMake from "../../assets/FakeMake.gif"
import Shell from "../../assets/Shell.gif"
import { logos } from "@/Data/Logos";

export default function ProjectTab({Tab}){
    const [Project, setProject] = useState(null);
    const [FilteredProjects, setFilteredProjects] = useState([]);
    const projectDict = {
        "Weather App": WAIMG,
        "Polynomial Regression": PolyIMG,
        "Instigram": InstiIMG,
        "Hashing Algorithm": HashIMG,
        "3D Rotating ASCII Cube": Cubes,
        "Multithreaded Chat Server": MTCIMG,
        "Notex": NotexIMG,
        "Gesture Control Car": GCarIMG,
        "Fake Make": FMake,
        "Shell Implementation": Shell
    };
    function filterProjects(){
        const filterProjects = ProjectData.projects.filter((project) => {
            if(project.tags.find((tag) => {return tag === Tab})){return true}});
        return filterProjects;
    }

    function getSkills(project){
        return project.skills.map((skill, index) => {
            return <motion.div 
            initial={{ opacity:0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .5, ease: "easeInOut", delay: index * 0.1 }}
            key={index + skill} 
            className="text-md text-neutral-500 hover:text-neutral-300 flex flex-row">
                {logos[skill]?<img className="h-5 w-5 inline-block mr-2 drop-shadow-sm drop-shadow-neutral-500" src={logos[skill] } alt={skill}/>:null}
                <p>{skill}</p>
            </motion.div>
        })
    }
    function getProjectComponent(project){

              return <div key={project.name} className="w-full h-full flex flex-col items-center justify-center relative">
                    <div className="absolute top-0 left-0 flex flex-col gap-10 ">
                        <h1 className="text-3xl">{project.name}</h1>
                        <div className="flex flex-col gap-4">
                            <motion.p 
                            initial={{ opacity:0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }} 
                            className="text-xl">Skills</motion.p>
                            {getSkills(project)}
                        </div>
                    </div>

                    <div className="w-full h-3/5 flex items-center justify-end p-5">
                        <img className="rounded-md shadow-[0px_0px_20px_rgb(50,50,50)] h-full" src={projectDict[project.name]}/>
                    </div>
                    <div className="w-full h-1/3 flex items-center justify-start p-5 text-lg pt-20">
                        <p>{project.description}</p>

                    </div>
                </div>
    }

    function getProjectSelector(filteredProjects){
        return filteredProjects.map((project, index) => {
            return <motion.div 
            initial={{ 
                opacity:0,
                rotateZ: -180,
                x: 1000,
                y: 500

             }}
            animate={{ 
                opacity: 1,
                rotateZ: 0,
                x: 0,
                y: 0
             }}
            transition={{ duration: 0.75, ease: "easeOut", delay: index * 0.1 }}

            onClick={()=>setProject(project)} 
            key={project.name + Tab + index} 
            className={`w-full h-fit cursor-pointer overflow-visible ${Project === project?"bg-neutral-300 text-neutral-800 p-2":"hover:outline-2 hover:outline-neutral-600 p-2"}`}>
                <div>{project.name}</div>
            </motion.div>
        })
    }

    useEffect(() => {
        console.log("Tab changed to: ", Tab);
        setFilteredProjects(filterProjects());
        console.log("Filtered Projects: ", FilteredProjects);
    }, [Tab]);

    useEffect(()=>{
        if(FilteredProjects.length > 0){
            setProject(FilteredProjects[0]);
        }
    },[FilteredProjects])
    return (
        <div className="w-full h-full flex flex-row p-5 overflow-visible">
            <div className="w-full h-full flex flex-col items-center ">
                {Project?getProjectComponent(Project):null}
            </div>
            <Separator orientation="vertical" className="h-full w-[1px] bg-neutral-600 mx-4"/>
            <div className="h-full w-2/5 flex flex-col gap-4 text-left items-center overflow-visible">
                Project Select
                {FilteredProjects?getProjectSelector(FilteredProjects):null}
            </div>

        </div>
    )
}