"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

interface Doc {
  name: string;
  url: string;
  suffix?: string;
  category?: string;
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

type Decision = string | { text: string; docLabel?: string; docUrl?: string };

interface WorkCardProps {
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
  ctaSubtitle: string;
  onCta: () => void;
  docs: Doc[];
  quote?: Quote;
  prdQuote?: PrdQuote;
}

function WorkCard({
  eyebrow, roleTag, title, description, decisions, image, imageAlt,
  metrics, customerLine, ctaLabel, onCta, docs, quote, prdQuote,
}: WorkCardProps) {
  const ref = useScrollReveal();

  return (
    <div ref={ref} className="relative">
      {/* Eyebrow */}
      <div className="mb-4">
        <span className="text-xs tracking-[0.2em] uppercase text-[#5eead4] font-mono">
          {eyebrow}
        </span>
      </div>

      {/* 16:9 image */}
      <div className="relative overflow-hidden rounded-lg border border-[#27272a]/50 mb-8 group">
        <img
          src={image}
          alt={imageAlt}
          className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute bottom-3 left-3">
          <p className="text-xs text-white/70 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
            {roleTag}
          </p>
        </div>
      </div>

      {/* Two-col content */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl md:text-2xl font-light text-[#fafafa] leading-snug mb-4">{title}</h3>
          <p className="text-base text-[#8a8580] leading-relaxed mb-4">{description}</p>
          {decisions && decisions.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-mono tracking-[0.15em] uppercase text-[#8a8580]/60 mb-2">Key decisions</div>
              <ul className="space-y-1.5">
                {decisions.map((d, i) => {
                  const text = typeof d === "string" ? d : d.text;
                  const docLabel = typeof d !== "string" ? d.docLabel : undefined;
                  const docUrl = typeof d !== "string" ? d.docUrl : undefined;
                  return (
                    <li key={i} className="flex gap-2 text-sm text-[#8a8580] leading-relaxed">
                      <span className="text-[#5eead4]/50 mt-0.5 shrink-0">–</span>
                      <span>
                        {text}
                        {docLabel && docUrl && (
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-xs font-mono tracking-wider text-[#5eead4]/60 hover:text-[#5eead4]/90 transition-colors border border-[#5eead4]/30 hover:border-[#5eead4]/60 rounded px-1 py-0.5 whitespace-nowrap"
                          >
                            {docLabel} ↗
                          </a>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <p className="text-sm text-[#8a8580] mb-4">
            <span className="text-[#8a8580]">Customers:</span> {customerLine}
          </p>
          {prdQuote && (
            <div className="border-l-2 border-[#5eead4]/30 bg-[#5eead4]/[0.03] rounded-r px-3 py-2 mb-4">
              <p className="text-xs italic text-white/60 leading-relaxed">
                &ldquo;{prdQuote.text}&rdquo;
              </p>
              <a
                href={prdQuote.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] font-mono uppercase tracking-widest text-[#5eead4]/50 hover:text-[#5eead4]/80 transition-colors mt-1 inline-block"
              >
                {prdQuote.linkLabel} ↗
              </a>
            </div>
          )}
          <button
            onClick={onCta}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs border border-[#5eead4]/40 rounded-sm text-[#5eead4] hover:bg-[#5eead4]/10 hover:border-[#5eead4]/70 transition-all uppercase tracking-[0.08em] font-mono"
          >
            {ctaLabel}
          </button>
        </div>

        <div>
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {metrics.map((m, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-light text-[#5eead4]">{m.value}</div>
                <div className="text-xs text-[#71717a] mt-1 max-w-[140px] mx-auto leading-snug">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Docs grouped by PM lifecycle category */}
          {(() => {
            const groups = docs.reduce<Array<{ label: string; items: Doc[] }>>(
              (acc, doc) => {
                const cat = doc.category ?? "";
                const existing = acc.find((g) => g.label === cat);
                if (existing) existing.items.push(doc);
                else acc.push({ label: cat, items: [doc] });
                return acc;
              },
              []
            );
            const categorised = groups.some((g) => g.label !== "");
            return (
              <div className={categorised ? "space-y-4" : ""}>
                {groups.map((group, gi) => (
                  <div key={gi}>
                    {categorised && group.label && (
                      <div className="text-xs font-mono tracking-[0.15em] uppercase text-[#8a8580]/60 mb-1.5">
                        {group.label}
                      </div>
                    )}
                    <div className={`grid gap-2 ${group.items.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                      {group.items.map((doc, i) => (
                        <a
                          key={i}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start justify-between gap-1 text-sm text-[#8a8580] hover:text-[#5eead4] transition-colors border border-[#27272a]/50 rounded px-3 py-2"
                        >
                          <span className="leading-snug">
                            {doc.name}
                            {doc.suffix && (
                              <span className="block opacity-50 text-[10px] mt-0.5">{doc.suffix}</span>
                            )}
                          </span>
                          <svg className="w-3 h-3 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Customer quote */}
      {quote && (
        <div className="mt-10 border-t border-[#27272a]/40 pt-8">
          <blockquote className="border-l-2 border-[#5eead4]/40 pl-5">
            <p className="text-base text-[#fafafa]/80 font-light leading-relaxed italic">
              &ldquo;{quote.text}&rdquo;
            </p>
            <footer className="mt-3 flex items-center gap-2">
              <span className="w-4 h-px bg-[#5eead4]/40" />
              <span className="text-[10px] font-mono tracking-wider text-[#71717a] uppercase">
                {quote.author} &middot; {quote.role}
              </span>
            </footer>
          </blockquote>
        </div>
      )}
    </div>
  );
}

interface SelectedWorkProps {
  onOpenAmvero: () => void;
  onOpenSimulation: () => void;
}

export default function SelectedWork({ onOpenAmvero, onOpenSimulation }: SelectedWorkProps) {
  return (
    <section id="work" className="px-6 md:px-12 py-32 border-t border-[#27272a]/30">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20">
          <span className="text-xs tracking-[0.2em] uppercase text-[#5eead4] font-mono">Selected Work</span>
          <h2 className="text-4xl md:text-5xl font-extralight text-[#fafafa] mt-2">
            Featured Products
          </h2>
        </div>

        <div className="space-y-32">
          <WorkCard
            eyebrow="AI Platform"
            roleTag="Senior PM, AI Platform · Oqton · 2025–Present"
            title="Took an AI monitoring tool from pilot to five enterprise contracts in five months"
            description="I took AMVero from first enterprise pilot to five paying clients in five months, writing the GTM narrative, designing the smart alerting system that eliminated operator alert fatigue, and authoring the deployment playbook that got regulated manufacturers live without disrupting production."
            decisions={[
              {
                text: "Chose condition-based multi-layer filtering over severity thresholds; this design decision turned AMVero from a noise source into a trusted monitoring tool operators actually relied on.",
                docLabel: "Alerts PRD",
                docUrl: "/artifacts/amvero-smart-alerting-prd.html",
              },
              "Defined on-premise as a product, not a cloud port, for aerospace and defense clients who required air-gapped environments.",
              {
                text: "Wrote the deployment playbook to compress enterprise onboarding so regulated manufacturers could go live without disrupting production.",
                docLabel: "Deployment Playbook",
                docUrl: "/artifacts/amvero-enterprise-deployment-playbook.pdf",
              },
              {
                text: "Moved AMVero pricing from a flat per-seat model to a consumption-based credit system, aligning costs with customer production volume. Built the ROI simulator to find the optimal rate and show clients exactly where credits outperform legacy pricing.",
                docLabel: "ROI Optimizer",
                docUrl: "/artifacts/roi-optimizer.html",
              },
            ]}
            image="/amvero-product.png"
            imageAlt="AMVero AI monitoring dashboard"
            metrics={[
              { value: "98%", label: "Reduction in review time, driven by the condition-based filtering architecture I specified" },
              { value: "18%", label: "Scrap cost reduction, by defining the alert logic that caught failures mid-run before material was lost" },
              { value: "136h", label: "Saved per printer per year" },
              { value: "5", label: "Enterprise clients in 5 months" },
            ]}
            customerLine="Baker Hughes · Thales · Elos Medtech · 3D Systems · Beehive"
            prdQuote={{
              text: "Operators stop trusting the system and miss the alerts that actually matter. Solved with condition-based filtering across multiple layers.",
              linkLabel: "Smart Alerting PRD",
              linkUrl: "/artifacts/amvero-smart-alerting-prd.html",
            }}
            ctaLabel="Try interactive prototype"
            ctaSubtitle="Figma Make · ~2 min walkthrough of the alerts flow"
            onCta={onOpenAmvero}
            docs={[
              { category: "Go-to-Market", name: "Go-to-Market Narrative", suffix: "· by Michael", url: "/artifacts/amvero-go-to-market-narrative.pdf" },
              { category: "Go-to-Market", name: "Launch Announcement", url: "/artifacts/amvero-launch-announcement.html" },
              { category: "Product & Pricing", name: "Alerts PRD", url: "/artifacts/amvero-smart-alerting-prd.html" },
              { category: "Product & Pricing", name: "ROI Optimizer", url: "/artifacts/roi-optimizer.html" },
              { category: "Customer Success", name: "Enterprise Deployment Playbook", url: "/artifacts/amvero-enterprise-deployment-playbook.pdf" },
              { category: "Customer Success", name: "End-to-End Traceability Record", url: "/artifacts/amvero-end-to-end-traceability-record.pdf" },
            ]}
            quote={{
              text: "We've seen a 98% reduction in engineering review time per build, allowing our team to focus on more critical tasks. This, combined with an 18% reduction in scrap costs, has delivered a powerful return on investment and significantly improved our operational efficiency.",
              author: "Amar Patel",
              role: "Digital Transformation Lead, Baker Hughes",
            }}
          />

          <WorkCard
            eyebrow="Predictive Simulation"
            roleTag="Product Manager, Simulation · Oqton · 2022–2025"
            title="Shipped three simulation modules, culminating in the thermo-mechanical solver that made first-time-right manufacturing achievable"
            description="I built out the Simulation Suite over three years, shipping a Thermal module, a Mechanical module, and then the Thermo-mechanical module that combined both into a single pass. The Thermo-mechanical module is the flagship: it simultaneously predicts heat distribution and physical distortion, which is what lets clients hit 99%+ dimensional accuracy without running trial parts or waiting between stages."
            decisions={[
              "Shipped Thermal and Mechanical as separate modules, then unified them into the Thermo-mechanical module, where both solvers run in a single coupled pass. That is the step that eliminated inter-stage wait times and made serial production with first-time-right accuracy viable.",
              "Validated on standard engineering workstations, not servers; a deliberate scope decision that expanded the addressable market to any manufacturer running 3DXpert, not just those with dedicated compute infrastructure.",
              "Ran a structured beta with Knauf to validate against real production components before release, reducing launch risk and generating a credible customer story at launch.",
            ]}
            image="/simulation-knauf-fit.png"
            imageAlt="Predictive simulation structural fit validation"
            metrics={[
              { value: "80%", label: "Fewer dimensional errors, achieved once thermal and mechanical ran as a single coupled pass in the thermo-mechanical module" },
              { value: "99%+", label: "Dimensional accuracy via predictive compensation" },
              { value: "<150µm", label: "Maximum measured dimensional deviation" },
            ]}
            customerLine="Knauf and tooling manufacturers across Europe"
            ctaLabel="Explore case study"
            ctaSubtitle="Overview, validation data, and customer stories"
            onCta={onOpenSimulation}
            docs={[
              { category: "Validation", name: "Thermal Whitepaper", url: "/artifacts/simulation-thermal-whitepaper.html" },
              { category: "Customers", name: "Customer Story: Tooling", url: "/artifacts/simulation-customer-story-tooling.html" },
              { category: "Customers", name: "Customer Story: Large Parts", url: "/artifacts/simulation-customer-story-large-parts.html" },
            ]}
            quote={{
              text: "We have achieved a lightweight component we would have never imagined creating before this project. This application creates new sparks for more AM applications in the marine industry.",
              author: "Francesco Trevisan",
              role: "AM Expert, Wärtsilä",
            }}
          />
        </div>
      </div>
    </section>
  );
}
