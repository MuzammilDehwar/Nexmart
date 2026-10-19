'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Search, X, Clock, ArrowRight, Star, Sparkles } from 'lucide-react';
import { ProductData } from './ProductCard';

export interface SearchBarProps {
  categories: { id: string; name: string }[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onSearch: (query: string, category: string) => void;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onSearch,
  autoFocus = false,
}) => {
  const { products, setSelectedProductId, setCurrentView } = useCart();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Wireless ANC Headphones',
    'Titanium Chronograph',
    'Smart Ambient Luminaire',
    'Mechanical Keyboards'
  ]);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Live matching products
  const matchingProducts = query.trim().length > 0
    ? products.filter(p => {
        const matchesCategory = selectedCategory === 'all' || 
          p.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          p.brand.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesText = p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.storeName.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesText;
      }).slice(0, 3)
    : [];

  // Live suggested keywords derived from matching items
  const suggestedKeywords = query.trim().length > 0
    ? [
        query,
        `${query} in ${selectedCategory === 'all' ? 'All Departments' : categories.find(c => c.id === selectedCategory)?.name || 'Catalog'}`,
        ...products
          .filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()))
          .map(p => p.brand)
      ]
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 4)
    : [];

  const totalInteractiveCount = matchingProducts.length + suggestedKeywords.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (!recentSearches.includes(query)) {
        setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
      }
      onSearch(query, selectedCategory);
      setIsOpen(false);
    }
  };

  const handleSelectKeyword = (val: string) => {
    setQuery(val);
    onSearch(val, selectedCategory);
    setIsOpen(false);
  };

  const handleSelectProduct = (product: ProductData) => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < totalInteractiveCount - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : totalInteractiveCount - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      if (selectedIndex < matchingProducts.length) {
        handleSelectProduct(matchingProducts[selectedIndex]);
      } else {
        const keywordIdx = selectedIndex - matchingProducts.length;
        if (suggestedKeywords[keywordIdx]) {
          handleSelectKeyword(suggestedKeywords[keywordIdx]);
        }
      }
    }
  };

  return (
    <div ref={searchContainerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full bg-white rounded-lg border-2 border-slate-900 overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-amber-500/50 transition-all"
      >
        {/* Department Prefix Selector */}
        <div className="relative shrink-0 border-r border-slate-200 bg-slate-100 hover:bg-slate-200 transition-colors">
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="h-11 px-3.5 pr-7 text-xs font-semibold text-slate-800 bg-transparent cursor-pointer appearance-none focus:outline-hidden"
          >
            <option value="all">All Departments</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-3.5 pointer-events-none text-slate-500 text-[10px]">
            ▼
          </div>
        </div>

        {/* Input Field with Live Instant Feedback */}
        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
              onSearch(e.target.value, selectedCategory);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, verified brands, and SKU specifications..."
            autoFocus={autoFocus}
            className="w-full h-11 px-4 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                onSearch('', selectedCategory);
                setIsOpen(false);
              }}
              className="p-1.5 mr-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Submit Search Button */}
        <button
          type="submit"
          className="h-11 px-5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold transition-colors flex items-center justify-center shrink-0"
          aria-label="Search"
        >
          <Search className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>

      {/* Instant Live-Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden text-xs divide-y divide-slate-100 animate-in fade-in-50 duration-150">
          
          {query.trim().length === 0 ? (
            /* Recents View */
            <div className="p-3">
              <div className="flex items-center justify-between text-slate-400 font-semibold px-2 py-1 text-[11px] uppercase tracking-wider">
                <span>Recent Searches</span>
              </div>
              <div className="divide-y divide-slate-100">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectKeyword(term)}
                    className="w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{term}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-2 space-y-3">
              
              {/* 1. Live Matching Product Cards */}
              {matchingProducts.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider flex items-center justify-between">
                    <span>Products ({matchingProducts.length})</span>
                    <span className="text-[10px] text-amber-700 font-bold">Instant Jump</span>
                  </div>

                  {matchingProducts.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectProduct(p)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                        selectedIndex === idx
                          ? 'bg-amber-50 text-slate-900 ring-1 ring-amber-300'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <img
                        src={p.primaryImage}
                        alt={p.title}
                        className="w-10 h-10 rounded-md object-cover border border-slate-200 shrink-0 bg-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate text-xs text-slate-900">{p.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>{p.brand}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 text-amber-700 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {p.ratingAverage.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-xs text-slate-900 tabular-nums">
                        ${p.basePrice.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 2. Suggested Queries */}
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  Keywords
                </div>
                {suggestedKeywords.map((term, idx) => {
                  const globalIdx = matchingProducts.length + idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectKeyword(term)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-colors ${
                        selectedIndex === globalIdx
                          ? 'bg-amber-50 text-slate-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        <strong>{query}</strong>{term.slice(query.length)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {matchingProducts.length === 0 && suggestedKeywords.length === 0 && (
                <div className="px-3 py-4 text-center text-slate-500 text-xs italic">
                  Press enter to search the full catalog for "{query}"
                </div>
              )}
            </div>
          )}

          {/* Quick Footer hint */}
          <div className="p-2 bg-slate-50 text-[10px] text-slate-400 flex items-center justify-between px-3">
            <span>Use ↑ ↓ to navigate · ↵ to select · ESC to close</span>
            <span className="text-amber-800 font-medium">Algolia / OpenSearch &lt;15ms</span>
          </div>

        </div>
      )}
    </div>
  );
};
