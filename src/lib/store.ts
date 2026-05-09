import { create } from "zustand";

export type Captured = {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  source: "auto" | "screenshot" | "voice" | "cash";
  time: string;
  needsReview?: boolean;
};

export type User = {
  name: string;
  email: string;
  joinDate: string;
  membership: string;
};

type State = {
  user: User;
  resilienceScore: number;
  recoveryPocket: number;
  recoveryNote: string;
  savings: number;
  emergency: number;
  intercepts: number;
  captured: Captured[];
  interceptOn: Record<string, boolean>;
  limits: Record<string, number>;
  addCaptured: (c: Captured) => void;
  redirectToRecovery: (n: number, note?: string) => void;
  toggleIntercept: (key: string) => void;
  setLimit: (key: string, n: number) => void;
};

export const useApp = create<State>((set) => ({
  user: {
    name: "Aiman Hakim",
    email: "aimanhakim@email.com",
    joinDate: "Mar 2026",
    membership: "GX Prism Member",
  },
  resilienceScore: 72,
  recoveryPocket: 20,
  recoveryNote: "Saved from 1 avoided BNPL impulse",
  savings: 340,
  emergency: 180,
  intercepts: 1,
  interceptOn: { "food-delivery": false, "late-night": true },
  limits: {},
  captured: [
    { id: "c1", merchant: "Touch 'n Go reload", amount: 30, category: "Transport", source: "screenshot", time: "2m ago" },
    { id: "c2", merchant: "Nasi lemak", amount: 8, category: "Food", source: "voice", time: "12m ago" },
    { id: "c3", merchant: "ShopeePay — kopi", amount: 6.5, category: "Food", source: "screenshot", time: "1h ago" },
    { id: "c4", merchant: "Unknown merchant", amount: 42, category: "Review", source: "screenshot", time: "1h ago", needsReview: true },
  ],
  addCaptured: (c) => set((s) => ({ captured: [c, ...s.captured] })),
  redirectToRecovery: (n, note) =>
    set((s) => ({
      recoveryPocket: s.recoveryPocket + n,
      recoveryNote: note ?? s.recoveryNote,
      intercepts: s.intercepts + 1,
    })),
  toggleIntercept: (key) =>
    set((s) => ({ interceptOn: { ...s.interceptOn, [key]: !s.interceptOn[key] } })),
  setLimit: (key, n) => set((s) => ({ limits: { ...s.limits, [key]: n } })),
}));
