// Generates SVG placeholder artwork for every project in /public/images/projects.
// Run: npm run placeholders
// Replace any generated file with your real images (jpg/png/webp/svg) and update
// the paths in data/projects.ts.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("public/images/projects");
const C = {
  ink: "#17191C",
  plum: "#22262B",
  plum2: "#2E3338",
  acid: "#C5F36A",
  bone: "#F5F6F3",
  violet: "#A9BFFF",
  lemon: "#E6EAE0",
  pink: "#C9CDD2",
  cyan: "#8FA6F0",
  orange: "#A9BFFF",
  chrome: "#C9CDD2",
};
const DISPLAY = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const SANS = "'Helvetica Neue', Arial, sans-serif";
const MONO = "Consolas, 'Courier New', monospace";

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

const defs = (id) => `<defs>
<filter id="grain${id}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0"/></filter>
<pattern id="dots${id}" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.4" fill="rgba(0,0,0,.35)"/></pattern>
</defs>`;
const grain = (id, w, h) => `<rect width="${w}" height="${h}" filter="url(#grain${id})"/>`;

/** Technical ring / crosshair mark (decorative). */
function splat(r, cx, cy, size, color) {
  const R = size * (1.4 + r() * 0.8);
  let s = `<g fill="none" stroke="${color}" stroke-width="${Math.max(2, size * 0.06).toFixed(1)}">`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R.toFixed(1)}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${(R * 0.55).toFixed(1)}" stroke-dasharray="4 8"/>`;
  s += `<line x1="${cx - R * 1.3}" y1="${cy}" x2="${cx + R * 1.3}" y2="${cy}"/>`;
  s += `<line x1="${cx}" y1="${cy - R * 1.3}" x2="${cx}" y2="${cy + R * 1.3}"/>`;
  return s + `</g><circle cx="${cx}" cy="${cy}" r="${(size * 0.22).toFixed(1)}" fill="${color}"/>`;
}

// ───────────────────────── Graphic design ─────────────────────────
function poster({ w = 900, h = 1200, seed, title, sub, bg, fg, accent, id }) {
  const r = rng(seed);
  let b = defs(id) + `<rect width="${w}" height="${h}" fill="${bg}"/>`;
  b += `<circle cx="${w * (0.3 + r() * 0.4)}" cy="${h * (0.3 + r() * 0.2)}" r="${w * (0.28 + r() * 0.12)}" fill="${accent}"/>`;
  b += `<rect x="${w * 0.1}" y="${h * 0.32}" width="${w * 0.8}" height="${h * 0.3}" fill="url(#dots${id})" transform="rotate(${-8 + r() * 16} ${w / 2} ${h / 2})"/>`;
  b += `<rect x="${-w * 0.1}" y="${h * 0.55}" width="${w * 1.2}" height="${h * 0.09}" fill="${fg}" transform="rotate(${-6 + r() * 4} ${w / 2} ${h * 0.6})"/>`;
  b += splat(r, w * (0.15 + r() * 0.7), h * (0.15 + r() * 0.2), w * 0.06, pick(r, [C.pink, C.lemon, C.cyan, C.violet]));
  b += splat(r, w * (0.2 + r() * 0.6), h * 0.72, w * 0.05, accent);
  const words = title.toUpperCase().split(" ");
  const fs1 = Math.min(w / (Math.max(...words.map((x) => x.length)) * 0.74), 200);
  words.forEach((word, i) => {
    b += `<text x="${w * 0.07}" y="${h * 0.78 + i * fs1 * 0.92 - (words.length - 1) * fs1 * 0.5}" font-family="${DISPLAY}" font-size="${fs1}" fill="${fg}" letter-spacing="-6" font-weight="500">${esc(word)}</text>`;
  });
  b += `<text x="${w * 0.07}" y="${h * 0.08}" font-family="${MONO}" font-size="22" fill="${fg}">${esc(sub.toUpperCase())}</text>`;
  b += `<text x="${w * 0.93}" y="${h * 0.08}" text-anchor="end" font-family="${MONO}" font-size="22" fill="${fg}">№ ${String(seed % 100).padStart(3, "0")}</text>`;
  b += `<text x="${w * 0.07}" y="${h * 0.96}" font-family="${MONO}" font-size="18" fill="${fg}" opacity=".7">PLACEHOLDER ARTWORK — REPLACE IN /public/images/projects</text>`;
  b += grain(id, w, h);
  return svg(w, h, b);
}

