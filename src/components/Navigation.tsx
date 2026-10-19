import React from 'react';
import { Download, Layers } from 'lucide-react';

interface NavigationProps {
  activeTab: 'mvp' | 'blueprint' | 'customer' | 'vendor' | 'admin' | 'schema';
  setActiveTab: (tab: 'mvp' | 'blueprint' | 'customer' | 'vendor' | 'admin' | 'schema') => void;
  onExportMarkdown: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onExportMarkdown
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('mvp')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold font-display text-base">
              N
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 font-display whitespace-nowrap block">
                NexMart
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('mvp')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'mvp'
                ? 'text-slate-950 border-amber-500 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Phase 1 MVP Hub
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'customer'
                ? 'text-slate-950 border-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Next.js 14 Storefront
          </button>
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'blueprint'
                ? 'text-slate-950 border-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Architecture Specs
          </button>
          <button
            onClick={() => setActiveTab('vendor')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'vendor'
                ? 'text-slate-950 border-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Vendor Central
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'admin'
                ? 'text-slate-950 border-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin Tower
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'schema'
                ? 'text-slate-950 border-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Schema Studio
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onExportMarkdown}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Phase 1 Spec</span>
          </button>
        </div>
      </div>

      {/* Mobile sub-navigation bar */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 border-t border-slate-100 overflow-x-auto text-xs bg-slate-50/80">
        <button
          onClick={() => setActiveTab('mvp')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'mvp' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-600'
          }`}
        >
          Phase 1 MVP
        </button>
        <button
          onClick={() => setActiveTab('customer')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'customer' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
          }`}
        >
          Storefront
        </button>
        <button
          onClick={() => setActiveTab('blueprint')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'blueprint' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
          }`}
        >
          Blueprint
        </button>
        <button
          onClick={() => setActiveTab('vendor')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'vendor' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
          }`}
        >
          Vendor
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'admin' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
          }`}
        >
          Admin
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'schema' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
          }`}
        >
          Schema
        </button>
      </div>
    </header>
  );
};
