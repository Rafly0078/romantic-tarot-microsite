"use client";

import { motion } from "framer-motion";
import { AssetImage } from "./AssetImage";
import { SparkleIcon } from "./SparkleParticles";

type PhotoPlaceholderProps = {
  frameAsset: string;
  /** Optional label text shown inside the placeholder */
  label?: string;
  photoSrc?: string;
  photoAlt?: string;
  compact?: boolean;
  className?: string;
};

export function PhotoPlaceholder({
  frameAsset,
  label = "foto kamu di sini",
  photoSrc,
  photoAlt = "Foto Ila",
  compact = false,
  className
}: PhotoPlaceholderProps) {
  const isClearFrame = frameAsset.includes("_clear_");
  const gradientInset = compact ? "inset-[13%] rounded-[0.95rem]" : "inset-[12%] rounded-[1.25rem]";
  const photoInset = compact ? "inset-[16%] rounded-[0.85rem]" : "inset-[14%] rounded-[1rem]";
  const iconSize = compact ? 18 : 24;

  return (
    <motion.div
      className={`relative aspect-[3/4] overflow-hidden rounded-[1.75rem] ${className ?? ""}`}
      initial={{ opacity: 0, y: 18, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background gradient (placeholder fill) */}
      <div
        className={`absolute ${gradientInset}`}
        style={{
          background: isClearFrame
            ? "radial-gradient(ellipse at 50% 40%, rgba(255, 247, 234, 0.12) 0%, rgba(217, 154, 139, 0.08) 54%, rgba(207, 161, 95, 0.02) 100%)"
            : "radial-gradient(ellipse at 50% 35%, rgba(255, 255, 255, 0.95) 0%, rgba(244, 195, 202, 0.45) 45%, rgba(207, 161, 95, 0.08) 100%)",
          border: isClearFrame ? "1px dashed rgba(207, 161, 95, 0.26)" : undefined,
          boxShadow: isClearFrame ? "inset 0 0 18px rgba(207, 161, 95, 0.08)" : undefined
        }}
      />

      {photoSrc ? (
        <AssetImage
          src={photoSrc}
          alt={photoAlt}
          className={`absolute ${photoInset} z-[8] h-auto w-auto object-cover`}
        />
      ) : null}

      {/* Inner soft glow */}
      <div className={`absolute inset-[22%] rounded-[1rem] border border-gold/20 ${isClearFrame ? "bg-transparent" : "bg-ivory/30 blur-[0.5px]"}`} />

      {/* Placeholder icon + label */}
      <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center ${compact ? "gap-1" : "gap-1.5"} ${photoSrc ? "opacity-0" : ""}`}>
        {/* Camera/photo icon */}
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isClearFrame ? "text-gold/45" : "text-rose-gold/40"}
          aria-hidden="true"
        >
          <rect x="3" y="6" width="18" height="14" rx="3" />
          <circle cx="12" cy="13" r="4" />
          <path d="M7 6V4.5A1.5 1.5 0 018.5 3h7A1.5 1.5 0 0117 4.5V6" />
        </svg>
        <span className={`font-accent ${compact ? "text-[0.55rem]" : "text-xs"} ${isClearFrame ? "text-gold/45" : "text-rose-gold/35"}`}>
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
