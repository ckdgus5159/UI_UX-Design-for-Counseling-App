import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

export type TestType = "rain" | "starwave" | "hexagon" | "htp";

const TESTS = [
  {
    id: "rain" as TestType,
    emoji: "🌧️",
    title: "빗속의 사람",
    subtitle: "PITR (Person In The Rain)",
    desc: "비가 내리는 풍경 속에 사람을 그려주세요. 우산이 있는지, 어떤 표정인지 — 모든 것이 당신의 이야기입니다.",
    duration: "5~10분",
    color: "bg-blue-50 border-blue-100",
  },
  {
    id: "starwave" as TestType,
    emoji: "🌊",
    title: "별과 파도",
    subtitle: "Stars & Waves",
    desc: "밤하늘의 별과 바다의 파도를 자유롭게 표현해 보세요. 별의 수와 파도의 모양에 담긴 감정을 읽어드립니다.",
    duration: "5~10분",
    color: "bg-indigo-50 border-indigo-100",
  },
  {
    id: "hexagon" as TestType,
    emoji: "⬡",
    title: "육도형 검사",
    subtitle: "Hexagonal Drawing Test",
    desc: "여섯 개의 도형 안에 그림을 채워주세요. 각 도형이 상징하는 관계와 감정을 분석해 드립니다. (가이드 라인 제공)",
    duration: "10~15분",
    color: "bg-teal-50 border-teal-100",
  },
  {
    id: "htp" as TestType,
    emoji: "🏡",
    title: "집·나무·사람",
    subtitle: "House-Tree-Person",
    desc: "집, 나무, 사람을 하나의 그림 속에 그려주세요. 가장 오래된 심리 투사 검사 중 하나로, 깊은 무의식을 탐구합니다.",
    duration: "10~15분",
    color: "bg-amber-50 border-amber-100",
  },
];

interface Props {
  onSelect: (type: TestType) => void;
  onBack: () => void;
}

export function TestSelection({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft size={16} />
          <span className="text-sm">돌아가기</span>
        </button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="mb-2" style={{ fontSize: "1.9rem" }}>어떤 검사로 시작할까요?</h1>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            편안한 마음으로 하나를 골라보세요. 정답은 없습니다, 지금 이 순간 당신의 마음이 이끄는 대로.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {TESTS.map((t, i) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.45, ease: "easeOut" }}
              whileHover={{ x: 4 }}
              onClick={() => onSelect(t.id)}
              className={`text-left rounded-2xl border p-6 ${t.color} hover:shadow-md transition-all group`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl pt-0.5">{t.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 style={{ fontSize: "1.05rem", fontFamily: "'Noto Serif KR', serif" }}>{t.title}</h3>
                    <span className="text-xs text-muted-foreground">{t.subtitle}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{t.desc}</p>
                  <span className="text-xs text-primary bg-accent rounded-full px-3 py-1">소요 시간: {t.duration}</span>
                </div>
                <div className="text-muted-foreground group-hover:text-primary transition-colors pt-1">→</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
