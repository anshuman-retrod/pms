# Retrod PMS — Module UI Specifications

**Version:** 1.0 · **Date:** May 2026  
**Status:** Extension spec (not a redesign)  
**Audience:** Product, Engineering, Design

This document defines **28 new or extended modules** for Retrod PMS. Every screen must reuse the established shell and primitives documented below. No new design language.

---

## Global design contract (from production codebase)

### Shell (mandatory on all authenticated routes)

| Layer          | Implementation                 | Notes                                                                                |
| -------------- | ------------------------------ | ------------------------------------------------------------------------------------ |
| Sidebar        | `app/layouts/Sidebar.tsx`      | Dark navy `bg-sidebar`, rose active indicator, RBAC-filtered nav groups              |
| Header         | `app/layouts/TopBar.tsx`       | Breadcrumb `Group / Page`, global search `⌘K`, primary CTA, date chip, notifications |
| Content        | `PageHeader` + `p-6 space-y-6` | Eyebrow (`.label-uppercase`), `font-display` title 26px, description 13px            |
| Login / wizard | No shell                       | Standalone full-page (see `LoginPageFeature`, `NewReservationFeature`)               |

### Component library (reuse only)

| Pattern       | Component                                  | Usage                                                                          |
| ------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| Page title    | `PageHeader`                               | eyebrow, title, description, `actions` slot                                    |
| KPI strip     | `KpiCard` × 4–5                            | `grid sm:grid-cols-4`, accent: brand/info/success/warning/error                |
| Card panel    | `Card` + `CardHeader`                      | Tables, charts, lists inside                                                   |
| Status        | `StatusBadge`                              | success/warning/error/info/neutral/brand                                       |
| Buttons       | `Button`                                   | primary, outline, ghost; sm = h-8                                              |
| View switcher | Segmented control                          | `rounded-md border bg-surface p-0.5`, active = `bg-foreground text-background` |
| Search        | Icon + input h-9                           | `pl-9`, focus ring `ring-primary/15`                                           |
| Tables        | Native `<table>` in Card                   | Header row `bg-surface-2/40`, uppercase 10px labels                            |
| Charts        | Recharts in Card                           | Tooltip: surface + border + shadow-e2                                          |
| Master-detail | `lg:grid-cols-[1fr_360px]`                 | Guests, AI Insights pattern                                                    |
| Category nav  | Left rail ~220px                           | Reports sidebar pattern                                                        |
| AI callout    | `border-primary/20 bg-primary-tint/40`     | Sparkles + rose CTA link                                                       |
| Empty state   | Card, centered, ghost Button               | Icon 32px muted, 13px copy                                                     |
| Loading       | `Skeleton` from `@/components/ui/skeleton` | Match card/table row heights                                                   |

### Navigation placement (proposed extensions)

| Group              | New / extended routes                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Operations**     | `/reservations` (advanced), `/housekeeping`, `/housekeeping/mobile`, `/maintenance`, `/tasks`, `/lost-found`, `/operations`                    |
| **Guests**         | `/guests` (CRM), `/loyalty`, `/check-in/online`, `/registration-cards`, `/guest-requests`, `/feedback`, `/communications`                      |
| **Commercial**     | `/revenue`, `/pricing`, `/groups`, `/corporate`, `/ota`, `/booking-engine`, `/packages`, `/add-ons`, `/concierge`, `/transport`, `/activities` |
| **Intelligence**   | `/ai-insights`, `/analytics/executive`, `/dashboard/multi-property`                                                                            |
| **Administration** | Existing config routes                                                                                                                         |

Permissions: extend `features/auth/lib/rbac.ts` mirroring existing `*.view` / `*.manage` pattern.

### Responsive behaviour (match current)

| Breakpoint | Behaviour                                                               |
| ---------- | ----------------------------------------------------------------------- |
| `< md`     | Single column; KPI 2-col; hide TopBar search; sidebar collapses to 64px |
| `lg`       | Master-detail splits; timeline horizontal scroll                        |
| `xl`       | TopBar “New Reservation” + date chip visible                            |

---

## Module specifications

Each module follows the deliverable template. **Wireframe** = structural ASCII layout. **Enhancements** = phase-2 only; do not block MVP.

---

# 1. Advanced Reservation Management

**Extends:** `/reservations` (`ReservationsFeature` — timeline, table, availability, rate, restrictions)

### A. Page overview

| Item                   | Detail                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------- |
| **Purpose**            | End-to-end reservation control: search, modify, block, waitlist, overbooking rules |
| **Roles**              | Reservations Manager, Front Office Manager, Revenue Manager (read-only rate views) |
| **Business objective** | Reduce booking errors and increase direct conversion                               |

### B–J summary

| Section        | Specification                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| **Layout**     | Existing `PageHeader` + toolbar + view switcher; add views: **Waitlist**, **Blocks**, **Allotment**     |
| **KPIs**       | Total Reservations · Today's Check-ins · Today's Check-outs · Occupancy % · Cancellations Today         |
| **Workspace**  | Default **Timeline** (existing); Table for bulk ops; Availability + Rate Cal + Restrictions unchanged   |
| **Actions**    | New reservation (primary), Filters, Export, row: Edit, Cancel, No-show, Send confirmation, Assign room  |
| **Filters**    | Date range, Status, Source, Room type, Rate plan, VIP, Corporate code                                   |
| **Modals**     | Edit reservation (multi-step Card sections), Cancel policy confirm (`alert-dialog`), Bulk status update |
| **Empty**      | Timeline: “No reservations in this range” + outline Button “Create reservation”                         |
| **Loading**    | Skeleton rows in TableView; timeline bars as `animate-pulse` blocks                                     |
| **Responsive** | Timeline scrolls horizontally; table becomes card list on mobile                                        |

### Deliverable

