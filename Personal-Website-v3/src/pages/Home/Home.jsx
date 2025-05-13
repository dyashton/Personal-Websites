

import { Separator } from "@/components/ui/separator"
import { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import "./Home.css"
import { logos }  from "@/Data/Logos"
import Sketch from "react-p5"
import * as tf from '@tensorflow/tfjs';
import HS from "../../assets/Headshot.png"


export default function Home() {
    const titles = ["Software Development", "Machine Learning", "Data Science", "Computational Chemistry"]
    const [Title, setTitle] = useState(titles[1])
    const [Color, setColor] = useState("#4C8C8A")
    const [PointsX, setPointsX] = useState([])
    const [PointsY, setPointsY] = useState([])
    const [model, setModel] = useState(tf.sequential())
    const [coeff, setCoeff] = useState([])
    const [coeffValues, setCoeffValues] = useState(Array(5).fill(0)) 
    const [bValue, setBValue] = useState(0) 
    const [RenderSketch, setRenderSketch] = useState(false)
    const [b, setB] = useState(null) 

    const ParentRef = useRef(null)
    const colors = ["#4C8C8A", "#A78BFA", "#8B6F61"]
    const caroselItems = ["React", "Tailwind", "Python", "JavaScript", "C++", "C", "Java", "HTML", "CSS", "ROS2", "OpenCV", "PyTorch", "TensorFlow", "Flask", "Node.js", "Express.js", "MongoDB", "PostgreSQL"]
    const lr = 0.1;
    const optimizerRef = useRef(null);

    function getCaroselItems(caroselItems) {
        return caroselItems.map((item, index) => {
            return (
                <div key={index} style={{"--index": index}} className="absolute transform h-full w-full flex items-center justify-center text-2xl text-neutral-200 carosel-item ">
                    <img className="hover:scale-105 transition-all duration-1000 w-20 h-20 object-contain drop-shadow-md drop-shadow-neutral-600" src={logos[item]}/>
                </div>
            )
        })
    }

    function setup(p5) {
        const { offsetWidth, offsetHeight } = ParentRef.current;
        p5.createCanvas(offsetWidth, offsetHeight + 100).parent(ParentRef.current);
        p5.background(0);
        p5.frameRate(30);
    }

    function updateCoeffDisplay() {
        if (!coeff || coeff.length === 0) return;
        
        const newCoeffValues = coeff.map(c => {
            if (c && !c.isDisposed) {
                return Math.round(c.dataSync()[0] * 1000) / 1000;
            }
            return 0;
        });
        
        setCoeffValues(newCoeffValues);
        
        if (b && !b.isDisposed) {
            setBValue(Math.round(b.dataSync()[0] * 1000) / 1000);
        }
    }

    function draw(p5) {
        p5.clear();
        tf.tidy(() => {
            if (PointsX.length > 0 && coeff.length > 0 && b && optimizerRef.current) {
                const xs = tf.tensor1d(PointsX);
                let ys = tf.tensor1d(PointsY);
                
                optimizerRef.current.minimize(() => {
                    const predictions = predict(PointsX);
                    return loss(predictions, ys);
                });
                
                updateCoeffDisplay();
                
                const curveX = [];
                for (let x = -1; x <= 1.01; x += 0.01) {
                    curveX.push(x);
                }
                
                ys = predict(curveX);
                const curveY = ys.dataSync();
                
                p5.background(0);
                p5.beginShape();
                p5.fill(0);
                p5.stroke(150);
                p5.strokeWeight(2);
                for (let i = 0; i < curveX.length; i++) {
                    let x = p5.map(curveX[i], -1, 1, 0, p5.width);
                    let y = p5.map(curveY[i], -1, 1, p5.height, 0);
                    p5.vertex(x, y);
                }
                p5.endShape();
            }
        });
        
        p5.drawingContext.shadowOffsetX = 0;
        p5.drawingContext.shadowOffsetY = 0;
        p5.drawingContext.shadowBlur = 20;
        p5.drawingContext.shadowColor = 'rgba(255, 255, 255, .2)';
        p5.ellipse(p5.mouseX, p5.mouseY, 10, 10);
        drawPoints(p5);
        p5.drawingContext.shadowBlur = 0;
    }

    function addPoint(p5) {
        if (p5.mouseX < 0 || p5.mouseX > p5.width || p5.mouseY < 0 || p5.mouseY > p5.height) {
            return;
        }
        
        const x = p5.map(p5.mouseX, 0, p5.width, -1, 1);
        const y = p5.map(p5.mouseY, 0, p5.height, 1, -1);
        
        if (PointsX.length > 20) {
            setPointsX(prev => [...prev.slice(1), x]);
            setPointsY(prev => [...prev.slice(1), y]);
        } else {
            setPointsX(prev => [...prev, x]);
            setPointsY(prev => [...prev, y]);
        }
    }

    function drawPoints(p5) {
        p5.stroke(200);
        p5.fill(200, 200, 200);
        for (let i = 0; i < PointsX.length; i++) {
            let px = p5.map(PointsX[i], -1, 1, 0, p5.width);
            let py = p5.map(PointsY[i], -1, 1, p5.height, 0);
            p5.ellipse(px, py, 10, 10);
        }
    }

    function predict(X_vals) {
        return tf.tidy(() => {
            const xs = tf.tensor1d(X_vals);
            let sum = tf.scalar(0);
            for (let i = 0; i < coeff.length; i++) {
                if (coeff[i] && !coeff[i].isDisposed) {
                    sum = sum.add(coeff[i].mul(xs.pow(tf.scalar(i + 1))));
                }
            }
            return b ? sum.add(b) : sum;
        });
    }

    function loss(y_pred, y_true) {
        return tf.tidy(() => {
            return y_pred.sub(y_true).square().mean();
        });
    }

    function func(x) {
        let z = 1.3;
        return Math.pow((x-z), 3) * 1.5 + Math.pow((x-z), 2) * 3 + (x - z);
    }

    function getEquation() {
        return coeffValues.map((value, i) => (
            <p key={i}>
                ({value.toFixed(3)})x{i > 0 ? <sup>{i+1}</sup> : ''} +&nbsp;
            </p>
        ));
    }

    useEffect(() => {
        if (coeff.length > 0) {
            coeff.forEach(c => {
                if (c && !c.isDisposed) c.dispose();
            });
        }
        if (b && !b.isDisposed) b.dispose();
        
        optimizerRef.current = tf.train.momentum(lr, 0.9, true);
        
        model.add(tf.layers.dense({units: 1, inputShape: [1]}));
        model.add(tf.layers.dense({units: 1}));
        
        const newCoeff = [];
        for (let i = 0; i < 5; i++) {
            newCoeff.push(tf.variable(tf.scalar(Math.random() * 2 - 1)));
        }
        
        setCoeff(newCoeff);
        setB(tf.variable(tf.scalar(Math.random() * 2 - 1)));
        
        const newCoeffValues = newCoeff.map(c => Math.round(c.dataSync()[0] * 1000) / 1000);
        setCoeffValues(newCoeffValues);
        
        const initialPoints = [];
        for (let i = 1; i < 5; i++) {
            const x = Math.random() * 2 - 1;
            const y = func(x) * Math.random() * 0.5 + 0.5;
            initialPoints.push({ x, y });
        }
        
        setPointsX(initialPoints.map(p => p.x));
        setPointsY(initialPoints.map(p => p.y));
        
        let index = 0;
        const interval = 3000;
        const timer = setInterval(() => {
            index = (index + 1) % titles.length;
            setColor(colors[Math.floor(Math.random() * colors.length)]);
            setTitle(titles[index]);
        }, interval);
        
        if (ParentRef.current) {
            setTimeout(() => {
                setRenderSketch(true);
            }, 100);
        }
        
        return () => {
            clearInterval(timer);
            setRenderSketch(false);
            
            if (coeff.length > 0) {
                coeff.forEach(c => {
                    if (c && !c.isDisposed) c.dispose();
                });
            }
            if (b && !b.isDisposed) b.dispose();
            if (optimizerRef.current) {
                optimizerRef.current = null;
            }
        };
    }, []);

    return (
        <div className="Page relative overflow-hidden">
            <motion.div className="absolute w-full h-full"
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 1, ease: "easeInOut" }}>
                <div ref={ParentRef} className="relative w-full h-full">
                    {RenderSketch ? <Sketch setup={setup} draw={draw} mousePressed={addPoint} /> : null}
                </div>
            </motion.div>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute right-0 bottom-0 h-3/4 m-10">
            <img className="rounded-full h-full w-full object-cover drop-shadow-2xl drop-shadow-neutral-900" src={HS} alt="Headshot"/>
            </motion.div>
            <div className="items-center justify-center text-neutral-200 relative h-full w-full">
                <div className="h-fit absolute inset-8 w-fit text-5xl text-left">
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
                <div className="absolute w-fit h-fit top-0 right-0 flex flex-row m-5 text-base md:text-sm 2xl:text-lg">
                    {coeff.length > 0 ? getEquation() : null}{bValue.toFixed(3)}
                </div>
                <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
                    <motion.div style={{"--quantity": caroselItems.length}} className="w-1/3 h-1/3 carosel-container">
                        {getCaroselItems(caroselItems)}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}