"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import type { TarotReveal } from "@/data/chapters";
import { assetPaths } from "@/data/assets";
import { AssetImage } from "./AssetImage";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { SparkleParticles } from "./SparkleParticles";

type InteractiveTarotCardsProps = {
  cards: TarotReveal[];
};

/** Fan spread angles and offsets for 3 cards - widened for visual clarity */
const FAN_CONFIGS = [
  { rotate: -15, x: -80, scale: 0.96 },
  { rotate: 0, x: 0, scale: 1 },
  { rotate: 15, x: 80, scale: 0.96 }
];

export function InteractiveTarotCards({ cards }: InteractiveTarotCardsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());
  const [sparkleTrigger, setSparkleTrigger] = useState(0);

  const handleCardTap = useCallback(
    (cardId: string) => {
      if (selectedId && selectedId !== cardId) return;

      if (!flippedIds.has(cardId)) {
        setFlippedIds((prev) => new Set(prev).add(cardId));
        setSelectedId(cardId);
        setSparkleTrigger((prev) => prev + 1);
      } else {
        const next = new Set(flippedIds);
        next.delete(cardId);
        setFlippedIds(next);
        setSelectedId(null);
      }
    },
    [selectedId, flippedIds]
  );

  return (
    <div className="space-y-5">
      {/* Instruction text */}
      <motion.p
        className="text-center font-accent text-lg text-rose/80"
        animate={{ opacity: selectedId ? 0.4 : [0.5, 1, 0.5] }}
        transition={
          selectedId
            ? { duration: 0.3 }
            : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {selectedId ? "tap lagi untuk menutup ✦" : "✦ tap salah satu kartu ✦"}
      </motion.p>

      {/* Card fan spread */}
      <div className="relative mx-auto flex h-[280px] w-full max-w-[340px] items-center justify-center">
        {cards.map((card, idx) => {
          const cfg = FAN_CONFIGS[idx] ?? FAN_CONFIGS[idx % FAN_CONFIGS.length];
          const isFlipped = flippedIds.has(card.id);
          const isSelected = selectedId === card.id;
          const isInactive = selectedId !== null && !isSelected;

          return (
            <TarotCardSingle
              key={card.id}
              card={card}
              index={idx}
              fanConfig={cfg}
              isFlipped={isFlipped}
              isSelected={isSelected}
              isInactive={isInactive}
              onTap={handleCardTap}
              sparkleTrigger={isSelected ? sparkleTrigger : 0}
            />
          );
        })}
      </div>
    </div>
  );
}

type TarotCardSingleProps = {
  card: TarotReveal;
  index: number;
  fanConfig: { rotate: number; x: number; scale: number };
  isFlipped: boolean;
  isSelected: boolean;
  isInactive: boolean;
  onTap: (id: string) => void;
  sparkleTrigger: number;
};

