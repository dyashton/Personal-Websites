import { useState } from 'react'
import resumePng from '../assets/RESUME - Research 9-24-25-1.png'
import resumePdf from '../assets/RESUME - Research 9-24-25.pdf'
import cvPdf from '../assets/Ashton_Dy_CV 9-26-25.pdf'
import cv1 from '../assets/Ashton_Dy_CV 9-26-25-1.png'
import cv2 from '../assets/Ashton_Dy_CV 9-26-25-2.png'
import cv3 from '../assets/Ashton_Dy_CV 9-26-25-3.png'

const cvPages = [cv1, cv2, cv3]

export default function Credentials() {
  const [page, setPage] = useState(0)

  return (
    <main className="page overflow-y-auto">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 md:flex-row md:items-start md:gap-8 md:py-12">
        <section className="flex w-full flex-col items-stretch gap-4 md:w-1/2">
          <div className="sticky top-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/60 bg-[var(--bg)]/95 px-4 py-3 backdrop-blur-sm md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
            <h1 className="text-2xl font-medium tracking-tight text-neutral-100 md:text-3xl">
              Resume
            </h1>
            <a
              href={resumePdf}
              download
              className="inline-flex min-h-11 items-center justify-center bg-neutral-800 px-4 py-2 text-sm text-neutral-200 transition-colors hover:bg-neutral-700"
            >
              Download PDF
            </a>
          </div>
          <a href={resumePdf} target="_blank" rel="noreferrer" className="block w-full">
            <img
              src={resumePng}
              alt="Resume preview"
              className="w-full border border-neutral-800 object-contain"
            />
          </a>
        </section>

        <div className="hidden h-px w-full bg-neutral-700 md:block md:h-auto md:min-h-[24rem] md:w-px md:self-stretch" />

        <section className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-medium tracking-tight text-neutral-100 md:text-3xl">
              CV
            </h2>
            <a
              href={cvPdf}
              download
              className="inline-flex min-h-11 items-center justify-center bg-neutral-800 px-4 py-2 text-sm text-neutral-200 transition-colors hover:bg-neutral-700"
            >
              Download PDF
            </a>
          </div>

          <img
            src={cvPages[page]}
            alt={`CV page ${page + 1}`}
            className="w-full border border-neutral-800 object-contain"
          />

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center border border-neutral-700 px-3 text-neutral-200 disabled:opacity-40"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              aria-label="Previous CV page"
            >
              Prev
            </button>
            <p className="text-sm text-neutral-500">
              {page + 1} / {cvPages.length}
            </p>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center border border-neutral-700 px-3 text-neutral-200 disabled:opacity-40"
              disabled={page === cvPages.length - 1}
              onClick={() => setPage((p) => Math.min(cvPages.length - 1, p + 1))}
              aria-label="Next CV page"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
