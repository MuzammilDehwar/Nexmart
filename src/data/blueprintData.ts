export interface SchemaField {
  name: string;
  type: string;
  constraints?: string;
  description: string;
}

export interface SchemaTable {
  name: string;
  storage: 'PostgreSQL' | 'MongoDB' | 'Redis';
  description: string;
  fields: SchemaField[];
}

export const ARCHITECTURE_SECTIONS = [
  {
    id: 'system-architecture',
    title: '1. System Architecture & High-Scalability Tech Stack',
    summary: 'Cloud-native, event-driven modular microservices architecture designed for 100,000+ RPS and sub-50ms p95 latency.',
  },
  {
    id: 'core-modules',
    title: '2. Core Functional Modules Breakdown',
    summary: 'Comprehensive breakdown of Customer Storefront, Vendor Central, and Super Admin Control Tower.',
  },
  {
    id: 'competitive-edge',
    title: '3. Amazon-Beating Innovations',
    summary: 'AI-driven discovery, 1-Click multi-vendor checkout, automated vendor studio, and real-time live social commerce.',
  },
  {
    id: 'database-design',
    title: '4. Polyglot Persistence & Database Schema',
    summary: 'Hybrid relational PostgreSQL (orders/ledger), MongoDB (dynamic catalog), and Redis (in-memory caching & distributed locks).',
  },
  {
    id: 'execution-roadmap',
    title: '5. Phased Roadmap & Go-To-Market Plan',
    summary: 'Milestone execution from Phase 1 MVP (0-3 months) to Phase 2 Vendor Automation to Phase 3 Global Scale & Mobile.',
  },
];

export const TECH_STACK_MATRIX = [
  {
    layer: 'Frontend & Edge',
    technologies: ['Next.js 15 (App Router & SSR/ISR)', 'React 19', 'Tailwind CSS v4', 'TypeScript', 'Cloudflare Workers / Edge CDN'],
    rationale: 'Sub-second First Contentful Paint (FCP), static generation for 10M+ product pages with on-demand ISR revalidation, and zero layout shift.'
  },
  {
    layer: 'Backend Services',
    technologies: ['Node.js / NestJS (Core API Gateway & Orchestration)', 'Go (High-throughput Orders, Inventory & Payment Services)', 'Python FastAPI (AI Recommender & Media Processing)'],
    rationale: 'Go provides ultra-low latency & small memory footprint for hot checkout paths; NestJS provides fast domain-driven development; Python powers PyTorch/OpenCV AI pipelines.'
  },
  {
    layer: 'Data & Persistence',
    technologies: ['PostgreSQL 16 (Aurora Multi-AZ, Read Replicas, pgvector)', 'MongoDB Atlas (Product Catalog, Dynamic Attribute Schemas)', 'Redis Cluster v7 (Distributed locks, session cache, cart state)', 'Apache Kafka / Redpanda (Event bus for order events, CDC)'],
    rationale: 'ACID guarantees for transactions and financial ledgers; document flexibility for diverse multi-vendor attributes; sub-millisecond cache reads.'
  },
  {
    layer: 'Search & Discovery',
    technologies: ['Elasticsearch 8.x / OpenSearch + Algolia InstantSearch fallback', 'pgvector for semantic multimodal vector search'],
    rationale: 'Typo-tolerant instant auto-complete (<15ms), dynamic facet filtering, synonyms dictionary, and AI vector similarity.'
  },
  {
    layer: 'Cloud & Infrastructure',
    technologies: ['AWS EKS / GCP GKE (Kubernetes)', 'Docker & Helm', 'Terraform (IaC)', 'AWS S3 + CloudFront CDN / Cloudflare Enterprise', 'Datadog / Prometheus + Grafana (Distributed Tracing & APM)'],
    rationale: 'Zero single point of failure, automated horizontal pod autoscaling (HPA) during flash sales, automated multi-region disaster recovery.'
  }
];

