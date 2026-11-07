/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, CheckCircle2, RotateCcw } from 'lucide-react';
import { playSuccessFanfare, playGentleHintSound, speakKorean } from '../utils/audio';

interface QuizQuestion {
  id: number;
  title: string;
  question: string;
  productName: string;
  imageSrc?: string;
  productVisual: string;
  tagPrice: number;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const PRICE_QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    title: '기초 가격표 읽기',
    question: '진열대의 가격표에 적힌 금액은 얼마일까요?',
    productName: '뚱뚱이 바나나우유',
    imageSrc: '/src/assets/images/prod_banana_milk_1794017017055.jpg',
    productVisual: '🍌🥛 뚱뚱이 바나나우유',
    tagPrice: 1500,
    options: [
      {
        label: '1,500원 (천오백 원)',
        isCorrect: true,
        explanation: '정답입니다! 1과 5 뒤에 0이 두 개 붙어 1,500원(천오백 원)입니다.',
      },
      {
        label: '150원 (백오십 원)',
        isCorrect: false,
        explanation: '0의 개수를 확인해 보세요. 0이 두 개 더 있어서 1,500원입니다.',
      },
      {
        label: '15,000원 (만오천 원)',
        isCorrect: false,
        explanation: '만 원대는 0이 더 많아요. 이 물건은 1,500원입니다.',
      },
    ],
  },
  {
    id: 2,
    title: '어느 물건이 더 저렴할까요?',
    question: '두 상품 중 가격이 더 적은(더 싼) 물건은 무엇일까요?',
    productName: '참치마요 삼각김밥 VS 햄에그 샌드위치',
    imageSrc: '/src/assets/images/prod_triangle_gimbap_1794017018018.jpg',
    productVisual: '🍙 참치마요(1,200원) VS 🥪 샌드위치(2,400원)',
    tagPrice: 1200,
    options: [
      {
        label: '🍙 참치마요 삼각김밥 (1,200원)',
        isCorrect: true,
        explanation: '참 잘했어요! 1,200원이 2,400원보다 더 작은 숫자이므로 더 저렴합니다.',
      },
      {
        label: '🥪 햄에그 샌드위치 (2,400원)',
        isCorrect: false,
        explanation: '2,400원은 1,200원보다 더 큰 숫자라 더 비싼 물건이에요.',
      },
    ],
  },
  {
    id: 3,
    title: '라면 가격표 확인하기',
    question: '컵라면 매대에 놓인 가격표를 읽어보세요. 얼마인가요?',
    productName: '얼큰 미니 컵라면',
    imageSrc: '/src/assets/images/prod_cup_ramen_1794017017390.jpg',
    productVisual: '🍜 얼큰 미니 컵라면',
    tagPrice: 1200,
    options: [
      {
        label: '1,200원 (천이백 원)',
        isCorrect: true,
        explanation: '정답입니다! 1,000원 지폐 1장과 100원 동전 2개로 살 수 있어요.',
      },
      {
        label: '2,100원 (이천백 원)',
        isCorrect: false,
        explanation: '앞의 숫자 순서를 잘 살펴보세요. 1과 2가 앞에 있어 1,200원입니다.',
      },
      {
        label: '500원 (오백 원)',
        isCorrect: false,
        explanation: '컵라면 가격표는 1,200원입니다.',
      },
    ],
  },
  {
    id: 4,
    title: '두 물건의 가격 더하기',
    question: '1,000원짜리 생수 1병과 1,200원짜리 삼각김밥 1개를 사면 합계는 얼마일까요?',
    productName: '생수(1,000원) + 삼각김밥(1,200원)',
    imageSrc: '/src/assets/images/prod_triangle_gimbap_1794017018018.jpg',
    productVisual: '💧 생수(1,000원) + 🍙 삼각김밥(1,200원)',
    tagPrice: 2200,
    options: [
      {
        label: '2,200원 (이천이백 원)',
        isCorrect: true,
        explanation: '정답입니다! 1,000원 + 1,200원 = 2,200원입니다.',
      },
      {
        label: '1,200원 (천이백 원)',
        isCorrect: false,
        explanation: '생수 1,000원도 함께 더해야 해요.',
      },
      {
        label: '3,000원 (삼천 원)',
        isCorrect: false,
        explanation: '천 원과 천이백 원을 더하면 2,200원입니다.',
      },
    ],
  },
];

