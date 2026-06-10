import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import type { TestType } from "./TestSelection";

export interface UserInfo {
  age: string;
  gender: string;
  job: string;
  concern: string;
  mood: string;
}

interface Props {
  testType: TestType;
  onNext: (info: UserInfo) => void;
  onBack: () => void;
}

export function PreQuestions({ testType, onNext, onBack }: Props) {
  const [formData, setFormData] = useState<UserInfo>({
    age: "",
    gender: "",
    job: "",
    concern: "",
    mood: "보통 😐",
  });

  // 에러 메시지 상태 관리
  const [errors, setErrors] = useState<{ age?: string; gender?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { age?: string; gender?: string } = {};

    // 1. 연령 유효성 검증 (숫자만 입력되었는지 체크)
    const ageRegex = /^[0-9]+$/;
    if (!formData.age.trim()) {
      newErrors.age = "나이를 입력해 주세요.";
    } else if (!ageRegex.test(formData.age)) {
      newErrors.age = "연령은 숫자만 정확하게 입력해 주세요. (예: 25)";
    }

    // 2. 성별 유효성 검증 (선택 여부 체크)
    if (!formData.gender) {
      newErrors.gender = "성별을 선택해 주세요.";
    }

    // 에러가 있다면 진행을 막음
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 에러가 없으면 청소 후 다음 단계 이동
    setErrors({});
    onNext(formData);
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 text-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <button 
        onClick={onBack} 
        className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={15} /> 이전으로
      </button>

      <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Noto Serif KR', serif" }}>
        마음을 읽기 전,
      </h2>
      <p className="text-sm text-muted-foreground mb-8">
        당신을 조금 더 이해할 수 있도록 작은 단서들을 들려주세요.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 연령 입력 칸 */}
        <div>
          <label className="block text-sm font-medium mb-2 text-stone-700">연령</label>
          <input 
            required 
            type="text"
            inputMode="numeric"
            className={`w-full p-3 bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-2 ${
              errors.age ? "border-red-400 focus:ring-red-200" : "border-stone-300 focus:ring-primary/20 focus:border-primary"
            } text-foreground transition-all`} 
            placeholder="예: 26" 
            value={formData.age} 
            onChange={(e) => {
              setErrors({ ...errors, age: undefined });
              setFormData({ ...formData, age: e.target.value });
            }} 
          />
          {errors.age && (
            <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.age}</p>
          )}
        </div>

        {/* 성별 선택 버튼 영역 */}
        <div>
          <label className="block text-sm font-medium mb-2 text-stone-700">성별</label>
          <div className="grid grid-cols-2 gap-3">
            {["남성", "여성"].map((genderOption) => {
              const isSelected = formData.gender === genderOption;
              return (
                <button
                  key={genderOption}
                  type="button"
                  onClick={() => {
                    setErrors({ ...errors, gender: undefined });
                    setFormData({ ...formData, gender: genderOption });
                  }}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-white text-stone-600 border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  {isSelected && <Check size={14} />}
                  {genderOption}
                </button>
              );
            })}
          </div>
          {errors.gender && (
            <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.gender}</p>
          )}
        </div>

        {/* 현재 하고 계신 일 입력 칸 */}
        <div>
          <label className="block text-sm font-medium mb-2 text-stone-700">현재 하고 계신 일</label>
          <input 
            required 
            className="w-full p-3 bg-white border border-stone-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all" 
            placeholder="예: 대학생, 직장인, 준비생 등" 
            value={formData.job} 
            onChange={(e) => setFormData({ ...formData, job: e.target.value })} 
          />
        </div>

        {/* 대화체로 변경된 고민 서술 영역 */}
        <div>
          <label className="block text-sm font-medium mb-2 text-stone-700">
            요즘 어떤 마음의 짐을 안고 계시나요?
          </label>
          <textarea 
            required 
            className="w-full p-3 bg-white border border-stone-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all resize-none leading-relaxed" 
            rows={4}
            placeholder="당신의 이야기를 편안하게 들려주세요." 
            value={formData.concern} 
            onChange={(e) => setFormData({ ...formData, concern: e.target.value })} 
          />
        </div>

        {/* 다음 단계 버튼 */}
        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit" 
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md hover:opacity-95 transition-all mt-4"
        >
          준비 완료, 그림 그리러 가기 <ArrowRight size={18} />
        </motion.button>
      </form>
    </div>
  );
}