"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Chapter, ChapterKind } from "@/data/chapters";
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
   ANIMATION PRESETS
   ═══════════════════════════════════════════════════════ */
const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

const staggerChild = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: EASE_SMOOTH }
});

/* ═══════════════════════════════════════════════════════
   COSMIC BACKGROUND — Constellation dots & ambient glow
   ═══════════════════════════════════════════════════════ */
const CONSTELLATION_STARS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 31 + 5) % 94}%`,
  top: `${(i * 47 + 8) % 92}%`,
  size: 1.2 + (i % 4) * 0.6,
  delay: `${(i * 0.5) % 4}s`,
  duration: `${2.5 + (i % 3) * 1.5}s`,
  opacity: 0.2 + (i % 5) * 0.08,
}));

function CosmicBackground({ chapterIndex }: { chapterIndex: number }) {
  const glowColors = [
    "rgba(207, 161, 95, 0.06)",     // gold
    "rgba(184, 169, 201, 0.07)",     // lavender
    "rgba(217, 154, 139, 0.06)",     // rose-gold
    "rgba(196, 111, 130, 0.05)",     // rose
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Constellation stars */}
      {CONSTELLATION_STARS.map((s) => (
        <span
          key={s.id}
          className="twinkle-star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            backgroundColor: "#fff7ea",
            boxShadow: `0 0 ${s.size * 3}px rgba(255,247,234,0.4)`,
            opacity: s.opacity,
            "--twinkle-duration": s.duration,
            "--twinkle-delay": s.delay,
          } as React.CSSProperties}
        />
      ))}

      {/* Ambient glow blobs */}
      <div
        className="absolute -right-20 top-[15%] h-52 w-52 rounded-full blur-3xl"
        style={{ background: glowColors[chapterIndex] ?? glowColors[0] }}
      />
      <div
        className="absolute -left-24 bottom-[20%] h-56 w-56 rounded-full blur-3xl intro-glow-pulse"
        style={{ background: "rgba(207, 161, 95, 0.04)" }}
      />

      {/* Subtle celestial decorations */}
      <AssetImage src={assetPaths.celestial.moon} className="absolute -right-6 top-[18%] w-20 opacity-[0.08]" alt="" />
      <AssetImage src={assetPaths.celestial.stars} className="absolute left-2 top-[12%] w-14 opacity-[0.1]" alt="" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN CHAPTER SCREEN
   ═══════════════════════════════════════════════════════ */
export function ChapterScreen({
  chapter,
  index,
  total,
  onNext,
  onPrevious,
  onJump
}: ChapterScreenProps) {
  const isLast = index === total - 1;

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={chapter.id}
        className="chapter-shell"
        initial={{ opacity: 0, y: 20, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.985 }}
        transition={{ duration: 0.6, ease: EASE_SMOOTH }}
      >
        {/* Layer 0: Cosmic background with stars */}
        <CosmicBackground chapterIndex={index} />

        {/* Layer 1: Top navigation */}
        <ChapterNav
          chapter={chapter}
          index={index}
          total={total}
          onPrevious={onPrevious}
          onJump={onJump}
        />

        {/* Layer 2: Main content area */}
        <section className="relative z-10 flex flex-1 flex-col gap-4 py-3">
          {/* Header group */}
          <div className="flex flex-col items-center text-center space-y-2">
            <motion.p
              className="font-accent text-lg md:text-xl leading-none text-[#d99a8b] tracking-wider font-normal italic"
              {...staggerChild(0.08)}
            >
              {chapter.eyebrow}
            </motion.p>
            <motion.h1
              className="font-display text-[1.8rem] sm:text-3xl font-bold leading-snug tracking-[0.16em] bg-gradient-to-r from-[#ffe8cc] via-[#f1d0a5] to-[#d99a8b] bg-clip-text text-transparent uppercase text-center w-full px-2"
              {...staggerChild(0.14)}
            >
              {chapter.title}
            </motion.h1>
            <motion.p
              className="max-w-[22rem] text-sm md:text-base font-display italic leading-relaxed text-[#c8bdd2]/80 tracking-wide text-center mx-auto px-4"
              {...staggerChild(0.2)}
            >
              {chapter.subtitle}
            </motion.p>
          </div>

          {/* Gold divider */}
          <motion.div
            className="flex items-center justify-center gap-3 mx-auto w-full max-w-[180px]"
            {...staggerChild(0.22)}
          >
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#cfa15f]/40" />
            <SparkleIcon size={8} color="#cfa15f" />
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#cfa15f]/40" />
          </motion.div>

          {/* Chapter-specific content */}
          <motion.div {...staggerChild(0.26)} className="flex-1">
            {chapter.kind === "arrival" && <ArrivalContent chapter={chapter} />}
            {chapter.kind === "bracelet" && <BraceletContent chapter={chapter} />}
            {chapter.kind === "cards" && <CardsContent chapter={chapter} />}
            {chapter.kind === "closing" && <ClosingContent chapter={chapter} />}
          </motion.div>

          {/* CTA button */}
          <motion.div
            className="flex items-center justify-center pt-4 pb-2"
            {...staggerChild(0.34)}
          >
            {isLast ? (
              <TarotButton href={getWhatsAppUrl()}>
                <WhatsAppIcon />
                {chapter.ctaLabel}
              </TarotButton>
            ) : (
              <TarotButton onClick={onNext}>
                {chapter.ctaLabel}
              </TarotButton>
            )}
          </motion.div>
        </section>
      </motion.main>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════
   CHAPTER NAVIGATION — Tarot progress system (dark)
   ═══════════════════════════════════════════════════════ */
function ChapterNav({
  chapter,
  index,
  total,
  onPrevious,
  onJump
}: {
  chapter: Chapter;
  index: number;
  total: number;
  onPrevious: () => void;
  onJump: (index: number) => void;
}) {
  return (
    <header className="relative z-20 flex items-center justify-between gap-2 pb-2">
      {/* Back button */}
      <button
        type="button"
        onClick={onPrevious}
        disabled={index === 0}
        className="grid h-10 w-10 place-items-center rounded-full border border-[#cfa15f]/25 bg-[#150f1f]/80 text-[#e8dfd0] shadow-sm backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-30"
        aria-label="Previous chapter"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8.5 3L4.5 7L8.5 11" />
        </svg>
      </button>

      {/* Progress dots with connecting line */}
      <div className="relative flex min-w-0 flex-1 items-center justify-center">
        {/* Connecting Line */}
        <div className="absolute inset-x-8 top-1/2 h-[1px] -translate-y-1/2 bg-gradient-to-r from-[#cfa15f]/5 via-[#cfa15f]/25 to-[#cfa15f]/5 pointer-events-none" />
        
        <div className="relative flex items-center justify-center gap-2">
          {Array.from({ length: total }).map((_, dotIdx) => {
            const isActive = dotIdx === index;
            const isPast = dotIdx < index;
            
            return (
              <button
                key={dotIdx}
                type="button"
                aria-label={`Chapter ${dotIdx + 1}`}
                onClick={() => onJump(dotIdx)}
                className="group relative z-10 grid h-8 w-8 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {isActive ? (
                  /* Active: Glowing Gold Celestial Star */
                  <motion.div
                    layoutId="activeNavDot"
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-[#cfa15f] bg-[#150f1f] text-[#cfa15f] shadow-[0_0_12px_rgba(207,161,95,0.5)]"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                    </svg>
                  </motion.div>
                ) : (
                  /* Inactive: Star dot */
                  <div
                    className={`h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
                      isPast
                        ? "border-[#cfa15f] bg-[#cfa15f] shadow-[0_0_6px_rgba(207,161,95,0.3)]"
                        : "border-[#cfa15f]/25 bg-[#150f1f]/60"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Roman numeral badge */}
      <div className="flex h-10 min-w-[3.5rem] items-center justify-center rounded-full border border-[#cfa15f]/30 bg-[#150f1f]/85 backdrop-blur-sm">
        <span className="font-display text-lg font-bold text-[#ffe8cc]">
          {chapter.roman}
        </span>
        <SparkleIcon size={8} color="rgba(207, 161, 95, 0.5)" className="ml-0.5" />
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════
   CHAPTER I — THE ARRIVAL (Cosmic Scrapbook)
   ═══════════════════════════════════════════════════════ */
