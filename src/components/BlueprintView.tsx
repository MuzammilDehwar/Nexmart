import React, { useState } from 'react';
import { 
  Server, 
  Layers, 
  Sparkles, 
  Database, 
  Milestone, 
  Check, 
  Copy, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Globe,
  GitBranch,
  Split
} from 'lucide-react';
import { TECH_STACK_MATRIX, ROADMAP_PHASES } from '../data/blueprintData';

interface BlueprintViewProps {
  onNavigateToPrototype: (tab: 'customer' | 'vendor' | 'admin' | 'schema') => void;
  onCopyMarkdown: () => void;
  hasCopied: boolean;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({
  onNavigateToPrototype,
  onCopyMarkdown,
  hasCopied
}) => {
  const [activeSubSection, setActiveSubSection] = useState<'all' | 'arch' | 'modules' | 'competitive' | 'db' | 'roadmap'>('all');

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Overview */}
      <section className="bg-white border-b border-slate-200 py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Enterprise Blueprint</span>
            <span aria-hidden="true">·</span>
            <span>Principal Software Architect</span>
            <span aria-hidden="true">·</span>
            <span>Sub-50ms SLA Target</span>
          </div>

          <div className="max-w-4xl space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-slate-900 leading-tight">
              Next-Generation Multi-Vendor E-Commerce Marketplace
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              An enterprise-grade architectural blueprint engineered to surpass legacy e-commerce platforms like Amazon in speed, modularity, vendor empowerment, and AI-native automation. Built on polyglot persistence, event-driven microservices, and modern headless frontends.
            </p>
          </div>

