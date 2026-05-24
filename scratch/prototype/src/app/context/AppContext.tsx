import { createContext, useContext, useState, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Trigger {
  id: string;
  property: string;
  operator: string;
  value: string;
}

export interface TriggerGroup {
  id: string;
  name: string;
  triggers: Trigger[];
}

export type TriggerItem = Trigger | TriggerGroup;

export interface RecurrenceCondition {
  operator: string;
  value: number;
}

export interface RecurrenceRule {
  enabled: boolean;
  layers: RecurrenceCondition | null;
  volume: (RecurrenceCondition & { unit: 'absolute' | 'percent' }) | null;
  logic: 'and' | 'or';
}

export const DEFAULT_RECURRENCE_RULE: RecurrenceRule = {
  enabled: false,
  layers: null,
  volume: null,
  logic: 'or',
};

export interface AlertModel {
  id: string;
  name: string;
  alertType: string;
  notes: string;
  anomalyType: string;
  severity: string;
  scopeMachineModel: string;
  scopeMachines: string[];
  triggers: TriggerItem[];
  triggerOperators: Record<string, 'and' | 'or'>;
  recurrenceRule: RecurrenceRule;
  createdAt: string;
}

export interface AlertModelAssignment {
  alertModelId: string;
  source: 'inherited' | 'direct';
  valueOverrides: Record<string, string>;
}

export interface Machine {
  id: string;
  name: string;
  machineModelId: string;
  type: string;
  manufacturer: string;
  gateway: string;
  active: boolean;
  ipAddress: string;
  alertModelAssignments: AlertModelAssignment[];
  lastModified: string;
  lastModifiedBy: string;
  // Extended fields
  notes?: string;
  virtualGatewayServer?: string;
  opcuaUsername?: string;
  opcuaPassword?: string;
  opcuaNamespace?: string;
  enableRecoaterHopping?: boolean;
  ignoreBottomLayers?: boolean;
  ignoredLayers?: number;
  secretKey?: string;
  rectificationFile?: string;
}

export interface MachineModel {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  notes?: string;
  lengthX?: number;
  widthY?: number;
  heightZ?: number;
  recoaterDirection?: 'horizontal' | 'vertical';
  assignedAlertModelIds?: string[];
  lastModified: string;
  lastModifiedBy: string;
}

export interface AppContextType {
  alertModels: AlertModel[];
  machines: Machine[];
  machineModels: MachineModel[];

  addAlertModel: (data: Omit<AlertModel, 'id' | 'createdAt'>) => void;
  updateAlertModel: (id: string, updates: Partial<Omit<AlertModel, 'id' | 'createdAt'>>) => void;
  deleteAlertModel: (id: string) => void;
  removeAllAssignmentsForAlertModel: (alertModelId: string) => void;

  addMachineAlertModelAssignment: (machineId: string, alertModelId: string) => void;
  removeMachineAlertModelAssignment: (machineId: string, alertModelId: string) => void;
  updateAssignmentValueOverride: (machineId: string, alertModelId: string, triggerId: string, value: string) => void;

  getAssignedMachines: (alertModelId: string) => Machine[];
  isTriggerGroup: (item: TriggerItem) => item is TriggerGroup;
  getAllTriggersFlat: (triggers: TriggerItem[]) => Trigger[];

  addMachineModel: (data: Omit<MachineModel, 'id' | 'lastModified' | 'lastModifiedBy'>) => void;
  addMachine: (data: Omit<Machine, 'id' | 'lastModified' | 'lastModifiedBy' | 'alertModelAssignments'>) => void;
}

// ─── Initial Mock Data ─────────────────────────────────────────────────────────

const INITIAL_MACHINE_MODELS: MachineModel[] = [
  { id: 'mm1', name: 'EOS M 290', type: 'Powder Bed Fusion', manufacturer: 'EOS', notes: '', lengthX: 250, widthY: 250, heightZ: 325, recoaterDirection: 'horizontal', assignedAlertModelIds: [], lastModified: '2026-01-10', lastModifiedBy: 'admin' },
  { id: 'mm2', name: 'SLM 280', type: 'Powder Bed Fusion', manufacturer: 'SLM Solutions', notes: '', lengthX: 280, widthY: 280, heightZ: 365, recoaterDirection: 'horizontal', assignedAlertModelIds: [], lastModified: '2026-01-15', lastModifiedBy: 'j.smith' },
  { id: 'mm3', name: 'Velo3D Sapphire', type: 'Directed Energy Deposition', manufacturer: 'Velo3D', notes: '', lengthX: 315, widthY: 315, heightZ: 400, recoaterDirection: 'vertical', assignedAlertModelIds: [], lastModified: '2026-01-20', lastModifiedBy: 'admin' },
];

const INITIAL_ALERT_MODELS: AlertModel[] = [
  {
    id: 'am1',
    name: 'Warpage Critical Alert',
    alertType: 'anomaly',
    notes: 'Triggers on critical warpage anomalies exceeding height threshold.',
    anomalyType: 'warp',
    severity: 'critical',
    scopeMachineModel: 'mm1',
    scopeMachines: [],
    triggers: [
      { id: 't1a', property: 'anomaly_height_absolute', operator: 'gt', value: '5' },
    ],
    triggerOperators: {},
    recurrenceRule: { enabled: false, layers: null, volume: null, logic: 'or' },
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'am2',
    name: 'High Volume Growth Alert',
    alertType: 'anomaly',
    notes: '',
    anomalyType: 'recoater_lines',
    severity: 'moderate',
    scopeMachineModel: '',
    scopeMachines: ['m4'],
    triggers: [
      { id: 't2a', property: 'volume', operator: 'gt', value: '100' },
      { id: 't2b', property: 'growth_rate', operator: 'gte', value: '25' },
    ],
    triggerOperators: { 't2a': 'and' },
    recurrenceRule: { enabled: true, layers: { operator: 'gt', value: 10 }, volume: { operator: 'gte', value: 15, unit: 'percent' }, logic: 'or' },
    createdAt: '2026-02-01T14:00:00Z',
  },
  {
    id: 'am3',
    name: 'Argon Pressure IOT',
    alertType: 'iot',
    notes: 'Monitors argon pressure drop below safe threshold.',
    anomalyType: '',
    severity: '',
    scopeMachineModel: 'mm3',
    scopeMachines: [],
    triggers: [
      { id: 't3a', property: 'pneumatic_argon_pressure', operator: 'lt', value: '80' },
    ],
    triggerOperators: {},
    recurrenceRule: { enabled: false, layers: null, volume: null, logic: 'or' },
    createdAt: '2026-02-10T09:30:00Z',
  },
];

const INITIAL_MACHINES: Machine[] = [
  {
    id: 'm1', name: 'EOS 1', machineModelId: 'mm1', type: 'Generic', manufacturer: 'EOS',
    gateway: 'GW-01', active: true, ipAddress: '192.168.1.10',
    alertModelAssignments: [{ alertModelId: 'am1', source: 'inherited', valueOverrides: {} }],
    lastModified: '2026-02-01', lastModifiedBy: 'admin',
    enableRecoaterHopping: true, ignoreBottomLayers: false, ignoredLayers: 0,
  },
  {
    id: 'm2', name: 'EOS 2', machineModelId: 'mm1', type: 'Generic', manufacturer: 'EOS',
    gateway: 'GW-01', active: true, ipAddress: '192.168.1.11',
    alertModelAssignments: [{ alertModelId: 'am1', source: 'inherited', valueOverrides: { 't1a': '8' } }],
    lastModified: '2026-02-03', lastModifiedBy: 'j.smith',
    enableRecoaterHopping: false, ignoreBottomLayers: true, ignoredLayers: 5,
  },
  {
    id: 'm3', name: 'SLM Alpha', machineModelId: 'mm2', type: 'Generic', manufacturer: 'SLM Solutions',
    gateway: 'GW-02', active: false, ipAddress: '192.168.1.20',
    alertModelAssignments: [],
    lastModified: '2026-02-10', lastModifiedBy: 'admin',
  },
  {
    id: 'm4', name: 'Sapphire 1', machineModelId: 'mm3', type: 'Generic', manufacturer: 'Velo3D',
    gateway: 'GW-03', active: true, ipAddress: '192.168.1.30',
    alertModelAssignments: [
      { alertModelId: 'am2', source: 'direct', valueOverrides: {} },
      { alertModelId: 'am3', source: 'inherited', valueOverrides: { 't3a': '75' } },
    ],
    lastModified: '2026-02-15', lastModifiedBy: 'm.johnson',
  },
  {
    id: 'm5', name: 'Sapphire 2', machineModelId: 'mm3', type: 'Generic', manufacturer: 'Velo3D',
    gateway: 'GW-03', active: true, ipAddress: '192.168.1.31',
    alertModelAssignments: [{ alertModelId: 'am3', source: 'inherited', valueOverrides: {} }],
    lastModified: '2026-02-20', lastModifiedBy: 'admin',
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function isTriggerGroup(item: TriggerItem): item is TriggerGroup {
  return 'triggers' in item;
}

export function getAllTriggersFlat(triggers: TriggerItem[]): Trigger[] {
  const result: Trigger[] = [];
  for (const item of triggers) {
    if (isTriggerGroup(item)) result.push(...item.triggers);
    else result.push(item);
  }
  return result;
}

// ─── Context ───────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [alertModels, setAlertModels] = useState<AlertModel[]>(INITIAL_ALERT_MODELS);
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [machineModels, setMachineModels] = useState<MachineModel[]>(INITIAL_MACHINE_MODELS);

  const getAssignedMachines = (alertModelId: string): Machine[] =>
    machines.filter(m => m.alertModelAssignments.some(a => a.alertModelId === alertModelId));

  const addAlertModel = (data: Omit<AlertModel, 'id' | 'createdAt'>) => {
    const newId = `am-${Date.now()}`;
    const newModel: AlertModel = { ...data, id: newId, createdAt: new Date().toISOString() };
    setAlertModels(prev => [...prev, newModel]);
    setMachines(prev => prev.map(machine => {
      let assignments = [...machine.alertModelAssignments];
      const alreadyAssigned = assignments.some(a => a.alertModelId === newId);
      if (alreadyAssigned) return machine;
      if (data.scopeMachineModel && machine.machineModelId === data.scopeMachineModel) {
        assignments = [...assignments, { alertModelId: newId, source: 'inherited', valueOverrides: {} }];
      } else if (data.scopeMachines.includes(machine.id)) {
        assignments = [...assignments, { alertModelId: newId, source: 'direct', valueOverrides: {} }];
      }
      return assignments.length !== machine.alertModelAssignments.length
        ? { ...machine, alertModelAssignments: assignments }
        : machine;
    }));
  };

  const updateAlertModel = (id: string, updates: Partial<Omit<AlertModel, 'id' | 'createdAt'>>) => {
    setAlertModels(prev => prev.map(am => am.id === id ? { ...am, ...updates } : am));
  };

  const deleteAlertModel = (id: string) => {
    setAlertModels(prev => prev.filter(am => am.id !== id));
    setMachines(prev => prev.map(m => ({
      ...m,
      alertModelAssignments: m.alertModelAssignments.filter(a => a.alertModelId !== id),
    })));
  };

  const removeAllAssignmentsForAlertModel = (alertModelId: string) => {
    setMachines(prev => prev.map(m => ({
      ...m,
      alertModelAssignments: m.alertModelAssignments.filter(a => a.alertModelId !== alertModelId),
    })));
  };

  const addMachineAlertModelAssignment = (machineId: string, alertModelId: string) => {
    setMachines(prev => prev.map(m => {
      if (m.id !== machineId) return m;
      const alreadyAssigned = m.alertModelAssignments.some(a => a.alertModelId === alertModelId);
      if (alreadyAssigned) return m;
      return { ...m, alertModelAssignments: [...m.alertModelAssignments, { alertModelId, source: 'direct', valueOverrides: {} }] };
    }));
  };

  const removeMachineAlertModelAssignment = (machineId: string, alertModelId: string) => {
    setMachines(prev => prev.map(m => {
      if (m.id !== machineId) return m;
      return { ...m, alertModelAssignments: m.alertModelAssignments.filter(a => a.alertModelId !== alertModelId) };
    }));
  };

  const updateAssignmentValueOverride = (machineId: string, alertModelId: string, triggerId: string, value: string) => {
    setMachines(prev => prev.map(m => {
      if (m.id !== machineId) return m;
      return {
        ...m,
        alertModelAssignments: m.alertModelAssignments.map(a => {
          if (a.alertModelId !== alertModelId) return a;
          return { ...a, valueOverrides: { ...a.valueOverrides, [triggerId]: value } };
        }),
      };
    }));
  };

  const addMachineModel = (data: Omit<MachineModel, 'id' | 'lastModified' | 'lastModifiedBy'>) => {
    const newId = `mm-${Date.now()}`;
    const newModel: MachineModel = {
      ...data,
      id: newId,
      lastModified: new Date().toISOString().split('T')[0],
      lastModifiedBy: 'admin',
    };
    setMachineModels(prev => [...prev, newModel]);
  };

  const addMachine = (data: Omit<Machine, 'id' | 'lastModified' | 'lastModifiedBy' | 'alertModelAssignments'>) => {
    const newId = `m-${Date.now()}`;
    const newMachine: Machine = {
      ...data,
      id: newId,
      alertModelAssignments: [],
      lastModified: new Date().toISOString().split('T')[0],
      lastModifiedBy: 'admin',
    };
    setMachines(prev => [...prev, newMachine]);
  };

  return (
    <AppContext.Provider value={{
      alertModels, machines, machineModels,
      addAlertModel, updateAlertModel, deleteAlertModel, removeAllAssignmentsForAlertModel,
      addMachineAlertModelAssignment, removeMachineAlertModelAssignment, updateAssignmentValueOverride,
      getAssignedMachines, isTriggerGroup, getAllTriggersFlat,
      addMachineModel, addMachine,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}