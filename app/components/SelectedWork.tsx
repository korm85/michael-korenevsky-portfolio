"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useScrollReveal } from "../hooks/useScrollReveal";
import RoiCalculator from "./RoiCalculator";

function useDialogBehavior(onClose: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);
}

interface Doc {
  name: string;
  url: string;
  subtitle?: string;
}

interface Quote {
  text: string;
  author: string;
  role: string;
}

interface PrdQuote {
  text: string;
  linkLabel: string;
  linkUrl: string;
}

interface DecisionLink {
  label: string;
  url?: string;
  subtitle?: string;
  onClick?: () => void;
}

type Decision = string | { label?: string; impact?: string; text: string; links?: DecisionLink[] };

interface WorkArticleProps {
  id: string;
  caseNumber: string;
  eyebrow: string;
  roleTag: string;
  title: string;
  mandate: string;
  leadership: string;
  decisions?: Decision[];
  image: string;
  imageAlt: string;
  metrics: { value: string; label: string }[];
  customerLine: string;
  ctaLabel?: string;
  ctaContext?: string;
  onCta?: () => void;
  docs: Doc[];
  quote?: Quote;
  prdQuote?: PrdQuote;
  onOverlayOpen?: (doc: DocRef) => void;
  onImageClick?: (src: string, alt: string) => void;
}

function ArrowIcon() {
  return (
    <svg
      className="w-3 h-3 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M17 7H7M17 7v10" />
    </svg>
  );
}

interface DocRef {
  url: string;
  title: string;
  subtitle?: string;
}

