export const GENERATE_ENTERPRISE_BLUEPRINT_MARKDOWN = (): string => {
  return `# Next-Generation Multi-Vendor E-Commerce Marketplace
## Comprehensive Architectural Blueprint & Execution Roadmap
**Role:** Principal Software Architect & E-commerce Product Strategist  
**Target:** High-Throughput (100k+ RPS), Sub-50ms p95 Latency, Global Multi-Vendor Operations

---

## 1. System Architecture & High-Scalability Tech Stack

### 1.1 Architectural Paradigm: Event-Driven Modular Microservices
To outperform monolithic platforms like legacy Amazon, NexMart uses an **event-driven, decoupled microservices topology** orchestrated via Kubernetes and an Apache Kafka / Redpanda event backbone. 

High-frequency catalog reads are decoupled from transactional write consensus, guaranteeing that flash sales never degrade checkout latency.

\`\`\`
+---------------------------------------------------------------------------------------------------+
| CLIENT LAYER: Next.js 15 PWA Storefront | Mobile (Flutter/React Native) | Vendor & Admin Portals  |
+---------------------------------------------------------------------------------------------------+
                                                  | HTTPS / HTTP3 / gRPC-Web
                                                  v
+---------------------------------------------------------------------------------------------------+
| EDGE CDN & SECURITY: Cloudflare Enterprise / AWS CloudFront + WAF + Shield DDoS + SSL Term.       |
| - Edge Caching for ISR Pages (HTML/JSON) & Cloudinary/S3 Media Assets (<15ms globally)            |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| API GATEWAY & INGRESS: Envoy / Kong Gateway                                                       |
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
                                  |
                                  v
+---------------------------------------------------------------------------------------------------+
| EVENT STREAMING & ASYNC BUS: Apache Kafka / Redpanda Cluster                                      |
| Topics: 'orders.created' | 'inventory.reserved' | 'payment.succeeded' | 'vendor.notified'          |
+---------------------------------------------------------------------------------------------------+
                                  |
                                  v
+---------------------------------------------------------------------------------------------------+
| POLYGLOT PERSISTENCE LAYER:                                                                       |
| 1. PostgreSQL 16 (Aurora Multi-AZ): ACID Ledger, Users, Orders, Vendor Splits, Escrow, KYC        |
| 2. MongoDB Atlas (Replica Set): Polymorphic Product Catalog, Dynamic Variant Schemas, Metadata    |
| 3. Redis Cluster (v7 In-Memory): Sub-millisecond Session Store, Distributed Lock, Cart State      |
| 4. OpenSearch / Algolia: Inverted Index for typo-tolerant faceted search & vector embeddings      |
+---------------------------------------------------------------------------------------------------+
\`\`\`

### 1.2 Technology Stack Matrix & Decision Rationale

| Layer | Technologies Selected | Strategic Rationale & SLA |
| :--- | :--- | :--- |
| **Frontend & Edge** | Next.js 15 (App Router, Server Components), React 19, Tailwind CSS v4, TypeScript, Cloudflare Workers | Sub-second First Contentful Paint (FCP); Incremental Static Regeneration (ISR) builds 10M+ product pages on demand; edge caching renders pages in <20ms globally. |
| **High-Throughput Backend** | Go (Golang) with Gin / Fiber for Orders, Checkout, and Inventory Services | Go handles 50,000+ concurrent connections per instance with minimal memory footprint (15-30MB RAM vs 300MB in Node/Java), ensuring zero garbage collection pauses during checkout spikes. |
| **Core Domain Services** | Node.js (NestJS) for Catalog, Vendor Management, Auth, and Webhooks | Modular Domain-Driven Design (DDD), rich TypeScript typings, rapid feature iteration, and ecosystem breadth for payment/carrier SDKs. |
| **AI & Vision Pipeline** | Python (FastAPI, PyTorch, OpenCV, Segment-Anything) | Python processes vendor photo background removals, vector embeddings, and real-time semantic recommendation scoring. |
| **Relational Data** | PostgreSQL 16 (AWS Aurora Multi-AZ with read replicas) | Strict ACID transactional semantics for orders, line items, wallet balances, and vendor payout ledgers. |
| **Document Catalog** | MongoDB Atlas (Multi-Region Replica Set) | Polymorphic catalog schema allowing arbitrary category attributes (e.g. shoe sizes vs laptop specs) without database migrations. |
| **Cache & Locks** | Redis 7.2 Enterprise Cluster (Multi-AZ) | Sub-millisecond distributed locks (Redlock) for atomic inventory reservation; session state; shopping cart caching. |
| **Search Engine** | OpenSearch 2.x / Algolia InstantSearch | Typo-tolerant fuzzy search (<15ms), prefix matching, facet generation, and pgvector semantic reranking. |
| **DevOps & Cloud** | AWS EKS / GCP GKE, Docker, Terraform, Helm, Datadog | Self-healing Kubernetes clusters with Horizontal Pod Autoscalers (HPA) scaling pods in <30 seconds on CPU/Memory/Queue thresholds. |

---

## 2. Core Functional Modules (Tri-Portal Breakdown)

### 2.1 Customer Experience Portal (Consumer-Facing)
1. **Ultra-Fast Catalog Discovery**:
   - Algolia/OpenSearch instant predictive search as you type.
   - Dynamic multi-facet filtering (Category, Price, Brand, Delivery Speed, Star Rating).
   - Real-time stock availability with low-stock badges ("Only 3 left in stock").
2. **AI Semantic Assistant & Multimodal Querying**:
   - Natural language conversational shopping queries (*"Find me a noise-canceling headset for remote work under $350"*).
   - Multimodal visual search: upload an image to match catalog products via vector cosine similarity.
3. **Multi-Vendor Cart Splitting**:
   - Unified single cart allowing items from multiple vendors.
   - Transparent sub-order grouping showing each vendor's name, dispatch location, and shipping ETA.
4. **Frictionless 1-Click Checkout**:
   - Saved payment tokenization via Stripe Elements / Apple Pay / Google Pay / Klarna BNPL / Cash on Delivery.
   - Automated address validation and postal code lookup.
5. **Cryptographically Verified Reviews**:
   - Reviews strictly restricted to customers who completed and received an order (tied to order ID & carrier delivery proof).
   - Customer unboxing photo and video upload verification with anti-spam moderation.

### 2.2 Seller & Vendor Central (Merchant-Facing)
1. **Real-Time Inventory Matrix**:
   - SKU, variant, barcode, and batch tracking across multi-location warehouses.
   - Low-inventory threshold alerts triggering automated restocking recommendations.
2. **AI Vendor Photography Studio**:
   - Automated background removal for phone-camera snapshots using Segment-Anything / Rembg.
   - AI studio lighting enhancement and white travertine/editorial studio backdrops.
   - Automatic generation of SEO meta tags and JSON-LD schema.
3. **Shipping & Carrier Integration**:
   - Direct integration with FedEx, DHL Express, UPS, and Shippo API.
   - 1-Click shipping label generation and automatic customer tracking notification webhooks.
4. **Automated Invoicing & Payouts**:
   - Itemized bi-weekly / on-demand settlement statements.
   - Automated deduction of category commission (e.g., 10%) and payment gateway processing fees.
   - Direct bank transfer via Stripe Connect Custom / Express.

### 2.3 Super Admin Control Tower (Platform Governance)
1. **Dynamic Commission Engine**:
   - Granular take-rate configuration per category (e.g., 8% electronics, 15% apparel, 20% luxury).
   - Tiered commission incentives for high-volume, high-rating sellers.
2. **KYB & Merchant Verification**:
   - Automated business tax ID (EIN / VAT), business registration, and bank verification.
   - Risk scoring based on fraud databases and identity verification.
3. **Escrow & Dispute Resolution**:
   - Customer payments held in secure escrow until carrier confirms delivery or 7-day inspection window passes.
   - Three-party dispute mediation desk (Customer, Vendor, Admin) with automated refund or payout release.
4. **AI Fraud Detection & Anti-Counterfeit Guard**:
   - Automated pattern detection for card testing, fake review rings, wash trading, and duplicate catalog listings.

---

## 3. Competitive Edge (Outperforming Amazon)

1. **Clean, Anti-Ad Interface**:
   Amazon fills the first 3-4 viewport scrolls with "Sponsored" paid ads. NexMart delivers a pure, relevance-first search experience where organic quality and genuine customer reviews rank first.
2. **Sub-Second Performance**:
   Next.js 15 Server Components and Edge ISR deliver page loads in under 300ms, compared to Amazon's 1.8s+ cluttered legacy pages.
3. **AI Vendor Empowerment**:
   Small independent sellers can launch professional studio catalogs in minutes without expensive photography studios or agency retainers.
4. **Modern Payment Flexibility**:
   Native support for Buy Now Pay Later (Klarna, Affirm), local digital wallets, cryptocurrency stablecoins (USDC), and localized Cash on Delivery.
5. **Integrated Live Social Commerce**:
   Native interactive live-stream shopping with synchronized in-video 1-click buy overlays.

---

## 4. Database Schema Design (Polyglot Architecture)

### 4.1 Relational Storage (PostgreSQL 16)

\`\`\`sql
-- 1. USERS TABLE
CREATE TABLE users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               VARCHAR(255) UNIQUE NOT NULL,
  password_hash       VARCHAR(255) NOT NULL,
  full_name           VARCHAR(120) NOT NULL,
  phone               VARCHAR(32),
  role                VARCHAR(20) DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'VENDOR', 'ADMIN', 'SUPPORT')),
  is_email_verified   BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);

-- 2. VENDORS TABLE
CREATE TABLE vendors (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE RESTRICT,
  store_name          VARCHAR(150) UNIQUE NOT NULL,
  slug                VARCHAR(160) UNIQUE NOT NULL,
  commission_rate     NUMERIC(5,2) DEFAULT 10.00,
  verification_status VARCHAR(20) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
  stripe_connect_id   VARCHAR(100),
  rating_average      NUMERIC(3,2) DEFAULT 5.00,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_vendors_slug ON vendors(slug);

-- 3. ORDERS (MASTER TRANSACTION)
CREATE TABLE orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        VARCHAR(32) UNIQUE NOT NULL,
  customer_id         UUID REFERENCES users(id),
  total_amount        NUMERIC(12,2) NOT NULL,
  tax_amount          NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  shipping_amount     NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  payment_status      VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
  payment_gateway_ref VARCHAR(100),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- 4. VENDOR_ORDERS (SUB-ORDERS PER VENDOR)
CREATE TABLE vendor_orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID REFERENCES orders(id) ON DELETE CASCADE,
  vendor_id           UUID REFERENCES vendors(id),
  subtotal_amount     NUMERIC(12,2) NOT NULL,
  platform_commission NUMERIC(10,2) NOT NULL,
  vendor_net_payout   NUMERIC(12,2) NOT NULL,
  status              VARCHAR(20) DEFAULT 'PROCESSING' CHECK (status IN ('PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'DISPUTED')),
  tracking_number     VARCHAR(100),
  carrier_code        VARCHAR(50),
  payout_status       VARCHAR(20) DEFAULT 'PENDING_ESCROW' CHECK (payout_status IN ('PENDING_ESCROW', 'TRANSFERRED', 'HELD')),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_vendor_orders_vendor ON vendor_orders(vendor_id);
CREATE INDEX idx_vendor_orders_order ON vendor_orders(order_id);

-- 5. ORDER_ITEMS (LINE ITEMS)
CREATE TABLE order_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_order_id     UUID REFERENCES vendor_orders(id) ON DELETE CASCADE,
  product_id          VARCHAR(64) NOT NULL,
  variant_sku         VARCHAR(64) NOT NULL,
  unit_price          NUMERIC(10,2) NOT NULL,
  quantity            INT NOT NULL CHECK (quantity > 0)
);

-- 6. REVIEWS
CREATE TABLE reviews (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          VARCHAR(64) NOT NULL,
  user_id             UUID REFERENCES users(id),
  order_id            UUID REFERENCES orders(id),
  rating              SMALLINT CHECK (rating BETWEEN 1 AND 5),
  title               VARCHAR(200),
  body                TEXT,
  is_verified         BOOLEAN DEFAULT TRUE,
  media_urls          TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_reviews_product ON reviews(product_id);
\`\`\`

### 4.2 Document Catalog Storage (MongoDB Atlas)

\`\`\`json
{
  "_id": "ObjectId('6711a91e5f8b91a24d001001')",
  "vendor_id": "8f3b2e10-9182-4c22-b9e1-64d128384910",
  "title": "Aura Sound Pro Wireless ANC Headphones",
  "slug": "aura-sound-pro-wireless-anc-headphones",
  "category_path": ["Electronics", "Audio Hardware", "Headphones"],
  "base_price": 349.00,
  "currency": "USD",
  "variants": [
    {
      "sku": "AUR-GRY-01",
      "color": "Matte Space Gray",
      "price_delta": 0.00,
      "stock_quantity": 42,
      "barcode": "890124981290"
    },
    {
      "sku": "AUR-BLK-02",
      "color": "Midnight Obsidian",
      "price_delta": 20.00,
      "stock_quantity": 18,
      "barcode": "890124981291"
    }
  ],
  "attributes": {
    "battery_life": "48 Hours",
    "noise_cancellation": "Adaptive Hybrid ANC (-42dB)",
    "driver_size": "45mm Titanium-plated",
    "weight": "248g"
  },
  "media": {
    "primary_image": "https://cdn.nexmart.io/prod_headphones_studio.webp",
    "gallery": [
      "https://cdn.nexmart.io/prod_headphones_angle.webp",
      "https://cdn.nexmart.io/prod_headphones_case.webp"
    ]
  },
  "vector_embedding": [0.0124, -0.0481, 0.0892, "... 768 dimensions ..."],
  "created_at": "2026-10-18T00:00:00Z"
}
\`\`\`

---

## 5. Step-by-Step Development Roadmap

### Phase 1: MVP & Core Transaction Engine (Months 1 – 3)
- **Goal:** Rapid market launch with verified sellers and rock-solid checkout.
- **Milestones:**
  1. Next.js 15 SSR/ISR storefront with sub-300ms catalog browsing.
  2. Core Postgres schema and NestJS backend monolith with modular domain boundaries.
  3. Stripe Connect Express integration with multi-vendor split cart transactions.
  4. Algolia / OpenSearch fuzzy autocomplete catalog search.
  5. Basic Seller Portal for stock entry and manual order fulfillment.

### Phase 2: Vendor Automation & Platform Flywheel (Months 4 – 6)
- **Goal:** Empower sellers, automate logistics, and establish platform governance.
- **Milestones:**
  1. Dedicated Vendor Central with automated invoicing, settlement statements, and tax calculation.
  2. Automated AI Photo Studio: background removal (Segment-Anything) and auto-tagging.
  3. Integrated Carrier Webhooks (FedEx, DHL, Shippo) with automated label generation.
  4. Super Admin Control Tower with dynamic category commissions and KYB approval workflow.
  5. Escrow dispute mediation desk.

### Phase 3: Hyper-Scale, AI Personalization & Mobile (Months 7 – 12)
- **Goal:** Global resilience, native mobile apps, and viral social commerce.
- **Milestones:**
  1. Microservices decomposition: Orders & Inventory extracted into Go microservices.
  2. Kafka event streaming for distributed CDC and event sourcing.
  3. Multimodal AI recommendation engine and conversational shopping assistant.
  4. Live Video Commerce channel with real-time in-stream purchasing.
  5. Native Mobile Apps (Flutter / React Native) with biometrics 1-Click Pay.

---
*Blueprint engineered and documented by Principal Software Architect.*
`;
};
