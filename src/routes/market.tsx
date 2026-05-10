import { createFileRoute } from "@tanstack/react-router";
import { MarketObservePage } from "@/components/MarketObservePage";

export const Route = createFileRoute("/market")({
  head: () => ({ meta: [{ title: "Market - GX Prism" }] }),
  component: Market,
});

function Market() {
  return <MarketObservePage />;
}
