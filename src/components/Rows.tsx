import { useState, type ReactNode, type Ref } from 'react'
import { IconArrowUpRight, IconChevronDown, IconPinFilled } from '@tabler/icons-react'

type RowProps = {
  title: string
  date: ReactNode
  sub: string
  href?: string
  pinned?: boolean
  /** shown to the left of the row, e.g. a logo */
  icon?: ReactNode
  ref?: Ref<HTMLLIElement>
}

export function Row({ title, date, sub, href, pinned, icon, ref }: RowProps) {
  const words = title.split(' ')
  const head = words.slice(0, -1).join(' ')
  const last = words.at(-1)
  return (
    <li ref={ref} className="group -mx-2.5 flex items-center gap-3 rounded-md px-2.5 py-2 transition-colors duration-150 hover:bg-fg/4">
      {icon}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-medium">
            {href ? (
              <a href={href} target="_blank" rel="noopener">
                {head}{head && ' '}
                <span className="whitespace-nowrap">
                  {last}
                  <IconArrowUpRight
                    size={14}
                    stroke={2}
                    className="ml-0.5 inline -translate-y-px text-muted transition-transform duration-150 [transition-timing-function:var(--ease-out)] [@media(hover:hover)]:group-hover:translate-x-px [@media(hover:hover)]:group-hover:-translate-y-0.5"
                  />
                </span>
              </a>
            ) : (
              title
            )}
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-muted">
            {pinned && <IconPinFilled size={12} className="text-red-500" />}
            {date}
          </span>
        </div>
        <div className="text-sm text-muted">{sub}</div>
      </div>
    </li>
  )
}

export function Section({ title, delay = 0, children }: { title: string; /** load-in stagger, ms */ delay?: number; children: ReactNode }) {
  return (
    <section className="rise-in mt-9" style={{ animationDelay: `${delay}ms` }}>
      <h2 data-stop className="mb-1.5 text-[13px] font-medium text-muted">{title}</h2>
      {children}
    </section>
  )
}

export function ShowMore({ count, children }: { count: number; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open && children}
      <li>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="pressable mx-auto mt-1.5 flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted transition-colors duration-150 hover:bg-fg/4 hover:text-fg"
        >
          {open ? 'Show fewer' : `Show ${count} more`}
          <IconChevronDown size={14} className={`transition-transform duration-200 [transition-timing-function:var(--ease-out)] ${open ? 'rotate-180' : ''}`} />
        </button>
      </li>
    </>
  )
}
