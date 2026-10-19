'use client';

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { 
  Check, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Store, 
  MapPin, 
  Lock, 
  ChevronRight,
  Clock,
  Zap,
  Download
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartTax,
    cartShipping,
    cartTotal,
    clearCart,
    setCurrentView,
    setLastCompletedOrderNumber,
  } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Step 1: Address Form State
  const [address, setAddress] = useState({
    fullName: 'Julian Vance',
    street: '742 Montgomery Street, Suite 400',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94111',
    phone: '+1 (415) 890-2194',
    country: 'United States',
  });

  // Step 2: Shipping Options per Vendor
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('express');

  // Step 3: Payment Gateway Method
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod' | 'bnpl'>('stripe');
  const [codOtp, setCodOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Group items by vendor
  const vendorGroups: { [storeName: string]: typeof cart } = {};
  cart.forEach((item) => {
    const key = item.product.storeName;
    if (!vendorGroups[key]) vendorGroups[key] = [];
    vendorGroups[key].push(item);
  });

  const finalTotal = cartTotal + (shippingMethod === 'express' ? 0 : 0);

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    const generatedOrderNum = `NXM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
      setOrderNumber(generatedOrderNum);
      setLastCompletedOrderNumber(generatedOrderNum);
      clearCart();
    }, 1200);
  };

  if (isCompleted) {
    return (
      <div className="bg-slate-50 min-h-screen text-slate-900 py-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Payment Authorized & Escrow Partitioned
            </span>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900">
              Order Confirmed {orderNumber}
            </h1>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your payment of <strong className="text-slate-900 font-mono">${finalTotal.toFixed(2)}</strong> has been split across {Object.keys(vendorGroups).length || 2} independent seller fulfillment centers.
            </p>
          </div>

          {/* Delivery & Tracking Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-slate-500 font-semibold">
              <span>MULTI-VENDOR DISPATCH PACKAGES</span>
              <span className="text-emerald-700 font-bold">2-DAY PRIORITY SCAN</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Package 1: Lumina Audio Labs</span>
                  <span className="text-blue-700">Tracking: FDX-994812</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Items: Aura Sound Pro Headphones · Est. Delivery: Oct 20
                </p>
                <div className="text-[10px] text-slate-400">
                  Escrow Status: Held in Stripe Connect transfer group until delivery scan.
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Package 2: Nordic Craft Collective</span>
                  <span className="text-blue-700">Tracking: DHL-481920</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Items: Hygge Arch Smart Luminaire · Est. Delivery: Oct 21
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
              <span>Shipping Destination:</span>
              <span className="text-right text-slate-700">{address.street}, {address.city}, {address.state}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setCurrentView('home')}
              className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Return to Marketplace Home
            </button>
            <button
              onClick={() => window.print()}
              className="py-3 px-4 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Print Order Receipt</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      
      {/* Checkout Header */}
      <header className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel & Return</span>
          </button>

          {/* 3-Step Progress Indicator */}
          <div className="flex items-center gap-3 text-xs">
            <div className={`flex items-center gap-1.5 font-bold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                step >= 1 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'
              }`}>
                1
              </span>
              <span className="hidden sm:inline">Address</span>
            </div>
            <span className="text-slate-300">›</span>

            <div className={`flex items-center gap-1.5 font-bold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                step >= 2 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'
              }`}>
                2
              </span>
              <span className="hidden sm:inline">Delivery</span>
            </div>
            <span className="text-slate-300">›</span>

            <div className={`flex items-center gap-1.5 font-bold ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                step >= 3 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'
              }`}>
                3
              </span>
              <span className="hidden sm:inline">Payment</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">256-bit SSL</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Area (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Shipping Address */}
            <div className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
              step === 1 ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <h2 className="text-base font-bold font-display text-slate-900">
                    Shipping & Delivery Address
                  </h2>
                </div>
                {step > 1 && (
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
                  >
                    Change
                  </button>
                )}
              </div>

              {step === 1 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Recipient Full Name</label>
                      <input
                        type="text"
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Telephone Number</label>
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-semibold text-slate-700">Street Address</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">City</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">State</label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Postal Code</label>
                      <input
                        type="text"
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="mt-2 py-3 px-6 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Continue to Delivery Options
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-600 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">{address.fullName}</span> ({address.phone})
                    <p>{address.street}, {address.city}, {address.state} {address.postalCode}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Delivery Options */}
            <div className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
              step === 2 ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <h2 className="text-base font-bold font-display text-slate-900">
                    Delivery Speed & Multi-Vendor Handling
                  </h2>
                </div>
                {step > 2 && (
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
                  >
                    Change
                  </button>
                )}
              </div>

              {step === 2 ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Your order contains items from <strong>{Object.keys(vendorGroups).length || 2} independent verified stores</strong>. Each will dispatch via priority logistics.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label
                      onClick={() => setShippingMethod('express')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        shippingMethod === 'express'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span>Express Courier</span>
                          <span className="font-mono text-emerald-400">FREE</span>
                        </div>
                        <p className="text-[11px] opacity-80">
                          Dispatched within 24 hours via FedEx / DHL Express.
                        </p>
                      </div>
                      <div className="pt-3 text-[11px] font-medium opacity-90 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Estimated Arrival: 1-2 Business Days</span>
                      </div>
                    </label>

                    <label
                      onClick={() => setShippingMethod('standard')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        shippingMethod === 'standard'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span>Eco-Consolidated Ground</span>
                          <span className="font-mono text-emerald-400">FREE</span>
                        </div>
                        <p className="text-[11px] opacity-80">
                          Consolidated parcel routing to minimize carbon emissions.
                        </p>
                      </div>
                      <div className="pt-3 text-[11px] font-medium opacity-90 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Estimated Arrival: 3-5 Business Days</span>
                      </div>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="mt-2 py-3 px-6 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              ) : step > 2 ? (
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">
                    {shippingMethod === 'express' ? 'Express Courier (1-2 Days)' : 'Standard Ground'} — Free
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Complete address first</p>
              )}
            </div>

            {/* Step 3: Payment Selection */}
            <div className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
              step === 3 ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <h2 className="text-base font-bold font-display text-slate-900">
                  Select Payment Mechanism & Escrow Authorization
                </h2>
              </div>

              {step === 3 ? (
                <div className="space-y-5">
                  {/* Payment Methods */}
                  <div className="grid grid-cols-3 gap-2.5 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === 'stripe'
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mb-1" />
                      <div className="font-bold">Credit Card</div>
                      <span className="text-[10px] opacity-75">Stripe 256-bit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bnpl')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === 'bnpl'
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Zap className="w-4 h-4 mb-1 text-purple-400" />
                      <div className="font-bold">Klarna BNPL</div>
                      <span className="text-[10px] opacity-75">4 × ${(finalTotal / 4).toFixed(2)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Truck className="w-4 h-4 mb-1 text-amber-500" />
                      <div className="font-bold">Cash on Delivery</div>
                      <span className="text-[10px] opacity-75">Phone Verified</span>
                    </button>
                  </div>

                  {paymentMethod === 'stripe' && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>Card Information (Tokenized via Stripe Elements)</span>
                        <span className="text-[11px] text-emerald-700 font-mono">Zero PCI Liability</span>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-slate-300 font-mono text-slate-700 flex items-center justify-between">
                        <span>•••• •••• •••• 4242</span>
                        <span className="text-slate-400 text-[11px]">12/28 · CVC 882</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Funds are held in platform escrow until each package achieves delivery confirmation.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'bnpl' && (
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-1">
                      <div className="font-bold">4 Interest-Free Installments of ${(finalTotal / 4).toFixed(2)}</div>
                      <p className="text-[11px]">
                        Due every 2 weeks. Instant approval decision. Zero late fees when paid on time.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                      <div className="font-bold">Phone Verification for Cash on Delivery</div>
                      <p className="text-[11px]">
                        We will send an SMS OTP verification to <strong>{address.phone}</strong> before courier dispatch.
                      </p>
                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={() => setOtpSent(true)}
                          className="px-3 py-1.5 bg-amber-600 text-white rounded-md text-[11px] font-semibold"
                        >
                          Send SMS OTP Code
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={codOtp}
                            onChange={(e) => setCodOtp(e.target.value)}
                            className="p-1.5 bg-white border border-amber-300 rounded text-xs w-36 font-mono"
                          />
                          <span className="text-[11px] text-emerald-700 font-semibold">Code Verified ✓</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Primary Order Submission Button */}
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handlePlaceOrder}
                    className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Executing Multi-Vendor Ledger Consensus...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                        <span>Authorize Order & Place Escrow (${finalTotal.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Complete prior steps</p>
              )}
            </div>

          </div>

          {/* Right Summary Sidebar (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              
              <h3 className="font-bold font-display text-slate-900 text-base border-b border-slate-100 pb-3">
                Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
              </h3>

              {/* Package Breakdown */}
              <div className="space-y-3">
                {Object.entries(vendorGroups).map(([vendorName, items]) => (
                  <div key={vendorName} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-slate-500" />
                        <span>{vendorName}</span>
                      </div>
                      <span className="font-mono text-emerald-700">Free Express</span>
                    </div>

                    <div className="space-y-1">
                      {items.map((item) => (
                        <div key={`${item.product.id}-${item.variant.id}`} className="flex justify-between text-slate-600">
                          <span className="truncate max-w-[200px]">{item.product.title} (×{item.quantity})</span>
                          <span className="font-mono tabular-nums text-slate-900 font-semibold">
                            ${(item.variant.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Ledger */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Sales Tax (8%)</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    ${cartTax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping & Packaging</span>
                  <span className="font-mono tabular-nums font-semibold text-emerald-700">
                    Free
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums text-lg">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Security Safeguard */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>NexMart Buyer Shield:</strong> Funds are locked in escrow and only released to sellers after postal confirmation.
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
