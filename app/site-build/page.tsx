"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import SiteArchitecture from "../components/SiteArchitecture";

export default function SiteBuildPage() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.body.classList.add("custom-cursor-body");

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive =
          target.closest("a") ||
          target.closest("button") ||
          target.closest('[role="button"]') ||
          target.classList.contains("cursor-zoom-in") ||
          target.classList.contains("cursor-zoom-out") ||
          target.closest(".interactive-card") ||
          target.tagName === "INPUT" ||
          target.tagName === "SELECT" ||
          target.tagName === "LABEL" ||
          target.tagName === "TEXTAREA";
        setIsHovering(!!isInteractive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.body.classList.remove("custom-cursor-body");
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <main className="flex flex-col min-h-screen bg-canvas text-text-primary overflow-x-hidden relative">
      {/* Custom Follower Cursor */}
      {isVisible && (
        <div
          className="hidden md:block pointer-events-none fixed z-[9999] rounded-full border transition-all duration-75 -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            width: isHovering ? "48px" : "24px",
            height: isHovering ? "48px" : "24px",
            backgroundColor: isHovering ? "rgba(94, 234, 212, 0.15)" : "transparent",
            borderColor: "#5eead4",
          }}
        />
      )}

      <Header />

      <div className="flex-1 py-16 md:py-24 space-y-12">
        <div className="max-w-4xl mx-auto px-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-teal-accent hover:text-white transition-colors group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Portfolio</span>
          </a>
        </div>

        <SiteArchitecture />
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-10 font-mono text-[10px] text-text-muted border-t border-border-dark bg-black">
        <span>Michael Korenevsky · Based in Israel · 2026</span>
      </footer>
    </main>
  );
}
