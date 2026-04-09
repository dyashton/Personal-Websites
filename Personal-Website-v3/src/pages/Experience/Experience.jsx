import { useState } from "react";
import Education from "@/components/custom/Education";
import Research from "@/components/custom/Research";
import CourseWork from "@/components/custom/CourseWork";
import Professional from "@/components/custom/Professional";
import { motion } from "framer-motion";

const TABS = [
    { id: "Education", label: "Education" },
    { id: "Research", label: "Research" },
    { id: "Course Work", label: "Course Work" },
    { id: "Professional", label: "Professional" },
];

export default function Experience() {
    const [activeTab, setActiveTab] = useState("Education");

    const TabDict = {
        Education: <Education />,
        Research: <Research />,
        "Course Work": <CourseWork />,
        Professional: <Professional />,
    };

    return (
        <div className="Page min-h-0 flex flex-col">
            <nav
                className="w-full shrink-0 border-b border-neutral-800 bg-neutral-950"
                aria-label="Experience sections"
            >
                <div className="mx-auto flex w-full max-w-6xl items-stretch px-3 sm:px-6 lg:px-10">
                    <div className="flex w-full min-w-0 flex-nowrap items-stretch gap-0 overflow-x-auto py-0 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:gap-0 sm:overflow-visible md:justify-start [&::-webkit-scrollbar]:hidden">
                        {TABS.map((tab, index) => (
                            <div
                                key={tab.id}
                                className="flex shrink-0 items-stretch"
                            >
                                {index > 0 ? (
                                    <span
                                        className="hidden h-8 w-px shrink-0 self-center bg-neutral-600 sm:block"
                                        aria-hidden
                                    />
                                ) : null}
                                <button
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`shrink-0 border-b-2 px-3 py-3 text-left text-sm transition-colors sm:px-4 sm:text-base ${
                                        activeTab === tab.id
                                            ? "border-white text-white"
                                            : "border-transparent text-neutral-400 hover:text-neutral-200"
                                    } `}
                                >
                                    {tab.label}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </nav>

            <motion.div
                className="mx-auto flex w-full max-w-6xl flex-1 min-h-0 flex-col px-3 py-6 text-left sm:px-6 md:py-8 lg:px-10 lg:py-10"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <div className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden text-[15px] leading-relaxed text-neutral-300 sm:text-base md:leading-[1.65]">
                    {TabDict[activeTab]}
                </div>
            </motion.div>
        </div>
    );
}
