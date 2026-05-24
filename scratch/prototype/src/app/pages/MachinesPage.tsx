import { ChevronDown, ChevronRight, Plus, X, AlertTriangle, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useAppContext, Machine, AlertModelAssignment, Trigger, TriggerItem, TriggerGroup } from '../context/AppContext';
import { useNavigate } from 'react-router';

// ─── Constants ─────────────────────────────────────────────────────────────────

const PROPERTIES_MAP: Record<string, { label: string; unit: string }> = {
  anomaly_height_absolute: { label: 'Anomaly Height (Absolute)', unit: 'mm' },
  anomaly_height_layers: { label: 'Anomaly Height (Layers)', unit: 'layers' },
  volume: { label: 'Volume', unit: 'mm³' },
  growth_rate: { label: 'Growth Rate', unit: '%' },
  '2d_area_current': { label: '2D Area (Current Layer)', unit: 'mm²' },
  surface_area: { label: 'Surface Area', unit: 'mm²' },
  volume_surface_ratio: { label: 'Volume/Surface Area Ratio', unit: 'mm' },
  volume_height_ratio: { label: 'Volume/Height Ratio', unit: 'mm²' },
  '2d_area_build_plate': { label: 'Current 2D Area / Build Plate', unit: '%' },
  distance_nearest_parallel: { label: 'Distance from Nearest Edge (Parallel)', unit: 'mm' },
  distance_nearest_orthogonal: { label: 'Distance from Nearest Edge (Orthogonal)', unit: 'mm' },
  intersect_with: { label: 'Intersects With', unit: '' },
  laser_temperature: { label: 'Laser Temperature', unit: '°C' },
  pneumatic_argon_pressure: { label: 'Pneumatic Argon Pressure', unit: 'PSI' },
  pneumatic_filter_pressure: { label: 'Pneumatic Filter Pressure', unit: 'PSI' },
  oxygen_concentration: { label: 'Oxygen Concentration', unit: 'ppm' },
  last_layer_dwell_time: { label: 'Last Layer Dwell Time', unit: 's' },
};

const OPERATORS_MAP: Record<string, string> = {
  gt: '>', lt: '<', eq: '=', gte: '≥', lte: '≤',
};

const INTERSECT_TARGETS_MAP: Record<string, string> = {
  part: 'Part (Generic)',
  warpage_critical: 'Warpage – Critical',
  warpage_moderate: 'Warpage – Moderate',
  recoater_lines_critical: 'Recoater Lines – Critical',
  recoater_lines_moderate: 'Recoater Lines – Moderate',
  recoater_hopping_critical: 'Recoater Hopping – Critical',
  recoater_hopping_moderate: 'Recoater Hopping – Moderate',
  short_feed_critical: 'Short Feed – Critical',
  short_feed_moderate: 'Short Feed – Moderate',
};

const ANOMALY_TYPES_MAP: Record<string, string> = {
  warp: 'Warpage',
  recoater_lines: 'Recoater Lines',
  recoater_hopping: 'Recoater Hopping',
  short_feed: 'Short Feed',
};

const MACHINE_MODELS_MAP: Record<string, string> = {
  mm1: 'EOS M 290',
  mm2: 'SLM 280',
  mm3: 'Velo3D Sapphire',
};

// ─── Sub-components ─────────────────────────────────────────────────────────────

function AlertTypeBadge({ type }: { type: string }) {
  const isIot = type === 'iot';
  return (
    <span className={`inline-flex items-center px-[6px] py-[1px] rounded-[3px] font-['Centra_No2:Medium',sans-serif] text-[10px] tracking-[0.3px] ${
      isIot ? 'bg-[rgba(109,116,243,0.12)] text-[#6d74f3]' : 'bg-[rgba(35,64,87,0.08)] text-[#234057]'
    }`} style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
      {isIot ? 'IOT' : 'Anomaly'}
    </span>
  );
}