function logoSheet({ w = 1200, h = 900, seed, mark, name, bg, fg, accent, id }) {
  const r = rng(seed);
  let b = defs(id) + `<rect width="${w}" height="${h}" fill="${bg}"/>`;
  for (let x = 0; x <= w; x += 60) b += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${fg}" stroke-opacity=".07"/>`;
  for (let y = 0; y <= h; y += 60) b += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${fg}" stroke-opacity=".07"/>`;
  const cx = w / 2, cy = h * 0.43, R = h * 0.22;
  b += `<circle cx="${cx}" cy="${cy}" r="${R * 1.35}" fill="none" stroke="${fg}" stroke-opacity=".25" stroke-dasharray="6 8"/>`;
  b += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${accent}"/>`;
  const v = Math.floor(r() * 3);
  if (v === 0) b += `<rect x="${cx - R * 0.25}" y="${cy - R * 1.05}" width="${R * 0.5}" height="${R * 2.1}" fill="${bg}" transform="rotate(35 ${cx} ${cy})"/>`;
  if (v === 1) b += `<path d="M ${cx - R * 0.6} ${cy + R * 0.5} L ${cx} ${cy - R * 0.7} L ${cx + R * 0.6} ${cy + R * 0.5} Z" fill="${bg}"/>`;
  if (v === 2) b += `<rect x="${cx - R * 0.5}" y="${cy - R * 0.5}" width="${R}" height="${R}" rx="${R * 0.25}" fill="${bg}" transform="rotate(45 ${cx} ${cy})"/>`;
  b += `<text x="${cx}" y="${cy + R * 0.22}" text-anchor="middle" font-family="${DISPLAY}" font-size="${R * 0.62}" fill="${accent}">${esc(mark)}</text>`;
  b += `<text x="${cx}" y="${h * 0.83}" text-anchor="middle" font-family="${DISPLAY}" font-size="${h * 0.1}" fill="${fg}" letter-spacing="4">${esc(name.toUpperCase())}</text>`;
  b += `<text x="40" y="50" font-family="${MONO}" font-size="18" fill="${fg}" opacity=".6">LOGO CONSTRUCTION / GRID 60PX</text>`;
  b += grain(id, w, h);
  return svg(w, h, b);
}

function patternSheet({ w = 1200, h = 1200, seed, bg, colors, id, label }) {
  const r = rng(seed);
  let b = defs(id) + `<rect width="${w}" height="${h}" fill="${bg}"/>`;
  const n = 6, s = w / n;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const x = i * s, y = j * s, c = pick(r, colors), t = Math.floor(r() * 5);
      if (t === 0) b += `<circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s * 0.42}" fill="${c}"/>`;
      if (t === 1) b += `<path d="M${x} ${y + s} A ${s} ${s} 0 0 1 ${x + s} ${y}" fill="none" stroke="${c}" stroke-width="${s * 0.22}"/>`;
      if (t === 2) b += `<rect x="${x + s * 0.1}" y="${y + s * 0.1}" width="${s * 0.8}" height="${s * 0.8}" fill="${c}" transform="rotate(${r() * 30} ${x + s / 2} ${y + s / 2})"/>`;
      if (t === 3) b += `<path d="M${x} ${y} L${x + s} ${y} L${x} ${y + s} Z" fill="${c}"/>`;
      if (t === 4) b += `<text x="${x + s / 2}" y="${y + s * 0.78}" text-anchor="middle" font-family="${DISPLAY}" font-size="${s * 0.8}" fill="${c}">${esc(pick(r, ["*", "&", "+", "!", "@", "#"]))}</text>`;
    }
  if (label) b += `<rect x="40" y="${h - 110}" width="${label.length * 30 + 60}" height="70" fill="${C.ink}"/><text x="70" y="${h - 62}" font-family="${DISPLAY}" font-size="40" fill="${C.bone}">${esc(label.toUpperCase())}</text>`;
  b += grain(id, w, h);
  return svg(w, h, b);
}

