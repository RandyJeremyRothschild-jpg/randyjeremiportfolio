/**
 * ─────────────────────────────────────────────────────────────
 *  PERSONAL PROFILE — edit everything about "you" here.
 * ─────────────────────────────────────────────────────────────
 * Used by the navigation, homepage, footer, CV header and metadata.
 * CV entries (experience, education, awards, skills) live in /data/cv.ts.
 */
export const site = {
  /** Full legal name (CV header, metadata). */
  fullName: "Randy Jeremi Tua Putra Lumban Gaol",
  /** Short name used in the wordmark, footer and copyright. */
  name: "Randy Jeremi",
  firstName: "Randy",
  /** Monogram used in the nav mark + loader. */
  monogram: "RJ",

  /** The three disciplines — the only ones used across the site. */
  disciplines: ["Graphic Design", "UI/UX Design", "Web Development"],
  /** Professional title shown on the CV. */
  title: "Graphic Designer / UI/UX Designer / Web Development",
  tagline: "Graphic Design / UI/UX Design / Web Development",

  location: "Surabaya, Indonesia",
  /** IANA timezone for the live clock, e.g. "Europe/Berlin". */
  timezone: "Asia/Jakarta",
  timezoneLabel: "WIB · GMT+7",
  /** Set to false to hide the "available" indicator. */
  availableForWork: true,
  availability: "Open to freelance & collaborations",

  url: "https://randyjeremyrothschild-jpg.github.io/randyjeremi-sportfolio",

  hero: {
    headline: ["Designing with clarity.", "Building with curiosity."],
    intro:
      "I'm Randy, a multidisciplinary creative working across Graphic Design, UI/UX Design, and Web Development.",
  },

  about: {
    headline: "Design is how I think. Technology is how I build.",
    intro:
      "I'm a multidisciplinary creative working across graphic design, digital experiences, and web development. I combine visual thinking, thoughtful user experiences, and technology to turn ideas into meaningful digital products.",
    secondary:
      "My process moves between sketchbook, design tool and code editor — I like to understand a problem visually, structure it for the people who will use it, and then build the thing I designed.",
  },

  contactSection: {
    headline: "Have something in mind?",
    text: "Let's turn interesting ideas into meaningful experiences.",
  },

  /**
   * Contact + social links. Remove a line to hide it everywhere.
   * `primary: true` entries are shown in the main contact list.
   */
  contact: {
    email: "randyg06alone@gmail.com",
    linkedin: { label: "in/randy-jeremi-260296287", href: "https://www.linkedin.com/in/randy-jeremi-260296287/" },
    instagram: { label: "@randy_jrmy", href: "https://www.instagram.com/randy_jrmy/" },
    github: { label: "RandyJeremyRothschild-jpg", href: "https://github.com/RandyJeremyRothschild-jpg" },
    whatsapp: { label: "Chat on WhatsApp", href: "https://wa.me/message/MDNXI5E2FH5SL1" },
    behance: { label: "behance.net/randyjeremy", href: "https://www.behance.net/randyjeremy" },
    pinterest: { label: "pinterest.com/randy_jrmy", href: "https://id.pinterest.com/randy_jrmy/_created/" },
  },
} as const;

/** Global navigation. `key` drives the active indicator. */
export const navItems = [
  { key: "home", label: "Home", href: "/" },
  { key: "work", label: "Work", href: "/portfolio" },
  { key: "about", label: "About", href: "/#about" },
  { key: "cv", label: "CV", href: "/cv" },
  { key: "contact", label: "Contact", href: "/#contact" },
] as const;

export type NavKey = (typeof navItems)[number]["key"];

/** Ordered list of social links for the contact section + footer. */
export const socials = [
  { key: "email", name: "Email", label: site.contact.email, href: `mailto:${site.contact.email}`, primary: true },
  { key: "linkedin", name: "LinkedIn", ...site.contact.linkedin, primary: true },
  { key: "instagram", name: "Instagram", ...site.contact.instagram, primary: true },
  { key: "github", name: "GitHub", ...site.contact.github, primary: true },
  { key: "whatsapp", name: "WhatsApp", ...site.contact.whatsapp, primary: true },
  { key: "behance", name: "Behance", ...site.contact.behance, primary: false },
  { key: "pinterest", name: "Pinterest", ...site.contact.pinterest, primary: false },
] as const;
