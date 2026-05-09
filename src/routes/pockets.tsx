import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/lib/store";
import { PiggyBank, Shield, LifeBuoy, CalendarClock, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/pockets")({
  head: () => ({ meta: [{ title: "Pockets — GX Prism" }] }),
  component: Pockets,
});

function Pockets() {
  const { recoveryPocket, recoveryNote, savings, emergency } = useApp();
  return (
    <div className="px-5 pt-6 space-y-5">
      <header>
        <p className="text-xs text-muted-foreground">Auto-rebuild system</p>
        <h1 className="text-2xl font-semibold">Pockets</h1>
      </header>

      <PocketCard icon={PiggyBank} tone="mint" name="Savings Pocket" balance={savings} goal={500} sub="Round-up + weekly RM 20"/>
      <PocketCard icon={LifeBuoy} tone="prism" name="Recovery Pocket" balance={recoveryPocket} goal={100} sub={recoveryNote}/>
      <PocketCard icon={Shield} tone="amber" name="Emergency Buffer" balance={emergency} goal={1000} sub="Target: 1 month essentials"/>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock className="text-primary" size={16}/>
          <p className="text-sm font-medium">Payday Split</p>
          <span className="ml-auto text-[11px] text-muted-foreground">Next: 28th</span>
        </div>
        <div className="space-y-2">
          <SplitBar label="Essentials" pct={50} color="var(--prism)"/>
          <SplitBar label="Daily Spending" pct={25} color="var(--prism-2)"/>
          <SplitBar label="Savings Pocket" pct={15} color="var(--mint)"/>
          <SplitBar label="Emergency Buffer" pct={10} color="var(--amber)"/>
        </div>
      </Card>

      <Link to="/rewards">
        <Card className="p-4 bg-card border-border flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-prism grid place-items-center text-primary-foreground"><TrendingUp size={18}/></div>
          <div className="flex-1">
            <p className="text-sm font-medium">Rewards & Growth</p>
            <p className="text-[11px] text-muted-foreground">Resilience streaks, cashback, Market Observe</p>
          </div>
          <span className="text-primary text-sm">→</span>
        </Card>
      </Link>
    </div>
  );
}

function PocketCard({ icon: Icon, tone, name, balance, goal, sub }: any) {
  const pct = Math.min(100, (balance / goal) * 100);
  const toneCls = tone === "mint" ? "text-mint" : tone === "amber" ? "text-amber" : "text-primary";
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl bg-accent grid place-items-center ${toneCls}`}><Icon size={18}/></div>
        <div className="flex-1">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-[11px] text-muted-foreground">{sub}</p>
        </div>
        <p className={`text-lg font-semibold ${toneCls}`}>RM {balance}</p>
      </div>
      <Progress value={pct} className="mt-3 h-1.5"/>
      <p className="text-[10px] text-muted-foreground mt-1 text-right">RM {balance} / RM {goal}</p>
    </Card>
  );
}

function SplitBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1"><span>{label}</span><span className="text-muted-foreground">{pct}%</span></div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }}/>
      </div>
    </div>
  );
}
