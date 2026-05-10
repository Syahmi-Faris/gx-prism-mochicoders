import { createFileRoute } from "@tanstack/react-router";
import { MarketObservePage } from "@/components/MarketObservePage";

export const Route = createFileRoute("/rewards/market-observe")({
  head: () => ({ meta: [{ title: "Market Observe - GX Prism" }] }),
  component: MarketObserve,
});

function MarketObserve() {
  return <MarketObservePage showBackToRewards />;
}
