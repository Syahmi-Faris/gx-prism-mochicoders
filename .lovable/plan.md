# GX Prism — GX Bank-Inspired Refresh

Refactor visual system to a white-first, purple-accent fintech look (GX Bank style), add a top bar (logo + theme toggle + notifications + profile), expand bottom nav to surface Market, and make Profile a real interactive screen. All existing behavioural features (Smart Capture, Insights, Intercept, Pockets, Recovery, Market Observe) stay intact.

## 1. Theme system (light-first, purple accent)

Rewrite `src/styles.css` tokens:

- Light mode (default, applied to `<html>`):
  - `--background`: near-white (oklch ~0.99)
  - `--foreground`: deep charcoal
  - `--card`: pure white with soft shadow token `--shadow-soft`
  - `--muted`: light gray surface
  - `--primary`: GX purple (`oklch(0.55 0.22 290)`)
  - `--primary-glow`: lighter violet for gradient end
  - `--gradient-prism`: `linear-gradient(135deg, var(--primary), var(--primary-glow))`
  - Borders: subtle gray (`oklch(0.92 0 0)`)
- Dark mode (`.dark` on `<html>`): keep current midnight base but recalibrated so purple highlights pop; cards use elevated charcoal not pure black.
- Update `.glass` utility to adapt: white/blur in light, dark translucent in dark.
- Replace all hardcoded `text-white`, `bg-black`, `border-white/10` etc. across routes with semantic tokens (`bg-card`, `text-foreground`, `border-border`).
- Soften radii (`--radius: 1rem`) and add `--shadow-soft`, `--shadow-elevated` tokens for cards.

## 2. Theme toggle

- New `src/lib/theme.ts`: tiny Zustand (or `useState` + `localStorage`) store: `theme: 'light' | 'dark'`, `toggle()`. On mount, sync `document.documentElement.classList`.
- `src/components/ThemeToggle.tsx`: icon button, Sun/Moon (lucide), framer-motion crossfade. Default = light.

## 3. Top bar

New `src/components/TopBar.tsx` rendered inside `PhoneShell` above content:

- Left: "GX" prism mark + wordmark "Prism"
- Right (icon buttons): ThemeToggle, Bell (notifications — opens a simple Sheet listing recent intercepts/insights from store), Avatar (links to `/profile`)
- Sticky, glass background, subtle bottom border.

## 4. Navigation refresh

Update `PhoneShell` bottom nav to 6 tabs (Intercept removed from bar — still reachable from Insights cards & Home alerts, since intercept is modal/contextual):

`Home · Capture · Insights · Pockets · Market · Profile`

- Icons (lucide): Home, ScanLine, Brain, PiggyBank, LineChart, User
- Active state: purple gradient pill + white icon, label in primary
- Inactive: muted-foreground
- Responsive: at ≥768px, optional collapsible left sidebar variant using shadcn sidebar; mobile keeps bottom bar
- Move Intercept entry: keep `/intercept` route, surface as a prominent "Active Intercepts" card on Home and a "Turn on Intercept" CTA on Insights (already present)

## 5. Market tab

Promote existing `rewards.market-observe.tsx` content to a top-level route `src/routes/market.tsx`:

- Mini charts (Gold, Index, Low-Risk, Blue-Chip) — reuse current Recharts setup
- Investment summary cards with risk badges (Low/Med) and suitability line ("Suitable for beginners building emergency buffer")
- Educational CTAs only ("Learn more"), no Buy
- Keep `/rewards` for Streaks + Cashback; link to Market from Rewards as secondary entry

## 6. Profile screen

New `src/routes/profile.tsx`:

- Header: avatar (initials gradient), name "Aiman Hakim", email "aimanhakim@email.com"
- Account card: Membership "GX Prism Member", Joined "Mar 2026", Resilience Score (computed from store: intercepts + recoveryPocket → 0–100)
- Settings list (shadcn): Edit Profile, Notification Preferences, Security Settings, Theme Preferences (rows open simple sheets / toasts — prototype-level)
- Danger zone: "Delete Account" red-outline button → AlertDialog confirm ("Cancel" / "Delete")
- All state local/mock; no backend

Add `user` slice to `src/lib/store.ts` (name, email, joinDate, avatar seed) so TopBar avatar and Profile read same source.

## 7. Visual polish pass per route

Re-skin existing routes to white-surface cards with soft shadows, purple accents, and consistent typography scale. No functional changes to capture/insights/intercept/pockets logic.

## 8. Responsive

- Phone shell stays centered with rounded frame on desktop ≥768px
- Top bar + bottom nav both sticky inside the frame
- Tablet/desktop demo view: frame scales; sidebar variant optional follow-up

## Technical notes

- Files created: `src/components/TopBar.tsx`, `src/components/ThemeToggle.tsx`, `src/lib/theme.ts`, `src/routes/market.tsx`, `src/routes/profile.tsx`
- Files edited: `src/styles.css` (token rewrite), `src/components/PhoneShell.tsx` (TopBar + 6-tab nav), `src/lib/store.ts` (user slice, resilience score selector), all `src/routes/*.tsx` (token swap, no logic change), `src/routes/__root.tsx` (apply theme class on mount)
- Keep `rewards.market-observe.tsx` as alias re-export from `market.tsx` to avoid breaking existing links, or redirect.
- No new deps; use existing framer-motion, recharts, shadcn, lucide.

## Out of scope

- Real auth / persistence
- Real notification feed beyond mock list
- Sidebar variant (mention as future; bottom nav covers all required viewports for demo)
