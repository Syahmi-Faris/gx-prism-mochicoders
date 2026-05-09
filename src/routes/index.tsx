import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Plus, ArrowUpRight, ScanLine, Mic, Banknote, Zap, TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Home — GX Prism" }] }),
  component: Home,
});

function Home() {
  const { recoveryPocket, recoveryNote, captured } = useApp();
  const recent = captured.slice(0, 4);

  return (
    <div className="px-5 pt-6 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Good evening</p>
          <h1 className="text-xl font-semibold">Aiman</h1>
        </div>
        <div className="h-10 w-10 rounded-full gradient-prism grid place-items-center text-primary-foreground font-semibold">A</div>
      </header>

      {/* Financial overview */}
      <Card className="p-5 gradient-prism text-primary-foreground border-0 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <p className="text-xs/none opacity-80 flex items-center gap-1.5"><Sparkles size={12}/> Safe-to-Spend today</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight">RM 42<span className="text-xl opacity-70">.00</span></p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
          <Stat label="Balance" value="RM 1,284" />
          <Stat label="Spent" value="RM 612" />
          <Stat label="Projected" value="RM 980" />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-card border-border">
          <p className="text-[11px] text-muted-foreground">Recovery Pocket</p>
          <p className="mt-1 text-2xl font-semibold text-mint">RM {recoveryPocket}</p>
          <p className="text-[11px] text-muted-foreground mt-1 leading-tight">{recoveryNote}</p>
        </Card>
        <Link to="/rewards">
          <Card className="p-4 bg-card border-border h-full">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1"><TrendingUp size={11}/> Rewards & Growth</p>
            <p className="mt-1 text-2xl font-semibold">7🔥</p>
            <p className="text-[11px] text-muted-foreground mt-1 leading-tight">Resilience streak · Market Observe</p>
          </Card>
        </Link>
      </div>

      <Link to="/capture" className="block">
        <Button className="w-full h-12 gradient-prism text-primary-foreground border-0 rounded-2xl text-base font-medium shadow-lg">
          <Plus className="mr-1" size={18}/> Smart Capture
        </Button>
      </Link>

      <div className="flex gap-2">
        <QuickTile to="/capture" icon={ScanLine} label="Scan" />
        <QuickTile to="/capture" icon={Mic} label="Voice" />
        <QuickTile to="/capture" icon={Banknote} label="Cash" />
        <QuickTile to="/intercept" icon={Zap} label="Intercept" />
      </div>

      {/* Recent activity */}
      <section>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-semibold">Recent Activity</h2>
            <p className="text-[11px] text-muted-foreground leading-tight max-w-[260px]">
              Auto-sync, screenshot scan, voice log, and quick cash capture.
            </p>
          </div>
          <Link to="/capture" className="text-[11px] text-primary flex items-center gap-1">View all <ArrowUpRight size={12}/></Link>
        </div>
        <div className="mt-3 space-y-2">
          {recent.map((c) => (
            <Card key={c.id} className="p-3 flex items-center gap-3 bg-card border-border">
              <div className="h-9 w-9 rounded-xl bg-accent grid place-items-center text-xs">{sourceIcon(c.source)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.merchant}</p>
                <p className="text-[11px] text-muted-foreground">{c.category} · {c.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">−RM {c.amount.toFixed(2)}</p>
                {c.needsReview && <Badge className="bg-amber/20 text-amber border-0 text-[10px] mt-0.5">Review</Badge>}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/15 px-2.5 py-2">
      <p className="opacity-75">{label}</p>
      <p className="font-semibold mt-0.5">{value}</p>
    </div>
  );
}

function QuickTile({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link to={to} className="flex-1">
      <Card className="p-3 bg-card border-border grid place-items-center gap-1">
        <Icon size={18} className="text-primary"/>
        <span className="text-[11px]">{label}</span>
      </Card>
    </Link>
  );
}

function sourceIcon(s: string) {
  if (s === "screenshot") return "🖼";
  if (s === "voice") return "🎙";
  if (s === "cash") return "💵";
  return "⚡";
}
