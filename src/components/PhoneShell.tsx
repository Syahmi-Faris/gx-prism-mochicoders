import { Link, useLocation } from "@tanstack/react-router";
import { Home, ScanLine, Brain, PiggyBank, LineChart, User } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { TopBar } from "./TopBar";
import { useTheme } from "@/lib/theme";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/capture", label: "Capture", icon: ScanLine },
  { to: "/insights", label: "Insights", icon: Brain },
  { to: "/pockets", label: "Pockets", icon: PiggyBank },
  { to: "/market", label: "Market", icon: LineChart },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function PhoneShell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const init = useTheme((s) => s.init);
  useEffect(() => { init(); }, [init]);

  return (
    <div className="min-h-screen flex items-stretch md:items-center justify-center md:py-8">
      <div className="w-full md:max-w-[440px] md:rounded-[2.5rem] md:border md:border-border bg-background relative overflow-hidden md:h-[900px] flex flex-col shadow-elevated">
        <TopBar />
        <div className="flex-1 overflow-y-auto pb-24 scroll-smooth">{children}</div>
        <nav className="absolute bottom-0 inset-x-0 glass border-t border-border px-1.5 py-1.5 flex justify-between md:rounded-b-[2.5rem]">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(to);
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
