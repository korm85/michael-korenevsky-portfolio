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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="AMVero product work and interactive prototype"
    >
      <div
        className="w-full max-w-[96vw] xl:max-w-7xl h-[92dvh] bg-paper border border-line rounded-sm flex flex-col overflow-hidden animate-scale-in text-left select-text shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-line bg-paper-2 flex-shrink-0">
          <div>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-accent-deep font-medium">
              PRODUCT WORK & INTERACTIVE EVIDENCE
            </p>
            <h3 className="text-base md:text-xl font-display font-light text-ink mt-0.5">
              From alert noise to operator trust
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
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent-deep font-medium mb-1.5">
                  MY MANDATE
                </p>
                <p className="text-[0.82rem] font-medium text-ink leading-snug">
                  Turn an AI monitoring pilot that operators did not trust into a product customers could buy, install, and rely on.
                </p>
                <p className="text-[0.82rem] text-ink-faint leading-relaxed mt-2">
                  I led product strategy from customer discovery through requirements, pricing, launch, and deployment across engineering, design, sales, marketing, and application engineering.
                </p>
              </div>

              <div className="border-t border-line pt-3.5">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent-deep font-medium mb-1.5">
                  KEY PRODUCT JUDGMENT
                </p>
                <p className="text-[0.82rem] leading-relaxed text-ink-soft">
                  On one customer workflow, half of 6,000 layers triggered alerts. The model was finding issues, but operators had too many alerts to act on. I required the same issue across multiple layers before raising an alert, cutting the review list by about 90%. In closed on-premise environments, the bigger need was keeping the system reliable, so I prioritized a health-check tool over SSO. I also replaced command-line installation with guided setup so customers could get running without days of support.
                </p>
              </div>

              <div className="border-t border-line pt-3.5">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-faint font-medium mb-1.5">
                  PRODUCT CONTEXT
                </p>
                <p className="text-[0.82rem] leading-relaxed text-ink-faint">
                  AMVero analyzes manufacturing data as a build runs, helping operators catch structural defects early, reduce review time, and avoid wasted material.
                </p>
              </div>

              {/* AI Detection Feed */}
              <div className="border-t border-line pt-3.5 space-y-2.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-deep font-medium">
                  AI DETECTION FEED
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-sm overflow-hidden border border-line">
                    <img src="/ad85b8a1b7ae678f0364407f6e76752a9c3fa60a.png" alt="Raw anomaly capture" className="w-full h-16 object-cover" />
                    <p className="text-[8px] font-mono text-ink-faint text-center py-0.5 bg-paper-2 uppercase tracking-wider">Raw Feed</p>
                  </div>
                  <div className="rounded-sm overflow-hidden border border-line">
                    <img src="/ca0f1faccbe56083dad5a77684dd3de5485d8199.png" alt="AI-annotated anomaly detection" className="w-full h-16 object-cover" />
                    <p className="text-[8px] font-mono text-accent-deep text-center py-0.5 bg-accent/10 uppercase tracking-wider font-medium">AI Active</p>
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
                    { value: "~50%", label: "Machine time recovered per rejected part" },
                    { value: "136h", label: "Saved per printer / year" },
                    { value: "98%", label: "Active monitoring time cut" },
                  ].map((m) => (
                    <div
                      key={m.value}
                      className="bg-paper-2 rounded-sm p-2.5 border border-line hover:border-accent/40 transition-all duration-300 flex flex-col justify-between"
                    >
                      <p className="font-display font-light text-accent-deep" style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)" }}>
                        {m.value}
                      </p>
                      <p className="text-[9px] text-ink-faint font-medium mt-0.5 leading-snug">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Prototype Console; stays dark to simulate the real product UI */}
            <div className="lg:col-span-9 h-[72dvh] md:h-[75dvh] lg:h-full min-h-0 border border-line rounded-sm flex flex-col overflow-hidden">
              <div className="px-4 pt-3 pb-2 border-b border-line flex-shrink-0 bg-paper-2">
                <p className="text-[10px] text-ink-faint leading-relaxed">
                  This prototype shows the decision in practice. Walk through the condition-based alert flow to see how the filtering logic addressed operator trust, or switch on <span className="font-mono text-[9px] uppercase tracking-wider text-accent-deep">PM Notes</span> to see the product judgments annotated in place.
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
