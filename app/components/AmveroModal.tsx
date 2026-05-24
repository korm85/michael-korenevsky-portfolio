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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[96vw] xl:max-w-7xl h-[92dvh] bg-canvas border border-border-dark rounded-2xl flex flex-col overflow-hidden animate-scale-in text-left select-text shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-dark bg-[#1a1b1d] flex-shrink-0">
          <div>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-teal-accent font-bold">
              AI PRODUCT CASE STUDY & INTERACTIVE PROTOTYPE
            </p>
            <h3 className="text-base md:text-xl font-bold text-white font-display">
              AMVero Anomaly Detection Suite
            </h3>
          </div>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-text-muted hover:text-white hover:bg-surface border border-transparent hover:border-border-dark transition-all flex-shrink-0"
            aria-label="Close Case Study"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden p-4 md:p-6 min-h-0 bg-canvas">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
            {/* Left Column: Overview (scrollable, occupies 3 columns) */}
            <div className="lg:col-span-3 flex flex-col h-full overflow-y-auto pr-2 min-h-0 space-y-5 border-b lg:border-b-0 lg:border-r border-border-dark pb-4 lg:pb-0 lg:pr-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-teal-accent font-bold mb-1.5">
                  THE PRODUCT & MISSION
                </p>
                <p className="text-xs font-bold text-white leading-snug">
                  B2B SaaS Industrial AI platform running real-time computer vision pipelines at the edge to automate quality control and flag structural defects on manufacturing floors.
                </p>
                <p className="text-xs text-text-muted leading-relaxed mt-2">
                  Reduces operational labor and material scrap costs for B2B aerospace and defense clients by terminating defective print runs early, built under strict defense-grade ITAR compliance.
                </p>
              </div>

              <div className="border-t border-border-dark pt-3.5">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-teal-accent font-bold mb-1.5">
                  PM CONTRIBUTION
                </p>
                <p className="text-xs leading-relaxed text-text-secondary">
                  Owned the product backlog end-to-end: managed Scrum sprints to sign 5 enterprise customers (e.g. Baker Hughes, Thales) in 5 months. Defined warning thresholds and alerting logic to mitigate operator alarm fatigue, curating training data to improve model accuracy to 90%.
                </p>
              </div>

              {/* AI Before/After */}
              <div className="border-t border-border-dark pt-3.5 space-y-2.5">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-teal-accent font-bold">
                  AI DETECTION FEED
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg overflow-hidden border border-border-dark">
                    <img src="/ad85b8a1b7ae678f0364407f6e76752a9c3fa60a.png" alt="Raw anomaly capture" className="w-full h-16 object-cover" />
                    <p className="text-[8px] font-mono text-text-muted text-center py-0.5 bg-surface uppercase tracking-wider">Raw Feed</p>
                  </div>
                  <div className="rounded-lg overflow-hidden border border-border-dark">
                    <img src="/ca0f1faccbe56083dad5a77684dd3de5485d8199.png" alt="AI-annotated anomaly detection" className="w-full h-16 object-cover" />
                    <p className="text-[8px] font-mono text-teal-accent text-center py-0.5 bg-teal-accent-dim uppercase tracking-wider font-bold">AI Active</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border-dark pt-3.5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted font-bold mb-2.5">MEASURABLE OUTCOMES</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-surface rounded-lg p-2.5 border border-border-dark hover:border-teal-accent/35 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
                    <p className="text-lg md:text-xl font-display font-extrabold tracking-tight italic text-teal-accent">18%</p>
                    <p className="text-[9px] text-text-muted font-semibold mt-0.5 leading-snug">Scrap cost cut</p>
                  </div>
                  <div className="bg-surface rounded-lg p-2.5 border border-border-dark hover:border-teal-accent/35 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
                    <p className="text-lg md:text-xl font-display font-extrabold tracking-tight italic text-teal-accent">90%</p>
                    <p className="text-[9px] text-text-muted font-semibold mt-0.5 leading-snug">Model accuracy</p>
                  </div>
                  <div className="bg-surface rounded-lg p-2.5 border border-border-dark hover:border-teal-accent/35 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
                    <p className="text-lg md:text-xl font-display font-extrabold tracking-tight italic text-teal-accent">136h</p>
                    <p className="text-[9px] text-text-muted font-semibold mt-0.5 leading-snug">Hours saved</p>
                  </div>
                  <div className="bg-surface rounded-lg p-2.5 border border-border-dark hover:border-teal-accent/35 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
                    <p className="text-lg md:text-xl font-display font-extrabold tracking-tight italic text-teal-accent">98%</p>
                    <p className="text-[9px] text-text-muted font-semibold mt-0.5 leading-snug">Workload cut</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Prototype Console (occupies 9 columns) */}
            <div className="lg:col-span-9 h-[700px] md:h-[750px] lg:h-full min-h-0 border border-border-dark rounded-xl flex flex-col">
              <AmveroPrototype />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
