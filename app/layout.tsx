import type { Metadata, Viewport } from "next";
import { Geist, IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Cursor from "@/components/layout/Cursor";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/layout/Loader";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const plex = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-plex", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Graphic Design, UI/UX Design & Web Development`,
    template: `%s — ${site.name}`,
  },
  description: `Portfolio of ${site.fullName}. ${site.about.intro}`,
  openGraph: {
    title: `${site.name} — Portfolio`,
    description: site.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F6F3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = [space, geist, inter, plex].map((f) => f.variable).join(" ");
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[500] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <noscript>
          <style>{`[data-loader]{display:none!important}[data-motion]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <Loader />
        <SmoothScroll />
        <Cursor />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
