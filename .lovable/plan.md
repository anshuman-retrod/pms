# Retrod — Hybrid Hotel PMS + Restaurant POS under new green design system

## Approach

You want the new green/Syne design system applied **through the existing UI primitives** (Card, Button, StatusBadge, PageHeader, table styles, Sidebar, TopBar) — not by introducing a parallel component library. So the work is:

1. **Re-token** `src/styles.css` (colors, fonts, radii, shadows) — every existing page/component re-skins automatically because they already use semantic tokens.
2. **Re-skin shared chrome** (Sidebar dark green, TopBar) — keep API, change visuals only.
3. **Add 8 restaurant POS routes** that reuse `Card`, `CardHeader`, `Button`, `StatusBadge`, `PageHeader` from `@/components/ui/Primitives` — same patterns as `GuestsFeature`, `OOOManagement`, etc.
4. **Extend sidebar nav** with a "Restaurant" section grouping the new routes; hotel routes stay grouped as today.
5. **No business logic / backend changes** — frontend-only mock data, same as the rest of the app.

## Phase 1 — Design tokens (foundation)

Update `src/styles.css`:
- Color tokens to oklch equivalents of the spec:
  - `--primary` → #1D9E75 · `--primary-foreground` white
  - `--background` → #F6FAF8 · `--card` → #FFFFFF
  - `--foreground` / `--text-primary` → #1A2E27
  - `--muted-foreground` / `--text-secondary` → #4A7065
  - `--border` → #D4EBE1
  - `--accent` → #E1F5EE · `--accent-foreground` → #085041
  - `--destructive` → #D94F4F · `--warning` → #E8A020
  - Sidebar tokens: `--sidebar-bg` → #085041, `--sidebar-active` → #1D9E75
  - Status badge tones (success/warning/error/neutral/brand/info) remapped to spec
- Typography: load Syne (display) + DM Sans (body) + JetBrains Mono (numeric) via `@import` in `styles.css`; map `--font-display`, `--font-sans`, `--font-mono`.
- Radii: `--radius` 10px (md), additional `--radius-lg` 16px, `--radius-xl` 24px.
- Shadow tokens: `--shadow-card` 0 1px 4px rgba(8,80,65,0.06); `--shadow-hover` 0 4px 16px rgba(8,80,65,0.10).

## Phase 2 — Shared chrome re-skin

- `src/app/layouts/Sidebar.tsx`: dark green background, white nav text at 75% opacity, active item green pill with 3px white left border, 18px Tabler-style icons (keep current lucide for now to avoid icon-set churn — note in memory).
- `src/app/layouts/TopBar.tsx`: 56px height, white background, subtle border, search/notifications styled to spec.
- `src/components/ui/Primitives.tsx` (`Card`, `CardHeader`, `StatusBadge`, `Button` variants, `PageHeader`): adjust default classes to use new shadow/radius tokens; verify table header bg, row hover.

## Phase 3 — Restaurant POS routes (new)

Add under `src/features/restaurant/...` and `src/routes/...`, all reusing `Primitives`:

| Route | Feature module | Notes |
|---|---|---|
| `/pos` | `PosFeature` | Split menu grid + active order panel |
| `/inventory` | `InventoryFeature` | Tabs: Stock / POs / Suppliers / Recipes |
| `/online-orders` | `OnlineOrdersFeature` | Platform pills + queue + detail |
| `/menu` | `MenuFeature` | Category tree + item grid + drawer |
| `/crm` | `CrmFeature` | Stats + tabs + customer drawer |
| `/addons` | `AddonsFeature` | Settings tabs incl. Add-ons grid |
| `/restaurant` | `RestaurantDashboardFeature` | KPIs, revenue chart, top items, live orders |
| `/restaurant-reports` | `RestaurantReportsFeature` | Reuse existing `ReportsSidebar` pattern |

All charts via Recharts (already used). Mock data in `src/services/mock/restaurant.ts`.

## Phase 4 — Sidebar grouping

Update sidebar nav to two collapsible groups:
- **Hotel Operations** (existing items)
- **Restaurant** (new POS routes)
- **Settings** (existing — Users, Roles, Property, etc.)

## Phase 5 — RBAC integration

- Extend `src/types/rbac.ts` privileges with restaurant scopes (`pos.use`, `menu.manage`, `inventory.manage`, `online_orders.manage`, `crm.manage`).
- Add to existing role privilege maps in `src/features/auth/lib/rbac.ts`.
- Wrap new routes' nav entries and primary actions in `<Can>`.

## Out of scope (this pass)

- Real KOT printer, payment gateways, aggregator APIs — stays mock.
- Switching icon library to Tabler (keeps lucide; visually equivalent at 18-20px stroke 1.5).
- Mobile bottom-tab nav (desktop-first, responsive stacking only).

## Suggested execution order (so you see progress fast)

1. Phase 1 + 2 (tokens + sidebar/topbar) — entire existing app re-skins.
2. `/pos` + `/restaurant` (highest-visibility new pages).
3. `/menu` + `/inventory` + `/online-orders`.
4. `/crm` + `/addons` + `/restaurant-reports`.
5. RBAC wiring + sidebar groups.

Approve and I'll start with Phase 1+2 in one batch, then check in before building the restaurant pages.
