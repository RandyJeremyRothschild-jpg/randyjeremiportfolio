import type { Metadata } from "next";
import UiuxView from "@/components/categories/UiuxView";

export const metadata: Metadata = {
  title: "UI/UX Design",
  description: "Website UI, mobile apps, dashboards, design systems and prototypes.",
};

export default function Page() {
  return <UiuxView />;
}
