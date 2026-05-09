import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { ShieldAlert, AlertTriangle, CheckCircle2, PiggyBank, Clock, Zap, ShoppingBag, ArrowRight, Radio } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/intercept")({
  head: () => ({ meta: [{ title: "Impulse Intercept — GX Prism" }] }),
  component: Intercept,
});

const DETECTION_STEPS = [
  { label: "GXBank auto-sync triggered", sub: "Outgoing payment pending", done: true },
  { label: "Merchant identified — Shopee", sub: "Channel: SPayLater", done: true },
  { label: "Matched to BNPL schedule", sub: "RM 89 instalment due today", done: true },
  { label: "Impulse Intercept activated", sub: "Awaiting your decision", active: true },
];

function Intercept() {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-5 pt-6 space-y-5">
      <header>
        <p className="text-xs text-muted-foreground flex items-center gap-1"><ShieldAlert size={12} className="text-primary"/> Real-time BNPL intervention</p>
        <h1 className="text-2xl font-semibold">Impulse Intercept</h1>
        <p className="text-sm text-muted-foreground">Triggered when GXBank detects a BNPL repayment leaving your account — not when you browse.</p>
      </header>

      {/* Hero alert — explicit trigger source */}
      <Card className="p-4 border-primary/30 bg-primary/5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#EE4D2D] grid place-items-center text-white text-xs font-bold shrink-0 shadow-soft">
            <ShoppingBag size={18}/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge className="bg-primary/15 text-primary border-0 text-[10px]">
                <Radio size={10} className="mr-1"/> GXBank auto-sync
              </Badge>
              <Badge className="bg-amber/15 text-amber-foreground border border-amber/30 text-[10px]">BNPL Repayment — not a new purchase</Badge>
            </div>
            <p className="text-sm font-semibold mt-2 leading-snug">
              Outgoing payment to <span className="text-[#EE4D2D]">Shopee</span> · RM 89.00
            </p>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Identified as: <span className="font-medium text-foreground">BNPL instalment (SPayLater)</span> — due today
            </p>
          </div>
        </div>

        {/* Detection timeline */}
        <div className="mt-4 rounded-2xl bg-card border border-border p-3 space-y-2.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Auto-sync detection pipeline</p>
          {DETECTION_STEPS.map((s, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`mt-0.5 h-5 w-5 shrink-0 rounded-full grid place-items-center ${
                s.active ? "gradient-prism shadow-soft" : "bg-mint/20"
              }`}>
                {s.active ? <Zap size={11} className="text-primary-foreground"/> : <CheckCircle2 size={12} className="text-mint"/>}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[12px] ${s.active ? "font-semibold text-foreground" : "text-foreground"}`}>{s.label}</p>
                <p className="text-[10.5px] text-muted-foreground">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={() => setOpen(true)} className="mt-3 w-full gradient-prism text-primary-foreground border-0 rounded-full">
          Run Intercept <ArrowRight size={14} className="ml-1"/>
        </Button>
      </Card>

      <section>
        <h2 className="text-sm font-semibold text-muted-foreground mb-2">Recent Risk Alerts</h2>
        <div className="space-y-2">
          {[
            { icon: ShoppingBag, label: "Shopee SPayLater · RM 89 due today", time: "Auto-synced from GXBank", tone: "primary", brand: true },
            { icon: AlertTriangle, label: "Food delivery spike", time: "Today 7:12 PM", tone: "amber" },
            { icon: Clock, label: "Atome instalment due in 3d", time: "Yesterday", tone: "muted" },
          ].map((r, i) => (
            <Card key={i} className="p-3 bg-card border-border flex items-center gap-3">
              {r.brand ? (
                <div className="h-8 w-8 rounded-lg bg-[#EE4D2D] grid place-items-center text-white shrink-0">
                  <ShoppingBag size={14}/>
                </div>
              ) : (
                <r.icon className={r.tone === "amber" ? "text-amber" : "text-muted-foreground"} size={16}/>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{r.label}</p>
                <p className="text-[11px] text-muted-foreground">{r.time}</p>
              </div>
              <Button onClick={() => setOpen(true)} className="h-7 px-3 text-[11px] rounded-full bg-accent text-foreground border-0 hover:bg-accent/80">Review</Button>
            </Card>
          ))}
        </div>
      </section>

      <AnimatePresence>{open && <BnplInterceptModal onClose={() => setOpen(false)} />}</AnimatePresence>
    </div>
  );
}

function BnplInterceptModal({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<"review" | "saved" | "paid">("review");
  const redirect = useApp((s) => s.redirectToRecovery);

  const handleSave = () => {
    redirect(89, "Reserved from Shopee SPayLater intercept");
    setStage("saved");
    toast.success("RM 89 reserved in Recovery Pocket");
  };

  const handlePay = () => {
    setStage("paid");
    toast("Payment to Shopee SPayLater confirmed");
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
        className="w-full max-w-md bg-card rounded-3xl border border-border p-5 shadow-2xl"
      >
        {stage === "review" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-[#EE4D2D] grid place-items-center text-white shrink-0">
                <ShoppingBag size={20}/>
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-muted-foreground">Shopee · SPayLater</p>
                <p className="text-base font-semibold leading-tight">BNPL Repayment Due</p>
              </div>
              <Badge className="bg-amber/15 text-amber border border-amber/30 text-[10px]">Today</Badge>
            </div>

            <Card className="p-3 bg-muted/40 border-border space-y-2">
              <Row label="Instalment" value="2 of 3"/>
              <Row label="Amount due" value="RM 89.00" strong/>
              <Row label="Original purchase" value="Wireless earbuds · 11:42 PM"/>
              <Row label="Penalty if missed" value="RM 10 + 1.5% / day" tone="amber"/>
            </Card>

            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-3">
              <p className="text-[13px] leading-snug">
                This was originally an <span className="font-semibold">impulse purchase</span>. Do you still want to pay now,
                or redirect <span className="font-semibold">RM 89</span> to your Recovery Pocket and delay payment?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handlePay} className="h-11 rounded-xl bg-accent text-foreground border-0 hover:bg-accent/80">
                Pay Anyway
              </Button>
              <Button onClick={handleSave} className="h-11 rounded-xl gradient-prism text-primary-foreground border-0">
                Save to Recovery
              </Button>
            </div>
          </div>
        )}

        {stage === "saved" && (
          <div className="text-center py-2">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              className="mx-auto h-16 w-16 rounded-full gradient-prism grid place-items-center mb-3 shadow-elevated"
            >
              <PiggyBank className="text-primary-foreground" size={28}/>
            </motion.div>

            <p className="font-semibold">RM 89 reserved in Recovery Pocket</p>
            <p className="text-[12px] text-muted-foreground mt-1 px-4">
              We'll remind you before the BNPL penalty kicks in.
            </p>

            {/* Animated flow */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px]">
              <span className="px-2 py-1 rounded-full bg-[#EE4D2D]/10 text-[#EE4D2D]">Shopee RM 89</span>
              <motion.div
                initial={{ x: -8, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ArrowRight size={14} className="text-muted-foreground"/>
              </motion.div>
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="px-2 py-1 rounded-full bg-mint/15 text-mint font-medium"
              >
                Recovery Pocket
              </motion.span>
            </div>

            <Button onClick={onClose} className="mt-5 w-full gradient-prism text-primary-foreground border-0 rounded-full">Done</Button>
          </div>
        )}

        {stage === "paid" && (
          <div className="text-center py-2">
            <div className="mx-auto h-14 w-14 rounded-full bg-muted grid place-items-center mb-3">
              <CheckCircle2 className="text-foreground" size={26}/>
            </div>
            <p className="font-semibold">Payment sent to Shopee SPayLater</p>
            <p className="text-[12px] text-muted-foreground mt-1">Logged. We'll learn from this decision.</p>
            <Button onClick={onClose} className="mt-4 w-full bg-accent text-foreground border-0 rounded-full hover:bg-accent/80">Close</Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Row({ label, value, strong, tone }: { label: string; value: string; strong?: boolean; tone?: "amber" }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-muted-foreground">{label}</span>
      <span className={`${strong ? "font-semibold text-base" : ""} ${tone === "amber" ? "text-amber" : "text-foreground"}`}>{value}</span>
    </div>
  );
}
