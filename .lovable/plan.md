
# GX Prism — Behavioural Financial Resilience Prototype

A mobile-first fintech prototype for Malaysian youth that captures spending effortlessly, surfaces behavioural insights, intercepts impulses, and rebuilds savings — built as a clickable demo for judges/investors.

Note: this is a frontend-only prototype with mocked data and simulated AI states (no backend, no real bank sync). All flows are interactive but stateful only in-memory.

## Visual identity

- Dark premium fintech palette: deep midnight base, soft lilac/violet primary (the "Prism" accent), gradient highlights for AI moments, mint for positive/savings, amber for risk.
- Typography: clean geometric sans (display) + neutral sans (body).
- Card-based, generous spacing, subtle glassmorphism for AI surfaces, micro-animations for "AI thinking" moments.

## App structure (bottom tab nav, 5 tabs)

```
Home  |  Smart Capture  |  Insights  |  Intercept  |  Pockets
                          (Rewards & Growth accessible from Home + Pockets)
```

### 1. Home
- Greeting + Financial Overview card (balance, this month spend, projected balance)
- Safe-to-Spend hero ("You can safely spend RM42 today")
- Recovery Pocket mini card — preloaded **RM20** · "Saved from 1 avoided BNPL impulse"
- Recent Activity (processed insights) with helper: *"Auto-sync, screenshot scan, voice log, and quick cash capture."*
- Primary CTA: **+ Smart Capture**

### 2. Smart Capture
Tabs: Screenshot Scan · Voice Log · Quick Cash · Recently Captured
- **Screenshot Scan**: upload tile → simulated AI processing animation → result card: "4 transactions detected · 3 auto-categorized · 1 requires review" with check icons + amber review flag.
- **Voice Log**: large mic button with 4 states (Idle / Listening / Processing / Captured), CTA "Tap to Speak", helper *Try saying: "RM8 nasi lemak."*
- **Quick Cash**: ultra-minimal `[Category ▾] [RM Amount] [Add]`
- **Recently Captured**: raw newly captured list, visually distinct (lighter cards, "new" pill) vs Home's processed activity.

### 3. Behaviour Insights
- Spending Patterns chart (week/month toggle)
- AI Recommendation cards, each with contextual actions:
  - "You overspend on food delivery during exam week." → **[Set Limit] [Turn On Intercept]**
  - "Late-night purchases above RM80 trend up." → **[Create Buffer] [View Pattern]**
- Monthly behaviour summary (10-second overview)

### 4. Impulse Intercept
Multi-step modal flow triggered by a demo "Simulate risky purchase" button + a Risk Alerts list.
- **Step 1 — Risk Detection**: "Late-night spending spike detected"
- **Step 2 — Consequence Preview**: "This may reduce your weekly essentials budget by RM32"
- **Step 3 — Decision**: [Delay Purchase] [Reduce Amount] [Proceed Anyway]
- **Step 4 — Recovery Action**: "Redirect saved RM20 into Recovery Pocket?" → success state updates Pocket balance.
- Stepper UI at top, behavioural-coaching tone throughout.

### 5. Pockets
- Savings Pocket · Recovery Pocket · Emergency Buffer · Payday Split
- Each as a card with progress ring, balance, recent contributions, quick actions.
- Payday Split visualizer (Essentials / Daily / Savings / Emergency bars).

### Rewards & Growth (sub-page from Home)
- Resilience Streaks (current streak + calendar dots)
- Cashback Rewards
- **Market Observe** (new):
  - Mini charts: Gold · Index Funds · Low-Risk Funds · Blue-Chip Stocks
  - Insight cards e.g. *"Gold has shown stable growth over the past 6 months."*
  - Risk badge (Low / Med / High) + Suitability line ("Suitable after RM500 emergency savings milestone")
  - Actions: **[View Chart] [Learn Why] [Check Suitability] [Explore Fund] [Add to Growth Plan]** — strictly educational, no "Buy Now".

## Naming (consumer-friendly)
Smart Capture · Behaviour Insights · Impulse Intercept · Pockets · Rewards (no "Layer" terminology anywhere).

## Tech approach
- TanStack Start file routes: `/`, `/capture`, `/insights`, `/intercept`, `/pockets`, `/rewards`, `/rewards/market-observe`.
- Shared mobile shell in `__root.tsx` (max-w phone frame on desktop, full-bleed on mobile) with bottom tab bar.
- shadcn/ui primitives (Card, Tabs, Dialog, Progress, Badge, Button) themed via `src/styles.css` tokens.
- Recharts for sparkline / mini market charts.
- framer-motion for AI-processing pulse, mic state transitions, and Intercept step transitions.
- Zustand (lightweight) for in-memory state: pocket balances, captured items, intercept outcome → so demo actions visibly update the UI (e.g. Recovery Pocket grows after Intercept).
- All data is mock/seeded; no backend.

## Build order
1. Theme tokens + mobile shell + bottom nav + routes scaffolding.
2. Home dashboard with seeded data.
3. Smart Capture (4 sub-views with simulated AI states).
4. Behaviour Insights with actionable cards.
5. Impulse Intercept 4-step flow + state wiring to Recovery Pocket.
6. Pockets page.
7. Rewards & Growth + Market Observe.
8. Polish: animations, empty/loading states, judge-demo seed data pass.
