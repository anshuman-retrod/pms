import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Filter, Plus, Search } from "lucide-react";
import { PageHeader, Button } from "@/components/ui/Primitives";
import {
  reservations,
  availabilityMatrix,
  rateCalendar,
  restrictions,
} from "@/services/mock/db";
import { TimelineView } from "./TimelineView";
import { TableView } from "./TableView";
import { AvailabilityView } from "./AvailabilityView";
import { RateView } from "./RateView";
import { RestrictionsView } from "./RestrictionsView";

const days = ["14 May", "15 May", "16 May", "17 May", "18 May", "19 May", "20 May"];
const rooms = [
  { num: "204", type: "Deluxe King" },
  { num: "108", type: "Executive" },
  { num: "215", type: "Deluxe Twin" },
  { num: "302", type: "Premier Suite" },
  { num: "312", type: "Premier Suite" },
  { num: "401", type: "Heritage Suite" },
  { num: "405", type: "Heritage Suite" },
];

const bars = [
  { room: "204", start: 1, span: 3, label: "John Mathews", source: "Booking.com" },
  { room: "108", start: 1, span: 5, label: "H. Tanaka", source: "Expedia" },
  { room: "215", start: 0, span: 1, label: "M. Weber", source: "Agoda" },
  { room: "302", start: 1, span: 1, label: "A. Khan", source: "Booking.com" },
  { room: "312", start: 1, span: 2, label: "P. Sharma", source: "Direct" },
  { room: "401", start: 2, span: 3, label: "E. Rodriguez", source: "Direct" },
  { room: "405", start: 2, span: 5, label: "S. Laurent", source: "Direct" },
];

const sourceColor: Record<string, string> = {
  "Booking.com": "var(--color-info)",
  Expedia: "var(--color-warning)",
  Direct: "var(--color-primary)",
  Agoda: "var(--color-success)",
  Airbnb: "var(--color-error)",
};

const statusTone = (s: string) =>
  (({ Confirmed: "success", "Checked-In": "info", "Checked-Out": "neutral", Pending: "warning", Cancelled: "error", "No-Show": "dark" }[s] as any) || "neutral");

type View = "timeline" | "table" | "availability" | "rate" | "restrictions";

export function ReservationsFeature() {
  const [view, setView] = useState<View>("timeline");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filtered = statusFilter === "All" ? reservations : reservations.filter((r) => r.status === statusFilter);

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Reservations"
        description="Plan, view, and manage every booking across rooms and channels."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="h-3.5 w-3.5" />
              Filters
            </Button>
            <Link to="/reservations/new">
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" />
                New reservation
              </Button>
            </Link>
          </>
        }
      />

      <div className="space-y-6 p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-disabled" />
            <input
              className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              placeholder="Search guest, ID, room, phone, email…"
            />
          </div>
          <div className="flex rounded-md border border-border bg-surface p-0.5 text-[12px]">
            {(["timeline", "table", "availability", "rate", "restrictions"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded px-3 py-1 capitalize transition ${
                  view === v
                    ? "bg-foreground text-background"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {v === "rate"
                  ? "Rate Cal"
                  : v === "restrictions"
                    ? "Restrictions"
                    : v === "availability"
                      ? "Availability"
                      : v}
              </button>
            ))}
          </div>
          {view === "table" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded-md border border-border bg-surface px-2 text-[12px]"
            >
              {["All", "Confirmed", "Checked-In", "Pending", "Cancelled", "No-Show", "Checked-Out"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          )}
          <div className="ml-auto flex items-center gap-2 text-[11px] text-text-secondary">
            {Object.entries(sourceColor).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm" style={{ background: v }} />
                {k}
              </span>
            ))}
          </div>
        </div>

        {view === "timeline" && (
          <TimelineView days={days} rooms={rooms} bars={bars} sourceColor={sourceColor} />
        )}

        {view === "table" && (
          <TableView filtered={filtered} sourceColor={sourceColor} statusTone={statusTone} />
        )}

        {view === "availability" && <AvailabilityView availabilityMatrix={availabilityMatrix} />}

        {view === "rate" && <RateView rateCalendar={rateCalendar} />}

        {view === "restrictions" && <RestrictionsView restrictions={restrictions} />}
      </div>
    </div>
  );
}
export default ReservationsFeature;
