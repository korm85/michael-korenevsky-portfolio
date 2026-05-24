import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import svgPaths from '../../imports/CreateMachineEos/svg-goc8x6q5if';

// ─── Constants ────────────────────────────────────────────────────────────────

const GATEWAY_OPTIONS = ['GW-01 (EOS Bay 1)', 'GW-02 (SLM Bay)', 'GW-03 (Velo3D Bay)', 'GW-04 (General)', 'GW-05 (R&D)'];
const RECTIFICATION_FILES = ['rect_eos_m290_v1.dat', 'rect_slm280_v2.dat', 'rect_sapphire_v1.dat', 'Default_Rectification.dat'];

// ─── Field Components ─────────────────────────────────────────────────────────

function TextField({ label, value, onChange, placeholder, type: inputType = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col w-full">
      <p className="font-['Centra_No2:Book',sans-serif] leading-[12px] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{label}</p>
      <div className="h-[4px]" />
      <input
        type={inputType}
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

function SelectField({ label, value, onChange, options, placeholder, clearable }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string; clearable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div className="flex flex-col w-full relative">
      <p className="font-['Centra_No2:Book',sans-serif] leading-[12px] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{label}</p>
      <div className="h-[4px]" />
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setOpen(p => !p)}
          className="flex items-center flex-1 min-w-0 text-left"
        >
          <span className={`font-['Centra_No2:Medium',sans-serif] leading-[16px] text-[13.5px] tracking-[0.54px] flex-1 truncate ${value ? 'text-[#234057]' : 'text-[#a8b7bf]'}`} style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            {value ? selectedLabel : (placeholder || 'Select...')}
          </span>
        </button>
        <div className="flex items-center gap-[4px] shrink-0">
          {clearable && value && (
            <button type="button" onClick={() => onChange('')} className="p-[2px]">
              <svg width="10" height="10" viewBox="0 0 7.23 7.23" fill="none">
                <path d={svgPaths.p3aa55500} fill="#234057" />
              </svg>
            </button>
          )}
          <button type="button" onClick={() => setOpen(p => !p)} className="p-[1px]">
            <svg width="10" height="6" viewBox="0 0 9.98 6.07" fill="none">
              <path d={svgPaths.p38de7200} fill="#234057" />
            </svg>
          </button>
        </div>
      </div>
      <div className="h-[7px]" />
      <div className="bg-[rgba(35,64,87,0.2)] h-px w-full" />
      {open && (
        <div className="absolute top-full left-0 right-0 z-20 mt-[4px] bg-white rounded-[3px] shadow-lg border border-[rgba(35,64,87,0.15)] max-h-[200px] overflow-y-auto">
          {placeholder && (
            <button type="button" onClick={() => { onChange(''); setOpen(false); }}
              className="w-full text-left px-[12px] py-[8px] hover:bg-[rgba(35,64,87,0.05)] font-['Centra_No2:Book',sans-serif] text-[12px] text-[#a8b7bf]">
              {placeholder}
            </button>
          )}
          {options.map(opt => (
            <button key={opt.value} type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-[12px] py-[8px] hover:bg-[rgba(35,64,87,0.05)] font-['Centra_No2:Book',sans-serif] text-[13px] tracking-[0.26px] text-[#234057] ${opt.value === value ? 'bg-[rgba(109,116,243,0.08)]' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
          <svg className="w-[16px] h-[10px]" fill="none" viewBox="0 0 14 10">
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

// ─── Toggle ───────────────────────────────────────────────────────────────────

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-[10px]">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="relative shrink-0"
      >
        <div className={`w-[28px] h-[16px] rounded-full transition-colors ${value ? 'bg-[#6d74f3]' : 'bg-[rgba(35,64,87,0.15)]'}`}>
          <div className={`absolute top-[2px] w-[12px] h-[12px] bg-white rounded-full shadow-sm transition-transform ${value ? 'translate-x-[14px]' : 'translate-x-[2px]'}`} />
        </div>
      </button>
      <span className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]">{label}</span>
    </div>
  );
}

// ─── Checkbox Row ──────────────────────────────────────────────────────────────

function CheckboxRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-[10px]">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative shrink-0 w-[16px] h-[16px] rounded-[2px] border transition-colors ${value ? 'bg-[#6d74f3] border-[#6d74f3]' : 'border-[rgba(35,64,87,0.25)] bg-white'}`}
      >
        {value && (
          <svg className="absolute inset-[2px]" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]">{label}</span>
    </div>
  );
}

// ─── Number Field (dashed border variant) ────────────────────────────────────

function NumberFieldDashed({ label, value, onChange, disabled }: {
  label: string; value: string; onChange: (v: string) => void; disabled?: boolean;
}) {
  return (
    <div className={`flex flex-col w-full ${disabled ? 'opacity-40' : ''}`}>
      <p className={`font-['Centra_No2:Book',sans-serif] leading-[12px] text-[12px] tracking-[0.24px] ${disabled ? 'text-[#a8b7bf]' : 'text-[#59747a]'}`} style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{label}</p>
      <div className="h-[4px]" />
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="font-['Centra_No2:Medium',sans-serif] leading-[16px] text-[#234057] text-[13.5px] tracking-[0.54px] outline-none bg-transparent border-none w-full"
        style={{ fontFeatureSettings: "'lnum', 'tnum'" }}
      />
      <div className="h-[7px]" />
      {/* Dashed border */}
      <svg width="100%" height="1" preserveAspectRatio="none">
        <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="rgba(35,64,87,0.2)" strokeDasharray="3 3" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function CreateMachinePage() {
  const navigate = useNavigate();
  const { addMachine, machineModels } = useAppContext();

  // General
  const [machineName, setMachineName] = useState('');
  const [machineModelId, setMachineModelId] = useState('');
  const [notes, setNotes] = useState('');

  // IOT
  const [ipAddress, setIpAddress] = useState('');
  const [virtualGatewayServer, setVirtualGatewayServer] = useState('');

  // OPCUA Credentials
  const [opcuaUsername, setOpcuaUsername] = useState('');
  const [opcuaPassword, setOpcuaPassword] = useState('');
  const [opcuaNamespace, setOpcuaNamespace] = useState('');

  // Build Monitoring
  const [enableRecoaterHopping, setEnableRecoaterHopping] = useState(false);
  const [ignoreBottomLayers, setIgnoreBottomLayers] = useState(false);
  const [ignoredLayers, setIgnoredLayers] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [rectificationFile, setRectificationFile] = useState('');

  const machineModelOptions = machineModels.map(mm => ({ value: mm.id, label: mm.name }));
  const selectedModel = machineModels.find(mm => mm.id === machineModelId);

  const handleCreate = () => {
    addMachine({
      name: machineName.trim() || 'New Machine',
      machineModelId,
      type: selectedModel?.type || 'Generic',
      manufacturer: selectedModel?.manufacturer || '',
      gateway: virtualGatewayServer,
      active: true,
      ipAddress,
      notes,
      virtualGatewayServer,
      opcuaUsername,
      opcuaPassword,
      opcuaNamespace,
      enableRecoaterHopping,
      ignoreBottomLayers,
      ignoredLayers: parseInt(ignoredLayers) || 0,
      secretKey,
      rectificationFile,
    });
    navigate('/machines');
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] flex flex-col">
      {/* Header */}
      <div className="relative flex items-center justify-center px-[32px] py-[24px] shrink-0">
        <h1 className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[20px] tracking-[0.4px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
          Create Machine
        </h1>
        <button
          onClick={() => navigate('/machines')}
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
              <TextField label="Name" value={machineName} onChange={setMachineName} placeholder="e.g. EOS 1" />
              <SelectField
                label="Machine Model"
                value={machineModelId}
                onChange={setMachineModelId}
                options={machineModelOptions}
                placeholder="Select model..."
                clearable
              />
              <TextField label="Notes" value={notes} onChange={setNotes} placeholder="Optional notes..." />
            </div>

            {/* ── IOT ── */}
            <div className="w-[360px] shrink-0 border-r border-[rgba(35,64,87,0.1)] px-[32px] pt-[24px] pb-[80px] flex flex-col gap-[16px]">
              <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[17px] tracking-[0.34px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>IOT</p>
              <TextField label="IP Address" value={ipAddress} onChange={setIpAddress} placeholder="e.g. 192.168.1.10" />
              <SelectField
                label="Virtual Gateway Server"
                value={virtualGatewayServer}
                onChange={setVirtualGatewayServer}
                options={GATEWAY_OPTIONS.map(g => ({ value: g, label: g }))}
                placeholder="Select gateway..."
              />

              <div className="pt-[8px] flex flex-col gap-[16px]">
                <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[17px] tracking-[0.34px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>OPCUA Credentials</p>
                <TextField label="Username" value={opcuaUsername} onChange={setOpcuaUsername} />
                <TextField label="Password" value={opcuaPassword} onChange={setOpcuaPassword} type="password" />
                <FileField label="Namespace" value={opcuaNamespace} onChange={setOpcuaNamespace} />
              </div>
            </div>

            {/* ── Build Monitoring ── */}
            <div className="flex-1 px-[32px] pt-[24px] pb-[80px] flex flex-col gap-[16px]">
              <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[17px] tracking-[0.34px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Build Monitoring</p>

              <ToggleRow
                label="Enable Recoater Hopping"
                value={enableRecoaterHopping}
                onChange={setEnableRecoaterHopping}
              />

              <div className="flex flex-col gap-[12px]">
                <CheckboxRow
                  label="Ignore bottom layers artifact anomalies"
                  value={ignoreBottomLayers}
                  onChange={setIgnoreBottomLayers}
                />
                <div className="pl-[26px]">
                  <NumberFieldDashed
                    label="Ignored Layers"
                    value={ignoredLayers}
                    onChange={setIgnoredLayers}
                    disabled={!ignoreBottomLayers}
                  />
                </div>
              </div>

              <TextField label="Secret Key" value={secretKey} onChange={setSecretKey} />

              {/* Rectification File with button */}
              <div className="flex flex-col w-full">
                <p className="font-['Centra_No2:Book',sans-serif] leading-[12px] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Rectification File</p>
                <div className="h-[4px]" />
                <div className="flex items-end gap-[10px]">
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center">
                      <span className={`font-['Centra_No2:Medium',sans-serif] leading-[16px] text-[13.5px] tracking-[0.54px] flex-1 truncate ${rectificationFile ? 'text-[#234057]' : 'text-[#a8b7bf]'}`} style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                        {rectificationFile || 'Select file...'}
                      </span>
                      <ChevronDown size={12} className="text-[#234057] shrink-0 ml-[4px]" />
                    </div>
                    <div className="h-[7px]" />
                    <div className="bg-[rgba(35,64,87,0.2)] h-px w-full" />
                  </div>
                  <div className="relative rounded-[3px] shrink-0">
                    <button
                      type="button"
                      className="flex items-center justify-center px-[14px] py-[8px]"
                      onClick={() => {/* open rectifier tool */ }}
                    >
                      <span className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px] whitespace-nowrap">Rectifier</span>
                    </button>
                    <div aria-hidden className="absolute border border-[rgba(35,64,87,0.2)] inset-0 rounded-[3px] pointer-events-none" />
                  </div>
                </div>
                {/* Hidden select for options */}
                <div className="relative">
                  <select
                    value={rectificationFile}
                    onChange={e => setRectificationFile(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                  >
                    <option value="">Select file...</option>
                    {RECTIFICATION_FILES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
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
    </div>
  );
}
