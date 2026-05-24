"use client";

import { useState } from "react";

// ── Static config data ────────────────────────────────────────────────────────

const MODELS = {
  haiku:  { label: "Haiku",  id: "claude-haiku-4-5-20251001", color: "#10b981", desc: "Search · reads · grep · glob" },
  sonnet: { label: "Sonnet", id: "claude-sonnet-4-6",         color: "#6366f1", desc: "Code · edits · deploys (default)" },
  opus:   { label: "Opus",   id: "claude-opus-4-7",           color: "#f59e0b", desc: "Architecture · planning · design" },
};

const ROUTING_RULES = [
  { trigger: "Search / lookup / file reads / grep / glob", model: "haiku"  as const, examples: ["Explore agent", "Find files", "Check existence"] },
  { trigger: "Code writing / editing / debugging / deploy", model: "sonnet" as const, examples: ["Edit component", "Fix bug", "Run build"] },
  { trigger: "Architecture / planning / design decisions",  model: "opus"   as const, examples: ["Plan agent", "System review", "Design call"] },
];

const CONFIG_FILES = [
  { scope: "Global",    path: "~/.claude/CLAUDE.md",                                   role: "Model tag + routing rules: all projects",            always: true  },
  { scope: "Global",    path: "~/.claude/settings.json",                               role: "Default model (sonnet) + global SessionStart hook",   always: true  },
  { scope: "Global",    path: "~/.claude/hooks/global-session-start.sh",               role: "Injects routing reminder into every session context", always: true  },
  { scope: "Project",   path: ".claude/settings.json",                                 role: "Project default model + project SessionStart hook",   always: true  },
  { scope: "Project",   path: ".claude/hooks/session-start.sh",                        role: "Injects STATUS.md + design system skill",             always: true  },
  { scope: "Project",   path: "AGENTS.md",                                             role: "Routing · transparency · skill rules · STATUS rules", always: true  },
  { scope: "Project",   path: "STATUS.md",                                             role: "Live project state: current, in progress, next up",  always: true  },
  { scope: "Project",   path: "memory/MEMORY.md",                                      role: "Index of persistent memory entries",                  always: true  },
  { scope: "On-demand", path: ".claude/skills/portfolio-design-system/SKILL.md",       role: "Visual design rules: auto-loaded + invoked before UI changes", always: false },
  { scope: "On-demand", path: ".claude/skills/ip-handling/SKILL.md",                  role: "Customer / product name handling rules",              always: false },
];

const TYPE_COLORS: Record<string, string> = {
  system: "#6366f1", hook: "#f59e0b", config: "#10b981", prompt: "#8b5cf6", agent: "#06b6d4",
};

// ── Flowchart ─────────────────────────────────────────────────────────────────

