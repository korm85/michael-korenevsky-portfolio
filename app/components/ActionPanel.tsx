"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface Action {
  label: string;
  hint: string;
  keywords: string;
  run: () => void;
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

function openHash(hash: string) {
  window.history.pushState(null, "", hash);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

const ACTIONS: Action[] = [
  {
    label: "Try the interactive prototype",
    hint: "AMVero alerting console",
    keywords: "prototype demo interactive amvero alert console hands-on product",
    run: () => openHash("#case-amvero"),
  },
  {
    label: "Explore the credit pricing model",
    hint: "Interactive tool",
    keywords: "pricing credits roi cost model calculator business",
    run: () => window.dispatchEvent(new Event("open-pricing-model")),
  },
  {
    label: "AI monitoring case study",
    hint: "Pilot to 5 enterprise contracts",
    keywords: "amvero case study monitoring anomaly detection work ai enterprise",
    run: () => openHash("#case-amvero"),
  },
  {
    label: "Predictive simulation case study",
    hint: "Physics-based, first-time-right",
    keywords: "simulation case study thermal mechanical physics solver work",
    run: () => openHash("#case-simulation"),
  },
  {
    label: "Selected work",
    hint: "Jump to section",
    keywords: "work projects portfolio case studies section",
    run: () => scrollToSection("work"),
  },
  {
    label: "How I use AI as a PM",
    hint: "Jump to section",
    keywords: "ai practice workflow process discovery prototyping section",
    run: () => scrollToSection("how-i-work"),
  },
  {
    label: "Career timeline",
    hint: "Jump to section",
    keywords: "career experience history timeline qa oqton resume section",
    run: () => scrollToSection("career"),
  },
  {
    label: "About",
    hint: "Jump to section",
    keywords: "about bio education languages location background section",
    run: () => scrollToSection("about"),
  },
  {
    label: "One-page summary",
    hint: "Condensed overview",
    keywords: "summary overview one page condensed print recruiter",
    run: () => { window.location.href = "/portfolio"; },
  },
  {
    label: "Email me",
    hint: "korm85@gmail.com",
    keywords: "email contact reach out hire message korm85",
    run: () => { window.location.href = "mailto:korm85@gmail.com"; },
  },
  {
    label: "LinkedIn",
    hint: "michael-korenevsky",
    keywords: "linkedin profile social connect network",
    run: () => window.open("https://linkedin.com/in/michael-korenevsky", "_blank", "noopener,noreferrer"),
  },
];

export default function ActionPanel() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ACTIONS;
    return ACTIONS.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.hint.toLowerCase().includes(q) ||
        a.keywords.includes(q)
    );
  }, [query]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const inField =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && !open && !inField) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      inputRef.current?.focus();
    }
  }, [open]);

  // Close on click outside the panel
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const runAction = (a: Action) => {
    setOpen(false);
    a.run();
  };

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      e.preventDefault();
      runAction(results[selected]);
    }
  };

  return (
    <div
      ref={panelRef}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Expanded palette */}
      {open && (
        <div
          role="dialog"
          aria-label="Quick actions"
          className="mb-3 w-[min(92vw,26rem)] bg-paper border border-line rounded-sm shadow-2xl overflow-hidden animate-scale-in"
        >
          <div className="border-b border-line bg-paper-2 px-4 py-3">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="What are you looking for?"
              aria-label="Search actions"
              className="w-full bg-transparent font-sans text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </div>
          <ul className="max-h-[46vh] overflow-y-auto py-1.5" role="listbox">
            {results.length === 0 && (
              <li className="px-4 py-3 text-sm text-ink-faint">
                No match. Try &ldquo;prototype&rdquo;, &ldquo;pricing&rdquo;, or &ldquo;contact&rdquo;.
              </li>
            )}
            {results.map((a, i) => (
              <li key={a.label} role="option" aria-selected={i === selected}>
                <button
                  onClick={() => runAction(a)}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full text-left px-4 py-2.5 flex items-baseline justify-between gap-3 transition-colors ${
                    i === selected ? "bg-paper-2" : ""
                  }`}
                >
                  <span className="text-sm text-ink">{a.label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint shrink-0">
                    {a.hint}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-line bg-paper-2 px-4 py-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
            <span>↑↓ navigate · ↵ open</span>
            <span>esc to close</span>
          </div>
        </div>
      )}

      {/* Pill */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex items-center gap-2.5 bg-canvas/90 backdrop-blur-md border border-line-dark text-on-dark-soft hover:text-on-dark hover:border-accent/50 rounded-full pl-4 pr-3 py-2.5 shadow-xl transition-all duration-200"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m20 20-3.5-3.5" />
        </svg>
        <span className="font-mono text-[11px] uppercase tracking-[0.1em]">
          {open ? "Close" : "Find anything"}
        </span>
        <span className="hidden md:inline font-mono text-[9px] text-on-dark-faint border border-line-dark rounded-sm px-1.5 py-0.5">
          ⌘K
        </span>
      </button>
    </div>
  );
}
