import { IconBrandGithubFilled, IconFileTextFilled, IconMailFilled } from '@tabler/icons-react'
import { config } from '../config'
import { LocalInfo } from './LocalInfo'
import { ThemeToggle } from './ThemeToggle'

/** LinkedIn's official mark; Tabler's redraw doesn't read as LinkedIn at this size. */
function LinkedInMark({ size }: { size: number }) {
  // the mark fills its box edge to edge, where Tabler icons leave 2/24 padding
  const px = (size * 20) / 24
  return (
    <svg viewBox="0 0 24 24" width={px} height={px} fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

// GitHub's mark is monochrome, so it follows the theme; email and resume have no brand of their own
const links = [
  { label: 'GitHub', href: config.links.github, Icon: IconBrandGithubFilled, color: 'text-fg' },
  { label: 'LinkedIn', href: config.links.linkedin, Icon: LinkedInMark, color: 'text-[#0a66c2]' },
  { label: 'Email', href: config.links.email, Icon: IconMailFilled, color: 'text-[#ea4335]' },
  { label: 'Resume', href: config.links.resume, Icon: IconFileTextFilled, color: 'text-fg' },
]

export function Header() {
  const current = config.experience[0]
  return (
    <header className="rise-in flex gap-4">
      <img
        src="/avatar.jpg"
        alt=""
        width={60}
        height={60}
        className="size-15 shrink-0 rounded-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
      />
      <div className="min-w-0 flex-1">
        <h1 className="text-[22px] leading-7 font-bold tracking-tight">{config.name}</h1>
        <p className="text-muted">
          {current.role} @ {current.company}
        </p>
        <p className="flex items-center text-sm text-muted">
          {config.location}
          <span className="mx-1.5 text-fg/25">·</span>
          <LocalInfo />
        </p>
        <p className="mt-2 text-sm text-muted italic">“{config.quote}”</p>
        <nav className="mt-3 -ml-2 flex gap-0.5">
          {links.map(({ label, href, Icon, color }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              title={label}
              {...(href.startsWith('http') || href.endsWith('.pdf') ? { target: '_blank', rel: 'noopener' } : {})}
              className={`pressable grid size-9 place-items-center rounded-lg transition-colors duration-150 hover:bg-fg/6 ${color}`}
            >
              <Icon size={18} />
            </a>
          ))}
        </nav>
      </div>
      <ThemeToggle />
    </header>
  )
}
