import github from '../assets/Github.png'
import instagram from '../assets/instagram.png'
import linkedin from '../assets/LinkedIn.png'

const links = [
  {
    href: 'mailto:ady@vols.utk.edu',
    label: 'Email',
    detail: 'ady@vols.utk.edu',
    icon: null,
    isMailto: true,
  },
  {
    href: 'https://www.instagram.com/_ashtondy/',
    label: 'Instagram',
    detail: '_ashtondy',
    icon: instagram,
  },
  {
    href: 'https://www.linkedin.com/in/ashton-dy/',
    label: 'LinkedIn',
    detail: 'Ashton Dy',
    icon: linkedin,
  },
  {
    href: 'https://github.com/dyashton',
    label: 'GitHub',
    detail: 'dyashton',
    icon: github,
  },
]

export default function Contact() {
  return (
    <main className="page overflow-y-auto">
      <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 md:py-16">
        <h1 className="mb-2 text-3xl font-medium tracking-tight text-neutral-100 md:text-4xl">
          Contact
        </h1>
        <p className="mb-8 text-[15px] leading-relaxed text-neutral-400">
          Reach out by email or find me on the platforms below.
        </p>

        <ul className="flex flex-col gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target={link.isMailto ? undefined : '_blank'}
                rel={link.isMailto ? undefined : 'noreferrer'}
                className="flex min-h-14 w-full items-center gap-4 border border-neutral-800/80 px-4 py-3 text-neutral-200 transition-colors hover:border-neutral-600 hover:bg-neutral-900/60"
              >
                {link.icon ? (
                  <img
                    src={link.icon}
                    alt=""
                    className="h-10 w-10 shrink-0 object-contain"
                  />
                ) : (
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center border border-neutral-700 text-sm text-neutral-400"
                    aria-hidden
                  >
                    @
                  </span>
                )}
                <span className="flex min-w-0 flex-col">
                  <span className="text-neutral-100">{link.label}</span>
                  <span className="truncate text-sm text-neutral-500">{link.detail}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
