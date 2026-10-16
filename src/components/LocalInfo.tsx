import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { config } from '../config'
import { EASE_OUT } from '../motion'
import { WeatherIcon } from './WeatherIcon'

type Weather = { temp: number; code: number; isDay: boolean }

const clock = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: config.timezone })
/** His local time; once the weather there has loaded, clicking swaps between the two. */
export function LocalInfo() {
  const reduced = useReducedMotion()
  const [time, setTime] = useState(() => clock.format(new Date()))
  const [weather, setWeather] = useState<Weather | null>(null)
  const [showWeather, setShowWeather] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setTime(clock.format(new Date())), 15_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const [latitude, longitude] = config.coords
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit`
    const ctl = new AbortController()
    fetch(url, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(({ current: c }) => setWeather({ temp: Math.round(c.temperature_2m), code: c.weather_code, isDay: c.is_day === 1 }))
      .catch(() => {}) // no weather: the time just stays up
    return () => ctl.abort()
  }, [])

  const shift = reduced ? 0 : 7
  return (
    <button
      type="button"
      disabled={!weather}
      onClick={() => setShowWeather((v) => !v)}
      aria-label={showWeather ? 'Show his local time' : 'Show the weather where he is'}
      className="relative inline-flex h-5 items-center transition-colors duration-150 enabled:cursor-pointer enabled:hover:text-fg"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={showWeather && weather ? 'weather' : 'time'}
          className="inline-flex items-center gap-1.5 whitespace-nowrap tabular-nums"
          initial={{ opacity: 0, transform: `translateY(${shift}px)`, filter: 'blur(2px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' }}
          exit={{ opacity: 0, transform: `translateY(${-shift}px)`, filter: 'blur(2px)' }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          {showWeather && weather ? (
            <>
              <WeatherIcon code={weather.code} isDay={weather.isDay} />
              {weather.temp}°F
            </>
          ) : (
            time
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
