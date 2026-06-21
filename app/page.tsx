"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChapterScreen } from "@/components/ChapterScreen";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { IntroScreen } from "@/components/IntroScreen";
import { chapters, loadingMessages } from "@/data/chapters";

const TRANSITION_MS = 2000;

/** Subtle per-chapter background tint */
const CHAPTER_BACKGROUNDS = [
  "radial-gradient(circle at 50% 0%, #fffaf1 0%, #fff7ea 42%, #f5dbe0 100%)",
  "radial-gradient(circle at 50% 0%, #fff9ee 0%, #fff7ea 40%, #f0d8cc 100%)",
  "radial-gradient(circle at 50% 0%, #fef8ed 0%, #fff7ea 38%, #eedde5 100%)",
  "radial-gradient(circle at 50% 0%, #fffaf1 0%, #fff7ea 44%, #e8d6e0 100%)"
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
    }, 2500); // 2.5s to let the intro zoom finish
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
