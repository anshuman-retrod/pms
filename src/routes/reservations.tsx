import { createFileRoute } from "@tanstack/react-router";
import { ReservationsFeature } from "@/features/reservations/components/ReservationsFeature";

export const Route = createFileRoute("/reservations")({
  head: () => ({ meta: [{ title: "Reservations — Retrod PMS" }] }),
  component: ReservationsFeature,
});