export const DATABASE_SCHEMAS: SchemaTable[] = [
  {
    name: 'users',
    storage: 'PostgreSQL',
    description: 'Central user identity, multi-role authentication, and profile metadata.',
    fields: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique user identifier' },
      { name: 'email', type: 'VARCHAR(255)', constraints: 'UNIQUE, NOT NULL, INDEX', description: 'Normalized lowercase email' },
      { name: 'password_hash', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Argon2id cryptographic hash' },
      { name: 'full_name', type: 'VARCHAR(120)', constraints: 'NOT NULL', description: 'User full legal or display name' },
      { name: 'phone', type: 'VARCHAR(32)', constraints: 'INDEX', description: 'E.164 formatted telephone number' },
      { name: 'role', type: 'ENUM', constraints: "'CUSTOMER', 'VENDOR', 'ADMIN', 'SUPPORT'", description: 'Role-based access tier' },
      { name: 'is_email_verified', type: 'BOOLEAN', constraints: 'DEFAULT FALSE', description: 'Email verification check' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW()', description: 'User account creation timestamp' },
    ]
  },
  {
    name: 'vendors',
    storage: 'PostgreSQL',
    description: 'Registered merchant entities, commission rates, and banking payout details.',
    fields: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Vendor entity ID' },
      { name: 'user_id', type: 'UUID', constraints: 'REFERENCES users(id), INDEX', description: 'Primary owner user account' },
      { name: 'store_name', type: 'VARCHAR(150)', constraints: 'UNIQUE, NOT NULL, INDEX', description: 'Public facing storefront brand name' },
      { name: 'slug', type: 'VARCHAR(160)', constraints: 'UNIQUE, NOT NULL', description: 'SEO URL slug (e.g. /vendor/lumina-audio)' },
      { name: 'commission_rate', type: 'NUMERIC(5,2)', constraints: 'DEFAULT 10.00', description: 'Contracted platform take-rate percentage' },
      { name: 'verification_status', type: 'ENUM', constraints: "'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'", description: 'KYB verification status' },
      { name: 'stripe_connect_account_id', type: 'VARCHAR(100)', constraints: 'INDEX', description: 'Stripe Custom/Express Connect account ID' },
      { name: 'rating_average', type: 'NUMERIC(3,2)', constraints: 'DEFAULT 5.00', description: 'Aggregated vendor score (1.00 - 5.00)' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW()', description: 'Onboarding date' }
    ]
  },
  {
    name: 'products (Catalog)',
    storage: 'MongoDB',
    description: 'Polymorphic product catalog supporting flexible category attributes, variants, and AI tags.',
    fields: [
      { name: '_id', type: 'ObjectId', constraints: 'PRIMARY KEY', description: 'Unique document ID' },
      { name: 'vendor_id', type: 'UUID (String)', constraints: 'INDEX', description: 'Relational link to vendor' },
      { name: 'title', type: 'String', constraints: 'INDEX text', description: 'Localized product title' },
      { name: 'category_path', type: 'Array<String>', constraints: 'INDEX', description: 'Taxonomy path: ["Electronics", "Audio", "Headphones"]' },
      { name: 'base_price', type: 'Decimal128', constraints: 'REQUIRED', description: 'Reference baseline price in USD' },
      { name: 'variants', type: 'Array<VariantObject>', constraints: 'EMBEDDED', description: 'SKU, options (color, size, storage), price delta, barcode' },
      { name: 'attributes', type: 'Object (Key-Value)', constraints: 'FLEXIBLE', description: 'Category specific specs: { battery: "40h", weight: "250g" }' },
      { name: 'ai_tags', type: 'Array<String>', constraints: 'INDEX', description: 'Visual classification tags for semantic discovery' },
      { name: 'embedding', type: 'Array<Float>[768]', constraints: 'VECTOR INDEX', description: 'Gemini/CLIP vector embedding for semantic search' }
    ]
  },
  {
    name: 'orders',
    storage: 'PostgreSQL',
    description: 'Master order parent representing customer checkout transaction.',
    fields: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Global order reference ID' },
      { name: 'order_number', type: 'VARCHAR(32)', constraints: 'UNIQUE, NOT NULL, INDEX', description: 'Human readable reference (e.g. NXM-2026-8812)' },
      { name: 'customer_id', type: 'UUID', constraints: 'REFERENCES users(id), INDEX', description: 'Purchasing customer' },
      { name: 'total_amount', type: 'NUMERIC(12,2)', constraints: 'NOT NULL', description: 'Gross paid amount by customer' },
      { name: 'tax_amount', type: 'NUMERIC(10,2)', constraints: 'NOT NULL', description: 'Calculated sales/VAT tax' },
      { name: 'shipping_amount', type: 'NUMERIC(10,2)', constraints: 'NOT NULL', description: 'Aggregated shipping fees' },
      { name: 'payment_status', type: 'ENUM', constraints: "'PENDING', 'PAID', 'FAILED', 'REFUNDED'", description: 'Gateway charge outcome' },
      { name: 'fulfillment_status', type: 'ENUM', constraints: "'UNFULFILLED', 'PARTIALLY_FULFILLED', 'FULFILLED'", description: 'Multi-vendor fulfillment summary' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW(), INDEX', description: 'Transaction execution timestamp' }
    ]
  },
  {
    name: 'vendor_orders (Order Splits)',
    storage: 'PostgreSQL',
    description: 'Child orders partitioned per vendor for independent fulfillment, commission calculation, and payouts.',
    fields: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY', description: 'Sub-order identifier' },
      { name: 'order_id', type: 'UUID', constraints: 'REFERENCES orders(id) ON DELETE CASCADE, INDEX', description: 'Master order link' },
      { name: 'vendor_id', type: 'UUID', constraints: 'REFERENCES vendors(id), INDEX', description: 'Target vendor responsible for items' },
      { name: 'subtotal_amount', type: 'NUMERIC(12,2)', constraints: 'NOT NULL', description: 'Vendor gross item amount' },
      { name: 'platform_commission', type: 'NUMERIC(10,2)', constraints: 'NOT NULL', description: 'Retained platform revenue' },
      { name: 'vendor_net_payout', type: 'NUMERIC(12,2)', constraints: 'NOT NULL', description: 'Calculated payable amount to vendor' },
      { name: 'status', type: 'ENUM', constraints: "'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'DISPUTED'", description: 'Vendor tracking status' },
      { name: 'tracking_number', type: 'VARCHAR(100)', constraints: 'NULLABLE', description: 'Carrier tracking code (FedEx, DHL, UPS)' },
      { name: 'payout_status', type: 'ENUM', constraints: "'PENDING_ESCROW', 'TRANSFERRED', 'HELD'", description: 'Automated escrow status' }
    ]
  },
  {
    name: 'order_items',
    storage: 'PostgreSQL',
    description: 'Line item records detailing product variants, unit prices, and quantities.',
    fields: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY', description: 'Line item ID' },
      { name: 'vendor_order_id', type: 'UUID', constraints: 'REFERENCES vendor_orders(id), INDEX', description: 'Vendor sub-order link' },
      { name: 'product_id', type: 'VARCHAR(64)', constraints: 'NOT NULL', description: 'MongoDB catalog product ID' },
      { name: 'variant_sku', type: 'VARCHAR(64)', constraints: 'NOT NULL', description: 'Stock Keeping Unit identifier' },
      { name: 'unit_price', type: 'NUMERIC(10,2)', constraints: 'NOT NULL', description: 'Locked historical purchase unit price' },
      { name: 'quantity', type: 'INT', constraints: 'NOT NULL, CHECK (quantity > 0)', description: 'Item quantity ordered' }
    ]
  },
  {
    name: 'reviews',
    storage: 'PostgreSQL',
    description: 'Customer product reviews with cryptographic verified-purchase checks and media attachments.',
    fields: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY', description: 'Review ID' },
      { name: 'product_id', type: 'VARCHAR(64)', constraints: 'NOT NULL, INDEX', description: 'Target product' },
      { name: 'user_id', type: 'UUID', constraints: 'REFERENCES users(id)', description: 'Author' },
      { name: 'rating', type: 'SMALLINT', constraints: 'CHECK (rating BETWEEN 1 AND 5)', description: 'Star score' },
      { name: 'is_verified_purchase', type: 'BOOLEAN', constraints: 'DEFAULT TRUE', description: 'Cryptographically matched to delivered order' },
      { name: 'media_urls', type: 'TEXT[]', constraints: 'DEFAULT ARRAY[]::TEXT[]', description: 'Customer unboxing photos and videos' },
      { name: 'sentiment_score', type: 'NUMERIC(3,2)', constraints: 'NULLABLE', description: 'AI extracted sentiment (-1.0 to +1.0)' }
    ]
  }
];

