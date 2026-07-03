"use client";

import { useState, useEffect } from "react";

// The top nav was removed: first-visit wayfinding is handled by the hero
// CTAs and ongoing navigation by the bottom action panel. Only the scroll
// progress indicator remains.
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
    <div
      className="fixed top-0 left-0 h-[2px] bg-accent z-[90] pointer-events-none"
      style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
    />
  );
}
