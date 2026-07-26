import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const LAYERS = [2, 8, 8, 3]
const TEAL = '#4C8C8A'
const VIOLET = '#A78BFA'
const NODE = '#e5e5e5'
const EDGE = '#525252'
const BREATH_HZ = 1.4
const FLOW_MIN = 0.04

function layerColor(layer) {
  return layer % 2 === 0 ? TEAL : VIOLET
}

function buildGraph(w, h) {
  const padX = w * 0.14
  const padY = h * 0.16
  const usableW = w - padX * 2
  const usableH = h - padY * 2
  const nodes = []
  const edges = []

  for (let li = 0; li < LAYERS.length; li++) {
    const count = LAYERS[li]
    const x =
      padX + (LAYERS.length === 1 ? usableW / 2 : (usableW * li) / (LAYERS.length - 1))

    let y0 = padY
    let span = usableH
    if (count <= 3) {
      span = usableH * (count === 2 ? 0.28 : 0.4)
      y0 = padY + (usableH - span) / 2
    }

    for (let ni = 0; ni < count; ni++) {
      const y = count === 1 ? padY + usableH / 2 : y0 + (span * ni) / (count - 1)
      nodes.push({
        layer: li,
        index: ni,
        x,
        y,
        label: li === 0 ? (ni === 0 ? 'x' : 'y') : null,
      })
    }
  }

  let offset = 0
  const layerStarts = LAYERS.map((n) => {
    const start = offset
    offset += n
    return start
  })

  for (let li = 0; li < LAYERS.length - 1; li++) {
    const a0 = layerStarts[li]
    const b0 = layerStarts[li + 1]
    for (let i = 0; i < LAYERS[li]; i++) {
      for (let j = 0; j < LAYERS[li + 1]; j++) {
        const weight = (Math.random() * 2 - 1) * (0.4 + Math.random() * 0.6)
        edges.push({
          from: a0 + i,
          to: b0 + j,
          layer: li,
          weight,
          mag: Math.abs(weight),
        })
      }
    }
  }

  return { nodes, edges, layerStarts }
}

/**
 * Forward pass from [xNorm, yNorm]. No per-layer max-norm — magnitude
 * matters so mouse motion changes brightness and which paths light up.
 */
function forwardPass(graph, inputs) {
  const { edges, layerStarts } = graph
  const act = new Float32Array(graph.nodes.length)
  const flow = new Float32Array(edges.length)

  // Slight contrast so mid-screen motion still moves the dial
  const xIn = Math.min(1, Math.max(0, inputs[0]))
  const yIn = Math.min(1, Math.max(0, inputs[1]))
  act[layerStarts[0]] = xIn * xIn * (3 - 2 * xIn) // smoothstep-ish punch
  act[layerStarts[0] + 1] = yIn * yIn * (3 - 2 * yIn)

  for (let li = 0; li < LAYERS.length - 1; li++) {
    const next = new Float32Array(LAYERS[li + 1])
    for (let ei = 0; ei < edges.length; ei++) {
      const e = edges[ei]
      if (e.layer !== li) continue
      const src = act[e.from]
      const contrib = src * e.weight
      flow[ei] = Math.abs(contrib)
      next[e.to - layerStarts[li + 1]] += contrib
    }
    for (let j = 0; j < next.length; j++) {
      // tanh keeps magnitude; no max-norm (that made |input| invisible)
      act[layerStarts[li + 1] + j] = (Math.tanh(next[j] * 1.6) + 1) * 0.5
    }
  }

  // Absolute flow → highlight (fixed scale so brighter inputs = brighter edges)
  const active = new Float32Array(edges.length)
  const SCALE = 0.35
  for (let ei = 0; ei < edges.length; ei++) {
    const s = Math.min(1, flow[ei] / SCALE)
    if (s >= FLOW_MIN) active[ei] = s * s // favor strong carriers without top-k
  }

  return { act, active }
}

