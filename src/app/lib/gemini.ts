import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("🚨 [환경 변수 누락] VITE_GEMINI_API_KEY가 시스템에 존재하지 않습니다.");
}

// 빈 키가 설정되면 에러가 나므로 임시 방어용 가짜 키 문자열 주입
const genAI = new GoogleGenerativeAI(apiKey || "MISSING_API_KEY");

export const analyzeDrawing = async (userInfo: any, imageBase64: string) => {
  if (!apiKey || apiKey === "MISSING_API_KEY") {
    throw new Error("Gemini API Key가 누락되었습니다. Vercel 환경 변수 설정을 확인해주세요.");
  }

  // 기본 모델 명칭 설정
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  
  // Base64 이미지 포맷 정제
  const base64Data = imageBase64.split(",")[1];
  if (!base64Data) {
    throw new Error("올바르지 않은 이미지 데이터 형식입니다.");
  }

  // 박사님의 실제 프로젝트 컴포넌트 규격(소문자 키값)에 맞춰 가이드라인 매핑 수정
  let specificGuide = "";
  const testType = userInfo.testType || "";

  switch (testType) {
    case "rain":
      specificGuide = "이 그림은 '빗속의 사람(PITR)' 검사입니다. 비의 양(스트레스의 크기), 우산/비옷/장화 등의 유무(스트레스 대처 자원), 사람의 표정과 크기를 중심으로 내밀한 내면 심리를 분석해줘.";
      break;
    case "starwave":
      specificGuide = "이 그림은 '별과 파도(SWT)' 검사입니다. 밤하늘의 별(목표, 이상향, 희망), 흔들리거나 잔잔한 파도(현재의 감정적 상태와 무의식적 흐름)를 중심으로 심리 상태를 분석해줘.";
      break;
    case "hexagon":
      specificGuide = "이 그림은 '육도형' 검사입니다. 각 칸에 나뉜 도형들의 조화로운 배치, 선의 명확성, 공백 유무를 바탕으로 내담자의 인지적·감정적 균형 상태를 심도 있게 해석해줘.";
      break;
    case "htp":
      specificGuide = "이 그림은 '집-나무-사람(HTP)' 검사입니다. 가정 환경과 내면을 상징하는 집, 정신적 성장을 뜻하는 나무, 자아상을 뜻하는 사람의 상대적 크기와 배치를 종합적으로 연결하여 심리를 분석해줘.";
      break;
    default:
      specificGuide = "제공된 투사형 미술 치료 그림을 바탕으로 전체적인 자아 상태와 정서적 안정감을 따뜻하게 분석해줘.";
  }

  const prompt = `
  너는 미술 치료 경력 15년 차의 임상 심리 전문가이자 따뜻한 공감을 전하는 상담가야.
  
  [내담자 프로필]
  - 연령대: ${userInfo.age}
  - 성별: ${userInfo.gender}
  - 직업: ${userInfo.job}
  - 현재 겪고 있는 고민: ${userInfo.concern}
  
  [분석 가이드라인]
  ${specificGuide}
  
  [답변 작성 요령]
  1. 내담자의 현재 고민 사항과 그림에서 나타나는 특징적인 요소를 다정하게 연결하여 설명해줘.
  2. 기계적인 판정이나 차가운 의학적 낙인 용어(예: 환자임, 치료 필요 등)는 절대 사용하지 말고, 내담자만을 위한 따뜻한 위로의 리포트 형태로 작성해줘.
  3. 마음을 다독여주는 따뜻한 조언을 담아 3~4개의 가독성 좋은 단락으로 나누어 구성해줘.
  `;

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/png" } }
    ]);
    
    return result.response.text();
  } catch (apiError: any) {
    console.error("Gemini API 호출 내부 오류:", apiError);
    throw new Error(`Google AI 서비스 응답 실패: ${apiError.message || apiError}`);
  }
};