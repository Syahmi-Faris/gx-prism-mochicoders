import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/lib/store";
import { ScanLine, Mic, Banknote, CheckCircle2, AlertTriangle, Sparkles, Upload } from "lucide-react";

export const Route = createFileRoute("/capture")({
  head: () => ({ meta: [{ title: "Smart Capture — GX Prism" }] }),
  component: Capture,
});

function Capture() {
  return (
    <div className="px-5 pt-6 space-y-5">
      <header>
        <p className="text-xs text-muted-foreground flex items-center gap-1"><Sparkles size={12} className="text-primary"/> AI-powered</p>
        <h1 className="text-2xl font-semibold">Smart Capture</h1>
        <p className="text-sm text-muted-foreground">Effortless tracking — four ways.</p>
      </header>

      <Tabs defaultValue="scan">
        <TabsList className="grid grid-cols-4 w-full bg-card">
          <TabsTrigger value="scan">Scan</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="cash">Cash</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="mt-4"><ScanTab/></TabsContent>
        <TabsContent value="voice" className="mt-4"><VoiceTab/></TabsContent>
        <TabsContent value="cash" className="mt-4"><CashTab/></TabsContent>
        <TabsContent value="recent" className="mt-4"><RecentTab/></TabsContent>
      </Tabs>
    </div>
  );
}

function ScanTab() {
  const [state, setState] = useState<"idle" | "processing" | "done">("idle");
  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-dashed border-2 border-white/15 text-center">
        <Upload className="mx-auto text-primary" size={28}/>
        <p className="mt-2 font-medium">Drop a screenshot</p>
        <p className="text-xs text-muted-foreground">Touch 'n Go, ShopeePay, banking apps, e-wallets</p>
        <Button
          onClick={() => { setState("processing"); setTimeout(() => setState("done"), 1800); }}
          className="mt-4 gradient-prism text-primary-foreground border-0 rounded-full"
          disabled={state === "processing"}
        >
          {state === "processing" ? "AI extracting…" : "Choose screenshot"}
        </Button>
      </Card>

      <AnimatePresence>
        {state === "processing" && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl gradient-prism grid place-items-center">
                  <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1.4,ease:"linear"}}>
                    <Sparkles className="text-primary-foreground" size={16}/>
                  </motion.div>
                </div>
                <div>
                  <p className="text-sm font-medium">Reading transactions…</p>
                  <p className="text-[11px] text-muted-foreground">Detecting merchant, amount, category</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div className="h-full gradient-prism" initial={{width:0}} animate={{width:"100%"}} transition={{duration:1.6}}/>
              </div>
            </Card>
          </motion.div>
        )}
        {state === "done" && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-primary" size={14}/>
                <p className="text-sm font-medium">AI Extraction Result</p>
              </div>
              <Row icon={<CheckCircle2 className="text-mint" size={16}/>} text="4 transactions detected"/>
              <Row icon={<CheckCircle2 className="text-mint" size={16}/>} text="3 auto-categorized"/>
              <Row icon={<AlertTriangle className="text-amber" size={16}/>} text="1 requires review" badge/>
              <Button className="mt-3 w-full gradient-prism text-primary-foreground border-0 rounded-full" onClick={() => setState("idle")}>
                Confirm & log
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ icon, text, badge }: { icon: React.ReactNode; text: string; badge?: boolean }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      {icon}
      <span className="text-sm flex-1">{text}</span>
      {badge && <Badge className="bg-amber/20 text-amber border-0 text-[10px]">Flagged</Badge>}
    </div>
  );
}

