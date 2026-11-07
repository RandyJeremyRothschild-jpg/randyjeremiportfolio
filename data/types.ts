export type CategorySlug = "graphic-design" | "uiux-design" | "vibe-coding";

export interface ProjectLinks {
  /** Live website (or self-hosted demo under /public/demos). */
  live?: string;
  github?: string;
  /** Behance, Dribbble, case-study PDF… */
  external?: { label: string; href: string }[];
}

export interface GraphicDetails {
  kind: "graphic-design";
  overview: string;
  objectives: string[];
  process: string[];
  outcomes: string[];
}

export interface UiuxDetails {
  kind: "uiux-design";
  overview: string;
  problem: string;
  objectives: string[];
  research: string[];
  /** Ordered steps rendered as a user-flow diagram. */
  userFlow: string[];
  /** Image paths of wireframes. */
  wireframes: string[];
  /** Image paths of final UI screens. */
  screens: string[];
  /** Device used for mockups. */
  device: "phone" | "desktop";
  /** Optional Figma / prototype link. */
  prototypeUrl?: string;
  results: string[];
}

export interface VibeDetails {
  kind: "vibe-coding";
  overview: string;
  concept: string;
  features: string[];
  technologies: string[];
}

export type ProjectDetails = GraphicDetails | UiuxDetails | VibeDetails;

export interface Project {
  id: string;
  title: string;
  category: CategorySlug;
  /** Sub-type shown as a label, e.g. "Brand Identity". */
  type: string;
  year: number;
  /** Who it was for. Use "Personal project" / "Concept" if not client work. */
  client: string;
  role: string;
  thumbnail: string;
  /** Approximate aspect ratio of the thumbnail (w / h) — used by layouts. */
  ratio: number;
  gallery: string[];
  description: string;
  tools: string[];
  links?: ProjectLinks;
  featured?: boolean;
  details: ProjectDetails;
}
