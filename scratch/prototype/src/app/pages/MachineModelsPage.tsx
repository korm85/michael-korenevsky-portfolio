import { useNavigate } from 'react-router';
import { useAppContext } from '../context/AppContext';

export function MachineModelsPage() {
  const { machineModels, alertModels, machines } = useAppContext();
  const navigate = useNavigate();

  const getAlertModelsForModel = (machineModelId: string) =>
    alertModels.filter(am => am.scopeMachineModel === machineModelId);

  const getMachineCount = (machineModelId: string) =>
    machines.filter(m => m.machineModelId === machineModelId).length;

  const COLS = [
    { label: '', w: 'w-[40px]' },
    { label: 'Name', w: 'flex-1' },
    { label: 'Type', w: 'w-[160px]' },
    { label: 'Manufacturer', w: 'w-[150px]' },
    { label: 'Machines', w: 'w-[100px]' },
    { label: 'Alert Models', w: 'w-[160px]' },
    { label: 'Last Modified', w: 'w-[140px]' },
    { label: 'Last Modified By', w: 'w-[150px]' },
  ];

  return (
    <div className="px-8 py-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[12px] tracking-[0.24px] mb-1">Configure</p>
          <h1 className="font-['Centra_No2:Bold',sans-serif] text-[#234057] text-[20px] tracking-[0.4px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            Machine Models
          </h1>
        </div>
        <button className="relative rounded-[3px]" onClick={() => navigate('/machine-models/create')}>
          <div className="flex items-center gap-[8px] px-[16px] py-[10px]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1V15M1 8H15" stroke="#234057" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
              Create Machine Model
            </p>
          </div>
          <div aria-hidden className="absolute border border-[rgba(35,64,87,0.2)] inset-0 rounded-[3px] pointer-events-none" />
        </button>
      </div>

      {/* Info callout */}
      <div className="bg-[rgba(35,64,87,0.04)] rounded-[4px] border border-[rgba(35,64,87,0.1)] px-[16px] py-[10px] mb-6 flex items-start gap-[8px]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[1px]">
          <circle cx="8" cy="8" r="6.5" stroke="#59747a" strokeWidth="1.2" />
          <path d="M8 7V11M8 5.5V5" stroke="#59747a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[13.5px] tracking-[0.27px] leading-[20px]">
          Alert Models can target a Machine Model in their <strong className="font-['Centra_No2:Medium',sans-serif]">Data Scope</strong> — all machines of that model will automatically inherit the assignment.
          Alert model assignment per machine is managed in the <button onClick={() => navigate('/machines')} className="font-['Centra_No2:Medium',sans-serif] text-[#6d74f3] hover:underline">Machines</button> list.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[3px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div className="flex items-center border-b border-[#d3d9dd]">
          {COLS.map(col => (
            <div key={col.label} className={`${col.w} h-[32px] flex items-center pl-[12px] shrink-0`}>
              <span className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                {col.label}
              </span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {machineModels.map((mm, idx) => {
          const alertModelsForModel = getAlertModelsForModel(mm.id);
          const machineCount = getMachineCount(mm.id);

          return (
            <div
              key={mm.id}
              className={`flex items-center min-h-[48px] border-b border-[#d3d9dd] last:border-b-0 hover:bg-[rgba(35,64,87,0.02)] transition-colors ${idx % 2 === 0 ? '' : 'bg-[rgba(35,64,87,0.01)]'}`}
            >
              {/* Checkbox */}
              <div className="w-[40px] flex items-center pl-[12px] py-[12px] shrink-0">
                <div className="w-[14px] h-[14px] border border-[rgba(35,64,87,0.2)] rounded-[2px]" />
              </div>

              {/* Name */}
              <div className="flex-1 pl-[12px] py-[12px]">
                <p className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                  {mm.name}
                </p>
              </div>

              {/* Type */}
              <div className="w-[160px] pl-[12px] py-[12px] shrink-0">
                <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                  {mm.type}
                </p>
              </div>

              {/* Manufacturer */}
              <div className="w-[150px] pl-[12px] py-[12px] shrink-0">
                <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                  {mm.manufacturer}
                </p>
              </div>

              {/* Machines count */}
              <div className="w-[100px] pl-[12px] py-[12px] shrink-0">
                <button
                  onClick={() => navigate('/machines')}
                  className="font-['Centra_No2:Medium',sans-serif] text-[#234057] text-[13.5px] tracking-[0.54px] hover:text-[#6d74f3] transition-colors"
                  style={{ fontFeatureSettings: "'lnum', 'tnum'" }}
                  title="View machines"
                >
                  {machineCount}
                </button>
              </div>

              {/* Alert Models */}
              <div className="w-[160px] pl-[12px] py-[12px] shrink-0">
                {alertModelsForModel.length > 0 ? (
                  <div className="flex flex-col gap-[3px]">
                    {alertModelsForModel.slice(0, 2).map(am => (
                      <button
                        key={am.id}
                        onClick={() => navigate(`/alert-models/${am.id}/edit`)}
                        className="text-left"
                      >
                        <span className="inline-flex items-center gap-[4px] px-[6px] py-[1px] bg-[rgba(109,116,243,0.1)] rounded-[3px] hover:bg-[rgba(109,116,243,0.2)] transition-colors">
                          <span className="font-['Centra_No2:Medium',sans-serif] text-[#6d74f3] text-[11px] tracking-[0.22px] whitespace-nowrap" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                            {am.name.length > 18 ? `${am.name.slice(0, 18)}…` : am.name}
                          </span>
                        </span>
                      </button>
                    ))}
                    {alertModelsForModel.length > 2 && (
                      <span className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[11px] tracking-[0.22px]">
                        +{alertModelsForModel.length - 2} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="font-['Centra_No2:Book',sans-serif] text-[#a8b7bf] text-[12px] tracking-[0.24px]">—</p>
                )}
              </div>

              {/* Last Modified */}
              <div className="w-[140px] pl-[12px] py-[12px] shrink-0">
                <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                  {mm.lastModified}
                </p>
              </div>

              {/* Last Modified By */}
              <div className="w-[150px] pl-[12px] py-[12px] shrink-0">
                <p className="font-['Centra_No2:Book',sans-serif] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                  {mm.lastModifiedBy}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
