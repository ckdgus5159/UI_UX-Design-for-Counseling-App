import { motion } from "motion/react";
import { BookOpen, Feather, Heart, Sparkles } from "lucide-react";

const TEST_TYPES = [
  { id: "rain", icon: "🌧️", title: "빗속의 사람", desc: "비 오는 날의 당신은 어떤 모습인가요?" },
  { id: "starwave", icon: "🌊", title: "별과 파도", desc: "밤하늘과 바다 사이, 당신의 감정을 그려보세요." },
  { id: "hexagon", icon: "⬡", title: "육도형 검사", desc: "여섯 개의 선 안에 담긴 당신의 세계." },
  { id: "htp", icon: "🏡", title: "집·나무·사람", desc: "집과 나무와 사람이 말하는 당신의 이야기." },
];

interface Props {
  onStart: () => void;
  onAdmin: () => void;
}

export function HomePage({ onStart, onAdmin }: Props) {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <BookOpen className="text-primary" size={20} />
          <span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "1.05rem", color: "var(--foreground)" }}>
            마음 서재 그림 상담소
          </span>
        </div>
        <button
          onClick={onAdmin}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          관리자
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 bg-accent text-primary rounded-full px-4 py-1.5 text-sm mb-8">
            <Sparkles size={13} />
            <span>AI 기반 투사적 그림 심리 검사</span>
          </div>
          <h1 className="max-w-xl mx-auto mb-5" style={{ fontSize: "2.4rem", lineHeight: 1.45 }}>
            당신의 마음을 그림으로<br />읽어드립니다
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed" style={{ fontSize: "1.05rem" }}>
            도화지 위에 자유롭게 그린 한 장의 그림이<br />
            당신도 몰랐던 내면의 이야기를 들려줄 거예요.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="bg-primary text-primary-foreground rounded-full px-10 py-3.5 hover:opacity-90 transition-opacity shadow-sm"
            style={{ fontSize: "1rem" }}
          >
            상담소 입장하기
          </motion.button>
        </motion.div>

        {/* Decorative */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-20 w-full max-w-2xl mx-auto relative"
        >
          <div className="rounded-2xl overflow-hidden border border-border bg-card p-8 text-left shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Feather size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">오늘의 상담 편지</p>
                <p className="leading-relaxed text-foreground" style={{ fontSize: "0.95rem" }}>
                  "빗속의 당신은 우산을 들고 있었습니다. 그것은 당신이 스스로를 보호하고자 하는 의지를 보여줍니다. 비는 지금 당신이 느끼는 외부의 압박이지만, 당신은 그 속에서도 걸어가고 있어요..."
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart size={13} className="text-primary" />
              <span>AI 심리 분석 리포트 미리보기</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Test types */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-center mb-2" style={{ fontSize: "1.5rem" }}>검사 도구 소개</h2>
        <p className="text-center text-muted-foreground mb-10 text-sm">네 가지 투사적 그림 검사 중 하나를 선택해 시작할 수 있습니다.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEST_TYPES.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5, ease: "easeOut" }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-sm transition-all cursor-default"
            >
              <div className="text-2xl mb-3">{t.icon}</div>
              <h3 className="mb-1.5" style={{ fontSize: "1rem", fontFamily: "'Noto Serif KR', serif" }}>{t.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-muted-foreground text-sm">
        <p>마음 서재 그림 상담소 · 당신의 무의식을 위한 공간</p>
      </footer>
    </div>
  );
}
