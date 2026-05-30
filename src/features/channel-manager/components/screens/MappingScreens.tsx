import { useMemo, useState } from "react";
import { Link2, RefreshCcw } from "lucide-react";
import { Button, Card, CardHeader, KpiCard, StatusBadge } from "@/components/ui/Primitives";
import { suClient } from "@/services/su/client";
import { SU_CHANNELS, type SuChannel } from "@/types/channel-manager";
import { ChannelManagerShell } from "../ChannelManagerShell";
import { useSuData } from "../../hooks/useSuData";
import { ChannelFilterToolbar, LoadingBlock, ErrorBlock, mapTone } from "../shared";

export function RoomMappingScreen() {
  const { data, loading, error, reload } = useSuData(() => suClient.getRoomMappings());
  const [channel, setChannel] = useState<SuChannel | "All">("All");
  const [syncing, setSyncing] = useState(false);

  const stats = useMemo(() => {
    if (!data) return { mapped: 0, mismatch: 0, unmapped: 0 };
    let mapped = 0;
    let mismatch = 0;
    let unmapped = 0;
    for (const row of data) {
      for (const ch of SU_CHANNELS) {
        const s = row.channels[ch].status;
        if (s === "Mapped") mapped++;
        else if (s === "Mismatch") mismatch++;
        else unmapped++;
      }
    }
    return { mapped, mismatch, unmapped };
  }, [data]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await suClient.triggerSync({ types: ["Content"] });
      reload();
    } finally {
      setSyncing(false);
    }
  };

  return (
    <ChannelManagerShell
      title="Room Mapping"
      description="Map PMS room types to OTA room codes across all distribution channels."
      actions={
        <Button size="sm">
          <Link2 className="h-3.5 w-3.5" />
          Auto-map
        </Button>
      }
    >
      {loading && <LoadingBlock />}
      {error && <ErrorBlock message={error} onRetry={reload} />}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <KpiCard label="Mapped" value={String(stats.mapped)} accent="success" />
            <KpiCard label="Mismatch" value={String(stats.mismatch)} accent="warning" />
            <KpiCard label="Unmapped" value={String(stats.unmapped)} accent="error" />
            <KpiCard label="PMS room types" value={String(data.length)} accent="info" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ChannelFilterToolbar channel={channel} onChannel={setChannel} onSync={handleSync} syncing={syncing} />
            <Button variant="outline" size="sm" onClick={reload}>
              <RefreshCcw className="h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>

          <Card>
            <CardHeader title="Room type mapping grid" hint="PMS ↔ OTA room codes" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-surface-2/40 text-left">
                    <th className="sticky left-0 bg-surface-2/95 px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                      PMS room type
                    </th>
                    {(channel === "All" ? SU_CHANNELS : [channel]).map((ch) => (
                      <th key={ch} className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                        {ch}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.pmsRoomCode} className="border-b border-border-subtle hover:bg-surface-2/30">
                      <td className="sticky left-0 bg-surface px-4 py-3">
                        <p className="font-medium">{row.pmsRoomType}</p>
                        <p className="font-mono text-[11px] text-text-secondary">{row.pmsRoomCode}</p>
                      </td>
                      {(channel === "All" ? SU_CHANNELS : [channel]).map((ch) => {
                        const m = row.channels[ch];
                        return (
                          <td key={ch} className="px-3 py-3">
                            <StatusBadge tone={mapTone(m.status)}>{m.status}</StatusBadge>
                            <p className="mt-1 font-mono text-[11px] text-text-secondary">{m.otaRoomId}</p>
                            <p className="text-[11px] text-text-secondary">{m.otaRoomName}</p>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </ChannelManagerShell>
  );
}

export function RatePlanMappingScreen() {
  const { data, loading, error, reload } = useSuData(() => suClient.getRatePlanMappings());
  const [channel, setChannel] = useState<SuChannel | "All">("All");

  return (
    <ChannelManagerShell
      title="Rate Plan Mapping"
      description="Align PMS rate plans and meal plans with OTA rate plan codes."
      actions={
        <Button size="sm">
          <Link2 className="h-3.5 w-3.5" />
          Map rate plans
        </Button>
      }
    >
      {loading && <LoadingBlock />}
      {error && <ErrorBlock message={error} onRetry={reload} />}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <KpiCard label="PMS rate plans" value={String(data.length)} accent="brand" />
            <KpiCard label="Channels" value={String(SU_CHANNELS.length)} accent="info" />
            <KpiCard label="Pending mappings" value={String(data.flatMap((r) => SU_CHANNELS.filter((c) => r.channels[c].status === "Pending")).length)} accent="warning" />
          </div>

          <ChannelFilterToolbar channel={channel} onChannel={setChannel} />

          <Card>
            <CardHeader title="Rate plan mapping" hint="BAR · Corporate · NRF" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-surface-2/40 text-left">
                    <th className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">PMS rate plan</th>
                    <th className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">Meal plan</th>
                    {(channel === "All" ? SU_CHANNELS : [channel]).map((ch) => (
                      <th key={ch} className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">{ch}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.pmsRatePlan} className="border-b border-border-subtle hover:bg-surface-2/30">
                      <td className="px-4 py-3 font-medium">{row.pmsRatePlan}</td>
                      <td className="px-4 py-3 text-text-secondary">{row.mealPlan}</td>
                      {(channel === "All" ? SU_CHANNELS : [channel]).map((ch) => {
                        const m = row.channels[ch];
                        return (
                          <td key={ch} className="px-3 py-3">
                            <StatusBadge tone={mapTone(m.status)}>{m.status}</StatusBadge>
                            <p className="mt-1 font-mono text-[11px] text-text-secondary">{m.otaRatePlanId}</p>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </ChannelManagerShell>
  );
}
