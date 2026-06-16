import { createFileRoute } from "@tanstack/react-router";
import HeroVideos from "@/pages/HeroVideos";

export const Route = createFileRoute("/_admin/hero-videos")({
  component: HeroVideos,
});