1. **Screen name:** Reservations — Advanced Workspace
2. **User story:** As a reservations manager, I want one screen to see occupancy and edit bookings so I can resolve conflicts without switching tools.
3. **UI layout:** PageHeader → KPI row (5) → toolbar (search + 7-tab switcher + filters) → main view.
4. **Components:** `PageHeader`, `KpiCard×5`, segmented tabs, `TimelineView`, `TableView`, `AvailabilityView`, `RateView`, `RestrictionsView`, `StatusBadge`, `Button`.
5. **Data:** reservation_id, guest_name, room, dates, status, source, rate, balance, flags (VIP, group)
6. **Actions:** Create, Edit, Cancel, Assign room, Export CSV, Bulk update status
7. **Workflow:** Search → filter → select bar/row → drawer edit → save → timeline refresh
8. **Wireframe:**

```
[Sidebar][ TopBar: Operations / Reservations ]
[PageHeader + Filters | New reservation]
[KPI][KPI][KPI][KPI][KPI]
[Search...............][Timeline|Table|Avail|Rate|...]
[=========== Timeline grid ==============]
```

9. **Enhancements:** Drag-drop room moves on timeline; conflict highlight overlay

---

# 2. Housekeeping Management

**Extends:** `/housekeeping` (`HousekeepingFeature`, `RoomCardGrid`, `HousekeepingStatus`)

### A. Page overview

| Item                   | Detail                                            |
| ---------------------- | ------------------------------------------------- |
| **Purpose**            | Floor-level room status, assignments, inspections |
| **Roles**              | HK Supervisor, HK Attendant (mobile — see §27)    |
| **Business objective** | Faster room turnaround for arrivals               |

### B–J

| Section       | Specification                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| **KPIs**      | Clean Rooms · Dirty Rooms · Inspection Pending · Out Of Service · Avg Turnaround (min)                  |
| **Workspace** | `HousekeepingStatus` strip + **floor-grouped room card grid** (existing `cardBg` left-border semantics) |
| **Actions**   | Assign staff, Filter, Mark clean, Request inspection, Set OOO                                           |
| **Filters**   | Floor, Status, Attendant, Priority (arrival), Room type                                                 |
| **Modals**    | Assign staff (multi-select), Inspection checklist Card                                                  |
| **Views**     | Board (default), **List** (table), **By attendant** (kanban columns: Assigned / In progress / Done)     |

### Deliverable

1. **Screen:** Housekeeping — Room Board
2. **Story:** As HK supervisor, I assign rooms and track inspection so arrivals are not delayed.
3. **Layout:** PageHeader → KPI×5 → filters → floor sections with room tiles
4. **Components:** `KpiCard`, `Card`, room tiles with `StatusBadge`, `Button`
5. **Data:** room_no, floor, status, attendant, priority, last_cleaned, guest_departure_time
6. **Actions:** Assign, Mark clean, Inspect, OOO
7. **Workflow:** Filter dirty+arrival → assign → attendant cleans → supervisor inspects → Ready
8. **Wireframe:** KPI row → `[Floor 4: [204][205][206]...]`
9. **Enhancements:** Push notify attendant on new dirty arrival room

---

# 3. Maintenance Management

**New:** `/maintenance` (pattern: Front Desk OOO tab + work orders)

### A. Page overview

| Item                   | Detail                                                                      |
| ---------------------- | --------------------------------------------------------------------------- |
| **Purpose**            | Work orders, preventive maintenance, vendor tracking                        |
| **Roles**              | Chief Engineer, Maintenance Tech, Front Office (create guest-facing issues) |
| **Business objective** | Minimize OOO room nights                                                    |

### B–J

| Section       | Specification                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------------- |
| **KPIs**      | Open Work Orders · Critical · Rooms OOO · Avg Resolution (hrs) · PM Due This Week                  |
| **Workspace** | **Kanban:** Reported → In Progress → Waiting Parts → Resolved; cards show room, category, priority |
| **Actions**   | Create work order, Assign tech, Escalate, Close, Link to room OOO                                  |
| **Filters**   | Priority, Category (HVAC, Plumbing…), Floor, Status, Assigned to                                   |
| **Modals**    | Create/Edit WO (form in Card), Photo attach, Close with resolution notes                           |

### Deliverable

1. **Screen:** Maintenance — Work Order Board
2. **Story:** As engineer, I triage and assign repairs so OOO rooms return to inventory.
3. **Layout:** PageHeader → KPI×4 → kanban columns in horizontal scroll Card
4. **Components:** `KpiCard`, `Card`, `StatusBadge`, `Button`, kanban columns (same tab styling as Front Desk)
5. **Data:** wo_id, room, category, priority, status, assignee, created_at, sla
6. **Actions:** Create, Assign, Complete, Reopen
7. **Workflow:** FO reports → WO created → assign → resolve → auto-clear OOO if linked
8. **Wireframe:** `[Reported|In Progress|Waiting|Done]` columns with stacked cards
9. **Enhancements:** PM calendar view for scheduled tasks

---

# 4. Guest CRM

**Extends:** `/guests` (`GuestsFeature` — list + `GuestDetailsCard`)

### A. Page overview

| Item                   | Detail                                               |
| ---------------------- | ---------------------------------------------------- |
| **Purpose**            | 360° guest profile, preferences, stay history, spend |
| **Roles**              | Guest Relations, Front Office, Sales                 |
| **Business objective** | Personalization and repeat bookings                  |

### B–J

| Section       | Specification                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| **KPIs**      | Total Guests · Repeat Guests · Loyalty Members · Avg LTV · Guest Satisfaction (NPS)                              |
| **Workspace** | Left: searchable table (`GuestsList`); Right: inspector with tabs: Profile, Stays, Preferences, Notes, Documents |
| **Actions**   | Add guest, Merge duplicate, Add note, Tag, Export segment                                                        |
| **Filters**   | Tier, Nationality, Last stay, Tags, Corporate account                                                            |

### Deliverable

