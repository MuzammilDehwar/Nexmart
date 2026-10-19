'use client';

import React from 'react';
import { Star, RotateCcw, Check } from 'lucide-react';

interface SidebarFilterProps {
  maxPrice: number;
  onPriceChange: (val: number) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;
  availableBrands: { name: string; count: number }[];
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  maxPrice,
  onPriceChange,
  minRating,
  onRatingChange,
  selectedBrands,
  onToggleBrand,
  availableBrands,
  inStockOnly,
  onToggleInStock,
  onResetFilters,
  activeFilterCount,
}) => {
  return (
    <aside className="bg-white rounded-xl border border-slate-200 p-5 space-y-6 shadow-2xs text-xs">
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 text-sm font-display">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold font-mono">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 font-semibold transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Price Range Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900">Price Ceiling</span>
          <span className="font-mono font-bold text-slate-900 tabular-nums">
            Up to ${maxPrice.toFixed(0)}
          </span>
        </div>

        <input
          type="range"
          min="100"
          max="1200"
          step="25"
          value={maxPrice}
          onChange={(e) => onPriceChange(parseFloat(e.target.value))}
          className="w-full accent-slate-900 cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>$100</span>
          <span>$650</span>
          <span>$1,200+</span>
        </div>
      </div>

      {/* 2. Customer Star Rating Filter */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <span className="font-bold text-slate-900 block">Customer Reviews</span>
        <div className="space-y-1.5">
          {[
            { value: 4.8, label: '4.8 Stars & Above' },
            { value: 4.5, label: '4.5 Stars & Above' },
            { value: 4.0, label: '4.0 Stars & Above' },
            { value: 0, label: 'All Customer Ratings' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onRatingChange(item.value)}
              className={`w-full flex items-center justify-between p-1.5 rounded-lg text-left transition-colors ${
                minRating === item.value
                  ? 'bg-amber-50 text-slate-900 font-bold'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {item.value > 0 ? (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= Math.floor(item.value)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500">Any Rating</span>
                )}
                {item.value > 0 && (
                  <span className="text-[11px] text-slate-600 font-medium">
                    & Up
                  </span>
                )}
              </div>
              {minRating === item.value && (
                <Check className="w-3.5 h-3.5 text-amber-700 stroke-[2.5]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Brand & Verified Merchant Checkboxes */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <span className="font-bold text-slate-900 block">Verified Brand / Store</span>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {availableBrands.map((b) => {
            const isChecked = selectedBrands.includes(b.name);
            return (
              <label
                key={b.name}
                className="flex items-center justify-between cursor-pointer group select-none text-slate-700 hover:text-slate-900"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleBrand(b.name)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                  <span className={`text-[11px] ${isChecked ? 'font-bold text-slate-900' : ''}`}>
                    {b.name}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  ({b.count})
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. In Stock Only Toggle Switch */}
      <div className="pt-4 border-t border-slate-100">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900 block">In Stock Only</span>
            <span className="text-[10px] text-slate-500 block">Exclude back-ordered items</span>
          </div>

          <div
            onClick={() => onToggleInStock(!inStockOnly)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              inStockOnly ? 'bg-slate-900' : 'bg-slate-200'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                inStockOnly ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </label>
      </div>

    </aside>
  );
};
