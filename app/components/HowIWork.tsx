"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

const CARDS = [
  {
    num: "01",
    title: "Discovery & specs",
    body: "AI synthesized support tickets, Jira history, and customer feedback before I wrote the AMVero alerting spec. It surfaced a threshold conflict that would have shipped a broken alert.",
  },
  {
    num: "02",
    title: "Prototyping",
    body: "I put working mockups in front of operators before any production code was written. They caught a UX problem in the first session that would have taken multiple developer sprints to fix post-release.",
  },
  {
    num: "03",
    title: "Market intelligence",
    body: "A scheduled agent tracks AMVero's regulatory environment, competitor pricing, and new entrants weekly. When competitors shifted to flexible pricing, I had the data to propose our move to token-based billing before we fell behind.",
  },
  {
    num: "04",
    title: "Support intelligence",
    body: "AI read 500 support tickets and found that operators were drowning in false alerts, not accuracy problems. That finding redirected the entire Smart Alerting roadmap.",
  },
];

export default function HowIWork() {
  const ref = useScrollReveal();

  return (
    <section id="how-i-work" className="bg-canvas px-6 py-14 md:py-24 xl:py-32">
      <div className="max-w-[1180px] mx-auto">
        {/* Section header */}
        <div className="flex items-baseline gap-4 border-b border-line-dark pb-6 mb-16">
          <span className="font-mono text-[11px] text-accent font-medium tracking-[0.1em]">02</span>
          <h2
            className="font-display font-light text-on-dark leading-tight"
            style={{ fontSize: "clamp(2rem, 5.4vw, 3.6rem)" }}
          >
            An AI-native PM practice
          </h2>
        </div>

        <p
          className="text-on-dark-soft leading-relaxed max-w-2xl mb-14"
          style={{ fontSize: "clamp(1rem, 1.8vw, 1.15rem)" }}
        >
          AI lets me cover more ground in less time and build working prototypes without
          waiting on development. I can bring something testable to every client and
          stakeholder conversation instead of a description of what I am imagining.
        </p>

        {/* Card grid */}
        <div
          ref={ref}
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {CARDS.map((card) => (
            <div
              key={card.num}
              className="p-8 border border-line-dark hover:border-accent/40 transition-colors duration-300 cursor-default"
            >
              <span className="font-mono text-[10px] text-accent tracking-[0.1em] mb-6 block">
                {card.num}
              </span>
              <h3
                className="font-display font-light text-on-dark mb-4 leading-tight"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}
              >
                {card.title}
              </h3>
              <p className="text-on-dark-soft text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
