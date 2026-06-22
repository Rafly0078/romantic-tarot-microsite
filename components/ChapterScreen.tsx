"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Chapter, ChapterAccent, TarotReveal } from "@/data/chapters";
import { assetPaths } from "@/data/assets";
import { getWhatsAppUrl } from "@/data/siteConfig";
import { AssetImage } from "./AssetImage";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
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

/** Accent → hex pair (text gradient stops) + soft tint for ambient glows */
const ACCENT: Record<ChapterAccent, { a: string; b: string; tint: string }> = {
  gold:     { a: "#ffe8cc", b: "#cfa15f", tint: "rgba(207,161,95,0.10)" },
  roseGold: { a: "#ffe0d0", b: "#d99a8b", tint: "rgba(217,154,139,0.10)" },
  lavender: { a: "#e4dcf0", b: "#b8a9c9", tint: "rgba(184,169,201,0.12)" },
  blush:    { a: "#ffe6ec", b: "#f4c3ca", tint: "rgba(244,195,202,0.10)" }
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: EASE_SMOOTH },
});

/** Inset corner ticks — reusable hairline detail */
function CornerTicks({ inset = 8, size = 12 }: { inset?: number; size?: number }) {
  const base = "absolute border-[#cfa15f]/25 pointer-events-none";
  return (
    <>
      <span className={`${base} border-l border-t rounded-tl`} style={{ left: inset, top: inset, width: size, height: size }} />
      <span className={`${base} border-r border-t rounded-tr`} style={{ right: inset, top: inset, width: size, height: size }} />
      <span className={`${base} border-l border-b rounded-bl`} style={{ left: inset, bottom: inset, width: size, height: size }} />
      <span className={`${base} border-r border-b rounded-br`} style={{ right: inset, bottom: inset, width: size, height: size }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED — Cosmic star field background
   ═══════════════════════════════════════════════════════ */
// 16 stars (down from 26) — each node has its own CSS animation layer; fewer = better mobile perf
const STARS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${(i * 47 + 5) % 94}%`,
  top: `${(i * 61 + 7) % 92}%`,
  size: 1 + (i % 4) * 0.55,
  duration: `${2.5 + (i % 3) * 1.4}s`,
  delay: `${(i * 0.55) % 3.5}s`,
  opacity: 0.18 + (i % 5) * 0.08,
}));

function StarField({ accent }: { accent: ChapterAccent }) {
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
        style={{ background: ACCENT[accent].tint }}
      />
      <div
        className="absolute -left-24 bottom-[18%] h-52 w-52 rounded-full blur-3xl"
        style={{ background: "rgba(207,161,95,0.04)" }}
      />
    </div>
  );
}

/** Oversized roman numeral watermark behind the chapter */
function Watermark({ roman }: { roman: string }) {
  return (
    <div className="chapter-watermark" aria-hidden="true">
      {roman}
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
        <StarField accent={chapter.accent} />
        <Watermark roman={chapter.roman} />

        <ChapterNav chapter={chapter} index={index} total={total} onPrevious={onPrevious} onJump={onJump} />

        <section className="relative z-10 flex flex-1 flex-col gap-3 py-2">
          {chapter.id === "arrival"             && <Ch1EnvelopeTeardown chapter={chapter} />}
          {chapter.id === "bracelet"            && <Ch2LunarAltar chapter={chapter} />}
          {chapter.id === "feeling-cards"       && <Ch3Constellation chapter={chapter} />}
          {chapter.id === "photo-spell"         && <Ch4PhotoTriptych chapter={chapter} />}
          {chapter.id === "kept-softly"         && <Ch5Letterbox chapter={chapter} />}
          {chapter.id === "matching-thread"     && <Ch6TwinPair chapter={chapter} />}
          {chapter.id === "three-photo-reasons" && <Ch7NumberedList chapter={chapter} />}
          {chapter.id === "final-gift"          && <Ch8CurtainCall chapter={chapter} />}

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
   CH I — "Sealed Envelope Teardown"
   Archetype: single dominant object + mechanical reveal.
   Envelope front; flap opens on mount → letter slides up out of it
   carrying eyebrow+title; photo peeks from the slot. Wax seal (badge) pops.
   ═══════════════════════════════════════════════════════ */
function Ch1EnvelopeTeardown({ chapter }: { chapter: Chapter }) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <ChapterHeaderInline chapter={chapter} />

      <div className="relative mx-auto w-[88%] max-w-[20rem]">
        {/* Ambient pedestal glow */}
        <div className="absolute inset-x-[-12%] bottom-[-6%] h-1/2 rounded-[50%] blur-2xl"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(207,161,95,0.18) 0%, transparent 70%)" }} />

        {/* Envelope body — vertical, sealed front */}
        <motion.div
          className="relative mx-auto aspect-[3/4.2] w-full rounded-[1rem] border border-[#cfa15f]/22 keyline-frame overflow-hidden"
          style={{ background: "linear-gradient(165deg, rgba(28,20,40,0.92) 0%, rgba(18,12,28,0.96) 100%)" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH, delay: 0.12 }}
        >
          <CornerTicks inset={10} size={14} />

          {/* Letter sliding up from behind, carrying eyebrow + title */}
          <motion.div
            className="absolute inset-[12%] bottom-auto top-[14%] z-10 rounded-[0.7rem] border border-[#cfa15f]/30 px-3 py-3 text-center"
            style={{ background: "linear-gradient(180deg, rgba(254,246,232,0.97) 0%, rgba(245,228,200,0.93) 100%)" }}
            initial={{ y: "55%", opacity: 0 }}
            animate={{ y: "-10%", opacity: 1 }}
            transition={{ duration: 1.05, ease: EASE_SMOOTH, delay: 0.5 }}
          >
            <span className="eyebrow-caps block text-[0.55rem] text-[#a67c42]/80">{chapter.eyebrow}</span>
            <span className="mt-1 block font-display text-[1.15rem] font-bold leading-tight tracking-[0.06em] text-[#5a3f1d] uppercase">
              {chapter.title}
            </span>
            <div className="mx-auto mt-1.5 flex w-[60%] items-center gap-1.5">
              <div className="h-px flex-1 bg-[#a67c42]/30" />
              <SparkleIcon size={6} color="#a67c42" />
              <div className="h-px flex-1 bg-[#a67c42]/30" />
            </div>
          </motion.div>

          {/* Envelope flap — top triangle that opens on mount */}
          <motion.div
            className="absolute inset-x-0 top-0 z-30 origin-top"
            style={{ transformStyle: "preserve-3d" }}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: 178 }}
            transition={{ duration: 0.85, ease: EASE_SMOOTH, delay: 0.25 }}
          >
            <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-10 w-full">
              <path d="M0 0 L50 32 L100 0 Z" fill="rgba(20,14,30,0.96)" stroke="rgba(207,161,95,0.28)" strokeWidth="0.5" />
            </svg>
          </motion.div>

          {/* Wax seal — pops after flap opens */}
          <motion.div
            className="absolute left-1/2 top-3 z-20 h-12 w-12 -translate-x-1/2"
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: EASE_SMOOTH, delay: 1.1, type: "spring", stiffness: 220 }}
          >
            <AssetImage src={chapter.badgeAsset} alt="" className="h-full w-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
          </motion.div>

          {/* Photo peeking from the envelope slot at the bottom */}
          <motion.div
            className="absolute inset-x-[18%] bottom-[8%] z-20"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_SMOOTH, delay: 1.35 }}
          >
            <div className="aspect-[3/4] w-full">
              <PhotoPlaceholder
                frameAsset={chapter.photoFrameAsset ?? assetPaths.placeholders.moonPortrait}
                label={chapter.photoLabel ?? "foto kamu"}
                photoSrc={chapter.photoSrc}
                photoAlt={chapter.photoAlt}
                compact
              />
            </div>
          </motion.div>

          {/* Floating gift mascot */}
          <motion.div
            className="absolute -right-3 -bottom-3 h-12 w-12 z-30"
            animate={{ y: [0, -5, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <AssetImage src={chapter.heroAsset} alt="" className="h-full w-full object-contain drop-shadow-[0_3px_10px_rgba(207,161,95,0.4)]" />
          </motion.div>
        </motion.div>
      </div>

      <CopyPanel body={chapter.body} compact />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CH II — "Lunar Pedestal / Altar"
   Archetype: vertical light axis (monumental, symmetric).
   Full moon hangs top → light column descends → bracelet rests
   on a pedestal glow in the lower third. Horizontal museum plaque.
   ═══════════════════════════════════════════════════════ */
function Ch2LunarAltar({ chapter }: { chapter: Chapter }) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      {/* Header above the altar */}
      <div className="flex flex-col items-center text-center gap-0.5">
        <motion.p className="eyebrow-caps text-[#b8a9c9]" {...fadeUp(0.08)}>{chapter.eyebrow}</motion.p>
        <motion.h1
          className="font-display text-2xl font-bold tracking-[0.14em] uppercase bg-gradient-to-r from-[#e4dcf0] via-[#d4c5e0] to-[#b8a9c9] bg-clip-text text-transparent"
          {...fadeUp(0.14)}
        >
          {chapter.title}
        </motion.h1>
      </div>

      {/* Altar scene */}
      <motion.div
        className="relative mx-auto w-[86%] max-w-[18rem]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE_SMOOTH }}
      >
        {/* Full moon at top */}
        <motion.div
          className="relative mx-auto h-24 w-24"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-[-30%] rounded-full blur-2xl" style={{ background: "radial-gradient(circle, rgba(184,169,201,0.25) 0%, transparent 70%)" }} />
          <AssetImage src={assetPaths.celestial.moonFull} alt="" className="relative h-full w-full object-contain" />
        </motion.div>

        {/* Vertical light column */}
        <div className="pedestal-light mx-auto h-24 w-16 -mt-2" />

        {/* Pedestal + bracelet */}
        <motion.div
          className="relative mx-auto mt-1 w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE_SMOOTH, delay: 0.3 }}
        >
          {/* Pedestal glow disc */}
          <div className="mx-auto h-3 w-3/4 rounded-[50%] blur-md"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(184,169,201,0.35) 0%, transparent 70%)" }} />

          {/* Bracelet resting */}
          <motion.div
            className="relative mx-auto h-28 w-28"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <AssetImage src={chapter.heroAsset} alt="Bracelet" className="h-full w-full object-contain drop-shadow-[0_8px_22px_rgba(184,169,201,0.45)]" />
          </motion.div>

          {/* Pedestal base (thin gold ellipse) */}
          <div className="mx-auto mt-1 h-1 w-3/4 rounded-[50%]" style={{ background: "linear-gradient(to right, transparent, rgba(207,161,95,0.4), transparent)" }} />
        </motion.div>

        {/* Badge as small floating sigil — CSS spin, GPU-composited */}
        <div
          className="absolute -left-2 top-[42%] h-9 w-9"
          style={{ animation: "spin 60s linear infinite", willChange: "transform" }}
        >
          <AssetImage src={chapter.badgeAsset} alt="" aria-hidden className="h-full w-full object-contain opacity-55" />
        </div>
      </motion.div>

      {/* Horizontal museum plaque */}
      <motion.div
        className="relative mx-auto w-full rounded-[0.7rem] border border-[#b8a9c9]/22 keyline-frame"
        style={{ background: "linear-gradient(180deg, rgba(20,16,36,0.85) 0%, rgba(15,11,28,0.9) 100%)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.5 }}
      >
        <CornerTicks inset={6} size={9} />
        <p className="px-4 py-3 text-center font-accent text-[0.82rem] italic leading-relaxed text-[#d8cce4]/85">
          {chapter.subtitle}
        </p>
      </motion.div>

      <CopyPanel body={chapter.body} compact />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CH III — "Constellation Reading"
   Archetype: spatial relation between cards (connecting lines).
   3 feeling cards arranged as a triangle, gold constellation lines
   between them (drawn on mount). Tap a card → it orbits forward & flips.
   Familiar sits at center as conductor.
   ═══════════════════════════════════════════════════════ */
function Ch3Constellation({ chapter }: { chapter: Chapter }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cards = chapter.revealCards ?? [];

  // Triangle vertices double as the visible card anchor points.
  const POS = [
    { x: 50, y: 31, anchor: "bottom" as const },
    { x: 18, y: 71, anchor: "top" as const },
    { x: 82, y: 71, anchor: "top" as const },
  ];

  return (
    <div className="flex flex-1 flex-col gap-3">
      <ChapterHeaderInline chapter={chapter} />

      {/* Constellation stage */}
      <div className="relative mx-auto h-[280px] w-full max-w-[300px]">
        {/* Connection lines (SVG, drawn on mount) */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full pointer-events-none">
          <line x1={POS[0].x} y1={POS[0].y} x2={POS[1].x} y2={POS[1].y} stroke="#cfa15f" strokeWidth="0.25" className="constellation-line" style={{ "--draw-delay": "0.4s" } as React.CSSProperties} />
          <line x1={POS[1].x} y1={POS[1].y} x2={POS[2].x} y2={POS[2].y} stroke="#cfa15f" strokeWidth="0.25" className="constellation-line" style={{ "--draw-delay": "0.6s" } as React.CSSProperties} />
          <line x1={POS[2].x} y1={POS[2].y} x2={POS[0].x} y2={POS[0].y} stroke="#cfa15f" strokeWidth="0.25" className="constellation-line" style={{ "--draw-delay": "0.8s" } as React.CSSProperties} />
        </svg>

        {/* Familiar conductor at centroid */}
        <motion.div
          className="absolute z-0 h-14 w-14 -translate-x-1/2 -translate-y-1/2"
          style={{ left: "50%", top: "55%" }}
          animate={{ y: [0, -5, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <AssetImage src={chapter.heroAsset} alt="" className="h-full w-full object-contain opacity-80 drop-shadow-[0_3px_10px_rgba(207,161,95,0.35)]" />
        </motion.div>

        {/* The 3 constellation cards */}
        {cards.slice(0, 3).map((card, i) => {
          const pos = POS[i];
          const isSelected = selectedId === card.id;
          const isDimmed = selectedId !== null && !isSelected;
          return (
            <ConstellationCard
              key={card.id}
              card={card}
              index={i}
              pos={pos}
              anchor={pos.anchor}
              isSelected={isSelected}
              isDimmed={isDimmed}
              onTap={() => setSelectedId(isSelected ? null : card.id)}
            />
          );
        })}
      </div>

      {/* Reveal message panel */}
      <AnimatePresence mode="wait">
        {selectedId ? (
          <motion.div
            key={selectedId}
            className="cosmic-panel"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE_SMOOTH }}
          >
            <span className="cosmic-panel-inner" />
            <p className="text-center font-display text-[0.7rem] font-bold tracking-widest text-[#cfa15f] uppercase">
              {cards.find(c => c.id === selectedId)?.title}
            </p>
            <div className="mx-auto my-2 flex w-[40%] items-center gap-1.5">
              <div className="h-px flex-1 bg-[#cfa15f]/30" />
              <SparkleIcon size={5} color="#cfa15f" />
              <div className="h-px flex-1 bg-[#cfa15f]/30" />
            </div>
            <p className="text-center font-accent text-[0.92rem] leading-relaxed text-[#e8dfd0]/90">
              {cards.find(c => c.id === selectedId)?.message}
            </p>
          </motion.div>
        ) : (
          <CopyPanel body={chapter.body} compact />
        )}
      </AnimatePresence>

      {/* CSS breathe — no JS animation thread */}
      <p
        className="breathe text-center font-accent text-[0.78rem] text-[#cfa15f]/70"
        style={{ "--breathe-min": "0.35", "--breathe-max": "0.85", "--breathe-dur": "2.8s" } as React.CSSProperties}
      >
        {selectedId ? "tap bintang lagi untuk menutup ✦" : "✦ tap salah satu bintang ✦"}
      </p>
    </div>
  );
}

function ConstellationCard({
  card, index, pos, anchor, isSelected, isDimmed, onTap,
}: {
  card: TarotReveal;
  index: number;
  pos: { x: number; y: number };
  anchor: "top" | "bottom";
  isSelected: boolean;
  isDimmed: boolean;
  onTap: () => void;
}) {
  return (
    <div
      className="absolute z-10 h-0 w-0"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      <motion.span
        className="pointer-events-none absolute left-0 top-0 z-20 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.35, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 2 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
      >
        <SparkleIcon size={anchor === "bottom" ? 11 : 9} color={isSelected ? "#fff7ea" : "#cfa15f"} />
      </motion.span>

      <motion.button
        type="button"
        aria-label={`Reveal ${card.title}`}
        onClick={onTap}
        className="absolute grid h-20 w-[4.5rem] place-items-center rounded-[0.7rem] border border-[#cfa15f]/30 outline-none focus-visible:ring-2 focus-visible:ring-[#cfa15f]"
        style={{
          left: "-2.25rem",
          ...(anchor === "bottom" ? { bottom: 0 } : { top: 0 }),
          background: "linear-gradient(165deg, rgba(28,20,40,0.95) 0%, rgba(16,10,26,0.95) 100%)",
          boxShadow: isSelected ? "0 0 22px rgba(207,161,95,0.45), 0 8px 20px rgba(0,0,0,0.5)" : "0 6px 16px rgba(0,0,0,0.4)",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: isDimmed ? 0.4 : 1,
          scale: isSelected ? 1.14 : 1,
          y: isSelected ? (anchor === "bottom" ? -8 : 8) : 0,
        }}
        whileTap={{ scale: isSelected ? 1.06 : 0.94 }}
        transition={{ duration: 0.5, ease: EASE_SMOOTH, delay: index * 0.12 }}
      >
        <span
          className={`absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#cfa15f] shadow-[0_0_8px_rgba(207,161,95,0.85)] ${
            anchor === "bottom" ? "-bottom-[3px]" : "-top-[3px]"
          }`}
        />

        <span className="px-1 text-center font-display text-[0.55rem] font-bold leading-tight tracking-widest text-[#cfa15f]/80 uppercase">
          {card.title}
        </span>

        <span
          className={`absolute left-1/2 -translate-x-1/2 ${anchor === "bottom" ? "-top-2" : "-bottom-2"}`}
        >
          <SparkleIcon size={8} color="rgba(255,247,234,0.55)" />
        </span>
      </motion.button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CH IV — "Sequential Deck Draw"
   Archetype: one-at-a-time sequential reveal (vertical deck).
   Three photo cards stacked; tap top card → it slides up & flips,
   next becomes tappable. Counter shows 01 / 03. Wand mascot gestures.
   ═══════════════════════════════════════════════════════ */
function Ch4SequentialDeck({ chapter }: { chapter: Chapter }) {
  const cards = chapter.revealCards ?? [];
  const [drawnCount, setDrawnCount] = useState(0);
  const [flippedTop, setFlippedTop] = useState(false);

  const total = cards.length;
  const topIndex = drawnCount;
  const currentCard = cards[topIndex];

  function drawTop() {
    if (flippedTop) return;
    setFlippedTop(true);
    // After flip, if more cards remain, advance after a beat
    setTimeout(() => {
      if (drawnCount < total - 1) {
        setDrawnCount((c) => c + 1);
        setFlippedTop(false);
      }
    }, 1700);
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <ChapterHeaderInline chapter={chapter} />

      {/* Wand mascot + counter */}
      <div className="flex items-center justify-between px-1">
        <motion.div
          className="h-12 w-12"
          animate={{ rotate: flippedTop ? [0, -15, 0] : [0, 6, 0], y: [0, -4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <AssetImage src={chapter.heroAsset} alt="" className="h-full w-full object-contain drop-shadow-[0_3px_8px_rgba(207,161,95,0.4)]" />
        </motion.div>
        <div className="font-display text-sm tracking-[0.2em] text-[#d99a8b]/85">
          <span className="text-[#ffe8cc]">{String(Math.min(drawnCount + (flippedTop ? 0 : 1), total)).padStart(2, "0")}</span>
          <span className="text-[#d99a8b]/40"> / {String(total).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Deck stage */}
      <div className="relative mx-auto h-[20rem] w-[12rem]">
        {/* Cards beneath the top (the remaining stack) */}
        {[2, 1].map((offset) => {
          const idx = topIndex + offset;
          if (idx >= total) return null;
          return (
            <div
              key={idx}
              className="absolute inset-0 mx-auto h-[16rem] w-[10rem] rounded-[0.9rem] border border-[#cfa15f]/18 deck-card-shadow"
              style={{
                top: `${offset * 8}px`,
                left: `${offset * 4}px`,
                background: "linear-gradient(165deg, rgba(24,16,34,0.95) 0%, rgba(14,9,22,0.96) 100%)",
                opacity: 1 - offset * 0.25,
              }}
            >
              <AssetImage src={assetPaths.cards.back} alt="" aria-hidden className="h-full w-full object-cover opacity-50 rounded-[0.9rem]" />
              <div className="absolute inset-1.5 border border-[#cfa15f]/20 rounded-[0.7rem]" />
            </div>
          );
        })}

        {/* Top card (currently drawable) — slides up & flips on tap */}
        <AnimatePresence mode="wait">
          {currentCard && (
            <motion.div
              key={currentCard.id}
              className="absolute inset-0 mx-auto h-[16rem] w-[10rem]"
              style={{ perspective: "1200px" }}
              initial={{ y: 0, opacity: 1 }}
              animate={flippedTop && drawnCount < total - 1
                ? { y: -140, opacity: 0, transition: { duration: 0.5, delay: 1.2 } }
                : { y: 0, opacity: 1 }}
              exit={{ y: -140, opacity: 0, transition: { duration: 0.4 } }}
            >
              <motion.div
                className="relative h-full w-full cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flippedTop ? 180 : 0 }}
                transition={{ duration: 0.75, ease: EASE_SMOOTH }}
                onClick={drawTop}
              >
                {/* Back face */}
                <div className="backface-hidden absolute inset-0 overflow-hidden rounded-[0.9rem] border border-[#cfa15f]/28 deck-card-shadow" style={{ transform: "translate3d(0,0,0)" }}>
                  <AssetImage src={assetPaths.cards.back} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-90" />
                  <div className="absolute inset-1.5 border border-[#cfa15f]/30 rounded-[0.7rem]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      className="rounded-full border border-[#cfa15f]/50 bg-[#150f1f]/85 px-3 py-2 text-center backdrop-blur-sm"
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    >
                      <span className="block font-display text-[0.5rem] tracking-widest text-[#e8dfd0]/70 uppercase">draw</span>
                      <span className="block font-display text-base text-[#cfa15f]">✦</span>
                    </motion.span>
                  </div>
                </div>

                {/* Front face (photo) */}
                <div className="backface-hidden rotate-y-180 absolute inset-0 overflow-hidden rounded-[0.9rem] border border-[#cfa15f]/32 deck-card-shadow" style={{ transform: "rotateY(180deg) translate3d(0,0,0)" }}>
                  <AssetImage src={assetPaths.cards.frameFrontAlt} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,252,245,0.96) 0%, rgba(254,246,232,0.93) 60%, rgba(244,195,202,0.15) 100%)" }} />
                  <div className="absolute inset-1.5 border border-[#cfa15f]/40 rounded-[0.7rem]" />
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 px-2 text-center">
                    <span className="font-display text-[0.6rem] font-bold tracking-widest text-[#a67c42] uppercase">{currentCard.title}</span>
                    <div className="w-[58%]">
                      <PhotoPlaceholder
                        frameAsset={currentCard.photoFrameAsset ?? assetPaths.placeholders.clearPortrait}
                        label={currentCard.photoLabel ?? "foto"}
                        photoSrc={currentCard.photoSrc}
                        photoAlt={currentCard.photoAlt ?? currentCard.title}
                        compact
                      />
                    </div>
                    <p className="max-h-[2.4rem] overflow-hidden px-1 text-[0.5rem] font-medium leading-[1.25] text-[#2c2620]">{currentCard.message}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final card stays as photo front once all drawn */}
        {drawnCount === total - 1 && flippedTop && (
          <motion.div
            className="absolute inset-0 mx-auto h-[16rem] w-[10rem] rounded-[0.9rem] border border-[#cfa15f]/32 deck-card-shadow overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.3 }}
          >
            <AssetImage src={assetPaths.cards.frameFrontAlt} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,252,245,0.96) 0%, rgba(254,246,232,0.93) 60%, rgba(244,195,202,0.15) 100%)" }} />
            <div className="absolute inset-1.5 border border-[#cfa15f]/40 rounded-[0.7rem]" />
            {cards[total - 1] && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 px-2 text-center">
                <span className="font-display text-[0.6rem] font-bold tracking-widest text-[#a67c42] uppercase">{cards[total - 1].title}</span>
                <div className="w-[58%]">
                  <PhotoPlaceholder
                    frameAsset={cards[total - 1].photoFrameAsset ?? assetPaths.placeholders.clearPortrait}
                    label={cards[total - 1].photoLabel ?? "foto"}
                    photoSrc={cards[total - 1].photoSrc}
                    photoAlt={cards[total - 1].title}
                    compact
                  />
                </div>
                <p className="max-h-[2.4rem] overflow-hidden px-1 text-[0.5rem] font-medium leading-[1.25] text-[#2c2620]">{cards[total - 1].message}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <CopyPanel body={chapter.body} compact />

      {!flippedTop && (
        <p
          className="breathe text-center font-accent text-[0.72rem] text-[#cfa15f]/65"
          style={{ "--breathe-min": "0.35", "--breathe-max": "0.85", "--breathe-dur": "2.5s" } as React.CSSProperties}
        >
          ✦ tap kartu untuk membuka ✦
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CH V — "Cinematic Letterbox Still"
   Archetype: film title card (letterbox bars carry the text).
   Full-bleed photo with heavy top/bottom gradients. Title lives in
   the top bar (wide caps), subtitle in the bottom bar. Crescent moon
   accents a corner. No glass panel.
   ═══════════════════════════════════════════════════════ */
function Ch4PhotoTriptych({ chapter }: { chapter: Chapter }) {
  const cards = (chapter.revealCards ?? []).slice(0, 3);
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const total = cards.length;
  const openedCount = openIds.size;
  const focusedCard = cards.find((card) => card.id === focusedId);
  const layout = [
    { left: "50%", top: "0.4rem", rotate: -2, y: 0 },
    { left: "23%", top: "8.05rem", rotate: -8, y: 2 },
    { left: "77%", top: "8.05rem", rotate: 8, y: 2 },
  ];

  function toggleCard(cardId: string) {
    const isOpen = openIds.has(cardId);

    setOpenIds((prev) => {
      const next = new Set(prev);
      if (isOpen) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });

    setFocusedId(isOpen ? null : cardId);
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <ChapterHeaderInline chapter={chapter} />

      <div className="flex items-center justify-between px-1">
        <motion.div
          className="h-12 w-12"
          animate={{ rotate: focusedId ? [0, -12, 4, 0] : [0, 6, 0], y: [0, -4, 0] }}
          transition={{ duration: focusedId ? 1.25 : 2.1, repeat: Infinity, ease: "easeInOut" }}
        >
          <AssetImage src={chapter.heroAsset} alt="" className="h-full w-full object-contain drop-shadow-[0_3px_8px_rgba(207,161,95,0.4)]" />
        </motion.div>
        <div className="font-display text-sm tracking-[0.2em] text-[#d99a8b]/85">
          <span className="text-[#ffe8cc]">{String(openedCount).padStart(2, "0")}</span>
          <span className="text-[#d99a8b]/40"> / {String(total).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="relative mx-auto h-[18.8rem] w-full max-w-[19.25rem]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-[8%] h-[76%] w-[84%] opacity-70">
          <path
            d="M50 12 L18 72 L82 72 Z"
            fill="none"
            stroke="rgba(217,154,139,0.26)"
            strokeWidth="0.35"
            strokeDasharray="3 6"
          />
        </svg>

        <motion.div
          className="pointer-events-none absolute left-1/2 top-[47%] z-0 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d99a8b]/20 bg-[#160f20]/60"
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-2 rounded-full border border-[#cfa15f]/18" />
          <SparkleIcon size={12} color="#d99a8b" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>

        {cards.map((card, index) => {
          const position = layout[index] ?? layout[0];
          const isOpen = openIds.has(card.id);
          const isFocused = focusedId === card.id;
          const isDimmed = focusedId !== null && !isFocused;

          return (
            <PhotoFlipCard
              key={card.id}
              card={card}
              index={index}
              layout={position}
              isOpen={isOpen}
              isFocused={isFocused}
              isDimmed={isDimmed}
              onToggle={() => toggleCard(card.id)}
            />
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {focusedCard ? (
          <motion.div
            key={focusedCard.id}
            className="cosmic-panel"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.36, ease: EASE_SMOOTH }}
          >
            <span className="cosmic-panel-inner" />
            <p className="text-center font-display text-[0.7rem] font-bold tracking-widest text-[#d99a8b] uppercase">
              {focusedCard.title}
            </p>
            <p className="mt-2 text-center font-accent text-[0.9rem] leading-relaxed text-[#e8dfd0]/90">
              {focusedCard.message}
            </p>
          </motion.div>
        ) : (
          <CopyPanel body={chapter.body} compact />
        )}
      </AnimatePresence>

      <p
        className="breathe text-center font-accent text-[0.72rem] text-[#cfa15f]/65"
        style={{ "--breathe-min": "0.35", "--breathe-max": "0.85", "--breathe-dur": "2.5s" } as React.CSSProperties}
      >
        {openedCount === total ? "semua foto kecilnya sudah terbuka" : "tap kartu untuk membuka foto"}
      </p>
    </div>
  );
}

function PhotoFlipCard({
  card,
  index,
  layout,
  isOpen,
  isFocused,
  isDimmed,
  onToggle,
}: {
  card: TarotReveal;
  index: number;
  layout: { left: string; top: string; rotate: number; y: number };
  isOpen: boolean;
  isFocused: boolean;
  isDimmed: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      className="absolute h-[8.9rem] w-[5.9rem]"
      style={{
        left: layout.left,
        top: layout.top,
        marginLeft: "-2.95rem",
        perspective: "1100px",
        zIndex: isFocused ? 20 : 8 + index,
      }}
      initial={{ opacity: 0, y: 18, rotate: layout.rotate * 1.8, scale: 0.9 }}
      animate={{
        opacity: isDimmed ? 0.58 : 1,
        y: isFocused ? -10 : layout.y,
        rotate: isFocused ? 0 : layout.rotate,
        scale: isFocused ? 1.1 : isOpen ? 1.03 : 1,
      }}
      transition={{ duration: 0.55, ease: EASE_SMOOTH, delay: index * 0.08 }}
    >
      <button
        type="button"
        aria-pressed={isOpen}
        aria-label={`${isOpen ? "Tutup" : "Buka"} kartu ${card.title}`}
        onClick={onToggle}
        className="group relative h-full w-full rounded-[0.9rem] outline-none focus-visible:ring-2 focus-visible:ring-[#d99a8b]"
      >
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isOpen ? 180 : 0 }}
          transition={{ duration: 0.72, ease: EASE_SMOOTH }}
        >
          <div className="backface-hidden absolute inset-0 overflow-hidden rounded-[0.9rem] border border-[#cfa15f]/28 deck-card-shadow" style={{ transform: "translate3d(0,0,0)" }}>
            <AssetImage src={assetPaths.cards.back} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-95" />
            <div className="absolute inset-1.5 rounded-[0.7rem] border border-[#cfa15f]/30" />
            <div className="absolute inset-[13%] rounded-[0.65rem] border border-[#d99a8b]/18" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="grid h-11 w-11 place-items-center rounded-full border border-[#cfa15f]/50 bg-[#150f1f]/82 text-[#cfa15f] backdrop-blur-sm"
                animate={{ scale: [1, 1.06, 1], boxShadow: ["0 0 12px rgba(217,154,139,0.12)", "0 0 20px rgba(217,154,139,0.32)", "0 0 12px rgba(217,154,139,0.12)"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <SparkleIcon size={12} color="#d99a8b" />
              </motion.span>
            </div>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[0.45rem] tracking-[0.22em] text-[#ffe8cc]/55 uppercase">
              tap to open
            </span>
          </div>

          <div className="backface-hidden absolute inset-0 overflow-hidden rounded-[0.9rem] border border-[#d99a8b]/38 deck-card-shadow" style={{ transform: "rotateY(180deg) translate3d(0,0,0)" }}>
            <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 48%, rgba(255,252,245,0.98) 0%, rgba(254,246,232,0.94) 58%, rgba(244,195,202,0.2) 100%)" }} />
            <AssetImage src={assetPaths.cards.frameFrontAlt} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-95" />
            <div className="absolute inset-1.5 rounded-[0.7rem] border border-[#cfa15f]/38" />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 px-2 py-2 text-center">
              <span className="font-display text-[0.52rem] font-bold leading-tight tracking-widest text-[#a67c42] uppercase">
                {card.title}
              </span>
              <div className="w-[68%]">
                <PhotoPlaceholder
                  frameAsset={card.photoFrameAsset ?? assetPaths.placeholders.clearPortrait}
                  label={card.photoLabel ?? "foto"}
                  photoSrc={card.photoSrc}
                  photoAlt={card.photoAlt ?? card.title}
                  compact
                  className="w-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.14)]"
                />
              </div>
              <p className="max-h-[2.2rem] overflow-hidden px-1 text-[0.47rem] font-medium leading-[1.25] text-[#2c2620]">
                {card.message}
              </p>
            </div>
          </div>
        </motion.div>
      </button>
    </motion.div>
  );
}

function Ch5Letterbox({ chapter }: { chapter: Chapter }) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <motion.div
        className="relative mx-auto w-full overflow-hidden rounded-[1rem] border border-[#f4c3ca]/22 keyline-frame"
        style={{ aspectRatio: "4/5" }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE_SMOOTH }}
      >
        {/* Photo fill */}
        <div className="absolute inset-0">
          <PhotoPlaceholder
            frameAsset={chapter.photoFrameAsset ?? assetPaths.placeholders.clearPortrait}
            label={chapter.photoLabel ?? "foto favorit"}
            photoSrc={chapter.photoSrc}
            photoAlt={chapter.photoAlt}
            className="absolute inset-0 h-full w-full"
          />
        </div>

        {/* Heavy vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(8,6,18,0.65) 100%)" }} />

        {/* TOP letterbox bar — film title card */}
        <div className="letterbox-bar absolute inset-x-0 top-0 px-4 pb-8 pt-5 text-center" style={{ ["--letterbox-dir" as string]: "top" }}>
          <motion.span className="eyebrow-caps block text-[0.6rem] text-[#f4c3ca]/85" {...fadeUp(0.18)}>{chapter.eyebrow}</motion.span>
          <motion.h1
            className="mt-1.5 font-display text-[1.55rem] font-bold leading-tight tracking-[0.22em] uppercase bg-gradient-to-r from-[#ffe6ec] via-[#f4c3ca] to-[#d99a8b] bg-clip-text text-transparent"
            {...fadeUp(0.26)}
          >
            {chapter.title}
          </motion.h1>
        </div>

        {/* BOTTOM letterbox bar — subtitle */}
        <div className="letterbox-bar absolute inset-x-0 bottom-0 px-5 pb-5 pt-10 text-center">
          <motion.div className="mx-auto mb-2 flex w-[30%] items-center gap-1.5" {...fadeUp(0.34)}>
            <div className="h-px flex-1 bg-[#f4c3ca]/40" />
            <SparkleIcon size={6} color="#f4c3ca" />
            <div className="h-px flex-1 bg-[#f4c3ca]/40" />
          </motion.div>
          <motion.p className="font-accent text-[0.78rem] italic leading-relaxed text-[#ffe6ec]/85" {...fadeUp(0.4)}>
            {chapter.subtitle}
          </motion.p>
        </div>

        {/* Crescent moon accent top-right */}
        <motion.div
          className="absolute right-3 top-[14%] h-7 w-7"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <AssetImage src={assetPaths.celestial.moonCrescentAlt} alt="" className="h-full w-full object-contain" />
        </motion.div>

        {/* Badge sparkle top-left */}
        <div className="absolute left-3 top-[14%]">
          <AssetImage src={chapter.badgeAsset} alt="" aria-hidden className="h-8 w-8 object-contain opacity-55" />
        </div>
      </motion.div>

      <CopyPanel body={chapter.body} compact />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CH VI — "Twin Diptych / Connected Pair"
   Archetype: mirrored left/right with explicit connector.
   Two bracelets side by side, thin gold seam in the middle, a glowing
   thread pierces the seam linking them (pulses on tap). Copy split L/R.
   ═══════════════════════════════════════════════════════ */
function Ch6TwinPair({ chapter }: { chapter: Chapter }) {
  const [pulse, setPulse] = useState(false);

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex flex-col items-center text-center gap-0.5">
        <motion.p className="eyebrow-caps text-[#b8a9c9]" {...fadeUp(0.08)}>{chapter.eyebrow}</motion.p>
        <motion.h1
          className="font-display text-xl font-bold tracking-[0.14em] uppercase bg-gradient-to-r from-[#e4dcf0] via-[#d4c5e0] to-[#b8a9c9] bg-clip-text text-transparent"
          {...fadeUp(0.14)}
        >
          {chapter.title}
        </motion.h1>
      </div>

      {/* Twin stage */}
      <motion.div
        className="relative mx-auto grid w-[88%] max-w-[20rem] grid-cols-2 gap-0"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_SMOOTH, delay: 0.2 }}
        onClick={() => { if (!pulse) { setPulse(true); setTimeout(() => setPulse(false), 2000); } }}
      >
        {/* Left bracelet */}
        <div className="relative flex items-center justify-center py-4 pr-3">
          <motion.div
            className="h-24 w-24"
            animate={{ y: [0, -5, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <AssetImage src={chapter.heroAsset} alt="Bracelet" className="h-full w-full object-contain drop-shadow-[0_6px_16px_rgba(184,169,201,0.4)]" />
          </motion.div>
        </div>

        {/* Right bracelet (mirrored) */}
        <div className="relative flex items-center justify-center py-4 pl-3">
          <motion.div
            className="h-24 w-24"
            animate={{ y: [0, -5, 0], rotate: [1, -1, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <AssetImage src={chapter.heroAsset} alt="Bracelet" className="h-full w-full object-contain -scale-x-100 drop-shadow-[0_6px_16px_rgba(184,169,201,0.4)]" />
          </motion.div>
        </div>

        {/* Center gold seam */}
        <div className="pointer-events-none absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#cfa15f]/40 to-transparent" />

        {/* Connecting thread (horizontal glowing line through the seam) */}
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-1/2 h-10 w-full -translate-y-1/2">
          <path
            d="M0 20 Q50 5 100 20"
            fill="none"
            stroke="#cfa15f"
            strokeWidth={pulse ? 0.8 : 0.4}
            className="thread-line"
            style={{ opacity: pulse ? 1 : 0.7 }}
          />
          {/* Thread endpoints */}
          <circle cx="2" cy="20" r="0.9" fill="#ffe8cc" className="thread-line" />
          <circle cx="98" cy="20" r="0.9" fill="#ffe8cc" className="thread-line" />
        </svg>

        {/* Center sigil (badge) */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2"
          animate={pulse ? { scale: [1, 1.4, 1] } : { rotate: [0, 360] }}
          transition={pulse ? { duration: 1.6 } : { duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <AssetImage src={chapter.badgeAsset} alt="" aria-hidden className="h-full w-full object-contain opacity-70" />
        </motion.div>

        {/* Pulse halo */}
        <AnimatePresence>
          {pulse && (
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ border: "1px solid rgba(207,161,95,0.5)" }}
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <p
        className={`text-center font-accent text-[0.74rem] text-[#b8a9c9]/65 ${
          pulse ? "opacity-30" : "breathe"
        }`}
        style={{ "--breathe-min": "0.35", "--breathe-max": "0.8", "--breathe-dur": "2.6s" } as React.CSSProperties}
      >
        ✦ tap untuk menyalakan benangnya ✦
      </p>

      {/* Split copy L/R */}
      <div className="grid grid-cols-2 gap-2">
        {chapter.body.map((line, i) => (
          <motion.div
            key={i}
            className="cosmic-panel flex items-center justify-center px-2 py-3"
            initial={{ opacity: 0, y: 10, x: i === 0 ? -8 : 8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.55, ease: EASE_SMOOTH }}
          >
            <p className="font-accent text-[0.8rem] leading-relaxed text-[#e8dfd0]/90 text-center">{line}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CH VII — "Editorial Numbered List"
   Archetype: typography-led (oversized numerals).
   Three items stacked vertically, each: giant 01/02/03 + small photo
   thumb + one-line caption. Tap a number → expands to show photo full.
   ═══════════════════════════════════════════════════════ */
function Ch7NumberedList({ chapter }: { chapter: Chapter }) {
  const items = chapter.revealCards ?? [];
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-1 flex-col gap-2.5">
      <div className="flex items-baseline gap-3">
        <motion.div className="h-10 w-10 flex-shrink-0" {...fadeUp(0.06)}
          animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <AssetImage src={chapter.heroAsset} alt="" className="h-full w-full object-contain" />
        </motion.div>
        <div>
          <motion.p className="eyebrow-caps text-[#cfa15f]" {...fadeUp(0.08)}>{chapter.eyebrow}</motion.p>
          <motion.h1 className="font-display text-lg font-bold tracking-[0.12em] uppercase bg-gradient-to-r from-[#ffe8cc] to-[#cfa15f] bg-clip-text text-transparent leading-tight" {...fadeUp(0.14)}>
            {chapter.title}
          </motion.h1>
        </div>
      </div>

      <motion.p className="text-[0.78rem] italic text-[#c8bdd2]/70 px-2" {...fadeUp(0.2)}>{chapter.subtitle}</motion.p>

      {/* Numbered items */}
      <div className="flex flex-col gap-2">
        {items.slice(0, 3).map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="relative flex items-center gap-3 rounded-[0.8rem] border border-[#cfa15f]/20 px-3 py-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#cfa15f]"
              style={{ background: isOpen ? "linear-gradient(160deg, rgba(26,18,40,0.95) 0%, rgba(18,12,28,0.95) 100%)" : "linear-gradient(160deg, rgba(20,16,34,0.7) 0%, rgba(15,12,28,0.75) 100%)" }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.55, ease: EASE_SMOOTH }}
            >
              {/* Giant numeral */}
              <span className="editorial-number flex-shrink-0 w-[3rem] text-center">{String(i + 1).padStart(2, "0")}</span>

              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-display text-[0.78rem] font-bold tracking-widest text-[#ffe8cc] uppercase truncate">
                  {item.title}
                </span>
                <span className="font-accent text-[0.74rem] leading-snug text-[#e8dfd0]/70 line-clamp-2">
                  {item.message}
                </span>
              </div>

              {/* Thumb photo */}
              <div className="h-12 w-9 flex-shrink-0 overflow-hidden rounded-[0.35rem] border border-[#cfa15f]/25">
                <PhotoPlaceholder
                  frameAsset={item.photoFrameAsset ?? assetPaths.placeholders.clearOval}
                  label=""
                  photoSrc={item.photoSrc}
                  photoAlt={item.title}
                  compact
                  className="h-full w-full rounded-[0.35rem]"
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Expanded photo modal */}
      <AnimatePresence>
        {openIdx !== null && items[openIdx] && (
          <motion.div
            className="cosmic-panel flex flex-col items-center gap-2 py-4"
            initial={{ opacity: 0, height: 0, scale: 0.96 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: EASE_SMOOTH }}
          >
            <span className="cosmic-panel-inner" />
            <span className="editorial-number">{String(openIdx + 1).padStart(2, "0")}</span>
            <span className="font-display text-[0.7rem] font-bold tracking-widest text-[#cfa15f] uppercase">{items[openIdx].title}</span>
            <div className="w-[55%]">
              <PhotoPlaceholder
                frameAsset={items[openIdx].photoFrameAsset ?? assetPaths.placeholders.clearPortrait}
                label={items[openIdx].photoLabel ?? "foto"}
                photoSrc={items[openIdx].photoSrc}
                photoAlt={items[openIdx].title}
                compact
              />
            </div>
            <p className="px-3 text-center font-accent text-[0.8rem] leading-relaxed text-[#e8dfd0]/85">{items[openIdx].message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <CopyPanel body={chapter.body} compact />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CH VIII — "Theatrical Curtain Reveal"
   Archetype: ceremonial stage (curtain open + spotlight).
   Two curtain panels slide apart on mount, revealing the envelope
   gift center-stage under a spotlight cone. Tap → heart/sparkle burst.
   Oversized VIII watermark sits behind. Grand WhatsApp CTA.
   ═══════════════════════════════════════════════════════ */
function Ch8CurtainCall({ chapter }: { chapter: Chapter }) {
  const [burst, setBurst] = useState(false);

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex flex-col items-center text-center gap-0.5">
        <motion.p className="eyebrow-caps text-[#d99a8b]" {...fadeUp(0.08)}>{chapter.eyebrow}</motion.p>
        <motion.h1
          className="font-display text-[1.9rem] font-bold tracking-[0.18em] uppercase bg-gradient-to-r from-[#ffe8cc] via-[#f1d0a5] to-[#d99a8b] bg-clip-text text-transparent"
          {...fadeUp(0.14)}
        >
          {chapter.title}
        </motion.h1>
      </div>

      {/* Stage */}
      <motion.div
        className="relative mx-auto w-full max-w-[22rem] overflow-hidden rounded-[1rem] border border-[#d99a8b]/22 keyline-frame"
        style={{
          minHeight: "18rem",
          background: "radial-gradient(ellipse 80% 60% at 50% 35%, rgba(28,18,36,0.95) 0%, rgba(14,9,22,0.98) 70%, rgba(8,5,14,1) 100%)"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_SMOOTH }}
      >
        {/* Spotlight cone */}
        <div className="spotlight-cone" />

        {/* Center envelope (revealed) */}
        <motion.div
          className="relative z-10 mx-auto flex h-full min-h-[16rem] flex-col items-center justify-center gap-3 px-4"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE_SMOOTH, delay: 0.85 }}
          onClick={() => { if (!burst) { setBurst(true); setTimeout(() => setBurst(false), 2500); } }}
        >
          {/* Envelope hero */}
          <motion.div
            className="h-32 w-32 cursor-pointer"
            animate={burst
              ? { y: [0, -20, 0], rotate: [0, -6, 6, -3, 0], scale: [1, 1.08, 1] }
              : { y: [0, -8, 0], rotate: [-1, 1, -1] }}
            transition={burst
              ? { duration: 1.6, ease: "easeInOut" }
              : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <AssetImage src={chapter.heroAsset} alt="Gift envelope" className="h-full w-full object-contain drop-shadow-[0_8px_26px_rgba(207,161,95,0.4)] select-none" />
          </motion.div>

          {/* Tap hint */}
          {!burst && (
            <p
              className="breathe font-accent text-[0.7rem] text-[#d99a8b]/55"
              style={{ "--breathe-min": "0.3", "--breathe-max": "0.7", "--breathe-dur": "2.5s" } as React.CSSProperties}
            >
              tap untuk pesan terakhir ✦
            </p>
          )}

          {/* Burst sparkles on tap */}
          {burst && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-50"
              initial={{ opacity: 1 }} animate={{ opacity: 0 }}
              transition={{ duration: 1.8 }}
            >
              {[[-10, 20, 22, "#d99a8b"], [80, 15, 26, "#cfa15f"], [18, 70, 18, "#fff7ea"], [72, 65, 20, "#f4c3ca"], [50, 8, 16, "#d99a8b"]].map(([l, t, sz, c], i) => (
                <motion.div key={i} className="absolute"
                  style={{ left: `${l}%`, top: `${t}%` }}
                  initial={{ scale: 0.3, opacity: 1, y: 0 }}
                  animate={{ scale: [0.3, 1.6], opacity: [1, 0], y: [0, -30 - i * 8] }}
                  transition={{ duration: 1.4, delay: i * 0.08, ease: "easeOut" }}>
                  <SparkleIcon size={sz as number} color={c as string} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Photo card bottom-right */}
        {chapter.photoFrameAsset && (
          <motion.div
            className="absolute bottom-3 right-3 z-20 w-[28%]"
            initial={{ rotate: 10, opacity: 0, x: 16 }}
            animate={{ rotate: 5, opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.8, ease: EASE_SMOOTH }}
          >
            <PhotoPlaceholder
              frameAsset={chapter.photoFrameAsset}
              label={chapter.photoLabel ?? "foto terakhir"}
              photoSrc={chapter.photoSrc}
              photoAlt={chapter.photoAlt}
              compact
              className="drop-shadow-[0_6px_18px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        )}

        {/* Curtains — slide apart on mount */}
        <motion.div
          className="curtain-panel absolute inset-y-0 left-0 z-30 w-1/2 border-r border-[#cfa15f]/15"
          initial={{ x: "0%" }}
          animate={{ x: "-101%" }}
          transition={{ duration: 1.1, ease: EASE_SMOOTH, delay: 0.35 }}
        >
          {/* Tassel */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <AssetImage src={assetPaths.decor.ribbon} alt="" aria-hidden className="h-16 w-5 object-contain opacity-60" />
          </div>
        </motion.div>
        <motion.div
          className="curtain-panel absolute inset-y-0 right-0 z-30 w-1/2 border-l border-[#cfa15f]/15"
          initial={{ x: "0%" }}
          animate={{ x: "101%" }}
          transition={{ duration: 1.1, ease: EASE_SMOOTH, delay: 0.35 }}
        >
          <div className="absolute left-1 top-1/2 -translate-y-1/2 -scale-x-100">
            <AssetImage src={assetPaths.decor.ribbonAlt} alt="" aria-hidden className="h-16 w-5 object-contain opacity-60" />
          </div>
        </motion.div>

        {/* Top ribbon valance */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-3" style={{ background: "linear-gradient(to bottom, rgba(8,5,14,0.95), transparent)" }} />
      </motion.div>

      <CopyPanel body={chapter.body} compact />

      <motion.div className="text-center" {...fadeUp(0.5)}>
        <p className="font-accent text-[0.72rem] italic text-[#b8a9c9]/45">
          ━━ all magic delivered with care ━━
        </p>
      </motion.div>
    </div>
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
      <CornerTicks inset={8} size={14} />
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
   SHARED — Inline chapter header (eyebrow · title · subtitle)
   ═══════════════════════════════════════════════════════ */
function ChapterHeaderInline({ chapter }: { chapter: Chapter }) {
  const a = ACCENT[chapter.accent];
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <motion.p className="eyebrow-caps" style={{ color: a.b }} {...fadeUp(0.08)}>{chapter.eyebrow}</motion.p>
      <motion.h1
        className="font-display text-[1.65rem] sm:text-[1.85rem] font-bold leading-snug tracking-[0.14em] uppercase bg-gradient-to-r px-2"
        style={{ backgroundImage: `linear-gradient(to right, ${a.a}, ${a.b})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
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
   ICONS
   ═══════════════════════════════════════════════════════ */
function WaIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="flex-shrink-0">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
