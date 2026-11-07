/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, CheckCircle2 } from 'lucide-react';
import { speakKorean } from '../utils/audio';

export interface DialogueRound {
  clerkSpeech: string;
  clerkEmotion: string;
  questionTitle: string;
  options: {
    text: string;
    isRecommended: boolean;
    clerkResponse: string;
    explanation: string;
    bagCost?: number;
  }[];
}

interface ClerkDialogueProps {
  onDialogueComplete: (bagAdded: boolean, receiptRequested: boolean) => void;
  onSkip?: () => void;
}

export const CLERK_SCENARIOS: DialogueRound[] = [
  {
    clerkSpeech: '어서오세요! 행복 편의점입니다~ 안녕하세요!',
    clerkEmotion: '👩‍💼',
    questionTitle: '점원님이 먼저 반갑게 인사를 건넸습니다. 어떻게 대답할까요?',
    options: [
      {
        text: '😊 "안녕하세요!"',
        isRecommended: true,
        clerkResponse: '네, 반갑습니다! 물건을 계산대로 올려주세요~',
        explanation: '밝고 상냥하게 인사하면 서로 기분 좋은 하루가 됩니다.',
      },
      {
        text: '😶 (아무 말도 하지 않고 고개만 끄덕인다)',
        isRecommended: false,
        clerkResponse: '음... 계산대 쪽으로 물건을 올려주세요~',
        explanation: '소리 내어 "안녕하세요"라고 말하면 점원님이 더 잘 알아들을 수 있어요.',
      },
      {
        text: '😠 "바쁘니까 빨리 계산해줘요!"',
        isRecommended: false,
        clerkResponse: '네... 천천히 바코드를 찍어드릴게요.',
        explanation: '짜증을 내거나 재촉하기보다는 정중하게 말하는 것이 좋은 예절이에요.',
      },
    ],
  },
  {
    clerkSpeech: '비닐봉투 100원인데, 봉투에 담아드릴까요?',
    clerkEmotion: '🛍️',
    questionTitle: '봉투가 필요한지 물어보네요. 준비한 장바구니가 있나요?',
    options: [
      {
        text: '🌱 "아니요, 제 장바구니(가방)에 넣을게요!"',
        isRecommended: true,
        clerkResponse: '네! 장바구니를 챙겨오셨군요. 환경을 아끼는 멋진 손님이시네요!',
        explanation: '가방이나 장바구니가 있을 때는 100원을 아끼고 환경도 보호할 수 있어요.',
        bagCost: 0,
      },
      {
        text: '🛍️ "네, 봉투 한 장 주세요 (100원 추가)"',
        isRecommended: true,
        clerkResponse: '네, 봉투 한 장에 예쁘게 담아드릴게요. 100원이 추가됩니다.',
        explanation: '들고 갈 가방이 없을 때는 봉투를 부탁하고 100원을 더 내면 돼요.',
        bagCost: 100,
      },
      {
        text: '🙅 "봉투 그냥 공짜로 주면 안 돼요?"',
        isRecommended: false,
        clerkResponse: '법으로 정해져 있어서 비닐봉투는 유상(100원)으로만 드릴 수 있어요.',
        explanation: '환경법에 따라 편의점 봉투는 무료로 줄 수 없으니 100원을 지불해야 해요.',
        bagCost: 100,
      },
    ],
  },
  {
    clerkSpeech: '영수증 필요하신가요? 출력해 드릴까요?',
    clerkEmotion: '🧾',
    questionTitle: '영수증을 받을지 묻습니다. 어떻게 대답할까요?',
    options: [
      {
        text: '📄 "네, 영수증 챙겨주세요!"',
        isRecommended: true,
        clerkResponse: '네, 계산 내역이 적힌 영수증을 드릴게요~',
        explanation: '영수증을 받으면 물건 가격과 거스름돈이 맞는지 직접 확인할 수 있어 좋아요.',
      },
      {
        text: '🗑️ "아니요, 버려주세요 (괜찮아요)"',
        isRecommended: true,
        clerkResponse: '네, 그럼 영수증은 폐기 처리해 드릴게요!',
        explanation: '확인이 필요 없거나 스마트 영수증을 쓸 땐 정중히 거절해도 괜찮아요.',
      },
      {
        text: '😤 "영수증 같은 거 왜 자꾸 물어봐요?"',
        isRecommended: false,
        clerkResponse: '손님께서 필요하실까 봐 확인해 드린 거랍니다.',
        explanation: '점원님은 친절하게 안내하는 것이므로 "괜찮아요"라고 부드럽게 말해요.',
      },
    ],
  },
];

