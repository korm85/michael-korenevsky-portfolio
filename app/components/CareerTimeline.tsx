"use client";

const TIMELINE = [
  {
    years: "2025–Present",
    company: "Oqton",
    role: "Senior PM, AI Platform",
    line: "Launched AMVero to five enterprise customers in five months: authored the deployment playbook, designed the smart alerting system, and defined the on-premise product variant for regulated industries.",
  },
  {
    years: "2022–2025",
    company: "Oqton",
    role: "Product Manager, Simulation",
    line: "Shipped the thermo-mechanical simulation module — coupled two previously separate solvers, validated on standard workstations, and ran a structured beta with Knauf that eliminated launch risk and delivered a credible customer story at release.",
  },
  {
    years: "2017–2022",
    company: "3D Systems",
    role: "QA Team Lead",
    line: "Built the QA function from scratch and led a team responsible for release certification on enterprise CAD/CAM software; the role where systematic defect thinking became the default.",
  },
  {
    years: "2015–2017",
    company: "3D Systems",
    role: "QA Engineer (Founding Team)",
    line: "Wrote the first validation frameworks for a new generation of manufacturing tools: pre-release, no existing playbook, high failure cost if defects shipped.",
  },
  {
    years: "2012–2015",
    company: "Cimatron",
    role: "QA Engineer",
    line: "Certified CAD/CAM software for tooling manufacturers across Europe and North America; learned to find the failure modes product teams hadn't imagined.",
  },
];

export default function CareerTimeline() {
  return (
    <section id="career" className="bg-paper px-6 py-14 md:py-24 xl:py-32">
      <div className="max-w-[1180px] mx-auto">
        {/* Section header */}
        <div className="flex items-baseline gap-4 border-b border-line pb-6 mb-16">
          <span className="font-mono text-[11px] text-accent font-medium tracking-[0.1em]">03</span>
          <h2
            className="font-display font-light text-ink leading-tight"
            style={{ fontSize: "clamp(2rem, 5.4vw, 3.6rem)" }}
          >
            10+ years in enterprise software
          </h2>
        </div>

        {/* Crow rows */}
        <div>
          {TIMELINE.map((entry, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-6 py-6 border-b border-line last:border-0 items-baseline transition-all duration-200 hover:pl-1"
            >
              <span className="font-mono text-[10px] text-accent tracking-[0.06em] pt-0.5">
                {entry.years}
              </span>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 mb-2">
                  <span
                    className="font-display font-light text-ink"
                    style={{ fontSize: "clamp(1.05rem, 2vw, 1.35rem)" }}
                  >
                    {entry.company}
                  </span>
                  <span className="text-ink-faint text-sm">·</span>
                  <span className="text-ink-soft text-sm">{entry.role}</span>
                </div>
                <p className="text-ink-faint text-sm leading-relaxed">{entry.line}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing note */}
        <p
          className="font-display italic text-ink-soft mt-12 max-w-2xl"
          style={{ fontSize: "clamp(1rem, 1.8vw, 1.15rem)" }}
        >
          A decade of QA before PM means I approach AI product decisions the way a test
          engineer approaches release certification: assume it will fail, design for the
          edge case, then validate before shipping.
        </p>
      </div>
    </section>
  );
}
