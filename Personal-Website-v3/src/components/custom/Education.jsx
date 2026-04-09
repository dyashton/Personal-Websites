import { useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MHLogo from "../../assets/MHLogo.png";
import UTLogo from "../../assets/UTLogo.png";
import { motion } from "framer-motion";
import UTK from "../../assets/UTK.png";
import MH from "../../assets/MerrolHyde.png";
import EducationData from "@/Data/Education.json";

const SCHOOLS = ["University of Tennessee", "Merrol Hyde Magnet School"];

export default function Education() {
    const [school, setSchool] = useState("University of Tennessee");

    const logoDict = {
        "Merrol Hyde Magnet School": MHLogo,
        "University of Tennessee": UTLogo,
    };
    const imageDict = {
        "Merrol Hyde Magnet School": MH,
        "University of Tennessee": UTK,
    };

    function getData() {
        return EducationData.EducationData.filter((item) => item.name === school).map((item) => (
            <article key={item.name} className="min-w-0 space-y-6 md:space-y-8">
                <header className="flex flex-wrap items-center gap-4">
                    <Avatar className="h-14 w-14 shrink-0 rounded-none sm:h-16 sm:w-16">
                        <AvatarImage
                            src={logoDict[school]}
                            className="object-cover drop-shadow-sm drop-shadow-neutral-500"
                            alt=""
                        />
                        <AvatarFallback>Logo</AvatarFallback>
                    </Avatar>
                    <motion.h2
                        className="min-w-0 text-left text-xl font-medium tracking-tight text-neutral-100 sm:text-2xl md:text-3xl"
                        initial={{ opacity: 0.1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.75, ease: "easeInOut" }}
                    >
                        {school}
                    </motion.h2>
                </header>

                {/* Grid: fixed narrow photo column so the text column uses all remaining width */}
                <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] xl:gap-10">
                    <img
                        className="mx-auto w-full max-w-lg object-cover lg:mx-0 lg:h-auto lg:w-full lg:max-w-none"
                        src={imageDict[school]}
                        alt=""
                    />
                    <p className="min-w-0 text-left text-[15px] leading-[1.65] text-neutral-300 sm:text-base">
                        {item.description}
                    </p>
                </div>
            </article>
        ));
    }

    return (
        <div className="flex w-full min-w-0 flex-col gap-8 border border-neutral-800/60 bg-neutral-950/40 p-4 sm:p-6 md:flex-row md:gap-8 md:p-8 lg:gap-10 lg:p-10">
            <div className="min-w-0 flex-1">{getData()}</div>

            <Separator orientation="horizontal" className="bg-neutral-600 md:hidden" />
            <Separator
                orientation="vertical"
                className="hidden bg-neutral-600 md:block md:min-h-[12rem] md:self-stretch"
            />

            <aside className="flex w-full shrink-0 flex-col gap-1 sm:max-w-xs md:w-44 lg:w-48">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Institution
                </p>
                {SCHOOLS.map((name) => (
                    <button
                        key={name}
                        type="button"
                        onClick={() => setSchool(name)}
                        className={`border-l-2 px-3 py-2.5 text-left text-sm transition-colors sm:text-base ${
                            school === name
                                ? "border-white bg-neutral-800/90 text-neutral-100"
                                : "border-transparent text-neutral-300 hover:bg-neutral-900/80 hover:text-neutral-100"
                        } `}
                    >
                        {name}
                    </button>
                ))}
            </aside>
        </div>
    );
}
