import { memo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDropdown } from '../hooks/useDropdown';

interface ElementProps {
  element: string;
  value: string;
}

interface DropdownCProps {
  elements: ElementProps[];
  onChange?: (element: string) => void;
  selectedValue?: string;
  label?: string;
}

const DropdownC = memo<DropdownCProps>(({ elements, onChange, label }) => {
  const { isOpen, selectedValue, dropdownRef, toggle, select } = useDropdown(
    elements[0].element,
    { onSelect: onChange }
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
        className="w-full flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2.5 text-sm text-slate-700 border border-slate-200 shadow-sm transition-smooth"
        onClick={toggle}
      >
        <span className="truncate">{selectedValue}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 left-0 z-20 mt-1.5 rounded-lg bg-white shadow-lg border border-slate-200 overflow-hidden">
          <div className="py-1 max-h-60 overflow-y-auto scrollbar-thin">
            {elements.map((element, idx) => (
              <button
                key={idx}
                className={`w-full text-left px-3 py-2 text-sm transition-smooth ${
                  selectedValue === element.element
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-700 bg-white'
                }`}
                onClick={() => select(element.value, element.element)}
              >
                {element.element}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

DropdownC.displayName = 'DropdownC';

export default DropdownC;
