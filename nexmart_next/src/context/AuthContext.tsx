import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'guest' | 'customer' | 'vendor' | 'admin';

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
}

export const PRESET_USERS: Record<Exclude<UserRole, 'guest'>, User> = {
  customer: {
    id: 'usr-cust-01',
    name: 'Julian Vance',
    email: 'julian.vance@example.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    title: 'Verified Buyer · Prime Member',
    joinedDate: 'March 2024',
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
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Elena Rostova',
    email: 'elena@nexmart.internal',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    title: 'Chief Marketplace Officer · Super Admin',
    joinedDate: 'Platform Inception',
  },
};

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => void;
  register: (name: string, email: string, role: UserRole, storeName?: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  targetProtectedRole: UserRole | null;
  setTargetProtectedRole: (role: UserRole | null) => void;
  openAuthModalWithRole: (targetRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to Customer role Julian Vance for immediate interactive exploration
  const [role, setRole] = useState<UserRole>('customer');
  const [user, setUser] = useState<User | null>(PRESET_USERS.customer);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [targetProtectedRole, setTargetProtectedRole] = useState<UserRole | null>(null);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'guest') {
      setUser(null);
    } else {
      setUser(PRESET_USERS[newRole]);
    }
  };

  const login = (email: string, designatedRole?: UserRole) => {
    const finalRole = designatedRole || (email.includes('lumina') || email.includes('vendor') ? 'vendor' : email.includes('admin') ? 'admin' : 'customer');
    setRole(finalRole);
    if (finalRole === 'guest') {
      setUser(null);
    } else {
      const base = PRESET_USERS[finalRole];
      setUser({
        ...base,
        email: email || base.email,
      });
    }
    setIsAuthModalOpen(false);
  };

  const register = (name: string, email: string, newRole: UserRole, storeName?: string) => {
    setRole(newRole);
    if (newRole === 'guest') {
      setUser(null);
    } else {
      setUser({
        id: `usr-custom-${Date.now().toString().slice(-4)}`,
        name: name || 'Marketplace Member',
        email,
        role: newRole,
        storeName: newRole === 'vendor' ? (storeName || 'My Artisan Store') : undefined,
        storeSlug: newRole === 'vendor' ? (storeName || 'my-store').toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        title: newRole === 'vendor' ? `Store Owner · ${storeName || 'Artisan Goods'}` : newRole === 'admin' ? 'Platform Administrator' : 'Verified Member',
        joinedDate: 'Just now',
      });
    }
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    switchRole('guest');
  };

  const openAuthModalWithRole = (targetRole: UserRole) => {
    setTargetProtectedRole(targetRole);
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: role !== 'guest' && user !== null,
        switchRole,
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        targetProtectedRole,
        setTargetProtectedRole,
        openAuthModalWithRole,
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
