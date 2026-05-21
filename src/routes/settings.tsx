import { createFileRoute } from "@tanstack/react-router";
import { SettingsFeature } from "@/features/settings/components/SettingsFeature";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "System Settings — Retrod PMS" }] }),
  component: SettingsFeature,
});
