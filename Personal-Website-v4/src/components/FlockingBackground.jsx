import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const COUNT = 52
const MAX_SPEED = 95
const MIN_SPEED = 32
const PERCEPTION = 78
const SEPARATION = 24
const BIRD_COLOR = '#e5e5e5'

function makeBirds(w, h) {
  return Array.from({ length: COUNT }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED) * 0.5
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: BIRD_COLOR,
    }
  })
}

function limit(vx, vy, max) {
  const sp = Math.hypot(vx, vy)
  if (sp > max && sp > 0) return [(vx / sp) * max, (vy / sp) * max]
  return [vx, vy]
}

function floor(vx, vy, min) {
  const sp = Math.hypot(vx, vy)
  if (sp < min && sp > 0) return [(vx / sp) * min, (vy / sp) * min]
  if (sp === 0) return [min, 0]
  return [vx, vy]
}

/**
 * Canvas boids — cheap at ~50 agents. Pauses when `active` is false.
 */
export default function FlockingBackground({ active = true }) {
  const reduceMotion = useReducedMotion()
  const canvasRef = useRef(null)
  const birdsRef = useRef([])
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
      if (birdsRef.current.length === 0) birdsRef.current = makeBirds(w, h)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement ?? canvas)
    resize()

    let last = performance.now()

    const drawBird = (b) => {
      const angle = Math.atan2(b.vy, b.vx)
      const s = 5.5
      ctx.save()
      ctx.translate(b.x, b.y)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.moveTo(s * 1.4, 0)
      ctx.lineTo(-s * 0.9, s * 0.7)
      ctx.lineTo(-s * 0.45, 0)
      ctx.lineTo(-s * 0.9, -s * 0.7)
      ctx.closePath()
      ctx.fillStyle = b.color
      ctx.globalAlpha = 0.72
      ctx.fill()
      ctx.restore()
    }

    const step = (now) => {
      rafRef.current = requestAnimationFrame(step)
      if (!activeRef.current || w < 8) return

      const dt = Math.min(0.032, (now - last) / 1000)
      last = now
      const birds = birdsRef.current

      if (reduceMotion) {
        ctx.clearRect(0, 0, w, h)
        for (const b of birds) drawBird(b)
        return
      }

      for (let i = 0; i < birds.length; i++) {
        const b = birds[i]
        let sx = 0
        let sy = 0
        let ax = 0
        let ay = 0
        let cx = 0
        let cy = 0
        let nSep = 0
        let n = 0

        for (let j = 0; j < birds.length; j++) {
          if (i === j) continue
          const o = birds[j]
          const dx = o.x - b.x
          const dy = o.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > PERCEPTION * PERCEPTION || d2 === 0) continue
          const d = Math.sqrt(d2)
          n++
          ax += o.vx
          ay += o.vy
          cx += o.x
          cy += o.y
          if (d < SEPARATION) {
            sx -= dx / d
            sy -= dy / d
            nSep++
          }
        }

        if (nSep > 0) {
          b.vx += (sx / nSep) * 48 * dt
          b.vy += (sy / nSep) * 48 * dt
        }
        if (n > 0) {
          b.vx += (ax / n - b.vx) * 0.9 * dt
          b.vy += (ay / n - b.vy) * 0.9 * dt
          b.vx += (cx / n - b.x) * 0.35 * dt
          b.vy += (cy / n - b.y) * 0.35 * dt
        }

        // Soft pull toward a gentle L→R cruise so the flock still reads as drift
        b.vx += 12 * dt

        ;[b.vx, b.vy] = limit(b.vx, b.vy, MAX_SPEED)
        ;[b.vx, b.vy] = floor(b.vx, b.vy, MIN_SPEED)

        b.x += b.vx * dt
        b.y += b.vy * dt
        if (b.x < -10) b.x = w + 10
        if (b.x > w + 10) b.x = -10
        if (b.y < -10) b.y = h + 10
        if (b.y > h + 10) b.y = -10
      }

      ctx.clearRect(0, 0, w, h)

      // Faint neighbor links for a wireframe-adjacent feel
      ctx.lineWidth = 0.75
      for (let i = 0; i < birds.length; i++) {
        const a = birds[i]
        for (let j = i + 1; j < birds.length; j++) {
          const b = birds[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const d2 = dx * dx + dy * dy
          if (d2 > 55 * 55) continue
          const d = Math.sqrt(d2)
          ctx.strokeStyle = a.color
          ctx.globalAlpha = 0.12 * (1 - d / 55)
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1

      for (const b of birds) drawBird(b)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [reduceMotion])

  return (
    <div className="relative h-full w-full overflow-hidden" aria-label="Bird flocking simulation">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      <div
        className="pointer-events-none absolute bottom-3 left-3 z-[2] hidden font-mono text-[10px] text-neutral-600 sm:block"
        aria-hidden
      >
        flock
      </div>
    </div>
  )
}
