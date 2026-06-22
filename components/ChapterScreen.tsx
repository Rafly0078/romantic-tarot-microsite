"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Chapter } from "@/data/chapters";
import { assetPaths } from "@/data/assets";
import { getWhatsAppUrl } from "@/data/siteConfig";
import { AssetImage } from "./AssetImage";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { InteractiveTarotCards } from "./TarotCard";
import { SparkleIcon } from "./SparkleParticles";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */
type ChapterScreenProps = {
  chapter: Chapter;
  index: number;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
  onJump: (index: number) => void;
};

/* ═══════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════ */
const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: EASE_SMOOTH },
});

/* ═══════════════════════════════════════════════════════
   SHARED — Cosmic star field background
   ═══════════════════════════════════════════════════════ */
const STARS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 5) % 93}%`,
  top: `${(i * 53 + 7) % 91}%`,
  size: 1 + (i % 4) * 0.55,
  duration: `${2.5 + (i % 3) * 1.4}s`,
  delay: `${(i * 0.45) % 3.5}s`,
  opacity: 0.18 + (i % 5) * 0.08,
}));

const CHAPTER_GLOW = [
  "rgba(207,161,95,0.07)",   // Ch1 — gold
  "rgba(184,169,201,0.08)",  // Ch2 — lavender
  "rgba(217,154,139,0.07)",  // Ch3 — rose-gold
  "rgba(207,161,95,0.06)",   // Ch4 — gold
  "rgba(196,111,130,0.06)",  // Ch5 — rose
  "rgba(184,169,201,0.07)",  // Ch6 — lavender
  "rgba(207,161,95,0.06)",   // Ch7 — gold
  "rgba(217,154,139,0.08)",  // Ch8 — rose-gold
];

function StarField({ chapterIndex }: { chapterIndex: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {STARS.map((s) => (
        <span
          key={s.id}
          className="twinkle-star absolute block rounded-full bg-[#fff7ea]"
          style={{
            left: s.left, top: s.top,
            width: s.size, height: s.size,
            opacity: s.opacity,
            boxShadow: `0 0 ${s.size * 3}px rgba(255,247,234,0.35)`,
            "--twinkle-duration": s.duration,
            "--twinkle-delay": s.delay,
          } as React.CSSProperties}
        />
      ))}
      <div
        className="absolute -right-20 top-[12%] h-56 w-56 rounded-full blur-3xl"
        style={{ background: CHAPTER_GLOW[chapterIndex] ?? CHAPTER_GLOW[0] }}
      />
      <div
        className="absolute -left-24 bottom-[18%] h-52 w-52 rounded-full blur-3xl"
        style={{ background: "rgba(207,161,95,0.04)" }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED — Navigation header
   ═══════════════════════════════════════════════════════ */
function ChapterNav({
  chapter, index, total, onPrevious, onJump,
}: {
  chapter: Chapter; index: number; total: number;
  onPrevious: () => void; onJump: (i: number) => void;
}) {
  const compact = total > 5;
  return (
    <header className="relative z-20 flex items-center justify-between gap-2 pb-2">
      <button
        type="button" onClick={onPrevious} disabled={index === 0}
        className="grid h-10 w-10 place-items-center rounded-full border border-[#cfa15f]/25 bg-[#150f1f]/80 text-[#e8dfd0] backdrop-blur-sm transition-all focus-visible:outline-none disabled:opacity-30"
        aria-label="Previous chapter"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8.5 3L4.5 7L8.5 11" />
        </svg>
      </button>

      <div className="relative flex flex-1 items-center justify-center">
        <div className={`absolute ${compact ? "inset-x-1" : "inset-x-6"} top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#cfa15f]/20 to-transparent pointer-events-none`} />
        <div className={`relative flex items-center justify-center ${compact ? "gap-0.5" : "gap-1.5"}`}>
          {Array.from({ length: total }).map((_, di) => {
            const active = di === index;
            const past = di < index;
            return (
              <button
                key={di} type="button"
                aria-label={`Chapter ${di + 1}`}
                onClick={() => onJump(di)}
                className={`relative z-10 grid ${compact ? "h-6 w-6" : "h-8 w-8"} place-items-center rounded-full focus-visible:outline-none`}
              >
                {active ? (
                  <motion.div
                    layoutId="navDotActive"
                    className={`flex ${compact ? "h-5 w-5" : "h-6 w-6"} items-center justify-center rounded-full border border-[#cfa15f] bg-[#150f1f] text-[#cfa15f] shadow-[0_0_10px_rgba(207,161,95,0.5)]`}
                    transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  >
                    <svg width={compact ? "7" : "9"} height={compact ? "7" : "9"} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                    </svg>
                  </motion.div>
                ) : (
                  <div className={`${compact ? "h-2 w-2" : "h-2.5 w-2.5"} rounded-full border transition-all ${past ? "border-[#cfa15f] bg-[#cfa15f]" : "border-[#cfa15f]/25 bg-[#150f1f]/60"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex h-10 min-w-[3.25rem] items-center justify-center rounded-full border border-[#cfa15f]/30 bg-[#150f1f]/85 backdrop-blur-sm">
        <span className="font-display text-base font-bold text-[#ffe8cc]">{chapter.roman}</span>
        <SparkleIcon size={7} color="rgba(207,161,95,0.5)" className="ml-0.5" />
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED — CTA Button
   ═══════════════════════════════════════════════════════ */
function TarotButton({ onClick, href, children }: {
  onClick?: () => void; href?: string; children: React.ReactNode;
}) {
  const cls = "relative inline-flex items-center justify-center min-h-[3.75rem] w-full max-w-[18rem] mx-auto overflow-visible rounded-[2rem] outline-none focus-visible:ring-2 focus-visible:ring-[#cfa15f] transition-transform hover:scale-[1.02] active:scale-[0.97]";
  const inner = (
    <>
      <AssetImage src={assetPaths.ui.buttonPrimary} className="absolute inset-0 h-full w-full object-fill" alt="" />
      <span className="relative z-10 flex items-center gap-2 font-display font-semibold text-[1.05rem] text-[#fff7ea] tracking-wide drop-shadow-md">
        {children}
      </span>
      <span className="absolute -right-2 -top-2 z-20 intro-sparkle-pulse"><SparkleIcon size={13} color="#cfa15f" /></span>
    </>
  );
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>;
  return (
    <motion.button type="button" className={cls} onClick={onClick} whileTap={{ scale: 0.95 }}>
      {inner}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED — Glass copy panel
   ═══════════════════════════════════════════════════════ */
function CopyPanel({ body, compact, className }: {
  body: string[]; compact?: boolean; className?: string;
}) {
  return (
    <div className={`cosmic-panel relative ${className ?? ""}`}>
      <span className="cosmic-panel-inner" />
      <div className="absolute left-2 top-2 h-3.5 w-3.5 border-l border-t border-[#cfa15f]/18 rounded-tl pointer-events-none" />
      <div className="absolute right-2 top-2 h-3.5 w-3.5 border-r border-t border-[#cfa15f]/18 rounded-tr pointer-events-none" />
      <div className="absolute left-2 bottom-2 h-3.5 w-3.5 border-l border-b border-[#cfa15f]/18 rounded-bl pointer-events-none" />
      <div className="absolute right-2 bottom-2 h-3.5 w-3.5 border-r border-b border-[#cfa15f]/18 rounded-br pointer-events-none" />
      <div className={compact ? "space-y-1.5 px-1" : "space-y-2.5 px-2"}>
        {body.map((line, i) => (
          <motion.p
            key={i}
            className={`font-accent leading-relaxed text-[#e8dfd0]/90 text-center ${compact ? "text-[0.9rem]" : "text-[1rem] md:text-[1.08rem]"}`}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + i * 0.1, duration: 0.5 }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED — Gold sparkle divider
   ═══════════════════════════════════════════════════════ */
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-2 mx-auto max-w-[160px]">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#cfa15f]/35" />
      <SparkleIcon size={7} color="#cfa15f" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#cfa15f]/35" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED — Chapter header block
   ═══════════════════════════════════════════════════════ */
function ChapterHeader({ chapter }: { chapter: Chapter }) {
  return (
    <div className="flex flex-col items-center text-center space-y-1.5">
      <motion.p className="font-accent text-base italic text-[#d99a8b] tracking-wider" {...fadeUp(0.08)}>
        {chapter.eyebrow}
      </motion.p>
      <motion.h1
        className="font-display text-[1.7rem] sm:text-3xl font-bold leading-snug tracking-[0.14em] uppercase bg-gradient-to-r from-[#ffe8cc] via-[#f1d0a5] to-[#d99a8b] bg-clip-text text-transparent px-2"
        {...fadeUp(0.14)}
      >
        {chapter.title}
      </motion.h1>
      <motion.p
        className="max-w-[21rem] text-sm italic leading-relaxed text-[#c8bdd2]/75 tracking-wide px-4"
        {...fadeUp(0.2)}
      >
        {chapter.subtitle}
      </motion.p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN CHAPTER SCREEN — dispatches per chapter.id
   ═══════════════════════════════════════════════════════ */
export function ChapterScreen({
  chapter, index, total, onNext, onPrevious, onJump,
}: ChapterScreenProps) {
  const isLast = index === total - 1;
  const showWA = chapter.ctaLabel.toLowerCase().includes("whatsapp") || chapter.ctaLabel.toLowerCase().includes("buka hadiahnya");

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={chapter.id}
        className="chapter-shell"
        initial={{ opacity: 0, y: 22, scale: 0.983 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -22, scale: 0.983 }}
        transition={{ duration: 0.55, ease: EASE_SMOOTH }}
      >
        <StarField chapterIndex={index} />

        <ChapterNav chapter={chapter} index={index} total={total} onPrevious={onPrevious} onJump={onJump} />

        <section className="relative z-10 flex flex-1 flex-col gap-3 py-2">
          {chapter.id === "arrival"             && <Ch1GrandCard chapter={chapter} />}
          {chapter.id === "bracelet"            && <Ch2Orbital chapter={chapter} />}
          {chapter.id === "feeling-cards"       && <Ch3CardSpread chapter={chapter} />}
          {chapter.id === "photo-spell"         && <Ch4PolaroidStack chapter={chapter} />}
          {chapter.id === "kept-softly"         && <Ch5FullBleed chapter={chapter} />}
          {chapter.id === "matching-thread"     && <Ch6Diptych chapter={chapter} />}
          {chapter.id === "three-photo-reasons" && <Ch7Gallery chapter={chapter} />}
          {chapter.id === "final-gift"          && <Ch8Cinematic chapter={chapter} />}

          <motion.div className="flex justify-center pt-3 pb-1" {...fadeUp(0.4)}>
            {isLast || showWA ? (
              <TarotButton href={getWhatsAppUrl()}>
                <WaIcon />{chapter.ctaLabel}
              </TarotButton>
            ) : (
              <TarotButton onClick={onNext}>{chapter.ctaLabel}</TarotButton>
            )}
          </motion.div>
        </section>
      </motion.main>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════
   CH 1 — "Grand Tarot Card"
   Layout: Full-width portrait tarot card.
   Small photo polaroid overlapping from top-right.
   Badge hangs below. Copy panel underneath.
   ═══════════════════════════════════════════════════════ */
function Ch1GrandCard({ chapter }: { chapter: Chapter }) {
  const [burst, setBurst] = useState(false);

  return (
    <div className="flex flex-1 flex-col gap-3">
      <ChapterHeader chapter={chapter} />
      <GoldDivider />

      {/* ── Main collage ── */}
      <div
        className="relative mx-auto w-[86%] max-w-[19rem] cursor-pointer"
        onClick={() => { if (!burst) { setBurst(true); setTimeout(() => setBurst(false), 1800); } }}
      >
        {/* Burst sparkles */}
        {burst && (
          <motion.div className="absolute inset-0 z-50 pointer-events-none"
            initial={{ opacity: 1 }} animate={{ opacity: 0 }}
            transition={{ duration: 1.4 }}>
            {[[-12, 8, 20, "#cfa15f"], [80, -10, 26, "#d99a8b"], [20, 60, 16, "#fff7ea"], [70, 55, 18, "#cfa15f"]].map(([l, t, sz, c], i) => (
              <motion.div key={i} className="absolute pointer-events-none"
                style={{ left: `${l}%`, top: `${t}%` }}
                animate={{ scale: [0.4, 1.6], opacity: [1, 0] }}
                transition={{ duration: 1, delay: i * 0.1 }}>
                <SparkleIcon size={sz as number} color={c as string} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Small polaroid — top right, tilted */}
        {chapter.photoFrameAsset && (
          <motion.div
            className="absolute -right-3 -top-2 z-20 w-[42%]"
            initial={{ rotate: 9, opacity: 0, x: 16 }}
            animate={burst ? { rotate: 14, x: 20, y: -8 } : { rotate: 6, opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: EASE_SMOOTH }}
          >
            <PhotoPlaceholder
              frameAsset={chapter.photoFrameAsset}
              label={chapter.photoLabel ?? "foto kamu"}
              photoSrc={chapter.photoSrc}
              photoAlt={chapter.photoAlt}
              className="drop-shadow-[0_8px_22px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        )}

        {/* Main tarot card — tilted left, full height */}
        <motion.div
          className="relative aspect-[2/3] w-full z-10"
          initial={{ rotate: -4, opacity: 0 }}
          animate={burst ? { rotate: 0, scale: 1.04, y: -8 } : { rotate: -1.5, opacity: 1 }}
          transition={{ duration: 0.75, ease: EASE_SMOOTH }}
        >
          {chapter.frameAsset && (
            <AssetImage src={chapter.frameAsset} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover rounded-[14px]" />
          )}
          <div className="absolute inset-2 border border-[#cfa15f]/20 rounded-[11px] pointer-events-none" />
          <motion.div
            className="absolute inset-[22%] grid place-items-center"
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <AssetImage src={chapter.heroAsset} alt="" className="h-full w-full object-contain drop-shadow-[0_4px_18px_rgba(207,161,95,0.35)] select-none" />
          </motion.div>
          <div className="absolute inset-[28%] -z-10 rounded-full blur-2xl" style={{ background: "radial-gradient(circle, rgba(207,161,95,0.12) 0%, transparent 70%)" }} />
          {/* Badge */}
          <AssetImage src={chapter.badgeAsset} alt="" aria-hidden
            className="absolute -bottom-4 left-1/2 h-14 w-14 -translate-x-1/2 object-contain drop-shadow-xl z-20" />
          <SparkleIcon size={10} color="rgba(207,161,95,0.4)" className="absolute -right-1 -top-1" />
        </motion.div>
      </div>

      <CopyPanel body={chapter.body} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CH 2 — "Orbital Display"
   Layout: Magic circle in center. Bracelet floats inside.
   Copy text split left | right beside the circle.
   ═══════════════════════════════════════════════════════ */
function Ch2Orbital({ chapter }: { chapter: Chapter }) {
  const [pulse, setPulse] = useState(false);

  return (
    <div className="flex flex-1 flex-col gap-3">
      <ChapterHeader chapter={chapter} />
      <GoldDivider />

      {/* ── Orbital circle + bracelet ── */}
      <div
        className="relative mx-auto aspect-square w-[68%] max-w-[15rem] cursor-pointer"
        onClick={() => { if (!pulse) { setPulse(true); setTimeout(() => setPulse(false), 2000); } }}
      >
        {/* Glow ring */}
        {pulse && (
          <motion.div className="absolute inset-[10%] rounded-full bg-[#cfa15f]/20 blur-xl pointer-events-none z-50"
            animate={{ opacity: [0, 0.7, 0, 0.7, 0], scale: [1, 1.15, 1, 1.15, 1] }}
            transition={{ duration: 1.2 }} />
        )}
        {/* Frame */}
        {chapter.frameAsset && (
          <AssetImage src={chapter.frameAsset} alt="" aria-hidden className="absolute inset-0 h-full w-full object-contain z-10" />
        )}
        {/* SVG circles */}
        <div className="absolute inset-[8%] flex items-center justify-center opacity-25 pointer-events-none z-0">
          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" className="text-[#cfa15f]" style={{ animation: "spin 80s linear infinite" }}>
            <circle cx="100" cy="100" r="86" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="100" cy="100" r="78" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
            <circle cx="100" cy="100" r="62" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 6" />
          </svg>
        </div>
        {/* Floating bracelet */}
        <motion.div
          className="absolute inset-[18%] z-10"
          animate={pulse ? { scale: [1, 1.1, 1] } : { y: [0, -7, 0], rotate: [-0.5, 0.5, -0.5] }}
          transition={pulse ? { duration: 1.2 } : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <AssetImage src={chapter.heroAsset} alt="Bracelet" className="h-full w-full object-contain drop-shadow-[0_4px_14px_rgba(207,161,95,0.35)]" />
        </motion.div>
        {/* Orbiting sparkle ring */}
        <motion.div
          className="absolute inset-[12%]"
          animate={{ rotate: pulse ? [0, 720] : [0, 360] }}
          transition={{ duration: pulse ? 1.5 : 14, repeat: Infinity, ease: "linear" }}
        >
          <SparkleIcon size={9} color="#cfa15f" className="absolute left-1/2 -top-1.5 -translate-x-1/2" />
          <SparkleIcon size={7} color="#d99a8b" className="absolute right-0 top-1/2 -translate-y-1/2" />
          <SparkleIcon size={7} color="#b8a9c9" className="absolute bottom-0 left-1/2 -translate-x-1/2" />
          <SparkleIcon size={7} color="#cfa15f" className="absolute left-0 top-1/2 -translate-y-1/2" />
        </motion.div>
      </div>

      {/* ── Split copy: two small panels side by side ── */}
      <div className="grid grid-cols-2 gap-2">
        {chapter.body.map((line, i) => (
          <motion.div
            key={i}
            className="cosmic-panel flex items-center justify-center py-3 px-2"
            initial={{ opacity: 0, y: 10, x: i === 0 ? -10 : 10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.55, ease: EASE_SMOOTH }}
          >
            <p className="font-accent text-[0.82rem] leading-relaxed text-[#e8dfd0]/90 text-center">{line}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CH 3 — "Three Card Spread"
   Layout: Mascot floats above. Copy panel.
   Three interactive tarot cards fan below.
   ═══════════════════════════════════════════════════════ */
function Ch3CardSpread({ chapter }: { chapter: Chapter }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-3">
      {/* Mascot */}
      <div className="flex items-center gap-3">
        <motion.div
          className="relative h-16 w-16 flex-shrink-0"
          animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <AssetImage src={chapter.heroAsset} alt="Familiar" className="h-full w-full object-contain select-none drop-shadow-[0_3px_10px_rgba(207,161,95,0.3)]" />
          <span className="absolute -right-1 -top-1 intro-sparkle-pulse"><SparkleIcon size={9} color="#cfa15f" /></span>
        </motion.div>
        <div className="flex flex-col gap-1 min-w-0">
          <motion.p className="font-accent italic text-base text-[#d99a8b] tracking-wide" {...fadeUp(0.06)}>{chapter.eyebrow}</motion.p>
          <motion.h1 className="font-display text-xl font-bold tracking-[0.12em] uppercase bg-gradient-to-r from-[#ffe8cc] to-[#d99a8b] bg-clip-text text-transparent leading-snug" {...fadeUp(0.12)}>
            {chapter.title}
          </motion.h1>
        </div>
      </div>

      <motion.p className="text-sm italic text-[#c8bdd2]/70 text-center px-6 leading-relaxed" {...fadeUp(0.18)}>
        {chapter.subtitle}
      </motion.p>

      <CopyPanel body={chapter.body} compact className="w-full" />

      {chapter.revealCards && (
        <div className="w-full">
          <InteractiveTarotCards cards={chapter.revealCards} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CH 4 — "Polaroid Stack"
   Layout: Header. Wand mascot centered.
   Three overlapping polaroids stacked, tap to reveal one.
   ═══════════════════════════════════════════════════════ */
function Ch4PolaroidStack({ chapter }: { chapter: Chapter }) {
  const [revealed, setRevealed] = useState<number | null>(null);
  const cards = chapter.revealCards ?? [];

  const stackConfigs = [
    { rotate: -8, x: -44, y: 8, z: 0 },
    { rotate: 2, x: 0, y: 0, z: 10 },
    { rotate: 10, x: 44, y: 10, z: 0 },
  ];

  return (
    <div className="flex flex-1 flex-col gap-3">
      <ChapterHeader chapter={chapter} />
      <GoldDivider />

      {/* ── Wand mascot ── */}
      <motion.div
        className="mx-auto h-14 w-14"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: [0, -5, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", opacity: { duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1], repeat: 0 } }}
      >
        <AssetImage src={chapter.heroAsset} alt="" className="h-full w-full object-contain select-none drop-shadow-[0_2px_10px_rgba(207,161,95,0.3)]" />
      </motion.div>

      {/* ── Polaroid stack ── */}
      {revealed === null ? (
        <div className="relative mx-auto h-[18rem] w-[10rem] cursor-pointer">
          {cards.map((card, i) => {
            const cfg = stackConfigs[i] ?? stackConfigs[0];
            return (
              <motion.button
                key={card.id} type="button"
                aria-label={`Reveal card ${i + 1}`}
                className="absolute inset-0 w-full cursor-pointer rounded-[12px] outline-none"
                style={{ zIndex: cfg.z }}
                initial={{ rotate: cfg.rotate, x: cfg.x, y: cfg.y, opacity: 0 }}
                animate={{ rotate: cfg.rotate, x: cfg.x, y: cfg.y, opacity: 1 }}
                transition={{ delay: 0.1 * i, duration: 0.5, ease: EASE_SMOOTH }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRevealed(i)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[12px] border border-[#cfa15f]/25 bg-[#120e1f] shadow-[0_8px_28px_rgba(0,0,0,0.4)]">
                  <AssetImage src={assetPaths.cards.back} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      className="rounded-full border border-[#cfa15f]/50 bg-[#150f1f]/85 px-3 py-2 text-center backdrop-blur-sm"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <span className="block font-display text-[0.55rem] tracking-widest text-[#e8dfd0]/60 uppercase">tap</span>
                      <span className="block font-display text-sm font-bold text-[#cfa15f]">✦</span>
                    </motion.span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : (
        /* Revealed photo card */
        <AnimatePresence>
          <motion.div
            className="mx-auto w-[70%] max-w-[13rem]"
            initial={{ scale: 0.7, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.65, ease: EASE_SMOOTH }}
          >
            {cards[revealed] && (
              <div className="cosmic-panel flex flex-col items-center gap-3 py-4 text-center">
                <span className="font-display text-xs font-bold tracking-widest text-[#cfa15f] uppercase">{cards[revealed].title}</span>
                <div className="w-[60%]">
                  <PhotoPlaceholder
                    frameAsset={cards[revealed].photoFrameAsset ?? assetPaths.placeholders.tarotPortrait}
                    label={cards[revealed].photoLabel ?? "foto Ila"}
                    photoSrc={cards[revealed].photoSrc}
                    photoAlt={cards[revealed].photoAlt ?? cards[revealed].title}
                  />
                </div>
                <p className="font-accent text-[0.8rem] leading-relaxed text-[#e8dfd0]/80 px-2">{cards[revealed].message}</p>
                <button
                  type="button"
                  onClick={() => setRevealed(null)}
                  className="mt-1 font-accent text-[0.7rem] text-[#cfa15f]/60 underline underline-offset-2"
                >
                  ← kartu lain
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <CopyPanel body={chapter.body} compact />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CH 5 — "Full Bleed Memory"
   Layout: Large photo hero (full-width, rounded).
   Glassmorphism caption overlay at bottom.
   No hard card frame — intimate album feel.
   ═══════════════════════════════════════════════════════ */
function Ch5FullBleed({ chapter }: { chapter: Chapter }) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      {/* Slim header */}
      <div className="flex flex-col items-center text-center gap-0.5">
        <motion.p className="font-accent italic text-sm text-[#d99a8b] tracking-wider" {...fadeUp(0.06)}>{chapter.eyebrow}</motion.p>
        <motion.h1 className="font-display text-2xl font-bold tracking-[0.14em] uppercase bg-gradient-to-r from-[#ffe8cc] to-[#d99a8b] bg-clip-text text-transparent" {...fadeUp(0.12)}>
          {chapter.title}
        </motion.h1>
      </div>

      {/* ── Full-bleed photo ── */}
      <motion.div
        className="relative w-full overflow-hidden rounded-[1.25rem]"
        style={{ aspectRatio: "4/5" }}
        {...fadeUp(0.18)}
      >
        {/* Photo fill */}
        <div className="absolute inset-0 rounded-[1.25rem]"
          style={{ background: "radial-gradient(ellipse at 50% 35%, rgba(30,24,50,0.9) 0%, rgba(15,12,24,0.95) 100%)" }} />

        {/* Wand + photo combined */}
        <div className="absolute inset-[10%] flex flex-col items-center justify-center gap-4">
          <motion.div
            className="h-20 w-20"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <AssetImage src={chapter.heroAsset} alt="" className="h-full w-full object-contain select-none drop-shadow-[0_4px_16px_rgba(207,161,95,0.3)]" />
          </motion.div>
          {chapter.photoFrameAsset && (
            <div className="w-[55%]">
              <PhotoPlaceholder
                frameAsset={chapter.photoFrameAsset}
                label={chapter.photoLabel ?? "foto favorit"}
                photoSrc={chapter.photoSrc}
                photoAlt={chapter.photoAlt}
              />
            </div>
          )}
        </div>

        {/* Badge sparkle corner */}
        <div className="absolute right-3 top-3">
          <AssetImage src={chapter.badgeAsset} alt="" aria-hidden className="h-10 w-10 object-contain opacity-60" />
        </div>

        {/* Gradient caption overlay at bottom */}
        <div className="absolute bottom-0 inset-x-0 rounded-b-[1.25rem] px-4 pb-4 pt-10"
          style={{ background: "linear-gradient(to top, rgba(10,8,22,0.9) 0%, transparent 100%)" }}>
          <p className="font-accent text-[0.85rem] italic text-[#e8dfd0]/80 text-center leading-relaxed">{chapter.subtitle}</p>
        </div>
      </motion.div>

      <CopyPanel body={chapter.body} compact />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CH 6 — "Split Diptych"
   Layout: Screen split TOP / BOTTOM with gold line.
   Top half: Bracelet in cosmic frame.
   Bottom half: Copy panel with divider aesthetic.
   ═══════════════════════════════════════════════════════ */
function Ch6Diptych({ chapter }: { chapter: Chapter }) {
  const [glow, setGlow] = useState(false);

  return (
    <div className="flex flex-1 flex-col gap-0">
      {/* ── TOP HALF — bracelet orbital panel ── */}
      <motion.div
        className="relative flex flex-col items-center justify-center overflow-hidden rounded-t-[1.25rem] border border-b-0 border-[#cfa15f]/20 px-4 pb-5 pt-4"
        style={{ background: "linear-gradient(160deg, rgba(26,18,48,0.9) 0%, rgba(18,14,32,0.95) 100%)", minHeight: "16rem" }}
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.6, ease: EASE_SMOOTH }}
        onClick={() => { if (!glow) { setGlow(true); setTimeout(() => setGlow(false), 2200); } }}
      >
        {/* Eyebrow + title */}
        <div className="mb-3 text-center">
          <p className="font-accent italic text-sm text-[#d99a8b]/80 tracking-wider">{chapter.eyebrow}</p>
          <h1 className="font-display text-xl font-bold tracking-[0.14em] uppercase bg-gradient-to-r from-[#ffe8cc] to-[#d99a8b] bg-clip-text text-transparent">{chapter.title}</h1>
        </div>

        {/* ── Orbital scene — single square container, everything shares center ── */}
        <div className="relative h-36 w-36 flex-shrink-0">

          {/* Glow pulse on click */}
          {glow && (
            <motion.div
              className="absolute inset-0 rounded-full bg-[#b8a9c9]/18 blur-2xl pointer-events-none z-0"
              animate={{ opacity: [0, 0.8, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 1.6 }}
            />
          )}

          {/* Orbit rings — same size as container, perfectly centered */}
          <motion.svg
            className="absolute inset-0 h-full w-full text-[#b8a9c9] opacity-20 pointer-events-none"
            viewBox="0 0 144 144" fill="none"
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            style={{ originX: "50%", originY: "50%" }}
          >
            <circle cx="72" cy="72" r="68" stroke="currentColor" strokeWidth="0.9" strokeDasharray="5 5" />
          </motion.svg>

          <motion.svg
            className="absolute inset-0 h-full w-full text-[#cfa15f] opacity-15 pointer-events-none"
            viewBox="0 0 144 144" fill="none"
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ originX: "50%", originY: "50%" }}
          >
            <circle cx="72" cy="72" r="56" stroke="currentColor" strokeWidth="0.6" />
          </motion.svg>

          <svg
            className="absolute inset-0 h-full w-full text-[#cfa15f] opacity-10 pointer-events-none"
            viewBox="0 0 144 144" fill="none"
          >
            <circle cx="72" cy="72" r="42" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 6" />
          </svg>

          {/* Orbiting dots — rotate around the exact center (72, 72) */}
          {/* Outer orbit dot */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ originX: "50%", originY: "50%" }}
          >
            {/* dot sits at top-center of the 144px orbit circle (r=68 → top = 72-68 = 4px) */}
            <span
              className="absolute h-2 w-2 rounded-full bg-[#cfa15f] shadow-[0_0_6px_rgba(207,161,95,0.7)]"
              style={{ top: "4px", left: "calc(50% - 4px)" }}
            />
          </motion.div>

          {/* Inner orbit dot */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ originX: "50%", originY: "50%" }}
          >
            {/* r=56 → top = 72-56 = 16px */}
            <span
              className="absolute h-1.5 w-1.5 rounded-full bg-[#d99a8b] shadow-[0_0_5px_rgba(217,154,139,0.6)]"
              style={{ top: "16px", left: "calc(50% - 3px)" }}
            />
          </motion.div>

          {/* Bracelet — absolutely centered */}
          <motion.div
            className="absolute inset-[22%] z-10"
            animate={glow ? { scale: [1, 1.1, 1] } : { y: [0, -5, 0] }}
            transition={glow ? { duration: 1.2 } : { duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <AssetImage
              src={chapter.heroAsset}
              alt="Bracelet"
              className="h-full w-full object-contain drop-shadow-[0_4px_16px_rgba(184,169,201,0.45)]"
            />
          </motion.div>

          {/* Center glow */}
          <div
            className="absolute inset-[30%] -z-10 rounded-full blur-xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(184,169,201,0.18) 0%, transparent 70%)" }}
          />
        </div>
      </motion.div>

      {/* ── Gold divider line ── */}
      <div className="relative flex items-center justify-center h-6">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#cfa15f]/40 to-transparent" />
        <span className="relative z-10 bg-[#0a0816] px-3 text-[#cfa15f] text-[0.5rem]">✦ VI ✦</span>
      </div>

      {/* ── BOTTOM HALF — copy panel ── */}
      <motion.div
        className="overflow-hidden rounded-b-[1.25rem] border border-t-0 border-[#cfa15f]/20"
        style={{ background: "linear-gradient(160deg, rgba(15,12,28,0.92) 0%, rgba(18,14,34,0.95) 100%)" }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: EASE_SMOOTH }}
      >
        <div className="flex flex-col gap-3 p-4">
          <p className="font-accent italic text-[0.85rem] text-[#c8bdd2]/70 text-center leading-relaxed">{chapter.subtitle}</p>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#cfa15f]/20 to-transparent" />
          {chapter.body.map((line, i) => (
            <motion.p key={i} className="font-accent text-[0.9rem] leading-relaxed text-[#e8dfd0]/85 text-center"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.1, duration: 0.5 }}>
              {line}
            </motion.p>
          ))}
          <div className="flex justify-center">
            <AssetImage src={chapter.badgeAsset} alt="" aria-hidden className="h-10 w-10 object-contain opacity-50" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   CH 7 — "Gallery Grid"
   Layout: Mascot wand top-left with title inline.
   Photo grid: 1 large left + 2 small right (stacked).
   Tap any photo to see its caption.
   ═══════════════════════════════════════════════════════ */
function Ch7Gallery({ chapter }: { chapter: Chapter }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const cards = chapter.revealCards ?? [];

  return (
    <div className="flex flex-1 flex-col gap-3">
      {/* Inline header: mascot + title */}
      <div className="flex items-center gap-3">
        <motion.div className="h-12 w-12 flex-shrink-0" {...fadeUp(0.06)}
          animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <AssetImage src={chapter.heroAsset} alt="" className="h-full w-full object-contain select-none" />
        </motion.div>
        <div>
          <motion.p className="font-accent italic text-xs text-[#d99a8b]" {...fadeUp(0.08)}>{chapter.eyebrow}</motion.p>
          <motion.h1 className="font-display text-lg font-bold tracking-[0.12em] uppercase bg-gradient-to-r from-[#ffe8cc] to-[#d99a8b] bg-clip-text text-transparent leading-tight" {...fadeUp(0.14)}>
            {chapter.title}
          </motion.h1>
        </div>
      </div>

      <motion.p className="text-xs italic text-[#c8bdd2]/65 text-center px-4" {...fadeUp(0.2)}>{chapter.subtitle}</motion.p>

      {/* ── Photo grid layout ── */}
      {cards.length >= 3 ? (
        <motion.div className="grid grid-cols-5 gap-2" style={{ minHeight: "15rem" }} {...fadeUp(0.26)}>
          {/* Large left card */}
          <button
            type="button"
            className="col-span-3 row-span-2 relative overflow-hidden rounded-[12px] border border-[#cfa15f]/20 cursor-pointer outline-none"
            style={{ background: "rgba(20,16,34,0.8)" }}
            onClick={() => setActiveIdx(activeIdx === 0 ? null : 0)}
            aria-pressed={activeIdx === 0}
          >
            <PhotoPlaceholder
              frameAsset={cards[0].photoFrameAsset ?? assetPaths.placeholders.clearPortrait}
              label={cards[0].photoLabel ?? "foto"}
              photoSrc={cards[0].photoSrc}
              photoAlt={cards[0].title}
              className="absolute inset-0 h-full w-full rounded-[12px]"
            />
            <AnimatePresence>
              {activeIdx === 0 && (
                <motion.div
                  className="absolute inset-x-0 bottom-0 rounded-b-[12px] bg-[#0a0816]/85 px-2 py-2 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.3 }}
                >
                  <p className="font-display text-[0.6rem] font-bold tracking-widest text-[#cfa15f] uppercase">{cards[0].title}</p>
                  <p className="font-accent text-[0.65rem] leading-snug text-[#e8dfd0]/80 mt-0.5">{cards[0].message}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Two small right cards */}
          {[1, 2].map((idx) => (
            <button
              key={idx} type="button"
              className="col-span-2 relative overflow-hidden rounded-[10px] border border-[#cfa15f]/15 cursor-pointer outline-none"
              style={{ background: "rgba(20,16,34,0.8)", minHeight: "6rem" }}
              onClick={() => setActiveIdx(activeIdx === idx ? null : idx)}
              aria-pressed={activeIdx === idx}
            >
              <PhotoPlaceholder
                frameAsset={cards[idx]?.photoFrameAsset ?? assetPaths.placeholders.clearOval}
                label={cards[idx]?.photoLabel ?? "foto"}
                photoSrc={cards[idx]?.photoSrc}
                photoAlt={cards[idx]?.title}
                compact
                className="absolute inset-0 h-full w-full rounded-[10px]"
              />
              <AnimatePresence>
                {activeIdx === idx && (
                  <motion.div
                    className="absolute inset-x-0 bottom-0 rounded-b-[10px] bg-[#0a0816]/85 px-1.5 py-1.5 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.3 }}
                  >
                    <p className="font-accent text-[0.6rem] leading-snug text-[#e8dfd0]/80">{cards[idx]?.message}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </motion.div>
      ) : (
        /* fallback if fewer cards */
        <CopyPanel body={chapter.body} />
      )}

      <CopyPanel body={chapter.body} compact />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CH 8 — "Cinematic Closing"
   Layout: Envelope fills most of the screen.
   Photo floats overlaid, small.
   Minimal text. Grand WhatsApp CTA.
   ═══════════════════════════════════════════════════════ */
function Ch8Cinematic({ chapter }: { chapter: Chapter }) {
  const [wings, setWings] = useState(false);

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Minimal centered header */}
      <div className="text-center space-y-1 mt-1">
        <motion.p className="font-accent italic text-sm text-[#d99a8b] tracking-wider" {...fadeUp(0.06)}>{chapter.eyebrow}</motion.p>
        <motion.h1 className="font-display text-[2rem] font-bold tracking-[0.18em] uppercase bg-gradient-to-r from-[#ffe8cc] via-[#f1d0a5] to-[#d99a8b] bg-clip-text text-transparent" {...fadeUp(0.12)}>
          {chapter.title}
        </motion.h1>
      </div>

      {/* ── Cinematic envelope scene ── */}
      <motion.div
        className="relative mx-auto w-full max-w-[22rem] cursor-pointer"
        style={{ minHeight: "18rem" }}
        onClick={() => { if (!wings) { setWings(true); setTimeout(() => setWings(false), 2500); } }}
        {...fadeUp(0.18)}
      >
        {/* Heart burst */}
        {wings && (
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -80 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {["❤", "✦", "❤", "✦", "❤"].map((c, i) => (
              <motion.span key={i} className="absolute text-2xl select-none"
                style={{ left: `${(i - 2) * 22}px`, color: ["#c56f82","#cfa15f","#f4c3ca","#d99a8b","#fff7ea"][i] }}
                initial={{ y: 0, opacity: 1 }} animate={{ y: -50 - i * 15, opacity: 0 }}
                transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}>
                {c}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Glow aura */}
        <div className="absolute inset-[10%] rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, rgba(207,161,95,0.4) 0%, rgba(217,154,139,0.2) 60%, transparent 100%)" }} />

        {/* Envelope — centered hero */}
        <motion.div
          className="relative z-10 mx-auto h-48 w-48"
          animate={wings
            ? { rotate: [0, -12, 12, -10, 10, -6, 6, 0], y: [0, -25, -25, -25, 0], scale: [1, 1.08, 1.08, 1.08, 1] }
            : { y: [0, -10, 0], rotate: [-1.5, 1.5, -1.5] }
          }
          transition={wings
            ? { duration: 2, ease: "easeInOut" }
            : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <AssetImage src={chapter.heroAsset} alt="Winged envelope" className="h-full w-full object-contain drop-shadow-[0_8px_28px_rgba(207,161,95,0.35)] select-none" />
          <span className="absolute -right-2 top-3 intro-sparkle-pulse"><SparkleIcon size={14} color="#cfa15f" /></span>
          <span className="absolute -left-2 bottom-4 intro-sparkle-pulse" style={{ animationDelay: "0.8s" }}><SparkleIcon size={9} color="#d99a8b" /></span>
        </motion.div>

        {/* Photo card bottom-right, overlapping envelope */}
        {chapter.photoFrameAsset && (
          <motion.div
            className="absolute bottom-0 right-4 z-20 w-[32%]"
            initial={{ rotate: 10, opacity: 0, x: 16 }}
            animate={{ rotate: 6, opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: EASE_SMOOTH }}
          >
            <PhotoPlaceholder
              frameAsset={chapter.photoFrameAsset}
              label={chapter.photoLabel ?? "foto terakhir"}
              photoSrc={chapter.photoSrc}
              photoAlt={chapter.photoAlt}
              compact
              className="drop-shadow-[0_6px_20px_rgba(0,0,0,0.45)]"
            />
          </motion.div>
        )}

        {/* Hint to tap */}
        <motion.p
          className="absolute bottom-0 left-0 right-[40%] text-center font-accent text-[0.65rem] text-[#cfa15f]/40 select-none"
          animate={{ opacity: wings ? 0 : [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          tap envelope ✦
        </motion.p>
      </motion.div>

      {/* Copy + closing note */}
      <CopyPanel body={chapter.body} compact />
      <motion.div className="text-center" {...fadeUp(0.45)}>
        <p className="font-accent text-[0.72rem] italic text-[#b8a9c9]/45">
          ━━ all magic delivered with care ━━
        </p>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════ */
function WaIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="flex-shrink-0">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
