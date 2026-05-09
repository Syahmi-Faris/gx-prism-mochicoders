import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { Sparkles, TrendingUp, Moon, Utensils, ShoppingBag } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from "recharts";

export const Route = createFileRoute("/insights")({
  head: () => ({ meta: [{ title: "Behaviour Insights — GX Prism" }] }),
  component: Insights,
});

const week = [
  { d: "Mon", v: 24 }, { d: "Tue", v: 38 }, { d: "Wed", v: 18 },
  { d: "Thu", v: 62 }, { d: "Fri", v: 88 }, { d: "Sat", v: 110 }, { d: "Sun", v: 46 },
];

function Insights() {
  const { interceptOn, toggleIntercept } = useApp();
  return (
    <div className="px-5 pt-6 space-y-5">
      <header>
        <p className="text-xs text-muted-foreground flex items-center gap-1"><Sparkles size={12} className="text-primary"/> AI behaviour engine</p>
        <h1 className="text-2xl font-semibold">Behaviour Insights</h1>
      </header>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Spending Pattern · This week</p>
          <Badge className="bg-amber/20 text-amber border-0 text-[10px]">+27% Fri-Sat</Badge>
        </div>
        <div className="h-36">
          <ResponsiveContainer>
            <BarChart data={week}>
              <XAxis dataKey="d" tick={{ fill: "oklch(0.72 0.025 280)", fontSize: 10 }} axisLine={false} tickLine={false}/>
              <Tooltip cursor={{fill:"rgba(255,255,255,0.05)"}} contentStyle={{background:"oklch(0.21 0.035 280)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, fontSize:12}}/>
              <Bar dataKey="v" radius={[6,6,0,0]}>
                {week.map((d, i) => <Cell key={i} fill={d.v > 60 ? "var(--amber)" : "var(--prism)"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">AI Recommendations</h2>

        <InsightCard
          icon={<Utensils size={16}/>}
          title="You overspend on food delivery during exam week"
          detail="Avg +RM 48/week. Pattern detected over last 3 assessment periods."
          actions={[
            { label: "Set Limit", primary: true },
            { label: interceptOn["food-delivery"] ? "Intercept ON ✓" : "Turn On Intercept", onClick: () => toggleIntercept("food-delivery"), active: interceptOn["food-delivery"] },
          ]}
        />

        <InsightCard
          icon={<Moon size={16}/>}
          title="Late-night purchases above RM 80 trending up"
          detail="You usually regret these. Consider an intercept window 11pm–2am."
          actions={[
            { label: "Create Buffer" },
            { label: "View Pattern" },
          ]}
        />

        <InsightCard
          icon={<ShoppingBag size={16}/>}
          title="3 BNPL repayments due this month"
          detail="Redirect a portion to Recovery Pocket to break the cycle."
          actions={[
            { label: "Create Buffer", primary: true },
            { label: "View Pattern" },
          ]}
        />
      </section>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium flex items-center gap-2"><TrendingUp size={14} className="text-mint"/> Monthly Summary</p>
          <span className="text-[11px] text-muted-foreground">10s overview</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Mini label="Income" value="RM 1,800" tone="text-mint"/>
          <Mini label="Spent" value="RM 612"/>
          <Mini label="Projected" value="RM 980" tone="text-amber"/>
        </div>
      </Card>

      <Link to="/intercept">
        <Button className="w-full h-12 gradient-prism text-primary-foreground border-0 rounded-2xl">
          Try Impulse Intercept demo
        </Button>
      </Link>
    </div>
  );
}

function InsightCard({ icon, title, detail, actions }: any) {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl gradient-prism grid place-items-center text-primary-foreground shrink-0">{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium leading-snug">{title}</p>
          <p className="text-[12px] text-muted-foreground mt-1 leading-snug">{detail}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {actions.map((a: any, i: number) => (
              <Button
                key={i}
                onClick={a.onClick}
                className={`h-8 px-3 text-xs rounded-full border-0 ${
                  a.primary ? "gradient-prism text-primary-foreground" :
                  a.active ? "bg-mint/20 text-mint" : "bg-accent text-foreground"
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
