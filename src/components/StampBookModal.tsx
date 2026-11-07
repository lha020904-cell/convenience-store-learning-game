/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Award, Stamp, CheckCircle, Sparkles } from 'lucide-react';
import { AchievementBadge } from '../types';

interface StampBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  stampsCount: number;
  badges: AchievementBadge[];
  coins: number;
  onOpenCertificate: () => void;
}

export const StampBookModal: React.FC<StampBookModalProps> = ({
  isOpen,
  onClose,
  stampsCount,
  badges,
  coins,
  onOpenCertificate,
}) => {
  if (!isOpen) return null;

  // 5 stamps per card
  const maxStamps = 5;
  const stampSlots = Array.from({ length: maxStamps });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border-2 border-amber-300 max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-amber-100">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-sm">
            💮
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              나의 쇼핑 스탬프 & 칭찬 뱃지판
            </h3>
            <p className="text-xs text-slate-500">
              미션을 완료할 때마다 '참 잘했어요' 도장과 달인 뱃지를 획득해요!
            </p>
          </div>
        </div>

        {/* Coin & Stamp Status Summary */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-center">
            <span className="text-xs font-bold text-amber-800 block">모은 쇼핑 코인</span>
            <span className="text-2xl font-black text-amber-600 tabular-nums">
              🪙 {coins} 코인
            </span>
          </div>
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl text-center">
            <span className="text-xs font-bold text-orange-800 block">획득한 도장</span>
            <span className="text-2xl font-black text-orange-600 tabular-nums">
              💮 {stampsCount} / {maxStamps} 개
            </span>
          </div>
        </div>

        {/* 5-Stamp Card */}
        <div className="mt-5 p-4.5 bg-linear-to-b from-amber-100/60 to-orange-100/60 border-2 border-dashed border-amber-300 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-amber-900">
              💮 참 잘했어요! 스탬프 북 (5개 모으면 수료증 완성)
            </span>
            {stampsCount >= maxStamps && (
              <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                ★ 달인 완성!
              </span>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {stampSlots.map((_, i) => {
              const isStamped = i < stampsCount;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-1 transition-all ${
                    isStamped
                      ? 'bg-amber-500 border-amber-600 text-white shadow-md transform rotate-[-3deg]'
                      : 'bg-white/80 border-amber-200 text-amber-300'
                  }`}
                >
                  {isStamped ? (
                    <div className="text-center">
                      <span className="text-xl sm:text-2xl block">💮</span>
                      <span className="text-[9px] font-black block tracking-tighter">
                        참잘했어요
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-amber-300">{i + 1}</span>
                  )}
                </div>
              );
            })}
          </div>

          {stampsCount >= maxStamps && (
            <div className="mt-4 pt-3 border-t border-amber-200 text-center">
              <p className="text-xs font-bold text-amber-900 mb-2">
                🎉 축하합니다! 스탬프 5개를 모두 모아 편의점 달인이 되었습니다!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenCertificate();
                }}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl shadow-md inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>편의점 쇼핑 달인 인증서 발급받기 ➔</span>
              </button>
            </div>
          )}
        </div>

        {/* Badges Collection */}
        <div className="mt-5">
          <h4 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>나의 편의점 마스터 뱃지 도감</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${
                  badge.unlocked
                    ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <h5 className="font-black text-xs text-slate-900 truncate">
                  {badge.title}
                </h5>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                  {badge.description}
                </p>
                <span
                  className={`inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                    badge.unlocked
                      ? 'bg-amber-200/60 text-amber-900'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {badge.unlocked ? '획득 완료' : '도전 중'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
