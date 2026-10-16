const CLOUD = 'M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-12'

type Kind = 'sun' | 'moon' | 'partly' | 'cloud' | 'fog' | 'rain' | 'snow' | 'storm'

/** WMO weather code (as returned by Open-Meteo) → which icon to draw. */
function kindOf(code: number, isDay: boolean): Kind {
  if (code >= 95) return 'storm'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow'
  if (code >= 51) return 'rain'
  if (code === 45 || code === 48) return 'fog'
  if (code === 3) return 'cloud'
  if (code === 0) return isDay ? 'sun' : 'moon'
  return isDay ? 'partly' : code === 1 ? 'moon' : 'cloud'
}

const LABEL: Record<Kind, string> = {
  sun: 'Clear', moon: 'Clear', partly: 'Partly cloudy', cloud: 'Cloudy', fog: 'Foggy', rain: 'Rain', snow: 'Snow', storm: 'Thunderstorm',
}

const Sun = () => (
  <g className="text-amber-500" stroke="currentColor">
    <path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <path className="wx-spin" d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
  </g>
)

/** A small animated weather glyph, drawn in the current text colour. */
export function WeatherIcon({ code, isDay, size = 15 }: { code: number; isDay: boolean; size?: number }) {
  const kind = kindOf(code, isDay)
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" role="img" aria-label={LABEL[kind]} className="shrink-0 overflow-visible">
      {kind === 'sun' && <Sun />}
      {kind === 'moon' && <path className="wx-rock" d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008" />}
      {kind === 'partly' && (
        <>
          <g transform="translate(9.5 -2) scale(0.62)"><Sun /></g>
          <path className="wx-drift fill-bg" d={CLOUD} transform="translate(-1 3)" />
        </>
      )}
      {kind === 'cloud' && <path className="wx-drift" d={CLOUD} transform="translate(0 -1)" />}
      {kind === 'fog' && (
        <>
          <path className="wx-drift" d="M5 5h3m4 0h9M5 15h5m4 0h7" />
          <path className="wx-drift wx-late" d="M3 10h11m4 0h1M3 20h9m4 0h3" />
        </>
      )}
      {(kind === 'rain' || kind === 'snow' || kind === 'storm') && <path d={CLOUD.replace('h-12', '')} transform="translate(0 -3)" />}
      {kind === 'rain' && (
        <>
          <path className="wx-fall" d="M10 15v3" />
          <path className="wx-fall wx-late" d="M14 15v3" />
        </>
      )}
      {kind === 'snow' && (
        <>
          <path className="wx-fall wx-slow" d="M10 16v.01" />
          <path className="wx-fall wx-slow wx-late" d="M14 16v.01" />
        </>
      )}
      {kind === 'storm' && <path className="wx-flash text-amber-500" stroke="currentColor" d="M13 13l-2 4l3 0l-2 4" />}
    </svg>
  )
}
