import usersData from "@/data/users.json";

type User = {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  loyalty_points: number;
  role: "MEMBER" | "VIP";
};

const USERS = usersData as User[];
const STORAGE_KEY = "current-user";

type Listener = () => void;

function createUserStore() {
  let currentUserId: string = "u001";
  const listeners = new Set<Listener>();

  let hydrated = false;

  function save() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUserId));
    } catch {
      /* ignore */
    }
  }

  return {
    /**
     * Load persisted user from localStorage AFTER mount.
     * Kept out of module init so SSR + first client render both use the
     * default (u001), avoiding a hydration mismatch. Call once on mount.
     */
    hydrate() {
      if (hydrated || typeof window === "undefined") return;
      hydrated = true;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (
          typeof parsed === "string" &&
          parsed !== currentUserId &&
          USERS.some((u) => u.user_id === parsed)
        ) {
          currentUserId = parsed;
          listeners.forEach((l) => l());
        }
      } catch {
        /* ignore */
      }
    },

    getCurrentUserId(): string {
      return currentUserId;
    },

    getCurrentUser(): User | undefined {
      return USERS.find((u) => u.user_id === currentUserId);
    },

    setCurrentUser(id: string) {
      if (!USERS.some((u) => u.user_id === id)) return;
      currentUserId = id;
      save();
      listeners.forEach((l) => l());
    },

    getAllUsers(): User[] {
      return USERS;
    },

    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export const userStore = createUserStore();