1. **Screen:** Guest Profiles — CRM Workspace
2. **Story:** As guest relations, I see full history before VIP arrival.
3. **Layout:** `lg:grid-cols-[1fr_360px]` master-detail
4. **Components:** `PageHeader`, `Card`, table, `GuestDetailsCard` extended tabs
5. **Data:** guest_id, contact, tier, stays[], preferences{}, tags[], total_spend
6. **Actions:** Edit, Note, Tag, View reservation, Send message
7. **Workflow:** Search → select → review tabs → action
8. **Wireframe:** `[Table list | Detail panel tabs]`
9. **Enhancements:** AI suggested talking points (reuse AI Insights card style)

---

# 5. Loyalty Program

**New:** `/loyalty`

### A. Page overview

| Item                   | Detail                                                  |
| ---------------------- | ------------------------------------------------------- |
| **Purpose**            | Tiers, points, redemptions, campaigns                   |
| **Roles**              | Marketing, Guest Relations, Finance (liability reports) |
| **Business objective** | Increase repeat rate and direct bookings                |

### B–J

| Section       | Specification                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------- |
| **KPIs**      | Active Members · Points Issued (MTD) · Redemptions · Tier Distribution · Program ROI                |
| **Workspace** | Tabs: **Members** (table), **Tiers & Rules** (Card forms), **Campaigns** (list), **Ledger** (table) |
| **Actions**   | Adjust points, Issue comp night, Create campaign, Export members                                    |
| **Filters**   | Tier, Points balance range, Enrollment date, Property                                               |

### Deliverable

1. **Screen:** Loyalty Program — Administration
2. **Story:** As marketing, I configure tiers and track redemptions.
3. **Layout:** PageHeader → KPI×4 → segmented tabs → table/cards
4. **Components:** `KpiCard`, `Card`, `StatusBadge`, `Button`, tables
5. **Data:** member_id, tier, points_balance, lifetime_points, last_activity
6. **Actions:** Credit/debit points, Change tier, Pause membership
7. **Workflow:** Member search → adjust → audit log entry
8. **Wireframe:** KPIs → `[Members|Tiers|Campaigns]` → table
9. **Enhancements:** Auto-tier upgrade rules engine UI

---

# 6. OTA / Channel Manager

**Extends:** `/ota` (`OtaFeature`)

### A. Page overview

| Item                   | Detail                                             |
| ---------------------- | -------------------------------------------------- |
| **Purpose**            | Channel connectivity, parity, mapping, sync health |
| **Roles**              | Revenue Manager, Distribution Manager              |
| **Business objective** | Maximize reach without rate parity violations      |

### B–J

| Section       | Specification                                                                                |
| ------------- | -------------------------------------------------------------------------------------------- |
| **KPIs**      | Channel Bookings MTD · Channel Revenue · Avg Commission · Sync Health · Parity Alerts        |
| **Workspace** | Channel performance table (existing) + new tabs: **Mapping**, **Restrictions**, **Sync log** |
| **Actions**   | Sync now, Pause channel, Fix mapping, Override rate (with approval)                          |
| **Filters**   | Channel, Room type, Date, Parity status                                                      |

### Deliverable

1. **Screen:** OTA & Channel Manager
2. **Story:** As distribution manager, I fix mapping errors before they cause overbooks.
3. **Layout:** Existing OTA page + Mapping grid (room type × channel)
4. **Components:** `OtaFeature` table, `StatusBadge` for parity, `Button` Sync
5. **Data:** channel, mapping_status, last_sync, bookings, revenue, parity_flag
6. **Actions:** Sync, Map room, Set stop-sell
7. **Workflow:** Alert → mapping tab → fix → sync → verify log
8. **Wireframe:** KPIs → channel table → mapping sub-tab grid
9. **Enhancements:** One-click parity correction suggestions (AI)

---

# 7. Revenue Management

**Extends:** `/revenue` (`RevenueFeature`, `RevenueCalendar`)

### A. Page overview

| Item                   | Detail                              |
| ---------------------- | ----------------------------------- |
| **Purpose**            | Rate strategy by room type and date |
| **Roles**              | Revenue Manager, GM (read-only)     |
| **Business objective** | Optimize RevPAR                     |

### B–J

| Section       | Specification                                                       |
| ------------- | ------------------------------------------------------------------- |
| **KPIs**      | RevPAR · ADR · Occupancy Forecast · Pickup (7d) · Compression Index |
| **Workspace** | Rate calendar grid (existing) + sidebar: restrictions summary       |
| **Actions**   | Bulk rate update, Set min/max, Close category, Export               |
| **Filters**   | Room type, Date range, Rate plan, Day of week                       |

### Deliverable

1. **Screen:** Revenue Management — Rate Calendar
2. **Story:** As RM, I adjust weekend rates based on pickup.
3. **Layout:** PageHeader with date nav → calendar Card
4. **Components:** `RevenueCalendar`, `KpiCard`, chevron date control
5. **Data:** date, room_type, rate, restriction, occupancy_forecast
6. **Actions:** Edit cell, Bulk apply, Copy pattern
7. **Workflow:** Review KPIs → select range → edit → publish
8. **Wireframe:** `[← May 15 →]` grid room types × dates
9. **Enhancements:** Competitor rate overlay row

---

# 8. Dynamic Pricing

**New:** `/pricing` (links from Revenue + AI Insights)

### A. Page overview

| Item                   | Detail                                           |
| ---------------------- | ------------------------------------------------ |
| **Purpose**            | Rules-based and AI-assisted price automation     |
| **Roles**              | Revenue Manager                                  |
| **Business objective** | Capture demand spikes without manual daily edits |

### B–J

| Section       | Specification                                                                             |
| ------------- | ----------------------------------------------------------------------------------------- |
| **KPIs**      | Rules Active · Auto Adjustments (7d) · Revenue Uplift · Override Count · Confidence Score |
| **Workspace** | List of rules (table) + **Simulation** panel (chart); AI rec cards from `AIPricingRecs`   |
| **Actions**   | Create rule, Enable/disable, Apply AI suggestion, Simulate                                |
| **Filters**   | Room type, Trigger type, Status                                                           |

### Deliverable

