import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type ChatSender = 'customer' | 'vendor';
export interface ChatMessage { id: string; sender: ChatSender; body: string; createdAt: string; }
export interface ChatThread { id: string; productId: string; productTitle: string; vendorName: string; messages: ChatMessage[]; }
export interface AssistantMessage { id: string; role: 'user' | 'assistant'; text: string; createdAt: string; }

interface EngagementContextType {
  isDemoMode: true;
  points: number;
  walletCash: number;
  referralCode: string;
  referralCount: number;
  dailyBonusClaimed: boolean;
  scratchAvailable: boolean;
  scratchPrize: string | null;
  assistantMessages: AssistantMessage[];
  chatThreads: ChatThread[];
  claimDailyBonus: () => void;
  claimScratchCard: () => string;
  awardPurchasePoints: (amount: number) => void;
  completeDemoReferral: () => void;
  addAssistantMessage: (message: AssistantMessage) => void;
  addAssistantMessages: (messages: AssistantMessage[]) => void;
  upsertChatThread: (thread: ChatThread) => void;
}

const EngagementContext = createContext<EngagementContextType | undefined>(undefined);
const KEY = 'nexmart.phase1.engagement.v1';

function readState() {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(window.localStorage.getItem(KEY) || '{}') as Partial<EngagementContextType>; } catch { return {}; }
}
function persist(value: Record<string, unknown>) {
  try { window.localStorage.setItem(KEY, JSON.stringify(value)); } catch { /* demo state remains in memory */ }
}
function todayKey() { return new Date().toISOString().slice(0, 10); }

export const EngagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const saved = readState();
  const [points, setPoints] = useState(saved.points ?? 240);
  const [walletCash, setWalletCash] = useState(saved.walletCash ?? 0);
  const [referralCount, setReferralCount] = useState(saved.referralCount ?? 2);
  const savedDates = saved as Partial<EngagementContextType> & { dailyBonusDate?: string; scratchCardDate?: string };
  const [lastBonusDate, setLastBonusDate] = useState(savedDates.dailyBonusDate || '');
  const [scratchCardDate, setScratchCardDate] = useState(savedDates.scratchCardDate || '');
  const [scratchPrize, setScratchPrize] = useState<string | null>(saved.scratchPrize ?? null);
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>(saved.assistantMessages ?? []);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(saved.chatThreads ?? []);
  const referralCode = 'NEX-' + 'JULIAN24';
  const dailyBonusClaimed = lastBonusDate === todayKey();
  const scratchAvailable = scratchCardDate !== todayKey();

  const save = (extra: Record<string, unknown> = {}) => persist({ points, walletCash, referralCount, dailyBonusDate: lastBonusDate, scratchCardDate, scratchPrize, assistantMessages, chatThreads, ...extra });
  const claimDailyBonus = () => {
    if (dailyBonusClaimed) return;
    const next = points + 25;
    const date = todayKey(); setPoints(next); setLastBonusDate(date); save({ points: next, dailyBonusDate: date });
  };
  const claimScratchCard = () => {
    if (!scratchAvailable) return scratchPrize || 'Already claimed';
    const prizes = ['10% off demo voucher', '50 bonus points', 'PKR 150 demo wallet cash'];
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    const date = todayKey(); setScratchCardDate(date); setScratchPrize(prize);
    const nextCash = prize.includes('wallet') ? walletCash + 150 : walletCash;
    const nextPoints = prize.includes('points') ? points + 50 : points;
    setWalletCash(nextCash); setPoints(nextPoints); save({ scratchCardDate: date, scratchPrize: prize, walletCash: nextCash, points: nextPoints });
    return prize;
  };
  const awardPurchasePoints = (amount: number) => {
    const earned = Math.max(1, Math.floor(amount / 10));
    const next = points + earned;
    setPoints(next); save({ points: next });
  };
  const completeDemoReferral = () => {
    const nextCount = referralCount + 1; const nextCash = walletCash + 250;
    setReferralCount(nextCount); setWalletCash(nextCash); save({ referralCount: nextCount, walletCash: nextCash });
  };
  const addAssistantMessage = (message: AssistantMessage) => {
    const next = [...assistantMessages.slice(-11), message]; setAssistantMessages(next); save({ assistantMessages: next });
  };
  const addAssistantMessages = (messages: AssistantMessage[]) => {
    const next = [...assistantMessages, ...messages].slice(-12); setAssistantMessages(next); save({ assistantMessages: next });
  };
  const upsertChatThread = (thread: ChatThread) => {
    const next = chatThreads.some((item) => item.id === thread.id) ? chatThreads.map((item) => item.id === thread.id ? thread : item) : [thread, ...chatThreads];
    setChatThreads(next); save({ chatThreads: next });
  };

  const value = useMemo(() => ({ isDemoMode: true as const, points, walletCash, referralCode, referralCount, dailyBonusClaimed, scratchAvailable, scratchPrize, assistantMessages, chatThreads, claimDailyBonus, claimScratchCard, awardPurchasePoints, completeDemoReferral, addAssistantMessage, addAssistantMessages, upsertChatThread }), [points, walletCash, referralCount, dailyBonusClaimed, scratchAvailable, scratchPrize, assistantMessages, chatThreads]);
  return <EngagementContext.Provider value={value}>{children}</EngagementContext.Provider>;
};

export const useEngagement = () => {
  const context = useContext(EngagementContext);
  if (!context) throw new Error('useEngagement must be used within EngagementProvider');
  return context;
};
