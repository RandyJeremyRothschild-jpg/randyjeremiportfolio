import type { Metadata } from "next";
import WebDevelopmentView from "@/components/categories/WebDevelopmentView";

export const metadata: Metadata = {
  title: "Web Development",
  description: "Personal websites, landing pages, interactive websites, web applications and experimental digital experiences.",
};

export default function Page() {
  return <WebDevelopmentView />;
}
