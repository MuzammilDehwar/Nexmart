import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Package, 
  FileText, 
  Download, 
  Check, 
  ArrowUpRight, 
  Clock, 
  DollarSign,
  Camera,
  Sliders,
  RefreshCw
} from 'lucide-react';

export const VendorPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'studio' | 'invoicing' | 'inventory'>('overview');
  const [studioProcessing, setStudioProcessing] = useState(false);
  const [studioBackdrop, setStudioBackdrop] = useState<'white' | 'travertine' | 'dark'>('travertine');
  const [bgRemoved, setBgRemoved] = useState(true);
  const [stockCounts, setStockCounts] = useState<{ [id: string]: number }>({
    'SKU-AUD-01': 42,
    'SKU-AUD-02': 18,
    'SKU-ACC-05': 8
  });

  const handleRunAiStudio = () => {
    setStudioProcessing(true);
    setTimeout(() => {
      setStudioProcessing(false);
      setBgRemoved(true);
    }, 900);
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-6">
      {/* Vendor Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 pt-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">Vendor ID: VEN-101</span>
            <span aria-hidden="true">·</span>
            <span>Lumina Audio Labs (Verified Merchant)</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Stripe Connect: Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mt-1">
            Seller & Vendor Central
          </h1>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          {[
            { id: 'overview', label: 'Dashboard & Sales' },
            { id: 'studio', label: 'AI Product Studio' },
            { id: 'invoicing', label: 'Invoices & Payouts' },
            { id: 'inventory', label: 'SKU Inventory' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">30-Day Gross Volume</span>
              <div className="text-2xl font-bold font-display text-slate-900 tabular-nums">$48,920.00</div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>+24.8% vs last month</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Net Escrow Payout (90%)</span>
              <div className="text-2xl font-bold font-display text-slate-900 tabular-nums text-emerald-700">$44,028.00</div>
              <div className="text-[11px] text-slate-500">10% Platform commission deducted</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Orders Pending Dispatch</span>
              <div className="text-2xl font-bold font-display text-slate-900 tabular-nums">7 Packages</div>
              <div className="text-[11px] text-blue-700 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Avg SLA: 3.4 hrs to carrier scan</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Seller Quality Score</span>
              <div className="text-2xl font-bold font-display text-slate-900 tabular-nums">4.92 / 5.0</div>
              <div className="text-[11px] text-emerald-700 font-medium">Top 2% Tier (Priority Search Ranking)</div>
            </div>
          </div>

          {/* Live Order Queue */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Recent Direct-to-Consumer Orders</h3>
                <p className="text-xs text-slate-500">Dispatched through automated FedEx API integration</p>
              </div>
              <span className="text-xs text-slate-500 font-mono-code">Auto-sync: Active (Webhooks)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Sub-Order ID</th>
                    <th className="py-3 px-4 font-semibold">Customer / Destination</th>
                    <th className="py-3 px-4 font-semibold">Ordered SKU</th>
                    <th className="py-3 px-4 font-semibold">Subtotal</th>
                    <th className="py-3 px-4 font-semibold">Net Payout</th>
                    <th className="py-3 px-4 font-semibold">Carrier Tracking</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono-code font-semibold text-slate-900">#VO-101-8812</td>
                    <td className="py-3 px-4 text-slate-700">Julian Vance (San Francisco, CA)</td>
                    <td className="py-3 px-4 text-slate-600">Aura Sound Pro (Matte Gray) × 1</td>
                    <td className="py-3 px-4 font-mono-code tabular-nums font-semibold">$349.00</td>
                    <td className="py-3 px-4 font-mono-code tabular-nums text-emerald-700 font-semibold">$314.10</td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-mono-code">
                        FDX-9921401
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded">
                        Print Label
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono-code font-semibold text-slate-900">#VO-101-8819</td>
                    <td className="py-3 px-4 text-slate-700">Elena Rostova (Austin, TX)</td>
                    <td className="py-3 px-4 text-slate-600">Aura Sound Pro (Midnight) × 2</td>
                    <td className="py-3 px-4 font-mono-code tabular-nums font-semibold">$698.00</td>
                    <td className="py-3 px-4 font-mono-code tabular-nums text-emerald-700 font-semibold">$628.20</td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded font-medium">
                        Awaiting Pick
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-2.5 py-1 text-[11px] font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded">
                        Dispatch
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Product Studio */}
      {activeTab === 'studio' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-purple-700 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Vendor Automation Engine</span>
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900 mt-0.5">
                  Automated Product Photo Studio & Background Segmentation
                </h3>
                <p className="text-xs text-slate-500">
                  Transform raw phone camera snapshots into commercial 8k catalog shots adhering to marketplace compliance standards.
                </p>
              </div>

              <button
                onClick={handleRunAiStudio}
                disabled={studioProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {studioProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Vision Model...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Run AI Studio Enhancement</span>
                  </>
                )}
              </button>
            </div>

            {/* Studio Canvas Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Interactive Studio Output Preview</span>
                  <span className="text-slate-400 font-normal">SegmentAnything + Travertine Diffusion</span>
                </div>

                <div className={`relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 transition-all ${
                  studioBackdrop === 'white' ? 'bg-white' : studioBackdrop === 'dark' ? 'bg-slate-900' : 'bg-stone-100'
                }`}>
                  <img
                    src="/src/assets/images/product_headphones_studio_1792380849129.jpg"
                    alt="AI Studio Result"
                    className="w-full h-full object-cover transition-opacity duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-white font-mono-code">
                    Compliance: 100% Amazon/Google Shopping Ready
                  </div>
                </div>

                {/* Backdrop controls */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-500 font-medium">Virtual Backdrop:</span>
                  {[
                    { id: 'travertine', label: 'Neutral Travertine' },
                    { id: 'white', label: 'Pure Studio White' },
                    { id: 'dark', label: 'Obsidian Slate' },
                  ].map(b => (
                    <button
                      key={b.id}
                      onClick={() => setStudioBackdrop(b.id as any)}
                      className={`px-2.5 py-1 rounded text-xs font-medium border ${
                        studioBackdrop === b.id
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Copy & Metadata Generator */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Generated SEO Product Title</span>
                    <span className="text-[11px] text-purple-700 font-medium">Algolia Weighted</span>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value="Aura Sound Pro - Wireless Over-Ear Active Noise Cancelling Headphones (48h Battery)"
                    className="w-full p-2 bg-white border border-slate-200 rounded text-xs text-slate-900 font-medium"
                  />

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-800">Automated Spec Extraction (JSON-LD)</span>
                    <pre className="p-3 bg-slate-900 text-slate-200 rounded text-[11px] font-mono-code overflow-x-auto">
{`{
  "@type": "Product",
  "name": "Aura Sound Pro",
  "brand": "Lumina Audio Labs",
  "material": "Aircraft Aluminum & Nappa Leather",
  "batteryLife": "48 Hours",
  "connectivity": "Bluetooth 5.3 + Lossless LDAC",
  "ancDbReduction": "-42dB"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Invoicing & Payouts */}
      {activeTab === 'invoicing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-display">
                  Automated Settlement & Tax Statement #INV-2026-OCT-1
                </h3>
                <p className="text-xs text-slate-500">
                  Period: Oct 1, 2026 – Oct 15, 2026 · Paid via Stripe Direct Deposit
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Tax Invoice (PDF)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono-code">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 mb-1">TOTAL MERCHANDISE VALUE</div>
                <div className="text-xl font-bold text-slate-900 tabular-nums">$24,450.00</div>
                <div className="text-[11px] text-slate-500 mt-1">70 items fulfilled successfully</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 mb-1">PLATFORM TAKE RATE (10.0%)</div>
                <div className="text-xl font-bold text-purple-700 tabular-nums">-$2,445.00</div>
                <div className="text-[11px] text-slate-500 mt-1">Contract tier rate for Audio Category</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 mb-1">NET VENDOR PAYOUT</div>
                <div className="text-xl font-bold text-emerald-700 tabular-nums">$22,005.00</div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">Status: Transferred to Bank Account</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">SKU / Item Description</th>
                    <th className="py-2.5 px-4 font-semibold">Units Sold</th>
                    <th className="py-2.5 px-4 font-semibold">Gross Sales</th>
                    <th className="py-2.5 px-4 font-semibold">Commission (10%)</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Net Payable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-code">
                  <tr>
                    <td className="py-2.5 px-4 font-sans font-medium text-slate-900">Aura Sound Pro (ANC Flagship)</td>
                    <td className="py-2.5 px-4 tabular-nums">50</td>
                    <td className="py-2.5 px-4 tabular-nums">$17,450.00</td>
                    <td className="py-2.5 px-4 tabular-nums text-slate-500">$1,745.00</td>
                    <td className="py-2.5 px-4 tabular-nums text-emerald-700 font-semibold text-right">$15,705.00</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-sans font-medium text-slate-900">Aura Replacement Nappa Leather Pads</td>
                    <td className="py-2.5 px-4 tabular-nums">20</td>
                    <td className="py-2.5 px-4 tabular-nums">$7,000.00</td>
                    <td className="py-2.5 px-4 tabular-nums text-slate-500">$700.00</td>
                    <td className="py-2.5 px-4 tabular-nums text-emerald-700 font-semibold text-right">$6,300.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: SKU Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Real-Time Warehouse Stock Matrix</h3>
              <p className="text-xs text-slate-500">Atomic inventory locking backed by Redis Redlock cluster</p>
            </div>
            <span className="text-xs font-mono-code text-slate-500">Node: us-west-2a</span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">SKU Identifier</th>
                  <th className="py-2.5 px-4 font-semibold">Variant / Attributes</th>
                  <th className="py-2.5 px-4 font-semibold">Available Stock</th>
                  <th className="py-2.5 px-4 font-semibold">Reserved in Active Carts</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(stockCounts).map(([sku, count]) => (
                  <tr key={sku}>
                    <td className="py-3 px-4 font-mono-code font-bold text-slate-900">{sku}</td>
                    <td className="py-3 px-4 text-slate-700">Space Gray / 48h Battery</td>
                    <td className="py-3 px-4 font-mono-code tabular-nums font-semibold text-slate-900">{count} units</td>
                    <td className="py-3 px-4 font-mono-code tabular-nums text-amber-700">3 reserved (5m TTL)</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setStockCounts(prev => ({ ...prev, [sku]: prev[sku] + 10 }))}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px]"
                      >
                        +10 Units
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
