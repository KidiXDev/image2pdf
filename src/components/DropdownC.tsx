import { useState } from "react";

interface ElementProps {
  element: string;
  value: string;
}

interface DropdownCProps {
  elements: ElementProps[];
  onChange?: (element: string) => void;
  selectedValue?: string;
}

const DropdownC = ({
  elements,
  onChange,
  selectedValue = elements[0].value,
}: DropdownCProps) => {
  const [placeholderValue, setPlaceholderValue] = useState(elements[0].element);

  const showDropDown = () => {
    document.getElementById("dropdown")!.classList.toggle("hidden");
  };

  return (
    <div className="relative text-left">
      <div className="my-5">
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={showDropDown}
        >
          {placeholderValue}
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <div
          className="absolute right-0 z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          id="dropdown"
        >
          <div className="py-1">
            {elements.map((element) => (
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 w-full"
                role="menuitem"
                onClick={() => {
                  selectedValue = element.value;
                  setPlaceholderValue(element.element);
                  onChange && onChange(element.value);
                  showDropDown();
                }}
              >
                {element.element}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DropdownC;
