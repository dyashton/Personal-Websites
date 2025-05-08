import ResumePNG from "../../assets/RESUME - ML & Robotics 5-6-25.png"
import ResumePDF from "../../assets/RESUME - ML & Robotics 5-6-25.pdf"
import { Separator } from "@radix-ui/react-separator"


export default function Credentials() {

    
    return (
        <div className="Page">
            <div className="w-full h-full flex fex-row">
                <div className="w-1/2 h-full m-0 p-0 flex flex-col items-center justify-center gap-4">
                    <img src={ResumePNG} className="h-150 m-0 p-0"/>
                    <a href={ResumePDF} download className="bg-neutral-800 hover:bg-neutral-700 w-fit p-3 rounded-md shadow-md hover:shadow-[0px_0px_40px_rgb(150,150,150)] active:shadow-[0px_0px_40px_rgb(255,255,255)] transition-all duration-300">Resume Download</a>
                </div>
                <Separator orientation="vertical" className="h-7/8 w-[1px] bg-neutral-600 mx-4"/>
                <div className="w-1/2 h-full m-0 p-0">
                    CV Coming Soon
                </div>

            </div>
        </div>
    )
}