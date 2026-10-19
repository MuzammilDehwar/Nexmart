'use client';

import React, { useState } from 'react';
import { useCart, Order, OrderStatus } from '../../context/CartContext';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Store, 
  RotateCcw, 
  ShieldCheck, 
  CreditCard, 
  FileText,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export const CustomerOrdersPage: React.FC = () => {
  const { orders, setCurrentView, setSelectedProductId, addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-progress' | 'delivered'>('all');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (statusFilter === 'delivered' && order.overallStatus !== 'Delivered') return false;
    if (statusFilter === 'in-progress' && order.overallStatus === 'Delivered') return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesId = order.id.toLowerCase().includes(q);
      const matchesCustomer = order.customerName.toLowerCase().includes(q);
      const matchesProduct = order.items.some(
        (i) => i.product.title.toLowerCase().includes(q) || i.product.brand.toLowerCase().includes(q)
      );
      const matchesVendor = order.vendorPackages.some((vp) => vp.vendorName.toLowerCase().includes(q));
      if (!matchesId && !matchesCustomer && !matchesProduct && !matchesVendor) return false;
    }

    return true;
  });

  const getStepNumber = (status: OrderStatus): number => {
    switch (status) {
      case 'Ordered':
        return 1;
      case 'Packed':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Shipped':
        return 'text-amber-800 bg-amber-50 border-amber-300';
      case 'Packed':
        return 'text-sky-800 bg-sky-50 border-sky-200';
      case 'Ordered':
      default:
        return 'text-slate-800 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      
      {/* Top Banner Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-display text-slate-900">
                Your Orders &amp; Shipment Tracking
              </h1>
              <p className="text-xs text-slate-500">
                Track real-time multi-vendor package dispatches and verified delivery logs
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, item, or vendor..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={() => setStatusFilter('all')}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
              statusFilter === 'all'
                ? 'border-amber-500 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('in-progress')}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
              statusFilter === 'in-progress'
                ? 'border-amber-500 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            In Progress ({orders.filter((o) => o.overallStatus !== 'Delivered').length})
          </button>
          <button
            onClick={() => setStatusFilter('delivered')}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
              statusFilter === 'delivered'
                ? 'border-amber-500 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Delivered ({orders.filter((o) => o.overallStatus === 'Delivered').length})
          </button>
        </div>
      </header>

      {/* Main Orders List */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">No orders match your filter</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for a different keyword or view all orders.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-0"
            >
              {/* Order Card Header */}
              <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px] font-medium uppercase tracking-wider">
                    Order Placed
                  </span>
                  <span className="font-semibold text-slate-900">{order.createdAt}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px] font-medium uppercase tracking-wider">
                    Total
                  </span>
                  <span className="font-bold font-mono text-slate-900 text-sm">
                    ${order.total.toFixed(2)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px] font-medium uppercase tracking-wider">
                    Ship To
                  </span>
                  <span className="font-semibold text-slate-900 truncate block">
                    {order.customerName}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate block">
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                  </span>
                </div>

                <div className="flex flex-col sm:items-end justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {order.id}
                    </span>
                    <button
                      onClick={() => handleCopyOrderId(order.id)}
                      className="p-1 text-slate-400 hover:text-slate-900 rounded"
                      title="Copy Order ID"
                    >
                      {copiedOrderId === order.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.overallStatus)}`}>
                      {order.overallStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vendor Packages Section */}
              <div className="p-4 sm:p-6 divide-y divide-slate-100 space-y-6">
                {order.vendorPackages.map((pkg, pIdx) => {
                  const stepNum = getStepNumber(pkg.status);
                  const isDelivered = pkg.status === 'Delivered';

                  return (
                    <div key={`${order.id}-${pkg.vendorName}-${pIdx}`} className="pt-6 first:pt-0 space-y-5">
                      
                      {/* Package Header with Vendor & Tracking */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-amber-500" />
                          <span className="font-bold text-slate-900 text-xs">
                            Package {pIdx + 1} of {order.vendorPackages.length}: {pkg.vendorName}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified Seller</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-500">
                            {pkg.courier}: <strong className="font-mono text-slate-800">{pkg.trackingNumber}</strong>
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="font-semibold text-slate-700">
                            {pkg.estimatedDelivery}
                          </span>
                        </div>
                      </div>

                      {/* Amazon-Style 4-Step Visual Progress Stepper */}
                      <div className="px-2 sm:px-6 py-3">
                        <div className="relative">
                          {/* Progress Background Line */}
                          <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0" />

                          {/* Active Progress Colored Line */}
                          <div 
                            className="absolute top-4 left-6 h-1 bg-amber-400 transition-all duration-500 -z-0"
                            style={{
                              width: `${
                                stepNum === 1 ? '0%' : stepNum === 2 ? '33%' : stepNum === 3 ? '66%' : '100%'
                              }`,
                            }}
                          />

                          {/* 4 Steps Indicators */}
                          <div className="flex items-center justify-between relative z-10">
                            
                            {/* Step 1: Ordered */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                                  stepNum >= 1
                                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-100'
                                    : 'bg-white border-2 border-slate-300 text-slate-400'
                                }`}
                              >
                                <Check className="w-4 h-4 stroke-[2.5]" />
                              </div>
                              <span className="mt-2 text-[11px] font-bold text-slate-900">
                                Ordered
                              </span>
                              <span className="text-[10px] text-slate-400">Verified</span>
                            </div>

                            {/* Step 2: Packed */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                                  stepNum >= 2
                                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-100'
                                    : 'bg-white border-2 border-slate-300 text-slate-400'
                                }`}
                              >
                                {stepNum > 2 ? (
                                  <Check className="w-4 h-4 stroke-[2.5]" />
                                ) : (
                                  <Package className="w-4 h-4" />
                                )}
                              </div>
                              <span className={`mt-2 text-[11px] ${stepNum >= 2 ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                                Packed
                              </span>
                              <span className="text-[10px] text-slate-400">By Vendor</span>
                            </div>

                            {/* Step 3: Out for Delivery */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                                  stepNum >= 3
                                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-100'
                                    : 'bg-white border-2 border-slate-300 text-slate-400'
                                }`}
                              >
                                {stepNum > 3 ? (
                                  <Check className="w-4 h-4 stroke-[2.5]" />
                                ) : (
                                  <Truck className="w-4 h-4" />
                                )}
                              </div>
                              <span className={`mt-2 text-[11px] ${stepNum >= 3 ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                                Out for Delivery
                              </span>
                              <span className="text-[10px] text-slate-400">In Transit</span>
                            </div>

                            {/* Step 4: Delivered */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                                  stepNum >= 4
                                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                    : 'bg-white border-2 border-slate-300 text-slate-400'
                                }`}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <span className={`mt-2 text-[11px] ${stepNum >= 4 ? 'font-bold text-emerald-700' : 'text-slate-400'}`}>
                                Delivered
                              </span>
                              <span className="text-[10px] text-slate-400">Final Drop</span>
                            </div>

                          </div>
                        </div>
                      </div>

                      {/* Package Items List */}
                      <div className="space-y-3 pt-2">
                        {pkg.items.map((item) => (
                          <div
                            key={item.variant.id}
                            className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-white"
                          >
                            <img
                              src={item.variant.imageUrl || item.product.primaryImage}
                              alt={item.product.title}
                              className="w-16 h-16 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xs text-slate-900 truncate">
                                {item.product.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Variant: <span className="font-medium text-slate-700">{item.variant.title}</span> ({item.variant.colorName}) · Qty: {item.quantity}
                              </p>
                              <div className="font-mono font-bold text-slate-900 text-xs mt-1">
                                ${(item.variant.price * item.quantity).toFixed(2)}
                              </div>
                            </div>

                            {/* Item Actions */}
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  addToCart(item.product.id, item.variant.id, 1);
                                }}
                                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Buy Again</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedProductId(item.product.id);
                                  setCurrentView('product-detail');
                                }}
                                className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg text-xs transition-colors"
                              >
                                View Item
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          ))
        )}
      </main>

    </div>
  );
};
