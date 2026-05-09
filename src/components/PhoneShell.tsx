import { Link, useLocation } from "@tanstack/react-router";
import { Home, ScanLine, Brain, ShieldAlert, PiggyBank } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/capture", label: "Capture", icon: ScanLine },
  { to: "/insights", label: "Insights", icon: Brain },
  { to: "/intercept", label: "Intercept", icon: ShieldAlert },
  { to: "/pockets", label: "Pockets", icon: PiggyBank },
] as const;

export function PhoneShell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  return (
    <div className="min-h-screen flex items-stretch md:items-center justify-center md:py-8">
      <div className="w-full md:max-w-[440px] md:rounded-[2.5rem] md:border md:border-white/10 md:shadow-[0_30px_120px_-30px_rgba(160,100,255,0.45)] bg-background relative overflow-hidden md:h-[900px] flex flex-col">
        <div className="flex-1 overflow-y-auto pb-28 scroll-smooth">{children}</div>
        <nav className="absolute bottom-0 inset-x-0 glass border-t border-white/10 px-2 py-2 flex justify-between md:rounded-b-[2.5rem]">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-[11px] transition ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`grid place-items-center h-9 w-9 rounded-xl transition ${
                    active ? "gradient-prism text-primary-foreground shadow-lg" : ""
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" size={18} />
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
