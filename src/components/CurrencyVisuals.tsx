/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// Real photo paths for all banknotes
export const REAL_BILL_10000_PATH = '/src/assets/images/photo_bill_10000_1794019538374.jpg';
export const REAL_BILL_5000_PATH = '/src/assets/images/photo_bill_5000_1794019538758.jpg';
export const REAL_BILL_1000_PATH = '/src/assets/images/korean_bill_1000_1794017499620.jpg';

// Real individual front-face (앞면) photos for all coins
export const REAL_COIN_500_FRONT = '/src/assets/images/coin_500_front_1794019944387.jpg';
export const REAL_COIN_100_FRONT = '/src/assets/images/coin_100_front_1794019943974.jpg';
export const REAL_COIN_50_FRONT = '/src/assets/images/coin_50_front_1794019945546.jpg';
export const REAL_COIN_10_FRONT = '/src/assets/images/coin_10_front_1794019944929.jpg';

interface BillProps {
  amount: 1000 | 5000 | 10000;
  count?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Korean Banknote with 100% Real Photo, background removed, isolated clean paper look
 */
export const KoreanBill: React.FC<BillProps> = ({
  amount,
  count,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-32 h-18',
    md: 'w-48 h-26',
    lg: 'w-64 h-36',
  }[size];

  const config = {
    10000: {
      img: REAL_BILL_10000_PATH,
      alt: '10,000원 실제 지폐 실물 사진 (세종대왕)',
      label: '10,000원',
      border: 'border-emerald-600',
    },
    5000: {
      img: REAL_BILL_5000_PATH,
      alt: '5,000원 실제 지폐 실물 사진 (율곡 이이)',
      label: '5,000원',
      border: 'border-orange-600',
    },
    1000: {
      img: REAL_BILL_1000_PATH,
      alt: '1,000원 실제 지폐 실물 사진 (퇴계 이황)',
      label: '1,000원',
      border: 'border-sky-600',
    },
  }[amount];

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-md select-none shrink-0 border-2 ${config.border} bg-white ${sizeClasses} ${className}`}
    >
      <img
        src={config.img}
        alt={config.alt}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover"
      />

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
 * 100% Pure Isolated Front-Face (앞면) Coin Photo Component
 * - Pure circular cutout with zero background box
 * - Clean drop shadow matching real physical currency
 * - No text overlay covering the coin face
 */
export const KoreanCoin: React.FC<CoinProps> = ({
  amount,
  count,
  className = '',
  size = 'md',
}) => {
  // Proportional coin sizes (500 > 100 > 50 > 10)
  const sizeClasses = {
    sm: {
      500: 'w-15 h-15',
      100: 'w-14 h-14',
      50: 'w-13 h-13',
      10: 'w-12 h-12',
    }[amount],
    md: {
      500: 'w-22 h-22',
      100: 'w-20 h-20',
      50: 'w-18 h-18',
      10: 'w-16 h-16',
    }[amount],
    lg: {
      500: 'w-28 h-28',
      100: 'w-25 h-25',
      50: 'w-23 h-23',
      10: 'w-21 h-21',
    }[amount],
  }[size];

  const config = {
    500: {
      img: REAL_COIN_500_FRONT,
      alt: '500원 실제 동전 앞면 사진 (학)',
      label: '500원',
    },
    100: {
      img: REAL_COIN_100_FRONT,
      alt: '100원 실제 동전 앞면 사진 (이순신 장군)',
      label: '100원',
    },
    50: {
      img: REAL_COIN_50_FRONT,
      alt: '50원 실제 동전 앞면 사진 (벼 이삭)',
      label: '50원',
    },
    10: {
      img: REAL_COIN_10_FRONT,
      alt: '10원 실제 동전 앞면 사진 (다보탑)',
      label: '10원',
    },
  }[amount];

  return (
    <div
      className={`relative rounded-full select-none shrink-0 filter drop-shadow-md overflow-hidden bg-transparent flex items-center justify-center ${sizeClasses} ${className}`}
      title={`${config.label} 실제 동전 앞면`}
    >
      {/* 100% Real Front-Face Macro Coin Photo */}
      <img
        src={config.img}
        alt={config.alt}
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain rounded-full pointer-events-none"
      />

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
 * Real Currency Front-Face Showcase Guide Banner
 */
export const RealCurrencyGuideBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-black text-amber-950 flex items-center gap-1.5">
          <span>🪙 실제 대한민국 화폐 앞면 실물 사진</span>
        </span>
        <span className="text-xs text-slate-600 font-bold">
          동전 앞면 통일 및 배경 제거
        </span>
      </div>

      {/* 4 Isolated Real Front-Face Coins Row */}
      <div className="bg-white/80 rounded-2xl p-4 border border-amber-200">
        <span className="text-xs font-black text-slate-800 block mb-2 text-center">
          동전 앞면 실물 사진 (500원 학 · 100원 이순신 · 50원 벼 · 10원 다보탑)
        </span>
        <div className="flex items-center justify-around gap-2">
          <div className="flex flex-col items-center">
            <KoreanCoin amount={500} size="md" />
            <span className="text-xs font-black text-slate-800 mt-1">500원 (학)</span>
          </div>
          <div className="flex flex-col items-center">
            <KoreanCoin amount={100} size="md" />
            <span className="text-xs font-black text-slate-800 mt-1">100원 (이순신)</span>
          </div>
          <div className="flex flex-col items-center">
            <KoreanCoin amount={50} size="md" />
            <span className="text-xs font-black text-slate-800 mt-1">50원 (벼)</span>
          </div>
          <div className="flex flex-col items-center">
            <KoreanCoin amount={10} size="md" />
            <span className="text-xs font-black text-slate-800 mt-1">10원 (다보탑)</span>
          </div>
        </div>
      </div>

      {/* 3 Real Banknotes Row */}
      <div>
        <span className="text-xs font-black text-slate-800 block mb-2 text-center">
          지폐 실물 사진 (10,000원 세종대왕 · 5,000원 율곡 이이 · 1,000원 퇴계 이황)
        </span>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center">
            <KoreanBill amount={10000} size="sm" className="w-full" />
            <span className="text-xs font-black text-emerald-900 mt-1">10,000원</span>
          </div>
          <div className="flex flex-col items-center">
            <KoreanBill amount={5000} size="sm" className="w-full" />
            <span className="text-xs font-black text-orange-900 mt-1">5,000원</span>
          </div>
          <div className="flex flex-col items-center">
            <KoreanBill amount={1000} size="sm" className="w-full" />
            <span className="text-xs font-black text-sky-900 mt-1">1,000원</span>
          </div>
        </div>
      </div>
    </div>
  );
};
