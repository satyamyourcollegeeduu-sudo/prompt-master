import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  deleteUser,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  getDocs,
  onSnapshot,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { UserProfile, UserSettings, UserActivity, GeneratedPromptResult } from '../types';

// Standard or Environment Firebase Configuration
const metaEnv = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyDemoConfigKeyForPromptMasterPro123",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "prompt-master-pro.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "prompt-master-pro",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "prompt-master-pro.appspot.com",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "10987654321",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:10987654321:web:abcdef123456"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Local Storage Session Keys for Offline / Demo Persistence Layer
const LOCAL_USER_KEY = 'prompt_master_user_session';
const LOCAL_USERS_DB_KEY = 'prompt_master_registered_users';
const LOCAL_HISTORY_KEY = 'prompt_master_cloud_history';
const LOCAL_FAVORITES_KEY = 'prompt_master_cloud_favorites';
const LOCAL_ACTIVITIES_KEY = 'prompt_master_cloud_activities';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// Save or Update User Profile in Firestore & Local Sync
export const syncUserProfile = async (user: AuthUser, extraData?: { username?: string; fullName?: string }): Promise<UserProfile> => {
  const userRef = doc(db, 'users', user.uid);
  const now = Date.now();

  const fullName = extraData?.fullName || user.displayName || user.email?.split('@')[0] || 'Prompt Master User';
  const username = extraData?.username || user.email?.split('@')[0] || `user_${user.uid.substring(0, 6)}`;
  const photoURL = user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`;

  const profileData: UserProfile = {
    uid: user.uid,
    fullName,
    username,
    email: user.email || '',
    photoURL,
    emailVerified: user.emailVerified,
    createdAt: now,
    lastLoginAt: now,
    bio: 'AI Prompt Creator & Engineer',
    role: 'Prompt Master Pro Member'
  };

  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const existing = docSnap.data() as UserProfile;
      const updated: UserProfile = {
        ...existing,
        fullName: extraData?.fullName || existing.fullName || fullName,
        username: extraData?.username || existing.username || username,
        email: user.email || existing.email,
        photoURL: user.photoURL || existing.photoURL || photoURL,
        emailVerified: user.emailVerified,
        lastLoginAt: now,
      };
      await updateDoc(userRef, { ...updated });
      saveLocalSession(updated);
      return updated;
    } else {
      await setDoc(userRef, profileData);
      saveLocalSession(profileData);
      return profileData;
    }
  } catch (error) {
    console.warn("Firestore sync fallback to client storage:", error);
    saveLocalSession(profileData);
    return profileData;
  }
};

// Sync Prompt History with Firestore
export const syncUserHistoryToFirestore = async (userId: string, history: GeneratedPromptResult[]) => {
  if (!userId) return;
  try {
    const historyRef = doc(db, 'users', userId, 'data', 'history');
    await setDoc(historyRef, { history, updatedAt: Date.now() });
  } catch (err) {
    console.warn("Firestore history save fallback:", err);
  }
  try {
    localStorage.setItem(`${LOCAL_HISTORY_KEY}_${userId}`, JSON.stringify(history));
  } catch (e) {}
};

// Sync Favorite Prompts with Firestore
export const syncUserFavoritesToFirestore = async (userId: string, favorites: GeneratedPromptResult[]) => {
  if (!userId) return;
  try {
    const favRef = doc(db, 'users', userId, 'data', 'favorites');
    await setDoc(favRef, { favorites, updatedAt: Date.now() });
  } catch (err) {
    console.warn("Firestore favorites save fallback:", err);
  }
  try {
    localStorage.setItem(`${LOCAL_FAVORITES_KEY}_${userId}`, JSON.stringify(favorites));
  } catch (e) {}
};

// Log User Activity to Firestore
export const logUserActivity = async (userId: string, title: string, action: UserActivity['action'], details?: string) => {
  if (!userId) return;
  const activity: UserActivity = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    title,
    action,
    timestamp: Date.now(),
    details
  };

  try {
    const actRef = doc(db, 'users', userId, 'activities', activity.id);
    await setDoc(actRef, activity);
  } catch (err) {
    console.warn("Activity log fallback:", err);
  }

  try {
    const localActsRaw = localStorage.getItem(`${LOCAL_ACTIVITIES_KEY}_${userId}`);
    const localActs: UserActivity[] = localActsRaw ? JSON.parse(localActsRaw) : [];
    const updated = [activity, ...localActs].slice(0, 30);
    localStorage.setItem(`${LOCAL_ACTIVITIES_KEY}_${userId}`, JSON.stringify(updated));
  } catch (e) {}
};

// Fetch User Activities
export const fetchUserActivities = async (userId: string): Promise<UserActivity[]> => {
  try {
    const localActsRaw = localStorage.getItem(`${LOCAL_ACTIVITIES_KEY}_${userId}`);
    if (localActsRaw) {
      return JSON.parse(localActsRaw);
    }
  } catch (e) {}
  return [
    {
      id: 'act_init',
      title: 'Logged in to Prompt Master Pro',
      action: 'login',
      timestamp: Date.now() - 3600000,
      details: 'Started a new session'
    }
  ];
};

// Save session helper
export const saveLocalSession = (user: UserProfile) => {
  try {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  } catch (e) {}
};

export const getLocalSession = (): UserProfile | null => {
  try {
    const data = localStorage.getItem(LOCAL_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const clearLocalSession = () => {
  try {
    localStorage.removeItem(LOCAL_USER_KEY);
  } catch (e) {}
};
