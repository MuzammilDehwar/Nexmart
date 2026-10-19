import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRISMA_SCHEMA_CODE } from '../data/prismaSchema';
import { CustomerHomepage } from './nextjs14/CustomerHomepage';
import { ProductDetailPage } from './nextjs14/ProductDetailPage';
import { CheckoutPage } from './nextjs14/CheckoutPage';
import { CartDrawer } from './nextjs14/CartDrawer';
import { 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  Eye, 
  Database, 
  Code2, 
  ShoppingBag, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

export const MvpImplementationView: React.FC = () => {
  const { currentView, setCurrentView, setSelectedProductId, setIsCartDrawerOpen, cartCount } = useCart();
  const [activeSubTab, setActiveSubTab] = useState<'preview' | 'prisma' | 'nextjs-code'>('preview');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedCodeFile, setSelectedCodeFile] = useState<
    'pdp' | 'cart-drawer' | 'checkout' | 'page' | 'context' | 'search' | 'card'
  >('pdp');

  const handleCopy = (content: string, label: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(label);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const CODE_SNIPPETS: { [key: string]: string } = {
    pdp: `// app/product/[id]/page.tsx - Dynamic Product Detail Page (Next.js 14 App Router)
import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/ProductGallery';
import { PurchaseModule } from '@/components/PurchaseModule';
import { CustomerReviews } from '@/components/CustomerReviews';
import { TechnicalSpecs } from '@/components/TechnicalSpecs';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: { title: true, description: true, brand: true },
  });
  if (!product) return {};
  return {
    title: \`\${product.title} - \${product.brand} | NexMart\`,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id, isPublished: true },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
          ratingAverage: true,
          ratingCount: true,
          status: true,
        },
      },
      variants: {
        orderBy: { price: 'asc' },
      },
      reviews: {
        where: { isVerifiedPurchase: true },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { fullName: true } } },
      },
    },
  });

  if (!product) notFound();

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-12">
        {/* Contiguous PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery Left */}
          <div className="lg:col-span-7 space-y-6">
            <ProductGallery images={product.images} title={product.title} />
            <TechnicalSpecs attributes={product.description} />
          </div>

          {/* Sticky Purchase Module Right */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            <PurchaseModule product={product} />
          </div>
        </div>

        {/* Verified Customer Reviews */}
        <CustomerReviews
          ratingAverage={Number(product.ratingAverage)}
          ratingCount={product.ratingCount}
          reviews={product.reviews}
        />
      </div>
    </div>
  );
}`,

    'cart-drawer': `// components/CartDrawer.tsx - Slide-over Multi-Vendor Cart Drawer
'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Store } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    cartCount,
    cartSubtotal,
    cartTax,
    cartShipping,
    cartTotal,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  // Group items by independent vendor package
  const vendorGroups = cart.reduce((acc, item) => {
    const key = item.product.storeName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof cart>);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-base">Shopping Bag ({cartCount})</h3>
          </div>
          <button onClick={() => setIsCartDrawerOpen(false)} className="p-1 text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vendor Grouped Packages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {Object.entries(vendorGroups).map(([vendorName, items], idx) => (
            <div key={vendorName} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex justify-between text-xs font-semibold">
                <span>Package {idx + 1}: {vendorName}</span>
                <span className="text-emerald-700">Verified Seller</span>
              </div>
              <div className="p-3.5 space-y-3 divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.variant.id} className="pt-3 first:pt-0 flex gap-3 text-xs">
                    <img src={item.variant.imageUrl} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">{item.product.title}</div>
                      <div className="text-slate-500">{item.variant.title} · \${item.variant.price}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.product.id, item.variant.id, -1)} className="px-2 border rounded">-</button>
                        <span className="font-mono font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.variant.id, 1)} className="px-2 border rounded">+</button>
                        <button onClick={() => removeFromCart(item.product.id, item.variant.id)} className="ml-auto text-slate-400 hover:text-rose-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Summary & Checkout Button */}
        <div className="p-5 border-t border-slate-200 bg-white space-y-3">
          <div className="flex justify-between text-sm font-bold text-slate-900">
            <span>Total Amount</span>
            <span className="font-mono">\${cartTotal.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={() => setIsCartDrawerOpen(false)}
            className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2"
          >
            <span>Proceed to 3-Step Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}`,

    checkout: `// app/checkout/page.tsx - 3-Step Multi-Vendor Checkout (Next.js 14 App Router)
'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Check, CreditCard, Truck, ShieldCheck, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod' | 'bnpl'>('stripe');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    // Call server action / API route to execute Postgres order splitting
    const res = await fetch('/api/orders/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, paymentMethod }),
    });
    const data = await res.json();
    setIsSubmitting(false);
    setConfirmedOrder(data.orderNumber || 'NXM-2026-9812');
    clearCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* 3-Step Wizard: 1. Address -> 2. Delivery -> 3. Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Address Card */}
          <div className="bg-white p-6 rounded-2xl border">...</div>
          {/* Step 2: Delivery Options Card */}
          <div className="bg-white p-6 rounded-2xl border">...</div>
          {/* Step 3: Payment Gateway Selector Card */}
          <div className="bg-white p-6 rounded-2xl border">...</div>
        </div>

        {/* Multi-Vendor Order Summary Sidebar */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border space-y-4">
          <h3 className="font-bold text-base">Order Summary</h3>
          <div className="font-mono text-xl font-bold">\${cartTotal.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}`,

    context: `// context/CartContext.tsx - Production Cart State Provider
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  price: number;
  quantity: number;
  storeName: string;
  imageUrl: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (variantId: string, delta: number) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexmart_cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('nexmart_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.variantId === item.variantId);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += item.quantity;
        return next;
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (variantId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.variantId === variantId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const cartTotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be within CartProvider');
  return ctx;
};`,
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Mode Selector */}
      <div className="bg-white border-b border-slate-200 py-4 px-6 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold font-display text-slate-900 text-sm">
              Phase 1 MVP: Complete Purchasing Flow
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">PDP + Cart Drawer + 3-Step Checkout</span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveSubTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'preview'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Interactive Flow Simulator</span>
            </button>

            <button
              onClick={() => setActiveSubTab('nextjs-code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'nextjs-code'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Next.js 14 Codebase Files</span>
            </button>

            <button
              onClick={() => setActiveSubTab('prisma')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'prisma'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Prisma Schema</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtab 1: Interactive Flow Simulator */}
      {activeSubTab === 'preview' && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-4">
          
          {/* Simulated App Router Browser URL Bar */}
          <div className="bg-slate-900 text-white rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-slate-400 font-mono text-[11px]">Next.js Route:</span>
              
              <button
                onClick={() => setCurrentView('home')}
                className={`px-2.5 py-1 rounded font-mono font-bold transition-all ${
                  currentView === 'home'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                / (Home Storefront)
              </button>

              <button
                onClick={() => {
                  setSelectedProductId('prod-001');
                  setCurrentView('product-detail');
                }}
                className={`px-2.5 py-1 rounded font-mono font-bold transition-all ${
                  currentView === 'product-detail'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                /product/prod-001 (PDP)
              </button>

              <button
                onClick={() => setCurrentView('checkout')}
                className={`px-2.5 py-1 rounded font-mono font-bold transition-all ${
                  currentView === 'checkout'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                /checkout (3-Step Flow)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Cart Drawer ({cartCount})</span>
              </button>
            </div>
          </div>

          {/* Active Screen Rendering */}
          <div className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden min-h-[600px]">
            {currentView === 'home' && <CustomerHomepage />}
            {currentView === 'product-detail' && <ProductDetailPage />}
            {currentView === 'checkout' && <CheckoutPage />}
          </div>

          {/* Persistent Cart Drawer */}
          <CartDrawer />
        </div>
      )}

      {/* Subtab 2: Next.js 14 Production Code Files */}
      {activeSubTab === 'nextjs-code' && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'pdp', label: 'app/product/[id]/page.tsx (PDP)' },
              { id: 'cart-drawer', label: 'components/CartDrawer.tsx' },
              { id: 'checkout', label: 'app/checkout/page.tsx (3-Step)' },
              { id: 'context', label: 'context/CartContext.tsx' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedCodeFile(f.id as any)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                  selectedCodeFile === f.id
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold font-mono text-xs text-slate-900">
                {selectedCodeFile === 'pdp' && 'app/product/[id]/page.tsx'}
                {selectedCodeFile === 'cart-drawer' && 'components/CartDrawer.tsx'}
                {selectedCodeFile === 'checkout' && 'app/checkout/page.tsx'}
                {selectedCodeFile === 'context' && 'context/CartContext.tsx'}
              </span>

              <button
                onClick={() => handleCopy(CODE_SNIPPETS[selectedCodeFile] || '', selectedCodeFile)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                {copiedFile === selectedCodeFile ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied File Content</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Production Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-6 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-[650px]">
              {CODE_SNIPPETS[selectedCodeFile]}
            </pre>
          </div>
        </div>
      )}

      {/* Subtab 3: Complete Prisma Schema */}
      {activeSubTab === 'prisma' && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
          <div className="bg-slate-900 text-slate-200 p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2 font-bold text-white">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>PRISMA POSTGRESQL INITIALIZATION COMMANDS</span>
              </span>
              <span className="text-slate-500">PostgreSQL 16 Multi-Vendor Schema</span>
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div><span className="text-emerald-400 font-bold">$</span> npm install @prisma/client prisma --save-dev</div>
              <div><span className="text-emerald-400 font-bold">$</span> npx prisma migrate dev --name init_multi_vendor_mvp</div>
              <div><span className="text-emerald-400 font-bold">$</span> npx prisma generate</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-700" />
                <span className="font-bold font-mono text-xs text-slate-900">prisma/schema.prisma</span>
              </div>

              <button
                onClick={() => handleCopy(PRISMA_SCHEMA_CODE, 'prisma')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                {copiedFile === 'prisma' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied schema.prisma</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy schema.prisma</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-6 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-[600px]">
              {PRISMA_SCHEMA_CODE}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};
