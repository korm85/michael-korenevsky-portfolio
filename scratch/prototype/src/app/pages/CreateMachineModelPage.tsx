import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { X, ChevronDown, Trash2, Plus, ChevronRight } from 'lucide-react';
import { useAppContext, AlertModel } from '../context/AppContext';
import svgPaths from '../../imports/CreateMachineModel/svg-gg49dg9mdd';

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_OPTIONS = ['Generic', 'Powder Bed Fusion', 'Directed Energy Deposition', 'Binder Jetting', 'Material Extrusion', 'Stereolithography'];
const VENDOR_OPTIONS = ['EOS', 'SLM Solutions', 'Velo3D', '3D Systems', 'Stratasys', 'Formlabs', 'Markforged', 'Desktop Metal'];

const PROPERTIES_DISPLAY: Record<string, { label: string; unit: string }> = {
  anomaly_height_absolute: { label: 'Anomaly Height (Absolute)', unit: 'mm' },
  anomaly_height_layers: { label: 'Anomaly Height (Layers)', unit: 'layers' },
  volume: { label: 'Volume', unit: 'mm³' },
  growth_rate: { label: 'Growth Rate', unit: '%' },
  '2d_area_current': { label: '2D Area (Current Layer)', unit: 'mm²' },
  surface_area: { label: 'Surface Area', unit: 'mm²' },
  intersect_with: { label: 'Intersects With', unit: '' },
  laser_temperature: { label: 'Laser Temperature', unit: '°C' },
  pneumatic_argon_pressure: { label: 'Pneumatic Argon Pressure', unit: 'PSI' },
  pneumatic_filter_pressure: { label: 'Pneumatic Filter Pressure', unit: 'PSI' },
};

const OPERATORS_DISPLAY: Record<string, string> = {
  gt: 'Greater Than', lt: 'Less Than', eq: 'Equal To', gte: 'Greater or Equal', lte: 'Less or Equal',
};

