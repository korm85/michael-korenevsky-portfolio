"use client";

import { useState, useEffect } from "react";

// The compact nav stays intentionally lightweight: it gives first-time
// visitors direct wayfinding while the bottom action panel remains available
// for search, demos, and keyboard-driven navigation.
export default function Header() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");

  const navItems = [
    ["work", "Product work"],
    ["how-i-work", "How I work"],
    ["career", "Experience"],
    ["about", "About"],
    ["contact", "Contact"],
  ];

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (sy / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = ["hero", ...navItems.map(([id]) => id)]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.3, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 h-[2px] bg-accent z-[90] pointer-events-none"
        style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
      />
      <button
        onClick={() => {
          document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
        }}
        aria-label="Back to top"
        className="fixed top-4 left-4 z-[90] flex size-9 items-center justify-center rounded-sm border border-line-dark bg-canvas text-on-dark transition-colors duration-200 hover:border-accent hover:text-accent"
      >
        <span className="font-mono font-bold text-[13px] tracking-[-0.02em] text-accent-deep">
          MK
        </span>
      </button>
      <nav
        aria-label="Primary navigation"
        className="fixed top-3 right-4 z-[90] hidden sm:flex items-center gap-1 border border-line-dark bg-canvas/95 p-1"
      >
        {navItems.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={activeSection === id ? "page" : undefined}
            className={`px-3 py-2 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors ${activeSection === id ? "bg-paper text-ink" : "text-on-dark-soft hover:bg-paper hover:text-ink"}`}
          >
            {label}
          </a>
        ))}
      </nav>
    </>
  );
}
