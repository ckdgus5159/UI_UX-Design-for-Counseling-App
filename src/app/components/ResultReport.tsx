import { motion } from "motion/react";
import { Heart, RefreshCw, BookOpen, Download } from "lucide-react";
import type { TestType } from "./TestSelection";
import type { UserInfo } from "./PreQuestions";

const TEST_NAMES: Record<TestType, string> = {
  rain: "빗속의 사람",
  starwave: "별과 파도",
  hexagon: "육도형 검사",
  htp: "집·나무·사람",
};

// UI 구조 유지를 위한 기본(Fallback) 키워드
const TEST_KEYWORDS: Record<TestType, string[]> = {
  rain: ["회복탄력성", "내적 강인함", "스트레스 대처", "자기보호"],
  starwave: ["감수성", "관계 지향", "감정적 역동성", "이상주의"],
  hexagon: ["자아 인식", "다면적 자아", "내적 균형", "심리적 영역"],
  htp: ["가정과 안정", "성장 욕구", "자아상", "소속감"],
};

interface Props {
  testType: TestType;
  userInfo: UserInfo;
  drawingDataUrl: string;
  onRestart: () => void;
  analysisResult: string; 
}

export function ResultReport({ testType, userInfo, drawingDataUrl, onRestart, analysisResult }: Props) {
  let contentText = "분석 결과를 불러오지 못했습니다. 다시 시도해 주세요.";
  let dynamicKeywords = TEST_KEYWORDS[testType];

  // 🌟 AI가 JSON 형태로 준 데이터를 해석(Parse)합니다.
  if (analysisResult) {
    try {
      const parsedData = JSON.parse(analysisResult);
      contentText = parsedData.content || analysisResult;
      
      // 추출된 키워드가 정상 배열이라면 교체합니다.
      if (parsedData.keywords && Array.isArray(parsedData.keywords)) {
        dynamicKeywords = parsedData.keywords;
      }
    } catch (error) {
      // JSON 파싱 실패 시 (과거 텍스트 데이터 등) 기존 텍스트를 그대로 사용합니다.
      contentText = analysisResult;
    }
  }

  // 본문의 마크다운 기호를 제거하고 문단별로 나눕니다.
  const displayParagraphs = contentText
    .replace(/[*#]/g, "")
    .split('\n')
    .filter(para => para.trim() !== '');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-accent text-primary rounded-full px-4 py-1.5 text-sm mb-5">
            <Heart size={13} />
            <span>{TEST_NAMES[testType]} 분석 결과</span>
          </div>
          <h1 style={{ fontSize: "1.9rem", lineHeight: 1.5 }}>마음 서재의 심리 리포트</h1>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed text-sm">
            당신의 그림 속 시각적 단서를 바탕으로 AI가 정성스럽게 분석한 결과입니다.
          </p>
        </motion.div>

        {/* Drawing + Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Drawing */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="px-5 py-3 border-b border-border">
              <p className="text-sm text-muted-foreground">당신의 그림</p>
            </div>
            <div className="p-4 bg-white">
              <img
                src={drawingDataUrl}
                alt="당신이 그린 그림"
                className="w-full rounded-lg"
                style={{ aspectRatio: "7/5", objectFit: "contain" }}
              />
            </div>
          </motion.div>

          {/* Keywords & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={16} className="text-primary" />
                <p className="text-sm text-muted-foreground">주요 심리 키워드</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {/* 🌟 AI가 분석한 맞춤형 동적 키워드 렌더링 */}
                {dynamicKeywords.map((kw, index) => (
                  <span key={index} className="bg-accent text-primary rounded-full px-3 py-1 text-sm font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-secondary rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1.5">검사 정보</p>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">검사 유형: </span>{TEST_NAMES[testType]}</p>
                <p><span className="text-muted-foreground">나이/성별: </span>{userInfo.age}세 / {userInfo.gender}</p>
                {userInfo.concern && (
                  <p><span className="text-muted-foreground">마음의 이야기: </span>{userInfo.concern.slice(0, 30)}{userInfo.concern.length > 30 ? "..." : ""}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Analysis Letter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-card border border-border rounded-2xl p-8 shadow-sm mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <Heart size={14} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">마음 서재의 편지</p>
          </div>
          <div className="space-y-5">
            {displayParagraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
                className="leading-loose text-foreground"
                style={{ fontSize: "0.95rem", fontFamily: "'Noto Serif KR', serif" }}
              >
                {para}
              </motion.p>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-8 pt-6 border-t border-border text-right"
          >
            <p className="text-muted-foreground text-sm" style={{ fontFamily: "'Noto Serif KR', serif" }}>
              마음 서재 그림 상담소 드림
            </p>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 flex-1 rounded-full border border-border py-3 text-sm hover:bg-secondary transition-colors"
          >
            <RefreshCw size={15} />
            다른 검사 해보기
          </button>
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.download = `마음서재_${TEST_NAMES[testType]}.png`;
              link.href = drawingDataUrl;
              link.click();
            }}
            className="flex items-center justify-center gap-2 flex-1 rounded-full bg-primary text-primary-foreground py-3 text-sm hover:opacity-90 transition-opacity"
          >
            <Download size={15} />
            그림 저장하기
          </button>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
          이 분석은 AI 기반 투사 검사 도구로, 임상적 진단을 대체하지 않습니다.<br />
          전문적인 심리 상담이 필요하시면 가까운 상담 기관에 문의해 주세요.
        </p>
      </div>
    </div>
  );
}