function socialGrid({ w = 1080, h = 1350, seed, title, bg, accent, id }) {
  const r = rng(seed);
  let b = defs(id) + `<rect width="${w}" height="${h}" fill="${bg}"/>`;
  const pad = 30, cw = (w - pad * 4) / 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 4; j++) {
      const x = pad + i * (cw + pad), y = pad + j * (cw + pad);
      const c = pick(r, [accent, C.bone, C.violet, C.ink, C.lemon]);
      b += `<rect x="${x}" y="${y}" width="${cw}" height="${cw}" fill="${c}"/>`;
      const fg = c === C.ink || c === C.violet ? C.bone : C.ink;
      if (r() > 0.5) b += `<text x="${x + 18}" y="${y + cw - 22}" font-family="${DISPLAY}" font-size="${cw * 0.24}" fill="${fg}">${esc(pick(r, ["DROP", "NEW", "01", "SALE", "RAW", "LIVE", "VOL.2"]))}</text>`;
      else b += `<circle cx="${x + cw / 2}" cy="${y + cw / 2}" r="${cw * 0.3}" fill="none" stroke="${fg}" stroke-width="10"/>`;
    }
  b += `<text x="${w / 2}" y="${h - 40}" text-anchor="middle" font-family="${DISPLAY}" font-size="58" fill="${accent}">${esc(title.toUpperCase())}</text>`;
  b += grain(id, w, h);
  return svg(w, h, b);
}

function packaging({ w = 1200, h = 900, seed, name, bg, colors, id }) {
  const r = rng(seed);
  let b = defs(id) + `<rect width="${w}" height="${h}" fill="${bg}"/>`;
  b += `<ellipse cx="${w / 2}" cy="${h * 0.86}" rx="${w * 0.38}" ry="30" fill="#000" opacity=".35"/>`;
  colors.forEach((c, i) => {
    const x = w * 0.2 + i * w * 0.22, cw = w * 0.16, top = h * 0.2 + (i % 2) * 30;
    b += `<rect x="${x}" y="${top}" width="${cw}" height="${h * 0.62}" rx="22" fill="${c}"/>`;
    b += `<rect x="${x}" y="${top}" width="${cw}" height="26" rx="10" fill="${C.chrome}"/>`;
    b += `<rect x="${x + cw * 0.12}" y="${top + 26}" width="${cw * 0.12}" height="${h * 0.58}" fill="#fff" opacity=".25"/>`;
    b += `<text transform="translate(${x + cw * 0.68} ${top + h * 0.5}) rotate(-90)" text-anchor="middle" font-family="${DISPLAY}" font-size="${cw * 0.42}" fill="${C.ink}">${esc(name.toUpperCase())}</text>`;
    b += splat(r, x + cw / 2, top + h * 0.15, cw * 0.12, C.ink);
  });
  b += grain(id, w, h);
  return svg(w, h, b);
}

