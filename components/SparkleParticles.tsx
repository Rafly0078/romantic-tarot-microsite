"use client";

import { useEffect, useState } from "react";

type SparkleParticlesProps = {
  count?: number;
  colors?: string[];
  /** Trigger a burst — change this value to re-fire */
  trigger?: number;
  /** Continuous mode (always showing, random respawning) */
  continuous?: boolean;
  className?: string;
};

type Particle = {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  angle: number;
};

const DEFAULT_COLORS = ["#cfa15f", "#d99a8b", "#f4c3ca", "#fff7ea", "#b8a9c9"];
let particleIdCounter = 0;

function nextParticleId() {
  particleIdCounter += 1;
  return `sparkle-${particleIdCounter}`;
}

export function SparkleParticles({
  count = 8,
  colors = DEFAULT_COLORS,
  trigger = 0,
  continuous = false,
  className
}: SparkleParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const colorsKey = colors.join("|");

  useEffect(() => {
    if (trigger === 0 && !continuous) return;

    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: nextParticleId(),
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      size: 3 + Math.random() * 6,
      color: colors[i % colors.length],
      duration: 1.2 + Math.random() * 1.8,
      delay: Math.random() * 0.5,
      angle: Math.random() * 360
    }));
    setParticles(newParticles);

    if (!continuous) {
      const timer = setTimeout(() => setParticles([]), 3500);
      return () => clearTimeout(timer);
    }
  }, [trigger, continuous, count, colorsKey]);

  useEffect(() => {
    if (!continuous) return;
    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          id: nextParticleId(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 2
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [continuous]);

  if (particles.length === 0) return null;

  return (
    <span
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      {particles.map(p => (
        <span
          key={p.id}
          className="sparkle-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: "50%",
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            "--sparkle-duration": `${p.duration}s`,
            "--sparkle-delay": `${p.delay}s`
          } as React.CSSProperties}
        />
      ))}
    </span>
  );
}

/** Inline SVG sparkle shape for decorative use */
export function SparkleIcon({
  size = 16,
  color = "#cfa15f",
  className,
  style
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M12 0C12.4 6 18 11.6 24 12C18 12.4 12.4 18 12 24C11.6 18 6 12.4 0 12C6 11.6 11.6 6 12 0Z" />
    </svg>
  );
}
