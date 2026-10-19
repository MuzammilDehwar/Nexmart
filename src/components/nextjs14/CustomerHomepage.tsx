import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { SearchBar } from './SearchBar';
import { CategoryNav } from './CategoryNav';
import { ProductCard, ProductData } from './ProductCard';
import { CartDrawer } from './CartDrawer';
import { ShoppingBag, Sparkles, ShieldCheck, Zap, X } from 'lucide-react';

export const SAMPLE_NEXTJS_PRODUCTS: ProductData[] = [
  {
    id: 'prod-001',
    title: 'Aura Sound Pro Wireless Over-Ear Active Noise Cancelling Headphones',
    slug: 'aura-sound-pro-wireless-headphones',
    brand: 'Lumina Audio',
    storeName: 'Lumina Audio Labs',
    storeSlug: 'lumina-audio',
    basePrice: 349.00,
    compareAtPrice: 399.00,
    ratingAverage: 4.9,
    ratingCount: 312,
    primaryImage: '/src/assets/images/product_headphones_studio_1792380849129.jpg',
    deliveryDays: 'Tomorrow, Free Express',
    variants: [
      {
        id: 'var-001',
        sku: 'AUR-GRY-01',
        title: 'Space Gray',
        colorName: 'Space Gray',
        colorHex: '#475569',
        price: 349.00,
        inventoryQty: 42,
        imageUrl: '/src/assets/images/product_headphones_studio_1792380849129.jpg'
      },
      {
        id: 'var-002',
        sku: 'AUR-BLK-02',
        title: 'Midnight Obsidian',
        colorName: 'Midnight',
        colorHex: '#0f172a',
        price: 369.00,
        inventoryQty: 3,
        imageUrl: '/src/assets/images/product_headphones_studio_1792380849129.jpg'
      }
    ]
  },
  {
    id: 'prod-002',
    title: 'Chronos Horizon Titanium Automatic Chronograph Wristwatch',
    slug: 'chronos-horizon-titanium-watch',
    brand: 'Vanguard Horology',
    storeName: 'Vanguard Horology',
    storeSlug: 'vanguard-horology',
    basePrice: 880.00,
    compareAtPrice: 950.00,
    ratingAverage: 5.0,
    ratingCount: 88,
    primaryImage: '/src/assets/images/product_mechanical_watch_1792380849996.jpg',
    deliveryDays: '2-Day Priority Insured',
    variants: [
      {
        id: 'var-003',
        sku: 'CHR-TIT-01',
        title: 'Brushed Titanium',
        colorName: 'Brushed Titanium',
        colorHex: '#94a3b8',
        price: 880.00,
        inventoryQty: 14,
        imageUrl: '/src/assets/images/product_mechanical_watch_1792380849996.jpg'
      },
      {
        id: 'var-004',
        sku: 'CHR-DLC-02',
        title: 'Diamond-Like Carbon (DLC)',
        colorName: 'Matte DLC',
        colorHex: '#1e293b',
        price: 920.00,
        inventoryQty: 2,
        imageUrl: '/src/assets/images/product_mechanical_watch_1792380849996.jpg'
      }
    ]
  },
  {
    id: 'prod-003',
    title: 'Hygge Arch Smart Ambient Desk Luminaire with Circadian Sync',
    slug: 'hygge-arch-smart-desk-lamp',
    brand: 'Nordic Craft',
    storeName: 'Nordic Craft Collective',
    storeSlug: 'nordic-craft',
    basePrice: 210.00,
    compareAtPrice: 240.00,
    ratingAverage: 4.8,
    ratingCount: 154,
    primaryImage: '/src/assets/images/product_smart_lamp_1792380850295.jpg',
    deliveryDays: 'Standard 2-3 Days',
    variants: [
      {
        id: 'var-005',
        sku: 'HYG-BRS-01',
        title: 'Satin Brass',
        colorName: 'Satin Brass',
        colorHex: '#d97706',
        price: 210.00,
        inventoryQty: 63,
        imageUrl: '/src/assets/images/product_smart_lamp_1792380850295.jpg'
      },
      {
        id: 'var-006',
        sku: 'HYG-BLK-02',
        title: 'Matte Charcoal',
        colorName: 'Matte Charcoal',
        colorHex: '#334155',
        price: 195.00,
        inventoryQty: 19,
        imageUrl: '/src/assets/images/product_smart_lamp_1792380850295.jpg'
      }
    ]
  }
];

export const CustomerHomepage: React.FC = () => {
  const { addToCart, setIsCartDrawerOpen, cartCount, setCurrentView, setSelectedProductId } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'audio', name: 'Audio Hardware', slug: 'audio-hardware', isHot: true },
    { id: 'watches', name: 'Watches & Precision', slug: 'watches-precision' },
    { id: 'interior', name: 'Interior & Lighting', slug: 'interior-lighting' },
    { id: 'keyboards', name: 'Mechanical Keyboards', slug: 'keyboards' },
  ];

  const filteredProducts = SAMPLE_NEXTJS_PRODUCTS.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'audio' && prod.slug.includes('headphones')) ||
      (selectedCategory === 'watches' && prod.slug.includes('watch')) ||
      (selectedCategory === 'interior' && prod.slug.includes('lamp'));

    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.storeName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleOpenProduct = (product: ProductData) => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
  };

  return (
    <div className="bg-slate-100 min-h-screen text-slate-900 flex flex-col justify-between">
      <div>
        {/* Amazon-style Refined Header */}
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

            {/* Amazon-grade Search Bar */}
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
            <div className="flex items-center gap-4 shrink-0 text-xs">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-[11px] text-slate-400">Deliver to</span>
                <span className="font-bold text-white">San Francisco 94107</span>
              </div>

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
            onSelectCategory={setSelectedCategory}
          />
        </header>

        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white overflow-hidden py-10 md:py-14 px-4 md:px-6">
          <img
            src="/src/assets/images/hero_marketplace_showcase_1792380848955.jpg"
            alt="Flagship Showcase"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto space-y-3">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 1 Production Storefront</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold font-display tracking-tight text-white max-w-2xl">
              Next.js 14 App Router Storefront
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Featuring Amazon-grade instant search autocompletion, real-time inventory variant switching, and verified multi-vendor fulfillment logic.
            </p>
          </div>
        </section>

        {/* Product Catalog Grid Container */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900">
                {selectedCategory === 'all'
                  ? 'Featured Verified Products'
                  : categories.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-xs text-slate-500">
                Showing {filteredProducts.length} verified merchant listings · Click any item for details
              </p>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold underline"
              >
                Clear filter: "{searchQuery}"
              </button>
            )}
          </div>

          {/* 3-Column Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(prodId, varId) => addToCart(prodId, varId, 1)}
                onQuickView={handleOpenProduct}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 space-y-2">
              <p className="text-sm font-semibold text-slate-700">No matching products found</p>
              <p className="text-xs text-slate-500">Try adjusting your search query or department filter.</p>
            </div>
          )}
        </main>
      </div>

      {/* Slide-Over Cart Drawer */}
      <CartDrawer />
    </div>
  );
};
