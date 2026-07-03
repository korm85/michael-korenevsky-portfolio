"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useScrollReveal } from "../hooks/useScrollReveal";

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

type Decision = string | { text: string; links?: DecisionLink[] };

interface WorkArticleProps {
  eyebrow: string;
  roleTag: string;
  title: string;
  description: string;
  decisions?: Decision[];
  image: string;
  imageAlt: string;
  metrics: { value: string; label: string }[];
  customerLine: string;
  ctaLabel?: string;
  onCta?: () => void;
  docs: Doc[];
  quote?: Quote;
  prdQuote?: PrdQuote;
  imageLeft?: boolean;
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

// Generic in-site document viewer. Any same-origin artifact — HTML page, PDF,
// or interactive tool — opens here in an iframe so the visitor never leaves the
// site. Zoom applies to HTML docs; PDFs use the browser viewer's own controls.
function DocOverlay({ doc, onClose }: { doc: DocRef; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isPdf = doc.url.toLowerCase().endsWith(".pdf");

  const applyZoom = (z: number) => {
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
          {/* No sandbox: these are all first-party artifacts under /artifacts
              and /tools. Sandboxing blocks Chromium's built-in PDF viewer, and
              the HTML zoom hook needs same-origin document access. */}
          <iframe
            ref={iframeRef}
            src={doc.url}
            className="w-full border-0"
            style={{ minHeight: "100%", height: "100%" }}
            onLoad={() => applyZoom(zoom)}
            title={doc.title}
          />
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
  eyebrow,
  roleTag,
  title,
  description,
  decisions,
  image,
  imageAlt,
  metrics,
  ctaLabel,
  onCta,
  docs,
  quote,
  imageLeft = true,
  onOverlayOpen,
  onImageClick,
}: WorkArticleProps) {
  const ref = useScrollReveal();
  const cols = metrics.length >= 4 ? 4 : metrics.length;

  return (
    <article ref={ref} className="pb-12 border-b border-line last:border-0 last:pb-0">
      {/* Eyebrow */}
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-deep mb-5">
        {eyebrow}
      </p>

      {/* 2-col: image + content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start mb-10">
        {/* Image — always first in DOM so it leads on mobile */}
        <div
          className={`relative aspect-[4/3] overflow-hidden rounded-sm ${!imageLeft ? "md:order-last" : ""} ${onImageClick ? "cursor-zoom-in" : ""}`}
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
            sizes="(min-width: 768px) 560px, 100vw"
            className="object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
          <div className="absolute top-3 left-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] bg-paper/90 backdrop-blur-sm text-ink-soft border border-line px-2.5 py-1.5 rounded-sm">
              {roleTag}
            </span>
          </div>
        </div>

        {/* Content */}
        <div>
          <h3
            className="font-display font-light text-ink leading-tight mb-5"
            style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)" }}
          >
            {title}
          </h3>
          <p className="text-ink-soft leading-relaxed mb-6 text-[0.9rem]">
            {description}
          </p>

          {/* Key decisions — each bullet carries its own proof links on a row
              directly beneath its text, aligned to the text column */}
          {decisions && decisions.length > 0 && (
            <ul className="space-y-4 mb-6">
              {decisions.slice(0, 3).map((d, i) => {
                const text = typeof d === "string" ? d : d.text;
                const links = typeof d !== "string" ? d.links : undefined;
                const chip =
                  "font-mono text-[10px] uppercase tracking-[0.06em] border border-accent-deep/40 text-accent-deep hover:bg-accent-deep hover:text-paper transition-all rounded-sm px-2 py-1 whitespace-nowrap";
                return (
                  <li key={i} className="text-sm text-ink-soft leading-relaxed">
                    <div className="flex gap-3">
                      <span className="text-accent-deep shrink-0 mt-0.5 font-light">–</span>
                      <span>{text}</span>
                    </div>
                    {links && links.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 pl-[1.6rem]">
                        {links.map((link) =>
                          link.onClick ? (
                            <button key={link.label} onClick={link.onClick} className={chip}>
                              {link.label} ↗
                            </button>
                          ) : link.url && onOverlayOpen ? (
                            <button
                              key={link.label}
                              onClick={() =>
                                onOverlayOpen({ url: link.url!, title: link.label, subtitle: link.subtitle })
                              }
                              className={chip}
                            >
                              {link.label} ↗
                            </button>
                          ) : null
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {/* CTA (only when the article has no inline entry point) */}
          {ctaLabel && onCta && (
            <button
              onClick={onCta}
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.06em] bg-ink text-paper border border-ink px-4 py-2.5 rounded-sm hover:bg-accent-deep hover:border-accent-deep transition-all duration-300 group"
              style={{ transform: "translateY(0)" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {ctaLabel}
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowIcon />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics grid */}
      <div
        className={`grid border-r border-b border-line mb-10 grid-cols-2 ${
          cols === 4 ? "md:grid-cols-4" : "md:grid-cols-3"
        }`}
      >
        {metrics.map((m, i) => (
          <div key={i} className="border-t border-l border-line p-5 md:p-6">
            <div
              className="font-display text-accent-deep font-light leading-none mb-2"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
            >
              {m.value}
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint leading-relaxed">
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Pullquote */}
      {quote && (
        <figure className="mb-8">
          <blockquote
            className="font-display font-light italic text-ink-soft leading-snug mb-4"
            style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.55rem)" }}
          >
            <span className="text-accent-deep not-italic">&ldquo;</span>
            {quote.text}
            <span className="text-accent-deep not-italic">&rdquo;</span>
          </blockquote>
          <figcaption className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint text-right">
            {quote.author} · {quote.role}
          </figcaption>
        </figure>
      )}

      {/* Doc chips — every artifact opens in-site via the doc overlay */}
      {docs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {docs.map((doc, i) => (
            <button
              key={i}
              onClick={() =>
                onOverlayOpen?.({ url: doc.url, title: doc.name, subtitle: doc.subtitle })
              }
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] border border-line text-ink-soft hover:border-accent hover:text-accent-deep rounded-sm px-2.5 py-1.5 transition-all duration-200 group"
            >
              {doc.name}
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowIcon />
              </span>
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

interface SelectedWorkProps {
  onOpenAmvero: () => void;
  onOpenSimulation: () => void;
}

const PRICING_DOC: DocRef = {
  url: "/tools/amvero-roi-optimizer.html",
  title: "Credit-based Pricing Model",
  subtitle: "Interactive pricing tool",
};

export default function SelectedWork({ onOpenAmvero, onOpenSimulation }: SelectedWorkProps) {
  const [doc, setDoc] = useState<DocRef | null>(null);
  const [overlayImage, setOverlayImage] = useState<{ src: string; alt: string } | null>(null);

  // Site-wide entry points: the action panel and any other component can open
  // the pricing tool or an arbitrary in-site document via window events.
  useEffect(() => {
    const openPricing = () => setDoc(PRICING_DOC);
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
    <section id="work" className="bg-paper px-6 py-12 md:py-20 xl:py-24">
      <div className="max-w-[1180px] mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-4 border-b border-line pb-5 mb-10">
          <span className="font-mono text-[11px] text-accent-deep font-medium tracking-[0.1em]">01</span>
          <h2
            className="font-display font-light text-ink leading-tight"
            style={{ fontSize: "clamp(2rem, 5.4vw, 3.6rem)" }}
          >
            Selected work
          </h2>
        </div>

        <div className="space-y-12 md:space-y-16">
          <WorkArticle
            eyebrow="AI Platform · Oqton · 2025–Present"
            roleTag="Senior PM, AI Platform"
            title="Took an AI monitoring tool from pilot to five enterprise contracts in five months"
            description="I took AMVero from first enterprise pilot to five paying clients in five months, writing the GTM narrative, designing the smart alerting system that eliminated operator alert fatigue, and authoring the deployment playbook that got regulated manufacturers live without disrupting production."
            decisions={[
              {
                text: "Chose condition-based multi-layer filtering over severity thresholds. Turned AMVero from a noise source into a trusted monitoring tool operators actually relied on.",
                links: [
                  { label: "Smart Alerts Prototype", onClick: onOpenAmvero },
                  { label: "Alerts PRD", url: "/artifacts/amvero-smart-alerting-prd.html", subtitle: "Product spec" },
                ],
              },
              "Defined on-premise as a product, not a cloud port, for aerospace and defense clients who required air-gapped environments.",
              {
                text: "Moved pricing from flat per-seat to consumption-based credits, aligning costs with customer production volume.",
                links: [
                  {
                    label: "Credit Pricing Model",
                    url: "/tools/amvero-roi-optimizer.html",
                    subtitle: "Interactive pricing tool",
                  },
                ],
              },
            ]}
            image="/amvero-product.png"
            imageAlt="AMVero AI monitoring dashboard"
            metrics={[
              { value: "98%", label: "Reduction in active monitoring time, Baker Hughes" },
              { value: "18%", label: "Scrap cost reduction via mid-run failure detection" },
              { value: "136h", label: "Saved per printer per year vs. manual layer review" },
              { value: "5", label: "Enterprise clients in 5 months" },
            ]}
            customerLine="Baker Hughes · Thales · Elos Medtech · 3D Systems · Beehive"
            onOverlayOpen={setDoc}
            onImageClick={(src, alt) => setOverlayImage({ src, alt })}
            docs={[
              { name: "Go-to-Market Narrative", url: "/artifacts/amvero-go-to-market-narrative.pdf", subtitle: "GTM document" },
              { name: "Launch Announcement", url: "/artifacts/amvero-launch-announcement.html", subtitle: "Announcement" },
              { name: "Deployment Playbook", url: "/artifacts/amvero-enterprise-deployment-playbook.pdf", subtitle: "Playbook" },
              { name: "Traceability Record", url: "/artifacts/amvero-end-to-end-traceability-record.pdf", subtitle: "Compliance record" },
            ]}
            quote={{
              text: "We've seen a 98% reduction in engineering review time per build, allowing our team to focus on more critical tasks. This, combined with an 18% reduction in scrap costs, has delivered a powerful return on investment.",
              author: "Amar Patel",
              role: "Digital Transformation Lead, Baker Hughes",
            }}
            imageLeft={true}
          />

          <WorkArticle
            eyebrow="Predictive Simulation · Oqton · 2022–2025"
            roleTag="Product Manager, Simulation"
            title="Shipped three simulation modules, culminating in the thermo-mechanical solver that made first-time-right manufacturing achievable"
            description="I built out the Simulation Suite over three years, shipping a Thermal module, a Mechanical module, and then the Thermo-mechanical module that combined both into a single pass, eliminating inter-stage wait times and making serial production with first-time-right accuracy viable."
            decisions={[
              "Shipped Thermal and Mechanical as separate modules, then unified them into a single coupled thermo-mechanical pass, eliminating inter-stage wait times and making first-time-right accuracy viable in serial production.",
              "Validated on standard engineering workstations, not servers. Expanded the addressable market to manufacturers without specialized compute infrastructure.",
              "Ran a structured beta with Knauf before release, reducing launch risk and generating a credible customer story at release.",
            ]}
            image="/simulation-knauf-fit.png"
            imageAlt="Predictive simulation structural fit validation"
            metrics={[
              { value: "80%", label: "Fewer dimensional errors on a large-format industrial part, 20+ hour production run" },
              { value: "~100%", label: "Of dimensional distortion compensated by predictive pre-deformation" },
              { value: "<150µm", label: "Maximum measured deviation on the same large-format part" },
            ]}
            customerLine="Knauf and tooling manufacturers across Europe"
            ctaLabel="Explore case study"
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
            imageLeft={false}
          />
        </div>
      </div>

      {doc && <DocOverlay doc={doc} onClose={() => setDoc(null)} />}
      {overlayImage && <ImageOverlay src={overlayImage.src} alt={overlayImage.alt} onClose={() => setOverlayImage(null)} />}
    </section>
  );
}
