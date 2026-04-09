import { useState } from 'react'
import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { Menu, X } from "lucide-react"

const linkClass =
    "group flex flex-col text-center py-2 md:py-0";

export default function Navbar() {
    const [Tab, setTab] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    function navLink(to, label, tabKey) {
        return (
            <Link
                to={to}
                className={linkClass}
                onClick={() => {
                    setTab(tabKey);
                    setMenuOpen(false);
                }}
            >
                <span>{label}</span>
                <span
                    className={`hidden md:block h-[1px] w-0 ${
                        Tab === tabKey ? "w-full" : "group-hover:w-full"
                    } bg-neutral-300 transition-all duration-300`}
                />
            </Link>
        );
    }

    return (
        <nav className="relative z-50 w-full flex flex-col md:flex-row md:justify-center md:items-center md:h-16 text-neutral-200 border-b border-neutral-800/50 md:border-0">
            <div className="flex items-center justify-between w-full md:w-1/2 px-4 py-3 md:py-0 md:m-10 md:px-0">
                <Link
                    to="/~ady/home"
                    onClick={() => {
                        setTab("Home");
                        setMenuOpen(false);
                    }}
                    className="text-xl md:text-2xl shrink-0"
                >
                    Ashton Dy
                </Link>
                <button
                    type="button"
                    className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-200 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
                    aria-expanded={menuOpen}
                    aria-controls="nav-mobile-menu"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    onClick={() => setMenuOpen((o) => !o)}
                >
                    {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            <div
                id="nav-mobile-menu"
                className={`${
                    menuOpen ? "flex" : "hidden"
                } md:flex flex-col md:flex-row md:items-center md:justify-evenly md:h-10 md:w-1/2 w-full px-4 pb-4 md:pb-0 md:px-0 gap-1 md:gap-0 border-t border-neutral-800 md:border-0 md:m-10`}
            >
                <Separator orientation="vertical" className="hidden md:block h-6" />
                {navLink("/~ady/experience", "Experience", "Experience")}
                <Separator orientation="vertical" className="hidden md:block h-6" />
                {navLink("/~ady/projects", "Projects", "Projects")}
                <Separator orientation="vertical" className="hidden md:block h-6" />
                {navLink("/~ady/credentials", "Credentials", "Credentials")}
                <Separator orientation="vertical" className="hidden md:block h-6" />
                {navLink("/~ady/contact", "Contact", "Contact")}
            </div>
        </nav>
    )
}
