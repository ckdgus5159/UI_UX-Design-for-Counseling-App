import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const analyzeDrawing = async (userInfo: any, imageBase64: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const base64Data = imageBase64.split(",")[1];

  let specificGuide = "";
  switch (userInfo.testType) {
    case "PITR": specificGuide = "이 그림은 '빗속의 사람(PITR)' 검사입니다. 비의 양(스트레스), 우산/비옷 유무(대처 자원)를 중심으로 분석해줘."; break;
    case "SWT": specificGuide = "이 그림은 '별과 파도(SWT)' 검사입니다. 파도(감정), 별(희망)을 중심으로 분석해줘."; break;
    case "HEXAGON": specificGuide = "이 그림은 '육도형' 검사입니다. 도형의 배치, 연결성을 중심으로 심리적 균형 상태를 분석해줘."; break;
    case "HTP": specificGuide = "이 그림은 '집-나무-사람(HTP)' 검사입니다. 집, 나무, 사람의 배치를 종합적으로 분석해줘."; break;
    default: specificGuide = "제공된 그림을 바탕으로 전반적인 심리 상태를 분석해줘.";
  }

  const prompt = `
  너는 미술 치료 경력 15년 차의 전문 심리 상담가야. 
  [내담자 정보] 나이: ${userInfo.age}세, 성별: ${userInfo.gender}, 직업: ${userInfo.job}, 현재 고민: ${userInfo.concern}
  [분석 요청] ${specificGuide}
  내담자의 고민과 그림의 심리적 요소를 연결하여 따뜻하고 위로가 되는 3~4개의 단락으로 작성해줘. 의학적 진단처럼 보이지 않게 주의해.
  `;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Data, mimeType: "image/png" } }
  ]);
  
  return result.response.text();
};