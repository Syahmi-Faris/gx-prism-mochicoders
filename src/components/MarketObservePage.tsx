import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import {
  Info,
  LineChart,
  ChevronLeft,
  BookOpen,
  ShieldCheck,
  SearchCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

const series = (seed: number, trend = 1) =>
  Array.from({ length: 24 }, (_, i) => ({
    x: i,
    v: 100 + Math.sin(i / 2 + seed) * 6 + i * 0.4 * trend,
  }));

const assets = [
  {
    name: "Gold",
    risk: "Low",
    riskTone: "mint",
    insight: "Stable growth over the past 6 months.",
    suit: "Suitable after RM 500 emergency savings milestone",
    why: "Often used as a defensive asset when students want to learn about inflation protection and diversification.",
    facts: [
      "May move differently from stocks",
      "Still has price swings",
      "Usually observed for medium-term goals",
    ],
    caution:
      "Do not treat gold as guaranteed profit. It can fall when currency or rate conditions change.",
    starter: "Observe monthly movement first; no buying action is shown in this prototype.",
    data: series(1, 1),
    trend: "+4.2%",
  },
  {
    name: "Index Funds",
    risk: "Medium",
    riskTone: "prism",
    insight: "Tracks broad market - diversified by design.",
    suit: "Suitable after 1-month emergency buffer",
    why: "Useful for learning long-term diversified investing without focusing on one company.",
    facts: [
      "Diversifies across many companies",
      "Performance follows market cycles",
      "Best understood with a long horizon",
    ],
    caution: "Market value can drop during downturns, so emergency cash should come first.",
    starter:
      "Watch broad market trend and learn what dollar-cost averaging means before committing money.",
    data: series(2, 1.2),
    trend: "+6.1%",
  },
  {
    name: "Low-Risk Funds",
    risk: "Low",
    riskTone: "mint",
    insight: "Capital preservation focus, modest yield.",
    suit: "Suitable for first-time investors",
    why: "A calmer entry point for youth who are still building confidence and emergency savings.",
    facts: [
      "Lower expected return",
      "Lower volatility than stocks",
      "Often used for short-term parking",
    ],
    caution: "Low risk does not mean zero risk, and returns may not beat inflation.",
    starter: "Compare yield, fees, and withdrawal access before considering any real product.",
    data: series(3, 0.6),
    trend: "+2.4%",
  },
  {
    name: "Blue-Chip Stocks",
    risk: "High",
    riskTone: "amber",
    insight: "Established companies, higher volatility.",
    suit: "Suitable after 3-month emergency buffer",
    why: "Good for learning company fundamentals, dividends, and how news affects prices.",
    facts: [
      "Single-company risk is higher",
      "News can move prices quickly",
      "Requires more research discipline",
    ],
    caution:
      "Avoid buying because of hype. This category should stay locked until resilience is stronger.",
    starter:
      "Observe company quality signals and price movement; keep it educational until buffer is ready.",
    data: series(4, 1.5),
    trend: "+8.7%",
  },
];

type Asset = (typeof assets)[number];

export function MarketObservePage({ showBackToRewards = false }: { showBackToRewards?: boolean }) {
  const { watchedAssets, toggleWatchedAsset, emergency } = useApp();
  const [selected, setSelected] = useState<Asset | null>(null);
  const [mode, setMode] = useState<"chart" | "learn" | "suitability" | "explore" | "plan" | null>(
    null,
  );

  const open = (asset: Asset, nextMode: "chart" | "learn" | "suitability" | "explore" | "plan") => {
    setSelected(asset);
    setMode(nextMode);
  };

  const togglePlan = (asset: Asset) => {
    toggleWatchedAsset(asset.name);
    toast.success(
      watchedAssets.includes(asset.name)
        ? `${asset.name} removed from Growth Plan`
        : `${asset.name} added to Growth Plan`,
    );
  };

  return (
    <div className="px-5 pt-6 space-y-4">
      <header className="flex items-center gap-3">
        {showBackToRewards && (
          <Link to="/rewards" className="h-9 w-9 rounded-xl bg-card grid place-items-center">
            <ChevronLeft size={16} />
          </Link>
        )}
        <div className="h-10 w-10 rounded-xl gradient-prism grid place-items-center text-primary-foreground shadow-soft">
          <LineChart size={18} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Beginner-friendly - Educational</p>
          <h1 className="text-2xl font-semibold">Market Observe</h1>
        </div>
      </header>

      <Card className="p-3 bg-accent border-border flex items-start gap-2">
        <Info size={14} className="text-primary mt-0.5" />
        <p className="text-[12px] text-muted-foreground leading-snug">
          Learn before you invest. GX Prism only unlocks suitability guidance after resilience
          milestones.
        </p>
      </Card>

      {assets.map((a) => {
        const watched = watchedAssets.includes(a.name);
        return (
          <Card key={a.name} className="p-4 bg-card border-border shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold">{a.name}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{a.insight}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-mint">{a.trend}</p>
                <Badge
                  className={`mt-1 border-0 text-[10px] ${
                    a.riskTone === "mint"
                      ? "bg-mint/15 text-mint"
                      : a.riskTone === "amber"
                        ? "bg-amber/15 text-amber"
                        : "bg-primary/15 text-primary"
                  }`}
                >
                  {a.risk} risk
                </Badge>
              </div>
            </div>

            <div className="h-20 mt-2 -mx-1">
              <ResponsiveContainer>
                <AreaChart data={a.data}>
                  <defs>
                    <linearGradient id={`g-${a.name}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--prism)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--prism)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 11,
                      color: "var(--foreground)",
                    }}
                    labelFormatter={() => ""}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="var(--prism)"
                    strokeWidth={2}
                    fill={`url(#g-${a.name})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-muted-foreground mt-1">{a.suit}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <Btn label="View Chart" primary onClick={() => open(a, "chart")} />
              <Btn label="Learn Why" onClick={() => open(a, "learn")} />
              <Btn label="Check Suitability" onClick={() => open(a, "suitability")} />
              <Btn label="Explore Fund" onClick={() => open(a, "explore")} />
              <Btn
                label={watched ? "In Growth Plan" : "Add to Growth Plan"}
                onClick={() => open(a, "plan")}
                active={watched}
              />
            </div>
          </Card>
        );
      })}

      {showBackToRewards && (
        <Link to="/rewards" className="block text-center text-[12px] text-primary py-3">
          Back to Rewards & Growth
        </Link>
      )}

      <Dialog
        open={Boolean(selected && mode)}
        onOpenChange={(openState) => !openState && setMode(null)}
      >
        <DialogContent className="max-w-[390px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>
              {mode === "chart"
                ? "Simple trend view for learning."
                : mode === "learn"
                  ? "Why this appears in Market Observe."
                  : mode === "suitability"
                    ? "Suitability based on your current resilience."
                    : mode === "explore"
                      ? "Educational facts before any real investing."
                      : "Add this asset to your educational watchlist."}
            </DialogDescription>
          </DialogHeader>

          {mode === "chart" && selected && (
            <div className="space-y-3">
              <div className="h-44 rounded-2xl bg-accent/30 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selected.data}>
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 11,
                      }}
                      labelFormatter={() => ""}
                    />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="var(--prism)"
                      strokeWidth={2}
                      fill="var(--accent)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Metric label="6m trend" value={selected.trend} />
                <Metric label="Risk" value={selected.risk} />
                <Metric label="Goal" value="Observe" />
              </div>
            </div>
          )}

          {mode === "learn" && selected && (
            <div className="space-y-2">
              <InfoCard
                icon={BookOpen}
                title="Why it appears"
                body={`${selected.insight} ${selected.why}`}
              />
              <InfoCard
                icon={ShieldCheck}
                title="Resilience rule"
                body="GX Prism keeps this educational, with no one-tap buy action, because saving discipline and emergency cash come first."
              />
            </div>
          )}

          {mode === "suitability" && selected && (
            <div className="space-y-2">
              <InfoCard
                icon={ShieldCheck}
                title={
                  emergency >= 500 || selected.risk === "Low"
                    ? "Suitable to observe"
                    : "Build buffer first"
                }
                body={`${selected.suit}. Current emergency buffer: RM ${emergency}.`}
              />
              <div className="rounded-2xl bg-accent/40 p-3">
                <div className="h-2 rounded-full bg-card overflow-hidden">
                  <div
                    className="h-full rounded-full gradient-prism"
                    style={{ width: `${Math.min(100, (emergency / 500) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  RM {Math.max(0, 500 - emergency)} more to reach the first observe milestone.
                </p>
              </div>
            </div>
          )}

          {mode === "explore" && selected && (
            <div className="space-y-2">
              {selected.facts.map((fact) => (
                <InfoCard key={fact} icon={SearchCheck} title="Fund fact" body={fact} />
              ))}
              <InfoCard icon={Info} title="Caution" body={selected.caution} tone="amber" />
            </div>
          )}

          {mode === "plan" && selected && (
            <div className="space-y-3">
              <InfoCard icon={Target} title="Growth Plan use" body={selected.starter} />
              <InfoCard
                icon={TrendingUp}
                title="What happens next"
                body="GX Prism will keep it in your watchlist for learning prompts. It will not create a purchase flow."
              />
              <Button
                onClick={() => togglePlan(selected)}
                className="w-full rounded-xl gradient-prism text-primary-foreground border-0"
              >
                {watchedAssets.includes(selected.name)
                  ? "Remove from Growth Plan"
                  : "Add to Growth Plan"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
  tone = "primary",
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  tone?: "primary" | "amber";
}) {
  return (
    <Card className="p-4 bg-card border-border flex gap-3">
      <Icon size={18} className={`${tone === "amber" ? "text-amber" : "text-primary"} shrink-0`} />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-[12px] text-muted-foreground mt-1 leading-snug">{body}</p>
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-accent/40 px-2 py-3">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );
}

function Btn({
  label,
  primary,
  active,
  onClick,
}: {
  label: string;
  primary?: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className={`h-7 px-3 text-[11px] rounded-full border-0 ${
        primary
          ? "gradient-prism text-primary-foreground"
          : active
            ? "bg-mint/20 text-mint"
            : "bg-accent text-accent-foreground hover:bg-accent/80"
      }`}
    >
      {label}
    </Button>
  );
}