1. **Screen:** Dynamic Pricing — Rules & Simulation
2. **Story:** As RM, I enable occupancy-based rules with guardrails.
3. **Layout:** `lg:grid-cols-[1fr_360px]` rules table + simulation chart
4. **Components:** `Card`, `AIPricingRecs`, Recharts, `StatusBadge`
5. **Data:** rule_id, trigger, adjustment%, floor, ceiling, last_run
6. **Actions:** Create, Test, Deploy, Rollback
7. **Workflow:** Simulate → review uplift → enable rule
8. **Wireframe:** Rules table | Simulation chart + AI card
9. **Enhancements:** A/B test two rule sets

---

# 9. Group Booking Management

**New:** `/groups` (extends NewReservation `group` type)

### A. Page overview

| Item                   | Detail                                               |
| ---------------------- | ---------------------------------------------------- |
| **Purpose**            | Blocks, rooming lists, cut-off dates, billing master |
| **Roles**              | Reservations, Sales, Events                          |
| **Business objective** | Streamline group and event revenue                   |

### B–J

| Section       | Specification                                                                    |
| ------------- | -------------------------------------------------------------------------------- |
| **KPIs**      | Active Groups · Rooms Blocked · Pickup % · Revenue on Books · Cut-offs This Week |
| **Workspace** | Table of groups + detail drawer: rooming list, pickup chart                      |
| **Views**     | List, **Block calendar**, Rooming list editor                                    |
| **Actions**   | Create group, Import rooming list, Release unpicked, Bill master account         |

### Deliverable

1. **Screen:** Group Bookings — Block Manager
2. **Story:** As reservations, I track pickup against block before cut-off.
3. **Layout:** PageHeader → KPI×4 → groups table → detail drawer
4. **Components:** `TableView` pattern, `Card`, `StatusBadge`, wizard link to `/reservations/new` group type
5. **Data:** group_id, name, dates, blocked, picked_up, cut_off, master_account
6. **Actions:** Create, Edit block, Import CSV, Release
7. **Workflow:** Create block → share link → import rooming → monitor pickup
8. **Wireframe:** KPIs → groups table → [drawer: rooming list]
9. **Enhancements:** Digital rooming list portal for group leader

---

# 10. Corporate Booking Management

**New:** `/corporate`

### A. Page overview

| Item                   | Detail                                               |
| ---------------------- | ---------------------------------------------------- |
| **Purpose**            | Corporate accounts, negotiated rates, direct billing |
| **Roles**              | Sales, Finance, Reservations                         |
| **Business objective** | B2B contract compliance and fast booking             |

### B–J

| Section       | Specification                                                                     |
| ------------- | --------------------------------------------------------------------------------- |
| **KPIs**      | Active Accounts · MTD Room Nights · MTD Revenue · Avg Rate vs BAR · Open Invoices |
| **Workspace** | Accounts table → account detail: contacts, rate plans, reservation list           |
| **Actions**   | New account, Link reservation, Generate statement, Upload contract                |

### Deliverable

1. **Screen:** Corporate Accounts
2. **Story:** As sales, I book under negotiated rate with correct billing routing.
3. **Layout:** Master-detail `lg:grid-cols-[1fr_400px]`
4. **Components:** `Card`, tables, `CorporateForm` from new reservation
5. **Data:** account_id, company, rate_code, credit_limit, contacts[]
6. **Actions:** Create account, New corp reservation, Export statement
7. **Workflow:** Select account → new res with pre-filled rate → direct bill flag
8. **Wireframe:** Account list | Account detail + reservations
9. **Enhancements:** Credit hold alerts

---

# 11. Online Check-In

**Extends:** `/check-in` (`CheckInFeature` wizard)

### A. Page overview

| Item                   | Detail                                                         |
| ---------------------- | -------------------------------------------------------------- |
| **Purpose**            | Pre-arrival digital check-in queue for staff                   |
| **Roles**              | Front Office, Guest (external — separate lightweight UI later) |
| **Business objective** | Reduce front desk wait time                                    |

### B–J

| Section       | Specification                                                                        |
| ------------- | ------------------------------------------------------------------------------------ |
| **KPIs**      | Pre-check-ins Today · Completed · Pending ID · Upsell Accepted · Avg Completion Time |
| **Workspace** | Queue list (arrivals pattern) + verification panel: ID, preferences, payment         |
| **Actions**   | Approve, Request more info, Assign room, Send key                                    |

### Deliverable

1. **Screen:** Check-In — Online Queue
2. **Story:** As FO agent, I approve pre-check-ins before guest arrives.
3. **Layout:** Front Desk arrivals queue pattern (`FrontDeskFeature`)
4. **Components:** `Card`, queue list, `StatusBadge`, step wizard reuse
5. **Data:** res_id, guest, documents[], payment_status, room_pref
6. **Actions:** Approve, Reject, Message guest
7. **Workflow:** Guest completes online → appears in queue → agent approves → room assigned
8. **Wireframe:** Left queue | Right verification cards
9. **Enhancements:** Mobile guest pre-check-in web (brand-matched, no shell)

---

# 12. Digital Registration Cards

**New:** `/registration-cards`

### A. Page overview

| Item                   | Detail                                                       |
| ---------------------- | ------------------------------------------------------------ |
| **Purpose**            | Reg card templates, e-sign capture, legal compliance archive |
| **Roles**              | Front Office, Compliance                                     |
| **Business objective** | Paperless registration                                       |

### B–J

| Section       | Specification                                                                    |
| ------------- | -------------------------------------------------------------------------------- |
| **KPIs**      | Signed Today · Pending Signature · Exceptions · Avg Sign Time                    |
| **Workspace** | Table: reservation, guest, status, signed_at + preview pane (Card mock reg card) |
| **Actions**   | Send for signature, Resend, Print backup, View PDF                               |

### Deliverable

