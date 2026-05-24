import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import imgLayer1 from 'figma:asset/ad85b8a1b7ae678f0364407f6e76752a9c3fa60a.png';
import imgLayer2 from 'figma:asset/ca0f1faccbe56083dad5a77684dd3de5485d8199.png';
import imgMachine from 'figma:asset/792ba46e567f1ad13119d816f1dcf82326dbb35f.png';

// ─── Types ────────────────────────────────────────────────────────────────────

type JobStatus = 'printing' | 'aborted' | 'finished' | 'idle';

interface AlertItem {
  label: string;
  value: string;
  layer: number;
  type: 'iot' | 'anomaly';
}

interface MockJob {
  id: string;
  machineName: string;
  serialNumber: string;
  jobId: string | null;
  timestamp: string | null;
  status: JobStatus;
  progress: number;
  currentLayer: number;
  totalLayers: number;
  totalHeightMm: number;
  alerts: AlertItem[];
  showMachineInfo?: boolean;
  machineInfo?: { serialNumber: string; ip: string; firmware: string; version: string };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_JOBS: MockJob[] = [
  {
    id: 'j1',
    machineName: '300005-SLA750-E01',
    serialNumber: '0123787015456',
    jobId: '0123787015456',
    timestamp: '2025-12-5 20:15:08',
    status: 'aborted',
    progress: 20,
    currentLayer: 2,
    totalLayers: 10,
    totalHeightMm: 150,
    alerts: [],
  },
  {
    id: 'j2',
    machineName: '300005-SLA750-E01',
    serialNumber: '0123787015456',
    jobId: '0123787015456',
    timestamp: '2025-12-5 20:15:08',
    status: 'printing',
    progress: 20,
    currentLayer: 2,
    totalLayers: 10,
    totalHeightMm: 150,
    alerts: [
      { label: 'Extruder Temp.', value: '185° (+175°)', layer: 162, type: 'iot' },
      { label: 'Recoater Lines Critical', value: '', layer: 162, type: 'anomaly' },
    ],
  },
  {
    id: 'j3',
    machineName: '300005-SLA750-E01',
    serialNumber: '0123787015456',
    jobId: 'JOB-0123787015456',
    timestamp: '2025-12-5 20:15:08',
    status: 'printing',
    progress: 20,
    currentLayer: 2,
    totalLayers: 10,
    totalHeightMm: 150,
    alerts: [
      { label: 'Pressure', value: '1300 (+1000)', layer: 162, type: 'iot' },
    ],
  },
  {
    id: 'j4',
    machineName: 'SLM-Alpha',
    serialNumber: '-',
    jobId: null,
    timestamp: null,
    status: 'idle',
    progress: 0,
    currentLayer: 0,
    totalLayers: 0,
    totalHeightMm: 0,
    alerts: [],
  },
  {
    id: 'j5',
    machineName: '300005-SLA750-E01',
    serialNumber: '0123787015456',
    jobId: '0123787015456',
    timestamp: '2025-12-5 20:15:08',
    status: 'finished',
    progress: 100,
    currentLayer: 10,
    totalLayers: 10,
    totalHeightMm: 480,
    alerts: [
      { label: 'Extruder Temp.', value: '185° (+179°)', layer: 162, type: 'iot' },
      { label: 'Recoater Lines Critical', value: '', layer: 162, type: 'anomaly' },
    ],
  },
  {
    id: 'j6',
    machineName: '300005-SLA750-E01',
    serialNumber: '0123787015456',
    jobId: 'JOB-0123787015456',
    timestamp: '2025-12-5 20:15:08',
    status: 'printing',
    progress: 60,
    currentLayer: 6,
    totalLayers: 10,
    totalHeightMm: 350,
    alerts: [],
    showMachineInfo: true,
    machineInfo: { serialNumber: '5750', ip: 'N/A', firmware: '-', version: 'V1.12.0' },
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<JobStatus, string> = {
  printing: 'bg-emerald-500 text-white',
  aborted: 'bg-red-500 text-white',
  finished: 'bg-blue-500 text-white',
  idle: 'bg-[rgba(35,64,87,0.15)] text-[#59747a]',
};

function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className={`inline-flex items-center px-[8px] py-[2px] rounded-[3px] font-['Centra_No2:Medium',sans-serif] text-[10px] tracking-[0.8px] uppercase ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

// ─── Alert Badge ──────────────────────────────────────────────────────────────

function AlertBadge({ alert }: { alert: AlertItem }) {
  const isIot = alert.type === 'iot';
  return (
    <div className={`flex items-center gap-[5px] px-[8px] py-[4px] rounded-[3px] ${isIot ? 'bg-orange-50 border border-orange-200' : 'bg-red-50 border border-red-200'}`}>
      {isIot ? (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <circle cx="5.5" cy="5.5" r="4.5" stroke="#d97706" strokeWidth="1.2" />
          <path d="M5.5 3.5V5.5" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="5.5" cy="7.2" r="0.6" fill="#d97706" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M5.5 1.5L10 9.5H1L5.5 1.5Z" stroke="#ef4444" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M5.5 5V7" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="5.5" cy="8" r="0.5" fill="#ef4444" />
        </svg>
      )}
      <span className={`font-['Centra_No2:Medium',sans-serif] text-[10px] tracking-[0.2px] ${isIot ? 'text-orange-700' : 'text-red-600'}`}>
        {alert.label}{alert.value ? ` ${alert.value}` : ''}
      </span>
      <span className={`font-['Centra_No2:Book',sans-serif] text-[10px] ${isIot ? 'text-orange-500' : 'text-red-400'}`}>
        L{alert.layer}
      </span>
    </div>
  );
}

// ─── Idle Placeholder Image ───────────────────────────────────────────────────

function IdlePlaceholder() {
  return (
    <div className="flex-1 bg-[#f0f0ee] flex flex-col items-center justify-center gap-[6px]">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="8" width="20" height="3" rx="1" fill="#c8d0d4" />
        <rect x="4" y="13" width="20" height="3" rx="1" fill="#c8d0d4" />
        <rect x="4" y="18" width="20" height="3" rx="1" fill="#c8d0d4" />
      </svg>
    </div>
  );
}

// ─── Machine Card ─────────────────────────────────────────────────────────────

function MachineCard({ job, compact }: { job: MockJob; compact: boolean }) {
  const iotAlerts = job.alerts.filter(a => a.type === 'iot');
  const anomalyAlerts = job.alerts.filter(a => a.type === 'anomaly');

  return (
    <div className="bg-white rounded-[4px] shadow-[0px_1px_6px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden relative">
      <div aria-hidden className="absolute border border-[rgba(35,64,87,0.1)] inset-0 rounded-[4px] pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between px-[12px] pt-[10px] pb-[8px] shrink-0">
        <div className="flex-1 min-w-0">
          <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13px] tracking-[0.52px] truncate" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            {job.machineName}
          </p>
          {job.jobId && !compact && (
            <div className="flex items-center gap-[8px] mt-[3px]">
              <div className="flex items-center gap-[3px]">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1h3v3H1zM6 1h3v3H6zM1 6h3v3H1zM6 6h3v3H6z" fill="#a8b7bf" />
                </svg>
                <span className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[10px] tracking-[0.2px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{job.serialNumber}</span>
              </div>
              {job.timestamp && (
                <div className="flex items-center gap-[3px]">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="4" stroke="#a8b7bf" strokeWidth="1" />
                    <path d="M5 2.5V5l1.5 1.5" stroke="#a8b7bf" strokeWidth="0.9" strokeLinecap="round" />
                  </svg>
                  <span className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[10px] tracking-[0.2px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{job.timestamp}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-[6px] shrink-0 ml-[8px]">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1C6.5 1 3.5 3.5 3.5 6.5C3.5 8.16 4.84 9.5 6.5 9.5C8.16 9.5 9.5 8.16 9.5 6.5C9.5 3.5 6.5 1Z" stroke="#a8b7bf" strokeWidth="1.1" strokeLinejoin="round" />
            <path d="M6.5 9.5V12" stroke="#a8b7bf" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          <StatusBadge status={job.status} />
        </div>
      </div>

      {/* Images or Machine Info */}
      {!compact && (
        <div className="flex-1 min-h-0">
          {job.status === 'idle' ? (
            <div className="flex gap-[1px] h-[140px]">
              <div className="flex-1 flex flex-col">
                <div className="px-[8px] pt-[4px] pb-[2px]">
                  <span className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[8px] tracking-[0.64px] uppercase">Pre-Recoating</span>
                </div>
                <IdlePlaceholder />
              </div>
              <div className="w-px bg-[rgba(35,64,87,0.08)]" />
              <div className="flex-1 flex flex-col">
                <div className="px-[8px] pt-[4px] pb-[2px]">
                  <span className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[8px] tracking-[0.64px] uppercase">Post-Recoating</span>
                </div>
                <IdlePlaceholder />
              </div>
            </div>
          ) : job.showMachineInfo ? (
            <div className="flex gap-[8px] px-[12px] pb-[8px] h-[140px]">
              <div className="w-[110px] shrink-0 flex items-center justify-center">
                <ImageWithFallback src={imgMachine} alt="Machine" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 flex flex-col justify-center gap-[4px]">
                <div className="flex flex-col gap-[2px]">
                  {[
                    { label: 'Description', value: job.machineInfo?.firmware || '—' },
                    { label: 'Serial Number', value: job.machineInfo?.serialNumber || '—' },
                    { label: 'IP', value: job.machineInfo?.ip || '—' },
                    { label: 'FM', value: '—' },
                    { label: 'Version', value: job.machineInfo?.version || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-baseline gap-[6px]">
                      <span className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[10px] tracking-[0.2px] w-[80px] shrink-0">{label}</span>
                      <span className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[10px] tracking-[0.2px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-[1px] h-[140px]">
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-[8px] pt-[4px] pb-[2px] shrink-0">
                  <span className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[8px] tracking-[0.64px] uppercase">Pre-Recoating</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ImageWithFallback src={imgLayer1} alt="Pre-recoating" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="w-px bg-[rgba(35,64,87,0.08)]" />
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-[8px] pt-[4px] pb-[2px] shrink-0">
                  <span className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[8px] tracking-[0.64px] uppercase">Post-Recoating</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ImageWithFallback src={imgLayer2} alt="Post-recoating" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="px-[12px] py-[8px] shrink-0">
        <div className="flex items-center justify-between mb-[5px]">
          <div className="flex-1 bg-[rgba(35,64,87,0.1)] rounded-full h-[3px] mr-[8px]">
            <div
              className={`h-full rounded-full transition-all ${job.status === 'aborted' ? 'bg-red-400' : job.status === 'finished' ? 'bg-blue-400' : 'bg-[#6d74f3]'}`}
              style={{ width: `${job.progress}%` }}
            />
          </div>
          <span className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[11px] tracking-[0.44px] shrink-0" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            {job.progress}%
          </span>
        </div>
        {!compact && (
          <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[10px] tracking-[0.2px] text-right" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            {job.currentLayer}/{job.totalLayers} layers{job.totalHeightMm > 0 ? ` (${job.totalHeightMm}mm)` : ''}
          </p>
        )}
      </div>

      {/* Alerts Footer */}
      {!compact && (
        <div className="border-t border-[rgba(35,64,87,0.06)] px-[8px] py-[6px] flex flex-wrap gap-[4px] min-h-[32px] shrink-0">
          {iotAlerts.length === 0 && anomalyAlerts.length === 0 ? (
            <div className="flex items-center gap-[12px]">
              <span className="font-['Centra_No2:Book',sans-serif] text-[#d3d9dd] text-[10px] tracking-[0.2px]">No IOT alerts</span>
              <span className="font-['Centra_No2:Book',sans-serif] text-[#d3d9dd] text-[10px] tracking-[0.2px]">No anomalies alerts</span>
            </div>
          ) : (
            <>
              {iotAlerts.map((a, i) => <AlertBadge key={i} alert={a} />)}
              {anomalyAlerts.length === 0 ? (
                <span className="font-['Centra_No2:Book',sans-serif] text-[#d3d9dd] text-[10px] tracking-[0.2px] self-center ml-[2px]">No anomalies alerts</span>
              ) : (
                anomalyAlerts.map((a, i) => <AlertBadge key={i} alert={a} />)
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Filter Button ────────────────────────────────────────────────────────────

function FilterButton({ label, count, color, active, onClick }: { label: string; count: number; color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[5px] px-[12px] py-[5px] rounded-[6px] border transition-all ${
        active
          ? 'bg-white border-[rgba(110,70,232,0.5)] shadow-[0_1px_2.5px_rgba(0,0,0,0.1)]'
          : 'bg-transparent border-transparent hover:bg-white/60'
      }`}
    >
      {count > 0 && (
        <span className={`inline-flex items-center justify-center min-w-[16px] h-[16px] px-[4px] rounded-full text-white text-[10px] font-['Centra_No2:Medium',sans-serif] tracking-[0.2px] ${color}`}>
          {count}
        </span>
      )}
      <span className="font-['Centra_No2:Book',sans-serif] text-[#234057] text-[14px] tracking-[0.28px]">{label}</span>
    </button>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');
  const [compact, setCompact] = useState(false);

  const counts = {
    printing: MOCK_JOBS.filter(j => j.status === 'printing').length,
    aborted: MOCK_JOBS.filter(j => j.status === 'aborted').length,
    finished: MOCK_JOBS.filter(j => j.status === 'finished').length,
    idle: MOCK_JOBS.filter(j => j.status === 'idle').length,
  };

  const filtered = filter === 'all' ? MOCK_JOBS : MOCK_JOBS.filter(j => j.status === filter);

  return (
    <div className="min-h-screen bg-[#f8f7f6] px-[24px] pt-[24px] pb-[32px]">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-[16px]">
        <h1 className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[20px] tracking-[0.4px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
          Dashboard
        </h1>
        <div className="flex items-center gap-[8px]">
          {/* Help */}
          <button className="relative rounded-[3px] size-[40px] flex items-center justify-center">
            <span className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13px]">?</span>
            <div aria-hidden className="absolute border border-[rgba(35,64,87,0.2)] inset-0 rounded-[3px] pointer-events-none" />
          </button>
          {/* Profile */}
          <button className="relative rounded-[3px] size-[40px] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="5.5" r="3" stroke="#234057" strokeWidth="1.3" />
              <path d="M2.5 15c0-3.03 2.46-5.5 5.5-5.5s5.5 2.47 5.5 5.5" stroke="#234057" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <div aria-hidden className="absolute border border-[rgba(35,64,87,0.2)] inset-0 rounded-[3px] pointer-events-none" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-[20px]">
        <div className="flex items-center gap-[4px]">
          <FilterButton label="All" count={0} color="bg-[#6d74f3]" active={filter === 'all'} onClick={() => setFilter('all')} />
          <FilterButton label="Printing" count={counts.printing} color="bg-emerald-500" active={filter === 'printing'} onClick={() => setFilter('printing')} />
          <FilterButton label="Aborted" count={counts.aborted} color="bg-red-500" active={filter === 'aborted'} onClick={() => setFilter('aborted')} />
          <FilterButton label="Finished" count={counts.finished} color="bg-blue-500" active={filter === 'finished'} onClick={() => setFilter('finished')} />
          <FilterButton label="Idle" count={counts.idle} color="bg-[#a8b7bf]" active={filter === 'idle'} onClick={() => setFilter('idle')} />
        </div>
        <div className="flex items-center gap-[16px]">
          {/* Sort */}
          <button className="flex items-center gap-[5px] text-[#59747a] hover:text-[#234057] transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="font-['Centra_No2:Book',sans-serif] text-[13px] tracking-[0.26px]">Sort</span>
          </button>
          {/* Compact Mode */}
          <label className="flex items-center gap-[7px] cursor-pointer">
            <div
              className={`relative w-[28px] h-[16px] rounded-full transition-colors ${compact ? 'bg-[#6d74f3]' : 'bg-[rgba(35,64,87,0.2)]'}`}
              onClick={() => setCompact(p => !p)}
            >
              <div className={`absolute top-[2px] w-[12px] h-[12px] bg-white rounded-full shadow-sm transition-transform ${compact ? 'translate-x-[14px]' : 'translate-x-[2px]'}`} />
            </div>
            <span className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[13px] tracking-[0.26px]">Compact Mode</span>
          </label>
        </div>
      </div>

      {/* Cards Grid */}
      <div className={`grid gap-[16px] ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {filtered.map(job => (
          <MachineCard key={job.id} job={job} compact={compact} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex items-center justify-center py-[60px]">
            <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[14px] tracking-[0.28px]">
              No machines with status "{filter}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
