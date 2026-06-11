import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Pen, Eraser, RotateCcw, Check, Minus, Plus, Undo } from "lucide-react";
import type { TestType } from "./TestSelection";

// 🌟 추가됨: src/assets 폴더에 저장한 배경 이미지를 불러옵니다.
import hexagonBg from "../../assets/hexagon-bg.png";

const TEST_INSTRUCTIONS: Record<TestType, { title: string; guide: string }> = {
  rain: {
    title: "빗속의 사람을 그려주세요",
    guide: "비가 내리는 장면 속에 사람을 그려보세요. 우산이 있어도, 없어도 좋아요. 당신이 느끼는 대로.",
  },
  starwave: {
    title: "별과 파도를 그려주세요",
    guide: "아래쪽은 파도, 위쪽은 밤하늘로 구성해 보세요. 별의 수와 파도의 모양은 자유롭게.",
  },
  hexagon: {
    title: "각 도형 안을 채워주세요",
    guide: "여섯 개의 도형마다 자유롭게 그림을 그려 넣으세요. 가이드 선 위에 직접 그리셔도 됩니다.",
  },
  htp: {
    title: "집·나무·사람을 그려주세요",
    guide: "한 장면 안에 집, 나무, 사람을 모두 그려보세요. 배치와 크기는 당신의 선택입니다.",
  },
};

const COLORS = ["#2C2825", "#0F766E", "#3B82F6", "#EF4444", "#F59E0B", "#8B5CF6", "#EC4899", "#6B7280"];

interface Props {
  testType: TestType;
  onSubmit: (dataUrl: string) => void;
  onBack: () => void;
}

export function DrawingCanvas({ testType, onSubmit, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState("#2C2825");
  const [size, setSize] = useState(3);
  
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  // 캔버스 상태(이미지 데이터)를 저장하여 되돌리기를 구현하는 Ref 배열
  const historyRef = useRef<ImageData[]>([]);

  const instruction = TEST_INSTRUCTIONS[testType];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 🌟 추가됨: 육도형일 경우 실제 이미지 파일을 캔버스에 그립니다.
    if (testType === "hexagon") {
      const img = new Image();
      img.src = hexagonBg;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 이미지가 로드된 후의 상태를 히스토리에 저장해야 되돌리기가 꼬이지 않습니다.
        historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
      };
    } else {
      // 다른 검사는 빈 하얀 캔버스를 히스토리에 저장
      historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    }
  }, [testType]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    lastPos.current = getPos(e, canvas);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e, canvas);
    const from = lastPos.current || pos;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    ctx.lineWidth = tool === "eraser" ? size * 6 : size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    lastPos.current = pos;
  }, [isDrawing, tool, color, size]);

  const stopDraw = useCallback(() => {
    setIsDrawing(false);
    
    // 한 획 그리기가 끝날 때마다 캔버스 상태를 캡처하여 저장
    if (lastPos.current) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d")!;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        historyRef.current.push(imageData);
        
        // 너무 많은 상태 저장으로 인한 메모리 누수 방지 (최대 30개)
        if (historyRef.current.length > 30) {
          historyRef.current.shift();
        }
      }
    }
    lastPos.current = null;
  }, []);

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    
    // 저장된 상태가 2개 이상일 때만 (초기 상태 + 최소 1획) 되돌리기 가능
    if (historyRef.current.length > 1) {
      historyRef.current.pop(); // 방금 그린 획(현재 상태) 제거
      const previousState = historyRef.current[historyRef.current.length - 1]; // 이전 상태 가져오기
      ctx.putImageData(previousState, 0, 0); // 캔버스에 덮어쓰기
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 🌟 추가됨: 초기화할 때도 배경 이미지를 다시 그려줍니다.
    if (testType === "hexagon") {
      const img = new Image();
      img.src = hexagonBg;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
      };
    } else {
      historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    }
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSubmit(canvas.toDataURL("image/png"));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← 뒤로
        </button>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-0.5">{instruction.title}</p>
          <p className="text-xs text-muted-foreground max-w-xs leading-snug hidden sm:block">{instruction.guide}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm hover:opacity-90"
        >
          <Check size={14} />
          완료
        </motion.button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-2.5 border-b border-border bg-card flex-wrap">
        {/* Tools */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setTool("pen")}
            className={`p-2 rounded-lg transition-colors ${tool === "pen" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
          >
            <Pen size={16} />
          </button>
          <button
            onClick={() => setTool("eraser")}
            className={`p-2 rounded-lg transition-colors ${tool === "eraser" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
          >
            <Eraser size={16} />
          </button>
        </div>

        <div className="w-px h-5 bg-border" />

        {/* Colors */}
        <div className="flex gap-1.5 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setTool("pen"); }}
              className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                background: c,
                borderColor: color === c && tool === "pen" ? "var(--primary)" : "transparent",
                outline: color === c && tool === "pen" ? "2px solid var(--accent)" : "none",
              }}
            />
          ))}
        </div>

        <div className="w-px h-5 bg-border" />

        {/* Size */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => setSize(Math.max(1, size - 1))} className="p-1 text-muted-foreground hover:text-foreground">
            <Minus size={14} />
          </button>
          <span className="text-xs w-5 text-center">{size}</span>
          <button onClick={() => setSize(Math.min(20, size + 1))} className="p-1 text-muted-foreground hover:text-foreground">
            <Plus size={14} />
          </button>
        </div>

        <div className="w-px h-5 bg-border" />
        
        <button onClick={handleUndo} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Undo size={14} />
          되돌리기
        </button>

        <button onClick={clearCanvas} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <RotateCcw size={14} />
          초기화
        </button>
      </div>

      {/* Canvas area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
        <div className="rounded-2xl overflow-hidden shadow-md border border-border" style={{ maxWidth: "min(700px, 95vw)" }}>
          <canvas
            ref={canvasRef}
            width={700}
            height={500}
            className="block w-full touch-none"
            style={{ cursor: tool === "eraser" ? "cell" : "crosshair", background: "#fff" }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
        </div>
      </div>

      <div className="py-3 text-center text-xs text-muted-foreground">
        완성되면 상단의 완료 버튼을 눌러주세요 · 언제든 다시 그릴 수 있어요
      </div>
    </div>
  );
}