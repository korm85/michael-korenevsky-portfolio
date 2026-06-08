"use client";

import Link from "next/link";

function ArrowIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M17 7H7M17 7v10" />
    </svg>
  );
}

const AMVERO_METRICS = [
  { value: "98%", label: "Monitoring time reduction" },
  { value: "18%", label: "Scrap cost reduction" },
  { value: "136h", label: "Saved per printer / year" },
  { value: "5", label: "Enterprise clients in 5 months" },
];

const SIM_METRICS = [
  { value: "80%", label: "Fewer dimensional errors" },
  { value: "99%+", label: "Dimensional accuracy" },
  { value: "<150µm", label: "Max measured deviation" },
];

const AMVERO_DOCS = [
  { name: "Go-to-Market Narrative", url: "/artifacts/amvero-go-to-market-narrative.pdf" },
  { name: "Alerts PRD", url: "/artifacts/amvero-smart-alerting-prd.html" },
  { name: "Launch Announcement", url: "/artifacts/amvero-launch-announcement.html" },
  { name: "Deployment Playbook", url: "/artifacts/amvero-enterprise-deployment-playbook.pdf" },
  { name: "Traceability Record", url: "/artifacts/amvero-end-to-end-traceability-record.pdf" },
  { name: "Credit Pricing Model", url: "/tools/amvero-roi-optimizer.html" },
];

const SIM_DOCS = [
  { name: "Thermal Whitepaper", url: "/artifacts/simulation-thermal-whitepaper.html" },
  { name: "Customer Story: Tooling", url: "/artifacts/simulation-customer-story-tooling.html" },
  { name: "Customer Story: Large Parts", url: "/artifacts/simulation-customer-story-large-parts.html" },
];

const PRACTICE_CARDS = [
  {
    num: "01",
    title: "Discovery & specs",
    body: "AI synthesized support tickets, Jira history, and customer feedback before writing the AMVero alerting spec — surfaced a threshold conflict that would have shipped a broken alert.",
  },
  {
    num: "02",
    title: "Prototyping",
    body: "Working mockups in front of operators before any production code was written. They caught a UX problem that would have taken multiple developer sprints to fix post-release.",
  },
  {
    num: "03",
    title: "Market intelligence",
    body: "Scheduled agent tracks AMVero's regulatory environment, competitor pricing, and new entrants weekly. Flagged competitor pricing shift — data used to propose the move to token-based billing.",
  },
  {
    num: "04",
    title: "Support intelligence",
    body: "AI read 500 support tickets and found operators were drowning in false alerts, not accuracy problems. That finding redirected the entire Smart Alerting roadmap.",
  },
];

const TIMELINE = [
  { years: "2025–Present", company: "Oqton", role: "Senior PM, AI Platform" },
  { years: "2022–2025", company: "Oqton", role: "Product Manager, Simulation" },
  { years: "2017–2022", company: "3D Systems", role: "QA Team Lead" },
  { years: "2015–2017", company: "3D Systems", role: "QA Engineer (Founding Team)" },
  { years: "2012–2015", company: "Cimatron", role: "QA Engineer" },
];

