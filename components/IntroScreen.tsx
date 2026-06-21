"use client";

import { motion } from "framer-motion";
import { SparkleIcon, SparkleParticles } from "./SparkleParticles";

type IntroScreenProps = {
  onStart: () => void;
};

function CelestialZodiacWheel() {
  return (
    <motion.svg
      viewBox="0 0 400 400"
      className="absolute w-[140%] max-w-[550px] aspect-square text-[#cfa15f]/15 pointer-events-none z-0 select-none"
      animate={{ rotate: 360 }}
      transition={{ duration: 90, ease: "linear", repeat: Infinity }}
    >
      {/* Outer dotted ring */}
      <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
      
      {/* Double outer border */}
      <circle cx="200" cy="200" r="182" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="176" fill="none" stroke="currentColor" strokeWidth="0.5" />
      
      {/* Mid concentric rings */}
      <circle cx="200" cy="200" r="145" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="200" cy="200" r="139" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="6 4" />
      <circle cx="200" cy="200" r="110" fill="none" stroke="currentColor" strokeWidth="0.75" />
      
      {/* Inner rings */}
      <circle cx="200" cy="200" r="75" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="200" cy="200" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" />

      {/* Zodiac divisions (12 lines) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 200 + 110 * Math.cos(angle);
        const y1 = 200 + 110 * Math.sin(angle);
        const x2 = 200 + 176 * Math.cos(angle);
        const y2 = 200 + 176 * Math.sin(angle);
        return (
          <line
            key={`zodiac-div-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0.8"
          />
        );
      })}

      {/* Outer symbols or small star dots in the track */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = ((i * 30 + 15) * Math.PI) / 180;
        const x = 200 + 160 * Math.cos(angle);
        const y = 200 + 160 * Math.sin(angle);
        return i % 2 === 0 ? (
          <path
            key={`track-star-${i}`}
            d={`M ${x} ${y - 3} L ${x + 2} ${y} L ${x} ${y + 3} L ${x - 2} ${y} Z`}
            fill="currentColor"
            opacity="0.9"
          />
        ) : (
          <circle
            key={`track-dot-${i}`}
            cx={x}
            cy={y}
            r="1.5"
            fill="currentColor"
            opacity="0.9"
          />
        );
      })}

      {/* Celestial rays coming from the center circle */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x1 = 200 + 75 * Math.cos(angle);
        const y1 = 200 + 75 * Math.sin(angle);
        const x2 = 200 + 95 * Math.cos(angle);
        const y2 = 200 + 95 * Math.sin(angle);
        return (
          <line
            key={`ray-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth={i % 2 === 0 ? "0.75" : "0.5"}
            strokeDasharray={i % 2 === 0 ? "" : "2 2"}
            opacity="0.6"
          />
        );
      })}

      {/* Central Star motif */}
      <g transform="translate(200, 200)" className="text-[#cfa15f]/30">
        <path d="M 0 -22 L 4 -8 L 18 -8 L 7 2 L 12 16 L 0 8 L -12 16 L -7 2 L -18 -8 L -4 -8 Z" fill="currentColor" />
        <circle cx="0" cy="0" r="5" fill="#150f1f" />
      </g>
    </motion.svg>
  );
}

function TarotDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4 w-full max-w-[200px]">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#cfa15f]/60" />
      <div className="flex items-center gap-1.5 text-[#cfa15f]">
        <span className="text-[8px] opacity-70">✦</span>
        <SparkleIcon size={12} color="#cfa15f" />
        <span className="text-[8px] opacity-70">✦</span>
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#cfa15f]/60" />
    </div>
  );
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden text-[#f8f4ec]"
      style={{
        background: "radial-gradient(circle at 50% 50%, #20172e 0%, #150f1f 60%, #0d0914 100%)"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 2.5, opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background Starry Sky Atmosphere */}
      <SparkleParticles continuous={true} count={20} className="opacity-70" />

      {/* Ornate corner frames to frame the viewport like a tarot card */}
      <div className="absolute inset-0 p-4 pointer-events-none z-20">
        <img
          src="/assets/decor/corner_ornament_01.png"
          alt=""
          className="absolute top-4 left-4 w-14 h-14 md:w-16 md:h-16 object-contain opacity-40 select-none"
        />
        <img
          src="/assets/decor/corner_ornament_01.png"
          alt=""
          className="absolute top-4 right-4 w-14 h-14 md:w-16 md:h-16 object-contain opacity-40 rotate-90 select-none"
        />
        <img
          src="/assets/decor/corner_ornament_01.png"
          alt=""
          className="absolute bottom-4 left-4 w-14 h-14 md:w-16 md:h-16 object-contain opacity-40 -rotate-90 select-none"
        />
        <img
          src="/assets/decor/corner_ornament_01.png"
          alt=""
          className="absolute bottom-4 right-4 w-14 h-14 md:w-16 md:h-16 object-contain opacity-40 rotate-180 select-none"
        />
      </div>

      {/* Rotating Celestial Wheel Background */}
      <CelestialZodiacWheel />

      {/* Ambient background glow behind the gate */}
      <div className="absolute w-72 h-72 rounded-full bg-[#cfa15f]/5 blur-3xl pointer-events-none" />

      {/* Cosmic Gate Image with layered frames & glow */}
      <motion.div
        className="relative w-[75%] max-w-[20rem] aspect-[3/4] mb-8 z-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Layered ornate border frame */}
        <div className="absolute -inset-2.5 rounded-t-[50%] rounded-b-2xl border border-[#cfa15f]/30 pointer-events-none" />
        
        {/* Outer glowing halo */}
        <motion.div
          className="absolute -inset-4 rounded-t-[50%] rounded-b-2xl bg-gradient-to-t from-[#cfa15f]/15 via-[#d99a8b]/10 to-[#b8a9c9]/25 blur-xl -z-10"
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Inner frame containing image */}
        <div className="w-full h-full p-[5px] rounded-t-[50%] rounded-b-2xl bg-gradient-to-b from-[#cfa15f]/60 to-[#cfa15f]/20 shadow-[0_0_30px_rgba(207,161,95,0.2)]">
          <div className="w-full h-full overflow-hidden rounded-t-[50%] rounded-b-xl border border-[#cfa15f]/40 relative">
            <img
              src="/assets/cosmic_gate.png"
              alt="Cosmic Gate"
              className="w-full h-full object-cover select-none"
            />
            {/* Soft inner vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#150f1f]/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Pulsing crescent moon badge at top */}
        <div className="absolute inset-x-0 -top-2.5 flex justify-center pointer-events-none z-20">
          <motion.div
            animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-[#150f1f] p-1.5 rounded-full border border-[#cfa15f]/50 text-[#cfa15f] shadow-[0_0_10px_rgba(207,161,95,0.4)]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.1 22C17.6 22 22 17.6 22 12.1C22 11.2 21.9 10.4 21.6 9.6C20 10.9 17.9 11.7 15.6 11.7C10.2 11.7 5.8 7.3 5.8 1.9C5.8 1.3 5.9 0.6 6.1 0C2.5 1.7 0 5.4 0 9.7C0 16.5 5.4 22 12.1 22Z" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Greeting Text & Action */}
      <motion.div
        className="text-center z-10 flex flex-col items-center px-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-4xl md:text-5xl font-serif tracking-widest bg-gradient-to-r from-[#ffe8cc] via-[#f1d0a5] to-[#d99a8b] bg-clip-text text-transparent mb-1 drop-shadow-md flex items-center justify-center gap-3 w-full">
          <SparkleIcon size={20} color="#d99a8b" className="shrink-0 animate-pulse" />
          <span>HI, ILA.</span>
          <SparkleIcon size={20} color="#d99a8b" className="shrink-0 animate-pulse" />
        </h1>
        
        <TarotDivider />
        
        <p className="text-[#d0c6d8] text-base md:text-lg font-light tracking-wide mb-8 max-w-sm leading-relaxed px-2">
          Ada tempat kecil penuh bintang yang kubuat khusus untukmu.
        </p>

        {/* Magical CTA Button */}
        <button
          onClick={onStart}
          className="group relative overflow-hidden rounded-full border border-[#cfa15f]/60 bg-gradient-to-b from-[#1a1423]/70 to-[#120e1a]/95 px-8 py-3.5 text-[#f8f4ec] backdrop-blur-md shadow-[0_0_20px_rgba(207,161,95,0.15)] transition-all hover:border-[#cfa15f] hover:shadow-[0_0_30px_rgba(207,161,95,0.3)] hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center justify-center gap-2.5 font-serif tracking-widest text-xs md:text-sm uppercase">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#cfa15f]"
            >
              ✦
            </motion.span>
            <span>Buka Gerbang Kosmik</span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="text-[#cfa15f]"
            >
              ✦
            </motion.span>
          </span>
          <div className="absolute inset-0 -z-10 translate-x-[-100%] bg-gradient-to-r from-transparent via-[#cfa15f]/20 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-[100%]" />
        </button>
      </motion.div>
    </motion.div>
  );
}
