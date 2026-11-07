/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// Real photo paths
export const REAL_BILL_1000_PATH = '/src/assets/images/korean_bill_1000_1794017499620.jpg';
export const REAL_COINS_SET_PATH = '/src/assets/images/korean_coins_set_1794017499452.jpg';

interface BillProps {
  amount: 1000 | 5000 | 10000;
  count?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Korean Banknote with Real Photo (1,000원) and authentic photo-grade banknote styling
 */
export const KoreanBill: React.FC<BillProps> = ({
  amount,
  count,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-28 h-16 text-[10px]',
    md: 'w-44 h-24 text-xs',
    lg: 'w-60 h-32 text-sm',
  }[size];

  // 1,000 won uses the real genuine banknote photo!
  if (amount === 1000) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden border-2 border-sky-400 shadow-md bg-white select-none shrink-0 ${sizeClasses} ${className}`}
      >
        <img
          src={REAL_BILL_1000_PATH}
          alt="1000원 실제 지폐 사진 (퇴계 이황)"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain bg-sky-50"
        />
        <div className="absolute bottom-0 inset-x-0 bg-sky-900/80 text-white font-black text-center text-[10px] sm:text-xs py-0.5">
          1,000원 실물 지폐
        </div>

        {count !== undefined && count > 0 && (
          <span className="absolute -top-1 -right-1 bg-slate-950 text-white font-black text-xs px-2 py-0.5 rounded-full shadow-lg border-2 border-white">
            × {count}장
          </span>
        )}
      </div>
    );
  }

  // 10,000 won (King Sejong, Green) & 5,000 won (Yulgok Yi I, Orange)
  const is10k = amount === 10000;
  const config = is10k
    ? {
        bg: 'bg-emerald-50 border-emerald-500 text-emerald-950',
        label: '10,000원',
        person: '세종대왕',
        personImgText: '세종',
        badgeColor: 'bg-emerald-600',
        ribbonColor: 'bg-emerald-200 text-emerald-900',
        watermark: '조선 4대 왕 세종대왕',
      }
    : {
        bg: 'bg-orange-50 border-orange-500 text-orange-950',
        label: '5,000원',
        person: '율곡 이이',
        personImgText: '이이',
        badgeColor: 'bg-orange-600',
        ribbonColor: 'bg-orange-200 text-orange-900',
        watermark: '조선 학자 율곡 이이',
      };

  return (
    <div
      className={`relative rounded-xl border-3 ${config.bg} ${sizeClasses} shadow-md select-none flex flex-col justify-between p-2 font-mono shrink-0 overflow-hidden ${className}`}
    >
      {/* Top Bar: Bank of Korea & Number */}
      <div className="flex justify-between items-center leading-none">
        <span className="font-sans font-black text-[9px] sm:text-[11px] text-slate-800 tracking-tight">
          한국은행권
        </span>
        <span className="font-black text-xs sm:text-sm tracking-tight text-slate-900">
          {amount.toLocaleString()}
        </span>
      </div>

      {/* Center Layout: Realistic Portrait & Value */}
      <div className="flex items-center justify-between my-auto">
        <div className="flex items-center gap-2">
          {/* Portrait Stamp */}
          <div className="w-8 h-10 sm:w-10 sm:h-12 rounded-md bg-white border-2 border-slate-400 shadow-inner flex flex-col items-center justify-center p-0.5">
            <span className="text-base sm:text-lg">👤</span>
            <span className="font-sans text-[8px] sm:text-[9px] font-black text-slate-800 leading-none">
              {config.person}
            </span>
          </div>

          <div>
            <span className="font-sans font-black text-sm sm:text-base text-slate-900 block leading-tight">
              {config.label}
            </span>
            <span className="font-sans text-[9px] text-slate-600 font-bold">
              {config.watermark}
            </span>
          </div>
        </div>

        {/* Bank Seal Stamp */}
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-red-500 text-red-600 flex items-center justify-center text-[8px] font-black shrink-0">
          한국은행
        </div>
      </div>

      {/* Bottom Bar: Number & Hangul */}
      <div className="flex justify-between items-center text-[10px] leading-none pt-1 border-t border-slate-300">
        <span className="font-black text-slate-900">
          ₩{amount.toLocaleString()}
        </span>
        <span className="font-sans font-bold text-slate-700 text-[10px]">
          {is10k ? '만 원' : '오천 원'}
        </span>
      </div>

      {/* Count Badge */}
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-slate-950 text-white font-black text-xs px-2 py-0.5 rounded-full shadow-lg border-2 border-white">
          × {count}장
        </span>
      )}
    </div>
  );
};

interface CoinProps {
  amount: 10 | 50 | 100 | 500;
  count?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Real Coin Photo Component (Cropped directly from real high-res macro photo)
 */
export const KoreanCoin: React.FC<CoinProps> = ({
  amount,
  count,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-[10px]',
    md: 'w-16 h-16 text-xs',
    lg: 'w-20 h-20 text-sm',
  }[size];

  // Specific position for each coin in the real coins photo:
  // 500 won (leftmost ~16%), 100 won (~41%), 50 won (~64%), 10 won (rightmost ~87%)
  const coinPhotoOffsets = {
    500: { posX: '16%', name: '500원 (학)' },
    100: { posX: '41%', name: '100원 (이순신)' },
    50: { posX: '64%', name: '50원 (벼)' },
    10: { posX: '87%', name: '10원 (다보탑)' },
  }[amount];

  return (
    <div
      className={`relative rounded-full border-3 border-slate-400 bg-white shadow-md select-none shrink-0 overflow-hidden flex items-center justify-center ${sizeClasses} ${className}`}
      title={`실제 ${coinPhotoOffsets.name} 동전 사진`}
    >
      {/* Real Macro Coin Photo Cropped to This Circle */}
      <div className="w-full h-full relative overflow-hidden rounded-full">
        <img
          src={REAL_COINS_SET_PATH}
          alt={`실제 ${amount}원 동전 사진`}
          referrerPolicy="no-referrer"
          className="absolute max-w-none h-full object-cover pointer-events-none"
          style={{
            width: '420%',
            height: '100%',
            left:
              amount === 500
                ? '0%'
                : amount === 100
                ? '-105%'
                : amount === 50
                ? '-210%'
                : '-315%',
            top: '0%',
          }}
        />
      </div>

      {/* Subtle overlay denomination tag */}
      <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white font-black text-[9px] sm:text-[10px] text-center leading-tight py-0.2">
        {amount}원
      </span>

      {/* Count Badge */}
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-slate-950 text-white font-black text-xs px-2 py-0.5 rounded-full shadow-lg border-2 border-white">
          × {count}개
        </span>
      )}
    </div>
  );
};

/**
 * Currency Showcase Card showing real photo of all coins and 1,000 won bill together
 */
export const RealCurrencyGuideBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
          <span>📸 실제 대한민국 동전과 지폐 실물 사진</span>
        </span>
        <span className="text-[11px] text-slate-500 font-bold">
          실물 크기 비교 학습
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Real Coins Set Photo */}
        <div className="bg-white rounded-xl border border-amber-200 p-2 text-center">
          <span className="text-[11px] font-bold text-slate-700 block mb-1">
            실제 동전 실물 사진 (500원 · 100원 · 50원 · 10원)
          </span>
          <div className="h-20 w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
            <img
              src={REAL_COINS_SET_PATH}
              alt="실제 대한민국 동전 실물 사진"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Real 1,000 Won Bill Photo */}
        <div className="bg-white rounded-xl border border-amber-200 p-2 text-center">
          <span className="text-[11px] font-bold text-slate-700 block mb-1">
            실제 1,000원 지폐 실물 사진 (퇴계 이황)
          </span>
          <div className="h-20 w-full overflow-hidden rounded-lg border border-slate-200 bg-sky-50">
            <img
              src={REAL_BILL_1000_PATH}
              alt="실제 대한민국 1,000원 지폐 실물 사진"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
