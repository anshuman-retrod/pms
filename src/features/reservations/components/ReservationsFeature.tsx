import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Filter, Plus, Search } from "lucide-react";
import { PageHeader, Button } from "@/components/ui/Primitives";
import {
  useReservationsQuery,
  useAvailabilityMatrixQuery,
  useRateCalendarQuery,
  useRestrictionsQuery,
  useWaitlistQuery,
  useGroupBlocksQuery,
  useArrivalsTodayQuery,
  useDeparturesTodayQuery,
  useOccupancyByTypeQuery,
  useMealPlansQuery,
  useRatePlansQuery,
  useHotelPackagesQuery,
  useAddOnProductsQuery,
  useHousekeepingRoomsQuery,
} from "@/services/mock/queries";
import { KpiCard } from "@/components/ui/Primitives";
import { WaitlistView } from "./WaitlistView";
import { BlocksView } from "./BlocksView";
import { TimelineView } from "./TimelineView";
import { TableView } from "./TableView";
import { AvailabilityView } from "./AvailabilityView";
import { RateView } from "./RateView";
import { RestrictionsView } from "./RestrictionsView";



const sourceColor: Record<string, string> = {
  "Booking.com": "var(--color-info)",
  Expedia: "var(--color-warning)",
  Direct: "var(--color-primary)",
  Agoda: "var(--color-success)",
  Airbnb: "var(--color-error)",
};

type BadgeTone = "success" | "warning" | "error" | "info" | "neutral" | "brand" | "dark";

const statusTone = (s: string) =>
  (({
    Confirmed: "success",
    "Checked-In": "info",
    "Checked-Out": "neutral",
    Pending: "warning",
    Cancelled: "error",
    "No-Show": "dark",
  })[s] as BadgeTone) || "neutral";

type View = "timeline" | "table" | "availability" | "rate" | "restrictions" | "waitlist" | "blocks";

