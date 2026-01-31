import { ChevronDown } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

interface ElementProps {
  element: string;
  value: string;
}

interface DropdownCProps {
  elements: ElementProps[];
  onChange?: (value: string) => void;
  value?: string;
  label?: string;
}

const DropdownC = memo<DropdownCProps>(
  ({ elements, onChange, value, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get the display text for the current value
    const selectedElement =
      elements.find((el) => el.value === value) || elements[0];
    const displayText = selectedElement.element;

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

    const handleSelect = useCallback(
      (selectedValue: string) => {
        setIsOpen(false);
        onChange?.(selectedValue);
      },
      [onChange]
    );

    return (
      <div className="relative" ref={dropdownRef}>
        {label && (
          <label className="block text-xs font-medium text-slate-500 mb-1.5">
            {label}
          </label>
        )}
        <button
          type="button"
          className="w-full flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2.5 text-sm text-slate-700 border border-slate-200 shadow-sm transition-all duration-200 hover:border-slate-300"
          onClick={toggle}
        >
          <span className="truncate">{displayText}</span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown menu with animation */}
        <div
          className={`absolute right-0 left-0 z-20 mt-1.5 rounded-lg bg-white shadow-lg border border-slate-200 overflow-hidden transition-all duration-200 origin-top ${
            isOpen
              ? 'opacity-100 scale-y-100 visible'
              : 'opacity-0 scale-y-95 invisible'
          }`}
        >
          <div className="py-1 max-h-60 overflow-y-auto scrollbar-thin">
            {elements.map((element, idx) => (
              <button
                key={idx}
                className={`w-full text-left px-3 py-2 text-sm transition-colors duration-150 ${
                  value === element.value
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-700 bg-white hover:bg-slate-50'
                }`}
                onClick={() => handleSelect(element.value)}
              >
                {element.element}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

DropdownC.displayName = 'DropdownC';

export default DropdownC;
