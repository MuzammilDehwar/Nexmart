import React, { useState } from 'react';
import { Order, useCart } from '../../context/CartContext';
import { useEngagement } from '../../context/EngagementContext';
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
  Download,
  Smartphone,
  Sparkles,
  Percent,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartTax,
    cartShipping,
    cartTotal,
    setCurrentView,
    placeOrder,
    marketplaceCommissionRate,
  } = useCart();
  const { awardPurchasePoints } = useEngagement();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

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
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cod' | 'bnpl'>('jazzcash');
  const [paymentReference, setPaymentReference] = useState('');

  // Demo test-card mock state; never send raw card data to a server.
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('882');
  const [cardholderName, setCardholderName] = useState('Julian Vance');
  const [cardZip, setCardZip] = useState('94111');
  const [stripeProcessingStep, setStripeProcessingStep] = useState<string | null>(null);

  // Cash on Delivery Automated OTP Simulation State
  const [codOtpInput, setCodOtpInput] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showSmsBanner, setShowSmsBanner] = useState(false);

  // Group items by vendor
  const vendorGroups: { [storeName: string]: typeof cart } = {};
  cart.forEach((item) => {
    const key = item.product.storeName;
    if (!vendorGroups[key]) vendorGroups[key] = [];
    vendorGroups[key].push(item);
  });

  const finalTotal = cartTotal;
  const isAddressValid = [address.fullName, address.street, address.city, address.state, address.postalCode, address.phone].every((value) => value.trim().length > 0);
  const needsPaymentReference = ['jazzcash', 'easypaisa', 'bank_transfer'].includes(paymentMethod);

  // Platform 5% commission math
  const commissionPercent = Math.round(marketplaceCommissionRate * 100);
  const platformCommissionAmount = Math.round(cartSubtotal * marketplaceCommissionRate * 100) / 100;
  const netVendorPayoutAmount = Math.round((cartSubtotal - platformCommissionAmount) * 100) / 100;

  // Trigger automated SMS OTP simulation
  const handleSendCodOtp = () => {
    const code = '849201';
    setSimulatedOtp(code);
    setIsOtpSent(true);
    setShowSmsBanner(true);
  };

  const handleAutoFillOtp = () => {
    if (simulatedOtp) {
      setCodOtpInput(simulatedOtp);
      setIsOtpVerified(true);
    }
  };

  const handleVerifyOtp = (val: string) => {
    setCodOtpInput(val);
    if (val.trim() === '849201') {
      setIsOtpVerified(true);
    } else {
      setIsOtpVerified(false);
    }
  };

  const handleFillTestCard = () => {
    setCardNumber('4242 •••• •••• 4242');
    setCardExpiry('12/28');
    setCardCvc('882');
    setCardholderName('Julian Vance');
    setCardZip('94111');
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      setCheckoutError('Your cart is empty. Add at least one item before checkout.');
      return;
    }
    if (!isAddressValid) {
      setCheckoutError('Please complete your name, phone, and full delivery address before placing the order.');
      setStep(1);
      return;
    }
    if (paymentMethod === 'cod' && !isOtpVerified) {
      setCheckoutError('Complete the demo COD OTP step before placing the order.');
      return;
    }
    if (needsPaymentReference && paymentReference.trim().length < 4) {
      setCheckoutError('Enter a valid payment transaction/reference ID (at least 4 characters).');
      return;
    }
    setCheckoutError(null);

    setIsSubmitting(true);

    if (paymentMethod === 'stripe') {
      setStripeProcessingStep('Preparing demo test-card flow...');
      setTimeout(() => {
        setStripeProcessingStep('Simulating provider verification (no real charge)...');
        setTimeout(() => {
          setStripeProcessingStep('Simulating marketplace ledger allocation...');
          setTimeout(() => {
            const order = placeOrder(address, paymentMethod, paymentReference.trim() || undefined);
            setIsSubmitting(false);
            setStripeProcessingStep(null);
            setIsCompleted(true);
            setCreatedOrder(order);
            awardPurchasePoints(order.total);
          }, 600);
        }, 600);
      }, 600);
    } else {
      setTimeout(() => {
        const order = placeOrder(address, paymentMethod, paymentReference.trim() || undefined);
        setIsSubmitting(false);
        setIsCompleted(true);
        setCreatedOrder(order);
        awardPurchasePoints(order.total);
      }, 800);
    }
  };

  if (isCompleted && createdOrder) {
    return (
      <div className="bg-slate-50 min-h-screen text-slate-900 py-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Demo Payment Flow Completed</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900">
              Order Confirmed!
            </h1>
            <p className="text-sm font-mono font-bold text-amber-700">
              Order ID: {createdOrder.id}
            </p>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
              Thank you for testing NexMart. A simulated confirmation event was created for <strong>{createdOrder.customerEmail}</strong>; no real payment was processed.
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto text-left">
              <div className="rounded-lg border border-sky-200 bg-sky-50 p-2.5 text-[10px] text-sky-900"><strong className="block">SMS simulation</strong>Confirmation queued for {createdOrder.shippingAddress.phone}</div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-[10px] text-emerald-900"><strong className="block">WhatsApp simulation</strong>Order timeline event created</div>
            </div>
          </div>

          {/* Amazon-Style Order Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Estimated Delivery
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                {createdOrder.vendorPackages[0]?.estimatedDelivery || 'Tomorrow by 8:00 PM'}
              </span>
            </div>

            {/* Vendor Packages Breakdown */}
            <div className="space-y-3">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Multi-Vendor Packages ({createdOrder.vendorPackages.length})
              </div>

              {createdOrder.vendorPackages.map((pkg: any, idx: number) => (
                <div key={pkg.vendorName} className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center font-bold text-slate-900 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-amber-500" />
                      <span>Package {idx + 1}: {pkg.vendorName}</span>
                    </span>
                    <span className="text-blue-700 font-mono text-[11px]">
                      {pkg.trackingNumber}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600">
                    {pkg.items.map((i: any) => `${i.product.title} (${i.variant.title}) x${i.quantity}`).join(', ')}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Carrier: <strong>{pkg.courier}</strong></span>
                    <span className="font-mono font-bold text-slate-900">${pkg.subtotal.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Address & Payment Info */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 block font-semibold uppercase">Shipping Destination</span>
                <span className="text-slate-800 font-medium">{createdOrder.shippingAddress.fullName}</span>
                <span className="text-slate-600 block">{createdOrder.shippingAddress.street}, {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.state} {createdOrder.shippingAddress.postalCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase">Payment Summary</span>
                <span className="text-slate-800 font-medium capitalize">{createdOrder.paymentMethod === 'stripe' ? 'Credit Card (Stripe)' : createdOrder.paymentMethod === 'cod' ? 'Cash on Delivery (OTP Verified)' : 'Klarna BNPL'}</span>
                <span className="text-slate-900 font-mono font-bold block text-xs mt-0.5">Total Paid: ${createdOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Track Order / Continue Shopping / Print */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setCurrentView('orders')}
              className="flex-1 py-3 px-5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order &amp; Shipments</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="py-3 px-5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => window.print()}
              className="py-3 px-4 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Print Receipt</span>
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
                  {checkoutError && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800">{checkoutError}</div>}
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
                    onClick={() => { if (!isAddressValid) { setCheckoutError('Please complete all required delivery fields.'); return; } setCheckoutError(null); setStep(2); }}
                    disabled={cart.length === 0 || !isAddressValid}
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
                  {checkoutError && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800">{checkoutError}</div>}
                  {/* Payment Methods */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('jazzcash')}
                      className={`p-3 rounded-xl border text-left transition-all ${paymentMethod === 'jazzcash' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                    >
                      <Smartphone className="w-4 h-4 mb-1 text-rose-400" />
                      <div className="font-bold">JazzCash</div>
                      <span className="text-[10px] opacity-75">Demo wallet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('easypaisa')}
                      className={`p-3 rounded-xl border text-left transition-all ${paymentMethod === 'easypaisa' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                    >
                      <Smartphone className="w-4 h-4 mb-1 text-emerald-500" />
                      <div className="font-bold">Easypaisa</div>
                      <span className="text-[10px] opacity-75">Demo wallet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-3 rounded-xl border text-left transition-all ${paymentMethod === 'bank_transfer' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                    >
                      <CreditCard className="w-4 h-4 mb-1 text-sky-500" />
                      <div className="font-bold">Bank Transfer</div>
                      <span className="text-[10px] opacity-75">Transaction ID</span>
                    </button>
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
                      <span className="text-[10px] opacity-75">Demo OTP</span>
                    </button>
                  </div>

                  {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa' || paymentMethod === 'bank_transfer') && (
                    <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-950 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold">{paymentMethod === 'bank_transfer' ? 'Bank transfer verification' : `${paymentMethod === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} checkout`}</p>
                          <p className="text-[11px] text-sky-800 mt-1">Demo-safe flow: no real payment is sent. Enter a test reference to continue.</p>
                        </div>
                        <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-sky-700">SIMULATION</span>
                      </div>
                      {paymentMethod === 'bank_transfer' && <div className="rounded-lg bg-white border border-sky-200 p-3 text-[11px] text-slate-600">Demo account: <strong className="font-mono text-slate-900">NEXMART-001</strong> · Beneficiary: NexMart Marketplace</div>}
                      <input value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder={paymentMethod === 'bank_transfer' ? 'Enter demo transaction ID' : 'Enter demo wallet reference'} className="w-full rounded-lg border border-sky-200 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-sky-500" />
                      <p className="text-[10px] text-sky-700">Minimum 4 characters. The order remains pending until a real server-side provider verifies it.</p>
                    </div>
                  )}

                  {/* Test-card UI mock; replace with hosted provider Elements before production. */}
                  {paymentMethod === 'stripe' && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Demo test-card form</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleFillTestCard}
                          className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-semibold text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Use Test Card</span>
                        </button>
                      </div>

                      {/* Card Input Fields Styled like Stripe Elements */}
                      <div className="space-y-3 bg-white p-3.5 rounded-lg border border-slate-300 shadow-inner">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                            <span>Card Number</span>
                            <span className="font-mono text-[10px] text-emerald-700 font-bold">VISA / MASTERCARD / AMEX</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4242 4242 4242 4242"
                              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded font-mono text-slate-800 text-xs font-semibold focus:outline-hidden focus:bg-white focus:border-slate-400"
                            />
                            <CreditCard className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-600">Expiration (MM/YY)</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded font-mono text-slate-800 text-xs font-semibold focus:outline-hidden focus:bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-600">CVC / CVV</label>
                            <input
                              type="text"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="882"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded font-mono text-slate-800 text-xs font-semibold focus:outline-hidden focus:bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-600">Cardholder Name</label>
                            <input
                              type="text"
                              value={cardholderName}
                              onChange={(e) => setCardholderName(e.target.value)}
                              placeholder="Julian Vance"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 text-xs font-medium focus:outline-hidden focus:bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-600">Postal / ZIP Code</label>
                            <input
                              type="text"
                              value={cardZip}
                              onChange={(e) => setCardZip(e.target.value)}
                              placeholder="94111"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded font-mono text-slate-800 text-xs font-semibold focus:outline-hidden focus:bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 3D Secure Status Progress Dialog during Submission */}
                      {stripeProcessingStep && (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-300 text-amber-950 flex items-center gap-2.5 animate-pulse">
                          <RefreshCw className="w-4 h-4 animate-spin text-amber-700 shrink-0" />
                          <span className="font-semibold text-xs font-mono">{stripeProcessingStep}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Test payment form · no real charge
                        </span>
                        <span className="font-mono text-slate-400">pi_3P9x_test</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'bnpl' && (
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-2">
                      <div className="font-bold flex items-center justify-between">
                        <span>4 Interest-Free Installments of ${(finalTotal / 4).toFixed(2)}</span>
                        <span className="px-2 py-0.5 bg-purple-200 text-purple-900 rounded text-[10px] font-bold">Klarna Pay in 4</span>
                      </div>
                      <p className="text-[11px] text-purple-800">
                        Demo installment preview only. No charge or payment schedule is created in Phase 1.
                      </p>
                    </div>
                  )}

                  {/* Cash on Delivery (COD) with Automated OTP Simulation */}
                  {paymentMethod === 'cod' && (
                    <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-300 text-xs text-amber-950 space-y-3">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5 text-amber-900">
                          <Smartphone className="w-4 h-4 text-amber-700" />
                          <span>Automated Security OTP Verification for COD</span>
                        </span>
                        <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded text-[10px] font-mono font-bold">
                          UI-only demo OTP
                        </span>
                      </div>

                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        To curb false deliveries, Cash on Delivery orders require an automated SMS security passcode verified against phone number <strong>{address.phone}</strong>.
                      </p>

                      {/* Automated SMS Push Simulation Banner */}
                      {showSmsBanner && simulatedOtp && (
                        <div className="p-3 bg-white rounded-lg border-2 border-amber-400 shadow-md space-y-2 animate-fadeIn">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-900">
                            <span className="flex items-center gap-1.5">
                              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                              <span>Incoming SMS from NexMart Security</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">Just now</span>
                          </div>
                          <div className="bg-slate-100 p-2.5 rounded font-mono text-xs text-slate-800 border border-slate-200">
                            <span className="text-slate-500">[NexMart Alert]</span> Your order confirmation OTP is{' '}
                            <strong className="text-amber-800 font-bold text-sm bg-amber-100 px-1 py-0.5 rounded">{simulatedOtp}</strong>. Valid for 10 minutes.
                          </div>
                          <button
                            type="button"
                            onClick={handleAutoFillOtp}
                            className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>1-Click Auto-Fill OTP ({simulatedOtp})</span>
                          </button>
                        </div>
                      )}

                      {!isOtpSent ? (
                        <button
                          type="button"
                          onClick={handleSendCodOtp}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Generate &amp; Send SMS Security OTP Code</span>
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Enter 6-digit SMS Security Code:
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="e.g. 849201"
                              value={codOtpInput}
                              onChange={(e) => handleVerifyOtp(e.target.value)}
                              className={`p-2 bg-white border rounded-lg text-sm font-mono tracking-widest text-center w-36 font-bold ${
                                isOtpVerified ? 'border-emerald-500 ring-2 ring-emerald-200 text-emerald-800' : 'border-amber-300'
                              }`}
                            />
                            {isOtpVerified ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Demo OTP accepted ✓</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-amber-800">
                                Enter code received above
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Primary Order Submission Button */}
                  <button
                    type="button"
                    disabled={isSubmitting || (paymentMethod === 'cod' && !isOtpVerified) || (['jazzcash', 'easypaisa', 'bank_transfer'].includes(paymentMethod) && paymentReference.trim().length < 4)}
                    onClick={handlePlaceOrder}
                    className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{stripeProcessingStep || 'Executing Multi-Vendor Ledger Consensus...'}</span>
                      </span>
                    ) : paymentMethod === 'cod' && !isOtpVerified ? (
                      <span>Complete SMS OTP Verification to Authorize COD</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                        <span>{paymentMethod === 'cod' ? 'Confirm COD Order' : 'Place Demo Order'} (${finalTotal.toFixed(2)})</span>
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

              {/* Price Ledger & Dynamic Tax Breakdown */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated State &amp; Local Sales Tax (8.0%)</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    ${cartTax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Multi-Vendor Consolidated Shipping</span>
                  <span className="font-mono tabular-nums font-semibold text-emerald-700">
                    Free
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount Charged</span>
                  <span className="font-mono tabular-nums text-lg">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Multi-Tenant Marketplace Commission & Escrow Breakdown */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-slate-700">
                    <Percent className="w-3.5 h-3.5 text-amber-500" />
                    <span>Marketplace Payout & Commission Ledger</span>
                  </span>
                  <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                    {commissionPercent}% Take-Rate
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <span>NexMart Platform Commission ({commissionPercent}%):</span>
                    </span>
                    <span className="font-mono font-semibold text-amber-800">
                      -${platformCommissionAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-700 font-semibold">
                    <span>Net Vendor Payout (Held in Stripe Escrow):</span>
                    <span className="font-mono text-emerald-700 font-bold">
                      ${netVendorPayoutAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Vendor breakdown */}
                  <div className="pt-1.5 border-t border-slate-200 space-y-1 text-[10px] text-slate-500">
                    {Object.entries(vendorGroups).map(([vName, vItems]) => {
                      const vSub = vItems.reduce((acc, i) => acc + i.variant.price * i.quantity, 0);
                      const vComm = Math.round(vSub * marketplaceCommissionRate * 100) / 100;
                      const vNet = vSub - vComm;
                      return (
                        <div key={vName} className="flex justify-between">
                          <span className="truncate max-w-[170px]">{vName} (95% net):</span>
                          <span className="font-mono font-medium text-slate-700">
                            ${vNet.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Security Safeguard */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>NexMart Buyer Shield:</strong> Phase 1 is a demo-safe checkout. Real escrow and provider verification require a future server-side integration.
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
