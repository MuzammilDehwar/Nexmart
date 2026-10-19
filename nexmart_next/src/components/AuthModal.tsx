import React, { useState, useEffect } from 'react';
import { useAuth, UserRole, PRESET_USERS } from '../context/AuthContext';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Store, 
  User as UserIcon, 
  Key, 
  ArrowRight, 
  Check, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    targetProtectedRole,
    setTargetProtectedRole,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('••••••••••');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pre-fill fields if user targeted a specific role
  useEffect(() => {
    if (targetProtectedRole && targetProtectedRole !== 'guest') {
      setSelectedRole(targetProtectedRole);
      setEmail(PRESET_USERS[targetProtectedRole].email);
    }
  }, [targetProtectedRole]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setTargetProtectedRole(null);
    setErrorMsg(null);
  };

  const handleQuickLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      login(PRESET_USERS[role as Exclude<UserRole, 'guest'>].email, role);
      setIsLoading(false);
      handleClose();
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (authModalMode === 'login') {
      if (!email.trim()) {
        setErrorMsg('Please enter a valid email address');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        login(email, selectedRole);
        setIsLoading(false);
        handleClose();
      }, 500);
    } else {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }
      if (!email.trim()) {
        setErrorMsg('Please enter your email address');
        return;
      }
      if (selectedRole === 'vendor' && !storeName.trim()) {
        setErrorMsg('Please enter your merchant brand or store name');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        register(name, email, selectedRole, storeName);
        setIsLoading(false);
        handleClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold font-display text-lg shadow-sm">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-tight">NexMart ID</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  NextAuth.js v5
                </span>
              </div>
              <p className="text-xs text-slate-400">Enterprise Unified Identity Provider</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protection Warning if user was routed from restricted tab */}
        {targetProtectedRole && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {targetProtectedRole === 'vendor'
                ? 'Vendor Central requires seller permissions. Sign in as a Vendor or Admin below.'
                : 'Admin Tower requires Super Admin governance credentials to access.'}
            </span>
          </div>
        )}

        {/* 1-Click Quick Demo Switcher Presets */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              1-Click Demo Testing Accounts
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Instant Auth</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="p-2 bg-white rounded-lg border border-slate-200 hover:border-slate-400 hover:shadow-xs transition-all text-left group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <UserIcon className="w-3.5 h-3.5 text-sky-600" />
                <span>Customer</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">Julian Vance</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('vendor')}
              className="p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all text-left group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <Store className="w-3.5 h-3.5 text-amber-600" />
                <span>Vendor</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">Lumina Audio</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-2 bg-white rounded-lg border border-slate-200 hover:border-purple-400 hover:shadow-xs transition-all text-left group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Super Admin</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">Elena Rostova</p>
            </button>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="flex border-b border-slate-200 px-6 pt-3">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMsg(null);
            }}
            className={`pb-3 text-xs font-bold transition-all border-b-2 mr-6 ${
              authModalMode === 'login'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In with Credentials
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMsg(null);
            }}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              authModalMode === 'register'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Register New Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Role selector for registration or custom sign in */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              {authModalMode === 'login' ? 'Select Target Role' : 'Account Type / Permission Level'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('customer');
                  if (authModalMode === 'login') setEmail(PRESET_USERS.customer.email);
                }}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                  selectedRole === 'customer'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('vendor');
                  if (authModalMode === 'login') setEmail(PRESET_USERS.vendor.email);
                }}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                  selectedRole === 'vendor'
                    ? 'border-amber-500 bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Vendor (Seller)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  if (authModalMode === 'login') setEmail(PRESET_USERS.admin.email);
                }}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                  selectedRole === 'admin'
                    ? 'border-purple-600 bg-purple-600 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Super Admin
              </button>
            </div>
          </div>

          {authModalMode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Julian Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {authModalMode === 'register' && selectedRole === 'vendor' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Merchant Store Brand Name</label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Kyoto Crafts Studio"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">Password</label>
              {authModalMode === 'login' && (
                <span className="text-[11px] text-amber-700 hover:text-amber-800 cursor-pointer">
                  Forgot Password?
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating Session...</span>
            ) : authModalMode === 'login' ? (
              <>
                <Key className="w-3.5 h-3.5" />
                <span>Sign In as {selectedRole.toUpperCase()}</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Create &amp; Activate Account</span>
              </>
            )}
          </button>

          {/* NextAuth Security Token Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <Lock className="w-3 h-3 text-emerald-600" />
              AES-256 JWT Session Token
            </span>
            <span className="text-[10px] text-slate-500">RBAC Enforced</span>
          </div>
        </form>
      </div>
    </div>
  );
};
