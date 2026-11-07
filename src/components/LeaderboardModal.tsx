/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Trophy,
  X,
  Sparkles,
  Heart,
  Volume2,
  Award,
  Crown,
  Medal,
  LogIn,
  LogOut,
  Send,
  CheckCircle,
  RefreshCw,
  Flame,
} from 'lucide-react';
import {
  LeaderboardEntryData,
  subscribeToLeaderboard,
  addLeaderboardEntry,
  cheerLeaderboardEntry,
  seedInitialLeaderboardIfEmpty,
  signInWithGoogle,
  logOut,
  auth,
} from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { speakKorean, playSuccessFanfare } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoins: number;
  currentStamps: number;
  initialRegisterMode?: boolean;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentCoins,
  currentStamps,
  initialRegisterMode = false,
}) => {
  const [entries, setEntries] = React.useState<LeaderboardEntryData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filterLevel, setFilterLevel] = React.useState<'all' | 'seed' | 'sprout' | 'fruit'>('all');
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  // Registration Form State
  const [showRegisterForm, setShowRegisterForm] = React.useState(initialRegisterMode);
  const [studentName, setStudentName] = React.useState('');
  const [studentClass, setStudentClass] = React.useState('1반');
  const [studentComment, setStudentComment] = React.useState('거스름돈을 스스로 잘 받았어요!');
  const [selectedLevel, setSelectedLevel] = React.useState<'seed' | 'sprout' | 'fruit'>('sprout');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [cheeredIds, setCheeredIds] = React.useState<Record<string, boolean>>({});

  // Auth state listener
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.displayName && !studentName) {
        setStudentName(user.displayName);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time leaderboard
  React.useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    // Seed initial encouraging entries if completely empty
    seedInitialLeaderboardIfEmpty();

    const unsubscribe = subscribeToLeaderboard((data) => {
      setEntries(data);
      setLoading(false);
    }, 50);

    return () => unsubscribe();
  }, [isOpen]);

  React.useEffect(() => {
    if (initialRegisterMode) {
      setShowRegisterForm(true);
    }
  }, [initialRegisterMode]);

  if (!isOpen) return null;

  // Filtered entries
  const filteredEntries = entries.filter((e) => {
    if (filterLevel === 'all') return true;
    return e.level === filterLevel;
  });

  const top1 = filteredEntries[0];
  const top2 = filteredEntries[1];
  const top3 = filteredEntries[2];

  const handleCheer = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (cheeredIds[id]) return;

    try {
      setCheeredIds((prev) => ({ ...prev, [id]: true }));
      await cheerLeaderboardEntry(id);
      speakKorean('응원을 보냈습니다! 힘내세요!');
    } catch (err) {
      console.error('Cheer error:', err);
    }
  };

  const handleGoogleLogin = async () => {
    const user = await signInWithGoogle();
    if (user?.displayName) {
      setStudentName(user.displayName);
      speakKorean(`${user.displayName} 학생 반갑습니다!`);
    }
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = studentName.trim() || `${studentClass} 쇼핑왕`;

    setIsSubmitting(true);
    try {
      await addLeaderboardEntry({
        playerName: finalName,
        score: currentCoins,
        stamps: currentStamps,
        level: selectedLevel,
        badgeTitle:
          selectedLevel === 'fruit'
            ? '달인 편의점 쇼핑왕'
            : selectedLevel === 'sprout'
            ? '쑥쑥 계산 마스터'
            : '새싹 가격표 탐험가',
        comment: studentComment,
      });

      setSubmitSuccess(true);
      playSuccessFanfare();
      speakKorean(`${finalName} 학생의 점수가 실시간 명예의 전당에 등록되었습니다! 축하합니다!`);

      setTimeout(() => {
        setIsSubmitting(false);
        setShowRegisterForm(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Submit error:', err);
      setIsSubmitting(false);
    }
  };

  const readLeaderboardSummary = () => {
    if (entries.length === 0) {
      speakKorean('현재 등록된 쇼핑왕 기록을 불러오는 중입니다.');
      return;
    }
    const winner = entries[0];
    speakKorean(
      `현재 실시간 쇼핑왕 1위는 ${winner.playerName} 학생입니다! ${winner.score.toLocaleString()} 코인을 획득했습니다. 우리 모두 멋지게 도전해 봐요!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-5 sm:p-6 shrink-0 relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl shadow-sm">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-white/25 text-white text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    실시간 연동 중 (Firebase)
                  </span>
                  <span className="text-xs text-amber-100 font-bold hidden sm:inline">
                    우리 학교 쇼핑왕 친구들
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  실시간 편의점 쇼핑왕 명예의 전당
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={readLeaderboardSummary}
                title="리더보드 안내 듣기"
                className="h-10 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer border border-white/30"
              >
                <Volume2 className="w-4 h-4 text-amber-200" />
                <span className="hidden sm:inline">1위 듣기</span>
              </button>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Quick Sub-Banner: Google login or My Status */}
          <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-amber-100 font-bold">내 현재 성적:</span>
              <span className="bg-amber-700/60 text-amber-100 font-black px-2.5 py-1 rounded-lg border border-amber-300/30">
                💰 {currentCoins.toLocaleString()} 코인
              </span>
              <span className="bg-amber-700/60 text-amber-100 font-black px-2.5 py-1 rounded-lg border border-amber-300/30">
                ⭐ 도장 {currentStamps}/5개
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-xl">
                  <span className="font-bold text-white">
                    👤 {currentUser.displayName || currentUser.email}
                  </span>
                  <button
                    onClick={() => logOut()}
                    title="로그아웃"
                    className="text-amber-200 hover:text-white underline cursor-pointer ml-1"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  className="bg-white text-slate-800 hover:bg-amber-50 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-600" />
                  <span>구글 계정으로 로그인</span>
                </button>
              )}

              <button
                onClick={() => setShowRegisterForm(!showRegisterForm)}
                className="bg-white text-orange-600 hover:bg-amber-50 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{showRegisterForm ? '리더보드 목록 보기' : '내 기록 올리기 (+)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Register Form Panel (Toggleable) */}
          {showRegisterForm && (
            <div className="bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-black text-slate-900">
                    내 쇼핑 점수를 실시간 명예의 전당에 등록하기
                  </h3>
                </div>
                <button
                  onClick={() => setShowRegisterForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  접기
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-6 bg-emerald-100 border border-emerald-400 rounded-xl text-center space-y-2">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-black text-emerald-900 text-lg">
                    축하합니다! 명예의 전당에 성공적으로 등록되었습니다!
                  </p>
                  <p className="text-xs text-emerald-700">실시간 리더보드에 바로 반영됩니다.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitScore} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Class Preset */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        학급 선택
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {['1반', '2반', '3반', '새싹반', '도움반', '열매반'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setStudentClass(c)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 cursor-pointer transition-colors ${
                              studentClass === c
                                ? 'bg-amber-500 text-white border-amber-600'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Student Name */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        학생 이름 또는 닉네임
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="예: 김민준, 사랑이"
                        maxLength={20}
                        className="w-full h-11 px-3.5 rounded-xl border-2 border-slate-300 focus:border-amber-500 focus:outline-hidden text-sm font-bold bg-white"
                      />
                    </div>
                  </div>

                  {/* Level Selection & Comment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        클리어한 난이도
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedLevel('seed')}
                          className={`p-2 rounded-xl border-2 text-xs font-black text-center cursor-pointer ${
                            selectedLevel === 'seed'
                              ? 'bg-emerald-500 text-white border-emerald-600'
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          🌱 새싹 1단계
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedLevel('sprout')}
                          className={`p-2 rounded-xl border-2 text-xs font-black text-center cursor-pointer ${
                            selectedLevel === 'sprout'
                              ? 'bg-amber-500 text-white border-amber-600'
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          🌿 쑥쑥 2단계
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedLevel('fruit')}
                          className={`p-2 rounded-xl border-2 text-xs font-black text-center cursor-pointer ${
                            selectedLevel === 'fruit'
                              ? 'bg-orange-500 text-white border-orange-600'
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          🍎 열매 3단계
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        오늘의 소감 한마디
                      </label>
                      <select
                        value={studentComment}
                        onChange={(e) => setStudentComment(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border-2 border-slate-300 focus:border-amber-500 bg-white text-xs font-bold"
                      >
                        <option value="거스름돈을 스스로 잘 받았어요!">
                          거스름돈을 스스로 잘 받았어요!
                        </option>
                        <option value="바코드 삑 소리가 너무 신났어요!">
                          바코드 삑 소리가 너무 신났어요!
                        </option>
                        <option value="점원님께 안녕하세요 인사 잘했어요!">
                          점원님께 안녕하세요 인사 잘했어요!
                        </option>
                        <option value="가격표를 꼼꼼하게 읽었어요!">
                          가격표를 꼼꼼하게 읽었어요!
                        </option>
                        <option value="교통카드로 삑 찍고 결제했어요!">
                          교통카드로 삑 찍고 결제했어요!
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-12 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-black shadow-md flex items-center gap-2 cursor-pointer transition-colors border-2 border-orange-700 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? '등록 중...' : '명예의 전당 등록하기'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Level Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-200 pb-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setFilterLevel('all')}
                className={`h-10 px-3.5 rounded-xl text-xs font-black transition-colors cursor-pointer border-2 ${
                  filterLevel === 'all'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                🏆 전체 랭킹 ({entries.length})
              </button>
              <button
                onClick={() => setFilterLevel('seed')}
                className={`h-10 px-3.5 rounded-xl text-xs font-black transition-colors cursor-pointer border-2 ${
                  filterLevel === 'seed'
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                🌱 새싹 (1단계)
              </button>
              <button
                onClick={() => setFilterLevel('sprout')}
                className={`h-10 px-3.5 rounded-xl text-xs font-black transition-colors cursor-pointer border-2 ${
                  filterLevel === 'sprout'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                🌿 쑥쑥 (2단계)
              </button>
              <button
                onClick={() => setFilterLevel('fruit')}
                className={`h-10 px-3.5 rounded-xl text-xs font-black transition-colors cursor-pointer border-2 ${
                  filterLevel === 'fruit'
                    ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                🍎 열매 (3단계)
              </button>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1 font-bold">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-600' : ''}`} />
              <span>실시간 자동 갱신</span>
            </div>
          </div>

          {/* Top 3 Podium Highlights */}
          {filteredEntries.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 1st Place */}
              {top1 && (
                <div className="md:order-2 bg-linear-to-b from-amber-100 via-amber-50 to-white border-3 border-amber-400 rounded-2xl p-4 shadow-md text-center relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3 text-red-600" />
                    <span>현재 1위</span>
                  </div>
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-400 border-3 border-amber-500 flex items-center justify-center text-3xl shadow-sm mb-2">
                    🥇
                  </div>
                  <h4 className="text-lg font-black text-slate-900">{top1.playerName}</h4>
                  <p className="text-xs font-bold text-amber-800 mt-0.5">{top1.badgeTitle}</p>
                  <div className="mt-2 text-2xl font-black text-amber-600 tabular-nums">
                    {top1.score.toLocaleString()}원
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 italic">
                    "{top1.comment || '편의점 쇼핑 미션 완수!'}"
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => handleCheer(top1.id, e)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-colors cursor-pointer border ${
                        cheeredIds[top1.id]
                          ? 'bg-rose-100 text-rose-700 border-rose-300'
                          : 'bg-white hover:bg-rose-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          cheeredIds[top1.id] ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                        }`}
                      />
                      <span>응원 {top1.cheersCount || 0}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2nd Place */}
              {top2 && (
                <div className="md:order-1 bg-linear-to-b from-slate-100 via-slate-50 to-white border-2 border-slate-300 rounded-2xl p-4 shadow-sm text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-2xl shadow-xs mb-2">
                    🥈
                  </div>
                  <h4 className="text-base font-black text-slate-900">{top2.playerName}</h4>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">{top2.badgeTitle}</p>
                  <div className="mt-2 text-xl font-black text-slate-700 tabular-nums">
                    {top2.score.toLocaleString()}원
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 italic">
                    "{top2.comment || '멋지게 성공했어요!'}"
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => handleCheer(top2.id, e)}
                      className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 bg-white hover:bg-rose-50 text-slate-700 border border-slate-300 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-slate-400" />
                      <span>응원 {top2.cheersCount || 0}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {top3 && (
                <div className="md:order-3 bg-linear-to-b from-orange-100/60 via-orange-50 to-white border-2 border-orange-200 rounded-2xl p-4 shadow-sm text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-orange-200 border-2 border-orange-300 flex items-center justify-center text-2xl shadow-xs mb-2">
                    🥉
                  </div>
                  <h4 className="text-base font-black text-slate-900">{top3.playerName}</h4>
                  <p className="text-xs font-bold text-orange-800 mt-0.5">{top3.badgeTitle}</p>
                  <div className="mt-2 text-xl font-black text-orange-700 tabular-nums">
                    {top3.score.toLocaleString()}원
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 italic">
                    "{top3.comment || '차근차근 골랐어요!'}"
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => handleCheer(top3.id, e)}
                      className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 bg-white hover:bg-rose-50 text-slate-700 border border-slate-300 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-slate-400" />
                      <span>응원 {top3.cheersCount || 0}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Leaderboard Full Ranked List */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xs">
            <div className="p-3.5 bg-slate-100 border-b border-slate-200 font-black text-xs text-slate-700 flex items-center justify-between">
              <span className="w-16 text-center">순위</span>
              <span className="flex-1 px-2">쇼핑왕 친구</span>
              <span className="w-24 text-center hidden sm:inline">난이도</span>
              <span className="w-24 text-right pr-2">획득 금액</span>
              <span className="w-24 text-center">응원하기</span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500" />
                <p className="text-sm font-bold">실시간 명예의 전당을 불러오는 중...</p>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <p className="text-3xl">🏅</p>
                <p className="text-base font-bold text-slate-800">아직 등록된 기록이 없습니다.</p>
                <p className="text-xs">첫 번째 쇼핑왕으로 이름을 올려보세요!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredEntries.map((entry, index) => {
                  const rank = index + 1;
                  return (
                    <div
                      key={entry.id}
                      className="p-3 sm:p-4 flex items-center justify-between hover:bg-amber-50/50 transition-colors gap-2"
                    >
                      {/* Rank Medal */}
                      <div className="w-16 text-center shrink-0">
                        {rank === 1 ? (
                          <span className="inline-flex w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-black items-center justify-center text-sm shadow-xs">
                            1
                          </span>
                        ) : rank === 2 ? (
                          <span className="inline-flex w-8 h-8 rounded-full bg-slate-300 text-slate-800 font-black items-center justify-center text-sm shadow-xs">
                            2
                          </span>
                        ) : rank === 3 ? (
                          <span className="inline-flex w-8 h-8 rounded-full bg-orange-300 text-orange-950 font-black items-center justify-center text-sm shadow-xs">
                            3
                          </span>
                        ) : (
                          <span className="text-sm font-black text-slate-500">{rank}위</span>
                        )}
                      </div>

                      {/* Name & Badge */}
                      <div className="flex-1 px-2 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900 truncate">
                            {entry.playerName}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 shrink-0">
                            {entry.badgeTitle}
                          </span>
                        </div>
                        {entry.comment && (
                          <p className="text-xs text-slate-500 mt-0.5 truncate italic">
                            "{entry.comment}"
                          </p>
                        )}
                      </div>

                      {/* Level Badge */}
                      <div className="w-24 text-center shrink-0 hidden sm:block">
                        <span
                          className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                            entry.level === 'fruit'
                              ? 'bg-orange-50 text-orange-800 border-orange-300'
                              : entry.level === 'sprout'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          {entry.level === 'fruit'
                            ? '🍎 열매'
                            : entry.level === 'sprout'
                            ? '🌿 쑥쑥'
                            : '🌱 새싹'}
                        </span>
                      </div>

                      {/* Score */}
                      <div className="w-24 text-right pr-2 shrink-0">
                        <div className="font-black text-sm text-amber-700 tabular-nums">
                          {entry.score.toLocaleString()}원
                        </div>
                        <div className="text-[11px] text-slate-400">도장 {entry.stamps}개</div>
                      </div>

                      {/* Cheer Button */}
                      <div className="w-24 text-center shrink-0">
                        <button
                          onClick={(e) => handleCheer(entry.id, e)}
                          className={`h-9 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer border w-full ${
                            cheeredIds[entry.id]
                              ? 'bg-rose-50 text-rose-700 border-rose-300'
                              : 'bg-white hover:bg-rose-50 text-slate-700 border-slate-300'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              cheeredIds[entry.id]
                                ? 'fill-rose-500 text-rose-500'
                                : 'text-slate-400'
                            }`}
                          />
                          <span>{entry.cheersCount || 0}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <span>
              친구들의 멋진 도전을 응원해 주세요! 미션을 완료하면 누구나 명예의 전당에 등록할 수
              있습니다.
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs shadow-xs cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