          {/* Quick Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {[
              { id: 'all', label: 'Complete Blueprint' },
              { id: 'arch', label: '1. Architecture & Stack' },
              { id: 'modules', label: '2. Functional Modules' },
              { id: 'competitive', label: '3. Amazon-Beater Edge' },
              { id: 'db', label: '4. Database Schema' },
              { id: 'roadmap', label: '5. Execution Roadmap' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSubSection(item.id as any)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeSubSection === item.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={onCopyMarkdown}
              className="ml-auto flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            >
              {hasCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Copied Markdown</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 space-y-16">

        {/* Section 1: Architecture & Tech Stack */}
        {(activeSubSection === 'all' || activeSubSection === 'arch') && (
          <section id="section-1" className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Module 01
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mt-1">
                System Architecture & High-Scalability Tech Stack
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Distributed, event-driven topology decoupling high-throughput catalog reads from transactional checkout consensus.
              </p>
            </div>

            {/* Architecture Diagram Card */}
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 md:p-8 font-mono-code text-xs overflow-x-auto shadow-lg border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 pb-4 mb-4 border-b border-slate-800">
                <span className="font-semibold text-white">HIGH-LEVEL SYSTEM TOPOLOGY & EVENT BUS</span>
                <span className="text-emerald-400">Target Throughput: 100k+ RPS · Sub-50ms p95</span>
              </div>
              <pre className="leading-relaxed text-slate-300">
{`+---------------------------------------------------------------------------------------------------+
| CLIENT LAYER: Next.js 15 PWA Storefront | Mobile (Flutter/React Native) | Vendor & Admin Portals  |
+---------------------------------------------------------------------------------------------------+
                                                  | HTTPS / HTTP3 / gRPC-Web
                                                  v
+---------------------------------------------------------------------------------------------------+
| EDGE CDN & SECURITY: Cloudflare Enterprise / AWS CloudFront + AWS WAF + DDoS Shield + SSL Term.    |
| - Edge Caching for ISR Pages (HTML/JSON) & Cloudinary/S3 Media Assets (<15ms globally)            |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| API GATEWAY & INGRESS: Envoy / Kong Gateway / Traefik                                              |
| - Rate Limiting (Token Bucket) | JWT/OAuth2 Verification | Circuit Breakers | Distributed Tracing  |
+---------------------------------------------------------------------------------------------------+
          |                                       |                                      |
          v                                       v                                      v
+-----------------------+               +-----------------------+              +--------------------+
|  CATALOG & SEARCH SVC |               | ORDER & CHECKOUT SVC  |              | AI RECOMMENDATION  |
|  (Node.js / NestJS)   |               | (Go / Gin - High RPS) |              | (FastAPI / Python) |
| - OpenSearch/Algolia  |               | - Two-Phase Commit    |              | - Realtime Vectors |
| - Dynamic Filters     |               | - Distributed Locks   |              | - Gemini / PyTorch |
+-----------------------+               +-----------------------+              +--------------------+
          |                                       |                                      |
          +-----------------------+---------------+--------------------------------------+
                                  |
                                  v
+---------------------------------------------------------------------------------------------------+
| EVENT STREAMING & ASYNC BUS: Apache Kafka / Redpanda Cluster                                      |
| Topics: 'orders.created' | 'inventory.reserved' | 'payment.succeeded' | 'vendor.notified'          |
+---------------------------------------------------------------------------------------------------+
          |                                       |                                      |
          v                                       v                                      v
+-----------------------+               +-----------------------+              +--------------------+
|  INVENTORY & FULFILL  |               | PAYMENTS & ESCROW     |              | NOTIFICATIONS & BI |
|  (Go Microservice)    |               | (Stripe Connect / Go) |              | (Async Workers)    |
| - Atomic Stock Locks  |               | - Multi-Vendor Split  |              | - Push/Email/SMS   |
+-----------------------+               +-----------------------+              +--------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| POLYGLOT PERSISTENCE LAYER:                                                                       |
| 1. PostgreSQL 16 (Aurora Multi-AZ): ACID Ledger, Users, Orders, Vendor Splits, Escrow, KYC        |
| 2. MongoDB Atlas (Replica Set): Polymorphic Product Catalog, Dynamic Variant Schemas, Metadata    |
| 3. Redis Cluster (v7 In-Memory): Sub-millisecond Session Store, Distributed Lock, Cart State      |
| 4. OpenSearch / Algolia: Inverted Index for typo-tolerant faceted search & vector embeddings      |
+---------------------------------------------------------------------------------------------------+`}
              </pre>
            </div>

            {/* Tech Stack Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {TECH_STACK_MATRIX.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-900" />
                    <h3 className="font-bold text-slate-900 font-display text-base">
                      {item.layer}
                    </h3>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {item.technologies.map((tech, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-1.5">
                        <span className="text-slate-400 font-bold">›</span>
                        <span className="font-medium text-slate-900">{tech}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="font-semibold text-slate-700">Rationale: </span>
                    {item.rationale}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Core Functional Modules */}
        {(activeSubSection === 'all' || activeSubSection === 'modules') && (
          <section id="section-2" className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Module 02
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mt-1">
                Core Functional Modules (Tri-Portal Architecture)
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Independent yet unified portals tailored for Customers, Independent Vendors, and Platform Super Admins.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Portal */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">CONSUMER FACING</span>
                    <Globe className="w-4 h-4 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-900">
                    Customer Experience Portal
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Designed for zero friction, instant discovery, and transparent multi-vendor logistics.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 pt-2">
                    <li className="flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Instant Fuzzy Search:</strong> Algolia/OpenSearch with live predictive autocomplete under 15ms.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Split className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Multi-Vendor Cart Splitting:</strong> One checkout splits into vendor-specific orders transparently.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Cryptographically Verified Reviews:</strong> Reviews linked to delivered blockchain/receipt hash with media uploads.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Cpu className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span><strong>Dynamic Pricing & Stock Alerts:</strong> Real-time price tracking and back-in-stock web push alerts.</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => onNavigateToPrototype('customer')}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  <span>Launch Customer Prototype</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Vendor Central */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">MERCHANT FACING</span>
                    <Server className="w-4 h-4 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-900">
                    Seller & Vendor Central
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Giving independent sellers modern tools that surpass Amazon Seller Central's cluttered UX.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 pt-2">
                    <li className="flex items-start gap-2">
                      <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Real-Time Inventory Matrix:</strong> Multi-warehouse stock tracking with low-inventory threshold triggers.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span><strong>AI Vendor Studio:</strong> 1-Click background removal, studio light correction, and auto-tagging.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <GitBranch className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Shipping & Carrier Hub:</strong> Direct API hooks for FedEx, DHL Express, and Shippo label generation.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span><strong>Automated Invoicing & Payouts:</strong> Transparent commission breakdown and instant ledger settlement.</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => onNavigateToPrototype('vendor')}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  <span>Launch Vendor Central</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Super Admin Control Tower */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">PLATFORM GOVERNANCE</span>
                    <ShieldCheck className="w-4 h-4 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-900">
                    Super Admin Control Tower
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Total financial oversight, automated escrow settlements, and AI fraud monitoring.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 pt-2">
                    <li className="flex items-start gap-2">
                      <Split className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Dynamic Commission Engine:</strong> Rule-based category take rates (e.g. 8% electronics, 15% luxury).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>KYB & Vendor Approval:</strong> Automated identity checks, tax ID verification, and risk profiling.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Cpu className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span><strong>AI Fraud & Bot Guard:</strong> Anomaly detection on rapid orders, review manipulation, and card testing.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Dispute Resolution Center:</strong> Three-party mediation ledger with escrow release/refund automation.</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => onNavigateToPrototype('admin')}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  <span>Launch Admin Tower</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Section 3: Competitive Edge */}
        {(activeSubSection === 'all' || activeSubSection === 'competitive') && (
          <section id="section-3" className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Module 03
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mt-1">
                Competitive Edge: Features Better Than Amazon
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Solving Amazon's legacy pain points: ad-bloated search results, slow vendor UI, fake reviews, and dated checkout flows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-purple-700">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold text-slate-900 font-display text-lg">
                    1. AI-Powered Conversational Discovery & Vision
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unlike Amazon's keyword search that pushes sponsored ads to the top 4 rows, NexMart employs multimodal vector search (CLIP + Gemini Embeddings). Customers can search in natural language: <em>"Find me a minimalist oak desk setup with acoustic headphones under $600"</em> or snap a photo of a room to generate matching cart suggestions.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 font-mono-code border border-slate-200">
                  Latency: ~35ms | Vector Dimensions: 768 | Hybrid BM25 + Dense Retrieval
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-blue-700">
                  <Zap className="w-5 h-5" />
                  <h3 className="font-bold text-slate-900 font-display text-lg">
                    2. Frictionless Multi-Vendor 1-Click Checkout
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When a customer purchases items from 4 distinct vendors in one basket, NexMart calculates real-time shipping combinations, applies automatic coupon optimization, and executes a unified payment transaction. In the background, Stripe Connect automatically splits funds into isolated escrow sub-ledgers.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 font-mono-code border border-slate-200">
                  Supported: Apple Pay · Google Pay · Stripe · Klarna BNPL · Local Gateways · COD
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Cpu className="w-5 h-5" />
                  <h3 className="font-bold text-slate-900 font-display text-lg">
                    3. AI Vendor Studio & Autonomous Catalog Engine
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Small vendors waste thousands on studio photography. NexMart integrates an automated serverless vision pipeline that strips phone-camera backgrounds, composites products onto crisp editorial studio surfaces, standardizes lighting, and generates multi-language SEO copy with zero manual work.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 font-mono-code border border-slate-200">
                  Pipeline: OpenCV + Rembg / SegmentAnything + WebP / AVIF compression
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-rose-700">
                  <Globe className="w-5 h-5" />
                  <h3 className="font-bold text-slate-900 font-display text-lg">
                    4. Social Commerce & Native Live Video Selling
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Live selling is a $500B+ market in Asia yet poorly integrated into Amazon. NexMart delivers native low-latency WebRTC/HLS live streaming channels where verified brand founders can broadcast product unboxings with synchronized interactive 1-click purchase overlays right in the video stream.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 font-mono-code border border-slate-200">
                  Streaming: Cloudflare Stream / AWS IVS | Latency: &lt;1.5s Ultra-Low Latency
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 4: Database Schema Design */}
        {(activeSubSection === 'all' || activeSubSection === 'db') && (
          <section id="section-4" className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Module 04
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mt-1">
                Database Schema Design & Polyglot Storage
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Engineered for maximum consistency where money is involved (PostgreSQL) and boundless elasticity where products live (MongoDB & Redis).
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-2xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">PostgreSQL (Relational Core)</div>
                  <div className="text-slate-600">Users, Vendors, Orders, Sub-orders, Order Items, Escrow Ledgers, Reviews. ACID isolation for payments.</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">MongoDB Atlas (Document Catalog)</div>
                  <div className="text-slate-600">Polymorphic products, dynamic custom attributes per category, rich media, and 768-dim vector embeddings.</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Redis Cluster (Distributed State)</div>
                  <div className="text-slate-600">Real-time cart sessions, stock reservation Redlock, high-speed rate limiting, and frequent query caches.</div>
                </div>
              </div>

              {/* Data Flow ASCII */}
              <div className="bg-slate-900 text-slate-200 p-5 rounded-xl font-mono-code text-xs overflow-x-auto">
                <div className="text-slate-400 font-semibold mb-2">TRANSACTION ORDER SPLIT CONSISTENCY FLOW</div>
{`1. Customer clicks [1-Click Place Order] ($1,439.00 total)
   |
   +--> Redis Distributed Lock (Redlock) checks stock for all variant SKUs atomically
   |
   +--> PostgreSQL Master Transaction:
        BEGIN;
          INSERT INTO orders (id, customer_id, total_amount, payment_status) VALUES (...);
          
          -- Automatically split into Vendor Child Orders
          INSERT INTO vendor_orders (id, order_id, vendor_id, subtotal_amount, platform_commission, vendor_net_payout)
          VALUES 
            (vo_1, order_id, 'ven-101', $349.00, $34.90, $314.10),  -- Lumina Audio (10% comm.)
            (vo_2, order_id, 'ven-102', $880.00, $88.00, $792.00),  -- Vanguard Horology (10% comm.)
            (vo_3, order_id, 'ven-103', $210.00, $21.00, $189.00);  -- Nordic Craft (10% comm.)
            
          INSERT INTO order_items (...) VALUES (...);
        COMMIT;
   |
   +--> Publish Kafka Event 'orders.checkout.completed'
        |--> Stripe Connect issues PaymentIntent with Transfer Group (Escrow)
        |--> Vendor Webhooks trigger SMS & Email alerts to ship items`}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">Explore interactive table schemas, field constraints, and scale calculations</span>
                <button
                  onClick={() => onNavigateToPrototype('schema')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <span>Open Interactive Schema Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Section 5: Roadmap */}
        {(activeSubSection === 'all' || activeSubSection === 'roadmap') && (
          <section id="section-5" className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Module 05
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mt-1">
                Step-by-Step Development Roadmap
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Iterative execution strategy balancing immediate time-to-market with rock-solid architectural foundations.
              </p>
            </div>

            <div className="space-y-6">
              {ROADMAP_PHASES.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {item.timeline}
                      </span>
                      <h3 className="text-lg font-bold font-display text-slate-900 mt-0.5">
                        {item.phase}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-800 font-semibold rounded-md">
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-slate-600">
                    <strong className="text-slate-900">Strategic Focus:</strong> {item.focus}
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-semibold text-slate-700">Core Deliverables & Engineering Milestones:</span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                      {item.deliverables.map((del, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
