import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp, type Captured } from "@/lib/store";
import { TODAY } from "@/lib/finance";
import {
  Banknote,
  CheckCircle2,
  FileSearch,
  Mic,
  ScanLine,
  Upload,
  WalletCards,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

export type CaptureMode = "scan" | "voice" | "cash" | "auto";
type FlowType = "expense" | "income";
type Stage = "input" | "review" | "done";
type DraftCapture = {
  merchant: string;
  amount: number;
  category: string;
  type: FlowType;
  source: Captured["source"];
  needsReview?: boolean;
};

export function SmartCaptureModal({
  open,
  onOpenChange,
  initialMode = "scan",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: CaptureMode;
}) {
  const addCaptured = useApp((s) => s.addCaptured);
  const [mode, setMode] = useState<CaptureMode>(initialMode);
  const [flowType, setFlowType] = useState<FlowType>("expense");
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [stage, setStage] = useState<Stage>("input");
  const [drafts, setDrafts] = useState<DraftCapture[]>([]);
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      reset();
    }
  }, [initialMode, open]);

  const switchMode = (nextMode: CaptureMode) => {
    setMode(nextMode);
    reset();
  };

  const reviewDrafts = (items: DraftCapture[]) => {
    setDrafts(items);
    setStage("review");
  };

  const simulateScan = () => {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      reviewDrafts([
        {
          merchant: "GrabFood receipt",
          amount: 18.9,
          category: "Food",
          type: "expense",
          source: "screenshot",
          needsReview: true,
        },
        {
          merchant: "Touch 'n Go reload",
          amount: 30,
          category: "Transport",
          type: "expense",
          source: "screenshot",
          needsReview: true,
        },
        {
          merchant: "Freelance invoice",
          amount: 150,
          category: "Income",
          type: "income",
          source: "screenshot",
          needsReview: true,
        },
      ]);
      toast.success("AI extracted 3 records from screenshot");
    }, 700);
  };

  const startVoice = () => {
    setRecording(true);
    setTranscript("Listening...");
  };

  const stopVoice = () => {
    if (!recording) return;
    setRecording(false);
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setTranscript("I spent RM8 on nasi lemak and received RM80 tutoring payment.");
      reviewDrafts([
        {
          merchant: "Nasi lemak",
          amount: 8,
          category: "Food",
          type: "expense",
          source: "voice",
        },
        {
          merchant: "Tutoring payment",
          amount: 80,
          category: "Income",
          type: "income",
          source: "voice",
        },
      ]);
      toast.success("Voice note converted into 2 records");
    }, 650);
  };

  const reviewCash = () => {
    const value = Number(amount);
    if (!merchant.trim() || !value) {
      toast.error("Fill in cash description and amount first");
      return;
    }
    reviewDrafts([
      {
        merchant: merchant.trim(),
        amount: value,
        category,
        type: flowType,
        source: "cash",
      },
    ]);
  };

  const simulateAutoSync = () => {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      reviewDrafts([
        {
          merchant: "Salary credit",
          amount: 1800,
          category: "Income",
          type: "income",
          source: "auto",
        },
        {
          merchant: "Shopee checkout",
          amount: 64.8,
          category: "Shopping",
          type: "expense",
          source: "auto",
        },
        {
          merchant: "BNPL instalment",
          amount: 49,
          category: "BNPL",
          type: "expense",
          source: "auto",
        },
      ]);
      toast.success("GXBank feed synced");
    }, 700);
  };

  const confirm = () => {
    if (drafts.length === 0) {
      toast.error("No records to add");
      return;
    }
    drafts.forEach((draft, index) => {
      addCaptured({
        id: `${Date.now()}-${index}`,
        merchant: draft.merchant,
        amount: draft.amount,
        category: draft.category,
        source: draft.source,
        time: "just now",
        date: TODAY,
        type: draft.type,
        needsReview: draft.needsReview,
      });
    });
    setStage("done");
    toast.success(`${drafts.length} transaction${drafts.length > 1 ? "s" : ""} added`);
  };

  const updateDraft = (index: number, patch: Partial<DraftCapture>) => {
    setDrafts((items) => items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeDraft = (index: number) => {
    setDrafts((items) => items.filter((_, i) => i !== index));
  };

  function reset() {
    setFlowType("expense");
    setMerchant("");
    setAmount("");
    setCategory("Food");
    setStage("input");
    setDrafts([]);
    setBusy(false);
    setRecording(false);
    setTranscript("");
  }

  const close = (next: boolean) => {
    onOpenChange(next);
    if (!next) window.setTimeout(reset, 150);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-[400px] rounded-3xl">
        <DialogHeader>
          <DialogTitle>Smart Capture</DialogTitle>
          <DialogDescription>
            Pick a capture method. Each one simulates a different banking behaviour.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-2">
          {captureModes.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`rounded-2xl border p-2 text-[11px] grid place-items-center gap-1 transition ${
                mode === key ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {stage === "input" && (
          <>
            {mode === "scan" && <ScanCapture busy={busy} onScan={simulateScan} />}
            {mode === "voice" && (
              <VoiceCapture
                busy={busy}
                recording={recording}
                transcript={transcript}
                onStart={startVoice}
                onStop={stopVoice}
              />
            )}
            {mode === "cash" && (
              <CashCapture
                flowType={flowType}
                setFlowType={setFlowType}
                merchant={merchant}
                setMerchant={setMerchant}
                amount={amount}
                setAmount={setAmount}
                category={category}
                setCategory={setCategory}
                onReview={reviewCash}
              />
            )}
            {mode === "auto" && <AutoCapture busy={busy} onSync={simulateAutoSync} />}
          </>
        )}

        {stage === "review" && (
          <Card className="p-4 bg-card border-border space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent grid place-items-center text-primary shrink-0">
                <WalletCards size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Review extracted records</p>
                <p className="text-[11px] text-muted-foreground">
                  Confirm what GX Prism should add to activity.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {drafts.map((draft, index) => (
                <DraftEditor
                  key={`${draft.merchant}-${draft.amount}-${draft.type}-${index}`}
                  draft={draft}
                  onChange={(patch) => updateDraft(index, patch)}
                  onRemove={() => removeDraft(index)}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => setStage("input")}
                className="rounded-xl bg-accent text-foreground border-0"
              >
                Back
              </Button>
              <Button
                onClick={confirm}
                disabled={drafts.length === 0}
                className="rounded-xl gradient-prism text-primary-foreground border-0"
              >
                Confirm all
              </Button>
            </div>
          </Card>
        )}

        {stage === "done" && (
          <div className="rounded-2xl bg-mint/10 border border-mint/30 p-4 text-center">
            <CheckCircle2 className="mx-auto text-mint" size={24} />
            <p className="text-sm font-medium mt-2">Added to your activity</p>
            <Button
              onClick={reset}
              className="mt-3 h-9 rounded-xl bg-accent text-foreground border-0"
            >
              Capture another
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DraftEditor({
  draft,
  onChange,
  onRemove,
}: {
  draft: DraftCapture;
  onChange: (patch: Partial<DraftCapture>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl bg-accent/40 p-3 space-y-2">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Input
          value={draft.merchant}
          onChange={(event) => onChange({ merchant: event.target.value })}
          className="h-8 rounded-xl bg-card text-sm"
        />
        <Button
          onClick={onRemove}
          className="h-8 rounded-xl bg-card text-destructive border border-destructive/30 px-3"
        >
          Remove
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Input
          value={String(draft.amount)}
          onChange={(event) => onChange({ amount: Number(event.target.value) || 0 })}
          inputMode="decimal"
          className="h-8 rounded-xl bg-card text-sm"
        />
        <Input
          value={draft.category}
          onChange={(event) => onChange({ category: event.target.value })}
          className="h-8 rounded-xl bg-card text-sm"
        />
        <button
          onClick={() => onChange({ type: draft.type === "income" ? "expense" : "income" })}
          className={`h-8 rounded-xl text-[11px] capitalize ${
            draft.type === "income" ? "bg-mint/20 text-mint" : "bg-card text-foreground"
          }`}
        >
          {draft.type}
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground">
        {draft.source} - {draft.needsReview ? "needs review" : "ready"}
      </p>
    </div>
  );
}

function ScanCapture({ busy, onScan }: { busy: boolean; onScan: () => void }) {
  return (
    <Card className="p-4 bg-card border-border space-y-4">
      <ModeHeader
        icon={ScanLine}
        title="Screenshot extraction"
        detail="Upload a receipt, e-wallet screenshot, or payslip. AI extracts income and expenses together."
      />
      <button
        onClick={onScan}
        disabled={busy}
        className="w-full rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center transition hover:bg-primary/10 disabled:opacity-70"
      >
        <Upload className="mx-auto text-primary" size={26} />
        <p className="mt-2 text-sm font-semibold">
          {busy ? "Reading screenshot..." : "Upload screenshot"}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Demo extracts GrabFood, Touch 'n Go, and freelance income.
        </p>
      </button>
    </Card>
  );
}

function VoiceCapture({
  busy,
  recording,
  transcript,
  onStart,
  onStop,
}: {
  busy: boolean;
  recording: boolean;
  transcript: string;
  onStart: () => void;
  onStop: () => void;
}) {
  return (
    <Card className="p-4 bg-card border-border space-y-4">
      <ModeHeader
        icon={Mic}
        title="Voice capture"
        detail="Hold the mic to speak. The demo turns one sentence into income and spending records."
      />
      <button
        onPointerDown={onStart}
        onPointerUp={onStop}
        onPointerLeave={onStop}
        disabled={busy}
        className={`mx-auto grid h-28 w-28 place-items-center rounded-full border text-center transition ${
          recording
            ? "border-mint bg-mint/15 text-mint scale-105"
            : "border-primary/40 bg-primary/10 text-primary"
        } disabled:opacity-70`}
      >
        <span>
          <Mic className="mx-auto" size={24} />
          <span className="mt-1 block text-[11px] font-medium">
            {busy ? "Transcribing" : recording ? "Release" : "Hold to speak"}
          </span>
        </span>
      </button>
      <div className="rounded-2xl bg-accent/40 p-3 min-h-16">
        <p className="text-[11px] text-muted-foreground">Transcript</p>
        <p className="text-sm mt-1">
          {transcript ||
            "Long press the mic and say: I spent 8 ringgit for nasi lemak and received 80 ringgit from tutoring."}
        </p>
      </div>
    </Card>
  );
}

function CashCapture({
  flowType,
  setFlowType,
  merchant,
  setMerchant,
  amount,
  setAmount,
  category,
  setCategory,
  onReview,
}: {
  flowType: FlowType;
  setFlowType: (value: FlowType) => void;
  merchant: string;
  setMerchant: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  onReview: () => void;
}) {
  return (
    <Card className="p-4 bg-card border-border space-y-3">
      <ModeHeader
        icon={Banknote}
        title="Cash pocket log"
        detail="Manual entry for offline spending, allowance, or cash received."
      />
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-accent/30 p-1">
        {(["expense", "income"] as FlowType[]).map((type) => (
          <button
            key={type}
            onClick={() => {
              setFlowType(type);
              setCategory(type === "income" ? "Income" : "Food");
            }}
            className={`rounded-xl px-3 py-2 text-sm capitalize ${
              flowType === type ? "gradient-prism text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        <Label className="text-[11px]">{flowType === "income" ? "Cash source" : "Paid at"}</Label>
        <Input
          value={merchant}
          onChange={(event) => setMerchant(event.target.value)}
          placeholder={flowType === "income" ? "e.g. allowance" : "e.g. mamak stall"}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-[11px]">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              RM
            </span>
            <Input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="decimal"
              placeholder="0.00"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px]">Category</Label>
          <Input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder={flowType === "income" ? "Income" : "Food"}
          />
        </div>
      </div>
      <Button
        onClick={onReview}
        className="w-full rounded-xl gradient-prism text-primary-foreground border-0"
      >
        Review cash log
      </Button>
    </Card>
  );
}

function AutoCapture({ busy, onSync }: { busy: boolean; onSync: () => void }) {
  return (
    <Card className="p-4 bg-card border-border space-y-4">
      <ModeHeader
        icon={Zap}
        title="GXBank auto-sync"
        detail="Simulate bank feed detection for salary, card spending, and BNPL instalments."
      />
      <div className="grid grid-cols-3 gap-2 text-center">
        <AutoSignal label="Salary" value="+RM1800" />
        <AutoSignal label="Shopping" value="-RM64.80" />
        <AutoSignal label="BNPL" value="-RM49" />
      </div>
      <Button
        onClick={onSync}
        disabled={busy}
        className="w-full rounded-xl gradient-prism text-primary-foreground border-0"
      >
        {busy ? "Syncing GXBank feed..." : "Sync latest GXBank activity"}
      </Button>
    </Card>
  );
}

function ModeHeader({
  icon: Icon,
  title,
  detail,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-accent grid place-items-center text-primary shrink-0">
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-[11px] text-muted-foreground leading-snug">{detail}</p>
      </div>
    </div>
  );
}

function AutoSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-accent/40 px-2 py-3">
      <FileSearch size={14} className="mx-auto text-primary" />
      <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
      <p className="text-[12px] font-semibold">{value}</p>
    </div>
  );
}

const captureModes: { key: CaptureMode; label: string; icon: LucideIcon }[] = [
  { key: "scan", label: "Scan", icon: ScanLine },
  { key: "voice", label: "Voice", icon: Mic },
  { key: "cash", label: "Cash", icon: Banknote },
  { key: "auto", label: "Auto", icon: Zap },
];