function ArrivalContent({ chapter }: { chapter: Chapter }) {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="space-y-5">
      {/* Scrapbook-style collage */}
      <div 
        className="relative mx-auto aspect-[4/5] w-[88%] max-w-[20rem] mt-2 mb-3 cursor-pointer"
        onClick={() => {
          if (!isClicked) {
            setIsClicked(true);
            setTimeout(() => setIsClicked(false), 2000);
          }
        }}
      >
        {/* Sparkle Burst Animation */}
        {isClicked && (
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none"
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <SparkleIcon size={24} color="#d99a8b" className="absolute top-[20%] left-[10%]" />
            <SparkleIcon size={32} color="#cfa15f" className="absolute top-[10%] right-[20%]" />
            <SparkleIcon size={28} color="#fff7ea" className="absolute bottom-[30%] left-[20%]" />
            <SparkleIcon size={20} color="#cfa15f" className="absolute bottom-[20%] right-[10%]" />
          </motion.div>
        )}

        {/* Photo placeholder (behind, tilted right) */}
        {chapter.photoFrameAsset && (
          <motion.div
            className="absolute right-0 top-[12%] w-[55%] z-0"
            initial={{ rotate: 8, x: 20, opacity: 0 }}
            animate={
              isClicked 
                ? { rotate: 12, x: 30, y: 10, opacity: 1 } 
                : { rotate: 5, x: 0, y: 0, opacity: 1 }
            }
            transition={{ duration: 0.8, delay: isClicked ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <PhotoPlaceholder
              frameAsset={chapter.photoFrameAsset}
              className="w-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        )}
        
        {/* Main tarot card (in front, tilted left) */}
        <motion.div
          className="relative z-10 w-[70%]"
          initial={{ rotate: -6, x: -20, opacity: 0 }}
          animate={
            isClicked 
              ? { rotate: 0, scale: 1.05, y: -10, opacity: 1 } 
              : { rotate: -2, x: 0, y: 0, scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <TarotHeroCard chapter={chapter} />
        </motion.div>

        {/* Ambient sparkle */}
        <div className="absolute right-[35%] top-[-2%] z-20 intro-sparkle-pulse">
          <SparkleIcon size={14} color="#cfa15f" />
        </div>
      </div>

      <CosmicCopyPanel body={chapter.body} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CHAPTER II — THE BRACELET (Cosmic Scrapbook)
   ═══════════════════════════════════════════════════════ */
function BraceletContent({ chapter }: { chapter: Chapter }) {
  const [isPulsing, setIsPulsing] = useState(false);

  return (
    <div className="space-y-4">
      {/* Bracelet display with ornate frame */}
      <div 
        className="relative mx-auto aspect-square w-[72%] max-w-[18rem] cursor-pointer"
        onClick={() => {
          if (!isPulsing) {
            setIsPulsing(true);
            setTimeout(() => setIsPulsing(false), 2000);
          }
        }}
      >
        {/* Pulse Glow Effect */}
        {isPulsing && (
          <motion.div 
            className="absolute inset-[15%] z-50 rounded-full bg-[#cfa15f]/30 blur-xl pointer-events-none"
            animate={{ opacity: [0, 0.8, 0, 0.8, 0], scale: [1, 1.2, 1, 1.2, 1] }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        )}

        {/* Ornate frame */}
        {chapter.frameAsset && (
          <AssetImage
            src={chapter.frameAsset}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-contain z-10"
          />
        )}

        {/* Concentric magical circle behind bracelet */}
        <div className="absolute inset-[10%] flex items-center justify-center opacity-20 pointer-events-none select-none z-0">
          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" className="text-[#cfa15f] intro-ring" style={{ "--ring-duration": "60s" } as React.CSSProperties}>
            <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="100" cy="100" r="76" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Golden elliptical orbit path */}
        <div className="absolute inset-[16%] flex items-center justify-center opacity-30 pointer-events-none select-none z-0">
          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" className="text-[#cfa15f]">
            <ellipse cx="100" cy="100" rx="72" ry="72" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" />
          </svg>
        </div>

        {/* Floating bracelet */}
        <motion.div
          className="absolute inset-[14%]"
          animate={
            isPulsing 
              ? { scale: [1, 1.1, 1], rotate: 0 } 
              : { y: [0, -8, 0], rotate: [-0.5, 0.5, -0.5] }
          }
          transition={
            isPulsing 
              ? { duration: 1.2, ease: "easeInOut" } 
              : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <AssetImage
            src={chapter.heroAsset}
            alt="Decorative bracelet symbol"
            className="h-full w-full object-contain drop-shadow-[0_4px_16px_rgba(207,161,95,0.3)]"
          />
        </motion.div>

        {/* Orbiting sparkles */}
        <motion.div
          className="absolute inset-[15%]"
          animate={{ rotate: isPulsing ? [0, 720] : [0, 360] }}
          transition={{ duration: isPulsing ? 1.5 : 12, repeat: Infinity, ease: "linear" }}
        >
          <SparkleIcon size={10} color="#cfa15f" className="absolute left-1/2 -top-2 -translate-x-1/2" />
          <SparkleIcon size={8} color="#d99a8b" className="absolute right-0 top-1/2 -translate-y-1/2" />
        </motion.div>

        {/* Soft glow */}
        <div
          className="absolute inset-[20%] -z-10 rounded-full blur-2xl"
          style={{
            background: "radial-gradient(circle, rgba(207, 161, 95, 0.1) 0%, transparent 70%)"
          }}
        />
      </div>

      <CosmicCopyPanel body={chapter.body} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CHAPTER III — FEELING CARDS (Cosmic Scrapbook)
   ═══════════════════════════════════════════════════════ */
function CardsContent({ chapter }: { chapter: Chapter }) {
  return (
    <div className="space-y-4 flex flex-col items-center">
      {/* Mascot + intro text */}
      <div className="flex flex-col items-center gap-2.5 w-full">
        {/* Floating Mascot */}
        <motion.div
          className="w-20 h-20 relative z-10"
          animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <AssetImage
            src={chapter.heroAsset}
            alt="Mascot familiar"
            className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(207,161,95,0.3)] select-none"
          />
          {/* Sparkle next to mascot */}
          <div className="absolute -top-1 -right-1 intro-sparkle-pulse">
            <SparkleIcon size={10} color="#cfa15f" />
          </div>
        </motion.div>
        
        {/* Copy panel */}
        <CosmicCopyPanel body={chapter.body} className="w-full" compact />
      </div>

      {/* Interactive tarot cards */}
      {chapter.revealCards && (
        <div className="w-full pt-1">
          <InteractiveTarotCards cards={chapter.revealCards} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CHAPTER IV — CLOSING (Cosmic Scrapbook)
   ═══════════════════════════════════════════════════════ */
function ClosingContent({ chapter }: { chapter: Chapter }) {
  const [isFlapping, setIsFlapping] = useState(false);

  return (
    <div className="space-y-3">
      {/* Hero & Photo Collage */}
      <div 
        className="flex items-center justify-center gap-4 mt-2 mb-1 cursor-pointer"
        onClick={() => {
          if (!isFlapping) {
            setIsFlapping(true);
            setTimeout(() => setIsFlapping(false), 2000);
          }
        }}
      >
        {/* Winged envelope hero */}
        <div className="relative aspect-square w-[45%] max-w-[10rem]">
          {/* Hearts Burst */}
          {isFlapping && (
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
              initial={{ opacity: 1, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -70, scale: 1.6 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <span className="absolute -left-8 -top-4 text-2xl text-[#c56f82] drop-shadow-sm select-none">❤</span>
              <span className="absolute left-6 -top-10 text-xl text-[#f4c3ca] drop-shadow-sm select-none">❤</span>
              <span className="absolute left-10 top-2 text-3xl text-[#cfa15f] drop-shadow-sm select-none">❤</span>
              <span className="absolute -left-3 -top-12 text-sm text-[#d99a8b] drop-shadow-sm select-none">❤</span>
            </motion.div>
          )}

          <motion.div
            className="absolute inset-0 z-10"
            animate={
              isFlapping 
                ? { rotate: [0, -18, 18, -18, 18, -18, 18, 0], y: [0, -18, -18, -18, 0], scale: 1.05 } 
                : { y: [0, -8, 0], rotate: [-2, 2, -2] }
            }
            transition={
              isFlapping 
                ? { duration: 1.5, ease: "easeInOut" } 
                : { duration: 4.4, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <AssetImage
              src={chapter.heroAsset}
              alt="Decorative winged envelope"
              className="h-full w-full object-contain drop-shadow-[0_4px_16px_rgba(207,161,95,0.3)] select-none"
            />
          </motion.div>

          {/* Sparkle trail */}
          <div className="absolute -right-2 top-1/4 z-20 intro-sparkle-pulse">
            <SparkleIcon size={12} color="rgba(207, 161, 95, 0.5)" />
          </div>
          <div className="absolute -left-1 bottom-1/3 z-20 intro-sparkle-pulse" style={{ animationDelay: "0.6s" }}>
            <SparkleIcon size={8} color="rgba(217, 154, 139, 0.4)" />
          </div>
        </div>

        {/* Photo placeholder */}
        {chapter.photoFrameAsset && (
          <motion.div
            className="w-[38%] max-w-[8rem] relative z-0"
            initial={{ rotate: 8, x: 15 }}
            animate={{ rotate: 4, x: 0 }}
            transition={{ duration: 1 }}
          >
            <PhotoPlaceholder
              frameAsset={chapter.photoFrameAsset}
              className="w-full drop-shadow-[0_6px_20px_rgba(0,0,0,0.4)]"
              label="foto kamu ✦"
            />
          </motion.div>
        )}
      </div>

      <CosmicCopyPanel body={chapter.body} compact />

      {/* Closing note */}
      <motion.div
        className="mx-auto max-w-[18rem] text-center pt-1"
        {...staggerChild(0.5)}
      >
        {/* Celestial divider */}
        <div className="flex items-center justify-center gap-2 mb-3.5 opacity-50 pointer-events-none select-none">
          <div className="h-[0.5px] w-8 bg-gradient-to-r from-transparent to-[#cfa15f]" />
          <span className="text-[6px] text-[#cfa15f]">✦</span>
          <div className="h-[0.5px] w-8 bg-gradient-to-l from-transparent to-[#cfa15f]" />
        </div>
        
        <p className="font-accent text-[0.8rem] leading-relaxed text-[#b8a9c9]/50">
          ━━ sent with a little bit of magic ━━
        </p>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED — Tarot Hero Card (dark themed)
   ═══════════════════════════════════════════════════════ */
function TarotHeroCard({ chapter }: { chapter: Chapter }) {
  return (
    <div className="relative aspect-[2/3]">
      {/* Card frame */}
      {chapter.frameAsset && (
        <AssetImage
          src={chapter.frameAsset}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover rounded-[14px]"
        />
      )}

      {/* Double gold border inner */}
      <div className="absolute inset-1.5 border border-[#cfa15f]/25 rounded-[12px] pointer-events-none" />
      <div className="absolute inset-[9px] border border-[#cfa15f]/10 rounded-[9px] pointer-events-none" />

      {/* Floating hero image */}
      <motion.div
        className="absolute inset-[18%] grid place-items-center z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <AssetImage
          src={chapter.heroAsset}
          alt="Decorative magical gift"
          className="h-full w-full object-contain drop-shadow-[0_4px_16px_rgba(207,161,95,0.3)] select-none"
        />
      </motion.div>

      {/* Glowing pulse behind hero */}
      <div className="absolute inset-[25%] bg-[#cfa15f]/8 blur-xl rounded-full -z-10 intro-glow-pulse pointer-events-none" />

      {/* Badge at bottom */}
      <AssetImage
        src={chapter.badgeAsset}
        alt=""
        aria-hidden="true"
        className="absolute -bottom-3 left-1/2 h-16 w-16 -translate-x-1/2 object-contain drop-shadow-xl z-20"
      />

      {/* Corner sparkles */}
      <SparkleIcon size={10} color="rgba(207, 161, 95, 0.35)" className="absolute -right-1 -top-1" />
      <SparkleIcon size={7} color="rgba(217, 154, 139, 0.3)" className="absolute -bottom-1 -left-1" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED — Cosmic Copy Panel (dark glassmorphism)
   ═══════════════════════════════════════════════════════ */
function CosmicCopyPanel({
  body,
  compact,
  className
}: {
  body: string[];
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={`cosmic-panel ${className ?? ""}`}>
      {/* Inner decorative border */}
      <span className="cosmic-panel-inner" />

      {/* Decorative gold corners */}
      <div className="absolute left-2 top-2 w-4 h-4 border-l border-t border-[#cfa15f]/20 rounded-tl-md pointer-events-none" />
      <div className="absolute right-2 top-2 w-4 h-4 border-r border-t border-[#cfa15f]/20 rounded-tr-md pointer-events-none" />
      <div className="absolute left-2 bottom-2 w-4 h-4 border-l border-b border-[#cfa15f]/20 rounded-bl-md pointer-events-none" />
      <div className="absolute right-2 bottom-2 w-4 h-4 border-r border-b border-[#cfa15f]/20 rounded-br-md pointer-events-none" />

      <div className={compact ? "space-y-2 px-1" : "space-y-3 px-2"}>
        {body.map((line, lineIdx) => (
          <motion.p
            key={`${line.slice(0, 20)}-${lineIdx}`}
            className={`${compact ? "text-[1rem]" : "text-[1.08rem] md:text-[1.18rem]"} relative font-accent font-normal leading-relaxed text-[#e8dfd0]/90 text-center`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + lineIdx * 0.1, duration: 0.5 }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BUTTON (dark themed)
   ═══════════════════════════════════════════════════════ */
function TarotButton({ onClick, href, children }: { onClick?: () => void; href?: string; children: React.ReactNode }) {
  const inner = (
    <>
      <AssetImage src={assetPaths.ui.buttonPrimary} className="absolute inset-0 w-full h-full object-fill opacity-95 drop-shadow-sm" alt="" />
      <span className="relative z-10 flex items-center justify-center gap-2 font-display font-semibold text-lg text-[#fff7ea] tracking-wide drop-shadow-md">
        {children}
      </span>
      <div className="absolute -right-2 -top-2 z-20 intro-sparkle-pulse">
        <SparkleIcon size={14} color="#cfa15f" />
      </div>
      <div className="absolute -left-1 -bottom-1 z-20 intro-sparkle-pulse" style={{ animationDelay: "1.2s" }}>
        <SparkleIcon size={8} color="#fff7ea" />
      </div>
    </>
  );

  const buttonClassName = "relative inline-flex items-center justify-center min-h-[4rem] w-full max-w-[20rem] mx-auto overflow-visible outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-[2rem] transition-transform hover:scale-[1.02] active:scale-[0.97]";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={buttonClassName}>
        {inner}
      </a>
    );
  }

  return (
    <motion.button
      type="button"
      className={buttonClassName}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {inner}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════
   INLINE SVG ICONS
   ═══════════════════════════════════════════════════════ */
function WhatsAppIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
