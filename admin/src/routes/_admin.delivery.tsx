import { createFileRoute } from "@tanstack/react-router";
import Delivery from "@/pages/Delivery";

export const Route = createFileRoute("/_admin/delivery")({
  component: Delivery,
});
