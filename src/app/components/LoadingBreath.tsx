import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const BREATH_PHASES = [
  { label: "숨을 들이 쉬세요", duration: 4000, scale: 1.4 },
  { label: "잠깐 멈추세요", duration: 2000, scale: 1.4 },
  { label: "천천히 내쉬세요", duration: 4000, scale: 1 },
  { label: "편안하게", duration: 2000, scale: 1 },
];

const LOADING_MESSAGES = [
  "그림 속 선의 흐름을 읽고 있어요...",
  "당신의 감정 언어를 해석하는 중이에요...",
  "무의식의 메시지를 정성스럽게 담고 있어요...",
  "당신만을 위한 편지를 쓰고 있어요...",
];

interface Props {
  onDone: () => void;
}

export function LoadingBreath({ onDone }: Props) {
  const [phase, setPhase] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const total = 14000;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / total) * 100, 100));
      if (elapsed >= total) {
        clearInterval(interval);
        onDone();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [onDone]);

  useEffect(() => {
    let phaseIdx = 0;
    let totalDelay = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    BREATH_PHASES.forEach((p, i) => {
      totalDelay += i > 0 ? BREATH_PHASES[i - 1].duration : 0;
      const t = setTimeout(() => setPhase(i), totalDelay);
      timers.push(t);
    });
    const loop = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % BREATH_PHASES.length;
    }, BREATH_PHASES.reduce((a, b) => ({ ...a, duration: a.duration + b.duration })).duration);
    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  const currentPhase = BREATH_PHASES[phase % BREATH_PHASES.length];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-10"
      >
        {/* Breath circle */}
        <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
          {/* Outer ring */}
          <motion.div
            animate={{ scale: currentPhase.scale, opacity: 0.25 }}
            transition={{ duration: currentPhase.duration / 1000, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border-2 border-primary"
          />
          {/* Middle ring */}
          <motion.div
            animate={{ scale: currentPhase.scale * 0.8, opacity: 0.4 }}
            transition={{ duration: currentPhase.duration / 1000, ease: "easeInOut" }}
            className="absolute rounded-full border border-primary"
            style={{ inset: "10%" }}
          />
          {/* Core */}
          <motion.div
            animate={{ scale: currentPhase.scale * 0.55 }}
            transition={{ duration: currentPhase.duration / 1000, ease: "easeInOut" }}
            className="rounded-full bg-primary/15"
            style={{ width: 80, height: 80 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: currentPhase.scale * 0.3 + 0.1 }}
              transition={{ duration: currentPhase.duration / 1000, ease: "easeInOut" }}
              className="w-4 h-4 rounded-full bg-primary"
            />
          </div>
        </div>

        {/* Phase label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
            className="text-primary text-lg"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            {currentPhase.label}
          </motion.p>
        </AnimatePresence>

        {/* Loading message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-muted-foreground text-sm text-center max-w-xs leading-relaxed"
          >
            {LOADING_MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <p className="text-xs text-muted-foreground">분석이 완료되면 자동으로 이동합니다</p>
      </motion.div>
    </div>
  );
}