1. **Screen:** Registration Cards — Archive
2. **Story:** As FO, I verify signed reg cards are on file.
3. **Layout:** Table + preview `lg:grid-cols-[1fr_400px]`
4. **Components:** `Card` preview, table, `StatusBadge`
5. **Data:** res_id, template_version, signature_status, pdf_url
6. **Actions:** Send, Download, Void & reissue
7. **Workflow:** Check-in triggers send → guest signs → auto-attach to profile
8. **Wireframe:** Table | Reg card preview
9. **Enhancements:** Multi-language templates

---

# 13. Guest Mobile Requests

**New:** `/guest-requests`

### A. Page overview

| Item                   | Detail                                                           |
| ---------------------- | ---------------------------------------------------------------- |
| **Purpose**            | In-stay requests from mobile app (amenities, housekeeping, etc.) |
| **Roles**              | Front Office, Concierge, HK                                      |
| **Business objective** | Faster guest service response                                    |

### B–J

| Section       | Specification                                                                   |
| ------------- | ------------------------------------------------------------------------------- |
| **KPIs**      | Open Requests · Avg Response Time · SLA Breaches · By Department · Satisfaction |
| **Workspace** | **Kanban** by status: New → Assigned → In Progress → Done                       |
| **Actions**   | Assign, Escalate, Complete, Message guest                                       |

### Deliverable

1. **Screen:** Guest Requests — Service Board
2. **Story:** As FO, I assign mobile requests to the right department.
3. **Layout:** KPIs → kanban (Maintenance/Task pattern)
4. **Components:** Kanban cards with room, guest, type, SLA timer
5. **Data:** request_id, room, type, priority, assignee, created_at
6. **Actions:** Assign, Complete, Reopen
7. **Workflow:** Request in → triage → assign → complete → guest notified
8. **Wireframe:** `[New|Assigned|Progress|Done]`
9. **Enhancements:** Guest chat thread in drawer

---

# 14. Task Management

**New:** `/tasks`

### A. Page overview

| Item                   | Detail                               |
| ---------------------- | ------------------------------------ |
| **Purpose**            | Cross-department tasks and reminders |
| **Roles**              | All operational roles                |
| **Business objective** | Accountability beyond single modules |

### B–J

| Section       | Specification                                                         |
| ------------- | --------------------------------------------------------------------- |
| **KPIs**      | Open Tasks · Due Today · Overdue · Completed (7d) · By Department     |
| **Workspace** | Views: **List** (table), **Board** (kanban by assignee), **Calendar** |
| **Actions**   | Create task, Assign, Snooze, Complete, Bulk reassign                  |

### Deliverable

1. **Screen:** Tasks — Operations Board
2. **Story:** As manager, I assign follow-ups that span departments.
3. **Layout:** PageHeader → KPI → view switcher → board/list
4. **Components:** Segmented control, `Card`, table
5. **Data:** task_id, title, dept, assignee, due, priority, linked_entity
6. **Actions:** CRUD, Complete, Comment
7. **Workflow:** Create → assign → notify → complete
8. **Wireframe:** KPIs → `[List|Board|Cal]` → content
9. **Enhancements:** Recurring tasks

---

# 15. Lost & Found

**New:** `/lost-found`

### A. Page overview

| Item                   | Detail                                     |
| ---------------------- | ------------------------------------------ |
| **Purpose**            | Log, store, match, and release found items |
| **Roles**              | Front Office, Security                     |
| **Business objective** | Guest satisfaction and liability control   |

### B–J

| Section       | Specification                                                               |
| ------------- | --------------------------------------------------------------------------- |
| **KPIs**      | Open Items · Awaiting Claim · Released (MTD) · Expired · Match Suggestions  |
| **Workspace** | Table with photo thumb, location found, status + **Match guest** side panel |
| **Actions**   | Log item, Match to guest, Notify guest, Mark disposed, Print label          |

### Deliverable

1. **Screen:** Lost & Found — Registry
2. **Story:** As FO, I log found items and notify matching guests.
3. **Layout:** KPIs → filter toolbar → table → detail drawer
4. **Components:** Table in `Card`, `StatusBadge`, image thumb 40px
5. **Data:** item_id, description, location, date, status, guest_match?, storage_bin
6. **Actions:** Create, Match, Release, Dispose
7. **Workflow:** Log → store → AI/guest match → contact → release signature
8. **Wireframe:** Table with status badges
9. **Enhancements:** Guest self-claim portal link

---

# 16. Guest Feedback Management

**New:** `/feedback`

### A. Page overview

| Item                   | Detail                                         |
| ---------------------- | ---------------------------------------------- |
| **Purpose**            | Surveys, reviews, complaints, recovery actions |
| **Roles**              | Guest Relations, GM, Department heads          |
| **Business objective** | Improve scores and resolve issues fast         |

### B–J

| Section       | Specification                                                       |
| ------------- | ------------------------------------------------------------------- |
| **KPIs**      | NPS · CSAT · Open Complaints · Avg Resolution · Review Rating (OTA) |
| **Workspace** | Tabs: Inbox (table), Analytics (charts), Recovery actions           |
| **Actions**   | Assign owner, Respond, Escalate, Close with resolution              |

### Deliverable

1. **Screen:** Guest Feedback — Inbox
2. **Story:** As guest relations, I resolve complaints within SLA.
3. **Layout:** Reports-style KPIs + filterable inbox table
4. **Components:** `KpiCard`, charts, `StatusBadge` severity
5. **Data:** feedback_id, guest, channel, score, category, status, owner
6. **Actions:** Reply, Assign, Close, Export
7. **Workflow:** New feedback → triage → assign dept → respond → close
8. **Wireframe:** KPIs → inbox table
9. **Enhancements:** Sentiment AI tag (reuse AI card)

---

# 17. Guest Communication Center

**Extends:** `/communications` (`CommunicationsFeature`)

### A. Page overview

| Item                   | Detail                                              |
| ---------------------- | --------------------------------------------------- |
| **Purpose**            | Unified SMS, email, WhatsApp threads per guest/stay |
| **Roles**              | Front Office, Guest Relations                       |
| **Business objective** | One thread per guest, compliant messaging           |

### B–J

