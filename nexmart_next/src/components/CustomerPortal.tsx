import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Check, 
  Star, 
  ChevronRight, 
  X, 
  Split,
  Zap
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../data/blueprintData';

export const CustomerPortal: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<{ [productId: string]: number }>({
    'prod-001': 1,
    'prod-003': 1
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'bnpl' | 'applepay' | 'cod'>('stripe');
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);
  const [aiAssistantQuery, setAiAssistantQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const categories = ['All', 'Audio Hardware', 'Watches & Precision', 'Interior & Lighting'];

  const filteredProducts = SAMPLE_PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = SAMPLE_PRODUCTS.find(p => p.id === id);
    return { product, qty };
  }).filter(item => item.product !== undefined && item.qty > 0) as { product: typeof SAMPLE_PRODUCTS[0]; qty: number }[];

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  const handleAiAssistant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiAssistantQuery.trim()) return;

    const query = aiAssistantQuery.toLowerCase();
    if (query.includes('audio') || query.includes('sound') || query.includes('headphone')) {
      setAiResponse(`Synthesized recommendations: Found 1 matching flagship audio device. Aura Sound Pro has active hybrid ANC and 48-hour acoustic endurance from verified vendor Lumina Audio Labs.`);
    } else if (query.includes('watch') || query.includes('luxury') || query.includes('titanium')) {
      setAiResponse(`Synthesized recommendations: Chronos Horizon Titanium is engineered with grade 5 titanium and Swiss-engineered automatic movement. Only 14 pieces remain in stock.`);
    } else {
      setAiResponse(`Synthesized multi-vendor bundle: We analyzed 3 verified seller catalogs matching "${aiAssistantQuery}". All items qualify for unified 1-Click checkout with express parcel tracking.`);
    }
  };

  const handlePlaceOrder = () => {
    setCheckoutCompleted(true);
    setTimeout(() => {
      setCart({});
    }, 1000);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Editorial Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-6 text-center">
        <span className="font-medium text-white">Next-Gen Multi-Vendor Storefront</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>Sub-second page rendering via ISR</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>1-Click Multi-Vendor Cart Split</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* Hero Section */}
        <section className="relative rounded-2xl overflow-hidden bg-slate-900 text-white min-h-[380px] md:min-h-[440px] flex items-center shadow-lg">
          <img 
            src="/src/assets/images/hero_marketplace_showcase_1792380848955.jpg" 
            alt="NexMart Modern Flagship Showroom" 
            className="absolute inset-0 w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />

          <div className="relative z-10 p-8 md:p-14 max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-emerald-400">Next-Gen Marketplace</span>
              <span aria-hidden="true">·</span>
              <span>Direct-from-Artisan & Verified Brands</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white leading-tight">
              Curated precision. Zero middleman clutter.
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Experience the anti-Amazon storefront: no sponsored junk ads, 100% verified authentic hardware, and unified multi-vendor checkout in under two seconds.
            </p>

            {/* AI Natural Language Search Bar */}
            <form onSubmit={handleAiAssistant} className="pt-2 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={aiAssistantQuery}
                  onChange={(e) => setAiAssistantQuery(e.target.value)}
                  placeholder="Ask AI: 'Minimalist desk lamp with titanium watch setup'..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-white/40"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-slate-950 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                <span>AI Semantic Query</span>
              </button>
            </form>

            {aiResponse && (
              <div className="p-3 bg-purple-950/60 border border-purple-500/30 rounded-lg text-xs text-purple-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{aiResponse}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Filter Controls & Search */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Instant fuzzy catalog search..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors shrink-0 shadow-2xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-700" />
              <span>Bag</span>
              {cartItemCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* Product Catalog Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col group"
            >
              {/* Product Image Slot */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-900 shadow-2xs">
                  {product.badge}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-600">{product.vendor}</span>
                    <div className="flex items-center gap-1 text-slate-700 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">({product.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-900 text-base leading-snug group-hover:text-slate-700 transition-colors">
                    {product.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold font-display text-slate-900 tabular-nums">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span>{product.leadTime}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product.id)}
                    className="px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Feature Proof Strip */}
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 text-xs">Authentic Verified Merchants</h4>
              <p className="text-xs text-slate-600 mt-0.5">Strict KYB verification and manufacturer certificates prevent counterfeit products.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Split className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 text-xs">Transparent Multi-Vendor Cart</h4>
              <p className="text-xs text-slate-600 mt-0.5">Orders automatically partition into vendor child packages for direct-from-source fulfillment.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 text-xs">1-Click Express Checkout</h4>
              <p className="text-xs text-slate-600 mt-0.5">Pay via Stripe, Apple Pay, Klarna BNPL, or verified Cash-on-Delivery seamlessly.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Slide-Over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold font-display text-slate-900 text-lg">Your Marketplace Bag</h3>
                <p className="text-xs text-slate-500">Items partitioned by independent vendor</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-sm">Your shopping bag is empty.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(({ product, qty }) => (
                    <div key={product.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Vendor: {product.vendor}</span>
                        <span className="text-[11px] text-emerald-700 font-medium">In Stock ({product.inStock})</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-slate-900 truncate">{product.title}</h4>
                          <div className="text-xs font-bold font-display text-slate-900 tabular-nums">
                            ${product.price.toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold tabular-nums text-slate-900">{qty}</span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-mono-code tabular-nums font-semibold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Shipping (Split 2 Vendors)</span>
                    <span className="font-mono-code tabular-nums text-emerald-700 font-semibold">Free Express</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="font-mono-code tabular-nums">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Proceed to 1-Click Checkout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1-Click Multi-Vendor Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold font-display text-slate-900 text-lg">
                  Unified 1-Click Multi-Vendor Checkout
                </h3>
                <p className="text-xs text-slate-500">
                  Instant escrow settlement across independent seller nodes
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setCheckoutCompleted(false);
                }}
                className="p-1.5 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {checkoutCompleted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold font-display text-slate-900">
                      Order Confirmed #NXM-2026-9481
                    </h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Your single payment of <strong className="text-slate-900">${cartTotal.toFixed(2)}</strong> was executed and partitioned across 2 independent seller fulfillment centers via Stripe Escrow.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-2 border border-slate-200 font-mono-code">
                    <div className="font-semibold text-slate-800">AUTOMATED ESCROW LEDGER SPLIT:</div>
                    <div className="flex justify-between text-slate-600">
                      <span>• Lumina Audio Labs (Sub-order #VO-101):</span>
                      <span className="text-emerald-700 font-bold">$314.10 Net (10% Comm. Deducted)</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>• Nordic Craft Collective (Sub-order #VO-103):</span>
                      <span className="text-emerald-700 font-bold">$189.00 Net (10% Comm. Deducted)</span>
                    </div>
                    <div className="flex justify-between text-slate-800 border-t border-slate-200 pt-1 font-bold">
                      <span>• NexMart Platform Commission Retained:</span>
                      <span className="text-purple-700">${(cartTotal * 0.1).toFixed(2)} (10.0%)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setCheckoutCompleted(false);
                    }}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Return to Storefront
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Select Payment Mechanism:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'stripe', label: 'Credit Card', icon: CreditCard },
                        { id: 'bnpl', label: 'Klarna BNPL', icon: Zap },
                        { id: 'applepay', label: 'Apple Pay', icon: ShieldCheck },
                        { id: 'cod', label: 'Cash on Deliv.', icon: Truck },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPaymentMethod(item.id as any)}
                          className={`p-3 rounded-lg border text-left text-xs font-medium transition-all ${
                            paymentMethod === item.id
                              ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <item.icon className="w-4 h-4 mb-1" />
                          <div className="font-semibold">{item.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === 'stripe' && (
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                      <div className="font-semibold text-slate-800">Mock Saved Card (Stripe Customer Vault)</div>
                      <div className="font-mono-code text-slate-600">•••• •••• •••• 4242 · Exp 12/28 · CVC •••</div>
                      <div className="text-[11px] text-slate-500">Secured via Stripe Elements tokenization · Zero PCI liability on platform.</div>
                    </div>
                  )}

                  {paymentMethod === 'bnpl' && (
                    <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-lg space-y-1 text-xs text-purple-900">
                      <div className="font-semibold">Klarna 4 Interest-Free Installments</div>
                      <p>Pay 4 payments of <strong>${(cartTotal / 4).toFixed(2)}</strong> every 2 weeks. Zero interest, no hidden penalties.</p>
                    </div>
                  )}

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span>Total Charge</span>
                      <span className="font-mono-code tabular-nums text-sm">${cartTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Instant two-phase commit: Distributed inventory locks reserved on Redis while Postgres executes order splitting.
                    </p>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Authorize & Execute 1-Click Order (${cartTotal.toFixed(2)})</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
