import { useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import JobData from "@/Data/JobData.json";
import FSLogo from "../../assets/FSLogo.png";
import ClaytonLogo from "../../assets/ClaytonLogo.png";
import ClaytonPic from "../../assets/Clayton Internship Collage.png";

const JOBS = ["Clayton", "Functional Solutions"];

export default function Professional() {
    const [job, setJob] = useState("Clayton");

    const jobDict = {
        Clayton: ClaytonLogo,
        "Functional Solutions": FSLogo,
    };
    const shadowDict = {
        Clayton: "drop-shadow-[0_0px_10px_rgba(255,255,255,0.1)]",
        "Functional Solutions": "drop-shadow-[0_0px_5px_rgba(255,255,255,0.5)]",
    };
    const picDict = {
        Clayton: ClaytonPic,
        "Functional Solutions": null,
    };

    function getData() {
        return JobData.JobData.filter((item) => item.name === job).map((item, index) => (
            <article
                key={`${item.name}-${index}`}
                className="min-w-0 space-y-8 text-left md:space-y-10"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 md:gap-8">
                    <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start">
                        <img
                            className={`h-auto w-28 shrink-0 object-contain sm:w-36 ${shadowDict[job]}`}
                            src={jobDict[job]}
                            loading="lazy"
                            alt=""
                        />
                        <Separator
                            orientation="vertical"
                            className="hidden h-24 w-px shrink-0 bg-neutral-600 sm:block"
                        />
                        <div className="min-w-0 space-y-1">
                            <h3 className="text-lg font-medium tracking-tight text-neutral-100 sm:text-xl md:text-2xl">
                                {item.name}
                            </h3>
                            <p className="text-[15px] text-neutral-400 sm:text-base">{item.position}</p>
                        </div>
                    </div>
                    <time className="shrink-0 text-sm text-neutral-500 sm:text-base">{item.date}</time>
                </div>

                <div className="flex min-w-0 flex-col gap-6 md:gap-8 lg:flex-row lg:items-start lg:gap-12">
                    {picDict[job] ? (
                        <div className="mx-auto w-full max-w-xl shrink-0 lg:mx-0 lg:w-2/5 lg:max-w-[min(28rem,38vw)]">
                            <img
                                className="w-full object-cover"
                                src={picDict[job]}
                                loading="lazy"
                                alt=""
                            />
                        </div>
                    ) : null}
                    <ul
                        className={`min-w-0 list-disc space-y-3 pl-5 text-[15px] leading-[1.65] text-neutral-300 marker:text-neutral-500 sm:text-base ${
                            picDict[job] ? "lg:flex-1 lg:max-w-[46rem]" : "w-full lg:max-w-[52rem]"
                        }`}
                    >
                        {item.description.map((desc, idx) => (
                            <li key={idx} className="pl-1">
                                {desc}
                            </li>
                        ))}
                    </ul>
                </div>
            </article>
        ));
    }

    return (
        <div className="flex w-full min-w-0 flex-col gap-8 border border-neutral-800/60 bg-neutral-950/40 p-4 sm:p-6 md:flex-row md:gap-10 md:p-8 lg:gap-12 lg:p-10">
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-1">{getData()}</div>

            <Separator orientation="horizontal" className="bg-neutral-600 md:hidden" />
            <Separator
                orientation="vertical"
                className="hidden bg-neutral-600 md:block md:min-h-[12rem] md:self-stretch"
            />

            <aside className="flex w-full shrink-0 flex-col gap-1 sm:max-w-xs md:w-48">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Role
                </p>
                {JOBS.map((name) => (
                    <button
                        key={name}
                        type="button"
                        onClick={() => setJob(name)}
                        className={`border-l-2 px-3 py-2.5 text-left text-sm transition-colors sm:text-base ${
                            job === name
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
