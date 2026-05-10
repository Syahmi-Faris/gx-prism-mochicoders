import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useApp } from "@/lib/store";

export function TopBar() {
  const { captured, intercepts, recoveryPocket, user } = useApp();
  const [open, setOpen] = useState(false);
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const notifications = [
    {
      id: "n1",
      title: "Impulse intercepted",
      body: `RM ${recoveryPocket} redirected to Recovery Pocket.`,
      time: "Just now",
    },
    {
      id: "n2",
      title: "New insight",
      body: "Late-night spend pattern detected on weekends.",
      time: "2h ago",
    },
    {
      id: "n3",
      title: "Streak going strong",
      body: "7-day resilience streak — keep it up!",
      time: "Today",
    },
  ];

  return (
    <header className="sticky top-0 z-30 glass border-b border-border px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg gradient-prism grid place-items-center text-primary-foreground text-xs font-bold shadow-soft">
          GX
        </div>
        <span className="font-semibold tracking-tight">Prism</span>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Notifications"
              className="h-9 w-9 rounded-full border border-border bg-card grid place-items-center hover:bg-accent transition relative"
            >
              <Bell size={16} />
              {intercepts > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
              )}
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px]">
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-2">
              {notifications.map((n) => (
                <div key={n.id} className="rounded-xl border border-border bg-card p-3">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                </div>
              ))}
              <p className="text-[11px] text-muted-foreground pt-2">
                {captured.length} captured items today
              </p>
            </div>
          </SheetContent>
        </Sheet>
        <Link
          to="/profile"
          aria-label="Profile"
          className="h-9 w-9 rounded-full gradient-prism grid place-items-center text-primary-foreground text-xs font-semibold shadow-soft"
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}
