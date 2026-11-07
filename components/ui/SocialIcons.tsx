// Brand glyphs as inline SVG (lucide no longer ships brand icons).
type P = { className?: string };

export const InstagramIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

export const LinkedinIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13v5.43h-4v-4.8c0-1.15-.02-2.62-1.6-2.62-1.6 0-1.85 1.25-1.85 2.54v4.88h-4z" />
  </svg>
);

export const WhatsappIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" strokeLinejoin="round" />
    <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .9c-1-.4-2.4-1.8-2.8-2.8l.9-1-1-2z" fill="currentColor" stroke="none" />
  </svg>
);

export const GithubIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
  </svg>
);

export const PinterestIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 2a10 10 0 0 0-3.64 19.31c-.09-.79-.17-2 .04-2.86.18-.78 1.2-5.08 1.2-5.08s-.31-.61-.31-1.52c0-1.42.83-2.49 1.86-2.49.88 0 1.3.66 1.3 1.45 0 .88-.56 2.2-.85 3.42-.24 1.02.51 1.85 1.52 1.85 1.82 0 3.22-1.92 3.22-4.69 0-2.45-1.76-4.17-4.28-4.17-2.91 0-4.62 2.18-4.62 4.44 0 .88.34 1.82.76 2.34.08.1.1.19.07.3-.08.32-.25 1.02-.28 1.16-.05.19-.15.23-.35.14-1.31-.61-2.13-2.52-2.13-4.06 0-3.31 2.4-6.35 6.93-6.35 3.64 0 6.47 2.59 6.47 6.06 0 3.61-2.28 6.52-5.44 6.52-1.06 0-2.06-.55-2.4-1.2l-.65 2.49c-.24.91-.88 2.05-1.31 2.75A10 10 0 1 0 12 2z" />
  </svg>
);

export const BehanceIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M8.84 10.83c.96-.46 1.54-1.24 1.54-2.38 0-2.08-1.55-3.05-3.79-3.05H1.5v13.2h5.38c2.48 0 4.16-1.19 4.16-3.51 0-1.52-.75-2.66-2.2-3.26zM4.3 7.68h2.02c.98 0 1.62.42 1.62 1.28 0 .88-.62 1.32-1.57 1.32H4.3V7.68zm2.28 8.6H4.3v-3.01h2.33c1.14 0 1.82.48 1.82 1.52 0 1.06-.71 1.49-1.87 1.49zm11.27-9.66h-5.28V5.2h5.28v1.42zm-.23 2.01c-2.99 0-4.88 2.06-4.88 5.04 0 3.12 1.86 5.03 4.98 5.03 2.24 0 3.84-1.01 4.44-3.02h-2.48c-.32.68-1.01 1.06-1.89 1.06-1.42 0-2.32-.84-2.41-2.4h6.92c.06-.34.09-.74.09-1.15 0-2.75-1.78-4.56-4.77-4.56zm-2.18 4.02c.17-1.26.95-2.06 2.18-2.06 1.24 0 2.02.79 2.13 2.06h-4.31z" />
  </svg>
);
