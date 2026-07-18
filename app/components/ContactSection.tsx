"use client";

function MailIcon() {
  return (
    <svg aria-hidden="true" className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" className="size-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.34 3H4.66A1.66 1.66 0 0 0 3 4.66v14.68A1.66 1.66 0 0 0 4.66 21h14.68A1.66 1.66 0 0 0 21 19.34V4.66A1.66 1.66 0 0 0 19.34 3ZM8.42 18.06H5.94V10.1h2.48Zm-1.24-9.04a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88Zm11 9.04H15.7v-3.87c0-.92-.02-2.1-1.28-2.1-1.28 0-1.48 1-1.48 2.03v3.94h-2.48V10.1h2.38v1.09h.03a2.61 2.61 0 0 1 2.35-1.29c2.52 0 2.98 1.66 2.98 3.82Z" />
    </svg>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" className="bg-canvas px-6 py-12 md:py-16">
      <div className="mx-auto grid max-w-[1360px] gap-8 py-3 md:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] md:items-end md:gap-16">
        <div>
          <p className="font-mono text-[0.78rem] font-medium uppercase tracking-[0.1em] text-accent">Open to senior product roles</p>
          <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.8rem,3.7vw,2.8rem)] font-light leading-tight text-on-dark">
            Let&apos;s build a product customers can depend on.
          </h2>
          <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-on-dark-soft xl:text-[1.08rem]">
            I&apos;m looking for work where customer discovery, technical depth, and enterprise execution matter.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-1 md:gap-5">
          <a
            href="mailto:korm85@gmail.com"
            className="group inline-flex items-center gap-3 text-on-dark-soft transition-colors hover:text-accent"
          >
            <MailIcon />
            <span className="font-mono text-[0.82rem] uppercase tracking-[0.08em]">Email</span>
            <span className="font-sans text-[1.1rem] font-medium text-on-dark group-hover:text-accent md:text-[1.2rem]">korm85@gmail.com</span>
          </a>
          <a
            href="https://linkedin.com/in/michael-korenevsky"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-on-dark-soft transition-colors hover:text-accent"
          >
            <LinkedInIcon />
            <span className="font-mono text-[0.82rem] uppercase tracking-[0.08em]">LinkedIn</span>
            <span className="font-sans text-[1.1rem] font-medium text-on-dark group-hover:text-accent md:text-[1.2rem]">/in/michael-korenevsky</span>
          </a>
        </div>
      </div>
    </section>
  );
}