export const SAMPLE_PRODUCTS = [
  {
    id: 'prod-001',
    title: 'Aura Sound Pro Wireless ANC Headphones',
    vendor: 'Lumina Audio Labs',
    vendorId: 'ven-101',
    price: 349.00,
    originalPrice: 399.00,
    rating: 4.9,
    reviewCount: 312,
    badge: 'Flagship Edition',
    category: 'Audio Hardware',
    image: '/src/assets/images/product_headphones_studio_1792380849129.jpg',
    inStock: 42,
    leadTime: '1-2 Days Express',
    description: 'Precision-machined aircraft grade aluminum with acoustic drivers, 48-hour battery, and adaptive hybrid noise cancellation.'
  },
  {
    id: 'prod-002',
    title: 'Chronos Horizon Titanium Automatic Watch',
    vendor: 'Vanguard Horology',
    vendorId: 'ven-102',
    price: 880.00,
    originalPrice: 950.00,
    rating: 5.0,
    reviewCount: 88,
    badge: 'Limited Run of 500',
    category: 'Watches & Precision',
    image: '/src/assets/images/product_mechanical_watch_1792380849996.jpg',
    inStock: 14,
    leadTime: 'Same Day Dispatch',
    description: 'Grade 5 brushed titanium case, exhibition sapphire caseback, custom Swiss-engineered mechanical movement with 70h power reserve.'
  },
  {
    id: 'prod-003',
    title: 'Hygge Arch Smart Ambient Desk Luminaire',
    vendor: 'Nordic Craft Collective',
    vendorId: 'ven-103',
    price: 210.00,
    originalPrice: 240.00,
    rating: 4.8,
    reviewCount: 154,
    badge: 'Architectural Choice',
    category: 'Interior & Lighting',
    image: '/src/assets/images/product_smart_lamp_1792380850295.jpg',
    inStock: 63,
    leadTime: '2-3 Days Standard',
    description: 'Satin brushed brass frame paired with hand-blown opaline glass. Seamless IoT touch controls with circadian rhythm daylight sync.'
  }
];

