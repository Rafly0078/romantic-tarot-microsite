"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Chapter, ChapterKind } from "@/data/chapters";
import { assetPaths } from "@/data/assets";
import { getWhatsAppUrl } from "@/data/siteConfig";
import { AssetImage } from "./AssetImage";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { InteractiveTarotCards } from "./TarotCard";
import { FloatingDecor } from "./FloatingDecor";
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
        {/* Layer 0: Ambient background decorations */}
        <FloatingDecor chapterIndex={index} />
        <ChapterDecorations kind={chapter.kind} />

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
              className="font-accent text-lg md:text-xl leading-none text-rose tracking-wider font-normal italic"
              {...staggerChild(0.08)}
            >
              {chapter.eyebrow}
            </motion.p>
            <motion.h1
              className="font-display text-[1.8rem] sm:text-3xl font-bold leading-snug tracking-[0.16em] text-navy uppercase text-center w-full px-2"
              {...staggerChild(0.14)}
            >
              {chapter.title}
            </motion.h1>
            <motion.p
              className="max-w-[22rem] text-sm md:text-base font-display italic leading-relaxed text-charcoal/70 tracking-wide text-center mx-auto px-4"
              {...staggerChild(0.2)}
            >
              {chapter.subtitle}
            </motion.p>
          </div>

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
   CHAPTER NAVIGATION — Tarot progress system
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
        className="grid h-10 w-10 place-items-center rounded-full border border-gold/35 bg-ivory/80 text-navy shadow-sm backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-30"
        aria-label="Previous chapter"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8.5 3L4.5 7L8.5 11" />
        </svg>
      </button>

      {/* Progress dots with connecting line */}
      <div className="relative flex min-w-0 flex-1 items-center justify-center">
        {/* Connecting Line */}
        <div className="absolute inset-x-8 top-1/2 h-[1px] -translate-y-1/2 bg-gradient-to-r from-gold/10 via-gold/40 to-gold/10 border-t border-dashed border-gold/40 pointer-events-none" />
        
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
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-gold bg-navy text-gold shadow-[0_0_10px_rgba(207,161,95,0.45)]"
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
                        ? "border-gold bg-gold shadow-[0_0_4px_rgba(207,161,95,0.3)]"
                        : "border-gold/30 bg-ivory/50"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Roman numeral badge */}
      <div className="flex h-10 min-w-[3.5rem] items-center justify-center rounded-full border border-gold/40 bg-ivory/85 backdrop-blur-sm">
        <span className="font-display text-lg font-bold text-navy">
          {chapter.roman}
        </span>
        <SparkleIcon size={8} color="rgba(207, 161, 95, 0.5)" className="ml-0.5" />
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════
   CHAPTER I — THE ARRIVAL
   ═══════════════════════════════════════════════════════ */
function ArrivalContent({ chapter }: { chapter: Chapter }) {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="space-y-6">
      <div 
        className="relative mx-auto aspect-[4/5] w-[85%] max-w-[20rem] mt-2 mb-4 cursor-pointer"
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
            <SparkleIcon size={28} color="#f8f4ec" className="absolute bottom-[30%] left-[20%]" />
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
              className="w-full drop-shadow-xl"
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

        {/* Ambient sparkle for the collage */}
        <motion.div
          className="absolute right-[35%] top-[-2%] z-20"
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <SparkleIcon size={14} color="#cfa15f" />
        </motion.div>
      </div>
      <CopyPanel body={chapter.body} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CHAPTER II — THE BRACELET
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
            className="absolute inset-[15%] z-50 rounded-full bg-[#cfa15f]/40 blur-xl pointer-events-none"
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
        <div className="absolute inset-[10%] flex items-center justify-center opacity-25 pointer-events-none select-none z-0">
          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" className="text-[#cfa15f] animate-spin" style={{ animationDuration: '60s' }}>
            <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="100" cy="100" r="76" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Golden elliptical orbit path behind bracelet */}
        <div className="absolute inset-[16%] flex items-center justify-center opacity-40 pointer-events-none select-none z-0">
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
            className="h-full w-full object-contain drop-shadow-lg"
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
            background: "radial-gradient(circle, rgba(207, 161, 95, 0.15) 0%, transparent 70%)"
          }}
        />
      </div>

      <CopyPanel body={chapter.body} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CHAPTER III — FEELING CARDS
   ═══════════════════════════════════════════════════════ */
