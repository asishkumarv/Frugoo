import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/pages/Index";

export const Route = createFileRoute("/_admin/")({
  component: Dashboard,
});
