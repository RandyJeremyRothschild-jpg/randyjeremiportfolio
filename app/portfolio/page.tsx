import type { Metadata } from "next";
import PortfolioOverview from "@/components/portfolio/PortfolioOverview";

export const metadata: Metadata = {
  title: "Work",
  description: "An archive of ideas and executions — graphic design, UI/UX design and web development.",
};

export default function PortfolioPage() {
  return <PortfolioOverview />;
}
