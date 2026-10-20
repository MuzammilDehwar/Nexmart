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
  Check, 
  Sparkles, 
  AlertCircle,
  Loader2,
  Info,
  CheckCircle2,
  Flame
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginWithEmail,
    registerWithEmail,
    switchRole,
    targetProtectedRole,
    setTargetProtectedRole,
    isLoadingAuth,
    authError,
    clearAuthError,
    isFirebaseConfigured
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Pre-fill fields if user targeted a specific role
  useEffect(() => {
    if (targetProtectedRole && targetProtectedRole !== 'guest') {
      setSelectedRole(targetProtectedRole);
      setEmail(PRESET_USERS[targetProtectedRole].email);
      setPassword('password123');
    }
  }, [targetProtectedRole]);

  useEffect(() => {
    if (isAuthModalOpen) {
      setLocalError(null);
      setSuccessNotice(null);
      clearAuthError();
    }
  }, [isAuthModalOpen, clearAuthError]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setTargetProtectedRole(null);
    setLocalError(null);
    setSuccessNotice(null);
    clearAuthError();
  };

  const handleQuickLogin = (role: UserRole) => {
    switchRole(role);
    handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessNotice(null);
    clearAuthError();

    if (!email.trim()) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      if (authModalMode === 'login') {
        await loginWithEmail(email, password);
        handleClose();
      } else {
        if (!name.trim()) {
          setLocalError('Please enter your full name');
          setIsSubmitting(false);
          return;
        }
        if (selectedRole === 'vendor' && !storeName.trim()) {
          setLocalError('Please enter your merchant brand or store name');
          setIsSubmitting(false);
          return;
        }

        const result = await registerWithEmail(name, email, password, selectedRole, storeName);
        if (result?.message) {
          setSuccessNotice(result.message);
          setTimeout(() => {
            handleClose();
          }, 1500);
        } else {
          handleClose();
        }
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col transition-all"
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
                <h3 className="font-bold text-base text-white tracking-tight">Your NexMart account</h3>
                {isFirebaseConfigured ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    Firebase Auth Live
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    Hybrid Demo Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isFirebaseConfigured ? 'Secure sign-in for your marketplace account' : 'Enterprise Unified Identity Provider'}
              </p>
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
                ? 'Vendor Central requires seller permissions. Sign in as a verified Vendor or Admin below.'
                : 'Admin Tower requires Super Admin governance credentials to access.'}
            </span>
          </div>
        )}

        {!isFirebaseConfigured && (
        <>
        {/* 1-Click Quick Demo Switcher Presets */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              1-Click Demo Testing Personas
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Dev Switcher</span>
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
        </>
        )}

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="flex border-b border-slate-200 px-6 pt-3">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setLocalError(null);
              clearAuthError();
            }}
            className={`pb-3 text-xs font-bold transition-all border-b-2 mr-6 ${
              authModalMode === 'login'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setLocalError(null);
              clearAuthError();
            }}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              authModalMode === 'register'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {displayError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span className="leading-snug">{displayError}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span className="leading-snug">{successNotice}</span>
            </div>
          )}

          {/* Role selector is needed for onboarding/protected portal entry, not ordinary sign-in. */}
          {(authModalMode === 'register' || targetProtectedRole) && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 block">
                {authModalMode === 'login' ? 'Target Account Type' : 'Account Type / Desired Portal'}
              </label>
              {authModalMode === 'register' && (
                <span className="text-[10px] text-slate-400 font-mono">RBAC Regulated</span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('customer');
                  if (authModalMode === 'login' && !email) setEmail(PRESET_USERS.customer.email);
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
                  if (authModalMode === 'login' && !email) setEmail(PRESET_USERS.vendor.email);
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
                  if (authModalMode === 'login' && !email) setEmail(PRESET_USERS.admin.email);
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
          )}

          {/* RBAC Security Notice (Requirement 7: Prevents self-granting privileged roles) */}
          {authModalMode === 'register' && selectedRole === 'vendor' && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Vendor RBAC Protocol:</strong> Account is created as Customer with a Vendor Onboarding Application queued in Admin Tower for compliance review.
              </span>
            </div>
          )}

          {authModalMode === 'register' && selectedRole === 'admin' && (
            <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg text-[11px] text-purple-900 flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>Super Admin Policy:</strong> Governance privileges cannot be self-assigned. Real Admin access requires server-side Custom Claims or authorized platform credentials.
              </span>
            </div>
          )}

          {authModalMode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Julian Vance"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (displayError) setLocalError(null);
                  }}
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
                  onChange={(e) => {
                    setStoreName(e.target.value);
                    if (displayError) setLocalError(null);
                  }}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (displayError) setLocalError(null);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">Password</label>
              <span className="text-[10px] text-slate-400">Min. 6 characters</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (displayError) setLocalError(null);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoadingAuth}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {isSubmitting || isLoadingAuth ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>
                  {authModalMode === 'login' ? 'Authenticating with Firebase...' : 'Registering Firebase Account...'}
                </span>
              </>
            ) : authModalMode === 'login' ? (
              <>
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign In via Firebase Auth</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5] text-amber-400" />
                <span>Create &amp; Register Account</span>
              </>
            )}
          </button>

          <div className="text-center text-xs text-slate-600">
            {authModalMode === 'login' ? (
              <>New to NexMart? <button type="button" onClick={() => { setAuthModalMode('register'); setLocalError(null); clearAuthError(); }} className="font-bold text-slate-900 hover:text-amber-700 underline underline-offset-2">Create your NexMart account</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => { setAuthModalMode('login'); setLocalError(null); clearAuthError(); }} className="font-bold text-slate-900 hover:text-amber-700 underline underline-offset-2">Sign in</button></>
            )}
          </div>

          {/* Security & Token Protocol Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <Lock className="w-3 h-3 text-emerald-600" />
              Firebase Auth Session · AES-256
            </span>
            <span className="text-[10px] text-slate-500">
              {isFirebaseConfigured ? 'Live Environment' : 'Demo Mode Active'}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
