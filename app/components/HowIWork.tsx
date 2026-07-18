"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

const CARDS = [
  {
    num: "01",
    title: "Find the problem worth solving",
    body: "Use customer conversations, support patterns, sales input, and product data to understand the real problem before defining a feature.",
  },
  {
    num: "02",
    title: "Choose work by customer value",
    body: "Set the user and business outcome first, then prioritize options by customer value, impact, and effort. Explain what the team will solve first and why.",
  },
  {
    num: "03",
    title: "Build the right workflow",
    body: "Use early prototypes to learn what engineering can build, shape the scope together, and test the workflow with customers before development begins.",
  },
  {
    num: "04",
    title: "Make adoption part of launch",
    body: "Carry the work through customer testing, onboarding, documentation, and sales materials so customers can start using the product with confidence.",
  },
];

export default function HowIWork() {
  const ref = useScrollReveal();

  return (
    <section id="how-i-work" className="bg-canvas px-6 py-14 md:py-24 xl:py-28">
      <div className="max-w-[1360px] mx-auto">
        <div className="mb-14">
          <p className="font-mono text-[0.78rem] font-medium uppercase tracking-[0.1em] text-accent">02 / How I work</p>
          <h2 className="mt-3 font-display font-light leading-tight text-on-dark" style={{ fontSize: "clamp(2.2rem, 5.4vw, 3.8rem)" }}>
            How I lead product work
          </h2>
          <p className="mt-4 max-w-3xl text-[1.05rem] leading-relaxed text-on-dark-soft xl:text-[1.15rem]">
            I turn customer evidence, engineering constraints, and commercial input into a focused plan the team can build and customers can adopt.
          </p>
        </div>

        {/* Tonal panels distinguish each principle without adding visual noise. */}
        <div
          ref={ref}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {CARDS.map((card, index) => (
            <div
              key={card.num}
              className="min-h-[265px] bg-on-dark/[0.05] p-7 md:p-8 xl:p-9"
            >
              <span className="font-display text-[2.5rem] leading-none text-accent/80 mb-8 block">
                {card.num}
              </span>
              <h3
                className="font-display font-light text-on-dark mb-4 leading-tight"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}
              >
                {card.title}
              </h3>
              <p className="text-on-dark-soft text-[1rem] xl:text-[1.08rem] leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