const INTERSECT_TARGETS: Record<string, string> = {
  part: 'Part (Generic)',
  recoater_lines_critical: 'Recoater Lines – Critical',
  recoater_lines_moderate: 'Recoater Lines – Moderate',
  warpage_critical: 'Warpage – Critical',
  warpage_moderate: 'Warpage – Moderate',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAlertModelSummary(am: AlertModel) {
  const flatTriggers = am.triggers.flatMap(t => 'triggers' in t ? t.triggers : [t]);
  return flatTriggers.slice(0, 3).map(t => {
    const prop = PROPERTIES_DISPLAY[t.property];
    if (!prop) return null;
    if (t.property === 'intersect_with') {
      return { label: prop.label, op: '→', value: INTERSECT_TARGETS[t.value] || t.value, unit: '' };
    }
    return { label: prop.label, op: OPERATORS_DISPLAY[t.operator] || t.operator, value: t.value, unit: prop.unit };
  }).filter(Boolean);
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────

function SelectField({ label, value, onChange, options, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col w-full relative">
      <p className="font-['Centra_No2:Book',sans-serif] leading-[12px] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{label}</p>
      <div className="h-[4px]" />
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="flex items-center justify-between w-full pb-[3px] text-left"
      >
        <span className={`font-['Centra_No2:Medium',sans-serif] leading-[16px] text-[13.5px] tracking-[0.54px] ${value ? 'text-[#234057]' : 'text-[#a8b7bf]'}`} style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
          {value || placeholder || 'Select...'}
        </span>
        <ChevronDown size={12} className="text-[#234057] shrink-0" />
      </button>
      <div className="h-[7px]" />
      <div className="bg-[rgba(35,64,87,0.2)] h-px w-full" />
      {open && (
        <div className="absolute top-full left-0 right-0 z-20 mt-[4px] bg-white rounded-[3px] shadow-lg border border-[rgba(35,64,87,0.15)] max-h-[200px] overflow-y-auto">
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-[12px] py-[8px] hover:bg-[rgba(35,64,87,0.05)] font-['Centra_No2:Book',sans-serif] text-[13px] tracking-[0.26px] text-[#234057] ${opt === value ? 'bg-[rgba(109,116,243,0.08)]' : ''}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Text Field ───────────────────────────────────────────────────────────────

function TextField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex flex-col w-full">
      <p className="font-['Centra_No2:Book',sans-serif] leading-[12px] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{label}</p>
      <div className="h-[4px]" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="font-['Centra_No2:Medium',sans-serif] leading-[16px] text-[#234057] text-[13.5px] tracking-[0.54px] outline-none bg-transparent border-none w-full placeholder:text-[#a8b7bf]"
        style={{ fontFeatureSettings: "'lnum', 'tnum'" }}
      />
      <div className="h-[7px]" />
      <div className="bg-[rgba(35,64,87,0.2)] h-px w-full" />
    </div>
  );
}

// ─── Number Field ─────────────────────────────────────────────────────────────

function NumberField({ label, value, onChange, unit }: {
  label: string; value: string; onChange: (v: string) => void; unit?: string;
}) {
  return (
    <div className="flex flex-col w-full">
      <p className="font-['Centra_No2:Book',sans-serif] leading-[12px] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{label}</p>
      <div className="h-[4px]" />
      <div className="flex items-baseline gap-[6px]">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="font-['Centra_No2:Medium',sans-serif] leading-[16px] text-[#234057] text-[13.5px] tracking-[0.54px] outline-none bg-transparent border-none flex-1 min-w-0"
          style={{ fontFeatureSettings: "'lnum', 'tnum'" }}
        />
        {unit && <span className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px] shrink-0">{unit}</span>}
      </div>
      <div className="h-[7px]" />
      <div className="bg-[rgba(35,64,87,0.2)] h-px w-full" />
    </div>
  );
}

// ─── Alert Model Card ─────────────────────────────────────────────────────────

function AssignedAlertModelCard({ am, onRemove }: { am: AlertModel; onRemove: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const summary = getAlertModelSummary(am);

  return (
    <div className="bg-white rounded-[3px] relative overflow-hidden">
      <div aria-hidden className="absolute border border-[rgba(35,64,87,0.15)] inset-0 rounded-[3px] pointer-events-none" />
      <div className="px-[12px] py-[10px]">
        <div className="flex items-center justify-between gap-[8px]">
          <button
            onClick={() => setExpanded(p => !p)}
            className="flex items-center gap-[6px] flex-1 min-w-0 text-left"
          >
            <span className="text-[#a8b7bf] shrink-0">
              {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </span>
            <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13px] tracking-[0.52px] truncate" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
              {am.name}
            </p>
          </button>
          <button
            onClick={onRemove}
            className="size-[24px] flex items-center justify-center rounded-[2px] hover:bg-[rgba(35,64,87,0.08)] transition-colors shrink-0"
          >
            <Trash2 size={12} className="text-[#a8b7bf]" />
          </button>
        </div>

        {expanded && summary.length > 0 && (
          <div className="mt-[8px] flex flex-col gap-[3px] pl-[18px]">
            {summary.map((s, i) => s && (
              <div key={i} className="flex items-baseline gap-[8px]">
                <span className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[11px] tracking-[0.22px] min-w-[140px]">{s.label}</span>
                <span className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[11px] tracking-[0.22px]">{s.op}</span>
                <span className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[11px] tracking-[0.22px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                  {s.value}{s.unit ? ` ${s.unit}` : ''}
                </span>
              </div>
            ))}
            {am.triggers.length > 3 && (
              <span className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[10px] tracking-[0.2px] pl-[0px] mt-[2px]">
                +{am.triggers.length - 3} more conditions
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Alert Model Picker ───────────────────────────────────────────────────────

function AlertModelPickerModal({ assigned, onAdd, onClose }: {
  assigned: string[];
  onAdd: (id: string) => void;
  onClose: () => void;
}) {
  const { alertModels } = useAppContext();
  const available = alertModels.filter(am => !assigned.includes(am.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
      <div className="bg-white rounded-[3px] shadow-xl w-[440px] max-h-[60vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(35,64,87,0.1)]">
          <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[16px] tracking-[0.32px]">Add Alert Model</p>
          <button onClick={onClose} className="size-[28px] flex items-center justify-center rounded-[3px] hover:bg-[rgba(35,64,87,0.08)]">
            <X size={16} className="text-[#59747a]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {available.length === 0 ? (
            <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[13.5px] text-center py-8">All alert models are already assigned.</p>
          ) : (
            <div className="flex flex-col gap-[6px]">
              {available.map(am => (
                <button
                  key={am.id}
                  onClick={() => { onAdd(am.id); onClose(); }}
                  className="text-left w-full px-[12px] py-[10px] rounded-[3px] hover:bg-[rgba(109,116,243,0.08)] transition-colors relative"
                >
                  <div aria-hidden className="absolute border border-[rgba(35,64,87,0.1)] inset-0 rounded-[3px] pointer-events-none" />
                  <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13px] tracking-[0.52px]">{am.name}</p>
                  <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[11px] tracking-[0.22px] mt-[2px]">
                    {am.alertType.toUpperCase()} · {am.triggers.length} trigger{am.triggers.length !== 1 ? 's' : ''}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── File Upload Field ────────────────────────────────────────────────────────

function FileField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col w-full">
      <p className="font-['Centra_No2:Book',sans-serif] leading-[12px] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{label}</p>
      <div className="h-[4px]" />
      <div className="flex items-center justify-between">
        <span className={`font-['Centra_No2:Medium',sans-serif] leading-[16px] text-[13.5px] tracking-[0.54px] flex-1 truncate ${value ? 'text-[#234057]' : 'text-[#a8b7bf]'}`} style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
          {value || 'No file selected'}
        </span>
        <button type="button" onClick={() => inputRef.current?.click()} className="shrink-0 ml-[8px]">
          <svg className="w-[16px] h-[16px]" fill="none" preserveAspectRatio="none" viewBox="0 0 14 10">
            <path d={svgPaths.pd808700} fill="#234057" />
          </svg>
        </button>
        <input ref={inputRef} type="file" className="hidden" onChange={e => onChange(e.target.files?.[0]?.name || '')} />
      </div>
      <div className="h-[7px]" />
      <div className="bg-[rgba(35,64,87,0.2)] h-px w-full" />
    </div>
  );
}

// ─── Recoater Direction Toggle ────────────────────────────────────────────────

function RecoaterDirectionToggle({ value, onChange }: { value: 'horizontal' | 'vertical'; onChange: (v: 'horizontal' | 'vertical') => void }) {
  return (
    <div className="flex flex-col w-full">
      <p className="font-['Centra_No2:Book',sans-serif] leading-[12px] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Recoater Direction</p>
      <div className="h-[8px]" />
      <div className="flex gap-[8px]">
        {/* Horizontal */}
        <button
          type="button"
          onClick={() => onChange('horizontal')}
          className={`relative flex items-center justify-center w-[44px] h-[36px] rounded-[3px] transition-all ${value === 'horizontal' ? 'bg-[rgba(109,116,243,0.1)]' : 'hover:bg-[rgba(35,64,87,0.04)]'}`}
        >
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
            <rect x="0.5" y="0.5" width="23" height="19" rx="1.5" stroke={value === 'horizontal' ? '#6d74f3' : '#a8b7bf'} strokeWidth="1.2" />
            <rect x="3" y="5" width="18" height="2" rx="0.5" fill={value === 'horizontal' ? '#6d74f3' : '#c8d0d4'} />
            <rect x="3" y="9" width="18" height="2" rx="0.5" fill={value === 'horizontal' ? '#6d74f3' : '#c8d0d4'} />
            <rect x="3" y="13" width="18" height="2" rx="0.5" fill={value === 'horizontal' ? '#6d74f3' : '#c8d0d4'} />
          </svg>
          <div aria-hidden className={`absolute border inset-0 rounded-[3px] pointer-events-none ${value === 'horizontal' ? 'border-[#6d74f3]' : 'border-[rgba(35,64,87,0.2)]'}`} />
        </button>
        {/* Vertical */}
        <button
          type="button"
          onClick={() => onChange('vertical')}
          className={`relative flex items-center justify-center w-[44px] h-[36px] rounded-[3px] transition-all ${value === 'vertical' ? 'bg-[rgba(109,116,243,0.1)]' : 'hover:bg-[rgba(35,64,87,0.04)]'}`}
        >
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
            <rect x="0.5" y="0.5" width="23" height="19" rx="1.5" stroke={value === 'vertical' ? '#6d74f3' : '#a8b7bf'} strokeWidth="1.2" />
            <rect x="5" y="3" width="2" height="14" rx="0.5" fill={value === 'vertical' ? '#6d74f3' : '#c8d0d4'} />
            <rect x="9" y="3" width="2" height="14" rx="0.5" fill={value === 'vertical' ? '#6d74f3' : '#c8d0d4'} />
            <rect x="13" y="3" width="2" height="14" rx="0.5" fill={value === 'vertical' ? '#6d74f3' : '#c8d0d4'} />
            <rect x="17" y="3" width="2" height="14" rx="0.5" fill={value === 'vertical' ? '#6d74f3' : '#c8d0d4'} />
          </svg>
          <div aria-hidden className={`absolute border inset-0 rounded-[3px] pointer-events-none ${value === 'vertical' ? 'border-[#6d74f3]' : 'border-[rgba(35,64,87,0.2)]'}`} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function CreateMachineModelPage() {
  const navigate = useNavigate();
  const { addMachineModel, alertModels } = useAppContext();

  // General
  const [name, setName] = useState('Unnamed Model');
  const [type, setType] = useState('Generic');
  const [vendor, setVendor] = useState('');
  const [previewPicture, setPreviewPicture] = useState('');
  const [notes, setNotes] = useState('');

  // Specifications
  const [lengthX, setLengthX] = useState('250');
  const [widthY, setWidthY] = useState('100');
  const [heightZ, setHeightZ] = useState('100');
  const [recoaterDirection, setRecoaterDirection] = useState<'horizontal' | 'vertical'>('horizontal');

  // Alert Models
  const [assignedAlertModelIds, setAssignedAlertModelIds] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const handleCreate = () => {
    addMachineModel({
      name: name.trim() || 'Unnamed Model',
      type,
      manufacturer: vendor,
      notes,
      lengthX: parseFloat(lengthX) || 0,
      widthY: parseFloat(widthY) || 0,
      heightZ: parseFloat(heightZ) || 0,
      recoaterDirection,
      assignedAlertModelIds,
    });
    navigate('/machine-models');
  };

  const assignedModels = assignedAlertModelIds
    .map(id => alertModels.find(am => am.id === id))
    .filter(Boolean) as AlertModel[];

  return (
    <div className="min-h-screen bg-[#f8f7f6] flex flex-col">
      {/* Header */}
      <div className="relative flex items-center justify-center px-[32px] py-[24px] shrink-0">
        <h1 className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[20px] tracking-[0.4px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
          Create Machine Model
        </h1>
        <button
          onClick={() => navigate('/machine-models')}
          className="absolute right-[32px] top-1/2 -translate-y-1/2 relative rounded-[3px]"
        >
          <div className="flex items-center justify-center px-[16px] py-[10px]">
            <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]">Cancel</p>
          </div>
          <div aria-hidden className="absolute border border-[rgba(35,64,87,0.2)] inset-0 rounded-[3px] pointer-events-none" />
        </button>
      </div>

      {/* Content Card */}
      <div className="flex-1 px-[32px] pb-[32px]">
        <div className="bg-white rounded-[3px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] overflow-hidden relative flex flex-col min-h-[600px]">
          <div aria-hidden className="absolute border border-[rgba(35,64,87,0.08)] inset-0 rounded-[3px] pointer-events-none" />

          {/* Three-column layout */}
          <div className="flex flex-1">
            {/* ── General ── */}
            <div className="w-[360px] shrink-0 border-r border-[rgba(35,64,87,0.1)] px-[32px] pt-[24px] pb-[80px] flex flex-col gap-[16px]">
              <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[17px] tracking-[0.34px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>General</p>
              <TextField label="Name" value={name} onChange={setName} />
              <SelectField label="Type" value={type} onChange={setType} options={TYPE_OPTIONS} />
              <SelectField label="Vendor" value={vendor} onChange={setVendor} options={VENDOR_OPTIONS} placeholder="Select vendor..." />
              <FileField label="Preview Picture" value={previewPicture} onChange={setPreviewPicture} />
              <TextField label="Notes" value={notes} onChange={setNotes} placeholder="Optional notes..." />
            </div>

            {/* ── Specifications ── */}
            <div className="w-[360px] shrink-0 border-r border-[rgba(35,64,87,0.1)] px-[32px] pt-[24px] pb-[80px] flex flex-col gap-[16px]">
              <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[17px] tracking-[0.34px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Specifications</p>
              <NumberField label="Length (X)" value={lengthX} onChange={setLengthX} unit="mm" />
              <NumberField label="Width (Y)" value={widthY} onChange={setWidthY} unit="mm" />
              <NumberField label="Height (Z)" value={heightZ} onChange={setHeightZ} unit="mm" />
              <RecoaterDirectionToggle value={recoaterDirection} onChange={setRecoaterDirection} />
            </div>

            {/* ── Alert Models ── */}
            <div className="flex-1 px-[32px] pt-[24px] pb-[80px] flex flex-col gap-[12px]">
              <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[17px] tracking-[0.34px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Alert Models</p>

              {assignedModels.length === 0 ? (
                <div className="bg-[rgba(35,64,87,0.03)] rounded-[3px] px-[14px] py-[12px]">
                  <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[13.5px] tracking-[0.27px]">
                    No alert models assigned yet.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-[6px]">
                  {assignedModels.map(am => (
                    <AssignedAlertModelCard
                      key={am.id}
                      am={am}
                      onRemove={() => setAssignedAlertModelIds(prev => prev.filter(id => id !== am.id))}
                    />
                  ))}
                </div>
              )}

              {/* Add Alert Model */}
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="flex items-center gap-[6px] px-[10px] py-[7px] rounded-[3px] hover:bg-[rgba(35,64,87,0.04)] transition-colors self-start relative"
              >
                <Plus size={13} className="text-[#6d74f3]" />
                <span className="font-['Centra_No2:Medium',sans-serif] text-[#6d74f3] text-[13px] tracking-[0.52px]">Add Alert Model</span>
                <div aria-hidden className="absolute border border-[rgba(109,116,243,0.25)] inset-0 rounded-[3px] pointer-events-none" />
              </button>
            </div>
          </div>

          {/* Footer / Create button */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-[20px] pb-[20px] px-[20px]">
            <button
              onClick={handleCreate}
              className="w-full bg-[#6d74f3] hover:bg-[#5a61e0] transition-colors rounded-[3px] flex items-center justify-center py-[10px]"
            >
              <p className="font-['Centra_No2:Medium',sans-serif] text-white text-[13.5px] tracking-[0.54px]">Create</p>
            </button>
          </div>
        </div>
      </div>

      {showPicker && (
        <AlertModelPickerModal
          assigned={assignedAlertModelIds}
          onAdd={id => setAssignedAlertModelIds(prev => [...prev, id])}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