function CardsContent({ chapter }: { chapter: Chapter }) {
  return (
    <div className="space-y-4 flex flex-col items-center">
      {/* Mascot + intro text in a vertical stacked layout */}
      <div className="flex flex-col items-center gap-2.5 w-full">
        {/* Floating Mascot Centered */}
        <motion.div
          className="w-20 h-20 relative z-10"
          animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <AssetImage
            src={chapter.heroAsset}
            alt="Mascot familiar"
            className="w-full h-full object-contain drop-shadow-lg select-none"
          />
          {/* Tiny cute sparkle next to mascot */}
          <SparkleIcon size={10} color="#cfa15f" className="absolute -top-1 -right-1 animate-pulse" />
        </motion.div>
        
        {/* Full-width copy panel */}
        <CopyPanel body={chapter.body} className="w-full" compact />
      </div>

      {/* Interactive tarot cards — fan spread */}
      {chapter.revealCards && (
        <div className="w-full pt-1">
          <InteractiveTarotCards cards={chapter.revealCards} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CHAPTER IV — CLOSING
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
          {/* Mini Hearts Burst */}
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
              className="h-full w-full object-contain drop-shadow-lg select-none"
            />
          </motion.div>

          {/* Sparkle trail */}
          <SparkleIcon
            size={12}
            color="rgba(207, 161, 95, 0.4)"
            className="absolute -right-2 top-1/4 animate-sparkle-pulse z-20"
          />
          <SparkleIcon
            size={8}
            color="rgba(217, 154, 139, 0.35)"
            className="absolute -left-1 bottom-1/3 animate-sparkle-pulse z-20"
            style={{ animationDelay: "0.6s" } as React.CSSProperties}
          />
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
              className="w-full drop-shadow-md"
              label="foto kamu ✦"
            />
          </motion.div>
        )}
      </div>

      <CopyPanel body={chapter.body} compact />

      {/* Gentle closing note */}
      <motion.div
        className="mx-auto max-w-[18rem] text-center pt-1"
        {...staggerChild(0.5)}
      >
        {/* Elegant tiny celestial divider */}
        <div className="flex items-center justify-center gap-2 mb-3.5 opacity-60 pointer-events-none select-none">
          <div className="h-[0.5px] w-6 bg-[#cfa15f]" />
          <span className="text-[6px] text-[#cfa15f]">✦</span>
          <div className="h-[0.5px] w-6 bg-[#cfa15f]" />
        </div>
        
        <p className="font-accent text-[0.8rem] leading-relaxed text-charcoal/50">
          ━━ sent with a little bit of magic ━━
        </p>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED — Tarot Hero Card
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
      <div className="absolute inset-1.5 border border-[#cfa15f]/35 rounded-[12px] pointer-events-none" />
      <div className="absolute inset-[9px] border border-[#cfa15f]/15 rounded-[9px] pointer-events-none" />

      {/* Floating hero image */}
      <motion.div
        className="absolute inset-[18%] grid place-items-center z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <AssetImage
          src={chapter.heroAsset}
          alt="Decorative magical gift"
          className="h-full w-full object-contain drop-shadow-lg select-none"
        />
      </motion.div>

      {/* Glowing pulse behind the hero asset */}
      <div className="absolute inset-[25%] bg-[#cfa15f]/10 blur-xl rounded-full -z-10 animate-pulse pointer-events-none" />

      {/* Badge at bottom */}
      <AssetImage
        src={chapter.badgeAsset}
        alt=""
        aria-hidden="true"
        className="absolute -bottom-3 left-1/2 h-16 w-16 -translate-x-1/2 object-contain drop-shadow-xl z-20"
      />

      {/* Corner sparkles */}
      <SparkleIcon
        size={10}
        color="rgba(207, 161, 95, 0.4)"
        className="absolute -right-1 -top-1"
      />
      <SparkleIcon
        size={7}
        color="rgba(217, 154, 139, 0.35)"
        className="absolute -bottom-1 -left-1"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED — Parchment Copy Panel
   ═══════════════════════════════════════════════════════ */
function CopyPanel({
  body,
  compact,
  className
}: {
  body: string[];
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={`parchment-panel ${className ?? ""}`}>
      {/* Inner decorative border */}
      <span className="parchment-panel-inner" />

      {/* Scrapbook Decor */}
      <AssetImage src={assetPaths.decor.corner} className="absolute left-0 top-0 w-10 h-10 opacity-70" alt="" />
      <AssetImage src={assetPaths.decor.corner} className="absolute right-0 bottom-0 w-10 h-10 opacity-70 rotate-180" alt="" />
      <AssetImage src={assetPaths.decor.heart} className="absolute -left-2 top-1/2 w-6 h-6 opacity-60 -translate-y-1/2" alt="" />
      <AssetImage src={assetPaths.decor.ribbon} className="absolute left-1/2 -top-2 w-28 opacity-85 -translate-x-1/2" alt="" />

      {/* Decorative divider watermark */}
      <AssetImage
        src={assetPaths.decor.divider}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rotate-12 object-contain opacity-[0.16]"
      />

      <div className={compact ? "space-y-2 px-1" : "space-y-3 px-2"}>
        {body.map((line, lineIdx) => (
          <motion.p
            key={`${line.slice(0, 20)}-${lineIdx}`}
            className={`${compact ? "text-[1rem]" : "text-[1.08rem] md:text-[1.18rem]"} relative font-accent font-normal leading-relaxed text-charcoal/95 text-center`}
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
   BUTTON & AMBIENT DECORATIONS
   ═══════════════════════════════════════════════════════ */
function TarotButton({ onClick, href, children }: { onClick?: () => void; href?: string; children: React.ReactNode }) {
  const inner = (
    <>
      <AssetImage src={assetPaths.ui.buttonPrimary} className="absolute inset-0 w-full h-full object-fill opacity-95 drop-shadow-sm" alt="" />
      <span className="relative z-10 flex items-center justify-center gap-2 font-display font-semibold text-lg text-ivory tracking-wide drop-shadow-md">
        {children}
      </span>
      <SparkleIcon size={14} color="#cfa15f" className="absolute -right-2 -top-2 z-20 animate-sparkle-pulse" />
      <SparkleIcon size={8} color="#fff7ea" className="absolute -left-1 -bottom-1 z-20 animate-sparkle-pulse" style={{animationDelay: '1.2s'} as React.CSSProperties} />
    </>
  );

  const className = "relative inline-flex items-center justify-center min-h-[4rem] w-full max-w-[20rem] mx-auto overflow-visible outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-[2rem] transition-transform hover:scale-[1.02] active:scale-[0.97]";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <motion.button
      type="button"
      className={className}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {inner}
    </motion.button>
  );
}

function ChapterDecorations({ kind }: { kind: ChapterKind }) {
  // Returns different absolute decorations based on the chapter kind.
  switch (kind) {
    case "arrival":
      return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <AssetImage src={assetPaths.celestial.sun} className="absolute -left-16 top-24 w-40 opacity-20 drop-shadow-lg" alt="" />
          <AssetImage src={assetPaths.celestial.stars} className="absolute right-0 top-[15%] w-24 opacity-30" alt="" />
          <AssetImage src={assetPaths.decor.swirl} className="absolute -right-10 bottom-[30%] w-32 opacity-25 -scale-x-100" alt="" />
        </div>
      );
    case "bracelet":
      return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <AssetImage src={assetPaths.celestial.moon} className="absolute -right-10 top-1/4 w-36 opacity-25 drop-shadow-lg" alt="" />
          <AssetImage src={assetPaths.decor.swirl} className="absolute -left-8 top-[10%] w-28 opacity-30" alt="" />
          <AssetImage src={assetPaths.celestial.cloud} className="absolute left-0 bottom-[20%] w-48 opacity-15" alt="" />
        </div>
      );
    case "cards":
      return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <AssetImage src={assetPaths.celestial.cloud} className="absolute -left-20 bottom-1/3 w-56 opacity-[0.18] drop-shadow-lg" alt="" />
          <AssetImage src={assetPaths.celestial.stars} className="absolute right-2 top-1/4 w-20 opacity-30" alt="" />
          <AssetImage src={assetPaths.decor.swirl} className="absolute right-0 bottom-1/4 w-24 opacity-25" alt="" />
        </div>
      );
    case "closing":
      return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <AssetImage src={assetPaths.celestial.sun} className="absolute -right-16 top-[35%] w-56 opacity-15 drop-shadow-xl" alt="" />
          <AssetImage src={assetPaths.celestial.moon} className="absolute -left-12 top-[10%] w-32 opacity-20" alt="" />
          <AssetImage src={assetPaths.decor.swirl} className="absolute left-0 bottom-[15%] w-32 opacity-30" alt="" />
        </div>
      );
    default:
      return null;
  }
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
