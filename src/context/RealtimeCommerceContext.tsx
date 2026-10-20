import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { collection, db, doc, isFirebaseConfigured, onSnapshot, setDoc } from '../lib/firebase';

const REALTIME_ENABLED = import.meta.env.VITE_FIREBASE_ENABLE_FIRESTORE_SYNC === 'true';

export interface RealtimeChatMessage {
  id: string;
  senderUid: string;
  senderRole: 'customer' | 'vendor' | 'admin';
  body: string;
  createdAt: string;
}

export interface RealtimeChatThread {
  id: string;
  customerUid: string;
  vendorUid: string;
  productId: string;
  productTitle: string;
  vendorName: string;
  updatedAt: string;
  lastMessage: string;
  messages: RealtimeChatMessage[];
}

interface OpenThreadInput {
  vendorUid: string;
  vendorName: string;
  productId: string;
  productTitle: string;
}

interface RealtimeCommerceContextValue {
  isRealtimeAvailable: boolean;
  activeThread: RealtimeChatThread | null;
  chatState: 'idle' | 'loading' | 'live' | 'signed-out' | 'disabled' | 'error';
  chatError: string | null;
  openThread: (input: OpenThreadInput) => void;
  closeThread: () => void;
  sendMessage: (body: string) => Promise<void>;
}

const RealtimeCommerceContext = createContext<RealtimeCommerceContextValue | undefined>(undefined);

const makeThreadId = (customerUid: string, vendorUid: string, productId: string) =>
  `${customerUid}_${vendorUid}_${productId}`.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 140);

const nowIso = () => new Date().toISOString();

export const RealtimeCommerceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { firebaseUser, role } = useAuth();
  const [threadInput, setThreadInput] = useState<OpenThreadInput | null>(null);
  const [activeThread, setActiveThread] = useState<RealtimeChatThread | null>(null);
  const [chatState, setChatState] = useState<RealtimeCommerceContextValue['chatState']>('idle');
  const [chatError, setChatError] = useState<string | null>(null);

  const isRealtimeAvailable = Boolean(REALTIME_ENABLED && isFirebaseConfigured && db && firebaseUser);

  useEffect(() => {
    setActiveThread(null);
    setChatError(null);
    if (!threadInput) {
      setChatState('idle');
      return undefined;
    }
    if (!firebaseUser) {
      setChatState('signed-out');
      return undefined;
    }
    if (!REALTIME_ENABLED || !isFirebaseConfigured || !db) {
      setChatState('disabled');
      return undefined;
    }

    const threadId = makeThreadId(firebaseUser.uid, threadInput.vendorUid, threadInput.productId);
    setChatState('loading');
    const threadRef = doc(db, 'chat_threads', threadId);
    const messagesRef = collection(db, 'chat_threads', threadId, 'messages');
    let threadData: Partial<RealtimeChatThread> = {};
    let messages: RealtimeChatMessage[] = [];
    let active = true;

    const publish = () => {
      if (!active) return;
      setActiveThread({
        id: threadId,
        customerUid: threadData.customerUid || firebaseUser.uid,
        vendorUid: threadData.vendorUid || threadInput.vendorUid,
        productId: threadData.productId || threadInput.productId,
        productTitle: threadData.productTitle || threadInput.productTitle,
        vendorName: threadData.vendorName || threadInput.vendorName,
        updatedAt: threadData.updatedAt || nowIso(),
        lastMessage: threadData.lastMessage || '',
        messages: messages.sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
      });
      setChatState('live');
    };

    const unsubThread = onSnapshot(threadRef, (snapshot) => {
      threadData = snapshot.exists() ? snapshot.data() as Partial<RealtimeChatThread> : {
        customerUid: firebaseUser.uid,
        vendorUid: threadInput.vendorUid,
        productId: threadInput.productId,
        productTitle: threadInput.productTitle,
        vendorName: threadInput.vendorName,
        updatedAt: nowIso(),
        lastMessage: '',
      };
      publish();
    }, (error) => {
      if (!active) return;
      setChatState('error');
      setChatError(error.code === 'permission-denied' ? 'Chat access is not enabled in the deployed Firebase rules yet.' : 'Live chat is temporarily unavailable.');
    });

    const unsubMessages = onSnapshot(messagesRef, (snapshot) => {
      messages = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as RealtimeChatMessage));
      publish();
    }, (error) => {
      if (!active) return;
      setChatState('error');
      setChatError(error.code === 'permission-denied' ? 'Chat messages are blocked by the current Firebase rules.' : 'Live messages are temporarily unavailable.');
    });

    return () => {
      active = false;
      unsubThread();
      unsubMessages();
    };
  }, [firebaseUser?.uid, threadInput]);

  const openThread = (input: OpenThreadInput) => {
    setChatError(null);
    setThreadInput(input);
  };

  const closeThread = () => {
    setThreadInput(null);
    setActiveThread(null);
    setChatState('idle');
  };

  const sendMessage = async (body: string) => {
    const cleanBody = body.trim();
    if (!cleanBody || !firebaseUser || !threadInput || !db || !REALTIME_ENABLED) {
      throw new Error('Sign in and enable Firebase real-time sync before sending a live message.');
    }
    const threadId = makeThreadId(firebaseUser.uid, threadInput.vendorUid, threadInput.productId);
    const messageId = crypto.randomUUID();
    const createdAt = nowIso();
    const senderRole = role === 'vendor' || role === 'admin' ? role : 'customer';
    await setDoc(doc(db, 'chat_threads', threadId), {
      customerUid: firebaseUser.uid,
      vendorUid: threadInput.vendorUid,
      participants: [firebaseUser.uid, threadInput.vendorUid],
      productId: threadInput.productId,
      productTitle: threadInput.productTitle,
      vendorName: threadInput.vendorName,
      updatedAt: createdAt,
      lastMessage: cleanBody,
    }, { merge: true });
    await setDoc(doc(db, 'chat_threads', threadId, 'messages', messageId), {
      senderUid: firebaseUser.uid,
      senderRole,
      body: cleanBody,
      createdAt,
    });
  };

  const value = useMemo(() => ({
    isRealtimeAvailable,
    activeThread,
    chatState,
    chatError,
    openThread,
    closeThread,
    sendMessage,
  }), [isRealtimeAvailable, activeThread, chatState, chatError, firebaseUser?.uid, role, threadInput]);

  return <RealtimeCommerceContext.Provider value={value}>{children}</RealtimeCommerceContext.Provider>;
};

export const useRealtimeCommerce = () => {
  const context = useContext(RealtimeCommerceContext);
  if (!context) throw new Error('useRealtimeCommerce must be used within RealtimeCommerceProvider');
  return context;
};
