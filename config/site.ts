/**
 * ─────────────────────────────────────────────────────────────
 *  PERSONAL CONFIGURATION — edit everything about "you" here.
 * ─────────────────────────────────────────────────────────────
 * All values below are placeholders. Replace them with your own.
 */
export const site = {
  /** Full name (used in metadata, footer, copyright). */
  name: "Randy Jeremi",
  /** Label shown in the navigation bar. */
  navLabel: "Randy Jeremi's",
  navSuffix: "Portfolio",
  /** Big typographic wordmark shown in the footer + loader. */
  wordmark: "RANDY JEREMI",
  /** Two/three-letter monogram used for the loader + favicon-style marks. */
  monogram: "RJ",
  /** One-line positioning statement. */
  tagline: "Graphic Design / UIUX Design / Creative Development.",
  disciplines: ["Graphic Designer", "UI/UX Designer", "Vibe Coder"],
  location: "Surabaya, Indonesia",
  /** Short availability line shown next to the location. */
  availability: "Available for remote work worldwide",
  /** IANA timezone for the live clock in the footer, e.g. "Europe/Berlin". */
  timezone: "Asia/Jakarta",
  /** Human-friendly timezone label shown next to the clock. */
  timezoneLabel: "WIB · GMT+7",
  /** Set to false to hide the "available for work" badge. */
  availableForWork: true,
  url: "https://randyjeremyrothschild-jpg.github.io/randyjeremi-sportfolio",

  contact: {
    email: "randyg06alone@gmail.com",
    instagram: { label: "@randy_jrmy", href: "https://www.instagram.com/randy_jrmy/" },
    linkedin: { label: "in/randy-jeremi-260296287", href: "https://www.linkedin.com/in/randy-jeremi-260296287/" },
    whatsapp: { label: "Chat on WhatsApp", href: "https://wa.me/message/MDNXI5E2FH5SL1" },
    pinterest: { label: "id.pinterest.com/randy_jrmy", href: "https://id.pinterest.com/randy_jrmy/_created/" },
    behance: { label: "behance.net/randyjeremy", href: "https://www.behance.net/randyjeremy" },
  },

  linkedinDetails: {
    experienceUrl:
      "https://www.linkedin.com/in/randy-jeremi-260296287/details/experience/?isSelfProfile=true&vieweeProfileId=ACoAAEWhiugBDuBE3aq6DChunODnzp8xvmhW80Q",
    educationUrl: "https://www.linkedin.com/in/randy-jeremi-260296287/details/education/",
  },

  experience: [
    {
      role: "Graphic & UI/UX Designer / Creative Developer",
      company: "Freelance & Creative Projects",
      type: "Self-Employed · Remote / On-site",
      period: "Present",
      location: "Surabaya, Indonesia",
      description:
        "Designing visual identities, brand campaigns, UI/UX interfaces, and interactive web experiences.",
    },
  ],

  education: [
    {
      institution: "University / Academic Background",
      degree: "Visual Communication Design / Creative Media & Technology",
      period: "Surabaya, Indonesia",
      description:
        "Focused on graphic design, visual branding, digital product design (UI/UX), and interactive media.",
    },
  ],

  about: {
    intro:
      "I'm a multidisciplinary creative working where visual design, user experience and code overlap. I shape ideas into identities, interfaces and websites — and I like to build the things I design.",
    secondary:
      "My process moves between sketchbook, design tool and code editor. Street culture, editorial typography and experimental web tech are my favourite raw materials.",
  },
} as const;

export const navItems = [
  { label: "Home", href: "/", section: "home" },
  { label: "About", href: "/#about", section: "about" },
  { label: "Portfolio", href: "/portfolio", section: "works" },
  { label: "Contact", href: "/#contact", section: "contact" },
] as const;
