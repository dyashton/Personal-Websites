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
import KDTree from "../../assets/KDTree.gif"
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
        "Shell Implementation": Shell,
        "KD Tree": KDTree
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
        return (
            <div key={project.name} className="w-full flex flex-col gap-4 md:gap-8 relative px-1 py-2 md:px-2 min-h-0">
                <h1 className="text-2xl md:text-3xl text-neutral-100 text-center lg:text-left">{project.name}</h1>
                <div className="flex flex-col gap-2 w-full">
                    <motion.p
                        initial={{ opacity:0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="text-lg md:text-xl text-neutral-300"
                    >
                        Skills
                    </motion.p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">{getSkills(project)}</div>
                </div>
                <div className="w-full flex justify-center items-center px-1">
                    <img
                        className="rounded-md shadow-[0px_0px_20px_rgb(50,50,50)] max-h-[min(50vh,28rem)] w-full max-w-3xl object-contain"
                        src={projectDict[project.name]}
                        alt={project.name}
                    />
                </div>
                <div className="w-full text-base md:text-lg text-neutral-200">
                    <p>{project.description}</p>
                </div>
            </div>
        );
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
        <div className="w-full h-full min-h-0 flex flex-col lg:flex-row p-3 md:p-5 gap-4 lg:gap-0 overflow-y-auto lg:overflow-visible">
            <div className="w-full lg:w-3/5 flex flex-col items-stretch min-h-0 order-3 lg:order-1">
                {Project ? getProjectComponent(Project) : null}
            </div>
            <Separator orientation="horizontal" className="lg:hidden w-full h-[1px] bg-neutral-600 shrink-0 order-2" />
            <Separator orientation="vertical" className="hidden lg:block h-auto min-h-[12rem] w-[1px] bg-neutral-600 mx-4 self-stretch shrink-0 lg:order-2" />
            <div className="w-full lg:w-2/5 flex flex-col gap-2 text-left items-stretch shrink-0 order-1 lg:order-3 max-h-52 lg:max-h-none overflow-y-auto lg:overflow-visible border border-neutral-700/60 lg:border-0 rounded-md lg:rounded-none p-3 lg:p-0">
                <span className="text-neutral-400 text-sm font-medium">Project Select</span>
                {FilteredProjects ? getProjectSelector(FilteredProjects) : null}
            </div>
        </div>
    )
}