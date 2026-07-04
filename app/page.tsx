"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Header from "./components/Header";
import SelectedWork from "./components/SelectedWork";
import HowIWork from "./components/HowIWork";
import CareerTimeline from "./components/CareerTimeline";
import ContactSection from "./components/ContactSection";
import ActionPanel from "./components/ActionPanel";

const AmveroModal = dynamic(() => import("./components/AmveroModal"), { ssr: false });
const SimulationModal = dynamic(() => import("./components/SimulationModal"), { ssr: false });

const CASE_HASHES = ["#case-amvero", "#case-simulation"];

export default function Home() {
  const [amveroOpen, setAmveroOpen] = useState(false);
  const [simulationOpen, setSimulationOpen] = useState(false);

  // Case study modals are synced to the URL hash so they are deep-linkable
  // and the browser Back button closes them instead of leaving the site.
  const syncFromHash = useCallback(() => {
    const h = window.location.hash;
    setAmveroOpen(h === "#case-amvero");
    setSimulationOpen(h === "#case-simulation");
  }, []);

  useEffect(() => {
    syncFromHash();
    window.addEventListener("popstate", syncFromHash);
    return () => window.removeEventListener("popstate", syncFromHash);
  }, [syncFromHash]);

  const openCase = (hash: string) => {
    window.history.pushState(null, "", hash);
    syncFromHash();
  };

  const closeCase = useCallback(() => {
    if (CASE_HASHES.includes(window.location.hash)) {
      window.history.back();
    } else {
      setAmveroOpen(false);
      setSimulationOpen(false);
    }
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
          {/* Identity: plain name/role line -- no availability signal here.
              That already lives once, in Contact, where it belongs. */}
          <p className="mb-6">
            <span className="font-mono font-semibold text-sm md:text-base uppercase tracking-[0.14em] text-on-dark">
              Michael Korenevsky
            </span>
            <span className="hidden sm:inline font-mono text-sm text-on-dark-soft/40"> · </span>
            <span className="block sm:inline font-mono text-[11px] uppercase tracking-[0.2em] text-on-dark-soft mt-1.5 sm:mt-0">
              Senior Product Manager
            </span>
          </p>

          {/* Positioning headline — the PM's signature move, not a product line */}
          <h1
            className="font-display font-light text-on-dark leading-[1.05] tracking-[-0.01em] mb-6 max-w-2xl mx-auto"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.8rem)" }}
          >
            Taking enterprise AI from{" "}
            <span className="text-accent">pilot to production</span> in
            high-stakes industries
          </h1>

          {/* Subhead — two short bullets (metric-led, one per product) instead
              of a dense paragraph; easier to scan than unbroken prose */}
          <ul className="max-w-2xl mx-auto mb-9 space-y-2.5 text-left">
            <li className="flex gap-3">
              <span className="text-accent shrink-0 mt-0.5 font-light">–</span>
              <span
                className="text-on-dark leading-snug"
                style={{ fontSize: "clamp(1rem, 1.9vw, 1.2rem)" }}
              >
                Five paying enterprise customers in five months for a
                real-time AI monitoring product I owned end to end, from
                build to deployment.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent shrink-0 mt-0.5 font-light">–</span>
              <span
                className="text-on-dark leading-snug"
                style={{ fontSize: "clamp(1rem, 1.9vw, 1.2rem)" }}
              >
                Took a third-party physics engine and shipped it in three
                stages: thermal, mechanical, then a unified thermo-mechanical
                module. It compensates close to 100% of dimensional
                distortion, turning trial and error into a first-time-right
                process.
              </span>
            </li>
          </ul>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 mb-10">
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

          {/* Customers — own zone behind a hairline divider so it reads as a
              distinct proof band, not part of the text stack. One line per
              industry/company pair instead of a 2-row grid. */}
          <div className="max-w-2xl mx-auto pt-8 border-t border-line-dark">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-on-dark-faint mb-4">
              Shipped to enterprise customers in
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] flex flex-wrap justify-center gap-x-8 gap-y-2">
              {[
                ["Energy", "Baker Hughes"],
                ["Aerospace & Defense", "Thales · Beehive"],
                ["Medical Devices", "Elos Medtech"],
                ["Manufacturing Operations", "3D Systems"],
              ].map(([industry, companies]) => (
                <span key={industry}>
                  <span className="text-on-dark">{industry}</span>
                  <span className="text-on-dark-faint">: {companies}</span>
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* ── Work ── */}
      <SelectedWork
        onOpenAmvero={() => openCase("#case-amvero")}
        onOpenSimulation={() => openCase("#case-simulation")}
      />

      {/* ── Practice ── */}
      <HowIWork />

      {/* ── Career ── */}
      <CareerTimeline />

      {/* ── About ── */}
      <section id="about" className="bg-paper-2 px-6 py-12 md:py-20 xl:py-24">
        <div className="max-w-[1180px] mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-4 border-b border-line pb-5 mb-10">
            <span className="font-mono text-[11px] text-accent-deep font-medium tracking-[0.1em]">04</span>
            <h2
              className="font-display font-light text-ink leading-tight"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}
            >
              Mechanical engineer by training, product manager by craft
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-start">
            {/* Profile photo */}
            <div>
              <div className="overflow-hidden rounded-sm" style={{ maxWidth: 340 }}>
                <Image
                  src="/OfficialProfile.jpg"
                  alt="Michael Korenevsky"
                  width={340}
                  height={425}
                  className="w-full object-cover object-top"
                  style={{ aspectRatio: "4/5" }}
                />
              </div>
            </div>

            {/* Bio + details */}
            <div>
              <p
                className="text-ink-soft leading-relaxed mb-8"
                style={{ fontSize: "clamp(1rem, 1.8vw, 1.1rem)" }}
              >
                Ten years building and certifying industrial software before moving into
                product management. The QA years weren&apos;t a detour. They taught me
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
      {/* Extra bottom padding keeps the floating action pill clear of content */}
      <footer className="bg-canvas border-t border-line-dark px-6 pt-8 pb-24">
        <div className="max-w-[1180px] mx-auto font-mono text-[10px] uppercase tracking-[0.15em] text-on-dark-faint">
          <span>© 2026 Michael Korenevsky</span>
        </div>
      </footer>

      {/* ── Always-available quick actions ── */}
      <ActionPanel />

      {/* ── Modals ── */}
      <AmveroModal isOpen={amveroOpen} onClose={closeCase} />
      <SimulationModal isOpen={simulationOpen} onClose={closeCase} />
    </main>
  );
}
