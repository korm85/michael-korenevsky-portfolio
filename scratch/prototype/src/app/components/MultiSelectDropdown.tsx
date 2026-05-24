import { useState, useRef, useEffect } from 'react';
import svgPaths from '@/imports/svg-e1d31boc37';
import svgPathsNew from '@/imports/svg-sadprwxal1';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  selectedValues: string[];
  onToggle: (value: string) => void;
  onRemove: (value: string) => void;
  options: Option[];
  label: string;
  required?: boolean;
}

export function MultiSelectDropdown({ selectedValues, onToggle, onRemove, options, label, required }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

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

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div ref={containerRef} className="relative w-full">
        {/* Label */}
        <div className="flex gap-[4px] items-center w-full">
          <p className="font-['Centra_No2:Book',sans-serif] leading-[12px] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            {label}
          </p>
          {required && (
            <p className="font-['Centra_No2:Book',sans-serif] leading-[12px] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
              *
            </p>
          )}
        </div>
        <div className="h-[4px] w-full shrink-0" />

        {/* Selected Tags Display */}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          className="h-[16px] w-full overflow-hidden text-left cursor-pointer bg-transparent border-none p-0 outline-none"
        >
          <div className="flex flex-wrap gap-[4px] items-start w-full">
            {selectedValues.map(model => {
              const modelData = options.find(m => m.value === model);
              return (
                <div key={model} className="bg-[rgba(35,64,87,0.05)] flex items-center pl-[5px] pr-[3px] py-[3px] rounded-[2px]">
                  <div className="flex gap-[3px] items-end px-[0px] py-[1px] mx-[0px] my-[2px]">
                    <p className="font-['Centra_No2:Medium',sans-serif] leading-[16px] text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                      {modelData?.label}
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(model);
                      }} 
                      className="size-[12px]"
                    >
                      <svg className="block size-full" fill="none" viewBox="0 0 12 12">
                        <path d={svgPaths.p3600be00} fill="#234057" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </button>

        
        <div className="bg-[rgba(35,64,87,0.2)] h-px relative w-full shrink-0">
          <div className="absolute bottom-[9px] right-0 size-[16px] pointer-events-none">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d={svgPathsNew.pe51600} fill="#234057" />
            </svg>
          </div>
          <div className="absolute bottom-[9px] right-[24px] size-[16px] pointer-events-none">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d={svgPathsNew.p3fd8c900} fill="#234057" />
            </svg>
          </div>
        </div>
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
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onToggle(option.value);
                  }}
                  className={`h-[32px] relative shrink-0 w-full text-left border-none cursor-pointer p-0 transition-colors ${
                    isSelected ? 'bg-[rgba(59,179,219,0.2)]' : 'bg-transparent hover:bg-[rgba(59,179,219,0.2)]'
                  }`}
                >
                  <div className="absolute h-[16px] left-[16px] right-[16px] top-[8px]">
                    <p className="absolute font-['Centra_No2:Medium',sans-serif] leading-[16px] left-0 not-italic text-[#234057] text-[13.5px] top-0 tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                      {option.label}
                    </p>
                  </div>
                </button>
              );
            })}
            <div className="h-[8px] w-full shrink-0" />
          </div>
        </div>
      )}
    </>
  );
}
