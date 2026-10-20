import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Split, 
  AlertTriangle, 
  Check, 
  X, 
  Sliders, 
  ArrowRight,
  DollarSign,
  UserCheck,
  Scale,
  TrendingUp,
  Package,
  Store,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Percent,
  Clock,
  Layers
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    products,
    approveProduct,
    rejectProduct,
    platformGmv,
    platformCommissionEarned,
    vendorPayoutsTotal,
    orders,
    marketplaceCommissionRate,
    setMarketplaceCommissionRate,
    setCurrentView,
    setSelectedProductId,
    onNavigateToTab
  } = useCart();

  const { vendorApplications: authApps, approveVendorApplication, isSuperAdmin } = useAuth();

  if (!isSuperAdmin) {
    return null;
  }

  const [productFilter, setProductFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [moderationToast, setModerationToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  const [commissionRates, setCommissionRates] = useState<{ [category: string]: number }>({
    'Audio Hardware': 5,
    'Watches & Precision': 5,
    'Interior & Lighting': 5,
    'Mechanical Keyboards': 5,
  });

  const [simulatedGross, setSimulatedGross] = useState(1439.00);

  const [vendorApplications, setVendorApplications] = useState(() => {
    const base = [
      {
        id: 'app-01',
        brand: 'Komorebi Ceramics',
        owner: 'Kenji Takahashi',
        taxId: 'US-EIN-9481920',
        category: 'Home & Kitchen',
        status: 'PENDING'
      },
      {
        id: 'app-02',
        brand: 'Aether Mechanical Keyboards',
        owner: 'Liam Chen',
        taxId: 'US-EIN-5519283',
        category: 'Electronics',
        status: 'APPROVED'
      }
    ];

    const liveConverted = (authApps || []).map(la => ({
      id: la.id,
      brand: la.storeName,
      owner: `${la.applicantName} (${la.applicantEmail})`,
      taxId: 'IRS-VERIFY-PENDING',
      category: 'Artisan Goods',
      status: la.status.toUpperCase()
    }));

    return [...liveConverted, ...base];
  });

  const [disputes, setDisputes] = useState([
    {
      id: 'disp-401',
      orderId: '#NXM-2026-7712',
      customer: 'Sarah Jenkins',
      vendor: 'Lumina Audio Labs',
      reason: 'Parcel delayed by FedEx hub in Memphis',
      escrowAmount: 349.00,
      status: 'UNDER_REVIEW'
    }
  ]);

  // Product moderation counts
  const pendingCount = products.filter((p) => p.approvalStatus === 'pending').length;
  const approvedCount = products.filter((p) => !p.approvalStatus || p.approvalStatus === 'approved').length;
  const rejectedCount = products.filter((p) => p.approvalStatus === 'rejected').length;

  const filteredProducts = products.filter((p) => {
    if (productFilter === 'pending') return p.approvalStatus === 'pending';
    if (productFilter === 'approved') return !p.approvalStatus || p.approvalStatus === 'approved';
    if (productFilter === 'rejected') return p.approvalStatus === 'rejected';
    return true;
  });

  const handleApprove = (productId: string, title: string) => {
    approveProduct(productId);
    setModerationToast({
      message: `Product "${title}" approved! It is now live on the Customer Storefront.`,
      type: 'success'
    });
    setTimeout(() => setModerationToast(null), 3500);
  };

  const handleReject = (productId: string, title: string) => {
    rejectProduct(productId, 'Documentation missing: FCC / CE certification required');
    setModerationToast({
      message: `Product "${title}" rejected. Notification sent to vendor.`,
      type: 'danger'
    });
    setTimeout(() => setModerationToast(null), 3500);
  };

  const handleApproveVendor = (id: string) => {
    approveVendorApplication(id);
    setVendorApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'APPROVED' } : app));
    setModerationToast({
      message: 'Vendor application approved! Merchant granted catalog publishing rights.',
      type: 'success'
    });
    setTimeout(() => setModerationToast(null), 3500);
  };

  const handleRejectVendor = (id: string) => {
    setVendorApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'REJECTED' } : app));
  };

  const handleResolveDispute = (id: string, decision: 'RELEASE_TO_VENDOR' | 'REFUND_CUSTOMER') => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: decision } : d));
  };

  // Payout math calculations
  const platformRate = marketplaceCommissionRate; // 5% default
  const stripeFee = (simulatedGross * 0.029) + 0.30;
  const platformNetCommission = (simulatedGross * platformRate) - stripeFee;
  const vendorGrossTotal = simulatedGross * (1 - platformRate);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Moderation Toast Notification */}
      {moderationToast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-fadeIn text-xs font-semibold ${
          moderationToast.type === 'success' 
            ? 'bg-emerald-900 text-emerald-100 border-emerald-700' 
            : 'bg-rose-900 text-rose-100 border-rose-700'
        }`}>
          {moderationToast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{moderationToast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 pt-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-purple-900 font-mono">NexMart Super Admin Tower</span>
            <span aria-hidden="true">·</span>
            <span>Platform Financial &amp; Governance Center</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Multi-Tenant Orchestrator</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mt-1">
            Global Marketplace Governance &amp; GMV Monitor
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-purple-50 text-purple-800 rounded-lg text-xs font-bold border border-purple-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Admin Clearance Level 3</span>
          </span>
        </div>
      </div>

      {/* Top Hero: Platform GMV & Financial Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV Metric */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Total Platform GMV</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Real-Time
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 font-mono tabular-nums">
            ${platformGmv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Includes <strong>{orders.length}</strong> live settled customer orders</span>
          </div>
        </div>

        {/* Platform Net Commission Rake */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Platform Take-Rate ({Math.round(marketplaceCommissionRate * 100)}%)</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Net Revenue
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-purple-900 font-mono tabular-nums">
            ${platformCommissionEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] text-slate-600">
            Automated 5% split retained from vendor payouts
          </div>
        </div>

        {/* Total Vendor Payouts Disbursed/Escrow */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Vendor Escrow Capital (95%)</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Stripe Connect
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 font-mono tabular-nums">
            ${vendorPayoutsTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] text-slate-600">
            Protected under NexMart smart buyer escrow
          </div>
        </div>

        {/* Product Catalog Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Catalog Moderation Queue</span>
            {pendingCount > 0 ? (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                Action Required
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700">
                All Cleared
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 font-mono tabular-nums flex items-baseline gap-2">
            <span>{pendingCount}</span>
            <span className="text-sm font-normal text-slate-500">pending approval</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between">
            <span>{approvedCount} live in store</span>
            <button
              onClick={() => setProductFilter('pending')}
              className="text-amber-700 hover:text-amber-800 font-semibold"
            >
              Review Queue &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* CORE FEATURE: Vendor Product Moderation & Approvals Dashboard */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-slate-900" />
              <h2 className="text-lg font-bold font-display text-slate-900">
                Vendor Catalog Moderation &amp; Publishing Queue
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Review new merchant submissions before they are published live on the Customer Storefront.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setProductFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                productFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Products ({products.length})
            </button>
            <button
              onClick={() => setProductFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                productFilter === 'pending'
                  ? 'bg-amber-400 text-slate-950 shadow-xs font-bold'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>Pending Review</span>
              {pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-mono">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setProductFilter('approved')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                productFilter === 'approved'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Approved ({approvedCount})
            </button>
            <button
              onClick={() => setProductFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                productFilter === 'rejected'
                  ? 'bg-white text-rose-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Item Details</th>
                <th className="py-3 px-4 font-bold">Vendor Store</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Price &amp; Variants</th>
                <th className="py-3 px-4 font-bold">Moderation Status</th>
                <th className="py-3 px-4 font-bold text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No products match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const isPending = prod.approvalStatus === 'pending';
                  const isApproved = !prod.approvalStatus || prod.approvalStatus === 'approved';
                  const isRejected = prod.approvalStatus === 'rejected';

                  return (
                    <tr key={prod.id} className={`hover:bg-slate-50/70 transition-colors ${isPending ? 'bg-amber-50/30' : ''}`}>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.primaryImage}
                            alt={prod.title}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
                          />
                          <div className="max-w-xs">
                            <span className="font-bold text-slate-900 block truncate" title={prod.title}>
                              {prod.title}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">ID: {prod.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-amber-500" />
                          <span>{prod.storeName}</span>
                        </span>
                        <span className="text-[11px] text-slate-500 block">{prod.brand}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                          {prod.category || 'General Electronics'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                        <div>${prod.basePrice.toFixed(2)}</div>
                        <span className="text-[10px] font-normal text-slate-500 font-sans block">
                          {prod.variants.length} variant(s)
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>Pending Review</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>Live on Storefront</span>
                          </span>
                        )}
                        {isRejected && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                              <XCircle className="w-3 h-3 text-rose-700" />
                              <span>Rejected</span>
                            </span>
                            {prod.rejectionReason && (
                              <p className="text-[10px] text-rose-700 mt-0.5 max-w-[180px] truncate" title={prod.rejectionReason}>
                                {prod.rejectionReason}
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPending ? (
                            <>
                              <button
                                onClick={() => handleApprove(prod.id, prod.title)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleReject(prod.id, prod.title)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-lg text-xs font-semibold transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          ) : isRejected ? (
                            <button
                              onClick={() => handleApprove(prod.id, prod.title)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Re-Approve
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedProductId(prod.id);
                                  setCurrentView('product-detail');
                                  if (onNavigateToTab) onNavigateToTab('customer');
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View Live</span>
                              </button>
                              <button
                                onClick={() => handleReject(prod.id, prod.title)}
                                className="px-2 py-1 text-slate-400 hover:text-rose-600 rounded text-xs transition-colors"
                                title="Revoke approval"
                              >
                                Revoke
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Payout Split Engine & Dynamic Commission Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Real-Time Split Calculator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Split className="w-4 h-4 text-slate-900" />
              <h3 className="font-bold text-slate-900 text-sm">Automated Multi-Vendor Split Orchestrator</h3>
            </div>
            <span className="text-xs font-mono text-slate-500">Stripe Connect Engine</span>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-medium text-slate-600 block">
              Simulated Customer Cart Value ($)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={simulatedGross}
                onChange={(e) => setSimulatedGross(Math.max(10, parseFloat(e.target.value) || 0))}
                className="w-44 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900"
              />
              <span className="text-xs text-slate-500">Includes 2 distinct vendor items in single checkout</span>
            </div>

            {/* Split Breakdown Ledger */}
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-2 mt-4">
              <div className="text-slate-400 font-bold border-b border-slate-800 pb-2">
                AUTOMATED SETTLEMENT LEDGER ENTRIES:
              </div>
              <div className="flex justify-between">
                <span>1. Customer Gross Paid:</span>
                <span className="text-white font-bold">${simulatedGross.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>2. Payment Processor Fee (2.9% + $0.30):</span>
                <span>-${stripeFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-purple-400">
                <span>3. Platform Take-Rate ({Math.round(marketplaceCommissionRate * 100)}%):</span>
                <span>+${(simulatedGross * marketplaceCommissionRate).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 border-t border-slate-800 pt-2 font-bold">
                <span>4. Vendor 1 Net Payout (Lumina Audio - 60%):</span>
                <span>${(vendorGrossTotal * 0.6).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>5. Vendor 2 Net Payout (Nordic Craft - 40%):</span>
                <span>${(vendorGrossTotal * 0.4).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Category Commission Manager */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-900" />
              <h3 className="font-bold text-slate-900 text-sm">Dynamic Commission Rates by Category</h3>
            </div>
            <span className="text-xs text-emerald-700 font-medium">Live Synced</span>
          </div>

          <p className="text-xs text-slate-600">
            Configure dynamic take-rates applied across marketplace sales. Margins dynamically adjust based on category sales volume and seller tier.
          </p>

          <div className="space-y-4 pt-2">
            {Object.entries(commissionRates).map(([category, rate]) => (
              <div key={category} className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{category}</span>
                  <span className="font-mono tabular-nums text-purple-700 font-bold">{rate}%</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={rate}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setCommissionRates(prev => ({ ...prev, [category]: val }));
                    setMarketplaceCommissionRate(val / 100);
                  }}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vendor KYB Approval Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">New Merchant Onboarding Queue (KYB Checks)</h3>
            <p className="text-xs text-slate-500">Automated verification against IRS TIN and State Entity registries</p>
          </div>
          <span className="text-xs font-mono text-slate-500">2 Verified Sellers</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Brand / Storefront</th>
                <th className="py-3 px-4 font-semibold">Legal Representative</th>
                <th className="py-3 px-4 font-semibold">Tax Identification</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">KYB Status</th>
                <th className="py-3 px-4 font-semibold text-right">Verification Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendorApplications.map((app) => (
                <tr key={app.id}>
                  <td className="py-3 px-4 font-semibold text-slate-900">{app.brand}</td>
                  <td className="py-3 px-4 text-slate-700">{app.owner}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{app.taxId}</td>
                  <td className="py-3 px-4 text-slate-600">{app.category}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      app.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : app.status === 'REJECTED'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {app.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApproveVendor(app.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectVendor(app.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispute Resolution Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-slate-900" />
            <h3 className="font-bold text-slate-900 text-sm">Escrow Dispute Mediation Desk</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Smart Escrow Hold</span>
        </div>

        {disputes.map((d) => (
          <div key={d.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono text-slate-900">{d.orderId}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-700 font-medium">Customer: {d.customer} vs {d.vendor}</span>
              </div>
              <p className="text-slate-600">{d.reason}</p>
              <div className="text-[11px] font-mono text-amber-800">
                Funds in Escrow Hold: ${d.escrowAmount.toFixed(2)} USD
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {d.status === 'UNDER_REVIEW' ? (
                <>
                  <button
                    onClick={() => handleResolveDispute(d.id, 'REFUND_CUSTOMER')}
                    className="px-3 py-1.5 bg-rose-600 text-white hover:bg-rose-700 rounded text-xs font-semibold"
                  >
                    Refund Buyer
                  </button>
                  <button
                    onClick={() => handleResolveDispute(d.id, 'RELEASE_TO_VENDOR')}
                    className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded text-xs font-semibold"
                  >
                    Release to Vendor
                  </button>
                </>
              ) : (
                <span className="px-3 py-1 bg-slate-200 text-slate-800 rounded font-semibold text-xs">
                  Resolved: {d.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
