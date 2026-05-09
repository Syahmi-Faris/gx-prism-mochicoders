import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { ShieldAlert, Moon, AlertTriangle, CheckCircle2, PiggyBank, Clock } from "lucide-react";

export const Route = createFileRoute("/intercept")({
  head: () => ({ meta: [{ title: "Impulse Intercept — GX Prism" }] }),
  component: Intercept,
});

const STEPS = ["Risk", "Consequence", "Decision", "Recovery"];

function Intercept() {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-5 pt-6 space-y-5">
      <header>
        <p className="text-xs text-muted-foreground flex items-center gap-1"><ShieldAlert size={12} className="text-amber"/> Real-time intervention</p>
        <h1 className="text-2xl font-semibold">Impulse Intercept</h1>
        <p className="text-sm text-muted-foreground">We pause the moment, not your life.</p>
      </header>

      <Card className="p-4 bg-amber/10 border-amber/30">
        <div className="flex items-start gap-3">
          <Moon className="text-amber mt-0.5" size={18}/>
          <div className="flex-1">
            <p className="text-sm font-medium">Late-night spending spike detected</p>
            <p className="text-[12px] text-muted-foreground mt-1">11:42 PM · Shopee checkout RM 89</p>
            <Button onClick={() => setOpen(true)} className="mt-3 h-8 px-3 text-xs rounded-full gradient-prism text-primary-foreground border-0">
              Run Intercept
            </Button>
          </div>
        </div>
      </Card>

      <section>
        <h2 className="text-sm font-semibold text-muted-foreground mb-2">Recent Risk Alerts</h2>
        <div className="space-y-2">
          {[
            { icon: AlertTriangle, label: "Food delivery spike", time: "Today 7:12 PM", tone: "amber" },
            { icon: Clock, label: "BNPL repayment due in 3d", time: "Yesterday", tone: "prism" },
            { icon: AlertTriangle, label: "Luxury purchase, low balance", time: "Sun 10:08 PM", tone: "amber" },
          ].map((r, i) => (
            <Card key={i} className="p-3 bg-surface border-white/10 flex items-center gap-3">
              <r.icon className={r.tone === "amber" ? "text-amber" : "text-prism"} size={16}/>
              <div className="flex-1">
                <p className="text-sm">{r.label}</p>
                <p className="text-[11px] text-muted-foreground">{r.time}</p>
              </div>
              <Button onClick={() => setOpen(true)} className="h-7 px-3 text-[11px] rounded-full bg-accent text-foreground border-0">Review</Button>
            </Card>
          ))}
        </div>
      </section>

      <AnimatePresence>{open && <InterceptModal onClose={() => setOpen(false)} />}</AnimatePresence>
    </div>
  );
}

function InterceptModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [decision, setDecision] = useState<string | null>(null);
  const redirect = useApp((s) => s.redirectToRecovery);

  const next = () => setStep((s) => Math.min(s + 1, 3));

  const finish = (note: string, amount: number) => {
    redirect(amount, note);
    setStep(3);
  };

  return (
    <motion.div
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-end md:place-items-center p-3"
      onClick={onClose}
    >
      <motion.div
        initial={{y:40,opacity:0}} animate={{y:0,opacity:1}} exit={{y:40,opacity:0}}
        onClick={(e)=>e.stopPropagation()}
        className="w-full max-w-md bg-surface rounded-3xl border border-white/10 p-5 shadow-2xl"
      >
        {/* Stepper */}
        <div className="flex items-center gap-2 mb-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= step ? "gradient-prism" : "bg-white/10"}`}/>
              <p className={`text-[10px] mt-1 ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</p>
            </div>
          ))}
        </div>

        {step === 0 && (
          <Step
            badge={<Badge className="bg-amber/20 text-amber border-0">Risk detected</Badge>}
            title="Late-night spending spike"
            body="It's 11:42 PM. You usually regret purchases above RM 80 after midnight."
            cta="See consequence"
            onCta={next}
          />
        )}
        {step === 1 && (
          <Step
            badge={<Badge className="bg-amber/20 text-amber border-0">Consequence preview</Badge>}
            title="This may reduce your weekly essentials budget by RM 32"
            body="Projected balance dips below your safe-to-spend floor on Friday."
            cta="Show alternatives"
            onCta={next}
          />
        )}
        {step === 2 && (
          <div className="space-y-3">
            <Badge className="bg-prism/20 text-prism border-0">Choose a path</Badge>
            <p className="text-base font-semibold">What feels right tonight?</p>
            <DecisionBtn label="Delay Purchase (24h)" tone="primary" onClick={() => { setDecision("delayed"); finish("Saved from a 24h delay", 20); }}/>
            <DecisionBtn label="Reduce Amount (−RM 30)" tone="mint" onClick={() => { setDecision("reduced"); finish("Saved by reducing impulse", 30); }}/>
            <DecisionBtn label="Proceed Anyway" tone="ghost" onClick={() => { setDecision("proceed"); next(); }}/>
          </div>
        )}
        {step === 3 && (
          <div className="text-center py-2">
            <div className="mx-auto h-14 w-14 rounded-full gradient-prism grid place-items-center mb-3">
              <CheckCircle2 className="text-primary-foreground" size={28}/>
            </div>
            <p className="font-semibold">
              {decision === "proceed" ? "Logged. We'll learn from this." : "Nice pause. Resilience streak +1 🔥"}
            </p>
            {decision !== "proceed" && (
              <Card className="mt-4 p-3 bg-mint/10 border-mint/30 flex items-center gap-3 text-left">
                <PiggyBank className="text-mint" size={20}/>
                <div className="flex-1">
                  <p className="text-sm font-medium">Recovery Pocket updated</p>
                  <p className="text-[11px] text-muted-foreground">The saved amount is now growing your buffer.</p>
                </div>
              </Card>
            )}
            <Button onClick={onClose} className="mt-4 w-full gradient-prism text-primary-foreground border-0 rounded-full">Done</Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Step({ badge, title, body, cta, onCta }: any) {
  return (
    <div className="space-y-3">
      {badge}
      <p className="text-lg font-semibold leading-snug">{title}</p>
      <p className="text-sm text-muted-foreground">{body}</p>
      <Button onClick={onCta} className="w-full gradient-prism text-primary-foreground border-0 rounded-full mt-2">{cta}</Button>
    </div>
  );
}

function DecisionBtn({ label, tone, onClick }: { label: string; tone: "primary"|"mint"|"ghost"; onClick: () => void }) {
  const cls = tone === "primary" ? "gradient-prism text-primary-foreground"
    : tone === "mint" ? "bg-mint/20 text-mint hover:bg-mint/30"
    : "bg-accent text-muted-foreground";
  return (
    <Button onClick={onClick} className={`w-full h-11 rounded-xl border-0 justify-start ${cls}`}>{label}</Button>
  );
}
