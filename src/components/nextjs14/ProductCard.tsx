'use client';

import React, { useEffect, useState } from 'react';
import { Star, Truck, Check, ShoppingBag, Eye, Heart } from 'lucide-react';

const WISHLIST_STORAGE_KEY = 'nexmart_wishlist_v1';
const WISHLIST_UPDATED_EVENT = 'nexmart:wishlist-updated';

function readWishlistIds(): string[] {
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function saveWishlistIds(ids: string[]) {
  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([...new Set(ids)]));
    window.dispatchEvent(new Event(WISHLIST_UPDATED_EVENT));
  } catch {
    // Wishlist remains usable for the current render if browser storage is unavailable.
  }
}

export interface ProductVariantData {
  id: string;
  sku: string;
  title: string;
  colorName: string;
  colorHex: string;
  price: number;
  inventoryQty: number;
  imageUrl?: string;
}

export interface ProductData {
  id: string;
  title: string;
  slug: string;
  brand: string;
  storeName: string;
  storeSlug: string;
  vendorUid?: string;
  basePrice: number;
  compareAtPrice?: number;
  ratingAverage: number;
  ratingCount: number;
  primaryImage: string;
  deliveryDays: string;
  category?: string;
  categorySlug?: string;
  approvalStatus?: 'approved' | 'pending' | 'rejected';
  rejectionReason?: string;
  variants: ProductVariantData[];
}

interface ProductCardProps {
  product: ProductData;
  onAddToCart: (productId: string, variantId: string) => void;
  onQuickView?: (product: ProductData) => void;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const syncWishlist = () => setIsWishlisted(readWishlistIds().includes(product.id));
    syncWishlist();
    window.addEventListener('storage', syncWishlist);
    window.addEventListener(WISHLIST_UPDATED_EVENT, syncWishlist);
    return () => {
      window.removeEventListener('storage', syncWishlist);
      window.removeEventListener(WISHLIST_UPDATED_EVENT, syncWishlist);
    };
  }, [product.id]);

  const toggleWishlist = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const ids = readWishlistIds();
    const nextIds = ids.includes(product.id)
      ? ids.filter((id) => id !== product.id)
      : [...ids, product.id];
    saveWishlistIds(nextIds);
    setIsWishlisted(nextIds.includes(product.id));
  };

  const currentVariant = product.variants[selectedVariantIndex] || {
    id: 'default',
    sku: 'DEF-01',
    title: 'Standard',
    colorName: 'Default',
    colorHex: '#334155',
    price: product.basePrice,
    inventoryQty: 25,
  };

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - currentVariant.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCartClick = () => {
    onAddToCart(product.id, currentVariant.id);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      
      {/* Top Media Container */}
      <div 
        onClick={() => onQuickView && onQuickView(product)}
        className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={currentVariant.imageUrl || product.primaryImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/src/assets/images/hero_marketplace_showcase_1792380848955.jpg';
          }}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.approvalStatus === 'pending' && (
            <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded shadow-xs border border-amber-300">
              Admin Review Pending
            </span>
          )}
          {product.approvalStatus === 'rejected' && (
            <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs">
              Rejected by Admin
            </span>
          )}
          {discountPercent > 0 && product.approvalStatus !== 'pending' && (
            <span className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Persistent Wishlist Toggle */}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isWishlisted}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 z-10 rounded-full bg-white/95 p-2 text-slate-700 shadow-sm transition-colors hover:bg-white"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-xs p-1.5 rounded-lg text-slate-800 shadow-sm hover:bg-white"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Store / Vendor Metadata */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700 truncate max-w-[160px]">
              {product.storeName}
            </span>
            <span className="text-[11px] text-slate-400">·</span>
            <div className="flex items-center gap-1 text-slate-700 font-semibold shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.ratingAverage.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({product.ratingCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView && onQuickView(product)}
            className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors cursor-pointer"
          >
            {product.title}
          </h3>

          {/* Variant Swatches */}
          {product.variants.length > 1 && (
            <div className="pt-1 flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-medium mr-1">
                {currentVariant.colorName}:
              </span>
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedVariantIndex === idx
                      ? 'ring-2 ring-slate-900 ring-offset-1 border-white scale-110'
                      : 'border-slate-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                  title={`${v.colorName} - $${v.price}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Stock Status */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold font-display text-slate-900 tabular-nums">
              ${currentVariant.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Inventory & Shipping Info */}
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-emerald-700 font-medium">
              <Truck className="w-3.5 h-3.5" />
              <span>{product.deliveryDays}</span>
            </div>

            {currentVariant.inventoryQty <= 5 ? (
              <span className="text-rose-700 font-bold">
                Only {currentVariant.inventoryQty} left
              </span>
            ) : (
              <span className="text-slate-500">
                In Stock ({currentVariant.inventoryQty})
              </span>
            )}
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCartClick}
            disabled={currentVariant.inventoryQty === 0}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : currentVariant.inventoryQty === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-500 text-slate-950 hover:shadow-xs'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Added to Bag</span>
              </>
            ) : currentVariant.inventoryQty === 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProductCard = React.memo(ProductCardComponent);
