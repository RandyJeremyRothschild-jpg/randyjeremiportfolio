import type { Metadata, Viewport } from "next";
import {
  Archivo_Black,
  Bebas_Neue,
  Inter,
  JetBrains_Mono,
  Rubik_Wet_Paint,
  Sedgwick_Ave_Display,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Cursor from "@/components/layout/Cursor";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/layout/Loader";

const archivo = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sedgwick = Sedgwick_Ave_Display({ weight: "400", subsets: ["latin"], variable: "--font-sedgwick", display: "swap" });
const wetpaint = Rubik_Wet_Paint({ weight: "400", subsets: ["latin"], variable: "--font-wetpaint", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-jb", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Graphic Designer, UI/UX Designer & Creative Developer`,
    template: `%s — ${site.name}`,
  },
  description: `Portfolio of ${site.name}: ${site.tagline}`,
  openGraph: {
    title: `${site.name} — Creative Portfolio`,
    description: site.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080711",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = [archivo, bebas, space, inter, sedgwick, wetpaint, mono].map((f) => f.variable).join(" ");
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <body className="grain min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-acid focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <noscript>
          <style>{`[data-loader]{display:none!important}`}</style>
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
