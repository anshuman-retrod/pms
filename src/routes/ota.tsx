import { createFileRoute } from "@tanstack/react-router";
import { OtaFeature } from "@/features/settings/components/OtaFeature";

export const Route = createFileRoute("/ota")({
  head: () => ({ meta: [{ title: "OTA & Channels — Retrod PMS" }] }),
  component: OtaFeature,
});
