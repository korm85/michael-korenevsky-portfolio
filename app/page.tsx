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
    <main className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />

      {/* ── Hero ── */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-center items-center bg-canvas text-on-dark px-6 overflow-hidden"
      >
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.035,
            backgroundImage:
              "linear-gradient(#f0ebe0 1px, transparent 1px), linear-gradient(to right, #f0ebe0 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Radial vignette over grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, #1b1916 100%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Status eyebrow */}
          <div className="flex items-center justify-center gap-2.5 mb-12">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-on-dark-soft">
              Senior Product Manager · Open to roles
            </span>
          </div>

          {/* Name */}
          <h1
            className="font-display font-light text-on-dark leading-[0.93] tracking-[-0.01em] mb-8"
            style={{ fontSize: "clamp(3.4rem, 11.5vw, 9.5rem)" }}
          >
            Michael Korenevsky
          </h1>

          {/* Lead */}
          <p
            className="text-on-dark-soft leading-relaxed max-w-xl mx-auto mb-12"
            style={{ fontSize: "clamp(1rem, 2.2vw, 1.4rem)" }}
          >
            Building enterprise AI and predictive tools for high-stakes industries.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] bg-on-dark text-canvas px-5 py-3 rounded-sm border border-on-dark hover:bg-accent hover:border-accent hover:text-white transition-all duration-300"
              style={{ transform: "translateY(0)" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              View Work
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] bg-transparent text-on-dark px-5 py-3 rounded-sm border border-on-dark/40 hover:bg-on-dark hover:text-canvas hover:border-on-dark transition-all duration-300"
              style={{ transform: "translateY(0)" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Get in Touch
            </a>
          </div>

          {/* Company logos */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-on-dark-faint mb-2">
              Shipped to
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-on-dark-soft">
              Baker Hughes · Thales · Elos Medtech · 3D Systems · Beehive
            </p>
          </div>
        </div>
      </section>

      {/* ── Work ── */}
      <SelectedWork
        onOpenAmvero={() => setAmveroOpen(true)}
        onOpenSimulation={() => setSimulationOpen(true)}
      />

      {/* ── Practice ── */}
      <HowIWork />

      {/* ── Career ── */}
      <CareerTimeline />

      {/* ── About ── */}
      <section id="about" className="bg-paper-2 px-6 py-14 md:py-24 xl:py-32">
        <div className="max-w-[1180px] mx-auto">
          {/* Section header */}
          <div className="flex items-baseline gap-4 border-b border-line pb-6 mb-16">
            <span className="font-mono text-[11px] text-accent font-medium tracking-[0.1em]">04</span>
            <h2
              className="font-display font-light text-ink leading-tight"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}
            >
              Mechanical engineer by training, product manager by craft
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Profile photo */}
            <div>
              <div className="overflow-hidden rounded-sm" style={{ maxWidth: 340 }}>
                <Image
                  src="/profile.jpeg"
                  alt="Michael Korenevsky"
                  width={340}
                  height={425}
                  priority
                  className="w-full object-cover object-top"
                  style={{ aspectRatio: "4/5" }}
                />
              </div>
            </div>

            {/* Bio + details */}
            <div>
              <p
                className="text-ink-soft leading-relaxed mb-10"
                style={{ fontSize: "clamp(1rem, 1.8vw, 1.1rem)" }}
              >
                Ten years building and certifying industrial software before moving into
                product management. The QA years weren&apos;t a detour — they taught me
                to find failure modes before users do, which turns out to be exactly
                what enterprise AI products need.
              </p>

              {/* Education — crow */}
              <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[110px_1fr] gap-4 items-baseline py-5 border-b border-line">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
                  Education
                </span>
                <div>
                  <p className="text-ink font-medium text-sm">B.Sc. Mechanical Engineering</p>
                  <p className="text-ink-faint text-sm mt-0.5">Ben-Gurion University · 2008–2012</p>
                </div>
              </div>

              {/* Languages — crow */}
              <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[110px_1fr] gap-4 items-baseline py-5 border-b border-line">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
                  Languages
                </span>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {[
                    ["Hebrew", "Native"],
                    ["English", "Professional"],
                    ["Russian", "Fluent"],
                  ].map(([lang, level]) => (
                    <div key={lang} className="flex items-baseline gap-1.5">
                      <span className="text-ink text-sm font-medium">{lang}</span>
                      <span className="text-ink-faint text-xs">{level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location — crow */}
              <div className="grid grid-cols-[110px_1fr] gap-6 items-baseline py-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
                  Location
                </span>
                <p className="text-ink-soft text-sm">
                  Israel · Open to remote and hybrid roles
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <ContactSection />

      {/* ── Footer ── */}
      <footer className="bg-canvas border-t border-line-dark px-6 py-8">
        <div className="max-w-[1180px] mx-auto flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.15em] text-on-dark-faint">
          <span>© 2026 Michael Korenevsky</span>
          <div className="flex items-center gap-5">
            {time && <span>ISR {time}</span>}
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Available
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
