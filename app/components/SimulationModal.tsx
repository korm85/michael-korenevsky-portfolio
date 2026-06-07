"use client";

import { useEffect } from "react";

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimulationModal({ isOpen, onClose }: SimulationModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[94vw] xl:max-w-7xl h-[90dvh] md:h-[82vh] bg-paper border border-line rounded-sm flex flex-col overflow-hidden animate-scale-in text-left select-text shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-line bg-paper-2 flex-shrink-0">
          <div>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-accent font-medium">
              PREDICTIVE SOLVER CASE STUDY
            </p>
            <h3 className="text-base md:text-xl font-display font-light text-ink mt-0.5">
              Physics-based Simulation Suite
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-ink-faint hover:text-ink hover:bg-line/40 border border-transparent hover:border-line transition-all flex-shrink-0"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden p-6 md:p-8 min-h-0 bg-paper">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full overflow-y-auto pr-2 animate-fade-in">
            {/* Left: Scope & Docs */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1.5">
                  THE PRODUCT & MISSION
                </p>
                <p className="text-sm md:text-xl font-display font-light text-ink leading-snug">
                  Simulation software that predicts thermal stress, shrink, and warp before manufacturing, enabling clients to achieve first-time-right production and eliminate expensive physical trials.
                </p>
                <p className="text-xs md:text-sm text-ink-faint leading-relaxed mt-2">
                  Transforms complex thermo-mechanical physics equations into simple, automated tooling workflows that eliminate manufacturing defects on standard local workstation hardware.
                </p>
              </div>

              <div className="border-t border-line pt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1.5">
                  PM CONTRIBUTION
                </p>
                <p className="text-xs md:text-sm leading-relaxed text-ink-soft">
                  Defined the three-phase roadmap: Thermal module, Mechanical module, then the coupled Thermo-mechanical pass that eliminated the wait between stages. Worked with physics researchers to package complex finite element solvers into single-click workflows any manufacturing engineer could run on a standard workstation — no physics expertise required. Ran the structured Knauf beta that validated accuracy before launch and produced the customer story we shipped with.
                </p>
              </div>

              {/* Source documents */}
              <div className="border-t border-line pt-4 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint font-medium">
                  SOURCE DOCUMENTS
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { href: "https://drive.google.com/file/d/13v5VOTdE8XOMEmy79SaHz6h4s8E_3VU8/view", label: "Thermal Validation Whitepaper" },
                    { href: "https://drive.google.com/file/d/14xkfVrlu1sj1c3YY9w3R-xtejPW1yHgO/view", label: "Customer Story: Tooling" },
                    { href: "https://drive.google.com/file/d/14yNMaShYmz9dlhq6LMOxtihkh4xPZvTe/view", label: "Customer Story: Large Parts" },
                  ].map((doc) => (
                    <a
                      key={doc.href}
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.06em] border border-line text-ink-faint hover:border-ink hover:text-ink rounded-sm px-2.5 py-1.5 transition-all duration-200 group"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M17 7H7M17 7v10" />
                      </svg>
                      {doc.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Image + Outcomes */}
            <div className="md:col-span-5 space-y-4">
              <div className="rounded-sm overflow-hidden border border-line bg-paper-2 p-2">
                <img
                  src="/simulation-knauf-fit.png"
                  alt="Simulation Suite first-time-right validation"
                  className="w-full h-auto object-contain"
                />
              </div>

              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint font-medium">
                MEASURABLE OUTCOMES
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "80%", label: "Reduction in manufacturing errors" },
                  { value: "<150µm", label: "Maximum measured distortion limit met" },
                  { value: "99%+", label: "Accuracy via digital shrink compensation" },
                ].map((m) => (
                  <div
                    key={m.value}
                    className="bg-paper-2 rounded-sm p-4 border border-line hover:border-accent/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    <p
                      className="font-display font-light text-accent leading-none mb-1"
                      style={{ fontSize: "clamp(1.4rem, 4vw, 2.2rem)" }}
                    >
                      {m.value}
                    </p>
                    <p className="text-xs text-ink-faint font-medium leading-snug">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
