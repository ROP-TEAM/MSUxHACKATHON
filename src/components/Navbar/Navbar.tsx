"use client";

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import styles from "./Navbar.module.scss";

type NavKey = "home" | "concerts" | "all-events" | "my-tickets" | "overview" | "contact";

type NavLink = {
  key: NavKey;
  label: string;
  href: string;
};

type NavDropdown = {
  key: NavKey;
  label: string;
  children: NavLink[];
};

type NavItem = NavLink | NavDropdown;

type Props = {
  onAiToggle: () => void;
  aiOpen: boolean;
  activeKey?: NavKey;
};

function isDropdown(item: NavItem): item is NavDropdown {
  return "children" in item;
}

const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "หน้าแรก", href: "/home" },
  {
    key: "concerts",
    label: "คอนเสิร์ต",
    children: [
      { key: "all-events", label: "งานทั้งหมด", href: "/events" },
      { key: "my-tickets", label: "ตั๋วของฉัน", href: "/tickets" },
    ],
  },
  { key: "overview", label: "ภาพรวม", href: "/overview" },
  { key: "contact", label: "ติดต่อเรา", href: "/contact" },
];

export default function Navbar({ onAiToggle, aiOpen, activeKey = "home" }: Props) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<NavKey | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null);
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const centerRef = useRef<HTMLDivElement>(null);

  const setDropdownRef = useCallback(
    (key: string) => (el: HTMLDivElement | null) => {
      if (el) dropdownRefs.current.set(key, el);
      else dropdownRefs.current.delete(key);
    },
    []
  );

  function closeDropdown() {
    setActiveDropdown(null);
  }

  function handleClickOutside(e: MouseEvent) {
    const anyInside = Array.from(dropdownRefs.current.values()).some(
      (el) => el.contains(e.target as Node)
    );
    if (!anyInside) closeDropdown();
  }

  // Attach outside-click listener once
  const outsideClickRef = useRef<boolean>(false);
  if (!outsideClickRef.current) {
    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
    }
    outsideClickRef.current = true;
  }

  function handleDropdownKeyDown(e: React.KeyboardEvent, key: string) {
    if (e.key === "Escape") {
      closeDropdown();
      const trigger = document.getElementById(`nav-trigger-${key}`);
      trigger?.focus();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const firstItem = document.getElementById(`dropdown-item-${key}-0`);
      firstItem?.focus();
    }
  }

  // --- Sliding indicator ---
  const indicatorTarget = hoveredKey || activeKey;

  function measureIndicator(key: string | null) {
    if (!key || !centerRef.current) return;
    const parent = centerRef.current;
    const textEl = parent.querySelector(`[data-text-el="${key}"]`) as HTMLElement | null;
    if (!textEl) return;
    const parentRect = parent.getBoundingClientRect();
    const textRect = textEl.getBoundingClientRect();
    const extra = 0.8; // 0.05rem ≈ 0.8px
    setIndicatorStyle({
      left: textRect.left - parentRect.left - extra,
      width: textRect.width + extra * 2,
    });
  }

  // Measure before paint; indicator starts hidden (null) — first measure
  // creates it at correct position, so no initial animation
  useLayoutEffect(() => {
    measureIndicator(indicatorTarget);
  }, [indicatorTarget]);

  // Re-measure on resize
  useEffect(() => {
    function handleResize() {
      measureIndicator(indicatorTarget);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [indicatorTarget]);

  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      {/* Left: Logo */}
      <a href="/" className={styles.left} aria-label="iTiket หน้าแรก">
        <Image
          src="/icon/logoLight.svg"
          alt="iTiket"
          width={94}
          height={47}
          className={styles.logo}
          priority
        />
      </a>

      {/* Center: Nav links + sliding indicator */}
      <div
        ref={centerRef}
        className={styles.center}
        onMouseLeave={() => setHoveredKey(null)}
      >
        {indicatorStyle !== null && (
          <div
            className={styles.indicator}
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              transition:
                "left 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
            aria-hidden="true"
          />
        )}

        {NAV_ITEMS.map((item) =>
          isDropdown(item) ? (
            <div
              key={item.key}
              className={styles.dropdown}
              ref={setDropdownRef(item.key)}
              onMouseEnter={() => setHoveredKey(item.key)}
            >
              <button
                id={`nav-trigger-${item.key}`}
                data-nav-key={item.key}
                className={`${styles.navLink} ${styles.dropdownTrigger} ${
                  activeKey === item.key ? styles.active : ""
                }`}
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === item.key ? null : item.key
                  )
                }
                onKeyDown={(e) => handleDropdownKeyDown(e, item.key)}
                aria-expanded={activeDropdown === item.key ? "true" : "false"}
                aria-haspopup="true"
                aria-controls={`dropdown-menu-${item.key}`}
              >
                <span data-text-el={item.key}>{item.label}</span>
                <svg
                  className={`${styles.chevron} ${
                    activeDropdown === item.key ? styles.chevronOpen : ""
                  }`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 5L6 8L9 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {activeDropdown === item.key && (
                <div
                  id={`dropdown-menu-${item.key}`}
                  className={styles.dropdownMenu}
                  role="menu"
                >
                  {item.children.map((child, i) => (
                    <a
                      key={child.key}
                      id={`dropdown-item-${item.key}-${i}`}
                      className={styles.dropdownItem}
                      href={child.href}
                      role="menuitem"
                      tabIndex={-1}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <a
              key={item.key}
              data-nav-key={item.key}
              className={`${styles.navLink} ${activeKey === item.key ? styles.active : ""}`}
              href={item.href}
              onMouseEnter={() => setHoveredKey(item.key)}
            >
              <span data-text-el={item.key}>{item.label}</span>
            </a>
          )
        )}
      </div>

      {/* Right: AI Chat Trigger */}
      <div className={styles.right}>
        <button
          className={`${styles.aiTrigger} ${aiOpen ? styles.aiTriggerOpen : ""}`}
          onClick={onAiToggle}
          aria-label="เปิด AI Chat"
        >
          <Image
            src="/icon/aiChat.svg"
            alt=""
            width={22}
            height={22}
            aria-hidden="true"
            className={styles.aiIcon}
          />
        </button>
      </div>
    </nav>
  );
}
