import { createFileRoute } from "@tanstack/react-router";
import { UsersFeature } from "@/features/settings/components/UsersFeature";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Users & Access — Retrod PMS" }] }),
  component: UsersFeature,
});
