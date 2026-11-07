/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DifficultyLevel = 'level1' | 'level2' | 'level3';

export type ProductCategory = 'all' | 'drink' | 'fresh' | 'snack' | 'icecream';

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  promoTag?: '1+1' | '2+1' | '할인';
  imageEmoji: string;
  imageSrc?: string;
  description: string;
  color: string;
  barcode: string;
}

export interface ShoppingMission {
  id: string;
  level: DifficultyLevel;
  levelTitle: string;
  title: string;
  description: string;
  targetItems: {
    productId: string;
    quantity: number;
  }[];
  budget?: number;
  allowPlasticBag?: boolean;
  timeLimitSeconds: number; // typically 180 (3 min)
  rewardCoins: number;
  rewardBadgeId?: string;
  hint: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface CurrencyWallet {
  won10: number;
  won50: number;
  won100: number;
  won500: number;
  won1000: number;
  won5000: number;
  won10000: number;
}

export interface DialogueOption {
  text: string;
  isPolite: boolean;
  response: string;
  feedback: string;
}

export interface ClerkDialogueStep {
  clerkSpeech: string;
  clerkEmoji: string;
  speechAudioText?: string;
  options: DialogueOption[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}
