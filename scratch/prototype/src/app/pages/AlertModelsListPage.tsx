import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Trash2, Pencil, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ALERT_TYPE_LABELS: Record<string, string> = {
  anomaly: 'Anomaly',
  iot: 'IOT',
};

const ANOMALY_TYPE_LABELS: Record<string, string> = {
  warp: 'Warpage',
  recoater_lines: 'Recoater Lines',
  recoater_hopping: 'Recoater Hopping',
  short_feed: 'Short Feed',
};

const SEVERITY_LABELS: Record<string, string> = {
  critical: 'Critical',
  moderate: 'Moderate',
};

function TypeBadge({ type }: { type: string }) {
  const isIot = type === 'iot';
  return (
    <span className={`inline-flex items-center px-[8px] py-[2px] rounded-[3px] font-['Centra_No2:Medium',sans-serif] text-[11px] tracking-[0.44px] ${
      isIot ? 'bg-[rgba(109,116,243,0.12)] text-[#6d74f3]' : 'bg-[rgba(35,64,87,0.08)] text-[#234057]'
    }`} style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
      {ALERT_TYPE_LABELS[type] || type}
    </span>
  );
}

export function AlertModelsListPage() {
  const { alertModels, machines, deleteAlertModel } = useAppContext();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getAssignedCount = (alertModelId: string) =>
    machines.filter(m => m.alertModelAssignments.some(a => a.alertModelId === alertModelId)).length;

  const handleDelete = (id: string) => {
    const count = getAssignedCount(id);
    if (count > 0) {
      setDeletingId(id);
    } else {
      deleteAlertModel(id);
    }
  };

  const confirmDelete = (id: string) => {
    deleteAlertModel(id);
    setDeletingId(null);
  };

  return (
    <div className="px-8 py-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[12px] tracking-[0.24px] mb-1" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            Configure
          </p>
          <h1 className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[20px] tracking-[0.4px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            Alert Models
          </h1>
        </div>
        <button
          onClick={() => navigate('/alert-models/create')}
          className="relative rounded-[3px]"
        >
          <div className="flex items-center gap-[8px] px-[16px] py-[10px]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1V15M1 8H15" stroke="#234057" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
              Create Alert Model
            </p>
          </div>
          <div aria-hidden className="absolute border border-[rgba(35,64,87,0.2)] inset-0 rounded-[3px] pointer-events-none" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[3px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)]">
        {/* Table Header */}
        <div className="flex items-center border-b border-[#d3d9dd] px-0">
          <div className="w-[40px] h-[32px] flex items-center pl-[12px] shrink-0">
            <div className="w-[14px] h-[14px] border border-[rgba(35,64,87,0.2)] rounded-[2px]" />
          </div>
          <div className="flex flex-1 items-center">
            {[
              { label: 'Name', w: 'flex-1' },
              { label: 'Type', w: 'w-[110px]' },
              { label: 'Scope', w: 'w-[200px]' },
              { label: 'Triggers', w: 'w-[90px]' },
              { label: 'Assigned Machines', w: 'w-[160px]' },
              { label: 'Created', w: 'w-[140px]' },
              { label: '', w: 'w-[80px]' },
            ].map(col => (
              <div key={col.label} className={`${col.w} h-[32px] flex items-center pl-[12px]`}>
                <span className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                  {col.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {alertModels.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[14px] tracking-[0.28px]">
              No alert models yet. Create your first one.
            </p>
          </div>
        ) : (
          alertModels.map((am, idx) => {
            const assignedCount = getAssignedCount(am.id);
            const createdDate = new Date(am.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const scopeLabel = am.scopeMachineModel
              ? `Model: ${am.scopeMachineModel}`
              : am.scopeMachines.length > 0
              ? `${am.scopeMachines.length} machine(s)`
              : '—';

            return (
              <div
                key={am.id}
                className={`flex items-center border-b border-[#d3d9dd] last:border-b-0 hover:bg-[rgba(35,64,87,0.02)] transition-colors ${idx % 2 === 0 ? '' : 'bg-[rgba(35,64,87,0.01)]'}`}
              >
                <div className="w-[40px] h-[48px] flex items-center pl-[12px] shrink-0">
                  <div className="w-[14px] h-[14px] border border-[rgba(35,64,87,0.2)] rounded-[2px]" />
                </div>
                <div className="flex flex-1 items-center min-h-[48px]">
                  {/* Name */}
                  <div className="flex-1 pl-[12px] py-[10px]">
                    <button
                      onClick={() => navigate(`/alert-models/${am.id}/edit`)}
                      className="text-left"
                    >
                      <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px] hover:underline" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                        {am.name || <span className="text-[#a8b7bf]">Unnamed</span>}
                      </p>
                      {am.notes && (
                        <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px] mt-0.5 truncate max-w-[300px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                          {am.notes}
                        </p>
                      )}
                    </button>
                  </div>
                  {/* Type */}
                  <div className="w-[110px] pl-[12px] py-[10px]">
                    {am.alertType && <TypeBadge type={am.alertType} />}
                  </div>
                  {/* Scope */}
                  <div className="w-[200px] pl-[12px] py-[10px]">
                    <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                      {am.alertType === 'anomaly' && am.anomalyType
                        ? `${ANOMALY_TYPE_LABELS[am.anomalyType] || am.anomalyType}${am.severity ? ` / ${SEVERITY_LABELS[am.severity] || am.severity}` : ''}`
                        : '—'}
                    </p>
                  </div>
                  {/* Triggers */}
                  <div className="w-[90px] pl-[12px] py-[10px]">
                    <p className="font-['Centra_No2:Book',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                      {am.triggers.length}
                    </p>
                  </div>
                  {/* Assigned */}
                  <div className="w-[160px] pl-[12px] py-[10px]">
                    {assignedCount > 0 ? (
                      <span className="inline-flex items-center gap-[6px] px-[8px] py-[2px] bg-[rgba(109,116,243,0.1)] rounded-[3px]">
                        <span className="font-['Centra_No2:Medium',sans-serif] text-[#6d74f3] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                          {assignedCount} machine{assignedCount !== 1 ? 's' : ''}
                        </span>
                      </span>
                    ) : (
                      <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[12px] tracking-[0.24px]">—</p>
                    )}
                  </div>
                  {/* Created */}
                  <div className="w-[140px] pl-[12px] py-[10px]">
                    <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                      {createdDate}
                    </p>
                  </div>
                  {/* Actions */}
                  <div className="w-[80px] pl-[12px] py-[10px] flex items-center gap-[4px]">
                    <button
                      onClick={() => navigate(`/alert-models/${am.id}/edit`)}
                      className="w-[28px] h-[28px] flex items-center justify-center rounded-[3px] hover:bg-[rgba(35,64,87,0.08)] transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} className="text-[#59747a]" />
                    </button>
                    <button
                      onClick={() => handleDelete(am.id)}
                      className="w-[28px] h-[28px] flex items-center justify-center rounded-[3px] hover:bg-[rgba(35,64,87,0.08)] transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} className="text-[#59747a]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete confirmation dialog */}
      {deletingId && (() => {
        const am = alertModels.find(a => a.id === deletingId);
        const count = getAssignedCount(deletingId);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-[3px] shadow-xl w-[460px] p-8">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[17px] tracking-[0.34px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                    Delete Alert Model
                  </p>
                  <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[14px] tracking-[0.28px] leading-[22px] mt-2">
                    <strong className="font-['Centra_No2:Medium',sans-serif] text-[#234057]">{am?.name}</strong> is currently assigned to{' '}
                    <strong className="font-['Centra_No2:Medium',sans-serif] text-[#234057]">{count} machine{count !== 1 ? 's' : ''}</strong>.
                    Deleting it will remove all assignments. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="relative flex-1 rounded-[3px]"
                >
                  <div className="flex items-center justify-center px-[16px] py-[10px]">
                    <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]">Cancel</p>
                  </div>
                  <div aria-hidden className="absolute border border-[rgba(35,64,87,0.2)] inset-0 rounded-[3px] pointer-events-none" />
                </button>
                <button
                  onClick={() => confirmDelete(deletingId)}
                  className="flex-1 bg-red-500 hover:bg-red-600 transition-colors rounded-[3px] flex items-center justify-center px-[16px] py-[10px]"
                >
                  <p className="font-['Centra_No2:Medium',sans-serif] text-white text-[13.5px] tracking-[0.54px]">Delete & Remove Assignments</p>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
