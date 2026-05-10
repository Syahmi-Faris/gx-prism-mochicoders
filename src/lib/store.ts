import { create } from "zustand";

export type Captured = {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  source: "auto" | "screenshot" | "voice" | "cash";
  time: string;
  date: string;
  type?: "income" | "expense";
  needsReview?: boolean;
};

export type User = {
  name: string;
  email: string;
  joinDate: string;
  membership: string;
};

export type SavingsRules = {
  roundUp: boolean;
  weeklyReserve: boolean;
  paydaySplit: boolean;
};

type State = {
  user: User;
  resilienceScore: number;
  recoveryPocket: number;
  recoveryNote: string;
  savings: number;
  emergency: number;
  intercepts: number;
  streak: number;
  cashback: number;
  captured: Captured[];
  interceptOn: Record<string, boolean>;
  limits: Record<string, number>;
  savingsRules: SavingsRules;
  watchedAssets: string[];
  claimedRewards: string[];
  notificationsEnabled: boolean;
  addCaptured: (c: Captured) => void;
  updateCaptured: (id: string, patch: Partial<Captured>) => void;
  removeCaptured: (id: string) => void;
  markCapturedReviewed: (id: string) => void;
  redirectToRecovery: (n: number, note?: string) => void;
  toggleIntercept: (key: string) => void;
  setLimit: (key: string, n: number) => void;
  toggleSavingsRule: (key: keyof SavingsRules) => void;
  addToSavings: (n: number, note?: string) => void;
  addToEmergency: (n: number) => void;
  toggleWatchedAsset: (name: string) => void;
  claimReward: (id: string, amount: number) => void;
  updateUser: (name: string, email: string) => void;
  toggleNotifications: () => void;
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
  streak: 7,
  cashback: 4.2,
  interceptOn: { "food-delivery": false, "late-night": true },
  limits: {},
  savingsRules: { roundUp: true, weeklyReserve: true, paydaySplit: true },
  watchedAssets: [],
  claimedRewards: [],
  notificationsEnabled: true,
  captured: [
    {
      id: "c1",
      merchant: "Touch 'n Go reload",
      amount: 30,
      category: "Transport",
      source: "screenshot",
      time: "2m ago",
      date: "2026-05-10",
      type: "expense",
    },
    {
      id: "c2",
      merchant: "Nasi lemak",
      amount: 8,
      category: "Food",
      source: "voice",
      time: "12m ago",
      date: "2026-05-10",
      type: "expense",
    },
    {
      id: "c3",
      merchant: "ShopeePay - kopi",
      amount: 6.5,
      category: "Food",
      source: "screenshot",
      time: "1h ago",
      date: "2026-05-09",
      type: "expense",
    },
    {
      id: "c4",
      merchant: "Unknown merchant",
      amount: 42,
      category: "Review",
      source: "screenshot",
      time: "1h ago",
      date: "2026-05-09",
      type: "expense",
      needsReview: true,
    },
    {
      id: "c5",
      merchant: "Part-time tutoring",
      amount: 120,
      category: "Income",
      source: "auto",
      time: "today",
      date: "2026-05-10",
      type: "income",
    },
  ],
  addCaptured: (c) => set((s) => ({ captured: [c, ...s.captured] })),
  updateCaptured: (id, patch) =>
    set((s) => ({
      captured: s.captured.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  removeCaptured: (id) => set((s) => ({ captured: s.captured.filter((item) => item.id !== id) })),
  markCapturedReviewed: (id) =>
    set((s) => ({
      captured: s.captured.map((item) =>
        item.id === id ? { ...item, needsReview: false, category: item.category } : item,
      ),
    })),
  redirectToRecovery: (n, note) =>
    set((s) => ({
      recoveryPocket: s.recoveryPocket + n,
      recoveryNote: note ?? s.recoveryNote,
      intercepts: s.intercepts + 1,
      resilienceScore: Math.min(100, s.resilienceScore + 2),
    })),
  toggleIntercept: (key) =>
    set((s) => ({ interceptOn: { ...s.interceptOn, [key]: !s.interceptOn[key] } })),
  setLimit: (key, n) => set((s) => ({ limits: { ...s.limits, [key]: n } })),
  toggleSavingsRule: (key) =>
    set((s) => ({
      savingsRules: { ...s.savingsRules, [key]: !s.savingsRules[key] },
      resilienceScore: Math.min(100, s.resilienceScore + (s.savingsRules[key] ? 0 : 1)),
    })),
  addToSavings: (n, note) =>
    set((s) => ({
      savings: s.savings + n,
      recoveryNote: note ?? s.recoveryNote,
      resilienceScore: Math.min(100, s.resilienceScore + 1),
    })),
  addToEmergency: (n) =>
    set((s) => ({
      emergency: s.emergency + n,
      resilienceScore: Math.min(100, s.resilienceScore + 1),
    })),
  toggleWatchedAsset: (name) =>
    set((s) => ({
      watchedAssets: s.watchedAssets.includes(name)
        ? s.watchedAssets.filter((asset) => asset !== name)
        : [...s.watchedAssets, name],
    })),
  claimReward: (id, amount) =>
    set((s) =>
      s.claimedRewards.includes(id)
        ? {}
        : {
            claimedRewards: [...s.claimedRewards, id],
            cashback: Number((s.cashback + amount).toFixed(2)),
            resilienceScore: Math.min(100, s.resilienceScore + 1),
          },
    ),
  updateUser: (name, email) => set((s) => ({ user: { ...s.user, name, email } })),
  toggleNotifications: () => set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
}));
