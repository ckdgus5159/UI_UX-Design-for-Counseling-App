import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { TestType } from "./TestSelection";

// 1. 여기서 타입을 확실하게 지정합니다.
export interface UserInfo {
  age: string;
  gender: string;
  job: string; // 필수 속성
  concern: string;
  mood: string;
}

interface Props {
  testType: TestType;
  onNext: (info: UserInfo) => void;
  onBack: () => void;
}

export function PreQuestions({ testType, onNext, onBack }: Props) {
  // 2. 초기 상태값에도 job을 추가합니다.
  const [formData, setFormData] = useState<UserInfo>({
    age: "",
    gender: "",
    job: "",
    concern: "",
    mood: "보통 😐",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 3. 이제 formData에 job이 포함되어 있으므로 에러가 사라집니다.
    onNext(formData);
  };

  return (
    <div className="max-w-md mx-auto p-6" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeft size={15} /> 이전
      </button>

      <h2 className="text-xl font-bold mb-6">상담을 위한 정보 입력</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">연령대</label>
          <input 
            required 
            className="w-full p-3 border rounded-lg" 
            placeholder="예: 20대" 
            value={formData.age} 
            onChange={(e) => setFormData({...formData, age: e.target.value})} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">성별</label>
          <input 
            required 
            className="w-full p-3 border rounded-lg" 
            placeholder="예: 여성" 
            value={formData.gender} 
            onChange={(e) => setFormData({...formData, gender: e.target.value})} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">직업</label>
          <input 
            required 
            className="w-full p-3 border rounded-lg" 
            placeholder="예: 학생" 
            value={formData.job} 
            onChange={(e) => setFormData({...formData, job: e.target.value})} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">고민 내용</label>
          <textarea 
            required 
            className="w-full p-3 border rounded-lg" 
            rows={3}
            placeholder="고민을 적어주세요" 
            value={formData.concern} 
            onChange={(e) => setFormData({...formData, concern: e.target.value})} 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg flex items-center justify-center gap-2 font-bold"
        >
          다음 <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}