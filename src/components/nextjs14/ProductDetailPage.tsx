'use client';

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { SAMPLE_NEXTJS_PRODUCTS } from '../../data/sampleProducts';
import { 
  Star, 
  Truck, 
  ShieldCheck, 
  Check, 
  ShoppingBag, 
  ArrowLeft, 
  Store, 
  RotateCcw, 
  Zap, 
  Share2, 
  Sparkles,
  MessageSquare
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { products, selectedProductId, addToCart, setCurrentView } = useCart();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Gallery images (simulated multi-angle assets)
  const galleryImages = [
    product.primaryImage,
    '/src/assets/images/hero_marketplace_showcase_1792380848955.jpg',
    product.primaryImage,
  ];

  const currentVariant = product.variants[selectedVariantIdx] || product.variants[0];

  const handleAddToCart = () => {
    addToCart(product.id, currentVariant.id, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product.id, currentVariant.id, quantity);
    setCurrentView('checkout');
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      
      {/* Breadcrumb & Back Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-1 text-slate-700 hover:text-slate-950 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
            <span aria-hidden="true">/</span>
            <span>Departments</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-slate-800">{product.brand}</span>
            <span aria-hidden="true">/</span>
            <span className="truncate max-w-[200px] text-slate-400">{product.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400">SKU: {currentVariant.sku}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-12">
        
        {/* Main PDP Grid: Gallery Left, Contiguous Purchase Module Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Gallery (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary High-Resolution Frame */}
            <div className="relative aspect-4/3 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex items-center justify-center">
              <img
                src={galleryImages[selectedImageIdx]}
                alt={product.title}
                className="w-full h-full object-cover transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold text-slate-900 shadow-2xs">
                Verified Artisan Hardware
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-white ${
                    selectedImageIdx === idx
                      ? 'border-slate-900 shadow-sm scale-102'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Technical Specifications Matrix */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs mt-8">
              <h3 className="font-bold font-display text-slate-900 text-base">
                Engineering Specifications & Compliance
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Primary Material</span>
                  <span className="font-semibold text-slate-800">Aero-Grade Titanium & Nappa Leather</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Acoustic Tuning</span>
                  <span className="font-semibold text-slate-800">Hi-Res LDAC Lossless 48kHz/24bit</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Battery & Charging</span>
                  <span className="font-semibold text-slate-800">48 Hours (Fast Charge: 10m = 5h)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Warranty Guarantee</span>
                  <span className="font-semibold text-slate-800">2-Year International Manufacturer Warranty</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              
              {/* Brand & Store Link */}
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Store className="w-3.5 h-3.5 text-slate-600" />
                  <span>Store: {product.storeName}</span>
                </div>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Merchant</span>
                </span>
              </div>

              {/* Title & Rating */}
              <div className="space-y-2">
                <h1 className="text-xl md:text-2xl font-bold font-display text-slate-900 leading-tight">
                  {product.title}
                </h1>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-slate-800 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.ratingAverage.toFixed(1)}</span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500 font-medium">
                    {product.ratingCount} Verified Reviews
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-purple-700 font-semibold">100% Genuine</span>
                </div>
              </div>

              {/* Dynamic Price Display */}
              <div className="space-y-1 pt-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
                    ${currentVariant.price.toFixed(2)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                  {product.compareAtPrice && (
                    <span className="text-xs font-bold text-rose-600">
                      Save ${(product.compareAtPrice - currentVariant.price).toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Sales tax calculated at checkout. Multi-currency settlement supported.
                </p>
              </div>

              {/* Color & Variant Selector */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>Color Edition: <span className="text-slate-600 font-normal">{currentVariant.colorName}</span></span>
                  <span className="text-slate-500 font-mono text-[11px]">{currentVariant.sku}</span>
                </div>

                <div className="flex items-center gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIdx(idx)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        selectedVariantIdx === idx
                          ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/40"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span>{v.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status Indicator */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[11px]">Availability Status</span>
                  {currentVariant.inventoryQty <= 5 ? (
                    <span className="font-bold text-rose-700">
                      Only {currentVariant.inventoryQty} units remaining — Order soon
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-800">
                      In Stock ({currentVariant.inventoryQty} units available)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{product.deliveryDays}</span>
                </div>
              </div>

              {/* Quantity Stepper & Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-slate-700">Quantity:</label>
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold font-mono text-slate-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(currentVariant.inventoryQty, quantity + 1))}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>1-Click Buy Now</span>
                  </button>
                </div>
              </div>

              {/* Trust Safeguards */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Stripe Escrow: Merchant paid only after verified postal delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>30-Day Hassle-Free Returns with automated prepaid return label</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Customer Reviews & Social Proof */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">
                Verified Customer Reviews & Unboxing
              </h2>
              <p className="text-xs text-slate-500">
                100% cryptographically verified purchases tied to delivered tracking hashes
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold font-display text-slate-900">
                {product.ratingAverage.toFixed(1)} <span className="text-sm text-slate-400 font-normal">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Sample Verified Reviews */}
          <div className="space-y-4 divide-y divide-slate-100">
            <div className="pt-4 first:pt-0 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">Marcus Lindqvist</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold text-[10px]">
                    Verified Buyer · Delivery Scan Oct 14
                  </span>
                </div>
                <span className="text-slate-400">4 days ago</span>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <h4 className="font-bold text-slate-800 text-sm">
                Incredible build quality, miles ahead of mass-market plastic headphones.
              </h4>

              <p className="text-slate-600 leading-relaxed">
                The titanium hinges and tactile volume dials feel like precision horology. Noise cancellation completely silenced my train commute, and the multi-vendor split package arrived safely via DHL within 24 hours.
              </p>
            </div>

            <div className="pt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">Clara Beauchamp</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold text-[10px]">
                    Verified Buyer · Delivery Scan Oct 11
                  </span>
                </div>
                <span className="text-slate-400">1 week ago</span>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <h4 className="font-bold text-slate-800 text-sm">
                Battery lasts easily past the advertised 48 hours.
              </h4>

              <p className="text-slate-600 leading-relaxed">
                Charged it once when it arrived, used it through 4 full working days of Zoom calls and Spotify lossless streaming. Highly recommend this merchant!
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