// ───────────────────────── UI / UX ─────────────────────────
function phone({ w = 390, h = 844, seed, title, accent, dark = true, id, variant = 0 }) {
  const r = rng(seed);
  const bg = dark ? C.ink : C.bone, fg = dark ? C.bone : C.ink, card = dark ? "#22262B" : "#ffffff";
  let b = defs(id) + `<rect width="${w}" height="${h}" fill="${bg}"/>`;
  b += `<text x="24" y="34" font-family="${SANS}" font-size="15" font-weight="700" fill="${fg}">9:41</text>`;
  b += `<rect x="${w - 64}" y="22" width="36" height="14" rx="4" fill="none" stroke="${fg}"/>`;
  b += `<text x="24" y="104" font-family="${DISPLAY}" font-size="40" fill="${fg}">${esc(title.toUpperCase())}</text>`;
  b += `<text x="24" y="132" font-family="${SANS}" font-size="15" fill="${fg}" opacity=".6">Good evening — here's today</text>`;
  if (variant === 0) {
    b += `<rect x="24" y="156" width="${w - 48}" height="190" rx="26" fill="${accent}"/>`;
    b += `<text x="46" y="208" font-family="${SANS}" font-size="16" fill="${C.ink}" font-weight="700">NEXT DEPARTURE</text>`;
    b += `<text x="46" y="290" font-family="${DISPLAY}" font-size="78" fill="${C.ink}">07:42</text>`;
    b += `<text x="46" y="324" font-family="${SANS}" font-size="15" fill="${C.ink}">Line 4 · Platform B · 3 min walk</text>`;
  } else {
    let pts = "";
    for (let i = 0; i <= 10; i++) pts += `${24 + i * ((w - 48) / 10)},${330 - r() * 140} `;
    b += `<rect x="24" y="156" width="${w - 48}" height="190" rx="26" fill="${card}"/>`;
    b += `<polyline points="${pts}" fill="none" stroke="${accent}" stroke-width="4" stroke-linejoin="round"/>`;
    b += `<text x="46" y="196" font-family="${SANS}" font-size="15" fill="${fg}" opacity=".7">Weekly streak</text>`;
  }
  for (let i = 0; i < 4; i++) {
    const y = 370 + i * 92;
    b += `<rect x="24" y="${y}" width="${w - 48}" height="78" rx="20" fill="${card}"/>`;
    b += `<circle cx="64" cy="${y + 39}" r="20" fill="${pick(r, [accent, C.violet, C.lemon, C.pink])}"/>`;
    b += `<rect x="98" y="${y + 24}" width="${120 + r() * 80}" height="12" rx="6" fill="${fg}" opacity=".85"/>`;
    b += `<rect x="98" y="${y + 46}" width="${70 + r() * 60}" height="10" rx="5" fill="${fg}" opacity=".35"/>`;
  }
  b += `<rect x="16" y="${h - 92}" width="${w - 32}" height="70" rx="35" fill="${card}"/>`;
  for (let i = 0; i < 4; i++) b += `<circle cx="${70 + i * ((w - 140) / 3)}" cy="${h - 57}" r="${i === 0 ? 14 : 10}" fill="${i === 0 ? accent : fg}" opacity="${i === 0 ? 1 : 0.4}"/>`;
  return svg(w, h, b);
}

function desktop({ w = 1440, h = 900, seed, title, accent, id, kind = "dashboard" }) {
  const r = rng(seed);
  let b = defs(id) + `<rect width="${w}" height="${h}" fill="${C.ink}"/>`;
  if (kind === "dashboard") {
    b += `<rect width="240" height="${h}" fill="#1E2126"/>`;
    b += `<text x="32" y="58" font-family="${DISPLAY}" font-size="30" fill="${accent}">${esc(title.toUpperCase())}</text>`;
    for (let i = 0; i < 7; i++) b += `<rect x="32" y="${110 + i * 48}" width="${120 + r() * 50}" height="14" rx="7" fill="${C.bone}" opacity="${i === 1 ? 0.95 : 0.3}"/>`;
    for (let i = 0; i < 4; i++) {
      const x = 280 + i * 284;
      b += `<rect x="${x}" y="40" width="264" height="140" rx="20" fill="#22262B"/>`;
      b += `<text x="${x + 24}" y="86" font-family="${SANS}" font-size="16" fill="${C.bone}" opacity=".6">Metric ${i + 1}</text>`;
      b += `<text x="${x + 24}" y="148" font-family="${DISPLAY}" font-size="48" fill="${i === 0 ? accent : C.bone}">${Math.floor(r() * 900 + 100)}</text>`;
    }
    b += `<rect x="280" y="210" width="740" height="420" rx="24" fill="#22262B"/>`;
    for (let i = 0; i < 14; i++) {
      const bh = 60 + r() * 280;
      b += `<rect x="${316 + i * 50}" y="${600 - bh}" width="30" height="${bh}" rx="8" fill="${i % 4 === 0 ? accent : C.violet}" opacity="${i % 4 === 0 ? 1 : 0.6}"/>`;
    }
    b += `<rect x="1050" y="210" width="350" height="640" rx="24" fill="#22262B"/>`;
    for (let i = 0; i < 7; i++) {
      b += `<circle cx="1094" cy="${270 + i * 80}" r="20" fill="${pick(r, [accent, C.violet, C.lemon, C.pink])}"/>`;
      b += `<rect x="1128" y="${262 + i * 80}" width="${140 + r() * 80}" height="14" rx="7" fill="${C.bone}" opacity=".6"/>`;
    }
    b += `<rect x="280" y="660" width="740" height="190" rx="24" fill="${accent}"/>`;
    b += `<text x="316" y="770" font-family="${DISPLAY}" font-size="64" fill="${C.ink}">Keep creating.</text>`;
  } else {
    b += `<rect width="${w}" height="${h}" fill="${kind === "light" ? C.bone : C.ink}"/>`;
    const fg = kind === "light" ? C.ink : C.bone;
    b += `<text x="60" y="70" font-family="${DISPLAY}" font-size="28" fill="${fg}">${esc(title.toUpperCase())}</text>`;
    for (let i = 0; i < 4; i++) b += `<rect x="${860 + i * 120}" y="56" width="80" height="12" rx="6" fill="${fg}" opacity=".5"/>`;
    b += `<text x="60" y="330" font-family="${DISPLAY}" font-size="170" fill="${fg}" letter-spacing="-8">${esc(pick(r, ["Make it", "Art in", "The new"]))}</text>`;
    b += `<text x="60" y="510" font-family="${DISPLAY}" font-size="170" fill="${accent}" letter-spacing="-8">${esc(pick(r, ["clear.", "motion", "wave."]))}</text>`;
    b += `<rect x="60" y="580" width="220" height="64" rx="32" fill="${accent}"/>`;
    b += `<text x="170" y="620" text-anchor="middle" font-family="${SANS}" font-weight="700" font-size="18" fill="${C.ink}">GET STARTED →</text>`;
    for (let i = 0; i < 3; i++) b += `<rect x="${60 + i * 450}" y="690" width="420" height="260" rx="18" fill="${pick(r, [C.violet, C.plum2, C.lemon, C.pink])}"/>`;
    b += splat(r, 1180, 260, 70, C.violet);
  }
  return svg(w, h, b);
}

