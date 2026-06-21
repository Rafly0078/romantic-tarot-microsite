"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Chapter } from "@/data/chapters";
import { assetPaths } from "@/data/assets";
import { AssetImage } from "./AssetImage";

type LoadingOverlayProps = {
  show: boolean;
  nextChapter: Chapter;
  message: string;
};

/** Context-aware loading messages mapped to the next chapter index */
const CONTEXT_MESSAGES: Record<number, string> = {
  0: "Mengocok kartu terbaik buat kamu...",
  1: "Menyusun langit kecil berikutnya...",
  2: "Menarik selembar cerita baru...",
  3: "Merangkai sedikit sihir untuk halaman terakhir..."
};

const CARD_COUNT = 5;

/** Fan positions for 5 cards: [restRotate, restX, spreadRotate, spreadX, lift] */
const CARD_CONFIGS = [
  { restRotate: -6, restX: -8, spreadRotate: -18, spreadX: -48, lift: 0 },
  { restRotate: -3, restX: -4, spreadRotate: -9, spreadX: -24, lift: -4 },
  { restRotate: 0, restX: 0, spreadRotate: 0, spreadX: 0, lift: -10 },
  { restRotate: 3, restX: 4, spreadRotate: 9, spreadX: 24, lift: -4 },
  { restRotate: 6, restX: 8, spreadRotate: 18, spreadX: 48, lift: 0 }
];

export function LoadingOverlay({ show, nextChapter, message }: LoadingOverlayProps) {
  const contextMessage =
    CONTEXT_MESSAGES[nextChapter.order - 1] ?? message;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, #1a2240 0%, #11172d 50%, #0a0f1e 100%)"
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="status"
          aria-live="polite"
        >
          {/* Background starburst glow */}
          <div className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <AssetImage
                src={assetPaths.loading.starburst}
                alt=""
                aria-hidden="true"
                className="h-[28rem] w-[28rem] object-contain opacity-25"
              />
            </motion.div>
          </div>

          {/* Ambient sparkles */}
          <LoadingSparkles />

          {/* ─── Card shuffle area (fixed height, no absolute overlap) ─── */}
          <div className="relative z-10 mb-8 h-[220px] w-[260px] flex-shrink-0">
            {Array.from({ length: CARD_COUNT }).map((_, idx) => {
              const cfg = CARD_CONFIGS[idx];
              const isCenter = idx === 2;

              return (
                <div
                  key={idx}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ zIndex: idx === 2 ? 10 : 5 - Math.abs(idx - 2) }}
                >
                  <motion.div
                    className="h-[180px] w-[120px]"
                    style={{
                      transformOrigin: "center bottom",
                      filter: isCenter
                        ? "drop-shadow(0 20px 40px rgba(0,0,0,0.5))"
                        : "drop-shadow(0 14px 28px rgba(0,0,0,0.35))"
                    }}
                    animate={{
                      rotate: [cfg.restRotate, cfg.spreadRotate, cfg.spreadRotate, cfg.restRotate],
                      x: [cfg.restX, cfg.spreadX, cfg.spreadX, cfg.restX],
                      y: [0, cfg.lift, cfg.lift, 0],
                      scale: isCenter ? [1, 1.06, 1.06, 1] : [0.94, 0.94, 0.94, 0.94]
                    }}
                    transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: [0.45, 0, 0.2, 1],
                    delay: idx * 0.04,
                    times: [0, 0.35, 0.65, 1]
                  }}
                >
                  <AssetImage
                    src={
                      idx % 2 === 0
                        ? assetPaths.loading.card1
                        : assetPaths.loading.card2
                    }
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-contain"
                  />
                  </motion.div>
                </div>
              );
            })}

            {/* Soft radial glow behind the cards */}
            <div
              className="absolute left-1/2 top-1/2 -z-10 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(207, 161, 95, 0.2) 0%, transparent 70%)"
              }}
            />
          </div>

          {/* ─── Text section (below cards, proper spacing) ─── */}
          <motion.div
            className="relative z-10 w-full max-w-[280px] flex-shrink-0 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
          >
            {/* Loading message */}
            <p className="font-accent text-xl leading-snug text-gold">
              {contextMessage}
            </p>

            {/* Next chapter title */}
            <h2 className="mt-3 font-display text-3xl font-semibold leading-none text-ivory">
              {nextChapter.title}
            </h2>

            {/* Chapter hint */}
            <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-blush">
              {nextChapter.loadingHint}
            </p>

            {/* Progress bar */}
            <div className="mx-auto mt-5 w-[85%] overflow-hidden rounded-full border border-gold/40 bg-ivory/8 p-[3px]">
              <motion.div
                className="h-[6px] origin-left rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #cfa15f 0%, #f4c3ca 50%, #d99a8b 100%)"
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2, ease: "linear" }}
              />
            </div>

            {/* Loading dots */}
            <div className="mt-4 flex justify-center gap-[6px]" aria-hidden="true">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-[5px] w-[5px] rounded-full bg-gold"
                  style={{ boxShadow: "0 0 8px rgba(207, 161, 95, 0.4)" }}
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: dot * 0.18
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Lightweight CSS-animated sparkles for the loading screen */
function LoadingSparkles() {
  const sparkles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${10 + ((i * 37) % 80)}%`,
    top: `${8 + ((i * 53) % 78)}%`,
    size: 2 + (i % 3) * 1.5,
    delay: `${(i * 0.4) % 3}s`,
    duration: `${2 + (i % 3)}s`,
    color: i % 3 === 0 ? "#cfa15f" : i % 3 === 1 ? "#d99a8b" : "#fff7ea"
  }));

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="twinkle-star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            backgroundColor: s.color,
            boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
            "--twinkle-duration": s.duration,
            "--twinkle-delay": s.delay
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
