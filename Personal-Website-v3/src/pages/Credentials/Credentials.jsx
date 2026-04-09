import ResumePNG from "../../assets/RESUME - Research 9-24-25-1.png"
import ResumePDF from "../../assets/RESUME - Research 9-24-25.pdf"
import CVPDF from "../../assets/Ashton_Dy_CV 9-26-25.pdf"
import CV1 from "../../assets/Ashton_Dy_CV 9-26-25-1.png"
import CV2 from "../../assets/Ashton_Dy_CV 9-26-25-2.png"
import CV3 from "../../assets/Ashton_Dy_CV 9-26-25-3.png"
import { Separator } from "@radix-ui/react-separator"
import Carousel from "@/components/ui/Carousel"

export default function Credentials() {


    return (
        <div className="Page min-h-0 overflow-y-auto">
            <div className="w-full min-h-full flex flex-col md:flex-row items-stretch md:items-center justify-center gap-8 md:gap-4 px-4 py-8 md:py-11.5">
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-4">
                    <a href={ResumePDF} target="_blank" rel="noreferrer" className="w-full max-w-3xl"><img src={ResumePNG} className="w-full max-h-[50rem] rounded m-0 p-0 object-contain" alt="Resume preview" /></a>
                    <a href={ResumePDF} download className="bg-neutral-800 hover:bg-neutral-700 w-fit p-3 rounded-md shadow-md hover:shadow-[0px_0px_40px_rgb(150,150,150)] active:shadow-[0px_0px_40px_rgb(255,255,255)] transition-all duration-300">Resume Download</a>
                </div>
                <Separator orientation="horizontal" className="md:hidden w-full max-w-md h-[1px] bg-neutral-600" />
                <Separator orientation="vertical" className="hidden md:block h-7/8 w-[1px] bg-neutral-600 mx-4 shrink-0" />
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center pb-8 md:pb-0">
                    <Carousel images={[CV1, CV2, CV3]} altPrefix="CV Page" pdf={CVPDF} />
                </div>
            </div>
        </div>
    )
}
