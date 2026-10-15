import { createFileRoute } from "@tanstack/react-router";
import { KoreksiApp } from "@/components/koreksi-app";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <KoreksiApp />;
}
