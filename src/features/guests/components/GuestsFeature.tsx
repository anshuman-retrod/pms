import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader, Button, KpiCard } from "@/components/ui/Primitives";
import { guests } from "@/services/mock/db";
import { GuestsList } from "./GuestsList";
import { GuestCrmPanel } from "./GuestCrmPanel";
import { type Guest } from "@/types/pms";

export function GuestsFeature() {
  const [selectedGuest, setSelectedGuest] = useState<Guest>(guests[0]);

  const kpis = useMemo(() => {
    const repeat = guests.filter((g) => g.visits > 1).length;
    const loyalty = guests.filter((g) => g.tier === "Platinum" || g.tier === "Gold").length;
    const npsAvg =
      guests.filter((g) => g.nps != null).reduce((a, g) => a + (g.nps ?? 0), 0) /
      Math.max(1, guests.filter((g) => g.nps != null).length);
    return { repeat, loyalty, npsAvg: Math.round(npsAvg) };
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Guests"
        title="Guest Profiles"
        description="A CRM-grade view of every guest who has stayed with us."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            Add guest
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Total guests" value="3,142" delta="6 in workspace" deltaTone="neutral" accent="brand" />
          <KpiCard label="Repeat guests" value={String(kpis.repeat)} accent="success" />
          <KpiCard label="Loyalty members" value={String(kpis.loyalty)} accent="info" />
          <KpiCard label="Guest satisfaction" value={`NPS ${kpis.npsAvg}`} accent="success" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <GuestsList guests={guests} selectedName={selectedGuest.name} onSelectGuest={setSelectedGuest} />
          {selectedGuest && <GuestCrmPanel guest={selectedGuest} />}
        </div>
      </div>
    </div>
  );
}
export default GuestsFeature;
