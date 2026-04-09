import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";
import { motion } from "framer-motion";
import CourseWorkData from "@/Data/CourseWork.json";

const SUBJECTS = ["Computer Science", "Mathematics", "Robotics", "Chemistry"];

export default function CourseWork() {
    const [subject, setSubject] = useState("Computer Science");

    function getData() {
        return CourseWorkData.CourseWork.filter((item) => item.category === subject).map(
            (item, index) => (
                <motion.div
                    key={item.name + index}
                    className="flex w-full min-w-0 flex-col gap-1 border-b border-neutral-800/80 py-3 text-left last:border-0 sm:flex-row sm:items-baseline sm:gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                    <span className="w-8 shrink-0 text-neutral-500 tabular-nums">
                        {item.active ? "›" : ""}
                    </span>
                    <span
                        className={`shrink-0 font-mono text-sm tabular-nums sm:w-28 sm:text-base ${
                            item.active ? "text-neutral-100" : "text-neutral-500"
                        }`}
                    >
                        {item.courseNumber}
                    </span>
                    <span
                        className={`min-w-0 flex-1 text-[15px] leading-snug sm:text-base ${
                            item.active ? "text-neutral-100" : "text-neutral-400"
                        }`}
                    >
                        {item.name}
                    </span>
                </motion.div>
            )
        );
    }

    return (
        <div className="flex w-full min-w-0 flex-col gap-8 border border-neutral-800/60 bg-neutral-950/40 p-4 sm:p-6 md:flex-row md:gap-10 md:p-8 lg:gap-12 lg:p-10">
            <div className="min-w-0 flex-1 space-y-4 md:space-y-5 lg:max-w-[42rem]">
                <motion.h2
                    className="text-left text-xl font-medium tracking-tight text-neutral-100 sm:text-2xl md:text-3xl"
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.75, ease: "easeInOut" }}
                >
                    {subject}
                </motion.h2>
                <div className="min-w-0 divide-y divide-neutral-800/80 border border-neutral-800/60 px-3 py-1 sm:px-4">
                    {getData()}
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start md:flex-col md:gap-6">
                <div className="border border-neutral-700/60 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-300 sm:shrink-0">
                    <p className="font-medium text-neutral-100">{">"} Currently enrolled</p>
                    <p className="mt-1 text-neutral-400">GPA: 3.98</p>
                </div>

                <Separator orientation="vertical" className="hidden h-auto min-h-[6rem] bg-neutral-600 sm:block md:hidden" />
                <Separator orientation="horizontal" className="bg-neutral-600 sm:hidden" />

                <aside className="flex w-full min-w-0 flex-col gap-1 sm:max-w-xs md:w-52 md:shrink-0">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                        Category
                    </p>
                    {SUBJECTS.map((name) => (
                        <button
                            key={name}
                            type="button"
                            onClick={() => setSubject(name)}
                            className={`border-l-2 px-3 py-2.5 text-left text-sm transition-colors sm:text-base ${
                                subject === name
                                    ? "border-white bg-neutral-800/90 text-neutral-100"
                                    : "border-transparent text-neutral-300 hover:bg-neutral-900/80 hover:text-neutral-100"
                            } `}
                        >
                            {name}
                        </button>
                    ))}
                </aside>
            </div>
        </div>
    );
}
