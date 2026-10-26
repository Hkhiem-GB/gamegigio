import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  subLabel?: string;
  badge?: string | number;
  indicatorColor?: string;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
  menuWidthClass?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  icon,
  className = '',
  menuWidthClass = 'w-full min-w-[220px]',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      setIsOpen(false);
    },
    [onChange]
  );

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#10090B] border text-sm text-[#F5F1EC] transition-all duration-200 flex items-center justify-between gap-2.5 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#E61C39] ${
          isOpen
            ? 'border-[#E61C39] shadow-[0_0_12px_rgba(230,28,57,0.3)] bg-[#190B0F]'
            : 'border-[#3B2027] hover:border-[#5C2833] hover:bg-[#190B0F]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-[#A8A0A3] flex-shrink-0">{icon}</span>}
          {selectedOption?.indicatorColor && (
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: selectedOption.indicatorColor,
                boxShadow: `0 0 6px ${selectedOption.indicatorColor}`,
              }}
            />
          )}
          <span className="truncate font-medium text-xs sm:text-sm text-[#F5F1EC]">
            {selectedOption?.label}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#A8A0A3] flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#FF4359]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={label}
          className={`absolute left-0 top-full mt-2 z-50 ${menuWidthClass} max-h-72 overflow-y-auto rounded-xl bg-[#190B0F] border border-[#3B2027] shadow-2xl shadow-black/95 backdrop-blur-xl p-1.5 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150`}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#3B2027 #10090B',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`w-full px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center justify-between gap-2.5 transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[#E61C39]/15 text-[#FF4359] font-bold border-l-2 border-[#E61C39]'
                    : 'text-[#A8A0A3] hover:text-[#F5F1EC] hover:bg-[#2C141B]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {opt.indicatorColor && (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: opt.indicatorColor,
                        boxShadow: isSelected ? `0 0 6px ${opt.indicatorColor}` : undefined,
                      }}
                    />
                  )}
                  {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
                  <div className="truncate">
                    <span className="truncate">{opt.label}</span>
                    {opt.subLabel && (
                      <span className="block text-[11px] text-[#756D70] font-normal truncate">
                        {opt.subLabel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {opt.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#E61C39]/20 text-[#FF4359]'
                          : 'bg-[#211014] text-[#756D70] border border-[#3B2027]'
                      }`}
                    >
                      {opt.badge}
                    </span>
                  )}
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#E61C39]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
