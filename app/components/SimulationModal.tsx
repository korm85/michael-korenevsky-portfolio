"use client";

import { useState, useEffect } from "react";

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimulationModal({ isOpen, onClose }: SimulationModalProps) {
  const [modalView, setModalView] = useState<"value" | "roi">("value");

  useEffect(() => {
    if (isOpen) {
      setModalView("value");
    }
  }, [isOpen]);

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
        className="w-full max-w-[94vw] xl:max-w-7xl h-[90dvh] md:h-[82vh] bg-canvas border border-border-dark rounded-2xl flex flex-col overflow-hidden animate-scale-in text-left select-text shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-dark bg-[#1a1b1d] flex-shrink-0">
          <div>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-teal-accent font-bold">
              PREDICTIVE SOLVER CASE STUDY
            </p>
            <h3 className="text-base md:text-xl font-bold text-white font-display">
              Physics-based Simulation Suite
            </h3>
          </div>
          <div className="flex items-center gap-4">
            {/* Switcher tabs */}
            <div className="flex p-0.5 rounded-lg bg-[#111213] border border-border-dark">
              <button
                onClick={() => setModalView("value")}
                className={`px-4 py-2 rounded-md text-[10px] md:text-sm font-mono uppercase font-bold tracking-wider transition-all ${
                  modalView === "value"
                    ? "bg-canvas text-teal-accent shadow-sm"
                    : "text-text-muted hover:text-white"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setModalView("roi")}
                className={`px-4 py-2 rounded-md text-[10px] md:text-sm font-mono uppercase font-bold tracking-wider transition-all ${
                  modalView === "roi"
                    ? "bg-canvas text-teal-accent shadow-sm"
                    : "text-text-muted hover:text-white"
                }`}
              >
                ROI Simulator
              </button>
            </div>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-text-muted hover:text-white hover:bg-surface border border-transparent hover:border-border-dark transition-all flex-shrink-0"
              aria-label="Close Case Study"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden p-6 md:p-8 min-h-0 bg-canvas">
          
          {/* VIEW 1: OVERVIEW & SPECS */}
          {modalView === "value" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full overflow-y-auto pr-2 animate-fade-in text-text-secondary">
              {/* Left Column: Scope & Docs */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-teal-accent font-bold mb-1.5">THE PRODUCT & MISSION</p>
                  <p className="text-sm md:text-xl font-bold text-white leading-snug">
                    Simulation software that predicts thermal stress, shrink, and warp before manufacturing, enabling clients to achieve first-time-right production and eliminate expensive physical trials.
                  </p>
                  <p className="text-xs md:text-base text-text-muted leading-relaxed mt-2">
                    Transforms complex thermo-mechanical physics equations into simple, automated tooling workflows that eliminate manufacturing defects on standard local workstation hardware.
                  </p>
                </div>

                <div className="border-t border-border-dark pt-4">
                  <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-teal-accent font-bold mb-1.5">PM CONTRIBUTION</p>
                  <p className="text-xs md:text-base leading-relaxed text-text-secondary">
                    Led simulation product strategy, roadmap, and pricing evolution. Collaborated with physics researchers to translate complex finite element solvers into intuitive, single-click visual script workflows, accelerating layout iteration loops. Managed customer beta validation and calibrated accuracy.
                  </p>
                </div>

                {/* Context Alert Block */}
                <div className="border-t border-border-dark pt-4">
                  <div className="rounded-xl bg-surface border border-border-dark p-4 text-xs md:text-sm">
                    <p className="font-bold text-white mb-1">ROI Pricing Simulator Context:</p>
                    <p className="text-text-secondary leading-relaxed">
                      The <strong>ROI Simulator</strong> tab contains a live comparison calculator designed by me. It models the consumption-based credit licensing system I created to align software costs with customer production volume, replacing legacy flat licensing fees.
                    </p>
                  </div>
                </div>

                {/* Source Documents */}
                <div className="border-t border-border-dark pt-4 space-y-1.5">
                  <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-text-muted font-bold">SOURCE DOCUMENTS</p>
                  <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                    <a
                      href="https://drive.google.com/file/d/13v5VOTdE8XOMEmy79SaHz6h4s8E_3VU8/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-dark bg-surface text-text-secondary hover:text-teal-accent hover:border-teal-accent/50 transition-all duration-300 font-mono font-bold tracking-wide shadow-sm hover:shadow group/doc"
                    >
                      <svg className="w-3.5 h-3.5 text-teal-accent/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Thermal Validation Whitepaper</span>
                    </a>
                    <a
                      href="https://drive.google.com/file/d/14xkfVrlu1sj1c3YY9w3R-xtejPW1yHgO/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-dark bg-surface text-text-secondary hover:text-teal-accent hover:border-teal-accent/50 transition-all duration-300 font-mono font-bold tracking-wide shadow-sm hover:shadow group/doc"
                    >
                      <svg className="w-3.5 h-3.5 text-teal-accent/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Customer Story: Tooling</span>
                    </a>
                    <a
                      href="https://drive.google.com/file/d/14yNMaShYmz9dlhq6LMOxtihkh4xPZvTe/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-dark bg-surface text-text-secondary hover:text-teal-accent hover:border-teal-accent/50 transition-all duration-300 font-mono font-bold tracking-wide shadow-sm hover:shadow group/doc"
                    >
                      <svg className="w-3.5 h-3.5 text-teal-accent/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Customer Story: Large Parts</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Outcomes + Hero Image */}
              <div className="md:col-span-5 space-y-4">
                {/* Product Hero Image */}
                <div className="rounded-xl overflow-hidden border border-border-dark shadow-sm bg-surface p-2">
                  <img
                    src="/simulation-knauf-fit.png"
                    alt="Simulation Suite first-time-right validation"
                    className="w-full h-auto object-contain bg-black"
                  />
                </div>

                <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-text-muted font-bold">MEASURABLE OUTCOMES</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface rounded-xl p-4 border border-border-dark hover:border-teal-accent/35 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
                    <p className="text-3xl md:text-4xl font-display font-extrabold tracking-tight italic text-teal-accent">80%</p>
                    <p className="text-xs text-text-muted font-medium mt-1 leading-snug">Reduction in manufacturing errors verified by partner</p>
                  </div>
                  <div className="bg-surface rounded-xl p-4 border border-border-dark hover:border-teal-accent/35 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
                    <p className="text-3xl md:text-4xl font-display font-extrabold tracking-tight italic text-teal-accent">&lt;150µm</p>
                    <p className="text-xs text-text-muted font-medium mt-1 leading-snug">Maximum measured distortion limit met</p>
                  </div>
                  <div className="bg-surface rounded-xl p-4 border border-border-dark hover:border-teal-accent/35 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
                    <p className="text-3xl md:text-4xl font-display font-extrabold tracking-tight italic text-teal-accent">99%+</p>
                    <p className="text-xs text-text-muted font-medium mt-1 leading-snug">Accuracy achieved via digital shrink compensation</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: ROI SIMULATOR */}
          {modalView === "roi" && (
            <iframe
              src="/tools/amvero-roi-optimizer.html"
              className="w-full h-full border-0 rounded-xl"
              sandbox="allow-scripts allow-forms allow-popups"
              title="ROI Licensing Simulator"
            />
          )}

        </div>
      </div>
    </div>
  );
}
