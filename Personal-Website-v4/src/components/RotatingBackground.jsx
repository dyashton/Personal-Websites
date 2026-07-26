import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import MoleculeConstellation from './MoleculeConstellation'
import FlockingBackground from './FlockingBackground'
import FlowFieldBackground from './FlowFieldBackground'
import CellularAutomataBackground from './CellularAutomataBackground'
import NeuralNetBackground from './NeuralNetBackground'

const DWELL_MS = 20_000
const FADE_S = 2.6

const SCENES = [
  { id: 'molecules', Component: MoleculeConstellation, interactive: true },
  { id: 'flock', Component: FlockingBackground, interactive: false },
  { id: 'flow', Component: FlowFieldBackground, interactive: false },
  { id: 'automata', Component: CellularAutomataBackground, interactive: false },
  { id: 'neural', Component: NeuralNetBackground, interactive: true },
]

/**
 * Crossfades through lightweight background sims.
 * Click advances; auto-rotate resets after each advance.
 * Reduced-motion users stay on molecules only.
 */
export default function RotatingBackground() {
  const reduceMotion = useReducedMotion()
  const [scene, setScene] = useState(0)
  const [blending, setBlending] = useState(false)
  const [epoch, setEpoch] = useState(0)
  const fadeTimerRef = useRef(0)
  const count = SCENES.length

  const goNext = useCallback(() => {
    setBlending(true)
    setScene((s) => (s + 1) % count)
    clearTimeout(fadeTimerRef.current)
    fadeTimerRef.current = window.setTimeout(() => setBlending(false), FADE_S * 1000)
  }, [count])

  useEffect(() => {
    if (reduceMotion) return undefined

    const id = setInterval(goNext, DWELL_MS)
    return () => {
      clearInterval(id)
      clearTimeout(fadeTimerRef.current)
    }
  }, [reduceMotion, goNext, epoch])

  const onClick = (e) => {
    if (reduceMotion) return
    // Let molecule drag targets keep their interaction
    if (e.target.closest?.('[data-bg-drag]')) return
    goNext()
    setEpoch((n) => n + 1)
  }

  const fade = {
    duration: FADE_S,
    ease: [0.4, 0, 0.2, 1],
  }

  if (reduceMotion) {
    return (
      <div className="absolute inset-0">
        <MoleculeConstellation active />
      </div>
    )
  }

  return (
    <div
      className="absolute inset-0 cursor-pointer"
      onClick={onClick}
      role="presentation"
      title="Click to change background"
    >
      {SCENES.map((entry, i) => {
        const on = scene === i
        const prev = (scene - 1 + count) % count
        const active = on || (blending && i === prev)
        const { Component, interactive } = entry

        return (
          <motion.div
            key={entry.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: on ? 1 : 0 }}
            transition={fade}
            style={{
              pointerEvents: on && interactive ? 'auto' : 'none',
            }}
          >
            <Component active={active} />
          </motion.div>
        )
      })}
    </div>
  )
}
