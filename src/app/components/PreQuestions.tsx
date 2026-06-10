import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import type { TestType } from "./TestSelection";

const TEST_NAMES: Record<TestType, string> = {
  rain: "빗속의 사람",
  starwave: "별과 파도",
  hexagon: "육도형 검사",
  htp: "집·나무·사람",
};

const QUESTIONS = [
  { key: "age", label: "연령대", type: "select", options: ["10대", "20대", "30대", "40대", "50대", "60대 이상"] },
  { key: "gender", label: "성별", type: "select", options: ["선택 안 함", "여성", "남성", "논바이너리", "기타"] },
  {
    key: "mood",
    label: "지금 이 순간, 당신의 기분은 어떤가요?",
    type: "select",
    options: ["매우 좋음 😊", "좋음 🙂", "보통 😐", "우울함 😔", "불안함 😰", "화남 😠", "복잡함 🌀"],
  },
  {
    key: "concern",
    label: "요즘 마음에 걸리는 것이 있다면?",
    type: "textarea",
    placeholder: "짧게라도 적어주셔도 좋아요. 비워두셔도 됩니다.",
  },
];

export interface UserInfo {
  age: string;
  gender: string;
  mood: string;
  concern: string;
}

interface Props {
  testType: TestType;
  onNext: (info: UserInfo) => void;
  onBack: () => void;
}

export function PreQuestions({ testType, onNext, onBack }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const q = QUESTIONS[step];
  const value = answers[q.key] || "";

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      onNext({
        age: answers.age || "미입력",
        gender: answers.gender || "선택 안 함",
        mood: answers.mood || "보통",
        concern: answers.concern || "",
      });
    }
  };

  const canProceed = q.type !== "select" || value !== "";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} />
          <span className="text-sm">검사 선택으로</span>
        </button>

        {/* Progress */}
        <div className="flex gap-1.5 mb-10">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full flex-1 transition-all duration-500"
              style={{ background: i <= step ? "var(--primary)" : "var(--muted)" }}
            />
          ))}
        </div>

        <div className="mb-4 text-sm text-muted-foreground">
          {TEST_NAMES[testType]} 검사 전 · {step + 1} / {QUESTIONS.length}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-card border border-border rounded-2xl p-8 shadow-sm"
          >
            <h2 className="mb-6" style={{ fontSize: "1.25rem" }}>{q.label}</h2>

            {q.type === "select" && (
              <div className="flex flex-col gap-2.5">
                {q.options!.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers({ ...answers, [q.key]: opt })}
                    className={`text-left rounded-xl px-4 py-3 border text-sm transition-all ${
                      value === opt
                        ? "border-primary bg-accent text-primary"
                        : "border-border bg-background hover:border-primary/40 hover:bg-secondary"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {q.type === "textarea" && (
              <textarea
                value={value}
                onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
                placeholder={q.placeholder}
                rows={4}
                className="w-full rounded-xl border border-border bg-input-background px-4 py-3 text-sm leading-relaxed outline-none focus:border-primary transition-colors resize-none"
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 rounded-full border border-border py-3 text-sm hover:bg-secondary transition-colors"
            >
              이전
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={q.type === "select" && !canProceed}
            className="flex-1 rounded-full bg-primary text-primary-foreground py-3 text-sm disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            {step < QUESTIONS.length - 1 ? "다음" : "그림 그리러 가기 →"}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          모든 정보는 익명으로 분석에만 활용됩니다.
        </p>
      </div>
    </div>
  );
}
