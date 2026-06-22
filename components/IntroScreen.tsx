"use client";

import { motion } from "framer-motion";
import { SparkleIcon } from "./SparkleParticles";

type IntroScreenProps = {
  onStart: () => void;
};

/* ─────────────────────────────────────────────
   CSS-ONLY TWINKLING STARS (no React state updates)
   ───────────────────────────────────────────── */
const STARS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 29 + 7) % 96}%`,
  top: `${(i * 43 + 11) % 94}%`,
  size: 1.5 + (i % 4) * 0.8,
  delay: `${(i * 0.37) % 4}s`,
  duration: `${2.5 + (i % 3) * 1.2}s`,
  opacity: 0.3 + (i % 5) * 0.12,
}));

function CSSStarfield() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {STARS.map((s) => (
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
            boxShadow: `0 0 ${s.size * 3}px rgba(255,247,234,0.6)`,
            opacity: s.opacity,
            "--twinkle-duration": s.duration,
            "--twinkle-delay": s.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PURE CSS CONCENTRIC RINGS (replaces SVG zodiac wheel)
   ───────────────────────────────────────────── */
function ConcentricRings() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
      {/* Slow outer ring */}
      <div
        className="intro-ring absolute aspect-square rounded-full border border-[#cfa15f]/10"
        style={{
          width: "min(130vw, 560px)",
          "--ring-duration": "80s",
        } as React.CSSProperties}
      />
      {/* Medium ring with dots */}
      <div
        className="intro-ring absolute aspect-square rounded-full border border-dashed border-[#cfa15f]/8"
        style={{
          width: "min(95vw, 400px)",
          "--ring-duration": "60s",
          animationDirection: "reverse",
        } as React.CSSProperties}
      />
      {/* Inner ring */}
      <div
        className="intro-ring absolute aspect-square rounded-full border border-[#cfa15f]/12"
        style={{
          width: "min(60vw, 260px)",
          "--ring-duration": "45s",
        } as React.CSSProperties}
      />
      {/* Innermost glow circle */}
      <div
        className="intro-glow-pulse absolute aspect-square rounded-full"
        style={{
          width: "min(30vw, 130px)",
          background: "radial-gradient(circle, rgba(207,161,95,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ORNATE GOLD DIVIDER
   ───────────────────────────────────────────── */
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-5 w-full max-w-[200px]">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#cfa15f]/50" />
      <SparkleIcon size={10} color="#cfa15f" />
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#cfa15f]/50" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   INTRO SCREEN (REDESIGNED)
   ───────────────────────────────────────────── */
export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden text-[#f8f4ec]"
      style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 45%, #1e1530 0%, #150f1f 50%, #0d0914 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* CSS-only starfield */}
      <CSSStarfield />

      {/* CSS-only concentric rings */}
      <ConcentricRings />

      {/* Corner ornaments */}
      <div className="absolute inset-0 p-4 pointer-events-none z-20">
        <img
          src="/assets/decor/corner_ornament_01.png"
          alt=""
          className="absolute top-4 left-4 w-12 h-12 object-contain opacity-30 select-none"
        />
        <img
          src="/assets/decor/corner_ornament_01.png"
          alt=""
          className="absolute top-4 right-4 w-12 h-12 object-contain opacity-30 rotate-90 select-none"
        />
        <img
          src="/assets/decor/corner_ornament_01.png"
          alt=""
          className="absolute bottom-4 left-4 w-12 h-12 object-contain opacity-30 -rotate-90 select-none"
        />
        <img
          src="/assets/decor/corner_ornament_01.png"
          alt=""
          className="absolute bottom-4 right-4 w-12 h-12 object-contain opacity-30 rotate-180 select-none"
        />
      </div>

      {/* ─── COSMIC GATE MEDALLION ─── */}
      <motion.div
        className="relative z-10 mb-10"
        initial={{ y: 24, opacity: 0, scale: 0.92 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Ambient glow behind the gate */}
        <div
          className="intro-glow-pulse absolute -inset-8 rounded-full -z-10"
          style={{
            background: "radial-gradient(circle, rgba(207,161,95,0.12) 0%, rgba(184,169,201,0.06) 40%, transparent 70%)",
          }}
        />

        {/* The gate image in a circular medallion */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full p-[3px] bg-gradient-to-b from-[#cfa15f]/50 to-[#cfa15f]/15 shadow-[0_0_40px_rgba(207,161,95,0.12)]">
          <div className="w-full h-full rounded-full overflow-hidden border border-[#cfa15f]/30 relative">
            <img
              src="/assets/cosmic_gate.png"
              alt="Cosmic Gate"
              className="w-full h-full object-cover select-none"
            />
            {/* Inner vignette */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#150f1f]/50 via-transparent to-[#150f1f]/20 pointer-events-none" />
          </div>
        </div>

        {/* Crescent moon badge */}
        <div className="absolute -top-1 inset-x-0 flex justify-center pointer-events-none">
          <div className="intro-glow-pulse bg-[#150f1f] p-1.5 rounded-full border border-[#cfa15f]/40 text-[#cfa15f] shadow-[0_0_12px_rgba(207,161,95,0.3)]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.1 22C17.6 22 22 17.6 22 12.1C22 11.2 21.9 10.4 21.6 9.6C20 10.9 17.9 11.7 15.6 11.7C10.2 11.7 5.8 7.3 5.8 1.9C5.8 1.3 5.9 0.6 6.1 0C2.5 1.7 0 5.4 0 9.7C0 16.5 5.4 22 12.1 22Z" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* ─── TEXT & CTA ─── */}
      <motion.div
        className="text-center z-10 flex flex-col items-center px-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Greeting */}
        <h1 className="text-3xl sm:text-4xl font-serif tracking-[0.2em] uppercase bg-gradient-to-r from-[#ffe8cc] via-[#f1d0a5] to-[#d99a8b] bg-clip-text text-transparent">
          Hi, Ila.
        </h1>

        <GoldDivider />

        <p className="text-[#c8bdd2] text-sm sm:text-base font-light tracking-wide leading-relaxed max-w-[280px] mb-8">
          Ada tempat kecil penuh bintang yang kubuat khusus untukmu.
        </p>

        {/* CTA Button — CSS shimmer, no Framer Motion infinite loops */}
        <button
          onClick={onStart}
          className="intro-cta group relative overflow-hidden rounded-full border border-[#cfa15f]/50 bg-gradient-to-b from-[#1a1423]/80 to-[#120e1a] px-8 py-3.5 text-[#f8f4ec] backdrop-blur-sm shadow-[0_0_24px_rgba(207,161,95,0.1)] transition-all duration-300 hover:border-[#cfa15f]/80 hover:shadow-[0_0_36px_rgba(207,161,95,0.2)] active:scale-[0.97]"
        >
          <span className="relative z-10 flex items-center justify-center gap-2.5 font-serif tracking-[0.18em] text-[11px] sm:text-xs uppercase">
            <span className="intro-sparkle-pulse text-[#cfa15f]">✦</span>
            <span>Buka Gerbang Kosmik</span>
            <span className="intro-sparkle-pulse text-[#cfa15f]" style={{ animationDelay: "1s" }}>✦</span>
          </span>
          {/* CSS shimmer sweep */}
          <div className="absolute inset-0 -z-10 intro-shimmer" />
        </button>
      </motion.div>
    </motion.div>
  );
}