interface PricePracticeProps {
  onEarnCoins: (amount: number) => void;
}

export const PricePractice: React.FC<PricePracticeProps> = ({ onEarnCoins }) => {
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [score, setScore] = React.useState(0);

  const quiz = PRICE_QUIZZES[currentIdx];

  React.useEffect(() => {
    if (quiz) {
      speakKorean(`${quiz.title}. ${quiz.question}`);
    }
  }, [currentIdx, quiz]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = quiz.options[idx].isCorrect;
    if (isCorrect) {
      playSuccessFanfare();
      setScore((s) => s + 1);
      onEarnCoins(20);
      speakKorean(`정답입니다! ${quiz.options[idx].explanation}`);
    } else {
      playGentleHintSound();
      speakKorean(`아쉬워요! ${quiz.options[idx].explanation}`);
    }
  };

  const handleNext = () => {
    if (currentIdx < PRICE_QUIZZES.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      speakKorean('가격표 읽기 훈련을 모두 마쳤습니다!');
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    speakKorean('처음부터 다시 연습합니다.');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-3xl border-3 border-amber-400 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-amber-200">
          <div>
            <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-lg">
              특수학급 연습 코너 1
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              🏷️ 가격표 읽기 훈련
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500">진행도</span>
            <p className="text-lg font-black text-amber-600">
              {currentIdx + 1} / {PRICE_QUIZZES.length}
            </p>
          </div>
        </div>

        {/* Current Quiz Card */}
        <div className="mt-5 space-y-5">
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-center">
            <span className="text-xs font-black text-amber-900 block mb-1">
              {quiz.title}
            </span>
            <h3 className="text-xl font-black text-slate-900">
              {quiz.question}
            </h3>
            <button
              onClick={() => speakKorean(`${quiz.title}. ${quiz.question}`)}
              className="mt-2.5 h-10 px-4 rounded-xl bg-white border border-amber-300 text-xs font-black text-amber-900 hover:bg-amber-100 inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>문제 다시 듣기</span>
            </button>
          </div>

          {/* Product Photo & Price Tag Box */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 text-center border-3 border-amber-400 flex flex-col items-center gap-4">
            {quiz.imageSrc && (
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/60 shadow-md">
                <img
                  src={quiz.imageSrc}
                  alt={quiz.productName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="text-lg font-black text-amber-300">
              {quiz.productVisual}
            </div>

            <div className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-mono border-3 border-amber-400 shadow-md">
              <span className="text-xs text-slate-500 block font-sans font-bold">
                편의점 매대 가격표
              </span>
              <span className="text-3xl font-black tabular-nums text-slate-950">
                ₩ {quiz.tagPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Large Simple Option Buttons */}
          <div className="space-y-3">
            {quiz.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = 'bg-white border-slate-300 hover:border-amber-400';
              if (isAnswered) {
                if (opt.isCorrect) {
                  btnClass = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300 shadow-sm';
                } else if (isSelected) {
                  btnClass = 'bg-red-50 border-red-300';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-2xl border-3 transition-colors cursor-pointer ${btnClass}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base text-slate-900">
                      {opt.label}
                    </span>
                    {isAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  {isAnswered && (isSelected || opt.isCorrect) && (
                    <p className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-700 font-medium">
                      💡 {opt.explanation}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Action Controls */}
          {isAnswered && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="h-12 px-4 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-slate-50"
              >
                <RotateCcw className="w-4 h-4" />
                다시 시작
              </button>

              {currentIdx < PRICE_QUIZZES.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="h-16 px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-base shadow-md cursor-pointer border-2 border-amber-600"
                >
                  다음 퀴즈로 ➔
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="h-16 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md cursor-pointer border-2 border-emerald-700"
                >
                  한 번 더 풀기
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
