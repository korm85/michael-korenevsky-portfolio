"use client";

import { useState } from "react";

type WebNodeKey = "exec" | "route" | "guard" | "verify";

const webNodeDetails: Record<WebNodeKey, { title: string; subtitle: string; description: string }> = {
  exec: {
    title: "Requirements Definition",
    subtitle: "Guiding the AI developer",
    description: "I translated my design requirements into structured prompt instructions, directing the AI development agent to build clean React components just like a PM coordinates with engineering.",
  },
  route: {
    title: "Resource Allocation",
    subtitle: "Cost & task-based model routing",
    description: "I optimized build efficiency and cost by dynamically routing simpler codebase searches to lightweight models, and complex layout coding to advanced reasoning models.",
  },
  guard: {
    title: "Quality Guardrails",
    subtitle: "Enforcing brand & styling rules",
    description: "I loaded custom brand constraints (like bento grid layouts and copy guidelines) into the active agent context to ensure all AI-generated output met strict visual standards.",
  },
  verify: {
    title: "Release Verification",
    subtitle: "Automated testing and deployment",
    description: "I set up a quality check pipeline that automatically ran workspace compilation tests to catch layout errors before deploying the portfolio live to Vercel.",
  },
};

export default function SiteArchitecture() {
  const [activeNode, setActiveNode] = useState<WebNodeKey | null>(null);

  return (
    <section id="architecture" className="relative max-w-4xl mx-auto w-full px-6">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-teal-accent font-bold mb-3">
          Site Architecture
        </p>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
          How this portfolio was built
        </h2>
        <p className="mt-3 text-xs md:text-sm text-text-muted max-w-2xl mx-auto leading-relaxed">
          I directed the design, quality assurance, and production release of this website by orchestrating specialized AI agents, demonstrating how PMs can deliver digital products with modern workflows.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-border-dark bg-surface overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal-accent font-bold mb-1.5">
              AI-FIRST DEVELOPMENT PIPELINE
            </p>
            <h4 className="text-lg md:text-xl font-display font-bold text-white">
              Directing agent operations as a hands-on product manager
            </h4>
            <p className="text-xs md:text-sm text-text-muted mt-2 leading-relaxed">
              I define product requirements, load styling constraints, and oversee the build-test-deploy cycles, managing this digital release process from start to finish.
            </p>
          </div>

          {/* Diagram Nodes */}
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-black/40 border border-border-dark overflow-hidden min-h-[140px] z-10">
            <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-border-dark -translate-y-1/2 hidden sm:block z-0" />
            
            {(Object.keys(webNodeDetails) as WebNodeKey[]).map((key, index) => {
              const isActive = activeNode === key;
              const node = webNodeDetails[key];
              const label = key === "exec" ? "01. Setup" : key === "route" ? "02. Allocation" : key === "guard" ? "03. Guardrails" : "04. Verification";
              return (
                <div
                  key={key}
                  onMouseEnter={() => setActiveNode(key)}
                  onMouseLeave={() => setActiveNode(null)}
                  className={`relative z-10 flex flex-row sm:flex-col items-center justify-center p-3 rounded-lg border w-full sm:w-[23%] transition-all duration-300 cursor-help text-center ${
                    isActive
                      ? "bg-teal-accent-dim border-teal-accent scale-105 shadow-md text-teal-accent"
                      : "bg-surface border-border-dark text-text-secondary"
                  }`}
                >
                  <div className={`flex items-center justify-center w-9 h-9 rounded-full border text-xs font-mono sm:mb-2 transition-all flex-shrink-0 ${
                    isActive ? "bg-teal-accent text-black border-teal-accent font-bold" : "bg-black/50 text-text-muted border-border-dark"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="ml-3 sm:ml-0 flex-1 sm:flex-initial text-left sm:text-center">
                    <p className="text-[8px] font-mono uppercase tracking-widest hidden sm:block text-text-muted">{label}</p>
                    <h4 className="text-xs font-bold truncate w-full">{node.title}</h4>
                  </div>
                  {isActive && (
                    <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-accent"></span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Node Detail Box */}
          <div className="min-h-[100px] p-4 rounded-xl bg-black/20 border border-border-dark text-xs md:text-sm">
            {activeNode ? (
              <div className="space-y-1.5 animate-fade-in">
                <p className="text-[9px] font-mono text-teal-accent uppercase tracking-widest font-bold">NODE DETAIL</p>
                <h4 className="text-xs md:text-sm font-bold text-white leading-tight">
                  {webNodeDetails[activeNode].title} : {webNodeDetails[activeNode].subtitle}
                </h4>
                <p className="text-xs md:text-sm leading-relaxed text-text-muted">{webNodeDetails[activeNode].description}</p>
              </div>
            ) : (
              <div className="space-y-1.5 animate-fade-in">
                <p className="text-[9px] font-mono text-teal-accent uppercase tracking-widest font-bold">AI OPERATIONAL FRAMEWORK</p>
                <h4 className="text-xs md:text-sm font-bold text-white leading-tight">Interactive Build Architecture</h4>
                <p className="text-xs md:text-sm leading-relaxed text-text-muted">
                  Hover over the nodes above to see how I directed AI models to translate requirements, route sub-tasks, load brand guidelines, and verify deployment quality.
                </p>
              </div>
            )}
          </div>

          {/* Routing Badges */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-mono text-[9px] font-bold text-text-muted uppercase tracking-wider">Routing Engine:</span>
            <span className="px-2.5 py-1 rounded font-mono text-[9px] md:text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900 font-bold uppercase tracking-wider">Haiku (Reads)</span>
            <span className="px-2.5 py-1 rounded font-mono text-[9px] md:text-[10px] bg-teal-accent-dim text-teal-accent border border-teal-accent/30 font-bold uppercase tracking-wider">Sonnet (Writes)</span>
            <span className="px-2.5 py-1 rounded font-mono text-[9px] md:text-[10px] bg-amber-950/40 text-teal-accent border border-amber-900 font-bold uppercase tracking-wider">Opus (Plans)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
