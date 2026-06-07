"use client";

import { useState, useRef } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface Doc {
  name: string;
  url: string;
  suffix?: string;
  category?: string;
  overlay?: boolean;
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

type Decision = string | { text: string; docLabel?: string; docUrl?: string; docOverlay?: boolean };

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
  ctaLabel: string;
  onCta: () => void;
  docs: Doc[];
  quote?: Quote;
  prdQuote?: PrdQuote;
  imageLeft?: boolean;
  onOverlayOpen?: (url: string) => void;
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

function RoiOverlay({ url, onClose }: { url: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  useState(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl h-[90dvh] bg-paper border border-line rounded-sm flex flex-col overflow-hidden animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-line bg-paper-2 flex-shrink-0">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent font-medium">
              AMVero · Pricing
            </p>
            <h3 className="text-base font-display font-light text-ink mt-0.5">
              Credit-based Pricing Model
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-line rounded-sm overflow-hidden">
              <button
                onClick={() => handleZoom(-0.25)}
                className="px-3 py-1.5 font-mono text-sm text-ink-soft hover:text-ink hover:bg-line/30 transition-colors border-r border-line"
              >
                −
              </button>
              <span className="font-mono text-[10px] text-ink-soft w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => handleZoom(0.25)}
                className="px-3 py-1.5 font-mono text-sm text-ink-soft hover:text-ink hover:bg-line/30 transition-colors border-l border-line"
              >
                +
              </button>
            </div>
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
        <div className="flex-1 overflow-auto">
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full border-0"
            style={{ minHeight: "100%", height: "100%" }}
            onLoad={() => applyZoom(zoom)}
            sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
            title="Credit-based Pricing Model"
          />
        </div>
      </div>
    </div>
  );
}

function ImageOverlay({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useState(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-ink/85 backdrop-blur-sm animate-fade-in cursor-zoom-out"
      onClick={onClose}
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
    <article ref={ref} className="pb-16 border-b border-line last:border-0 last:pb-0">
      {/* Eyebrow */}
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-8">
        {eyebrow}
      </p>

      {/* 2-col: image + content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start mb-12">
        {/* Image — always first in DOM so it leads on mobile */}
        <div
          className={`relative overflow-hidden rounded-sm ${!imageLeft ? "md:order-last" : ""} ${onImageClick ? "cursor-zoom-in" : ""}`}
          onClick={() => onImageClick?.(image, imageAlt)}
        >
          <img
            src={image}
            alt={imageAlt}
            className="w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
            style={{ aspectRatio: "4/3" }}
          />
          <div className="absolute top-3 left-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] bg-paper/90 backdrop-blur-sm text-ink-soft border border-line px-2.5 py-1.5 rounded-sm">
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

          {/* Key decisions */}
          {decisions && decisions.length > 0 && (
            <ul className="space-y-3 mb-8">
              {decisions.slice(0, 3).map((d, i) => {
                const text = typeof d === "string" ? d : d.text;
                const docLabel = typeof d !== "string" ? d.docLabel : undefined;
                const docUrl = typeof d !== "string" ? d.docUrl : undefined;
                const docOverlay = typeof d !== "string" ? d.docOverlay : undefined;
                return (
                  <li key={i} className="flex gap-3 text-sm text-ink-soft leading-relaxed">
                    <span className="text-accent shrink-0 mt-0.5 font-light">—</span>
                    <span>
                      {text}
                      {docLabel && docUrl && (
                        docOverlay && onOverlayOpen ? (
                          <button
                            onClick={() => onOverlayOpen(docUrl)}
                            className="ml-2 font-mono text-[9px] uppercase tracking-[0.06em] border border-line text-ink-soft hover:border-accent hover:text-accent transition-all rounded-sm px-1.5 py-0.5"
                          >
                            {docLabel} ↗
                          </button>
                        ) : (
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 font-mono text-[9px] uppercase tracking-[0.06em] border border-line text-ink-soft hover:border-accent hover:text-accent transition-all rounded-sm px-1.5 py-0.5"
                          >
                            {docLabel} ↗
                          </a>
                        )
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {/* CTA */}
          <button
            onClick={onCta}
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.06em] border border-ink text-ink px-4 py-2.5 rounded-sm hover:bg-ink hover:text-paper transition-all duration-300 group"
            style={{ transform: "translateY(0)" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {ctaLabel}
            <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <ArrowIcon />
            </span>
          </button>
        </div>
      </div>

      {/* Metrics grid */}
      <div
        className={`grid border-r border-b border-line mb-12 grid-cols-2 ${
          cols === 4 ? "md:grid-cols-4" : "md:grid-cols-3"
        }`}
      >
        {metrics.map((m, i) => (
          <div key={i} className="border-t border-l border-line p-5 md:p-6">
            <div
              className="font-display text-accent font-light leading-none mb-2"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
            >
              {m.value}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-faint leading-relaxed">
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Pullquote */}
      {quote && (
        <figure className="mb-10">
          <blockquote
            className="font-display font-light italic text-ink-soft leading-snug mb-4"
            style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.55rem)" }}
          >
            <span className="text-accent not-italic">&ldquo;</span>
            {quote.text}
            <span className="text-accent not-italic">&rdquo;</span>
          </blockquote>
          <figcaption className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint text-right">
            {quote.author} · {quote.role}
          </figcaption>
        </figure>
      )}

      {/* Doc chips */}
      {docs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {docs.map((doc, i) =>
            doc.overlay && onOverlayOpen ? (
              <button
                key={i}
                onClick={() => onOverlayOpen(doc.url)}
                className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.06em] border border-line text-ink-soft hover:border-accent hover:text-accent rounded-sm px-2.5 py-1.5 transition-all duration-200 group"
              >
                {doc.name}
                <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowIcon />
                </span>
              </button>
            ) : (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.06em] border border-line text-ink-soft hover:border-ink hover:text-ink rounded-sm px-2.5 py-1.5 transition-all duration-200 group"
              >
                {doc.name}
                <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowIcon />
                </span>
              </a>
            )
          )}
        </div>
      )}
    </article>
  );
}

interface SelectedWorkProps {
  onOpenAmvero: () => void;
  onOpenSimulation: () => void;
}

export default function SelectedWork({ onOpenAmvero, onOpenSimulation }: SelectedWorkProps) {
  const [roiUrl, setRoiUrl] = useState<string | null>(null);
  const [overlayImage, setOverlayImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <section id="work" className="bg-paper px-6 py-14 md:py-24 xl:py-32">
      <div className="max-w-[1180px] mx-auto">
        {/* Section header */}
        <div className="flex items-baseline gap-4 border-b border-line pb-6 mb-16">
          <span className="font-mono text-[11px] text-accent font-medium tracking-[0.1em]">01</span>
          <h2
            className="font-display font-light text-ink leading-tight"
            style={{ fontSize: "clamp(2rem, 5.4vw, 3.6rem)" }}
          >
            Selected work
          </h2>
        </div>

        <div className="space-y-14 md:space-y-20">
          <WorkArticle
            eyebrow="AI Platform · Oqton · 2025–Present"
            roleTag="Senior PM, AI Platform"
            title="Took an AI monitoring tool from pilot to five enterprise contracts in five months"
            description="I took AMVero from first enterprise pilot to five paying clients in five months, writing the GTM narrative, designing the smart alerting system that eliminated operator alert fatigue, and authoring the deployment playbook that got regulated manufacturers live without disrupting production."
            decisions={[
              {
                text: "Chose condition-based multi-layer filtering over severity thresholds — turned AMVero from a noise source into a trusted monitoring tool operators actually relied on.",
                docLabel: "Alerts PRD",
                docUrl: "/artifacts/amvero-smart-alerting-prd.html",
              },
              "Defined on-premise as a product, not a cloud port, for aerospace and defense clients who required air-gapped environments.",
              {
                text: "Moved pricing from flat per-seat to consumption-based credits, aligning costs with customer production volume.",
                docLabel: "Credit Pricing Model",
                docUrl: "/tools/amvero-roi-optimizer.html",
                docOverlay: true,
              },
            ]}
            image="/amvero-product.png"
            imageAlt="AMVero AI monitoring dashboard"
            metrics={[
              { value: "98%", label: "Reduction in active monitoring time — Baker Hughes deployment" },
              { value: "18%", label: "Scrap cost reduction via mid-run failure detection" },
              { value: "136h", label: "Saved per printer per year" },
              { value: "5", label: "Enterprise clients in 5 months" },
            ]}
            customerLine="Baker Hughes · Thales · Elos Medtech · 3D Systems · Beehive"
            ctaLabel="Try interactive prototype"
            onCta={onOpenAmvero}
            onOverlayOpen={setRoiUrl}
            onImageClick={(src, alt) => setOverlayImage({ src, alt })}
            docs={[
              { name: "Go-to-Market Narrative", url: "/artifacts/amvero-go-to-market-narrative.pdf" },
              { name: "Launch Announcement", url: "/artifacts/amvero-launch-announcement.html" },
              { name: "Alerts PRD", url: "/artifacts/amvero-smart-alerting-prd.html" },
              { name: "Credit Pricing Model", url: "/tools/amvero-roi-optimizer.html", overlay: true },
              { name: "Deployment Playbook", url: "/artifacts/amvero-enterprise-deployment-playbook.pdf" },
              { name: "Traceability Record", url: "/artifacts/amvero-end-to-end-traceability-record.pdf" },
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
            description="I built out the Simulation Suite over three years, shipping a Thermal module, a Mechanical module, and then the Thermo-mechanical module that combined both into a single pass — the step that eliminated inter-stage wait times and made serial production with first-time-right accuracy viable."
            decisions={[
              "Shipped Thermal and Mechanical as separate modules, then unified them into a single coupled thermo-mechanical pass — eliminating inter-stage wait times and making first-time-right accuracy viable in serial production.",
              "Validated on standard engineering workstations, not servers — deliberately expanding the addressable market to any manufacturer running 3DXpert.",
              "Ran a structured beta with Knauf before release, reducing launch risk and generating a credible customer story at release.",
            ]}
            image="/simulation-knauf-fit.png"
            imageAlt="Predictive simulation structural fit validation"
            metrics={[
              { value: "80%", label: "Fewer dimensional errors once thermal and mechanical ran as a single coupled pass" },
              { value: "99%+", label: "Dimensional accuracy via predictive compensation" },
              { value: "<150µm", label: "Maximum measured dimensional deviation" },
            ]}
            customerLine="Knauf and tooling manufacturers across Europe"
            ctaLabel="Explore case study"
            onCta={onOpenSimulation}
            onImageClick={(src, alt) => setOverlayImage({ src, alt })}
            docs={[
              { name: "Thermal Whitepaper", url: "/artifacts/simulation-thermal-whitepaper.html" },
              { name: "Customer Story: Tooling", url: "/artifacts/simulation-customer-story-tooling.html" },
              { name: "Customer Story: Large Parts", url: "/artifacts/simulation-customer-story-large-parts.html" },
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

      {roiUrl && <RoiOverlay url={roiUrl} onClose={() => setRoiUrl(null)} />}
      {overlayImage && <ImageOverlay src={overlayImage.src} alt={overlayImage.alt} onClose={() => setOverlayImage(null)} />}
    </section>
  );
}
