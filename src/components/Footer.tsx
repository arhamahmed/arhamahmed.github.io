import { config } from '../config'

const links = [
  { label: 'GitHub', href: config.links.github },
  { label: 'LinkedIn', href: config.links.linkedin },
  { label: 'Email', href: config.links.email },
  { label: 'Resume', href: config.links.resume },
]

export function Footer({ delay = 0 }: { delay?: number }) {
  return (
    <footer
      className="rise-in mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-fg/10 pt-5 text-sm text-muted"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span>Updated {config.updated}</span>
      <nav className="flex gap-4">
        {links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            {...(href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener' })}
            className="transition-colors duration-150 hover:text-fg"
          >
            {label}
          </a>
        ))}
      </nav>
    </footer>
  )
}
