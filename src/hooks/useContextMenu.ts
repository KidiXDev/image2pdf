import { useCallback, useEffect, useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

const MENU_WIDTH = 208;
const MENU_HEIGHT = 140;

export function useContextMenu() {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const hide = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setIsRendered(false);
      setSelectedIndex(null);
    }, 200);
  }, []);

  useEffect(() => {
    const handleClose = () => {
      if (isVisible) {
        hide();
      }
    };

    if (isRendered) {
      window.addEventListener('click', handleClose);
      window.addEventListener('scroll', handleClose);
      window.addEventListener('resize', handleClose);
    }

    return () => {
      window.removeEventListener('click', handleClose);
      window.removeEventListener('scroll', handleClose);
      window.removeEventListener('resize', handleClose);
    };
  }, [isRendered, isVisible, hide]);

  const show = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    let x = e.clientX;
    let y = e.clientY;

    if (x + MENU_WIDTH > window.innerWidth) {
      x = window.innerWidth - MENU_WIDTH - 8;
    }

    if (y + MENU_HEIGHT > window.innerHeight) {
      y = window.innerHeight - MENU_HEIGHT - 8;
    }
    x = Math.max(8, x);
    y = Math.max(8, y);

    setPosition({ x, y });
    setSelectedIndex(index);
    setIsRendered(true);

    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  return {
    isRendered,
    isVisible,
    position,
    selectedIndex,
    menuRef,
    show,
    hide
  };
}
