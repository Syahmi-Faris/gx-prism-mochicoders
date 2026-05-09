import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Gift, LineChart, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/rewards")({
  head: () => ({ meta: [{ title: "Rewards & Growth — GX Prism" }] }),
  component: RewardsLayout,
});

function RewardsLayout() {
  const loc = useLocation();
  if (loc.pathname !== "/rewards") return <Outlet/>;
  return (
    <div className="px-5 pt-6 space-y-5">
      <header className="flex items-center gap-2">
        <Link to="/" className="h-9 w-9 rounded-xl bg-surface grid place-items-center"><ChevronLeft size={16}/></Link>
        <div>
          <p className="text-xs text-muted-foreground">Stay motivated</p>
          <h1 className="text-2xl font-semibold">Rewards & Growth</h1>
        </div>
      </header>

      <Card className="p-5 gradient-prism text-primary-foreground border-0 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl"/>
        <div className="flex items-center gap-2"><Flame size={16}/><p className="text-sm">Resilience Streak</p></div>
        <p className="text-4xl font-semibold mt-2">7 days</p>
        <div className="mt-3 flex gap-1">
          {Array.from({length:14}).map((_,i)=>(
            <div key={i} className={`h-2 flex-1 rounded-full ${i<7?"bg-white":"bg-white/25"}`}/>
          ))}
        </div>
        <p className="text-[11px] opacity-80 mt-2">7 more days unlocks cashback boost x1.5</p>
      </Card>

      <Card className="p-4 bg-surface border-white/10 flex items-center gap-3">
        <Gift className="text-mint" size={20}/>
        <div className="flex-1">
          <p className="text-sm font-medium">Cashback Rewards</p>
          <p className="text-[11px] text-muted-foreground">RM 4.20 earned this month</p>
        </div>
        <Badge className="bg-mint/20 text-mint border-0">Active</Badge>
      </Card>

      <Link to="/rewards/market-observe">
        <Card className="p-4 bg-surface border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-prism grid place-items-center text-primary-foreground"><LineChart size={18}/></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Market Observe</p>
              <p className="text-[11px] text-muted-foreground">Beginner-friendly investment discovery — strictly educational</p>
            </div>
            <span className="text-prism">→</span>
          </div>
        </Card>
      </Link>
    </div>
  );
}
