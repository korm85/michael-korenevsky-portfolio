"use client";

import { useState, useEffect } from "react";

// The top nav was removed: first-visit wayfinding is handled by the hero
// CTAs and ongoing navigation by the bottom action panel. Only the scroll
// progress indicator and a small logo mark remain -- the mark's only job is
// "take me back to the top," not a second navigation surface.
const glass = {
  backdropFilter: "blur(14px) saturate(1.4)",
  WebkitBackdropFilter: "blur(14px) saturate(1.4)",
  backgroundColor: "rgba(243,239,230,0.88)",
} as const;

export default function Header() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (sy / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
        className="fixed top-4 left-4 z-[90] flex items-center justify-center w-9 h-9 rounded-sm border border-line shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
        style={glass}
      >
        <span className="font-mono font-bold text-[13px] tracking-[-0.02em] text-accent-deep">
          MK
        </span>
      </button>
    </>
  );
}
