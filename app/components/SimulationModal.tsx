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
      aria-label="Predictive simulation product work"
    >
      <div
        className="w-full max-w-[94vw] xl:max-w-7xl h-[90dvh] md:h-[82vh] bg-paper border border-line rounded-sm flex flex-col overflow-hidden animate-scale-in text-left select-text shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-line bg-paper-2 flex-shrink-0">
          <div>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-accent-deep font-medium">
              PRODUCT WORK & VALIDATION EVIDENCE
            </p>
            <h3 className="text-base md:text-xl font-display font-light text-ink mt-0.5">
              From physics engine to production tool
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
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent-deep font-medium mb-1.5">
                  MY MANDATE
                </p>
                <p className="text-sm md:text-xl font-display font-light text-ink leading-snug">
                  Turn a third-party physics engine into a product that helped manufacturers predict how a 3D-printed part would behave before committing time and material to a production run.
                </p>
                <p className="text-[0.82rem] md:text-sm text-ink-faint leading-relaxed mt-2">
                  I led 5 engineers with design, sales, and application engineering partners from first launch through enterprise adoption, turning complex physics into a workflow customers could test before launch.
                </p>
              </div>

              <div className="border-t border-line pt-4">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent-deep font-medium mb-1.5">
                  KEY PRODUCT JUDGMENT
                </p>
                <p className="text-[0.82rem] md:text-sm leading-relaxed text-ink-soft">
                  At first, the product predicted separate parts of the printing process. I led the move to a complete thermo-mechanical prediction that captured the full picture and gave manufacturers more accurate predictions before a production run. Standard workstation support and simple pass/fail outputs made the product usable without specialist infrastructure. Testing the results with customers gave them confidence in the predictions before launch.
                </p>
              </div>

              <div className="border-t border-line pt-4">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-faint font-medium mb-1.5">
                  PRODUCT CONTEXT
                </p>
                <p className="text-[0.82rem] md:text-sm leading-relaxed text-ink-faint">
                  The product predicts how a 3D-printed part will behave before it is made, so teams can correct likely problems before spending time and material on a production run.
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
              <div className="rounded-sm overflow-hidden border border-line bg-paper-2">
                <div className="px-3 pt-2.5 pb-1.5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent-deep font-medium">
                    Beta Validation
                  </p>
                </div>
                <div className="px-2 pb-2">
                  <img
                    src="/simulation-knauf-fit.png"
                    alt="Structural fit validation from the Knauf beta"
                    className="w-full h-auto object-contain rounded-sm"
                  />
                </div>
                <p className="px-3 pb-2.5 text-[10px] text-ink-faint leading-relaxed">
                  Structural fit validation from the Knauf beta: distortion
                  predicted and compensated before the part was manufactured.
                </p>
              </div>

              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint font-medium">
                MEASURABLE OUTCOMES
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "80%", label: "Reduction in manufacturing errors" },
                  { value: "<150µm", label: "Maximum measured distortion limit met" },
                  { value: "~100%", label: "Distortion compensated via predictive pre-deformation" },
                ].map((m) => (
                  <div
                    key={m.value}
                    className="bg-paper-2 rounded-sm p-4 border border-line hover:border-accent/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    <p
                      className="font-display font-light text-accent-deep leading-none mb-1"
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
