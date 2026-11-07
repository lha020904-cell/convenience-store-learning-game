/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, CheckCircle2, RotateCcw } from 'lucide-react';
import { playSuccessFanfare, playGentleHintSound, speakKorean } from '../utils/audio';

interface RoleplayScenario {
  id: number;
  situation: string;
  clerkSpeech: string;
  clerkEmoji: string;
  question: string;
  options: {
    dialogue: string;
    isPolite: boolean;
    clerkReaction: string;
    learningTip: string;
  }[];
}

const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  {
    id: 1,
    situation: '편의점에 들어서자 점원님이 "어서오세요!"라고 환영 인사를 하셨어요.',
    clerkSpeech: '어서오세요! 반갑습니다~',
    clerkEmoji: '👩‍💼',
    question: '어떻게 대답하면 가장 좋을까요?',
    options: [
      {
        dialogue: '😊 "안녕하세요!" 하고 미소 지으며 인사해요.',
        isPolite: true,
        clerkReaction: '점원님: "네, 안녕하세요! 편하게 둘러보세요~"',
        learningTip: '가볍게 목례를 하거나 "안녕하세요"라고 인사하면 서로 존중받는 따뜻한 대화가 됩니다.',
      },
      {
        dialogue: '😶 아무 말도 안 하고 점원님을 빤히 쳐다봐요.',
        isPolite: false,
        clerkReaction: '점원님: "(조금 어색해하며) 찾으시는 것 있으신가요...?"',
        learningTip: '인사를 들었을 때는 작게라도 "안녕하세요"라고 답하면 예의 바른 행동이에요.',
      },
      {
        dialogue: '📢 "여기 빵 어딨어!" 반말로 소리쳐요.',
        isPolite: false,
        clerkReaction: '점원님: "(당황해하며) 손님, 빵은 저쪽 진열대에 있습니다."',
        learningTip: '처음 만나는 점원님께는 반말이 아닌 존댓말을 쓰는 것이 바른 언어 예절입니다.',
      },
    ],
  },
  {
    id: 2,
    situation: '찾는 과자가 어디에 있는지 잘 보이지 않아요.',
    clerkSpeech: '손님, 찾으시는 물건이 있으신가요?',
    clerkEmoji: '🤔',
    question: '점원님께 물건 위치를 물어볼 때 알맞은 말은 무엇일까요?',
    options: [
      {
        dialogue: '🙋 "저기요, 감자칩은 어디에 진열되어 있나요?"',
        isPolite: true,
        clerkReaction: '점원님: "아, 감자칩은 2번 스낵 코너 중간에 있어요! 안내해 드릴게요."',
        learningTip: '"~어디에 있나요?"라고 정중하게 물어보면 점원님이 친절하게 찾아주신답니다.',
      },
      {
        dialogue: '🤷 "감자칩 내놔!" 하고 손을 내밀어요.',
        isPolite: false,
        clerkReaction: '점원님: "(놀라며) 직접 진열대에서 골라오셔야 해요..."',
        learningTip: '편의점은 내가 진열대에서 직접 물건을 고르고 계산하는 곳이에요.',
      },
    ],
  },
  {
    id: 3,
    situation: '물건을 계산대에 올리자 점원님이 봉투 필요 여부를 물어봅니다.',
    clerkSpeech: '비닐봉투 100원인데 필요하신가요?',
    clerkEmoji: '🛍️',
    question: '학교 가방이나 에코백을 가져왔을 때 알맞은 대답은?',
    options: [
      {
        dialogue: '🎒 "아니요, 제 가방에 넣을게요. 괜찮습니다!"',
        isPolite: true,
        clerkReaction: '점원님: "네! 장바구니나 가방이 있으시면 100원을 아낄 수 있어요."',
        learningTip: '비닐봉투가 필요 없을 땐 "괜찮아요"라고 의사를 분명히 전해요.',
      },
      {
        dialogue: '🛍️ "네, 봉투에 담아주세요!"',
        isPolite: true,
        clerkReaction: '점원님: "네, 봉투값 100원 추가해서 결제해 드릴게요."',
        learningTip: '손에 짐이 많을 땐 봉투값을 내고 정중히 요청할 수 있어요.',
      },
    ],
  },
  {
    id: 4,
    situation: '계산이 끝나고 점원님이 영수증과 물건을 건네주셨습니다.',
    clerkSpeech: '계산 완료되었습니다. 안녕히 가세요!',
    clerkEmoji: '🎁',
    question: '편의점 문을 나설 때 마지막으로 할 말은 무엇일까요?',
    options: [
      {
        dialogue: '👋 "감사합니다! 안녕히 계세요!"',
        isPolite: true,
        clerkReaction: '점원님: "네, 좋은 하루 보내세요! 또 오세요~"',
        learningTip: '헤어질 때 감사의 인사를 전하면 편의점 쇼핑 완벽 마스터!',
      },
      {
        dialogue: '🏃 그냥 물건만 낚아채서 밖으로 뛰어나가요.',
        isPolite: false,
        clerkReaction: '점원님: "앗, 조심히 가세요..."',
        learningTip: '물건과 영수증을 챙긴 후 가볍게 "감사합니다" 하고 인사해 보아요.',
      },
    ],
  },
];

