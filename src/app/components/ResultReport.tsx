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

const MOCK_ANALYSIS: Record<TestType, { title: string; summary: string; paragraphs: string[]; keywords: string[] }> = {
  rain: {
    title: "비 속에서도 걸어가는 당신에게",
    summary: "당신의 그림에서 강인한 내면의 의지와 함께, 조용한 고독을 간직한 따뜻한 마음이 느껴집니다.",
    paragraphs: [
      "빗속에 서 있는 당신의 사람은 혼자이지만, 굳건히 서 있었습니다. 이는 외부의 스트레스나 어려움 앞에서도 당신이 쉽사리 무너지지 않는 내적 강인함을 지니고 있음을 보여줍니다.",
      "비는 때로 감당하기 어려운 감정이나 상황을 상징합니다. 당신의 그림 속 빗줄기가 어떤 방향으로 흘렀는지, 얼마나 세차게 그려졌는지는 지금 당신이 느끼는 외부 압박의 무게를 반영합니다.",
      "이 시간, 당신에게 전하고 싶은 말이 있습니다. 비는 반드시 그칩니다. 그리고 그 빗속을 걸어왔다는 사실이, 당신이 이미 충분히 용감한 사람이라는 것을 증명합니다. 오늘 하루도 수고했습니다.",
    ],
    keywords: ["회복탄력성", "내적 강인함", "고독", "자기보호"],
  },
  starwave: {
    title: "별과 파도 사이에서 발견한 당신",
    summary: "당신의 감성적인 풍경 속에서 깊은 내면의 풍요로움과 감정의 역동성이 느껴집니다.",
    paragraphs: [
      "별의 수와 위치는 당신이 맺고 있는 관계와 꿈의 밀도를 나타냅니다. 별을 듬뿍 그린 당신은 많은 것들을 소중히 여기고, 연결에서 의미를 찾는 사람일 수 있습니다.",
      "파도의 높이와 세기는 현재 감정의 에너지를 반영합니다. 크고 역동적인 파도는 강한 감정적 활력을, 잔잔한 파도는 안정과 평온을 의미합니다.",
      "하늘과 바다의 경계에 서 있는 당신은, 이상과 현실 사이의 균형을 찾는 과정에 있는지도 모릅니다. 그 여정 자체가 이미 아름답습니다.",
    ],
    keywords: ["감수성", "관계 지향", "감정적 역동성", "이상주의"],
  },
  hexagon: {
    title: "여섯 개의 창문으로 들여다본 당신의 세계",
    summary: "각 도형 속에 담긴 이미지들이 당신의 삶의 여섯 가지 영역을 조화롭게 표현하고 있습니다.",
    paragraphs: [
      "육도형 검사는 자아, 가족, 사회적 관계, 욕구, 두려움, 희망이라는 여섯 가지 심리적 영역을 탐구합니다. 각 도형 안에 무엇을 그렸는지가 그 영역에 대한 당신의 무의식적 태도를 드러냅니다.",
      "도형 안의 밀도와 공간 활용도는 각 영역에 당신이 얼마나 에너지를 투입하고 있는지를 보여줍니다. 꽉 찬 도형은 몰입과 관심을, 여백이 많은 도형은 거리감이나 탐색의 여지를 의미합니다.",
      "당신의 그림은 내면의 다양한 면들이 서로 대화하고 있음을 보여줍니다. 그 대화에 귀 기울여 보세요 — 거기에 당신만의 답이 있습니다.",
    ],
    keywords: ["자아 인식", "다면적 자아", "내적 균형", "심리적 영역"],
  },
  htp: {
    title: "집과 나무와 사람이 전하는 당신의 이야기",
    summary: "세 가지 상징이 조화를 이루는 당신의 그림에서 안정을 추구하는 따뜻한 내면이 느껴집니다.",
    paragraphs: [
      "집은 당신이 안전함을 느끼는 공간, 혹은 가족과 기원에 대한 감정을 상징합니다. 집을 얼마나 크게, 어떤 위치에 그렸는지는 당신의 소속감과 안정감에 대한 이야기를 담고 있습니다.",
      "나무는 당신의 성장과 생명력을 나타냅니다. 뿌리, 줄기, 가지의 표현 방식에서 당신이 삶의 근거를 어디서 찾는지, 그리고 어떤 방향으로 성장하고 싶은지를 엿볼 수 있습니다.",
      "사람의 표정과 자세, 크기는 당신의 자아상을 반영합니다. 당신이 그린 사람을 바라보며 물어보세요: 저 사람은 지금 어떤 기분일까요? 어디로 가고 있을까요? 그 답이 당신의 현재입니다.",
    ],
    keywords: ["가정과 안정", "성장 욕구", "자아상", "소속감"],
  },
};

interface Props {
  testType: TestType;
  userInfo: UserInfo;
  drawingDataUrl: string;
  onRestart: () => void;
}

export function ResultReport({ testType, userInfo, drawingDataUrl, onRestart }: Props) {
  const analysis = MOCK_ANALYSIS[testType];

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
          <h1 style={{ fontSize: "1.9rem", lineHeight: 1.5 }}>{analysis.title}</h1>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed text-sm">
            {analysis.summary}
          </p>
        </motion.div>

        {/* Drawing + Analysis */}
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

          {/* Keywords */}
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
                {analysis.keywords.map((kw) => (
                  <span key={kw} className="bg-accent text-primary rounded-full px-3 py-1 text-sm">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-secondary rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1.5">검사 정보</p>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">검사 유형: </span>{TEST_NAMES[testType]}</p>
                <p><span className="text-muted-foreground">기분: </span>{userInfo.mood}</p>
                {userInfo.concern && (
                  <p><span className="text-muted-foreground">마음의 이야기: </span>{userInfo.concern.slice(0, 30)}{userInfo.concern.length > 30 ? "..." : ""}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Letter */}
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
            {analysis.paragraphs.map((para, i) => (
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