export const ClerkDialogue: React.FC<ClerkDialogueProps> = ({
  onDialogueComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [bagAdded, setBagAdded] = React.useState(false);
  const [receiptRequested, setReceiptRequested] = React.useState(false);

  const scenario = CLERK_SCENARIOS[currentStep];

  React.useEffect(() => {
    if (scenario) {
      speakKorean(scenario.clerkSpeech);
    }
  }, [currentStep, scenario]);

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    const opt = scenario.options[idx];

    if (currentStep === 1) {
      if (opt.bagCost && opt.bagCost > 0) {
        setBagAdded(true);
      } else {
        setBagAdded(false);
      }
    }
    if (currentStep === 2) {
      if (idx === 0) {
        setReceiptRequested(true);
      } else {
        setReceiptRequested(false);
      }
    }

    speakKorean(`${opt.text}. 점원: ${opt.clerkResponse}`);
  };

  const handleNext = () => {
    if (currentStep < CLERK_SCENARIOS.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
    } else {
      onDialogueComplete(bagAdded, receiptRequested);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-3 border-amber-400 p-6 shadow-xl max-w-2xl mx-auto space-y-5">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 bg-amber-100 rounded-2xl border border-amber-300">
            {scenario.clerkEmotion}
          </span>
          <div>
            <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-lg">
              점원과 대화하기 ({currentStep + 1} / {CLERK_SCENARIOS.length})
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              편의점 점원님과의 대화
            </h3>
          </div>
        </div>

        <button
          onClick={() => speakKorean(scenario.clerkSpeech)}
          title="음성 다시 듣기"
          className="h-11 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 cursor-pointer flex items-center gap-1.5 text-xs font-black"
        >
          <Volume2 className="w-4 h-4 text-amber-700" />
          <span>듣기</span>
        </button>
      </div>

      {/* Clerk Speech Bubble */}
      <div className="bg-amber-50 border-3 border-amber-300 rounded-2xl p-5">
        <span className="text-xs font-black text-amber-900 block mb-1">
          👩‍💼 편의점 점원님 말씀:
        </span>
        <p className="text-2xl font-black text-slate-900 leading-snug">
          "{scenario.clerkSpeech}"
        </p>
      </div>

      {/* Question Prompt */}
      <p className="text-sm font-black text-slate-800">
        👉 {scenario.questionTitle}
      </p>

      {/* Large Simple Option Buttons */}
      <div className="space-y-3">
        {scenario.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              className={`w-full text-left p-4 rounded-2xl border-3 transition-colors cursor-pointer ${
                isSelected
                  ? opt.isRecommended
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300 shadow-sm'
                    : 'bg-amber-50 border-amber-500 ring-2 ring-amber-300 shadow-sm'
                  : 'bg-white border-slate-300 hover:border-amber-400 hover:bg-amber-50/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-slate-900">
                  {opt.text}
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                )}
              </div>

              {isSelected && (
                <div className="mt-3 pt-2.5 border-t-2 border-slate-200 text-xs">
                  <p className="font-black text-amber-950 text-sm">
                    점원의 반응: "{opt.clerkResponse}"
                  </p>
                  <p className="text-slate-700 mt-1 font-medium leading-relaxed">
                    💡 {opt.explanation}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Large Simple Bottom Buttons */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
        {onSkip && (
          <button
            onClick={onSkip}
            className="h-14 px-4 text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
          >
            대화 건너뛰기
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className={`ml-auto h-16 px-8 rounded-2xl font-black text-base shadow-md transition-colors cursor-pointer border-3 ${
            selectedOption !== null
              ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600'
              : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
          }`}
        >
          {currentStep < CLERK_SCENARIOS.length - 1 ? '다음 대화하기 ➔' : '결제하러 가기 ➔'}
        </button>
      </div>
    </div>
  );
};
