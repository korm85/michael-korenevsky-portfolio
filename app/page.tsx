"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "./components/Header";
import SelectedWork from "./components/SelectedWork";
import HowIWork from "./components/HowIWork";
import CareerTimeline from "./components/CareerTimeline";
import ContactSection from "./components/ContactSection";
import AmveroModal from "./components/AmveroModal";
import SimulationModal from "./components/SimulationModal";

export default function Home() {
  const [amveroOpen, setAmveroOpen] = useState(false);
  const [simulationOpen, setSimulationOpen] = useState(false);
  const [time, setTime] = useState("");

  // Custom Cursor Tracker State
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add cursor-none body override class on mount
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

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Jerusalem",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

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

      {/* ── Hero ── */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32 border-b border-border-dark/40 overflow-hidden"
      >
        {/* Subtle background radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(176,142,79,0.06)_0%,transparent_70%)] pointer-events-none z-0" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4">
          <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] text-teal-accent font-bold mb-8">
            👋 HI, I'M MICHAEL, SENIOR PRODUCT MANAGER
          </p>

          <div className="mb-10 rounded-full p-[3px] bg-teal-accent-dim border border-teal-accent/20 hover:border-teal-accent/50 transition-colors duration-500 shadow-2xl">
            <Image
              src="/profile.jpeg"
              alt="Michael Korenevsky"
              width={220}
              height={220}
              priority
              className="h-44 w-44 md:h-52 md:w-52 rounded-full object-cover object-top p-0.5"
            />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white tracking-tight mb-8 hidden">
            Michael Korenevsky
          </h1>

          <p className="text-xl md:text-2xl lg:text-3.5xl font-sans font-light text-text-secondary leading-snug tracking-tight max-w-3xl mb-12">
            Building complex products from scratch, owning the end-to-end process to transform complex data into actionable insights.
          </p>

          <div className="flex gap-8 mb-14">
            <a
              href="#work"
              className="text-teal-accent text-xs font-mono uppercase tracking-wider hover:text-white transition-colors border border-border-dark bg-surface px-5 py-2.5 rounded-sm hover:border-teal-accent/40"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="text-teal-accent text-xs font-mono uppercase tracking-wider hover:text-white transition-colors border border-border-dark bg-surface px-5 py-2.5 rounded-sm hover:border-teal-accent/40"
            >
              Get in Touch
            </a>
          </div>

          <div className="w-full max-w-md border-t border-border-dark/60 mb-8" />

          <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-text-muted">
            Shipped to: <span className="text-text-primary font-semibold">Baker Hughes · Thales · Elos Medtech · Oqton · Beehive</span>
          </p>
        </div>
      </section>

      {/* ── Selected Work ── */}
      <SelectedWork
        onOpenAmvero={() => setAmveroOpen(true)}
        onOpenSimulation={() => setSimulationOpen(true)}
      />

      {/* ── How I Work ── */}
      <HowIWork />

      {/* ── Career ── */}
      <CareerTimeline />

      {/* ── About ── */}
      <section id="about" className="px-6 md:px-12 py-32 border-t border-border-dark/40 bg-canvas">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-[10px] tracking-[0.4em] uppercase text-text-muted font-bold font-mono">About</span>
            <h2 className="text-3xl md:text-5xl font-extralight text-white mt-2">
              Background
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            <div className="bg-surface border border-border-dark p-8 rounded-xl">
              <h3 className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-teal-accent mb-4 font-bold font-mono">Education</h3>
              <p className="text-lg font-light text-white">B.Sc. Mechanical Engineering</p>
              <p className="text-sm text-text-muted mt-1">
                Ben-Gurion University of the Negev · 2008–2012
              </p>
            </div>
            <div className="bg-surface border border-border-dark p-8 rounded-xl">
              <h3 className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-teal-accent mb-4 font-bold font-mono">Languages</h3>
              <div className="space-y-3">
                {[
                  ["Hebrew", "Native"],
                  ["English", "Professional"],
                  ["Russian", "Fluent"],
                ].map(([lang, level]) => (
                  <div key={lang} className="flex items-center justify-between border-b border-border-dark pb-2 last:border-0 last:pb-0">
                    <span className="text-sm font-light text-text-secondary">{lang}</span>
                    <span className="text-xs text-text-muted font-mono">{level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <ContactSection />

      {/* ── Footer ── */}
      <footer className="px-6 md:px-12 py-10 border-t border-border-dark bg-canvas">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.2em] uppercase text-text-muted font-mono">
          <span>© 2026 Michael Korenevsky</span>
          <div className="flex items-center gap-4">
            {time && <span>ISR {time}</span>}
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-pulse" />
              Neural Link Active
            </span>
          </div>
        </div>
      </footer>

      {/* ── Modals ── */}
      <AmveroModal isOpen={amveroOpen} onClose={() => setAmveroOpen(false)} />
      <SimulationModal isOpen={simulationOpen} onClose={() => setSimulationOpen(false)} />
    </main>
  );
}
