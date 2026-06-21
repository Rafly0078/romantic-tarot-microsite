"use client";

import { motion } from "framer-motion";
import { AssetImage } from "./AssetImage";
import { SparkleIcon } from "./SparkleParticles";

type PhotoPlaceholderProps = {
  frameAsset: string;
  /** Optional label text shown inside the placeholder */
  label?: string;
  className?: string;
  showTape?: boolean;
};

export function PhotoPlaceholder({
  frameAsset,
  label = "foto kamu di sini",
  className,
  showTape = false
}: PhotoPlaceholderProps) {
  return (
    <motion.div
      className={`relative aspect-[3/4] overflow-hidden rounded-[1.75rem] ${className ?? ""}`}
      initial={{ opacity: 0, y: 18, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background gradient (placeholder fill) */}
      <div
        className="absolute inset-[12%] rounded-[1.25rem]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(255, 255, 255, 0.95) 0%, rgba(244, 195, 202, 0.45) 45%, rgba(207, 161, 95, 0.08) 100%)"
        }}
      />

      {/* Inner soft glow */}
      <div className="absolute inset-[22%] rounded-[1rem] border border-gold/20 bg-ivory/30 blur-[0.5px]" />

      {/* Placeholder icon + label */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5">
        {/* Camera/photo icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-rose-gold/40"
          aria-hidden="true"
        >
          <rect x="3" y="6" width="18" height="14" rx="3" />
          <circle cx="12" cy="13" r="4" />
          <path d="M7 6V4.5A1.5 1.5 0 018.5 3h7A1.5 1.5 0 0117 4.5V6" />
        </svg>
        <span className="font-accent text-xs text-rose-gold/35">
          {label}
        </span>
      </div>

      {/* Frame overlay */}
      <AssetImage
        src={frameAsset}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-20 h-full w-full object-contain"
      />

      {/* Ripped Washi Tape Sticker (on top of frame) */}
      {showTape && (
        <div
          className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[45%] h-5 bg-[#fffaf0]/40 backdrop-blur-[1px] border-y border-white/40 rotate-[-2deg] shadow-[0_1px_3px_rgba(0,0,0,0.05)] z-30"
          style={{
            clipPath: "polygon(2% 0%, 98% 1%, 100% 15%, 98% 85%, 100% 100%, 0% 98%, 2% 85%, 0% 15%)"
          }}
        />
      )}

      {/* Corner sparkles */}
      <SparkleIcon
        size={8}
        color="rgba(207, 161, 95, 0.3)"
        className="absolute left-[14%] top-[14%] z-30"
      />
      <SparkleIcon
        size={6}
        color="rgba(217, 154, 139, 0.25)"
        className="absolute bottom-[14%] right-[14%] z-30"
      />
    </motion.div>
  );
}