// Plain-language provenance pill — replaces cryptic "Inherited" / "Direct" badge
function ProvenancePill({ source, machineModelName }: { source: 'inherited' | 'direct'; machineModelName?: string }) {
  if (source === 'inherited') {
    return (
      <span className="inline-flex items-center gap-[4px] px-[7px] py-[2px] rounded-[3px] bg-[rgba(168,183,191,0.15)] border border-[rgba(168,183,191,0.3)]">
        {/* Link icon */}
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 7.5L7.5 4.5M5.5 3H3a2 2 0 000 4h1M6.5 9H9a2 2 0 000-4H8" stroke="#59747a" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <span className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[11px] tracking-[0.22px]">
          Auto-applied via <strong className="font-['Centra_No2:Medium',sans-serif]">{machineModelName || 'Machine Model'}</strong> scope
        </span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-[4px] px-[7px] py-[2px] rounded-[3px] bg-[rgba(109,116,243,0.08)] border border-[rgba(109,116,243,0.2)]">
      {/* User icon */}
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="4" r="2" stroke="#6d74f3" strokeWidth="1.2" />
        <path d="M2 10c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="#6d74f3" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span className="font-['Centra_No2:Book',sans-serif] text-[#6d74f3] text-[11px] tracking-[0.22px]">
        Manually assigned to this machine
      </span>
    </span>
  );
}

// Single trigger row with editable value
function TriggerValueRow({
  trigger,
  overrides,
  onOverrideChange,
}: {
  trigger: Trigger;
  overrides: Record<string, string>;
  onOverrideChange: (triggerId: string, value: string) => void;
}) {
  const propInfo = PROPERTIES_MAP[trigger.property] || { label: trigger.property, unit: '' };
  const opSymbol = OPERATORS_MAP[trigger.operator] || trigger.operator;
  const isIntersect = trigger.property === 'intersect_with';
  const currentValue = overrides[trigger.id] !== undefined ? overrides[trigger.id] : trigger.value;
  const isOverridden = overrides[trigger.id] !== undefined;
  const targetLabel = INTERSECT_TARGETS_MAP[trigger.value] || trigger.value;

  return (
    <div className="flex items-center gap-[10px] py-[6px] px-[12px] bg-[rgba(35,64,87,0.02)] rounded-[3px] relative">
      {/* Property label */}
      <span className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px] min-w-[180px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
        {propInfo.label}
      </span>

      {isIntersect ? (
        <>
          <span className="text-[#a8b7bf] text-[12px] shrink-0">→</span>
          <span className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            {targetLabel}
          </span>
          <span className="ml-auto font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[11px] tracking-[0.22px] italic">Read-only</span>
        </>
      ) : (
        <>
          {/* Operator (read-only) */}
          <span className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13px] shrink-0 w-[20px] text-center">{opSymbol}</span>

          {/* Value input (editable) */}
          <div className="flex items-center gap-[4px]">
            <input
              type="text"
              value={currentValue}
              onChange={e => onOverrideChange(trigger.id, e.target.value)}
              className={`font-['Centra_No2:Medium',sans-serif] text-[13.5px] tracking-[0.54px] outline-none bg-transparent border-none w-[52px] pb-[1px] border-b ${
                isOverridden ? 'text-[#6d74f3] border-[#6d74f3]' : 'text-[#234057] border-[rgba(35,64,87,0.2)]'
              }`}
              style={{ fontFeatureSettings: "'lnum', 'tnum'" }}
            />
            {propInfo.unit && (
              <span className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                {propInfo.unit}
              </span>
            )}
          </div>

          {isOverridden && (
            <span className="ml-1 inline-flex items-center px-[5px] py-[1px] bg-[rgba(109,116,243,0.1)] rounded-[2px]">
              <span className="font-['Centra_No2:Book',sans-serif] text-[#6d74f3] text-[10px] tracking-[0.2px]">
                Override (template: {trigger.value} {propInfo.unit})
              </span>
            </span>
          )}
        </>
      )}
    </div>
  );
}

