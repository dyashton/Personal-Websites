import { useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import { motion } from "framer-motion";
import LabData from "@/Data/LabData.json";
import { Typewriter } from "react-simple-typewriter";
import ZhaoLab from "../../assets/ZhaoLab.png";
import EpicLab from "../../assets/EpicLab.png";

const LABS = [
    "Dr. Vogiatzis' Lab",
    "Dr. Coble's Lab",
    "Dr. Zhao's Lab",
    "Epic Lab",
    "AURAS Lab",
];

export default function Research() {
    const [lab, setLab] = useState("Dr. Vogiatzis' Lab");

    const labDict = {
        "Dr. Vogiatzis' Lab": null,
        "Dr. Coble's Lab": null,
        "Dr. Zhao's Lab": ZhaoLab,
        "Epic Lab": EpicLab,
        "AURAS Lab": null,
    };

    function getData() {
        return LabData.LabData.filter((item) => item.name === lab).map((item, index) => (
            <div
                key={`${item.name}-${index}`}
                className="flex w-full min-w-0 flex-col gap-6 text-left md:flex-row md:gap-10 lg:gap-12"
            >
                {labDict[lab] ? (
                    <div className="mx-auto w-full max-w-md shrink-0 md:mx-0 md:max-w-[min(20rem,36vw)] lg:max-w-sm">
                        <img
                            className="w-full object-cover"
                            src={labDict[lab]}
                            loading="lazy"
                            alt=""
                        />
                    </div>
                ) : null}

                <ul
                    className={`min-w-0 list-disc space-y-4 pl-5 text-[15px] leading-[1.65] text-neutral-300 marker:text-neutral-500 sm:text-base ${
                        labDict[lab] ? "md:flex-1 lg:max-w-[46rem]" : "w-full lg:max-w-[52rem]"
                    }`}
                >
                    {item.description.map((desc, idx) => (
                        <li key={idx} className="pl-1 text-left">
                            <Typewriter words={[desc]} typeSpeed={5} deleteSpeed={0} />
                        </li>
                    ))}
                </ul>
            </div>
        ));
    }

    return (
        <div className="flex w-full min-w-0 flex-col gap-6 border border-neutral-800/60 bg-neutral-950/40 p-4 sm:p-6 md:flex-row md:gap-8 md:p-8 lg:gap-10 lg:p-10">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 md:gap-5">
                <motion.h2
                    className="text-left text-lg font-medium tracking-tight text-neutral-100 sm:text-xl md:text-2xl lg:text-3xl"
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.75, ease: "easeInOut" }}
                >
                    {lab}
                </motion.h2>
                <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-1">
                    {getData()}
                </div>
            </div>

            <Separator orientation="horizontal" className="bg-neutral-600 md:hidden" />
            <Separator
                orientation="vertical"
                className="hidden bg-neutral-600 md:block md:min-h-[14rem] md:self-stretch"
            />

            <aside className="flex w-full shrink-0 flex-col gap-1 overflow-x-auto pb-1 sm:max-w-xs md:w-56 md:overflow-visible">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Lab
                </p>
                <div className="flex flex-row gap-0 md:flex-col">
                    {LABS.map((name) => (
                        <button
                            key={name}
                            type="button"
                            onClick={() => setLab(name)}
                            className={`shrink-0 border-l-2 px-3 py-2.5 text-left text-sm whitespace-nowrap transition-colors sm:text-base md:whitespace-normal ${
                                lab === name
                                    ? "border-white bg-neutral-800/90 text-neutral-100"
                                    : "border-transparent text-neutral-300 hover:bg-neutral-900/80 hover:text-neutral-100"
                            } `}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </aside>
        </div>
    );
}