/**
 * Inputs = mouse X/Y. Hidden weights random & fixed until resize.
 * Highlights = result of a real forward pass each frame.
 */
export default function NeuralNetBackground({ active = true }) {
  const reduceMotion = useReducedMotion()
  const canvasRef = useRef(null)
  const graphRef = useRef(null)
  const pointerRef = useRef({ x: 0.5, y: 0.5 })
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
    let t = 0

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
      graphRef.current = buildGraph(w, h)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement ?? canvas)
    resize()

    // Track mouse across the page so hero text doesn't block updates
    const onPointerMove = (e) => {
      if (!activeRef.current) return
      const rect = canvas.getBoundingClientRect()
      const rw = rect.width || 1
      const rh = rect.height || 1
      pointerRef.current = {
        x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rw)),
        y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rh)),
      }
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    let last = performance.now()

    const paint = (time, animate, inputs) => {
      const graph = graphRef.current
      if (!graph) return
      const { act, active: edgeActive } = forwardPass(graph, inputs)
      const { nodes, edges } = graph

      ctx.clearRect(0, 0, w, h)

      const breath = animate ? 0.62 + 0.38 * Math.sin(time * BREATH_HZ) : 0.8

      // Base weights (inactive / weak flow)
      for (let ei = 0; ei < edges.length; ei++) {
        if (edgeActive[ei] >= FLOW_MIN) continue
        const e = edges[ei]
        const a = nodes[e.from]
        const b = nodes[e.to]
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = EDGE
        ctx.globalAlpha = 0.04 + e.mag * 0.035
        ctx.lineWidth = 0.55
        ctx.stroke()
      }

      // Active = edges carrying signal in this forward pass
      for (let ei = 0; ei < edges.length; ei++) {
        const strength = edgeActive[ei]
        if (strength < FLOW_MIN) continue
        const e = edges[ei]
        const a = nodes[e.from]
        const b = nodes[e.to]
        const glow = strength * breath
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = layerColor(e.layer)
        ctx.globalAlpha = 0.12 + glow * 0.65
        ctx.lineWidth = 0.8 + glow * 2
        ctx.stroke()
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const a = act[i]
        const isInput = n.layer === 0
        const lit = isInput || a > 0.15
        const r = isInput ? 5.5 + a * 3 : 2.4 + a * 4 * breath
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = lit ? layerColor(n.layer) : NODE
        ctx.globalAlpha = isInput ? 0.55 + a * 0.4 : lit ? 0.3 + a * 0.55 * breath : 0.35
        ctx.fill()

        if (isInput) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, r + 4, 0, Math.PI * 2)
          ctx.strokeStyle = layerColor(0)
          ctx.globalAlpha = 0.45 + a * 0.35
          ctx.lineWidth = 1.25
          ctx.stroke()

          ctx.font = '600 11px "Fira Mono", ui-monospace, monospace'
          ctx.textAlign = 'right'
          ctx.textBaseline = 'middle'
          ctx.globalAlpha = 0.7
          ctx.fillStyle = NODE
          ctx.fillText(n.label ?? '', n.x - r - 8, n.y)
        }
      }
      ctx.globalAlpha = 1
    }

    const step = (now) => {
      rafRef.current = requestAnimationFrame(step)
      if (!activeRef.current || w < 8) return

      const dt = Math.min(0.032, (now - last) / 1000)
      last = now

      if (reduceMotion) {
        paint(0, false, [0.5, 0.5])
        return
      }

      t += dt
      const { x, y } = pointerRef.current
      paint(t, true, [x, y])
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [reduceMotion])

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      aria-label="Neural network visualization driven by mouse position"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      <div
        className="pointer-events-none absolute bottom-3 left-3 z-[2] hidden font-mono text-[10px] text-neutral-600 sm:block"
        aria-hidden
      >
        neural net
      </div>
    </div>
  )
}
