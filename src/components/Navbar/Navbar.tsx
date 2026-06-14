"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.scss";

type NavKey =
  | "home"
  | "concerts"
  | "all-events"
  | "my-tickets"
  | "overview"
  | "contact";

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
  { key: "home", label: "หน้าแรก", href: "/home" },
  {
    key: "concerts",
    label: "คอนเสิร์ต",
    children: [
      { key: "all-events", label: "งานทั้งหมด", href: "/events" },
      { key: "my-tickets", label: "ตั๋วของฉัน", href: "/mytickets" },
    ],
  },
  { key: "overview", label: "ภาพรวม", 
    children: [
      { key: "all-events", label: "วิเคราะห์", href: "/analytic" },
      { key: "my-tickets", label: "list", href: "/list" },
    ],
  },
  { key: "contact", label: "ติดต่อเรา", href: "/contact" },
];

export default function Navbar({ onAiToggle, aiOpen }: Props) {
  const pathname = usePathname();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownHoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const centerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const getActiveKey = (): NavKey => {
    for (const item of NAV_ITEMS) {
      if (isDropdown(item)) {
        if (item.children.some((child) => pathname === child.href)) {
          return item.key;
        }
      } else {
        if (pathname === item.href) {
          return item.key;
        }
      }
    }
    return "home";
  };

  const activeKey = getActiveKey();

  const setDropdownRef = useCallback(
    (key: string) => (el: HTMLDivElement | null) => {
      if (el) dropdownRefs.current.set(key, el);
      else dropdownRefs.current.delete(key);
    },
    [],
  );

  function closeDropdown() {
    setActiveDropdown(null);
  }

  function handleClickOutside(e: MouseEvent) {
    const anyInside = Array.from(dropdownRefs.current.values()).some((el) =>
      el.contains(e.target as Node),
    );
    if (!anyInside) closeDropdown();
  }

  const outsideClickRef = useRef<boolean>(false);
  if (!outsideClickRef.current) {
    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
    }
    outsideClickRef.current = true;
  }

  function closeMenu() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setMenuClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
      setMobileExpanded(null);
    }, 300);
  }

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (dropdownHoverTimerRef.current)
        clearTimeout(dropdownHoverTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && menuOpen) closeMenu();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

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

  function measureIndicator(key: string | null) {
    if (!key || !centerRef.current) return;
    const parent = centerRef.current;
    const textEl = parent.querySelector(
      `[data-text-el="${key}"]`,
    ) as HTMLElement | null;
    if (!textEl) return;
    const parentRect = parent.getBoundingClientRect();
    const textRect = textEl.getBoundingClientRect();
    const extra = 0.8;
    setIndicatorStyle({
      left: textRect.left - parentRect.left - extra,
      width: textRect.width + extra * 2,
    });
  }

  useLayoutEffect(() => {
    measureIndicator(activeKey);
  }, [activeKey]);

  useEffect(() => {
    if (menuOpen) {
      const sw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${sw}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function handleResize() {
      measureIndicator(activeKey);
      if (window.innerWidth > 640) setMenuOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeKey]);

  useEffect(() => {
    measureIndicator(activeKey);
  }, [pathname, activeKey]);

  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      {/* Left: Logo */}
      <Link href="/" className={styles.left} aria-label="iTiket หน้าแรก">
        <Image
          src="/icon/logoLight.svg"
          alt="iTiket"
          width={94}
          height={47}
          className={styles.logo}
          priority
        />
      </Link>

      {/* Center: Nav links + sliding indicator (desktop) */}
      <div
        ref={centerRef}
        className={styles.center}
      >
        {indicatorStyle !== null && (
          <div
            className={styles.indicator}
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              /* Removed the transition property so it snaps instantly */
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
              onMouseEnter={() => {
                if (dropdownHoverTimerRef.current) clearTimeout(dropdownHoverTimerRef.current);
                setActiveDropdown(item.key);
              }}
              onMouseLeave={() => {
                dropdownHoverTimerRef.current = setTimeout(
                  () => setActiveDropdown(null),
                  150,
                );
              }}
            >
              <button
                id={`nav-trigger-${item.key}`}
                data-nav-key={item.key}
                className={`${styles.navLink} ${styles.dropdownTrigger} ${
                  activeKey === item.key || item.children.some((c) => pathname === c.href) ? styles.active : ""
                }`}
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === item.key ? null : item.key,
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
                    <Link
                      key={child.key}
                      id={`dropdown-item-${item.key}-${i}`}
                      className={`${styles.dropdownItem}${pathname === child.href ? ` ${styles.dropdownItemActive}` : ""}`}
                      href={child.href}
                      role="menuitem"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={item.key}
              data-nav-key={item.key}
              className={`${styles.navLink} ${activeKey === item.key ? styles.active : ""}`}
              href={item.href}
            >
              <span data-text-el={item.key}>{item.label}</span>
            </Link>
          )
        )}
      </div>

      {/* Right: AI Chat Trigger + Hamburger */}
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

        <button
          ref={hamburgerRef}
          type="button"
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"}
          aria-expanded={menuOpen ? "true" : "false"}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          <div className={styles.backdrop} onClick={closeMenu} aria-hidden="true" />
          <div ref={mobileMenuRef} className={`${styles.mobileMenu}${menuClosing ? ` ${styles.mobileMenuClosing}` : ""}`} role="dialog" aria-label="เมนูนำทาง">
            <div className={styles.mobileMenuHeader}>
              <Link href="/" className={styles.mobileMenuLogo} aria-label="iTiket หน้าแรก" onClick={closeMenu}>
                <Image src="/icon/logo.svg" alt="" width={80} height={40} aria-hidden="true" />
              </Link>
              <button
                type="button"
                className={styles.mobileMenuClose}
                onClick={closeMenu}
                aria-label="ปิดเมนู"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 4L16 16M16 4L4 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav className={styles.mobileMenuNav}>
              {NAV_ITEMS.map((item) =>
                isDropdown(item) ? (
                  <div key={item.key}>
                    <button
                      type="button"
                      className={`${styles.mobileNavLink} ${styles.mobileDropdownTrigger} ${
                        activeKey === item.key ? styles.mobileNavLinkActive : ""
                      }`}
                      onClick={() =>
                        setMobileExpanded(
                          mobileExpanded === item.key ? null : item.key,
                        )
                      }
                      aria-expanded={
                        String(mobileExpanded === item.key) as "true" | "false"
                      }
                    >
                      <span>{item.label}</span>
                      <svg
                        className={`${styles.chevron} ${
                          mobileExpanded === item.key ? styles.chevronOpen : ""
                        }`}
                        width="14"
                        height="14"
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
                    {mobileExpanded === item.key && (
                      <div className={styles.mobileDropdownChildren}>
                        {item.children.map((child) => (
                          <Link
                            key={child.key}
                            className={`${styles.mobileDropdownItem} ${
                              pathname === child.href ? styles.mobileNavLinkActive : ""
                            }`}
                            href={child.href}
                            onClick={closeMenu}
                          >
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.key}
                    className={`${styles.mobileNavLink} ${
                      pathname === item.href ? styles.mobileNavLinkActive : ""
                    }`}
                    href={item.href}
                    onClick={closeMenu}
                  >
                    <span>{item.label}</span>
                  </Link>
                )
              )}
            </nav>
          </div>
        </>
      )}
    </nav>
  );
}