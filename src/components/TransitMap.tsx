type Station = { name: string; years: string }

const W = 600, H = 96, Y = 58, X0 = 36, X1 = W - 36

export function TransitMap({ stations }: { stations: Station[] }) {
  const step = (X1 - X0) / Math.max(stations.length - 1, 1)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`Line: ${stations.map((s) => s.name).join(', ')}`}>
      <line x1={X0} y1={Y} x2={X1} y2={Y} stroke="#F8C300" strokeWidth={10} strokeLinecap="round" />
      {stations.map((s, i) => {
        const x = X0 + i * step
        const anchor = i === 0 ? 'start' : i === stations.length - 1 ? 'end' : 'middle'
        const tx = i === 0 ? x - 10 : i === stations.length - 1 ? x + 10 : x
        const last = i === stations.length - 1
        return (
          <g key={s.name}>
            <circle cx={x} cy={Y} r={last ? 9 : 7} className="fill-bg stroke-fg" strokeWidth={3} />
            {last && <circle cx={x} cy={Y} r={3} className="fill-fg" />}
            <text x={tx} y={Y - 22} textAnchor={anchor} className="fill-fg text-[12px] font-semibold">
              {s.name}
            </text>
            <text x={tx} y={Y + 28} textAnchor={anchor} className="fill-muted text-[10px] tabular-nums">
              {s.years}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
