import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'

// TTC Line 1 yellow and the red of its trains
const LINE = '#F8C300'
const TTC_RED = '#DA251D'
/** distance from the content's left edge to the centre of the track */
const GUTTER = 38
/** how far ahead of the train the unvisited line stays clearly visible, px */
const FADE = 320

/**
 * A subway line running down the left gutter with a station at every `[data-stop]` heading inside it.
 * The train rides from the first station to the last as the page scrolls from top to bottom,
 * laying yellow line behind it and lighting each station it reaches.
 */
export function Track({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null)
  const [stops, setStops] = useState<number[]>([])

  useLayoutEffect(() => {
    const el = box.current!
    const measure = () => {
      // offsets, not client rects, so the sections' load-in transform doesn't skew the stations
      const next = [...el.querySelectorAll<HTMLElement>('[data-stop]')].map((h) => {
        let top = h.offsetHeight / 2
        for (let n: HTMLElement | null = h; n && n !== el; n = n.offsetParent as HTMLElement | null) top += n.offsetTop
        return Math.round(top)
      })
      setStops((prev) => (prev.join() === next.join() ? prev : next))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const first = stops[0] ?? 0
  const last = stops.at(-1) ?? 0
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [first, last])

  // how many stations the train has reached
  const reachedAt = (at: number) => stops.filter((cy) => cy <= at + 1).length
  const [scrolledTo, setScrolledTo] = useState<number | null>(null)
  // the line ahead of the train fades out with distance, like the edges of the map
  const fade = useRef<SVGLinearGradientElement>(null)
  const aimFade = (at: number) => {
    fade.current?.setAttribute('y1', `${at}`)
    fade.current?.setAttribute('y2', `${at + FADE}`)
  }
  useMotionValueEvent(y, 'change', (at) => {
    setScrolledTo(reachedAt(at))
    aimFade(at)
  })
  useLayoutEffect(() => aimFade(y.get()))
  const reached = scrolledTo ?? reachedAt(y.get())

  return (
    <div ref={box} className="relative">
      {stops.length > 1 && (
        <svg
          aria-hidden
          width={24}
          className="pointer-events-none absolute top-0 hidden h-full overflow-visible min-[720px]:block"
          style={{ left: -GUTTER - 12 }}
        >
          <defs>
            <linearGradient ref={fade} id="track-ahead" gradientUnits="userSpaceOnUse" x1={0} x2={0}>
              <stop offset="0" stopColor="currentColor" stopOpacity={0.28} />
              <stop offset="1" stopColor="currentColor" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <line x1={12} x2={12} y1={first} y2={last} stroke="url(#track-ahead)" strokeWidth={6} strokeLinecap="round" className="text-fg" />
          <motion.line x1={12} x2={12} y1={first} y2={y} stroke={LINE} strokeWidth={6} strokeLinecap="round" />
          {stops.map((cy, i) => {
            const on = i < reached
            return (
              <g key={cy}>
                <circle cx={12} cy={cy} r={6.5} strokeWidth={3} className={`fill-bg transition-[stroke] duration-300 ${on ? 'stroke-fg' : 'stroke-fg/25'}`} />
                <circle cx={12} cy={cy} r={2} className={`transition-[fill] duration-300 ${on ? 'fill-fg' : 'fill-fg/25'}`} />
              </g>
            )
          })}
          <motion.g style={{ y }}>
            {/* a train seen from above, heading down the line */}
            <rect x={5.5} y={-15} width={13} height={30} rx={4.5} fill={TTC_RED} className="stroke-bg" strokeWidth={2} />
            <rect x={8} y={-10.5} width={8} height={13} rx={1.5} fill="#fff" />
            <rect x={8} y={5.5} width={8} height={5} rx={1.5} fill="#1c1c1c" />
          </motion.g>
        </svg>
      )}
      {children}
    </div>
  )
}
