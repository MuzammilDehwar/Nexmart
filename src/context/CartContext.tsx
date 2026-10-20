import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { ProductData, ProductVariantData } from '../components/nextjs14/ProductCard';
import { SAMPLE_NEXTJS_PRODUCTS } from '../data/sampleProducts';
import { 
  db, 
  isFirebaseConfigured, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot,
  updateDoc,
  query,
  where,
  limit
} from '../lib/firebase';

const isFirestoreSyncEnabled = import.meta.env.VITE_FIREBASE_ENABLE_FIRESTORE_SYNC === 'true';

export type OrderStatus = 'Ordered' | 'Packed' | 'Shipped' | 'Delivered';
export type AppTab = 'mvp' | 'blueprint' | 'customer' | 'vendor' | 'admin' | 'schema';

export interface CartItem {
  product: ProductData;
  variant: ProductVariantData;
  quantity: number;
}

export interface VendorPackage {
  vendorName: string;
  vendorSlug: string;
  items: CartItem[];
  subtotal: number;
  trackingNumber: string;
  courier: string;
  estimatedDelivery: string;
  status: OrderStatus;
  statusUpdatedAt: string;
}

export interface Order {
  id: string;
  customerId?: string;
  vendorUids?: string[];
  vendorSlugs?: string[];
  createdAt: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: 'stripe' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cod' | 'bnpl';
  paymentReference?: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  overallStatus: OrderStatus;
  vendorPackages: VendorPackage[];
}

