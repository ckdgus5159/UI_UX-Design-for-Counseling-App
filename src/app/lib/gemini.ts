import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("🚨 [환경 변수 누락] VITE_GEMINI_API_KEY가 시스템에 존재하지 않습니다.");
}

const genAI = new GoogleGenerativeAI(apiKey || "MISSING_API_KEY");

export const analyzeDrawing = async (userInfo: any, imageBase64: string) => {
  if (!apiKey || apiKey === "MISSING_API_KEY") {
    throw new Error("Gemini API Key가 누락되었습니다. Vercel 환경 변수 설정을 확인해주세요.");
  }

  // 🌟 가장 안정적으로 작동했던 Pro 모델 유지
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
  
  const base64Data = imageBase64.split(",")[1];
  if (!base64Data) {
    throw new Error("올바르지 않은 이미지 데이터 형식입니다.");
  }

  let specificGuide = "";
  const testType = userInfo.testType || "";

  // 🌟 각 검사별로 AI가 '무엇을' 찾아내야 하는지 명확한 돋보기를 쥐어줍니다.
  switch (testType) {
    case "rain":
      specificGuide = `
      이 검사는 '빗속의 사람(PITR)' 검사입니다. 아래 요소들을 이미지에서 세밀히 찾아내어 분석의 '근거'로 삼아줘:
      - '비의 양과 형태'(선이 굵고 많은지, 얇고 잔잔한지) ➡️ 내담자가 느끼는 스트레스의 크기
      - '우산, 장화, 비옷, 가림막 등 대처 자원의 유무와 크기' ➡️ 스트레스를 방어하는 자아의 힘
      - '인물의 표정, 크기, 위치' ➡️ 자존감과 현재 정서 상태
      `;
      break;
    case "starwave":
      specificGuide = `
      이 검사는 '별과 파도(SWT)' 검사입니다. 아래 요소들을 이미지에서 세밀히 찾아내어 분석의 '근거'로 삼아줘:
      - '밤하늘 별의 개수, 크기, 모양' ➡️ 내담자의 이상향, 목표, 미래에 대한 희망과 동기
      - '파도의 높낮이, 선의 굴곡, 거칠기' ➡️ 무의식적인 감정의 울렁임과 불안정성
      - '바위나 다른 지형지물의 유무' ➡️ 현실적인 지지 기반과 장벽
      `;
      break;
    case "hexagon":
      specificGuide = `
      이 검사는 '육도형' 검사입니다. 아래 요소들을 이미지에서 세밀히 찾아내어 분석의 '근거'로 삼아줘:
      - '6개의 분할된 칸 내부가 얼마나 채워져 있는지(공백 유무)' ➡️ 특정 영역에 대한 심리적 회피나 위축
      - '도형 간 선의 일관성과 필압(진하기)' ➡️ 현재 인지적 균형과 심리적 에너지의 분배 상태
      `;
      break;
    case "htp":
      specificGuide = `
      이 검사는 '집-나무-사람(HTP)' 검사입니다. 아래 요소들을 이미지에서 세밀히 찾아내어 분석의 '근거'로 삼아줘:
      - '집(House)'의 문, 창문, 지붕 구조 ➡️ 가정 환경에 대한 인식 및 타인과의 소통 방식
      - '나무(Tree)'의 뿌리, 줄기, 가지 형태 ➡️ 무의식적인 성장 욕구와 생명력, 현실 기반
      - '사람(Person)'의 크기, 신체 부위 생략 여부 ➡️ 현실의 자아상과 자존감
      - '세 요소의 상대적인 크기와 배치 균형' ➡️ 전반적인 심리적 안정감
      `;
      break;
    default:
      specificGuide = "그림에서 관찰되는 선의 형태, 크기, 배치를 객관적 시각적 근거로 삼아 분석해줘.";
  }

  // 🌟 AI에게 역할과 출력 형식을 아주 엄격하게 지시합니다.
  const prompt = `
  너는 미술 치료 경력 15년 차의 임상 심리 전문가이자 따뜻한 공감을 전하는 상담가야.
  제공된 이미지를 전문가의 눈으로 정밀하게 스캔한 뒤 심리 분석 리포트를 작성해줘.

  [내담자 정보]
  - 연령: ${userInfo.age}
  - 성별: ${userInfo.gender}
  - 현재 하고 있는 일: ${userInfo.job}
  - 현재 고민: ${userInfo.concern}
  
  [분석 가이드라인]
  ${specificGuide}
  
  [★ 필수 답변 작성 규칙 - 신뢰성과 근거 강화]
  1. **절대 추측으로만 쓰지 마:** 심리 상태를 설명할 때는 반드시 "그림에서 우산이 얼굴을 푹 덮을 만큼 크게 그려진 것을 보아", "파도의 선이 둥글고 부드럽게 표현된 점으로 미루어 볼 때"와 같이 **그림 속 시각적 단서를 명확한 근거로 먼저 제시**해줘. 시각적 단서 없이 심리상태만 둥구름 잡듯 나열하면 안 돼.
  2. **말투와 톤앤매너:** 15년 차 전문가답게 논리적이면서도, 내담자의 고민을 부드럽게 감싸안아 주는 다정하고 따뜻한 위로의 말투(해요체)를 유지해줘. 차가운 의학적 진단명은 절대 피할 것.
  3. **구조화:** 글을 읽기 편하게 아래의 3가지 서사 구조로 단락을 나누어 작성해줘.
     - [마음의 문을 열며]: 내담자의 사연(고민)에 대한 진심 어린 공감과 첫인상
     - [그림 속 마음의 신호]: 그림의 구체적 특징(시각적 근거)과 그것이 뜻하는 내면의 상태 연결
     - [당신을 위한 다독임]: 고민을 이겨내고 앞으로 나아가기 위한 따뜻한 조언
  `;

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/png" } }
    ]);
    
    return result.response.text();
  } catch (apiError: any) {
    console.error("Gemini API 호출 내부 오류:", apiError);
    throw new Error("AI 분석 중 오류가 발생했습니다.");
  }
};