function VoiceTab() {
  const [state, setState] = useState<"idle" | "listening" | "processing" | "captured">("idle");
  const add = useApp((s) => s.addCaptured);

  const handle = () => {
    if (state !== "idle") return;
    setState("listening");
    setTimeout(() => setState("processing"), 1500);
    setTimeout(() => {
      setState("captured");
      add({ id: String(Date.now()), merchant: "Nasi lemak", amount: 8, category: "Food", source: "voice", time: "just now" });
    }, 2700);
    setTimeout(() => setState("idle"), 4500);
  };

  const colors: Record<string,string> = {
    idle: "from-prism to-prism-2",
    listening: "from-amber to-prism-2",
    processing: "from-prism to-mint",
    captured: "from-mint to-mint",
  };
  const labels: Record<string,string> = {
    idle: "Tap to Speak",
    listening: "Listening…",
    processing: "Processing…",
    captured: "Captured ✓",
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-border text-center">
        <button
          onClick={handle}
          className={`relative mx-auto h-32 w-32 rounded-full bg-gradient-to-br ${colors[state]} grid place-items-center text-primary-foreground shadow-2xl`}
        >
          {state === "listening" && (
            <>
              <motion.span className="absolute inset-0 rounded-full bg-white/20" animate={{scale:[1,1.4],opacity:[0.5,0]}} transition={{repeat:Infinity,duration:1.4}}/>
              <motion.span className="absolute inset-0 rounded-full bg-white/20" animate={{scale:[1,1.6],opacity:[0.5,0]}} transition={{repeat:Infinity,duration:1.4,delay:0.4}}/>
            </>
          )}
          <Mic size={42}/>
        </button>
        <p className="mt-4 font-semibold">{labels[state]}</p>
        <p className="text-xs text-muted-foreground mt-1">Try saying: "RM8 nasi lemak."</p>
      </Card>
      <AnimatePresence>
        {state === "captured" && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            <Card className="p-3 bg-mint/10 border-mint/30 flex items-center gap-3">
              <CheckCircle2 className="text-mint" size={18}/>
              <div className="flex-1">
                <p className="text-sm font-medium">Nasi lemak · RM 8.00</p>
                <p className="text-[11px] text-muted-foreground">Auto-categorized as Food</p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CashTab() {
  const add = useApp((s) => s.addCaptured);
  const [cat, setCat] = useState("Food");
  const [amt, setAmt] = useState("");
  const [done, setDone] = useState(false);
  const submit = () => {
    const n = parseFloat(amt);
    if (!n) return;
    add({ id: String(Date.now()), merchant: cat, amount: n, category: cat, source: "cash", time: "just now" });
    setAmt(""); setDone(true); setTimeout(()=>setDone(false), 1500);
  };
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card border-border">
        <p className="text-xs text-muted-foreground mb-3">One-tap cash logging</p>
        <div className="flex gap-2">
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-28"><SelectValue/></SelectTrigger>
            <SelectContent>
              {["Food","Transport","Shopping","Bills","Other"].map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">RM</span>
            <Input value={amt} onChange={(e)=>setAmt(e.target.value)} inputMode="decimal" placeholder="8" className="pl-9"/>
          </div>
          <Button onClick={submit} className="gradient-prism text-primary-foreground border-0 rounded-xl px-5">Add</Button>
        </div>
        {done && <p className="text-xs text-mint mt-2 flex items-center gap-1"><CheckCircle2 size={12}/> Logged</p>}
      </Card>
      <p className="text-[11px] text-muted-foreground text-center">Example: Food · RM 8 · Add</p>
    </div>
  );
}

function RecentTab() {
  const captured = useApp((s) => s.captured);
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-1">Recently Captured (raw)</p>
      {captured.map((c) => (
        <Card key={c.id} className="p-3 bg-card/60 border-dashed border-white/15 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-accent grid place-items-center text-xs">
            {c.source === "screenshot" ? <ScanLine size={14}/> : c.source === "voice" ? <Mic size={14}/> : <Banknote size={14}/>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{c.merchant}</p>
              <Badge className="bg-primary/15 text-primary border-0 text-[10px]">new</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">{c.category} · {c.time} · via {c.source}</p>
          </div>
          <p className="text-sm font-semibold">RM {c.amount.toFixed(2)}</p>
        </Card>
      ))}
    </div>
  );
}
