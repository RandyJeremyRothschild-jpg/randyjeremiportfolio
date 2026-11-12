import type { CategorySlug } from "./types";

export interface CategoryInfo {
  slug: CategorySlug;
  index: string;
  title: string;
  shortTitle: string;
  href: string;
  tagline: string;
  /** Short description used on the homepage + portfolio overview. */
  description: string;
  /** Longer intro for the category page. */
  intro: string;
  services: string[];
  /** Small accent used for indicators on this category. */
  accent: string;
}

export const categories: CategoryInfo[] = [
  {
    slug: "graphic-design",
    index: "01",
    title: "Graphic Design",
    shortTitle: "Graphic",
    href: "/portfolio/graphic-design",
    tagline: "Identity, campaigns, posters & art direction.",
    description:
      "Creating visual identities, branding systems, promotional materials, and meaningful visual communication.",
    intro:
      "Visual identities, brand systems and promotional work — designed to communicate clearly and to be remembered.",
    services: [
      "Brand Identity",
      "Logo Design",
      "Social Media Design",
      "Advertising Campaigns",
      "Poster Design",
      "Packaging Design",
      "Art Direction",
    ],
    accent: "#C5F36A",
  },
  {
    slug: "uiux-design",
    index: "02",
    title: "UI/UX Design",
    shortTitle: "UI/UX",
    href: "/portfolio/uiux-design",
    tagline: "Interfaces, products & systems people enjoy using.",
    description:
      "Designing intuitive digital interfaces and user-centered experiences through research, structure, and visual design.",
    intro:
      "Digital products shaped from the user outwards — research, flows and wireframes first, then interfaces with character.",
    services: [
      "Website UI",
      "Mobile Applications",
      "Dashboard Design",
      "User Experience Design",
      "Design Systems",
      "Interactive Prototypes",
    ],
    accent: "#A9BFFF",
  },
  {
    slug: "web-development",
    index: "03",
    title: "Web Development",
    shortTitle: "Web Dev",
    href: "/portfolio/web-development",
    tagline: "Design concepts shipped as living websites.",
    description: "Turning design concepts into functional, responsive, and interactive websites.",
    intro:
      "Websites and interactive experiments built end-to-end — from layout and motion to responsive, working code.",
    services: [
      "Personal Websites",
      "Landing Pages",
      "Interactive Websites",
      "Web Applications",
      "Experimental Digital Experiences",
    ],
    accent: "#C9CDD2",
  },
];

export const getCategory = (slug: CategorySlug) => categories.find((c) => c.slug === slug)!;
