"use client";

import { assetPaths } from "@/data/assets";
import { AssetImage } from "./AssetImage";
import { SparkleIcon } from "./SparkleParticles";

type FloatingDecorProps = {
  /** Chapter index to slightly vary decoration set */
  chapterIndex?: number;
  className?: string;
};

type DecorItem = {
  type: "image" | "sparkle" | "dot" | "heart-svg";
  src?: string;
  x: string;
  y: string;
  size: string;
  opacity: number;
  floatY: string;
  floatRotate: string;
  duration: string;
  delay: string;
  color?: string;
};

const BASE_DECOR: DecorItem[] = [
  // Top-left corner ornament
  {
    type: "image",
    src: assetPaths.decor.corner,
    x: "-14px",
    y: "60px",
    size: "80px",
    opacity: 0.18,
    floatY: "-4px",
    floatRotate: "0deg",
    duration: "7s",
    delay: "0s"
  },
  // Top-right moon
  {
    type: "image",
    src: assetPaths.celestial.moon,
    x: "calc(100% - 56px)",
    y: "90px",
    size: "52px",
    opacity: 0.22,
    floatY: "-6px",
    floatRotate: "-2deg",
    duration: "6s",
    delay: "1s"
  },
  // Stars cluster
  {
    type: "image",
    src: assetPaths.celestial.stars,
    x: "-16px",
    y: "220px",
    size: "64px",
    opacity: 0.16,
    floatY: "-5px",
    floatRotate: "3deg",
    duration: "8s",
    delay: "0.5s"
  },
  // Cloud bottom-right
  {
    type: "image",
    src: assetPaths.celestial.cloud,
    x: "calc(100% - 48px)",
    y: "calc(100% - 180px)",
    size: "56px",
    opacity: 0.2,
    floatY: "-4px",
    floatRotate: "-1deg",
    duration: "9s",
    delay: "2s"
  },
  // Small sparkles scattered
  {
    type: "sparkle",
    x: "calc(100% - 32px)",
    y: "160px",
    size: "12px",
    opacity: 0.4,
    floatY: "-3px",
    floatRotate: "0deg",
    duration: "3s",
    delay: "0s",
    color: "#cfa15f"
  },
  {
    type: "sparkle",
    x: "24px",
    y: "calc(100% - 240px)",
    size: "10px",
    opacity: 0.35,
    floatY: "-4px",
    floatRotate: "0deg",
    duration: "3.5s",
    delay: "1.2s",
    color: "#d99a8b"
  },
  // Small hearts
  {
    type: "heart-svg",
    x: "calc(100% - 40px)",
    y: "calc(100% - 120px)",
    size: "14px",
    opacity: 0.25,
    floatY: "-5px",
    floatRotate: "5deg",
    duration: "5s",
    delay: "0.8s",
    color: "#c56f82"
  },
  {
    type: "heart-svg",
    x: "16px",
    y: "380px",
    size: "11px",
    opacity: 0.2,
    floatY: "-3px",
    floatRotate: "-3deg",
    duration: "6s",
    delay: "2.5s",
    color: "#f4c3ca"
  },
  // Subtle dots
  {
    type: "dot",
    x: "65%",
    y: "12%",
    size: "4px",
    opacity: 0.25,
    floatY: "-2px",
    floatRotate: "0deg",
    duration: "4s",
    delay: "0.3s",
    color: "#cfa15f"
  },
  {
    type: "dot",
    x: "20%",
    y: "75%",
    size: "3px",
    opacity: 0.2,
    floatY: "-3px",
    floatRotate: "0deg",
    duration: "5s",
    delay: "1.5s",
    color: "#d99a8b"
  },
  {
    type: "dot",
    x: "85%",
    y: "55%",
    size: "3px",
    opacity: 0.22,
    floatY: "-2px",
    floatRotate: "0deg",
    duration: "4.5s",
    delay: "0.7s",
    color: "#b8a9c9"
  }
];

/** Extra decor items per chapter for variety */
const CHAPTER_EXTRAS: Record<number, DecorItem[]> = {
  0: [
    // Arrival: extra sparkle top-center
    {
      type: "sparkle",
      x: "50%",
      y: "70px",
      size: "14px",
      opacity: 0.3,
      floatY: "-6px",
      floatRotate: "0deg",
      duration: "2.8s",
      delay: "0.4s",
      color: "#cfa15f"
    }
  ],
  1: [
    // Bracelet: extra moon detail
    {
      type: "image",
      src: assetPaths.celestial.sun,
      x: "12px",
      y: "140px",
      size: "40px",
      opacity: 0.12,
      floatY: "-3px",
      floatRotate: "2deg",
      duration: "10s",
      delay: "1s"
    }
  ],
  2: [
    // Cards: extra stars
    {
      type: "sparkle",
      x: "12%",
      y: "45%",
      size: "10px",
      opacity: 0.3,
      floatY: "-4px",
      floatRotate: "0deg",
      duration: "2.5s",
      delay: "0.6s",
      color: "#b8a9c9"
    }
  ],
  3: [
    // Closing: extra heart
    {
      type: "heart-svg",
      x: "50%",
      y: "70px",
      size: "16px",
      opacity: 0.2,
      floatY: "-5px",
      floatRotate: "3deg",
      duration: "5.5s",
      delay: "0.3s",
      color: "#c56f82"
    }
  ]
};

function HeartSVG({ size, color }: { size: string; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export function FloatingDecor({ chapterIndex = 0, className }: FloatingDecorProps) {
  const extras = CHAPTER_EXTRAS[chapterIndex] ?? [];
  const items = [...BASE_DECOR, ...extras];

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute -right-20 top-16 h-44 w-44 rounded-full blur-3xl animate-pulse"
        style={{ background: "rgba(244, 195, 202, 0.28)" }}
      />
      <div
        className="absolute -left-24 bottom-12 h-48 w-48 rounded-full blur-3xl"
        style={{
          background: "rgba(207, 161, 95, 0.16)",
          animation: "gentle-float 7s ease-in-out infinite"
        }}
      />

      {/* Floating decorative elements */}
      {items.map((item, i) => (
        <span
          key={`decor-${i}`}
          className="floating-element"
          style={{
            left: item.x,
            top: item.y,
            width: item.size,
            height: item.size,
            opacity: item.opacity,
            "--float-y": item.floatY,
            "--float-rotate": item.floatRotate,
            "--float-duration": item.duration,
            "--float-delay": item.delay
          } as React.CSSProperties}
        >
          {item.type === "image" && item.src ? (
            <AssetImage
              src={item.src}
              alt=""
              className="h-full w-full object-contain"
            />
          ) : item.type === "sparkle" ? (
            <SparkleIcon size={parseInt(item.size)} color={item.color} />
          ) : item.type === "heart-svg" ? (
            <HeartSVG size={item.size} color={item.color ?? "#c56f82"} />
          ) : item.type === "dot" ? (
            <span
              className="block rounded-full"
              style={{
                width: item.size,
                height: item.size,
                backgroundColor: item.color,
                boxShadow: `0 0 ${parseInt(item.size) * 2}px ${item.color}`
              }}
            />
          ) : null}
        </span>
      ))}
    </div>
  );
}
