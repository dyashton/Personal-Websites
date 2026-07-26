import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import RotatingBackground from '../components/RotatingBackground'

const titles = [
  'Software Development',
  'Machine Learning',
  'Data Science',
  'Computational Chemistry',
]

const accents = ['#4C8C8A', '#A78BFA', '#8B6F61']

export default function Home() {
  const [index, setIndex] = useState(0)
  const [color, setColor] = useState(accents[0])

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % titles.length)
      setColor(accents[Math.floor(Math.random() * accents.length)])
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="page relative min-h-[calc(100dvh-4rem)] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <RotatingBackground />
      </div>

      <section className="relative z-10 flex min-h-[calc(100dvh-4rem)] w-full max-w-2xl flex-col justify-center gap-5 px-4 py-12 sm:px-8 md:px-10 lg:px-14 pointer-events-none">
        <h1 className="text-4xl font-medium tracking-tight text-neutral-100 sm:text-5xl md:text-6xl">
          Ashton Dy
        </h1>

        <div className="min-h-[2.5rem] sm:min-h-[3rem]">
          <AnimatePresence mode="wait">
            <motion.p
              key={titles[index]}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="text-xl sm:text-2xl md:text-3xl"
              style={{ color }}
            >
              {titles[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <p className="max-w-md text-[15px] leading-relaxed text-neutral-400 sm:text-base">
          CS student at UTK building software, ML systems, and computational chemistry tools.
        </p>
      </section>
    </main>
  )
}
