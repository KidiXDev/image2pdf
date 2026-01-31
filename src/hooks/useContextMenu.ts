import { useState, useEffect, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

export function useContextMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClose = () => {
      setIsVisible(false);
      setSelectedIndex(null);
    };

    if (isVisible) {
      // Use capture phase to close before other click handlers
      window.addEventListener('click', handleClose, true);
      window.addEventListener('scroll', handleClose);
      window.addEventListener('resize', handleClose);
    }

    return () => {
      window.removeEventListener('click', handleClose, true);
      window.removeEventListener('scroll', handleClose);
      window.removeEventListener('resize', handleClose);
    };
  }, [isVisible]);

  const show = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use clientX/clientY for viewport-relative positioning
    const menuWidth = 208; // w-52 = 13rem = 208px
    const menuHeight = 140; // approximate height
    
    // Calculate position, ensuring menu stays within viewport
    let x = e.clientX;
    let y = e.clientY;
    
    // Adjust if menu would overflow right edge
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 8;
    }
    
    // Adjust if menu would overflow bottom edge
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 8;
    }
    
    // Ensure menu doesn't go off left or top edge
    x = Math.max(8, x);
    y = Math.max(8, y);
    
    setPosition({ x, y });
    setSelectedIndex(index);
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
    setSelectedIndex(null);
  }, []);

  return {
    isVisible,
    position,
    selectedIndex,
    menuRef,
    show,
    hide,
  };
}