interface DialoguePracticeProps {
  onEarnCoins: (amount: number) => void;
}

export const DialoguePractice: React.FC<DialoguePracticeProps> = ({ onEarnCoins }) => {
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [selectedOpt, setSelectedOpt] = React.useState<number | null>(null);
  const [isAnswered, setIsAnswered] = React.useState(false);

  const scenario = ROLEPLAY_SCENARIOS[currentIdx];

  React.useEffect(() => {
    if (scenario) {
      speakKorean(`${scenario.situation} 점원: "${scenario.clerkSpeech}"`);
    }
  }, [currentIdx, scenario]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const opt = scenario.options[idx];
    if (opt.isPolite) {
      playSuccessFanfare();
      onEarnCoins(25);
      speakKorean(`${opt.dialogue} ${opt.clerkReaction}`);
    } else {
      playGentleHintSound();
      speakKorean(`${opt.dialogue} ${opt.learningTip}`);
    }
  };

  const handleNext = () => {
    if (currentIdx < ROLEPLAY_SCENARIOS.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      speakKorean('축하합니다! 점원과의 대화 예절 훈련을 모두 마쳤습니다!');
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border-3 border-amber-400 p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-200">
          <div>
            <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-lg">
              특수학급 연습 코너 3
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              🗣️ 점원과의 대화 예절 훈련
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500">진행 상황</span>
            <p className="text-lg font-black text-amber-600">
              {currentIdx + 1} / {ROLEPLAY_SCENARIOS.length}
            </p>
          </div>
        </div>

        {/* Situation Card */}
        <div className="mt-5 space-y-4">
          <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl p-4">
            <span className="text-xs font-black text-sky-900 block mb-1">
              📍 어떤 상황일까요?
            </span>
            <p className="text-base font-black text-slate-900">
              {scenario.situation}
            </p>
          </div>

          {/* Clerk Dialogue Bubble */}
          <div className="bg-amber-50 rounded-2xl border-3 border-amber-300 p-5 flex items-start gap-4">
            <span className="text-4xl p-2 bg-white rounded-2xl border border-amber-300 shrink-0">
              {scenario.clerkEmoji}
            </span>
            <div className="flex-1">
              <span className="text-xs font-black text-amber-900 block">
                편의점 점원님 말씀:
              </span>
              <p className="text-xl font-black text-slate-900 mt-1">
                "{scenario.clerkSpeech}"
              </p>
              <button
                onClick={() => speakKorean(scenario.clerkSpeech)}
                className="mt-2.5 h-9 px-3 rounded-xl bg-white border border-amber-300 text-xs font-black text-amber-900 hover:bg-amber-100 inline-flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>점원 목소리 다시 듣기</span>
              </button>
            </div>
          </div>

          <p className="text-sm font-black text-slate-800 pt-1">
            👉 {scenario.question}
          </p>

          {/* Large Simple Option Buttons */}
          <div className="space-y-3">
            {scenario.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              let style = 'bg-white border-slate-300 hover:border-amber-400';
              if (isAnswered) {
                if (opt.isPolite) {
                  style = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300 shadow-sm';
                } else if (isSelected) {
                  style = 'bg-amber-50 border-amber-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-2xl border-3 transition-colors cursor-pointer ${style}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base text-slate-900">
                      {opt.dialogue}
                    </span>
                    {isAnswered && opt.isPolite && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    )}
                  </div>

                  {isAnswered && (isSelected || opt.isPolite) && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs">
                      <p className="font-black text-amber-950 text-sm">{opt.clerkReaction}</p>
                      <p className="text-slate-700 mt-1 font-medium">💡 {opt.learningTip}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Large Bottom Navigation Button */}
          {isAnswered && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="h-12 px-4 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-slate-50"
              >
                <RotateCcw className="w-4 h-4" />
                처음부터
              </button>

              {currentIdx < ROLEPLAY_SCENARIOS.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="h-16 px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-base shadow-md cursor-pointer border-2 border-amber-600"
                >
                  다음 상황 연습하기 ➔
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="h-16 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md cursor-pointer border-2 border-emerald-700"
                >
                  대화 연습 다시 복습하기
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
