import { Resvg } from "@resvg/resvg-js";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

type AssetCategory =
  | "celestial"
  | "decor"
  | "cards"
  | "ui"
  | "mascot"
  | "bracelet"
  | "placeholders"
  | "loading";

type Asset = {
  category: AssetCategory;
  name: string;
  width: number;
  height: number;
};

const palette = {
  ivory: "#fff7ea",
  cream: "#fffaf1",
  blush: "#f5c6ce",
  rose: "#c56f82",
  dustyRose: "#a8586c",
  peach: "#efb59e",
  navy: "#11172d",
  charcoal: "#292733",
  gold: "#cfa15f",
  roseGold: "#d99a8b",
  softGold: "#f3d89f",
  cloud: "#f8dfe4",
  white: "#ffffff"
};

const assets: Asset[] = [
  ...names("celestial", 512, 512, [
    "sun_ornate_01",
    "sun_ornate_02",
    "moon_crescent_01",
    "moon_crescent_02",
    "moon_full_01",
    "star_small_01",
    "star_small_02",
    "star_cluster_01",
    "cloud_dreamy_01",
    "cloud_dreamy_02",
    "sparkle_01",
    "sparkle_02",
    "sparkle_03"
  ]),
  ...names("decor", 1024, 1024, [
    "corner_ornament_01",
    "corner_ornament_02",
    "divider_tarot_01",
    "divider_tarot_02",
    "floral_mini_01",
    "floral_mini_02",
    "ribbon_01",
    "ribbon_02",
    "heart_mini_01",
    "heart_mini_02",
    "magical_swirl_01",
    "heart_orbit_clear_01",
    "photo_sparkle_cluster_clear_01"
  ]),
  ...names("cards", 1536, 2304, [
    "tarot_card_frame_front_01",
    "tarot_card_frame_front_02",
    "tarot_card_back_01",
    "tarot_card_back_02"
  ]),
  ...names("cards", 1024, 1024, [
    "tarot_badge_chapter_1",
    "tarot_badge_chapter_2",
    "tarot_badge_chapter_3",
    "tarot_badge_chapter_4"
  ]),
  ...names("ui", 1400, 760, [
    "text_panel_cream_01",
    "text_panel_dark_01",
    "text_panel_pink_01"
  ]),
  ...names("ui", 1200, 420, [
    "button_base_primary_01",
    "button_base_secondary_01",
    "progress_frame_01"
  ]),
  ...names("mascot", 1024, 1024, [
    "mascot_familiar_01",
    "wand_star_01",
    "envelope_winged_01",
    "envelope_clear_01",
    "gift_box_magical_01"
  ]),
  ...names("bracelet", 1024, 1024, [
    "bracelet_placeholder_01",
    "bracelet_display_frame_01",
    "bracelet_display_frame_02"
  ]),
  ...names("placeholders", 1200, 1600, [
    "lover_photo_frame_tarot_portrait_01",
    "lover_photo_frame_moon_portrait_01",
    "lover_photo_frame_soft_oval_01",
    "lover_photo_frame_clear_portrait_01",
    "lover_photo_frame_clear_oval_01"
  ]),
  ...names("loading", 1400, 2200, [
    "loading_tarot_card_01",
    "loading_tarot_card_02"
  ]),
  ...names("loading", 1200, 1200, ["loading_starburst_01"]),
  ...names("loading", 1400, 900, ["loading_glow_panel_01"])
];

function names(category: AssetCategory, width: number, height: number, list: string[]) {
  return list.map((name) => ({ category, name, width, height }));
}

