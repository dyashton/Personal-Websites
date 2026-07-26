import { useEffect, useRef, useState, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  molecules,
  constellationSpawns,
  elementColor,
  pairInteraction,
} from '../data/molecules'

const byId = Object.fromEntries(molecules.map((m) => [m.id, m]))

function MoleculeSvg({ molecule }) {
  const bondStroke = '#737373'

  return (
    <svg
      viewBox={molecule.viewBox.join(' ')}
      className="pointer-events-none h-full w-full overflow-visible select-none"
      aria-hidden
    >
      {molecule.bonds.map(([a, b]) => {
        const from = molecule.atoms[a]
        const to = molecule.atoms[b]
        return (
          <line
            key={`${a}-${b}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={bondStroke}
            strokeWidth={1.35}
            strokeLinecap="round"
            opacity={0.85}
          />
        )
      })}
      {molecule.atoms.map((atom, i) => {
        const color = elementColor(atom.element)
        const isHetero = atom.element !== 'C' && atom.element !== 'H'
        const r = atom.element === 'H' ? 4 : isHetero ? 8 : 5
        return (
          <g key={i}>
            <circle
              cx={atom.x}
              cy={atom.y}
              r={r}
              fill={atom.element === 'C' ? 'var(--bg)' : color}
              stroke={color}
              strokeWidth={atom.element === 'C' ? 1.4 : 1.1}
              opacity={0.9}
            />
            {isHetero && (
              <text
                x={atom.x}
                y={atom.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#0a0a0a"
                fontSize={9}
                fontFamily="Fira Mono, ui-monospace, monospace"
                fontWeight={600}
              >
                {atom.element}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function sizeForScale(scale) {
  return Math.round(72 + scale * 56)
}

function buildBodies(w, h, reduceMotion) {
  return constellationSpawns.map((spawn, i) => {
    const molecule = byId[spawn.moleculeId]
    const size = sizeForScale(spawn.scale)
    // Wide speed mix: fast/slow, some leftward — so paths cross
    const speedMul = 0.35 + Math.random() * 1.8
    const dir = Math.random() < 0.22 ? -1 : 1
    const cruise = reduceMotion ? 0 : spawn.vx * speedMul * dir
    const vy0 = reduceMotion ? 0 : (Math.random() - 0.5) * 55
    return {
      id: `${spawn.moleculeId}-${i}`,
      molecule,
      tags: molecule.tags ?? {},
      x: spawn.x * w,
      y: spawn.y * h,
      vx: cruise,
      vy: vy0,
      cruise,
      wander: reduceMotion ? 0 : (Math.random() - 0.5) * 40,
      r: size * 0.42,
      size,
      interactStrength: 0,
      interactTint: 'transparent',
      stuck: 0,
      lastX: spawn.x * w,
    }
  })
}

/**
 * Circle physics + soft intermolecular forces + drag.
 * Visual: force lines (attract / polar / repel) + collision flashes.
 * ponytail: O(n²) LJ-lite pairwise; fine for ~14. Upgrade: spatial hash / matter.js.
 */
export default function MoleculeConstellation({ active = true }) {
  const reduceMotion = useReducedMotion()
  const panelRef = useRef(null)
  const forceLayerRef = useRef(null)
  const bodiesRef = useRef([])
  const nodeRef = useRef(new Map())
  const dragRef = useRef(null)
  const forcesRef = useRef([])
  const flashesRef = useRef([])
  const rafRef = useRef(0)
  const activeRef = useRef(active)
  const [bodies, setBodies] = useState([])
  activeRef.current = active

  const paint = useCallback(() => {
    for (const b of bodiesRef.current) {
      const node = nodeRef.current.get(b.id)
      if (!node) continue
      node.style.transform = `translate3d(${b.x - b.size / 2}px, ${b.y - b.size / 2}px, 0)`
      node.style.zIndex = dragRef.current?.id === b.id ? '5' : '1'
      // Glow only for clear interactions — avoids constant shimmer
      const active = b.interactStrength > 0.35
      node.style.filter = active
        ? `drop-shadow(0 0 ${2 + b.interactStrength * 5}px ${b.interactTint})`
        : 'none'
      node.style.opacity = '0.92'
    }

    const layer = forceLayerRef.current
    if (layer) {
      const parts = []
      // Only the strongest few links — prefer chemically preferred pairs
      const visible = [...forcesRef.current]
        .filter((f) => f.kind !== 'repel' && f.strength > 0.22)
        .sort((a, b) => {
          const pa = (a.preferred ? 1 : 0) + a.strength
          const pb = (b.preferred ? 1 : 0) + b.strength
          return pb - pa
        })
        .slice(0, 3)

      for (const f of visible) {
        const op = Math.min(
          f.preferred ? 0.55 : 0.35,
          (f.preferred ? 0.2 : 0.1) + f.strength * 0.3,
        )
        const w = f.preferred ? 1.35 : 1
        const dash =
          f.kind === 'hbond' || f.kind === 'polar'
            ? '2 4'
            : f.kind === 'stack'
              ? '5 4'
              : '4 6'
        parts.push(
          `<line x1="${f.x1}" y1="${f.y1}" x2="${f.x2}" y2="${f.y2}" stroke="${f.color}" stroke-width="${w}" stroke-opacity="${op}" stroke-dasharray="${dash}" stroke-linecap="round" />`,
        )
      }
      const now = performance.now()
      flashesRef.current = flashesRef.current.filter((fl) => now - fl.t < 280)
      for (const fl of flashesRef.current) {
        const age = (now - fl.t) / 280
        const r = fl.r * (1 + age * 0.9)
        const op = 0.28 * (1 - age)
        parts.push(
          `<circle cx="${fl.x}" cy="${fl.y}" r="${r}" fill="none" stroke="#a3a3a3" stroke-width="1" stroke-opacity="${op}" />`,
        )
      }
      layer.innerHTML = parts.join('')
    }
  }, [])

  const seed = useCallback(
    (w, h) => {
      const next = buildBodies(w, h, !!reduceMotion)
      bodiesRef.current = next
      setBodies(next)
    },
    [reduceMotion],
  )

  useEffect(() => {
    const el = panelRef.current
    if (!el) return undefined

    let seeded = false
    const trySeed = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (w < 8 || h < 8) return
      if (!seeded) {
        seeded = true
        seed(w, h)
      }
    }

    const ro = new ResizeObserver(trySeed)
    ro.observe(el)
    trySeed()
    return () => ro.disconnect()
  }, [seed])

  useEffect(() => {
    let last = performance.now()

    const step = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000)
      last = now
      const el = panelRef.current
      const list = bodiesRef.current
      if (!activeRef.current || !el || list.length === 0) {
        rafRef.current = requestAnimationFrame(step)
        return
      }

      const w = el.clientWidth
      const h = el.clientHeight
      const drag = dragRef.current
      const forceEdges = []

      for (const b of list) {
        b.interactStrength = 0
        b.interactTint = 'transparent'
      }

      // Soft intermolecular forces (attraction + soft repulsion) before integrate
      if (!reduceMotion) {
        for (let i = 0; i < list.length; i++) {
          for (let j = i + 1; j < list.length; j++) {
            const a = list[i]
            const b = list[j]
            if (drag && (drag.id === a.id || drag.id === b.id)) continue

            const dx = b.x - a.x
            const dy = b.y - a.y
            const dist = Math.hypot(dx, dy) || 0.001
            const sigma = a.r + b.r
            const interactR = sigma * 1.85
            if (dist >= interactR) continue

            const nx = dx / dist
            const ny = dy / dist
            const pair = pairInteraction(a.tags, b.tags)

            let force = 0
            let kind = pair.kind
            let color = pair.color
            let preferred = pair.preferred
            // Tunables: lower = gentler physics
            if (dist < sigma * 1.12) {
              force = -90 * (sigma * 1.12 - dist)
              kind = 'repel'
              color = '#c47a6a'
              preferred = false
            } else {
              const t = (dist - sigma * 1.12) / (interactR - sigma * 1.12)
              force = 18 * pair.mult * (1 - t) * (1 - t)
            }

            const strength = Math.min(1, Math.abs(force) / 80)
            // Only visualize attract kinds — no contact (repel) lines
            if (kind !== 'repel') {
              forceEdges.push({
                x1: a.x,
                y1: a.y,
                x2: b.x,
                y2: b.y,
                kind,
                color,
                strength: preferred ? strength * 1.25 : strength,
                preferred,
              })

              if (preferred || strength > 0.3) {
                a.interactStrength = Math.max(a.interactStrength, strength)
                b.interactStrength = Math.max(b.interactStrength, strength)
                a.interactTint = color
                b.interactTint = color
              }
            }

            const ax = force * nx * dt
            const ay = force * ny * dt
            a.vx += ax
            a.vy += ay
            b.vx -= ax
            b.vy -= ay
          }
        }
      }
      forcesRef.current = forceEdges

      for (const b of list) {
        if (drag?.id === b.id) continue

        if (!reduceMotion) {
          // Detect stalling / cluster trap: little horizontal progress or tiny speed
          const dxFrame = Math.abs(b.x - b.lastX)
          b.lastX = b.x
          const targetH = Math.max(14, Math.abs(b.cruise))
          const stalled =
            Math.abs(b.vx) < targetH * 0.4 || Math.hypot(b.vx, b.vy) < 10
          if (stalled && dxFrame < targetH * dt * 0.5) {
            b.stuck += dt
          } else {
            b.stuck = Math.max(0, b.stuck - dt * 1.5)
          }

          let cruisePull = 0.55
          if (b.stuck > 0.35) {
            // Accelerate back toward cruise so groups don't freeze
            cruisePull = 2.8
            const dir = Math.sign(b.cruise) || (b.vx >= 0 ? 1 : -1)
            b.vx += dir * (55 + b.stuck * 40) * dt
            if (b.stuck > 1.0) {
              // Hard unstick: snap horizontal speed + small vertical kick
              b.vx = dir * Math.max(targetH * 1.4, 36)
              b.vy += (Math.random() - 0.5) * 40
              b.wander = (Math.random() - 0.5) * 45
              b.stuck = 0.15
            }
          }

          b.vx += (b.cruise - b.vx) * cruisePull * dt
          b.vy += (b.wander - b.vy) * 0.35 * dt
          const sp = Math.hypot(b.vx, b.vy)
          if (sp > 160) {
            b.vx *= 160 / sp
            b.vy *= 160 / sp
          }
        }

        b.x += b.vx * dt
        b.y += b.vy * dt

        if (b.x - b.r > w) {
          b.x = -b.r
          b.lastX = b.x
          b.stuck = 0
        }
        if (b.x + b.r < 0) {
          b.x = w + b.r
          b.lastX = b.x
          b.stuck = 0
        }
        if (b.y < b.r) {
          b.y = b.r
          b.vy = Math.abs(b.vy) * 0.65
          b.wander = Math.abs(b.wander)
        }
        if (b.y > h - b.r) {
          b.y = h - b.r
          b.vy = -Math.abs(b.vy) * 0.65
          b.wander = -Math.abs(b.wander)
        }
      }

      // Hard collision resolve
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i]
          const b = list[j]
          if (drag && (drag.id === a.id || drag.id === b.id)) continue

          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.hypot(dx, dy) || 0.001
          const minDist = a.r + b.r
          if (dist >= minDist) continue

          const nx = dx / dist
          const ny = dy / dist
          const half = (minDist - dist) * 0.5
          a.x -= nx * half
          a.y -= ny * half
          b.x += nx * half
          b.y += ny * half

          const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
          if (vn > 0) continue
          const impulse = (-(1 + 0.9) * vn) / 2
          a.vx -= impulse * nx
          a.vy -= impulse * ny
          b.vx += impulse * nx
          b.vy += impulse * ny

          flashesRef.current.push({
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2,
            r: minDist * 0.45,
            t: now,
          })
        }
      }

      paint()
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [paint, reduceMotion])

  useEffect(() => {
    paint()
  }, [bodies, paint])

  const clientToLocal = (clientX, clientY) => {
    const rect = panelRef.current.getBoundingClientRect()
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const onPointerDown = (e, id) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const body = bodiesRef.current.find((b) => b.id === id)
    if (!body) return
    const { x, y } = clientToLocal(e.clientX, e.clientY)
    dragRef.current = {
      id,
      ox: x - body.x,
      oy: y - body.y,
      px: x,
      py: y,
      pt: performance.now(),
      vx: 0,
      vy: 0,
    }
    body.vx = 0
    body.vy = 0
  }

  const onPointerMove = (e) => {
    const drag = dragRef.current
    if (!drag) return
    const body = bodiesRef.current.find((b) => b.id === drag.id)
    if (!body) return
    const { x, y } = clientToLocal(e.clientX, e.clientY)
    const now = performance.now()
    const dt = Math.max(0.008, (now - drag.pt) / 1000)
    body.x = x - drag.ox
    body.y = y - drag.oy
    drag.vx = (x - drag.px) / dt
    drag.vy = (y - drag.py) / dt
    drag.px = x
    drag.py = y
    drag.pt = now
    paint()
  }

  const onPointerUp = () => {
    const drag = dragRef.current
    if (!drag) return
    const body = bodiesRef.current.find((b) => b.id === drag.id)
    if (body) {
      body.vx = Math.max(-160, Math.min(160, drag.vx || body.cruise || 28))
      body.vy = Math.max(-100, Math.min(100, drag.vy || 0))
      body.cruise = body.vx
      body.wander = body.vy * 0.5
    }
    dragRef.current = null
  }

  return (
    <div
      ref={panelRef}
      className="relative h-full min-h-[14rem] w-full overflow-hidden sm:min-h-[16rem] md:min-h-0"
      aria-label="Draggable drifting molecular wireframes"
    >
      <svg
        ref={forceLayerRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        aria-hidden
      />

      {bodies.map((b) => (
        <div
          key={b.id}
          ref={(node) => {
            if (node) nodeRef.current.set(b.id, node)
            else nodeRef.current.delete(b.id)
          }}
          role="img"
          data-bg-drag
          aria-label={`${b.molecule.name} — drag to move`}
          tabIndex={0}
          className="absolute left-0 top-0 z-[1] cursor-grab touch-none outline-none will-change-transform active:cursor-grabbing focus-visible:ring-1 focus-visible:ring-neutral-500"
          style={{ width: b.size, height: b.size }}
          onPointerDown={(e) => onPointerDown(e, b.id)}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <MoleculeSvg molecule={b.molecule} />
        </div>
      ))}

      <div
        className="pointer-events-none absolute bottom-3 left-3 z-[2] hidden gap-x-3 font-mono text-[10px] text-neutral-600 sm:flex"
        aria-hidden
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-px w-3 border-t border-dotted border-[#A78BFA]/60" />
          H-bond
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-px w-3 border-t border-dashed border-[#4C8C8A]/60" />
          stack
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-px w-3 border-t border-dashed border-neutral-500/60" />
          weak
        </span>
      </div>
    </div>
  )
}
