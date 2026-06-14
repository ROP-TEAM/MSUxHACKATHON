import { useEffect, useRef } from "react";

export function useClickOutSide<T extends HTMLElement>(callback: () => void) {
  const ref = useRef<T>(null);
  const mounted = useRef(false);

  useEffect(() => {
    // skip mousedown event ที่ทำให้ modal เปิดขึ้นมา (same event loop)
    const timer = setTimeout(() => {
      mounted.current = true;
    }, 0);

    function handleClick(e: MouseEvent) {
      if (!mounted.current) return;
      if (ref.current && !ref.current.contains(e.target as Node)) {
        // Ignore clicks inside Mantine popovers/portals (Select dropdown, etc.)
        const target = e.target as HTMLElement;
        if (target.closest("[data-portal]")) return;
        callback();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => {
      clearTimeout(timer);
      mounted.current = false;
      document.removeEventListener("mousedown", handleClick);
    };
  }, [callback]);

  return ref;
}