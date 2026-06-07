"use client";

import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Work", id: "work" },
  { label: "Practice", id: "how-i-work" },
  { label: "Career", id: "career" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setScrolled(sy > 40);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (sy / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-accent z-[90] pointer-events-none"
        style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
      />

      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backdropFilter: scrolled ? "blur(14px) saturate(1.4)" : "none",
          backgroundColor: scrolled ? "rgba(243,239,230,0.88)" : "transparent",
          borderBottom: scrolled ? "1px solid #cdc7be" : "1px solid transparent",
          transition: "background 0.4s, border-color 0.4s, backdrop-filter 0.4s",
        }}
      >
        <div className="flex items-center justify-between px-6 md:px-10 h-[68px] max-w-[1180px] mx-auto">
          {/* Monogram */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-mono text-[11px] tracking-[0.15em] transition-colors duration-300 hover:text-accent"
            style={{ color: scrolled ? "#8b8478" : "#75705f" }}
          >
            MK
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.id);
                }}
                className="font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-200 hover:text-accent"
                style={{ color: scrolled ? "#514c42" : "#b3ab9b" }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden font-mono text-[11px] uppercase tracking-[0.08em] transition-colors hover:text-accent"
            style={{ color: scrolled ? "#514c42" : "#b3ab9b" }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-paper border-t border-line px-6 py-5 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.id);
                  setMenuOpen(false);
                }}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft hover:text-accent transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
