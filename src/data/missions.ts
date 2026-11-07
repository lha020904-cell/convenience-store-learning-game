/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingMission, AchievementBadge } from '../types';

export const SHOPPING_MISSIONS: ShoppingMission[] = [
  // Level 1: 새싹 (기초)
  {
    id: 'm1-banana-milk',
    level: 'level1',
    levelTitle: '새싹 1단계',
    title: '하교 후 시원한 바나나우유 사기',
    description: '음료수 진열대에서 노란 바나나우유 1개를 찾아 장바구니에 담고 계산해 보세요!',
    targetItems: [
      { productId: 'banana-milk', quantity: 1 },
    ],
    budget: 3000,
    timeLimitSeconds: 180,
    rewardCoins: 50,
    rewardBadgeId: 'badge-starter',
    hint: '음료 코너에서 뚱뚱이 바나나우유(1,500원)를 찾아보세요.',
  },
  {
    id: 'm2-gimbap-choco',
    level: 'level1',
    levelTitle: '새싹 1단계',
    title: '출출할 때 삼각김밥과 초코우유',
    description: '참치마요 삼각김밥 1개와 달콤 초코우유 1개를 골라 계산대로 가져가세요.',
    targetItems: [
      { productId: 'tuna-gimbap', quantity: 1 },
      { productId: 'choco-milk', quantity: 1 },
    ],
    budget: 5000,
    timeLimitSeconds: 180,
    rewardCoins: 60,
    rewardBadgeId: 'badge-price-detective',
    hint: '신선식품 코너에서 삼각김밥(1,200원), 음료 코너에서 초코우유(1,200원)를 담으세요.',
  },

  // Level 2: 쑥쑥 (중급)
  {
    id: 'm3-ramen-water-chips',
    level: 'level2',
    levelTitle: '쑥쑥 2단계',
    title: '친구와 함께 먹는 맛있는 간식 3가지',
    description: '컵라면 1개, 생수 1병, 포테이토칩 1개를 장바구니에 넣고 100원·500원 동전을 섞어 계산해 보세요.',
    targetItems: [
      { productId: 'cup-ramen', quantity: 1 },
      { productId: 'mineral-water', quantity: 1 },
      { productId: 'potato-chips', quantity: 1 },
    ],
    budget: 5000,
    timeLimitSeconds: 180,
    rewardCoins: 80,
    rewardBadgeId: 'badge-counting-king',
    hint: '총 3,800원입니다. 1,000원 지폐 3장과 500원 1개, 100원 3개로 딱 맞춰 낼 수 있어요!',
  },
  {
    id: 'm4-sandwich-eco',
    level: 'level2',
    levelTitle: '쑥쑥 2단계',
    title: '장바구니 챙기고 친절하게 인사하기',
    description: '햄에그 샌드위치 1개와 복숭아 아이스티 1개를 사고, 점원에게 "봉투는 필요 없어요"라고 멋지게 말해 보세요.',
    targetItems: [
      { productId: 'ham-egg-sandwich', quantity: 1 },
      { productId: 'iced-tea', quantity: 1 },
    ],
    budget: 6000,
    allowPlasticBag: false,
    timeLimitSeconds: 180,
    rewardCoins: 90,
    rewardBadgeId: 'badge-polite-customer',
    hint: '계산대에서 점원님이 "봉투 필요하세요?"라고 물어보면 예의 바르게 답변해 보세요.',
  },

  // Level 3: 열매 (실전/마스터)
  {
    id: 'm5-budget-master',
    level: 'level3',
    levelTitle: '열매 3단계',
    title: '5,000원 예산 안에서 간식 세트 완성하기',
    description: '소불고기 삼각김밥 1개, 오렌지주스 1개, 단팥빵 1개를 사고 거스름돈까지 꼼꼼히 확인해 보세요.',
    targetItems: [
      { productId: 'beef-gimbap', quantity: 1 },
      { productId: 'orange-juice', quantity: 1 },
      { productId: 'red-bean-bread', quantity: 1 },
    ],
    budget: 5000,
    timeLimitSeconds: 180,
    rewardCoins: 120,
    rewardBadgeId: 'badge-master',
    hint: '삼각김밥(1,300원) + 오렌지주스(1,600원) + 단팥빵(1,400원) = 총 4,300원! 5,000원을 내면 거스름돈은 700원이에요.',
  },
  {
    id: 'm6-promo-smart',
    level: 'level3',
    levelTitle: '열매 3단계',
    title: '1+1 행사 혜택 챙기고 영수증 받기',
    description: '오렌지주스(1+1)와 치즈 핫바, 초코파이를 골라 바코드를 직접 찍어보고 결제 영수증을 챙겨보세요.',
    targetItems: [
      { productId: 'orange-juice', quantity: 1 },
      { productId: 'hotbar', quantity: 1 },
      { productId: 'choco-pie', quantity: 1 },
    ],
    budget: 7000,
    timeLimitSeconds: 180,
    rewardCoins: 150,
    rewardBadgeId: 'badge-receipt-checker',
    hint: '행사 상품 안내를 읽고, 결제 후 점원에게 영수증을 달라고 이야기해 보세요.',
  },
];

export const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: 'badge-starter',
    title: '첫 쇼핑 성공!',
    description: '편의점에서 원하는 물건을 혼자서 처음 사보았어요.',
    icon: '🌱',
    unlocked: true,
    unlockedDate: '2026-11-06',
  },
  {
    id: 'badge-price-detective',
    title: '가격표 탐정',
    description: '진열대의 가격표를 보고 물건 금액을 정확히 확인했어요.',
    icon: '🏷️',
    unlocked: false,
  },
  {
    id: 'badge-counting-king',
    title: '화폐 계산왕',
    description: '지폐와 동전을 바르게 세어서 물건값을 지불했어요.',
    icon: '💰',
    unlocked: false,
  },
  {
    id: 'badge-polite-customer',
    title: '예절 바른 손님',
    description: '점원님께 반갑게 인사하고 봉투와 영수증 의사를 표현했어요.',
    icon: '😊',
    unlocked: false,
  },
  {
    id: 'badge-receipt-checker',
    title: '영수증 꼼꼼이',
    description: '물건값과 거스름돈을 영수증으로 다시 한번 확인했어요.',
    icon: '🧾',
    unlocked: false,
  },
  {
    id: 'badge-master',
    title: '편의점 쇼핑 달인',
    description: '예산 안에서 필요한 물건을 똑똑하게 모두 구매했어요!',
    icon: '🏆',
    unlocked: false,
  },
];
