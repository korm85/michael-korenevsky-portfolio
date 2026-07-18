"use client";

const PRODUCT_LEADERSHIP = [
  {
    years: "2025–Present",
    company: "Oqton",
    role: "Senior PM, AI Platform",
    outcome: "Built the product strategy and launch path that brought an enterprise AI platform to five customers in five months.",
    line: "Led customer discovery, requirements, pricing, launch, and deployment with engineering, design, marketing, sales, and application engineering.",
  },
  {
    years: "2022–2025",
    company: "Oqton",
    role: "Product Manager, Simulation",
    outcome: "Turned a third-party physics engine into a product that helped manufacturers get 3D-printed parts right on the first production run.",
    line: "Led productization and enterprise adoption with engineering, design, sales, and application engineering partners.",
  },
];

const ENGINEERING_FOUNDATION = [
  {
    years: "2017–2022",
    company: "3D Systems",
    role: "QA Team Lead",
    line: "Built the QA function and led release certification for enterprise CAD/CAM software.",
  },
  {
    years: "2015–2017",
    company: "3D Systems",
    role: "QA Engineer, Founding Team",
    line: "Created the first validation frameworks for a new generation of manufacturing tools.",
  },
  {
    years: "2012–2015",
    company: "Cimatron",
    role: "QA Engineer",
    line: "Certified CAD/CAM software for tooling manufacturers across Europe and North America.",
  },
];

function RoleRow({
  entry,
  product,
}: {
  entry: (typeof PRODUCT_LEADERSHIP)[number] | (typeof ENGINEERING_FOUNDATION)[number];
  product?: boolean;
}) {
  return (
    <div className={`grid grid-cols-1 gap-3 py-7 sm:grid-cols-[minmax(190px,0.55fr)_minmax(0,1.45fr)] sm:gap-10 xl:gap-16 ${product ? "bg-paper-2 px-6 md:px-8" : ""}`}>
      <span className="font-mono text-[0.78rem] tracking-[0.05em] text-accent-deep">{entry.years}</span>
      <div>
        <div className="mb-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <span className="font-display text-[1.45rem] font-light text-ink">{entry.company}</span>
          <span className="text-base text-ink-faint">·</span>
          <span className="text-base text-ink-soft">{entry.role}</span>
        </div>
        {product && "outcome" in entry && (
          <p className="mb-2 max-w-4xl text-[1.05rem] font-medium leading-relaxed text-ink">{entry.outcome}</p>
        )}
        <p className="max-w-4xl text-[0.98rem] leading-relaxed text-ink-faint xl:text-[1.05rem]">{entry.line}</p>
      </div>
    </div>
  );
}

export default function CareerTimeline() {
  return (
    <section id="career" className="bg-paper px-6 py-14 md:py-24 xl:py-28">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-14">
          <p className="font-mono text-[0.78rem] font-medium uppercase tracking-[0.1em] text-accent-deep">03 / Experience</p>
          <h2 className="mt-3 font-display text-balance font-light leading-tight text-ink" style={{ fontSize: "clamp(2.2rem, 5.4vw, 3.8rem)" }}>
            Product leadership, built on engineering depth
          </h2>
          <p className="mt-4 max-w-3xl text-[1.05rem] leading-relaxed text-ink-soft xl:text-[1.15rem]">
            A product career grounded in the realities of complex industrial software and the cost of getting it wrong.
          </p>
        </div>

        <div>
          <div className="mb-3">
            <span className="font-mono text-[0.78rem] uppercase tracking-[0.1em] text-accent-deep">Product leadership</span>
          </div>
          {PRODUCT_LEADERSHIP.map((entry) => <RoleRow key={`${entry.company}-${entry.role}`} entry={entry} product />)}

          <div className="mb-3 mt-12">
            <span className="font-mono text-[0.78rem] uppercase tracking-[0.1em] text-ink-faint">Engineering foundation</span>
          </div>
          {ENGINEERING_FOUNDATION.map((entry) => <RoleRow key={`${entry.company}-${entry.role}`} entry={entry} />)}
        </div>

        <p className="mt-10 max-w-3xl text-pretty font-display text-[1.1rem] font-light italic leading-relaxed text-ink-soft md:text-[1.25rem]">
          My QA background means I treat reliability as part of the product experience: find the failure mode, validate the workflow, then ship with confidence.
        </p>
      </div>
    </section>
  );
}
