import { useMemo, useState } from 'react'
import { categories, projects } from '../data/projects'

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? null)

  const filtered = useMemo(() => {
    if (filter === 'All') return projects
    return projects.filter((p) => p.tags.includes(filter))
  }, [filter])

  const selected =
    filtered.find((p) => p.slug === selectedSlug) ?? filtered[0] ?? null

  function chooseFilter(next) {
    setFilter(next)
    const nextList =
      next === 'All' ? projects : projects.filter((p) => p.tags.includes(next))
    setSelectedSlug(nextList[0]?.slug ?? null)
  }

  return (
    <main className="page overflow-y-auto">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 md:py-12">
        <header>
          <h1 className="mb-2 text-3xl font-medium tracking-tight text-neutral-100 md:text-4xl">
            Projects
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-neutral-400">
            Selected work across software, ML, chemistry, and systems.
          </p>
        </header>

        <div
          className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Project categories"
        >
          {categories.map((cat) => {
            const active = filter === cat
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => chooseFilter(cat)}
                className={`min-h-11 shrink-0 snap-start border-b-2 px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'border-neutral-200 text-neutral-100'
                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <ul className="flex max-h-64 flex-col gap-1 overflow-y-auto border border-neutral-800/80 p-2 lg:max-h-none lg:w-72 lg:shrink-0 lg:border-0 lg:p-0">
            {filtered.map((project) => {
              const active = selected?.slug === project.slug
              return (
                <li key={project.slug}>
                  <button
                    type="button"
                    onClick={() => setSelectedSlug(project.slug)}
                    className={`flex min-h-11 w-full items-center px-3 py-2 text-left text-[15px] transition-colors ${
                      active
                        ? 'bg-neutral-300 text-neutral-900'
                        : 'text-neutral-300 hover:bg-neutral-900 hover:text-neutral-100'
                    }`}
                  >
                    {project.name}
                  </button>
                </li>
              )
            })}
          </ul>

          {selected ? (
            <article className="min-w-0 flex-1">
              <h2 className="text-2xl font-medium tracking-tight text-neutral-100">
                {selected.name}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-neutral-300">
                {selected.description}
              </p>

              {selected.skills?.length ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {selected.skills.map((skill) => (
                    <li
                      key={skill}
                      className="border border-neutral-700 px-2 py-1 text-xs text-neutral-400"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : null}

              {selected.image ? (
                <img
                  src={selected.image}
                  alt={`${selected.name} demo`}
                  className="mt-6 max-h-[28rem] w-full object-contain object-left"
                />
              ) : null}
            </article>
          ) : (
            <p className="text-neutral-500">No projects in this category.</p>
          )}
        </div>
      </div>
    </main>
  )
}