function TarotCardSingle({
  card,
  index,
  fanConfig,
  isFlipped,
  isSelected,
  isInactive,
  onTap,
  sparkleTrigger
}: TarotCardSingleProps) {
  const isPhotoCard = card.variant === "photo";

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: isSelected ? 20 : 10 - Math.abs(index - 1) }}
    >
      <motion.button
        type="button"
        aria-pressed={isFlipped}
        aria-label={`Reveal ${card.title}`}
        className="outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-ivory pointer-events-auto rounded-[16px]"
        style={{
          width: "140px",
          height: "210px",
          perspective: "1200px",
          willChange: "transform",
          boxShadow: isSelected
            ? "0 24px 60px rgba(17, 23, 45, 0.35), 0 0 30px rgba(207, 161, 95, 0.18)"
            : "0 16px 44px rgba(17, 23, 45, 0.22)"
        }}
        onClick={() => onTap(card.id)}
      initial={{
        opacity: 0,
        y: 40,
        rotate: fanConfig.rotate,
        x: fanConfig.x,
        scale: 0.8
      }}
      animate={{
        opacity: isInactive ? 0.45 : 1,
        y: isSelected ? -14 : 0,
        rotate: isSelected ? 0 : fanConfig.rotate,
        x: isSelected ? 0 : fanConfig.x,
        scale: isInactive ? 0.88 : isSelected ? 1.08 : fanConfig.scale
      }}
      whileTap={isInactive ? {} : { scale: isSelected ? 1.05 : 0.95 }}
      transition={{
        delay: index * 0.1,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ─── BACK FACE ─── */}
        <div
          className="backface-hidden absolute inset-0 overflow-hidden rounded-[16px]"
          style={{ transform: "translate3d(0, 0, 0)" }}
        >
          <AssetImage
            src={
              index === 1
                ? assetPaths.cards.backAlt
                : assetPaths.cards.back
            }
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Inset golden border on card back */}
          <div className="absolute inset-1.5 border border-[#cfa15f]/30 rounded-[12px] pointer-events-none" />
          <div className="absolute inset-[9px] border border-[#cfa15f]/10 rounded-[9px] pointer-events-none border-dashed" />
          
          {/* Tap badge */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.span
              className="rounded-full border border-gold/55 bg-navy/80 px-4 py-2.5 text-center shadow-[0_0_15px_rgba(207,161,95,0.3)] backdrop-blur-sm"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="block font-display text-[0.6rem] font-bold tracking-widest leading-none text-ivory/80 uppercase">
                reveal
              </span>
              <span className="mt-1 block font-display text-base font-semibold leading-none text-gold">
                ✦
              </span>
            </motion.span>
          </div>
        </div>

        {/* ─── FRONT FACE ─── */}
        <div
          className="backface-hidden rotate-y-180 absolute inset-0 overflow-hidden rounded-[16px]"
          style={{ transform: "rotateY(180deg) translate3d(0, 0, 0)" }}
        >
          <AssetImage
            src={assetPaths.cards.frameFrontAlt}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Parchment overlay with soft pink glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255, 252, 245, 0.96) 0%, rgba(254, 246, 232, 0.93) 60%, rgba(244, 195, 202, 0.15) 100%)"
            }}
          />
          
          {/* Double gold border inner */}
          <div className="absolute inset-1.5 border border-[#cfa15f]/40 rounded-[12px] pointer-events-none" />
          <div className="absolute inset-[9px] border border-[#cfa15f]/15 rounded-[9px] pointer-events-none" />

          {/* Content */}
          {isPhotoCard ? (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center px-3 py-3 text-center"
              aria-label={card.photoSlot ? `Slot foto: ${card.photoSlot}` : undefined}
            >
              <span className="text-[8px] text-[#cfa15f]/60 select-none animate-pulse">✦</span>

              <span className="mt-1 block font-display text-[0.68rem] font-bold leading-tight tracking-widest text-[#a67c42] uppercase px-1">
                {card.title}
              </span>

              <div className="mt-1.5 w-[62%]">
                <PhotoPlaceholder
                  frameAsset={card.photoFrameAsset ?? assetPaths.placeholders.tarotPortrait}
                  label={card.photoLabel ?? "foto Ila"}
                  photoSrc={card.photoSrc}
                  photoAlt={card.photoAlt ?? card.title}
                  compact
                  className="w-full drop-shadow-[0_6px_18px_rgba(0,0,0,0.16)]"
                />
              </div>

              <p className="mt-1.5 max-h-[2.65rem] overflow-hidden px-1 text-[0.5rem] font-medium leading-[1.25] text-[#2c2620]">
                {card.message}
              </p>

              <span className="mt-1 block text-[5.5px] tracking-[0.14em] text-[#d99a8b] font-semibold">
                PHOTO SPELL
              </span>
            </div>
          ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4.5 py-4 text-center z-10">
            {/* Small celestial star decoration at top */}
            <span className="text-[9px] text-[#cfa15f]/60 select-none animate-pulse">✦</span>
            
            <span className="mt-1 block font-display text-[0.85rem] font-bold leading-tight tracking-widest text-[#a67c42] uppercase px-1">
              {card.title}
            </span>
            
            {/* Custom thin divider with tiny diamond */}
            <div className="flex items-center justify-center gap-1.5 my-2 w-[55%]">
              <div className="h-[0.5px] flex-1 bg-[#cfa15f]/30" />
              <span className="text-[6px] text-[#cfa15f]">✦</span>
              <div className="h-[0.5px] flex-1 bg-[#cfa15f]/30" />
            </div>
            
            <p className="text-[0.72rem] font-medium leading-relaxed text-[#2c2620] px-1.5">
              {card.message}
            </p>
            
            <span className="mt-2.5 block text-[7px] tracking-[0.15em] text-[#d99a8b] font-semibold">
              ✦ SOULMATE ✦
            </span>
          </div>
          )}
        </div>
      </motion.div>

      {/* Sparkle burst on flip */}
      <SparkleParticles
        trigger={sparkleTrigger}
        count={10}
        colors={["#cfa15f", "#d99a8b", "#f4c3ca", "#fff7ea"]}
      />
      </motion.button>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Legacy single-card export for backward compat
   ──────────────────────────────────────────────── */
