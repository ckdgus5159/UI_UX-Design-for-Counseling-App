import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ArrowLeft, Users, TrendingUp, BookOpen, Calendar } from "lucide-react";

const TEST_NAMES: Record<string, string> = {
  rain: "빗속의 사람",
  starwave: "별과 파도",
  hexagon: "육도형 검사",
  htp: "집·나무·사람",
};

const MOCK_RECORDS = [
  { id: 1, date: "2026-06-10", testType: "rain", mood: "우울함 😔", age: "20대", summary: "내적 강인함과 자기보호 의지가 강하게 나타남. 우산이 작게 그려져 있어 보호막에 대한 욕구가 크게 관찰됨.", keywords: ["회복탄력성", "고독", "자기보호"] },
  { id: 2, date: "2026-06-10", testType: "htp", mood: "보통 😐", age: "30대", summary: "집이 중앙에 크게 배치되어 안정감에 대한 강한 욕구가 느껴짐. 나무는 뿌리가 깊게 표현되어 현실 기반이 탄탄함.", keywords: ["가정과 안정", "성장 욕구", "소속감"] },
  { id: 3, date: "2026-06-09", testType: "starwave", mood: "좋음 🙂", age: "20대", summary: "별이 많고 고르게 분포되어 대인관계가 풍요로움을 시사. 파도는 잔잔하게 표현되어 내면이 평온한 상태.", keywords: ["감수성", "관계 지향", "이상주의"] },
  { id: 4, date: "2026-06-09", testType: "hexagon", mood: "불안함 😰", age: "40대", summary: "일부 도형이 비어있거나 색칠이 강하게 된 부분에서 특정 영역의 심리적 긴장이 관찰됨.", keywords: ["내적 균형", "자아 인식", "심리적 영역"] },
  { id: 5, date: "2026-06-08", testType: "rain", mood: "매우 좋음 😊", age: "10대", summary: "밝고 활기찬 선으로 그려진 그림. 우산이 크고 화려하며 주변 자연 요소들도 풍부하게 표현됨.", keywords: ["회복탄력성", "내적 강인함"] },
];

const STATS = [
  { icon: Users, label: "총 상담 건수", value: "247", change: "+12 이번 주" },
  { icon: TrendingUp, label: "가장 많은 검사", value: "빗속의 사람", change: "38%" },
  { icon: BookOpen, label: "평균 완료율", value: "84%", change: "+3% 지난달" },
  { icon: Calendar, label: "오늘 상담", value: "14건", change: "오늘" },
];

interface Props {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? MOCK_RECORDS : MOCK_RECORDS.filter((r) => r.testType === filter);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-6 py-4 flex items-center justify-between bg-card">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft size={15} />
          상담소로 돌아가기
        </button>
        <h2 style={{ fontSize: "1rem", fontFamily: "'Noto Serif KR', serif" }}>관리자 대시보드</h2>
        <div />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="bg-card border border-border rounded-2xl p-4"
            >
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mb-3">
                <s.icon size={15} className="text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p style={{ fontSize: "1.2rem", fontFamily: "'Noto Serif KR', serif" }}>{s.value}</p>
              <p className="text-xs text-primary mt-1">{s.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Records */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ fontSize: "1.1rem" }}>상담 기록</h3>
            <div className="flex gap-2">
              {["all", "rain", "starwave", "hexagon", "htp"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs rounded-full px-3 py-1.5 transition-colors ${
                    filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f === "all" ? "전체" : TEST_NAMES[f]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filtered.map((record) => (
              <motion.div
                key={record.id}
                layout
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === record.id ? null : record.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{record.date}</span>
                    <span className="bg-accent text-primary rounded-full px-2.5 py-0.5 text-xs">
                      {TEST_NAMES[record.testType]}
                    </span>
                    <span className="text-sm">{record.mood}</span>
                    <span className="text-xs text-muted-foreground">{record.age}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expanded === record.id ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expanded === record.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-border pt-4">
                        <p className="text-sm leading-relaxed text-foreground mb-4">{record.summary}</p>
                        <div className="flex flex-wrap gap-2">
                          {record.keywords.map((kw) => (
                            <span key={kw} className="bg-secondary text-muted-foreground rounded-full px-3 py-1 text-xs">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              해당 검사의 기록이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
