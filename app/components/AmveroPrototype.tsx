"use client";

import { useState, useEffect } from "react";

// --- Types ---
type JobStatus = "printing" | "aborted" | "finished" | "idle";

interface AlertRule {
  id: string;
  name: string;
  alertType: "anomaly" | "iot";
  anomalyType?: string;
  severity?: "critical" | "moderate";
  property: string;
  operator: string;
  value: number;
}

interface MockJob {
  id: string;
  machineName: string;
  serialNumber: string;
  jobId: string | null;
  status: JobStatus;
  progress: number;
  currentLayer: number;
  totalLayers: number;
  totalHeightMm: number;
  activeAlerts: string[];
}

// Optional annotation layer: one-line notes anchored to the UI regions that
// embody the PM decisions behind the product. Off by default so the demo
// stays a clean product simulation.
function PmNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 bg-[#16a34a]/10 border border-[#16a34a]/30 rounded-sm p-2 text-[9px] leading-relaxed text-[#d6d0c4] font-sans normal-case tracking-normal text-left font-normal">
      <span className="font-mono text-[8px] uppercase tracking-widest text-[#4ade80] border border-[#16a34a]/40 rounded-sm px-1 py-0.5 shrink-0 font-bold">
        PM
      </span>
      <span>{children}</span>
    </div>
  );
}

