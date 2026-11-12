import type { Metadata } from "next";
import CvView from "@/components/cv/CvView";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "CV",
  description: `Curriculum vitae of ${site.fullName} — ${site.title}. Experience, education, honors and skills.`,
};

export default function Page() {
  return <CvView />;
}
