import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/lib/store";
import { buildFinanceSummary, money, trendByDate } from "@/lib/finance";
import { Sparkles, TrendingUp, Moon, Utensils, ShoppingBag, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/insights")({
  head: () => ({ meta: [{ title: "Behaviour Insights - GX Prism" }] }),
  component: Insights,
});

function Insights() {
  const {
    interceptOn,
    toggleIntercept,
    setLimit,
    limits,
    redirectToRecovery,
    addToEmergency,
    captured,
    savings,
    recoveryPocket,
    emergency,
    savingsRules,
  } = useApp();
  const [limitOpen, setLimitOpen] = useState(false);
  const [limitValue, setLimitValue] = useState(String(limits.food ?? 45));
  const [pattern, setPattern] = useState<string | null>(null);
  const summary = buildFinanceSummary(captured, savings, recoveryPocket, emergency, savingsRules);
  const week = trendByDate(captured);

  const saveLimit = () => {
    const n = Number(limitValue);
    if (!n) {
      toast.error("Enter a valid limit");
      return;
    }
    setLimit("food", n);
    setLimitOpen(false);
    toast.success(`Food delivery limit set to RM ${n}`);
  };

  const createBuffer = (amount: number, note: string) => {
    redirectToRecovery(amount, note);
    toast.success(`RM ${amount} moved to Recovery Pocket`);
  };

  const createEmergencyBuffer = () => {
    addToEmergency(30);
    toast.success("RM 30 added to Emergency Buffer");
  };

  return (
    <div className="px-5 pt-6 space-y-5">
      <header>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Sparkles size={12} className="text-primary" /> AI behaviour engine
        </p>
        <h1 className="text-2xl font-semibold">Behaviour Insights</h1>
      </header>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Spending Pattern - This week</p>
          <Badge className="bg-amber/20 text-amber border-0 text-[10px]">+27% Fri-Sat</Badge>
        </div>
        <div className="h-36">
          <ResponsiveContainer>
            <BarChart data={week}>
              <XAxis
                dataKey="day"
                tick={{ fill: "oklch(0.72 0.025 280)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                contentStyle={{
                  background: "oklch(0.21 0.035 280)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {week.map((d, i) => (
                  <Cell key={i} fill={d.value > 60 ? "var(--amber)" : "var(--prism)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">AI Recommendations</h2>

        <InsightCard
          icon={<Utensils size={16} />}
          title="Food delivery spikes during exam week"
          detail={`Captured spending is ${money(summary.spending)} this month. Current limit: ${limits.food ? `RM ${limits.food}` : "not set"}.`}
          actions={[
            { label: "Set Limit", primary: true, onClick: () => setLimitOpen(true) },
            {
              label: interceptOn["food-delivery"] ? "Intercept ON" : "Turn On Intercept",
              onClick: () => {
                toggleIntercept("food-delivery");
                toast.success(
                  interceptOn["food-delivery"]
                    ? "Food delivery intercept turned off"
                    : "Food delivery intercept turned on",
                );
              },
              active: interceptOn["food-delivery"],
            },
          ]}
        />

        <InsightCard
          icon={<Moon size={16} />}
          title="Late-night purchases above RM 80 trending up"
          detail="Most happen between 11pm and 2am after social media browsing."
          actions={[
            {
              label: "Create Buffer",
              primary: true,
              onClick: () => createBuffer(25, "Late-night buffer created from risky spend pattern"),
            },
            { label: "View Pattern", onClick: () => setPattern("late-night") },
          ]}
        />

        <InsightCard
          icon={<ShoppingBag size={16} />}
          title="3 BNPL repayments due this month"
          detail={`BNPL and shopping spend affect your ${money(summary.safeToSpend)} safe-to-spend.`}
          actions={[
            { label: "Create Buffer", primary: true, onClick: createEmergencyBuffer },
            { label: "View Pattern", onClick: () => setPattern("bnpl") },
          ]}
        />
      </section>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium flex items-center gap-2">
            <TrendingUp size={14} className="text-mint" /> Monthly Summary
          </p>
          <span className="text-[11px] text-muted-foreground">10s overview</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Mini label="Income" value={money(summary.income)} tone="text-mint" />
          <Mini label="Spent" value={money(summary.spending)} />
          <Mini label="Projected" value={money(summary.projected)} tone="text-amber" />
        </div>
      </Card>

      <Link to="/intercept">
        <Button className="w-full h-12 gradient-prism text-primary-foreground border-0 rounded-2xl">
          Try Impulse Intercept demo
        </Button>
      </Link>

      <Dialog open={limitOpen} onOpenChange={setLimitOpen}>
        <DialogContent className="max-w-[360px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Set Food Delivery Limit</DialogTitle>
            <DialogDescription>
              GX Prism will nudge you before this budget is crossed.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              RM
            </span>
            <Input
              value={limitValue}
              onChange={(e) => setLimitValue(e.target.value)}
              inputMode="numeric"
              className="pl-9"
            />
          </div>
          <Button
            onClick={saveLimit}
            className="gradient-prism text-primary-foreground border-0 rounded-xl"
          >
            Save Limit
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(pattern)} onOpenChange={(open) => !open && setPattern(null)}>
        <DialogContent className="max-w-[380px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>{pattern === "bnpl" ? "BNPL Pattern" : "Late-night Pattern"}</DialogTitle>
            <DialogDescription>
              Personalised guidance generated from recent behaviour.
            </DialogDescription>
          </DialogHeader>
          <Card className="p-4 bg-card border-border space-y-2">
            {pattern === "bnpl" ? (
              <>
                <Row label="Due this month" value="RM 267" />
                <Row label="Risk" value="Essentials budget drops below RM 40" />
                <Row label="Suggested action" value="Reserve RM 30 weekly" />
              </>
            ) : (
              <>
                <Row label="Peak window" value="11pm-2am" />
                <Row label="Average purchase" value="RM 86" />
                <Row label="Suggested action" value="24-hour delay nudge" />
              </>
            )}
          </Card>
          <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3 flex gap-2">
            <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
            <p className="text-[12px] leading-snug">
              This is a prototype insight. The next action updates local app state so judges can see
              the flow.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type InsightAction = {
  label: string;
  primary?: boolean;
  active?: boolean;
  onClick: () => void;
};

function InsightCard({
  icon,
  title,
  detail,
  actions,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  actions: InsightAction[];
}) {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl gradient-prism grid place-items-center text-primary-foreground shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium leading-snug">{title}</p>
          <p className="text-[12px] text-muted-foreground mt-1 leading-snug">{detail}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {actions.map((a, i) => (
              <Button
                key={i}
                onClick={a.onClick}
                className={`h-8 px-3 text-xs rounded-full border-0 ${
                  a.primary
                    ? "gradient-prism text-primary-foreground"
                    : a.active
                      ? "bg-mint/20 text-mint"
                      : "bg-accent text-foreground"
                }`}
              >
                {a.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl bg-accent/50 px-2 py-2.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold mt-0.5 ${tone ?? ""}`}>{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[12px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