export default function AmveroPrototype() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "create-alert">("dashboard");
  const [filterStatus, setFilterStatus] = useState<JobStatus | "all">("all");
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [showPmNotes, setShowPmNotes] = useState<boolean>(false);

  // --- State for Alert Rules ---
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: "rule-1",
      name: "Critical Recoater Line Detection",
      alertType: "anomaly",
      anomalyType: "recoater_lines",
      severity: "critical",
      property: "anomaly_height_layers",
      operator: "gte",
      value: 3,
    },
    {
      id: "rule-2",
      name: "Chamber Overpressure Warning",
      alertType: "iot",
      property: "pneumatic_argon_pressure",
      operator: "gt",
      value: 1200,
    }
  ]);

  // --- State for Machines ---
  const [jobs, setJobs] = useState<MockJob[]>([
    {
      id: "j1",
      machineName: "300005-SLA750-E01",
      serialNumber: "SN-98231A",
      jobId: "JOB-48291",
      status: "aborted",
      progress: 42,
      currentLayer: 420,
      totalLayers: 1000,
      totalHeightMm: 150,
      activeAlerts: ["Recoater lines detected on layer 418"],
    },
    {
      id: "j2",
      machineName: "SLM-Alpha-DualLaser",
      serialNumber: "SN-10294X",
      jobId: "JOB-50124",
      status: "printing",
      progress: 24,
      currentLayer: 240,
      totalLayers: 1000,
      totalHeightMm: 120,
      activeAlerts: [],
    },
    {
      id: "j3",
      machineName: "Velo3D-Sapphire-E03",
      serialNumber: "SN-55212M",
      jobId: "JOB-51042",
      status: "printing",
      progress: 81,
      currentLayer: 810,
      totalLayers: 1000,
      totalHeightMm: 420,
      activeAlerts: [],
    },
    {
      id: "j4",
      machineName: "300006-SLA750-E02",
      serialNumber: "-",
      jobId: null,
      status: "idle",
      progress: 0,
      currentLayer: 0,
      totalLayers: 0,
      totalHeightMm: 0,
      activeAlerts: [],
    },
    {
      id: "j5",
      machineName: "SLM-Beta-QuadLaser",
      serialNumber: "SN-29384B",
      jobId: "JOB-49823",
      status: "finished",
      progress: 100,
      currentLayer: 1200,
      totalLayers: 1200,
      totalHeightMm: 360,
      activeAlerts: [],
    }
  ]);

  // --- Live Printing Animation effect ---
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (job.status === "printing") {
            const nextProgress = job.progress >= 99 ? 0 : job.progress + 1;
            const nextLayer = Math.round((nextProgress / 100) * job.totalLayers);
            // Simulate random active alerts based on rules
            let activeAlerts = [...job.activeAlerts];
            if (nextProgress === 25 && job.id === "j2") {
              activeAlerts.push("Spatter threshold exceeded on layer 250");
            } else if (nextProgress === 85 && job.id === "j3") {
              activeAlerts.push("Thermal deviation warning on layer 850");
            }
            return {
              ...job,
              progress: nextProgress,
              currentLayer: nextLayer,
              activeAlerts,
            };
          }
          return job;
         })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // --- Form State for Creating Alert ---
  const [newRuleName, setNewRuleName] = useState("");
  const [newAlertType, setNewAlertType] = useState<"anomaly" | "iot">("anomaly");
  const [newAnomalyType, setNewAnomalyType] = useState("recoater_lines");
  const [newSeverity, setNewSeverity] = useState<"critical" | "moderate">("critical");
  const [newProperty, setNewProperty] = useState("anomaly_height_layers");
  const [newOperator, setNewOperator] = useState("gte");
  const [newValue, setNewValue] = useState<number>(3);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const rule: AlertRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      alertType: newAlertType,
      ...(newAlertType === "anomaly" ? { anomalyType: newAnomalyType, severity: newSeverity } : {}),
      property: newProperty,
      operator: newOperator,
      value: newValue,
    };

    setAlertRules((prev) => [rule, ...prev]);

    // Trigger alert simulation on the printing machine
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id === "j2") {
          return {
            ...job,
            activeAlerts: [
              ...job.activeAlerts,
              `Rule Triggered: "${newRuleName}" detected at layer ${job.currentLayer}`
            ]
          };
        }
        return job;
      })
    );

    // Reset Form & Show Success Toast
    setNewRuleName("");
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    setActiveTab("dashboard");
  };

  const handleDeleteRule = (id: string) => {
    setAlertRules((prev) => prev.filter((r) => r.id !== id));
  };

  const filteredJobs = filterStatus === "all" ? jobs : jobs.filter((j) => j.status === filterStatus);

  const counts = {
    all: jobs.length,
    printing: jobs.filter((j) => j.status === "printing").length,
    aborted: jobs.filter((j) => j.status === "aborted").length,
    finished: jobs.filter((j) => j.status === "finished").length,
    idle: jobs.filter((j) => j.status === "idle").length,
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1b1916] border border-[#2d2a26] rounded-sm overflow-hidden font-sans text-xs text-[#f0ebe0] relative">
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="absolute top-4 right-4 bg-[#16a34a] text-black px-4 py-2 rounded-sm font-semibold font-mono z-50 flex items-center gap-2 shadow-lg animate-fade-in">
          <span>✔</span> Alert Rule Saved & Applied to Fleet
        </div>
      )}

      {/* Tabs / Top Header Bar */}
      <div className="flex justify-between items-center border-b border-[#2d2a26] bg-[#26231e] px-4 py-2 flex-shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1 font-mono uppercase tracking-wider rounded-sm text-[10px] md:text-xs font-bold transition-all ${
              activeTab === "dashboard" ? "bg-[#1b1916] text-[#16a34a] border border-[#2d2a26] shadow-sm" : "text-[#b3ab9b] hover:text-[#f0ebe0]"
            }`}
          >
            Fleet Dashboard
          </button>
          <button
            onClick={() => setActiveTab("create-alert")}
            className={`px-3 py-1 font-mono uppercase tracking-wider rounded-sm text-[10px] md:text-xs font-bold transition-all ${
              activeTab === "create-alert" ? "bg-[#1b1916] text-[#16a34a] border border-[#2d2a26] shadow-sm" : "text-[#b3ab9b] hover:text-[#f0ebe0]"
            }`}
          >
            + Create Alert Rule
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPmNotes(!showPmNotes)}
            aria-pressed={showPmNotes}
            className={`flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider font-semibold transition-colors ${
              showPmNotes ? "text-[#4ade80]" : "text-[#b3ab9b] hover:text-[#f0ebe0]"
            }`}
          >
            <div className={`w-6 h-3 rounded-full relative transition-colors ${showPmNotes ? "bg-[#16a34a]" : "bg-[#2d2a26]"}`}>
              <div className={`w-2.5 h-2.5 bg-white rounded-full absolute top-[1px] transition-transform ${showPmNotes ? "translate-x-3" : "translate-x-[1px]"}`} />
            </div>
            PM Notes
          </button>
          <div className="hidden md:block text-[10px] font-mono text-[#b3ab9b] font-medium">
            AMVero AI Control Console v2.1
          </div>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-[#1b1916]">
        
        {/* TAB 1: FLEET DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-4 h-full">
            {/* Filter Bar */}
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-1">
                {(["all", "printing", "finished", "aborted", "idle"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-2 py-1 rounded-sm capitalize font-mono text-[9px] border transition-all ${
                      filterStatus === status
                        ? "bg-[#16a34a]/10 border-[#16a34a]/30 text-[#16a34a] font-bold"
                        : "bg-transparent border-transparent text-[#b3ab9b] hover:bg-[#26231e]"
                    }`}
                  >
                    {status} ({status === "all" ? counts.all : counts[status]})
                  </button>
                ))}
              </div>

              {/* Compact mode toggle */}
              <button
                onClick={() => setIsCompact(!isCompact)}
                className="flex items-center gap-1.5 font-mono text-[9px] text-[#b3ab9b] hover:text-[#f0ebe0] font-semibold"
              >
                <div className={`w-6 h-3 rounded-full relative transition-colors ${isCompact ? "bg-[#16a34a]" : "bg-[#2d2a26]"}`}>
                  <div className={`w-2.5 h-2.5 bg-white rounded-full absolute top-[1px] transition-transform ${isCompact ? "translate-x-3" : "translate-x-[1px]"}`} />
                </div>
                Compact Mode
              </button>
            </div>

            {/* Machines Grid */}
            <div className={`grid gap-4 ${isCompact ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"}`}>
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-[#26231e] border border-[#2d2a26] rounded-sm p-3 flex flex-col gap-2 relative">
                  
                  {/* Machine Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[#f0ebe0] text-sm tracking-tight">{job.machineName}</h4>
                      <p className="text-[9px] text-[#b3ab9b] font-mono mt-0.5">{job.serialNumber} · {job.jobId || "No active job"}</p>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`px-1.5 py-0.5 rounded-sm text-[8px] font-mono uppercase tracking-widest font-bold ${
                      job.status === "printing" ? "bg-[#16a34a]/10 text-[#4ade80] border border-[#16a34a]/40" :
                      job.status === "aborted" ? "bg-red-950/40 text-red-400 border border-red-900" :
                      job.status === "finished" ? "bg-[#f0ebe0]/5 text-[#f0ebe0] border border-[#2d2a26]" :
                      "bg-black/40 text-[#b3ab9b] border border-[#2d2a26]"
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  {/* Print layer graphic in non-compact mode */}
                  {!isCompact && job.status !== "idle" && (
                    <div className="grid grid-cols-2 gap-2 bg-black/30 border border-[#2d2a26] rounded-sm p-1.5">
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <span className="text-[8px] text-[#b3ab9b] uppercase tracking-widest font-mono font-bold">Pre-Recoat Camera</span>
                        <div className="aspect-[16/10] bg-black rounded-none border border-[#2d2a26] overflow-hidden relative">
                          <img src="/ad85b8a1b7ae678f0364407f6e76752a9c3fa60a.png" className="w-full h-full object-cover" alt="Pre-recoat powder-bed camera frame" />
                          {job.status === "printing" && (
                            <span className="absolute top-1 right-1 flex items-center gap-1 bg-black/70 px-1 py-0.5 rounded-sm text-[7px] font-mono text-[#4ade80] tracking-widest font-bold">
                              <span className="w-1 h-1 rounded-full bg-[#4ade80] animate-pulse" /> LIVE
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <span className="text-[8px] text-[#b3ab9b] uppercase tracking-widest font-mono font-bold">Post-Recoat Camera</span>
                        <div className="aspect-[16/10] bg-black rounded-none border border-[#2d2a26] overflow-hidden relative">
                          <img src="/ca0f1faccbe56083dad5a77684dd3de5485d8199.png" className="w-full h-full object-cover" alt="Post-recoat camera frame with AI anomaly annotation" />
                          {job.status === "printing" && (
                            <span className="absolute top-1 right-1 flex items-center gap-1 bg-black/70 px-1 py-0.5 rounded-sm text-[7px] font-mono text-[#4ade80] tracking-widest font-bold">
                              <span className="w-1 h-1 rounded-full bg-[#4ade80] animate-pulse" /> LIVE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Progress info */}
                  {job.status !== "idle" && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-mono text-[#b3ab9b]">
                        <span>Progress:</span>
                        <span className="font-semibold text-[#f0ebe0]">{job.progress}% ({job.currentLayer} / {job.totalLayers} L)</span>
                      </div>
                      <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            job.status === "aborted" ? "bg-red-600" :
                            job.status === "finished" ? "bg-[#b3ab9b]" :
                            "bg-[#16a34a]"
                          }`}
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Alerts Footer */}
                  {!isCompact && (
                    <div className="mt-1 pt-1.5 border-t border-[#2d2a26] flex flex-col gap-1">
                      {job.activeAlerts.length === 0 ? (
                        <p className="text-[9px] font-mono text-[#b3ab9b] italic">No anomaly alerts active</p>
                      ) : (
                        job.activeAlerts.map((alert, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[9px] text-red-400 bg-red-950/40 border border-red-900 p-1 rounded-sm font-mono leading-none font-medium">
                            <span className="text-red-500 font-bold">⚠</span>
                            <span>{alert}</span>
                          </div>
                        ))
                      )}
                      {showPmNotes && job.id === "j1" && (
                        <PmNote>
                          Why operators trust this alert: it fired only after the
                          defect persisted across consecutive layers. A
                          single-frame spike never pages anyone.
                        </PmNote>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Active Rules List */}
            <div className="bg-[#26231e] border border-[#2d2a26] rounded-sm p-4 mt-2">
              <h4 className="font-mono text-[10px] uppercase tracking-wider text-[#b3ab9b] mb-2 font-bold">
                Active Anomaly Trigger Logic Rules ({alertRules.length})
              </h4>
              {showPmNotes && (
                <div className="mb-2">
                  <PmNote>
                    The core decision: condition-based rules instead of one
                    global severity threshold. Operators define the exact
                    conditions they trust — that is what eliminated alert
                    fatigue.
                  </PmNote>
                </div>
              )}
              <div className="flex flex-col gap-2">
                {alertRules.map((rule) => (
                  <div key={rule.id} className="flex justify-between items-center border border-[#2d2a26] bg-black/30 rounded-sm p-2 font-mono text-[9px]">
                    <div className="flex items-center gap-3">
                      <span className={`px-1.5 py-0.5 rounded-sm text-[8px] uppercase tracking-wider font-bold ${
                        rule.alertType === "anomaly" ? "bg-[#16a34a]/10 text-[#4ade80] border border-[#16a34a]/25" : "bg-[#f0ebe0]/5 text-[#b3ab9b] border border-[#2d2a26]"
                      }`}>
                        {rule.alertType}
                      </span>
                      <div>
                        <p className="font-bold text-[#f0ebe0]">{rule.name}</p>
                        <p className="text-[#b3ab9b] mt-0.5 font-medium">
                          Logic: `{rule.property} {rule.operator === "gte" ? ">=" : rule.operator === "gt" ? ">" : "=="} {rule.value}` 
                          {rule.anomalyType && ` | Anomaly: ${rule.anomalyType}`} 
                          {rule.severity && ` | Severity: ${rule.severity}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="text-[#b3ab9b] hover:text-red-400 p-1 transition-colors"
                      title="Delete Rule"
                    >
                      {/* Trash SVG */}
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h10M5 6v8a1 1 0 001 1h4a1 1 0 001-1V6M8 3h0" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CREATE ALERT RULE */}
        {activeTab === "create-alert" && (
          <form onSubmit={handleCreateRule} className="max-w-xl mx-auto bg-[#26231e] border border-[#2d2a26] rounded-sm p-5 flex flex-col gap-4 font-mono text-xs text-[#f0ebe0]">
            <h3 className="text-sm font-bold text-[#16a34a] uppercase tracking-wider border-b border-[#2d2a26] pb-2">
              Create Smart Alert Model
            </h3>

            {/* Rule Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[#b3ab9b] text-[10px] uppercase font-bold">Rule Name</label>
              <input
                type="text"
                required
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="e.g. Recoater Lines Alert Level 3"
                className="bg-[#1b1916] border border-[#2d2a26] p-2 rounded-sm focus:outline-none focus:border-[#16a34a] text-[#f0ebe0] font-medium placeholder:text-[#b3ab9b]"
              />
            </div>

            {/* Alert Type Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[#b3ab9b] text-[10px] uppercase font-bold">Alert Type</label>
                <select
                  value={newAlertType}
                  onChange={(e) => setNewAlertType(e.target.value as "anomaly" | "iot")}
                  className="bg-[#1b1916] border border-[#2d2a26] p-2 rounded-sm focus:outline-none focus:border-[#16a34a] text-[#f0ebe0] font-medium"
                >
                  <option value="anomaly">Anomaly (AI Detection)</option>
                  <option value="iot">IOT Sensor</option>
                </select>
              </div>

              {newAlertType === "anomaly" ? (
                <div className="flex flex-col gap-1">
                  <label className="text-[#b3ab9b] text-[10px] uppercase font-bold">Anomaly Type</label>
                  <select
                    value={newAnomalyType}
                    onChange={(e) => setNewAnomalyType(e.target.value)}
                    className="bg-[#1b1916] border border-[#2d2a26] p-2 rounded-sm focus:outline-none focus:border-[#16a34a] text-[#f0ebe0] font-medium"
                  >
                    <option value="recoater_lines">Recoater Lines</option>
                    <option value="warp">Warpage</option>
                    <option value="recoater_hopping">Recoater Hopping</option>
                    <option value="short_feed">Short Feed</option>
                  </select>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <label className="text-[#b3ab9b] text-[10px] uppercase font-bold">Severity Override</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="bg-[#1b1916] border border-[#2d2a26] p-2 rounded-sm focus:outline-none focus:border-[#16a34a] text-[#f0ebe0] font-medium"
                  >
                    <option value="critical">Critical</option>
                    <option value="moderate">Moderate</option>
                  </select>
                </div>
              )}
            </div>

            {showPmNotes && (
              <PmNote>
                Every rule combines an anomaly type, a measurable property, and
                a persistence threshold. I specified this multi-condition
                structure so alerts fire on confirmed defects, not
                single-layer noise.
              </PmNote>
            )}

            {/* Condition Property */}
            <div className="flex flex-col gap-1">
              <label className="text-[#b3ab9b] text-[10px] uppercase font-bold">Condition Property</label>
              <select
                value={newProperty}
                onChange={(e) => setNewProperty(e.target.value)}
                className="bg-[#1b1916] border border-[#2d2a26] p-2 rounded-sm focus:outline-none focus:border-[#16a34a] text-[#f0ebe0] font-medium"
              >
                {newAlertType === "anomaly" ? (
                  <>
                    <option value="anomaly_height_layers">Anomaly Height (Layers)</option>
                    <option value="anomaly_height_absolute">Anomaly Height (Absolute mm)</option>
                    <option value="volume">Volume (mm³)</option>
                    <option value="2d_area_current">2D Area (Current Layer mm²)</option>
                  </>
                ) : (
                  <>
                    <option value="pneumatic_argon_pressure">Argon Pressure (PSI)</option>
                    <option value="laser_temperature">Laser Temperature (°C)</option>
                    <option value="oxygen_concentration">Oxygen Concentration (ppm)</option>
                  </>
                )}
              </select>
            </div>

            {/* Operator and Value */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[#b3ab9b] text-[10px] uppercase font-bold">Logic Operator</label>
                <select
                  value={newOperator}
                  onChange={(e) => setNewOperator(e.target.value)}
                  className="bg-[#1b1916] border border-[#2d2a26] p-2 rounded-sm focus:outline-none focus:border-[#16a34a] text-[#f0ebe0] font-medium"
                >
                  <option value="gte">Greater or equal (&gt;=)</option>
                  <option value="gt">Greater than (&gt;)</option>
                  <option value="eq">Equal to (==)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#b3ab9b] text-[10px] uppercase font-bold">Threshold Value</label>
                <input
                  type="number"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(Number(e.target.value))}
                  className="bg-[#1b1916] border border-[#2d2a26] p-2 rounded-sm focus:outline-none focus:border-[#16a34a] text-[#f0ebe0] font-medium"
                />
              </div>
            </div>

            {/* Recurrent alert rule */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#2d2a26]">
              <input type="checkbox" defaultChecked id="recurrent" className="accent-[#16a34a] h-3.5 w-3.5" />
              <label htmlFor="recurrent" className="text-[#b3ab9b] cursor-pointer font-medium select-none">
                Recurrent rule: repeat alert on subsequent layer crossings
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className="px-4 py-2 bg-[#1b1916] border border-[#2d2a26] hover:bg-[#26231e] text-[#f0ebe0] rounded-sm font-bold font-mono transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#16a34a] hover:bg-[#16a34a]/80 text-black font-bold font-mono rounded-sm transition-all shadow-sm"
              >
                Save & Apply
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
