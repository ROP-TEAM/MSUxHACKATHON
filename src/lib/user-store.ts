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

  function load() {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "string" && USERS.some((u) => u.user_id === parsed)) {
          currentUserId = parsed;
        }
      }
    } catch {
      /* ignore */
    }
  }

  function save() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUserId));
    } catch {
      /* ignore */
    }
  }

  load();

  return {
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
