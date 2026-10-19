import React, { useState } from 'react';
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
  Scale
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const [commissionRates, setCommissionRates] = useState<{ [category: string]: number }>({
    'Audio Hardware': 10,
    'Watches & Precision': 12,
    'Interior & Lighting': 15,
  });

  const [simulatedGross, setSimulatedGross] = useState(1439.00);

  const [vendorApplications, setVendorApplications] = useState([
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
      status: 'PENDING'
    }
  ]);

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

  const handleApproveVendor = (id: string) => {
    setVendorApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'APPROVED' } : app));
  };

  const handleRejectVendor = (id: string) => {
    setVendorApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'REJECTED' } : app));
  };

  const handleResolveDispute = (id: string, decision: 'RELEASE_TO_VENDOR' | 'REFUND_CUSTOMER') => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: decision } : d));
  };

  // Payout math calculations
  const platformRate = 0.10; // average 10%
  const stripeFee = (simulatedGross * 0.029) + 0.30;
  const platformNetCommission = (simulatedGross * platformRate) - stripeFee;
  const vendorGrossTotal = simulatedGross * (1 - platformRate);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 pt-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">NexMart Super Admin Tower</span>
            <span aria-hidden="true">·</span>
            <span>Platform Financial & Governance Center</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Multi-Region Multi-Tenant</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mt-1">
            Global Marketplace Control Tower
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold border border-purple-200">
            Automated Stripe Escrow: Healthy
          </span>
        </div>
      </div>

      {/* Grid: Payout Split Engine & Dynamic Commission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Real-Time Split Calculator */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Split className="w-4 h-4 text-slate-900" />
              <h3 className="font-bold text-slate-900 text-sm">Automated Multi-Vendor Split Orchestrator</h3>
            </div>
            <span className="text-xs font-mono-code text-slate-500">Stripe Connect Engine</span>
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
                className="w-44 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono-code font-bold text-slate-900"
              />
              <span className="text-xs text-slate-500">Includes 2 distinct vendor items in single checkout</span>
            </div>

            {/* Split Breakdown Ledger */}
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono-code text-xs space-y-2 mt-4">
              <div className="text-slate-400 font-bold border-b border-slate-800 pb-2">
                AUTOMATED LEDGER LEDGER ENTRIES:
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
                <span>3. Platform Take-Rate (10.0%):</span>
                <span>+${(simulatedGross * 0.1).toFixed(2)}</span>
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
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
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
                  <span className="font-mono-code tabular-nums text-purple-700 font-bold">{rate}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={rate}
                  onChange={(e) => setCommissionRates(prev => ({ ...prev, [category]: parseInt(e.target.value) }))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vendor KYB Approval Queue */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">New Merchant Onboarding Queue (KYB Checks)</h3>
            <p className="text-xs text-slate-500">Automated verification against IRS TIN and State Entity registries</p>
          </div>
          <span className="text-xs font-mono-code text-slate-500">2 Pending Reviews</span>
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
                  <td className="py-3 px-4 font-mono-code text-slate-600">{app.taxId}</td>
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
                      <span className="text-slate-400 font-mono-code text-[11px]">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispute Resolution Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-slate-900" />
            <h3 className="font-bold text-slate-900 text-sm">Escrow Dispute Mediation Desk</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono-code">Smart Escrow Hold</span>
        </div>

        {disputes.map((d) => (
          <div key={d.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono-code text-slate-900">{d.orderId}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-700 font-medium">Customer: {d.customer} vs {d.vendor}</span>
              </div>
              <p className="text-slate-600">{d.reason}</p>
              <div className="text-[11px] font-mono-code text-amber-800">
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
