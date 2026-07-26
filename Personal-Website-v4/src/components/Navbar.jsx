import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/credentials', label: 'Credentials' },
  { to: '/contact', label: 'Contact' },
]

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex min-h-11 items-center justify-center px-3 py-2 text-neutral-200 md:min-h-0 md:px-0 md:py-0 ${
          isActive ? 'text-white' : ''
        }`
      }
    >
      {({ isActive }) => (
        <span className="flex flex-col items-center">
          <span>{label}</span>
          <span
            className={`hidden h-px bg-neutral-300 transition-all duration-300 md:block ${
              isActive ? 'w-full' : 'w-0 group-hover:w-full'
            }`}
          />
        </span>
      )}
    </NavLink>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="relative z-50 w-full border-b border-neutral-800/50 text-neutral-200 md:border-0">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:h-16 md:px-8 md:py-0">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="shrink-0 text-xl text-neutral-100 md:text-2xl"
        >
          Ashton Dy
        </Link>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-neutral-200 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 md:hidden"
          aria-expanded={open}
          aria-controls="nav-mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </div>
      </div>

      <div
        id="nav-mobile-menu"
        className={`${
          open ? 'flex' : 'hidden'
        } flex-col border-t border-neutral-800/50 bg-[var(--bg)] px-2 pb-3 md:hidden`}
      >
        {links.map((link) => (
          <NavItem key={link.to} {...link} onClick={() => setOpen(false)} />
        ))}
      </div>
    </nav>
  )
}
