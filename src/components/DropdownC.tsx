import { useState, useRef, useEffect } from "react";

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

const DropdownC = ({ elements, onChange, label }: DropdownCProps) => {
  const [placeholderValue, setPlaceholderValue] = useState(elements[0].element);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{placeholderValue}</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 left-0 z-20 mt-1.5 rounded-lg bg-white shadow-lg border border-slate-200 overflow-hidden">
          <div className="py-1 max-h-60 overflow-y-auto scrollbar-thin">
            {elements.map((element, idx) => (
              <button
                key={idx}
                className={`w-full text-left px-3 py-2 text-sm transition-smooth ${
                  placeholderValue === element.element
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-700 bg-white"
                }`}
                onClick={() => {
                  setPlaceholderValue(element.element);
                  onChange?.(element.value);
                  setIsOpen(false);
                }}
              >
                {element.element}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownC;
