"use client";

import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Work", id: "work" },
  { label: "How I work", id: "how-i-work" },
  { label: "Career", id: "career" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const offset = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-canvas/90 backdrop-blur-md border-b border-border-dark" : ""
      }`}
    >
      <div className="flex items-center justify-center px-6 md:px-12 py-5 relative max-w-7xl mx-auto">
        {/* Desktop nav centered */}
        <nav className="hidden md:flex justify-center gap-10 text-text-secondary text-[11px] tracking-[0.25em] uppercase font-mono">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => { e.preventDefault(); scrollTo(item.id); }}
              className="hover:text-teal-accent transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile toggle (centered or on right) */}
        <button
          className="md:hidden text-text-secondary text-[11px] tracking-[0.25em] uppercase font-mono hover:text-teal-accent transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-4 bg-canvas/95 backdrop-blur-md border-b border-border-dark">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => { e.preventDefault(); scrollTo(item.id); setMenuOpen(false); }}
              className="text-text-secondary text-xs tracking-[0.2em] uppercase font-mono hover:text-teal-accent transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
