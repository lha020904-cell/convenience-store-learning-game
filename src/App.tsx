/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from './components/Header';
import { ShoppingGame } from './components/ShoppingGame';
import { PricePractice } from './components/PricePractice';
import { MoneyPractice } from './components/MoneyPractice';
import { DialoguePractice } from './components/DialoguePractice';
import { StampBookModal } from './components/StampBookModal';
import { CertificateModal } from './components/CertificateModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { INITIAL_BADGES } from './data/missions';
import { AchievementBadge } from './types';
import { Heart, Sparkles, BookOpen, Volume2, Trophy } from 'lucide-react';
import { speakKorean } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = React.useState<'game' | 'price' | 'money' | 'dialogue'>('game');

  // Persistent coins, stamps, and badges
  const [coins, setCoins] = React.useState<number>(() => {
    const saved = localStorage.getItem('convenience_coins');
    return saved ? parseInt(saved, 10) : 100;
  });

  const [stampsCount, setStampsCount] = React.useState<number>(() => {
    const saved = localStorage.getItem('convenience_stamps');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [badges, setBadges] = React.useState<AchievementBadge[]>(() => {
    const saved = localStorage.getItem('convenience_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [isStampBookOpen, setIsStampBookOpen] = React.useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = React.useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = React.useState(false);

  // Sync with localStorage
  React.useEffect(() => {
    localStorage.setItem('convenience_coins', coins.toString());
  }, [coins]);

  React.useEffect(() => {
    localStorage.setItem('convenience_stamps', stampsCount.toString());
  }, [stampsCount]);

  React.useEffect(() => {
    localStorage.setItem('convenience_badges', JSON.stringify(badges));
  }, [badges]);

  // Handlers
  const handleEarnCoins = (amount: number) => {
    setCoins((prev) => prev + amount);
  };

  const handleEarnStamp = () => {
    setStampsCount((prev) => Math.min(5, prev + 1));
  };

  const handleUnlockBadge = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) =>
        b.id === badgeId
          ? {
              ...b,
              unlocked: true,
              unlockedDate: new Date().toISOString().split('T')[0],
            }
          : b
      )
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/50 via-white to-orange-50/30 text-slate-800 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        coins={coins}
        stampsCount={stampsCount}
        onOpenStamps={() => setIsStampBookOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Welcome Kicker Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-linear-to-r from-amber-400/20 via-orange-300/20 to-amber-200/20 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-white rounded-xl shadow-xs">
              🏪
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                  특수학급 중학생 맞춤 교육
                </span>
                <span className="text-xs text-slate-600 font-bold">
                  자립 생활 실천 프로그램
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                편의점 물건 구매하기 게임에 오신 것을 환영해요!
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                speakKorean(
                  '도전 편의점 쇼핑왕에 오신 것을 환영합니다! 실전 쇼핑 미션이나 가격표 읽기, 화폐 계산, 점원 대화 연습을 선택해 보세요.'
                )
              }
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>안내 듣기</span>
            </button>
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer border border-amber-600"
            >
              <Trophy className="w-4 h-4 text-amber-200" />
              <span>실시간 명예의 전당 (리더보드)</span>
            </button>
            <button
              onClick={() => setIsStampBookOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer border border-amber-300"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>도장판 ({stampsCount}/5)</span>
            </button>
          </div>
        </div>

        {/* Tab Content Routing */}
        {currentTab === 'game' && (
          <ShoppingGame
            onEarnCoins={handleEarnCoins}
            onEarnStamp={handleEarnStamp}
            onUnlockBadge={handleUnlockBadge}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            currentCoins={coins}
            currentStamps={stampsCount}
          />
        )}

        {currentTab === 'price' && (
          <PricePractice onEarnCoins={handleEarnCoins} />
        )}

        {currentTab === 'money' && (
          <MoneyPractice onEarnCoins={handleEarnCoins} />
        )}

        {currentTab === 'dialogue' && (
          <DialoguePractice onEarnCoins={handleEarnCoins} />
        )}
      </main>

      {/* Special Education Teacher Guidance & Classroom Support Bar */}
      <footer className="mt-12 bg-white border-t border-amber-200/80 py-8 text-xs text-slate-600 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold">
              🏫
            </div>
            <div>
              <p className="font-bold text-slate-900">
                특수학급 중학생 편의점 경제 생활 훈련 프로그램
              </p>
              <p className="text-[11px] text-slate-500">
                가격표 읽기 · 구매 목록 이해 · 물건 선택 · 바코드 스캔 · 화폐 계산 · 점원 의사소통
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>시간 제한 없는 여유 모드 지원</span>
            <span>·</span>
            <span>한국어 음성(TTS) 읽어주기</span>
            <span>·</span>
            <span>교통카드 & 현금 시뮬레이션</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/convenience-store-learning-game.zip"
              download="convenience-store-learning-game.zip"
              className="text-amber-800 hover:text-amber-950 font-black flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 transition-colors"
            >
              <span>📦 전체 소스코드 ZIP 다운로드</span>
            </a>
            <button
              onClick={() => setIsCertificateOpen(true)}
              className="text-amber-800 hover:text-amber-900 font-bold underline cursor-pointer"
            >
              학습 완료 수료증 출력
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StampBookModal
        isOpen={isStampBookOpen}
        onClose={() => setIsStampBookOpen(false)}
        stampsCount={stampsCount}
        badges={badges}
        coins={coins}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        stampsCount={stampsCount}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentCoins={coins}
        currentStamps={stampsCount}
      />
    </div>
  );
}
