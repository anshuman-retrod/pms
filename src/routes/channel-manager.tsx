import { createFileRoute } from "@tanstack/react-router";
import { DashboardScreen } from "@/features/channel-manager/components/screens/DashboardScreen";

export const Route = createFileRoute("/channel-manager")({
  head: () => ({ meta: [{ title: "Channel Manager — Retrod PMS" }] }),
  component: DashboardScreen,
});
