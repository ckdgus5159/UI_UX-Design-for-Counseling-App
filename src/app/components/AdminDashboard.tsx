import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ArrowLeft, Users, TrendingUp, BookOpen, Calendar } from "lucide-react";
import { supabase } from "../lib/supabase"; // 🌟 추가됨: Supabase 연동

const TEST_NAMES: Record<string, string> = {
  rain: "빗속의 사람",
  starwave: "별과 파도",
  hexagon: "육도형 검사",
  htp: "집·나무·사람",
};

// 🌟 추가됨: DB 데이터 타입 정의
interface TestRecord {
  id: number;
  age: string;
  gender: string;
  job: string;
  concern: string;
  test_type: string;
  image_base64: string;
  analysis_result: string;
  created_at: string;
}

interface Props {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: Props) {
  // 🌟 추가됨: 상태 관리 로직
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  const ADMIN_PASSWORD = "admin1234!";

  // 🌟 추가됨: 데이터 불러오기 함수
  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("drawing_tests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setRecords(data);
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchRecords();
    } else {
      alert("비밀번호가 일치하지 않습니다.");
      setPassword("");
    }
  };

  // 🌟 추가됨: 실시간 통계 계산
  const todayCount = records.filter(r => r.created_at.startsWith(new Date().toISOString().split('T')[0])).length;
  
  const getMostFrequentTest = () => {
    if (records.length === 0) return "-";
    const counts = records.reduce((acc, curr) => {
      acc[curr.test_type] = (acc[curr.test_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostFrequent = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    return TEST_NAMES[mostFrequent] || mostFrequent;
  };

  const STATS = [
    { icon: Users, label: "총 상담 건수", value: `${records.length}건`, change: "누적" },
    { icon: TrendingUp, label: "가장 많은 검사", value: getMostFrequentTest(), change: "전체 기준" },
    { icon: BookOpen, label: "응답 완료율", value: "100%", change: "정상 작동중" },
    { icon: Calendar, label: "오늘 상담", value: `${todayCount}건`, change: "오늘 하루" },
  ];

  const filtered = filter === "all" ? records : records.filter((r) => r.test_type === filter);

  // 🌟 추가됨: 로그인 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border max-w-sm w-full text-center">
          <h1 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: "'Noto Serif KR', serif" }}>관리자 접속</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" className="w-full px-4 py-3 border border-border bg-background rounded-xl focus:outline-none" />
            <button type="submit" className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-xl">접속하기</button>
          </form>
          <button onClick={onBack} className="mt-4 text-sm text-muted-foreground underline">돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
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

          {isLoading ? (
             <div className="text-center py-16 text-muted-foreground text-sm animate-pulse">데이터를 불러오는 중입니다...</div>
          ) : (
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
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-xs text-muted-foreground">{new Date(record.created_at).toLocaleDateString()}</span>
                      <span className="bg-accent text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">
                        {TEST_NAMES[record.test_type] || record.test_type}
                      </span>
                      <span className="text-sm font-medium">{record.age}세 / {record.gender}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[150px]">고민: {record.concern}</span>
                    </div>
                    <motion.div animate={{ rotate: expanded === record.id ? 180 : 0 }} transition={{ duration: 0.25 }}>
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
                        <div className="px-5 pb-5 border-t border-border pt-4 flex flex-col md:flex-row gap-6">
                          {/* 🌟 추가됨: 사용자 그림 이미지 영역 */}
                          <div className="w-full md:w-1/3 flex-shrink-0">
                            <span className="text-xs font-bold text-muted-foreground block mb-2">제출된 그림</span>
                            <img src={record.image_base64} alt="사용자 그림" className="w-full rounded-xl border border-border bg-white" />
                          </div>
                          {/* 🌟 추가됨: AI 분석 결과 영역 */}
                          <div className="w-full md:w-2/3">
                            <span className="text-xs font-bold text-primary block mb-2">AI 분석 리포트</span>
                            <div className="p-4 bg-background rounded-xl border border-border text-sm leading-relaxed text-foreground whitespace-pre-wrap h-full">
                              {record.analysis_result}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}

          {filtered.length === 0 && !isLoading && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              해당 검사의 기록이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}