import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react'
import type { ExperienceEntry } from '../config'
import { AIRPORTS, LAND, MAP, project } from './geo'
import { EASE_IN_OUT } from '../motion'
import { Logo } from './Logo'

type Props = { jobs: ExperienceEntry[] /** newest first */ }
type Pt = [number, number]

// west-coast pins label out to sea; the rest label inland to the east
const WEST = new Set(['SEA', 'SJC'])

const land = LAND.map((row, r) =>
  [...row].map((c, i) => (c === 'o' ? `M${(i + 0.5) * MAP.step} ${(r + 0.5) * MAP.step}h0` : '')).join(''),
).join('')

/** Control point for an arc from a to b that bows north, or out to sea when the leg runs north–south. */
function bow(a: Pt, b: Pt): Pt {
  const dx = b[0] - a[0], dy = b[1] - a[1]
  const side = dy - dx > 0 ? 1 : -1
  return [(a[0] + b[0]) / 2 - side * dy * 0.22, (a[1] + b[1]) / 2 + side * dx * 0.22]
}

/** Point and heading (degrees) at t along the quadratic a → c → b. */
function along(a: Pt, c: Pt, b: Pt, t: number) {
  const u = 1 - t
  const x = u * u * a[0] + 2 * u * t * c[0] + t * t * b[0]
  const y = u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]
  const tx = u * (c[0] - a[0]) + t * (b[0] - c[0])
  const ty = u * (c[1] - a[1]) + t * (b[1] - c[1])
  return { x, y, deg: (Math.atan2(ty, tx) * 180) / Math.PI }
}

function useWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(MAP.w)
  useLayoutEffect(() => {
    const el = ref.current!
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

export function ExperienceMap({ jobs: newestFirst }: Props) {
  const reduced = useReducedMotion()
  const [box, width] = useWidth()
  const s = width / MAP.w
  const height = MAP.h * s

  // jobs run oldest → newest; stops are airports in the order he first landed there
  const { jobs, stops, stopOf } = useMemo(() => {
    const jobs = [...newestFirst].reverse()
    const stops: { code: string; jobs: number[] }[] = []
    const stopOf = jobs.map((j, i) => {
      if (stops.at(-1)?.code !== j.airport) stops.push({ code: j.airport, jobs: [] })
      stops.at(-1)!.jobs.push(i)
      return stops.length - 1
    })
    return { jobs, stops, stopOf }
  }, [newestFirst])
  const last = stops.length - 1

  const pts = stops.map(({ code }) => project(AIRPORTS[code]).map((v) => v * s) as Pt)
  const legs = pts.slice(1).map((b, i) => ({ a: pts[i], c: bow(pts[i], b), b }))

  const [selected, setSelected] = useState(jobs.length - 1)
  const [landed, setLanded] = useState({ stop: -1, n: 0 })
  // position along the route in stops: 1.5 is halfway through the second leg
  const pos = useMotionValue(reduced ? last : 0)
  const plane = useRef<SVGGElement>(null)
  const flown = useRef<(SVGPathElement | null)[]>([])
  const strip = useRef<HTMLDivElement>(null)
  const run = useRef(0)

  const draw = (p: number) => {
    const i = Math.min(Math.floor(p), legs.length - 1)
    const { a, c, b } = legs[i]
    const { x, y, deg } = along(a, c, b, p - i)
    plane.current?.setAttribute('transform', `translate(${x} ${y}) rotate(${deg + 45})`)
    flown.current.forEach((el, k) => el?.setAttribute('stroke-dasharray', `${Math.min(Math.max(p - k, 0), 1)} 2`))
  }
  useMotionValueEvent(pos, 'change', draw)
  useLayoutEffect(() => draw(pos.get()))

  /**
   * The intro is a single eased sweep. Flights the visitor triggers are springs, so sweeping across
   * the logos redirects the plane at its current speed instead of restarting it from a standstill.
   */
  const flyTo = async (to: number, intro = false) => {
    const id = ++run.current
    const legsToFly = Math.abs(to - pos.get())
    if (reduced || legsToFly < 0.01) pos.jump(to)
    else if (intro) await animate(pos, to, { duration: 2.2, ease: EASE_IN_OUT })
    else await animate(pos, to, { type: 'spring', duration: 0.45 + 0.15 * legsToFly, bounce: 0 })
    if (id === run.current) setLanded((l) => ({ stop: to, n: l.n + 1 }))
  }

  // the first time the map scrolls into view, fly the whole route once; nothing waits on it
  const inView = useInView(box, { once: true, amount: 0.8 })
  useEffect(() => {
    if (inView && !reduced && !run.current) flyTo(last, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  const select = (i: number) => {
    if (i === selected && run.current) return
    setSelected(i)
    flyTo(stopOf[i])
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = Math.min(Math.max(selected + step, 0), jobs.length - 1)
    strip.current?.querySelectorAll('button')[next]?.focus()
  }

  const job = jobs[selected]

  return (
    <div>
      <div ref={strip} onKeyDown={onKeyDown} className="flex justify-center gap-3 sm:gap-4">
        {stops.map((stop, k) => {
          const on = stopOf[selected] === k
          return (
            <div key={k}>
              <div className="flex gap-0.5">
                {stop.jobs.map((i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${jobs[i].company}, ${jobs[i].role}`}
                    aria-pressed={i === selected}
                    tabIndex={i === selected ? 0 : -1}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && select(i)}
                    onFocus={() => select(i)}
                    onClick={() => select(i)}
                    className="pressable relative grid size-9 place-items-center rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-fg/40 sm:size-12 sm:rounded-xl"
                  >
                    {i === selected && (
                      <motion.span
                        layoutId="selected-logo"
                        className="absolute inset-0 rounded-[inherit] bg-fg/8"
                        transition={reduced ? { duration: 0 } : { type: 'spring', duration: 0.3, bounce: 0 }}
                      />
                    )}
                    <Logo domain={jobs[i].domain} alt="" size={20} className="relative sm:size-7" />
                  </button>
                ))}
              </div>
              <div className={`mx-1.5 mt-1.5 border-t pt-1 text-center text-[10px] font-medium tracking-[0.08em] transition-colors duration-200 ${on ? 'border-fg/50 text-fg' : 'border-fg/15 text-muted'}`}>
                {stop.code}
              </div>
            </div>
          )
        })}
      </div>

      <div key={selected} aria-live="polite" className="fade-in mt-5 text-center">
        <div className="text-lg font-medium tracking-tight">{job.company}</div>
        <div className="text-sm text-muted">
          <span className="block sm:inline">{job.role}</span>
          <span className="mx-1.5 hidden text-fg/25 sm:inline">·</span>
          <span className="whitespace-nowrap">{job.start === job.end ? job.start : `${job.start} – ${job.end}`}</span>
          <span className="mx-1.5 text-fg/25">·</span>
          <span className="whitespace-nowrap">{job.city}</span>
        </div>
        <p className="mt-1.5 text-sm">{job.summary}</p>
      </div>

      <div ref={box} className="mt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="block w-full overflow-visible" aria-hidden>
          <defs>
            <radialGradient id="land-fade" cx="50%" cy="45%" r="60%">
              <stop offset="45%" stopColor="#fff" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="land-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
              <rect width={width} height={height} fill="url(#land-fade)" />
            </mask>
          </defs>
          <g mask="url(#land-mask)">
            <path d={land} transform={`scale(${s})`} className="fill-none stroke-fg/20" strokeWidth={2} strokeLinecap="round" />
          </g>

          {legs.map(({ a, c, b }, i) => {
            const d = `M${a[0]} ${a[1]}Q${c[0]} ${c[1]} ${b[0]} ${b[1]}`
            return (
              <g key={i} className="fill-none">
                <path d={d} className="stroke-bg" strokeWidth={5} />
                <path d={d} className="stroke-muted" strokeWidth={1.25} strokeDasharray="0.1 4.5" strokeLinecap="round" />
                <path ref={(el) => { flown.current[i] = el }} d={d} pathLength={1} className="stroke-fg" strokeWidth={1.25} strokeDasharray="0 2" />
              </g>
            )
          })}

          {landed.stop >= 0 && (
            <circle key={landed.n} cx={pts[landed.stop][0]} cy={pts[landed.stop][1]} r={4} className="pin-ping fill-none stroke-fg" strokeWidth={1.25} />
          )}
          {pts.map(([x, y], i) => {
            const on = stopOf[selected] === i
            const west = WEST.has(stops[i].code)
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={3.5} strokeWidth={1.5} className={`stroke-fg transition-[fill] duration-200 ${on ? 'fill-fg' : 'fill-bg'}`} />
                <text
                  x={x + (west ? -12 : 12)}
                  y={y + 3.5}
                  textAnchor={west ? 'end' : 'start'}
                  className={`stroke-bg text-[10px] font-medium tracking-[0.08em] transition-[fill] duration-200 [paint-order:stroke] ${on ? 'fill-fg' : 'fill-muted'}`}
                  strokeWidth={4}
                  strokeLinejoin="round"
                >
                  {stops[i].code}
                </text>
              </g>
            )
          })}

          {/* the emoji's nose points up and to the right, hence the extra 45° in draw() */}
          <g ref={plane}>
            <text textAnchor="middle" dominantBaseline="central" fontSize={18} style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}>
              ✈️
            </text>
          </g>

          {/* pins are a shortcut to the latest job at that stop; hit areas sit above the plane */}
          {pts.map(([x, y], i) => {
            const nearest = Math.min(...pts.map(([px, py], k) => (k === i ? Infinity : Math.hypot(px - x, py - y))))
            const west = WEST.has(stops[i].code)
            const r = Math.min(18, nearest / 2)
            const latest = stops[i].jobs.at(-1)!
            const pick = () => stopOf[selected] !== i && select(latest)
            return (
              <g key={i} onPointerEnter={(e) => e.pointerType === 'mouse' && pick()} onClick={pick} className="cursor-pointer">
                <circle cx={x} cy={y} r={r} fill="transparent" />
                <rect x={west ? x - 44 : x} y={y - r} width={44} height={r * 2} fill="transparent" />
              </g>
            )
          })}
        </svg>
      </div>

    </div>
  )
}