type TarotCardProps = {
  reveal: TarotReveal;
  index: number;
};

export function TarotCard({ reveal, index }: TarotCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [sparkleTrigger, setSparkleTrigger] = useState(0);

  return (
    <motion.button
      type="button"
      aria-pressed={flipped}
      aria-label={`Reveal ${reveal.title}`}
      className="group relative h-[12rem] w-full rounded-[1.25rem] text-left outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-ivory shadow-tarot"
      onClick={() => {
        setFlipped((v) => !v);
        if (!flipped) setSparkleTrigger((p) => p + 1);
      }}
      initial={{ opacity: 0, y: 28, rotate: index % 2 ? 2 : -2 }}
      animate={{ opacity: 1, y: 0, rotate: index % 2 ? 1 : -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{
        delay: index * 0.1,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1]
      }}
      style={{ willChange: "transform" }}
    >
      <motion.div
        className="preserve-3d absolute inset-0"
        style={{ willChange: "transform" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Back */}
        <div className="backface-hidden absolute inset-0 overflow-hidden rounded-[1.25rem]" style={{ transform: "translate3d(0,0,0)" }}>
          <AssetImage
            src={assetPaths.cards.back}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Inset golden borders */}
          <div className="absolute inset-2 border border-[#cfa15f]/30 rounded-[14px] pointer-events-none" />
          <div className="absolute inset-[11px] border border-[#cfa15f]/15 rounded-[11px] pointer-events-none border-dashed" />
          
          <div className="absolute inset-0 flex items-center justify-center px-5 text-center z-10">
            <motion.span
              className="rounded-full border border-gold/45 bg-navy/75 px-5 py-3 shadow-[0_0_15px_rgba(207,161,95,0.35)] backdrop-blur"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="block font-accent text-lg leading-none text-ivory">
                tap
              </span>
              <span className="mt-1 block font-display text-xl font-semibold leading-none text-gold">
                kartu kecil
              </span>
            </motion.span>
          </div>
        </div>

        {/* Front */}
        <div className="backface-hidden absolute inset-0 rotate-y-180 overflow-hidden rounded-[1.25rem]" style={{ transform: "rotateY(180deg) translate3d(0, 0, 0)" }}>
          <AssetImage
            src={assetPaths.cards.frameFrontAlt}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-95"
          />
          {/* Parchment overlay with soft pink glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255, 252, 245, 0.96) 0%, rgba(254, 246, 232, 0.93) 60%, rgba(244, 195, 202, 0.15) 100%)"
            }}
          />
          
          {/* Double gold border inner */}
          <div className="absolute inset-2 border border-[#cfa15f]/40 rounded-[14px] pointer-events-none" />
          <div className="absolute inset-[11px] border border-[#cfa15f]/15 rounded-[11px] pointer-events-none" />

          <div className="absolute inset-0 flex flex-col justify-center px-6 z-10 text-center items-center">
            <span className="text-[10px] text-[#cfa15f]/60 select-none animate-pulse">✦</span>
            
            <span className="mt-1 font-display text-xl font-bold tracking-widest text-[#a67c42] uppercase">
              {reveal.title}
            </span>
            
            {/* Custom thin divider with tiny diamond */}
            <div className="flex items-center justify-center gap-2 my-2.5 w-[50%]">
              <div className="h-[0.5px] flex-1 bg-[#cfa15f]/30" />
              <span className="text-[7px] text-[#cfa15f]">✦</span>
              <div className="h-[0.5px] flex-1 bg-[#cfa15f]/30" />
            </div>

            <p className="max-w-[19rem] text-sm font-medium leading-relaxed text-[#2c2620]">
              {reveal.message}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sparkle burst */}
      <SparkleParticles
        trigger={sparkleTrigger}
        count={8}
        colors={["#cfa15f", "#d99a8b", "#f4c3ca"]}
      />
    </motion.button>
  );
}
