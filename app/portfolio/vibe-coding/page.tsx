import type { Metadata } from "next";
import VibeCodingView from "@/components/categories/VibeCodingView";

export const metadata: Metadata = {
  title: "Vibe Coding — Creative Development",
  description: "Websites, landing pages, interactive experiences and creative coding projects.",
};

export default function Page() {
  return <VibeCodingView />;
}
