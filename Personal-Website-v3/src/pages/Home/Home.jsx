import { Separator } from "@/components/ui/separator"
import { useState, useEffect, useRef, use} from 'react'
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import "./Home.css"
import { logos }  from "@/Data/Logos"
import Sketch from "react-p5"
import * as tf from '@tensorflow/tfjs';
import HS from "../../assets/Headshot.png"


export default function Home() {
    const titles = ["Software Developement", "Machine Learning", "Data Science", "Computational Chemistry"]
    const [Title, setTitle] = useState(titles[1])
    const [Color, setColor] = useState("#4C8C8A")
    const [PointsX, setPointsX] = useState([])
    const [PointsY, setPointsY] = useState([])
    const [model, setModel] = useState(tf.sequential())
    const [coeff, setCoeff] = useState([])
    const [RenderSketch, setRenderSketch] = useState(false)
    const [b, setB] = useState(tf.variable(tf.scalar(Math.random() * 2 - 1)));

    const ParentRef = useRef(null)
    const colors = ["#4C8C8A", "#A78BFA", "#8B6F61"]
    const caroselItems = ["React", "Tailwind", "Python", "JavaScript", "C++", "C", "Java", "HTML", "CSS", "ROS2", "OpenCV", "PyTorch", "TensorFlow", "Flask", "Node.js", "Express.js", "MongoDB", "PostgreSQL"]
    const lr = .1;
    const optimizer = tf.train.momentum(lr, 0.9, true);
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
        console.log("ParentRef: ", offsetWidth, offsetHeight)
        p5.createCanvas( offsetWidth,  offsetHeight + 100 ).parent(ParentRef.current);
        p5.background(0);
    }



    function draw(p5){
        p5.clear();
        setCoeff([coeff[0], coeff[1], coeff[2], coeff[3], coeff[4]])
        tf.tidy(() =>{
            if(PointsX.length > 0){
                const xs = tf.tensor(PointsX);
                const ys = tf.tensor1d(PointsY);
                optimizer.minimize(() => {
                    return loss(predict(PointsX), ys)});
            }
        })

        const curveX = [];
        for(let x = -1; x <= 1.01; x+=0.01){
            curveX.push(x);
        }

        const ys = tf.tidy(() => predict(curveX));
        let curveY = ys.dataSync();
        ys.dispose();
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

        p5.drawingContext.shadowOffsetX = 0;
        p5.drawingContext.shadowOffsetY = 0;
        p5.drawingContext.shadowBlur = 20;
        p5.drawingContext.shadowColor = 'rgba(255, 255, 255, .2)';

        p5.ellipse(p5.mouseX, p5.mouseY, 10, 10);
        drawPoints(p5);

        p5.drawingContext.shadowBlur = 0;
    }

    function addPoint(p5) {
        console.log("MouseX: ", p5.mouseX / p5.width, "MouseY: ", p5.mouseY / p5.height)
        if (p5.mouseX < 0 || p5.mouseX > p5.width || p5.mouseY < 0 || p5.mouseY > p5.height) {
            return;
        }
        const x = p5.map(p5.mouseX, 0, p5.width, -1, 1);
        const y = p5.map(p5.mouseY, 0, p5.height, 1, -1);
        if(PointsX.length > 20){
            setPointsX((prev)=> [...prev.slice(1), x])
            setPointsY((prev)=> [...prev.slice(1), y])
            return;

        }
        setPointsX([...PointsX, x]);
        setPointsY([...PointsY, y]);
    }

    function drawPoints(p5) {
        for (let i = 0; i < PointsX.length; i++) {
            p5.stroke(200);
            p5.fill(200, 200, 200);
            for(let i = 0; i < PointsX.length; i++){
                let px = p5.map(PointsX[i], -1, 1, 0, p5.width);
                let py = p5.map(PointsY[i], -1, 1, p5.height, 0);
                p5.ellipse(px, py, 10, 10);
            }
        }
    }

    function predict(X_vals) {
        const xs = tf.tensor1d(X_vals);
        let sum = tf.scalar(0);
        for (let i = 0; i < coeff.length; i++) {
            sum = sum.add(coeff[i].mul(xs.pow(tf.scalar(i + 1))));
        }
        const ys = sum.add(b);
        return ys;
    }

    function loss(y_pred, y_true) {
        return y_pred.sub(y_true).square().mean();
    }

    function func(x){
        let z= 1.3
        return Math.pow((x-z),3) * 1.5 +  Math.pow((x-z),2) * 3 + (x - z);
    }


    function getEquation(){
        return coeff.map((c, i) => {
            if(i === 0){
                return <p key={i}>({(Math.round(c.dataSync() * 1000) / 1000 ).toFixed(3)})x +&nbsp;</p>

            }
            return <p key={i}>({(Math.round(c.dataSync() * 1000) / 1000 ).toFixed(3)})x<sup>{i+1}</sup> +&nbsp;</p>

        });
    }


    useEffect(() => {
        console.log(coeff[0])
    },[coeff[0]]);

    useEffect(() => {
        let index = 0;
        const interval = 3000
        setInterval(() => {
            index = (index + 1) % titles.length;
            setColor(colors[Math.floor(Math.random() * (3) )])
            setTitle(titles[index])
        }, interval);

        model.add(tf.layers.dense({units: 1, inputShape: [1]}));
        model.add(tf.layers.dense({units: 1}));
        let coeffArr = []
        for( let i = 0; i < 5; i++){
            coeffArr.push(tf.variable(tf.scalar(Math.random() + 0.5 - 1)))
        }
        setCoeff(coeffArr)
        for(let i = 1; i < 5 ; i++){
                const x = Math.random() * 2 - 1;
                const y = func(x) * Math.random() * 0.5 + 0.5;
                console.log("X: ", x, "Y: ", y)
                setPointsX((prev) => [...prev, x]);
                setPointsY((prev) => [...prev, y]);
        }

        if(ParentRef.current){
            setTimeout(() => {
                setRenderSketch(true)
            }, 100)
        }

        return () => {
            setRenderSketch(false)
        }

    },[]);


    return (
        <div className="Page relative overflow-hidden">
            <motion.div className="absolute w-full h-full"
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 1, ease: "easeInOut" }}>
                <div ref={ParentRef}  className="relative w-full h-full">
                    {RenderSketch?<Sketch setup={setup} draw={draw} mousePressed={addPoint} onLoad={()=>{setNoSketch(false)}} />:null}
                </div>
            </motion.div>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute right-0 bottom-0 w-1/4 m-10">
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
                <div className="absolute w-fit h-fit top-0 right-0 flex flex-row m-5 text-lg">
                 {coeff[0]?getEquation():null}{(Math.round(b.dataSync() * 1000) / 1000).toFixed(3)}
                </div>
                <div className="h-full w-full  flex items-center justify-center relative overflow-hidden">
                    <motion.div style={{"--quantity": caroselItems.length}} className=" w-30 h-30 carosel-container">
                            {getCaroselItems(caroselItems)}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}