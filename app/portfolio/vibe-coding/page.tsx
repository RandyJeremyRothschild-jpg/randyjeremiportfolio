import type { Metadata } from "next";
import LegacyRedirect from "@/components/layout/LegacyRedirect";

export const metadata: Metadata = {
  title: "Web Development",
  robots: { index: false },
};

/** Old route kept so existing links still work: forwards to /portfolio/web-development. */
export default function Page() {
  return <LegacyRedirect to="/portfolio/web-development" label="Web Development" />;
}
