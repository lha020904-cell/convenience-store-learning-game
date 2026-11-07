/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Clock,
  ShoppingBag,
  CheckCircle,
  Volume2,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  Trophy,
  Sparkles,
} from 'lucide-react';
import {
  ProductItem,
  ShoppingMission,
  CartItem,
  ProductCategory,
  DifficultyLevel,
} from '../types';
import { CONVENIENCE_PRODUCTS } from '../data/products';
import { SHOPPING_MISSIONS } from '../data/missions';
import { playDoorChime, playCoinSound, speakKorean } from '../utils/audio';
import { BarcodeScanner } from './BarcodeScanner';
import { ClerkDialogue } from './ClerkDialogue';
import { PaymentPad } from './PaymentPad';
import { ReceiptCelebration } from './ReceiptCelebration';

interface ShoppingGameProps {
  onEarnCoins: (amount: number) => void;
  onEarnStamp: () => void;
  onUnlockBadge: (badgeId: string) => void;
  onOpenLeaderboard?: () => void;
  currentCoins?: number;
  currentStamps?: number;
}

type GameStep = 'mission_select' | 'shopping' | 'scanning' | 'dialogue' | 'payment' | 'completed';

export const ShoppingGame: React.FC<ShoppingGameProps> = ({
  onEarnCoins,
  onEarnStamp,
  onUnlockBadge,
  onOpenLeaderboard,
  currentCoins,
  currentStamps,
}) => {
  // State
  const [selectedLevel, setSelectedLevel] = React.useState<DifficultyLevel>('level1');
  const [activeMission, setActiveMission] = React.useState<ShoppingMission>(SHOPPING_MISSIONS[0]);
  const [gameStep, setGameStep] = React.useState<GameStep>('mission_select');

  // Shelves filter
  const [categoryFilter, setCategoryFilter] = React.useState<ProductCategory>('all');
  const [cart, setCart] = React.useState<CartItem[]>([]);

  // Timer (3 minutes = 180s)
  const [timeLeft, setTimeLeft] = React.useState(180);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [isRelaxMode, setIsRelaxMode] = React.useState(false); // No rush mode for special education

  // Checkout states
  const [bagAdded, setBagAdded] = React.useState(false);
  const [receiptRequested, setReceiptRequested] = React.useState(false);
  const [paidAmount, setPaidAmount] = React.useState(0);
  const [paymentMethod, setPaymentMethod] = React.useState<'cash' | 'card'>('cash');

  // Filtered missions by level
  const missionsForLevel = SHOPPING_MISSIONS.filter((m) => m.level === selectedLevel);

  // Filtered products
  const filteredProducts = CONVENIENCE_PRODUCTS.filter(
    (p) => categoryFilter === 'all' || p.category === categoryFilter
  );

  // Cart total calculations
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const cartTotal = cartSubtotal + (bagAdded ? 100 : 0);

  // Timer effect without frantic animation
  React.useEffect(() => {
    let interval: number | null = null;
    if (timerRunning && !isRelaxMode && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            speakKorean('3분이 지났습니다! 시간 여유 모드로 계속 쇼핑할 수 있어요.');
            return 0;
          }
          if (prev === 60) {
            speakKorean('1분 남았습니다. 서두르지 말고 침착하게 골라보세요!');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [timerRunning, isRelaxMode, timeLeft]);

  // Check mission target requirements
  const isMissionSatisfied = activeMission.targetItems.every((target) => {
    const itemInCart = cart.find((c) => c.product.id === target.productId);
    return itemInCart && itemInCart.quantity >= target.quantity;
  });

  // Start mission
  const handleStartMission = (mission: ShoppingMission) => {
    setActiveMission(mission);
    setCart([]);
    setTimeLeft(mission.timeLimitSeconds);
    setTimerRunning(true);
    setGameStep('shopping');
    playDoorChime();
    speakKorean(
      `어서오세요! 행복 편의점입니다. ${mission.title} 미션을 시작합니다. ${mission.description}`
    );
  };

  // Add to cart
  const handleAddToCart = (product: ProductItem) => {
    playCoinSound();
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
    speakKorean(`${product.name}을 장바구니에 담았습니다. 가격은 ${product.price.toLocaleString()}원입니다.`);
  };

  // Remove from cart
  const handleRemoveFromCart = (productId: string) => {
    playCoinSound();
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
    speakKorean('장바구니를 모두 비웠습니다.');
  };

  // Go to counter
  const handleProceedToCounter = () => {
    if (cart.length === 0) {
      speakKorean('장바구니에 물건을 먼저 담아주세요!');
      return;
    }
    setGameStep('scanning');
    speakKorean('계산대로 왔습니다. 물건의 바코드를 찍어주세요.');
  };

  // Complete scanning
  const handleScanningComplete = () => {
    setGameStep('dialogue');
  };

  // Complete dialogue
  const handleDialogueComplete = (bag: boolean, receipt: boolean) => {
    setBagAdded(bag);
    setReceiptRequested(receipt);
    setGameStep('payment');
  };

  // Complete payment
  const handlePaymentComplete = (paid: number, method: 'cash' | 'card') => {
    setPaidAmount(paid);
    setPaymentMethod(method);
    setTimerRunning(false);
    setGameStep('completed');

    // Reward points and stamps
    onEarnCoins(activeMission.rewardCoins);
    onEarnStamp();
    if (activeMission.rewardBadgeId) {
      onUnlockBadge(activeMission.rewardBadgeId);
    }
  };

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Mission Selection Screen */}
      {gameStep === 'mission_select' && (
        <div className="space-y-6">
          {/* Storefront Visual Banner */}
          <div className="relative rounded-3xl overflow-hidden shadow-md border-2 border-amber-300 bg-amber-900/10">
            <img
              src="/src/assets/images/convenience_store_exterior_1794016354378.jpg"
              alt="우리동네 편의점 외관"
              referrerPolicy="no-referrer"
              className="w-full h-44 sm:h-56 object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-sm font-black text-amber-300">
                특수학급 중학생 자립 생활 교육 시뮬레이션
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                우리동네 편의점 물건 구매하기
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
                사진으로 상품을 확인하고, 큰 버튼으로 편안하게 쇼핑 미션을 연습해 보세요.
              </p>
            </div>
          </div>

          {/* Real-time Leaderboard Link on First Screen */}
          <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg border-3 border-amber-400 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl shadow-sm shrink-0">
                🏆
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="bg-white/25 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    실시간 연동 중 (Firebase)
                  </span>
                  <span className="text-xs text-amber-100 font-bold hidden sm:inline">
                    우리 학교 명예의 전당
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black mt-1">
                  실시간 편의점 쇼핑왕 리더보드 확인하기
                </h3>
                <p className="text-xs sm:text-sm text-amber-100 mt-0.5">
                  친구들의 쇼핑 점수와 응원 메시지를 확인하고, 나도 명예의 전당에 도전해 보세요!
                </p>
              </div>
            </div>

            <button
              onClick={onOpenLeaderboard}
              className="w-full md:w-auto h-14 px-7 rounded-2xl bg-white hover:bg-amber-50 text-orange-600 font-black text-base shadow-md flex items-center justify-center gap-2.5 transition-transform active:scale-95 cursor-pointer shrink-0 border-2 border-amber-200"
            >
              <Trophy className="w-5 h-5 text-amber-600" />
              <span>명예의 전당 (리더보드) 열기</span>
            </button>
          </div>

          {/* Level Switcher (Large, simple buttons) */}
          <div className="bg-white rounded-3xl border-3 border-amber-300 p-6 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-1">
              학습 단계 선택하기
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              아래 버튼 중 원하는 단계를 눌러주세요:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Level 1 Button */}
              <button
                onClick={() => {
                  setSelectedLevel('level1');
                  speakKorean('새싹 1단계 기초입니다.');
                }}
                className={`p-5 rounded-2xl border-3 text-left transition-colors cursor-pointer ${
                  selectedLevel === 'level1'
                    ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-300'
                    : 'bg-white border-slate-300 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🌱</span>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-200 px-2.5 py-1 rounded-lg">
                    기초 1단계
                  </span>
                </div>
                <h4 className="font-black text-lg text-slate-900 mt-2">
                  새싹 1단계
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  • 물건 1~2개 고르기<br />
                  • 1,000원 지폐 또는 교통카드
                </p>
              </button>

              {/* Level 2 Button */}
              <button
                onClick={() => {
                  setSelectedLevel('level2');
                  speakKorean('쑥쑥 2단계 중급입니다.');
                }}
                className={`p-5 rounded-2xl border-3 text-left transition-colors cursor-pointer ${
                  selectedLevel === 'level2'
                    ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-300'
                    : 'bg-white border-slate-300 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🌿</span>
                  <span className="text-xs font-black text-amber-900 bg-amber-200 px-2.5 py-1 rounded-lg">
                    중급 2단계
                  </span>
                </div>
                <h4 className="font-black text-lg text-slate-900 mt-2">
                  쑥쑥 2단계
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  • 물건 2~3개 고르기<br />
                  • 500원·100원 동전 세기 & 봉투 대화
                </p>
              </button>

              {/* Level 3 Button */}
              <button
                onClick={() => {
                  setSelectedLevel('level3');
                  speakKorean('열매 3단계 실전입니다.');
                }}
                className={`p-5 rounded-2xl border-3 text-left transition-colors cursor-pointer ${
                  selectedLevel === 'level3'
                    ? 'bg-orange-50 border-orange-500 shadow-md ring-2 ring-orange-300'
                    : 'bg-white border-slate-300 hover:border-orange-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🍎</span>
                  <span className="text-xs font-black text-orange-950 bg-orange-200 px-2.5 py-1 rounded-lg">
                    실전 3단계
                  </span>
                </div>
                <h4 className="font-black text-lg text-slate-900 mt-2">
                  열매 3단계
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  • 5,000원 예산 내 쇼핑<br />
                  • 1+1 행사 상품 & 거스름돈 확인
                </p>
              </button>
            </div>
          </div>

          {/* Missions List with Product Photos */}
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-3">
              🎯 쇼핑 미션 선택
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {missionsForLevel.map((mission) => (
                <div
                  key={mission.id}
                  className="bg-white rounded-3xl border-3 border-amber-300 p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-lg">
                        {mission.levelTitle}
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        ⏱️ 3분 이내 권장
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-slate-900">
                      {mission.title}
                    </h4>
                    <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                      {mission.description}
                    </p>

                    {/* Mission Target Items with REAL PHOTOS */}
                    <div className="mt-4 p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
                      <span className="text-xs font-black text-amber-950 block mb-2">
                        🛒 꼭 사야 할 목표 물건 사진:
                      </span>
                      <div className="space-y-2">
                        {mission.targetItems.map((target) => {
                          const product = CONVENIENCE_PRODUCTS.find(
                            (p) => p.id === target.productId
                          );
                          if (!product) return null;
                          return (
                            <div
                              key={target.productId}
                              className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-300"
                            >
                              <div className="flex items-center gap-2.5">
                                {product.imageSrc ? (
                                  <img
                                    src={product.imageSrc}
                                    alt={product.name}
                                    referrerPolicy="no-referrer"
                                    className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                                  />
                                ) : (
                                  <span className="text-2xl p-1 bg-amber-100 rounded-lg">
                                    {product.imageEmoji}
                                  </span>
                                )}
                                <span className="font-black text-sm text-slate-900">
                                  {product.name}
                                </span>
                              </div>
                              <span className="font-mono font-black text-sm text-amber-800">
                                {target.quantity}개 ({product.price.toLocaleString()}원)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Large Simple Action Buttons */}
                  <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                    <button
                      onClick={() => speakKorean(mission.description)}
                      title="미션 설명 듣기"
                      className="h-14 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center gap-2 cursor-pointer border border-slate-300"
                    >
                      <Volume2 className="w-5 h-5 text-amber-600" />
                      <span>설명 듣기</span>
                    </button>

                    <button
                      onClick={() => handleStartMission(mission)}
                      className="h-14 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-base shadow-md flex items-center gap-2 cursor-pointer border-2 border-amber-600 transition-colors"
                    >
                      <span>쇼핑 시작하기</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: In-Store Shopping View with Product Photos & Large Simple Buttons */}
      {gameStep === 'shopping' && (
        <div className="space-y-6">
          {/* Mission Top Header */}
          <div className="bg-white rounded-3xl border-3 border-amber-300 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-sm">
                🛒
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-lg">
                    {activeMission.levelTitle}
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {activeMission.title}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  💡 {activeMission.hint}
                </p>
              </div>
            </div>

            {/* Timer and Mode Controls (Simple, clear buttons) */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              {!isRelaxMode ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border-2 border-amber-400 font-mono font-black text-base text-amber-900">
                  <Clock className="w-5 h-5" />
                  <span>남은 시간: {formatTime(timeLeft)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 font-black text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>시간 여유 모드</span>
                </div>
              )}

              <button
                onClick={() => {
                  setIsRelaxMode(!isRelaxMode);
                  speakKorean(
                    !isRelaxMode
                      ? '시간 여유 모드로 바꿨습니다. 천천히 편안하게 골라보세요.'
                      : '3분 타이머 모드로 바꿨습니다.'
                  );
                }}
                className="h-11 px-3 rounded-xl border-2 border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {isRelaxMode ? '3분 타이머로' : '여유 모드로'}
              </button>

              <button
                onClick={() => setGameStep('mission_select')}
                className="h-11 px-3 rounded-xl border-2 border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                미션 목록
              </button>
            </div>
          </div>

          {/* Shelves Layout: Left Products (65%), Right Shopping Basket (35%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Products Shelf (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Category Filter Tabs (Large simple touch tabs) */}
              <div className="bg-white rounded-2xl border-2 border-amber-300 p-2 shadow-xs flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`h-11 px-4 rounded-xl text-sm font-black transition-colors cursor-pointer ${
                    categoryFilter === 'all'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-amber-100/60'
                  }`}
                >
                  전체 상품
                </button>
                <button
                  onClick={() => setCategoryFilter('drink')}
                  className={`h-11 px-4 rounded-xl text-sm font-black transition-colors cursor-pointer ${
                    categoryFilter === 'drink'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-amber-100/60'
                  }`}
                >
                  🥤 음료 / 유제품
                </button>
                <button
                  onClick={() => setCategoryFilter('fresh')}
                  className={`h-11 px-4 rounded-xl text-sm font-black transition-colors cursor-pointer ${
                    categoryFilter === 'fresh'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-amber-100/60'
                  }`}
                >
                  🍙 삼각김밥 / 샌드위치
                </button>
                <button
                  onClick={() => setCategoryFilter('snack')}
                  className={`h-11 px-4 rounded-xl text-sm font-black transition-colors cursor-pointer ${
                    categoryFilter === 'snack'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-amber-100/60'
                  }`}
                >
                  🍜 라면 / 과자
                </button>
                <button
                  onClick={() => setCategoryFilter('icecream')}
                  className={`h-11 px-4 rounded-xl text-sm font-black transition-colors cursor-pointer ${
                    categoryFilter === 'icecream'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-amber-100/60'
                  }`}
                >
                  🍦 아이스크림 / 빵
                </button>
              </div>

              {/* Product Cards Grid with ACTUAL PRODUCT PHOTOS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const inCartItem = cart.find((c) => c.product.id === product.id);
                  const isTarget = activeMission.targetItems.some(
                    (t) => t.productId === product.id
                  );

                  return (
                    <div
                      key={product.id}
                      className={`bg-white rounded-3xl border-3 p-4 shadow-sm flex flex-col justify-between transition-colors ${
                        isTarget
                          ? 'border-amber-400 bg-amber-50/20'
                          : 'border-slate-300 hover:border-amber-400'
                      }`}
                    >
                      <div>
                        {/* Top Badge: Target or Promo */}
                        <div className="flex items-center justify-between mb-2">
                          {isTarget ? (
                            <span className="text-xs font-black bg-amber-500 text-white px-2.5 py-1 rounded-lg">
                              ★ 사야 할 물건
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 font-bold">
                              편의점 상품
                            </span>
                          )}

                          {product.promoTag && (
                            <span className="text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded-lg">
                              {product.promoTag}
                            </span>
                          )}
                        </div>

                        {/* PRODUCT PHOTO (Clear, authentic visual) */}
                        <div className="w-full h-40 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 flex items-center justify-center relative mb-3">
                          {product.imageSrc ? (
                            <img
                              src={product.imageSrc}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-3">
                              <span className="text-6xl block select-none">
                                {product.imageEmoji}
                              </span>
                              <span className="text-xs text-slate-500 font-bold mt-1 block">
                                {product.category === 'drink' ? '음료 코너' : '스낵 코너'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h4 className="font-black text-base text-slate-900 truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                          {product.description}
                        </p>

                        {/* Big Clear Price Tag with Audio Readout */}
                        <div className="mt-3 p-2.5 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 block">가격표</span>
                            <span className="text-lg font-black text-amber-700 tabular-nums">
                              {product.price.toLocaleString()} 원
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              speakKorean(`${product.name}, 가격은 ${product.price.toLocaleString()}원입니다.`)
                            }
                            title="가격 읽어주기"
                            className="h-9 px-2.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-amber-100"
                          >
                            <Volume2 className="w-4 h-4 text-amber-600" />
                            <span>듣기</span>
                          </button>
                        </div>
                      </div>

                      {/* Large Simple Quantity / Add-to-Cart Buttons */}
                      <div className="mt-4">
                        {inCartItem ? (
                          <div className="grid grid-cols-3 gap-2 bg-amber-100/70 p-1.5 rounded-2xl border-2 border-amber-300">
                            {/* Minus Button */}
                            <button
                              onClick={() => handleRemoveFromCart(product.id)}
                              className="h-12 bg-white text-slate-800 font-black text-lg rounded-xl border border-slate-300 flex items-center justify-center hover:bg-red-50 hover:text-red-600 cursor-pointer"
                              title="1개 빼기"
                            >
                              <Minus className="w-5 h-5" />
                            </button>

                            {/* Quantity Display */}
                            <div className="flex items-center justify-center font-black text-base text-amber-950 tabular-nums">
                              {inCartItem.quantity}개
                            </div>

                            {/* Plus Button */}
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="h-12 bg-amber-500 text-white font-black text-lg rounded-xl border border-amber-600 flex items-center justify-center hover:bg-amber-600 cursor-pointer"
                              title="1개 더 담기"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full h-13 bg-amber-500 hover:bg-amber-600 text-white font-black text-base rounded-2xl border-2 border-amber-600 shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Plus className="w-5 h-5" />
                            <span>장바구니 담기</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shopping Basket Sidebar (4 cols) with Large Simple Controls */}
            <div className="lg:col-span-4 bg-white rounded-3xl border-3 border-amber-300 p-5 shadow-md sticky top-20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-amber-600" />
                  <h3 className="font-black text-lg text-slate-900">
                    나의 장바구니
                  </h3>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    비우기
                  </button>
                )}
              </div>

              {/* Mission Target Checklist with Photos */}
              <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200">
                <span className="text-xs font-black text-amber-950 block mb-2">
                  🎯 사야 할 물건 체크리스트:
                </span>
                <div className="space-y-2">
                  {activeMission.targetItems.map((target) => {
                    const product = CONVENIENCE_PRODUCTS.find(
                      (p) => p.id === target.productId
                    );
                    const inCart = cart.find((c) => c.product.id === target.productId);
                    const isDone = inCart && inCart.quantity >= target.quantity;

                    return (
                      <div
                        key={target.productId}
                        className={`p-2.5 rounded-xl text-xs flex items-center justify-between font-bold border-2 ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isDone ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                          ) : (
                            <span className="w-5 h-5 rounded-full border-2 border-slate-400 shrink-0 inline-block" />
                          )}
                          <span className="truncate max-w-[130px] font-black text-sm">
                            {product?.name}
                          </span>
                        </div>
                        <span className="tabular-nums font-mono font-black text-sm">
                          {inCart ? inCart.quantity : 0} / {target.quantity}개
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cart Items List */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {cart.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    장바구니가 비어 있습니다.<br />
                    진열대에서 물건을 골라 큰 '담기' 버튼을 눌러보세요!
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 truncate max-w-[150px]">
                        {item.product.imageSrc ? (
                          <img
                            src={item.product.imageSrc}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg border border-slate-300 shrink-0"
                          />
                        ) : (
                          <span className="text-xl p-1 bg-white rounded-lg border border-slate-200">
                            {item.product.imageEmoji}
                          </span>
                        )}
                        <div>
                          <span className="font-black text-sm text-slate-900 block truncate">
                            {item.product.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {item.product.price.toLocaleString()}원 × {item.quantity}개
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-amber-800 tabular-nums">
                          {(item.product.price * item.quantity).toLocaleString()}원
                        </span>
                        <button
                          onClick={() => handleRemoveFromCart(item.product.id)}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-red-50 hover:text-red-600 font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total Calculation */}
              <div className="pt-3 border-t-2 border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>담은 물건 수량</span>
                  <span className="text-sm font-black">{cart.reduce((s, i) => s + i.quantity, 0)} 개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-base text-slate-900">합계 금액</span>
                  <span className="text-2xl font-black text-amber-700 tabular-nums">
                    {cartSubtotal.toLocaleString()} 원
                  </span>
                </div>
              </div>

              {/* Large Simple Go-to-Counter Button */}
              <button
                onClick={handleProceedToCounter}
                disabled={cart.length === 0}
                className={`w-full h-16 rounded-2xl font-black text-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer border-3 ${
                  cart.length > 0
                    ? isMissionSatisfied
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 ring-2 ring-emerald-300'
                      : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                }`}
              >
                <span>계산대로 가기 ➔</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Barcode Scanning Stage */}
      {gameStep === 'scanning' && (
        <BarcodeScanner cart={cart} onAllScanned={handleScanningComplete} />
      )}

      {/* Step 4: Clerk Dialogue Stage */}
      {gameStep === 'dialogue' && (
        <ClerkDialogue
          onDialogueComplete={handleDialogueComplete}
          onSkip={() => handleDialogueComplete(false, false)}
        />
      )}

      {/* Step 5: Payment Pad Stage */}
      {gameStep === 'payment' && (
        <PaymentPad
          totalAmount={cartTotal}
          onPaymentComplete={handlePaymentComplete}
          onCancel={() => setGameStep('shopping')}
          level={activeMission.level}
        />
      )}

      {/* Step 6: Receipt & Celebration Reward Stage */}
      {gameStep === 'completed' && (
        <ReceiptCelebration
          mission={activeMission}
          cart={cart}
          totalAmount={cartTotal}
          paidAmount={paidAmount}
          paymentMethod={paymentMethod}
          bagAdded={bagAdded}
          onNextMission={() => {
            const currentIndex = SHOPPING_MISSIONS.findIndex(
              (m) => m.id === activeMission.id
            );
            const nextMission =
              SHOPPING_MISSIONS[(currentIndex + 1) % SHOPPING_MISSIONS.length];
            handleStartMission(nextMission);
          }}
          onRestartMission={() => handleStartMission(activeMission)}
          onOpenLeaderboard={onOpenLeaderboard}
        />
      )}
    </div>
  );
};