export const ROADMAP_PHASES = [
  {
    phase: 'Phase 1: MVP & Core Transaction Engine',
    timeline: 'Months 1 - 3',
    status: 'Ready for Deployment',
    focus: 'Fast Market Validation & Bulletproof Checkout',
    deliverables: [
      'Next.js 15 SSR storefront with sub-second page loads & static ISR product caching.',
      'Modular monolithic backend in NestJS / PostgreSQL with strict ACID order states.',
      'Multi-vendor cart split logic: single customer checkout automatically splits into vendor sub-orders.',
      'Stripe Connect Express integration for compliant marketplace seller onboarding & escrow payouts.',
      'Algolia / OpenSearch fuzzy autocomplete catalog index with faceted filtering.'
    ]
  },
  {
    phase: 'Phase 2: Vendor Automation & Platform Flywheel',
    timeline: 'Months 4 - 6',
    status: 'Architecture Engineered',
    focus: 'Seller Scale, Logistics & Dispute Governance',
    deliverables: [
      'Self-service Vendor Central portal with real-time sales telemetry, SKU matrix, and order fulfillment.',
      'Automated Invoicing & Tax engine (Stripe Tax / Avalara compliance) with 1-click vendor settlement statements.',
      'Integrated carrier APIs (FedEx, DHL Express, Shippo) for automated shipping label generation and webhook tracking.',
      'AI Vendor Studio: automated background removal, resolution upscaling, and catalog copy optimization.',
      'Super Admin moderation dashboard with KYC/KYB approval workflows and dispute resolution ledger.'
    ]
  },
  {
    phase: 'Phase 3: Hyper-Scale, AI Personalization & Mobile',
    timeline: 'Months 7 - 12',
    status: 'Long-term Roadmap',
    focus: 'Global Elastic Scale, Social Commerce & Native Apps',
    deliverables: [
      'Microservices decomposition: orders & payments decoupled into Go microservices handling 50k+ RPS.',
      'Kafka / Redpanda event streaming pipeline for distributed CDC, analytics, and event sourcing.',
      'Personalized AI discovery feed powered by vector embeddings and contextual reinforcement learning.',
      'Live Video Selling & Social Commerce streaming channel with interactive real-time buy overlays.',
      'Native Cross-Platform Mobile Applications (Flutter / React Native) with biometrics 1-Click Pay & push alerts.'
    ]
  }
];
