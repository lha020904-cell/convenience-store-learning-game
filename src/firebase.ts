/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// CRITICAL: The app requires passing the firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard Error Handling conforming to FirestoreErrorInfo
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Startup connection verification
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Types for Leaderboard Entry
export interface LeaderboardEntryData {
  id: string;
  playerName: string;
  score: number;
  stamps: number;
  level: 'seed' | 'sprout' | 'fruit';
  badgeTitle?: string;
  cheersCount?: number;
  comment?: string;
  createdAt: Timestamp | Date | any;
  userId?: string;
}

// Google Auth helper
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Sign in error:', error);
    return null;
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

// Real-time Leaderboard Listener
export function subscribeToLeaderboard(
  callback: (entries: LeaderboardEntryData[]) => void,
  maxEntries = 50
) {
  const collectionPath = 'leaderboard';
  const q = query(
    collection(db, collectionPath),
    orderBy('score', 'desc'),
    limit(maxEntries)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const entries: LeaderboardEntryData[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        entries.push({
          id: d.id,
          playerName: data.playerName || '익명 쇼핑왕',
          score: data.score || 0,
          stamps: data.stamps || 0,
          level: data.level || 'seed',
          badgeTitle: data.badgeTitle || '편의점 쇼핑왕',
          cheersCount: data.cheersCount || 0,
          comment: data.comment || '',
          createdAt: data.createdAt,
          userId: data.userId,
        });
      });
      callback(entries);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
  );
}

// Submit score to Leaderboard
export async function addLeaderboardEntry(entry: {
  playerName: string;
  score: number;
  stamps: number;
  level: 'seed' | 'sprout' | 'fruit';
  badgeTitle?: string;
  comment?: string;
}): Promise<string> {
  const docId = `entry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docPath = `leaderboard/${docId}`;

  const payload: Record<string, any> = {
    playerName: entry.playerName.trim().slice(0, 30),
    score: Math.min(1000000, Math.max(0, entry.score)),
    stamps: Math.min(100, Math.max(0, entry.stamps)),
    level: entry.level,
    badgeTitle: (entry.badgeTitle || '편의점 쇼핑왕').slice(0, 50),
    cheersCount: 0,
    comment: (entry.comment || '').slice(0, 100),
    createdAt: serverTimestamp(),
  };

  if (auth.currentUser?.uid) {
    payload.userId = auth.currentUser.uid;
  }

  try {
    await setDoc(doc(db, 'leaderboard', docId), payload);
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

// Peer cheering increment (+1 cheer)
export async function cheerLeaderboardEntry(entryId: string): Promise<void> {
  const docPath = `leaderboard/${entryId}`;
  try {
    const entryRef = doc(db, 'leaderboard', entryId);
    await updateDoc(entryRef, {
      cheersCount: increment(1),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

// Seed initial encouraging entries if the collection is empty
export async function seedInitialLeaderboardIfEmpty() {
  const collectionPath = 'leaderboard';
  try {
    const snapshot = await getDocs(query(collection(db, collectionPath), limit(1)));
    if (snapshot.empty) {
      const sampleEntries = [
        {
          playerName: '새싹반 하은',
          score: 2800,
          stamps: 5,
          level: 'sprout' as const,
          badgeTitle: '바코드 계산 마스터',
          comment: '스스로 바나나우유랑 삼각김밥 사고 거스름돈 잘 받았어요!',
        },
        {
          playerName: '1반 민우',
          score: 3500,
          stamps: 5,
          level: 'fruit' as const,
          badgeTitle: '친절한 소통왕',
          comment: '점원님께 안녕하세요 인사하고 비닐봉투 100원 계산했어요.',
        },
        {
          playerName: '열매반 서준',
          score: 1900,
          stamps: 3,
          level: 'seed' as const,
          badgeTitle: '가격표 탐험가',
          comment: '가격표 보고 1000원짜리 생수를 골랐어요.',
        },
      ];

      for (let i = 0; i < sampleEntries.length; i++) {
        const item = sampleEntries[i];
        const docId = `sample_${Date.now()}_${i}`;
        await setDoc(doc(db, 'leaderboard', docId), {
          ...item,
          cheersCount: (3 - i) * 2,
          createdAt: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    console.warn('Initial leaderboard seed skipped or prevented:', error);
  }
}
