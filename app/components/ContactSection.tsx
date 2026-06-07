"use client";

const CONTACTS = [
  {
    label: "Email",
    value: "korm85@gmail.com",
    href: "mailto:korm85@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "michael-korenevsky",
    href: "https://linkedin.com/in/michael-korenevsky",
  },
  {
    label: "Resume",
    value: "Google Docs",
    href: "https://docs.google.com/document/d/1lbPupUpBwSxuhgy3deDYpYZzX8OKtBLz1HrCqE_aZUY/edit?usp=sharing",
  },
  {
    label: "Portfolio PDF",
    value: "Google Drive",
    href: "https://drive.google.com/file/d/1rP3LCConPL7ruGlyzQSfeEeYnY42HJxd/view?usp=sharing",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="bg-canvas px-6 py-14 md:py-24 xl:py-32">
      <div className="max-w-[1180px] mx-auto">
        {/* Section header */}
        <div className="flex items-baseline gap-4 border-b border-line-dark pb-6 mb-16">
          <span className="font-mono text-[11px] text-accent font-medium tracking-[0.1em]">05</span>
          <h2
            className="font-display font-light text-on-dark leading-tight"
            style={{ fontSize: "clamp(2rem, 5.4vw, 3.6rem)" }}
          >
            Let&apos;s build something worth shipping
          </h2>
        </div>

        <p
          className="text-on-dark-soft mb-14"
          style={{ fontSize: "clamp(1rem, 1.8vw, 1.15rem)" }}
        >
          Based in Israel. Open to remote and hybrid roles.
        </p>

        {/* Contact list — crow rows */}
        <div style={{ maxWidth: 520 }}>
          {CONTACTS.map((c, i) => (
            <a
              key={i}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="grid grid-cols-[90px_1fr] sm:grid-cols-[120px_1fr] gap-4 py-5 border-b border-line-dark items-center group hover:pl-1 transition-all duration-200 last:border-0"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-dark-faint">
                {c.label}
              </span>
              <span className="text-on-dark-soft group-hover:text-accent transition-colors duration-200 text-sm flex items-center gap-2">
                {c.value}
                <svg
                  className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M17 7H7M17 7v10" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
