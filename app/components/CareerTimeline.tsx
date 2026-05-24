"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

const TIMELINE = [
  {
    years: "2025–Present",
    company: "Oqton",
    role: "Senior PM, AI Platform",
    line: "Leading the AI vision product for industrial manufacturing.",
  },
  {
    years: "2022–2025",
    company: "Oqton",
    role: "Product Manager, Simulation",
    line: "Owned strategy, roadmap, and pricing for predictive simulation software.",
  },
  {
    years: "2017–2022",
    company: "3D Systems",
    role: "QA Team Lead",
    line: "Built and led the QA team for industrial CAD/CAM software.",
  },
  {
    years: "2015–2017",
    company: "3D Systems",
    role: "QA Engineer (Founding Team)",
    line: "Designed validation frameworks for next-gen manufacturing tools.",
  },
  {
    years: "2012–2015",
    company: "Cimatron",
    role: "QA Engineer",
    line: "Tested precision CAD/CAM workflows for tooling and mold manufacturers worldwide.",
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
          <span className="text-sm text-[#71717a]">{entry.role}</span>
        </div>
        <p className="text-sm text-[#71717a]/60">{entry.line}</p>
      </div>
    </div>
  );
}

export default function CareerTimeline() {
  return (
    <section id="career" className="px-6 md:px-12 py-32 border-t border-[#27272a]/30">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#71717a]">Career</span>
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

        <p className="text-sm text-[#71717a]/60 mt-12 italic border-l border-[#5eead4]/30 pl-4">
          A decade of QA engineering before PM. Edge-case thinking is the foundation of how I make AI product decisions.
        </p>
      </div>
    </section>
  );
}
