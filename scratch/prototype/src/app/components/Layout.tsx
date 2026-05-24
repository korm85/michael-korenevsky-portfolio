import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router';

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 6.5L8 1L15 6.5V15H10.5V10.5H5.5V15H1V6.5Z" fill="currentColor" fillOpacity="0.85" />
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.4" />
      <path d="M8 4.5V8.5L10.5 10" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L8 9" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 11.5V12.5" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 14L8 2L13 14H3Z" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
function AnalyzeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="9" width="3" height="5" rx="0.5" fill="currentColor" fillOpacity="0.7" />
      <rect x="6.5" y="5" width="3" height="9" rx="0.5" fill="currentColor" fillOpacity="0.7" />
      <rect x="12" y="2" width="3" height="12" rx="0.5" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}
function ConfigureIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6.5 1.5H9.5V3.2C10.1 3.4 10.65 3.72 11.1 4.13L12.6 3.28L14.1 5.93L12.6 6.78C12.67 7.01 12.7 7.25 12.7 7.5C12.7 7.75 12.67 7.99 12.6 8.22L14.1 9.07L12.6 11.72L11.1 10.87C10.65 11.28 10.1 11.6 9.5 11.8V13.5H6.5V11.8C5.9 11.6 5.35 11.28 4.9 10.87L3.4 11.72L1.9 9.07L3.4 8.22C3.33 7.99 3.3 7.75 3.3 7.5C3.3 7.25 3.33 7.01 3.4 6.78L1.9 5.93L3.4 3.28L4.9 4.13C5.35 3.72 5.9 3.4 6.5 3.2V1.5ZM8 9.5C9.1 9.5 10 8.6 10 7.5C10 6.4 9.1 5.5 8 5.5C6.9 5.5 6 6.4 6 7.5C6 8.6 6.9 9.5 8 9.5Z" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}
function AlertModelsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 2.5h12M1 7h8M1 11.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function MachineModelsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="3" y="3" width="3.5" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.6" />
      <rect x="7.5" y="3" width="3.5" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.6" />
      <rect x="3" y="7.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.6" />
      <rect x="7.5" y="7.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}
function MachinesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="1" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 11v2M10 11v2M4 13h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="7" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function PinIcon({ pinned }: { pinned: boolean }) {
  return pinned ? (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 1L9 1M7 1V5M4 5h6l1 3H3L4 5ZM5.5 8v4M8.5 8v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 1L9 1M7 1V5M4 5h6l1 3H3L4 5ZM7 8v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M3.5 2L6.5 5L3.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Nav Tooltip ──────────────────────────────────────────────────────────────

function NavTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute left-[52px] top-1/2 -translate-y-1/2 z-[200] pointer-events-none">
          <div className="bg-[#1c3144] border border-white/10 text-white text-[12px] tracking-[0.24px] font-['Centra_No2:Medium',sans-serif] px-[10px] py-[5px] rounded-[3px] whitespace-nowrap shadow-lg">
            {label}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Configure Sub-tabs ───────────────────────────────────────────────────────

const CONFIGURE_TABS = [
  { label: 'Alert Models', path: '/alert-models' },
  { label: 'Machine Models', path: '/machine-models' },
  { label: 'Machines', path: '/machines' },
];

const CONFIGURE_PATHS = ['/alert-models', '/machine-models', '/machines'];
const CREATE_PATHS = ['/create', '/edit'];

// ─── Layout ───────────────────────────────────────────────────────────────────

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [configureExpanded, setConfigureExpanded] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isConfigurePage = CONFIGURE_PATHS.some(p => location.pathname.startsWith(p));
  const isCreatePage = CREATE_PATHS.some(p => location.pathname.includes(p));
  const showConfigureTabs = isConfigurePage && !isCreatePage;
  const isConfigure = CONFIGURE_PATHS.some(p => location.pathname.startsWith(p));

  // Close on outside click when not pinned
  useEffect(() => {
    if (!isOpen || isPinned) return;
    const handler = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, isPinned]);

  const handleNavClick = () => {
    if (!isPinned) setIsOpen(false);
  };

  const togglePin = () => {
    if (isPinned) {
      setIsPinned(false);
      setIsOpen(false);
    } else {
      setIsPinned(true);
      setIsOpen(true);
    }
  };

  const expanded = isOpen || isPinned;

  return (
    <div className="flex min-h-screen bg-[#f8f7f6]">

      {/* ── Sidebar ── */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#1c3144] transition-all duration-200 ease-in-out overflow-hidden ${expanded ? 'w-[220px]' : 'w-[48px]'}`}
      >
        {/* Logo */}
        <div className="flex items-center h-[48px] shrink-0 px-[13px]">
          <div className="w-[22px] h-[20px] shrink-0 flex items-center justify-center">
            <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
              <path d="M11 0L22 10L11 20L0 10L11 0Z" fill="white" fillOpacity="0.8" />
            </svg>
          </div>
          {expanded && (
            <span className="ml-[10px] font-['Centra_No2:Bold',sans-serif] text-white text-[13px] tracking-[0.8px] uppercase opacity-70 whitespace-nowrap">
              AMVero
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mx-3 shrink-0" />

        {/* Nav Items */}
        <div className="flex flex-col flex-1 py-[8px] gap-[2px] overflow-y-auto overflow-x-hidden">

          {/* Dashboard */}
          {expanded ? (
            <NavLink
              to="/dashboard"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-[10px] h-[40px] px-[14px] rounded-[3px] mx-[6px] transition-colors ${isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`
              }
            >
              <HomeIcon />
              <span className="font-['Centra_No2:Medium',sans-serif] text-[13px] tracking-[0.26px] whitespace-nowrap">Dashboard</span>
            </NavLink>
          ) : (
            <NavTooltip label="Dashboard">
              <NavLink
                to="/dashboard"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center justify-center h-[40px] w-full rounded-[3px] mx-0 transition-colors ${isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`
                }
              >
                <HomeIcon />
              </NavLink>
            </NavTooltip>
          )}

          {/* Divider */}
          <div className="h-px bg-white/10 mx-3 my-[4px] shrink-0" />

          {/* Configure Section */}
          {expanded ? (
            <>
              {/* Configure header */}
              <button
                onClick={() => setConfigureExpanded(p => !p)}
                className={`flex items-center gap-[10px] h-[40px] px-[14px] rounded-[3px] mx-[6px] transition-colors w-[calc(100%-12px)] ${isConfigure ? 'text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
              >
                <ConfigureIcon />
                <span className="font-['Centra_No2:Medium',sans-serif] text-[13px] tracking-[0.26px] whitespace-nowrap flex-1 text-left">Configure</span>
                <span className="text-white/40">
                  {configureExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </span>
              </button>

              {/* Sub-items */}
              {configureExpanded && (
                <div className="flex flex-col gap-[1px] pl-[28px] pr-[6px]">
                  <NavLink
                    to="/alert-models"
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-[8px] h-[34px] px-[10px] rounded-[3px] transition-colors ${isActive ? 'bg-white/12 text-white' : 'text-white/50 hover:bg-white/08 hover:text-white/80'}`
                    }
                  >
                    <AlertModelsIcon />
                    <span className="font-['Centra_No2:Book',sans-serif] text-[12px] tracking-[0.24px] whitespace-nowrap">Alert Models</span>
                  </NavLink>
                  <NavLink
                    to="/machine-models"
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-[8px] h-[34px] px-[10px] rounded-[3px] transition-colors ${isActive ? 'bg-white/12 text-white' : 'text-white/50 hover:bg-white/08 hover:text-white/80'}`
                    }
                  >
                    <MachineModelsIcon />
                    <span className="font-['Centra_No2:Book',sans-serif] text-[12px] tracking-[0.24px] whitespace-nowrap">Machine Models</span>
                  </NavLink>
                  <NavLink
                    to="/machines"
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-[8px] h-[34px] px-[10px] rounded-[3px] transition-colors ${isActive ? 'bg-white/12 text-white' : 'text-white/50 hover:bg-white/08 hover:text-white/80'}`
                    }
                  >
                    <MachinesIcon />
                    <span className="font-['Centra_No2:Book',sans-serif] text-[12px] tracking-[0.24px] whitespace-nowrap">Machines</span>
                  </NavLink>
                </div>
              )}
            </>
          ) : (
            <NavTooltip label="Configure">
              <button
                onClick={() => {
                  if (!isConfigure) navigate('/alert-models');
                  setIsOpen(true);
                }}
                className={`flex items-center justify-center h-[40px] w-full rounded-[3px] transition-colors ${isConfigure ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
              >
                <ConfigureIcon />
              </button>
            </NavTooltip>
          )}
        </div>

        {/* Bottom: Pin / Expand */}
        <div className="shrink-0 border-t border-white/10 px-[6px] py-[8px] flex flex-col gap-[4px]">
          {/* Pin button */}
          <button
            onClick={togglePin}
            title={isPinned ? 'Unpin sidebar' : 'Pin sidebar open'}
            className={`flex items-center h-[36px] rounded-[3px] transition-colors ${isPinned ? 'bg-white/15 text-white' : 'text-white/40 hover:bg-white/10 hover:text-white/70'} ${expanded ? 'gap-[10px] px-[8px] w-full' : 'justify-center w-full'}`}
          >
            <PinIcon pinned={isPinned} />
            {expanded && <span className="font-['Centra_No2:Book',sans-serif] text-[12px] tracking-[0.24px] whitespace-nowrap">{isPinned ? 'Pinned' : 'Pin sidebar'}</span>}
          </button>

          {/* Expand/collapse hamburger (only when not pinned) */}
          {!isPinned && (
            <button
              onClick={() => setIsOpen(p => !p)}
              className={`flex items-center h-[36px] rounded-[3px] transition-colors text-white/40 hover:bg-white/10 hover:text-white/70 ${expanded ? 'gap-[10px] px-[8px] w-full' : 'justify-center w-full'}`}
            >
              <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                <path d="M1 1H14M1 5.5H10M1 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {expanded && <span className="font-['Centra_No2:Book',sans-serif] text-[12px] tracking-[0.24px] whitespace-nowrap">Collapse</span>}
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 ml-[48px] flex flex-col min-h-screen">
        {/* Configure sub-nav */}
        {showConfigureTabs && (
          <div className="border-b border-[rgba(35,64,87,0.1)] bg-white px-8 py-0 flex items-center gap-0 shrink-0">
            {CONFIGURE_TABS.map(tab => {
              const active = location.pathname.startsWith(tab.path);
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className={`px-5 py-4 font-['Centra_No2:Medium',sans-serif] text-[13.5px] tracking-[0.54px] border-b-[2px] transition-colors ${
                    active ? 'text-[#234057] border-[#6d74f3]' : 'text-[#59747a] border-transparent hover:text-[#234057]'
                  }`}
                  style={{ fontFeatureSettings: "'lnum', 'tnum'" }}
                >
                  {tab.label}
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}