export function ReservationsFeature() {
  const { data: reservations = [] } = useReservationsQuery();
  const { data: availabilityMatrix = [] } = useAvailabilityMatrixQuery();
  const { data: rateCalendar = [] } = useRateCalendarQuery();
  const { data: restrictions = [] } = useRestrictionsQuery();
  const { data: waitlist = [] } = useWaitlistQuery();
  const { data: groupBlocks = [] } = useGroupBlocksQuery();
  const { data: arrivalsToday = [] } = useArrivalsTodayQuery();
  const { data: departuresToday = [] } = useDeparturesTodayQuery();
  const { data: occupancyByType = [] } = useOccupancyByTypeQuery();
  const { data: mealPlans = [] } = useMealPlansQuery();
  const { data: ratePlans = [] } = useRatePlansQuery();
  const { data: hotelPackages = [] } = useHotelPackagesQuery();
  const { data: addOnProducts = [] } = useAddOnProductsQuery();

  const { data: housekeepingRooms = [] } = useHousekeepingRoomsQuery();

  const [view, setView] = useState<View>("timeline");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [timelineStartDate, setTimelineStartDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // Dynamic Timeline Logic
  const timelineDays = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(timelineStartDate);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  });

  const timelineRooms = housekeepingRooms.map(r => ({ num: r.num, type: r.type }));

  const timelineBars = reservations
    .filter(r => r.status !== "Cancelled" && r.status !== "No-Show")
    .map(r => {
      const startObj = new Date(timelineStartDate);
      startObj.setHours(0,0,0,0);
      const ciObj = new Date(r.ci);
      ciObj.setHours(0,0,0,0);
      
      const dayDiff = Math.round((ciObj.getTime() - startObj.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        id: r.id,
        room: r.room,
        start: dayDiff,
        span: r.nights,
        label: r.guest,
        source: r.source,
      };
    })
    .filter(b => b.start < 14 && b.start + b.span > 0 && b.room !== "Unassigned");

  const dummyBars = [
    { id: "dummy-1", room: "204", start: 1, span: 3, label: "John Mathews", source: "Booking.com" },
    { id: "dummy-2", room: "108", start: 1, span: 5, label: "H. Tanaka", source: "Expedia" },
    { id: "dummy-3", room: "215", start: 0, span: 1, label: "M. Weber", source: "Agoda" },
    { id: "dummy-4", room: "302", start: 1, span: 1, label: "A. Khan", source: "Booking.com" },
    { id: "dummy-5", room: "312", start: 1, span: 2, label: "P. Sharma", source: "Direct" },
    { id: "dummy-6", room: "401", start: 2, span: 3, label: "E. Rodriguez", source: "Direct" },
    { id: "dummy-7", room: "405", start: 2, span: 5, label: "S. Laurent", source: "Direct" },
  ];

  const allTimelineBars = [...timelineBars, ...dummyBars];  const filtered =
    statusFilter === "All" ? reservations : reservations.filter((r) => r.status === statusFilter);
  const totalRooms = occupancyByType.reduce((a, b) => a + b.total, 0);
  const occupied = occupancyByType.reduce((a, b) => a + b.occupied, 0);
  const occPct = Math.round((occupied / totalRooms) * 1000) / 10;
  const cancellationsToday = reservations.filter((r) => r.status === "Cancelled").length;

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

      <div className="responsive-page-x space-y-5 py-4 sm:space-y-6 sm:py-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard label="Total reservations" value={String(reservations.length)} accent="brand" />
          <KpiCard label="Check-ins today" value={String(arrivalsToday.length)} accent="success" />
          <KpiCard
            label="Check-outs today"
            value={String(departuresToday.length)}
            accent="warning"
          />
          <KpiCard label="Occupancy" value={`${occPct}%`} accent="info" />
          <KpiCard
            label="Cancellations"
            value={String(cancellationsToday)}
            deltaTone="error"
            accent="error"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Meal plans active"
            value={String(mealPlans.filter((m) => m.status === "Active").length)}
            accent="info"
          />
          <KpiCard
            label="Rate plans active"
            value={String(ratePlans.filter((r) => r.status === "Active").length)}
            accent="success"
          />
          <KpiCard
            label="Packages active"
            value={String(hotelPackages.filter((p) => p.status === "Active").length)}
            accent="warning"
          />
          <KpiCard label="Add-on services" value={String(addOnProducts.length)} accent="brand" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-disabled" />
            <input
              className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              placeholder="Search guest, ID, room, phone, email…"
            />
          </div>
          <div className="w-full overflow-x-auto sm:w-auto">
            <div className="flex min-w-max rounded-md border border-border bg-surface p-0.5 text-[12px]">
              {(
                [
                  "timeline",
                  "table",
                  "availability",
                  "rate",
                  "restrictions",
                  "waitlist",
                  "blocks",
                ] as View[]
              ).map((v) => (
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
                        : v === "waitlist"
                          ? "Waitlist"
                          : v === "blocks"
                            ? "Blocks"
                            : v}
                </button>
              ))}
            </div>
          </div>
          {view === "table" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded-md border border-border bg-surface px-2 text-[12px]"
            >
              {[
                "All",
                "Confirmed",
                "Checked-In",
                "Pending",
                "Cancelled",
                "No-Show",
                "Checked-Out",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          )}
          <div className="flex w-full flex-wrap items-center gap-2 text-[11px] text-text-secondary sm:ml-auto sm:w-auto">
            {view === "timeline" && (
              <div className="flex items-center gap-2 mr-4">
                <span className="font-medium text-text-primary">Start Date:</span>
                <input
                  type="date"
                  className="h-8 rounded-md border border-border bg-surface px-2 text-[12px] focus:border-primary focus:outline-none"
                  value={timelineStartDate}
                  onChange={(e) => setTimelineStartDate(e.target.value)}
                />
              </div>
            )}
            {Object.entries(sourceColor).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm" style={{ background: v }} />
                {k}
              </span>
            ))}
          </div>
        </div>

        {view === "timeline" && (
          <TimelineView days={timelineDays} rooms={timelineRooms} bars={allTimelineBars} sourceColor={sourceColor} />
        )}

        {view === "table" && (
          <TableView filtered={filtered} sourceColor={sourceColor} statusTone={statusTone} />
        )}

        {view === "availability" && <AvailabilityView availabilityMatrix={availabilityMatrix} />}

        {view === "rate" && <RateView rateCalendar={rateCalendar} />}

        {view === "restrictions" && <RestrictionsView restrictions={restrictions} />}

        {view === "waitlist" && <WaitlistView entries={waitlist} />}

        {view === "blocks" && <BlocksView blocks={groupBlocks} />}
      </div>
    </div>
  );
}
export default ReservationsFeature;
