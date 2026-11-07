/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// Real photo paths for all banknotes and coins
export const REAL_BILL_10000_PATH = '/src/assets/images/photo_bill_10000_1794019538374.jpg';
export const REAL_BILL_5000_PATH = '/src/assets/images/photo_bill_5000_1794019538758.jpg';
export const REAL_BILL_1000_PATH = '/src/assets/images/korean_bill_1000_1794017499620.jpg';
export const REAL_COINS_SET_PATH = '/src/assets/images/korean_coins_set_1794017499452.jpg';

interface BillProps {
  amount: 1000 | 5000 | 10000;
  count?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 100% Real Photo Korean Banknote Component (10,000원, 5,000원, 1,000원)
 */
export const KoreanBill: React.FC<BillProps> = ({
  amount,
  count,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-32 h-18 text-[11px]',
    md: 'w-48 h-26 text-xs',
    lg: 'w-64 h-36 text-sm',
  }[size];

  const config = {
    10000: {
      img: REAL_BILL_10000_PATH,
      alt: '10,000원 실제 지폐 실물 사진 (세종대왕)',
      label: '10,000원 (만 원)',
      border: 'border-emerald-600',
      badgeBg: 'bg-emerald-800',
    },
    5000: {
      img: REAL_BILL_5000_PATH,
      alt: '5,000원 실제 지폐 실물 사진 (율곡 이이)',
      label: '5,000원 (오천 원)',
      border: 'border-orange-600',
      badgeBg: 'bg-orange-800',
    },
    1000: {
      img: REAL_BILL_1000_PATH,
      alt: '1,000원 실제 지폐 실물 사진 (퇴계 이황)',
      label: '1,000원 (천 원)',
      border: 'border-sky-600',
      badgeBg: 'bg-sky-800',
    },
  }[amount];

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border-3 ${config.border} shadow-md bg-white select-none shrink-0 ${sizeClasses} ${className}`}
    >
      <img
        src={config.img}
        alt={config.alt}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover"
      />
      {/* Bottom identification label banner */}
      <div
        className={`absolute bottom-0 inset-x-0 ${config.badgeBg} text-white font-black text-center text-[10px] sm:text-xs py-0.5 tracking-tight`}
      >
        {config.label} 실물 지폐
      </div>

      {/* Count Badge */}
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-slate-950 text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow-lg border-2 border-white">
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
 * 100% Real Photo Korean Coin Component (500원, 100원, 50원, 10원)
 */
export const KoreanCoin: React.FC<CoinProps> = ({
  amount,
  count,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-14 h-14 text-[10px]',
    md: 'w-18 h-18 text-xs',
    lg: 'w-24 h-24 text-sm',
  }[size];

  // Specific offset in macro photo: 500w (0%), 100w (33%), 50w (66%), 10w (100%)
  const coinPhotoOffsets = {
    500: { offset: '0%', border: 'border-zinc-500', name: '500원 (학)' },
    100: { offset: '-102%', border: 'border-slate-500', name: '100원 (이순신)' },
    50: { offset: '-206%', border: 'border-stone-500', name: '50원 (벼)' },
    10: { offset: '-312%', border: 'border-amber-600', name: '10원 (다보탑)' },
  }[amount];

  return (
    <div
      className={`relative rounded-full border-3 ${coinPhotoOffsets.border} bg-white shadow-md select-none shrink-0 overflow-hidden flex items-center justify-center ${sizeClasses} ${className}`}
      title={`실제 ${coinPhotoOffsets.name} 동전 실물 사진`}
    >
      {/* Real Macro Coin Photo */}
      <div className="w-full h-full relative overflow-hidden rounded-full">
        <img
          src={REAL_COINS_SET_PATH}
          alt={`실제 ${amount}원 동전 사진`}
          referrerPolicy="no-referrer"
          className="absolute max-w-none h-full object-cover pointer-events-none"
          style={{
            width: '415%',
            height: '100%',
            left: coinPhotoOffsets.offset,
            top: '0%',
          }}
        />
      </div>

      {/* Denomination badge */}
      <span className="absolute bottom-0 inset-x-0 bg-slate-950/85 text-white font-black text-[9px] sm:text-[11px] text-center leading-tight py-0.5">
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
 * Real Currency Showcase Guide Banner with Photos of All Bills and Coins
 */
export const RealCurrencyGuideBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-black text-amber-950 flex items-center gap-1.5">
          <span>📸 실제 대한민국 지폐와 동전 실물 사진 도감</span>
        </span>
        <span className="text-xs text-slate-600 font-bold">
          모든 권종 실물 사진 적용
        </span>
      </div>

      {/* 3 Real Banknotes Row */}
      <div>
        <span className="text-[11px] font-bold text-slate-700 block mb-1">
          실제 지폐 사진 (10,000원 · 5,000원 · 1,000원)
        </span>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl overflow-hidden border border-emerald-400 bg-white shadow-xs">
            <img
              src={REAL_BILL_10000_PATH}
              alt="10,000원 실물 사진"
              referrerPolicy="no-referrer"
              className="w-full h-16 sm:h-20 object-cover"
            />
            <span className="block text-center font-black text-[10px] sm:text-xs text-emerald-900 bg-emerald-100 py-0.5">
              10,000원 (세종대왕)
            </span>
          </div>

          <div className="rounded-xl overflow-hidden border border-orange-400 bg-white shadow-xs">
            <img
              src={REAL_BILL_5000_PATH}
              alt="5,000원 실물 사진"
              referrerPolicy="no-referrer"
              className="w-full h-16 sm:h-20 object-cover"
            />
            <span className="block text-center font-black text-[10px] sm:text-xs text-orange-900 bg-orange-100 py-0.5">
              5,000원 (율곡 이이)
            </span>
          </div>

          <div className="rounded-xl overflow-hidden border border-sky-400 bg-white shadow-xs">
            <img
              src={REAL_BILL_1000_PATH}
              alt="1,000원 실물 사진"
              referrerPolicy="no-referrer"
              className="w-full h-16 sm:h-20 object-cover"
            />
            <span className="block text-center font-black text-[10px] sm:text-xs text-sky-900 bg-sky-100 py-0.5">
              1,000원 (퇴계 이황)
            </span>
          </div>
        </div>
      </div>

      {/* Real Coins Set Row */}
      <div className="bg-white rounded-xl border border-amber-200 p-2 text-center">
        <span className="text-[11px] font-bold text-slate-700 block mb-1">
          실제 동전 실물 사진 (500원 · 100원 · 50원 · 10원)
        </span>
        <div className="h-16 sm:h-20 w-full overflow-hidden rounded-lg border border-slate-200 bg-white flex items-center justify-center">
          <img
            src={REAL_COINS_SET_PATH}
            alt="실제 대한민국 동전 실물 사진"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};
