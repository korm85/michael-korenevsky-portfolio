import { useState, useRef, useEffect } from 'react';
import svgPathsNew from '@/imports/svg-sadprwxal1';

interface AlertOption {
  value: string;
  label: string;
  definition: string;
}

interface AlertSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: AlertOption[];
  label: string;
}

export function AlertSelect({ value, onChange, options, label }: AlertSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption?.label || '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current && 
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        setHoveredOption(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const handleMouseMove = (e: React.MouseEvent, optionValue: string) => {
    setHoveredOption(optionValue);
    setTooltipPosition({
      top: e.clientY + 10,
      left: e.clientX + 10,
    });
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setHoveredOption(null);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div ref={containerRef} className="relative w-full">
        {/* Label */}
        <div className="flex gap-[4px] items-center">
          <p className="font-['Centra_No2:Book',sans-serif] leading-[12px] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            {label}
          </p>
        </div>
        
        {/* Select Input - Clickable area */}
        <div className="h-[4px] shrink-0" />
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          className="relative w-full text-left outline-none bg-transparent border-none cursor-pointer p-0"
        >
          <div className="h-[16px] relative w-full overflow-hidden">
            <p className="font-['Centra_No2:Medium',sans-serif] leading-[16px] text-[#234057] text-[13.5px] tracking-[0.54px] whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
              {displayText}
            </p>
          </div>
          <div className="h-[7px] shrink-0" />
          <div className="bg-[rgba(35,64,87,0.2)] h-px relative w-full shrink-0">
            <div className="absolute bottom-[9px] right-0 size-[16px] pointer-events-none">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                <path 
                  d={svgPathsNew.p28a52b00} 
                  fill="#234057" 
                />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Dropdown Menu - Fixed positioned overlay */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed z-[1000]"
          style={{
            top: `${dropdownStyle.top}px`,
            left: `${dropdownStyle.left}px`,
            width: `${dropdownStyle.width}px`,
          }}
        >
          <div className="bg-white flex flex-col items-start relative rounded-bl-[3px] rounded-br-[3px]">
            <div aria-hidden="true" className="absolute border border-[rgba(35,64,87,0.1)] border-solid inset-[-0.5px] pointer-events-none rounded-bl-[3.5px] rounded-br-[3.5px] shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]" />
            <div className="h-[8px] w-full shrink-0" />
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(option.value);
                }}
                onMouseMove={(e) => handleMouseMove(e, option.value)}
                onMouseLeave={() => setHoveredOption(null)}
                className={`h-[32px] relative shrink-0 w-full text-left border-none cursor-pointer p-0 transition-colors ${
                  value === option.value ? 'bg-[rgba(59,179,219,0.2)]' : 'bg-transparent hover:bg-[rgba(59,179,219,0.2)]'
                }`}
              >
                <div className="absolute h-[16px] left-[16px] right-[16px] top-[8px]">
                  <p className="absolute font-['Centra_No2:Medium',sans-serif] leading-[16px] left-0 not-italic text-[#234057] text-[13.5px] top-0 tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                    {option.label}
                  </p>
                </div>
              </button>
            ))}
            <div className="h-[8px] w-full shrink-0" />
          </div>
        </div>
      )}

      {/* Tooltip */}
      {hoveredOption && (
        <div
          className="fixed z-[1100] bg-[#234057] text-white rounded-[4px] px-[12px] py-[8px] max-w-[300px] shadow-lg pointer-events-none"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          <p className="font-['Centra_No2:Book',sans-serif] text-[12px] leading-[16px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            {options.find(opt => opt.value === hoveredOption)?.definition}
          </p>
        </div>
      )}
    </>
  );
}
