"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChapterScreen } from "@/components/ChapterScreen";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { IntroScreen } from "@/components/IntroScreen";
import { chapters, loadingMessages } from "@/data/chapters";

const TRANSITION_MS = 2000;

/** Subtle per-chapter background tint — dark cosmic theme */
const CHAPTER_BACKGROUNDS = [
  "radial-gradient(ellipse 80% 60% at 50% 30%, #1a1535 0%, #110e20 50%, #0a0816 100%)",
  "radial-gradient(ellipse 80% 60% at 50% 40%, #171230 0%, #0f0c1e 50%, #0a0816 100%)",
  "radial-gradient(ellipse 80% 60% at 50% 35%, #151028 0%, #0d0a1a 50%, #080612 100%)",
  "radial-gradient(ellipse 80% 60% at 40% 40%, #1a1230 0%, #12101f 50%, #0a0816 100%)",
  "radial-gradient(ellipse 80% 60% at 55% 35%, #1b1431 0%, #100d20 50%, #090714 100%)",
  "radial-gradient(ellipse 80% 60% at 45% 35%, #16152d 0%, #0f0c1d 52%, #080612 100%)",
  "radial-gradient(ellipse 80% 60% at 50% 42%, #1c142b 0%, #110c1f 50%, #090613 100%)",
  "radial-gradient(ellipse 80% 60% at 50% 32%, #181333 0%, #0e0b1d 50%, #080612 100%)"
];

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLoading = pendingIndex !== null;
  const currentChapter = chapters[currentIndex];
  const pendingChapter = chapters[pendingIndex ?? currentIndex];

  const loadingMessage = useMemo(() => {
    const next = pendingIndex ?? currentIndex;
    return loadingMessages[next % loadingMessages.length];
  }, [currentIndex, pendingIndex]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function startExperience() {
    setHasStarted(true);
    setPendingIndex(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setPendingIndex(null);
    }, 1200); // lighter transition, no heavy zoom
  }

  function goToChapter(index: number) {
    if (index === currentIndex || isLoading) return;
    const next = Math.max(0, Math.min(index, chapters.length - 1));
    setPendingIndex(next);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex(next);
      setPendingIndex(null);
    }, TRANSITION_MS);
  }

  return (
    <>
      <AnimatePresence>
        {!hasStarted && (
          <IntroScreen key="intro" onStart={startExperience} />
        )}
      </AnimatePresence>

      {hasStarted && (
        <motion.div
          className="min-h-[100dvh] text-charcoal transition-[background] duration-700"
          style={{
            background: CHAPTER_BACKGROUNDS[currentIndex] ?? CHAPTER_BACKGROUNDS[0]
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChapterScreen
            chapter={currentChapter}
            index={currentIndex}
            total={chapters.length}
            onNext={() => goToChapter(currentIndex + 1)}
            onPrevious={() => goToChapter(currentIndex - 1)}
            onJump={goToChapter}
          />
          <LoadingOverlay
            show={isLoading}
            nextChapter={pendingChapter}
            message={loadingMessage}
          />
        </motion.div>
      )}
    </>
  );
}
