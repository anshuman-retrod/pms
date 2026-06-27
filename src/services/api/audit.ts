import { fetchApi } from "./core";

export interface AuditLog {
  id: string;
  timestamp: string;
  actor_name: string;
  actor_role_code: string;
  action_type: string;
  target_entity: string;
  target_id: string;
  ip_address?: string;
}

export const auditApi = {
  getAuditLogs: () => {
    return fetchApi<AuditLog[]>("/api/audit-logs/");
  },
};
