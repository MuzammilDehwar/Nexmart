'use client';

import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Store } from 'lucide-react';

export const CartDrawer: React.FC = () => {
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
    setCurrentView,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  // Group items by vendor store
  const vendorGroups: { [storeName: string]: typeof cart } = {};
  cart.forEach((item) => {
    const key = item.product.storeName;
    if (!vendorGroups[key]) vendorGroups[key] = [];
    vendorGroups[key].push(item);
  });

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    setCurrentView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end">
      <div className="w-full sm:max-w-lg bg-white h-full max-h-[100dvh] shadow-2xl flex flex-col justify-between border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display">
                Shopping Cart ({cartCount})
              </h3>
              <p className="text-[11px] text-slate-500">
                Multi-vendor split package fulfillment
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-amber-50/80 border-b border-amber-200/50 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-700" />
            {cartSubtotal >= 150 ? (
              <span className="font-semibold text-emerald-800">
                You've unlocked Free Express Shipping!
              </span>
            ) : (
              <span>
                Add <strong className="font-mono tabular-nums">${(150 - cartSubtotal).toFixed(2)}</strong> more for Free Shipping
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-amber-800 uppercase tracking-wider font-bold">
            {cartSubtotal >= 150 ? '100% Eligible' : `${Math.round((cartSubtotal / 150) * 100)}%`}
          </span>
        </div>

        {/* Cart Item List (Grouped by Vendor) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-700">Your cart is empty</p>
                <p className="text-xs text-slate-400">Discover hand-curated hardware and verified artisan tech.</p>
              </div>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentView('home');
                }}
                className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            Object.entries(vendorGroups).map(([vendorName, items], vIdx) => (
              <div key={vendorName} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
                {/* Vendor Package Header */}
                <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <Store className="w-3.5 h-3.5 text-slate-600" />
                    <span>Package {vIdx + 1}: {vendorName}</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Merchant</span>
                  </span>
                </div>

                {/* Items in this Vendor Package */}
                <div className="p-3.5 space-y-3 divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.variant.id}`} className="pt-3 first:pt-0 flex gap-3">
                      <img
                        src={item.variant.imageUrl || item.product.primaryImage}
                        alt={item.product.title}
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = '/src/assets/images/hero_marketplace_showcase_1792380848955.jpg';
                        }}
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.product.title}
                        </h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>Variant: <strong>{item.variant.title}</strong></span>
                          <span>·</span>
                          <span className="font-mono text-slate-700 font-semibold tabular-nums">
                            ${item.variant.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity Stepper & Remove */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.variant.id, -1)}
                              className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-2.5 text-xs font-bold font-mono text-slate-900 tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.variant.id, 1)}
                              className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold font-mono text-slate-900 tabular-nums">
                              ${(item.variant.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.variant.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-white space-y-3.5 shadow-lg">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  ${cartTax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping ({Object.keys(vendorGroups).length} independent packages)</span>
                <span className="font-mono tabular-nums font-semibold text-emerald-700">
                  {cartShipping === 0 ? 'Free Express' : `$${cartShipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums text-base">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 group"
            >
              <span>Proceed to 3-Step Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
              <span>Demo checkout</span>
              <span>·</span>
              <span>Provider pending</span>
              <span>·</span>
              <span>30-Day Returns</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
