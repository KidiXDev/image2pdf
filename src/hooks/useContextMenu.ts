import { useState, useEffect, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

export function useContextMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleClose = () => {
      setIsVisible(false);
      setSelectedIndex(null);
    };

    if (isVisible) {
      window.addEventListener('click', handleClose);
      window.addEventListener('scroll', handleClose);
    }

    return () => {
      window.removeEventListener('click', handleClose);
      window.removeEventListener('scroll', handleClose);
    };
  }, [isVisible]);

  const show = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setPosition({ x: e.pageX, y: e.pageY });
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
    show,
    hide,
  };
}
