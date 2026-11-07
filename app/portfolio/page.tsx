import type { Metadata } from "next";
import ArchiveHero from "@/components/portfolio/ArchiveHero";
import CategoryPanels from "@/components/portfolio/CategoryPanels";
import ProjectArchive from "@/components/portfolio/ProjectArchive";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected works and creative archive — graphic design, UI/UX design and creative development.",
};

export default function PortfolioPage() {
  return (
    <>
      <ArchiveHero />
      <CategoryPanels />
      <ProjectArchive />
    </>
  );
}
