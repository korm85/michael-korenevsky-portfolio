import { useState, useRef, useEffect } from 'react';
import svgPathsNew from '@/imports/svg-sadprwxal1';
import { Tooltip } from './Tooltip';

interface Option {
  value: string;
  label: string;
  tooltip?: string;
}

interface SingleSelectProps {
  value: string;
  onChange: (value: string) => void;
  multiple?: false;
  options: Option[];
  placeholder?: string;
  icon?: 'caret' | 'text-caret';
  label: string;
  required?: boolean;
  labelTooltip?: string;
}

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  multiple: true;
  options: Option[];
  placeholder?: string;
  icon?: 'caret' | 'text-caret';
  label: string;
  required?: boolean;
  labelTooltip?: string;
}

type CustomSelectProps = SingleSelectProps | MultiSelectProps;

export function CustomSelect(props: CustomSelectProps) {
  const { options, placeholder = '', icon = 'caret', label, required = false, multiple, labelTooltip } = props;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  const isMulti = multiple === true;
  const multiValue = isMulti ? (props as MultiSelectProps).value : [];
  const singleValue = !isMulti ? (props as SingleSelectProps).value : '';

  const selectedOption = !isMulti ? options.find(opt => opt.value === singleValue) : null;
  const displayText = !isMulti ? (selectedOption?.label || placeholder) : (multiValue.length === 0 ? placeholder : '');

  // If "all" is selected, only show "all" chip
  const selectedMultiOptions = isMulti 
    ? multiValue.includes('all')
      ? options.filter(opt => opt.value === 'all')
      : options.filter(opt => multiValue.includes(opt.value))
    : [];

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

  const handleSelect = (optionValue: string) => {
    if (isMulti) {
      const multiOnChange = (props as MultiSelectProps).onChange;
      if (multiValue.includes(optionValue)) {
        multiOnChange(multiValue.filter(v => v !== optionValue));
      } else {
        multiOnChange([...multiValue, optionValue]);
      }
    } else {
      (props as SingleSelectProps).onChange(optionValue);
      setIsOpen(false);
    }
  };

  const handleRemoveChip = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMulti) {
      (props as MultiSelectProps).onChange(multiValue.filter(v => v !== optionValue));
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div ref={containerRef} className="relative w-full">
        {/* Label */}
        <div className="flex gap-[4px] items-center h-[12px]">
          <p className="font-['Centra_No2:Book',sans-serif] leading-[12px] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            {label}
          </p>
          {required && <p className="font-['Centra_No2:Book',sans-serif] leading-[12px] text-[#59747a] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
            *
          </p>}
          {labelTooltip && (
            <Tooltip content={labelTooltip}>
              <span className="inline-flex items-center justify-center cursor-help leading-[0]">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="7" cy="7" r="6" stroke="#59747a" strokeWidth="1.2" />
                  <text x="7" y="10.5" textAnchor="middle" fill="#59747a" fontSize="9" fontFamily="'Centra No2:Medium', sans-serif">i</text>
                </svg>
              </span>
            </Tooltip>
          )}
        </div>
        
        {/* Select Input - Clickable area */}
        <div className="h-[4px] shrink-0" />
        <div
          ref={buttonRef}
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggle(); }}
          className="relative w-full text-left outline-none bg-transparent border-none cursor-pointer p-0"
        >
          {isMulti && selectedMultiOptions.length > 0 ? (
            <div className="flex flex-wrap gap-[4px] min-h-[16px] pr-[20px]">
              {selectedMultiOptions.map(opt => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-[4px] bg-[rgba(35,64,87,0.08)] rounded-[3px] px-[8px] py-[2px]"
                >
                  <span className="font-['Centra_No2:Medium',sans-serif] leading-[14px] text-[#234057] text-[12px] tracking-[0.24px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                    {opt.label}
                  </span>
                  <span
                    role="button"
                    onClick={(e) => handleRemoveChip(opt.value, e)}
                    className="cursor-pointer flex items-center justify-center hover:opacity-70 transition-opacity"
                  >
                    <svg className="block size-[10px]" fill="none" viewBox="0 0 10 10">
                      <path d="M7.5 2.5L2.5 7.5M2.5 2.5l5 5" stroke="#234057" strokeWidth="1.25" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <div className="h-[16px] relative w-full overflow-hidden">
              <p className="font-['Centra_No2:Medium',sans-serif] leading-[16px] text-[#234057] text-[13.5px] tracking-[0.54px] whitespace-nowrap overflow-hidden text-ellipsis pr-[20px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                {displayText}
              </p>
            </div>
          )}
          <div className="h-[7px] shrink-0" />
          <div className="bg-[rgba(35,64,87,0.2)] h-px relative w-full shrink-0">
            <div className="absolute bottom-[9px] right-0 size-[16px] pointer-events-none">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                <path 
                  d={icon === 'caret' ? svgPathsNew.p28a52b00 : svgPathsNew.pe51600} 
                  fill="#234057" 
                />
              </svg>
            </div>
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
              const isSelected = isMulti ? multiValue.includes(option.value) : singleValue === option.value;
              const optionContent = (
                <button
                  key={option.value}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(option.value);
                  }}
                  className={`relative shrink-0 w-full text-left border-none cursor-pointer p-0 transition-colors ${
                    isSelected ? 'bg-[rgba(59,179,219,0.2)]' : 'bg-transparent hover:bg-[rgba(59,179,219,0.2)]'
                  }`}
                >
                  <div className="px-[16px] py-[8px]">
                    <p className="font-['Centra_No2:Medium',sans-serif] leading-[16px] not-italic text-[#234057] text-[13.5px] tracking-[0.54px]" style={{ fontFeatureSettings: "'lnum', 'tnum'" }}>
                      {option.label}
                    </p>
                  </div>
                </button>
              );

              if (option.tooltip) {
                return (
                  <Tooltip key={option.value} content={option.tooltip}>
                    {optionContent}
                  </Tooltip>
                );
              }

              return optionContent;
            })}
            <div className="h-[8px] w-full shrink-0" />
          </div>
        </div>
      )}
    </>
  );
}