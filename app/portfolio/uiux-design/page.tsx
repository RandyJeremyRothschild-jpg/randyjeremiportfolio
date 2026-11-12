import type { Metadata } from "next";
import UiuxView from "@/components/categories/UiuxView";

export const metadata: Metadata = {
  title: "UI/UX Design",
  description: "Website UI, mobile applications, dashboards, user experience design, design systems and interactive prototypes.",
};

export default function Page() {
  return <UiuxView />;
}
