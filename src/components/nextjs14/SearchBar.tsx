'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, ArrowRight } from 'lucide-react';

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
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Wireless ANC Headphones',
    'Titanium Chronograph',
    'Smart Ambient Luminaire',
    'Mechanical Keyboards'
  ]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Suggested keywords based on input
  const suggestions = [
    'Aura Sound Pro Headphones',
    'Noise cancelling studio monitors',
    'Chronos Titanium Watch',
    'Swiss automatic movement 70h',
    'Hygge Arch Smart Lamp',
    'Minimalist oak desk accessories'
  ].filter(item => item.toLowerCase().includes(query.toLowerCase()));

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

  const handleSelectSuggestion = (val: string) => {
    setQuery(val);
    onSearch(val, selectedCategory);
    setIsOpen(false);
  };

  return (
    <div ref={searchContainerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full bg-white rounded-lg border-2 border-slate-900 overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-amber-500/50 transition-all"
      >
        {/* Category Prefix Selector (Classic Amazon-like UX, refined) */}
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

        {/* Input Field */}
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
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

      {/* Autocomplete & Recents Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden text-xs">
          {query.trim().length === 0 ? (
            <div className="p-3">
              <div className="flex items-center justify-between text-slate-400 font-semibold px-2 py-1 text-[11px] uppercase tracking-wider">
                <span>Recent Searches</span>
              </div>
              <div className="divide-y divide-slate-100">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(term)}
                    className="w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-left"
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
            <div className="p-2">
              <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                Suggestions in {selectedCategory === 'all' ? 'All Departments' : categories.find(c => c.id === selectedCategory)?.name}
              </div>
              {suggestions.length > 0 ? (
                suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-800 hover:bg-slate-50 rounded-lg text-left font-medium"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-slate-500 italic">
                  Press enter to search for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