interface CartContextType {
  products: ProductData[];
  addProduct: (newProduct: ProductData) => void;
  cart: CartItem[];
  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  updateQuantity: (productId: string, variantId: string, delta: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  cartTax: number;
  cartShipping: number;
  cartTotal: number;
  // Navigation helper for interactive demo
  currentView: 'home' | 'product-detail' | 'checkout' | 'order-success' | 'orders' | 'wishlist';
  setCurrentView: (view: 'home' | 'product-detail' | 'checkout' | 'order-success' | 'orders' | 'wishlist') => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  lastCompletedOrderNumber: string | null;
  setLastCompletedOrderNumber: (num: string | null) => void;
  // Global tab navigation helper for vendor -> storefront jump
  onNavigateToTab?: (tab: AppTab) => void;
  setOnNavigateToTab: (fn: (tab: AppTab) => void) => void;
  // Product Moderation & Governance
  approveProduct: (productId: string) => void;
  rejectProduct: (productId: string, reason?: string) => void;
  // Marketplace Commission & Platform GMV
  marketplaceCommissionRate: number;
  setMarketplaceCommissionRate: (rate: number) => void;
  platformGmv: number;
  platformCommissionEarned: number;
  vendorPayoutsTotal: number;
  // Order Management
  orders: Order[];
  productSyncState: 'demo' | 'loading' | 'live' | 'empty' | 'permission-denied' | 'offline';
  orderSyncState: 'demo' | 'signed-out' | 'loading' | 'live' | 'empty' | 'permission-denied' | 'offline';
  placeOrder: (
    shippingAddress: Order['shippingAddress'],
    paymentMethod: Order['paymentMethod'],
    paymentReference?: string
  ) => Order;
  updateOrderStatus: (orderId: string, vendorName: string, newStatus: OrderStatus) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Demo-only, browser-local persistence. This is not a secure database or a cross-device sync layer.
const STORAGE_KEYS = {
  cart: 'nexmart.demo.cart.v1',
  products: 'nexmart.demo.products.v1',
  orders: 'nexmart.demo.orders.v1',
  lastOrder: 'nexmart.demo.lastOrder.v1',
} as const;

function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[Nexmart] Could not read local demo data for ${key}. Using defaults.`, error);
    return fallback;
  }
}

function writeStoredValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Storage may be disabled or full; the in-memory app should still work.
    console.warn(`[Nexmart] Could not save local demo data for ${key}.`, error);
  }
}

// Initial Seed Orders so "My Orders" has rich data out of the box
const INITIAL_ORDERS: Order[] = [
  {
    id: 'NXM-2026-9104',
    createdAt: 'Oct 17, 2026 · 14:22 PM',
    customerName: 'Julian Vance',
    customerEmail: 'julian.vance@example.com',
    shippingAddress: {
      fullName: 'Julian Vance',
      street: '742 Montgomery Street, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94111',
      country: 'United States',
      phone: '+1 (415) 890-2194',
    },
    paymentMethod: 'stripe',
    items: [
      {
        product: SAMPLE_NEXTJS_PRODUCTS[0], // Lumina headphones
        variant: SAMPLE_NEXTJS_PRODUCTS[0].variants[0],
        quantity: 1,
      },
      {
        product: SAMPLE_NEXTJS_PRODUCTS[2], // Nordic lamp
        variant: SAMPLE_NEXTJS_PRODUCTS[2].variants[0],
        quantity: 1,
      },
    ],
    subtotal: 559.00,
    tax: 44.72,
    shipping: 0,
    total: 603.72,
    overallStatus: 'Shipped',
    vendorPackages: [
      {
        vendorName: 'Lumina Audio Labs',
        vendorSlug: 'lumina-audio',
        items: [
          {
            product: SAMPLE_NEXTJS_PRODUCTS[0],
            variant: SAMPLE_NEXTJS_PRODUCTS[0].variants[0],
            quantity: 1,
          },
        ],
        subtotal: 349.00,
        trackingNumber: 'FDX-882194-EX',
        courier: 'FedEx Priority',
        estimatedDelivery: 'Tomorrow, Oct 19 by 8:00 PM',
        status: 'Shipped',
        statusUpdatedAt: 'Today at 09:14 AM',
      },
      {
        vendorName: 'Nordic Craft Collective',
        vendorSlug: 'nordic-craft',
        items: [
          {
            product: SAMPLE_NEXTJS_PRODUCTS[2],
            variant: SAMPLE_NEXTJS_PRODUCTS[2].variants[0],
            quantity: 1,
          },
        ],
        subtotal: 210.00,
        trackingNumber: 'DHL-710492-US',
        courier: 'DHL Express',
        estimatedDelivery: 'Delivered Oct 18',
        status: 'Delivered',
        statusUpdatedAt: 'Yesterday at 16:45 PM',
      },
    ],
  },
  {
    id: 'NXM-2026-8319',
    createdAt: 'Oct 14, 2026 · 10:15 AM',
    customerName: 'Julian Vance',
    customerEmail: 'julian.vance@example.com',
    shippingAddress: {
      fullName: 'Julian Vance',
      street: '742 Montgomery Street, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94111',
      country: 'United States',
      phone: '+1 (415) 890-2194',
    },
    paymentMethod: 'stripe',
    items: [
      {
        product: SAMPLE_NEXTJS_PRODUCTS[1], // Vanguard watch
        variant: SAMPLE_NEXTJS_PRODUCTS[1].variants[0],
        quantity: 1,
      },
    ],
    subtotal: 880.00,
    tax: 70.40,
    shipping: 0,
    total: 950.40,
    overallStatus: 'Delivered',
    vendorPackages: [
      {
        vendorName: 'Vanguard Horology',
        vendorSlug: 'vanguard-horology',
        items: [
          {
            product: SAMPLE_NEXTJS_PRODUCTS[1],
            variant: SAMPLE_NEXTJS_PRODUCTS[1].variants[0],
            quantity: 1,
          },
        ],
        subtotal: 880.00,
        trackingNumber: 'UPS-193481-INS',
        courier: 'UPS Insured Direct',
        estimatedDelivery: 'Delivered Oct 16',
        status: 'Delivered',
        statusUpdatedAt: 'Oct 16 at 11:20 AM',
      },
    ],
  },
];

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: authUser, role: authRole, firebaseUser } = useAuth();
  const [products, setProducts] = useState<ProductData[]>(() => readStoredValue(STORAGE_KEYS.products, SAMPLE_NEXTJS_PRODUCTS));
  const [navigateTabFn, setNavigateTabFn] = useState<((tab: AppTab) => void) | undefined>(undefined);

  // Restore demo cart if available; otherwise retain the original sample cart for first-time visitors.
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = readStoredValue<CartItem[] | null>(STORAGE_KEYS.cart, null);
    if (Array.isArray(storedCart)) return storedCart.filter((item) => item && item.product && item.variant && Number.isFinite(item.quantity) && item.quantity > 0);
    const p1 = SAMPLE_NEXTJS_PRODUCTS[0];
    const v1 = p1.variants[0];
    return [{ product: p1, variant: v1, quantity: 1 }];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const storedOrders = readStoredValue<Order[] | null>(STORAGE_KEYS.orders, null);
    return Array.isArray(storedOrders) ? storedOrders : INITIAL_ORDERS;
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'product-detail' | 'checkout' | 'order-success' | 'orders' | 'wishlist'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-001');
  const [lastCompletedOrderNumber, setLastCompletedOrderNumber] = useState<string | null>(() => readStoredValue<string | null>(STORAGE_KEYS.lastOrder, null));
  const [productSyncState, setProductSyncState] = useState<CartContextType['productSyncState']>(firebaseUser ? 'loading' : 'demo');
  const [orderSyncState, setOrderSyncState] = useState<CartContextType['orderSyncState']>(firebaseUser ? 'loading' : 'demo');
  const [marketplaceCommissionRate, setMarketplaceCommissionRate] = useState<number>(0.05); // 5% marketplace commission

  // Persist only demo storefront state on this browser/device. Never store credentials or payment details here.
  useEffect(() => writeStoredValue(STORAGE_KEYS.cart, cart), [cart]);
  useEffect(() => writeStoredValue(STORAGE_KEYS.products, products), [products]);
  useEffect(() => writeStoredValue(STORAGE_KEYS.orders, orders), [orders]);
  useEffect(() => writeStoredValue(STORAGE_KEYS.lastOrder, lastCompletedOrderNumber), [lastCompletedOrderNumber]);

  // Firestore synchronizers deliberately use queries that prove ownership to the rules.
  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setProductSyncState('demo');
      setOrderSyncState('demo');
      return;
    }

    if (firebaseUser && authUser?.authSource === 'firebase') {
      // Never show browser-local/demo orders inside a real Firebase session.
      setOrders([]);
    }

    // Firebase Auth can be used independently from Firestore. Keep listeners disabled
    // until the reviewed firestore.rules file has been deployed to the same project;
    // this prevents permission-denied loops and preserves the local catalogue.
    if (!isFirestoreSyncEnabled) {
      setProductSyncState('demo');
      setOrderSyncState(firebaseUser ? 'signed-out' : 'demo');
      return;
    }

    let active = true;
    setProductSyncState('loading');
    const mergeProducts = (remoteProducts: ProductData[]) => {
      if (!active) return;
      const byId = new Map<string, ProductData>(SAMPLE_NEXTJS_PRODUCTS.map((product) => [product.id, product]));
      remoteProducts.forEach((product) => byId.set(product.id, product));
      setProducts(Array.from(byId.values()));
    };
    const syncError = (error: { code?: string; message?: string }, kind: 'products' | 'orders') => {
      const state = error.code === 'permission-denied' ? 'permission-denied' : 'offline';
      if (kind === 'products') setProductSyncState(state);
      else {
        setOrders([]);
        setOrderSyncState(state);
      }
      console.info(`[NexMart Firebase] ${kind} synchronization ${state}. Check firestore.rules deployment and VITE_FIREBASE_ENABLE_FIRESTORE_SYNC.`, error.message || error.code || error);
    };

    const unsubPublicProducts = onSnapshot(
      query(collection(db, 'products'), where('approvalStatus', '==', 'approved')),
      (snapshot) => {
        mergeProducts(snapshot.docs.map((item) => item.data() as ProductData));
        setProductSyncState(snapshot.empty ? 'empty' : 'live');
      },
      (error) => syncError(error, 'products'),
    );

    let unsubPrivateProducts = () => {};
    if (firebaseUser && authRole === 'admin') {
      unsubPrivateProducts = onSnapshot(
        collection(db, 'products'),
        (snapshot) => mergeProducts(snapshot.docs.map((item) => item.data() as ProductData)),
        (error) => syncError(error, 'products'),
      );
    } else if (firebaseUser && authRole === 'vendor') {
      unsubPrivateProducts = onSnapshot(
        query(collection(db, 'products'), where('vendorUid', '==', firebaseUser.uid)),
        (snapshot) => mergeProducts(snapshot.docs.map((item) => item.data() as ProductData)),
        (error) => syncError(error, 'products'),
      );
    }

    let unsubOrders = () => {};
    if (!firebaseUser) {
      if (authUser?.authSource !== 'demo') {
        setOrders([]);
        setOrderSyncState('signed-out');
      } else {
        setOrderSyncState('demo');
      }
    } else {
      setOrderSyncState('loading');
      const ordersQuery = authRole === 'admin'
        ? query(collection(db, 'orders'), limit(100))
        : authRole === 'vendor'
          ? query(collection(db, 'vendor_orders', firebaseUser.uid, 'orders'), limit(100))
          : query(collection(db, 'orders'), where('customerId', '==', firebaseUser.uid), limit(50));
      unsubOrders = onSnapshot(
        ordersQuery,
        (snapshot) => {
          if (!active) return;
          setOrders(snapshot.docs.map((item) => item.data() as Order));
          setOrderSyncState(snapshot.empty ? 'empty' : 'live');
        },
        (error) => syncError(error, 'orders'),
      );
    }

    return () => {
      active = false;
      unsubPublicProducts();
      unsubPrivateProducts();
      unsubOrders();
    };
  }, [authRole, authUser?.authSource, firebaseUser?.uid]);
  const addProduct = (newProduct: ProductData) => {
    const productWithStatus: ProductData = {
      ...newProduct,
      approvalStatus: newProduct.approvalStatus || 'pending',
    };
    const isDemoSession = !firebaseUser || authUser?.authSource === 'demo';
    if (isDemoSession) {
      setProducts((prev) => [productWithStatus, ...prev]);
    } else if (isFirestoreSyncEnabled && db && authRole === 'vendor') {
      setDoc(doc(db, 'products', productWithStatus.id), {
        ...productWithStatus,
        vendorUid: firebaseUser.uid,
        approvalStatus: 'pending',
      }).catch((err) => console.warn('[NexMart Firebase] product create failed:', err));
    }
  };

  const approveProduct = (productId: string) => {
    if (!firebaseUser || authUser?.authSource === 'demo') {
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, approvalStatus: 'approved', rejectionReason: undefined } : p)));
    } else if (isFirestoreSyncEnabled && db && authRole === 'admin') {
      updateDoc(doc(db, 'products', productId), { approvalStatus: 'approved', rejectionReason: null }).catch((err) => {
        console.warn('[NexMart Firebase] product approval failed:', err);
      });
    }
  };

  const rejectProduct = (productId: string, reason: string = 'Violates platform catalog guidelines') => {
    if (!firebaseUser || authUser?.authSource === 'demo') {
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, approvalStatus: 'rejected', rejectionReason: reason } : p)));
    } else if (isFirestoreSyncEnabled && db && authRole === 'admin') {
      updateDoc(doc(db, 'products', productId), { approvalStatus: 'rejected', rejectionReason: reason }).catch((err) => {
        console.warn('[NexMart Firebase] product rejection failed:', err);
      });
    }
  };
  // Dynamic GMV calculations across all platform orders + base volume
  const ordersTotalGross = orders.reduce((sum, ord) => sum + ord.total, 0);
  const baseHistoricalGmv = 148920.00;
  const platformGmv = Math.round((baseHistoricalGmv + ordersTotalGross) * 100) / 100;
  const platformCommissionEarned = Math.round((platformGmv * marketplaceCommissionRate) * 100) / 100;
  const vendorPayoutsTotal = Math.round((platformGmv - platformCommissionEarned) * 100) / 100;

  const addToCart = (productId: string, variantId: string, quantity: number = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === productId && item.variant.id === variant.id
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      }

      return [...prev, { product, variant, quantity }];
    });

    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (productId: string, variantId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.variant.id === variantId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.variant.id === variantId))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);
  const cartTax = Math.round(cartSubtotal * 0.08 * 100) / 100; // 8% estimated tax
  const cartShipping = cartSubtotal > 150 || cartSubtotal === 0 ? 0 : 15.0; // Free shipping over $150
  const cartTotal = cartSubtotal + cartTax + cartShipping;

  // Place order from checkout
  const placeOrder = (
    shippingAddress: Order['shippingAddress'],
    paymentMethod: Order['paymentMethod'],
    paymentReference?: string
  ): Order => {
    const newOrderId = `NXM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateFormatted = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Group items by vendor to create independent vendor packages
    const vendorMap: { [storeName: string]: CartItem[] } = {};
    cart.forEach((item) => {
      const vName = item.product.storeName;
      if (!vendorMap[vName]) vendorMap[vName] = [];
      vendorMap[vName].push(item);
    });

    const vendorPackages: VendorPackage[] = Object.entries(vendorMap).map(([vName, items], index) => {
      const pkgSubtotal = items.reduce((acc, i) => acc + i.variant.price * i.quantity, 0);
      const trackingSuffix = Math.floor(100000 + Math.random() * 900000);
      const courier = index % 2 === 0 ? 'FedEx Priority Express' : 'DHL Express Carrier';
      const estDays = index === 0 ? 'Tomorrow by 7:00 PM' : '2-3 Business Days';

      return {
        vendorName: vName,
        vendorSlug: items[0]?.product.storeSlug || vName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        items,
        subtotal: pkgSubtotal,
        trackingNumber: `${index % 2 === 0 ? 'FDX' : 'DHL'}-${trackingSuffix}`,
        courier,
        estimatedDelivery: estDays,
        status: 'Ordered',
        statusUpdatedAt: 'Just now',
      };
    });

    const vendorUids = Array.from(new Set(cart.map((item) => item.product.vendorUid).filter((value): value is string => Boolean(value))));
    const vendorSlugs = Array.from(new Set(vendorPackages.map((pkg) => pkg.vendorSlug).filter(Boolean)));
    const newOrder: Order = {
      id: newOrderId,
      customerId: firebaseUser?.uid || authUser?.id || 'demo-customer',
      vendorUids,
      vendorSlugs,
      createdAt: dateFormatted,
      customerName: shippingAddress.fullName || authUser?.name || 'Julian Vance',
      customerEmail: firebaseUser?.email || authUser?.email || 'julian.vance@example.com',
      shippingAddress,
      paymentMethod,
      paymentReference,
      paymentStatus: 'pending',
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      shipping: cartShipping,
      total: cartTotal,
      overallStatus: 'Ordered',
      vendorPackages,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastCompletedOrderNumber(newOrderId);
    clearCart();

    // Phase 1 keeps order creation browser-local. A future trusted server
    // function must calculate totals, reserve inventory, and verify payment
    // before writing an order; browser-supplied financial fields are untrusted.

    return newOrder;
  };

  // Vendor or platform status update
  const updateOrderStatus = (orderId: string, vendorName: string, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id !== orderId) return ord;

        const updatedPackages = ord.vendorPackages.map((pkg) => {
          if (vendorName === 'ALL' || pkg.vendorName.toLowerCase() === vendorName.toLowerCase()) {
            return {
              ...pkg,
              status: newStatus,
              statusUpdatedAt: 'Updated just now',
            };
          }
          return pkg;
        });

        // Determine overall order status based on packages
        const allDelivered = updatedPackages.every((p) => p.status === 'Delivered');
        const anyShipped = updatedPackages.some((p) => p.status === 'Shipped');
        const anyPacked = updatedPackages.some((p) => p.status === 'Packed');

        let nextOverall: OrderStatus = 'Ordered';
        if (allDelivered) nextOverall = 'Delivered';
        else if (anyShipped) nextOverall = 'Shipped';
        else if (anyPacked) nextOverall = 'Packed';

        return {
          ...ord,
          overallStatus: nextOverall,
          vendorPackages: updatedPackages,
        };
      })
    );
  };

  return (
    <CartContext.Provider
      value={{
        products,
        addProduct,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartCount,
        cartSubtotal,
        cartTax,
        cartShipping,
        cartTotal,
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        lastCompletedOrderNumber,
        setLastCompletedOrderNumber,
        onNavigateToTab: navigateTabFn,
        setOnNavigateToTab: setNavigateTabFn,
        orders,
        productSyncState,
        orderSyncState,
        placeOrder,
        updateOrderStatus,
        approveProduct,
        rejectProduct,
        marketplaceCommissionRate,
        setMarketplaceCommissionRate,
        platformGmv,
        platformCommissionEarned,
        vendorPayoutsTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
