import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged, 
  updateProfile,
  User as FirebaseUser,
  getIdTokenResult
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc
} from 'firebase/firestore';

// Default project ID configured for user's Firebase Project: nexmart-a6309
const DEFAULT_PROJECT_ID = 'nexmart-a6309';

// Reads Vite client-side environment variables without hardcoding secrets
export const firebaseEnvConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined) || `${DEFAULT_PROJECT_ID}.firebaseapp.com`,
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined) || DEFAULT_PROJECT_ID,
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined) || `${DEFAULT_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

export const missingFirebaseEnvKeys = [
  ['VITE_FIREBASE_API_KEY', firebaseEnvConfig.apiKey],
  ['VITE_FIREBASE_MESSAGING_SENDER_ID', firebaseEnvConfig.messagingSenderId],
  ['VITE_FIREBASE_APP_ID', firebaseEnvConfig.appId],
].filter(([, value]) => !value).map(([key]) => key);

// Check whether legitimate Firebase API key & App ID has been provided
export const isFirebaseConfigured = Boolean(
  firebaseEnvConfig.apiKey &&
  firebaseEnvConfig.apiKey.length > 10 &&
  !firebaseEnvConfig.apiKey.includes('YOUR_') &&
  firebaseEnvConfig.appId &&
  !firebaseEnvConfig.appId.includes('YOUR_')
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseEnvConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn('[NexMart Firebase] Initialization error:', err);
  }
} else {
  console.info(
    `[NexMart Firebase] Target project: "${DEFAULT_PROJECT_ID}". Waiting for VITE_FIREBASE_API_KEY and VITE_FIREBASE_APP_ID. Operating in hybrid preview mode.`
  );
}

export { 
  app, 
  auth, 
  db,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  fbSignOut, 
  onAuthStateChanged, 
  updateProfile,
  getIdTokenResult,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc
};
export type { FirebaseUser, Firestore };
