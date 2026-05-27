"use client";

const CARDS = [
  {
    title: "Discovery & specs",
    body: "Before I write a spec, I pull customer signals, Jira, and Slack into one place. I catch the conflicts and gaps early, so they don't turn into sprint rework.",
    icon: (
      <svg className="w-5 h-5 text-[#71717a] group-hover:text-[#5eead4] transition-colors mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    title: "Prototyping",
    body: "I build interactive prototypes and test them with customers before engineering starts. When I do, users get higher-value features in the first release.",
    icon: (
      <svg className="w-5 h-5 text-[#71717a] group-hover:text-[#5eead4] transition-colors mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
      </svg>
    ),
  },
  {
    title: "Hermes PM agent",
    body: "A peer AI agent keeps my competitive research current. I walk into strategy discussions with fresh context instead of a deck I put together last week.",
    icon: (
      <svg className="w-5 h-5 text-[#71717a] group-hover:text-[#5eead4] transition-colors mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 14h2M20 14h2M15 13v2M9 13v2" />
      </svg>
    ),
  },
  {
    title: "Support intelligence",
    body: "I read across hundreds of support conversations at once to find the patterns. My roadmap stays grounded in what customers actually get stuck on.",
    icon: (
      <svg className="w-5 h-5 text-[#71717a] group-hover:text-[#5eead4] transition-colors mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function HowIWork() {
  return (
    <section id="how-i-work" className="px-6 md:px-12 py-32 border-t border-[#27272a]/30">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <span className="text-xs tracking-[0.2em] uppercase text-[#5eead4] font-mono">How I Work</span>
          <h2 className="text-4xl md:text-5xl font-extralight text-[#fafafa] mt-2 mb-6">
            An AI-native PM practice
          </h2>
          <p className="text-base text-[#8a8580] max-w-2xl leading-relaxed">
            I run a multi-agent workspace that compresses the time from customer signal to shipped feature. Specialized AI tools handle discovery, spec drafting, prototyping, and competitive research in parallel.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[#27272a]/30">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="bg-[#09090b] p-8 md:p-10 group hover:bg-[#111111] transition-colors duration-500"
            >
              {card.icon}
              <h3 className="text-lg font-light text-[#fafafa] mb-3">{card.title}</h3>
              <p className="text-base text-[#8a8580] leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>

        <p className="text-base text-[#8a8580] mt-8 italic">
          The result: faster cycles from customer signal to validated prototype to shipped feature.
        </p>
      </div>
    </section>
  );
}
