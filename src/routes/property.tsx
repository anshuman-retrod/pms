import { createFileRoute } from "@tanstack/react-router";
import { PropertyFeature } from "@/features/settings/components/PropertyFeature";

export const Route = createFileRoute("/property")({
  head: () => ({ meta: [{ title: "Property Configuration — Retrod PMS" }] }),
  component: PropertyFeature,
});