function svg(width: number, height: number, body: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    <linearGradient id="goldRose" x1="0%" x2="100%" y1="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.softGold}"/>
      <stop offset="50%" stop-color="${palette.roseGold}"/>
      <stop offset="100%" stop-color="${palette.gold}"/>
    </linearGradient>
    <linearGradient id="creamBlush" x1="0%" x2="100%" y1="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.cream}"/>
      <stop offset="100%" stop-color="${palette.blush}"/>
    </linearGradient>
    <linearGradient id="roseDeep" x1="0%" x2="0%" y1="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.rose}"/>
      <stop offset="100%" stop-color="${palette.dustyRose}"/>
    </linearGradient>
    <linearGradient id="goldShine" x1="0%" x2="100%" y1="0%" y2="0%">
      <stop offset="0%" stop-color="${palette.gold}" stop-opacity="0.4"/>
      <stop offset="50%" stop-color="${palette.softGold}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${palette.gold}" stop-opacity="0.4"/>
    </linearGradient>
    <radialGradient id="softGlow" cx="50%" cy="48%" r="55%">
      <stop offset="0%" stop-color="${palette.white}" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="${palette.blush}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${palette.roseGold}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="warmGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${palette.softGold}" stop-opacity="0.6"/>
      <stop offset="60%" stop-color="${palette.gold}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${palette.gold}" stop-opacity="0"/>
    </radialGradient>
    <filter id="gentleShadow" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="22" stdDeviation="28" flood-color="${palette.navy}" flood-opacity="0.18"/>
    </filter>
    <filter id="innerGlow" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  ${body}
</svg>`;
}

function starPoints(cx: number, cy: number, outer: number, inner: number, points = 8) {
  const coords: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (i * Math.PI) / points;
    coords.push(`${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`);
  }
  return coords.join(" ");
}

function sparkle(cx: number, cy: number, size: number, fill = "url(#goldRose)", opacity = 1) {
  return `<path d="M${cx} ${cy - size} C${cx + size * 0.12} ${cy - size * 0.22} ${cx + size * 0.22} ${cy - size * 0.12} ${cx + size} ${cy} C${cx + size * 0.22} ${cy + size * 0.12} ${cx + size * 0.12} ${cy + size * 0.22} ${cx} ${cy + size} C${cx - size * 0.12} ${cy + size * 0.22} ${cx - size * 0.22} ${cy + size * 0.12} ${cx - size} ${cy} C${cx - size * 0.22} ${cy - size * 0.12} ${cx - size * 0.12} ${cy - size * 0.22} ${cx} ${cy - size}Z" fill="${fill}" opacity="${opacity}"/>`;
}

function miniStars(width: number, height: number, count = 22) {
  let output = "";
  for (let i = 0; i < count; i++) {
    const cx = ((i * 137) % width) + 18;
    const cy = ((i * 91) % height) + 18;
    const size = 7 + (i % 4) * 3;
    output += sparkle(cx % width, cy % height, size, i % 2 ? palette.gold : palette.roseGold, 0.52);
  }
  return output;
}

function strokePath(d: string, width = 8, color = palette.gold, opacity = 1) {
  return `<path d="${d}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
}

/** Generate a dot-chain pattern along a rectangle border */
function dotChain(x: number, y: number, w: number, h: number, dotR = 4, spacing = 28, fill = palette.gold, opacity = 0.55) {
  let dots = "";
  // top edge
  for (let px = x + spacing; px < x + w - spacing / 2; px += spacing) {
    dots += `<circle cx="${px}" cy="${y}" r="${dotR}" fill="${fill}" opacity="${opacity}"/>`;
  }
  // bottom edge
  for (let px = x + spacing; px < x + w - spacing / 2; px += spacing) {
    dots += `<circle cx="${px}" cy="${y + h}" r="${dotR}" fill="${fill}" opacity="${opacity}"/>`;
  }
  // left edge
  for (let py = y + spacing; py < y + h - spacing / 2; py += spacing) {
    dots += `<circle cx="${x}" cy="${py}" r="${dotR}" fill="${fill}" opacity="${opacity}"/>`;
  }
  // right edge
  for (let py = y + spacing; py < y + h - spacing / 2; py += spacing) {
    dots += `<circle cx="${x + w}" cy="${py}" r="${dotR}" fill="${fill}" opacity="${opacity}"/>`;
  }
  return dots;
}

/** Decorative crescent moon tiny accent */
function tinyCrescent(cx: number, cy: number, r: number, fill: string, opacity = 0.7) {
  const ox = r * 0.45;
  const oy = -r * 0.2;
  return `<mask id="tc${cx}${cy}"><rect x="${cx - r - 4}" y="${cy - r - 4}" width="${r * 2 + 8}" height="${r * 2 + 8}" fill="white"/><circle cx="${cx + ox}" cy="${cy + oy}" r="${r * 0.9}" fill="black"/></mask>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${opacity}" mask="url(#tc${cx}${cy})"/>`;
}

/** Curved flourish stroke that arcs from a corner */
function cornerFlourish(cx: number, cy: number, size: number, flipX: boolean, flipY: boolean, color = palette.gold, sw = 6) {
  const sx = flipX ? -1 : 1;
  const sy = flipY ? -1 : 1;
  const s = size;
  return `<path d="M${cx} ${cy} C${cx + sx * s * 0.3} ${cy + sy * s * 0.05} ${cx + sx * s * 0.4} ${cy + sy * s * 0.3} ${cx + sx * s * 0.15} ${cy + sy * s * 0.55} C${cx + sx * s * 0.05} ${cy + sy * s * 0.65} ${cx - sx * s * 0.05} ${cy + sy * s * 0.5} ${cx + sx * s * 0.08} ${cy + sy * s * 0.35}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" fill="none" opacity="0.72"/>
  <path d="M${cx} ${cy} C${cx + sx * s * 0.05} ${cy + sy * s * 0.3} ${cx + sx * s * 0.3} ${cy + sy * s * 0.4} ${cx + sx * s * 0.55} ${cy + sy * s * 0.15} C${cx + sx * s * 0.65} ${cy + sy * s * 0.05} ${cx + sx * s * 0.5} ${cy - sy * s * 0.05} ${cx + sx * s * 0.35} ${cy + sy * s * 0.08}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" fill="none" opacity="0.72"/>`;
}

/** Small decorative heart shape */
function miniHeart(cx: number, cy: number, size: number, fill: string, opacity = 0.8) {
  const s = size;
  return `<path d="M${cx} ${cy + s * 0.6} C${cx - s * 0.7} ${cy + s * 0.1} ${cx - s * 0.7} ${cy - s * 0.4} ${cx} ${cy - s * 0.15} C${cx + s * 0.7} ${cy - s * 0.4} ${cx + s * 0.7} ${cy + s * 0.1} ${cx} ${cy + s * 0.6}Z" fill="${fill}" opacity="${opacity}"/>`;
}

/** Scallop arc pattern along a circle */
function scallopCircle(cx: number, cy: number, r: number, count: number, depth: number, color: string, sw = 4, opacity = 0.7) {
  let path = "";
  for (let i = 0; i < count; i++) {
    const a1 = (Math.PI * 2 * i) / count;
    const a2 = (Math.PI * 2 * (i + 1)) / count;
    const amid = (a1 + a2) / 2;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    const x2 = cx + Math.cos(a2) * r;
    const y2 = cy + Math.sin(a2) * r;
    const cpx = cx + Math.cos(amid) * (r + depth);
    const cpy = cy + Math.sin(amid) * (r + depth);
    path += `M${x1},${y1} Q${cpx},${cpy} ${x2},${y2} `;
  }
  return `<path d="${path}" stroke="${color}" stroke-width="${sw}" fill="none" opacity="${opacity}"/>`;
}

function drawAsset(asset: Asset) {
  const name = asset.name;
  if (name.startsWith("sun_ornate")) return drawSun(name);
  if (name.startsWith("moon_crescent")) return drawCrescent(name);
  if (name.startsWith("moon_full")) return drawFullMoon();
  if (name.startsWith("star_small")) return drawSingleStar(name);
  if (name.startsWith("star_cluster")) return drawStarCluster();
  if (name.startsWith("cloud_dreamy")) return drawCloud(name);
  if (name.startsWith("sparkle")) return drawSparkle(name);
  if (name.startsWith("corner_ornament")) return drawCorner(name);
  if (name.startsWith("divider_tarot")) return drawDivider(name);
  if (name.startsWith("floral_mini")) return drawFloral(name);
  if (name.startsWith("ribbon")) return drawRibbon(name);
  if (name.startsWith("heart_orbit_clear")) return drawHeartOrbitClear();
  if (name.startsWith("photo_sparkle_cluster_clear")) return drawPhotoSparkleClusterClear();
  if (name.startsWith("heart_mini")) return drawHeart(name);
  if (name.startsWith("magical_swirl")) return drawSwirl();
  if (name.startsWith("tarot_card_frame_front")) return drawTarotFront(name, asset.width, asset.height);
  if (name.startsWith("tarot_card_back")) return drawTarotBack(name, asset.width, asset.height);
  if (name.startsWith("tarot_badge_chapter")) return drawBadge(name);
  if (name.startsWith("text_panel")) return drawTextPanel(name, asset.width, asset.height);
  if (name.startsWith("button_base")) return drawButton(name, asset.width, asset.height);
  if (name.startsWith("progress_frame")) return drawProgress(asset.width, asset.height);
  if (name.startsWith("mascot_familiar")) return drawMascot();
  if (name.startsWith("wand_star")) return drawWand();
  if (name.startsWith("envelope_clear")) return drawEnvelopeClear();
  if (name.startsWith("envelope_winged")) return drawEnvelope();
  if (name.startsWith("gift_box")) return drawGift();
  if (name.startsWith("bracelet_placeholder")) return drawBracelet();
  if (name.startsWith("bracelet_display_frame")) return drawBraceletFrame(name);
  if (name.startsWith("lover_photo_frame_clear")) return drawPhotoFrameClear(name, asset.width, asset.height);
  if (name.startsWith("lover_photo_frame")) return drawPhotoFrame(name, asset.width, asset.height);
  if (name.startsWith("loading_tarot_card")) return drawLoadingCard(name, asset.width, asset.height);
  if (name.startsWith("loading_starburst")) return drawStarburst(asset.width, asset.height);
  if (name.startsWith("loading_glow_panel")) return drawGlowPanel(asset.width, asset.height);
  throw new Error(`Missing renderer for ${name}`);
}

function drawSun(name: string) {
  const alt = name.endsWith("_02");
  const rays = Array.from({ length: alt ? 20 : 16 })
    .map((_, index) => {
      const angle = (Math.PI * 2 * index) / (alt ? 20 : 16);
      const x1 = 256 + Math.cos(angle) * 138;
      const y1 = 256 + Math.sin(angle) * 138;
      const x2 = 256 + Math.cos(angle) * (alt ? 226 : 204);
      const y2 = 256 + Math.sin(angle) * (alt ? 226 : 204);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="url(#goldRose)" stroke-width="${alt ? 13 : 10}" stroke-linecap="round"/>`;
    })
    .join("");

  return svg(
    512,
    512,
    `<circle cx="256" cy="256" r="226" fill="url(#softGlow)"/>
    ${rays}
    <circle cx="256" cy="256" r="134" fill="url(#goldRose)" filter="url(#gentleShadow)"/>
    <circle cx="256" cy="256" r="104" fill="${palette.ivory}" opacity="0.92"/>
    <path d="M202 258 C226 286 286 286 310 258" stroke="${palette.rose}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="216" cy="226" r="10" fill="${palette.navy}" opacity="0.72"/>
    <circle cx="296" cy="226" r="10" fill="${palette.navy}" opacity="0.72"/>
    ${sparkle(256, 115, 22)}
    ${sparkle(384, 340, 16, palette.roseGold, 0.82)}
    ${sparkle(126, 344, 14, palette.gold, 0.78)}`
  );
}

function drawCrescent(name: string) {
  const alt = name.endsWith("_02");
  return svg(
    512,
    512,
    `<mask id="crescentMask">
      <rect width="512" height="512" fill="white"/>
      <circle cx="${alt ? 292 : 318}" cy="${alt ? 215 : 234}" r="${alt ? 150 : 162}" fill="black"/>
    </mask>
    <circle cx="250" cy="256" r="${alt ? 170 : 184}" fill="url(#goldRose)" mask="url(#crescentMask)" filter="url(#gentleShadow)"/>
    <path d="M169 160 C118 241 140 346 224 392" stroke="${palette.ivory}" stroke-width="11" stroke-linecap="round" opacity="0.75"/>
    ${sparkle(340, 132, 24)}
    ${sparkle(386, 332, 16, palette.roseGold, 0.86)}
    ${sparkle(120, 382, 12, palette.gold, 0.72)}
    <circle cx="218" cy="206" r="8" fill="${palette.ivory}" opacity="0.82"/>
    <circle cx="180" cy="286" r="6" fill="${palette.ivory}" opacity="0.7"/>`
  );
}

function drawFullMoon() {
  return svg(
    512,
    512,
    `<circle cx="256" cy="256" r="214" fill="url(#softGlow)"/>
    <circle cx="256" cy="256" r="166" fill="${palette.ivory}" stroke="url(#goldRose)" stroke-width="13" filter="url(#gentleShadow)"/>
    <circle cx="204" cy="210" r="26" fill="${palette.blush}" opacity="0.45"/>
    <circle cx="302" cy="292" r="34" fill="${palette.peach}" opacity="0.38"/>
    <circle cx="280" cy="188" r="14" fill="${palette.gold}" opacity="0.32"/>
    <path d="M176 318 C218 350 298 352 340 318" stroke="${palette.rose}" stroke-width="7" stroke-linecap="round" opacity="0.55"/>
    ${sparkle(105, 210, 14)}
    ${sparkle(414, 184, 16)}
    ${sparkle(392, 378, 12, palette.roseGold, 0.78)}`
  );
}

function drawSingleStar(name: string) {
  const alt = name.endsWith("_02");
  return svg(
    512,
    512,
    `<circle cx="256" cy="256" r="194" fill="url(#softGlow)"/>
    <polygon points="${starPoints(256, 256, alt ? 184 : 168, alt ? 58 : 76, alt ? 6 : 8)}" fill="url(#goldRose)" filter="url(#gentleShadow)"/>
    <polygon points="${starPoints(256, 256, alt ? 110 : 92, alt ? 34 : 42, alt ? 6 : 8)}" fill="${palette.ivory}" opacity="0.56"/>
    ${miniStars(512, 512, 8)}`
  );
}

function drawStarCluster() {
  return svg(
    512,
    512,
    `<circle cx="250" cy="252" r="222" fill="url(#softGlow)"/>
    <polygon points="${starPoints(252, 220, 126, 52, 8)}" fill="url(#goldRose)" filter="url(#gentleShadow)"/>
    <polygon points="${starPoints(150, 342, 72, 31, 8)}" fill="${palette.roseGold}"/>
    <polygon points="${starPoints(374, 348, 88, 34, 8)}" fill="${palette.gold}"/>
    ${sparkle(386, 134, 30)}
    ${sparkle(108, 162, 18, palette.roseGold, 0.85)}
    ${sparkle(258, 402, 16, palette.gold, 0.72)}`
  );
}

function drawCloud(name: string) {
  const alt = name.endsWith("_02");
  return svg(
    512,
    512,
    `<ellipse cx="256" cy="306" rx="214" ry="88" fill="url(#softGlow)"/>
    <path d="M108 312 C103 252 156 213 213 232 C237 175 324 174 349 238 C403 230 442 270 433 326 C423 379 366 398 282 390 L178 388 C130 387 110 358 108 312Z" fill="${alt ? palette.ivory : palette.cloud}" stroke="url(#goldRose)" stroke-width="10" filter="url(#gentleShadow)"/>
    <path d="M168 318 C214 344 304 344 352 318" stroke="${palette.rose}" stroke-width="7" stroke-linecap="round" opacity="0.48"/>
    ${sparkle(154, 172, 18)}
    ${sparkle(374, 190, 14, palette.roseGold, 0.82)}
    ${sparkle(420, 354, 12, palette.gold, 0.68)}`
  );
}

function drawSparkle(name: string) {
  const size = name.endsWith("_03") ? 150 : name.endsWith("_02") ? 122 : 104;
  return svg(
    512,
    512,
    `<circle cx="256" cy="256" r="196" fill="url(#softGlow)"/>
    ${sparkle(256, 256, size)}
    ${sparkle(358, 150, size * 0.25, palette.roseGold, 0.82)}
    ${sparkle(142, 362, size * 0.18, palette.gold, 0.72)}
    <circle cx="256" cy="256" r="${size * 0.2}" fill="${palette.ivory}" opacity="0.58"/>`
  );
}

/* ─── ENHANCED: drawCorner ─── */
function drawCorner(name: string) {
  const alt = name.endsWith("_02");
  // Additional scrollwork curls
  const scrollCurl1 = `<path d="M160 780 C180 720 220 680 290 660 C240 700 210 740 200 800" stroke="${palette.roseGold}" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.6"/>`;
  const scrollCurl2 = `<path d="M780 160 C720 180 680 220 660 290 C700 240 740 210 800 200" stroke="${palette.roseGold}" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.6"/>`;
  // Finer inner parallel stroke
  const innerFrame = `<path d="M152 854 L152 340 C152 237 237 152 340 152 L854 152" stroke="${alt ? palette.roseGold : palette.gold}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.5"/>`;
  // tiny leaf petal shapes along the curve
  const leaf1 = `<path d="M310 480 C330 450 360 450 370 480 C360 510 330 510 310 480Z" fill="${palette.blush}" stroke="${palette.rose}" stroke-width="5" opacity="0.65"/>`;
  const leaf2 = `<path d="M480 310 C450 330 450 360 480 370 C510 360 510 330 480 310Z" fill="${palette.blush}" stroke="${palette.rose}" stroke-width="5" opacity="0.65"/>`;
  // Fine dot trail along the main arc
  let dotTrail = "";
  for (let t = 0; t < 12; t++) {
    const frac = t / 11;
    const dx = 200 + frac * 460;
    const dy = 790 - frac * 460;
    const cOff = Math.sin(frac * Math.PI) * 60;
    dotTrail += `<circle cx="${dx - cOff * 0.4}" cy="${dy - cOff * 0.4}" r="3.5" fill="${palette.gold}" opacity="0.45"/>`;
  }

  return svg(
    1024,
    1024,
    `<!-- Main outer frame arc -->
    <path d="M122 884 L122 326 C122 213 213 122 326 122 L884 122" stroke="url(#goldRose)" stroke-width="32" stroke-linecap="round"/>
    ${innerFrame}
    <!-- Inner decorative curves -->
    <path d="M206 790 C334 755 391 661 380 522 C502 530 606 472 653 345" stroke="${alt ? palette.rose : palette.gold}" stroke-width="18" stroke-linecap="round"/>
    <path d="M230 520 C310 432 436 428 518 504" stroke="${palette.roseGold}" stroke-width="14" stroke-linecap="round" opacity="0.85"/>
    <!-- Finer scroll detail line -->
    <path d="M260 680 C340 620 420 600 500 620" stroke="${palette.gold}" stroke-width="6" stroke-linecap="round" opacity="0.45"/>
    <path d="M680 260 C620 340 600 420 620 500" stroke="${palette.gold}" stroke-width="6" stroke-linecap="round" opacity="0.45"/>
    <!-- Scroll curls -->
    ${scrollCurl1}
    ${scrollCurl2}
    <!-- Center ornament -->
    <circle cx="380" cy="522" r="34" fill="${palette.ivory}" stroke="${palette.gold}" stroke-width="12"/>
    <circle cx="380" cy="522" r="18" fill="none" stroke="${palette.roseGold}" stroke-width="4" opacity="0.65"/>
    <!-- Leaf petal details -->
    <path d="M660 344 C718 324 786 344 826 392 C760 400 700 386 660 344Z" fill="${palette.blush}" stroke="${palette.rose}" stroke-width="8"/>
    <path d="M700 330 C730 304 766 310 784 336" stroke="${palette.gold}" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.55"/>
    <path d="M204 790 C184 854 132 890 70 900 C92 838 134 800 204 790Z" fill="${palette.ivory}" stroke="${palette.gold}" stroke-width="8"/>
    <path d="M170 824 C152 860 124 878 90 884" stroke="${palette.roseGold}" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.55"/>
    ${leaf1}
    ${leaf2}
    <!-- Dot trail -->
    ${dotTrail}
    <!-- Sparkles -->
    ${sparkle(224, 246, 28)}
    ${sparkle(760, 222, 18, palette.roseGold, 0.82)}
    ${sparkle(156, 664, 16, palette.gold, 0.78)}
    ${sparkle(550, 350, 12, palette.gold, 0.5)}
    ${sparkle(350, 550, 12, palette.roseGold, 0.5)}`
  );
}

function drawDivider(name: string) {
  const alt = name.endsWith("_02");
  return svg(
    1024,
    1024,
    `<path d="M142 512 H882" stroke="url(#goldRose)" stroke-width="20" stroke-linecap="round"/>
    <path d="M228 458 C318 522 402 522 492 458 C582 522 670 522 760 458" stroke="${palette.roseGold}" stroke-width="10" stroke-linecap="round" opacity="0.76"/>
    <circle cx="512" cy="512" r="78" fill="${palette.ivory}" stroke="url(#goldRose)" stroke-width="14" filter="url(#gentleShadow)"/>
    ${
      alt
        ? `<polygon points="${starPoints(512, 512, 52, 18, 8)}" fill="${palette.rose}"/>`
        : `<mask id="miniCrescent"><rect width="1024" height="1024" fill="white"/><circle cx="536" cy="496" r="48" fill="black"/></mask><circle cx="500" cy="512" r="58" fill="${palette.rose}" mask="url(#miniCrescent)"/>`
    }
    ${sparkle(338, 512, 18)}
    ${sparkle(686, 512, 18)}
    <circle cx="142" cy="512" r="30" fill="${palette.blush}" stroke="${palette.gold}" stroke-width="8"/>
    <circle cx="882" cy="512" r="30" fill="${palette.blush}" stroke="${palette.gold}" stroke-width="8"/>`
  );
}

function drawFloral(name: string) {
  const alt = name.endsWith("_02");
  return svg(
    1024,
    1024,
    `<path d="M512 820 C484 680 496 528 560 390 C594 318 644 250 718 194" stroke="${palette.gold}" stroke-width="16" stroke-linecap="round"/>
    <path d="M526 520 C420 486 346 396 326 286 C444 306 520 386 526 520Z" fill="${alt ? palette.ivory : palette.blush}" stroke="${palette.rose}" stroke-width="10"/>
    <path d="M552 454 C680 428 778 346 828 222 C706 226 594 304 552 454Z" fill="${alt ? palette.blush : palette.ivory}" stroke="${palette.gold}" stroke-width="10"/>
    <path d="M496 650 C392 626 312 558 266 458 C376 452 474 532 496 650Z" fill="${palette.peach}" stroke="${palette.roseGold}" stroke-width="10"/>
    <circle cx="520" cy="836" r="58" fill="url(#goldRose)" filter="url(#gentleShadow)"/>
    ${sparkle(366, 198, 18)}
    ${sparkle(742, 462, 20, palette.roseGold, 0.84)}`
  );
}

function drawRibbon(name: string) {
  const alt = name.endsWith("_02");
  return svg(
    1024,
    1024,
    `<path d="M144 418 H880 L788 516 L880 614 H144 L236 516 L144 418Z" fill="${alt ? palette.navy : palette.blush}" stroke="url(#goldRose)" stroke-width="18" filter="url(#gentleShadow)"/>
    <path d="M236 516 H788" stroke="${alt ? palette.gold : palette.rose}" stroke-width="9" stroke-linecap="round" opacity="0.7"/>
    ${sparkle(318, 514, 22, alt ? palette.ivory : palette.gold)}
    ${sparkle(706, 514, 22, alt ? palette.ivory : palette.gold)}
    <circle cx="512" cy="516" r="42" fill="${alt ? palette.ivory : palette.cream}" stroke="${palette.gold}" stroke-width="10"/>
    <path d="M490 516 C502 494 522 494 534 516 C522 540 502 540 490 516Z" fill="${palette.rose}"/>`
  );
}

function drawHeart(name: string) {
  const alt = name.endsWith("_02");
  return svg(
    1024,
    1024,
    `<circle cx="512" cy="512" r="332" fill="url(#softGlow)"/>
    <path d="M512 736 C342 612 244 526 244 396 C244 310 310 246 394 246 C448 246 490 274 512 318 C534 274 576 246 630 246 C714 246 780 310 780 396 C780 526 682 612 512 736Z" fill="${alt ? palette.rose : palette.blush}" stroke="url(#goldRose)" stroke-width="24" filter="url(#gentleShadow)"/>
    <path d="M376 334 C330 374 330 462 384 510" stroke="${palette.ivory}" stroke-width="18" stroke-linecap="round" opacity="0.76"/>
    ${sparkle(252, 280, 28)}
    ${sparkle(760, 284, 24, palette.roseGold, 0.84)}
    ${sparkle(516, 820, 18, palette.gold, 0.72)}`
  );
}

function drawHeartOrbitClear() {
  return svg(
    1024,
    1024,
    `<g>
      <ellipse cx="512" cy="512" rx="310" ry="214" fill="none" stroke="${palette.gold}" stroke-width="10" stroke-dasharray="18 22" opacity="0.5"/>
      <ellipse cx="512" cy="512" rx="250" ry="168" fill="none" stroke="${palette.roseGold}" stroke-width="6" opacity="0.34"/>
      ${miniHeart(512, 506, 94, palette.blush, 0.88)}
      <path d="M512 610 C438 558 394 512 394 442 C394 392 432 358 480 358 C500 358 518 368 532 388 C548 368 570 358 596 358 C644 358 682 394 682 444 C682 500 630 556 512 610Z" fill="none" stroke="${palette.gold}" stroke-width="12" stroke-linejoin="round" opacity="0.8"/>
      ${sparkle(512, 232, 34, palette.gold, 0.85)}
      ${sparkle(792, 514, 26, palette.roseGold, 0.75)}
      ${sparkle(232, 514, 22, palette.roseGold, 0.72)}
      ${sparkle(512, 792, 24, palette.gold, 0.7)}
    </g>`
  );
}

function drawPhotoSparkleClusterClear() {
  return svg(
    1024,
    1024,
    `<g>
      ${sparkle(512, 468, 96, palette.gold, 0.92)}
      ${sparkle(330, 360, 34, palette.roseGold, 0.82)}
      ${sparkle(700, 370, 42, palette.gold, 0.74)}
      ${sparkle(724, 650, 28, palette.roseGold, 0.7)}
      ${sparkle(310, 650, 24, palette.gold, 0.65)}
      <path d="M310 540 C416 476 602 476 714 540" stroke="${palette.gold}" stroke-width="9" stroke-linecap="round" opacity="0.42"/>
      <path d="M344 588 C440 636 582 636 680 588" stroke="${palette.roseGold}" stroke-width="7" stroke-linecap="round" opacity="0.36"/>
      <circle cx="512" cy="468" r="38" fill="${palette.ivory}" opacity="0.25"/>
    </g>`
  );
}

function drawSwirl() {
  return svg(
    1024,
    1024,
    `<path d="M190 570 C312 336 650 314 724 496 C774 620 642 728 538 650 C454 586 488 466 578 476 C640 482 666 560 614 594" stroke="url(#goldRose)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" filter="url(#gentleShadow)"/>
    <path d="M282 650 C408 768 596 788 742 684" stroke="${palette.roseGold}" stroke-width="14" stroke-linecap="round" opacity="0.85"/>
    ${sparkle(252, 350, 36)}
    ${sparkle(772, 410, 30, palette.roseGold, 0.88)}
    ${sparkle(466, 734, 22, palette.gold, 0.78)}`
  );
}

function cardBase(width: number, height: number, fill: string, stroke = "url(#goldRose)") {
  const margin = width * 0.08;
  const radius = width * 0.08;
  return `<rect x="${margin}" y="${margin}" width="${width - margin * 2}" height="${height - margin * 2}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${width * 0.022}" filter="url(#gentleShadow)"/>
  <rect x="${margin * 1.45}" y="${margin * 1.45}" width="${width - margin * 2.9}" height="${height - margin * 2.9}" rx="${radius * 0.62}" fill="none" stroke="${palette.gold}" stroke-width="${width * 0.01}" opacity="0.78"/>
  <rect x="${margin * 1.9}" y="${margin * 1.9}" width="${width - margin * 3.8}" height="${height - margin * 3.8}" rx="${radius * 0.44}" fill="none" stroke="${palette.roseGold}" stroke-width="${width * 0.006}" opacity="0.72"/>`;
}

/* ─── ENHANCED: drawTarotFront ─── */
function drawTarotFront(name: string, width: number, height: number) {
  const alt = name.endsWith("_02");
  const cx = width / 2;
  const cy = height / 2;
  const margin = width * 0.08;

  // Triple-line frame: outermost fine line
  const outerThinFrame = `<rect x="${margin * 0.7}" y="${margin * 0.7}" width="${width - margin * 1.4}" height="${height - margin * 1.4}" rx="${width * 0.09}" fill="none" stroke="${palette.gold}" stroke-width="${width * 0.005}" opacity="0.45"/>`;

  // Dot chain around the inner frame
  const innerX = margin * 2.2;
  const innerY = margin * 2.2;
  const innerW = width - margin * 4.4;
  const innerH = height - margin * 4.4;
  const dots = dotChain(innerX, innerY, innerW, innerH, width * 0.004, width * 0.032, palette.gold, 0.5);

  // Corner flourishes at the four corners of the inner area
  const flTL = cornerFlourish(innerX + 10, innerY + 10, width * 0.12, false, false, palette.roseGold, width * 0.005);
  const flTR = cornerFlourish(innerX + innerW - 10, innerY + 10, width * 0.12, true, false, palette.roseGold, width * 0.005);
  const flBL = cornerFlourish(innerX + 10, innerY + innerH - 10, width * 0.12, false, true, palette.roseGold, width * 0.005);
  const flBR = cornerFlourish(innerX + innerW - 10, innerY + innerH - 10, width * 0.12, true, true, palette.roseGold, width * 0.005);

  // Tiny crescents in diagonal corners
  const crescentTL = tinyCrescent(margin * 2.8, margin * 2.8, width * 0.022, palette.gold, 0.5);
  const crescentBR = tinyCrescent(width - margin * 2.8, height - margin * 2.8, width * 0.022, palette.gold, 0.5);

  // Additional ornamental diamond shapes along top and bottom
  const topDiamond = `<polygon points="${cx},${margin * 1.7} ${cx + 18},${margin * 2.1} ${cx},${margin * 2.5} ${cx - 18},${margin * 2.1}" fill="${palette.gold}" opacity="0.55"/>`;
  const botDiamond = `<polygon points="${cx},${height - margin * 1.7} ${cx + 18},${height - margin * 2.1} ${cx},${height - margin * 2.5} ${cx - 18},${height - margin * 2.1}" fill="${palette.gold}" opacity="0.55"/>`;

  // Decorative arc below the star
  const arcBelow = `<path d="M${cx - 200} ${cy - 40} C${cx - 80} ${cy + 20} ${cx + 80} ${cy + 20} ${cx + 200} ${cy - 40}" stroke="${palette.roseGold}" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.45"/>`;

  // Additional thin horizontal rule
  const thinRule = `<path d="M${cx - 260} ${cy + 340} H${cx + 260}" stroke="${palette.gold}" stroke-width="5" stroke-linecap="round" opacity="0.4"/>`;

  const body = `${cardBase(width, height, alt ? palette.ivory : palette.cream)}
    ${outerThinFrame}
    ${dots}
    ${flTL}${flTR}${flBL}${flBR}
    ${crescentTL}${crescentBR}
    ${topDiamond}${botDiamond}
    ${miniStars(width, height, 28)}
    <circle cx="${cx}" cy="${cy - 140}" r="${width * 0.18}" fill="${alt ? palette.blush : palette.ivory}" stroke="url(#goldRose)" stroke-width="${width * 0.014}"/>
    <circle cx="${cx}" cy="${cy - 140}" r="${width * 0.14}" fill="none" stroke="${palette.gold}" stroke-width="${width * 0.004}" stroke-dasharray="12 10" opacity="0.55"/>
    <polygon points="${starPoints(cx, cy - 140, width * 0.11, width * 0.038, 8)}" fill="${alt ? palette.rose : palette.gold}"/>
    ${arcBelow}
    <path d="M${cx - 280} ${cy + 265} C${cx - 110} ${cy + 365} ${cx + 110} ${cy + 365} ${cx + 280} ${cy + 265}" stroke="${palette.roseGold}" stroke-width="18" stroke-linecap="round"/>
    <path d="M${cx - 180} ${cy + 400} H${cx + 180}" stroke="${palette.gold}" stroke-width="14" stroke-linecap="round"/>
    ${thinRule}
    ${sparkle(cx - 350, cy - 520, 44)}
    ${sparkle(cx + 350, cy + 520, 44, palette.roseGold, 0.84)}
    ${sparkle(cx - 350, cy + 520, 20, palette.gold, 0.55)}
    ${sparkle(cx + 350, cy - 520, 20, palette.roseGold, 0.55)}
    ${sparkle(cx, cy + 180, 16, palette.gold, 0.45)}`;
  return svg(width, height, body);
}

/* ─── ENHANCED: drawTarotBack ─── */
function drawTarotBack(name: string, width: number, height: number) {
  const alt = name.endsWith("_02");
  const cx = width / 2;
  const cy = height / 2;
  const margin = width * 0.08;

  // Richer cross-hatching lattice
  let lattice = "";
  for (let i = -4; i <= 4; i++) {
    // Vertical waves
    lattice += `<path d="M${cx + i * 130} ${height * 0.14} C${cx + i * 78} ${cy} ${cx + i * 130} ${height * 0.86}" stroke="${alt ? palette.gold : palette.roseGold}" stroke-width="7" opacity="0.3" fill="none"/>`;
    // Horizontal crossing waves
    const hcy = cy + i * 130;
    if (hcy > height * 0.14 && hcy < height * 0.86) {
      lattice += `<path d="M${width * 0.14} ${hcy} C${cx} ${hcy + i * 50} ${width * 0.86} ${hcy}" stroke="${alt ? palette.roseGold : palette.gold}" stroke-width="5" opacity="0.2" fill="none"/>`;
    }
  }

  // Fine dot border around inner frame
  const innerX = margin * 2.2;
  const innerY = margin * 2.2;
  const innerW = width - margin * 4.4;
  const innerH = height - margin * 4.4;
  const fineDots = dotChain(innerX, innerY, innerW, innerH, width * 0.003, width * 0.025, alt ? palette.gold : palette.roseGold, 0.4);

  // Ring of small stars around central motif
  let starRing = "";
  const starRingR = width * 0.3;
  const starCount = 16;
  for (let i = 0; i < starCount; i++) {
    const a = (Math.PI * 2 * i) / starCount;
    const sx = cx + Math.cos(a) * starRingR;
    const sy = cy + Math.sin(a) * starRingR;
    const sz = i % 3 === 0 ? 14 : 9;
    starRing += sparkle(sx, sy, sz, i % 2 === 0 ? palette.gold : palette.ivory, 0.55);
  }

  // Inner mandala rings
  const mandalaRing1 = `<circle cx="${cx}" cy="${cy}" r="${width * 0.26}" fill="none" stroke="${alt ? palette.gold : palette.roseGold}" stroke-width="4" stroke-dasharray="18 12" opacity="0.45"/>`;
  const mandalaRing2 = `<circle cx="${cx}" cy="${cy}" r="${width * 0.17}" fill="none" stroke="${palette.ivory}" stroke-width="3" stroke-dasharray="8 14" opacity="0.35"/>`;

  // Additional thin outer ring
  const outerThin = `<rect x="${margin * 0.7}" y="${margin * 0.7}" width="${width - margin * 1.4}" height="${height - margin * 1.4}" rx="${width * 0.09}" fill="none" stroke="${palette.gold}" stroke-width="${width * 0.004}" opacity="0.35"/>`;

  // Corner accent diamonds
  const cornerDiamonds = [
    [margin * 2.6, margin * 2.6],
    [width - margin * 2.6, margin * 2.6],
    [margin * 2.6, height - margin * 2.6],
    [width - margin * 2.6, height - margin * 2.6]
  ].map(([dx, dy]) =>
    `<polygon points="${dx},${dy - 14} ${dx + 10},${dy} ${dx},${dy + 14} ${dx - 10},${dy}" fill="${palette.gold}" opacity="0.5"/>`
  ).join("");

  const body = `${cardBase(width, height, alt ? palette.navy : palette.charcoal, palette.gold)}
    ${outerThin}
    ${lattice}
    ${fineDots}
    ${starRing}
    ${mandalaRing1}
    ${mandalaRing2}
    <circle cx="${cx}" cy="${cy}" r="${width * 0.22}" fill="${alt ? palette.charcoal : palette.navy}" stroke="url(#goldRose)" stroke-width="22"/>
    <mask id="backMoon"><rect width="${width}" height="${height}" fill="white"/><circle cx="${cx + 72}" cy="${cy - 28}" r="${width * 0.18}" fill="black"/></mask>
    <circle cx="${cx - 36}" cy="${cy}" r="${width * 0.2}" fill="${palette.ivory}" mask="url(#backMoon)"/>
    <polygon points="${starPoints(cx, cy, width * 0.1, width * 0.036, 8)}" fill="url(#goldRose)" opacity="0.9"/>
    <polygon points="${starPoints(cx, cy, width * 0.06, width * 0.022, 12)}" fill="${palette.ivory}" opacity="0.35"/>
    ${cornerDiamonds}
    ${miniStars(width, height, 38)}`;
  return svg(width, height, body);
}

/* ─── ENHANCED: drawBadge ─── */
function drawBadge(name: string) {
  const chapter = name.split("_").pop() ?? "1";
  const roman: Record<string, string> = { "1": "I", "2": "II", "3": "III", "4": "IV" };

  // Scalloped outer ring
  const scallop = scallopCircle(512, 512, 340, 28, 30, palette.gold, 5, 0.55);

  // Tiny stars between inner and outer circles
  let tinyStarsRing = "";
  const ringCount = 12;
  const ringR = 252;
  for (let i = 0; i < ringCount; i++) {
    const a = (Math.PI * 2 * i) / ringCount;
    const sx = 512 + Math.cos(a) * ringR;
    const sy = 512 + Math.sin(a) * ringR;
    tinyStarsRing += sparkle(sx, sy, 10, i % 2 === 0 ? palette.gold : palette.roseGold, 0.55);
  }

  // Additional fine inner ring
  const innerRing = `<circle cx="512" cy="512" r="186" fill="none" stroke="${palette.gold}" stroke-width="4" opacity="0.4"/>`;

  // Dot accents at cardinal points
  const cardinalDots = [0, 90, 180, 270].map(deg => {
    const a = (deg * Math.PI) / 180;
    return `<circle cx="${512 + Math.cos(a) * 300}" cy="${512 + Math.sin(a) * 300}" r="6" fill="${palette.roseGold}" opacity="0.6"/>`;
  }).join("");

  return svg(
    1024,
    1024,
    `<circle cx="512" cy="512" r="382" fill="url(#softGlow)"/>
    ${scallop}
    <circle cx="512" cy="512" r="286" fill="${palette.ivory}" stroke="url(#goldRose)" stroke-width="22" filter="url(#gentleShadow)"/>
    <circle cx="512" cy="512" r="218" fill="none" stroke="${palette.roseGold}" stroke-width="10" stroke-dasharray="24 28"/>
    ${innerRing}
    ${tinyStarsRing}
    ${cardinalDots}
    <text x="512" y="458" text-anchor="middle" font-family="Georgia, serif" font-size="72" letter-spacing="12" fill="${palette.rose}">CHAPTER</text>
    <text x="512" y="626" text-anchor="middle" font-family="Georgia, serif" font-size="210" font-weight="700" fill="${palette.navy}">${roman[chapter]}</text>
    ${sparkle(270, 512, 28)}
    ${sparkle(754, 512, 28)}
    ${sparkle(512, 210, 26, palette.roseGold, 0.84)}
    ${sparkle(512, 816, 22, palette.gold, 0.76)}`
  );
}

function drawTextPanel(name: string, width: number, height: number) {
  const isDark = name.includes("dark");
  const isPink = name.includes("pink");
  const fill = isDark ? palette.navy : isPink ? palette.blush : palette.ivory;
  const accent = isDark ? palette.ivory : palette.navy;
  return svg(
    width,
    height,
    `<rect x="72" y="78" width="${width - 144}" height="${height - 156}" rx="78" fill="${fill}" stroke="url(#goldRose)" stroke-width="18" filter="url(#gentleShadow)"/>
    <rect x="118" y="124" width="${width - 236}" height="${height - 248}" rx="46" fill="none" stroke="${isDark ? palette.roseGold : palette.gold}" stroke-width="8" opacity="0.76"/>
    ${sparkle(192, 168, 24, isDark ? palette.ivory : palette.gold, 0.84)}
    ${sparkle(width - 190, height - 168, 24, isDark ? palette.ivory : palette.roseGold, 0.84)}
    <path d="M${width * 0.31} ${height - 158} C${width * 0.42} ${height - 102} ${width * 0.58} ${height - 102} ${width * 0.69} ${height - 158}" stroke="${accent}" stroke-width="8" stroke-linecap="round" opacity="0.32"/>`
  );
}

function drawButton(name: string, width: number, height: number) {
  const secondary = name.includes("secondary");
  return svg(
    width,
    height,
    `<rect x="64" y="80" width="${width - 128}" height="${height - 160}" rx="${(height - 160) / 2}" fill="${secondary ? palette.ivory : palette.navy}" stroke="url(#goldRose)" stroke-width="16" filter="url(#gentleShadow)"/>
    <rect x="106" y="122" width="${width - 212}" height="${height - 244}" rx="${(height - 244) / 2}" fill="none" stroke="${secondary ? palette.roseGold : palette.gold}" stroke-width="6" opacity="0.78"/>
    ${sparkle(180, height / 2, 22, secondary ? palette.gold : palette.ivory, 0.86)}
    ${sparkle(width - 180, height / 2, 22, secondary ? palette.roseGold : palette.ivory, 0.86)}`
  );
}

function drawProgress(width: number, height: number) {
  return svg(
    width,
    height,
    `<rect x="78" y="${height / 2 - 62}" width="${width - 156}" height="124" rx="62" fill="${palette.ivory}" stroke="url(#goldRose)" stroke-width="14" filter="url(#gentleShadow)"/>
    <rect x="136" y="${height / 2 - 20}" width="${width - 272}" height="40" rx="20" fill="${palette.blush}" opacity="0.48"/>
    ${sparkle(116, height / 2, 18)}
    ${sparkle(width - 116, height / 2, 18, palette.roseGold, 0.84)}`
  );
}

/* ─── ENHANCED: drawMascot ─── */
function drawMascot() {
  // Whisker strokes
  const whiskerL1 = `<line x1="360" y1="530" x2="280" y2="510" stroke="${palette.navy}" stroke-width="5" stroke-linecap="round" opacity="0.35"/>`;
  const whiskerL2 = `<line x1="360" y1="546" x2="284" y2="546" stroke="${palette.navy}" stroke-width="5" stroke-linecap="round" opacity="0.3"/>`;
  const whiskerL3 = `<line x1="360" y1="562" x2="288" y2="578" stroke="${palette.navy}" stroke-width="5" stroke-linecap="round" opacity="0.25"/>`;
  const whiskerR1 = `<line x1="664" y1="530" x2="744" y2="510" stroke="${palette.navy}" stroke-width="5" stroke-linecap="round" opacity="0.35"/>`;
  const whiskerR2 = `<line x1="664" y1="546" x2="740" y2="546" stroke="${palette.navy}" stroke-width="5" stroke-linecap="round" opacity="0.3"/>`;
  const whiskerR3 = `<line x1="664" y1="562" x2="736" y2="578" stroke="${palette.navy}" stroke-width="5" stroke-linecap="round" opacity="0.25"/>`;

  // Blush circles on cheeks
  const blushL = `<ellipse cx="392" cy="548" rx="32" ry="22" fill="${palette.blush}" opacity="0.55"/>`;
  const blushR = `<ellipse cx="632" cy="548" rx="32" ry="22" fill="${palette.blush}" opacity="0.55"/>`;

  // Decorative collar / necklace
  let collarBeads = "";
  const collarAngleStart = -0.35;
  const collarAngleEnd = Math.PI + 0.35;
  const collarCount = 9;
  for (let i = 0; i < collarCount; i++) {
    const frac = i / (collarCount - 1);
    const a = collarAngleStart + frac * (collarAngleEnd - collarAngleStart);
    const bx = 512 + Math.cos(a) * 148;
    const by = 660 + Math.sin(a) * 42;
    const r = i === Math.floor(collarCount / 2) ? 10 : 6;
    const fill = i % 2 === 0 ? palette.gold : palette.roseGold;
    collarBeads += `<circle cx="${bx}" cy="${by}" r="${r}" fill="${fill}" opacity="0.8"/>`;
  }
  const collarLine = `<path d="M364 658 C420 706 604 706 660 658" stroke="${palette.gold}" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.6"/>`;

  // Eye shine highlights
  const eyeShineL = `<circle cx="438" cy="472" r="7" fill="${palette.white}" opacity="0.8"/>`;
  const eyeShineR = `<circle cx="574" cy="472" r="7" fill="${palette.white}" opacity="0.8"/>`;

  // Tiny nose
  const nose = `<ellipse cx="512" cy="536" rx="10" ry="7" fill="${palette.rose}" opacity="0.7"/>`;

  return svg(
    1024,
    1024,
    `<circle cx="512" cy="512" r="382" fill="url(#softGlow)"/>
    <!-- Body -->
    <path d="M300 438 C296 282 412 204 512 204 C612 204 728 282 724 438 C808 508 794 714 650 800 C560 854 464 854 374 800 C230 714 216 508 300 438Z" fill="${palette.navy}" stroke="url(#goldRose)" stroke-width="20" filter="url(#gentleShadow)"/>
    <!-- Face -->
    <path d="M342 446 C380 350 444 306 512 306 C580 306 644 350 682 446 C674 570 602 650 512 650 C422 650 350 570 342 446Z" fill="${palette.ivory}"/>
    <!-- Eyes -->
    <circle cx="444" cy="478" r="24" fill="${palette.navy}"/>
    <circle cx="580" cy="478" r="24" fill="${palette.navy}"/>
    ${eyeShineL}${eyeShineR}
    <!-- Nose -->
    ${nose}
    <!-- Mouth -->
    <path d="M456 560 C486 594 538 594 568 560" stroke="${palette.rose}" stroke-width="12" stroke-linecap="round"/>
    <!-- Blush -->
    ${blushL}${blushR}
    <!-- Whiskers -->
    ${whiskerL1}${whiskerL2}${whiskerL3}
    ${whiskerR1}${whiskerR2}${whiskerR3}
    <!-- Ears -->
    <path d="M390 318 C354 250 308 226 260 246 C286 306 326 346 390 318Z" fill="${palette.blush}" stroke="${palette.gold}" stroke-width="12"/>
    <path d="M370 310 C348 268 324 254 296 262" stroke="${palette.rose}" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.5"/>
    <path d="M634 318 C670 250 716 226 764 246 C738 306 698 346 634 318Z" fill="${palette.blush}" stroke="${palette.gold}" stroke-width="12"/>
    <path d="M654 310 C676 268 700 254 728 262" stroke="${palette.rose}" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.5"/>
    <!-- Collar necklace -->
    ${collarLine}
    ${collarBeads}
    <!-- Crown star -->
    <polygon points="${starPoints(512, 188, 82, 32, 8)}" fill="url(#goldRose)"/>
    <polygon points="${starPoints(512, 188, 44, 18, 8)}" fill="${palette.ivory}" opacity="0.4"/>
    <!-- Sparkles -->
    ${sparkle(276, 626, 28)}
    ${sparkle(752, 626, 28, palette.roseGold, 0.86)}
    ${sparkle(512, 810, 22, palette.gold, 0.74)}
    ${sparkle(360, 188, 14, palette.gold, 0.6)}
    ${sparkle(664, 188, 14, palette.roseGold, 0.6)}`
  );
}

function drawWand() {
  return svg(
    1024,
    1024,
    `<line x1="252" y1="782" x2="686" y2="348" stroke="${palette.navy}" stroke-width="38" stroke-linecap="round" filter="url(#gentleShadow)"/>
    <line x1="252" y1="782" x2="686" y2="348" stroke="url(#goldRose)" stroke-width="18" stroke-linecap="round"/>
    <polygon points="${starPoints(728, 306, 138, 54, 8)}" fill="url(#goldRose)" stroke="${palette.ivory}" stroke-width="12"/>
    ${sparkle(294, 302, 32)}
    ${sparkle(412, 224, 20, palette.roseGold, 0.86)}
    ${sparkle(780, 626, 24, palette.gold, 0.72)}
    <path d="M348 690 C454 676 518 620 540 518" stroke="${palette.roseGold}" stroke-width="12" stroke-linecap="round"/>`
  );
}

/* ─── ENHANCED: drawEnvelope (Celestial Tarot Messenger) ─── */
function drawEnvelopeClear() {
  const body = `<path d="M226 392 H798 V656 H226 Z" fill="${palette.ivory}" fill-opacity="0.96" stroke="url(#goldRose)" stroke-width="18" stroke-linejoin="round"/>`;
  const flap = `<path d="M236 404 L512 574 L788 404" fill="none" stroke="${palette.roseGold}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M236 648 L454 512" fill="none" stroke="${palette.gold}" stroke-width="8" stroke-linecap="round"/>
  <path d="M788 648 L570 512" fill="none" stroke="${palette.gold}" stroke-width="8" stroke-linecap="round"/>`;
  const seal = `<circle cx="512" cy="526" r="44" fill="${palette.navy}" stroke="${palette.gold}" stroke-width="8"/>
  <mask id="clearEnvelopeMoon"><rect width="1024" height="1024" fill="white"/><circle cx="528" cy="514" r="34" fill="black"/></mask>
  <circle cx="504" cy="526" r="40" fill="${palette.ivory}" mask="url(#clearEnvelopeMoon)"/>
  <polygon points="${starPoints(538, 532, 12, 5, 6)}" fill="${palette.gold}"/>`;

  return svg(
    1024,
    1024,
    `<g>
      <path d="M190 708 C304 758 696 758 834 704" stroke="${palette.gold}" stroke-width="8" stroke-linecap="round" opacity="0.22"/>
      ${body}
      <rect x="260" y="426" width="504" height="198" rx="16" fill="none" stroke="${palette.navy}" stroke-width="4" opacity="0.14"/>
      ${flap}
      ${seal}
      ${sparkle(512, 250, 34, palette.gold, 0.86)}
      ${sparkle(236, 318, 22, palette.roseGold, 0.72)}
      ${sparkle(800, 320, 22, palette.roseGold, 0.72)}
      ${sparkle(214, 676, 18, palette.gold, 0.52)}
      ${sparkle(812, 676, 18, palette.gold, 0.52)}
    </g>`
  );
}

function drawEnvelope() {
  // A glowing celestial astrolabe background
  const astrolabe = `<circle cx="512" cy="512" r="360" fill="none" stroke="${palette.gold}" stroke-width="6" stroke-dasharray="10 14" opacity="0.4"/>
  <circle cx="512" cy="512" r="320" fill="none" stroke="${palette.roseGold}" stroke-width="4" opacity="0.3"/>
  <polygon points="${starPoints(512, 512, 420, 16, 12)}" fill="none" stroke="${palette.gold}" stroke-width="3" opacity="0.2"/>`;

  // Envelope body (more ornate)
  const envBody = `<path d="M220 380 H804 V662 H220 Z" fill="${palette.ivory}" stroke="url(#goldRose)" stroke-width="20" filter="url(#gentleShadow)"/>`;
  const envInner = `<rect x="244" y="404" width="536" height="234" rx="12" fill="none" stroke="${palette.navy}" stroke-width="4" opacity="0.2"/>`;
  
  // Flap with celestial lines
  const flap = `<path d="M224 384 L512 566 L800 384" stroke="${palette.roseGold}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`;
  const foldL = `<path d="M224 660 L452 512" stroke="${palette.gold}" stroke-width="10" stroke-linecap="round"/>`;
  const foldR = `<path d="M800 660 L572 512" stroke="${palette.gold}" stroke-width="10" stroke-linecap="round"/>`;

  // Moon seal
  const sealCx = 512;
  const sealCy = 520;
  const seal = `<circle cx="${sealCx}" cy="${sealCy}" r="54" fill="${palette.navy}" stroke="${palette.gold}" stroke-width="8" filter="url(#gentleShadow)"/>
  <path d="M500 496 C520 496 540 510 540 530 C540 550 516 546 516 546 C500 546 488 534 488 520 C488 506 500 496 500 496Z" fill="${palette.ivory}"/>
  <polygon points="${starPoints(532, 508, 8, 3, 4)}" fill="${palette.gold}"/>`;

  // Celestial Ribbon wrapping the envelope
  const ribbonL = `<path d="M180 500 C120 540 160 620 220 620" stroke="${palette.rose}" stroke-width="24" stroke-linecap="round" fill="none" opacity="0.8"/>
  <path d="M190 510 C140 540 170 610 220 610" stroke="${palette.gold}" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.6"/>`;
  const ribbonR = `<path d="M844 500 C904 540 864 620 804 620" stroke="${palette.rose}" stroke-width="24" stroke-linecap="round" fill="none" opacity="0.8"/>
  <path d="M834 510 C884 540 854 610 804 610" stroke="${palette.gold}" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.6"/>`;

  return svg(
    1024,
    1024,
    `<circle cx="512" cy="512" r="420" fill="url(#softGlow)"/>
    <!-- Astrolabe Background -->
    ${astrolabe}
    ${sparkle(512, 132, 48, palette.gold, 0.9)}
    ${sparkle(512, 892, 48, palette.roseGold, 0.9)}
    ${sparkle(132, 512, 48, palette.roseGold, 0.9)}
    ${sparkle(892, 512, 48, palette.gold, 0.9)}
    <!-- Ribbons -->
    ${ribbonL}${ribbonR}
    <!-- Envelope -->
    ${envBody}${envInner}
    ${flap}${foldL}${foldR}
    <!-- Seal -->
    ${seal}
    <!-- Sparkles -->
    ${sparkle(300, 320, 24)}
    ${sparkle(724, 320, 24, palette.roseGold, 0.78)}
    ${sparkle(240, 680, 18, palette.gold, 0.6)}
    ${sparkle(780, 680, 18, palette.roseGold, 0.6)}`
  );
}

/* ─── ENHANCED: drawGift ─── */
function drawGift() {
  // Shine highlights on the box surface
  const shine1 = `<path d="M310 500 L340 460" stroke="${palette.white}" stroke-width="6" stroke-linecap="round" opacity="0.35"/>`;
  const shine2 = `<path d="M320 520 L344 486" stroke="${palette.white}" stroke-width="4" stroke-linecap="round" opacity="0.25"/>`;

  // Decorative dot pattern on box surface
  let boxDots = "";
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      const dx = 330 + col * 80;
      const dy = 510 + row * 60;
      if (dx > 460 && dx < 560) continue; // skip ribbon area
      boxDots += `<circle cx="${dx}" cy="${dy}" r="4" fill="${palette.rose}" opacity="0.22"/>`;
    }
  }

  // Layered bow petals (richer bow)
  const bowBack1 = `<path d="M470 340 C360 240 280 280 280 340 C360 368 430 362 470 340Z" fill="${palette.roseGold}" stroke="${palette.gold}" stroke-width="8" opacity="0.6"/>`;
  const bowBack2 = `<path d="M554 340 C664 240 744 280 744 340 C664 368 594 362 554 340Z" fill="${palette.roseGold}" stroke="${palette.gold}" stroke-width="8" opacity="0.6"/>`;
  const bowFront1 = `<path d="M500 350 C390 260 320 282 304 344 C390 374 456 372 500 350Z" fill="${palette.peach}" stroke="${palette.gold}" stroke-width="14"/>`;
  const bowFront2 = `<path d="M524 350 C634 260 704 282 720 344 C634 374 568 372 524 350Z" fill="${palette.peach}" stroke="${palette.gold}" stroke-width="14"/>`;

  // Bow center knot
  const bowKnot = `<ellipse cx="512" cy="348" rx="26" ry="20" fill="${palette.gold}" stroke="${palette.ivory}" stroke-width="4"/>`;

  // Small ribbon loops above knot
  const loopL = `<path d="M494 332 C478 306 460 304 466 324" stroke="${palette.gold}" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.7"/>`;
  const loopR = `<path d="M530 332 C546 306 564 304 558 324" stroke="${palette.gold}" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.7"/>`;

  return svg(
    1024,
    1024,
    `<circle cx="512" cy="512" r="384" fill="url(#softGlow)"/>
    <!-- Box body -->
    <rect x="272" y="430" width="480" height="348" rx="42" fill="${palette.blush}" stroke="url(#goldRose)" stroke-width="18" filter="url(#gentleShadow)"/>
    <!-- Box dots pattern -->
    ${boxDots}
    <!-- Shine highlights -->
    ${shine1}${shine2}
    <!-- Box lid -->
    <rect x="238" y="350" width="548" height="126" rx="42" fill="${palette.ivory}" stroke="url(#goldRose)" stroke-width="18"/>
    <!-- Lid highlight -->
    <path d="M290 370 L340 370" stroke="${palette.white}" stroke-width="6" stroke-linecap="round" opacity="0.4"/>
    <!-- Vertical ribbon -->
    <rect x="472" y="350" width="80" height="428" fill="${palette.navy}" opacity="0.88"/>
    <!-- Horizontal ribbon -->
    <path d="M338 574 H686" stroke="${palette.rose}" stroke-width="12" stroke-linecap="round" opacity="0.48"/>
    <!-- Bow (back petals) -->
    ${bowBack1}${bowBack2}
    <!-- Bow (front petals) -->
    ${bowFront1}${bowFront2}
    <!-- Bow loops & knot -->
    ${loopL}${loopR}
    ${bowKnot}
    <!-- Sparkles -->
    ${sparkle(242, 264, 32)}
    ${sparkle(780, 260, 28, palette.roseGold, 0.86)}
    ${sparkle(778, 708, 22, palette.gold, 0.72)}
    ${sparkle(246, 738, 18, palette.roseGold, 0.7)}
    ${sparkle(512, 260, 16, palette.ivory, 0.6)}`
  );
}

/* ─── ENHANCED: drawBracelet ─── */
function drawBracelet() {
  const beadPositions = [
    [334, 438],
    [394, 392],
    [466, 370],
    [542, 370],
    [614, 392],
    [674, 438],
    [706, 508],
    [684, 586],
    [626, 646],
    [550, 678],
    [470, 676],
    [394, 646],
    [336, 586],
    [314, 508]
  ];

  // Subtle chain connections between beads
  let chain = "";
  for (let i = 0; i < beadPositions.length; i++) {
    const [x1, y1] = beadPositions[i];
    const [x2, y2] = beadPositions[(i + 1) % beadPositions.length];
    chain += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${palette.gold}" stroke-width="4" opacity="0.3"/>`;
  }

  // Enhanced beads: alternating shapes (circles, diamonds, stars)
  let beads = "";
  beadPositions.forEach(([cx, cy], index) => {
    const isLarge = index % 3 === 0;
    const baseR = isLarge ? 30 : 24;
    const fillColor = index % 2 ? palette.ivory : palette.roseGold;
    const strokeColor = palette.gold;

    if (index % 5 === 0) {
      // Diamond-shaped bead
      const d = baseR * 0.9;
      beads += `<polygon points="${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="7"/>`;
      beads += `<polygon points="${cx},${cy - d * 0.45} ${cx + d * 0.45},${cy} ${cx},${cy + d * 0.45} ${cx - d * 0.45},${cy}" fill="${palette.gold}" opacity="0.35"/>`;
    } else if (index % 4 === 0) {
      // Star-shaped bead (tiny stars on some beads)
      beads += `<circle cx="${cx}" cy="${cy}" r="${baseR}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="7"/>`;
      beads += `<polygon points="${starPoints(cx, cy, baseR * 0.55, baseR * 0.22, 6)}" fill="${palette.gold}" opacity="0.45"/>`;
    } else {
      // Standard round bead with inner highlight
      beads += `<circle cx="${cx}" cy="${cy}" r="${baseR}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="8"/>`;
      beads += `<circle cx="${cx - baseR * 0.22}" cy="${cy - baseR * 0.22}" r="${baseR * 0.28}" fill="${palette.white}" opacity="0.4"/>`;
    }
  });

  // Glow highlight on centerpiece
  const glowCenter = `<circle cx="512" cy="524" r="68" fill="url(#warmGlow)" opacity="0.6"/>`;

  return svg(
    1024,
    1024,
    `<circle cx="512" cy="512" r="392" fill="url(#softGlow)"/>
    <ellipse cx="512" cy="524" rx="302" ry="248" fill="none" stroke="${palette.navy}" stroke-width="20" opacity="0.16"/>
    <!-- Chain connections -->
    ${chain}
    <!-- Beads -->
    ${beads}
    <!-- Center glow -->
    ${glowCenter}
    <!-- Centerpiece -->
    <circle cx="512" cy="524" r="56" fill="${palette.navy}" stroke="url(#goldRose)" stroke-width="12" filter="url(#gentleShadow)"/>
    <circle cx="512" cy="524" r="46" fill="none" stroke="${palette.gold}" stroke-width="3" stroke-dasharray="8 6" opacity="0.45"/>
    <mask id="braceletMoon"><rect width="1024" height="1024" fill="white"/><circle cx="536" cy="508" r="42" fill="black"/></mask>
    <circle cx="500" cy="524" r="52" fill="${palette.ivory}" mask="url(#braceletMoon)"/>
    <!-- Tiny star accent on centerpiece -->
    <polygon points="${starPoints(530, 536, 14, 5, 6)}" fill="${palette.gold}" opacity="0.6"/>
    <!-- Sparkles -->
    ${sparkle(512, 250, 34)}
    ${sparkle(240, 568, 24, palette.roseGold, 0.82)}
    ${sparkle(786, 568, 24, palette.gold, 0.82)}
    ${sparkle(420, 310, 12, palette.gold, 0.45)}
    ${sparkle(610, 310, 12, palette.roseGold, 0.45)}`
  );
}

function drawBraceletFrame(name: string) {
  const alt = name.endsWith("_02");
  return svg(
    1024,
    1024,
    `<ellipse cx="512" cy="512" rx="382" ry="${alt ? 300 : 350}" fill="${alt ? palette.ivory : palette.blush}" opacity="0.32"/>
    <ellipse cx="512" cy="512" rx="362" ry="${alt ? 278 : 328}" fill="none" stroke="url(#goldRose)" stroke-width="20" filter="url(#gentleShadow)"/>
    <ellipse cx="512" cy="512" rx="292" ry="${alt ? 220 : 264}" fill="none" stroke="${palette.roseGold}" stroke-width="10" stroke-dasharray="24 22"/>
    ${sparkle(512, alt ? 218 : 142, 34)}
    ${sparkle(224, 512, 24, palette.roseGold, 0.84)}
    ${sparkle(800, 512, 24, palette.gold, 0.84)}`
  );
}

/* ─── ENHANCED: drawPhotoFrame ─── */
function drawPhotoFrameClear(name: string, width: number, height: number) {
  const oval = name.includes("oval");
  const cx = width / 2;
  const cy = height / 2;

  if (oval) {
    return svg(
      width,
      height,
      `<g>
        <ellipse cx="${cx}" cy="${cy}" rx="395" ry="540" fill="none" stroke="url(#goldRose)" stroke-width="22"/>
        <ellipse cx="${cx}" cy="${cy}" rx="350" ry="492" fill="none" stroke="${palette.roseGold}" stroke-width="8" opacity="0.74"/>
        <ellipse cx="${cx}" cy="${cy}" rx="304" ry="434" fill="none" stroke="${palette.gold}" stroke-width="4" stroke-dasharray="16 18" opacity="0.46"/>
        ${sparkle(cx, cy - 542, 40, palette.gold, 0.9)}
        ${sparkle(cx, cy + 542, 34, palette.roseGold, 0.8)}
        ${sparkle(cx - 390, cy - 110, 22, palette.roseGold, 0.62)}
        ${sparkle(cx + 390, cy + 110, 22, palette.gold, 0.62)}
        ${miniHeart(cx - 264, cy + 386, 18, palette.rose, 0.44)}
        ${miniHeart(cx + 264, cy - 386, 18, palette.rose, 0.44)}
      </g>`
    );
  }

  return svg(
    width,
    height,
    `<g>
      <rect x="150" y="156" width="${width - 300}" height="${height - 312}" rx="104" fill="none" stroke="url(#goldRose)" stroke-width="22"/>
      <rect x="198" y="214" width="${width - 396}" height="${height - 428}" rx="66" fill="none" stroke="${palette.roseGold}" stroke-width="8" opacity="0.78"/>
      <rect x="244" y="270" width="${width - 488}" height="${height - 540}" rx="42" fill="none" stroke="${palette.gold}" stroke-width="4" stroke-dasharray="14 18" opacity="0.46"/>
      ${cornerFlourish(178, 178, 140, false, false, palette.gold, 8)}
      ${cornerFlourish(width - 178, 178, 140, true, false, palette.gold, 8)}
      ${cornerFlourish(178, height - 178, 140, false, true, palette.roseGold, 8)}
      ${cornerFlourish(width - 178, height - 178, 140, true, true, palette.roseGold, 8)}
      ${sparkle(cx, 180, 38, palette.gold, 0.86)}
      ${sparkle(228, cy, 18, palette.roseGold, 0.62)}
      ${sparkle(width - 228, cy, 18, palette.gold, 0.62)}
      ${miniHeart(212, height - 230, 18, palette.rose, 0.42)}
      ${miniHeart(width - 212, 230, 18, palette.rose, 0.42)}
    </g>`
  );
}

function drawPhotoFrame(name: string, width: number, height: number) {
  const oval = name.includes("oval");
  const moon = name.includes("moon");
  const rx = oval ? 440 : 92;

  // Repeating small motif ring along outer border
  let outerMotifs = "";
  if (oval) {
    // Dots along the outer oval
    const motifCount = 32;
    for (let i = 0; i < motifCount; i++) {
      const a = (Math.PI * 2 * i) / motifCount;
      const mx = width / 2 + Math.cos(a) * 408;
      const my = height / 2 + Math.sin(a) * 566;
      const isAlt = i % 4 === 0;
      if (isAlt) {
        outerMotifs += sparkle(mx, my, 8, palette.gold, 0.45);
      } else {
        outerMotifs += `<circle cx="${mx}" cy="${my}" r="4" fill="${palette.roseGold}" opacity="0.4"/>`;
      }
    }
  } else {
    // Dots along the rectangular border
    const dotSpacing = 52;
    const bx = 156;
    const by = 156;
    const bw = width - 312;
    const bh = height - 312;
    for (let px = bx + dotSpacing; px < bx + bw; px += dotSpacing) {
      const isAlt = Math.round(px / dotSpacing) % 3 === 0;
      if (isAlt) {
        outerMotifs += sparkle(px, by, 7, palette.gold, 0.4);
        outerMotifs += sparkle(px, by + bh, 7, palette.gold, 0.4);
      } else {
        outerMotifs += `<circle cx="${px}" cy="${by}" r="3.5" fill="${palette.roseGold}" opacity="0.4"/>`;
        outerMotifs += `<circle cx="${px}" cy="${by + bh}" r="3.5" fill="${palette.roseGold}" opacity="0.4"/>`;
      }
    }
    for (let py = by + dotSpacing; py < by + bh; py += dotSpacing) {
      outerMotifs += `<circle cx="${bx}" cy="${py}" r="3.5" fill="${palette.roseGold}" opacity="0.4"/>`;
      outerMotifs += `<circle cx="${bx + bw}" cy="${py}" r="3.5" fill="${palette.roseGold}" opacity="0.4"/>`;
    }
  }

  // Additional inner decorative ring
  const innerDecoRing = oval
    ? `<ellipse cx="${width / 2}" cy="${height / 2}" rx="340" ry="496" fill="none" stroke="${palette.gold}" stroke-width="4" stroke-dasharray="14 18" opacity="0.35"/>`
    : `<rect x="218" y="222" width="${width - 436}" height="${height - 444}" rx="${rx * 0.5}" fill="none" stroke="${palette.gold}" stroke-width="4" stroke-dasharray="14 18" opacity="0.35"/>`;

  const outer = oval
    ? `<ellipse cx="${width / 2}" cy="${height / 2}" rx="438" ry="598" fill="none" stroke="url(#goldRose)" stroke-width="28" filter="url(#gentleShadow)"/>
       <ellipse cx="${width / 2}" cy="${height / 2}" rx="394" ry="554" fill="none" stroke="${palette.gold}" stroke-width="4" stroke-dasharray="12 16" opacity="0.4"/>
       <ellipse cx="${width / 2}" cy="${height / 2}" rx="374" ry="532" fill="none" stroke="${palette.roseGold}" stroke-width="10"/>
       <!-- Top and Bottom large celestial stars -->
       <polygon points="${starPoints(width / 2, height / 2 - 598, 80, 24, 8)}" fill="${palette.ivory}" stroke="url(#goldRose)" stroke-width="6"/>
       <polygon points="${starPoints(width / 2, height / 2 + 598, 80, 24, 8)}" fill="${palette.ivory}" stroke="url(#goldRose)" stroke-width="6"/>
       <!-- Side crescent moons framing the oval -->
       <path d="M${width / 2 - 438} ${height / 2 - 80} A 100 100 0 0 0 ${width / 2 - 438} ${height / 2 + 80} A 70 70 0 0 1 ${width / 2 - 438} ${height / 2 - 80}" fill="${palette.gold}"/>
       <path d="M${width / 2 + 438} ${height / 2 - 80} A 100 100 0 0 1 ${width / 2 + 438} ${height / 2 + 80} A 70 70 0 0 0 ${width / 2 + 438} ${height / 2 - 80}" fill="${palette.gold}"/>`
    : `<rect x="130" y="126" width="${width - 260}" height="${height - 252}" rx="${rx}" fill="none" stroke="url(#goldRose)" stroke-width="28" filter="url(#gentleShadow)"/>
       <rect x="184" y="188" width="${width - 368}" height="${height - 376}" rx="${rx * 0.68}" fill="none" stroke="${palette.roseGold}" stroke-width="10"/>`;

  return svg(
    width,
    height,
    `${outer}
    ${innerDecoRing}
    ${outerMotifs}
    ${moon ? `<mask id="frameMoon"><rect width="${width}" height="${height}" fill="white"/><circle cx="${width / 2 + 42}" cy="230" r="76" fill="black"/></mask><circle cx="${width / 2 - 20}" cy="248" r="92" fill="${palette.ivory}" stroke="${palette.gold}" stroke-width="10" mask="url(#frameMoon)"/>` : `<polygon points="${starPoints(width / 2, 170, 74, 28, 8)}" fill="url(#goldRose)"/>`}
    ${sparkle(210, 250, 28)}
    ${sparkle(width - 210, 250, 28, palette.roseGold, 0.84)}
    ${sparkle(210, height - 250, 24, palette.gold, 0.78)}
    ${sparkle(width - 210, height - 250, 24, palette.roseGold, 0.78)}
    <!-- Corner mini-hearts -->
    ${miniHeart(174, 174, 14, palette.rose, 0.4)}
    ${miniHeart(width - 174, 174, 14, palette.rose, 0.4)}
    ${miniHeart(174, height - 174, 14, palette.rose, 0.4)}
    ${miniHeart(width - 174, height - 174, 14, palette.rose, 0.4)}`
  );
}

/* ─── ENHANCED: drawLoadingCard ─── */
function drawLoadingCard(name: string, width: number, height: number) {
  const alt = name.endsWith("_02");
  const cx = width / 2;
  const cy = height / 2;
  const margin = width * 0.08;

  // Additional celestial rings around the central motif
  const celestialRing1 = `<circle cx="${cx}" cy="${cy}" r="${width * 0.28}" fill="none" stroke="${alt ? palette.gold : palette.roseGold}" stroke-width="5" stroke-dasharray="16 20" opacity="0.4"/>`;
  const celestialRing2 = `<circle cx="${cx}" cy="${cy}" r="${width * 0.34}" fill="none" stroke="${alt ? palette.roseGold : palette.gold}" stroke-width="3" stroke-dasharray="8 14" opacity="0.3"/>`;

  // Small orbiting star accents
  let orbitStars = "";
  const orbitR = width * 0.31;
  const orbitCount = 8;
  for (let i = 0; i < orbitCount; i++) {
    const a = (Math.PI * 2 * i) / orbitCount;
    const ox = cx + Math.cos(a) * orbitR;
    const oy = cy + Math.sin(a) * orbitR;
    orbitStars += sparkle(ox, oy, i % 2 === 0 ? 12 : 8, i % 3 === 0 ? palette.gold : palette.roseGold, 0.5);
  }

  // Dot chain around inner frame
  const innerX = margin * 2.2;
  const innerY = margin * 2.2;
  const innerW = width - margin * 4.4;
  const innerH = height - margin * 4.4;
  const dots = dotChain(innerX, innerY, innerW, innerH, width * 0.003, width * 0.03, alt ? palette.gold : palette.roseGold, 0.35);

  // Thin ornamental lines above and below the swoop
  const ornLine1 = `<path d="M${cx - 250} ${cy + 380} H${cx + 250}" stroke="${alt ? palette.gold : palette.rose}" stroke-width="4" stroke-linecap="round" opacity="0.35"/>`;
  const ornLine2 = `<path d="M${cx - 200} ${cy + 400} H${cx + 200}" stroke="${alt ? palette.roseGold : palette.gold}" stroke-width="3" stroke-linecap="round" opacity="0.25"/>`;

  return svg(
    width,
    height,
    `${cardBase(width, height, alt ? palette.navy : palette.ivory, alt ? palette.gold : "url(#goldRose)")}
    ${dots}
    ${celestialRing2}
    ${celestialRing1}
    ${orbitStars}
    <circle cx="${cx}" cy="${cy}" r="${width * 0.22}" fill="${alt ? palette.charcoal : palette.blush}" stroke="url(#goldRose)" stroke-width="18"/>
    <polygon points="${starPoints(cx, cy, width * 0.16, width * 0.054, 8)}" fill="${alt ? palette.ivory : palette.navy}" opacity="0.92"/>
    <polygon points="${starPoints(cx, cy, width * 0.08, width * 0.03, 12)}" fill="${alt ? palette.gold : palette.roseGold}" opacity="0.35"/>
    ${ornLine1}${ornLine2}
    ${miniStars(width, height, 34)}`
  );
}

function drawStarburst(width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  let rays = "";
  for (let i = 0; i < 32; i++) {
    const angle = (Math.PI * 2 * i) / 32;
    const long = i % 2 === 0;
    const r1 = long ? 98 : 144;
    const r2 = long ? 520 : 394;
    rays += `<line x1="${cx + Math.cos(angle) * r1}" y1="${cy + Math.sin(angle) * r1}" x2="${cx + Math.cos(angle) * r2}" y2="${cy + Math.sin(angle) * r2}" stroke="url(#goldRose)" stroke-width="${long ? 18 : 10}" stroke-linecap="round" opacity="${long ? 0.8 : 0.52}"/>`;
  }
  return svg(
    width,
    height,
    `<circle cx="${cx}" cy="${cy}" r="560" fill="url(#softGlow)"/>
    ${rays}
    <circle cx="${cx}" cy="${cy}" r="112" fill="${palette.ivory}" stroke="url(#goldRose)" stroke-width="18" filter="url(#gentleShadow)"/>
    <polygon points="${starPoints(cx, cy, 78, 28, 8)}" fill="${palette.rose}"/>`
  );
}

function drawGlowPanel(width: number, height: number) {
  return svg(
    width,
    height,
    `<rect x="84" y="88" width="${width - 168}" height="${height - 176}" rx="120" fill="url(#softGlow)"/>
    <rect x="132" y="132" width="${width - 264}" height="${height - 264}" rx="86" fill="${palette.ivory}" fill-opacity="0.72" stroke="url(#goldRose)" stroke-width="14" filter="url(#gentleShadow)"/>
    ${sparkle(230, 212, 28)}
    ${sparkle(width - 230, height - 212, 28, palette.roseGold, 0.82)}
    ${sparkle(width / 2, height / 2, 22, palette.gold, 0.7)}`
  );
}

async function main() {
  const root = process.cwd();
  const publicRoot = path.join(root, "public", "assets");
  const manifest: Record<string, string[]> = {};

  for (const asset of assets) {
    const svgText = drawAsset(asset);
    const sourceDir = path.join(publicRoot, "sources", asset.category);
    const outputDir = path.join(publicRoot, asset.category);
    await mkdir(sourceDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });

    const sourcePath = path.join(sourceDir, `${asset.name}.svg`);
    const pngPath = path.join(outputDir, `${asset.name}.png`);
    await writeFile(sourcePath, svgText, "utf8");

    const resvg = new Resvg(svgText, {
      fitTo: { mode: "width", value: asset.width },
      font: { loadSystemFonts: true }
    });
    const pngData = resvg.render().asPng();
    await writeFile(pngPath, pngData);

    manifest[asset.category] ??= [];
    manifest[asset.category].push(`/assets/${asset.category}/${asset.name}.png`);
  }

  await writeFile(
    path.join(publicRoot, "asset-manifest.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), assets: manifest }, null, 2),
    "utf8"
  );

  console.log(`Generated ${assets.length} SVG sources and PNG assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
