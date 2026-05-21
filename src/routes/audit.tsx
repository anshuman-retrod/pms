import { createFileRoute } from "@tanstack/react-router";
import { AuditFeature } from "@/features/settings/components/AuditFeature";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit Logs — Retrod PMS" }] }),
  component: AuditFeature,
});