// Connector badge (And / Or)
function ConnectorBadge({ op }: { op: 'and' | 'or' }) {
  return (
    <div className="flex justify-start pl-[12px] py-[2px]">
      <span className="inline-flex items-center px-[8px] py-[2px] bg-[rgba(35,64,87,0.07)] rounded-[3px]">
        <span className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[11px] tracking-[0.44px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
          {op === 'and' ? 'AND' : 'OR'}
        </span>
      </span>
    </div>
  );
}

// Render trigger tree (flat triggers + groups) with AND/OR connectors
function TriggerTree({
  triggers,
  triggerOperators,
  valueOverrides,
  onOverrideChange,
}: {
  triggers: TriggerItem[];
  triggerOperators: Record<string, 'and' | 'or'>;
  valueOverrides: Record<string, string>;
  onOverrideChange: (triggerId: string, value: string) => void;
}) {
  const isGroup = (item: TriggerItem): item is TriggerGroup => 'triggers' in item;

  return (
    <div className="flex flex-col gap-[2px]">
      {triggers.map((item, idx) => (
        <div key={item.id}>
          {idx > 0 && <ConnectorBadge op={triggerOperators[triggers[idx - 1].id] || 'and'} />}
          {isGroup(item) ? (
            <div className="border border-[rgba(35,64,87,0.12)] rounded-[3px] p-[8px] bg-[rgba(35,64,87,0.01)]">
              <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[11px] tracking-[0.44px] mb-[6px] px-[2px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                {item.name}
              </p>
              <div className="flex flex-col gap-[2px]">
                {item.triggers.map((t, ti) => (
                  <div key={t.id}>
                    {ti > 0 && <ConnectorBadge op="and" />}
                    <TriggerValueRow trigger={t} overrides={valueOverrides} onOverrideChange={onOverrideChange} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <TriggerValueRow trigger={item as Trigger} overrides={valueOverrides} onOverrideChange={onOverrideChange} />
          )}
        </div>
      ))}
    </div>
  );
}

// Single assigned alert model card
function AlertModelAssignmentCard({
  assignment,
  machineId,
  machineModelName,
}: {
  assignment: AlertModelAssignment;
  machineId: string;
  machineModelName: string;
}) {
  const { alertModels, removeMachineAlertModelAssignment, updateAssignmentValueOverride } = useAppContext();
  const alertModel = alertModels.find(am => am.id === assignment.alertModelId);
  if (!alertModel) return null;

  const scopeLabel = alertModel.alertType === 'anomaly' && alertModel.anomalyType
    ? `${ANOMALY_TYPES_MAP[alertModel.anomalyType] || alertModel.anomalyType} / ${alertModel.severity}`
    : '';

  const hasEditableValues = alertModel.triggers.some(t => !('triggers' in t) && (t as any).property !== 'intersect_with');

  return (
    <div className="bg-white rounded-[4px] relative overflow-hidden">
      <div aria-hidden className="absolute border border-[rgba(35,64,87,0.12)] inset-0 rounded-[4px] pointer-events-none shadow-[0px_1px_4px_rgba(0,0,0,0.06)]" />
      <div className="p-[14px]">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-[10px]">
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center gap-[6px] flex-wrap">
              <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                {alertModel.name}
              </p>
              <AlertTypeBadge type={alertModel.alertType} />
            </div>
            {/* Provenance — plain language */}
            <ProvenancePill source={assignment.source} machineModelName={machineModelName} />
            {scopeLabel && (
              <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                Monitors: <strong className="font-['Centra_No2:Medium',sans-serif] text-[#234057]">{scopeLabel}</strong> anomalies
              </p>
            )}
            {alertModel.notes && (
              <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[11px] tracking-[0.22px] italic">
                {alertModel.notes}
              </p>
            )}
          </div>
          <button
            onClick={() => removeMachineAlertModelAssignment(machineId, assignment.alertModelId)}
            className="w-[28px] h-[28px] flex items-center justify-center rounded-[3px] hover:bg-[rgba(35,64,87,0.08)] transition-colors shrink-0 ml-2"
            title="Remove assignment"
          >
            <X size={13} className="text-[#59747a]" />
          </button>
        </div>

        {/* Divider */}
        <div className="bg-[rgba(35,64,87,0.08)] h-px w-full mb-[10px]" />

        {/* Triggers */}
        {alertModel.triggers.length > 0 ? (
          <>
            {/* Section header with legend */}
            <div className="flex items-start justify-between mb-[8px] gap-[12px]">
              <p className="font-['Centra_No2:Book',sans-serif] text-[#234057] text-[12px] tracking-[0.24px] leading-[18px]">
                This alert fires when the following conditions are met:
              </p>
              {hasEditableValues && (
                <div className="flex items-center gap-[8px] shrink-0">
                  <span className="flex items-center gap-[4px]">
                    <span className="inline-block w-[8px] h-[8px] rounded-full bg-[rgba(35,64,87,0.15)]" />
                    <span className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[11px] tracking-[0.22px]">Fixed by template</span>
                  </span>
                  <span className="flex items-center gap-[4px]">
                    <Pencil size={9} className="text-[#6d74f3]" />
                    <span className="font-['Centra_No2:Book',sans-serif] text-[#6d74f3] text-[11px] tracking-[0.22px]">Adjustable here</span>
                  </span>
                </div>
              )}
            </div>
            <TriggerTree
              triggers={alertModel.triggers}
              triggerOperators={alertModel.triggerOperators}
              valueOverrides={assignment.valueOverrides}
              onOverrideChange={(triggerId, value) =>
                updateAssignmentValueOverride(machineId, assignment.alertModelId, triggerId, value)
              }
            />
          </>
        ) : (
          <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[12px] tracking-[0.24px] italic">No trigger conditions defined on this alert model.</p>
        )}
      </div>
    </div>
  );
}

// Alert model picker modal
function AlertModelPickerModal({
  machineId,
  existingAlertModelIds,
  onClose,
}: {
  machineId: string;
  existingAlertModelIds: string[];
  onClose: () => void;
}) {
  const { alertModels, addMachineAlertModelAssignment } = useAppContext();
  const available = alertModels.filter(am => !existingAlertModelIds.includes(am.id));

  const handleAdd = (alertModelId: string) => {
    addMachineAlertModelAssignment(machineId, alertModelId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
      <div className="bg-white rounded-[3px] shadow-xl w-[480px] max-h-[60vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(35,64,87,0.1)]">
          <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[17px] tracking-[0.34px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            Add Alert Model
          </p>
          <button onClick={onClose} className="w-[28px] h-[28px] flex items-center justify-center rounded-[3px] hover:bg-[rgba(35,64,87,0.08)] transition-colors">
            <X size={16} className="text-[#59747a]" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4">
          {available.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertTriangle size={20} className="text-[#a8b7bf] mb-2" />
              <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[14px] tracking-[0.28px]">
                All alert models are already assigned.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-[6px]">
              {available.map(am => (
                <button
                  key={am.id}
                  onClick={() => handleAdd(am.id)}
                  className="text-left w-full px-[14px] py-[12px] rounded-[3px] hover:bg-[rgba(59,179,219,0.1)] transition-colors relative"
                >
                  <div aria-hidden className="absolute border border-[rgba(35,64,87,0.1)] inset-0 rounded-[3px] pointer-events-none" />
                  <div className="flex items-center gap-[8px] flex-wrap">
                    <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                      {am.name}
                    </p>
                    <AlertTypeBadge type={am.alertType} />
                    {am.alertType === 'anomaly' && am.anomalyType && (
                      <span className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px]">
                        {ANOMALY_TYPES_MAP[am.anomalyType]} / {am.severity}
                      </span>
                    )}
                  </div>
                  {am.triggers.length > 0 && (
                    <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[12px] tracking-[0.24px] mt-[2px]">
                      {am.triggers.length} trigger{am.triggers.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Expanded alert models panel for a single machine
function AlertModelPanel({ machine }: { machine: Machine }) {
  const { machineModels } = useAppContext();
  const [showPicker, setShowPicker] = useState(false);
  const existingIds = machine.alertModelAssignments.map(a => a.alertModelId);
  const machineModelName = machineModels.find(mm => mm.id === machine.machineModelId)?.name || machine.machineModelId;

  return (
    <div className="bg-[#f8f7f6] border-t border-[rgba(35,64,87,0.08)] px-[52px] py-[16px]">
      {/* Panel header */}
      <div className="flex items-center justify-between mb-[12px]">
        <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.48px] uppercase" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
          Alert Models — {machine.alertModelAssignments.length} assigned
        </p>
        <button
          onClick={() => setShowPicker(true)}
          className="relative rounded-[3px]"
        >
          <div className="flex items-center gap-[6px] px-[10px] py-[6px]">
            <Plus size={13} className="text-[#234057]" />
            <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[12px] tracking-[0.48px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Add Alert Model</p>
          </div>
          <div aria-hidden className="absolute border border-[rgba(35,64,87,0.2)] inset-0 rounded-[3px] pointer-events-none" />
        </button>
      </div>

      {/* Alert model cards */}
      {machine.alertModelAssignments.length === 0 ? (
        <div className="flex items-center gap-[8px] px-[14px] py-[12px] bg-white rounded-[3px] border border-dashed border-[rgba(35,64,87,0.15)]">
          <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[13.5px] tracking-[0.27px]">
            No alert models assigned. Click "Add Alert Model" to assign one.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-[8px]">
          {machine.alertModelAssignments.map(assignment => (
            <AlertModelAssignmentCard key={assignment.alertModelId} assignment={assignment} machineId={machine.id} machineModelName={machineModelName} />
          ))}
        </div>
      )}

      {showPicker && (
        <AlertModelPickerModal
          machineId={machine.id}
          existingAlertModelIds={existingIds}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export function MachinesPage() {
  const { machines, machineModels } = useAppContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const getMachineModelName = (machineModelId: string) =>
    machineModels.find(mm => mm.id === machineModelId)?.name || machineModelId;

  const toggleExpand = (machineId: string) => {
    setExpandedId(prev => prev === machineId ? null : machineId);
  };

  const COLS = [
    { label: '', w: 'w-[40px]' },
    { label: '', w: 'w-[48px]' },   // expand toggle
    { label: 'ID', w: 'w-[80px]' },
    { label: 'Name', w: 'flex-1' },
    { label: 'Machine Model', w: 'w-[160px]' },
    { label: 'Type', w: 'w-[90px]' },
    { label: 'Manufacturer', w: 'w-[130px]' },
    { label: 'Gateway', w: 'w-[100px]' },
    { label: 'Active', w: 'w-[70px]' },
    { label: 'Alert Models', w: 'w-[120px]' },
    { label: 'Last Modified', w: 'w-[130px]' },
  ];

  return (
    <div className="px-8 py-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[12px] tracking-[0.24px] mb-1">Configure</p>
          <h1 className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[20px] tracking-[0.4px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Machines</h1>
        </div>
        <button className="relative rounded-[3px]" onClick={() => navigate('/machines/create')}>
          <div className="flex items-center gap-[8px] px-[16px] py-[10px]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1V15M1 8H15" stroke="#234057" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Create Machine</p>
          </div>
          <div aria-hidden className="absolute border border-[rgba(35,64,87,0.2)] inset-0 rounded-[3px] pointer-events-none" />
        </button>
      </div>

      {/* Info callout about alert model assignment */}
      <div className="bg-[rgba(109,116,243,0.06)] rounded-[4px] border border-[rgba(109,116,243,0.15)] px-[16px] py-[10px] mb-6 flex items-start gap-[8px]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[1px]">
          <circle cx="8" cy="8" r="6.5" stroke="#6d74f3" strokeWidth="1.2" />
          <path d="M8 7V11M8 5.5V5" stroke="#6d74f3" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p className="font-['Centra_No2:Book',sans-serif] text-[#234057] text-[13.5px] tracking-[0.27px] leading-[20px]">
          Expand a machine row to view and manage its <strong className="font-['Centra_No2:Medium',sans-serif]">Alert Model assignments</strong>. You can add or remove alert models, and override trigger threshold values per machine.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[3px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)]">
        {/* Header Row */}
        <div className="flex items-center border-b border-[#d3d9dd]">
          {COLS.map(col => (
            <div key={col.label} className={`${col.w} h-[32px] flex items-center pl-[12px] shrink-0`}>
              <span className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                {col.label}
              </span>
            </div>
          ))}
        </div>

        {/* Machine Rows */}
        {machines.map(machine => {
          const isExpanded = expandedId === machine.id;
          const alertModelCount = machine.alertModelAssignments.length;

          return (
            <div key={machine.id} className="border-b border-[#d3d9dd] last:border-b-0">
              {/* Main Row */}
              <div
                className={`flex items-center min-h-[48px] transition-colors cursor-pointer ${isExpanded ? 'bg-[rgba(109,116,243,0.04)]' : 'hover:bg-[rgba(35,64,87,0.02)]'}`}
                onClick={() => toggleExpand(machine.id)}
              >
                {/* Checkbox */}
                <div className="w-[40px] h-full flex items-center pl-[12px] shrink-0" onClick={e => e.stopPropagation()}>
                  <div className="w-[14px] h-[14px] border border-[rgba(35,64,87,0.2)] rounded-[2px]" />
                </div>

                {/* Expand icon */}
                <div className="w-[48px] h-full flex items-center justify-center shrink-0">
                  {isExpanded
                    ? <ChevronDown size={14} className="text-[#6d74f3]" />
                    : <ChevronRight size={14} className="text-[#a8b7bf]" />
                  }
                </div>

                {/* ID */}
                <div className="w-[80px] pl-[12px] py-[12px] shrink-0">
                  <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                    {machine.id}
                  </p>
                </div>

                {/* Name */}
                <div className="flex-1 pl-[12px] py-[12px]">
                  <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                    {machine.name}
                  </p>
                </div>

                {/* Machine Model */}
                <div className="w-[160px] pl-[12px] py-[12px] shrink-0">
                  <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                    {getMachineModelName(machine.machineModelId)}
                  </p>
                </div>

                {/* Type */}
                <div className="w-[90px] pl-[12px] py-[12px] shrink-0">
                  <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                    {machine.type}
                  </p>
                </div>

                {/* Manufacturer */}
                <div className="w-[130px] pl-[12px] py-[12px] shrink-0">
                  <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                    {machine.manufacturer}
                  </p>
                </div>

                {/* Gateway */}
                <div className="w-[100px] pl-[12px] py-[12px] shrink-0">
                  <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                    {machine.gateway}
                  </p>
                </div>

                {/* Active */}
                <div className="w-[70px] pl-[12px] py-[12px] shrink-0">
                  <span className={`inline-block w-[8px] h-[8px] rounded-full ${machine.active ? 'bg-emerald-500' : 'bg-[#d3d9dd]'}`} />
                </div>

                {/* Alert Models */}
                <div className="w-[120px] pl-[12px] py-[12px] shrink-0" onClick={e => { e.stopPropagation(); toggleExpand(machine.id); }}>
                  {alertModelCount > 0 ? (
                    <span className={`inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-[3px] transition-colors ${
                      isExpanded
                        ? 'bg-[#6d74f3] text-white'
                        : 'bg-[rgba(109,116,243,0.1)] text-[#6d74f3] hover:bg-[rgba(109,116,243,0.2)]'
                    }`}>
                      <span className="font-['Centra_No2:Medium',sans-serif] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                        {alertModelCount} model{alertModelCount !== 1 ? 's' : ''}
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-[3px] bg-[rgba(35,64,87,0.06)] hover:bg-[rgba(35,64,87,0.1)] transition-colors">
                      <span className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[12px] tracking-[0.24px]">None</span>
                    </span>
                  )}
                </div>

                {/* Last Modified */}
                <div className="w-[130px] pl-[12px] py-[12px] shrink-0">
                  <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                    {machine.lastModified}
                  </p>
                </div>
              </div>

              {/* Expanded Panel */}
              {isExpanded && <AlertModelPanel machine={machine} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}