| Section       | Specification                                                                 |
| ------------- | ----------------------------------------------------------------------------- | ------------------------------ |
| **KPIs**      | Unread Threads · Avg Response · Templates Sent · Failed Deliveries · Opt-outs |
| **Workspace** | `lg:grid-cols-[280px_1fr]`: thread list                                       | message pane (chat UI in Card) |
| **Actions**   | New message, Use template, Schedule, Mark resolved                            |

### Deliverable

1. **Screen:** Communications — Unified Inbox
2. **Story:** As FO, I message guests from one inbox tied to reservation.
3. **Layout:** Three-column: threads | messages | guest context card
4. **Components:** `Card`, list items, compose bar (input h-9), template dropdown
5. **Data:** thread_id, guest, channel, messages[], reservation_id
6. **Actions:** Send, Template, Attach, Resolve
7. **Workflow:** Select thread → review context → reply → log on profile
8. **Wireframe:** `[Threads | Chat | Guest card]`
9. **Enhancements:** AI suggested replies

---

# 18. Multi Property Dashboard

**New:** `/dashboard/multi-property` (extends property switcher in Sidebar)

### A. Page overview

| Item                   | Detail                                     |
| ---------------------- | ------------------------------------------ |
| **Purpose**            | Portfolio view across properties           |
| **Roles**              | Regional Manager, Owner, HQ Operations     |
| **Business objective** | Compare performance and allocate resources |

### B–J

| Section       | Specification                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------ |
| **KPIs**      | Portfolio Occupancy · Revenue · RevPAR · HK Readiness · Critical Alerts                          |
| **Workspace** | Property comparison table + sparkline cards per property (reuse `DashboardFeature` widgets mini) |
| **Actions**   | Switch property, Export portfolio, Drill into property dashboard                                 |

### Deliverable

1. **Screen:** Multi-Property — Portfolio Command
2. **Story:** As regional manager, I see all hotels' KPIs in one view.
3. **Layout:** PageHeader → KPI strip → property grid cards
4. **Components:** `KpiCard`, `Card`, small charts, property switcher pattern from Sidebar
5. **Data:** property_id, name, occ%, revenue, alerts_count
6. **Actions:** Drill down, Export
7. **Workflow:** Review portfolio → click property → land on property `/` dashboard
8. **Wireframe:** KPIs → grid of property cards
9. **Enhancements:** Map view of properties

---

# 19. AI Insights Dashboard

**Extends:** `/ai-insights` (`AIInsightsFeature`)

### A. Page overview

| Item                   | Detail                                               |
| ---------------------- | ---------------------------------------------------- |
| **Purpose**            | Actionable AI recommendations across ops and revenue |
| **Roles**              | GM, Revenue Manager, FO Manager                      |
| **Business objective** | Decision support without separate BI tool            |

### B–J

| Section       | Specification                                                                       |
| ------------- | ----------------------------------------------------------------------------------- |
| **KPIs**      | Active Insights · Applied (7d) · Est. Revenue Impact · Risk Alerts · Confidence Avg |
| **Workspace** | Insight cards (existing 3-col) + `DemandCalendar` + `AssistantPanel`                |
| **Actions**   | Apply suggestion, Dismiss, Snooze, Explain                                          |

### Deliverable

1. **Screen:** AI Insights (existing, extended categories)
2. **Story:** As GM, I act on pricing and service recommendations.
3. **Layout:** Existing `AIInsightsFeature` + filter by category
4. **Components:** AI cards, `DemandCalendar`, `AssistantPanel`
5. **Data:** insight_id, type, impact, confidence, actions[]
6. **Actions:** Apply, Dismiss, Delegate
7. **Workflow:** Review → apply or dismiss → track outcome
8. **Wireframe:** `[Insight cards row][Calendar][Assistant]`
9. **Enhancements:** Feedback loop on suggestion quality

---

# 20. Executive Analytics Dashboard

**New:** `/analytics/executive` (extends Reports)

### A. Page overview

| Item                   | Detail                      |
| ---------------------- | --------------------------- |
| **Purpose**            | Board-level KPIs and trends |
| **Roles**              | Owner, GM, CFO              |
| **Business objective** | Strategic visibility        |

### B–J

| Section       | Specification                                                          |
| ------------- | ---------------------------------------------------------------------- |
| **KPIs**      | Revenue · GOPPAR · Occupancy · ADR · Labor Cost % · Guest Satisfaction |
| **Workspace** | Full-width charts (Reports pattern) + period comparison                |
| **Actions**   | Export PDF, Schedule email, Change period                              |

### Deliverable

1. **Screen:** Executive Analytics
2. **Story:** As owner, I view monthly performance vs budget.
3. **Layout:** `ReportsFeature` without left categories — executive KPI row + 2×2 charts
4. **Components:** `KpiCard`, Recharts, export buttons in PageHeader
5. **Data:** financial periods, budget vs actual series
6. **Actions:** Export, Drill to report
7. **Workflow:** Select period → review → export for board pack
8. **Wireframe:** Large KPIs → 4 chart grid
9. **Enhancements:** Benchmark vs comp set

---

# 21. Booking Engine Management

**New:** `/booking-engine`

### A. Page overview

| Item                   | Detail                                              |
| ---------------------- | --------------------------------------------------- |
| **Purpose**            | Direct booking widget, promotions, engine analytics |
| **Roles**              | Marketing, Revenue, E-commerce                      |
| **Business objective** | Grow direct channel share                           |

### B–J

| Section       | Specification                                                                     |
| ------------- | --------------------------------------------------------------------------------- |
| **KPIs**      | Direct Bookings · Conversion Rate · Abandoned Carts · Promo Redemptions · Avg LOS |
| **Workspace** | Tabs: Settings (forms), Promotions table, Analytics chart                         |
| **Actions**   | Create promo, Copy embed code, Preview engine                                     |

### Deliverable