export default function PortfolioPage() {
  return (
    <main className="flex flex-col min-h-screen overflow-x-hidden bg-canvas font-sans">

      {/* ── Header strip ── */}
      <div className="bg-canvas border-b border-line-dark px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-[10px] uppercase tracking-[0.15em] text-on-dark-faint hover:text-accent transition-colors flex items-center gap-2"
        >
          <svg className="w-3 h-3 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M17 7H7M17 7v10" />
          </svg>
          themishka.me
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-on-dark-faint">
          Portfolio overview
        </span>
      </div>

      {/* ── Intro ── */}
      <section className="bg-canvas px-6 py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-on-dark-soft">
              Senior Product Manager · Open to roles
            </span>
          </div>

          <h1
            className="font-display font-light text-on-dark leading-[0.93] tracking-[-0.01em] mb-8"
            style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
          >
            Michael Korenevsky
          </h1>

          <p
            className="text-on-dark-soft leading-relaxed max-w-2xl mb-12"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)" }}
          >
            Building enterprise AI and predictive tools for high-stakes industries.
            Ten years in industrial software, the last three shipping AI products to enterprise customers.
          </p>

          {/* Contact row */}
          <div className="flex flex-wrap gap-6">
            {[
              { label: "Email", href: "mailto:korm85@gmail.com", value: "korm85@gmail.com" },
              { label: "LinkedIn", href: "https://linkedin.com/in/michael-korenevsky", value: "michael-korenevsky" },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 group"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-dark-faint">{c.label}</span>
                <span className="text-on-dark-soft group-hover:text-accent transition-colors text-sm flex items-center gap-1.5">
                  {c.value}
                  <ArrowIcon />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Work ── */}
      <section className="bg-paper px-6 py-14 md:py-20">
        <div className="max-w-[1180px] mx-auto">
          <div className="flex items-baseline gap-4 border-b border-line pb-6 mb-14">
            <span className="font-mono text-[11px] text-accent font-medium tracking-[0.1em]">01</span>
            <h2 className="font-display font-light text-ink" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
              Selected work
            </h2>
          </div>

          <div className="space-y-16">

            {/* AMVero */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">
                AI Platform · Oqton · 2025–Present
              </p>
              <h3
                className="font-display font-light text-ink leading-tight mb-4"
                style={{ fontSize: "clamp(1.3rem, 2.5vw, 2rem)" }}
              >
                Took an AI monitoring tool from pilot to five enterprise contracts in five months
              </h3>
              <p className="text-ink-soft text-sm leading-relaxed mb-8 max-w-3xl">
                Took AMVero from first enterprise pilot to five paying clients in five months — writing the GTM narrative, designing the smart alerting system that eliminated operator alert fatigue, and authoring the deployment playbook that got regulated manufacturers live without disrupting production.
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 border-r border-b border-line mb-8">
                {AMVERO_METRICS.map((m) => (
                  <div key={m.value} className="border-t border-l border-line p-5">
                    <div className="font-display text-accent font-light leading-none mb-2" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
                      {m.value}
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-faint leading-relaxed">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Customers */}
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint mb-6">
                Baker Hughes · Thales · Elos Medtech · 3D Systems · Beehive
              </p>

              {/* Docs */}
              <div className="flex flex-wrap gap-2">
                {AMVERO_DOCS.map((doc) => (
                  <a
                    key={doc.url}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.06em] border border-line text-ink-soft hover:border-accent hover:text-accent rounded-sm px-2.5 py-1.5 transition-all duration-200 group"
                  >
                    {doc.name}
                    <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      <ArrowIcon />
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Simulation */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">
                Predictive Simulation · Oqton · 2022–2025
              </p>
              <h3
                className="font-display font-light text-ink leading-tight mb-4"
                style={{ fontSize: "clamp(1.3rem, 2.5vw, 2rem)" }}
              >
                Shipped three simulation modules, culminating in the thermo-mechanical solver that made first-time-right manufacturing achievable
              </h3>
              <p className="text-ink-soft text-sm leading-relaxed mb-8 max-w-3xl">
                Built out the Simulation Suite over three years — Thermal, Mechanical, then the coupled Thermo-mechanical pass that eliminated inter-stage wait times and made first-time-right accuracy viable in serial production. Validated on standard workstations, not servers.
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 border-r border-b border-line mb-8">
                {SIM_METRICS.map((m) => (
                  <div key={m.value} className="border-t border-l border-line p-5">
                    <div className="font-display text-accent font-light leading-none mb-2" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
                      {m.value}
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-faint leading-relaxed">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Docs */}
              <div className="flex flex-wrap gap-2">
                {SIM_DOCS.map((doc) => (
                  <a
                    key={doc.url}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.06em] border border-line text-ink-soft hover:border-accent hover:text-accent rounded-sm px-2.5 py-1.5 transition-all duration-200 group"
                  >
                    {doc.name}
                    <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      <ArrowIcon />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Practice ── */}
      <section className="bg-canvas px-6 py-14 md:py-20">
        <div className="max-w-[1180px] mx-auto">
          <div className="flex items-baseline gap-4 border-b border-line-dark pb-6 mb-14">
            <span className="font-mono text-[11px] text-accent font-medium tracking-[0.1em]">02</span>
            <h2 className="font-display font-light text-on-dark" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
              An AI-native PM practice
            </h2>
          </div>

          <p className="text-on-dark-soft leading-relaxed max-w-2xl mb-12" style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)" }}>
            AI lets me cover more ground in less time and build working prototypes without waiting on development. I can bring something testable to every client and stakeholder conversation instead of a description of what I am imagining.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {PRACTICE_CARDS.map((card) => (
              <div
                key={card.num}
                className="p-6 border border-line-dark"
              >
                <span className="font-mono text-[10px] text-accent tracking-[0.1em] mb-4 block">{card.num}</span>
                <h3
                  className="font-display font-light text-on-dark mb-3 leading-tight"
                  style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)" }}
                >
                  {card.title}
                </h3>
                <p className="text-on-dark-soft text-xs leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Career ── */}
      <section className="bg-paper px-6 py-14 md:py-20">
        <div className="max-w-[1180px] mx-auto">
          <div className="flex items-baseline gap-4 border-b border-line pb-6 mb-14">
            <span className="font-mono text-[11px] text-accent font-medium tracking-[0.1em]">03</span>
            <h2 className="font-display font-light text-ink" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
              10+ years in enterprise software
            </h2>
          </div>

          <div>
            {TIMELINE.map((entry, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-6 py-5 border-b border-line last:border-0 items-baseline"
              >
                <span className="font-mono text-[10px] text-accent tracking-[0.06em]">{entry.years}</span>
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                  <span className="font-display font-light text-ink" style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)" }}>
                    {entry.company}
                  </span>
                  <span className="text-ink-faint text-sm">·</span>
                  <span className="text-ink-soft text-sm">{entry.role}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="font-display italic text-ink-soft mt-10 max-w-2xl" style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)" }}>
            A decade of QA before PM means I approach AI product decisions the way a test engineer approaches release certification: assume it will fail, design for the edge case, then validate before shipping.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-canvas border-t border-line-dark px-6 py-8">
        <div className="max-w-[1180px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-on-dark-faint hover:text-accent transition-colors flex items-center gap-2"
          >
            <svg className="w-3 h-3 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M17 7H7M17 7v10" />
            </svg>
            Back to full portfolio
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-on-dark-faint">
            themishka.me
          </span>
        </div>
      </footer>

    </main>
  );
}
