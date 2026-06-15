"use client";

import { useState, useSyncExternalStore, useRef, useEffect } from "react";
import { userStore } from "@/lib/user-store";

export default function UserSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentUser = useSyncExternalStore(
    userStore.subscribe,
    () => userStore.getCurrentUser(),
    () => userStore.getCurrentUser(),
  );
  const allUsers = userStore.getAllUsers();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!currentUser) return null;

  const initial = currentUser.name.charAt(0).toUpperCase();

  return (
    <div ref={ref} style={{ position: "relative" /*, will be inside flex */ }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="เปลี่ยนผู้ใช้"
        title={currentUser.name}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "2px solid #e5e7eb",
          background: currentUser.role === "VIP" ? "#fef3c7" : "#f3f4f6",
          color: currentUser.role === "VIP" ? "#92400e" : "#374151",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "inherit",
        }}
      >
        {initial}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "#fff",
            border: "1px solid #f3f4f6",
            borderRadius: 10,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            minWidth: 200,
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {allUsers.map((user) => {
            const isActive = user.user_id === currentUser.user_id;
            return (
              <button
                key={user.user_id}
                onClick={() => {
                  userStore.setCurrentUser(user.user_id);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 14px",
                  border: "none",
                  background: isActive ? "#f9fafb" : "transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  textAlign: "left",
                  borderBottom: "1px solid #f9fafb",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: user.role === "VIP" ? "#fef3c7" : "#f3f4f6",
                    color: user.role === "VIP" ? "#92400e" : "#374151",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: isActive ? 600 : 400,
                      color: "#111827",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                    }}
                  >
                    {user.role === "VIP" ? "⭐ VIP" : "สมาชิก"} · {user.loyalty_points} pts
                  </div>
                </div>
                {isActive && (
                  <span style={{ color: "#7c3aed", fontSize: 14 }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
