"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

interface Doc {
  name: string;
  url: string;
}

interface Quote {
  text: string;
  author: string;
  role: string;
}

interface WorkCardProps {
  eyebrow: string;
  roleTag: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  metrics: { value: string; label: string }[];
  customerLine: string;
  ctaLabel: string;
  ctaSubtitle: string;
  onCta: () => void;
  docs: Doc[];
  quote?: Quote;
}

function WorkCard({
  eyebrow, roleTag, title, description, image, imageAlt,
  metrics, customerLine, ctaLabel, onCta, docs, quote,
}: WorkCardProps) {
  const ref = useScrollReveal();

  return (
    <div ref={ref} className="relative">
      {/* Eyebrow */}
      <div className="mb-4">
        <span className="text-[10px] tracking-[0.4em] uppercase text-[#5eead4] font-medium">
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
          <p className="text-sm text-[#71717a] leading-relaxed mb-4">{description}</p>
          <p className="text-xs text-[#71717a]/60 mb-6">
            <span className="text-[#71717a]">Customers:</span> {customerLine}
          </p>
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

          {/* Docs */}
          <div className="flex flex-wrap gap-2">
            {docs.map((doc, i) => (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#71717a] hover:text-[#5eead4] transition-colors border border-[#27272a]/50 rounded px-2.5 py-1"
              >
                {doc.name}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Customer quote */}
      {quote && (
        <div className="mt-10 border-t border-[#27272a]/40 pt-8">
          <blockquote className="border-l-2 border-[#5eead4]/40 pl-5">
            <p className="text-sm text-[#fafafa]/80 font-light leading-relaxed italic">
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
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#71717a]">Selected Work</span>
          <h2 className="text-4xl md:text-5xl font-extralight text-[#fafafa] mt-2">
            Featured Products
          </h2>
        </div>

        <div className="space-y-32">
          <WorkCard
            eyebrow="AI Platform"
            roleTag="Senior PM, AI Platform · Oqton · 2025–Present"
            title="Real-time AI quality control for industrial manufacturing"
            description="An AI vision system that watches production in real time and flags errors before they accumulate as scrap. Deployed across aerospace, energy, and medical manufacturing clients."
            image="/amvero-product.png"
            imageAlt="Real-time AI quality control dashboard"
            metrics={[
              { value: "98%", label: "Reduction in active monitoring time (Baker Hughes)" },
              { value: "18%", label: "Scrap cost reduction (verified by aerospace client)" },
              { value: "136h", label: "Saved per printer per year" },
              { value: "5", label: "Enterprise clients in 5 months" },
            ]}
            customerLine="Baker Hughes · Thales · Elos Medtech · 3D Systems · Beehive"
            ctaLabel="Try interactive prototype"
            ctaSubtitle="Figma Make · ~2 min walkthrough of the alerts flow"
            onCta={onOpenAmvero}
            docs={[
              { name: "Product Article", url: "https://drive.google.com/file/d/1nlpqP3HfYCE-Y6ngzdWjNLnulv7eqLqx/view" },
              { name: "Launch Announcement", url: "https://drive.google.com/file/d/18rYHWxkrakU_upjXpZjqHeDLN6DSPNOT/view" },
              { name: "Sales Deck", url: "https://drive.google.com/file/d/1C_T1hrDOoDEiiqUUfId0EYoN5Rpne5pP/view" },
              { name: "Alerts PRD", url: "https://docs.google.com/document/d/1zoWRqvujh96Wlu9V3eaDodg8C0gYmsjvuJvhB0HCPKo/edit" },
              { name: "ROI Optimizer", url: "https://drive.google.com/file/d/1GbkdsS5vJLpCvJQOYmCaMfCiRhDfAl6T/view" },
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
            title="Predictive simulation that lets clients ship right the first time"
            description="Simulation software that predicts how parts will behave during manufacturing, so clients eliminate expensive physical trials and ship correct parts on the first attempt."
            image="/simulation-knauf-fit.png"
            imageAlt="Predictive simulation structural fit validation"
            metrics={[
              { value: "80%", label: "Fewer manufacturing errors" },
              { value: "99%+", label: "Dimensional accuracy via predictive compensation" },
              { value: "<150µm", label: "Maximum measured dimensional deviation" },
            ]}
            customerLine="Knauf and tooling manufacturers across Europe"
            ctaLabel="Try the ROI simulator"
            ctaSubtitle="Interactive calculator · input your build volume to see projected savings"
            onCta={onOpenSimulation}
            docs={[
              { name: "Thermal Whitepaper", url: "https://drive.google.com/file/d/13v5VOTdE8XOMEmy79SaHz6h4s8E_3VU8/view" },
              { name: "Customer Story: Tooling", url: "https://drive.google.com/file/d/14xkfVrlu1sj1c3YY9w3R-xtejPW1yHgO/view" },
              { name: "Customer Story: Large Parts", url: "https://drive.google.com/file/d/14yNMaShYmz9dlhq6LMOxtihkh4xPZvTe/view" },
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
