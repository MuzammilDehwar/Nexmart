import React, { useState } from 'react';
import { Download, Lock, LogIn, ChevronDown, LogOut } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';

interface NavigationProps {
  activeTab: 'blueprint' | 'customer' | 'vendor' | 'admin' | 'schema';
  setActiveTab: (tab: 'blueprint' | 'customer' | 'vendor' | 'admin' | 'schema') => void;
  onExportMarkdown: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onExportMarkdown
}) => {
  const { role, user, setIsAuthModalOpen, setAuthModalMode, logout, isLoadingAuth } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Helper for role pill styling
  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'admin':
        return { label: 'Admin', color: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'vendor':
        return { label: 'Seller', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'customer':
        return { label: 'Customer', color: 'bg-sky-100 text-sky-900 border-sky-300' };
      case 'guest':
      default:
        return { label: 'Guest', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  const currentBadge = getRoleBadge(role);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('customer')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold font-display text-base shadow-sm">
              N
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 font-display whitespace-nowrap block">
                NexMart
              </span>
            </div>
          </button>
        </div>

        {/* Role-scoped navigation: protected links are not rendered for other roles. */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button onClick={() => setActiveTab('customer')} className={`transition-colors whitespace-nowrap py-1 border-b-2 ${activeTab === 'customer' ? 'text-slate-950 border-slate-900 font-bold' : 'border-transparent hover:text-slate-900'}`}>Storefront</button>
          {role === 'vendor' && <button onClick={() => setActiveTab('vendor')} className={`transition-colors whitespace-nowrap py-1 border-b-2 ${activeTab === 'vendor' ? 'text-slate-950 border-amber-500 font-bold' : 'border-transparent hover:text-slate-900'}`}>Seller Central</button>}
          {role === 'admin' && <>
            <button onClick={() => setActiveTab('vendor')} className={`transition-colors whitespace-nowrap py-1 border-b-2 ${activeTab === 'vendor' ? 'text-slate-950 border-amber-500 font-bold' : 'border-transparent hover:text-slate-900'}`}>Seller Central</button>
            <button onClick={() => setActiveTab('admin')} className={`transition-colors whitespace-nowrap py-1 border-b-2 ${activeTab === 'admin' ? 'text-slate-950 border-purple-600 font-bold' : 'border-transparent hover:text-slate-900'}`}>Admin Tower</button>
            <button onClick={() => setActiveTab('blueprint')} className={`transition-colors whitespace-nowrap py-1 border-b-2 ${activeTab === 'blueprint' ? 'text-slate-950 border-slate-900 font-bold' : 'border-transparent hover:text-slate-900'}`}>Blueprint</button>
            <button onClick={() => setActiveTab('schema')} className={`transition-colors whitespace-nowrap py-1 border-b-2 ${activeTab === 'schema' ? 'text-slate-950 border-slate-900 font-bold' : 'border-transparent hover:text-slate-900'}`}>Schema</button>
          </>}
        </nav>

        {/* Zone 3: Demo Role Switcher + Account Identity + Export */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* User Profile / Login Button with Dropdown */}
          <div className="relative">
            {isLoadingAuth ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Verifying...</span>
              </div>
            ) : role === 'guest' ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-600" />
                  <span>Sign in</span>
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-bold text-white bg-slate-900 border border-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
                >
                  Create account
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-all text-left"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-[11px] font-bold text-slate-900 leading-tight truncate max-w-[100px]">
                    {user?.name.split(' ')[0]}
                  </div>
                  <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${currentBadge.color}`}>
                    {currentBadge.label}
                  </span>
                </div>
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-7 h-7 rounded-md object-cover border border-slate-300"
                />
                <ChevronDown className="w-3 h-3 text-slate-400 mr-0.5" />
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && role !== 'guest' && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs space-y-3 animate-fadeIn"
                onMouseLeave={() => setIsProfileMenuOpen(false)}
              >
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-900 truncate">{user?.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">{user?.email}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold border ${currentBadge.color}`}>
                        {user?.title || currentBadge.label}
                      </span>
                      {user?.authSource === 'firebase' ? (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-semibold px-1 py-0.2 rounded font-mono">
                          Firebase
                        </span>
                      ) : (
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-mono">
                          Demo
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Manage Account
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {role === 'admin' && <button
            onClick={onExportMarkdown}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Spec</span>
          </button>}
        </div>
      </div>

      {/* Mobile role-scoped navigation */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 border-t border-slate-100 overflow-x-auto text-xs bg-slate-50/80">
        <button onClick={() => setActiveTab('customer')} className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${activeTab === 'customer' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}>Storefront</button>
        {role === 'vendor' && <button onClick={() => setActiveTab('vendor')} className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${activeTab === 'vendor' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}>Seller</button>}
        {role === 'admin' && <>
          <button onClick={() => setActiveTab('vendor')} className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${activeTab === 'vendor' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}>Seller</button>
          <button onClick={() => setActiveTab('admin')} className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${activeTab === 'admin' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}>Admin</button>
          <button onClick={() => setActiveTab('blueprint')} className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${activeTab === 'blueprint' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}>Blueprint</button>
          <button onClick={() => setActiveTab('schema')} className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${activeTab === 'schema' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}>Schema</button>
        </>}
      </div>
    </header>
  );
};
