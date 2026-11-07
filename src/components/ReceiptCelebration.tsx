/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import confetti from 'canvas-confetti';
import { Award, Stamp, RotateCcw, ArrowRight, Printer } from 'lucide-react';
import { CartItem, ShoppingMission } from '../types';
import { playSuccessFanfare, speakKorean } from '../utils/audio';

interface ReceiptCelebrationProps {
  mission: ShoppingMission;
  cart: CartItem[];
  totalAmount: number;
  paidAmount: number;
  paymentMethod: 'cash' | 'card';
  bagAdded: boolean;
  onNextMission: () => void;
  onRestartMission: () => void;
}

export const ReceiptCelebration: React.FC<ReceiptCelebrationProps> = ({
  mission,
  cart,
  totalAmount,
  paidAmount,
  paymentMethod,
  bagAdded,
  onNextMission,
  onRestartMission,
}) => {
  const change = Math.max(0, paidAmount - totalAmount);

  React.useEffect(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    playSuccessFanfare();
    speakKorean(`축하합니다! ${mission.title} 미션을 성공했습니다! 스탬프를 받았습니다.`);
  }, [mission]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-amber-500 text-white rounded-3xl p-6 text-center shadow-lg border-3 border-amber-600">
        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-xs font-black tracking-wide mb-3">
          <Award className="w-4 h-4 text-amber-200" />
          <span>미션 대성공! 참 잘했어요!</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black mb-2">
          편의점에서 물건 구매 완료!
        </h2>
        <p className="text-amber-100 text-sm max-w-md mx-auto font-medium">
          가격표를 잘 읽고 점원님과 친절하게 대화하며 멋지게 계산을 마쳤습니다.
        </p>

        {/* Earned Rewards Tally */}
        <div className="mt-5 flex items-center justify-center gap-4">
          <div className="bg-white/20 rounded-2xl px-5 py-2.5 border border-white/30 text-center">
            <span className="text-xs font-bold text-amber-100 block">획득 코인</span>
            <span className="text-2xl font-black text-white">+{mission.rewardCoins} 코인</span>
          </div>
          <div className="bg-white/20 rounded-2xl px-5 py-2.5 border border-white/30 text-center">
            <span className="text-xs font-bold text-amber-100 block">스탬프</span>
            <span className="text-2xl font-black text-amber-200 flex items-center gap-1.5 justify-center">
              <Stamp className="w-5 h-5" />
              <span>+1개 쾅!</span>
            </span>
          </div>
        </div>
      </div>

      {/* Realistic Receipt Paper with Product Photos */}
      <div className="bg-white rounded-3xl border-3 border-slate-300 p-6 shadow-md font-mono text-slate-800 text-xs sm:text-sm relative print:border-none">
        {/* Receipt Header */}
        <div className="text-center pb-4 border-b border-dashed border-slate-300">
          <p className="font-sans font-black text-xl text-slate-900 tracking-tight">
            🏪 우리동네 행복 편의점
          </p>
          <p className="text-xs text-slate-500 mt-1">
            특수학급 중학생 편의점 경제 교실 가맹점
          </p>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>영수증 번호: 2026-1106-0042</span>
            <span>일시: {new Date().toLocaleDateString('ko-KR')}</span>
          </div>
        </div>

        {/* Item Rows with Product Photos */}
        <div className="py-4 border-b border-dashed border-slate-300 space-y-3">
          <div className="flex justify-between font-bold text-slate-500 text-xs pb-1 border-b border-slate-100">
            <span>구매 상품 (사진)</span>
            <div className="flex gap-6">
              <span>수량</span>
              <span>금액</span>
            </div>
          </div>

          {cart.map((item) => (
            <div key={item.product.id} className="flex justify-between items-center text-slate-800 font-medium">
              <div className="flex items-center gap-2 max-w-[200px] sm:max-w-[280px]">
                {item.product.imageSrc ? (
                  <img
                    src={item.product.imageSrc}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 object-cover rounded-lg border border-slate-300 shrink-0"
                  />
                ) : (
                  <span className="text-xl p-1 bg-slate-100 rounded-md">
                    {item.product.imageEmoji}
                  </span>
                )}
                <span className="truncate font-sans font-bold text-slate-900">
                  {item.product.name}
                </span>
              </div>
              <div className="flex gap-6 shrink-0 tabular-nums">
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <span className="w-20 text-right font-black">
                  {(item.product.price * item.quantity).toLocaleString()}원
                </span>
              </div>
            </div>
          ))}

          {bagAdded && (
            <div className="flex justify-between items-center text-slate-800 font-medium pt-1">
              <span className="font-sans font-bold">🛍️ 편의점 비닐봉투</span>
              <div className="flex gap-6 shrink-0 tabular-nums">
                <span className="w-8 text-center font-bold">1</span>
                <span className="w-20 text-right font-black">100원</span>
              </div>
            </div>
          )}
        </div>

        {/* Totals & Calculations */}
        <div className="py-3 border-b border-dashed border-slate-300 space-y-2 text-sm">
          <div className="flex justify-between font-black text-base text-slate-900">
            <span>합계 금액</span>
            <span className="tabular-nums text-amber-700">{totalAmount.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span>결제 수단</span>
            <span className="font-bold">
              {paymentMethod === 'card' ? '교통카드 (T-money)' : '현금 지불'}
            </span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span>받은 금액</span>
            <span className="tabular-nums font-bold">{paidAmount.toLocaleString()}원</span>
          </div>
          {paymentMethod === 'cash' && (
            <div className="flex justify-between text-emerald-800 font-black bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-300">
              <span>돌려받은 거스름돈</span>
              <span className="tabular-nums text-lg">{change.toLocaleString()}원</span>
            </div>
          )}
        </div>

        {/* Receipt Footer Message */}
        <div className="pt-4 text-center text-xs text-slate-500 space-y-1">
          <p className="font-bold text-slate-800 font-sans text-sm">
            "이용해 주셔서 감사합니다! 또 오세요!"
          </p>
          <p className="font-mono tracking-widest text-xs text-slate-400">
            ||||||| | ||||| |||| |||||||| ||||
          </p>
        </div>
      </div>

      {/* Large Simple Bottom Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto h-14 px-5 rounded-2xl border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-5 h-5 text-slate-500" />
          <span>영수증 인쇄하기</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onRestartMission}
            className="flex-1 sm:flex-none h-14 px-5 rounded-2xl border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>다시 연습하기</span>
          </button>
          <button
            onClick={onNextMission}
            className="flex-1 sm:flex-none h-14 px-7 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-base shadow-md flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-600"
          >
            <span>다음 미션 도전!</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
