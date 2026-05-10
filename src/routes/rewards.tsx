import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { Flame, Gift, LineChart, ChevronLeft, Trophy, Ticket } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/rewards")({
  head: () => ({ meta: [{ title: "Rewards & Growth - GX Prism" }] }),
  component: RewardsLayout,
});

function RewardsLayout() {
  const loc = useLocation();
  const { streak, cashback, claimedRewards, claimReward, redirectToRecovery } = useApp();
  if (loc.pathname !== "/rewards") return <Outlet />;

  const claimCashback = () => {
    claimReward("cashback-boost", 1.5);
    toast.success(
      claimedRewards.includes("cashback-boost")
        ? "Reward already claimed"
        : "RM 1.50 cashback added",
    );
  };

  const useCheatToken = () => {
    if (claimedRewards.includes("cheat-day-token")) {
      toast("Cheat day token already used");
      return;
    }
    claimReward("cheat-day-token", 0);
    redirectToRecovery(10, "Cheat day token used: RM 10 still reserved");
    toast.success("Cheat day token converted into RM 10 recovery reserve");
  };

  return (
    <div className="px-5 pt-6 space-y-5">
      <header className="flex items-center gap-2">
        <Link to="/" className="h-9 w-9 rounded-xl bg-card grid place-items-center">
          <ChevronLeft size={16} />
        </Link>
        <div>
          <p className="text-xs text-muted-foreground">Stay motivated</p>
          <h1 className="text-2xl font-semibold">Rewards & Growth</h1>
        </div>
      </header>

      <Card className="p-5 gradient-prism text-primary-foreground border-0 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
        <div className="flex items-center gap-2">
          <Flame size={16} />
          <p className="text-sm">Resilience Streak</p>
        </div>
        <p className="text-4xl font-semibold mt-2">{streak} days</p>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${i < streak ? "bg-white" : "bg-white/25"}`}
            />
          ))}
        </div>
        <p className="text-[11px] opacity-80 mt-2">
          {Math.max(0, 14 - streak)} more days unlocks cashback boost x1.5
        </p>
      </Card>

      <Card className="p-4 bg-card border-border flex items-center gap-3">
        <Gift className="text-mint" size={20} />
        <div className="flex-1">
          <p className="text-sm font-medium">Cashback Rewards</p>
          <p className="text-[11px] text-muted-foreground">
            RM {cashback.toFixed(2)} earned this month
          </p>
        </div>
        <Button
          onClick={claimCashback}
          className="h-8 rounded-full bg-mint/20 text-mint border-0 hover:bg-mint/30"
        >
          {claimedRewards.includes("cashback-boost") ? "Claimed" : "Claim"}
        </Button>
      </Card>

      <Card className="p-4 bg-card border-border space-y-3">
        <div className="flex items-center gap-2">
          <Trophy size={17} className="text-primary" />
          <p className="text-sm font-medium">Milestones</p>
        </div>
        <Milestone title="3 no-BNPL days" status="Complete" />
        <Milestone title="RM 100 Recovery Pocket" status="In progress" />
        <Milestone title="7 days under food budget" status="Complete" />
      </Card>

      <Card className="p-4 bg-card border-border flex items-center gap-3">
        <Ticket className="text-amber" size={20} />
        <div className="flex-1">
          <p className="text-sm font-medium">Cheat Day Token</p>
          <p className="text-[11px] text-muted-foreground">
            Use once without breaking your streak.
          </p>
        </div>
        <Button
          onClick={useCheatToken}
          className="h-8 rounded-full bg-accent text-foreground border-0 hover:bg-accent/80"
        >
          {claimedRewards.includes("cheat-day-token") ? "Used" : "Use"}
        </Button>
      </Card>

      <Link to="/market">
        <Card className="p-4 bg-card border-border hover:bg-accent/40 transition">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-prism grid place-items-center text-primary-foreground">
              <LineChart size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Market Observe</p>
              <p className="text-[11px] text-muted-foreground">
                Beginner-friendly investment discovery - strictly educational
              </p>
            </div>
            <Badge className="bg-primary/15 text-primary border-0">Open</Badge>
          </div>
        </Card>
      </Link>
    </div>
  );
}

function Milestone({ title, status }: { title: string; status: string }) {
  const complete = status === "Complete";
  return (
    <div className="flex items-center justify-between rounded-2xl bg-accent/40 p-3">
      <p className="text-sm">{title}</p>
      <Badge className={`border-0 ${complete ? "bg-mint/20 text-mint" : "bg-amber/20 text-amber"}`}>
        {status}
      </Badge>
    </div>
  );
}
