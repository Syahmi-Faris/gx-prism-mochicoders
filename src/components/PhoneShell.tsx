import { Link, useLocation } from "@tanstack/react-router";
import { Home, ScanLine, Brain, PiggyBank, LineChart } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { TopBar } from "./TopBar";
import { useTheme } from "@/lib/theme";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/capture", label: "Capture", icon: ScanLine },
  { to: "/insights", label: "Insights", icon: Brain },
  { to: "/pockets", label: "Pockets", icon: PiggyBank },
  { to: "/market", label: "Market", icon: LineChart },
] as const;

function isActive(pathname: string, to: string) {
  return to === "/" ? pathname === "/" : pathname.startsWith(to);
}

export function PhoneShell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const init = useTheme((s) => s.init);
  useEffect(() => { init(); }, [init]);

  return (
    <div className="min-h-screen flex items-stretch md:items-center justify-center md:py-8 md:gap-6">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] h-[900px] rounded-[2rem] border border-border bg-card shadow-elevated p-4">
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <div className="h-8 w-8 rounded-lg gradient-prism grid place-items-center text-primary-foreground text-xs font-bold shadow-soft">GX</div>
          <span className="font-semibold tracking-tight">Prism</span>
        </Link>
        <nav className="mt-4 flex flex-col gap-1">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = isActive(loc.pathname, to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  active
                    ? "gradient-prism text-primary-foreground shadow-soft font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
        <p className="mt-auto text-[10px] text-muted-foreground px-2">GX Prism · Prototype</p>
      </aside>

      {/* Phone frame */}
      <div className="w-full md:max-w-[440px] md:rounded-[2.5rem] md:border md:border-border bg-background relative overflow-hidden md:h-[900px] flex flex-col shadow-elevated">
        <TopBar />
        <div className="flex-1 overflow-y-auto pb-24 md:pb-6 scroll-smooth">{children}</div>

        {/* Mobile bottom nav */}
        <nav className="md:hidden absolute bottom-0 inset-x-0 glass border-t border-border px-1.5 py-1.5 flex justify-between">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = isActive(loc.pathname, to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-[10px] transition ${
                  active ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`grid place-items-center h-8 w-8 rounded-xl transition ${
                    active ? "gradient-prism text-primary-foreground shadow-soft" : ""
                  }`}
                >
                  <Icon size={16} />
                </span>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
