"use client";

import { useEffect } from "react";
import AmveroPrototype from "./AmveroPrototype";

interface AmveroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AmveroModal({ isOpen, onClose }: AmveroModalProps) {
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
        className="w-full max-w-[96vw] xl:max-w-7xl h-[92dvh] bg-paper border border-line rounded-sm flex flex-col overflow-hidden animate-scale-in text-left select-text shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-line bg-paper-2 flex-shrink-0">
          <div>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-accent font-medium">
              AI PRODUCT CASE STUDY & INTERACTIVE PROTOTYPE
            </p>
            <h3 className="text-base md:text-xl font-display font-light text-ink mt-0.5">
              AMVero Anomaly Detection Suite
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-ink-faint hover:text-ink hover:bg-line/40 border border-transparent hover:border-line transition-all flex-shrink-0"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden p-4 md:p-6 min-h-0 bg-paper">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">

            {/* Left Column: Overview */}
            <div className="lg:col-span-3 flex flex-col h-full overflow-y-auto pr-2 min-h-0 space-y-5 border-b lg:border-b-0 lg:border-r border-line pb-4 lg:pb-0 lg:pr-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1.5">
                  THE PRODUCT & MISSION
                </p>
                <p className="text-xs font-medium text-ink leading-snug">
                  B2B industrial AI platform running real-time computer vision pipelines at the edge to automate quality control and flag structural defects on manufacturing floors.
                </p>
                <p className="text-xs text-ink-faint leading-relaxed mt-2">
                  Reduces operational labor and material scrap costs for aerospace and defense clients by terminating defective print runs early, built under strict defense-grade ITAR compliance.
                </p>
              </div>

              <div className="border-t border-line pt-3.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1.5">
                  PM CONTRIBUTION
                </p>
                <p className="text-xs leading-relaxed text-ink-soft">
                  The core alerting decision: condition-based multi-layer filtering instead of static severity thresholds. That trade-off eliminated false-positive noise and turned operator trust from a blocker into a selling point. I also defined the on-premise deployment as a first-class product variant, not a cloud port, which opened accounts requiring air-gapped environments. Five enterprise contracts in five months followed from those two decisions.
                </p>
              </div>

              {/* AI Detection Feed */}
              <div className="border-t border-line pt-3.5 space-y-2.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
                  AI DETECTION FEED
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-sm overflow-hidden border border-line">
                    <img src="/ad85b8a1b7ae678f0364407f6e76752a9c3fa60a.png" alt="Raw anomaly capture" className="w-full h-16 object-cover" />
                    <p className="text-[8px] font-mono text-ink-faint text-center py-0.5 bg-paper-2 uppercase tracking-wider">Raw Feed</p>
                  </div>
                  <div className="rounded-sm overflow-hidden border border-line">
                    <img src="/ca0f1faccbe56083dad5a77684dd3de5485d8199.png" alt="AI-annotated anomaly detection" className="w-full h-16 object-cover" />
                    <p className="text-[8px] font-mono text-accent text-center py-0.5 bg-accent/10 uppercase tracking-wider font-medium">AI Active</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-line pt-3.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint font-medium mb-2.5">
                  MEASURABLE OUTCOMES
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "18%", label: "Scrap cost cut" },
                    { value: "90%", label: "Model accuracy" },
                    { value: "136h", label: "Hours saved" },
                    { value: "98%", label: "Workload cut" },
                  ].map((m) => (
                    <div
                      key={m.value}
                      className="bg-paper-2 rounded-sm p-2.5 border border-line hover:border-accent/40 transition-all duration-300 flex flex-col justify-between"
                    >
                      <p className="font-display font-light text-accent" style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)" }}>
                        {m.value}
                      </p>
                      <p className="text-[9px] text-ink-faint font-medium mt-0.5 leading-snug">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Prototype Console — stays dark (simulates real product UI) */}
            <div className="lg:col-span-9 h-[700px] md:h-[750px] lg:h-full min-h-0 border border-line rounded-sm flex flex-col overflow-hidden">
              <div className="px-4 pt-3 pb-2 border-b border-line flex-shrink-0 bg-paper-2">
                <p className="text-[10px] text-ink-faint leading-relaxed">
                  The core design problem: operators were receiving too many alerts to trust any of them. The prototype below is the solution I specified — condition-based rules that fire only when a defect crosses multiple thresholds across consecutive layers. Walk through the alert creation flow to see how the filtering logic works.
                </p>
              </div>
              <AmveroPrototype />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
