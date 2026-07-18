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

  // Product-work modals are synced to the URL hash so they are deep-linkable
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
        className="relative flex min-h-[720px] flex-col justify-center overflow-hidden bg-canvas px-6 text-on-dark lg:min-h-[760px]"
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

        <div className="relative z-10 mx-auto w-full max-w-[1360px] py-28 lg:py-24 xl:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:gap-16 xl:gap-24">
            <div>
            <p className="mb-7 font-mono text-[0.8rem] uppercase tracking-[0.12em] text-accent">
              Michael Korenevsky <span className="px-2 text-on-dark-faint">/</span> Senior Product Manager
            </p>
            <h1
              className="max-w-4xl font-display font-light leading-[0.98] text-balance text-on-dark"
              style={{ fontSize: "clamp(3rem, 5.2vw, 5.25rem)" }}
            >
              I turn complex industrial AI into products <span className="text-accent">customers trust and use.</span>
            </h1>
            <p
              className="mt-8 max-w-3xl text-pretty text-on-dark-soft leading-relaxed"
              style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.22rem)" }}
            >
              I lead enterprise software from customer discovery through launch. I choose the work that protects uptime, makes adoption easier, and creates measurable value.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 bg-accent px-5 py-3 font-mono text-[0.78rem] uppercase tracking-[0.07em] text-white transition-colors duration-200 hover:bg-on-dark hover:text-canvas"
              >
                Explore product work
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 border border-line-dark px-5 py-3 font-mono text-[0.78rem] uppercase tracking-[0.07em] text-on-dark transition-colors duration-200 hover:border-on-dark hover:bg-on-dark hover:text-canvas"
              >
                Get in touch
              </a>
            </div>

            <div className="mt-12">
              <p className="mb-3 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-on-dark-faint">Trusted by enterprise customers</p>
              <p className="flex flex-wrap gap-x-5 gap-y-2 text-[1rem] text-on-dark-soft">
              {["Baker Hughes", "Thales", "Elos Medtech", "3D Systems", "Beehive"].map((customer) => (
                <span key={customer} className="whitespace-nowrap">{customer}</span>
              ))}
              </p>
            </div>
            </div>

            <aside className="self-stretch" aria-label="Selected outcomes">
              <div className="h-full bg-on-dark/[0.045] px-7 py-9 sm:px-10 sm:py-11 lg:min-h-[690px] lg:px-11 lg:py-12">
                <p className="font-mono text-[0.78rem] uppercase tracking-[0.12em] text-accent">Selected outcomes</p>

                <div className="mt-11 grid gap-12 sm:grid-cols-2 sm:gap-8 lg:block">
                <a href="#ai-monitoring" className="group block max-w-[24rem]">
                  <span className="font-mono text-[0.78rem] uppercase tracking-[0.1em] text-on-dark-soft transition-colors duration-200 group-hover:text-accent">AI monitoring ↘</span>
                  <p className="font-display text-[clamp(5.5rem,9vw,8.5rem)] font-light leading-[0.78] text-accent tabular-nums">5</p>
                  <p className="mt-5 text-balance text-[1.15rem] font-medium leading-snug text-on-dark">enterprise customers in five months</p>
                  <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2 text-[0.92rem] leading-snug text-on-dark-soft">
                    {['Baker Hughes', 'Thales', 'Elos Medtech', '3D Systems', 'Beehive'].map((customer) => (
                      <span key={customer} className="flex items-center gap-2"><span className="size-1.5 shrink-0 bg-accent" />{customer}</span>
                    ))}
                  </div>
                  <p className="mt-5 font-mono text-[0.74rem] uppercase tracking-[0.08em] text-on-dark-faint">Too many alerts → a product customers could install and rely on</p>
                </a>

                <a href="#predictive-simulation" className="group block max-w-[25rem] lg:mt-12 lg:ml-12">
                  <span className="font-mono text-[0.78rem] uppercase tracking-[0.1em] text-on-dark-soft transition-colors duration-200 group-hover:text-accent">Predictive simulation ↘</span>
                  <p className="font-display text-[clamp(4.7rem,7.5vw,7.2rem)] font-light leading-[0.78] text-accent tabular-nums">80%</p>
                  <p className="mt-5 text-balance text-[1.15rem] font-medium leading-snug text-on-dark">fewer size errors in a full-day test print</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
                    <div className="bg-canvas/35 px-4 py-4">
                      <p className="font-mono text-[0.7rem] uppercase tracking-[0.09em] text-accent">Knauf beta</p>
                      <p className="mt-2 text-[0.96rem] font-medium leading-snug text-on-dark">Made a large metal tool without repeated trial prints</p>
                      <p className="mt-2 text-[0.82rem] leading-relaxed text-on-dark-soft">Most of the part was within a tenth of a millimetre of the intended size.</p>
                    </div>
                    <div className="bg-canvas/35 px-4 py-4">
                      <p className="font-mono text-[0.7rem] uppercase tracking-[0.09em] text-accent">Emerson test</p>
                      <p className="mt-2 text-[0.96rem] font-medium leading-snug text-on-dark">A 20+ hour print met the required size tolerance</p>
                      <p className="mt-2 text-[0.82rem] leading-relaxed text-on-dark-soft">The printer kept running at its normal production pace.</p>
                    </div>
                  </div>
                </a>
                </div>
              </div>
            </aside>
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
      <section id="about" className="bg-paper-2 px-6 py-14 md:py-24 xl:py-28">
        <div className="max-w-[1360px] mx-auto">
          <div className="mb-14">
            <p className="font-mono text-[0.78rem] font-medium uppercase tracking-[0.1em] text-accent-deep">04 / Background</p>
            <h2 className="mt-3 font-display font-light leading-tight text-ink" style={{ fontSize: "clamp(2.2rem, 5.4vw, 3.8rem)" }}>
              Why my background helps
            </h2>
            <p className="mt-4 max-w-3xl text-[1.05rem] leading-relaxed text-ink-soft xl:text-[1.15rem]">
              A reliability-first approach to product leadership, built in environments where getting it wrong is expensive.
            </p>
          </div>

          <div className="grid items-start gap-12 md:grid-cols-[0.85fr_1.15fr] xl:gap-24">
            {/* Profile photo */}
            <div>
              <div className="overflow-hidden rounded-sm w-full max-w-[440px]">
                <Image
                  src="/OfficialProfile.jpg"
                  alt="Michael Korenevsky"
                  width={440}
                  height={550}
                  className="w-full object-cover object-top"
                  style={{ aspectRatio: "4/5" }}
                />
              </div>
            </div>

            {/* Opening statement */}
            <div>
              <h3 className="max-w-3xl font-display text-[clamp(2rem,3.8vw,3.2rem)] font-light leading-tight text-ink">
                I build products people can depend on when getting it wrong is expensive.
              </h3>
              <p className="mt-7 max-w-3xl text-[1.05rem] leading-relaxed text-ink-soft xl:text-[1.15rem]">
                Mechanical engineering and years validating industrial software taught me to look beyond a feature working in a demo. I look for failure modes, unclear workflows, and adoption barriers that appear when a customer has to rely on the product in the real world.
              </p>
              <p className="mt-5 max-w-3xl text-[1.05rem] leading-relaxed text-ink-soft xl:text-[1.15rem]">
                That perspective now shapes how I lead product work: start with the people doing the job, turn technical complexity into a workflow they can use, and validate the result before asking them to change how they work.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-12 xl:gap-20">
            <div>
              <p className="font-mono text-[0.78rem] font-medium uppercase tracking-[0.1em] text-accent-deep">Reliability mindset</p>
              <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">I treat uptime, clarity, and deployment as part of the product experience.</p>
            </div>
            <div>
              <p className="font-mono text-[0.78rem] font-medium uppercase tracking-[0.1em] text-accent-deep">Complexity, made usable</p>
              <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">I work with engineering to turn AI and physics into workflows customers can understand and trust.</p>
            </div>
            <div>
              <p className="font-mono text-[0.78rem] font-medium uppercase tracking-[0.1em] text-accent-deep">From build to adoption</p>
              <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">I carry the work through customer validation, launch, installation, and feedback.</p>
            </div>
          </div>

          <p className="mt-12 font-mono text-[0.78rem] uppercase tracking-[0.08em] text-ink-faint">
            B.Sc. Mechanical Engineering, Ben-Gurion University · Hebrew, English, Russian · Israel, open to remote and hybrid roles
          </p>
        </div>
      </section>

      {/* ── Contact ── */}
      <ContactSection />

      {/* ── Footer ── */}
      {/* Extra bottom padding keeps the floating action pill clear of content */}
      <footer className="bg-canvas px-6 pt-8 pb-24">
        <div className="max-w-[1360px] mx-auto font-mono text-[11px] uppercase tracking-[0.12em] text-on-dark-faint">
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
