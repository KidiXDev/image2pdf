import { useState, useEffect, useCallback, useRef } from "react";

interface Position {
  x: number;
  y: number;
}

// Menu dimensions - should match ContextMenu component's Tailwind classes (w-52 = 13rem = 208px)
const MENU_WIDTH = 208;
const MENU_HEIGHT = 140; // Approximate height based on 3 menu items

export function useContextMenu() {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const hide = useCallback(() => {
    setIsVisible(false);
    // Wait for animation to finish before unmounting
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
      window.addEventListener("click", handleClose);
      window.addEventListener("scroll", handleClose);
      window.addEventListener("resize", handleClose);
    }

    return () => {
      window.removeEventListener("click", handleClose);
      window.removeEventListener("scroll", handleClose);
      window.removeEventListener("resize", handleClose);
    };
  }, [isRendered, isVisible, hide]);

  const show = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    // Use clientX/clientY for viewport-relative positioning
    let x = e.clientX;
    let y = e.clientY;

    // Adjust if menu would overflow right edge
    if (x + MENU_WIDTH > window.innerWidth) {
      x = window.innerWidth - MENU_WIDTH - 8;
    }

    // Adjust if menu would overflow bottom edge
    if (y + MENU_HEIGHT > window.innerHeight) {
      y = window.innerHeight - MENU_HEIGHT - 8;
    }

    // Ensure menu doesn't go off left or top edge
    x = Math.max(8, x);
    y = Math.max(8, y);

    setPosition({ x, y });
    setSelectedIndex(index);
    setIsRendered(true);

    // Small delay to allow mount before triggering animation
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
    hide,
  };
}
