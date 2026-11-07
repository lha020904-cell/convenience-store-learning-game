/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CreditCard, RotateCcw, Check } from 'lucide-react';
import { playCoinSound, playCardTapSound, speakKorean } from '../utils/audio';
import { KoreanBill, KoreanCoin, RealCurrencyGuideBanner } from './CurrencyVisuals';

interface PaymentPadProps {
  totalAmount: number;
  onPaymentComplete: (paidAmount: number, method: 'cash' | 'card') => void;
  onCancel: () => void;
  level: string;
}

export const PaymentPad: React.FC<PaymentPadProps> = ({
  totalAmount,
  onPaymentComplete,
  onCancel,
  level,
}) => {
  const [paidCoins, setPaidCoins] = React.useState<{ [key: string]: number }>({
    won10000: 0,
    won5000: 0,
    won1000: 0,
    won500: 0,
    won100: 0,
    won50: 0,
    won10: 0,
  });

  const [paymentMethod, setPaymentMethod] = React.useState<'cash' | 'card'>('cash');
  const [cardTapped, setCardTapped] = React.useState(false);

  // Calculate current cash amount paid
  const currentPaid =
    paidCoins.won10000 * 10000 +
    paidCoins.won5000 * 5000 +
    paidCoins.won1000 * 1000 +
    paidCoins.won500 * 500 +
    paidCoins.won100 * 100 +
    paidCoins.won50 * 50 +
    paidCoins.won10 * 10;

  const diff = currentPaid - totalAmount;
  const isSufficient = currentPaid >= totalAmount;

  const addMoney = (key: string, value: number, name: string) => {
    playCoinSound();
    setPaidCoins((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));
    speakKorean(`${name}을 냈습니다. 현재 낸 돈은 ${(currentPaid + value).toLocaleString()}원입니다.`);
  };

  const removeMoney = (key: string, value: number) => {
    if (paidCoins[key] <= 0) return;
    playCoinSound();
    setPaidCoins((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] - 1),
    }));
  };

  const resetMoney = () => {
    setPaidCoins({
      won10000: 0,
      won5000: 0,
      won1000: 0,
      won500: 0,
      won100: 0,
      won50: 0,
      won10: 0,
    });
    speakKorean('돈을 다시 처음부터 셉니다.');
  };

  const handleCardTap = () => {
    playCardTapSound();
    setCardTapped(true);
    speakKorean(`교통카드로 ${totalAmount.toLocaleString()}원이 결제되었습니다!`);
    setTimeout(() => {
      onPaymentComplete(totalAmount, 'card');
    }, 700);
  };

  const handleCashPay = () => {
    if (!isSufficient) {
      speakKorean(`돈이 ${Math.abs(diff).toLocaleString()}원 부족해요. 돈을 더 내주세요!`);
      return;
    }
    playCoinSound();
    speakKorean(
      diff > 0
        ? `총 ${currentPaid.toLocaleString()}원을 냈습니다. 거스름돈은 ${diff.toLocaleString()}원입니다!`
        : `금액에 딱 맞게 ${currentPaid.toLocaleString()}원을 냈습니다. 참 잘했어요!`
    );
    onPaymentComplete(currentPaid, 'cash');
  };

  return (
    <div className="bg-white rounded-3xl border-3 border-amber-400 p-6 shadow-xl max-w-3xl mx-auto space-y-6">
      {/* Header & Total Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-sm font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-lg">
            계산대 결제 단계
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2">
            물건값을 지불해 주세요
          </h3>
          <p className="text-sm text-slate-600 mt-0.5">
            지폐나 동전 그림을 눌러 계산대에 올려놓으세요.
          </p>
        </div>
        <div className="bg-white border-2 border-amber-400 rounded-2xl px-6 py-3 text-right shadow-sm shrink-0">
          <p className="text-xs font-bold text-slate-500">내야 할 금액</p>
          <p className="text-3xl font-black text-amber-600 tabular-nums">
            {totalAmount.toLocaleString()} <span className="text-base font-bold text-slate-700">원</span>
          </p>
        </div>
      </div>

      {/* Large Simple Payment Mode Switch */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            setPaymentMethod('cash');
            speakKorean('현금으로 지불하기를 선택했습니다.');
          }}
          className={`h-14 rounded-2xl text-base font-black flex items-center justify-center gap-2 border-3 transition-colors cursor-pointer ${
            paymentMethod === 'cash'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md'
              : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-amber-50'
          }`}
        >
          <span>💵 현금(지폐·동전) 내기</span>
        </button>

        <button
          onClick={() => {
            setPaymentMethod('card');
            speakKorean('교통카드로 간편하게 지불하기를 선택했습니다.');
          }}
          className={`h-14 rounded-2xl text-base font-black flex items-center justify-center gap-2 border-3 transition-colors cursor-pointer ${
            paymentMethod === 'card'
              ? 'bg-sky-600 text-white border-sky-700 shadow-md'
              : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-sky-50'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>💳 교통카드 삑! 찍기</span>
        </button>
      </div>

      {paymentMethod === 'cash' ? (
        <div className="space-y-6">
          {/* Status Display: Paid vs Required */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-100 rounded-2xl border-2 border-slate-300">
            <div>
              <span className="text-xs font-bold text-slate-600 block">내가 계산대에 올린 돈</span>
              <p className="text-2xl font-black text-slate-900 tabular-nums mt-0.5">
                {currentPaid.toLocaleString()} 원
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-600 block">
                {diff >= 0 ? '돌려받을 거스름돈' : '부족한 금액 (더 내야 함)'}
              </span>
              <p
                className={`text-2xl font-black tabular-nums mt-0.5 ${
                  diff >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {Math.abs(diff).toLocaleString()} 원
              </p>
            </div>
          </div>

          {/* Real Currency Photo Reference Guide */}
          <RealCurrencyGuideBanner />

          {/* Section 1: Bills (실제 지폐 사진 & 큰 버튼) */}
          <div>
            <h4 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
              <span>💵 지폐 올리기 (실제 지폐 사진)</span>
              <span className="text-xs text-slate-500 font-normal">
                (원하는 지폐를 터치하면 계산대에 올라갑니다)
              </span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 10,000 won Bill Button */}
              <button
                onClick={() => addMoney('won10000', 10000, '만 원 지폐')}
                className="p-3 bg-white hover:bg-emerald-50 border-3 border-emerald-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer shadow-sm hover:border-emerald-600 transition-colors"
              >
                <KoreanBill amount={10000} size="md" />
                <div className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm flex items-center justify-center">
                  + 10,000원 올리기
                </div>
              </button>

              {/* 5,000 won Bill Button */}
              <button
                onClick={() => addMoney('won5000', 5000, '오천 원 지폐')}
                className="p-3 bg-white hover:bg-orange-50 border-3 border-orange-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer shadow-sm hover:border-orange-600 transition-colors"
              >
                <KoreanBill amount={5000} size="md" />
                <div className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-sm flex items-center justify-center">
                  + 5,000원 올리기
                </div>
              </button>

              {/* 1,000 won Bill Button */}
              <button
                onClick={() => addMoney('won1000', 1000, '천 원 지폐')}
                className="p-3 bg-white hover:bg-sky-50 border-3 border-sky-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer shadow-sm hover:border-sky-600 transition-colors"
              >
                <KoreanBill amount={1000} size="md" />
                <div className="w-full h-11 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-black text-sm flex items-center justify-center">
                  + 1,000원 올리기
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Coins (동전 앞면 실물 사진 & 큰 버튼) */}
          <div>
            <h4 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
              <span>🪙 동전 올리기 (앞면 실물 사진: 학 · 이순신 · 벼 · 다보탑)</span>
              <span className="text-xs text-slate-500 font-normal">
                (원하는 동전을 터치하면 계산대에 올라갑니다)
              </span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* 500 won Coin Button */}
              <button
                onClick={() => addMoney('won500', 500, '오백 원 동전')}
                className="p-3 bg-white hover:bg-zinc-50 border-3 border-zinc-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer shadow-sm hover:border-zinc-600 transition-colors"
              >
                <KoreanCoin amount={500} size="md" />
                <div className="w-full h-10 bg-zinc-700 hover:bg-zinc-800 text-white rounded-xl font-black text-xs flex items-center justify-center">
                  + 500원 올리기
                </div>
              </button>

              {/* 100 won Coin Button */}
              <button
                onClick={() => addMoney('won100', 100, '백 원 동전')}
                className="p-3 bg-white hover:bg-slate-50 border-3 border-slate-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer shadow-sm hover:border-slate-600 transition-colors"
              >
                <KoreanCoin amount={100} size="md" />
                <div className="w-full h-10 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-black text-xs flex items-center justify-center">
                  + 100원 올리기
                </div>
              </button>

              {/* 50 won Coin Button */}
              <button
                onClick={() => addMoney('won50', 50, '오십 원 동전')}
                className="p-3 bg-white hover:bg-stone-50 border-3 border-stone-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer shadow-sm hover:border-stone-600 transition-colors"
              >
                <KoreanCoin amount={50} size="md" />
                <div className="w-full h-10 bg-stone-600 hover:bg-stone-700 text-white rounded-xl font-black text-xs flex items-center justify-center">
                  + 50원 올리기
                </div>
              </button>

              {/* 10 won Coin Button */}
              <button
                onClick={() => addMoney('won10', 10, '십 원 동전')}
                className="p-3 bg-white hover:bg-amber-50 border-3 border-amber-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer shadow-sm hover:border-amber-600 transition-colors"
              >
                <KoreanCoin amount={10} size="md" />
                <div className="w-full h-10 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-black text-xs flex items-center justify-center">
                  + 10원 올리기
                </div>
              </button>
            </div>
          </div>

          {/* Currently Placed Money Tray */}
          {currentPaid > 0 && (
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black text-amber-950">
                  내가 계산대에 올린 화폐 (빼려면 그림을 터치하세요):
                </span>
                <button
                  onClick={resetMoney}
                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>모두 지우기</span>
                </button>
              </div>

              {/* Visual Display of Bills and Coins in Tray */}
              <div className="flex flex-wrap items-center gap-3">
                {paidCoins.won10000 > 0 && (
                  <button
                    onClick={() => removeMoney('won10000', 10000)}
                    title="10,000원 1장 빼기"
                    className="cursor-pointer"
                  >
                    <KoreanBill amount={10000} count={paidCoins.won10000} size="sm" />
                  </button>
                )}
                {paidCoins.won5000 > 0 && (
                  <button
                    onClick={() => removeMoney('won5000', 5000)}
                    title="5,000원 1장 빼기"
                    className="cursor-pointer"
                  >
                    <KoreanBill amount={5000} count={paidCoins.won5000} size="sm" />
                  </button>
                )}
                {paidCoins.won1000 > 0 && (
                  <button
                    onClick={() => removeMoney('won1000', 1000)}
                    title="1,000원 1장 빼기"
                    className="cursor-pointer"
                  >
                    <KoreanBill amount={1000} count={paidCoins.won1000} size="sm" />
                  </button>
                )}
                {paidCoins.won500 > 0 && (
                  <button
                    onClick={() => removeMoney('won500', 500)}
                    title="500원 1개 빼기"
                    className="cursor-pointer"
                  >
                    <KoreanCoin amount={500} count={paidCoins.won500} size="md" />
                  </button>
                )}
                {paidCoins.won100 > 0 && (
                  <button
                    onClick={() => removeMoney('won100', 100)}
                    title="100원 1개 빼기"
                    className="cursor-pointer"
                  >
                    <KoreanCoin amount={100} count={paidCoins.won100} size="md" />
                  </button>
                )}
                {paidCoins.won50 > 0 && (
                  <button
                    onClick={() => removeMoney('won50', 50)}
                    title="50원 1개 빼기"
                    className="cursor-pointer"
                  >
                    <KoreanCoin amount={50} count={paidCoins.won50} size="md" />
                  </button>
                )}
                {paidCoins.won10 > 0 && (
                  <button
                    onClick={() => removeMoney('won10', 10)}
                    title="10원 1개 빼기"
                    className="cursor-pointer"
                  >
                    <KoreanCoin amount={10} count={paidCoins.won10} size="md" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Big Simple Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={onCancel}
              className="h-16 rounded-2xl border-3 border-slate-300 font-black text-base text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              장바구니로 돌아가기
            </button>

            <button
              onClick={handleCashPay}
              disabled={!isSufficient}
              className={`sm:col-span-2 h-16 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-colors cursor-pointer border-3 ${
                isSufficient
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-lg'
                  : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
              }`}
            >
              <Check className="w-7 h-7" />
              <span>
                {isSufficient
                  ? '계산 완료하기 (돈 건네기)'
                  : `돈이 ${Math.abs(diff).toLocaleString()}원 부족합니다`}
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* Large Transit Card View */
        <div className="py-8 px-6 bg-sky-50 rounded-3xl border-3 border-dashed border-sky-300 text-center space-y-6">
          <div className="w-36 h-52 mx-auto bg-linear-to-tr from-sky-500 to-indigo-600 rounded-2xl shadow-lg p-4 text-white flex flex-col justify-between border-3 border-white">
            <div className="flex justify-between items-center text-xs font-black">
              <span>T-money</span>
              <span>교통카드</span>
            </div>
            <div className="text-center font-black text-base tracking-wider">
              청소년 교통카드
            </div>
            <div className="text-xs opacity-90 text-right font-bold">
              잔액 충분
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-black text-slate-800">
              교통카드 단말기 터치 패드
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              아래 큰 버튼을 누르면 단말기에 카드가 찍히며{' '}
              <strong className="text-sky-700 font-black">
                {totalAmount.toLocaleString()}원
              </strong>
              이 바로 결제됩니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={onCancel}
              className="w-full sm:w-auto h-16 px-6 rounded-2xl border-3 border-slate-300 font-black text-sm text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              장바구니로 돌아가기
            </button>

            <button
              onClick={handleCardTap}
              disabled={cardTapped}
              className={`flex-1 w-full h-16 rounded-2xl font-black text-xl shadow-lg flex items-center justify-center gap-3 transition-colors cursor-pointer border-3 ${
                cardTapped
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-sky-600 hover:bg-sky-700 text-white border-sky-700'
              }`}
            >
              <CreditCard className="w-7 h-7" />
              <span>{cardTapped ? '삑! 결제 완료 중...' : '단말기에 카드 삑! 찍기'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
