import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/store";
import { buildFinanceSummary, money } from "@/lib/finance";
import {
  PiggyBank,
  Shield,
  LifeBuoy,
  CalendarClock,
  TrendingUp,
  RotateCcw,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/pockets")({
  head: () => ({ meta: [{ title: "Pockets - GX Prism" }] }),
  component: Pockets,
});

function Pockets() {
  const {
    recoveryPocket,
    recoveryNote,
    savings,
    emergency,
    savingsRules,
    toggleSavingsRule,
    addToSavings,
    addToEmergency,
    redirectToRecovery,
    captured,
  } = useApp();
  const summary = buildFinanceSummary(captured, savings, recoveryPocket, emergency, savingsRules);

  const simulateRoundUp = () => {
    addToSavings(3, "Round-up from today's small purchases");
    toast.success("RM 3 round-up moved to Savings Pocket");
  };

  const simulatePayday = () => {
    addToSavings(270, "Payday split added RM 270 to Savings Pocket");
    addToEmergency(180);
    redirectToRecovery(45, "Payday split reserved RM 45 for recovery");
    toast.success("Payday split simulated");
  };

  return (
    <div className="px-5 pt-6 space-y-5">
      <header>
        <p className="text-xs text-muted-foreground">Auto-rebuild system</p>
        <h1 className="text-2xl font-semibold">Pockets</h1>
      </header>

      <PocketCard
        icon={PiggyBank}
        tone="mint"
        name="Savings Pocket"
        balance={savings}
        goal={500}
        sub="Round-up + weekly RM 20"
      />
      <PocketCard
        icon={LifeBuoy}
        tone="prism"
        name="Recovery Pocket"
        balance={recoveryPocket}
        goal={100}
        sub={recoveryNote}
      />
      <PocketCard
        icon={Shield}
        tone="amber"
        name="Emergency Buffer"
        balance={emergency}
        goal={1000}
        sub="Target: 1 month essentials"
      />

      <Card className="p-4 bg-card border-border space-y-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="text-primary" size={16} />
          <p className="text-sm font-medium">Automation Rules</p>
        </div>
        <RuleRow
          label="Round-up savings"
          detail="Round every spend to the next RM and save the difference."
          checked={savingsRules.roundUp}
          onCheckedChange={() => {
            toggleSavingsRule("roundUp");
            toast.success("Round-up rule updated");
          }}
        />
        <RuleRow
          label="Weekly RM 20 reserve"
          detail="Move RM 20 every Sunday if safe-to-spend stays positive."
          checked={savingsRules.weeklyReserve}
          onCheckedChange={() => {
            toggleSavingsRule("weeklyReserve");
            toast.success("Weekly reserve rule updated");
          }}
        />
        <RuleRow
          label="Payday split"
          detail="Separate salary into essentials, daily spend, savings, and buffer."
          checked={savingsRules.paydaySplit}
          onCheckedChange={() => {
            toggleSavingsRule("paydaySplit");
            toast.success("Payday split rule updated");
          }}
        />
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            onClick={simulateRoundUp}
            className="rounded-xl bg-accent text-foreground border-0 hover:bg-accent/80"
          >
            Simulate Round-up
          </Button>
          <Button
            onClick={simulatePayday}
            className="rounded-xl gradient-prism text-primary-foreground border-0"
          >
            Simulate Payday
          </Button>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock className="text-primary" size={16} />
          <p className="text-sm font-medium">Payday Split</p>
          <span className="ml-auto text-[11px] text-muted-foreground">Next: 28th</span>
        </div>
        <div className="space-y-2">
          <SplitBar label="Essentials" pct={50} color="var(--prism)" />
          <SplitBar label="Daily Spending" pct={25} color="var(--prism-2)" />
          <SplitBar label="Savings Pocket" pct={15} color="var(--mint)" />
          <SplitBar label="Emergency Buffer" pct={10} color="var(--amber)" />
        </div>
        <div className="mt-3 rounded-2xl bg-primary/10 border border-primary/20 p-3 flex gap-2">
          <WalletCards size={15} className="text-primary mt-0.5 shrink-0" />
          <p className="text-[12px] leading-snug">
            Based on {money(summary.income)} captured monthly income, GX Prism protects essentials
            before flexible spending.
          </p>
        </div>
      </Card>

      <Link to="/rewards">
        <Card className="p-4 bg-card border-border flex items-center gap-3 hover:bg-accent/40 transition">
          <div className="h-10 w-10 rounded-xl gradient-prism grid place-items-center text-primary-foreground">
            <TrendingUp size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Rewards & Growth</p>
            <p className="text-[11px] text-muted-foreground">
              Resilience streaks, cashback, Market Observe
            </p>
          </div>
          <span className="text-primary text-sm">Next</span>
        </Card>
      </Link>
    </div>
  );
}

function PocketCard({
  icon: Icon,
  tone,
  name,
  balance,
  goal,
  sub,
}: {
  icon: LucideIcon;
  tone: "mint" | "prism" | "amber";
  name: string;
  balance: number;
  goal: number;
  sub: string;
}) {
  const pct = Math.min(100, (balance / goal) * 100);
  const toneCls = tone === "mint" ? "text-mint" : tone === "amber" ? "text-amber" : "text-primary";
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl bg-accent grid place-items-center ${toneCls}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-[11px] text-muted-foreground">{sub}</p>
        </div>
        <p className={`text-lg font-semibold ${toneCls}`}>RM {balance}</p>
      </div>
      <Progress value={pct} className="mt-3 h-1.5" />
      <p className="text-[10px] text-muted-foreground mt-1 text-right">
        RM {balance} / RM {goal}
      </p>
    </Card>
  );
}

function RuleRow({
  label,
  detail,
  checked,
  onCheckedChange,
}: {
  label: string;
  detail: string;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-accent/40 p-3">
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{detail}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function SplitBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span>{label}</span>
        <span className="text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
