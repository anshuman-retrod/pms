import { createFileRoute } from "@tanstack/react-router";
import { BookingEngineFeature } from "@/features/booking-engine/components/BookingEngineFeature";

export const Route = createFileRoute("/booking-engine")({
  head: () => ({ meta: [{ title: "Booking Engine — Retrod PMS" }] }),
  component: BookingEngineFeature,
});