function wireframe({ w = 1440, h = 900, seed, id, mobile = false }) {
  const r = rng(seed);
  const W = mobile ? 390 : w, H = mobile ? 844 : h;
  let b = `<rect width="${W}" height="${H}" fill="#EDEBE6"/>`;
  const box = (x, y, bw, bh) =>
    `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="none" stroke="#1a1a1a" stroke-width="2"/><line x1="${x}" y1="${y}" x2="${x + bw}" y2="${y + bh}" stroke="#1a1a1a" stroke-opacity=".3"/><line x1="${x + bw}" y1="${y}" x2="${x}" y2="${y + bh}" stroke="#1a1a1a" stroke-opacity=".3"/>`;
  const line = (x, y, lw) => `<rect x="${x}" y="${y}" width="${lw}" height="10" fill="#1a1a1a" opacity=".55"/>`;
  if (mobile) {
    b += line(24, 60, 160) + box(24, 100, 342, 200);
    for (let i = 0; i < 4; i++) b += box(24, 330 + i * 100, 80, 80) + line(120, 350 + i * 100, 150 + r() * 60) + line(120, 375 + i * 100, 90);
    b += `<rect x="24" y="${H - 90}" width="342" height="56" fill="none" stroke="#1a1a1a" stroke-width="2"/>`;
  } else {
    b += line(60, 50, 140) + line(1000, 50, 380);
    b += line(60, 180, 600) + line(60, 210, 520) + line(60, 240, 560);
    b += `<rect x="60" y="300" width="200" height="56" fill="none" stroke="#1a1a1a" stroke-width="2"/>`;
    b += box(760, 150, 620, 380);
    for (let i = 0; i < 3; i++) b += box(60 + i * 450, 600, 420, 240);
  }
  b += `<text x="${W - 20}" y="${H - 16}" text-anchor="end" font-family="${MONO}" font-size="16" fill="#1a1a1a" opacity=".6">WIREFRAME ${String(seed % 10).padStart(2, "0")}</text>`;
  return svg(W, H, b);
}

