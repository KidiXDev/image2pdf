import { useState, useRef, useEffect, useCallback } from 'react';

interface UseDropdownOptions {
  onSelect?: (value: string) => void;
}

export function useDropdown(initialValue: string, options?: UseDropdownOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(options?.onSelect);
  
  // Keep the ref updated with the latest onSelect callback
  useEffect(() => {
    onSelectRef.current = options?.onSelect;
  }, [options?.onSelect]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  
  const close = useCallback(() => setIsOpen(false), []);
  
  const open = useCallback(() => setIsOpen(true), []);

  const select = useCallback((value: string, displayValue: string) => {
    setSelectedValue(displayValue);
    setIsOpen(false);
    onSelectRef.current?.(value);
  }, []);

  return {
    isOpen,
    selectedValue,
    dropdownRef,
    toggle,
    close,
    open,
    select,
  };
}
