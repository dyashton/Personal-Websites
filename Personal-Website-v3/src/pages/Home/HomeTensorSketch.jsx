import { useState, useEffect, useRef } from "react";
import Sketch from "react-p5";
import * as tf from "@tensorflow/tfjs";

const POLY_TERMS = 3;

const CURVE_X = (() => {
    const xs = [];
    for (let x = -1; x <= 1.01; x += 0.01) xs.push(x);
    return xs;
})();

/**
 * Polynomial regression canvas + TensorFlow training. Loaded only on desktop (lazy chunk).
 */
export default function HomeTensorSketch({ containerRef, onMetricsUpdate }) {
    const [renderSketch, setRenderSketch] = useState(false);
    const onMetricsUpdateRef = useRef(onMetricsUpdate);
    onMetricsUpdateRef.current = onMetricsUpdate;

    const coeffRef = useRef([]);
    const bRef = useRef(null);
    const pointsXRef = useRef([]);
    const pointsYRef = useRef([]);
    const coeffUiFrameRef = useRef(0);
    const lr = 0.1;
    const optimizerRef = useRef(null);

    function setup(p5) {
        const el = containerRef.current;
        if (!el) return;
        const { offsetWidth, offsetHeight } = el;
        p5.createCanvas(offsetWidth, offsetHeight + 100).parent(el);
        p5.background(0);
        p5.frameRate(30);
    }

    function updateCoeffDisplay() {
        const c = coeffRef.current;
        if (!c || c.length === 0) return;

        const coeffValues = c.map((v) => {
            if (v && !v.isDisposed) {
                return Math.round(v.dataSync()[0] * 1000) / 1000;
            }
            return 0;
        });
        const bias = bRef.current;
        const bVal =
            bias && !bias.isDisposed
                ? Math.round(bias.dataSync()[0] * 1000) / 1000
                : 0;
        onMetricsUpdateRef.current?.({ coeffValues, bValue: bVal });
    }

    function predict(X_vals) {
        const c = coeffRef.current;
        const bias = bRef.current;
        return tf.tidy(() => {
            const xs = tf.tensor1d(X_vals);
            let xPow = xs;
            let sum = tf.scalar(0);
            for (let i = 0; i < c.length; i++) {
                const wi = c[i];
                if (wi && !wi.isDisposed) {
                    sum = sum.add(wi.mul(xPow));
                }
                if (i < c.length - 1) {
                    xPow = xPow.mul(xs);
                }
            }
            return bias && !bias.isDisposed ? sum.add(bias) : sum;
        });
    }

    function loss(y_pred, y_true) {
        return y_pred.sub(y_true).square().mean();
    }

    function draw(p5) {
        p5.clear();
        const px = pointsXRef.current;
        const py = pointsYRef.current;
        tf.tidy(() => {
            if (
                px.length > 0 &&
                coeffRef.current.length > 0 &&
                bRef.current &&
                optimizerRef.current
            ) {
                const ysTrain = tf.tensor1d(py);

                optimizerRef.current.minimize(() => {
                    const predictions = predict(px);
                    return loss(predictions, ysTrain);
                });

                coeffUiFrameRef.current += 1;
                if (coeffUiFrameRef.current % 8 === 0) {
                    updateCoeffDisplay();
                }

                const curveTensor = predict(CURVE_X);
                const curveY = curveTensor.dataSync();

                p5.background(0);
                p5.beginShape();
                p5.fill(0);
                p5.stroke(150);
                p5.strokeWeight(2);
                for (let i = 0; i < CURVE_X.length; i++) {
                    const x = p5.map(CURVE_X[i], -1, 1, 0, p5.width);
                    const y = p5.map(curveY[i], -1, 1, p5.height, 0);
                    p5.vertex(x, y);
                }
                p5.endShape();
            }
        });

        p5.drawingContext.shadowOffsetX = 0;
        p5.drawingContext.shadowOffsetY = 0;
        p5.drawingContext.shadowBlur = 20;
        p5.drawingContext.shadowColor = "rgba(255, 255, 255, .2)";
        p5.ellipse(p5.mouseX, p5.mouseY, 10, 10);
        drawPoints(p5);
        p5.drawingContext.shadowBlur = 0;
    }

    function addPoint(p5) {
        if (
            p5.mouseX < 0 ||
            p5.mouseX > p5.width ||
            p5.mouseY < 0 ||
            p5.mouseY > p5.height
        ) {
            return;
        }

        const x = p5.map(p5.mouseX, 0, p5.width, -1, 1);
        const y = p5.map(p5.mouseY, 0, p5.height, 1, -1);

        if (pointsXRef.current.length > 10) {
            const nx = [...pointsXRef.current.slice(1), x];
            const ny = [...pointsYRef.current.slice(1), y];
            pointsXRef.current = nx;
            pointsYRef.current = ny;
        } else {
            const nx = [...pointsXRef.current, x];
            const ny = [...pointsYRef.current, y];
            pointsXRef.current = nx;
            pointsYRef.current = ny;
        }
    }

    function drawPoints(p5) {
        const xs = pointsXRef.current;
        const ys = pointsYRef.current;
        p5.stroke(200);
        p5.fill(200, 200, 200);
        for (let i = 0; i < xs.length; i++) {
            const px = p5.map(xs[i], -1, 1, 0, p5.width);
            const py = p5.map(ys[i], -1, 1, p5.height, 0);
            p5.ellipse(px, py, 10, 10);
        }
    }

    function func(x) {
        const z = 1.3;
        return (
            Math.pow(x - z, 3) * 1.5 + Math.pow(x - z, 2) * 3 + (x - z)
        );
    }

    useEffect(() => {
        coeffRef.current.forEach((v) => {
            if (v && !v.isDisposed) v.dispose();
        });
        if (bRef.current && !bRef.current.isDisposed) {
            bRef.current.dispose();
        }

        optimizerRef.current = tf.train.momentum(lr, 0.9, true);

        const newCoeff = [];
        for (let i = 0; i < POLY_TERMS; i++) {
            newCoeff.push(tf.variable(tf.scalar(Math.random() * 2 - 1)));
        }
        const newB = tf.variable(tf.scalar(Math.random() * 2 - 1));

        coeffRef.current = newCoeff;
        bRef.current = newB;

        const initialPoints = [];
        for (let i = 1; i < 5; i++) {
            const x = Math.random() * 2 - 1;
            const y = func(x) * Math.random() * 0.5 + 0.5;
            initialPoints.push({ x, y });
        }

        const ix = initialPoints.map((p) => p.x);
        const iy = initialPoints.map((p) => p.y);
        pointsXRef.current = ix;
        pointsYRef.current = iy;

        const initialCoeffs = newCoeff.map(
            (c) => Math.round(c.dataSync()[0] * 1000) / 1000
        );
        const initialB = Math.round(newB.dataSync()[0] * 1000) / 1000;
        onMetricsUpdateRef.current?.({
            coeffValues: initialCoeffs,
            bValue: initialB,
        });

        const t = setTimeout(() => {
            setRenderSketch(true);
        }, 100);

        return () => {
            clearTimeout(t);
            setRenderSketch(false);

            coeffRef.current.forEach((v) => {
                if (v && !v.isDisposed) v.dispose();
            });
            coeffRef.current = [];
            if (bRef.current && !bRef.current.isDisposed) {
                bRef.current.dispose();
            }
            bRef.current = null;
            optimizerRef.current = null;
        };
    }, []);

    if (!renderSketch) return null;

    return <Sketch setup={setup} draw={draw} mousePressed={addPoint} />;
}
