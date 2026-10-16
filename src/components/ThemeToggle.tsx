import { useEffect, useState } from 'react'
import { IconMoonFilled, IconSunFilled } from '@tabler/icons-react'

type Theme = 'light' | 'dark'

const systemTheme = (): Theme => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
const savedTheme = () => document.documentElement.dataset.theme as Theme | undefined

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => savedTheme() ?? systemTheme())

  // until the visitor picks a theme, keep following the system
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const on = () => !savedTheme() && setTheme(systemTheme())
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // private mode: the choice just won't persist
    }
    setTheme(next)
  }

  const Icon = theme === 'dark' ? IconSunFilled : IconMoonFilled
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="pressable grid size-9 shrink-0 place-items-center rounded-lg text-muted transition-colors duration-150 hover:bg-fg/6 hover:text-fg"
    >
      <Icon key={theme} size={18} className="icon-in" />
    </button>
  )
}
