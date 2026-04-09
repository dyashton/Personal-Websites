

import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import "./Home.css"
import { logos }  from "@/Data/Logos"
import HS from "../../assets/Headshot.png"
import { useIsMobile } from "@/hooks/useIsMobile"

const POLY_TERMS = 3;

const HomeTensorSketch = lazy(() => import("./HomeTensorSketch"));

export default function Home() {
    const titles = ["Software Development", "Machine Learning", "Data Science", "Computational Chemistry"]
    const [Title, setTitle] = useState(titles[1])
    const [Color, setColor] = useState("#4C8C8A")
    const [coeffValues, setCoeffValues] = useState(() => Array(POLY_TERMS).fill(0))
    const [bValue, setBValue] = useState(0)

    const ParentRef = useRef(null)
    const isMobile = useIsMobile()
    const colors = ["#4C8C8A", "#A78BFA", "#8B6F61"]
    const caroselItems = ["React", "Tailwind", "Python", "JavaScript", "C++", "C", "Java", "HTML", "CSS", "ROS2", "OpenCV", "PyTorch", "TensorFlow", "Flask", "Node.js", "Express.js", "MongoDB", "PostgreSQL"]

    const handleMetricsUpdate = useCallback(({ coeffValues: next, bValue: b }) => {
        setCoeffValues(next);
        setBValue(b);
    }, []);

    function getCaroselItems(items) {
        return items.map((item, index) => {
            return (
                <div key={index} style={{"--index": index}} className="absolute transform h-full w-full flex items-center justify-center text-2xl text-neutral-200 carosel-item ">
                    <img className="hover:scale-105 transition-all duration-1000 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain drop-shadow-md drop-shadow-neutral-600" src={logos[item]} alt="" />
                </div>
            )
        })
    }

    function getEquation() {
        return coeffValues.map((value, i) => (
            <p key={i}>
                ({value.toFixed(3)})x{i > 0 ? <sup>{i+1}</sup> : ''} +&nbsp;
            </p>
        ));
    }

    useEffect(() => {
        let index = 0;
        const interval = 3000;
        const timer = setInterval(() => {
            index = (index + 1) % titles.length;
            setColor(colors[Math.floor(Math.random() * colors.length)]);
            setTitle(titles[index]);
        }, interval);
        return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- titles/colors are stable hero copy
    }, []);

    const showTensorLayer = isMobile === false;

    return (
        <div className="Page relative min-h-0 overflow-x-hidden overflow-y-visible">
            {/* p5 + TF: keep behind hero/carousel; pointer-events only on canvas (see sketch). */}
            <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 1, ease: "easeInOut" }}>
                <div ref={ParentRef} className="relative h-full w-full min-h-[50vh]">
                    {showTensorLayer ? (
                        <Suspense fallback={null}>
                            <HomeTensorSketch
                                containerRef={ParentRef}
                                onMetricsUpdate={handleMetricsUpdate}
                            />
                        </Suspense>
                    ) : null}
                </div>
            </motion.div>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute right-0 bottom-0 h-36 w-36 sm:h-44 sm:w-44 md:h-3/4 md:w-auto md:max-w-[min(44vw,24rem)] m-4 sm:m-6 md:m-10 pointer-events-none z-20"
            >
            <img className="rounded-full h-full w-full max-h-[72vh] object-cover drop-shadow-2xl drop-shadow-neutral-900" src={HS} alt="Headshot"/>
            </motion.div>
            {/* In-flow height: most children are position:absolute; keep min-height on desktop so the page does not collapse when md: removes padding. */}
            <div className="pointer-events-none items-center justify-center text-neutral-200 relative z-10 h-full w-full min-h-[70vh] md:min-h-[80vh]">
                <div className="pointer-events-auto z-20 h-fit absolute left-4 right-4 top-4 sm:left-6 sm:right-auto sm:top-6 md:inset-8 w-auto max-w-[min(100%,42rem)] text-2xl sm:text-4xl md:text-5xl text-left">
                    Driven By A Passion For
                    <AnimatePresence mode="wait">
                        <motion.p 
                        key={Title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                        style={{color: Color}}
                        >{Title}</motion.p>
                    </AnimatePresence>
                </div>
                <div className="pointer-events-auto hidden md:flex absolute w-fit h-fit top-0 right-0 flex-row m-5 text-base md:text-sm 2xl:text-lg">
                    {showTensorLayer ? (
                        <>
                            {getEquation()}
                            {bValue.toFixed(3)}
                        </>
                    ) : null}
                </div>
                {/* Bottom-left (headshot is bottom-right); nudge past corner so the ring sits lower/left; radius in Home.css. */}
                <div className="pointer-events-none absolute -left-15 -bottom-30 z-10 overflow-visible -translate-x-3 translate-y-3 sm:-translate-x-4 sm:translate-y-4 md:-translate-x-6 md:translate-y-6">
                    <div className="relative aspect-square w-[min(15rem,72vw)] shrink-0 sm:w-64 sm:h-64 md:w-72 md:h-72">
                        <div
                            style={{ "--quantity": caroselItems.length }}
                            className="carosel-container pointer-events-auto"
                        >
                            {getCaroselItems(caroselItems)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
