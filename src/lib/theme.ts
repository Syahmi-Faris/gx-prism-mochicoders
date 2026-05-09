import { create } from "zustand";

type ThemeState = {
  theme: "light" | "dark";
  toggle: () => void;
  set: (t: "light" | "dark") => void;
  init: () => void;
};

const apply = (t: "light" | "dark") => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", t === "dark");
};

export const useTheme = create<ThemeState>((set) => ({
  theme: "light",
  toggle: () =>
    set((s) => {
      const next = s.theme === "light" ? "dark" : "light";
      apply(next);
      try { localStorage.setItem("gx-theme", next); } catch {}
      return { theme: next };
    }),
  set: (t) => {
    apply(t);
    try { localStorage.setItem("gx-theme", t); } catch {}
    set({ theme: t });
  },
  init: () => {
    if (typeof window === "undefined") return;
    let t: "light" | "dark" = "light";
    try {
      const stored = localStorage.getItem("gx-theme");
      if (stored === "dark" || stored === "light") t = stored;
    } catch {}
    apply(t);
    set({ theme: t });
  },
}));
