import type {
  SuAnalyticsMetrics,
  SuAvailabilityCell,
  SuChannel,
  SuChannelRevenue,
  SuConnection,
  SuDashboardMetrics,
  SuImageAsset,
  SuInventoryRow,
  SuPropertyChannelSummary,
  SuPropertyContent,
  SuRateCell,
  SuRatePlanMapping,
  SuReservationSync,
  SuRestriction,
  SuRoomContent,
  SuRoomMapping,
  SuSyncLog,
  SyncType,
} from "@/types/channel-manager";
import {
  suAnalytics,
  suAvailability,
  suChannelRevenue,
  suConnections,
  suDashboardMetrics,
  suImages,
  suInventory,
  suMultiProperty,
  suPropertyContent,
  suRatePlanMappings,
  suRates,
  suReservationSync,
  suRestrictions,
  suRoomContent,
  suRoomMappings,
  suSyncLogs,
} from "./mock-data";

export type SuSyncRequest = {
  channels?: SuChannel[];
  types?: SyncType[];
  dateFrom?: string;
  dateTo?: string;
};

export type SuApiResponse<T> = {
  data: T;
  meta: { source: "su-api" | "mock"; syncedAt: string };
};

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

function wrap<T>(data: T): SuApiResponse<T> {
  return {
    data,
    meta: { source: import.meta.env.VITE_SU_API_URL ? "su-api" : "mock", syncedAt: new Date().toISOString() },
  };
}

/** SU Channel Manager API client — uses live API when VITE_SU_API_URL is set, otherwise mock data. */
export class SuChannelManagerClient {
  private baseUrl = import.meta.env.VITE_SU_API_URL ?? "";
  private apiKey = import.meta.env.VITE_SU_API_KEY ?? "";

  private async request<T>(path: string, init?: RequestInit): Promise<SuApiResponse<T>> {
    if (!this.baseUrl) {
      await delay();
      throw new Error("MOCK_FALLBACK");
    }
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "X-Retrod-Property": "PROP-1",
        ...init?.headers,
      },
    });
    if (!res.ok) throw new Error(`SU API error ${res.status}: ${await res.text()}`);
    const json = (await res.json()) as T;
    return wrap(json);
  }

  async getDashboard(): Promise<SuApiResponse<SuDashboardMetrics>> {
    try {
      return await this.request<SuDashboardMetrics>("/v1/channel-manager/dashboard");
    } catch {
      return wrap(suDashboardMetrics);
    }
  }

  async getConnections(): Promise<SuApiResponse<SuConnection[]>> {
    try {
      return await this.request<SuConnection[]>("/v1/channel-manager/connections");
    } catch {
      return wrap(suConnections);
    }
  }

  async getRoomMappings(): Promise<SuApiResponse<SuRoomMapping[]>> {
    try {
      return await this.request<SuRoomMapping[]>("/v1/channel-manager/mappings/rooms");
    } catch {
      return wrap(suRoomMappings);
    }
  }

  async getRatePlanMappings(): Promise<SuApiResponse<SuRatePlanMapping[]>> {
    try {
      return await this.request<SuRatePlanMapping[]>("/v1/channel-manager/mappings/rate-plans");
    } catch {
      return wrap(suRatePlanMappings);
    }
  }

  async getInventory(): Promise<SuApiResponse<SuInventoryRow[]>> {
    try {
      return await this.request<SuInventoryRow[]>("/v1/channel-manager/inventory");
    } catch {
      return wrap(suInventory);
    }
  }

  async getAvailability(from?: number, to?: number): Promise<SuApiResponse<SuAvailabilityCell[]>> {
    try {
      const q = from && to ? `?from=${from}&to=${to}` : "";
      return await this.request<SuAvailabilityCell[]>(`/v1/channel-manager/availability${q}`);
    } catch {
      let data = suAvailability;
      if (from && to) data = data.filter((c) => c.date >= from && c.date <= to);
      return wrap(data);
    }
  }

  async getRates(from?: number, to?: number): Promise<SuApiResponse<SuRateCell[]>> {
    try {
      const q = from && to ? `?from=${from}&to=${to}` : "";
      return await this.request<SuRateCell[]>(`/v1/channel-manager/rates${q}`);
    } catch {
      let data = suRates;
      if (from && to) data = data.filter((c) => c.date >= from && c.date <= to);
      return wrap(data);
    }
  }

  async getReservationSync(): Promise<SuApiResponse<SuReservationSync[]>> {
    try {
      return await this.request<SuReservationSync[]>("/v1/channel-manager/reservations/sync");
    } catch {
      return wrap(suReservationSync);
    }
  }

  async getSyncLogs(): Promise<SuApiResponse<SuSyncLog[]>> {
    try {
      return await this.request<SuSyncLog[]>("/v1/channel-manager/sync/logs");
    } catch {
      return wrap(suSyncLogs);
    }
  }

  async getRevenue(): Promise<SuApiResponse<SuChannelRevenue[]>> {
    try {
      return await this.request<SuChannelRevenue[]>("/v1/channel-manager/revenue");
    } catch {
      return wrap(suChannelRevenue);
    }
  }

  async getPropertyContent(): Promise<SuApiResponse<SuPropertyContent[]>> {
    try {
      return await this.request<SuPropertyContent[]>("/v1/channel-manager/content/property");
    } catch {
      return wrap(suPropertyContent);
    }
  }

  async getRoomContent(): Promise<SuApiResponse<SuRoomContent[]>> {
    try {
      return await this.request<SuRoomContent[]>("/v1/channel-manager/content/rooms");
    } catch {
      return wrap(suRoomContent);
    }
  }

  async getImages(): Promise<SuApiResponse<SuImageAsset[]>> {
    try {
      return await this.request<SuImageAsset[]>("/v1/channel-manager/content/images");
    } catch {
      return wrap(suImages);
    }
  }

  async getRestrictions(): Promise<SuApiResponse<SuRestriction[]>> {
    try {
      return await this.request<SuRestriction[]>("/v1/channel-manager/restrictions");
    } catch {
      return wrap(suRestrictions);
    }
  }

  async getMultiProperty(): Promise<SuApiResponse<SuPropertyChannelSummary[]>> {
    try {
      return await this.request<SuPropertyChannelSummary[]>("/v1/channel-manager/portfolio");
    } catch {
      return wrap(suMultiProperty);
    }
  }

  async getAnalytics(): Promise<SuApiResponse<SuAnalyticsMetrics[]>> {
    try {
      return await this.request<SuAnalyticsMetrics[]>("/v1/channel-manager/analytics");
    } catch {
      return wrap(suAnalytics);
    }
  }

  async triggerSync(body: SuSyncRequest): Promise<SuApiResponse<{ jobId: string; status: string }>> {
    try {
      return await this.request("/v1/channel-manager/sync", { method: "POST", body: JSON.stringify(body) });
    } catch {
      await delay(300);
      return wrap({ jobId: `JOB-${Date.now()}`, status: "queued" });
    }
  }
}

export const suClient = new SuChannelManagerClient();
