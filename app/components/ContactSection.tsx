"use client";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative px-6 md:px-12 py-32 min-h-screen flex flex-col justify-center border-t border-[#27272a]/30"
    >
      {/* Ghost background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h2
          className="text-[clamp(3rem,12vw,10rem)] font-extralight tracking-tight text-transparent select-none"
          style={{ WebkitTextStroke: "1px rgb(39, 39, 42)" } as React.CSSProperties}
        >
          LET'S BUILD
        </h2>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <span className="text-[10px] tracking-[0.4em] uppercase text-[#71717a]">Contact</span>
        <h2 className="text-4xl md:text-6xl font-extralight text-[#fafafa] mt-4 mb-4">
          Get in touch
        </h2>
        <p className="text-sm text-[#71717a] mb-12">
          Based in Israel. Open to remote and hybrid roles.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:korm85@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-light border border-[#27272a]/50 rounded-sm text-[#fafafa] hover:border-[#5eead4] hover:text-[#5eead4] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Email
          </a>

          <a
            href="https://linkedin.com/in/michael-korenevsky"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-light border border-[#27272a]/50 rounded-sm text-[#fafafa] hover:border-[#5eead4] hover:text-[#5eead4] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            LinkedIn
          </a>

          <a
            href="https://docs.google.com/document/d/1lbPupUpBwSxuhgy3deDYpYZzX8OKtBLz1HrCqE_aZUY/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-light border border-[#27272a]/50 rounded-sm text-[#fafafa] hover:border-[#5eead4] hover:text-[#5eead4] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" />
            </svg>
            Resume
          </a>

          <a
            href="https://drive.google.com/file/d/1rP3LCConPL7ruGlyzQSfeEeYnY42HJxd/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-light border border-[#27272a]/50 rounded-sm text-[#fafafa] hover:border-[#5eead4] hover:text-[#5eead4] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" />
            </svg>
            Portfolio PDF
          </a>
        </div>
      </div>
    </section>
  );
}
