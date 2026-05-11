import type { Captured, SavingsRules } from "./store";

export const TODAY = "2026-05-10";
export const MONTH_START = "2026-05-01";
export let BASE_BALANCE = 1849; // Adjusted so daily spendable becomes RM 30
export let PROJECTED_FIXED_BILLS = 360;
export let MONTHLY_ESSENTIAL_RESERVE = 700;
export let DAYS_IN_MONTH = 31;
export let CURRENT_DAY = 10;

export type FinanceSummary = {
  income: number;
  spending: number;
  netActivity: number;
  balance: number;
  projected: number;
  safeToSpend: number;
  plannedSavings: number;
  dailySpendPool: number;
  daysRemaining: number;
  savingsRate: number;
};

export function money(value: number) {
  return `RM ${Math.round(value).toLocaleString("en-MY")}`;
}

export function signedMoney(value: number) {
  return `${value >= 0 ? "+" : "-"}RM ${Math.abs(Math.round(value)).toLocaleString("en-MY")}`;
}

export function buildFinanceSummary(
  captured: Captured[],
  savings: number,
  recoveryPocket: number,
  emergency: number,
  savingsRules?: SavingsRules,
): FinanceSummary {
  const monthItems = captured.filter((item) => item.date >= MONTH_START && item.date <= TODAY);
  const income = sumByType(monthItems, "income");
  const spending = sumByType(monthItems, "expense");
  const protectedMoney = savings + recoveryPocket + emergency;
  const balance = BASE_BALANCE + income - spending;
  const projected = balance - PROJECTED_FIXED_BILLS;
  const daysRemaining = DAYS_IN_MONTH - CURRENT_DAY + 1;
  const paydaySavings = savingsRules?.paydaySplit ? income * 0.25 : 0;
  const weeklyReserve = savingsRules?.weeklyReserve ? Math.ceil(daysRemaining / 7) * 20 : 0;
  const roundUpEstimate = savingsRules?.roundUp ? 25 : 0;
  const resilienceBuffer = protectedMoney * 0.05;
  const plannedSavings = paydaySavings + weeklyReserve + roundUpEstimate + resilienceBuffer;
  const dailySpendPool = Math.max(0, projected - plannedSavings - MONTHLY_ESSENTIAL_RESERVE);
  const safeToSpend = Math.floor(dailySpendPool / daysRemaining);
  const savingsRate = income > 0 ? Math.round(((savings + emergency) / income) * 100) : 0;

  return {
    income,
    spending,
    netActivity: income - spending,
    balance,
    projected,
    safeToSpend,
    plannedSavings,
    dailySpendPool,
    daysRemaining,
    savingsRate,
  };
}

export function sumByType(items: Captured[], type: "income" | "expense") {
  return items
    .filter((item) => (item.type ?? "expense") === type)
    .reduce((sum, item) => sum + item.amount, 0);
}

export function categoryBreakdown(items: Captured[]) {
  const totals = new Map<string, number>();
  items
    .filter((item) => (item.type ?? "expense") === "expense")
    .forEach((item) => {
      totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount);
    });

  return Array.from(totals, ([name, value], index) => ({
    name,
    value: Number(value.toFixed(2)),
    color: chartColors[index % chartColors.length],
  })).sort((a, b) => b.value - a.value);
}

export function trendByDate(items: Captured[]) {
  const days = [
    "2026-05-04",
    "2026-05-05",
    "2026-05-06",
    "2026-05-07",
    "2026-05-08",
    "2026-05-09",
    TODAY,
  ];
  const seed: Record<string, number> = {
    "2026-05-04": 22,
    "2026-05-05": 35,
    "2026-05-06": 18,
    "2026-05-07": 48,
    "2026-05-08": 64,
    "2026-05-09": 82,
  };
  return days.map((date) => {
    const actual = items
      .filter((item) => item.date === date && (item.type ?? "expense") === "expense")
      .reduce((sum, item) => sum + item.amount, 0);
    const value = actual > 0 ? actual : (seed[date] ?? 0);
    return {
      day: date.slice(5),
      value: Number(value.toFixed(2)),
    };
  });
}

const chartColors = [
  "var(--mint)",
  "var(--amber)",
  "var(--prism)",
  "oklch(0.7 0.17 25)",
  "oklch(0.65 0.16 220)",
  "oklch(0.7 0.18 165)",
  "oklch(0.78 0.05 280)",
];
