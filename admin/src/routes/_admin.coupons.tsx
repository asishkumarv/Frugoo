import { createFileRoute } from "@tanstack/react-router";
import Coupons from "@/pages/Coupons";

export const Route = createFileRoute("/_admin/coupons")({
  component: Coupons,
});
