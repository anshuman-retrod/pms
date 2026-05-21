import { createFileRoute } from "@tanstack/react-router";
import { RolesFeature } from "@/features/settings/components/RolesFeature";

export const Route = createFileRoute("/roles")({
  head: () => ({ meta: [{ title: "Roles & Privileges — Retrod PMS" }] }),
  component: RolesFeature,
});
