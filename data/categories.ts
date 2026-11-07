import type { CategorySlug } from "./types";

export interface CategoryInfo {
  slug: CategorySlug;
  index: string;
  title: string;
  shortTitle: string;
  href: string;
  tagline: string;
  description: string;
  services: string[];
  /** Accent color used for the category's visual identity. */
  accent: string;
  /** Text color that sits on the accent. */
  onAccent: string;
}

export const categories: CategoryInfo[] = [
  {
    slug: "graphic-design",
    index: "01",
    title: "Graphic Design",
    shortTitle: "Graphic",
    href: "/portfolio/graphic-design",
    tagline: "Identity, posters, packaging & art direction.",
    description:
      "Visual identities, branding, art direction, promotional materials, and digital graphics.",
    services: [
      "Brand Identity",
      "Logo Design",
      "Social Media Design",
      "Advertising Campaigns",
      "Promotional Materials",
      "Packaging Design",
      "Poster Design",
      "Art Direction",
    ],
    accent: "#19FF32",
    onAccent: "#080711",
  },
  {
    slug: "uiux-design",
    index: "02",
    title: "UI/UX Design",
    shortTitle: "UI/UX",
    href: "/portfolio/uiux-design",
    tagline: "Products, interfaces & systems people enjoy using.",
    description:
      "User-centered interfaces, digital products, wireframes, prototypes, and interactive experiences.",
    services: [
      "Website UI Design",
      "Mobile App Design",
      "Dashboard Design",
      "UX Research",
      "Design Systems",
      "Prototyping",
    ],
    accent: "#9B5CFF",
    onAccent: "#F5F3EF",
  },
  {
    slug: "vibe-coding",
    index: "03",
    title: "Website & Creative Development",
    shortTitle: "Vibe Coding",
    href: "/portfolio/vibe-coding",
    tagline: "Ideas shipped as living, breathing websites.",
    description:
      "Transforming creative ideas into functional websites and digital experiences using modern development tools and AI-assisted workflows.",
    services: [
      "Personal Websites",
      "Landing Pages",
      "Interactive Websites",
      "Experimental Web",
      "Creative Coding",
      "Web Applications",
    ],
    accent: "#E8FF2A",
    onAccent: "#080711",
  },
];

export const getCategory = (slug: CategorySlug) =>
  categories.find((c) => c.slug === slug)!;
