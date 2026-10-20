import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, Key } from 'lucide-react';

interface AccessGuardProps {
  requiredRole: 'vendor' | 'admin';
  title: string;
  description: string;
}

export const AccessGuard: React.FC<AccessGuardProps> = ({
  requiredRole,
  title,
  description,
}) => {
  const { role, user, openAuthModalWithRole } = useAuth();

  const isVendor = requiredRole === 'vendor';
  const roleTitle = isVendor ? 'Seller (Vendor)' : 'Super Admin';

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Warning Banner */}
        <div className={`p-6 text-white ${isVendor ? 'bg-amber-600' : 'bg-purple-900'} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Lock className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-white/20 px-2 py-0.5 rounded">
                  HTTP 403 Forbidden · RBAC Guard
                </span>
                <span className="text-xs opacity-80">NextAuth Session Validator</span>
              </div>
              <h2 className="text-xl font-bold font-display mt-0.5">{title}</h2>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-xs opacity-75 block">Current Persona</span>
            <span className="text-sm font-bold capitalize">
              {role === 'guest' ? 'Unauthenticated Guest' : `${user?.name} (${role})`}
            </span>
          </div>
        </div>

        {/* Guard Explanation */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">
              Authentication Required: {roleTitle} Privileges
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 text-sm text-slate-600">
            {isVendor
              ? 'Seller access appears only after your Firebase account is approved and receives a trusted vendor claim. Registration alone does not grant product-upload privileges.'
              : 'Admin access is restricted to the single platform owner account provisioned with a trusted Firebase admin claim. It cannot be selected or self-assigned in the browser.'}
          </div>

          {/* Credentials Alternative */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Have existing {roleTitle.toLowerCase()} login credentials?
            </span>
            <button
              onClick={() => openAuthModalWithRole(requiredRole)}
              className="inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-amber-700 underline underline-offset-2"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Sign in via NextAuth Provider</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