1. **Screen:** Booking Engine — Admin
2. **Story:** As marketing, I configure promos on the direct engine.
3. **Layout:** PageHeader → KPI×4 → tabs
4. **Components:** `Card` forms, table, chart
5. **Data:** promo_code, discount, validity, bookings, conversion
6. **Actions:** CRUD promo, Preview
7. **Workflow:** Configure → preview → publish → monitor analytics
8. **Wireframe:** KPIs → Settings | Promos | Analytics
9. **Enhancements:** A/B promo tests

---

# 22. Package Management

**New:** `/packages`

### A. Page overview

| Item                   | Detail                           |
| ---------------------- | -------------------------------- |
| **Purpose**            | Bundled rates (room + F&B + spa) |
| **Roles**              | Revenue, Marketing               |
| **Business objective** | Higher ADR and ancillary revenue |

### B–J

| Section       | Specification                                                        |
| ------------- | -------------------------------------------------------------------- |
| **KPIs**      | Active Packages · Bookings MTD · Package Revenue · Avg Uplift vs BAR |
| **Workspace** | Package catalog table + editor Card (inclusions, pricing rules)      |
| **Actions**   | Create package, Clone, Activate/deactivate, Link to engine           |

### Deliverable

1. **Screen:** Packages — Catalog
2. **Story:** As RM, I sell honeymoon package across channels consistently.
3. **Layout:** Table + slide-over editor (Card stack)
4. **Components:** `PackageForm` pattern from new reservation
5. **Data:** package_id, inclusions[], price, channels[], validity
6. **Actions:** CRUD, Publish
7. **Workflow:** Create → map to room types → publish to OTA + direct
8. **Wireframe:** Package table → edit drawer
9. **Enhancements:** Inventory caps per package

---

# 23. Add-On Services Management

**New:** `/add-ons`

### A. Page overview

| Item                   | Detail                                                  |
| ---------------------- | ------------------------------------------------------- |
| **Purpose**            | Sellable extras: breakfast, spa, parking, late checkout |
| **Roles**              | F&B, Spa, Front Office                                  |
| **Business objective** | Incremental revenue per stay                            |

### B–J

| Section       | Specification                                             |
| ------------- | --------------------------------------------------------- |
| **KPIs**      | Attach Rate · Revenue MTD · Top SKU · Pending Fulfillment |
| **Workspace** | Product catalog table + categories filter                 |
| **Actions**   | Add product, Set price by date, Fulfill pending           |

### Deliverable

1. **Screen:** Add-On Services
2. **Story:** As FO, I post add-ons to folio at check-in.
3. **Layout:** KPIs → category chips → product table
4. **Components:** Table, `StatusBadge` availability
5. **Data:** sku, name, price, dept, fulfillment_type
6. **Actions:** CRUD, Post to folio
7. **Workflow:** Configure catalog → sell at res/check-in → dept fulfills
8. **Wireframe:** KPIs → filter chips → table
9. **Enhancements:** Upsell rules at check-in

---

# 24. Concierge Management

**New:** `/concierge`

### A. Page overview

| Item                   | Detail                                              |
| ---------------------- | --------------------------------------------------- |
| **Purpose**            | Restaurant bookings, tickets, local recommendations |
| **Roles**              | Concierge, Front Office                             |
| **Business objective** | Premium guest experience                            |

### B–J

| Section       | Specification                                                        |
| ------------- | -------------------------------------------------------------------- |
| **KPIs**      | Open Requests · Completed Today · Partner Commissions · Guest Rating |
| **Workspace** | Queue + detail (extends `GuestServices` tab pattern)                 |
| **Actions**   | Create request, Confirm with vendor, Charge to folio                 |

### Deliverable

1. **Screen:** Concierge — Request Desk
2. **Story:** As concierge, I track restaurant bookings to completion.
3. **Layout:** Front Desk guest services pattern — queue left, detail right
4. **Components:** `GuestServices`, `Card`, `StatusBadge`
5. **Data:** request_type, guest, vendor, datetime, status, notes
6. **Actions:** Create, Confirm, Cancel, Bill
7. **Workflow:** Guest asks → log → vendor confirm → close
8. **Wireframe:** Queue | Detail form
9. **Enhancements:** Partner API confirmations

---

# 25. Transportation Management

**New:** `/transport`

### A. Page overview

| Item                   | Detail                                    |
| ---------------------- | ----------------------------------------- |
| **Purpose**            | Airport transfers, car hire, schedules    |
| **Roles**              | Concierge, Front Office, Transport vendor |
| **Business objective** | Reliable arrivals/departures              |

### B–J

| Section       | Specification                                                     |
| ------------- | ----------------------------------------------------------------- |
| **KPIs**      | Pickups Today · Drop-offs · Delayed · Revenue · Fleet Utilization |
| **Workspace** | **Calendar/timeline** day view + list table                       |
| **Actions**   | Schedule ride, Assign driver, Notify guest, Mark complete         |

### Deliverable

1. **Screen:** Transportation — Schedule
2. **Story:** As FO, I schedule airport pickup tied to flight time.
3. **Layout:** KPIs → day timeline (Reservations timeline pattern) + table
4. **Components:** Timeline bars, table, `StatusBadge`
5. **Data:** trip_id, guest, flight, pickup_time, vehicle, driver, status
6. **Actions:** Schedule, Edit, Cancel, Complete
7. **Workflow:** Res has flight → auto-suggest pickup → confirm → dispatch
8. **Wireframe:** Day timeline + list below
9. **Enhancements:** Flight delay auto-adjust

---

# 26. Activity & Excursion Management

**New:** `/activities`

### A. Page overview

| Item                   | Detail                                   |
| ---------------------- | ---------------------------------------- |
| **Purpose**            | Tours, experiences, capacity management  |
| **Roles**              | Concierge, Activities desk               |
| **Business objective** | Ancillary revenue and guest satisfaction |

### B–J

| Section       | Specification                                                      |
| ------------- | ------------------------------------------------------------------ |
| **KPIs**      | Bookings Today · Capacity Used · Revenue · No-shows · Top Activity |
| **Workspace** | Catalog + **calendar** availability per activity                   |
| **Actions**   | Book slot, Waitlist, Cancel, Check-in to activity                  |

