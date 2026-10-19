export const PRISMA_SCHEMA_CODE = `// This is your Prisma schema file for NexMart Phase 1 (MVP)
// Multi-Vendor E-Commerce Marketplace
// Database: PostgreSQL 16 (Compatible with AWS Aurora, Supabase, Neon)

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearchPostgres"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --------------------------------------------------------
// ENUMS
// --------------------------------------------------------

enum Role {
  CUSTOMER
  VENDOR
  ADMIN
  SUPPORT
}

enum StoreStatus {
  PENDING
  VERIFIED
  SUSPENDED
  REJECTED
}

enum OrderStatus {
  PENDING_PAYMENT
  PAID
  PROCESSING
  PARTIALLY_SHIPPED
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum StoreOrderStatus {
  PROCESSING
  PACKED
  SHIPPED
  DELIVERED
  DISPUTED
  CANCELLED
}

enum PaymentStatus {
  UNPAID
  AUTHORIZED
  CAPTURED
  FAILED
  REFUNDED
}

enum PaymentMethod {
  STRIPE
  PAYPAL
  KLARNA_BNPL
  APPLE_PAY
  CASH_ON_DELIVERY
}

enum PayoutStatus {
  PENDING_ESCROW
  TRANSFERRED
  HELD
}

// --------------------------------------------------------
// USER & IDENTITY
// --------------------------------------------------------

model User {
  id                String       @id @default(uuid()) @db.Uuid
  email             String       @unique @db.VarChar(255)
  passwordHash      String       @map("password_hash") @db.VarChar(255)
  fullName          String       @map("full_name") @db.VarChar(120)
  phone             String?      @db.VarChar(32)
  avatarUrl         String?      @map("avatar_url") @db.Text
  role              Role         @default(CUSTOMER)
  isEmailVerified   Boolean      @default(false) @map("is_email_verified")
  createdAt         DateTime     @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime     @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  store             Store?
  orders            Order[]      @relation("CustomerOrders")
  reviews           Review[]
  addresses         Address[]

  @@index([email])
  @@index([role])
  @@map("users")
}

model Address {
  id           String   @id @default(uuid()) @db.Uuid
  userId       String   @map("user_id") @db.Uuid
  recipient    String   @db.VarChar(120)
  street       String   @db.VarChar(255)
  apartment    String?  @db.VarChar(100)
  city         String   @db.VarChar(100)
  state        String   @db.VarChar(100)
  postalCode   String   @map("postal_code") @db.VarChar(20)
  country      String   @default("US") @db.VarChar(2)
  phone        String   @db.VarChar(32)
  isDefault    Boolean  @default(false) @map("is_default")
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  orders       Order[]

  @@index([userId])
  @@map("addresses")
}

// --------------------------------------------------------
// VENDOR & STOREFRONT
// --------------------------------------------------------

model Store {
  id                   String       @id @default(uuid()) @db.Uuid
  userId               String       @unique @map("user_id") @db.Uuid
  name                 String       @unique @db.VarChar(150)
  slug                 String       @unique @db.VarChar(160)
  description          String?      @db.Text
  logoUrl              String?      @map("logo_url") @db.Text
  bannerUrl            String?      @map("banner_url") @db.Text
  commissionRate       Decimal      @default(10.00) @map("commission_rate") @db.Decimal(5, 2)
  status               StoreStatus  @default(PENDING)
  taxId                String?      @map("tax_id") @db.VarChar(50)
  stripeAccountId      String?      @map("stripe_account_id") @db.VarChar(100)
  ratingAverage        Decimal      @default(5.00) @map("rating_average") @db.Decimal(3, 2)
  ratingCount          Int          @default(0) @map("rating_count")
  createdAt            DateTime     @default(now()) @map("created_at") @db.Timestamptz
  updatedAt            DateTime     @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  user                 User         @relation(fields: [userId], references: [id], onDelete: Restrict)
  products             Product[]
  storeOrders          StoreOrder[]

  @@index([slug])
  @@index([status])
  @@map("stores")
}

// --------------------------------------------------------
// CATEGORIES & TAXONOMY
// --------------------------------------------------------

model Category {
  id          String     @id @default(uuid()) @db.Uuid
  parentId    String?    @map("parent_id") @db.Uuid
  name        String     @db.VarChar(100)
  slug        String     @unique @db.VarChar(120)
  description String?    @db.Text
  imageUrl    String?    @map("image_url") @db.Text
  sortOrder   Int        @default(0) @map("sort_order")
  isActive    Boolean    @default(true) @map("is_active")
  createdAt   DateTime   @default(now()) @map("created_at") @db.Timestamptz

  // Hierarchy relations
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]

  @@index([parentId])
  @@index([slug])
  @@map("categories")
}

// --------------------------------------------------------
// PRODUCTS & VARIANTS
// --------------------------------------------------------

model Product {
  id              String           @id @default(uuid()) @db.Uuid
  storeId         String           @map("store_id") @db.Uuid
  categoryId      String           @map("category_id") @db.Uuid
  title           String           @db.VarChar(255)
  slug            String           @unique @db.VarChar(280)
  description     String           @db.Text
  brand           String?          @db.VarChar(100)
  basePrice       Decimal          @map("base_price") @db.Decimal(12, 2)
  compareAtPrice  Decimal?         @map("compare_at_price") @db.Decimal(12, 2)
  isPublished     Boolean          @default(true) @map("is_published")
  isFeatured      Boolean          @default(false) @map("is_featured")
  ratingAverage   Decimal          @default(0.00) @map("rating_average") @db.Decimal(3, 2)
  ratingCount     Int              @default(0) @map("rating_count")
  images          String[]         @default([]) @map("images")
  createdAt       DateTime         @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime         @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  store           Store            @relation(fields: [storeId], references: [id], onDelete: Cascade)
  category        Category         @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  variants        ProductVariant[]
  reviews         Review[]

  @@index([storeId])
  @@index([categoryId])
  @@index([isPublished])
  @@index([basePrice])
  @@map("products")
}

model ProductVariant {
  id            String      @id @default(uuid()) @db.Uuid
  productId     String      @map("product_id") @db.Uuid
  sku           String      @unique @db.VarChar(64)
  title         String      @db.VarChar(150) // e.g. "Space Gray / 256GB"
  price         Decimal     @db.Decimal(12, 2)
  inventoryQty  Int         @default(0) @map("inventory_qty")
  barcode       String?     @db.VarChar(64)
  imageUrl      String?     @map("image_url") @db.Text
  options       Json        @default("{}") // e.g. {"color": "Space Gray", "storage": "256GB"}
  createdAt     DateTime    @default(now()) @map("created_at") @db.Timestamptz
  updatedAt     DateTime    @updatedAt @map("updated_at") @db.Timestamptz

  product       Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  orderItems    OrderItem[]

  @@index([productId])
  @@index([sku])
  @@map("product_variants")
}

// --------------------------------------------------------
// ORDERS & MULTI-VENDOR SPLITTING
// --------------------------------------------------------

model Order {
  id                String         @id @default(uuid()) @db.Uuid
  orderNumber       String         @unique @map("order_number") @db.VarChar(32)
  customerId        String         @map("customer_id") @db.Uuid
  shippingAddressId String         @map("shipping_address_id") @db.Uuid
  totalAmount       Decimal        @map("total_amount") @db.Decimal(12, 2)
  subtotalAmount    Decimal        @map("subtotal_amount") @db.Decimal(12, 2)
  taxAmount         Decimal        @default(0.00) @map("tax_amount") @db.Decimal(10, 2)
  shippingAmount    Decimal        @default(0.00) @map("shipping_amount") @db.Decimal(10, 2)
  discountAmount    Decimal        @default(0.00) @map("discount_amount") @db.Decimal(10, 2)
  orderStatus       OrderStatus    @default(PENDING_PAYMENT) @map("order_status")
  paymentStatus     PaymentStatus  @default(UNPAID) @map("payment_status")
  paymentMethod     PaymentMethod  @map("payment_method")
  paymentIntentId   String?        @map("payment_intent_id") @db.VarChar(120)
  createdAt         DateTime       @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime       @updatedAt @map("updated_at") @db.Timestamptz

  customer          User           @relation("CustomerOrders", fields: [customerId], references: [id], onDelete: Restrict)
  shippingAddress   Address        @relation(fields: [shippingAddressId], references: [id], onDelete: Restrict)
  storeOrders       StoreOrder[]
  reviews           Review[]

  @@index([customerId])
  @@index([orderNumber])
  @@index([orderStatus])
  @@map("orders")
}

// Sub-order partitioned per vendor for independent shipping, escrow & commissions
model StoreOrder {
  id                 String           @id @default(uuid()) @db.Uuid
  orderId            String           @map("order_id") @db.Uuid
  storeId            String           @map("store_id") @db.Uuid
  subtotalAmount     Decimal          @map("subtotal_amount") @db.Decimal(12, 2)
  platformCommission Decimal          @map("platform_commission") @db.Decimal(10, 2)
  storeNetPayout     Decimal          @map("store_net_payout") @db.Decimal(12, 2)
  status             StoreOrderStatus @default(PROCESSING)
  trackingNumber     String?          @map("tracking_number") @db.VarChar(100)
  carrierCode        String?          @map("carrier_code") @db.VarChar(50) // e.g. "fedex", "dhl", "ups"
  payoutStatus       PayoutStatus     @default(PENDING_ESCROW) @map("payout_status")
  createdAt          DateTime         @default(now()) @map("created_at") @db.Timestamptz
  updatedAt          DateTime         @updatedAt @map("updated_at") @db.Timestamptz

  order              Order            @relation(fields: [orderId], references: [id], onDelete: Cascade)
  store              Store            @relation(fields: [storeId], references: [id], onDelete: Restrict)
  orderItems         OrderItem[]

  @@index([orderId])
  @@index([storeId])
  @@index([status])
  @@map("store_orders")
}

model OrderItem {
  id           String         @id @default(uuid()) @db.Uuid
  storeOrderId String         @map("store_order_id") @db.Uuid
  variantId    String         @map("variant_id") @db.Uuid
  unitPrice    Decimal        @map("unit_price") @db.Decimal(12, 2)
  quantity     Int
  totalPrice   Decimal        @map("total_price") @db.Decimal(12, 2)

  storeOrder   StoreOrder     @relation(fields: [storeOrderId], references: [id], onDelete: Cascade)
  variant      ProductVariant @relation(fields: [variantId], references: [id], onDelete: Restrict)

  @@index([storeOrderId])
  @@index([variantId])
  @@map("order_items")
}

// --------------------------------------------------------
// REVIEWS (VERIFIED PURCHASES)
// --------------------------------------------------------

model Review {
  id                 String   @id @default(uuid()) @db.Uuid
  productId          String   @map("product_id") @db.Uuid
  userId             String   @map("user_id") @db.Uuid
  orderId            String?  @map("order_id") @db.Uuid
  rating             Int      @db.SmallInt // 1 to 5
  title              String   @db.VarChar(200)
  body               String   @db.Text
  isVerifiedPurchase Boolean  @default(true) @map("is_verified_purchase")
  mediaUrls          String[] @default([]) @map("media_urls")
  createdAt          DateTime @default(now()) @map("created_at") @db.Timestamptz

  product            Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  order              Order?   @relation(fields: [orderId], references: [id], onDelete: SetNull)

  @@index([productId])
  @@index([userId])
  @@map("reviews")
}
`;
