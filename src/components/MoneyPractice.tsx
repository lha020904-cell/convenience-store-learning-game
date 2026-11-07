/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw, Check, Sparkles, HelpCircle } from 'lucide-react';
import { playCoinSound, playSuccessFanfare, playGentleHintSound, speakKorean } from '../utils/audio';
import { KoreanBill, KoreanCoin, RealCurrencyGuideBanner } from './CurrencyVisuals';

interface MoneyTask {
  id: number;
  title: string;
  targetAmount: number;
  hint: string;
}

const MONEY_TASKS: MoneyTask[] = [
  {
    id: 1,
    title: '바나나우유 값 1,500원 만들기',
    targetAmount: 1500,
    hint: '1,000원 지폐 1장과 500원 동전 1개를 올리면 딱 1,500원이 돼요!',
  },
  {
    id: 2,
    title: '참치마요 삼각김밥 값 1,200원 만들기',
    targetAmount: 1200,
    hint: '1,000원 지폐 1장과 100원 동전 2개를 올려보세요.',
  },
  {
    id: 3,
    title: '친구와 간식 먹을 돈 3,800원 만들기',
    targetAmount: 3800,
    hint: '1,000원 지폐 3장 + 500원 1개 + 100원 3개를 올려보세요.',
  },
  {
    id: 4,
    title: '샌드위치와 음료수 4,200원 만들기',
    targetAmount: 4200,
    hint: '1,000원 4장과 100원 2개, 또는 5,000원을 내고 거스름돈을 받을 수도 있어요.',
  },
];

interface MoneyPracticeProps {
  onEarnCoins: (amount: number) => void;
}

