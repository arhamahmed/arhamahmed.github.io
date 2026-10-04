import { useEffect, useRef, type RefObject } from 'react'
import { useMotionValue, useSpring, useMotionValueEvent, useReducedMotion, type MotionValue } from 'motion/react'
import { IconPlaneFilled } from '@tabler/icons-react'
import type { ExperienceEntry } from '../config'
import { Logo } from './Logo'

type Props = { jobs: ExperienceEntry[] /** oldest → newest */ }

/** Smooth S-curve through points that alternate sides; `axis` is the direction of travel. */
function curve(pts: [number, number][], axis: 'x' | 'y') {
  return pts
    .map(([x, y], i) => {
      if (i === 0) return `M${x} ${y}`
      const [px, py] = pts[i - 1]
      const k = axis === 'y' ? (y - py) / 2 : (x - px) / 2
      return axis === 'y' ? `C${px} ${py + k} ${x} ${y - k} ${x} ${y}` : `C${px + k} ${py} ${x - k} ${y} ${x} ${y}`
    })
    .join('')
}

/** Moves the plane along `path` as `progress` (0..1) changes; heading follows the tangent. */
function usePlane(progress: MotionValue<number>) {
  const reduced = useReducedMotion()
  const path = useRef<SVGPathElement>(null)
  const plane = useRef<SVGGElement>(null)
  const smooth = useSpring(progress, { stiffness: 80, damping: 20, mass: 0.6 })
  useMotionValueEvent(reduced ? progress : smooth, 'change', (t) => {
    const p = path.current, g = plane.current
    if (!p || !g) return
    const L = p.getTotalLength(), l = Math.min(Math.max(t, 0), 1) * L
    const a = p.getPointAtLength(Math.max(l - 1, 0)), b = p.getPointAtLength(Math.min(l + 1, L)), c = p.getPointAtLength(l)
    const deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
    g.setAttribute('transform', `translate(${c.x} ${c.y}) rotate(${deg + 45})`)
  })
  return { path, plane }
}

function Plane({ r }: { r: RefObject<SVGGElement | null> }) {
  return (
    <g ref={r}>
      <circle r={11} className="fill-bg" />
      <IconPlaneFilled x={-9} y={-9} size={18} className="text-fg" />
    </g>
  )
}

function Label({ j, align }: { j: ExperienceEntry; align: 'left' | 'right' | 'center' }) {
  const now = j.end === 'Present'
  const row = align === 'right' ? 'flex-row-reverse' : align === 'center' ? 'justify-center' : ''
  return (
    <div className={align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : ''}>
      <div className={`flex items-center gap-1.5 font-medium ${row}`}>
        <Logo domain={j.domain} alt="" size={14} />
        {j.company}
      </div>
      <div className="text-sm text-muted">{j.role}</div>
      <div className="text-[13px] text-muted tabular-nums">
        {j.start === j.end ? j.start : <>{j.start} – {now ? <b className="font-medium text-red-500">Present</b> : j.end}</>} · {j.city}
      </div>
    </div>
  )
}

// ─── 1. vertical ───────────────────────────────────────────────────────────────

const ROW = 128, W = 600, XL = 215, XR = W - 215, GAP = 22

export function WindingPathVertical({ jobs }: Props) {
  const n = jobs.length, H = ROW * n
  const pts = jobs.map((_, i) => [i % 2 ? XR : XL, ROW * i + ROW / 2] as [number, number])
  const progress = useMotionValue(0)
  const { path, plane } = usePlane(progress)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const r = box.current!.getBoundingClientRect()
      // the plane tracks the viewport centre line
      progress.set((innerHeight / 2 - r.top - ROW / 2) / (r.height - ROW))
    }
    update()
    addEventListener('scroll', update, { passive: true })
    return () => removeEventListener('scroll', update)
  }, [progress])

  return (
    <div ref={box} className="relative" style={{ height: H }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible">
        <path ref={path} d={curve(pts, 'y')} className="fill-none stroke-muted/70" strokeWidth={1.25} strokeDasharray="4 4" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={4} className={jobs[i].end === 'Present' ? 'fill-red-500' : 'fill-fg'} />
        ))}
        <Plane r={plane} />
      </svg>
      {jobs.map((j, i) => (
        <div
          key={i}
          className="absolute -translate-y-1/2"
          style={{ top: ROW * i + ROW / 2, width: XL - GAP, [i % 2 ? 'left' : 'right']: W - XL + GAP }}
        >
          <Label j={j} align={i % 2 ? 'left' : 'right'} />
        </div>
      ))}
    </div>
  )
}

// ─── 2. horizontal ─────────────────────────────────────────────────────────────

const COL = 190, HH = 150, YT = 45, YB = HH - 45, PAD = 90

export function WindingPathHorizontal({ jobs }: Props) {
  const n = jobs.length, WW = COL * n
  const pts = jobs.map((_, i) => [COL * i + COL / 2, i % 2 ? YB : YT] as [number, number])
  const progress = useMotionValue(0)
  const { path, plane } = usePlane(progress)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scroller.current!
    const update = () => progress.set(el.scrollLeft / (el.scrollWidth - el.clientWidth))
    update()
    el.addEventListener('scroll', update, { passive: true })
    return () => el.removeEventListener('scroll', update)
  }, [progress])

  return (
    <div ref={scroller} className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative" style={{ width: WW, height: HH + 2 * PAD }}>
        <svg viewBox={`0 0 ${WW} ${HH}`} width={WW} height={HH} className="absolute inset-x-0 overflow-visible" style={{ top: PAD }}>
          <path ref={path} d={curve(pts, 'x')} className="fill-none stroke-muted/70" strokeWidth={1.25} strokeDasharray="4 4" />
          {pts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4} className={jobs[i].end === 'Present' ? 'fill-red-500' : 'fill-fg'} />
          ))}
          <Plane r={plane} />
        </svg>
        {jobs.map((j, i) => (
          <div
            key={i}
            className="absolute w-[170px]"
            style={{ left: COL * i + 10, ...(i % 2 ? { top: PAD + YB + 16 } : { bottom: HH + PAD - YT + 16 }) }}
          >
            <Label j={j} align="center" />
          </div>
        ))}
      </div>
    </div>
  )
}
