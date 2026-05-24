import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Trash2, Lock } from 'lucide-react';
import svgPathsNew from '@/imports/svg-sadprwxal1';
import { CustomSelect } from '@/app/components/CustomSelect';
import { InfoIcon } from '@/app/components/InfoIcon';
import { useAppContext, TriggerItem, Trigger, TriggerGroup } from '../context/AppContext';
import { RecurrenceRule, RecurrenceCondition, DEFAULT_RECURRENCE_RULE } from '../context/AppContext';

// ─── Constants ─────────────────────────────────────────────────────────────────

const PROPERTIES = [
  { value: 'anomaly_height_absolute', label: 'Anomaly Height (Absolute)', unit: 'mm', tooltip: 'Height of the aggregated anomaly' },
  { value: 'anomaly_height_layers', label: 'Anomaly Height (Layers)', unit: 'layers', tooltip: 'Number of layers the aggregated anomaly is present in' },
  { value: 'volume', label: 'Volume', unit: 'mm³', tooltip: 'Total volume of the aggregated anomaly' },
  { value: 'growth_rate', label: 'Growth Rate', unit: '%', tooltip: 'Percentage acceleration in volumetric growth. Compares growth between the last 2 intervals. Minimum 3 layers required.' },
  { value: '2d_area_current', label: '2D Area (Current Layer)', unit: 'mm²', tooltip: 'Area of the anomaly cross-section on the current layer' },
  { value: 'surface_area', label: 'Surface Area', unit: 'mm²', tooltip: 'Total surface area of the aggregated anomaly' },
  { value: 'volume_surface_ratio', label: 'Volume/Surface Area Ratio', unit: 'mm', tooltip: 'Compactness metric — ratio of total volume to surface area of the aggregated anomaly' },
  { value: 'volume_height_ratio', label: 'Volume/Height Ratio', unit: 'mm²', tooltip: 'Shape metric — ratio of total volume to height of the aggregated anomaly' },
  { value: '2d_area_build_plate', label: 'Current 2D Area / Build Plate', unit: '%', tooltip: 'Percentage of build plate area covered by the anomaly on the current layer' },
  { value: 'distance_nearest_parallel', label: 'Distance from Nearest Edge (Parallel to Recoater)', unit: 'mm', tooltip: 'Distance from the anomaly to the nearest build plate edge that runs parallel to the recoater direction' },
  { value: 'distance_nearest_orthogonal', label: 'Distance from Nearest Edge (Orthogonal to Recoater)', unit: 'mm', tooltip: 'Distance from the anomaly to the nearest build plate edge that runs orthogonal to the recoater direction' },
  { value: 'intersect_with', label: 'Intersects With', unit: '', tooltip: 'Binary intersection check — alert fires if the anomaly contour on the current layer intersects with the selected target. No operator or threshold needed.' },
];

const INTERSECT_TARGETS = [
  { value: 'part', label: 'Part (Generic)' },
  { value: 'warpage_critical', label: 'Warpage – Critical' },
  { value: 'warpage_moderate', label: 'Warpage – Moderate' },
  { value: 'recoater_lines_critical', label: 'Recoater Lines – Critical' },
  { value: 'recoater_lines_moderate', label: 'Recoater Lines – Moderate' },
  { value: 'recoater_hopping_critical', label: 'Recoater Hopping – Critical' },
  { value: 'recoater_hopping_moderate', label: 'Recoater Hopping – Moderate' },
  { value: 'short_feed_critical', label: 'Short Feed – Critical' },
  { value: 'short_feed_moderate', label: 'Short Feed – Moderate' },
];

const IOT_PROPERTIES = [
  { value: 'laser_temperature', label: 'Laser Temperature', unit: '°C' },
  { value: 'pneumatic_argon_pressure', label: 'Pneumatic Argon Pressure', unit: 'PSI' },
  { value: 'pneumatic_filter_pressure', label: 'Pneumatic Filter Pressure', unit: 'PSI' },
  { value: 'oxygen_concentration', label: 'Oxygen Concentration', unit: 'ppm' },
  { value: 'last_layer_dwell_time', label: 'Last Layer Dwell Time', unit: 's' },
];

const OPERATORS = [
  { value: 'gt', label: 'Greater than' },
  { value: 'gte', label: 'Greater or equal' },
  { value: 'lt', label: 'Less than' },
  { value: 'lte', label: 'Less or equal' },
  { value: 'eq', label: 'Equal to' },
  { value: 'neq', label: 'Not equal to' },
];

const ALERT_TYPES = [
  { value: 'anomaly', label: 'Anomaly' },
  { value: 'iot', label: 'IOT' },
];

const MACHINE_MODELS_OPTIONS = [
  { value: 'mm1', label: 'EOS M 290' },
  { value: 'mm2', label: 'SLM 280' },
  { value: 'mm3', label: 'Velo3D Sapphire' },
];

const MACHINES_OPTIONS = [
  { value: 'm1', label: 'EOS 1', machineModelId: 'mm1' },
  { value: 'm2', label: 'EOS 2', machineModelId: 'mm1' },
  { value: 'm3', label: 'SLM Alpha', machineModelId: 'mm2' },
  { value: 'm4', label: 'Sapphire 1', machineModelId: 'mm3' },
  { value: 'm5', label: 'Sapphire 2', machineModelId: 'mm3' },
];

