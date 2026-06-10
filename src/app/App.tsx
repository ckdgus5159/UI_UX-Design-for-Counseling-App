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

  const handleSelectTest = (t: TestType) => {
    setSelectedTest(t);
    setView("prequestions");
  };

  const handlePreQuestionsDone = (info: UserInfo) => {
    setUserInfo(info);
    setView("drawing");
  };

  const handleDrawingSubmit = (dataUrl: string) => {
    setDrawingDataUrl(dataUrl);
    setView("loading");
  };

  const handleLoadingDone = useCallback(() => {
    setView("result");
  }, []);

  const handleRestart = () => {
    setSelectedTest(null);
    setUserInfo(null);
    setDrawingDataUrl("");
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
