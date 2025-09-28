import React, { useState } from "react";

export default function Carousel({ images, altPrefix = "CV Page", pdf }) {
    const [current, setCurrent] = useState(0);
    const total = images.length;

    const prev = () => setCurrent((c) => (c - 1 + total) % total);
    const next = () => setCurrent((c) => (c + 1) % total);

    return (
        <div className="flex flex-col items-center w-full">
            <div className="relative w-full flex justify-center items-center h-fit">
                <button
                    onClick={prev}
                    className="absolute left-0 z-10 bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1 rounded-l-md shadow-md"
                    aria-label="Previous"
                >
                    &#8592;
                </button>
                <a href={pdf} target="_blank">
                    <img
                        src={images[current]}
                        alt={`${altPrefix} ${current + 1}`}
                        className="max-h-[50rem] object-contain mx-auto rounded shadow-lg border border-neutral-700"
                    />
                </a>
                <button
                    onClick={next}
                    className="absolute right-0 z-10 bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1 rounded-r-md shadow-md"
                    aria-label="Next"
                >
                    &#8594;
                </button>
            </div>
            <div className="text-neutral-400 text-sm">
                Page {current + 1} of {total}
            </div>
        </div>
    );
}