// Generic in-site document viewer. Any same-origin artifact, HTML page, PDF,
// or interactive tool, opens here in an iframe so the visitor never leaves the
// site. Zoom applies to HTML docs; PDFs use the browser viewer's own controls.
function DocOverlay({ doc, onClose }: { doc: DocRef; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isPdf = doc.url.toLowerCase().endsWith(".pdf");

  // The modal opens via JS, so focus never naturally lands inside it;
  // Chromium's native PDF viewer stays inert until its frame is focused,
  // which is what a manual "second click" was actually doing. Mount after
  // the entrance animation settles, then focus the iframe ourselves so the
  // PDF renders without the visitor having to click it.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 260);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => iframeRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [ready]);

  // Once focus moves into the (same-origin) iframe, Escape keydowns fire on
  // its own contentWindow and never reach the outer window listener in
  // useDialogBehavior; forward it manually so Escape still closes the dialog.
  // contentWindow exists as soon as the iframe element is created, well
  // before its 'load' event fires; attach immediately rather than waiting
  // for 'load', which races and can fire before the listener is attached on
  // fast-loading (especially cached) documents, silently breaking Escape.
  useEffect(() => {
    if (!ready) return;
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onFrameKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    let attachedWindow: Window | null = null;
    let attempts = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    const tryAttach = () => {
      try {
        const win = iframe.contentWindow;
        if (win) {
          win.addEventListener("keydown", onFrameKeydown);
          attachedWindow = win;
          return;
        }
      } catch {}
      if (attempts++ < 20) retryTimer = setTimeout(tryAttach, 25);
    };
    tryAttach();
    // Re-attach on 'load' too, in case the frame navigates and gets a fresh
    // window object after the initial attach.
    const onLoad = () => tryAttach();
    iframe.addEventListener("load", onLoad);
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      iframe.removeEventListener("load", onLoad);
      try {
        attachedWindow?.removeEventListener("keydown", onFrameKeydown);
      } catch {}
    };
  }, [ready, onClose]);

  const applyZoom = (z: number) => {
    if (isPdf) return;
    try {
      const body = iframeRef.current?.contentWindow?.document?.body;
      if (body) body.style.zoom = String(z);
    } catch {}
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => {
      const next = Math.min(2, Math.max(0.75, Math.round((prev + delta) * 4) / 4));
      applyZoom(next);
      return next;
    });
  };

  useDialogBehavior(onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={doc.title}
    >
      <div
        className="w-full max-w-5xl h-[90dvh] bg-paper border border-line rounded-sm flex flex-col overflow-hidden animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center gap-4 px-6 py-4 border-b border-line bg-paper-2 flex-shrink-0">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent-deep font-medium">
              {doc.subtitle ?? "Document"}
            </p>
            <h3 className="text-base font-display font-light text-ink mt-0.5 truncate">
              {doc.title}
            </h3>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {!isPdf && (
              <div className="flex items-center border border-line rounded-sm overflow-hidden">
                <button
                  onClick={() => handleZoom(-0.25)}
                  className="px-3 py-1.5 font-mono text-sm text-ink-soft hover:text-ink hover:bg-line/30 transition-colors border-r border-line"
                  aria-label="Zoom out"
                >
                  −
                </button>
                <span className="font-mono text-[10px] text-ink-soft w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => handleZoom(0.25)}
                  className="px-3 py-1.5 font-mono text-sm text-ink-soft hover:text-ink hover:bg-line/30 transition-colors border-l border-line"
                  aria-label="Zoom in"
                >
                  +
                </button>
              </div>
            )}
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-soft hover:text-accent-deep transition-colors"
              aria-label="Open in a new tab"
            >
              New tab
              <ArrowIcon />
            </a>
            <button
              onClick={onClose}
              className="p-1 rounded-sm text-ink-faint hover:text-ink hover:bg-line/40 border border-transparent hover:border-line transition-all"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* iframe */}
        <div className="flex-1 overflow-auto bg-paper">
          {ready ? (
            // No sandbox: these are all first-party artifacts under /artifacts
            // and /tools. Sandboxing blocks Chromium's built-in PDF viewer, and
            // the HTML zoom hook needs same-origin document access.
            <iframe
              ref={iframeRef}
              src={doc.url}
              className="w-full border-0"
              style={{ minHeight: "100%", height: "100%" }}
              onLoad={() => {
                applyZoom(zoom);
                iframeRef.current?.focus();
              }}
              title={doc.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">
                Loading…
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// The Credit Pricing Model renders natively (no iframe): it's a responsive
// React component, so it reflows instead of needing the doc overlay's zoom
// hook, and Escape/focus work through the normal dialog path.
function PricingOverlay({ onClose }: { onClose: () => void }) {
  useDialogBehavior(onClose);

  // JS-opened dialog: focus never lands inside on its own (same lesson as the
  // doc overlay's PDF fix); move it to the panel so Escape and Tab work
  // immediately.
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  // A slider drag that starts inside the panel and releases over the backdrop
  // fires the click on the backdrop (common ancestor of down/up targets);
  // close only when the pointer went DOWN on the backdrop itself, so dragging
  // a slider can never dismiss the dialog.
  const downOnBackdrop = useRef(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-md animate-fade-in"
      onPointerDown={(e) => {
        downOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (downOnBackdrop.current && e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Credit Pricing Model, interactive pricing tool"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="w-full max-w-6xl max-h-[92dvh] bg-paper border border-line rounded-sm flex flex-col overflow-hidden animate-scale-in shadow-2xl outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center gap-4 px-6 py-4 border-b border-line bg-paper-2 flex-shrink-0">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent-deep font-medium">
              Interactive pricing tool
            </p>
            <h3 className="text-base md:text-xl font-display font-light text-ink mt-0.5">
              Credit Pricing Model
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

        {/* Framing + tool */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-paper">
          <div className="px-6 pt-4 pb-1">
            <p className="text-[11px] text-ink-faint leading-relaxed max-w-3xl">
              The model behind AMVero&apos;s pricing decision: moving from flat
              per-seat licenses to consumption-based credits that scale with
              production volume. Adjust the variables to see where each model
              wins and where they break even.
            </p>
          </div>
          <div className="p-6 pt-4">
            <RoiCalculator />
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageOverlay({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useDialogBehavior(onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-ink/85 backdrop-blur-sm animate-fade-in cursor-zoom-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain rounded-sm shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function WorkArticle({
  id,
  caseNumber,
  eyebrow,
  roleTag,
  title,
  mandate,
  leadership,
  decisions,
  image,
  imageAlt,
  metrics,
  customerLine,
  ctaLabel,
  ctaContext,
  onCta,
  docs,
  quote,
  onOverlayOpen,
  onImageClick,
}: WorkArticleProps) {
  const ref = useScrollReveal();
  return (
    <article id={id} ref={ref} className="scroll-mt-20 pb-4 last:pb-0">
      {/* The PM story owns the larger, first-read column. The product visual
          is supporting evidence, positioned to the right on desktop. */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)] gap-10 xl:gap-20 items-start mb-12">
        {/* Content */}
        <div>
          <div className="grid grid-cols-[auto_1fr] gap-x-5 md:gap-x-7">
            <p className="font-display leading-none text-accent-deep/25" style={{ fontSize: "clamp(3.4rem, 6vw, 6.5rem)" }}>
              {caseNumber}
            </p>
            <div className="pt-1 md:pt-3">
              <p className="mb-3 font-mono text-[0.78rem] uppercase tracking-[0.12em] text-accent-deep">Product work</p>
              <h3
                className="font-display font-light text-ink leading-tight mb-5 text-balance"
                style={{ fontSize: "clamp(1.65rem, 2.9vw, 2.8rem)" }}
              >
                {title}
              </h3>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-x-5 gap-y-2">
            <span className="font-mono text-[0.78rem] uppercase tracking-[0.09em] font-medium text-accent-deep">{roleTag}</span>
            <span className="font-mono text-[0.78rem] uppercase tracking-[0.09em] text-ink-faint">{eyebrow}</span>
          </div>

          {/* Outcomes appear before the detail so a recruiter can assess the
              result before deciding how deeply to read the case. */}
          <div className="mb-9 grid gap-3 sm:grid-cols-3">
            {metrics.map((m, i) => (
              <div key={i} className="bg-ink p-5 xl:p-6">
                <div
                  className="font-display text-accent font-light leading-none mb-3 tabular-nums"
                  style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.9rem)" }}
                >
                  {m.value}
                </div>
                <div className="text-[0.86rem] xl:text-[0.92rem] text-on-dark-soft leading-relaxed">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-7">
            <div className="grid grid-cols-[112px_1fr] gap-5">
              <p className="font-mono text-[0.78rem] uppercase tracking-[0.09em] font-medium text-accent-deep pt-0.5">
                The challenge
              </p>
              <p className="text-ink-soft leading-relaxed text-[1rem] xl:text-[1.06rem]">{mandate}</p>
            </div>
            <div className="grid grid-cols-[112px_1fr] gap-5">
              <p className="font-mono text-[0.78rem] uppercase tracking-[0.09em] font-medium text-accent-deep pt-0.5">
                My role
              </p>
              <p className="text-ink-soft leading-relaxed text-[1rem] xl:text-[1.06rem]">{leadership}</p>
            </div>
          </div>

        </div>

        <aside className="lg:self-start">
          <div
            className={`relative aspect-[5/4] overflow-hidden rounded-sm ${onImageClick ? "cursor-zoom-in" : ""}`}
            onClick={() => onImageClick?.(image, imageAlt)}
            role={onImageClick ? "button" : undefined}
            tabIndex={onImageClick ? 0 : undefined}
            aria-label={onImageClick ? `Enlarge image: ${imageAlt}` : undefined}
            onKeyDown={(e) => {
              if (onImageClick && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onImageClick(image, imageAlt);
              }
            }}
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 1280px) 680px, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
            <div className="absolute top-3 left-3">
              <span className="font-mono text-[0.78rem] uppercase tracking-[0.09em] bg-paper/90 backdrop-blur-sm text-ink-soft border border-line px-3 py-2 rounded-sm">
                Product evidence
              </span>
            </div>
          </div>
          {ctaLabel && onCta && (
            <div className="mt-5">
              <p className="text-ink-soft text-[0.95rem] leading-relaxed mb-3">
                {ctaContext}
              </p>
              <button
                onClick={onCta}
                className="inline-flex items-center gap-2 font-mono text-[0.78rem] uppercase tracking-[0.07em] bg-ink text-paper border border-ink px-4 py-3 rounded-sm hover:bg-accent-deep hover:border-accent-deep transition-all duration-300 group"
                style={{ transform: "translateY(0)" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                {ctaLabel}
                <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowIcon />
                </span>
              </button>
              {docs.length > 0 && (
                <div className="mt-5">
                  <p className="font-mono text-[0.78rem] uppercase tracking-[0.1em] text-ink-faint mb-3">
                    Supporting evidence
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {docs.map((doc, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          onOverlayOpen?.({ url: doc.url, title: doc.name, subtitle: doc.subtitle })
                        }
                        className="inline-flex items-center gap-1.5 font-mono text-[0.78rem] uppercase tracking-[0.06em] border border-line text-ink-soft hover:border-accent hover:text-accent-deep rounded-sm px-3 py-2 transition-all duration-200 group"
                      >
                        {doc.name}
                        <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                          <ArrowIcon />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      <div className="pt-8">
        <p className="mb-8 text-[1rem] text-ink-soft xl:text-[1.08rem]">
          <span className="mr-3 font-mono text-[0.78rem] font-medium uppercase tracking-[0.09em] text-accent-deep">Selected customers</span>
          {customerLine}
        </p>

        {decisions && decisions.length > 0 && (
          <div className="mt-14">
            <p className="font-mono text-[0.78rem] font-medium uppercase tracking-[0.1em] text-accent-deep">03 / Product decisions</p>
            <h4 className="mt-3 font-display text-[clamp(1.9rem,3.4vw,3rem)] font-light leading-tight text-ink">The decisions that made the product useful</h4>
            <p className="mt-3 max-w-3xl text-[1rem] leading-relaxed text-ink-soft xl:text-[1.08rem]">Each choice starts with the customer problem and ends with the practical result.</p>
            <ul className="mt-8 space-y-4">
              {decisions.slice(0, 3).map((d, i) => {
                const text = typeof d === "string" ? d : d.text;
                const label = typeof d === "string" ? undefined : d.label;
                const impact = typeof d === "string" ? undefined : d.impact;
                const links = typeof d !== "string" ? d.links : undefined;
                const chip =
                  "font-mono text-[0.75rem] uppercase tracking-[0.06em] border border-accent-deep/40 text-accent-deep hover:bg-accent-deep hover:text-paper transition-colors rounded-sm px-3 py-2 whitespace-nowrap";
                return (
                  <li key={i} className="grid gap-5 bg-paper-2 p-6 md:grid-cols-[minmax(230px,0.7fr)_minmax(0,1.3fr)] md:gap-12 md:p-8 xl:gap-20">
                    <div>
                      <p className="font-mono text-[0.75rem] uppercase tracking-[0.09em] text-ink-faint">Decision 0{i + 1}</p>
                      {label && (
                        <h5 className="mt-2 font-display text-[1.4rem] font-light leading-tight text-ink">{label}</h5>
                      )}
                      {impact && (
                        <p className="mt-2 text-[0.95rem] font-medium leading-relaxed text-accent-deep">{impact}</p>
                      )}
                    </div>
                    <div className="text-[1rem] leading-relaxed text-ink-soft xl:text-[1.08rem]">
                      <p>{text}</p>
                      {links && links.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {links.map((link) =>
                            link.onClick ? (
                              <button key={link.label} onClick={link.onClick} className={chip}>{link.label} ↗</button>
                            ) : link.url && onOverlayOpen ? (
                              <button key={link.label} onClick={() => onOverlayOpen({ url: link.url!, title: link.label, subtitle: link.subtitle })} className={chip}>{link.label} ↗</button>
                            ) : null
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Pullquote */}
      {quote && (
        <figure className="mb-8">
          <blockquote
            className="font-display font-light italic text-ink-soft leading-snug mb-4"
            style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.7rem)" }}
          >
            <span className="text-accent-deep not-italic">&ldquo;</span>
            {quote.text}
            <span className="text-accent-deep not-italic">&rdquo;</span>
          </blockquote>
          <figcaption className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint text-right">
            {quote.author} · {quote.role}
          </figcaption>
        </figure>
      )}

    </article>
  );
}

interface SelectedWorkProps {
  onOpenAmvero: () => void;
  onOpenSimulation: () => void;
}

export default function SelectedWork({ onOpenAmvero, onOpenSimulation }: SelectedWorkProps) {
  const [doc, setDoc] = useState<DocRef | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [overlayImage, setOverlayImage] = useState<{ src: string; alt: string } | null>(null);

  // Site-wide entry points: the action panel and any other component can open
  // the pricing tool or an arbitrary in-site document via window events.
  useEffect(() => {
    const openPricing = () => setPricingOpen(true);
    const openDoc = (e: Event) => {
      const d = (e as CustomEvent<DocRef>).detail;
      if (d?.url) setDoc({ url: d.url, title: d.title ?? "Document", subtitle: d.subtitle });
    };
    window.addEventListener("open-pricing-model", openPricing);
    window.addEventListener("open-doc-overlay", openDoc as EventListener);
    return () => {
      window.removeEventListener("open-pricing-model", openPricing);
      window.removeEventListener("open-doc-overlay", openDoc as EventListener);
    };
  }, []);

  return (
    <section id="work" className="bg-paper px-6 py-14 md:py-24 xl:py-28">
      <div className="max-w-[1360px] mx-auto">
        <div className="mb-14">
          <p className="font-mono text-[0.78rem] font-medium uppercase tracking-[0.1em] text-accent-deep">01 / Product work</p>
          <h2 className="mt-3 font-display font-light leading-tight text-ink" style={{ fontSize: "clamp(2.2rem, 5.4vw, 3.8rem)" }}>
            Selected product work
          </h2>
          <p className="mt-4 max-w-3xl text-[1.05rem] leading-relaxed text-ink-soft xl:text-[1.15rem]">
            The outcome comes first. Then see the customer problem, my role, the decisions I made, and the evidence behind the work.
          </p>
        </div>

        <div className="space-y-12 md:space-y-16">
          <WorkArticle
            id="ai-monitoring"
            caseNumber="01"
            eyebrow="Oqton · 2025–Present"
            roleTag="Senior PM, AI Platform"
            title="Turned an alert-heavy AI pilot into a trusted product used by five enterprise customers"
            mandate="Turn an AI monitoring pilot that operators did not trust into a product customers could buy, install, and rely on."
            leadership="Led product strategy from customer discovery through requirements, pricing, launch, and deployment. Led an international group across 6 engineers, 2 designers, 2 marketing partners, 3 sales partners, and 5 application engineers."
            decisions={[
              {
                label: "Signal over noise",
                impact: "Outcome: ~90% fewer layers for engineers to review",
                text: "Operators were reviewing alerts on roughly 3,000 of 6,000 layers, so they could not tell which events needed action. I set rules that required the same issue across multiple layers before raising an alert. That cut the review set by about 90% and let engineers focus on genuinely critical events.",
              },
              {
                label: "Roadmap judgment",
                impact: "Outcome: better operator visibility and protected uptime",
                text: "In the closed on-premise environments we served, a few known users could work without SSO. The more urgent customer need was knowing when the system was unhealthy, so I deferred SSO and shipped Diagnostics first. That gave operators a way to spot and fix reliability problems before production was disrupted.",
              },
              {
                label: "Enterprise adoption",
                impact: "Outcome: self-deployment in one day, not days of support",
                text: "Command-line installation made customers depend on days of technical support before they could see value. I prioritized a guided installer and documentation so they could self-deploy in one day and begin using the product without waiting on our team.",
              },
            ]}
            image="/amvero-product.png"
            imageAlt="AMVero AI monitoring dashboard"
            metrics={[
              { value: "98%", label: "Reduction in active monitoring time, Baker Hughes" },
              { value: "18%", label: "Scrap cost reduction via mid-run failure detection" },
              { value: "5", label: "Enterprise clients in 5 months" },
            ]}
            customerLine="Baker Hughes · Thales · Elos Medtech · 3D Systems · Beehive"
            onOverlayOpen={setDoc}
            onImageClick={(src, alt) => setOverlayImage({ src, alt })}
            docs={[
              { name: "Alerts PRD", url: "/artifacts/amvero-smart-alerting-prd.html", subtitle: "Product spec" },
              { name: "Deployment Playbook", url: "/artifacts/amvero-enterprise-deployment-playbook.html", subtitle: "Playbook" },
              { name: "GTM Narrative", url: "/artifacts/amvero-go-to-market-narrative.html", subtitle: "GTM document" },
            ]}
            ctaLabel="Open AI monitoring prototype"
            ctaContext="Try the condition-based alert flow that made critical events easier to find."
            onCta={onOpenAmvero}
            quote={{
              text: "We've seen a 98% reduction in engineering review time per build, allowing our team to focus on more critical tasks. This, combined with an 18% reduction in scrap costs, has delivered a powerful return on investment.",
              author: "Amar Patel",
              role: "Digital Transformation Lead, Baker Hughes",
            }}
          />

          <WorkArticle
            id="predictive-simulation"
            caseNumber="02"
            eyebrow="Oqton · 2022–2025"
            roleTag="Product Manager, Simulation"
            title="Turned a third-party physics engine into an enterprise product that helped manufacturers get 3D-printed parts right on the first production run"
            mandate="Turn a third-party physics engine into a product that helped manufacturers predict how a 3D-printed part would behave before committing time and material to a production run."
            leadership="Led 5 engineers, 2 designers, 2 sales partners, and 2 application engineers from first launch through enterprise adoption. Turned complex physics into a workflow manufacturing engineers could use, then tested it with customers."
            decisions={[
              { label: "From engine to production tool", impact: "Outcome: more accurate predictions before committing to a production run", text: "At first, the product predicted separate parts of the printing process. I led the move to a complete thermo-mechanical prediction that captured the full picture. Manufacturers could make higher-confidence production decisions before spending time and material on a build." },
              { label: "Made it usable", impact: "Outcome: manufacturing engineers could use it without specialist infrastructure", text: "Manufacturing engineers needed a tool they could run without simulation specialists or dedicated servers. I made standard workstation support and clear pass/fail outputs product requirements, so more teams could use the product with confidence." },
              { label: "Proved it before launch", impact: "Outcome: confidence to change a production process", text: "Customers would only change a production process if the predictions matched real parts. I tested the results with Knauf and Emerson before launch, giving users confidence in the predictions and the launch team measured proof." },
            ]}
            image="/simulation-knauf-fit.png"
            imageAlt="Predictive simulation structural fit validation"
            metrics={[
              { value: "80%", label: "Fewer dimensional errors on a large-format industrial part, 20+ hour production run" },
              { value: "~100%", label: "Of dimensional distortion compensated by predictive pre-deformation" },
              { value: "<150µm", label: "Maximum measured deviation on the same large-format part" },
            ]}
            customerLine="Knauf · Emerson · Wärtsilä"
            ctaLabel="Open simulation validation"
            ctaContext="See the validation evidence behind predictions that supported first-time-right production."
            onCta={onOpenSimulation}
            onOverlayOpen={setDoc}
            onImageClick={(src, alt) => setOverlayImage({ src, alt })}
            docs={[
              { name: "Thermal Whitepaper", url: "/artifacts/simulation-thermal-whitepaper.html", subtitle: "Whitepaper" },
              { name: "Customer Story: Tooling", url: "/artifacts/simulation-customer-story-tooling.html", subtitle: "Customer story" },
              { name: "Customer Story: Large Parts", url: "/artifacts/simulation-customer-story-large-parts.html", subtitle: "Customer story" },
            ]}
            quote={{
              text: "We have achieved a lightweight component we would have never imagined creating before this project. This application creates new sparks for more AM applications in the marine industry.",
              author: "Francesco Trevisan",
              role: "AM Expert, Wärtsilä",
            }}
          />
        </div>
      </div>

      {doc && <DocOverlay doc={doc} onClose={() => setDoc(null)} />}
      {pricingOpen && <PricingOverlay onClose={() => setPricingOpen(false)} />}
      {overlayImage && <ImageOverlay src={overlayImage.src} alt={overlayImage.alt} onClose={() => setOverlayImage(null)} />}
    </section>
  );
}