// ───────────────────────── Creative development ─────────────────────────
function codeShot({ w = 1440, h = 900, seed, title, accent, id }) {
  const r = rng(seed);
  let b = defs(id) + `<rect width="${w}" height="${h}" fill="${C.ink}"/>`;
  for (let x = 0; x <= w; x += 48) b += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${accent}" stroke-opacity=".08"/>`;
  for (let y = 0; y <= h; y += 48) b += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${accent}" stroke-opacity=".08"/>`;
  // generative ribbons
  for (let k = 0; k < 9; k++) {
    let d = `M -20 ${h * (0.2 + r() * 0.6)}`;
    for (let i = 1; i <= 8; i++) d += ` Q ${i * 190 - 95} ${h * r()} ${i * 190} ${h * (0.2 + r() * 0.6)}`;
    b += `<path d="${d}" fill="none" stroke="${pick(r, [accent, C.violet, C.lemon, C.cyan])}" stroke-width="${2 + r() * 10}" stroke-linecap="round" opacity="${0.4 + r() * 0.6}"/>`;
  }
  b += `<rect x="60" y="${h - 250}" width="${title.length * 66 + 80}" height="120" fill="${C.ink}"/>`;
  b += `<text x="100" y="${h - 165}" font-family="${DISPLAY}" font-size="88" fill="${C.bone}">${esc(title.toUpperCase())}</text>`;
  b += `<text x="60" y="${h - 90}" font-family="${MONO}" font-size="22" fill="${accent}">&gt; npm run dev — ready on localhost:3000_</text>`;
  return svg(w, h, b);
}

