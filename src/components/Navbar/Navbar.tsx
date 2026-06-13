"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
};

function isDropdown(item: NavItem): item is NavDropdown {
  return "children" in item;
}

const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "หน้าแรก", href: "/" },
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

export default function Navbar({ onAiToggle, aiOpen }: Props) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const anyInside = Array.from(dropdownRefs.current.values()).some(
        (el) => el.contains(e.target as Node)
      );
      if (!anyInside) closeDropdown();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleDropdownKeyDown(e: React.KeyboardEvent, key: string) {
    if (e.key === "Escape") {
      closeDropdown();
      // Return focus to trigger
      const trigger = document.getElementById(`nav-trigger-${key}`);
      trigger?.focus();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const firstItem = document.getElementById(`dropdown-item-${key}-0`);
      firstItem?.focus();
    }
  }

  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      {/* Left: Logo */}
      <div className={styles.left}>
        <Image
          src="/logo/msuLogo.svg"
          alt="MSU Logo"
          width={20}
          height={24}
          className={styles.logoIcon}
        />
        <Image
          src="/logo/msuLogoName.svg"
          alt="MSU"
          width={69}
          height={24}
          className={styles.logoName}
        />
      </div>

      {/* Center: Nav links */}
      <div className={styles.center}>
        {NAV_ITEMS.map((item) =>
          isDropdown(item) ? (
            <div
              key={item.key}
              className={styles.dropdown}
              ref={setDropdownRef(item.key)}
            >
              <button
                id={`nav-trigger-${item.key}`}
                className={`${styles.navLink} ${styles.dropdownTrigger} ${
                  activeDropdown === item.key ? styles.active : ""
                }`}
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === item.key ? null : item.key
                  )
                }
                onKeyDown={(e) => handleDropdownKeyDown(e, item.key)}
                aria-expanded={activeDropdown === item.key}
                aria-haspopup="true"
                aria-controls={`dropdown-menu-${item.key}`}
              >
                {item.label}
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
              className={styles.navLink}
              href={item.href}
            >
              {item.label}
            </a>
          )
        )}
      </div>

      {/* Right: AI Chat Trigger (Dime-style pill) */}
      <div className={styles.right}>
        <button
          className={`${styles.aiTrigger} ${aiOpen ? styles.aiTriggerOpen : ""}`}
          onClick={onAiToggle}
          aria-label="เปิด AI Chat"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 28 26"
            fill="none"
            className={styles.aiIcon}
            aria-hidden="true"
          >
            <path d="M15.9991 14.4476C15.9991 14.7443 15.9111 15.0343 15.7463 15.2809C15.5814 15.5276 15.3472 15.7199 15.0731 15.8334C14.799 15.9469 14.4974 15.9766 14.2064 15.9188C13.9154 15.8609 13.6482 15.718 13.4384 15.5082C13.2286 15.2985 13.0858 15.0312 13.0279 14.7402C12.97 14.4492 12.9997 14.1476 13.1132 13.8736C13.2268 13.5995 13.419 13.3652 13.6657 13.2004C13.9124 13.0356 14.2024 12.9476 14.4991 12.9476C14.8969 12.9476 15.2784 13.1056 15.5597 13.3869C15.841 13.6682 15.9991 14.0498 15.9991 14.4476ZM21.4991 12.9476C21.2024 12.9476 20.9124 13.0356 20.6657 13.2004C20.419 13.3652 20.2268 13.5995 20.1132 13.8736C19.9997 14.1476 19.97 14.4492 20.0279 14.7402C20.0858 15.0312 20.2286 15.2985 20.4384 15.5082C20.6482 15.718 20.9154 15.8609 21.2064 15.9188C21.4974 15.9766 21.799 15.9469 22.0731 15.8334C22.3472 15.7199 22.5814 15.5276 22.7463 15.2809C22.9111 15.0343 22.9991 14.7443 22.9991 14.4476C22.9991 14.0498 22.841 13.6682 22.5597 13.3869C22.2784 13.1056 21.8969 12.9476 21.4991 12.9476ZM27.9166 23.3813C28.0182 23.7261 28.025 24.092 27.9362 24.4403C27.8475 24.7887 27.6665 25.1067 27.4123 25.3609C27.1581 25.615 26.8401 25.796 26.4918 25.8848C26.1434 25.9735 25.7776 25.9667 25.4328 25.8651L22.3441 24.9563C21.1264 25.5436 19.8023 25.8779 18.4518 25.939C17.1013 26.0001 15.7524 25.7867 14.4867 25.3117C13.221 24.8368 12.0647 24.1101 11.0878 23.1757C10.1109 22.2413 9.33354 21.1184 8.80281 19.8751C7.70934 19.7465 6.64508 19.436 5.65406 18.9563L2.56531 19.8651C2.22049 19.9667 1.85467 19.9735 1.50632 19.8848C1.15797 19.796 0.839972 19.615 0.585787 19.3609C0.331601 19.1067 0.150621 18.7887 0.0618885 18.4403C-0.0268445 18.092 -0.0200506 17.7261 0.0815554 17.3813L0.990305 14.2926C0.420367 13.0934 0.0949397 11.7927 0.0330074 10.4665C-0.0289249 9.14017 0.173878 7.81484 0.629586 6.56776C1.08529 5.32069 1.78478 4.17685 2.68724 3.20298C3.5897 2.22911 4.67706 1.4447 5.88588 0.895522C7.09471 0.346343 8.4008 0.0433864 9.72795 0.00432812C11.0551 -0.0347302 12.3767 0.190892 13.6158 0.66803C14.8548 1.14517 15.9864 1.86427 16.9446 2.78339C17.9028 3.7025 18.6683 4.80322 19.1966 6.02133C20.7761 6.21167 22.2874 6.77613 23.6049 7.66781C24.9225 8.55949 26.0083 9.75267 26.7721 11.1482C27.536 12.5438 27.9559 14.1015 27.9968 15.6919C28.0378 17.2823 27.6988 18.8595 27.0078 20.2926L27.9166 23.3813Z" fill="currentColor"/>
          </svg>
          <span className={styles.aiLabel}>AI</span>
        </button>
      </div>
    </nav>
  );
}
