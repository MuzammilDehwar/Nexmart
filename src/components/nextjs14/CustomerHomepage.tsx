'use client';

import React, { useState, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { SearchBar } from './SearchBar';
import { CategoryNav } from './CategoryNav';
import { ProductCard, ProductData } from './ProductCard';
import { SidebarFilter } from './SidebarFilter';
import { CartDrawer } from './CartDrawer';
import { 
  ShoppingBag, 
  Sparkles, 
  SlidersHorizontal, 
  X, 
  ArrowUpDown, 
  Check, 
  RotateCcw,
  Package,
  Heart
} from 'lucide-react';

import { SAMPLE_NEXTJS_PRODUCTS } from '../../data/sampleProducts';
import { RewardsReferralPanel, VisualSearchPanel } from '../phase1/Phase1CommerceTools';
export { SAMPLE_NEXTJS_PRODUCTS } from '../../data/sampleProducts';
export const CustomerHomepage: React.FC = () => {
  const { products, addToCart, setIsCartDrawerOpen, cartCount, setCurrentView, setSelectedProductId, orders, productSyncState, orderSyncState } = useCart();
  
  // Search & Category state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sidebar Filter States
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Sorting Option
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'reviews-desc' | 'name-asc'>('featured');

  // Mobile Filter Drawer Toggle
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const syncNotice = productSyncState === 'permission-denied'
    ? 'Firebase catalog access was denied. Showing the local demo catalogue while rules or claims are configured.'
    : productSyncState === 'offline'
      ? 'Firebase catalog is offline. Showing the local demo catalogue.'
      : orderSyncState === 'permission-denied'
        ? 'Your Firebase order access was denied. No protected orders are shown.'
        : null;
  const categories = [
    { id: 'audio', name: 'Audio Hardware', slug: 'audio-hardware', isHot: true },
    { id: 'watches', name: 'Watches & Precision', slug: 'watches-precision' },
    { id: 'interior', name: 'Interior & Lighting', slug: 'interior-lighting' },
    { id: 'keyboards', name: 'Mechanical Keyboards', slug: 'keyboards' },
  ];

  // Extract unique brands with dynamic counts
  const availableBrands = useMemo(() => {
    const brandMap: { [b: string]: number } = {};
    products.forEach((p) => {
      const b = p.brand || p.storeName;
      brandMap[b] = (brandMap[b] || 0) + 1;
    });
    return Object.entries(brandMap).map(([name, count]) => ({ name, count }));
  }, [products]);

  // Brand toggle handler
  const handleToggleBrand = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setMaxPrice(1200);
    setMinRating(0);
    setSelectedBrands([]);
    setInStockOnly(false);
    setSearchQuery('');
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (maxPrice < 1200) count++;
    if (minRating > 0) count++;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (inStockOnly) count++;
    if (searchQuery.trim().length > 0) count++;
    return count;
  }, [maxPrice, minRating, selectedBrands, inStockOnly, searchQuery]);

  // Comprehensive Filter & Sort Pipeline
  const filteredAndSortedProducts = useMemo(() => {
    // 1. Filter
    let list = products.filter((prod) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (prod.category && prod.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        (prod.categorySlug && prod.categorySlug.includes(selectedCategory.toLowerCase())) ||
        (selectedCategory === 'audio' && (prod.slug.includes('headphones') || prod.slug.includes('audio') || prod.category?.toLowerCase().includes('audio'))) ||
        (selectedCategory === 'watches' && (prod.slug.includes('watch') || prod.slug.includes('horology') || prod.category?.toLowerCase().includes('watch'))) ||
        (selectedCategory === 'interior' && (prod.slug.includes('lamp') || prod.slug.includes('interior') || prod.slug.includes('desk') || prod.category?.toLowerCase().includes('interior'))) ||
        (selectedCategory === 'keyboards' && (prod.slug.includes('keyboard') || prod.category?.toLowerCase().includes('keyboard')));

      if (!matchesCategory) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          prod.title.toLowerCase().includes(q) ||
          prod.brand.toLowerCase().includes(q) ||
          prod.storeName.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Price ceiling match (check basePrice or lowest variant)
      const lowestPrice = Math.min(prod.basePrice, ...prod.variants.map((v) => v.price));
      if (lowestPrice > maxPrice) return false;

      // Star rating match
      if (minRating > 0 && prod.ratingAverage < minRating) return false;

      // Brand match
      if (selectedBrands.length > 0 && !selectedBrands.includes(prod.brand) && !selectedBrands.includes(prod.storeName)) {
        return false;
      }

      // In-stock match
      if (inStockOnly) {
        const totalStock = prod.variants.reduce((acc, v) => acc + v.inventoryQty, 0);
        if (totalStock <= 0) return false;
      }

      // Catalog Governance: Only admin-approved products appear live on the Customer Storefront
      if (prod.approvalStatus && prod.approvalStatus !== 'approved') {
        return false;
      }

      return true;
    });

    // 2. Sort
    return list.sort((a, b) => {
      const priceA = Math.min(a.basePrice, ...a.variants.map((v) => v.price));
      const priceB = Math.min(b.basePrice, ...b.variants.map((v) => v.price));

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating-desc') return b.ratingAverage - a.ratingAverage;
      if (sortBy === 'reviews-desc') return b.ratingCount - a.ratingCount;
      if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
      return 0; // 'featured'
    });
  }, [products, selectedCategory, searchQuery, maxPrice, minRating, selectedBrands, inStockOnly, sortBy]);

  const handleOpenProduct = (product: ProductData) => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
  };

  return (
    <div className="bg-slate-100 min-h-screen text-slate-900 flex flex-col justify-between">
      <div>
        {/* Amazon-style Refined Top Header */}
        <header className="bg-slate-950 text-white sticky top-0 z-40 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4 md:gap-8">
            
            {/* Brand Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold font-display text-lg">
                N
              </div>
              <span className="font-bold font-display text-lg tracking-tight text-white hidden sm:inline">
                NexMart
              </span>
            </div>

            {/* Instant Live-Search Bar */}
            <div className="flex-1 max-w-3xl">
              <SearchBar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onSearch={(q, cat) => {
                  setSearchQuery(q);
                  setSelectedCategory(cat);
                }}
              />
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3 shrink-0 text-xs">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-[11px] text-slate-400">Deliver to</span>
                <span className="font-bold text-white">San Francisco 94107</span>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => setCurrentView('wishlist')}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-700 hover:border-rose-400 rounded-lg text-white font-medium transition-all"
                title="View saved products"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">Wishlist</span>
              </button>

              {/* My Orders Button */}
              <button
                onClick={() => setCurrentView('orders')}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-700 hover:border-amber-400 rounded-lg text-white font-medium transition-all"
                title="View your orders and track shipments"
              >
                <Package className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Orders</span>
                {orders.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-slate-800 text-amber-300 rounded text-[10px] font-mono font-bold">
                    {orders.length}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-700 hover:border-amber-400 rounded-lg text-white font-bold transition-all"
                aria-label="View Shopping Bag"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Bag</span>
              </button>
            </div>

          </div>

          {/* Department Navigation Bar */}
          <CategoryNav
            categories={categories}
            activeCategory={selectedCategory}
            onSelectCategory={(id) => {
              setSelectedCategory(id);
              setSelectedBrands([]); // reset brand filter on category shift
            }}
          />
        </header>

        {/* Hero Banner Section */}
        <section className="relative bg-slate-950 text-white overflow-hidden py-12 md:py-16 px-4 md:px-6">
          <img
            src="/src/assets/images/hero_marketplace_showcase_1792380848955.jpg"
            alt="Flagship Showcase"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto space-y-2.5">
            <div className="flex items-center gap-2 text-[11px] text-amber-400 font-bold tracking-[0.18em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated by NexMart</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-display tracking-[-0.04em] text-white max-w-2xl leading-[1.05]">
              The best gear, from the people who make it.
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
              Discover design-led electronics, precision accessories, and everyday upgrades from verified independent sellers.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button onClick={() => setSelectedCategory('all')} className="rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300">Shop the collection</button>
              <button onClick={() => setSelectedCategory('audio')} className="rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/15">Explore audio</button>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-6 text-[11px] font-semibold text-slate-300">
              <span><strong className="text-white">Verified</strong> sellers</span>
              <span><strong className="text-white">Curated</strong> catalogue</span>
              <span><strong className="text-white">Tracked</strong> delivery</span>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-5">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-3">
            <RewardsReferralPanel />
            <VisualSearchPanel />
          </div>
        </section>

        {syncNotice && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 pt-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
              <strong className="text-slate-900">Catalog status:</strong> {syncNotice}
            </div>
          </div>
        )}

        {/* 2-Column Catalog Layout: Sidebar Left, Grid Right */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Desktop Left Sidebar Filter (lg:col-span-3) */}
            <div className="hidden lg:block lg:col-span-3 sticky top-24">
              <SidebarFilter
                maxPrice={maxPrice}
                onPriceChange={setMaxPrice}
                minRating={minRating}
                onRatingChange={setMinRating}
                selectedBrands={selectedBrands}
                onToggleBrand={handleToggleBrand}
                availableBrands={availableBrands}
                inStockOnly={inStockOnly}
                onToggleInStock={setInStockOnly}
                onResetFilters={handleResetFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>

            {/* Main Product Catalog Section (lg:col-span-9) */}
            <div className="lg:col-span-9 space-y-5">
              
              {/* Header Sorting & Mobile Filter Bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
                
                {/* Result Counts & Mobile Filter Trigger */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters ({activeFilterCount})</span>
                  </button>

                  <div className="text-slate-600">
                    Showing <strong className="text-slate-900 font-mono">{filteredAndSortedProducts.length}</strong> of {products.length} products
                  </div>
                </div>

                {/* Sorting Dropdown (Price Low/High, Rating, Reviews, Newest) */}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-slate-500 font-medium">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="p-2 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 cursor-pointer appearance-none focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="featured">Featured / Relevant</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating-desc">Highest Customer Rating (★)</option>
                      <option value="reviews-desc">Most Popular (Review Count)</option>
                      <option value="name-asc">Product Name (A - Z)</option>
                    </select>
                    <div className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400 text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>

              </div>

              {/* Mobile Filter Drawer (Collapsible) */}
              {isMobileFilterOpen && (
                <div className="lg:hidden p-4 bg-white rounded-xl border border-slate-200 shadow-md">
                  <SidebarFilter
                    maxPrice={maxPrice}
                    onPriceChange={setMaxPrice}
                    minRating={minRating}
                    onRatingChange={setMinRating}
                    selectedBrands={selectedBrands}
                    onToggleBrand={handleToggleBrand}
                    availableBrands={availableBrands}
                    inStockOnly={inStockOnly}
                    onToggleInStock={setInStockOnly}
                    onResetFilters={handleResetFilters}
                    activeFilterCount={activeFilterCount}
                  />
                </div>
              )}

              {/* Active Filter Chips Bar */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl text-xs">
                  <span className="text-slate-400 font-medium text-[11px]">Active Filters:</span>

                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-semibold transition-colors"
                    >
                      <span>Query: "{searchQuery}"</span>
                      <X className="w-3 h-3 text-slate-500" />
                    </button>
                  )}

                  {maxPrice < 1200 && (
                    <button
                      onClick={() => setMaxPrice(1200)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-semibold transition-colors"
                    >
                      <span>Price ≤ ${maxPrice}</span>
                      <X className="w-3 h-3 text-slate-500" />
                    </button>
                  )}

                  {minRating > 0 && (
                    <button
                      onClick={() => setMinRating(0)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-semibold transition-colors"
                    >
                      <span>Rating ≥ {minRating}★</span>
                      <X className="w-3 h-3 text-slate-500" />
                    </button>
                  )}

                  {selectedBrands.map((b) => (
                    <button
                      key={b}
                      onClick={() => handleToggleBrand(b)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-semibold transition-colors"
                    >
                      <span>Brand: {b}</span>
                      <X className="w-3 h-3 text-slate-500" />
                    </button>
                  ))}

                  {inStockOnly && (
                    <button
                      onClick={() => setInStockOnly(false)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-semibold transition-colors"
                    >
                      <span>In Stock Only</span>
                      <X className="w-3 h-3 text-slate-500" />
                    </button>
                  )}

                  <button
                    onClick={handleResetFilters}
                    className="ml-auto text-amber-700 hover:text-amber-900 font-semibold text-[11px] underline"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(prodId, varId) => addToCart(prodId, varId, 1)}
                    onQuickView={handleOpenProduct}
                  />
                ))}
              </div>

              {/* Empty Results State */}
              {filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200 p-8 space-y-4 shadow-2xs">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <SlidersHorizontal className="w-6 h-6 stroke-1" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      We couldn't find any products matching your current combination of price, star rating, and brand filters.
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              )}

            </div>

          </div>
        </main>
      </div>

      {/* Slide-Over Cart Drawer */}
      <CartDrawer />
    </div>
  );
};
