import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartCaptureModal } from "@/components/SmartCaptureModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/lib/store";
import {
  TODAY,
  buildFinanceSummary,
  categoryBreakdown,
  money,
  signedMoney,
  trendByDate,
} from "@/lib/finance";
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CalendarCheck,
  CalendarDays,
  Filter,
  Gift,
  Mic,
  PiggyBank,
  Plus,
  ScanLine,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Utensils,
  WalletCards,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/capture")({
  head: () => ({ meta: [{ title: "Expense Behaviour - GX Prism" }] }),
  component: ExpenseBehaviour,
});

const transactionDates = [
  "2026-05-10",
  "2026-05-09",
  "2026-05-08",
  "2026-05-07",
  "2026-05-06",
  "2026-05-05",
  "2026-05-04",
  "2026-05-03",
];

type DatePreset = "month" | "today" | "week" | "range";
type TransactionTypeFilter = "all" | "income" | "expense";
type TxStatus = "all" | "cleared" | "review" | "intercepted";
type TransactionStatus = Exclude<TxStatus, "all">;
type TransactionView = {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  source: "auto" | "screenshot" | "voice" | "cash";
  time: string;
  date: string;
  status: TransactionStatus;
  note: string;
};

function ExpenseBehaviour() {
  const {
    captured,
    savings,
    recoveryPocket,
    setLimit,
    limits,
    toggleIntercept,
    interceptOn,
    redirectToRecovery,
    claimReward,
    claimedRewards,
    markCapturedReviewed,
    emergency,
    savingsRules,
  } = useApp();
  const [mode, setMode] = useState<"lower" | "higher">("lower");
  const [modal, setModal] = useState<"cheat" | "buffer" | "limit" | "patterns" | null>(null);
  const [datePreset, setDatePreset] = useState<DatePreset>("month");
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-10");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<TxStatus>("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionView | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const summary = buildFinanceSummary(captured, savings, recoveryPocket, emergency, savingsRules);
  const categories = useMemo(() => categoryBreakdown(captured), [captured]);
  const chartCategories =
    categories.length > 0
      ? categories
      : [{ name: "No spending yet", value: 1, color: "var(--muted)" }];
  const trend = useMemo(() => trendByDate(captured), [captured]);
  const total = categories.reduce((sum, item) => sum + item.value, 0);
  const recentTotal = useMemo(
    () =>
      captured
        .slice(0, 5)
        .filter((item) => item.type !== "income")
        .reduce((sum, item) => sum + item.amount, 0),
    [captured],
  );
  const transactionViews = useMemo<TransactionView[]>(
    () =>
      captured.map((item, index) => ({
        ...item,
        type: item.type ?? "expense",
        date: item.date ?? transactionDates[index % transactionDates.length],
        status: item.needsReview
          ? "review"
          : item.type === "income"
            ? "cleared"
            : item.source === "auto"
              ? "intercepted"
              : "cleared",
        note:
          item.type === "income"
            ? "Income improves safe-to-spend and saving capacity"
            : item.source === "auto"
              ? "Synced from GXBank activity"
              : item.needsReview
                ? "Needs merchant/category confirmation"
                : "Logged from Smart Capture",
      })),
    [captured],
  );
  const visibleTransactions = useMemo(() => {
    const min = Number(minAmount);
    const max = Number(maxAmount);
    const start = datePreset === "today" ? TODAY : datePreset === "week" ? "2026-05-04" : startDate;
    const end = datePreset === "today" ? TODAY : datePreset === "week" ? TODAY : endDate;
    const q = keyword.trim().toLowerCase();

    return transactionViews.filter((item) => {
      const inDate = datePreset === "month" || (item.date >= start && item.date <= end);
      const inType = typeFilter === "all" || item.type === typeFilter;
      const inCategory = categoryFilter === "all" || item.category.toLowerCase() === categoryFilter;
      const inSource = sourceFilter === "all" || item.source === sourceFilter;
      const inStatus = statusFilter === "all" || item.status === statusFilter;
      const inMin = !minAmount || item.amount >= min;
      const inMax = !maxAmount || item.amount <= max;
      const inKeyword =
        !q ||
        item.merchant.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.note.toLowerCase().includes(q);

      return inDate && inType && inCategory && inSource && inStatus && inMin && inMax && inKeyword;
    });
  }, [
    categoryFilter,
    datePreset,
    endDate,
    keyword,
    maxAmount,
    minAmount,
    sourceFilter,
    startDate,
    statusFilter,
    transactionViews,
    typeFilter,
  ]);
  const visibleSpending = visibleTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const visibleIncome = visibleTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const selectedDates = useMemo(() => {
    if (datePreset === "month") return transactionDates;
    if (datePreset === "today") return [TODAY];
    const start = datePreset === "week" ? "2026-05-04" : startDate;
    const end = datePreset === "week" ? TODAY : endDate;
    return transactionDates.filter((date) => date >= start && date <= end);
  }, [datePreset, endDate, startDate]);
  const periodIncome = visibleIncome;
  const periodSaved = Math.round((savings + recoveryPocket) * (selectedDates.length / 31));
  const periodNet = periodIncome - visibleSpending - periodSaved;
  const comparison = mode === "lower" ? -12 : 18;

  const claimCheatDay = () => {
    claimReward("smart-cheat-day", 2);
    toast.success(
      claimedRewards.includes("smart-cheat-day")
        ? "Cheat day reward already claimed"
        : "Cheat day unlocked with RM 2 cashback",
    );
    setModal(null);
  };

  const createBuffer = () => {
    redirectToRecovery(35, "AI buffer created after higher spending trend");
    toast.success("RM 35 moved to Recovery Pocket");
    setModal(null);
  };

  const activateLimit = () => {
    setLimit("shopping", 90);
    if (!interceptOn.shopping) toggleIntercept("shopping");
    toast.success("Shopping limit set to RM 90 with intercept enabled");
    setModal(null);
  };

  const resetFilters = () => {
    setDatePreset("month");
    setTypeFilter("all");
    setCategoryFilter("all");
    setSourceFilter("all");
    setStatusFilter("all");
    setMinAmount("");
    setMaxAmount("");
    setKeyword("");
    toast.success("Filters reset");
  };

  return (
    <div className="px-5 pt-6 space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles size={12} className="text-primary" /> AI spending behaviour
          </p>
          <h1 className="text-2xl font-semibold">Expense Behaviour</h1>
        </div>
        <div className="flex rounded-full bg-card border border-border p-1">
          <button
            onClick={() => setMode("lower")}
            className={`px-3 py-1.5 rounded-full text-[11px] ${
              mode === "lower" ? "bg-mint/20 text-mint" : "text-muted-foreground"
            }`}
          >
            Lower
          </button>
          <button
            onClick={() => setMode("higher")}
            className={`px-3 py-1.5 rounded-full text-[11px] ${
              mode === "higher" ? "bg-amber/20 text-amber" : "text-muted-foreground"
            }`}
          >
            Higher
          </button>
        </div>
      </header>

      <Card className="p-5 bg-card border-border">
        <p className="text-xs text-muted-foreground">This month</p>
        <div className="flex items-end gap-2 mt-1">
          <p className="text-4xl font-semibold">{money(total)}</p>
          <p className="text-sm text-muted-foreground pb-1">
            spent across {categories.length || 0} categories
          </p>
        </div>

        <div className="h-44 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartCategories}
                innerRadius={48}
                outerRadius={84}
                paddingAngle={2}
                dataKey="value"
              >
                {chartCategories.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 11,
                  color: "var(--foreground)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {categories.slice(0, 6).map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <span className="h-3 w-3 rounded-full shrink-0" style={{ background: item.color }} />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="ml-auto font-semibold">{money(item.value)}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between">
          <p className="font-semibold">30-day trend</p>
          {mode === "lower" ? (
            <Badge className="bg-mint/20 text-mint border-0">
              <TrendingDown size={12} className="mr-1" />
              {Math.abs(comparison)}% lower
            </Badge>
          ) : (
            <Badge className="bg-amber/20 text-amber border-0">
              <TrendingUp size={12} className="mr-1" />
              {comparison}% higher
            </Badge>
          )}
        </div>
        <div className="h-36 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 11,
                }}
                labelFormatter={(day) => `Day ${day}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={mode === "lower" ? "var(--mint)" : "var(--amber)"}
                strokeWidth={2.5}
                fill={mode === "lower" ? "var(--mint)" : "var(--amber)"}
                fillOpacity={0.12}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="font-semibold">Patterns AI detected</h2>
          <button onClick={() => setModal("patterns")} className="text-[12px] text-primary">
            View details
          </button>
        </div>

        {mode === "lower" ? (
          <SuggestionCard
            tone="mint"
            icon={Gift}
            title="Spending is under control"
            detail={`You spent ${money(summary.spending)} this month. Savings rate is ${summary.savingsRate}%, so GX Prism can suggest a planned treat without breaking your streak.`}
            primary="Unlock Cheat Day"
            secondary="Save RM10"
            onPrimary={() => setModal("cheat")}
            onSecondary={() => {
              redirectToRecovery(10, "Extra RM 10 reserved after lower-spend week");
              toast.success("RM 10 reserved safely");
            }}
          />
        ) : (
          <SuggestionCard
            tone="amber"
            icon={ShieldAlert}
            title="Spending is rising"
            detail="Spending is rising against this week's captured activity. Create a recovery buffer or set an intercept before next weekend."
            primary="Create Buffer"
            secondary="Set Limit"
            onPrimary={() => setModal("buffer")}
            onSecondary={() => setModal("limit")}
          />
        )}

        <PatternCard
          icon={Utensils}
          title="Food is your biggest category"
          detail={`${categories[0]?.name ?? "Food"} is currently the largest captured spending category.`}
          action="Set food nudge"
          onClick={() => {
            setLimit("food", 45);
            toast.success("Food nudge set at RM 45 per week");
          }}
        />
        <PatternCard
          icon={WalletCards}
          title="BNPL needs attention"
          detail="Keep instalments visible before they crowd out essentials."
          action={interceptOn.bnpl ? "BNPL protected" : "Turn on intercept"}
          onClick={() => {
            if (!interceptOn.bnpl) toggleIntercept("bnpl");
            toast.success("BNPL intercept is active");
          }}
        />
      </section>

      <Card className="p-4 bg-card border-border">
        <div className="grid grid-cols-3 gap-2 text-center">
          <Mini label="Recent logs" value={String(captured.length)} />
          <Mini label="Last 5 spend" value={`RM${recentTotal.toFixed(0)}`} />
          <Mini label="Shopping limit" value={limits.shopping ? `RM${limits.shopping}` : "None"} />
        </div>
      </Card>

      <Card id="transactions" className="p-4 bg-card border-border space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold">Transaction Explorer</p>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Search and filter full history.
            </p>
          </div>
          <Badge className="bg-primary/15 text-primary border-0 shrink-0">
            <Filter size={11} className="mr-1" />
            {visibleTransactions.length} found
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <Mini label="Income" value={money(periodIncome)} />
          <Mini label="Spent" value={money(visibleSpending)} />
          <Mini label="Net" value={signedMoney(periodNet)} />
        </div>

        <div className="flex gap-2">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search merchant"
            className="h-10 rounded-xl bg-accent/40"
          />
          <Button
            onClick={() => setFiltersOpen(true)}
            className="h-10 shrink-0 rounded-xl bg-accent text-foreground border-0 hover:bg-accent/80 px-3"
          >
            <Filter size={15} className="mr-1" />
            Filters
          </Button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <QuickFilter
            active={datePreset === "month"}
            label="Month"
            onClick={() => setDatePreset("month")}
          />
          <QuickFilter
            active={datePreset === "today"}
            label="Today"
            onClick={() => setDatePreset("today")}
          />
          <QuickFilter
            active={datePreset === "week"}
            label="7 days"
            onClick={() => setDatePreset("week")}
          />
          <QuickFilter
            active={statusFilter === "review"}
            label="Review"
            onClick={() => setStatusFilter(statusFilter === "review" ? "all" : "review")}
          />
        </div>

        <div className="space-y-2">
          {visibleTransactions.length > 0 ? (
            visibleTransactions.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedTransaction(item)}
                className="w-full flex items-center gap-2 rounded-xl bg-accent/35 px-2.5 py-2 text-left hover:bg-accent/60 transition"
              >
                <div className="h-7 w-7 rounded-lg bg-card grid place-items-center text-primary shrink-0">
                  <SourceIcon source={item.source} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-medium truncate">{item.merchant}</p>
                    {item.status !== "cleared" && <StatusDot status={item.status} />}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {item.date.slice(5)} - {item.type} - {item.category} - {item.source}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-[13px] font-semibold ${
                      item.type === "income" ? "text-mint" : ""
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"}RM{item.amount.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-muted-foreground capitalize">{item.status}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-2xl bg-accent/40 p-4 text-center">
              <p className="text-sm font-medium">No matching transactions</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Try another filter or add more activity from Home Smart Capture.
              </p>
            </div>
          )}
        </div>

        <Button
          onClick={() => setAddOpen(true)}
          className="w-full h-10 rounded-xl gradient-prism text-primary-foreground border-0"
        >
          <Plus size={15} className="mr-1.5" />
          Add transaction
        </Button>
      </Card>

      <BehaviourModal
        modal={modal}
        mode={mode}
        onClose={() => setModal(null)}
        onCheatDay={claimCheatDay}
        onBuffer={createBuffer}
        onLimit={activateLimit}
      />
      <TransactionDetailModal
        transaction={selectedTransaction}
        onReview={(id) => {
          markCapturedReviewed(id);
          setSelectedTransaction((item) =>
            item?.id === id ? { ...item, status: "cleared" } : item,
          );
        }}
        onClose={() => setSelectedTransaction(null)}
      />
      <AdvancedFiltersModal
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        datePreset={datePreset}
        setDatePreset={setDatePreset}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        minAmount={minAmount}
        setMinAmount={setMinAmount}
        maxAmount={maxAmount}
        setMaxAmount={setMaxAmount}
        onReset={resetFilters}
        matchCount={visibleTransactions.length}
      />
      <SmartCaptureModal open={addOpen} onOpenChange={setAddOpen} initialMode="scan" />
    </div>
  );
}

function SuggestionCard({
  tone,
  icon: Icon,
  title,
  detail,
  primary,
  secondary,
  onPrimary,
  onSecondary,
}: {
  tone: "mint" | "amber";
  icon: LucideIcon;
  title: string;
  detail: string;
  primary: string;
  secondary: string;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  const toneClass =
    tone === "mint"
      ? "border-mint/30 bg-mint/10 text-mint"
      : "border-amber/30 bg-amber/10 text-amber";
  return (
    <Card className={`p-4 border ${toneClass}`}>
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-card grid place-items-center shrink-0">
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-[12px] text-muted-foreground mt-1 leading-snug">{detail}</p>
          <div className="flex flex-col gap-2 mt-3 min-[390px]:grid min-[390px]:grid-cols-2">
            <Button
              onClick={onPrimary}
              className="min-h-9 h-auto rounded-xl gradient-prism text-primary-foreground border-0 text-[12px] whitespace-normal leading-tight px-2 py-2"
            >
              {primary}
            </Button>
            <Button
              onClick={onSecondary}
              className="min-h-9 h-auto rounded-xl bg-card text-foreground border border-border text-[12px] whitespace-normal leading-tight px-2 py-2"
            >
              {secondary}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function PatternCard({
  icon: Icon,
  title,
  detail,
  action,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <Card className="p-4 bg-card border-border flex items-start gap-3">
      <div className="h-9 w-9 rounded-xl bg-accent grid place-items-center text-primary shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-[12px] text-muted-foreground mt-1 leading-snug">{detail}</p>
      </div>
      <Button
        onClick={onClick}
        className="h-8 rounded-full bg-accent text-foreground border-0 hover:bg-accent/80 text-[11px]"
      >
        {action}
      </Button>
    </Card>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] flex items-center gap-1">
        <CalendarDays size={11} /> {label}
      </Label>
      <Input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded-xl bg-card"
      />
    </div>
  );
}

function QuickFilter({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] transition ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-accent/40 text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function AdvancedFiltersModal({
  open,
  onOpenChange,
  datePreset,
  setDatePreset,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  categoryFilter,
  setCategoryFilter,
  typeFilter,
  setTypeFilter,
  sourceFilter,
  setSourceFilter,
  statusFilter,
  setStatusFilter,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  onReset,
  matchCount,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datePreset: DatePreset;
  setDatePreset: (value: DatePreset) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  typeFilter: TransactionTypeFilter;
  setTypeFilter: (value: TransactionTypeFilter) => void;
  sourceFilter: string;
  setSourceFilter: (value: string) => void;
  statusFilter: TxStatus;
  setStatusFilter: (value: TxStatus) => void;
  minAmount: string;
  setMinAmount: (value: string) => void;
  maxAmount: string;
  setMaxAmount: (value: string) => void;
  onReset: () => void;
  matchCount: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[390px] rounded-3xl">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>
            Refine transactions by date, type, status, and amount.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <FilterSelect
            label="Date filter"
            value={datePreset}
            onValueChange={(value) => setDatePreset(value as DatePreset)}
            options={[
              ["month", "This month"],
              ["today", "Today"],
              ["week", "Last 7 days"],
              ["range", "Custom range"],
            ]}
          />

          {datePreset === "range" && (
            <div className="grid grid-cols-2 gap-2">
              <DateInput label="Start" value={startDate} onChange={setStartDate} />
              <DateInput label="End" value={endDate} onChange={setEndDate} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <FilterSelect
              label="Type"
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value as TransactionTypeFilter)}
              options={[
                ["all", "All"],
                ["expense", "Expense"],
                ["income", "Income"],
              ]}
            />
            <FilterSelect
              label="Category"
              value={categoryFilter}
              onValueChange={setCategoryFilter}
              options={[
                ["all", "All"],
                ["income", "Income"],
                ["food", "Food"],
                ["transport", "Transport"],
                ["review", "Review"],
                ["cash", "Cash"],
              ]}
            />
            <FilterSelect
              label="Source"
              value={sourceFilter}
              onValueChange={setSourceFilter}
              options={[
                ["all", "All"],
                ["auto", "Auto"],
                ["screenshot", "Scan"],
                ["voice", "Voice"],
                ["cash", "Cash"],
              ]}
            />
            <FilterSelect
              label="Status"
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as TxStatus)}
              options={[
                ["all", "All"],
                ["cleared", "Cleared"],
                ["review", "Review"],
                ["intercepted", "Intercept"],
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <AmountInput
              label="Min amount"
              value={minAmount}
              onChange={setMinAmount}
              placeholder="RM 0"
            />
            <AmountInput
              label="Max amount"
              value={maxAmount}
              onChange={setMaxAmount}
              placeholder="RM 100"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              onClick={onReset}
              className="h-10 flex-1 rounded-xl bg-accent text-foreground border-0 hover:bg-accent/80"
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                toast.success(`${matchCount} transactions matched`);
                onOpenChange(false);
              }}
              className="h-10 flex-1 rounded-xl gradient-prism text-primary-foreground border-0"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AmountInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px]">{label}</Label>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode="decimal"
        placeholder={placeholder}
        className="h-9 rounded-xl bg-card"
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px]">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-9 rounded-xl bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(([optionValue, optionLabel]) => (
            <SelectItem key={optionValue} value={optionValue}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function SourceIcon({ source }: { source: string }) {
  if (source === "screenshot") return <ScanLine size={15} />;
  if (source === "voice") return <Mic size={15} />;
  if (source === "cash") return <Banknote size={15} />;
  return <Zap size={15} />;
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  if (status === "review") {
    return <Badge className="bg-amber/20 text-amber border-0 text-[10px]">Review</Badge>;
  }
  if (status === "intercepted") {
    return <Badge className="bg-primary/15 text-primary border-0 text-[10px]">Intercept</Badge>;
  }
  return <Badge className="bg-mint/20 text-mint border-0 text-[10px]">Cleared</Badge>;
}

function StatusDot({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={`h-1.5 w-1.5 rounded-full shrink-0 ${
        status === "review" ? "bg-amber" : status === "intercepted" ? "bg-primary" : "bg-mint"
      }`}
    />
  );
}

function TransactionDetailModal({
  transaction,
  onReview,
  onClose,
}: {
  transaction: TransactionView | null;
  onReview: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(transaction)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[380px] rounded-3xl">
        <DialogHeader>
          <DialogTitle>{transaction?.merchant ?? "Transaction"}</DialogTitle>
          <DialogDescription>Detailed transaction view for prototype review.</DialogDescription>
        </DialogHeader>

        {transaction && (
          <div className="space-y-3">
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-accent grid place-items-center text-primary">
                  <SourceIcon source={transaction.source} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">
                    {transaction.type} - {transaction.category}
                  </p>
                  <p
                    className={`text-2xl font-semibold ${
                      transaction.type === "income" ? "text-mint" : ""
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}RM
                    {transaction.amount.toFixed(2)}
                  </p>
                </div>
                <StatusBadge status={transaction.status} />
              </div>
            </Card>

            <div className="space-y-2">
              <DetailRow label="Type" value={transaction.type} trend="down" />
              <DetailRow label="Date" value={transaction.date} trend="down" />
              <DetailRow label="Source" value={transaction.source} trend="down" />
              <DetailRow label="Captured" value={transaction.time} trend="down" />
              <DetailRow label="Note" value={transaction.note} trend="up" />
            </div>

            <Button
              onClick={() => {
                onReview(transaction.id);
                toast.success("Transaction marked as reviewed");
                onClose();
              }}
              className="w-full rounded-xl gradient-prism text-primary-foreground border-0"
            >
              Mark as reviewed
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function BehaviourModal({
  modal,
  mode,
  onClose,
  onCheatDay,
  onBuffer,
  onLimit,
}: {
  modal: "cheat" | "buffer" | "limit" | "patterns" | null;
  mode: "lower" | "higher";
  onClose: () => void;
  onCheatDay: () => void;
  onBuffer: () => void;
  onLimit: () => void;
}) {
  return (
    <Dialog open={Boolean(modal)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[380px] rounded-3xl">
        <DialogHeader>
          <DialogTitle>
            {modal === "cheat"
              ? "Cheat Day Suggestion"
              : modal === "buffer"
                ? "Recovery Buffer"
                : modal === "limit"
                  ? "Set Protective Limit"
                  : "AI Pattern Details"}
          </DialogTitle>
          <DialogDescription>
            {mode === "lower"
              ? "Your spending is below your normal range."
              : "Your spending is above your normal range."}
          </DialogDescription>
        </DialogHeader>

        {modal === "cheat" && (
          <div className="space-y-3">
            <Card className="p-4 bg-mint/10 border-mint/30 flex gap-3">
              <CalendarCheck size={18} className="text-mint shrink-0" />
              <p className="text-sm">
                Plan one RM15-RM20 treat while keeping your essentials and savings protected.
              </p>
            </Card>
            <Button
              onClick={onCheatDay}
              className="w-full rounded-xl gradient-prism text-primary-foreground border-0"
            >
              Unlock Cheat Day
            </Button>
          </div>
        )}

        {modal === "buffer" && (
          <div className="space-y-3">
            <Card className="p-4 bg-amber/10 border-amber/30 flex gap-3">
              <PiggyBank size={18} className="text-amber shrink-0" />
              <p className="text-sm">
                Move RM35 into Recovery Pocket to protect next week's essentials budget.
              </p>
            </Card>
            <Button
              onClick={onBuffer}
              className="w-full rounded-xl gradient-prism text-primary-foreground border-0"
            >
              Create RM35 Buffer
            </Button>
          </div>
        )}

        {modal === "limit" && (
          <div className="space-y-3">
            <Card className="p-4 bg-card border-border flex gap-3">
              <Zap size={18} className="text-primary shrink-0" />
              <p className="text-sm">
                Set shopping limit to RM90 and turn on intercept before checkout-like spending.
              </p>
            </Card>
            <Button
              onClick={onLimit}
              className="w-full rounded-xl gradient-prism text-primary-foreground border-0"
            >
              Activate Limit
            </Button>
          </div>
        )}

        {modal === "patterns" && (
          <div className="space-y-2">
            <DetailRow label="Food trend" value="Weekend delivery spikes" trend="up" />
            <DetailRow label="BNPL pressure" value="RM130 due this month" trend="up" />
            <DetailRow
              label="Discipline signal"
              value={mode === "lower" ? "Improving" : "Needs nudge"}
              trend={mode === "lower" ? "down" : "up"}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  label,
  value,
  trend: trendDirection,
}: {
  label: string;
  value: string;
  trend: "up" | "down";
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-accent/40 p-3">
      {trendDirection === "up" ? (
        <ArrowUpRight size={16} className="text-amber" />
      ) : (
        <ArrowDownRight size={16} className="text-mint" />
      )}
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[11px] text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-accent/50 px-2 py-2.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );
}
