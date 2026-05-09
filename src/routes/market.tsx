import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import { Info, LineChart } from "lucide-react";

export const Route = createFileRoute("/market")({
  head: () => ({ meta: [{ title: "Market — GX Prism" }] }),
  component: Market,
});

const series = (seed: number, trend = 1) =>
  Array.from({ length: 24 }, (_, i) => ({
    x: i,
    v: 100 + Math.sin(i / 2 + seed) * 6 + i * 0.4 * trend + Math.random() * 2,
  }));

const assets = [
  { name: "Gold", risk: "Low", riskTone: "mint", insight: "Stable growth over the past 6 months.", suit: "Suitable after RM 500 emergency savings milestone", data: series(1, 1), trend: "+4.2%" },
  { name: "Index Funds", risk: "Medium", riskTone: "prism", insight: "Tracks broad market — diversified by design.", suit: "Suitable after 1-month emergency buffer", data: series(2, 1.2), trend: "+6.1%" },
  { name: "Low-Risk Funds", risk: "Low", riskTone: "mint", insight: "Capital preservation focus, modest yield.", suit: "Suitable for first-time investors", data: series(3, 0.6), trend: "+2.4%" },
  { name: "Blue-Chip Stocks", risk: "High", riskTone: "amber", insight: "Established companies, higher volatility.", suit: "Suitable after 3-month emergency buffer", data: series(4, 1.5), trend: "+8.7%" },
];

function Market() {
  return (
    <div className="px-5 pt-6 space-y-4">
      <header className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl gradient-prism grid place-items-center text-primary-foreground shadow-soft">
          <LineChart size={18} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Beginner-friendly · Educational</p>
          <h1 className="text-2xl font-semibold">Market Observe</h1>
        </div>
      </header>

      <Card className="p-3 bg-accent border-border flex items-start gap-2">
        <Info size={14} className="text-primary mt-0.5" />
        <p className="text-[12px] text-muted-foreground leading-snug">
          Learn before you invest. We never push "Buy Now" — only suitability based on your resilience milestones.
        </p>
      </Card>

      {assets.map((a) => (
        <Card key={a.name} className="p-4 bg-card border-border shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold">{a.name}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">{a.insight}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-mint">{a.trend}</p>
              <Badge className={`mt-1 border-0 text-[10px] ${
                a.riskTone === "mint" ? "bg-mint/15 text-mint" :
                a.riskTone === "amber" ? "bg-amber/15 text-amber" : "bg-primary/15 text-primary"
              }`}>{a.risk} risk</Badge>
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
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11, color: "var(--foreground)" }} labelFormatter={() => ""} />
                <Area type="monotone" dataKey="v" stroke="var(--prism)" strokeWidth={2} fill={`url(#g-${a.name})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-muted-foreground mt-1">{a.suit}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            <Btn label="View Chart" primary />
            <Btn label="Learn Why" />
            <Btn label="Check Suitability" />
            <Btn label="Explore Fund" />
          </div>
        </Card>
      ))}

      <Link to="/rewards" className="block text-center text-[12px] text-primary py-3">
        ← Back to Rewards & Growth
      </Link>
    </div>
  );
}

function Btn({ label, primary }: { label: string; primary?: boolean }) {
  return (
    <Button className={`h-7 px-3 text-[11px] rounded-full border-0 ${primary ? "gradient-prism text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}>
      {label}
    </Button>
  );
}
