/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Music, Award, Stamp } from 'lucide-react';
import { bgmManager, speakKorean } from '../utils/audio';

interface HeaderProps {
  currentTab: 'game' | 'price' | 'money' | 'dialogue';
  onSelectTab: (tab: 'game' | 'price' | 'money' | 'dialogue') => void;
  coins: number;
  stampsCount: number;
  onOpenStamps: () => void;
  onOpenCertificate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  coins,
  stampsCount,
  onOpenStamps,
  onOpenCertificate,
}) => {
  const [bgmActive, setBgmActive] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  const toggleBgm = () => {
    const active = bgmManager.toggle();
    setBgmActive(active);
    if (active) {
      speakKorean('신나는 편의점 음악이 시작되었습니다.');
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      speakKorean('효과음과 음성 안내가 켜졌습니다.');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-amber-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title (One line text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 border-2 border-amber-600 flex items-center justify-center text-white text-2xl font-black shadow-xs">
            🏪
          </div>
          <button
            onClick={() => onSelectTab('game')}
            className="text-left group cursor-pointer"
          >
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors whitespace-nowrap">
              도전! 편의점 쇼핑왕
            </span>
          </button>
        </div>

        {/* Zone 2: Large Simple Navigation Links */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onSelectTab('game')}
            className={`h-12 px-4 rounded-xl text-sm font-black transition-colors whitespace-nowrap cursor-pointer border-2 ${
              currentTab === 'game'
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-50'
            }`}
          >
            🛒 실전 쇼핑 미션
          </button>

          <button
            onClick={() => onSelectTab('price')}
            className={`h-12 px-4 rounded-xl text-sm font-black transition-colors whitespace-nowrap cursor-pointer border-2 ${
              currentTab === 'price'
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-50'
            }`}
          >
            🏷️ 가격표 읽기
          </button>

          <button
            onClick={() => onSelectTab('money')}
            className={`h-12 px-4 rounded-xl text-sm font-black transition-colors whitespace-nowrap cursor-pointer border-2 ${
              currentTab === 'money'
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-50'
            }`}
          >
            💰 화폐 계산 연습
          </button>

          <button
            onClick={() => onSelectTab('dialogue')}
            className={`h-12 px-4 rounded-xl text-sm font-black transition-colors whitespace-nowrap cursor-pointer border-2 ${
              currentTab === 'dialogue'
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-50'
            }`}
          >
            🗣️ 점원과 대화하기
          </button>
        </nav>

        {/* Zone 3: Audio Controls & Stamp Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* BGM Toggle Button */}
          <button
            onClick={toggleBgm}
            title={bgmActive ? '신나는 배경음악 끄기' : '신나는 배경음악 켜기'}
            className={`h-12 px-3.5 rounded-xl border-2 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer ${
              bgmActive
                ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xs'
                : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Music className={`w-4 h-4 ${bgmActive ? 'text-emerald-700' : 'text-slate-500'}`} />
            <span className="hidden md:inline">{bgmActive ? 'BGM 켜짐' : 'BGM'}</span>
          </button>

          {/* Sound Mute Button */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
            className="h-12 w-12 rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-amber-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Stamps & Badges Button */}
          <button
            onClick={onOpenStamps}
            className="h-12 flex items-center gap-2 px-4 rounded-xl bg-amber-50 border-2 border-amber-400 text-amber-950 font-black text-xs hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <Stamp className="w-4 h-4 text-amber-600" />
            <span>도장 {stampsCount}/5</span>
          </button>

          {/* Certificate Award Button */}
          <button
            onClick={onOpenCertificate}
            className="hidden lg:flex h-12 items-center gap-1.5 px-4 rounded-xl bg-orange-600 text-white font-black text-xs hover:bg-orange-700 shadow-xs transition-colors cursor-pointer border-2 border-orange-700"
          >
            <Award className="w-4 h-4" />
            <span>수료증 받기</span>
          </button>
        </div>
      </div>
    </header>
  );
};
