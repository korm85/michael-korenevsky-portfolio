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

export default function AmveroPrototype() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "create-alert">("dashboard");
  const [filterStatus, setFilterStatus] = useState<JobStatus | "all">("all");
  const [isCompact, setIsCompact] = useState<boolean>(false);

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
    <div className="w-full h-full flex flex-col bg-canvas border border-border-dark rounded-xl overflow-hidden font-sans text-xs text-text-secondary relative">
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="absolute top-4 right-4 bg-teal-accent text-black px-4 py-2 rounded-md font-semibold font-mono z-50 flex items-center gap-2 shadow-lg animate-fade-in">
          <span>✔</span> Alert Rule Saved & Applied to Fleet
        </div>
      )}

      {/* Tabs / Top Header Bar */}
      <div className="flex justify-between items-center border-b border-border-dark bg-[#1a1b1d] px-4 py-2 flex-shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1 font-mono uppercase tracking-wider rounded-md text-[10px] md:text-xs font-bold transition-all ${
              activeTab === "dashboard" ? "bg-canvas text-teal-accent border border-border-dark shadow-sm" : "text-text-muted hover:text-white"
            }`}
          >
            Fleet Dashboard
          </button>
          <button
            onClick={() => setActiveTab("create-alert")}
            className={`px-3 py-1 font-mono uppercase tracking-wider rounded-md text-[10px] md:text-xs font-bold transition-all ${
              activeTab === "create-alert" ? "bg-canvas text-teal-accent border border-border-dark shadow-sm" : "text-text-muted hover:text-white"
            }`}
          >
            + Create Alert Rule
          </button>
        </div>
        <div className="text-[10px] font-mono text-text-muted font-medium">
          AMVero AI Control Console v2.1
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-canvas">
        
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
                    className={`px-2 py-1 rounded capitalize font-mono text-[9px] border transition-all ${
                      filterStatus === status
                        ? "bg-teal-accent-dim border-teal-accent/30 text-teal-accent font-bold"
                        : "bg-transparent border-transparent text-text-muted hover:bg-surface"
                    }`}
                  >
                    {status} ({status === "all" ? counts.all : counts[status]})
                  </button>
                ))}
              </div>

              {/* Compact mode toggle */}
              <button
                onClick={() => setIsCompact(!isCompact)}
                className="flex items-center gap-1.5 font-mono text-[9px] text-text-muted hover:text-white font-semibold"
              >
                <div className={`w-6 h-3 rounded-full relative transition-colors ${isCompact ? "bg-teal-accent" : "bg-border-dark"}`}>
                  <div className={`w-2.5 h-2.5 bg-white rounded-full absolute top-[1px] transition-transform ${isCompact ? "translate-x-3" : "translate-x-[1px]"}`} />
                </div>
                Compact Mode
              </button>
            </div>

            {/* Machines Grid */}
            <div className={`grid gap-4 ${isCompact ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"}`}>
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-surface border border-border-dark rounded-lg p-3 flex flex-col gap-2 relative">
                  
                  {/* Machine Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm tracking-tight">{job.machineName}</h4>
                      <p className="text-[9px] text-text-muted font-mono mt-0.5">{job.serialNumber} · {job.jobId || "No active job"}</p>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest font-bold ${
                      job.status === "printing" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900" :
                      job.status === "aborted" ? "bg-red-950/40 text-red-400 border border-red-900" :
                      job.status === "finished" ? "bg-blue-950/40 text-blue-400 border border-blue-900" :
                      "bg-black/40 text-text-muted border border-border-dark"
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  {/* Print layer graphic in non-compact mode */}
                  {!isCompact && job.status !== "idle" && (
                    <div className="grid grid-cols-2 gap-2 h-20 bg-black/40 border border-border-dark rounded p-1.5">
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <span className="text-[7px] text-text-muted uppercase tracking-widest font-mono font-bold">Pre-Recoat Camera</span>
                        <div className="flex-1 bg-black rounded overflow-hidden flex items-center justify-center relative">
                          <img src="/ad85b8a1b7ae678f0364407f6e76752a9c3fa60a.png" className="w-full h-full object-cover" alt="pre-recoat feed" />
                          <div className="absolute inset-0 bg-teal-accent/5" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <span className="text-[7px] text-text-muted uppercase tracking-widest font-mono font-bold">Post-Recoat Camera</span>
                        <div className="flex-1 bg-black rounded overflow-hidden flex items-center justify-center relative">
                          <img src="/ca0f1faccbe56083dad5a77684dd3de5485d8199.png" className="w-full h-full object-cover" alt="post-recoat feed" />
                          <div className="absolute inset-0 bg-teal-accent/5" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Progress info */}
                  {job.status !== "idle" && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-mono text-text-muted">
                        <span>Progress:</span>
                        <span className="font-semibold text-white">{job.progress}% ({job.currentLayer} / {job.totalLayers} L)</span>
                      </div>
                      <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            job.status === "aborted" ? "bg-red-600" :
                            job.status === "finished" ? "bg-blue-600" :
                            "bg-teal-accent"
                          }`}
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Alerts Footer */}
                  {!isCompact && (
                    <div className="mt-1 pt-1.5 border-t border-border-dark flex flex-col gap-1">
                      {job.activeAlerts.length === 0 ? (
                        <p className="text-[9px] font-mono text-text-muted italic">No anomaly alerts active</p>
                      ) : (
                        job.activeAlerts.map((alert, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[9px] text-red-400 bg-red-950/40 border border-red-900 p-1 rounded font-mono leading-none font-medium">
                            <span className="text-red-500 font-bold">⚠</span>
                            <span>{alert}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Active Rules List */}
            <div className="bg-surface border border-border-dark rounded-xl p-4 mt-2">
              <h4 className="font-mono text-[10px] uppercase tracking-wider text-text-muted mb-2 font-bold">
                Active Anomaly Trigger Logic Rules ({alertRules.length})
              </h4>
              <div className="flex flex-col gap-2">
                {alertRules.map((rule) => (
                  <div key={rule.id} className="flex justify-between items-center border border-border-dark bg-black/30 rounded-lg p-2 font-mono text-[9px]">
                    <div className="flex items-center gap-3">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold ${
                        rule.alertType === "anomaly" ? "bg-teal-accent-dim text-teal-accent border border-teal-accent/25" : "bg-blue-950/50 text-blue-400 border border-blue-900/50"
                      }`}>
                        {rule.alertType}
                      </span>
                      <div>
                        <p className="font-bold text-white">{rule.name}</p>
                        <p className="text-text-muted mt-0.5 font-medium">
                          Logic: `{rule.property} {rule.operator === "gte" ? ">=" : rule.operator === "gt" ? ">" : "=="} {rule.value}` 
                          {rule.anomalyType && ` | Anomaly: ${rule.anomalyType}`} 
                          {rule.severity && ` | Severity: ${rule.severity}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="text-text-muted hover:text-red-400 p-1 transition-colors"
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
          <form onSubmit={handleCreateRule} className="max-w-xl mx-auto bg-surface border border-border-dark rounded-xl p-5 flex flex-col gap-4 font-mono text-xs text-text-secondary">
            <h3 className="text-sm font-bold text-teal-accent uppercase tracking-wider border-b border-border-dark pb-2">
              Create Smart Alert Model
            </h3>

            {/* Rule Name */}
            <div className="flex flex-col gap-1">
              <label className="text-text-muted text-[10px] uppercase font-bold">Rule Name</label>
              <input
                type="text"
                required
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="e.g. Recoater Lines Alert Level 3"
                className="bg-canvas border border-border-dark p-2 rounded focus:outline-none focus:border-teal-accent text-white font-medium placeholder:text-text-muted"
              />
            </div>

            {/* Alert Type Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-text-muted text-[10px] uppercase font-bold">Alert Type</label>
                <select
                  value={newAlertType}
                  onChange={(e) => setNewAlertType(e.target.value as "anomaly" | "iot")}
                  className="bg-canvas border border-border-dark p-2 rounded focus:outline-none focus:border-teal-accent text-white font-medium"
                >
                  <option value="anomaly">Anomaly (Computer Vision)</option>
                  <option value="iot">IOT Sensor</option>
                </select>
              </div>

              {newAlertType === "anomaly" ? (
                <div className="flex flex-col gap-1">
                  <label className="text-text-muted text-[10px] uppercase font-bold">Anomaly Type</label>
                  <select
                    value={newAnomalyType}
                    onChange={(e) => setNewAnomalyType(e.target.value)}
                    className="bg-canvas border border-border-dark p-2 rounded focus:outline-none focus:border-teal-accent text-white font-medium"
                  >
                    <option value="recoater_lines">Recoater Lines</option>
                    <option value="warp">Warpage</option>
                    <option value="recoater_hopping">Recoater Hopping</option>
                    <option value="short_feed">Short Feed</option>
                  </select>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <label className="text-text-muted text-[10px] uppercase font-bold">Severity Override</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="bg-canvas border border-border-dark p-2 rounded focus:outline-none focus:border-teal-accent text-white font-medium"
                  >
                    <option value="critical">Critical</option>
                    <option value="moderate">Moderate</option>
                  </select>
                </div>
              )}
            </div>

            {/* Condition Property */}
            <div className="flex flex-col gap-1">
              <label className="text-text-muted text-[10px] uppercase font-bold">Condition Property</label>
              <select
                value={newProperty}
                onChange={(e) => setNewProperty(e.target.value)}
                className="bg-canvas border border-border-dark p-2 rounded focus:outline-none focus:border-teal-accent text-white font-medium"
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
                <label className="text-text-muted text-[10px] uppercase font-bold">Logic Operator</label>
                <select
                  value={newOperator}
                  onChange={(e) => setNewOperator(e.target.value)}
                  className="bg-canvas border border-border-dark p-2 rounded focus:outline-none focus:border-teal-accent text-white font-medium"
                >
                  <option value="gte">Greater or equal (&gt;=)</option>
                  <option value="gt">Greater than (&gt;)</option>
                  <option value="eq">Equal to (==)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-text-muted text-[10px] uppercase font-bold">Threshold Value</label>
                <input
                  type="number"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(Number(e.target.value))}
                  className="bg-canvas border border-border-dark p-2 rounded focus:outline-none focus:border-teal-accent text-white font-medium"
                />
              </div>
            </div>

            {/* Recurrent alert rule */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border-dark">
              <input type="checkbox" defaultChecked id="recurrent" className="accent-teal-accent h-3.5 w-3.5" />
              <label htmlFor="recurrent" className="text-text-muted cursor-pointer font-medium select-none">
                Recurrent rule: repeat alert on subsequent layer crossings
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className="px-4 py-2 bg-canvas border border-border-dark hover:bg-surface text-text-secondary rounded font-bold font-mono transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-accent hover:bg-teal-accent/80 text-black font-bold font-mono rounded transition-all shadow-sm"
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