export const MoneyPractice: React.FC<MoneyPracticeProps> = ({ onEarnCoins }) => {
  const [taskIdx, setTaskIdx] = React.useState(0);
  const [counts, setCounts] = React.useState<{ [key: string]: number }>({
    won10000: 0,
    won5000: 0,
    won1000: 0,
    won500: 0,
    won100: 0,
    won50: 0,
    won10: 0,
  });

  const [isSuccess, setIsSuccess] = React.useState(false);
  const currentTask = MONEY_TASKS[taskIdx];

  const currentTotal =
    counts.won10000 * 10000 +
    counts.won5000 * 5000 +
    counts.won1000 * 1000 +
    counts.won500 * 500 +
    counts.won100 * 100 +
    counts.won50 * 50 +
    counts.won10 * 10;

  React.useEffect(() => {
    if (currentTask) {
      speakKorean(
        `화폐 계산 연습입니다. 목표 금액은 ${currentTask.targetAmount.toLocaleString()}원입니다. 지폐와 동전을 터치해 올려보세요.`
      );
    }
  }, [taskIdx, currentTask]);

  const add = (k: string, val: number, name: string) => {
    if (isSuccess) return;
    playCoinSound();
    setCounts((prev) => ({ ...prev, [k]: prev[k] + 1 }));
    speakKorean(`${name} 추가, 현재 ${currentTotal + val}원`);
  };

  const remove = (k: string) => {
    if (isSuccess) return;
    if (counts[k] <= 0) return;
    playCoinSound();
    setCounts((prev) => ({ ...prev, [k]: prev[k] - 1 }));
  };

  const reset = () => {
    setCounts({
      won10000: 0,
      won5000: 0,
      won1000: 0,
      won500: 0,
      won100: 0,
      won50: 0,
      won10: 0,
    });
    setIsSuccess(false);
    speakKorean('올려둔 돈을 모두 지웠습니다.');
  };

  const handleCheck = () => {
    if (currentTotal === currentTask.targetAmount) {
      setIsSuccess(true);
      playSuccessFanfare();
      onEarnCoins(30);
      speakKorean(`정확하게 ${currentTask.targetAmount.toLocaleString()}원을 만들었습니다! 참 잘했어요!`);
    } else if (currentTotal < currentTask.targetAmount) {
      playGentleHintSound();
      const need = currentTask.targetAmount - currentTotal;
      speakKorean(`아직 ${need.toLocaleString()}원이 부족해요. 지폐나 동전을 더 올려보세요!`);
    } else {
      playGentleHintSound();
      const over = currentTotal - currentTask.targetAmount;
      speakKorean(`목표보다 ${over.toLocaleString()}원이 더 많아요. 금액을 딱 맞춰보세요!`);
    }
  };

  const handleNext = () => {
    if (taskIdx < MONEY_TASKS.length - 1) {
      setTaskIdx((t) => t + 1);
      reset();
    } else {
      setTaskIdx(0);
      reset();
      speakKorean('모든 화폐 계산 연습을 완료했습니다! 처음부터 다시 복습해 보아요.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-3xl border-3 border-amber-400 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-amber-200">
          <div>
            <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-lg">
              특수학급 연습 코너 2
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              💰 화폐 세기 & 금액 맞추기 훈련
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500">도전문항</span>
            <p className="text-lg font-black text-amber-600">
              {taskIdx + 1} / {MONEY_TASKS.length}
            </p>
          </div>
        </div>

        {/* Task Objective Box */}
        <div className="mt-5 p-5 bg-amber-50 rounded-2xl border-2 border-amber-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-amber-950">
              미션 {taskIdx + 1}: {currentTask.title}
            </span>
            <button
              onClick={() => speakKorean(currentTask.hint)}
              className="h-10 px-3 rounded-xl bg-white border border-amber-300 text-xs font-bold text-amber-900 hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>힌트 듣기</span>
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 bg-white p-4 rounded-xl border-2 border-amber-300">
            <div>
              <span className="text-xs text-slate-500 font-bold block">만들어야 할 목표 금액</span>
              <span className="text-3xl font-black text-slate-900 tabular-nums">
                {currentTask.targetAmount.toLocaleString()}원
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-bold block">지금 내가 올린 금액</span>
              <span
                className={`text-3xl font-black tabular-nums ${
                  currentTotal === currentTask.targetAmount
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              >
                {currentTotal.toLocaleString()}원
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-700 mt-2 font-bold">💡 힌트: {currentTask.hint}</p>
        </div>

        {/* Real Currency Photos Guide Banner */}
        <div className="mt-5">
          <RealCurrencyGuideBanner />
        </div>

        {/* Currency Buttons with ACTUAL BILL/COIN PHOTOS */}
        <div className="mt-5 space-y-5">
          {/* Banknotes */}
          <div>
            <h4 className="text-sm font-black text-slate-800 mb-2">
              💵 실제 지폐 사진을 눌러 계산대에 올려보세요:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => add('won10000', 10000, '만 원')}
                className="p-3 bg-white hover:bg-emerald-50 border-3 border-emerald-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer shadow-sm hover:border-emerald-600 transition-colors"
              >
                <KoreanBill amount={10000} size="md" />
                <div className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm flex items-center justify-center">
                  + 10,000원 지폐 올리기
                </div>
              </button>

              <button
                onClick={() => add('won5000', 5000, '오천 원')}
                className="p-3 bg-white hover:bg-orange-50 border-3 border-orange-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer shadow-sm hover:border-orange-600 transition-colors"
              >
                <KoreanBill amount={5000} size="md" />
                <div className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-sm flex items-center justify-center">
                  + 5,000원 지폐 올리기
                </div>
              </button>

              <button
                onClick={() => add('won1000', 1000, '천 원')}
                className="p-3 bg-white hover:bg-sky-50 border-3 border-sky-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer shadow-sm hover:border-sky-600 transition-colors"
              >
                <KoreanBill amount={1000} size="md" />
                <div className="w-full h-11 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-black text-sm flex items-center justify-center">
                  + 1,000원 지폐 올리기
                </div>
              </button>
            </div>
          </div>

          {/* Coins */}
          <div>
            <h4 className="text-sm font-black text-slate-800 mb-2">
              🪙 실제 동전 앞면 사진을 눌러 계산대에 올려보세요:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => add('won500', 500, '오백 원')}
                className="p-3 bg-white hover:bg-zinc-50 border-3 border-zinc-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer shadow-sm hover:border-zinc-600 transition-colors"
              >
                <KoreanCoin amount={500} size="md" />
                <div className="w-full h-10 bg-zinc-700 hover:bg-zinc-800 text-white rounded-xl font-black text-xs flex items-center justify-center">
                  + 500원 올리기
                </div>
              </button>

              <button
                onClick={() => add('won100', 100, '백 원')}
                className="p-3 bg-white hover:bg-slate-50 border-3 border-slate-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer shadow-sm hover:border-slate-600 transition-colors"
              >
                <KoreanCoin amount={100} size="md" />
                <div className="w-full h-10 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-black text-xs flex items-center justify-center">
                  + 100원 올리기
                </div>
              </button>

              <button
                onClick={() => add('won50', 50, '오십 원')}
                className="p-3 bg-white hover:bg-stone-50 border-3 border-stone-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer shadow-sm hover:border-stone-600 transition-colors"
              >
                <KoreanCoin amount={50} size="md" />
                <div className="w-full h-10 bg-stone-600 hover:bg-stone-700 text-white rounded-xl font-black text-xs flex items-center justify-center">
                  + 50원 올리기
                </div>
              </button>

              <button
                onClick={() => add('won10', 10, '십 원')}
                className="p-3 bg-white hover:bg-amber-50 border-3 border-amber-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer shadow-sm hover:border-amber-600 transition-colors"
              >
                <KoreanCoin amount={10} size="md" />
                <div className="w-full h-10 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-black text-xs flex items-center justify-center">
                  + 10원 올리기
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Visual Placed Currency Tray */}
        {currentTotal > 0 && (
          <div className="mt-5 p-4 bg-amber-50 rounded-2xl border-2 border-amber-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-amber-950">
                올린 화폐 (빼려면 그림을 터치하세요):
              </span>
              <button
                onClick={reset}
                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>모두 지우기</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {counts.won10000 > 0 && (
                <button onClick={() => remove('won10000')} className="cursor-pointer">
                  <KoreanBill amount={10000} count={counts.won10000} size="sm" />
                </button>
              )}
              {counts.won5000 > 0 && (
                <button onClick={() => remove('won5000')} className="cursor-pointer">
                  <KoreanBill amount={5000} count={counts.won5000} size="sm" />
                </button>
              )}
              {counts.won1000 > 0 && (
                <button onClick={() => remove('won1000')} className="cursor-pointer">
                  <KoreanBill amount={1000} count={counts.won1000} size="sm" />
                </button>
              )}
              {counts.won500 > 0 && (
                <button onClick={() => remove('won500')} className="cursor-pointer">
                  <KoreanCoin amount={500} count={counts.won500} size="md" />
                </button>
              )}
              {counts.won100 > 0 && (
                <button onClick={() => remove('won100')} className="cursor-pointer">
                  <KoreanCoin amount={100} count={counts.won100} size="md" />
                </button>
              )}
              {counts.won50 > 0 && (
                <button onClick={() => remove('won50')} className="cursor-pointer">
                  <KoreanCoin amount={50} count={counts.won50} size="md" />
                </button>
              )}
              {counts.won10 > 0 && (
                <button onClick={() => remove('won10')} className="cursor-pointer">
                  <KoreanCoin amount={10} count={counts.won10} size="md" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Large Simple Action Buttons */}
        <div className="mt-6 pt-4 border-t-2 border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={reset}
            className="h-14 px-6 rounded-2xl border-2 border-slate-300 text-slate-700 text-sm font-black hover:bg-slate-100 cursor-pointer"
          >
            다시 놓기
          </button>

          {isSuccess ? (
            <button
              onClick={handleNext}
              className="h-16 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-md flex items-center gap-2 cursor-pointer border-2 border-emerald-700"
            >
              <Sparkles className="w-6 h-6" />
              <span>정답입니다! 다음 문제 풀기 ➔</span>
            </button>
          ) : (
            <button
              onClick={handleCheck}
              className="h-16 px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-lg shadow-md flex items-center gap-2 cursor-pointer border-2 border-amber-600 transition-colors"
            >
              <Check className="w-6 h-6" />
              <span>금액 맞는지 확인하기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
