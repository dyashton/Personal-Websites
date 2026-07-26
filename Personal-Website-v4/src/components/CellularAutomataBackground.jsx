import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const CELL = 14
const STEP_MS = 90
const READY = 0
const FIRING = 1
const REFRACTORY = 2

function seedBoard(cols, rows, density = 0.025) {
  const board = new Uint8Array(cols * rows)
  for (let i = 0; i < board.length; i++) {
    if (Math.random() < density) board[i] = FIRING
  }
  return board
}

function spark(board, cols, rows, n = 5) {
  for (let k = 0; k < n; k++) {
    const i = (Math.random() * cols * rows) | 0
    board[i] = FIRING
  }
}

/**
 * Brian's Brain CA — Ready → Firing → Refractory → Ready.
 * Steps on an interval; pauses when `active` is false.
 */
export default function CellularAutomataBackground({ active = true }) {
  const reduceMotion = useReducedMotion()
  const canvasRef = useRef(null)
  const boardRef = useRef(null)
  const activeRef = useRef(active)
  const rafRef = useRef(0)
  activeRef.current = active

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let w = 0
    let h = 0
    let dpr = 1
    let cols = 0
    let rows = 0
    let accum = 0

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      w = parent.clientWidth
      h = parent.clientHeight
      if (w < 8 || h < 8) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const nextCols = Math.max(8, Math.floor(w / CELL))
      const nextRows = Math.max(8, Math.floor(h / CELL))
      if (nextCols !== cols || nextRows !== rows || !boardRef.current) {
        cols = nextCols
        rows = nextRows
        boardRef.current = seedBoard(cols, rows)
      }
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement ?? canvas)
    resize()

    let last = performance.now()

    const neighborFiring = (board, x, y) => {
      let n = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue
          const nx = (x + dx + cols) % cols
          const ny = (y + dy + rows) % rows
          if (board[ny * cols + nx] === FIRING) n++
        }
      }
      return n
    }

    const tick = () => {
      const cur = boardRef.current
      if (!cur || cols < 1) return
      const next = new Uint8Array(cols * rows)
      let firing = 0

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          const s = cur[i]
          if (s === FIRING) {
            next[i] = REFRACTORY
          } else if (s === REFRACTORY) {
            next[i] = READY
          } else {
            // Ready: fire if exactly 2 firing neighbors
            next[i] = neighborFiring(cur, x, y) === 2 ? FIRING : READY
          }
          if (next[i] === FIRING) firing++
        }
      }

      // ponytail: if the board dies out, sprinkle sparks instead of full reseed
      if (firing < 2) spark(next, cols, rows, 6)
      boardRef.current = next
    }

    const paint = () => {
      const board = boardRef.current
      if (!board || cols < 1) return
      ctx.clearRect(0, 0, w, h)
      const cw = w / cols
      const ch = h / rows

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const s = board[y * cols + x]
          if (s === READY) continue
          const cx = x * cw + cw * 0.5
          const cy = y * ch + ch * 0.5
          // Soft dots instead of solid blocks — less grid glare
          if (s === FIRING) {
            ctx.fillStyle = '#d4d4d4'
            ctx.globalAlpha = 0.28
            ctx.beginPath()
            ctx.arc(cx, cy, Math.min(cw, ch) * 0.22, 0, Math.PI * 2)
            ctx.fill()
          } else {
            ctx.fillStyle = '#737373'
            ctx.globalAlpha = 0.12
            ctx.beginPath()
            ctx.arc(cx, cy, Math.min(cw, ch) * 0.12, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
      ctx.globalAlpha = 1
    }

    const step = (now) => {
      rafRef.current = requestAnimationFrame(step)
      if (!activeRef.current || w < 8) return

      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      if (reduceMotion) {
        paint()
        return
      }

      accum += dt * 1000
      while (accum >= STEP_MS) {
        accum -= STEP_MS
        tick()
      }
      paint()
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [reduceMotion])

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      aria-label="Cellular automata simulation"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      <div
        className="pointer-events-none absolute bottom-3 left-3 z-[2] hidden font-mono text-[10px] text-neutral-600 sm:block"
        aria-hidden
      >
        automata
      </div>
    </div>
  )
}
