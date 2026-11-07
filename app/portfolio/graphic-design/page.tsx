import type { Metadata } from "next";
import GraphicDesignView from "@/components/categories/GraphicDesignView";

export const metadata: Metadata = {
  title: "Graphic Design",
  description: "Brand identity, logo design, posters, packaging, campaigns and art direction.",
};

export default function Page() {
  return <GraphicDesignView />;
}
