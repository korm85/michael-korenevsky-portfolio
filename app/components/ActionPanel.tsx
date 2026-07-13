"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface Action {
  label: string;
  hint: string;
  keywords: string;
  run: () => void;
  sectionId?: string;
}

// Scrollspy targets, in page order. The label is what the pill displays.
const SECTIONS: [id: string, label: string][] = [
  ["hero", "Intro"],
  ["work", "Selected work"],
  ["how-i-work", "AI practice"],
  ["career", "Career"],
  ["about", "About"],
  ["contact", "Contact"],
];

interface ActionGroup {
  category: string;
  actions: Action[];
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

function openHash(hash: string) {
  window.history.pushState(null, "", hash);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

// Opens a same-origin artifact in the in-site document overlay (owned by
// SelectedWork) so the visitor never leaves the page for a new tab.
function openDoc(url: string, title: string, subtitle?: string) {
  window.dispatchEvent(new CustomEvent("open-doc-overlay", { detail: { url, title, subtitle } }));
}

const GROUPS: ActionGroup[] = [
  {
    category: "Proof of work",
    actions: [
      {
        label: "Smart Alerts Prototype",
        hint: "Interactive demo",
        keywords: "prototype demo interactive amvero alert smart console hands-on product ai",
        run: () => openHash("#case-amvero"),
      },
      {
        label: "Credit Pricing Model",
        hint: "Interactive tool",
        keywords: "pricing credits licensing roi cost model calculator business monetization",
        run: () => window.dispatchEvent(new Event("open-pricing-model")),
      },
      {
        label: "Case study: AI monitoring",
        hint: "5 contracts in 5 months",
        keywords: "amvero case study monitoring anomaly detection enterprise outcomes metrics",
        run: () => openHash("#case-amvero"),
      },
      {
        label: "Case study: predictive simulation",
        hint: "Physics-based",
        keywords: "simulation case study thermal mechanical physics solver first-time-right",
        run: () => openHash("#case-simulation"),
      },
    ],
  },
  {
    category: "Documents",
    actions: [
      {
        label: "Smart Alerting PRD",
        hint: "Product spec",
        keywords: "prd spec requirements document alerting writing",
        run: () => openDoc("/artifacts/amvero-smart-alerting-prd.html", "Smart Alerting PRD", "Product spec"),
      },
      {
        label: "Go-to-Market narrative",
        hint: "GTM doc",
        keywords: "gtm go to market narrative launch strategy positioning document",
        run: () => openDoc("/artifacts/amvero-go-to-market-narrative.html", "Go-to-Market Narrative", "GTM document"),
      },
    ],
  },
  {
    category: "Explore the site",
    actions: [
      {
        label: "Selected work",
        hint: "Section",
        keywords: "work projects portfolio case studies section",
        run: () => scrollToSection("work"),
        sectionId: "work",
      },
      {
        label: "How I use AI as a PM",
        hint: "Section",
        keywords: "ai practice workflow process discovery prototyping native section",
        run: () => scrollToSection("how-i-work"),
        sectionId: "how-i-work",
      },
      {
        label: "Career timeline",
        hint: "Section",
        keywords: "career experience history timeline qa oqton 3d systems section",
        run: () => scrollToSection("career"),
        sectionId: "career",
      },
      {
        label: "About Michael",
        hint: "Section",
        keywords: "about bio education languages location background engineer section",
        run: () => scrollToSection("about"),
        sectionId: "about",
      },
    ],
  },
  {
    category: "Contact",
    actions: [
      {
        label: "Email Michael",
        hint: "korm85@gmail.com",
        keywords: "email contact reach out hire message korm85 mail",
        run: () => { window.location.href = "mailto:korm85@gmail.com"; },
      },
      {
        label: "LinkedIn profile",
        hint: "Opens in new tab",
        keywords: "linkedin profile social connect network",
        run: () => window.open("https://linkedin.com/in/michael-korenevsky", "_blank", "noopener,noreferrer"),
      },
    ],
  },
];

// Frosted-glass surface matching the site's chrome
const glass = {
  backdropFilter: "blur(14px) saturate(1.4)",
  WebkitBackdropFilter: "blur(14px) saturate(1.4)",
  backgroundColor: "rgba(243,239,230,0.88)",
} as const;

export default function ActionPanel() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Scrollspy: the last section whose top has passed the upper 40% of the
  // viewport is the one the reader is in.
  useEffect(() => {
    const onScroll = () => {
      let current = SECTIONS[0][0];
      for (const [id] of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeLabel = SECTIONS.find(([id]) => id === activeSection)?.[1] ?? "Intro";

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.map((g) => ({
      category: g.category,
      actions: g.actions.filter(
        (a) =>
          a.label.toLowerCase().includes(q) ||
          a.hint.toLowerCase().includes(q) ||
          a.keywords.includes(q)
      ),
    })).filter((g) => g.actions.length > 0);
  }, [query]);

  const flat = useMemo(() => groups.flatMap((g) => g.actions), [groups]);

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
      setSelected((s) => Math.min(s + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && flat[selected]) {
      e.preventDefault();
      runAction(flat[selected]);
    }
  };

  let flatIndex = -1;

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
          className="mb-3 w-[min(92vw,26rem)] border border-line rounded-sm shadow-2xl overflow-hidden animate-scale-in"
          style={glass}
        >
          <div className="border-b border-line px-4 py-3">
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
          <div className="max-h-[48vh] overflow-y-auto py-1" role="listbox">
            {flat.length === 0 && (
              <p className="px-4 py-3 text-sm text-ink-faint">
                No match. Try &ldquo;prototype&rdquo;, &ldquo;pricing&rdquo;, or &ldquo;contact&rdquo;.
              </p>
            )}
            {groups.map((g) => (
              <div key={g.category}>
                <p className="px-4 pt-2.5 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-deep">
                  {g.category}
                </p>
                {g.actions.map((a) => {
                  flatIndex += 1;
                  const i = flatIndex;
                  const isCurrent = a.sectionId != null && a.sectionId === activeSection;
                  return (
                    <button
                      key={a.label}
                      role="option"
                      aria-selected={i === selected}
                      aria-current={isCurrent ? "true" : undefined}
                      onClick={() => runAction(a)}
                      onMouseEnter={() => setSelected(i)}
                      className={`w-full text-left px-4 py-2 flex items-baseline justify-between gap-3 transition-colors ${
                        i === selected ? "bg-ink/5" : ""
                      }`}
                    >
                      <span className={`text-sm flex items-center gap-2 ${isCurrent ? "text-accent-deep" : "text-ink"}`}>
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-accent-deep shrink-0" />}
                        {a.label}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint shrink-0">
                        {isCurrent ? "You are here" : a.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="border-t border-line px-4 py-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
            <span>↑↓ navigate · ↵ open</span>
            <span>esc to close</span>
          </div>
        </div>
      )}

      {/* Pill: current section indicator + find-anything trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex items-center border border-line text-ink-soft hover:text-ink hover:border-accent-deep/60 rounded-full py-2.5 shadow-xl transition-all duration-200"
        style={glass}
      >
        <span className="flex items-center gap-2 pl-4 pr-3 border-r border-line">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-deep shrink-0" />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink whitespace-nowrap">
            {activeLabel}
          </span>
        </span>
        <span className="flex items-center gap-2 pl-3 pr-3.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3.5-3.5" />
          </svg>
          <span className="font-mono text-[11px] uppercase tracking-[0.1em]">
            {open ? "Close" : "Explore portfolio"}
          </span>
          <span className="hidden md:inline font-mono text-[9px] text-ink-faint border border-line rounded-sm px-1.5 py-0.5">
            ⌘K
          </span>
        </span>
      </button>
    </div>
  );
}
