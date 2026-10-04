import { config, type Project } from './config'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { ExperienceMap } from './components/ExperienceMap'
import { Logo } from './components/Logo'
import { Row, Section, ShowMore } from './components/Rows'
import { Track } from './components/Track'

const pinned = config.projects.filter((p) => p.pinned)
const rest = config.projects.filter((p) => !p.pinned)
const projectRow = (p: Project) => <Row key={p.href} title={p.title} date={p.year ?? ''} sub={p.description} href={p.href} />

export default function App() {
  return (
    <main className="mx-auto max-w-[600px] px-5 pt-18 pb-16">
      <Header />
      <Track>
        <Section title="Experience" delay={60}>
          <ExperienceMap jobs={config.experience} />
        </Section>
        <Section title="Education" delay={120}>
          <ul>
            {config.education.map((e) => (
              <Row key={e.school} title={e.school} date={`${e.start} – ${e.end}`} sub={e.degree} icon={<Logo domain={e.domain} alt="" size={28} className="shrink-0" />} />
            ))}
          </ul>
        </Section>
        <Section title="Published Articles" delay={180}>
          <ul>
            {config.writing.map((p) => (
              <Row key={p.href} title={p.title} date={p.year} sub={p.venue} href={p.href} icon={<Logo domain={p.domain} alt="" size={28} className="shrink-0" />} />
            ))}
          </ul>
        </Section>
        <Section title="Projects" delay={240}>
          <ul>
            {pinned.map(projectRow)}
            {rest.length > 0 && <ShowMore count={rest.length}>{rest.map(projectRow)}</ShowMore>}
          </ul>
        </Section>
      </Track>
      <Footer delay={300} />
    </main>
  )
}