// ───────────────────────── Registry ─────────────────────────
const jobs = {
  "gd-neon-noodle": [
    ["thumb", poster({ seed: 11, title: "Neon Noodle", sub: "Brand identity / concept", bg: C.plum, fg: C.bone, accent: C.acid, id: "a" })],
    ["01", logoSheet({ seed: 12, mark: "NN", name: "Neon Noodle", bg: C.ink, fg: C.bone, accent: C.acid, id: "b" })],
    ["02", patternSheet({ seed: 13, bg: C.plum, colors: [C.acid, C.pink, C.bone, C.lemon], id: "c", label: "Brand pattern" })],
  ],
  "gd-signal-noise": [
    ["thumb", poster({ seed: 21, title: "Signal Noise", sub: "Poster series 01/04", bg: C.lemon, fg: C.ink, accent: C.violet, id: "a" })],
    ["01", poster({ seed: 22, title: "Static Bloom", sub: "Poster series 02/04", bg: C.ink, fg: C.bone, accent: C.pink, id: "b" })],
    ["02", poster({ seed: 23, title: "Low Fi Hi", sub: "Poster series 03/04", bg: C.violet, fg: C.ink, accent: C.acid, id: "c" })],
  ],
  "gd-kinetic-fest": [
    ["thumb", poster({ seed: 31, title: "Kinetic Type Fest", sub: "Event identity", bg: C.bone, fg: C.ink, accent: C.orange, id: "a" })],
    ["01", patternSheet({ seed: 32, bg: C.bone, colors: [C.orange, C.ink, C.violet], id: "b", label: "Wayfinding system" })],
  ],
  "gd-off-grid": [
    ["thumb", socialGrid({ seed: 41, title: "Off-Grid Drop 02", bg: C.ink, accent: C.acid, id: "a" })],
    ["01", poster({ seed: 42, title: "Off Grid", sub: "Social campaign", bg: C.acid, fg: C.ink, accent: C.ink, id: "b" })],
  ],
  "gd-fizz-lab": [
    ["thumb", packaging({ seed: 51, name: "FIZZ", bg: C.violet, colors: [C.acid, C.lemon, C.pink], id: "a" })],
    ["01", logoSheet({ seed: 52, mark: "FZ", name: "Fizz Lab", bg: C.lemon, fg: C.ink, accent: C.violet, id: "b" })],
  ],
  "gd-night-shift": [
    ["thumb", poster({ seed: 61, title: "Night Shift", sub: "Campaign key visual", bg: C.ink, fg: C.lemon, accent: C.violet, id: "a" })],
    ["01", poster({ seed: 62, title: "Stay Up", sub: "Out-of-home 48 sheet", bg: C.pink, fg: C.ink, accent: C.lemon, id: "b" })],
  ],
  "gd-logo-studies": [
    ["thumb", logoSheet({ seed: 71, mark: "V1", name: "Logo Studies", bg: C.bone, fg: C.ink, accent: C.ink, id: "a" })],
    ["01", patternSheet({ seed: 72, bg: C.ink, colors: [C.bone, C.acid], id: "b", label: "Marks 01—36" })],
  ],
  "gd-chrome-garden": [
    ["thumb", poster({ seed: 81, title: "Chrome Garden", sub: "Art direction", bg: C.chrome, fg: C.ink, accent: C.acid, id: "a" })],
    ["01", patternSheet({ seed: 82, bg: C.plum, colors: [C.chrome, C.acid, C.violet], id: "b", label: "Moodboard" })],
  ],
  "ux-loop-transit": [
    ["thumb", phone({ seed: 101, title: "Loop", accent: C.acid, id: "a", variant: 0 })],
    ["01", phone({ seed: 102, title: "Routes", accent: C.acid, id: "b", variant: 1 })],
    ["02", phone({ seed: 103, title: "Tickets", accent: C.violet, dark: false, id: "c", variant: 0 })],
    ["wire-01", wireframe({ seed: 104, id: "d", mobile: true })],
    ["wire-02", wireframe({ seed: 105, id: "e", mobile: true })],
  ],
  "ux-pulse-dashboard": [
    ["thumb", desktop({ seed: 111, title: "Pulse", accent: C.acid, id: "a" })],
    ["01", desktop({ seed: 112, title: "Pulse", accent: C.lemon, id: "b" })],
    ["wire-01", wireframe({ seed: 113, id: "c" })],
  ],
  "ux-atelier-web": [
    ["thumb", desktop({ seed: 121, title: "Atelier", accent: C.violet, id: "a", kind: "light" })],
    ["01", desktop({ seed: 122, title: "Atelier", accent: C.pink, id: "b", kind: "site" })],
    ["02", phone({ seed: 123, title: "Atelier", accent: C.violet, dark: false, id: "c", variant: 1 })],
    ["wire-01", wireframe({ seed: 124, id: "d" })],
  ],
  "ux-grain-system": [
    ["thumb", patternSheet({ seed: 131, bg: C.bone, colors: [C.ink, C.acid, C.violet, C.chrome], id: "a", label: "Grain DS / tokens" })],
    ["01", desktop({ seed: 132, title: "Grain", accent: C.acid, id: "b", kind: "site" })],
    ["wire-01", wireframe({ seed: 133, id: "c" })],
  ],
  "ux-tempo-habits": [
    ["thumb", phone({ seed: 141, title: "Tempo", accent: C.lemon, id: "a", variant: 1 })],
    ["01", phone({ seed: 142, title: "Today", accent: C.pink, id: "b", variant: 0 })],
    ["wire-01", wireframe({ seed: 143, id: "c", mobile: true })],
  ],
  "vc-spray-playground": [
    ["thumb", codeShot({ seed: 201, title: "Spray", accent: C.acid, id: "a" })],
    ["01", desktop({ seed: 202, title: "Spray", accent: C.acid, id: "b", kind: "site" })],
  ],
  "vc-type-machine": [
    ["thumb", codeShot({ seed: 211, title: "Type Machine", accent: C.lemon, id: "a" })],
    ["01", desktop({ seed: 212, title: "Type", accent: C.lemon, id: "b", kind: "light" })],
  ],
  "vc-palette-engine": [
    ["thumb", patternSheet({ seed: 221, bg: C.ink, colors: [C.acid, C.violet, C.pink, C.lemon, C.cyan], id: "a", label: "Palette Engine" })],
    ["01", codeShot({ seed: 222, title: "Palette", accent: C.pink, id: "b" })],
  ],
  "vc-orbit-launch": [
    ["thumb", desktop({ seed: 231, title: "Orbit", accent: C.cyan, id: "a", kind: "site" })],
    ["01", codeShot({ seed: 232, title: "Orbit", accent: C.cyan, id: "b" })],
  ],
  "vc-this-portfolio": [
    ["thumb", codeShot({ seed: 241, title: "Portfolio", accent: C.acid, id: "a" })],
    ["01", desktop({ seed: 242, title: "Portfolio", accent: C.acid, id: "b", kind: "site" })],
  ],
};

let count = 0;
for (const [proj, files] of Object.entries(jobs)) {
  const dir = path.join(OUT, proj);
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, content] of files) {
    fs.writeFileSync(path.join(dir, `${name}.svg`), content);
    count++;
  }
}
console.log(`Generated ${count} placeholder images in ${OUT}`);