### Deliverable

1. **Screen:** Activities — Booking Calendar
2. **Story:** As activities desk, I book city tour without overcapacity.
3. **Layout:** Revenue calendar grid adapted for activity slots
4. **Components:** Calendar grid, `Card`, booking modal
5. **Data:** activity_id, slots, capacity, bookings[], price
6. **Actions:** Book, Cancel, Waitlist
7. **Workflow:** Guest requests → check capacity → book → charge folio
8. **Wireframe:** Activity list | Slot calendar
9. **Enhancements:** Vendor portal

---

# 27. Housekeeping Mobile Workspace

**New:** `/housekeeping/mobile` (simplified shell for attendants)

### A. Page overview

| Item                   | Detail                                         |
| ---------------------- | ---------------------------------------------- |
| **Purpose**            | Attendant task list and room updates on mobile |
| **Roles**              | HK Attendant, Supervisor                       |
| **Business objective** | Real-time status on the floor                  |

### B–J

| Section        | Specification                                                  |
| -------------- | -------------------------------------------------------------- |
| **KPIs**       | My Assigned · Completed · Remaining · Avg Time/Room            |
| **Workspace**  | Large touch cards (one room per row), swipe or tap status      |
| **Actions**    | Start clean, Mark dirty, Request supplies, Mark inspected      |
| **Responsive** | Mobile-first: no sidebar; minimal top bar with back + property |

### Deliverable

1. **Screen:** Housekeeping Mobile — My Rooms
2. **Story:** As attendant, I update room status from my phone on the floor.
3. **Layout:** Compact header + stacked full-width room cards (larger tap targets h-16+)
4. **Components:** Status-colored cards (existing `cardBg`), primary FAB "Start next"
5. **Data:** assigned rooms[], status, priority, notes
6. **Actions:** Status transitions only (simplified)
7. **Workflow:** Open app → see list → tap room → update status
8. **Wireframe:** `[Room 204 Dirty ▼]` stacked cards
9. **Enhancements:** Offline sync

---

# 28. Centralized Operations Dashboard

**Extends:** `/` (`DashboardFeature`)

### A. Page overview

| Item                   | Detail                                                     |
| ---------------------- | ---------------------------------------------------------- |
| **Purpose**            | Single pane: occ, arrivals, HK, maintenance, tasks, alerts |
| **Roles**              | Duty Manager, GM, FO Manager                               |
| **Business objective** | Real-time ops control                                      |

### B–J

| Section       | Specification                                                                          |
| ------------- | -------------------------------------------------------------------------------------- |
| **KPIs**      | Occupancy · Arrivals · Departures · HK Ready % · Open WOs · Open Tasks                 |
| **Workspace** | Existing dashboard widgets + new rows: Maintenance summary, Task queue, Guest requests |
| **Actions**   | Drill to module, Acknowledge alert, Export snapshot                                    |

### Deliverable

1. **Screen:** Operations Command Center (Home)
2. **Story:** As duty manager, I see everything critical for today's operation.
3. **Layout:** Extend `DashboardFeature` grid — add 3rd row cards linking to modules
4. **Components:** All existing dashboard widgets + compact `Card` deep-links
5. **Data:** aggregated KPIs from HK, FD, maintenance, tasks APIs
6. **Actions:** Navigate, Acknowledge, Export
7. **Workflow:** Morning review → drill into exceptions
8. **Wireframe:** Existing dashboard + `[WO][Tasks][Requests]` row
9. **Enhancements:** Role-based widget layout

---

## Cross-module patterns

### Standard page template

```
AppShell
└── PageHeader (eyebrow, title, description, actions)
└── div.p-6.space-y-6
    ├── KpiCard grid (sm:grid-cols-4 or 5)
    ├── Toolbar (search + segmented views + filters)
    └── Main workspace (Card | grid | kanban | timeline)
```

### Modal / drawer standards

| Type                | Pattern                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| Confirm destructive | `@/components/ui/alert-dialog`                                                                  |
| Edit entity         | Right drawer or centered `dialog` with Card sections, footer: Cancel (outline) + Save (primary) |
| Quick view          | Click table row → highlight + right inspector (360px)                                           |

### Empty state copy tone

> No {entities} yet. {One-line benefit}. [Primary action]

Example: _No work orders yet. Log issues to track repairs and free up rooms._ **[Create work order]**

### Loading

- KPI row: 4–5 `Skeleton` h-24
- Table: 8 rows `Skeleton` h-12
- Timeline: gray pulse bars in grid cells

### Implementation priority (suggested)

| Phase  | Modules                             |
| ------ | ----------------------------------- |
| **P0** | 1, 2, 3, 4, 7, 28 (extend existing) |
| **P1** | 6, 8, 9, 10, 11, 17, 19, 20         |
| **P2** | 5, 12–16, 21–27                     |
| **P3** | 18 (Multi-Property Dashboard)       |

---

## Appendix: Existing route map

| Route               | Feature               | Relation to spec |
| ------------------- | --------------------- | ---------------- |
| `/`                 | DashboardFeature      | §28              |
| `/reservations`     | ReservationsFeature   | §1               |
| `/reservations/new` | NewReservationFeature | §9, 10, 22       |
| `/front-desk`       | FrontDeskFeature      | §11 patterns     |
| `/check-in`         | CheckInFeature        | §11              |
| `/housekeeping`     | HousekeepingFeature   | §2, §27          |
| `/guests`           | GuestsFeature         | §4               |
| `/communications`   | CommunicationsFeature | §17              |
| `/revenue`          | RevenueFeature        | §7               |
| `/ota`              | OtaFeature            | §6               |
| `/ai-insights`      | AIInsightsFeature     | §19              |
| `/reports`          | ReportsFeature        | §20              |

---

_All new UI must import from `@/components/ui/Primitives` and use design tokens from `src/styles.css`. Refer to `.cursor/rules/retrod-pms-theme.mdc` for colors and typography._
