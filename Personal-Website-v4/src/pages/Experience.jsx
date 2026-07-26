import { useEffect, useRef, useState } from 'react'
import { courses, education, gpa, jobs, research } from '../data/experience'

const sections = [
  { id: 'education', label: 'Education' },
  { id: 'research', label: 'Research' },
  { id: 'professional', label: 'Professional' },
  { id: 'coursework', label: 'Course Work' },
]

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-8 border-b border-neutral-800/80 py-10 last:border-b-0">
      <h2 className="mb-2 text-2xl font-medium tracking-tight text-neutral-100 md:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Entry({ title, meta, children }) {
  return (
    <article className="py-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className="text-lg text-neutral-100">{title}</h3>
        {meta ? (
          <p className="shrink-0 text-sm text-neutral-500">{meta}</p>
        ) : null}
      </div>
      <div className="mt-3 text-[15px] leading-relaxed text-neutral-300">{children}</div>
    </article>
  )
}

function SectionNav({ activeId, onNavigate }) {
  return (
    <nav aria-label="Experience sections">
      <ul className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:gap-0 md:overflow-visible md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map(({ id, label }) => {
          const active = activeId === id
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onNavigate(id)}
                className={`block min-h-11 shrink-0 border-b-2 px-3 py-2 text-left text-sm transition-colors md:min-h-0 md:w-full md:border-b-0 md:border-l-2 md:px-3 md:py-2 ${
                  active
                    ? 'border-[var(--accent-teal)] text-neutral-100'
                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default function Experience() {
  const [activeId, setActiveId] = useState(sections[0].id)
  const mainRef = useRef(null)

  const byCategory = courses.reduce((acc, course) => {
    ;(acc[course.category] ??= []).push(course)
    return acc
  }, {})

  useEffect(() => {
    const root = mainRef.current
    if (!root) return

    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id)
      },
      { root, rootMargin: '-10% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function navigate(id) {
    const el = document.getElementById(id)
    if (!el) return
    setActiveId(id)
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="page flex min-h-0 flex-col md:flex-row">
      <aside className="z-10 shrink-0 border-b border-neutral-800/60 bg-[var(--bg)] px-4 py-3 sm:px-6 md:flex md:w-44 md:border-b-0 md:border-r md:border-neutral-800/60 md:px-6 md:py-12">
        <SectionNav activeId={activeId} onNavigate={navigate} />
      </aside>

      <div ref={mainRef} className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 md:py-12">
          <h1 className="mb-2 text-3xl font-medium tracking-tight text-neutral-100 md:text-4xl">
            Experience
          </h1>
          <p className="mb-4 max-w-xl text-[15px] leading-relaxed text-neutral-400">
            Education, research, industry work, and coursework.
          </p>

          <Section id="education" title="Education">
            <p className="mb-2 text-[15px] text-neutral-400">Where I studied and what I focused on.</p>
            {education.map((item) => (
              <Entry key={item.name} title={item.name} meta={item.year}>
                <p>{item.description}</p>
              </Entry>
            ))}
          </Section>

          <Section id="research" title="Research">
            <p className="mb-2 text-[15px] text-neutral-400">Labs and what I worked on.</p>
            {research.map((lab) => (
              <Entry key={lab.name} title={lab.name}>
                <ul className="list-disc space-y-2 pl-5">
                  {lab.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </Entry>
            ))}
          </Section>

          <Section id="professional" title="Professional">
            <p className="mb-2 text-[15px] text-neutral-400">Internships and applied engineering.</p>
            {jobs.map((job) => (
              <Entry
                key={job.name}
                title={`${job.position} · ${job.name}`}
                meta={job.date}
              >
                <ul className="list-disc space-y-2 pl-5">
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </Entry>
            ))}
          </Section>

          <Section id="coursework" title="Course Work">
            <p className="mb-4 text-[15px] text-neutral-400">
              Selected courses. Currently enrolled marked with ›. Cumulative GPA:{' '}
              <span className="text-neutral-200">{gpa}</span>
            </p>
            <div className="space-y-8">
              {Object.entries(byCategory).map(([category, list]) => (
                <div key={category}>
                  <h3 className="mb-3 text-sm uppercase tracking-wider text-neutral-500">
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {list.map((c) => (
                      <li
                        key={c.code}
                        className={`flex flex-wrap gap-x-3 gap-y-1 text-[15px] ${
                          c.active ? 'text-neutral-100' : 'text-neutral-400'
                        }`}
                      >
                        <span className="w-4 shrink-0 text-neutral-500">
                          {c.active ? '›' : ''}
                        </span>
                        <span className="w-24 shrink-0 tabular-nums sm:w-28">{c.code}</span>
                        <span className="min-w-0 flex-1">{c.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </main>
  )
}
