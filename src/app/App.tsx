import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HomePage } from "./components/HomePage";
import { TestSelection } from "./components/TestSelection";
import type { TestType } from "./components/TestSelection";
import { PreQuestions } from "./components/PreQuestions";
import type { UserInfo } from "./components/PreQuestions";
import { DrawingCanvas } from "./components/DrawingCanvas";
import { LoadingBreath } from "./components/LoadingBreath";
import { ResultReport } from "./components/ResultReport";
import { AdminDashboard } from "./components/AdminDashboard";

// 🌟 추가됨: API 연동 파일 임포트
import { analyzeDrawing } from "./lib/gemini";
import { supabase } from "./lib/supabase";

type View = "home" | "select" | "prequestions" | "drawing" | "loading" | "result" | "admin";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function App() {
  const [view, setView] = useState<View>("home");
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [drawingDataUrl, setDrawingDataUrl] = useState<string>("");
  
  // 🌟 추가됨: AI 분석 결과를 담을 상태
  const [analysisResult, setAnalysisResult] = useState<string>("");

  const handleSelectTest = (t: TestType) => {
    setSelectedTest(t);
    setView("prequestions");
  };

  const handlePreQuestionsDone = (info: UserInfo) => {
    setUserInfo(info);
    setView("drawing");
  };

  // 🌟 변경됨: 그림 제출 시 로딩창을 띄우고 동시에 API 호출 및 DB 저장 수행
  const handleDrawingSubmit = async (dataUrl: string) => {
    setDrawingDataUrl(dataUrl);
    setView("loading"); // 로딩 애니메이션 뷰로 전환

    try {
      // 1. Gemini AI 분석 요청
      const resultText = await analyzeDrawing(userInfo, dataUrl);
      setAnalysisResult(resultText);

      // 2. Supabase DB에 기록 저장
      const { error } = await supabase.from('drawing_tests').insert([{
        age: userInfo?.age,
        gender: userInfo?.gender,
        job: userInfo?.job,
        concern: userInfo?.concern,
        test_type: selectedTest,
        image_base64: dataUrl,
        analysis_result: resultText
      }]);
      
      if (error) console.error("DB 저장 에러:", error);

      // 3. 모든 작업이 완료되면 결과창으로 전환
      setView("result");
    } catch (error) {
      console.error(error);
      alert("AI 분석 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setView("drawing");
    }
  };

  // LoadingBreath 내부에 있는 onDone은 API가 끝날 때 뷰를 전환하므로 빈 함수로 무시합니다.
  const handleLoadingDone = useCallback(() => {
    // 의도적으로 비워둠 (handleDrawingSubmit에서 전환을 제어함)
  }, []);

  const handleRestart = () => {
    setSelectedTest(null);
    setUserInfo(null);
    setDrawingDataUrl("");
    setAnalysisResult("");
    setView("home");
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.45, ease: "easeOut" }} className="w-full">
            <HomePage onStart={() => setView("select")} onAdmin={() => setView("admin")} />
          </motion.div>
        )}

        {view === "select" && (
          <motion.div key="select" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.45, ease: "easeOut" }} className="w-full">
            <TestSelection onSelect={handleSelectTest} onBack={() => setView("home")} />
          </motion.div>
        )}

        {view === "prequestions" && selectedTest && (
          <motion.div key="prequestions" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.45, ease: "easeOut" }} className="w-full">
            <PreQuestions
              testType={selectedTest}
              onNext={handlePreQuestionsDone}
              onBack={() => setView("select")}
            />
          </motion.div>
        )}

        {view === "drawing" && selectedTest && (
          <motion.div key="drawing" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.45, ease: "easeOut" }} className="w-full">
            <DrawingCanvas
              testType={selectedTest}
              onSubmit={handleDrawingSubmit}
              onBack={() => setView("prequestions")}
            />
          </motion.div>
        )}

        {view === "loading" && (
          <motion.div key="loading" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.45, ease: "easeOut" }} className="w-full">
            <LoadingBreath onDone={handleLoadingDone} />
          </motion.div>
        )}

        {view === "result" && selectedTest && userInfo && drawingDataUrl && (
          <motion.div key="result" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.45, ease: "easeOut" }} className="w-full">
            <ResultReport
              testType={selectedTest}
              userInfo={userInfo}
              drawingDataUrl={drawingDataUrl}
              onRestart={handleRestart}
              // 🌟 추가됨: ResultReport 컴포넌트가 이 Props를 받아서 보여주도록 나중에 수정해야 합니다.
              analysisResult={analysisResult} 
            />
          </motion.div>
        )}

        {view === "admin" && (
          <motion.div key="admin" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.45, ease: "easeOut" }} className="w-full">
            <AdminDashboard onBack={() => setView("home")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}