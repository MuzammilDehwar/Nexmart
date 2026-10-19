'use client';

import React from 'react';
import { Menu, Flame, Shield, Sparkles } from 'lucide-react';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  isHot?: boolean;
}

interface CategoryNavProps {
  categories: CategoryItem[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  onOpenAllDepartments?: () => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  onOpenAllDepartments,
}) => {
  return (
    <div className="bg-slate-900 text-white text-xs border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
        
        {/* Left: Department Drawer Trigger */}
        <div className="flex items-center gap-1 shrink-0 py-2.5">
          <button
            onClick={onOpenAllDepartments}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-800 text-white font-bold transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span>All Departments</span>
          </button>
          <span className="text-slate-700" aria-hidden="true">|</span>
        </div>

        {/* Center: Dynamic Category List */}
        <nav className="flex items-center gap-1 md:gap-2 shrink-0 py-2.5 overflow-x-auto">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Featured Today
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.isHot && <Flame className="w-3.5 h-3.5 text-amber-400" />}
              <span>{cat.name}</span>
            </button>
          ))}
        </nav>

        {/* Right: Trust badges / Special Channels */}
        <div className="hidden lg:flex items-center gap-4 text-slate-400 shrink-0 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Verified Stores</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Studio Guarantee</span>
          </div>
        </div>

      </div>
    </div>
  );
};
