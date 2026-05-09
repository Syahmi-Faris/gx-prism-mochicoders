import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  ChevronRight, User as UserIcon, Bell, Shield, Palette, Sun, Moon, Trash2, Pencil,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — GX Prism" }] }),
  component: Profile,
});

function Profile() {
  const { user, resilienceScore, intercepts, recoveryPocket } = useApp();
  const { theme, toggle } = useTheme();
  const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const [deleted, setDeleted] = useState(false);

  return (
    <div className="px-5 pt-6 space-y-5">
      <header>
        <p className="text-xs text-muted-foreground">Your account</p>
        <h1 className="text-2xl font-semibold">Profile</h1>
      </header>

      {/* Identity card */}
      <Card className="p-5 bg-card border-border shadow-soft">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl gradient-prism grid place-items-center text-primary-foreground text-xl font-semibold shadow-soft">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <Badge className="mt-1.5 bg-primary/15 text-primary border-0">{user.membership}</Badge>
          </div>
        </div>
      </Card>

      {/* Account stats */}
      <Card className="p-4 bg-card border-border shadow-soft">
        <p className="text-xs text-muted-foreground">Account information</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Stat label="Joined" value={user.joinDate} />
          <Stat label="Intercepts" value={String(intercepts)} />
          <Stat label="Recovery" value={`RM ${recoveryPocket}`} />
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Financial Resilience Score</p>
            <p className="text-sm font-semibold text-primary">{resilienceScore}/100</p>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full gradient-prism" style={{ width: `${resilienceScore}%` }} />
          </div>
        </div>
      </Card>

      {/* Settings */}
      <section>
        <p className="text-xs text-muted-foreground px-1 mb-2">Settings</p>
        <Card className="bg-card border-border shadow-soft divide-y divide-border overflow-hidden">
          <Row icon={Pencil} label="Edit Profile" onClick={() => toast("Edit Profile — prototype")} />
          <Row icon={Bell} label="Notification Preferences" onClick={() => toast("Notifications — prototype")} />
          <Row icon={Shield} label="Security Settings" onClick={() => toast("Security — prototype")} />
          <Row
            icon={theme === "dark" ? Moon : Sun}
            label="Theme Preference"
            value={theme === "dark" ? "Dark" : "Light"}
            onClick={toggle}
          />
          <Row icon={Palette} label="Appearance" value="Default" onClick={() => toast("Appearance — prototype")} />
        </Card>
      </section>

      {/* Danger zone */}
      <section>
        <p className="text-xs text-muted-foreground px-1 mb-2">Danger zone</p>
        <Card className="p-4 bg-card border-destructive/30 shadow-soft">
          <p className="text-sm font-medium">Delete Account</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Permanently remove your GX Prism account and all data.</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="mt-3 w-full border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 size={14} className="mr-1.5" /> Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All your captures, pockets, and resilience progress will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => { setDeleted(true); toast.success("Account deletion simulated"); }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {deleted && (
            <p className="text-[11px] text-destructive mt-2">Demo: account deletion confirmed.</p>
          )}
        </Card>
      </section>

      <Link to="/" className="block text-center text-[12px] text-primary py-3">← Back to Home</Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted py-2.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );
}

function Row({
  icon: Icon, label, value, onClick,
}: { icon: any; label: string; value?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/40 transition text-left">
      <div className="h-8 w-8 rounded-lg bg-accent grid place-items-center text-primary"><Icon size={15} /></div>
      <span className="flex-1 text-sm">{label}</span>
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
      <ChevronRight size={14} className="text-muted-foreground" />
    </button>
  );
}

// suppress unused import warning
void UserIcon;