function Flowchart() {
  const W = 680;
  const nodeW = 260;
  const nodeH = 52;
  const cx = W / 2;

  // Main chain nodes (x-center, y-top)
  const nodes = [
    { id: "session",  label: "Session Opens",                  sub: "startup · resume · compact",          type: "system", x: cx, y: 0   },
    { id: "ghook",    label: "Global Hook fires",              sub: "~/.claude/hooks/global-session-start.sh", type: "hook",   x: cx, y: 90  },
    { id: "phook",    label: "Project Hook fires",             sub: ".claude/hooks/session-start.sh",      type: "hook",   x: cx, y: 180 },
    { id: "config",   label: "Config loaded into context",     sub: "CLAUDE.md · AGENTS.md · MEMORY.md · STATUS.md", type: "config", x: cx, y: 270 },
    { id: "prompt",   label: "User prompt received",           sub: "Skill check → plan tool calls",       type: "prompt", x: cx, y: 360 },
    { id: "router",   label: "Model Router",                   sub: "AGENTS.md routing table applied",     type: "system", x: cx, y: 450 },
  ];

  // Branch nodes
  const branches = [
    { id: "haiku",  label: "Haiku",  sub: "search / reads", color: MODELS.haiku.color,  x: cx - 220, y: 555 },
    { id: "sonnet", label: "Sonnet", sub: "code / default", color: MODELS.sonnet.color, x: cx,       y: 555 },
    { id: "opus",   label: "Opus",   sub: "plan / design",  color: MODELS.opus.color,   x: cx + 220, y: 555 },
  ];

  const bW = 140;
  const bH = 48;
  const routerBottom = 450 + nodeH;

  return (
    <svg
      viewBox={`0 0 ${W} 650`}
      className="w-full"
      style={{ maxHeight: 650 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Connector lines between main nodes */}
      {nodes.slice(0, -1).map((n, i) => {
        const next = nodes[i + 1];
        return (
          <line
            key={n.id + "-line"}
            x1={cx} y1={n.y + nodeH}
            x2={cx} y2={next.y}
            stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="4 3"
          />
        );
      })}

      {/* Branch lines from router to models */}
      {branches.map(b => (
        <g key={b.id + "-branch"}>
          <line
            x1={cx} y1={routerBottom}
            x2={b.x} y2={b.y}
            stroke={b.color} strokeWidth="1.5" opacity="0.5"
          />
          <polygon
            points={`${b.x - 5},${b.y - 8} ${b.x + 5},${b.y - 8} ${b.x},${b.y}`}
            fill={b.color} opacity="0.7"
          />
        </g>
      ))}

      {/* Main chain nodes */}
      {nodes.map(n => {
        const col = TYPE_COLORS[n.type];
        return (
          <g key={n.id} transform={`translate(${n.x - nodeW / 2}, ${n.y})`}>
            <rect width={nodeW} height={nodeH} rx="6" fill={col + "18"} stroke={col + "55"} strokeWidth="1" />
            <text x={nodeW / 2} y={20} textAnchor="middle" fill="#e4e4e7" fontSize="12" fontWeight="600" fontFamily="system-ui">{n.label}</text>
            <text x={nodeW / 2} y={37} textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="ui-monospace,monospace">{n.sub}</text>
          </g>
        );
      })}

      {/* Branch model nodes */}
      {branches.map(b => (
        <g key={b.id} transform={`translate(${b.x - bW / 2}, ${b.y})`}>
          <rect width={bW} height={bH} rx="6" fill={b.color + "22"} stroke={b.color + "66"} strokeWidth="1" />
          <text x={bW / 2} y={20} textAnchor="middle" fill={b.color} fontSize="13" fontWeight="700" fontFamily="system-ui">{b.label}</text>
          <text x={bW / 2} y={36} textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="ui-monospace,monospace">{b.sub}</text>
        </g>
      ))}

      {/* Type legend */}
      {Object.entries(TYPE_COLORS).map(([type, color], i) => (
        <g key={type} transform={`translate(${12 + i * 100}, 618)`}>
          <rect width="10" height="10" rx="2" fill={color + "44"} stroke={color + "88"} />
          <text x="14" y="9" fill="#52525b" fontSize="9" fontFamily="ui-monospace,monospace" textAnchor="start">{type}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Status section ────────────────────────────────────────────────────────────

function StatusSection({ status }: { status: Record<string, string> }) {
  const section = (key: string) => status[key] ?? status[Object.keys(status).find(k => k.startsWith(key.split(" ")[0])) ?? ""] ?? "";

  const bullets = (text: string) =>
    text.split("\n").filter(l => l.trim().startsWith("-")).map(l => l.replace(/^-\s*/, "").trim());

  const numbered = (text: string) =>
    text.split("\n").filter(l => /^\d+\./.test(l.trim())).map(l => l.replace(/^\d+\.\s*/, "").trim());

  const current = section("Current state");
  const completed = bullets(section("Last completed"));
  const inProgress = bullets(section("In progress"));
  const nextUp = numbered(section("Next up"));
  const decisions = bullets(section("Decisions log"));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border p-5 md:col-span-2" style={{ borderColor: "#27272a", background: "#111111" }}>
        <p className="mb-2 font-mono text-xs uppercase tracking-widest" style={{ color: "#52525b" }}>Current state</p>
        <p className="text-sm leading-relaxed" style={{ color: "#a1a1aa" }}>{current}</p>
      </div>

      <div className="rounded-lg border p-5" style={{ borderColor: "#27272a", background: "#111111" }}>
        <p className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: "#52525b" }}>Last completed</p>
        <ul className="space-y-1.5">
          {completed.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#71717a" }}>
              <span style={{ color: "#10b981" }}>✓</span>{item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border p-5" style={{ borderColor: "#27272a", background: "#111111" }}>
        <p className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: "#52525b" }}>In progress</p>
        {inProgress.length === 0 ? (
          <p className="text-xs" style={{ color: "#3f3f46" }}>Nothing: clean state</p>
        ) : (
          <ul className="space-y-1.5">
            {inProgress.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#71717a" }}>
                <span style={{ color: "#f59e0b" }}>◎</span>{item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border p-5" style={{ borderColor: "#27272a", background: "#111111" }}>
        <p className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: "#52525b" }}>Next up</p>
        <ol className="space-y-1.5">
          {nextUp.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#71717a" }}>
              <span className="font-mono font-bold" style={{ color: "#6366f1", minWidth: 16 }}>{i + 1}</span>{item}
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-lg border p-5" style={{ borderColor: "#27272a", background: "#111111" }}>
        <p className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: "#52525b" }}>Decisions log</p>
        <ul className="space-y-2">
          {decisions.map((item, i) => {
            const [bold, ...rest] = item.split(":");
            return (
              <li key={i} className="text-xs" style={{ color: "#71717a" }}>
                <span className="font-semibold" style={{ color: "#a1a1aa" }}>{bold}:</span>{rest.join(":")}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return <p className="mb-4 font-mono text-xs uppercase tracking-[0.16em]" style={{ color: "#52525b" }}>{children}</p>;
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function DashboardClient({ status }: { status: Record<string, string> }) {
  const [activeScope, setActiveScope] = useState("All");
  const [activeTab, setActiveTab] = useState<"status" | "routing" | "flow" | "files">("status");

  const scopes = ["All", "Global", "Project", "On-demand"];
  const filtered = activeScope === "All" ? CONFIG_FILES : CONFIG_FILES.filter(f => f.scope === activeScope);

  const tabs: Array<{ id: typeof activeTab; label: string }> = [
    { id: "status",  label: "Project Status" },
    { id: "flow",    label: "Session Flow" },
    { id: "routing", label: "Model Routing" },
    { id: "files",   label: "Config Files" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#09090b", color: "#f4f4f5", fontFamily: "var(--font-inter, system-ui)" }}>
      {/* Header */}
      <div className="border-b px-8 py-6" style={{ borderColor: "#27272a" }}>
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em]" style={{ color: "#52525b" }}>System Dashboard</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Antigravity Architecture</h1>
            <p className="mt-1 text-sm" style={{ color: "#71717a" }}>Token optimization · Model routing · Session continuity</p>
          </div>
          <div className="hidden gap-3 md:flex">
            {(Object.keys(MODELS) as Array<keyof typeof MODELS>).map(k => (
              <div key={k} className="text-center">
                <span
                  className="inline-block rounded px-3 py-1.5 font-mono text-sm uppercase tracking-wider"
                  style={{ background: MODELS[k].color + "22", color: MODELS[k].color, border: `1px solid ${MODELS[k].color}44` }}
                >
                  {MODELS[k].label}
                </span>
                <p className="mt-1.5 font-mono text-xs" style={{ color: "#3f3f46" }}>{MODELS[k].id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b px-8" style={{ borderColor: "#27272a" }}>
        <div className="mx-auto max-w-5xl flex gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="px-4 py-3 font-mono text-xs uppercase tracking-wider transition-colors"
              style={{
                color: activeTab === t.id ? "#e4e4e7" : "#52525b",
                borderBottom: activeTab === t.id ? "2px solid #6366f1" : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-8 py-8">

        {/* PROJECT STATUS tab */}
        {activeTab === "status" && (
          <section>
            <SectionLabel>Project Status: auto-updated on every deploy</SectionLabel>
            <StatusSection status={status} />
          </section>
        )}

        {/* SESSION FLOW tab */}
        {activeTab === "flow" && (
          <section>
            <SectionLabel>Session Start Flow</SectionLabel>
            <div className="rounded-lg border p-6" style={{ borderColor: "#27272a", background: "#111111" }}>
              <Flowchart />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                { title: "Global hook", body: "Runs on every project. Injects model tag requirement and routing rules into context." },
                { title: "Project hook", body: "Runs on this project only. Injects STATUS.md current state + full design system skill." },
                { title: "Model router", body: "Applied to every Agent spawn. Haiku for reads, Sonnet for code, Opus for planning." },
              ].map(c => (
                <div key={c.title} className="rounded-lg border p-4" style={{ borderColor: "#27272a", background: "#0a0a0b" }}>
                  <p className="mb-1.5 text-sm font-semibold" style={{ color: "#e4e4e7" }}>{c.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#71717a" }}>{c.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MODEL ROUTING tab */}
        {activeTab === "routing" && (
          <section>
            <SectionLabel>Model Routing Rules</SectionLabel>
            <div className="grid gap-4 md:grid-cols-3">
              {ROUTING_RULES.map(rule => {
                const m = MODELS[rule.model];
                return (
                  <div key={rule.model} className="rounded-lg border p-5" style={{ borderColor: "#27272a", background: "#111111" }}>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded px-3 py-1.5 font-mono text-sm uppercase tracking-wider" style={{ background: m.color + "22", color: m.color, border: `1px solid ${m.color}44` }}>{m.label}</span>
                      <span className="font-mono text-xs" style={{ color: "#3f3f46" }}>{m.id.split("-").slice(-1)[0]}</span>
                    </div>
                    <p className="mb-3 text-sm font-medium" style={{ color: "#e4e4e7" }}>{rule.trigger}</p>
                    <p className="mb-2 font-mono text-xs" style={{ color: "#52525b" }}>{m.desc}</p>
                    <div className="space-y-1 border-t pt-3" style={{ borderColor: "#27272a" }}>
                      {rule.examples.map(ex => (
                        <p key={ex} className="font-mono text-xs" style={{ color: "#3f3f46" }}>→ {ex}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-5" style={{ borderColor: "#27272a", background: "#111111" }}>
                <p className="mb-3 text-sm font-semibold" style={{ color: "#10b981" }}>✓ Enforced by config</p>
                <ul className="space-y-2">
                  {["[Model: X] tag on every response: AGENTS.md + CLAUDE.md","Sonnet as session default: settings.json (global + project)","Design system auto-loaded: project SessionStart hook","Routing rules in active context: hooks + AGENTS.md","Subagent declaration required: AGENTS.md"].map(i => (
                    <li key={i} className="flex items-start gap-2 font-mono text-xs" style={{ color: "#71717a" }}>
                      <span style={{ color: "#10b981" }}>→</span>{i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border p-5" style={{ borderColor: "#27272a", background: "#111111" }}>
                <p className="mb-3 text-sm font-semibold" style={{ color: "#f59e0b" }}>⚡ Requires spot-check</p>
                <ul className="space-y-2">
                  {["Subagent model: verify announcement in response text","Skill invocations: announced before use","IP handling: ip-handling skill must be invoked for customer refs","Memory file reads: index loaded; full files on demand"].map(i => (
                    <li key={i} className="flex items-start gap-2 font-mono text-xs" style={{ color: "#71717a" }}>
                      <span style={{ color: "#f59e0b" }}>→</span>{i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* CONFIG FILES tab */}
        {activeTab === "files" && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <SectionLabel>Configuration File Inventory</SectionLabel>
              <div className="flex gap-2">
                {scopes.map(s => (
                  <button key={s} onClick={() => setActiveScope(s)}
                    className="rounded px-3 py-1 font-mono text-xs uppercase tracking-wider transition-colors"
                    style={{ background: activeScope === s ? "#6366f122" : "transparent", color: activeScope === s ? "#6366f1" : "#52525b", border: `1px solid ${activeScope === s ? "#6366f144" : "#27272a"}` }}
                  >{s}</button>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border" style={{ borderColor: "#27272a" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#111111", borderBottom: "1px solid #27272a" }}>
                    {["Scope", "File", "Role", "Loaded"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider" style={{ color: "#52525b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((f, i) => (
                    <tr key={f.path} style={{ background: i % 2 === 0 ? "#0a0a0b" : "#111111", borderBottom: "1px solid #1c1c1e" }}>
                      <td className="px-4 py-3">
                        <span className="rounded px-2 py-0.5 font-mono text-xs" style={{ background: f.scope === "Global" ? "#f59e0b22" : f.scope === "Project" ? "#6366f122" : "#10b98122", color: f.scope === "Global" ? "#f59e0b" : f.scope === "Project" ? "#6366f1" : "#10b981" }}>{f.scope}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "#a1a1aa" }}>{f.path}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#71717a" }}>{f.role}</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: f.always ? "#10b981" : "#52525b" }}>{f.always ? "Always" : "On demand"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <footer className="mt-10 border-t pt-6 text-center font-mono text-xs" style={{ borderColor: "#27272a", color: "#3f3f46" }}>
          Reads STATUS.md at build time · Updated on every Vercel deploy · antigravity-sonnet
        </footer>
      </div>
    </div>
  );
}
