import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const COUNT = 160
const COLOR = '#e5e5e5'
const SPEED = 38
const FIELD_STEP = 36
const FIELD_LEN = 9
const NOISE_SCALE = 0.0042
const ACCENTS = [
  [76, 140, 138], // #4C8C8A teal
  [167, 139, 250], // #A78BFA violet
  [139, 111, 97], // #8B6F61 brown
]

function mixAccent(angle) {
  const u = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) / (Math.PI * 2)
  const scaled = u * ACCENTS.length
  const i = Math.floor(scaled) % ACCENTS.length
  const j = (i + 1) % ACCENTS.length
  const f = scaled - Math.floor(scaled)
  const a = ACCENTS[i]
  const b = ACCENTS[j]
  const r = (a[0] + (b[0] - a[0]) * f) | 0
  const g = (a[1] + (b[1] - a[1]) * f) | 0
  const bl = (a[2] + (b[2] - a[2]) * f) | 0
  return `rgb(${r},${g},${bl})`
}

// ponytail: value noise is enough; upgrade to simplex if banding shows
function hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function smooth(t) {
  return t * t * (3 - 2 * t)
}

function valueNoise(x, y) {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const fx = smooth(x - x0)
  const fy = smooth(y - y0)
  const a = hash2(x0, y0)
  const b = hash2(x0 + 1, y0)
  const c = hash2(x0, y0 + 1)
  const d = hash2(x0 + 1, y0 + 1)
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy
}

function fieldAngle(x, y, t) {
  return valueNoise(x * NOISE_SCALE + t, y * NOISE_SCALE) * Math.PI * 2
}

function makeParticles(w, h) {
  return Array.from({ length: COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
  }))
}

/**
 * Particles riding a slow evolving noise field, with a faint vector underlay.
 * Pauses when `active` is false.
 */
export default function FlowFieldBackground({ active = true }) {
  const reduceMotion = useReducedMotion()
  const fieldRef = useRef(null)
  const particleRef = useRef(null)
  const particlesRef = useRef([])
  const activeRef = useRef(active)
  const rafRef = useRef(0)
  activeRef.current = active

  useEffect(() => {
    const field = fieldRef.current
    const particlesCanvas = particleRef.current
    if (!field || !particlesCanvas) return undefined
    const fctx = field.getContext('2d')
    const pctx = particlesCanvas.getContext('2d')
    if (!fctx || !pctx) return undefined

    let w = 0
    let h = 0
    let dpr = 1
    let t = 0

    const sizeCanvas = (canvas, ctx) => {
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const resize = () => {
      const parent = particlesCanvas.parentElement
      if (!parent) return
      w = parent.clientWidth
      h = parent.clientHeight
      if (w < 8 || h < 8) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      sizeCanvas(particlesCanvas, pctx)
      sizeCanvas(field, fctx)
      if (particlesRef.current.length === 0) {
        particlesRef.current = makeParticles(w, h)
      }
    }

    const ro = new ResizeObserver(resize)
    ro.observe(particlesCanvas.parentElement ?? particlesCanvas)
    resize()

    let last = performance.now()

    const drawField = () => {
      fctx.clearRect(0, 0, w, h)
      fctx.lineWidth = 1.15
      fctx.lineCap = 'round'
      for (let y = FIELD_STEP * 0.5; y < h; y += FIELD_STEP) {
        for (let x = FIELD_STEP * 0.5; x < w; x += FIELD_STEP) {
          const angle = fieldAngle(x, y, t)
          const dx = Math.cos(angle) * FIELD_LEN
          const dy = Math.sin(angle) * FIELD_LEN
          fctx.strokeStyle = mixAccent(angle)
          fctx.globalAlpha = 0.32
          fctx.beginPath()
          fctx.moveTo(x - dx * 0.35, y - dy * 0.35)
          fctx.lineTo(x + dx * 0.65, y + dy * 0.65)
          fctx.stroke()
        }
      }
      fctx.globalAlpha = 1
    }

    const drawParticles = () => {
      const particles = particlesRef.current
      pctx.fillStyle = COLOR
      for (const p of particles) {
        pctx.globalAlpha = 0.72
        pctx.beginPath()
        pctx.arc(p.x, p.y, 1.85, 0, Math.PI * 2)
        pctx.fill()
      }
      pctx.globalAlpha = 1
    }

    const step = (now) => {
      rafRef.current = requestAnimationFrame(step)
      if (!activeRef.current || w < 8) return

      const dt = Math.min(0.032, (now - last) / 1000)
      last = now

      if (reduceMotion) {
        drawField()
        pctx.clearRect(0, 0, w, h)
        drawParticles()
        return
      }

      t += dt * 0.12
      const particles = particlesRef.current

      for (const p of particles) {
        const angle = fieldAngle(p.x, p.y, t)
        p.x += Math.cos(angle) * SPEED * dt
        p.y += Math.sin(angle) * SPEED * dt
        if (p.x < -4) p.x = w + 4
        if (p.x > w + 4) p.x = -4
        if (p.y < -4) p.y = h + 4
        if (p.y > h + 4) p.y = -4
      }

      drawField()

      // Longer fade = more dramatic trails (particles only)
      pctx.fillStyle = 'rgba(10, 10, 10, 0.055)'
      pctx.fillRect(0, 0, w, h)
      drawParticles()
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [reduceMotion])

  return (
    <div className="relative h-full w-full overflow-hidden" aria-label="Flow field simulation">
      <canvas ref={particleRef} className="absolute inset-0 h-full w-full" aria-hidden />
      <canvas ref={fieldRef} className="absolute inset-0 h-full w-full" aria-hidden />
      <div
        className="pointer-events-none absolute bottom-3 left-3 z-[2] hidden font-mono text-[10px] text-neutral-600 sm:block"
        aria-hidden
      >
        flow
      </div>
    </div>
  )
}