const ANOMALY_TYPES = [
  { value: 'warp', label: 'Warpage' },
  { value: 'recoater_lines', label: 'Recoater Lines' },
  { value: 'recoater_hopping', label: 'Recoater Hopping' },
  { value: 'short_feed', label: 'Short Feed' },
];

const SEVERITY_LEVELS = [
  { value: 'critical', label: 'Critical' },
  { value: 'moderate', label: 'Moderate' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isGroup(item: TriggerItem): item is TriggerGroup {
  return 'triggers' in item;
}

function getPropertyUnit(propertyValue: string) {
  const p = PROPERTIES.find(p => p.value === propertyValue) || IOT_PROPERTIES.find(p => p.value === propertyValue);
  return p?.unit || '';
}

function getPropertyTooltip(propertyValue: string) {
  const p = PROPERTIES.find(p => p.value === propertyValue) || IOT_PROPERTIES.find(p => p.value === propertyValue) as any;
  return p?.tooltip || 'Select a property to see its description';
}

// ─── Source Badge ──────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: 'inherited' | 'direct' }) {
  return (
    <span className={`inline-flex items-center px-[6px] py-[1px] rounded-[3px] font-['Centra_No2:Medium',sans-serif] text-[10px] tracking-[0.3px] ${
      source === 'inherited'
        ? 'bg-[rgba(168,183,191,0.2)] text-[#59747a]'
        : 'bg-[rgba(109,116,243,0.12)] text-[#6d74f3]'
    }`} style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
      {source === 'inherited' ? 'Inherited' : 'Direct'}
    </span>
  );
}

// ─── Trigger Row (read-only view in Assigned Machines section) ─────────────────

function ReadOnlyTriggerRow({ trigger }: { trigger: Trigger }) {
  const propLabel = PROPERTIES.find(p => p.value === trigger.property)?.label
    || IOT_PROPERTIES.find(p => p.value === trigger.property)?.label
    || trigger.property;
  const opLabel = OPERATORS.find(o => o.value === trigger.operator)?.label || trigger.operator;
  const targetLabel = INTERSECT_TARGETS.find(t => t.value === trigger.value)?.label || trigger.value;

  return (
    <div className="flex items-center gap-[8px] py-[4px]">
      <span className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{propLabel}</span>
      {trigger.property !== 'intersect_with' && (
        <>
          <span className="text-[#a8b7bf] text-[12px]">·</span>
          <span className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{opLabel}</span>
          <span className="text-[#a8b7bf] text-[12px]">·</span>
          <span className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            {trigger.value} {getPropertyUnit(trigger.property)}
          </span>
        </>
      )}
      {trigger.property === 'intersect_with' && (
        <>
          <span className="text-[#a8b7bf] text-[12px]">→</span>
          <span className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{targetLabel}</span>
        </>
      )}
    </div>
  );
}

// ─── Recurrence Condition Row ──────────────────────────────────────────────────

interface RecurrenceConditionRowProps {
  label: string;
  enabled: boolean;
  condition: RecurrenceCondition | null;
  onToggle: (checked: boolean) => void;
  onOperatorChange: (op: string) => void;
  onValueChange: (val: number) => void;
  unitToggle?: React.ReactNode;
  unitLabel?: string;
  readOnly: boolean;
}

function RecurrenceConditionRow({
  label, enabled, condition, onToggle, onOperatorChange, onValueChange, unitToggle, unitLabel, readOnly,
}: RecurrenceConditionRowProps) {
  return (
    <div className="flex items-start gap-[12px]">
      {/* Checkbox */}
      <div className="flex items-center mt-[22px] shrink-0">
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => onToggle(e.target.checked)}
          disabled={readOnly}
          className="w-[14px] h-[14px] cursor-pointer accent-[#6d74f3] disabled:cursor-default"
        />
      </div>

      {/* Property label */}
      <div className="flex items-center mt-[22px] w-[52px] shrink-0">
        <p className={`font-['Centra_No2:Medium',sans-serif] text-[13.5px] tracking-[0.54px] transition-colors ${enabled ? 'text-[#234057]' : 'text-[#a8b7bf]'}`}
          style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
          {label}
        </p>
      </div>

      {/* Operator */}
      <div className={`flex-1 min-w-0 transition-opacity ${!enabled ? 'opacity-30 pointer-events-none' : ''}`}>
        <CustomSelect
          value={condition?.operator || ''}
          onChange={onOperatorChange}
          options={OPERATORS}
          icon="text-caret"
          label="Operator"
        />
      </div>

      {/* Value */}
      <div className={`flex flex-col min-w-[64px] transition-opacity ${!enabled ? 'opacity-30 pointer-events-none' : ''}`}>
        <div className="h-[12px] flex items-center">
          <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Value</p>
        </div>
        <div className="h-[4px]" />
        <input
          type="number"
          min={0}
          value={condition?.value ?? ''}
          onChange={e => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onValueChange(v);
          }}
          className="font-['Centra_No2:Medium',sans-serif] leading-[16px] text-[#234057] text-[13.5px] tracking-[0.54px] outline-none bg-transparent border-none w-[56px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          style={{ fontFeatureSettings: "'lnum', 'tnum'" }}
        />
        <div className="h-[7px]" />
        <div className="bg-[rgba(35,64,87,0.2)] h-px w-full" />
      </div>

      {/* Unit label or toggle */}
      <div className={`flex items-center mt-[22px] shrink-0 transition-opacity ${!enabled ? 'opacity-30' : ''}`}>
        {unitToggle || (
          <span className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]"
            style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            {unitLabel}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Logic Toggle (And / Or pill) ─────────────────────────────────────────────

function LogicToggle({ value, onChange, readOnly }: { value: 'and' | 'or'; onChange: (v: 'and' | 'or') => void; readOnly: boolean }) {
  return (
    <div className="flex items-center">
      {(['and', 'or'] as const).map((op, i) => (
        <div
          key={op}
          onClick={() => !readOnly && onChange(op)}
          className={`${value === op ? 'bg-[rgba(35,64,87,0.1)]' : ''} relative shrink-0 ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${i === 0 ? 'rounded-l-[3px]' : 'rounded-r-[3px]'}`}
        >
          <div className="flex items-center justify-center px-[12px] py-[4px]">
            <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
              {op === 'and' ? 'And' : 'Or'}
            </p>
          </div>
          <div aria-hidden className={`absolute border border-[rgba(35,64,87,0.2)] inset-0 pointer-events-none ${i === 0 ? 'rounded-l-[3px]' : 'rounded-r-[3px]'}`} />
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export function CreateAlertModelPage() {
  const navigate = useNavigate();
  const { id: editId } = useParams<{ id: string }>();
  const { alertModels, addAlertModel, updateAlertModel, removeAllAssignmentsForAlertModel, getAssignedMachines, removeMachineAlertModelAssignment } = useAppContext();

  const editingModel = editId ? alertModels.find(am => am.id === editId) : undefined;
  const assignedMachines = editId ? getAssignedMachines(editId) : [];
  const isBlocked = !!editId && assignedMachines.length > 0;

  // ─ Form State ─────────────────────────────────────────────────────────────────
  const [name, setName] = useState(editingModel?.name || '');
  const [alertType, setAlertType] = useState(editingModel?.alertType || '');
  const [notes, setNotes] = useState(editingModel?.notes || '');
  const [anomalyType, setAnomalyType] = useState(editingModel?.anomalyType || '');
  const [severity, setSeverity] = useState(editingModel?.severity || '');
  const [scopeMachineModel, setScopeMachineModel] = useState(editingModel?.scopeMachineModel || '');
  const [scopeMachines, setScopeMachines] = useState<string[]>(editingModel?.scopeMachines || []);
  const [triggers, setTriggers] = useState<TriggerItem[]>(editingModel?.triggers || []);
  const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRule>(editingModel?.recurrenceRule || DEFAULT_RECURRENCE_RULE);
  const [triggerOperators, setTriggerOperators] = useState<Record<string, 'and' | 'or'>>(editingModel?.triggerOperators || {});

  useEffect(() => {
    if (editingModel) {
      setName(editingModel.name);
      setAlertType(editingModel.alertType);
      setNotes(editingModel.notes);
      setAnomalyType(editingModel.anomalyType);
      setSeverity(editingModel.severity);
      setScopeMachineModel(editingModel.scopeMachineModel);
      setScopeMachines(editingModel.scopeMachines);
      setTriggers(editingModel.triggers);
      setRecurrenceRule(editingModel.recurrenceRule);
      setTriggerOperators(editingModel.triggerOperators);
    }
  }, [editId]);

  // ─ Computed Machine Options ──────────────────────────────────────────────────

  const filteredMachineOptions = (() => {
    if (!scopeMachineModel) return MACHINES_OPTIONS;
    const filtered = MACHINES_OPTIONS.filter(m => m.machineModelId === scopeMachineModel);
    return [{ value: 'all', label: 'All', machineModelId: scopeMachineModel }, ...filtered];
  })();

  const handleMachineSelectionChange = (selectedMachines: string[]) => {
    if (!scopeMachineModel) { setScopeMachines(selectedMachines); return; }
    const machinesOfSelectedModel = MACHINES_OPTIONS.filter(m => m.machineModelId === scopeMachineModel).map(m => m.value);
    if (selectedMachines.includes('all') && !scopeMachines.includes('all')) {
      setScopeMachines(['all', ...machinesOfSelectedModel]);
    } else if (!selectedMachines.includes('all') && scopeMachines.includes('all')) {
      setScopeMachines([]);
    } else if (scopeMachines.includes('all') && selectedMachines.length !== machinesOfSelectedModel.length + 1) {
      setScopeMachines(selectedMachines.filter(m => m !== 'all'));
    } else if (!selectedMachines.includes('all') &&
      machinesOfSelectedModel.every(m => selectedMachines.includes(m)) &&
      machinesOfSelectedModel.length > 0) {
      setScopeMachines(['all', ...selectedMachines]);
    } else {
      setScopeMachines(selectedMachines);
    }
  };

  useEffect(() => {
    if (!isBlocked) setScopeMachines([]);
  }, [scopeMachineModel]);

  const isCreateEnabled = (() => {
    if (!alertType) return false;
    if (alertType === 'anomaly' && (!anomalyType || !severity)) return false;
    return true;
  })();

  // ─ Trigger CRUD ───────────────────────────────────────────────────────────────

  const addTrigger = () => {
    setTriggers(prev => [...prev, { id: `trigger-${Date.now()}`, property: '', operator: '', value: '0' }]);
  };

  const deleteTrigger = (triggerId: string) => {
    setTriggers(prev => prev.filter(t => t.id !== triggerId));
  };

  const deleteTriggerGroup = (groupId: string) => {
    setTriggers(prev => prev.filter(t => t.id !== groupId));
  };

  const deleteTriggerFromGroup = (groupId: string, triggerId: string) => {
    setTriggers(prev => prev.map(item => {
      if (isGroup(item) && item.id === groupId) {
        return { ...item, triggers: item.triggers.filter(t => t.id !== triggerId) };
      }
      return item;
    }));
  };

  const addTriggerToGroup = (groupId: string) => {
    setTriggers(prev => prev.map(item => {
      if (isGroup(item) && item.id === groupId) {
        return { ...item, triggers: [...item.triggers, { id: `trigger-${Date.now()}`, property: '', operator: '', value: '0' }] };
      }
      return item;
    }));
  };

  const updateTrigger = (triggerId: string, field: keyof Trigger, value: string) => {
    setTriggers(prev => prev.map(item => {
      if (!isGroup(item) && item.id === triggerId) return { ...item, [field]: value };
      return item;
    }));
  };

  const updateTriggerInGroup = (groupId: string, triggerId: string, field: keyof Trigger, value: string) => {
    setTriggers(prev => prev.map(item => {
      if (isGroup(item) && item.id === groupId) {
        return { ...item, triggers: item.triggers.map(t => t.id === triggerId ? { ...t, [field]: value } : t) };
      }
      return item;
    }));
  };

  // ─ Recurrence helpers ─────────────────────────────────────────────────────────

  const setLayersEnabled = (checked: boolean) => {
    setRecurrenceRule(prev => ({
      ...prev,
      layers: checked ? { operator: 'gt', value: 10 } : null,
    }));
  };

  const setVolumeEnabled = (checked: boolean) => {
    setRecurrenceRule(prev => ({
      ...prev,
      volume: checked ? { operator: 'gt', value: 10, unit: 'percent' } : null,
    }));
  };

  // ─ Save ──────────────────────────────────────────────────────────────────────

  const handleSave = () => {
    const actualMachines = scopeMachines.filter(m => m !== 'all');
    const data = {
      name, alertType, notes, anomalyType, severity,
      scopeMachineModel, scopeMachines: actualMachines,
      triggers, triggerOperators, recurrenceRule,
    };
    if (editId) {
      updateAlertModel(editId, data);
    } else {
      addAlertModel(data);
    }
    navigate('/alert-models');
  };

  const handleNameBlur = () => {
    if (editId && isBlocked) {
      updateAlertModel(editId, { name, notes });
    }
  };

  // ─ Trigger Render ─────────────────────────────────────────────────────────────

  const renderTriggerRow = (item: TriggerItem, index: number) => {
    const triggerElement = (() => {
      if (isGroup(item)) {
        return (
          <div key={item.id} className="border border-[rgba(35,64,87,0.2)] rounded-[4px] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-['Centra_No2:Medium',sans-serif] text-[13.5px] text-[#234057] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{item.name}</span>
              {!isBlocked && (
                <button onClick={() => deleteTriggerGroup(item.id)} className="size-8 rounded-[3px] hover:bg-[rgba(35,64,87,0.05)] flex items-center justify-center">
                  <Trash2 className="size-4 text-[#234057]" />
                </button>
              )}
            </div>
            <div className="flex flex-col gap-[8px]">
              {item.triggers.map(trigger => (
                <div key={trigger.id} className="border border-[rgba(35,64,87,0.2)] rounded-[4px] p-4">
                  <TriggerFields trigger={trigger}
                    alertType={alertType}
                    onPropertyChange={v => updateTriggerInGroup(item.id, trigger.id, 'property', v)}
                    onOperatorChange={v => updateTriggerInGroup(item.id, trigger.id, 'operator', v)}
                    onValueChange={v => updateTriggerInGroup(item.id, trigger.id, 'value', v)}
                    onTargetChange={v => updateTriggerInGroup(item.id, trigger.id, 'value', v)}
                    onDelete={() => deleteTriggerFromGroup(item.id, trigger.id)}
                    readOnly={isBlocked}
                  />
                </div>
              ))}
            </div>
            {!isBlocked && (
              <div className="relative rounded-[3px] mt-3 inline-flex">
                <div className="flex gap-[8px] items-center px-[12px] py-[8px] rounded-[inherit]">
                  <div className="size-[16px]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                      <path d={svgPathsNew.p100d5c80} fill="#234057" />
                    </svg>
                  </div>
                  <button onClick={() => addTriggerToGroup(item.id)}>
                    <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Add Trigger</p>
                  </button>
                </div>
                <div aria-hidden className="absolute border border-[rgba(35,64,87,0.2)] inset-0 rounded-[3px] pointer-events-none" />
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div key={item.id} className="bg-white relative rounded-[4px] w-full">
            <div aria-hidden className="absolute border border-[rgba(35,64,87,0.2)] inset-0 rounded-[4px] shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)] pointer-events-none" />
            <div className="flex flex-col gap-[8px] items-start justify-center p-[16px] w-full">
              <TriggerFields trigger={item}
                alertType={alertType}
                onPropertyChange={v => updateTrigger(item.id, 'property', v)}
                onOperatorChange={v => updateTrigger(item.id, 'operator', v)}
                onValueChange={v => updateTrigger(item.id, 'value', v)}
                onTargetChange={v => updateTrigger(item.id, 'value', v)}
                onDelete={() => deleteTrigger(item.id)}
                readOnly={isBlocked}
              />
            </div>
          </div>
        );
      }
    })();

    return (
      <div key={item.id} className="flex flex-col gap-[12px]">
        {triggerElement}
        {index < triggers.length - 1 && (
          <div className="flex justify-start w-full">
            <div className="flex items-start">
              {(['and', 'or'] as const).map((op, i) => (
                <div
                  key={op}
                  onClick={() => !isBlocked && setTriggerOperators(prev => ({ ...prev, [item.id]: op }))}
                  className={`${(triggerOperators[item.id] || 'and') === op ? 'bg-[rgba(35,64,87,0.1)]' : ''} relative shrink-0 ${isBlocked ? 'cursor-default' : 'cursor-pointer'} ${i === 0 ? 'rounded-bl-[3px] rounded-tl-[3px]' : 'rounded-br-[3px] rounded-tr-[3px]'}`}
                >
                  <div className="flex flex-col items-center justify-center px-[12px] py-[4px]">
                    <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                      {op === 'and' ? 'And' : 'Or'}
                    </p>
                  </div>
                  <div aria-hidden className={`absolute border border-[rgba(35,64,87,0.2)] inset-0 pointer-events-none ${i === 0 ? 'rounded-bl-[3px] rounded-tl-[3px]' : 'rounded-br-[3px] rounded-tr-[3px]'}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─ Assigned Machines Section ──────────────────────────────────────────────────

  const renderAssignedMachines = () => {
    if (!editId) return null;

    return (
      <div className="flex flex-col gap-[12px]">
        <div className="flex items-center justify-between">
          <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[17px] tracking-[0.34px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            Assigned Machines
          </p>
          {assignedMachines.length > 0 && (
            <button onClick={() => removeAllAssignmentsForAlertModel(editId)} className="relative rounded-[3px]">
              <div className="flex items-center gap-[6px] px-[12px] py-[6px]">
                <Trash2 size={13} className="text-red-500" />
                <p className="font-['Centra_No2:Medium',sans-serif] text-red-500 text-[12px] tracking-[0.48px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                  Remove All Assignments
                </p>
              </div>
              <div aria-hidden className="absolute border border-red-200 inset-0 rounded-[3px] pointer-events-none" />
            </button>
          )}
        </div>

        {assignedMachines.length === 0 ? (
          <div className="bg-[rgba(35,64,87,0.03)] rounded-[4px] px-[16px] py-[12px]">
            <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[14px] tracking-[0.28px]">
              No machines are currently assigned to this alert model.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[8px]">
            {assignedMachines.map(machine => {
              const assignment = machine.alertModelAssignments.find(a => a.alertModelId === editId);
              const hasOverrides = assignment && Object.keys(assignment.valueOverrides).length > 0;
              return (
                <div key={machine.id} className="flex items-center justify-between px-[16px] py-[12px] bg-white rounded-[4px] relative">
                  <div aria-hidden className="absolute border border-[rgba(35,64,87,0.12)] inset-0 rounded-[4px] pointer-events-none" />
                  <div className="flex items-center gap-[10px]">
                    <div>
                      <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                        {machine.name}
                      </p>
                      <div className="flex items-center gap-[6px] mt-[4px]">
                        <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                          {MACHINE_MODELS_OPTIONS.find(m => m.value === machine.machineModelId)?.label || machine.machineModelId}
                        </p>
                        {hasOverrides && (
                          <span className="inline-flex items-center px-[6px] py-[1px] bg-[rgba(109,116,243,0.1)] rounded-[3px]">
                            <p className="font-['Centra_No2:Book',sans-serif] text-[#6d74f3] text-[11px] tracking-[0.22px]">Has value overrides</p>
                          </span>
                        )}
                      </div>
                    </div>
                    {assignment && <SourceBadge source={assignment.source} />}
                  </div>
                  <button
                    onClick={() => removeMachineAlertModelAssignment(machine.id, editId)}
                    className="w-[28px] h-[28px] flex items-center justify-center rounded-[3px] hover:bg-[rgba(35,64,87,0.08)] transition-colors"
                  >
                    <Trash2 size={13} className="text-[#59747a]" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ─ Render ─────────────────────────────────────────────────────────────────────

  const bothConditionsActive = recurrenceRule.layers !== null && recurrenceRule.volume !== null;

  return (
    <div className="relative min-h-screen bg-[#f8f7f6]">
      <div className="mx-auto max-w-[1440px] px-8 py-8 flex flex-col gap-[12px]">

        {/* ── Main Alert Model Card ── */}
        <div className="bg-white rounded-[3px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] relative">

          {/* Header */}
          <div className="border-b border-[rgba(35,64,87,0.1)] h-[72px] px-8 relative flex items-center">
            <div className="absolute left-1/2 -translate-x-1/2">
              <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[20px] tracking-[0.4px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                {editId ? 'Edit Alert Model' : 'Create Alert Model'}
              </p>
            </div>
            <div className="absolute right-8">
              <button onClick={() => navigate('/alert-models')} className="relative rounded-[3px]">
                <div className="flex items-center justify-center px-[16px] py-[10px]">
                  <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Cancel</p>
                </div>
                <div aria-hidden className="absolute border border-[rgba(35,64,87,0.2)] inset-0 rounded-[3px] pointer-events-none" />
              </button>
            </div>
          </div>

          {/* Blocking banner */}
          {isBlocked && (
            <div className="bg-amber-50 border-b border-amber-200 px-8 py-3 flex items-start gap-3">
              <Lock size={15} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="font-['Centra_No2:Book',sans-serif] text-amber-800 text-[13.5px] tracking-[0.27px] leading-[20px]">
                This alert model is assigned to <strong className="font-['Centra_No2:Medium',sans-serif]">{assignedMachines.length} machine{assignedMachines.length !== 1 ? 's' : ''}</strong>.
                {' '}To modify its logic, remove all machine assignments first. <strong className="font-['Centra_No2:Medium',sans-serif]">Name</strong> and <strong className="font-['Centra_No2:Medium',sans-serif]">Notes</strong> remain editable.
              </p>
            </div>
          )}

          <div className="flex">
            {/* Left Column — General */}
            <div className="w-[400px] border-r border-[#d2d8d9] pt-8 pb-8 px-8 shrink-0">
              <div className="flex flex-col gap-[16px]">
                <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[17px] tracking-[0.34px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>General</p>

                {/* Name */}
                <div className="flex flex-col w-full">
                  <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Name</p>
                  <div className="h-[4px]" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onBlur={handleNameBlur}
                    className="font-['Centra_No2:Medium',sans-serif] h-[16px] leading-[16px] text-[#234057] text-[13.5px] tracking-[0.54px] outline-none bg-transparent border-none w-full"
                    style={{ fontFeatureSettings: "'lnum', 'tnum'" }}
                    placeholder="Alert model name..."
                  />
                  <div className="h-[7px]" />
                  <div className="bg-[rgba(35,64,87,0.2)] h-px w-full" />
                </div>

                {/* Alert Type */}
                <div className={`flex flex-col w-full ${isBlocked ? 'opacity-40 pointer-events-none' : ''}`}>
                  <CustomSelect value={alertType} onChange={setAlertType} options={ALERT_TYPES} icon="caret" label="Alert Type" required />
                </div>

                {/* Notes */}
                <div className="flex flex-col w-full">
                  <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Notes</p>
                  <div className="h-[4px]" />
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    onBlur={handleNameBlur}
                    className="font-['Centra_No2:Medium',sans-serif] h-[16px] leading-[16px] text-[#234057] text-[13.5px] tracking-[0.54px] outline-none bg-transparent border-none w-full"
                    style={{ fontFeatureSettings: "'lnum', 'tnum'" }}
                    placeholder="Optional notes..."
                  />
                  <div className="h-[7px]" />
                  <div className="bg-[rgba(35,64,87,0.2)] h-px w-full" />
                </div>
              </div>
            </div>

            {/* Right Column — Scope + Triggers */}
            <div className="flex-1 pt-8 pb-8 px-[32px] overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="flex flex-col gap-[32px]">

                {/* Data Scope */}
                <div className={`flex flex-col gap-[12px] ${isBlocked ? 'opacity-40 pointer-events-none' : ''}`}>
                  <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[17px] tracking-[0.34px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Data Scope</p>
                  <div className="flex gap-[12px] items-start w-full">
                    <div className="flex flex-col items-start flex-1">
                      <CustomSelect value={scopeMachineModel} onChange={setScopeMachineModel} options={MACHINE_MODELS_OPTIONS} icon="caret" label="Machine Model" />
                    </div>
                    <div className="flex flex-col items-start flex-1">
                      <CustomSelect value={scopeMachines} onChange={handleMachineSelectionChange} options={filteredMachineOptions} icon="caret" label="Machine" multiple />
                    </div>
                  </div>
                </div>

                {/* Trigger Section */}
                <div className="flex flex-col gap-[12px] w-full">
                  <div className="flex items-center gap-[8px]">
                    <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[17px] tracking-[0.34px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Trigger</p>
                    {isBlocked && <Lock size={14} className="text-[#a8b7bf]" />}
                  </div>

                  <div className="bg-[rgba(35,64,87,0.05)] rounded-[4px] w-full">
                    <div className="flex flex-col items-start px-[16px] py-[12px] w-full">
                      <p className="font-['Centra_No2:Book',sans-serif] leading-[22px] text-[#59747a] text-[14px] tracking-[0.28px] w-full">
                        This Alert will be triggered when the <span className="font-['Centra_No2:Bold',sans-serif]">defined condition</span> is met. This Alert will only be triggered on the defined <span className="font-['Centra_No2:Bold',sans-serif]">Data Scope</span>
                      </p>
                    </div>
                  </div>

                  {alertType === 'anomaly' && (
                    <div className={`flex gap-[12px] items-start w-full ${isBlocked ? 'opacity-40 pointer-events-none' : ''}`}>
                      <div className="flex flex-col items-start flex-1">
                        <CustomSelect value={anomalyType} onChange={setAnomalyType} options={ANOMALY_TYPES} icon="caret" label="Anomaly Type" required />
                      </div>
                      <div className="flex flex-col items-start flex-1">
                        <CustomSelect value={severity} onChange={setSeverity} options={SEVERITY_LEVELS} icon="caret" label="Severity" required />
                      </div>
                    </div>
                  )}

                  <div className={`flex flex-col gap-[12px] ${isBlocked ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                    {triggers.map((item, index) => renderTriggerRow(item, index))}
                  </div>

                  {!isBlocked && (
                    <div className="flex flex-col gap-[10px] items-start">
                      <div className="relative rounded-[3px]">
                        <button
                          onClick={addTrigger}
                          disabled={!alertType || (alertType === 'anomaly' && (!anomalyType || !severity))}
                          className={`flex gap-[8px] items-center px-[12px] py-[8px] rounded-[inherit] relative z-10 ${
                            !alertType || (alertType === 'anomaly' && (!anomalyType || !severity))
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer hover:bg-[rgba(35,64,87,0.02)]'
                          }`}
                        >
                          <div className="size-[16px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                              <path d={svgPathsNew.p100d5c80} fill="#234057" />
                            </svg>
                          </div>
                          <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Add Trigger</p>
                        </button>
                        <div aria-hidden className="absolute border border-[rgba(35,64,87,0.2)] inset-0 rounded-[3px] pointer-events-none" />
                      </div>
                    </div>
                  )}
                </div>

                {editId && <div className="bg-[rgba(35,64,87,0.1)] h-px w-full" />}
                {renderAssignedMachines()}

              </div>
            </div>
          </div>
        </div>

        {/* ── Recurrent Alert Card ── */}
        {alertType && alertType !== 'iot' && (
          <div className="bg-white rounded-[3px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] relative">

            {/* Card Header */}
            <div className="h-[64px] px-8 flex items-center justify-between border-b border-[rgba(35,64,87,0.1)]">
              <div className="flex items-center gap-[8px]">
                <p className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[17px] tracking-[0.34px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                  Recurrent Alert
                </p>
                <InfoIcon tooltip="After the Alert Model fires for the first time, recurrency conditions define when to fire again — based on how much the anomaly has grown since first detection. Each condition repeats in equal steps." />
              </div>

              {/* Toggle switch */}
              <button
                onClick={() => !isBlocked && setRecurrenceRule(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`relative w-[40px] h-[22px] rounded-full transition-colors flex-shrink-0 ${
                  recurrenceRule.enabled ? 'bg-[#6d74f3]' : 'bg-[rgba(35,64,87,0.2)]'
                } ${isBlocked ? 'opacity-40 cursor-default' : 'cursor-pointer'}`}
                aria-label="Toggle recurrent alert"
              >
                <div className={`absolute top-[3px] w-[16px] h-[16px] bg-white rounded-full shadow-sm transition-transform ${
                  recurrenceRule.enabled ? 'translate-x-[21px]' : 'translate-x-[3px]'
                }`} />
              </button>
            </div>

            {/* Card Body */}
            {recurrenceRule.enabled && (
              <div className={`px-8 py-6 ${isBlocked ? 'opacity-40 pointer-events-none' : ''}`}>

                {/* Description */}
                <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[13.5px] tracking-[0.27px] leading-[20px] mb-[24px]">
                  Activates only after the Alert Model definition above has fired for the first time. From that point, it re-fires each time the anomaly keeps growing — both <span className="font-['Centra_No2:Medium',sans-serif] text-[#234057]">Layers</span> and <span className="font-['Centra_No2:Medium',sans-serif] text-[#234057]">Volume</span> conditions step from the first-detection baseline, and each threshold crossing triggers a new alert.
                </p>

                <div className="flex flex-col gap-[16px]">

                  {/* Layers condition */}
                  <RecurrenceConditionRow
                    label="Layers"
                    enabled={recurrenceRule.layers !== null}
                    condition={recurrenceRule.layers}
                    onToggle={setLayersEnabled}
                    onOperatorChange={op => setRecurrenceRule(prev => ({
                      ...prev,
                      layers: prev.layers ? { ...prev.layers, operator: op } : { operator: op, value: 10 },
                    }))}
                    onValueChange={val => setRecurrenceRule(prev => ({
                      ...prev,
                      layers: prev.layers ? { ...prev.layers, value: val } : { operator: 'gt', value: val },
                    }))}
                    unitLabel="layers"
                    readOnly={isBlocked}
                  />

                  {/* AND / OR connector — only shown when both conditions are active */}
                  {bothConditionsActive && (
                    <div className="flex items-center gap-[12px] pl-[82px]">
                      <LogicToggle
                        value={recurrenceRule.logic}
                        onChange={logic => setRecurrenceRule(prev => ({ ...prev, logic }))}
                        readOnly={isBlocked}
                      />
                    </div>
                  )}

                  {/* Volume condition */}
                  <RecurrenceConditionRow
                    label="Volume"
                    enabled={recurrenceRule.volume !== null}
                    condition={recurrenceRule.volume}
                    onToggle={setVolumeEnabled}
                    onOperatorChange={op => setRecurrenceRule(prev => ({
                      ...prev,
                      volume: prev.volume
                        ? { ...prev.volume, operator: op }
                        : { operator: op, value: 10, unit: 'percent' },
                    }))}
                    onValueChange={val => setRecurrenceRule(prev => ({
                      ...prev,
                      volume: prev.volume
                        ? { ...prev.volume, value: val }
                        : { operator: 'gt', value: val, unit: 'percent' },
                    }))}
                    unitToggle={
                      <div className="flex items-center">
                        {(['absolute', 'percent'] as const).map((unit, i) => (
                          <div
                            key={unit}
                            onClick={() => recurrenceRule.volume && setRecurrenceRule(prev => ({
                              ...prev,
                              volume: prev.volume ? { ...prev.volume, unit } : null,
                            }))}
                            className={`${recurrenceRule.volume?.unit === unit ? 'bg-[rgba(35,64,87,0.1)]' : ''} relative shrink-0 cursor-pointer ${i === 0 ? 'rounded-l-[3px]' : 'rounded-r-[3px]'}`}
                          >
                            <div className="flex items-center justify-center px-[8px] py-[3px]">
                              <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[11px] tracking-[0.44px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                                {unit === 'absolute' ? 'mm³' : '%'}
                              </p>
                            </div>
                            <div aria-hidden className={`absolute border border-[rgba(35,64,87,0.2)] inset-0 pointer-events-none ${i === 0 ? 'rounded-l-[3px]' : 'rounded-r-[3px]'}`} />
                          </div>
                        ))}
                      </div>
                    }
                    readOnly={isBlocked}
                  />

                  {/* Helper hint when only one condition is active */}
                  {!bothConditionsActive && (
                    <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[12px] tracking-[0.24px] pl-[82px]"
                      style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                      Enable both conditions to combine them with And / Or logic.
                    </p>
                  )}

                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="bg-white rounded-[3px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] px-8 py-6">
          {editId ? (
            <div className="flex gap-[12px]">
              <button onClick={() => navigate('/alert-models')} className="relative flex-none rounded-[3px]">
                <div className="flex items-center justify-center px-[24px] py-[10px]">
                  <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]">Cancel</p>
                </div>
                <div aria-hidden className="absolute border border-[rgba(35,64,87,0.2)] inset-0 rounded-[3px] pointer-events-none" />
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-[#6d74f3] hover:bg-[#5a61e0] transition-colors rounded-[3px] flex items-center justify-center px-[16px] py-[10px]"
              >
                <p className="font-['Centra_No2:Medium',sans-serif] text-white text-[13.5px] tracking-[0.54px]">Save Changes</p>
              </button>
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={!isCreateEnabled}
              className={`flex h-[36px] items-center justify-center px-[16px] py-[10px] rounded-[3px] w-full transition-colors ${
                isCreateEnabled ? 'bg-[#6d74f3] hover:bg-[#5a61e0] cursor-pointer' : 'bg-[#6d74f3]/40 cursor-not-allowed'
              }`}
            >
              <p className="font-['Centra_No2:Medium',sans-serif] text-white text-[13.5px] tracking-[0.54px]">Create</p>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── TriggerFields Sub-component ───────────────────────────────────────────────

interface TriggerFieldsProps {
  trigger: Trigger;
  alertType: string;
  onPropertyChange: (v: string) => void;
  onOperatorChange: (v: string) => void;
  onValueChange: (v: string) => void;
  onTargetChange: (v: string) => void;
  onDelete: () => void;
  readOnly: boolean;
}

function TriggerFields({ trigger, alertType, onPropertyChange, onOperatorChange, onValueChange, onTargetChange, onDelete, readOnly }: TriggerFieldsProps) {
  return (
    <div className="flex gap-[12px] items-start w-full">
      {/* Property */}
      <div className="flex flex-col items-start self-stretch w-[320px]">
        <CustomSelect
          value={trigger.property}
          onChange={onPropertyChange}
          options={alertType === 'iot' ? IOT_PROPERTIES : PROPERTIES}
          icon="caret"
          label="Property"
          labelTooltip={trigger.property ? getPropertyTooltip(trigger.property) : 'Select a property to see its description'}
        />
      </div>

      {trigger.property === 'intersect_with' ? (
        <div className="flex flex-[1_0_0] flex-col items-start min-h-px min-w-px">
          <CustomSelect value={trigger.value} onChange={onTargetChange} options={INTERSECT_TARGETS} icon="caret" label="Target" />
        </div>
      ) : (
        <>
          {/* Operator */}
          <div className="flex flex-[1_0_0] flex-col items-start min-h-px min-w-px">
            <CustomSelect value={trigger.operator} onChange={onOperatorChange} options={OPERATORS} icon="text-caret" label="Operator" />
          </div>
          {/* Value */}
          <div className="flex flex-[1_0_0] flex-col items-start min-h-px min-w-px">
            <div className="flex gap-[4px] items-center w-full h-[12px]">
              <p className="font-['Centra_No2:Book',sans-serif] leading-[12px] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>Value</p>
            </div>
            <div className="h-[4px]" />
            <div className="flex font-['Centra_No2:Medium',sans-serif] gap-[2px] items-start leading-[16px] text-[#234057] text-[13.5px] tracking-[0.54px] w-[58px]">
              <input
                type="text"
                value={trigger.value}
                onChange={e => onValueChange(e.target.value)}
                className="font-['Centra_No2:Medium',sans-serif] leading-[16px] text-[#234057] text-[13.5px] tracking-[0.54px] outline-none bg-transparent border-none w-[40px]"
                style={{ fontFeatureSettings: "'lnum', 'tnum'" }}
              />
              {trigger.property && getPropertyUnit(trigger.property) && (
                <p className="text-right text-[#59747a]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>{getPropertyUnit(trigger.property)}</p>
              )}
            </div>
            <div className="h-[7px]" />
            <div className="bg-[rgba(35,64,87,0.2)] h-px w-full" />
          </div>
        </>
      )}

      {/* Delete */}
      {!readOnly && (
        <div className="rounded-[3px] size-[32px]">
          <button onClick={onDelete} className="size-full flex items-center justify-center hover:bg-[rgba(35,64,87,0.05)] rounded-[3px] transition-colors">
            <Trash2 className="size-4 text-[#234057]" />
          </button>
        </div>
      )}
    </div>
  );
}