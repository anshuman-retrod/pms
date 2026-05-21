import { createFileRoute } from "@tanstack/react-router";
import { StaffFeature } from "@/features/settings/components/StaffFeature";

export const Route = createFileRoute("/staff")({
  head: () => ({ meta: [{ title: "Staff Management — Retrod PMS" }] }),
  component: StaffFeature,
});
