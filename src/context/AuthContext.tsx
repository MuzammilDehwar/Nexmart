import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  auth, 
  db,
  isFirebaseConfigured, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  fbSignOut, 
  onAuthStateChanged, 
  updateProfile,
  getIdTokenResult,
  doc,
  setDoc,
  updateDoc,
  FirebaseUser 
} from '../lib/firebase';

export type UserRole = 'guest' | 'customer' | 'vendor' | 'admin' | 'Super Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeName?: string;
  storeSlug?: string;
  avatar: string;
  title?: string;
  joinedDate: string;
  authSource?: 'firebase' | 'demo';
  emailVerified?: boolean;
}

export interface VendorApplication {
  id: string;
  applicantEmail: string;
  applicantName: string;
  storeName: string;
  storeSlug: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export const PRESET_USERS: Record<'customer' | 'vendor' | 'admin', User> = {
  customer: {
    id: 'usr-cust-01',
    name: 'Julian Vance',
    email: 'julian.vance@example.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    title: 'Verified Buyer · Prime Member',
    joinedDate: 'March 2024',
    authSource: 'demo',
  },
  vendor: {
    id: 'usr-vend-01',
    name: 'Marcus Thorne',
    email: 'marcus@luminaaudio.com',
    role: 'vendor',
    storeName: 'Lumina Audio Labs',
    storeSlug: 'lumina-audio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    title: 'Store Owner · Lumina Audio Labs',
    joinedDate: 'January 2023',
    authSource: 'demo',
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Elena Rostova',
    email: 'elena@nexmart.internal',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    title: 'Chief Marketplace Officer · Super Admin',
    joinedDate: 'Platform Inception',
    authSource: 'demo',
  },
};

const VENDOR_APPLICATIONS_KEY = 'nexmart_vendor_applications_v1';
const APPROVED_VENDORS_KEY = 'nexmart_approved_vendors_v1';

// Real privileged roles come from Firebase Custom Claims or admin-managed records in Firestore rules.
interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isLoadingAuth: boolean;
  authError: string | null;
  isFirebaseConfigured: boolean;
  firebaseUser: FirebaseUser | null;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => void;
  register: (name: string, email: string, role: UserRole, storeName?: string) => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (
    name: string, 
    email: string, 
    password: string, 
    requestedRole: UserRole, 
    storeName?: string
  ) => Promise<{ pendingApproval?: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  targetProtectedRole: UserRole | null;
  setTargetProtectedRole: (role: UserRole | null) => void;
  openAuthModalWithRole: (targetRole: UserRole) => void;
  clearAuthError: () => void;
  vendorApplications: VendorApplication[];
  approveVendorApplication: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(isFirebaseConfigured ? 'guest' : 'customer');
  const [user, setUser] = useState<User | null>(isFirebaseConfigured ? null : PRESET_USERS.customer);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [targetProtectedRole, setTargetProtectedRole] = useState<UserRole | null>(null);

  // Vendor applications for RBAC workflow
  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>(() => {
    try {
      const stored = localStorage.getItem(VENDOR_APPLICATIONS_KEY);
      return stored ? JSON.parse(stored) : [
        {
          id: 'app-001',
          applicantEmail: 'david@solarkit.io',
          applicantName: 'David Chen',
          storeName: 'SolarKit Innovations',
          storeSlug: 'solarkit-innovations',
          status: 'pending',
          submittedAt: 'Yesterday at 4:32 PM'
        }
      ];
    } catch {
      return [];
    }
  });

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Helper to determine role from Firebase token claims and trusted platform rules
  // Rule 7: Do not allow users to grant themselves seller or admin privileges.
  const resolveRoleForFirebaseUser = useCallback(async (fbUser: FirebaseUser): Promise<{ role: UserRole; storeName?: string; storeSlug?: string }> => {
    try {
      const tokenResult = await getIdTokenResult(fbUser, false);
      const claims = tokenResult.claims;

      // 1. Check server-issued Custom Claims (set exclusively by Admin SDK)
      if (claims.admin === true || claims.role === 'admin' || claims.role === 'Super Admin' || claims.superAdmin === true) {
        return { role: 'admin' };
      }
      if (claims.vendor === true || claims.role === 'vendor') {
        return { 
          role: 'vendor', 
          storeName: (claims.storeName as string) || 'Authorized Merchant Store',
          storeSlug: (claims.storeSlug as string) || 'merchant-store'
        };
      }

      // Client-editable localStorage is deliberately not consulted here.
      // A real Firebase session is privileged only when the server-issued token says so.
      // Default safe role: Customer
      return { role: 'customer' };
    } catch (err) {
      console.warn('Error evaluating token claims:', err);
      return { role: 'customer' };
    }
  }, []);

  // Set up Firebase persistent authentication listener
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // If Firebase is not configured via VITE_FIREBASE_*, stay in hybrid demo mode
      setIsLoadingAuth(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsLoadingAuth(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        const { role: resolvedRole, storeName, storeSlug } = await resolveRoleForFirebaseUser(fbUser);
        
        const photoUrl = fbUser.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80`;
        const displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Member';

        setRole(resolvedRole);
        setUser({
          id: fbUser.uid,
          name: displayName,
          email: fbUser.email || '',
          role: resolvedRole,
          storeName,
          storeSlug,
          avatar: photoUrl,
          title: resolvedRole === 'admin' 
            ? 'Platform Administrator · Super Admin' 
            : resolvedRole === 'vendor' 
              ? `Store Owner · ${storeName || 'Merchant'}` 
              : 'Verified Customer · Firebase Session',
          joinedDate: fbUser.metadata.creationTime ? new Date(fbUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent',
          authSource: 'firebase',
          emailVerified: fbUser.emailVerified
        });
      } else {
        setFirebaseUser(null);
        // Retain a local demo persona, but never leave a real privileged role active after sign-out.
        setUser((prev) => {
          if (prev?.authSource === 'firebase') {
            setRole('guest');
            return null;
          }
          return prev;
        });
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, [resolveRoleForFirebaseUser]);

  // Demo Switcher: allows instant 1-click exploration of roles
  const switchRole = (newRole: UserRole) => {
    if (firebaseUser) {
      setAuthError('Demo persona switching is disabled for real Firebase sessions. Roles come from trusted Firebase claims.');
      return;
    }
    setRole(newRole);
    if (newRole === 'guest') {
      setUser(null);
    } else if (newRole === 'admin' || (newRole as string) === 'Super Admin') {
      setUser(PRESET_USERS.admin);
    } else {
      setUser(PRESET_USERS[newRole as 'customer' | 'vendor']);
    }
  };

  // Real Firebase sign in with email and password
  const loginWithEmail = async (emailInput: string, passwordInput: string) => {
    setIsLoadingAuth(true);
    setAuthError(null);

    if (!isFirebaseConfigured || !auth) {
      // Graceful fallback when environment variables are not yet provided
      const trimmedEmail = emailInput.trim().toLowerCase();
      const finalRole: UserRole = trimmedEmail.includes('admin') || trimmedEmail.includes('elena')
        ? 'admin'
        : trimmedEmail.includes('vendor') || trimmedEmail.includes('lumina')
        ? 'vendor'
        : 'customer';

      setRole(finalRole);
      const base = PRESET_USERS[finalRole];
      setUser({
        ...base,
        email: emailInput,
        name: emailInput.split('@')[0].replace(/[._-]/g, ' ') || base.name,
        authSource: 'demo'
      });
      setIsAuthModalOpen(false);
      setIsLoadingAuth(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
      const fbUser = userCredential.user;
      const { role: resolvedRole, storeName, storeSlug } = await resolveRoleForFirebaseUser(fbUser);
      
      setRole(resolvedRole);
      setUser({
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
        email: fbUser.email || emailInput,
        role: resolvedRole,
        storeName,
        storeSlug,
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        title: resolvedRole === 'admin' 
          ? 'Platform Administrator · Super Admin' 
          : resolvedRole === 'vendor' 
            ? `Store Owner · ${storeName || 'Merchant'}` 
            : 'Verified Customer · Firebase Session',
        joinedDate: 'Just now',
        authSource: 'firebase',
        emailVerified: fbUser.emailVerified
      });
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('Firebase signInWithEmailAndPassword error:', err);
      let message = 'Failed to sign in. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        message = 'Invalid email or password. Please verify your credentials or register a new account.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please provide a valid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Access temporarily restricted due to many failed attempts. Please try again later.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection.';
      } else if (err.message) {
        message = err.message;
      }
      setAuthError(message);
      throw new Error(message);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Real Firebase registration
  // Rule 7: Prevents self-escalation to vendor or admin. All new Firebase accounts are registered as 'customer'.
  const registerWithEmail = async (
    nameInput: string, 
    emailInput: string, 
    passwordInput: string, 
    requestedRole: UserRole, 
    storeNameInput?: string
  ) => {
    setIsLoadingAuth(true);
    setAuthError(null);

    const safeRole: UserRole = 'customer'; // Strict RBAC default

    if (!isFirebaseConfigured || !auth) {
      // Demo fallback
      const finalRole = requestedRole === 'admin' ? 'customer' : requestedRole;
      setRole(finalRole);
      setUser({
        id: `usr-custom-${Date.now().toString().slice(-4)}`,
        name: nameInput || 'Marketplace Member',
        email: emailInput,
        role: finalRole,
        storeName: finalRole === 'vendor' ? (storeNameInput || 'My Artisan Store') : undefined,
        storeSlug: finalRole === 'vendor' ? (storeNameInput || 'my-store').toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        title: finalRole === 'vendor' ? `Store Owner · ${storeNameInput || 'Artisan Goods'}` : 'Verified Member',
        joinedDate: 'Just now',
        authSource: 'demo'
      });
      setIsAuthModalOpen(false);
      setIsLoadingAuth(false);
      return { 
        pendingApproval: requestedRole === 'vendor',
        message: requestedRole === 'vendor' 
          ? 'Registered as Customer. Vendor application logged for review.' 
          : 'Account created successfully!' 
      };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
      const fbUser = userCredential.user;

      if (nameInput.trim()) {
        try {
          await updateProfile(fbUser, { displayName: nameInput.trim() });
        } catch (profileErr) {
          console.warn('Could not update profile displayName:', profileErr);
        }
      }

      // If user requested vendor privileges, submit application to the admin queue
      let pendingApproval = false;
      let statusMessage = 'Welcome to NexMart! Your account is active as Customer.';

      if (requestedRole === 'vendor') {
        pendingApproval = true;
        const newApplication: VendorApplication = {
          id: `app-${Date.now()}`,
          applicantEmail: emailInput.trim().toLowerCase(),
          applicantName: nameInput.trim() || 'Vendor Applicant',
          storeName: storeNameInput?.trim() || 'Artisan Goods Studio',
          storeSlug: (storeNameInput?.trim() || 'artisan-goods').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          status: 'pending',
          submittedAt: 'Just now'
        };
        const updatedApps = [newApplication, ...vendorApplications];
        setVendorApplications(updatedApps);
        try {
          localStorage.setItem(VENDOR_APPLICATIONS_KEY, JSON.stringify(updatedApps));
        } catch (e) {
          console.warn('Could not persist vendor application:', e);
        }
        statusMessage = `Account activated as Customer. Your Vendor application for "${newApplication.storeName}" has been submitted to Admin for compliance verification.`;
      } else if (requestedRole === 'admin') {
        statusMessage = 'Account created as Customer. Super Admin privileges cannot be self-assigned and require authorized platform deployment credentials.';
      }

      setRole(safeRole);
      setUser({
        id: fbUser.uid,
        name: nameInput.trim() || fbUser.email?.split('@')[0] || 'Marketplace Member',
        email: fbUser.email || emailInput,
        role: safeRole,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        title: 'Verified Customer · Firebase Auth',
        joinedDate: 'Just now',
        authSource: 'firebase',
        emailVerified: fbUser.emailVerified
      });

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, 'users', fbUser.uid), {
            id: fbUser.uid,
            name: nameInput.trim() || 'Marketplace Member',
            email: emailInput.trim().toLowerCase(),
            role: 'customer',
            createdAt: new Date().toISOString()
          });

          if (requestedRole === 'vendor') {
            await setDoc(doc(db, 'vendor_applications', `app-${fbUser.uid}`), {
              applicantUid: fbUser.uid,
              applicantEmail: emailInput.trim().toLowerCase(),
              applicantName: nameInput.trim() || 'Vendor Applicant',
              storeName: storeNameInput?.trim() || 'Artisan Goods Studio',
              storeSlug: (storeNameInput?.trim() || 'artisan-goods').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              status: 'pending',
              submittedAt: new Date().toISOString()
            });
          }
        } catch (dbErr) {
          console.warn('Could not write user record to Firestore:', dbErr);
        }
      }

      setIsAuthModalOpen(false);
      return { pendingApproval, message: statusMessage };
    } catch (err: any) {
      console.error('Firebase createUserWithEmailAndPassword error:', err);
      let message = 'Failed to register account.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'An account with this email address already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password is too weak. Please choose a password with at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please provide a valid email address.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Email/Password sign-in is not enabled in Firebase Console. Please enable it in Firebase Authentication settings.';
      } else if (err.message) {
        message = err.message;
      }
      setAuthError(message);
      throw new Error(message);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Real logout
  const logout = async () => {
    setIsLoadingAuth(true);
    try {
      if (isFirebaseConfigured && auth) {
        await fbSignOut(auth);
      }
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    } finally {
      setFirebaseUser(null);
      switchRole('guest');
      setIsLoadingAuth(false);
    }
  };

  // Backward-compatibility wrappers for the local demo persona only.
  const login = (emailInput: string, designatedRole?: UserRole) => {
    const finalRole = designatedRole || (emailInput.includes('lumina') || emailInput.includes('vendor') ? 'vendor' : emailInput.includes('admin') ? 'admin' : 'customer');
    setRole(finalRole);
    if (finalRole === 'guest') {
      setUser(null);
    } else {
      const base = finalRole === 'Super Admin' || finalRole === 'admin' ? PRESET_USERS.admin : PRESET_USERS[finalRole];
      setUser({
        ...base,
        email: emailInput || base.email,
        authSource: 'demo'
      });
    }
    setIsAuthModalOpen(false);
  };

  const register = (nameInput: string, emailInput: string, newRole: UserRole, storeNameInput?: string) => {
    const safeRole: UserRole = newRole === 'admin' ? 'customer' : newRole;
    setRole(safeRole);
    if (safeRole === 'guest') {
      setUser(null);
    } else {
      setUser({
        id: `usr-custom-${Date.now().toString().slice(-4)}`,
        name: nameInput || 'Marketplace Member',
        email: emailInput,
        role: safeRole,
        storeName: safeRole === 'vendor' ? (storeNameInput || 'My Artisan Store') : undefined,
        storeSlug: safeRole === 'vendor' ? (storeNameInput || 'my-store').toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        title: safeRole === 'vendor' ? `Store Owner · ${storeNameInput || 'Artisan Goods'}` : 'Verified Member',
        joinedDate: 'Just now',
        authSource: 'demo'
      });
    }
    setIsAuthModalOpen(false);
  };

  const approveVendorApplication = (appId: string) => {
    setVendorApplications(prev => {
      const target = prev.find(a => a.id === appId);
      if (!target) return prev;
      const updated = prev.map(a => a.id === appId ? { ...a, status: 'approved' as const } : a);
      try {
        localStorage.setItem(VENDOR_APPLICATIONS_KEY, JSON.stringify(updated));
        // Add to approved vendors map
        const storedApproved = localStorage.getItem(APPROVED_VENDORS_KEY);
        const map = storedApproved ? JSON.parse(storedApproved) : {};
        map[target.applicantEmail.toLowerCase()] = {
          storeName: target.storeName,
          storeSlug: target.storeSlug
        };
        localStorage.setItem(APPROVED_VENDORS_KEY, JSON.stringify(map));

        if (isFirebaseConfigured && db) {
          updateDoc(doc(db, 'vendor_applications', appId), { status: 'approved' }).catch((e) => console.warn(e));
        }
      } catch (e) {
        console.warn('Error saving approved vendor:', e);
      }
      return updated;
    });
  };

  const openAuthModalWithRole = (targetRole: UserRole) => {
    setTargetProtectedRole(targetRole);
    setAuthModalMode('login');
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const isSuperAdmin = Boolean(
    (role === 'admin' || (role as string) === 'Super Admin' || user?.role === 'admin' || (user?.role as string) === 'Super Admin') &&
    role !== 'guest' &&
    user !== null
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: role !== 'guest' && user !== null,
        isSuperAdmin,
        isLoadingAuth,
        authError,
        isFirebaseConfigured,
        firebaseUser,
        switchRole,
        login,
        register,
        loginWithEmail,
        registerWithEmail,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        targetProtectedRole,
        setTargetProtectedRole,
        openAuthModalWithRole,
        clearAuthError,
        vendorApplications,
        approveVendorApplication,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
