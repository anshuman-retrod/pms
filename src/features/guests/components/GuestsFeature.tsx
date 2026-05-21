import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader, Button } from "@/components/ui/Primitives";
import { guests } from "@/services/mock/db";
import { GuestsList } from "./GuestsList";
import { GuestDetailsCard } from "./GuestDetailsCard";
import { type Guest } from "@/types/pms";

export function GuestsFeature() {
  const [selectedGuest, setSelectedGuest] = useState<Guest>(guests[0]);

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
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_360px]">
        {/* Guest list table */}
        <GuestsList guests={guests} onSelectGuest={setSelectedGuest} />

        {/* Selected guest inspector */}
        {selectedGuest && <GuestDetailsCard guest={selectedGuest} />}
      </div>
    </div>
  );
}
export default GuestsFeature;
