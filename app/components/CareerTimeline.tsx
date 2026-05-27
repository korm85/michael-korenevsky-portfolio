"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

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

function TimelineEntry({ entry }: { entry: (typeof TIMELINE)[0] }) {
  const ref = useScrollReveal("left");
  return (
    <div ref={ref} className="flex gap-6 md:gap-10 group">
      <div className="hidden md:flex flex-col items-center pt-2">
        <div className="w-[15px] h-[15px] rounded-full border border-[#27272a]/50 group-hover:border-[#5eead4] group-hover:bg-[#5eead4]/20 transition-all duration-300 flex items-center justify-center">
          <div className="w-[5px] h-[5px] rounded-full bg-[#71717a]/30 group-hover:bg-[#5eead4] transition-colors" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
          <span className="text-xs text-[#5eead4] font-medium tracking-wider">{entry.years}</span>
          <span className="text-sm text-[#fafafa] font-light">{entry.company}</span>
          <span className="text-xs text-[#71717a]">·</span>
          <span className="text-sm text-[#8a8580]">{entry.role}</span>
        </div>
        <p className="text-sm text-[#8a8580]">{entry.line}</p>
      </div>
    </div>
  );
}

export default function CareerTimeline() {
  return (
    <section id="career" className="px-6 md:px-12 py-32 border-t border-[#27272a]/30">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <span className="text-xs tracking-[0.2em] uppercase text-[#5eead4] font-mono">Career</span>
          <h2 className="text-4xl md:text-5xl font-extralight text-[#fafafa] mt-2">
            10+ years in industrial B2B software
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-[#27272a]/50 hidden md:block" />
          <div className="space-y-10">
            {TIMELINE.map((entry, i) => (
              <TimelineEntry key={i} entry={entry} />
            ))}
          </div>
        </div>

        <p className="text-sm text-[#8a8580] mt-12 italic border-l border-[#5eead4]/30 pl-4">
          A decade of QA before PM means I approach AI product decisions the way a test engineer approaches release certification: assume it will fail, design for the edge case, then validate before shipping.
        </p>
      </div>
    </section>
  );
}
